// localStorage 저장. saveVersion 이 오르면 MIGRATIONS 에 한 단계씩 고치는 함수를 넣는다.
import { GAME } from '../config.js';
import { v2Fields, v3Fields, v4Fields, v5Fields, v6Fields, newResident } from './state.js';
import { RESIDENTS_B, RESIDENTS_Z } from '../data/residents.js';
import { checkZones } from './zones.js';
import { CLERGY_B } from '../data/clergy.js';

// MIGRATIONS[n]: 버전 n 저장을 n+1 로 바꾼다
const MIGRATIONS = {
  1: (s) => {
    Object.assign(s, { ...v2Fields(), ...s });
    for (const r of Object.values(s.res)) { r.story ??= { done: 0, favor: null }; r.lastTopic ??= null; }
    return s;
  },
  2: (s) => {
    Object.assign(s, { ...v3Fields(), ...s });
    for (const r of Object.values(s.res)) { r.rlike ??= 0; r.rival ??= 'none'; }
    return s;
  },
  3: (s) => {
    Object.assign(s, { ...v4Fields(), ...s });
    for (const r of RESIDENTS_B) s.res[r.id] ??= newResident(r);
    for (const c of CLERGY_B) s.clergy[c.id] ??= { last: -99, greetIdx: 0 };
    return s;
  },
  4: (s) => {
    Object.assign(s, { ...v5Fields(), ...s });
    s.sanctuary.sign ??= 0;
    s.leader.xp ??= 0;
    s.leader.stats ??= { talk: 1, stamina: 1, charisma: 1, sense: 1, disguise: 1 };
    s.quest.phase = s.phase;
    return s;
  },
  5: (s) => {
    Object.assign(s, { ...v6Fields(), ...s });
    return s;
  },
  // 30장: 지도가 넓어졌다 (사람 위치는 불러온 뒤 snapAll 로 다시 놓는다). 진행에 맞는 구역은 조용히 연다
  6: (s) => {
    s.zones ??= { stream: 0 }; s.zoneQuests ??= {}; s.zoneNews ??= [];
    for (const r of RESIDENTS_Z) if (r.zone === 'stream') s.res[r.id] ??= newResident(r);
    checkZones(s, true);
    s.leaderTile = null;
    return s;
  },
};

export function migrate(s) {
  while (s.v < GAME.saveVersion) {
    const f = MIGRATIONS[s.v];
    if (!f) throw new Error(`저장 v${s.v} 를 올릴 방법이 없다`);
    s = f(s);
    s.v++;
  }
  return s;
}

export function saveGame(s, storage = globalThis.localStorage) {
  try { storage.setItem(GAME.saveKey, JSON.stringify(s)); return true; } catch { return false; }
}

export function loadGame(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(GAME.saveKey);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch { return null; }
}

export function clearSave(storage = globalThis.localStorage) {
  try { storage.removeItem(GAME.saveKey); } catch { /* 저장소가 막힌 환경 */ }
}
