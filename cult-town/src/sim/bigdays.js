// 매주 '큰 날' (25장 D): 날짜 → 행사, 그날 몰리는 주민, 그날만 할 수 있는 행동.
// 게임 난수를 쓰지 않는다 (누가 오는지는 날짜·주민으로 정해진다). 효과 숫자는 config.js BIGDAY.
import { BIGDAY } from '../config.js';
import { BIGDAY_TEXT } from '../data/bigdays.js';
import { RESIDENTS } from '../data/residents.js';
import { clamp, addMoney, addFatigue, shiftBelief } from './leader.js';
import { stat } from './growth.js';
import { checkCurious } from './faith.js';

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
};

// 처음 여섯 주는 정해 둔 순서, 그 뒤로는 토요일마다 장날·바자회·축제를 돌아가며. 3단계 라이벌 개업식은 라이벌이 생긴 날
const FIXED = { 5: 'market_dum', 10: 'assembly', 19: 'bazaar', 22: 'umbrella', 33: 'cherry', 40: 'festival' };
const CYCLE = ['market_dum', 'bazaar', 'festival'];
export function bigDayIdOn(s, day) {
  if (s.rival?.since === day) return 'rival_open';
  if (FIXED[day]) return FIXED[day];
  if (day > 40 && day % 7 === 5) return CYCLE[Math.floor((day - 47) / 7) % CYCLE.length];
  return null;
}
export function bigDayOf(s, day = s.day) {
  const id = bigDayIdOn(s, day);
  return id ? { id, day, ...BIGDAY_TEXT[id] } : null;
}
// 다가오는 큰 날 (수첩 달력)
export function upcomingBigDays(s, n = 4, span = 35) {
  const out = [];
  for (let d = s.day; d < s.day + span && out.length < n; d++) { const b = bigDayOf(s, d); if (b) out.push(b); }
  return out;
}

// 그날 몰리는 주민 (신림동, 봉천동은 4단계). 집에서 나올 수 있는 사람 중 날짜·주민으로 고른다
export function bigDayCrowd(s, bd = bigDayOf(s)) {
  if (!bd) return [];
  return RESIDENTS.filter((r) => hash(`${s.seed}:${bd.day}:${r.id}:big`) < BIGDAY.crowdShare).map((r) => r.id).slice(0, bd.spots.length * 3);
}
export const bigDayActive = (s, minute = s.minute) => { const b = bigDayOf(s); return b && minute >= b.from - 30 && minute <= b.to ? b : null; };
export const bigDayDone = (s) => s.flags.bigDayDone === s.day;

// 행사 행동. 반환: 지문 한 줄
export function bigDayAct(s, action) {
  const bd = bigDayOf(s);
  if (!bd || bigDayDone(s)) return null;
  s.flags.bigDayDone = s.day;
  const F = BIGDAY.fx[bd.id]?.[action] ?? {};
  const crowd = bigDayCrowd(s, bd);
  const touch = (ids, like, sus = 0) => { for (const id of ids) { const st = s.res[id]; st.like = clamp(st.like + like); st.sus = clamp(st.sus + sus); st.met = true; checkCurious(s, id); } };
  if (F.money) addMoney(s, F.money);
  if (F.fatigue) addFatigue(s, F.fatigue);
  if (F.rep) s.rep = clamp(s.rep + F.rep);
  if (F.belief) shiftBelief(s, F.belief);
  if (F.dark) s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
  if (F.crowdLike || F.crowdSus) touch(crowd.slice(0, F.crowdMax ?? crowd.length), F.crowdLike ?? 0, F.crowdSus ?? 0);
  if (F.who) touch(F.who.filter((id) => s.res[id]), F.whoLike ?? 0, F.whoSus ?? 0);
  if (F.religion) touch(Object.keys(s.res).filter((id) => RESIDENTS.find((r) => r.id === id)?.religion === F.religion), F.religionLike ?? 0, F.religionSus ?? 0);
  if (F.allSus) for (const st of Object.values(s.res)) st.sus = clamp(st.sus + F.allSus);
  if (F.membersLike) for (const st of Object.values(s.res)) if (st.stage === 'member') st.like = clamp(st.like + F.membersLike);
  if (F.rivalDirt && s.rival) s.rival.dirt += F.rivalDirt;
  if (F.rivalCalm && s.rival) { s.rival.enemy = false; if (s.rival.status === 'enemy') s.rival.status = 'active'; }   // 앙숙이 풀린다
  // 노래자랑: 카리스마로 박수냐 웃음이냐
  if (bd.id === 'festival' && action === 'stage') {
    const win = hash(`${s.seed}:${s.day}:stage`) < 0.3 + 0.1 * stat(s, 'charisma');
    s.rep = clamp(s.rep + (win ? 3 : -1));
    if (win) touch(crowd, 3);
    return win ? bd.stageWin : bd.stageLose;
  }
  return bd.actions[action].done;
}

// 봇: 행사 날이면 어두운 쪽이 아닌 첫 행동
export function botBigDay(s) {
  const bd = bigDayOf(s);
  if (!bd || bigDayDone(s)) return null;
  const pick = Object.keys(bd.actions).find((k) => !BIGDAY.fx[bd.id]?.[k]?.dark) ?? Object.keys(bd.actions)[0];
  if ((BIGDAY.fx[bd.id]?.[pick]?.money ?? 0) < 0 && s.leader.money < 150_000) return null;
  return bigDayAct(s, pick);
}
