import * as THREE from 'three';
import { nearestBase, baseAt } from '../utils/bases.js';
import { createPlayerModel, applyAppearance, DEFAULT_BLADE } from './PlayerModel.js';
import { PlayerRoll } from './PlayerRoll.js';
import { PlayerDash } from './PlayerDash.js';
import { PlayerAttack } from './PlayerAttack.js';

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
    this.speedMult = 1; // 감속 (StatusSystem)
    this.auraRegen = 0; // 모닥불 둘레 (FacilitySystem)

    this.attackTimer = 0;
    this.staminaDelay = 0;
    this.invuln = 0;
    this.deathTimer = 0;
    this.walkPhase = 0;
    this.flash = 0;

    this.roll = new PlayerRoll(this);
    this.dash = new PlayerDash(this);
    this.runTick = 0;
    const model = createPlayerModel(b);
    Object.assign(this, model);
    this.mesh = model.group;
    ctx.scene.add(this.mesh);
    this.attack = new PlayerAttack(this);
    this.syncMesh(0);

    // 무기 종류·색, 모자·옷·신발 색이 장비를 따라간다.
    // 캐릭터 만들기에서 고른 이름·머리색·옷색·머리 장식
    this.appearance = { ...ctx.data.config.character.default };
    this.worn = {};
    ctx.bus.on('equipment:changed', ({ slots, plus }) => {
      const items = ctx.data.items.items;
      const w = slots.weapon && items[slots.weapon];
      this.attack.setWeapon(w?.weaponType ?? 'sword', w ? w.color : DEFAULT_BLADE, w ? slots.weapon : 'default', plus?.weapon ?? 0);
      this.worn = { head: items[slots.head], body: items[slots.body], feet: items[slots.feet] };
      applyAppearance(this, this.worn, this.appearance);
    });
    ctx.bus.on('player:appearance', ({ appearance }) => this.setAppearance(appearance));
    ctx.bus.on('game:new', () => this.setAppearance(ctx.data.config.character.default));
    ctx.bus.on('player:aura', ({ hpRegen }) => { this.auraRegen = hpRegen; });
    ctx.bus.on('player:heal', ({ amount }) => {
      if (!this.alive) return;
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    });
    // 소모품 효과
    ctx.bus.on('item:use', (e) => {
      const baseHeal = ctx.data.items.items[e.item]?.use?.heal;
      const heal = baseHeal && baseHeal * (1 + (this.stats.healPct ?? 0)); // 약초꾼
      const s = this.stats;
      if (!heal || !this.alive || s.hp >= s.maxHp) return;
      const amount = Math.min(heal, s.maxHp - s.hp);
      s.hp += amount;
      e.used = true;
      ctx.bus.emit('combat:hit', { position: this.position.clone(), amount: `+${Math.round(amount)}`, crit: false, target: 'heal' });
    });
    ctx.bus.on('player:teleport', ({ position }) => {
      this.position.copy(position);
      this.knock.set(0, 0, 0);
      this.attack.cancel();
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

  setAppearance(a) {
    this.appearance = { ...this.ctx.data.config.character.default, ...a };
    applyAppearance(this, this.worn, this.appearance);
    this.ctx.bus.emit('player:named', { name: this.appearance.name });
  }

  // 쓰러져 있는 중에 저장되면 부활한 상태로 저장한다.
  collectSave(save) {
    const s = this.stats;
    const pos = this.alive ? this.position : this.ctx.world.spawnPoint;
    save.player = {
      position: [pos.x, pos.z],
      hp: this.alive ? s.hp : s.maxHp,
      stamina: this.alive ? s.stamina : s.maxStamina,
      appearance: { ...this.appearance },
    };
  }

  applySave(p) {
    if (!p) return;
    this.position.set(p.position[0], 0, p.position[1]);
    this.ctx.world.resolveCollision(this.position, this.radius);
    this.loadedVitals = { hp: p.hp, stamina: p.stamina };
    this.setAppearance(p.appearance ?? {});
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
    // 키보드 WASD 또는 터치 조이스틱 (조이스틱은 민 만큼 빠르다)
    const mv = input.moveVector();
    const dir = new THREE.Vector3(mv.x, 0, mv.z);
    const moving = mv.amount > 0;
    if (moving) dir.normalize();

    if (this.dash.update(dt) || this.roll.update(dt, input, dir)) {
      this.regen(dt);
      this.syncMesh(dt);
      return;
    }

    let speed = s.moveSpeed * this.speedMult * (moving ? Math.max(0.35, mv.amount) : 1);
    const wantsRun = input.isDown('ShiftLeft') || input.isDown('ShiftRight')
      || (mv.stick && mv.amount >= this.ctx.data.config.touch.runThreshold);
    if (moving && wantsRun && s.stamina > 0) {
      speed *= b.runMultiplier;
      this.runTick += 1;
      if (this.runTick % 4 === 0) this.ctx.bus.emit('player:running', { position: this.position });
      s.stamina = Math.max(0, s.stamina - b.staminaRunCost * dt);
      this.staminaDelay = b.staminaRegenDelay;
    }
    if (this.attack.swinging) speed *= b.attackMoveMultiplier;

    this.velocity.copy(dir).multiplyScalar(speed);
    this.position.addScaledVector(this.velocity, dt);
    this.position.addScaledVector(this.knock, dt);
    this.knock.multiplyScalar(Math.exp(-10 * dt));
    this.ctx.world.resolveCollision(this.position, this.radius);

    if (moving && !this.attack.swinging) this.facing.copy(dir);
    if (moving) this.walkPhase += dt * speed * 2.2;

    this.regen(dt);
    this.attack.update(dt);
    this.syncMesh(dt);
  }

  // 스태미나·HP 재생
  regen(dt) {
    const b = this.base;
    const s = this.stats;
    this.staminaDelay -= dt;
    if (this.staminaDelay <= 0) s.stamina = Math.min(s.maxStamina, s.stamina + b.staminaRegen * (1 + (s.staminaRegenPct ?? 0)) * dt);
    // 고목의 씨앗: 기지 안에서 HP재생 배율
    const inBase = s.baseRegenMult && baseAt(this.ctx.bases, this.position);
    s.hp = Math.min(s.maxHp, s.hp + (s.hpRegen * (inBase ? 1 + s.baseRegenMult : 1) + this.auraRegen) * dt);
  }

  // 돌진 베기 (ActiveSkillSystem)
  startDash(dir, def, hit) {
    return this.alive && this.dash.start(dir, def, hit);
  }

  // 터치 자동 조준: 가까운 적, 없으면 가까운 채집 노드 (range를 주면 적만 그 거리까지)
  nearestEnemy(range) {
    const pick = (list, range) => {
      let best = null;
      let bestD = range;
      for (const m of list) {
        if (!m.alive || m.untargetable) continue;
        const d = m.position.distanceTo(this.position) - m.radius;
        if (d < bestD) { bestD = d; best = m; }
      }
      return best;
    };
    const { config } = this.ctx.data;
    if (range) return pick(this.ctx.monsters, range);
    return pick(this.ctx.monsters, config.touch.autoAimRange) ?? pick(this.ctx.nodes ?? [], config.gather.autoAimRange);
  }

  takeDamage(amount, knockDir) {
    if (!this.alive || this.invuln > 0 || this.roll.invulnerable || this.dash.active) return false;
    const s = this.stats;
    // 받는 피해 감소 (설원 세트 등)
    const dmg = Math.max(1, Math.round(amount * (1 + (s.damageTaken ?? 0))));
    s.hp = Math.max(0, s.hp - dmg);
    this.invuln = this.base.invulnTime;
    this.flash = 0.18;
    if (knockDir) this.knock.copy(knockDir).multiplyScalar(this.base.knockback);
    this.ctx.bus.emit('player:damaged', { amount: dmg, hp: s.hp });
    if (s.hp <= 0) this.die();
    return true;
  }

  // 독 같은 지속 피해: 무적 시간·넉백 없이 깎는다. 깎였으면 true
  applyDot(amount) {
    if (!this.alive) return false;
    const s = this.stats;
    s.hp = Math.max(0, s.hp - amount);
    if (s.hp <= 0) this.die();
    return true;
  }

  die() {
    this.alive = false;
    this.dash.time = -1;
    this.attack.cancel();
    this.deathTimer = this.base.respawnDelay;
    this.ctx.bus.emit('player:died', { position: this.position.clone() });
  }

  respawn() {
    const s = this.stats;
    this.alive = true;
    this.speedMult = 1;
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
    if (!this.roll.active) this.inner.position.y = bob;
    this.footL.position.z = moving ? Math.sin(this.walkPhase) * 0.14 : 0;
    this.footR.position.z = moving ? -Math.sin(this.walkPhase) * 0.14 : 0;
    this.armL.group.rotation.x = moving ? -Math.sin(this.walkPhase) * 0.6 : 0;

    this.attack.animate(dt);

    // 쓰러짐 / 무적 깜빡임 / 피격 번쩍임
    if (!this.roll.active) this.inner.rotation.x = this.alive ? 0 : Math.min(Math.PI / 2, this.inner.rotation.x + dt * 6);
    m.visible = this.alive && this.invuln > 0 ? Math.floor(this.invuln * 20) % 2 === 0 : true;
    const e = this.flash > 0 ? 0.8 : 0;
    for (const mat of this.bodyMats) mat.emissive.setRGB(e, e * 0.3, e * 0.3);
  }
}
