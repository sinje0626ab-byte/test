import * as THREE from 'three';
import { rand } from '../utils/random.js';

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
    const d = this.def;
    const g = new THREE.Group();
    this.mat = new THREE.MeshStandardMaterial({
      color: d.color, flatShading: true, roughness: 0.35, transparent: true, opacity: 0.92,
    });
    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(d.radius, 1), this.mat);
    body.scale.set(1, 0.78, 1);
    body.position.y = d.radius * 0.78;
    body.castShadow = true;
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x23262e, flatShading: true });
    const eyeGeo = new THREE.SphereGeometry(d.radius * 0.11, 6, 4);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * d.radius * 0.33, d.radius * 0.95, d.radius * 0.82);
      g.add(eye);
    }
    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(d.radius * 0.14, 6, 4),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }),
    );
    shine.position.set(-d.radius * 0.35, d.radius * 1.2, d.radius * 0.3);
    g.add(body, shine);

    const outer = new THREE.Group();
    outer.add(g);
    this.body = g;

    // 체력바 (맞았을 때만 잠깐 보인다)
    const bar = new THREE.Group();
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.12), new THREE.MeshBasicMaterial({ color: 0x2b2b33, depthTest: false }));
    const fgGeo = new THREE.PlaneGeometry(0.86, 0.08);
    fgGeo.translate(0.43, 0, 0);
    this.hpFill = new THREE.Mesh(fgGeo, new THREE.MeshBasicMaterial({ color: 0xff6b6b, depthTest: false }));
    this.hpFill.position.set(-0.43, 0, 0.001);
    bg.renderOrder = 10;
    this.hpFill.renderOrder = 11;
    bar.add(bg, this.hpFill);
    bar.position.y = d.radius * 2 + 0.35;
    bar.visible = false;
    outer.add(bar);
    this.hpBar = bar;

    this.mesh = outer;
    this.ctx.scene.add(outer);
    this.mesh.position.copy(this.position);
  }

  setState(state) {
    this.state = state;
    this.stateTime = 0;
    this.attacked = false;
  }

  update(dt) {
    const d = this.def;
    const player = this.ctx.player;
    this.stateTime += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.flash = Math.max(0, this.flash - dt);
    this.hpBarTimer = Math.max(0, this.hpBarTimer - dt);

    if (this.state === 'dead') {
      const t = this.stateTime / 0.5;
      this.body.scale.setScalar(Math.max(0.001, 1 - t));
      this.body.position.y = t * 0.4;
      this.mat.opacity = 0.92 * (1 - t);
      if (t >= 1) this.done = true;
      return;
    }

    const toPlayer = tmp.set(player.position.x - this.position.x, 0, player.position.z - this.position.z);
    const dist = toPlayer.length();
    const canSee = player.alive && dist < d.detectRange;
    let speed = 0;
    const move = new THREE.Vector3();

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
      case 'attack': {
        // 움츠렸다가(예비동작) 튀어오르며 공격
        this.facing.copy(toPlayer).normalize();
        if (!this.attacked && this.stateTime >= d.attackWindup) {
          this.attacked = true;
          this.knock.copy(this.facing).multiplyScalar(d.lungeSpeed);
          this.ctx.bus.emit('monster:attack', { monster: this });
        }
        if (this.stateTime >= d.attackWindup + d.attackRecover) {
          this.cooldown = d.attackCooldown;
          this.setState('chase');
        }
        break;
      }
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

    this.hpBar.visible = this.hpBarTimer > 0;
    if (this.hpBar.visible) {
      this.hpBar.quaternion.copy(this.ctx.camera.quaternion);
      this.hpFill.scale.x = Math.max(0.001, this.stats.hp / this.stats.maxHp);
    }
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
      this.hpBar.visible = false;
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
