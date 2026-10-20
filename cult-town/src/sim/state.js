// 새 게임 상태. 상태는 JSON 으로 저장되는 평범한 객체 하나다 (Phaser·DOM 모름).
import { GAME, CLOCK, RUMOR } from '../config.js';
import { RESIDENTS } from '../data/residents.js';
import { CAST } from '../data/cast.js';
import { CLERGY } from '../data/clergy.js';

export function newWeek() {
  return { talks: 0, newcomers: [], members: [], worships: [], offering: 0, rent: null, clergy: [], shadow: [], left: [], repStart: null, followers: 0 };
}

export function newGame({ leaderName, age, family, sect, cultName, seed = Date.now() % 1e9 }) {
  const s = {
    v: GAME.saveVersion,
    seed, rng: seed | 0,
    day: 0, minute: CLOCK.dayStart, mode: 'day',
    leader: { name: leaderName, age, family, sect, cultName, fatigue: 0, money: GAME.startMoney, belief: 0, tiredStart: 0 },
    rep: RUMOR.start,
    res: {},
    pos: {},
    attend: [],
    followers: 0,
    followerOf: {},
    cast: {},
    sanctuary: { props: {}, arrears: 0, rentStreak: 0, worshipDay: -1, lastAttend: [] },
    clergy: {},
    shadow: [],
    flags: {},
    week: newWeek(),
    bulletinNo: 0,
    log: [],
    over: null,
  };
  for (const r of RESIDENTS) {
    s.res[r.id] = {
      like: 0, sus: r.leader ? 8 : 4, stage: 'none', worships: 0,
      talked: -1, met: false, known: false, hint: null,
      needs: { ...r.needs }, attendDay: -1, missed: 0,
    };
  }
  for (const c of CAST) s.cast[c.id] = { sus: 0, talkIdx: 0, active: true };
  for (const c of CLERGY) s.clergy[c.id] = { last: -99, greetIdx: 0 };
  s.week.repStart = s.rep;
  return s;
}
