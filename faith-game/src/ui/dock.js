import { world } from '../data/loader.js';
import { UNIT_TYPES } from '../units/unitTypes.js';
import { canAct, reachable, unitCap } from '../units/units.js';
import { dateLabel } from '../game/state.js';
import { esc } from './format.js';
import { icon, rawIcon } from './icons.js';
import { unitStatus } from './countryPanel.js';
import { flagImg } from './flags.js';

const isReady = (u) => !u.auto && (!u.moved || canAct(u));

// 하단 독: 선택한 유닛 정보 + 유닛 목록 + 생산 + 다음 달
// 유닛 목록은 나라별로만 보여 준다.
//   나라를 고르지 않았으면: 유닛이 있는 나라 목록 (국기 · 이름 · 유닛 수)
//   나라를 골랐으면: 그 나라에 있는 유닛만 + '전체' 로 돌아가기
export function renderDock(el, state, selectedUnitId, countryId = null) {
  const unit = state.units.find((u) => u.id === selectedUnitId);
  const next = dateLabel(state.turn + 1);
  el.innerHTML = `
    ${unit ? inspector(state, unit) : ''}
    <div class="dock-main">
      <div class="dock-units" role="list" aria-label="유닛">${countryId ? countryUnits(state, countryId, selectedUnitId) : countryList(state)}</div>
      <div class="dock-buttons">
        <button class="btn btn-secondary btn-produce" data-dock="produce" aria-label="사람 모으기">${icon('plus')}<span>모집 <small class="num">${state.units.length}/${unitCap(state)}</small></span></button>
        <button class="btn btn-primary btn-turn" data-dock="end-turn" ${state.result ? 'disabled' : ''}>한 달 보내기<small class="num">${next}</small></button>
      </div>
    </div>`;
}

function countryList(state) {
  const groups = new Map();
  for (const u of state.units) {
    if (!groups.has(u.at)) groups.set(u.at, []);
    groups.get(u.at).push(u);
  }
  if (!groups.size) return '<span class="dock-empty">밖에 나가 있는 사람이 없다. 모집부터.</span>';
  // 행동할 유닛이 남은 나라 먼저, 그다음 유닛이 많은 나라
  const list = [...groups].sort((a, b) => b[1].some(isReady) - a[1].some(isReady) || b[1].length - a[1].length);
  return list.map(([id, units]) => {
    const c = world.countries[id];
    const ready = units.filter(isReady).length;
    return `<button class="unit-chip country-chip" data-dock-country="${id}" role="listitem">
      ${flagImg(c, 'flag flag-md')}
      <span><b>${esc(c.name)}</b><small>${units.length}명${ready ? ` · ${ready}명 대기` : ''}</small></span>
      ${ready ? '<i class="ready-dot" aria-label="행동 가능"></i>' : ''}
    </button>`;
  }).join('');
}

function countryUnits(state, countryId, selectedUnitId) {
  const units = state.units.filter((u) => u.at === countryId);
  const back = `<button class="unit-chip back-chip" data-dock="all" role="listitem" aria-label="모든 나라 보기">${icon('chevron')}<span><b>전체</b><small>${new Set(state.units.map((u) => u.at)).size}개국</small></span></button>`;
  if (!units.length) return `${state.units.length ? back : ''}<span class="dock-empty">여기는 아무도 없다</span>`;
  return back + units.map((u) => `
    <button class="unit-chip ${u.id === selectedUnitId ? 'is-selected' : ''} ${isReady(u) ? '' : 'is-spent'}" data-unit="${u.id}" role="listitem">
      <span class="unit-glyph">${rawIcon(UNIT_TYPES[u.type].icon)}</span>
      <span><b>${UNIT_TYPES[u.type].name}</b><small>${u.auto ? '알아서 함' : unitStatus(u)}</small></span>
      ${isReady(u) ? '<i class="ready-dot" aria-label="행동 가능"></i>' : ''}
    </button>`).join('');
}

function inspector(state, u) {
  const t = UNIT_TYPES[u.type];
  const where = world.countries[u.at].name;
  const moves = u.moved ? 0 : reachable(u.at).size;
  let hint;
  if (state.countries[u.at].banned) hint = '여기는 활동 금지다. 다른 나라로 옮겨야 한다.';
  else if (!u.moved) hint = `형광펜 칠해진 나라(${moves}곳)를 누르면 그리로 간다.${u.auto ? ' 알아서 하기를 켜 둬서 한 달이 지나면 여기서 활동한다.' : ''}`;
  else if (canAct(u, state)) hint = '이번 달 이동은 끝. 여기서 활동할 수 있다.';
  else hint = t.actionLabel ? '이번 달은 할 일 다 했다.' : t.desc;
  const actBtn = t.actionLabel
    ? `<button class="btn btn-primary btn-sm" data-dock="act" ${canAct(u, state) ? '' : 'disabled'}>${t.actionLabel}</button>
       <button class="btn btn-secondary btn-sm ${u.auto ? 'is-on' : ''}" data-dock="auto" aria-pressed="${u.auto}">알아서 하기 ${u.auto ? '켬' : '끔'}</button>`
    : '<span class="pill">매달 알아서 움직임</span>';
  return `<div class="inspector">
    <span class="unit-glyph">${rawIcon(t.icon)}</span>
    <div class="inspector-text"><b>${t.name}</b> <span class="muted" style="font-size:13px">${esc(where)} · ${unitStatus(u)}</span><p>${esc(hint)}</p></div>
    <div class="inspector-actions">
      ${actBtn}
      <button class="btn btn-secondary btn-sm" data-dock="focus-unit">어디 있지</button>
      <button class="icon-btn panel-close" data-dock="deselect" aria-label="선택 해제">${icon('close')}</button>
    </div>
  </div>`;
}
