// 장비 슬롯 6개. 장착하면 가방 칸과 맞바꾸고, 해제하면 가방으로 돌려보낸다.
const SLOTS = ['weapon', 'head', 'body', 'feet', 'accessory1', 'accessory2'];

export class EquipmentSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.slots = Object.fromEntries(SLOTS.map((s) => [s, null]));
    const { bus } = ctx;

    bus.on('item:equip', ({ item, slot }) => this.equip(item, slot));
    bus.on('equipment:unequip', ({ slot }) => this.unequip(slot));
    bus.on('save:collect', (save) => { save.equipment = { slots: { ...this.slots } }; });
    bus.on('save:apply', (save) => {
      const saved = save.equipment?.slots ?? {};
      for (const s of SLOTS) this.slots[s] = saved[s] && this.def(saved[s]) ? saved[s] : null;
      this.changed();
    });
  }

  def(id) {
    return this.ctx.data.items.items[id];
  }

  // 아이템이 들어갈 슬롯. 장신구는 빈 칸 먼저.
  targetSlot(def) {
    if (def.equipSlot !== 'accessory') return def.equipSlot;
    if (!this.slots.accessory1) return 'accessory1';
    if (!this.slots.accessory2) return 'accessory2';
    return 'accessory1';
  }

  equip(itemId, invSlot) {
    const def = this.def(itemId);
    if (def?.category !== 'equipment') return;
    const slot = this.targetSlot(def);
    const prev = this.slots[slot];
    this.slots[slot] = itemId;
    this.ctx.bus.emit('inventory:replace-slot', { slot: invSlot, item: prev });
    this.ctx.bus.emit('notify', { text: `${def.name} 장착`, kind: 'item', color: this.ctx.data.items.grades[def.grade]?.color });
    this.changed();
  }

  unequip(slot) {
    const id = this.slots[slot];
    if (!id) return;
    const e = { item: id, count: 1, taken: 0 };
    this.ctx.bus.emit('inventory:add', e);
    if (!e.taken) {
      this.ctx.bus.emit('notify', { text: '가방이 가득 차서 해제할 수 없습니다', kind: 'warn' });
      return;
    }
    this.slots[slot] = null;
    this.changed();
  }

  changed() {
    const bonus = {};
    for (const id of Object.values(this.slots)) {
      if (!id) continue;
      for (const [k, v] of Object.entries(this.def(id).bonus ?? {})) bonus[k] = (bonus[k] ?? 0) + v;
    }
    this.ctx.bus.emit('equipment:changed', { slots: this.slots, bonus });
  }
}
