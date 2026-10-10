import * as THREE from 'three';
import { Chunk } from './Chunk.js';
import { propGeometries } from './decorProps.js';

// 장식 색을 조금 차분하게 (원색 줄이기)
const calm = (c) => { const col = new THREE.Color(c); const h = {}; col.getHSL(h); return col.setHSL(h.h, h.s * 0.86, h.l); };

// 지역별 장식 배치. 같은 시드면 같은 숲이 나온다.
// z 띠(청크)마다, 종류마다 InstancedMesh 하나로 모아 그린다. 만든 청크 목록을 돌려준다.
export function buildDecor(world) {
  const { rng: r, regions, bounds, scene } = world;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const sc = new THREE.Vector3();

  // 청크별·종류별로 [행렬, 색] 을 모았다가 한 번에 만든다.
  const size = world.cfg.chunkSize;
  const byChunk = new Map();
  const push = (kind, x, y, z, sx, sy, sz, color, ry = 0, rx = 0) => {
    e.set(rx, ry, 0);
    q.setFromEuler(e);
    const ci = Math.floor(z / size);
    if (!byChunk.has(ci)) byChunk.set(ci, {});
    const kinds = byChunk.get(ci);
    (kinds[kind] ??= []).push({ m: new THREE.Matrix4().compose(v.set(x, y, z), q, sc.set(sx, sy, sz)), c: calm(color) });
  };

  // 모양: 시안 그림체의 소품 (decorProps.js, 꼭짓점 색). 인스턴스 색은 밝기 흔들기 또는 지역 팔레트(풀포기·꽃)
  const geos = propGeometries();
  const noShadow = new Set(['flower', 'tuft', 'pebbles', 'bells']);
  const shade = () => { const l = r.range(0.88, 1.0); return new THREE.Color(l, l, l); };
  const place = (kind, x, z, s, color = shade(), sy = s) => push(kind, x, 0, z, s, sy, s, color, r.range(0, Math.PI * 2));

  // 지역마다 쓰는 소품 (같은 자리 종류가 지역마다 다른 모양)
  const SET = {
    grassland: { pine: 'pine', tree: () => (r.next() < 0.18 ? 'blossomTree' : r.next() < 0.35 ? 'treeSmall' : 'tree'), rock: 'rockMoss', bush: 'flowerBush' },
    forest: { pine: 'pine', tree: () => 'oak', rock: 'rockMoss', bush: 'fern' },
    desert: { pine: 'pine', tree: () => 'dryBush', rock: () => (r.next() < 0.12 ? 'arch' : 'sandRock'), bush: 'dryBush' },
    snow: { pine: 'snowPine', tree: () => 'frostTree', rock: 'iceRock', bush: 'snowBush' },
  };
  const pick = (v) => (typeof v === 'function' ? v() : v);
  const pine = (x, z, s, reg, collide = true) => {
    place((SET[reg.id] ?? SET.grassland).pine, x, z, s);
    if (collide) world.addCollider(x, z, 0.4 * s);
  };

  // 지역마다 면적에 비례한 개수를 뿌린다. 경계는 조금씩 흔들어 자연스럽게.
  for (const reg of regions.list) {
    const z0 = Math.max(reg.zFrom, bounds.minZ);
    const z1 = Math.min(reg.zTo, bounds.maxZ);
    if (z1 <= z0) continue;
    const area = (bounds.maxX - bounds.minX) * (z1 - z0);
    const count = (k) => Math.round(((reg.decor[k] ?? 0) * area) / 1000);
    const pal = reg.palette;
    const set = SET[reg.id] ?? SET.grassland;
    const spot = (gap) => {
      for (let tries = 0; tries < 20; tries++) {
        const x = r.range(bounds.minX - 4, bounds.maxX + 4);
        const z = r.range(z0, z1) + r.range(-6, 6);
        if (regions.at(x, z) !== reg && z > bounds.minZ && z < bounds.maxZ) continue;
        if (world.nearSpawn(x, z) || world.inPond(x, z, 1)) continue;
        if (gap && world.isBlocked(x, z, gap)) continue;
        return [x, z];
      }
      return null;
    };

    for (let i = 0; i < count('pines'); i++) {
      const p = spot(1.4);
      if (p) pine(p[0], p[1], r.range(0.8, 1.35), reg);
    }
    for (let i = 0; i < count('roundTrees'); i++) {
      const p = spot(1.6);
      if (!p) continue;
      const s = r.range(0.85, 1.3);
      place(pick(set.tree), p[0], p[1], s);
      world.addCollider(p[0], p[1], 0.4 * s);
    }
    for (let i = 0; i < count('rocks'); i++) {
      const p = spot(1.2);
      if (!p) continue;
      const kind = pick(set.rock);
      const s = kind === 'arch' ? r.range(0.9, 1.2) : r.range(0.7, 1.4);
      place(kind, p[0], p[1], s);
      if (kind === 'arch') for (const d of [-0.95, 0.95]) world.addCollider(p[0] + d * s, p[1], 0.4 * s);
      else world.addCollider(p[0], p[1], 0.55 * s);
    }
    for (let i = 0; i < count('bushes'); i++) {
      const p = spot(0.8);
      if (p) place(set.bush, p[0], p[1], r.range(0.75, 1.15));
    }
    for (let i = 0; i < count('flowers'); i++) {
      const p = spot(0);
      if (!p) continue;
      if (reg.id === 'forest' && r.next() < 0.4) place('bells', p[0], p[1], r.range(0.8, 1.2));
      else place('flower', p[0], p[1], r.range(0.8, 1.1), new THREE.Color(r.pick(pal.flower)));
    }
    for (let i = 0; i < count('tufts'); i++) {
      const p = spot(0);
      if (p) place('tuft', p[0], p[1], r.range(0.8, 1.3), new THREE.Color(r.pick(pal.tuft)));
    }
    for (let i = 0; i < count('cacti'); i++) {
      const p = spot(1.0);
      if (!p) continue;
      const s = r.range(0.9, 1.6);
      place('cactusSmall', p[0], p[1], s, shade(), s * r.range(1.0, 1.5));
      world.addCollider(p[0], p[1], 0.35 * s);
    }
    for (let i = 0; i < count('mushrooms'); i++) {
      const p = spot(0.5);
      if (p) place('mushrooms', p[0], p[1], r.range(0.8, 1.4));
    }
    for (let i = 0; i < count('logs'); i++) {
      const p = spot(1.2);
      if (!p) continue;
      const s = r.range(0.8, 1.2);
      place('log', p[0], p[1], s);
      world.addCollider(p[0], p[1], 0.5 * s);
    }
    for (let i = 0; i < count('pebbles'); i++) {
      const p = spot(0.3);
      if (p) place('pebbles', p[0], p[1], r.range(0.8, 1.4));
    }
    for (let i = 0; i < count('skulls'); i++) {
      const p = spot(0.6);
      if (p) place('skull', p[0], p[1], r.range(0.9, 1.2));
    }
    for (let i = 0; i < count('drifts'); i++) {
      const p = spot(0.8);
      if (p) place('drift', p[0], p[1], r.range(0.7, 1.3));
    }
  }

  // 월드 가장자리 침엽수 벽 (밖으로 몇 겹)
  const edge = world.cfg.edgeTrees;
  const ring = (x, z) => pine(x, z, r.range(1, 1.5), regions.at(x, z), false);
  for (let layer = 0; layer < edge.layers; layer++) {
    const o = 2 + layer * edge.layerGap;
    for (let x = bounds.minX - o; x <= bounds.maxX + o; x += edge.spacing) {
      ring(x + r.range(-1, 1), bounds.minZ - o + r.range(-1, 1));
      ring(x + r.range(-1, 1), bounds.maxZ + o + r.range(-1, 1));
    }
    for (let z = bounds.minZ - o; z <= bounds.maxZ + o; z += edge.spacing) {
      ring(bounds.minX - o + r.range(-1, 1), z + r.range(-1, 1));
      ring(bounds.maxX + o + r.range(-1, 1), z + r.range(-1, 1));
    }
  }

  const mats = Object.fromEntries(Object.keys(geos).map((k) => [k, new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, flatShading: true, roughness: 0.9 })]));
  const chunks = [];
  for (const [ci, kinds] of byChunk) {
    const chunk = new Chunk(scene, ci, size);
    chunk.build(kinds, geos, mats, noShadow);
    chunks.push(chunk);
  }
  return chunks;
}
