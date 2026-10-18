import { world } from '../data/loader.js';
import { totalFollowers, dateLabel } from '../game/state.js';
import { stageOf } from '../game/stages.js';
import { GAME } from '../config.js';
import { esc, people } from './format.js';
import { icon, MARK } from './icons.js';
import { setAccent } from './theme.js';

// 시작 화면: 이어하기 / 새로 창시
export function showTitle({ saved, onContinue, onNew }) {
  setAccent(saved?.religion.color ?? '#0a84ff');
  const el = document.createElement('div');
  el.className = 'title-screen';
  el.innerHTML = `
    <div class="title-card">
      ${MARK}
      ${GAME.title ? `<h1>${esc(GAME.title)}</h1>` : '<h1>하나의 믿음이<br>세계로 퍼져 나갑니다</h1>'}
      <p class="lead">새로운 종교를 세우고, 한 달씩 세상에 전하세요.</p>
      <div class="title-actions">
        ${saved ? `<button class="continue-card glass" data-continue>
          <span class="dot" style="background:${esc(saved.religion.color)}"></span>
          <span><b>${esc(saved.religion.name)}</b><span>${esc(world.countries[saved.religion.home]?.name ?? '')}에서 시작 · ${dateLabel(saved.turn)} · ${stageOf(saved.stage).name} · 신도 ${people(totalFollowers(saved))}명</span></span>
          ${icon('chevron')}</button>` : ''}
        <button class="btn ${saved ? 'btn-secondary' : 'btn-primary'} btn-lg btn-block" data-new>새 종교 창시</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  const close = () => { el.style.animation = 'fade-out .3s forwards'; setTimeout(() => el.remove(), 300); };
  el.querySelector('[data-continue]')?.addEventListener('click', () => { close(); onContinue(); });
  el.querySelector('[data-new]').addEventListener('click', () => { close(); onNew(); });
  return { close };
}
