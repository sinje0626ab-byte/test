import { world } from '../data/loader.js';
import { totalFollowers, dateLabel } from '../game/state.js';
import { stageOf, stageProgress } from '../game/stages.js';
import { faithIncome } from '../game/turn.js';
import { VICTORY_SHARE } from '../config.js';
import { people, pct, int } from './format.js';
import { icon } from './icons.js';
import { emblemSvg } from '../religion/emblems.js';

// 상단 바: 날짜 · 신도 · 신앙력 · 성장 단계
export function renderHud(el, state) {
  const total = totalFollowers(state);
  const prog = stageProgress(state);
  const stage = stageOf(state.stage);
  const nextText = prog.next
    ? `다음: ${prog.next.name} · ${people(prog.next.followers)}명${prog.next.countries ? ` · ${prog.next.countries}개국` : ''}`
    : `승리까지 세계 인구의 ${Math.round(VICTORY_SHARE * 100)}%`;
  const change = state.lastReport?.change ?? 0;
  el.innerHTML = `
    <div class="hud-card glass hud-date"><span class="emblem-badge">${emblemSvg(state.religion.emblem)}</span><div><strong class="num">${dateLabel(state.turn)}</strong><span>${state.turn + 1}번째 달</span></div></div>
    <div class="hud-card glass hud-stats">
      <div class="stat"><span class="stat-label">신도</span><span class="stat-value">${people(total)}${change ? `<small class="${change > 0 ? 'up' : ''}">${change > 0 ? '+' : '−'}${people(Math.abs(change))}</small>` : ''}</span></div>
      <div class="stat"><span class="stat-label">세계 인구 대비</span><span class="stat-value">${pct(total / world.totalPop)}</span></div>
      <div class="stat"><span class="stat-label">신앙력</span><span class="stat-value">${int(state.faith)}<small>+${int(faithIncome(state))}</small></span></div>
    </div>
    <div class="hud-spacer"></div>
    <button class="hud-card glass hud-stage" data-hud="stage" aria-label="성장 단계 보기">
      <div><div class="stage-name"><i></i>${stage.name}</div>
      <div class="meter"><i style="width:${(prog.ratio * 100).toFixed(1)}%"></i></div>
      <div class="stage-next">${nextText}</div></div>
    </button>
    <button class="hud-card glass hud-menu" data-hud="menu" aria-label="메뉴">${icon('menu')}</button>`;
}
