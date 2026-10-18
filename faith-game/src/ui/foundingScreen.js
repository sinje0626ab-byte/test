import { GAME } from '../config.js';
import { world } from '../data/loader.js';
import { DEITIES, DEITY_ORDER } from '../religion/deities.js';
import { TENETS, TENET_ORDER } from '../religion/tenets.js';
import { COLOR_PRESETS, validateFounding } from '../religion/founding.js';
import { difficulty, baseResistance } from '../religion/spread.js';
import { esc, people, pct } from './format.js';
import { icon } from './icons.js';
import { setAccent } from './theme.js';

const STEPS = [
  { key: 'identity', label: '이름', title: '새로운 종교', subtitle: '세상에 알릴 이름과 상징 색을 정하세요.' },
  { key: 'deity', label: '신앙 대상', title: '무엇을 믿나요', subtitle: '신앙 대상은 하나만 고를 수 있습니다.' },
  { key: 'tenets', label: '교리', title: '교리', subtitle: '' },
  { key: 'home', label: '시작 국가', title: '어디서 시작할까요', subtitle: '종교 자유도가 높고 저항이 약한 나라일수록 쉽습니다.' },
  { key: 'review', label: '확인', title: '창시 준비 완료', subtitle: '이대로 첫 신도들과 함께 시작합니다.' },
];

const SORTS = { ease: '쉬운 순', name: '이름순', pop: '인구순' };

// 종교 창시 화면. 완료되면 onDone(입력값)을 부른다.
export function openFounding({ onDone, onCancel }) {
  const f = { name: '', founder: '', color: COLOR_PRESETS[0], deity: null, tenets: [], home: null };
  let step = 0;
  let query = '';
  let sort = 'ease';
  setAccent(f.color);

  const overlay = document.createElement('div');
  overlay.className = 'overlay founding';
  overlay.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="종교 창시">
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

  function canNext() {
    switch (STEPS[step].key) {
      case 'identity': return f.name.trim() && f.founder.trim();
      case 'deity': return Boolean(f.deity);
      case 'tenets': return f.tenets.length === GAME.tenetSlots;
      case 'home': return Boolean(f.home);
      default: return validateFounding(f).length === 0;
    }
  }

  function updateFoot() {
    $('[data-next]').disabled = !canNext();
    $('[data-next]').textContent = step === STEPS.length - 1 ? '창시하기' : '다음';
    $('[data-back]').hidden = step === 0;
    $('.form-error').textContent = '';
  }

  function render() {
    const s = STEPS[step];
    overlay.querySelectorAll('.steps i').forEach((el, i) => el.classList.toggle('is-done', i <= step));
    $('.step-label').textContent = `${step + 1} / ${STEPS.length} · ${s.label}`;
    $('.sheet-head h2').textContent = s.title;
    $('.sheet-head p').textContent = s.key === 'tenets' ? `${TENET_ORDER.length}가지 중 ${GAME.tenetSlots}가지를 고르세요. 모든 교리에는 장단점이 있습니다.` : s.subtitle;
    body.innerHTML = VIEWS[s.key]();
    body.scrollTop = 0;
    updateFoot();
    if (s.key === 'identity' && !f.name) setTimeout(() => body.querySelector('input')?.focus(), 350);
  }

  const effects = (d) => `<div class="effects">${d.pros.map((p) => `<span class="pro">▲ ${esc(p)}</span>`).join('')}${d.cons.map((c) => `<span class="con">▼ ${esc(c)}</span>`).join('')}</div>`;
  const check = `<span class="check">${icon('check')}</span>`;

  const VIEWS = {
    identity: () => `
      <div class="field"><label for="f-name">종교 이름</label>
        <input type="text" id="f-name" data-field="name" maxlength="20" placeholder="예: 새벽빛 공동체" value="${esc(f.name)}" autocomplete="off"></div>
      <div class="field"><label for="f-founder">교주 이름</label>
        <input type="text" id="f-founder" data-field="founder" maxlength="16" placeholder="예: 한결" value="${esc(f.founder)}" autocomplete="off"></div>
      <div class="field"><label>상징 색</label>
        <div class="swatches">
          ${COLOR_PRESETS.map((c) => `<button class="swatch" style="background:${c};--swatch:${c}" data-color="${c}" aria-label="색 ${c}" aria-pressed="${f.color === c}"></button>`).join('')}
          <span class="swatch swatch-custom" style="--swatch:${f.color}" aria-pressed="${!COLOR_PRESETS.includes(f.color)}" title="직접 고르기"><input type="color" value="${f.color}" data-custom-color aria-label="직접 고르기"></span>
        </div></div>
      ${previewChip()}`,

    deity: () => `<div class="options">${DEITY_ORDER.map((id) => {
      const d = DEITIES[id];
      return `<button class="option" data-deity="${id}" aria-pressed="${f.deity === id}">${check}<b>${esc(d.name)}</b><p>${esc(d.desc)}</p>${effects(d)}</button>`;
    }).join('')}</div>`,

    tenets: () => `<div class="options grid">${TENET_ORDER.map((id) => {
      const t = TENETS[id];
      const on = f.tenets.includes(id);
      const full = !on && f.tenets.length >= GAME.tenetSlots;
      return `<button class="option" data-tenet="${id}" aria-pressed="${on}" ${full ? 'disabled' : ''}>${check}<b>${esc(t.name)}</b><p>${esc(t.desc)}</p>${effects(t)}</button>`;
    }).join('')}</div>`,

    home: () => `
      <div class="country-search">
        <div style="position:relative">${icon('search')}<input type="search" data-query placeholder="나라 또는 지역 검색" value="${esc(query)}" autocomplete="off"></div>
        <div class="segmented" role="group" aria-label="정렬">${Object.entries(SORTS).map(([k, v]) => `<button data-sort="${k}" aria-pressed="${sort === k}">${v}</button>`).join('')}</div>
      </div>
      <div class="country-list">${countryRows()}</div>`,

    review: () => {
      const c = world.countries[f.home];
      const d = difficulty(f.home);
      return `${previewChip()}
        <div class="summary-grid">
          <div><small>신앙 대상</small><b>${esc(DEITIES[f.deity].name)}</b></div>
          <div><small>시작 국가</small><b>${esc(c.name)}</b> <span class="pill tone-${d.tone}">${d.label}</span></div>
          <div class="wide"><small>교리</small><b>${f.tenets.map((t) => esc(TENETS[t].name)).join(' · ')}</b></div>
          <div><small>종교 자유도</small><b class="num">${c.freedom}</b></div>
          <div><small>기존 종교 저항력</small><b class="num">${pct(baseResistance(f.home))}</b></div>
        </div>
        <p class="panel-note" style="margin-top:14px">교주와 첫 신도 ${GAME.startFollowers}명, 선교사 1명으로 시작합니다. 세계 인구의 30%가 믿게 되면 승리, 신도가 모두 떠나면 패배합니다.</p>`;
    },
  };

  function previewChip() {
    const initial = (f.name.trim() || '?').slice(0, 1);
    return `<div class="preview-chip"><div class="emblem">${esc(initial)}</div><div>
      <b data-preview-name>${esc(f.name.trim() || '종교 이름')}</b><span data-preview-founder>${f.founder.trim() ? `교주 ${esc(f.founder.trim())}` : '교주 이름'}</span></div></div>`;
  }

  function countryRows() {
    const q = query.trim();
    let ids = world.ids.filter((id) => {
      const c = world.countries[id];
      return !q || c.name.includes(q) || c.region.includes(q);
    });
    const score = new Map(ids.map((id) => [id, difficulty(id)]));
    if (sort === 'ease') ids.sort((a, b) => score.get(b).score - score.get(a).score);
    if (sort === 'name') ids.sort((a, b) => world.countries[a].name.localeCompare(world.countries[b].name, 'ko'));
    if (sort === 'pop') ids.sort((a, b) => world.countries[b].pop - world.countries[a].pop);
    if (!ids.length) return `<div class="row muted">검색 결과가 없습니다.</div>`;
    return ids.map((id) => {
      const c = world.countries[id];
      const d = score.get(id);
      return `<button class="country-row" data-home="${id}" aria-pressed="${f.home === id}">
        <span class="radio">${icon('check')}</span>
        <span class="grow"><b>${esc(c.name)}</b><small>${esc(c.region)} · 인구 ${people(c.pop)} · 자유도 ${c.freedom}</small></span>
        <span class="pill tone-${d.tone}">${d.label}</span></button>`;
    }).join('');
  }

  overlay.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.field) {
      f[el.dataset.field] = el.value;
      const name = body.querySelector('[data-preview-name]');
      if (name) {
        name.textContent = f.name.trim() || '종교 이름';
        body.querySelector('[data-preview-founder]').textContent = f.founder.trim() ? `교주 ${f.founder.trim()}` : '교주 이름';
        body.querySelector('.emblem').textContent = (f.name.trim() || '?').slice(0, 1);
      }
      updateFoot();
    }
    if (el.matches('[data-custom-color]')) {
      f.color = el.value;
      setAccent(f.color);
      body.querySelectorAll('[data-color]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      el.parentElement.setAttribute('aria-pressed', 'true');
      el.parentElement.style.setProperty('--swatch', f.color);
    }
    if (el.matches('[data-query]')) {
      query = el.value;
      body.querySelector('.country-list').innerHTML = countryRows();
    }
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input[type="text"]') && canNext()) go(1);
    if (e.key === 'Escape') cancel();
  });

  overlay.addEventListener('click', (e) => {
    const t = e.target.closest('button, [data-custom-color]');
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
    if (t.dataset.deity) {
      f.deity = t.dataset.deity;
      body.querySelectorAll('[data-deity]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      return updateFoot();
    }
    if (t.dataset.tenet) {
      const id = t.dataset.tenet;
      f.tenets = f.tenets.includes(id) ? f.tenets.filter((x) => x !== id) : [...f.tenets, id].slice(0, GAME.tenetSlots);
      const keep = body.scrollTop;
      body.innerHTML = VIEWS.tenets();
      body.scrollTop = keep;
      return updateFoot();
    }
    if (t.dataset.sort) {
      sort = t.dataset.sort;
      body.querySelectorAll('[data-sort]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      body.querySelector('.country-list').innerHTML = countryRows();
      return;
    }
    if (t.dataset.home) {
      f.home = t.dataset.home;
      body.querySelectorAll('[data-home]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      return updateFoot();
    }
  });

  function go(dir) {
    if (dir > 0 && !canNext()) return;
    if (dir > 0 && step === STEPS.length - 1) {
      const errors = validateFounding(f);
      if (errors.length) { $('.form-error').textContent = errors[0]; return; }
      close();
      onDone({ ...f, tenets: [...f.tenets] });
      return;
    }
    step = Math.max(0, Math.min(STEPS.length - 1, step + dir));
    render();
  }

  function cancel() {
    close();
    onCancel?.();
  }

  function close() {
    overlay.classList.add('is-leaving');
    setTimeout(() => overlay.remove(), 250);
  }

  render();
}
