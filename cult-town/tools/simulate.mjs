// 노드 시뮬레이터
//  1) 주민 일과 검사: 모든 일과 장소에 길이 있는가, 다음 일과 전에 도착하는가, 같은 칸에 너무 몰리지 않는가
//  2) 균형 검사: '정석' 봇이 여섯 유형으로 여러 판 해 보고, 1단계 목표(성공률 60~80%) · 2단계 목표 · 3단계 목표(성공률 60~80%, 2~3시간)까지 잰다. 라이벌이 혼자 크는지도 본다
// 사용: node tools/simulate.mjs [--games 20] [--verbose] [--no-balance]
import { readFileSync } from 'node:fs';
import { CLOCK, MOVE, SHOP, SANCTUARY, TALK, SPACE_STEPS, OFFICERS } from '../src/config.js';
import { ITEMS } from '../src/data/items.js';
import { PREFS } from '../src/data/prefs.js';
import { RESIDENTS, RESIDENTS_B, ALL_RESIDENTS } from '../src/data/residents.js';
import { SECTS, SECT_ORDER } from '../src/data/sects.js';
import { gridFromMap, findPath, resolveKey, registerGrid } from '../src/sim/grid.js';
import { newGame } from '../src/sim/state.js';
import { startDay, endDay } from '../src/sim/week.js';
import { daysToRent } from '../src/sim/clock.js';
import { tickPeople, departures, targetKey, peopleOf, gridFor, sanctuaryKey } from '../src/sim/residents.js';
import { canTalk, startTalk, act } from '../src/sim/talk.js';
import { holdWorship, canWorship, buy, canBuy, seats, care } from '../src/sim/sanctuary.js';
import { memberCount, namedMembers } from '../src/sim/faith.js';
import { eventOptions, resolveEvent, DARK_EVENT_OPTIONS } from '../src/sim/events.js';
import { visitPlace, buyItem } from '../src/sim/stories.js';
import { visitSpot, currentStep } from '../src/sim/quests.js';
import { FLYER_SPOTS } from '../src/data/quests.js';
import { upgradeSign, nextSignCost } from '../src/sim/sanctuary.js';
import { bestSermon } from '../src/sim/sermon.js';
import { isOpeningDay, applyOpeningDay } from '../src/sim/opening.js';
import { botBigDay } from '../src/sim/bigdays.js';
import { autoRaise, canStreetSermon, streetSermon } from '../src/sim/growth.js';
import { zealotsOf, zealotCandidates, makeZealot, calmZealot } from '../src/sim/zealots.js';
import { sameFamily } from '../src/sim/talk.js';
import { rentNow, nextStep, expand, haggleChance, openSlots, buildRoom, upgradeRoom, roomCost } from '../src/sim/space.js';
import { activeOfficers, canPromote, promote, assign, streetTick, pickAgenda, decideAgenda } from '../src/sim/officers.js';
import { applyRevelation } from '../src/sim/revelation.js';
import { AGENDAS } from '../src/data/officers.js';
import { threatHour, setThreatGrid, protestToday, answerProtest, soreDefectors, answerDefector, reporterHere, interview } from '../src/sim/threats.js';
import { rivalOn, rivalAct, mergeChance, truceChance, rivalSize, rivalOptions } from '../src/sim/rival.js';
import { RIVAL, PHASE4 } from '../src/config.js';
import { canOpenBranch, openBranch, branchHead, branchAct } from '../src/sim/branch.js';
import { branchCount } from '../src/sim/faith.js';

const args = process.argv.slice(2);
const GAMES = args.includes('--games') ? Number(args[args.indexOf('--games') + 1]) : 20;
const VERBOSE = args.includes('--verbose');
const g = gridFromMap(JSON.parse(readFileSync(new URL('../src/map/town.json', import.meta.url))));
const gB = gridFromMap(JSON.parse(readFileSync(new URL('../src/map/bongcheon.json', import.meta.url))));
registerGrid('sillim', g); registerGrid('bongcheon', gB);
setThreatGrid(g);

let problems = 0;
const fail = (msg) => { problems++; console.log('  ✗ ' + msg); };

// ── 1) 일과 검사 ──
console.log('■ 주민 일과 검사');
// 시각은 도착 시각. 걸리는 만큼 먼저 출발하므로, 앞 장소에서 머무는 시간이 10분 이상이어야 한다.
let legs = 0;
let tightest = { stay: Infinity };
for (const r of ALL_RESIDENTS) {
  const rg = gridFor(r.id, g);
  for (const kind of ['weekday', 'weekend']) {
    const s = newGame({ leaderName: '검사', age: 38, family: 'christian', sect: 'doomsday', cultName: '검사', seed: 1 });
    s.day = kind === 'weekday' ? 0 : 12;   // 큰 날이 없는 평일·주말 (큰 날 일과는 아래 하루 돌리기에서 본다)
    s.attend = [];
    const deps = departures(s, g, r.id);
    deps.forEach((e, i) => {
      if (!findPath(rg, resolveKey(rg, i ? deps[i - 1].key : r.home).tile, resolveKey(rg, e.key).tile)) fail(`${r.name} ${kind} ${e.key}: 길이 없다`);
      const stay = e.dep - (i ? deps[i - 1].arrive : CLOCK.dayStart);
      if (stay < 10) fail(`${r.name} ${kind} ${e.key}: 앞 장소에 ${Math.round(stay)}분밖에 못 있는다`);
      if (stay < tightest.stay) tightest = { stay, who: `${r.name} ${kind} → ${e.key}` };
      legs++;
    });
    if (deps[0].dep < CLOCK.dayStart) fail(`${r.name} ${kind}: 첫 출발이 07시보다 이르다`);
    if (!findPath(rg, resolveKey(rg, deps.at(-2)?.key ?? r.home).tile, resolveKey(rg, sanctuaryKey(r.id)).tile)) fail(`${r.name}: 성소로 가는 길이 없다`);
  }
}
console.log(`  이동 ${legs}구간 검사, 가장 빠듯한 곳: ${tightest.who} (머무는 시간 ${Math.round(tightest.stay)}분)`);

// 실제로 하루를 돌려 본다: 모두 목적지에 닿는가, 막히는 사람은 없는가, 한 칸에 몇 명까지 몰리나
for (const day of [0, 2, 5, 6, 10, 19, 22, 33]) {   // 5·10·19·22·33 = 큰 날
  const s = newGame({ leaderName: '검사', age: 38, family: 'christian', sect: 'doomsday', cultName: '검사', seed: 7 });
  s.day = day;
  s.phase = 4;      // 봉천동 주민까지 같이 걷게
  startDay(s, g);
  const PEOPLE = peopleOf(s);
  // 예배 날 성소(봉천동은 지부) 가는 길도 보려고 일곱 명을 참석자로 둔다
  s.attend = day === 2 || day === 6 ? ['jihun', 'yerin', 'tong', 'seongja', 'osik', 'b_gongsi', 'b_mom'] : [];
  let maxCrowd = 0; let crowdAt = '';
  let notArrived = 0; const lateLog = [];
  for (let m = CLOCK.dayStart; m < CLOCK.dayEnd + 60; m++) {
    s.minute = m;
    // 일과가 바뀌기 직전: 이전 목적지에 도착했는가
    for (const p of PEOPLE) {
      const pos = s.pos[p.id];
      const nextKey = targetKey(s, g, p.id, m + 1);
      if (nextKey !== pos.key && pos.path.length > 0) { notArrived++; if (lateLog.length < 12) lateLog.push(`${p.id} ${pos.key}→${nextKey} ${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} 남은 ${pos.path.length}칸`); }
    }
    tickPeople(s, g, 1);
    if (m % 15 === 0) {
      const count = {};
      for (const p of PEOPLE) {
        const pos = s.pos[p.id];
        if (pos.inside || pos.path.length) continue;
        const k = `${p.district ?? ''}${pos.x},${pos.y}`;
        count[k] = (count[k] ?? 0) + 1;
        if (count[k] > maxCrowd) { maxCrowd = count[k]; crowdAt = `${pos.key} ${Math.floor(m / 60)}시`; }
      }
    }
  }
  const home = PEOPLE.filter((p) => !s.attend.includes(p.id)).every((p) => s.pos[p.id].inside && s.pos[p.id].key === p.home);
  const atSanct = s.attend.every((id) => s.pos[id].key === sanctuaryKey(id) && s.pos[id].inside);
  console.log(`  ${CLOCK.weekdays[day % 7]}요일: 도착 전 다음 일과로 넘어간 경우 ${notArrived} · 한 칸 최대 ${maxCrowd}명 (${crowdAt}) · 밤에 모두 귀가 ${home ? '예' : '아니오'}${s.attend.length ? ` · 예배 참석자 성소 도착 ${atSanct ? '예' : '아니오'}` : ''}`);
  if (lateLog.length) console.log('    ' + lateLog.join('\n    '));
  if (notArrived > 0) fail(`${CLOCK.weekdays[day % 7]}요일: 도착 전에 일과가 바뀐 경우 ${notArrived}`);
  if (!home) fail('밤까지 집에 못 들어간 사람이 있다');
  if (s.attend.length && !atSanct) fail('예배 참석자가 성소에 못 왔다');
  if (maxCrowd > 4) fail(`한 칸에 ${maxCrowd}명이 몰린다 (${crowdAt})`);
}

// ── 1-2) 대사 반복 검사: 같은 주민에게 사흘 연속 말을 걸어도 같은 말이 안 나온다 (24장 B) ──
{
  let rep = 0;
  for (const r of ALL_RESIDENTS) {
    const s = newGame({ leaderName: '검사', age: 38, family: 'christian', sect: 'doomsday', cultName: '검사', seed: 3 });
    s.weather = {};
    const said = [];
    for (let d = 0; d < 3; d++) {
      s.day = d; s.minute = 600 + d * 90;
      const t = startTalk(s, r.id, {});
      said.push(t.greet, act(s, r.id, ['smalltalk', 'listen', 'smalltalk'][d], t.cards[0], {}).line);
      s.res[r.id].sus = 0;
    }
    if (new Set(said).size < said.length) { rep++; fail(`${r.name}: 사흘 대화에 같은 말이 나온다`); }
  }
  console.log(`  대사 반복 검사: 주민 ${ALL_RESIDENTS.length}명 사흘 연속 대화 · 같은 말 나온 주민 ${rep}`);
}

// ── 2) 균형 검사 ──
// '정석' 봇: 단서를 보고 고민 카드를 고르고, 사연 부탁을 들어주고, 좋아하는 선물을 주고, 어두운 선택은 하지 않는다.
// 밤: 예배·의자·소품·돌보기. 2단계: 돈이 되면 확장, 상담실·주방·공부방·사무실 순으로 방, 간부 승진·배치, 회의는 불만 적은 쪽.
const SPECIAL_FIT = {
  doomsday: ['future'], messiah: ['lonely'], meditation: ['meaning', 'health'],
  fortune: ['money', 'lonely'], shaman: ['future', 'money'], qigong: ['health'],
};
const TALK_TILES = 25;
const EVENT_PREF = ['cooperate', 'tea', 'mat', 'apologize', 'explain', 'short', 'buy', 'pickup', 'order', 'sorry', 'let', 'none', 'later', 'refuse', 'ignore'];
const ROOM_ORDER = ['broadcast', 'counsel', 'kitchen', 'office', 'study', 'worship', 'worship', 'study'];

function seenToday(s) {
  const seen = new Map();
  const s2 = structuredClone({ ...s });
  for (let m = CLOCK.dayStart; m < CLOCK.dayEnd; m += 5) {
    s2.minute = m;
    tickPeople(s2, g, 5);
    if (m % 30 === 0) for (const r of s.district === 'bongcheon' ? RESIDENTS_B : RESIDENTS) if (!s2.pos[r.id].inside && !seen.has(r.id)) seen.set(r.id, s2.pos[r.id].key);
  }
  return seen;
}

function botTalk(s, id, key, policy) {
  const can = canTalk(s, id);
  if (!can.ok) return false;
  s.leader.fatigue += TALK_TILES * TALK.fatiguePerTile;
  const t = startTalk(s, id, { key });
  const st = s.res[id];
  const ids = t.options.map((o) => o.id);
  const guess = st.known ? Object.entries(st.needs).sort((a, b) => b[1] - a[1])[0][0] : st.hint;
  const loved = Object.keys(s.inventory).find((k) => s.inventory[k] > 0 && PREFS[id].likes.includes(k));
  let opt; let card;
  if (ids.includes('heard')) opt = 'heard';
  else if (ids.includes('comfort')) opt = policy === 'zealot' ? 'exploit' : 'comfort';
  else if (ids.includes('fork')) { opt = 'fork'; card = policy === 'zealot' ? 'use' : 'stay'; }
  else if (ids.includes('favorDone')) opt = 'favorDone';
  else if (ids.includes('relay')) { opt = 'relay'; card = t.options.find((o) => o.id === 'relay').from; }
  else if (policy !== 'ignoreRival' && ids.includes('askRival') && s.rival.dirt < RIVAL.expose.dirt) opt = 'askRival';
  else if (policy === 'reckless') opt = ids.includes('invite') ? 'invite' : ids.includes('preach') ? 'preach' : 'special';
  else if (ids.includes('invite')) opt = 'invite';
  else if (ids.includes('story')) opt = 'story';
  else if (ids.includes('gift') && loved) { opt = 'gift'; card = loved; }
  else if (ids.includes('umbrella')) opt = 'umbrella';
  else if (ids.includes('lunch') && st.like < 60) opt = 'lunch';
  else if (st.known && SPECIAL_FIT[s.leader.sect].includes(guess) && st.like >= 20 && st.lastTopic !== 'special') opt = 'special';
  else if (ids.includes('walk') || ids.includes('market')) opt = ids.includes('walk') ? 'walk' : 'market';
  else opt = 'listen';
  if (opt === 'listen') { card = t.cards.includes(guess) ? guess : t.cards[0]; if (st.lastTopic === `listen:${card}`) opt = 'smalltalk'; }
  act(s, id, opt, card, { key });
  return true;
}

function playDay(s, policy) {
  if (isOpeningDay(s)) applyOpeningDay(s);         // 개업 첫날 짜인 일 (간판 · 통장님 · 민호 · 하윤서)
  if (!process.env.NOBIG) botBigDay(s);                                   // 매주 큰 날: 어두운 쪽이 아닌 행동
  // 4단계: 어느 동네에서 하루를 보낼까 (지부 전엔 이틀에 하루, 지부 뒤엔 지부가 목표에 못 미치면 사흘에 이틀)
  s.district = 'sillim';
  if (s.phase >= 4) {
    const goB = !s.branch.open ? s.day % 2 === 0 : branchCount(s) < PHASE4.branch ? s.day % 3 !== 0 : s.day % 3 === 0;
    if (goB) { s.district = 'bongcheon'; s.leader.money -= PHASE4.subway.fare * 2; s.leader.fatigue += 12; }
  }
  if (s.events.pending) {
    const opts = eventOptions(s, s.events.pending).filter((o) => policy === 'reckless' || !DARK_EVENT_OPTIONS.includes(o));
    resolveEvent(s, EVENT_PREF.find((o) => opts.includes(o)) ?? opts[0]);
  }
  // 사연 부탁 준비: 물건 사기 · 장소 다녀오기
  for (const st of Object.values(s.res)) {
    const f = st.story?.favor;
    if (!f) continue;
    if (f.type === 'item' && !(s.inventory[f.item] > 0) && s.leader.money > rentNow(s) * 0.5) { buyItem(s, f.item); s.leader.fatigue += 2; }
    if (f.type === 'place' && !f.visited) { visitPlace(s, f.place); s.leader.fatigue += 3; }
  }
  // 메인 퀘스트: 전단 붙일 자리 · 오늘의 할 일 '둘러보기'
  if (!process.env.NOQ && currentStep(s)?.id === 'flyers') for (const p of FLYER_SPOTS.slice(0, 3)) { visitSpot(s, p); s.leader.fatigue += 1; }
  const visitTask = s.today?.tasks.find((t) => t.id === 'visit' && !t.done);
  if (visitTask && !process.env.NOQ) { visitSpot(s, visitTask.arg); s.leader.fatigue += 1; }
  if (s.weather.rain && !(s.inventory.umbrella > 0) && s.leader.money > rentNow(s)) buyItem(s, 'umbrella');
  const seen = seenToday(s);
  const order = [...seen.keys()].sort((a, b) => {
    const score = (id) => {
      const x = s.res[id];
      const quick = x.story?.favor && ((x.story.favor.type === 'item' && s.inventory[x.story.favor.item] > 0) || x.story.favor.relayed || x.story.favor.visited);
      const relayTarget = Object.values(s.res).some((o) => o.story?.favor?.type === 'deliver' && o.story.favor.to === id && !o.story.favor.relayed);
      return (quick || relayTarget ? 400 : 0) + (x.stage === 'member' || x.stage === 'visitor' ? -200 : 0) + (x.stage === 'curious' ? 200 : 0) + (x.stage === 'newcomer' ? 100 : 0) + x.like - x.sus * 2;
    };
    return score(b) - score(a);
  });
  if (s.phase >= 3) {
    // 시위: 관리 좋은 간부가 있으면 내려보내고, 아니면 가족 면담
    if (protestToday(s)) answerProtest(s, activeOfficers(s).some((o) => o.manage >= 4) ? 'officer' : 'meet');
    // 오늘 밖에서 보이는 탈퇴자와 화해 (하루 두 명)
    for (const id of soreDefectors(s).filter((x) => seen.has(x)).slice(0, 2)) answerDefector(s, id, 'reconcile');
    // 기자가 있으면 신도부터 만나 둔다 (오늘 얘기한 사람은 기자에게 조심해서 말한다)
    if (reporterHere(s)) order.sort((a, b) => (['member', 'newcomer'].includes(s.res[b].stage) ? 1 : 0) - (['member', 'newcomer'].includes(s.res[a].stage) ? 1 : 0));
  }
  for (const id of order) botTalk(s, id, seen.get(id), policy);
  // 길거리 즉석 설교 (카리스마 3): 오늘 본 사람 중 아직 신도 아닌 다섯 명
  if (canStreetSermon(s) && s.flags.streetSermon !== s.day && s.leader.fatigue < 60) streetSermon(s, order.filter((id) => ['none', 'curious'].includes(s.res[id].stage)).slice(0, 5), (id) => sameFamily(s, id));
  for (let hour = 9; hour < 19; hour++) { streetTick(s); threatHour(s, g, hour); }
  // 기자 인터뷰: 말 잘하는 간부 · 평판 높으면 정면 · 아니면 노코멘트
  if (s.phase >= 3 && reporterHere(s) && !s.reporter.interviewed) {
    const best = activeOfficers(s).sort((a, b) => b.talk - a.talk)[0];
    interview(s, best && best.talk >= 4 ? 'officer' : s.rep >= 65 ? 'face' : 'nocomment', best?.id);
  }
  s.minute = CLOCK.dayEnd;
}

function playNight(s) {
  // 간판: 첫 단계(창문 시트지)는 월세 여유가 있으면 바로
  if (!process.env.NOSIGN && (s.sanctuary.sign ?? 0) === 0 && s.leader.money - nextSignCost(s) > rentNow(s) * 0.4) upgradeSign(s);
  if (canWorship(s)) {
    const expected = s.attend.length + 3 + s.followers;
    while (expected > seats(s) && canBuy(s, 'chair').ok && s.leader.money - SHOP.chair.price > rentNow(s) * 0.6) buy(s, 'chair');
    holdWorship(s, { sermon: bestSermon(s).score });   // 예배 미니게임: 손패에서 가장 좋은 순서
  }
  for (const item of ['kettle', 'banner', 'light', 'board', 'speaker', 'plant']) {
    if (canBuy(s, item).ok && s.leader.money - SHOP[item].price > rentNow(s) * 1.3) buy(s, item);
  }
  const newcomers = Object.keys(s.res).filter((id) => s.res[id].stage === 'newcomer').sort((a, b) => s.res[a].like - s.res[b].like);
  for (const id of newcomers.slice(0, 2)) care(s, id);
  autoRaise(s);
  // 열혈 신자: 정석 봇은 한 명까지, 나흘마다 진정시킨다. 열혈 봇은 여섯 명까지, 진정시키지 않는다
  const zMax = s.botPolicy === 'zealot' ? 6 : 1;
  for (const id of zealotCandidates(s)) if (zealotsOf(s).length < zMax) makeZealot(s, id);
  if (s.botPolicy !== 'zealot') for (const z of zealotsOf(s)) if (z.calmUntil < s.day) calmZealot(s, z.id);
  if (s.phase >= 2) phase2Night(s);
  if (s.phase >= 4) phase4Night(s);
  s.district = 'sillim';
}

// 4단계: 지부 열기 (보증금 + 월세 여유), 지부장 불만이 크면 면담, 독립 예고면 면담 → 그래도 높으면 권한
function phase4Night(s) {
  if (canOpenBranch(s) && s.leader.money > PHASE4.deposit + rentNow(s) * 1.5) {
    const head = activeOfficers(s).sort((a, b) => b.manage - a.manage || b.loyal - a.loyal)[0];
    openBranch(s, head.id);
  }
  if (!s.branch.open) return;
  const o = branchHead(s);
  if (!o) { branchAct(s, 'replace'); return; }
  if (s.branch.split && o.discontent >= PHASE4.splitAt - 5 && s.flags.branchMeet === s.day) branchAct(s, 'power');
  else if (o.discontent >= 55 && s.flags.branchMeet !== s.day) branchAct(s, 'meet');
}

function phase2Night(s) {
  const reserve = rentNow(s) * 1.1;
  const st = nextStep(s);
  // 월세는 25일에 한 번: 월세날이 가까울 때만 한 달 치를 남겨 둔다
  if (st && s.leader.money > st.deposit + (rentNow(s) + st.rent) * (daysToRent(s.day) <= 7 ? 1.1 : 0.5)) expand(s, haggleChance(s) >= 0.5 ? 'haggle' : 'pay');
  for (const slot of openSlots(s)) {
    if (!s.rooms[slot]) {
      const built = Object.values(s.rooms).map((r) => r.type);
      const type = ROOM_ORDER.find((t, i) => ROOM_ORDER.slice(0, i + 1).filter((x) => x === t).length > built.filter((x) => x === t).length);
      if (type && s.leader.money > roomCost(s, slot, type) + reserve) buildRoom(s, slot, type);
    }
  }
  for (const slot of openSlots(s)) if (s.rooms[slot] && s.rooms[slot].level < 2 && s.leader.money > roomCost(s, slot) + reserve * 1.5) upgradeRoom(s, slot, false);
  for (const id of Object.keys(s.res)) if (activeOfficers(s).length < 5 && canPromote(s, id)) promote(s, id);
  // 배치: 관리 좋은 사람은 방, 말솜씨 좋은 사람은 낮 포교
  const roomSlots = Object.keys(s.rooms).filter((x) => x !== '302');
  for (const o of activeOfficers(s).sort((a, b) => b.manage - a.manage)) {
    if (o.talk >= o.manage && o.talk >= 3) { if (o.assign !== 'street') assign(s, o.id, 'street'); continue; }
    const free = roomSlots.find((x) => !activeOfficers(s).some((y) => y.assign === `room:${x}`));
    if (!o.assign) assign(s, o.id, free ? `room:${free}` : 'street');
  }
  if (s.phase >= 3 && rivalOn(s) && s.botPolicy !== 'ignoreRival' && rivalOptions(s).length) {
    // 합병이 잘 될 것 같으면 합병, 휴전은 거절당해도 손해가 없으니 해 볼 만하면 시도, 아니면 폭로·경쟁으로 저쪽을 줄인다
    const opts = rivalOptions(s);
    if (opts.includes('merge') && mergeChance(s) >= 0.55) rivalAct(s, 'merge');
    else if (opts.includes('truce') && truceChance(s) >= 0.35) rivalAct(s, 'truce');
    else if (s.rival.dirt >= RIVAL.expose.dirt) rivalAct(s, 'expose');
    else if (opts.includes('compete')) rivalAct(s, 'compete');
  }
  const ag = pickAgenda(s);
  if (ag) {
    const a = AGENDAS.find((x) => x.id === ag.id);
    const scoreOf = (fx) => -(fx.disc ?? 0) - (fx.discAll ?? 0) * 2 - (fx.discOther ?? 0) - (fx.shadow ? 30 : 0) + (fx.money ?? 0) / 10000 - (fx.belief && fx.belief < 0 ? 20 : 0);
    let best = 0; a.options.forEach((o, i) => { if (scoreOf(o.fx) > scoreOf(a.options[best].fx)) best = i; });
    decideAgenda(s, ag, best);
  }
}

const REV_PICKS = { sign: ['banner'], fence: ['meal', 'open'], camera: ['open'], neighbor: ['respect'], branch: ['trust'] };
function playGame(sect, seed, policy = 'normal', maxDays = 190) {
  const family = SECTS[sect].family[0];
  const s = newGame({ leaderName: '봇', age: 40, family, sect, cultName: '봇', seed });
  s.botPolicy = policy;
  startDay(s, g);
  const timeline = [];
  let phase1Day = null; let phase2Day = null; let phase3Day = null; let rivalLog = []; let firstMember = null;
  // 판 결과: 숫자만 남기고 게임 상태(s)는 버린다 (여러 판을 모아도 메모리가 늘지 않게)
  const done = (over, days) => ({ over, days, phase1Day, phase2Day, phase3Day, timeline, rivalLog, firstMember, accidents: s.flags.accidents ?? 0, rivalSect: s.rival?.sect ?? null });
  for (let d = 0; d < maxDays; d++) {
    playDay(s, policy);
    playNight(s);
    const r = endDay(s, g, { rentChoice: 'promise' });
    s.flags.accidents = (s.flags.accidents ?? 0) + r.events.filter((e) => e.type === 'zealotAccident').length;
    if (r.phaseUp === 2) phase1Day = s.day;
    if (r.phaseUp === 3) phase2Day = s.day;
    if (r.phaseUp === 4) phase3Day = s.day;
    // 빠른 조정용: STOP=n 이면 n단계를 끝내면 그 판을 멈춘다
    if (process.env.STOP && r.phaseUp && r.phaseUp > Number(process.env.STOP)) return done('stop', s.day + 1);
    if (r.revelation) applyRevelation(s, r.revelation, REV_PICKS[r.revelation]);
    if (s.rival) rivalLog.push(rivalSize(s));
    if (process.env.P3DBG && seed === Number(process.env.P3DBG) && s.phase >= 3 && s.day % 3 === 0) console.log(`      d${s.day} m${memberCount(s)} f${s.followers} rep${Math.round(s.rep)} exp${Math.round(s.exposure)} rep:${s.reporter.active ? 'on' : '-'}${s.reporter.due ? 'due' : ''} heat${Math.round(s.reporter.heat)} reports${s.reporter.reports} rival:${s.rival ? s.rival.status + rivalSize(s) + ' dirt' + s.rival.dirt + ' taken' + s.rival.taken : '-'} def${soreDefectors(s).length} prot${s.protest && !s.protest.done ? 'y' : '-'} notices${Object.keys(s.notices).length}${s.phase >= 4 ? ` | P4 repB${Math.round(s.repB)} br${s.branch.open ? branchCount(s) : '-'} bf${s.branch.followers} head${branchHead(s) ? Math.round(branchHead(s).discontent) : '-'}${s.branch.split ? 'SPLIT' : ''}` : ''}`);
    timeline.push(memberCount(s));
    if (firstMember == null && namedMembers(s).length) firstMember = s.day - 1;   // 첫 신도 전환 (이름 있는 주민, endDay 가 날짜를 넘기기 전 날)
    if (process.env.RDBG && seed === 1000 && s.phase === 1) console.log(`      d${s.day} m${memberCount(s)} streak${s.sanctuary.rentStreak} arr${s.sanctuary.arrears} money${s.leader.money}`);
    if (process.env.P2DBG && seed === 1000 && s.phase >= 2) console.log(`      d${s.day} m${memberCount(s)} f${s.followers} step${s.space.step} off${activeOfficers(s).length} money${s.leader.money} rooms ${JSON.stringify(Object.fromEntries(Object.entries(s.rooms).map(([k, v]) => [k, v.type + v.level])))}`);
    if (VERBOSE && seed === 1000 && d % 7 === 6) {
      console.log(`    ${sect} ${d + 1}일 신도 ${memberCount(s)} 따라온 ${s.followers} 평판 ${Math.round(s.rep)} 돈 ${s.leader.money} 공간 ${s.space.step} 방 ${Object.values(s.rooms).map((x) => x.type[0] + x.level).join('')} 간부 ${activeOfficers(s).map((o) => `${o.name.slice(1)}${Math.round(o.discontent)}`).join(',')} 건물주 ${Math.round(s.landlordAnger)} 사연 ${Object.values(s.res).reduce((n, x) => n + (x.story?.done ?? 0), 0)}`);
    }
    if (r.over) return done(r.over, s.day + 1);
    if (policy === 'ignoreRival' && rivalLog.length >= 15) return done('probe', s.day + 1);
  }
  return done('timeout', maxDays);
}

if (!args.includes('--no-balance')) {
  const DAY_SECONDS = (CLOCK.dayEnd - CLOCK.dayStart) / CLOCK.minutesPerSecond + 45;
  const P1_LIMIT = 24;   // 1단계를 첫 월세날(3월 25일) 다음 날까지 끝내면 성공 (약 2시간 10분, 하루 ≈ 5분 25초)
  console.log(`\n■ 균형 검사 (유형마다 ${GAMES}판, 하루 ≈ ${Math.round(DAY_SECONDS)}초, 1단계 성공 = ${P1_LIMIT}일 안에 목표)`);
  const median = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
  const min = (d) => Math.round((d * DAY_SECONDS) / 60);
  const firsts = [];   // 첫 신도 전환 날 (모든 판)
  let p1Total = 0; let n = 0; let p2Total = 0; let p2N = 0; let p3Total = 0; let p3N = 0; let p4Total = 0; let p4N = 0;
  const LIMITS = [24, 55, 85, 116];   // 3/26 · 4/26 · 5/26 · 6/26
  for (const sect of (process.env.SECT ? [process.env.SECT] : SECT_ORDER)) {
    const res = [];
    for (let i = 0; i < GAMES; i++) res.push(playGame(sect, 1000 + i * 17));
    firsts.push(...res.map((r) => r.firstMember ?? 99));
    // 단계마다 그달 25일 월세날 다음 날까지 끝내면 성공 (3/26 · 4/26 · 5/26 · 6/26)
    const [L1, L2, L3, L4] = LIMITS;
    const ok1 = res.filter((r) => r.phase1Day && r.phase1Day <= L1);
    const ok2 = ok1.filter((r) => r.phase2Day && r.phase2Day <= L2);
    const ok3 = ok2.filter((r) => r.phase3Day && r.phase3Day <= L3);
    const ok4 = ok3.filter((r) => r.over === 'win' && r.days <= L4);
    const why = (arr, next) => { const o = {}; for (const r of arr) if (!next.includes(r)) o[r.over] = (o[r.over] ?? 0) + 1; return Object.entries(o).map(([k, v]) => `${k}:${v}`).join(' '); };
    p1Total += ok1.length; n += res.length; p2Total += ok2.length; p2N += ok1.length; p3Total += ok3.length; p3N += ok2.length; p4Total += ok4.length; p4N += ok3.length;
    const d2 = ok2.map((r) => r.phase2Day - r.phase1Day); const d3 = ok3.map((r) => r.phase3Day - r.phase2Day); const d4 = ok4.map((r) => r.days - r.phase3Day);
    const md = (a) => (a.length ? `${median(a)}일 ≈ ${min(median(a))}분` : '-');
    console.log(`  ${SECTS[sect].name.padEnd(10)} 1단계 ${ok1.length}/${GAMES} (${md(ok1.map((r) => r.phase1Day))}) · 2단계 ${ok2.length}/${ok1.length} (${md(d2)}) ${why(ok1, ok2)}`);
    console.log(`  ${''.padEnd(10)} 3단계 ${ok3.length}/${ok2.length} (${md(d3)}) ${why(ok2, ok3)} · 4단계 ${ok4.length}/${ok3.length} (${md(d4)}) ${why(ok3, ok4)}`);
    const chk = (k, a, b, d) => {
      const rate = b.length ? a.length / b.length : 0;
      if (rate < 0.6 || rate > 0.8) fail(`${SECTS[sect].name}: ${k}단계 성공률 ${Math.round(rate * 100)}% (목표 60~80%)`);
      if (d && d.length) { const m = min(median(d)); if (m < 120 || m > 180) fail(`${SECTS[sect].name}: ${k}단계 ${m}분 (목표 2~3시간)`); }
    };
    chk(1, ok1, res, ok1.map((r) => r.phase1Day)); chk(2, ok2, ok1, d2); chk(3, ok3, ok2, d3); chk(4, ok4, ok3, d4);
    if (VERBOSE) console.log("    ", res[0].timeline.join(" "));
    if (process.env.P1D) console.log("     p1:", res.map((r) => r.phase1Day ?? "-").join(" "), "|", res.map((r, i) => `${1000 + i * 17}:${r.over}`).join(" "));
  }
  const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const in3 = firsts.filter((d) => d <= 2).length;
  console.log(`  첫 신도 전환: 중앙 ${median(firsts) + 1}일째 · 3일째(3/4) 안에 ${pc(in3, firsts.length)}%`);
  if (in3 < firsts.length) fail(`첫 신도 전환이 3일째 안에 안 일어난 판이 있다 (${firsts.length - in3}판)`);
  console.log(`  전체 성공률 1단계 ${pc(p1Total, n)}% · 2단계 ${pc(p2Total, p2N)}% · 3단계 ${pc(p3Total, p3N)}% · 4단계 ${pc(p4Total, p4N)}%`);
  // 열혈 신자를 많이 쓰는 봇: 더 빨리 모으지만 사고로 더 자주 실패한다
  {
    const N = Math.max(4, Math.round(GAMES / 2));
    const runs = (policy) => SECT_ORDER.flatMap((sect) => Array.from({ length: N }, (_, i) => playGame(sect, 5000 + i * 31, policy)));
    const score = (rs) => {
      const [L1, L2, L3, L4] = LIMITS;
      const win = rs.filter((r) => r.phase1Day && r.phase1Day <= L1 && r.phase2Day && r.phase2Day <= L2 && r.phase3Day && r.phase3Day <= L3 && r.over === 'win' && r.days <= L4).length;
      const at = (d) => median(rs.map((r) => r.timeline[d] ?? r.timeline[r.timeline.length - 1] ?? 0));
      const early = Math.round(rs.reduce((n, r) => n + r.timeline.slice(5, 41).reduce((a, x) => a + x, 0) / 36, 0) / rs.length);   // 5~40일 평균 신도
      const fails = rs.filter((r) => !['win', 'stop', 'timeout'].includes(r.over)).length;
      return { win: pc(win, rs.length), d20: at(20), d50: at(50), early, fails: pc(fails, rs.length), acc: (rs.reduce((n, r) => n + r.accidents, 0) / rs.length).toFixed(1) };
    };
    const a = score(runs('normal')); const z = score(runs('zealot'));
    console.log(`\n■ 열혈 신자 비교 (유형마다 ${N}판): 정석 20일째 신도 ${a.d20} · 50일째 ${a.d50} · 5~40일 평균 ${a.early} · 끝까지 성공 ${a.win}% · 중간 실패 ${a.fails}% · 사고 ${a.acc}회/판`);
    console.log(`  ${''.padEnd(22)}열혈 20일째 신도 ${z.d20} · 50일째 ${z.d50} · 5~40일 평균 ${z.early} · 끝까지 성공 ${z.win}% · 중간 실패 ${z.fails}% · 사고 ${z.acc}회/판`);
    if (!(z.early > a.early)) fail('열혈 봇이 정석보다 빨리 모으지 못한다');
    if (!(z.fails > a.fails)) fail('열혈 봇이 정석보다 더 자주 실패하지 않는다');
  }
  // 라이벌 혼자 크는가: 플레이어가 라이벌에 아무 대응도 안 하는 봇
  const alone = ['doomsday', 'meditation', 'shaman'].map((sect) => playGame(sect, 777, 'ignoreRival'));
  console.log(`\n■ 라이벌에 대응 안 하는 봇 (라이벌 규모, 등장부터 하루마다): `);
  for (const r of alone) console.log(`    ${r.rivalSect ?? '-'}: ${r.rivalLog.join(' ')}`);
  for (const r of alone) if (!r.rivalLog.length || r.rivalLog.at(-1) < r.rivalLog[0] * 1.5) fail(`라이벌이 혼자서는 신도를 못 모은다 (${r.rivalLog[0]} → ${r.rivalLog.at(-1)})`);
  const reckless = SECT_ORDER.map((sect) => playGame(sect, 4242, 'reckless', 45));
  console.log(`\n■ 교단 얘기만 하는 봇: ${reckless.map((r) => `${r.over}@${r.days}일`).join(' · ')}`);
  if (reckless.filter((r) => r.phase1Day).length > 1) fail('교단 얘기만 해도 1단계를 넘긴다 (의심 장치가 약하다)');
}

console.log(problems ? `\n✗ 문제 ${problems}개` : '\n✓ 문제 없음');
process.exitCode = problems ? 1 : 0;
