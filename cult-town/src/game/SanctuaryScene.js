// 성소 실내. 공간 단계마다 지도가 넓어지고(302 → 303 → 3층 전체 → 2층·4층), 칸마다 방이 있다.
// 방 안에는 신도들이 앉아 있거나 돌아다닌다. 계단 칸으로 층을 오간다.
import Phaser from 'phaser';
import { SANCTUARY, CLOCK, ROOMS } from '../config.js';
import { SHOP_ITEMS } from '../data/shop.js';
import { CAST } from '../data/cast.js';
import { RESIDENTS } from '../data/residents.js';
import { ROOM_NAMES } from '../data/rooms.js';
import { activeCast, namedMembers } from '../sim/faith.js';
import { activeOfficers } from '../sim/officers.js';
import { SPACE_MAP_BY_ID, mapsForStep } from '../map/interiors.js';
import { registerPerson, LEADER_LOOK } from './people.js';
import { drawShape, board } from './signs.js';
import { Walker } from './walker.js';
import { lookOf } from './TownScene.js';
import { app } from '../app.js';

const T = 16;
const FURN = {   // 방 종류마다 놓는 가구 (실내 타일 번호, 방 왼쪽 위 기준 [dx, dy, 타일])
  worship: [[2, 1, 113], [6, 1, 392]],
  counsel: [[1, 1, 55], [2, 1, 97], [3, 1, 55], [6, 1, 16], [1, 6, 166], [2, 6, 167], [3, 6, 169]],
  study: [[1, 1, 344], [2, 1, 345], [1, 4, 0], [2, 4, 1], [3, 4, 2], [1, 7, 0], [2, 7, 1], [3, 7, 2], [6, 4, 0], [7, 4, 1], [8, 4, 2]],
  kitchen: [[1, 1, 324], [2, 1, 329], [3, 1, 331], [4, 1, 332], [5, 1, 330], [2, 5, 3], [3, 5, 4], [4, 5, 5], [2, 7, 3], [3, 7, 4], [4, 7, 5]],
  dorm: [[1, 1, 8], [2, 1, 9], [1, 3, 8], [2, 3, 9], [1, 5, 62], [2, 5, 63], [1, 7, 62], [2, 7, 63], [5, 1, 8], [6, 1, 9], [5, 3, 62], [6, 3, 63]],
  broadcast: [[1, 1, 392], [2, 1, 419], [4, 1, 112], [5, 1, 113], [3, 3, 371], [7, 1, 392]],
  office: [[1, 1, 112], [2, 1, 113], [4, 1, 324], [5, 1, 325], [6, 1, 129], [1, 4, 55]],
};
const SEAT_ROWS = { worship: 4, counsel: 2, study: 6, kitchen: 6, dorm: 4, broadcast: 3, office: 2 };

export class SanctuaryScene extends Phaser.Scene {
  constructor() { super('sanctuary'); }

  init(data) { this.entry = data?.entry ?? 'door'; }

  create() {
    const s = app.s;
    const floors = mapsForStep(s.space.step);
    if (!floors[app.floor]) app.floor = 3;
    this.def = SPACE_MAP_BY_ID[floors[app.floor]];
    const map = this.make.tilemap({ key: `sanct-${this.def.id}` });
    const ts = map.addTilesetImage('indoor', 'indoor', 16, 16, 0, 1);
    map.createLayer('ground', ts, 0, 0).setDepth(0);
    map.createLayer('walls', ts, 0, 0).setDepth(1).setTint(0xc8b8a0);
    this.grid = app.gridFor(this.def.id);
    const w = map.widthInPixels; const h = map.heightInPixels;
    this.wPx = w; this.hPx = h;

    const g = this.add.graphics().setDepth(2);
    // 창문 (위 벽, 4칸마다)
    for (let x = 3; x < this.def.w - 2; x += 4) {
      g.fillStyle(0x1d1b26, 1).fillRect(x * T + 1, 1 * T + 2, 14, 11);
      g.fillStyle(0x9cc8e8, 1).fillRect(x * T + 2, 1 * T + 3, 12, 9);
      g.fillStyle(0xe8f4ff, 1).fillRect(x * T + 3, 1 * T + 4, 4, 2);
    }
    for (const [dx, dy] of this.def.doors) {
      g.fillStyle(0x3a3346, 1).fillRect(dx * T, dy * T, T, T);
      g.fillStyle(0x6a6276, 1).fillRect(dx * T + 2, dy * T + 4, 12, 2).fillRect(dx * T + 2, dy * T + 9, 12, 2);
    }
    for (const st of this.def.stairs) {
      const ok = !!floors[st.to];
      board(this, st.x * T + 8, (st.y - 1) * T + 4, `${st.to}층${ok ? '' : ' (남의 층)'}`, ok ? 0x3a5a8a : 0x5a5a5a, { small: true, depth: 30 });
    }

    this.furniture = this.add.container(0, 0).setDepth(4);
    this.peopleLayer = this.add.container(0, 0).setDepth(50);
    this.wanderers = [];

    registerPerson(this, 'p:leader', LEADER_LOOK);
    const start = this.entry === 'door' && this.def.doors[0] ? [this.def.doors[0][0], this.def.doors[0][1] - 1]
      : this.def.stairs[0] ? [this.def.stairs[0].x, this.def.stairs[0].y - 1] : [2, 10];
    this.player = this.add.sprite(start[0] * T, start[1] * T - 4, 'p:leader', 9).setOrigin(0).setDepth(60);
    this.walker = new Walker(this, this.player, this.grid, 'p:leader', () => app.dpad);
    this.walker.dir = 'up';

    const cam = this.cameras.main;
    cam.setBounds(-T * 2, -T * 2, w + T * 4, h + T * 4);
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true, 0.2, 0.2);
    this.fitZoom();
    this.scale.on('resize', this.fitZoom, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.fitZoom, this));

    this.input.on('pointerdown', (ptr) => {
      if (app.modal > 0) return;
      const tx = Math.floor(ptr.worldX / T); const ty = Math.floor(ptr.worldY / T);
      const door = this.def.doors.find(([x, y]) => x === tx && y === ty);
      const stair = this.def.stairs.find((st) => st.x === tx && st.y === ty);
      if (door) this.walker.goTo([tx, ty - 1], () => app.leaveSanctuary());
      else if (stair) this.walker.goTo([tx, ty - 1], () => app.useStairs(stair.to));
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
  }

  roomRect(slot) { return this.def.rooms.find((r) => r.slot === slot); }

  // 산 소품·방 가구·(사람들) 다시 놓기
  refreshFurniture() {
    const s = app.s;
    this.furniture.removeAll(true);
    this.peopleLayer.removeAll(true);
    this.wanderers = [];
    const seatSpots = {};
    for (const r of this.def.rooms) {
      const room = s.rooms[r.slot];
      const label = room ? `${r.slot}호 ${ROOM_NAMES[room.type]}${room.level > 1 ? ` ${room.level}단계` : ''}${room.dark ? ' *' : ''}` : `${r.slot}호 (빈 칸)`;
      this.furniture.add(board(this, (r.x + r.w / 2) * T, 0.15 * T, label, room ? (room.dark ? 0x5a1e1a : 0x3a3346) : 0x6a6a6a, { small: true, depth: 30 }));
      seatSpots[r.slot] = [];
      if (r.slot === '302' || (room?.type === 'worship')) this.placeWorship(r, seatSpots[r.slot], r.slot === '302');
      else if (room) {
        for (const [dx, dy, tile] of FURN[room.type]) if (dx < r.w - 1 && dy < r.h) this.furniture.add(this.add.image((r.x + dx) * T, (r.y + dy) * T, 'indoorSheet', tile).setOrigin(0));
        for (let y = r.y + 3; y < r.y + r.h - 1 && seatSpots[r.slot].length < SEAT_ROWS[room.type] * 2; y += 2) for (let x = r.x + 2; x < r.x + r.w - 1; x += 3) seatSpots[r.slot].push([x, y]);
      } else {
        for (const [dx, dy] of [[2, 3], [5, 6], [8, 4]]) if (dx < r.w - 1) this.furniture.add(this.add.image((r.x + dx) * T, (r.y + dy) * T, 'indoorSheet', 237).setOrigin(0).setAlpha(0.6));
      }
    }
    if (!s.sanctuary.props.light) { this.dim?.destroy(); this.dim = this.add.rectangle(0, 0, this.wPx, this.hPx, 0x000020, 0.12).setOrigin(0).setDepth(80); }
    else { this.dim?.destroy(); this.dim = null; }
    this.placePeople(seatSpots);
  }

  placeWorship(r, seats, main) {
    const s = app.s;
    const props = s.sanctuary.props;
    if (main) {
      const f = this.def.furniture302;
      for (const [k, tile] of [['pulpit', 113], ['desk', 112], ['counsel', 55]]) this.furniture.add(this.add.image(f[k][0] * T, f[k][1] * T, 'indoorSheet', tile).setOrigin(0));
      if (props.banner) this.furniture.add(drawShape(this, 'shape.banner', (r.x + 4) * T, 1 * T, { width: 8 * T, text: s.leader.cultName }));
      if (props.kettle) this.furniture.add(drawShape(this, 'shape.kettle', f.desk[0] * T, (f.desk[1] - 1) * T + 6));
      if (props.board) this.furniture.add(this.add.image((r.x + 12) * T, 1 * T, 'indoorSheet', SHOP_ITEMS.board.sprite).setOrigin(0));
      if (props.speaker) this.furniture.add(this.add.image((r.x + 6) * T, 3 * T, 'indoorSheet', SHOP_ITEMS.speaker.sprite).setOrigin(0));
      if (props.light) { this.furniture.add(this.add.image((r.x + 15) * T, 4 * T, 'indoorSheet', 127).setOrigin(0)); this.furniture.add(this.add.image((r.x + 15) * T, 5 * T, 'indoorSheet', 154).setOrigin(0)); }
      const plants = [[r.x, 2], [r.x + 15, 10], [r.x, 10]];
      for (let p = 0; p < (props.plant ?? 0); p++) this.furniture.add(this.add.image(plants[p][0] * T, plants[p][1] * T, 'indoorSheet', SHOP_ITEMS.plant.sprite).setOrigin(0));
    }
    const tiles = [];
    for (let y = 6; y < 11; y++) for (let x = r.x + 2; x < r.x + r.w - 2; x++) if (x !== r.x + 8) tiles.push([x, y]);
    let i = 0;
    const chairs = main ? (props.chair ?? 0) * 2 : Math.round(ROOMS.worship.seats * (app.s.rooms[r.slot]?.level ?? 1));
    for (let c = 0; c < chairs && i < tiles.length; c++, i++) { this.furniture.add(this.add.image(tiles[i][0] * T, tiles[i][1] * T, 'indoorSheet', SHOP_ITEMS.chair.sprite).setOrigin(0)); seats.push(tiles[i]); }
    if (main) for (let c = 0; c < (props.cushion ?? 0) && i < tiles.length; c++, i++) { this.furniture.add(drawShape(this, SHOP_ITEMS.cushion.sprite, tiles[i][0] * T, tiles[i][1] * T)); seats.push(tiles[i]); }
    if (main) for (let c = 0; c < SANCTUARY.baseSeats && i < tiles.length; c++, i++) seats.push(tiles[i]);
  }

  // 방마다 신도들 (밤엔 예배 참석자 + 첫 신도, 낮엔 방 담당 간부와 신도 몇 명이 돌아다닌다)
  placePeople(seatSpots) {
    const s = app.s;
    const add = (key, look, x, y, wander) => {
      registerPerson(this, key, look);
      const sp = this.add.sprite(x * T, y * T - 4, key, 0).setOrigin(0);
      this.peopleLayer.add(sp);
      if (wander) this.wanderers.push({ sp, key, room: wander, next: 0 });
      return sp;
    };
    const night = s.mode === 'night';
    // 첫 신도·간부
    const castSpots = this.def.furniture302 ? [[this.def.furniture302.desk[0] - 1, 4], [this.def.furniture302.counsel[0] + 2, 5], [this.def.furniture302.pulpit[0] + 1, 11]] : [];
    if (this.def.floor === 3) {
      activeCast(s).forEach((id, k) => {
        const o = s.officers.find((x) => x.id === id && !x.left);
        const slot = o?.assign?.startsWith('room:') ? o.assign.slice(5) : null;
        const r = slot ? this.roomRect(slot) : null;
        if (o?.assign === 'street' && !night) return;
        const c = CAST.find((x) => x.id === id);
        if (r) add(`p:cast:${id}`, c.look, r.x + 2, r.y + 2, r);
        else if (night || s.phase >= 2) add(`p:cast:${id}`, c.look, castSpots[k][0], castSpots[k][1], null);
      });
    }
    // 예배에 온 사람 (302 자리)
    const main = this.roomRect('302');
    if (main && night && s.sanctuary.worshipDay === s.day) {
      const named = s.sanctuary.lastAttend;
      const total = Math.min(named.length + s.followers, 60);
      const seats = seatSpots['302'] ?? [];
      for (let k = 0; k < total; k++) {
        const spot = seats[k] ?? [main.x + 2 + (k % 13), 11];
        if (k < named.length) add(`p:${named[k]}`, lookOf(named[k]), spot[0], spot[1], null).setFrame(9);
        else add(`p:follower:${k % 8}`, followerLook(k), spot[0], spot[1], null).setFrame(9);
      }
    }
    // 다른 방: 신도들이 방에 따라 앉아 있거나 걷는다
    if (s.phase >= 2) {
      const members = namedMembers(s);
      let m = 0;
      for (const r of this.def.rooms) {
        const room = s.rooms[r.slot];
        if (!room || r.slot === '302') continue;
        const n = Math.min((seatSpots[r.slot] ?? []).length, 2 + room.level * 2, Math.ceil((members.length + s.followers) / 6));
        for (let k = 0; k < n; k++) {
          const spot = seatSpots[r.slot][k];
          const id = members[m++ % Math.max(1, members.length)];
          const walk = room.type === 'kitchen' || room.type === 'broadcast' || k % 3 === 2;
          if (id) add(`p:${id}`, lookOf(id), spot[0], spot[1], walk ? r : null).setFrame(walk ? 0 : 9);
          else add(`p:follower:${k % 8}`, followerLook(k), spot[0], spot[1], walk ? r : null);
        }
      }
    }
    void RESIDENTS;
  }

  update(time, delta) {
    const s = app.s;
    if (!s) return;
    const dt = Math.min(delta, 100) / 1000;
    const free = app.modal === 0;
    if (free && s.mode === 'day' && app.speed > 0) app.advance(dt * CLOCK.minutesPerSecond * app.speed);
    this.walker.update(dt, free);
    this.player.setDepth(60);
    // 돌아다니는 신도
    for (const w of this.wanderers) {
      if (time > w.next) {
        w.next = time + 1500 + Math.random() * 2500;
        const tx = (w.room.x + 1 + Math.floor(Math.random() * (w.room.w - 2))) * T;
        const ty = (w.room.y + 2 + Math.floor(Math.random() * (w.room.h - 3))) * T - 4;
        const dir = Math.abs(tx - w.sp.x) > Math.abs(ty - w.sp.y) ? (tx > w.sp.x ? 'right' : 'left') : ty > w.sp.y ? 'down' : 'up';
        w.sp.play(`${w.key}-walk-${dir}`, true);
        this.tweens.add({ targets: w.sp, x: tx, y: ty, duration: Math.hypot(tx - w.sp.x, ty - w.sp.y) * 30 + 10, onComplete: () => { w.sp.anims.stop(); w.sp.setFrame(0); } });
      }
    }
    const [tx, ty] = this.walker.tile;
    let near = null;
    if (this.def.doors.some(([x, y]) => Math.abs(tx - x) <= 1 && ty >= y - 1)) near = { kind: 'exit' };
    const st = this.def.stairs.find((x) => Math.abs(tx - x.x) <= 1 && ty >= x.y - 1);
    if (st) near = { kind: 'stairs', to: st.to };
    const key = near ? near.kind + (near.to ?? '') : null;
    if (key !== this.nearKey) { this.nearKey = key; app.setNearAction(near); }
    this.hudTimer += delta;
    if (this.hudTimer > 200) { this.hudTimer = 0; app.hud?.update(); }
  }
}

const FOLLOWER_TOPS = ['#7a8a9a', '#9a7a6a', '#6a8a6a', '#8a6a8a', '#a89a5a', '#5a7a9a'];
function followerLook(k) {
  const base = RESIDENTS[(k * 7) % RESIDENTS.length].look;
  return { ...base, hairColor: ['#3a3030', '#5a4a3a', '#2a2a2a'][k % 3], top: FOLLOWER_TOPS[k % FOLLOWER_TOPS.length] };
}
