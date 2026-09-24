import { helpHtml } from './TitleScreen.js';

// 게임 중 메뉴 (☰ 버튼 / ESC): 계속하기 · 저장하기 · 조작 방법 · 타이틀로. 열려 있으면 게임이 멈춘다.
export class PauseMenu {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
    const el = document.createElement('div');
    el.className = 't-dialog pause';
    el.hidden = true;
    el.innerHTML = '<div class="t-card" data-card></div>';
    document.body.appendChild(el);
    this.el = el;
    this.card = el.querySelector('[data-card]');

    el.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act) this.act(act);
      else if (e.target === el) this.close(); // 바깥을 누르면 닫기
    });
    // 게임이 멈춰 있는 동안에는 Input이 돌지 않으므로 ESC는 여기서 직접 받는다.
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && !el.hidden) this.close();
    });
    ctx.bus.on('pause:open', () => this.open());
  }

  open() {
    if (this.ctx.state !== 'play') return;
    this.ctx.state = 'paused';
    this.renderMain();
    this.el.hidden = false;
  }

  close() {
    this.el.hidden = true;
    if (this.ctx.state === 'paused') this.ctx.state = 'play';
  }

  renderMain(note = '') {
    this.card.innerHTML = `
      <h2>잠깐 쉬어 가요</h2>
      <div class="pause-menu">
        <button type="button" class="t-menu-btn primary" data-act="resume">계속하기</button>
        <button type="button" class="t-menu-btn" data-act="save">저장하기${note ? `<small>${note}</small>` : ''}</button>
        <button type="button" class="t-menu-btn" data-act="help">조작 방법</button>
        <button type="button" class="t-menu-btn" data-act="title">타이틀로<small>저장하고 돌아가요</small></button>
      </div>`;
  }

  act(act) {
    switch (act) {
      case 'resume':
        this.close();
        break;
      case 'save':
        this.ctx.bus.emit('save:request');
        this.renderMain('저장했어요!');
        break;
      case 'help':
        this.card.innerHTML = `<h2>조작 방법</h2>${helpHtml()}<div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="back">돌아가기</button></div>`;
        break;
      case 'back':
        this.renderMain();
        break;
      case 'title':
        this.ctx.bus.emit('save:request');
        window.location.reload();
        break;
    }
  }
}
