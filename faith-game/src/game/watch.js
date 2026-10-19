import { ALERT, AVERSION, UNITY, STORY, GROWTH, RISK } from '../config.js';
import { world } from '../data/loader.js';
import { mul, add } from '../religion/modifiers.js';
import { share, addFollowers } from '../religion/spread.js';
import { chance } from './rng.js';
import { leaderFalls, defeat } from './leader.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// 본거지 압수수색 문턱 (외딴 섬 성소는 늦게 온다)
export function raidThreshold(state, id) {
  const island = id === state.religion.home && state.religion.sanctuary === 'island';
  return ALERT.raid + (island ? STORY.sanctuary.island.raidDelay : 0);
}

// 그 나라의 주류가 될수록 당국의 경계가 누그러진다 (0~1)
const outsider = (s) => Math.max(0, 1 - s / ALERT.mainstreamShare);

// 가시성: 신도가 많을수록 눈에 띈다
export function visibility(followers, s) {
  if (followers <= 0) return 0;
  return Math.min(ALERT.visMax, Math.log10(followers + 1) / ALERT.visLogScale) * outsider(s);
}

// 매 턴 거부감·정부 경계 변화 (교리, 기존 종교 반격, 가시성)
export function pressureTurn(state) {
  for (const id of world.ids) {
    const cs = state.countries[id];
    const c = world.countries[id];
    const s = share(state, id);
    let aversionGain = 0, alertGain = 0;
    if (cs.followers > 0) {
      aversionGain = add(state, 'aversionGain', c, s) + AVERSION.backlash * s;
      alertGain = (ALERT.perVisibility * visibility(cs.followers, s) + add(state, 'alertGain', c, s) * outsider(s)) * mul(state, 'alertMul', c, s);
    }
    cs.aversion = clamp(cs.aversion + aversionGain - AVERSION.decay - AVERSION.decayHigh * cs.aversion, 0, AVERSION.max);
    cs.alert = clamp(cs.alert + alertGain - ALERT.decay, 0, 1);
  }
}

// 정부 경계 문턱 효과: 경고(50%) · 압수수색(70%) · 활동 금지(100%)
export function alertTurn(state, report) {
  const home = state.religion.home;
  for (const id of world.ids) {
    const cs = state.countries[id];
    if (cs.banned && cs.alert < ALERT.unban) {
      cs.banned = false;
      report.events.push({ type: 'unban', id });
    }
    if (cs.followers <= 0 && !state.units.some((u) => u.at === id)) continue;
    if (cs.alert >= ALERT.ban && !cs.banned) {
      cs.banned = true;
      report.events.push({ type: 'ban', id });
    }
    if (cs.alert >= ALERT.warn && !cs.warned) {
      cs.warned = true;
      report.warnings.push(id);
    }
    if (cs.alert < ALERT.warn - 0.15) cs.warned = false;
    const ready = cs.lastRaid == null || state.turn - cs.lastRaid >= ALERT.raidCooldown;
    if (cs.alert >= raidThreshold(state, id) && ready) {
      if (id === home && !state.story.done.VIII) {
        state.flags.raidPending = true;     // 계시 VIII 이 처리한다
      } else {
        raid(state, id, report);
        if (id === home && !state.result) {
          const p = (ALERT.arrestAfterVIII + ALERT.arrestPerRisk * state.riskPoints) * mul(state, 'persecution');
          if (chance(state, p)) leaderFalls(state, 'arrest', report);
        }
      }
    }
  }
}

// 압수수색: 그 나라 유닛 몰수, 신도 감소. 비밀주의는 피해 절반.
export function raid(state, id, report) {
  const cs = state.countries[id];
  const pers = mul(state, 'persecution');
  const lost = -addFollowers(state, id, -cs.followers * ALERT.raidFollowerLoss * pers);
  const here = state.units.filter((u) => u.at === id);
  const seize = Math.ceil(here.length * pers);
  const seized = new Set(here.slice(0, seize).map((u) => u.id));
  state.units = state.units.filter((u) => !seized.has(u.id));
  cs.alert = ALERT.raidReset;
  cs.aversion = clamp(cs.aversion + ALERT.raidAversion, 0, AVERSION.max);
  cs.lastRaid = state.turn;
  report?.events.push({ type: 'raid', id, lost, unitsLost: seized.size });
  return { lost, unitsLost: seized.size };
}

// 교단 결속: 기준값으로 천천히 돌아가고, 그림자 장부와 정체가 깎는다
export function unityTurn(state, report) {
  let u = state.unity;
  u += Math.sign(UNITY.driftTo - u) * Math.min(UNITY.drift, Math.abs(UNITY.driftTo - u));
  u -= UNITY.riskDrain * state.riskPoints;
  const h = state.history;
  if (h.length > 6 && h[h.length - 1] <= h[h.length - 7]) u -= UNITY.stagnationDrain;
  state.unity = clamp(u, 0, UNITY.max);
  if (state.unity <= 0) defeat(state, 'schism');
}

// 결속이 낮을수록 이탈이 늘어난다
export function unityAttrition(state) {
  return 1 + Math.max(0, UNITY.attritionAt - state.unity) / UNITY.attritionSlope;
}

export function changeUnity(state, delta) {
  state.unity = clamp(state.unity + delta, 0, UNITY.max);
  if (state.unity <= 0) defeat(state, 'schism');
}

export function addRisk(state, points) {
  if (points > 0) state.riskPoints += points;
}

// 그림자 장부가 사건 확률을 올리는 배율
export const riskWeight = (state) => 1 + RISK.incidentWeight * state.riskPoints;

export function bumpAlert(state, id, amount) {
  const cs = state.countries[id];
  const c = world.countries[id];
  const scaled = amount > 0 ? amount * mul(state, 'alertMul', c, share(state, id)) : amount;
  cs.alert = clamp(cs.alert + scaled, 0, 1);
}

export function bumpAversion(state, id, amount) {
  const cs = state.countries[id];
  cs.aversion = clamp(cs.aversion + amount, 0, AVERSION.max);
}

export const minFollowers = GROWTH.minFollowers;
