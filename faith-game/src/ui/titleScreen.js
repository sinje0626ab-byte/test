import { world } from '../data/loader.js';
import { totalFollowers, dateLabel } from '../game/state.js';
import { stageOf } from '../game/stages.js';
import { GAME } from '../config.js';
import { esc, people } from './format.js';
import { icon, MARK } from './icons.js';
import { setAccent } from './theme.js';
import { emblemSvg } from '../religion/emblems.js';
import { onColor } from './format.js';

// 시작 화면: 이어하기 / 새로 창시
export function showTitle({ saved, onContinue, onNew }) {
  setAccent(saved?.religion.color ?? '#0a84ff');
  const el = document.createElement('div');
  el.className = 'title-screen';
  el.innerHTML = `
    <div class="title-card">
      ${MARK}
      ${GAME.title ? `<h1>${esc(GAME.title)}</h1>` : '<h1>평범한 당신이<br>교주가 되는 밤</h1>'}
      <p class="lead">세상을 구원할 답을 아는 사람은 오직 당신뿐이다.<br>적어도, 당신 생각에는.</p>
      <div class="title-actions">
        ${saved ? `<button class="continue-card glass" data-continue>
          <span class="emblem-badge" style="background:${esc(saved.religion.color)};color:${onColor(saved.religion.color)}">${emblemSvg(saved.religion.emblem)}</span>
          <span><b>${esc(saved.religion.name || '아직 이름 없는 믿음')}</b><span>${saved.religion.home ? `${esc(world.countries[saved.religion.home].name)} · ${dateLabel(saved.turn)} · ${stageOf(saved.stage).name} · 신도 ${people(totalFollowers(saved))}명` : `교주 ${esc(saved.leader.name)} · 계시를 기다리는 중`}</span></span>
          ${icon('chevron')}</button>` : ''}
        <button class="btn ${saved ? 'btn-secondary' : 'btn-primary'} btn-lg btn-block" data-new>${saved ? '처음부터 다시' : '교주가 된다'}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  const close = () => { el.style.animation = 'fade-out .3s forwards'; setTimeout(() => el.remove(), 300); };
  el.querySelector('[data-continue]')?.addEventListener('click', () => { close(); onContinue(); });
  el.querySelector('[data-new]').addEventListener('click', () => { close(); onNew(); });
  return { close };
}
