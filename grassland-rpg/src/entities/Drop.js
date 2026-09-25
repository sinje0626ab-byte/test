import * as THREE from 'three';
import { buildWeapon } from './weaponModels.js';
import { tone } from './monsterKit.js';

const GRAVITY = 18;
const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 10);
coinGeo.rotateX(Math.PI / 2);
const gemGeo = new THREE.IcosahedronGeometry(0.18, 0);
const glowGeo = new THREE.RingGeometry(0.22, 0.42, 20).rotateX(-Math.PI / 2);
const GLOW_GRADES = { rare: 0.45, epic: 0.6, legendary: 0.8 }; // 희귀 이상은 바닥에 등급 색 빛 고리

// 바닥에 떨어진 골드·아이템 한 무더기. 튀어나왔다가 통통 뜨며 기다린다.
export class Drop {
  constructor(ctx, itemId, count, position, velocity) {
    this.ctx = ctx;
    this.itemId = itemId;
    this.count = count;
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.age = 0;
    this.grounded = false;
    this.done = false;

    const item = ctx.data.items.items[itemId];
    const isGold = item.category === 'currency';
    this.ownMats = [];
    this.mesh = new THREE.Group();
    if (item.equipSlot === 'weapon') {
      // 무기는 실제 모양을 작게 (손에 드는 모델과 같은 것)
      const w = buildWeapon(item.weaponType, item.color, itemId);
      w.scale.setScalar(0.55);
      w.rotation.set(0.5, 0, 0.9);
      w.position.set(0, 0, -0.25);
      this.mesh.add(w);
    } else {
      const color = isGold ? new THREE.Color('#e0b34a') : tone(item.color, { sat: 0.85 });
      const mat = new THREE.MeshStandardMaterial({
        color, flatShading: true, roughness: isGold ? 0.3 : 0.45, metalness: isGold ? 0.65 : 0.05,
        emissive: color, emissiveIntensity: isGold ? 0.12 : 0.1,
      });
      this.ownMats.push(mat);
      const m = new THREE.Mesh(isGold ? coinGeo : gemGeo, mat);
      m.castShadow = true;
      this.mesh.add(m);
    }
    const glow = GLOW_GRADES[item.grade];
    if (glow) {
      const mat = new THREE.MeshBasicMaterial({ color: ctx.data.items.grades[item.grade].color, transparent: true, opacity: glow, depthWrite: false, blending: THREE.AdditiveBlending });
      this.ownMats.push(mat);
      this.ring = new THREE.Mesh(glowGeo, mat);
      ctx.scene.add(this.ring);
    }
    this.spin = Math.random() * Math.PI * 2;
    ctx.scene.add(this.mesh);
    this.sync();
  }

  // 날아가는 중이면 포물선, 착지 후엔 제자리에서 둥둥
  update(dt) {
    this.age += dt;
    if (!this.grounded) {
      this.velocity.y -= GRAVITY * dt;
      this.position.addScaledVector(this.velocity, dt);
      if (this.position.y <= 0) {
        this.position.y = 0;
        if (this.velocity.y < -2) {
          this.velocity.y *= -0.35;
          this.velocity.x *= 0.6;
          this.velocity.z *= 0.6;
        } else {
          this.grounded = true;
          this.velocity.set(0, 0, 0);
        }
      }
    }
    this.spin += dt * 3;
    this.sync();
  }

  pullToward(target, speed, dt) {
    this.grounded = true;
    const dx = target.x - this.position.x;
    const dz = target.z - this.position.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-4) return;
    const step = Math.min(d, speed * dt);
    this.position.x += (dx / d) * step;
    this.position.z += (dz / d) * step;
    this.position.y = Math.max(0, this.position.y - dt * 2);
  }

  sync() {
    const bob = this.grounded ? 0.28 + Math.sin(this.age * 4 + this.spin) * 0.06 : 0.2;
    this.mesh.position.set(this.position.x, this.position.y + bob, this.position.z);
    this.mesh.rotation.y = this.spin;
    if (this.ring) {
      this.ring.position.set(this.position.x, 0.04, this.position.z);
      this.ring.material.opacity = GLOW_GRADES[this.ctx.data.items.items[this.itemId].grade] * (0.75 + Math.sin(this.age * 3) * 0.25);
    }
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
    if (this.ring) this.ctx.scene.remove(this.ring);
    for (const m of this.ownMats) m.dispose(); // 무기 재질은 여럿이 같이 쓰니 두고
    this.mesh.traverse((o) => { if (o.isMesh && o.geometry !== coinGeo && o.geometry !== gemGeo) o.geometry.dispose(); });
  }
}
