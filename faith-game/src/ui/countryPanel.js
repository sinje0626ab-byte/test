import { world } from '../data/loader.js';
import { composition, resistance, freedomMod, share } from '../religion/spread.js';
import { UNIT_TYPES } from '../units/unitTypes.js';
import { SPAWN_MIN_FOLLOWERS, ALERT } from '../config.js';
import { miracleCost, miracleBlocker, holySiteCost, holySiteBlocker } from '../game/actions.js';
import { raidThreshold } from '../game/watch.js';
import { isJailed } from '../game/leader.js';
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
  const delta = Math.round(cs.lastDelta);
  const R = resistance(state, id);
  const canSpawn = cs.followers >= SPAWN_MIN_FOLLOWERS && !cs.banned && !isJailed(state);
  const isHome = id === state.religion.home;
  const raidAt = raidThreshold(state, id);
  const badges = [
    isHome ? '<span class="badge">본거지</span>' : '',
    state.holySites[id] ? '<span class="badge holy">성지</span>' : '',
    cs.banned ? '<span class="badge bad">활동 금지</span>' : '',
    cs.lastRaid != null && state.turn - cs.lastRaid < ALERT.raidCooldown ? '<span class="badge warn">압수수색 이후</span>' : '',
  ].join('');
  const alertNote = cs.banned
    ? `활동 금지 — 경계가 ${Math.round(ALERT.unban * 100)}% 아래로 내려가면 풀립니다`
    : cs.alert >= raidAt ? '압수수색 직전'
      : cs.alert >= ALERT.warn ? `경고 단계 — ${Math.round(raidAt * 100)}%에서 압수수색`
        : `${Math.round(ALERT.warn * 100)}% 경고 · ${Math.round(raidAt * 100)}% 압수수색 · 100% 활동 금지`;
  const mBlock = miracleBlocker(state, id);
  const hBlock = holySiteBlocker(state, id);

  const meterRow = (label, v, warn = false, text = pct(v)) =>
    `<div class="row"><span class="row-label">${label}</span><span class="row-value"><span class="meter row-meter ${warn ? 'warn' : ''}"><i style="width:${(Math.min(1, v) * 100).toFixed(1)}%"></i></span><span class="num" style="min-width:44px">${text}</span></span></div>`;

  el.innerHTML = `
    <div class="panel-scroll">
      <div class="panel-head">
        <div class="panel-title">${flagImg(c, 'flag flag-lg')}<div><h2>${esc(c.name)}</h2><p>${esc(c.region)} · 인구 ${people(c.pop)}명</p>${badges ? `<div class="badges">${badges}</div>` : ''}</div></div>
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
      </div>
      <div class="section-title">정부 경계</div>
      <div class="alert-meter ${cs.banned ? 'is-banned' : cs.alert >= ALERT.warn ? 'is-warn' : ''}">
        <div class="alert-bar"><i style="width:${(cs.alert * 100).toFixed(1)}%"></i><b style="left:${ALERT.warn * 100}%"></b><b style="left:${raidAt * 100}%"></b></div>
        <div class="alert-text"><span class="num">${Math.round(cs.alert * 100)}%</span><span>${alertNote}</span></div>
      </div>
      <p class="panel-note">전파 효율 ${pct((1 - R) * freedomMod(id))} · 육로 이웃 ${c.land.length}곳 · 해로 ${c.sea.length}곳</p>

      <div class="section-title">이곳의 유닛 ${units.length ? `· ${units.length}` : ''}</div>
      ${units.length ? `<div class="list">${units.map((u) => `
        <button class="row" style="width:100%" data-unit="${u.id}">
          <span class="row-label unit-mini"><span class="unit-glyph">${rawIcon(UNIT_TYPES[u.type].icon)}</span>${UNIT_TYPES[u.type].name}</span>
          <span class="row-value">${unitStatus(u)}${icon('chevron')}</span>
        </button>`).join('')}</div>` : `<p class="panel-note" style="margin-top:0">이 나라에 머무는 유닛이 없습니다.</p>`}

      <div class="section-title">신앙력 쓰기</div>
      <div class="list action-list">
        <button class="row action-row" data-panel="produce" ${canSpawn ? '' : 'disabled'}>
          <span class="row-label">${icon('plus')}<span><b>유닛 생산</b><small>${canSpawn ? '이 나라에서 유닛을 모집합니다' : cs.banned ? '활동 금지된 나라' : isJailed(state) ? '교주 수감 중' : `신도 ${SPAWN_MIN_FOLLOWERS}명 이상 필요`}</small></span></span>${icon('chevron')}</button>
        <button class="row action-row" data-panel="miracle" ${mBlock ? 'disabled' : ''}>
          <span class="row-label">${icon('rise')}<span><b>기적</b><small>${mBlock ?? '한 번에 크게 퍼뜨립니다 · 정부 경계↑'}</small></span></span><span class="row-value num"><i class="faith-mark"></i>${miracleCost(state)}</span></button>
        <button class="row action-row" data-panel="holy" ${hBlock ? 'disabled' : ''}>
          <span class="row-label">${icon('flag')}<span><b>성지 건설</b><small>${hBlock ?? '이 나라 성장↑ 이탈↓ 매달 신앙력, 영구'}</small></span></span><span class="row-value num">${state.holySites[id] ? '완공' : `<i class="faith-mark"></i>${holySiteCost(state)}`}</span></button>
      </div>
    </div>`;
}

export function unitStatus(u) {
  const bits = [];
  if (u.auto) bits.push('자동 임무');
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
  const cs = state.countries[id];
  return `${flagImg(c, 'flag flag-sm')}<b>${esc(c.name)}</b> <span class="muted">${s > 0 ? `${people(cs.followers)}명 · ${pct(s)}` : '신도 없음'}${cs.banned ? ' · 활동 금지' : cs.alert >= 0.5 ? ` · 경계 ${Math.round(cs.alert * 100)}%` : ''}</span>`;
}
