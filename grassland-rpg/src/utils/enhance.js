// 장비 강화 (config.enhance): 단계마다 기본 능력치 +12%. 켜고 끄는 능력치(감속 면역 등)는 그대로.
export function enhancedBonus(data, bonus, plus = 0) {
  if (!plus || !bonus) return bonus ?? {};
  const c = data.config.enhance;
  const k = 1 + c.statPerPlus * plus;
  return Object.fromEntries(Object.entries(bonus).map(([key, v]) => [key, c.noScale.includes(key) ? v : v * k]));
}

// plus → plus+1 비용. 최고 단계면 null
export function enhanceCost(data, plus = 0) {
  const c = data.config.enhance;
  if (plus >= c.max) return null;
  return { gold: c.gold[plus], items: [{ id: c.oreItem, count: c.ore[plus] }] };
}

export const plusName = (name, plus) => (plus ? `${name} +${plus}` : name);
