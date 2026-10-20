import { GAME } from '../config.js';
import { EMBLEMS } from './emblems.js';

// 복사기·인쇄소에서 흔한 색 (시스템 파란색은 쓰지 않는다)
export const COLOR_PRESETS = ['#b7322a', '#2f4a7a', '#6a3d91', '#1f6e55', '#b07a12', '#9c2f62', '#c4561b', '#3b3a36'];

// 창시 화면에서는 교주 정보만 정한다 (교단 이름·원칙·본거지·울타리는 계시에서)
export function validateFounder(f) {
  const errors = [];
  if (!f.founder?.trim()) errors.push('이름부터 적어 주세요.');
  const { min, max } = GAME.leaderAge;
  if (!(f.age >= min && f.age <= max)) errors.push(`나이는 ${min}~${max}세 사이로 해 주세요.`);
  if (!/^#[0-9a-f]{6}$/i.test(f.color ?? '')) errors.push('잉크 색을 골라 주세요.');
  if (!EMBLEMS.some((e) => e.id === f.emblem)) errors.push('도장 문양을 골라 주세요.');
  return errors;
}

export function makeFounder(f) {
  return {
    founder: f.founder.trim().slice(0, 16),
    age: Math.round(f.age),
    color: f.color.toLowerCase(),
    emblem: f.emblem,
  };
}
