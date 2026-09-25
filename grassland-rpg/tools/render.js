// 가이드용 그림 뽑기 (개발 서버에서 /tools/render.html). 게임의 모양 함수를 그대로 써서 PNG로 만든다.
import * as THREE from 'three';
import config from '../src/data/config.json';
import player from '../src/data/player.json';
import monsters from '../src/data/monsters.json';
import items from '../src/data/items.json';
import buildings from '../src/data/buildings.json';
import turrets from '../src/data/turrets.json';
import nodes from '../src/data/nodes.json';
import npcs from '../src/data/npcs.json';
import { createMonsterModel } from '../src/entities/MonsterModel.js';
import { nightLook } from '../src/entities/monsterKit.js';
import { createNpcModel } from '../src/entities/NpcModel.js';
import { createPlayerModel, applyAppearance, createWeaponMesh } from '../src/entities/PlayerModel.js';
import { createTurretModel } from '../src/entities/TurretModels.js';
import { createFacilityModel } from '../src/entities/FacilityModels.js';
import { createBaseModel } from '../src/entities/BaseModels.js';
import { ResourceNode } from '../src/entities/ResourceNode.js';
import { Wall } from '../src/entities/Wall.js';

const SIZE = 420;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(SIZE, SIZE);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

function snap(obj, { yaw = 0.55, pitch = 0.42, pad = 1.15, ground = true } = {}) {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x9fbf82, 1.35));
  const sun = new THREE.DirectionalLight(0xfff0d2, 1.9);
  sun.position.set(4, 8, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  scene.add(obj);
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const s = sun.shadow.camera;
  s.left = s.bottom = -sphere.radius * 2;
  s.right = s.top = sphere.radius * 2;
  sun.target.position.copy(sphere.center);
  scene.add(sun.target);
  if (ground) {
    const g = new THREE.Mesh(new THREE.CircleGeometry(sphere.radius * 0.95, 40).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.18 }));
    g.position.y = box.min.y + 0.001;
    g.receiveShadow = true;
    scene.add(g);
  }
  obj.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  const cam = new THREE.PerspectiveCamera(28, 1, 0.05, 500);
  const dist = (sphere.radius * pad) / Math.sin(THREE.MathUtils.degToRad(14));
  cam.position.set(
    sphere.center.x + Math.sin(yaw) * Math.cos(pitch) * dist,
    sphere.center.y + Math.sin(pitch) * dist,
    sphere.center.z + Math.cos(yaw) * Math.cos(pitch) * dist,
  );
  cam.lookAt(sphere.center);
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL('image/png');
}

const fakeScene = { add() {}, remove() {} };
const fakeCtx = { data: { buildings }, scene: fakeScene, camera: new THREE.PerspectiveCamera() };

window.renderAll = () => {
  const out = {};
  // 몬스터
  for (const [id, def] of Object.entries(monsters)) {
    const model = createMonsterModel(def, id);
    const { body } = model;
    if (window.nightRender) body.add(nightLook(model, def.radius, id.startsWith('night')));
    const g = new THREE.Group();
    g.add(body);
    if (def.flier) body.position.y = 0.9;
    out[`monster_${id}`] = snap(g);
  }
  // 주민
  for (const [id, def] of Object.entries(npcs.npcs)) out[`npc_${id}`] = snap(createNpcModel(def).group);
  // 플레이어: 기본 + 캐릭터 만들기 예시 + 장비 예시
  const look = (hair, clothes, accessory, worn = {}, weapon) => {
    const m = createPlayerModel(player);
    applyAppearance(m, worn, { hair, clothes, accessory });
    if (weapon) {
      m.swordPivot.remove(m.weapon);
      m.swordPivot.add(createWeaponMesh(weapon.weaponType ?? 'sword', weapon.color, Object.keys(I).find((k) => I[k] === weapon)));
    }
    m.group.remove(m.trail, m.spinTrail); // 휘두르기 궤적은 크기 계산에서 빼기
    return snap(m.group, { yaw: 0.35 });
  };
  const C = config.character;
  out.player_default = look(C.default.hair, C.default.clothes, 'sprout');
  out.player_flower = look('#f2a7c3', '#ffcf5c', 'flower');
  out.player_ribbon = look('#2f2a28', '#ff8fab', 'ribbon');
  out.player_blue = look('#8fb8e8', '#5fc4c0', 'none');
  const I = items.items;
  out.player_grass = look('#7a4b2a', null, 'sprout', { head: I.leaf_hat, body: I.grass_tunic, feet: I.straw_shoes }, I.bamboo_spear);
  out.player_snow = look('#e0b25a', null, 'sprout', { head: I.fur_hat, body: I.yeti_coat, feet: I.snow_boots }, I.glacier_hammer);
  out.player_forest = look('#2f2a28', null, 'sprout', { head: I.mushroom_hat, body: I.leather_vest, feet: I.leather_boots }, I.mossy_mace);
  out.player_desert = look('#7a4b2a', null, 'sprout', { head: I.desert_hood, body: I.desert_cloak, feet: I.sand_sandals }, I.dune_bow);
  out.player_royal = look('#f2a7c3', null, 'sprout', { head: I.royal_jelly_crown, body: I.grass_tunic, feet: I.leather_boots }, I.dawn_blade);
  out.player_cactus = look('#7a4b2a', '#5b8def', 'sprout', { head: I.cactus_crown }, I.sun_blade);
  // 무기 (3D)
  for (const [id, def] of Object.entries(I)) {
    if (def.equipSlot !== 'weapon') continue;
    const g = createWeaponMesh(def.weaponType ?? 'sword', def.color, id);
    g.position.x = 0;
    g.rotation.y = -Math.PI / 2;
    out[`weapon_${id}`] = snap(g, { yaw: 0.9, pitch: 0.7, ground: false });
  }
  // 포탑 Lv1 / Lv5
  for (const [id, def] of Object.entries(turrets)) {
    const m = createTurretModel(def);
    out[`turret_${id}`] = snap(m.group);
    const m5 = createTurretModel(def);
    m5.stars.forEach((s) => { s.visible = true; });
    m5.crown.visible = true;
    out[`turret_${id}_lv5`] = snap(m5.group);
  }
  // 기지 단계
  for (const [lv, def] of Object.entries(buildings.baseLevels)) out[`base_${lv}`] = snap(createBaseModel(def.model).group);
  // 부속 건물
  for (const [id, def] of Object.entries(buildings.buildings)) out[`facility_${id}`] = snap(createFacilityModel(def.model).group);
  // 벽
  for (const id of Object.keys(buildings.walls)) {
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const w = new Wall(fakeCtx, id, 1, i, 0);
      w.hpBar.group.visible = false;
      w.mesh.position.set(i - 1, 0, 0);
      g.add(w.mesh);
    }
    out[`wall_${id}`] = snap(g, { yaw: 0.6 });
  }
  // 채집 노드
  let seed = 7;
  const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const [id, def] of Object.entries(nodes.nodes)) {
    const n = new ResourceNode(fakeScene, id, id, def, new THREE.Vector3(), rng);
    n.group.rotation.y = 0.4;
    out[`node_${id}`] = snap(n.group);
  }
  return out;
};
window.renderReady = true;
