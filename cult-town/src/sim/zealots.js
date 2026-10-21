// 열혈 신자 (24장 D-2): 믿음 높은 신도. 낮에 자기 관계망부터 알아서 포교하고, 성격대로 사고를 친다.
// 상태: s.zealots = [{ id, since, calmUntil }] · 하루 끝 dailyZealots (endDay 가 부른다)
import { ZEALOT } from '../config.js';
import { ZEALOT_TEXT } from '../data/zealots.js';
import { RESIDENT_BY_ID, districtOf } from '../data/residents.js';
import { relationsOf, checkCurious } from './faith.js';
import { rand, pick } from './rng.js';
import { clamp, addMoney, josaFix } from './leader.js';
import { sanctuaryName } from './voice.js';
import { rivalOn } from './rival.js';

const fill = (s, t, o) => josaFix(Object.entries(o).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), t).replaceAll('{성소}', sanctuaryName(s)));
const PUSHY = ['chatty', 'blunt', 'loud', 'stubborn', 'tough', 'cheerful', 'simple'];

export const zealotsOf = (s) => (s.zealots ??= []);
export const isZealot = (s, id) => zealotsOf(s).some((z) => z.id === id);

// 열혈 신자로 세울 수 있는 신도 (신림·봉천 둘 다)
export function zealotCandidates(s) {
  return Object.keys(s.res).filter((id) => s.res[id].stage === 'member' && s.res[id].like >= ZEALOT.minLike && !isZealot(s, id));
}
export function makeZealot(s, id, auto = false) {
  if (zealotsOf(s).length >= ZEALOT.max || isZealot(s, id)) return null;
  zealotsOf(s).push({ id, since: s.day, calmUntil: -1 });
  s.flags.zealotsEver = (s.flags.zealotsEver ?? 0) + 1;
  return fill(s, auto ? ZEALOT_TEXT.auto : ZEALOT_TEXT.made, { 이름: RESIDENT_BY_ID[id].name });
}
export function calmZealot(s, id) {
  const z = zealotsOf(s).find((x) => x.id === id);
  if (!z) return null;
  z.calmUntil = s.day + ZEALOT.calmDays;
  s.res[id].like = clamp(s.res[id].like + ZEALOT.calmLike);
  s.leader.belief = clamp(s.leader.belief + ZEALOT.calmBelief, -100, 100);
  return fill(s, ZEALOT_TEXT.calm, { 이름: RESIDENT_BY_ID[id].name });
}
export function releaseZealot(s, id) {
  s.zealots = zealotsOf(s).filter((z) => z.id !== id);
  s.res[id].like = clamp(s.res[id].like - 6);
  return fill(s, ZEALOT_TEXT.release, { 이름: RESIDENT_BY_ID[id].name });
}

// 오늘 누구에게 말을 걸까: 관계망(아직 신도 아닌 사람) 먼저, 모자라면 같은 동네 아무나
export function zealotTargets(s, id) {
  const open = (x) => ['none', 'curious'].includes(s.res[x].stage) && s.res[x].sus < 70;
  const rel = relationsOf(id).map((r) => r.id).filter(open);
  const out = rel.slice(0, ZEALOT.targets);
  const district = districtOf(id);
  if (out.length < ZEALOT.targets && (district === 'sillim' || s.phase >= 4)) {
    const pool = Object.keys(s.res).filter((x) => x !== id && !out.includes(x) && districtOf(x) === district && open(x));
    while (out.length < ZEALOT.targets && pool.length) out.push(pool.splice(Math.floor(rand(s) * pool.length), 1)[0]);
  }
  return out;
}

export function dailyZealots(s) {
  const events = [];
  // 스스로 열혈이 되는 신도 (믿음이 아주 높으면 가끔)
  for (const id of Object.keys(s.res)) {
    const st = s.res[id];
    if (st.stage === 'member' && st.like >= ZEALOT.autoLike && !isZealot(s, id) && zealotsOf(s).length < ZEALOT.max && rand(s) < ZEALOT.autoChance) {
      const text = makeZealot(s, id, true);
      if (text) events.push({ type: 'zealotAuto', id, text, first: s.flags.zealotsEver === 1 });
    }
  }
  for (const z of [...zealotsOf(s)]) {
    const st = s.res[z.id];
    if (!st || st.stage !== 'member') { s.zealots = zealotsOf(s).filter((x) => x !== z); continue; }
    if (districtOf(z.id) === 'bongcheon' && s.phase < 4) continue;
    const r = RESIDENT_BY_ID[z.id];
    const rels = new Set(relationsOf(z.id).map((x) => x.id));
    const targets = zealotTargets(s, z.id);
    for (const t of targets) {
      const x = s.res[t];
      const mul = rels.has(t) ? ZEALOT.relationBonus : 1;
      x.like = clamp(x.like + ZEALOT.like * mul);
      x.sus = clamp(x.sus + ZEALOT.sus * (r.traits.some((k) => PUSHY.includes(k)) ? 1.5 : 1));
      checkCurious(s, t);
    }
    if (targets.length) events.push({ type: 'zealotSpread', id: z.id, targets, text: fill(s, ZEALOT_TEXT.spread, { 이름: r.name, 상대: RESIDENT_BY_ID[targets[0]].name }) });
    // 사고
    if (z.calmUntil >= s.day || rand(s) >= ZEALOT.accident) continue;
    const kinds = ['pushy', 'pushy'];
    const fam = relationsOf(z.id).filter((x) => x.kind === 'family' && s.res[x.id].stage !== 'member');
    if (fam.length) kinds.push('family');
    kinds.push('offering');
    if (s.phase >= 3 && rivalOn(s)) kinds.push('rival');
    const kind = pick(s, kinds);
    let other = targets[0] ?? null;
    if (kind === 'pushy' && other) { s.res[other].sus = clamp(s.res[other].sus + ZEALOT.pushy.sus); s.rep = clamp(s.rep + ZEALOT.pushy.rep); }
    else if (kind === 'family') { other = fam[0].id; s.res[other].sus = clamp(s.res[other].sus + ZEALOT.family.sus); s.rep = clamp(s.rep + ZEALOT.family.rep); }
    else if (kind === 'offering') { addMoney(s, ZEALOT.offering.money); s.flags.darkToday = (s.flags.darkToday ?? 0) + 1; (s.later ??= []).push({ day: s.day + ZEALOT.offering.days, kind: 'zealotOffering', id: z.id }); }
    else if (kind === 'rival') { s.exposure = clamp((s.exposure ?? 0) + ZEALOT.rival.exposure); s.rep = clamp(s.rep + ZEALOT.rival.rep); }
    else continue;
    events.push({ type: 'zealotAccident', kind, id: z.id, text: fill(s, ZEALOT_TEXT.accident[kind], { 이름: r.name, 상대: other ? RESIDENT_BY_ID[other].name : '지나가던 사람' }) });
  }
  return events;
}
