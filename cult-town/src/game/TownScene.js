// 낮: 동네 RPG. 맵·주민·교주·간판·시간대 색조. 게임 시간은 여기서 흐른다.
import Phaser from 'phaser';
import { CLOCK } from '../config.js';
import { BUILDINGS, STATION_EXITS } from '../map/layout.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { CLERGY } from '../data/clergy.js';
import { PEOPLE } from '../sim/residents.js';
import { registerPerson, LEADER_LOOK } from './people.js';
import { drawSign, drawStationExit, drawGroundLabel } from './signs.js';
import { tintAt } from './tint.js';
import { Walker } from './walker.js';
import { app } from '../app.js';

const T = 16;
const CLERGY_BY_ID = Object.fromEntries(CLERGY.map((c) => [c.id, c]));
export const lookOf = (id) => (id.startsWith('c:') ? CLERGY_BY_ID[id.slice(2)].look : RESIDENT_BY_ID[id].look);

export class TownScene extends Phaser.Scene {
  constructor() { super('town'); }

  init(data) { this.entry = data?.entry ?? 'start'; }

  create() {
    const map = this.make.tilemap({ key: 'town' });
    const ts = map.addTilesetImage('urban', 'urban');
    ['ground', 'detail', 'buildings', 'deco'].forEach((n, i) => map.createLayer(n, ts, 0, 0).setDepth(i));
    map.createLayer('above', ts, 0, 0).setDepth(5000);
    this.mapW = map.widthInPixels; this.mapH = map.heightInPixels;

    // 간판·역 출구·바닥 글씨
    for (const b of BUILDINGS) {
      const facade = b.floors ?? (b.h >= 9 ? 3 : 2);
      const doorX = b.door ?? b.x + Math.floor(b.w / 2);
      drawSign(this, `sign.${b.place}`, (doorX + 0.5) * T, (b.y + b.h - facade) * T, b.place);
    }
    for (const e of STATION_EXITS) drawStationExit(this, e.sprite, e.x * T, e.y * T, e.label);
    drawGroundLabel(this, '남부순환로', 10 * T, 7 * T); drawGroundLabel(this, '남부순환로', 58 * T, 7 * T);
    drawGroundLabel(this, '신\n림\n로', 35 * T, 30 * T); drawGroundLabel(this, '신\n림\n로', 35 * T, 46 * T);
    drawGroundLabel(this, '도림천', 12 * T, 1.5 * T, { color: '#ffffff' }); drawGroundLabel(this, '도림천', 60 * T, 1.5 * T, { color: '#ffffff' });
    drawGroundLabel(this, '도림골목시장', 24 * T, 24.5 * T, { color: '#5a3a1a', alpha: 0.8 });
    drawGroundLabel(this, '솔밭 쉼터', 7 * T, 40 * T, { color: '#1d4a2a', alpha: 0.7 });

    // 사람들
    this.sprites = {};
    for (const p of PEOPLE) {
      const key = `p:${p.id}`;
      registerPerson(this, key, lookOf(p.id));
      this.sprites[p.id] = this.add.sprite(0, 0, key, 0).setOrigin(0, 0);
    }
    registerPerson(this, 'p:leader', LEADER_LOOK);
    const start = this.entry === 'sanctuary' || this.entry === 'start' ? app.g.places.sanctuary.door : this.entry;
    this.player = this.add.sprite(start[0] * T, start[1] * T - 4, 'p:leader', 0).setOrigin(0, 0);
    this.walker = new Walker(this, this.player, app.g, 'p:leader');
    this.nameTag = this.add.text(0, 0, '', { fontFamily: 'Galmuri11', fontSize: '11px', color: '#ffffff', backgroundColor: '#1d1b26' }).setPadding(2, 0, 2, 0).setOrigin(0.5, 1).setDepth(6000).setVisible(false);

    this.tintRect = this.add.rectangle(0, 0, this.mapW, this.mapH, 0x000000, 0).setOrigin(0).setDepth(9000);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.mapW, this.mapH);
    cam.startFollow(this.player, true, 0.2, 0.2);
    cam.setRoundPixels(true);
    this.fitZoom();
    this.scale.on('resize', this.fitZoom, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.fitZoom, this));

    this.input.on('pointerdown', (ptr) => this.onTap(ptr));
    const kb = this.input.keyboard;
    kb.on('keydown-SPACE', () => app.actionKey());
    kb.on('keydown-ENTER', () => app.actionKey());
    this.hudTimer = 0;
    this.near = null;
    this.placePeople();
  }

  fitZoom() {
    const { width, height } = this.scale;
    const z = Math.max(2, Math.min(4, Math.floor(Math.min(width / (T * 22), height / (T * 15)))));
    this.cameras.main.setZoom(z);
  }

  // 주민 스프라이트를 시뮬레이션 위치에 맞춘다 (칸 사이 보간)
  placePeople() {
    const s = app.s;
    for (const p of PEOPLE) {
      const pos = s.pos[p.id]; const sp = this.sprites[p.id];
      if (!pos) continue;
      let x = pos.x; let y = pos.y;
      if (pos.path.length && pos.prog > 0) { x += (pos.path[0][0] - pos.x) * pos.prog; y += (pos.path[0][1] - pos.y) * pos.prog; }
      sp.setPosition(Math.round(x * T), Math.round(y * T - 4));
      sp.setVisible(!pos.inside);
      sp.setDepth(100 + y * T);
      const moving = pos.path.length > 0 && app.speed > 0 && app.modal === 0;
      const dir = pos.path.length ? (pos.path[0][0] > pos.x ? 'right' : pos.path[0][0] < pos.x ? 'left' : pos.path[0][1] > pos.y ? 'down' : 'up') : (pos.dir ?? 'down');
      if (moving) sp.play(`p:${p.id}-walk-${dir}`, true);
      else { sp.anims.stop(); sp.setFrame(['down', 'left', 'right', 'up'].indexOf(pos.path.length ? dir : 'down') * 3); }
    }
    this.player.setDepth(100 + this.player.y + 4);
  }

  personAtTile(tx, ty) {
    let best = null; let bd = 0.9;
    for (const p of PEOPLE) {
      const sp = this.sprites[p.id];
      if (!sp.visible) continue;
      const d = Math.hypot(sp.x / T - tx, (sp.y + 4) / T - ty);
      if (d < bd) { bd = d; best = p.id; }
    }
    return best;
  }

  buildingAt(tx, ty) {
    return BUILDINGS.find((b) => tx >= b.x && tx < b.x + b.w && ty >= b.y && ty < b.y + b.h) ?? null;
  }

  onTap(ptr) {
    if (app.modal > 0 || app.s.mode !== 'day') return;
    const wx = ptr.worldX; const wy = ptr.worldY;
    const tx = Math.floor(wx / T); const ty = Math.floor(wy / T);
    const who = this.personAtTile(wx / T - 0.5, wy / T - 0.5);
    if (who) { app.showProfile(who, () => this.walker.chase(() => this.tileOf(who), () => app.talkTo(who))); return; }
    const b = this.buildingAt(tx, ty);
    if (b) {
      const door = app.g.places[b.place].door;
      this.walker.goTo(door, () => app.useDoor(b.place));
      return;
    }
    this.walker.goTo([tx, ty]);
  }

  tileOf(id) {
    const sp = this.sprites[id];
    if (!sp.visible) return null;
    return [Math.round(sp.x / T), Math.round((sp.y + 4) / T)];
  }

  // 교주 근처에서 말 걸 수 있는 사람 / 들어갈 수 있는 문
  findNear() {
    const [px, py] = this.walker.center();
    let best = null; let bd = 1.6 * T;
    for (const p of PEOPLE) {
      const sp = this.sprites[p.id];
      if (!sp.visible) continue;
      const d = Math.hypot(sp.x + 8 - px, sp.y + 8 - py);
      if (d < bd) { bd = d; best = { kind: 'person', id: p.id }; }
    }
    if (best) return best;
    const [tx, ty] = this.walker.tile;
    for (const b of BUILDINGS) {
      const [dx, dy] = app.g.places[b.place].door;
      if (Math.abs(dx - tx) <= 1 && dy === ty) return { kind: 'door', place: b.place };
    }
    return null;
  }

  update(time, delta) {
    const s = app.s;
    if (!s) return;
    const dt = Math.min(delta, 100) / 1000;
    const free = app.modal === 0 && s.mode === 'day';
    if (free && app.speed > 0) app.advance(dt * CLOCK.minutesPerSecond * app.speed);
    this.walker.update(dt, free);
    this.walker.takeFatigue(s);
    this.placePeople();

    // 근처 대상 → 큰 버튼
    const near = free ? this.findNear() : null;
    const key = near ? near.id ?? near.place : null;
    if (key !== this.nearKey) {
      this.nearKey = key; this.near = near;
      app.setNearAction(near);
    }
    if (near?.kind === 'person') {
      const sp = this.sprites[near.id];
      const name = near.id.startsWith('c:') ? `${CLERGY_BY_ID[near.id.slice(2)].name} ${CLERGY_BY_ID[near.id.slice(2)].title}` : RESIDENT_BY_ID[near.id].name;
      this.nameTag.setText(name).setPosition(sp.x + 8, sp.y - 1).setVisible(true);
    } else this.nameTag.setVisible(false);

    const tint = tintAt(s.minute);
    this.tintRect.setFillStyle(tint.color, tint.alpha);

    this.hudTimer += delta;
    if (this.hudTimer > 200) { this.hudTimer = 0; app.hud?.update(); }
  }
}

