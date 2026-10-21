// 앱 제어: 상태(app.s) · 씬 전환 · 시간 흐름 · DOM UI 연결. 게임 규칙은 전부 sim/ 에 있다.
import townMap from './map/town.json';
import bongcheonMap from './map/bongcheon.json';
import { CLOCK, OFFICERS, PHASE4 } from './config.js';
import { BRANCH_TEXT } from './data/branch.js';
import { PLACES } from './data/places.js';
import { SHOPS } from './data/shops.js';
import { RESIDENT_BY_ID } from './data/residents.js';
import { ALL_CLERGY } from './data/clergy.js';
import { CAST } from './data/cast.js';
import { LEADER_TONE } from './data/lines.js';
import { gridFromMap, registerGrid } from './sim/grid.js';
import { newGame } from './sim/state.js';
import { startDay, endDay } from './sim/week.js';
import { tickPeople, snapAll } from './sim/residents.js';
import { isMonthEnd, fmtTime } from './sim/clock.js';
import { tone } from './sim/leader.js';
import { pick } from './sim/rng.js';
import { saveGame, loadGame, clearSave } from './sim/save.js';
import { rentNow } from './sim/space.js';
import { visitPlace } from './sim/stories.js';
import { streetTick } from './sim/officers.js';
import { threatHour, setThreatGrid, isProtester, isDefector } from './sim/threats.js';
import { REPORTER_INFO } from './data/threats.js';
import { RIVAL_LOOKS } from './data/rival.js';
import { openInterview, openProtest, openDefector, rivalHello, nameForNpc } from './ui/threats.js';
import { mapsForStep } from './map/interiors.js';
import { portrait as makePortrait, LEADER_LOOK } from './game/people.js';
import { createHud } from './ui/hud.js';
import { showTitle, hideTitle, showCreation } from './ui/creation.js';
import { openTalk, openClergyTalk } from './ui/dialog.js';
import { openProfile, closeProfile } from './ui/profile.js';
import { openNight, openLandlord } from './ui/night.js';
import { eventLines, showMorning, showBulletin, showEnding, showCredits, showMenu, showPhaseUp } from './ui/screens.js';
import { openShop, openNotebook } from './ui/shop.js';
import { showEvent } from './ui/event.js';
import { showRevelation } from './ui/revelation.js';
import { createDpad } from './ui/dpad.js';
import { toast } from './ui/toast.js';
import { play } from './ui/sound.js';
import { $ui, unmount, h } from './ui/dom.js';
import { fill } from './ui/text.js';

const CLERGY_BY_ID = Object.fromEntries(ALL_CLERGY.map((c) => [c.id, c]));
const CAST_BY = Object.fromEntries(CAST.map((c) => [c.id, c]));
const interiors = import.meta.glob('./map/sanctuary-*.json', { eager: true, import: 'default' });
const interiorGrids = {};
for (const [path, json] of Object.entries(interiors)) interiorGrids[path.match(/sanctuary-(\w+)\.json/)[1]] = gridFromMap(json);
const SHOP_PLACES = ['cvs', 'market', 'pharmacy', 'b_cvs'];
const STATIONS = ['station', 'b_station'];

export const app = {
  s: null,
  g: gridFromMap(townMap),                 // 신림동 (시뮬레이션 기준 격자)
  gB: gridFromMap(bongcheonMap),           // 4단계 봉천동
  district() { return this.s?.district ?? 'sillim'; },
  here() { return this.district() === 'bongcheon' ? this.gB : this.g; },
  game: null,
  hud: null,
  speed: 1,
  modal: 0,
  near: null,
  saveTimer: 0,
  floor: 3,
  dpad: {},
  running: false,

  gridFor(id) { return interiorGrids[id]; },
  init() { setThreatGrid(this.g); registerGrid('sillim', this.g); registerGrid('bongcheon', this.gB); },

  // ── 뒤로 (Esc · 오른쪽 클릭): 화면마다 지금의 '한 단계 뒤로' 함수를 등록한다. 마지막에 등록된 것부터 ──
  backs: new Map(),
  setBack(key, fn) { this.backs.delete(key); if (fn) this.backs.set(key, fn); },
  back() {
    const keys = [...this.backs.keys()];
    while (keys.length) {
      const k = keys.pop();
      if (!document.querySelector(`#ui [data-id="${k}"]`)) { this.backs.delete(k); continue; }
      this.backs.get(k)();
      return true;
    }
    return false;
  },

  onBoot(game) {
    this.game = game;
    this.init();
    window.addEventListener('keydown', (e) => this.onKey(e));
    window.addEventListener('keyup', (e) => { if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.running = false; });
    window.addEventListener('contextmenu', (e) => { if (!this.s) return; e.preventDefault(); this.back(); });
    createDpad(this);
    this.toTitle();
  },

  toTitle() {
    if (this.s && this.s.mode !== 'over') saveGame(this.s);
    this.s = null;
    this.modal = 0;
    for (const id of ['hud', 'actionbar', 'dialog', 'profile', 'night', 'menu']) unmount(id);
    this.hud = null;
    this.setWeatherFx(null);
    this.game.scene.getScenes(true).forEach((sc) => { if (sc.scene.key !== 'boot') sc.scene.stop(); });
    this.game.scene.start('title');
    const saved = loadGame();
    showTitle({
      hasSave: !!saved,
      onNew: () => { clearSave(); hideTitle(); showCreation((p) => this.startNew(p), () => this.toTitle()); },
      onContinue: () => { hideTitle(); this.resume(loadGame()); },
      onCredits: () => showCredits(() => {}),
    });
  },

  startNew(p) {
    const s = newGame({ leaderName: p.name, age: p.age, family: p.family, sect: p.sect, cultName: p.cultName, seed: (Date.now() % 1e9) | 0 });
    startDay(s, this.g);
    this.s = s;
    this.floor = 3;
    saveGame(s);
    this.hud = createHud(this);
    this.goTown('start');
    setTimeout(() => toast(`${s.leader.name}: ${LEADER_TONE.neutral.morning[0]}`), 600);
    setTimeout(() => toast('사람을 누르면 프로필이 보인다. 머리 위 "휴" 말풍선은 고민이 큰 사람. 수요일·일요일 밤에는 예배.'), 1600);
  },

  resume(s) {
    if (!s) return this.toTitle();
    this.s = s;
    this.floor = 3;
    this.hud = createHud(this);
    if (s.mode === 'night') { this.goSanctuary(); this.openNightMenu(); }
    else { snapAll(s, this.g); this.goTown('start'); this.maybeEvent(); }
  },

  scene() {
    return this.game.scene.getScenes(true).find((sc) => !['boot', 'title'].includes(sc.scene.key)) ?? null;
  },
  goTown(entry) {
    this.game.scene.stop('title');
    this.game.scene.stop('sanctuary');
    this.game.scene.start('town', { entry });
    this.setNearAction(null);
    this.updateExtra();
    this.dpadShow(true);
  },
  goSanctuary(entry = 'door') {
    this.game.scene.stop('title');
    this.game.scene.stop('town');
    this.game.scene.stop('sanctuary');
    this.game.scene.start('sanctuary', { entry });
    this.setNearAction(null);
    this.updateExtra();
    this.setWeatherFx(null);
  },
  useStairs(to) {
    const floors = mapsForStep(this.s.space.step);
    if (!floors[to]) { toast(`${to}층은 아직 남의 사무실이다. 밤 메뉴 '공간·방'에서 임대할 수 있다.`); return; }
    play('door');
    this.floor = to;
    this.goSanctuary('stairs');
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
      const hour = Math.floor(s.minute / 60);
      if (s.phase >= 2 && Math.floor(before / 60) !== hour && hour >= OFFICERS.street.startHour && hour < OFFICERS.street.endHour) {
        for (const e of streetTick(s)) if (e.type === 'slip' && Math.random() < 0.5) toast(e.text, 'warn');
      }
      if (s.phase >= 3 && Math.floor(before / 60) !== hour) threatHour(s, this.g, hour);
      if (before < CLOCK.dayEnd && s.minute >= CLOCK.dayEnd) { toast(s.district === 'bongcheon' ? BRANCH_TEXT.nightB : '21시. 동네가 문을 닫는다. 302호로 돌아가자.', 'warn'); play('error'); }
      if (s.minute >= CLOCK.forceHome) { this.forceNight(); return; }
      left -= step;
    }
    this.saveTimer += dMin;
    if (this.saveTimer > 60) { this.saveTimer = 0; saveGame(s); }
  },
  setSpeed(n) { this.speed = n; play('click'); this.hud?.update(); },

  forceNight() {
    const s = this.s;
    s.district = 'sillim';
    s.leader.nightFatigue = (s.leader.nightFatigue ?? 0) + 30;
    toast('22시. 다리를 끌고 302호로 돌아왔다. 내일 많이 피곤하겠다.', 'bad', 5000);
    this.floor = 3;
    this.goNight();
  },
  goNight() {
    const s = this.s;
    s.district = 'sillim';
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
      const lines = eventLines(s, r.events);
      if (r.over) {
        clearSave();
        const after = () => showEnding(s, r.over, { onTitle: () => { this.s = null; this.toTitle(); } });
        showMorning(s, lines, () => (r.bulletin ? showBulletin(s, r.bulletin, after) : after()));
        return;
      }
      saveGame(s);
      this.modalOpened();
      const morning = () => {
        this.modal = 0;
        this.floor = 3;
        s.district = 'sillim';
        this.goTown('sanctuary');
        play('door');
        toast(`${s.leader.name}: ${pick(s, LEADER_TONE[tone(s)].morning)}`);
        if (s.weather.rain) toast('비가 온다. 공원·산책로에 사람이 없다. 우산을 씌워 주면 좋아한다.');
        if (s.weather.market) toast('오늘은 토요일 장날. 시장에 사람이 많다.');
        this.maybeEvent();
      };
      const reveal = () => (r.revelation ? showRevelation(s, r.revelation, () => { saveGame(s); morning(); }) : morning());
      const phase = () => (r.phaseUp ? showPhaseUp(s, r.phaseUp, () => { saveGame(s); reveal(); }) : reveal());
      showMorning(s, lines, () => (r.bulletin ? showBulletin(s, r.bulletin, phase) : phase()));
    };
    if (isMonthEnd(s.day) && s.leader.money < rentNow(s)) openLandlord(this, finish);
    else finish('promise');
  },
  maybeEvent() {
    if (this.s?.events.pending) setTimeout(() => showEvent(this), 400);
  },

  // ── 날씨 (비는 DOM 위 빗줄기) ──
  setWeatherFx(w) {
    let el = document.getElementById('rain');
    if (w?.rain) {
      if (!el) { el = h('div', { id: 'rain' }); document.body.append(el); }
    } else el?.remove();
  },

  // ── 상호작용 ──
  setNearAction(near) {
    this.near = near;
    if (!this.hud) return;
    if (!near) return this.hud.setAction(null);
    if (near.kind === 'person') {
      const id = near.id;
      const npc = id.startsWith('x:') || id.startsWith('v:');
      const name = id.startsWith('c:') ? `${CLERGY_BY_ID[id.slice(2)].name} ${CLERGY_BY_ID[id.slice(2)].title}` : id.startsWith('o:') ? CAST_BY[id.slice(2)].name : npc ? nameForNpc(this.s, id) : RESIDENT_BY_ID[id].name;
      const verb = id === 'x:reporter' ? '인터뷰 받기' : id.startsWith('o:') || id.startsWith('v:') ? '인사' : isProtester(this.s, id) ? '피켓 앞으로' : isDefector(this.s, id) ? '다가가기' : '말 걸기';
      this.hud.setAction(`${verb} · ${name}`, () => this.talkTo(id));
    } else if (near.kind === 'door') {
      const p = PLACES[near.place];
      const label = near.place === 'sanctuary' ? '302호로 올라가기' : STATIONS.includes(near.place) && this.s.phase >= 4 ? `2호선 타기 · ${near.place === 'station' ? '서울대입구역으로' : '신림역으로'}`
        : near.place === 'b_branch' ? `${this.s.branch.open ? '들어가기' : '살펴보기'} · 봉천프라자 2층` : SHOP_PLACES.includes(near.place) ? `들어가기 · ${p.short}` : `살펴보기 · ${p.short}`;
      this.hud.setAction(label, () => this.useDoor(near.place));
    } else if (near.kind === 'shop') {
      this.hud.setAction(`살펴보기 · ${SHOPS[near.b.shop].name}`, () => this.lookShop(near.b));
    } else if (near.kind === 'exit') {
      this.hud.setAction(this.s.mode === 'night' ? null : '계단 내려가기', () => this.leaveSanctuary());
    } else if (near.kind === 'stairs') {
      this.hud.setAction(`${near.to}층으로`, () => this.useStairs(near.to));
    }
  },
  actionKey() {
    if (this.modal > 0) return;
    const n = this.near;
    if (!n) return;
    if (n.kind === 'person') this.talkTo(n.id);
    else if (n.kind === 'door') this.useDoor(n.place);
    else if (n.kind === 'shop') this.lookShop(n.b);
    else if (n.kind === 'exit') this.leaveSanctuary();
    else if (n.kind === 'stairs') this.useStairs(n.to);
  },
  talkTo(id) {
    if (this.modal > 0 || this.s.mode !== 'day') return;
    closeProfile();
    this.scene()?.walker?.stop();
    if (id.startsWith('o:')) {
      const c = CAST_BY[id.slice(2)];
      toast(`${c.name}: "${['오늘 벌써 세 명한테 말 걸었어.', '다리 아프다. 그래도 한 바퀴 더 돌게.', '시장 사람들이 나를 알아보기 시작했어.'][this.s.day % 3]}"`);
      return;
    }
    if (id === 'x:reporter') { this.s.reporter.chase = false; openInterview(this); return; }
    if (id.startsWith('v:')) { rivalHello(this, id); return; }
    if (id.startsWith('c:')) openClergyTalk(this, id.slice(2));
    else if (isProtester(this.s, id)) openProtest(this, id);
    else if (isDefector(this.s, id)) openDefector(this, id);
    else openTalk(this, id);
  },
  showProfile(id, onTalk) { openProfile(this, id, { onTalk }); },
  useDoor(place) {
    this.visitAt(place);
    if (place === 'sanctuary') {
      play('door');
      saveGame(this.s);
      this.floor = 3;
      this.goSanctuary();
      if (this.s.minute >= CLOCK.dayEnd) this.goNight();
      return;
    }
    if (SHOP_PLACES.includes(place)) { openShop(this, place); return; }
    if (STATIONS.includes(place) && this.s.phase >= 4) { this.subway(); return; }
    if (place === 'b_branch') { toast(this.s.branch.open ? fill(BRANCH_TEXT.doorOpen, this.s) : `${BRANCH_TEXT.door} (${BRANCH_TEXT.closedHint})`, '', 6000); return; }
    const p = PLACES[place];
    toast(`${p.name}. ${p.desc}`);
  },
  // 2호선: 신림역 ↔ 서울대입구역 (게임 20분, 1,400원). 그동안 동네 시간은 흐른다
  subway() {
    const s = this.s;
    if (s.mode !== 'day') return;
    if (s.minute >= CLOCK.dayEnd) { this.goNight(); return; }
    play('door');
    this.advance(PHASE4.subway.minutes);
    if (s.mode !== 'day') return;
    s.leader.money -= PHASE4.subway.fare;
    s.district = s.district === 'bongcheon' ? 'sillim' : 'bongcheon';
    saveGame(s);
    this.goTown('station');
    toast(s.district === 'bongcheon' ? BRANCH_TEXT.arriveB : BRANCH_TEXT.arriveS, '', 5000);
  },
  lookShop(b) {
    const sh = SHOPS[b.shop];
    if (sh) toast(`${sh.name}. ${sh.desc}`);
  },
  // 장소 부탁: 그 장소 입구 근처에 가면 다녀온 것으로 친다
  visitAt(place) {
    for (const d of visitPlace(this.s, place)) {
      toast(`${d.note} (${RESIDENT_BY_ID[d.id].name}의 부탁: 돌아가서 알려 주자)`, '', 6000);
      play('confirm');
    }
  },
  checkPlaceVisit([tx, ty]) {
    const s = this.s;
    for (const st of Object.values(s.res)) {
      const f = st.story?.favor;
      if (!f || f.type !== 'place' || f.visited) continue;
      const d = this.here().places[f.place]?.door;
      if (d && Math.abs(d[0] - tx) + Math.abs(d[1] - ty) <= 1) this.visitAt(f.place);
    }
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
    const s = this.s;
    const inSanct = this.game.scene.isActive('sanctuary') || this.scene()?.scene.key === 'sanctuary';
    if (s.mode === 'night') this.hud.setExtra('밤 메뉴', () => this.openNightMenu());
    else if (inSanct) this.hud.setExtra('하루 마치기 (밤으로)', () => {
      if (s.minute < 17 * 60) toast(`아직 ${fmtTime(s.minute)}. 지금 마치면 남은 낮은 그냥 지나간다.`, 'warn');
      this.goNight();
    });
    else this.hud.setExtra(null);
  },
  openNotebook() { openNotebook(this); },

  modalOpened() { this.modal++; this.dpadShow(false); },
  modalClosed() { this.modal = Math.max(0, this.modal - 1); if (!this.modal) this.dpadShow(true); },
  dpadShow(on) { const el = document.querySelector('.dpad'); if (el) el.classList.toggle('hidden', !on || !this.s); },
  openMenu() { showMenu(this); },

  portrait(id) {
    const img = this.game.textures.get('urban').getSourceImage();
    let look;
    if (id === 'leader') look = LEADER_LOOK;
    else if (id.startsWith('c:')) look = CLERGY_BY_ID[id.slice(2)].look;
    else if (id.startsWith('cast:') || id.startsWith('o:')) look = CAST_BY[id.split(':')[1]].look;
    else if (id === 'x:reporter') look = REPORTER_INFO.look;
    else if (id.startsWith('v:')) look = RIVAL_LOOKS[id.slice(2)];
    else look = RESIDENT_BY_ID[id].look;
    return makePortrait(img, id, look);
  },

  // 단축키는 e.code 로 본다 (한글 입력 상태에서도 같은 자리의 키)
  onKey(e) {
    if (!this.s || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.running = true;
    if (e.code === 'Escape') {
      if (this.back()) return;
      if (this.modal === 0) this.openMenu();
      return;
    }
    if (this.modal > 0) return;
    if (e.code === 'Backquote') { e.preventDefault(); this.setSpeed(0); }
    if (e.code === 'Digit1') this.setSpeed(1);
    if (e.code === 'Digit2') this.setSpeed(2);
    if (e.code === 'KeyN') this.openNotebook();
  },
};
