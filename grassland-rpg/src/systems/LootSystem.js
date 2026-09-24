import * as THREE from 'three';
import { Drop } from '../entities/Drop.js';
import { rand } from '../utils/random.js';

// 몬스터 드롭 테이블 굴리기 + 바닥 드롭 관리 + 줍기
export class LootSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.loot;
    this.drops = [];
    this.fullNotice = 0;
    ctx.bus.on('monster:killed', (e) => this.onKilled(e));
    ctx.bus.on('loot:spawn', ({ item, count, position }) => this.spawn(item, count, position));
    ctx.bus.on('loot:table', ({ drops, position }) => this.roll(drops, position));
  }

  onKilled({ type, position, elite, noLoot }) {
    if (noLoot) return;
    this.roll(this.ctx.data.monsters[type].drops, position, elite ? this.ctx.data.config.elite : null);
  }

  // 드롭 테이블 굴리기. { oneOf: [...] }는 그중 하나. 정예면 골드·장비 확률이 오른다.
  roll(drops, position, elite = null) {
    const items = this.ctx.data.items.items;
    for (const entry of drops) {
      const item = entry.oneOf ? rand.pick(entry.oneOf) : entry.item;
      const equip = !!items[item]?.equipSlot;
      const chance = entry.chance * (elite && equip ? elite.dropBonus : 1);
      if (Math.random() >= chance) continue;
      let count = entry.oneOf ? 1 : rand.int(entry.min, entry.max);
      if (elite && item === 'gold') count = Math.round(count * elite.gold);
      if (count > 0) this.spawn(item, count, position);
    }
  }

  spawn(itemId, count, position) {
    const a = rand.range(0, Math.PI * 2);
    const s = rand.range(0.4, 1) * this.cfg.scatter;
    const vel = new THREE.Vector3(Math.cos(a) * s, rand.range(this.cfg.popMin, this.cfg.popMax), Math.sin(a) * s);
    const start = position.clone();
    start.y = 0.4;
    this.drops.push(new Drop(this.ctx, itemId, count, start, vel));
  }

  onBagFull(drop) {
    drop.blocked = this.cfg.fullRetry;
    if (this.fullNotice > 0) return;
    this.fullNotice = this.cfg.fullNoticeCooldown;
    this.ctx.bus.emit('notify', { text: '가방이 가득 찼습니다', kind: 'warn' });
  }

  update(dt) {
    const { player, bus } = this.ctx;
    const p = this.ctx.data.player;
    this.fullNotice = Math.max(0, this.fullNotice - dt);
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.update(dt);

      d.blocked = Math.max(0, (d.blocked ?? 0) - dt);
      if (player.alive && d.age > this.cfg.pickupDelay && d.blocked <= 0) {
        const dist = Math.hypot(player.position.x - d.position.x, player.position.z - d.position.z);
        if (dist < p.pickupRadius) {
          // 받은 쪽이 taken에 받은 개수를 더한다. 다 못 받으면 나머지는 바닥에 남는다.
          const e = { item: d.itemId, count: d.count, taken: 0 };
          bus.emit('loot:picked', e);
          d.count -= e.taken;
          if (d.count <= 0) d.done = true;
          else this.onBagFull(d);
        } else if (dist < p.magnetRadius) {
          d.pullToward(player.position, p.magnetSpeed, dt);
        }
      }
      if (d.age > this.cfg.lifetime) d.done = true;

      if (d.done) {
        d.dispose();
        this.drops.splice(i, 1);
      }
    }
  }
}
