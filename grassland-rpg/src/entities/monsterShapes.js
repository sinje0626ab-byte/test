import * as THREE from 'three';
import { kit, tone, shade } from './monsterKit.js';

// 필드 몬스터 모양 (monsterKit 공통 디자인). 좌표는 반지름(r) 단위, 앞 = +z.
// 지역이 멀어질수록 장식이 늘어난다: 초원(말랑·단순) → 숲(버섯·이끼·나무) → 사막(가시·거친 결) → 설원(얼음·털)

const sphere = (k, s, w = 10, h = 8) => new THREE.SphereGeometry(k.r * s, w, h);
const ico = (k, s, d = 1) => new THREE.IcosahedronGeometry(k.r * s, d);
const cone = (k, rad, h, seg = 5) => new THREE.ConeGeometry(k.r * rad, k.r * h, seg);
const cyl = (k, r1, r2, h, seg = 8) => new THREE.CylinderGeometry(k.r * r1, k.r * r2, k.r * h, seg);

// ── 슬라임: 반투명 젤리 + 안쪽 핵 + 광택 ──
function slime(def, id) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.roughness = 0.22;
  mat.opacity = 0.9;
  add(ico(k, 1, 2), mat, 0, 0.78, 0, [1.05, 0.8, 1.05]);
  add(ico(k, 0.42, 1), std(shade(def.color, -0.18), { opacity: 0.55, roughness: 0.4 }), 0, 0.62, -0.05);
  const gloss = basic('#ffffff', { opacity: 0.75 });
  add(sphere(k, 0.16, 6, 4), gloss, -0.42, 1.18, 0.34, [1, 0.6, 0.7]);
  add(sphere(k, 0.07, 5, 4), gloss, -0.2, 1.36, 0.28);
  k.eyes({ y: 0.92, z: 1.0, spread: 0.3, size: 0.13 });
  k.mouth(0.7, 1.02, 0.09);
  k.blush(0.74, 0.97, 0.5);
  if (id === 'sand_slime') {
    // 모래 알갱이가 박힌 젤리
    const grit = std(shade(def.color, -0.28), { roughness: 1 });
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      const h = 0.35 + (i % 3) * 0.28;
      add(sphere(k, 0.05, 4, 3), grit, Math.cos(a) * (1 - h * 0.3), h + 0.3, Math.sin(a) * (1 - h * 0.3));
    }
  } else if (id === 'snow_slime') {
    // 머리에 쌓인 눈 + 푸른 핵
    add(ico(k, 0.62, 1), std('#fbfdff', { roughness: 0.9 }), 0, 1.3, -0.05, [1.2, 0.42, 1.1]);
    add(ico(k, 0.18, 0), std('#bfe6ff', { opacity: 0.85, roughness: 0.1 }), 0.3, 1.45, -0.2);
  } else if (id === 'night_slime') {
    // 핵 안에 작은 별
    add(new THREE.OctahedronGeometry(k.r * 0.16, 0), basic('#f4e9ff'), 0, 0.62, -0.05);
  } else if (id === 'big_slime') {
    // 속에 떠 있는 기포
    const bub = basic('#ffffff', { opacity: 0.35 });
    for (const [x, y, z, s] of [[0.3, 0.5, 0.2, 0.1], [-0.25, 0.9, -0.3, 0.08], [0.15, 1.05, -0.1, 0.06]]) add(sphere(k, s, 6, 4), bub, x, y, z);
  }
  return k;
}

// ── 버섯: 줄기 몸 + 갓 + 주름 + 점 ──
function mushroom(def, id) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  const stemC = tone(def.stemColor ?? '#f4e6cf');
  const stem = std(stemC, { roughness: 0.8 });
  add(cyl(k, 0.5, 0.62, 1.05, 9), stem, 0, 0.55, 0);
  for (const s of [-1, 1]) add(sphere(k, 0.2, 6, 4), stem, s * 0.3, 0.08, 0.15, [1, 0.6, 1.3]);
  // 갓: 반구 + 아래 주름 원판
  add(new THREE.SphereGeometry(k.r * 1.15, 12, 7, 0, Math.PI * 2, 0, Math.PI * 0.55), mat, 0, 0.98, 0, [1, 0.78, 1]);
  add(cyl(k, 1.08, 0.7, 0.14, 14), std(shade(stemC, -0.12), { roughness: 0.9 }), 0, 1.02, 0);
  const night = id === 'night_mushroom';
  const dot = night ? basic('#e9dcff') : std('#fbf3e4', { roughness: 0.9 });
  for (const [a, e] of [[0.4, 0.55], [2.3, 0.45], [4.1, 0.6], [1.3, 0.85], [5.4, 0.3], [3.2, 0.8]]) {
    const x = Math.cos(a) * Math.sin(e) * 1.13;
    const z = Math.sin(a) * Math.sin(e) * 1.13;
    const y = 0.98 + Math.cos(e) * 1.13 * 0.78;
    const d = add(sphere(k, 0.15, 6, 4), dot, x, y, z, [1, 0.45, 1]);
    d.lookAt(d.position.clone().multiplyScalar(2).setY(d.position.y * 2 - 0.98 * k.r));
    d.rotateX(Math.PI / 2);
  }
  k.eyes({ y: 0.62, z: 0.62, spread: 0.2, size: 0.12 });
  k.mouth(0.42, 0.66, 0.08);
  k.blush(0.46, 0.62, 0.35);
  return k;
}

// ── 선인장: 골진 몸통 + 둥근 머리 + 팔 + 가시 + 꽃 ──
function cactus(def, id) {
  const k = kit(def);
  const { add, mat, std } = k;
  add(cyl(k, 0.55, 0.62, 1.6, 8), mat, 0, 0.8, 0);
  add(new THREE.SphereGeometry(k.r * 0.55, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), mat, 0, 1.6, 0);
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? 1.0 : 0.8;
    add(cyl(k, 0.2, 0.2, 0.5, 7), mat, s * 0.72, y0, 0).rotation.z = Math.PI / 2;
    add(cyl(k, 0.2, 0.2, 0.55, 7), mat, s * 0.95, y0 + 0.3, 0);
    add(new THREE.SphereGeometry(k.r * 0.2, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), mat, s * 0.95, y0 + 0.57, 0);
  }
  // 가시: 몸통 둘레에 작은 흰 가시
  const spine = std('#efe6c8', { roughness: 0.6 });
  for (let i = 0; i < 14; i++) {
    const a = i * 2.39;
    const y = 0.35 + (i % 5) * 0.28;
    const s = add(cone(k, 0.035, 0.18, 3), spine, Math.sin(a) * 0.6, y, Math.cos(a) * 0.6);
    s.rotation.set(Math.cos(a) * 1.4, 0, -Math.sin(a) * 1.4);
  }
  // 꽃
  const petal = std(tone(def.flowerColor ?? '#ff8fb1'), { roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const a = i * 1.257;
    add(sphere(k, 0.12, 6, 4), petal, Math.cos(a) * 0.14, 2.14, Math.sin(a) * 0.14, [1, 0.4, 1]);
  }
  add(sphere(k, 0.07, 6, 4), std('#ffd97a'), 0, 2.18, 0);
  // 발밑 모래 둔덕
  add(cyl(k, 0.7, 0.85, 0.12, 9), std('#d6b27a', { roughness: 1 }), 0, 0.06, 0);
  k.eyes({ y: 1.25, z: 0.62, spread: 0.2, size: 0.11, mean: true, browColor: shade(def.color, -0.25) });
  k.mouth(1.03, 0.64, 0.07);
  if (id === 'cactus_king') {
    const gold = std('#e0b34a', { roughness: 0.3, metalness: 0.6 });
    add(cyl(k, 0.34, 0.38, 0.18, 10), gold, 0, 1.92, 0);
    for (let i = 0; i < 6; i++) add(cone(k, 0.07, 0.24, 4), gold, Math.cos(i * 1.047) * 0.34, 2.1, Math.sin(i * 1.047) * 0.34);
    add(new THREE.OctahedronGeometry(k.r * 0.07, 0), std('#e59ab8', { emissive: '#a04a6a', emissiveIntensity: 0.4 }), 0, 1.93, 0.38);
  }
  return k;
}

// ── 골렘: 바위 덩어리 몸 + 어깨 얼음 결정 + 빛나는 눈 틈 ──
function golem(def, id) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.roughness = 0.5;
  const rock = std(shade(def.color, -0.2), { roughness: 0.95 });
  const crystal = std(tone(def.color, { light: 0.12 }), { opacity: 0.85, roughness: 0.1, emissive: tone(def.color), emissiveIntensity: 0.15 });
  add(new THREE.DodecahedronGeometry(k.r * 0.85, 0), mat, 0, 1.05, 0, [1.15, 1, 0.9]);
  add(new THREE.DodecahedronGeometry(k.r * 0.42, 0), rock, 0, 0.95, 0.5, [1.2, 0.8, 0.5]);
  add(new THREE.BoxGeometry(k.r * 0.72, k.r * 0.55, k.r * 0.62), rock, 0, 1.92, 0.05).rotation.y = 0.12;
  for (const s of [-1, 1]) {
    add(new THREE.IcosahedronGeometry(k.r * 0.36, 0), rock, s * 1.05, 0.72, 0.12);
    add(new THREE.BoxGeometry(k.r * 0.34, k.r * 0.5, k.r * 0.36), rock, s * 0.4, 0.25, 0);
    // 어깨 결정 두세 개
    for (const [dx, dy, rz, h] of [[0, 0.3, 0.2, 0.7], [0.18, 0.15, 0.7, 0.45]]) {
      const c = add(new THREE.OctahedronGeometry(k.r * 0.18, 0), crystal, s * (0.75 + dx), 1.55 + dy, -0.1, [0.7, h * 2.4, 0.7]);
      c.rotation.z = -s * rz;
    }
  }
  const glow = basic(id === 'night_golem' ? '#d6c2ff' : '#e8fbff');
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(k.r * 0.16, k.r * 0.07, k.r * 0.05), glow, s * 0.17, 1.98, 0.37);
  if (id === 'ice_giant') {
    // 등에 솟은 큰 결정과 이마 결정
    for (const [x, z, h, rz] of [[0, -0.55, 1.2, 0], [-0.35, -0.45, 0.8, 0.4], [0.35, -0.45, 0.8, -0.4]]) {
      add(new THREE.OctahedronGeometry(k.r * 0.22, 0), crystal, x, 1.6, z, [0.8, h * 2.2, 0.8]).rotation.set(-0.4, 0, rz);
    }
    add(new THREE.OctahedronGeometry(k.r * 0.12, 0), crystal, 0, 2.3, 0.2, [0.8, 2, 0.8]);
  }
  return k;
}

// ── 초원 ──
function bee(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.roughness = 0.7;
  const dark = std('#3a3030', { roughness: 0.9 });
  add(sphere(k, 1), mat, 0, 0, -0.1, [0.9, 0.85, 1.15]);
  for (const z of [-0.45, 0.05]) add(new THREE.TorusGeometry(k.r * 0.86, k.r * 0.12, 5, 16), dark, 0, 0, z).rotation.y = Math.PI / 2;
  add(sphere(k, 0.6), mat, 0, 0.1, 0.95);
  for (const s of [-1, 1]) {
    add(cyl(k, 0.03, 0.03, 0.5, 4), dark, s * 0.2, 0.75, 1.1).rotation.x = -0.5;
    add(sphere(k, 0.08, 5, 4), dark, s * 0.24, 0.98, 1.25);
  }
  add(cone(k, 0.14, 0.4, 5).rotateX(-Math.PI / 2), dark, 0, 0, -1.3);
  const wing = basic('#ffffff', { opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
  k.wings = [];
  for (const s of [-1, 1]) for (const [sz, z] of [[0.75, 0.1], [0.5, -0.35]]) {
    const w = add(new THREE.CircleGeometry(k.r * sz, 10), wing, s * 0.6, 0.85, z);
    w.rotation.set(-Math.PI / 2, 0, s * 0.4);
    w.scale.set(1, 0.6, 1);
    k.wings.push(w);
  }
  k.eyes({ y: 0.3, z: 1.5, spread: 0.24, size: 0.13 });
  return k;
}

function rabbit(def) {
  const k = kit(def);
  const { add, mat, std } = k;
  mat.color = tone('#f3ede2');
  const pink = std('#f0a9b0');
  const ivory = std('#e8d8b0', { roughness: 0.5 });
  add(ico(k, 1, 1), mat, 0, 0.78, -0.1, [1, 0.85, 1.15]);
  add(ico(k, 0.62, 1), mat, 0, 1.45, 0.62);
  for (const s of [-1, 1]) {
    const ear = add(new THREE.CapsuleGeometry(k.r * 0.13, k.r * 0.75, 2, 6), mat, s * 0.2, 2.2, 0.5);
    ear.rotation.set(-0.25, 0, s * 0.18);
    const inner = add(new THREE.CapsuleGeometry(k.r * 0.07, k.r * 0.6, 2, 5), pink, s * 0.2, 2.2, 0.58);
    inner.rotation.copy(ear.rotation);
    add(sphere(k, 0.22, 6, 4), mat, s * 0.42, 0.18, 0.5, [0.8, 0.5, 1.3]);
  }
  const horn = add(cone(k, 0.1, 0.55, 6), ivory, 0, 1.95, 1.0);
  horn.rotation.x = 0.7;
  add(ico(k, 0.25, 0), std('#ffffff', { roughness: 1 }), 0, 0.9, -1.05);
  add(sphere(k, 0.07, 5, 4), pink, 0, 1.4, 1.2);
  k.eyes({ y: 1.55, z: 1.2, spread: 0.24, size: 0.11, mean: true, browColor: '#b8a898' });
  return k;
}

// ── 숲 ──
function puff(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  const stem = std('#f1e3c8', { roughness: 0.9 });
  add(cyl(k, 0.35, 0.48, 0.8, 8), stem, 0, 0.4, 0);
  add(new THREE.SphereGeometry(k.r * 1.05, 12, 8), mat, 0, 1.18, 0, [1, 0.82, 1]);
  add(cyl(k, 0.7, 0.4, 0.12, 12), std('#d8c6ea'), 0, 0.82, 0);
  const spot = std('#ece0ff', { roughness: 0.9 });
  for (let i = 0; i < 6; i++) add(sphere(k, 0.15, 6, 4), spot, Math.cos(i * 1.2) * 0.8, 1.3 + (i % 2) * 0.22, Math.sin(i * 1.2) * 0.8, [1, 0.6, 1]);
  // 떠다니는 포자
  const spore = basic('#d9c2ff', { opacity: 0.8 });
  for (const [x, y, z] of [[0.6, 2.0, 0.2], [-0.5, 2.2, -0.3], [0.1, 2.45, 0.1]]) add(sphere(k, 0.07, 5, 4), spore, x, y, z);
  k.eyes({ y: 0.55, z: 0.5, spread: 0.18, size: 0.11 });
  k.mouth(0.36, 0.52, 0.07);
  return k;
}

function wolf(def) {
  const k = kit(def);
  const { add, mat, std } = k;
  const belly = std(shade(def.color, 0.15));
  const dark = std(shade(def.color, -0.18));
  const thorn = std('#d8e2a8', { roughness: 0.5 });
  add(new THREE.CapsuleGeometry(k.r * 0.5, k.r * 1.1, 3, 8).rotateX(Math.PI / 2), mat, 0, 0.95, -0.05);
  add(new THREE.CapsuleGeometry(k.r * 0.38, k.r * 0.8, 3, 8).rotateX(Math.PI / 2), belly, 0, 0.78, 0);
  add(ico(k, 0.46, 1), mat, 0, 1.3, 1.0);
  add(new THREE.BoxGeometry(k.r * 0.36, k.r * 0.3, k.r * 0.5), belly, 0, 1.18, 1.38);
  add(sphere(k, 0.08, 5, 4), dark, 0, 1.3, 1.63);
  for (const s of [-1, 1]) add(cone(k, 0.14, 0.38, 4), dark, s * 0.24, 1.75, 0.9).rotation.z = -s * 0.2;
  for (let i = 0; i < 5; i++) add(cone(k, 0.1, 0.42 - i * 0.04, 4), thorn, 0, 1.45, 0.55 - i * 0.32).rotation.x = -0.35;
  const tail = add(cone(k, 0.14, 0.8, 5), mat, 0, 1.15, -1.05);
  tail.rotation.x = -2.3;
  for (const [x, z] of [[-0.28, 0.55], [0.28, 0.55], [-0.28, -0.5], [0.28, -0.5]]) add(cyl(k, 0.1, 0.08, 0.7, 5), dark, x, 0.35, z);
  k.eyes({ y: 1.42, z: 1.45, spread: 0.19, size: 0.1, mean: true, browColor: shade(def.color, -0.3) });
  // 포식자 눈빛: 노란 동공
  k.eyeMat.color = new THREE.Color('#f2c44a');
  k.eyeMat.emissive = new THREE.Color('#4a3a08');
  return k;
}

function stump(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  const ring = std('#e2c790', { roughness: 0.9 });
  const leaf = std('#6fa050');
  const moss = std('#6f914c', { roughness: 1 });
  add(cyl(k, 0.8, 0.95, 1.4, 9), mat, 0, 0.7, 0);
  add(cyl(k, 0.78, 0.78, 0.05, 9), ring, 0, 1.42, 0);
  add(new THREE.TorusGeometry(k.r * 0.45, k.r * 0.03, 3, 12), std(shade(def.color, -0.1)), 0, 1.45, 0).rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) add(ico(k, 0.26, 0), leaf, Math.cos(i * 1.6) * 0.4, 1.62, Math.sin(i * 1.6) * 0.4);
  add(ico(k, 0.3, 0), moss, 0.45, 1.0, 0.55, [1, 0.5, 0.6]);
  for (const s of [-1, 1]) add(cyl(k, 0.1, 0.16, 0.9, 5), mat, s * 0.95, 0.8, 0.1).rotation.z = s * 0.7;
  // 뿌리 발
  for (let i = 0; i < 5; i++) {
    const a = i * 1.257 + 0.3;
    const root = add(cone(k, 0.14, 0.6, 5), mat, Math.cos(a) * 0.9, 0.12, Math.sin(a) * 0.9);
    root.rotation.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3);
  }
  // 움푹한 눈구멍 속 빛
  const hole = std('#2a1c12', { roughness: 1 });
  const glint = basic('#ffe7a0');
  for (const s of [-1, 1]) {
    add(sphere(k, 0.14, 6, 4), hole, s * 0.28, 0.95, 0.78, [1, 1.2, 0.5]);
    add(sphere(k, 0.06, 5, 4), glint, s * 0.28, 0.95, 0.85);
  }
  add(new THREE.BoxGeometry(k.r * 0.4, k.r * 0.08, k.r * 0.1), hole, 0, 0.62, 0.86);
  return k;
}

// ── 사막 ──
function scorpion(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  const dark = std(shade(def.color, -0.18), { roughness: 0.5 });
  const venom = basic('#b8e05a');
  add(sphere(k, 1), mat, 0, 0.5, 0, [1.05, 0.5, 1.35]);
  for (let i = 0; i < 3; i++) add(sphere(k, 0.55 - i * 0.08, 8, 5), dark, 0, 0.55, -0.7 - i * 0.2, [1.4, 0.5, 0.6]);
  for (const s of [-1, 1]) {
    add(cyl(k, 0.1, 0.12, 0.75, 5), mat, s * 0.55, 0.5, 1.0).rotation.x = Math.PI / 2 - 0.3;
    add(sphere(k, 0.26, 6, 4), dark, s * 0.65, 0.55, 1.5, [1, 0.6, 1.3]);
    add(cone(k, 0.08, 0.35, 4), dark, s * 0.55, 0.55, 1.8).rotation.set(Math.PI / 2, 0, s * 0.3);
    add(cone(k, 0.08, 0.35, 4), dark, s * 0.75, 0.55, 1.8).rotation.set(Math.PI / 2, 0, -s * 0.3);
    for (let j = 0; j < 3; j++) {
      const leg = add(cyl(k, 0.05, 0.04, 0.7, 4), dark, s * 0.95, 0.3, 0.4 - j * 0.45);
      leg.rotation.z = s * 1.0;
    }
  }
  for (let i = 0; i < 4; i++) add(sphere(k, 0.24 - i * 0.03, 7, 5), mat, 0, 0.7 + i * 0.35, -1.05 - i * 0.1 + Math.max(0, i - 2) * 0.4);
  const sting = add(cone(k, 0.12, 0.38, 5), dark, 0, 1.9, -0.75);
  sting.rotation.x = 2.3;
  add(sphere(k, 0.06, 5, 4), venom, 0, 1.75, -0.55);
  k.eyes({ y: 0.72, z: 1.25, spread: 0.18, size: 0.09, mean: true, browColor: shade(def.color, -0.3) });
  return k;
}

function mole(def) {
  const k = kit(def);
  const { add, mat, std } = k;
  const belly = std(shade(def.color, 0.18));
  const claw = std('#efe6d4', { roughness: 0.5 });
  add(ico(k, 1, 1), mat, 0, 0.9, 0, [1, 0.95, 1.05]);
  add(ico(k, 0.65, 1), belly, 0, 0.75, 0.5, [1, 1, 0.6]);
  add(sphere(k, 0.26, 7, 5), std('#e9a3ae'), 0, 0.95, 1.02, [1.2, 0.9, 1]);
  for (const s of [-1, 1]) {
    add(sphere(k, 0.25, 6, 4), mat, s * 0.72, 0.5, 0.65, [1, 0.6, 1]);
    for (let j = -1; j <= 1; j++) add(cone(k, 0.07, 0.3, 4), claw, s * (0.72 + j * 0.13), 0.42, 0.95).rotation.x = Math.PI / 2;
  }
  // 흙더미 둔덕
  add(cyl(k, 0.95, 1.2, 0.18, 9), std('#b08858', { roughness: 1 }), 0, 0.08, 0);
  k.eyes({ y: 1.25, z: 0.99, spread: 0.26, size: 0.08 });
  return k;
}

function tumble(def) {
  const k = kit(def);
  const { add, mat, std } = k;
  mat.opacity = 0.9;
  add(ico(k, 1, 1), mat, 0, 1, 0);
  const twig = std('#8a6440', { roughness: 1 });
  const thorn = std('#e2d2a0');
  for (let i = 0; i < 12; i++) {
    const t = add(cyl(k, 0.04, 0.04, 2.15, 3), twig, 0, 1, 0);
    t.rotation.set(i * 0.7, i * 1.3, i * 0.4);
  }
  for (let i = 0; i < 8; i++) {
    const a = i * 0.785;
    add(cone(k, 0.05, 0.25, 3), thorn, Math.cos(a) * 1.02, 1 + Math.sin(i * 1.7) * 0.4, Math.sin(a) * 1.02).rotation.set(Math.sin(a) * 1.5, 0, -Math.cos(a) * 1.5);
  }
  k.eyes({ y: 1.15, z: 1.03, spread: 0.25, size: 0.12, mean: true, browColor: '#6a4a2c' });
  k.mouth(0.85, 1.04, 0.1);
  return k;
}

// ── 설원 ──
function wisp(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.emissive = new THREE.Color('#4a8aaa');
  mat.emissiveIntensity = 0.6;
  mat.opacity = 0.92;
  add(ico(k, 0.75, 1), mat, 0, 0, 0);
  add(ico(k, 0.4, 1), basic('#ffffff', { opacity: 0.6 }), 0, 0, 0);
  const crystal = std('#f4fbff', { opacity: 0.85, roughness: 0.1, emissive: '#6fb8d8', emissiveIntensity: 0.4 });
  for (let i = 0; i < 6; i++) add(new THREE.OctahedronGeometry(k.r * 0.22, 0), crystal, Math.cos(i * 1.047) * 1.2, 0, Math.sin(i * 1.047) * 1.2, [0.6, 0.6, 1.8]).lookAt(0, 0, 0);
  const wing = basic('#dff6ff', { opacity: 0.45, depthWrite: false, side: THREE.DoubleSide });
  for (const s of [-1, 1]) add(new THREE.CircleGeometry(k.r * 0.55, 6), wing, s * 0.6, 0.5, -0.3).rotation.set(0, s * 0.8, s * 0.5);
  k.eyes({ y: 0.12, z: 0.77, spread: 0.22, size: 0.13 });
  return k;
}

function yeti(def) {
  const k = kit(def);
  const { add, mat, std } = k;
  mat.color = tone('#f2f4f6');
  mat.roughness = 1;
  const face = std('#8fa8c8');
  const ivory = std('#e2d6b8', { roughness: 0.5 });
  add(ico(k, 1, 1), mat, 0, 0.95, 0, [1.05, 1.05, 0.95]);
  add(ico(k, 0.3, 0), mat, 0, 1.9, 0.1, [1.6, 0.8, 1.2]);
  add(sphere(k, 0.46, 8, 6), face, 0, 1.08, 0.7, [1, 0.9, 0.5]);
  for (const s of [-1, 1]) {
    add(ico(k, 0.36, 1), mat, s * 1.0, 0.7, 0.15);
    add(cone(k, 0.08, 0.3, 5), ivory, s * 0.45, 1.8, 0.2).rotation.z = -s * 0.5;
    add(sphere(k, 0.26, 6, 4), mat, s * 0.4, 0.12, 0.25, [1, 0.5, 1.3]);
  }
  k.eyes({ y: 1.2, z: 0.95, spread: 0.18, size: 0.1 });
  k.mouth(0.92, 0.98, 0.08);
  return k;
}

function snowman(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.color = tone('#f6f9fc');
  mat.roughness = 0.95;
  add(ico(k, 1, 2), mat, 0, 0.92, 0);
  add(ico(k, 0.68, 2), mat, 0, 2.2, 0);
  add(new THREE.TorusGeometry(k.r * 0.55, k.r * 0.12, 5, 14), std('#b0443a'), 0, 1.68, 0).rotation.x = Math.PI / 2;
  add(new THREE.BoxGeometry(k.r * 0.2, k.r * 0.5, k.r * 0.08), std('#b0443a'), 0.3, 1.45, 0.55).rotation.z = 0.2;
  add(cone(k, 0.1, 0.5, 6).rotateX(Math.PI / 2), std('#e07a3a'), 0, 2.15, 0.85);
  const twig = std('#6e4a30', { roughness: 1 });
  for (const s of [-1, 1]) add(cyl(k, 0.035, 0.03, 1.0, 4), twig, s * 1.15, 1.35, 0).rotation.z = s * 1.0;
  const coal = std('#2e2a2a');
  for (const y of [0.7, 1.05]) add(sphere(k, 0.08, 5, 4), coal, 0, y, 0.98);
  // 머리 위 폭탄 심지
  add(cyl(k, 0.18, 0.2, 0.2, 8), coal, 0, 2.9, 0);
  add(cyl(k, 0.03, 0.03, 0.35, 4), std('#c8b48a'), 0, 3.15, 0);
  add(new THREE.OctahedronGeometry(k.r * 0.12, 0), basic('#ffb347'), 0, 3.4, 0);
  k.eyes({ y: 2.35, z: 0.69, spread: 0.2, size: 0.1, mean: true, browColor: '#3a3e47' });
  return k;
}

export const SHAPES = { slime, mushroom, cactus, golem, bee, rabbit, puff, wolf, stump, scorpion, mole, tumble, wisp, yeti, snowman };
