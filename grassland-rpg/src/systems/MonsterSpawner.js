import * as THREE from 'three';
import { Monster } from '../entities/Monster.js';
import { rand } from '../utils/random.js';
import { baseAt } from '../utils/bases.js';

// 플레이어 주변에 필드 몬스터를 유지한다. 너무 멀어진 몬스터는 치운다.
// 무리(pack)는 여러 마리를 함께, 가끔 정예. 분열·보스 소환 요청(monster:spawn)도 여기서 만든다.
export class MonsterSpawner {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.spawner;
    this.timer = 0;
    ctx.bus.on('monster:spawn', (e) => this.spawnAt(e));
  }

  // 지역 배율 × 밤 배율
  multAt(pos, night) {
    const region = this.ctx.world.regionAt(pos.x, pos.z);
    return region.statMultiplier * (night ? this.cfg.nightStatMultiplier : 1);
  }

  create(type, pos, mult, night) {
    const m = new Monster(this.ctx, type, pos);
    if (mult !== 1) m.scaleStats(mult);
    m.night = night; // 밤 몬스터 (새벽검 추가 피해, 보랏빛)
    this.ctx.monsters.push(m);
    return m;
  }

  // { type, count, position, mult?, night?, spread? } — 둘레에 흩어 놓는다
  spawnAt({ type, count = 1, position, mult, night, spread = 1 }) {
    const n = night ?? this.ctx.time.isNight;
    const k = mult ?? this.multAt(position, n);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rand.range(0, 1);
      const pos = new THREE.Vector3(position.x + Math.cos(a) * spread, 0, position.z + Math.sin(a) * spread);
      this.ctx.world.resolveCollision(pos, this.ctx.data.monsters[type].radius);
      const m = this.create(type, pos, k, n);
      m.alert();
    }
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
    const type = rand.pick(region.monsters);
    const def = this.ctx.data.monsters[type];
    const night = this.ctx.time.isNight;
    const mult = this.multAt(pos, night);
    const count = def.packMax ? rand.int(def.packMin, def.packMax) : 1;
    const pack = [];
    for (let i = 0; i < count; i++) {
      const p = i === 0 ? pos : pos.clone().add(new THREE.Vector3(rand.range(-2, 2), 0, rand.range(-2, 2)));
      if (i > 0) this.ctx.world.resolveCollision(p, def.radius);
      const m = this.create(type, p, mult, night);
      if (count > 1) { m.pack = pack; pack.push(m); }
      if (Math.random() < this.ctx.data.config.elite.chance) m.makeElite(this.ctx.data.config.elite);
    }
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
