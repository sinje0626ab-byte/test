import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Chunk } from './Chunk.js';

// 여러 조각을 한 모양으로 합친다 (인스턴스 하나 = 그리기 호출 그대로). 위치·법선만 남긴다.
function merged(parts) {
  return mergeGeometries(parts.map(([geo, x, y, z, sx = 1, sy = sx, sz = sx]) => {
    const g = (geo.index ? geo.toNonIndexed() : geo.clone()).scale(sx, sy, sz).translate(x, y, z);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
    return g;
  }));
}
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

  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 1, 6).translate(0, 0.5, 0);
  const coneGeo = new THREE.ConeGeometry(1, 1.8, 7).translate(0, 0.9, 0);
  const ico = new THREE.IcosahedronGeometry(1, 0);
  // 둥근 나무 머리: 큰 덩어리 + 옆 두 덩어리 + 위 작은 덩어리 (뭉게뭉게 실루엣)
  const crownGeo = merged([[ico, 0, 0, 0, 0.9], [ico, 0.55, -0.15, 0.2, 0.62], [ico, -0.5, -0.1, -0.25, 0.6], [ico, 0.05, 0.5, -0.05, 0.55]]);
  // 바위: 큰 돌 + 기대 선 작은 돌
  const dode = new THREE.DodecahedronGeometry(0.6, 0);
  const rockGeo = merged([[dode, 0, 0, 0, 1], [dode, 0.5, -0.12, 0.25, 0.45, 0.55, 0.5]]);
  // 덤불: 낮은 덩어리 셋
  const bushGeo = merged([[ico, 0, 0, 0, 0.85], [ico, 0.6, -0.1, 0.1, 0.6], [ico, -0.55, -0.12, -0.1, 0.55]]);
  // 꽃: 꽃잎 다섯 장 + 가운데
  const petal = new THREE.SphereGeometry(0.055, 5, 3);
  const flowerGeo = merged([...[0, 1, 2, 3, 4].map((i) => [petal, Math.cos(i * 1.257) * 0.07, 0, Math.sin(i * 1.257) * 0.07, 1, 0.45, 1]), [petal, 0, 0.02, 0, 0.7, 0.6, 0.7]]);
  const geos = {
    trunk: trunkGeo, pineLow: coneGeo, pineTop: coneGeo, crown: crownGeo,
    rock: rockGeo, bush: bushGeo,
    flower: flowerGeo,
    tuft: new THREE.ConeGeometry(0.07, 0.34, 3).translate(0, 0.17, 0),
    stem: new THREE.CylinderGeometry(0.07, 0.09, 0.3, 6).translate(0, 0.15, 0),
    cap: new THREE.SphereGeometry(0.22, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2),
    snowCap: new THREE.ConeGeometry(0.62, 0.7, 7).translate(0, 0.35, 0),
    cactus: new THREE.CylinderGeometry(0.28, 0.32, 1, 7).translate(0, 0.5, 0),
    cactusArm: new THREE.CylinderGeometry(0.16, 0.16, 1, 6).translate(0, 0.5, 0),
  };
  const noShadow = new Set(['flower', 'tuft']);

  const pine = (x, z, s, pal, collide = true) => {
    const ry = r.range(0, Math.PI);
    const col = new THREE.Color(r.pick(pal.pine));
    push('trunk', x, 0, z, s, s * 0.9, s, 0x9a6a45, ry);
    push('pineLow', x, 0.75 * s, z, s * 1.05, s, s * 1.05, col, ry);
    push('pineTop', x, 1.75 * s, z, s * 0.72, s * 0.85, s * 0.72, col.clone().offsetHSL(0, 0, 0.04), ry + 0.4);
    if (pal.snow) push('snowCap', x, 2.55 * s, z, s * 0.75, s * 0.75, s * 0.75, '#ffffff', ry);
    if (collide) world.addCollider(x, z, 0.4 * s);
  };

  // 지역마다 면적에 비례한 개수를 뿌린다. 경계는 조금씩 흔들어 자연스럽게.
  for (const reg of regions.list) {
    const z0 = Math.max(reg.zFrom, bounds.minZ);
    const z1 = Math.min(reg.zTo, bounds.maxZ);
    if (z1 <= z0) continue;
    const area = (bounds.maxX - bounds.minX) * (z1 - z0);
    const count = (k) => Math.round((reg.decor[k] * area) / 1000);
    const pal = reg.palette;
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
      if (p) pine(p[0], p[1], r.range(0.8, 1.35), pal);
    }
    for (let i = 0; i < count('roundTrees'); i++) {
      const p = spot(1.6);
      if (!p) continue;
      const s = r.range(0.85, 1.3);
      push('trunk', p[0], 0, p[1], s, s * 1.3, s, 0x9a6a45);
      const color = r.next() < 0.18 ? r.pick(pal.blossom) : r.pick(pal.round);
      push('crown', p[0], 1.9 * s, p[1], s * 1.15, s, s * 1.15, color, r.range(0, 3), r.range(-0.2, 0.2));
      world.addCollider(p[0], p[1], 0.4 * s);
    }
    for (let i = 0; i < count('rocks'); i++) {
      const p = spot(1.2);
      if (!p) continue;
      const s = r.range(0.6, 1.5);
      push('rock', p[0], 0.18 * s, p[1], s, s * r.range(0.55, 0.8), s * r.range(0.8, 1.1), r.pick(pal.rock), r.range(0, 6), r.range(-0.3, 0.3));
      world.addCollider(p[0], p[1], 0.55 * s);
    }
    for (let i = 0; i < count('bushes'); i++) {
      const p = spot(0.8);
      if (!p) continue;
      const s = r.range(0.45, 0.75);
      push('bush', p[0], 0.3 * s, p[1], s * 1.2, s * 0.8, s, r.pick(pal.round), r.range(0, 6));
    }
    for (let i = 0; i < count('flowers'); i++) {
      const p = spot(0);
      if (p) push('flower', p[0], 0.12, p[1], 1, 0.6, 1, r.pick(pal.flower), r.range(0, 6));
    }
    for (let i = 0; i < count('tufts'); i++) {
      const p = spot(0);
      if (!p) continue;
      const col = r.pick(pal.tuft);
      for (let k = 0; k < 3; k++) {
        push('tuft', p[0] + r.range(-0.12, 0.12), 0, p[1] + r.range(-0.12, 0.12), 1, r.range(0.7, 1.3), 1, col, r.range(0, 6), r.range(-0.35, 0.35));
      }
    }
    for (let i = 0; i < count('cacti'); i++) {
      const p = spot(1.0);
      if (!p) continue;
      const s = r.range(0.8, 1.6);
      const col = r.pick(['#5fa85a', '#6fb866', '#4f9a4a']);
      push('cactus', p[0], 0, p[1], s, s * r.range(1.4, 2.2), s, col);
      const arms = r.int(0, 2);
      for (let k = 0; k < arms; k++) {
        const side = k === 0 ? 1 : -1;
        push('cactusArm', p[0] + side * 0.32 * s, s * r.range(0.8, 1.3), p[1], s, s * r.range(0.5, 0.9), s, col, 0, 0);
      }
      world.addCollider(p[0], p[1], 0.35 * s);
    }
    for (let i = 0; i < count('mushrooms'); i++) {
      const p = spot(0.5);
      if (!p) continue;
      const s = r.range(0.7, 1.4);
      push('stem', p[0], 0, p[1], s, s, s, '#f4e6cf');
      push('cap', p[0], 0.28 * s, p[1], s, s * 0.8, s, r.pick(['#e0574f', '#f08a4b', '#c9a0ff']));
    }
  }

  // 월드 가장자리 침엽수 벽 (밖으로 몇 겹)
  const edge = world.cfg.edgeTrees;
  const ring = (x, z) => pine(x, z, r.range(1, 1.5), regions.at(x, z).palette, false);
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

  const mats = Object.fromEntries(Object.keys(geos).map((k) => [k, new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.9 })]));
  const chunks = [];
  for (const [ci, kinds] of byChunk) {
    const chunk = new Chunk(scene, ci, size);
    chunk.build(kinds, geos, mats, noShadow);
    chunks.push(chunk);
  }
  return chunks;
}
