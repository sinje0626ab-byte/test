import * as THREE from 'three';
import { ResourceNode } from '../entities/ResourceNode.js';
import { createRandom, rand } from '../utils/random.js';

const dir = new THREE.Vector3();

// 채집: 노드 배치(시드 고정), 공격으로 캐기, 드롭, 아침 복구. 멀리 있는 노드는 숨긴다.
export class GatherSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.gather;
    this.defs = ctx.data.nodes.nodes;
    this.nodes = [];
    this.byId = new Map();
    this.visTimer = 0;
    ctx.nodes = this.nodes;
    this.generate();

    const { bus } = ctx;
    bus.on('player:attack', (a) => this.onAttack(a));
    bus.on('time:day', ({ day }) => this.restore(day));
    bus.on('save:collect', (save) => {
      const depleted = {};
      for (const n of this.nodes) if (!n.alive) depleted[n.id] = n.depletedDay;
      save.gather = { depleted };
    });
    bus.on('save:apply', (save) => {
      for (const [id, day] of Object.entries(save.gather?.depleted ?? {})) {
        const n = this.byId.get(id);
        if (!n) continue;
        n.alive = false;
        n.hp = 0;
        n.depletedDay = day;
        n.applyLook();
      }
    });
  }

  // 지역마다 1000㎡당 개수만큼, 나무·바위와 겹치지 않게 뿌린다. 같은 시드면 같은 자리.
  generate() {
    const { world, scene, data } = this.ctx;
    const b = world.bounds;
    const rng = createRandom(this.cfg.seed);
    const counters = {};
    for (const reg of world.regions.list) {
      const z0 = Math.max(reg.zFrom, b.minZ) + 3;
      const z1 = Math.min(reg.zTo, b.maxZ) - 3;
      if (z1 <= z0) continue;
      const area = (b.maxX - b.minX) * (z1 - z0);
      for (const [type, dens] of Object.entries(data.nodes.density[reg.id] ?? {})) {
        const def = this.defs[type];
        const count = Math.round((dens * area) / 1000);
        for (let i = 0; i < count; i++) {
          for (let tries = 0; tries < 30; tries++) {
            const x = rng.range(b.minX + 4, b.maxX - 4);
            const z = rng.range(z0, z1);
            if (world.nearSpawn(x, z) || world.isBlocked(x, z, def.radius + 0.6)) continue;
            if (this.nodes.some((n) => Math.abs(n.position.x - x) < 2.5 && Math.abs(n.position.z - z) < 2.5)) continue;
            counters[type] = (counters[type] ?? 0) + 1;
            const node = new ResourceNode(scene, `${type}-${counters[type]}`, type, def, new THREE.Vector3(x, 0, z), rng.next);
            node.region = reg.id;
            this.nodes.push(node);
            this.byId.set(node.id, node);
            if (def.collide) world.addCollider(x, z, def.radius * 0.8);
            break;
          }
        }
      }
    }
  }

  // 칼 부채꼴 안의 살아 있는 노드를 친다.
  onAttack(a) {
    const stats = this.ctx.player.stats;
    const dmg = this.cfg.damage * (1 + (stats.gatherSpeed ?? 0));
    const half = a.arc / 2;
    for (const n of this.nodes) {
      if (!n.alive || !n.group.visible) continue;
      dir.set(n.position.x - a.origin.x, 0, n.position.z - a.origin.z);
      const dist = dir.length();
      if (dist - n.radius > a.range) continue;
      if (dist > n.radius && dir.divideScalar(dist).angleTo(a.dir) > half) continue;
      const done = n.hit(dmg);
      this.ctx.bus.emit('gather:hit', { position: n.position.clone().setY(0.8), color: n.def.color, sound: n.def.sound });
      if (done) this.deplete(n);
    }
  }

  deplete(n) {
    const { bus, player, time } = this.ctx;
    n.depletedDay = time.day;
    const bonus = Math.round(player.stats.gatherAmount ?? 0);
    n.def.drops.forEach((d, i) => {
      const chance = d.chanceByRegion?.[n.region] ?? d.chance;
      if (Math.random() >= chance) return;
      const count = rand.int(d.min, d.max) + (i === 0 ? bonus : 0);
      if (count > 0) bus.emit('loot:spawn', { item: d.item, count, position: n.position.clone() });
    });
    bus.emit('gather:done', { type: n.type, position: n.position.clone(), xp: n.def.xp, color: n.def.color });
  }

  restore(day) {
    for (const n of this.nodes) {
      if (!n.alive && day - n.depletedDay >= n.def.respawnDays) n.restore();
    }
  }

  update(dt) {
    const p = this.ctx.player.position;
    const t = this.ctx.time.elapsed;
    this.visTimer -= dt;
    const refresh = this.visTimer <= 0;
    if (refresh) this.visTimer = 0.5;
    const vis = this.cfg.visibleRange;
    const near = this.cfg.sparkleRange;
    for (const n of this.nodes) {
      const dx = n.position.x - p.x;
      const dz = n.position.z - p.z;
      const d2 = dx * dx + dz * dz;
      if (refresh) n.group.visible = d2 < vis * vis;
      if (n.group.visible) n.update(dt, d2 < near * near, t);
    }
  }
}
