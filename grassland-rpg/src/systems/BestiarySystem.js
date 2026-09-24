// 몬스터 도감: 종류별 처치 수. 처음 잡으면 등록, 10/50/100마리마다 보상, 완성률 50%·100% 칭호·보상.
export class BestiarySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.bestiary;
    this.kills = {};
    this.claimed = {}; // type → 받은 마일스톤 수
    this.completion = 0; // 받은 완성 보상 수
    this.title = null;
    const { bus } = ctx;
    bus.on('monster:killed', ({ type }) => this.add(type)); // 스스로 터진 몬스터도 만난 셈으로 친다
    // 갈라지는 보스(왕슬라임)는 본체 처치 기록이 없으니 보스 처치로 등록
    bus.on('boss:defeated', ({ id }) => {
      const type = ctx.data.bosses[id]?.monster;
      if (type && !this.kills[type]) this.add(type);
    });
    bus.on('ending:stats', (s) => { s.kills = Object.values(this.kills).reduce((a, b) => a + b, 0); });
    bus.on('bestiary:open', () => bus.emit('bestiary:show', this.view()));
    bus.on('npc:talk', (talk) => {
      if (talk.npc.id === 'buheong') talk.options.push({ label: '몬스터 도감', event: 'bestiary:open' });
    });
    bus.on('game:new', () => { this.kills = {}; this.claimed = {}; this.completion = 0; this.setTitle(null); });
    bus.on('save:collect', (save) => { save.bestiary = { kills: { ...this.kills }, claimed: { ...this.claimed }, completion: this.completion, title: this.title }; });
    bus.on('save:apply', (save) => {
      const b = save.bestiary ?? {};
      this.kills = { ...(b.kills ?? {}) };
      this.claimed = { ...(b.claimed ?? {}) };
      this.completion = b.completion ?? 0;
      this.setTitle(b.title ?? null);
    });
  }

  // 도감에 실리는 몬스터 (bestiary: false 제외)
  entries() {
    return Object.entries(this.ctx.data.monsters).filter(([, d]) => d.bestiary !== false);
  }

  add(type) {
    const def = this.ctx.data.monsters[type];
    if (!def || def.bestiary === false) return;
    const { bus } = this.ctx;
    const first = !this.kills[type];
    this.kills[type] = (this.kills[type] ?? 0) + 1;
    if (first) bus.emit('notify', { text: `도감에 「${def.name}」 등록!`, kind: 'item' });
    // 처치 수 보상
    const ms = this.cfg.milestones;
    const got = this.claimed[type] ?? 0;
    if (got < ms.length && this.kills[type] >= ms[got].kills) {
      const m = ms[got];
      this.claimed[type] = got + 1;
      bus.emit('economy:reward', { amount: m.gold });
      const mat = this.material(def);
      if (mat) bus.emit('loot:spawn', { item: mat, count: m.material, position: this.ctx.player.position.clone() });
      bus.emit('notify', { text: `도감: ${def.name} ${m.kills}마리! 골드 +${m.gold}`, kind: 'gold' });
    }
    if (first) this.checkCompletion();
  }

  // 그 몬스터의 대표 재료 (드롭 중 첫 재료)
  material(def) {
    const items = this.ctx.data.items.items;
    return (def.drops ?? []).map((d) => d.item).find((id) => id && items[id]?.category === 'material') ?? null;
  }

  ratio() {
    const list = this.entries();
    return list.filter(([id]) => this.kills[id]).length / list.length;
  }

  checkCompletion() {
    const { bus, data } = this.ctx;
    const steps = this.cfg.completion;
    while (this.completion < steps.length && this.ratio() >= steps[this.completion].ratio) {
      const c = steps[this.completion];
      this.completion += 1;
      this.setTitle(c.title);
      if (c.gold) bus.emit('economy:reward', { amount: c.gold });
      if (c.item) bus.emit('loot:spawn', { item: c.item, count: 1, position: this.ctx.player.position.clone() });
      bus.emit('notify', { text: `도감 ${Math.round(c.ratio * 100)}% 달성! 칭호 「${c.title}」${c.item ? ` · ${data.items.items[c.item].name}` : ''}`, kind: 'item' });
    }
  }

  setTitle(t) {
    this.title = t;
    this.ctx.bus.emit('player:title', { title: t });
  }

  view() {
    return {
      ratio: this.ratio(),
      title: this.title,
      list: this.entries().map(([id, d]) => ({ id, name: d.name, color: d.color, lore: d.lore ?? '', kills: this.kills[id] ?? 0, boss: !!d.bossDrops || Object.values(this.ctx.data.bosses).some((b) => b.monster === id) })),
    };
  }
}
