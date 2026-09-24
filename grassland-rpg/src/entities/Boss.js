import * as THREE from 'three';
import { Monster } from './Monster.js';
import { PATTERNS } from './bossPatterns.js';

const tmp = new THREE.Vector3();

// 보스: 둥지에서 기다리다 다가오면 싸운다. bosses.json의 patterns에서 쿨다운이 돈 패턴을 골라 쓴다.
// 멀리 끌려가면 돌아가서 회복. 페이즈: split(갈라짐) / enrage(분노).
// opts: { monster, position, patterns, part } — 분열 조각은 part = true
export class Boss extends Monster {
  constructor(ctx, bossId, def, opts = {}) {
    const lair = new THREE.Vector3(def.lair[0], 0, def.lair[1]);
    super(ctx, opts.monster ?? def.monster, opts.position ?? lair);
    this.boss = true;
    this.bossId = bossId;
    this.bdef = def;
    this.lair = lair;
    this.part = !!opts.part;
    this.hasFled = true;
    this.cast = null;
    this.engaged = false;
    this.jumpHeight = 0;
    this.cdSpeed = 1;
    this.sceneMarks = [];
    this.hpBar.group.visible = false;
    // 패턴마다 따로 쿨다운 (처음엔 조금씩 어긋나게)
    this.patterns = (opts.patterns ?? def.patterns).map((p, i) => ({ ...p, cd: 1.2 + i * 1.3 }));
    this.setState(this.part ? 'chase' : 'idle');
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
    for (const p of this.patterns) p.cd -= dt * this.cdSpeed;
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
        const p = this.patterns.find((x) => x.cd <= 0 && PATTERNS[x.kind].ready(this, x, dist));
        if (p) { this.startCast(p); break; }
        move.set(player.position.x - this.position.x, 0, player.position.z - this.position.z);
        speed = dist > this.radius + 1.2 ? d.chaseSpeed : 0;
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
          if (!b.noHeal) this.stats.hp = this.stats.maxHp; // 둥지에 돌아오면 회복 (밤의 군주는 안 함)
          this.setState('idle');
        }
        break;
    }
    return { move, speed };
  }

  startCast(p) {
    const pp = this.ctx.player.position;
    this.cast = { p, target: new THREE.Vector3(pp.x, 0, pp.z), shots: 0 };
    this.setState('cast');
    PATTERNS[p.kind].start?.(this, p, this.cast);
  }

  updateCast() {
    const c = this.cast;
    const pat = PATTERNS[c.p.kind];
    const t = Math.min(1, this.stateTime / (this.windupOf(c) / this.cdSpeed));
    tmp.set(c.target.x - this.position.x, 0, c.target.z - this.position.z);
    if (tmp.lengthSq() > 1e-4) this.facing.copy(tmp.normalize());
    pat.during?.(this, c.p, c, t);
    if (t < 1) return;
    pat.fire(this, c.p, c);
    // 연속 패턴 (밤의 군주 그림자 창 3연속): 플레이어 자리를 다시 겨눠 짧게 한 번 더
    c.shots += 1;
    if (c.p.repeat && c.shots < c.p.repeat && this.ctx.player.alive) {
      const pp = this.ctx.player.position;
      c.target = new THREE.Vector3(pp.x, 0, pp.z);
      this.setState('cast');
      pat.start?.(this, c.p, c);
      return;
    }
    c.p.cd = c.p.cooldown;
    this.cast = null;
    this.setState('chase');
  }

  windupOf(c) {
    return c.shots > 0 && c.p.repeatWindup ? c.p.repeatWindup : c.p.windup;
  }

  animate(dt, speed) {
    super.animate(dt, speed);
    this.hpBar.group.visible = false; // 보스 체력은 화면 위 막대로
    if (this.state === 'cast') {
      const t = Math.min(1, this.stateTime / (this.windupOf(this.cast) / this.cdSpeed));
      this.body.scale.set(1 + t * 0.12, 1 - t * 0.2, 1 + t * 0.12); // 힘 모으기
    }
    this.body.position.y += this.jumpHeight;
  }

  // 페이즈 넘어가기: 분열·분노·패턴 추가(phases)
  checkPhase() {
    const b = this.bdef;
    const ratio = this.stats.hp / this.stats.maxHp;
    (b.phases ?? []).forEach((ph, i) => {
      this.phaseDone ??= new Set();
      if (this.phaseDone.has(i) || ratio > ph.at) return;
      this.phaseDone.add(i);
      ph.add.forEach((p, j) => this.patterns.push({ ...p, cd: 1 + j * 1.5 }));
      this.ctx.bus.emit('notify', { text: ph.text, kind: 'warn' });
      this.ctx.bus.emit('boss:phase', { boss: this, phase: i + 2 });
    });
    if (b.split && !this.part && !this.splitDone && ratio <= b.split.at) {
      this.splitDone = true;
      this.clearCast();
      this.setEngaged(false);
      this.alive = false; // 조각들이 이어받는다
      this.done = true;
      this.ctx.bus.emit('boss:split', { boss: this });
    }
    if (b.enrage && !this.enraged && ratio <= b.enrage.at) {
      this.enraged = true;
      this.cdSpeed = b.enrage.speed;
      this.mat.color.set(b.enrage.color);
      this.ctx.bus.emit('notify', { text: `${b.name}이(가) 분노했습니다!`, kind: 'warn' });
      this.ctx.bus.emit('boss:enraged', { boss: this });
    }
  }

  clearCast() {
    for (const p of this.patterns) for (const m of p.marks ?? []) m.visible = false;
    this.jumpHeight = 0;
    this.cast = null;
    if (this.state === 'cast') this.setState('chase');
  }

  takeDamage(amount, knockVec) {
    const died = super.takeDamage(amount, knockVec);
    if (died) {
      this.setEngaged(false);
      this.clearCast();
      return true;
    }
    this.checkPhase();
    // 부모는 맞으면 추적·도주로 바꾸지만 보스는 하던 일을 계속한다.
    if (this.alive && (this.state === 'idle' || this.state === 'wander' || this.state === 'flee')) this.setState('chase');
    return false;
  }

  // 습격으로 온 보스(밤의 군주)는 아침이 되면 물러간다
  retreat() {
    this.setEngaged(false);
    this.clearCast();
    this.alive = false;
    this.done = true;
  }

  dispose() {
    this.setEngaged(false);
    for (const m of this.sceneMarks) this.ctx.scene.remove(m);
    super.dispose();
  }
}
