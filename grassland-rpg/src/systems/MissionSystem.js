import { josa } from '../utils/josa.js';

// 매일·주간 임무와 출석 (config.missions). 날짜는 기기의 실제 날짜 — 하루가 바뀌면 매일 임무 3개, 월요일이면 주간 임무 3개를 새로 뽑는다.
// 임무마다 보상(골드 + 상자), 다 하면 보너스 상자. 출석은 하루 한 번 도장 → 7일째 황금 상자, 다시 1일째부터 (빠진 날이 있어도 이어서)
// 진행은 이벤트로 센다 (처치·채집·상자·습격·의뢰·골드·제작·대장간·소모품). 저장 missions
const pad = (n) => String(n).padStart(2, '0');
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const weekKey = (d = new Date()) => {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  return dateKey(m);
};
// 날짜 글자 → 시드 난수 (같은 날이면 같은 임무)
function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export class MissionSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.missions;
    this.state = this.empty();
    this.timer = 0;
    this.now = () => new Date(); // 시험용으로 바꿀 수 있다
    const { bus } = ctx;
    const add = (type, n = 1) => this.progress(type, n);
    bus.on('monster:killed', (e) => {
      add('kill');
      if (e.elite) add('elite');
      if (e.boss) add('boss');
      if (e.type === ctx.data.config.chests?.mimicType) add('chest');
    });
    bus.on('gather:done', () => add('gather'));
    bus.on('chest:opened', () => add('chest'));
    bus.on('raid:result', ({ results }) => add('raid', (results ?? []).filter((r) => r.status === 'cleared').length));
    bus.on('bounty:claimed', () => add('bounty'));
    bus.on('gold:changed', ({ delta }) => { if (delta > 0 && !this.paying) add('gold', delta); });
    bus.on('craft:done', () => add('craft'));
    bus.on('forge:enhanced', () => add('forge'));
    bus.on('item:used', () => add('consume'));

    bus.on('mission:claim', ({ kind, index }) => this.claim(kind, index));
    bus.on('mission:claim-bonus', ({ kind }) => this.claimBonus(kind));
    bus.on('mission:attend', () => this.attend());
    bus.on('mission:refresh', () => this.changed());

    bus.on('game:new', () => { this.state = this.empty(); this.refresh(true); });
    bus.on('save:collect', (save) => { save.missions = JSON.parse(JSON.stringify(this.state)); });
    bus.on('save:apply', (save) => {
      this.state = { ...this.empty(), ...(save.missions ?? {}) };
      this.refresh(true);
    });
  }

  empty() {
    return { date: null, daily: [], dailyBonus: false, week: null, weekly: [], weeklyBonus: false, att: { count: 0, last: null } };
  }

  pick(list, n, seed) {
    const r = seeded(seed);
    const pool = [...list];
    const out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
    return out.map((m) => ({ type: m.type, target: m.target, text: m.text.replace('{n}', m.target), progress: 0, claimed: false }));
  }

  // 날짜가 바뀌었으면 새 임무
  refresh(force = false) {
    const d = this.now();
    const today = dateKey(d);
    const week = weekKey(d);
    let changed = force;
    if (this.state.date !== today) {
      this.state.date = today;
      this.state.daily = this.pick(this.cfg.daily, this.cfg.dailyCount, `d${today}`);
      this.state.dailyBonus = false;
      changed = true;
      this.ctx.bus.emit('mission:new-day', { attend: this.canAttend() });
    }
    if (this.state.week !== week) {
      this.state.week = week;
      this.state.weekly = this.pick(this.cfg.weekly, this.cfg.weeklyCount, `w${week}`);
      this.state.weeklyBonus = false;
      changed = true;
    }
    if (changed) this.changed();
  }

  canAttend() {
    return this.state.att.last !== dateKey(this.now());
  }

  progress(type, n) {
    if (!n) return;
    let touched = false;
    for (const list of [this.state.daily, this.state.weekly]) {
      for (const m of list) {
        if (m.type !== type || m.progress >= m.target) continue;
        m.progress = Math.min(m.target, m.progress + n);
        touched = true;
        if (m.progress >= m.target) this.ctx.bus.emit('notify', { text: `임무 완료! 「${m.text}」 — 임무 창(J)에서 보상 받기`, kind: 'item' });
      }
    }
    if (touched) this.changed();
  }

  reward(kind) {
    const r = kind === 'daily' ? this.cfg.dailyReward : this.cfg.weeklyReward;
    const lv = this.ctx.player.stats?.level ?? 1;
    return { gold: r.gold[0] + r.gold[1] * lv, item: r.item, count: 1 };
  }

  claim(kind, index) {
    const m = this.state[kind]?.[index];
    if (!m || m.claimed || m.progress < m.target) return;
    m.claimed = true;
    this.give(this.reward(kind));
    this.changed();
  }

  claimBonus(kind) {
    const list = this.state[kind];
    const key = `${kind}Bonus`;
    if (this.state[key] || !list.length || !list.every((m) => m.claimed)) return;
    this.state[key] = true;
    this.give({ ...(kind === 'daily' ? this.cfg.dailyAllReward : this.cfg.weeklyAllReward), count: 1 });
    this.changed();
  }

  attend() {
    if (!this.canAttend()) return;
    const a = this.state.att;
    const day = (a.count % this.cfg.attendance.length) + 1;
    a.count += 1;
    a.last = dateKey(this.now());
    this.give(this.cfg.attendance[day - 1]);
    this.ctx.bus.emit('mission:attended', { day });
    this.changed();
  }

  // 보상 주기: 골드는 바로, 아이템은 가방에 (자리가 없으면 발밑에)
  give({ gold, item, count = 1 }) {
    const { bus, data } = this.ctx;
    if (gold) {
      this.paying = true; // 임무 보상 골드는 '골드 벌기' 임무에 세지 않는다
      bus.emit('economy:reward', { amount: gold });
      this.paying = false;
      bus.emit('notify', { text: `보상: 골드 +${gold}`, kind: 'gold' });
    }
    if (item) {
      const e = { item, count, taken: 0 };
      bus.emit('inventory:add', e);
      if (e.taken < count) bus.emit('loot:spawn', { item, count: count - e.taken, position: this.ctx.player.position.clone() });
      bus.emit('notify', { text: `보상: ${josa(data.items.items[item].name, '을/를')} 받았어요${count > 1 ? ` ×${count}` : ''}`, kind: 'item', color: data.items.grades[data.items.items[item].grade]?.color });
    }
  }

  // 받을 수 있는 보상 수 (HUD 빨간 점)
  ready() {
    const s = this.state;
    let n = this.canAttend() ? 1 : 0;
    for (const kind of ['daily', 'weekly']) {
      n += s[kind].filter((m) => !m.claimed && m.progress >= m.target).length;
      if (!s[`${kind}Bonus`] && s[kind].length && s[kind].every((m) => m.claimed)) n += 1;
    }
    return n;
  }

  changed() {
    this.ctx.bus.emit('mission:changed', { state: this.state, ready: this.ready(), canAttend: this.canAttend(), rewards: { daily: this.reward('daily'), weekly: this.reward('weekly') } });
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 20; // 자정이 지나면 새 임무 (켜 둔 채로도)
    this.refresh();
  }
}
