import * as THREE from 'three';
import { createMonsterModel } from '../entities/MonsterModel.js';
import { PAINTED } from './painted.js';

// 모델 사진: 3D 모델을 작은 캔버스에 찍어 그림 주소(dataURL)로 돌려준다. 렌더러는 하나만 만들어 같이 쓴다.
// - monsterPortrait: 도감 사진 (못 만난 몬스터는 검은 그림자, 한 번 찍은 사진은 기억)
// - snapshot: 아무 모델이나 (HUD 플레이어 초상화)
const SIZE = 256;
const cache = new Map();
let stage = null;

function setup() {
  const renderer = new THREE.WebGLRenderer({ canvas: document.createElement('canvas'), alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(SIZE, SIZE, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#fff6e0', '#7a8a5a', 1.6));
  const sun = new THREE.DirectionalLight('#ffffff', 1.8);
  sun.position.set(3, 6, 5);
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 100);
  const shadow = new THREE.MeshBasicMaterial({ color: '#3b3328' });
  return { renderer, scene, camera, shadow };
}

// obj 를 잠깐 무대에 올려 찍는다. place(camera) 가 카메라를 놓는다. obj 의 기하·재질은 건드리지 않는다
export function snapshot(obj, place, { silhouette = false } = {}) {
  stage ??= setup();
  const { renderer, scene, camera, shadow } = stage;
  scene.add(obj);
  place(camera);
  scene.overrideMaterial = silhouette ? shadow : null;
  renderer.render(scene, camera);
  scene.remove(obj);
  return renderer.domElement.toDataURL('image/png');
}

// def: monsters.json 항목, id: 몬스터 종류, known: 만나 봤는지
// 새로 그린 초상화(art/portraits/monster_<id>)가 있으면 그것 (못 만난 몬스터는 도감 CSS 가 검게 칠한다)
export function monsterPortrait(def, id, known = true) {
  const painted = PAINTED.portraits[`monster_${id}`];
  if (painted) return painted;
  const key = `${id}:${known ? 1 : 0}`;
  if (cache.has(key)) return cache.get(key);
  const model = createMonsterModel(def, id);
  // 뼈대 모델은 가만히 선 자세로 (모양 조각은 다른 몬스터와 같이 쓰므로 버리지 않는다)
  if (model.animator) { model.animator.play('idle'); model.animator.update(0.4); }
  const g = new THREE.Group();
  g.add(model.body);
  g.rotation.y = -0.45; // 정면에서 살짝 옆으로
  // 몸 크기에 맞춰 카메라 거리를 정한다 (조금 위에서 내려다봄)
  const box = new THREE.Box3().setFromObject(g);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const url = snapshot(g, (camera) => {
    camera.fov = 30;
    camera.updateProjectionMatrix();
    const dist = size / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.02;
    camera.position.set(center.x, center.y + dist * 0.32, center.z + dist);
    camera.lookAt(center);
  }, { silhouette: !known });
  g.traverse((o) => { if (o.isMesh && !o.userData.shared) o.geometry.dispose(); });
  for (const m of [model.mat, ...(model.extraMats ?? [])]) m?.dispose?.();
  cache.set(key, url);
  return url;
}
