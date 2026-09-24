import * as THREE from 'three';
import { RaidMonster } from '../entities/RaidMonster.js';
import { rand } from '../utils/random.js';
import { turretDamage } from '../utils/build.js';
import { raidProgress, raidStatScale, raidCount, pickWeighted, poolAverageHp, splitWaves, isBloodMoon } from '../utils/raid.js';

// 밤 습격: 실시간(웨이브 3개) + 원격 계산. 5일마다 붉은 달.
export class RaidSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.raid;
    this.raids = [];
    ctx.raids = this.raids; // 화살표·웨이브 표시(RaidIndicator)가 읽는다
    this.playerLevel = 1;
    this.bossesCleared = 0;
    const { bus } = ctx;
    bus.on('stats:changed', ({ level }) => { this.playerLevel = level; });
    bus.on('boss:status', ({ list }) => { this.bossesCleared = list.filter((b) => b.cleared).length; });

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

  // 진행도·날짜로 몇 마리, 얼마나 세게 (utils/raid.js)
  plan(base, day) {
    const c = this.cfg;
    const progress = raidProgress(c, base.level, this.playerLevel, this.bossesCleared);
    return { progress, total: raidCount(c, progress, day, base.region), scale: raidStatScale(c, progress, day, base.region) };
  }

  startRaids(day) {
    const { bases, bus } = this.ctx;
    const blood = isBloodMoon(this.cfg, day);
    this.ctx.bloodMoon = blood;
    if (blood) {
      bus.emit('bloodmoon:start', { day });
      bus.emit('notify', { text: '붉은 달이 떴습니다! 정예 몬스터와 보스의 그림자가 옵니다 (보상 2배)', kind: 'warn' });
    }
    if (!bases.length) {
      bus.emit('notify', { text: '밤이 되었습니다. 몬스터가 강해집니다', kind: 'warn' });
      return;
    }
    const player = this.ctx.player;
    for (const base of bases) {
      const { total, scale } = this.plan(base, day);
      // 플레이어가 곁에 있는 기지만 실시간, 나머지는 아침에 계산으로 정산
      const near = player.alive && player.position.distanceTo(base.position) <= base.areaRadius + this.cfg.presenceMargin;
      const waves = splitWaves(total, this.cfg.waves);
      const raid = { base, day, total, scale, waves, wave: 0, phase: 'spawn', toSpawn: near ? waves[0] : 0, timer: 0, fight: 0, rest: 0, monsters: [], status: 'active', remote: !near, bloodMoon: blood };
      this.raids.push(raid);
      if (near) bus.emit('raid:wave', { base, wave: 1, waves: waves.length, bloodMoon: blood });
    }
    // 밤의 군주가 이번 습격 하나를 고를 수 있다 (NightLordSystem, raid.nightLord)
    bus.emit('raid:planning', { raids: this.raids, day, bloodMoon: blood });
    const live = this.raids.filter((r) => !r.remote);
    const remote = this.raids.length - live.length;
    if (live.length) bus.emit('raid:start', { day, count: live.reduce((n, r) => n + r.total, 0), bloodMoon: blood });
    if (remote) bus.emit('notify', { text: `멀리 있는 기지 ${remote}곳도 습격당하고 있어요 (결과는 아침에)`, kind: 'warn' });
  }

  // 기지 영역 바깥 둘레의 빈자리
  spawnSpot(b) {
    const { world } = this.ctx;
    for (let tries = 0; tries < 10; tries++) {
      const a = rand.range(0, Math.PI * 2);
      const r = b.areaRadius + this.cfg.spawnOffset;
      const x = b.position.x + Math.cos(a) * r;
      const z = b.position.z + Math.sin(a) * r;
      if (!world.isInside(x, z, 3) || world.isBlocked(x, z, 1)) continue;
      return new THREE.Vector3(x, 0, z);
    }
    return null;
  }

  spawnOne(raid, type = pickWeighted(raid.base.region.raidPool)) {
    const pos = this.spawnSpot(raid.base);
    if (!pos) return null;
    const m = new RaidMonster(this.ctx, type, pos, raid.base);
    m.scaleStats(raid.scale ?? 1);
    // 붉은 달: 정예가 섞인다
    if (raid.bloodMoon && Math.random() < this.cfg.bloodMoon.eliteChance) m.makeElite(this.ctx.data.config.elite);
    this.ctx.monsters.push(m);
    raid.monsters.push(m);
    return m;
  }

  // 붉은 달 마지막 웨이브: 그 지역 보스의 약해진 그림자
  spawnShadowBoss(raid) {
    const bdef = Object.values(this.ctx.data.bosses).find((b) => b.region === raid.base.region.id);
    if (!bdef) return;
    const m = this.spawnOne(raid, bdef.monster);
    if (!m) return;
    const s = m.stats;
    s.maxHp = s.hp = Math.round(s.maxHp * this.cfg.bloodMoon.bossHp);
    m.raidBoss = true;
    raid.total += 1;
    m.bdef = { name: `붉은 달의 ${bdef.name}` };
    this.ctx.bus.emit('boss:engaged', { boss: m });
  }

  // 원격 기지: 포탑 화력 × 시간 vs 습격 몬스터 체력 합
  resolveRemote(raid) {
    const c = this.cfg;
    const stats = this.ctx.player.stats;
    const turrets = this.ctx.structures.filter((s) => s.kind === 'turret' && s.baseId === raid.base.id && s.alive);
    const dps = turrets.reduce((sum, t) => sum + turretDamage(t.def, stats, t.level) * t.def.fireRate * (t.def.aoeFactor ?? 1), 0);
    const waveHp = raid.total * poolAverageHp(raid.base.region.raidPool, this.ctx.data.monsters) * raid.scale;
    // 벽 총 체력의 일부를 방어력에 더한다
    const wallHp = this.ctx.structures.filter((s) => s.kind === 'wall' && s.baseId === raid.base.id).reduce((a, w) => a + w.stats.hp, 0);
    const defense = dps * c.remoteFightSeconds + wallHp * this.ctx.data.config.walls.remoteHpRatio;
    const ratio = waveHp > 0 ? defense / waveHp : 1;
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
        reward = (this.cfg.rewardBase + raid.total * this.cfg.rewardPerMonster) * (raid.bloodMoon ? this.cfg.bloodMoon.rewardMultiplier : 1);
        this.ctx.bus.emit('economy:reward', { amount: reward });
      }
      results.push({ baseId: raid.base.id, baseName: raid.base.label, remote: raid.remote, status, killed, total: raid.total, reward });
    }
    this.raids = [];
    this.ctx.raids = this.raids;
    this.ctx.bloodMoon = false;
    this.ctx.bus.emit('raid:end', {});
    this.ctx.bus.emit('raid:result', { day, results });
  }

  // 웨이브: 스폰 → 싸움(다 잡거나 시간 초과) → 휴식 → 다음 웨이브
  update(dt) {
    const c = this.cfg;
    for (const raid of this.raids) {
      if (raid.status !== 'active' || raid.remote) continue;
      const last = raid.wave === raid.waves.length - 1;
      if (raid.phase === 'spawn') {
        raid.timer -= dt;
        if (raid.toSpawn > 0 && raid.timer <= 0 && this.spawnOne(raid)) {
          raid.toSpawn -= 1;
          raid.timer = c.spawnInterval;
        }
        if (raid.toSpawn <= 0) {
          if (last && raid.nightLord) this.ctx.bus.emit('nightlord:spawn', { raid, spot: this.spawnSpot(raid.base) });
          else if (last && raid.bloodMoon) this.spawnShadowBoss(raid);
          raid.phase = 'fight';
          raid.fight = 0;
        }
      } else if (raid.phase === 'fight') {
        raid.fight += dt;
        const clear = raid.monsters.every((m) => !m.alive);
        if (last) {
          if (clear) {
            raid.status = 'cleared';
            this.ctx.bus.emit('raid:wave', { base: raid.base, wave: 0, waves: raid.waves.length });
            this.ctx.bus.emit('notify', { text: '습격을 막아냈습니다! 보상은 아침에 받아요', kind: 'item' });
          }
        } else if (clear || raid.fight >= c.waveTimeout) {
          raid.phase = 'rest';
          raid.rest = c.waveRest;
          this.ctx.bus.emit('notify', { text: `웨이브 ${raid.wave + 1} 끝! ${c.waveRest}초 뒤 다음 웨이브`, kind: 'item' });
        }
      } else if (raid.phase === 'rest') {
        raid.rest -= dt;
        if (raid.rest <= 0) {
          raid.wave += 1;
          raid.toSpawn = raid.waves[raid.wave];
          raid.phase = 'spawn';
          raid.timer = 0;
          this.ctx.bus.emit('raid:wave', { base: raid.base, wave: raid.wave + 1, waves: raid.waves.length, bloodMoon: raid.bloodMoon });
        }
      }
    }
  }
}
