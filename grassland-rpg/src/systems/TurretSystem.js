import * as THREE from 'three';
import { Turret } from '../entities/Turret.js';
import { ProjectilePool } from '../entities/Projectile.js';

const tmp = new THREE.Vector3();

// 포탑 설치 반영, 조준 대상 고르기, 발사, 투사체 이동·명중
export class TurretSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.turrets = [];
    this.pool = new ProjectilePool(ctx.scene);
    const { bus } = ctx;

    bus.on('build:place', (e) => {
      if (e.kind !== 'turret') return;
      this.add(e.type, e.baseId, e.position);
      bus.emit('notify', { text: `${ctx.data.turrets[e.type].name} 설치!`, kind: 'item' });
    });
    bus.on('save:collect', (save) => {
      save.turrets = this.turrets.map((t) => ({
        type: t.type, baseId: t.baseId, position: [t.position.x, t.position.z], hp: t.stats.hp, level: t.level,
      }));
    });
    bus.on('save:apply', (save) => {
      for (const t of save.turrets ?? []) {
        if (!ctx.data.turrets[t.type]) continue;
        this.add(t.type, t.baseId, new THREE.Vector3(t.position[0], 0, t.position[1]), { hp: t.hp, level: t.level });
      }
    });
  }

  add(type, baseId, position, opts) {
    const t = new Turret(this.ctx, type, baseId, position, opts);
    this.turrets.push(t);
    this.ctx.structures.push(t);
    return t;
  }

  // 사거리 안의 적 중 우선순위(가장 가까운 적 / 체력 낮은 적)대로 고른다.
  pickTarget(t) {
    const range = t.def.range;
    let best = null;
    let bestScore = Infinity;
    for (const m of this.ctx.monsters) {
      if (!m.alive) continue;
      const d = Math.hypot(m.position.x - t.position.x, m.position.z - t.position.z);
      if (d > range) continue;
      const score = t.def.priority === 'lowestHp' ? m.stats.hp : d;
      if (score < bestScore) { bestScore = score; best = m; }
    }
    return best;
  }

  fire(t, target) {
    const def = t.def;
    const from = t.muzzle;
    tmp.set(target.position.x, 0.5, target.position.z).sub(from).normalize().multiplyScalar(def.projectileSpeed);
    const life = (def.range * 1.3) / def.projectileSpeed;
    this.pool.acquire().fire(from, tmp, def.damage, life);
    t.recoil = 1;
  }

  update(dt) {
    for (const t of this.turrets) {
      t.update(dt);
      if (!t.alive) continue;
      t.cooldown -= dt;
      const target = this.pickTarget(t);
      if (!target) continue;
      t.aimYaw = Math.atan2(target.position.x - t.position.x, target.position.z - t.position.z);
      let diff = t.aimYaw - t.yaw;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      if (t.cooldown <= 0 && Math.abs(diff) < 0.25) {
        this.fire(t, target);
        t.cooldown = 1 / t.def.fireRate;
      }
    }

    const { monsters, bus } = this.ctx;
    for (const p of this.pool.active()) {
      p.position.addScaledVector(p.velocity, dt);
      p.life -= dt;
      p.sync();
      let hit = null;
      for (const m of monsters) {
        if (!m.alive) continue;
        const dx = m.position.x - p.position.x;
        const dz = m.position.z - p.position.z;
        if (dx * dx + dz * dz < (m.radius + 0.15) ** 2 && p.position.y < m.radius * 2) { hit = m; break; }
      }
      if (hit) {
        bus.emit('projectile:hit', { monster: hit, damage: p.damage, dir: p.velocity.clone().setY(0).normalize() });
        p.release();
      } else if (p.life <= 0 || p.position.y < 0) {
        p.release();
      }
    }
  }
}
