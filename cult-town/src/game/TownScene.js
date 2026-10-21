// 낮: 동네 RPG. 맵·건물 간판·지붕·골목 소품·주민(행동·감정·수다)·교주·시간대 색조. 게임 시간은 여기서 흐른다.
import Phaser from 'phaser';
import { CLOCK, MOOD } from '../config.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { CLERGY } from '../data/clergy.js';
import { CAST } from '../data/cast.js';
import { peopleOf } from '../sim/residents.js';
import { activityOf, emotionOf, gossipLine, JOB_ICON } from '../sim/mood.js';
import { registerPerson, LEADER_LOOK } from './people.js';
import { drawBuildingSigns, drawRoof, drawShapeProp, drawWires, drawStationExit, drawGroundLabel } from './signs.js';
import { makeIconTextures, emotionBubble, speechBubble, nameTag } from './overlays.js';
import { tintAt } from './tint.js';
import { Walker } from './walker.js';
import { app } from '../app.js';

const T = 16;
const CLERGY_BY_ID = Object.fromEntries(CLERGY.map((c) => [c.id, c]));
const CAST_BY = Object.fromEntries(CAST.map((c) => [c.id, c]));
export const lookOf = (id) => (id.startsWith('c:') ? CLERGY_BY_ID[id.slice(2)].look : id.startsWith('o:') || id.startsWith('cast:') ? CAST_BY[id.split(':')[1]].look : RESIDENT_BY_ID[id].look);
export const nameOf = (id) => (id.startsWith('c:') ? `${CLERGY_BY_ID[id.slice(2)].name} ${CLERGY_BY_ID[id.slice(2)].title}` : id.startsWith('o:') ? `${CAST_BY[id.slice(2)].name} (간부)` : RESIDENT_BY_ID[id].name);
const DIR_FRAME = { down: 0, left: 3, right: 6, up: 9 };

export class TownScene extends Phaser.Scene {
  constructor() { super('town'); }

  init(data) { this.entry = data?.entry ?? 'start'; }

  create() {
    const s = app.s;
    const map = this.make.tilemap({ key: 'town' });
    const ts = map.addTilesetImage('urban', 'urban');
    ['ground', 'detail', 'buildings', 'deco'].forEach((n, i) => map.createLayer(n, ts, 0, 0).setDepth(i));
    map.createLayer('above', ts, 0, 0).setDepth(5000);
    this.mapW = map.widthInPixels; this.mapH = map.heightInPixels;
    const prop = (n) => JSON.parse(map.properties.find((p) => p.name === n)?.value ?? 'null');
    makeIconTextures(this);

    // 건물: 지붕 위 물건과 간판
    this.buildings = prop('buildings');
    for (const b of this.buildings) { drawRoof(this, b); drawBuildingSigns(this, b); }
    // 골목 소품·전봇대·역 출구
    const poles = [];
    for (const o of map.getObjectLayer('places').objects) {
      const sprite = o.properties?.find((p) => p.name === 'sprite')?.value;
      if (o.type === 'shape') drawShapeProp(this, sprite, o.x, o.y);
      if (o.type === 'pole') poles.push([o.x / T, o.y / T]);
      if (o.type === 'exit') drawStationExit(this, sprite, o.x, o.y, o.properties.find((p) => p.name === 'label').value);
    }
    drawWires(this, poles);
    for (const l of prop('labels')) drawGroundLabel(this, l.text, l.x * T, l.y * T, { color: l.text === '도림천' ? '#ffffff' : '#e8e4f0' });
    // 장날: 시장 위쪽에 좌판이 더 나온다
    if (s.weather?.market) {
      for (const x of [18, 21, 24, 27, 30]) this.add.image(x * T, 24 * T, 'urbanSheet', 277).setOrigin(0).setDepth(3);
      drawGroundLabel(this, '오늘 장날', 24 * T, 30.5 * T, { color: '#7a3a1a', alpha: 0.85 });
    }

    // 사람들
    this.sprites = {};
    this.tags = {};
    this.emos = {};
    for (const p of peopleOf(s)) this.addPerson(p.id);
    registerPerson(this, 'p:leader', LEADER_LOOK);
    const start = this.entry === 'sanctuary' || this.entry === 'start' ? app.g.places.sanctuary.door : this.entry;
    this.player = this.add.sprite(start[0] * T, start[1] * T - 4, 'p:leader', 0).setOrigin(0, 0);
    this.walker = new Walker(this, this.player, app.g, 'p:leader', () => app.dpad);
    this.fx = this.add.graphics().setDepth(5050);
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
    this.hudTimer = 0; this.moodTimer = 0; this.gossipTimer = 0;
    this.gossip = null;
    this.near = null;
    this.placePeople(0);
    this.refreshOverlays();
    app.setWeatherFx(s.weather);
  }

  addPerson(id) {
    if (this.sprites[id]) return;
    const key = id.startsWith('o:') ? `p:cast:${id.slice(2)}` : `p:${id}`;
    registerPerson(this, key, lookOf(id));
    this.sprites[id] = this.add.sprite(0, 0, key, 0).setOrigin(0, 0);
    this.sprites[id].animKey = key;
  }

  fitZoom() {
    const { width, height } = this.scale;
    const z = Math.max(2, Math.min(4, Math.floor(Math.min(width / (T * 22), height / (T * 15)))));
    this.cameras.main.setZoom(z);
  }

  // 주민 스프라이트를 시뮬레이션 위치에 맞추고, 서 있는 사람은 그 자리에 맞는 행동을 한다
  placePeople(time) {
    const s = app.s;
    const ids = peopleOf(s).map((p) => p.id);
    for (const id of ids) this.addPerson(id);
    for (const id of Object.keys(this.sprites)) if (!ids.includes(id)) { this.sprites[id].setVisible(false); continue; }
    // 서 있는 사람 칸 표 (수다 상대 찾기)
    const standing = new Map();
    for (const id of ids) { const p = s.pos[id]; if (p && !p.inside && !p.path.length) standing.set(`${p.x},${p.y}`, id); }
    this.fx.clear();
    for (const id of ids) {
      const pos = s.pos[id]; const sp = this.sprites[id];
      if (!pos) continue;
      let x = pos.x; let y = pos.y;
      if (pos.path.length && pos.prog > 0) { x += (pos.path[0][0] - pos.x) * pos.prog; y += (pos.path[0][1] - pos.y) * pos.prog; }
      let px = Math.round(x * T); let py = Math.round(y * T - 4);
      sp.setVisible(!pos.inside);
      const moving = pos.path.length > 0 && app.speed > 0 && app.modal === 0;
      if (pos.path.length) {
        const dir = pos.path[0][0] > pos.x ? 'right' : pos.path[0][0] < pos.x ? 'left' : pos.path[0][1] > pos.y ? 'down' : 'up';
        if (moving) sp.play(`${sp.animKey}-walk-${dir}`, true); else { sp.anims.stop(); sp.setFrame(DIR_FRAME[dir]); }
        sp.act = null;
      } else if (!pos.inside) {
        sp.anims.stop();
        let neighbor = null;
        for (const [dx, dy] of [[1, 0], [-1, 0], [2, 0], [-2, 0], [0, 1], [0, -1]]) { const n = standing.get(`${pos.x + dx},${pos.y + dy}`); if (n && n !== id) { neighbor = { id: n, dx }; break; } }
        const act = id.includes(':') ? 'stand' : activityOf(id, pos.key, !!neighbor);
        sp.act = act; sp.neighbor = neighbor?.id ?? null;
        let frame = DIR_FRAME.down;
        const beat = Math.floor(time / 400);
        if (act === 'chat' && neighbor) frame = neighbor.dx > 0 ? DIR_FRAME.right : neighbor.dx < 0 ? DIR_FRAME.left : DIR_FRAME.down;
        if (act === 'shop') frame = DIR_FRAME.up;
        if (act === 'walk') frame = Math.floor(time / 1800 + id.length) % 2 ? DIR_FRAME.left : DIR_FRAME.right;
        if (act === 'serve' && Math.floor(time / 2600 + id.length) % 3 === 0) frame = DIR_FRAME.left;
        if (act === 'exercise') { py -= beat % 2; frame = DIR_FRAME.down + (beat % 2 ? 1 : 2); }
        if (act === 'sit') py += 3;
        sp.setFrame(frame);
        // 작은 효과: 폰 화면 불빛 · 담배 연기
        if (act === 'phone' && sp.visible) { this.fx.fillStyle(0x9ad8ff, 1).fillRect(px + 10, py + 9, 2, 3); }
        if (act === 'smoke' && sp.visible) {
          const t = (time / 900 + id.length) % 1;
          this.fx.fillStyle(0xd8d8d8, 0.8 - t * 0.7).fillCircle(px + 12 + t * 3, py + 6 - t * 10, 1.5 + t * 2);
        }
      }
      sp.setPosition(px, py);
      sp.setDepth(100 + y * T);
      const tag = this.tags[id];
      if (tag) tag.setPosition(px + 8, py - 1).setVisible(sp.visible).setDepth(5060);
      const emo = this.emos[id];
      if (emo) emo.c.setPosition(px + 14, py - 6).setVisible(sp.visible).setDepth(5070);
    }
    if (this.gossip) {
      const sp = this.sprites[this.gossip.id];
      this.gossip.c.setPosition(sp.x + 8, sp.y - 10).setDepth(5080).setVisible(sp.visible);
    }
    this.player.setDepth(100 + this.player.y + 4);
  }

  // 이름표 (만난 사람은 이름, 처음 보는 사람은 직업 아이콘) · 감정 말풍선
  refreshOverlays() {
    const s = app.s;
    for (const id of Object.keys(this.sprites)) {
      const known = id.includes(':') || s.res[id]?.met;
      const want = known ? `n:${id.startsWith('c:') || id.startsWith('o:') ? nameOf(id) : RESIDENT_BY_ID[id].name}` : `i:${JOB_ICON[id] ?? 'star'}`;
      const cur = this.tags[id];
      if (!cur || cur.want !== want) {
        cur?.destroy();
        const t = want.startsWith('n:') ? nameTag(this, want.slice(2)) : this.add.image(0, 0, `icon.${want.slice(2)}`).setOrigin(0.5, 1);
        t.want = want;
        this.tags[id] = t;
      }
      const kind = id.includes(':') ? null : emotionOf(s, id);
      const e = this.emos[id];
      if ((e?.kind ?? null) !== kind) {
        e?.c.destroy();
        if (kind) this.emos[id] = { kind, c: emotionBubble(this, kind) };
        else delete this.emos[id];
      }
    }
  }

  // 가까이 서 있는 두 주민이 짧게 수다 (교주가 가까이 있을 때만 들린다)
  tryGossip() {
    const s = app.s;
    if (this.gossip) { this.gossip.c.destroy(); this.gossip = null; }
    const [px, py] = this.walker.tile;
    const cands = Object.keys(this.sprites).filter((id) => {
      const sp = this.sprites[id];
      if (!sp.visible || id.includes(':') || !sp.neighbor || sp.neighbor.includes(':')) return false;
      const pos = s.pos[id];
      return Math.abs(pos.x - px) + Math.abs(pos.y - py) <= MOOD.hearTiles;
    });
    if (!cands.length) return;
    const id = cands[Math.floor(Math.random() * cands.length)];
    const line = gossipLine(s, id, this.sprites[id].neighbor);
    this.gossip = { id, c: speechBubble(this, line), until: this.time.now + MOOD.bubbleSeconds * 1000 };
  }

  personAt(wx, wy) {
    let best = null; let bd = 0.9;
    for (const id of Object.keys(this.sprites)) {
      const sp = this.sprites[id];
      if (!sp.visible) continue;
      const d = Math.hypot(sp.x / T + 0.5 - wx / T, (sp.y + 4) / T + 0.5 - wy / T);
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  }

  buildingAt(tx, ty) {
    return this.buildings.find((b) => tx >= b.x && tx < b.x + b.w && ty >= b.y && ty < b.y + b.h) ?? null;
  }

  onTap(ptr) {
    if (app.modal > 0 || app.s.mode !== 'day') return;
    if (ptr.event?.target?.closest?.('#ui > *')) return;
    const wx = ptr.worldX; const wy = ptr.worldY;
    const tx = Math.floor(wx / T); const ty = Math.floor(wy / T);
    const who = this.personAt(wx, wy);
    if (who) { app.showProfile(who, () => this.walker.chase(() => this.tileOf(who), () => app.talkTo(who))); return; }
    const b = this.buildingAt(tx, ty);
    if (b) {
      const door = [b.door, b.y + b.h];
      this.walker.goTo(door, () => (b.place ? app.useDoor(b.place) : app.lookShop(b)));
      return;
    }
    this.walker.goTo([tx, ty]);
  }

  tileOf(id) {
    const sp = this.sprites[id];
    if (!sp || !sp.visible) return null;
    return [Math.round(sp.x / T), Math.round((sp.y + 4) / T)];
  }

  // 교주 근처에서 말 걸 수 있는 사람 / 들어갈 수 있는 문
  findNear() {
    const [px, py] = this.walker.center();
    let best = null; let bd = 1.6 * T;
    for (const id of Object.keys(this.sprites)) {
      const sp = this.sprites[id];
      if (!sp.visible) continue;
      const d = Math.hypot(sp.x + 8 - px, sp.y + 8 - py);
      if (d < bd) { bd = d; best = { kind: 'person', id }; }
    }
    if (best) return best;
    const [tx, ty] = this.walker.tile;
    for (const b of this.buildings) {
      if (Math.abs(b.door - tx) <= 1 && b.y + b.h === ty) return b.place ? { kind: 'door', place: b.place } : b.shop ? { kind: 'shop', b } : null;
    }
    for (const place of ['market', 'park', 'station', 'stream']) {
      const d = app.g.places[place]?.door;
      if (d && Math.abs(d[0] - tx) + Math.abs(d[1] - ty) <= 1) return { kind: 'door', place };
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
    this.placePeople(time);
    app.checkPlaceVisit(this.walker.tile);

    const near = free ? this.findNear() : null;
    const key = near ? near.id ?? near.place ?? `shop:${near.b?.i}` : null;
    if (key !== this.nearKey) { this.nearKey = key; this.near = near; app.setNearAction(near); }

    this.moodTimer += delta;
    if (this.moodTimer > 500) { this.moodTimer = 0; this.refreshOverlays(); }
    this.gossipTimer += delta;
    if (this.gossip && time > this.gossip.until) { this.gossip.c.destroy(); this.gossip = null; }
    if (this.gossipTimer > MOOD.gossipEverySeconds * 1000 && free) { this.gossipTimer = 0; this.tryGossip(); }

    const tint = tintAt(s.minute);
    this.tintRect.setFillStyle(s.weather?.rain ? Phaser.Display.Color.ValueToColor(tint.color).darken(20).color : tint.color, tint.alpha + (s.weather?.rain ? 0.12 : 0));

    this.hudTimer += delta;
    if (this.hudTimer > 200) { this.hudTimer = 0; app.hud?.update(); }
  }
}
