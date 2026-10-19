import { GAME } from '../config.js';
import { EMBLEMS } from './emblems.js';

export const COLOR_PRESETS = ['#0a84ff', '#5e5ce6', '#bf5af2', '#ff375f', '#ff9f0a', '#30b0c7', '#34c759', '#ac8e68'];

// 창시 화면에서는 교주 정보만 정한다 (교단 이름·원칙·본거지·울타리는 계시에서)
export function validateFounder(f) {
  const errors = [];
  if (!f.founder?.trim()) errors.push('교주 이름을 입력하세요.');
  const { min, max } = GAME.leaderAge;
  if (!(f.age >= min && f.age <= max)) errors.push(`나이는 ${min}~${max}세 사이로 정하세요.`);
  if (!/^#[0-9a-f]{6}$/i.test(f.color ?? '')) errors.push('상징 색을 고르세요.');
  if (!EMBLEMS.some((e) => e.id === f.emblem)) errors.push('문양을 고르세요.');
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
