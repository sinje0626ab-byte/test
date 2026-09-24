import * as THREE from 'three';
import { HpBar } from './HpBar.js';
import { createTurretModel } from './TurretModels.js';
import { turretMaxHp } from '../utils/build.js';

// 포탑 모양·체력·레벨·조준 상태. 조준 대상 고르기와 발사는 TurretSystem이 한다.
export class Turret {
  constructor(ctx, type, baseId, position, { hp, level = 1, priority } = {}) {
    this.ctx = ctx;
    this.kind = 'turret';
    this.type = type;
    this.def = ctx.data.turrets[type];
    this.baseId = baseId;
    this.level = level;
    this.priority = priority ?? this.def.priority;
    this.position = position.clone();
    this.radius = this.def.radius;
    const maxHp = turretMaxHp(this.def, level);
    this.stats = { maxHp, hp: Math.min(maxHp, hp ?? maxHp) };
    this.alive = this.stats.hp > 0;
    this.cooldown = 0;
    this.yaw = 0;
    this.aimYaw = 0;
    this.flash = 0;
    this.hpTimer = 0;
    this.recoil = 0;
    this.buildMesh();
    this.applyLook();
  }

  static createMesh(def) {
    return createTurretModel(def);
  }

  buildMesh() {
    const { group, head, parts, stars } = createTurretModel(this.def);
    this.head = head;
    this.stars = stars;
    this.mats = parts.map((p) => p.material);
    this.baseColors = this.mats.map((m) => m.color.clone());
    this.hpBar = new HpBar(1, 0x7cc67a);
    this.hpBar.group.position.y = 2.1;
    group.add(this.hpBar.group);
    group.position.copy(this.position);
    this.mesh = group;
    this.ctx.scene.add(group);
  }

  // 부서진 포탑은 머리가 떨어지고 거무스름한 잔해가 된다. 레벨은 금색 띠로 보인다.
  applyLook() {
    this.head.visible = this.alive;
    this.mesh.rotation.z = this.alive ? 0 : 0.25;
    this.mats.forEach((m, i) => m.color.copy(this.baseColors[i]).multiplyScalar(this.alive ? 1 : 0.55));
    this.stars.forEach((s, i) => { s.visible = this.level >= i + 2; });
  }

  get muzzle() {
    return new THREE.Vector3(this.position.x, this.head.position.y + 0.15, this.position.z);
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.stats.hp = Math.max(0, this.stats.hp - amount);
    this.flash = 0.12;
    this.hpTimer = 4;
    if (this.stats.hp <= 0) {
      this.alive = false;
      this.applyLook();
      return true;
    }
    return false;
  }

  repair() {
    this.stats.hp = this.stats.maxHp;
    this.alive = true;
    this.applyLook();
  }

  levelUp() {
    const ratio = this.stats.hp / this.stats.maxHp;
    this.level += 1;
    this.stats.maxHp = turretMaxHp(this.def, this.level);
    this.stats.hp = Math.round(this.stats.maxHp * ratio);
    this.applyLook();
  }

  update(dt) {
    this.flash = Math.max(0, this.flash - dt);
    this.hpTimer = Math.max(0, this.hpTimer - dt);
    this.recoil = Math.max(0, this.recoil - dt * 4);
    let diff = this.aimYaw - this.yaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.yaw += diff * Math.min(1, dt * 12);
    this.head.rotation.y = this.yaw;
    this.head.scale.z = 1 - this.recoil * 0.15;
    const e = this.flash > 0 ? 0.6 : 0;
    for (const m of this.mats) m.emissive.setRGB(e, e * 0.3, e * 0.3);
    const s = this.stats;
    this.hpBar.update(s.hp / s.maxHp, this.ctx.camera, this.alive && (this.hpTimer > 0 || s.hp < s.maxHp));
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
  }
}
