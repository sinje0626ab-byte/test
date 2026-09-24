import * as THREE from 'three';
import { rand } from '../utils/random.js';
import { createMonsterModel } from './MonsterModel.js';
import { HpBar } from './HpBar.js';

const tmp = new THREE.Vector3();

// 필드 몬스터. AI 상태: 배회 → 추적 → 공격 → (체력 낮으면) 도주 → 사망
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

    this.buildMesh();
  }

  buildMesh() {
    const { body, mat, extraMats } = createMonsterModel(this.def);
    this.body = body;
    this.mat = mat;
    this.extraMats = extraMats;
    const outer = new THREE.Group();
    outer.add(body);

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
      this.position.addScaledVector(move, speed * dt);
    }
    this.position.addScaledVector(this.knock, dt);
    this.knock.multiplyScalar(Math.exp(-8 * dt));
    this.separate();
    this.ctx.world.resolveCollision(this.position, this.radius);

    this.animate(dt, speed);
  }

  // 매 프레임 상태를 정하고 어느 쪽으로 얼마나 빨리 움직일지 돌려준다.
  think(dt) {
    const d = this.def;
    const player = this.ctx.player;
    const toPlayer = tmp.set(player.position.x - this.position.x, 0, player.position.z - this.position.z);
    const dist = toPlayer.length();
    const canSee = player.alive && dist < d.detectRange;
    let speed = 0;
    const move = new THREE.Vector3();
    this.attackTarget = player;

    switch (this.state) {
      case 'wander': {
        if (canSee) { this.setState('chase'); break; }
        if (!this.target) {
          this.pause -= dt;
          if (this.pause <= 0) {
            const a = rand.range(0, Math.PI * 2);
            const r = rand.range(1, d.wanderRadius);
            this.target = new THREE.Vector3(this.home.x + Math.cos(a) * r, 0, this.home.z + Math.sin(a) * r);
          }
        } else {
          move.set(this.target.x - this.position.x, 0, this.target.z - this.position.z);
          if (move.length() < 0.3 || this.stateTime > 8) {
            this.target = null;
            this.stateTime = 0;
            this.pause = rand.range(d.wanderPauseMin, d.wanderPauseMax);
            move.set(0, 0, 0);
          } else {
            speed = d.moveSpeed;
          }
        }
        break;
      }
      case 'chase': {
        if (!player.alive || dist > d.loseRange) {
          this.home.copy(this.position);
          this.target = null;
          this.setState('wander');
          break;
        }
        if (dist <= d.attackRange + player.radius && this.cooldown <= 0) {
          this.setState('attack');
          break;
        }
        move.copy(toPlayer);
        speed = dist > d.attackRange * 0.8 ? d.chaseSpeed : 0;
        break;
      }
      case 'attack':
        this.attackStep('chase');
        break;
      case 'flee': {
        move.copy(toPlayer).multiplyScalar(-1);
        speed = d.fleeSpeed;
        if (this.stateTime >= d.fleeDuration) {
          this.home.copy(this.position);
          this.target = null;
          this.setState('wander');
        }
        break;
      }
    }
    return { move, speed };
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

    const e = this.flash > 0 ? 1 : 0;
    this.mat.emissive.setRGB(e, e, e);

    this.hpBar.update(this.stats.hp / this.stats.maxHp, this.ctx.camera, this.hpBarTimer > 0);
  }

  // 데미지를 받고 죽었으면 true
  takeDamage(amount, knockVec) {
    if (!this.alive) return false;
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
    if (!this.hasFled && s.hp / s.maxHp <= this.def.fleeHpRatio) {
      this.hasFled = true;
      this.setState('flee');
    } else if (this.state === 'wander') {
      this.setState('chase');
    }
    return false;
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
