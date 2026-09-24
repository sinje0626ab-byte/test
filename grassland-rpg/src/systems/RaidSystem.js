import * as THREE from 'three';
import { RaidMonster } from '../entities/RaidMonster.js';
import { rand } from '../utils/random.js';
import { turretDamage } from '../utils/build.js';

// 밤 습격 (실시간). 원격 기지 계산 처리는 Phase 5.
export class RaidSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.raid;
    this.raids = [];
    const { bus } = ctx;

    bus.on('time:dusk', () => {
      const text = ctx.bases.length ? '곧 해가 집니다. 습격에 대비하세요!' : '곧 해가 집니다. 밤엔 몬스터가 강해져요';
      bus.emit('notify', { text, kind: 'warn' });
    });
    bus.on('time:night', ({ day }) => this.startRaids(day));
    bus.on('time:day', ({ day }) => this.finishRaids(day));
    bus.on('structure:destroyed', ({ structure }) => {
      if (structure.kind !== 'tent') return;
      const raid = this.raids.find((r) => r.base.id === structure.baseId && r.status === 'active');
      if (raid) this.fail(raid);
    });
  }

  raidSize(base, day) {
    const c = this.cfg;
    const region = base.region;
    const n = c.baseCount + base.level * c.perBaseLevel + region.difficulty * c.perRegionDifficulty + (day - 1) * c.perDay;
    return Math.min(c.maxCount, Math.round(n));
  }

  startRaids(day) {
    const { bases, bus } = this.ctx;
    if (!bases.length) {
      bus.emit('notify', { text: '밤이 되었습니다. 몬스터가 강해집니다', kind: 'warn' });
      return;
    }
    const player = this.ctx.player;
    for (const base of bases) {
      const total = this.raidSize(base, day);
      // 플레이어가 곁에 있는 기지만 실시간, 나머지는 아침에 계산으로 정산
      const near = player.alive && player.position.distanceTo(base.position) <= base.areaRadius + this.cfg.presenceMargin;
      this.raids.push({ base, day, total, toSpawn: near ? total : 0, timer: 0, monsters: [], status: 'active', remote: !near });
    }
    const live = this.raids.filter((r) => !r.remote);
    const remote = this.raids.length - live.length;
    if (live.length) bus.emit('raid:start', { day, count: live.reduce((n, r) => n + r.total, 0) });
    if (remote) bus.emit('notify', { text: `멀리 있는 기지 ${remote}곳도 습격당하고 있어요 (결과는 아침에)`, kind: 'warn' });
  }

  spawnOne(raid) {
    const { world } = this.ctx;
    const b = raid.base;
    for (let tries = 0; tries < 10; tries++) {
      const a = rand.range(0, Math.PI * 2);
      const r = b.areaRadius + this.cfg.spawnOffset;
      const x = b.position.x + Math.cos(a) * r;
      const z = b.position.z + Math.sin(a) * r;
      if (!world.isInside(x, z, 3) || world.isBlocked(x, z, 1)) continue;
      const m = new RaidMonster(this.ctx, b.region.raidMonster, new THREE.Vector3(x, 0, z), b);
      m.scaleStats(this.statScale(raid));
      this.ctx.monsters.push(m);
      raid.monsters.push(m);
      return true;
    }
    return false;
  }

  statScale(raid) {
    return (1 + (raid.day - 1) * this.cfg.statScalePerDay) * raid.base.region.statMultiplier;
  }

  // 원격 기지: 포탑 화력 × 시간 vs 습격 몬스터 체력 합
  resolveRemote(raid) {
    const c = this.cfg;
    const stats = this.ctx.player.stats;
    const turrets = this.ctx.structures.filter((s) => s.kind === 'turret' && s.baseId === raid.base.id && s.alive);
    const dps = turrets.reduce((sum, t) => sum + turretDamage(t.def, stats, t.level) * t.def.fireRate * (t.def.aoeFactor ?? 1), 0);
    const mdef = this.ctx.data.monsters[raid.base.region.raidMonster];
    const waveHp = raid.total * mdef.hp * this.statScale(raid);
    const ratio = waveHp > 0 ? (dps * c.remoteFightSeconds) / waveHp : 1;
    raid.killed = Math.min(raid.total, Math.floor(raid.total * ratio));
    if (ratio >= 1) {
      raid.status = 'cleared';
      return;
    }
    for (const t of turrets) {
      const destroyed = t.takeDamage(t.stats.maxHp * (1 - ratio) * c.remoteTurretDamage);
      if (destroyed) this.ctx.bus.emit('structure:destroyed', { structure: t });
    }
    if (ratio >= c.remotePartialRatio) {
      raid.status = 'partial';
    } else {
      raid.status = 'failed';
      this.loseGoods(raid.base, `${raid.base.label}이(가) 습격에 무너졌습니다!`);
    }
  }

  // 창고가 있으면 창고 재료를, 없으면 소지 골드 일부를 잃는다.
  loseGoods(base, text) {
    const e = { baseId: base.id, ratio: this.cfg.failStorageLossRatio, handled: false, lost: 0 };
    this.ctx.bus.emit('storage:lose', e);
    if (e.handled) this.ctx.bus.emit('notify', { text: `${text} 창고 재료 ${e.lost}개를 빼앗겼어요`, kind: 'warn' });
    else this.ctx.bus.emit('economy:lose', { ratio: this.cfg.failGoldLossRatio, text: `${text} 골드를 빼앗겼어요` });
  }

  fail(raid) {
    raid.status = 'failed';
    raid.toSpawn = 0;
    for (const m of raid.monsters) m.retreat();
    this.loseGoods(raid.base, `${raid.base.label}의 중심 건물이 무너졌습니다!`);
  }

  // 아침: 결과 정산 + 남은 몬스터는 물러간다.
  finishRaids(day) {
    if (!this.raids.length) return;
    const results = [];
    for (const raid of this.raids) {
      if (raid.remote) this.resolveRemote(raid);
      for (const m of raid.monsters) m.retreat();
      const killed = raid.remote ? raid.killed : raid.monsters.filter((m) => !m.alive && m.state === 'dead').length;
      let status = raid.status;
      if (status === 'active') status = 'partial';
      let reward = 0;
      if (status === 'cleared') {
        reward = this.cfg.rewardBase + raid.total * this.cfg.rewardPerMonster;
        this.ctx.bus.emit('economy:reward', { amount: reward });
      }
      results.push({ baseId: raid.base.id, baseName: raid.base.label, remote: raid.remote, status, killed, total: raid.total, reward });
    }
    this.raids = [];
    this.ctx.bus.emit('raid:end', {});
    this.ctx.bus.emit('raid:result', { day, results });
  }

  update(dt) {
    for (const raid of this.raids) {
      if (raid.status !== 'active' || raid.remote) continue;
      if (raid.toSpawn > 0) {
        raid.timer -= dt;
        if (raid.timer <= 0 && this.spawnOne(raid)) {
          raid.toSpawn -= 1;
          raid.timer = this.cfg.spawnInterval;
        }
      } else if (raid.monsters.every((m) => !m.alive)) {
        raid.status = 'cleared';
        this.ctx.bus.emit('notify', { text: '습격을 막아냈습니다! 보상은 아침에 받아요', kind: 'item' });
      }
    }
  }
}
