// 단계 목표와 난이도 손잡이 (28장 A). 목표 숫자는 여기 한 곳에서 계산한다 (week.js · HUD · 메뉴 · 시뮬레이터).
import { GOAL, PHASE2, PHASE3, PHASE4, DIFFICULTY, SECT_TUNE, ZONE_GOAL } from '../config.js';

const BASE = { 1: GOAL.members, 2: PHASE2.members, 3: PHASE3.members, 4: PHASE4.members };

// 손잡이 값: 난이도 × 유형 (단계마다)
export function tune(s, key, phase = s.phase) {
  const i = Math.min(4, Math.max(1, phase)) - 1;
  const d = DIFFICULTY[s.difficulty ?? 'normal'] ?? DIFFICULTY.normal;
  return (d[key]?.[i] ?? 1) * (SECT_TUNE[s.leader?.sect]?.[key]?.[i] ?? 1);
}
export const difficultyOf = (s) => DIFFICULTY[s.difficulty ?? 'normal'] ?? DIFFICULTY.normal;

// 그 단계 신도 목표 (봉천 지부 목표도 같은 배율)
export function goalOf(s, phase = s.phase) {
  const m = tune(s, 'goal', phase);
  return { members: Math.round(BASE[phase] * m * (ZONE_GOAL[phase - 1] ?? 1)), branch: Math.round(PHASE4.branch * tune(s, 'goal', 4)) };
}
