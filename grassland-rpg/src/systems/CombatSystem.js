import * as THREE from 'three';

const dir = new THREE.Vector3();

// 공격 판정과 데미지 계산. 결과는 이벤트로 알린다.
export class CombatSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.combat;
    ctx.bus.on('player:attack', (a) => this.onPlayerAttack(a));
    ctx.bus.on('monster:attack', (a) => this.onMonsterAttack(a));
    ctx.bus.on('projectile:hit', (a) => this.onProjectileHit(a));
    ctx.bus.on('projectile:explode', (a) => this.onExplode(a));
    ctx.bus.on('boss:aoe', (a) => this.onBossAoe(a));
    ctx.bus.on('enemy:hit-player', (a) => this.hitPlayer(a.damage, a.dir));
  }

  killed(m) {
    this.ctx.bus.emit('monster:killed', {
      type: m.type, position: m.position.clone(), color: m.def.color, radius: m.radius, boss: !!m.boss,
    });
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
      if (!m.alive) continue;
      dir.set(m.position.x - a.origin.x, 0, m.position.z - a.origin.z);
      const dist = dir.length();
      if (dist - m.radius > a.range) continue;
      if (dist > m.radius) {
        dir.divideScalar(dist);
        if (dir.angleTo(a.dir) > half) continue;
      } else {
        dir.copy(a.dir);
      }
      const { amount, crit } = this.calcDamage(a.attack, m.stats.defense, a.critChance, a.critMultiplier);
      const killed = m.takeDamage(amount, dir.clone().multiplyScalar(a.knockback));
      bus.emit('combat:hit', { position: m.position.clone(), amount, crit, target: 'monster', source: 'player', color: m.def.color });
      if (killed) this.killed(m);
    }
  }

  onProjectileHit({ monster, damage, dir: d }) {
    if (!monster.alive) return;
    const { amount, crit } = this.calcDamage(damage, monster.stats.defense);
    const killed = monster.takeDamage(amount, d.clone().multiplyScalar(this.cfg.projectileKnockback));
    this.ctx.bus.emit('combat:hit', { position: monster.position.clone(), amount, crit, target: 'monster', source: 'turret', color: monster.def.color });
    if (killed) this.killed(monster);
  }

  // 보스 범위 공격: 범위 안이면 플레이어가 맞는다.
  onBossAoe({ position, radius, damage }) {
    const p = this.ctx.player;
    const d = Math.hypot(p.position.x - position.x, p.position.z - position.z);
    if (d > radius + p.radius) return;
    const dir = new THREE.Vector3(p.position.x - position.x, 0, p.position.z - position.z);
    this.hitPlayer(damage, dir.lengthSq() > 1e-4 ? dir.normalize() : null);
  }

  hitPlayer(attack, dir) {
    const { player, bus } = this.ctx;
    if (!player.alive) return;
    const { amount } = this.calcDamage(attack, player.stats.defense);
    if (player.takeDamage(amount, dir)) {
      bus.emit('combat:hit', { position: player.position.clone(), amount, crit: false, target: 'player' });
    }
  }

  // 대포: 떨어진 곳 둘레 모두. 가장자리일수록 약하다.
  onExplode({ position, radius, minFactor, damage }) {
    for (const m of this.ctx.monsters) {
      if (!m.alive) continue;
      const d = Math.hypot(m.position.x - position.x, m.position.z - position.z);
      if (d > radius + m.radius) continue;
      const k = 1 - (1 - minFactor) * Math.min(1, d / radius);
      const dir = new THREE.Vector3(m.position.x - position.x, 0, m.position.z - position.z).normalize();
      this.onProjectileHit({ monster: m, damage: damage * k, dir: dir.multiplyScalar(2) });
    }
  }

  // 포탑·텐트를 때릴 때
  hitStructure(monster, s) {
    const { bus } = this.ctx;
    if (!s.alive) return;
    const dist = monster.position.distanceTo(s.position);
    if (dist > monster.stats.attackRange + s.radius + monster.radius * 0.5) return;
    const mult = monster.def.structureDamageMultiplier ?? 1;
    const { amount } = this.calcDamage(monster.stats.attack * mult, 0);
    const destroyed = s.takeDamage(amount);
    bus.emit('combat:hit', { position: s.position.clone(), amount, crit: false, target: 'structure' });
    if (destroyed) {
      bus.emit('structure:destroyed', { structure: s });
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
    }
  }
}
