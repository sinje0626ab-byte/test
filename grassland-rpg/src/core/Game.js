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
import { BossSystem } from '../systems/BossSystem.js';
import { GatherSystem } from '../systems/GatherSystem.js';
import { ArrowSystem } from '../systems/ArrowSystem.js';
import { StatusSystem } from '../systems/StatusSystem.js';
import { EnemyShotSystem } from '../systems/EnemyShotSystem.js';
import { BuffSystem } from '../systems/BuffSystem.js';
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
import { TouchControls } from '../ui/TouchControls.js';
import { TitleScreen } from '../ui/TitleScreen.js';
import { SettingsPanel } from '../ui/SettingsPanel.js';
import { Settings } from './Settings.js';
import { Synth } from './Synth.js';
import { FeedbackSystem } from '../systems/FeedbackSystem.js';
import { SoundSystem } from '../systems/SoundSystem.js';
import { MusicSystem } from '../systems/MusicSystem.js';
import { PauseMenu } from '../ui/PauseMenu.js';

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
      timeScale: 1,
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
      new BossSystem(ctx),
      new GatherSystem(ctx),
      new ArrowSystem(ctx),
      new StatusSystem(ctx),
      new EnemyShotSystem(ctx),
      new BuffSystem(ctx),
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
    this.touch = new TouchControls(ctx, uiRoot);

    // 연출·소리·설정 (게임 로직과 따로)
    this.settings = new Settings(bus);
    this.settingsPanel = new SettingsPanel(this.settings);
    this.synth = new Synth();
    this.feedback = new FeedbackSystem(ctx, this.camera);
    this.sound = new SoundSystem(ctx, this.synth);
    this.music = new MusicSystem(ctx, this.synth);
    bus.on('settings:changed', ({ key, value }) => { if (key === 'shadows') this.applyShadows(value); });
    this.settings.broadcast();
    bus.on('player:teleport', () => this.camera.snapTo(ctx.player.position));

    // 창들이 첫 화면을 그릴 수 있게 현재 상태를 한 번 알린다. (불러오기가 있으면 다시 알린다)
    this.systems.find((s) => s instanceof StatsSystem).recalc();
    this.systems.find((s) => s instanceof EquipmentSystem).changed();
    this.systems.find((s) => s instanceof SkillSystem).changed();

    // 타이틀에서 "이어하기"/"새 게임"을 고를 때까지 기다린다. 그동안은 저장하지 않는다.
    ctx.state = 'title';
    this.save.disabled = true;
    this.titleAngle = 0;
    this.pause = new PauseMenu(ctx, this);
    this.title = new TitleScreen(ctx, this);

    this.camera.snapTo(ctx.player.position);
    window.addEventListener('resize', () => this.resize());
    this.loop = this.loop.bind(this);
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  // 이어하기: 저장을 불러온다. 모든 시스템·창이 이벤트를 듣기 시작한 뒤라 각자 자기 몫을 받는다.
  continueGame() {
    this.save.disabled = false;
    if (!this.save.load()) this.ctx.bus.emit('game:new');
    this.beginPlay();
  }

  newGame() {
    this.save.clear();
    this.save.disabled = false;
    this.ctx.bus.emit('game:new');
    this.beginPlay();
    this.save.save();
  }

  beginPlay() {
    this.ctx.state = 'play';
    document.body.classList.remove('on-title');
    this.camera.snapTo(this.ctx.player.position);
  }

  loop(now) {
    const dt = this.time.tick(now);
    this.update(dt);
    this.renderer.render(this.ctx.scene, this.ctx.camera);
    requestAnimationFrame(this.loop);
  }

  // 그림자 품질: off / low / high
  applyShadows(q) {
    const r = this.renderer;
    const on = q !== 'off';
    const size = q === 'low' ? 1024 : 2048;
    const sun = this.ctx.world.sun;
    if (sun.shadow.mapSize.x !== size) {
      sun.shadow.mapSize.set(size, size);
      sun.shadow.map?.dispose();
      sun.shadow.map = null;
    }
    if (r.shadowMap.enabled !== on) {
      r.shadowMap.enabled = on;
      this.ctx.scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
    }
  }

  update(realDt) {
    const ctx = this.ctx;
    this.music.update();
    this.sound.update();
    this.camera.updateShake(realDt);
    // 히트스톱: 게임 시간만 느려지고 파티클·흔들림은 실제 시간
    const dt = ctx.state === 'play' ? realDt * this.feedback.tick(realDt) : realDt;
    if (ctx.state === 'title') {
      // 타이틀 뒤 배경: 시작 지점 둘레를 천천히 돈다
      this.titleAngle += dt * 0.06;
      this.camera.orbit(ctx.player.position, this.titleAngle);
      ctx.player.syncMesh(dt);
      ctx.world.update(dt, ctx.player.position);
      ctx.input.endFrame();
      return;
    }
    if (ctx.state === 'paused') {
      ctx.input.endFrame();
      return;
    }
    this.updateMouseGround();
    this.time.advance(dt);

    ctx.player.update(dt);
    // 멀리 있는 몬스터는 멈춰 둔다 (습격 몬스터는 기지를 공격해야 하니 예외)
    const active = ctx.data.config.world.activeRadius;
    for (const m of ctx.monsters) {
      if (m.raid || m.state === 'dead' || m.position.distanceTo(ctx.player.position) < active) m.update(dt);
    }
    for (const s of this.systems) s.update?.(dt);

    ctx.world.update(dt, ctx.player.position);
    this.camera.update(dt, ctx.player.position);
    this.hud.update(dt);
    this.ui.update(dt);
    this.touch.update();
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
