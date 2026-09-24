import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 });

// 포탑 종류별 모양. head 는 조준할 때 도는 부분, parts 는 색을 바꾸는(피격·파손) 부분
export function createTurretModel(def) {
  const g = new THREE.Group();
  const parts = [];
  const add = (parent, geo, color, y = 0) => {
    const m = new THREE.Mesh(geo, flat(color));
    m.position.y = y;
    parent.add(m);
    parts.push(m);
    return m;
  };
  const head = new THREE.Group();

  if (def.model === 'cannon') {
    add(g, new THREE.CylinderGeometry(0.75, 0.9, 0.7, 8), '#a9adb6', 0.35);
    add(g, new THREE.CylinderGeometry(0.8, 0.8, 0.15, 8), '#8a6440', 0.78);
    head.position.y = 1.15;
    add(head, new THREE.SphereGeometry(0.45, 8, 6), def.color);
    const barrel = add(head, new THREE.CylinderGeometry(0.2, 0.26, 1.1, 8), '#3a3e47');
    barrel.rotation.x = Math.PI / 2 - 0.35;
    barrel.position.set(0, 0.2, 0.45);
  } else if (def.model === 'gun') {
    add(g, new THREE.CylinderGeometry(0.5, 0.65, 0.9, 6), '#8a8f99', 0.45);
    add(g, new THREE.CylinderGeometry(0.65, 0.65, 0.16, 6), '#6f7d8c', 0.98);
    head.position.y = 1.25;
    add(head, new THREE.BoxGeometry(0.5, 0.35, 0.6), def.color);
    for (const x of [-0.1, 0.1]) {
      const barrel = add(head, new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6), '#2f333b');
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(x, 0.02, 0.6);
    }
  } else if (def.model === 'poison') {
    // 독침 포탑: 나무 받침 + 초록 독 주머니 + 짧은 대롱
    add(g, new THREE.CylinderGeometry(0.45, 0.6, 0.8, 6), '#8a6440', 0.4);
    add(g, new THREE.CylinderGeometry(0.62, 0.62, 0.16, 6), '#6b8f5a', 0.88);
    head.position.y = 1.25;
    add(head, new THREE.IcosahedronGeometry(0.36, 0), def.color);
    const tube = add(head, new THREE.CylinderGeometry(0.07, 0.1, 0.7, 6), '#4f7a3a');
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 0.02, 0.45);
    for (const x of [-0.18, 0.18]) {
      const spike = add(head, new THREE.ConeGeometry(0.06, 0.22, 4), '#f4e6cf', 0.32);
      spike.position.x = x;
    }
  } else if (def.model === 'frost') {
    // 서리 포탑: 돌 받침 + 떠 있는 얼음 결정
    add(g, new THREE.CylinderGeometry(0.5, 0.68, 0.9, 6), '#a9b8c6', 0.45);
    add(g, new THREE.CylinderGeometry(0.7, 0.7, 0.16, 6), '#dfeef8', 0.98);
    head.position.y = 1.6;
    const crystal = add(head, new THREE.OctahedronGeometry(0.4, 0), def.color);
    crystal.scale.y = 1.5;
    for (let i = 0; i < 3; i++) {
      const shard = add(head, new THREE.OctahedronGeometry(0.12, 0), '#dff4ff');
      const a = (i / 3) * Math.PI * 2;
      shard.position.set(Math.cos(a) * 0.5, -0.2, Math.sin(a) * 0.5);
    }
  } else if (def.model === 'crossbow') {
    add(g, new THREE.CylinderGeometry(0.5, 0.65, 1.0, 6), '#9a6a45', 0.5);
    add(g, new THREE.CylinderGeometry(0.72, 0.72, 0.18, 6), '#b88452', 1.08);
    head.position.y = 1.32;
    add(head, new THREE.BoxGeometry(0.22, 0.2, 1.1), def.color);
    const bow = add(head, new THREE.BoxGeometry(1.3, 0.08, 0.12), '#c9d3dd');
    bow.position.z = 0.4;
    const bolt = add(head, new THREE.BoxGeometry(0.06, 0.06, 0.9), '#e8e8e8');
    bolt.position.set(0, 0.13, 0.25);
  } else {
    add(g, new THREE.CylinderGeometry(0.45, 0.6, 0.9, 6), '#9a6a45', 0.45);
    add(g, new THREE.CylinderGeometry(0.65, 0.65, 0.18, 6), '#b88452', 0.98);
    head.position.y = 1.2;
    add(head, new THREE.BoxGeometry(0.16, 0.16, 0.9), def.color);
    const bow = add(head, new THREE.TorusGeometry(0.42, 0.045, 4, 10, Math.PI), '#6b4a36');
    bow.position.z = 0.3;
    bow.rotation.set(Math.PI / 2, 0, 0);
    const arrow = add(head, new THREE.BoxGeometry(0.04, 0.04, 0.7), '#e8e8e8');
    arrow.position.set(0, 0.1, 0.15);
  }

  // 업그레이드 레벨 표시 (금색 띠 Lv2~5, Lv5는 머리 위 금관)
  const stars = [];
  for (let i = 0; i < 4; i++) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 4, 16), flat('#ffcf5c'));
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.2 + i * 0.17;
    band.visible = false;
    g.add(band);
    stars.push(band);
  }

  const crown = new THREE.Group();
  const gold = flat('#ffcf5c');
  crown.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.12, 8), gold));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 4), gold);
    spike.position.set(Math.cos(a) * 0.24, 0.14, Math.sin(a) * 0.24);
    crown.add(spike);
  }
  crown.position.y = 0.55;
  crown.visible = false;
  head.add(crown);

  g.add(head);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group: g, head, parts, stars, crown };
}
