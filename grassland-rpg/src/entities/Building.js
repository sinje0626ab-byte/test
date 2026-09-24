import * as THREE from 'three';
import { HpBar } from './HpBar.js';
import { createBaseModel } from './BaseModels.js';
import { structureHp, setMaxHp } from '../utils/build.js';

// 기지 중심 건물 (텐트 → 움막 → 집 → 요새). 기지 영역 둘레를 땅에 표시하고, 밤엔 등불이 켜진다.
export class Building {
  constructor(ctx, base, levelDef, hp) {
    this.ctx = ctx;
    this.kind = 'tent';
    this.base = base;
    this.baseId = base.id;
    this.position = base.position.clone();
    this.flash = 0;
    this.hpTimer = 0;

    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    this.light = new THREE.PointLight(0xffc877, 0, 14, 1.6);
    this.mesh.add(this.light);
    this.hpBar = new HpBar(1.6, 0x7cc67a);
    this.mesh.add(this.hpBar.group);
    ctx.scene.add(this.mesh);

    this.stats = { maxHp: levelDef.hp, hp: hp ?? levelDef.hp };
    this.alive = this.stats.hp > 0;
    this.setLevel(levelDef);
  }

  // 단계가 바뀌면 모양·영역 표시·체력을 새로 맞춘다. 체력 비율은 유지.
  setLevel(levelDef) {
    const ratio = this.stats.hp / this.stats.maxHp;
    this.levelDef = levelDef;
    this.stats.maxHp = structureHp(levelDef.hp, this.ctx.player.stats);
    this.stats.hp = Math.round(this.stats.maxHp * ratio);
    this.radius = levelDef.radius;

    if (this.model) this.mesh.remove(this.model.group);
    if (this.ring) this.mesh.remove(this.ring);
    this.model = createBaseModel(levelDef.model);
    this.mesh.add(this.model.group);

    const lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), new THREE.MeshBasicMaterial({ color: 0xffd98a }));
    lamp.position.set(...this.model.lantern);
    this.model.group.add(lamp);
    this.lanternMesh = lamp;
    this.light.position.set(this.model.lantern[0], this.model.lantern[1] + 0.5, this.model.lantern[2] + 0.2);
    this.hpBar.group.position.y = levelDef.model === 'tent' ? 3.4 : 4.2;

    const ringGeo = new THREE.RingGeometry(levelDef.areaRadius - 0.12, levelDef.areaRadius, 96, 1);
    ringGeo.rotateX(-Math.PI / 2);
    this.ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }));
    this.ring.position.y = 0.04;
    this.mesh.add(this.ring);
  }

  // 석공 스킬이 바뀌면 (BaseSystem)
  refreshMaxHp() {
    setMaxHp(this, structureHp(this.levelDef.hp, this.ctx.player.stats));
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
    this.model.flag.rotation.y = Math.sin(this.ctx.time.elapsed * 3) * 0.3;
    this.model.group.rotation.z = this.alive ? 0 : 0.12; // 무너진 건물은 기울어진다
    const e = this.flash > 0 ? 0.6 : 0;
    for (const m of this.model.mats) m.emissive.setRGB(e, e * 0.3, e * 0.3);
    this.ring.material.opacity = this.ctx.mode === 'build' ? 0.7 : 0.3;
    const s = this.stats;
    this.hpBar.update(s.hp / s.maxHp, this.ctx.camera, this.hpTimer > 0 || s.hp < s.maxHp);
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
  }
}
