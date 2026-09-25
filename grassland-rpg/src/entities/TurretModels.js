import * as THREE from 'three';

// 포탑 모양. 무기(weaponModels)·아이콘(itemArt)과 같은 재질 팔레트를 쓴다.
// head 는 조준할 때 도는 부분, parts 는 색을 바꾸는(피격·파손) 부분.
// 레벨이 오르면 색이 아니라 구조가 자란다: Lv2 청동 테 → Lv3 쇠 징·보강판 → Lv4 깃발·두 번째 테 → Lv5 금 테·금관
const MAT = {
  wood: { color: '#b07e4f', roughness: 0.85 },
  plank: { color: '#8a6443', roughness: 0.9 },
  darkwood: { color: '#6e4a30', roughness: 0.9 },
  stone: { color: '#a3a39c', roughness: 0.95 },
  stoneDark: { color: '#7f817c', roughness: 0.95 },
  steel: { color: '#c3ccd4', roughness: 0.32, metalness: 0.55 },
  iron: { color: '#5d646c', roughness: 0.45, metalness: 0.5 },
  bronze: { color: '#c08a4a', roughness: 0.4, metalness: 0.55 },
  gold: { color: '#e0b34a', roughness: 0.3, metalness: 0.65 },
  rope: { color: '#d9c48f', roughness: 0.95 },
  cloth: { color: '#b0443a', roughness: 0.95 },
  frostStone: { color: '#9fb0c0', roughness: 0.9 },
  snow: { color: '#eef5fa', roughness: 1 },
  moss: { color: '#6f914c', roughness: 1 },
};
const flat = (spec) => new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.85, ...(typeof spec === 'string' ? (MAT[spec] ?? { color: spec }) : spec) });

export function createTurretModel(def) {
  const g = new THREE.Group();
  const parts = [];
  const add = (parent, geo, spec, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, flat(spec));
    m.position.set(x, y, z);
    parent.add(m);
    parts.push(m);
    return m;
  };
  const head = new THREE.Group();
  const base = (radius, height, spec, rimSpec, rimY) => {
    add(g, new THREE.CylinderGeometry(radius * 0.78, radius, height, 8), spec, 0, height / 2);
    // 판자·돌 이음새 (세로 홈)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const r = radius * 0.9;
      const seam = add(g, new THREE.BoxGeometry(0.035, height * 0.9, 0.035), spec === 'stone' || spec === 'frostStone' ? 'stoneDark' : 'darkwood', Math.cos(a) * r, height / 2, Math.sin(a) * r);
      seam.rotation.y = -a;
    }
    add(g, new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 0.16, 8), rimSpec, 0, rimY);
    return rimY;
  };
  let rimY;
  let rimR;

  if (def.model === 'cannon') {
    // 대포: 돌 받침 + 나무 포대 + 테 두른 쇠 포신 (굵고 짧은 실루엣)
    rimY = base(0.92, 0.7, 'stone', 'plank', 0.78); rimR = 0.83;
    head.position.y = 1.12;
    add(head, new THREE.BoxGeometry(0.8, 0.3, 0.8), 'darkwood', 0, -0.12, 0);
    const barrel = add(head, new THREE.CylinderGeometry(0.2, 0.28, 1.15, 10), 'iron', 0, 0.22, 0.4);
    barrel.rotation.x = Math.PI / 2 - 0.35;
    // 포신 축(0, sin .35, cos .35)을 따라 청동 테 세 개
    for (const t of [-0.38, 0, 0.34]) {
      const ring = add(head, new THREE.TorusGeometry(0.26 - t * 0.06, 0.035, 5, 12), 'bronze', 0, 0.22 + 0.343 * t, 0.4 + 0.939 * t);
      ring.rotation.x = -0.35;
    }
    const lip = add(head, new THREE.TorusGeometry(0.2, 0.06, 5, 12), 'iron', 0, 0.42, 0.93);
    lip.rotation.x = -0.35;
  } else if (def.model === 'gun') {
    // 총 포탑: 쇠 장갑 몸체 + 쌍열 총신 + 옆 탄약 상자
    rimY = base(0.66, 0.9, 'stone', 'iron', 0.98); rimR = 0.6;
    head.position.y = 1.25;
    add(head, new THREE.BoxGeometry(0.56, 0.36, 0.62), 'iron');
    add(head, new THREE.BoxGeometry(0.46, 0.08, 0.5), 'steel', 0, 0.22, -0.02);
    for (const x of [-0.11, 0.11]) {
      const barrel = add(head, new THREE.CylinderGeometry(0.055, 0.065, 0.85, 8), 'steel', x, 0.02, 0.65);
      barrel.rotation.x = Math.PI / 2;
      const tip = add(head, new THREE.CylinderGeometry(0.075, 0.075, 0.08, 8), 'iron', x, 0.02, 1.06);
      tip.rotation.x = Math.PI / 2;
    }
    add(head, new THREE.BoxGeometry(0.2, 0.22, 0.34), 'darkwood', 0.4, -0.05, -0.05);
  } else if (def.model === 'poison') {
    // 독침 포탑: 나무 받침 + 유리 독 주머니(속에 초록 독) + 청동 대롱
    rimY = base(0.6, 0.8, 'wood', 'moss', 0.88); rimR = 0.55;
    head.position.y = 1.28;
    add(head, new THREE.IcosahedronGeometry(0.38, 1), { color: '#dcecef', roughness: 0.15, transparent: true, opacity: 0.55 });
    add(head, new THREE.IcosahedronGeometry(0.28, 1), { color: def.color ?? '#7cc67a', roughness: 0.3, emissive: '#2f5a24', emissiveIntensity: 0.4 }, 0, -0.05, 0);
    const tube = add(head, new THREE.CylinderGeometry(0.06, 0.09, 0.7, 8), 'bronze', 0, 0.02, 0.48);
    tube.rotation.x = Math.PI / 2;
    add(head, new THREE.CylinderGeometry(0.12, 0.14, 0.1, 8), 'bronze', 0, 0.38, 0);
    for (const x of [-0.2, 0.2]) add(head, new THREE.ConeGeometry(0.05, 0.22, 4), '#efe6c8', x, 0.3, -0.05);
  } else if (def.model === 'frost') {
    // 서리 포탑: 눈 덮인 돌 받침 + 떠 있는 반투명 결정 + 맴도는 조각 (head 가 천천히 돈다)
    rimY = base(0.7, 0.9, 'frostStone', 'snow', 0.98); rimR = 0.63;
    head.position.y = 1.62;
    const crystal = add(head, new THREE.OctahedronGeometry(0.4, 0), { color: def.color ?? '#8fd0ff', roughness: 0.1, transparent: true, opacity: 0.85, emissive: '#3a7fa0', emissiveIntensity: 0.35 });
    crystal.scale.y = 1.55;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const shard = add(head, new THREE.OctahedronGeometry(0.12, 0), { color: '#e8f8ff', roughness: 0.1, transparent: true, opacity: 0.9 }, Math.cos(a) * 0.52, -0.2, Math.sin(a) * 0.52);
      shard.scale.y = 1.6;
    }
  } else if (def.model === 'crossbow') {
    // 석궁 포탑: 돌 받침 + 나무 개머리 + 휜 강철 활 + 볼트
    rimY = base(0.72, 1.0, 'stone', 'plank', 1.08); rimR = 0.65;
    head.position.y = 1.32;
    add(head, new THREE.BoxGeometry(0.22, 0.2, 1.1), 'wood');
    const prod = add(head, new THREE.TorusGeometry(0.62, 0.05, 5, 14, Math.PI * 0.8), 'steel', 0, 0, 0.12);
    prod.rotation.set(Math.PI / 2, 0, Math.PI * 0.1);
    add(head, new THREE.BoxGeometry(1.05, 0.02, 0.02), 'rope', 0, 0.02, 0.28);
    add(head, new THREE.BoxGeometry(0.05, 0.05, 0.85), 'darkwood', 0, 0.13, 0.28);
    add(head, new THREE.ConeGeometry(0.06, 0.16, 4).rotateX(Math.PI / 2), 'steel', 0, 0.13, 0.76);
  } else {
    // 나무 활 포탑: 판자 망루 + 휜 나무 활 + 시위 + 깃 달린 화살
    rimY = base(0.66, 0.9, 'wood', 'plank', 0.98); rimR = 0.6;
    head.position.y = 1.2;
    add(head, new THREE.BoxGeometry(0.16, 0.16, 0.9), 'darkwood');
    const bow = add(head, new THREE.TorusGeometry(0.44, 0.05, 5, 12, Math.PI), 'darkwood', 0, 0, 0.3);
    bow.rotation.set(Math.PI / 2, 0, 0);
    add(head, new THREE.BoxGeometry(0.88, 0.02, 0.02), 'rope', 0, 0.02, 0.3);
    add(head, new THREE.BoxGeometry(0.035, 0.035, 0.7), 'wood', 0, 0.1, 0.15);
    add(head, new THREE.ConeGeometry(0.05, 0.14, 4).rotateX(Math.PI / 2), 'steel', 0, 0.1, 0.55);
    for (const s of [-1, 1]) add(head, new THREE.BoxGeometry(0.02, 0.08, 0.14), 'cloth', s * 0.03, 0.13, -0.18);
  }

  // 레벨 장식 (stars[0]=Lv2 … stars[3]=Lv5) — 켜지면 그대로 쌓인다
  const stars = [];
  const lv = () => { const grp = new THREE.Group(); grp.visible = false; g.add(grp); stars.push(grp); return grp; };
  const bronze = flat('bronze');
  const iron = flat('iron');
  const gold = flat('gold');
  // Lv2: 받침 테두리에 청동 테
  const l2 = lv();
  const band = new THREE.Mesh(new THREE.TorusGeometry(rimR + 0.1, 0.035, 4, 20), bronze);
  band.rotation.x = Math.PI / 2;
  band.position.y = rimY;
  l2.add(band);
  // Lv3: 쇠 징 네 개 + 보강판
  const l3 = lv();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.34, 0.04), iron);
    plate.position.set(Math.cos(a) * (rimR + 0.08), rimY * 0.45, Math.sin(a) * (rimR + 0.08));
    plate.rotation.y = -a + Math.PI / 2;
    const stud = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), bronze);
    stud.position.copy(plate.position).multiplyScalar(1.06);
    l3.add(plate, stud);
  }
  // Lv4: 깃발 + 받침 아래쪽 두 번째 테
  const l4 = lv();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 5), flat('darkwood'));
  pole.position.set(-rimR * 0.8, rimY + 0.4, -rimR * 0.5);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), new THREE.MeshStandardMaterial({ color: '#b0443a', side: THREE.DoubleSide, flatShading: true, roughness: 0.95 }));
  flag.position.set(-rimR * 0.8 + 0.18, rimY + 0.82, -rimR * 0.5);
  const band2 = band.clone();
  band2.material = iron;
  band2.position.y = 0.12;
  band2.scale.setScalar(1.12);
  l4.add(pole, flag, band2);
  // Lv5: 테를 금으로 + 머리 위 금관
  const l5 = lv();
  const goldBand = band.clone();
  goldBand.material = gold;
  goldBand.scale.setScalar(1.02);
  l5.add(goldBand);

  const crown = new THREE.Group();
  crown.add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.1, 8), gold));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.18, 4), gold);
    spike.position.set(Math.cos(a) * 0.21, 0.12, Math.sin(a) * 0.21);
    crown.add(spike);
  }
  const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), flat({ color: '#e0645a', emissive: '#e0645a', emissiveIntensity: 0.4 }));
  jewel.position.set(0, 0.05, 0.25);
  crown.add(jewel);
  crown.position.y = 0.55;
  crown.visible = false;
  head.add(crown);

  g.add(head);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group: g, head, parts, stars, crown };
}
