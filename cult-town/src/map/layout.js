// 동네 배치 (사람이 읽고 고치는 원본). `npm run map` 이 이걸로 Tiled JSON(town.json)을 만든다.
// 좌표는 16px 타일 단위. 위쪽이 북쪽.
// 실제 신림동 구조를 손으로 단순화했다: 위쪽 가장자리 도림천, 그 아래 남부순환로(가로), 가운데 신림로(세로),
// 두 길이 만나는 곳에 신림역 출구. 나머지는 차 한 대 지나갈 골목과 작은 건물이 촘촘하다. 정확한 지도가 아니다.
// 가게·교회·절·건물 이름은 전부 지어낸 것이다 (data/places.js, data/shops.js).
//
// 건물은 '줄(row)' 단위로 늘어놓는다. 모든 건물은 남쪽(아래)에 정면과 문이 있고, 문 앞은 아래 골목이다.
//   row(top, h, x, [건물 또는 틈 ...])
//   건물: { w, kind, place?, shop?, floors?, h?, door?, wall?, roof?, signs? }
//     kind: villa(원룸 빌라) · mixed(1층 가게 + 위층 주거) · mall(상가, 층마다 간판) · house(작은 집) · special
//     place: 사람이 드나드는 장소 id (data/places.js) · shop: 1층 간판 (data/shops.js)
//     h 가 줄 높이보다 작으면 아래에 붙고 위는 빈 땅 (뒷골목)
//   틈: 숫자 n (n칸 골목) 또는 { gap: n, dead: 'top'|'bottom' } (한쪽 끝을 담으로 막은 막다른 골목)

// 30장: 72×54 에서 100×78 로 넓혔다. 아래 '옛 동네' 좌표는 예전 그대로 쓰고, 파일 끝에서 통째로 아래로 10칸 옮긴 뒤 새 구역을 붙인다.
export const W = 100;
export const H = 78;

// 큰 구조
export const ROAD_H = { y: 4, h: 4, name: '남부순환로' };     // 가로 큰길
export const ROAD_V = { x: 33, w: 4, name: '신림로' };        // 세로 큰길
export const WALK_V = [32, 37];                               // 신림로 양쪽 인도
export const ROWS = [10, 17, 24, 31, 38, 45];                 // 건물 줄 윗변 (높이 5, 아래 2칸 골목)
export const ROW_H = 5;

export const BUILDINGS = [];
function row(top, x0, specs) {
  let x = x0;
  for (const sp of specs) {
    if (typeof sp === 'number') { x += sp; continue; }
    if (sp.gap) {
      if (sp.dead) DEAD_ENDS.push({ x, y: sp.dead === 'top' ? top : top + ROW_H - 1, w: sp.gap });
      if (sp.stairs) STAIRS.push({ x, y: top, w: sp.gap, h: ROW_H });     // 30장 원룸 언덕: 건물 사이 계단 골목
      x += sp.gap; continue;
    }
    const h = sp.h ?? ROW_H;
    if (x + sp.w > W) throw new Error(`건물이 지도 밖으로 나간다: ${sp.place ?? sp.shop ?? sp.kind} x${x}+${sp.w}`);
    BUILDINGS.push({ ...sp, x, y: top + ROW_H - h, h });
    x += sp.w;
  }
}
export const DEAD_ENDS = [];
export const STAIRS = [];

// ── 서쪽 (x 0~31) ──
row(10, 0, [
  { w: 5, kind: 'mixed', place: 'cvs', shopfront: true, floors: 2 }, { gap: 1 },
  { w: 5, kind: 'mall', place: 'pcbang', floors: 3, signs: ['gym', null, null] },
  { w: 3, kind: 'mixed', shop: 'chicken' }, 2,
  { w: 5, kind: 'mixed', place: 'pharmacy', shopfront: true }, 2,
  { w: 8, kind: 'mall', place: 'sanctuary', floors: 4, door: 26, signs: ['pingpong', null, 'tutor', 'kimbap'] },
]);
row(17, 0, [
  { w: 4, kind: 'villa' },
  { w: 5, kind: 'mixed', place: 'restaurant', shopfront: true }, { gap: 1, dead: 'top' },
  { w: 4, kind: 'mixed', shop: 'laundry' }, 2,
  { w: 4, kind: 'mixed', shop: 'hair' }, 1,
  { w: 5, kind: 'mall', place: 'academy', floors: 3, signs: ['dental', null, null] },
  { w: 6, kind: 'mall', shop: 'karaoke', floors: 3, signs: ['hof', null, 'karaoke'] },
]);
row(24, 0, [
  { w: 5, kind: 'mixed', shop: 'bunsik' },
  { w: 5, kind: 'villa', h: 4 },
  { w: 4, kind: 'mixed', shop: 'cafe' }, 2,
  // x16~31 은 시장 (MARKET)
]);
row(31, 0, [
  { w: 5, kind: 'villa' }, { gap: 1, dead: 'bottom' },
  { w: 5, kind: 'mixed', shop: 'hardware' },
  { w: 3, kind: 'house', h: 4 }, 2,
  { w: 6, kind: 'mixed', shop: 'laundry' },
  { w: 5, kind: 'villa' }, 1,
  { w: 4, kind: 'mixed', shop: 'bakery' },
]);
row(38, 0, [
  { w: 5, kind: 'mixed', shop: 'glasses' },
  { w: 5, kind: 'villa', h: 4 },
  { w: 4, kind: 'mixed', shop: 'cleaner' }, 3,
  { w: 8, kind: 'special', place: 'church', door: 21 }, 1,
  { w: 6, kind: 'villa', place: 'villa_tong' },
]);
row(45, 16, [
  { w: 5, kind: 'villa' },
  { w: 5, kind: 'mixed', shop: 'bunsik2' }, { gap: 1, dead: 'top' },
  { w: 5, kind: 'villa' },
]);

// ── 동쪽 (x 38~71) ──
row(10, 38, [
  { w: 8, kind: 'mall', place: 'office', floors: 4, signs: ['gym', 'dental', null, 'clinic'] }, 1,
  { w: 5, kind: 'mixed', shop: 'realty' }, 2,
  { w: 3, kind: 'mixed', shop: 'cafe2' }, 2,
  { w: 9, kind: 'special', place: 'temple', door: 63 },
  { w: 4, kind: 'villa', h: 4 },
]);
row(17, 38, [
  { w: 4, kind: 'house', place: 'fortune' }, 1,
  { w: 5, kind: 'villa', place: 'oneroom_a' },
  { w: 5, kind: 'mixed', shop: 'phone' }, 2,
  { w: 6, kind: 'mall', place: 'gosiwon', floors: 3 }, { gap: 1, dead: 'bottom' },
  { w: 5, kind: 'villa', place: 'oneroom_b' },
  { w: 5, kind: 'mixed', shop: 'kimbap' },
]);
row(24, 38, [
  { w: 5, kind: 'villa', place: 'oneroom_c' }, 1,
  { w: 6, kind: 'villa', place: 'villa_b' },
  { w: 3, kind: 'mixed', shop: 'flower' }, 2,
  { w: 5, kind: 'villa', place: 'oneroom_d' },
  { w: 5, kind: 'mixed', shop: 'meat' }, 1,
  { w: 6, kind: 'villa' },
]);
row(31, 38, [
  { w: 6, kind: 'villa', place: 'oneroom_e' }, { gap: 2, dead: 'top' },
  { w: 5, kind: 'mixed', shop: 'stationery' }, 2,
  { w: 6, kind: 'villa', place: 'oneroom_f' },
  { w: 5, kind: 'mixed', shop: 'nail' }, 1,
  { w: 5, kind: 'villa', h: 4 },
]);
row(38, 38, [
  { w: 5, kind: 'villa' },
  { w: 5, kind: 'mixed', shop: 'bedding' }, 1,
  { w: 4, kind: 'villa', h: 4 }, 2,
  { w: 5, kind: 'mixed', shop: 'chicken2' },
  { w: 5, kind: 'villa' }, { gap: 2, dead: 'bottom' },
  { w: 5, kind: 'mixed', shop: 'mart' },
]);
row(45, 38, [
  { w: 6, kind: 'villa' },
  { w: 5, kind: 'mixed', shop: 'realty2' }, 1,
  { w: 3, kind: 'house', h: 4 }, 2,
  { w: 6, kind: 'villa' },
  { w: 5, kind: 'mixed', shop: 'cafe' },
  { w: 6, kind: 'villa', h: 4 },
]);

// 시장·공원 (건물 대신 바닥)
export const MARKET = { x: 16, y: 24, w: 16, h: 7 };          // 도림골목시장 (가운데 걷는 길, 좌판 두 줄)
export const PARK = { x: 0, y: 45, w: 14, h: 7 };             // 솔밭 쉼터

// 바닥 덮기: 뒤에 나온 것이 앞의 것을 덮는다. 기본은 골목(alley)
//   kind: water · path(산책로) · road · sidewalk · plaza · market · grass · lot
export const GROUND = [
  { kind: 'water', x: 0, y: 0, w: W, h: 2 },
  { kind: 'path', x: 0, y: 2, w: W, h: 2 },
  { kind: 'road', x: 0, y: ROAD_H.y, w: W, h: ROAD_H.h, line: 'h' },
  { kind: 'sidewalk', x: 0, y: 8, w: W, h: 2 },
  { kind: 'road', x: ROAD_V.x, y: 8, w: ROAD_V.w, h: H - 8, line: 'v' },
  { kind: 'sidewalk', x: WALK_V[0], y: 8, w: 1, h: H - 8 },
  { kind: 'sidewalk', x: WALK_V[1], y: 8, w: 1, h: H - 8 },
  { kind: 'plaza', x: 22, y: 8, w: 10, h: 2 },                 // 역 앞 광장
  { kind: 'market', ...MARKET },
  { kind: 'grass', ...PARK },
  { kind: 'plaza', x: 3, y: 47, w: 8, h: 3 },                  // 공원 광장
  { kind: 'plaza', x: 58, y: 15, w: 10, h: 2 },                // 절 앞마당
];

// 횡단보도
export const CROSSWALKS = [
  { x: 28, y: 4, w: 3, h: 4, dir: 'v' },
  { x: 40, y: 4, w: 3, h: 4, dir: 'v' },
  ...[8, 15, 22, 29, 36, 43, 50].map((y) => ({ x: 33, y, w: 4, h: 2, dir: 'h' })),
];

// 손으로 놓는 소품 (나머지 골목 소품은 build-map 이 골목마다 흩뿌린다)
//   kind 는 build-map.mjs 의 PROP 표
export const PROPS = [
  ...[3, 9, 15, 21, 45, 51, 57, 63, 69].map((x) => ({ kind: 'tree', x, y: 3 })),
  { kind: 'vending', x: 6, y: 9 }, { kind: 'bench', x: 12, y: 9 }, { kind: 'lamp', x: 18, y: 9 },
  { kind: 'mailbox', x: 21, y: 9 }, { kind: 'lamp', x: 44, y: 9 }, { kind: 'bench', x: 50, y: 9 },
  // 시장 좌판
  ...[17, 20, 23, 26, 29].map((x) => ({ kind: 'stall', x, y: 25 })),
  ...[18, 21, 24, 27, 30].map((x) => ({ kind: 'stall2', x, y: 28 })),
  // 공원
  { kind: 'tree', x: 1, y: 46 }, { kind: 'tree', x: 12, y: 46 }, { kind: 'tree', x: 1, y: 51 }, { kind: 'tree', x: 12, y: 51 },
  { kind: 'tree', x: 6, y: 51 }, { kind: 'bench', x: 4, y: 47 }, { kind: 'bench', x: 9, y: 47 }, { kind: 'lamp', x: 2, y: 48 },
  // 남쪽 끝 담과 나무
];

// 장소의 바깥 자리 (주민이 서 있는 곳). 문 앞(입구)은 자동. [x, y] 또는 { from: 'place', dx, dy } (그 장소 입구 기준)
export const SPOTS = {
  cvs: { front: { from: 'cvs', dx: 1, dy: 0 }, table: { from: 'cvs', dx: -2, dy: 0 } },
  pcbang: { smoke: { from: 'pcbang', dx: 2, dy: 1 } },
  pharmacy: { counter: { from: 'pharmacy', dx: 1, dy: 0 } },
  restaurant: { front: { from: 'restaurant', dx: 2, dy: 0 } },
  market: { banchan: [18, 26], fruit: [24, 26], fish: [26, 27], walk: [22, 26], entrance: [16, 27] },
  park: { bench1: [4, 48], bench2: [9, 48], plaza: [7, 49], walk: [2, 50] },
  church: { yard: { from: 'church', dx: -2, dy: 1 } },
  temple: { yard: [62, 16] },
  fortune: { front: { from: 'fortune', dx: 1, dy: 0 } },
  station: { exit3: [27, 9], exit4: [41, 9], plaza: [24, 9] },
  stream: { path: [24, 2], bridge: [46, 2] },
  office: { smoke: { from: 'office', dx: 3, dy: 1 } },
  gosiwon: { front: { from: 'gosiwon', dx: 1, dy: 0 } },
  sanctuary: { door: { from: 'sanctuary', dx: 2, dy: 1 } },
};

// 건물 문이 아닌 장소의 입구 (바닥 장소) · 연결 검사 시작 장소 · 지도 이름
export const EXTRA_PLACES = { market_house: [16, 27], market: [16, 27], station: [25, 9], stream: [24, 2], park: [7, 49] };
export const START = 'sanctuary';
export const MAP_ID = 'town';
export const MAP_CREDIT = 'Tiles: Kenney RPG Urban Pack (CC0). 신림동 구조를 손으로 단순화한 배치.';

// 신림역 출구 (도형 스프라이트)
export const STATION_EXITS = [
  { label: '신림역 3', x: 30, y: 8, sprite: 'station.exit' },
  { label: '신림역 4', x: 38, y: 8, sprite: 'station.exit' },
];

// 바닥 글자 (빈 칸에만. build-map 이 소품·자리와 겹치는지 검사)
// 27장: 바닥 글씨 대신 큰길 교차로 모퉁이에 파란 도로명 표지판 (기둥 칸 · 판 글자 위에서 아래로)
export const ROAD_SIGNS = [
  { x: 32, y: 11, plates: ['남부순환로', '신림로'] },
];
// 처음 들어가면 화면 위에 잠깐 뜨는 지역 이름 (위에서부터 먼저 맞는 것)
export const AREAS = [
  { name: '도림천 산책로', x: 0, y: 0, w: W, h: 4 },
  { name: '신림역 앞', x: 22, y: 8, w: 10, h: 2 },
  { name: '남부순환로', x: 0, y: 4, w: W, h: 6 },
  { name: '신림로', x: WALK_V[0], y: 10, w: WALK_V[1] - WALK_V[0] + 1, h: H - 10 },
  { name: '도림골목시장', ...MARKET },
  { name: '솔밭 쉼터', ...PARK },
];

// ── 성소 실내: build-map 이 공간 단계마다 한 장씩 만든다 (sim/space.js 의 SPACE_STEPS 와 같은 id)
export const SANCTUARY = {
  w: 18, h: 13,
  door: [9, 12],                // 아래쪽 가운데 계단으로 나간다
  pulpit: [9, 3],
  desk: [15, 3],
  counsel: [2, 4],
  seatArea: { x: 3, y: 6, w: 12, h: 5 },
  window: [[3, 1], [6, 1], [12, 1], [15, 1]],
};

// ════════════════════════════════════════════════════════════════════
// 30장: 신림동을 넓힌다. 위 '옛 동네'를 통째로 아래로 10칸 옮기고 (북쪽에 도림천 산책로 자리), 둘레에 새 구역 다섯을 붙인다.
//   새 구역 칸 = 구역 사각형 (ZONES). 닫힌 구역은 교주 걷기 지도에서만 막힌다 (sim/zones.js · build-map 이 둘레에 공사 펜스 자리를 낸다).
// ════════════════════════════════════════════════════════════════════
const OY = 10;
function shiftAll(dy) {
  const mv = (o) => { o.y += dy; };
  const mvXY = (a) => { a[1] += dy; };
  [...BUILDINGS, ...DEAD_ENDS, ...STAIRS, ...GROUND, ...CROSSWALKS, ...PROPS, ...STATION_EXITS, ...ROAD_SIGNS, ...AREAS, MARKET, PARK].forEach(mv);
  ROAD_H.y += dy;
  for (let i = 0; i < ROWS.length; i++) ROWS[i] += dy;
  for (const v of Object.values(EXTRA_PLACES)) mvXY(v);
  for (const spots of Object.values(SPOTS)) for (const v of Object.values(spots)) if (Array.isArray(v)) mvXY(v);
}
shiftAll(OY);
// 옛 '도림천 산책로' 지역 이름은 새 산책로 띠로 바꾼다
AREAS.splice(AREAS.findIndex((a) => a.name === '도림천 산책로'), 1);

// ── 새 구역 사각형 (열리는 조건은 sim/zones.js) ──
export const ZONES = [
  { id: 'stream', name: '도림천 산책로', x: 0, y: 0, w: W, h: 14, open: true },
  { id: 'gosi', name: '고시촌 골목', x: 72, y: 20, w: 28, h: 21 },
  { id: 'sundae', name: '순댓국 골목', x: 72, y: 41, w: 28, h: 21 },
  { id: 'market_in', name: '시장 안쪽', x: 0, y: 62, w: 32, h: 16 },
  { id: 'hill', name: '원룸 언덕', x: 38, y: 62, w: 62, h: 16 },
];
AREAS.unshift(...ZONES.map((z) => ({ name: z.name, x: z.x, y: z.y, w: z.w, h: z.h })));
ROWS.push(64, 71);                       // 남쪽 띠 두 줄 (원룸 언덕 · 시장 안쪽). 동쪽 구역은 옛 줄 높이를 그대로 쓴다

// ── 도림천 산책로 (북쪽 띠 y 0~13) ──
// 옛 물길(y 10~11)은 산책로가 된다: 옛 바닥 위에 덮어 쓴다
GROUND.push(
  { kind: 'water', x: 0, y: 0, w: W, h: 3 },
  { kind: 'path', x: 0, y: 3, w: W, h: 2 },
  { kind: 'grass', x: 0, y: 5, w: W, h: 5 },
  { kind: 'path', x: 0, y: 7, w: W, h: 1 },                 // 잔디 사이 샛길
  { kind: 'path', x: 0, y: 10, w: W, h: 4 },
);
PROPS.push(
  ...[2, 8, 14, 20, 26, 44, 50, 56, 68, 74, 80, 86, 92, 98].map((x) => ({ kind: 'cherry', x, y: 6 })),
  ...[5, 11, 17, 23, 47, 53, 71, 77, 83, 89, 95].map((x) => ({ kind: 'cherry', x, y: 9 })),
  { kind: 'bench', x: 58, y: 3 }, { kind: 'bench', x: 65, y: 3 },        // 다리 밑 벤치
  { kind: 'bench', x: 32, y: 8 }, { kind: 'bench', x: 38, y: 8 }, { kind: 'fountain', x: 35, y: 5 },
  { kind: 'flowers', x: 29, y: 5 }, { kind: 'flowers', x: 41, y: 5 }, { kind: 'lamp', x: 62, y: 5 },
);

// ── 동쪽: 고시촌 골목 (y 20~40) · 순댓국 골목 (y 41~61). 옛 동쪽 끝(x 71)과 사이에 세로 골목 x 72~73 ──
row(20, 74, [
  { w: 6, kind: 'mall', place: 'g_gosiwon', floors: 3 }, 2,
  { w: 5, kind: 'mall', place: 'g_reading', floors: 3 },
  { w: 4, kind: 'mixed', place: 'g_cupbap', shopfront: true }, 1,
  { w: 4, kind: 'mixed', shop: 'copy' },
  { w: 4, kind: 'villa', place: 'g_gositel' },
]);
row(27, 74, [
  { w: 6, kind: 'villa', place: 'g_studio' },
  { w: 4, kind: 'mixed', shop: 'stationery2' }, 2,
  { w: 6, kind: 'mall', place: 'g_academy', floors: 3 },
  { w: 4, kind: 'villa', h: 4 }, 1,
  { w: 3, kind: 'mixed', shop: 'cupddeok' },
]);
row(34, 74, [
  { w: 5, kind: 'villa', place: 'g_lodging' },
  { w: 5, kind: 'mixed', place: 'g_diner', shopfront: true }, 2,
  { w: 5, kind: 'mall', place: 'g_studycafe', floors: 3 },
  { w: 5, kind: 'villa', h: 4 }, 1,
  { w: 3, kind: 'mixed', shop: 'cvs3' },
]);
row(41, 74, [
  { w: 5, kind: 'mixed', place: 's_sundae_a', shopfront: true },
  { w: 5, kind: 'mixed', place: 's_sundae_b', shopfront: true },
  { w: 5, kind: 'mixed', place: 's_sundae_c', shopfront: true }, 1,
  { w: 5, kind: 'villa', place: 's_house_a' },
  { w: 5, kind: 'mixed', shop: 'hof2' },
]);
row(48, 74, [
  { w: 5, kind: 'mixed', shop: 'pocha' },
  { w: 4, kind: 'mixed', shop: 'jokbal' }, 2,
  { w: 5, kind: 'villa', place: 's_house_b' },
  { w: 5, kind: 'mixed', shop: 'gamjatang' },
  { w: 5, kind: 'villa', h: 4 },
]);
row(55, 74, [
  { w: 6, kind: 'villa', place: 's_house_c' },
  { w: 5, kind: 'mixed', shop: 'butcher2' }, 1,
  { w: 5, kind: 'villa' },
  { w: 4, kind: 'mixed', shop: 'kalguksu' },
  { w: 5, kind: 'villa', h: 4 },
]);

// ── 남쪽 띠 (y 62~77): 시장 안쪽 (x 0~31) · 원룸 언덕 (x 38~99). 옛 남쪽 끝 담 자리(y 62~63)는 골목이 됐다 ──
row(64, 0, [
  { w: 5, kind: 'mixed', place: 'm_ricecake', shopfront: true },
  { w: 5, kind: 'mixed', place: 'm_mill', shopfront: true }, 2,
  { w: 5, kind: 'mixed', place: 'm_fish', shopfront: true },
  { w: 4, kind: 'mixed', shop: 'veg' }, 1,
  { w: 5, kind: 'villa', place: 'm_house' },
  { w: 5, kind: 'mixed', shop: 'dried' },
]);
export const MARKET_IN = { x: 0, y: 69, w: 32, h: 9 };       // 좌판 골목 (가운데 두 줄 좌판)
GROUND.push({ kind: 'market', ...MARKET_IN });
PROPS.push(
  ...[2, 6, 10, 14, 18, 22, 26].map((x, k) => ({ kind: ['stall', 'stall2', 'stall3'][k % 3], x, y: 72 })),
  ...[4, 8, 12, 16, 20, 24, 28].map((x, k) => ({ kind: ['stall3', 'stall', 'stall2'][k % 3], x, y: 75 })),
);
row(64, 38, [
  { w: 5, kind: 'villa', place: 'h_villa_a' }, { gap: 2, stairs: true },
  { w: 6, kind: 'villa', place: 'h_villa_b' },
  { w: 5, kind: 'mixed', place: 'h_cvs', shopfront: true }, { gap: 2, stairs: true },
  { w: 5, kind: 'villa' },
  { w: 6, kind: 'villa', place: 'h_villa_c' }, { gap: 2, stairs: true },
  { w: 4, kind: 'mixed', shop: 'laundry2' },
  { w: 5, kind: 'villa' }, { gap: 2, stairs: true },
  { w: 5, kind: 'villa', place: 'h_villa_d' },
  { w: 4, kind: 'mixed', shop: 'realty3' }, { gap: 2, stairs: true },
  { w: 5, kind: 'villa' }, 2,
]);
row(71, 38, [
  { w: 6, kind: 'villa' }, { gap: 2, stairs: true },
  { w: 5, kind: 'villa', place: 'h_villa_e' },
  { w: 4, kind: 'mixed', shop: 'bunsik4' }, { gap: 2, stairs: true },
  { w: 6, kind: 'villa' },
  { w: 5, kind: 'villa', place: 'h_rooftop' }, { gap: 2, stairs: true },
  { w: 5, kind: 'villa' },
  { w: 4, kind: 'mixed', shop: 'repair' }, { gap: 2, stairs: true },
  { w: 6, kind: 'villa' },
  { w: 5, kind: 'villa' }, { gap: 2, stairs: true },
  { w: 4, kind: 'villa' }, 2,
]);
GROUND.push(...STAIRS.map((r) => ({ kind: 'stairs', ...r })));

// 큰길: 신림로 남쪽 끝까지 횡단보도 둘 더 · 남부순환로 동쪽 횡단보도 하나
CROSSWALKS.push(
  { x: 33, y: 69, w: 4, h: 2, dir: 'h' }, { x: 33, y: 76, w: 4, h: 2, dir: 'h' },
  { x: 85, y: 14, w: 3, h: 4, dir: 'v' },
);
ROAD_SIGNS.push({ x: 71, y: 21, plates: ['남부순환로', '고시촌길'] });

// 새 장소 바깥 자리 · 바닥 장소
Object.assign(SPOTS, {
  stream: { ...SPOTS.stream, cherry: [26, 8], underbridge: [61, 3], fountain: [36, 6], exercise: [80, 8], bench: [12, 8], mid: [70, 11], east: [90, 11] },
  g_cupbap: { front: { from: 'g_cupbap', dx: 1, dy: 0 } },
  g_reading: { smoke: { from: 'g_reading', dx: -1, dy: 1 } },
  g_academy: { front: { from: 'g_academy', dx: 2, dy: 0 } },
  g_diner: { front: { from: 'g_diner', dx: 1, dy: 0 } },
  g_lane: { board: [87, 26], corner: [73, 33] },
  s_sundae_a: { front: { from: 's_sundae_a', dx: 1, dy: 0 } },
  s_sundae_b: { front: { from: 's_sundae_b', dx: 1, dy: 0 } },
  s_sundae_c: { front: { from: 's_sundae_c', dx: 1, dy: 1 } },
  s_lane: { tables: [90, 47], corner: [73, 54] },
  m_ricecake: { front: { from: 'm_ricecake', dx: 1, dy: 0 } },
  m_mill: { front: { from: 'm_mill', dx: 1, dy: 0 } },
  m_fish: { front: { from: 'm_fish', dx: 1, dy: 0 } },
  m_alley: { stalls: [12, 73], end: [26, 76] },
  h_cvs: { front: { from: 'h_cvs', dx: 1, dy: 0 }, table: { from: 'h_cvs', dx: -2, dy: 1 } },
  h_lane: { stairs: [50, 70], top: [70, 63], view: [90, 63] },
});
Object.assign(EXTRA_PLACES, { m_alley: [16, 71] });

// 마을버스 정류장 (30장 C): 걸을 수 있는 칸 (build-map 이 검사)
export const MINIBUS_STOPS = [
  { id: 'sanctuary', name: '동림상가 앞', tile: [29, 26] },
  { id: 'stream', name: '도림천 산책로', tile: [44, 12] },
  { id: 'market_in', name: '시장 안쪽', tile: [30, 70], zone: 'market_in' },
  { id: 'hill', name: '원룸 언덕', tile: [64, 69], zone: 'hill' },
  { id: 'gosi', name: '고시촌 입구', tile: [73, 26], zone: 'gosi' },
  { id: 'sundae', name: '순댓국 골목', tile: [73, 47], zone: 'sundae' },
];
