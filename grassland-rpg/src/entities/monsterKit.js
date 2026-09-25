import * as THREE from 'three';

// 몬스터 공통 디자인 키트
//   - 색: 데이터 색을 조금 차분하게(tone) 쓰고, 배·주둥이는 밝게 / 등은 어둡게 (두 톤)
//   - 얼굴: 세로로 긴 눈 + 흰 하이라이트, 필요하면 눈썹(사나움)·입·볼
//   - 눈 재질은 몬스터마다 하나(eyeMat) — 밤 몬스터는 눈만 은은히 빛난다
//   - mat = 몸통 재질(피격 번쩍임·사라짐), 나머지 재질은 extraMats (사라질 때 같이 투명해진다)

const tmpHsl = { h: 0, s: 0, l: 0 };
export function tone(color, { sat = 0.82, light = 0 } = {}) {
  const c = new THREE.Color(color);
  c.getHSL(tmpHsl);
  c.setHSL(tmpHsl.h, tmpHsl.s * sat, THREE.MathUtils.clamp(tmpHsl.l + light, 0.18, 0.88));
  return c;
}
export const shade = (color, k) => tone(color, { sat: 0.95, light: k });

export function kit(def) {
  const r = def.radius;
  const body = new THREE.Group();
  const extraMats = [];
  const base = tone(def.color);
  const mat = new THREE.MeshStandardMaterial({ color: base, flatShading: true, roughness: 0.6, transparent: true, opacity: 1 });
  const std = (color, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.7, transparent: true, ...extra });
    extraMats.push(m);
    return m;
  };
  const basic = (color, extra = {}) => {
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, ...extra });
    extraMats.push(m);
    return m;
  };
  const add = (geo, material, x = 0, y = 0, z = 0, s = null, parent = body) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x * r, y * r, z * r);
    if (s) m.scale.set(...s);
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  const eyeMat = std('#2a2430', { roughness: 0.3, emissive: '#000000' });
  const shine = basic('#ffffff');

  // 눈: y·z는 반지름 단위. mean = 눈썹으로 사납게, size = 눈 크기
  const eyes = ({ y, z, spread = 0.3, size = 0.12, mean = false, browColor, tilt = 0 }) => {
    const geo = new THREE.SphereGeometry(r * size, 8, 6);
    const hlGeo = new THREE.SphereGeometry(r * size * 0.35, 5, 4);
    for (const s of [-1, 1]) {
      const eye = add(geo, eyeMat, s * spread, y, z, [0.85, 1.2, 0.6]);
      eye.rotation.z = s * tilt;
      add(hlGeo, shine, s * spread - s * size * 0.25, y + size * 0.4, z + size * 0.45);
      if (mean) {
        const brow = add(new THREE.BoxGeometry(r * size * 2.2, r * size * 0.5, r * size * 0.6), std(browColor ?? shade(def.color, -0.22)), s * spread, y + size * 1.55, z - size * 0.1);
        brow.rotation.z = -s * 0.45;
      }
    }
  };
  const mouth = (y, z, w = 0.12) => add(new THREE.SphereGeometry(r * w, 6, 4), eyeMat, 0, y, z, [1, 0.45, 0.4]);
  const blush = (y, z, spread = 0.45) => {
    const m = basic('#ff9c8a', { opacity: 0.4 });
    for (const s of [-1, 1]) add(new THREE.SphereGeometry(r * 0.1, 6, 4), m, s * spread, y, z, [1, 0.55, 0.3]).castShadow = false;
  };

  return { r, body, mat, extraMats, eyeMat, base, std, basic, add, eyes, mouth, blush, def };
}

// 밤 몬스터 모습: 몸을 온통 보라로 칠하지 않는다.
// 몸은 살짝 어둡고 차갑게, 눈만 은은히 빛나고, 곁에 작은 빛 조각 둘이 맴돈다 (motes 는 Monster 가 돌린다)
const NIGHT_TINT = new THREE.Color('#2c2a4a');
export function nightLook(model, r, strong = false) {
  model.mat.color.lerp(NIGHT_TINT, strong ? 0.08 : 0.16);
  for (const m of model.extraMats) if (m.color && !m.isMeshBasicMaterial) m.color.lerp(NIGHT_TINT, 0.12);
  if (model.eyeMat) {
    model.eyeMat.color.set('#f4ecff');
    model.eyeMat.emissive.set('#b89cff');
    model.eyeMat.emissiveIntensity = 1.2;
  }
  const motes = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: '#cbbcff', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  model.extraMats.push(mat);
  for (let i = 0; i < 2; i++) {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(Math.max(0.05, r * 0.1), 0), mat);
    m.position.set((i ? -1 : 1) * r * 1.5, r * (1.4 + i * 0.5), 0);
    motes.add(m);
  }
  motes.userData.r = r;
  return motes;
}
