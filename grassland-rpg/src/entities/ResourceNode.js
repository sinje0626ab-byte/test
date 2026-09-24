import * as THREE from 'three';

const GLOW = new THREE.Color(0xfff2b0);
const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });

// 채집 노드 모양. alive = 캘 수 있는 모습, stump = 캔 뒤 모습 (그루터기·부서진 바위·새싹)
function buildModel(model, rng) {
  const alive = new THREE.Group();
  const stump = new THREE.Group();
  const add = (g, geo, mat, x, y, z, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };
  const trunk = flat('#9a6a45');
  const stumpTop = flat('#e0c38a');

  switch (model) {
    case 'roundTree': {
      add(alive, new THREE.CylinderGeometry(0.22, 0.3, 1.6, 7), trunk, 0, 0.8, 0);
      add(alive, new THREE.IcosahedronGeometry(1.35, 0), flat('#79c96a'), 0, 2.3, 0, 1, 0.9, 1);
      const apple = flat('#ff6b6b');
      for (let i = 0; i < 4; i++) {
        const a = rng() * Math.PI * 2;
        add(alive, new THREE.SphereGeometry(0.12, 6, 4), apple, Math.cos(a) * 1.05, 2.0 + rng() * 0.6, Math.sin(a) * 1.05);
      }
      add(stump, new THREE.CylinderGeometry(0.28, 0.34, 0.45, 7), trunk, 0, 0.22, 0);
      add(stump, new THREE.CylinderGeometry(0.27, 0.27, 0.02, 7), stumpTop, 0, 0.46, 0);
      break;
    }
    case 'pine': {
      add(alive, new THREE.CylinderGeometry(0.2, 0.3, 1.3, 7), trunk, 0, 0.65, 0);
      const needle = flat('#3f8a55');
      add(alive, new THREE.ConeGeometry(1.25, 1.9, 7), needle, 0, 1.9, 0);
      add(alive, new THREE.ConeGeometry(0.9, 1.5, 7), needle, 0, 2.9, 0);
      add(alive, new THREE.SphereGeometry(0.16, 6, 4), flat('#e9b44f', { emissive: '#6b4a10' }), 0.24, 1.0, 0.2); // 송진 방울
      add(stump, new THREE.CylinderGeometry(0.26, 0.32, 0.4, 7), trunk, 0, 0.2, 0);
      add(stump, new THREE.CylinderGeometry(0.25, 0.25, 0.02, 7), stumpTop, 0, 0.41, 0);
      break;
    }
    case 'rock': {
      add(alive, new THREE.DodecahedronGeometry(0.95, 0), flat('#a9adb6'), 0, 0.55, 0, 1.1, 0.8, 1);
      const ore = flat('#8a7f8f', { metalness: 0.4 });
      for (let i = 0; i < 3; i++) add(alive, new THREE.OctahedronGeometry(0.14, 0), ore, (rng() - 0.5) * 1.1, 0.5 + rng() * 0.5, 0.55 + rng() * 0.2);
      for (let i = 0; i < 3; i++) add(stump, new THREE.DodecahedronGeometry(0.25, 0), flat('#b8bcc4'), (rng() - 0.5) * 0.9, 0.15, (rng() - 0.5) * 0.9);
      break;
    }
    case 'herb': {
      add(alive, new THREE.IcosahedronGeometry(0.55, 0), flat('#6fbf5f'), 0, 0.35, 0, 1.2, 0.7, 1.2);
      const flower = flat('#f4f0ff', { emissive: '#443a55' });
      for (let i = 0; i < 5; i++) add(alive, new THREE.OctahedronGeometry(0.09, 0), flower, (rng() - 0.5) * 0.9, 0.6 + rng() * 0.15, (rng() - 0.5) * 0.9);
      add(stump, new THREE.ConeGeometry(0.1, 0.25, 4), flat('#6fbf5f'), 0, 0.12, 0);
      break;
    }
    case 'fiber': {
      const blade = flat('#9fd46a');
      for (let i = 0; i < 9; i++) {
        const m = add(alive, new THREE.ConeGeometry(0.07, 1.1 + rng() * 0.4, 3), blade, (rng() - 0.5) * 0.6, 0.55, (rng() - 0.5) * 0.6);
        m.rotation.set((rng() - 0.5) * 0.5, rng() * 3, (rng() - 0.5) * 0.5);
      }
      add(stump, new THREE.ConeGeometry(0.08, 0.2, 3), blade, 0, 0.1, 0);
      break;
    }
    case 'cactus': {
      const green = flat('#5fa85a');
      add(alive, new THREE.CylinderGeometry(0.36, 0.42, 2.6, 8), green, 0, 1.3, 0);
      add(alive, new THREE.CylinderGeometry(0.2, 0.2, 0.9, 6), green, 0.55, 1.5, 0);
      add(alive, new THREE.CylinderGeometry(0.2, 0.2, 0.7, 6), green, -0.55, 1.2, 0);
      add(alive, new THREE.OctahedronGeometry(0.2, 0), flat('#ff8fb1'), 0, 2.7, 0);
      add(stump, new THREE.CylinderGeometry(0.36, 0.42, 0.35, 8), green, 0, 0.17, 0);
      break;
    }
    case 'sandstone': {
      const c = ['#e0a86a', '#d99a5c', '#ebb982'];
      for (let i = 0; i < 3; i++) add(alive, new THREE.BoxGeometry(1.5 - i * 0.3, 0.45, 1.3 - i * 0.25), flat(c[i]), (rng() - 0.5) * 0.2, 0.22 + i * 0.45, 0);
      add(alive, new THREE.OctahedronGeometry(0.16, 0), flat('#ffd23f', { emissive: '#8a6a10' }), 0.4, 1.35, 0.2);
      add(stump, new THREE.BoxGeometry(1.2, 0.3, 1.0), flat('#d99a5c'), 0, 0.15, 0);
      break;
    }
    case 'ice': {
      const ice = flat('#9fd8ff', { transparent: true, opacity: 0.85, roughness: 0.2, emissive: '#1b3a55' });
      add(alive, new THREE.CylinderGeometry(0.35, 0.5, 2.4, 6), ice, 0, 1.2, 0);
      add(alive, new THREE.CylinderGeometry(0.2, 0.3, 1.5, 6), ice, 0.5, 0.75, 0.2).rotation.z = -0.3;
      add(alive, new THREE.OctahedronGeometry(0.18, 0), flat('#e6fbff', { emissive: '#4a7a9a' }), 0, 2.55, 0);
      add(stump, new THREE.CylinderGeometry(0.4, 0.5, 0.35, 6), ice, 0, 0.17, 0);
      break;
    }
  }
  return { alive, stump };
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

    const { alive, stump } = buildModel(def.model, rng);
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.group.rotation.y = rng() * Math.PI * 2;
    this.group.add(alive, stump);
    this.aliveMesh = alive;
    this.stumpMesh = stump;
    this.mats = [];
    alive.traverse((o) => { if (o.isMesh) this.mats.push(o.material); });
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
