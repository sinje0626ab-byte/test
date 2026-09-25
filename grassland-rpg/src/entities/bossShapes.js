import * as THREE from 'three';
import { kit, shade } from './monsterKit.js';

// 보스 모양: 일반 몬스터보다 확실히 큰 실루엣 + 고유 장식(왕관·이끼·달뿔) + 빛나는 부위.
const ico = (k, s, d = 1) => new THREE.IcosahedronGeometry(k.r * s, d);
const sphere = (k, s, w = 8, h = 6) => new THREE.SphereGeometry(k.r * s, w, h);
const cone = (k, rad, h, seg = 5) => new THREE.ConeGeometry(k.r * rad, k.r * h, seg);
const cyl = (k, r1, r2, h, seg = 8) => new THREE.CylinderGeometry(k.r * r1, k.r * r2, k.r * h, seg);

// 왕슬라임: 큰 젤리 + 금관(보석 셋) + 짧은 망토 깃
function kingslime(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.roughness = 0.2;
  mat.opacity = 0.88;
  add(ico(k, 1, 2), mat, 0, 0.78, 0, [1.05, 0.78, 1.05]);
  add(ico(k, 0.45, 1), std(shade(def.color, -0.2), { opacity: 0.5 }), 0, 0.6, -0.05);
  const gloss = basic('#ffffff', { opacity: 0.7 });
  add(sphere(k, 0.14, 6, 4), gloss, -0.45, 1.15, 0.35, [1, 0.6, 0.7]);
  const gold = std('#e0b34a', { roughness: 0.28, metalness: 0.65 });
  add(cyl(k, 0.42, 0.46, 0.22, 10), gold, 0, 1.5, -0.05);
  for (let i = 0; i < 6; i++) {
    const a = i * 1.047;
    add(cone(k, 0.08, 0.28, 4), gold, Math.cos(a) * 0.42, 1.74, Math.sin(a) * 0.42 - 0.05);
    add(sphere(k, 0.045, 5, 4), gold, Math.cos(a) * 0.42, 1.9, Math.sin(a) * 0.42 - 0.05);
  }
  for (const [x, c] of [[-0.24, '#e0645a'], [0, '#5a9fd6'], [0.24, '#e0645a']]) {
    add(new THREE.OctahedronGeometry(k.r * 0.06, 0), std(c, { emissive: c, emissiveIntensity: 0.4, roughness: 0.2 }), x, 1.5, 0.4);
  }
  k.eyes({ y: 0.92, z: 1.0, spread: 0.3, size: 0.12, mean: true, browColor: shade(def.color, -0.3) });
  k.mouth(0.68, 1.02, 0.12);
  return k;
}

// 고목 수호자: 홈 파인 줄기 + 잎 뭉치 머리(=mat, 분노하면 단풍색) + 뿌리 다리 + 이끼·버섯 + 빛나는 눈
function treant(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  const bark = std('#6e4a30', { roughness: 1 });
  const barkDark = std('#4a3020', { roughness: 1 });
  const moss = std('#6f914c', { roughness: 1 });
  add(cyl(k, 0.5, 0.72, 1.8, 8), bark, 0, 0.95, 0);
  for (let i = 0; i < 8; i++) {
    const a = i * 0.785;
    add(new THREE.BoxGeometry(k.r * 0.06, k.r * 1.5, k.r * 0.06), barkDark, Math.cos(a) * 0.6, 0.95, Math.sin(a) * 0.6).rotation.z = Math.cos(a) * 0.08;
  }
  // 잎 뭉치 머리: 여러 덩어리로 둥근 실루엣
  for (const [x, y, z, s] of [[0, 2.45, 0, 1.2], [-0.95, 2.1, 0.15, 0.75], [0.95, 2.15, -0.1, 0.78], [0.1, 2.1, -0.85, 0.75], [0.2, 3.2, 0.05, 0.65], [-0.5, 2.9, 0.4, 0.5]]) add(ico(k, s, 1), mat, x, y, z, [1.1, 0.85, 1.1]);
  for (const s of [-1, 1]) {
    const arm = add(cyl(k, 0.1, 0.18, 1.3, 6), bark, s * 0.85, 1.25, 0.2);
    arm.rotation.z = s * 0.95;
    add(ico(k, 0.25, 0), mat, s * 1.4, 1.65, 0.25);
    add(cyl(k, 0.2, 0.28, 0.6, 6), bark, s * 0.4, 0.2, 0);
    for (const dz of [-0.35, 0.35]) add(cone(k, 0.12, 0.55, 5), bark, s * 0.65, 0.1, dz).rotation.set(dz * 2, 0, -s * 1.2);
  }
  add(ico(k, 0.3, 0), moss, 0.35, 1.3, 0.45, [1.2, 0.5, 0.6]);
  add(ico(k, 0.22, 0), moss, -0.4, 0.55, 0.5, [1, 0.5, 0.6]);
  const cap = std('#c9584e');
  for (const [x, y] of [[-0.55, 0.85], [-0.45, 0.95]]) {
    add(cyl(k, 0.03, 0.04, 0.12, 5), std('#f1e3c8'), x, y, 0.52);
    add(new THREE.SphereGeometry(k.r * 0.09, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2), cap, x, y + 0.05, 0.52);
  }
  const hole = std('#241810', { roughness: 1 });
  const glow = basic('#ffe39a');
  for (const s of [-1, 1]) {
    add(sphere(k, 0.14, 6, 4), hole, s * 0.22, 1.4, 0.6, [1, 1.1, 0.5]);
    add(sphere(k, 0.07, 5, 4), glow, s * 0.22, 1.4, 0.68);
  }
  add(new THREE.BoxGeometry(k.r * 0.4, k.r * 0.08, k.r * 0.1), hole, 0, 1.05, 0.66);
  return k;
}

// 밤의 군주: 긴 망토 + 캄캄한 두건 속 빛나는 눈 + 초승달 뿔 + 떠다니는 별 구슬
function nightlord(def) {
  const k = kit(def);
  const { add, mat, std, basic } = k;
  mat.roughness = 0.8;
  add(cone(k, 0.95, 2.1, 9, 1), mat, 0, 0.9, 0);
  add(cyl(k, 0.62, 0.95, 0.5, 9), std(shade(def.color, -0.15)), 0, 0.1, 0);
  add(sphere(k, 0.5, 10, 8), mat, 0, 2.05, -0.05);
  add(sphere(k, 0.42, 8, 6), std('#140c24', { roughness: 1 }), 0, 1.98, 0.14, [1, 1, 0.7]);
  const moon = std('#f4efc0', { emissive: '#9a8a40', emissiveIntensity: 0.5, roughness: 0.3 });
  for (const s of [-1, 1]) {
    const horn = add(new THREE.TorusGeometry(k.r * 0.35, k.r * 0.07, 5, 12, Math.PI * 0.9), moon, s * 0.35, 2.4, 0);
    horn.rotation.set(0, 0, s > 0 ? -0.3 : Math.PI + 0.3);
  }
  const eye = basic('#e6d2ff');
  for (const s of [-1, 1]) add(sphere(k, 0.07, 6, 4), eye, s * 0.16, 2.0, 0.42, [1.2, 0.7, 0.6]);
  const trim = std('#8a6cf0', { emissive: '#3a2070', emissiveIntensity: 0.6 });
  add(new THREE.TorusGeometry(k.r * 0.95, k.r * 0.05, 4, 18), trim, 0, -0.14, 0).rotation.x = Math.PI / 2;
  add(new THREE.TorusGeometry(k.r * 0.46, k.r * 0.05, 4, 14), trim, 0, 1.62, 0).rotation.x = Math.PI / 2;
  // 가슴의 별 문장 + 곁에 떠 있는 별 구슬
  add(new THREE.OctahedronGeometry(k.r * 0.12, 0), basic('#fff4c0'), 0, 1.3, 0.48, [1, 1.4, 0.4]);
  const orb = basic('#c9b4ff', { opacity: 0.85 });
  for (const s of [-1, 1]) add(ico(k, 0.13, 1), orb, s * 1.25, 1.6, 0.2);
  return k;
}

export const BOSS_SHAPES = { kingslime, treant, nightlord };
