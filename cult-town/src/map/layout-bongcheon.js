// 봉천동 배치 (4단계). `npm run map` 이 bongcheon.json 을 만든다. 좌표는 16px 타일 단위, 위쪽이 북쪽.
// 실제 이름은 서울대입구역(2호선) · 관악로(세로 큰길) · 남부순환로(가로)만 쓴다. 남쪽은 언덕 원룸·고시촌.
// 가게·교회·절·건물 이름은 전부 지어낸 것이다 (data/places.js 의 b_* · data/shops.js 의 b_*). 정확한 지도가 아니다.
// 형식은 layout.js 와 같다 (row · 틈 · 막다른 골목).

export const W = 64;
export const H = 48;

export const ROAD_H = { y: 2, h: 4, name: '남부순환로' };
export const ROAD_V = { x: 28, w: 4, name: '관악로' };
export const WALK_V = [27, 32];
export const ROWS = [8, 15, 22, 29, 36];
export const ROW_H = 5;

export const BUILDINGS = [];
export const DEAD_ENDS = [];
function row(top, x0, specs) {
  let x = x0;
  for (const sp of specs) {
    if (typeof sp === 'number') { x += sp; continue; }
    if (sp.gap) { if (sp.dead) DEAD_ENDS.push({ x, y: sp.dead === 'top' ? top : top + ROW_H - 1, w: sp.gap }); x += sp.gap; continue; }
    const h = sp.h ?? ROW_H;
    if (x + sp.w > W) throw new Error(`건물이 지도 밖으로 나간다: ${sp.place ?? sp.shop ?? sp.kind} x${x}+${sp.w}`);
    BUILDINGS.push({ ...sp, x, y: top + ROW_H - h, h });
    x += sp.w;
  }
}

// ── 서쪽 (x 0~26) ──
row(8, 0, [
  { w: 5, kind: 'mixed', place: 'b_cvs', shopfront: true, floors: 2 }, { gap: 1 },
  { w: 4, kind: 'mixed', shop: 'b_chicken' }, 2,
  { w: 8, kind: 'mall', place: 'b_branch', floors: 4, door: 15, signs: ['b_pilates', null, 'b_tax', 'b_kimbap'] }, 1,
  { w: 5, kind: 'mixed', shop: 'b_bakery' },
]);
row(15, 0, [
  { w: 5, kind: 'villa', place: 'b_villa_a' },
  { w: 6, kind: 'mall', place: 'b_studycafe', floors: 3, signs: ['b_tutor', null, null] }, { gap: 1, dead: 'top' },
  { w: 4, kind: 'mixed', shop: 'b_laundry' }, 2,
  { w: 5, kind: 'mixed', place: 'b_eatery', shopfront: true }, 2,
]);
row(22, 0, [
  { w: 6, kind: 'special', place: 'b_church', door: 3 }, 2,
  { w: 5, kind: 'villa', place: 'b_villa_b' },
  { w: 4, kind: 'mixed', shop: 'b_hof' }, 1,
  { w: 5, kind: 'villa', h: 4 }, 2,
]);
row(29, 0, [
  { w: 5, kind: 'villa', place: 'b_villa_c' }, { gap: 1, dead: 'bottom' },
  { w: 4, kind: 'house', place: 'b_fortune' }, 2,
  { w: 6, kind: 'mall', place: 'b_academy', floors: 3, signs: ['b_dental', null, null] }, 1,
  { w: 5, kind: 'mixed', shop: 'b_mart' },
]);
row(36, 0, [
  { w: 5, kind: 'villa' },
  { w: 5, kind: 'mixed', shop: 'b_bunsik' }, 2,
  { w: 5, kind: 'villa', place: 'b_villa_d' }, 1,
  { w: 6, kind: 'villa', h: 4 },
]);

// ── 동쪽 (x 33~63) ──
row(8, 33, [
  { w: 7, kind: 'mall', place: 'b_office', floors: 4, signs: ['b_gym', 'b_clinic', null, null] }, 1,
  { w: 5, kind: 'mixed', shop: 'b_phone' }, 2,
  { w: 4, kind: 'mixed', shop: 'b_cafe' }, 2,
  { w: 9, kind: 'special', place: 'b_temple', door: 58 },
]);
row(15, 33, [
  { w: 6, kind: 'mall', place: 'b_gosiwon', floors: 3 }, { gap: 1, dead: 'bottom' },
  { w: 5, kind: 'villa', place: 'b_villa_e' },
  { w: 5, kind: 'mixed', shop: 'b_realty' }, 2,
  { w: 5, kind: 'villa', place: 'b_villa_f' },
  { w: 5, kind: 'mixed', shop: 'b_noodle' },
]);
// x34~47 은 먹자골목 (FOOD)
row(22, 49, [
  { w: 5, kind: 'mixed', shop: 'b_bbq' },
  { w: 5, kind: 'villa', place: 'b_villa_g' }, 1,
  { w: 4, kind: 'mixed', shop: 'b_pocha' },
]);
row(29, 33, [
  { w: 6, kind: 'villa', place: 'b_villa_h' },
  { w: 4, kind: 'mixed', shop: 'b_flower' }, 2,
  { w: 5, kind: 'villa' }, { gap: 2, dead: 'top' },
  { w: 5, kind: 'mixed', shop: 'b_stationery' }, 1,
  { w: 5, kind: 'villa', h: 4 },
]);
row(36, 33, [
  { w: 5, kind: 'villa' },
  { w: 5, kind: 'mixed', shop: 'b_cleaner' }, 1,
  { w: 6, kind: 'villa' }, 2,
  { w: 5, kind: 'mixed', shop: 'b_glasses' },
  { w: 6, kind: 'villa', h: 4 },
]);

// 먹자골목 · 쉼터 (건물 대신 바닥)
export const FOOD = { x: 34, y: 22, w: 14, h: 7 };              // 언덕길 먹자골목 (좌판 두 줄)
export const PARK = { x: 0, y: 43, w: 14, h: 5 };               // 느티나무 쉼터

export const GROUND = [
  { kind: 'lot', x: 0, y: 0, w: W, h: 2 },                      // 북쪽 가로수 띠
  { kind: 'road', x: 0, y: ROAD_H.y, w: W, h: ROAD_H.h, line: 'h' },
  { kind: 'sidewalk', x: 0, y: 6, w: W, h: 2 },
  { kind: 'road', x: ROAD_V.x, y: 6, w: ROAD_V.w, h: H - 6, line: 'v' },
  { kind: 'sidewalk', x: WALK_V[0], y: 6, w: 1, h: H - 6 },
  { kind: 'sidewalk', x: WALK_V[1], y: 6, w: 1, h: H - 6 },
  { kind: 'plaza', x: 18, y: 6, w: 9, h: 2 },                    // 역 앞 광장
  { kind: 'market', ...FOOD },
  { kind: 'grass', ...PARK },
  { kind: 'plaza', x: 3, y: 44, w: 8, h: 2 },
  { kind: 'plaza', x: 54, y: 13, w: 9, h: 2 },                   // 절 앞마당
  { kind: 'lot', x: 14, y: 45, w: 14, h: 3 },                    // 남쪽 언덕
  { kind: 'lot', x: 33, y: 45, w: 31, h: 3 },
];

export const CROSSWALKS = [
  { x: 23, y: 2, w: 3, h: 4, dir: 'v' },
  { x: 35, y: 2, w: 3, h: 4, dir: 'v' },
  ...[6, 13, 20, 27, 34, 41].map((y) => ({ x: 28, y, w: 4, h: 2, dir: 'h' })),
];

export const PROPS = [
  ...[3, 9, 15, 21, 41, 47, 53, 59].map((x) => ({ kind: 'tree', x, y: 1 })),
  { kind: 'vending', x: 6, y: 7 }, { kind: 'bench', x: 12, y: 7 }, { kind: 'lamp', x: 40, y: 7 }, { kind: 'bench', x: 46, y: 7 },
  // 먹자골목 좌판
  ...[35, 38, 41, 44].map((x) => ({ kind: 'stall', x, y: 23 })),
  ...[36, 39, 42, 45].map((x) => ({ kind: 'stall2', x, y: 26 })),
  // 쉼터
  { kind: 'tree', x: 1, y: 44 }, { kind: 'tree', x: 12, y: 44 }, { kind: 'tree', x: 1, y: 47 }, { kind: 'tree', x: 12, y: 47 },
  { kind: 'bench', x: 4, y: 46 }, { kind: 'bench', x: 9, y: 46 }, { kind: 'lamp', x: 6, y: 47 },
  // 남쪽 언덕 나무
  ...[16, 20, 24, 36, 42, 48, 54, 60].map((x) => ({ kind: 'tree', x, y: 47 })),
];

export const SPOTS = {
  b_cvs: { front: { from: 'b_cvs', dx: 1, dy: 0 }, table: { from: 'b_cvs', dx: -2, dy: 0 } },
  b_station: { plaza: [19, 7], exit4: [23, 7], exit5: [36, 7] },
  b_studycafe: { front: { from: 'b_studycafe', dx: 2, dy: 0 } },
  b_eatery: { front: { from: 'b_eatery', dx: 1, dy: 0 } },
  b_church: { yard: { from: 'b_church', dx: 2, dy: 1 } },
  b_fortune: { front: { from: 'b_fortune', dx: 1, dy: 0 } },
  b_academy: { front: { from: 'b_academy', dx: 2, dy: 0 } },
  b_temple: { yard: [56, 14] },
  b_gosiwon: { front: { from: 'b_gosiwon', dx: 1, dy: 0 } },
  b_office: { smoke: { from: 'b_office', dx: 2, dy: 1 } },
  b_food: { walk: [40, 24], pocha: [44, 25], entrance: [34, 24], grill: [37, 25] },
  b_park: { bench: [4, 45], plaza: [7, 45], walk: [10, 44] },
  b_branch: { door: { from: 'b_branch', dx: 2, dy: 1 } },
};

export const EXTRA_PLACES = { b_station: [22, 7], b_food: [34, 24], b_park: [7, 45] };
export const START = 'b_station';
export const MAP_ID = 'bongcheon';
export const MAP_CREDIT = 'Tiles: Kenney RPG Urban Pack (CC0). 봉천동 구조를 손으로 단순화한 배치.';

export const STATION_EXITS = [
  { label: '서울대입구역 4', x: 26, y: 6, sprite: 'station.exit' },
  { label: '서울대입구역 5', x: 33, y: 6, sprite: 'station.exit' },
];

// 27장: 도로명 표지판 · 지역 이름 (layout.js 와 같은 꼴)
export const ROAD_SIGNS = [
  { x: 32, y: 10, plates: ['남부순환로', '관악로'] },
];
export const AREAS = [
  { name: '서울대입구역 앞', x: 18, y: 6, w: 9, h: 2 },
  { name: '남부순환로', x: 0, y: 0, w: W, h: 8 },
  { name: '관악로', x: WALK_V[0], y: 8, w: WALK_V[1] - WALK_V[0] + 1, h: H - 8 },
  { name: '언덕길 먹자골목', ...FOOD },
  { name: '느티나무 쉼터', ...PARK },
];
