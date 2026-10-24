// 퀘스트 (24장 C): 메인 퀘스트 · 사연 갈림길 · 오늘의 할 일 · 엿들은 소문 · 지도 표시.
// 상태 s.quest = { phase, step, flyers[], tong, maxAttend, visitedB, news[] } · s.today · s.later[] · s.heard[]
// 오늘의 할 일은 게임 난수(s.rng)를 쓰지 않는다: 퀘스트가 생겨도 시뮬레이션 순서가 그대로다.
import { zoneQuestTargets } from './zones.js';
import { QUEST, ZEALOT, DRAMA } from '../config.js';
import { ZEALOT_TEXT } from '../data/zealots.js';
import { DRAMA_TEXT } from '../data/drama.js';
import { MAIN, FLYER_SPOTS, BRANCH, DAILY } from '../data/quests.js';
import { RESIDENT_BY_ID, districtOf } from '../data/residents.js';
import { STORIES } from '../data/stories.js';
import { memberCount, branchCount, relationsOf } from './faith.js';
import { activeOfficers } from './officers.js';
import { rivalResolved } from './rival.js';
import { clamp, addMoney, shiftBelief, josaFix } from './leader.js';
import { sanctuaryName } from './voice.js';
import { topNeeds } from './residents.js';

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
};
const fillName = (s, t, id) => josaFix(t.replaceAll('{이름}', RESIDENT_BY_ID[id]?.name ?? '').replaceAll('{성소}', sanctuaryName(s)));

export function v5QuestFields() {
  return {
    zealots: [],
    drama: { log: [], couples: [], fights: [] },
    quest: { phase: 1, step: 0, flyers: [], tong: false, maxAttend: 0, visitedB: false, news: [] },
    today: null,
    later: [],
    heard: [],
  };
}

// ── 메인 퀘스트 ──
const DONE = {
  sign: (s) => (s.sanctuary.sign ?? 0) >= 1,
  flyers: (s) => s.quest.flyers.length >= 3,
  tong: (s) => s.quest.tong,
  worship5: (s) => s.quest.maxAttend >= 5,
  rent1: (s) => s.sanctuary.rentStreak >= 1,
  expand1: (s) => s.space.step >= 1,
  officer1: (s) => activeOfficers(s).length >= 1 && s.officersAppointed >= 1,
  room1: (s) => Object.keys(s.rooms ?? {}).filter((k) => k !== '302').length >= 1,
  expand2: (s) => s.space.step >= 2,
  officer3: (s) => activeOfficers(s).length >= 3,
  rent2: (s) => s.sanctuary.rentStreak >= 2,
  rep40: (s) => s.rep >= 40,
  rivalKnow: (s) => !!s.rival && (Object.keys(s.rival.dirtFrom ?? {}).length > 0 || rivalResolved(s)),
  rivalDone: (s) => rivalResolved(s),
  members150: (s) => memberCount(s) >= 150,
  rent3: (s) => s.sanctuary.rentStreak >= 3,
  visitB: (s) => s.quest.visitedB,
  branchOpen: (s) => !!s.branch?.open,
  branchWorship: (s) => (s.branch?.worshipDay ?? -1) >= 0,
  branch50: (s) => branchCount(s) >= 50,
  rent4: (s) => s.sanctuary.rentStreak >= 4,
};

export const mainOf = (s) => MAIN[s.quest.phase];
export const currentStep = (s) => mainOf(s)?.steps[s.quest.step] ?? null;

// 조건이 채워진 단계를 차례로 끝낸다. 반환: 새로 끝낸 단계들 (화면이 장면을 띄운다)
export function checkQuests(s) {
  const q = s.quest;
  if (!q) return [];
  if (q.phase !== s.phase) { q.phase = s.phase; q.step = 0; }
  if (s.district === 'bongcheon') q.visitedB = true;
  const out = [];
  let st = currentStep(s);
  while (st && DONE[st.id]?.(s)) {
    const r = st.reward ?? {};
    if (r.money) addMoney(s, r.money);
    if (r.rep) s.rep = clamp(s.rep + r.rep);
    if (r.xp) addXp(s, r.xp);
    if (st.id === 'tong') { s.res.tong.sus = clamp(s.res.tong.sus - QUEST.tongSus); s.res.tong.like = clamp(s.res.tong.like + QUEST.tongLike); }
    out.push({ type: 'quest', phase: q.phase, step: q.step, id: st.id, name: st.name, scene: st.scene, reward: r });
    q.step++;
    st = currentStep(s);
  }
  q.news.push(...out);
  if (q.news.length > 10) q.news.splice(0, q.news.length - 10);
  return out;
}

// 교주 경험치 (레벨은 24장 D)
export function addXp(s, n) {
  s.leader.xp = (s.leader.xp ?? 0) + n;
}

// 전단: 지금 단계가 '전단' 일 때 그 장소에 가면 붙인다
export function postFlyer(s, place) {
  const st = currentStep(s);
  if (st?.id !== 'flyers' || !FLYER_SPOTS.includes(place) || s.quest.flyers.includes(place)) return false;
  s.quest.flyers.push(place);
  return true;
}
// 예배 참석 기록 (첫 예배 다섯 명)
export function noteWorship(s, n) {
  s.quest.maxAttend = Math.max(s.quest.maxAttend, n);
}

// ── 오늘의 할 일 ──
export function newToday(s) {
  const pool = Object.keys(DAILY).filter((k) => k !== 'invite' || s.phase >= 1);
  const picked = [];
  let i = 0;
  while (picked.length < QUEST.dailyCount && i < 40) {
    const k = pool[Math.floor(hash(`${s.seed}:${s.day}:daily:${i++}`) * pool.length)];
    if (!picked.includes(k)) picked.push(k);
  }
  const places = FLYER_SPOTS;
  s.today = {
    day: s.day,
    tasks: picked.map((id) => ({ id, arg: id === 'visit' ? places[Math.floor(hash(`${s.seed}:${s.day}:visit`) * places.length)] : null, n: 0, done: false })),
    paid: false,
  };
}

// 대화·행동 결과를 오늘의 할 일에 센다. kind: talk · hit · gift · favor · newFace · invite · walk · visit
export function noteToday(s, kind, arg) {
  const t = s.today;
  if (!t || t.day !== s.day) return [];
  const out = [];
  for (const task of t.tasks) {
    if (task.done) continue;
    const id = task.id === 'talk3' ? 'talk' : task.id;
    if (id !== kind || (task.arg && task.arg !== arg)) continue;
    task.n++;
    if (task.n >= DAILY[task.id].need) { task.done = true; addXp(s, QUEST.dailyXp); out.push(task); }
  }
  if (!t.paid && t.tasks.every((x) => x.done)) { t.paid = true; addMoney(s, QUEST.dailyMoney); addXp(s, QUEST.dailyXp); out.push({ id: 'all' }); }
  return out;
}

// 하루 끝: 안 한 일이 남아 있으면 첫 신도들이 조금 서운해한다 (작은 불만)
export function endToday(s) {
  const t = s.today;
  if (!t) return 0;
  const left = t.tasks.filter((x) => !x.done).length;
  if (left >= QUEST.dailyMissAt) for (const c of Object.values(s.cast ?? {})) c.sus = clamp((c.sus ?? 0) + QUEST.dailyMissSus);
  return left;
}

// ── 사연 갈림길 ──
// 세 번째 부탁을 끝낸 주민: s.res[id].fork = 'pending' → 대화에서 고른다
export const forkReady = (s, id) => s.res[id].fork === 'pending';
export function markFork(s, id) {
  const st = s.res[id];
  if (st.story?.done >= (STORIES[id]?.length ?? 99) && !st.fork) st.fork = 'pending';
}
export function forkOptions(s, id) {
  const need = topNeeds(s.res[id])[0];
  return ['stay', 'use', 'refer'].map((k) => ({
    id: k,
    label: k === 'refer' ? BRANCH.refer[need] : fillName(s, BRANCH.options[k].label, id),
    hint: BRANCH.options[k].hint, fx: BRANCH.options[k].fx,
  }));
}
export function chooseFork(s, id, k) {
  const st = s.res[id];
  const F = QUEST.fork[k];
  st.fork = k;
  st.like = clamp(st.like + F.like);
  st.sus = clamp(st.sus + (F.sus ?? 0));
  if (F.belief) shiftBelief(s, F.belief);
  s.later.push({ day: s.day + F.days, kind: k, id });
  return fillName(s, BRANCH.now[k], id);
}
// 며칠 뒤 돌아오는 결과 (endDay 가 부른다)
export function dueLater(s) {
  const out = [];
  const keep = [];
  for (const e of s.later ?? []) {
    if (e.day > s.day) { keep.push(e); continue; }
    if (e.kind === 'zealotOffering') {           // 열혈 신자가 몰래 돌린 헌금 봉투
      s.rep = clamp(s.rep + ZEALOT.offering.laterRep);
      out.push({ type: 'zealotLater', id: e.id, text: fillName(s, ZEALOT_TEXT.offeringLater, e.id) });
      continue;
    }
    if (e.kind === 'dramaExploit') {             // 주민 일을 이용한 대가
      s.res[e.id].sus = clamp(s.res[e.id].sus + DRAMA.exploit.laterSus);
      out.push({ type: 'dramaLater', id: e.id, text: fillName(s, DRAMA_TEXT.exploitLater, e.id) });
      continue;
    }
    const F = QUEST.fork[e.kind].later;
    const st = s.res[e.id];
    if (F.rep) { if (districtOf(e.id) === 'bongcheon') s.repB = clamp(s.repB + F.rep); else s.rep = clamp(s.rep + F.rep); }
    if (F.like) st.like = clamp(st.like + F.like);
    if (F.sus) st.sus = clamp(st.sus + F.sus);
    if (F.familySus) for (const rel of relationsOf(e.id)) if (rel.kind === 'family' || rel.kind === 'friend') s.res[rel.id].sus = clamp(s.res[rel.id].sus + F.familySus);
    if (F.dark) s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;   // 어두운 선택으로 센다 (노출)
    out.push({ type: 'fork', id: e.id, text: fillName(s, BRANCH.later[e.kind], e.id) });
  }
  s.later = keep;
  return out;
}

// ── 엿들은 소문 ──
// 들을 가치가 있는 말만: 우리 얘기 · 다른 주민 얘기 (이름이 나온다)
const GIVEN = Object.values(RESIDENT_BY_ID).map((r) => r.name.slice(1));
export const worthHearing = (s, text) => text.includes(sanctuaryName(s)) || text.includes('302호') || GIVEN.some((n) => text.includes(n));
export function hear(s, id, text, tip = null) {
  if (tip) s.res[tip.x].tip = { need: tip.need, day: s.day, from: id };   // 엿들은 고민: 그 사람과 대화할 때 선택지가 열린다
  if (!worthHearing(s, text)) return;
  s.heard ??= [];
  if (s.heard.some((h) => h.text === text && h.day === s.day)) return;
  s.heard.unshift({ day: s.day, id, text });
  if (s.heard.length > QUEST.heardMax) s.heard.length = QUEST.heardMax;
}

// ── 지도 표시: 메인 단계 목표 · 받아 둔 부탁 · 오늘의 할 일 장소 ──
//   [{ kind: 'place', place, why } | { kind: 'res', id, why }]
export function questMarkers(s) {
  const out = [];
  const st = currentStep(s);
  if (st?.id === 'flyers') for (const p of FLYER_SPOTS) if (!s.quest.flyers.includes(p)) out.push({ kind: 'place', place: p, why: 'main' });
  if (st?.id === 'tong') out.push({ kind: 'res', id: 'tong', why: 'main' });
  for (const [id, r] of Object.entries(s.res)) {
    const f = r.story?.favor;
    if (r.fork === 'pending') out.push({ kind: 'res', id, why: 'fork' });
    if (!f) continue;
    if (f.type === 'deliver' && !f.relayed) out.push({ kind: 'res', id: f.to, why: 'favor' });
    else if (f.type === 'place' && !f.visited) out.push({ kind: 'place', place: f.place, why: 'favor' });
    else out.push({ kind: 'res', id, why: 'favor' });
  }
  for (const t of s.today?.tasks ?? []) if (t.id === 'visit' && !t.done) out.push({ kind: 'place', place: t.arg, why: 'today' });
  // 30장 구역 일 (노란 느낌표): 얘기할 사람 · 가 볼 자리
  for (const t of zoneQuestTargets(s)) {
    if (t.type === 'talk' && s.res[t.id]) out.push({ kind: 'res', id: t.id, why: 'main' });
    else if (t.type === 'visit' && t.spot) out.push({ kind: 'spot', key: t.spot, why: 'main' });
  }
  return out;
}

// 교주가 장소 입구에 왔을 때 (부탁 장소와 같은 자리): 전단 · 오늘의 할 일 '둘러보기'
export function visitSpot(s, place) {
  const flyer = postFlyer(s, place);
  const today = noteToday(s, 'visit', place);
  const quests = checkQuests(s);
  return { flyer, today, quests };
}
