// 소지 아이템 수량. 인벤토리 창·슬롯·장비는 Phase 2에서 붙인다.
export class InventorySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.items = new Map();
    const { bus, data } = ctx;

    bus.on('loot:picked', ({ item, count }) => {
      const def = data.items.items[item];
      if (!def || def.category === 'currency') return;
      const total = (this.items.get(item) ?? 0) + count;
      this.items.set(item, total);
      bus.emit('inventory:changed', { item, count, total });
      bus.emit('notify', { text: `${def.name} +${count} (보유 ${total})`, kind: 'item', color: data.items.grades[def.grade]?.color });
    });
  }
}
