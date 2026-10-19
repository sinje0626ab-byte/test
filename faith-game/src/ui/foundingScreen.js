import { GAME } from '../config.js';
import { COLOR_PRESETS, validateFounder } from '../religion/founding.js';
import { EMBLEMS, DEFAULT_EMBLEM, emblemSvg, emblemOf } from '../religion/emblems.js';
import { esc } from './format.js';
import { icon } from './icons.js';
import { setAccent } from './theme.js';

// 창시 화면: 교주 이름·나이, 상징 색·문양만 정한다.
// 절대 원칙·교단 이름·본거지·울타리는 계시 I~IV 에서 고른다.
const STEPS = [
  { key: 'founder', label: '교주', title: '평범한 사람', subtitle: '아직은 아무도 당신을 모릅니다. 이름과 나이부터 정하세요.' },
  { key: 'symbol', label: '상징', title: '상징', subtitle: '언젠가 전 세계가 알아볼 색과 문양입니다.' },
];

export function openFounding({ onDone, onCancel }) {
  const { min, max } = GAME.leaderAge;
  const f = { founder: '', age: GAME.leaderAge.default, color: COLOR_PRESETS[0], emblem: DEFAULT_EMBLEM };
  let step = 0;
  setAccent(f.color);

  const overlay = document.createElement('div');
  overlay.className = 'overlay founding';
  overlay.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="교주 정하기">
      <div class="steps">${STEPS.map(() => '<i></i>').join('')}</div>
      <div class="sheet-head"><div><div class="step-label"></div><h2></h2><p></p></div>
        <button class="icon-btn panel-close" data-cancel aria-label="닫기">${icon('close')}</button></div>
      <div class="sheet-body"></div>
      <p class="form-error" aria-live="polite"></p>
      <div class="sheet-foot"><button class="btn btn-secondary" data-back>이전</button><button class="btn btn-primary" data-next>다음</button></div>
    </div>`;
  document.body.appendChild(overlay);
  const $ = (s) => overlay.querySelector(s);
  const body = $('.sheet-body');

  const canNext = () => (STEPS[step].key === 'founder' ? Boolean(f.founder.trim()) : validateFounder(f).length === 0);

  function updateFoot() {
    $('[data-next]').disabled = !canNext();
    $('[data-next]').textContent = step === STEPS.length - 1 ? '그날 밤으로' : '다음';
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
      <div class="field"><label for="f-founder">교주 이름</label>
        <input type="text" id="f-founder" data-field="founder" maxlength="16" placeholder="예: 한결" value="${esc(f.founder)}" autocomplete="off"></div>
      <div class="field"><label for="f-age">나이 <b class="num" data-age-label>${f.age}세</b></label>
        <input type="range" id="f-age" class="range" data-age min="${min}" max="${max}" step="1" value="${f.age}">
        <div class="range-ticks"><span>${min}세</span><span>${max}세</span></div>
        <p class="panel-note">젊으면 시간이 많고, 나이가 들면 '그림자'가 빨리 찾아옵니다. 70세가 넘으면 언제든 쓰러질 수 있습니다.</p></div>
      ${previewChip()}`,
    symbol: () => `${previewChip()}
      <div class="field" style="margin-top:18px"><label>상징 색</label>
        <div class="swatches">
          ${COLOR_PRESETS.map((c) => `<button class="swatch" style="background:${c};--swatch:${c}" data-color="${c}" aria-label="색 ${c}" aria-pressed="${f.color === c}"></button>`).join('')}
          <span class="swatch swatch-custom" style="--swatch:${f.color}" aria-pressed="${!COLOR_PRESETS.includes(f.color)}" title="직접 고르기"><input type="color" value="${f.color}" data-custom-color aria-label="직접 고르기"></span>
        </div></div>
      <div class="field"><label>문양</label>
        <div class="emblem-grid" role="radiogroup" aria-label="문양">${EMBLEMS.map((e) => `
          <button class="emblem-tile" data-emblem="${e.id}" role="radio" aria-checked="${f.emblem === e.id}" aria-label="${e.name}" title="${e.name}">${emblemSvg(e.id)}</button>`).join('')}
        </div></div>`,
  };

  function previewChip() {
    return `<div class="preview-chip"><div class="emblem">${emblemSvg(f.emblem)}</div><div>
      <b data-preview-name>${f.founder.trim() ? esc(f.founder.trim()) : '교주 이름'}</b><span data-preview-sub>${f.age}세 · 아직 이름 없는 믿음</span>
      <span data-preview-emblem class="preview-emblem-name">문양 · ${emblemOf(f.emblem).name}</span></div></div>`;
  }

  const refreshPreview = () => {
    const n = body.querySelector('[data-preview-name]');
    if (!n) return;
    n.textContent = f.founder.trim() || '교주 이름';
    body.querySelector('[data-preview-sub]').textContent = `${f.age}세 · 아직 이름 없는 믿음`;
    body.querySelector('.preview-chip .emblem').innerHTML = emblemSvg(f.emblem);
    body.querySelector('[data-preview-emblem]').textContent = `문양 · ${emblemOf(f.emblem).name}`;
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
