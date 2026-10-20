// layout.js → Tiled JSON (src/map/town.json, src/map/sanctuary.json)
// 타일 번호는 RPG Urban tilemap_packed.png (27열, 간격 0) / Roguelike Indoors (27열, 간격 1) 의 0부터 센 번호.
// Tiled gid = 번호 + 1 (firstgid 1). 길찾기용 비용은 map.properties 의 'cost' (행마다 숫자 문자열).
import { writeFileSync } from 'node:fs';
import { W, H, GROUND, CROSSWALKS, BUILDINGS, PROPS, SPOTS, STATION_EXITS, SANCTUARY } from '../src/map/layout.js';

const out = (name) => new URL(`../src/map/${name}`, import.meta.url);

// ── RPG Urban 타일 표 ──
const U = {
  lot: 36, sidewalk: 36, plaza: 117, alley: 460, road: 460, market: 109, grass: 28,
  water: 198, waterTop: 171, waterBottom: 225,
  laneH: 433, laneV: 462, crossV: 432, crossH: 435,
};
// 9칸 묶음: 왼위 번호 → [[왼위, 위, 오위], [왼, 가운데, 오], [왼아래, 아래, 오아래]]
const nine = (t) => [[t, t + 1, t + 2], [t + 27, t + 28, t + 29], [t + 54, t + 55, t + 56]];
const ROOF = { beige: nine(81), gray: nine(89), red: nine(81), orange: nine(89) };
// 정면 벽: 맨 윗줄 · 가운데 줄 · 맨 아랫줄 (각 [왼, 가운데, 오])
const WALL = {
  red: { top: [17, 18, 19], mid: [71, 72, 73], bottom: [98, 99, 100] },
  orange: { top: [125, 126, 127], mid: [179, 180, 181], bottom: [206, 207, 208] },
  gray: { top: [8, 9, 10], mid: [35, 36, 37], bottom: [62, 63, 64] },
};
const WINDOW = [335, 362, 336];
const DOOR = { default: 283, church: 284, temple: 284, sanctuary: 312, gosiwon: 255, office: 339, shop: 285 };
const AWNING = [328, 329, 332];
const STOREFRONT = [386, 387, 388];
// 소품: base(맨 아래 칸, 막힘) · top(위 칸, 사람보다 위에 그림) · walk(지나갈 수 있음)
const PROP = {
  tree: { base: 259, top: 232 },
  lamp: { base: 191, top: 164 },
  vending: { base: 281 },
  bench: { base: 381 },
  trash: { base: 279 },
  mailbox: { base: 306 },
  bike: { base: 469, walk: true },
  stall: { base: 276 },
  stall2: { base: 303 },
};
// 길찾기 비용 (0 = 못 감)
const COST = { water: 0, lot: 2, grass: 2, sidewalk: 1, road: 6, alley: 1, plaza: 1, market: 1, cross: 1, block: 0 };

const grid = (w, h, v) => Array.from({ length: h }, () => Array(w).fill(v));
const ground = grid(W, H, U.lot);
const detail = grid(W, H, -1);
const build = grid(W, H, -1);
const deco = grid(W, H, -1);
const above = grid(W, H, -1);
const kind = grid(W, H, 'lot');
const blocked = grid(W, H, false);
const inMap = (x, y) => x >= 0 && y >= 0 && x < W && y < H;

// 바닥
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
  for (let y = c.y; y < c.y + c.h; y++) for (let x = c.x; x < c.x + c.w; x++) {
    kind[y][x] = 'cross';
    detail[y][x] = c.dir === 'v' ? U.crossV : U.crossH;
  }
}

// 건물
const objects = [];
let oid = 1;
const places = {};
for (const b of BUILDINGS) {
  const facade = b.floors ?? (b.h >= 9 ? 3 : 2);
  const roofH = b.h - facade;
  const R = ROOF[b.roof] ?? ROOF.beige;
  const Wl = WALL[b.wall] ?? WALL.red;
  const doorX = b.door ?? b.x + Math.floor(b.w / 2);
  const col = (x, arr) => (x === b.x ? arr[0] : x === b.x + b.w - 1 ? arr[2] : arr[1]);
  for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) {
    blocked[y][x] = true;
    kind[y][x] = 'block';
    const ry = y - b.y;
    if (ry < roofH) {
      const row = ry === 0 ? R[0] : ry === roofH - 1 ? R[2] : R[1];
      build[y][x] = col(x, row);
    } else {
      const fy = ry - roofH;
      const row = fy === 0 ? Wl.top : fy === facade - 1 ? Wl.bottom : Wl.mid;
      build[y][x] = col(x, row);
      const last = fy === facade - 1;
      if (b.shopfront && last) deco[y][x] = col(x, STOREFRONT);
      else if (b.shopfront && fy === facade - 2) deco[y][x] = col(x, AWNING);
      else if (!last && (x - b.x) % 2 === 1 && x < b.x + b.w - 1) deco[y][x] = WINDOW[fy % 3];
      else if (last && (x - b.x) % 3 === 1 && Math.abs(x - doorX) > 1 && x < b.x + b.w - 1) deco[y][x] = 362;
    }
  }
  const doorY = b.y + b.h - 1;
  deco[doorY][doorX] = b.shopfront ? DOOR.shop : DOOR[b.place] ?? DOOR.default;
  const entrance = [doorX, doorY + 1];
  places[b.place] = { door: entrance };
  objects.push({ id: oid++, name: b.place, type: 'door', x: entrance[0] * 16, y: entrance[1] * 16, width: 16, height: 16,
    properties: [{ name: 'enter', type: 'string', value: b.enter ?? '' }] });
  objects.push({ id: oid++, name: b.place, type: 'sign', x: doorX * 16, y: (b.y + roofH) * 16, width: 16, height: 16,
    properties: [{ name: 'sprite', type: 'string', value: `sign.${b.place}` }] });
}
// 집이 시장 안인 사람: 시장 입구를 문으로 쓴다
places.market_house = { door: SPOTS.market.entrance };
places.market = { door: SPOTS.market.entrance };

// 소품
for (const p of PROPS) {
  const t = PROP[p.kind];
  if (!t || !inMap(p.x, p.y)) continue;
  deco[p.y][p.x] = t.base;
  if (t.top != null && inMap(p.x, p.y - 1)) above[p.y - 1][p.x] = t.top;
  if (!t.walk) blocked[p.y][p.x] = true;
}
for (const e of STATION_EXITS) {
  blocked[e.y][e.x] = true;
  objects.push({ id: oid++, name: 'station', type: 'exit', x: e.x * 16, y: e.y * 16, width: 16, height: 16,
    properties: [{ name: 'sprite', type: 'string', value: e.sprite }, { name: 'label', type: 'string', value: e.label }] });
}
places.station = { door: SPOTS.station.plaza };
places.stream = { door: SPOTS.stream.path };
places.park = { door: SPOTS.park.plaza };

// 바깥 자리
for (const [place, spots] of Object.entries(SPOTS)) {
  for (const [name, [x, y]] of Object.entries(spots)) {
    if (blocked[y][x]) throw new Error(`자리 ${place}:${name} (${x},${y}) 가 막힌 칸이다`);
    places[place] = places[place] ?? {};
    places[place].spots = { ...(places[place].spots ?? {}), [name]: [x, y] };
    objects.push({ id: oid++, name: `${place}:${name}`, type: 'spot', x: x * 16, y: y * 16, width: 16, height: 16 });
  }
}
for (const [place, p] of Object.entries(places)) {
  if (p.door && blocked[p.door[1]][p.door[0]]) throw new Error(`입구 ${place} (${p.door}) 가 막힌 칸이다`);
}

const cost = kind.map((row, y) => row.map((k, x) => (blocked[y][x] ? 0 : COST[k] ?? 1)).join('')).join('\n');

const layer = (id, name, data, extra = {}) => ({
  id, name, type: 'tilelayer', width: data[0].length, height: data.length, x: 0, y: 0, opacity: 1, visible: true,
  data: data.flat().map((t) => (t < 0 ? 0 : t + 1)), ...extra,
});
const tiledMap = (w, h, layers, tileset, properties) => ({
  type: 'map', version: '1.10', tiledversion: '1.10.2', orientation: 'orthogonal', renderorder: 'right-down',
  width: w, height: h, tilewidth: 16, tileheight: 16, infinite: false, nextlayerid: layers.length + 1, nextobjectid: oid,
  layers, tilesets: [tileset], properties,
});

const town = tiledMap(W, H, [
  layer(1, 'ground', ground),
  layer(2, 'detail', detail),
  layer(3, 'buildings', build),
  layer(4, 'deco', deco),
  layer(5, 'above', above),
  { id: 6, name: 'places', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects },
], {
  firstgid: 1, name: 'urban', image: '../../public/assets/tiles/urban.png', imagewidth: 432, imageheight: 288,
  columns: 27, tilecount: 486, tilewidth: 16, tileheight: 16, margin: 0, spacing: 0,
}, [
  { name: 'cost', type: 'string', value: cost },
  { name: 'places', type: 'string', value: JSON.stringify(places) },
  { name: 'credit', type: 'string', value: 'Tiles: Kenney RPG Urban Pack (CC0). 신림동 구조를 손으로 단순화한 배치.' },
]);
writeFileSync(out('town.json'), JSON.stringify(town));

// ── 성소 실내 ── Roguelike Indoors
const S = SANCTUARY;
const I = { floor: 105, wall: 294, wallTop: 293, rug: 132 };
const sg = grid(S.w, S.h, I.floor);
const sw = grid(S.w, S.h, -1);
const sblocked = grid(S.w, S.h, false);
for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
  const edge = y < 2 || x === 0 || x === S.w - 1 || y === S.h - 1;
  if (edge && !(x === S.door[0] && y === S.door[1])) { sw[y][x] = y === 0 ? I.wallTop : I.wall; sblocked[y][x] = true; }
}
for (let y = S.seatArea.y; y < S.seatArea.y + S.seatArea.h; y++) for (let x = S.seatArea.x; x < S.seatArea.x + S.seatArea.w; x++) sg[y][x] = I.rug;
const sobj = [
  { id: 1, name: 'door', type: 'door', x: S.door[0] * 16, y: S.door[1] * 16, width: 16, height: 16 },
  { id: 2, name: 'pulpit', type: 'furniture', x: S.pulpit[0] * 16, y: S.pulpit[1] * 16, width: 16, height: 16 },
  { id: 3, name: 'desk', type: 'furniture', x: S.desk[0] * 16, y: S.desk[1] * 16, width: 16, height: 16 },
  { id: 4, name: 'counsel', type: 'furniture', x: S.counsel[0] * 16, y: S.counsel[1] * 16, width: 16, height: 16 },
];
for (const k of ['pulpit', 'desk', 'counsel']) sblocked[S[k][1]][S[k][0]] = true;
const scost = sblocked.map((row) => row.map((b) => (b ? 0 : 1)).join('')).join('\n');
const sanct = tiledMap(S.w, S.h, [
  layer(1, 'ground', sg),
  layer(2, 'walls', sw),
  { id: 3, name: 'places', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects: sobj },
], {
  firstgid: 1, name: 'indoor', image: '../../public/assets/tiles/indoor.png', imagewidth: 458, imageheight: 305,
  columns: 27, tilecount: 486, tilewidth: 16, tileheight: 16, margin: 0, spacing: 1,
}, [{ name: 'cost', type: 'string', value: scost }]);
writeFileSync(out('sanctuary.json'), JSON.stringify(sanct));

const walk = cost.split('').filter((c) => c !== '0' && c !== '\n').length;
console.log(`town.json ${W}x${H} · 걸을 수 있는 칸 ${walk} · 문 ${BUILDINGS.length} · 자리 ${Object.values(SPOTS).reduce((n, s) => n + Object.keys(s).length, 0)}`);
console.log(`sanctuary.json ${S.w}x${S.h}`);
