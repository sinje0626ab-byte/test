import { world } from '../data/loader.js';
import { APPROACHES, APPROACH_ORDER, TRAITS, traitsOf, fitOf, bestApproach, approachCost, approachBlocker, adaptOf, prosText } from '../religion/culture.js';
import { esc, int } from './format.js';
import { modal } from './toast.js';

// 나라별 전도 방식 고르기. 고를 때마다 onPick(id, key) → 결과 { ok, message }
export function openApproach(state, id, onPick) {
  const c = world.countries[id];
  const m = modal({ title: `${c.name} 전도 방식`, subtitle: '', content: '', className: 'approach-sheet' });

  const render = () => {
    m.el.querySelector('.sheet-head p')?.remove();
    m.el.querySelector('.sheet-head > div').insertAdjacentHTML('beforeend', `<p>보유 신앙력 <b class="num" style="color:var(--label)">${int(state.faith)}</b> · 바꾸는 데 <b class="num" style="color:var(--label)">${int(approachCost(state))}</b></p>`);
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
            <div class="approach-name"><b>${a.name}</b><span class="badge fit ${fit.tone}">${fit.label}</span>${key === best ? '<span class="badge rec">추천</span>' : ''}</div>
            <p>${esc(a.desc)}</p>
            <p class="approach-fx"><span class="${fit.factor > 0 ? 'up' : 'down'}">${esc(prosText(id, key))}</span> · <span>${esc(a.cons)}</span></p>
            ${blocker && !using && blocker !== '신앙력 부족' ? `<div class="lock">${esc(blocker)}</div>` : ''}
          </div>
          ${using
            ? `<span class="approach-using">사용 중<small>${Math.round(adaptOf(state, id) * 100)}% 정착</small></span>`
            : `<button class="btn ${!blocker && key === best ? 'btn-primary' : 'btn-secondary'} btn-sm prod-buy" data-pick="${key}" ${blocker ? 'disabled' : ''}><span class="faith-mark"></span><span class="num">${int(approachCost(state))}</span></button>`}
        </div>`;
      }).join('')}</div>
      <p class="panel-note">장점은 이 나라 기질과 맞을수록 커지고, 맞지 않으면 오히려 역효과가 납니다. 단점은 궁합과 상관없이 따라옵니다. 바꾼 방식은 몇 달에 걸쳐 자리를 잡습니다.</p>`;
  };

  m.body.addEventListener('click', (e) => {
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
  if (!list.length) return '<div class="trait-chips"><span class="trait-chip">뚜렷한 기질 없음</span></div>';
  return `<div class="trait-chips">${list.map((t) => `<span class="trait-chip" title="${esc(TRAITS[t].desc)}">${TRAITS[t].name}</span>`).join('')}</div>`;
}
