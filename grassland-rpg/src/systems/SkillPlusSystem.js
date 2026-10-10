import * as THREE from 'three';

// 스킬 개편의 나머지 둘 (skills.json): 각인(runes)과 궁극기(ultimates).
// - 각인: 액티브 스킬마다 하나 끼운다 (ctx.skillRunes[스킬] = 각인 id, ActiveSkillSystem 이 읽는다).
//   얻기(runeDrops): 보스 처치 확정 · 황금 상자 30% · 은 상자 8% · 정예 2%. 아직 없는 것 중에서, 다 모았으면 골드
// - 궁극기: 처치·타격·맞기로 게이지(ultimate.max)를 채워 F(휴대폰 궁극기 단추)로 쓴다. 하나만 고른다.
//   해금: 별똥별 레벨 5, 숲의 결계·포탑 총공격·눈보라는 그 보스 처치
// - 핵심 별 「바람 개척자」: 구르고 나면 2초 바람 버프 (rollRush)
// ctx.ultimate = { gauge, max, equipped }. 저장 skills.runes { owned, equipped } · skills.ult { owned, equipped, gauge }
const FALL = 0.38; // 별똥별이 떨어지는 시간
export class SkillPlusSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.data = ctx.data.skills;
    this.cfg = this.data.ultimate;
    this.owned = new Set();
    this.equipped = {};
    ctx.skillRunes = this.equipped;
    this.ult = { owned: new Set(), equipped: null, gauge: 0 };
    ctx.ultimate = { gauge: 0, max: this.cfg.max, equipped: null };
    this.timers = [];
    this.meteors = [];
    this.hitBudget = 0;
    this.readyNotified = false;
    const { bus } = ctx;

    bus.on('rune:equip', ({ skill, rune }) => this.equip(skill, rune));
    bus.on('ult:equip', ({ id }) => {
      if (id && !this.ult.owned.has(id)) return;
      this.ult.equipped = id;
      this.changed();
    });
    bus.on('ult:cast', () => this.cast());

    // 각인 얻기
    const drops = this.data.runeDrops;
    bus.on('monster:killed', (e) => {
      if (e.noLoot) return;
      if (e.boss) {
        for (let i = 0; i < drops.boss; i++) this.grant('보스');
        this.unlockBoss(e.type);
      } else if (e.elite && Math.random() < drops.elite) this.grant('정예');
      // 궁극기 게이지
      this.gain(e.boss ? this.cfg.boss : e.elite ? this.cfg.elite : this.cfg.kill);
    });
    bus.on('chest:opened', ({ type }) => {
      const chance = drops[type] ?? 0;
      if (Math.random() < chance) this.grant('상자');
    });
    bus.on('combat:hit', (e) => {
      if (e.target !== 'monster' || e.source !== 'player' || this.hitBudget <= 0) return;
      this.hitBudget -= this.cfg.hit;
      this.gain(this.cfg.hit);
    });
    bus.on('player:damaged', ({ amount }) => {
      const max = ctx.player.stats.maxHp || 1;
      this.gain((amount / max) * 100 * this.cfg.damaged);
    });
    bus.on('stats:changed', ({ level }) => this.unlockLevel(level));
    // 핵심 별 바람 개척자
    bus.on('player:roll', () => {
      if (!ctx.player.stats.rollRush) return;
      bus.emit('buff:add', { id: 'wind_rush', name: '바람 타기', color: '#9fd6fb', duration: 2, effects: { moveSpeedPct: 0.3, attackPct: 0.2 } });
    });
    bus.on('player:died', () => { this.timers = []; });

    bus.on('game:new', () => this.reset());
    bus.on('save:collect', (save) => {
      save.skills = {
        ...(save.skills ?? {}),
        runes: { owned: [...this.owned], equipped: { ...this.equipped } },
        ult: { owned: [...this.ult.owned], equipped: this.ult.equipped, gauge: Math.round(this.ult.gauge) },
      };
    });
    bus.on('save:apply', (save) => {
      this.reset(false);
      const r = save.skills?.runes;
      for (const id of r?.owned ?? []) if (this.data.runes[id]) this.owned.add(id);
      for (const [sk, id] of Object.entries(r?.equipped ?? {})) if (this.owned.has(id) && this.data.runes[id].skill === sk) this.equipped[sk] = id;
      const u = save.skills?.ult;
      for (const id of u?.owned ?? []) if (this.data.ultimates[id]) this.ult.owned.add(id);
      // 이미 잡은 보스의 궁극기 (예전 저장)
      for (const b of Object.keys(save.bosses ?? {})) this.unlockBoss(b, false);
      this.unlockLevel(save.stats?.level ?? 1, false);
      this.ult.equipped = u?.equipped && this.ult.owned.has(u.equipped) ? u.equipped : this.ult.equipped;
      this.ult.gauge = Math.min(this.cfg.max, u?.gauge ?? 0);
      this.changed();
      // 스킬 개편으로 돌려받은 포인트 알림 (v13 → v14)
      if (save.skillsRefunded) {
        const n = save.skillsRefunded;
        setTimeout(() => bus.emit('notify', { text: `스킬이 별자리로 새로워졌어요! 찍어 둔 포인트 ${n}개를 돌려받았어요 (K)`, kind: 'item' }), 1500);
        delete save.skillsRefunded;
      }
    });
  }

  reset(emit = true) {
    this.owned.clear();
    for (const k of Object.keys(this.equipped)) delete this.equipped[k];
    this.ult = { owned: new Set(), equipped: null, gauge: 0 };
    this.timers = [];
    if (emit) { this.unlockLevel(1, false); this.changed(); }
  }

  // ── 각인 ──
  grant(source) {
    const { bus } = this.ctx;
    const left = Object.keys(this.data.runes).filter((id) => !this.owned.has(id));
    if (!left.length) {
      bus.emit('economy:reward', { amount: this.data.runeDrops.dupGold });
      bus.emit('notify', { text: `각인을 모두 모았어요! 대신 골드 +${this.data.runeDrops.dupGold}`, kind: 'gold' });
      return;
    }
    const id = left[Math.floor(Math.random() * left.length)];
    const r = this.data.runes[id];
    this.owned.add(id);
    const skill = this.data.skills[r.skill];
    // 그 스킬에 끼운 각인이 없으면 바로 끼운다
    if (!this.equipped[r.skill]) this.equipped[r.skill] = id;
    bus.emit('notify', { text: `새 각인 「${r.name}」 (${skill.name}) — ${source}에서 얻었어요! 스킬 창(K)`, kind: 'item', color: r.color });
    bus.emit('rune:gained', { id });
    this.changed();
  }

  equip(skill, rune) {
    if (rune && (!this.owned.has(rune) || this.data.runes[rune].skill !== skill)) return;
    if (rune) this.equipped[skill] = rune;
    else delete this.equipped[skill];
    this.changed();
  }

  // ── 궁극기 ──
  unlockLevel(level, notify = true) {
    for (const [id, u] of Object.entries(this.data.ultimates)) if (u.unlock.level && level >= u.unlock.level) this.give(id, notify);
  }

  unlockBoss(type, notify = true) {
    for (const [id, u] of Object.entries(this.data.ultimates)) if (u.unlock.boss === type) this.give(id, notify);
  }

  give(id, notify) {
    if (this.ult.owned.has(id)) return;
    this.ult.owned.add(id);
    if (!this.ult.equipped) this.ult.equipped = id;
    if (notify && this.ctx.state === 'play') this.ctx.bus.emit('notify', { text: `궁극기 「${this.data.ultimates[id].name}」 해금! 게이지가 차면 F`, kind: 'item', color: this.data.ultimates[id].color });
    this.changed();
  }

  gain(n) {
    if (!this.ult.equipped || !n || this.ctx.state !== 'play') return;
    const before = this.ult.gauge;
    this.ult.gauge = Math.min(this.cfg.max, before + n);
    this.ctx.ultimate.gauge = this.ult.gauge;
    if (before < this.cfg.max && this.ult.gauge >= this.cfg.max) {
      this.ctx.bus.emit('notify', { text: `궁극기 「${this.data.ultimates[this.ult.equipped].name}」 준비! (${this.cfg.label})`, kind: 'item', color: '#b48cf0' });
      this.ctx.bus.emit('ult:ready', {});
    }
  }

  cast() {
    const { ctx } = this;
    const id = this.ult.equipped;
    const p = ctx.player;
    if (!id || !p.alive || ctx.mode !== 'play' || ctx.state !== 'play') return;
    if (this.ult.gauge < this.cfg.max) {
      ctx.bus.emit('notify', { text: `궁극기 게이지 ${Math.floor(this.ult.gauge)}/${this.cfg.max} — 싸우면 차올라요`, kind: 'warn' });
      return;
    }
    if (!this[id](this.data.ultimates[id])) return;
    this.ult.gauge = 0;
    ctx.ultimate.gauge = 0;
    ctx.bus.emit('ult:used', { id, position: p.position.clone() });
    ctx.bus.emit('player:shock', { position: p.position.clone(), radius: 4 });
  }

  hitStats(mult) {
    const p = this.ctx.player;
    const s = p.stats;
    return { attack: s.attack * mult, critChance: s.critChance, critMultiplier: p.base.critMultiplier + (s.critDamage ?? 0), knockback: 6, weapon: 'dash' };
  }

  // 별똥별: 가까운 적 위로 차례로 (적이 없으면 둘레 아무 데나)
  meteor(u) {
    const { ctx } = this;
    const p = ctx.player.position;
    const targets = ctx.monsters.filter((m) => m.alive && !m.untargetable && m.position.distanceTo(p) <= u.range)
      .sort((a, b) => a.position.distanceTo(p) - b.position.distanceTo(p)).slice(0, u.count).map((m) => m.position.clone());
    while (targets.length < Math.min(3, u.count)) {
      const a = Math.random() * Math.PI * 2;
      const d = 2 + Math.random() * (u.range - 3);
      targets.push(new THREE.Vector3(p.x + Math.cos(a) * d, 0, p.z + Math.sin(a) * d));
    }
    targets.forEach((at, i) => this.dropStar(at, u, i * u.interval));
    return true;
  }

  dropStar(at, u, delay) {
    const mesh = new THREE.Mesh(STAR_GEO, STAR_MAT);
    mesh.visible = false;
    this.ctx.scene.add(mesh);
    const glow = new THREE.Mesh(GLOW_GEO, GLOW_MAT);
    mesh.add(glow);
    this.meteors.push({ mesh, at: at.clone().setY(0), t: -delay, u });
  }

  // 숲의 결계: 받는 피해 감소 버프 + 매초 회복·둘레 감속
  sanctuary(u) {
    const { ctx } = this;
    ctx.bus.emit('buff:add', { id: 'sanctuary', name: u.name, color: u.color, duration: u.duration, effects: { damageTaken: u.damageTaken } });
    for (let i = 0; i < u.duration; i++) {
      this.timers.push({
        t: i,
        fn: () => {
          const p = ctx.player;
          ctx.bus.emit('player:heal', { amount: p.stats.maxHp * u.healPct });
          ctx.bus.emit('fx:ring', { position: p.position.clone(), color: u.color });
          for (const m of ctx.monsters) if (m.alive && m.position.distanceTo(p.position) <= u.radius) ctx.bus.emit('status:apply', { target: m, type: 'slow', duration: 1.3, amount: u.slow });
        },
      });
    }
    return true;
  }

  // 포탑 총공격: 둘레 포탑 연사 + 포탑 피해 버프
  barrage(u) {
    const { ctx } = this;
    const p = ctx.player;
    const near = ctx.structures.filter((t) => t.kind === 'turret' && t.alive && t.position.distanceTo(p.position) <= u.radius);
    if (!near.length) {
      ctx.bus.emit('notify', { text: `주변 ${u.radius}m 안에 포탑이 없어요`, kind: 'warn' });
      return false;
    }
    ctx.bus.emit('turret:overclock', { turrets: near, mult: u.fireRate, duration: u.duration });
    ctx.bus.emit('buff:add', { id: 'barrage', name: u.name, color: u.color, duration: u.duration, effects: { turretDamage: u.turretDamage } });
    ctx.overclockUntil = ctx.time.elapsed + u.duration;
    ctx.bus.emit('notify', { text: `포탑 ${near.length}개 총공격! (${u.duration}초)`, kind: 'item' });
    return true;
  }

  // 눈보라: 둘레 모두 피해 + 빙결 (보스는 감속)
  blizzard(u) {
    const { ctx } = this;
    const p = ctx.player.position.clone();
    ctx.bus.emit('player:area', { ...this.hitStats(u.damage), position: p, radius: u.radius, effect: { type: 'freeze', duration: u.freeze } });
    for (let i = 0; i < 3; i++) this.timers.push({ t: i * 0.15, fn: () => ctx.bus.emit('fx:ring', { position: p, color: u.color }) });
    ctx.bus.emit('fx:stars', { position: p });
    return true;
  }

  changed() {
    const { ctx } = this;
    ctx.ultimate.equipped = this.ult.equipped;
    ctx.ultimate.gauge = this.ult.gauge;
    ctx.bus.emit('runes:changed', { owned: [...this.owned], equipped: { ...this.equipped } });
    ctx.bus.emit('ult:changed', { owned: [...this.ult.owned], equipped: this.ult.equipped, gauge: this.ult.gauge });
  }

  update(dt) {
    if (this.ctx.input.wasPressed(this.cfg.key)) this.cast();
    this.hitBudget = Math.min(this.cfg.hitCap, this.hitBudget + dt * this.cfg.hitCap); // 타격 게이지는 초당 hitCap 까지
    for (const t of this.timers) if ((t.t -= dt) <= 0) t.fn();
    this.timers = this.timers.filter((t) => t.t > 0);
    // 별똥별: 하늘에서 비스듬히 떨어져 땅에 닿으면 터진다
    for (const m of this.meteors) {
      m.t += dt;
      if (m.t < 0) continue;
      const k = Math.min(1, m.t / FALL);
      m.mesh.visible = true;
      m.mesh.position.set(m.at.x - 4 * (1 - k), 12 * (1 - k) + 0.3, m.at.z - 3 * (1 - k));
      m.mesh.rotation.set(m.t * 9, m.t * 7, 0);
      if (k >= 1 && !m.done) {
        m.done = true;
        this.ctx.scene.remove(m.mesh);
        this.ctx.bus.emit('player:area', { ...this.hitStats(m.u.damage), position: m.at, radius: m.u.radius });
        this.ctx.bus.emit('fx:ring', { position: m.at.clone(), color: m.u.color });
        this.ctx.bus.emit('fx:stars', { position: m.at.clone() });
        this.ctx.bus.emit('player:shock', { position: m.at.clone(), radius: m.u.radius });
      }
    }
    this.meteors = this.meteors.filter((m) => !m.done);
  }
}

const STAR_GEO = new THREE.OctahedronGeometry(0.42, 0);
const STAR_MAT = new THREE.MeshBasicMaterial({ color: '#ffe08a' });
const GLOW_GEO = new THREE.IcosahedronGeometry(0.75, 1);
const GLOW_MAT = new THREE.MeshBasicMaterial({ color: '#fff3c4', transparent: true, opacity: 0.35, depthWrite: false });
