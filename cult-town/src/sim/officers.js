// 2단계 간부: 첫 신도 3명이 첫 간부, 신도 중에서 승진(최대 6명). 배치 · 낮 포교 · 불만 · 간부 회의.
//   s.officers[] = { id, kind: 'cast'|'resident', name, talk, manage, loyal, trait, assign, discontent, left, faction }
//   assign: null · 'street' · 'room:<slot>'
import { OFFICERS, RUMOR } from '../config.js';
import { CAST } from '../data/cast.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { CAST_OFFICERS, TRAIT_MAP, TRAITS, AGENDAS, DISCONTENT_TEXT } from '../data/officers.js';
import { rand, pick } from './rng.js';
import { clamp, addMoney, shiftBelief, josaFix } from './leader.js';
import { setStage } from './faith.js';

const h32 = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return (h >>> 0) / 4294967296; };
export const activeOfficers = (s) => s.officers.filter((o) => !o.left);
export const officerById = (s, id) => s.officers.find((o) => o.id === id);

// 간부끼리 관계: 친함 · 앙숙 (이름 쌍으로 정해진다)
export function relOf(s, a, b) {
  const k = [a, b].sort().join('|');
  if (!(k in s.officerRel)) {
    const r = h32(k);
    s.officerRel[k] = r < 0.22 ? 'rival' : r < 0.5 ? 'friend' : null;
  }
  return s.officerRel[k];
}

function addOfficer(s, o) {
  s.officers.push({ assign: null, discontent: 10, left: false, faction: false, ...o });
  s.officersAppointed++;
  for (const x of activeOfficers(s)) if (x.id !== o.id) relOf(s, x.id, o.id);
}

// 2단계 시작: 첫 신도 중 남아 있는 사람이 간부
export function initOfficers(s) {
  if (s.officers.length) return;
  for (const c of CAST) {
    if (!s.cast[c.id].active) continue;
    addOfficer(s, { id: c.id, kind: 'cast', name: c.name, role: c.officer, ...CAST_OFFICERS[c.id] });
  }
}

export function canPromote(s, id) {
  const st = s.res[id];
  return st.stage === 'member' && st.like >= OFFICERS.promoteLike && activeOfficers(s).length < OFFICERS.max && !officerById(s, id);
}
export function promote(s, id) {
  if (!canPromote(s, id)) return false;
  const r = RESIDENT_BY_ID[id];
  const has = (t) => r.traits.includes(t);
  const base = (k) => 2 + Math.floor(h32(id + k) * 2);
  const trait = r.traits.map((t) => TRAIT_MAP[t]).find(Boolean) ?? 'plain';
  addOfficer(s, {
    id, kind: 'resident', name: r.name, role: r.job,
    talk: Math.min(5, base('t') + (has('chatty') ? 1 : 0)),
    manage: Math.min(5, base('m') + (has('shrewd') || has('careful') || has('strict') ? 1 : 0)),
    loyal: Math.min(5, base('l') + (has('kind') || has('devout') ? 1 : 0)),
    trait,
  });
  return true;
}

export function assign(s, oid, where) {
  const o = officerById(s, oid);
  if (!o || o.left) return;
  if (s.branch?.head === o.id && where !== 'branch') return;     // 지부장은 '봉천 지부' 메뉴에서만 바꾼다
  // 방 하나에 간부 한 명
  if (where?.startsWith('room:')) for (const x of activeOfficers(s)) if (x.assign === where) x.assign = null;
  o.assign = where;
}

// 낮 포교: 한 시간마다 간부마다 한 명 (바깥에 나온 주민 중 아직 신도가 아닌 사람)
export function streetTick(s) {
  const out = [];
  for (const o of activeOfficers(s)) {
    if (o.assign !== 'street') continue;
    const pool = Object.keys(s.res).filter((id) => {
      if (id.startsWith('b_')) return false;          // 낮 포교 간부는 신림동을 돈다
      const st = s.res[id];
      return st.stage !== 'member' && st.sus < RUMOR.refuseSus && (!s.pos[id] || !s.pos[id].inside);
    });
    if (!pool.length) continue;
    const id = pick(s, pool);
    const st = s.res[id];
    const slip = Math.max(0.03, OFFICERS.street.slipBase - o.talk * OFFICERS.street.slipTalk) * TRAITS[o.trait].slipMul;
    if (rand(s) < slip) {
      st.sus = clamp(st.sus + OFFICERS.street.slipSus);
      out.push({ type: 'slip', oid: o.id, id, text: TRAITS[o.trait].slip.replaceAll('{이름}', o.name).replaceAll('{대상}', RESIDENT_BY_ID[id].name) });
    } else {
      st.like = clamp(st.like + OFFICERS.street.like + o.talk * OFFICERS.street.talkLike);
      if (st.stage === 'none' && st.like >= 30) setStage(s, id, 'curious');
      out.push({ type: 'talk', oid: o.id, id });
    }
    s.week.officerTalks = (s.week.officerTalks ?? 0) + 1;
  }
  return out;
}

// 하루 끝: 불만이 오르내리고, 문턱을 넘으면 사건
export function dailyOfficers(s, darkToday = 0) {
  const D = OFFICERS.discontent;
  const out = [];
  const act = activeOfficers(s);
  for (const o of act) {
    let d = -D.decay;
    if (!o.assign) d += D.idle;
    const good = (o.assign === 'street' && o.talk >= 3) || (o.assign?.startsWith('room:') && o.manage >= 3);
    if (good) d += D.good;
    for (const x of act) {
      if (x === o || relOf(s, o.id, x.id) !== 'rival') continue;
      if (x.assign && x.assign === o.assign) d += D.rival;
    }
    d += darkToday * D.dark;
    if (Math.abs(s.leader.belief) >= 60) d += D.extreme;
    if (d > 0) d *= 1 - o.loyal * D.loyalCut;
    o.discontent = clamp(o.discontent + d);

    if (o.discontent >= OFFICERS.leaveAt) {
      o.left = true; o.assign = null; s.officersLeft++;
      if (o.kind === 'cast') s.cast[o.id].active = false;
      else setStage(s, o.id, 'curious');
      s.shadow.push({ kind: 'expose', due: s.day + OFFICERS.exposeDays, oid: o.id, name: o.name });
      out.push({ type: 'officerLeft', oid: o.id, text: josaFix(DISCONTENT_TEXT.leave.replaceAll('{이름}', o.name)) });
    } else if (o.discontent >= OFFICERS.factionAt && !o.faction) {
      o.faction = true;
      for (const [, st] of Object.entries(s.res)) if (st.stage === 'member' && rand(s) < 0.35) st.sus = clamp(st.sus + OFFICERS.factionSus);
      out.push({ type: 'faction', oid: o.id, text: josaFix(DISCONTENT_TEXT.faction.replaceAll('{이름}', o.name)) });
    } else if (o.discontent >= OFFICERS.embezzleAt && rand(s) < 0.3) {
      const amt = Math.round(Math.max(0, s.leader.money) * OFFICERS.embezzleShare / 1000) * 1000;
      if (amt > 0) {
        addMoney(s, -amt);
        out.push({ type: 'embezzle', oid: o.id, text: josaFix(DISCONTENT_TEXT.embezzle.replaceAll('{이름}', o.name)).replace('{돈}', `${amt.toLocaleString('ko-KR')}원`) });
      }
    }
    if (o.discontent < OFFICERS.factionAt - 15) o.faction = false;
  }
  return out;
}

// ── 간부 회의 ──
export function pickAgenda(s) {
  const act = activeOfficers(s);
  if (act.length < 2 || s.flags.meetingDay === s.day) return null;
  const hasDorm = Object.values(s.rooms).some((r) => r.type === 'dorm');
  const cands = [];
  for (const a of AGENDAS) {
    if (a.needs === 'dorm' && !hasDorm) continue;
    if (a.who === 'rivals') {
      for (const o of act) for (const x of act) if (o.id < x.id && relOf(s, o.id, x.id) === 'rival') cands.push({ agenda: a, by: o.id, other: x.id });
      continue;
    }
    const by = act.filter((o) => a.who === 'any' || o.trait === a.who);
    for (const o of by) cands.push({ agenda: a, by: o.id });
  }
  if (!cands.length) return null;
  const c = cands[Math.floor(h32(`${s.day}:${s.seed}`) * cands.length)];
  return { id: c.agenda.id, by: c.by, other: c.other ?? null };
}

export function decideAgenda(s, ag, idx) {
  const a = AGENDAS.find((x) => x.id === ag.id);
  const fx = a.options[idx].fx;
  const by = officerById(s, ag.by); const other = ag.other ? officerById(s, ag.other) : null;
  if (fx.money) addMoney(s, fx.money);
  if (fx.moneyPerOfficer) addMoney(s, fx.moneyPerOfficer * activeOfficers(s).length);
  if (fx.disc && by) by.discontent = clamp(by.discontent + fx.disc);
  if (fx.discOther && other) other.discontent = clamp(other.discontent + fx.discOther);
  if (fx.discAll) for (const o of activeOfficers(s)) o.discontent = clamp(o.discontent + fx.discAll * (1 - o.loyal * 0.08));
  if (fx.like) for (const st of Object.values(s.res)) if (st.stage === 'member') st.like = clamp(st.like + fx.like);
  if (fx.rep) s.rep = clamp(s.rep + fx.rep);
  if (fx.belief) shiftBelief(s, fx.belief);
  if (fx.tong) s.res.tong.sus = clamp(s.res.tong.sus + fx.tong);
  if (fx.fatigue) s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + fx.fatigue;
  if (fx.offeringWeek) s.flags.offeringBoost = { until: s.day + 7, mul: 1 + fx.offeringWeek };
  if (fx.leaveWeek) s.flags.leaveBoost = { until: s.day + 7, add: fx.leaveWeek };
  if (fx.street) s.flags.streetBoost = { until: s.day + 7 };
  if (fx.shadow) s.shadow.push({ kind: `agenda_${fx.shadow}`, due: s.day + 4 });
  if (fx.unassignBoth) { if (by) by.assign = null; if (other) other.assign = null; }
  s.flags.meetingDay = s.day;

}
