import { UNIT_TYPES } from '../units/unitTypes.js';
import { canAct } from '../units/units.js';

// 게임 상태의 유닛 목록 → 지도 핀 데이터.
// 같은 나라에 있는 유닛은 종류별로 한 핀으로 묶고 개수를 표시한다.
export function unitPins(state, selectedUnitId, onPick) {
  const groups = new Map();
  for (const u of state.units) {
    const key = `${u.at}:${u.type}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(u);
  }
  const perCountry = new Map();
  const pins = [];
  for (const [key, list] of groups) {
    const at = list[0].at;
    const idx = perCountry.get(at) ?? 0;
    perCountry.set(at, idx + 1);
    const selected = list.some((u) => u.id === selectedUnitId);
    const ready = list.some((u) => !u.moved || canAct(u));
    pins.push({
      key, at,
      icon: UNIT_TYPES[list[0].type].icon,
      count: list.length,
      selected, ready,
      index: idx,
      onClick: () => onPick(selected ? list[(list.findIndex((u) => u.id === selectedUnitId) + 1) % list.length].id : list[0].id),
    });
  }
  // 한 나라에 여러 종류가 있으면 가로로 나란히
  for (const p of pins) {
    const n = perCountry.get(p.at);
    p.offset = (p.index - (n - 1) / 2) * 26;
  }
  return pins;
}
