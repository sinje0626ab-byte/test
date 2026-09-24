import * as THREE from 'three';

// 날씨 알갱이(빗줄기·모래·눈송이)와 장식 생물(낮 나비·밤 반딧불이). 모두 InstancedMesh 하나씩.
const m4 = new THREE.Matrix4();
const q = new THREE.Quaternion();
const v = new THREE.Vector3();
const sc = new THREE.Vector3();

export class Precipitation {
  constructor(scene, max) {
    this.max = max;
    const geo = new THREE.BoxGeometry(0.03, 0.6, 0.03);
    this.mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false });
    this.mesh = new THREE.InstancedMesh(geo, this.mat, max);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    scene.add(this.mesh);
    this.p = Array.from({ length: max }, () => new THREE.Vector3());
    this.type = null;
  }

  set(type, fx, center, area) {
    this.type = type;
    this.fx = fx;
    this.area = area;
    this.mesh.count = type ? fx.count : 0;
    if (!type) return;
    this.mat.color.set(fx.color);
    this.mat.opacity = type === 'rain' ? 0.45 : 0.8;
    for (let i = 0; i < fx.count; i++) this.reset(this.p[i], center, Math.random() * 12);
  }

  reset(p, c, y = 12) {
    p.set(c.x + (Math.random() - 0.5) * this.area * 2, y, c.z + (Math.random() - 0.5) * this.area * 2);
  }

  update(dt, center, time) {
    if (!this.type) return;
    const { fx, type } = this;
    for (let i = 0; i < fx.count; i++) {
      const p = this.p[i];
      if (type === 'rain') p.y -= fx.speed * dt;
      else if (type === 'snow') { p.y -= fx.speed * dt; p.x += Math.sin(time + i) * 0.4 * dt; }
      else { p.x += fx.speed * dt; p.y -= fx.speed * 0.08 * dt; p.z += Math.sin(time * 2 + i) * 0.5 * dt; }
      const far = Math.abs(p.x - center.x) > this.area || Math.abs(p.z - center.z) > this.area;
      if (p.y < 0 || far) {
        this.reset(p, center, type === 'sandstorm' ? Math.random() * 3 : 12);
        if (type === 'sandstorm') p.x = center.x - this.area;
      }
      const s = type === 'rain' ? 1 : type === 'snow' ? 0.18 : 0.25;
      if (type === 'sandstorm') q.setFromAxisAngle(v.set(0, 0, 1), Math.PI / 2);
      else q.identity();
      m4.compose(p, q, sc.set(type === 'rain' ? 1 : 3, s, type === 'rain' ? 1 : 3));
      this.mesh.setMatrixAt(i, m4);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export class Critters {
  constructor(scene, cfg) {
    this.cfg = cfg;
    const wing = new THREE.PlaneGeometry(0.34, 0.2);
    this.butterflies = new THREE.InstancedMesh(wing, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), cfg.butterflies);
    this.fireflies = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 5, 4), new THREE.MeshBasicMaterial({ color: 0xfff27a }), cfg.fireflies);
    const pal = [0xffcf5c, 0xff8fab, 0x8fd0ff, 0xffffff, 0xb58ee0];
    for (let i = 0; i < cfg.butterflies; i++) this.butterflies.setColorAt(i, new THREE.Color(pal[i % pal.length]));
    for (const m of [this.butterflies, this.fireflies]) {
      m.frustumCulled = false;
      m.count = 0;
      scene.add(m);
    }
    this.seeds = Array.from({ length: Math.max(cfg.butterflies, cfg.fireflies) }, () => ({ a: Math.random() * 6.3, r: 3 + Math.random() * cfg.radius, s: 0.3 + Math.random() * 0.5, h: Math.random() * 6.3 }));
  }

  // day: 나비, night: 반딧불이, 둘 다 아니면(비·다른 지역) 숨긴다
  update(center, time, mode) {
    this.butterflies.count = mode === 'day' ? this.cfg.butterflies : 0;
    this.fireflies.count = mode === 'night' ? this.cfg.fireflies : 0;
    const list = mode === 'day' ? this.butterflies : mode === 'night' ? this.fireflies : null;
    if (!list) return;
    for (let i = 0; i < list.count; i++) {
      const s = this.seeds[i];
      const a = s.a + time * s.s;
      v.set(center.x + Math.cos(a) * s.r + Math.sin(time * 0.7 + s.h) * 2, 0.6 + Math.sin(time * 1.3 + s.h) * 0.4 + (mode === 'night' ? 0.6 : 0), center.z + Math.sin(a * 1.3) * s.r);
      if (mode === 'day') {
        q.setFromAxisAngle(sc.set(0, 1, 0), -a);
        m4.compose(v, q, sc.set(Math.abs(Math.sin(time * 14 + s.h)) + 0.15, 1, 1)); // 날갯짓
      } else {
        const blink = Math.max(0.2, Math.sin(time * 2.5 + s.h * 3));
        m4.compose(v, q.identity(), sc.setScalar(blink));
      }
      list.setMatrixAt(i, m4);
    }
    list.instanceMatrix.needsUpdate = true;
  }
}
