import { GAME } from '../config.js';
import { COLOR_PRESETS, validateFounder } from '../religion/founding.js';
import { EMBLEMS, DEFAULT_EMBLEM, emblemSvg, emblemOf } from '../religion/emblems.js';
import { esc } from './format.js';
import { icon } from './icons.js';
import { setAccent } from './theme.js';

// 창시 화면 (지원서 양식): 교주 이름·나이, 잉크 색·도장 문양만 정한다.
// 첫 줄·교단 이름·성소·규칙은 계시 I~IV 에서 고른다. 본거지는 늘 대한민국.
const STEPS = [
  { key: 'founder', label: '지원서', title: '교주 지원서', subtitle: '물류센터 야간조, 원룸 거주. 아직 아무도 당신을 모른다.' },
  { key: 'symbol', label: '도장', title: '도장 파기', subtitle: '전단지 구석에 찍을 도장. 동네 도장집 사장님이 색부터 고르라고 했다.' },
];

export function openFounding({ onDone, onCancel, initial = null }) {
  const { min, max } = GAME.leaderAge;
  const f = { founder: '', age: GAME.leaderAge.default, color: COLOR_PRESETS[0], emblem: DEFAULT_EMBLEM, ...(initial ?? {}) };
  let step = 0;
  setAccent(f.color);

  const overlay = document.createElement('div');
  overlay.className = 'overlay founding';
  overlay.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="교주 지원서">
      <div class="steps">${STEPS.map(() => '<i></i>').join('')}</div>
      <div class="sheet-head"><div><div class="step-label"></div><h2></h2><p></p></div>
        <button class="icon-btn panel-close" data-cancel aria-label="닫기">${icon('close')}</button></div>
      <div class="sheet-body"></div>
      <p class="form-error" aria-live="polite"></p>
      <div class="sheet-foot"><button class="btn btn-secondary" data-back>앞장으로</button><button class="btn btn-primary" data-next>다음 장</button></div>
    </div>`;
  document.body.appendChild(overlay);
  const $ = (s) => overlay.querySelector(s);
  const body = $('.sheet-body');

  const canNext = () => (STEPS[step].key === 'founder' ? Boolean(f.founder.trim()) : validateFounder(f).length === 0);

  function updateFoot() {
    $('[data-next]').disabled = !canNext();
    $('[data-next]').textContent = step === STEPS.length - 1 ? '그날 밤으로' : '다음 장';
    $('[data-back]').hidden = step === 0;
    $('.form-error').textContent = '';
  }

  function render() {
    const s = STEPS[step];
    overlay.querySelectorAll('.steps i').forEach((el, i) => el.classList.toggle('is-done', i <= step));
    $('.step-label').textContent = `${step + 1} / ${STEPS.length} · ${s.label}`;
    $('.sheet-head h2').textContent = s.title;
    $('.sheet-head p').textContent = s.subtitle;
    body.innerHTML = VIEWS[s.key]();
    body.scrollTop = 0;
    updateFoot();
    if (s.key === 'founder' && !f.founder) setTimeout(() => body.querySelector('input')?.focus(), 350);
  }

  const VIEWS = {
    founder: () => `
      <div class="field"><label for="f-founder">성명</label>
        <input type="text" id="f-founder" data-field="founder" maxlength="16" placeholder="예: 김영진" value="${esc(f.founder)}" autocomplete="off"></div>
      <div class="field"><label for="f-age">나이 <b class="num" data-age-label>${f.age}세</b></label>
        <input type="range" id="f-age" class="range" data-age min="${min}" max="${max}" step="1" value="${f.age}">
        <div class="range-ticks"><span>${min}세</span><span>${max}세</span></div>
        <p class="panel-note">젊으면 시간이 많다. 나이가 많으면 후계자 걱정을 빨리 하게 된다. 일흔이 넘으면 언제 쓰러질지 모른다.</p></div>
      ${previewChip()}`,
    symbol: () => `${previewChip()}
      <div class="field" style="margin-top:18px"><label>잉크 색</label>
        <div class="swatches">
          ${COLOR_PRESETS.map((c) => `<button class="swatch" style="background:${c};--swatch:${c}" data-color="${c}" aria-label="색 ${c}" aria-pressed="${f.color === c}"></button>`).join('')}
          <span class="swatch swatch-custom" style="--swatch:${f.color}" aria-pressed="${!COLOR_PRESETS.includes(f.color)}" title="직접 고르기"><input type="color" value="${f.color}" data-custom-color aria-label="직접 고르기"></span>
        </div></div>
      <div class="field"><label>도장 문양</label>
        <div class="emblem-grid" role="radiogroup" aria-label="문양">${EMBLEMS.map((e) => `
          <button class="emblem-tile" data-emblem="${e.id}" role="radio" aria-checked="${f.emblem === e.id}" aria-label="${e.name}" title="${e.name}">${emblemSvg(e.id)}</button>`).join('')}
        </div></div>`,
  };

  function previewChip() {
    return `<div class="preview-chip"><div class="emblem">${emblemSvg(f.emblem)}</div><div>
      <b data-preview-name>${f.founder.trim() ? esc(f.founder.trim()) : '이름 칸'}</b><span data-preview-sub>${f.age}세 · 교단 이름은 아직</span>
      <span data-preview-emblem class="preview-emblem-name">도장 · ${emblemOf(f.emblem).name}</span></div></div>`;
  }

  const refreshPreview = () => {
    const n = body.querySelector('[data-preview-name]');
    if (!n) return;
    n.textContent = f.founder.trim() || '이름 칸';
    body.querySelector('[data-preview-sub]').textContent = `${f.age}세 · 교단 이름은 아직`;
    body.querySelector('.preview-chip .emblem').innerHTML = emblemSvg(f.emblem);
    body.querySelector('[data-preview-emblem]').textContent = `도장 · ${emblemOf(f.emblem).name}`;
  };

  overlay.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.field) { f[el.dataset.field] = el.value; refreshPreview(); updateFoot(); }
    if (el.matches('[data-age]')) {
      f.age = Number(el.value);
      body.querySelector('[data-age-label]').textContent = `${f.age}세`;
      refreshPreview();
    }
    if (el.matches('[data-custom-color]')) {
      f.color = el.value;
      setAccent(f.color);
      body.querySelectorAll('[data-color]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      el.parentElement.setAttribute('aria-pressed', 'true');
      el.parentElement.style.setProperty('--swatch', f.color);
    }
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input[type="text"]') && canNext()) go(1);
    if (e.key === 'Escape') cancel();
  });

  overlay.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.matches('[data-cancel]')) return cancel();
    if (t.matches('[data-back]')) return go(-1);
    if (t.matches('[data-next]')) return go(1);
    if (t.dataset.color) {
      f.color = t.dataset.color;
      setAccent(f.color);
      body.querySelectorAll('.swatch').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      return;
    }
    if (t.dataset.emblem) {
      f.emblem = t.dataset.emblem;
      body.querySelectorAll('[data-emblem]').forEach((b) => b.setAttribute('aria-checked', String(b === t)));
      refreshPreview();
      updateFoot();
    }
  });

  function go(dir) {
    if (dir > 0 && !canNext()) return;
    if (dir > 0 && step === STEPS.length - 1) {
      const errors = validateFounder(f);
      if (errors.length) { $('.form-error').textContent = errors[0]; return; }
      close();
      onDone({ ...f });
      return;
    }
    step = Math.max(0, Math.min(STEPS.length - 1, step + dir));
    render();
  }

  function cancel() { close(); onCancel?.(); }
  function close() {
    overlay.classList.add('is-leaving');
    setTimeout(() => overlay.remove(), 250);
  }

  render();
}
