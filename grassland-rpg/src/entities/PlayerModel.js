import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8 });

// 플레이어 모양 (로우폴리 기본 도형)
export function createPlayerModel(base) {
  const g = new THREE.Group();
  const bodyMats = [];
  const addMat = (m) => (bodyMats.push(m), m);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.35, 3, 8), addMat(flat('#5b8def')));
  body.position.y = 0.55;
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), addMat(flat('#ffd9b8')));
  head.position.y = 1.18;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), addMat(flat('#7a4b2a')));
  hair.position.y = 1.22;
  hair.rotation.x = -0.25;
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), addMat(flat('#63c96b')));
  leaf.position.set(0.05, 1.6, 0);
  leaf.rotation.z = -0.5;
  const eyeMat = flat('#2b2b33');
  const eyeGeo = new THREE.SphereGeometry(0.045, 6, 4);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.12, 1.18, 0.3);
  eyeR.position.set(0.12, 1.18, 0.3);
  const footGeo = new THREE.BoxGeometry(0.16, 0.12, 0.24);
  const footMat = addMat(flat('#6b4a36'));
  const footL = new THREE.Mesh(footGeo, footMat);
  const footR = new THREE.Mesh(footGeo, footMat);
  footL.position.set(-0.13, 0.06, 0);
  footR.position.set(0.13, 0.06, 0);

  // 칼은 몸 중심의 피벗에 달려서 좌우로 휘두른다.
  const swordPivot = new THREE.Group();
  swordPivot.position.y = 0.7;
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.9), flat('#e8eef5'));
  blade.position.set(0.42, 0, 0.55);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.06), flat('#c9a44a'));
  guard.position.set(0.42, 0, 0.1);
  swordPivot.add(blade, guard);
  swordPivot.rotation.y = 0.9;

  const inner = new THREE.Group();
  inner.add(body, head, hair, leaf, eyeL, eyeR, footL, footR, swordPivot);
  inner.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.add(inner);
  

  // 휘두를 때 잠깐 보이는 궤적
  const arc = THREE.MathUtils.degToRad(base.attackArcDeg);
  const trailGeo = new THREE.RingGeometry(0.5, base.attackRange, 20, 1, -arc / 2, arc);
  trailGeo.rotateX(-Math.PI / 2);
  trailGeo.rotateY(-Math.PI / 2);
  const trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
  }));
  trail.position.y = 0.45;
  g.add(trail);

  // 회전 베기 때 보이는 둥근 궤적
  const spinGeo = new THREE.RingGeometry(0.5, base.attackRange, 32);
  spinGeo.rotateX(-Math.PI / 2);
  const spinTrail = new THREE.Mesh(spinGeo, trail.material.clone());
  spinTrail.position.y = 0.45;
  g.add(spinTrail);

  return { group: g, inner, bodyMats, footL, footR, swordPivot, trail, spinTrail, blade };
}
