import * as THREE from 'three';
import { Monster } from './Monster.js';

const tmp = new THREE.Vector3();

// 밤 습격 몬스터: 기지로 와서 가까운 플레이어 → 포탑·텐트 순으로 부순다. 도망치지 않는다.
export class RaidMonster extends Monster {
  constructor(ctx, type, position, base) {
    super(ctx, type, position);
    this.raid = true;
    this.base = base;
    this.hasFled = true; // 도주 없음
    this.retreatTimer = 0;
    this.setState('raid');
  }

  // 아침이 오거나 습격이 끝나면 기지 반대쪽으로 물러가며 사라진다.
  retreat() {
    if (!this.alive || this.state === 'retreat') return;
    this.setState('retreat');
  }

  pickTarget() {
    const d = this.def;
    const player = this.ctx.player;
    if (player.alive && this.position.distanceTo(player.position) < d.detectRange) return player;
    let best = null;
    let bestD = Infinity;
    for (const s of this.ctx.structures) {
      if (!s.alive || s.baseId !== this.base.id) continue;
      const dist = this.position.distanceTo(s.position) - s.radius;
      if (dist < bestD) { bestD = dist; best = s; }
    }
    return best;
  }

  think(dt) {
    const d = this.def;
    const move = new THREE.Vector3();
    let speed = 0;

    switch (this.state) {
      case 'raid': {
        const target = this.pickTarget();
        if (!target) {
          move.set(this.base.position.x - this.position.x, 0, this.base.position.z - this.position.z);
          speed = move.length() > 2 ? d.moveSpeed : 0;
          break;
        }
        this.attackTarget = target;
        tmp.set(target.position.x - this.position.x, 0, target.position.z - this.position.z);
        const reach = d.attackRange + target.radius;
        if (tmp.length() <= reach && this.cooldown <= 0) {
          this.setState('attack');
          break;
        }
        move.copy(tmp);
        speed = tmp.length() > reach * 0.85 ? (target === this.ctx.player ? d.chaseSpeed : d.moveSpeed) : 0;
        break;
      }
      case 'attack':
        if (!this.attackTarget?.alive) { this.setState('raid'); break; }
        this.attackStep('raid');
        break;
      case 'retreat': {
        move.set(this.position.x - this.base.position.x, 0, this.position.z - this.base.position.z);
        speed = d.moveSpeed * 1.5;
        this.retreatTimer += dt;
        this.mat.opacity = Math.max(0, 0.92 * (1 - this.retreatTimer / 3));
        if (this.retreatTimer >= 3) {
          this.alive = false;
          this.done = true;
        }
        break;
      }
    }
    return { move, speed };
  }

  takeDamage(amount, knockVec) {
    const died = super.takeDamage(amount, knockVec);
    // 부모는 맞으면 추적/도주로 바꾸지만 습격 몬스터는 하던 일을 계속한다.
    if (!died && this.state !== 'attack' && this.state !== 'retreat') this.setState('raid');
    return died;
  }
}
