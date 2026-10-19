import { GROWTH, DIFFUSION, FAITH, SPREAD, ALERT } from '../config.js';
import { world } from '../data/loader.js';
import { mul, add, pruneEffects } from '../religion/modifiers.js';
import { resistance, freedomMod, addFollowers, share } from '../religion/spread.js';
import { unitsOnTurn, resetUnits, attritionShield, runAutoMissions } from '../units/units.js';
import { totalFollowers } from './state.js';
import { checkStage, checkResult } from './stages.js';
import { pressureTurn, alertTurn, unityTurn, unityAttrition } from './watch.js';
import { leaderTurn } from './leader.js';

// ── 턴 단계 ──
// 턴 종료 시 아래 순서대로 실행된다. 각 단계는 (state, report) → void.
// 새 시스템은 이 배열에 단계를 끼워 넣어 확장한다.

// 다음 달 예상 수입 (HUD 표시용과 실제 수입이 같은 식)
export function faithIncome(state) {
  if (!state.religion.home) return 0;
  const raw = FAITH.base + totalFollowers(state) ** FAITH.exponent * FAITH.perFollower;
  return Math.round(raw * mul(state, 'faith') + add(state, 'faithFlat'));
}

function autoMissions(state, report) {
  report.auto = runAutoMissions(state);
}

function income(state, report) {
  const gain = faithIncome(state);
  state.faith = Math.max(0, state.faith + gain);
  report.faith = gain;
}

function unitEffects(state, report) {
  report.unitPressure = unitsOnTurn(state);
}

// 활동 금지된 나라는 성장이 크게 꺾인다
const banFactor = (state, id) => (state.countries[id].banned ? ALERT.banGrowth : 1);

// 자연 증가: 신도가 주변 사람을 데려온다. 그 나라에서 흔해질수록 입소문이 빨라진다.
function growth(state, report) {
  let total = 0;
  for (const id of world.ids) {
    const cs = state.countries[id];
    if (cs.followers <= 0) continue;
    const c = world.countries[id];
    const s = share(state, id);
    const room = Math.max(0, 1 - s / SPREAD.maxShare);
    const social = 1 + GROWTH.socialProof * (s / (s + GROWTH.socialHalf));
    const g = cs.followers * GROWTH.rate * social * mul(state, 'growth', c, s) * (1 - resistance(state, id)) * freedomMod(id) * room * banFactor(state, id);
    const d = addFollowers(state, id, g);
    report.delta[id] = (report.delta[id] ?? 0) + d;
    total += d;
  }
  report.growth = total;
}

// 이탈: 저항이 강할수록, 결속이 약할수록 많이 떠난다. 수호자가 있으면 줄어든다.
function attrition(state, report) {
  let total = 0;
  const unityMul = unityAttrition(state);
  for (const id of world.ids) {
    const cs = state.countries[id];
    if (cs.followers <= 0) continue;
    const c = world.countries[id];
    const s = share(state, id);
    const established = 1 - GROWTH.establishedRelief * (s / (s + GROWTH.establishedHalf));
    const rate = GROWTH.attritionBase * (1 + resistance(state, id) * GROWTH.attritionResistanceWeight) * established
      * mul(state, 'attrition', c, s) * unityMul * (1 - attritionShield(state, id));
    const d = addFollowers(state, id, -cs.followers * Math.min(0.9, rate));
    if (cs.followers < GROWTH.minFollowers) cs.followers = 0;   // 1명 미만은 0 (소프트락 방지)
    report.delta[id] = (report.delta[id] ?? 0) + d;
    total += d;
  }
  report.attrition = total;
}

// 인접국 자연 전파: 신도가 충분한 나라에서 육로·해로 이웃으로 번진다
function diffusion(state, report) {
  const snapshot = world.ids.map((id) => [id, state.countries[id].followers]);
  const global = mul(state, 'diffusion');
  let total = 0;
  for (const [id, f] of snapshot) {
    if (f < DIFFUSION.minFollowers) continue;
    const c = world.countries[id];
    const send = (to, rate) => {
      if (state.countries[to].banned) return;
      const target = world.countries[to];
      const amount = f * rate * global * mul(state, 'growth', target, share(state, to)) * (1 - resistance(state, to)) * freedomMod(to);
      const wasEmpty = state.countries[to].followers === 0;
      const d = addFollowers(state, to, amount);
      if (state.countries[to].followers < GROWTH.minFollowers) { state.countries[to].followers = 0; return; }
      report.delta[to] = (report.delta[to] ?? 0) + d;
      if (wasEmpty) report.newCountries.push(to);
      total += d;
    };
    for (const n of c.land) send(n, DIFFUSION.land);
    for (const n of c.sea) send(n, DIFFUSION.sea);
  }
  report.diffusion = total;
}

function pressure(state) {
  pressureTurn(state);
}

function watch(state, report) {
  alertTurn(state, report);
}

function cohesion(state, report) {
  unityTurn(state, report);
}

function leader(state, report) {
  leaderTurn(state, report);
}

function progress(state, report) {
  const total = totalFollowers(state);
  state.peakFollowers = Math.max(state.peakFollowers, total);
  state.history.push(Math.round(total));
  report.total = total;
  report.stages = checkStage(state);
  if (!state.result) state.result = checkResult(state);
  report.result = state.result;
}

export const TURN_PHASES = [autoMissions, income, unitEffects, growth, attrition, diffusion, pressure, watch, cohesion, leader, progress];

export function endTurn(state) {
  const before = totalFollowers(state);
  const report = { turn: state.turn + 1, delta: {}, newCountries: [], events: [], warnings: [], before };
  state.turn += 1;
  for (const phase of TURN_PHASES) {
    phase(state, report);
  }
  for (const id of world.ids) state.countries[id].lastDelta = report.delta[id] ?? 0;
  resetUnits(state);
  pruneEffects(state);
  report.change = report.total - before;
  report.newCountries = [...new Set(report.newCountries)];
  state.lastReport = { turn: report.turn, change: report.change, faith: report.faith, newCountries: report.newCountries };
  return report;
}
