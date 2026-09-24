import * as THREE from 'three';

const dir = new THREE.Vector3();

// 점 pos에서 선분(origin에서 dir 방향 length)까지의 거리
function sideDistance(pos, origin, d, length) {
  const rx = pos.x - origin.x;
  const rz = pos.z - origin.z;
  const along = Math.max(0, Math.min(length, rx * d.x + rz * d.z));
  return Math.hypot(rx - d.x * along, rz - d.z * along);
}

// 공격 판정과 데미지 계산. 결과는 이벤트로 알린다.
export class CombatSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.combat;
    ctx.bus.on('player:attack', (a) => this.onPlayerAttack(a));
    ctx.bus.on('monster:attack', (a) => this.onMonsterAttack(a));
    ctx.bus.on('projectile:hit', (a) => this.onProjectileHit(a));
    ctx.bus.on('projectile:explode', (a) => this.onExplode(a));
    ctx.bus.on('boss:aoe', (a) => this.areaHitPlayer(a));
    ctx.bus.on('monster:emerge', (a) => this.areaHitPlayer(a));
    ctx.bus.on('monster:blast', (a) => this.onBlast(a));
    ctx.bus.on('boss:line', (a) => this.onLine(a));
    ctx.bus.on('player:sweep', (a) => this.onSweep(a));
    ctx.bus.on('monster:charge-hit', ({ monster, dir: d }) => {
      if (monster.alive) this.hitPlayer(monster.stats.attack, d, monster.def.hitEffect);
    });
    ctx.bus.on('enemy:hit-player', (a) => this.hitPlayer(a.damage, a.dir, a.effect));
    ctx.bus.on('arrow:hit', ({ monster, shot, dir: d }) => {
      if (monster.alive && !monster.untargetable) this.playerHits(monster, shot, d.clone());
    });
    ctx.bus.on('status:damage', ({ target, amount }) => {
      if (target === ctx.player) {
        if (target.applyDot(amount)) ctx.bus.emit('combat:hit', { position: target.position.clone(), amount, crit: false, target: 'player', source: 'status' });
        return;
      }
      const monster = target;
      if (!monster.alive) return;
      const killed = monster.takeDamage(amount, null);
      ctx.bus.emit('combat:hit', { position: monster.position.clone(), amount, crit: false, target: 'monster', source: 'status', color: '#7cd67a' });
      if (killed) this.killed(monster, true);
    });
  }

  // noLoot: 스스로 터진 몬스터 (보상 없음)
  killed(m, byPlayer = false, noLoot = false) {
    const { bus } = this.ctx;
    // 처치 시 HP 회복 (왕젤리 대검 등)
    const heal = this.ctx.player.stats.onKillHeal;
    if (byPlayer && heal) bus.emit('player:heal', { amount: heal });
    bus.emit('monster:killed', {
      type: m.type, position: m.position.clone(), color: m.def.color, radius: m.radius, boss: !!m.boss, elite: !!m.elite, noLoot,
    });
    // 분열: 작은 개체로 갈라진다
    if (m.def.splitInto) {
      bus.emit('monster:spawn', { type: m.def.splitInto, count: m.def.splitCount, position: m.position.clone(), mult: m.statMult, night: m.night, spread: m.radius });
    }
  }

  calcDamage(attack, defense, critChance = 0, critMultiplier = 1) {
    const v = this.cfg.variance;
    let dmg = (attack - defense) * (1 + (Math.random() * 2 - 1) * v);
    const crit = Math.random() < critChance;
    if (crit) dmg *= critMultiplier;
    return { amount: Math.max(this.cfg.minDamage, Math.round(dmg)), crit };
  }

  // 부채꼴(사거리 + 각도) 안의 몬스터를 모두 벤다.
  onPlayerAttack(a) {
    const { bus, monsters } = this.ctx;
    const half = a.arc / 2;
    for (const m of monsters) {
      if (!m.alive || m.untargetable) continue;
      dir.set(m.position.x - a.origin.x, 0, m.position.z - a.origin.z);
      const dist = dir.length();
      if (dist - m.radius > a.range) continue;
      if (dist > m.radius) {
        dir.divideScalar(dist);
        if (dir.angleTo(a.dir) > half) continue;
      } else {
        dir.copy(a.dir);
      }
      this.playerHits(m, a, dir.clone());
    }
  }

  // 플레이어 공격(근접·화살) 한 방: 치명타, 밤 몬스터 추가 피해, 적중 시 독·감속, 처치 시 회복
  playerHits(m, a, d) {
    const s = this.ctx.player.stats;
    const night = (m.night || m.raid) && s.nightBonus ? 1 + s.nightBonus : 1;
    const { amount, crit } = this.calcDamage(a.attack * night, m.stats.defense, a.critChance, a.critMultiplier);
    const killed = m.takeDamage(amount, d.multiplyScalar(a.knockback));
    this.ctx.bus.emit('combat:hit', { position: m.position.clone(), amount, crit, target: 'monster', source: 'player', color: m.def.color });
    if (killed) {
      this.killed(m, true);
      return;
    }
    if (s.onHitPoison) this.ctx.bus.emit('status:apply', { target: m, type: 'poison', duration: s.onHitPoison });
    if (s.onHitSlow) this.ctx.bus.emit('status:apply', { target: m, type: 'slow', duration: 2, amount: s.onHitSlow });
  }

  // effect: 포탑 적중 효과 (독침·서리)
  onProjectileHit({ monster, damage, dir: d, effect }) {
    if (!monster.alive || monster.untargetable) return;
    // 명사수 포탑 스킬: 포탑 치명타
    const { player } = this.ctx;
    const { amount, crit } = this.calcDamage(damage, monster.stats.defense, player.stats.turretCrit ?? 0, player.base.critMultiplier);
    const killed = monster.takeDamage(amount, d.clone().multiplyScalar(this.cfg.projectileKnockback));
    this.ctx.bus.emit('combat:hit', { position: monster.position.clone(), amount, crit, target: 'monster', source: 'turret', color: monster.def.color });
    if (killed) this.killed(monster);
    else if (effect) this.ctx.bus.emit('status:apply', { target: monster, ...effect });
  }

  // 보스 범위 공격·두더지 솟아오르기: 범위 안이면 플레이어가 맞는다.
  areaHitPlayer({ position, radius, damage }) {
    const p = this.ctx.player;
    const d = Math.hypot(p.position.x - position.x, p.position.z - position.z);
    if (d > radius + p.radius) return;
    const dir = new THREE.Vector3(p.position.x - position.x, 0, p.position.z - position.z);
    this.hitPlayer(damage, dir.lengthSq() > 1e-4 ? dir.normalize() : null);
  }

  // effect: 맞으면 걸리는 상태 이상 { type, duration, amount }
  hitPlayer(attack, dir, effect) {
    const { player, bus } = this.ctx;
    if (!player.alive) return;
    const { amount } = this.calcDamage(attack, player.stats.defense);
    if (player.takeDamage(amount, dir)) {
      bus.emit('combat:hit', { position: player.position.clone(), amount, crit: false, target: 'player' });
      if (effect) bus.emit('status:apply', { target: player, ...effect });
    }
  }

  // 자폭: 플레이어와 둘레 건물. 건물엔 multiplier배. 터진 몬스터는 보상 없이 죽는다.
  onBlast({ monster, position, radius, damage, multiplier }) {
    if (!monster.alive) return;
    monster.takeDamage(monster.stats.hp, null);
    this.killed(monster, false, true);
    this.areaHitPlayer({ position, radius, damage });
    for (const s of this.ctx.structures) {
      if (!s.alive) continue;
      if (Math.hypot(s.position.x - position.x, s.position.z - position.z) > radius + s.radius) continue;
      this.damageStructure(s, damage * multiplier);
    }
  }

  // 뿌리 줄기: 직선(길이·폭) 안이면 맞는다.
  onLine({ origin, dir: d, length, width, damage }) {
    const p = this.ctx.player;
    if (sideDistance(p.position, origin, d, length) > width / 2 + p.radius) return;
    this.hitPlayer(damage, d.clone());
  }

  // 돌진 베기: 지나간 길 위의 적 모두
  onSweep(a) {
    const length = Math.hypot(a.to.x - a.from.x, a.to.z - a.from.z);
    for (const m of this.ctx.monsters) {
      if (!m.alive || m.untargetable) continue;
      if (sideDistance(m.position, a.from, a.dir, length) > a.width / 2 + m.radius) continue;
      this.playerHits(m, a, a.dir.clone());
    }
  }

  // 대포: 떨어진 곳 둘레 모두. 가장자리일수록 약하다.
  onExplode({ position, radius, minFactor, damage, effect }) {
    for (const m of this.ctx.monsters) {
      if (!m.alive) continue;
      const d = Math.hypot(m.position.x - position.x, m.position.z - position.z);
      if (d > radius + m.radius) continue;
      const k = 1 - (1 - minFactor) * Math.min(1, d / radius);
      const dir = new THREE.Vector3(m.position.x - position.x, 0, m.position.z - position.z).normalize();
      this.onProjectileHit({ monster: m, damage: damage * k, dir: dir.multiplyScalar(2), effect });
    }
  }

  // 포탑·텐트를 때릴 때
  hitStructure(monster, s) {
    if (!s.alive) return;
    const dist = monster.position.distanceTo(s.position);
    if (dist > monster.stats.attackRange + s.radius + monster.radius * 0.5) return;
    const mult = monster.def.structureDamageMultiplier ?? 1;
    this.damageStructure(s, monster.stats.attack * mult);
  }

  damageStructure(s, attack) {
    const { bus } = this.ctx;
    const { amount } = this.calcDamage(attack, 0);
    const destroyed = s.takeDamage(amount);
    bus.emit('combat:hit', { position: s.position.clone(), amount, crit: false, target: 'structure' });
    if (destroyed) {
      bus.emit('structure:destroyed', { structure: s });
      if (s.kind === 'wall') return; // 벽은 조용히 무너진다
      const name = s.kind === 'tent' ? s.base.name : s.def.name;
      bus.emit('notify', { text: `${name}이(가) 부서졌습니다!`, kind: 'warn' });
    }
  }

  onMonsterAttack({ monster, target }) {
    const { bus, player } = this.ctx;
    if (target && target !== player) {
      this.hitStructure(monster, target);
      return;
    }
    if (!player.alive || !monster.alive) return;
    dir.set(player.position.x - monster.position.x, 0, player.position.z - monster.position.z);
    const dist = dir.length();
    // 튀어오르는 동안 조금 더 닿으므로 사거리에 몸 반지름을 더해 판정한다.
    if (dist > monster.stats.attackRange + player.radius + monster.radius * 0.5) return;
    const { amount } = this.calcDamage(monster.stats.attack, player.stats.defense);
    if (dist > 1e-4) dir.divideScalar(dist);
    if (player.takeDamage(amount, dir)) {
      bus.emit('combat:hit', { position: player.position.clone(), amount, crit: false, target: 'player' });
      if (monster.def.hitEffect) bus.emit('status:apply', { target: player, ...monster.def.hitEffect });
    }
  }
}
