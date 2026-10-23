// 성소 실내. 공간 단계마다 지도가 넓어지고(302 → 303 → 3층 전체 → 2층·4층), 칸마다 방이 있다.
// 방 안에는 신도들이 앉아 있거나 돌아다닌다. 계단 칸으로 층을 오간다.
import Phaser from 'phaser';
import { SANCTUARY, CLOCK, ROOMS } from '../config.js';
import { SHOP_ITEMS } from '../data/shop.js';
import { ROOM_NAMES } from '../data/rooms.js';
import { activeCast, namedMembers } from '../sim/faith.js';
import { activeOfficers } from '../sim/officers.js';
import { SPACE_MAP_BY_ID, mapsForStep } from '../map/interiors.js';
import { registerPerson, idleFrame, sitFrame, HEAD_LIFT, PERSON_ORIGIN_Y } from './people.js';
import { drawShape, board } from './signs.js';
import { Walker } from './walker.js';
import { app } from '../app.js';
import { fill } from '../ui/text.js';
import { speechBubble, emotionBubble } from './overlays.js';
import { play } from '../ui/sound.js';

const T = 16;
// 방 종류마다 놓는 가구 (LimeZu 실내 아틀라스 'lzIn' 프레임 이름, 방 왼쪽 위 기준 [dx, dy(물건 아래 칸), 이름])
const FURN = {
  worship: [[2, 2, 'pulpit'], [6, 3, 'speaker']],
  counsel: [[1, 2, 'counsel'], [4, 2, 'table'], [7, 2, 'counsel'], [9, 3, 'plant'], [1, 7, 'counsel0'], [3, 7, 'counsel0']],
  study: [[1, 3, 'shelf'], [4, 3, 'shelf'], [8, 2, 'board'], [2, 6, 'studydesk'], [5, 6, 'studydesk'], [8, 6, 'studydesk'], [2, 9, 'studydesk'], [5, 9, 'studydesk']],
  kitchen: [[1, 3, 'fridge'], [2, 2, 'stove'], [3, 1, 'sink'], [6, 2, 'kettle'], [2, 5, 'dtable'], [3, 5, 'dtable'], [2, 4, 'dchair'], [3, 4, 'dchair'], [2, 8, 'dtable'], [3, 8, 'dtable']],
  dorm: [[1, 2, 'futon'], [4, 2, 'futon2'], [7, 2, 'futon'], [1, 6, 'futon2'], [4, 6, 'futon'], [7, 6, 'futon2']],
  broadcast: [[1, 2, 'camera'], [4, 3, 'softbox'], [6, 2, 'monitor'], [3, 5, 'mic'], [8, 2, 'speaker']],
  office: [[1, 2, 'deskpc'], [2, 2, 'desk'], [4, 3, 'counter'], [7, 2, 'locker'], [1, 5, 'counsel0']],
};
// 꾸밈 단계 (화면만): 소품 수 + 간판 단계 + 공간 단계×2 → 0 초라한 상가 방(시멘트·회색 벽) · 1 장판 · 2 마루 · 3 꾸민 예배실
export function decoLevel(s) {
  const owned = Object.values(s.sanctuary.props ?? {}).filter(Boolean).length;
  const score = owned + (s.sanctuary.sign ?? 0) + (s.space?.step ?? 0) * 2;
  return score >= 9 ? 3 : score >= 6 ? 2 : score >= 3 ? 1 : 0;
}
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
    const ts = map.addTilesetImage('indoor', 'lzIn', 16, 16, 0, 0);
    this.groundLayer = map.createLayer('ground', ts, 0, 0).setDepth(0);
    this.wallLayer = map.createLayer('walls', ts, 0, 0).setDepth(1);
    this.deco = 0;    // 지도는 0단계 타일로 뽑혀 있다. refreshFurniture 가 꾸밈 단계에 맞춰 바꿔 끼운다
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
    // 302호 문 안내문 (간판 단계에 따라 A4 종이 → 인쇄 안내판)
    const d0 = this.def.doors[0];
    if (d0 && this.def.floor === 3) {
      const tier = app.s.sanctuary.sign ?? 0;
      const text = tier >= 2 ? `수·일 저녁 ${'{예배}'}` : '신발 벗고 들어오세요';
      // 27장: 문 옆 벽(아래 벽 줄)에 붙인다. 바닥 칸에 걸치지 않아서 사람과 겹치지 않는다
      const t = fill(text, app.s); const tw = this.add.text(0, 0, t, { fontFamily: 'Galmuri7', fontSize: '8px' }); const half = tw.width / 2 + 3; tw.destroy();
      board(this, (d0[0] + 1) * T + 3 + half, d0[1] * T + 3, t, tier >= 2 ? 0x5b3a7a : 0xe8e4d8, { small: true, depth: 3, fg: tier >= 2 ? 0xffffff : 0x1d1b26 });
    }
    for (const st of this.def.stairs) {
      const ok = !!floors[st.to];
      board(this, st.x * T + 8, (st.y - 1) * T + 4, `${st.to}층${ok ? '' : ' (남의 층)'}`, ok ? 0x3a5a8a : 0x5a5a5a, { small: true, depth: 30 });
    }

    this.furniture = this.add.container(0, 0).setDepth(4);
    this.peopleLayer = this.add.container(0, 0).setDepth(50);
    this.wanderers = [];

    registerPerson(this, 'p:leader');
    const start = this.entry === 'door' && this.def.doors[0] ? [this.def.doors[0][0], this.def.doors[0][1] - 1]
      : this.def.stairs[0] ? [this.def.stairs[0].x, this.def.stairs[0].y - 1] : [2, 10];
    this.player = this.add.sprite(start[0] * T, start[1] * T - 4, 'p:leader', idleFrame('up')).setOrigin(0, PERSON_ORIGIN_Y).setDepth(60);
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
  // 실내 아틀라스 물건 하나: (tx, ty) 칸 아래에 바닥을 맞춘다 (키 큰 물건은 위 칸으로 올라간다)
  put(name, tx, ty) { return this.add.image(tx * T, (ty + 1) * T, 'lzIn', name).setOrigin(0, 1); }

  // 꾸밈 단계에 맞춰 바닥·벽 타일 바꾸기
  applyDeco() {
    const next = decoLevel(app.s);
    const tiles = this.cache.json.get('lzInMeta')?.tiles;
    if (!tiles || next === this.deco) return;
    const swap = (layer, from, to) => layer.replaceByIndex(tiles[from] + 1, tiles[to] + 1);
    swap(this.groundLayer, `floor${this.deco}`, `floor${next}`);
    swap(this.wallLayer, `wall${this.deco}a`, `wall${next}a`);
    swap(this.wallLayer, `wall${this.deco}b`, `wall${next}b`);
    this.deco = next;
  }

  // 산 소품·방 가구·(사람들) 다시 놓기
  refreshFurniture() {
    const s = app.s;
    this.applyDeco();
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
        for (const [dx, dy, name] of FURN[room.type]) if (dx < r.w - 1 && dy < r.h) this.furniture.add(this.put(name, r.x + dx, r.y + dy));
        for (let y = r.y + 3; y < r.y + r.h - 1 && seatSpots[r.slot].length < SEAT_ROWS[room.type] * 2; y += 2) for (let x = r.x + 2; x < r.x + r.w - 1; x += 3) seatSpots[r.slot].push([x, y]);
      } else {
        // 빈 칸: 전 세입자가 두고 간 고장 난 가구
        for (const [dx, dy, name] of [[2, 4, 'junk'], [6, 7, 'junk2'], [8, 4, 'junk2']]) if (dx < r.w - 1) this.furniture.add(this.put(name, r.x + dx, r.y + dy).setAlpha(0.8));
      }
    }
    if (!s.sanctuary.props.light) { this.dim?.destroy(); this.dim = this.add.rectangle(0, 0, this.wPx, this.hPx, 0x000020, 0.12).setOrigin(0).setDepth(80); }
    else { this.dim?.destroy(); this.dim = null; }
    this.seats302 = seatSpots['302'] ?? [];
    this.placePeople(seatSpots);
  }

  placeWorship(r, seats, main) {
    const s = app.s;
    const props = s.sanctuary.props;
    if (main) {
      const f = this.def.furniture302;
      const look = { pulpit: this.deco >= 2 ? 'pulpit' : 'pulpit0', desk: 'deskpc', counsel: this.deco >= 1 ? 'counsel' : 'counsel0' };
      for (const k of ['pulpit', 'desk', 'counsel']) this.furniture.add(this.put(look[k], f[k][0], f[k][1]));
      // 처음부터 있던 살림 (27장): 형광등은 LED 로 바꾸기 전까지 깜빡인다
      for (const [name, x, y] of this.def.base302 ?? []) {
        const im = this.put(name, x, y);
        this.furniture.add(im);
        if (name === 'tube' && !props.light) this.tweens.add({ targets: im, alpha: { from: 1, to: 0.35 }, duration: 90, yoyo: true, repeat: -1, repeatDelay: 1800 + x * 137 });
      }
      // 3단계: 벽에 걸린 천 현수막
      if (this.deco >= 3) for (const dx of [2, 13]) this.furniture.add(this.put(dx < 8 ? 'bannerRed' : 'bannerBlue', r.x + dx, 1));
      if (props.banner) this.furniture.add(drawShape(this, 'shape.banner', (r.x + 4) * T, 1 * T, { width: 8 * T, text: s.leader.cultName }));
      if (props.kettle) this.furniture.add(this.put(SHOP_ITEMS.kettle.sprite, f.desk[0] + 1, f.desk[1]));
      if (props.board) this.furniture.add(this.put(SHOP_ITEMS.board.sprite, r.x + 11, 3));
      if (props.speaker) this.furniture.add(this.put(SHOP_ITEMS.speaker.sprite, r.x + 6, 3));
      if (props.light) this.furniture.add(this.put(SHOP_ITEMS.light.sprite, r.x + 15, 5));
      const plants = [[r.x, 2], [r.x + 15, 10], [r.x, 10]];
      for (let p = 0; p < (props.plant ?? 0); p++) this.furniture.add(this.put(SHOP_ITEMS.plant.sprite, plants[p][0], plants[p][1]));
    }
    const tiles = [];
    for (let y = 6; y < 11; y++) for (let x = r.x + 2; x < r.x + r.w - 2; x++) if (x !== r.x + 8) tiles.push([x, y]);
    let i = 0;
    const chairs = main ? (props.chair ?? 0) * 2 : Math.round(ROOMS.worship.seats * (app.s.rooms[r.slot]?.level ?? 1));
    for (let c = 0; c < chairs && i < tiles.length; c++, i++) { this.furniture.add(this.put(SHOP_ITEMS.chair.sprite, tiles[i][0], tiles[i][1])); seats.push(tiles[i]); }
    if (main) for (let c = 0; c < (props.cushion ?? 0) && i < tiles.length; c++, i++) { this.furniture.add(this.put(this.deco >= 2 ? 'zaisu' : SHOP_ITEMS.cushion.sprite, tiles[i][0], tiles[i][1])); seats.push(tiles[i]); }
    if (main) for (let c = 0; c < SANCTUARY.baseSeats && i < tiles.length; c++, i++) seats.push(tiles[i]);
  }

  // 방마다 신도들 (밤엔 예배 참석자 + 첫 신도, 낮엔 방 담당 간부와 신도 몇 명이 돌아다닌다)
  placePeople(seatSpots) {
    const s = app.s;
    const add = (key, x, y, wander) => {
      registerPerson(this, key);
      const sp = this.add.sprite(x * T, y * T - 4, key, idleFrame('down')).setOrigin(0, PERSON_ORIGIN_Y);
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
        if (r) add(`p:cast:${id}`, r.x + 2, r.y + 2, r);
        else if (night || s.phase >= 2) add(`p:cast:${id}`, castSpots[k][0], castSpots[k][1], null);
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
        if (k < named.length) add(`p:${named[k]}`, spot[0], spot[1], null).setFrame(idleFrame('up'));
        else add(`p:follower:${k % 8}`, spot[0], spot[1], null).setFrame(idleFrame('up'));
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
          if (id) add(`p:${id}`, spot[0], spot[1], walk ? r : null).setFrame(walk ? idleFrame('down') : sitFrame(k % 2 ? 'left' : 'right'));
          else add(`p:follower:${k % 8}`, spot[0], spot[1], walk ? r : null);
        }
      }
    }
  }

  // ── 25장 C: 성소에서 하는 예배 ──
  // 앉히기: 이름 있는 참석자 → 첫 신도 → 따라온 사람 순으로 의자에. 교주는 단상 앞
  liveWorship(named, cast, followers) {
    this.peopleLayer.removeAll(true);
    this.wanderers = [];
    this.bubbles?.forEach((b) => b.destroy());
    this.bubbles = [];
    const main = this.roomRect('302');
    const seats = this.seats302;
    const list = [...named.map((id) => ({ kind: 'res', id })), ...cast.map((id) => ({ kind: 'cast', id })), ...Array.from({ length: Math.min(followers, 40) }, (_, k) => ({ kind: 'follower', id: `f${k}`, k }))];
    this.audience = list.map((a, k) => {
      const spot = seats[k] ?? [main.x + 2 + (k % 13), 11];
      const key = a.kind === 'res' ? `p:${a.id}` : a.kind === 'cast' ? `p:cast:${a.id}` : `p:follower:${a.k % 8}`;
      registerPerson(this, key);
      const sp = this.add.sprite(spot[0] * T, spot[1] * T - 4, key, idleFrame('up')).setOrigin(0, PERSON_ORIGIN_Y);
      this.peopleLayer.add(sp);
      return { ...a, sp };
    });
    const f = this.def.furniture302;
    if (f) { this.walker.stop(); this.player.setPosition(f.pulpit[0] * T, (f.pulpit[1] + 1) * T - 4); this.walker.dir = 'down'; this.walker.idle(); }
    // 단상과 앉은 사람이 다 보이게: 둘 사이 가운데를 보고, 아래 카드 줄만큼 화면 위쪽으로 올린다
    const cam = this.cameras.main;
    cam.stopFollow();
    const pts = [[this.player.x, this.player.y], ...this.audience.slice(0, 16).map((a) => [a.sp.x, a.sp.y])];
    const xs = pts.map((p) => p[0]); const ys = pts.map((p) => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2 + 8;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2 + 8;
    cam.pan(cx, cy + (this.scale.height * 0.2) / cam.zoom, 400, 'Sine.easeInOut');
    return this.audience;
  }
  // 앉은 사람 머리 위 말풍선 (몇 초 뒤 사라진다)
  sayAt(sp, text, delay = 0, lift = 0) {
    this.time.delayedCall(delay, () => {
      const c = speechBubble(this, text).setDepth(5080 + lift);
      c.setPosition(sp.x + 8, sp.y - 2 - HEAD_LIFT - lift);
      this.bubbles.push(c);
      this.tweens.add({ targets: c, y: c.y - 3, duration: 300, ease: 'Sine.easeOut' });
      this.time.delayedCall(2600, () => { if (c.active) c.destroy(); this.bubbles = this.bubbles.filter((x) => x !== c); });
    });
  }
  clearBubbles() { this.bubbles?.forEach((b) => b.destroy()); this.bubbles = []; }
  emoteAt(sp, kind, delay = 0) {
    this.time.delayedCall(delay, () => {
      const c = emotionBubble(this, kind).setDepth(5080).setPosition(sp.x + 12, sp.y - 2 - HEAD_LIFT);
      this.bubbles.push(c);
      this.time.delayedCall(2600, () => { if (c.active) c.destroy(); this.bubbles = this.bubbles.filter((x) => x !== c); });
    });
  }
  // 헌금 바구니가 앉은 줄을 따라 돈다
  basketRun(onDone) {
    const seats = (this.audience ?? []).map((a) => [a.sp.x + 8, a.sp.y + 10]).slice(0, 18);
    if (!seats.length) { onDone?.(); return; }
    const g = this.add.graphics().setDepth(5070);
    g.fillStyle(0x1d1b26, 1).fillEllipse(0, 0, 13, 7);
    g.fillStyle(0xb8864a, 1).fillEllipse(0, 0, 11, 5);
    g.fillStyle(0xf0d070, 1).fillCircle(-2, -1, 1.5).fillCircle(2, 0, 1.5);
    g.setPosition(seats[0][0], seats[0][1]);
    let i = 0;
    const step = () => {
      i++;
      if (i >= seats.length) { this.tweens.add({ targets: g, alpha: 0, duration: 300, onComplete: () => { g.destroy(); onDone?.(); } }); return; }
      play('coins', 0.15);
      this.tweens.add({ targets: g, x: seats[i][0], y: seats[i][1], duration: 170, onComplete: step });
    };
    step();
  }
  endLiveWorship() {
    this.audience = null;
    this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
    this.bubbles?.forEach((b) => b.destroy());
    this.bubbles = [];
  }

  update(time, delta) {
    const s = app.s;
    if (!s) return;
    const dt = Math.min(delta, 100) / 1000;
    const free = app.modal === 0;
    if (free && s.mode === 'day' && app.speed > 0) app.advance(dt * CLOCK.minutesPerSecond * app.speed * app.clockRate());
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
        this.tweens.add({ targets: w.sp, x: tx, y: ty, duration: Math.hypot(tx - w.sp.x, ty - w.sp.y) * 30 + 10, onComplete: () => { w.sp.anims.stop(); w.sp.setFrame(idleFrame('down')); } });
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
