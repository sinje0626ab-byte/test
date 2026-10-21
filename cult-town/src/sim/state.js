// 새 게임 상태. 상태는 JSON 으로 저장되는 평범한 객체 하나다 (Phaser·DOM 모름).
import { GAME, CLOCK, RUMOR } from '../config.js';
import { ALL_RESIDENTS } from '../data/residents.js';
import { CAST } from '../data/cast.js';
import { CLERGY, CLERGY_B } from '../data/clergy.js';

export function newWeek() {
  return { talks: 0, newcomers: [], members: [], worships: [], offering: 0, rent: null, clergy: [], shadow: [], left: [], repStart: null, followers: 0 };
}

// 저장 v2 에서 생긴 칸 (1단계 보강 + 2단계). 마이그레이션도 이 함수를 쓴다
export function v2Fields() {
  return {
    phase: 1,
    weather: { rain: false, market: false },
    inventory: {},
    events: { last: -99, pending: null, seen: {} },
    space: { step: 0 },
    rooms: { '302': { type: 'worship', level: 1, dark: false } },
    officers: [],
    officerRel: {},
    officersAppointed: 0,
    officersLeft: 0,
    landlordAnger: 0,
    revelations: {},
    rules: [],
    outsiders: 0,
  };
}

// 저장 v3 에서 생긴 칸
export function v3Fields() {
  return {
    phase3Day: null,
    exposure: 0,
    reporter: { active: false, since: -1, leaveDay: -1, heat: 0, interviewed: null, met: {}, cooldownUntil: 0, reports: 0, due: null, chase: false, talks: 0, evadedAt: -999, lastQ: null },
    protest: null,
    defectors: {},
    meeting: null,
    notices: {},
    admin: { complaints: 0, last: -99, patrolUntil: -1 },
    rival: null,
    repLog: [],
    darkLog: [],
  };
}

// 저장 v4 에서 생긴 칸 (4단계 봉천동 지부)
export function v4Fields() {
  return {
    phase4Day: null,
    district: 'sillim',
    repB: RUMOR.start,
    repLogB: [],
    branch: { open: false, head: null, followers: 0, since: -1, worshipDay: -1, heads: 0, autonomy: 0, split: null, offering: 0 },
  };
}

export function newResident(r) {
  return {
    like: 0, sus: r.leader ? 8 : 4, stage: 'none', worships: 0,
    talked: -1, met: false, known: false, hint: null,
    needs: { ...r.needs }, attendDay: -1, missed: 0,
    story: { done: 0, favor: null }, lastTopic: null, rlike: 0, rival: 'none',
  };
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
    ...v2Fields(),
    ...v3Fields(),
    ...v4Fields(),
  };
  for (const r of ALL_RESIDENTS) s.res[r.id] = newResident(r);
  for (const c of CAST) s.cast[c.id] = { sus: 0, talkIdx: 0, active: true };
  for (const c of [...CLERGY, ...CLERGY_B]) s.clergy[c.id] = { last: -99, greetIdx: 0 };
  s.week.repStart = s.rep;
  return s;
}
