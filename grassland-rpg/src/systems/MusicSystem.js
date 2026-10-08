import { baseAt } from '../utils/bases.js';

// 배경음 (두 가지):
// 1) 곡 파일(src/music/<이름>.mp3, Suno 로 만든 곡) — 상황에 맞는 곡을 골라 1.5초 동안 겹쳐 바꾼다(크로스페이드).
//    곡마다 듣던 자리를 기억해서 다시 돌아오면 이어서 튼다. 볼륨은 Web Audio 로 (iOS 는 audio.volume 을 무시한다)
// 2) 그 상황의 곡 파일이 아직 없으면 예전처럼 펜타토닉 음계로 짧은 루프를 그때그때 합성한다
//    (분위기(지역·낮밤)마다 조성·음높이·템포가 다르고, 습격 중엔 북, 보스전은 빠르게).
const FILES = import.meta.glob('../music/*.mp3', { query: '?url', import: 'default', eager: true });
const TRACKS = Object.fromEntries(Object.entries(FILES).map(([f, url]) => [f.split('/').pop().replace('.mp3', ''), url]));
// 기지 생활 창(상점·대장간·작업대·창고·텃밭)을 열면 마을 곡
const VILLAGE_WINDOWS = new Set(['shop', 'forge', 'craft', 'storage', 'garden', 'courier']);
// 곡이 아직 없는 상황은 비슷한 곡을 빌려 쓴다 (습격 → 보스전 행진곡)
const ALIAS = { raid: 'boss', nightlord: 'boss' };
const FADE = 1.5; // 곡 바꾸는 시간(초)
const SETTLE = 2; // 이 시간 동안 같은 곡을 원해야 바꾼다 (기지 경계를 들락날락할 때 왔다 갔다 하지 않게). 보스·습격은 바로

export class MusicSystem {
  constructor(ctx, synth) {
    this.ctx = ctx;
    this.synth = synth;
    this.cfg = ctx.data.sounds.music;
    this.master = ctx.data.sounds.masterMusic;
    this.volume = 1;
    this.nextTime = 0;
    this.step = 0;
    this.raid = false;
    this.boss = 0;
    this.nightLord = false;
    this.melodyNote = 2;
    this.windows = new Set();
    this.players = new Map(); // 곡 이름 → { audio, gain }
    this.current = null; // 지금 트는 곡 이름 (null = 합성 음악)
    this.wanted = null;
    this.wantedSince = 0;
    const { bus } = ctx;
    bus.on('settings:changed', ({ key, value }) => {
      if (key === 'musicVolume') this.volume = value;
      this.applyVolume();
    });
    bus.on('raid:start', () => { this.raid = true; });
    bus.on('raid:end', () => { this.raid = false; });
    bus.on('time:day', () => { this.raid = false; });
    bus.on('boss:engaged', ({ boss }) => { this.boss += 1; if (boss?.type === 'night_lord') this.nightLord = true; });
    bus.on('boss:disengaged', ({ boss }) => { this.boss = Math.max(0, this.boss - 1); if (boss?.type === 'night_lord') this.nightLord = false; });
    bus.on('boss:defeated', ({ id }) => { if (id === 'night_lord') this.nightLord = false; });
    bus.on('ui:open', ({ id }) => this.windows.add(id));
    bus.on('ui:close', ({ id }) => this.windows.delete(id));
    // 탭을 숨기면 곡도 멈춘다
    document.addEventListener('visibilitychange', () => {
      const p = this.current && this.players.get(this.current);
      if (!p) return;
      if (document.hidden || this.paused) p.audio.pause();
      else p.audio.play().catch(() => {});
    });
  }

  applyVolume() {
    if (this.synth.ctx) this.synth.musicBus.gain.value = this.master * this.volume;
  }

  // 지금 상황에 맞는 곡 이름 (파일이 없을 수도 있다)
  trackName() {
    const { time, world, player, state, bases } = this.ctx;
    if (state === 'title') return 'title';
    if (state === 'ending') return 'ending';
    if (this.nightLord) return 'nightlord';
    if (this.boss > 0) return 'boss';
    if (this.raid) return 'raid';
    if ([...this.windows].some((id) => VILLAGE_WINDOWS.has(id))) return 'village';
    if (time.isNight) return 'night';
    if (bases?.length && baseAt(bases, player.position)) return 'village';
    return world.regionAt(player.position.x, player.position.z).id;
  }

  // 합성 음악이 나가는 곳 (곡 파일을 틀 때는 이 소리만 줄인다)
  get synthOut() {
    const s = this.synth;
    if (!this.synthGain && s.ctx) {
      this.synthGain = s.ctx.createGain();
      this.synthGain.connect(s.musicBus);
    }
    return this.synthGain;
  }

  player(name) {
    if (!this.players.has(name)) {
      const s = this.synth;
      const audio = new Audio(TRACKS[name]);
      audio.loop = true;
      audio.preload = 'auto';
      const gain = s.ctx.createGain();
      gain.gain.value = 0;
      s.ctx.createMediaElementSource(audio).connect(gain);
      gain.connect(s.musicBus);
      this.players.set(name, { audio, gain });
    }
    return this.players.get(name);
  }

  // 곡 바꾸기: 새 곡은 0 → 1, 예전 곡은 1 → 0 으로 겹친 뒤 멈춘다 (멈춘 자리는 기억)
  switchTo(name) {
    const s = this.synth;
    const now = s.now;
    const ramp = (g, to) => { g.gain.cancelScheduledValues(now); g.gain.setValueAtTime(g.gain.value, now); g.gain.linearRampToValueAtTime(to, now + FADE); };
    const old = this.current && this.players.get(this.current);
    if (old) {
      ramp(old.gain, 0);
      const a = old.audio;
      clearTimeout(old.stopTimer);
      old.stopTimer = setTimeout(() => { if (old.gain.gain.value < 0.01) a.pause(); }, FADE * 1000 + 100);
    }
    this.current = name;
    if (name) {
      const p = this.player(name);
      clearTimeout(p.stopTimer);
      p.audio.play().catch(() => {});
      ramp(p.gain, 1);
    }
    ramp(this.synthOut, name ? 0 : 1);
  }

  // 곡 파일 고르기: 원하는 곡이 SETTLE 초 동안 같으면 바꾼다(오디오 시계로 잰다). 파일이 없으면 합성 음악(null)
  updateTrack() {
    const want = this.trackName();
    const name = TRACKS[want] ? want : ALIAS[want] ?? want;
    const target = TRACKS[name] ? name : null;
    const now = this.synth.now;
    if (target === this.current) { this.wanted = target; return; }
    if (target !== this.wanted) { this.wanted = target; this.wantedSince = now; }
    const urgent = ['boss', 'nightlord', 'raid', 'title', 'ending'].includes(want) || this.current === 'title';
    if (urgent || now - this.wantedSince >= SETTLE) this.switchTo(target);
  }

  mood() {
    const { time, world, player, state } = this.ctx;
    if (state === 'title') return this.cfg.moods.grassland_day;
    if (time.isNight) return this.cfg.moods.night;
    const region = world.regionAt(player.position.x, player.position.z).id;
    return this.cfg.moods[`${region}_day`] ?? this.cfg.moods.grassland_day;
  }

  freq(mood, degree, octave = 0) {
    const n = mood.scale.length;
    const oct = Math.floor(degree / n) + octave;
    const semis = mood.scale[((degree % n) + n) % n] + 12 * oct;
    return mood.root * 2 ** (semis / 12);
  }

  // 한 박(8분음표) 분량을 예약한다.
  schedule(mood, when, dur) {
    const s = this.synth;
    const out = this.synthOut;
    const spb = this.cfg.stepsPerBar;
    const step = this.step % spb;
    const bar = Math.floor(this.step / spb);
    const chordRoot = [0, 3, 1, 4][bar % 4]; // 마디마다 바뀌는 화음 뿌리 (음계 도수)

    if (step === 0) {
      // 패드: 화음 세 음을 길게
      for (const d of [0, 2, 4]) {
        s.tone({ type: mood.pad, f: this.freq(mood, chordRoot + d, -1), d: dur * spb * 0.95, g: 0.05, a: 0.25 }, { out, when, count: false });
      }
    }
    if (step % 4 === 0) s.tone({ type: 'triangle', f: this.freq(mood, chordRoot, -2), d: dur * 1.8, g: 0.09 }, { out, when, count: false });

    // 멜로디: 음계 안에서 한두 칸씩 걷는다. 박자에 따라 쉬기도 한다.
    if (Math.random() < this.cfg.melodyChance || step === 0) {
      this.melodyNote += [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
      this.melodyNote = Math.max(0, Math.min(9, this.melodyNote));
      s.tone({ type: mood.lead, f: this.freq(mood, this.melodyNote), d: dur * (step % 2 ? 0.9 : 1.6), g: 0.07, a: 0.02 }, { out, when, count: false });
    }

    if (this.raid && this.cfg.raidDrums) {
      if (step % 4 === 0) s.tone({ type: 'sine', f: 110, f2: 40, d: 0.25, g: 0.22 }, { out, when, count: false });
      if (step % 4 === 2) s.tone({ type: 'noise', d: 0.12, g: 0.12, filter: 1800 }, { out, when, count: false });
      s.tone({ type: 'noise', d: 0.04, g: 0.04, filter: 6000 }, { out, when, count: false });
    }
  }

  update() {
    const s = this.synth;
    if (!s.ready || this.volume <= 0) return;
    // 일시정지 중엔 곡을 멈춘다 (풀면 그 자리부터)
    const paused = this.ctx.state === 'paused';
    const p = this.current && this.players.get(this.current);
    if (paused !== this.paused) {
      this.paused = paused;
      if (p) { if (paused) p.audio.pause(); else if (!document.hidden) p.audio.play().catch(() => {}); }
      if (this.synthGain) this.synthGain.gain.value = paused || this.current ? 0 : 1;
    }
    if (paused) return;
    this.updateTrack();
    if (this.current) return; // 곡 파일을 트는 중엔 합성하지 않는다
    const mood = this.mood();
    const tempo = mood.tempo * (this.boss > 0 ? this.cfg.bossTempoMultiplier : 1) * (this.raid ? 1.12 : 1);
    const dur = 60 / tempo / 2;
    if (this.nextTime < s.now) this.nextTime = s.now + 0.05;
    while (this.nextTime < s.now + 0.25) {
      this.schedule(mood, this.nextTime, dur);
      this.nextTime += dur;
      this.step += 1;
    }
  }
}
