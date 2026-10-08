import * as THREE from 'three';
import { Mercenary } from '../entities/Mercenary.js';
import { josa } from '../utils/josa.js';

// 용병 (config.mercenary): 기지마다 종류별 1명, 골드로 고용. 쓰러지지 않는다.
// - 채집가 gatherer: 기지 밖(searchRadius 안)의 바닥 골드를 주워 capacity 까지 → 기지 금고(base.vault)에 넣고 다시 나간다
// - 전사 warrior: 기지 영역 안에서만, 들어온 몬스터를 친다 (플레이어 공격력 × attackRatio)
// - 수리공 repairer: 기지 영역 안에서만, 다친 건물(포탑 먼저, 부서진 포탑도)을 아주 천천히 고친다 (무료)
// 금고는 건설 창에서 꺼낸다. 저장: save.mercenaries { [baseId]: { roles: [...], vault } }
const ROLES = ['gatherer', 'warrior', 'repairer'];
const v = new THREE.Vector3();

export class MercenarySystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.mercenary;
    this.list = [];
    ctx.mercenaries = this.list;
    const { bus } = ctx;
    bus.on('mercenary:hire', ({ baseId, role }) => this.hire(baseId, role));
    bus.on('mercenary:dismiss', ({ baseId, role }) => this.dismiss(baseId, role));
    bus.on('vault:withdraw', ({ baseId }) => {
      const base = ctx.bases.find((b) => b.id === baseId);
      if (!base?.vault) return;
      bus.emit('economy:reward', { amount: base.vault });
      bus.emit('notify', { text: `금고에서 골드 ${josa(String(base.vault), '을/를')} 꺼냈어요`, kind: 'gold' });
      base.vault = 0;
      bus.emit('mercenary:changed', {});
    });
    bus.on('game:new', () => this.clear());
    bus.on('save:collect', (save) => {
      save.mercenaries = Object.fromEntries(ctx.bases.filter((b) => b.vault || this.of(b).length).map((b) => [b.id, { roles: this.of(b).map((m) => m.role), vault: b.vault ?? 0 }]));
    });
    bus.on('save:apply', (save) => {
      this.clear();
      for (const [id, s] of Object.entries(save.mercenaries ?? {})) {
        const base = ctx.bases.find((b) => b.id === Number(id));
        if (!base) continue;
        base.vault = s.vault ?? 0;
        for (const role of s.roles ?? []) if (ROLES.includes(role)) this.add(base, role);
      }
    });
  }

  of(base) {
    return this.list.filter((m) => m.base === base);
  }

  clear() {
    for (const m of this.list) m.dispose();
    this.list.length = 0;
  }

  add(base, role) {
    const m = new Mercenary(this.ctx, role, base);
    this.list.push(m);
    return m;
  }

  hire(baseId, role) {
    const { bus, bases } = this.ctx;
    const base = bases.find((b) => b.id === baseId);
    const r = this.cfg.roles[role];
    if (!base || !r) return;
    if (this.of(base).some((m) => m.role === role)) {
      bus.emit('notify', { text: `이 기지엔 벌써 ${josa(r.name, '이/가')} 있어요`, kind: 'warn' });
      return;
    }
    const e = { amount: this.cfg.cost, ok: false };
    bus.emit('economy:spend', e);
    if (!e.ok) {
      bus.emit('notify', { text: `골드가 부족합니다 (${this.cfg.cost} 필요)`, kind: 'warn' });
      return;
    }
    this.add(base, role);
    bus.emit('notify', { text: `${josa(r.name, '을/를')} 고용했어요! ${r.short}`, kind: 'item' });
    bus.emit('mercenary:changed', {});
  }

  dismiss(baseId, role) {
    const i = this.list.findIndex((m) => m.base.id === baseId && m.role === role);
    if (i < 0) return;
    const m = this.list[i];
    if (m.carry) m.base.vault = (m.base.vault ?? 0) + m.carry; // 들고 있던 골드는 금고에
    m.dispose();
    this.list.splice(i, 1);
    this.ctx.bus.emit('mercenary:changed', {});
  }

  update(dt) {
    for (const m of this.list) {
      if (m.role === 'gatherer') this.gather(m, dt);
      else if (m.role === 'warrior') this.fight(m, dt);
      else this.repair(m, dt);
      m.animate(dt);
    }
  }

  // 기지 영역 안의 아무 자리 (중심 건물에서 조금 떨어진)
  wanderInside(m) {
    const b = m.base;
    const a = Math.random() * Math.PI * 2;
    const r = b.tent.radius + 1.5 + Math.random() * Math.max(1, b.areaRadius - b.tent.radius - 3);
    return new THREE.Vector3(b.position.x + Math.cos(a) * r, 0, b.position.z + Math.sin(a) * r);
  }

  // 서성이기: 건물·나무 위가 아닌 자리를 골라 걷는다. 오래 못 가면 다른 자리로
  idle(m, dt, pick) {
    m.wait -= dt;
    m.idleWalk = (m.idleWalk ?? 0) + dt;
    if (!m.target || m.walkTo(m.target, dt, this.cfg.speed * 0.6) || m.idleWalk > this.ctx.data.config.nav.giveUp / 2) {
      if (m.wait <= 0 || m.idleWalk > this.ctx.data.config.nav.giveUp / 2) {
        let t = null;
        for (let i = 0; i < 6 && !t; i++) {
          const p = pick();
          if (!m.nav?.blockedAt(p.x, p.z, 0.2)) t = p;
        }
        m.target = t;
        m.idleWalk = 0;
        m.wait = 1.5 + Math.random() * 2.5;
      }
    }
  }

  // ── 채집가 ──
  gather(m, dt) {
    const c = this.cfg.gatherer;
    const b = m.base;
    const drops = this.ctx.drops ?? [];
    if (m.state === 'return') {
      v.set(b.position.x, 0, b.position.z + b.tent.radius + 1.2);
      if (m.walkTo(v, dt, this.cfg.speed)) {
        b.vault = (b.vault ?? 0) + m.carry;
        this.ctx.bus.emit('mercenary:deposit', { base: b, amount: m.carry });
        if (this.ctx.player.position.distanceTo(b.position) < b.areaRadius + 10) this.ctx.bus.emit('notify', { text: `채집가가 금고에 골드 ${josa(String(m.carry), '을/를')} 넣었어요`, kind: 'gold' });
        m.carry = 0;
        m.state = 'idle';
        m.target = null;
        this.ctx.bus.emit('mercenary:changed', {});
      }
      return;
    }
    // 노리던 골드가 사라졌으면 다시 찾는다
    if (m.drop && (m.drop.done || m.drop.count <= 0)) m.drop = null;
    m.look = (m.look ?? 0) - dt;
    if (!m.drop && m.look <= 0) {
      m.look = 0.5;
      let best = null;
      let bd = Infinity;
      for (const d of drops) {
        if (d.itemId !== 'gold' || d.done || (d.claimedBy && d.claimedBy !== m)) continue;
        if (Math.hypot(d.position.x - b.position.x, d.position.z - b.position.z) > c.searchRadius) continue;
        const dist = Math.hypot(d.position.x - m.position.x, d.position.z - m.position.z);
        if (dist < bd) { bd = dist; best = d; }
      }
      if (best) {
        best.claimedBy = m;
        m.drop = best;
        m.state = 'seek';
        m.idleTime = 0;
      } else if (m.carry > 0 && (m.idleTime = (m.idleTime ?? 0) + 0.5) > c.returnAfter) {
        m.state = 'return'; // 더 주울 게 없으면 들고 있는 만큼 넣으러
        return;
      }
    }
    if (m.drop) {
      if (m.walkTo(m.drop.position, dt, this.cfg.speed) || Math.hypot(m.drop.position.x - m.position.x, m.drop.position.z - m.position.z) < c.pickRange) {
        const take = Math.min(m.drop.count, c.capacity - m.carry);
        m.carry += take;
        m.drop.count -= take;
        if (m.drop.count <= 0) m.drop.done = true;
        else m.drop.claimedBy = null;
        m.drop = null;
        m.strike();
        if (m.carry >= c.capacity) m.state = 'return';
        this.ctx.bus.emit('mercenary:changed', {});
      }
      return;
    }
    // 주울 게 없으면 기지 바깥 둘레를 서성인다
    m.state = 'idle';
    this.idle(m, dt, () => {
      const a = Math.random() * Math.PI * 2;
      const r = b.areaRadius + c.idleOutside * (0.6 + Math.random() * 0.8);
      return new THREE.Vector3(b.position.x + Math.cos(a) * r, 0, b.position.z + Math.sin(a) * r);
    });
  }

  // ── 전사 ──
  fight(m, dt) {
    const c = this.cfg.warrior;
    const b = m.base;
    m.cooldown = Math.max(0, m.cooldown - dt);
    let foe = m.foe;
    const inside = (p, pad = 0) => Math.hypot(p.x - b.position.x, p.z - b.position.z) <= b.areaRadius + pad;
    if (!foe || !foe.alive || foe.untargetable || !inside(foe.position, 1)) {
      foe = null;
      let bd = Infinity;
      for (const mo of this.ctx.monsters) {
        if (!mo.alive || mo.untargetable || !inside(mo.position, 0.5)) continue;
        const d = mo.position.distanceTo(m.position);
        if (d < bd) { bd = d; foe = mo; }
      }
      m.foe = foe;
    }
    if (!foe) {
      m.state = 'idle';
      this.idle(m, dt, () => this.wanderInside(m));
      return;
    }
    m.state = 'fight';
    const reach = c.range + foe.radius;
    const d = Math.hypot(foe.position.x - m.position.x, foe.position.z - m.position.z);
    if (d > reach) {
      m.walkTo(foe.position, dt, this.cfg.speed);
      this.keepInside(m);
      return;
    }
    m.moving = false;
    m.facing = Math.atan2(foe.position.x - m.position.x, foe.position.z - m.position.z);
    if (m.cooldown > 0) return;
    m.cooldown = c.cooldown;
    m.strike();
    const dir = new THREE.Vector3(foe.position.x - m.position.x, 0, foe.position.z - m.position.z).normalize();
    const damage = Math.max(1, this.ctx.player.stats.attack * c.attackRatio);
    this.ctx.bus.emit('projectile:hit', { monster: foe, damage, dir });
  }

  keepInside(m) {
    const b = m.base;
    const dx = m.position.x - b.position.x;
    const dz = m.position.z - b.position.z;
    const d = Math.hypot(dx, dz);
    const max = b.areaRadius - 0.3;
    if (d > max) { m.position.x = b.position.x + (dx / d) * max; m.position.z = b.position.z + (dz / d) * max; }
  }

  // ── 수리공 ──
  repair(m, dt) {
    const c = this.cfg.repairer;
    const b = m.base;
    let t = m.fix;
    const hurt = (s) => s.baseId === b.id && s.kind !== 'tent' && s.stats && s.stats.hp < s.stats.maxHp && (s.alive || s.kind === 'turret');
    if (!t || !hurt(t) || !this.ctx.structures.includes(t)) {
      // 포탑 먼저, 그다음 체력 비율이 낮은 순
      t = null;
      let best = Infinity;
      for (const s of this.ctx.structures) {
        if (!hurt(s)) continue;
        const score = s.stats.hp / s.stats.maxHp + (s.kind === 'turret' ? 0 : 1);
        if (score < best) { best = score; t = s; }
      }
      m.fix = t;
    }
    if (!t) {
      m.state = 'idle';
      this.idle(m, dt, () => this.wanderInside(m));
      return;
    }
    m.state = 'repair';
    const reach = c.range + (t.radius ?? 0.5);
    if (Math.hypot(t.position.x - m.position.x, t.position.z - m.position.z) > reach) {
      v.set(t.position.x, 0, t.position.z);
      m.walkTo(v, dt, this.cfg.speed);
      this.keepInside(m);
      return;
    }
    m.moving = false;
    m.facing = Math.atan2(t.position.x - m.position.x, t.position.z - m.position.z);
    m.cooldown -= dt;
    if (m.cooldown <= 0) { m.cooldown = 0.8; m.strike(); }
    t.stats.hp = Math.min(t.stats.maxHp, t.stats.hp + c.perSecond * dt);
    if (t.stats.hp >= t.stats.maxHp) {
      if (t.kind === 'turret' && !t.alive) t.repair(); // 부서진 포탑이 다 고쳐지면 다시 동작
      this.ctx.bus.emit('structure:repaired', { structure: t });
      m.fix = null;
    }
  }
}
