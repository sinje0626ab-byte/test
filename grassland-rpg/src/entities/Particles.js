import * as THREE from 'three';

const m4 = new THREE.Matrix4();
const q = new THREE.Quaternion();
const e = new THREE.Euler();
const s = new THREE.Vector3();
const col = new THREE.Color();

// 파티클 풀: 작은 로우폴리 조각을 InstancedMesh 하나로 그린다 (draw call 1개).
// 안 쓰는 칸은 크기 0으로 숨긴다.
export class Particles {
  constructor(scene, max) {
    this.max = max;
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.7, emissive: 0x222222 });
    this.mesh = new THREE.InstancedMesh(geo, mat, max);
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.p = Array.from({ length: max }, () => ({ life: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3(), rot: 0 }));
    this.next = 0;
    m4.makeScale(0, 0, 0);
    for (let i = 0; i < max; i++) { this.mesh.setMatrixAt(i, m4); this.mesh.setColorAt(i, col.set(0xffffff)); }
    scene.add(this.mesh);
  }

  // opts: { color, count, speed, up, gravity, life, size, spread, grow(연기처럼 커졌다 작아짐), drag }
  burst(pos, o) {
    for (let k = 0; k < o.count; k++) {
      const idx = this.next;
      const p = this.p[idx];
      this.next = (this.next + 1) % this.max;
      const a = Math.random() * Math.PI * 2;
      const sp = o.speed * (0.4 + Math.random() * 0.6);
      p.pos.set(pos.x + (Math.random() - 0.5) * (o.spread ?? 0.3), pos.y + (Math.random() - 0.5) * (o.spread ?? 0.3), pos.z + (Math.random() - 0.5) * (o.spread ?? 0.3));
      p.vel.set(Math.cos(a) * sp, (o.up ?? 3) * (0.5 + Math.random() * 0.8), Math.sin(a) * sp);
      p.gravity = o.gravity ?? 14;
      p.maxLife = p.life = (o.life ?? 0.6) * (0.7 + Math.random() * 0.6);
      p.size = (o.size ?? 0.09) * (0.7 + Math.random() * 0.6);
      p.grow = !!o.grow;
      p.drag = o.drag ?? 1.5;
      p.rot = Math.random() * 6;
      this.mesh.setColorAt(idx, col.set(Array.isArray(o.color) ? o.color[k % o.color.length] : o.color));
    }
    this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt) {
    for (let i = 0; i < this.max; i++) {
      const p = this.p[i];
      if (p.life <= 0) continue;
      p.life -= dt;
      p.vel.y -= p.gravity * dt;
      p.vel.multiplyScalar(Math.exp(-p.drag * dt));
      p.pos.addScaledVector(p.vel, dt);
      if (p.pos.y < 0.03) { p.pos.y = 0.03; p.vel.y *= -0.3; p.vel.x *= 0.6; p.vel.z *= 0.6; }
      p.rot += dt * 6;
      const t = Math.max(0, p.life / p.maxLife);
      const size = p.life <= 0 ? 0 : p.size * (p.grow ? Math.sin(Math.PI * (1 - t)) * 2.2 + 0.3 : t);
      e.set(p.rot, p.rot * 0.7, 0);
      q.setFromEuler(e);
      m4.compose(p.pos, q, s.setScalar(size));
      this.mesh.setMatrixAt(i, m4);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
