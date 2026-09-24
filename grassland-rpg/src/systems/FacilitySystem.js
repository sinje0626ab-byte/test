import * as THREE from 'three';
import { Facility } from '../entities/Facility.js';

// 부속 건물 설치·목록·아침 수리
export class FacilitySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.list = [];
    const { bus } = ctx;

    bus.on('build:place', (e) => {
      if (e.kind !== 'facility') return;
      this.add(e.type, e.baseId, e.position);
      bus.emit('notify', { text: `${ctx.data.buildings.buildings[e.type].name} 완성!`, kind: 'item' });
    });
    bus.on('time:day', () => {
      for (const f of this.list) f.repairFull();
    });
    bus.on('stats:changed', () => { for (const f of this.list) f.refreshMaxHp(); }); // 석공 스킬
    bus.on('garden:plant', (e) => this.plant(e));
    bus.on('garden:harvest', ({ facility }) => this.harvest(facility));
    bus.on('interact:facility', ({ facility }) => {
      if (facility.type === 'campfire') bus.emit('notify', { text: '따뜻하다… 불 곁에 있으면 HP가 빨리 차요', kind: 'item' });
    });
    this.aura = 0;
    bus.on('save:collect', (save) => {
      save.facilities = this.list.map((f) => ({ type: f.type, baseId: f.baseId, position: [f.position.x, f.position.z], hp: f.stats.hp, crop: f.crop ?? undefined }));
    });
    bus.on('save:apply', (save) => {
      for (const f of save.facilities ?? []) {
        if (ctx.data.buildings.buildings[f.type]) this.add(f.type, f.baseId, new THREE.Vector3(f.position[0], 0, f.position[1]), { hp: f.hp, crop: f.crop });
      }
    });
  }

  add(type, baseId, position, opts) {
    const f = new Facility(this.ctx, type, baseId, position, opts);
    this.list.push(f);
    this.ctx.structures.push(f);
    this.ctx.bus.emit('facility:changed', { facility: f });
    return f;
  }

  // 텃밭: 씨앗 하나를 심는다
  plant({ facility, seed }) {
    const { bus } = this.ctx;
    if (facility.crop || !facility.alive) return;
    const spend = { items: [{ id: seed, count: 1 }], ok: false };
    bus.emit('inventory:spend', spend);
    if (!spend.ok) return;
    facility.crop = { seed, day: this.ctx.time.day };
    const c = this.ctx.data.config.garden.crops[seed];
    bus.emit('notify', { text: `${c.name}을(를) 심었어요. ${c.days}일 뒤 아침에 거둘 수 있어요`, kind: 'item' });
    bus.emit('garden:changed', { facility });
  }

  harvest(f) {
    const { bus, data } = this.ctx;
    if (f.growth() !== 1) return;
    const c = data.config.garden.crops[f.crop.seed];
    const count = c.min + Math.floor(Math.random() * (c.max - c.min + 1));
    bus.emit('loot:spawn', { item: c.item, count, position: f.position.clone() });
    bus.emit('gather:done', { position: f.position.clone().setY(0.5), color: c.color, xp: data.config.garden.xp });
    f.crop = null;
    bus.emit('garden:changed', { facility: f });
  }

  update(dt) {
    for (const f of this.list) f.update(dt);
    // 모닥불 둘레: HP 재생 보너스
    const p = this.ctx.player;
    let aura = 0;
    for (const f of this.list) {
      const a = f.def.aura;
      if (a && f.alive && f.position.distanceTo(p.position) <= a.radius) aura = Math.max(aura, a.hpRegen);
    }
    if (aura !== this.aura) {
      this.aura = aura;
      this.ctx.bus.emit('player:aura', { hpRegen: aura });
    }
  }
}
