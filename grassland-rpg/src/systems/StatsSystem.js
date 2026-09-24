// 레벨·경험치·스킬 포인트, 그리고 최종 능력치 계산.
// 최종 = 기본(player.json) + 레벨 보너스 + 장비 보너스 + 스킬 효과 → ctx.player.stats
export class StatsSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.levels = ctx.data.levels;
    this.level = 1;
    this.xp = 0;
    this.skillPoints = 0;
    this.equipBonus = {};
    this.skillEffects = {};
    const { bus, data } = ctx;

    bus.on('monster:killed', ({ type }) => this.gain(data.monsters[type]?.xp ?? 0));
    bus.on('build:place', ({ kind, type }) => {
      const xp = kind === 'tent' ? data.buildings.baseLevels['1'].xp : data.turrets[type]?.xp;
      this.gain(xp ?? 0);
    });
    bus.on('base:upgraded', ({ level }) => this.gain(data.buildings.baseLevels[String(level)]?.xp ?? 0));
    bus.on('equipment:changed', ({ bonus }) => { this.equipBonus = bonus; this.recalc(); });
    bus.on('skills:changed', ({ effects }) => { this.skillEffects = effects; this.recalc(); });
    bus.on('stats:spend-point', (e) => {
      if (this.skillPoints <= 0) return;
      this.skillPoints -= 1;
      e.ok = true;
      this.emitChanged();
    });

    bus.on('save:collect', (save) => {
      save.stats = { level: this.level, xp: this.xp, skillPoints: this.skillPoints };
    });
    bus.on('save:apply', (save) => {
      if (!save.stats) return;
      this.level = save.stats.level;
      this.xp = save.stats.xp;
      this.skillPoints = save.stats.skillPoints;
      this.recalc();
    });

    this.recalc();
  }

  xpToNext(level = this.level) {
    if (level >= this.levels.maxLevel) return Infinity;
    return Math.round(this.levels.xpBase * this.levels.xpGrowth ** (level - 1));
  }

  gain(amount) {
    if (amount <= 0 || this.level >= this.levels.maxLevel) return;
    this.xp += amount;
    this.ctx.bus.emit('xp:gain', { amount, position: this.ctx.player.position.clone() });
    let leveled = false;
    while (this.xp >= this.xpToNext()) {
      this.xp -= this.xpToNext();
      this.level += 1;
      this.skillPoints += this.levels.skillPointsPerLevel;
      leveled = true;
      if (this.level >= this.levels.maxLevel) { this.xp = 0; break; }
    }
    if (!leveled) {
      this.emitChanged();
      return;
    }
    this.recalc();
    const s = this.ctx.player.stats;
    s.hp = s.maxHp;
    s.stamina = s.maxStamina;
    this.ctx.bus.emit('stats:levelup', { level: this.level, skillPoints: this.skillPoints });
  }

  recalc() {
    const b = this.ctx.data.player;
    const out = {
      maxHp: b.hp, maxStamina: b.stamina, attack: b.attack, defense: b.defense,
      moveSpeed: b.moveSpeed, critChance: b.critChance, hpRegen: b.hpRegen,
      attackSpeed: 0, moveSpeedPct: 0, spin: 0, gatherSpeed: 0, gatherAmount: 0,
      turretDamage: 0, turretRange: 0, buildCost: 0, extraTurrets: 0,
    };
    for (const [k, v] of Object.entries(this.levels.perLevel)) out[k] += v * (this.level - 1);
    for (const src of [this.equipBonus, this.skillEffects]) {
      for (const [k, v] of Object.entries(src)) out[k] = (out[k] ?? 0) + v;
    }
    out.moveSpeed *= 1 + out.moveSpeedPct;
    out.maxHp = Math.round(out.maxHp);
    out.maxStamina = Math.round(out.maxStamina);
    out.attack = Math.round(out.attack * 10) / 10;
    out.defense = Math.round(out.defense * 10) / 10;

    const s = this.ctx.player.stats;
    Object.assign(s, out);
    s.hp = Math.min(s.hp, s.maxHp);
    s.stamina = Math.min(s.stamina, s.maxStamina);
    this.emitChanged();
  }

  emitChanged() {
    this.ctx.bus.emit('stats:changed', {
      level: this.level,
      xp: this.xp,
      xpToNext: this.xpToNext(),
      skillPoints: this.skillPoints,
      stats: this.ctx.player.stats,
    });
  }
}
