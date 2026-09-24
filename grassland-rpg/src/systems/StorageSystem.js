import { maxStackOf, addTo } from '../utils/slots.js';

// 기지별 창고. 기지 id → 칸 목록
export class StorageSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.storages = new Map();
    const { bus } = ctx;

    bus.on('storage:deposit', ({ baseId, slot }) => this.deposit(baseId, slot));
    bus.on('storage:withdraw', ({ baseId, slot }) => this.withdraw(baseId, slot));
    bus.on('storage:request', ({ baseId }) => this.changed(baseId));
    // 습격 실패: 창고가 있으면 재료 일부를 잃는다.
    bus.on('storage:lose', (e) => {
      if (!this.hasStorage(e.baseId)) return;
      e.handled = true;
      const slots = this.get(e.baseId);
      let lost = 0;
      for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        if (!s || ctx.data.items.items[s.id].category !== 'material') continue;
        const n = Math.ceil(s.count * e.ratio);
        s.count -= n;
        lost += n;
        if (s.count <= 0) slots[i] = null;
      }
      e.lost = lost;
      this.changed(e.baseId);
    });
    bus.on('save:collect', (save) => {
      save.storages = Object.fromEntries([...this.storages].map(([id, slots]) => [id, slots.map((s) => (s ? { ...s } : null))]));
    });
    bus.on('save:apply', (save) => {
      for (const [id, slots] of Object.entries(save.storages ?? {})) {
        const list = this.get(Number(id));
        slots.forEach((s, i) => { if (s && ctx.data.items.items[s.id] && i < list.length) list[i] = { ...s }; });
      }
    });
  }

  hasStorage(baseId) {
    return this.ctx.structures.some((s) => s.kind === 'facility' && s.type === 'storage' && s.baseId === baseId);
  }

  get(baseId) {
    if (!this.storages.has(baseId)) {
      this.storages.set(baseId, new Array(this.ctx.data.buildings.buildings.storage.slots).fill(null));
    }
    return this.storages.get(baseId);
  }

  // 가방 칸 → 창고 (다 안 들어가면 남은 건 가방으로 되돌린다)
  deposit(baseId, slot) {
    const { bus, data } = this.ctx;
    const take = { slot, item: null };
    bus.emit('inventory:take-slot', take);
    if (!take.item) return;
    const { id, count } = take.item;
    const put = addTo(this.get(baseId), id, count, maxStackOf(data, id));
    if (put < count) {
      bus.emit('inventory:add', { item: id, count: count - put, taken: 0 });
      bus.emit('notify', { text: '창고가 가득 찼습니다', kind: 'warn' });
    }
    this.changed(baseId);
  }

  // 창고 칸 → 가방 (가방에 들어간 만큼만)
  withdraw(baseId, slot) {
    const slots = this.get(baseId);
    const s = slots[slot];
    if (!s) return;
    const e = { item: s.id, count: s.count, taken: 0 };
    this.ctx.bus.emit('inventory:add', e);
    if (!e.taken) this.ctx.bus.emit('notify', { text: '가방이 가득 찼습니다', kind: 'warn' });
    s.count -= e.taken;
    if (s.count <= 0) slots[slot] = null;
    this.changed(baseId);
  }

  changed(baseId) {
    this.ctx.bus.emit('storage:changed', { baseId, slots: this.get(baseId) });
  }
}
