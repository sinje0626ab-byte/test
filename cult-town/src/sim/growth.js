// 교주 성장 (24장 D-3): 경험치 · 레벨 · 능력 5개 (말솜씨·체력·카리스마·눈치·위장) · 믿음 축에 따른 해금
import { GROWTH, TALK } from '../config.js';
import { RESIDENT_BY_ID, RELATIONS } from '../data/residents.js';

export const STAT_IDS = ['talk', 'stamina', 'charisma', 'sense', 'disguise'];

export function statsOf(s) {
  s.leader.stats ??= { talk: 1, stamina: 1, charisma: 1, sense: 1, disguise: 1 };
  return s.leader.stats;
}
export const stat = (s, k) => statsOf(s)[k] ?? 1;

// 레벨 L 에서 L+1 까지 필요한 경험치
export const xpNeed = (L) => GROWTH.xpBase + GROWTH.xpStep * (L - 1);
export function levelOf(s) {
  let L = 1; let xp = s.leader.xp ?? 0;
  while (xp >= xpNeed(L)) { xp -= xpNeed(L); L++; }
  return { level: L, into: xp, need: xpNeed(L) };
}
// 쓸 수 있는 능력 점수 = 레벨 - 1 - 이미 쓴 점수
export function freePoints(s) {
  const used = STAT_IDS.reduce((n, k) => n + stat(s, k) - 1, 0);
  return levelOf(s).level - 1 - used;
}
export function raiseStat(s, k) {
  if (freePoints(s) <= 0 || stat(s, k) >= GROWTH.maxStat) return false;
  statsOf(s)[k]++;
  return true;
}

// 능력 효과
export const fatigueLimit = (s) => TALK.dailyFatigueLimit + GROWTH.stamina * (stat(s, 'stamina') - 1);
export const talkMul = (s) => 1 + GROWTH.talk * (stat(s, 'talk') - 1);
export const worshipMul = (s) => 1 + GROWTH.charisma * (stat(s, 'charisma') - 1);
export const hintAccuracy = (s) => Math.min(0.98, 0.7 + GROWTH.sense * (stat(s, 'sense') - 1));
export const seesSuspicion = (s) => stat(s, 'sense') >= 2;
export const exposureCut = (s) => GROWTH.disguise * (stat(s, 'disguise') - 1);
export const sightCut = (s) => (stat(s, 'disguise') >= 3 ? 1 : 0);
export const canStreetSermon = (s) => stat(s, 'charisma') >= GROWTH.streetSermon.charisma;

// 믿음 축 해금: 레벨 3부터 사기 쪽은 '후기 전단', 광신 쪽은 '새벽 심방'
export function axisUnlock(s) {
  if (levelOf(s).level < GROWTH.unlockLevel) return null;
  if (s.leader.belief <= -GROWTH.unlockBelief) return 'flyerReviews';
  if (s.leader.belief >= GROWTH.unlockBelief) return 'dawnVisit';
  return null;
}

// 봇·자동 배분: 가장 낮은 능력부터 (같으면 말솜씨 → 체력 → 카리스마 → 눈치 → 위장 순)
export function autoRaise(s) {
  while (freePoints(s) > 0) {
    const k = [...STAT_IDS].sort((a, b) => stat(s, a) - stat(s, b))[0];
    if (!raiseStat(s, k)) break;
  }
}


// 길거리 즉석 설교 (카리스마 3): 가까이 있는 주민에게 한꺼번에. 같은 계열은 잘 듣고, 무교는 의심한다
export function streetSermon(s, ids, sameFamilyOf = () => false) {
  const G = GROWTH.streetSermon;
  for (const id of ids) {
    const st = s.res[id];
    const same = sameFamilyOf(id);
    st.like = Math.min(100, st.like + G.like * (same ? G.sameFamily : 1));
    if (RESIDENT_BY_ID[id].religion === 'none') st.sus = Math.min(100, st.sus + G.secularSus);
  }
  s.leader.fatigue += G.fatigue;
  s.flags.streetSermon = s.day;
}

// 믿음 축 밤 행동
export function axisAction(s, kind) {
  if (kind === 'flyerReviews') {
    const F = GROWTH.flyerReviews;
    s.leader.money -= F.money;
    s.rep = Math.min(100, s.rep + F.rep);
    s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
    s.leader.belief = Math.max(-100, s.leader.belief - 2);
  } else if (kind === 'dawnVisit') {
    const F = GROWTH.dawnVisit;
    for (const [id, st] of Object.entries(s.res)) {
      if (st.stage !== 'member') continue;
      st.like = Math.min(100, st.like + F.like);
      for (const [a, b, k] of RELATIONS) {
        const o = a === id ? b : b === id ? a : null;
        if (o && k === 'family' && s.res[o].stage !== 'member') s.res[o].sus = Math.min(100, s.res[o].sus + F.familySus);
      }
    }
    s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + F.fatigue;
    s.leader.belief = Math.min(100, s.leader.belief + 2);
  }
  s.flags.axisDay = s.day;
}
