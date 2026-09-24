// 건축 스킬(ctx.player.stats)과 포탑 레벨을 반영한 포탑 수치
export const turretCost = (def, stats) => Math.max(1, Math.round(def.cost * (1 - (stats.buildCost ?? 0))));
export const maxTurrets = (base, stats) => base.maxTurrets + (stats.extraTurrets ?? 0);
export const turretDamage = (def, stats, level = 1) =>
  def.damage * (1 + (stats.turretDamage ?? 0)) * (1 + def.damagePerLevel * (level - 1));
export const turretRange = (def, stats, level = 1) =>
  def.range + (stats.turretRange ?? 0) + def.rangePerLevel * (level - 1);
export const turretMaxHp = (def, level = 1) => Math.round(def.hp * (1 + def.hpPerLevel * (level - 1)));
export const upgradeCost = (def, level) => def.upgradeCosts[level - 1] ?? null;
export const repairCost = (t) => Math.ceil((t.stats.maxHp - t.stats.hp) * t.def.repairCostPerHp);
// 철거 환급: 설치비 + 지금까지 쓴 업그레이드비의 일부
export const demolishRefund = (t, stats, ratio) => {
  const spent = turretCost(t.def, stats) + t.def.upgradeCosts.slice(0, t.level - 1).reduce((a, b) => a + b, 0);
  return Math.floor(spent * ratio);
};
