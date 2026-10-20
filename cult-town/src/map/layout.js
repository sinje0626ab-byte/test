// 동네 배치 (사람이 읽고 고치는 원본). `npm run map` 이 이걸로 Tiled JSON(town.json)을 만든다.
// 좌표는 16px 타일 단위 (x, y, 너비 w, 높이 h). 위쪽이 북쪽.
// 실제 신림동 구조를 손으로 단순화했다: 위쪽 가장자리 도림천, 그 아래 남부순환로(가로),
// 가운데 신림로(세로), 두 길이 만나는 곳에 신림역 출구. 역 남서쪽에 상가 골목·시장, 남동쪽 언덕에 원룸촌.
// 정확한 지도가 아니다. 가게·교회·절·건물 이름은 전부 지어낸 것이다 (data/places.js).

export const W = 72;
export const H = 54;

// 바닥 영역: 뒤에 나온 것이 앞의 것을 덮는다
//   kind: water(못 걸음) · lot(빈 땅·주차장) · grass · sidewalk · road(걸을 수 있지만 길찾기 비용 큼) · alley · plaza · market
export const GROUND = [
  { kind: 'lot', x: 0, y: 0, w: W, h: H },
  { kind: 'water', x: 0, y: 0, w: W, h: 3 },                 // 도림천
  { kind: 'sidewalk', x: 0, y: 4, w: W, h: 1 },
  { kind: 'road', x: 0, y: 5, w: W, h: 4, line: 'h', name: '남부순환로' },
  { kind: 'sidewalk', x: 0, y: 9, w: W, h: 1 },
  // 블록 사이 골목
  { kind: 'alley', x: 0, y: 22, w: 32, h: 2 },
  { kind: 'alley', x: 37, y: 22, w: 35, h: 2 },
  { kind: 'alley', x: 0, y: 36, w: 32, h: 2 },
  { kind: 'alley', x: 37, y: 36, w: 35, h: 2 },
  { kind: 'alley', x: 0, y: 50, w: 32, h: 2 },
  { kind: 'alley', x: 37, y: 50, w: 35, h: 2 },
  { kind: 'alley', x: 14, y: 10, w: 2, h: 44 },
  { kind: 'alley', x: 53, y: 10, w: 2, h: 44 },
  { kind: 'sidewalk', x: 32, y: 9, w: 1, h: H - 9 },
  { kind: 'sidewalk', x: 37, y: 9, w: 1, h: H - 9 },
  { kind: 'road', x: 33, y: 5, w: 4, h: H - 5, line: 'v', name: '신림로' },
  // 블록 바닥
  { kind: 'sidewalk', x: 0, y: 10, w: 14, h: 4 },            // 편의점 앞 인도
  { kind: 'plaza', x: 22, y: 10, w: 10, h: 3 },              // 역 앞 광장
  { kind: 'sidewalk', x: 16, y: 10, w: 6, h: 5 },
  { kind: 'market', x: 16, y: 24, w: 16, h: 12 },            // 전통시장
  { kind: 'grass', x: 0, y: 38, w: 14, h: 12 },              // 솔밭 쉼터
  { kind: 'plaza', x: 3, y: 41, w: 8, h: 6 },                // 공원 광장
  { kind: 'sidewalk', x: 38, y: 10, w: 15, h: 3 },
  { kind: 'plaza', x: 56, y: 10, w: 15, h: 2 },              // 절 앞마당
  { kind: 'sidewalk', x: 0, y: 52, w: W, h: 2 },
];

// 횡단보도 (길찾기 비용이 인도와 같다)
export const CROSSWALKS = [
  { x: 28, y: 5, w: 3, h: 4, dir: 'v' },     // 남부순환로 건너기 (역 서쪽)
  { x: 40, y: 5, w: 3, h: 4, dir: 'v' },     // 남부순환로 건너기 (역 동쪽)
  { x: 33, y: 10, w: 4, h: 2, dir: 'h' },    // 신림로 건너기 (역 앞)
  { x: 33, y: 22, w: 4, h: 2, dir: 'h' },
  { x: 33, y: 36, w: 4, h: 2, dir: 'h' },
  { x: 33, y: 50, w: 4, h: 2, dir: 'h' },
];

// 건물: 지붕(roof) 9칸 + 맨 아래 두 줄이 정면(wall: 창문·문). 문은 맨 아래 줄, 그 앞 칸이 입구.
//   place: data/places.js 의 id · door: 문 x (기본 가운데) · sign: 간판 스프라이트 키 (도형으로 그림)
//   enter: 'sanctuary' 면 실내 맵으로 들어간다
export const BUILDINGS = [
  { place: 'cvs', x: 1, y: 15, w: 6, h: 7, roof: 'gray', wall: 'gray', shopfront: true },
  { place: 'pcbang', x: 7, y: 14, w: 7, h: 8, roof: 'beige', wall: 'orange' },
  { place: 'pharmacy', x: 16, y: 15, w: 6, h: 7, roof: 'gray', wall: 'gray', shopfront: true },
  { place: 'sanctuary', x: 23, y: 13, w: 9, h: 9, roof: 'beige', wall: 'red', door: 27, enter: 'sanctuary', floors: 4 },
  { place: 'restaurant', x: 1, y: 28, w: 7, h: 8, roof: 'red', wall: 'orange', shopfront: true },
  { place: 'academy', x: 8, y: 26, w: 6, h: 10, roof: 'gray', wall: 'gray' },
  { place: 'church', x: 17, y: 40, w: 8, h: 10, roof: 'beige', wall: 'red', door: 21 },
  { place: 'villa_tong', x: 26, y: 43, w: 6, h: 7, roof: 'orange', wall: 'orange' },
  { place: 'office', x: 39, y: 12, w: 8, h: 10, roof: 'gray', wall: 'gray' },
  { place: 'fortune', x: 47, y: 16, w: 6, h: 6, roof: 'red', wall: 'red' },
  { place: 'temple', x: 58, y: 13, w: 10, h: 9, roof: 'orange', wall: 'orange', door: 63 },
  { place: 'oneroom_a', x: 38, y: 27, w: 7, h: 9, roof: 'gray', wall: 'red' },
  { place: 'oneroom_b', x: 45, y: 27, w: 8, h: 9, roof: 'beige', wall: 'orange' },
  { place: 'gosiwon', x: 56, y: 26, w: 7, h: 10, roof: 'gray', wall: 'gray' },
  { place: 'oneroom_c', x: 63, y: 27, w: 8, h: 9, roof: 'red', wall: 'red' },
  { place: 'oneroom_d', x: 38, y: 41, w: 7, h: 9, roof: 'beige', wall: 'orange' },
  { place: 'villa_b', x: 45, y: 40, w: 8, h: 10, roof: 'orange', wall: 'red' },
  { place: 'oneroom_e', x: 56, y: 41, w: 7, h: 9, roof: 'gray', wall: 'gray' },
  { place: 'oneroom_f', x: 63, y: 41, w: 8, h: 9, roof: 'beige', wall: 'red' },
  { place: 'market_house', x: 1, y: 40, w: 0, h: 0 },        // 자리만 (시장 2층 살림집은 시장 안에 있다고 친다)
].filter((b) => b.w > 0);

// 소품 (못 지나감, 표시는 RPG Urban 타일). kind 는 build-map.mjs 의 PROPS 표
export const PROPS = [
  // 남부순환로 가로수
  ...[2, 8, 14, 20, 44, 50, 56, 62, 68].map((x) => ({ kind: 'tree', x, y: 3 })),
  // 편의점 앞 테이블·자판기
  { kind: 'vending', x: 6, y: 11 }, { kind: 'bench', x: 2, y: 11 }, { kind: 'trash', x: 9, y: 10 },
  { kind: 'lamp', x: 12, y: 10 },
  // 역 앞
  { kind: 'lamp', x: 22, y: 10 }, { kind: 'mailbox', x: 18, y: 10 }, { kind: 'bike', x: 20, y: 11 },
  // 시장 좌판
  ...[17, 20, 23, 26, 29].map((x) => ({ kind: 'stall', x, y: 26 })),
  ...[17, 20, 23, 26, 29].map((x) => ({ kind: 'stall2', x, y: 31 })),
  // 공원
  { kind: 'tree', x: 1, y: 39 }, { kind: 'tree', x: 11, y: 39 }, { kind: 'tree', x: 1, y: 47 }, { kind: 'tree', x: 11, y: 47 },
  { kind: 'tree', x: 6, y: 48 }, { kind: 'bench', x: 4, y: 44 }, { kind: 'bench', x: 8, y: 44 }, { kind: 'lamp', x: 3, y: 40 },
  // 원룸촌 골목
  { kind: 'trash', x: 44, y: 24 }, { kind: 'trash', x: 62, y: 24 }, { kind: 'bike', x: 47, y: 38 }, { kind: 'lamp', x: 55, y: 24 },
  { kind: 'trash', x: 52, y: 52 }, { kind: 'vending', x: 63, y: 38 },
  // 절 앞
  { kind: 'tree', x: 57, y: 10 }, { kind: 'tree', x: 69, y: 10 },
  // 교회 앞
  { kind: 'bench', x: 16, y: 52 },
];

// 장소의 바깥 자리 (주민이 서 있는 곳). 문 앞은 자동으로 생긴다.
//   name: 일과에서 'park:bench' 처럼 부른다
export const SPOTS = {
  cvs: { front: [3, 12], table: [4, 11] },
  pcbang: { smoke: [11, 12] },
  pharmacy: { counter: [19, 22] },
  restaurant: { front: [4, 37] },
  market: { banchan: [18, 28], fruit: [24, 28], fish: [27, 33], walk: [21, 34], entrance: [24, 23] },
  park: { bench1: [5, 45], bench2: [9, 45], plaza: [7, 43], walk: [3, 49] },
  church: { yard: [20, 51] },
  temple: { yard: [62, 11] },
  fortune: { front: [50, 22] },
  sanctuary: { door: [29, 22] },
  station: { exit3: [27, 11], exit4: [38, 11], plaza: [25, 12] },
  stream: { path: [24, 4], bridge: [46, 4] },
  office: { smoke: [44, 23] },
  gosiwon: { front: [59, 37] },
};

// 신림역 출구 (도형 스프라이트)
export const STATION_EXITS = [
  { label: '신림역 3', x: 29, y: 10, sprite: 'station.exit' },
  { label: '신림역 4', x: 38, y: 10, sprite: 'station.exit' },
];

// 플레이어 시작 위치: 성소 건물 문 앞
export const PLAYER_START = [27, 23];

// ── 성소 실내 (상가 3층 한 칸) ──
export const SANCTUARY = {
  w: 18, h: 13,
  door: [9, 12],                // 아래쪽 가운데 계단으로 나간다
  pulpit: [9, 3],               // 단상
  desk: [15, 3],                // 사무 책상
  counsel: [2, 4],              // 상담 의자
  seatArea: { x: 3, y: 6, w: 12, h: 5 },   // 접이식 의자가 놓이는 곳
  window: [[3, 1], [6, 1], [12, 1], [15, 1]],
};
