import * as THREE from 'three';
import { tone } from './monsterKit.js';

const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });

// 동물 주민 모양 (로우폴리): 다람쥐 · 두더지 · 부엉이 · 곰 · 제비.
// 몬스터와 같은 얼굴 규칙(눈 하이라이트·볼)을 쓰되 더 순하게, 역할이 보이는 소품을 든다.
// eyes 는 졸 때·깜빡일 때 감는다. body 는 숨쉬기·말할 때 끄덕이는 부분(발 위 전부).
export function createNpcModel(def) {
  const g = new THREE.Group();
  const bodyG = new THREE.Group();
  g.add(bodyG);
  const body = flat(tone(def.color, { sat: 0.85 }));
  const accent = flat(tone(def.accent, { sat: 0.85 }));
  const dark = flat('#2a2430', { roughness: 0.3 });
  const shine = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const blushM = new THREE.MeshBasicMaterial({ color: 0xff9c8a, transparent: true, opacity: 0.45 });
  const add = (geo, mat, x, y, z, parent = bodyG) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  const eyes = [];
  // 눈: 세로로 긴 눈 + 흰 하이라이트, 볼 터치
  const face = (y, z, spread, r = 0.05, blush = true) => {
    for (const s of [-1, 1]) {
      const e = add(new THREE.SphereGeometry(r, 7, 5), dark, s * spread, y, z);
      e.scale.set(0.85, 1.2, 0.7);
      eyes.push(e);
      const h = add(new THREE.SphereGeometry(r * 0.33, 5, 4), shine, s * spread - s * r * 0.25, y + r * 0.4, z + r * 0.45);
      h.castShadow = false;
      eyes.push(h);
      if (blush) {
        const b = add(new THREE.SphereGeometry(r * 0.9, 6, 4), blushM, s * spread * 1.55, y - r * 1.6, z - r * 0.4);
        b.scale.set(1, 0.55, 0.3);
        b.castShadow = false;
      }
    }
  };

  if (def.model === 'owl') {
    // 부엉 박사: 둥근 몸 + 깃털 귀 + 둥근 안경 두 알 + 옆구리에 낀 책
    add(new THREE.SphereGeometry(0.42, 10, 8), body, 0, 0.5, 0).scale.set(1, 1.15, 0.95);
    add(new THREE.SphereGeometry(0.28, 8, 6), accent, 0, 0.45, 0.2).scale.set(1, 1.2, 0.5);
    for (const x of [-0.14, 0.14]) {
      add(new THREE.CircleGeometry(0.11, 10), accent, x, 0.72, 0.385);
      const tuft = add(new THREE.ConeGeometry(0.06, 0.2, 4), body, x * 1.8, 1.0, 0);
      tuft.rotation.z = x > 0 ? -0.4 : 0.4;
      const wing = add(new THREE.SphereGeometry(0.16, 6, 5), body, x * 2.7, 0.45, 0);
      wing.scale.set(0.45, 1.1, 0.8);
      add(new THREE.TorusGeometry(0.105, 0.013, 4, 14), flat('#c9a44a', { metalness: 0.5, roughness: 0.3 }), x, 0.72, 0.41);
    }
    face(0.72, 0.4, 0.14, 0.055, false);
    add(new THREE.ConeGeometry(0.05, 0.12, 4).rotateX(Math.PI / 2), flat('#e0a050'), 0, 0.62, 0.42);
    const book = add(new THREE.BoxGeometry(0.06, 0.26, 0.2), flat('#8a4a3a'), -0.44, 0.42, 0.08);
    book.rotation.z = 0.15;
    add(new THREE.BoxGeometry(0.05, 0.24, 0.18), flat('#efe2bd'), -0.425, 0.42, 0.08).rotation.z = 0.15;
    for (const x of [-0.12, 0.12]) add(new THREE.SphereGeometry(0.06, 5, 4), flat('#e0a050'), x, 0.06, 0.12).scale.set(1, 0.5, 1.4);
  } else if (def.model === 'swallow') {
    // 제비 하늘: 날렵한 몸 + 가위꼬리 + 우체부 모자 + 가죽 택배 가방(어깨끈)
    add(new THREE.SphereGeometry(0.3, 8, 6), body, 0, 0.55, 0).scale.set(0.9, 0.9, 1.3);
    add(new THREE.SphereGeometry(0.22, 8, 6), accent, 0, 0.5, 0.12).scale.set(0.8, 0.8, 1);
    add(new THREE.SphereGeometry(0.2, 8, 6), body, 0, 0.85, 0.18);
    face(0.9, 0.36, 0.09, 0.045);
    add(new THREE.ConeGeometry(0.035, 0.12, 4).rotateX(Math.PI / 2), flat('#3a3e47'), 0, 0.85, 0.42);
    add(new THREE.CylinderGeometry(0.13, 0.15, 0.08, 10), flat('#3e5a8a'), 0, 1.04, 0.16);
    add(new THREE.BoxGeometry(0.2, 0.02, 0.1), flat('#2e3e5e'), 0, 1.0, 0.3);
    for (const x of [-1, 1]) {
      const wing = add(new THREE.ConeGeometry(0.12, 0.6, 3), body, x * 0.3, 0.6, -0.1);
      wing.rotation.set(Math.PI / 2 + 0.4, 0, x * 0.5);
      const tail = add(new THREE.ConeGeometry(0.05, 0.42, 3), body, x * 0.08, 0.5, -0.45);
      tail.rotation.set(-Math.PI / 2 - 0.3, 0, x * 0.25);
    }
    add(new THREE.BoxGeometry(0.22, 0.18, 0.14), flat('#9a6440'), 0.3, 0.42, 0.02);
    add(new THREE.BoxGeometry(0.23, 0.06, 0.15), flat('#7c4f32'), 0.3, 0.5, 0.02);
    const strap = add(new THREE.TorusGeometry(0.3, 0.018, 4, 16, Math.PI), flat('#7c4f32'), 0.05, 0.55, 0.02);
    strap.rotation.set(0, Math.PI / 2, -0.6);
    add(new THREE.BoxGeometry(0.08, 0.06, 0.01), flat('#f4ecd6'), 0.3, 0.44, 0.1);
  } else {
    // 네발 동물 셋은 몸통 + 머리 틀이 같다 (+ 앞발)
    const big = def.model === 'bear';
    add(new THREE.CapsuleGeometry(big ? 0.34 : 0.25, big ? 0.3 : 0.25, 3, 8), body, 0, big ? 0.55 : 0.45, 0);
    add(new THREE.SphereGeometry(big ? 0.24 : 0.18, 8, 6), accent, 0, big ? 0.5 : 0.4, big ? 0.24 : 0.17).scale.set(1, 1.2, 0.5);
    const hy = big ? 1.12 : 0.92;
    const head = add(new THREE.SphereGeometry(big ? 0.3 : 0.24, 10, 8), body, 0, hy, 0.05);
    head.scale.set(1, 0.95, 1);
    const fz = big ? 0.32 : 0.265;
    face(hy + 0.04, fz, 0.1, big ? 0.05 : 0.045);
    for (const x of [-1, 1]) add(new THREE.SphereGeometry(big ? 0.1 : 0.075, 6, 5), body, x * (big ? 0.3 : 0.22), big ? 0.62 : 0.5, big ? 0.22 : 0.16);
    for (const x of [-1, 1]) add(new THREE.SphereGeometry(big ? 0.12 : 0.09, 6, 5), body, x * (big ? 0.18 : 0.13), 0.06, 0.08).scale.set(1, 0.6, 1.3);
    if (def.model === 'mole') {
      // 두더지 무쇠: 분홍 코 + 큰 발톱 + 대장장이 두건·가죽 앞치마 + 어깨에 멘 망치
      add(new THREE.SphereGeometry(0.08, 6, 4), accent, 0, hy - 0.04, 0.3);
      for (const x of [-0.25, 0.25]) for (const dz of [-0.04, 0, 0.04]) add(new THREE.ConeGeometry(0.025, 0.1, 4).rotateX(Math.PI / 2), flat('#efe6d4'), x + dz, 0.48, 0.25);
      add(new THREE.SphereGeometry(0.25, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), flat('#6a3e34'), 0, hy + 0.05, 0.03).scale.set(1, 0.7, 1);
      add(new THREE.BoxGeometry(0.34, 0.4, 0.04), flat('#7c5236'), 0, 0.48, 0.25);
      const handle = add(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 5), flat('#6e4a30'), -0.28, 0.8, -0.05);
      handle.rotation.z = -0.7;
      add(new THREE.BoxGeometry(0.2, 0.12, 0.12), flat('#5d646c', { metalness: 0.5, roughness: 0.45 }), -0.06, 1.02, -0.05).rotation.z = -0.7;
    } else if (def.model === 'bear') {
      // 곰 꿀비: 주둥이 + 둥근 귀 + 밀짚모자 + 품에 안은 꿀단지
      add(new THREE.SphereGeometry(0.12, 6, 4), accent, 0, hy - 0.06, 0.28).scale.set(1, 0.8, 0.7);
      add(new THREE.SphereGeometry(0.04, 6, 4), dark, 0, hy - 0.02, 0.37);
      for (const x of [-0.2, 0.2]) add(new THREE.SphereGeometry(0.09, 6, 4), body, x, hy + 0.24, 0);
      add(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 12), flat('#e2c98a'), 0, hy + 0.27, 0.02);
      add(new THREE.CylinderGeometry(0.2, 0.24, 0.14, 10), flat('#e2c98a'), 0, hy + 0.34, 0.02);
      add(new THREE.CylinderGeometry(0.245, 0.245, 0.04, 10), flat('#b0443a'), 0, hy + 0.3, 0.02);
      add(new THREE.CylinderGeometry(0.12, 0.1, 0.16, 8), flat('#e2a13c', { roughness: 0.3 }), 0, 0.62, 0.3);
      add(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 8), flat('#d8c39a'), 0, 0.72, 0.3);
    } else {
      // 다람쥐 도토리: 뾰족 귀 + 크고 말린 꼬리 + 상점 앞치마 + 두 손에 든 도토리
      for (const x of [-0.13, 0.13]) add(new THREE.ConeGeometry(0.06, 0.16, 4), body, x, hy + 0.22, 0);
      add(new THREE.SphereGeometry(0.035, 6, 4), dark, 0, hy - 0.02, 0.27);
      const tail = add(new THREE.SphereGeometry(0.22, 8, 6), body, 0, 0.8, -0.35);
      tail.scale.set(0.8, 1.6, 0.8);
      tail.rotation.x = 0.4;
      add(new THREE.SphereGeometry(0.13, 6, 5), accent, 0, 1.05, -0.42).scale.set(0.7, 0.9, 0.6);
      add(new THREE.BoxGeometry(0.3, 0.3, 0.03), flat('#e9dcc0'), 0, 0.42, 0.23);
      add(new THREE.BoxGeometry(0.3, 0.04, 0.03), flat('#b0443a'), 0, 0.56, 0.235);
      add(new THREE.SphereGeometry(0.07, 6, 5), flat('#b0763a'), 0, 0.55, 0.3).scale.set(1, 1.15, 1);
      add(new THREE.SphereGeometry(0.075, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2), flat('#6e4a30'), 0, 0.6, 0.3);
    }
  }
  return { group: g, body: bodyG, eyes };
}
