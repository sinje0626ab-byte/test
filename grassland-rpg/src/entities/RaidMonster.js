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
    if (this.raidBoss) this.ctx.bus.emit('boss:disengaged', { boss: this });
  }

  pickTarget() {
    const d = this.def;
    const player = this.ctx.player;
    if (player.alive && this.position.distanceTo(player.position) < d.detectRange) return player;
    let best = null;
    let bestD = Infinity;
    for (const s of this.ctx.structures) {
      if (!s.alive || s.baseId !== this.base.id || s.kind === 'wall') continue;
      const dist = this.position.distanceTo(s.position) - s.radius;
      if (dist < bestD) { bestD = dist; best = s; }
    }
    return best;
  }

  // 벽이 있는 기지: 격자 A*로 길을 찾고(repathInterval마다), 완전히 막혔으면 가장 가까운 벽을 부순다.
  // 돌아갈 방향(다음 칸) 또는 부술 벽을 정한다.
  navigate(dt, target) {
    const grid = this.ctx.wallGrid;
    const cfg = this.ctx.data.config.walls;
    if (!grid || this.def.flier || !grid.countFor(this.base.id)) {
      this.path = null;
      this.wallTarget = null;
      return target;
    }
    this.repath = (this.repath ?? Math.random() * cfg.repathInterval) - dt;
    if (this.repath <= 0 || (this.wallTarget && !this.wallTarget.alive)) {
      this.repath = cfg.repathInterval;
      this.path = grid.path(this.position, target.position, this.base);
      this.wallTarget = this.path ? null : this.nearestWall();
    }
    if (this.wallTarget?.alive) return this.wallTarget;
    return target;
  }

  nearestWall() {
    let best = null;
    let bestD = Infinity;
    for (const s of this.ctx.structures) {
      if (s.kind !== 'wall' || !s.alive || s.baseId !== this.base.id) continue;
      const d = this.position.distanceTo(s.position);
      if (d < bestD) { bestD = d; best = s; }
    }
    return best;
  }

  // 길이 있으면 다음 칸 쪽, 없으면 곧장
  steer(target, out) {
    const p = this.path;
    while (p?.length && Math.hypot(p[0].x - this.position.x, p[0].z - this.position.z) < 0.45) p.shift();
    if (p?.length > 1 || (p?.length && target !== this.wallTarget)) out.set(p[0].x - this.position.x, 0, p[0].z - this.position.z);
    else out.set(target.position.x - this.position.x, 0, target.position.z - this.position.z);
    return out;
  }

  think(dt) {
    const d = this.def;
    const move = new THREE.Vector3();
    let speed = 0;

    switch (this.state) {
      case 'raid': {
        const goal = this.pickTarget();
        const target = goal && this.navigate(dt, goal);
        if (!target) {
          move.set(this.base.position.x - this.position.x, 0, this.base.position.z - this.position.z);
          speed = move.length() > 2 ? d.moveSpeed : 0;
          break;
        }
        this.attackTarget = target;
        tmp.set(target.position.x - this.position.x, 0, target.position.z - this.position.z);
        const reach = d.attackRange + target.radius;
        if (tmp.length() <= reach && this.cooldown <= 0) {
          this.setState(d.behavior === 'exploder' ? 'fuse' : 'attack'); // 자폭 몬스터는 부풀었다 터진다
          break;
        }
        this.steer(target, move);
        speed = tmp.length() > reach * 0.85 ? (target === this.ctx.player ? d.chaseSpeed : d.moveSpeed) : 0;
        break;
      }
      case 'attack':
        if (!this.attackTarget?.alive) { this.setState('raid'); break; }
        this.attackStep('raid');
        break;
      case 'fuse':
        if (this.stateTime >= d.fuseTime) {
          this.ctx.bus.emit('monster:blast', { monster: this, position: this.position.clone(), radius: d.blastRadius, damage: this.stats.attack, multiplier: d.blastMultiplier });
        }
        break;
      case 'retreat': {
        move.set(this.position.x - this.base.position.x, 0, this.position.z - this.base.position.z);
        speed = d.moveSpeed * 1.5;
        this.retreatTimer += dt;
        this.setOpacity(Math.max(0, 0.92 * (1 - this.retreatTimer / 3)));
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
    if (died && this.raidBoss) this.ctx.bus.emit('boss:disengaged', { boss: this });
    // 부모는 맞으면 추적/도주로 바꾸지만 습격 몬스터는 하던 일을 계속한다.
    if (!died && this.state !== 'attack' && this.state !== 'retreat' && this.state !== 'fuse') this.setState('raid');
    return died;
  }
}
