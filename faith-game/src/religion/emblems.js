// 종교 문양. 24×24 선 아이콘이며, 채움이 필요한 부분만 F(채움)로 그린다.
// 기존 종교를 떠올리게 하는 상징(십자가·초승달·육각별·법륜·옴 등)은 쓰지 않고
// 자연·천체·기하 모티프로만 만든다.

const F = 'fill="currentColor" stroke="none"';

// 중심에서 뻗는 선 n개 (r1 → r2)
function rays(n, r1, r2, offset = 0) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = ((i * 360) / n + offset) * (Math.PI / 180);
    const p = (r) => `${(12 + r * Math.cos(a)).toFixed(2)} ${(12 + r * Math.sin(a)).toFixed(2)}`;
    d += `M${p(r1)}L${p(r2)}`;
  }
  return `<path d="${d}"/>`;
}

// 결정(눈송이): 6갈래 + 가지
function crystal() {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 - 90) * (Math.PI / 180);
    const pt = (r, da = 0) => {
      const b = a + da;
      return `${(12 + r * Math.cos(b)).toFixed(2)} ${(12 + r * Math.sin(b)).toFixed(2)}`;
    };
    d += `M12 12L${pt(9.5)}M${pt(6.5)}L${pt(8.6, 0.32)}M${pt(6.5)}L${pt(8.6, -0.32)}`;
  }
  return `<path d="${d}"/>`;
}

const rot = (deg, inner) => `<g transform="rotate(${deg} 12 12)">${inner}</g>`;

export const EMBLEMS = [
  { id: 'sun', name: '태양', svg: `<circle cx="12" cy="12" r="4.2"/>${rays(8, 7, 9.8)}` },
  { id: 'sunrise', name: '일출', svg: `<path d="M2.5 17.5h19M6.5 21h11M6.8 17.5a5.2 5.2 0 0 1 10.4 0"/>${'<path d="M12 5.5v3M4.6 10.1l2.1 2.1M19.4 10.1l-2.1 2.1"/>'}` },
  { id: 'halfmoon', name: '반달', svg: `<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" ${F}/>` },
  { id: 'star4', name: '사방성', svg: '<path d="M12 2.5c.9 5.4 4.1 8.6 9.5 9.5-5.4.9-8.6 4.1-9.5 9.5-.9-5.4-4.1-8.6-9.5-9.5 5.4-.9 8.6-4.1 9.5-9.5Z"/>' },
  { id: 'radiance', name: '광휘', svg: `<circle cx="12" cy="12" r="2.6" ${F}/>${rays(12, 5, 9.6)}` },
  { id: 'comet', name: '혜성', svg: '<circle cx="16" cy="8" r="3.4"/><path d="M13.6 10.4 3.5 20.5M13 6.6 6.5 13.1M17.4 11 10.9 17.5"/>' },
  { id: 'planet', name: '행성', svg: '<circle cx="12" cy="12" r="5.2"/><path d="M7.2 14.9c-3.6 2.1-5.3 4.1-4.6 5.1 1.1 1.8 7.4-.3 13.9-4.6S22.5 6.2 21.4 4.5c-.6-1-2.7-.7-5.4.6"/>' },
  { id: 'orbit', name: '궤도', svg: `<ellipse cx="12" cy="12" rx="9.5" ry="4.6"/><circle cx="12" cy="12" r="2.3" ${F}/><circle cx="19.4" cy="9.2" r="1.5" ${F}/>` },
  { id: 'atom', name: '원자', svg: `<ellipse cx="12" cy="12" rx="9.6" ry="3.6"/>${rot(60, '<ellipse cx="12" cy="12" rx="9.6" ry="3.6"/>')}${rot(120, '<ellipse cx="12" cy="12" rx="9.6" ry="3.6"/>')}<circle cx="12" cy="12" r="1.7" ${F}/>` },
  { id: 'constellation', name: '별자리', svg: `<path d="M4 17.5 9 9l6 3.5L20 5M15 12.5l2 6.5"/>${[[4, 17.5], [9, 9], [15, 12.5], [20, 5], [17, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" ${F}/>`).join('')}` },
  { id: 'eye', name: '눈', svg: `<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="1.2" ${F}/>` },
  { id: 'flame', name: '불꽃', svg: '<path d="M12 21.5c-4 0-6.5-2.7-6.5-6.3 0-4.4 4-6.2 4.6-11.2 3.1 2 7.4 5.9 7.4 11 0 3.7-2.3 6.5-5.5 6.5Z"/><path d="M12 21.5c-1.7 0-2.8-1.2-2.8-2.9 0-2 1.6-3 2.4-5 1.6 1.2 3.2 2.8 3.2 4.9 0 1.8-1.2 3-2.8 3Z"/>' },
  { id: 'drop', name: '물방울', svg: '<path d="M12 2.8c3.7 4.5 6.6 8.1 6.6 11.6a6.6 6.6 0 0 1-13.2 0c0-3.5 2.9-7.1 6.6-11.6Z"/><path d="M8.8 14.6a3.2 3.2 0 0 0 3.2 3.2"/>' },
  { id: 'wave', name: '물결', svg: '<path d="M2 7q2.5-3 5 0t5 0 5 0 5 0M2 12q2.5-3 5 0t5 0 5 0 5 0M2 17q2.5-3 5 0t5 0 5 0 5 0"/>' },
  { id: 'mountain', name: '산', svg: '<path d="M2.5 19.5 9 8l4 7 2.6-4.2 5.9 8.7Z"/><path d="m6.9 11.7 2 1.3 1.8-1.5"/>' },
  { id: 'leaf', name: '잎', svg: '<path d="M5 19C4 11 9 4.5 20 4c.4 10.5-5.6 16-15 15Z"/><path d="M5 19 14.5 9.5"/>' },
  { id: 'sprout', name: '새싹', svg: '<path d="M12 21v-9"/><path d="M12 12C12 7.5 9 5 4.5 5c0 4.5 3 7 7.5 7Z"/><path d="M12 14.5c0-3.8 2.6-6 6.5-6 0 3.8-2.6 6-6.5 6Z"/>' },
  { id: 'tree', name: '나무', svg: '<circle cx="12" cy="9" r="6.3"/><path d="M12 21.5v-8M12 17.5l-3-2.6M12 15.8l2.6-2.2M8 21.5h8"/>' },
  { id: 'flower', name: '꽃', svg: `${[0, 72, 144, 216, 288].map((d) => rot(d, '<ellipse cx="12" cy="6.6" rx="2.7" ry="4.1"/>')).join('')}<circle cx="12" cy="12" r="1.9" ${F}/>` },
  { id: 'feather', name: '깃털', svg: '<path d="M20 4c-8.2.6-13.6 6-14 14.5C14.5 18 20 12.6 20 4Z"/><path d="M3.5 20.5 15.5 8.5M8.5 15.5h5M11.4 12.6h4.4"/>' },
  { id: 'lighthouse', name: '등대', svg: '<path d="M9.6 21.5 10.6 9h2.8l1 12.5M8 21.5h8M9.4 9h5.2l-.8-3H10.2ZM12 6V4M10.3 14h3.4"/><path d="M15.8 6.5 21 4.5M15.8 8.5 21 10.5M8.2 6.5 3 4.5M8.2 8.5 3 10.5"/>' },
  { id: 'birds', name: '새', svg: '<path d="M2 10.5c4.2 0 7.8 2.4 10 7 2.2-4.6 5.8-7 10-7"/><path d="M13.5 5c1.7 0 3 .9 3.8 2.4.8-1.5 2.1-2.4 3.8-2.4"/>' },
  { id: 'spiral', name: '나선', svg: '<path d="M12 12.4c0-.8.7-1.4 1.5-1.4 1.4 0 2.5 1.1 2.5 2.5 0 2-1.6 3.6-3.6 3.6-2.8 0-5.1-2.3-5.1-5.1 0-3.7 3-6.6 6.6-6.6 4.6 0 8.1 3.7 8.1 8.2"/>' },
  { id: 'ripple', name: '파문', svg: `<circle cx="12" cy="12" r="9.3"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.6" ${F}/>` },
  { id: 'rings', name: '세 고리', svg: '<circle cx="12" cy="8.2" r="5"/><circle cx="8.4" cy="14.6" r="5"/><circle cx="15.6" cy="14.6" r="5"/>' },
  { id: 'infinity', name: '무한', svg: '<path d="M12 12c-2-2.8-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.2 5.5-4Zm0 0c2 2.8 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.2-5.5 4Z"/>' },
  { id: 'trinity', name: '삼각원', svg: '<circle cx="12" cy="12" r="9.3"/><path d="M12 2.7 20.05 16.65H3.95Z"/>' },
  { id: 'hexagon', name: '육각', svg: `<path d="M12 2.6 20.2 7.3v9.4L12 21.4l-8.2-4.7V7.3Z"/><circle cx="12" cy="12" r="2.6" ${F}/>` },
  { id: 'diamond', name: '마름모', svg: `<path d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/><path d="M12 7.6 16.4 12 12 16.4 7.6 12Z" ${F}/>` },
  { id: 'cube', name: '정육면체', svg: '<path d="M12 2.6 20.2 7.3v9.4L12 21.4l-8.2-4.7V7.3Z"/><path d="M3.8 7.3 12 12l8.2-4.7M12 12v9.4"/>' },
  { id: 'pyramid', name: '피라미드', svg: `<path d="M12 4 21.5 19.5h-19Z"/><path d="M12 4l3.4 15.5"/><circle cx="19" cy="5" r="1.6" ${F}/>` },
  { id: 'labyrinth', name: '미궁', svg: `<path d="M10 3.5H3.5v17h17v-17H14M10 17H7V7h10v10h-3M14 20.5V17M10 7V3.5"/><rect x="10.2" y="10.2" width="3.6" height="3.6" rx=".8" ${F}/>` },
  { id: 'seal', name: '인장', svg: `<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" ${F}/>` },
  { id: 'key', name: '열쇠', svg: '<circle cx="8" cy="8" r="4.6"/><path d="M11.3 11.3 20.5 20.5M16.6 16.6l2.6-2.6M14 14l2-2"/>' },
  { id: 'crown', name: '왕관', svg: '<path d="M3.5 8 7.6 12 12 5l4.4 7 4.1-4-1.6 10.5H5.1Z"/><path d="M5 21.5h14"/>' },
  { id: 'compass', name: '나침', svg: `<path d="M12 2.5 14 10l7.5 2-7.5 2-2 7.5-2-7.5L2.5 12 10 10Z"/>${rays(4, 5.2, 7.2, 45)}` },
  { id: 'lightning', name: '번개', svg: '<path d="M13.5 2.5 5 13.5h6.5l-1 8 8.5-11h-6.5Z"/>' },
  { id: 'crystal', name: '결정', svg: crystal() },
  { id: 'hourglass', name: '모래시계', svg: `<path d="M6 3h12M6 21h12M7.5 3c0 5 4.5 6 4.5 9s-4.5 4-4.5 9M16.5 3c0 5-4.5 6-4.5 9s4.5 4 4.5 9"/><path d="M9.3 19.6 12 16.8l2.7 2.8Z" ${F}/>` },
  { id: 'gate', name: '아치', svg: '<path d="M5 21V10.5a7 7 0 0 1 14 0V21M3 21h18M9.2 21v-7.5a2.8 2.8 0 0 1 5.6 0V21"/>' },
  { id: 'cloud', name: '구름', svg: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-8 5.6 5.6 0 0 0-10.7-1.3A4.7 4.7 0 0 0 7 18.5Z"/><path d="M8 21.5h8"/>' },
  { id: 'lantern', name: '등불', svg: `<path d="M9 5.5a3 3 0 0 1 6 0M7.5 7.5h9M7.5 19.5h9M8.6 7.5C7.5 9.5 7 11.3 7 13.5s.5 4 1.6 6M15.4 7.5c1.1 2 1.6 3.8 1.6 6s-.5 4-1.6 6"/><path d="M12 10.5c1.4 1.5 2.1 2.7 2.1 3.7a2.1 2.1 0 0 1-4.2 0c0-1 .7-2.2 2.1-3.7Z" ${F}/>` },
];

export const DEFAULT_EMBLEM = EMBLEMS[0].id;
const BY_ID = new Map(EMBLEMS.map((e) => [e.id, e]));

export const emblemOf = (id) => BY_ID.get(id) ?? BY_ID.get(DEFAULT_EMBLEM);

// 화면용 SVG 문자열
export function emblemSvg(id, cls = '') {
  return `<svg class="icon emblem-glyph ${cls}" viewBox="0 0 24 24" aria-hidden="true">${emblemOf(id).svg}</svg>`;
}

// 파비콘용: 종교 색 바탕에 흰 문양
export function emblemFavicon(id, color, fg = '#fff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${color}"/><g transform="translate(12 12) scale(1.6667)" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="${fg}">${emblemOf(id).svg}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
