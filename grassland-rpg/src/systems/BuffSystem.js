// 소모품 버프: { id → 남은 초, 효과 }. 같은 버프는 겹치지 않고 시간만 새로 한다.
export class BuffSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.buffs = new Map();
    this.emitTimer = 0;
    ctx.bus.on('item:use', (e) => {
      const def = ctx.data.items.items[e.item];
      const b = def?.use?.buff;
      if (!b) return;
      this.buffs.set(b.id, { id: b.id, name: def.name, color: def.color, time: b.duration, duration: b.duration, effects: b.effects });
      e.used = true;
      this.changed();
    });
    ctx.bus.on('player:died', () => { this.buffs.clear(); this.changed(); });
  }

  changed() {
    const effects = {};
    for (const b of this.buffs.values()) {
      for (const [k, v] of Object.entries(b.effects)) effects[k] = (effects[k] ?? 0) + v;
    }
    this.ctx.bus.emit('buffs:changed', { effects, list: [...this.buffs.values()] });
  }

  update(dt) {
    if (!this.buffs.size) return;
    let ended = false;
    for (const [id, b] of this.buffs) {
      b.time -= dt;
      if (b.time <= 0) { this.buffs.delete(id); ended = true; }
    }
    // 효과가 끝나면 바로, 아니면 HUD 초 표시용으로 가끔
    this.emitTimer -= dt;
    if (ended || this.emitTimer <= 0) {
      this.emitTimer = 0.5;
      this.changed();
    }
  }
}
