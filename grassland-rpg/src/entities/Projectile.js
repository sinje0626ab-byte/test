import * as THREE from 'three';

const fwd = new THREE.Vector3(0, 0, 1);
const mat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true });

const glow = (color) => new THREE.MeshBasicMaterial({ color });

// 투사체 모양: 화살 · 석궁 볼트 · 총알 · 포탄 · 포자탄 · 얼음탄 · 잎
function createMesh(kind) {
  const g = new THREE.Group();
  if (kind === 'spore') {
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), glow(0xb36fe0)));
  } else if (kind === 'icebolt') {
    const b = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), glow(0xa8e4ff));
    b.scale.z = 1.8;
    g.add(b);
  } else if (kind === 'leaf') {
    const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.28, 5).rotateX(-Math.PI / 2), mat(0x6fbf4a));
    leaf.material.side = THREE.DoubleSide;
    leaf.scale.z = 0.55;
    g.add(leaf);
  } else if (kind === 'ball') {
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), mat(0x2f333b)));
  } else if (kind === 'bullet') {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffe08a }));
    b.scale.z = 2.5;
    g.add(b);
  } else {
    const big = kind === 'bolt';
    const shaft = new THREE.CylinderGeometry(big ? 0.045 : 0.03, big ? 0.045 : 0.03, big ? 0.9 : 0.7, 4).rotateX(Math.PI / 2);
    const tip = new THREE.ConeGeometry(big ? 0.1 : 0.07, 0.18, 4).rotateX(Math.PI / 2).translate(0, 0, big ? 0.52 : 0.42);
    g.add(new THREE.Mesh(shaft, mat(big ? 0x6b4a36 : 0xc9a06a)), new THREE.Mesh(tip, mat(0xdfe6ee)));
  }
  return g;
}

// 화살·총알·포탄. 매번 만들지 않고 풀에서 꺼내 쓰고 돌려놓는다.
export class Projectile {
  constructor(scene, kind) {
    this.kind = kind;
    this.mesh = createMesh(kind);
    this.mesh.visible = false;
    scene.add(this.mesh);
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.active = false;
  }

  // opts: { gravity, splash: { radius, minFactor } }
  fire(from, velocity, damage, life, opts = {}) {
    this.position.copy(from);
    this.velocity.copy(velocity);
    this.damage = damage;
    this.life = life;
    this.gravity = opts.gravity ?? 0;
    this.splash = opts.splash ?? null;
    this.active = true;
    this.mesh.visible = true;
    this.sync();
  }

  step(dt) {
    this.velocity.y -= this.gravity * dt;
    this.position.addScaledVector(this.velocity, dt);
    this.life -= dt;
    this.sync();
  }

  sync() {
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.setFromUnitVectors(fwd, this.velocity.clone().normalize());
  }

  release() {
    this.active = false;
    this.mesh.visible = false;
  }
}

export class ProjectilePool {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
  }

  acquire(kind = 'arrow') {
    let p = this.items.find((x) => !x.active && x.kind === kind);
    if (!p) {
      p = new Projectile(this.scene, kind);
      this.items.push(p);
    }
    return p;
  }

  *active() {
    for (const p of this.items) if (p.active) yield p;
  }
}
