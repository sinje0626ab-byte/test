import * as THREE from 'three';

// 장비 외형: 머리 장비는 아이템마다 모양이 다른 모자, 몸 장비는 옷 색 + 세트 장식(잎 깃·망토·털 칼라…),
// 신발은 색 + 장식. 아이콘(ui/itemArt.js)과 같은 팔레트.
const m = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, ...extra });

// 옷·신발 색 (아이템 색 대신 차분한 재질 색)
export const CLOTH = {
  grass_tunic: '#93b95c', leather_vest: '#8a5a3a', desert_cloak: '#d8c39a', yeti_coat: '#9fb6c8',
};
export const SHOES = {
  straw_shoes: '#d9c48f', leather_boots: '#7c5236', sand_sandals: '#c9955a', snow_boots: '#6f879c',
};

function group(parts) {
  const g = new THREE.Group();
  for (const [geo, mat, pos, rot, scale] of parts) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    if (rot) mesh.rotation.set(...rot);
    if (scale) mesh.scale.set(...scale);
    mesh.castShadow = true;
    g.add(mesh);
  }
  g.visible = false;
  return g;
}

function hats() {
  const leaf = m('#7fae55');
  const leafDark = m('#63904a');
  const red = m('#c9584e');
  const cream = m('#f1e6cf');
  const sand = m('#d6ae76');
  const band = m('#b0613f');
  const furBrown = m('#8a6a52');
  const fur = m('#ece6da', { roughness: 1 });
  const gold = m('#e0b34a', { roughness: 0.3, metalness: 0.65 });
  const pink = m('#e59ab8', { roughness: 0.25, transparent: true, opacity: 0.9 });
  const cactus = m('#79a95a');
  const H = 1.3;
  const dome = (r, mat, y = H, sy = 1) => [new THREE.SphereGeometry(r, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat, [0, y, 0], null, [1, sy, 1]];
  const out = {
    // 풀잎 모자: 잎을 겹쳐 엮은 넓은 삿갓 + 꼭지 줄기
    leaf_hat: group([
      [new THREE.ConeGeometry(0.56, 0.3, 8), leaf, [0, H + 0.14, 0]],
      [new THREE.CylinderGeometry(0.58, 0.6, 0.04, 8), leafDark, [0, H, 0]],
      ...[0, 1, 2, 3].map((i) => [new THREE.IcosahedronGeometry(0.14, 0), i % 2 ? leafDark : leaf, [Math.cos(i * 1.57 + 0.4) * 0.3, H + 0.1, Math.sin(i * 1.57 + 0.4) * 0.3], [0, i, 0], [1.4, 0.35, 0.7]]),
      [new THREE.CylinderGeometry(0.015, 0.02, 0.18, 4), m('#6f914c'), [0.03, H + 0.35, 0], [0, 0, -0.4]],
      [new THREE.IcosahedronGeometry(0.07, 0), leaf, [0.1, H + 0.43, 0], null, [1.4, 0.4, 0.8]],
    ]),
    // 버섯 모자: 붉은 갓 + 흰 점 + 크림색 주름 띠
    mushroom_hat: group([
      dome(0.5, red, H + 0.02, 0.72),
      [new THREE.CylinderGeometry(0.5, 0.44, 0.07, 12), cream, [0, H, 0]],
      ...[[0.2, 0.3, 0.12], [-0.22, 0.26, 0.16], [0.02, 0.36, -0.2], [-0.12, 0.2, -0.36], [0.33, 0.14, -0.2]].map(([x, y, z]) => [new THREE.SphereGeometry(0.06, 6, 4), cream, [x, H + y, z], null, [1, 0.5, 1]]),
    ]),
    // 사막 두건: 머리를 감싸고 얼굴만 열린 천 + 붉은 띠 + 목도리
    desert_hood: group([
      [new THREE.SphereGeometry(0.42, 10, 8, Math.PI * 0.72, Math.PI * 1.56, 0, Math.PI * 0.62), sand, [0, 1.18, 0]],
      [new THREE.TorusGeometry(0.36, 0.035, 5, 14), band, [0, 1.36, 0], [Math.PI / 2 - 0.15, 0, 0]],
      [new THREE.TorusGeometry(0.26, 0.07, 5, 12), sand, [0, 0.9, 0], [Math.PI / 2, 0, 0]],
      [new THREE.ConeGeometry(0.07, 0.3, 5), sand, [0.12, 0.72, -0.26], [0.3, 0, 0.2]],
    ]),
    // 털모자: 갈색 가죽 + 흰 털 테두리 + 방울
    fur_hat: group([
      dome(0.39, furBrown, H, 1.05),
      [new THREE.TorusGeometry(0.39, 0.09, 6, 14), fur, [0, H, 0], [Math.PI / 2, 0, 0]],
      [new THREE.IcosahedronGeometry(0.1, 1), fur, [0, H + 0.42, 0]],
    ]),
    // 선인장왕의 왕관: 금 띠 + 선인장 봉오리 뾰족 끝 + 분홍 꽃
    cactus_crown: group([
      [new THREE.CylinderGeometry(0.34, 0.37, 0.16, 10, 1, true), gold, [0, H + 0.16, 0]],
      ...[0, 1, 2, 3, 4].map((i) => [new THREE.ConeGeometry(0.06, 0.2, 5), gold, [Math.cos(i * 1.257) * 0.34, H + 0.32, Math.sin(i * 1.257) * 0.34]]),
      ...[0, 2, 4].map((i) => [new THREE.SphereGeometry(0.05, 6, 4), cactus, [Math.cos(i * 1.257) * 0.34, H + 0.44, Math.sin(i * 1.257) * 0.34]]),
      [new THREE.OctahedronGeometry(0.07, 0), m('#e59ab8', { emissive: '#a04a6a', emissiveIntensity: 0.3 }), [0, H + 0.2, 0.37]],
    ]),
    // 말랑 왕관: 반투명 분홍 젤리 띠 + 둥근 끝 + 흘러내린 방울
    royal_jelly_crown: group([
      [new THREE.CylinderGeometry(0.34, 0.37, 0.18, 10, 1, true), pink, [0, H + 0.16, 0]],
      ...[0, 1, 2, 3, 4].map((i) => [new THREE.SphereGeometry(0.07, 6, 5), pink, [Math.cos(i * 1.257) * 0.34, H + 0.34, Math.sin(i * 1.257) * 0.34]]),
      [new THREE.SphereGeometry(0.045, 6, 4), pink, [0.2, H + 0.06, 0.22], null, [1, 1.5, 1]],
      [new THREE.OctahedronGeometry(0.06, 0), gold, [0, H + 0.2, 0.37]],
    ]),
  };
  // 아트가 없는 머리 장비: 둥근 모자 (장비 색)
  const genericMat = m('#ffffff');
  out.generic = group([dome(0.4, genericMat), [new THREE.CylinderGeometry(0.5, 0.5, 0.05, 12), genericMat, [0, H, 0]]]);
  out.generic.userData.mat = genericMat;
  return out;
}

function outfits() {
  const leaf = m('#7fae55');
  const twine = m('#d9c48f');
  const dark = m('#5e3e28');
  const gold = m('#e0b34a', { roughness: 0.3, metalness: 0.6 });
  const fur = m('#ece6da', { roughness: 1 });
  const cape = m('#c98a52', { side: THREE.DoubleSide });
  return {
    // 풀잎 옷: 잎 깃 + 풀 섬유 허리끈
    grass_tunic: group([
      ...[0, 1, 2, 3, 4, 5].map((i) => [new THREE.ConeGeometry(0.09, 0.2, 4), leaf, [Math.sin(i * 1.05) * 0.26, 0.84, Math.cos(i * 1.05) * 0.26], [Math.PI + Math.cos(i * 1.05) * 0.5, 0, -Math.sin(i * 1.05) * 0.5], [1, 1, 0.5]]),
      [new THREE.TorusGeometry(0.31, 0.035, 5, 14), twine, [0, 0.5, 0], [Math.PI / 2, 0, 0]],
    ]),
    // 가죽 조끼: 짙은 가죽 허리띠 + 금 버클 + 어깨 끈
    leather_vest: group([
      [new THREE.TorusGeometry(0.31, 0.04, 5, 14), dark, [0, 0.48, 0], [Math.PI / 2, 0, 0]],
      [new THREE.BoxGeometry(0.1, 0.08, 0.04), gold, [0, 0.48, 0.32]],
      ...[-1, 1].map((s) => [new THREE.BoxGeometry(0.07, 0.05, 0.5), dark, [s * 0.15, 0.86, 0], [0, 0, s * 0.2]]),
    ]),
    // 사막 망토: 등에 늘어진 망토 + 목 두름 + 금 걸쇠
    desert_cloak: group([
      [new THREE.CylinderGeometry(0.3, 0.46, 0.78, 10, 1, true, Math.PI * 0.62, Math.PI * 0.76), cape, [0, 0.5, 0]],
      [new THREE.TorusGeometry(0.28, 0.06, 5, 12), cape, [0, 0.88, 0], [Math.PI / 2, 0, 0]],
      [new THREE.OctahedronGeometry(0.05, 0), gold, [0, 0.86, 0.3]],
    ]),
    // 설인 털옷: 두꺼운 털 칼라 + 털 밑단 + 나무 단추
    yeti_coat: group([
      [new THREE.TorusGeometry(0.28, 0.09, 6, 14), fur, [0, 0.88, 0], [Math.PI / 2, 0, 0]],
      [new THREE.TorusGeometry(0.32, 0.07, 6, 14), fur, [0, 0.28, 0], [Math.PI / 2, 0, 0]],
      ...[0.5, 0.65].map((y) => [new THREE.SphereGeometry(0.03, 5, 4), m('#7c5236'), [0, y, 0.31]]),
    ]),
  };
}

function shoes() {
  const fur = m('#ece6da', { roughness: 1 });
  const strap = m('#b0613f');
  const straw = m('#b89a5e');
  const pair = (make) => {
    const g = new THREE.Group();
    for (const x of [-0.13, 0.13]) for (const [geo, mat, pos] of make()) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x + pos[0], pos[1], pos[2]);
      g.add(mesh);
    }
    g.visible = false;
    return g;
  };
  return {
    straw_shoes: pair(() => [[new THREE.BoxGeometry(0.17, 0.03, 0.05), straw, [0, 0.13, 0.04]]]),
    sand_sandals: pair(() => [[new THREE.BoxGeometry(0.17, 0.03, 0.04), strap, [0, 0.12, 0.06]], [new THREE.BoxGeometry(0.17, 0.03, 0.04), strap, [0, 0.12, -0.05]]]),
    leather_boots: pair(() => [[new THREE.BoxGeometry(0.15, 0.14, 0.14), m('#7c5236'), [0, 0.18, -0.04]]]),
    snow_boots: pair(() => [[new THREE.CylinderGeometry(0.11, 0.11, 0.08, 7), fur, [0, 0.16, -0.02]]]),
  };
}

// 플레이어 모델에 모든 장비 모양을 붙여 두고, 낀 장비만 보인다
export function createGear(inner) {
  const gear = { hats: hats(), outfits: outfits(), shoes: shoes() };
  for (const set of Object.values(gear)) for (const g of Object.values(set)) inner.add(g);
  return gear;
}

export function showGear(gear, ids, headColor) {
  for (const [id, g] of Object.entries(gear.hats)) g.visible = false;
  if (ids.head) {
    const hat = gear.hats[ids.head] ?? gear.hats.generic;
    hat.visible = true;
    if (!gear.hats[ids.head]) hat.userData.mat.color.set(headColor);
  }
  for (const [id, g] of Object.entries(gear.outfits)) g.visible = id === ids.body;
  for (const [id, g] of Object.entries(gear.shoes)) g.visible = id === ids.feet;
}
