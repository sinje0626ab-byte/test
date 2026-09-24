// 몬스터 도감 창 (부엉 박사): 잡아 본 몬스터는 색·이름·처치 수·한 줄 설명, 아니면 ???
export class BestiaryWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    const win = ui.createWindow({ id: 'bestiary', title: '몬스터 도감' });
    win.el.classList.add('win-center');
    this.body = win.body;
    ctx.bus.on('bestiary:show', (v) => {
      this.render(v);
      ui.open('bestiary');
    });
  }

  render(v) {
    const ms = this.ctx.data.config.bestiary.milestones;
    this.body.innerHTML = `
      <div class="bs">
        <p class="bs-head">완성률 <b>${Math.round(v.ratio * 100)}%</b>${v.title ? ` · 칭호 「${v.title}」` : ''}<small>처치 ${ms.map((m) => m.kills).join('·')}마리마다 보상</small></p>
        <div class="bs-grid">${v.list.map((e) => (e.kills ? `
          <div class="bs-card${e.boss ? ' boss' : ''}">
            <i class="bs-dot" style="--c:${e.color}"></i>
            <b>${e.name}</b><small>${e.lore}</small><span class="bs-kills">${e.kills}마리</span>
          </div>` : '<div class="bs-card unknown"><i class="bs-dot"></i><b>???</b><small>아직 만나지 못했어요</small></div>')).join('')}</div>
      </div>`;
  }
}
