// 하루의 시작과 끝, 주보(한 주 결산), 목표·실패 판정
import { CLOCK, TALK, STAGES, SANCTUARY, GOAL, RUMOR } from '../config.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { CLERGY } from '../data/clergy.js';
import { SECTS } from '../data/sects.js';
import { BULLETIN, SHADOW } from '../data/bulletin.js';
import { rand, pick } from './rng.js';
import { clamp, tone } from './leader.js';
import { isSunday, isMonthEnd, isWorshipDay, fmtDate } from './clock.js';
import { morningNeeds, placeAllAtHome } from './residents.js';
import { decideAttendance, payRent } from './sanctuary.js';
import { dailyRumor } from './rumor.js';
import { checkLeave, memberCount, namedMembers, activeCast } from './faith.js';
import { newWeek } from './state.js';

export function startDay(s, g) {
  s.minute = CLOCK.dayStart;
  s.mode = 'day';
  s.leader.fatigue = Math.round((s.leader.nightFatigue ?? 0) * 0.5);
  s.leader.nightFatigue = 0;
  morningNeeds(s);
  decideAttendance(s);
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
    const name = sh.id ? RESIDENT_BY_ID[sh.id]?.name : '';
    const text = SHADOW[sh.kind].later.replaceAll('{이름}', name ?? '');
    s.week.shadow.push({ kind: sh.kind, text });
    out.push({ type: 'shadow', kind: sh.kind, text });
  }
  s.shadow = keep;
  return out;
}

function castDrift(s) {
  const out = [];
  const b = s.leader.belief;
  const d = b <= -60 ? 3 : b >= 60 ? 2 : -1;
  for (const [id, c] of Object.entries(s.cast)) {
    if (!c.active) continue;
    c.sus = clamp(c.sus + d);
    if (c.sus >= STAGES.leaveSuspicion) { c.active = false; out.push({ type: 'castLeft', id }); s.week.left.push(`cast:${id}`); }
  }
  return out;
}

function weeklyFollowers(s) {
  let gained = 0;
  for (const id of namedMembers(s)) {
    const have = s.followerOf[id] ?? 0;
    if (have < STAGES.followerCapPerMember && rand(s) < STAGES.followersPerMemberWeek) {
      s.followerOf[id] = have + 1; s.followers++; gained++;
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
  events.push(...dailyRumor(s));
  for (const st of Object.values(s.res)) {
    st.sus = clamp(st.sus - TALK.suspicionDecay);
    if (st.talked !== s.day && (st.stage === 'none' || st.stage === 'curious')) st.like = clamp(st.like - TALK.likeDecay);
  }
  for (const id of checkLeave(s)) events.push({ type: 'left', id });
  events.push(...castDrift(s));

  let bulletin = null;
  if (isMonthEnd(s.day)) {
    const r = payRent(s, opts.rentChoice);
    events.push({ type: 'rent', ...r });
  }
  if (isSunday(s.day)) {
    weeklyFollowers(s);
    bulletin = makeBulletin(s);
    s.week = newWeek();
    s.week.repStart = s.rep;
  }
  s.over = checkOver(s);
  if (!s.over) {
    s.day++;
    startDay(s, g);
  } else {
    s.mode = 'over';
  }
  return { events, bulletin, over: s.over };
}

export function checkOver(s) {
  if (s.sanctuary.arrears >= SANCTUARY.maxArrears) return 'evicted';
  if (s.rep <= RUMOR.silentAt) return 'silent';
  if (memberCount(s) === 0) return 'empty';
  if (memberCount(s) >= GOAL.members && s.sanctuary.rentStreak >= GOAL.rentStreak) return 'win';
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
