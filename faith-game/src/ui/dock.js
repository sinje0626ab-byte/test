import { world } from '../data/loader.js';
import { UNIT_TYPES } from '../units/unitTypes.js';
import { canAct, reachable } from '../units/units.js';
import { dateLabel } from '../game/state.js';
import { esc } from './format.js';
import { icon, rawIcon } from './icons.js';
import { unitStatus } from './countryPanel.js';

const isReady = (u) => !u.moved || canAct(u);

// 하단 독: 선택한 유닛 정보 + 유닛 목록 + 생산 + 다음 달
export function renderDock(el, state, selectedUnitId) {
  const unit = state.units.find((u) => u.id === selectedUnitId);
  const next = dateLabel(state.turn + 1);
  el.innerHTML = `
    ${unit ? inspector(state, unit) : ''}
    <div class="dock-main">
      <div class="dock-units" role="list" aria-label="유닛">
        ${state.units.length ? state.units.map((u) => `
          <button class="unit-chip ${u.id === selectedUnitId ? 'is-selected' : ''} ${isReady(u) ? '' : 'is-spent'}" data-unit="${u.id}" role="listitem">
            <span class="unit-glyph">${rawIcon(UNIT_TYPES[u.type].icon)}</span>
            <span><b>${UNIT_TYPES[u.type].name}</b><small>${esc(world.countries[u.at].name)}</small></span>
            ${isReady(u) ? '<i class="ready-dot" aria-label="행동 가능"></i>' : ''}
          </button>`).join('') : '<span class="dock-empty">유닛이 없습니다. 신앙력으로 생산하세요.</span>'}
      </div>
      <div class="dock-buttons">
        <button class="btn btn-secondary btn-produce" data-dock="produce" aria-label="유닛 생산">${icon('plus')}<span>생산</span></button>
        <button class="btn btn-primary btn-turn" data-dock="end-turn" ${state.result ? 'disabled' : ''}>다음 달<small class="num">${next}</small></button>
      </div>
    </div>`;
}

function inspector(state, u) {
  const t = UNIT_TYPES[u.type];
  const where = world.countries[u.at].name;
  const moves = u.moved ? 0 : reachable(u.at).size;
  let hint;
  if (!u.moved) hint = `지도에서 강조된 나라(${moves}곳)를 누르면 이동합니다.`;
  else if (canAct(u)) hint = '이번 달 이동을 마쳤습니다. 이곳에서 활동할 수 있습니다.';
  else hint = t.actionLabel ? '이번 달 활동을 마쳤습니다.' : t.desc;
  const actBtn = t.actionLabel
    ? `<button class="btn btn-primary btn-sm" data-dock="act" ${canAct(u) ? '' : 'disabled'}>${t.actionLabel}</button>`
    : '<span class="pill">자동 활동</span>';
  return `<div class="inspector">
    <span class="unit-glyph">${rawIcon(t.icon)}</span>
    <div class="inspector-text"><b>${t.name}</b> <span class="muted" style="font-size:13px">${esc(where)} · ${unitStatus(u)}</span><p>${esc(hint)}</p></div>
    <div class="inspector-actions">
      ${actBtn}
      <button class="btn btn-secondary btn-sm" data-dock="focus-unit">위치 보기</button>
      <button class="icon-btn panel-close" data-dock="deselect" aria-label="선택 해제">${icon('close')}</button>
    </div>
  </div>`;
}
