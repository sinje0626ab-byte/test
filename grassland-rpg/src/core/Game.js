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
import { SaveSystem } from '../systems/SaveSystem.js';
import { BaseSystem } from '../systems/BaseSystem.js';
import { BuildSystem } from '../systems/BuildSystem.js';
import { TurretSystem } from '../systems/TurretSystem.js';
import { RaidSystem } from '../systems/RaidSystem.js';
import { StatsSystem } from '../systems/StatsSystem.js';
import { EquipmentSystem } from '../systems/EquipmentSystem.js';
import { SkillSystem } from '../systems/SkillSystem.js';
import { ExplorationSystem } from '../systems/ExplorationSystem.js';
import { InteractionSystem } from '../systems/InteractionSystem.js';
import { FacilitySystem } from '../systems/FacilitySystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { StorageSystem } from '../systems/StorageSystem.js';
import { HUD } from '../ui/HUD.js';
import { UIManager } from '../ui/UIManager.js';
import { Tooltip } from '../ui/Tooltip.js';
import { InventoryWindow } from '../ui/InventoryWindow.js';
import { BuildMenu } from '../ui/BuildMenu.js';
import { CharacterWindow } from '../ui/CharacterWindow.js';
import { SkillWindow } from '../ui/SkillWindow.js';
import { MapWindow } from '../ui/MapWindow.js';
import { TurretWindow } from '../ui/TurretWindow.js';
import { CraftWindow } from '../ui/CraftWindow.js';
import { StorageWindow } from '../ui/StorageWindow.js';
import { ShopWindow } from '../ui/ShopWindow.js';

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
    this.raycaster = new THREE.Raycaster();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const bus = new EventBus();
    this.time = new Time(data.config.time, bus);
    const ctx = {
      data,
      scene: new THREE.Scene(),
      bus,
      time: this.time,
      input: new Input(renderer.domElement),
      camera: this.camera.camera,
      mouseGround: null,
      monsters: [],
    };
    this.ctx = ctx;

    ctx.world = new World(ctx);
    this.systems = [new BaseSystem(ctx)]; // ctx.bases / ctx.structures 를 먼저 만든다
    ctx.player = new Player(ctx);
    this.systems.push(
      new CombatSystem(ctx),
      new MonsterSpawner(ctx),
      new LootSystem(ctx),
      new EconomySystem(ctx),
      new InventorySystem(ctx),
      new BuildSystem(ctx),
      new TurretSystem(ctx),
      new RaidSystem(ctx),
      new StatsSystem(ctx),
      new EquipmentSystem(ctx),
      new SkillSystem(ctx),
      new ExplorationSystem(ctx),
      new InteractionSystem(ctx),
      new FacilitySystem(ctx),
      new CraftingSystem(ctx),
      new StorageSystem(ctx),
    );
    this.save = new SaveSystem(ctx);
    this.systems.push(this.save);

    this.hud = new HUD(ctx, uiRoot);
    this.ui = new UIManager(ctx, uiRoot);
    this.tooltip = new Tooltip(uiRoot);
    new InventoryWindow(ctx, this.ui, this.tooltip);
    new BuildMenu(ctx, this.ui);
    new CharacterWindow(ctx, this.ui, this.tooltip);
    new SkillWindow(ctx, this.ui);
    new MapWindow(ctx, this.ui);
    new TurretWindow(ctx, this.ui);
    new CraftWindow(ctx, this.ui, this.tooltip);
    new StorageWindow(ctx, this.ui, this.tooltip);
    new ShopWindow(ctx, this.ui, this.tooltip);
    bus.on('player:teleport', () => this.camera.snapTo(ctx.player.position));

    // 창들이 첫 화면을 그릴 수 있게 현재 상태를 한 번 알린다. (불러오기가 있으면 다시 알린다)
    this.systems.find((s) => s instanceof StatsSystem).recalc();
    this.systems.find((s) => s instanceof EquipmentSystem).changed();
    this.systems.find((s) => s instanceof SkillSystem).changed();

    // 모든 시스템·창이 이벤트를 듣기 시작한 뒤에 불러와야 각자 자기 몫을 받는다.
    this.save.load();

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
    this.time.advance(dt);

    ctx.player.update(dt);
    for (const m of ctx.monsters) m.update(dt);
    for (const s of this.systems) s.update?.(dt);

    ctx.world.update(dt, ctx.player.position);
    this.camera.update(dt, ctx.player.position);
    this.hud.update(dt);
    this.ui.update(dt);
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
