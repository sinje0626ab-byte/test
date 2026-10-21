// 성소: 자리·분위기·소품·예배·헌금·월세·신도 돌보기
import { worshipMul } from './growth.js';
import { noteWorship, addXp } from './quests.js';
import { SANCTUARY, SHOP, SECT_FX, STAGES, RUMOR, SIGN, GROWTH, SERMON } from '../config.js';
import { rand } from './rng.js';
import { districtOf } from '../data/residents.js';
import { clamp, addMoney, shiftBelief } from './leader.js';
import { setStage, activeCast } from './faith.js';
import { isWorshipDay } from './clock.js';
import { extraSeats, offeringMul, memberLikeCut, worshipLikeBonus, rentNow } from './space.js';
import { ruleOffering } from './revelation.js';

export const seats = (s) => SANCTUARY.baseSeats + extraSeats(s) + Object.entries(s.sanctuary.props).reduce((n, [k, c]) => n + SHOP[k].seats * c, 0);
export const mood = (s) => Object.entries(s.sanctuary.props).reduce((n, [k, c]) => n + SHOP[k].mood * c, 0);

export function canBuy(s, item) {
  const have = s.sanctuary.props[item] ?? 0;
  if (have >= SHOP[item].max) return { ok: false, reason: 'max' };
  if (s.leader.money < SHOP[item].price) return { ok: false, reason: 'money' };
  return { ok: true };
}

export function buy(s, item) {
  const c = canBuy(s, item);
  if (!c.ok) return c;
  addMoney(s, -SHOP[item].price);
  s.sanctuary.props[item] = (s.sanctuary.props[item] ?? 0) + 1;
  return { ok: true };
}

// 아침에 정한다: 오늘 저녁 성소에 올 사람 (예배 날만)
export function decideAttendance(s) {
  s.attend = [];
  if (!isWorshipDay(s.day)) return;
  for (const [id, st] of Object.entries(s.res)) {
    if (st.sus >= RUMOR.refuseSus) continue;
    if (st.stage === 'visitor' && st.attendDay <= s.day) s.attend.push(id);
    else if ((st.stage === 'newcomer' || st.stage === 'member') && rand(s) < 0.9) s.attend.push(id);
  }
}

export const canWorship = (s) => isWorshipDay(s.day) && s.sanctuary.worshipDay !== s.day;

// 예배. opts.fast (금식 권하기) · opts.doubleBasket (헌금 바구니 한 바퀴 더)
export function holdWorship(s, opts = {}) {
  const fx = SECT_FX[s.leader.sect];
  const named = s.attend.filter((id) => ['visitor', 'newcomer', 'member'].includes(s.res[id].stage) && districtOf(id) === 'sillim');   // 봉천동 사람은 지부 예배로
  const heads = named.length + activeCast(s).length + s.followers;
  const seatN = seats(s);
  const standing = Math.max(0, heads - seatN);
  const m = mood(s);
  const crowd = standing > 0 ? 0.85 : 1;
  const promoted = [];
  const sermonMul = opts.sermon == null ? 1 : SERMON.mulMin + (SERMON.mulMax - SERMON.mulMin) * opts.sermon;   // 예배 미니게임 점수
  const needLike = STAGES.memberLike - (fx.convert - 1) * 40 - memberLikeCut(s);
  const kitchen = worshipLikeBonus(s) + (s.flags.snackDay === s.day ? 3 : 0);
  for (const id of named) {
    const st = s.res[id];
    st.like = clamp(st.like + SANCTUARY.worship.faithGain * fx.worship * (1 + m / 40) * crowd * (opts.fast ? 1.3 : 1) * worshipMul(s) * sermonMul + kitchen);
    st.worships++;
    if (st.stage === 'visitor') { setStage(s, id, 'newcomer'); promoted.push([id, 'newcomer']); }
    else if (st.stage === 'newcomer' && st.worships >= STAGES.memberWorships && st.like >= needLike) { setStage(s, id, 'member'); promoted.push([id, 'member']); addXp(s, GROWTH.memberXp); }
    st.attendDay = -1;
  }
  let offering = heads * SANCTUARY.worship.offeringPerHead * fx.offering * (1 + m * SANCTUARY.worship.moodOffering);
  offering *= offeringMul(s) * ruleOffering(s) * sermonMul;
  if (s.flags.offeringBoost?.until >= s.day) offering *= s.flags.offeringBoost.mul;
  if (s.flags.shortWorship === s.day) offering *= 0.8;
  if (opts.doubleBasket) {
    s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
    offering *= 1.4;
    shiftBelief(s, -8);
    s.shadow.push({ kind: 'doubleBasket', due: s.day + 3, ids: named });
    for (const c of activeCast(s)) s.cast[c].sus = clamp(s.cast[c].sus + 8);
  }
  if (opts.fast) {
    s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
    shiftBelief(s, 8);
    s.shadow.push({ kind: 'fast', due: s.day + 2, ids: named });
  }
  offering = Math.round(offering / 1000) * 1000;
  addMoney(s, offering);
  s.week.offering += offering;
  s.week.worships.push({ day: s.day, heads, named: named.length, standing });
  s.sanctuary.worshipDay = s.day;
  s.sanctuary.lastAttend = named;
  noteWorship(s, heads);
  addXp(s, GROWTH.worshipXp);
  s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + 10;
  return { heads, named, standing, seats: seatN, offering, promoted, sermon: opts.sermon ?? null };
}

// 밤에 신도 한 명 돌보기
export function care(s, id) {
  const st = s.res[id];
  st.like = clamp(st.like + SANCTUARY.care.like);
  st.sus = clamp(st.sus - 4);
  st.cared = s.day;
  s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + SANCTUARY.care.fatigue;
}

export function vigil(s) {
  shiftBelief(s, 10);
  s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + 40;
  for (const [id, st] of Object.entries(s.res)) if (st.stage === 'member') s.res[id].like = clamp(st.like + 3);
}

// 월세 (월말 밤). choice: 'promise' | 'borrow' (돈이 모자랄 때만)
export function payRent(s, choice = 'promise') {
  const rent = rentNow(s);
  let borrowed = null;
  if (s.leader.money < rent && choice === 'borrow') {
    const pool = Object.keys(s.res).filter((id) => s.res[id].stage === 'member').sort((a, b) => s.res[b].like - s.res[a].like);
    const lender = pool[0] ?? null;
    if (lender) {
      const amt = rent - s.leader.money;
      addMoney(s, amt);
      borrowed = { id: lender, amount: amt };
      shiftBelief(s, -6);
      s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
      s.shadow.push({ kind: 'borrow', due: s.day + 5, id: lender });
      for (const c of activeCast(s)) s.cast[c].sus = clamp(s.cast[c].sus + 6);
    }
  }
  if (s.leader.money >= rent) {
    addMoney(s, -rent);
    s.sanctuary.arrears = 0;
    s.sanctuary.rentStreak++;
    s.week.rent = { paid: true, amount: rent, borrowed };
  } else {
    s.sanctuary.arrears++;
    s.sanctuary.rentStreak = 0;
    s.week.rent = { paid: false, amount: rent, arrears: s.sanctuary.arrears };
    s.landlordAnger += 15;
  }
  return s.week.rent;
}

// 장부: 주보에 신도 수를 부풀려 적는다 (지금 평판 +, 나흘 뒤 대가)
export function inflate(s) {
  if (s.flags.inflatedWeek === s.bulletinNo) return { ok: false };
  s.flags.inflatedWeek = s.bulletinNo;
  s.rep = clamp(s.rep + 6);
  shiftBelief(s, -6);
  s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
  s.shadow.push({ kind: 'inflate', due: s.day + 4 });
  for (const c of activeCast(s)) s.cast[c].sus = clamp(s.cast[c].sus + 4);
  return { ok: true };
}

// 간판 바꾸기 (밤 메뉴): 다음 단계 값을 내고 한 단계 올린다
export const signTier = (s) => s.sanctuary.sign ?? 0;
export const nextSignCost = (s) => SIGN.cost[signTier(s) + 1] ?? null;
export function upgradeSign(s) {
  const c = nextSignCost(s);
  if (c == null || s.leader.money < c) return false;
  addMoney(s, -c);
  s.sanctuary.sign = signTier(s) + 1;
  s.rep = clamp(s.rep + SIGN.rep);
  return true;
}
