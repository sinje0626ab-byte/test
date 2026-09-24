// 프레임 시간 + 게임 내 날짜·낮/밤.
// clock: 0 ~ dayLength 는 낮, dayLength ~ dayLength+nightLength 는 밤. 한 바퀴 돌면 다음 날.
export class Time {
  constructor(cfg, bus) {
    this.cfg = cfg;
    this.bus = bus;
    this.maxDelta = cfg.maxDelta;
    this.last = performance.now();
    this.delta = 0;
    this.elapsed = 0;

    this.day = 1;
    this.clock = cfg.startClock;

    bus.on('save:collect', (save) => { save.time = { day: this.day, clock: this.clock }; });
    bus.on('save:apply', (save) => {
      if (!save.time) return;
      this.day = save.time.day;
      this.clock = save.time.clock;
    });
  }

  get cycle() {
    return this.cfg.dayLength + this.cfg.nightLength;
  }

  get isNight() {
    return this.clock >= this.cfg.dayLength;
  }

  // 1 = 한낮, 0 = 한밤. 해 질 녘·동틀 녘에 부드럽게 바뀐다.
  get daylight() {
    const { dayLength, transition } = this.cfg;
    const c = this.clock;
    if (c < dayLength - transition) return c < transition ? Math.max(0, c / transition) * 0.5 + 0.5 : 1;
    if (c < dayLength) return (dayLength - c) / transition;
    return 0;
  }

  // 다음 낮/밤 전환까지 남은 초
  get untilChange() {
    return this.isNight ? this.cycle - this.clock : this.cfg.dayLength - this.clock;
  }

  tick(now) {
    // 탭이 백그라운드였다가 돌아와도 한 번에 크게 튀지 않게 자른다.
    this.delta = Math.min((now - this.last) / 1000, this.maxDelta);
    this.last = now;
    this.elapsed += this.delta;
    return this.delta;
  }

  // 게임 시간 진행. 경계를 넘을 때 이벤트를 보낸다.
  advance(dt) {
    const { dayLength, nightWarning } = this.cfg;
    const prev = this.clock;
    this.clock += dt;
    const warnAt = dayLength - nightWarning;
    if (prev < warnAt && this.clock >= warnAt) this.bus.emit('time:dusk', { day: this.day });
    if (prev < dayLength && this.clock >= dayLength) this.bus.emit('time:night', { day: this.day });
    if (this.clock >= this.cycle) {
      this.clock -= this.cycle;
      this.day += 1;
      this.bus.emit('time:day', { day: this.day });
    }
  }
}
