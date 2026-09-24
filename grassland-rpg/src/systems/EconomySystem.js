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

    bus.on('save:collect', (save) => { save.economy = { gold: this.gold }; });
    bus.on('save:apply', (save) => {
      this.gold = 0;
      this.change(save.economy?.gold ?? 0);
    });
  }

  change(delta) {
    this.gold = Math.max(0, this.gold + delta);
    this.ctx.bus.emit('gold:changed', { gold: this.gold, delta });
  }
}
