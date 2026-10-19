import { DEITIES } from './deities.js';
import { TENETS } from './tenets.js';
import { STAGES } from '../config.js';
import { EFFECTS, holySiteSource } from '../story/effects.js';
import { approachSource } from './culture.js';

// 수정자 출처: 절대 원칙(신앙 대상) · 울타리(교리) · 성장 단계 · 나라별 현지 전도 방식 · 계시/사건이 남긴 효과(state.extraModifiers)
// extraModifiers 항목은 저장 가능한 데이터다: { ref: 'sanctuary:mountain', until?: 턴, params? }
// ref 는 story/effects.js 의 EFFECTS 표에서 { mods, add } 정의로 바뀐다.
// 같은 턴에 수천 번 불리므로, 출처 목록을 상태가 바뀔 때만 다시 만든다
const cache = new WeakMap();
const keyOf = (state) => `${state.turn}|${state.stage}|${state.religion.deity}|${state.religion.tenets.join()}|${Object.keys(state.holySites ?? {}).length}|${(state.extraModifiers ?? []).map((m) => `${m.ref}:${m.until}:${m.params?.factor ?? ''}`).join()}`;

export function sources(state) {
  const key = keyOf(state);
  const hit = cache.get(state);
  if (hit && hit.key === key) return hit.list;
  const list = buildSources(state);
  cache.set(state, { key, list });
  return list;
}

function buildSources(state) {
  const list = [];
  if (state.religion.deity) list.push(DEITIES[state.religion.deity]);
  for (const t of state.religion.tenets) list.push(TENETS[t]);
  const stage = STAGES.find((s) => s.id === state.stage);
  if (stage) list.push({ mods: { growth: stage.growth, faith: stage.faith, unitPower: stage.unitPower, resistance: stage.resistance } });
  list.push(approachSource);
  const holy = holySiteSource(state);
  if (holy) list.push(holy);
  for (const m of state.extraModifiers ?? []) {
    if (m.until != null && state.turn >= m.until) continue;
    const def = EFFECTS[m.ref];
    if (def) list.push(typeof def === 'function' ? def(m.params ?? {}) : def);
  }
  return list.filter(Boolean);
}

const value = (v, c, state, share) => (typeof v === 'function' ? v(c, state, share) : v);

// 곱셈형: 모든 출처의 값을 곱한다 (없으면 1)
export function mul(state, key, c = null, share = 0) {
  let m = 1;
  for (const src of sources(state)) {
    const v = src.mods?.[key];
    if (v !== undefined) m *= value(v, c, state, share);
  }
  return m;
}

// 덧셈형: 모든 출처의 값을 더한다 (없으면 0)
export function add(state, key, c = null, share = 0) {
  let a = 0;
  for (const src of sources(state)) {
    const v = src.add?.[key];
    if (v !== undefined) a += value(v, c, state, share);
  }
  return a;
}

// 효과를 남긴다 (같은 ref 가 있으면 바꿔 끼운다)
export function addEffect(state, ref, { turns = null, params = null } = {}) {
  state.extraModifiers = (state.extraModifiers ?? []).filter((m) => m.ref !== ref);
  state.extraModifiers.push({ ref, until: turns ? state.turn + turns : null, ...(params ? { params } : {}) });
}

export function removeEffect(state, ref) {
  state.extraModifiers = (state.extraModifiers ?? []).filter((m) => m.ref !== ref);
}

export const hasEffect = (state, ref) => (state.extraModifiers ?? []).some((m) => m.ref === ref && (m.until == null || state.turn < m.until));

// 기한이 지난 효과 정리
export function pruneEffects(state) {
  state.extraModifiers = (state.extraModifiers ?? []).filter((m) => m.until == null || state.turn < m.until);
}
