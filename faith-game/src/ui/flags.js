import { esc } from './format.js';

// 국기 그림 (public/flags/{iso2}.svg, flag-icons). 국기가 없는 지역은 빈 회색 칸.
const BASE = import.meta.env?.BASE_URL ?? './';

export function flagImg(country, cls = 'flag') {
  if (!country?.iso2) return `<span class="${cls} flag-none" aria-hidden="true"></span>`;
  return `<img class="${cls}" src="${BASE}flags/${country.iso2}.svg" alt="${esc(country.name)} 국기" loading="lazy" decoding="async">`;
}
