import * as THREE from 'three';
import { ProjectilePool } from '../entities/Projectile.js';

const v = new THREE.Vector3();

// 플레이어 활 화살: 날아가다 몬스터에 닿으면 arrow:hit (피해 계산은 CombatSystem)
export class ArrowSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.pool = new ProjectilePool(ctx.scene);
    ctx.bus.on('player:shoot', (e) => this.shoot(e));
  }

  // 여러 발이면 좌우로 부채처럼 퍼진다.
  shoot(e) {
    const n = e.count;
    for (let i = 0; i < n; i++) {
      const off = n > 1 ? (i / (n - 1) - 0.5) * e.spread * (n - 1) : 0;
      v.copy(e.dir).applyAxisAngle(new THREE.Vector3(0, 1, 0), off).multiplyScalar(e.speed);
      const p = this.pool.acquire('arrow');
      p.fire(e.origin, v, e.attack, e.range / e.speed);
      p.shot = e;
    }
  }

  update(dt) {
    const { monsters, bus } = this.ctx;
    for (const p of this.pool.active()) {
      p.step(dt);
      let hit = null;
      for (const m of monsters) {
        if (!m.alive || m.untargetable) continue;
        const dx = m.position.x - p.position.x;
        const dz = m.position.z - p.position.z;
        if (dx * dx + dz * dz < (m.radius + 0.2) ** 2) { hit = m; break; }
      }
      if (hit) {
        bus.emit('arrow:hit', { monster: hit, shot: p.shot, dir: p.velocity.clone().setY(0).normalize() });
        p.release();
      } else if (p.life <= 0 || this.ctx.world.isBlocked(p.position.x, p.position.z, 0.05)) {
        p.release();
      }
    }
  }
}
