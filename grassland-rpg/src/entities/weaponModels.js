import * as THREE from 'three';

// 무기 3D 모양. 아이템마다 재질(나무·금속·얼음·금·젤리)과 장식이 다르다.
// 아이콘(ui/itemArt.js)과 같은 팔레트를 쓴다. 피벗 기준 오른손 자리에서 앞(+z)으로 뻗는다.

const MAT = {
  wood: { color: '#b07e4f', roughness: 0.85 },
  darkwood: { color: '#7c5236', roughness: 0.85 },
  bark: { color: '#8a6443', roughness: 0.9 },
  bamboo: { color: '#b8b96a', roughness: 0.7 },
  twine: { color: '#d9c48f', roughness: 0.95 },
  leather: { color: '#94603c', roughness: 0.9 },
  stone: { color: '#9ea1a3', roughness: 0.95 },
  sand: { color: '#d6ae76', roughness: 0.95 },
  steel: { color: '#c3ccd4', roughness: 0.32, metalness: 0.55 },
  iron: { color: '#8f969c', roughness: 0.45, metalness: 0.5 },
  bronze: { color: '#c08a4a', roughness: 0.4, metalness: 0.55 },
  gold: { color: '#e0b34a', roughness: 0.3, metalness: 0.65 },
  ice: { color: '#a9d8ec', roughness: 0.15, transparent: true, opacity: 0.85, emissive: '#3a7fa0', emissiveIntensity: 0.25 },
  jelly: { color: '#8fcf7e', roughness: 0.2, transparent: true, opacity: 0.85, emissive: '#2f6a2a', emissiveIntensity: 0.2 },
  moss: { color: '#6f914c', roughness: 0.95 },
  cloth: { color: '#d8c39a', roughness: 0.95 },
};
const cache = new Map();
function mat(spec) {
  const key = typeof spec === 'string' ? spec : JSON.stringify(spec);
  if (!cache.has(key)) {
    const s = typeof spec === 'string' ? (MAT[spec] ?? { color: spec }) : spec;
    cache.set(key, new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.6, ...s }));
  }
  return cache.get(key);
}
const glowMat = (color, strength = 0.6) => mat({ color, emissive: color, emissiveIntensity: strength, roughness: 0.3 });

function builder() {
  const g = new THREE.Group();
  const add = (geo, m, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, typeof m === 'string' || !m.isMaterial ? mat(m) : m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    g.add(mesh);
    return mesh;
  };
  return { g, add };
}
const cyl = (r1, r2, len, seg = 6) => new THREE.CylinderGeometry(r1, r2, len, seg).rotateX(Math.PI / 2);

// 손잡이 + 감은 끈
function gripOf(add, m, z1, z2, r = 0.034) {
  add(cyl(r, r, z2 - z1), m, 0, 0, (z1 + z2) / 2);
  for (let z = z1 + 0.05; z < z2 - 0.02; z += 0.07) add(cyl(r + 0.006, r + 0.006, 0.025), m === 'twine' ? 'bark' : 'darkwood', 0, 0, z);
}

// ── 검 ──
function sword(o) {
  const { g, add } = builder();
  if (o.kind === 'twig') {
    // 나뭇가지를 깎아 만든 검: 살짝 휜 두 마디 + 곁가지 + 끈으로 묶은 가로대
    gripOf(add, 'bark', -0.02, 0.2, 0.03);
    add(new THREE.BoxGeometry(0.3, 0.05, 0.05), 'bark', 0, 0, 0.23).rotation.y = 0.12;
    add(new THREE.BoxGeometry(0.06, 0.06, 0.06), 'twine', 0, 0, 0.23).rotation.z = 0.7;
    const a = add(cyl(0.035, 0.045, 0.45), 'wood', 0.005, 0, 0.47);
    a.rotation.y = 0.05;
    const b = add(cyl(0.02, 0.034, 0.36), 'wood', 0.02, 0, 0.86);
    b.rotation.y = -0.06;
    add(new THREE.ConeGeometry(0.02, 0.1, 5).rotateX(Math.PI / 2), 'wood', 0.028, 0, 1.08);
    add(cyl(0.008, 0.012, 0.14), 'bark', 0.06, 0.01, 0.62).rotation.y = 0.8;
    add(new THREE.SphereGeometry(0.03, 5, 4), 'bark', 0.04, 0.02, 0.55);
    return g;
  }
  const w = o.width ?? 0.1;
  const len = o.long ? 0.82 : 0.7;
  gripOf(add, o.grip ?? 'leather', -0.02, 0.2);
  add(new THREE.OctahedronGeometry(0.05, 0), o.pommel ?? o.guard ?? 'bronze', 0, 0, -0.06);
  // 가로대: 가운데 굵고 끝은 둥글게
  const gw = o.guardW ?? 0.3;
  add(new THREE.BoxGeometry(gw, 0.06, 0.06), o.guard ?? 'bronze', 0, 0, 0.24);
  if (o.guardTips) for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.04, 6, 4), o.guard, (s * gw) / 2, 0, 0.24);
  if (o.gem) add(new THREE.OctahedronGeometry(0.035, 0), glowMat(o.gem, 0.5), 0, 0.035, 0.24);
  // 날: 몸통 + 납작한 뾰족 끝 + 가운데 홈
  const bm = o.blade;
  add(new THREE.BoxGeometry(w, 0.028, len), bm, 0, 0, 0.27 + len / 2);
  const tip = add(new THREE.ConeGeometry(w * 0.72, w * 1.8, 4).rotateX(Math.PI / 2).rotateZ(Math.PI / 4), bm, 0, 0, 0.27 + len + w * 0.9);
  tip.scale.set(1, 0.28, 1);
  add(new THREE.BoxGeometry(w * 0.22, 0.034, len * 0.8), o.fuller ?? mat({ color: '#8f9aa4', roughness: 0.4, metalness: 0.5 }), 0, 0, 0.27 + len * 0.45);
  if (o.rune) add(new THREE.OctahedronGeometry(0.03, 0), glowMat(o.rune, 0.9), 0, 0.02, 0.4);
  return g;
}

// ── 창 ──
function spear(o) {
  const { g, add } = builder();
  if (o.bamboo) {
    add(cyl(0.035, 0.035, 1.7), 'bamboo', 0, 0, 0.55);
    for (const z of [0.05, 0.4, 0.75, 1.1]) add(cyl(0.042, 0.042, 0.03), mat({ color: '#8f9050', roughness: 0.8 }), 0, 0, z);
  } else {
    add(cyl(0.032, 0.036, 1.7), o.shaft ?? 'wood', 0, 0, 0.55);
    gripOf(add, 'leather', -0.05, 0.25, 0.037);
    add(cyl(0.04, 0.03, 0.08), 'iron', 0, 0, -0.32);
  }
  add(cyl(0.045, 0.04, 0.1), o.socket ?? (o.bamboo ? 'twine' : 'iron'), 0, 0, 1.42);
  const h = o.head;
  if (o.kind === 'stinger') {
    // 전갈 꼬리: 굽은 마디 셋 + 독침
    add(new THREE.SphereGeometry(0.06, 6, 4), h, 0, 0, 1.52).scale.set(1, 0.8, 1.3);
    add(new THREE.SphereGeometry(0.05, 6, 4), h, 0, 0.03, 1.62).scale.set(1, 0.8, 1.3);
    const sting = add(new THREE.ConeGeometry(0.045, 0.22, 5).rotateX(Math.PI / 2), h, 0, 0.07, 1.76);
    sting.rotation.x = -0.45;
    add(new THREE.SphereGeometry(0.018, 5, 4), glowMat('#b7e05a', 0.8), 0, 0.1, 1.84);
  } else if (o.kind === 'ice') {
    add(new THREE.OctahedronGeometry(0.12, 0), 'ice', 0, 0, 1.68).scale.set(0.8, 0.6, 2.6);
    add(new THREE.OctahedronGeometry(0.04, 0), 'ice', 0.05, 0, 1.47).scale.set(0.6, 0.6, 1.6);
    add(new THREE.OctahedronGeometry(0.04, 0), 'ice', -0.05, 0, 1.47).scale.set(0.6, 0.6, 1.6);
  } else if (o.kind === 'point') {
    add(new THREE.OctahedronGeometry(0.07, 0), 'stone', 0, 0, 1.58).scale.set(0.9, 0.55, 2.2);
    add(cyl(0.05, 0.05, 0.04), 'twine', 0, 0, 1.5);
  } else {
    // 잎 모양 창날 + 가운데 능선
    add(new THREE.OctahedronGeometry(0.1, 0), h, 0, 0, 1.62).scale.set(0.85, 0.3, 2.3);
    add(new THREE.BoxGeometry(0.012, 0.04, 0.34), 'iron', 0, 0, 1.6);
  }
  if (o.tassel) add(new THREE.ConeGeometry(0.035, 0.16, 5), o.tassel, 0.02, -0.08, 1.38);
  return g;
}

// ── 망치 ──
function hammer(o) {
  const { g, add } = builder();
  add(cyl(0.036, 0.042, 0.9), o.shaft ?? 'wood', 0, 0, 0.35);
  gripOf(add, o.grip ?? 'leather', -0.08, 0.2, 0.044);
  const h = o.head;
  if (o.kind === 'rock') {
    add(new THREE.DodecahedronGeometry(0.2, 0), h, 0, 0, 0.82).scale.set(1.35, 0.95, 0.9);
    add(new THREE.BoxGeometry(0.1, 0.24, 0.24), 'twine', 0, 0, 0.8);
  } else if (o.kind === 'mace') {
    add(new THREE.IcosahedronGeometry(0.17, 0), h, 0, 0, 0.84);
    for (const [x, y, z] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0.6, 0.6, 0.5], [-0.6, -0.6, 0.5]]) {
      add(new THREE.OctahedronGeometry(0.045, 0), 'iron', x * 0.17, y * 0.17, 0.84 + z * 0.17);
    }
    add(new THREE.IcosahedronGeometry(0.1, 0), 'moss', 0.06, 0.1, 0.9).scale.set(1, 0.5, 1);
  } else if (o.kind === 'ice') {
    add(new THREE.OctahedronGeometry(0.22, 0), 'ice', 0, 0, 0.82).scale.set(1.35, 0.85, 0.85);
    add(new THREE.BoxGeometry(0.08, 0.2, 0.2), 'iron', 0, 0, 0.82);
  } else {
    // 사암 망치: 층이 보이는 큰 덩어리 + 쇠 띠
    add(new THREE.BoxGeometry(0.46, 0.14, 0.3), h, 0, 0.07, 0.82);
    add(new THREE.BoxGeometry(0.44, 0.14, 0.29), mat({ color: '#c49a62', roughness: 0.95 }), 0, -0.07, 0.82);
    add(new THREE.BoxGeometry(0.1, 0.3, 0.32), 'iron', 0, 0, 0.82);
  }
  if (o.glow) add(new THREE.OctahedronGeometry(0.04, 0), glowMat(o.glow, 0.9), 0, 0.12, 0.82);
  return g;
}

// ── 활 ──
function bow(o) {
  const { g, add } = builder();
  const limb = add(new THREE.TorusGeometry(0.5, 0.034, 5, 16, Math.PI), o.limb, 0, 0, 0.35);
  limb.rotation.set(0, Math.PI / 2, Math.PI / 2);
  // 가운데 손잡이 + 끝 장식
  add(cyl(0.05, 0.05, 0.14).rotateX(Math.PI / 2), o.grip ?? 'leather', 0, 0, 0.85);
  for (const s of [-1, 1]) {
    const tip = add(new THREE.ConeGeometry(0.04, o.recurve ? 0.14 : 0.08, 5), o.tipM ?? o.limb, 0, s * 0.5, 0.35 + (o.recurve ? 0.04 : 0));
    tip.rotation.x = s > 0 ? (o.recurve ? -0.8 : 0) : Math.PI + (o.recurve ? 0.8 : 0);
  }
  add(new THREE.CylinderGeometry(0.006, 0.006, 1.0, 3), mat({ color: '#f3ecd8', roughness: 0.9 }), 0, 0, 0.35);
  if (o.gem) add(new THREE.OctahedronGeometry(0.035, 0), glowMat(o.gem, 0.8), 0, 0, 0.9);
  if (o.leaves) for (const s of [-1, 1]) add(new THREE.IcosahedronGeometry(0.05, 0), 'moss', 0.03, s * 0.36, 0.72).scale.set(1, 1.6, 0.6);
  return g;
}

const bright = (c, e = 0.25) => mat({ color: c, roughness: 0.3, metalness: 0.4, emissive: c, emissiveIntensity: e });

const SPECS = {
  default: ['sword', { blade: 'steel', guard: 'iron', grip: 'leather' }],
  twig_sword: ['sword', { kind: 'twig' }],
  iron_sword: ['sword', { blade: 'steel', guard: 'iron', grip: 'leather', pommel: 'iron' }],
  ice_sword: ['sword', { blade: 'ice', guard: mat({ color: '#7fa8c8', roughness: 0.4, metalness: 0.4 }), grip: mat({ color: '#5a6e8a', roughness: 0.9 }), fuller: mat({ color: '#e8f8ff', roughness: 0.1, transparent: true, opacity: 0.8 }) }],
  sun_blade: ['sword', { blade: bright('#efd9a0', 0.15), guard: 'gold', grip: mat({ color: '#8a3a2c', roughness: 0.9 }), gem: '#f08a3a', guardTips: true, rune: '#f3a04a', fuller: 'gold' }],
  jelly_greatsword: ['sword', { blade: 'jelly', width: 0.15, long: true, guard: 'gold', grip: mat({ color: '#5a7a4a', roughness: 0.9 }), gem: '#e59ab8', guardW: 0.36, fuller: mat({ color: '#c8f0b0', transparent: true, opacity: 0.7 }) }],
  dawn_blade: ['sword', { blade: bright('#f6e7c4', 0.3), width: 0.11, long: true, guard: 'gold', grip: mat({ color: '#3a2e5a', roughness: 0.9 }), gem: '#f39a3a', rune: '#ff9a4a', guardTips: true, guardW: 0.34, fuller: bright('#ffb35a', 0.6) }],

  bamboo_spear: ['spear', { bamboo: true, kind: 'point' }],
  iron_spear: ['spear', { head: 'steel' }],
  scorpion_pike: ['spear', { kind: 'stinger', head: mat({ color: '#b0643a', roughness: 0.5 }), shaft: 'darkwood', socket: 'bronze', tassel: 'sand' }],
  frost_lance: ['spear', { kind: 'ice', shaft: mat({ color: '#7a8ea4', roughness: 0.6 }), socket: mat({ color: '#cfe2ee', roughness: 0.3, metalness: 0.5 }), tassel: mat({ color: '#ece6da', roughness: 1 }) }],

  stone_hammer: ['hammer', { kind: 'rock', head: 'stone', grip: 'twine' }],
  mossy_mace: ['hammer', { kind: 'mace', head: 'iron', shaft: 'darkwood' }],
  sandstone_maul: ['hammer', { kind: 'block', head: 'sand', grip: mat({ color: '#b0613f', roughness: 0.9 }) }],
  glacier_hammer: ['hammer', { kind: 'ice', shaft: mat({ color: '#7a8ea4', roughness: 0.6 }), grip: mat({ color: '#5a6e8a', roughness: 0.9 }), glow: '#bfefff' }],

  short_bow: ['bow', { limb: 'wood', grip: 'twine' }],
  hunter_bow: ['bow', { limb: 'darkwood', grip: 'leather', recurve: true, tipM: 'bronze' }],
  dune_bow: ['bow', { limb: mat({ color: '#c9955a', roughness: 0.8 }), grip: mat({ color: '#b0613f', roughness: 0.9 }), recurve: true, tipM: 'gold' }],
  aurora_bow: ['bow', { limb: mat({ color: '#8f86c8', roughness: 0.4, emissive: '#6fb8a8', emissiveIntensity: 0.25 }), grip: mat({ color: '#3e4a6e', roughness: 0.9 }), recurve: true, gem: '#9fe3cf' }],
  heartwood_bow: ['bow', { limb: mat({ color: '#6e4a30', roughness: 0.85 }), grip: 'moss', recurve: true, leaves: true, gem: '#d8e8a0' }],
};
const BUILD = { sword, spear, hammer, bow };

// 아이템 id 로 모양을 고른다. 아트가 없는 무기는 종류 기본형 + 아이템 색
export function buildWeapon(type, color, id) {
  const spec = SPECS[id] ?? (type === 'sword' || !type
    ? ['sword', { blade: mat({ color, roughness: 0.35, metalness: 0.4 }), guard: 'bronze' }]
    : [type, { head: mat({ color, roughness: 0.4, metalness: 0.3 }), limb: mat({ color, roughness: 0.8 }), kind: 'block' }]);
  return BUILD[spec[0]](spec[1]);
}

// 강화 외형: 색을 바꾸지 않고 장식이 붙는다. +3 금 테(손잡이), +4 금 테 + 보석, +5 은은한 금빛 기운 (더하기 섞기)
const enhanceGold = mat('gold');
export function addEnhanceLook(g, plus = 0) {
  if (plus < 3) return g;
  const box = new THREE.Box3().setFromObject(g);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const alongY = size.y > size.z; // 활은 세로로 선다
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.014, 5, 12), enhanceGold);
  if (alongY) ring.position.set(0, 0, 0.85); else ring.position.set(0, 0, 0.12);
  g.add(ring);
  if (plus >= 4) {
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.03, 0), glowMat('#ffd27a', 0.9));
    gem.position.copy(ring.position).add(new THREE.Vector3(0, 0.05, 0));
    g.add(gem);
  }
  if (plus >= 5) {
    const len = alongY ? size.y : size.z;
    const aura = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, len * 0.9, 6, 1, true),
      new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    if (!alongY) aura.rotation.x = Math.PI / 2;
    aura.position.copy(center).sub(g.position);
    g.add(aura);
  }
  return g;
}
