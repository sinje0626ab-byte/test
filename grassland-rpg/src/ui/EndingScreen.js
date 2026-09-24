// 엔딩: 해가 뜬 뒤 크레딧. 카메라가 지나온 기지들 위를 차례로 돈다. "계속 개척하기"로 이어서 플레이.
export class EndingScreen {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
    this.cfg = ctx.data.config.nightLord;
    this.el = null;
    ctx.bus.on('ending:start', (stats) => this.start(stats));
  }

  start(stats) {
    const { ctx } = this;
    ctx.state = 'ending';
    this.t = 0;
    this.angle = 0;
    this.stops = ctx.bases.length ? ctx.bases.map((b) => b.position) : [ctx.player.position];
    const el = document.createElement('div');
    el.className = 'ending';
    el.innerHTML = `
      <div class="ending-roll">
        <h1>초원에 아침이 왔어요</h1>
        <p class="ending-sub">${stats.name}님, 밤의 군주를 물리쳤어요!</p>
        <dl class="ending-stats">
          <dt>개척한 날</dt><dd>${stats.days}일</dd>
          <dt>물리친 몬스터</dt><dd>${stats.kills.toLocaleString()}마리</dd>
          <dt>세운 기지</dt><dd>${stats.bases}곳</dd>
        </dl>
        <div class="ending-credits">
          <p><b>Meadow Pioneers · 초원 개척단</b></p>
          <p>개척자 · ${stats.name}</p>
          <p>동물 친구들 · 도토리 · 무쇠 · 부엉 박사 · 꿀비 · 하늘</p>
          <p>그리고 초원의 모든 슬라임에게</p>
          <p class="thanks">함께해 줘서 고마워요!</p>
        </div>
        <button type="button" class="t-menu-btn primary" data-continue>계속 개척하기</button>
      </div>`;
    document.body.appendChild(el);
    this.el = el;
    el.querySelector('[data-continue]').addEventListener('click', () => this.finish());
    ctx.bus.emit('ui:open', { id: 'ending' });
  }

  finish() {
    this.el?.remove();
    this.el = null;
    this.ctx.state = 'play';
    this.game.camera.snapTo(this.ctx.player.position);
  }

  // Game이 ending 상태일 때 부른다: 기지마다 creditsPerBase초씩 빙글
  update(dt) {
    this.t += dt;
    this.angle += dt * 0.25;
    const i = Math.floor(this.t / this.cfg.creditsPerBase) % this.stops.length;
    this.game.camera.orbit(this.stops[i], this.angle);
  }
}
