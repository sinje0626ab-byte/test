import * as THREE from 'three';
import { EventBus } from './EventBus.js';
import { Input } from './Input.js';
import { Time } from './Time.js';
import { Camera } from './Camera.js';
import { World } from '../world/World.js';
import { Player } from '../entities/Player.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { MonsterSpawner } from '../systems/MonsterSpawner.js';
import { LootSystem } from '../systems/LootSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { HUD } from '../ui/HUD.js';

// 메인 루프. 모든 엔티티·시스템이 공유하는 ctx를 만들고 매 프레임 update → render.
export class Game {
  constructor({ container, uiRoot, data }) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.camera = new Camera(data.config.camera, window.innerWidth / window.innerHeight);
    this.time = new Time(data.config.time);
    this.raycaster = new THREE.Raycaster();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const ctx = {
      data,
      scene: new THREE.Scene(),
      bus: new EventBus(),
      input: new Input(renderer.domElement),
      camera: this.camera.camera,
      mouseGround: null,
      monsters: [],
    };
    this.ctx = ctx;

    ctx.world = new World(ctx);
    ctx.player = new Player(ctx);
    this.systems = [
      new CombatSystem(ctx),
      new MonsterSpawner(ctx),
      new LootSystem(ctx),
      new EconomySystem(ctx),
      new InventorySystem(ctx),
    ];
    this.hud = new HUD(ctx, uiRoot);

    this.camera.snapTo(ctx.player.position);
    window.addEventListener('resize', () => this.resize());
    this.loop = this.loop.bind(this);
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  loop(now) {
    const dt = this.time.tick(now);
    this.update(dt);
    this.renderer.render(this.ctx.scene, this.ctx.camera);
    requestAnimationFrame(this.loop);
  }

  update(dt) {
    const ctx = this.ctx;
    this.updateMouseGround();

    ctx.player.update(dt);
    for (const m of ctx.monsters) m.update(dt);
    for (const s of this.systems) s.update?.(dt);

    ctx.world.update(dt, ctx.player.position);
    this.camera.update(dt, ctx.player.position);
    this.hud.update(dt);
    ctx.input.endFrame();
  }

  // 마우스가 가리키는 지면 좌표 (공격 방향용)
  updateMouseGround() {
    const { input } = this.ctx;
    if (!input.hasMouse) return;
    this.raycaster.setFromCamera(input.mouseNdc, this.ctx.camera);
    const hit = new THREE.Vector3();
    this.ctx.mouseGround = this.raycaster.ray.intersectPlane(this.groundPlane, hit) ? hit : null;
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.resize(window.innerWidth / window.innerHeight);
  }
}
