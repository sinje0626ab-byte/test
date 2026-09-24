// 메인 퀘스트 (quests.json): 하나씩 차례로. 조건을 채우면 부엉 박사에게 보고 → 보상 → 다음.
// 설계도 해금은 ctx.unlocks(Set)에 넣는다 (건설 창·건설이 읽는다).
export class QuestSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.list = ctx.data.quests.quests;
    this.index = 0;
    this.ready = false; // 조건을 채웠는지 (보고 대기)
    this.flags = {};
    this.cleared = new Set(); // 처치해 본 보스
    ctx.unlocks = new Set();
    const { bus } = ctx;

    bus.on('raid:result', ({ results }) => {
      if (results.some((r) => r.status === 'cleared')) { this.flags.raidCleared = true; this.check(); }
    });
    bus.on('boss:status', ({ list }) => {
      for (const b of list) if (b.cleared) this.cleared.add(b.id);
      this.check();
    });
    bus.on('boss:defeated', ({ id }) => { this.cleared.add(id); this.check(); });
    bus.on('base:created', () => this.check());
    bus.on('npc:talk', (talk) => this.onTalk(talk));
    bus.on('quest:report', () => this.report());
    bus.on('game:new', () => { this.index = 0; this.ready = false; this.flags = {}; this.changed(); });
    bus.on('save:collect', (save) => {
      save.quests = { index: this.index, ready: this.ready, flags: { ...this.flags }, unlocks: [...ctx.unlocks] };
    });
    bus.on('save:apply', (save) => {
      const q = save.quests;
      if (q) {
        this.index = q.index;
        this.ready = q.ready;
        this.flags = { ...q.flags };
        ctx.unlocks = new Set(q.unlocks);
      } else {
        this.fastForward = true; // 예전 저장: 이미 이룬 것은 건너뛴다 (해금만 챙김)
      }
    });
    bus.on('save:loaded', () => {
      if (this.fastForward) this.skipDone();
      this.fastForward = false;
      this.check();
      this.changed();
    });
  }

  get current() {
    return this.list[this.index] ?? null;
  }

  met(q) {
    const { ctx } = this;
    const c = q.cond;
    switch (c.type) {
      case 'bases': return ctx.bases.length >= c.count;
      case 'raidCleared': return !!this.flags.raidCleared || (this.fastForward && ctx.time.day > 2);
      case 'boss': return this.cleared.has(c.id);
      case 'baseInRegion': return ctx.bases.some((b) => b.region.id === c.region);
      default: return false;
    }
  }

  skipDone() {
    while (this.current && this.met(this.current)) {
      if (this.current.reward.unlock) this.ctx.unlocks.add(this.current.reward.unlock);
      this.index += 1;
    }
    this.ready = false;
  }

  check() {
    const q = this.current;
    if (!q || this.ready || !this.met(q)) return;
    this.ready = true;
    this.ctx.bus.emit('notify', { text: `퀘스트 「${q.title}」 완료! 부엉 박사에게 보고하세요`, kind: 'item' });
    this.changed();
  }

  // 부엉 박사 대화: 지금 목표를 알려 주고, 다 했으면 "보고하기"
  onTalk(talk) {
    if (talk.npc.id !== 'buheong') return;
    const q = this.current;
    if (!q) {
      talk.lines.push('모든 연구를 마쳤군요. 이제 느긋하게 초원을 즐기시게.');
      return;
    }
    if (this.ready) {
      talk.lines.push(`「${q.title}」을(를) 해냈군요!`);
      talk.options.unshift({ label: '보고하기', event: 'quest:report' });
    } else {
      talk.lines.push(`지금 부탁할 일은 「${q.title}」 — ${q.goal}.`);
    }
  }

  report() {
    const q = this.current;
    if (!q || !this.ready) return;
    const { bus, data } = this.ctx;
    const r = q.reward;
    if (r.gold) bus.emit('economy:reward', { amount: r.gold });
    for (const it of r.items ?? []) {
      const e = { item: it.id, count: it.count, taken: 0 };
      bus.emit('inventory:add', e);
      if (e.taken < it.count) bus.emit('loot:spawn', { item: it.id, count: it.count - e.taken, position: this.ctx.player.position.clone() });
    }
    if (r.unlock) {
      this.ctx.unlocks.add(r.unlock);
      bus.emit('notify', { text: `${data.buildings.buildings[r.unlock].name} 설계도를 얻었어요! (건설 창)`, kind: 'item' });
    }
    bus.emit('quest:completed', { id: q.id });
    bus.emit('dialogue:open', { npc: this.ctx.npcs.find((n) => n.id === 'buheong'), lines: [q.talk], options: [{ label: '고마워요', event: null }] });
    this.index += 1;
    this.ready = false;
    this.check();
    this.changed();
  }

  changed() {
    const q = this.current;
    this.ctx.bus.emit('quest:changed', q ? { title: q.title, goal: this.ready ? this.ctx.data.quests.trackerDone : q.goal, ready: this.ready, index: this.index, target: this.target(q) } : { title: null });
  }

  // 미니맵 목표 자리: 보고할 땐 부엉 박사, 보스 퀘스트면 둥지
  target(q) {
    if (this.ready) {
      const owl = this.ctx.npcs?.find((n) => n.id === 'buheong');
      return owl ? [owl.anchor.x, owl.anchor.z] : null;
    }
    const lair = q.cond.type === 'boss' && this.ctx.data.bosses[q.cond.id]?.lair;
    return lair ?? null;
  }
}
