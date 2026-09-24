import * as THREE from 'three';

const GRAVITY = 18;
const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 10);
coinGeo.rotateX(Math.PI / 2);
const gemGeo = new THREE.IcosahedronGeometry(0.18, 0);

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
    const mat = new THREE.MeshStandardMaterial({
      color: item.color,
      flatShading: true,
      roughness: isGold ? 0.3 : 0.5,
      metalness: isGold ? 0.6 : 0,
      emissive: item.color,
      emissiveIntensity: 0.15,
    });
    this.mesh = new THREE.Mesh(isGold ? coinGeo : gemGeo, mat);
    this.mesh.castShadow = true;
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
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
    this.mesh.material.dispose();
  }
}
