import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8 });

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
      moveSpeed: b.moveSpeed, critChance: b.critChance,
    };
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

    this.buildMesh();
    this.syncMesh(0);
  }

  buildMesh() {
    const g = new THREE.Group();
    this.bodyMats = [];
    const addMat = (m) => (this.bodyMats.push(m), m);

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.35, 3, 8), addMat(flat('#5b8def')));
    body.position.y = 0.55;
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), addMat(flat('#ffd9b8')));
    head.position.y = 1.18;
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), addMat(flat('#7a4b2a')));
    hair.position.y = 1.22;
    hair.rotation.x = -0.25;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), addMat(flat('#63c96b')));
    leaf.position.set(0.05, 1.6, 0);
    leaf.rotation.z = -0.5;
    const eyeMat = flat('#2b2b33');
    const eyeGeo = new THREE.SphereGeometry(0.045, 6, 4);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 1.18, 0.3);
    eyeR.position.set(0.12, 1.18, 0.3);
    const footGeo = new THREE.BoxGeometry(0.16, 0.12, 0.24);
    const footMat = addMat(flat('#6b4a36'));
    this.footL = new THREE.Mesh(footGeo, footMat);
    this.footR = new THREE.Mesh(footGeo, footMat);
    this.footL.position.set(-0.13, 0.06, 0);
    this.footR.position.set(0.13, 0.06, 0);

    // 칼은 몸 중심의 피벗에 달려서 좌우로 휘두른다.
    this.swordPivot = new THREE.Group();
    this.swordPivot.position.y = 0.7;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.9), flat('#e8eef5'));
    blade.position.set(0.42, 0, 0.55);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.06), flat('#c9a44a'));
    guard.position.set(0.42, 0, 0.1);
    this.swordPivot.add(blade, guard);
    this.swordPivot.rotation.y = 0.9;

    const inner = new THREE.Group();
    inner.add(body, head, hair, leaf, eyeL, eyeR, this.footL, this.footR, this.swordPivot);
    inner.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    g.add(inner);
    this.inner = inner;

    // 휘두를 때 잠깐 보이는 궤적
    const arc = THREE.MathUtils.degToRad(this.base.attackArcDeg);
    const trailGeo = new THREE.RingGeometry(0.5, this.base.attackRange, 20, 1, -arc / 2, arc);
    trailGeo.rotateX(-Math.PI / 2);
    trailGeo.rotateY(-Math.PI / 2);
    this.trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
    }));
    this.trail.position.y = 0.45;
    g.add(this.trail);

    this.mesh = g;
    this.ctx.scene.add(g);
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
    s.hp = Math.min(s.maxHp, s.hp + b.hpRegen * dt);

    this.updateAttack(dt);
    this.syncMesh(dt);
  }

  updateAttack(dt) {
    const b = this.base;
    const s = this.stats;
    const input = this.ctx.input;

    if (input.mouseDown && this.attackTimer <= 0 && s.stamina >= b.attackStaminaCost) {
      // 클릭한 순간 마우스 쪽으로 몸을 돌려 벤다.
      const aim = this.ctx.mouseGround;
      if (aim) {
        const d = new THREE.Vector3(aim.x - this.position.x, 0, aim.z - this.position.z);
        if (d.lengthSq() > 0.01) this.facing.copy(d.normalize());
      }
      this.swingDir.copy(this.facing);
      this.swingTime = 0;
      this.hitDone = false;
      this.attackTimer = b.attackCooldown;
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
        arc: THREE.MathUtils.degToRad(b.attackArcDeg),
        attack: s.attack,
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
    // 기지가 생기면(Phase 3) 가장 가까운 기지로 바꾼다.
    this.position.copy(this.ctx.world.spawnPoint);
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
    if (this.swingTime >= 0) {
      const t = Math.min(1, this.swingTime / b.attackDuration);
      const ease = 1 - Math.pow(1 - t, 3);
      this.swordPivot.rotation.y = THREE.MathUtils.lerp(1.4, -1.6, ease);
      this.trail.material.opacity = 0.45 * (1 - t);
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
