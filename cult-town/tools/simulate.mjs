// 노드 시뮬레이터
//  1) 주민 일과 검사: 모든 일과 장소에 길이 있는가, 다음 일과 전에 도착하는가, 같은 칸에 너무 몰리지 않는가
//  2) 균형 검사: 간단한 봇이 여섯 유형으로 여러 판 해 보고, 1단계 목표까지 걸리는 날 수와 실제 시간을 잰다
// 사용: node tools/simulate.mjs [--games 20] [--verbose]
import { readFileSync } from 'node:fs';
import { CLOCK, MOVE, SHOP, SANCTUARY, GOAL, TALK } from '../src/config.js';
import { RESIDENTS } from '../src/data/residents.js';
import { SECTS, SECT_ORDER } from '../src/data/sects.js';
import { gridFromMap, findPath, resolveKey } from '../src/sim/grid.js';
import { newGame } from '../src/sim/state.js';
import { startDay, endDay } from '../src/sim/week.js';
import { tickPeople, departures, targetKey, PEOPLE } from '../src/sim/residents.js';
import { canTalk, startTalk, act, optionsFor } from '../src/sim/talk.js';
import { holdWorship, canWorship, buy, canBuy, seats, care } from '../src/sim/sanctuary.js';
import { memberCount } from '../src/sim/faith.js';

const args = process.argv.slice(2);
const GAMES = Number(args[args.indexOf('--games') + 1]) || 20;
const VERBOSE = args.includes('--verbose');
const g = gridFromMap(JSON.parse(readFileSync(new URL('../src/map/town.json', import.meta.url))));

let problems = 0;
const fail = (msg) => { problems++; console.log('  ✗ ' + msg); };

// ── 1) 일과 검사 ──
console.log('■ 주민 일과 검사');
// 시각은 도착 시각. 걸리는 만큼 먼저 출발하므로, 앞 장소에서 머무는 시간이 10분 이상이어야 한다.
let legs = 0;
let tightest = { stay: Infinity };
for (const r of RESIDENTS) {
  for (const kind of ['weekday', 'weekend']) {
    const s = newGame({ leaderName: '검사', age: 38, family: 'christian', sect: 'doomsday', cultName: '검사', seed: 1 });
    s.day = kind === 'weekday' ? 0 : 5;
    s.attend = [];
    const deps = departures(s, g, r.id);
    deps.forEach((e, i) => {
      if (!findPath(g, resolveKey(g, i ? deps[i - 1].key : r.home).tile, resolveKey(g, e.key).tile)) fail(`${r.name} ${kind} ${e.key}: 길이 없다`);
      const stay = e.dep - (i ? deps[i - 1].arrive : CLOCK.dayStart - 60);
      if (stay < 10) fail(`${r.name} ${kind} ${e.key}: 앞 장소에 ${Math.round(stay)}분밖에 못 있는다`);
      if (stay < tightest.stay) tightest = { stay, who: `${r.name} ${kind} → ${e.key}` };
      legs++;
    });
    if (deps[0].dep < CLOCK.dayStart - 60) fail(`${r.name} ${kind}: 첫 출발이 너무 이르다`);
    if (!findPath(g, resolveKey(g, deps.at(-2)?.key ?? r.home).tile, resolveKey(g, 'sanctuary').tile)) fail(`${r.name}: 성소로 가는 길이 없다`);
  }
}
console.log(`  이동 ${legs}구간 검사, 가장 빠듯한 곳: ${tightest.who} (머무는 시간 ${Math.round(tightest.stay)}분)`);

// 실제로 하루를 돌려 본다: 모두 목적지에 닿는가, 막히는 사람은 없는가, 한 칸에 몇 명까지 몰리나
for (const day of [0, 2, 5, 6]) {
  const s = newGame({ leaderName: '검사', age: 38, family: 'christian', sect: 'doomsday', cultName: '검사', seed: 7 });
  s.day = day;
  startDay(s, g);
  // 예배 날 성소 가는 길도 보려고 다섯 명을 참석자로 둔다
  s.attend = day === 2 || day === 6 ? ['jihun', 'yerin', 'tong', 'seongja', 'osik'] : [];
  let maxCrowd = 0; let crowdAt = '';
  let notArrived = 0;
  for (let m = CLOCK.dayStart; m < CLOCK.dayEnd + 60; m++) {
    s.minute = m;
    // 일과가 바뀌기 직전: 이전 목적지에 도착했는가
    for (const p of PEOPLE) {
      const pos = s.pos[p.id];
      const nextKey = targetKey(s, g, p.id, m + 1);
      if (nextKey !== pos.key && pos.path.length > 0) notArrived++;
    }
    tickPeople(s, g, 1);
    if (m % 15 === 0) {
      const count = {};
      for (const p of PEOPLE) {
        const pos = s.pos[p.id];
        if (pos.inside || pos.path.length) continue;
        const k = `${pos.x},${pos.y}`;
        count[k] = (count[k] ?? 0) + 1;
        if (count[k] > maxCrowd) { maxCrowd = count[k]; crowdAt = `${pos.key} ${Math.floor(m / 60)}시`; }
      }
    }
  }
  const home = PEOPLE.filter((p) => !s.attend.includes(p.id)).every((p) => s.pos[p.id].inside && s.pos[p.id].key === p.home);
  const atSanct = s.attend.every((id) => s.pos[id].key === 'sanctuary' && s.pos[id].inside);
  console.log(`  ${CLOCK.weekdays[day % 7]}요일: 도착 전 다음 일과로 넘어간 경우 ${notArrived} · 한 칸 최대 ${maxCrowd}명 (${crowdAt}) · 밤에 모두 귀가 ${home ? '예' : '아니오'}${s.attend.length ? ` · 예배 참석자 성소 도착 ${atSanct ? '예' : '아니오'}` : ''}`);
  if (notArrived > 0) fail(`${CLOCK.weekdays[day % 7]}요일: 도착 전에 일과가 바뀐 경우 ${notArrived}`);
  if (!home) fail('밤까지 집에 못 들어간 사람이 있다');
  if (s.attend.length && !atSanct) fail('예배 참석자가 성소에 못 왔다');
  if (maxCrowd > 4) fail(`한 칸에 ${maxCrowd}명이 몰린다 (${crowdAt})`);
}

// ── 2) 균형 검사 ──
// 봇: 하루 동안 바깥에 나온 주민 중 피로가 허락하는 만큼 말을 건다.
//   단서(hint)를 보고 고민 카드를 고른다 (단서는 70%만 맞다). 초대할 수 있으면 초대, 특기가 맞을 것 같으면 특기.
//   밤엔 예배, 자리가 모자라면 의자, 돈이 남으면 분위기 소품, 새신자 돌보기.
const SPECIAL_FIT = {
  doomsday: ['future'], messiah: ['lonely'], meditation: ['meaning', 'health'],
  fortune: ['money', 'lonely'], shaman: ['future', 'money'], qigong: ['health'],
};
const TALK_TILES = 25; // 말 걸러 가는 평균 걸음 (피로)

function seenToday(s) {
  const seen = new Set();
  const s2 = structuredClone({ ...s });
  for (let m = CLOCK.dayStart; m < CLOCK.dayEnd; m += 2) {
    s2.minute = m;
    tickPeople(s2, g, 2);
    if (m % 20 === 0) for (const r of RESIDENTS) if (!s2.pos[r.id].inside) seen.add(r.id);
  }
  return [...seen];
}

function playDay(s, policy) {
  const seen = seenToday(s);
  const order = seen.slice().sort((a, b) => {
    const A = s.res[a]; const B = s.res[b];
    // 신도·방문 약속한 사람은 뒤로. 초대 직전인 사람, 새신자, 친해지는 중인 사람 순
    const score = (x) => (x.stage === 'member' || x.stage === 'visitor' ? -200 : 0) + (x.stage === 'curious' ? 200 : 0) + (x.stage === 'newcomer' ? 100 : 0) + x.like - x.sus * 2;
    return score(B) - score(A);
  });
  for (const id of order) {
    if (!canTalk(s, id).ok) continue;
    s.leader.fatigue += TALK_TILES * TALK.fatiguePerTile;
    const t = startTalk(s, id);
    const st = s.res[id];
    const ids = t.options.map((o) => o.id);
    let opt = 'listen';
    const guess = st.known ? Object.entries(st.needs).sort((a, b) => b[1] - a[1])[0][0] : st.hint;
    if (policy === 'reckless') opt = ids.includes('invite') ? 'invite' : ids.includes('preach') ? 'preach' : 'special';
    else if (ids.includes('invite')) opt = 'invite';
    else if (st.known && SPECIAL_FIT[s.leader.sect].includes(guess) && st.like >= 20) opt = 'special';
    const card = t.cards.includes(guess) ? guess : t.cards[0];
    act(s, id, opt, card);
  }
  s.minute = CLOCK.dayEnd;
}

function playNight(s) {
  if (canWorship(s)) {
    const expected = s.attend.length + 3 + s.followers;
    while (expected > seats(s) && canBuy(s, 'chair').ok && s.leader.money - SHOP.chair.price > SANCTUARY.rent * 0.6) buy(s, 'chair');
    holdWorship(s);
  }
  for (const item of ['kettle', 'banner', 'light', 'board', 'speaker', 'plant']) {
    if (canBuy(s, item).ok && s.leader.money - SHOP[item].price > SANCTUARY.rent * 1.3) buy(s, item);
  }
  const newcomers = Object.keys(s.res).filter((id) => s.res[id].stage === 'newcomer').sort((a, b) => s.res[a].like - s.res[b].like);
  if (newcomers[0]) care(s, newcomers[0]);
}

function playGame(sect, seed, policy = 'normal') {
  const family = SECTS[sect].family[0];
  const s = newGame({ leaderName: '봇', age: 40, family, sect, cultName: '봇', seed });
  startDay(s, g);
  const timeline = [];
  for (let d = 0; d < 45; d++) {
    playDay(s, policy);
    playNight(s);
    const r = endDay(s, g, { rentChoice: 'promise' });
    timeline.push(memberCount(s));
    if (VERBOSE && seed === 1000 && (d % 7 === 6)) {
      const st = {}; for (const r of Object.values(s.res)) st[r.stage] = (st[r.stage] ?? 0) + 1;
      const sus = Object.values(s.res).map((r) => Math.round(r.sus));
      console.log(`    ${sect} ${d + 1}일 stage ${JSON.stringify(st)} 따라온 ${s.followers} 평판 ${Math.round(s.rep)} 돈 ${s.leader.money} 자리 ${seats(s)} 의심 평균 ${Math.round(sus.reduce((a, b) => a + b) / sus.length)} 최대 ${Math.max(...sus)}`);
    }
    if (r.over) return { over: r.over, days: s.day + 1, timeline, s };
  }
  return { over: 'timeout', days: 45, timeline, s };
}

const DAY_SECONDS = (CLOCK.dayEnd - CLOCK.dayStart) / CLOCK.minutesPerSecond + 45; // 낮 + 밤 메뉴 약 45초
console.log(`\n■ 균형 검사 (유형마다 ${GAMES}판, 하루 ≈ ${Math.round(DAY_SECONDS)}초)`);
const median = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const rows = [];
for (const sect of SECT_ORDER) {
  const res = [];
  for (let i = 0; i < GAMES; i++) res.push(playGame(sect, 1000 + i * 17));
  const wins = res.filter((r) => r.over === 'win');
  const days = wins.map((r) => r.days);
  const reasons = {};
  for (const r of res) reasons[r.over] = (reasons[r.over] ?? 0) + 1;
  const d14 = median(res.map((r) => r.timeline[13] ?? r.timeline.at(-1)));
  const row = {
    sect: SECTS[sect].name, win: `${wins.length}/${GAMES}`,
    days: days.length ? `${Math.min(...days)}~${Math.max(...days)} (중앙 ${median(days)})` : '-',
    minutes: days.length ? Math.round((median(days) * DAY_SECONDS) / 60) : '-',
    members14: d14, reasons: Object.entries(reasons).map(([k, v]) => `${k}:${v}`).join(' '),
  };
  rows.push(row);
  console.log(`  ${row.sect.padEnd(10)} 승 ${row.win.padEnd(6)} 걸린 날 ${String(row.days).padEnd(16)} ≈ ${row.minutes}분 · 14일째 신도 ${row.members14} · ${row.reasons}`);
  if (VERBOSE) console.log('    ', res[0].timeline.join(' '));
  const mins = days.length ? (median(days) * DAY_SECONDS) / 60 : Infinity;
  if (wins.length < GAMES * 0.6) fail(`${row.sect}: 승률이 낮다`);
  if (mins < 55 || mins > 125) fail(`${row.sect}: 목표까지 ${Math.round(mins)}분 (목표 1~2시간)`);
}

// 막 나가는 봇(교단 얘기만 한다)은 실패해야 한다
const reckless = SECT_ORDER.map((sect) => playGame(sect, 4242, 'reckless'));
const recklessWins = reckless.filter((r) => r.over === 'win').length;
console.log(`\n■ 교단 얘기만 하는 봇: ${reckless.map((r) => `${r.over}@${r.days}일`).join(' · ')}`);
if (recklessWins > 1) fail('교단 얘기만 해도 이긴다 (의심 장치가 약하다)');

console.log(problems ? `\n✗ 문제 ${problems}개` : '\n✓ 문제 없음');
process.exitCode = problems ? 1 : 0;
