import { choiceAvailable, textOf, resolveIncident } from '../story/storyEngine.js';
import { dateLabel } from '../game/state.js';
import { esc } from './format.js';

// 사건 카드: 짧은 상황 + 선택지 2~3개 → 결과 한 줄
export function showIncident(state, card, ctx, { onDone } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay incident';
  overlay.innerHTML = `
    <div class="sheet incident-sheet" role="dialog" aria-modal="true" aria-label="${esc(card.title)}">
      <div class="incident-head">
        <span class="incident-kicker">${esc(card.kicker)} · ${dateLabel(state.turn)}</span>
        <h2>${esc(card.title)}</h2>
        <p>${esc(card.text(state, ctx))}</p>
      </div>
      <div class="sheet-body">
        <div class="incident-choices">${card.choices.map((c) => {
          const ok = choiceAvailable(state, c);
          const cost = c.cost ? c.cost(state) : 0;
          return `<button class="incident-choice" data-choice="${c.id}" ${ok === true ? '' : 'disabled'}>
            <b>${esc(c.label)}</b>
            <span>${esc(textOf(state, c.effectText))}</span>
            <span class="incident-meta">${cost ? `<em class="cost"><i class="faith-mark"></i>${cost}</em>` : ''}${c.dark ? `<em class="shadow">${'●'.repeat(Math.min(4, c.dark))} 그림자</em>` : ''}${ok === true ? '' : `<em class="lock">${esc(ok)}</em>`}</span>
          </button>`;
        }).join('')}</div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const body = overlay.querySelector('.sheet-body');
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-choice]');
    if (!b || b.disabled) return;
    const { outcome } = resolveIncident(state, card, ctx, b.dataset.choice);
    body.innerHTML = `<p class="incident-outcome">${esc(outcome)}</p><div class="sheet-foot" style="padding:12px 0 0"><button class="btn btn-primary" data-ok>확인</button></div>`;
    body.querySelector('[data-ok]').addEventListener('click', () => {
      overlay.classList.add('is-leaving');
      setTimeout(() => { overlay.remove(); onDone?.(); }, 250);
    });
  });
}
