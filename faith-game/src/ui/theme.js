import { onColor } from './format.js';

// 종교 색을 화면 강조색으로 쓴다
export function setAccent(hex) {
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--on-accent', onColor(hex));
}

// 지도 색칠에 쓸 현재 색 (CSS 변수에서 읽는다)
export function mapTheme() {
  const cs = getComputedStyle(document.documentElement);
  return { land: cs.getPropertyValue('--land').trim(), accent: cs.getPropertyValue('--accent').trim() };
}

export function onSchemeChange(fn) {
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fn);
}
