// 라이벌 교단 (3단계). 교주 v:leader 와 전도자 v:p1 · v:p2 가 맵을 돌며 우리와 같은 규칙(유형 효과 포함)으로 주민에게 말을 건다.
//   s.rival = { sect, status: 'active'|'enemy'|'truce'|'absorbed'|'collapsed', followers, dirt, dirtFrom, competeUntil, taken, since }
//   s.res[id].rlike (라이벌 호감) · s.res[id].rival ('none'|'lean'|'member')
// 플레이어가 아무것도 안 해도 라이벌은 혼자 신도를 모은다.
import { RIVAL, SECT_FX, STAGES } from '../config.js';
import { RESIDENTS, RESIDENT_BY_ID } from '../data/residents.js';
import { SECT_ORDER } from '../data/sects.js';
import { RIVALS, RIVAL_TEXT } from '../data/rival.js';
import { rand, pick } from './rng.js';
import { clamp, addFatigue, shiftBelief, josaFix } from './leader.js';
import { setStage, memberCount, namedMembers } from './faith.js';
import { targetKey, topNeeds } from './residents.js';
import { resolveKey } from './grid.js';

export const RIVAL_WALKERS = ['v:leader', 'v:p1', 'v:p2'];
const fill = (t, o) => josaFix(Object.entries(o).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), t));
export const rivalInfo = (s) => (s.rival ? RIVALS[s.rival.sect] : null);
export const rivalOn = (s) => !!s.rival && ['active', 'enemy'].includes(s.rival.status);
export const rivalResolved = (s) => !!s.rival && ['truce', 'absorbed', 'collapsed'].includes(s.rival.status);
export const rivalNamed = (s) => RESIDENTS.filter((r) => s.res[r.id].rival === 'member').map((r) => r.id);
export const rivalSize = (s) => (s.rival ? rivalNamed(s).length + s.rival.followers : 0);
export const textVars = (s) => { const r = rivalInfo(s); return { 라이벌: r?.name ?? '', 교주: r ? `${r.leader} ${r.title}` : '' }; };

// 3단계 시작 며칠 뒤: 우리와 다른 유형 하나
export function maybeStartRival(s) {
  if (s.phase < 3 || s.rival || s.phase3Day == null || s.day - s.phase3Day < RIVAL.startDelay) return null;
  const sect = pick(s, SECT_ORDER.filter((x) => x !== s.leader.sect));
  s.rival = { sect, status: 'active', followers: RIVAL.startFollowers, dirt: 0, dirtFrom: {}, competeUntil: -1, taken: 0, since: s.day + 1, enemy: false };
  for (const r of RESIDENTS) { s.res[r.id].rlike ??= 0; s.res[r.id].rival ??= 'none'; }
  return { type: 'rival', text: fill(RIVAL_TEXT.appear, textVars(s)) };
}

// 라이벌 쪽 말 한 번 (유형 효과: 지금 고민이 맞으면 크게)
function rivalTalk(s, id) {
  const st = s.res[id];
  const fx = SECT_FX[s.rival.sect];
  const top = topNeeds(st)[0];
  let d = RIVAL.like.base + (fx.topic[top] ? RIVAL.like.topic * fx.topic[top] : 0);
  if (s.rival.competeUntil >= s.day) d *= RIVAL.compete.mul;
  if (s.revelations.neighbor?.includes('compete')) d *= 0.85;
  if (s.rival.status === 'enemy') d *= RIVAL.enemyMul;
  d -= st.sus * RIVAL.like.sus;
  st.rlike = clamp((st.rlike ?? 0) + d);
  const out = { id, moved: false };
  if (st.rival === 'none' && st.rlike >= RIVAL.leanAt) st.rival = 'lean';
  if (st.rlike >= RIVAL.memberAt && st.rival !== 'member') {
    if (st.stage === 'member' || st.stage === 'newcomer') {
      if (s.rival.status !== 'truce' && st.rlike > st.like + RIVAL.stealGap) {
        const lost = 1 + (s.followerOf[id] ?? 0);
        s.followers = Math.max(0, s.followers - (s.followerOf[id] ?? 0));
        s.followerOf[id] = 0;
        setStage(s, id, 'curious');
        st.rival = 'member';
        s.rival.taken += lost;
        s.week.left.push(id);
        out.moved = true;
      }
    } else {
      st.rival = 'member';
      if (['visitor', 'curious'].includes(st.stage)) { setStage(s, id, 'none'); st.attendDay = -1; }
    }
  }
  return out;
}

// 한 시간마다: 라이벌 사람마다 그 자리 근처 주민에게 (하루 talksPerPreacher 번쯤)
export function rivalHour(s, g, hour) {
  const out = [];
  if (!rivalOn(s) || s.day < s.rival.since || hour < 9 || hour >= 18) return out;
  for (const w of RIVAL_WALKERS) {
    if (rand(s) >= RIVAL.talksPerPreacher / 9) continue;
    const at = targetKey(s, g, w, hour * 60).split(':')[0];
    const pool = RESIDENTS.filter((r) => {
      const k = targetKey(s, g, r.id, hour * 60);
      return k.split(':')[0] === at && !resolveKey(g, k).inside && s.res[r.id].rival !== 'member';
    });
    if (!pool.length) continue;
    const r = rivalTalk(s, pick(s, pool).id);
    out.push({ walker: w, ...r, act: pick(s, RIVAL_TEXT.acts) });
  }
  if (out.length) s.rivalTalk = { ...out[0], minute: hour * 60 };
  return out;
}

// 우리가 말을 걸면 라이벌 쪽 마음이 조금 식는다
export function ourTalkCools(s, id) {
  const st = s.res[id];
  if (st.rlike) st.rlike = clamp(st.rlike - 1.5);
  if (st.rival === 'lean' && st.rlike < RIVAL.leanAt - 5) st.rival = 'none';
}

export function rivalDaily(s) {
  const events = [];
  const start = maybeStartRival(s);
  if (start) events.push(start);
  if (!rivalOn(s)) return events;
  for (const r of RESIDENTS) {
    const st = s.res[r.id];
    if (st.rival !== 'member' && st.rlike) st.rlike = clamp(st.rlike - RIVAL.like.decay);
  }
  const slowed = s.rival.slowUntil >= s.day;
  if (!slowed) s.rival.followers += RIVAL.followers.daily + (s.rival.status === 'enemy' ? 1 : 0);
  // 경쟁 중: 저쪽 따라온 사람 몇이 우리 쪽으로
  if (s.rival.competeUntil >= s.day && s.rival.followers > 0) { const n = Math.min(s.rival.followers, RIVAL.compete.poach); s.rival.followers -= n; s.followers += n; }
  for (const id of s.week.left.filter((x) => s.res[x]?.rival === 'member' && s.res[x].stage === 'curious')) {
    if (!s.flags[`stoleNote:${id}`]) { s.flags[`stoleNote:${id}`] = true; events.push({ type: 'rivalStole', id, text: fill(RIVAL_TEXT.stole, { ...textVars(s), 이름: RESIDENT_BY_ID[id].name }) }); }
  }
  if (rivalSize(s) < RIVAL.collapseAt) { s.rival.status = 'collapsed'; events.push({ type: 'rival', text: fill(RIVAL_TEXT.collapsed, textVars(s)) }); }
  return events;
}

// 일요일: 라이벌 따라온 사람이 늘고, 라이벌이 크면 우리 따라온 사람을 가져간다
export function rivalWeekly(s) {
  const events = [];
  if (!rivalOn(s)) return events;
  if (!(s.rival.slowUntil >= s.day)) s.rival.followers += Math.round(rivalNamed(s).length * RIVAL.followers.perMember + RIVAL.followers.base);
  const ours = memberCount(s); const theirs = rivalSize(s);
  if (s.followers > 0) {
    const n = Math.round(s.followers * RIVAL.takeFollowers * Math.min(2, theirs / Math.max(1, ours)));
    if (n > 0) {
      s.followers -= n; s.rival.followers += n; s.rival.taken += n;
      events.push({ type: 'rivalTook', text: fill(RIVAL_TEXT.tookFollowers, { ...textVars(s), n }) });
    }
  }
  s.week.clergy.push({ id: 'rival', line: fill(RIVAL_TEXT.bulletin, textVars(s)) });
  return events;
}

// ── 밤 메뉴 대응 ──
export const mergeChance = (s) => {
  const o = memberCount(s); const t = rivalSize(s);
  let p = ((o - t) / Math.max(1, o + t)) * RIVAL.merge.base + s.rep / RIVAL.merge.repDiv - RIVAL.merge.cut - (s.rival.status === 'enemy' ? RIVAL.merge.enemyCut : 0);
  if (s.revelations.neighbor?.includes('respect')) p += 0.15;
  return clamp(p, 0, 0.95);
};
export const truceChance = (s) => {
  const ratio = memberCount(s) / Math.max(1, rivalSize(s));
  if (ratio < RIVAL.truce.sizeMin) return 0;
  let p = RIVAL.truce.base + s.rep / RIVAL.truce.repDiv + (ratio - RIVAL.truce.sizeMin) * RIVAL.truce.ratio - (s.rival.status === 'enemy' ? 0.1 : 0);
  if (s.revelations.neighbor?.includes('respect')) p += 0.1;
  return clamp(p, 0, 0.9);
};
export const rivalTalkReady = (s) => s.day - s.rival.since >= RIVAL.talkAfter;
export function rivalOptions(s) {
  if (!rivalOn(s) || s.flags.rivalNight === s.day) return [];
  const o = [];
  if (s.rival.competeUntil < s.day) o.push('compete');
  o.push('expose');
  if (rivalTalkReady(s)) o.push('merge', 'truce');
  return o;
}
export function rivalAct(s, choice) {
  const R = s.rival; const v = textVars(s);
  s.flags.rivalNight = s.day;
  if (choice === 'compete') {
    R.competeUntil = s.day + RIVAL.compete.days;
    s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + RIVAL.compete.fatigue;
    return { text: RIVAL_TEXT.compete, tone: '' };
  }
  if (choice === 'expose') {
    if (R.dirt < RIVAL.expose.dirt) return { text: `들은 얘기가 ${R.dirt}개뿐이다. ${RIVAL.expose.dirt}개는 있어야 한다. 라이벌 쪽에 다니는 주민에게 낮에 물어보자.`, tone: 'bad' };
    R.dirt -= RIVAL.expose.dirt;
    R.followers = Math.round(R.followers * (1 - RIVAL.expose.cut));
    for (const id of rivalNamed(s)) if (rand(s) < RIVAL.expose.cut) { s.res[id].rival = 'none'; s.res[id].rlike = 20; }
    s.flags.rivalExposeUntil = s.day + 6;
    R.slowUntil = s.day + RIVAL.expose.slowDays;
    if (s.reporter.active) s.reporter.heat += 5;
    R.status = 'enemy';
    if (rivalSize(s) < RIVAL.collapseAt) R.status = 'collapsed';
    return { text: RIVAL_TEXT.exposeDone, tone: '' };
  }
  if ((choice === 'merge' || choice === 'truce') && s.day - R.since < RIVAL.talkAfter) {
    s.flags.rivalNight = null;
    return { text: fill(RIVAL_TEXT.tooEarly, v), tone: 'bad' };
  }
  if (choice === 'merge') {
    if (rand(s) < mergeChance(s)) {
      const add = Math.round(R.followers * RIVAL.merge.absorb);
      s.followers += add;
      for (const id of rivalNamed(s)) { s.res[id].rival = 'none'; if (s.res[id].stage === 'none' || s.res[id].stage === 'curious') { setStage(s, id, 'newcomer'); s.res[id].like = Math.max(s.res[id].like, STAGES.memberLike - 10); } }
      R.status = 'absorbed';
      shiftBelief(s, -3);
      return { text: fill(RIVAL_TEXT.mergeGood, v), tone: 'good', add };
    }
    R.status = 'enemy';
    s.rep = clamp(s.rep + RIVAL.enemyRep);
    return { text: fill(RIVAL_TEXT.mergeBad, v), tone: 'bad' };
  }
  if (choice === 'truce') {
    if (rand(s) < truceChance(s)) { R.status = 'truce'; return { text: fill(RIVAL_TEXT.truceGood, v), tone: 'good' }; }
    return { text: fill(RIVAL_TEXT.truceBad, v), tone: 'bad' };
  }
  return { text: '', tone: '' };
}

// 대화에서 라이벌 얘기 묻기 (폭로 재료)
export const canAskRival = (s, id) => rivalOn(s) && ['lean', 'member'].includes(s.res[id].rival) && !s.rival.dirtFrom[id];
export function askRival(s, id) {
  s.rival.dirtFrom[id] = true;
  s.rival.dirt++;
  addFatigue(s, 4);
  return fill(RIVAL_TEXT.dirt, { ...textVars(s), 이름: RESIDENT_BY_ID[id].name, n: s.rival.dirt });
}

// 프로필 카드: 어느 쪽에 끌리는지
export function leanOf(s, id) {
  const st = s.res[id];
  if (!s.rival) return null;
  const v = textVars(s);
  const ours = ['visitor', 'newcomer', 'member'].includes(st.stage) || st.like >= 40;
  const theirs = st.rival !== 'none';
  if (ours && theirs) return fill(RIVAL_TEXT.lean.both, v);
  if (theirs) return fill(RIVAL_TEXT.lean.theirs, v);
  if (ours) return RIVAL_TEXT.lean.ours;
  return RIVAL_TEXT.lean.none;
}

// 실패: 우리 신도 과반이 라이벌로
export const rivalMajority = (s, share) => !!s.rival && s.rival.taken > share * (memberCount(s) + s.rival.taken) && s.rival.taken >= 20;
export const namedMembersCount = (s) => namedMembers(s).length;
