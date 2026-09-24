// 프레임 시간. 낮/밤은 Phase 3에서 여기에 추가한다.
export class Time {
  constructor(cfg) {
    this.maxDelta = cfg.maxDelta;
    this.last = performance.now();
    this.delta = 0;
    this.elapsed = 0;
  }

  tick(now) {
    // 탭이 백그라운드였다가 돌아와도 한 번에 크게 튀지 않게 자른다.
    this.delta = Math.min((now - this.last) / 1000, this.maxDelta);
    this.last = now;
    this.elapsed += this.delta;
    return this.delta;
  }
}
