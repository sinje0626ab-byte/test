// 낮: 동네 RPG. 맵·건물 간판·지붕·골목 소품·주민(행동·감정·수다)·교주·시간대 색조. 게임 시간은 여기서 흐른다.
import { isZealot, zealotsOf } from '../sim/zealots.js';
import { ZEALOT_TEXT } from '../data/zealots.js';
import Phaser from 'phaser';
import { CLOCK, MOOD } from '../config.js';
const LOOK_MIN = 4;   // 도착하고 두리번거리는 시간 (게임분)
import { RESIDENT_BY_ID, RESIDENTS } from '../data/residents.js';
import { ALL_CLERGY as CLERGY } from '../data/clergy.js';
import { CAST } from '../data/cast.js';
import { peopleOf, speedOf } from '../sim/residents.js';
import { activityOf, emotionOf, gossipLine, lastGossip, JOB_ICON } from '../sim/mood.js';
import { registerPerson, LEADER_LOOK } from './people.js';
import { drawBuildingSigns, drawRoof, drawShapeProp, drawWires, drawStationExit, drawGroundLabel, drawSanctuarySign, drawFloorDirectory } from './signs.js';
import { makeIconTextures, emotionBubble, speechBubble, nameTag, picket, wallNotice, questMark } from './overlays.js';
import { REPORTER } from '../config.js';
import { REPORTER_INFO, NOTICE_TEXT, PROTEST_TEXT } from '../data/threats.js';
import { RIVAL_LOOKS } from '../data/rival.js';
import { isDefector, protestToday, reporterTarget } from '../sim/threats.js';
import { rivalInfo } from '../sim/rival.js';
import { nameForNpc } from '../ui/threats.js';
import { toast } from '../ui/toast.js';
import { tintAt } from './tint.js';
import { Walker } from './walker.js';
import { app } from '../app.js';
import { speak } from '../ui/text.js';
import { play } from '../ui/sound.js';
import { sightCut } from '../sim/growth.js';
import { questMarkers, hear } from '../sim/quests.js';
import { bigDayOf, bigDayActive, bigDayDone } from '../sim/bigdays.js';
import { walkable } from '../sim/grid.js';

const T = 16;
const CLERGY_BY_ID = Object.fromEntries(CLERGY.map((c) => [c.id, c]));
const CAST_BY = Object.fromEntries(CAST.map((c) => [c.id, c]));
export const lookOf = (id) => (id.startsWith('c:') ? CLERGY_BY_ID[id.slice(2)].look : id.startsWith('o:') || id.startsWith('cast:') ? CAST_BY[id.split(':')[1]].look
  : id === 'x:reporter' ? REPORTER_INFO.look : id.startsWith('v:') ? RIVAL_LOOKS[id.slice(2)] : RESIDENT_BY_ID[id].look);
export const nameOf = (id) => (id.startsWith('c:') ? `${CLERGY_BY_ID[id.slice(2)].name} ${CLERGY_BY_ID[id.slice(2)].title}` : id.startsWith('o:') ? `${CAST_BY[id.slice(2)].name} (간부)`
  : id.startsWith('x:') || id.startsWith('v:') ? nameForNpc(app.s, id) : RESIDENT_BY_ID[id].name);
const FWD = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
// 기자 앞쪽 시야: 바라보는 방향으로 1~4칸, 폭 3칸
export function inSight(pos, tx, ty) {
  const [fx, fy] = FWD[pos.dir ?? 'down'];
  const dx = tx - pos.x; const dy = ty - pos.y;
  const fwd = dx * fx + dy * fy; const lat = Math.abs(dx * fy - dy * fx);
  return fwd >= 1 && fwd <= REPORTER.sight.tiles - sightCut(app.s) && lat <= (REPORTER.sight.width - 1) / 2;
}
const DIR_FRAME = { down: 0, left: 3, right: 6, up: 9 };
const text2 = (t) => (t.length > 26 ? t.slice(0, 25) + '…' : t);

export class TownScene extends Phaser.Scene {
  constructor() { super('town'); }

  init(data) { this.entry = data?.entry ?? 'start'; }

  create() {
    const s = app.s;
    this.district = app.district();
    const bong = this.district === 'bongcheon';
    const here = app.here();
    const map = this.make.tilemap({ key: bong ? 'bongcheon' : 'town' });
    const ts = map.addTilesetImage('urban', 'urban');
    ['ground', 'detail', 'buildings', 'deco'].forEach((n, i) => map.createLayer(n, ts, 0, 0).setDepth(i));
    map.createLayer('above', ts, 0, 0).setDepth(5000);
    this.mapW = map.widthInPixels; this.mapH = map.heightInPixels;
    const prop = (n) => JSON.parse(map.properties.find((p) => p.name === n)?.value ?? 'null');
    makeIconTextures(this);

    // 건물: 지붕 위 물건과 간판
    this.buildings = prop('buildings');
    for (const b of this.buildings) { drawRoof(this, b); drawBuildingSigns(this, b); }
    // 동림상가: 교단 간판(단계별) · 입구 층별 안내판
    this.noticeAreas = [];
    const mall = !bong && this.buildings.find((b) => b.place === 'sanctuary');
    this.mall = mall;
    if (mall) {
      this.sanctuarySign = drawSanctuarySign(this, mall, s.leader.cultName, s.sanctuary.sign ?? 0, s.minute >= 18 * 60);
      const dir = drawFloorDirectory(this, mall, s.leader.cultName, s.sanctuary.sign ?? 0);
      this.directory = { ...dir.area, text: `동림상가 층별 안내: ${dir.lines.join(' · ')}` };
    }
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
    if (s.weather?.market && !bong) {
      for (const x of [18, 21, 24, 27, 30]) this.add.image(x * T, 24 * T, 'urbanSheet', 277).setOrigin(0).setDepth(3);
      drawGroundLabel(this, '오늘 장날', 24 * T, 30.5 * T, { color: '#7a3a1a', alpha: 0.85 });
    }
    // 큰 날 (25장 D): 행사 자리에 현수막과 좌판
    this.bigDay = !bong ? bigDayOf(s) : null;
    if (this.bigDay) {
      const bd = this.bigDay;
      const [place, spot] = bd.spot.split(':');
      const t = here.places[place]?.spots?.[spot];
      if (t) {
        this.bigDayTile = t;
        for (const dx of [-3, 3]) {
          const x = t[0] + dx; const y = t[1] - 1;
          if (walkable(here, x, y)) this.add.image(x * T, y * T, 'urbanSheet', 277).setOrigin(0).setDepth(3);
        }
        wallNotice(this, t[0] * T + 8, (t[1] - 2) * T, bd.banner, { bg: 0xc23a3a, color: '#fff6e0', w: 72 }).setDepth(4790);
        // 이름 없는 구경꾼: 행사 시간에만 자리 주변에 서 있다 (화면 장식, 말 걸 수 없음)
        this.bigDayExtras = [];
        const ring = [[-2, 1], [2, 1], [-1, 2], [1, 2], [-3, 0], [3, 0], [0, 3], [-2, 3], [2, 3], [4, 2]];
        ring.forEach(([dx, dy], k) => {
          const x = t[0] + dx; const y = t[1] + dy;
          if (!walkable(here, x, y)) return;
          const key = `p:extra:${k % 6}`;
          const base = RESIDENTS[(k * 11 + 3) % RESIDENTS.length].look;
          registerPerson(this, key, { ...base, hairColor: ['#3a3030', '#5a4a3a', '#2a2a2a'][k % 3], top: ['#8a6a5a', '#5a7a9a', '#9a8a5a', '#6a8a6a', '#a07a8a', '#7a7a8a'][k % 6] });
          const sp = this.add.sprite(x * T, y * T - 4, key, (dx < 0 ? 2 : dx > 0 ? 1 : 3) * 3).setOrigin(0, 0).setDepth(100 + y * T).setVisible(false);
          this.bigDayExtras.push(sp);
        });
      }
    }

    // 사람들
    this.sprites = {};
    this.tags = {};
    this.emos = {};
    for (const p of this.people()) this.addPerson(p.id);
    registerPerson(this, 'p:leader', LEADER_LOOK);
    const start = this.entry === 'station' ? here.places[bong ? 'b_station' : 'station'].door
      : this.entry === 'sanctuary' || this.entry === 'start' ? (bong ? here.places.b_station.door : here.places.sanctuary.door) : this.entry;
    this.player = this.add.sprite(start[0] * T, start[1] * T - 4, 'p:leader', 0).setOrigin(0, 0);
    this.walker = new Walker(this, this.player, here, 'p:leader', () => app.dpad);
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
    this.bubbles = [];
    this.seenTalk = {};
    this.notices = this.add.container(0, 0).setDepth(4800);
    this.noticeKey = '';
    this.lostT = 0;
    this.placePeople(0);
    this.refreshOverlays();
    app.setWeatherFx(s.weather);
  }

  // 이 지도(동네)에 사는 사람만
  people() { return peopleOf(app.s).filter((p) => (p.district ?? 'sillim') === this.district); }

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

  // 주민 스프라이트: 시뮬레이션 위치(격자)를 목표로 부드럽게 따라간다 → 출발·정지 가감속, 모퉁이를 살짝 돌아 걷는다.
  // 마주치면 옆으로 비켜 지나가고, 도착하면 잠깐 두리번거린 뒤 그 자리 행동을 한다.
  placePeople(time, dt = 0) {
    const s = app.s;
    const ids = this.people().map((p) => p.id);
    for (const id of ids) this.addPerson(id);
    for (const id of Object.keys(this.sprites)) if (!ids.includes(id)) { this.sprites[id].setVisible(false); continue; }
    const standing = new Map();
    for (const id of ids) { const p = s.pos[id]; if (p && !p.inside && !p.path.length) standing.set(`${p.x},${p.y}`, id); }
    this.fx.clear();
    const movers = [];
    for (const id of ids) {
      const pos = s.pos[id]; const sp = this.sprites[id];
      if (!pos) continue;
      let x = pos.x; let y = pos.y;
      if (pos.path.length && pos.prog > 0) { x += (pos.path[0][0] - pos.x) * pos.prog; y += (pos.path[0][1] - pos.y) * pos.prog; }
      let tx = x * T; let ty = y * T - 4;
      const wasHidden = !sp.visible;
      sp.setVisible(!pos.inside);
      if (sp.dispX == null || wasHidden || !dt) { sp.dispX = tx; sp.dispY = ty; }
      const walking = pos.path.length > 0 && !(pos.wait > 0);
      const moving = walking && app.speed > 0 && app.modal === 0;
      const tps = speedOf(s, id) * CLOCK.minutesPerSecond;
      let dirNow = pos.dir ?? 'down';
      if (pos.path.length) dirNow = pos.path[0][0] > pos.x ? 'right' : pos.path[0][0] < pos.x ? 'left' : pos.path[0][1] > pos.y ? 'down' : 'up';
      if (pos.path.length) {
        sp.act = null;
        if (moving) { sp.play(`${sp.animKey}-walk-${dirNow}`, true); sp.anims.timeScale = (tps * Math.max(1, app.speed)) / 2; }
        else {
          sp.anims.stop();
          // 가다 멈춤: 폰 확인 · 가게 쳐다보기 · 신호 기다리기 · 비켜 서기
          const pf = pos.pause === 'look' ? DIR_FRAME.up : DIR_FRAME[dirNow];
          sp.setFrame(pos.pause === 'phone' ? DIR_FRAME.down : pf);
          if (pos.pause === 'phone' && sp.visible) this.fx.fillStyle(0x9ad8ff, 1).fillRect(sp.dispX + 10, sp.dispY + 9, 2, 3);
        }
        if (moving) movers.push({ id, sp, dir: dirNow });
      } else if (!pos.inside) {
        sp.anims.stop();
        let neighbor = null;
        for (const [dx, dy] of [[1, 0], [-1, 0], [2, 0], [-2, 0], [0, 1], [0, -1]]) { const n = standing.get(`${pos.x + dx},${pos.y + dy}`); if (n && n !== id) { neighbor = { id: n, dx }; break; } }
        const act = id.includes(':') ? 'stand' : activityOf(id, pos.key, !!neighbor);
        sp.act = act; sp.neighbor = neighbor?.id ?? null;
        let frame = DIR_FRAME.down;
        const beat = Math.floor(time / 400);
        const justArrived = pos.arrived != null && s.minute - pos.arrived < LOOK_MIN;
        if (justArrived) frame = [DIR_FRAME.left, DIR_FRAME.down, DIR_FRAME.right][Math.floor(time / 350 + id.length) % 3];
        else {
          if (act === 'chat' && neighbor) frame = neighbor.dx > 0 ? DIR_FRAME.right : neighbor.dx < 0 ? DIR_FRAME.left : DIR_FRAME.down;
          if (act === 'shop') frame = DIR_FRAME.up;
          if (act === 'walk') frame = Math.floor(time / 1800 + id.length) % 2 ? DIR_FRAME.left : DIR_FRAME.right;
          if (act === 'serve' && Math.floor(time / 2600 + id.length) % 3 === 0) frame = DIR_FRAME.left;
          if (act === 'exercise') { ty -= beat % 2; frame = DIR_FRAME.down + (beat % 2 ? 1 : 2); }
          if (act === 'sit') ty += 3;
        }
        sp.setFrame(frame);
        if (!justArrived && act === 'phone' && sp.visible) this.fx.fillStyle(0x9ad8ff, 1).fillRect(sp.dispX + 10, sp.dispY + 9, 2, 3);
        if (!justArrived && act === 'smoke' && sp.visible) {
          const t = (time / 900 + id.length) % 1;
          this.fx.fillStyle(0xd8d8d8, 0.8 - t * 0.7).fillCircle(sp.dispX + 12 + t * 3, sp.dispY + 6 - t * 10, 1.5 + t * 2);
        }
      }
      sp.tx = tx; sp.ty = ty; sp.tps = tps;
    }
    // 마주치는 사람: 진행 방향에 수직으로 몇 픽셀 비켜 선다
    for (let i = 0; i < movers.length; i++) for (let j = i + 1; j < movers.length; j++) {
      const a = movers[i]; const b = movers[j];
      if (Math.abs(a.sp.tx - b.sp.tx) > 12 || Math.abs(a.sp.ty - b.sp.ty) > 12) continue;
      const side = a.id < b.id ? 1 : -1;
      const horiz = a.dir === 'left' || a.dir === 'right';
      if (horiz) { a.sp.ty -= 5 * side; b.sp.ty += 5 * side; } else { a.sp.tx -= 5 * side; b.sp.tx += 5 * side; }
    }
    for (const id of ids) {
      const sp = this.sprites[id]; const pos = s.pos[id];
      if (!pos || sp.tx == null) continue;
      if (dt) {
        // 지수 감쇠로 따라가되 한 프레임에 갈 수 있는 거리는 그 사람 속도의 1.6배까지 → 출발·정지에 짧은 가감속
        const k = 1 - Math.exp(-dt * (pos.path.length ? 9 : 7));
        let ddx = (sp.tx - sp.dispX) * k; let ddy = (sp.ty - sp.dispY) * k;
        const maxStep = sp.tps * T * Math.max(1, app.speed) * dt * 1.6 + 0.5;
        const d = Math.hypot(ddx, ddy);
        if (d > maxStep) { ddx *= maxStep / d; ddy *= maxStep / d; }
        if (Math.hypot(sp.tx - sp.dispX, sp.ty - sp.dispY) > T * 3) { sp.dispX = sp.tx; sp.dispY = sp.ty; }   // 너무 벌어지면 바로 맞춘다
        else { sp.dispX += ddx; sp.dispY += ddy; }
      }
      const px = Math.round(sp.dispX); const py = Math.round(sp.dispY);
      sp.setPosition(px, py);
      sp.setDepth(100 + py + 4);
      const tag = this.tags[id];
      if (tag) tag.setPosition(px + 8, py - 1).setVisible(sp.visible).setDepth(5060);
      const emo = this.emos[id];
      if (emo) emo.c.setPosition(px + 14, py - 6).setVisible(sp.visible).setDepth(5070);
      const qm = this.qmarks?.[id];
      if (qm) qm.setPosition(px + 8, py - 11).setVisible(sp.visible).setDepth(5065);
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
    this.refreshQuestMarks();
    for (const id of Object.keys(this.sprites)) {
      const known = id.includes(':') || s.res[id]?.met;
      const want = known ? `n:${id.includes(':') ? nameOf(id) : RESIDENT_BY_ID[id].name}` : `i:${JOB_ICON[id] ?? 'star'}`;
      const cur = this.tags[id];
      if (!cur || cur.want !== want) {
        cur?.destroy();
        const t = want.startsWith('n:') ? nameTag(this, want.slice(2)) : this.add.image(0, 0, `icon.${want.slice(2)}`).setOrigin(0.5, 1);
        t.want = want;
        this.tags[id] = t;
      }
      let kind = null;
      if (!id.includes(':')) {
        if (isZealot(s, id)) kind = 'zealot';
        else if (isDefector(s, id)) kind = 'defector';
        else if (s.reporter?.active && reporterTarget(s) === id) kind = 'press';
        else if (s.rival && s.res[id].rival && s.res[id].rival !== 'none' && s.res[id].met) kind = 'rival';
        else kind = emotionOf(s, id);
      }
      const e = this.emos[id];
      if ((e?.kind ?? null) !== kind) {
        e?.c.destroy();
        if (kind) this.emos[id] = { kind, c: emotionBubble(this, kind) };
        else delete this.emos[id];
      }
    }
  }

  // 열혈 신자가 지나가는 사람에게 말 거는 모습 (몇 초에 한 번, 화면용)
  zealotTalk(time) {
    if (time < (this.zealotAt ?? 0)) return;
    this.zealotAt = time + 6000 + Math.random() * 6000;
    const ids = zealotsOf(app.s).map((z) => z.id).filter((id) => this.sprites[id]?.visible && app.s.mode === 'day');
    if (!ids.length) return;
    const id = ids[Math.floor(Math.random() * ids.length)];
    this.say(id, ZEALOT_TEXT.bubbles[Math.floor(Math.random() * ZEALOT_TEXT.bubbles.length)], time);
  }

  // 간판 바꾸는 장면 (25장 A-1): 카메라가 상가 3층으로 가고, 시트지 글자가 한 자씩 붙는다 → 간판을 새로 그리고 돌아온다
  signScene(tier, onDone) {
    const b = this.mall;
    if (!b) { onDone?.(); return; }
    const cam = this.cameras.main;
    const s = app.s;
    const cx = (b.x + b.w / 2) * T + 8; const cy = (b.y + b.roofH + 1) * T + 8;
    cam.stopFollow();
    cam.pan(cx, cy + 24, 900, 'Sine.easeInOut');
    const prevZoom = cam.zoom;
    cam.zoomTo(prevZoom * 1.4, 900, 'Sine.easeInOut');
    const letters = [];
    const name = tier >= 1 ? `302 ${s.leader.cultName}` : s.leader.cultName;
    this.time.delayedCall(1000, () => {
      // 예전 간판을 지우고 글자를 한 자씩
      for (const p of [].concat(this.sanctuarySign ?? [])) p?.destroy?.();
      const startX = cx - (name.length * 7) / 2;
      [...name].forEach((ch, i) => {
        this.time.delayedCall(i * 170, () => {
          const t = this.add.text(startX + i * 7, cy - 6, ch, { fontFamily: 'Galmuri7', fontSize: '8px', color: '#ffffff', stroke: '#1d1b26', strokeThickness: 2 }).setDepth(90).setScale(1.6).setAlpha(0);
          this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 160, ease: 'Back.easeOut' });
          letters.push(t);
          play('click', 0.25);
        });
      });
      this.time.delayedCall(name.length * 170 + 900, () => {
        for (const t of letters) t.destroy();
        this.sanctuarySign = drawSanctuarySign(this, b, s.leader.cultName, tier, s.minute >= 18 * 60);
        this.time.delayedCall(700, () => {
          cam.zoomTo(prevZoom, 700, 'Sine.easeInOut');
          cam.pan(this.player.x, this.player.y, 700, 'Sine.easeInOut', false, (c, prog) => { if (prog === 1) { cam.startFollow(this.player, true, 0.2, 0.2); onDone?.(); } });
        });
      });
    });
  }

  // 퀘스트 표시: 사람 머리 위 · 장소 입구 위
  refreshQuestMarks() {
    const marks = questMarkers(app.s);
    const key = JSON.stringify(marks);
    if (key === this.qkey) return;
    this.qkey = key;
    for (const c of Object.values(this.qmarks ?? {})) c.destroy();
    this.qmarks = {};
    for (const m of marks) {
      if (m.kind === 'res' && this.sprites[m.id] && !this.qmarks[m.id]) this.qmarks[m.id] = questMark(this, m.why);
      if (m.kind === 'place') {
        const d = app.here().places[m.place]?.door;
        if (!d || this.qmarks[`p:${m.place}`]) continue;
        this.qmarks[`p:${m.place}`] = questMark(this, m.why).setPosition(d[0] * T + 8, d[1] * T - 2).setDepth(5065);
      }
    }
  }

  // 3단계: 피켓 · 벽 안내문 · 라이벌 간판 · 기자/탈퇴자/라이벌 말풍선
  refreshThreats(time) {
    const s = app.s;
    if (s.phase < 3) return;
    const P = protestToday(s);
    const pid = P?.id;
    if (this.picketC && this.picketC.pid !== pid) { this.picketC.destroy(); this.picketC = null; }
    if (pid && !this.picketC) { this.picketC = picket(this, PROTEST_TEXT.signs[P.sign ?? 0]); this.picketC.pid = pid; }
    const key = JSON.stringify([s.notices, s.rival?.status, s.branch?.open]);
    if (key !== this.noticeKey) {
      this.noticeKey = key;
      this.notices.removeAll(true);
      this.noticeAreas = [];
      for (const c of CLERGY) {
        if (s.notices[c.id] == null || !app.here().places[c.place]) continue;
        const d = app.here().places[c.place].door;
        const n = NOTICE_TEXT[c.id];
        this.notices.add(wallNotice(this, d[0] * T + 8, (d[1] - 1) * T - 2, `${n.kind}\n${n.short}`, { w: 70 }));
        this.noticeAreas.push({ x: d[0], y: d[1] - 1, text: `${n.where}: "${n.text}"` });
      }
      const R = rivalInfo(s);
      if (R && ['active', 'enemy', 'truce'].includes(s.rival.status) && this.district === 'sillim') {
        const d = app.g.places.office.door;
        this.notices.add(wallNotice(this, d[0] * T + 8, (d[1] - 2) * T, `4층 ${R.name}`, { bg: 0x7a3a8a, color: '#ffffff', w: 60 }));
        this.noticeAreas.push({ x: d[0], y: d[1] - 2, text: `관악로지스 빌딩 4층 "${R.name}". ${R.pitch}` });
      }
      // 봉천 지부 간판
      if (s.branch?.open && this.district === 'bongcheon') {
        const d = app.gB.places.b_branch.door;
        this.notices.add(wallNotice(this, d[0] * T + 8, (d[1] - 3) * T, `2층 ${s.leader.cultName} 봉천`, { bg: 0xe9e2c8, color: '#3a2a1a', w: 60 }));
      }
    }
    // 말풍선: 교주 근처(12칸)에서만 들린다
    const [px, py] = this.walker.tile;
    const hear = (id) => { const p = s.pos[id]; const sp = this.sprites[id]; return p && sp?.visible && Math.abs(p.x - px) + Math.abs(p.y - py) <= 12; };
    const once = (k, fn) => { if (!this.seenTalk[k]) { this.seenTalk[k] = true; fn(); } };
    const q = s.reporter?.lastQ;
    if (q && hear('x:reporter')) once(`r${s.day}:${q.minute}`, () => { this.say('x:reporter', REPORTER_INFO.questions[q.q], time); if (hear(q.id)) this.say(q.id, REPORTER_INFO.answers[q.a], time + 2200); });
    const d = s.defectorTalk;
    if (d && hear(d.id)) once(`d${s.day}:${d.minute}`, () => this.say(d.id, d.line, time));
    const v = s.rivalTalk;
    if (v && hear(v.walker)) once(`v${s.day}:${v.minute}`, () => this.say(v.walker, v.act, time));
  }
  say(id, text, at) { this.bubbles.push({ id, text, at, c: null }); }
  updateBubbles(time) {
    for (const b of this.bubbles) {
      const sp = this.sprites[b.id];
      if (!b.c && time >= b.at) { b.c = speechBubble(this, text2(speak(app.s, b.text))); b.until = time + MOOD.bubbleSeconds * 1000 + 600; }
      if (b.c && sp) b.c.setPosition(sp.x + 8, sp.y - 10).setDepth(5085).setVisible(sp.visible);
    }
    this.bubbles = this.bubbles.filter((b) => { if (b.c && time > b.until) { b.c.destroy(); return false; } return true; });
    if (this.picketC) {
      const sp = this.sprites[this.picketC.pid];
      if (sp) this.picketC.setPosition(sp.x + 8, sp.y - 2).setDepth(5075).setVisible(sp.visible);
      else this.picketC.setVisible(false);
    }
  }

  // 기자 시야에 들어가면 따라온다. 6초 동안 시야 밖에 있으면 놓친다. 붙잡히면 인터뷰
  watchReporter(dt, free) {
    const s = app.s;
    const R = s.reporter;
    const pos = s.pos['x:reporter']; const sp = this.sprites['x:reporter'];
    if (!R?.active || !pos || !sp?.visible || !free) return;
    const [px, py] = this.walker.tile;
    const dist = Math.abs(pos.x - px) + Math.abs(pos.y - py);
    // 시야를 땅에 옅게 그린다
    const [fx, fy] = FWD[pos.dir ?? 'down'];
    if (!R.interviewed) {
      this.fx.fillStyle(R.chase ? 0xffa040 : 0xfff0a0, R.chase ? 0.16 : 0.12);
      for (let f = 1; f <= REPORTER.sight.tiles - sightCut(s); f++) for (let l = -1; l <= 1; l++) this.fx.fillRect((pos.x + fx * f + fy * l) * T, (pos.y + fy * f + fx * l) * T, T, T);
    }
    if (!R.chase) {
      if (!R.interviewed && s.minute - R.evadedAt > 40 && inSight(pos, px, py)) {
        R.chase = true; this.lostT = 0;
        toast(`${REPORTER_INFO.name} 기자: ${REPORTER_INFO.chase}`, 'warn');
        this.say('x:reporter', '"잠깐만요!"', this.time.now);
      }
      return;
    }
    if (inSight(pos, px, py) || dist <= 2) this.lostT = 0; else this.lostT += dt;
    if (this.lostT >= REPORTER.sight.loseSeconds) { R.chase = false; toast(REPORTER_INFO.lost); return; }
    if (dist <= 1) app.talkTo('x:reporter');
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
    const line = speak(s, gossipLine(s, id, this.sprites[id].neighbor));
    hear(s, id, line, lastGossip);                        // 수첩 '엿들은 소문' · 엿들은 고민은 대화 선택지로
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
    if (who) { app.showProfile(who, () => this.walker.chase(() => this.tileOf(who), () => app.talkTo(who), () => { const sp = this.sprites[who]; return sp ? [sp.x + 8, sp.y + 14] : null; })); return; }
    const D = this.directory;
    if (D && tx >= D.x0 && tx <= D.x1 && ty >= D.y0 && ty <= D.y1) { toast(D.text, '', 6000); return; }
    const n = this.noticeAreas?.find((a) => Math.abs(a.x - tx) <= 2 && Math.abs(a.y - ty) <= 1);
    if (n) { toast(n.text, '', 6000); return; }
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
    // 큰 날 행사 자리 (행사 시간에, 아직 안 했으면)
    if (this.bigDayTile && bigDayActive(app.s) && !bigDayDone(app.s)) {
      const [bx, by] = this.bigDayTile;
      if (Math.abs(bx - tx) + Math.abs(by - ty) <= 3) return { kind: 'bigday', id: `big:${this.bigDay.id}` };
    }
    for (const place of ['market', 'park', 'station', 'stream', 'b_station', 'b_food', 'b_park']) {
      const d = app.here().places[place]?.door;
      if (d && Math.abs(d[0] - tx) + Math.abs(d[1] - ty) <= 1) return { kind: 'door', place };
    }
    return null;
  }

  update(time, delta) {
    const s = app.s;
    if (!s) return;
    const dt = Math.min(delta, 100) / 1000;
    const free = app.modal === 0 && s.mode === 'day';
    if (free && app.speed > 0) app.advance(dt * CLOCK.minutesPerSecond * app.speed * app.clockRate());
    this.walker.update(dt, free);
    this.walker.takeFatigue(s);
    s.leaderTile = this.walker.tile;
    this.placePeople(time, dt);
    this.watchReporter(dt, free);
    this.updateBubbles(time);
    app.checkPlaceVisit(this.walker.tile);

    const near = free ? this.findNear() : null;
    const key = near ? near.id ?? near.place ?? `shop:${near.b?.i}` : null;
    if (key !== this.nearKey) { this.nearKey = key; this.near = near; app.setNearAction(near); }

    this.moodTimer += delta;
    if (this.moodTimer > 500) {
      const on = !!bigDayActive(s);
      for (const sp of this.bigDayExtras ?? []) sp.setVisible(on);
    }
    if (this.moodTimer > 500) { this.moodTimer = 0; this.refreshOverlays(); this.refreshThreats(time); this.zealotTalk(time); }
    this.gossipTimer += delta;
    if (this.gossip && time > this.gossip.until) { this.gossip.c.destroy(); this.gossip = null; }
    if (this.gossipTimer > MOOD.gossipEverySeconds * 1000 && free) { this.gossipTimer = 0; this.tryGossip(); }

    const tint = tintAt(s.minute);
    this.tintRect.setFillStyle(s.weather?.rain ? Phaser.Display.Color.ValueToColor(tint.color).darken(20).color : tint.color, tint.alpha + (s.weather?.rain ? 0.12 : 0));

    this.hudTimer += delta;
    if (this.hudTimer > 200) { this.hudTimer = 0; app.hud?.update(); }
  }
}
