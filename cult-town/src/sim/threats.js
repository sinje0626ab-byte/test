// 3단계 '바깥의 위협': 노출 · 기자 · 신도 가족 시위 · 탈퇴자 · 기성 종교 공개 대응 · 행정.
// 위협은 동네 맵의 사람(x:reporter, 시위하는 가족, 탈퇴자)과 물건(현수막·안내문)으로 보인다. 화면과 노드 봇이 같은 함수를 쓴다.
// 위치는 일과(targetKey)로 본다 → 화면에서 실제로 걷는 자리와 같다.
import { tune } from './goals.js';
import { exposureCut } from './growth.js';
import { EXPOSURE, REPORTER, PROTEST, DEFECTOR, NOTICE, ADMIN, PHASE3, PHASE4, SIGN } from '../config.js';
import { RESIDENTS, RESIDENTS_B, ALL_RESIDENTS, RESIDENT_BY_ID } from '../data/residents.js';
import { CLERGY, CLERGY_B } from '../data/clergy.js';
import { districtOfPlace } from '../data/places.js';
import { REPORTER_INFO, INTERVIEW, REPORT, PROTEST_TEXT, DEFECTOR_TEXT, NOTICE_TEXT, ADMIN_TEXT } from '../data/threats.js';
import { rand, pick } from './rng.js';
import { clamp, addMoney, addFatigue, shiftBelief, josaFix } from './leader.js';
import { relationsOf, setStage, namedMembers, memberCount } from './faith.js';
import { targetKey, gridFor } from './residents.js';
import { resolveKey, gridOf } from './grid.js';
import { roomPower } from './space.js';
import { activeOfficers, officerById } from './officers.js';
import { isWeekend } from './clock.js';
import { rivalHour } from './rival.js';

const fill = (t, o) => josaFix(Object.entries(o).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), t));
const nameOf = (id) => RESIDENT_BY_ID[id]?.name ?? id;

const place = (key) => key.split(':')[0];
const outside = (g, key) => !resolveKey(g, key).inside;
// 그 시각 바깥에 있는 주민들의 자리
function outdoorAt(s, g, minute) {
  const out = [];
  for (const r of s.phase >= 4 ? ALL_RESIDENTS : RESIDENTS) {
    const key = targetKey(s, g, r.id, minute);
    if (outside(gridFor(r.id, g), key)) out.push({ id: r.id, key });
  }
  return out;
}

// ── 노출 ──
export function dailyExposure(s) {
  if (s.phase < 3) return;
  const sore = soreDefectors(s).length;
  const recentDark = s.darkLog.filter((d) => s.day - d < EXPOSURE.darkDays).length;
  let target = -exposureCut(s) + EXPOSURE.base + Math.max(0, 60 - s.rep) * EXPOSURE.repWeight + Math.min(memberCount(s), s.phase >= 4 ? 150 : Infinity) * EXPOSURE.perMember
    + roomPower(s, 'dorm') * EXPOSURE.dorm + roomPower(s, 'broadcast') * EXPOSURE.broadcast + (s.sanctuary.sign ?? 0) * SIGN.exposure
    + sore * EXPOSURE.defector + recentDark * EXPOSURE.dark
    + (s.meeting?.big && s.day - s.meeting.day < 3 ? EXPOSURE.meeting : 0)
    + (s.flags.rivalExposeUntil >= s.day ? EXPOSURE.rivalExpose : 0)
    + (s.flags.reportCalmUntil >= s.day ? EXPOSURE.report : 0);
  if (s.revelations.camera?.includes('open')) target -= 5;
  s.exposure = clamp(s.exposure + (clamp(target) - s.exposure) * EXPOSURE.follow);
  if (s.flags.darkToday) for (let i = 0; i < s.flags.darkToday; i++) s.darkLog.push(s.day);
  s.darkLog = s.darkLog.filter((d) => s.day - d < EXPOSURE.darkDays);
}
export const exposureWord = (s) => (s.exposure >= 60 ? '동네 밖에서도 302호 얘기를 한다' : s.exposure >= REPORTER.appearAt ? '바깥에서 302호를 궁금해한다' : s.exposure >= 20 ? '아는 사람만 안다' : '조용하다');

// ── 기자 ──
export const reporterHere = (s) => s.reporter.active && s.day >= s.reporter.since && s.day <= s.reporter.leaveDay;
// 기자가 다음에 찾아갈 사람 (머리 위 '취재' 표시)
export function reporterTarget(s) { return reporterHere(s) ? s.reporter.next ?? null : null; }
function pickNext(s, g, hour) {
  const R = s.reporter;
  R.next = null;
  if (hour + 1 >= REPORTER.endHour) return;
  const at = targetKey(s, g, 'x:reporter', (hour + 1) * 60);
  const near = outdoorAt(s, g, (hour + 1) * 60).filter((x) => place(x.key) === place(at) && !R.met[`${s.day}:${x.id}`]);
  if (near.length) R.next = pick(s, near).id;
}

// 한 시간마다: 기자가 그 자리 근처 주민 한 명에게 묻는다
export function reporterHour(s, g, hour) {
  const R = s.reporter;
  if (!reporterHere(s)) return null;
  if (hour === REPORTER.startHour - 1) { pickNext(s, g, hour); return null; }
  if (hour < REPORTER.startHour || hour >= REPORTER.endHour) return null;
  const at = targetKey(s, g, 'x:reporter', hour * 60);
  const near = outdoorAt(s, g, hour * 60).filter((x) => place(x.key) === place(at) && !R.met[`${s.day}:${x.id}`]);
  if (!near.length) { pickNext(s, g, hour); return null; }
  const { id } = near.find((x) => x.id === R.next) ?? pick(s, near);
  R.met[`${s.day}:${id}`] = true;
  const st = s.res[id];
  const calmed = st.talked === s.day;                  // 오늘 교주가 먼저 얘기한 사람은 조심해서 말한다
  const silent = s.revelations.camera?.includes('silent') ? 0.5 : 1;
  let add = REPORTER.heat.resident + st.sus * REPORTER.heat.sus;
  let kind = 'resident';
  if (st.stage === 'member' || st.stage === 'newcomer') { kind = 'member'; add = calmed ? REPORTER.heat.calmed : REPORTER.heat.member * silent; }
  if (s.defectors[id] && !s.defectors[id].done) { kind = 'defector'; add = calmed || s.defectors[id].hushed ? REPORTER.heat.calmed : REPORTER.heat.defector * silent; }
  R.heat += add;
  R.talks++;
  R.lastQ = { id, minute: hour * 60, q: Math.floor(rand(s) * REPORTER_INFO.questions.length), a: Math.floor(rand(s) * REPORTER_INFO.answers.length), kind };
  pickNext(s, g, hour);
  return R.lastQ;
}

export function interviewOptions(s) {
  const opts = ['face', 'nocomment'];
  if (activeOfficers(s).length) opts.push('officer');
  opts.push('evade');
  return opts;
}
// 인터뷰 결과. officerId: 'officer' 일 때 내보낼 간부
export function interview(s, choice, officerId) {
  const R = s.reporter;
  const F = REPORTER.face;
  let text = '';
  if (choice === 'evade') { R.evadedAt = s.minute; R.chase = false; return { text: INTERVIEW.evade, tone: '' }; }
  if (choice === 'face') {
    const good = rand(s) < F.winBase + s.rep / F.repDiv;
    R.heat = Math.max(0, R.heat + (good ? F.win : F.lose));
    addFatigue(s, F.fatigue);
    text = good ? INTERVIEW.faceGood : INTERVIEW.faceBad;
    R.interviewed = good ? 'faceGood' : 'faceBad';
  } else if (choice === 'nocomment') {
    R.heat += REPORTER.noComment;
    text = INTERVIEW.nocomment;
    R.interviewed = 'nocomment';
  } else if (choice === 'officer') {
    const o = officerById(s, officerId) ?? activeOfficers(s).sort((a, b) => b.talk - a.talk)[0];
    const d = REPORTER.officer.base + o.talk * REPORTER.officer.perTalk + (['blunt', 'hot'].includes(o.trait) ? 6 : 0);
    R.heat = Math.max(0, R.heat + d);
    o.discontent = clamp(o.discontent + REPORTER.officer.disc);
    text = fill(d <= 0 ? INTERVIEW.officerGood : INTERVIEW.officerBad, { 이름: o.name });
    R.interviewed = 'officer';
  }
  R.chase = false;
  R.leaveDay = Math.min(R.leaveDay, s.day + 1);      // 인터뷰를 따면 다음 날 떠난다
  return { text, tone: choice === 'face' && R.interviewed === 'faceGood' ? 'good' : '' };
}

function reporterDaily(s, events) {
  const R = s.reporter;
  // 보도
  if (R.due && R.due.day <= s.day) {
    events.push(...publishReport(s, R.due.heat));
    R.due = null;
  }
  if (R.active) {
    if (s.day >= R.since && !R.interviewed) R.heat += REPORTER.evadeDay;
    if (s.day >= R.leaveDay) {
      R.active = false;
      R.chase = false;
      R.due = { day: s.day + REPORTER.reportAfter, heat: R.heat };
      R.cooldownUntil = s.day + REPORTER.reportAfter + REPORTER.cooldown;
      events.push({ type: 'reporter', text: REPORTER_INFO.left });
    }
    return;
  }
  if (s.exposure >= REPORTER.appearAt && s.day >= R.cooldownUntil && !R.due) {
    Object.assign(R, { active: true, since: s.day + 1, leaveDay: s.day + REPORTER.stayDays, heat: s.meeting?.big ? REPORTER.heat.meetingLink : 0, interviewed: null, met: {}, chase: false, talks: 0, lastQ: null, evadedAt: -999 });
    events.push({ type: 'reporter', text: REPORTER_INFO.appear });
  }
}

function publishReport(s, heatIn) {
  const C = REPORTER.report;
  let heat = heatIn * ((s.phase >= 4 ? PHASE4.sectFx : PHASE3.sectFx)[s.leader.sect]?.heat ?? 1) * tune(s, 'heat');   // 유형별 보정은 단계마다 따로 · 난이도 (28장)
  if (s.revelations.camera?.includes('open')) heat *= 0.8;
  if (s.revelations.camera?.includes('spin')) heat *= 0.6;
  const level = heat >= C.high ? 'high' : heat >= C.low ? 'mid' : 'low';
  const r = REPORT[level];
  s.rep = clamp(s.rep - (heat / C.rep + C.repBase));
  for (const id of namedMembers(s)) s.res[id].sus = clamp(s.res[id].sus + heat / C.sus);
  for (const rr of RESIDENTS) if (s.res[rr.id].stage === 'none') s.res[rr.id].sus = clamp(s.res[rr.id].sus + heat / (C.sus * 2));
  const lost = Math.round(s.followers * (heat / C.followers) / 100 * (s.phase >= 4 ? 0.5 : 1));   // 4단계는 기사가 두 동네로 나뉘어 덜 퍼진다
  s.followers = Math.max(0, s.followers - lost);
  s.reporter.reports++;
  s.flags.reportCalmUntil = s.day + 4;
  if (level !== 'low') s.admin.complaints += 6;
  s.week.reports = [...(s.week.reports ?? []), r.headline];
  return [{ type: 'report', level, text: `${r.headline}. ${r.body}${lost ? ` 따라온 사람 ${lost}명이 발길을 끊었다.` : ''}` }];
}

// ── 신도 가족 시위 ──
export const protestToday = (s) => (s.protest && s.protest.day === s.day && !s.protest.resolved ? s.protest : null);
export const isProtester = (s, id) => protestToday(s)?.id === id;

function protestDaily(s, g, events) {
  const P = s.protest;
  if (P && !P.done && P.day === s.day) {
    if (!P.resolved) {
      const bong = RESIDENT_BY_ID[P.id].district === 'bongcheon';      // 봉천동 가족은 지부 앞에서
      if (bong) s.repB = clamp(s.repB + PROTEST.rep); else s.rep = clamp(s.rep + PROTEST.rep);
      s.landlordAnger += PROTEST.anger;
      s.admin.complaints += 5;
      const pg = gridFor(P.id, g);
      const door = resolveKey(pg, bong ? 'b_branch:door' : 'sanctuary:door').tile;
      for (const r of bong ? RESIDENTS_B : RESIDENTS) {
        if (r.id === P.id || s.res[r.id].stage === 'member') continue;
        const seen = [10, 13, 16].some((h) => { const t = resolveKey(pg, targetKey(s, g, r.id, h * 60)).tile; return Math.abs(t[0] - door[0]) + Math.abs(t[1] - door[1]) <= 8; });
        if (seen) s.res[r.id].sus = clamp(s.res[r.id].sus + PROTEST.passSus);
      }
      s.flags.protestIgnored = (s.flags.protestIgnored ?? 0) + 1;
      if (s.flags.protestIgnored >= 2) { s.admin.patrolUntil = s.day + ADMIN.patrolDays; s.flags.protestIgnored = 0; events.push({ type: 'patrol', text: ADMIN_TEXT.patrol }); }
      // 그냥 두면 다음 날 또 나온다 (반쯤)
      if (rand(s) < 0.5) {
        P.day = s.day + 1;
        events.push({ type: 'protest', text: fill(PROTEST_TEXT.start, { 이름: nameOf(P.id), 신도이름: nameOf(P.member) }) });
        return;
      }
    }
    s.protest = { done: true, last: s.day };
    return;
  }
  if (s.protest && !s.protest.done) return;
  if (s.day - (s.protest?.last ?? -99) < PROTEST.cooldown) return;
  const trigger = roomPower(s, 'dorm') > 0 || s.sanctuary.worshipDay === s.day;   // 숙소가 있거나 오늘 저녁 예배가 늦게 끝났다
  if (!trigger) return;
  const pairs = [];
  for (const id of namedMembers(s)) for (const x of relationsOf(id)) if (x.kind === 'family' && s.res[x.id].stage !== 'member' && s.res[x.id].sus >= PROTEST.relativeSus && !s.defectors[x.id]) pairs.push({ member: id, id: x.id });
  if (!pairs.length || rand(s) >= PROTEST.chance) return;
  const p = pick(s, pairs);
  s.protest = { day: s.day + 1, id: p.id, member: p.member, resolved: false, sign: Math.floor(rand(s) * PROTEST_TEXT.signs.length) };
  events.push({ type: 'protest', text: fill(PROTEST_TEXT.start, { 이름: nameOf(p.id), 신도이름: nameOf(p.member) }) });
}

export function protestOptions(s) {
  const o = ['meet', 'ignore'];
  if (activeOfficers(s).length) o.push('officer');
  return o;
}
export function answerProtest(s, choice) {
  const P = protestToday(s);
  if (!P) return null;
  const v = { 이름: nameOf(P.id), 신도이름: nameOf(P.member) };
  if (choice === 'meet') {
    P.resolved = true;
    const m = s.res[P.member];
    if (m.stage === 'member') { setStage(s, P.member, 'newcomer'); m.like = clamp(m.like - 10); }
    s.res[P.id].sus = clamp(s.res[P.id].sus + PROTEST.meetSus);
    s.rep = clamp(s.rep + 2);
    addFatigue(s, 15);
    return { text: fill(PROTEST_TEXT.meet, v), tone: 'good' };
  }
  if (choice === 'officer') {
    const o = activeOfficers(s).sort((a, b) => b.manage - a.manage)[0];
    v.간부 = o.name;
    if (o.manage >= PROTEST.officerManage) {
      P.resolved = true; s.res[P.id].sus = clamp(s.res[P.id].sus - 5);
      return { text: fill(PROTEST_TEXT.officerGood, v), tone: 'good' };
    }
    s.res[P.id].sus = clamp(s.res[P.id].sus + 10); s.rep = clamp(s.rep - 4); s.landlordAnger += 6; o.discontent = clamp(o.discontent + 4);
    return { text: fill(PROTEST_TEXT.officerBad, v), tone: 'bad' };
  }
  return { text: PROTEST_TEXT.ignore, tone: '' };
}

// ── 탈퇴자 ──
export const soreDefectors = (s) => Object.keys(s.defectors).filter((id) => !s.defectors[id].done && !s.defectors[id].hushed);
export const isDefector = (s, id) => !!s.defectors[id] && !s.defectors[id].done;

export function addDefectors(s, ids) {
  if (s.phase < 3) return [];
  const out = [];
  for (const id of ids) {
    if (!RESIDENT_BY_ID[id] || s.defectors[id]) continue;
    s.defectors[id] = { since: s.day, gossip: 0, done: false, hushed: false };
    out.push({ type: 'defector', id, text: fill(DEFECTOR_TEXT.became, { 이름: nameOf(id) }) });
  }
  return out;
}

// 한 시간마다: 탈퇴자가 같은 자리 주민에게 우리 얘기를 한다 (말풍선, 듣는 주민 의심↑)
export function defectorHour(s, g, hour) {
  const out = [];
  if (hour < 9 || hour >= 19) return out;
  const people = outdoorAt(s, g, hour * 60);
  for (const id of soreDefectors(s)) {
    const d = s.defectors[id];
    if ((d.gossipDay === s.day ? d.gossip : 0) >= DEFECTOR.gossipPerDay) continue;
    const me = people.find((x) => x.id === id);
    if (!me) continue;
    const others = people.filter((x) => x.id !== id && place(x.key) === place(me.key) && s.res[x.id].stage !== 'member' && !isDefector(s, x.id));
    if (!others.length) continue;
    const to = pick(s, others).id;
    s.res[to].sus = clamp(s.res[to].sus + DEFECTOR.gossipSus);
    if (d.gossipDay !== s.day) { d.gossipDay = s.day; d.gossip = 0; }
    d.gossip++;
    out.push({ id, to, line: pick(s, DEFECTOR_TEXT.gossip) });
  }
  if (out.length) s.defectorTalk = { ...out[0], minute: hour * 60 };
  return out;
}

// 주말 오후 탈퇴자 모임 (2명 이상). 3명 이상이면 기자와 연결된다
function meetingDaily(s, events) {
  const sore = soreDefectors(s);
  // 오늘이 모임 날이었다면 결과
  if (s.meeting?.day === s.day) {
    const n = s.meeting.ids.length;
    events.push({ type: 'meeting', text: fill(DEFECTOR_TEXT.meeting, { n }) });
    if (n >= DEFECTOR.bigMeeting) {
      s.meeting.big = true;
      if (s.reporter.active) s.reporter.heat += REPORTER.heat.meetingLink;
      s.admin.complaints += 4;
      events.push({ type: 'meeting', text: DEFECTOR_TEXT.bigMeeting });
    }
  }
  // 내일이 토요일이면 모임을 잡는다
  const tomorrow = s.day + 1;
  if (isWeekend(tomorrow) && tomorrow % 7 === 5 && sore.length >= DEFECTOR.meetingAt) s.meeting = { day: tomorrow, ids: sore.slice(0, 5), big: false };
}
export const inMeeting = (s, id) => s.meeting?.day === s.day && s.meeting.ids.includes(id) && isDefector(s, id) && !s.defectors[id].hushed;

export function defectorOptions(s) {
  return s.leader.money >= DEFECTOR.hushMoney ? ['reconcile', 'avoid', 'hush'] : ['reconcile', 'avoid'];
}
export function answerDefector(s, id, choice) {
  const d = s.defectors[id];
  const st = s.res[id];
  const v = { 이름: nameOf(id) };
  if (choice === 'reconcile') {
    const p = DEFECTOR.reconcileBase + st.like / DEFECTOR.reconcileLike + (st.story?.done ?? 0) * DEFECTOR.reconcileStory;
    addFatigue(s, 12);
    st.talked = s.day;
    if (rand(s) < p) { d.done = true; st.like = clamp(st.like + 10); st.sus = clamp(st.sus - 20); return { text: fill(DEFECTOR_TEXT.reconcileGood, v), tone: 'good' }; }
    st.sus = clamp(st.sus + 5);
    d.tries = (d.tries ?? 0) + 1;
    return { text: fill(DEFECTOR_TEXT.reconcileBad, v), tone: 'bad' };
  }
  if (choice === 'hush') {
    addMoney(s, -DEFECTOR.hushMoney);
    d.hushed = true;
    shiftBelief(s, -6);
    s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
    s.shadow.push({ kind: 'hush', due: s.day + DEFECTOR.hushDue, id });
    return { text: fill(DEFECTOR_TEXT.hush, v), tone: 'bad' };
  }
  return { text: DEFECTOR_TEXT.avoid, tone: '' };
}

// ── 기성 종교의 공개 대응 (세 계열 같은 규칙) ──
// 동네마다 그 동네 성직자가 그 동네 신도 수를 보고 붙인다 (세 계열 같은 규칙)
function noticeDaily(s, events) {
  const sets = [[CLERGY, RESIDENTS, 'sillim'], ...(s.phase >= 4 ? [[CLERGY_B, RESIDENTS_B, 'bongcheon']] : [])];
  for (const [clergy, residents, district] of sets) for (const c of clergy) {
    if (s.notices[c.id] != null) continue;
    const n = namedMembers(s).filter((id) => RESIDENT_BY_ID[id].district === district && c.religions.includes(RESIDENT_BY_ID[id].religion)).length;
    if (n < NOTICE.members) continue;
    s.notices[c.id] = s.day;
    for (const r of residents) if (c.religions.includes(r.religion) && s.res[r.id].stage !== 'member') s.res[r.id].sus = clamp(s.res[r.id].sus + NOTICE.sus);
    events.push({ type: 'notice', id: c.id, text: `${NOTICE_TEXT[c.id].morning} "${NOTICE_TEXT[c.id].text}"` });
    s.week.clergy.push({ id: c.id, line: `${NOTICE_TEXT[c.id].where}: "${NOTICE_TEXT[c.id].text}"` });
  }
}
// 안내문이 붙은 곳 근처(6칸)에서는 포교 호감이 덜 오른다
let townGrid = null;
export const setThreatGrid = (g) => { townGrid = g; };
export function noticeMul(s, key) {
  if (!townGrid || !key || s.phase < 3) return 1;
  const bong = districtOfPlace(key.split(':')[0]) === 'bongcheon';
  const grid = bong ? gridOf('bongcheon') : townGrid;
  if (!grid) return 1;
  let t;
  try { t = resolveKey(grid, key).tile; } catch { return 1; }
  for (const c of bong ? CLERGY_B : CLERGY) {
    if (s.notices[c.id] == null) continue;
    const d = grid.places[c.place].door;
    if (Math.abs(d[0] - t[0]) + Math.abs(d[1] - t[1]) <= NOTICE.nearTiles) return NOTICE.nearMul;
  }
  return 1;
}
export const noticeNear = (s, key) => noticeMul(s, key) < 1;

// ── 행정 ──
function adminDaily(s, events) {
  s.admin.complaints += roomPower(s, 'dorm') + roomPower(s, 'broadcast') * 0.5;
  if (s.events.pending) return;
  if (s.admin.complaints < ADMIN.complaintsAt || s.day - s.admin.last < ADMIN.cooldown) return;
  if (rand(s) >= ADMIN.chance) return;
  s.admin.complaints -= ADMIN.complaintsAt;
  s.admin.last = s.day;
  s.events.pending = { kind: rand(s) < 0.5 ? 'district' : 'firecheck', day: s.day + 1 };
  events.push({ type: 'admin', text: '' });
}
// 점검 결과 (sim/events.js 에서 부른다)
export function inspect(s, later = false) {
  const risky = ['dorm', 'broadcast'].filter((t) => roomPower(s, t) > 0);
  const caught = later || (risky.length && rand(s) < ADMIN.baseRisk + ADMIN.roomRisk);
  if (!caught) return ADMIN_TEXT.passed;
  const fine = ADMIN.fine * (later ? 2 : 1);
  s.leader.money -= fine;
  let roomName = '방';
  if (risky.length) {
    const type = risky[0];
    const slot = Object.keys(s.rooms).find((k) => s.rooms[k].type === type);
    const r = s.rooms[slot];
    roomName = type === 'dorm' ? '숙소' : '방송실';
    if (r.level > 1) r.level--; else delete s.rooms[slot];
  }
  return fill(later ? ADMIN_TEXT.later : ADMIN_TEXT.caught, { 방: roomName, 돈: `${fine.toLocaleString('ko-KR')}원` });
}
export const patrolOn = (s) => s.admin?.patrolUntil >= s.day;

// ── 하루 끝 (endDay 에서 부른다) ──
export function dailyThreats(s, g) {
  const events = [];
  if (s.phase < 3) return events;
  dailyExposure(s);
  reporterDaily(s, events);
  protestDaily(s, g, events);
  meetingDaily(s, events);
  noticeDaily(s, events);
  adminDaily(s, events);
  s.repLog = [...s.repLog, Math.round(s.rep)].slice(-7);
  return events.filter((e) => e.text);
}

// 아침: 시위 날이면 처음 오는 사람이 줄고, 순찰 중이면 예배에 오는 사람이 준다
export function morningThreats(s) {
  if (s.phase < 3) return;
  if (protestToday(s)) s.attend = s.attend.filter((id) => s.res[id].stage !== 'visitor' || rand(s) < PROTEST.visitorAttend);
  if (patrolOn(s)) s.attend = s.attend.filter(() => rand(s) < ADMIN.patrolAttend);
  s.reporter.lastQ = null;
  s.reporter.next = null;
  s.defectorTalk = null;
}


// 한 시간마다 (화면 app.advance · 노드 봇 playDay 가 같이 부른다)
export function threatHour(s, g, hour) {
  if (s.phase < 3) return;
  reporterHour(s, g, hour);
  defectorHour(s, g, hour);
  rivalHour(s, g, hour);
}
