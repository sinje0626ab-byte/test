import * as THREE from 'three';
import { ProjectilePool } from '../entities/Projectile.js';

const tmp = new THREE.Vector3();

// 몬스터 투사체(포자탄·얼음탄)와 보스 잎 폭풍. 플레이어에 닿으면 enemy:hit-player.
export class EnemyShotSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.enemyShot;
    this.pool = new ProjectilePool(ctx.scene);
    this.storms = [];
    ctx.bus.on('monster:shoot', (e) => this.shoot(e));
    ctx.bus.on('boss:leafstorm', (e) => this.leafstorm(e));
  }

  shoot({ origin, dir, speed, damage, effect, kind }) {
    const p = this.pool.acquire(kind);
    p.fire(origin, dir.clone().setY(0).normalize().multiplyScalar(speed), damage, this.cfg.life);
    p.effect = effect ?? null;
  }

  // 잎이 보스 둘레를 돌며 점점 멀어진다. 잎 하나는 한 번만 맞힌다.
  leafstorm({ boss, count, damage, duration, maxRadius }) {
    const storm = { boss, leaves: [], time: 0, duration, from: boss.radius + 0.5, maxRadius };
    for (let i = 0; i < count; i++) {
      const p = this.pool.acquire('leaf');
      p.fire(boss.position, tmp.set(1, 0, 0), damage, duration);
      p.angle = (i / count) * Math.PI * 2;
      p.storm = storm; // 풀에서 다시 꺼내 쓰면 바뀐다
      storm.leaves.push(p);
    }
    this.storms.push(storm);
  }

  // 닿았으면 true
  touches(p) {
    const player = this.ctx.player;
    if (!player.alive) return false;
    const dx = player.position.x - p.position.x;
    const dz = player.position.z - p.position.z;
    return dx * dx + dz * dz < (player.radius + this.cfg.hitRadius) ** 2;
  }

  hit(p, dir) {
    this.ctx.bus.emit('enemy:hit-player', { damage: p.damage, dir, effect: p.effect });
    p.release();
  }

  update(dt) {
    const { cfg } = this;
    for (const s of this.storms) {
      s.time += dt;
      const r = s.from + (s.maxRadius - s.from) * Math.min(1, s.time / s.duration);
      const c = s.boss.position;
      for (const p of s.leaves) {
        if (!p.active || p.storm !== s) continue;
        p.angle += cfg.leafSpin * dt;
        const x = c.x + Math.cos(p.angle) * r;
        const z = c.z + Math.sin(p.angle) * r;
        p.velocity.set(x - p.position.x, 0, z - p.position.z);
        if (p.velocity.lengthSq() < 1e-8) p.velocity.set(1, 0, 0);
        p.position.set(x, cfg.leafHeight, z);
        p.life -= dt;
        p.sync();
        if (this.touches(p)) this.hit(p, tmp.set(x - c.x, 0, z - c.z).normalize().clone());
        else if (p.life <= 0 || !s.boss.alive) p.release();
      }
    }
    this.storms = this.storms.filter((s) => s.leaves.some((p) => p.active && p.storm === s));

    for (const p of this.pool.active()) {
      if (p.kind === 'leaf') continue;
      p.step(dt);
      if (this.touches(p)) this.hit(p, p.velocity.clone().setY(0).normalize());
      else if (p.life <= 0 || this.ctx.world.isBlocked(p.position.x, p.position.z, 0)) p.release();
    }
  }
}
