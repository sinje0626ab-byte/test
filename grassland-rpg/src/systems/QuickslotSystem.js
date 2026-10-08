import { josa } from '../utils/josa.js';

// 퀵슬롯 5칸 (숫자키 1~5): 가방에서 끌어다 놓아 등록한다. 소모품은 쓰고, 장비(무기 등)는 바로 바꿔 낀다.
// - 칸에는 아이템 종류(id)만 기억한다. 개수는 가방에서 센다 (0개면 흐리게)
// - 새 소모품을 처음 얻으면 빈 칸에 알아서 들어간다 (예전처럼 편하게)
// 이벤트: quick:set {index, item} · quick:clear {index} · quick:swap {from, to} · quick:use {index} → quick:changed {slots}
export class QuickslotSystem {
  constructor(ctx) {
    this.ctx = ctx;
    const n = ctx.data.config.quickslots;
    this.slots = Array(n).fill(null);
    this.known = new Set(); // 가방에 있던 소모품 종류 (새로 생긴 것만 자동 등록)
    this.ready = false; // 처음 가방 내용은 자동 등록하되, 불러온 저장의 칸 배치는 존중
    const { bus } = ctx;
    bus.on('quick:set', ({ index, item }) => {
      if (!this.allowed(item) || index < 0 || index >= n) return;
      const old = this.slots.indexOf(item);
      if (old >= 0) this.slots[old] = this.slots[index]; // 이미 다른 칸에 있으면 자리를 바꾼다
      this.slots[index] = item;
      this.changed();
    });
    bus.on('quick:clear', ({ index }) => { this.slots[index] = null; this.changed(); });
    bus.on('quick:swap', ({ from, to }) => {
      [this.slots[from], this.slots[to]] = [this.slots[to], this.slots[from]];
      this.changed();
    });
    // 가방 창의 '퀵슬롯' 버튼 (모바일): 빈 칸 맨 앞에
    bus.on('quick:add', ({ item }) => {
      if (!this.allowed(item) || this.slots.includes(item)) return;
      const i = this.slots.indexOf(null);
      if (i < 0) {
        bus.emit('notify', { text: '퀵슬롯이 가득 찼어요 (칸을 밖으로 끌어 비우세요)', kind: 'warn' });
        return;
      }
      this.slots[i] = item;
      this.changed();
    });
    bus.on('quick:use', ({ index }) => this.use(index));
    bus.on('inventory:changed', ({ slots }) => this.onInventory(slots));
    bus.on('game:new', () => { this.slots.fill(null); this.ready = false; this.known.clear(); });
    bus.on('save:collect', (save) => { save.quickslots = [...this.slots]; });
    bus.on('save:apply', (save) => {
      if (!Array.isArray(save.quickslots)) return; // 예전 저장: 처음 가방 내용으로 채운다
      this.slots = Array.from({ length: n }, (_, i) => (this.allowed(save.quickslots[i]) ? save.quickslots[i] : null));
      this.ready = true;
      this.firstFill = false;
      this.changed();
    });
  }

  allowed(id) {
    const def = id && this.ctx.data.items.items[id];
    return !!def && (def.category === 'consumable' || def.category === 'equipment');
  }

  onInventory(slots) {
    const items = this.ctx.data.items.items;
    const now = new Set(slots.filter((s) => s && items[s.id].category === 'consumable').map((s) => s.id));
    let added = false;
    for (const id of now) {
      if (this.known.has(id) && this.ready) continue;
      if (!this.slots.includes(id)) {
        const i = this.slots.indexOf(null);
        if (i >= 0) { this.slots[i] = id; added = true; }
      }
    }
    this.known = now;
    this.ready = true;
    if (added) this.changed();
  }

  use(index) {
    const id = this.slots[index];
    if (!id) return;
    const { bus, data } = this.ctx;
    const def = data.items.items[id];
    if (def.category === 'consumable') {
      bus.emit('inventory:use-item', { item: id });
      return;
    }
    // 장비: 가방에서 가장 많이 강화된 것을 낀다
    const inv = { slots: null };
    bus.emit('inventory:peek', inv);
    let best = -1;
    inv.slots?.forEach((s, i) => { if (s?.id === id && (best < 0 || (s.plus ?? 0) > (inv.slots[best].plus ?? 0))) best = i; });
    if (best >= 0) bus.emit('inventory:use', { slot: best });
    else bus.emit('notify', { text: this.equipped(id) ? `${josa(def.name, '은/는')} 이미 끼고 있어요` : `${josa(def.name, '이/가')} 가방에 없어요`, kind: 'info' });
  }

  equipped(id) {
    const e = { slots: null };
    this.ctx.bus.emit('equipment:peek', e);
    return Object.values(e.slots ?? {}).some((s) => s?.id === id);
  }

  changed() {
    this.ctx.bus.emit('quick:changed', { slots: [...this.slots] });
  }
}
