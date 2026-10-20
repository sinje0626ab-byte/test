import { totalFollowers, dateLabel } from '../game/state.js';
import { stageOf } from '../game/stages.js';
import { GAME } from '../config.js';
import { esc, people } from './format.js';
import { setAccent } from './theme.js';
import { emblemSvg } from '../religion/emblems.js';
import { onColor } from './format.js';

// 시작 화면: 전봇대에 붙은 반쯤 뜯긴 전단지. 아래 연락처 쪽지를 뜯어 가면 시작한다.
// 이어하기는 전단지 위에 덧붙인 메모지.
export function showTitle({ saved, onContinue, onNew }) {
  setAccent(saved?.religion.color ?? '#b7322a');
  const el = document.createElement('div');
  el.className = 'title-screen';
  const tabs = Array.from({ length: 7 }, (_, i) => `<button class="tear-tab ${i === 1 || i === 4 ? 'is-torn' : ''}" ${i === 1 || i === 4 ? 'disabled aria-hidden="true"' : 'data-new'}><span>교주 지원<br>☎ 지금 바로</span></button>`).join('');
  el.innerHTML = `
    <div class="pole" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="flyer-stack">
      <div class="flyer-old" aria-hidden="true"><b>원룸 급매</b><span>보증금 500 / 45</span></div>
      <article class="flyer">
        <span class="tape tape-l" aria-hidden="true"></span><span class="tape tape-r" aria-hidden="true"></span>
        <p class="flyer-kicker">급구 · 경력 무관 · 나이 무관</p>
        <h1>${GAME.title ? esc(GAME.title) : '교주 모집'}</h1>
        <p class="flyer-lead">새벽에 누가 이름을 불렀다면,<br>당신이 맞습니다.</p>
        <ul class="flyer-list">
          <li>성소 보증금 본인 부담</li>
          <li>첫 신도: 엄마, 친구, 모르는 사람 각 1명 제공</li>
          <li>4대 보험 없음. 대신 4대 계시 있음</li>
        </ul>
        <div class="flyer-stamp" aria-hidden="true">마감<br>임박</div>
        <div class="tear-row">${tabs}</div>
      </article>
      ${saved ? `<button class="memo-continue" data-continue>
        <span class="memo-pin" aria-hidden="true"></span>
        <span class="emblem-badge" style="background:${esc(saved.religion.color)};color:${onColor(saved.religion.color)}">${emblemSvg(saved.religion.emblem)}</span>
        <span class="memo-text"><b>${esc(saved.religion.name || '아직 이름 없는 모임')}</b>
        <span>${saved.religion.home ? `${dateLabel(saved.turn)} · ${stageOf(saved.stage).name} · 신도 ${people(totalFollowers(saved))}명` : `교주 ${esc(saved.leader.name)} · 아직 첫날 밤`}</span>
        <em>하던 거 계속하기 →</em></span></button>` : ''}
    </div>
    <p class="title-hint">${saved ? '메모를 누르면 이어서, 쪽지를 뜯으면 처음부터.' : '아래 쪽지를 하나 뜯어 가세요.'}</p>`;
  document.body.appendChild(el);
  const close = () => { el.style.animation = 'fade-out .3s forwards'; setTimeout(() => el.remove(), 300); };
  el.querySelector('[data-continue]')?.addEventListener('click', () => { close(); onContinue(); });
  el.querySelectorAll('[data-new]').forEach((b) => b.addEventListener('click', () => {
    b.classList.add('is-tearing');
    setTimeout(() => { close(); onNew(); }, 380);
  }));
  return { close };
}
