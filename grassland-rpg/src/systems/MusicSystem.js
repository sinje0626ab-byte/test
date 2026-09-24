// 배경음: 펜타토닉 음계로 짧은 루프를 그때그때 합성한다.
// 분위기(지역·낮밤)마다 조성·음높이·템포가 다르고, 습격 중엔 북, 보스전은 빠르게.
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
    this.melodyNote = 2;
    const { bus } = ctx;
    bus.on('settings:changed', ({ key, value }) => {
      if (key === 'musicVolume') this.volume = value;
      this.applyVolume();
    });
    bus.on('raid:start', () => { this.raid = true; });
    bus.on('raid:end', () => { this.raid = false; });
    bus.on('time:day', () => { this.raid = false; });
    bus.on('boss:engaged', () => { this.boss += 1; });
    bus.on('boss:disengaged', () => { this.boss = Math.max(0, this.boss - 1); });
  }

  applyVolume() {
    if (this.synth.ctx) this.synth.musicBus.gain.value = this.master * this.volume;
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
    const out = s.musicBus;
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
