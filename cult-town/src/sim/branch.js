// 4단계: 봉천동 지부. s.branch = { open, head, followers, since, worshipDay, autonomy, split, share }
//   지부장 = 간부 한 명 (assign 'branch'). 지부 예배는 수·일 저녁 지부장이 연다 (교주는 늘 302호에 있다).
//   지부가 커질수록 지부장은 독립하고 싶어 한다 → 불만 70 이면 예고, 3일 안에 못 풀면 분열 (실패).
import { PHASE4, STAGES, SECT_FX } from '../config.js';
import { districtOf } from '../data/residents.js';
import { BRANCH_TEXT } from '../data/branch.js';
import { clamp, addMoney, shiftBelief, josaFix } from './leader.js';
import { setStage, branchCount } from './faith.js';
import { activeOfficers, officerById } from './officers.js';
import { isWorshipDay } from './clock.js';

const fill = (t, o) => josaFix(Object.entries(o).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), t));
export const branchHead = (s) => (s.branch?.head ? officerById(s, s.branch.head) : null);
export const canOpenBranch = (s) => s.phase >= 4 && !s.branch.open && s.leader.money >= PHASE4.deposit && activeOfficers(s).length >= 2;
export const branchRent = (s) => (s.branch?.open ? PHASE4.rent : 0);

// 지부 열기: 보증금을 내고 간부 한 명을 지부장으로
export function openBranch(s, headId) {
  if (!canOpenBranch(s)) return null;
  const o = officerById(s, headId);
  if (!o || o.left) return null;
  addMoney(s, -PHASE4.deposit);
  Object.assign(s.branch, { open: true, head: o.id, since: s.day, share: 1, autonomy: 0, split: null });
  o.assign = 'branch';
  return fill(BRANCH_TEXT.opened, { 이름: o.name });
}

// 지부 예배 (하루 끝, 예배 날). 봉천동 참석자만
function branchWorship(s, events) {
  const o = branchHead(s);
  if (!o) { events.push({ type: 'branch', text: BRANCH_TEXT.noHead }); return; }
  const fx = SECT_FX[s.leader.sect];
  const W = PHASE4.worship;
  const mul = 1 + (o.manage - 3) * W.manageMul;
  const named = s.attend.filter((id) => districtOf(id) === 'bongcheon' && ['visitor', 'newcomer', 'member'].includes(s.res[id].stage));
  const needLike = STAGES.memberLike - (fx.convert - 1) * 40;
  let promoted = 0;
  for (const id of named) {
    const st = s.res[id];
    st.like = clamp(st.like + W.faithGain * fx.worship * mul);
    st.worships++;
    if (st.stage === 'visitor') setStage(s, id, 'newcomer');
    else if (st.stage === 'newcomer' && st.worships >= STAGES.memberWorships && st.like >= needLike) { setStage(s, id, 'member'); promoted++; }
    st.attendDay = -1;
  }
  const walkIn = Math.floor(o.manage * W.walkIn + (s.repB - 40) / 30);
  if (walkIn > 0) s.branch.followers += walkIn;
  const heads = named.length + s.branch.followers;
  const offering = Math.round((heads * W.offeringPerHead * fx.offering * (s.branch.share ?? 1)) / 1000) * 1000;
  addMoney(s, offering);
  s.week.offering += offering;
  s.branch.worshipDay = s.day;
  s.branch.heads = heads;
  events.push({ type: 'branch', text: fill(BRANCH_TEXT.worship, { 이름: o.name, n: heads, 새: promoted + Math.max(0, walkIn), 돈: `${offering.toLocaleString('ko-KR')}원` }) });
}

// 지부장 불만: 지부가 클수록 오른다. 계시 '지부' 기조에 따라 빠르거나 느리다
function headDaily(s, events) {
  const o = branchHead(s);
  if (!o) return;
  const H = PHASE4.head;
  const pick = s.revelations.branch?.[0];
  let d = H.base + branchCount(s) / H.sizeDiv + (pick === 'trust' ? H.trust : pick === 'report' ? H.report : 0) + s.branch.autonomy * H.power;
  d *= 1 - o.loyal * 0.08;
  o.discontent = clamp(o.discontent + d);
  const B = s.branch;
  if (!B.split && o.discontent >= PHASE4.splitAt) {
    B.split = { due: s.day + PHASE4.splitDays };
    events.push({ type: 'branchSplit', text: fill(BRANCH_TEXT.warn, { 이름: o.name, n: PHASE4.splitDays }) });
  } else if (B.split && o.discontent < PHASE4.splitAt - 10) {
    B.split = null;
    events.push({ type: 'branch', text: fill(BRANCH_TEXT.calm, { 이름: o.name }) });
  }
}

// 지부장 문제 대응 (밤 메뉴)
export function branchOptions(s) {
  if (!branchHead(s)) return activeOfficers(s).filter((o) => o.assign !== 'branch').length ? ['replace'] : [];
  return ['meet', 'power', ...(activeOfficers(s).length >= 2 ? ['replace'] : [])];
}
export function branchAct(s, choice, newHeadId) {
  const o = branchHead(s);
  const B = s.branch;
  if (choice === 'meet' && o) {
    o.discontent = clamp(o.discontent + PHASE4.meet.disc);
    s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + PHASE4.meet.fatigue;
    s.flags.branchMeet = s.day;
    return { text: fill(BRANCH_TEXT.meet, { 이름: o.name }), tone: 'good' };
  }
  if (choice === 'power' && o) {
    o.discontent = clamp(o.discontent + PHASE4.power.disc);
    B.autonomy++;
    B.share = Math.max(0.3, (B.share ?? 1) * PHASE4.power.share);
    return { text: fill(BRANCH_TEXT.power, { 이름: o.name, n: Math.round(B.share * 100) }), tone: '' };
  }
  if (choice === 'replace') {
    const n = officerById(s, newHeadId) ?? activeOfficers(s).filter((x) => x.assign !== 'branch').sort((a, b) => b.manage - a.manage)[0];
    if (!n) return { text: BRANCH_TEXT.noOne, tone: 'bad' };
    if (o) { o.assign = null; o.discontent = clamp(o.discontent + PHASE4.replace.oldDisc); }
    n.assign = 'branch';
    B.head = n.id; B.split = null; B.autonomy = 0;
    shiftBelief(s, -2);
    return { text: fill(o ? BRANCH_TEXT.replace : BRANCH_TEXT.appoint, { 이름: o?.name ?? '', 새: n.name }), tone: o ? '' : 'good' };
  }
  return { text: '', tone: '' };
}

// 하루 끝 (endDay). 분열이 나면 'split' 을 돌려준다
export function dailyBranch(s) {
  const events = [];
  if (s.phase < 4 || !s.branch.open) return { events, split: false };
  if (isWorshipDay(s.day)) branchWorship(s, events);
  headDaily(s, events);
  const o = branchHead(s);
  if (s.branch.head && (!o || o.left)) { s.branch.head = null; s.branch.split = null; }
  if (s.branch.split && s.day >= s.branch.split.due && o) {
    // 분열: 봉천동 신도와 지부 따라온 사람이 지부장을 따라 나간다
    for (const id of Object.keys(s.res)) if (districtOf(id) === 'bongcheon' && ['member', 'newcomer'].includes(s.res[id].stage)) setStage(s, id, 'curious');
    s.branch.followers = 0;
    events.push({ type: 'branchSplit', text: fill(BRANCH_TEXT.split, { 이름: o.name }) });
    return { events, split: true };
  }
  return { events, split: false };
}

