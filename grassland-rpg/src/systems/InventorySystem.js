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
    const d = this.def(id);
    return d.stackable ? (d.maxStack ?? this.cfg.defaultMaxStack) : 1;
  }

  countOf(id) {
    return this.slots.reduce((n, s) => n + (s?.id === id ? s.count : 0), 0);
  }

  // 들어간 개수를 돌려준다 (가방이 차면 일부만 들어갈 수 있다).
  add(id, count) {
    const max = this.maxStack(id);
    let left = count;
    for (const s of this.slots) {
      if (left <= 0) break;
      if (s?.id !== id || s.count >= max) continue;
      const n = Math.min(left, max - s.count);
      s.count += n;
      left -= n;
    }
    for (let i = 0; i < this.slots.length && left > 0; i++) {
      if (this.slots[i]) continue;
      const n = Math.min(left, max);
      this.slots[i] = { id, count: n };
      left -= n;
    }
    return count - left;
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
      this.ctx.bus.emit('item:use', { item: s.id });
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
    let left = count;
    for (let i = this.slots.length - 1; i >= 0 && left > 0; i--) {
      const s = this.slots[i];
      if (s?.id !== id) continue;
      const n = Math.min(left, s.count);
      s.count -= n;
      left -= n;
      if (s.count <= 0) this.slots[i] = null;
    }
    this.changed();
    return count - left;
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
