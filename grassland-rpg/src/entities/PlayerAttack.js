import * as THREE from 'three';
import { createWeaponMesh, createTrail, DEFAULT_BLADE } from './PlayerModel.js';

// 무기 종류별 공격: 검(베기)·창(찌르기)·망치(내려치기, 3타마다 충격파)·활(화살).
// 수치는 weapons.json, 능력치는 장비(ctx.player.stats).
export class PlayerAttack {
  constructor(player) {
    this.p = player;
    this.time = -1; // 휘두르는 중이면 0 이상
    this.timer = 0; // 다음 공격까지
    this.hitDone = true;
    this.dir = new THREE.Vector3(0, 0, 1);
    this.count = 0;
    this.spinning = false;
    this.setWeapon('sword', DEFAULT_BLADE);
  }

  get swinging() {
    return this.time >= 0;
  }

  cancel() {
    this.time = -1;
  }

  setWeapon(type, color) {
    const p = this.p;
    this.type = type;
    this.w = p.ctx.data.weapons[type];
    p.swordPivot.remove(p.weapon);
    p.weapon = createWeaponMesh(type, color);
    p.swordPivot.add(p.weapon);
    p.mesh.remove(p.trail);
    p.trail = createTrail(this.w.range, this.w.arcDeg);
    p.mesh.add(p.trail);
  }

  aimPoint(input) {
    const p = this.p;
    if (!input.virtualAttack) return p.ctx.mouseGround;
    return p.nearestEnemy(this.type === 'bow' ? this.w.autoAimRange : undefined)?.position;
  }

  update(dt) {
    const p = this.p;
    const s = p.stats;
    const b = p.base;
    const w = this.w;
    const input = p.ctx.input;
    this.timer = Math.max(0, this.timer - dt);

    if (p.ctx.mode === 'play' && input.attackHeld && this.timer <= 0 && s.stamina >= w.staminaCost) {
      // 누른 순간 마우스(터치는 가까운 적) 쪽으로 몸을 돌린다.
      const aim = this.aimPoint(input);
      if (aim) {
        const d = new THREE.Vector3(aim.x - p.position.x, 0, aim.z - p.position.z);
        if (d.lengthSq() > 0.01) p.facing.copy(d.normalize());
      }
      this.dir.copy(p.facing);
      this.time = 0;
      this.hitDone = false;
      this.count += 1;
      // 회전 공격 스킬: 근접 무기로 N번째 공격마다 한 바퀴
      this.spinning = this.type !== 'bow' && s.spin > 0 && this.count % b.spinEvery === 0;
      this.timer = w.cooldown * Math.max(0.3, 1 - s.attackSpeed);
      s.stamina -= w.staminaCost;
      p.staminaDelay = b.staminaRegenDelay;
    }

    if (this.time < 0) return;
    this.time += dt;
    if (!this.hitDone && this.time >= w.hitTime) {
      this.hitDone = true;
      this.release();
    }
    if (this.time >= w.duration) this.time = -1;
  }

  // 타격 순간: 근접은 부채꼴 판정, 활은 화살 발사
  release() {
    const p = this.p;
    const s = p.stats;
    const b = p.base;
    const w = this.w;
    const bus = p.ctx.bus;
    const attack = s.attack * w.damageMult;
    const common = { critChance: s.critChance, critMultiplier: b.critMultiplier + (s.critDamage ?? 0), weapon: this.type };

    if (this.type === 'bow') {
      bus.emit('player:shoot', {
        origin: p.position.clone().setY(1.0), dir: this.dir.clone(), speed: w.arrowSpeed, range: w.range,
        count: 1 + Math.round(s.multiShot ?? 0), spread: THREE.MathUtils.degToRad(w.spreadDeg),
        attack, knockback: w.knockback, ...common,
      });
      return;
    }
    bus.emit('player:attack', {
      origin: p.position.clone(),
      dir: this.dir.clone(),
      range: w.range,
      arc: this.spinning ? Math.PI * 2 : THREE.MathUtils.degToRad(w.arcDeg),
      attack: this.spinning ? attack * (1 + b.spinDamagePerRank * s.spin) : attack,
      knockback: w.knockback,
      ...common,
    });
    // 망치: 3타마다 둘레 충격파
    if (w.shockEvery && this.count % w.shockEvery === 0) {
      bus.emit('player:attack', {
        origin: p.position.clone(), dir: this.dir.clone(), range: w.shockRadius, arc: Math.PI * 2,
        attack: attack * w.shockMult, knockback: w.knockback, ...common, shock: true,
      });
      bus.emit('player:shock', { position: p.position.clone(), radius: w.shockRadius });
    }
  }

  // 무기 종류별 동작 (syncMesh에서 부른다)
  animate(dt) {
    const p = this.p;
    const pivot = p.swordPivot;
    p.inner.rotation.y = 0;
    p.spinTrail.material.opacity = 0;
    pivot.rotation.x = 0;
    pivot.position.z = 0;
    if (this.time < 0) {
      const rest = this.type === 'bow' ? 0.2 : 0.9;
      pivot.rotation.y += (rest - pivot.rotation.y) * Math.min(1, dt * 10);
      p.trail.material.opacity = 0;
      return;
    }
    const t = Math.min(1, this.time / this.w.duration);
    const ease = 1 - Math.pow(1 - t, 3);
    const swing = this.w.swing;
    if (swing === 'thrust') {
      pivot.rotation.y = 0.15;
      pivot.position.z = Math.sin(t * Math.PI) * 0.7;
    } else if (swing === 'smash') {
      pivot.rotation.y = 0.3;
      pivot.rotation.x = THREE.MathUtils.lerp(-1.4, 0.5, ease);
    } else if (swing === 'shoot') {
      pivot.rotation.y = 0;
      pivot.position.z = -Math.sin(t * Math.PI) * 0.15;
    } else {
      pivot.rotation.y = THREE.MathUtils.lerp(1.4, -1.6, ease);
    }
    if (this.spinning) {
      p.inner.rotation.y = -ease * Math.PI * 2;
      p.spinTrail.material.opacity = 0.45 * (1 - t);
      p.trail.material.opacity = 0;
    } else {
      p.trail.material.opacity = swing === 'shoot' ? 0 : 0.45 * (1 - t);
    }
  }
}
