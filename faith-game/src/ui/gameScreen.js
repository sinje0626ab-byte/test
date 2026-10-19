import { world } from '../data/loader.js';
import { VICTORY_SHARE, PRESENCE_MIN } from '../config.js';
import { totalFollowers, presenceCount, dateLabel } from '../game/state.js';
import { endTurn } from '../game/turn.js';
import { stageOf, stageProgress } from '../game/stages.js';
import { saveGame } from '../game/save.js';
import { emit } from '../game/events.js';
import { spawnUnit, moveUnit, actUnit, reachable, unitCost } from '../units/units.js';
import { UNIT_TYPES } from '../units/unitTypes.js';
import { DEITIES } from '../religion/deities.js';
import { TENETS } from '../religion/tenets.js';
import { COLOR_MODES } from '../map/colorModes.js';
import { unitPins } from '../map/unitLayer.js';
import { renderHud } from './hud.js';
import { renderCountryPanel, tooltipHtml } from './countryPanel.js';
import { renderDock } from './dock.js';
import { flagImg } from './flags.js';
import { openProduction } from './production.js';
import { toast, modal, confirmModal } from './toast.js';
import { setAccent, mapTheme, onSchemeChange } from './theme.js';
import { esc, people, pct, josa } from './format.js';
import { icon, rawIcon } from './icons.js';
import { emblemSvg } from '../religion/emblems.js';

// 게임 화면. 상태를 들고 있고, 입력을 받아 게임 로직을 부른 뒤 다시 그린다.
export function startGameScreen(map, state, { onNewGame }) {
  const ui = { country: null, unit: null, mode: 'ours' };
  let production = null;
  setAccent(state.religion.color);

  const root = document.createElement('div');
  root.className = 'game-ui';
  root.innerHTML = `
    <header class="hud" data-hud-root></header>
    <div class="map-tools">
      <div class="tool-card glass">
        <div class="segmented" role="group" aria-label="지도 색칠">${Object.entries(COLOR_MODES).map(([k, m]) => `<button data-mode="${k}">${m.label}</button>`).join('')}</div>
      </div>
      <div class="tool-card glass search">${icon('search')}<input type="search" placeholder="나라 찾기" data-search autocomplete="off" aria-label="나라 찾기"><div class="search-results" hidden></div></div>
      <div class="tool-card glass zoom-card">
        <button class="icon-btn" data-zoom="in" aria-label="확대">${icon('plus')}</button>
        <button class="icon-btn" data-zoom="out" aria-label="축소">${icon('minus')}</button>
        <button class="icon-btn" data-zoom="reset" aria-label="전체 보기">${icon('globe')}</button>
      </div>
      <div class="legend glass" data-legend></div>
    </div>
    <aside class="panel glass" data-panel-root hidden></aside>
    <nav class="dock glass" data-dock-root></nav>
    <div class="map-tooltip" hidden></div>`;
  document.body.appendChild(root);
  const $ = (s) => root.querySelector(s);
  const hudEl = $('[data-hud-root]');
  const panelEl = $('[data-panel-root]');
  const dockEl = $('[data-dock-root]');
  const tooltip = $('.map-tooltip');
  // 독 높이가 바뀌면(유닛 선택 등) 모바일 시트가 그 위에 놓이도록 알려 준다
  const dockObserver = new ResizeObserver(() => root.style.setProperty('--dock-h', `${dockEl.offsetHeight}px`));
  dockObserver.observe(dockEl);

  // ── 그리기 ──
  function render() {
    renderHud(hudEl, state);
    renderDock(dockEl, state, ui.unit);
    if (ui.country) {
      const keep = panelEl.querySelector('.panel-scroll')?.scrollTop ?? 0;
      panelEl.hidden = false;
      renderCountryPanel(panelEl, state, ui.country);
      panelEl.querySelector('.panel-scroll').scrollTop = keep;
    } else {
      panelEl.hidden = true;
    }
    root.classList.toggle('has-panel', Boolean(ui.country));
    renderMap();
  }

  function renderMap() {
    const theme = mapTheme();
    const mode = COLOR_MODES[ui.mode];
    map.setFill((id) => mode.fill(state, id, theme));
    map.setSelected(ui.country);
    const unit = state.units.find((u) => u.id === ui.unit);
    map.setReach(unit && !unit.moved ? reachable(unit.at) : null, unit?.at);
    map.setUnits(unitPins(state, ui.unit, selectUnit));
    root.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === ui.mode)));
    const lg = mode.legend(state, theme);
    $('[data-legend]').innerHTML = lg.type === 'gradient'
      ? `<div class="legend-title">${esc(state.religion.name)} 신도 비율</div><div class="legend-bar" style="background:linear-gradient(90deg, ${lg.from}, ${lg.to})"></div><div class="legend-ticks">${lg.labels.map((l) => `<span>${l}</span>`).join('')}</div>`
      : `<div class="legend-title">가장 큰 종교</div><div class="legend-swatches">${lg.items.map((i) => `<span><i style="background:${i.color}"></i>${esc(i.label)}</span>`).join('')}</div>`;
  }

  const commit = () => { saveGame(state); render(); };

  // 패널·독·상단 바를 피한 '보이는 지도 영역'의 중심
  function visibleCenter() {
    const w = innerWidth, h = innerHeight;
    const top = hudEl.getBoundingClientRect().bottom + 8;
    const dockTop = dockEl.getBoundingClientRect().top;
    let left = 0, right = w, bottom = dockTop;
    if (!panelEl.hidden) {
      const r = panelEl.getBoundingClientRect();
      if (w > 760) right = r.left;
      else bottom = Math.min(bottom, r.top);
    }
    return [(left + right) / 2, (top + bottom) / 2];
  }

  // 나라를 보이는 영역 가운데로 살며시 옮긴다
  function flyToCountry(id, scale = null) {
    requestAnimationFrame(() => map.focus(id, { center: visibleCenter(), scale }));
  }

  // ── 선택 ──
  function selectCountry(id) {
    const unit = state.units.find((u) => u.id === ui.unit);
    if (unit && !unit.moved && id !== unit.at && reachable(unit.at).has(id)) {
      const r = moveUnit(state, unit.id, id);
      if (r.ok) {
        ui.country = id;
        commit();
        flyToCountry(id);
        return;
      }
    }
    if (unit && id !== unit.at) ui.unit = null;
    ui.country = id;
    render();
    flyToCountry(id);
  }

  function selectUnit(id) {
    ui.unit = ui.unit === id ? null : id;
    const unit = state.units.find((u) => u.id === ui.unit);
    if (unit) ui.country = unit.at;
    render();
    if (unit) flyToCountry(unit.at);
  }

  // ── 행동 ──
  function act() {
    const unit = state.units.find((u) => u.id === ui.unit);
    if (!unit) return;
    const name = UNIT_TYPES[unit.type].name;
    const where = world.countries[unit.at].name;
    const r = actUnit(state, unit.id);
    if (!r.ok) { toast({ title: r.message, tone: 'bad', iconName: 'alert' }); return; }
    const parts = [`${where}에서 ${people(r.converted)}명이 새로 믿게 되었습니다.`];
    if (r.aversionCut) parts.push(`거부감 −${Math.round(r.aversionCut * 100)}`);
    if (r.consumed) parts.push(`${josa(name, '은/는')} 임무를 마쳤습니다.`);
    toast({ title: `${name} 활동`, body: parts.join(' '), iconName: 'people' });
    if (r.consumed) ui.unit = null;
    commit();
  }

  function spawn(type, at) {
    const r = spawnUnit(state, type, at);
    if (!r.ok) { toast({ title: r.message, tone: 'bad', iconName: 'alert' }); return r; }
    toast({ title: `${UNIT_TYPES[type].name} 합류`, body: `${world.countries[at].name}에서 활동을 시작합니다.`, iconName: 'plus', duration: 2400 });
    ui.unit = r.unit.id;
    ui.country = at;
    commit();
    return r;
  }

  function nextTurn() {
    if (state.result) return;
    const report = endTurn(state);
    ui.unit = state.units.find((u) => u.id === ui.unit)?.id ?? null;
    saveGame(state);
    render();
    emit('turn', report);
    const newOnes = report.newCountries.map((id) => world.countries[id].name);
    toast({
      title: `${dateLabel(state.turn)} · 신도 ${report.change >= 0 ? '+' : '−'}${people(Math.abs(report.change))}명`,
      body: `신앙력 +${report.faith}${newOnes.length ? ` · 새로 전파: ${newOnes.slice(0, 3).join(', ')}${newOnes.length > 3 ? ` 외 ${newOnes.length - 3}곳` : ''}` : ''}`,
      iconName: report.change >= 0 ? 'rise' : 'alert',
      tone: report.change >= 0 ? 'info' : 'bad',
      duration: 2600,
      key: 'turn',
    });
    // 한 달에 여러 단계를 오르면 마지막 단계만 알린다. 게임이 끝났으면 결과만 보여 준다.
    if (state.result) enqueue((done) => showResult(state.result, done));
    else if (report.stages.length) enqueue((done) => showStageUp(report.stages.at(-1).to, done));
  }

  // 큰 알림(단계 상승·결과)은 하나씩 차례로 띄운다
  const pending = [];
  let showing = false;
  function enqueue(open) {
    pending.push(open);
    pump();
  }
  function pump() {
    if (showing || !pending.length) return;
    showing = true;
    pending.shift()(() => { showing = false; pump(); });
  }

  // ── 모달 ──
  function goalBlock() {
    const p = stageProgress(state);
    if (!p.next) {
      return `<div class="next-goal"><h3>승리 조건</h3>
        <div class="goal-row"><span>세계 인구의 ${Math.round(VICTORY_SHARE * 100)}%</span><span>${people(p.followers)} / ${people(p.goal)}명</span></div>
        <div class="meter"><i style="width:${(p.ratio * 100).toFixed(1)}%"></i></div></div>`;
    }
    const unlocks = p.next.unlock.map((t) => `<span class="pill">${UNIT_TYPES[t].name} 해금</span>`).join('');
    return `<div class="next-goal"><h3>다음 단계 · ${p.next.name}</h3>
      <div class="goal-row"><span>전 세계 신도</span><span>${people(p.followers)} / ${people(p.next.followers)}명</span></div>
      <div class="meter"><i style="width:${(p.followerRatio * 100).toFixed(1)}%"></i></div>
      ${p.next.countries ? `<div class="goal-row"><span>진출 국가 (신도 ${people(PRESENCE_MIN)}명 이상)</span><span>${p.countries} / ${p.next.countries}곳</span></div>
      <div class="meter"><i style="width:${(p.countryRatio * 100).toFixed(1)}%"></i></div>` : ''}
      ${unlocks ? `<div class="unlock-list">${unlocks}</div>` : ''}</div>`;
  }

  function sparkline() {
    const h = state.history;
    if (h.length < 2) return '';
    const max = Math.max(...h) || 1;
    const pts = h.map((v, i) => [(i / (h.length - 1)) * 100, 30 - (v / max) * 28]);
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join('');
    return `<svg class="spark" viewBox="0 0 100 31" preserveAspectRatio="none" aria-label="신도 추이"><path class="area" d="${line}L100,31L0,31Z"/><path class="line" d="${line}"/></svg>`;
  }

  function showStageUp(stageId, onClose) {
    const s = stageOf(stageId);
    const unlocked = s.unlock.map((t) => `<span class="pill">${UNIT_TYPES[t].name}</span>`).join('');
    modal({
      dismissable: false,
      content: `<div class="center" style="padding-top:12px"><div class="big-mark">${emblemSvg(state.religion.emblem)}</div>
        <div class="step-label">새로운 단계</div><h2 style="margin:4px 0 0;font-size:28px;letter-spacing:-.03em">${s.name}</h2>
        <p class="modal-text">${esc(state.religion.name)}의 이름이 더 넓은 세상에 알려지고 있습니다.<br>자연 증가 ×${s.growth} · 신앙력 ×${s.faith}</p>
        ${unlocked ? `<div class="unlock-list" style="justify-content:center">새 유닛 ${unlocked}</div>` : ''}</div>
        ${goalBlock()}`,
      actions: [{ label: '계속', kind: 'primary' }],
      onClose,
    });
  }

  function showStageInfo() {
    const s = stageOf(state.stage);
    const total = totalFollowers(state);
    modal({
      title: s.name,
      subtitle: `${esc(state.religion.name)} · 교주 ${esc(state.religion.founder)}`,
      content: `
        <div class="summary-grid" style="margin-top:4px">
          <div><small>전 세계 신도</small><b class="num">${people(total)}명</b></div>
          <div><small>세계 인구 대비</small><b class="num">${pct(total / world.totalPop)}</b></div>
          <div><small>진출 국가</small><b class="num">${presenceCount(state, PRESENCE_MIN)}곳</b></div>
          <div><small>최고 기록</small><b class="num">${people(state.peakFollowers)}명</b></div>
          <div class="wide"><small>신도 추이</small>${sparkline() || '<b>다음 달부터 기록됩니다</b>'}</div>
        </div>
        ${goalBlock()}
        <div class="summary-grid">
          <div><small>신앙 대상</small><b>${DEITIES[state.religion.deity].name}</b></div>
          <div><small>교리</small><b>${state.religion.tenets.map((t) => TENETS[t].name).join(' · ')}</b></div>
        </div>`,
    });
  }

  function showResult(result, onClose) {
    const total = totalFollowers(state);
    const win = result === 'victory';
    modal({
      dismissable: false,
      content: `<div class="center" style="padding-top:12px"><div class="big-mark" ${win ? '' : 'style="background:var(--fill-2);color:var(--label-2)"'}>${emblemSvg(state.religion.emblem)}</div>
        <div class="step-label">${dateLabel(state.turn)} · ${state.turn}개월</div>
        <h2 style="margin:4px 0 0;font-size:28px;letter-spacing:-.03em">${win ? '세계가 귀 기울였습니다' : '마지막 신도가 떠났습니다'}</h2>
        <p class="modal-text">${win
          ? `${esc(josa(state.religion.name, '이/가'))} 세계 인구의 ${pct(total / world.totalPop)}에게 닿았습니다.`
          : `${esc(state.religion.name)}의 이야기는 여기서 끝납니다. 최고 기록은 ${people(state.peakFollowers)}명이었습니다.`}</p></div>
        <div class="summary-grid"><div><small>최종 신도</small><b class="num">${people(total)}명</b></div><div><small>진출 국가</small><b class="num">${presenceCount(state, PRESENCE_MIN)}곳</b></div></div>`,
      actions: [{ label: '지도 보기' }, { label: '새 게임', kind: 'primary', onClick: () => onNewGame() }],
      onClose,
    });
  }

  function showHelp() {
    modal({
      title: '진행 방법',
      wide: true,
      content: `<div class="list">
        ${[
          ['한 턴은 한 달', '‘다음 달’을 누르면 신도의 자연 증가·이탈, 이웃 나라로의 자연 전파, 신앙력 수입이 계산됩니다.'],
          ['저항력', '나라마다 기존 종교를 믿는 사람이 많을수록 새 종교를 받아들이기 어렵습니다. 모든 종교에 같은 규칙이 적용됩니다.'],
          ['종교 자유도', '자유도가 낮은 나라에서는 모든 전파 효과가 크게 줄어듭니다.'],
          ['유닛', '신앙력으로 생산합니다. 매달 한 번 이동하고 한 번 활동할 수 있습니다. 육로 이웃이나 바다 건너 2칸까지 갈 수 있습니다.'],
          ['성장 단계', '컬트 → 신흥 종교 → 국제 교단 → 세계 종교. 단계가 오르면 새 유닛이 해금되고 성장이 빨라집니다.'],
          ['승리와 패배', `세계 인구의 ${Math.round(VICTORY_SHARE * 100)}%가 믿으면 승리, 신도가 모두 떠나면 패배합니다. 진행은 매달 자동 저장됩니다.`],
        ].map(([t, d]) => `<div class="row" style="flex-direction:column;align-items:flex-start;gap:2px"><b style="font-weight:600">${t}</b><span class="muted" style="font-size:14px">${d}</span></div>`).join('')}
      </div>`,
    });
  }

  function showMenu() {
    const m = modal({
      title: '메뉴',
      content: `<div class="list">
        <button class="row" style="width:100%" data-m="stage"><span class="row-label">${icon('rise')}성장 단계와 기록</span>${icon('chevron')}</button>
        <button class="row" style="width:100%" data-m="help"><span class="row-label">${icon('help')}진행 방법</span>${icon('chevron')}</button>
        <button class="row" style="width:100%" data-m="new"><span class="row-label" style="color:var(--bad)">${icon('reset')}새 게임</span></button>
      </div><p class="panel-note">진행 상황은 이 브라우저에 자동 저장됩니다.</p>`,
    });
    m.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      m.close();
      if (b.dataset.m === 'stage') showStageInfo();
      if (b.dataset.m === 'help') showHelp();
      if (b.dataset.m === 'new') confirmModal({ title: '새 게임을 시작할까요?', text: '지금 진행 중인 종교는 사라집니다.', confirmLabel: '새 게임', danger: true, onConfirm: () => onNewGame() });
    });
  }

  // ── 입력 ──
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.mode) { ui.mode = t.dataset.mode; renderMap(); return; }
    if (t.dataset.zoom) { t.dataset.zoom === 'reset' ? map.resetView() : map.zoomBy(t.dataset.zoom === 'in' ? 1.6 : 1 / 1.6); return; }
    if (t.dataset.hud === 'stage') return showStageInfo();
    if (t.dataset.hud === 'menu') return showMenu();
    if (t.dataset.panel === 'close') { ui.country = null; ui.unit = null; render(); return; }
    if (t.dataset.panel === 'produce') { production = openProduction(state, ui.country, spawnFromSheet); return; }
    if (t.dataset.unit) { selectUnit(t.dataset.unit); return; }
    if (t.dataset.dock === 'produce') { production = openProduction(state, ui.country, spawnFromSheet); return; }
    if (t.dataset.dock === 'end-turn') return nextTurn();
    if (t.dataset.dock === 'act') return act();
    if (t.dataset.dock === 'deselect') { ui.unit = null; render(); return; }
    if (t.dataset.dock === 'focus-unit') {
      const u = state.units.find((x) => x.id === ui.unit);
      if (u) flyToCountry(u.at);
      return;
    }
    if (t.dataset.go) {
      ui.country = t.dataset.go;
      $('[data-search]').value = '';
      $('.search-results').hidden = true;
      render();
      flyToCountry(t.dataset.go);
    }
  });

  function spawnFromSheet(type, at) {
    const r = spawn(type, at);
    if (r.ok) { production?.close(); production = null; }
  }

  // 나라 찾기
  const searchInput = $('[data-search]');
  const results = $('.search-results');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (!q) { results.hidden = true; return; }
    const hits = world.ids.filter((id) => world.countries[id].name.includes(q)).slice(0, 8);
    results.hidden = false;
    results.innerHTML = hits.length
      ? hits.map((id, i) => `<button data-go="${id}" class="${i === 0 ? 'is-active' : ''}"><span class="flag-line">${flagImg(world.countries[id], 'flag flag-sm')}${esc(world.countries[id].name)}</span><small>${people(state.countries[id].followers)}명</small></button>`).join('')
      : '<div class="row muted" style="font-size:14px">결과 없음</div>';
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') results.querySelector('[data-go]')?.click();
    if (e.key === 'Escape') { searchInput.value = ''; results.hidden = true; searchInput.blur(); }
  });
  searchInput.addEventListener('blur', () => setTimeout(() => { results.hidden = true; }, 150));

  // 단축키: 스페이스/엔터 = 다음 달, Esc = 선택 해제
  const onKey = (e) => {
    if (document.querySelector('.overlay') || e.target.matches('input, select, textarea')) return;
    if (e.key === 'Escape') { ui.unit = null; ui.country = null; render(); }
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); nextTurn(); }
  };
  document.addEventListener('keydown', onKey);

  const hoverHandler = (id, event) => {
    if (!id || !matchMedia('(hover: hover)').matches) { tooltip.hidden = true; return; }
    tooltip.hidden = false;
    tooltip.innerHTML = tooltipHtml(state, id);
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
  };

  map.bind({
    onCountryClick: selectCountry,
    onBackgroundClick: () => { ui.country = null; ui.unit = null; render(); },
    onHover: hoverHandler,
  });
  onSchemeChange(renderMap);

  render();
  if (state.result) enqueue((done) => showResult(state.result, done));

  return {
    destroy() {
      document.removeEventListener('keydown', onKey);
      dockObserver.disconnect();
      map.bind({});
      map.setReach(null);
      map.setUnits([]);
      map.setSelected(null);
      root.remove();
    },
    state,
    // 개발 확인용
    focusCountry: flyToCountry,
    debug: { nextTurn, spawn, selectCountry, selectUnit, act, ui, unitCost: (t) => unitCost(state, t) },
  };
}
