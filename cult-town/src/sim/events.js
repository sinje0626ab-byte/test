// 돌발 사건: 아침에 하나가 생기고 (state.events.pending), 교주가 고르면 효과가 난다.
import { EVENTS } from '../config.js';
import { RESIDENTS } from '../data/residents.js';
import { FAMILIES } from '../data/sects.js';
import { RIVAL_EVENTS } from '../data/events.js';
import { rand, pick } from './rng.js';
import { clamp, addMoney, shiftBelief } from './leader.js';
import { isWorshipDay } from './clock.js';
import { relationsOf } from './faith.js';
import { inspect } from './threats.js';

const members = (s) => Object.keys(s.res).filter((id) => s.res[id].stage === 'member' || s.res[id].stage === 'newcomer');

// 오늘 아침 사건 고르기 (startDay 뒤에 부른다)
export function rollEvent(s) {
  if (s.events.pending || s.day - s.events.last < EVENTS.minGapDays || s.day < 2) return null;
  if (rand(s) >= EVENTS.dailyChance) return null;
  const pool = ['landlord', 'meeting', 'fire', 'kimbap', 'rival'];
  const fam = members(s).filter((id) => relationsOf(id).some((r) => r.kind === 'family' && s.res[r.id].stage !== 'member'));
  if (fam.length) pool.push('family', 'family');
  if (s.weather.rain && isWorshipDay(s.day)) pool.push('rain', 'rain', 'rain');
  const kind = pick(s, pool);
  const ev = { kind, day: s.day };
  if (kind === 'family') {
    ev.id = pick(s, fam);
    ev.relative = relationsOf(ev.id).find((r) => r.kind === 'family' && s.res[r.id].stage !== 'member').id;
  }
  if (kind === 'rival') ev.rival = RIVAL_EVENTS[(s.events.rivalIdx = ((s.events.rivalIdx ?? -1) + 1) % RIVAL_EVENTS.length)];
  s.events.pending = ev;
  s.events.last = s.day;
  return ev;
}

export function eventOptions(s, ev) {
  switch (ev.kind) {
    case 'landlord': return s.leader.money >= 100_000 ? ['tea', 'refuse', 'envelope'] : ['tea', 'refuse'];
    case 'meeting': return s.leader.money >= 80_000 ? ['apologize', 'mat', 'ignore'] : ['apologize', 'ignore'];
    case 'family': return ['explain', 'distance', 'ignore'];
    case 'rival': return ['short', 'flyer', 'none'];
    case 'fire': return s.leader.money >= 45_000 ? ['buy', 'later'] : ['later'];
    case 'rain': return ['pickup', 'let'];
    case 'kimbap': return s.leader.money >= 90_000 ? ['order', 'sorry'] : ['sorry'];
    case 'district': case 'firecheck': return ['cooperate', 'delay'];
    default: return [];
  }
}
export const DARK_EVENT_OPTIONS = ['envelope', 'distance'];

const groupOf = (family) => RESIDENTS.filter((r) => FAMILIES[family].religions.includes(r.religion)).map((r) => r.id);
const night = (s, n) => { s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + n; };

export function resolveEvent(s, choice) {
  const ev = s.events.pending;
  if (!ev) return;
  const R = s.res;
  let result = null;
  switch (choice) {
    case 'cooperate': result = inspect(s); break;
    case 'delay': s.shadow.push({ kind: 'adminLater', due: s.day + 4 }); s.landlordAnger += 5; break;
    case 'tea': s.landlordAnger = Math.max(0, s.landlordAnger - 10); s.leader.fatigue = clamp(s.leader.fatigue + 10); break;
    case 'refuse': s.landlordAnger += 15; break;
    case 'envelope': s.landlordAnger = Math.max(0, s.landlordAnger - 25); addMoney(s, -100_000); shiftBelief(s, -5); break;
    case 'apologize': R.tong.sus = clamp(R.tong.sus - 12); night(s, 30); break;
    case 'mat': addMoney(s, -80_000); R.tong.sus = clamp(R.tong.sus - 6); s.rep = clamp(s.rep + 2); break;
    case 'ignore':
      if (ev.kind === 'meeting') { R.tong.sus = clamp(R.tong.sus + 14); s.rep = clamp(s.rep - 4); }
      else { R[ev.relative].sus = clamp(R[ev.relative].sus + 10); s.landlordAnger += 6; }
      break;
    case 'explain': R[ev.relative].sus = clamp(R[ev.relative].sus - 6); R[ev.id].like = clamp(R[ev.id].like - 3); break;
    case 'distance':
      R[ev.id].like = clamp(R[ev.id].like + 5); R[ev.relative].sus = clamp(R[ev.relative].sus + 18); shiftBelief(s, -5);
      s.shadow.push({ kind: 'distance', due: s.day + 4, id: ev.id, relative: ev.relative });
      break;
    case 'short': s.flags.shortWorship = s.day; break;
    case 'flyer': for (const id of groupOf(ev.rival.family)) R[id].sus = clamp(R[id].sus + 12); break;
    case 'none': for (const id of groupOf(ev.rival.family)) if (R[id].stage !== 'none') R[id].like = clamp(R[id].like - 5); break;
    case 'buy': addMoney(s, -45_000); break;
    case 'later': s.landlordAnger += 10; if (rand(s) < 0.4) s.shadow.push({ kind: 'fine', due: s.day + 5 }); break;
    case 'pickup': night(s, 25); break;
    case 'let': s.attend = s.attend.filter(() => rand(s) < 0.65); break;
    case 'order': addMoney(s, -90_000); s.landlordAnger = Math.max(0, s.landlordAnger - 10); s.flags.snackDay = s.day; break;
    case 'sorry': s.landlordAnger += 5; break;
    default: break;
  }
  s.events.seen[ev.kind] = (s.events.seen[ev.kind] ?? 0) + 1;
  s.events.pending = null;
  s.week.events = (s.week.events ?? 0) + 1;
  return result;
}

// 월세 체납도 건물주 불만으로 쌓인다
export const angerFromArrears = (s) => { if (s.week.rent && !s.week.rent.paid) s.landlordAnger += 15; };
