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
      bus.emit('combat:hit', { position: m.position.clone(), amount, crit, target: 'monster' });
      if (killed) bus.emit('monster:killed', { type: m.type, position: m.position.clone() });
    }
  }

  onProjectileHit({ monster, damage, dir: d }) {
    if (!monster.alive) return;
    const { amount, crit } = this.calcDamage(damage, monster.stats.defense);
    const killed = monster.takeDamage(amount, d.clone().multiplyScalar(this.cfg.projectileKnockback));
    this.ctx.bus.emit('combat:hit', { position: monster.position.clone(), amount, crit, target: 'monster' });
    if (killed) this.ctx.bus.emit('monster:killed', { type: monster.type, position: monster.position.clone() });
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
      bus.emit('notify', { text: s.kind === 'tent' ? '텐트가 무너졌습니다!' : '포탑이 부서졌습니다', kind: 'warn' });
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
