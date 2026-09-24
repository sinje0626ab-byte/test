// 작업대 제작: 재료 → 장비·소모품·텐트 키트
export class CraftingSystem {
  constructor(ctx) {
    this.ctx = ctx;
    ctx.bus.on('craft:make', ({ recipe, baseLevel }) => this.make(recipe, baseLevel));
  }

  make(id, baseLevel) {
    const { bus, data } = this.ctx;
    const r = data.recipes[id];
    if (!r) return;
    const name = data.items.items[r.result].name;
    if (baseLevel < r.baseLevel) {
      bus.emit('notify', { text: `기지 Lv${r.baseLevel} 작업대에서 만들 수 있어요`, kind: 'warn' });
      return;
    }
    const room = { item: r.result, count: r.count, ok: false };
    bus.emit('inventory:can-add', room);
    if (!room.ok) {
      bus.emit('notify', { text: '가방에 자리가 없습니다', kind: 'warn' });
      return;
    }
    const spend = { items: r.ingredients, ok: false };
    bus.emit('inventory:spend', spend);
    if (!spend.ok) {
      bus.emit('notify', { text: '재료가 부족합니다', kind: 'warn' });
      return;
    }
    bus.emit('inventory:add', { item: r.result, count: r.count, taken: 0 });
    bus.emit('notify', { text: `${name}${r.count > 1 ? ` ${r.count}개` : ''} 제작!`, kind: 'item' });
  }
}
