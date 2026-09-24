import * as THREE from 'three';
import { Boss } from '../entities/Boss.js';
import { markCircle } from '../entities/behaviors/common.js';

// 밤의 군주 (config.nightLord): 네 지역 보스를 모두 잡으면 다음 붉은 달에 가장 큰 기지로 온다.
// 하늘이 캄캄해지고 별이 쏟아진다. 3페이즈 파도 패턴도 여기서. 쓰러뜨리면 해돋이 → 엔딩.
export class NightLordSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.nightLord;
    this.cleared = new Set();
    this.defeated = false;
    this.boss = null;
    this.waves = [];
    this.starTimer = 0;
    this.sunrise = null;
    const { bus } = ctx;
    bus.on('boss:status', ({ list }) => { for (const b of list) if (b.cleared) this.cleared.add(b.id); });
    bus.on('boss:defeated', ({ id }) => { if (id !== 'night_lord') this.cleared.add(id); });
    bus.on('raid:planning', (e) => this.plan(e));
    bus.on('nightlord:spawn', (e) => this.spawn(e));
    bus.on('boss:wave', (e) => this.addWave(e));
    bus.on('monster:killed', ({ type, position }) => { if (type === this.cfg.monster) this.onDefeated(position); });
    bus.on('time:day', () => this.clearBoss());
    bus.on('save:collect', (save) => { save.nightLord = { defeated: this.defeated }; });
    bus.on('save:apply', (save) => { this.defeated = !!save.nightLord?.defeated; });
    bus.on('game:new', () => { this.defeated = false; });
  }

  get due() {
    return !this.defeated && !this.boss && this.cfg.regionBosses.every((id) => this.cleared.has(id));
  }

  // 붉은 달 습격을 짤 때: 가장 레벨 높은 기지의 습격을 밤의 군주 습격으로 (멀리 있어도 실시간)
  plan({ raids, bloodMoon }) {
    if (!bloodMoon || !this.due || !raids.length) return;
    const raid = raids.slice().sort((a, b) => b.base.level - a.base.level)[0];
    raid.nightLord = true;
    if (raid.remote) {
      raid.remote = false;
      raid.toSpawn = raid.waves[0];
    }
    this.ctx.bus.emit('notify', { text: `밤의 군주가 ${raid.base.label}(으)로 오고 있습니다!`, kind: 'warn' });
  }

  spawn({ raid, spot }) {
    const { ctx, cfg } = this;
    const base = raid.base;
    const def = { ...cfg, lair: [base.position.x, base.position.z] };
    const pos = spot ?? base.position.clone().add(new THREE.Vector3(base.areaRadius + cfg.spawnOffset, 0, 0));
    const b = new Boss(ctx, 'night_lord', def, { position: pos });
    b.setState('chase');
    ctx.monsters.push(b);
    raid.monsters.push(b);
    this.boss = b;
    ctx.nightLord = b; // World가 하늘을 캄캄하게
    ctx.bus.emit('nightlord:arrived', { boss: b });
    ctx.bus.emit('notify', { text: '밤의 군주가 나타났습니다!', kind: 'warn' });
  }

  clearBoss() {
    if (this.boss && this.boss.alive) {
      this.boss.done = true;
      this.boss.alive = false;
      this.boss.setEngaged(false);
    }
    this.boss = null;
    this.ctx.nightLord = null;
  }

  // ── 3페이즈 파도: 보스 둘레에 원형 예고가 차례로 퍼진다 ──
  addWave({ origin, rings, spacing, interval, width, damage }) {
    const marks = [];
    for (let i = 0; i < rings; i++) {
      const r = (i + 1) * spacing;
      const m = new THREE.Mesh(
        new THREE.RingGeometry(Math.max(0.1, r - width / 2), r + width / 2, 48).rotateX(-Math.PI / 2),
        markCircle(1).material.clone(),
      );
      m.position.set(origin.x, 0.06, origin.z);
      m.visible = false;
      this.ctx.scene.add(m);
      marks.push({ mesh: m, r, at: i * interval });
    }
    this.waves.push({ origin, marks, t: 0, interval, width, damage });
  }

  updateWaves(dt) {
    const p = this.ctx.player;
    for (const w of this.waves) {
      w.t += dt;
      for (const m of w.marks) {
        if (m.hit) continue;
        const k = (w.t - m.at) / w.interval; // 0~1: 예고, 1: 터짐
        m.mesh.visible = k >= 0;
        m.mesh.material.opacity = 0.15 + 0.4 * Math.max(0, Math.min(1, k));
        if (k < 1) continue;
        m.hit = true;
        m.mesh.visible = false;
        this.ctx.bus.emit('boss:wave-ring', { position: w.origin, radius: m.r });
        const d = Math.hypot(p.position.x - w.origin.x, p.position.z - w.origin.z);
        if (Math.abs(d - m.r) <= w.width / 2 + p.radius) {
          const dir = new THREE.Vector3(p.position.x - w.origin.x, 0, p.position.z - w.origin.z).normalize();
          this.ctx.bus.emit('enemy:hit-player', { damage: w.damage, dir });
        }
      }
    }
    for (const w of this.waves) if (w.marks.every((m) => m.hit)) for (const m of w.marks) this.ctx.scene.remove(m.mesh);
    this.waves = this.waves.filter((w) => !w.marks.every((m) => m.hit));
  }

  // 쓰러뜨리면: 해돋이 → 다음 날 아침 → 엔딩
  onDefeated(position) {
    const { bus } = this.ctx;
    this.defeated = true;
    this.boss = null;
    bus.emit('boss:defeated', { id: 'night_lord', name: this.cfg.name, position });
    for (const w of this.waves) for (const m of w.marks) this.ctx.scene.remove(m.mesh);
    this.waves = [];
    this.sunrise = 0;
  }

  update(dt) {
    const { ctx } = this;
    if (ctx.nightLord?.alive) {
      this.starTimer -= dt;
      if (this.starTimer <= 0) {
        this.starTimer = this.cfg.starInterval;
        const p = ctx.player.position;
        ctx.bus.emit('fx:stars', { position: new THREE.Vector3(p.x + (Math.random() - 0.5) * 30, 9, p.z + (Math.random() - 0.5) * 22) });
      }
    }
    if (this.waves.length) this.updateWaves(dt);
    if (this.sunrise != null) {
      this.sunrise += dt / this.cfg.sunrise;
      ctx.sunrise = Math.min(1, this.sunrise);
      if (this.sunrise >= 1) {
        this.sunrise = null;
        ctx.sunrise = null;
        ctx.nightLord = null;
        // 다음 날 아침으로 (습격 정산도 이때)
        ctx.time.advance(ctx.time.cycle - ctx.time.clock + 0.01);
        const stats = { days: ctx.time.day, bases: ctx.bases.length, kills: 0, name: ctx.player.appearance.name };
        ctx.bus.emit('ending:stats', stats); // 도감이 처치 수를 채운다
        ctx.bus.emit('ending:start', stats);
      }
    }
  }
}

