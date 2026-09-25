import * as THREE from 'three';
import { rand } from '../utils/random.js';
import { createNpcModel } from './NpcModel.js';

// 동물 주민: 집(anchor) 둘레를 천천히 거닌다. 말을 걸면 플레이어 쪽을 본다. 부엉이는 낮에 존다.
export class Npc {
  constructor(ctx, id, anchor) {
    this.ctx = ctx;
    this.id = id;
    this.kind = 'npc';
    this.def = ctx.data.npcs.npcs[id];
    this.cfg = ctx.data.npcs.config;
    this.anchor = anchor.clone();
    this.position = anchor.clone();
    this.radius = 0.5;
    this.target = null;
    this.pause = rand.range(1, 3);
    this.phase = rand.range(0, 6);
    this.talking = 0;
    const { group, eyes, body } = createNpcModel(this.def);
    this.mesh = group;
    this.eyes = eyes;
    this.body = body;
    this.blink = rand.range(2, 5);
    ctx.scene.add(group);
    this.mesh.position.copy(this.position);
  }

  get asleep() {
    return this.def.nightOwl && !this.ctx.time.isNight;
  }

  moveHome(anchor) {
    this.anchor.copy(anchor);
    this.position.copy(anchor);
    this.target = null;
  }

  update(dt) {
    this.talking = Math.max(0, this.talking - dt);
    this.phase += dt;
    const p = this.ctx.player;
    let moving = false;
    if (this.talking > 0) {
      const d = new THREE.Vector3(p.position.x - this.position.x, 0, p.position.z - this.position.z);
      this.mesh.rotation.y = Math.atan2(d.x, d.z);
    } else if (!this.asleep) {
      if (!this.target) {
        this.pause -= dt;
        if (this.pause <= 0) {
          const a = rand.range(0, Math.PI * 2);
          const r = rand.range(0.5, this.cfg.wanderRadius);
          this.target = this.anchor.clone().add(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
        }
      } else {
        const d = this.target.clone().sub(this.position).setY(0);
        if (d.length() < 0.2) {
          this.target = null;
          this.pause = rand.range(2, 5);
        } else {
          d.normalize();
          this.position.addScaledVector(d, this.cfg.speed * dt);
          this.ctx.world.resolveCollision(this.position, this.radius);
          this.mesh.rotation.y = Math.atan2(d.x, d.z);
          moving = true;
        }
      }
    }
    this.mesh.position.copy(this.position);
    // 통통 걷기 / 숨쉬기 / 눈 깜빡임 / 말할 때 끄덕 / 졸기(눈 감고 꾸벅)
    this.mesh.position.y = moving ? Math.abs(Math.sin(this.phase * 8)) * 0.08 : 0;
    const sleepy = this.asleep && this.talking <= 0;
    this.blink -= dt;
    if (this.blink < -0.12) this.blink = rand.range(2.5, 5.5);
    const closed = sleepy || this.blink < 0;
    for (const e of this.eyes) e.scale.y = closed ? 0.15 : 1.2;
    const breath = 1 + Math.sin(this.phase * 2.2) * 0.022;
    this.body.scale.set(2 - breath, breath, 2 - breath);
    this.body.rotation.x = sleepy ? 0.12 + Math.sin(this.phase * 1.5) * 0.06 : this.talking > 0 ? Math.max(0, Math.sin(this.phase * 9)) * 0.08 : 0;
    this.body.rotation.z = !moving && !sleepy && this.talking <= 0 ? Math.sin(this.phase * 0.7) * 0.04 : 0;
    this.mesh.rotation.x = 0;
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
  }
}
