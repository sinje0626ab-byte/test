import * as THREE from 'three';
import { createRandom } from '../utils/random.js';
import { Regions } from './Regions.js';
import { buildDecor } from './Decor.js';

// 월드: 지면·조명·충돌·경계. 장식 배치는 Decor.js, 지역 찾기는 Regions.js.
// 청크 로딩은 월드가 더 커지는 Phase 6(사막·설원)에서 Chunk.js로 나눈다.
const PALETTE = {
  sky: 0xbfe6f7,
  nightSky: 0x26305a,
};
const GRID = 8; // 충돌체 공간 해시 칸 크기

export class World {
  constructor(ctx) {
    this.ctx = ctx;
    const cfg = ctx.data.config.world;
    this.cfg = cfg;
    this.bounds = cfg.bounds;
    this.regions = new Regions(ctx.data.regions, cfg.regionBlend);
    this.spawnPoint = new THREE.Vector3(cfg.spawnPoint[0], 0, cfg.spawnPoint[1]);
    this.colliders = new Map();
    this.rng = createRandom(cfg.seed);
    this.scene = ctx.scene;

    const scene = ctx.scene;
    scene.background = new THREE.Color(PALETTE.sky);
    scene.fog = new THREE.Fog(PALETTE.sky, 45, 115);

    this.buildLights();
    this.buildGround();
    buildDecor(this);
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
    const b = this.bounds;
    const margin = 60;
    const w = b.maxX - b.minX + margin * 2;
    const d = b.maxZ - b.minZ + margin * 2;
    const geo = new THREE.PlaneGeometry(w, d, Math.round(w / 4), Math.round(d / 4)).toNonIndexed();
    geo.rotateX(-Math.PI / 2);
    geo.translate((b.minX + b.maxX) / 2, 0, (b.minZ + b.maxZ) / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    // 삼각형 단위로 색을 조금씩 달리해 로우폴리 잔디 느낌을 낸다. 지역 경계에선 색이 섞인다.
    for (let i = 0; i < pos.count; i += 3) {
      const x = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
      const z = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      this.regions.groundColor(x, z, this.rng.next(), c);
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

  nearSpawn(x, z) {
    return Math.hypot(x - this.spawnPoint.x, z - this.spawnPoint.z) < this.cfg.clearRadius;
  }

  addCollider(x, z, r) {
    const key = `${Math.floor(x / GRID)},${Math.floor(z / GRID)}`;
    if (!this.colliders.has(key)) this.colliders.set(key, []);
    this.colliders.get(key).push({ x, z, r });
  }

  // (x, z) 둘레 radius 안에 걸칠 수 있는 충돌체들
  *nearby(x, z, radius) {
    const reach = radius + 2; // 가장 큰 충돌체 반지름 여유
    const x0 = Math.floor((x - reach) / GRID);
    const x1 = Math.floor((x + reach) / GRID);
    const z0 = Math.floor((z - reach) / GRID);
    const z1 = Math.floor((z + reach) / GRID);
    for (let cx = x0; cx <= x1; cx++) {
      for (let cz = z0; cz <= z1; cz++) {
        const list = this.colliders.get(`${cx},${cz}`);
        if (list) yield* list;
      }
    }
  }

  regionAt(x, z) {
    return this.regions.at(x, z);
  }

  isBlocked(x, z, radius) {
    for (const c of this.nearby(x, z, radius)) {
      const dx = x - c.x;
      const dz = z - c.z;
      const min = c.r + radius;
      if (dx * dx + dz * dz < min * min) return true;
    }
    return false;
  }

  // 나무·바위를 밀어내고, 월드 경계 밖으로 못 나가게 한다.
  resolveCollision(pos, radius) {
    for (const c of this.nearby(pos.x, pos.z, radius)) {
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
    const b = this.bounds;
    pos.x = Math.max(b.minX + 1, Math.min(b.maxX - 1, pos.x));
    pos.z = Math.max(b.minZ + 1, Math.min(b.maxZ - 1, pos.z));
  }

  isInside(x, z, margin = 2) {
    const b = this.bounds;
    return x > b.minX + margin && x < b.maxX - margin && z > b.minZ + margin && z < b.maxZ - margin;
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
