// 설정 창 내용. 타이틀과 게임 메뉴가 같은 카드 안에 그려서 쓴다.
const OPTIONS = {
  shadows: [['off', '끄기'], ['low', '낮음'], ['high', '높음']],
  decorDensity: [[0.5, '50%'], [1, '100%']],
};

export class SettingsPanel {
  constructor(settings, save, ctx) {
    this.settings = settings;
    this.save = save;
    this.ctx = ctx;
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
      <h3 class="set-h">저장 옮기기 <small>(슬롯 ${this.save.slot})</small></h3>
      <div class="set-transfer">
        <button type="button" class="t-menu-btn" data-export>내보내기 (복사)</button>
        <textarea data-code rows="3" placeholder="다른 기기에서 내보낸 글자를 여기에 붙여 넣으세요"></textarea>
        <button type="button" class="t-menu-btn" data-import>가져오기</button>
        <p class="set-msg" data-msg></p>
      </div>
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
    this.bindTransfer(card);
  }

  // 저장 내보내기: 문자열을 칸에 띄우고 클립보드에 복사. 가져오기: 이 슬롯에 넣는다
  // (게임 중이면 불러오기 위해 페이지를 새로 연다)
  bindTransfer(card) {
    const code = card.querySelector('[data-code]');
    const msg = card.querySelector('[data-msg]');
    card.querySelector('[data-export]').addEventListener('click', () => {
      const text = this.save.exportString();
      if (!text) { msg.textContent = '아직 저장이 없어요'; return; }
      code.value = text;
      code.select();
      navigator.clipboard?.writeText(text).then(() => { msg.textContent = '복사했어요! 다른 기기에서 가져오기에 붙여 넣으세요'; }, () => { msg.textContent = '위 글자를 길게 눌러 복사하세요'; });
    });
    card.querySelector('[data-import]').addEventListener('click', () => {
      const err = this.save.importString(code.value);
      if (err) { msg.textContent = err; return; }
      msg.textContent = '가져왔어요!';
      if (this.ctx.state !== 'title') {
        this.save.disabled = true; // 새로 열 때 지금 게임이 덮어쓰지 않게
        setTimeout(() => location.reload(), 600);
      }
    });
  }
}
