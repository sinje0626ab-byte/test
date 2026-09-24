// 건축 스킬(ctx.player.stats)을 반영한 포탑 수치
export const turretCost = (def, stats) => Math.max(1, Math.round(def.cost * (1 - (stats.buildCost ?? 0))));
export const maxTurrets = (base, stats) => base.maxTurrets + (stats.extraTurrets ?? 0);
export const turretDamage = (def, stats) => def.damage * (1 + (stats.turretDamage ?? 0));
export const turretRange = (def, stats) => def.range + (stats.turretRange ?? 0);
