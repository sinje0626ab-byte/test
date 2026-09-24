import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 });

// 부속 건물 모양. parts 는 피격 번쩍임·파손 색 변화용
export function createFacilityModel(model) {
  const g = new THREE.Group();
  const parts = [];
  let flame = null;
  const box = (w, h, d, color, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), flat(color));
    m.position.set(x, y, z);
    g.add(m);
    parts.push(m);
    return m;
  };

  if (model === 'workbench') {
    box(1.6, 0.14, 0.9, '#c9a06a', 0, 0.8, 0);
    for (const [x, z] of [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]]) box(0.12, 0.8, 0.12, '#8a6440', x, 0.4, z);
    box(0.5, 0.08, 0.14, '#a9adb6', -0.3, 0.92, 0.1); // 톱날
    const handle = box(0.08, 0.35, 0.08, '#6b4a36', 0.35, 1.0, -0.1); // 망치
    handle.rotation.z = 0.6;
    box(0.25, 0.12, 0.12, '#8a8f99', 0.45, 1.12, -0.1);
    box(0.4, 0.25, 0.3, '#e0c38a', 0.45, 0.35, 0); // 아래 나무토막
  } else if (model === 'storage') {
    box(2.0, 1.3, 1.6, '#9a6a45', 0, 0.65, 0);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 2.2, 3, 1).rotateZ(Math.PI / 2), flat('#6b8f5a'));
    roof.position.y = 1.55;
    roof.scale.set(1, 0.5, 0.75);
    g.add(roof);
    parts.push(roof);
    box(1.1, 0.95, 0.08, '#6b4a36', 0, 0.48, 0.82);
    box(0.5, 0.5, 0.5, '#c9a06a', 1.35, 0.25, 0.55); // 상자
    box(0.4, 0.4, 0.4, '#c9a06a', 1.3, 0.7, 0.5);
  } else if (model === 'campfire') {
    // 모닥불: 돌 고리 + 장작 + 불꽃 (불꽃은 flame으로 돌려준다)
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 0), flat('#8a8580'));
      rock.position.set(Math.cos(a) * 0.5, 0.1, Math.sin(a) * 0.5);
      g.add(rock);
      parts.push(rock);
    }
    for (let i = 0; i < 3; i++) {
      const log = box(0.14, 0.14, 0.8, '#6b4a36', 0, 0.12, 0);
      log.rotation.y = (i / 3) * Math.PI;
    }
    flame = new THREE.Group();
    const f1 = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 5), new THREE.MeshBasicMaterial({ color: 0xff9a3d }));
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 5), new THREE.MeshBasicMaterial({ color: 0xffe08a }));
    f1.position.y = 0.45;
    f2.position.y = 0.4;
    flame.add(f1, f2);
    g.add(flame);
  } else if (model === 'garden') {
    // 텃밭: 나무 틀 + 흙 이랑 (작물은 Facility가 올린다)
    box(2.0, 0.12, 1.6, '#6b4a36', 0, 0.06, 0);
    for (const z of [-0.45, 0, 0.45]) box(1.8, 0.14, 0.3, '#7a5a3a', 0, 0.16, z);
    for (const [x, z, w, d] of [[0, -0.84, 2.1, 0.1], [0, 0.84, 2.1, 0.1], [-1.04, 0, 0.1, 1.7], [1.04, 0, 0.1, 1.7]]) box(w, 0.3, d, '#c9a06a', x, 0.15, z);
  } else if (model === 'forge') {
    // 대장간: 돌 화덕 + 굴뚝 + 모루
    box(1.6, 1.0, 1.2, '#8a8580', -0.3, 0.5, 0);
    box(0.5, 1.4, 0.5, '#6f6a65', -0.7, 1.5, -0.2);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.05), new THREE.MeshBasicMaterial({ color: 0xff7b3d }));
    glow.position.set(-0.3, 0.45, 0.61);
    g.add(glow);
    box(0.5, 0.3, 0.3, '#3a3e47', 0.9, 0.55, 0.2); // 모루
    box(0.25, 0.4, 0.25, '#6b4a36', 0.9, 0.2, 0.2);
  } else if (model === 'board') {
    // 게시판: 기둥 두 개 + 판자 + 종이
    for (const x of [-0.55, 0.55]) box(0.1, 1.6, 0.1, '#8a6440', x, 0.8, 0);
    box(1.3, 0.8, 0.08, '#c9a06a', 0, 1.25, 0.02);
    const roof = box(1.5, 0.08, 0.4, '#6b8f5a', 0, 1.72, 0.05);
    roof.rotation.x = -0.2;
    box(0.35, 0.4, 0.02, '#fff4d6', -0.3, 1.25, 0.08);
    box(0.3, 0.3, 0.02, '#fff4d6', 0.25, 1.3, 0.08);
  } else {
    // 상점: 줄무늬 차양 가판대
    box(1.9, 0.9, 0.8, '#c9a06a', 0, 0.45, 0.2);
    for (const x of [-0.9, 0.9]) box(0.1, 1.9, 0.1, '#8a6440', x, 0.95, -0.25);
    for (let i = 0; i < 5; i++) {
      const stripe = box(0.4, 0.08, 1.1, i % 2 ? '#fff4d6' : '#e9835b', -0.8 + i * 0.4, 1.95, 0.1);
      stripe.rotation.x = 0.25;
    }
    const sign = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 12).rotateX(Math.PI / 2), flat('#ffcf5c'));
    sign.position.set(0, 2.35, -0.2);
    g.add(sign);
    parts.push(sign);
    box(0.3, 0.3, 0.3, '#ff7b8a', -0.5, 1.05, 0.3); // 진열된 물약
    box(0.3, 0.3, 0.3, '#8ee08a', 0.2, 1.05, 0.3);
  }

  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group: g, parts, flame };
}
