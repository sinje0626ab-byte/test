import { MIRACLE, HOLY_SITE, STAGES } from '../config.js';
import { world } from '../data/loader.js';
import { spreadAmount, addFollowers } from '../religion/spread.js';
import { bumpAlert, bumpAversion } from './watch.js';
import { isJailed } from './leader.js';

// 신앙력 쓰임새: 기적(즉발 대형 전파)과 성지(나라별 영구 보너스)

export const stageCostMul = (state) => STAGES.find((s) => s.id === state.stage)?.cost ?? 1;

export const miracleCost = (state) => Math.round(MIRACLE.cost * stageCostMul(state));

export function miracleBlocker(state, id) {
  const cs = state.countries[id];
  if (!state.religion.home) return '아직 성소가 없다';
  if (cs.banned) return '활동 금지라 안 된다';
  if (cs.followers <= 0) return '신도가 있는 나라에서만 된다';
  if (state.turn < state.miracleReadyTurn) return `${state.miracleReadyTurn - state.turn}달 뒤에 다시`;
  if (state.faith < miracleCost(state)) return '신앙력이 모자란다';
  return null;
}

export function performMiracle(state, id) {
  const blocker = miracleBlocker(state, id);
  if (blocker) return { ok: false, message: blocker };
  state.faith -= miracleCost(state);
  const converted = addFollowers(state, id, spreadAmount(state, id, MIRACLE.power));
  bumpAlert(state, id, MIRACLE.alert);
  bumpAversion(state, id, MIRACLE.aversion);
  state.miracleReadyTurn = state.turn + MIRACLE.cooldown;
  return { ok: true, converted };
}

export const holySiteCount = (state) => Object.keys(state.holySites ?? {}).length;

export const holySiteCost = (state) => Math.round(HOLY_SITE.cost * (1 + HOLY_SITE.perSite * holySiteCount(state)) * stageCostMul(state));

export function holySiteBlocker(state, id) {
  if (!state.flags.holySites) return '금고 문제를 정한 뒤에 (계시 VI)';
  if (state.holySites[id]) return '이미 성지가 있다';
  const cs = state.countries[id];
  if (cs.banned) return '활동 금지라 안 된다';
  if (cs.followers < HOLY_SITE.minFollowers) return `신도 ${HOLY_SITE.minFollowers.toLocaleString('ko-KR')}명은 있어야 한다`;
  if (isJailed(state)) return '교주가 수감 중이다';
  if (state.faith < holySiteCost(state)) return '신앙력이 모자란다';
  return null;
}

export function buildHolySite(state, id, { free = false } = {}) {
  if (!free) {
    const blocker = holySiteBlocker(state, id);
    if (blocker) return { ok: false, message: blocker };
    state.faith -= holySiteCost(state);
  }
  state.holySites[id] = { turn: state.turn };
  bumpAlert(state, id, HOLY_SITE.alert);
  return { ok: true, name: world.countries[id].name };
}
