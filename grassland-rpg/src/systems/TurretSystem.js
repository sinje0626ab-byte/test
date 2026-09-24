import * as THREE from 'three';
import { Turret } from '../entities/Turret.js';
import { ProjectilePool } from '../entities/Projectile.js';
import { turretDamage, turretRange, upgradeCost, upgradeItems, repairCost, demolishRefund } from '../utils/build.js';

const tmp = new THREE.Vector3();

// 포탑 설치 반영, 조준·발사, 투사체 이동·명중, 업그레이드·수리·우선순위·철거
export class TurretSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.turret;
    this.turrets = [];
    this.pool = new ProjectilePool(ctx.scene);
    this.blasts = [];
    const { bus } = ctx;

    bus.on('build:place', (e) => {
      if (e.kind !== 'turret') return;
      this.add(e.type, e.baseId, e.position);
      bus.emit('notify', { text: `${ctx.data.turrets[e.type].name} 설치!`, kind: 'item' });
    });
    bus.on('turret:upgrade', ({ turret }) => this.upgrade(turret));
    bus.on('turret:repair', ({ turret }) => this.repair(turret));
    bus.on('turret:priority', ({ turret }) => {
      turret.priority = turret.priority === 'nearest' ? 'lowestHp' : 'nearest';
      this.changed(turret);
    });
    bus.on('turret:demolish', ({ turret }) => this.demolish(turret));
    // 포탑 과부하 스킬: 정해진 시간 동안 연사 속도 배율
    bus.on('turret:overclock', ({ turrets, mult, duration }) => {
      for (const t of turrets) t.overclock = { mult, time: duration };
    });

    bus.on('save:collect', (save) => {
      save.turrets = this.turrets.map((t) => ({
        type: t.type, baseId: t.baseId, position: [t.position.x, t.position.z], hp: t.stats.hp, level: t.level, priority: t.priority,
      }));
    });
    bus.on('save:apply', (save) => {
      for (const t of save.turrets ?? []) {
        if (!ctx.data.turrets[t.type]) continue;
        this.add(t.type, t.baseId, new THREE.Vector3(t.position[0], 0, t.position[1]), { hp: t.hp, level: t.level, priority: t.priority });
      }
    });
  }

  add(type, baseId, position, opts) {
    const t = new Turret(this.ctx, type, baseId, position, opts);
    this.turrets.push(t);
    this.ctx.structures.push(t);
    return t;
  }

  spend(amount) {
    const e = { amount, ok: false };
    this.ctx.bus.emit('economy:spend', e);
    if (!e.ok) this.ctx.bus.emit('notify', { text: `골드가 부족합니다 (${amount} 필요)`, kind: 'warn' });
    return e.ok;
  }

  changed(turret) {
    this.ctx.bus.emit('turret:changed', { turret });
  }

  upgrade(t) {
    const cost = upgradeCost(t.def, t.level);
    if (!t.alive || cost == null || t.level >= t.def.maxLevel) return;
    // 재료가 있으면 먼저 쓰고, 골드가 모자라면 재료를 돌려준다
    const items = upgradeItems(t.def, t.level);
    if (items) {
      const e = { items, ok: false };
      this.ctx.bus.emit('inventory:spend', e);
      if (!e.ok) {
        this.ctx.bus.emit('notify', { text: '업그레이드 재료가 부족합니다', kind: 'warn' });
        return;
      }
    }
    if (!this.spend(cost)) {
      for (const c of items ?? []) this.ctx.bus.emit('inventory:add', { item: c.id, count: c.count, taken: 0 });
      return;
    }
    t.levelUp();
    this.ctx.bus.emit('notify', { text: `${t.def.name} Lv${t.level}!`, kind: 'item' });
    this.changed(t);
  }

  repair(t) {
    const cost = repairCost(t);
    if (cost <= 0 || !this.spend(cost)) return;
    t.repair();
    this.ctx.bus.emit('notify', { text: `${t.def.name} 수리 완료`, kind: 'item' });
    this.changed(t);
  }

  demolish(t) {
    const refund = demolishRefund(t, this.ctx.player.stats, this.cfg.demolishRefund);
    t.dispose();
    this.turrets = this.turrets.filter((x) => x !== t);
    const s = this.ctx.structures;
    s.splice(s.indexOf(t), 1);
    this.ctx.bus.emit('economy:reward', { amount: refund });
    this.ctx.bus.emit('notify', { text: `${t.def.name} 철거 (골드 +${refund})`, kind: 'gold' });
    this.changed(null);
  }

  // 사거리 안의 적 중 그 포탑의 우선순위(가장 가까운 적 / 체력 낮은 적)대로 고른다.
  pickTarget(t) {
    const range = turretRange(t.def, this.ctx.player.stats, t.level);
    let best = null;
    let bestScore = Infinity;
    for (const m of this.ctx.monsters) {
      if (!m.alive || m.untargetable) continue;
      const d = Math.hypot(m.position.x - t.position.x, m.position.z - t.position.z);
      if (d > range) continue;
      // spread(독침): 최근에 쏜 적은 뒤로 미뤄 여러 적을 번갈아 노린다
      const score = t.priority === 'lowestHp' ? m.stats.hp : t.priority === 'spread' ? d + (t.recent?.includes(m) ? 1000 : 0) : d;
      if (score < bestScore) { bestScore = score; best = m; }
    }
    return best;
  }

  fire(t, target) {
    const def = t.def;
    const stats = this.ctx.player.stats;
    const from = t.muzzle;
    const damage = turretDamage(def, stats, t.level);
    const range = turretRange(def, stats, t.level);
    const p = this.pool.acquire(def.projectile);
    if (def.splashRadius) {
      // 포물선: 지금 적 위치에 떨어지도록 날아가는 시간을 거리로 정한다.
      const g = this.cfg.gravity;
      tmp.set(target.position.x - from.x, 0, target.position.z - from.z);
      const time = Math.max(0.4, tmp.length() / def.projectileSpeed);
      const vel = tmp.divideScalar(time);
      vel.y = (0 - from.y + 0.5 * g * time * time) / time;
      p.fire(from, vel, damage, time + 1, { gravity: g, splash: { radius: def.splashRadius, minFactor: def.splashMinFactor } });
    } else {
      tmp.set(target.position.x, 0.5, target.position.z).sub(from).normalize().multiplyScalar(def.projectileSpeed);
      p.fire(from, tmp, damage, (range * 1.3) / def.projectileSpeed);
    }
    p.onHit = def.onHit ?? null;
    p.hitSplash = def.hitSplash ?? 0;
    if (def.priority === 'spread') t.recent = [target, ...(t.recent ?? [])].slice(0, 2);
    t.recoil = 1;
    this.ctx.bus.emit('turret:fired', { type: t.type, position: t.position, muzzle: from });
  }

  blast(position, radius, color = 0xffb35c) {
    let b = this.blasts.find((x) => x.t >= 1);
    if (!b) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffb35c, transparent: true, depthWrite: false }));
      this.ctx.scene.add(mesh);
      b = { mesh, t: 1 };
      this.blasts.push(b);
    }
    b.t = 0;
    b.radius = radius;
    b.mesh.material.color.setHex(color);
    b.mesh.position.copy(position).setY(0.2);
    b.mesh.visible = true;
  }

  update(dt) {
    for (const t of this.turrets) {
      t.update(dt);
      if (!t.alive) continue;
      const oc = t.overclock;
      if (oc && (oc.time -= dt) <= 0) t.overclock = null;
      t.cooldown -= dt * (t.overclock?.mult ?? 1);
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
      p.step(dt);
      if (p.splash) {
        if (p.position.y <= 0 || p.life <= 0) {
          p.position.y = 0;
          bus.emit('projectile:explode', { position: p.position.clone(), radius: p.splash.radius, minFactor: p.splash.minFactor, damage: p.damage });
          this.blast(p.position, p.splash.radius);
          p.release();
        }
        continue;
      }
      let hit = null;
      for (const m of monsters) {
        if (!m.alive || m.untargetable) continue;
        const dx = m.position.x - p.position.x;
        const dz = m.position.z - p.position.z;
        if (dx * dx + dz * dz < (m.radius + 0.15) ** 2 && p.position.y < m.radius * 2 + (m.def.flier ? 1.3 : 0)) { hit = m; break; }
      }
      if (hit && p.hitSplash) {
        // 서리 포탑: 맞은 자리 둘레 모두 (감속)
        bus.emit('projectile:explode', { position: hit.position.clone(), radius: p.hitSplash, minFactor: 1, damage: p.damage, effect: p.onHit });
        this.blast(hit.position, p.hitSplash, 0x8fd0ff);
        p.release();
      } else if (hit) {
        bus.emit('projectile:hit', { monster: hit, damage: p.damage, dir: p.velocity.clone().setY(0).normalize(), effect: p.onHit });
        p.release();
      } else if (p.life <= 0 || p.position.y < 0) {
        p.release();
      }
    }

    for (const b of this.blasts) {
      if (b.t >= 1) continue;
      b.t = Math.min(1, b.t + dt / 0.35);
      b.mesh.scale.setScalar(b.radius * (0.3 + 0.7 * b.t));
      b.mesh.material.opacity = 0.6 * (1 - b.t);
      if (b.t >= 1) b.mesh.visible = false;
    }
  }
}
