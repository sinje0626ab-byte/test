// 골드. (상점은 Phase 6)
export class EconomySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.gold = 0;
    const { bus, data } = ctx;

    bus.on('loot:picked', ({ item, count }) => {
      if (data.items.items[item]?.category !== 'currency') return;
      this.change(count);
      bus.emit('notify', { text: `골드 +${count}`, kind: 'gold' });
    });

    bus.on('player:died', () => {
      const loss = Math.floor(this.gold * data.player.deathGoldLossRatio);
      if (loss <= 0) return;
      this.change(-loss);
      bus.emit('notify', { text: `쓰러져서 골드 ${loss}을(를) 잃었습니다`, kind: 'warn' });
    });
  }

  change(delta) {
    this.gold = Math.max(0, this.gold + delta);
    this.ctx.bus.emit('gold:changed', { gold: this.gold, delta });
  }
}
