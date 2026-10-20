import { CAST, castOf } from '../story/cast.js';
import { esc } from './format.js';

// 인물 초상: 인주로 찍은 이니셜 도장 (SVG). 떠났거나 없는 사람은 회색으로 바랜다.
// 도장 모양은 사람마다 조금씩 다르다 (네모·동그라미·타원, 기울기).
const SHAPES = {
  mom: { shape: 'circle', tilt: -6 },
  taesik: { shape: 'square', tilt: 4 },
  minho: { shape: 'square', tilt: -3 },
  jeongsuk: { shape: 'oval', tilt: 5 },
  subin: { shape: 'square', tilt: 2 },
  dongcheol: { shape: 'square', tilt: 0 },
  seojin: { shape: 'circle', tilt: 8 },
};

// 도장에 들어갈 글자: 엄마는 '엄마', 나머지는 이름 첫 글자 (두 글자 이름이면 두 글자)
const glyph = (id) => (id === 'mom' ? '엄마' : CAST[id].short.length <= 2 ? CAST[id].short : CAST[id].short[0]);

export function stamp(id, { state = null, size = 40, name = null } = {}) {
  const gone = state && id && CAST[id] && ['left', 'betrayed', 'arrested', 'dead'].includes(castOf(state, id).status);
  const def = SHAPES[id] ?? { shape: 'circle', tilt: 0 };
  const text = id && CAST[id] ? glyph(id) : ((name ?? '').replace(/[^가-힣]/g, '').slice(0, 2) || '?');
  const two = text.length > 1;
  const frame = def.shape === 'circle'
    ? '<circle cx="20" cy="20" r="17" />'
    : def.shape === 'oval'
      ? '<ellipse cx="20" cy="20" rx="18" ry="15" />'
      : '<rect x="3.5" y="3.5" width="33" height="33" rx="3" />';
  return `<svg class="stamp ${gone ? 'is-gone' : ''}" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="transform:rotate(${def.tilt}deg)">
    <g class="stamp-ink">${frame}<text x="20" y="${two ? 25 : 27}" text-anchor="middle" font-size="${two ? 13 : 19}">${esc(text)}</text></g></svg>`;
}

// 인물 이름 + 도장 (사건 문서·대사에 쓴다)
export function speaker(id, state = null) {
  if (!id) return '';
  if (typeof id === 'object') return `<span class="speaker">${stamp(null, { name: id.name, size: 26 })}<b>${esc(id.name)}</b></span>`;
  return `<span class="speaker">${stamp(id, { state, size: 26 })}<b>${esc(CAST[id].short)}</b></span>`;
}

// 선택지 아래 한마디: [인물 id, 대사]
export function sayLine(say, state = null) {
  if (!say) return '';
  const [id, line] = say;
  return `<span class="say">${stamp(id, { state, size: 28 })}<span><b>${esc(CAST[id]?.short ?? id)}</b>"${esc(line)}"</span></span>`;
}
