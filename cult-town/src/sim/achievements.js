// 업적 판정 · 작은 보상 · 명장면 (28장 B). 화면도 봇도 같은 함수를 쓴다 (경험치가 같게).
//   checkAchievements: 새로 딴 업적 목록 (s.achievements[id] = 날짜, 칭호는 가장 최근 것이 자동으로)
//   pollRewards: 지난번 이후 새로 생긴 작은 보상 (친해짐 단계 · 첫 헌금 · 사연 끝) → 경험치
//   addMoment: 단계 결산 '명장면'에 쓸 한 줄
import { josaFix } from './leader.js';
import { ACHIEVEMENTS, REWARD_TEXT } from '../data/achievements.js';
import { RESIDENTS, RESIDENT_BY_ID } from '../data/residents.js';
import { STORIES } from '../data/stories.js';
import { REWARD } from '../config.js';
import { namedMembers, memberCount } from './faith.js';
import { activeOfficers } from './officers.js';
import { rivalResolved } from './rival.js';
import { zealotsOf } from './zealots.js';
import { levelOf } from './growth.js';
import { addXp } from './quests.js';

const C = (s) => (s.counters ??= {});
const storyDone = (s) => Object.entries(s.res).filter(([, st]) => (st.story?.done ?? 0) > 0);
const RULES = {
  hello: (s) => Object.values(s.res).some((st) => st.met),
  flyers: (s) => (s.quest?.flyers?.length ?? 0) >= 3,
  offering: (s) => (C(s).offering ?? 0) > 0,
  member: (s) => namedMembers(s).length > 0,
  momLoan: (s) => (s.rescue?.loans ?? 0) > 0,
  rent: (s) => (s.sanctuary.rentStreak ?? 0) >= 1,
  tong: (s) => (s.res.tong?.worships ?? 0) > 0,
  umbrella: (s) => (C(s).umbrella ?? 0) >= 3,
  story: (s) => storyDone(s).length > 0,
  storyAll: (s) => Object.entries(s.res).some(([id, st]) => STORIES[id] && (st.story?.done ?? 0) >= STORIES[id].length),
  stories5: (s) => storyDone(s).length >= 5,
  members10: (s) => memberCount(s) >= 10,
  meetAll: (s) => RESIDENTS.every((r) => s.res[r.id]?.met),
  worshipMonth: (s) => (C(s).worshipStreak ?? 0) >= 8,
  bigSermon: (s) => (C(s).bigSermons ?? 0) > 0,
  sign2: (s) => (s.sanctuary.sign ?? 0) >= 2,
  level5: (s) => levelOf(s).level >= 5,
  expand: (s) => (s.space?.step ?? 0) >= 1,
  officer: (s) => s.phase >= 2 && activeOfficers(s).length > 0,
  members100: (s) => memberCount(s) >= 100,
  zealot: (s) => zealotsOf(s).length > 0 || (C(s).zealots ?? 0) > 0,
  rent3: (s) => (s.sanctuary.rentStreak ?? 0) >= 3,
  sign3: (s) => (s.sanctuary.sign ?? 0) >= 3,
  rival: (s) => rivalResolved(s),
  branch: (s) => !!s.branch?.open,
  members300: (s) => memberCount(s) >= 300,
};

export function checkAchievements(s) {
  s.achievements ??= {};
  const out = [];
  for (const a of ACHIEVEMENTS) {
    if (s.achievements[a.id] != null || !RULES[a.id]?.(s)) continue;
    s.achievements[a.id] = s.day;
    s.leader.title = a.id;
    addXp(s, REWARD.achievementXp);
    addMoment(s, `〈${a.name}〉 ${a.desc}`);
    out.push(a);
  }
  return out;
}
export const titleOf = (s) => ACHIEVEMENTS.find((a) => a.id === s.leader.title)?.name ?? null;

const fillR = (t, o) => josaFix(t.replace('{이름}', o.이름 ?? '').replace('{장소}', o.장소 ?? ''));
// 친해짐 단계: 호감 문턱 (REWARD.bond) 을 처음 넘을 때마다
export function pollRewards(s) {
  const out = [];
  const c = C(s);
  for (const [id, st] of Object.entries(s.res)) {
    const r = RESIDENT_BY_ID[id];
    if (!r || !st.met) continue;
    const lv = REWARD.bond.filter((t) => st.like >= t).length;
    if (lv > (st.bond ?? 0)) {
      for (let k = (st.bond ?? 0) + 1; k <= lv; k++) out.push({ kind: `bond${k}`, id, text: fillR(REWARD_TEXT[`bond${k}`], { 이름: r.name }), xp: REWARD.bondXp });
      st.bond = lv;
    }
    const done = st.story?.done ?? 0;
    if (done > (st.storySeen ?? 0)) {
      st.storySeen = done;
      out.push({ kind: 'story', id, text: fillR(REWARD_TEXT.story, { 이름: r.name }), xp: REWARD.storyXp });
    }
  }
  if ((c.offering ?? 0) > 0 && !c.offeringRewarded) {
    c.offeringRewarded = true;
    out.push({ kind: 'offering', text: REWARD_TEXT.offering, xp: REWARD.offeringXp });
  }
  for (const o of out) addXp(s, o.xp);
  return out;
}
// 장소 첫 방문 (화면이 입구 근처에 오면 부른다)
export function noteVisit(s, place, label) {
  const c = C(s);
  c.visited ??= {};
  if (c.visited[place]) return null;
  c.visited[place] = s.day;
  addXp(s, REWARD.visitXp);
  return { kind: 'visit', text: fillR(REWARD_TEXT.visit, { 장소: label }), xp: REWARD.visitXp };
}

export function addMoment(s, text) {
  s.moments ??= [];
  s.moments.push({ day: s.day, phase: s.phase, text });
  if (s.moments.length > 60) s.moments.splice(0, s.moments.length - 60);
}
