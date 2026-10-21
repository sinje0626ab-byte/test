// 2단계: 공간 확장 · 방 · 방 효과. 상태: s.space.step · s.rooms[slot] = { type, level, dark }
import { SPACE_STEPS, ROOMS, DARK_ROOM, NEGOTIATE, SANCTUARY, OFFICERS } from '../config.js';
import { rand } from './rng.js';
import { clamp, addMoney, shiftBelief } from './leader.js';

export const rentNow = (s) => SANCTUARY.rent + SPACE_STEPS.slice(1, s.space.step + 1).reduce((n, st) => n + st.rent, 0);
export const nextStep = (s) => SPACE_STEPS[s.space.step + 1] ?? null;
export const openSlots = (s) => SPACE_STEPS.slice(0, s.space.step + 1).flatMap((st) => st.slots);

const bestManage = (s) => Math.max(0, ...s.officers.filter((o) => !o.left).map((o) => o.manage));

// 확장 (choice: pay 그대로 · haggle 깎기 · long 장기 계약)
export function expandCost(s, choice) {
  const st = nextStep(s);
  if (!st) return null;
  if (choice === 'long') return Math.round(st.deposit * (1 - NEGOTIATE.longCut));
  return st.deposit;
}
export function haggleChance(s) {
  return Math.min(0.9, NEGOTIATE.base + s.rep / NEGOTIATE.repDiv + bestManage(s) * NEGOTIATE.manage);
}
export function expand(s, choice = 'pay') {
  const st = nextStep(s);
  if (!st) return { ok: false };
  let cost = expandCost(s, choice);
  let haggled = null;
  if (choice === 'haggle') {
    haggled = rand(s) < haggleChance(s);
    if (haggled) cost = Math.round(st.deposit * (1 - NEGOTIATE.cut));
    else s.landlordAnger += NEGOTIATE.failAnger;
  }
  if (choice === 'long') s.landlordAnger = Math.max(0, s.landlordAnger + NEGOTIATE.longAnger);
  if (s.leader.money < cost) return { ok: false, reason: 'money', cost, haggled };
  addMoney(s, -cost);
  s.space.step++;
  return { ok: true, cost, haggled, step: st };
}

// 방 짓기·올리기
export function roomCost(s, slot, type) {
  const r = s.rooms[slot];
  if (!r) return ROOMS[type].build;
  if (r.level >= 3) return null;
  return ROOMS[r.type].up[r.level - 1];
}
export function buildRoom(s, slot, type) {
  if (s.rooms[slot] || !openSlots(s).includes(slot)) return false;
  const c = ROOMS[type].build;
  if (s.leader.money < c) return false;
  addMoney(s, -c);
  s.rooms[slot] = { type, level: 1, dark: false };
  return true;
}
export function upgradeRoom(s, slot, dark = false) {
  const r = s.rooms[slot];
  if (!r || r.level >= 3) return false;
  const c = ROOMS[r.type].up[r.level - 1];
  if (s.leader.money < c) return false;
  addMoney(s, -c);
  r.level++;
  if (dark && r.level === 3) {
    r.dark = true;
    shiftBelief(s, -8);
    s.shadow.push({ kind: `room_${r.type}`, due: s.day + 5 });
  }
  return true;
}
export const DARK_ROOM_TYPES = ['counsel', 'dorm', 'broadcast', 'office'];

// 방 효과 세기: 레벨 합 (어두운 방은 배율), 담당 간부의 관리 능력만큼 더
export function roomPower(s, type) {
  let p = 0;
  for (const [slot, r] of Object.entries(s.rooms)) {
    if (r.type !== type) continue;
    let v = r.dark ? r.level * DARK_ROOM.mult : r.level;
    const o = s.officers.find((x) => !x.left && x.assign === `room:${slot}`);
    if (o) v *= 1 + OFFICERS.roomBonus * o.manage;
    p += v;
  }
  return p;
}

// 하루 끝 방 효과
export function dailyRooms(s) {
  const out = [];
  const study = roomPower(s, 'study');
  const dorm = roomPower(s, 'dorm');
  const broadcast = roomPower(s, 'broadcast');
  const counsel = roomPower(s, 'counsel');
  for (const [id, st] of Object.entries(s.res)) {
    if (st.stage === 'member' && study) st.like = clamp(st.like + ROOMS.study.memberLike * study);
    // 상담실: 관심 있는 사람이 스스로 찾아온다
    if (counsel && st.stage === 'curious' && st.like >= 45 && rand(s) < ROOMS.counsel.visitorExtra * counsel) {
      st.stage = 'visitor'; st.attendDay = s.day + 1; s.log.push({ day: s.day, type: 'stage', id, from: 'curious', to: 'visitor' });
    }
  }
  if (dorm) { s.landlordAnger += ROOMS.dorm.anger * dorm / 2; s.rep = clamp(s.rep - ROOMS.dorm.rep * dorm); }
  if (broadcast) {
    const add = ROOMS.broadcast.outsiders * broadcast;
    const n = Math.floor(add) + (rand(s) < add % 1 ? 1 : 0);
    s.followers += n; s.outsiders += n;
    s.rep = clamp(s.rep - ROOMS.broadcast.rep * broadcast);
    if (n) out.push({ type: 'outsiders', n });
  }
  return out;
}

// 주마다: 숙소 가족 항의 · 방송실 노출 (세 계열 같은 무게)
export function weeklyRooms(s, relationsOf) {
  const dorm = roomPower(s, 'dorm');
  if (dorm) for (const [id, st] of Object.entries(s.res)) if (st.stage === 'member') for (const r of relationsOf(id)) if (r.kind === 'family') s.res[r.id].sus = clamp(s.res[r.id].sus + ROOMS.dorm.familySus * dorm);
  const b = roomPower(s, 'broadcast');
  if (b) for (const st of Object.values(s.res)) st.sus = clamp(st.sus + ROOMS.broadcast.clergySus * b * 0.5);
}

// 다른 모듈이 쓰는 배율
export const extraSeats = (s) => Math.round(ROOMS.worship.seats * Math.max(0, roomPower(s, 'worship') - 1));
export const leaveBonus = (s) => ROOMS.study.leave * roomPower(s, 'study') + ROOMS.dorm.leave * roomPower(s, 'dorm');
export const offeringMul = (s) => 1 + ROOMS.office.offering * roomPower(s, 'office');
export const inviteBonus = (s) => ROOMS.counsel.invite * roomPower(s, 'counsel');
export const memberLikeCut = (s) => ROOMS.counsel.needLike * roomPower(s, 'counsel');
export const worshipLikeBonus = (s) => ROOMS.kitchen.worshipLike * roomPower(s, 'kitchen');
export const followerBonus = (s) => ROOMS.kitchen.followers * roomPower(s, 'kitchen');
