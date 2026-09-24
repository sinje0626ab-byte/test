import * as THREE from 'three';

// 회피 구르기: Space(모바일 구르기 버튼). 정해진 시간 동안 한 방향으로 빠르게 이동, 앞부분은 무적.
export class PlayerRoll {
  constructor(player) {
    this.player = player;
    this.time = -1; // 구르는 중이면 0 이상
    this.cooldown = 0;
    this.dir = new THREE.Vector3();
  }

  // 토끼발 부적 등: rollStaminaPct 만큼 싸진다
  get cost() {
    return this.player.base.rollStamina * (1 + (this.player.stats.rollStaminaPct ?? 0));
  }

  get active() {
    return this.time >= 0;
  }

  // 무적 구간인가
  get invulnerable() {
    return this.active && this.time < this.player.base.rollInvuln;
  }

  // 이번 프레임 구르기를 처리했으면 true (그러면 걷기·공격은 건너뛴다)
  update(dt, input, moveDir) {
    const p = this.player;
    const b = p.base;
    const s = p.stats;
    this.cooldown = Math.max(0, this.cooldown - dt);

    if (!this.active && input.wasPressed('Space') && this.cooldown <= 0 && s.stamina >= this.cost && p.ctx.mode === 'play') {
      this.dir.copy(moveDir.lengthSq() > 0 ? moveDir : p.facing).setY(0).normalize();
      p.facing.copy(this.dir);
      this.time = 0;
      s.stamina -= this.cost;
      p.staminaDelay = b.staminaRegenDelay;
      p.attack.cancel(); // 휘두르던 칼은 취소
      p.ctx.bus.emit('player:roll', { position: p.position.clone() });
    }
    if (!this.active) return false;

    this.time += dt;
    const speed = b.rollDistance / b.rollDuration;
    p.velocity.copy(this.dir).multiplyScalar(speed);
    p.position.addScaledVector(p.velocity, dt);
    p.ctx.world.resolveCollision(p.position, p.radius);
    // 앞으로 한 바퀴 구르는 모습
    const t = Math.min(1, this.time / b.rollDuration);
    p.inner.rotation.x = t * Math.PI * 2;
    p.inner.position.y = Math.sin(t * Math.PI) * 0.25;
    if (this.time >= b.rollDuration) {
      this.time = -1;
      this.cooldown = b.rollCooldown;
      p.inner.rotation.x = 0;
    }
    return true;
  }
}
