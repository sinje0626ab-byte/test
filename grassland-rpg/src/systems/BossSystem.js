import * as THREE from 'three';
import { Boss } from '../entities/Boss.js';
import { ProjectilePool } from '../entities/Projectile.js';

const tmp = new THREE.Vector3();

// 보스 등장·재등장(날짜 기준), 둥지 장식, 보스 투사체(가시·얼음덩이)
export class BossSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.defs = ctx.data.bosses;
    this.status = {}; // bossId → { defeatedDay }
    this.active = new Map(); // bossId → Boss
    this.pool = new ProjectilePool(ctx.scene);
    this.gravity = ctx.data.config.turret.gravity;
    const { bus } = ctx;

    for (const def of Object.values(this.defs)) this.buildLair(def);

    bus.on('monster:killed', ({ type }) => {
      for (const [id, boss] of this.active) {
        if (boss.type !== type || boss.alive) continue;
        this.status[id] = { defeatedDay: ctx.time.day };
        this.active.delete(id);
        bus.emit('boss:defeated', { id, name: this.defs[id].name });
        bus.emit('notify', { text: `${this.defs[id].name} 처치! ${this.defs[id].respawnDays}일 뒤에 다시 나타납니다`, kind: 'gold' });
        this.emitStatus();
      }
    });
    bus.on('boss:volley', (e) => this.volley(e));
    bus.on('boss:boulder', (e) => this.boulder(e));
    bus.on('save:collect', (save) => { save.bosses = { ...this.status }; });
    bus.on('save:apply', (save) => { this.status = { ...(save.bosses ?? {}) }; });
    bus.on('save:loaded', () => this.emitStatus());
    bus.on('game:new', () => this.emitStatus());
  }

  // 둥지: 바위 고리와 뼈다귀 몇 개
  buildLair(def) {
    const g = new THREE.Group();
    const rock = new THREE.MeshStandardMaterial({ color: 0x8a8580, flatShading: true });
    const bone = new THREE.MeshStandardMaterial({ color: 0xf2ead8, flatShading: true });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 + (i % 3) * 0.25, 0), rock);
      m.position.set(Math.cos(a) * 9, 0.3, Math.sin(a) * 9);
      m.castShadow = true;
      g.add(m);
    }
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 5), bone);
      m.rotation.set(Math.PI / 2, i * 1.3, 0);
      m.position.set(Math.cos(i * 2.1) * 5, 0.1, Math.sin(i * 2.1) * 5);
      g.add(m);
    }
    g.position.set(def.lair[0], 0, def.lair[1]);
    this.ctx.scene.add(g);
  }

  isDefeated(id) {
    const s = this.status[id];
    return s && this.ctx.time.day - s.defeatedDay < this.defs[id].respawnDays;
  }

  emitStatus() {
    const list = Object.entries(this.defs).map(([id, d]) => ({ id, name: d.name, lair: d.lair, defeated: !!this.isDefeated(id) }));
    this.ctx.bus.emit('boss:status', { list });
  }

  volley({ origin, count, speed, damage, range }) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      tmp.set(Math.cos(a) * speed, 0, Math.sin(a) * speed);
      this.pool.acquire('bolt').fire(origin.clone().setY(1.2), tmp, damage, range / speed, { enemy: true });
    }
  }

  // 얼음덩이: 예고한 자리에 포물선으로 떨어진다.
  boulder({ from, target, speed, radius, damage, mark }) {
    const g = this.gravity;
    tmp.set(target.x - from.x, 0, target.z - from.z);
    const time = Math.max(0.6, tmp.length() / speed);
    const vel = tmp.divideScalar(time);
    vel.y = (0 - from.y + 0.5 * g * time * time) / time;
    const p = this.pool.acquire('ball');
    p.fire(from, vel, damage, time + 1, { gravity: g, splash: { radius } });
    p.mesh.scale.setScalar(2.2);
    p.mark = mark;
  }

  update(dt) {
    const { player, monsters, bus } = this.ctx;
    for (const [id, def] of Object.entries(this.defs)) {
      const lair = tmp.set(def.lair[0], 0, def.lair[1]);
      const dist = player.position.distanceTo(lair);
      const boss = this.active.get(id);
      if (!boss && !this.isDefeated(id) && dist < def.spawnRange) {
        const b = new Boss(this.ctx, id, def);
        this.active.set(id, b);
        monsters.push(b);
        bus.emit('notify', { text: `어딘가에서 ${def.name}의 기척이 느껴집니다…`, kind: 'warn' });
      } else if (boss && boss.alive && dist > def.despawnRange && !boss.engaged) {
        boss.done = true; // 멀리 가면 치운다 (다시 오면 새로 나타난다)
        boss.alive = false;
        this.active.delete(id);
      }
    }

    for (const p of this.pool.active()) {
      p.step(dt);
      if (p.splash) {
        if (p.position.y <= 0 || p.life <= 0) {
          bus.emit('boss:aoe', { position: p.position.clone().setY(0), radius: p.splash.radius, damage: p.damage });
          if (p.mark) p.mark.visible = false;
          p.mesh.scale.setScalar(1);
          p.release();
        }
        continue;
      }
      const dx = player.position.x - p.position.x;
      const dz = player.position.z - p.position.z;
      if (player.alive && dx * dx + dz * dz < (player.radius + 0.25) ** 2) {
        bus.emit('enemy:hit-player', { damage: p.damage, dir: p.velocity.clone().setY(0).normalize() });
        p.release();
      } else if (p.life <= 0) {
        p.release();
      }
    }
  }
}
