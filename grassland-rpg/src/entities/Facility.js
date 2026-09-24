import * as THREE from 'three';
import { structureHp, setMaxHp } from '../utils/build.js';
import { HpBar } from './HpBar.js';
import { createFacilityModel } from './FacilityModels.js';

// 부속 건물 (작업대·창고·상점·모닥불·텃밭·대장간·게시판). 습격에 부서지면 아침까지 못 쓴다.
export class Facility {
  constructor(ctx, type, baseId, position, { hp, crop } = {}) {
    this.ctx = ctx;
    this.kind = 'facility';
    this.type = type;
    this.def = ctx.data.buildings.buildings[type];
    this.baseId = baseId;
    this.position = position.clone();
    this.radius = this.def.radius;
    const max = structureHp(this.def.hp, ctx.player.stats);
    this.stats = { maxHp: max, hp: hp ?? max }; // 넘치면 석공 스킬 반영 때 맞춘다
    this.alive = this.stats.hp > 0;
    this.flash = 0;
    this.hpTimer = 0;

    this.crop = crop ?? null; // 텃밭: { seed, day }
    const { group, parts, flame } = createFacilityModel(this.def.model);
    this.flame = flame;
    // 모닥불: 밤에 주변을 밝히는 불빛
    if (this.def.light) {
      const l = this.def.light;
      this.light = new THREE.PointLight(l.color, 0, l.distance, 1.6);
      this.light.position.y = 1;
      group.add(this.light);
    }
    if (this.def.model === 'garden') {
      this.cropGroup = new THREE.Group();
      this.sprouts = [];
      for (let i = 0; i < 6; i++) {
        const sp = new THREE.Group();
        sp.add(new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 4), new THREE.MeshStandardMaterial({ color: 0x6fbf5f, flatShading: true })));
        const fruit = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true }));
        fruit.position.y = 0.25;
        sp.add(fruit);
        sp.position.set(-0.6 + (i % 3) * 0.6, 0.25, i < 3 ? -0.25 : 0.25);
        this.cropGroup.add(sp);
        this.sprouts.push({ sp, fruit });
      }
      group.add(this.cropGroup);
    }
    this.mats = parts.map((p) => p.material);
    this.baseColors = this.mats.map((m) => m.color.clone());
    this.hpBar = new HpBar(1.2, 0x7cc67a);
    this.hpBar.group.position.y = 2.8;
    group.add(this.hpBar.group);
    group.position.copy(this.position);
    this.mesh = group;
    ctx.scene.add(group);
    this.applyLook();
  }

  get displayName() {
    return this.def.name;
  }

  applyLook() {
    this.mesh.rotation.z = this.alive ? 0 : 0.15;
    this.mats.forEach((m, i) => m.color.copy(this.baseColors[i]).multiplyScalar(this.alive ? 1 : 0.55));
  }

  // 석공 스킬이 바뀌면 (FacilitySystem)
  refreshMaxHp() {
    setMaxHp(this, structureHp(this.def.hp, this.ctx.player.stats));
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.stats.hp = Math.max(0, this.stats.hp - amount);
    this.flash = 0.12;
    this.hpTimer = 4;
    if (this.stats.hp <= 0) {
      this.alive = false;
      this.applyLook();
      return true;
    }
    return false;
  }

  repairFull() {
    this.stats.hp = this.stats.maxHp;
    this.alive = true;
    this.applyLook();
  }

  // 텃밭 작물 자람 정도 (0~1), 없으면 null
  growth() {
    if (!this.crop) return null;
    const c = this.ctx.data.config.garden.crops[this.crop.seed];
    return Math.min(1, (this.ctx.time.day - this.crop.day) / c.days);
  }

  animateExtras(dt) {
    if (this.flame) {
      this.flame.visible = this.alive;
      this.flame.scale.set(1, 0.85 + Math.sin(performance.now() * 0.012) * 0.15, 1);
    }
    if (this.light) this.light.intensity = this.alive ? this.def.light.intensity * (1 - this.ctx.time.daylight) : 0;
    if (this.cropGroup) {
      const g = this.growth();
      this.cropGroup.visible = g != null;
      if (g == null) return;
      const c = this.ctx.data.config.garden.crops[this.crop.seed];
      for (const { sp, fruit } of this.sprouts) {
        sp.scale.setScalar(0.4 + 0.6 * g);
        fruit.visible = g >= 1;
        fruit.material.color.set(c.color);
      }
    }
  }

  update(dt) {
    this.animateExtras(dt);
    this.flash = Math.max(0, this.flash - dt);
    this.hpTimer = Math.max(0, this.hpTimer - dt);
    const e = this.flash > 0 ? 0.6 : 0;
    for (const m of this.mats) m.emissive.setRGB(e, e * 0.3, e * 0.3);
    const s = this.stats;
    this.hpBar.update(s.hp / s.maxHp, this.ctx.camera, this.alive && (this.hpTimer > 0 || s.hp < s.maxHp));
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
  }
}
