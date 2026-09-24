import * as THREE from 'three';
import { RaidMonster } from '../entities/RaidMonster.js';
import { rand } from '../utils/random.js';

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
    const region = this.ctx.data.regions[c.region];
    const n = c.baseCount + base.level * c.perBaseLevel + region.difficulty * c.perRegionDifficulty + (day - 1) * c.perDay;
    return Math.min(c.maxCount, Math.round(n));
  }

  startRaids(day) {
    const { bases, bus } = this.ctx;
    if (!bases.length) {
      bus.emit('notify', { text: '밤이 되었습니다. 몬스터가 강해집니다', kind: 'warn' });
      return;
    }
    for (const base of bases) {
      const total = this.raidSize(base, day);
      this.raids.push({ base, day, total, toSpawn: total, timer: 0, monsters: [], status: 'active' });
    }
    bus.emit('raid:start', { day, count: this.raids.reduce((n, r) => n + r.total, 0) });
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
      const m = new RaidMonster(this.ctx, this.cfg.monsterType, new THREE.Vector3(x, 0, z), b);
      m.scaleStats(1 + (raid.day - 1) * this.cfg.statScalePerDay);
      this.ctx.monsters.push(m);
      raid.monsters.push(m);
      return true;
    }
    return false;
  }

  fail(raid) {
    raid.status = 'failed';
    raid.toSpawn = 0;
    for (const m of raid.monsters) m.retreat();
    this.ctx.bus.emit('economy:lose', { ratio: this.cfg.failGoldLossRatio, text: '텐트가 무너졌습니다! 골드를 빼앗겼어요' });
  }

  // 아침: 결과 정산 + 남은 몬스터는 물러간다.
  finishRaids(day) {
    if (!this.raids.length) return;
    const results = [];
    for (const raid of this.raids) {
      for (const m of raid.monsters) m.retreat();
      const killed = raid.monsters.filter((m) => !m.alive && m.state === 'dead').length;
      let status = raid.status;
      if (status === 'active') status = 'partial';
      let reward = 0;
      if (status === 'cleared') {
        reward = this.cfg.rewardBase + raid.total * this.cfg.rewardPerMonster;
        this.ctx.bus.emit('economy:reward', { amount: reward });
      }
      results.push({ baseId: raid.base.id, baseName: raid.base.name, status, killed, total: raid.total, reward });
    }
    this.raids = [];
    this.ctx.bus.emit('raid:result', { day, results });
  }

  update(dt) {
    for (const raid of this.raids) {
      if (raid.status !== 'active') continue;
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
