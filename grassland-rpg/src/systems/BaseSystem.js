import * as THREE from 'three';
import { Building } from '../entities/Building.js';

// 기지 목록(ctx.bases)과 기지 중심 텐트. 빠른 이동·기지 레벨업은 이후 Phase.
export class BaseSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.nextId = 1;
    ctx.bases = [];
    ctx.structures = [];
    const { bus } = ctx;

    bus.on('build:place', (e) => {
      if (e.kind !== 'tent') return;
      const base = this.createBase({ position: e.position, level: 1 });
      if (e.item) bus.emit('inventory:consume', { item: e.item, count: 1 });
      bus.emit('base:created', { base });
      bus.emit('notify', { text: '기지를 세웠습니다! B 키로 포탑을 지을 수 있어요', kind: 'item' });
    });

    // 아침마다 텐트는 다시 멀쩡해진다.
    bus.on('time:day', () => {
      for (const b of ctx.bases) b.tent.repairFull();
    });

    bus.on('save:collect', (save) => {
      save.bases = ctx.bases.map((b) => ({
        id: b.id, level: b.level, position: [b.position.x, b.position.z], hp: b.tent.stats.hp,
      }));
    });
    bus.on('save:apply', (save) => {
      for (const b of save.bases ?? []) {
        this.createBase({ id: b.id, level: b.level, position: new THREE.Vector3(b.position[0], 0, b.position[1]), hp: b.hp });
      }
    });
  }

  levelDef(level) {
    return this.ctx.data.buildings.baseLevels[String(level)];
  }

  createBase({ id, position, level, hp }) {
    const def = this.levelDef(level);
    const base = {
      id: id ?? this.nextId,
      level,
      name: def.name,
      position: position.clone(),
      areaRadius: def.areaRadius,
      maxTurrets: def.maxTurrets,
    };
    this.nextId = Math.max(this.nextId, base.id + 1);
    base.tent = new Building(this.ctx, base, def, hp);
    this.ctx.bases.push(base);
    this.ctx.structures.push(base.tent);
    return base;
  }

  update(dt) {
    for (const b of this.ctx.bases) b.tent.update(dt);
  }
}
