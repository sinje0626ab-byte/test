import * as THREE from 'three';
import { HpBar } from './HpBar.js';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 });

// 포탑 모양·체력·조준 상태. 조준 대상 고르기와 발사는 TurretSystem이 한다.
export class Turret {
  constructor(ctx, type, baseId, position, { hp, level = 1 } = {}) {
    this.ctx = ctx;
    this.kind = 'turret';
    this.type = type;
    this.def = ctx.data.turrets[type];
    this.baseId = baseId;
    this.level = level;
    this.position = position.clone();
    this.radius = this.def.radius;
    this.stats = { maxHp: this.def.hp, hp: hp ?? this.def.hp };
    this.alive = this.stats.hp > 0;
    this.cooldown = 0;
    this.yaw = 0;
    this.aimYaw = 0;
    this.flash = 0;
    this.hpTimer = 0;
    this.recoil = 0;
    this.buildMesh();
    this.applyBroken();
  }

  static createMesh(def) {
    const g = new THREE.Group();
    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 0.9, 6), flat('#9a6a45'));
    legs.position.y = 0.45;
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.18, 6), flat('#b88452'));
    deck.position.y = 0.98;
    const head = new THREE.Group();
    head.position.y = 1.2;
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.9), flat(def.color));
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 4, 10, Math.PI), flat('#6b4a36'));
    bow.position.z = 0.3;
    bow.rotation.set(Math.PI / 2, 0, 0);
    const arrow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.7), flat('#e8e8e8'));
    arrow.position.set(0, 0.1, 0.15);
    head.add(stock, bow, arrow);
    g.add(legs, deck, head);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return { group: g, head, parts: [legs, deck, stock, bow] };
  }

  buildMesh() {
    const { group, head, parts } = Turret.createMesh(this.def);
    this.head = head;
    this.mats = parts.map((p) => p.material);
    this.hpBar = new HpBar(1, 0x7cc67a);
    this.hpBar.group.position.y = 2;
    group.add(this.hpBar.group);
    group.position.copy(this.position);
    this.mesh = group;
    this.ctx.scene.add(group);
  }

  // 부서진 포탑은 머리가 떨어지고 거무스름한 잔해가 된다 (수리는 Phase 6).
  applyBroken() {
    this.head.visible = this.alive;
    this.mesh.rotation.z = this.alive ? 0 : 0.25;
    for (const m of this.mats) m.color.multiplyScalar(this.alive ? 1 : 0.55);
  }

  get muzzle() {
    return new THREE.Vector3(this.position.x, 1.3, this.position.z);
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.stats.hp = Math.max(0, this.stats.hp - amount);
    this.flash = 0.12;
    this.hpTimer = 4;
    if (this.stats.hp <= 0) {
      this.alive = false;
      this.applyBroken();
      return true;
    }
    return false;
  }

  update(dt) {
    this.flash = Math.max(0, this.flash - dt);
    this.hpTimer = Math.max(0, this.hpTimer - dt);
    this.recoil = Math.max(0, this.recoil - dt * 4);
    let diff = this.aimYaw - this.yaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.yaw += diff * Math.min(1, dt * 12);
    this.head.rotation.y = this.yaw;
    this.head.position.z = 0;
    this.head.scale.z = 1 - this.recoil * 0.15;
    const e = this.flash > 0 ? 0.6 : 0;
    for (const m of this.mats) m.emissive.setRGB(e, e * 0.3, e * 0.3);
    const s = this.stats;
    this.hpBar.update(s.hp / s.maxHp, this.ctx.camera, this.alive && this.hpTimer > 0);
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
  }
}
