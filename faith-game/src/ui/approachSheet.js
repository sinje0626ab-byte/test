import { world } from '../data/loader.js';
import { APPROACHES, APPROACH_ORDER, TRAITS, traitsOf, fitOf, bestApproach, approachCost, approachBlocker, adaptOf, prosText } from '../religion/culture.js';
import { esc, int } from './format.js';
import { modal } from './toast.js';

// 나라별 전도 방식 고르기. 고를 때마다 onPick(id, key) → 결과 { ok, message }
export function openApproach(state, id, onPick) {
  const c = world.countries[id];
  const m = modal({ title: `${c.name}에서는 어떻게 할까`, subtitle: '', content: '', className: 'approach-sheet' });

  const render = () => {
    m.el.querySelector('.sheet-head p')?.remove();
    m.el.querySelector('.sheet-head > div').insertAdjacentHTML('beforeend', `<p>금고 <b class="num">${int(state.faith)}</b> · 바꾸는 데 <b class="num">${int(approachCost(state))}</b></p>`);
    const cur = state.countries[id].approach?.id;
    const best = bestApproach(id);
    m.body.innerHTML = `
      ${traitChips(id)}
      <p class="panel-note trait-note">${traitsOf(id).slice(0, 2).map((t) => esc(TRAITS[t].desc)).join(' ')}</p>
      <div class="list approach-list">${APPROACH_ORDER.map((key) => {
        const a = APPROACHES[key];
        const fit = fitOf(id, key);
        const blocker = approachBlocker(state, id, key);
        const using = cur === key;
        return `<div class="approach-item ${using ? 'is-current' : ''}">
          <div class="prod-text">
            <div class="approach-name"><b>${a.name}</b><span class="badge fit ${fit.tone}">${fit.label}</span>${key === best ? '<span class="badge rec">추천</span>' : ''}<span class="rv-info" data-ainfo role="button" tabindex="0" aria-label="정확한 효과 보기">i</span></div>
            <p>${esc(a.desc)}</p>
            <p class="approach-fx"><span class="${fit.factor > 0 ? 'up' : 'down'}">${esc(prosText(id, key))}</span> · <span>${esc(a.cons)}</span></p>
            ${blocker && !using && blocker !== '신앙력이 모자란다' ? `<div class="lock">${esc(blocker)}</div>` : ''}
          </div>
          ${using
            ? `<span class="approach-using">하는 중<small>${adaptOf(state, id) < 1 ? '자리 잡는 중' : '자리 잡음'}</small></span>`
            : `<button class="btn ${!blocker && key === best ? 'btn-primary' : 'btn-secondary'} btn-sm prod-buy" data-pick="${key}" ${blocker ? 'disabled' : ''}><span class="faith-mark"></span><span class="num">${int(approachCost(state))}</span></button>`}
        </div>`;
      }).join('')}</div>
      <p class="panel-note">동네랑 맞으면 잘 먹히고, 안 맞으면 오히려 손해다. 따라오는 부작용은 맞든 안 맞든 똑같다. 바꾸면 자리 잡는 데 몇 달 걸린다. 정확한 효과는 i를 눌러 본다.</p>`;
  };

  m.body.addEventListener('click', (e) => {
    const info = e.target.closest('[data-ainfo]');
    if (info) { info.closest('.approach-item').classList.toggle('show-fx'); return; }
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    const r = onPick(id, b.dataset.pick);
    if (r?.ok) m.close();
    else render();
  });
  render();
  return m;
}

export function traitChips(id) {
  const list = traitsOf(id);
  if (!list.length) return '<div class="trait-chips"><span class="trait-chip">딱히 특징 없음</span></div>';
  return `<div class="trait-chips">${list.map((t) => `<span class="trait-chip" title="${esc(TRAITS[t].desc)}">${TRAITS[t].name}</span>`).join('')}</div>`;
}
