import { rand } from '../utils/random.js';

// 현상금 게시판: 매일 아침 의뢰 3개 (bounties.json). 처치·납품·정예. 보상은 골드 + 가끔 수정·귀환 두루마리.
// 목표 수는 게시판이 있는 기지 지역의 난이도를 따른다.
export class BountySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.bounties;
    this.list = [];
    this.day = 0;
    this.counts = {};
    const { bus } = ctx;
    bus.on('time:day', ({ day }) => this.roll(day));
    bus.on('facility:changed', () => { if (!this.list.length && this.boardRegion()) this.roll(ctx.time.day); });
    bus.on('monster:killed', ({ type, elite, noLoot }) => {
      if (noLoot) return;
      for (const b of this.list) {
        if (b.claimed) continue;
        if ((b.type === 'kill' && b.monster === type) || (b.type === 'elite' && elite)) b.progress = Math.min(b.count, b.progress + 1);
      }
      this.changed();
    });
    bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
      this.changed();
    });
    bus.on('interact:facility', ({ facility }) => { if (facility.type === 'board') bus.emit('bounty:show', { facility }); });
    bus.on('bounty:claim', ({ index }) => this.claim(index));
    bus.on('save:collect', (save) => { save.bounties = { day: this.day, list: this.list.map((b) => ({ ...b })) }; });
    bus.on('save:apply', (save) => {
      this.day = save.bounties?.day ?? 0;
      this.list = (save.bounties?.list ?? []).map((b) => ({ ...b }));
    });
  }

  // 게시판이 있는 기지들의 지역 중 하나
  boardRegion() {
    const { ctx } = this;
    const boards = ctx.structures.filter((s) => s.kind === 'facility' && s.type === 'board');
    if (!boards.length) return null;
    const base = ctx.bases.find((b) => b.id === rand.pick(boards).baseId);
    return base?.region ?? null;
  }

  roll(day) {
    const region = this.boardRegion();
    if (!region) return;
    const c = this.cfg;
    this.day = day;
    const kinds = ['kill', 'deliver', rand.range(0, 1) < 0.5 ? 'elite' : 'kill'];
    this.list = kinds.slice(0, c.perDay).map((kind) => {
      let b;
      if (kind === 'kill') {
        const monster = rand.pick(region.monsters);
        const count = c.kill.countBase + region.difficulty * c.kill.countPerDifficulty;
        b = { type: 'kill', monster, count, gold: count * c.kill.goldPerKill * region.difficulty };
      } else if (kind === 'deliver') {
        const d = rand.pick(c.deliver);
        b = { type: 'deliver', item: d.item, count: d.count, gold: d.gold };
      } else {
        b = { type: 'elite', count: c.elite.count, gold: c.elite.gold * region.difficulty };
      }
      if (rand.range(0, 1) < c.bonusChance) b.bonus = rand.pick(c.bonusItems);
      return { ...b, progress: 0, claimed: false };
    });
    this.ctx.bus.emit('notify', { text: '게시판에 새 의뢰가 붙었어요!', kind: 'item' });
    this.changed();
  }

  // 달성했나 (납품은 가방에 있는지)
  complete(b) {
    return b.type === 'deliver' ? (this.counts[b.item] ?? 0) >= b.count : b.progress >= b.count;
  }

  claim(i) {
    const b = this.list[i];
    const { bus } = this.ctx;
    if (!b || b.claimed || !this.complete(b)) return;
    if (b.type === 'deliver') {
      const spend = { items: [{ id: b.item, count: b.count }], ok: false };
      bus.emit('inventory:spend', spend);
      if (!spend.ok) return;
    }
    b.claimed = true;
    bus.emit('economy:reward', { amount: b.gold });
    if (b.bonus) bus.emit('loot:spawn', { item: b.bonus, count: 1, position: this.ctx.player.position.clone() });
    bus.emit('notify', { text: `의뢰 완료! 골드 +${b.gold}`, kind: 'gold' });
    bus.emit('bounty:claimed', { bounty: b });
    this.changed();
  }

  changed() {
    this.ctx.bus.emit('bounty:changed', { list: this.list.map((b) => ({ ...b, done: this.complete(b) })), have: this.counts });
  }
}
