import * as THREE from 'three';
import { createMonsterModel } from '../entities/MonsterModel.js';

// 몬스터 도감 사진: 실제 3D 모델을 작은 캔버스에 비스듬히 찍어 그림 주소(dataURL)로 돌려준다.
// 못 만난 몬스터는 검은 그림자(silhouette). 한 번 찍은 사진은 기억해 두고, 렌더러는 하나만 만든다.
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

// def: monsters.json 항목, id: 몬스터 종류, known: 만나 봤는지
export function monsterPortrait(def, id, known = true) {
  const key = `${id}:${known ? 1 : 0}`;
  if (cache.has(key)) return cache.get(key);
  stage ??= setup();
  const { renderer, scene, camera, shadow } = stage;
  const model = createMonsterModel(def, id);
  const g = new THREE.Group();
  g.add(model.body);
  g.rotation.y = -0.45; // 정면에서 살짝 옆으로
  scene.add(g);
  // 몸 크기에 맞춰 카메라 거리를 정한다 (조금 위에서 내려다봄)
  const box = new THREE.Box3().setFromObject(g);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const dist = size / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.02;
  camera.position.set(center.x, center.y + dist * 0.32, center.z + dist);
  camera.lookAt(center);
  scene.overrideMaterial = known ? null : shadow;
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  scene.remove(g);
  g.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
  for (const m of [model.mat, ...(model.extraMats ?? [])]) m?.dispose?.();
  cache.set(key, url);
  return url;
}
