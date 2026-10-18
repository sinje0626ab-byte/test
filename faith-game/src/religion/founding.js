import { GAME } from '../config.js';
import { DEITIES } from './deities.js';
import { TENETS } from './tenets.js';
import { world } from '../data/loader.js';
import { EMBLEMS } from './emblems.js';

export const COLOR_PRESETS = ['#0a84ff', '#5e5ce6', '#bf5af2', '#ff375f', '#ff9f0a', '#30b0c7', '#34c759', '#ac8e68'];

// 창시 입력값을 검사해 문제 목록을 돌려준다 (빈 배열이면 통과)
export function validateFounding(f) {
  const errors = [];
  if (!f.name?.trim()) errors.push('종교 이름을 입력하세요.');
  if (!f.founder?.trim()) errors.push('교주 이름을 입력하세요.');
  if (!/^#[0-9a-f]{6}$/i.test(f.color ?? '')) errors.push('상징 색을 고르세요.');
  if (!EMBLEMS.some((e) => e.id === f.emblem)) errors.push('문양을 고르세요.');
  if (!DEITIES[f.deity]) errors.push('신앙 대상을 고르세요.');
  if (f.tenets?.length !== GAME.tenetSlots || f.tenets.some((t) => !TENETS[t])) errors.push(`교리를 ${GAME.tenetSlots}개 고르세요.`);
  if (!world.countries[f.home]) errors.push('시작 국가를 고르세요.');
  return errors;
}

export function makeReligion(f) {
  return {
    name: f.name.trim().slice(0, 20),
    founder: f.founder.trim().slice(0, 16),
    color: f.color.toLowerCase(),
    emblem: f.emblem,
    deity: f.deity,
    tenets: [...f.tenets],
    home: f.home,
  };
}
