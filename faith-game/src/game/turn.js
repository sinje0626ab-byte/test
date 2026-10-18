import { GROWTH, DIFFUSION, FAITH, AVERSION, ALERT, SPREAD } from '../config.js';
import { world } from '../data/loader.js';
import { mul, add } from '../religion/modifiers.js';
import { resistance, freedomMod, addFollowers, share } from '../religion/spread.js';
import { unitsOnTurn, resetUnits, attritionShield } from '../units/units.js';
import { totalFollowers } from './state.js';
import { checkStage, checkResult } from './stages.js';

// ── 턴 단계 ──
// 턴 종료 시 아래 순서대로 실행된다. 각 단계는 (state, report) → void.
// 2단계 기능(정부 탄압, 스캔들 이벤트, 성지 효과…)은 이 배열에 단계를 끼워 넣어 확장한다.

export function faithIncome(state) {
  const raw = FAITH.base + totalFollowers(state) ** FAITH.exponent * FAITH.perFollower;
  return Math.round(raw * mul(state, 'faith'));
}

function income(state, report) {
  const gain = faithIncome(state);
  state.faith += gain;
  report.faith = gain;
}

function unitEffects(state, report) {
  report.unitPressure = unitsOnTurn(state);
}

// 자연 증가: 신도가 주변 사람을 데려온다 (로지스틱)
function growth(state, report) {
  let total = 0;
  for (const id of world.ids) {
    const cs = state.countries[id];
    if (cs.followers <= 0) continue;
    const c = world.countries[id];
    const s = share(state, id);
    const room = Math.max(0, 1 - s / SPREAD.maxShare);
    const g = cs.followers * GROWTH.rate * mul(state, 'growth', c, s) * (1 - resistance(state, id)) * freedomMod(id) * room;
    const d = addFollowers(state, id, g);
    report.delta[id] = (report.delta[id] ?? 0) + d;
    total += d;
  }
  report.growth = total;
}

// 이탈: 저항이 강한 곳일수록 많이 떠난다. 수호자가 있으면 줄어든다.
function attrition(state, report) {
  let total = 0;
  for (const id of world.ids) {
    const cs = state.countries[id];
    if (cs.followers <= 0) continue;
    const c = world.countries[id];
    const rate = GROWTH.attritionBase * (1 + resistance(state, id) * GROWTH.attritionResistanceWeight) * mul(state, 'attrition', c, share(state, id)) * (1 - attritionShield(state, id));
    const d = addFollowers(state, id, -cs.followers * rate);
    if (cs.followers < GROWTH.minFollowers) cs.followers = 0;
    report.delta[id] = (report.delta[id] ?? 0) + d;
    total += d;
  }
  report.attrition = total;
}

// 인접국 자연 전파: 신도가 충분한 나라에서 육로·해로 이웃으로 번진다
function diffusion(state, report) {
  const snapshot = world.ids.map((id) => [id, state.countries[id].followers]);
  let total = 0;
  for (const [id, f] of snapshot) {
    if (f < DIFFUSION.minFollowers) continue;
    const c = world.countries[id];
    const send = (to, rate) => {
      const target = world.countries[to];
      const amount = f * rate * mul(state, 'growth', target, share(state, to)) * (1 - resistance(state, to)) * freedomMod(to);
      const wasEmpty = state.countries[to].followers === 0;
      const d = addFollowers(state, to, amount);
      report.delta[to] = (report.delta[to] ?? 0) + d;
      if (wasEmpty && state.countries[to].followers >= 1) report.newCountries.push(to);
      total += d;
    };
    for (const n of c.land) send(n, DIFFUSION.land);
    for (const n of c.sea) send(n, DIFFUSION.sea);
  }
  report.diffusion = total;
}

// 거부감·정부 경계: 교리에 따라 쌓이고, 매 턴 조금씩 줄어든다
function pressure(state) {
  const alertMul = mul(state, 'alertMul');
  for (const id of world.ids) {
    const cs = state.countries[id];
    const c = world.countries[id];
    const s = share(state, id);
    const aversionGain = cs.followers > 0 ? add(state, 'aversionGain', c, s) : 0;
    const alertGain = cs.followers > 0 ? add(state, 'alertGain', c, s) * alertMul : 0;
    cs.aversion = clamp(cs.aversion + aversionGain - AVERSION.decay, 0, AVERSION.max);
    cs.alert = clamp(cs.alert + alertGain - ALERT.decay, 0, ALERT.max);
  }
}

function progress(state, report) {
  const total = totalFollowers(state);
  state.peakFollowers = Math.max(state.peakFollowers, total);
  state.history.push(Math.round(total));
  report.total = total;
  report.stages = checkStage(state);
  state.result = checkResult(state);
  report.result = state.result;
}

export const TURN_PHASES = [income, unitEffects, growth, attrition, diffusion, pressure, progress];

export function endTurn(state) {
  const before = totalFollowers(state);
  const report = { turn: state.turn + 1, delta: {}, newCountries: [], before };
  state.turn += 1;
  for (const phase of TURN_PHASES) phase(state, report);
  for (const id of world.ids) state.countries[id].lastDelta = report.delta[id] ?? 0;
  resetUnits(state);
  report.change = report.total - before;
  report.newCountries = [...new Set(report.newCountries)];
  state.lastReport = { turn: report.turn, change: report.change, faith: report.faith, newCountries: report.newCountries };
  return report;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
