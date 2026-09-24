import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 });

// 동물 주민 모양 (로우폴리): 다람쥐 · 두더지 · 부엉이 · 곰 · 제비. eyes는 졸 때 감는다.
export function createNpcModel(def) {
  const g = new THREE.Group();
  const body = flat(def.color);
  const accent = flat(def.accent);
  const dark = flat('#2b2b33');
  const add = (geo, mat, x, y, z, parent = g) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  const eyes = [];
  const eye = (x, y, z, r = 0.05) => eyes.push(add(new THREE.SphereGeometry(r, 6, 4), dark, x, y, z));

  if (def.model === 'owl') {
    add(new THREE.SphereGeometry(0.42, 10, 8), body, 0, 0.5, 0).scale.set(1, 1.15, 0.95);
    add(new THREE.SphereGeometry(0.28, 8, 6), accent, 0, 0.45, 0.2).scale.set(1, 1.2, 0.5);
    for (const x of [-0.14, 0.14]) {
      add(new THREE.CircleGeometry(0.11, 10), accent, x, 0.72, 0.38);
      eye(x, 0.72, 0.4, 0.06);
      const tuft = add(new THREE.ConeGeometry(0.06, 0.2, 4), body, x * 1.8, 1.0, 0);
      tuft.rotation.z = x > 0 ? -0.4 : 0.4;
    }
    add(new THREE.ConeGeometry(0.05, 0.12, 4).rotateX(Math.PI / 2), flat('#ffb35c'), 0, 0.62, 0.42);
    // 학자 안경
    add(new THREE.TorusGeometry(0.1, 0.012, 4, 12), flat('#c9a44a'), 0.14, 0.72, 0.41);
  } else if (def.model === 'swallow') {
    add(new THREE.SphereGeometry(0.3, 8, 6), body, 0, 0.55, 0).scale.set(0.9, 0.9, 1.3);
    add(new THREE.SphereGeometry(0.22, 8, 6), accent, 0, 0.5, 0.12).scale.set(0.8, 0.8, 1);
    add(new THREE.SphereGeometry(0.2, 8, 6), body, 0, 0.85, 0.18);
    eye(-0.09, 0.9, 0.34);
    eye(0.09, 0.9, 0.34);
    add(new THREE.ConeGeometry(0.04, 0.12, 4).rotateX(Math.PI / 2), flat('#3a3e47'), 0, 0.85, 0.4);
    for (const x of [-1, 1]) {
      const wing = add(new THREE.ConeGeometry(0.12, 0.6, 3), body, x * 0.3, 0.6, -0.1);
      wing.rotation.set(Math.PI / 2 + 0.4, 0, x * 0.5);
      const tail = add(new THREE.ConeGeometry(0.05, 0.4, 3), body, x * 0.08, 0.5, -0.45);
      tail.rotation.x = -Math.PI / 2 - 0.3;
    }
    add(new THREE.BoxGeometry(0.22, 0.16, 0.14), flat('#c9a06a'), 0.28, 0.4, 0); // 택배 가방
  } else {
    // 네발 동물 셋은 몸통 + 머리 틀이 같다
    const big = def.model === 'bear';
    add(new THREE.CapsuleGeometry(big ? 0.34 : 0.25, big ? 0.3 : 0.25, 3, 8), body, 0, big ? 0.55 : 0.45, 0);
    add(new THREE.SphereGeometry(big ? 0.24 : 0.18, 8, 6), accent, 0, big ? 0.5 : 0.4, big ? 0.24 : 0.17).scale.set(1, 1.2, 0.5);
    const hy = big ? 1.12 : 0.92;
    const head = add(new THREE.SphereGeometry(big ? 0.3 : 0.24, 8, 6), body, 0, hy, 0.05);
    head.scale.set(1, 0.95, 1);
    eye(-0.1, hy + 0.04, big ? 0.3 : 0.25);
    eye(0.1, hy + 0.04, big ? 0.3 : 0.25);
    if (def.model === 'mole') {
      add(new THREE.SphereGeometry(0.07, 6, 4), accent, 0, hy - 0.04, 0.3); // 분홍 코
      for (const x of [-0.25, 0.25]) add(new THREE.BoxGeometry(0.14, 0.05, 0.12), flat('#f4e6cf'), x, 0.5, 0.2); // 발톱
      add(new THREE.BoxGeometry(0.3, 0.06, 0.2), flat('#3a3e47'), 0, hy + 0.26, 0).rotation.z = 0.2; // 대장장이 두건
    } else if (def.model === 'bear') {
      add(new THREE.SphereGeometry(0.12, 6, 4), accent, 0, hy - 0.06, 0.28).scale.set(1, 0.8, 0.7);
      add(new THREE.SphereGeometry(0.04, 6, 4), flat('#2b2b33'), 0, hy - 0.02, 0.36);
      for (const x of [-0.2, 0.2]) add(new THREE.SphereGeometry(0.09, 6, 4), body, x, hy + 0.24, 0);
      add(new THREE.CylinderGeometry(0.1, 0.08, 0.14, 8), flat('#ffd23f'), 0.3, 0.55, 0.15); // 꿀단지
    } else {
      // 다람쥐: 뾰족 귀 + 크고 말린 꼬리
      for (const x of [-0.13, 0.13]) add(new THREE.ConeGeometry(0.06, 0.16, 4), body, x, hy + 0.22, 0);
      add(new THREE.SphereGeometry(0.035, 6, 4), flat('#2b2b33'), 0, hy - 0.02, 0.26);
      const tail = add(new THREE.SphereGeometry(0.22, 8, 6), body, 0, 0.8, -0.35);
      tail.scale.set(0.8, 1.6, 0.8);
      tail.rotation.x = 0.4;
      add(new THREE.SphereGeometry(0.08, 6, 4), flat('#b0763a'), 0.22, 0.5, 0.2); // 도토리
    }
  }
  return { group: g, eyes };
}
