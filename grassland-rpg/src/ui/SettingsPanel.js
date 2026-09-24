// 설정 창 내용. 타이틀과 게임 메뉴가 같은 카드 안에 그려서 쓴다.
const OPTIONS = {
  shadows: [['off', '끄기'], ['low', '낮음'], ['high', '높음']],
  decorDensity: [[0.5, '50%'], [1, '100%']],
};

export class SettingsPanel {
  constructor(settings) {
    this.settings = settings;
  }

  // card 안에 그리고, "돌아가기"를 누르면 onBack
  render(card, onBack) {
    const v = this.settings.values;
    const seg = (key) => `
      <div class="seg" data-seg="${key}">
        ${OPTIONS[key].map(([val, label]) => `<button type="button" data-val="${val}" class="${String(v[key]) === String(val) ? 'on' : ''}">${label}</button>`).join('')}
      </div>`;
    const toggle = (key) => `<button type="button" class="tog${v[key] ? ' on' : ''}" data-toggle="${key}"><i></i></button>`;
    const slider = (key) => `<input type="range" min="0" max="100" step="5" value="${Math.round(v[key] * 100)}" data-slider="${key}">`;
    card.innerHTML = `
      <h2>설정</h2>
      <div class="set-list">
        <label><span>배경음</span>${slider('musicVolume')}</label>
        <label><span>효과음</span>${slider('sfxVolume')}</label>
        <div class="set-row"><span>화면 흔들림</span>${toggle('shake')}</div>
        <div class="set-row"><span>데미지 숫자</span>${toggle('damageNumbers')}</div>
        <div class="set-row"><span>그림자</span>${seg('shadows')}</div>
        <div class="set-row"><span>풀·꽃 장식</span>${seg('decorDensity')}</div>
      </div>
      <p class="set-note">휴대폰이 느리면 그림자를 낮추고 장식을 50%로 줄여 보세요.</p>
      <div class="t-actions"><button type="button" class="t-menu-btn primary" data-set-back>돌아가기</button></div>`;

    card.querySelectorAll('[data-slider]').forEach((el) => {
      el.addEventListener('input', () => this.settings.set(el.dataset.slider, Number(el.value) / 100));
    });
    card.querySelectorAll('[data-toggle]').forEach((el) => {
      el.addEventListener('click', () => {
        const key = el.dataset.toggle;
        this.settings.set(key, !this.settings.get(key));
        el.classList.toggle('on', this.settings.get(key));
      });
    });
    card.querySelectorAll('[data-seg]').forEach((seg) => {
      seg.addEventListener('click', (e) => {
        const b = e.target.closest('[data-val]');
        if (!b) return;
        const raw = b.dataset.val;
        this.settings.set(seg.dataset.seg, Number.isNaN(Number(raw)) ? raw : Number(raw));
        seg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      });
    });
    card.querySelector('[data-set-back]').addEventListener('click', onBack);
  }
}
