import * as THREE from 'three';
import { Drop } from '../entities/Drop.js';
import { rand } from '../utils/random.js';

// 몬스터 드롭 테이블 굴리기 + 바닥 드롭 관리 + 줍기
export class LootSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.loot;
    this.drops = [];
    ctx.drops = this.drops; // 용병 채집가가 바닥 골드를 찾는다
    this.fullNotice = 0;
    ctx.bus.on('monster:killed', (e) => this.onKilled(e));
    ctx.bus.on('loot:spawn', ({ item, count, position }) => this.spawn(item, count, position));
    ctx.bus.on('loot:table', ({ drops, position }) => this.roll(drops, position));
  }

  onKilled({ type, position, elite, noLoot, reward = 1, raid, boss, night }) {
    if (noLoot) return;
    this.roll(this.ctx.data.monsters[type].drops, position, elite ? this.ctx.data.config.elite : null, reward);
    if (!raid) this.rollGear(position, { elite, boss, night });
  }

  // 지역 장비 풀: 등급마다 한 번씩 굴려 가장 높은 등급 하나만 (희귀할수록 낮은 확률, config.gearDrop)
  rollGear(position, { elite, boss, night }) {
    const cfg = this.ctx.data.config.gearDrop;
    if (!cfg) return;
    const region = this.ctx.world.regionAt(position.x, position.z).id;
    const pools = (this.pools ??= this.buildPools());
    const k = (elite ? this.ctx.data.config.elite.dropBonus : 1) * (boss ? cfg.boss : 1) * (night ? cfg.night : 1) * (1 + (this.ctx.player.stats.dropRate ?? 0));
    for (const grade of ['epic', 'rare', 'uncommon', 'common']) {
      const list = pools[region]?.[grade];
      if (!list?.length || Math.random() >= cfg.chances[grade] * k) continue;
      this.spawn(rand.pick(list), 1, position);
      return;
    }
  }

  buildPools() {
    const out = {};
    for (const [id, def] of Object.entries(this.ctx.data.items.items)) {
      if (!def.pool) continue;
      ((out[def.pool] ??= {})[def.grade] ??= []).push(id);
    }
    return out;
  }

  // 드롭 테이블 굴리기. { oneOf: [...] }는 그중 하나. 정예면 골드·장비 확률이 오른다.
  // goldMult: 지역 field.reward (골드 개수에만)
  roll(drops, position, elite = null, goldMult = 1) {
    const items = this.ctx.data.items.items;
    for (const entry of drops) {
      const item = entry.oneOf ? rand.pick(entry.oneOf) : entry.item;
      const equip = !!items[item]?.equipSlot;
      // 박사의 돋보기: 골드 말고 나머지 드롭 확률 ↑
      const luck = item === 'gold' ? 1 : 1 + (this.ctx.player.stats.dropRate ?? 0);
      const chance = entry.chance * (elite && equip ? elite.dropBonus : 1) * luck;
      if (Math.random() >= chance) continue;
      let count = entry.oneOf ? 1 : rand.int(entry.min, entry.max);
      if (elite && item === 'gold') count = Math.round(count * elite.gold);
      if (item === 'gold' && goldMult !== 1) count = Math.round(count * goldMult);
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
