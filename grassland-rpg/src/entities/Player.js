import * as THREE from 'three';
import { nearestBase } from '../utils/bases.js';
import { createPlayerModel } from './PlayerModel.js';

// 플레이어: 이동·달리기·근접 공격·피격·사망/부활.
export class Player {
  constructor(ctx) {
    this.ctx = ctx;
    this.base = ctx.data.player;
    const b = this.base;
    this.stats = {
      maxHp: b.hp, hp: b.hp,
      maxStamina: b.stamina, stamina: b.stamina,
      attack: b.attack, defense: b.defense,
      moveSpeed: b.moveSpeed, critChance: b.critChance, hpRegen: b.hpRegen,
      attackSpeed: 0, spin: 0,
    }; // StatsSystem이 레벨·장비·스킬을 더해 다시 채운다
    this.radius = b.radius;
    this.position = ctx.world.spawnPoint.clone();
    this.facing = new THREE.Vector3(0, 0, 1);
    this.velocity = new THREE.Vector3();
    this.knock = new THREE.Vector3();
    this.alive = true;

    this.attackTimer = 0;
    this.swingTime = -1;
    this.swingDir = new THREE.Vector3(0, 0, 1);
    this.hitDone = true;
    this.staminaDelay = 0;
    this.invuln = 0;
    this.deathTimer = 0;
    this.walkPhase = 0;
    this.flash = 0;
    this.attackCount = 0;
    this.spinning = false;

    const model = createPlayerModel(b);
    Object.assign(this, model);
    this.mesh = model.group;
    ctx.scene.add(this.mesh);
    this.syncMesh(0);

    // 무기를 바꾸면 칼날 색도 바뀐다.
    ctx.bus.on('equipment:changed', ({ slots }) => {
      const w = slots.weapon && ctx.data.items.items[slots.weapon];
      this.blade.material.color.set(w ? w.color : '#e8eef5');
    });
    ctx.bus.on('player:teleport', ({ position }) => {
      this.position.copy(position);
      this.knock.set(0, 0, 0);
      this.swingTime = -1;
    });
    ctx.bus.on('save:collect', (save) => this.collectSave(save));
    ctx.bus.on('save:apply', (save) => this.applySave(save.player));
    // 장비·스킬까지 반영된 최대치가 정해진 뒤에 HP를 맞춘다.
    ctx.bus.on('save:loaded', () => {
      if (!this.loadedVitals) return;
      const s = this.stats;
      s.hp = Math.max(1, Math.min(s.maxHp, this.loadedVitals.hp));
      s.stamina = Math.min(s.maxStamina, this.loadedVitals.stamina);
      this.loadedVitals = null;
    });
  }

  // 쓰러져 있는 중에 저장되면 부활한 상태로 저장한다.
  collectSave(save) {
    const s = this.stats;
    const pos = this.alive ? this.position : this.ctx.world.spawnPoint;
    save.player = {
      position: [pos.x, pos.z],
      hp: this.alive ? s.hp : s.maxHp,
      stamina: this.alive ? s.stamina : s.maxStamina,
    };
  }

  applySave(p) {
    if (!p) return;
    this.position.set(p.position[0], 0, p.position[1]);
    this.ctx.world.resolveCollision(this.position, this.radius);
    this.loadedVitals = { hp: p.hp, stamina: p.stamina };
  }

  update(dt) {
    const b = this.base;
    const s = this.stats;
    const input = this.ctx.input;

    this.flash = Math.max(0, this.flash - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.attackTimer = Math.max(0, this.attackTimer - dt);

    if (!this.alive) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) this.respawn();
      this.syncMesh(dt);
      return;
    }

    // 이동 입력 (카메라가 -z를 보고 있으므로 W = -z)
    const dir = new THREE.Vector3(
      (input.isDown('KeyD') ? 1 : 0) - (input.isDown('KeyA') ? 1 : 0),
      0,
      (input.isDown('KeyS') ? 1 : 0) - (input.isDown('KeyW') ? 1 : 0),
    );
    const moving = dir.lengthSq() > 0;
    if (moving) dir.normalize();

    let speed = s.moveSpeed;
    const wantsRun = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
    if (moving && wantsRun && s.stamina > 0) {
      speed *= b.runMultiplier;
      s.stamina = Math.max(0, s.stamina - b.staminaRunCost * dt);
      this.staminaDelay = b.staminaRegenDelay;
    }
    if (this.swingTime >= 0) speed *= b.attackMoveMultiplier;

    this.velocity.copy(dir).multiplyScalar(speed);
    this.position.addScaledVector(this.velocity, dt);
    this.position.addScaledVector(this.knock, dt);
    this.knock.multiplyScalar(Math.exp(-10 * dt));
    this.ctx.world.resolveCollision(this.position, this.radius);

    if (moving && this.swingTime < 0) this.facing.copy(dir);
    if (moving) this.walkPhase += dt * speed * 2.2;

    // 스태미나·HP 재생
    this.staminaDelay -= dt;
    if (this.staminaDelay <= 0) s.stamina = Math.min(s.maxStamina, s.stamina + b.staminaRegen * dt);
    s.hp = Math.min(s.maxHp, s.hp + s.hpRegen * dt);

    this.updateAttack(dt);
    this.syncMesh(dt);
  }

  updateAttack(dt) {
    const b = this.base;
    const s = this.stats;
    const input = this.ctx.input;

    if (this.ctx.mode === 'play' && input.mouseDown && this.attackTimer <= 0 && s.stamina >= b.attackStaminaCost) {
      // 클릭한 순간 마우스 쪽으로 몸을 돌려 벤다.
      const aim = this.ctx.mouseGround;
      if (aim) {
        const d = new THREE.Vector3(aim.x - this.position.x, 0, aim.z - this.position.z);
        if (d.lengthSq() > 0.01) this.facing.copy(d.normalize());
      }
      this.swingDir.copy(this.facing);
      this.swingTime = 0;
      this.hitDone = false;
      this.attackCount += 1;
      // 회전 공격 스킬: N번째 공격마다 한 바퀴
      this.spinning = s.spin > 0 && this.attackCount % b.spinEvery === 0;
      this.attackTimer = b.attackCooldown * Math.max(0.3, 1 - s.attackSpeed);
      s.stamina -= b.attackStaminaCost;
      this.staminaDelay = b.staminaRegenDelay;
    }

    if (this.swingTime < 0) return;
    this.swingTime += dt;
    if (!this.hitDone && this.swingTime >= b.attackHitTime) {
      this.hitDone = true;
      this.ctx.bus.emit('player:attack', {
        origin: this.position.clone(),
        dir: this.swingDir.clone(),
        range: b.attackRange,
        arc: this.spinning ? Math.PI * 2 : THREE.MathUtils.degToRad(b.attackArcDeg),
        attack: this.spinning ? s.attack * (1 + b.spinDamagePerRank * s.spin) : s.attack,
        critChance: s.critChance,
        critMultiplier: b.critMultiplier,
        knockback: b.knockback,
      });
    }
    if (this.swingTime >= b.attackDuration) this.swingTime = -1;
  }

  takeDamage(amount, knockDir) {
    if (!this.alive || this.invuln > 0) return false;
    const s = this.stats;
    s.hp = Math.max(0, s.hp - amount);
    this.invuln = this.base.invulnTime;
    this.flash = 0.18;
    if (knockDir) this.knock.copy(knockDir).multiplyScalar(this.base.knockback);
    this.ctx.bus.emit('player:damaged', { amount, hp: s.hp });
    if (s.hp <= 0) this.die();
    return true;
  }

  die() {
    this.alive = false;
    this.swingTime = -1;
    this.deathTimer = this.base.respawnDelay;
    this.ctx.bus.emit('player:died', { position: this.position.clone() });
  }

  respawn() {
    const s = this.stats;
    this.alive = true;
    s.hp = s.maxHp;
    s.stamina = s.maxStamina;
    this.knock.set(0, 0, 0);
    this.invuln = this.base.invulnTime * 2;
    // 가장 가까운 기지 텐트 앞, 기지가 없으면 시작 지점
    const base = nearestBase(this.ctx.bases, this.position);
    if (base) this.position.set(base.position.x, 0, base.position.z + base.tent.radius + 1.2);
    else this.position.copy(this.ctx.world.spawnPoint);
    this.ctx.bus.emit('player:respawned', { position: this.position.clone() });
  }

  syncMesh(dt) {
    const m = this.mesh;
    m.position.copy(this.position);

    const target = Math.atan2(this.facing.x, this.facing.z);
    let diff = target - m.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    m.rotation.y += diff * Math.min(1, dt * 18);

    const moving = this.velocity.lengthSq() > 0.01;
    const bob = moving ? Math.abs(Math.sin(this.walkPhase)) * 0.08 : 0;
    this.inner.position.y = bob;
    this.footL.position.z = moving ? Math.sin(this.walkPhase) * 0.14 : 0;
    this.footR.position.z = moving ? -Math.sin(this.walkPhase) * 0.14 : 0;

    // 칼 휘두르기: 오른쪽 → 왼쪽
    const b = this.base;
    this.inner.rotation.y = 0;
    this.spinTrail.material.opacity = 0;
    if (this.swingTime >= 0) {
      const t = Math.min(1, this.swingTime / b.attackDuration);
      const ease = 1 - Math.pow(1 - t, 3);
      this.swordPivot.rotation.y = THREE.MathUtils.lerp(1.4, -1.6, ease);
      if (this.spinning) {
        this.inner.rotation.y = -ease * Math.PI * 2;
        this.spinTrail.material.opacity = 0.45 * (1 - t);
        this.trail.material.opacity = 0;
      } else {
        this.trail.material.opacity = 0.45 * (1 - t);
      }
    } else {
      this.swordPivot.rotation.y += (0.9 - this.swordPivot.rotation.y) * Math.min(1, dt * 10);
      this.trail.material.opacity = 0;
    }

    // 쓰러짐 / 무적 깜빡임 / 피격 번쩍임
    this.inner.rotation.x = this.alive ? 0 : Math.min(Math.PI / 2, this.inner.rotation.x + dt * 6);
    m.visible = this.alive && this.invuln > 0 ? Math.floor(this.invuln * 20) % 2 === 0 : true;
    const e = this.flash > 0 ? 0.8 : 0;
    for (const mat of this.bodyMats) mat.emissive.setRGB(e, e * 0.3, e * 0.3);
  }
}
