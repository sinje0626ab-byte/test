import { enhancedBonus } from '../utils/enhance.js';

// 장비 슬롯 6개. 칸마다 { id, plus } 또는 null. 장착하면 가방 칸과 맞바꾸고, 해제하면 가방으로 돌려보낸다.
const SLOTS = ['weapon', 'head', 'body', 'feet', 'accessory1', 'accessory2'];

export class EquipmentSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.slots = Object.fromEntries(SLOTS.map((s) => [s, null]));
    const { bus } = ctx;

    bus.on('item:equip', ({ item, slot, plus }) => this.equip(item, slot, plus));
    bus.on('equipment:unequip', ({ slot }) => this.unequip(slot));
    // 대장간 강화
    bus.on('equipment:set-plus', ({ slot, plus }) => {
      if (!this.slots[slot]) return;
      this.slots[slot].plus = plus;
      this.changed();
    });
    bus.on('save:collect', (save) => {
      save.equipment = { slots: Object.fromEntries(SLOTS.map((s) => [s, this.slots[s] ? { ...this.slots[s] } : null])) };
    });
    bus.on('save:apply', (save) => {
      const saved = save.equipment?.slots ?? {};
      for (const s of SLOTS) {
        const v = saved[s];
        const e = typeof v === 'string' ? { id: v, plus: 0 } : v; // 예전 형식(문자열)도 받는다
        this.slots[s] = e && this.def(e.id) ? { id: e.id, plus: e.plus ?? 0 } : null;
      }
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

  equip(itemId, invSlot, plus = 0) {
    const def = this.def(itemId);
    if (def?.category !== 'equipment') return;
    const slot = this.targetSlot(def);
    const prev = this.slots[slot];
    this.slots[slot] = { id: itemId, plus };
    this.ctx.bus.emit('inventory:replace-slot', { slot: invSlot, item: prev });
    this.ctx.bus.emit('notify', { text: `${def.name}${plus ? ` +${plus}` : ''} 장착`, kind: 'item', color: this.ctx.data.items.grades[def.grade]?.color });
    this.changed();
  }

  unequip(slot) {
    const cur = this.slots[slot];
    if (!cur) return;
    const e = { item: cur.id, count: 1, taken: 0, plus: cur.plus };
    this.ctx.bus.emit('inventory:add', e);
    if (!e.taken) {
      this.ctx.bus.emit('notify', { text: '가방이 가득 차서 해제할 수 없습니다', kind: 'warn' });
      return;
    }
    this.slots[slot] = null;
    this.changed();
  }

  // slots: 슬롯 → 아이템 id (예전처럼), plus: 슬롯 → 강화 단계
  changed() {
    const { data } = this.ctx;
    const bonus = {};
    const add = (b) => { for (const [k, v] of Object.entries(b ?? {})) bonus[k] = (bonus[k] ?? 0) + v; };
    for (const e of Object.values(this.slots)) if (e) add(enhancedBonus(data, this.def(e.id).bonus, e.plus));
    const ids = Object.fromEntries(SLOTS.map((s) => [s, this.slots[s]?.id ?? null]));
    const plus = Object.fromEntries(SLOTS.map((s) => [s, this.slots[s]?.plus ?? 0]));
    // 세트: 머리·몸·발을 모두 같은 지역 세트로 끼면 보너스
    const worn = new Set(Object.values(ids));
    const sets = Object.entries(data.items.sets).map(([id, set]) => {
      const have = set.pieces.filter((p) => worn.has(p)).length;
      if (have === set.pieces.length) add(set.bonus);
      return { id, name: set.name, have, total: set.pieces.length, bonus: set.bonus };
    });
    this.ctx.bus.emit('equipment:changed', { slots: ids, plus, bonus, sets });
  }
}
