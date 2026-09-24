import * as THREE from 'three';
import { Monster } from '../entities/Monster.js';
import { rand } from '../utils/random.js';
import { baseAt } from '../utils/bases.js';

// 플레이어 주변에 필드 몬스터를 유지한다. 너무 멀어진 몬스터는 치운다.
export class MonsterSpawner {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.spawner;
    this.timer = 0;
  }

  update(dt) {
    const { monsters, player } = this.ctx;
    const cfg = this.cfg;

    for (let i = monsters.length - 1; i >= 0; i--) {
      const m = monsters[i];
      const far = !m.raid && !m.boss && m.position.distanceTo(player.position) > cfg.despawnDistance;
      if (m.done || (far && m.alive)) {
        m.dispose();
        monsters.splice(i, 1);
      }
    }

    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = cfg.interval;
    if (monsters.filter((m) => !m.raid && !m.boss).length >= cfg.maxMonsters) return;

    const pos = this.findSpot();
    if (!pos) return;
    // 지역마다 나오는 몬스터와 세기가 다르다.
    const region = this.ctx.world.regionAt(pos.x, pos.z);
    const m = new Monster(this.ctx, rand.pick(region.monsters), pos);
    const mult = region.statMultiplier * (this.ctx.time.isNight ? cfg.nightStatMultiplier : 1);
    if (mult !== 1) m.scaleStats(mult);
    m.night = this.ctx.time.isNight; // 밤 몬스터 (새벽검 추가 피해)
    monsters.push(m);
  }

  // 시야 밖(일정 거리 이상)이면서 나무·바위에 걸리지 않는 곳
  findSpot() {
    const { world, player } = this.ctx;
    const cfg = this.cfg;
    for (let tries = 0; tries < 12; tries++) {
      const a = rand.range(0, Math.PI * 2);
      const r = rand.range(cfg.minDistance, cfg.maxDistance);
      const x = player.position.x + Math.cos(a) * r;
      const z = player.position.z + Math.sin(a) * r;
      if (!world.isInside(x, z, 4)) continue;
      if (world.isBlocked(x, z, 1)) continue;
      // 기지 영역(과 그 둘레 조금) 안에는 필드 몬스터가 생기지 않는다.
      if (baseAt(this.ctx.bases, { x, z }, 3)) continue;
      return new THREE.Vector3(x, 0, z);
    }
    return null;
  }
}
