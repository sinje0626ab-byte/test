import { world } from '../data/loader.js';
import { composition, resistance, freedomMod, share } from '../religion/spread.js';
import { UNIT_TYPES } from '../units/unitTypes.js';
import { SPAWN_MIN_FOLLOWERS } from '../config.js';
import { esc, people, pct, signed } from './format.js';
import { icon, rawIcon } from './icons.js';
import { emblemSvg } from '../religion/emblems.js';
import { flagImg } from './flags.js';

// 나라 정보 패널
export function renderCountryPanel(el, state, id) {
  const c = world.countries[id];
  const cs = state.countries[id];
  const { ours, existing } = composition(state, id);
  const parts = Object.entries(existing).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const units = state.units.filter((u) => u.at === id);
  const delta = cs.lastDelta;
  const R = resistance(state, id);
  const canSpawn = cs.followers >= SPAWN_MIN_FOLLOWERS;

  const meterRow = (label, v, warn = false, text = pct(v)) =>
    `<div class="row"><span class="row-label">${label}</span><span class="row-value"><span class="meter row-meter ${warn ? 'warn' : ''}"><i style="width:${(Math.min(1, v) * 100).toFixed(1)}%"></i></span><span class="num" style="min-width:44px">${text}</span></span></div>`;

  el.innerHTML = `
    <div class="panel-scroll">
      <div class="panel-head">
        <div class="panel-title">${flagImg(c, 'flag flag-lg')}<div><h2>${esc(c.name)}</h2><p>${esc(c.region)} · 인구 ${people(c.pop)}명</p></div></div>
        <button class="icon-btn panel-close" data-panel="close" aria-label="닫기">${icon('close')}</button>
      </div>

      <div class="hero">
        <div class="hero-label">${emblemSvg(state.religion.emblem, 'hero-emblem')}${esc(state.religion.name)} 신도</div>
        <div class="hero-value">${people(cs.followers)}<small>${pct(ours)}</small></div>
        <div class="hero-delta">${cs.followers > 0 || delta ? `지난달 <span class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${signed(delta)}명</span>` : '아직 신도가 없습니다'}</div>
      </div>

      <div class="section-title">종교 구성</div>
      <div class="stack" role="img" aria-label="종교 구성 막대">
        ${ours > 0 ? `<i style="flex-grow:${ours};background:var(--accent)"></i>` : ''}
        ${parts.map(([k, v]) => `<i style="flex-grow:${v};background:${world.religions[k].color}"></i>`).join('')}
      </div>
      <div class="list rel-list">
        ${ours > 0 ? `<div class="row"><span class="row-label"><span class="dot" style="background:var(--accent)"></span>${esc(state.religion.name)}</span><span class="row-value num">${pct(ours)}</span></div>` : ''}
        ${parts.map(([k, v]) => `<div class="row"><span class="row-label"><span class="dot" style="background:${world.religions[k].color}"></span>${world.religions[k].name}</span><span class="row-value num">${pct(v)}</span></div>`).join('')}
      </div>
      ${c.detailed ? '' : `<p class="panel-note">이 나라는 ${esc(c.region)} 지역 평균값을 씁니다.</p>`}

      <div class="section-title">환경</div>
      <div class="list">
        ${meterRow('종교 자유도', c.freedom / 100, false, String(c.freedom))}
        ${meterRow('기존 종교 저항력', R, R > 0.7)}
        ${meterRow('도시화율', c.urban)}
        ${meterRow('거부감', cs.aversion, cs.aversion > 0.2)}
        ${meterRow('정부 경계', cs.alert, cs.alert > 0.3)}
      </div>
      <p class="panel-note">전파 효율 ${pct((1 - R) * freedomMod(id))} · 육로 이웃 ${c.land.length}곳 · 해로 ${c.sea.length}곳</p>

      <div class="section-title">이곳의 유닛 ${units.length ? `· ${units.length}` : ''}</div>
      ${units.length ? `<div class="list">${units.map((u) => `
        <button class="row" style="width:100%" data-unit="${u.id}">
          <span class="row-label unit-mini"><span class="unit-glyph">${rawIcon(UNIT_TYPES[u.type].icon)}</span>${UNIT_TYPES[u.type].name}</span>
          <span class="row-value">${unitStatus(u)}${icon('chevron')}</span>
        </button>`).join('')}</div>` : `<p class="panel-note" style="margin-top:0">이 나라에 머무는 유닛이 없습니다.</p>`}

      <div class="panel-actions">
        <button class="btn btn-secondary btn-block" data-panel="produce" ${canSpawn ? '' : 'disabled'}>${icon('plus')}이 나라에서 생산</button>
      </div>
      ${canSpawn ? '' : `<p class="panel-note">신도가 ${SPAWN_MIN_FOLLOWERS}명 이상인 나라에서 유닛을 생산할 수 있습니다.</p>`}
    </div>`;
}

export function unitStatus(u) {
  const bits = [];
  if (u.usesLeft !== undefined) bits.push(`${u.usesLeft}회 남음`);
  if (u.moved && u.acted) bits.push('이번 달 완료');
  else if (u.moved) bits.push('이동함');
  else if (u.acted) bits.push('활동함');
  return bits.join(' · ') || '대기 중';
}

// 지도 위 툴팁
export function tooltipHtml(state, id) {
  const c = world.countries[id];
  const s = share(state, id);
  return `${flagImg(c, 'flag flag-sm')}<b>${esc(c.name)}</b> <span class="muted">${s > 0 ? `${people(state.countries[id].followers)}명 · ${pct(s)}` : '신도 없음'}</span>`;
}
