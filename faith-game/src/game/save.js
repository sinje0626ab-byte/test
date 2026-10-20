import { GAME, UNITY, LEADER } from '../config.js';
import { DEFAULT_EMBLEM } from '../religion/emblems.js';
import { seedState } from './rng.js';
import { world } from '../data/loader.js';
import { createCast, CAST_ORDER, CAST } from '../story/cast.js';

// localStorage 저장. 실패해도(사생활 보호 모드 등) 게임은 계속된다.
// 저장 형식이 바뀌면 saveVersion을 올리고 MIGRATIONS에 변환 함수를 추가한다.
const MIGRATIONS = {
  1: (s) => ({ ...s, version: 2, religion: { ...s.religion, emblem: DEFAULT_EMBLEM } }), // 문양 추가
  // 계시 시스템: 이전 저장은 계시 I~IV 를 이미 지난 것으로 보고 이어간다
  2: (s) => {
    const legacy = { turn: 0, picks: [], outcome: null, dark: 0, legacy: true };
    return {
      ...s,
      version: 3,
      religion: { ...s.religion, sanctuary: null, method: null },
      leader: { name: s.religion.founder, age: GAME.leaderAge.default + Math.floor(s.turn / LEADER.agingTurns), ageMonths: s.turn % LEADER.agingTurns, generation: 1, heir: null, rite: null, immortal: false, jailedUntil: null },
      unity: UNITY.start,
      riskPoints: 0,
      holySites: {},
      miracleReadyTurn: 0,
      flags: { ...(s.flags ?? {}) },
      extraModifiers: [],
      story: { done: { I: legacy, II: legacy, III: legacy, IV: legacy }, log: [{ kind: 'revelation', id: 'legacy', numeral: '—', title: '이전 기록', turn: 0, lines: ['이전 버전에서 이어진 교단입니다. 계시 I~IV 는 지난 것으로 봅니다.'], outcome: null, dark: 0 }] },
      incidents: { next: s.turn + 3, seen: {}, log: [] },
      units: (s.units ?? []).map((u) => ({ ...u, auto: false })),
      rng: seedState(),
      defeatReason: s.result === 'defeat' ? 'followers' : null,
    };
  },
  // 한국 고정 + 등장인물. 본거지가 아직 없으면 계시 II 에서 대한민국으로 정해진다.
  // 이미 다른 나라에서 하던 판은 그대로 둔다. 합류 조건을 이미 채운 사람은 합류한 것으로 본다.
  3: (s) => {
    const cast = createCast(s.leader?.age ?? GAME.leaderAge.default);
    if (s.religion.home) {
      for (const id of CAST_ORDER) if (CAST[id].joins(s)) cast[id] = { ...cast[id], status: 'active', since: s.turn };
    }
    const flags = { ...(s.flags ?? {}) };
    if (s.religion.home) {
      const abroad = Object.keys(s.countries).find((id) => id !== s.religion.home && s.countries[id].followers >= 1);
      if (abroad) flags.abroad = abroad;
    }
    return { ...s, version: 4, cast, flags };
  },
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
  // 데이터에 나라가 늘었거나 저장에 빠진 나라가 있으면 빈 상태로 채운다
  for (const id of world.ids) s.countries[id] ??= { followers: 0, aversion: 0, alert: 0, reachedTurn: null, lastDelta: 0 };
  return s;
}

export function clearSave() {
  try { localStorage.removeItem(GAME.saveKey); } catch { /* 무시 */ }
}
