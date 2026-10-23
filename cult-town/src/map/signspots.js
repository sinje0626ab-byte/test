// 간판 자리 (27장): 건물 하나의 간판들이 어디에 걸리나. TownScene(signs.js)이 그리고 tools/build-map.mjs 가 겹침을 검사한다.
// 건물 모양: 지붕 한 칸 (b.y) · 위층 창 띠 (5칸 건물만) · 1층 세 칸. 간판은 1층 맨 윗줄(처마), 위층 가게 간판은 창 띠 양 끝.
import { PLACES } from '../data/places.js';
import { SHOPS } from '../data/shops.js';

const T = 16;
export const SIGN_W = (text) => text.length * 7 + 6;    // Galmuri7 8px: 글자 하나 ≈ 7px + 여백

// → [{ cx, top, text, color, small }]  (color 는 PLACE_COLORS 의 type 이름이거나 숫자)
export function signSpots(b) {
  const out = [];
  const groundTop = (b.y + b.h - 3) * T + 2;
  const upperTop = (b.y + 1) * T + 3;
  const cx = (b.x + b.w / 2) * T;
  if (b.kind === 'mall' && b.signs) {
    // 위층 가게: 창 띠 왼쪽 끝 · 오른쪽 끝 (성소 건물은 오른쪽을 성소 간판에 비워 둔다)
    const ups = b.signs.slice(0, -1).filter((id) => id && SHOPS[id]).slice(0, b.place === 'sanctuary' ? 1 : 2);
    ups.forEach((id, k) => {
      const w = SIGN_W(SHOPS[id].sign);
      const x = k === 0 ? b.x * T + 3 + w / 2 : (b.x + b.w) * T - 3 - w / 2;
      out.push({ cx: x, top: upperTop, text: SHOPS[id].sign, color: SHOPS[id].color, small: true });
    });
    const g = b.signs.at(-1);
    if (g && SHOPS[g]) out.push({ cx, top: groundTop, text: SHOPS[g].sign, color: SHOPS[g].color, small: true });
    if (b.place === 'sanctuary') out.push({ cx: b.x * T + 3 + SIGN_W('동림상가') / 2, top: b.y * T + 3, text: '동림상가', color: 'ours', small: true });   // 오른쪽은 성소 큰 간판 자리
    else if (b.place && PLACES[b.place]) out.push({ cx, top: b.y * T + 3, text: PLACES[b.place].name, color: PLACES[b.place].type, small: true });
    return out;
  }
  if (b.shop && SHOPS[b.shop]) return [{ cx, top: groundTop, text: SHOPS[b.shop].sign, color: SHOPS[b.shop].color, small: true }];
  if (b.place && PLACES[b.place]) {
    const p = PLACES[b.place];
    const label = p.name.replace(' 신림역점', '');
    if (p.type === 'home') return [{ cx: (b.door + 0.5) * T, top: groundTop, text: label, color: 'home', small: true }];
    return [{ cx, top: groundTop, text: label, color: p.type, small: true }];
  }
  return out;
}
