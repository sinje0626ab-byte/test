import { LEADER, STORY, UNITY } from '../config.js';
import { chance } from './rng.js';
import { addEffect } from '../religion/modifiers.js';

// 교주: 나이·사망·체포·수감·후계

export const HEIRS = {
  blood: '교주의 핏줄',
  loyal: '충성스러운 간부',
  dream: '꿈의 계시를 받은 신도',
};

export function isJailed(state) {
  return state.leader.jailedUntil != null && state.turn < state.leader.jailedUntil;
}

// 매 턴: 나이 먹기 + 70세부터 사망 판정
export function leaderTurn(state, report) {
  const L = state.leader;
  L.ageMonths += 1;
  if (L.ageMonths >= LEADER.agingTurns) {
    L.ageMonths = 0;
    L.age += 1;
  }
  if (L.age >= LEADER.deathAge && !state.result) {
    const p = LEADER.deathBase + LEADER.deathPerYear * (L.age - LEADER.deathAge);
    if (chance(state, p)) leaderFalls(state, 'death', report);
  }
}

// 교주가 쓰러지거나 체포되었다. 후계자가 있으면 계승, 없으면 패배.
export function leaderFalls(state, cause, report) {
  const L = state.leader;
  report?.events.push({ type: cause, name: L.name });
  if (L.immortal) return defeat(state, 'collapse');
  if (!L.heir) return defeat(state, cause);
  succeed(state, report);
}

function succeed(state, report) {
  const L = state.leader;
  const heir = L.heir;
  let delta = LEADER.successionUnity[heir] ?? -10;
  if (L.rite === 'sealed') delta += STORY.rite.sealed.successionBonus;
  if (L.rite === 'council' && heir === 'blood') delta += STORY.rite.council.bloodPenalty;
  state.unity = Math.max(0, Math.min(UNITY.max, state.unity + delta));
  if (heir === 'loyal') addEffect(state, 'heir:loyal');
  L.generation += 1;
  L.name = `${HEIRS[heir]} (${L.generation}대 교주)`;
  L.age = LEADER.heirAge;
  L.ageMonths = 0;
  L.heir = null;
  L.rite = null;
  L.jailedUntil = null;
  report?.events.push({ type: 'succession', heir, unityDelta: delta });
  if (state.unity <= 0) defeat(state, 'schism');
}

export function defeat(state, reason) {
  if (state.result) return;
  state.result = 'defeat';
  state.defeatReason = reason;
}

export const DEFEAT_TEXT = {
  followers: { title: '마지막 신도가 떠났습니다', body: '텅 빈 성소에 당신 혼자 남았습니다.' },
  arrest: { title: '교주가 체포되었습니다', body: '수갑이 채워지는 순간, 교단도 함께 멈췄습니다. 뒤를 이을 사람이 없었습니다.' },
  death: { title: '교주가 세상을 떠났습니다', body: '후계자는 없었습니다. 간부들은 장례식장에서부터 서로를 노려보았습니다.' },
  collapse: { title: '불사의 교주가 죽었습니다', body: '"나는 죽지 않는다"던 사람이 죽었습니다. 신도들은 그 말을 가장 먼저 의심했습니다.' },
  schism: { title: '교단이 갈라졌습니다', body: '파벌마다 자기가 정통이라 외쳤고, 남은 것은 서로를 고소하는 소장뿐이었습니다.' },
};
