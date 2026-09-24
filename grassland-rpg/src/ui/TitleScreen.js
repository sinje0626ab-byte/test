// 타이틀 화면: 로고 · 이어하기 / 새 게임 / 조작 방법, 새 게임 환영 안내 카드
const LOGO = [['초', 'g'], ['원', 'g'], [' ', ''], ['기', 'o'], ['지', 'o']];

// 조작 방법 표 (타이틀·게임 메뉴 공용)
export function helpHtml() {
  const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;
  return `
    <div class="help-cols">
      <section>
        <h3>PC</h3>
        <table>
          ${row('이동', 'W A S D · Shift 달리기')}
          ${row('구르기', 'Space (잠깐 무적)')}
          ${row('공격', '마우스 왼쪽 클릭 (마우스 쪽으로)')}
          ${row('상호작용', 'E (포탑·건물 앞에서)')}
          ${row('스킬', 'Q · R (스킬 창에서 등록한 액티브 스킬)')}
          ${row('창', 'I 가방 · C 캐릭터 · K 스킬 · B 건설 · M 지도')}
          ${row('물약', '숫자 1~5')}
          ${row('아이템', '우클릭: 사용·장착 · 끌어서 옮기기')}
          ${row('메뉴', 'ESC')}
        </table>
      </section>
      <section>
        <h3>휴대폰</h3>
        <table>
          ${row('이동', '왼쪽 조이스틱 (끝까지 밀면 달리기)')}
          ${row('구르기', '초록 구르기 버튼 (잠깐 무적)')}
          ${row('공격', '빨간 공격 버튼 (가까운 적 자동 조준)')}
          ${row('상호작용', '나타나는 E 버튼')}
          ${row('스킬', '공격 버튼 위 둥근 버튼 (액티브 스킬을 배우면)')}
          ${row('창', '오른쪽 메뉴 버튼')}
          ${row('물약', '아래 퀵슬롯 탭')}
          ${row('아이템', '두 번 탭: 사용·장착')}
          ${row('건설', '화면 탭으로 자리 → "설치"')}
        </table>
      </section>
    </div>`;
}

function agoText(t) {
  if (!t) return '';
  const min = Math.floor((Date.now() - t) / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}시간 전`;
  return `${Math.floor(min / 1440)}일 전`;
}

export class TitleScreen {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
    this.touch = ctx.input.touchMode;
    document.body.classList.add('on-title');

    const el = document.createElement('div');
    el.className = 'title-screen';
    el.innerHTML = `
      <div class="title-sky" aria-hidden="true">
        ${[1, 2, 3, 4].map((i) => `<i class="cloud c${i}"></i>`).join('')}
        ${[1, 2, 3, 4, 5, 6, 7].map((i) => `<i class="leaf l${i}"></i>`).join('')}
      </div>
      <div class="title-center">
        <div class="logo-wrap">
          <i class="sprout" aria-hidden="true"><b></b><b></b></i>
          <h1 class="logo">${LOGO.map(([ch, c], i) => `<span class="${c}" style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</h1>
          <span class="logo-badge">RPG</span>
        </div>
        <p class="logo-sub">작은 텐트 하나로 시작하는 초원 모험</p>
        <div class="title-menu" data-menu></div>
      </div>
      <footer class="title-foot">저장은 이 브라우저에 자동으로 돼요 · v0.7</footer>
      <div class="t-dialog" data-dialog hidden><div class="t-card" data-card></div></div>`;
    document.body.appendChild(el);
    this.el = el;
    this.menu = el.querySelector('[data-menu]');
    this.dialog = el.querySelector('[data-dialog]');
    this.card = el.querySelector('[data-card]');

    this.renderMenu();
    el.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act) this.act(act);
    });
  }

  renderMenu() {
    const info = this.game.save.peek();
    const has = info && !info.broken;
    const summary = has
      ? `${info.day}일차 · Lv ${info.level} · 골드 ${info.gold.toLocaleString()} · 기지 ${info.bases}곳 · ${agoText(info.savedAt)}`
      : '';
    this.hasSave = !!info;
    this.menu.innerHTML = `
      ${has ? `<button type="button" class="t-menu-btn primary" data-act="continue">이어하기<small>${summary}</small></button>` : ''}
      ${info?.broken ? `<p class="t-warn">${info.newer ? '더 새로운 버전에서 만든 저장이 있어요' : '저장을 읽지 못했어요'}</p>` : ''}
      <button type="button" class="t-menu-btn${has ? '' : ' primary'}" data-act="new">새 게임</button>
      <button type="button" class="t-menu-btn" data-act="help">조작 방법</button>
      <button type="button" class="t-menu-btn" data-act="settings">설정</button>`;
  }

  act(act) {
    switch (act) {
      case 'continue':
        this.close();
        this.game.continueGame();
        break;
      case 'new':
        if (this.hasSave) this.showConfirm();
        else this.startNew();
        break;
      case 'new-yes':
        this.startNew();
        break;
      case 'help':
        this.showCard(`<h2>조작 방법</h2>${helpHtml()}<div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="back">알겠어요</button></div>`);
        break;
      case 'back':
        this.dialog.hidden = true;
        break;
      case 'settings':
        this.dialog.hidden = false;
        this.game.settingsPanel.render(this.card, () => { this.dialog.hidden = true; });
        break;
      case 'next':
        this.step += 1;
        this.renderWelcome();
        break;
      case 'go':
        this.dialog.hidden = true;
        this.el.remove();
        this.ctx.state = 'play';
        break;
    }
  }

  showCard(html) {
    this.card.innerHTML = html;
    this.dialog.hidden = false;
  }

  showConfirm() {
    this.showCard(`
      <h2>새로 시작할까요?</h2>
      <p>지금 저장된 모험이 지워져요.<br>되돌릴 수 없어요!</p>
      <div class="t-actions">
        <button type="button" class="t-menu-btn" data-act="back">그만두기</button>
        <button type="button" class="t-menu-btn danger" data-act="new-yes">지우고 시작</button>
      </div>`);
  }

  startNew() {
    this.el.classList.add('leaving');
    this.game.newGame();
    // 환영 안내를 보는 동안에는 게임을 멈춘다.
    this.ctx.state = 'paused';
    this.step = 0;
    this.el.querySelector('.title-center').remove();
    this.el.querySelector('.title-foot').remove();
    this.renderWelcome();
  }

  welcomeSteps() {
    const t = this.touch;
    return [
      { icon: 'wave', title: '초원에 온 걸 환영해요!', body: t
        ? '왼쪽 <b>조이스틱</b>으로 걷고, 끝까지 밀면 달려요.<br>빨간 <b>공격</b> 버튼으로 슬라임을 혼내 주세요.'
        : '<b>WASD</b>로 걷고 <b>Shift</b>로 달려요.<br><b>마우스 클릭</b>으로 그쪽을 향해 칼을 휘둘러요.' },
      { icon: 'tent', title: '첫 기지를 세워요', body: t
        ? '<b>가방</b>을 열고 텐트 키트를 <b>두 번 탭</b>하세요.<br>세울 자리를 탭하고 <b>설치</b>를 누르면 끝!'
        : '<b>I</b>로 가방을 열고 텐트 키트를 <b>우클릭</b>하세요.<br>세울 자리를 <b>클릭</b>하면 끝!' },
      { icon: 'moon', title: '밤을 조심해요', body: '해가 지면 몬스터가 기지로 몰려와요.<br>슬라임을 잡아 모은 골드로 <b>포탑</b>을 세워 두세요.<br>' + (t ? '<b>건설</b> 버튼' : '<b>B</b> 키') + '로 지을 수 있어요.' },
    ];
  }

  renderWelcome() {
    const steps = this.welcomeSteps();
    const s = steps[this.step];
    const last = this.step === steps.length - 1;
    this.showCard(`
      <div class="welcome">
        <i class="w-icon w-${s.icon}" aria-hidden="true"></i>
        <h2>${s.title}</h2>
        <p>${s.body}</p>
        <div class="w-dots">${steps.map((_, i) => `<i class="${i === this.step ? 'on' : ''}"></i>`).join('')}</div>
        <div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="${last ? 'go' : 'next'}">${last ? '모험 시작!' : '다음'}</button></div>
      </div>`);
  }

  close() {
    this.el.classList.add('leaving');
    setTimeout(() => this.el.remove(), 500);
  }
}
