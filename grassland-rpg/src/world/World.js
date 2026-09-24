import * as THREE from 'three';
import { createRandom } from '../utils/random.js';

// 초원 평지 한 장. 청크 로딩은 Phase 5(두 번째 지역)에서 Chunk.js로 나눈다.
const PALETTE = {
  sky: 0xbfe6f7,
  nightSky: 0x26305a,
  grassA: new THREE.Color('#9edb6f'),
  grassB: new THREE.Color('#86c95c'),
  grassC: new THREE.Color('#b2e27e'),
  trunk: 0x9a6a45,
  pine: ['#4fae62', '#5cbb6a', '#46a05a'],
  round: ['#7ccf6a', '#95d86f', '#f4b6c9', '#ffd08a'],
  rock: ['#b8bcc4', '#a9adb6', '#c9c6be'],
  bush: ['#6cc162', '#7fcd6b'],
  flower: ['#ffffff', '#ffd6e5', '#fff27a', '#d9c6ff', '#ffb3a1'],
  tuft: ['#7ec85a', '#94d468', '#6fbb52'],
};

export class World {
  constructor(ctx) {
    this.ctx = ctx;
    const cfg = ctx.data.config.world;
    this.cfg = cfg;
    this.half = cfg.size / 2;
    this.spawnPoint = new THREE.Vector3(cfg.spawnPoint[0], 0, cfg.spawnPoint[1]);
    this.colliders = [];
    this.rng = createRandom(cfg.seed);

    const scene = ctx.scene;
    scene.background = new THREE.Color(PALETTE.sky);
    scene.fog = new THREE.Fog(PALETTE.sky, 45, 115);

    this.buildLights();
    this.buildGround();
    this.buildDecor();
  }

  buildLights() {
    const scene = this.ctx.scene;
    this.hemi = new THREE.HemisphereLight(0xeaf6ff, 0x6f9a52, 1.25);
    scene.add(this.hemi);
    this.daySky = new THREE.Color(PALETTE.sky);
    this.nightSky = new THREE.Color(PALETTE.nightSky);
    this.skyColor = new THREE.Color();
    this.sunColor = new THREE.Color(0xfff0d2);
    this.moonColor = new THREE.Color(0x8ea6ff);

    const sun = new THREE.DirectionalLight(0xfff0d2, 1.9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const s = sun.shadow.camera;
    s.left = -28; s.right = 28; s.top = 28; s.bottom = -28;
    s.near = 1; s.far = 90;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    scene.add(sun, sun.target);
    this.sun = sun;
    this.sunOffset = new THREE.Vector3(18, 32, 14);
  }

  buildGround() {
    const size = this.cfg.size * 1.8;
    const seg = 90;
    const geo = new THREE.PlaneGeometry(size, size, seg, seg).toNonIndexed();
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    // 삼각형 단위로 색을 조금씩 달리해 로우폴리 잔디 느낌을 낸다.
    for (let i = 0; i < pos.count; i += 3) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const n = Math.sin(x * 0.09) * Math.cos(z * 0.07) + Math.sin((x + z) * 0.03);
      const t = this.rng.next();
      c.copy(n > 0.4 ? PALETTE.grassC : PALETTE.grassA).lerp(PALETTE.grassB, t * 0.55);
      for (let k = 0; k < 3; k++) c.toArray(colors, (i + k) * 3);
    }
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, (Math.sin(x * 0.7 + z * 0.3) + Math.cos(z * 0.9 - x * 0.2)) * 0.03);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 });
    const ground = new THREE.Mesh(geo, mat);
    ground.receiveShadow = true;
    this.ctx.scene.add(ground);
    this.ground = ground;
  }

  // 시작 지점 근처는 비워 두고, 가장자리 쪽은 촘촘하게 나무를 둘러 경계를 만든다.
  scatter(count, minGap = 0) {
    const out = [];
    let guard = count * 20;
    while (out.length < count && guard-- > 0) {
      const a = this.rng.range(0, Math.PI * 2);
      const d = Math.sqrt(this.rng.next()) * (this.half + 12);
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      if (Math.hypot(x - this.spawnPoint.x, z - this.spawnPoint.z) < this.cfg.clearRadius) continue;
      if (minGap && this.isBlocked(x, z, minGap)) continue;
      out.push([x, z]);
    }
    return out;
  }

  buildDecor() {
    const r = this.rng;
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const col = new THREE.Color();
    const place = (mesh, i, x, y, z, sx, sy, sz, ry = 0, rx = 0) => {
      e.set(rx, ry, 0);
      q.setFromEuler(e);
      m4.compose(v.set(x, y, z), q, sc.set(sx, sy, sz));
      mesh.setMatrixAt(i, m4);
    };
    const inst = (geo, count, color, { shadow = true, flat = true } = {}) => {
      const mat = new THREE.MeshStandardMaterial({ color, flatShading: flat, roughness: 0.9 });
      const mesh = new THREE.InstancedMesh(geo, mat, count);
      mesh.castShadow = shadow;
      mesh.receiveShadow = true;
      this.ctx.scene.add(mesh);
      return mesh;
    };

    // 경계 링 (가장자리를 따라 빽빽한 침엽수)
    const ring = [];
    for (let a = 0; a < Math.PI * 2; a += 0.045) {
      for (let layer = 0; layer < 3; layer++) {
        const rad = this.half + 2 + layer * 3.2 + r.range(-1, 1);
        ring.push([Math.cos(a + layer * 0.02) * rad, Math.sin(a + layer * 0.02) * rad]);
      }
    }
    const pines = this.scatter(this.cfg.trees, 1.4).concat(ring);
    const trunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 1, 6);
    trunkGeo.translate(0, 0.5, 0);
    const coneGeo = new THREE.ConeGeometry(1, 1.8, 7);
    coneGeo.translate(0, 0.9, 0);

    const pineTrunks = inst(trunkGeo, pines.length, PALETTE.trunk);
    const pineLow = inst(coneGeo, pines.length, 0xffffff);
    const pineTop = inst(coneGeo, pines.length, 0xffffff);
    pines.forEach(([x, z], i) => {
      const s = r.range(0.8, 1.35);
      const ry = r.range(0, Math.PI);
      place(pineTrunks, i, x, 0, z, s, s * 0.9, s, ry);
      place(pineLow, i, x, 0.75 * s, z, s * 1.05, s, s * 1.05, ry);
      place(pineTop, i, x, 1.75 * s, z, s * 0.72, s * 0.85, s * 0.72, ry + 0.4);
      col.set(r.pick(PALETTE.pine));
      pineLow.setColorAt(i, col);
      pineTop.setColorAt(i, col.offsetHSL(0, 0, 0.04));
      this.colliders.push({ x, z, r: 0.4 * s });
    });

    const rounds = this.scatter(this.cfg.roundTrees, 1.6);
    const blobGeo = new THREE.IcosahedronGeometry(1, 0);
    const roundTrunks = inst(trunkGeo, rounds.length, PALETTE.trunk);
    const roundCrowns = inst(blobGeo, rounds.length, 0xffffff);
    rounds.forEach(([x, z], i) => {
      const s = r.range(0.85, 1.3);
      place(roundTrunks, i, x, 0, z, s, s * 1.3, s);
      place(roundCrowns, i, x, 1.9 * s, z, s * 1.15, s, s * 1.15, r.range(0, 3), r.range(-0.2, 0.2));
      col.set(r.next() < 0.18 ? r.pick(PALETTE.round.slice(2)) : r.pick(PALETTE.round.slice(0, 2)));
      roundCrowns.setColorAt(i, col);
      this.colliders.push({ x, z, r: 0.4 * s });
    });

    const rocks = this.scatter(this.cfg.rocks, 1.2);
    const rockGeo = new THREE.DodecahedronGeometry(0.6, 0);
    const rockMesh = inst(rockGeo, rocks.length, 0xffffff);
    rocks.forEach(([x, z], i) => {
      const s = r.range(0.6, 1.5);
      place(rockMesh, i, x, 0.18 * s, z, s, s * r.range(0.55, 0.8), s * r.range(0.8, 1.1), r.range(0, 6), r.range(-0.3, 0.3));
      rockMesh.setColorAt(i, col.set(r.pick(PALETTE.rock)));
      this.colliders.push({ x, z, r: 0.55 * s });
    });

    const bushes = this.scatter(this.cfg.bushes, 0.8);
    const bushMesh = inst(blobGeo, bushes.length, 0xffffff);
    bushes.forEach(([x, z], i) => {
      const s = r.range(0.45, 0.75);
      place(bushMesh, i, x, 0.3 * s, z, s * 1.2, s * 0.8, s, r.range(0, 6));
      bushMesh.setColorAt(i, col.set(r.pick(PALETTE.bush)));
    });

    const petalGeo = new THREE.OctahedronGeometry(0.09, 0);
    const flowers = this.scatter(this.cfg.flowers);
    const flowerMesh = inst(petalGeo, flowers.length, 0xffffff, { shadow: false });
    flowers.forEach(([x, z], i) => {
      place(flowerMesh, i, x, 0.12, z, 1, 0.6, 1, r.range(0, 6));
      flowerMesh.setColorAt(i, col.set(r.pick(PALETTE.flower)));
    });

    const tuftGeo = new THREE.ConeGeometry(0.07, 0.34, 3);
    tuftGeo.translate(0, 0.17, 0);
    const tufts = this.scatter(this.cfg.grassTufts);
    const tuftMesh = inst(tuftGeo, tufts.length * 3, 0xffffff, { shadow: false });
    tufts.forEach(([x, z], i) => {
      col.set(r.pick(PALETTE.tuft));
      for (let k = 0; k < 3; k++) {
        const id = i * 3 + k;
        place(tuftMesh, id, x + r.range(-0.12, 0.12), 0, z + r.range(-0.12, 0.12), 1, r.range(0.7, 1.3), 1, r.range(0, 6), r.range(-0.35, 0.35));
        tuftMesh.setColorAt(id, col);
      }
    });
  }

  isBlocked(x, z, radius) {
    for (const c of this.colliders) {
      const dx = x - c.x;
      const dz = z - c.z;
      const min = c.r + radius;
      if (dx * dx + dz * dz < min * min) return true;
    }
    return false;
  }

  // 나무·바위를 밀어내고, 월드 경계 밖으로 못 나가게 한다.
  resolveCollision(pos, radius) {
    for (const c of this.colliders) {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const min = c.r + radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-8) {
        const d = Math.sqrt(d2);
        pos.x = c.x + (dx / d) * min;
        pos.z = c.z + (dz / d) * min;
      }
    }
    const lim = this.half - 1;
    const d = Math.hypot(pos.x, pos.z);
    if (d > lim) {
      pos.x *= lim / d;
      pos.z *= lim / d;
    }
  }

  isInside(x, z, margin = 2) {
    return Math.hypot(x, z) < this.half - margin;
  }

  // 낮/밤: 1 = 한낮, 0 = 한밤
  applyDaylight(daylight) {
    const d = daylight;
    this.skyColor.copy(this.nightSky).lerp(this.daySky, d);
    this.ctx.scene.background.copy(this.skyColor);
    this.ctx.scene.fog.color.copy(this.skyColor);
    this.hemi.intensity = 0.45 + 0.8 * d;
    this.sun.intensity = 0.45 + 1.45 * d;
    this.sun.color.copy(this.moonColor).lerp(this.sunColor, d);
  }

  update(dt, focus) {
    this.applyDaylight(this.ctx.time.daylight);
    // 그림자 범위를 좁게 유지하려고 태양이 플레이어를 따라다닌다.
    this.sun.target.position.copy(focus);
    this.sun.position.copy(focus).add(this.sunOffset);
  }
}
