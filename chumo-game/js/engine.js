// 게임 규칙만 담당한다. 화면(DOM)은 모른다.

import { STATS, STAT_MIN, STAT_MAX, STAT_START, RECENT_WINDOW } from './config.js';

export class Game {
  constructor(content, random = Math.random) {
    this.cards = content.cards;
    this.byId = new Map(this.cards.map((c) => [c.id, c]));
    this.endings = content.endings;
    this.random = random;
  }

  start() {
    this.stats = Object.fromEntries(STATS.map((s) => [s.key, STAT_START]));
    this.flags = new Set();
    this.used = new Set();
    this.recent = [];
    this.days = 0;
    this.pendingNext = null;
    this.ending = null;
    this.current = this.draw();
  }

  // 선택하면 영향을 받는 수치 목록 (크기는 알려 주지 않는다)
  affected(side) {
    return Object.keys(this.current[side].effects);
  }

  choose(side) {
    const card = this.current;
    const choice = card[side];
    const changes = {};
    for (const [k, v] of Object.entries(choice.effects)) {
      const before = this.stats[k];
      this.stats[k] = Math.min(STAT_MAX, Math.max(STAT_MIN, before + v));
      changes[k] = this.stats[k] - before;
    }
    choice.clearFlags.forEach((f) => this.flags.delete(f));
    choice.setFlags.forEach((f) => this.flags.add(f));
    if (card.once) this.used.add(card.id);
    this.recent.push(card.id);
    if (this.recent.length > RECENT_WINDOW) this.recent.shift();

    this.ending = this.checkEnding();
    if (this.ending) return { changes, ending: this.ending };

    this.days += 1;
    this.pendingNext = choice.next;
    this.current = this.draw();
    return { changes, ending: null };
  }

  checkEnding() {
    for (const { key } of STATS) {
      const v = this.stats[key];
      if (v > STAT_MIN && v < STAT_MAX) continue;
      const at = v <= STAT_MIN ? STAT_MIN : STAT_MAX;
      const found = this.endings.get(`${key}:${at}`);
      return found || {
        stat: key,
        at,
        title: '임기 종료',
        text: `${key} 수치가 ${at}에 이르러 임기를 마칩니다.`,
        image: '',
      };
    }
    return null;
  }

  isEligible(card, { ignoreRecent = false, ignoreOnce = false } = {}) {
    if (card.weight <= 0) return false;
    if (!ignoreOnce && card.once && this.used.has(card.id)) return false;
    if (!ignoreRecent && this.recent.includes(card.id)) return false;
    if (!card.requires.every((f) => this.flags.has(f))) return false;
    if (card.excludes.some((f) => this.flags.has(f))) return false;
    return true;
  }

  draw() {
    // 연속 사건: next로 지정된 카드는 조건과 상관없이 바로 나온다
    if (this.pendingNext) {
      const next = this.byId.get(this.pendingNext);
      this.pendingNext = null;
      if (next) return next;
    }
    // 뽑을 카드가 바닥나도 게임이 멈추지 않도록 조건을 하나씩 풀어 본다
    const tries = [{}, { ignoreRecent: true }, { ignoreRecent: true, ignoreOnce: true }];
    for (const opts of tries) {
      const pool = this.cards.filter((c) => this.isEligible(c, opts));
      if (pool.length) return this.pickWeighted(pool);
    }
    return this.pickWeighted(this.cards.filter((c) => c.weight > 0 && c.requires.length === 0));
  }

  pickWeighted(pool) {
    const total = pool.reduce((sum, c) => sum + c.weight, 0);
    let r = this.random() * total;
    for (const c of pool) {
      r -= c.weight;
      if (r < 0) return c;
    }
    return pool[pool.length - 1];
  }
}
