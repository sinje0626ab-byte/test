import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8 });
const DEFAULT = { body: '#5b8def', feet: '#6b4a36', blade: '#e8eef5' };

// 무기 종류별 모양. 피벗 기준 오른손 자리(x 0.42)에서 앞(+z)으로 뻗는다.
export function createWeaponMesh(type, color) {
  const g = new THREE.Group();
  const add = (geo, c, x, y, z) => {
    const m = new THREE.Mesh(geo, flat(c));
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
    return m;
  };
  if (type === 'spear') {
    add(new THREE.CylinderGeometry(0.035, 0.035, 1.7, 6).rotateX(Math.PI / 2), '#b88452', 0, 0, 0.55);
    add(new THREE.ConeGeometry(0.09, 0.35, 4).rotateX(Math.PI / 2), color, 0, 0, 1.55);
  } else if (type === 'hammer') {
    add(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6).rotateX(Math.PI / 2), '#8a6440', 0, 0, 0.35);
    add(new THREE.BoxGeometry(0.42, 0.3, 0.3), color, 0, 0, 0.8);
  } else if (type === 'bow') {
    const bow = add(new THREE.TorusGeometry(0.5, 0.035, 5, 14, Math.PI), color, 0, 0, 0.35);
    bow.rotation.set(0, 0, Math.PI / 2);
    bow.rotation.y = Math.PI / 2;
    add(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 3), '#f4efe3', 0, 0, 0.35).rotation.x = 0;
  } else {
    add(new THREE.BoxGeometry(0.08, 0.04, 0.9), color, 0, 0, 0.55);
    add(new THREE.BoxGeometry(0.26, 0.06, 0.06), '#c9a44a', 0, 0, 0.1);
  }
  g.position.x = 0.42;
  return g;
}

// 휘두를 때 잠깐 보이는 부채꼴 궤적 (무기마다 사거리·각도가 다르다)
export function createTrail(range, arcDeg) {
  const arc = THREE.MathUtils.degToRad(Math.max(10, arcDeg));
  const geo = new THREE.RingGeometry(0.5, range, 20, 1, -arc / 2, arc);
  geo.rotateX(-Math.PI / 2);
  geo.rotateY(-Math.PI / 2);
  const trail = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
  }));
  trail.position.y = 0.45;
  return trail;
}

// 플레이어 모양 (로우폴리 기본 도형)
export function createPlayerModel(base) {
  const g = new THREE.Group();
  const bodyMats = [];
  const addMat = (m) => (bodyMats.push(m), m);

  const bodyMat = addMat(flat(DEFAULT.body));
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.35, 3, 8), bodyMat);
  body.position.y = 0.55;
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), addMat(flat('#ffd9b8')));
  head.position.y = 1.18;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), addMat(flat('#7a4b2a')));
  hair.position.y = 1.22;
  hair.rotation.x = -0.25;
  // 머리 장식 (캐릭터 만들기): 새싹 잎 / 꽃 / 리본 / 없음
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), addMat(flat('#63c96b')));
  leaf.position.set(0.05, 1.6, 0);
  leaf.rotation.z = -0.5;
  const flower = new THREE.Group();
  const petalMat = addMat(flat('#ff8fab'));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.065, 5, 4), petalMat);
    petal.position.set(Math.cos(a) * 0.08, 0, Math.sin(a) * 0.08);
    flower.add(petal);
  }
  flower.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 4), addMat(flat('#ffe08a'))));
  flower.position.set(0.22, 1.48, 0.12);
  flower.rotation.set(0.3, 0, -0.6);
  const ribbon = new THREE.Group();
  const ribbonMat = addMat(flat('#e0645a'));
  for (const x of [-0.09, 0.09]) {
    const loop = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 4).rotateZ(x > 0 ? -Math.PI / 2 : Math.PI / 2), ribbonMat);
    loop.position.x = x;
    ribbon.add(loop);
  }
  ribbon.add(new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 4), ribbonMat));
  ribbon.position.set(0, 1.5, -0.2);
  ribbon.rotation.x = -0.4;
  const accessories = { sprout: leaf, flower, ribbon };
  const eyeMat = flat('#2b2b33');
  const eyeGeo = new THREE.SphereGeometry(0.045, 6, 4);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.12, 1.18, 0.3);
  eyeR.position.set(0.12, 1.18, 0.3);
  const footGeo = new THREE.BoxGeometry(0.16, 0.12, 0.24);
  const footMat = addMat(flat(DEFAULT.feet));
  const footL = new THREE.Mesh(footGeo, footMat);
  const footR = new THREE.Mesh(footGeo, footMat);
  footL.position.set(-0.13, 0.06, 0);
  footR.position.set(0.13, 0.06, 0);

  // 모자: 머리 장비를 끼면 보인다 (색은 장비 색)
  const hatMat = addMat(flat('#ffffff'));
  const hat = new THREE.Group();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), hatMat);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 12), hatMat);
  dome.position.y = 1.3;
  brim.position.y = 1.3;
  hat.add(dome, brim);
  hat.visible = false;

  // 무기는 몸 중심의 피벗에 달려서 휘두른다. 무기 종류가 바뀌면 안의 모양만 바꾼다.
  const swordPivot = new THREE.Group();
  swordPivot.position.y = 0.7;
  swordPivot.rotation.y = 0.9;
  const weapon = createWeaponMesh('sword', DEFAULT.blade);
  swordPivot.add(weapon);

  const inner = new THREE.Group();
  inner.add(body, head, hair, leaf, flower, ribbon, eyeL, eyeR, footL, footR, hat, swordPivot);
  inner.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.add(inner);

  const trail = createTrail(base.attackRange, base.attackArcDeg);
  g.add(trail);

  // 회전 베기 때 보이는 둥근 궤적
  const spinGeo = new THREE.RingGeometry(0.5, base.attackRange, 32);
  spinGeo.rotateX(-Math.PI / 2);
  const spinTrail = new THREE.Mesh(spinGeo, trail.material.clone());
  spinTrail.position.y = 0.45;
  g.add(spinTrail);

  return { group: g, inner, bodyMats, footL, footR, swordPivot, weapon, trail, spinTrail, bodyMat, footMat, hatMat, hat, hair, leaf, accessories };
}

// 외형: 장비(모자·옷·신발 색)가 있으면 장비 색, 없으면 캐릭터 만들기에서 고른 색·장식
// look = { hair, clothes, accessory }
export function applyAppearance(model, items, look = {}) {
  const { head, body, feet } = items;
  model.hat.visible = !!head;
  for (const [id, m] of Object.entries(model.accessories)) m.visible = !head && id === (look.accessory ?? 'sprout');
  if (head) model.hatMat.color.set(head.color);
  model.hair.material.color.set(look.hair ?? '#7a4b2a');
  model.bodyMat.color.set(body?.color ?? look.clothes ?? DEFAULT.body);
  model.footMat.color.set(feet?.color ?? DEFAULT.feet);
}

export const DEFAULT_BLADE = DEFAULT.blade;
