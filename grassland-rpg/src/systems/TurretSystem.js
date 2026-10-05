import * as THREE from 'three';
import { Turret } from '../entities/Turret.js';
import { ProjectilePool } from '../entities/Projectile.js';
import { RangeRings } from '../entities/RangeRings.js';
import { baseAt } from '../utils/bases.js';
import { turretRange, turretInfo, upgradeCost, upgradeItems, repairCost, repairList, demolishRefund } from '../utils/build.js';
import { josa } from '../utils/josa.js';

const tmp = new THREE.Vector3();
const aim = new THREE.Vector3();
const lead = new THREE.Vector3();
const OVERKILL = 1.1; // 날아오는 피해가 남은 체력의 110% 이상이면 그 적은 뒤로 미룬다

// 포탑 설치 반영, 조준·발사, 투사체 이동·명중, 업그레이드·수리(전체·원격)·우선순위·철거, 사거리 원
// 대상 찾기는 포탑마다 retargetInterval 초 간격 (시작 시점은 흩어 둠). 대상이 죽거나 사거리 밖이면 바로 다시 찾는다.
// 예측 사격: 몬스터 실제 속도(m.vel, 돌진형은 행동의 predict)로 투사체가 닿을 때의 자리를 겨눈다 (최대 maxLead m).
// 초과 피해 방지: 직선 투사체 피해를 대상의 incoming 에 예약하고, 맞거나 사라지면 뺀다 (범위 피해는 예약 안 함).
// 개발용: 주소에 ?debug=turret 이면 포탑 머리 위에 명중/발사, 습격이 끝나면 종류별 명중률을 콘솔에.
export class TurretSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.turret;
    this.turrets = [];
    this.pool = new ProjectilePool(ctx.scene);
    this.blasts = [];
    this.rings = new RangeRings(ctx.scene);
    this.focus = null; // 포탑 창에서 보고 있는 포탑
    this.lead = true; // 예측 사격 (비교 시험용으로 끌 수 있다)
    this.spreadFire = true; // 초과 피해 방지 (비교 시험용으로 끌 수 있다)
    this.debug = new URLSearchParams(location.search).get('debug') === 'turret';
    this.tally = {}; // 종류별 { shots, hits } (습격 단위)
    if (this.debug) this.setupDebug();
    ctx.bus.on('raid:end', () => this.report());
    this.buildOpen = false; // 건설 창이 열려 있음
    const { bus } = ctx;
    bus.on('turret:focus', ({ turret }) => { this.focus = turret; });
    bus.on('ui:open', ({ id }) => { if (id === 'build') this.buildOpen = true; });
    bus.on('ui:close', ({ id }) => { if (id === 'build') this.buildOpen = false; });
    bus.on('turret:repair-all', ({ baseId, remote }) => this.repairAll(baseId, remote));

    bus.on('build:place', (e) => {
      if (e.kind !== 'turret') return;
      this.add(e.type, e.baseId, e.position);
      bus.emit('notify', { text: `${ctx.data.turrets[e.type].name} 설치!`, kind: 'item' });
    });
    this.gold = 0;
    this.counts = {};
    bus.on('gold:changed', ({ gold }) => { this.gold = gold; });
    bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const sl of slots) if (sl) this.counts[sl.id] = (this.counts[sl.id] ?? 0) + sl.count;
    });
    bus.on('turret:upgrade', ({ turret }) => this.upgrade(turret));
    bus.on('turret:repair', ({ turret }) => this.repair(turret));
    // 우선순위: 포탑 종류마다 허용 목록(turrets.json priorities) 안에서 돌아간다
    bus.on('turret:priority', ({ turret }) => {
      const list = turret.def.priorities ?? ['nearest', 'lowestHp'];
      turret.priority = list[(list.indexOf(turret.priority) + 1) % list.length];
      turret.target = null;
      this.changed(turret);
    });
    bus.on('turret:demolish', ({ turret }) => this.demolish(turret));
    // 포탑 과부하 스킬: 정해진 시간 동안 연사 속도 배율
    // 밤의 군주: 가까운 포탑 하나를 잠재운다
    bus.on('turret:sleep', ({ position, radius, duration }) => {
      const near = this.turrets.filter((t) => t.alive && !(t.sleep > 0) && t.position.distanceTo(position) <= radius);
      if (!near.length) return;
      const t = near[Math.floor(Math.random() * near.length)];
      t.sleep = duration;
      bus.emit('turret:slept', { turret: t });
      bus.emit('notify', { text: `${josa(t.def.name, '이/가')} 잠들었습니다!`, kind: 'warn' });
    });
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
    const list = t.def.priorities ?? ['nearest', 'lowestHp'];
    if (!list.includes(t.priority)) t.priority = list[0]; // 예전 저장의 허용되지 않는 값
    t.search = Math.random() * this.cfg.retargetInterval; // 대상 찾기 시점을 포탑마다 흩는다
    t.target = null;
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
    // 골드와 재료를 둘 다 먼저 확인하고, 둘 다 있을 때만 한 번에 뺀다 (가방이 차 있어도 재료가 사라지지 않게)
    const { bus } = this.ctx;
    const items = upgradeItems(t.def, t.level);
    if (items && !items.every((c) => this.countOf(c.id) >= c.count)) {
      bus.emit('notify', { text: '업그레이드 재료가 부족합니다', kind: 'warn' });
      return;
    }
    if (this.gold < cost) {
      bus.emit('notify', { text: `골드가 부족합니다 (${cost} 필요)`, kind: 'warn' });
      return;
    }
    if (items) {
      const e = { items, ok: false };
      bus.emit('inventory:spend', e);
      if (!e.ok) return;
    }
    if (!this.spend(cost)) return;
    t.levelUp();
    this.ctx.bus.emit('notify', { text: `${t.def.name} Lv${t.level}!`, kind: 'item' });
    this.changed(t);
  }

  countOf(id) {
    return this.counts?.[id] ?? 0;
  }

  // 한 기지 포탑 전체 수리: 수리비 적은 포탑부터, 골드가 모자라면 가능한 만큼. 원격이면 비용 배율
  repairAll(baseId, remote) {
    const list = repairList(this.ctx.structures, baseId, remote ? this.cfg.remoteRepairMultiplier : 1);
    if (!list.length) return;
    let n = 0;
    let paid = 0;
    for (const { turret, cost } of list) {
      const e = { amount: cost, ok: false };
      this.ctx.bus.emit('economy:spend', e);
      if (!e.ok) break;
      turret.repair();
      n += 1;
      paid += cost;
      this.changed(turret);
    }
    const { bus } = this.ctx;
    if (!n) bus.emit('notify', { text: `골드가 부족합니다 (${list[0].cost} 필요)`, kind: 'warn' });
    else if (n < list.length) bus.emit('notify', { text: `골드가 모자라 포탑 ${n}/${list.length}개만 수리했어요 (골드 ${paid})`, kind: 'warn' });
    else bus.emit('notify', { text: `포탑 ${n}개 ${remote ? '원격 ' : ''}수리 완료 (골드 ${paid})`, kind: 'item' });
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
  // 우선순위: nearest 가까운 적 / lowestHp 체력 낮은 / highestHp 체력 높은 / first 텐트에 가장 가까운 / flier 비행 우선 /
  // spread(독침) 최근에 쏜 적은 뒤로. exclude 는 다중 사격 두 번째 대상 고를 때 첫 대상
  pickTarget(t, exclude = null) {
    const range = turretRange(t.def, this.ctx.player.stats, t.level);
    const tent = t.priority === 'first' ? this.ctx.bases.find((b) => b.id === t.baseId)?.position : null;
    let best = null;
    let bestScore = Infinity;
    for (const m of this.ctx.monsters) {
      if (!m.alive || m.untargetable || m === exclude) continue;
      const d = Math.hypot(m.position.x - t.position.x, m.position.z - t.position.z);
      if (d > range) continue;
      let score;
      switch (t.priority) {
        case 'lowestHp': score = m.stats.hp; break;
        case 'highestHp': score = -m.stats.hp; break;
        case 'first': score = tent ? Math.hypot(m.position.x - tent.x, m.position.z - tent.z) : d; break;
        case 'flier': score = (m.def.flier ? 0 : 1000) + d; break;
        case 'spread': score = d + (t.recent?.includes(m) ? 1000 : 0); break;
        default: score = d;
      }
      if (this.doomed(m)) score += 1e6; // 이미 죽을 만큼 날아오고 있으면 뒤로 (그것뿐이면 그래도 쏜다)
      if (score < bestScore) { bestScore = score; best = m; }
    }
    return best;
  }

  doomed(m) {
    return this.spreadFire && m.incoming >= m.stats.hp * OVERKILL;
  }

  // t 초 뒤 대상 자리 (예측). 돌진형 예고·돌진 중이면 행동이 알려 주는 자리, 아니면 실제 속도로. 최대 maxLead m
  predict(m, t, out) {
    if (!this.lead) return out.copy(m.position);
    if (!m.behavior?.predict?.(m, t, out)) out.copy(m.position).addScaledVector(m.vel, t);
    lead.subVectors(out, m.position).setY(0);
    const max = this.cfg.maxLead;
    if (lead.lengthSq() > max * max) out.copy(m.position).addScaledVector(lead.setLength(max), 1);
    return out;
  }

  // 투사체가 닿는 시간을 두 번 다시 계산해 조준점을 맞춘다. time(거리) = 비행시간
  aimAt(from, m, time) {
    aim.copy(m.position);
    for (let i = 0; i < 2; i++) {
      const dist = Math.hypot(aim.x - from.x, aim.z - from.z);
      this.predict(m, time(dist), aim);
    }
    return aim;
  }

  // 날아가던 투사체가 맞거나 사라질 때: 예약했던 피해를 대상에서 뺀다
  unreserve(p) {
    if (p.target && p.reserved) p.target.incoming = Math.max(0, p.target.incoming - p.reserved);
    p.target = null;
    p.reserved = 0;
  }

  // 한 번 쏘기: 다중 사격(나무 활 Lv5)이면 다른 대상(없으면 같은 대상)에게 한 발 더
  fire(t, target) {
    const def = t.def;
    const info = turretInfo(def, this.ctx.player.stats, t.level);
    this.shoot(t, target, info);
    for (let i = 1; i < info.shots; i++) this.shoot(t, this.pickTarget(t, target) ?? target, info);
    if (t.priority === 'spread') t.recent = [target, ...(t.recent ?? [])].slice(0, 2);
    t.recoil = 1;
    this.ctx.bus.emit('turret:fired', { type: t.type, position: t.position, muzzle: t.muzzle, target: def.splashRadius ? target.position.clone() : null, splash: def.splashRadius ?? 0 });
  }

  shoot(t, target, info) {
    const def = t.def;
    const from = t.muzzle;
    const { damage, range } = info;
    const p = this.pool.acquire(def.projectile);
    if (def.splashRadius) {
      // 포물선: 떨어질 때 적이 있을 자리로, 날아가는 시간은 거리로 정한다.
      const g = this.cfg.gravity;
      const flight = (dist) => Math.max(0.4, dist / def.projectileSpeed);
      const at = this.aimAt(from, target, flight);
      tmp.set(at.x - from.x, 0, at.z - from.z);
      const time = flight(tmp.length());
      const vel = tmp.divideScalar(time);
      vel.y = (0 - from.y + 0.5 * g * time * time) / time;
      p.fire(from, vel, damage, time + 1, { gravity: g, splash: { radius: def.splashRadius, minFactor: def.splashMinFactor } });
    } else {
      const at = this.aimAt(from, target, (dist) => dist / def.projectileSpeed);
      tmp.set(at.x, 0.5, at.z).sub(from).normalize().multiplyScalar(def.projectileSpeed);
      p.fire(from, tmp, damage, (range * 1.3) / def.projectileSpeed);
    }
    p.turret = t;
    p.pierceLeft = info.pierce; // 석궁: 한 줄로 몇 마리까지
    p.hitSet = info.pierce > 1 ? new Set() : null;
    // 초과 피해 방지: 한 대상만 맞히는 투사체만 예약 (대포·서리 범위는 안 함)
    p.target = null;
    p.reserved = 0;
    if (!def.splashRadius && !def.hitSplash) {
      p.target = target;
      p.reserved = damage;
      target.incoming += damage;
    }
    t.shots = (t.shots ?? 0) + 1;
    (this.tally[t.type] ??= { shots: 0, hits: 0 }).shots += 1;
    p.onHit = info.effect;
    p.hitSplash = def.hitSplash ?? 0;
  }

  // 사거리 원: (a) 놓을 포탑 (b) 포탑 창에서 보는 포탑 (c) 건설 창·건설 모드 중엔 그 기지 포탑 모두(반투명)
  updateRings() {
    const { ctx, rings } = this;
    const stats = ctx.player.stats;
    rings.begin();
    const placing = ctx.placing;
    const building = this.buildOpen || !!placing;
    if (building) {
      const base = baseAt(ctx.bases, placing?.pos ?? ctx.player.position);
      if (base) {
        for (const t of this.turrets) {
          if (t.baseId === base.id && t !== this.focus) rings.show(t.position, turretRange(t.def, stats, t.level), false);
        }
      }
    }
    if (placing?.kind === 'turret') rings.show(placing.pos, turretRange(ctx.data.turrets[placing.type], stats, 1), true, !placing.check?.ok);
    if (this.focus && this.turrets.includes(this.focus)) rings.show(this.focus.position, turretRange(this.focus.def, stats, this.focus.level), true);
    rings.end();
  }

  counted(p) {
    const t = p.turret;
    if (!t) return;
    t.hits = (t.hits ?? 0) + 1;
    (this.tally[t.type] ??= { shots: 0, hits: 0 }).hits += 1;
  }

  // 개발용 명중률: 습격이 끝나면 종류별로 콘솔에 (그리고 새로 센다)
  report() {
    const rows = Object.entries(this.tally).map(([type, x]) => ({ 포탑: this.ctx.data.turrets[type]?.name ?? type, 발사: x.shots, 명중: x.hits, 명중률: x.shots ? `${Math.round((x.hits / x.shots) * 100)}%` : '-' }));
    if (this.debug && rows.length) {
      console.log('[포탑 명중률] 이번 습격');
      console.table(rows);
    }
    this.tally = {};
    return rows;
  }

  setupDebug() {
    this.debugEl = document.createElement('div');
    this.debugEl.className = 'turret-debug';
    document.getElementById('ui')?.appendChild(this.debugEl);
  }

  // ?debug=turret: 포탑 머리 위에 명중/발사
  drawDebug() {
    const cam = this.ctx.camera;
    const w = window.innerWidth;
    const h = window.innerHeight;
    while (this.debugEl.children.length < this.turrets.length) this.debugEl.appendChild(document.createElement('b'));
    this.turrets.forEach((t, i) => {
      const el = this.debugEl.children[i];
      tmp.copy(t.position).setY(2.6).project(cam);
      el.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
      el.textContent = `${t.hits ?? 0}/${t.shots ?? 0}`;
    });
    for (let i = this.turrets.length; i < this.debugEl.children.length; i++) this.debugEl.children[i].textContent = '';
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
      if (t.sleep > 0) { t.sleep -= dt; continue; } // 잠든 포탑은 쏘지 않는다
      const oc = t.overclock;
      if (oc && (oc.time -= dt) <= 0) t.overclock = null;
      t.cooldown -= dt * (t.overclock?.mult ?? 1);
      // 대상 찾기: 간격마다, 또는 지금 대상이 죽었거나 사거리 밖이면 바로
      t.search -= dt;
      const cur = t.target;
      const lost = cur && (!cur.alive || cur.untargetable
        || Math.hypot(cur.position.x - t.position.x, cur.position.z - t.position.z) > turretRange(t.def, this.ctx.player.stats, t.level));
      if (lost || t.search <= 0 || (t.cooldown <= 0 && cur && this.doomed(cur))) {
        t.target = this.pickTarget(t);
        t.search = this.cfg.retargetInterval;
      }
      const target = t.target;
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
          if (monsters.some((m) => m.alive && !m.untargetable && Math.hypot(m.position.x - p.position.x, m.position.z - p.position.z) < p.splash.radius + m.radius)) this.counted(p);
          bus.emit('projectile:explode', { position: p.position.clone(), radius: p.splash.radius, minFactor: p.splash.minFactor, damage: p.damage, turret: p.turret, armorPierce: p.turret?.def.armorPierce ?? 0 });
          this.blast(p.position, p.splash.radius);
          p.release();
        }
        continue;
      }
      let hit = null;
      for (const m of monsters) {
        if (!m.alive || m.untargetable || p.hitSet?.has(m)) continue;
        // 이번 프레임 이동 구간 전체로 판정 (빠른 총알이 작은 적을 건너뛰지 않게). 높이 조건은 그대로
        if (p.position.y < m.radius * 2 + (m.def.flier ? 1.3 : 0) && p.sweepHits(m.position.x, m.position.z, m.radius + 0.15)) { hit = m; break; }
      }
      if (hit || p.life <= 0 || p.position.y < 0) this.unreserve(p);
      if (hit) this.counted(p);
      if (hit && p.hitSplash) {
        // 서리 포탑: 맞은 자리 둘레 모두 (감속)
        bus.emit('projectile:explode', { position: hit.position.clone(), radius: p.hitSplash, minFactor: 1, damage: p.damage, effect: p.onHit, turret: p.turret, armorPierce: p.turret?.def.armorPierce ?? 0 });
        this.blast(hit.position, p.hitSplash, 0x8fd0ff);
        p.release();
      } else if (hit) {
        bus.emit('projectile:hit', { monster: hit, damage: p.damage, dir: p.velocity.clone().setY(0).normalize(), effect: p.onHit, turret: p.turret, armorPierce: p.turret?.def.armorPierce ?? 0 });
        // 관통(석궁): 맞힌 적은 다시 맞히지 않고 계속 날아간다
        p.pierceLeft -= 1;
        if (p.pierceLeft > 0 && p.hitSet) {
          p.hitSet.add(hit);
          // 맞힌 높이 그대로 수평으로 계속 (비스듬히 내려가던 탄이 땅에 박히지 않게), 남은 거리는 사거리만큼
          const sp = p.velocity.length();
          p.velocity.setY(0).setLength(sp);
          p.life = Math.max(p.life, (p.turret.def.range * 0.6) / sp);
        } else p.release();
      } else if (p.life <= 0 || p.position.y < 0) {
        p.release();
      }
    }

    this.updateRings();
    if (this.debug) this.drawDebug();

    for (const b of this.blasts) {
      if (b.t >= 1) continue;
      b.t = Math.min(1, b.t + dt / 0.35);
      b.mesh.scale.setScalar(b.radius * (0.3 + 0.7 * b.t));
      b.mesh.material.opacity = 0.6 * (1 - b.t);
      if (b.t >= 1) b.mesh.visible = false;
    }
  }
}
