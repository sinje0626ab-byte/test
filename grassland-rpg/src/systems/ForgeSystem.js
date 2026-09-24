import { enhanceCost } from '../utils/enhance.js';

// 대장간 장비 강화: 골드 + 철광석, 실패 없음. 대상은 가방 칸 또는 장비 슬롯.
// forge:enhance { from: 'bag' | 'equip', slot, id, plus } → inventory:set-plus / equipment:set-plus
export class ForgeSystem {
  constructor(ctx) {
    this.ctx = ctx;
    ctx.bus.on('forge:enhance', (e) => this.enhance(e));
  }

  enhance({ from, slot, id, plus = 0 }) {
    const { bus, data } = this.ctx;
    const def = data.items.items[id];
    const cost = enhanceCost(data, plus);
    if (def?.category !== 'equipment' || !cost) return;
    const items = { items: cost.items, ok: false };
    bus.emit('inventory:spend', items);
    if (!items.ok) {
      bus.emit('notify', { text: `${data.items.items[cost.items[0].id].name}이(가) 부족합니다`, kind: 'warn' });
      return;
    }
    const gold = { amount: cost.gold, ok: false };
    bus.emit('economy:spend', gold);
    if (!gold.ok) {
      for (const c of cost.items) bus.emit('inventory:add', { item: c.id, count: c.count, taken: 0 });
      bus.emit('notify', { text: '골드가 부족합니다', kind: 'warn' });
      return;
    }
    bus.emit(from === 'equip' ? 'equipment:set-plus' : 'inventory:set-plus', { slot, plus: plus + 1 });
    bus.emit('forge:enhanced', { id, plus: plus + 1 });
    bus.emit('notify', { text: `${def.name} +${plus + 1} 강화 성공!`, kind: 'item', color: data.items.grades[def.grade]?.color });
  }
}
