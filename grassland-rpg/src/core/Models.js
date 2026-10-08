import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import defs from '../data/models.json';

// 3D 모델(.glb, src/models — tools/model-import.mjs 로 만든다).
// 게임 시작 전에 loadModels() 로 모두 읽어 두고, createModel(id) 로 복제해 쓴다 (뼈대·동작 포함).
// 키는 models.json 의 height 에 맞추고 발바닥을 y=0 에 둔다. 앞은 +Z.
const URLS = import.meta.glob('../models/*.glb', { query: '?url', import: 'default', eager: true });
const cache = new Map(); // id → { scene, clips }

export async function loadModels() {
  const loader = new GLTFLoader();
  await Promise.all(Object.entries(URLS).map(async ([file, url]) => {
    const id = file.split('/').pop().replace('.glb', '');
    const def = defs.models[id];
    if (!def) return;
    try {
      let gltf = await loader.loadAsync(url);
      if (missingTexture(gltf.scene)) gltf = await loader.loadAsync(url); // 그림을 가끔 못 읽으면 한 번 더
      cache.set(id, { scene: normalize(gltf.scene, def.height), clips: gltf.animations });
    } catch (e) {
      console.warn(`[models] ${id} 를 읽지 못했습니다`, e);
    }
  }));
}

function missingTexture(scene) {
  let bad = false;
  scene.traverse((o) => { if (o.isMesh && o.material.map && !o.material.map.image) bad = true; });
  return bad;
}

export const hasModel = (id) => !!id && cache.has(id);

// 키를 맞추고 발을 땅에 붙인 껍데기 그룹으로 감싼다
function normalize(scene, height) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);
  const k = height / Math.max(0.001, box.max.y - box.min.y);
  const holder = new THREE.Group();
  scene.scale.multiplyScalar(k);
  scene.position.y -= box.min.y * k;
  holder.add(scene);
  scene.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.frustumCulled = false; // 동작 중에 경계가 바뀌어 화면 가장자리에서 깜빡이지 않게 (수가 적다)
  });
  return holder;
}

// 복제본: 재질도 복제해 몬스터마다 번쩍임·투명도를 따로 쓴다. mats[0] 이 몸(가장 넓은 재질)
export function createModel(id) {
  const src = cache.get(id);
  const object = cloneSkinned(src.scene);
  const mats = new Map();
  object.traverse((o) => {
    if (!o.isMesh) return;
    o.userData.shared = true; // 모양 조각은 복제본끼리 같이 쓴다 → 버리지 말 것
    const own = o.material;
    if (!mats.has(own)) {
      const m = own.clone();
      m.transparent = true; // 사라짐 연출용 (외곽선은 투명도 1이면 그대로 그린다)
      mats.set(own, m);
    }
    o.material = mats.get(own);
  });
  return { object, mats: [...mats.values()], animator: new Animator(object, src.clips) };
}

// 동작 재생기: 이름으로 바꿔 틀고(부드럽게 섞기), 한 번만 틀 수도 있다
export class Animator {
  constructor(root, clips) {
    this.mixer = new THREE.AnimationMixer(root);
    this.actions = {};
    for (const c of clips) this.actions[c.name] = this.mixer.clipAction(c);
    this.current = null;
    this.name = '';
  }

  has(name) {
    return !!this.actions[name];
  }

  duration(name) {
    return this.actions[name]?.getClip().duration ?? 0;
  }

  // once: 한 번만 (끝 자세로 멈춤). restart: 같은 동작이어도 처음부터
  play(name, { fade = 0.15, once = false, speed = 1, restart = false } = {}) {
    const a = this.actions[name];
    if (!a) return false;
    a.timeScale = speed;
    if (this.name === name && !restart) return true;
    a.reset();
    a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    a.clampWhenFinished = once;
    a.play();
    if (this.current && this.current !== a) this.current.crossFadeTo(a, fade, false);
    this.current = a;
    this.name = name;
    return true;
  }

  update(dt) {
    this.mixer.update(dt);
  }
}
