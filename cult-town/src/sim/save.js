// localStorage 저장. saveVersion 이 오르면 MIGRATIONS 에 한 단계씩 고치는 함수를 넣는다.
import { GAME } from '../config.js';

// MIGRATIONS[n]: 버전 n 저장을 n+1 로 바꾼다
const MIGRATIONS = {
  // 1: (s) => { s.새필드 = 기본값; return s; },
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
