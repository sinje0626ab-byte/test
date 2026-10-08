import { Wall } from '../entities/Wall.js';
import { WallGrid } from '../world/WallGrid.js';
import { materialCost } from '../utils/build.js';
import { ringSlots } from '../utils/wallRing.js';

// 성벽(나무 울타리·돌담): 건설 창에서 사면 기지 둘레 원(utils/wallRing.js)에 한 칸씩 저절로 쌓인다.
// 뒤(북)에서 시작해 양옆으로 번갈아 쌓여 남쪽 입구에서 만난다. 몬스터만 막는다(입구로 몰린다).
// - 돌담은 나무 울타리를 먼저 바꿔 끼우고, 다 바꾸면 빈 자리에 새로 쌓는다
// - 포탑·건물·나무·바위가 있는 자리는 건너뛴다
// - 기지가 커지면(base:upgraded) 새 원에 다시 늘어놓는다 (종류·체력 비율 유지)
// 이벤트: walls:buy { baseId, type, count } → walls:changed
export class WallSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.walls;
    this.defs = ctx.data.buildings.walls;
    this.list = [];
    this.grid = new WallGrid(ctx.world, this.cfg);
    ctx.wallGrid = this.grid;
    ctx.wallRing = (base) => this.info(base);
    this.counts = {};
    const { bus } = ctx;
    bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
    });
    bus.on('walls:buy', ({ baseId, type, count }) => this.buy(baseId, type, count));
    bus.on('base:upgraded', ({ base }) => this.relayout(base));
    bus.on('structure:destroyed', ({ structure }) => { if (structure.kind === 'wall') this.remove(structure); });
    bus.on('time:day', () => { for (const w of this.list) w.repairFull(); });
    bus.on('save:collect', (save) => {
      save.walls = this.list.map((w) => ({ type: w.type, baseId: w.baseId, slot: w.slot, hp: w.stats.hp }));
    });
    bus.on('save:apply', (save) => {
      // 예전 저장(격자 칸 cell)은 원 위 빈 자리에 쌓는 순서대로 옮긴다
      const byBase = new Map();
      for (const w of save.walls ?? []) {
        if (!this.defs[w.type]) continue;
        if (!byBase.has(w.baseId)) byBase.set(w.baseId, []);
        byBase.get(w.baseId).push(w);
      }
      for (const [baseId, walls] of byBase) {
        const base = ctx.bases.find((b) => b.id === baseId);
        if (!base) continue;
        const ring = ringSlots(base, this.cfg);
        const used = new Set();
        const rest = [];
        for (const w of walls) {
          if (Number.isInteger(w.slot) && ring.slots[w.slot] && !ring.slots[w.slot].gate && !used.has(w.slot)) {
            used.add(w.slot);
            this.add(w.type, base, ring.slots[w.slot], w.hp);
          } else rest.push(w);
        }
        const free = ring.order.filter((k) => !used.has(k) && this.slotFree(ring.slots[k]));
        rest.slice(0, free.length).forEach((w, i) => this.add(w.type, base, ring.slots[free[i]], w.hp));
      }
    });
  }

  add(type, base, slot, hp) {
    const w = new Wall(this.ctx, type, base.id, slot.cells[0]?.[0] ?? 0, slot.cells[0]?.[1] ?? 0, hp, slot);
    this.list.push(w);
    this.grid.set(w);
    this.ctx.structures.push(w);
    return w;
  }

  remove(w) {
    w.dispose();
    this.grid.delete(w);
    this.list = this.list.filter((x) => x !== w);
    const s = this.ctx.structures;
    const i = s.indexOf(w);
    if (i >= 0) s.splice(i, 1);
    this.ctx.bus.emit('walls:changed', {});
  }

  wallsOf(base) {
    return this.list.filter((w) => w.baseId === base.id);
  }

  // 그 자리에 포탑·건물·나무·바위가 있으면 쓸 수 없다
  slotFree(slot) {
    const { world, structures } = this.ctx;
    if (world.isBlocked(slot.x, slot.z, 0.3)) return false;
    return !structures.some((s) => s.kind !== 'wall' && s.kind !== 'tent' && s.radius && Math.hypot(s.position.x - slot.x, s.position.z - slot.z) < s.radius + 0.55);
  }

  // 건설 창 표시용: 원의 칸 수, 쌓인 수, 남은 빈 자리(쓸 수 있는 것만)
  info(base) {
    const ring = ringSlots(base, this.cfg);
    const mine = this.wallsOf(base);
    const used = new Set(mine.map((w) => w.slot));
    const free = ring.order.filter((k) => !used.has(k) && this.slotFree(ring.slots[k]));
    return { ring, total: ring.order.length, built: mine.length, free, walls: mine };
  }

  buy(baseId, type, count = 1) {
    const { bus, bases } = this.ctx;
    const base = bases.find((b) => b.id === baseId);
    const def = this.defs[type];
    if (!base || !def) return;
    if (base.level < def.unlockBaseLevel) {
      bus.emit('notify', { text: `기지 Lv${def.unlockBaseLevel}부터 지을 수 있습니다`, kind: 'warn' });
      return;
    }
    const { ring, free, walls } = this.info(base);
    // 돌담: 나무 울타리부터 바꿔 끼운다 (쌓은 순서대로)
    const rank = new Map(ring.order.map((k, i) => [k, i]));
    const swap = def.replaces ? walls.filter((w) => w.type === def.replaces).sort((a, b) => rank.get(a.slot) - rank.get(b.slot)) : [];
    const room = swap.length + free.length;
    if (!room) {
      bus.emit('notify', { text: '성벽이 이미 가득 찼어요', kind: 'info' });
      return;
    }
    // 재료가 되는 만큼만
    const unit = materialCost(def.cost, this.ctx.player.stats);
    const affordable = Math.min(...unit.map((c) => Math.floor((this.counts[c.id] ?? 0) / c.count)));
    const n = Math.min(count, room, affordable);
    if (n <= 0) {
      const need = unit.map((c) => `${this.ctx.data.items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}`).join(' · ');
      bus.emit('notify', { text: `재료가 부족합니다 (${need})`, kind: 'warn' });
      return;
    }
    const spend = { items: unit.map((c) => ({ id: c.id, count: c.count * n })), ok: false };
    bus.emit('inventory:spend', spend);
    if (!spend.ok) return;
    let left = n;
    for (const w of swap) {
      if (!left) break;
      const slot = ring.slots[w.slot];
      this.remove(w);
      this.add(type, base, slot);
      left -= 1;
    }
    for (const k of free) {
      if (!left) break;
      this.add(type, base, ring.slots[k]);
      left -= 1;
    }
    bus.emit('walls:placed', { count: n, type });
    bus.emit('walls:changed', {});
    bus.emit('notify', { text: `${def.name} ${n}칸을 쌓았어요`, kind: 'item' });
  }

  // 기지가 커지면 새 원 위로 옮긴다 (쌓았던 순서·종류·체력 비율 그대로)
  relayout(base) {
    const old = this.wallsOf(base);
    if (!old.length) return;
    // 쌓은 순서 = 북쪽에서 떨어진 각도 순
    const fromNorth = (w) => {
      const a = Math.atan2(w.position.z - base.position.z, w.position.x - base.position.x);
      return Math.abs(Math.atan2(Math.sin(a + Math.PI / 2), Math.cos(a + Math.PI / 2)));
    };
    old.sort((a, b) => fromNorth(a) - fromNorth(b));
    const keep = old.map((w) => ({ type: w.type, ratio: w.stats.hp / w.stats.maxHp }));
    for (const w of old) this.remove(w);
    const { ring, free } = this.info(base);
    keep.slice(0, free.length).forEach((w, i) => {
      const nw = this.add(w.type, base, ring.slots[free[i]]);
      nw.stats.hp = Math.round(nw.stats.maxHp * w.ratio);
    });
    this.ctx.bus.emit('walls:changed', {});
  }

  update(dt) {
    for (const w of this.list) w.update(dt);
  }
}
