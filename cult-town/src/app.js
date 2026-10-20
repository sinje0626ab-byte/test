// 앱 제어: 상태(app.s) · 씬 전환 · 시간 흐름 · DOM UI 연결. 게임 규칙은 전부 sim/ 에 있다.
import townMap from './map/town.json';
import sanctMap from './map/sanctuary.json';
import { CLOCK, SANCTUARY } from './config.js';
import { PLACES } from './data/places.js';
import { RESIDENT_BY_ID } from './data/residents.js';
import { CLERGY } from './data/clergy.js';
import { CAST } from './data/cast.js';
import { LEADER_TONE } from './data/lines.js';
import { gridFromMap } from './sim/grid.js';
import { newGame } from './sim/state.js';
import { startDay, endDay } from './sim/week.js';
import { tickPeople, snapAll } from './sim/residents.js';
import { isMonthEnd, fmtTime } from './sim/clock.js';
import { tone } from './sim/leader.js';
import { pick } from './sim/rng.js';
import { saveGame, loadGame, clearSave } from './sim/save.js';
import { portrait as makePortrait, LEADER_LOOK } from './game/people.js';
import { createHud } from './ui/hud.js';
import { showTitle, hideTitle, showCreation } from './ui/creation.js';
import { openTalk, openClergyTalk } from './ui/dialog.js';
import { openProfile, closeProfile } from './ui/profile.js';
import { openNight, openLandlord } from './ui/night.js';
import { eventLines, showMorning, showBulletin, showEnding, showCredits, showMenu } from './ui/screens.js';
import { toast } from './ui/toast.js';
import { play } from './ui/sound.js';
import { $ui, unmount } from './ui/dom.js';

const CLERGY_BY_ID = Object.fromEntries(CLERGY.map((c) => [c.id, c]));

export const app = {
  s: null,
  g: gridFromMap(townMap),
  sg: gridFromMap(sanctMap),
  game: null,
  hud: null,
  speed: 1,
  modal: 0,
  near: null,
  saveTimer: 0,

  onBoot(game) {
    this.game = game;
    window.addEventListener('keydown', (e) => this.onKey(e));
    this.toTitle();
  },

  toTitle() {
    if (this.s && this.s.mode !== 'over') saveGame(this.s);
    this.s = null;
    this.modal = 0;
    for (const id of ['hud', 'actionbar', 'dialog', 'profile', 'night', 'menu']) unmount(id);
    this.hud = null;
    this.game.scene.getScenes(true).forEach((sc) => { if (sc.scene.key !== 'boot') sc.scene.stop(); });
    const saved = loadGame();
    showTitle({
      hasSave: !!saved,
      onNew: () => { clearSave(); hideTitle(); showCreation((pick) => this.startNew(pick), () => this.toTitle()); },
      onContinue: () => { hideTitle(); this.resume(loadGame()); },
      onCredits: () => showCredits(() => {}),
    });
  },

  startNew(pick) {
    const s = newGame({ leaderName: pick.name, age: pick.age, family: pick.family, sect: pick.sect, cultName: pick.cultName, seed: (Date.now() % 1e9) | 0 });
    startDay(s, this.g);
    this.s = s;
    saveGame(s);
    this.hud = createHud(this);
    this.goTown('start');
    const t = LEADER_TONE.neutral.morning[0];
    setTimeout(() => toast(`${s.leader.name}: ${t}`), 600);
    setTimeout(() => toast('사람을 누르면 프로필이 보인다. 가까이 가서 말을 걸자. 수요일·일요일 밤에는 예배.'), 1600);
  },

  resume(s) {
    if (!s) return this.toTitle();
    this.s = s;
    this.hud = createHud(this);
    if (s.mode === 'night') { this.goSanctuary(); this.openNightMenu(); }
    else { snapAll(s, this.g); this.goTown('start'); }
  },

  scene() {
    return this.game.scene.getScenes(true).find((sc) => sc.scene.key !== 'boot') ?? null;
  },
  goTown(entry) {
    this.game.scene.stop('sanctuary');
    this.game.scene.start('town', { entry });
    this.setNearAction(null);
    this.updateExtra();
  },
  goSanctuary() {
    this.game.scene.stop('town');
    this.game.scene.start('sanctuary');
    this.setNearAction(null);
    this.updateExtra();
  },

  // ── 시간 ──
  advance(dMin) {
    const s = this.s;
    if (s.mode !== 'day') return;
    let left = dMin;
    while (left > 0) {
      const step = Math.min(1, left);
      const before = s.minute;
      s.minute += step;
      tickPeople(s, this.g, step);
      if (before < CLOCK.dayEnd && s.minute >= CLOCK.dayEnd) { toast('21시. 동네가 문을 닫는다. 302호로 돌아가자.', 'warn'); play('error'); }
      if (s.minute >= CLOCK.forceHome) { this.forceNight(); return; }
      left -= step;
    }
    this.saveTimer += dMin;
    if (this.saveTimer > 60) { this.saveTimer = 0; saveGame(s); }
  },
  setSpeed(n) { this.speed = n; play('click'); this.hud?.update(); },

  forceNight() {
    const s = this.s;
    s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + 30;
    toast('22시. 다리를 끌고 302호로 돌아왔다. 내일 많이 피곤하겠다.', 'bad', 5000);
    this.goNight();
  },
  goNight() {
    const s = this.s;
    for (const id of ['dialog', 'profile']) unmount(id);
    this.modal = 0;
    s.minute = Math.max(s.minute, CLOCK.dayEnd);
    s.mode = 'night';
    saveGame(s);
    if (this.scene()?.scene.key !== 'sanctuary') this.goSanctuary();
    else { this.scene().refreshFurniture(); this.updateExtra(); }
    this.openNightMenu();
  },
  openNightMenu() {
    this.modalOpened();
    openNight(this);
  },

  sleep() {
    const s = this.s;
    play('page');
    const finish = (rentChoice) => {
      const r = endDay(s, this.g, { rentChoice });
      this.modal = 0;
      if (r.over) {
        clearSave();
        const after = () => showEnding(s, r.over, { onTitle: () => { this.s = null; this.toTitle(); } });
        showMorning(s, eventLines(s, r.events), () => (r.bulletin ? showBulletin(s, r.bulletin, after) : after()));
        return;
      }
      saveGame(s);
      this.modalOpened();
      const morning = () => {
        this.modal = 0;
        this.goTown('sanctuary');
        play('door');
        toast(`${s.leader.name}: ${pick(s, LEADER_TONE[tone(s)].morning)}`);
      };
      showMorning(s, eventLines(s, r.events), () => (r.bulletin ? showBulletin(s, r.bulletin, morning) : morning()));
    };
    if (isMonthEnd(s.day) && s.leader.money < SANCTUARY.rent) openLandlord(this, finish);
    else finish('promise');
  },

  // ── 상호작용 ──
  setNearAction(near) {
    this.near = near;
    if (!this.hud) return;
    if (!near) return this.hud.setAction(null);
    if (near.kind === 'person') {
      const name = near.id.startsWith('c:') ? `${CLERGY_BY_ID[near.id.slice(2)].name} ${CLERGY_BY_ID[near.id.slice(2)].title}` : RESIDENT_BY_ID[near.id].name;
      this.hud.setAction(`말 걸기 · ${name}`, () => this.talkTo(near.id));
    } else if (near.kind === 'door') {
      const p = PLACES[near.place];
      this.hud.setAction(near.place === 'sanctuary' ? '302호로 올라가기' : `살펴보기 · ${p.short}`, () => this.useDoor(near.place));
    } else if (near.kind === 'exit') {
      this.hud.setAction(this.s.mode === 'night' ? null : '계단 내려가기', () => this.leaveSanctuary());
      if (this.s.mode === 'night') this.hud.setAction(null);
    }
  },
  actionKey() {
    if (this.modal > 0) return;
    const n = this.near;
    if (!n) return;
    if (n.kind === 'person') this.talkTo(n.id);
    else if (n.kind === 'door') this.useDoor(n.place);
    else if (n.kind === 'exit') this.leaveSanctuary();
  },
  talkTo(id) {
    if (this.modal > 0 || this.s.mode !== 'day') return;
    closeProfile();
    this.scene()?.walker?.stop();
    if (id.startsWith('c:')) openClergyTalk(this, id.slice(2));
    else openTalk(this, id);
  },
  showProfile(id, onTalk) { openProfile(this, id, { onTalk }); },
  useDoor(place) {
    if (place === 'sanctuary') {
      play('door');
      saveGame(this.s);
      this.goSanctuary();
      if (this.s.minute >= CLOCK.dayEnd) this.goNight();
      return;
    }
    const p = PLACES[place];
    toast(`${p.name}. ${p.desc}`);
  },
  leaveSanctuary() {
    if (this.s.mode !== 'day') return;
    if (this.s.minute >= CLOCK.dayEnd) { toast('밤이다. 오늘은 여기까지.'); return; }
    play('door');
    this.goTown('sanctuary');
  },
  afterTalk() { saveGame(this.s); this.hud?.update(); },
  refresh() { this.hud?.update(); },

  // 성소 안에서만 보이는 작은 버튼: 낮엔 '하루 마치기', 밤엔 '밤 메뉴'
  updateExtra() {
    if (!this.hud) return;
    const inSanct = this.scene()?.scene.key === 'sanctuary' || this.game.scene.isActive('sanctuary') || this.game.scene.isSleeping('sanctuary');
    const s = this.s;
    if (s.mode === 'night') this.hud.setExtra('밤 메뉴', () => this.openNightMenu());
    else if (inSanct) this.hud.setExtra('하루 마치기 (밤으로)', () => {
      if (s.minute < 17 * 60) toast(`아직 ${fmtTime(s.minute)}. 지금 마치면 남은 낮은 그냥 지나간다.`, 'warn');
      this.goNight();
    });
    else this.hud.setExtra(null);
  },

  modalOpened() { this.modal++; },
  modalClosed() { this.modal = Math.max(0, this.modal - 1); },
  openMenu() { showMenu(this); },

  portrait(id) {
    const img = this.game.textures.get('urban').getSourceImage();
    let look;
    if (id === 'leader') look = LEADER_LOOK;
    else if (id.startsWith('c:')) look = CLERGY_BY_ID[id.slice(2)].look;
    else if (id.startsWith('cast:')) look = CAST.find((c) => `cast:${c.id}` === id).look;
    else look = RESIDENT_BY_ID[id].look;
    return makePortrait(img, id, look);
  },

  onKey(e) {
    if (!this.s || e.target.tagName === 'INPUT') return;
    if (e.key === 'Escape') {
      if ($ui().querySelector('[data-id="profile"]')) { closeProfile(); return; }
      if (this.modal === 0) this.openMenu();
    }
    if (this.modal > 0) return;
    if (e.key === 'p' || e.key === 'P') this.setSpeed(this.speed ? 0 : 1);
    if (e.key === '1') this.setSpeed(1);
    if (e.key === '2') this.setSpeed(2);
  },
};

