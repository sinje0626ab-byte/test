import { GAME, UNITY } from '../config.js';
import { world } from '../data/loader.js';
import { seedState } from './rng.js';
import { createCast } from '../story/cast.js';

// 새 게임 상태. 창시 화면에서는 교주 정보만 정하고,
// 절대 원칙·이름(계시 I)·성소(계시 II)·울타리(계시 IV)는 계시에서 채운다. 본거지는 늘 대한민국.
export function createState({ founder, age, color, emblem, seed }) {
  const countries = {};
  for (const id of world.ids) countries[id] = { followers: 0, aversion: 0, alert: 0, reachedTurn: null, lastDelta: 0 };
  return {
    version: GAME.saveVersion,
    turn: 0,
    religion: { name: '', founder, color, emblem, deity: null, tenets: [], home: null, sanctuary: null, method: null },
    leader: { name: founder, age, ageMonths: 0, generation: 1, heir: null, rite: null, immortal: false, jailedUntil: null },
    faith: GAME.startFaith,
    countries,
    units: [],
    nextUnitId: 1,
    stage: 'cult',
    unity: UNITY.start,
    riskPoints: 0,
    holySites: {},
    miracleReadyTurn: 0,
    peakFollowers: 0,
    history: [],
    flags: {},          // 계시·사건이 남기는 표시 (lockdownUntil, rebrand …)
    extraModifiers: [], // 계시·사건이 남기는 지속 효과 (story/effects.js 의 ref)
    story: { done: {}, log: [] },
    incidents: { next: null, seen: {}, log: [] },
    rng: seedState(seed),
    result: null,       // 'victory' | 'defeat'
    defeatReason: null, // 'followers' | 'arrest' | 'death' | 'schism' | 'collapse'
    lastReport: null,
    cast: createCast(age),
  };
}

// 계시 II 에서 성소를 열면 첫 신도 3명(엄마·태식·민호)이 생긴다
export function settleHome(state, id = GAME.home) {
  state.religion.home = id;
  const cs = state.countries[id];
  cs.followers = GAME.startFollowers;
  cs.reachedTurn = state.turn;
  state.peakFollowers = Math.max(state.peakFollowers, GAME.startFollowers);
  if (!state.history.length) state.history.push(GAME.startFollowers);
}

export function totalFollowers(state) {
  let t = 0;
  for (const id in state.countries) t += state.countries[id].followers;
  return t;
}

export function presenceCount(state, min) {
  let n = 0;
  for (const id in state.countries) if (state.countries[id].followers >= min) n++;
  return n;
}

// 턴 → { year, month }
export function dateOf(turn) {
  const m = GAME.startMonth - 1 + turn;
  return { year: GAME.startYear + Math.floor(m / 12), month: (m % 12) + 1 };
}

export const dateLabel = (turn) => {
  const { year, month } = dateOf(turn);
  return `${year}년 ${month}월`;
};

// 처음으로 바다 건너에 신도가 생긴 나라 (한 번만). 생기면 flags.abroad 를 켜고 그 나라 id 를 돌려준다.
export function checkAbroad(state) {
  if (state.flags.abroad || !state.religion.home) return null;
  for (const id in state.countries) {
    if (id === state.religion.home || id === state.flags.exiledFrom) continue;
    if (state.countries[id].followers >= 1) {
      state.flags.abroad = id;
      return id;
    }
  }
  return null;
}
