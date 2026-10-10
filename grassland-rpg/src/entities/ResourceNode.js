import * as THREE from 'three';
import { PAL, baked, meshes, patch, rock } from './structureKit.js';
import { trunk, crown, blade, bloom, pineTiers, ico } from '../world/decorProps.js';


const GLOW = new THREE.Color(0xfff2b0);

// 채집 노드 모양 (시안 docs/art/incoming/concept_nodes.webp). 장식보다 살짝 크고 작은 풀밭(사막 모래·설원 눈) 위.
// alive = 캘 수 있는 모습, stump = 캔 뒤 모습. 모양은 종류마다 한 번 만들어 같이 쓴다(baked)
const GROUND = { cactus: 'sand', sandstone: 'sand', ice: 'snowGround' };
function base(k, model, r) {
  const g = GROUND[model];
  if (g) k.add(new THREE.CylinderGeometry(r, r * 1.04, 0.06, 12), g, [0, 0.02, 0]);
  else patch(k, r, { seed: model.length * 7, flowers: 3, bushes: 0, rocks: 1 });
}
const ALIVE = {
  roundTree(k) {
    trunk(k, 1.6, 0.32, 0.22);
    crown(k, 2.3, 1.1, 'leafDeep', 'leafMid', 'leafTop');
    for (const [a, y] of [[0.3, 2.0], [1.9, 2.5], [3.3, 2.1], [4.6, 2.7], [5.6, 1.9]]) {
      k.ball(0.15, 'apple', [Math.cos(a) * 1.3, y, Math.sin(a) * 1.3], 1, 1);
      k.cyl(0.015, 0.015, 0.08, 3, 'barkDark', [Math.cos(a) * 1.3, y + 0.16, Math.sin(a) * 1.3]);
    }
  },
  pine(k) {
    pineTiers(k, false);
    for (const [x, y, z, s] of [[0.95, 0.4, 0.4, 1.1], [0.62, 1.15, 0.55, 1], [0.4, 1.8, 0.45, 0.8], [-0.8, 0.55, 0.6, 0.9]]) k.add(new THREE.SphereGeometry(0.1 * s, 6, 4), 'resin', [x, y, z], [0, 0, 0], [1, 1.5, 1]);
  },
  rock(k) {
    k.add(new THREE.DodecahedronGeometry(0.8, 0), 'stone', [0, 0.6, 0], [0.2, 0.4, 0], [1, 1.05, 0.95]);
    k.add(new THREE.DodecahedronGeometry(0.45, 0), 'stoneDark', [0.6, 0.3, 0.35], [0.5, 1, 0]);
    k.add(new THREE.DodecahedronGeometry(0.35, 0), 'stoneLight', [-0.55, 0.25, 0.4], [1, 0.2, 0]);
    for (const [x, y, z, s] of [[0.2, 0.75, 0.62, 1], [-0.35, 1.0, 0.45, 0.8], [0.5, 0.45, 0.62, 0.7], [0.0, 1.2, 0.1, 0.7], [-0.6, 0.55, 0.15, 0.6]]) k.add(new THREE.OctahedronGeometry(0.15 * s, 0), 'ore', [x, y, z], [0.3, x * 4, 0.2], [1, 1.3, 1]);
  },
  herb(k) {
    ico(k, 0.45, 'leafMid', [0, 0.4, 0], [1.3, 0.9, 1.2]);
    ico(k, 0.32, 'leafDeep', [0.45, 0.28, 0.1], [1, 0.9, 1]);
    ico(k, 0.3, 'leafTop', [-0.4, 0.3, -0.1], [1, 0.9, 1]);
    for (let i = 0; i < 6; i++) bloom(k, Math.cos(i * 1.05) * 0.42, 0.62 + (i % 2) * 0.1, Math.sin(i * 1.05) * 0.38, 'petal', 1.7);
  },
  fiber(k) {
    for (let i = 0; i < 11; i++) {
      const a = i * 2.4;
      blade(k, Math.cos(a) * 0.18, Math.sin(a) * 0.18, 0.9 + (i % 4) * 0.18, i % 2 ? 'leafMid' : 'leafTop', 0.3, a);
    }
    for (const a of [0.5, 2.8, 4.6]) {
      k.cyl(0.012, 0.012, 1.2, 3, 'leafTop', [Math.cos(a) * 0.08, 0.6, Math.sin(a) * 0.08]);
      k.add(new THREE.SphereGeometry(0.05, 5, 3), 'wheat', [Math.cos(a) * 0.08, 1.28, Math.sin(a) * 0.08], [0, 0, 0], [1, 3, 1]);
    }
  },
  cactus(k) {
    k.cyl(0.36, 0.4, 2.0, 10, 'cactus', [0, 1.0, 0]);
    k.ball(0.36, 'cactus', [0, 2.0, 0], [1, 0.7, 1], 1);
    for (const [s, y, h] of [[1, 1.2, 0.8], [-1, 0.9, 0.6]]) {
      k.cyl(0.15, 0.15, 0.4, 7, 'cactusLight', [s * 0.48, y, 0], [0, 0, Math.PI / 2]);
      k.cyl(0.15, 0.15, h, 7, 'cactusLight', [s * 0.62, y + h / 2, 0]);
      k.ball(0.15, 'cactusLight', [s * 0.62, y + h, 0], [1, 0.7, 1], 1);
      bloom(k, s * 0.62, y + h + 0.1, 0, 'petalPink', 1.6);
    }
    bloom(k, 0, 2.28, 0, 'petalPink', 2);
    for (let i = 0; i < 10; i++) { const a = i * 2.2; k.cone(0.02, 0.08, 3, 'spine', [Math.cos(a) * 0.4, 0.4 + (i % 5) * 0.32, Math.sin(a) * 0.4], [0, 0, Math.PI / 2]); }
    rock(k, 0.5, 0.45, 0.16, 'stone');
  },
  sandstone(k) {
    const cols = ['sandstoneDark', 'sandstone', 'sandstoneLight', 'sandstone', 'sandstoneLight'];
    for (let i = 0; i < 5; i++) k.box(1.4 - i * 0.18, 0.32, 1.2 - i * 0.14, cols[i], [(i % 2) * 0.06, 0.16 + i * 0.31, (i % 2) * -0.05], [0, i * 0.12, 0]);
    for (const [x, y, z, s, r] of [[0.45, 1.5, 0.3, 1, -0.3], [0.2, 1.55, 0.45, 0.7, 0.2], [-0.5, 0.45, 0.55, 0.8, 0.3]]) k.add(new THREE.OctahedronGeometry(0.17 * s, 0), 'sunCrystal', [x, y, z], [0, 0, r], [1, 2, 1]);
  },
  ice(k) {
    k.add(new THREE.CylinderGeometry(0.32, 0.45, 2.4, 6), 'ice', [0, 1.2, 0]);
    k.add(new THREE.ConeGeometry(0.32, 0.5, 6), 'ice', [0, 2.65, 0]);
    for (const [x, z, h, r] of [[0.5, 0.2, 1.5, -0.25], [-0.45, 0.25, 1.2, 0.3], [0.1, -0.5, 1.0, 0.2]]) {
      k.add(new THREE.CylinderGeometry(0.16, 0.24, h, 6), 'iceLight', [x, h / 2, z], [r * Math.sign(z), 0, r]);
    }
    ico(k, 0.35, 'snow', [0, 2.35, 0], [1, 0.3, 1]);
    for (let i = 0; i < 5; i++) { const a = i * 1.3; ico(k, 0.2, 'snow', [Math.cos(a) * 0.65, 0.05, Math.sin(a) * 0.65], [1.4, 0.4, 1]); }
  },
};
const STUMP = {
  roundTree(k) { stump(k, 0.36); k.cone(0.03, 0.15, 3, 'leafTop', [0.12, 0.6, 0.05]); },
  pine(k) { stump(k, 0.32); k.add(new THREE.SphereGeometry(0.07, 6, 4), 'resin', [0.25, 0.25, 0.18], [0, 0, 0], [1, 1.5, 1]); },
  rock(k) { for (const [x, z, s, n] of [[0, 0, 0.3, 'stone'], [0.35, 0.2, 0.22, 'stoneDark'], [-0.3, 0.25, 0.2, 'stoneLight']]) k.add(new THREE.DodecahedronGeometry(s, 0), n, [x, s * 0.6, z], [x * 3, z * 3, 0]); k.add(new THREE.OctahedronGeometry(0.1, 0), 'ore', [0.1, 0.45, 0.15]); },
  herb(k) { for (let i = 0; i < 3; i++) { const a = i * 2.1; k.cyl(0.015, 0.015, 0.2, 3, 'leafMid', [Math.cos(a) * 0.15, 0.1, Math.sin(a) * 0.15]); ico(k, 0.07, 'leafTop', [Math.cos(a) * 0.15, 0.22, Math.sin(a) * 0.15], [1.4, 0.5, 0.8], 0); } },
  fiber(k) { for (let i = 0; i < 7; i++) { const a = i * 0.9; k.cyl(0.03, 0.03, 0.14, 3, 'leafMid', [Math.cos(a) * 0.15, 0.07, Math.sin(a) * 0.15]); } },
  cactus(k) { k.cyl(0.36, 0.4, 0.45, 10, 'cactus', [0, 0.22, 0]); k.cyl(0.33, 0.33, 0.02, 10, 'cactusLight', [0, 0.46, 0]); },
  sandstone(k) { k.box(1.0, 0.3, 0.9, 'sandstoneDark', [0, 0.15, 0]); for (const [x, z] of [[0.6, 0.3], [-0.5, 0.45]]) k.box(0.3, 0.2, 0.3, 'sandstone', [x, 0.1, z], [0, x, 0]); k.add(new THREE.OctahedronGeometry(0.1, 0), 'sunCrystal', [0.2, 0.4, 0.2], [0, 0, 0], [1, 2, 1]); },
  ice(k) { for (const [x, z, h] of [[0, 0, 0.5], [0.35, 0.2, 0.35], [-0.3, 0.2, 0.3]]) k.add(new THREE.CylinderGeometry(0.2, 0.28, h, 6), 'ice', [x, h / 2, z]); },
};
function stump(k, r) {
  k.cyl(r, r * 1.15, 0.45, 9, 'bark', [0, 0.22, 0]);
  k.cyl(r * 0.95, r * 0.95, 0.02, 9, 'logEnd', [0, 0.46, 0]);
  k.add(new THREE.TorusGeometry(r * 0.5, 0.015, 3, 10), 'woodDark', [0, 0.47, 0], [Math.PI / 2, 0, 0]);
}
Object.assign(PAL, {
  resin: { color: '#f2b234', emissive: '#7a4d08', emissiveIntensity: 0.5, roughness: 0.3 },
  ore: { color: '#d97a3a', roughness: 0.5 },
  wheat: { color: '#e3c770' },
  spine: { color: '#f3e7c2' },
  sunCrystal: { color: '#ffd23f', emissive: '#a07010', emissiveIntensity: 0.5, roughness: 0.25 },
});
const SIZE = { roundTree: 1.3, pine: 1.35, rock: 1.25, herb: 0.85, fiber: 0.75, cactus: 1.0, sandstone: 1.15, ice: 1.05 };

function buildModel(model) {
  const alive = new THREE.Group();
  const stumpG = new THREE.Group();
  const ground = new THREE.Group();
  meshes(baked(`node:${model}:ground`, (k) => base(k, model, SIZE[model] ?? 1)), ground);
  meshes(baked(`node:${model}:alive`, (k) => ALIVE[model]?.(k)), alive);
  meshes(baked(`node:${model}:stump`, (k) => STUMP[model]?.(k)), stumpG);
  return { alive, stump: stumpG, ground };
}

// 캘 수 있는 나무·바위·풀 하나
export class ResourceNode {
  constructor(scene, id, type, def, position, rng) {
    this.id = id;
    this.type = type;
    this.def = def;
    this.position = position;
    this.radius = def.radius;
    this.hp = def.hp;
    this.alive = true;
    this.depletedDay = null;
    this.wobble = 0;
    this.sparkle = 0;

    const { alive, stump, ground } = buildModel(def.model);
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.group.rotation.y = rng() * Math.PI * 2;
    this.group.add(ground, alive, stump); // 받침(풀밭)은 흔들리지 않고 캔 뒤에도 남는다
    this.aliveMesh = alive;
    this.stumpMesh = stump;
    this.mats = [];
    alive.traverse((o) => { if (o.isMesh && o.material.emissive) this.mats.push(o.material); });
    this.baseEmissive = this.mats.map((m) => m.emissive.clone());
    scene.add(this.group);
    this.applyLook();
  }

  applyLook() {
    this.aliveMesh.visible = this.alive;
    this.stumpMesh.visible = !this.alive;
  }

  hit(damage) {
    if (!this.alive) return false;
    this.hp -= damage;
    this.wobble = 1;
    if (this.hp > 0) return false;
    this.alive = false;
    this.applyLook();
    return true;
  }

  restore() {
    this.alive = true;
    this.hp = this.def.hp;
    this.depletedDay = null;
    this.applyLook();
  }

  // near: 플레이어가 가까우면 반짝임
  update(dt, near, time) {
    // 가만히 있고 반짝이지도 않으면 할 일 없음
    if (!this.wobble && !near && this.sparkle < 0.001) return;
    this.wobble = Math.max(0, this.wobble - dt * 4);
    const w = Math.sin(time * 40) * this.wobble * 0.08;
    this.aliveMesh.rotation.z = w;
    this.aliveMesh.rotation.x = w * 0.6;
    const target = near && this.alive ? 1 : 0;
    this.sparkle += (target - this.sparkle) * Math.min(1, dt * 6);
    const glow = this.sparkle * (0.18 + Math.sin(time * 5) * 0.12);
    this.mats.forEach((m, i) => {
      m.emissive.copy(this.baseEmissive[i]).lerp(GLOW, glow);
    });
  }
}
