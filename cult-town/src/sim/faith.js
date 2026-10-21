// 상태 단계: 무관심 → 관심 → 방문 약속 → 새신자 → 신도 (그리고 이탈)
import { STAGES, TALK } from '../config.js';
import { RELATIONS, RESIDENT_BY_ID, districtOf } from '../data/residents.js';
import { clamp } from './leader.js';
import { leaveBonus } from './space.js';
import { ruleLeave } from './revelation.js';

export const leaveThreshold = (s) => STAGES.leaveSuspicion + leaveBonus(s) + ruleLeave(s) + (s.flags?.leaveBoost?.until >= s.day ? s.flags.leaveBoost.add : 0);

export const stageIndex = (st) => STAGES.order.indexOf(st);

export function relationsOf(id) {
  const out = [];
  for (const [a, b, kind] of RELATIONS) {
    if (a === id) out.push({ id: b, kind });
    else if (b === id) out.push({ id: a, kind });
  }
  return out;
}

export function setStage(s, id, stage) {
  const st = s.res[id];
  const from = st.stage;
  if (from === stage) return;
  st.stage = stage;
  if (stage === 'member') {
    s.week.members.push(id);
    // 가족 중 신도가 생기면 다른 가족이 반대한다
    for (const r of relationsOf(id)) {
      if (r.kind === 'family' && s.res[r.id].stage !== 'member') s.res[r.id].sus = clamp(s.res[r.id].sus + TALK.familyAgainstSus);
    }
  }
  if (stage === 'newcomer') s.week.newcomers.push(id);
  s.log.push({ day: s.day, type: 'stage', id, from, to: stage });
}

// 호감으로 정해지는 단계 (관심)
export function checkCurious(s, id) {
  const st = s.res[id];
  if (st.stage === 'none' && st.like >= STAGES.curiousAt) setStage(s, id, 'curious');
}

// 의심이 너무 높으면 한 단계 내려간다 (신도 이탈 포함)
export function checkLeave(s) {
  const left = [];
  for (const [id, st] of Object.entries(s.res)) {
    if (st.sus < leaveThreshold(s) || st.stage === 'none') continue;
    const i = stageIndex(st.stage);
    const to = st.stage === 'visitor' ? 'curious' : STAGES.order[i - 1];
    if (st.stage === 'member') left.push(id);
    setStage(s, id, to);
    st.like = clamp(st.like - 15);
    st.attendDay = -1;
  }
  for (const id of left) {
    s.week.left.push(id);
    const lost = s.followerOf[id] ?? 0;          // 데려온 사람도 같이 나간다 (봉천동 사람은 지부 쪽에서)
    if (districtOf(id) === 'bongcheon' && s.branch) s.branch.followers = Math.max(0, s.branch.followers - lost);
    else s.followers = Math.max(0, s.followers - lost);
    s.followerOf[id] = 0;
  }
  return left;
}

export const namedMembers = (s) => Object.keys(s.res).filter((id) => s.res[id].stage === 'member');
export const activeCast = (s) => Object.keys(s.cast).filter((id) => s.cast[id].active);
export const memberCount = (s) => namedMembers(s).length + activeCast(s).length + s.followers + (s.branch?.followers ?? 0);
// 봉천 지부 규모 (봉천동 이름 있는 신도 + 지부 따라온 사람)
export const branchCount = (s) => namedMembers(s).filter((id) => districtOf(id) === 'bongcheon').length + (s.branch?.followers ?? 0);

export function residentName(id) {
  return RESIDENT_BY_ID[id]?.name ?? id;
}
