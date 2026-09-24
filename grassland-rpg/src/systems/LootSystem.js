import * as THREE from 'three';
import { Drop } from '../entities/Drop.js';
import { rand } from '../utils/random.js';

// 몬스터 드롭 테이블 굴리기 + 바닥 드롭 관리 + 줍기
export class LootSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.loot;
    this.drops = [];
    ctx.bus.on('monster:killed', (e) => this.onKilled(e));
  }

  onKilled({ type, position }) {
    const def = this.ctx.data.monsters[type];
    for (const entry of def.drops) {
      if (Math.random() >= entry.chance) continue;
      const count = rand.int(entry.min, entry.max);
      if (count > 0) this.spawn(entry.item, count, position);
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

  update(dt) {
    const { player, bus } = this.ctx;
    const p = this.ctx.data.player;
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.update(dt);

      if (player.alive && d.age > this.cfg.pickupDelay) {
        const dist = Math.hypot(player.position.x - d.position.x, player.position.z - d.position.z);
        if (dist < p.pickupRadius) {
          bus.emit('loot:picked', { item: d.itemId, count: d.count });
          d.done = true;
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
