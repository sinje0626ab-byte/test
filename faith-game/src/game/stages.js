import { STAGES, PRESENCE_MIN, VICTORY_SHARE, DEFEAT_FOLLOWERS } from '../config.js';
import { world } from '../data/loader.js';
import { totalFollowers, presenceCount } from './state.js';

export const stageIndex = (id) => STAGES.findIndex((s) => s.id === id);
export const stageOf = (id) => STAGES[stageIndex(id)];
export const nextStage = (id) => STAGES[stageIndex(id) + 1] ?? null;

// 다음 단계 조건과 진행도
export function stageProgress(state) {
  const next = nextStage(state.stage);
  const followers = totalFollowers(state);
  const countries = presenceCount(state, PRESENCE_MIN);
  if (!next) {
    const goal = world.totalPop * VICTORY_SHARE;
    return { next: null, followers, countries, goal, ratio: Math.min(1, followers / goal) };
  }
  const fr = Math.min(1, followers / next.followers);
  const cr = next.countries ? Math.min(1, countries / next.countries) : 1;
  return { next, followers, countries, ratio: Math.min(fr, cr), followerRatio: fr, countryRatio: cr };
}

// 조건을 채우면 한 단계씩 올라간다 (내려가지는 않는다). 오른 단계 목록을 돌려준다.
export function checkStage(state) {
  const gained = [];
  for (;;) {
    const next = nextStage(state.stage);
    if (!next) break;
    if (totalFollowers(state) < next.followers || presenceCount(state, PRESENCE_MIN) < next.countries) break;
    gained.push({ from: state.stage, to: next.id });
    state.stage = next.id;
  }
  return gained;
}

export function checkResult(state) {
  const total = totalFollowers(state);
  if (total >= world.totalPop * VICTORY_SHARE) return 'victory';
  if (total < DEFEAT_FOLLOWERS) return 'defeat';
  return null;
}
