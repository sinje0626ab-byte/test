// layout.js → Tiled JSON (src/map/town.json, src/map/sanctuary-*.json)
// 타일 번호는 RPG Urban tilemap_packed.png (27열, 간격 0) / Roguelike Indoors (27열, 간격 1) 의 0부터 센 번호.
// Tiled gid = 번호 + 1. 길찾기 비용은 map.properties 'cost' (행마다 숫자, 0 = 못 감).
// 골목 소품(전봇대·주차 차량·분리수거함·화분·자전거)은 시드 고정 난수로 골목마다 흩뿌린다.
import { writeFileSync, readFileSync } from 'node:fs';
import { SPACE_MAPS } from '../src/map/interiors.js';

// 어느 동네를 뽑나: 인자 없으면 신림동(layout.js) + 성소 실내, 'bongcheon' 이면 layout-bongcheon.js
const which = process.argv[2] ?? 'town';
const L = await import(which === 'town' ? '../src/map/layout.js' : `../src/map/layout-${which}.js`);
const { W, H, GROUND, CROSSWALKS, BUILDINGS, PROPS, SPOTS, STATION_EXITS, ROAD_SIGNS, AREAS, DEAD_ENDS, ROWS, ROW_H, WALK_V, EXTRA_PLACES, START, MAP_ID, MAP_CREDIT } = L;

const out = (name) => new URL(`../src/map/${name}`, import.meta.url);

// ── 동네 타일: LimeZu Modern Exteriors 아틀라스 (tools/build-assets.py → public/assets/lz/town.png · town.json 의 tiles) ──
const LZ_TOWN = JSON.parse(readFileSync(new URL('../public/assets/lz/town.json', import.meta.url)));
const TI = (name) => { const i = LZ_TOWN.tiles[name]; if (i == null) throw new Error(`동네 타일 없음: ${name}`); return i; };
const U = {
  lot: TI('sidewalk'), sidewalk: TI('sidewalk'), plaza: TI('plaza'), alley: TI('alley'), road: TI('road'), market: TI('market'), grass: TI('grass'), path: TI('sidewalk'),
  water: TI('water'), waterBottom: TI('waterBottom'), laneH: TI('laneH'), laneV: TI('laneV'), crossV: TI('crossV'), crossH: TI('crossH'),
};
// 건물 (27장): 지붕 한 칸 + (5칸 건물만) 위층 작은 창 띠 한 칸 + 1층 세 칸 (LimeZu 모듈 건물, 1층 48px = 사람 키의 1.5배)
const ROOF_THIN = { A: [0, 1, 2].map((i) => TI(`roofA_thin_${i}`)), B: [0, 1, 2].map((i) => TI(`roofB_thin_${i}`)) };
// 벽 넷 (예전 이름 그대로: red·red2·orange·orange2 → 벽돌·베이지·파랑·회색)
const WALL_COLOR = { red: 'brick', red2: 'beige', orange: 'blue', orange2: 'grey' };
const G = (c, piece) => [0, 1, 2].map((r) => TI(`g_${c}_${piece}_${r}`));
const WALL = Object.fromEntries(Object.entries(WALL_COLOR).map(([k, c]) => [k, {
  up: { A: TI(`up_${c}_A`), B: TI(`up_${c}_B`), P: TI(`up_${c}_P`) },
  piece: (name) => G(c, name),
}]));
const WALLS = Object.keys(WALL);
// 1층 무늬: 가게는 진열창 두 칸씩 (5·7·9·11 + 짝), 집은 긴 창 + 민벽, 문은 유리문(shop3) · 상가 문은 흰 문틀(mdoor)
const SHOP_PAIRS = [['shop1', 'shop2'], ['shop5', 'shop6'], ['shop7', 'shop8'], ['shop9', 'shop10'], ['shop11', 'shop12']];
const HOME_PATTERNS = [['condo7', 'condo2'], ['condo1', 'condo2'], ['condo7', 'condo8']];
// 소품: 지도 오브젝트 'lz' (TownScene 이 사람과 같이 y 정렬해 그린다). 담만 타일
const PROP = {
  tree: { lz: 'tree' }, lamp: { lz: 'lamp' }, vending: { lz: 'vending' }, bench: { lz: 'bench' }, trash: { lz: 'trash' }, mailbox: { lz: 'mailbox' },
  stall: { lz: 'stall' }, stall2: { lz: 'stall2' }, fence: { base: TI('fence') }, pole: { lz: 'pole' }, plant: { lz: 'plant' }, bags: { lz: 'bags' }, bin: { lz: 'bin' },
  // 골목에 주차된 차 자리: LimeZu 차는 두 칸 폭이라 2칸 골목을 막는다 → 상자·화분·쓰레기통으로 (난수 순서는 그대로)
  car: { lz: ['bags2', 'plant2', 'trash2', 'recycle2'] },
};
// 도형으로 그리는 소품 (TownScene 이 스프라이트 키로 그린다)
const SHAPE_PROPS = { bike: 'prop.bike' };
PROP.recycle = { lz: 'recycle' };
const COST = { water: 0, lot: 2, grass: 2, sidewalk: 1, path: 1, road: 6, alley: 1, plaza: 1, market: 1, cross: 1 };

// 시드 고정 난수 (지도가 매번 같게)
let seed = 20261020;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const hash = (n) => { let h = Math.imul(n + 1, 2654435761) >>> 0; h = (h ^ (h >>> 13)) >>> 0; return h; };

const grid = (w, h, v) => Array.from({ length: h }, () => Array(w).fill(v));
const ground = grid(W, H, U.alley);
const detail = grid(W, H, -1);
const build = grid(W, H, -1);
const deco = grid(W, H, -1);
const above = grid(W, H, -1);
const kind = grid(W, H, 'alley');
const blocked = grid(W, H, false);
const reserved = grid(W, H, false);     // 입구·자리·글자와 그 둘레: 흩뿌리는 소품을 놓지 않는다
const exact = grid(W, H, false);        // 입구·자리·글자 바로 그 칸: 어떤 소품도 놓지 않는다
const inMap = (x, y) => x >= 0 && y >= 0 && x < W && y < H;

for (const g of GROUND) {
  for (let y = g.y; y < g.y + g.h; y++) for (let x = g.x; x < g.x + g.w; x++) {
    if (!inMap(x, y)) continue;
    kind[y][x] = g.kind;
    ground[y][x] = U[g.kind];
    if (g.kind === 'water') ground[y][x] = y === g.y + g.h - 1 ? U.waterBottom : U.water;
    if (g.kind === 'road' && g.line === 'h' && (y === g.y + 1 || y === g.y + 2) && x % 2 === 0) detail[y][x] = U.laneH;
    if (g.kind === 'road' && g.line === 'v' && (x === g.x + 1 || x === g.x + 2) && y % 2 === 0 && y > 9) detail[y][x] = U.laneV;
  }
}
for (const c of CROSSWALKS) {
  for (let y = c.y; y < c.y + c.h; y++) for (let x = c.x; x < c.x + c.w; x++) { kind[y][x] = 'cross'; detail[y][x] = c.dir === 'v' ? U.crossV : U.crossH; }
}

// ── 건물 ──
const objects = [];
let oid = 1;
const places = {};
const buildingsOut = [];
BUILDINGS.forEach((b, i) => {
  const roofH = 1;
  const upper = b.h - 4;                 // 5칸 건물: 위층 띠 한 줄 · 4칸: 없음
  const RK = hash(i) % 2 ? 'B' : 'A';
  const base = b.place?.replace(/^b_/, '');   // 봉천동 장소는 b_ 를 떼고 같은 모양
  const wallName = b.wall ?? (base === 'church' ? 'red' : base === 'temple' ? 'orange2' : WALLS[hash(i + 7) % WALLS.length]);
  const Wl = WALL[wallName];
  const doorX = b.door ?? b.x + Math.floor(b.w / 2);
  const col = (x, arr) => (x === b.x ? arr[0] : x === b.x + b.w - 1 ? arr[2] : arr[1]);
  const isShop = b.kind === 'mixed' || b.shopfront || (b.kind === 'mall' && b.signs?.at(-1));
  const pat = isShop ? SHOP_PAIRS[hash(i + 3) % SHOP_PAIRS.length] : HOME_PATTERNS[hash(i + 3) % HOME_PATTERNS.length];
  const shutterAt = isShop && b.w >= 5 && hash(i + 11) % 3 === 0 ? (doorX > b.x + b.w / 2 ? b.x : b.x + b.w - 1) : -1;
  const doorPiece = b.kind === 'mall' ? 'mdoor' : 'shop3';
  // 1층 조각: 문·셔터로 나뉜 구간마다 짝(왼쪽·오른쪽)을 온전히 깐다. 구간이 홀수 칸이면 건물 끝 쪽 한 칸은 민벽 (반쪽 창이 남지 않게)
  const groundPiece = {};
  {
    const cuts = [doorX, shutterAt].filter((x) => x >= b.x);
    let start = b.x;
    for (let x = b.x; x <= b.x + b.w; x++) {
      if (x < b.x + b.w && !cuts.includes(x)) continue;
      const n = x - start;
      const outerLeft = start === b.x;           // 이 구간이 건물 왼쪽 끝에 붙어 있나
      const pad = n % 2 ? (outerLeft ? start : x - 1) : -1;
      let k = 0;
      for (let xx = start; xx < x; xx++) {
        if (xx === pad) { groundPiece[xx] = 'condo8'; continue; }
        groundPiece[xx] = pat[k % 2];
        k++;
      }
      if (x < b.x + b.w) groundPiece[x] = x === doorX ? doorPiece : 'shop4';
      start = x + 1;
    }
  }
  for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) {
    blocked[y][x] = true; kind[y][x] = 'block';
    const ry = y - b.y; const cx = x - b.x;
    if (ry < roofH) build[y][x] = col(x, ROOF_THIN[RK]);
    else if (ry < roofH + upper) {
      const k = cx % 3;
      build[y][x] = k === 0 || (k === 1 && cx === b.w - 1) ? Wl.up.P : k === 1 ? Wl.up.A : Wl.up.B;
    } else {
      const gr = ry - roofH - upper;
      const piece = groundPiece[x];
      build[y][x] = Wl.piece(piece)[gr];
    }
  }
  const doorY = b.y + b.h - 1;
  const entrance = [doorX, doorY + 1];
  reserved[entrance[1]][entrance[0]] = true;
  if (b.place) {
    places[b.place] = { door: entrance };
    objects.push({ id: oid++, name: b.place, type: 'door', x: entrance[0] * 16, y: entrance[1] * 16, width: 16, height: 16,
      properties: [{ name: 'enter', type: 'string', value: b.place === 'sanctuary' || b.place === 'b_branch' ? b.place : '' }] });
  }
  buildingsOut.push({ i, x: b.x, y: b.y, w: b.w, h: b.h, roofH, upper, floors: upper + 1, kind: b.kind, place: b.place ?? null, shop: b.shop ?? null, signs: b.signs ?? null, door: doorX, isShop: !!isShop });
});
for (const [k, door] of Object.entries(EXTRA_PLACES)) places[k] = { door };

// 막다른 골목의 담
for (const d of DEAD_ENDS) for (let x = d.x; x < d.x + d.w; x++) { deco[d.y][x] = PROP.fence.base; blocked[d.y][x] = true; }

// ── 바깥 자리 ── (입구 기준 상대 좌표 풀기)
const spotsOut = {};
for (const [place, spots] of Object.entries(SPOTS)) {
  for (const [name, v] of Object.entries(spots)) {
    const t = Array.isArray(v) ? v : [places[v.from].door[0] + v.dx, places[v.from].door[1] + v.dy];
    if (!inMap(...t) || blocked[t[1]][t[0]]) throw new Error(`자리 ${place}:${name} (${t}) 가 막힌 칸이다`);
    spotsOut[place] = { ...(spotsOut[place] ?? {}), [name]: t };
    reserved[t[1]][t[0]] = true; exact[t[1]][t[0]] = true;
    // 자리 둘레 한 칸도 비워 둔다 (사람이 비켜 서는 자리)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (inMap(t[0] + dx, t[1] + dy)) reserved[t[1] + dy][t[0] + dx] = true;
    objects.push({ id: oid++, name: `${place}:${name}`, type: 'spot', x: t[0] * 16, y: t[1] * 16, width: 16, height: 16 });
  }
}
for (const [place, s] of Object.entries(spotsOut)) places[place] = { ...(places[place] ?? {}), spots: s };
for (const [place, p] of Object.entries(places)) {
  if (p.door && blocked[p.door[1]][p.door[0]]) throw new Error(`입구 ${place} (${p.door}) 가 막힌 칸이다`);
  if (p.door) { reserved[p.door[1]][p.door[0]] = true; exact[p.door[1]][p.door[0]] = true; }
}
// 도로명 표지판 기둥 칸 (27장: 바닥 글씨는 없앴다)
for (const r of ROAD_SIGNS) { reserved[r.y][r.x] = true; exact[r.y][r.x] = true; }

// ── 손으로 놓은 소품 ──
const shapeProps = [];
const poles = [];
const propTiles = new Set();      // 골목에 흩뿌린 소품 칸 (통로 검사용)
const lzProps = [];               // LimeZu 소품 오브젝트 { sprite, x, y, wall? }
const placeProp = (k, x, y, onBlocked = false) => {
  const t = PROP[k];
  if (SHAPE_PROPS[k]) { shapeProps.push({ kind: k, sprite: SHAPE_PROPS[k], x, y }); blocked[y][x] = true; return; }
  if (t.lz) lzProps.push({ sprite: Array.isArray(t.lz) ? t.lz[Math.floor(rnd() * t.lz.length)] : t.lz, x, y });
  else deco[y][x] = t.base;
  blocked[y][x] = true;
  if (k === 'pole') poles.push([x, y]);
  void onBlocked;
};
for (const p of PROPS) {
  if (!inMap(p.x, p.y)) continue;
  if (exact[p.y][p.x]) throw new Error(`소품 ${p.kind} (${p.x},${p.y}) 가 입구·자리·글자와 겹친다`);
  placeProp(p.kind, p.x, p.y);
}
for (const e of STATION_EXITS) {
  blocked[e.y][e.x] = true;
  objects.push({ id: oid++, name: 'station', type: 'exit', x: e.x * 16, y: e.y * 16, width: 16, height: 16,
    properties: [{ name: 'sprite', type: 'string', value: e.sprite }, { name: 'label', type: 'string', value: e.label }] });
}

// ── 골목 소품 흩뿌리기 ──
// 골목은 줄마다 입구 줄(첫 칸)과 뒷줄(둘째 칸). 소품은 뒷줄에만 놓아 입구를 막지 않는다.
// 세로로 빠지는 틈(아래가 걸을 수 있는 칸) 앞, 입구 바로 아래, 자리 둘레에는 놓지 않는다. 연달아 두 개도 안 놓는다.
const westX = [0, WALK_V[0] - 1]; const eastX = [WALK_V[1] + 1, W - 1];
const walkable = (x, y) => inMap(x, y) && !blocked[y][x] && kind[y][x] !== 'water';
const alleyRows = ROWS.map((top) => top + ROW_H + 1);
alleyRows.unshift(ROWS[0] - 1);   // 큰길 쪽 인도 뒷줄 (y 9)
const KINDS = ['car', 'recycle', 'plant', 'bike', 'bags', 'car', 'plant', 'bin'];
for (const yb of alleyRows) {
  for (const [x0, x1] of [westX, eastX]) {
    let lastPole = -99; let last = -99;
    for (let x = x0 + 1; x < x1; x++) {
      if (kind[yb][x] !== 'alley' && kind[yb][x] !== 'sidewalk') continue;
      if (reserved[yb][x] || reserved[yb - 1]?.[x]) continue;
      if (walkable(x, yb + 1) && kind[yb + 1][x] !== 'water') continue;  // 아래로 빠지는 틈
      if (!walkable(x, yb - 1) || !walkable(x - 1, yb - 1) || !walkable(x + 1, yb - 1)) continue;
      if (x - last < 2) continue;
      // 전봇대: 골목 뒷줄 너머 건물 칸(원래 못 걷는 칸)에 세운다. 위 두 칸은 사람 위에 그려진다
      if (x - lastPole >= 8 && yb !== ROWS[0] - 1 && blocked[yb + 1]?.[x]) { placeProp('pole', x, yb + 1, true); lastPole = x; continue; }
      // 나머지 소품: 뒷줄에만, 아래로 빠지는 샛길 입구 양옆에도 안 놓는다
      if (walkable(x - 1, yb + 1) || walkable(x + 1, yb + 1)) continue;
      // 옆 한 칸만 남기고 그 너머가 막혀 있으면 주머니(막다른 칸)가 생긴다
      if ([-1, 1].some((d) => walkable(x + d, yb) && !walkable(x + 2 * d, yb))) continue;
      if (rnd() < 0.22) { placeProp(KINDS[Math.floor(rnd() * KINDS.length)], x, yb); propTiles.add(`${x},${yb}`); last = x; }
    }
  }
}
// 실외기 (건물 정면 맨 아랫줄 구석, 막힌 칸 위 장식)
for (const b of buildingsOut) {
  if (b.kind === 'special' || hash(b.i * 3) % 3 === 0) continue;
  const x = b.x + b.w - 1; const y = b.y + b.h - 1;
  if (x !== b.door) lzProps.push({ sprite: 'ac', x, y, wall: true });
}

// 큰길에 선 차: 차가 덮는 칸(가로 4×2 · 세로 2×4)은 막는다. 횡단보도·입구·자리 둘레는 비운다
for (const g of GROUND.filter((r) => r.kind === 'road' && r.line)) {
  const free = (x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (!inMap(x, y) || kind[y][x] !== 'road' || reserved[y][x] || blocked[y][x] || CROSSWALKS.some((c) => x >= c.x - 1 && x <= c.x + c.w && y >= c.y - 1 && y <= c.y + c.h)) return false; return true; };
  const park = (sprite, x, y, w, h) => { lzProps.push({ sprite, x, y: y + h - 1, road: true, w }); for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) blocked[yy][xx] = true; };
  if (g.line === 'h') for (let x = 5; x < g.x + g.w - 4; x += 13) { const y = g.y + 1 + (x % 2); if (free(x, y, 4, 2)) park(x % 3 ? 'carL1' : 'carR1', x, y, 4, 2); }
  if (g.line === 'v') for (let y = g.y + 6, n = -99; y < g.y + g.h - 4; y++) { const x = g.x + (y % 2 ? 0 : 2); if (y - n >= 9 && free(x, y, 2, 4)) { park(['carU1', 'carD1', 'carU2', 'carD2'][y % 4], x, y, 2, 4); n = y; } }
}
// ── 연결 검사: 걸을 수 있는 칸이 모두 한 덩어리인가 ──
{
  const seen = grid(W, H, false);
  const start = places[START].door;
  const q = [start]; seen[start[1]][start[0]] = true; let n = 0;
  while (q.length) {
    const [x, y] = q.pop(); n++;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx; const ny = y + dy;
      if (walkable(nx, ny) && !seen[ny][nx]) { seen[ny][nx] = true; q.push([nx, ny]); }
    }
  }
  const all = kind.flat().filter((k, i) => walkable(i % W, Math.floor(i / W))).length;
  if (n !== all) {
    const lost = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (walkable(x, y) && !seen[y][x]) lost.push(`${x},${y}`);
    console.log(`  (갇힌 칸 ${all - n}개: ${lost.slice(0, 12).join(' ')}) → 담으로 메운다`);
    for (const t of lost) { const [x, y] = t.split(',').map(Number); blocked[y][x] = true; deco[y][x] = PROP.fence.base; }
  }
}
// 막다른 골목 수 (세 방향이 막힌 칸) · 소품 때문에 새로 생긴 막다른 칸
const isDead = (x, y, walk) => walk(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => walk(x + dx, y + dy)).length === 1;
const walkNoProps = (x, y) => walkable(x, y) || propTiles.has(`${x},${y}`);
let deadEnds = 0; let propDead = 0; const propDeadAt = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (isDead(x, y, walkable)) { deadEnds++; if (!isDead(x, y, walkNoProps)) { propDead++; propDeadAt.push(`${x},${y}`); } }
}
// 골목 통로 검사: 골목 띠(두 줄)의 칸 기둥마다 걸을 수 있는 칸이 하나 이상
let blockedCols = 0; const blockedAt = [];
for (const yb of alleyRows) for (let x = 0; x < W; x++) {
  const ys = [yb - 1, yb].filter((y) => ['alley', 'sidewalk', 'cross'].includes(kind[y]?.[x]) || propTiles.has(`${x},${y}`));
  if (ys.length === 2 && !ys.some((y) => walkable(x, y))) { blockedCols++; blockedAt.push(`${x},${yb}`); }
}
console.log(`통로 검사: 골목 기둥 막힘 ${blockedCols}${blockedAt.length ? ` (${blockedAt.join(' ')})` : ''} · 소품 때문에 생긴 막다른 칸 ${propDead}${propDeadAt.length ? ` (${propDeadAt.join(' ')})` : ''}`);
if (blockedCols || propDead) process.exitCode = 1;

// ── 글자 겹침 검사 (24장 A-3) ──
// 1) 글자-사람 자리: 역 출구 표지(출구 칸과 그 위 칸)·도로명 표지판 둘레 2칸 안에 사람이 서는 자리(입구·바깥 자리)가 있으면 이름표와 겹친다
// 2) 간판끼리 간격: 같은 줄 높이의 간판 판이 2px 보다 가까우면 붙어 보인다 (signs.js 와 같은 자리 계산)
const { PLACES } = await import('../src/data/places.js');
const { SHOPS } = await import('../src/data/shops.js');
const standTiles = [];
for (const [place, p] of Object.entries(places)) {
  if (p.spots) for (const [name, s] of Object.entries(p.spots)) standTiles.push({ who: `${place}:${name}`, t: s });
}
const textBoxes = [];
for (const e of STATION_EXITS) textBoxes.push({ what: e.label, x0: e.x - 1, x1: e.x + 1, y0: e.y - 1, y1: e.y + 1 });
for (const r of ROAD_SIGNS) textBoxes.push({ what: r.plates.join('/'), x0: r.x - 1, x1: r.x + 1, y0: r.y - 2, y1: r.y });
let textHits = 0; const textHitAt = [];
for (const b of textBoxes) for (const s of standTiles) {
  if (s.t[0] >= b.x0 - 1 && s.t[0] <= b.x1 + 1 && s.t[1] >= b.y0 && s.t[1] <= b.y1 + 1) { textHits++; textHitAt.push(`${b.what}~${s.who}`); }
}
const { signSpots, SIGN_W } = await import('../src/map/signspots.js');
const boards = [];
for (const b of buildingsOut) {
  for (const sp of signSpots(b)) boards.push({ who: b.place ?? b.shop ?? b.i, x0: sp.cx - SIGN_W(sp.text) / 2, x1: sp.cx + SIGN_W(sp.text) / 2, top: sp.top });
}
let signHits = 0; const signHitAt = [];
for (let i = 0; i < boards.length; i++) for (let j = i + 1; j < boards.length; j++) {
  const a = boards[i]; const c = boards[j];
  if (Math.abs(a.top - c.top) >= 11) continue;
  const gap = Math.max(a.x0, c.x0) - Math.min(a.x1, c.x1);
  if (gap < 2) { signHits++; signHitAt.push(`${a.who}|${c.who}`); }
}
console.log(`글자 겹침 검사: 글자-사람 자리 ${textHits}${textHitAt.length ? ` (${textHitAt.join(' ')})` : ''} · 간판끼리 붙음 ${signHits}${signHitAt.length ? ` (${signHitAt.join(' ')})` : ''}`);
if (textHits || signHits) process.exitCode = 1;

const cost = kind.map((row, y) => row.map((k, x) => (blocked[y][x] ? 0 : COST[k] ?? 1)).join('')).join('\n');

const layer = (id, name, data) => ({
  id, name, type: 'tilelayer', width: data[0].length, height: data.length, x: 0, y: 0, opacity: 1, visible: true,
  data: data.flat().map((t) => (t < 0 ? 0 : t + 1)),
});
const tiledMap = (w, h, layers, tileset, properties) => ({
  type: 'map', version: '1.10', tiledversion: '1.10.2', orientation: 'orthogonal', renderorder: 'right-down',
  width: w, height: h, tilewidth: 16, tileheight: 16, infinite: false, nextlayerid: layers.length + 1, nextobjectid: oid,
  layers, tilesets: [tileset], properties,
});
const URBAN = { firstgid: 1, name: 'town', image: '../../public/assets/lz/town.png', imagewidth: LZ_TOWN.meta.size.w, imageheight: LZ_TOWN.meta.size.h, columns: LZ_TOWN.columns,
  tilecount: LZ_TOWN.columns * (LZ_TOWN.meta.size.h / 16), tilewidth: 16, tileheight: 16, margin: 0, spacing: 0 };
// 실내: LimeZu Modern Interiors 아틀라스 (tools/build-assets.py → public/assets/lz/indoor.png · indoor.json 의 tiles)
const LZ_IN = JSON.parse(readFileSync(new URL('../public/assets/lz/indoor.json', import.meta.url)));
const INDOOR = { firstgid: 1, name: 'indoor', image: '../../public/assets/lz/indoor.png', imagewidth: LZ_IN.meta.size.w, imageheight: LZ_IN.meta.size.h, columns: LZ_IN.columns,
  tilecount: LZ_IN.columns * (LZ_IN.meta.size.h / 16), tilewidth: 16, tileheight: 16, margin: 0, spacing: 0 };

for (const s of shapeProps) objects.push({ id: oid++, name: s.kind, type: 'shape', x: s.x * 16, y: s.y * 16, width: 16, height: 16, properties: [{ name: 'sprite', type: 'string', value: s.sprite }] });
for (const [x, y] of poles) objects.push({ id: oid++, name: 'pole', type: 'pole', x: x * 16, y: y * 16, width: 16, height: 16 });
for (const p of lzProps) objects.push({ id: oid++, name: p.sprite, type: 'lz', x: p.x * 16, y: p.y * 16, width: 16, height: 16,
  properties: [{ name: 'sprite', type: 'string', value: p.sprite }, { name: 'wall', type: 'bool', value: !!p.wall }, { name: 'w', type: 'int', value: p.w ?? 1 }] });

const town = tiledMap(W, H, [
  layer(1, 'ground', ground), layer(2, 'detail', detail), layer(3, 'buildings', build), layer(4, 'deco', deco), layer(5, 'above', above),
  { id: 6, name: 'places', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects },
], URBAN, [
  { name: 'cost', type: 'string', value: cost },
  { name: 'places', type: 'string', value: JSON.stringify(places) },
  { name: 'buildings', type: 'string', value: JSON.stringify(buildingsOut) },
  { name: 'roadSigns', type: 'string', value: JSON.stringify(ROAD_SIGNS) },
  { name: 'areas', type: 'string', value: JSON.stringify(AREAS) },
  { name: 'cross', type: 'string', value: JSON.stringify(CROSSWALKS.flatMap((c) => { const out = []; for (let y = c.y; y < c.y + c.h; y++) for (let x = c.x; x < c.x + c.w; x++) out.push(y * W + x); return out; })) },
  { name: 'credit', type: 'string', value: MAP_CREDIT },
]);
writeFileSync(out(`${MAP_ID}.json`), JSON.stringify(town));

// ── 성소 실내 (공간 단계마다, 신림동을 뽑을 때만) ──
// 꾸밈 0 단계 타일로 뽑는다. SanctuaryScene 이 꾸밈 단계에 따라 바닥·벽 타일을 바꿔 끼운다
const I = { floor: LZ_IN.tiles.floor0, wallA: LZ_IN.tiles.wall0a, wallB: LZ_IN.tiles.wall0b, border: LZ_IN.tiles.border, stairs: LZ_IN.tiles.stairs };
for (const m of which === 'town' ? SPACE_MAPS : []) {
  const sg = grid(m.w, m.h, I.floor);
  const sw = grid(m.w, m.h, -1);
  const sb = grid(m.w, m.h, false);
  const isOpen = (x, y) => m.doors.some(([dx, dy]) => dx === x && dy === y) || m.stairs.some((s) => s.x === x && s.y === y);
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    const edge = y < 2 || x === 0 || x === m.w - 1 || y === m.h - 1;
    const inner = m.walls.some((w) => x === w.x && y >= w.y && y < w.y + w.h && !(w.gap && y >= w.gap[0] && y < w.gap[1]));
    if ((edge || inner) && !isOpen(x, y)) {
      // 위 두 줄은 벽면(위·아래), 양옆·아래·칸막이는 천장 테두리
      const face = y < 2 && !inner && x !== 0 && x !== m.w - 1;
      sw[y][x] = face ? (y === 0 ? I.wallA : I.wallB) : I.border; sb[y][x] = true;
    }
  }
  for (const s of m.stairs) sw[s.y][s.x] = I.stairs;
  for (const f of m.blocked ?? []) sb[f[1]][f[0]] = true;
  const scost = sb.map((row) => row.map((b) => (b ? 0 : 1)).join('')).join('\n');
  const map = tiledMap(m.w, m.h, [layer(1, 'ground', sg), layer(2, 'walls', sw)], INDOOR, [
    { name: 'cost', type: 'string', value: scost },
    { name: 'rooms', type: 'string', value: JSON.stringify(m.rooms) },
    { name: 'stairs', type: 'string', value: JSON.stringify(m.stairs) },
    { name: 'doors', type: 'string', value: JSON.stringify(m.doors) },
  ]);
  writeFileSync(out(`sanctuary-${m.id}.json`), JSON.stringify(map));
}

const walkN = cost.split('').filter((c) => c !== '0' && c !== '\n').length;
console.log(`${MAP_ID}.json ${W}x${H} · 건물 ${BUILDINGS.length} · 걸을 수 있는 칸 ${walkN} · 막다른 칸 ${deadEnds} · 전봇대 ${poles.length} · 도형 소품 ${shapeProps.length}`);
if (which === 'town') console.log(`실내 ${SPACE_MAPS.map((m) => `${m.id}(${m.w}x${m.h})`).join(' ')}`);
