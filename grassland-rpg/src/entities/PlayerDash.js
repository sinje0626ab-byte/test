import * as THREE from 'three';

// 돌진 베기(액티브 스킬): 정해진 시간 동안 일직선으로 돌진, 그동안 무적.
// 끝나면 지나간 길(시작~끝, 폭 width)에 player:sweep를 보낸다 → CombatSystem.
export class PlayerDash {
  constructor(player) {
    this.player = player;
    this.time = -1;
    this.dir = new THREE.Vector3();
    this.from = new THREE.Vector3();
  }

  get active() {
    return this.time >= 0;
  }

  start(dir, a, hit) {
    const p = this.player;
    if (this.active || p.roll.active) return false;
    this.dir.copy(dir);
    this.from.copy(p.position);
    this.def = a;
    this.hit = hit;
    this.time = 0;
    p.facing.copy(dir);
    p.attack.cancel();
    p.ctx.bus.emit('player:dash', { position: p.position.clone(), dir: dir.clone() });
    return true;
  }

  // 이번 프레임 돌진을 처리했으면 true
  update(dt) {
    if (!this.active) return false;
    const p = this.player;
    const a = this.def;
    this.time += dt;
    p.velocity.copy(this.dir).multiplyScalar(a.distance / a.duration);
    p.position.addScaledVector(p.velocity, dt);
    p.ctx.world.resolveCollision(p.position, p.radius);
    p.inner.rotation.x = -0.35; // 앞으로 숙인 자세
    if (this.time >= a.duration) {
      this.time = -1;
      p.inner.rotation.x = 0;
      p.ctx.bus.emit('player:sweep', { from: this.from.clone(), to: p.position.clone(), width: a.width, dir: this.dir.clone(), ...this.hit });
    }
    return true;
  }
}
