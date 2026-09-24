import { maxStackOf, countIn, roomFor, addTo, removeFrom } from '../utils/slots.js';

// 가방: 정해진 칸 수, 칸마다 { id, count } 또는 null.
export class InventorySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.inventory;
    this.slots = new Array(this.cfg.slots).fill(null);
    const { bus } = ctx;

    bus.on('loot:picked', (e) => this.onPicked(e));
    bus.on('inventory:move', ({ from, to }) => this.move(from, to));
    bus.on('inventory:use', ({ slot }) => this.use(slot));
    bus.on('inventory:consume', ({ item, count }) => this.remove(item, count));
    // 건설 비용: 전부 있을 때만 한꺼번에 뺀다.
    bus.on('inventory:spend', (e) => {
      if (!e.items.every((it) => this.countOf(it.id) >= it.count)) return;
      for (const it of e.items) this.remove(it.id, it.count);
      e.ok = true;
    });
    // 장비 장착: 그 칸을 원래 끼던 장비(없으면 빈칸)로 바꾼다.
    bus.on('inventory:replace-slot', ({ slot, item }) => {
      this.slots[slot] = item ? { id: item, count: 1 } : null;
      this.changed();
    });
    // 장비 해제 등: 받은 만큼 e.taken 에 더한다.
    bus.on('inventory:add', (e) => {
      const added = this.add(e.item, e.count);
      e.taken += added;
      if (added) this.changed();
    });
    // 다 들어갈 자리가 있는지만 본다.
    bus.on('inventory:can-add', (e) => {
      e.ok = roomFor(this.slots, e.item, this.maxStack(e.item)) >= e.count;
    });
    // 한 칸을 통째로 꺼낸다 (창고에 넣기·팔기)
    bus.on('inventory:take-slot', (e) => {
      e.item = this.slots[e.slot];
      if (!e.item) return;
      this.slots[e.slot] = null;
      this.changed();
    });
    // 퀵슬롯: 그 아이템이 든 첫 칸을 쓴다.
    bus.on('inventory:use-item', ({ item }) => {
      const i = this.slots.findIndex((x) => x?.id === item);
      if (i >= 0) this.use(i);
    });
    bus.on('game:new', () => {
      for (const s of ctx.data.config.startingItems) this.add(s.id, s.count);
      this.changed();
    });
    bus.on('save:collect', (save) => {
      save.inventory = { slots: this.slots.map((s) => (s ? { ...s } : null)) };
    });
    bus.on('save:apply', (save) => this.applySave(save.inventory));
  }

  def(id) {
    return this.ctx.data.items.items[id];
  }

  maxStack(id) {
    return maxStackOf(this.ctx.data, id);
  }

  countOf(id) {
    return countIn(this.slots, id);
  }

  // 들어간 개수를 돌려준다 (가방이 차면 일부만 들어갈 수 있다).
  add(id, count) {
    return addTo(this.slots, id, count, this.maxStack(id));
  }

  onPicked(e) {
    const def = this.def(e.item);
    if (!def || def.category === 'currency') return;
    const added = this.add(e.item, e.count);
    if (added <= 0) return;
    e.taken += added;
    const total = this.countOf(e.item);
    this.changed({ item: e.item, count: added, total });
    this.ctx.bus.emit('notify', {
      text: `${def.name} +${added} (보유 ${total})`,
      kind: 'item',
      color: this.ctx.data.items.grades[def.grade]?.color,
    });
  }

  // 같은 아이템이면 합치고, 아니면 자리를 바꾼다.
  move(from, to) {
    const a = this.slots[from];
    if (from === to || !a || to < 0 || to >= this.slots.length) return;
    const b = this.slots[to];
    if (b && b.id === a.id && b.count < this.maxStack(a.id)) {
      const n = Math.min(a.count, this.maxStack(a.id) - b.count);
      b.count += n;
      a.count -= n;
      if (a.count <= 0) this.slots[from] = null;
    } else {
      this.slots[to] = a;
      this.slots[from] = b;
    }
    this.changed();
  }

  // 우클릭: 소모품은 사용, 장비는 장착. 실제 효과는 해당 Phase의 시스템이 처리한다.
  use(index) {
    const s = this.slots[index];
    if (!s) return;
    const def = this.def(s.id);
    if (def.category === 'consumable') {
      // 효과를 받은 쪽이 used = true (HP가 가득이면 안 쓴다)
      const e = { item: s.id, used: false };
      this.ctx.bus.emit('item:use', e);
      if (!e.used) {
        this.ctx.bus.emit('notify', { text: '지금은 쓸 필요가 없어요', kind: 'info' });
        return;
      }
      s.count -= 1;
      if (s.count <= 0) this.slots[index] = null;
      this.changed();
    } else if (def.category === 'kit') {
      // 실제로 설치됐을 때 inventory:consume 으로 하나 줄어든다.
      this.ctx.bus.emit('build:start', { kind: def.builds, item: s.id });
    } else if (def.category === 'equipment') {
      this.ctx.bus.emit('item:equip', { item: s.id, slot: index });
    }
  }

  remove(id, count) {
    const n = removeFrom(this.slots, id, count);
    this.changed();
    return n;
  }

  applySave(inv) {
    if (!inv) return;
    this.slots = new Array(this.cfg.slots).fill(null);
    inv.slots.forEach((s, i) => {
      if (!s || !this.def(s.id)) return;
      if (i < this.slots.length) this.slots[i] = { id: s.id, count: s.count };
      else this.add(s.id, s.count); // 칸 수가 줄었으면 앞쪽 빈칸으로
    });
    this.changed();
  }

  changed(extra = {}) {
    this.ctx.bus.emit('inventory:changed', { slots: this.slots, ...extra });
  }
}
