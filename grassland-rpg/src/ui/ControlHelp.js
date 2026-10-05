import { baseAt } from '../utils/bases.js';

// PC 조작 안내 (키캡 칩 띠, 퀵슬롯 바로 위) + 처음 하는 행동 힌트 + 건설 안내.
// - 조작 안내: 새 게임은 환영 카드를 닫은 뒤, 이어하기는 바로 잠깐 보였다가 사라진다. H·F1 로 다시 본다.
//   설정 '조작 안내' = auto(자동 숨김) / always(항상) / off(끄기, H 로만). 창이 열려 있으면 타이머가 멈춘다.
// - 힌트: 처음 기지 안 / 첫 레벨업 / 첫 장비 획득에 한 번씩. 본 것은 설정 저장소 seenHints 에 (세이브와 따로).
// - 건설 안내(build:hint)는 따로 .hud-buildhint 에. 조작 안내 숨김과 서로 영향 없다.
const KEYS = [
  [['W', 'A', 'S', 'D'], '이동'], [['Shift'], '달리기'], [['Space'], '구르기'], [['좌클릭'], '공격'], [['Q', 'R'], '스킬'],
  [['I'], '가방'], [['C'], '캐릭터'], [['K'], '스킬창'], [['B'], '건설'], [['M'], '지도'], [['H'], '도움말'],
];
const kbd = (k) => `<kbd>${k}</kbd>`;
const HINTS = {
  base: { pc: `${kbd('B')} 건설 — 기지 안에서 포탑을 지어요`, touch: '기지 안이에요 · <b>건설 메뉴</b>에서 포탑을 지어요' },
  level: { pc: `${kbd('K')} 스킬 포인트를 써 보세요`, touch: '스킬 포인트가 생겼어요 · <b>스킬 창</b>에서 배워요' },
  gear: { pc: `${kbd('I')} 가방에서 장착`, touch: '새 장비! · <b>가방</b>에서 두 번 탭해 장착' },
};

export class ControlHelp {
  constructor(ctx, root, ui, settings) {
    this.ctx = ctx;
    this.ui = ui;
    this.settings = settings;
    this.cfg = ctx.data.config.hud.help;
    this.touch = ctx.input.touchMode;
    this.mode = settings.get('controlHelp') ?? 'auto';
    this.left = 0; // 남은 표시 시간 (auto)
    this.tipLeft = 0;
    this.tips = [];
    this.wasInBase = true; // 시작하자마자 기지 안이면 힌트 없이 (다음 진입부터)

    this.el = document.createElement('div');
    this.el.className = 'hud-help hide';
    this.el.innerHTML = KEYS.map(([keys, label]) => `<span class="kc">${keys.map(kbd).join('')}${label}</span>`).join('');
    this.tipEl = document.createElement('div');
    this.tipEl.className = 'hud-tip hide';
    this.buildEl = document.createElement('div');
    this.buildEl.className = 'hud-buildhint';
    this.buildEl.hidden = true;
    root.append(this.el, this.tipEl, this.buildEl);
    root.style.setProperty('--help-fade', `${this.cfg.fadeSec}s`);

    const { bus } = ctx;
    bus.on('build:hint', ({ text, ok }) => {
      this.buildEl.hidden = !text;
      this.buildEl.textContent = text;
      this.buildEl.classList.toggle('bad', !!text && !ok);
    });
    bus.on('play:started', ({ fresh }) => {
      this.playing = true;
      this.show(fresh ? this.cfg.newGameSec : this.cfg.continueSec);
    });
    bus.on('settings:changed', ({ key, value }) => {
      if (key !== 'controlHelp') return;
      this.mode = value;
      this.refresh();
    });
    bus.on('stats:levelup', () => this.hint('level'));
    bus.on('loot:gained', ({ item }) => {
      if (this.ctx.data.items.items[item]?.category === 'equipment') this.hint('gear');
    });
    // F1 은 브라우저 도움말 대신 조작 안내
    window.addEventListener('keydown', (e) => { if (e.code === 'F1' && this.playing) e.preventDefault(); });
  }

  show(sec) {
    this.left = Math.max(this.left, sec);
    this.refresh();
  }

  // 지금 보일지: 터치 기기는 안 보임, always 는 항상, 그 밖엔 남은 시간이 있을 때 (힌트가 떠 있으면 비켜 준다)
  refresh() {
    const on = !this.touch && this.playing && this.tipLeft <= 0 && (this.mode === 'always' || this.left > 0);
    this.el.classList.toggle('hide', !on);
  }

  hint(id) {
    const seen = this.settings.get('seenHints') ?? [];
    if (seen.includes(id) || this.tips.includes(id)) return;
    this.settings.set('seenHints', [...seen, id]);
    this.tips.push(id);
  }

  update(dt) {
    if (!this.playing) return;
    const input = this.ctx.input;
    if (input.wasPressed('KeyH') || input.wasPressed('F1')) this.show(this.cfg.recallSec);
    // 처음 기지 안에 들어섰을 때
    const inBase = !!baseAt(this.ctx.bases, this.ctx.player.position);
    if (inBase && !this.wasInBase) this.hint('base');
    this.wasInBase = inBase;
    // 창이 열려 있으면 시간이 흐르지 않는다
    const frozen = this.ui.stack.length > 0;
    if (!frozen) this.left = Math.max(0, this.left - dt);
    if (this.tipLeft > 0) {
      if (!frozen) this.tipLeft -= dt;
      if (this.tipLeft <= 0) this.tipEl.classList.add('hide');
    } else if (this.tips.length && !frozen) {
      const id = this.tips.shift();
      this.tipEl.innerHTML = HINTS[id][this.touch ? 'touch' : 'pc'];
      this.tipEl.classList.remove('hide');
      this.tipLeft = this.cfg.tipSec;
    }
    this.refresh();
  }
}
