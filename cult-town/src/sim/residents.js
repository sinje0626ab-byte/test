// 주민 일과 → 목표 칸 → 격자 이동. 화면(TownScene)과 노드 시뮬레이터가 같은 함수를 쓴다.
// 위치는 state.pos[id] = { x, y, path, prog, key, inside }. path[0] 이 다음 칸, prog(0~1)가 그 칸까지 간 정도.
import { CLOCK, MOVE, NEEDS, WEATHER } from '../config.js';
import { RESIDENTS, RESIDENT_BY_ID } from '../data/residents.js';
import { CLERGY } from '../data/clergy.js';
import { isWeekend, parseTime } from './clock.js';
import { findPath, resolveKey, walkable } from './grid.js';
import { rand } from './rng.js';

const WORSHIP_ARRIVE = 19 * 60 + 20;

// 성직자도 동네를 걷는다 (낮엔 자기 자리 앞, 저녁엔 안으로)
const CLERGY_SCHEDULE = (c) => [`8:30 ${c.day}`, `12:00 ${c.place}`, `13:00 ${c.day}`, `18:30 ${c.place}`];
export const PEOPLE = [
  ...RESIDENTS.map((r) => ({ id: r.id, home: r.home, kind: 'resident' })),
  ...CLERGY.map((c) => ({ id: `c:${c.id}`, home: c.place, kind: 'clergy', clergy: c.id })),
];
const PERSON = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

// 낮 포교 중인 간부도 동네를 걷는다 ('o:<간부 id>'). 9시부터 90분마다 다른 바깥 자리로
const STREET_SPOTS = ['station:plaza', 'market:entrance', 'cvs:front', 'park:plaza', 'stream:path', 'restaurant:front', 'station:exit4', 'market:walk', 'gosiwon:front', 'park:walk'];
// 간부가 첫 신도(엄마·친구·민호)면 'o:<id>' 로 새로 걷고, 주민 출신이면 그 주민이 일과 대신 포교를 다닌다
export function peopleOf(s) {
  const out = [...PEOPLE];
  for (const o of s.officers ?? []) if (!o.left && o.assign === 'street' && o.kind === 'cast') out.push({ id: `o:${o.id}`, home: 'sanctuary', kind: 'officer', oid: o.id });
  return out;
}
const onStreet = (s, id) => id.startsWith('o:') || (s.officers ?? []).some((o) => o.id === id && !o.left && o.assign === 'street');
function officerSchedule(s, id) {
  const k = `${s.day}:${id}`;
  if (!officerCache.has(k)) {
    let h = 0; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const list = [];
    for (let i = 0; i < 6; i++) list.push({ min: 9 * 60 + i * 90, key: STREET_SPOTS[(h + i * 3) % STREET_SPOTS.length] });
    list.push({ min: 18 * 60 + 30, key: 'sanctuary' });
    officerCache.set(k, list);
  }
  return officerCache.get(k);
}
const officerCache = new Map();
const personAny = (id) => PERSON[id] ?? { id, home: 'sanctuary', kind: 'officer' };
const CLERGY_BY_ID = Object.fromEntries(CLERGY.map((c) => [c.id, c]));

const parsed = new Map();
function parseList(list) {
  if (!parsed.has(list)) parsed.set(list, list.map((e) => { const [t, key] = e.split(' '); return { min: parseTime(t), key }; }));
  return parsed.get(list);
}

// 오늘 일과 (예배 날 참석자는 저녁에 성소로 간다). 시각은 '도착' 시각이다.
export function scheduleOf(s, id) {
  const p = personAny(id);
  if (onStreet(s, id)) return officerSchedule(s, id);
  if (p.kind === 'clergy') return parseList(CLERGY_SCHEDULE(CLERGY_BY_ID[p.clergy]));
  const r = RESIDENT_BY_ID[id];
  let list = parseList(isWeekend(s.day) ? r.weekend : r.weekday);
  if (s.weather?.rain) list = weatherList(list, 'rain', r.home);
  else if (s.weather?.market) list = weatherList(list, 'market', r.home);
  if (s.attend.includes(id)) {
    const offset = (id.charCodeAt(0) + id.length * 7) % 25;
    const arrive = WORSHIP_ARRIVE - 25 + offset;
    list = [...list.filter((e) => e.min < arrive - 30), { min: arrive, key: 'sanctuary' }];
  }
  return list;
}

// 비: 공원·산책로 일과는 집에서 보낸다 / 장날: 공원 대신 시장 구경
const weatherCache = new Map();
function weatherList(list, kind, home) {
  const k = kind + JSON.stringify(list);
  if (!weatherCache.has(k)) {
    weatherCache.set(k, list.map((e) => {
      const place = e.key.split(':')[0];
      if (kind === 'rain' && WEATHER.rainSkip.includes(place)) return { min: e.min, key: home };
      if (kind === 'market' && place === 'park') return { min: e.min, key: 'market:walk' };
      return e;
    }));
  }
  return weatherCache.get(k);
}

// 출발 시각표: 도착 시각에 맞춰 걸리는 시간만큼 먼저 나선다 (길 길이 / 걷는 속도 + 3분)
const legCache = new Map();
function travelMinutes(g, fromKey, toKey) {
  const k = fromKey + '>' + toKey;
  if (!legCache.has(k)) {
    const path = findPath(g, resolveKey(g, fromKey).tile, resolveKey(g, toKey).tile);
    legCache.set(k, path ? path.length / MOVE.residentTilesPerMinute + 3 : 0);
  }
  return legCache.get(k);
}
export function departures(s, g, id) {
  const p = personAny(id);
  let prev = p.home;
  const out = [];
  for (const e of scheduleOf(s, id)) {
    out.push({ dep: e.min - travelMinutes(g, prev, e.key), arrive: e.min, key: e.key });
    prev = e.key;
  }
  out.push({ dep: CLOCK.dayEnd - travelMinutes(g, prev, p.home), arrive: CLOCK.dayEnd, key: s.attend.includes(id) ? 'sanctuary' : p.home });
  return out;
}

export function targetKey(s, g, id, minute = s.minute) {
  let key = personAny(id).home;
  for (const e of departures(s, g, id)) if (e.dep <= minute) key = e.key;
  return key;
}

// 바깥 자리는 사람마다 조금씩 비켜 선다 (한 칸에 몰리지 않게)
const NUDGE = [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1], [0, -1], [2, 0]];
function hashId(id) { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); }
export function spotFor(g, key, id) {
  const r = resolveKey(g, key);
  if (r.inside || !key.includes(':')) return r;
  const start = hashId(id) % NUDGE.length;
  for (let i = 0; i < NUDGE.length; i++) {
    const [dx, dy] = NUDGE[(start + i) % NUDGE.length];
    const x = r.tile[0] + dx; const y = r.tile[1] + dy;
    if (walkable(g, x, y) && g.cost[y * g.w + x] < 6) return { tile: [x, y], inside: false };
  }
  return r;
}

// 아침: 모두 집 안에서 시작
export function placeAllAtHome(s, g) {
  for (const id of Object.keys(s.pos)) if (id.startsWith('o:')) delete s.pos[id];
  for (const p of peopleOf(s)) {
    const { tile } = resolveKey(g, p.home);
    s.pos[p.id] = { x: tile[0], y: tile[1], path: [], prog: 0, key: p.home, inside: true };
  }
}

// 불러오기 직후 등: 지금 시각의 목표 자리에 바로 둔다
export function snapAll(s, g) {
  for (const p of peopleOf(s)) {
    const key = targetKey(s, g, p.id);
    const { tile, inside } = spotFor(g, key, p.id);
    s.pos[p.id] = { x: tile[0], y: tile[1], path: [], prog: 0, key, inside };
  }
}

// dtMin 게임 분만큼 움직인다
export function tickPeople(s, g, dtMin) {
  for (const p of peopleOf(s)) {
    if (!s.pos[p.id]) { const { tile } = resolveKey(g, p.home); s.pos[p.id] = { x: tile[0], y: tile[1], path: [], prog: 0, key: p.home, inside: true }; }
    const pos = s.pos[p.id];
    const key = targetKey(s, g, p.id);
    if (key !== pos.key) {
      const { tile } = spotFor(g, key, p.id);
      pos.key = key;
      pos.path = findPath(g, [pos.x, pos.y], tile) ?? [];
      pos.inside = false;
      pos.prog = 0;
    }
    if (pos.path.length) {
      pos.prog += dtMin * MOVE.residentTilesPerMinute;
      while (pos.prog >= 1 && pos.path.length) {
        const [nx, ny] = pos.path.shift();
        pos.dir = nx > pos.x ? 'right' : nx < pos.x ? 'left' : ny > pos.y ? 'down' : 'up';
        pos.x = nx; pos.y = ny; pos.prog -= 1;
      }
      if (!pos.path.length) pos.prog = 0;
    }
    if (!pos.path.length) pos.inside = resolveKey(g, pos.key).inside;
  }
}

export const personOf = (id) => personAny(id);

// 하루 시작: 지금 고민 정하기, 욕구 흔들기
export function morningNeeds(s) {
  for (const r of RESIDENTS) {
    const st = s.res[r.id];
    for (const k of NEEDS.keys) {
      const drift = (rand(s) * 2 - 1) * NEEDS.dailyDrift;
      const pull = (r.needs[k] - st.needs[k]) * 0.15;      // 원래 성격 쪽으로 조금 돌아간다
      st.needs[k] = Math.max(0, Math.min(100, st.needs[k] + drift + pull));
    }
    if (st.stage === 'member') st.needs.lonely = Math.max(0, st.needs.lonely - 3);
    st.hint = null;
  }
}

export function topNeeds(st) {
  return NEEDS.keys.slice().sort((a, b) => st.needs[b] - st.needs[a]);
}
