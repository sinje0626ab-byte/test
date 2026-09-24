// 스킬 랭크와 효과 합계. 선행 스킬(requires)이 있어야 배울 수 있다.
export class SkillSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.defs = ctx.data.skills.skills;
    this.ranks = {};
    const { bus } = ctx;

    bus.on('skill:learn', ({ id }) => this.learn(id));
    bus.on('save:collect', (save) => { save.skills = { ranks: { ...this.ranks } }; });
    bus.on('save:apply', (save) => {
      this.ranks = {};
      for (const [id, r] of Object.entries(save.skills?.ranks ?? {})) {
        if (this.defs[id]) this.ranks[id] = Math.min(r, this.defs[id].maxRank);
      }
      this.changed();
    });
  }

  rank(id) {
    return this.ranks[id] ?? 0;
  }

  // 배울 수 없으면 이유 문자열, 배울 수 있으면 null
  blockReason(id) {
    const def = this.defs[id];
    if (this.rank(id) >= def.maxRank) return '최대 랭크';
    for (const req of def.requires) {
      if (this.rank(req.id) < req.rank) return `${this.defs[req.id].name} ${req.rank}랭크 필요`;
    }
    return null;
  }

  learn(id) {
    const def = this.defs[id];
    if (!def || this.blockReason(id)) return;
    const spend = { ok: false };
    this.ctx.bus.emit('stats:spend-point', spend);
    if (!spend.ok) {
      this.ctx.bus.emit('notify', { text: '스킬 포인트가 없습니다', kind: 'warn' });
      return;
    }
    this.ranks[id] = this.rank(id) + 1;
    this.ctx.bus.emit('notify', { text: `${def.name} ${this.ranks[id]}랭크!`, kind: 'item' });
    this.changed();
  }

  changed() {
    const effects = {};
    for (const [id, r] of Object.entries(this.ranks)) {
      for (const [k, v] of Object.entries(this.defs[id].effects)) effects[k] = (effects[k] ?? 0) + v * r;
    }
    const blocked = Object.fromEntries(Object.keys(this.defs).map((id) => [id, this.blockReason(id)]));
    this.ctx.bus.emit('skills:changed', { ranks: this.ranks, effects, blocked });
  }
}
