import * as THREE from 'three';
import { SHAPES } from './monsterShapes.js';

// 몬스터 모양. def.shape: 'slime' (말랑한 젤리) / 'mushroom' (갓 쓴 버섯) / 'cactus' (걷는 선인장) / 'golem' (얼음 덩어리)
// 돌려주는 mat 은 피격 번쩍임·사라짐 연출에 쓰는 본체 재질
export function createMonsterModel(def) {
  if (SHAPES[def.shape]) {
    const { body, mat, extraMats, wings } = SHAPES[def.shape](def);
    return { body, mat, extraMats, wings };
  }
  const r = def.radius;
  const body = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: def.color, flatShading: true, roughness: 0.35, transparent: true, opacity: 0.92,
  });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x23262e, flatShading: true });
  const eyeGeo = new THREE.SphereGeometry(r * 0.11, 6, 4);
  const eyes = (y, z) => {
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * r * 0.3, y, z);
      body.add(eye);
    }
  };

  if (def.shape === 'cactus') {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.65, r * 1.9, 8), mat);
    trunk.position.y = r * 0.95;
    trunk.castShadow = true;
    body.add(trunk);
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 0.8, 6), mat);
      arm.position.set(side * r * 0.72, r * 1.25, 0);
      const elbow = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 0.5, 6), mat);
      elbow.rotation.z = Math.PI / 2;
      elbow.position.set(side * r * 0.55, r * 0.9, 0);
      body.add(arm, elbow);
    }
    const flower = new THREE.Mesh(new THREE.OctahedronGeometry(r * 0.25, 0), new THREE.MeshBasicMaterial({ color: def.flowerColor }));
    flower.position.y = r * 1.95;
    body.add(flower);
    eyes(r * 1.25, r * 0.58);
    return { body, mat, extraMats: [] };
  }

  if (def.shape === 'golem') {
    const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(r * 0.85, 0), mat);
    torso.position.y = r * 1.05;
    torso.scale.set(1.1, 1, 0.9);
    const head = new THREE.Mesh(new THREE.BoxGeometry(r * 0.8, r * 0.6, r * 0.7), mat);
    head.position.y = r * 1.95;
    for (const m of [torso, head]) { m.castShadow = true; body.add(m); }
    for (const side of [-1, 1]) {
      const fist = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.38, 0), mat);
      fist.position.set(side * r * 1.05, r * 0.7, r * 0.1);
      fist.castShadow = true;
      body.add(fist);
    }
    const glow = new THREE.MeshBasicMaterial({ color: 0xe8fbff });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(r * 0.14, r * 0.08, r * 0.05), glow);
      eye.position.set(side * r * 0.18, r * 2.0, r * 0.36);
      body.add(eye);
    }
    return { body, mat, extraMats: [] };
  }

  if (def.shape === 'mushroom') {
    const stemMat = new THREE.MeshStandardMaterial({ color: def.stemColor, flatShading: true, roughness: 0.6, transparent: true });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.7, r * 1.1, 7), stemMat);
    stem.position.y = r * 0.55;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    cap.position.y = r * 1.0;
    cap.scale.y = 0.8;
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xfff6e8 });
    const dotGeo = new THREE.SphereGeometry(r * 0.16, 6, 4);
    for (const [a, h] of [[0.3, 0.65], [2.4, 0.5], [4.2, 0.6], [1.3, 0.9]]) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(Math.cos(a) * r * 0.75 * h, r * 1.0 + r * 0.9 * (1 - h * 0.6), Math.sin(a) * r * 0.75 * h);
      body.add(dot);
    }
    stem.castShadow = true;
    cap.castShadow = true;
    body.add(stem, cap);
    eyes(r * 0.7, r * 0.6);
    return { body, mat, extraMats: [stemMat] };
  }

  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mat);
  blob.scale.set(1, 0.78, 1);
  blob.position.y = r * 0.78;
  blob.castShadow = true;
  const shine = new THREE.Mesh(
    new THREE.SphereGeometry(r * 0.14, 6, 4),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }),
  );
  shine.position.set(-r * 0.35, r * 1.2, r * 0.3);
  body.add(blob, shine);
  eyes(r * 0.95, r * 0.82);
  return { body, mat, extraMats: [] };
}
