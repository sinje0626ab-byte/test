import * as THREE from 'three';

const shaftGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 4);
shaftGeo.rotateX(Math.PI / 2);
const tipGeo = new THREE.ConeGeometry(0.07, 0.18, 4);
tipGeo.rotateX(Math.PI / 2);
tipGeo.translate(0, 0, 0.42);
const shaftMat = new THREE.MeshStandardMaterial({ color: 0xc9a06a, flatShading: true });
const tipMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, flatShading: true });
const fwd = new THREE.Vector3(0, 0, 1);

// 화살·총알·포탄. 매번 만들지 않고 풀에서 꺼내 쓰고 돌려놓는다.
export class Projectile {
  constructor(scene) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(shaftGeo, shaftMat), new THREE.Mesh(tipGeo, tipMat));
    g.visible = false;
    scene.add(g);
    this.mesh = g;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.active = false;
  }

  fire(from, velocity, damage, life) {
    this.position.copy(from);
    this.velocity.copy(velocity);
    this.damage = damage;
    this.life = life;
    this.active = true;
    this.mesh.visible = true;
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

  acquire() {
    let p = this.items.find((x) => !x.active);
    if (!p) {
      p = new Projectile(this.scene);
      this.items.push(p);
    }
    return p;
  }

  *active() {
    for (const p of this.items) if (p.active) yield p;
  }
}
