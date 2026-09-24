// 골드. (상점은 Phase 6)
export class EconomySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.gold = 0;
    const { bus, data } = ctx;

    bus.on('loot:picked', (e) => {
      const { item, count } = e;
      if (data.items.items[item]?.category !== 'currency') return;
      e.taken += count;
      this.change(count);
      bus.emit('notify', { text: `골드 +${count}`, kind: 'gold' });
    });

    bus.on('player:died', () => {
      const loss = Math.floor(this.gold * data.player.deathGoldLossRatio);
      if (loss <= 0) return;
      this.change(-loss);
      bus.emit('notify', { text: `쓰러져서 골드 ${loss}을(를) 잃었습니다`, kind: 'warn' });
    });

    // 포탑 설치 등: 골드가 충분하면 빼고 ok = true
    bus.on('economy:spend', (e) => {
      if (this.gold < e.amount) return;
      this.change(-e.amount);
      e.ok = true;
    });
    bus.on('economy:reward', ({ amount }) => this.change(amount));
    bus.on('economy:lose', ({ ratio, text }) => {
      const loss = Math.floor(this.gold * ratio);
      if (loss > 0) this.change(-loss);
      bus.emit('notify', { text: loss > 0 ? `${text} (-${loss})` : text, kind: 'warn' });
    });

    bus.on('shop:buy', ({ id }) => this.buy(id));
    bus.on('shop:sell', ({ slot, count }) => this.sell(slot, count));

    bus.on('save:collect', (save) => { save.economy = { gold: this.gold }; });
    bus.on('save:apply', (save) => {
      this.gold = 0;
      this.change(save.economy?.gold ?? 0);
    });
  }

  buy(id) {
    const { bus, data } = this.ctx;
    const entry = data.shop.buy.find((b) => b.id === id);
    if (!entry) return;
    const name = data.items.items[id].name;
    if (this.gold < entry.price) {
      bus.emit('notify', { text: `골드가 부족합니다 (${entry.price} 필요)`, kind: 'warn' });
      return;
    }
    const room = { item: id, count: 1, ok: false };
    bus.emit('inventory:can-add', room);
    if (!room.ok) {
      bus.emit('notify', { text: '가방에 자리가 없습니다', kind: 'warn' });
      return;
    }
    this.change(-entry.price);
    bus.emit('inventory:add', { item: id, count: 1, taken: 0 });
    bus.emit('notify', { text: `${name} 구매 (-${entry.price})`, kind: 'gold' });
  }

  // 가방 칸에서 count개 판다 (칸을 꺼냈다가 남는 건 되돌린다)
  sell(slot, count) {
    const { bus, data } = this.ctx;
    const take = { slot, item: null };
    bus.emit('inventory:take-slot', take);
    if (!take.item) return;
    const { id } = take.item;
    const value = data.items.items[id].value ?? 0;
    const n = Math.min(count, take.item.count);
    if (take.item.count > n) bus.emit('inventory:add', { item: id, count: take.item.count - n, taken: 0, plus: take.item.plus ?? 0 });
    this.change(value * n);
    bus.emit('notify', { text: `${data.items.items[id].name} ${n}개 판매 (+${value * n})`, kind: 'gold' });
  }

  change(delta) {
    this.gold = Math.max(0, this.gold + delta);
    this.ctx.bus.emit('gold:changed', { gold: this.gold, delta });
  }
}
