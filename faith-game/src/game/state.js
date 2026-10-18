import { GAME } from '../config.js';
import { world } from '../data/loader.js';
import { createUnit } from '../units/units.js';

export function createState(religion) {
  const countries = {};
  for (const id of world.ids) countries[id] = { followers: 0, aversion: 0, alert: 0, reachedTurn: null, lastDelta: 0 };
  const state = {
    version: GAME.saveVersion,
    turn: 0,
    religion,
    faith: GAME.startFaith,
    countries,
    units: [],
    nextUnitId: 1,
    stage: 'cult',
    peakFollowers: 0,
    history: [],        // 턴별 전 세계 신도 (그래프용)
    flags: {},          // 2단계 기능 해금 표시
    extraModifiers: [], // 2단계: 성지·사원·이벤트가 넣는 수정자
    result: null,       // 'victory' | 'defeat'
    lastReport: null,
  };
  countries[religion.home].followers = GAME.startFollowers;
  countries[religion.home].reachedTurn = 0;
  for (const type of GAME.startUnits) state.units.push(createUnit(state, type, religion.home));
  state.peakFollowers = GAME.startFollowers;
  state.history.push(GAME.startFollowers);
  return state;
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
