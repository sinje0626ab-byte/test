import { HpBar } from './HpBar.js';
import { createFacilityModel } from './FacilityModels.js';

// 부속 건물 (작업대·창고·상점). 습격에 부서지면 아침까지 못 쓴다.
export class Facility {
  constructor(ctx, type, baseId, position, { hp } = {}) {
    this.ctx = ctx;
    this.kind = 'facility';
    this.type = type;
    this.def = ctx.data.buildings.buildings[type];
    this.baseId = baseId;
    this.position = position.clone();
    this.radius = this.def.radius;
    this.stats = { maxHp: this.def.hp, hp: Math.min(this.def.hp, hp ?? this.def.hp) };
    this.alive = this.stats.hp > 0;
    this.flash = 0;
    this.hpTimer = 0;

    const { group, parts } = createFacilityModel(this.def.model);
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

  update(dt) {
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
