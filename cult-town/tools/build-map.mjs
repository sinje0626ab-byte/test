// layout.js → Tiled JSON (src/map/town.json, src/map/sanctuary-*.json)
// 타일 번호는 RPG Urban tilemap_packed.png (27열, 간격 0) / Roguelike Indoors (27열, 간격 1) 의 0부터 센 번호.
// Tiled gid = 번호 + 1. 길찾기 비용은 map.properties 'cost' (행마다 숫자, 0 = 못 감).
// 골목 소품(전봇대·주차 차량·분리수거함·화분·자전거)은 시드 고정 난수로 골목마다 흩뿌린다.
import { writeFileSync } from 'node:fs';
import { SPACE_MAPS } from '../src/map/interiors.js';

// 어느 동네를 뽑나: 인자 없으면 신림동(layout.js) + 성소 실내, 'bongcheon' 이면 layout-bongcheon.js
const which = process.argv[2] ?? 'town';
const L = await import(which === 'town' ? '../src/map/layout.js' : `../src/map/layout-${which}.js`);
const { W, H, GROUND, CROSSWALKS, BUILDINGS, PROPS, SPOTS, STATION_EXITS, LABELS, DEAD_ENDS, ROWS, ROW_H, WALK_V, EXTRA_PLACES, START, MAP_ID, MAP_CREDIT } = L;

const out = (name) => new URL(`../src/map/${name}`, import.meta.url);

// ── RPG Urban 타일 ──
const U = {
  lot: 36, sidewalk: 36, plaza: 117, alley: 460, road: 460, market: 109, grass: 28, path: 36,
  water: 198, waterBottom: 225, laneH: 433, laneV: 462, crossV: 432, crossH: 435,
};
const nine = (t) => [[t, t + 1, t + 2], [t + 27, t + 28, t + 29], [t + 54, t + 55, t + 56]];
const ROOF = [nine(81), nine(89)];
const WALL = {
  red: { top: [17, 18, 19], mid: [71, 72, 73], bottom: [98, 99, 100] },
  red2: { top: [20, 21, 22], mid: [74, 75, 76], bottom: [101, 102, 103] },
  orange: { top: [125, 126, 127], mid: [179, 180, 181], bottom: [206, 207, 208] },
  orange2: { top: [128, 129, 130], mid: [182, 183, 184], bottom: [209, 210, 211] },
};
const WALLS = Object.keys(WALL);
const WINDOW = [335, 362, 336];
const DOOR = { villa: 283, house: 282, shop: 285, mall: 339, church: 284, temple: 284, sanctuary: 312, gosiwon: 255 };
const AWNING = [328, 329, 332];
const STOREFRONT = [386, 387, 388];
const PROP = {
  tree: { base: 259, top: 232 }, lamp: { base: 191, top: 164 }, vending: { base: 281 }, bench: { base: 381 },
  trash: { base: 279 }, mailbox: { base: 306 }, stall: { base: 276 }, stall2: { base: 303 }, fence: { base: 383 },
  pole: { base: 216, top: 189, top2: 162 }, car: { base: [422, 425, 476, 479] }, plant: { base: 292 }, bags: { base: 254 },
  bin: { base: 253 },
};
// 도형으로 그리는 소품 (TownScene 이 스프라이트 키로 그린다)
const SHAPE_PROPS = { recycle: 'prop.recycle', bike: 'prop.bike' };
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
  const floors = b.floors ?? (b.kind === 'villa' ? Math.min(3, b.h - 2) : b.kind === 'house' ? 2 : 2);
  const roofH = Math.max(1, b.h - floors);
  const facade = b.h - roofH;
  const R = ROOF[hash(i) % 2];
  const base = b.place?.replace(/^b_/, '');   // 봉천동 장소는 b_ 를 떼고 같은 모양
  const wallName = b.wall ?? (base === 'church' ? 'red' : base === 'temple' ? 'orange' : WALLS[hash(i + 7) % WALLS.length]);
  const Wl = WALL[wallName];
  const doorX = b.door ?? b.x + Math.floor(b.w / 2);
  const col = (x, arr) => (x === b.x ? arr[0] : x === b.x + b.w - 1 ? arr[2] : arr[1]);
  const isShop = b.kind === 'mixed' || b.shopfront || (b.kind === 'mall' && b.signs?.at(-1));
  for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) {
    blocked[y][x] = true; kind[y][x] = 'block';
    const ry = y - b.y;
    if (ry < roofH) {
      const r = roofH === 1 ? R[1] : ry === 0 ? R[0] : ry === roofH - 1 ? R[2] : R[1];
      build[y][x] = col(x, r);
    } else {
      const fy = ry - roofH;
      const r = fy === 0 ? Wl.top : fy === facade - 1 ? Wl.bottom : Wl.mid;
      build[y][x] = col(x, r);
      const last = fy === facade - 1;
      if (last && isShop) deco[y][x] = col(x, STOREFRONT);
      else if (!last && isShop && fy === facade - 2) deco[y][x] = col(x, AWNING);
      else if ((x - b.x) % 2 === 1 && x < b.x + b.w - 1 && Math.abs(x - doorX) > 0) deco[y][x] = WINDOW[fy % 3];
    }
  }
  const doorY = b.y + b.h - 1;
  deco[doorY][doorX] = isShop && b.kind !== 'mall' ? DOOR.shop : DOOR[base] ?? DOOR[b.kind] ?? DOOR.villa;
  const entrance = [doorX, doorY + 1];
  reserved[entrance[1]][entrance[0]] = true;
  if (b.place) {
    places[b.place] = { door: entrance };
    objects.push({ id: oid++, name: b.place, type: 'door', x: entrance[0] * 16, y: entrance[1] * 16, width: 16, height: 16,
      properties: [{ name: 'enter', type: 'string', value: b.place === 'sanctuary' || b.place === 'b_branch' ? b.place : '' }] });
  }
  buildingsOut.push({ i, x: b.x, y: b.y, w: b.w, h: b.h, roofH, floors: facade, kind: b.kind, place: b.place ?? null, shop: b.shop ?? null, signs: b.signs ?? null, door: doorX, isShop: !!isShop });
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
// 바닥 글자 자리
for (const l of LABELS) {
  const tiles = l.tiles ?? [[Math.floor(l.x) - 1, Math.floor(l.y)], [Math.floor(l.x), Math.floor(l.y)], [Math.floor(l.x) + 1, Math.floor(l.y)]];
  for (const [x, y] of tiles) { reserved[y][x] = true; exact[y][x] = true; }
  l.tiles = tiles;
}

// ── 손으로 놓은 소품 ──
const shapeProps = [];
const poles = [];
const propTiles = new Set();      // 골목에 흩뿌린 소품 칸 (통로 검사용)
const placeProp = (k, x, y, onBlocked = false) => {
  const t = PROP[k];
  if (SHAPE_PROPS[k]) { shapeProps.push({ kind: k, sprite: SHAPE_PROPS[k], x, y }); blocked[y][x] = true; return; }
  if (onBlocked) above[y][x] = t.base; else deco[y][x] = Array.isArray(t.base) ? t.base[Math.floor(rnd() * t.base.length)] : t.base;
  if (t.top != null && inMap(x, y - 1)) above[y - 1][x] = t.top;
  if (t.top2 != null && inMap(x, y - 2)) above[y - 2][x] = t.top2;
  blocked[y][x] = true;
  if (k === 'pole') poles.push([x, y]);
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
  if (x !== b.door) shapeProps.push({ kind: 'ac', sprite: 'prop.ac', x, y, onWall: true });
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
// 1) 글자-사람 자리: 역 출구 표지(출구 칸과 그 위 칸)·바닥 글자 둘레 2칸 안에 사람이 서는 자리(입구·바깥 자리)가 있으면 이름표와 겹친다
// 2) 간판끼리 간격: 같은 줄 높이의 간판 판이 2px 보다 가까우면 붙어 보인다 (signs.js 와 같은 자리 계산)
const { PLACES } = await import('../src/data/places.js');
const { SHOPS } = await import('../src/data/shops.js');
const standTiles = [];
for (const [place, p] of Object.entries(places)) {
  if (p.spots) for (const [name, s] of Object.entries(p.spots)) standTiles.push({ who: `${place}:${name}`, t: s });
}
const textBoxes = [];
for (const e of STATION_EXITS) textBoxes.push({ what: e.label, x0: e.x - 1, x1: e.x + 1, y0: e.y - 1, y1: e.y + 1 });
let textHits = 0; const textHitAt = [];
for (const b of textBoxes) for (const s of standTiles) {
  if (s.t[0] >= b.x0 - 1 && s.t[0] <= b.x1 + 1 && s.t[1] >= b.y0 && s.t[1] <= b.y1 + 1) { textHits++; textHitAt.push(`${b.what}~${s.who}`); }
}
const SIGN_W = (text) => text.length * 7 + 6;    // Galmuri7 8px: 글자 하나 ≈ 7px + 여백
const boards = [];
for (const b of buildingsOut) {
  const facadeTop = b.y + b.roofH; const bottom = b.y + b.h - 1; const cx = (b.x + b.w / 2) * 16;
  const add = (x, top, text) => boards.push({ who: b.place ?? b.shop ?? b.i, x0: x - SIGN_W(text) / 2, x1: x + SIGN_W(text) / 2, top });
  if (b.kind === 'mall' && b.signs) {
    b.signs.forEach((id, k) => { if (id && SHOPS[id]) add((b.x + 1.6) * 16, (facadeTop + k) * 16 + 1, SHOPS[id].sign); });
    if (b.place && PLACES[b.place]) add(cx, (facadeTop - 1) * 16 + 2, b.place === 'sanctuary' ? '동림상가' : PLACES[b.place].name);
  } else if (b.shop && SHOPS[b.shop]) add(cx, (b.floors >= 2 ? bottom - 1 : bottom) * 16 + 1, SHOPS[b.shop].sign);
  else if (b.place && PLACES[b.place]) {
    const label = PLACES[b.place].name.replace(' 신림역점', '');
    if (PLACES[b.place].type === 'home') add((b.door + 0.5) * 16, (bottom - 1) * 16 + 2, label);
    else add(cx, (b.floors >= 2 ? bottom - 1 : bottom) * 16 + 1, label);
  }
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
const URBAN = { firstgid: 1, name: 'urban', image: '../../public/assets/tiles/urban.png', imagewidth: 432, imageheight: 288, columns: 27, tilecount: 486, tilewidth: 16, tileheight: 16, margin: 0, spacing: 0 };
const INDOOR = { firstgid: 1, name: 'indoor', image: '../../public/assets/tiles/indoor.png', imagewidth: 458, imageheight: 305, columns: 27, tilecount: 486, tilewidth: 16, tileheight: 16, margin: 0, spacing: 1 };

for (const s of shapeProps) objects.push({ id: oid++, name: s.kind, type: 'shape', x: s.x * 16, y: s.y * 16, width: 16, height: 16, properties: [{ name: 'sprite', type: 'string', value: s.sprite }] });
for (const [x, y] of poles) objects.push({ id: oid++, name: 'pole', type: 'pole', x: x * 16, y: y * 16, width: 16, height: 16 });

const town = tiledMap(W, H, [
  layer(1, 'ground', ground), layer(2, 'detail', detail), layer(3, 'buildings', build), layer(4, 'deco', deco), layer(5, 'above', above),
  { id: 6, name: 'places', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects },
], URBAN, [
  { name: 'cost', type: 'string', value: cost },
  { name: 'places', type: 'string', value: JSON.stringify(places) },
  { name: 'buildings', type: 'string', value: JSON.stringify(buildingsOut) },
  { name: 'labels', type: 'string', value: JSON.stringify(LABELS) },
  { name: 'cross', type: 'string', value: JSON.stringify(CROSSWALKS.flatMap((c) => { const out = []; for (let y = c.y; y < c.y + c.h; y++) for (let x = c.x; x < c.x + c.w; x++) out.push(y * W + x); return out; })) },
  { name: 'credit', type: 'string', value: MAP_CREDIT },
]);
writeFileSync(out(`${MAP_ID}.json`), JSON.stringify(town));

// ── 성소 실내 (공간 단계마다, 신림동을 뽑을 때만) ──
const I = { floor: 105, wall: 294, wallTop: 293, rug: 132, stairs: 237 };
for (const m of which === 'town' ? SPACE_MAPS : []) {
  const sg = grid(m.w, m.h, I.floor);
  const sw = grid(m.w, m.h, -1);
  const sb = grid(m.w, m.h, false);
  const isOpen = (x, y) => m.doors.some(([dx, dy]) => dx === x && dy === y) || m.stairs.some((s) => s.x === x && s.y === y);
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    const edge = y < 2 || x === 0 || x === m.w - 1 || y === m.h - 1;
    const inner = m.walls.some((w) => x === w.x && y >= w.y && y < w.y + w.h && !(w.gap && y >= w.gap[0] && y < w.gap[1]));
    if ((edge || inner) && !isOpen(x, y)) { sw[y][x] = y === 0 ? I.wallTop : I.wall; sb[y][x] = true; }
  }
  for (const r of m.rooms) for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (!sb[y][x] && r.rug) sg[y][x] = I.rug;
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
