import * as THREE from 'three';
import { Particles } from '../entities/Particles.js';

// 타격 연출만 담당 (히트스톱·화면 흔들림·파티클·레벨업 빛기둥). 게임 로직은 건드리지 않는다.
export class FeedbackSystem {
  constructor(ctx, camera) {
    this.ctx = ctx;
    this.camera = camera;
    this.cfg = ctx.data.config.feedback;
    this.particles = new Particles(ctx.scene, this.cfg.particles.max);
    this.hitstop = 0;
    this.shakeOn = true;
    this.dustTimer = 0;
    this.pillars = [];
    const { bus } = ctx;
    const P = this.cfg.particles;
    const H = this.cfg.hitstop;
    const S = this.cfg.shake;

    bus.on('settings:changed', ({ key, value }) => { if (key === 'shake') this.shakeOn = value; });

    bus.on('combat:hit', (e) => {
      if (e.target === 'monster') {
        this.particles.burst(e.position.clone().setY(0.6), { color: e.color ?? '#ffffff', count: P.hit, speed: 3.2, up: 3, life: 0.45 });
        if (e.source === 'player') this.stop(e.crit ? H.crit : H.hit);
        if (e.crit) this.shake(S.crit);
      } else if (e.target === 'player') {
        this.shake(S.playerHit);
        this.particles.burst(e.position.clone().setY(0.8), { color: ['#ff7b7b', '#ffffff'], count: 5, speed: 2.5, up: 2.5, life: 0.4 });
      } else if (e.target === 'structure') {
        this.particles.burst(e.position.clone().setY(1), { color: ['#c9a06a', '#8a6440'], count: 4, speed: 2.5, up: 3, life: 0.5 });
      }
    });
    bus.on('monster:killed', (e) => {
      const pos = e.position.clone().setY(0.5);
      const big = (e.radius ?? 0.6) > 1;
      this.particles.burst(pos, { color: e.color ?? '#ffffff', count: P.kill * (big ? 2 : 1), speed: big ? 6 : 4, up: 4.5, life: 0.7, size: big ? 0.16 : 0.1 });
      this.particles.burst(pos, { color: '#ffffff', count: big ? 8 : 4, speed: 1.2, up: 1.2, gravity: -1, life: 0.6, size: 0.18, grow: true, drag: 3 });
      if (e.boss) this.stop(H.bossKill);
    });
    bus.on('stats:levelup', () => this.levelUp());
    bus.on('turret:fired', (e) => {
      this.particles.burst(e.muzzle, { color: ['#fff3a6', '#ffcf5c'], count: P.muzzle, speed: 2, up: 1, gravity: 0, life: 0.15, size: 0.08, drag: 6 });
    });
    bus.on('projectile:explode', (e) => {
      const d = e.position.distanceTo(ctx.player.position);
      this.shake(S.cannon * Math.max(0, 1 - d / S.cannonFalloff));
      this.particles.burst(e.position.clone().setY(0.3), { color: ['#ffb35c', '#ff7b3d', '#5a5147'], count: P.blast, speed: 5, up: 5, life: 0.6, size: 0.12 });
    });
    bus.on('boss:aoe', (e) => {
      this.shake(S.bossAoe);
      this.particles.burst(e.position.clone().setY(0.2), { color: ['#d9c6a0', '#ffffff'], count: P.blast, speed: e.radius * 1.5, up: 3, life: 0.6, size: 0.14 });
    });
    bus.on('player:roll', ({ position }) => this.dust(position, 6));
    bus.on('player:running', ({ position }) => {
      this.dustTimer -= 1;
      if (this.dustTimer <= 0) { this.dust(position, 2); this.dustTimer = 3; }
    });
  }

  // 발밑 먼지: 그 지역 땅 색
  dust(position, count) {
    const reg = this.ctx.world.regionAt(position.x, position.z);
    this.particles.burst(position.clone().setY(0.1), { color: reg.ground[1], count, speed: 1.2, up: 1.2, gravity: 2, life: 0.5, size: 0.1, grow: true, drag: 3 });
  }

  stop(sec) {
    this.hitstop = Math.max(this.hitstop, sec);
  }

  shake(strength) {
    if (this.shakeOn && strength > 0) this.camera.shake(strength, this.cfg.shake.duration);
  }

  levelUp() {
    const p = this.ctx.player.position;
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 7, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffd966, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }),
    );
    mesh.position.set(p.x, 3.5, p.z);
    this.ctx.scene.add(mesh);
    this.pillars.push({ mesh, t: 0 });
    this.particles.burst(p.clone().setY(1), { color: ['#ffd966', '#fff3a6', '#ffffff'], count: this.cfg.particles.levelup, speed: 2.5, up: 7, gravity: 4, life: 1.1, size: 0.1 });
  }

  // 실제 시간으로 돌고, 이번 프레임의 게임 시간 배율을 돌려준다.
  tick(dt) {
    let scale = 1;
    if (this.hitstop > 0) {
      this.hitstop -= dt;
      scale = this.cfg.hitstop.scale;
    }
    this.ctx.timeScale = scale;
    this.particles.update(dt);
    for (const pl of this.pillars) {
      pl.t += dt;
      pl.mesh.material.opacity = 0.55 * Math.max(0, 1 - pl.t / 1.2);
      pl.mesh.scale.set(1 + pl.t * 0.5, 1, 1 + pl.t * 0.5);
      if (pl.t > 1.2) this.ctx.scene.remove(pl.mesh);
    }
    this.pillars = this.pillars.filter((pl) => pl.t <= 1.2);
    return scale;
  }
}
