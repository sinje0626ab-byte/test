import * as THREE from 'three';
import { Building } from '../entities/Building.js';
import { baseAt, nearestBase } from '../utils/bases.js';

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
      bus.emit('notify', { text: `${base.label}을(를) 세웠습니다! 건설(B)에서 포탑을 지을 수 있어요`, kind: 'item' });
    });

    bus.on('base:travel', ({ baseId }) => this.travel(baseId));
    bus.on('base:upgrade', ({ baseId }) => this.upgrade(baseId));
    // 귀환 두루마리: 가장 가까운 기지로 (영역 밖에서도)
    bus.on('item:use', (e) => {
      if (!ctx.data.items.items[e.item]?.use?.returnHome) return;
      const base = nearestBase(ctx.bases, ctx.player.position);
      if (!base || !ctx.player.alive) {
        bus.emit('notify', { text: '돌아갈 기지가 없어요', kind: 'warn' });
        return;
      }
      e.used = true;
      bus.emit('player:teleport', { position: this.doorstep(base) });
      bus.emit('notify', { text: `${base.label}(으)로 돌아왔습니다`, kind: 'info' });
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
    const region = this.ctx.world.regionAt(position.x, position.z);
    const base = {
      id: id ?? this.nextId,
      level,
      name: def.name,
      region,
      position: position.clone(),
      areaRadius: def.areaRadius,
      maxTurrets: def.maxTurrets,
    };
    this.nextId = Math.max(this.nextId, base.id + 1);
    base.label = `${region.name} 기지 #${base.id}`;
    base.tent = new Building(this.ctx, base, def, hp);
    this.ctx.bases.push(base);
    this.ctx.structures.push(base.tent);
    return base;
  }

  // 재료를 써서 다음 단계로 (텐트 → 움막 → 집 → 요새)
  upgrade(baseId) {
    const { bases, bus } = this.ctx;
    const base = bases.find((b) => b.id === baseId);
    const next = base && this.levelDef(base.level + 1);
    if (!next) return;
    const spend = { items: next.cost, ok: false };
    bus.emit('inventory:spend', spend);
    if (!spend.ok) {
      bus.emit('notify', { text: '재료가 부족합니다', kind: 'warn' });
      return;
    }
    base.level += 1;
    base.name = next.name;
    base.areaRadius = next.areaRadius;
    base.maxTurrets = next.maxTurrets;
    base.tent.setLevel(next);
    bus.emit('base:upgraded', { base, level: base.level });
    bus.emit('notify', { text: `${base.label}이(가) ${next.name}(으)로 커졌습니다!`, kind: 'item' });
  }

  // 텐트 문 앞 (부활·빠른 이동 도착 지점)
  doorstep(base) {
    return new THREE.Vector3(base.position.x, 0, base.position.z + base.tent.radius + 1.2);
  }

  // 빠른 이동: 기지 영역 안에서 다른 기지로
  travel(baseId) {
    const { player, bases, bus } = this.ctx;
    const target = bases.find((b) => b.id === baseId);
    if (!target || !player.alive) return;
    const here = baseAt(bases, player.position);
    if (!here) {
      bus.emit('notify', { text: '기지 영역 안에서만 빠른 이동할 수 있습니다', kind: 'warn' });
      return;
    }
    if (here === target) return;
    bus.emit('player:teleport', { position: this.doorstep(target) });
    bus.emit('notify', { text: `${target.label}(으)로 이동했습니다`, kind: 'info' });
  }

  update(dt) {
    for (const b of this.ctx.bases) b.tent.update(dt);
  }
}
