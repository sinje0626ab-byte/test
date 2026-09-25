import { art, M } from './itemArt.js';

// 스킬 배지·건설 아이콘. 아이템 아이콘과 같은 외곽선·명암·팔레트(itemArt.js)를 쓴다.
const { Brush, P, hl, ln, circ, dot, shadow, O, THIN, INK, dark } = art;
const svg = (b, body, cls) => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><defs>${b.defs.join('')}</defs>${body}</svg>`;

// ── 스킬: 갈래 색 원 배지 + 흰 문장 (24 격자 문장을 가운데로 키운다) ──
const GLYPH = {
  power: '<path d="M6 18L16 8l2 2L8 20z" fill="#fff"/><path d="M15 5l4 4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  combo: '<path d="M5 17L14 8M9 19L18 10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  whirl: '<path d="M12 5a7 7 0 1 1-6.5 4.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M4 6l2 4 4-2" fill="#fff"/>',
  crit: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.6 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill="#fff"/>',
  weapon_master: '<path d="M5 19L17 7M7 5l12 12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  dash_slash: '<path d="M3 12h10M3 8h6M3 16h6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M13 5l7 7-7 7z" fill="#fff"/>',
  gatherSpeed: '<path d="M6 19l8-8M12 5l7 7-3 1-5-5z" fill="#fff" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
  vitality: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="#fff"/>',
  gatherAmount: '<circle cx="9" cy="14" r="4" fill="#fff"/><circle cx="15" cy="10" r="4" fill="#fff" opacity=".8"/>',
  swift: '<path d="M4 16h10l4-5-3-5H9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M3 11h6" stroke="#fff" stroke-width="2.5"/>',
  thick_skin: '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" fill="#fff"/>',
  forager: '<path d="M12 21V10M12 12c-4 0-6-3-6-6 4 0 6 3 6 6zM12 10c4 0 6-3 6-6-4 0-6 3-6 6z" fill="#fff" stroke="#fff" stroke-width="1.5"/>',
  first_aid: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill="#fff"/>',
  thrift: '<circle cx="12" cy="12" r="7" fill="none" stroke="#fff" stroke-width="3"/><path d="M12 8v8M9.5 10h4" stroke="#fff" stroke-width="2"/>',
  turretPower: '<rect x="7" y="11" width="10" height="9" rx="1" fill="#fff"/><path d="M12 11V5l5 3" stroke="#fff" stroke-width="2.5" fill="none"/>',
  turretCount: '<rect x="3" y="12" width="7" height="8" fill="#fff"/><rect x="14" y="12" width="7" height="8" fill="#fff"/><path d="M12 3v6M9 6h6" stroke="#fff" stroke-width="2.5"/>',
  mason: '<rect x="3" y="6" width="8" height="5" fill="#fff"/><rect x="13" y="6" width="8" height="5" fill="#fff"/><rect x="7" y="13" width="10" height="5" fill="#fff"/>',
  sharpshooter: '<circle cx="12" cy="12" r="7" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="12" cy="12" r="2.5" fill="#fff"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="#fff" stroke-width="2"/>',
  overclock: '<path d="M13 2L5 14h6l-2 8 8-12h-6z" fill="#fff"/>',
};

export function skillArt(id, color, cls = 'skill-svg') {
  const b = new Brush();
  let s = circ(24, 25, 21, dark(color, 0.35), '');
  s += circ(24, 24, 21, b.f(color));
  s += `<circle cx="24" cy="24" r="17.5" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>`;
  s += `<g transform="translate(8.4 8.4) scale(1.3)" stroke-linejoin="round">${GLYPH[id] ?? ''}</g>`;
  s += hl('M11 16c2-4 5.6-6.6 9.6-7.4', 0.5, 1.6);
  return svg(b, s, cls);
}

// ── 건설: 포탑·부속 건물·벽 ──
const base = (b, c) => P('M12 41l3-15h18l3 15z', b.f(c)) + ln('M13.4 34h21.2M14.6 29h18.8', dark(c, 0.4), 0.5);
const BUILD = {
  wood_bow: (b) => base(b, M.wood) + P('M14 26h20v-4H14z', b.f(M.darkwood)) + P('M17 9c10 1 14 6 14 12', 'none', `stroke="${M.darkwood}" stroke-width="3" stroke-linecap="round"`) + ln('M17 9l14 12', '#f3ecd8', 1, 1) + P('M16 21l12-9', 'none', `stroke="${M.wood}" stroke-width="1.6"`) + P('M27 10.5l3-1-1 3z', '#9ea1a3', THIN),
  crossbow: (b) => base(b, M.stone) + P('M14 26h20v-4H14z', b.f(M.darkwood)) + P('M24 8v14', 'none', `stroke="${M.darkwood}" stroke-width="3.4" stroke-linecap="round"`) + P('M12 13c6-4 18-4 24 0', 'none', `stroke="${M.iron}" stroke-width="3" stroke-linecap="round"`) + ln('M12 13l12 5 12-5', '#f3ecd8', 1, 1) + P('M22.6 4h2.8l-1.4-3z', b.f(M.steel), THIN),
  gun: (b) => base(b, M.iron) + P('M15 26h18v-7H15z', b.f('#6f7d8c')) + P('M24 20h16v5H24z', b.f(M.steel)) + circ(40, 22.5, 2.4, b.f(M.iron), THIN) + circ(20, 22.5, 2, b.f(M.gold), THIN) + hl('M17 21h6', 0.5),
  cannon: (b) => P('M9 30l22-14 5 7-22 14z', b.f('#4a4f5a')) + circ(34, 19.6, 3.6, b.f('#3a3e47')) + circ(33.8, 19.6, 1.6, '#1e1a18', '') + circ(16, 36, 6.4, b.f(M.wood)) + circ(16, 36, 2, b.f(M.iron), THIN) + ln('M16 29.6v12.8M9.6 36h12.8', M.darkwood, 0.7, 1.2) + hl('M13 29l14-9', 0.4) + shadow(44, 14),
  poison_thrower: (b) => base(b, M.wood) + P('M15 25c0-8 4-13 9-13s9 5 9 13z', b.f('#79a95a')) + P('M24 12V6', 'none', `stroke="${M.iron}" stroke-width="3" stroke-linecap="round"`) + P('M20 18h8', 'none', `stroke="${dark('#79a95a', 0.35)}" stroke-width="1.4"`) + P('M31 8c1.6 2.4 2 4 0 5.4-2-1.4-1.6-3 0-5.4z', b.f('#b8e05a'), THIN) + hl('M18 22c0-4 2-7 4-8', 0.5),
  frost_tower: (b) => base(b, '#7f98ae') + circ(24, 15, 11, b.glow('#cfefff', 0.6), '') + P('M24 3l5 9-2 10h-6l-2-10z', b.f(M.ice), O, 'fill-opacity=".92"') + ln('M24 3v19M19 12l5 2 5-2', '#fff', 0.6) + P('M17 20l3 4M31 20l-3 4', 'none', `stroke="${M.ice}" stroke-width="2.4" stroke-linecap="round"`),

  workbench: (b) => shadow(43, 16) + P('M8 20h32v5H8z', b.f(M.wood)) + P('M11 25h4v16h-4zM33 25h4v16h-4z', b.f(M.darkwood)) + P('M13 34h22', 'none', `stroke="${M.darkwood}" stroke-width="2.4"`) + P('M16 11l12 0 3 3-15 3z', b.f(M.steel), THIN) + P('M31 7l3 3-7 7-3-3z', b.f(M.wood), THIN) + P('M31 6l5 1 1 5-3 1-3-4z', b.f(M.iron), THIN) + hl('M10 21.6h12', 0.55),
  storage: (b) => shadow(43, 15) + P('M9 18h30v23H9z', b.f(M.wood)) + P('M8 12h32l-1 7H9z', b.f(dark(M.wood, 0.1))) + ln('M9 26h30M9 33.6h30', M.darkwood, 0.6, 1.2) + P('M21 22h6v7h-6z', b.f(M.gold), THIN) + dot(24, 25.6, 1, INK) + hl('M11 14h10', 0.55),
  shop: (b) => shadow(43, 17) + P('M10 24h28v17H10z', b.f(M.wood)) + P('M7 12h34l-2 9H9z', b.f('#e0645a')) + P('M13.6 12l-1.4 9M20.4 12l-.8 9M27.6 12l.8 9M34.4 12l1.4 9', 'none', 'stroke="#fff4e0" stroke-width="3.2"') + P('M7 12h34l-2 9H9z', 'none') + P('M14 28h8v6h-8z', b.f('#79a95a'), THIN) + P('M26 28h8v6h-8z', b.f(M.red), THIN) + P('M8 21c2 3 5 3 7 0 2 3 5 3 7 0 2 3 5 3 7 0 2 3 5 3 7 0 2 3 3 3 4 0', 'none', `stroke="${INK}" stroke-width="1.2"`),
  campfire: (b) => shadow(42, 15) + circ(24, 28, 15, b.glow('#ffb35c', 0.55), '') + P('M10 38l26-8 2 4-26 8z', b.f(M.bark)) + P('M38 38l-26-8-2 4 26 8z', b.f(M.wood)) + P('M24 10c6 7 9 12 9 17a9 9 0 0 1-18 0c0-5 3-10 9-17z', b.f('#f09a3a')) + P('M24 18c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z', b.f('#ffd98a'), THIN) + circ(10, 40, 2.4, b.f(M.stone), THIN) + circ(38, 40, 2.4, b.f(M.stone), THIN),
  garden: (b) => shadow(43, 17) + P('M6 30h36l-3 10H9z', b.f('#8a5a3a')) + P('M6 30c6-3 30-3 36 0', 'none', `stroke="${INK}" stroke-width="1.4"`) + ['12', '24', '36'].map((x) => P(`M${x} 29v-7`, 'none', `stroke="${M.moss}" stroke-width="1.8" stroke-linecap="round"`) + P(`M${x} 23c3-3 6-3 7-1-3 2-5 2.4-7 1z`, b.f(M.leaf), THIN) + P(`M${x} 25c-3-3-6-3-7-1 3 2 5 2.4 7 1z`, b.f(M.leaf), THIN)).join('') + ln('M10 35h28', '#5e3e28', 0.5, 1.2),
  forge: (b) => shadow(43, 16) + P('M8 16h14v25H8z', b.f(M.stone)) + P('M11 28h8v8h-8z', b.f('#3a2a20')) + circ(15, 32, 5, b.glow('#ffb35c', 0.8), '') + P('M12 36c1-4 5-4 6 0z', b.f('#f09a3a'), THIN) + P('M24 27h17l-3 4h-3v6h4v4H25v-4h4v-6h-2l-3-4z', b.f('#5a5f68')) + hl('M26 28.6h11', 0.5) + P('M10 16V9h4v7', b.f(M.stone), THIN),
  board: (b) => shadow(43, 13) + P('M13 36h3v6h-3zM32 36h3v6h-3z', b.f(M.darkwood)) + P('M9 9h30v28H9z', b.f(M.wood)) + P('M12 12h24v22H12z', b.f('#c89a64'), THIN) + P('M14 14h9v9h-9z', b.f(M.paper), THIN) + P('M25 16h9v8h-9z', b.f('#f6eed6'), THIN) + P('M17 25h10v7H17z', b.f(M.paper), THIN) + dot(18.5, 14.6, 1.2, M.red) + dot(29.5, 16.6, 1.2, '#5a9fd6') + dot(22, 25.6, 1.2, M.red) + ln('M15.6 18h6M15.6 20.4h5M26.6 19.6h6M18.6 28h7', INK, 0.4),
  wall: (b) => shadow(43, 17) + [10, 20, 30].map((x) => P(`M${x} 12l4-4 4 4v29h-8z`, b.f(M.wood)) + hl(`M${x + 2} 14v24`, 0.4)).join('') + P('M6 18h36v4H6zM6 30h36v4H6z', b.f(M.darkwood)),
  stone_wall: (b) => shadow(43, 17) + P('M6 12h17v9H6zM25 12h17v9H25z', b.f(M.stone)) + P('M6 23h9v9H6zM17 23h14v9H17zM33 23h9v9h-9z', b.f(dark(M.stone, 0.08))) + P('M6 34h17v7H6zM25 34h17v7H25z', b.f(M.stone)) + hl('M8 14h10M27 14h10', 0.5) + P('M26 24c2 1 4 1 5 0', 'none', `stroke="${M.moss}" stroke-width="2"`),
};

export function buildArt(id, cls = 'build-svg') {
  const b = new Brush();
  return svg(b, (BUILD[id] ?? BUILD.storage)(b), cls);
}
