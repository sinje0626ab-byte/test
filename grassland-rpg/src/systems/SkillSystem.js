// 스킬 랭크와 효과 합계. 선행 스킬(requires)이 있어야 배울 수 있다.
// 핵심 별(keystone): 셋 중 하나만, 그 갈래에 포인트 requiresSpent 이상 써야 한다.
export class SkillSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.defs = ctx.data.skills.skills;
    this.ranks = {};
    const { bus } = ctx;

    bus.on('skill:learn', ({ id }) => this.learn(id));
    // 망각의 물약: 스킬을 모두 잊고 포인트를 돌려받는다
    bus.on('item:use', (e) => {
      if (!ctx.data.items.items[e.item]?.use?.resetSkills) return;
      const spent = Object.values(this.ranks).reduce((a, b) => a + b, 0);
      if (!spent) {
        bus.emit('notify', { text: '잊을 스킬이 없어요', kind: 'warn' });
        return;
      }
      e.used = true;
      this.ranks = {};
      bus.emit('stats:refund-points', { count: spent });
      bus.emit('notify', { text: `스킬을 모두 잊었어요. 포인트 ${spent} 돌려받음`, kind: 'item' });
      this.changed();
    });
    bus.on('save:collect', (save) => { save.skills = { ...(save.skills ?? {}), ranks: { ...this.ranks } }; });
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

  // 그 갈래에 쓴 포인트
  spentIn(branch) {
    return Object.entries(this.ranks).reduce((t, [id, r]) => t + (this.defs[id]?.branch === branch ? r : 0), 0);
  }

  // 배울 수 없으면 이유 문자열, 배울 수 있으면 null
  blockReason(id) {
    const def = this.defs[id];
    if (this.rank(id) >= def.maxRank) return '최대 랭크';
    // 핵심 별: 셋 중 하나만, 그 갈래에 포인트 requiresSpent 이상
    if (def.keystone) {
      const other = Object.keys(this.ranks).find((k) => this.ranks[k] && this.defs[k]?.keystone && k !== id);
      if (other) return `핵심 별은 하나만 (${this.defs[other].name})`;
    }
    if (def.requiresSpent && this.spentIn(def.branch) < def.requiresSpent) return `이 별자리에 포인트 ${def.requiresSpent} 필요 (${this.spentIn(def.branch)})`;
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
