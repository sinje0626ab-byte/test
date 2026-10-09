import { helpHtml } from './TitleScreen.js';
import { PAINTED } from './painted.js';

// 새로 그린 중단 화면 그림 (src/art/ui/pause_*). 다 있으면 그림 판(.pp), 없으면 예전 크림 카드
const ART = ['frame', 'ribbon', 'owl', 'btn', 'btn_main', 'btn_title', 'ic_play', 'ic_save', 'ic_controls', 'ic_settings', 'ic_title'];
const hasArt = ART.every((k) => PAINTED.ui[`pause_${k}`]);
const ic = (k) => (hasArt ? `<i class="pp-ic" style="background-image:url(${PAINTED.ui[`pause_ic_${k}`]})"></i>` : '');

// 게임 중 메뉴 (☰ 버튼 / ESC): 계속하기 · 저장하기 · 조작 방법 · 타이틀로. 열려 있으면 게임이 멈춘다.
export class PauseMenu {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
    const el = document.createElement('div');
    el.className = 't-dialog pause';
    el.hidden = true;
    el.innerHTML = '<div class="t-card" data-card></div>';
    if (hasArt) for (const k of ART) el.style.setProperty(`--pp-${k.replace('_', '-')}`, `url(${PAINTED.ui[`pause_${k}`]})`);
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
    this.el.classList.toggle('pp', hasArt);
    if (hasArt) {
      // 그림 판: 나무 틀 + 리본 제목 + 조는 부엉이 + 사탕 버튼(아이콘 + 글자)
      const btn = (act, kind, k, label, small = '') => `<button type="button" class="pp-btn" data-kind="${kind}" data-act="${act}">${ic(k)}<span>${label}${small ? `<small>${small}</small>` : ''}</span></button>`;
      this.card.innerHTML = `
        <div class="pp-owl" aria-hidden="true"></div>
        <div class="pp-ribbon"><h2>잠깐 쉬어 가요</h2></div>
        <div class="pause-menu">
          ${btn('resume', 'main', 'play', '계속하기')}
          ${btn('save', 'normal', 'save', '저장하기', note)}
          ${btn('help', 'normal', 'controls', '조작 방법')}
          ${btn('settings', 'normal', 'settings', '설정')}
          ${btn('title', 'title', 'title', '타이틀로', '저장하고 돌아가요')}
        </div>`;
      return;
    }
    this.card.innerHTML = `
      <h2>잠깐 쉬어 가요</h2>
      <div class="pause-menu">
        <button type="button" class="t-menu-btn primary" data-act="resume">계속하기</button>
        <button type="button" class="t-menu-btn" data-act="save">저장하기${note ? `<small>${note}</small>` : ''}</button>
        <button type="button" class="t-menu-btn" data-act="help">조작 방법</button>
        <button type="button" class="t-menu-btn" data-act="settings">설정</button>
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
        this.el.classList.remove('pp');
        this.card.innerHTML = `<h2>조작 방법</h2>${helpHtml()}<div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="back">돌아가기</button></div>`;
        break;
      case 'back':
        this.renderMain();
        break;
      case 'settings':
        this.el.classList.remove('pp');
        this.game.settingsPanel.render(this.card, () => this.renderMain());
        break;
      case 'title':
        this.ctx.bus.emit('save:request');
        window.location.reload();
        break;
    }
  }
}
