import * as THREE from 'three';
import { Kit, PAL } from '../entities/structureKit.js';

// 지역 장식 모양 (시안 docs/art/incoming/concept_environment.webp). 건물 키트로 조각을 모아
// 꼭짓점 색 한 덩어리로 굽는다 → 종류마다 InstancedMesh 하나 (Decor.js·Chunk.js).
// 발밑이 y=0, 크기는 1배일 때 실제 미터. tint: true 인 것(풀포기·꽃)은 하얗게 만들어 지역 팔레트 색을 곱한다.

Object.assign(PAL, {
  bark: { color: '#8c5c38' },
  barkDark: { color: '#6e4528' },
  leafDeep: { color: '#5e9f3e' },
  leafMid: { color: '#78b84a' },
  leafTop: { color: '#9bd05c' },
  oakDeep: { color: '#4f8f3a' },
  oakTop: { color: '#86c252' },
  pineDeep: { color: '#3c7f48' },
  pineMid: { color: '#4f9554' },
  pineTop: { color: '#62a85e' },
  fern: { color: '#69ad48' },
  sandstone: { color: '#d9925a' },
  sandstoneLight: { color: '#e9ac72' },
  sandstoneDark: { color: '#b97843' },
  dryTwig: { color: '#c39457' },
  bone: { color: '#efe5cf' },
  horn: { color: '#76563a' },
  bell: { color: '#8a86e6' },
  white: { color: '#ffffff' },
  frost: { color: '#e9f4fb' },
  frostBlue: { color: '#c7e3f5' },
  cactus: { color: '#5fa64f' },
  cactusLight: { color: '#7dbd5f' },
});

export const ico = (k, r, name, p, s = 1, d = 1) => k.add(new THREE.IcosahedronGeometry(r, d), name, p, [0, 0, 0], s);

// 줄기 + 뿌리 셋
export function trunk(k, h, r0, r1, name = 'bark') {
  k.cyl(r1, r0, h, 7, name, [0, h / 2, 0]);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    k.cone(r0 * 0.55, r0 * 2.2, 5, name, [Math.cos(a) * r0 * 0.9, r0 * 0.35, Math.sin(a) * r0 * 0.9], [Math.sin(a) * 1.25, 0, -Math.cos(a) * 1.25]);
  }
}
// 뭉게 나무 머리: 아래 짙은 덩어리 → 위 밝은 덩어리
export function crown(k, y, r, deep, mid, top) {
  ico(k, r, mid, [0, y, 0], [1, 0.85, 1]);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ico(k, r * 0.58, i % 2 ? deep : mid, [Math.cos(a) * r * 0.72, y - r * 0.25, Math.sin(a) * r * 0.72], [1, 0.85, 1]);
  }
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    ico(k, r * 0.5, top, [Math.cos(a) * r * 0.35, y + r * 0.55, Math.sin(a) * r * 0.35], [1, 0.85, 1]);
  }
}
export function blade(k, x, z, h, name, lean = 0.25, a = 0) {
  k.cone(0.05, h, 3, name, [x + Math.cos(a) * lean * h * 0.3, h / 2, z + Math.sin(a) * lean * h * 0.3], [Math.sin(a) * lean, 0, -Math.cos(a) * lean]);
}
export function bloom(k, x, y, z, petal = 'petal', s = 1) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    k.ball(0.05 * s, petal, [x + Math.cos(a) * 0.055 * s, y, z + Math.sin(a) * 0.055 * s], [1, 0.45, 1]);
  }
  k.ball(0.032 * s, 'pollen', [x, y + 0.015, z]);
}
// 층층 전나무 (아래 단이 크고 끝이 살짝 들린 원뿔), snow = 단마다 눈
export function pineTiers(k, snow) {
  trunk(k, 1.0, 0.24, 0.18, 'barkDark');
  const tiers = [[1.25, 1.1, 0.75], [1.0, 1.0, 1.4], [0.75, 0.9, 2.0], [0.48, 0.8, 2.55]];
  tiers.forEach(([r, h, y], i) => {
    const g = new THREE.ConeGeometry(r, h, 9, 1);
    const pos = g.attributes.position;
    for (let j = 0; j < pos.count; j++) if (pos.getY(j) < 0) { const q = Math.atan2(pos.getZ(j), pos.getX(j)); pos.setY(j, pos.getY(j) + Math.abs(Math.sin(q * 4.5)) * 0.12); }
    k.add(g, ['pineDeep', 'pineMid', 'pineMid', 'pineTop'][i], [0, y, 0]);
    if (snow) {
      const s = new THREE.ConeGeometry(r * 0.72, h * 0.45, 9, 1);
      k.add(s, 'snow', [0, y + h * 0.3, 0]);
    }
  });
  if (snow) k.ball(0.14, 'snow', [0, 3.0, 0]);
}

export const PROPS = {
  // ── 초원 ──
  tree(k) {
    trunk(k, 1.4, 0.32, 0.22);
    crown(k, 2.0, 1.05, 'leafDeep', 'leafMid', 'leafTop');
    for (let i = 0; i < 4; i++) blade(k, 0.35 * Math.cos(i * 1.6), 0.35 * Math.sin(i * 1.6), 0.28, 'leafMid', 0.3, i * 1.6);
    bloom(k, 0.4, 0.06, 0.25);
  },
  treeSmall(k) {
    trunk(k, 1.0, 0.2, 0.14);
    crown(k, 1.45, 0.68, 'leafDeep', 'leafMid', 'leafTop');
    bloom(k, -0.3, 0.06, 0.2);
  },
  blossomTree(k) {
    trunk(k, 1.4, 0.32, 0.22);
    crown(k, 2.0, 1.05, 'leafDeep', 'leafMid', 'leafTop');
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      bloom(k, Math.cos(a) * 0.95, 2.1 + Math.sin(i * 1.3) * 0.45, Math.sin(a) * 0.95, i % 2 ? 'petalPink' : 'petal', 1.6);
    }
  },
  flowerBush(k) {
    ico(k, 0.45, 'leafMid', [0, 0.32, 0], [1.2, 0.8, 1]);
    ico(k, 0.32, 'leafDeep', [0.42, 0.22, 0.12], [1, 0.8, 1]);
    ico(k, 0.3, 'leafTop', [-0.38, 0.24, -0.1], [1, 0.8, 1]);
    for (let i = 0; i < 6; i++) {
      const a = i * 1.05;
      bloom(k, Math.cos(a) * 0.42, 0.42 + (i % 2) * 0.12, Math.sin(a) * 0.36, i % 3 === 1 ? 'petalPink' : 'petal', 1.3);
    }
  },
  rockMoss(k) {
    k.add(new THREE.DodecahedronGeometry(0.6, 0), 'stone', [0, 0.38, 0], [0.2, 0.5, 0], [1.1, 0.85, 1]);
    k.add(new THREE.DodecahedronGeometry(0.32, 0), 'stoneDark', [0.55, 0.18, 0.25], [0.4, 1, 0], [1, 0.8, 1]);
    ico(k, 0.42, 'moss', [0, 0.82, 0], [1.2, 0.3, 1.1]);
    for (let i = 0; i < 3; i++) blade(k, -0.5 + i * 0.15, 0.45, 0.25, 'leafMid', 0.3, i);
    bloom(k, -0.45, 0.06, 0.5);
  },
  pebbles(k) {
    for (const [x, z, s] of [[0, 0, 0.16], [0.25, 0.12, 0.11], [-0.2, 0.18, 0.09], [0.1, -0.22, 0.08]]) k.add(new THREE.DodecahedronGeometry(s, 0), x > 0 ? 'stone' : 'stoneDark', [x, s * 0.5, z], [x * 5, z * 5, 0], [1.2, 0.7, 1]);
    blade(k, 0.3, -0.1, 0.2, 'leafMid', 0.3, 1);
  },
  tuft(k) {
    for (let i = 0; i < 5; i++) blade(k, Math.cos(i * 1.3) * 0.06, Math.sin(i * 1.3) * 0.06, 0.28 + (i % 3) * 0.08, 'white', 0.35, i * 1.3);
  },
  flower(k) {
    bloom(k, 0, 0.12, 0, 'white', 1.3);
    k.cyl(0.012, 0.012, 0.12, 3, 'leafMid', [0, 0.06, 0]);
  },
  // ── 숲 ──
  pine(k) { pineTiers(k, false); },
  oak(k) {
    trunk(k, 1.7, 0.42, 0.28, 'bark');
    for (const a of [0.8, 2.6, 4.4]) k.cyl(0.08, 0.12, 0.8, 5, 'bark', [Math.cos(a) * 0.35, 1.6, Math.sin(a) * 0.35], [Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7]);
    crown(k, 2.4, 1.25, 'oakDeep', 'leafDeep', 'oakTop');
    ico(k, 0.25, 'moss', [0.3, 0.5, 0.3], [1, 0.6, 0.8]);
  },
  fern(k) {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const f = new THREE.ConeGeometry(0.11, 0.85, 4);
      f.scale(1, 1, 0.25);
      k.add(f, i % 2 ? 'fern' : 'leafMid', [Math.cos(a) * 0.32, 0.3, Math.sin(a) * 0.32], [Math.sin(a) * 1.0, 0, -Math.cos(a) * 1.0]);
    }
    ico(k, 0.14, 'fern', [0, 0.1, 0]);
  },
  mushrooms(k) {
    for (const [x, z, s] of [[0, 0, 1], [0.28, 0.18, 0.6], [-0.22, 0.2, 0.5]]) {
      k.cyl(0.07 * s, 0.09 * s, 0.32 * s, 6, 'stem', [x, 0.16 * s, z]);
      k.add(new THREE.SphereGeometry(0.24 * s, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), 'mushroom', [x, 0.3 * s, z], [0, 0, 0], [1, 0.75, 1]);
      for (let i = 0; i < 4; i++) {
        const a = i * 1.7 + x * 3;
        k.ball(0.035 * s, 'spot', [x + Math.cos(a) * 0.15 * s, 0.42 * s, z + Math.sin(a) * 0.15 * s], [1, 0.5, 1]);
      }
    }
    blade(k, -0.3, -0.15, 0.2, 'leafMid', 0.3, 2);
  },
  log(k) {
    k.cyl(0.24, 0.26, 1.7, 8, 'bark', [0, 0.24, 0], [0, 0, Math.PI / 2]);
    for (const s of [-1, 1]) k.cyl(0.2, 0.2, 0.02, 8, 'logEnd', [s * 0.86, 0.24, 0], [0, 0, Math.PI / 2]);
    ico(k, 0.3, 'moss', [-0.2, 0.44, 0], [2.2, 0.35, 0.8]);
    ico(k, 0.18, 'leafTop', [0.35, 0.46, 0.05], [1.4, 0.35, 0.8]);
    k.cyl(0.03, 0.03, 0.12, 5, 'stem', [0.5, 0.5, 0.08]);
    k.add(new THREE.SphereGeometry(0.08, 6, 3, 0, Math.PI * 2, 0, Math.PI / 2), 'mushroom', [0.5, 0.56, 0.08]);
  },
  bells(k) {
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1;
      const x = Math.cos(a) * 0.12;
      const z = Math.sin(a) * 0.12;
      k.cyl(0.015, 0.015, 0.5, 3, 'leafMid', [x, 0.25, z], [Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15]);
      k.cone(0.07, 0.12, 6, 'bell', [x * 1.6, 0.46, z * 1.6], [Math.PI, 0, 0]);
    }
    for (let i = 0; i < 4; i++) blade(k, Math.cos(i * 1.6) * 0.1, Math.sin(i * 1.6) * 0.1, 0.25, 'fern', 0.4, i * 1.6);
  },
  // ── 사막 ──
  sandRock(k) {
    const cols = ['sandstoneDark', 'sandstone', 'sandstoneLight', 'sandstone'];
    for (let i = 0; i < 4; i++) k.box(1.5 - i * 0.28, 0.32, 1.2 - i * 0.2, cols[i], [(i % 2) * 0.08 - 0.04, 0.16 + i * 0.31, (i % 2) * -0.06], [0, i * 0.15, 0]);
    k.cone(0.06, 0.25, 4, 'cactus', [0.7, 0.12, 0.45]);
  },
  arch(k) {
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) k.box(0.62 - (i % 2) * 0.08, 0.36, 0.6, i % 2 ? 'sandstoneLight' : 'sandstone', [s * 0.95, 0.18 + i * 0.35, 0], [0, i * 0.1 * s, 0]);
    for (let i = 0; i < 3; i++) k.box(0.9, 0.34, 0.62, i === 1 ? 'sandstoneLight' : 'sandstoneDark', [-0.75 + i * 0.75, 1.55, 0], [0, 0, (i - 1) * -0.12]);
  },
  dryBush(k) {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      k.cyl(0.015, 0.03, 0.6, 3, 'dryTwig', [Math.cos(a) * 0.15, 0.28, Math.sin(a) * 0.15], [Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6]);
    }
    ico(k, 0.22, 'dryTwig', [0, 0.25, 0], [1.3, 0.8, 1.3], 0);
  },
  cactusSmall(k) {
    k.cyl(0.24, 0.27, 0.8, 8, 'cactus', [0, 0.4, 0]);
    k.ball(0.24, 'cactus', [0, 0.8, 0], [1, 0.6, 1]);
    for (const s of [-1, 1]) {
      k.cyl(0.1, 0.1, 0.22, 6, 'cactusLight', [s * 0.3, 0.45, 0], [0, 0, Math.PI / 2]);
      k.cyl(0.1, 0.1, 0.3, 6, 'cactusLight', [s * 0.4, 0.6, 0]);
      k.ball(0.1, 'cactusLight', [s * 0.4, 0.75, 0], [1, 0.6, 1]);
    }
    bloom(k, 0, 0.92, 0, 'petalPink', 1.5);
  },
  skull(k) {
    k.box(0.32, 0.22, 0.42, 'bone', [0, 0.12, 0]);
    k.box(0.2, 0.14, 0.24, 'bone', [0, 0.08, 0.3]);
    for (const s of [-1, 1]) {
      k.box(0.07, 0.07, 0.03, 'barkDark', [s * 0.08, 0.15, 0.21]);
      k.add(new THREE.TorusGeometry(0.16, 0.045, 4, 8, Math.PI * 0.7), 'horn', [s * 0.18, 0.22, -0.12], [Math.PI / 2, 0, s > 0 ? -0.3 : Math.PI + 0.3]);
    }
  },
  // ── 설원 ──
  snowPine(k) { pineTiers(k, true); },
  frostTree(k) {
    trunk(k, 1.4, 0.28, 0.19);
    crown(k, 2.0, 0.95, 'frostBlue', 'frost', 'snow');
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      k.cone(0.05, 0.3, 4, 'iceLight', [Math.cos(a) * 0.85, 1.55, Math.sin(a) * 0.85], [Math.PI, 0, 0]);
    }
  },
  iceRock(k) {
    k.add(new THREE.DodecahedronGeometry(0.55, 0), 'stoneDark', [0, 0.36, 0], [0.3, 0.6, 0], [1.1, 0.85, 1]);
    for (const [x, z, s, r] of [[0.35, 0.1, 1, -0.3], [0.5, -0.2, 0.7, -0.6], [0.2, 0.35, 0.6, -0.1]]) k.add(new THREE.OctahedronGeometry(0.16 * s, 0), 'ice', [x, 0.5 * s, z], [0, 0, r], [1, 2.3, 1]);
    ico(k, 0.4, 'snow', [-0.1, 0.72, 0], [1.2, 0.3, 1.1]);
  },
  snowBush(k) {
    ico(k, 0.45, 'pineMid', [0, 0.32, 0], [1.2, 0.8, 1]);
    ico(k, 0.3, 'pineDeep', [0.4, 0.22, 0.1], [1, 0.8, 1]);
    for (const [x, z, s] of [[0, 0, 0.35], [0.35, 0.1, 0.22], [-0.25, -0.1, 0.25]]) ico(k, s, 'snow', [x, 0.5 + s * 0.1, z], [1.2, 0.4, 1]);
  },
  drift(k) {
    ico(k, 0.7, 'snow', [0, 0, 0], [1.6, 0.45, 1.1]);
    ico(k, 0.4, 'frost', [0.7, 0, 0.2], [1.3, 0.45, 1]);
    for (let i = 0; i < 2; i++) blade(k, -0.4 + i * 0.9, 0.45, 0.25, 'dryTwig', 0.3, i * 2);
  },
};

// 꼭짓점 색 모양 (한 번만)
export function propGeometries() {
  const out = {};
  for (const [key, fn] of Object.entries(PROPS)) {
    const k = new Kit();
    fn(k);
    out[key] = k.bakeColored();
  }
  return out;
}
