import { dateLabel } from '../game/state.js';
import { esc } from './format.js';
import { modal } from './toast.js';
import { shadowWord } from '../story/words.js';

// 교단 연대기: 지금까지의 계시와 사건 선택을 다시 본다
export function showChronicle(state) {
  const log = state.story.log;
  const darkTotal = state.riskPoints;
  modal({
    title: '지나온 일',
    subtitle: `${esc(state.religion.name || '이름 없는 모임')} · 교주 ${esc(state.leader.name)}`,
    wide: true,
    content: `
      <div class="chronicle-summary">
        <div><small>계시</small><b>${Object.keys(state.story.done).length} / 9</b></div>
        <div><small>사건</small><b>${state.incidents.log.length}</b></div>
        <div><small>장부 서랍</small><b class="${darkTotal >= 8 ? 'bad' : ''}">${shadowWord(darkTotal)}</b></div>
      </div>
      <ol class="chronicle">${log.slice().reverse().map((e) => `
        <li class="chronicle-item is-${e.kind}">
          <span class="chronicle-mark">${e.kind === 'revelation' ? esc(e.numeral) : '·'}</span>
          <div>
            <small>${dateLabel(e.turn)} · ${e.kind === 'revelation' ? '계시' : esc(e.kicker ?? '사건')}${e.dark ? ` · <span class="shadow">서랍에 영수증 ${e.dark}장</span>` : ''}</small>
            <b>${esc(e.title)}</b>
            ${e.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
            ${e.outcome ? `<p class="chronicle-outcome">${esc(e.outcome)}</p>` : ''}
          </div>
        </li>`).join('') || '<li class="muted">아직 아무 일도 없었다.</li>'}</ol>`,
  });
}
