// 30장 신림동 새 구역: 열리는 조건 · 구역 주민 생기기 · 구역 퀘스트.
// 상태: s.zones = { 구역 id: 열린 날 } · s.zoneQuests = { 퀘스트 id: { step, done } }
// 닫힌 구역은 교주 걷기 지도에서만 막힌다 (game 쪽). 주민 길찾기 지도는 그대로다.
import { RESIDENTS, RESIDENTS_Z } from '../data/residents.js';
import { ZONE_TEXT, ZONE_REWARD, ZONE_QUESTS } from '../data/zones.js';
import { newResident } from './state.js';
import { activeOfficers } from './officers.js';
import { clamp, addMoney, josaFix } from './leader.js';
import { addXp } from './quests.js';
import { sanctuaryName } from './voice.js';

// 열리는 조건 (메인 퀘스트·단계)
export const ZONE_RULES = {
  stream: () => true,
  market_in: (s) => s.phase >= 2 || !!s.quest?.tong,
  hill: (s) => s.phase >= 2,
  gosi: (s) => s.phase >= 3 || (s.phase >= 2 && (s.officersAppointed ?? 0) >= 1 && activeOfficers(s).length >= 1),
  sundae: (s) => s.phase >= 3,
};
export const ZONE_ORDER = ['stream', 'market_in', 'hill', 'gosi', 'sundae'];

export const zonesOf = (s) => (s.zones ??= { stream: 0 });
export const zoneOpen = (s, id) => !id || zonesOf(s)[id] != null;
// 신림동 주민 = 옛 30명 + 열린 구역 주민 (1~3단계 규칙이 도는 목록)
export const sillimOf = (s) => [...RESIDENTS, ...RESIDENTS_Z.filter((r) => s.res[r.id])];

function openZone(s, id) {
  zonesOf(s)[id] = s.day;
  for (const r of RESIDENTS_Z) if (r.zone === id) s.res[r.id] ??= newResident(r);
}
// 새로 열린 구역 목록 (하루 끝 · 낮 퀘스트 뒤에 부른다). quiet: 불러오기 직후처럼 보상 없이
export function checkZones(s, quiet = false) {
  const out = [];
  for (const id of ZONE_ORDER) {
    if (zoneOpen(s, id) || !ZONE_RULES[id](s)) continue;
    openZone(s, id);
    if (quiet) continue;
    addXp(s, ZONE_REWARD.xp);
    for (const q of ZONE_QUESTS[id] ?? []) zoneQuestsOf(s)[q.id] ??= { step: 0, done: false };
    out.push({ type: 'zone', id, name: ZONE_TEXT[id].name, text: ZONE_TEXT[id].opened, xp: ZONE_REWARD.xp });
  }
  return out;
}
// 새 게임: 처음부터 열린 구역의 주민·퀘스트
export function initZones(s) {
  zonesOf(s);
  for (const id of ZONE_ORDER) if (ZONE_RULES[id] === ZONE_RULES.stream) openZone(s, id);
  for (const q of ZONE_QUESTS.stream) zoneQuestsOf(s)[q.id] ??= { step: 0, done: false };
}

// ── 구역 퀘스트 ──
export const zoneQuestsOf = (s) => (s.zoneQuests ??= {});
const fill = (s, t) => josaFix(t.replaceAll('{성소}', sanctuaryName(s)));
const zoneMembers = (s, zone) => RESIDENTS_Z.filter((r) => r.zone === zone && s.res[r.id]?.stage === 'member').length;
function stepOf(q, k) { return k === 0 ? q.step : q.then; }
// 지금 열린 구역의 진행 중인 퀘스트 [{ q, st, cur }]
export function activeZoneQuests(s) {
  const out = [];
  for (const id of ZONE_ORDER) {
    if (!zoneOpen(s, id)) continue;
    for (const q of ZONE_QUESTS[id] ?? []) {
      const st = zoneQuestsOf(s)[q.id] ??= { step: 0, done: false };
      if (!st.done) out.push({ q, st, cur: stepOf(q, st.step), zone: id });
    }
  }
  return out;
}
export const zoneQuestHint = (s, q) => fill(s, q.hint);
// ev: { talk: 주민 id } · { visit: 'place:spot' } · { shop: 가게 키 } · {} (신도 수만 다시 본다)
// 반환: 끝난 퀘스트 [{ name, text, reward }]
export function progressZoneQuests(s, ev = {}) {
  const done = [];
  for (const { q, st, cur } of activeZoneQuests(s)) {
    if (!cur) continue;
    const hit = (cur.type === 'talk' && ev.talk === cur.id)
      || (cur.type === 'visit' && ((cur.spot && ev.visit === cur.spot) || (cur.shop && ev.shop === cur.shop)))
      || (cur.type === 'members' && zoneMembers(s, cur.zone) >= cur.n);
    if (!hit) continue;
    st.step++;
    if (st.step >= (q.then ? 2 : 1)) {
      st.done = true;
      const r = q.reward ?? {};
      if (r.money) addMoney(s, r.money);
      if (r.rep) s.rep = clamp(s.rep + r.rep);
      if (r.xp) addXp(s, r.xp);
      done.push({ type: 'zoneQuest', name: q.name, text: fill(s, q.done), reward: r });
    }
  }
  return done;
}
// 지금 가야 할 자리들 (지도 표시용): [{ spot | shop | id, why }]
export function zoneQuestTargets(s) {
  return activeZoneQuests(s).map(({ q, cur }) => ({ ...cur, name: q.name })).filter((c) => c.type !== 'members');
}
