// 하루의 시작과 끝, 주보(한 주 결산), 목표·실패 판정
import { dueLater, endToday, checkQuests, newToday } from './quests.js';
import { isOpeningDay } from './opening.js';
import { OPENING as OPENING_TEXT } from '../data/opening.js';
import { dailyZealots } from './zealots.js';
import { dailyDrama } from './drama.js';
import { CLOCK, TALK, STAGES, SANCTUARY, GOAL, RUMOR, WEATHER, PHASE2, PHASE3, PHASE4, OFFICERS, REPORTER, CALENDAR, SECT_FX } from '../config.js';
import { RESIDENT_BY_ID, districtOf } from '../data/residents.js';
import { CLERGY } from '../data/clergy.js';
import { SECTS } from '../data/sects.js';
import { BULLETIN, SHADOW } from '../data/bulletin.js';
import { rand, pick } from './rng.js';
import { clamp, tone } from './leader.js';
import { isSunday, isRentDay, isWorshipDay, fmtDate, month, season, holidayOf } from './clock.js';
import { morningNeeds, placeAllAtHome } from './residents.js';
import { decideAttendance, payRent } from './sanctuary.js';
import { dailyRumor } from './rumor.js';
import { checkLeave, memberCount, namedMembers, activeCast, relationsOf } from './faith.js';
import { rollEvent } from './events.js';
import { dailyRooms, weeklyRooms, followerBonus } from './space.js';
import { dailyOfficers, initOfficers, activeOfficers } from './officers.js';
import { dueRevelation, weeklyRules } from './revelation.js';
import { newWeek } from './state.js';
import { dailyThreats, morningThreats, addDefectors, inspect } from './threats.js';
import { rivalDaily, rivalWeekly, rivalMajority, rivalResolved } from './rival.js';
import { DEFECTOR_TEXT } from '../data/threats.js';
import { dailyBranch } from './branch.js';
import { branchCount } from './faith.js';

export function startDay(s, g) {
  s.minute = CLOCK.dayStart;
  s.mode = 'day';
  s.leader.fatigue = Math.round((s.leader.nightFatigue ?? 0) * 0.5);
  s.leader.nightFatigue = 0;
  morningNeeds(s);
  newToday(s);
  // 날씨: 달마다 비 확률·기온 (장마철엔 자주 온다). 영하 근처면 눈
  const mi = month(s.day) - 1;
  const rain = rand(s) < CALENDAR.rain[mi];
  const tempDelta = Math.round((rand(s) * 2 - 1) * 3);
  s.weather = { rain, snow: rain && CALENDAR.temp[mi] + tempDelta <= 1, cloudy: !rain && rand(s) < CALENDAR.cloudy, tempDelta, market: (s.day % 7) === WEATHER.marketWeekday };
  if (s.weather.rain) for (const r of Object.values(s.res)) r.needs.lonely = Math.min(100, r.needs.lonely + WEATHER.rainLonely);
  // 계절·행사가 고민을 조금씩 움직인다 (신림동은 늘, 봉천동은 4단계부터)
  const push = { ...(CALENDAR.seasonNeeds[season(s.day)] ?? {}) };
  const hol = holidayOf(s.day);
  for (const [k, v] of Object.entries(hol?.needs ?? {})) push[k] = (push[k] ?? 0) + v;
  for (const [id, r] of Object.entries(s.res)) {
    if (id.startsWith('b_') && s.phase < 4) continue;
    for (const [k, v] of Object.entries(push)) r.needs[k] = Math.min(100, r.needs[k] + v);
  }
  decideAttendance(s);
  morningThreats(s);
  if (g) placeAllAtHome(s, g);
}

// 대가가 돌아오는 날 (그림자 장부)
function dueShadows(s) {
  const out = [];
  const keep = [];
  for (const sh of s.shadow) {
    if (sh.due > s.day) { keep.push(sh); continue; }
    if (sh.kind === 'doubleBasket') for (const id of sh.ids) s.res[id].sus = clamp(s.res[id].sus + 12);
    if (sh.kind === 'inflate') { s.rep = clamp(s.rep - 10); s.res.tong.sus = clamp(s.res.tong.sus + 15); }
    if (sh.kind === 'borrow' && s.res[sh.id]) { s.res[sh.id].like = clamp(s.res[sh.id].like - 25); s.res[sh.id].sus = clamp(s.res[sh.id].sus + 25); }
    if (sh.kind === 'fast') {
      for (const id of sh.ids) s.res[id].needs.health = clamp(s.res[id].needs.health + 15);
      s.res.pharmacist.sus = clamp(s.res.pharmacist.sus + 10);
    }
    applyLateShadow(s, sh);
    const name = sh.name ?? (sh.id ? RESIDENT_BY_ID[sh.id]?.name : '');
    const text = (sh.text ?? SHADOW[sh.kind]?.later ?? '').replaceAll('{이름}', name ?? '').replaceAll('{가족}', sh.relative ? RESIDENT_BY_ID[sh.relative].name : '가족');
    s.week.shadow.push({ kind: sh.kind, text });
    out.push({ type: 'shadow', kind: sh.kind, text });
  }
  s.shadow = keep;
  return out;
}

// 2단계·사건에서 생긴 대가
function applyLateShadow(s, sh) {
  const members = Object.values(s.res).filter((r) => r.stage === 'member');
  switch (sh.kind) {
    case 'distance': s.rep = clamp(s.rep - 6); s.res.tong.sus = clamp(s.res.tong.sus + 8); break;
    case 'fine': s.leader.money -= 100_000; break;
    case 'expose': s.rep = clamp(s.rep + OFFICERS.exposeRep); for (const r of members) r.sus = clamp(r.sus + OFFICERS.exposeSus); break;
    case 'room_counsel': s.rep = clamp(s.rep - 4); for (const r of members) r.sus = clamp(r.sus + 8); break;
    case 'room_dorm': s.rep = clamp(s.rep - 8); s.landlordAnger += 15; break;
    case 'room_broadcast': s.rep = clamp(s.rep - 10); break;
    case 'room_office': for (const o of s.officers) if (!o.left) o.discontent = clamp(o.discontent + 15); break;
    case 'agenda_envelope': for (const r of members) r.sus = clamp(r.sus + 6); break;
    case 'agenda_visit': s.rep = clamp(s.rep - 6); s.landlordAnger += 10; break;
    case 'sign_volunteer': s.rep = clamp(s.rep - 6); break;
    case 'rule_communal': case 'rule_pledge': case 'rule_interview': s.rep = clamp(s.rep - 5); for (const r of members) r.sus = clamp(r.sus + 4); break;
    case 'adminLater': sh.text = inspect(s, true); break;
    case 'hush': s.rep = clamp(s.rep - 8); s.exposure = clamp(s.exposure + 10); if (s.defectors[sh.id]) s.defectors[sh.id].hushed = false; if (s.reporter.active) s.reporter.heat += 6; break;
    case 'spin': s.rep = clamp(s.rep - 8); s.exposure = clamp(s.exposure + 8); break;
    case 'branch_visit': s.repB = clamp(s.repB - 8); break;
    case 'rumor': s.rep = clamp(s.rep - 6); if (s.rival && s.rival.status === 'active') s.rival.status = 'enemy'; break;
    default: break;
  }
}

function castDrift(s) {
  const out = [];
  const b = s.leader.belief;
  const d = b <= -60 ? 3 : b >= 60 ? 2 : -1;
  for (const [id, c] of Object.entries(s.cast)) {
    if (!c.active || s.phase >= 2) continue;
    c.sus = clamp(c.sus + d);
    if (c.sus >= STAGES.leaveSuspicion) { c.active = false; out.push({ type: 'castLeft', id }); s.week.left.push(`cast:${id}`); }
  }
  return out;
}

function weeklyFollowers(s) {
  let gained = 0;
  for (const id of namedMembers(s)) {
    const have = s.followerOf[id] ?? 0;
    const F = s.phase >= 4 ? PHASE4.followers : s.phase >= 3 ? PHASE3.followers : STAGES.phase2Followers;
    const cap = s.phase >= 2 ? F.cap + (s.phase === 2 ? SECT_FX[s.leader.sect].p2Cap ?? 0 : 0) : STAGES.followerCapPerMember;   // p2Cap: 2단계 유형 보정
    const chance = (s.phase >= 2 ? F.chance * (s.phase >= 3 ? PHASE3.sectFx[s.leader.sect]?.followers ?? 1 : 1) : STAGES.followersPerMemberWeek * (SECT_FX[s.leader.sect].p1Followers ?? 1)) + followerBonus(s);
    if (have < cap && rand(s) < chance) {
      s.followerOf[id] = have + 1; gained++;
      if (districtOf(id) === 'bongcheon') s.branch.followers++; else s.followers++;
    }
  }
  if (s.rep < 30 && s.followers > 0) s.followers = Math.max(0, s.followers - Math.ceil(s.followers * 0.1));
  s.week.followers = gained;
}

// 밤 '잠자기'. opts.rentChoice: 돈이 모자란 월말에 'promise' | 'borrow'
export function endDay(s, g, opts = {}) {
  const events = [];
  // 예배 날인데 예배를 안 열었으면 온 사람들이 실망한다
  if (isWorshipDay(s.day) && s.sanctuary.worshipDay !== s.day) {
    for (const id of s.attend) s.res[id].like = clamp(s.res[id].like - 4);
  }
  events.push(...dueShadows(s));
  events.push(...dueLater(s));
  events.push(...dailyZealots(s));
  events.push(...dailyDrama(s));
  endToday(s);
  events.push(...dailyRumor(s));
  for (const st of Object.values(s.res)) {
    st.sus = clamp(st.sus - TALK.suspicionDecay);
    if (st.talked !== s.day && (st.stage === 'none' || st.stage === 'curious')) st.like = clamp(st.like - TALK.likeDecay);
  }
  const leftIds = checkLeave(s);
  for (const id of leftIds) events.push({ type: 'left', id });
  events.push(...castDrift(s));
  if (s.phase >= 2) {
    events.push(...dailyRooms(s));
    const off = dailyOfficers(s, s.flags.darkToday ?? 0);
    events.push(...off);
    leftIds.push(...off.filter((e) => e.type === 'officerLeft').map((e) => e.oid));
  }
  if (s.phase >= 3) {
    events.push(...addDefectors(s, leftIds));
    events.push(...dailyThreats(s, g));
    events.push(...rivalDaily(s));
  }
  if (s.phase >= 4) {
    const b = dailyBranch(s);
    events.push(...b.events);
    if (b.split) s.flags.branchSplit = true;
    s.repLogB = [...s.repLogB, Math.round(s.repB)].slice(-7);
  }
  s.flags.darkToday = 0;
  if (s.flags.quietSign) for (const st of Object.values(s.res)) st.sus = clamp(st.sus - 1);

  let bulletin = null;
  if (isRentDay(s.day)) {
    const r = payRent(s, opts.rentChoice);
    events.push({ type: 'rent', ...r });
  }
  if (isOpeningDay(s)) {
    // 개업 첫날 주보 0호 (호수는 늘리지 않는다. 한 주 결산은 일요일에 그대로)
    bulletin = makeBulletin(s);
    s.bulletinNo--;
    Object.assign(bulletin, { no: 0, opening: true, town: [...OPENING_TEXT.bulletin.town, ...bulletin.town.slice(-1)], notice: OPENING_TEXT.bulletin.notice });
  }
  if (isSunday(s.day)) {
    // 주간 지출: 전단 인쇄 · 보리차 · 전기료 (공간이 넓을수록 더)
    const W = SANCTUARY.weekly;
    const cost = W.flyers + W.tea + W.utilities + W.perStep * s.space.step + (s.branch?.open ? W.perStep : 0);
    s.leader.money -= cost;
    s.week.costs = cost;
    events.push({ type: 'weekly', text: `이번 주 지출: 전단 인쇄 · 보리차 · 전기료 ${cost.toLocaleString('ko-KR')}원.` });
    weeklyFollowers(s);
    if (s.phase >= 3) events.push(...rivalWeekly(s));
    weeklyRooms(s, relationsOf);
    weeklyRules(s, relationsOf);
    bulletin = makeBulletin(s);
    s.week = newWeek();
    s.week.repStart = s.rep;
  }
  checkQuests(s);                       // 끝낸 퀘스트는 s.quest.news 로 (화면이 아침에 꺼내 보여 준다)
  s.over = checkOver(s);
  let phaseUp = false;
  if (s.over === 'phase1') { s.over = null; s.phase = 2; initOfficers(s); phaseUp = 2; }
  if (s.over === 'phase2') { s.over = null; s.phase = 3; s.phase3Day = s.day; phaseUp = 3; }
  if (s.over === 'phase3') { s.over = null; s.phase = 4; s.phase4Day = s.day; s.repB = RUMOR.start; s.reporter.reports = 0; phaseUp = 4; }   // 보도 누적은 4단계에서 새로 센다
  const revelation = s.over ? null : dueRevelation(s);
  let event = null;
  if (!s.over) {
    s.day++;
    startDay(s, g);
    event = rollEvent(s);
  } else {
    s.mode = 'over';
  }
  return { events, bulletin, over: s.over, phaseUp, revelation, event };
}

export function checkOver(s) {
  if (s.sanctuary.arrears >= SANCTUARY.maxArrears) return 'evicted';
  if (s.rep <= RUMOR.silentAt) return 'silent';
  if (memberCount(s) === 0) return 'empty';
  if (s.phase === 1) {
    if (memberCount(s) >= GOAL.members && s.sanctuary.rentStreak >= GOAL.rentStreak) return 'phase1';
    return null;
  }
  if (s.landlordAnger >= PHASE2.landlordAngerMax) return 'notice';
  if (s.officersAppointed >= 3 && s.officersLeft * 2 > s.officersAppointed) return 'officers';
  if (s.phase === 2) {
    if (memberCount(s) >= PHASE2.members && s.space.step >= PHASE2.minSpaceStep && activeOfficers(s).length >= PHASE2.minOfficers && s.sanctuary.rentStreak >= PHASE2.rentStreak) return 'phase2';
    return null;
  }
  if (rivalMajority(s, PHASE3.rivalMajority)) return 'rival';
  if (s.rep <= REPORTER.pressFail.rep && s.reporter.reports >= REPORTER.pressFail.reports + (s.phase >= 4 ? 1 : 0)) return 'press';   // 4단계는 보도 세 번부터
  if (s.phase === 3) {
    const floor7 = s.repLog.length >= 7 ? Math.min(...s.repLog) : 0;
    if (memberCount(s) >= PHASE3.members && s.rep >= PHASE3.rep && floor7 >= PHASE3.repFloor7 && rivalResolved(s) && s.sanctuary.rentStreak >= PHASE3.rentStreak) return 'phase3';
    return null;
  }
  // 4단계
  if (s.flags.branchSplit) return 'split';
  if (s.repB <= RUMOR.silentAt) return 'silentB';
  if (memberCount(s) >= PHASE4.members && branchCount(s) >= PHASE4.branch && s.rep >= PHASE4.rep && s.repB >= PHASE4.rep && s.sanctuary.rentStreak >= PHASE4.rentStreak) return 'win';
  return null;
}

// 주보 데이터 (문장 조립은 ui/bulletin.js 가 한다. 여기선 무엇을 실을지만 정한다)
function makeBulletin(s) {
  s.bulletinNo++;
  const w = s.week;
  const sect = SECTS[s.leader.sect];
  const town = [];
  for (const c of w.clergy) town.push(c.line);
  for (const sh of w.shadow) if (sh.text) town.push(sh.text);
  for (const r of w.reports ?? []) town.push(`이번 주 ${r}`);
  for (const d of (s.drama?.log ?? []).filter((x) => s.day - x.day < 7).slice(0, 2)) town.push(`동네 소식: ${d.text}`);   // 주민끼리의 일 (24장 D-4)
  if (w.bigSermon) town.push('이번 주 설교 때 앞줄에서 손수건이 나왔다. 1면감.');
  if (w.shadow.some((x) => x.kind === 'doomsday')) town.push('doomsday');
  // 기성 종교의 생활 소식 한 줄 (돌아가며)
  const c = CLERGY[(s.bulletinNo - 1) % CLERGY.length];
  town.push(c.bulletin);
  return {
    no: s.bulletinNo,
    date: fmtDate(s.day),
    cultName: s.leader.cultName,
    terms: sect.terms,
    worships: w.worships,
    newcomers: w.newcomers.map((id) => RESIDENT_BY_ID[id].name),
    members: w.members.map((id) => RESIDENT_BY_ID[id].name),
    left: w.left.map((id) => (id.startsWith('cast:') ? id : RESIDENT_BY_ID[id].name)),
    followers: w.followers,
    offering: w.offering,
    rent: w.rent,
    talks: w.talks,
    town,
    leaderWord: pick(s, BULLETIN.leaderWords[tone(s)]),
    notice: pick(s, BULLETIN.notices),
    stats: {
      members: memberCount(s), named: namedMembers(s).length, cast: activeCast(s).length, followers: s.followers,
      rep: Math.round(s.rep), repDelta: Math.round(s.rep - (w.repStart ?? s.rep)), money: s.leader.money,
      rentStreak: s.sanctuary.rentStreak, arrears: s.sanctuary.arrears,
    },
  };
}
