import { RESISTANCE, FREEDOM, SPREAD, DIFFICULTY } from '../config.js';
import { world } from '../data/loader.js';
import { mul } from './modifiers.js';

// ── 기본 계산 ──

export const share = (state, id) => state.countries[id].followers / world.countries[id].pop;

// 우리 신도를 뺀 나머지 인구가 기존 종교를 원래 비율대로 믿는다고 본다.
export function composition(state, id) {
  const c = world.countries[id];
  const s = state ? share(state, id) : 0;
  const out = {};
  for (const key of world.religionOrder) {
    const v = c.religions[key];
    if (v) out[key] = v * (1 - s);
  }
  return { ours: s, existing: out };
}

const cohesion = (key) => RESISTANCE.cohesion[key] ?? RESISTANCE.cohesion.organized;

// 기존 종교만의 저항력 (우리 신도·거부감·교리 보정 없음) — 시작 국가 난이도 계산용
export function baseResistance(id) {
  const c = world.countries[id];
  let r = 0;
  for (const [key, v] of Object.entries(c.religions)) r += v * cohesion(key);
  return Math.min(RESISTANCE.max, r);
}

// 저항력 = Σ(기존 종교 비율 × 결속 계수) × (1 + 거부감) × 교리 보정
export function resistance(state, id) {
  const c = world.countries[id];
  const { existing } = composition(state, id);
  let r = 0;
  for (const [key, v] of Object.entries(existing)) r += v * cohesion(key);
  r *= 1 + state.countries[id].aversion * RESISTANCE.aversionWeight;
  r *= mul(state, 'resistance', c);
  return Math.min(RESISTANCE.max, Math.max(0, r));
}

export function freedomMod(id) {
  const f = world.countries[id].freedom / 100;
  return FREEDOM.min + (FREEDOM.max - FREEDOM.min) * f;
}

// 아직 개종할 수 있는 인구
export function pool(state, id) {
  const c = world.countries[id];
  return Math.max(0, c.pop * SPREAD.maxShare - state.countries[id].followers);
}

// 전 세계 신도 (state.js 와 순환 참조를 피하려고 여기서 직접 센다)
function worldFollowers(state) {
  let t = 0;
  for (const k in state.countries) t += state.countries[k].followers;
  return t;
}

// 도달력: 조직이 클수록 멀리 닿지만, 그 나라 인구보다 크게는 못 간다
export function reach(state, id) {
  const org = SPREAD.reachK * (worldFollowers(state) + SPREAD.reachSeed) ** SPREAD.reachExponent;
  return Math.min(pool(state, id) ** SPREAD.popExponent, org);
}

// ── 전파 공식 ──
// 전파량 = 유닛 기본값 × 교리·단계 보정 × (1 - 저항력) × 자유도 보정 × 도달력
export function spreadAmount(state, id, base) {
  const c = world.countries[id];
  const p = pool(state, id);
  if (p <= 0) return 0;
  const amount = base * mul(state, 'unitPower', c, share(state, id)) * (1 - resistance(state, id)) * freedomMod(id) * reach(state, id);
  return Math.min(p, amount);
}

// 신도를 더하거나 뺀다. 실제로 바뀐 양을 돌려준다.
export function addFollowers(state, id, amount) {
  const cs = state.countries[id];
  const before = cs.followers;
  const cap = world.countries[id].pop * SPREAD.maxShare;
  cs.followers = Math.max(0, Math.min(cap, before + amount));
  if (cs.followers > before && before === 0 && !cs.reachedTurn) cs.reachedTurn = state.turn;
  return cs.followers - before;
}

// ── 시작 국가 난이도 ──
export function difficulty(id) {
  const score = freedomMod(id) * (1 - baseResistance(id));
  const d = DIFFICULTY.find((x) => score >= x.min) ?? DIFFICULTY[DIFFICULTY.length - 1];
  return { ...d, score };
}

// 기존 종교 중 가장 큰 종교 (우리 종교가 더 크면 'ours')
export function dominant(state, id) {
  const { ours, existing } = composition(state, id);
  let best = null, bestV = -1;
  for (const [k, v] of Object.entries(existing)) if (v > bestV) { best = k; bestV = v; }
  if (ours > bestV) return { key: 'ours', share: ours };
  return { key: best, share: bestV };
}
