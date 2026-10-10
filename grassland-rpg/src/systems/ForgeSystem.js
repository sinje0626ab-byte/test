import { enhanceCost } from '../utils/enhance.js';
import { josa } from '../utils/josa.js';
import { rerollCost, rerollOpts } from '../utils/affix.js';

// 대장간 장비 강화: 골드 + 철광석, 실패 없음. 대상은 가방 칸 또는 장비 슬롯.
// forge:enhance { from: 'bag' | 'equip', slot, id, plus } → inventory:set-plus / equipment:set-plus
export class ForgeSystem {
  constructor(ctx) {
    this.ctx = ctx;
    ctx.bus.on('forge:enhance', (e) => this.enhance(e));
    ctx.bus.on('forge:reroll', (e) => this.reroll(e));
  }

  enhance({ from, slot, id, plus = 0 }) {
    const { bus, data } = this.ctx;
    const def = data.items.items[id];
    const cost = enhanceCost(data, plus);
    if (def?.category !== 'equipment' || !cost) return;
    const items = { items: cost.items, ok: false };
    bus.emit('inventory:spend', items);
    if (!items.ok) {
      bus.emit('notify', { text: `${josa(data.items.items[cost.items[0].id].name, '이/가')} 부족합니다`, kind: 'warn' });
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

  // 재련: 랜덤 옵션 다시 굴리기 (골드 + 철광석, 지역 단계별)
  reroll({ from, slot, id, opts }) {
    const { bus, data } = this.ctx;
    const def = data.items.items[id];
    if (def?.category !== 'equipment') return;
    const cost = rerollCost(data, id);
    if (!this.pay(cost)) return;
    const next = rerollOpts(data, id, opts);
    bus.emit(from === 'equip' ? 'equipment:set-opts' : 'inventory:set-opts', { slot, opts: next });
    bus.emit('forge:enhanced', { id, reroll: true });
    const best = next.some((o) => o[2] >= data.config.affix.goodRoll);
    bus.emit('notify', { text: `${def.name} 재련 완료!${best ? ' ★ 좋은 옵션!' : ''}`, kind: 'item', color: data.items.grades[def.grade]?.color });
  }

  pay(cost) {
    const { bus, data } = this.ctx;
    const items = { items: cost.items, ok: false };
    bus.emit('inventory:spend', items);
    if (!items.ok) {
      bus.emit('notify', { text: `${josa(data.items.items[cost.items[0].id].name, '이/가')} 부족합니다`, kind: 'warn' });
      return false;
    }
    const gold = { amount: cost.gold, ok: false };
    bus.emit('economy:spend', gold);
    if (!gold.ok) {
      for (const c of cost.items) bus.emit('inventory:add', { item: c.id, count: c.count, taken: 0 });
      bus.emit('notify', { text: '골드가 부족합니다', kind: 'warn' });
      return false;
    }
    return true;
  }
}
