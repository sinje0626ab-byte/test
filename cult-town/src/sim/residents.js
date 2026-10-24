// 주민 일과 → 목표 칸 → 격자 이동. 화면(TownScene)과 노드 시뮬레이터가 같은 함수를 쓴다.
// 위치는 state.pos[id] = { x, y, path, prog, key, inside }. path[0] 이 다음 칸, prog(0~1)가 그 칸까지 간 정도.
import { bigDayOf, bigDayCrowd } from './bigdays.js';
import { CLOCK, MOVE, NEEDS, WEATHER } from '../config.js';
import { RESIDENTS, RESIDENTS_B, RESIDENTS_Z, ALL_RESIDENTS, RESIDENT_BY_ID, districtOf } from '../data/residents.js';
import { CLERGY, CLERGY_B } from '../data/clergy.js';
import { isWeekend, parseTime } from './clock.js';
import { findPath, resolveKey, walkable, gridOf } from './grid.js';
import { rand } from './rng.js';
import { walkWait, crossingAxis, MAX_WALK_WAIT } from './traffic.js';

const WORSHIP_ARRIVE = 19 * 60 + 20;

// 성직자도 동네를 걷는다 (낮엔 자기 자리 앞, 저녁엔 안으로)
const CLERGY_SCHEDULE = (c) => [`8:30 ${c.day}`, `12:00 ${c.place}`, `13:00 ${c.day}`, `18:30 ${c.place}`];
export const PEOPLE = [
  ...RESIDENTS.map((r) => ({ id: r.id, home: r.home, kind: 'resident' })),
  ...CLERGY.map((c) => ({ id: `c:${c.id}`, home: c.place, kind: 'clergy', clergy: c.id })),
];
// 4단계: 봉천동 주민·성직자 (자기 동네 격자에서 걷는다)
export const PEOPLE_B = [
  ...RESIDENTS_B.map((r) => ({ id: r.id, home: r.home, kind: 'resident', district: 'bongcheon' })),
  ...CLERGY_B.map((c) => ({ id: `c:${c.id}`, home: c.place, kind: 'clergy', clergy: c.id, district: 'bongcheon' })),
];
// 30장: 새 구역 주민 (구역이 열려 s.res 에 생기면 신림동 격자에서 걷는다)
export const PEOPLE_Z = RESIDENTS_Z.map((r) => ({ id: r.id, home: r.home, kind: 'resident', zone: r.zone }));
const PERSON = Object.fromEntries([...PEOPLE, ...PEOPLE_B, ...PEOPLE_Z].map((p) => [p.id, p]));
// 그 사람이 걷는 동네의 격자
export const gridFor = (id, g) => (districtOf(id) === 'bongcheon' ? gridOf('bongcheon') ?? g : g);
export const sanctuaryKey = (id) => (districtOf(id) === 'bongcheon' ? 'b_branch' : 'sanctuary');

// 낮 포교 중인 간부도 동네를 걷는다 ('o:<간부 id>'). 9시부터 90분마다 다른 바깥 자리로
const STREET_SPOTS = ['station:plaza', 'market:entrance', 'cvs:front', 'park:plaza', 'stream:path', 'restaurant:front', 'station:exit4', 'market:walk', 'gosiwon:front', 'park:walk'];
// 간부가 첫 신도(엄마·친구·민호)면 'o:<id>' 로 새로 걷고, 주민 출신이면 그 주민이 일과 대신 포교를 다닌다
// 3단계: 기자(x:reporter, 역에서 올라온다)와 라이벌 교주·전도자(v:*, 관악로지스 빌딩 4층)도 같은 규칙으로 걷는다
export const reporterOut = (s) => !!s.reporter?.active && s.day >= s.reporter.since && s.day <= s.reporter.leaveDay;
export const rivalOut = (s) => !!s.rival && ['active', 'enemy'].includes(s.rival.status) && s.day >= s.rival.since;
export function peopleOf(s) {
  const out = [...PEOPLE, ...PEOPLE_Z.filter((p) => s.res[p.id])];
  for (const o of s.officers ?? []) if (!o.left && o.assign === 'street' && o.kind === 'cast') out.push({ id: `o:${o.id}`, home: 'sanctuary', kind: 'officer', oid: o.id });
  if (reporterOut(s)) out.push({ id: 'x:reporter', home: 'station', kind: 'reporter' });
  if (rivalOut(s)) for (const w of ['leader', 'p1', 'p2']) out.push({ id: `v:${w}`, home: 'office', kind: 'rival' });
  if (s.phase >= 4) out.push(...PEOPLE_B);
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
// 기자: 10시부터 한 시간마다 바깥 자리를 옮긴다 · 라이벌: 9시 반부터 80분마다
const REPORTER_SPOTS = ['station:exit4', 'market:entrance', 'cvs:front', 'restaurant:front', 'park:plaza', 'market:walk', 'station:plaza', 'gosiwon:front', 'stream:path'];
const RIVAL_SPOTS = ['station:exit3', 'market:walk', 'park:walk', 'cvs:front', 'gosiwon:front', 'station:plaza', 'stream:bridge', 'fortune:front', 'market:entrance'];
const npcCache = new Map();
function npcSchedule(s, id) {
  const k = `${s.day}:${id}`;
  if (!npcCache.has(k)) {
    let h = 0; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const list = [];
    if (id === 'x:reporter') {
      list.push({ min: 9 * 60 + 30, key: 'station:exit4' });
      for (let i = 0; i < 8; i++) list.push({ min: 10 * 60 + i * 60, key: REPORTER_SPOTS[(h + i * 4) % REPORTER_SPOTS.length] });
      list.push({ min: 18 * 60 + 30, key: 'station' });
    } else {
      const off = id === 'v:leader' ? 0 : id === 'v:p1' ? 3 : 6;
      for (let i = 0; i < 7; i++) list.push({ min: 9 * 60 + 30 + i * 80, key: RIVAL_SPOTS[(h + off + i * 2) % RIVAL_SPOTS.length] });
      list.push({ min: 18 * 60 + 40, key: 'office' });
    }
    // 같은 자리가 이어지면 하나로
    if (npcCache.size > 200) npcCache.clear();
    npcCache.set(k, list.filter((e, i) => !i || e.key !== list[i - 1].key));
  }
  return npcCache.get(k);
}
const personAny = (id) => PERSON[id] ?? (id.startsWith('x:') ? { id, home: 'station', kind: 'reporter' } : id.startsWith('v:') ? { id, home: 'office', kind: 'rival' } : { id, home: 'sanctuary', kind: 'officer' });
const CLERGY_BY_ID = Object.fromEntries([...CLERGY, ...CLERGY_B].map((c) => [c.id, c]));

const parsed = new Map();
function parseList(list) {
  // 글자로 묶어 둔다 (성직자 일과처럼 부를 때마다 새 배열이 와도 캐시가 늘지 않게)
  const k = list.join('|');
  if (!parsed.has(k)) parsed.set(k, list.map((e) => { const [t, key] = e.split(' '); return { min: parseTime(t), key }; }));
  return parsed.get(k);
}

// 오늘 일과 (예배 날 참석자는 저녁에 성소로 간다). 시각은 '도착' 시각이다.
export function scheduleOf(s, id) {
  const p = personAny(id);
  if (onStreet(s, id)) return officerSchedule(s, id);
  if (p.kind === 'clergy') return parseList(CLERGY_SCHEDULE(CLERGY_BY_ID[p.clergy]));
  if (p.kind === 'reporter' || p.kind === 'rival') return npcSchedule(s, id);
  const r = RESIDENT_BY_ID[id];
  // 신도 가족 시위: 그날은 아침부터 상가 입구 앞에 선다 (대응하면 원래 일과로)
  const pr = s.protest;
  const bong = r.district === 'bongcheon';
  if (pr && !pr.done && pr.day === s.day && !pr.resolved && pr.id === id) return [{ min: 9 * 60 + 30, key: bong ? 'b_branch:door' : 'sanctuary:door' }, { min: 19 * 60, key: r.home }];
  let list = parseList(isWeekend(s.day) ? r.weekend : r.weekday);
  // 탈퇴자 모임: 토요일 오후 솔밭 쉼터
  if (s.meeting?.day === s.day && s.meeting.ids.includes(id) && !s.defectors?.[id]?.done && !s.defectors?.[id]?.hushed) {
    list = [...list.filter((e) => e.min < 12 * 60 + 30), { min: 14 * 60, key: bong ? 'b_park:bench' : 'park:bench1' }, ...list.filter((e) => e.min >= 16 * 60 + 30)];
  }
  if (s.weather?.rain) list = weatherList(list, 'rain', r.home);
  else if (s.weather?.market) list = weatherList(list, 'market', r.home);
  // 큰 날 (25장 D): 몰리는 주민은 행사 시간에 그 근처 자리로 간다 (신림동만, 자리마다 몇 명씩 흩어서)
  const bd = bigDayOf(s);
  if (bd && !bong) {
    const crowd = bigDayCrowd(s, bd);
    const n = crowd.indexOf(id);
    if (n >= 0) {
      const offset = (id.charCodeAt(0) + id.length * 11) % 40;
      const spot = bd.spots[n % bd.spots.length];
      const before = list.filter((e) => e.min < bd.from - 90);
      const after = list.filter((e) => e.min >= bd.to + 40 && e.key !== spot);
      list = [...before, { min: bd.from + offset, key: spot }, ...(after.length ? after : [{ min: bd.to + 40, key: r.home }])];
    }
  }
  // 비로 바뀐 일과·큰 날 일과에 같은 곳이 이어지면 하나로
  list = list.filter((e, i) => i === 0 || e.key !== list[i - 1].key);
  if (s.attend.includes(id)) {
    const offset = (id.charCodeAt(0) + id.length * 7) % 25;
    const arrive = WORSHIP_ARRIVE - 25 + offset;
    list = [...list.filter((e) => e.min < arrive - 90), { min: arrive, key: sanctuaryKey(id) }];
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

// ── 걷는 속도: 현실 1초당 칸 수를 사람마다 정하고, 시뮬레이터는 칸/게임분으로 쓴다 ──
const hash01 = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16;   // 비슷한 글자열도 고르게 흩어지게
  return (h >>> 0) / 4294967296;
};
const BUSY = ['busy', 'tired', 'sharp'];
export function tilesPerSecond(id) {
  const r = RESIDENT_BY_ID[id];
  const R = MOVE.resident;
  if (id === 'x:reporter') return 2.4;
  if (!r) return R.npc;
  const range = r.age >= 60 ? R.old : (r.age <= 30 || r.traits.some((t) => BUSY.includes(t))) ? R.young : R.base;
  return range[0] + hash01(id) * (range[1] - range[0]);
}
// 지금 이 사람의 속도 (칸/게임분): 비 오는 날 빠르게, 밤늦은 귀가는 느리게
export function speedOf(s, id, minute = s.minute) {
  let tps = tilesPerSecond(id);
  if (s.weather?.rain) tps *= MOVE.rainMul;
  if (minute >= MOVE.lateFrom) tps *= MOVE.lateMul;
  return tps / CLOCK.minutesPerSecond;
}
const PAUSE_MIN = ((MOVE.pauseSeconds[0] + MOVE.pauseSeconds[1]) / 2) * CLOCK.minutesPerSecond;   // 멈춤 한 번 평균 (게임분)

// 출발 시각표: 도착 시각에 맞춰 걸리는 시간만큼 먼저 나선다 (길 길이 / 그 사람 속도 + 가다 멈출 시간 기대값 + 3분)
const legCache = new Map();
function legInfo(g, fromKey, toKey) {
  const k = fromKey + '>' + toKey;
  if (!legCache.has(k)) {
    const path = findPath(g, resolveKey(g, fromKey).tile, resolveKey(g, toKey).tile);
    // 횡단보도에 들어서는 횟수 (29장 A: 한 번 들어서면 끝까지 건넌다)
    let crossings = 0;
    if (path) for (let i = 0; i < path.length; i++) { const [x, y] = path[i]; const prev = path[i - 1]; if (g.cross?.has(y * g.w + x) && !(prev && g.cross.has(prev[1] * g.w + prev[0]))) crossings++; }
    legCache.set(k, { tiles: path ? path.length : 0, crossings });
  }
  return legCache.get(k);
}
export function travelMinutes(s, g, id, fromKey, toKey, minute = s.minute) {
  const { tiles, crossings } = legInfo(gridFor(id, g), fromKey, toKey);
  if (!tiles) return 0;
  const pauses = tiles * MOVE.pauseChance;
  // 횡단보도마다 신호 대기 (가장 긴 대기의 0.6: 평균보다 넉넉히, 29장 A)
  return (tiles + 2) / speedOf(s, id, minute) + pauses * PAUSE_MIN * 1.6 + crossings * MAX_WALK_WAIT * 0.6 + 6;   // 멈춤이 몰리는 날도 있어 넉넉히
}
export function departures(s, g, id) {
  const p = personAny(id);
  let prev = p.home;
  const out = [];
  for (const e of scheduleOf(s, id)) {
    // 비·큰 날로 바뀐 일과가 앞 장소와 너무 붙으면 앞 장소에 10분은 있다가 나선다 (그만큼 늦게 도착)
    const t = travelMinutes(s, g, id, prev, e.key, e.min);
    const dep = out.length ? Math.max(e.min - t, out.at(-1).arrive + 10) : e.min - t;
    out.push({ dep, arrive: dep + t, key: e.key });
    prev = e.key;
  }
  out.push({ dep: CLOCK.dayEnd - travelMinutes(s, g, id, prev, p.home, CLOCK.dayEnd), arrive: CLOCK.dayEnd, key: s.attend.includes(id) ? sanctuaryKey(id) : p.home });
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
export function spotFor(g0, key, id) {
  const g = gridFor(id, g0);
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
    const { tile } = resolveKey(gridFor(p.id, g), p.home);
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

// dtMin 게임 분만큼 움직인다. 가끔 멈추고(폰·가게 구경·신호), 좁은 길에서 마주치면 한쪽이 기다린다
const PAUSE_KINDS = ['phone', 'look'];
// 장소가 아닌 자리 키: 기자 추격 · 교주에게 인사하러 옴 · 따라다님 · 일과로 돌아가는 중 (29장 C)
const STREET_KEYS = new Set(['chase', 'greet', 'follow', 'back']);
export function tickPeople(s, g, dtMin) {
  const people = peopleOf(s);
  // 지금 걷는 사람들의 칸 → 다음 칸 (마주침 판정)
  const heading = new Map();
  for (const p of people) { const q = s.pos[p.id]; if (q?.path?.length) heading.set(`${p.district ?? ''}${q.x},${q.y}`, { id: p.id, next: q.path[0] }); }
  const g0 = g;
  for (const p of people) {
    g = gridFor(p.id, g0);
    if (!s.pos[p.id]) { const { tile } = resolveKey(g, p.home); s.pos[p.id] = { x: tile[0], y: tile[1], path: [], prog: 0, key: p.home, inside: true }; }
    const pos = s.pos[p.id];
    if (pos.key === 'follow') continue;                 // 교주를 따라다니는 열혈 신자 (화면이 움직인다, 29장 C)
    // 기자가 교주를 따라온다: 교주 칸 옆까지 길을 다시 잡는다
    if (p.id === 'x:reporter' && s.reporter?.chase && s.leaderTile) {
      const [lx, ly] = s.leaderTile;
      const end = pos.path.length ? pos.path.at(-1) : [pos.x, pos.y];
      if (Math.abs(end[0] - lx) + Math.abs(end[1] - ly) > 1) {
        const path = findPath(g, [pos.x, pos.y], [lx, ly]);
        if (path) { pos.path = path.slice(0, -1); pos.key = 'chase'; pos.inside = false; pos.wait = 0; pos.pause = null; }
      }
    }
    const key = pos.key === 'chase' && s.reporter?.chase ? 'chase' : targetKey(s, g, p.id);
    if (key !== pos.key && !(pos.hold > s.minute)) {     // hold: 교주에게 인사하러 와서 잠깐 서 있는 중
      pos.hold = 0;
      const { tile } = spotFor(g, key, p.id);
      pos.key = key;
      pos.path = findPath(g, [pos.x, pos.y], tile) ?? [];
      pos.inside = false;
      pos.prog = 0;
      pos.wait = 0; pos.pause = null;
    }
    if (pos.path.length) {
      let dt = dtMin;
      if (pos.wait > 0) { const used = Math.min(pos.wait, dt); pos.wait -= used; dt -= used; if (pos.wait <= 0) pos.pause = null; }
      // 좁은 길(옆으로 비킬 칸이 없음)에서 마주 오는 사람이 있으면 한쪽(이름 순서 뒤)이 잠깐 기다린다
      if (dt > 0 && pos.prog < 0.05) {
        const [nx, ny] = pos.path[0];
        const other = heading.get(`${p.district ?? ''}${nx},${ny}`);
        if (other && other.id !== p.id && other.next[0] === pos.x && other.next[1] === pos.y && other.id < p.id && narrow(g, nx, ny)) {
          pos.wait = MOVE.yieldSeconds * CLOCK.minutesPerSecond; pos.pause = 'yield'; dt = 0;
        }
      }
      pos.prog += dt * speedOf(s, p.id);
      while (pos.prog >= 1 && pos.path.length) {
        const [nx, ny] = pos.path.shift();
        pos.dir = nx > pos.x ? 'right' : nx < pos.x ? 'left' : ny > pos.y ? 'down' : 'up';
        pos.x = nx; pos.y = ny; pos.prog -= 1;
        if (!pos.path.length) break;
        // 횡단보도 앞: 건너는 길의 신호가 초록이 될 때까지 기다린다 (29장 A)
        const [ax, ay] = pos.path[0];
        const atCross = g.cross?.has(ay * g.w + ax) && !g.cross.has(ny * g.w + nx);
        if (atCross) {
          const w = walkWait(s.minute, crossingAxis(ax - nx, ay - ny));
          if (w > 0) { pos.wait = w; pos.pause = 'signal'; pos.prog = Math.min(pos.prog, 0); break; }
          continue;
        }
        // 가다 멈춤: 폰 확인 · 가게 쳐다보기 (현실 2~4초)
        if (pos.calm > 0) { pos.calm--; continue; }      // 한 번 멈추면 한동안은 안 멈춘다
        const roll = hash01(`${p.id}:${s.day}:${nx},${ny}`);
        if (roll < MOVE.pauseChance) {
          const secs = MOVE.pauseSeconds[0] + hash01(`${p.id}${nx}${ny}`) * (MOVE.pauseSeconds[1] - MOVE.pauseSeconds[0]);
          pos.wait = secs * CLOCK.minutesPerSecond;
          pos.pause = PAUSE_KINDS[Math.floor(roll * 1000) % 2];
          pos.prog = Math.min(pos.prog, 0);
          pos.calm = 10;
          break;
        }
      }
      if (!pos.path.length) { pos.prog = 0; pos.wait = 0; pos.pause = null; pos.arrived = s.minute; }
    }
    if (!pos.path.length) pos.inside = STREET_KEYS.has(pos.key) ? false : resolveKey(g, pos.key).inside;
  }
}
// 옆으로 비킬 칸이 없는 칸 (1칸 샛길: 좌우나 위아래가 둘 다 막힘)
function narrow(g, x, y) {
  const w = (a, b) => a >= 0 && b >= 0 && a < g.w && b < g.h && g.cost[b * g.w + a] > 0;
  return (!w(x - 1, y) && !w(x + 1, y)) || (!w(x, y - 1) && !w(x, y + 1));
}

export const personOf = (id) => personAny(id);

// 하루 시작: 지금 고민 정하기, 욕구 흔들기
export function morningNeeds(s) {
  for (const r of ALL_RESIDENTS) {
    if (!s.res[r.id] || (r.district === 'bongcheon' && s.phase < 4)) continue;   // 봉천동은 4단계부터 (1~3단계 난수 순서를 그대로 둔다)
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
