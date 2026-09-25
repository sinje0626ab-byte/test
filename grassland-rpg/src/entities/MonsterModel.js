import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SHAPES } from './monsterShapes.js';
import { BOSS_SHAPES } from './bossShapes.js';

// 몬스터 모양. def.shape 으로 고르고, id 로 같은 모양 안의 변형(모래·눈·밤 슬라임, 보스 장식)을 고른다.
// 돌려주는 mat 은 피격 번쩍임·사라짐 연출에 쓰는 본체 재질, eyeMat 은 밤에 빛나는 눈
export function createMonsterModel(def, id) {
  const make = SHAPES[def.shape] ?? BOSS_SHAPES[def.shape] ?? SHAPES.slime;
  const { body, mat, extraMats, wings, eyeMat } = make(def, id);
  bake(body, new Set(wings ?? []));
  return { body, mat, extraMats, wings, eyeMat };
}

// 조각이 많은 몸을 재질별로 한 덩어리로 합친다 (그리기 호출 수를 줄인다). 움직이는 조각(날개)은 그대로.
function bake(body, keep) {
  const groups = new Map();
  for (const child of [...body.children]) {
    if (!child.isMesh || keep.has(child)) continue;
    child.updateMatrix();
    const geo = (child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone()).applyMatrix4(child.matrix);
    for (const name of Object.keys(geo.attributes)) if (name !== 'position' && name !== 'normal' && name !== 'uv') geo.deleteAttribute(name);
    if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array((geo.attributes.position.count) * 2), 2));
    const list = groups.get(child.material) ?? [];
    list.push({ geo, shadow: child.castShadow });
    groups.set(child.material, list);
    body.remove(child);
    child.geometry.dispose();
  }
  for (const [material, list] of groups) {
    const merged = mergeGeometries(list.map((x) => x.geo));
    for (const x of list) x.geo.dispose();
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = list.some((x) => x.shadow);
    body.add(mesh);
  }
}
