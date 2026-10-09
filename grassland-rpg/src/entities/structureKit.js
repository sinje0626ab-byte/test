import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createRandom } from '../utils/random.js';

// 건물 모양 공용 키트 (기지·포탑·부속 건물·벽). ChatGPT 시안(docs/art/incoming/concept_*.webp)의
// 아기자기한 동화풍: 크림 천·따뜻한 나무·회색 돌 벽돌·산호빛 기와·이끼·빨간 잎 문장 깃발·풀밭 받침과 들꽃.
// 조각은 Kit 에 모았다가 재질(이름)별로 한 덩어리로 합친다 → 건물 하나가 그리기 호출 몇 번.
// 합친 모양은 key 로 기억해 같은 건물끼리 같이 쓰고(지우지 않는다), 재질은 건물마다 새로 만든다(피격 색).

// 재질 이름 → 모양. hit:false = 피격 번쩍임·파손 색에서 뺀다(빛·풀밭), basic = 빛나는 색(그림자·명암 없음)
export const PAL = {
  wood: { color: '#c18a52' },
  woodLight: { color: '#d9a666' },
  woodDark: { color: '#80542f' },
  log: { color: '#9a6a3c' },
  logEnd: { color: '#e2bf86' },
  stone: { color: '#c9c3b8' },
  stoneLight: { color: '#ddd8ce' },
  stoneDark: { color: '#a19a8f' },
  mortar: { color: '#8f887d' },
  roof: { color: '#e0654c' },
  roofDark: { color: '#c4503d' },
  thatch: { color: '#e4c25e' },
  thatchDark: { color: '#c9a443' },
  canvas: { color: '#f3e6c8' },
  canvasDark: { color: '#dcc8a0' },
  plaster: { color: '#f6ead0' },
  greenRoof: { color: '#7fa65a' },
  greenRoofDark: { color: '#678e48' },
  slate: { color: '#6f8f7a' },
  moss: { color: '#86b552' },
  leaf: { color: '#6faa47' },
  leafLight: { color: '#97cb5c' },
  grass: { color: '#a4cf62', hit: false, outline: false },
  grassEdge: { color: '#86b84f', hit: false, outline: false },
  sand: { color: '#e3cf9f', hit: false, outline: false },
  soil: { color: '#7a5636' },
  snow: { color: '#f4f8fb' },
  snowGround: { color: '#eef4f8', hit: false, outline: false },
  petal: { color: '#fffaf0', hit: false },
  petalPink: { color: '#ffb3c1', hit: false },
  pollen: { color: '#f7c948', hit: false },
  pebble: { color: '#c4bdb2', hit: false },
  red: { color: '#d4473b' },
  cream: { color: '#f7ecd2' },
  iron: { color: '#6a7078', metalness: 0.4, roughness: 0.5 },
  ironDark: { color: '#3f444b', metalness: 0.4, roughness: 0.5 },
  steel: { color: '#bfc8d0', metalness: 0.5, roughness: 0.35 },
  brass: { color: '#d9a640', metalness: 0.55, roughness: 0.35 },
  bronze: { color: '#c08a4a', metalness: 0.55, roughness: 0.4 },
  gold: { color: '#f0c24b', metalness: 0.6, roughness: 0.3 },
  rope: { color: '#dcc38c' },
  paper: { color: '#fbf1d8' },
  cloth: { color: '#f4efe4' },
  window: { color: '#79b9e3', roughness: 0.3 },
  door: { color: '#8a5a33' },
  mushroom: { color: '#e0503f' },
  spot: { color: '#fff6e6' },
  stem: { color: '#efe2c6' },
  potionPink: { color: '#e889d6', roughness: 0.25 },
  potionGreen: { color: '#7fdc7a', roughness: 0.25 },
  potionBlue: { color: '#7fb6f0', roughness: 0.25 },
  spore: { color: '#a8e05a', transparent: true, opacity: 0.7, emissive: '#5c9a2a', emissiveIntensity: 0.5, hit: false, outline: false },
  ice: { color: '#9fd6fb', roughness: 0.15, transparent: true, opacity: 0.9, emissive: '#3f87b5', emissiveIntensity: 0.35 },
  iceLight: { color: '#d9f1ff', roughness: 0.15, emissive: '#5a9fc8', emissiveIntensity: 0.25 },
  pine: { color: '#4f8a55' },
  ember: { color: '#ff8a3d', basic: true, hit: false },
  flame: { color: '#ffb347', basic: true, hit: false },
  flameCore: { color: '#ffe48a', basic: true, hit: false },
  glow: { color: '#ffd98a', basic: true, hit: false },
  smoke: { color: '#f2eee8', transparent: true, opacity: 0.75, hit: false, outline: false },
  coal: { color: '#3b3a3c' },
  jewel: { color: '#e0645a', emissive: '#e0645a', emissiveIntensity: 0.35 },
  jewelBlue: { color: '#5fb4ff', emissive: '#3a86d0', emissiveIntensity: 0.4 },
  apple: { color: '#e2483c' },
  water: { color: '#6aa7d8' },
  chalk: { color: '#3d4a44' },
};

export function material(name) {
  const s = PAL[name] ?? { color: name };
  if (s.basic) return new THREE.MeshBasicMaterial({ color: s.color });
  return new THREE.MeshStandardMaterial({
    color: s.color,
    flatShading: true,
    roughness: s.roughness ?? 0.85,
    metalness: s.metalness ?? 0,
    transparent: !!s.transparent,
    opacity: s.opacity ?? 1,
    emissive: s.emissive ?? '#000000',
    emissiveIntensity: s.emissiveIntensity ?? 1,
  });
}

const M4 = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const mat4 = (p = [0, 0, 0], r = [0, 0, 0], s = 1) => {
  E.set(r[0] ?? 0, r[1] ?? 0, r[2] ?? 0);
  Q.setFromEuler(E);
  if (Array.isArray(s)) S.set(s[0], s[1], s[2]); else S.set(s, s, s);
  return new THREE.Matrix4().compose(P.set(p[0], p[1], p[2]), Q, S);
};

// 조각 모음. add 는 새로 만든 모양을 받아 옮겨 담는다 (원본은 버린다)
export class Kit {
  constructor() { this.list = []; }

  add(geo, name, p, r, s) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    if (g !== geo) geo.dispose();
    for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal') g.deleteAttribute(a);
    g.applyMatrix4(mat4(p, r, s));
    this.list.push({ geo: g, name });
    return this;
  }

  // 다른 키트를 통째로 옮겨 넣기 (소품을 여러 자리에)
  put(kit, p, r, s) {
    const m = mat4(p, r, s);
    for (const { geo, name } of kit.list) this.list.push({ geo: geo.clone().applyMatrix4(m), name });
    return this;
  }

  box(w, h, d, name, p, r) { return this.add(new THREE.BoxGeometry(w, h, d), name, p, r); }
  cyl(rt, rb, h, seg, name, p, r) { return this.add(new THREE.CylinderGeometry(rt, rb, h, seg), name, p, r); }
  cone(rad, h, seg, name, p, r) { return this.add(new THREE.ConeGeometry(rad, h, seg), name, p, r); }
  ball(rad, name, p, s = 1, detail = 0) { return this.add(new THREE.IcosahedronGeometry(rad, detail), name, p, [0, 0, 0], s); }

  // 재질 이름별로 합친다 → [{ name, geo }]
  bake() {
    const by = new Map();
    for (const { geo, name } of this.list) {
      const arr = by.get(name) ?? [];
      arr.push(geo);
      by.set(name, arr);
    }
    const out = [];
    for (const [name, arr] of by) {
      const geo = mergeGeometries(arr);
      geo.computeBoundingSphere();
      geo.computeBoundingBox();
      for (const g of arr) g.dispose();
      out.push({ name, geo });
    }
    this.list = [];
    return out;
  }
}

const CACHE = new Map();
// 같은 key 는 한 번만 만든다. fn(kit) 이 조각을 채운다
export function baked(key, fn) {
  let b = CACHE.get(key);
  if (!b) {
    const k = new Kit();
    fn(k);
    b = k.bake();
    CACHE.set(key, b);
  }
  return b;
}

// 합친 모양을 메시로. parts = 피격 색을 바꾸는 메시(hit:false 재질 제외)
export function meshes(bakedList, parent) {
  const parts = [];
  const all = [];
  for (const { name, geo } of bakedList) {
    const m = new THREE.Mesh(geo, material(name));
    const spec = PAL[name] ?? {};
    m.castShadow = !spec.basic && spec.outline !== false;
    m.receiveShadow = !spec.basic;
    if (spec.outline === false) m.userData.outline = false;
    m.userData.shared = true;
    parent.add(m);
    all.push(m);
    if (spec.hit !== false && !spec.basic) parts.push(m);
  }
  return { all, parts };
}

// ── 소품 ─────────────────────────────────────────────────────────

const rng = (seed) => createRandom(seed * 7919 + 13);

// 풀밭 받침: 울퉁불퉁한 둥근 판 + 가장자리 풀덤불·클로버 + 들꽃 + 조약돌 (snow = 눈밭)
export function patch(k, r, { seed = 1, flowers = 7, bushes = 6, rocks = 2, snow = false, path = false, skip = null } = {}) {
  const R = rng(seed);
  const disc = new THREE.CylinderGeometry(r, r * 1.02, 0.08, 16);
  const pos = disc.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const d = Math.hypot(x, z);
    if (d < 0.01) continue;
    const a = Math.atan2(z, x);
    const f = 1 + Math.sin(a * 3 + seed) * 0.05 + Math.sin(a * 5 + seed * 2) * 0.04;
    pos.setX(i, x * f);
    pos.setZ(i, z * f);
  }
  k.add(disc, snow ? 'snowGround' : 'grass', [0, 0.02, 0]);
  if (path) k.add(new THREE.CylinderGeometry(r * 0.32, r * 0.36, 0.09, 9), 'sand', [0, 0.025, r * 0.72], [0, 0, 0], [1, 1, 0.75]);
  const free = (a) => !skip || !skip(a);
  const f = Math.min(1, Math.max(0.55, r / 2.2));
  for (let i = 0; i < bushes; i++) {
    const a = (i / bushes) * Math.PI * 2 + R.range(-0.3, 0.3);
    if (!free(a)) continue;
    const d = r * R.range(0.78, 0.95);
    bush(k, Math.cos(a) * d, Math.sin(a) * d, R.range(0.18, 0.28) * f, snow ? 'pine' : (i % 2 ? 'leaf' : 'leafLight'), snow);
  }
  for (let i = 0; i < flowers && !snow; i++) {
    const a = R.range(0, Math.PI * 2);
    if (!free(a)) continue;
    const d = r * R.range(0.55, 0.92);
    flower(k, Math.cos(a) * d, Math.sin(a) * d, i % 4 === 3 ? 'petalPink' : 'petal', 0.08, 1.5);
  }
  for (let i = 0; i < rocks; i++) {
    const a = R.range(0, Math.PI * 2);
    if (!free(a)) continue;
    const d = r * R.range(0.7, 0.92);
    k.add(new THREE.DodecahedronGeometry(R.range(0.09, 0.15), 0), snow ? 'stoneLight' : 'pebble', [Math.cos(a) * d, 0.07, Math.sin(a) * d], [R.range(0, 3), R.range(0, 3), 0], [1, 0.6, 1]);
  }
  if (snow) for (let i = 0; i < 5; i++) {
    const a = R.range(0, Math.PI * 2);
    const d = r * R.range(0.6, 0.9);
    k.ball(R.range(0.12, 0.2), 'snow', [Math.cos(a) * d, 0.06, Math.sin(a) * d], [1, 0.45, 1]);
  }
}

export function bush(k, x, z, s = 0.22, name = 'leaf', snowy = false) {
  if (snowy) {
    // 작은 눈 덮인 전나무
    k.cone(s * 0.9, s * 1.6, 6, 'pine', [x, s * 0.9, z]);
    k.cone(s * 0.55, s * 0.55, 6, 'snow', [x, s * 1.45, z]);
    return;
  }
  k.ball(s, name, [x, s * 0.6, z], [1, 0.8, 1]);
  k.ball(s * 0.75, name === 'leaf' ? 'leafLight' : 'leaf', [x + s * 0.6, s * 0.45, z + s * 0.2], [1, 0.8, 1]);
  k.ball(s * 0.6, 'leaf', [x - s * 0.5, s * 0.4, z + s * 0.35], [1, 0.8, 1]);
}

export function flower(k, x, z, petal = 'petal', y = 0.08, s = 1) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    k.ball(0.045 * s, petal, [x + Math.cos(a) * 0.05 * s, y, z + Math.sin(a) * 0.05 * s], [1, 0.45, 1]);
  }
  k.ball(0.03 * s, 'pollen', [x, y + 0.015, z]);
}

export function rock(k, x, z, s = 0.2, name = 'stoneDark') {
  k.add(new THREE.DodecahedronGeometry(s, 0), name, [x, s * 0.45, z], [0.4, x * 3, 0.2], [1.1, 0.7, 1]);
}

// 이끼·담쟁이 덩어리 (벽에 붙인다)
export function ivy(k, points, s = 0.09) {
  for (const [x, y, z, n = 3] of points) {
    for (let i = 0; i < n; i++) k.ball(s * (1 - i * 0.15), i % 2 ? 'leafLight' : 'leaf', [x + (i - 1) * s * 0.9, y - i * s * 0.8, z], [1, 1, 0.6]);
  }
}

export function crate(k, p, s = 0.4, ry = 0) {
  const c = new Kit();
  c.box(s, s, s, 'wood', [0, s / 2, 0]);
  const t = s * 0.1;
  for (const z of [-1, 1]) {
    for (const y of [t / 2, s - t / 2]) c.box(s + 0.01, t, t, 'woodDark', [0, y, z * (s / 2 - t / 2 + 0.006)]);
    for (const x of [-1, 1]) c.box(t, s, t, 'woodDark', [x * (s / 2 - t / 2 + 0.005), s / 2, z * (s / 2 - t / 2 + 0.006)]);
    c.box(s * 1.2, t * 0.8, t * 0.6, 'woodDark', [0, s / 2, z * (s / 2 + 0.008)], [0, 0, Math.PI / 4]);
  }
  k.put(c, p, [0, ry, 0]);
}

export function barrel(k, p, s = 0.3, lid = 'woodDark') {
  const pts = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    pts.push(new THREE.Vector2(s * (0.82 + Math.sin(t * Math.PI) * 0.18), t * s * 2.2));
  }
  k.add(new THREE.LatheGeometry(pts, 10), 'wood', p);
  k.cyl(s * 0.84, s * 0.84, 0.02, 10, lid, [p[0], p[1] + s * 2.2, p[2]]);
  for (const t of [0.2, 0.8]) k.add(new THREE.TorusGeometry(s * (0.84 + Math.sin(t * Math.PI) * 0.18) + 0.01, 0.022, 3, 12), 'iron', [p[0], p[1] + t * s * 2.2, p[2]], [Math.PI / 2, 0, 0]);
}

export function lantern(k, p, lit = true) {
  k.box(0.16, 0.03, 0.16, 'ironDark', [p[0], p[1] + 0.13, p[2]]);
  k.cone(0.1, 0.08, 4, 'ironDark', [p[0], p[1] + 0.18, p[2]], [0, Math.PI / 4, 0]);
  k.box(0.12, 0.18, 0.12, lit ? 'glow' : 'paper', p);
  k.box(0.15, 0.03, 0.15, 'ironDark', [p[0], p[1] - 0.1, p[2]]);
  k.add(new THREE.TorusGeometry(0.04, 0.012, 3, 8), 'ironDark', [p[0], p[1] + 0.24, p[2]]);
}

// 세 갈래 잎 문장 (앞면 +z, 두께 아주 얇게)
function leafShape(w, h) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(w, h * 0.45, 0, h);
  s.quadraticCurveTo(-w, h * 0.45, 0, 0);
  return s;
}
export function emblem(k, p, size = 0.12, ry = 0, name = 'cream') {
  const e = new Kit();
  for (const a of [-0.75, 0, 0.75]) {
    const g = new THREE.ExtrudeGeometry(leafShape(size * 0.28, size * (a ? 0.62 : 0.78)), { depth: 0.008, bevelEnabled: false, curveSegments: 3 });
    e.add(g, name, [0, -size * 0.3, 0], [0, 0, a]);
  }
  e.box(size * 0.06, size * 0.35, 0.008, name, [0, -size * 0.45, 0]);
  k.put(e, p, [0, ry, 0]);
}

// 매달린 빨간 깃발(아래가 V 로 파인 천) + 막대 + 잎 문장. p = 막대 가운데, 앞면 +z
export function banner(k, p, { w = 0.32, h = 0.5, ry = 0, rod = 'woodDark' } = {}) {
  const b = new Kit();
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(w / 2, -h);
  s.lineTo(0, -h + w * 0.35);
  s.lineTo(-w / 2, -h);
  s.closePath();
  b.add(new THREE.ExtrudeGeometry(s, { depth: 0.025, bevelEnabled: false }), 'red', [0, -0.02, 0]);
  b.box(w * 0.8, 0.03, 0.03, 'gold', [0, -h + w * 0.5, 0.03]);
  emblem(b, [0, -h * 0.4, 0.03], w * 0.55);
  b.cyl(0.022, 0.022, w + 0.1, 5, rod, [0, 0, 0.012], [0, 0, Math.PI / 2]);
  k.put(b, p, [0, ry, 0]);
}

// 깃대 + 휘날리는 삼각 깃발. 깃대는 키트에, 깃발은 따로 움직이는 Group 으로 돌려준다 (flagCloth)
export function flagPole(k, x, y, z, o = {}) {
  const h = o.h ?? 0.9;
  k.cyl(0.035, 0.04, h, 6, 'woodDark', [x, y + h / 2, z]);
  k.ball(0.05, 'gold', [x, y + h + 0.03, z]);
  return flagCloth(x, y, z, o);
}

// 깃대 자리가 원점이라 그 자리에서 흔들린다
export function flagCloth(x, y, z, { h = 0.9, len = 0.5, ht = 0.3 } = {}) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(len, 0);
  s.lineTo(len - ht * 0.4, ht / 2);
  s.lineTo(len, ht);
  s.lineTo(0, ht);
  s.closePath();
  const flag = new THREE.Group();
  const cloth = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false }), material('red'));
  cloth.position.set(0.03, -ht, -0.01);
  cloth.castShadow = true;
  const e = new Kit();
  emblem(e, [0.03 + len * 0.42, -ht * 0.55, 0.012], ht * 0.75);
  emblem(e, [0.03 + len * 0.42, -ht * 0.55, -0.012], ht * 0.75, Math.PI);
  flag.add(cloth);
  meshes(e.bake(), flag);
  flag.position.set(x, y + h - 0.02, z);
  return flag;
}

// 돌 벽돌 원통 (가운데 줄눈 원통 + 엇갈린 벽돌 줄). 위·아래 반지름이 다르면 비스듬히
export function brickTower(k, { r, rTop = r, y = 0, h, rows, n = 10, names = ['stone', 'stoneLight', 'stoneDark'], seed = 3 } = {}) {
  const R = rng(seed);
  k.cyl(rTop - 0.03, r - 0.03, h, n, 'mortar', [0, y + h / 2, 0]);
  const rowH = h / rows;
  for (let i = 0; i < rows; i++) {
    const t = (i + 0.5) / rows;
    const rr = r + (rTop - r) * t;
    const w = ((Math.PI * 2 * rr) / n) * 0.9;
    for (let j = 0; j < n; j++) {
      const a = ((j + (i % 2) * 0.5) / n) * Math.PI * 2;
      const name = names[Math.floor(R.next() * names.length)];
      k.box(w, rowH * 0.86, 0.12, name, [Math.cos(a) * rr, y + rowH * (i + 0.5), Math.sin(a) * rr], [0, -a + Math.PI / 2, 0]);
    }
  }
}

// 성가퀴(톱니) 고리
export function crenels(k, { r, y, n = 8, w = 0.26, h = 0.24, d = 0.18 } = {}) {
  k.cyl(r, r, 0.12, Math.max(n, 10), 'stone', [0, y + 0.06, 0]);
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2;
    k.box(w, h, d, j % 2 ? 'stoneLight' : 'stone', [Math.cos(a) * (r - d / 2), y + 0.12 + h / 2, Math.sin(a) * (r - d / 2)], [0, -a + Math.PI / 2, 0]);
  }
}

// 기와 고깔 지붕: 겹친 띠(아래가 조금 튀어나옴)를 번갈아 칠한다
export function tileCone(k, { r, h, y, rows = 4, seg = 10, names = ['roof', 'roofDark'] } = {}) {
  const rowH = h / (rows + 1);
  for (let i = 0; i < rows; i++) {
    const rb = r * (1 - i / (rows + 1)) + 0.04;
    const rt = r * (1 - (i + 1) / (rows + 1));
    k.cyl(rt, rb, rowH * 1.08, seg, names[i % names.length], [0, y + rowH * (i + 0.5), 0]);
  }
  k.cone(r / (rows + 1) + 0.02, rowH * 1.3, seg, names[rows % names.length], [0, y + rowH * (rows + 0.6), 0]);
}

// 박공지붕 (용마루가 x 축). 기와 띠를 층층이 얹는다. 앞뒤 경사, 박공 벽(삼각)은 wall 이름으로
export function gableRoof(k, { w, d, h, y, rows = 4, names = ['roof', 'roofDark'], over = 0.18, wall = null, ridge = 'woodDark', thick = 0.08 } = {}) {
  const half = d / 2 + over;
  const slope = Math.hypot(half, h * (half / (d / 2)));
  const ang = Math.atan2(h, d / 2);
  const step = slope / rows;
  for (const side of [-1, 1]) {
    for (let i = 0; i < rows; i++) {
      const t = (i + 0.5) / rows;
      const zz = side * (half - t * half);
      const yy = y + h * (1 - Math.abs(zz) / (d / 2));
      k.box(w + over * 2, thick, step * 1.12, names[i % names.length], [0, yy + 0.02 + (rows - i) * 0.006, zz], [side * ang, 0, 0]);
    }
  }
  k.box(w + over * 2 + 0.06, 0.12, 0.14, ridge, [0, y + h + 0.06, 0]);
  if (wall) {
    const s = new THREE.Shape();
    s.moveTo(-d / 2, 0);
    s.lineTo(d / 2, 0);
    s.lineTo(0, h);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: false });
    k.add(g, wall, [-w / 2, y, 0], [0, Math.PI / 2, 0]);
  }
}

// 판자 벽 상자 (세로 판자 두 색 번갈아 + 아래 위 띠)
export function plankBox(k, { w, h, d, p = [0, 0, 0], names = ['wood', 'woodLight'], n = 6, frame = 'woodDark' } = {}) {
  k.box(w - 0.02, h, d - 0.02, names[0], [p[0], p[1] + h / 2, p[2]]);
  const pw = w / n;
  for (const z of [-1, 1]) for (let i = 0; i < n; i++) k.box(pw * 0.94, h * 0.98, 0.04, names[i % 2], [p[0] - w / 2 + pw * (i + 0.5), p[1] + h / 2, p[2] + z * d / 2]);
  const pd = d / Math.max(2, Math.round(n * d / w));
  const nd = Math.round(d / pd);
  for (const x of [-1, 1]) for (let i = 0; i < nd; i++) k.box(0.04, h * 0.98, pd * 0.94, names[(i + 1) % 2], [p[0] + x * w / 2, p[1] + h / 2, p[2] - d / 2 + pd * (i + 0.5)]);
  if (frame) for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.box(0.1, h + 0.04, 0.1, frame, [p[0] + x * w / 2, p[1] + h / 2, p[2] + z * d / 2]);
}

// 통나무 (끝은 밝은 나이테)
export function logPiece(k, p, len, rad = 0.12, r = [0, 0, Math.PI / 2]) {
  const l = new Kit();
  l.cyl(rad, rad, len, 7, 'log', [0, 0, 0]);
  for (const s of [-1, 1]) l.cyl(rad * 0.85, rad * 0.85, 0.02, 7, 'logEnd', [0, s * len / 2, 0]);
  k.put(l, p, r);
}

// 작은 장작불 (불꽃은 따로 돌려주는 메시가 아니라 정지된 모양)
export function fire(k, p, s = 1) {
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    k.add(new THREE.DodecahedronGeometry(0.1 * s, 0), i % 2 ? 'stone' : 'stoneDark', [p[0] + Math.cos(a) * 0.28 * s, p[1] + 0.06 * s, p[2] + Math.sin(a) * 0.28 * s], [i, i * 2, 0], [1, 0.7, 1]);
  }
  for (let i = 0; i < 3; i++) k.box(0.06 * s, 0.06 * s, 0.38 * s, 'log', [p[0], p[1] + 0.06 * s, p[2]], [0, (i / 3) * Math.PI, 0]);
  k.cone(0.13 * s, 0.34 * s, 5, 'flame', [p[0], p[1] + 0.25 * s, p[2]]);
  k.cone(0.07 * s, 0.22 * s, 5, 'flameCore', [p[0], p[1] + 0.22 * s, p[2] + 0.03 * s]);
}

// 창문 (나무 틀 + 하늘색 유리 + 십자 살) 앞면 +z
export function windowFrame(k, p, w = 0.36, h = 0.4, ry = 0, box = true) {
  const f = new Kit();
  f.box(w + 0.08, h + 0.08, 0.05, 'woodDark', [0, 0, 0]);
  f.box(w, h, 0.06, 'window', [0, 0, 0.005]);
  f.box(0.03, h, 0.075, 'woodDark', [0, 0, 0.005]);
  f.box(w, 0.03, 0.075, 'woodDark', [0, 0, 0.005]);
  if (box) {
    f.box(w + 0.12, 0.12, 0.14, 'wood', [0, -h / 2 - 0.08, 0.08]);
    for (let i = 0; i < 3; i++) flower(f, -w / 3 + i * (w / 3), 0.06, i === 1 ? 'petalPink' : 'petal', -h / 2 - 0.0, 0.9);
    for (let i = 0; i < 3; i++) f.ball(0.06, 'leaf', [-w / 2.4 + i * (w / 2.4), -h / 2 - 0.02, 0.1], [1, 0.7, 0.8]);
  }
  k.put(f, p, [0, ry, 0]);
}

// 문 (판자 + 쇠 경첩 + 손잡이) 앞면 +z, p = 아래 가운데
export function door(k, p, w = 0.5, h = 0.8, ry = 0, arch = true) {
  const d = new Kit();
  d.box(w + 0.1, h + 0.06, 0.05, 'woodDark', [0, h / 2, 0]);
  for (let i = 0; i < 3; i++) d.box(w / 3 * 0.94, h, 0.07, i % 2 ? 'door' : 'wood', [-w / 3 + i * w / 3, h / 2, 0.01]);
  if (arch) d.cyl(w / 2, w / 2, 0.07, 10, 'door', [0, h, 0.01], [Math.PI / 2, 0, 0]);
  for (const y of [0.25, 0.7]) d.box(w * 0.8, 0.04, 0.09, 'iron', [0, h * y, 0.01]);
  d.ball(0.03, 'brass', [w * 0.3, h * 0.48, 0.06]);
  k.put(d, p, [0, ry, 0]);
}

// 계단 판자 (앞 +z)
export function steps(k, p, w = 0.6, n = 2, ry = 0) {
  const s = new Kit();
  for (let i = 0; i < n; i++) s.box(w, 0.1, 0.22, i % 2 ? 'woodLight' : 'wood', [0, 0.05 + i * 0.1, -(i * 0.18)]);
  k.put(s, p, [0, ry, 0]);
}

// 짧은 나무 울타리 (x 방향)
export function fence(k, p, len = 0.8, ry = 0, posts = 3) {
  const f = new Kit();
  for (let i = 0; i < posts; i++) {
    const x = -len / 2 + (len / (posts - 1)) * i;
    f.box(0.07, 0.36, 0.07, 'wood', [x, 0.18, 0]);
    f.cone(0.05, 0.07, 4, 'wood', [x, 0.39, 0], [0, Math.PI / 4, 0]);
  }
  for (const y of [0.13, 0.27]) f.box(len, 0.05, 0.04, 'woodLight', [0, y, 0.04]);
  k.put(f, p, [0, ry, 0]);
}

// 두 점을 잇는 막대 (밧줄·사슬·버팀대)
export function beam(k, a, b, rad = 0.02, name = 'rope', seg = 4) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const len = A.distanceTo(B);
  const g = new THREE.CylinderGeometry(rad, rad, len, seg);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()));
  return k.add(g, name, [(A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2]);
}

// 돌 벽돌 벽 (x 방향 길이 w, 두께 d). 줄마다 엇갈린 벽돌
export function blockWall(k, { w, h, d, p = [0, 0, 0], rows = 4, bw = 0.38, names = ['stone', 'stoneLight', 'stoneDark'], seed = 5, ry = 0 } = {}) {
  const R = rng(seed);
  const b = new Kit();
  b.box(w - 0.04, h, d - 0.04, 'mortar', [0, h / 2, 0]);
  const rh = h / rows;
  for (let i = 0; i < rows; i++) {
    const off = (i % 2) * bw * 0.5;
    for (let x = -w / 2 - off; x < w / 2 - 0.02; x += bw) {
      const x0 = Math.max(-w / 2, x);
      const x1 = Math.min(w / 2, x + bw);
      if (x1 - x0 < 0.06) continue;
      b.box((x1 - x0) * 0.94, rh * 0.88, d, names[Math.floor(R.next() * names.length)], [(x0 + x1) / 2, rh * (i + 0.5), 0]);
    }
  }
  k.put(b, p, [0, ry, 0]);
}
