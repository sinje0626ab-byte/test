import { world } from '../data/loader.js';
import { composition, resistance, share } from '../religion/spread.js';
import { UNIT_TYPES, UNIT_ORDER } from '../units/unitTypes.js';
import { SPAWN_MIN_FOLLOWERS, ALERT } from '../config.js';
import { miracleCost, miracleBlocker, holySiteCost, holySiteBlocker } from '../game/actions.js';
import { isJailed } from '../game/leader.js';
import { alertWord, aversionWord } from '../story/words.js';
import { APPROACHES, TRAITS, traitsOf, fitOf, adaptOf, unitAffinity, approachCost } from '../religion/culture.js';
import { esc, people, pct, signed } from './format.js';
import { icon, rawIcon } from './icons.js';
import { emblemSvg } from '../religion/emblems.js';
import { flagImg } from './flags.js';
import { traitChips } from './approachSheet.js';

// 나라 장부 (파일철 한 장)
// expanded: 모바일에서 시트를 끝까지 펼쳤는지 (PC 에서는 항상 전체를 보여 준다)
// 정부 경계·거부감은 말로만 보여 준다. 정확한 수치는 교단 장부에서.
const resistWord = (r) => (r >= 0.7 ? '단단하다' : r >= 0.45 ? '보통' : '느슨하다');

export function renderCountryPanel(el, state, id, { expanded = false } = {}) {
  const c = world.countries[id];
  const cs = state.countries[id];
  const { ours, existing } = composition(state, id);
  const parts = Object.entries(existing).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const units = state.units.filter((u) => u.at === id);
  const delta = Math.round(cs.lastDelta);
  const R = resistance(state, id);
  const canSpawn = cs.followers >= SPAWN_MIN_FOLLOWERS && !cs.banned && !isJailed(state);
  const isHome = id === state.religion.home;
  const alert = alertWord(cs.alert, { banned: cs.banned, home: isHome });
  const aversion = aversionWord(cs.aversion);
  const badges = [
    isHome ? '<span class="badge">본거지</span>' : '',
    state.holySites[id] ? '<span class="badge holy">성지</span>' : '',
    cs.banned ? '<span class="badge bad">활동 금지</span>' : '',
    cs.lastRaid != null && state.turn - cs.lastRaid < ALERT.raidCooldown ? '<span class="badge warn">압수수색 뒤</span>' : '',
  ].join('');
  const mBlock = miracleBlocker(state, id);
  const hBlock = holySiteBlocker(state, id);
  const ap = cs.approach;
  const apFit = ap ? fitOf(id, ap.id) : null;
  const adapt = ap ? adaptOf(state, id) : 0;
  const approachNote = ap
    ? `${adapt < 1 ? '아직 자리 잡는 중. ' : ''}${APPROACHES[ap.id].desc}`
    : cs.followers > 0 ? '이 동네에 맞는 방식을 고르면 더 잘 퍼진다' : '신도가 한 명이라도 생기면 정할 수 있다';

  el.classList.toggle('is-expanded', expanded);
  el.innerHTML = `
    <button class="panel-grip" data-panel="expand" aria-label="${expanded ? '접기' : '자세히 보기'}"><i></i></button>
    <div class="panel-scroll">
      <div class="panel-head">
        <div class="panel-title">${flagImg(c, 'flag flag-lg')}<div><h2>${esc(c.name)}</h2><p>${esc(c.region)} · 인구 ${people(c.pop)}명</p>${badges ? `<div class="badges">${badges}</div>` : ''}</div></div>
        <button class="icon-btn panel-close" data-panel="close" aria-label="닫기">${icon('close')}</button>
      </div>

      <div class="peek">
        <div class="peek-stats">
          <div><small>신도</small><b class="num">${people(cs.followers)}</b><em class="num">${pct(ours)}</em></div>
          <div><small>지난달</small><b class="num ${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${signed(delta)}</b></div>
          <div class="peek-word tone-${alert.tone}"><small>당국</small><b>${esc(alert.text)}</b></div>
        </div>
        <div class="peek-actions">
          <button class="btn btn-secondary btn-sm" data-panel="produce" ${canSpawn ? '' : 'disabled'}>${icon('plus')}사람 보내기</button>
          <button class="btn btn-secondary btn-sm" data-panel="miracle" ${mBlock ? 'disabled' : ''}>${icon('rise')}기적</button>
          ${state.flags.holySites ? `<button class="btn btn-secondary btn-sm" data-panel="holy" ${hBlock ? 'disabled' : ''}>${icon('flag')}성지</button>` : ''}
          <button class="btn btn-plain btn-sm peek-more" data-panel="expand">${expanded ? '접기' : '더 보기'}</button>
        </div>
      </div>

      <div class="panel-detail">
      <div class="hero">
        <div class="hero-label">${emblemSvg(state.religion.emblem, 'hero-emblem')}${esc(state.religion.name)} 신도</div>
        <div class="hero-value">${people(cs.followers)}<small>${pct(ours)}</small></div>
        <div class="hero-delta">${cs.followers > 0 || delta ? `지난달 <span class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${signed(delta)}명</span>` : '아직 아무도 없다'}</div>
      </div>

      <div class="section-title">이 나라 사람들은</div>
      <div class="stack" role="img" aria-label="종교 구성 막대">
        ${ours > 0 ? `<i style="flex-grow:${ours};background:var(--accent)"></i>` : ''}
        ${parts.map(([k, v]) => `<i style="flex-grow:${v};background:${world.religions[k].color}"></i>`).join('')}
      </div>
      <div class="list rel-list">
        ${ours > 0 ? `<div class="row"><span class="row-label"><span class="dot" style="background:var(--accent)"></span>${esc(state.religion.name)}</span><span class="row-value num">${pct(ours)}</span></div>` : ''}
        ${parts.map(([k, v]) => `<div class="row"><span class="row-label"><span class="dot" style="background:${world.religions[k].color}"></span>${world.religions[k].name}</span><span class="row-value num">${pct(v)}</span></div>`).join('')}
      </div>
      ${c.detailed ? '' : `<p class="panel-note">${esc(c.region)} 평균으로 어림잡은 수치.</p>`}

      <div class="section-title">분위기</div>
      <div class="list">
        <div class="row"><span class="row-label">당국</span><span class="row-value word tone-${alert.tone}">${esc(alert.text)}</span></div>
        <div class="row"><span class="row-label">동네 인심</span><span class="row-value word tone-${aversion.tone}">${esc(aversion.text)}</span></div>
        <div class="row"><span class="row-label">기존 종교</span><span class="row-value word">${resistWord(R)}</span></div>
        <div class="row"><span class="row-label">종교 자유도</span><span class="row-value num">${c.freedom} / 100</span></div>
      </div>
      <p class="panel-note">국경 붙은 나라 ${c.land.length}곳 · 바닷길 ${c.sea.length}곳</p>

      <div class="section-title">기질과 전도 방식</div>
      ${traitChips(id)}
      <p class="panel-note trait-note">${traitsOf(id).slice(0, 2).map((t) => esc(TRAITS[t].desc)).join(' ')}</p>
      <div class="list action-list" style="margin-top:10px">
        <button class="row action-row" data-panel="approach" ${cs.followers > 0 ? '' : 'disabled'}>
          <span class="row-label">${icon('rise')}<span><b>${ap ? APPROACHES[ap.id].name : '전도 방식 정하기'}</b><small>${esc(approachNote)}</small></span></span>
          <span class="row-value">${ap ? `<span class="badge fit ${apFit.tone}">${apFit.label}</span>` : `<span class="num"><i class="faith-mark"></i>${approachCost(state)}</span>`}${icon('chevron')}</span></button>
      </div>
      <div class="unit-fit">${UNIT_ORDER.map((t) => {
        const f = unitAffinity(id, t);
        const tone = f > 1.05 ? 'good' : f < 0.95 ? 'bad' : '';
        return `<span class="unit-fit-chip ${tone}">${UNIT_TYPES[t].name}${tone ? `<b>${tone === 'good' ? '잘 통함' : '안 통함'}</b>` : ''}</span>`;
      }).join('')}</div>

      <div class="section-title">여기 있는 사람 ${units.length ? `· ${units.length}` : ''}</div>
      ${units.length ? `<div class="list">${units.map((u) => `
        <button class="row" style="width:100%" data-unit="${u.id}">
          <span class="row-label unit-mini"><span class="unit-glyph">${rawIcon(UNIT_TYPES[u.type].icon)}</span>${UNIT_TYPES[u.type].name}</span>
          <span class="row-value">${unitStatus(u)}${icon('chevron')}</span>
        </button>`).join('')}</div>` : '<p class="panel-note" style="margin-top:0">아무도 안 와 있다.</p>'}

      <div class="section-title">신앙력 쓰기</div>
      <div class="list action-list">
        <button class="row action-row" data-panel="produce" ${canSpawn ? '' : 'disabled'}>
          <span class="row-label">${icon('plus')}<span><b>사람 보내기</b><small>${canSpawn ? '여기서 선교사나 봉사자를 모은다' : cs.banned ? '활동 금지라 못 모은다' : isJailed(state) ? '교주가 안에 있다' : `신도 ${SPAWN_MIN_FOLLOWERS}명은 있어야 한다`}</small></span></span>${icon('chevron')}</button>
        <button class="row action-row" data-panel="miracle" ${mBlock ? 'disabled' : ''}>
          <span class="row-label">${icon('rise')}<span><b>기적</b><small>${esc(mBlock ?? '한 번에 크게 퍼진다. 당국도 본다')}</small></span></span><span class="row-value num"><i class="faith-mark"></i>${miracleCost(state)}</span></button>
        <button class="row action-row" data-panel="holy" ${hBlock ? 'disabled' : ''}>
          <span class="row-label">${icon('flag')}<span><b>성지 세우기</b><small>${esc(hBlock ?? '이 나라는 계속 잘 퍼지고 잘 안 떠난다. 매달 신앙력도 들어온다')}</small></span></span><span class="row-value num">${state.holySites[id] ? '세움' : `<i class="faith-mark"></i>${holySiteCost(state)}`}</span></button>
      </div>
      </div>
    </div>`;
}

export function unitStatus(u) {
  const bits = [];
  if (u.auto) bits.push('알아서 함');
  if (u.usesLeft !== undefined) bits.push(`${u.usesLeft}번 남음`);
  if (u.moved && u.acted) bits.push('오늘은 끝');
  else if (u.moved) bits.push('이동함');
  else if (u.acted) bits.push('다녀옴');
  return bits.join(' · ') || '대기';
}

// 지도 위 툴팁
export function tooltipHtml(state, id) {
  const c = world.countries[id];
  const s = share(state, id);
  const cs = state.countries[id];
  return `${flagImg(c, 'flag flag-sm')}<b>${esc(c.name)}</b> <span class="muted">${s > 0 ? `${people(cs.followers)}명 · ${pct(s)}` : '아직 아무도 없음'}${cs.banned ? ' · 활동 금지' : cs.alert >= 0.5 ? ' · 당국이 보고 있음' : ''}</span>`;
}
