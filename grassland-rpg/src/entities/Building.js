import * as THREE from 'three';
import { HpBar } from './HpBar.js';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 });

// 기지 중심 텐트. 기지 영역 둘레를 땅에 표시하고, 밤엔 등불이 켜진다.
export class Building {
  constructor(ctx, base, levelDef, hp) {
    this.ctx = ctx;
    this.kind = 'tent';
    this.base = base;
    this.baseId = base.id;
    this.position = base.position.clone();
    this.radius = levelDef.radius;
    this.stats = { maxHp: levelDef.hp, hp: hp ?? levelDef.hp };
    this.alive = this.stats.hp > 0;
    this.flash = 0;
    this.hpTimer = 0;
    this.build(levelDef);
  }

  build(levelDef) {
    const g = new THREE.Group();
    const tent = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 4), flat('#f4d8a8'));
    tent.position.y = 1.1;
    tent.rotation.y = Math.PI / 4;
    const stripe = new THREE.Mesh(new THREE.ConeGeometry(1.62, 0.5, 4, 1, true), flat('#e9835b'));
    stripe.position.y = 0.45;
    stripe.rotation.y = Math.PI / 4;
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), flat('#6b4a36'));
    door.position.set(0, 0.55, 1.14);
    door.rotation.x = -0.2;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 5), flat('#8a6440'));
    pole.position.y = 2.5;
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), flat('#ff7b7b'));
    flag.position.set(0.26, 2.8, 0);
    flag.material.side = THREE.DoubleSide;
    this.flag = flag;
    const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), new THREE.MeshBasicMaterial({ color: 0xffd98a }));
    lantern.position.set(0.9, 1.1, 1.25);
    this.lanternMesh = lantern;
    this.mats = [tent.material, stripe.material];
    for (const m of [tent, stripe, door, pole]) { m.castShadow = true; m.receiveShadow = true; }
    g.add(tent, stripe, door, pole, flag, lantern);

    this.light = new THREE.PointLight(0xffc877, 0, 14, 1.6);
    this.light.position.set(0.9, 1.6, 1.4);
    g.add(this.light);

    // 기지 영역 둘레 (점선 느낌의 얇은 고리)
    const ringGeo = new THREE.RingGeometry(levelDef.areaRadius - 0.12, levelDef.areaRadius, 96, 1);
    ringGeo.rotateX(-Math.PI / 2);
    this.ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }));
    this.ring.position.y = 0.04;
    g.add(this.ring);

    this.hpBar = new HpBar(1.6, 0x7cc67a);
    this.hpBar.group.position.y = 3.4;
    g.add(this.hpBar.group);

    g.position.copy(this.position);
    this.mesh = g;
    this.ctx.scene.add(g);
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.stats.hp = Math.max(0, this.stats.hp - amount);
    this.flash = 0.12;
    this.hpTimer = 5;
    if (this.stats.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  repairFull() {
    this.stats.hp = this.stats.maxHp;
    this.alive = true;
  }

  update(dt) {
    this.flash = Math.max(0, this.flash - dt);
    this.hpTimer = Math.max(0, this.hpTimer - dt);
    const night = 1 - this.ctx.time.daylight;
    this.light.intensity = night * 9;
    this.lanternMesh.visible = night > 0.1;
    this.flag.rotation.y = Math.sin(this.ctx.time.elapsed * 3) * 0.3;
    this.mesh.rotation.z = this.alive ? 0 : 0.12; // 무너진 텐트는 기울어진다
    const e = this.flash > 0 ? 0.6 : 0;
    for (const m of this.mats) m.emissive.setRGB(e, e * 0.3, e * 0.3);
    this.ring.material.opacity = this.ctx.mode === 'build' ? 0.7 : 0.3;
    const s = this.stats;
    this.hpBar.update(s.hp / s.maxHp, this.ctx.camera, this.hpTimer > 0 || s.hp < s.maxHp);
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
  }
}
