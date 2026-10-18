import { UNITS, UNIT_COST_GROWTH, SPAWN_MIN_FOLLOWERS, SEA_RANGE, STAGES } from '../config.js';
import { world } from '../data/loader.js';
import { UNIT_TYPES } from './unitTypes.js';
import { ABILITIES } from './abilities.js';

export function unitCost(state, type) {
  return Math.round(UNITS[type].cost * (1 + UNIT_COST_GROWTH * state.units.length));
}

// 현재 단계까지 해금된 유닛
export function unlockedTypes(state) {
  const idx = STAGES.findIndex((s) => s.id === state.stage);
  return new Set(STAGES.slice(0, idx + 1).flatMap((s) => s.unlock));
}

export function unlockStage(type) {
  return STAGES.find((s) => s.unlock.includes(type));
}

// 생산할 수 없으면 이유(문자열), 가능하면 null
export function spawnBlocker(state, type, at) {
  if (!unlockedTypes(state).has(type)) return `${unlockStage(type)?.name} 단계에서 해금`;
  if (!at || state.countries[at].followers < SPAWN_MIN_FOLLOWERS) return `신도 ${SPAWN_MIN_FOLLOWERS}명 이상인 나라에서만 생산`;
  if (state.faith < unitCost(state, type)) return '신앙력 부족';
  return null;
}

export function createUnit(state, type, at) {
  const unit = { id: `u${state.nextUnitId++}`, type, at, moved: false, acted: false };
  if (type === 'missionary') unit.usesLeft = UNITS.missionary.uses;
  return unit;
}

export function spawnUnit(state, type, at) {
  const blocker = spawnBlocker(state, type, at);
  if (blocker) return { ok: false, message: blocker };
  state.faith -= unitCost(state, type);
  const unit = createUnit(state, type, at);
  state.units.push(unit);
  return { ok: true, unit };
}

// 이동 가능한 나라: 육로 이웃 + 바다 건너 SEA_RANGE칸 이내
export function reachable(fromId) {
  const c = world.countries[fromId];
  const out = new Map(); // id → 'land' | 'sea'
  for (const n of c.land) out.set(n, 'land');
  let frontier = [fromId];
  const seen = new Set([fromId]);
  for (let step = 0; step < SEA_RANGE; step++) {
    const next = [];
    for (const id of frontier) {
      for (const n of world.countries[id].sea) {
        if (seen.has(n)) continue;
        seen.add(n);
        next.push(n);
        if (!out.has(n)) out.set(n, 'sea');
      }
    }
    frontier = next;
  }
  out.delete(fromId);
  return out;
}

export function moveUnit(state, unitId, to) {
  const unit = state.units.find((u) => u.id === unitId);
  if (!unit) return { ok: false, message: '유닛이 없습니다.' };
  if (unit.moved) return { ok: false, message: '이번 달에는 이미 이동했습니다.' };
  if (!reachable(unit.at).has(to)) return { ok: false, message: '그곳까지는 갈 수 없습니다.' };
  unit.at = to;
  unit.moved = true;
  return { ok: true, unit };
}

export function canAct(unit) {
  return Boolean(ABILITIES[unit.type]?.act) && !unit.acted;
}

export function actUnit(state, unitId) {
  const unit = state.units.find((u) => u.id === unitId);
  if (!unit) return { ok: false, message: '유닛이 없습니다.' };
  const ability = ABILITIES[unit.type];
  if (!ability?.act) return { ok: false, message: `${UNIT_TYPES[unit.type].name}은(는) 자동으로 활동합니다.` };
  if (unit.acted) return { ok: false, message: '이번 달에는 이미 활동했습니다.' };
  const result = ability.act(state, unit);
  unit.acted = true;
  if (result.consumed) state.units = state.units.filter((u) => u !== unit);
  return { ...result, unit };
}

// 매 턴: 지속 효과 실행 + 행동 상태 초기화
export function unitsOnTurn(state) {
  let converted = 0;
  for (const unit of state.units) {
    const on = ABILITIES[unit.type]?.onTurn;
    if (on) converted += on(state, unit);
  }
  return converted;
}

export function resetUnits(state) {
  for (const unit of state.units) { unit.moved = false; unit.acted = false; }
}

// 나라별 이탈 감소율 (여러 수호자가 있으면 가장 큰 값)
export function attritionShield(state, id) {
  let best = 0;
  for (const unit of state.units) {
    if (unit.at !== id) continue;
    const fn = ABILITIES[unit.type]?.attritionShield;
    if (fn) best = Math.max(best, fn(state, unit));
  }
  return best;
}
