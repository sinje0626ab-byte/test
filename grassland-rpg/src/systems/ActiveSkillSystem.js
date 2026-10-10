import * as THREE from 'three';

// 액티브 스킬: Q / R 슬롯에 등록해서 쓴다. 쿨다운·스태미나는 skills.json의 active.
// UI는 ctx.activeSkills { slots, cd }를 읽어 쿨다운 원을 그린다.
// 각인(skills.json runes, 끼운 것은 ctx.skillRunes[스킬 id]): 스킬마다 하나. cooldown·stamina 배율 + 스킬별 효과
export class ActiveSkillSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.activeSkills;
    this.defs = ctx.data.skills.skills;
    this.ranks = {};
    this.state = { slots: [null, null], cd: {} };
    ctx.activeSkills = this.state;
    this.heals = []; // 응급 처치: { left, perTick, tick }
    this.later = []; // 잠시 뒤에 할 일 (메아리 돌진): { t, fn }
    const { bus } = ctx;

    bus.on('skills:changed', ({ ranks }) => {
      this.ranks = ranks;
      const slots = this.state.slots;
      // 잊은 스킬은 슬롯에서 빼고, 새로 배운 액티브는 빈 슬롯에 자동으로
      for (let i = 0; i < slots.length; i++) if (slots[i] && !ranks[slots[i]]) slots[i] = null;
      for (const id of Object.keys(ranks)) {
        if (!this.defs[id]?.active || slots.includes(id)) continue;
        const free = slots.indexOf(null);
        if (free >= 0) slots[free] = id;
      }
      this.changed();
    });
    bus.on('skill:assign', ({ id, slot }) => this.assign(id, slot));
    bus.on('skill:unassign', ({ slot }) => {
      if (slot < 0 || slot >= this.state.slots.length) return;
      this.state.slots[slot] = null;
      this.changed();
    });
    bus.on('skill:cast', ({ slot }) => this.cast(slot));
    bus.on('player:died', () => { this.heals = []; this.later = []; });
    bus.on('save:collect', (save) => { save.skills = { ...(save.skills ?? {}), slots: [...this.state.slots] }; });
    bus.on('save:apply', (save) => {
      const saved = save.skills?.slots ?? [null, null];
      this.state.slots = saved.map((id) => (id && this.defs[id]?.active && this.ranks[id] ? id : null));
      this.changed();
    });
  }

  changed() {
    this.ctx.bus.emit('skills:slots', { slots: [...this.state.slots] });
  }

  // 슬롯에 등록 (다른 슬롯에 있던 같은 스킬은 자리를 바꾼다)
  assign(id, slot) {
    const slots = this.state.slots;
    if (!this.defs[id]?.active || !this.ranks[id] || slot < 0 || slot >= slots.length) return;
    const other = slots.indexOf(id);
    if (other >= 0) slots[other] = slots[slot];
    slots[slot] = id;
    this.changed();
  }

  cast(slot) {
    const { ctx } = this;
    const id = this.state.slots[slot];
    const p = ctx.player;
    if (!id || !p.alive || ctx.mode !== 'play' || ctx.state !== 'play') return;
    const def = this.defs[id];
    const a = def.active;
    const rank = this.ranks[id] ?? 0;
    if (!rank) return;
    if ((this.state.cd[id] ?? 0) > 0) return;
    const rune = this.rune(id);
    const stamina = a.stamina * (rune?.stamina ?? 1);
    if (p.stats.stamina < stamina) {
      ctx.bus.emit('notify', { text: '스태미나가 부족합니다', kind: 'warn' });
      return;
    }
    if (!this[id]?.(a, rank, rune)) return;
    p.stats.stamina -= stamina;
    if (stamina) p.staminaDelay = ctx.data.player.staminaRegenDelay;
    this.state.cd[id] = a.cooldown * (rune?.cooldown ?? 1);
    this.state.cdMax = { ...(this.state.cdMax ?? {}), [id]: this.state.cd[id] };
    ctx.bus.emit('skill:used', { id, position: p.position.clone() });
  }

  // 끼운 각인 정의 (없으면 null)
  rune(id) {
    const r = this.ctx.skillRunes?.[id];
    return r ? { id: r, ...this.ctx.data.skills.runes[r] } : null;
  }

  // 돌진 베기: 바라보는(PC는 마우스) 방향으로 돌진. 끝나면 지나간 길 위의 적을 벤다 (Player).
  // 각인: 맹독(베인 적 독) · 메아리(잠시 뒤 한 번 더) · 충격(끝자리 충격파)
  dash_slash(a, rank, rune) {
    const p = this.ctx.player;
    const aim = this.ctx.input.hasMouse && !this.ctx.input.touchMode ? this.ctx.mouseGround : p.nearestEnemy(a.distance + 2)?.position;
    const dir = p.facing.clone();
    if (aim) {
      const d = new THREE.Vector3(aim.x - p.position.x, 0, aim.z - p.position.z);
      if (d.lengthSq() > 0.01) dir.copy(d.normalize());
    }
    const s = p.stats;
    const hit = {
      attack: s.attack * (a.damage + a.damagePerRank * (rank - 1)),
      critChance: s.critChance, critMultiplier: p.base.critMultiplier + (s.critDamage ?? 0), knockback: a.knockback, weapon: 'dash',
    };
    if (rune?.id === 'rune_venom') hit.venom = { amount: s.attack * rune.dps, duration: rune.duration };
    if (rune?.id === 'rune_quake') hit.quake = { radius: rune.radius, attack: s.attack * rune.damage, knockback: rune.knockback };
    if (!p.startDash(dir, a, hit)) return false;
    if (rune?.id === 'rune_echo') {
      this.later.push({ t: a.duration + rune.delay, fn: () => p.startDash(dir, a, { ...hit, attack: hit.attack * rune.damage }) });
    }
    return true;
  }

  // 응급 처치: duration초 동안 나눠서 회복
  // 각인: 단단한 붕대(받는 피해 감소) · 급속(절반 바로, 쿨 감소) · 나눔(둘레 포탑·건물도)
  first_aid(a, rank, rune) {
    const { ctx } = this;
    const p = ctx.player;
    let total = p.stats.maxHp * (a.healPct + a.healPctPerRank * (rank - 1));
    if (rune?.instant) {
      ctx.bus.emit('player:heal', { amount: total * rune.instant });
      total *= 1 - rune.instant;
    }
    const ticks = Math.round(a.duration / this.cfg.healTick);
    this.heals.push({ left: ticks, perTick: total / ticks, tick: 0 });
    ctx.firstAidUntil = ctx.time.elapsed + a.duration; // HUD 버프 줄
    if (rune?.id === 'rune_guard') ctx.bus.emit('buff:add', { id: 'aid_guard', name: rune.name, color: rune.color, duration: a.duration, effects: { damageTaken: rune.damageTaken } });
    if (rune?.id === 'rune_share') {
      let n = 0;
      for (const st of ctx.structures) {
        if (!st.alive || !st.stats || st.position.distanceTo(p.position) > rune.radius) continue;
        st.stats.hp = Math.min(st.stats.maxHp, st.stats.hp + st.stats.maxHp * rune.pct);
        n += 1;
      }
      ctx.bus.emit('fx:ring', { position: p.position.clone(), color: rune.color });
      if (n) ctx.bus.emit('notify', { text: `나눔 처치: 건물 ${n}개 회복`, kind: 'item' });
    }
    return true;
  }

  // 포탑 과부하: 주변 포탑 연사 속도 배율 (TurretSystem)
  // 각인: 냉각(탄이 느리게) · 긴(지속 배율) · 연쇄(반경 배율, 스태미나 절반은 cast 가)
  overclock(a, rank, rune) {
    const p = this.ctx.player;
    const radius = a.radius * (rune?.radius ?? 1);
    const near = this.ctx.structures.filter((t) => t.kind === 'turret' && t.alive && t.position.distanceTo(p.position) <= radius);
    if (!near.length) {
      this.ctx.bus.emit('notify', { text: `주변 ${radius}m 안에 포탑이 없어요`, kind: 'warn' });
      return false;
    }
    const duration = Math.round((a.duration + a.durationPerRank * (rank - 1)) * (rune?.id === 'rune_long' ? rune.duration : 1));
    const chill = rune?.id === 'rune_frost' ? { slow: rune.slow, duration: rune.duration } : null;
    this.ctx.bus.emit('turret:overclock', { turrets: near, mult: a.fireRate, duration, chill });
    this.ctx.overclockUntil = this.ctx.time.elapsed + duration;
    this.ctx.bus.emit('notify', { text: `포탑 ${near.length}개 과부하! (${duration}초)`, kind: 'item' });
    return true;
  }

  update(dt) {
    const { cfg, state } = this;
    for (const [id, t] of Object.entries(state.cd)) state.cd[id] = Math.max(0, t - dt);
    const keys = cfg.keys;
    for (let i = 0; i < keys.length; i++) if (this.ctx.input.wasPressed(keys[i])) this.cast(i);

    for (const h of this.heals) {
      h.tick -= dt;
      if (h.tick > 0) continue;
      h.tick = cfg.healTick;
      h.left -= 1;
      this.ctx.bus.emit('player:heal', { amount: h.perTick });
    }
    this.heals = this.heals.filter((h) => h.left > 0);
    for (const l of this.later) if ((l.t -= dt) <= 0) l.fn();
    this.later = this.later.filter((l) => l.t > 0);
  }
}
