import * as THREE from 'three';
import { findPath } from './pathfind.js';

// 걸어 다니는 아군(용병·주민)용 길 찾기.
// - 앞이 트여 있으면 곧장 간다
// - 기지 건물(중심 건물·부속 건물·포탑)이나 나무·바위가 가로막으면 1m 격자 A*(utils/pathfind.js)로 돌아간다
//   (경로는 보이는 데까지 건너뛰어 부드럽게, 목적지가 움직이면 다시 찾는다)
// - 제자리걸음이 이어지면(막힘) 길을 다시 찾고, 그래도 안 되면 옆으로 비켜 선다
// 설정 config.nav
const tmp = new THREE.Vector3();

export class Navigator {
  constructor(ctx, radius) {
    this.ctx = ctx;
    this.radius = radius;
    this.cfg = ctx.data.config.nav;
    this.path = null; // 남은 경유점 [{x, z}]
    this.goal = new THREE.Vector3(Infinity, 0, Infinity);
    this.repath = 0;
    this.stuck = 0;
    this.sidestep = 0;
    this.side = 1;
  }

  // 이 자리가 막혔는지 (반지름 + extra 만큼 여유)
  blockedAt(x, z, extra = 0) {
    const r = this.radius + extra;
    if (this.ctx.world.isBlocked(x, z, r)) return true;
    const k = this.ctx.data.config.world.structureCollide;
    for (const s of this.ctx.structures ?? []) {
      if (s.kind === 'wall' || !s.radius) continue;
      const min = s.radius * k + r;
      const dx = x - s.position.x;
      const dz = z - s.position.z;
      if (dx * dx + dz * dz < min * min) return true;
    }
    return false;
  }

  // a → b 직선이 트였는지 (중간을 조금씩 짚어 본다)
  clear(a, b) {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    const n = Math.ceil(len / this.cfg.probeStep);
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      if (this.blockedAt(a.x + dx * t, a.z + dz * t, this.cfg.margin)) return false;
    }
    return true;
  }

  plan(from, to) {
    const c = this.cfg;
    const pad = c.searchPad;
    const half = c.maxGrid / 2;
    // 너무 먼 길은 가까운 쪽 구간만 (가다 보면 다시 찾는다)
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const len = Math.hypot(dx, dz);
    const reach = Math.min(len, half - pad);
    const gx = len > 0 ? from.x + (dx / len) * reach : to.x;
    const gz = len > 0 ? from.z + (dz / len) * reach : to.z;
    const bounds = {
      x0: Math.floor(Math.min(from.x, gx) - pad), x1: Math.floor(Math.max(from.x, gx) + pad),
      z0: Math.floor(Math.min(from.z, gz) - pad), z1: Math.floor(Math.max(from.z, gz) + pad),
    };
    const cache = new Map();
    const blocked = (cx, cz) => {
      const key = cx * 100003 + cz;
      let b = cache.get(key);
      if (b === undefined) { b = this.blockedAt(cx + 0.5, cz + 0.5, c.margin); cache.set(key, b); }
      return b;
    };
    const path = findPath({ x: Math.floor(from.x), z: Math.floor(from.z) }, { x: Math.floor(gx), z: Math.floor(gz) }, blocked, bounds, c.maxNodes);
    if (!path) return null;
    if (reach >= len - 0.01) path.push({ x: to.x, z: to.z }); // 마지막은 정확한 목적지
    return path;
  }

  // pos 를 dest 쪽으로 speed 로 옮긴다. 도착하면 true. dir(움직인 방향)은 this.dir
  move(pos, dest, dt, speed) {
    const c = this.cfg;
    const d0 = Math.hypot(dest.x - pos.x, dest.z - pos.z);
    // 목적지가 건물·나무 위면 가까이 온 것으로 친다
    if (d0 < c.arrive || (d0 < c.blockedArrive && this.blockedAt(dest.x, dest.z, 0))) { this.path = null; this.moving = false; return true; }
    this.repath -= dt;
    const goalMoved = Math.hypot(dest.x - this.goal.x, dest.z - this.goal.z) > c.goalMove;
    if (goalMoved || this.repath <= 0 || this.forceRepath) {
      this.forceRepath = false;
      this.goal.set(dest.x, 0, dest.z);
      this.repath = c.repathInterval;
      this.path = this.clear(pos, dest) ? null : this.plan(pos, dest);
    }
    // 보이는 경유점은 건너뛴다
    let target = dest;
    if (this.path?.length) {
      while (this.path.length > 1 && this.clear(pos, this.path[1])) this.path.shift();
      if (Math.hypot(this.path[0].x - pos.x, this.path[0].z - pos.z) < c.arrive && this.path.length > 1) this.path.shift();
      target = this.path[0];
    }
    tmp.set(target.x - pos.x, 0, target.z - pos.z);
    if (tmp.lengthSq() < 1e-6) tmp.set(dest.x - pos.x, 0, dest.z - pos.z);
    tmp.normalize();
    // 막혔을 때 잠깐 옆으로 비켜 서기
    if (this.sidestep > 0) {
      this.sidestep -= dt;
      tmp.set(tmp.x - tmp.z * this.side * 1.5, 0, tmp.z + tmp.x * this.side * 1.5).normalize();
    }
    const step = Math.min(speed * dt, Math.hypot(target.x - pos.x, target.z - pos.z) || speed * dt);
    const bx = pos.x;
    const bz = pos.z;
    pos.x += tmp.x * step;
    pos.z += tmp.z * step;
    this.ctx.world.resolveCollision(pos, this.radius);
    this.ctx.world.resolveStructures(pos, this.radius);
    // 거의 못 움직였으면 막힌 것
    const moved = Math.hypot(pos.x - bx, pos.z - bz);
    if (moved < step * c.stuckRatio) this.stuck += dt;
    else this.stuck = Math.max(0, this.stuck - dt);
    if (this.stuck > c.stuckTime) {
      this.stuck = 0;
      this.forceRepath = true;
      this.sidestep = c.sidestepTime;
      this.side = -this.side;
    }
    this.dir = tmp;
    this.moving = true;
    return false;
  }

  reset() {
    this.path = null;
    this.goal.set(Infinity, 0, Infinity);
  }
}
