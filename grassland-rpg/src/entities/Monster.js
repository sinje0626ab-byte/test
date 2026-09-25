import * as THREE from 'three';
import { rand } from '../utils/random.js';
import { createMonsterModel } from './MonsterModel.js';
import { nightLook } from './monsterKit.js';
import { HpBar } from './HpBar.js';
import { BEHAVIORS } from './behaviors/index.js';

const NIGHT_GLOW = new THREE.Color(0.015, 0.01, 0.035);
const ELITE_GLOW = new THREE.Color(0.32, 0.23, 0.04);

const tmp = new THREE.Vector3();

// 필드 몬스터. 행동(AI)은 def.behavior 모듈(entities/behaviors)이 정한다.
export class Monster {
  constructor(ctx, type, position) {
    this.ctx = ctx;
    this.type = type;
    this.def = ctx.data.monsters[type];
    const d = this.def;
    this.stats = { maxHp: d.hp, hp: d.hp, attack: d.attack, defense: d.defense, attackRange: d.attackRange };
    this.radius = d.radius;
    this.position = position.clone();
    this.home = position.clone();
    this.target = null;
    this.facing = new THREE.Vector3(rand.range(-1, 1), 0, rand.range(-1, 1)).normalize();
    this.knock = new THREE.Vector3();

    this.alive = true;
    this.done = false;
    this.state = 'wander';
    this.stateTime = 0;
    this.pause = rand.range(d.wanderPauseMin, d.wanderPauseMax);
    this.cooldown = 0;
    this.attacked = false;
    this.hasFled = false;
    this.flash = 0;
    this.hopPhase = rand.range(0, Math.PI * 2);
    this.hpBarTimer = 0;
    this.speedMult = 1;
    this.untargetable = false; // 땅속에 숨었을 때 등
    this.bs = {}; // 행동 모듈이 쓰는 상태

    this.buildMesh();
    this.behavior = BEHAVIORS[d.behavior] ?? BEHAVIORS.melee;
    this.behavior.init?.(this);
  }

  // 정예: 크고 강하고 금빛 (config.elite)
  makeElite(cfg) {
    this.elite = true;
    const s = this.stats;
    s.maxHp = Math.round(s.maxHp * cfg.hp);
    s.hp = s.maxHp;
    s.attack = Math.round(s.attack * cfg.attack);
    this.radius *= cfg.scale;
    this.mesh.scale.setScalar(cfg.scale);
  }

  buildMesh() {
    const model = createMonsterModel(this.def, this.type);
    this.model = model;
    this.body = model.body;
    this.mat = model.mat;
    this.extraMats = model.extraMats;
    this.eyeMat = model.eyeMat;
    const outer = new THREE.Group();
    outer.add(this.body);
    // 나는 몬스터: 바닥 그림자 원
    if (this.def.flier) {
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(this.def.radius * 0.9, 16).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }),
      );
      shadow.position.y = 0.04;
      outer.add(shadow);
    }

    // 체력바 (맞았을 때만 잠깐 보인다)
    this.hpBar = new HpBar(0.9);
    this.hpBar.group.position.y = this.def.radius * 2 + 0.35;
    outer.add(this.hpBar.group);

    this.mesh = outer;
    this.ctx.scene.add(outer);
    this.mesh.position.copy(this.position);
  }

  setOpacity(o) {
    this.mat.opacity = o;
    for (const m of this.extraMats) m.opacity = o;
  }

  // 밤에 태어난 몬스터·날짜가 지난 습격 몬스터를 강하게 만든다.
  scaleStats(mult) {
    const s = this.stats;
    s.maxHp = Math.round(s.maxHp * mult);
    s.hp = s.maxHp;
    s.attack = Math.round(s.attack * mult);
    this.statMult = (this.statMult ?? 1) * mult; // 분열한 조각도 같은 세기로
  }

  setState(state) {
    this.state = state;
    this.stateTime = 0;
    this.attacked = false;
  }

  update(dt) {
    this.stateTime += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.flash = Math.max(0, this.flash - dt);
    this.hpBarTimer = Math.max(0, this.hpBarTimer - dt);

    if (this.state === 'dead') {
      // 납작하게 눌리며 사라진다 (조각·연기는 FeedbackSystem)
      const t = Math.min(1, this.stateTime / this.ctx.data.config.feedback.deathSquash);
      this.body.scale.set(1 + t * 0.5, Math.max(0.001, 1 - t), 1 + t * 0.5);
      this.body.position.y = 0;
      this.setOpacity(0.92 * (1 - t * 0.7));
      if (t >= 1) this.done = true;
      return;
    }

    const { move, speed } = this.think(dt);

    if (speed > 0 && move.lengthSq() > 1e-6) {
      move.normalize();
      this.facing.lerp(move, Math.min(1, dt * 8)).normalize();
      this.position.addScaledVector(move, speed * (this.speedMult ?? 1) * dt);
    }
    this.position.addScaledVector(this.knock, dt);
    this.knock.multiplyScalar(Math.exp(-8 * dt));
    this.separate();
    // 나는 몬스터는 나무·바위를 넘어 다닌다 (월드 경계만)
    if (this.def.flier) this.ctx.world.clampToBounds(this.position);
    else {
      this.ctx.world.resolveCollision(this.position, this.radius);
      this.ctx.wallGrid?.resolve(this.position, this.radius); // 벽은 몬스터만 막는다
    }

    this.animate(dt, speed);
  }

  // 매 프레임 상태를 정하고 어느 쪽으로 얼마나 빨리 움직일지 돌려준다 (행동 모듈이 정한다).
  think(dt) {
    return this.behavior.think(this, dt);
  }

  // 움츠렸다가(예비동작) 튀어오르며 attackTarget을 공격한다. 끝나면 next 상태로.
  attackStep(next) {
    const d = this.def;
    const t = this.attackTarget;
    tmp.set(t.position.x - this.position.x, 0, t.position.z - this.position.z);
    if (tmp.lengthSq() > 1e-6) this.facing.copy(tmp).normalize();
    if (!this.attacked && this.stateTime >= d.attackWindup) {
      this.attacked = true;
      this.knock.copy(this.facing).multiplyScalar(d.lungeSpeed);
      this.ctx.bus.emit('monster:attack', { monster: this, target: t });
    }
    if (this.stateTime >= d.attackWindup + d.attackRecover) {
      this.cooldown = d.attackCooldown;
      this.setState(next);
    }
  }

  // 몬스터끼리 겹치지 않게 밀어낸다.
  separate() {
    for (const o of this.ctx.monsters) {
      if (o === this || !o.alive) continue;
      const dx = this.position.x - o.position.x;
      const dz = this.position.z - o.position.z;
      const min = this.radius + o.radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-8) {
        const dd = Math.sqrt(d2);
        const push = (min - dd) * 0.5;
        this.position.x += (dx / dd) * push;
        this.position.z += (dz / dd) * push;
      }
    }
  }

  animate(dt, speed) {
    const d = this.def;
    this.mesh.position.copy(this.position);
    this.body.rotation.y = Math.atan2(this.facing.x, this.facing.z);
    this.glow(dt);
    this.hpBar.update(this.stats.hp / this.stats.maxHp, this.ctx.camera, this.hpBarTimer > 0);
    if (this.behavior.animate?.(this, dt, speed)) return;
    if (d.flier) {
      // 둥실둥실 떠다닌다
      this.hopPhase += dt * 6;
      this.body.position.y = 1.1 + Math.sin(this.hopPhase) * 0.15;
      this.body.scale.setScalar(1);
      return;
    }

    let sy = 1;
    let y = 0;
    if (this.state === 'attack' && !this.attacked) {
      const t = Math.min(1, this.stateTime / d.attackWindup);
      sy = 1 - 0.35 * t; // 움츠림
    } else if (this.state === 'attack') {
      const t = (this.stateTime - d.attackWindup) / d.attackRecover;
      y = Math.sin(Math.min(1, t) * Math.PI) * 0.6;
      sy = 1.15;
    } else {
      this.hopPhase += dt * (speed > 0 ? 3 + speed * 1.6 : 2);
      const h = Math.abs(Math.sin(this.hopPhase));
      y = speed > 0 ? h * 0.35 : 0;
      sy = speed > 0 ? 0.85 + h * 0.3 : 1 + Math.sin(this.hopPhase * 2) * 0.04;
    }
    this.body.position.y = y;
    this.body.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
  }

  // 피격 번쩍임(흰색) > 정예(금빛) > 밤 몬스터(보랏빛)
  glow(dt = 0) {
    // 밤 몬스터(밤에 태어난 필드 몬스터·습격 몬스터)는 처음 한 번 밤 모습으로
    if ((this.night || this.raid) && !this.motes && this.alive) {
      this.motes = nightLook(this.model, this.def.radius, this.type.startsWith('night'));
      this.mesh.add(this.motes);
    }
    if (this.motes) {
      this.moteT = (this.moteT ?? Math.random() * 6) + dt;
      const r = this.motes.userData.r;
      this.motes.visible = this.alive;
      this.motes.children.forEach((m, i) => {
        const a = this.moteT * 1.6 + i * Math.PI;
        m.position.set(Math.cos(a) * r * 1.5, r * (1.4 + i * 0.5) + Math.sin(this.moteT * 2.3 + i) * r * 0.25, Math.sin(a) * r * 1.5);
        m.rotation.y = a * 2;
      });
    }
    const e = this.mat.emissive;
    if (this.flash > 0) e.setRGB(1, 1, 1);
    else if (this.elite) e.copy(ELITE_GLOW);
    else if (this.night) e.copy(NIGHT_GLOW);
    else e.setRGB(0, 0, 0);
  }

  // 데미지를 받고 죽었으면 true
  takeDamage(amount, knockVec) {
    if (!this.alive || this.untargetable) return false;
    // 무리: 한 마리가 맞으면 무리 전체가 쫓아온다
    for (const o of this.pack ?? []) if (o !== this && o.alive) o.alert();
    const s = this.stats;
    s.hp = Math.max(0, s.hp - amount);
    this.flash = 0.12;
    this.hpBarTimer = 4;
    if (knockVec) this.knock.copy(knockVec).multiplyScalar(1 - this.def.knockbackResist);
    if (s.hp <= 0) {
      this.alive = false;
      this.hpBar.group.visible = false;
      this.setState('dead');
      return true;
    }
    if (this.behavior.flees && !this.hasFled && s.hp / s.maxHp <= this.def.fleeHpRatio) {
      this.hasFled = true;
      this.setState('flee');
    } else {
      this.alert();
    }
    return false;
  }

  // 배회 중이면 싸움 상태로 (행동마다 첫 상태가 다르다: 두더지는 땅속으로)
  alert() {
    if (this.state === 'wander') this.setState(this.behavior.aggro ?? 'chase');
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
    this.mesh.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });
  }
}
