import { world } from '../data/loader.js';
import { totalFollowers, dateLabel } from '../game/state.js';
import { stageOf, stageProgress } from '../game/stages.js';
import { faithIncome } from '../game/turn.js';
import { VICTORY_SHARE } from '../config.js';
import { mood } from '../story/words.js';
import { esc, people, pct, int } from './format.js';
import { icon } from './icons.js';
import { emblemSvg } from '../religion/emblems.js';
import { isJailed } from '../game/leader.js';

// 상단: 교단 주보 머리. 호수·날짜·교단명 / 신도·신앙력 / 간부들 분위기 / 다음 단계
export function renderHud(el, state) {
  const total = totalFollowers(state);
  const prog = stageProgress(state);
  const stage = stageOf(state.stage);
  const nextText = prog.next
    ? `다음: ${prog.next.name} (${people(prog.next.followers)}명${prog.next.countries ? `, ${prog.next.countries}개국` : ''})`
    : `지구 인구 ${pct(total / world.totalPop)} / ${Math.round(VICTORY_SHARE * 100)}%`;
  const change = Math.round(state.lastReport?.change ?? 0);
  const income = faithIncome(state);
  const m = mood(state.unity);
  const L = state.leader;
  el.innerHTML = `
    <div class="hud-mast">
      <span class="emblem-badge">${emblemSvg(state.religion.emblem)}</span>
      <div class="mast-title"><small>${esc(state.religion.name || '이름 없는 모임')} 주보 · 제${state.turn + 1}호</small><strong class="num">${dateLabel(state.turn)}</strong>
        <span>${isJailed(state) ? `<em class="bad">교주 수감 중 · ${L.jailedUntil - state.turn}달 남음</em>` : `교주 ${esc(L.name)} (${L.age})${L.age >= 70 ? ' · 요즘 자주 깜빡함' : ''}`}</span></div>
    </div>
    <div class="hud-ledger">
      <div class="stat"><span class="stat-label">신도</span><span class="stat-value">${people(total)}${change ? `<small class="${change > 0 ? 'up' : 'down'}">${change > 0 ? '+' : '−'}${people(Math.abs(change))}</small>` : ''}</span></div>
      <div class="stat"><span class="stat-label">신앙력 (다음 달)</span><span class="stat-value">${int(state.faith)}<small class="${income < 0 ? 'down' : ''}">${income >= 0 ? '+' : ''}${int(income)}</small></span></div>
      <div class="stat stat-mood tone-${m.tone}"><span class="stat-label">간부들 분위기</span><span class="stat-mood-text">${esc(m.text)}</span></div>
    </div>
    <div class="hud-spacer"></div>
    <button class="hud-stage" data-hud="stage" aria-label="교단 단계 보기">
      <div class="stage-name">${stage.name}</div>
      <div class="meter"><i style="width:${(prog.ratio * 100).toFixed(1)}%"></i></div>
      <div class="stage-next">${nextText}</div>
    </button>
    <button class="hud-menu" data-hud="menu" aria-label="메뉴">${icon('menu')}</button>`;
}
