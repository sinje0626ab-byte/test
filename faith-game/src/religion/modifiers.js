import { DEITIES } from './deities.js';
import { TENETS } from './tenets.js';
import { STAGES } from '../config.js';

// 창시 때 고른 신앙 대상·교리, 현재 성장 단계에서 '수정자 출처' 목록을 모은다.
// 2단계 기능(성지, 사원, 이벤트 효과)은 state.extraModifiers에 { mods, add } 를 넣으면 같이 계산된다.
export function sources(state) {
  const list = [DEITIES[state.religion.deity], ...state.religion.tenets.map((t) => TENETS[t])];
  const stage = STAGES.find((s) => s.id === state.stage);
  if (stage) list.push({ mods: { growth: stage.growth, faith: stage.faith } });
  if (state.extraModifiers) list.push(...state.extraModifiers);
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
