// Web Audio 합성: 외부 파일 없이 효과음·악기 소리를 만든다.
// 첫 사용자 입력(클릭·터치·키) 뒤에 시작한다 (브라우저 자동 재생 정책).
export class Synth {
  constructor() {
    this.ctx = null;
    this.voices = 0; // 지금 울리는 효과음 수 (배경음은 따로 세지 않는다)
    const start = () => this.start();
    for (const ev of ['pointerdown', 'keydown', 'touchstart']) window.addEventListener(ev, start, { passive: true });
  }

  start() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.sfxBus = this.ctx.createGain();
    this.musicBus = this.ctx.createGain();
    this.sfxBus.connect(this.ctx.destination);
    this.musicBus.connect(this.ctx.destination);
    // 1초짜리 흰 잡음 (노이즈 음색 공용)
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    this.onStart?.();
  }

  get ready() {
    return !!this.ctx && this.ctx.state === 'running';
  }

  get now() {
    return this.ctx.currentTime;
  }

  // 음 하나: { type, f, f2, d, t, g, a, filter, filter2 }. pitch는 주파수 배율
  tone(n, { out, when, gain = 1, pitch = 1, count = true }) {
    const c = this.ctx;
    const t0 = when + (n.t ?? 0);
    const dur = n.d;
    const env = c.createGain();
    const peak = (n.g ?? 0.2) * gain;
    const attack = n.a ?? 0.005;
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    env.connect(out);

    let src;
    if (n.type === 'noise') {
      src = c.createBufferSource();
      src.buffer = this.noise;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(n.filter ?? 1000, t0);
      if (n.filter2) bp.frequency.exponentialRampToValueAtTime(n.filter2, t0 + dur);
      src.connect(bp).connect(env);
    } else {
      src = c.createOscillator();
      src.type = n.type;
      src.frequency.setValueAtTime(n.f * pitch, t0);
      if (n.f2) src.frequency.exponentialRampToValueAtTime(n.f2 * pitch, t0 + dur);
      src.connect(env);
    }
    if (count) this.voices += 1;
    src.onended = () => { if (count) this.voices -= 1; env.disconnect(); };
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }
}
