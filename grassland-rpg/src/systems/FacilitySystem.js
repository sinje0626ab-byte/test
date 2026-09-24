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
    bus.on('save:collect', (save) => {
      save.facilities = this.list.map((f) => ({ type: f.type, baseId: f.baseId, position: [f.position.x, f.position.z], hp: f.stats.hp }));
    });
    bus.on('save:apply', (save) => {
      for (const f of save.facilities ?? []) {
        if (ctx.data.buildings.buildings[f.type]) this.add(f.type, f.baseId, new THREE.Vector3(f.position[0], 0, f.position[1]), { hp: f.hp });
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

  update(dt) {
    for (const f of this.list) f.update(dt);
  }
}
