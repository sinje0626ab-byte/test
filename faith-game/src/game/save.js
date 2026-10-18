import { GAME } from '../config.js';
import { DEFAULT_EMBLEM } from '../religion/emblems.js';

// localStorage 저장. 실패해도(사생활 보호 모드 등) 게임은 계속된다.
// 저장 형식이 바뀌면 saveVersion을 올리고 MIGRATIONS에 변환 함수를 추가한다.
const MIGRATIONS = {
  1: (s) => ({ ...s, version: 2, religion: { ...s.religion, emblem: DEFAULT_EMBLEM } }), // 문양 추가
};

export function saveGame(state) {
  try {
    localStorage.setItem(GAME.saveKey, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  let s;
  try {
    const raw = localStorage.getItem(GAME.saveKey);
    if (!raw) return null;
    s = JSON.parse(raw);
  } catch {
    return null;
  }
  while (s && s.version < GAME.saveVersion && MIGRATIONS[s.version]) s = MIGRATIONS[s.version](s);
  if (!s || s.version !== GAME.saveVersion || !s.religion || !s.countries) return null;
  return s;
}

export function clearSave() {
  try { localStorage.removeItem(GAME.saveKey); } catch { /* 무시 */ }
}
