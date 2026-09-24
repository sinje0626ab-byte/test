import * as THREE from 'three';
import { Monster } from './Monster.js';

const tmp = new THREE.Vector3();

function telegraph(radius) {
  const geo = new THREE.CircleGeometry(radius, 40).rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0, depthWrite: false }));
  mesh.position.y = 0.06;
  mesh.visible = false;
  return mesh;
}

// 보스: 둥지에서 기다리다 다가오면 싸운다. 내려찍기 + 원거리 패턴, 멀리 끌려가면 돌아가서 회복.
export class Boss extends Monster {
  constructor(ctx, bossId, def) {
    const lair = new THREE.Vector3(def.lair[0], 0, def.lair[1]);
    super(ctx, def.monster, lair);
    this.boss = true;
    this.bossId = bossId;
    this.bdef = def;
    this.lair = lair;
    this.hasFled = true;
    this.slamCd = 1.5;
    this.rangedCd = 2.5;
    this.cast = null;
    this.engaged = false;
    this.hpBar.group.visible = false;

    // 예고 표시: 내려찍기는 보스 발밑, 얼음덩이는 떨어질 자리
    this.slamMark = telegraph(def.slam.radius);
    this.mesh.add(this.slamMark);
    this.rangedMark = telegraph(def.ranged.radius ?? 1);
    ctx.scene.add(this.rangedMark);
    this.setState('idle');
  }

  setEngaged(on) {
    if (this.engaged === on) return;
    this.engaged = on;
    this.ctx.bus.emit(on ? 'boss:engaged' : 'boss:disengaged', { boss: this });
  }

  think(dt) {
    const d = this.def;
    const b = this.bdef;
    const player = this.ctx.player;
    const move = new THREE.Vector3();
    let speed = 0;
    this.slamCd -= dt;
    this.rangedCd -= dt;
    const dist = player.alive ? this.position.distanceTo(player.position) : Infinity;
    const fromLair = this.position.distanceTo(this.lair);

    switch (this.state) {
      case 'idle':
        if (dist < b.aggroRange) this.setState('chase');
        break;
      case 'chase': {
        this.setEngaged(true);
        if (!player.alive || fromLair > b.leashRange || this.lair.distanceTo(player.position) > b.leashRange + 6) {
          this.setState('return');
          break;
        }
        if (dist < b.slam.radius * 0.8 && this.slamCd <= 0) { this.startCast('slam'); break; }
        if (dist < b.ranged.range && this.rangedCd <= 0) { this.startCast('ranged'); break; }
        move.set(player.position.x - this.position.x, 0, player.position.z - this.position.z);
        speed = dist > b.slam.radius * 0.5 ? d.chaseSpeed : 0;
        break;
      }
      case 'cast':
        this.updateCast();
        break;
      case 'return':
        this.setEngaged(false);
        move.set(this.lair.x - this.position.x, 0, this.lair.z - this.position.z);
        speed = d.moveSpeed * 2;
        if (fromLair < 1) {
          this.stats.hp = this.stats.maxHp; // 둥지에 돌아오면 회복
          this.setState('idle');
        }
        break;
    }
    return { move, speed };
  }

  startCast(kind) {
    const b = this.bdef;
    const p = this.ctx.player.position;
    this.cast = { kind, windup: kind === 'slam' ? b.slam.windup : b.ranged.windup, target: new THREE.Vector3(p.x, 0, p.z) };
    this.setState('cast');
    if (kind === 'ranged' && b.ranged.kind === 'boulder') {
      this.rangedMark.position.set(p.x, 0.06, p.z);
      this.rangedMark.visible = true;
    }
    if (kind === 'slam') this.slamMark.visible = true;
  }

  updateCast() {
    const c = this.cast;
    const b = this.bdef;
    const t = Math.min(1, this.stateTime / c.windup);
    const mark = c.kind === 'slam' ? this.slamMark : this.rangedMark;
    mark.material.opacity = 0.15 + 0.35 * t;
    tmp.set(c.target.x - this.position.x, 0, c.target.z - this.position.z);
    if (tmp.lengthSq() > 1e-4) this.facing.copy(tmp.normalize());
    if (t < 1) return;

    const bus = this.ctx.bus;
    if (c.kind === 'slam') {
      bus.emit('boss:aoe', { position: this.position.clone(), radius: b.slam.radius, damage: b.slam.damage, boss: this });
      this.slamCd = b.slam.cooldown;
    } else if (b.ranged.kind === 'volley') {
      bus.emit('boss:volley', { origin: this.position.clone(), count: b.ranged.count, speed: b.ranged.speed, damage: b.ranged.damage, range: b.ranged.range });
      this.rangedCd = b.ranged.cooldown;
    } else {
      bus.emit('boss:boulder', { from: this.position.clone().setY(this.radius * 2), target: c.target.clone(), speed: b.ranged.speed, radius: b.ranged.radius, damage: b.ranged.damage, mark: this.rangedMark });
      this.rangedCd = b.ranged.cooldown;
    }
    this.slamMark.visible = false;
    if (c.kind !== 'ranged' || b.ranged.kind !== 'boulder') this.rangedMark.visible = false;
    this.cast = null;
    this.setState('chase');
  }

  animate(dt, speed) {
    super.animate(dt, speed);
    this.hpBar.group.visible = false; // 보스 체력은 화면 위 막대로
    if (this.state === 'cast') {
      const t = Math.min(1, this.stateTime / this.cast.windup);
      this.body.scale.set(1 + t * 0.12, 1 - t * 0.2, 1 + t * 0.12); // 힘 모으기
    }
  }

  takeDamage(amount, knockVec) {
    const died = super.takeDamage(amount, knockVec);
    if (died) {
      this.setEngaged(false);
      this.slamMark.visible = false;
      this.rangedMark.visible = false;
      return true;
    }
    // 부모는 맞으면 추적·도주로 바꾸지만 보스는 하던 일을 계속한다.
    if (this.state === 'idle' || this.state === 'wander') this.setState('chase');
    return false;
  }

  dispose() {
    this.setEngaged(false);
    this.ctx.scene.remove(this.rangedMark);
    super.dispose();
  }
}
