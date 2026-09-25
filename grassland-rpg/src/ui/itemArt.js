// 아이템 아이콘 아트 (48×48 SVG). 모든 아이콘이 같은 규칙을 따른다.
//   - 따뜻한 짙은 갈색 외곽선 하나 (O)
//   - 재질마다 정해진 팔레트(M)와 왼쪽 위 → 오른쪽 아래 명암 그라디언트
//   - 작은 흰 하이라이트, 바닥 그림자
//   - 희귀 이상은 등급 색의 은은한 뒷빛 (전설만 빛살)
// 게임 데이터(items.json)의 color 는 쓰지 않는다: 색은 재질 팔레트에서 고른다.

const INK = '#3b2d22';
const O = `stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`;
const THIN = `stroke="${INK}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"`;

// 재질 팔레트 (채도를 낮춘 자연색)
export const M = {
  wood: '#b07e4f', darkwood: '#7c5236', bark: '#8a6443', bamboo: '#b8b96a', twine: '#d9c48f',
  stone: '#9ea1a3', sand: '#d6ae76', steel: '#b9c3cb', iron: '#8f969c', gold: '#e0b34a', bronze: '#c08a4a',
  leather: '#94603c', cloth: '#d8c39a', leaf: '#7fae55', grass: '#93b95c', moss: '#6f914c',
  fur: '#ece6da', ice: '#a9d8ec', frost: '#cfeaf5', jelly: '#8fcf7e', pink: '#e59ab8', red: '#c9584e',
  amber: '#e2a13c', violet: '#9a7fd0', glass: '#dcecef', paper: '#efe2bd', cactus: '#79a95a',
};

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mix(c, to, t) {
  const a = hex(c);
  const b = hex(to);
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}
const light = (c, t = 0.4) => mix(c, '#ffffff', t);
const dark = (c, t = 0.3) => mix(c, '#1e140c', t);

let uid = 0;
// 아이콘 하나를 그리는 붓. 그라디언트 id는 아이콘마다 새로 (숨은 창의 defs에 기대지 않게)
class Brush {
  constructor() {
    this.id = `ia${(uid = (uid + 1) % 1e6)}`;
    this.defs = [];
    this.cache = new Map();
  }

  // 명암 채우기: 밝은 왼쪽 위 → 어두운 오른쪽 아래
  f(c, k = 1) {
    const key = `f${c}${k}`;
    if (!this.cache.has(key)) {
      const id = `${this.id}${this.cache.size}`;
      this.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light(c, 0.34 * k)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${dark(c, 0.28 * k)}"/></linearGradient>`);
      this.cache.set(key, `url(#${id})`);
    }
    return this.cache.get(key);
  }

  // 둥근 빛 (뒷빛·발광)
  glow(c, o = 0.5) {
    const key = `g${c}${o}`;
    if (!this.cache.has(key)) {
      const id = `${this.id}${this.cache.size}`;
      this.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`);
      this.cache.set(key, `url(#${id})`);
    }
    return this.cache.get(key);
  }
}

// ── 조각들 ───────────────────────────────────────
const P = (d, fill, line = O, extra = '') => `<path d="${d}" fill="${fill}" ${line} ${extra}/>`;
const hl = (d, o = 0.6, w = 1.4) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const ln = (d, c = INK, o = 0.45, w = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const circ = (x, y, r, fill, line = O) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${line}/>`;
const dot = (x, y, r, fill, o = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" fill-opacity="${o}"/>`;
const shadow = (y = 43, w = 13) => `<ellipse cx="24" cy="${y}" rx="${w}" ry="2.4" fill="#3b2d22" fill-opacity=".16"/>`;
const rot = (a, s) => `<g transform="rotate(${a} 24 24)">${s}</g>`;

// 손잡이 (칼·창·망치 공용): 세로, x 24 중심
function grip(b, y1, y2, c = M.leather, w = 2.6) {
  let s = P(`M${24 - w} ${y1}h${w * 2}v${y2 - y1}h${-w * 2}z`, b.f(c));
  for (let y = y1 + 2.2; y < y2 - 1; y += 2.6) s += ln(`M${24 - w} ${y}l${w * 2} 1.4`, INK, 0.35);
  return s;
}

// ── 무기 ─────────────────────────────────────────
// 검: 세로로 그린 뒤 45° 기울인다
function sword(b, o) {
  const hw = o.width ?? 3.2;
  const top = 3;
  const base = o.long ? 32 : 30;
  let s = '';
  if (o.glow) s += circ(24, 18, 15, b.glow(o.glow, 0.55), '');
  if (o.kind === 'twig') {
    // 손으로 깎은 나뭇가지: 살짝 휜 몸, 옹이, 끈으로 묶은 가로대
    s += P(`M23 ${top + 1}C26 6 26.5 10 26 16 25.6 22 26.4 26 26 ${base}H21.6C21.8 25 21.2 20 21.8 14 22.2 9 21.2 6 23 ${top + 1}Z`, b.f(M.wood));
    s += ln('M23.4 9c.6 3 .4 6 .2 9M24.6 20c.3 3 .2 5 0 8', M.darkwood, 0.7);
    s += circ(23.6, 17, 1, M.darkwood, '');
    s += hl('M22.6 7c-.4 3-.4 6-.4 9');
    s += P(`M15.5 ${base}L32.5 ${base - 1.6}l.6 3-17 1.6z`, b.f(M.bark));
    s += P(`M21.4 ${base - 1.4}l5.4 4.2M26.6 ${base - 1.6}l-5.4 4.4`, 'none', `stroke="${M.twine}" stroke-width="1.6" stroke-linecap="round"`);
    s += grip(b, base + 3, 42, M.bark, 2.3);
    s += circ(24, 43.6, 1.9, b.f(M.darkwood));
    return rot(45, s);
  }
  const blade = o.blade;
  const bladeD = `M24 ${top}L${24 + hw} ${top + hw * 1.5}V${base}H${24 - hw}V${top + hw * 1.5}Z`;
  s += P(bladeD, b.f(blade), O, o.clear ? 'fill-opacity=".9"' : '');
  // 오른쪽 반을 살짝 어둡게 = 날의 경사면
  s += `<path d="M24 ${top}L${24 + hw} ${top + hw * 1.5}V${base}H24Z" fill="${dark(blade, 0.25)}" fill-opacity=".45"/>`;
  s += ln(`M24 ${top + 3}V${base - 1}`, dark(blade, 0.4), 0.5, 0.9);
  s += hl(`M${24 - hw + 1} ${top + hw * 1.5 + 1}V${base - 2}`, 0.7);
  if (o.facets) s += ln(`M${24 - hw} 12l${hw * 2} 4M${24 - hw} 21l${hw * 2} -3`, '#fff', 0.55);
  if (o.rune) s += `<path d="M24 12l1.6 2.6L24 17.2 22.4 14.6z" fill="${o.rune}" fill-opacity=".95"/>`;
  const gw = o.guardW ?? 8;
  s += P(`M${24 - gw} ${base}h${gw * 2}a1.8 1.8 0 0 1 0 3.6h${-gw * 2}a1.8 1.8 0 0 1 0-3.6z`, b.f(o.guard ?? M.bronze));
  if (o.guardTips) s += circ(24 - gw - 0.6, base + 1.8, 1.6, b.f(o.guard)) + circ(24 + gw + 0.6, base + 1.8, 1.6, b.f(o.guard));
  s += grip(b, base + 3.6, 42, o.grip ?? M.leather);
  s += circ(24, 43.8, 2.2, b.f(o.pommel ?? o.guard ?? M.bronze));
  if (o.gem) s += circ(24, base + 1.8, 1.5, b.f(o.gem), THIN);
  return rot(45, s);
}

// 창: 긴 자루 + 창날
function spear(b, o) {
  let s = '';
  if (o.glow) s += circ(24, 10, 11, b.glow(o.glow, 0.5), '');
  // 자루
  if (o.bamboo) {
    s += P('M22.4 13h3.2v33h-3.2z', b.f(M.bamboo));
    for (const y of [20, 28, 36]) s += ln(`M22.4 ${y}h3.2`, dark(M.bamboo, 0.4), 0.8, 1.2);
    s += hl('M23.2 15v4M23.2 22v5M23.2 30v5', 0.5, 1);
  } else {
    s += P('M22.6 13h2.8v33h-2.8z', b.f(o.shaft ?? M.wood));
    s += hl('M23.4 16v26', 0.4, 0.9);
  }
  // 창날
  const head = o.head;
  if (o.kind === 'stinger') {
    s += P('M24 2C31 5 30.5 12 26 16.5L22 16.5C23.5 12 25.5 9 23 6.5 22 5.6 22.4 3 24 2Z', b.f(head));
    s += ln('M25.5 6c1.6 2.2 1.4 5.6-.4 8.4', dark(head, 0.4), 0.6);
    s += hl('M23.8 4.2c1.8.4 3.2 1.6 3.6 3.2', 0.55, 1);
  } else if (o.kind === 'ice') {
    s += P('M24 1l4 9-1.4 8h-5.2L20 10z', b.f(head), O, 'fill-opacity=".92"');
    s += ln('M24 1v17M20 10l4 2 4-2', '#fff', 0.6);
  } else if (o.kind === 'point') {
    // 대나무 창: 깎은 돌촉을 끈으로 묶었다
    s += P('M24 2l3.6 7-1 6.6h-5.2L20.4 9z', b.f(M.stone));
    s += ln('M24 2.5l-.6 12', '#fff', 0.45);
  } else {
    s += P('M24 1.5C28 6 28.4 10.5 24 17 19.6 10.5 20 6 24 1.5Z', b.f(head));
    s += `<path d="M24 1.5C28 6 28.4 10.5 24 17Z" fill="${dark(head, 0.25)}" fill-opacity=".45"/>`;
    s += hl('M23 5c-1 2.4-1.2 5-.4 7.4', 0.7);
  }
  // 이음쇠
  s += P('M21.8 15.6h4.4v3.2h-4.4z', b.f(o.socket ?? (o.bamboo ? M.twine : M.iron)), THIN);
  if (o.tassel) s += P('M26 18c3 1 4.4 3.6 4 7-1.6-1.4-3.2-2.2-4.4-2.4z', b.f(o.tassel), THIN);
  return rot(45, s);
}

// 망치: 짧은 자루 + 무거운 머리
function hammer(b, o) {
  let s = '';
  if (o.glow) s += circ(24, 12, 13, b.glow(o.glow, 0.5), '');
  s += P('M22.4 16h3.2v27h-3.2z', b.f(o.shaft ?? M.wood));
  s += hl('M23.2 19v20', 0.4, 0.9);
  s += grip(b, 34, 43, o.grip ?? M.leather, 1.9);
  const hc = o.head;
  if (o.kind === 'rock') {
    s += P('M11 10.5L15 5.5 27 4.5 36 7.5 37.5 15.5 33 19.5 16 20 11.5 17z', b.f(hc));
    s += `<path d="M15 5.5L27 4.5 36 7.5 24 10z" fill="#fff" fill-opacity=".22"/>`;
    s += ln('M24 10l-2 9.6M24 10l9-2.4', dark(hc, 0.4), 0.55);
    // 끈 묶음
    s += P('M20.6 8.5l6.8-.4.4 12.2-6.8.2z', 'none', `stroke="${M.twine}" stroke-width="1.8"`);
    s += ln('M20.8 12.5l6.8-.3M20.9 16.4l6.8-.3', M.twine, 0.9, 1.6);
  } else if (o.kind === 'mace') {
    s += circ(24, 11, 8.6, b.f(hc));
    for (const [x, y] of [[24, 1.6], [15, 7.5], [33, 7.5], [16.5, 16.5], [31.5, 16.5]]) s += P(`M${x} ${y}l1.6 1.6-1.6 1.6-1.6-1.6z`, b.f(M.iron), THIN);
    s += `<path d="M17 9c2-4 7-5 10-3 2 1 1 3-1 3-3 0-4 3-6 3-2 1-4 0-3-3z" fill="${M.moss}" fill-opacity=".9"/>`;
    s += dot(28.5, 14, 1.8, M.moss, 0.9);
    s += hl('M19 6.5c1.6-1.4 3.4-2 5-2', 0.55);
  } else if (o.kind === 'ice') {
    s += P('M10 7.5L16 3.5h16l6 4-1 10-6 3.4H17l-6-3.4z', b.f(hc), O, 'fill-opacity=".94"');
    s += ln('M16 3.5l2 8.5-7 5.5M32 3.5l-2 8.5 7 5.5M18 12h12M17 21l1-9M31 21l-1-9', '#fff', 0.55);
  } else {
    // 사암 망치: 층이 보이는 큰 덩어리
    s += P('M9.5 5.5h29l1 14.5h-31z', b.f(hc));
    s += ln('M9.4 10.2h29.4M9 15.2h30.4', dark(hc, 0.3), 0.55, 1.2);
    s += ln('M16 5.5l-.6 4.7M29 10.2l.6 5M20 15.2l-.4 4.8', dark(hc, 0.35), 0.45);
    s += hl('M11 7.5h8', 0.6);
    s += P('M20.6 4h6.8v17.5h-6.8z', b.f(M.iron), THIN, 'fill-opacity=".85"');
  }
  return rot(40, s);
}

// 활: 휜 활대 + 시위 + 손잡이
function bow(b, o) {
  const c = o.limb;
  let s = '';
  if (o.glow) s += circ(24, 24, 17, b.glow(o.glow, 0.45), '');
  // 활대 (바깥 곡선 + 안쪽 곡선으로 두께)
  s += P(`M17.5 3.5C29 9 36 16.5 36 24S29 39 17.5 44.5L16.8 42C26.6 37 32.6 31 32.6 24S26.6 11 16.8 6Z`, b.f(c));
  if (o.recurve) {
    s += P('M17.5 3.5c-2.6-.4-4 .8-4.4 2.8l1.8.4c.6-1 1.2-1.4 1.9-.7z', b.f(c), THIN);
    s += P('M17.5 44.5c-2.6.4-4-.8-4.4-2.8l1.8-.4c.6 1 1.2 1.4 1.9.7z', b.f(c), THIN);
  }
  s += hl('M19.5 7.5c7 4 11.4 9.6 12.4 15', 0.55);
  // 시위
  s += `<path d="M17 5.2V42.8" stroke="#f3ecd8" stroke-width="1.1"/>`;
  s += `<path d="M17 5.2V42.8" stroke="${INK}" stroke-opacity=".35" stroke-width=".5" transform="translate(.6 0)"/>`;
  // 손잡이
  s += P('M31.4 20.2h5v7.6h-5z', b.f(o.grip ?? M.leather), THIN);
  s += ln('M31.4 22.6h5M31.4 25.2h5', INK, 0.35);
  if (o.deco) s += o.deco(b);
  return rot(35, `<g transform="translate(-2.6 0)">${s}</g>`);
}

// ── 머리 ─────────────────────────────────────────
function leafHat(b) {
  let s = shadow(40, 15);
  s += P('M6 33c3-2 8-3 18-3s15 1 18 3c-2 3-9 4.4-18 4.4S8 36 6 33z', b.f(M.grass));
  s += P('M11 31C11 19 17 12 24 12s13 7 13 19c-4 1.6-22 1.6-26 0z', b.f(M.leaf));
  // 겹친 잎 무늬
  s += P('M13 30c1-7 4-12 10-15-1 6-4 11-10 15z', b.f(light(M.leaf, 0.12)), THIN);
  s += P('M35 30c-1-7-4-12-10-15 1 6 4 11 10 15z', b.f(dark(M.leaf, 0.08)), THIN);
  s += ln('M14 29c2-4 5-8 9-12M34 29c-2-4-5-8-9-12', dark(M.leaf, 0.4), 0.6);
  s += P('M24 12c0-3 1.4-5 4-6.4', 'none', `stroke="${M.moss}" stroke-width="1.8" stroke-linecap="round"`);
  s += P('M27.6 5.6c3.4-1.2 6 0 7 2.4-3.2 1-5.6.4-7-2.4z', b.f(M.leaf), THIN);
  s += hl('M15 22c1.6-3.4 4-6 7-7.6', 0.55);
  return s;
}

function mushroomHat(b) {
  const c = M.red;
  let s = shadow(40, 16);
  s += P('M10 31c3 2.4 25 2.4 28 0l-1.6 4c-4 1.8-20.8 1.8-24.8 0z', b.f('#e9dcc0'));
  for (let x = 14; x <= 34; x += 3) s += ln(`M${x} 32.6l-.4 2.6`, dark('#e9dcc0', 0.4), 0.5);
  s += P('M5 31C5 17 13 8 24 8s19 9 19 23c-5 2.6-33 2.6-38 0z', b.f(c));
  for (const [x, y, r] of [[16, 17, 3.2], [27, 13, 2.4], [33, 22, 2.8], [21, 25, 2.2], [10.5, 26, 1.8]]) s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="#f4ead6" ${THIN}/>`;
  s += hl('M10 22c2-6 6-10 11-11.6', 0.5);
  return s;
}

function desertHood(b) {
  const c = M.sand;
  let s = shadow(42, 14);
  s += P('M9 38C8 24 13 9 24 8c11 1 16 16 15 30-4 2-26 2-30 0z', b.f(c));
  s += P('M15 36c-1-9 3-18 9-18s10 9 9 18c-3 1.2-15 1.2-18 0z', b.f('#4a3a2c', 0.6));
  s += P('M13 21c6-3 16-3 22 0l.6 3.4c-7-2.6-16.2-2.6-23.2 0z', b.f('#b0613f'), THIN);
  s += ln('M13.6 28c-1.2 3-1.4 6-1 9M34.4 28c1.2 3 1.4 6 1 9', dark(c, 0.4), 0.5);
  s += P('M34 33l4 8 2-1', 'none', `stroke="#b0613f" stroke-width="1.6" stroke-linecap="round"`);
  s += hl('M14 17c2-4 5-6.4 8-7.4', 0.55);
  return s;
}

function furHat(b) {
  let s = shadow(41, 15);
  s += P('M11 30C11 19 17 13 24 13s13 6 13 17z', b.f('#8a6a52'));
  s += ln('M17 17c-1 4-1.4 8-1 12M24 13.4V29M31 17c1 4 1.4 8 1 12', INK, 0.25);
  // 털 테두리
  s += P('M7 31c1-2 3-2 4-1 1-2 3-2 4-1 1-2 3-2 4-1 1-2 3-2 4-1 1-2 3-2 4-1 1-2 3-2 4-1 1-2 3-2 4-1 1.6 1 1.6 5 0 6-1 1.6-3 1.4-4 .4-1 1.6-3 1.6-4 .4-1 1.6-3 1.6-4 .4-1 1.6-3 1.6-4 .4-1 1.6-3 1.6-4 .4-1 1.6-3 1.6-4 .4-1 1.6-3 1.6-4 .4-1.6-1-2-5 0-6z', b.f(M.fur));
  s += circ(24, 10, 4.4, b.f(M.fur));
  s += hl('M22 8c.8-1 2-1.4 3-1.2M15 20c1.4-2.4 3-4 5-5', 0.6);
  return s;
}

function crown(b, o) {
  let s = shadow(40, 14);
  if (o.glow) s += circ(24, 24, 17, b.glow(o.glow, 0.45), '');
  if (o.jelly) {
    const c = M.pink;
    s += P('M9 34V17l6 6 5-10 4 8 4-8 5 10 6-6v17c-5 2.4-25 2.4-30 0z', b.f(c), O, 'fill-opacity=".92"');
    s += P('M14 34c0 3 2.6 3 2.6 0M26 34.6c0 4 3 4 3 0', b.f(c), THIN);
    s += circ(24, 27, 3, b.f(M.gold));
    s += hl('M12 20v10M19.6 17l-1.4 3', 0.7);
    return s;
  }
  // 선인장 왕관: 금 띠 + 선인장 봉오리 끝 + 꽃
  s += P('M9 35V20l5 4 4-10 6 7 6-7 4 10 5-4v15c-5 2.4-25 2.4-30 0z', b.f(M.gold));
  s += P('M9 30c5 1.6 25 1.6 30 0v5c-5 2.4-25 2.4-30 0z', b.f(dark(M.gold, 0.12)), THIN);
  for (const [x, y] of [[14, 14], [24, 21], [34, 14]]) s += circ(x, y - 1, 2.6, b.f(M.cactus), THIN);
  s += P('M24 25l1.8 2.6 3-.6-1.2 2.8 1.2 2.8-3-.6L24 35.2l-1.8-2.6-3 .6 1.2-2.8-1.2-2.8 3 .6z', b.f(M.pink), THIN);
  s += circ(24, 30, 1.3, M.gold, '');
  for (const x of [13, 35]) s += circ(x, 32.4, 1.4, b.f(M.red), THIN);
  s += hl('M11 22v7', 0.6);
  return s;
}

// ── 몸 ───────────────────────────────────────────
const TUNIC = 'M16 7l8 4.4L32 7l9 6.4-4 8.4-3-1.6V42H14V20.2l-3 1.6-4-8.4z';
function grassTunic(b) {
  let s = shadow(44, 12);
  s += P(TUNIC, b.f(M.grass));
  s += P('M14 36l3 6 3.4-5 3.6 5 3.6-5 3.4 5 3-6v6H14z', b.f(M.leaf), THIN);
  s += P('M18.6 8.8L24 13l5.4-4.2c-.6 4-2.6 7-5.4 7s-4.8-3-5.4-7z', b.f(M.leaf), THIN);
  s += P('M14 27h20v3.4H14z', b.f(M.twine), THIN);
  s += circ(24, 28.7, 1.8, b.f(M.wood), THIN);
  s += ln('M18 18c-1 3-1 6 0 8M30 18c1 3 1 6 0 8', dark(M.grass, 0.4), 0.45);
  s += hl('M10 14l3.4 6M16.6 21v4', 0.5);
  return s;
}

function leatherVest(b) {
  const c = M.leather;
  let s = shadow(44, 12);
  s += P('M16 7.4l5.6 4.2L24 30l2.4-18.4L32 7.4l3.6 3v31.6H12.4V10.4z', b.f(c));
  s += P('M21.6 11.6L24 30l2.4-18.4', 'none', THIN);
  s += `<path d="M14 12v28M34 12v28" stroke="${light(c, 0.45)}" stroke-width=".9" stroke-dasharray="1.6 1.6"/>`;
  for (const y of [16, 21, 26]) s += circ(21.4, y, 1.2, b.f(M.bronze), THIN);
  s += P('M12.4 34h23.2v3H12.4z', b.f(M.darkwood), THIN);
  s += hl('M15 13v16', 0.4);
  return s;
}

function desertCloak(b) {
  const c = '#c98a52';
  let s = shadow(44, 14);
  s += P('M16 8c2 2 14 2 16 0l8 32c-5 3-27 3-32 0z', b.f(c));
  s += P('M11 31c7 2 19 2 26 0l1 4c-7 2.2-21 2.2-28 0z', b.f('#e6c89a'), THIN);
  s += ln('M20 12l-3 26M28 12l3 26M24 12v27', dark(c, 0.4), 0.4);
  s += P('M14 9c5 4 15 4 20 0 0 4-4 7-10 7s-10-3-10-7z', b.f(M.cloth), THIN);
  s += circ(24, 15, 2.4, b.f(M.gold));
  s += dot(24, 15, 1, '#5aa0b8');
  s += hl('M15 14l-3 18', 0.45);
  return s;
}

function yetiCoat(b) {
  let s = shadow(44, 13);
  s += P(TUNIC, b.f('#9fb6c8'));
  s += ln('M24 13v29', INK, 0.4);
  for (const y of [19, 25, 31]) s += circ(25.8, y, 1.1, b.f(M.iron), THIN);
  const fluff = (x, y, w) => P(`M${x} ${y}c1-1.6 3-1.6 4 0 1-1.6 3-1.6 4 0 1-1.6 3-1.6 4 0 ${w > 12 ? '1-1.6 3-1.6 4 0 1-1.6 3-1.6 4 0' : ''}v3.4c-1 1.4-3 1.4-4 0-1 1.4-3 1.4-4 0-1 1.4-3 1.4-4 0${w > 12 ? '-1 1.4-3 1.4-4 0-1 1.4-3 1.4-4 0' : ''}z`, b.f(M.fur), THIN);
  s += fluff(14, 38.6, 20);
  s += P('M16 6c3 4 13 4 16 0l2 2c-2 5-18 5-20 0z', b.f(M.fur), THIN);
  s += P('M6.4 13c1.4 1.4 3 2 4.6 1.2l-1 3.4c-1.6 .6-3.4.2-4.6-1z', b.f(M.fur), THIN);
  s += P('M41.6 13c-1.4 1.4-3 2-4.6 1.2l1 3.4c1.6 .6 3.4.2 4.6-1z', b.f(M.fur), THIN);
  s += hl('M16 20v12', 0.4);
  return s;
}

// ── 발 ───────────────────────────────────────────
const BOOT = 'M13 7h13v20c7 1 13 3.4 13.4 9.4V40H13z';
function strawShoes(b) {
  let s = shadow(43, 16);
  s += P('M7 36c0-3 3-4.4 8-4.4h18c5 0 8 1.4 8 4.4s-3 4.4-8 4.4H15c-5 0-8-1.4-8-4.4z', b.f(M.twine));
  for (let x = 12; x <= 36; x += 3) s += ln(`M${x} 32.2l-1 7.6`, dark(M.twine, 0.4), 0.45);
  s += ln('M8.4 36h31.2', dark(M.twine, 0.45), 0.4);
  s += P('M16 32c2-6 14-6 16 0', 'none', `stroke="${M.bark}" stroke-width="2.6" stroke-linecap="round"`);
  s += P('M24 26v6', 'none', `stroke="${M.bark}" stroke-width="2.2" stroke-linecap="round"`);
  s += hl('M11 34h8', 0.55);
  return s;
}

function boot(b, o) {
  let s = shadow(43, 15);
  s += P(BOOT, b.f(o.c));
  s += P('M13 36.6h26.4V41H13z', b.f(o.sole ?? M.darkwood));
  if (o.laces) for (const y of [12, 17, 22]) s += ln(`M17 ${y}l6 2M23 ${y}l-6 2`, M.twine, 0.9, 1.2);
  if (o.cuff) s += P('M11.4 5c1-1.6 3-1.6 4 0 1-1.6 3-1.6 4 0 1-1.6 3-1.6 4 0 1-1.6 3-1.6 3.4 0v5.6c-1 1.4-3 1.4-4 0-1 1.4-3 1.4-4 0-1 1.4-3 1.4-4 0-1 1.4-2.6 1.4-3.4 0z', b.f(M.fur), THIN);
  else s += P('M12 7h15v4H12z', b.f(dark(o.c, 0.15)), THIN);
  if (o.stitch) s += `<path d="M15 30c6 0 14 1 20 3.6" fill="none" stroke="${light(o.c, 0.5)}" stroke-width=".9" stroke-dasharray="1.5 1.5"/>`;
  s += hl('M15.6 13v13', 0.45);
  return s;
}

function sandals(b) {
  let s = shadow(43, 16);
  s += P('M7 37c0-2.6 3-3.6 8-3.6h18c5 0 8 1 8 3.6s-3 3.6-8 3.6H15c-5 0-8-1-8-3.6z', b.f(M.sand));
  s += ln('M8.6 37.4h30.8', dark(M.sand, 0.4), 0.45);
  s += P('M14 34c0-6 3-9 6-9M34 34c0-6-3-9-6-9M20 25c2 3 6 3 8 0', 'none', `stroke="#b0613f" stroke-width="2.4" stroke-linecap="round"`);
  s += circ(24, 27, 2, b.f(M.gold), THIN);
  s += hl('M11 35.4h7', 0.6);
  return s;
}

// ── 장신구 ───────────────────────────────────────
function ring(b, o) {
  let s = shadow(42, 11);
  if (o.glow) s += circ(24, 22, 16, b.glow(o.glow, 0.45), '');
  s += `<path d="M24 20c8 0 12.6 4.6 12.6 10S32 40 24 40s-12.6-4.4-12.6-10S16 20 24 20zm0 4c-5.6 0-8.6 3-8.6 6s3 6 8.6 6 8.6-3 8.6-6-3-6-8.6-6z" fill="${b.f(M.gold)}" fill-rule="evenodd" ${O}/>`;
  s += hl('M14.4 28c1-3 4-5 8-5.4', 0.65);
  s += o.top(b);
  return s;
}

function pendant(b, o) {
  let s = '';
  if (o.glow) s += circ(24, 28, 15, b.glow(o.glow, 0.5), '');
  s += `<path d="M9 5c2 12 8 17 15 17S37 17 39 5" fill="none" stroke="${o.cord ?? M.bark}" stroke-width="1.6" stroke-linecap="round"/>`;
  s += o.charm(b);
  return s;
}

const clover = (b) => {
  let s = '';
  for (const [x, y] of [[20.4, 13], [27.6, 13], [20.4, 20], [27.6, 20]]) s += circ(x, y, 3.8, b.f(M.leaf), THIN);
  s += circ(24, 16.5, 1.6, b.f(M.gold), THIN);
  s += P('M24 21l1.4 4', 'none', `stroke="${M.moss}" stroke-width="1.6" stroke-linecap="round"`);
  return s + hl('M18.6 11.6c.6-1 1.6-1.4 2.6-1.2', 0.7);
};
const honeyGem = (b) => P('M24 9l6 3.6v7L24 23l-6-3.4v-7z', b.f(M.amber)) + ln('M20 14h8M20.6 18h6.8', '#5a3a1c', 0.55, 1.4) + hl('M21 12l2.6-1.4', 0.7);

function lantern(b) {
  let s = circ(24, 27, 14, b.glow('#bfeaff', 0.7), '');
  s += `<path d="M24 3v6" stroke="${M.iron}" stroke-width="1.6"/>` + circ(24, 4, 2.2, 'none', `stroke="${M.iron}" stroke-width="1.4"`);
  s += P('M16 11h16l-2 3H18z', b.f(M.bronze));
  s += P('M18 14h12l1.6 19H16.4z', b.f('#dff4ff'), O, 'fill-opacity=".75"');
  s += `<ellipse cx="24" cy="24" rx="4" ry="5.6" fill="#9fe3ff"/>` + dot(24, 23, 2.2, '#fff', 0.95);
  s += ln('M18.6 14l-1 19M29.4 14l1 19', M.bronze, 1, 1.4);
  s += P('M15 33h18l-1.6 3.4H16.6z', b.f(M.bronze));
  return s;
}

function lens(b) {
  let s = shadow(43, 11);
  s += P('M30 29l9 9.4-3.2 3.2-9.4-9z', b.f(M.darkwood));
  s += circ(21, 20, 11, b.f(M.gold));
  s += circ(21, 20, 8, b.f(M.glass), THIN);
  s += hl('M15.6 17c1-2.4 3-4 5.6-4.4', 0.9, 1.8);
  return s;
}

// ── 재료 ─────────────────────────────────────────
function jelly(b, c) {
  let s = shadow(41, 13);
  s += P('M9 35c-2-9 4-19 15-19s17 10 15 19c-1 4-29 4-30 0z', b.f(c), O, 'fill-opacity=".9"');
  s += dot(18, 29, 1.4, INK, 0.75) + dot(29, 29, 1.4, INK, 0.75);
  s += hl('M13 26c1-3 3.4-5 6-6', 0.8, 2);
  s += dot(31, 22, 1.6, '#fff', 0.7);
  return s;
}

function rock(b, c, o = {}) {
  let s = shadow(41, 15);
  s += P('M8 32l3-12 9-7 11 1 8 8 1 11-6 6H14z', b.f(c));
  s += `<path d="M11 20l9-7 11 1 8 8-12 3z" fill="#fff" fill-opacity=".2"/>`;
  s += ln('M27 25l-4 16M27 25l12-3M11 20l6 12 6 9', dark(c, 0.45), 0.5);
  if (o.ore) {
    for (const [x, y, r] of [[18, 24, 2.4], [31, 31, 2], [22, 34, 1.6], [33, 21, 1.4]]) s += P(`M${x} ${y - r}l${r} ${r}-${r} ${r}-${r}-${r}z`, b.f(M.steel), THIN);
    s += dot(15, 31, 1.4, '#c0703a', 0.8) + dot(28, 36, 1.1, '#c0703a', 0.8);
  }
  if (o.strata) s += ln('M9 27c8 2 20 2 31-1M10 34c9 2 20 2 29-1', dark(c, 0.3), 0.5, 1.3);
  s += hl('M13 21l6-5', 0.6);
  return s;
}

function crystals(b, c, glowC) {
  let s = shadow(42, 13) + circ(24, 24, 16, b.glow(glowC ?? c, 0.55), '');
  s += P('M14 40l-3-12 4-5 4 6 1 11z', b.f(c));
  s += P('M34 40l3-13-4-6-5 7-1 12z', b.f(c));
  s += P('M19 40l-1-20 6-12 6 12-1 20z', b.f(light(c, 0.1)));
  s += ln('M24 8v32M18 20l6 2 6-2', '#fff', 0.55);
  s += hl('M20.6 21l2.4-7', 0.8);
  return s;
}

function log(b) {
  let s = shadow(41, 16);
  s += P('M11 18l24-6c3-.6 6 3 6.6 8.4s-1.6 10-4.6 10.6l-24 6z', b.f(M.bark));
  s += ln('M16 20l20-5M16 29l21-5M18 34.6l17-4', dark(M.bark, 0.4), 0.55);
  s += `<ellipse cx="12" cy="27.6" rx="6" ry="9.6" transform="rotate(-14 12 27.6)" fill="${b.f('#e2c08c')}" ${O}/>`;
  s += `<ellipse cx="12" cy="27.6" rx="3.4" ry="5.8" transform="rotate(-14 12 27.6)" fill="none" stroke="#b0875a" stroke-width="1"/>`;
  s += dot(12, 27.6, 1.1, '#b0875a');
  s += hl('M18 16l14-3.4', 0.45);
  return s;
}

function fiberBundle(b) {
  let s = shadow(42, 12);
  for (let i = 0; i < 7; i++) {
    const x = 16 + i * 2.6;
    s += P(`M${x} 41C${x - 1} 30 ${x + (i - 3) * 1.4} 18 ${x + (i - 3) * 2.2} 6`, 'none', `stroke="${i % 2 ? M.grass : light(M.grass, 0.15)}" stroke-width="2.4" stroke-linecap="round"`);
  }
  s += P('M15 26h19v4.4H15z', b.f(M.twine), THIN);
  s += ln('M18 26v4.4M22 26v4.4M26 26v4.4M30 26v4.4', dark(M.twine, 0.4), 0.5);
  return s;
}

function herbSprig(b) {
  let s = shadow(42, 11);
  s += P('M24 42C24 32 23 20 25 8', 'none', `stroke="${M.moss}" stroke-width="2" stroke-linecap="round"`);
  const leaf = (x, y, a, sc = 1) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})">${P('M0 0c3-4 9-5 12-1-3 4-9 5-12 1z', b.f(M.leaf), THIN)}${ln('M1 0h9', dark(M.leaf, 0.45), 0.6)}</g>`;
  s += leaf(24, 30, -20) + leaf(24, 24, 200, 0.9) + leaf(24.6, 18, -35, 0.85) + leaf(24.6, 13, 215, 0.75) + leaf(25, 8.4, -70, 0.6);
  return s;
}

function drop(b, c, glow) {
  let s = shadow(42, 10);
  if (glow) s += circ(24, 27, 14, b.glow(c, 0.5), '');
  s += P('M24 6c6 9 11 15 11 22a11 11 0 0 1-22 0c0-7 5-13 11-22z', b.f(c), O, 'fill-opacity=".95"');
  s += hl('M18.6 25c.4-4 2.4-8 4.4-11', 0.75, 1.8);
  s += dot(28, 31, 1.6, '#fff', 0.45);
  return s;
}

function mushroomPiece(b) {
  let s = shadow(41, 12);
  s += P('M20 26h8l1.4 14h-10.8z', b.f('#efe2c6'));
  s += P('M7 27C7 17 15 10 24 10s17 7 17 17c-6 2-28 2-34 0z', b.f(M.red));
  for (const [x, y, r] of [[16, 18, 2.6], [27, 15, 2], [33, 22, 2.2], [22, 23, 1.6]]) s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="#f4ead6"/>`;
  s += hl('M12 20c1.6-4 4.6-6.6 8-7.6', 0.5);
  return s;
}

function spines(b) {
  let s = shadow(42, 13);
  const spine = (a) => `<g transform="rotate(${a} 24 26)">${P('M22.6 42L24 8l1.4 34z', b.f('#e8ddb4'), THIN)}${P('M22.6 42h2.8l-.6 2h-1.6z', b.f(M.cactus), THIN)}</g>`;
  s += spine(-28) + spine(4) + spine(30);
  return s;
}

function shards(b) {
  let s = shadow(42, 13) + circ(24, 26, 15, b.glow('#cff2ff', 0.5), '');
  s += P('M11 40l2-14 6-4 2 18z', b.f(M.ice), O, 'fill-opacity=".92"');
  s += P('M22 40l-2-22 7-12 5 13-1 21z', b.f(light(M.ice, 0.12)), O, 'fill-opacity=".92"');
  s += P('M31 40l2-12 5 3-1 9z', b.f(M.ice), O, 'fill-opacity=".92"');
  s += ln('M27 6l-2 34M20 18l7 3 5-2', '#fff', 0.6);
  return s;
}

function pulp(b) {
  let s = shadow(41, 14);
  s += P('M8 30c0-8 7-15 16-15s16 7 16 15c-3 6-29 6-32 0z', b.f(M.cactus));
  s += P('M11 30c0-6 6-11.6 13-11.6S37 24 37 30c-3 4-23 4-26 0z', b.f('#cfe3a4'), THIN);
  for (const [x, y] of [[17, 26], [22, 23], [28, 24], [31, 28], [20, 30], [26, 29]]) s += `<ellipse cx="${x}" cy="${y}" rx="1" ry=".7" fill="${M.moss}"/>`;
  s += hl('M12 23c2-3 5-5 8-6', 0.55);
  return s;
}

function seedPacket(b, pic) {
  let s = shadow(43, 12);
  s += P('M12 10h24l-1 31H13z', b.f(M.paper));
  s += P('M12 10l2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3z', b.f(dark(M.paper, 0.1)), THIN);
  s += circ(24, 25, 7.4, b.f('#fff8e6'), THIN);
  s += pic(b);
  s += ln('M17 36h14', INK, 0.35, 1.2);
  return s;
}

// ── 소모품 ───────────────────────────────────────
function flask(b, c, o = {}) {
  const r = o.big ? 12.6 : 11;
  const cy = o.big ? 29.4 : 30.6;
  const top = cy - r - (o.big ? 8 : 7);
  let s = shadow(43, 13);
  if (o.glow) s += circ(24, cy, r + 5, b.glow(o.glow, 0.45), '');
  s += circ(24, cy, r, b.f(M.glass));
  // 액체: 원의 아래쪽 (수면은 중심보다 조금 위)
  const rr = r - 1.8;
  const ly = cy - rr * 0.2;
  const w = Math.sqrt(rr * rr - (ly - cy) ** 2);
  s += `<path d="M${24 - w} ${ly}A${rr} ${rr} 0 1 0 ${24 + w} ${ly}Z" fill="${b.f(c)}"/>`;
  s += `<ellipse cx="24" cy="${ly}" rx="${w}" ry="1.4" fill="${light(c, 0.35)}"/>`;
  if (o.swirl) s += ln(`M18 ${cy + 3}c2-3 5-3 6 0s4 3 6 0`, '#fff', 0.6, 1.2);
  s += P(`M20.8 ${top}h6.4v${cy - r - top + 1.4}h-6.4z`, b.f(M.glass));
  if (o.ribbon) s += P(`M20.4 ${cy - r - 3}h7.2v2.4h-7.2z`, b.f(o.ribbon), THIN);
  s += P(`M20 ${top - 3.6}h8v4.4h-8z`, b.f(M.wood), THIN);
  s += hl(`M${24 - r + 3.4} ${cy - 1}c.4-3.4 2-6 4.4-7.4`, 0.9, 1.8);
  return s;
}

function apple(b) {
  let s = shadow(42, 12);
  s += P('M24 15c-4-3-13-3-14 6s4 19 10 19c2 0 3-1 4-1s2 1 4 1c6 0 11-10 10-19s-10-9-14-6z', b.f(M.red));
  s += P('M24 15c0-4 1-6 3-8', 'none', `stroke="${M.darkwood}" stroke-width="1.8" stroke-linecap="round"`);
  s += P('M25.4 11c3-3.6 7-3.6 9-1.6-3 3.4-6 3.6-9 1.6z', b.f(M.leaf), THIN);
  s += hl('M14.6 22c.6-3 2.4-4.6 4.6-5', 0.75, 2);
  return s;
}

function teaCup(b) {
  let s = shadow(42, 13);
  s += ln('M19 13c-2-3 2-4 0-8M25 13c-2-3 2-4 0-8', '#ffffff', 0.9, 1.6);
  s += P('M10 20h24l-2.4 14c-.6 4-4 6-8 6h-3.2c-4 0-7.4-2-8-6z', b.f('#e9dcc2'));
  s += P('M34 23c5 0 6 7 0 8', 'none', `stroke="${INK}" stroke-width="1.6"`);
  s += P('M34 23c5 0 6 7 0 8', 'none', 'stroke="#e9dcc2" stroke-width="1"');
  s += `<ellipse cx="22" cy="20.6" rx="11.4" ry="2" fill="#a88a4a"/>`;
  s += P('M16 28c3-4 7-4 9-1-3 3-6 3-9 1z', b.f(M.leaf), THIN);
  s += hl('M13 24l1 8', 0.6);
  return s;
}

function honeyJar(b) {
  let s = shadow(43, 13);
  s += P('M12 16h24c2 6 2 16 0 22-3 3-21 3-24 0-2-6-2-16 0-22z', b.f(M.glass), O, 'fill-opacity=".85"');
  s += P('M12.6 22h22.8c1 5 1 11 0 15.6-3 2.6-19.8 2.6-22.8 0-1-4.6-1-10.6 0-15.6z', b.f(M.amber));
  s += P('M11 11h26v5H11z', b.f(M.cloth));
  s += P('M11 16h26', 'none', `stroke="${M.bark}" stroke-width="1.8"`);
  s += P('M30 3l-3 14', 'none', `stroke="${M.wood}" stroke-width="2" stroke-linecap="round"`);
  s += P('M16 26c0 4 2 6 2 8', 'none', 'stroke="#fff" stroke-opacity=".6" stroke-width="1.8" stroke-linecap="round"');
  return s;
}

function tonic(b) {
  let s = shadow(43, 10) + circ(24, 30, 13, b.glow('#ffb45a', 0.4), '');
  s += P('M20.6 6h6.8v9c4 2 6 5 6 9v14c0 2-2 3-4 3H18.6c-2 0-4-1-4-3V24c0-4 2-7 6-9z', b.f(M.glass), O, 'fill-opacity=".85"');
  s += `<path d="M15.6 25h16.8v13c0 1.4-1.4 2-3 2h-10.8c-1.6 0-3-.6-3-2z" fill="${b.f('#d9763a')}"/>`;
  s += P('M24 27c3 3 3 6 0 9-3-3-3-6 0-9z', b.f('#ffd28a'), THIN);
  s += P('M20 3h8v4h-8z', b.f(M.darkwood), THIN);
  s += hl('M17.6 20v14', 0.8, 1.8);
  return s;
}

function juiceGlass(b) {
  let s = shadow(43, 12);
  s += P('M30 4l-5 20', 'none', `stroke="#d98a8a" stroke-width="2.2" stroke-linecap="round"`);
  s += P('M12 13h24l-3 27c-.4 2-2 2.4-4 2.4H19c-2 0-3.6-.4-4-2.4z', b.f(M.glass), O, 'fill-opacity=".8"');
  s += `<path d="M13.4 19h21.2l-2.4 20.4c-.2 1.6-1.4 2-3 2h-10.4c-1.6 0-2.8-.4-3-2z" fill="${b.f(M.cactus)}"/>`;
  s += P('M9 14c0-4 3-6 6-6s5 2 5 6z', b.f('#cfe3a4'), THIN);
  s += hl('M16 22l1.6 14', 0.7, 1.6);
  return s;
}

function scroll(b) {
  let s = shadow(42, 15);
  s += P('M10 14h26v22H10z', b.f(M.paper));
  s += ln('M15 20h16M15 24h14M15 28h16', INK, 0.3, 1.1);
  s += P('M7 12a3 3 0 0 1 6 0v26a3 3 0 0 1-6 0z', b.f(dark(M.paper, 0.08)));
  s += P('M35 12a3 3 0 0 1 6 0v26a3 3 0 0 1-6 0z', b.f(dark(M.paper, 0.08)));
  s += circ(33, 33, 3.6, b.f('#b0443a'));
  s += P('M31 36l-1.4 5M35 36l1.4 5', 'none', 'stroke="#b0443a" stroke-width="1.8" stroke-linecap="round"');
  s += dot(24, 9, 0, '#fff');
  return s;
}

function coins(b) {
  let s = shadow(42, 13);
  for (const [x, y] of [[18, 34], [30, 34], [24, 28], [24, 22]]) {
    s += `<ellipse cx="${x}" cy="${y + 2}" rx="8" ry="3.4" fill="${dark(M.gold, 0.25)}" ${O}/>`;
    s += `<ellipse cx="${x}" cy="${y}" rx="8" ry="3.4" fill="${b.f(M.gold)}" ${O}/>`;
    s += `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="1.6" fill="none" stroke="${dark(M.gold, 0.3)}" stroke-width=".9"/>`;
  }
  return s + hl('M19 20.6h4', 0.8);
}

function tentKit(b) {
  let s = shadow(42, 16);
  s += P('M7 36L22 10l15 26z', b.f('#d9a66a'));
  s += P('M22 10l15 26H22z', b.f(dark('#d9a66a', 0.12)), THIN);
  s += P('M22 22l-5 14h10z', b.f('#6a4a34'), THIN);
  s += ln('M22 10V6', M.darkwood, 1, 1.8);
  s += P('M22 6l6 2-6 2z', b.f(M.red), THIN);
  s += P('M28 38c0-3 2.6-5 7-5h6v7h-6c-4.4 0-7-1-7-2z', b.f(M.cloth), THIN);
  s += ln('M33 33v7', M.bark, 0.9, 1.6);
  s += hl('M12 32l8-15', 0.5);
  return s;
}

// ── 아이템별 아트 ────────────────────────────────
const ART = {
  gold: coins,
  tent_kit: tentKit,

  twig_sword: (b) => sword(b, { kind: 'twig' }),
  iron_sword: (b) => sword(b, { blade: M.steel, guard: M.iron, grip: M.leather, pommel: M.iron }),
  ice_sword: (b) => sword(b, { blade: M.ice, guard: '#7fa8c8', grip: '#5a6e8a', facets: true, clear: true, glow: '#cfefff' }),
  sun_blade: (b) => sword(b, { blade: '#efd9a0', guard: M.gold, grip: '#8a3a2c', gem: '#f08a3a', guardTips: true, rune: '#f3a04a', glow: '#ffe2a0' }),
  jelly_greatsword: (b) => sword(b, { blade: M.jelly, width: 4.6, long: true, clear: true, guard: M.gold, grip: '#5a7a4a', gem: '#e59ab8', guardW: 9.6, glow: '#c8f0b0' }),
  dawn_blade: (b) => sword(b, { blade: '#f6e7c4', guard: M.gold, grip: '#3a2e5a', gem: '#f39a3a', rune: '#ff9a4a', guardTips: true, guardW: 9, glow: '#ffd08a', width: 3.6, long: true }),

  bamboo_spear: (b) => spear(b, { bamboo: true, kind: 'point' }),
  iron_spear: (b) => spear(b, { head: M.steel, shaft: M.wood }),
  scorpion_pike: (b) => spear(b, { kind: 'stinger', head: '#b0643a', shaft: M.darkwood, socket: M.bronze, tassel: '#d6ae76' }),
  frost_lance: (b) => spear(b, { kind: 'ice', head: M.ice, shaft: '#7a8ea4', socket: '#cfe2ee', glow: '#cfefff', tassel: M.fur }),

  stone_hammer: (b) => hammer(b, { kind: 'rock', head: M.stone, grip: M.twine }),
  mossy_mace: (b) => hammer(b, { kind: 'mace', head: M.iron, shaft: M.darkwood }),
  sandstone_maul: (b) => hammer(b, { kind: 'block', head: M.sand, shaft: M.wood, grip: '#b0613f' }),
  glacier_hammer: (b) => hammer(b, { kind: 'ice', head: M.ice, shaft: '#7a8ea4', grip: '#5a6e8a', glow: '#cfefff' }),

  short_bow: (b) => bow(b, { limb: M.wood, grip: M.twine }),
  hunter_bow: (b) => bow(b, { limb: M.darkwood, grip: M.leather, recurve: true, deco: (bb) => P('M34.6 18l3 -3 1 2-2.6 2.4z', bb.f('#b0443a'), THIN) }),
  dune_bow: (b) => bow(b, { limb: '#c9955a', grip: '#b0613f', recurve: true, deco: (bb) => P('M36 27c3 1 4 4 3 7-1.4-1.6-2.6-2.4-3.6-2.4z', bb.f(M.cloth), THIN) }),
  aurora_bow: (b) => bow(b, { limb: '#8f86c8', grip: '#3e4a6e', recurve: true, glow: '#b8e6d8', deco: (bb) => circ(33.9, 24, 1.6, bb.f('#9fe3cf'), THIN) }),
  heartwood_bow: (b) => bow(b, { limb: '#6e4a30', grip: M.moss, recurve: true, glow: '#d8e8a0', deco: (bb) => P('M29 10c3-2 6-1 7 1-3 2-5 1.6-7-1z', bb.f(M.leaf), THIN) + P('M29 38c3 2 6 1 7-1-3-2-5-1.6-7 1z', bb.f(M.leaf), THIN) }),

  leaf_hat: leafHat,
  mushroom_hat: mushroomHat,
  desert_hood: desertHood,
  fur_hat: furHat,
  cactus_crown: (b) => crown(b, { glow: '#ffd9a0' }),
  royal_jelly_crown: (b) => crown(b, { jelly: true, glow: '#ffd0e6' }),

  grass_tunic: grassTunic,
  leather_vest: leatherVest,
  desert_cloak: desertCloak,
  yeti_coat: yetiCoat,

  straw_shoes: strawShoes,
  leather_boots: (b) => boot(b, { c: M.leather, laces: true, stitch: true }),
  sand_sandals: sandals,
  snow_boots: (b) => boot(b, { c: '#7f98ae', cuff: true, sole: '#4a5566' }),

  clover_ring: (b) => ring(b, { top: clover, glow: '#d8f0b8' }),
  bee_ring: (b) => ring(b, { top: honeyGem }),
  jelly_charm: (b) => pendant(b, { charm: (bb) => P('M24 22c5 6 8 9 8 13a8 8 0 0 1-16 0c0-4 3-7 8-13z', bb.f(M.violet), O, 'fill-opacity=".9"') + hl('M20 33c.4-3 1.6-5 3-6.6', 0.75) + circ(24, 22, 1.8, bb.f(M.gold), THIN) }),
  snow_charm: (b) => pendant(b, { cord: '#7f98ae', glow: '#dff4ff', charm: (bb) => circ(24, 31, 9, bb.f('#dfeef6')) + ln('M24 24v14M18 27.5l12 7M18 34.5l12-7M22 25.6l2 2 2-2M22 36.4l2-2 2 2', '#6f9ab8', 1, 1.5) + circ(24, 21.6, 1.8, bb.f('#b9c3cb'), THIN) }),
  rabbit_foot: (b) => pendant(b, { charm: (bb) => P('M17 30c0-5 3-8 7-8s7 3 7 8c0 6-3 11-7 11s-7-5-7-11z', bb.f(M.fur)) + ln('M20 36c1 2 2 3 4 3M28 36c-1 2-2 3-4 3', INK, 0.3) + P('M20.6 21h6.8v3.6h-6.8z', bb.f(M.gold), THIN) + hl('M20 28c.6-2 1.6-3 3-3.6', 0.9) }),
  spore_pendant: (b) => pendant(b, { cord: M.moss, glow: '#e2d0ff', charm: (bb) => P('M21.6 32h4.8l1 7h-6.8z', bb.f('#efe2c6'), THIN) + P('M15 33c0-6 4-10 9-10s9 4 9 10c-4 1.4-14 1.4-18 0z', bb.f(M.violet)) + dot(20, 28, 1.4, '#efe6ff') + dot(27, 27, 1.1, '#efe6ff') + dot(29, 31, 1, '#efe6ff') }),
  giant_heart: (b) => pendant(b, { cord: '#7f98ae', glow: '#bfe6ff', charm: (bb) => P('M24 42L13 30c-4-5 0-11 5-10 3 0 5 2 6 4 1-2 3-4 6-4 5-1 9 5 5 10z', bb.f('#8fc6e6')) + ln('M24 24v18M13.4 26l10.6 4 10.6-4', '#fff', 0.55) + hl('M16 25c1-1.6 2.6-2 4-1.6', 0.85) }),
  wisp_lantern: lantern,
  treant_seed: (b) => pendant(b, { cord: M.moss, glow: '#e0f0b0', charm: (bb) => P('M24 24c7 0 9 5 9 9 0 5-4 8-9 8s-9-3-9-8c0-4 2-9 9-9z', bb.f('#9a6a45')) + P('M15.6 28c3-3 14-3 16.8 0-1-4-4-5.6-8.4-5.6s-7.4 1.6-8.4 5.6z', bb.f(M.darkwood), THIN) + P('M24 23c0-4 1-6 3-7', 'none', `stroke="${M.moss}" stroke-width="1.6" stroke-linecap="round"`) + P('M26.6 16c2.6-2 5-1.4 6 .4-2.4 1.4-4.4 1.2-6-.4z', bb.f(M.leaf), THIN) + hl('M18 32c.4-1.6 1.4-2.6 2.6-3', 0.6) }),
  doctor_lens: lens,

  slime_jelly: (b) => jelly(b, M.jelly),
  mushroom_cap: mushroomPiece,
  cactus_spine: spines,
  ice_shard: shards,
  wood: log,
  stone: (b) => rock(b, M.stone),
  fiber: fiberBundle,
  herb: herbSprig,
  resin: (b) => drop(b, M.amber, true),
  iron_ore: (b) => rock(b, '#7d7278', { ore: true }),
  cactus_pulp: pulp,
  sandstone: (b) => rock(b, M.sand, { strata: true }),
  sun_crystal: (b) => crystals(b, '#f0c65a', '#ffe7a0'),
  frost_crystal: (b) => crystals(b, M.frost, '#dff6ff'),
  herb_seed: (b) => seedPacket(b, (bb) => P('M24 30c0-4 0-6 1-8', 'none', `stroke="${M.moss}" stroke-width="1.4"`) + P('M25 22c2-3 5-3 6-1-2 2-4 2.4-6 1z', bb.f(M.leaf), THIN) + P('M24.4 25c-2-2.6-4.6-2.6-5.6-.8 1.8 1.8 3.8 2 5.6.8z', bb.f(M.leaf), THIN)),
  apple_seed: (b) => seedPacket(b, (bb) => P('M24 22c-2-1.6-6-1.4-6.4 2.6-.4 3.4 2 7 4.4 7 .8 0 1.4-.4 2-.4s1.2.4 2 .4c2.4 0 4.8-3.6 4.4-7-.4-4-4.4-4.2-6.4-2.6z', bb.f(M.red), THIN) + P('M24 22c.4-1.6 1-2.4 2-3', 'none', `stroke="${M.darkwood}" stroke-width="1.2"`)),

  potion: (b) => flask(b, M.red),
  big_potion: (b) => flask(b, '#b8404e', { big: true, ribbon: M.gold, glow: '#ffb0b8' }),
  apple,
  herb_tea: teaCup,
  honey_jar: honeyJar,
  fire_tonic: tonic,
  cactus_juice: juiceGlass,
  return_scroll: scroll,
  forget_potion: (b) => flask(b, M.violet, { swirl: true, glow: '#d8c8ff', ribbon: '#5a4a8a' }),
};

// 등급 뒷빛: 희귀 이상만. 전설은 가는 빛살까지.
const BACK = {
  rare: ['#8fbfff', 0.34],
  epic: ['#caa0ff', 0.42],
  legendary: ['#ffc46a', 0.55],
};
function backplate(b, grade) {
  const g = BACK[grade];
  if (!g) return '';
  let s = circ(24, 24, 23, b.glow(g[0], g[1]), '');
  if (grade === 'legendary') {
    for (let i = 0; i < 8; i++) s += `<path d="M24 24L${24 + Math.cos(i * 0.785) * 23} ${24 + Math.sin(i * 0.785) * 23}" stroke="#ffd79a" stroke-opacity=".35" stroke-width="${i % 2 ? 1 : 2}"/>`;
  }
  return s;
}

// 아이콘 SVG 문자열. 아트가 없는 아이템은 재질 보석 모양.
export function itemArt(id, def, cls = 'item-svg') {
  const b = new Brush();
  const draw = ART[id];
  const body = draw ? draw(b) : shadow(40, 10) + P('M24 8l12 14-12 16-12-16z', b.f(def?.color ?? M.stone)) + hl('M18 20l5-7', 0.7);
  const back = backplate(b, def?.grade);
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><defs>${b.defs.join('')}</defs>${back}${body}</svg>`;
}

// 빈 장비 칸 안내 모양 (흐린 한 색 실루엣)
const HINT = { weapon: 'iron_sword', head: 'leaf_hat', body: 'grass_tunic', feet: 'leather_boots', accessory: 'clover_ring' };
export function hintArt(slot) {
  const b = new Brush();
  return `<svg class="item-svg hint" viewBox="0 0 48 48" aria-hidden="true"><g opacity=".32" style="filter:grayscale(1)">${ART[HINT[slot]](b)}</g><defs>${b.defs.join('')}</defs></svg>`;
}

export const ART_IDS = Object.keys(ART);

// 다른 UI 아이콘(스킬·건설)도 같은 붓과 규칙으로 그린다
export const art = { Brush, P, hl, ln, circ, dot, shadow, rot, O, THIN, INK, light, dark };
