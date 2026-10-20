// 성소 실내 (상가 3층 한 칸). 낮엔 빈 방, 밤엔 첫 신도들과 예배 온 사람들. 소품은 산 만큼 놓인다.
import Phaser from 'phaser';
import { SANCTUARY as ROOM } from '../map/layout.js';
import { SANCTUARY, CLOCK } from '../config.js';
import { SHOP_ITEMS } from '../data/shop.js';
import { CAST } from '../data/cast.js';
import { RESIDENTS } from '../data/residents.js';
import { activeCast } from '../sim/faith.js';
import { registerPerson, LEADER_LOOK } from './people.js';
import { drawShape } from './signs.js';
import { Walker } from './walker.js';
import { lookOf } from './TownScene.js';
import { app } from '../app.js';

const T = 16;

// 자리 배치: 의자 → 방석 → 바닥 순서로 앞줄부터
function seatTiles() {
  const out = [];
  const a = ROOM.seatArea;
  for (let y = a.y; y < a.y + a.h; y++) for (let x = a.x; x < a.x + a.w; x++) if (x !== 9) out.push([x, y]);
  return out;
}

export class SanctuaryScene extends Phaser.Scene {
  constructor() { super('sanctuary'); }

  create() {
    const map = this.make.tilemap({ key: 'sanct' });
    const ts = map.addTilesetImage('indoor', 'indoor', 16, 16, 0, 1);
    map.createLayer('ground', ts, 0, 0).setDepth(0);
    map.createLayer('walls', ts, 0, 0).setDepth(1).setTint(0xc8b8a0);
    const w = map.widthInPixels; const h = map.heightInPixels;

    // 창문 (도형)
    const g = this.add.graphics().setDepth(2);
    for (const [x, y] of ROOM.window) {
      g.fillStyle(0x1d1b26, 1).fillRect(x * T + 1, y * T + 2, 14, 11);
      g.fillStyle(0x9cc8e8, 1).fillRect(x * T + 2, y * T + 3, 12, 9);
      g.fillStyle(0xe8f4ff, 1).fillRect(x * T + 3, y * T + 4, 4, 2);
    }
    // 문 (계단)
    g.fillStyle(0x3a3346, 1).fillRect(ROOM.door[0] * T, ROOM.door[1] * T, T, T);
    g.fillStyle(0x6a6276, 1).fillRect(ROOM.door[0] * T + 2, ROOM.door[1] * T + 4, 12, 2).fillRect(ROOM.door[0] * T + 2, ROOM.door[1] * T + 9, 12, 2);

    // 고정 가구
    this.add.image(ROOM.pulpit[0] * T, ROOM.pulpit[1] * T, 'indoorSheet', 113).setOrigin(0).setDepth(3);
    this.add.image(ROOM.desk[0] * T, ROOM.desk[1] * T, 'indoorSheet', 112).setOrigin(0).setDepth(3);
    this.add.image(ROOM.counsel[0] * T, ROOM.counsel[1] * T, 'indoorSheet', 55).setOrigin(0).setDepth(3);
    this.add.image((ROOM.counsel[0] + 1) * T, ROOM.counsel[1] * T, 'indoorSheet', 97).setOrigin(0).setDepth(3);
    this.add.text(ROOM.counsel[0] * T + 8, (ROOM.counsel[1] - 0.2) * T, '상담', { fontFamily: 'Galmuri11', fontSize: '11px', color: '#4a4658' }).setOrigin(0.5, 1).setDepth(3);

    this.furniture = this.add.container(0, 0).setDepth(4);
    this.peopleLayer = this.add.container(0, 0).setDepth(50);

    registerPerson(this, 'p:leader', LEADER_LOOK);
    this.player = this.add.sprite(ROOM.door[0] * T, (ROOM.door[1] - 1) * T - 4, 'p:leader', 9).setOrigin(0).setDepth(60);
    this.walker = new Walker(this, this.player, app.sg, 'p:leader');
    this.walker.dir = 'up';

    const cam = this.cameras.main;
    cam.setBounds(-T * 2, -T * 2, w + T * 4, h + T * 4);
    cam.centerOn(w / 2, h / 2);
    cam.setRoundPixels(true);
    this.fitZoom();
    this.scale.on('resize', this.fitZoom, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.fitZoom, this));

    this.input.on('pointerdown', (ptr) => {
      if (app.modal > 0) return;
      const tx = Math.floor(ptr.worldX / T); const ty = Math.floor(ptr.worldY / T);
      if (tx === ROOM.door[0] && ty === ROOM.door[1]) this.walker.goTo([tx, ty - 1], () => app.leaveSanctuary());
      else this.walker.goTo([tx, ty]);
    });
    const kb = this.input.keyboard;
    kb.on('keydown-SPACE', () => app.actionKey());
    kb.on('keydown-ENTER', () => app.actionKey());
    this.refreshFurniture();
    this.hudTimer = 0;
  }

  fitZoom() {
    const { width, height } = this.scale;
    const z = Math.max(2, Math.min(5, Math.floor(Math.min(width / (T * 20), (height - 140) / (T * 13)))));
    this.cameras.main.setZoom(z);
    this.cameras.main.centerOn((ROOM.w * T) / 2, (ROOM.h * T) / 2 + 8);
  }

  // 산 소품과 (밤이면) 사람들을 다시 놓는다
  refreshFurniture() {
    const s = app.s;
    this.furniture.removeAll(true);
    this.peopleLayer.removeAll(true);
    const props = s.sanctuary.props;
    const tiles = seatTiles();
    const seatSpots = [];
    let i = 0;
    for (let c = 0; c < (props.chair ?? 0) * 2; c++, i++) {
      const [x, y] = tiles[i];
      this.furniture.add(this.add.image(x * T, y * T, 'indoorSheet', SHOP_ITEMS.chair.sprite).setOrigin(0));
      seatSpots.push([x, y]);
    }
    for (let c = 0; c < (props.cushion ?? 0); c++, i++) {
      const [x, y] = tiles[i];
      this.furniture.add(drawShape(this, SHOP_ITEMS.cushion.sprite, x * T, y * T));
      seatSpots.push([x, y]);
    }
    for (let c = 0; c < SANCTUARY.baseSeats; c++, i++) seatSpots.push(tiles[i]);   // 장판 바닥 자리
    if (props.banner) this.furniture.add(drawShape(this, 'shape.banner', 5 * T, 1 * T, { width: 8 * T, text: s.leader.cultName }));
    if (props.kettle) this.furniture.add(drawShape(this, 'shape.kettle', ROOM.desk[0] * T, (ROOM.desk[1] - 1) * T + 6));
    if (props.board) this.furniture.add(this.add.image(13 * T, 1 * T, 'indoorSheet', SHOP_ITEMS.board.sprite).setOrigin(0));
    if (props.speaker) this.furniture.add(this.add.image(7 * T, 3 * T, 'indoorSheet', SHOP_ITEMS.speaker.sprite).setOrigin(0));
    if (props.light) {
      this.furniture.add(this.add.image(16 * T, 4 * T, 'indoorSheet', 127).setOrigin(0));
      this.furniture.add(this.add.image(16 * T, 5 * T, 'indoorSheet', 154).setOrigin(0));
    }
    const plantSpots = [[1, 2], [16, 10], [1, 10]];
    for (let p = 0; p < (props.plant ?? 0); p++) this.furniture.add(this.add.image(plantSpots[p][0] * T, plantSpots[p][1] * T, 'indoorSheet', SHOP_ITEMS.plant.sprite).setOrigin(0));
    if (!props.light) {   // 깜빡이는 형광등 (어두운 방)
      this.dim?.destroy();
      this.dim = this.add.rectangle(0, 0, ROOM.w * T, ROOM.h * T, 0x000020, 0.12).setOrigin(0).setDepth(80);
    } else { this.dim?.destroy(); this.dim = null; }

    if (s.mode !== 'night') return;
    // 첫 신도들
    const castSpots = [[14, 4], [4, 5], [10, 11]];
    activeCast(s).forEach((id, k) => {
      const c = CAST.find((x) => x.id === id);
      registerPerson(this, `p:cast:${id}`, c.look);
      this.peopleLayer.add(this.add.sprite(castSpots[k][0] * T, castSpots[k][1] * T - 4, `p:cast:${id}`, 0).setOrigin(0));
    });
    // 오늘 예배에 온 사람들 (+ 따라온 사람들)
    if (s.sanctuary.worshipDay === s.day) {
      const named = s.sanctuary.lastAttend;
      const total = named.length + s.followers;
      for (let k = 0; k < total; k++) {
        const spot = seatSpots[k] ?? [3 + (k % 12), 11];
        let key;
        if (k < named.length) { key = `p:${named[k]}`; registerPerson(this, key, lookOf(named[k])); }
        else { const r = RESIDENTS[(k * 7) % RESIDENTS.length]; key = `p:follower:${k % 8}`; registerPerson(this, key, { ...r.look, hairColor: '#3a3030', top: ['#7a8a9a', '#9a7a6a', '#6a8a6a', '#8a6a8a'][k % 4] }); }
        this.peopleLayer.add(this.add.sprite(spot[0] * T, spot[1] * T - 4, key, 9).setOrigin(0));
      }
    }
  }

  update(time, delta) {
    const s = app.s;
    if (!s) return;
    const dt = Math.min(delta, 100) / 1000;
    const free = app.modal === 0;
    if (free && s.mode === 'day' && app.speed > 0) app.advance(dt * CLOCK.minutesPerSecond * app.speed);
    this.walker.update(dt, free);
    this.player.setDepth(60);
    const [tx, ty] = this.walker.tile;
    const nearDoor = Math.abs(tx - ROOM.door[0]) <= 1 && ty >= ROOM.door[1] - 1;
    const key = nearDoor ? 'door' : null;
    if (key !== this.nearKey) { this.nearKey = key; app.setNearAction(nearDoor ? { kind: 'exit' } : null); }
    this.hudTimer += delta;
    if (this.hudTimer > 200) { this.hudTimer = 0; app.hud?.update(); }
  }
}
