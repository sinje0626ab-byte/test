// 앱 제어: 상태(app.s) · 씬 전환 · 시간 흐름 · DOM UI 연결. 게임 규칙은 전부 sim/ 에 있다.
import { levelOf } from './sim/growth.js';
import { pollRewards, checkAchievements, noteVisit } from './sim/achievements.js';
import { showReward, showAchievement, showLevelUp } from './ui/celebrate.js';
import townMap from './map/town.json';
import bongcheonMap from './map/bongcheon.json';
import { CLOCK, OFFICERS, PHASE4, GROWTH, OPENING } from './config.js';
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
import { isRentDay as isMonthEnd, fmtTime, season, holidayOf, dayOfMonth, fmtDate, tempAt, skyName, isWorshipDay } from './sim/clock.js';
import { emotionOf } from './sim/mood.js';
import { tone } from './sim/leader.js';
import { pick } from './sim/rng.js';
import { saveGame, loadGame, clearSave } from './sim/save.js';
import { rentNow } from './sim/space.js';
import { visitPlace } from './sim/stories.js';
import { streetTick } from './sim/officers.js';
import { threatHour, setThreatGrid, isProtester, isDefector } from './sim/threats.js';
import { openInterview, openProtest, openDefector, rivalHello, nameForNpc } from './ui/threats.js';
import { mapsForStep } from './map/interiors.js';
import { portrait as makePortrait, setSeason, setLeaderStage } from './game/people.js';
import { createHud } from './ui/hud.js';
import { showCreation } from './ui/creation.js';
import { memberCount } from './sim/faith.js';
import { showTitle, hideTitle } from './ui/title.js';
import { installArcade } from './ui/arcade.js';
import { openTalk, openClergyTalk } from './ui/dialog.js';
import { openProfile, closeProfile } from './ui/profile.js';
import { openNight, openLandlord } from './ui/night.js';
import { eventLines, showMorning, showBulletin, showEnding, showCredits, showMenu, showPhaseUp } from './ui/screens.js';
import { openShop } from './ui/shop.js';
import { openNotebook, showQuestNews, dailyName } from './ui/notebook.js';
import { visitSpot, questMarkers, checkQuests } from './sim/quests.js';
import { cutin } from './ui/cutin.js';
import { openingPanel } from './ui/opening.js';
import { showSpeaker, hideSpeaker } from './game/speaker.js';
import { bigDayOf, bigDayAct } from './sim/bigdays.js';
import { BIGDAY_TEXT, BIGDAY_UI } from './data/bigdays.js';
import { OPENING as OPENING_TEXT } from './data/opening.js';
import { isOpeningDay, openingDone, openingSign, openingTong, openingMinho, openingVisitor } from './sim/opening.js';
import { canStreetSermon, streetSermon } from './sim/growth.js';
import { GROWTH_TEXT } from './data/growth.js';
import { sameFamily } from './sim/talk.js';
import { showEvent } from './ui/event.js';
import { showRevelation } from './ui/revelation.js';
import { createDpad } from './ui/dpad.js';
import { toast, setToastGate, clearToasts } from './ui/toast.js';
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
    installArcade(this);
    // 알림은 창(대화·밤 메뉴·사건·장면)이 하나도 없을 때만 차례로 뜬다
    setToastGate(() => this.modal === 0 && !document.querySelector('[data-id=cutin],[data-id=event],[data-id=morning],[data-id=bulletin],[data-id=opening],[data-id=recap],[data-id=phaseup],[data-id=levelup]'));
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
      save: saved ? { leader: saved.leader.name, cult: saved.leader.cultName, date: fmtDate(saved.day), members: memberCount(saved), difficulty: saved.difficulty } : null,
      onNew: () => { clearSave(); hideTitle(); showCreation((p) => this.startNew(p), () => this.toTitle()); },
      onContinue: () => { hideTitle(); this.resume(loadGame()); },
      onCredits: () => showCredits(() => {}),
      onWipe: () => clearSave(),
      demo: (end) => this.game.scene.getScene('title')?.startDemo(end),
    });
  },

  startNew(p) {
    const s = newGame({ leaderName: p.name, age: p.age, family: p.family, sect: p.sect, cultName: p.cultName, difficulty: p.difficulty, seed: (Date.now() % 1e9) | 0 });
    startDay(s, this.g);
    this.s = s;
    this.floor = 3;
    saveGame(s);
    this.hud = createHud(this);
    s.flags.hudSnap = this.hud.snapshot();
    s.flags.levelSeen = 1;               // 28장: 레벨 업 화면 기준
    // 개업 첫날 (25장 B): 302호에서 시작 → 엄마 → 간판 달기 장면 → 통장님
    this.goSanctuary('door');
    setTimeout(() => this.openingMorning(), 500);
  },

  // ── 개업 첫날 짜인 흐름 ──
  openingMorning() {
    const s = this.s;
    const O = OPENING_TEXT;
    openingPanel(this, { speaker: 'o:mom', title: O.mom.title, name: CAST_BY.mom.name, face: this.portrait('o:mom'), scene: O.mom.scene, lines: O.mom.lines, next: O.mom.next,
      onDone: () => {
        this.modalOpened();     // 간판 장면까지 이어지는 틈에 엔터가 문으로 들어가지 않게 (28장)
        this.goTown('sanctuary');
        setTimeout(() => {
          const sc = this.scene();
          if (!sc?.signScene) { this.modalClosed(); return; }
          sc.signScene(1, () => {
            this.modalClosed();
            openingSign(s);
            checkQuests(s);
            saveGame(s);
            openingPanel(this, { title: '동림상가 앞', name: this.s.leader.name, scene: O.sign.caption, lines: [O.sign.after], next: '계속',
              onDone: () => showQuestNews(this, () => this.openingTong()) });
          });
        }, 700);
      } });
  },
  openingTong() {
    const s = this.s;
    const T = OPENING_TEXT.tong;
    openingPanel(this, { speaker: 'tong', title: T.title, name: RESIDENT_BY_ID.tong.name, face: this.portrait('tong'), scene: T.scene, lines: [T.ask],
      choices: Object.entries(T.choices).map(([id, c]) => ({ id, label: c.label, hint: c.hint })),
      onChoice: (id) => { openingTong(s, id); return T.choices[id].reply; },
      onDone: () => {
        saveGame(s);
        this.todayToast();
        this.tipOnce('fastWeek', OPENING_TEXT.fastWeek);
        this.tipOnce('profile0', '사람을 누르면 프로필이 보인다. 다가가서 말을 걸자.');
      } });
  },
  // 첫날 낮·저녁에 시간이 되면 (advance 가 부른다)
  openingTimed() {
    const s = this.s;
    if (!isOpeningDay(s) || this.modal > 0) return;
    const O = OPENING_TEXT;
    if (s.minute >= OPENING.minhoAt && !openingDone(s, 'minho')) {
      openingMinho(s);
      const inside = this.scene()?.scene.key === 'sanctuary';
      openingPanel(this, { speaker: inside ? 'o:stranger' : null, title: O.minho.title, name: CAST_BY.stranger.name, face: this.portrait('o:stranger'), scene: inside ? O.minho.inside : O.minho.outside, lines: inside ? O.minho.lines : [O.minho.lines[2]], onDone: () => saveGame(s) });
    } else if (s.minute >= OPENING.visitorAt && !openingDone(s, 'visitor')) {
      openingVisitor(s);
      openingPanel(this, { speaker: 'yoonseo', title: O.visitor.title, name: RESIDENT_BY_ID.yoonseo.name, face: this.portrait('yoonseo'), scene: O.visitor.scene, lines: [O.visitor.line],
        onDone: () => { saveGame(s); toast('오늘 저녁 첫 모임에 넷이 앉는다. 밤이 되면 성소로 돌아가 밤 메뉴에서 연다.', 'tip', 6000); } });
    }
  },

  resume(s) {
    if (!s) return this.toTitle();
    this.s = s;
    this.floor = 3;
    this.hud = createHud(this);
    s.flags.hudSnap ??= this.hud.snapshot();
    if (s.mode === 'night') { this.goSanctuary(); this.openNightMenu(); }
    else { snapAll(s, this.g); this.goTown('start'); this.maybeEvent(); }
  },

  scene() {
    return this.game.scene.getScenes(true).find((sc) => !['boot', 'title'].includes(sc.scene.key)) ?? null;
  },
  goTown(entry) {
    setSeason(season(this.s.day)); setLeaderStage(this.s.phase);
    this.game.scene.stop('title');
    this.game.scene.stop('sanctuary');
    this.game.scene.start('town', { entry });
    this.setNearAction(null);
    this.updateExtra();
    this.dpadShow(true);
  },
  goSanctuary(entry = 'door') {
    setSeason(season(this.s.day)); setLeaderStage(this.s.phase);
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
      if (isOpeningDay(s) && [OPENING.minhoAt, OPENING.visitorAt].some((t) => before < t && s.minute >= t)) { this.openingTimed(); left -= step; break; }
      left -= step;
    }
    this.saveTimer += dMin;
    if (this.saveTimer > 60) { this.saveTimer = 0; saveGame(s); }
  },
  setSpeed(n) { this.speed = Math.max(1, n); play('click'); this.hud?.update(); },   // 멈춤은 없다: 시간은 늘 흐른다 (창이 떠 있을 때만 선다)
  // 첫 주는 시계가 조금 빠르다 (하루 ≈ 4분, 25장 B-4)
  clockRate() { return this.s && this.s.day < OPENING.firstWeekDays ? OPENING.firstWeekRate : 1; },

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
    clearToasts();                                // 밤에 못 띄운 알림은 버린다 (아침 알림과 섞이지 않게)
    play('page');
    const finish = (rentChoice) => {
      const r = endDay(s, this.g, { rentChoice });
      this.modal = 0;
      const lines = eventLines(s, r.events);
      // 27장 A: 어제 아침과 비교한 한 줄
      const diff = this.hud?.morningLine(s.flags.hudSnap);
      if (diff) lines.unshift(diff);
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
        s.flags.hudSnap = this.hud?.snapshot();
        this.celebrate(r.events);
        toast(`${s.leader.name}: ${pick(s, LEADER_TONE[tone(s)].morning)}`);
        const hol = holidayOf(s.day);
        if (hol && dayOfMonth(s.day) === hol.from) toast(hol.text, '', 6000);
        if (s.weather.rain) this.tipOnce(s.weather.snow ? 'snow' : 'rain', s.weather.snow ? '눈이 오는 날은 골목이 미끄럽다. 밖에 나온 사람이 적다.' : '비 오는 날엔 공원·산책로에 사람이 없다. 편의점 비닐우산을 씌워 주면 좋아한다.');
        if (s.weather.market) this.tipOnce('market', '토요일은 장날. 시장에 사람이 많고, 장바구니를 들어 주는 선택지가 생긴다.');
        const bd = bigDayOf(s);
        if (bd && s.district === 'sillim') {
          toast(BIGDAY_UI.today.replace('{이름}', bd.name).replace('{장소}', PLACES[bd.place]?.short ?? '').replace('{시간}', `${Math.floor(bd.from / 60)}시~${Math.floor(bd.to / 60)}시`), 'good', 6000);
          this.tipOnce('bigday', '큰 날엔 행사 자리에 현수막이 걸린다. 가까이 가면 그날만 할 수 있는 일이 있다. 수첩(N) 달력에 다음 행사가 보인다.');
        }
        if (isWorshipDay(s.day)) this.tipOnce('worshipDay', '수요일·일요일 밤은 예배. 저녁에 성소로 돌아와 밤 메뉴에서 연다.');
        this.todayToast();
        // 밤사이 결정적 순간 (첫 열혈 신자 · 라이벌에게 간 사람)
        for (const e of r.events) {
          if (e.type === 'zealotAuto' && e.first) cutin(this, { kicker: '첫 열혈 신자', title: RESIDENT_BY_ID[e.id].name, line: e.text, face: this.portrait(e.id) });
          if (e.type === 'rivalStole') cutin(this, { kicker: '저쪽 전단을 들고 상가 앞을 지나갔다', title: RESIDENT_BY_ID[e.id].name, line: e.text, face: this.portrait(e.id) });
        }
        showQuestNews(this, () => this.maybeEvent());
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
      if (RESIDENT_BY_ID[id] && emotionOf(this.s, id) === 'sigh') this.tipOnce('sigh', '머리 위 "휴"는 지금 고민이 큰 사람. 고민 들어주기가 잘 통한다.');
      const npc = id.startsWith('x:') || id.startsWith('v:');
      const name = id.startsWith('c:') ? `${CLERGY_BY_ID[id.slice(2)].name} ${CLERGY_BY_ID[id.slice(2)].title}` : id.startsWith('o:') ? CAST_BY[id.slice(2)].name : npc ? nameForNpc(this.s, id) : RESIDENT_BY_ID[id].name;
      const verb = id === 'x:reporter' ? '인터뷰 받기' : id.startsWith('o:') || id.startsWith('v:') ? '인사' : isProtester(this.s, id) ? '피켓 앞으로' : isDefector(this.s, id) ? '다가가기' : '말 걸기';
      this.hud.setAction(`${verb} · ${name}`, () => this.talkTo(id));
    } else if (near.kind === 'door') {
      const p = PLACES[near.place];
      const label = near.place === 'sanctuary' ? `${this.s.leader.cultName}(3층)으로 올라가기` : STATIONS.includes(near.place) && this.s.phase >= 4 ? `2호선 타기 · ${near.place === 'station' ? '서울대입구역으로' : '신림역으로'}`
        : near.place === 'b_branch' ? `${this.s.branch.open ? '들어가기' : '살펴보기'} · 봉천프라자 2층` : SHOP_PLACES.includes(near.place) ? `들어가기 · ${p.short}` : `살펴보기 · ${p.short}`;
      this.hud.setAction(label, () => this.useDoor(near.place));
    } else if (near.kind === 'shop') {
      this.hud.setAction(`살펴보기 · ${SHOPS[near.b.shop].name}`, () => this.lookShop(near.b));
    } else if (near.kind === 'bigday') {
      this.hud.setAction(BIGDAY_UI.near.replace('{이름}', bigDayOf(this.s).name), () => this.openBigDay());
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
    else if (n.kind === 'bigday') this.openBigDay();
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
  showProfile(id, onTalk) { openProfile(this, id, { onTalk }); this.tipOnce('profile', '프로필의 "지금 고민"은 얘기를 나눠 봐야 알게 된다. 수첩(N)에 사연·부탁이 쌓인다.'); },
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
    // 28장 B-1: 처음 가 본 장소 (입구 한 칸 안)
    for (const [place, p] of Object.entries(this.here().places)) {
      const d = p.door;
      if (!d || !PLACES[place] || Math.abs(d[0] - tx) + Math.abs(d[1] - ty) > 1) continue;
      const r = noteVisit(s, place, PLACES[place].short ?? PLACES[place].name);
      if (r) showReward(r);
    }
    // 퀘스트 장소 (전단 · 오늘의 할 일 '둘러보기')
    for (const m of questMarkers(s)) {
      if (m.kind !== 'place' || m.why === 'favor') continue;
      const d = this.here().places[m.place]?.door;
      if (!d || Math.abs(d[0] - tx) + Math.abs(d[1] - ty) > 1) continue;
      const r = visitSpot(s, m.place);
      if (r.flyer) { play('page'); toast(`${PLACES[m.place].short ?? PLACES[m.place].name}에 전단을 붙였다. (${s.quest.flyers.length}/3)`); }
      for (const t of r.today) toast(t.id === 'all' ? '오늘 할 일 셋을 다 했다. 보리차값 1만 원이 굳었다.' : `오늘 할 일: ${dailyName(t)} ✓`, 'good');
      if (r.flyer || r.today.length) { saveGame(s); this.scene()?.refreshQuestMarks?.(); }
      if (s.quest.news.length) showQuestNews(this);
    }
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
  afterTalk(id, res) {
    for (const t of res?.todayDone ?? []) toast(t.id === 'all' ? '오늘 할 일 셋을 다 했다. 보리차값 1만 원이 굳었다.' : `오늘 할 일: ${dailyName(t)} ✓`, 'good');
    saveGame(this.s); this.celebrate(); this.hud?.update();
    if (this.s.quest?.news?.length) setTimeout(() => showQuestNews(this), 300);
  },
  // 큰 날 행사 (25장 D): 그날만 할 수 있는 일 1~2개
  openBigDay() {
    const s = this.s;
    const bd = bigDayOf(s);
    if (!bd || this.modal > 0 || s.mode !== 'day') return;
    this.scene()?.walker?.stop();
    openingPanel(this, {
      title: PLACES[bd.place]?.name, name: bd.name, scene: bd.intro,
      choices: [...Object.entries(bd.actions).map(([id, a]) => ({ id, label: a.label, hint: a.hint })), { id: 'skip', label: '구경만 한다', hint: '' }],
      onChoice: (id) => {
        if (id === 'skip') return '한 바퀴 둘러봤다. 오늘은 그냥 지나간다.';
        const line = bigDayAct(s, id);
        play('jingle_good', 0.4);
        this.hud?.update();
        this.scene()?.nearKey && (this.scene().nearKey = null);
        return line ?? BIGDAY_UI.done;
      },
      onDone: () => checkQuests(s),
    });
  },
  // 그 상황이 처음 올 때 한 번만 보이는 안내
  tipOnce(key, text) {
    const s = this.s;
    if (!s) return;
    s.flags.tips ??= {};
    if (s.flags.tips[key]) return;
    s.flags.tips[key] = true;
    toast(text, 'tip', 6000);
  },
  todayToast() {
    const t = this.s.today;
    if (t) toast(`오늘 할 일 (수첩 N): ${t.tasks.map(dailyName).join(' · ')}`, '', 6000);
  },
  refresh() { this.celebrate(); this.hud?.update(); },
  // 28장 B: 작은 보상 · 업적 · 레벨 업 (events 를 주면 밤사이 sim 이 이미 정한 것만 보여 준다)
  celebrate(events = null) {
    const s = this.s;
    if (!s) return;
    const rewards = events ? events.filter((e) => e.type === 'reward') : pollRewards(s);
    const ach = events ? events.filter((e) => e.type === 'achievement') : checkAchievements(s);
    for (const r of rewards) showReward(r);
    for (const a of ach) showAchievement(a);
    const lv = levelOf(s).level;
    s.flags.levelSeen ??= lv;
    if (lv > s.flags.levelSeen && this.modal === 0 && s.mode === 'day') {
      const from = s.flags.levelSeen;
      s.flags.levelSeen = lv;
      showLevelUp(this, from, lv);
    }
  },

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
    else if (canStreetSermon(s) && s.flags.streetSermon !== s.day) this.hud.setExtra(GROWTH_TEXT.street.label, () => this.doStreetSermon());
    else this.hud.setExtra(null);
  },
  // 길거리 즉석 설교 (카리스마 3): 가까이(6칸) 보이는 주민 모두
  doStreetSermon() {
    const s = this.s;
    const [px, py] = s.leaderTile ?? [0, 0];
    const near = Object.keys(s.res).filter((id) => {
      const p = s.pos[id];
      return p && !p.inside && (id.startsWith('b_') === (s.district === 'bongcheon')) && Math.abs(p.x - px) + Math.abs(p.y - py) <= GROWTH.streetSermon.tiles && ['none', 'curious'].includes(s.res[id].stage);
    });
    if (!near.length) { toast('주위에 들을 사람이 없다.'); return; }
    streetSermon(s, near, (id) => sameFamily(s, id));
    play('talk');
    toast(`${GROWTH_TEXT.street.done} (${near.length}명)`, '', 5000);
    for (const id of near) this.scene()?.say?.(id, ['"…"', '"뭐야."', '"오."', '"바빠요."'][Math.floor(Math.random() * 4)], this.scene().time.now + Math.random() * 1500);
    saveGame(s); this.updateExtra(); this.hud.update();
  },
  openNotebook(tab) { openNotebook(this, tab); },

  modalOpened() { this.modal++; this.dpadShow(false); },
  modalClosed() { this.modal = Math.max(0, this.modal - 1); if (!this.modal) this.dpadShow(true); },
  dpadShow(on) {
    const el = document.querySelector('.dpad');
    if (el) el.classList.toggle('hidden', !on || !this.s);
    if (!on) { this.dpad = {}; this.dpadRun = false; el?.classList.remove('on', 'run'); el?.querySelector('.stick-knob')?.style.removeProperty('transform'); }   // 메뉴가 뜨면 스틱을 놓은 것으로
  },
  openMenu() { showMenu(this); },

  // 대화창이 떠 있는 동안 말하는 사람을 지도에 세운다 (27장 D5). id 는 portrait 와 같은 꼴
  showSpeaker(id) {
    const sc = this.scene();
    if (!sc?.player) return;
    const key = id.startsWith('o:') ? `cast:${id.slice(2)}` : id;
    showSpeaker(sc, `p:${key}`, sc.sprites?.[key] ?? null);
  },
  hideSpeaker() { const sc = this.scene(); if (sc) hideSpeaker(sc); },
  portrait(id) {
    // 아틀라스 줄 이름: 주민 id · leader · c:성직자 · cast:첫 신도 · x:reporter · v:라이벌
    const key = id.startsWith('o:') ? `cast:${id.slice(2)}` : id;
    return makePortrait({ cache: this.game.cache, textures: this.game.textures }, key);
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
    if (e.code === 'Digit1') this.setSpeed(1);
    if (e.code === 'Digit2') this.setSpeed(2);
    if (e.code === 'KeyN') this.openNotebook();
  },
};
