import { world } from '../data/loader.js';
import { VICTORY_SHARE, PRESENCE_MIN } from '../config.js';
import { totalFollowers, presenceCount, dateLabel, checkAbroad } from '../game/state.js';
import { endTurn } from '../game/turn.js';
import { stageOf, stageProgress } from '../game/stages.js';
import { saveGame } from '../game/save.js';
import { emit } from '../game/events.js';
import { DEFEAT_TEXT, VICTORY_TEXT, isJailed } from '../game/leader.js';
import { performMiracle, buildHolySite } from '../game/actions.js';
import { spawnUnit, moveUnit, actUnit, reachable, unitCost, idleUnits } from '../units/units.js';
import { UNIT_TYPES } from '../units/unitTypes.js';
import { DEITIES } from '../religion/deities.js';
import { TENETS } from '../religion/tenets.js';
import { dueRevelation, dueIncident } from '../story/storyEngine.js';
import { showRevelation } from '../story/revelationScreen.js';
import { COLOR_MODES } from '../map/colorModes.js';
import { unitPins } from '../map/unitLayer.js';
import { renderHud } from './hud.js';
import { renderCountryPanel, tooltipHtml } from './countryPanel.js';
import { renderDock } from './dock.js';
import { flagImg } from './flags.js';
import { openProduction } from './production.js';
import { openApproach } from './approachSheet.js';
import { setApproach } from '../religion/culture.js';
import { showIncident } from './incidentCard.js';
import { showChronicle } from './chronicle.js';
import { toast, modal } from './toast.js';
import { setAccent, mapTheme, onSchemeChange } from './theme.js';
import { esc, people, pct, josa } from './format.js';
import { icon } from './icons.js';
import { emblemSvg } from '../religion/emblems.js';
import { CAST, isIn, castOf } from '../story/cast.js';
import { mood, shadowWord } from '../story/words.js';
import { showLedger } from './ledger.js';
import { stamp } from './portrait.js';
import { blocked, idleLine, stageLine, JOIN_LINES } from './voice.js';

// 게임 화면. 상태를 들고 있고, 입력을 받아 게임 로직을 부른 뒤 다시 그린다.
export function startGameScreen(map, state, { onNewGame }) {
  const ui = { country: null, unit: null, mode: 'ours', skipIdleConfirm: false, panelExpanded: false };
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
      <div class="tool-card glass search">${icon('search')}<input type="search" placeholder="나라 이름" data-search autocomplete="off" aria-label="나라 찾기"><div class="search-results" hidden></div></div>
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
  // 주보 머리 높이도 같은 식으로 (지도 도구·패널·알림이 그 아래에 놓인다)
  const dockObserver = new ResizeObserver(() => {
    root.style.setProperty('--dock-h', `${dockEl.offsetHeight}px`);
    document.documentElement.style.setProperty('--hud-h', `${hudEl.offsetHeight}px`);
  });
  dockObserver.observe(dockEl);
  dockObserver.observe(hudEl);

  // ── 그리기 ──
  function render() {
    renderHud(hudEl, state);
    renderDock(dockEl, state, ui.unit, ui.country);
    if (ui.country) {
      const keep = panelEl.querySelector('.panel-scroll')?.scrollTop ?? 0;
      panelEl.hidden = false;
      renderCountryPanel(panelEl, state, ui.country, { expanded: ui.panelExpanded });
      panelEl.querySelector('.panel-scroll').scrollTop = keep;
    } else {
      panelEl.hidden = true;
    }
    root.classList.toggle('has-panel', Boolean(ui.country));
    root.classList.toggle('has-unit', Boolean(ui.unit));
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
    map.setMarks(Object.keys(state.holySites ?? {}), world.ids.filter((id) => state.countries[id].banned));
    root.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === ui.mode)));
    const lg = mode.legend(state, theme);
    $('[data-legend]').innerHTML = lg.type === 'gradient'
      ? `<div class="legend-title">${esc(state.religion.name)} 신도 비율</div><div class="legend-bar" style="background:linear-gradient(90deg, ${lg.from}, ${lg.to})"></div><div class="legend-ticks">${lg.labels.map((l) => `<span>${l}</span>`).join('')}</div>`
      : `<div class="legend-title">나라마다 제일 많이 믿는 것</div><div class="legend-swatches">${lg.items.map((i) => `<span><i style="background:${i.color}"></i>${esc(i.label)}</span>`).join('')}</div>`;
  }

  const commit = () => { saveGame(state); render(); };

  // 패널·독·상단 바를 피한 '보이는 지도 영역'의 중심
  function visibleCenter() {
    const w = innerWidth;
    const top = hudEl.getBoundingClientRect().bottom + 8;
    const dockTop = dockEl.getBoundingClientRect().top;
    let left = 0, right = w, bottom = dockTop;
    const r = panelEl.getBoundingClientRect();
    if (!panelEl.hidden && r.height > 0) {   // CSS 로 숨겨진 시트(모바일 유닛 선택 중)는 무시
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
    if (ui.country !== id) ui.panelExpanded = false;   // 다른 나라를 고르면 모바일 시트는 다시 작게
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
    const at = unit.at;
    const r = actUnit(state, unit.id);
    if (!r.ok) { toast(blocked(state, r.message)); return; }
    const parts = [`${world.countries[at].name}에서 ${people(r.converted)}명이 새로 왔다.`];
    if (r.aversionCut) parts.push('동네 인심이 조금 풀렸다.');
    if (r.consumed) parts.push(unit.type === 'witness' ? `${josa(name, '은/는')} 목이 쉬어서 끝났다.` : `${josa(name, '은/는')} 지쳐서 돌아왔다.`);
    toast({ title: `${name} 다녀옴`, body: parts.join(' '), iconName: 'people' });
    map.pulse(at, unit.type === 'witness' ? 'burst' : 'spread');
    if (r.consumed) ui.unit = null;
    commit();
  }

  function toggleAuto() {
    const unit = state.units.find((u) => u.id === ui.unit);
    if (!unit) return;
    unit.auto = !unit.auto;
    toast({ title: unit.auto ? '알아서 하기 켬' : '알아서 하기 끔', body: unit.auto ? '한 달이 지날 때마다 그 자리에서 알아서 활동한다.' : '시킬 때만 움직인다.', iconName: 'check', duration: 1800, key: 'auto' });
    commit();
  }

  function spawn(type, at) {
    const r = spawnUnit(state, type, at);
    if (!r.ok) { toast(blocked(state, r.message)); return r; }
    toast({ title: `${UNIT_TYPES[type].name} 합류`, body: `${world.countries[at].name}에서 시작한다.`, iconName: 'plus', duration: 2400 });
    ui.unit = r.unit.id;
    ui.country = at;
    commit();
    return r;
  }

  function miracle(id) {
    const r = performMiracle(state, id);
    if (!r.ok) { toast(blocked(state, r.message)); return; }
    toast({ title: '기적', body: `${world.countries[id].name}에서 ${people(r.converted)}명이 무릎을 꿇었다. 그 장면을 휴대폰으로 찍은 사람이 백 명쯤 됐다. 경찰도 한 명 있었다.`, iconName: 'rise' });
    map.pulse(id, 'burst');
    commit();
  }

  function chooseApproach(id, key) {
    const r = setApproach(state, id, key);
    if (!r.ok) { toast(blocked(state, r.message)); return r; }
    const tail = r.fit.tone === 'bad' ? ' 동네 반응이 영 시원찮다.' : r.fit.tone === 'good' ? ' 동네 사람들이 고개를 끄덕인다.' : '';
    toast({ title: '전도 방식', body: `${world.countries[id].name}에서 '${r.name}'${josa(r.name, '을/를').slice(r.name.length)} 시작했다. 자리 잡는 데 몇 달 걸린다.${tail}`, iconName: 'rise' });
    commit();
    return r;
  }

  function holySite(id) {
    const r = buildHolySite(state, id);
    if (!r.ok) { toast(blocked(state, r.message)); return; }
    toast({ title: '성지', body: `${r.name}에 성지를 세웠다. 테이프 커팅은 가위가 안 들어서 세 번 만에 잘렸다.`, iconName: 'flag' });
    map.pulse(id, 'holy');
    commit();
  }

  // ── 턴 ──
  function requestNextTurn() {
    if (state.result || showing) return;
    const idle = idleUnits(state);
    if (idle.length && !ui.skipIdleConfirm) {
      const v = idleLine(state, idle);
      const m = modal({
        className: 'say-sheet',
        content: `<div class="say-big">${stamp(v.who, { state, size: 52 })}<div><b>${esc(CAST[v.who].short)}</b><p>"${esc(v.say)}"</p></div></div>
          <label class="check-line"><input type="checkbox" data-skip> 이번 판에서는 다시 안 물어봐도 된다</label>`,
        actions: [
          { label: '가서 시킨다', onClick: () => { const u = idle[0]; selectUnit(u.id); } },
          { label: '그냥 한 달 보낸다', kind: 'primary', onClick: () => { ui.skipIdleConfirm = m.body.querySelector('[data-skip]').checked; nextTurn(); } },
        ],
      });
      return;
    }
    nextTurn();
  }

  function nextTurn() {
    if (state.result) return;
    const prevStage = state.stage;
    const report = endTurn(state);
    ui.unit = state.units.find((u) => u.id === ui.unit)?.id ?? null;
    saveGame(state);
    render();
    emit('turn', report);
    const newOnes = report.newCountries.map((id) => world.countries[id].name);
    toast({
      title: `${dateLabel(state.turn)} · 신도 ${report.change >= 0 ? '+' : '−'}${people(Math.abs(report.change))}명`,
      body: `이번 달 헌금 ${report.faith >= 0 ? '+' : ''}${report.faith}${newOnes.length ? ` · 처음 소문난 곳: ${newOnes.slice(0, 3).join(', ')}${newOnes.length > 3 ? ` 외 ${newOnes.length - 3}곳` : ''}` : ''}`,
      iconName: report.change >= 0 ? 'rise' : 'alert',
      tone: report.change >= 0 ? 'info' : 'bad',
      duration: 2600,
      key: 'turn',
    });
    for (const id of report.newCountries.slice(0, 6)) map.pulse(id, 'new', world.countries[id].name);
    for (const a of report.auto ?? []) map.pulse(a.at, 'spread');
    eventToasts(report);
    if (state.stage !== prevStage) map.flash();
    afterTurn(report);
  }

  function eventToasts(report) {
    for (const e of report.events) {
      const name = e.id ? world.countries[e.id].name : '';
      if (e.type === 'raid') {
        toast({ title: `${name} 압수수색`, body: `신도 ${people(e.lost)}명이 떠났다.${e.unitsLost ? ` 거기 있던 ${e.unitsLost}명은 연행됐다.` : ''}`, tone: 'bad', iconName: 'alert', duration: 4200 });
        map.pulse(e.id, 'raid');
      }
      if (e.type === 'ban') toast({ title: `${name} 활동 금지`, body: '간판도 못 걸고 사람도 못 모은다. 당국이 좀 잠잠해질 때까지 기다려야 한다.', tone: 'bad', iconName: 'alert', duration: 4800 });
      if (e.type === 'unban') toast({ title: `${name} 금지 풀림`, body: '다시 간판을 걸 수 있다.', iconName: 'check' });
      if (e.type === 'succession') toast({ title: '새 교주', body: `${josa(state.leader.name, '이/가')} 연단에 섰다. 마이크 높이부터 맞췄다. 간부들 분위기: ${mood(state.unity).text}.`, iconName: 'people', duration: 5600 });
      if (e.type === 'join' && JOIN_LINES[e.who]) toast({ who: e.who, title: `${CAST[e.who].name} 합류`, say: JOIN_LINES[e.who], body: CAST[e.who].trait, state, duration: 6000 });
    }
  }

  // 턴이 끝난 뒤 차례로: 계시 → 사건 카드 → 단계 상승 → 결과
  function afterTurn(report) {
    if (state.result) return enqueue((done) => showResult(state.result, done));
    maybeAbroad();
    const ch = dueRevelation(state);
    if (ch) enqueue((done) => openRevelation(ch, done));
    else {
      const inc = dueIncident(state, report);
      if (inc) enqueue((done) => showIncident(state, inc.card, inc.ctx, { onDone: () => { commit(); checkEnd(); done(); } }));
    }
    if (report.stages.length) enqueue((done) => showStageUp(report.stages.at(-1).to, done));
  }

  function openRevelation(ch, done) {
    showRevelation(state, ch, {
      onDone: () => {
        saveGame(state);
        render();
        checkEnd();
        done();
      },
    });
  }

  function checkEnd() {
    if (state.result) enqueue((done) => showResult(state.result, done));
    else maybeAbroad();
  }

  // 처음으로 바다 건너에 신도가 생기면: 지구 전체가 보이도록 천천히 멀어진다 (중반 전환점)
  function maybeAbroad() {
    const first = checkAbroad(state);
    if (!first) return;
    saveGame(state);
    enqueue((done) => showAbroad(first, done));
  }

  function showAbroad(id, done) {
    ui.country = null;
    ui.unit = null;
    render();
    map.reveal(state.religion.home, id);
    map.pulse(id, 'new', world.countries[id].name);
    const v = isIn(state, 'minho') ? ['minho', `근데요, ${world.countries[id].name}에서 전화 왔어요. 국제전화요. 요금은 누가 내요?`]
      : ['jeongsuk', `어머, 교주님~ ${world.countries[id].name}에서도 우리 얘기를 한대요!`];
    const el = document.createElement('div');
    el.className = 'abroad-card';
    el.innerHTML = `<div class="abroad-paper"><small>${esc(state.religion.name)} 주보 · 호외</small>
      <h2>바다를 건넜다</h2>
      <p>${esc(world.countries[id].name)}에 첫 신도가 생겼다. 성소 지도에 압정이 하나 더 꽂혔다.</p>
      <div class="say-big">${stamp(v[0], { state, size: 44 })}<div><b>${esc(CAST[v[0]].short)}</b><p>"${esc(v[1])}"</p></div></div>
      <button class="btn btn-primary" data-abroad>지도를 펼친다</button></div>`;
    document.body.appendChild(el);   // 지도가 멀어지는 동안 입력을 막고, 쪽지는 CSS 로 늦게 떠오른다
    el.addEventListener('click', (e) => {
      if (!e.target.closest('[data-abroad]')) return;
      el.classList.add('is-leaving');
      setTimeout(() => { el.remove(); done(); }, 300);
    });
  }

  // 큰 알림(계시·사건·단계 상승·결과)은 하나씩 차례로 띄운다
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
      return `<div class="next-goal"><h3>끝까지 가면</h3>
        <div class="goal-row"><span>지구 인구의 ${Math.round(VICTORY_SHARE * 100)}%</span><span>${people(p.followers)} / ${people(p.goal)}명</span></div>
        <div class="meter"><i style="width:${(p.ratio * 100).toFixed(1)}%"></i></div></div>`;
    }
    const unlocks = p.next.unlock.map((t) => `<span class="pill">${UNIT_TYPES[t].name} 모집 가능</span>`).join('');
    return `<div class="next-goal"><h3>다음 단계: ${p.next.name}</h3>
      <div class="goal-row"><span>전체 신도</span><span>${people(p.followers)} / ${people(p.next.followers)}명</span></div>
      <div class="meter"><i style="width:${(p.followerRatio * 100).toFixed(1)}%"></i></div>
      ${p.next.countries ? `<div class="goal-row"><span>신도 ${people(PRESENCE_MIN)}명 넘는 나라</span><span>${p.countries} / ${p.next.countries}곳</span></div>
      <div class="meter"><i style="width:${(p.countryRatio * 100).toFixed(1)}%"></i></div>` : ''}
      <div class="unlock-list"><span class="pill">정원 ${p.next.unitCap}명</span>${unlocks}</div></div>`;
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
    const v = stageLine(state, stageId);
    modal({
      dismissable: false,
      className: 'stage-up',
      content: `<div class="center" style="padding-top:12px"><div class="big-mark">${emblemSvg(state.religion.emblem)}</div>
        <div class="step-label">간판을 새로 단다</div><h2 class="stage-title">${s.name}</h2>
        ${v ? `<div class="say-big">${stamp(v.who, { state, size: 44 })}<div><b>${esc(CAST[v.who].short)}</b><p>"${esc(v.say)}"</p></div></div>` : ''}
        <p class="modal-text">정원 ${s.unitCap}명까지 늘었다.${unlocked ? ' 이제 이런 사람도 모을 수 있다.' : ''}</p>
        ${unlocked ? `<div class="unlock-list" style="justify-content:center">${unlocked}</div>` : ''}</div>
        ${goalBlock()}`,
      actions: [{ label: '현수막 건다', kind: 'primary' }],
      onClose,
    });
  }

  function showStageInfo() {
    const s = stageOf(state.stage);
    const total = totalFollowers(state);
    modal({
      title: s.name,
      subtitle: `${esc(state.religion.name)} · ${esc(state.leader.name)} ${state.leader.age}세`,
      content: `
        <div class="summary-grid" style="margin-top:4px">
          <div><small>전체 신도</small><b class="num">${people(total)}명</b></div>
          <div><small>지구 인구 대비</small><b class="num">${pct(total / world.totalPop)}</b></div>
          <div><small>신도 천 명 넘는 나라</small><b class="num">${presenceCount(state, PRESENCE_MIN)}곳</b></div>
          <div><small>간부들 분위기</small><b>${esc(mood(state.unity).text)}</b></div>
          <div class="wide"><small>신도 추이</small>${sparkline() || '<b>다음 달부터 그린다</b>'}</div>
        </div>
        ${goalBlock()}
        <div class="summary-grid">
          <div><small>화이트보드 첫 줄</small><b>${state.religion.deity ? `"${DEITIES[state.religion.deity].creed}"` : '아직'}</b></div>
          <div><small>규칙 세 줄</small><b>${state.religion.tenets.map((t) => TENETS[t].name).join(', ') || '신도 100명 되면'}</b></div>
          <div><small>후계자</small><b>${state.leader.immortal ? '없음 (안 죽기로 함)' : state.leader.heirCast ? CAST[state.leader.heirCast].short : '아직'}</b></div>
          <div><small>장부 서랍</small><b>${shadowWord(state.riskPoints)}</b></div>
        </div>`,
    });
  }

  function showResult(result, onClose) {
    const total = totalFollowers(state);
    const win = result === 'victory';
    const d = win ? VICTORY_TEXT : DEFEAT_TEXT[state.defeatReason] ?? DEFEAT_TEXT.followers;
    const speakerId = d.who.find((id) => isIn(state, id) || castOf(state, id).status === 'leader') ?? d.who.find((id) => castOf(state, id).status !== 'dead') ?? d.who[0];
    modal({
      dismissable: false,
      className: `result-sheet ${win ? 'is-win' : 'is-lose'}`,
      content: `<div class="center" style="padding-top:12px"><div class="big-mark">${emblemSvg(state.religion.emblem)}</div>
        <div class="step-label">${dateLabel(state.turn)} · 창시 ${state.turn}개월째</div>
        <h2 class="stage-title">${esc(d.title)}</h2>
        <p class="modal-text">${esc(win ? d.body(state.religion.name) : d.body)}${win ? '' : ` 가장 많았을 때는 ${people(state.peakFollowers)}명이었다.`}</p>
        <div class="say-big">${stamp(speakerId, { state, size: 44 })}<div><b>${esc(CAST[speakerId].short)}</b><p>"${esc(d.line[speakerId])}"</p></div></div></div>
        <div class="summary-grid"><div><small>남은 신도</small><b class="num">${people(total)}명</b></div><div><small>장부 서랍</small><b>${shadowWord(state.riskPoints)}</b></div></div>`,
      actions: [{ label: '지나온 일 보기', onClick: () => setTimeout(() => showChronicle(state), 300) }, { label: '처음부터 다시', kind: 'primary', onClick: () => onNewGame() }],
      onClose,
    });
  }

  function showHelp() {
    modal({
      title: '처음 온 사람 안내문',
      wide: true,
      content: `<div class="list">
        ${[
          ['한 번 누르면 한 달', '"한 달 보내기"를 누르면 신도가 늘거나 줄고, 헌금이 들어오고, 소문이 이웃 나라로 번진다. 때가 되면 계시나 사건이 찾아온다.'],
          ['가만히 있으면 시든다', '사람은 직접 모아야 한다. 선교사, 기적, 성지. 교단이 커질수록 한 사람이 데려오는 수도 커진다.'],
          ['한국에서 시작한다', '국경 붙은 나라는 북한뿐이다. 바닷길로 일본, 중국, 러시아에 닿고, 교민이 많은 나라는 처음 들어갈 때 잘 먹힌다. 신도가 천 명쯤 되면 바다 건너에서 연락이 온다.'],
          ['당국과 동네 인심', '눈에 띌수록 당국이 본다. 경고장, 압수수색, 활동 금지 순서로 온다. 동네 인심이 나빠지면 사람이 잘 안 모인다. 봉사자를 보내면 조금 풀린다.'],
          ['간부들 분위기', '분위기가 가라앉으면 사람이 빠지고, 끝까지 가라앉으면 교단이 쪼개진다.'],
          ['장부 서랍', '나쁜 선택은 당장은 달다. 서랍에 쌓인 영수증은 나중에 폭로, 내부 고발, 분열로 돌아온다. 떠난 사람은 증인으로도 돌아온다.'],
          ['교주도 늙는다', '1년에 한 살. 일흔이 넘으면 언제든 쓰러질 수 있다. 후계자가 없으면 그걸로 끝이다.'],
          ['정확한 숫자', '메뉴의 교단 장부에 다 적혀 있다.'],
          ['끝', `지구 인구의 ${Math.round(VICTORY_SHARE * 100)}%가 믿으면 끝까지 간 것이다. 신도가 다 떠나거나 교주가 잡히거나 죽거나 교단이 쪼개지면 거기서 끝. 자동 저장된다.`],
        ].map(([t, dsc]) => `<div class="row" style="flex-direction:column;align-items:flex-start;gap:2px"><b style="font-weight:600">${t}</b><span class="muted" style="font-size:14px">${dsc}</span></div>`).join('')}
      </div>`,
    });
  }

  function showMenu() {
    const m = modal({
      title: '서랍',
      content: `<div class="list">
        <button class="row" style="width:100%" data-m="ledger"><span class="row-label">${icon('people')}교단 장부 (정확한 숫자)</span>${icon('chevron')}</button>
        <button class="row" style="width:100%" data-m="chronicle"><span class="row-label">${icon('flag')}지나온 일</span>${icon('chevron')}</button>
        <button class="row" style="width:100%" data-m="stage"><span class="row-label">${icon('rise')}교단 단계</span>${icon('chevron')}</button>
        <button class="row" style="width:100%" data-m="help"><span class="row-label">${icon('help')}처음 온 사람 안내문</span>${icon('chevron')}</button>
        <button class="row" style="width:100%" data-m="new"><span class="row-label" style="color:var(--bad)">${icon('reset')}간판 내리고 처음부터</span></button>
      </div><p class="panel-note">이 브라우저에 알아서 저장된다.</p>`,
    });
    m.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      m.close();
      if (b.dataset.m === 'ledger') showLedger(state);
      if (b.dataset.m === 'chronicle') showChronicle(state);
      if (b.dataset.m === 'stage') showStageInfo();
      if (b.dataset.m === 'help') showHelp();
      if (b.dataset.m === 'new') {
        const who = isIn(state, 'mom') ? ['mom', '그래, 그만하고 밥이나 먹자.'] : ['minho', '근데요, 진짜요? 의자 다 접어요?'];
        modal({
          className: 'say-sheet',
          content: `<div class="say-big">${stamp(who[0], { state, size: 52 })}<div><b>${esc(CAST[who[0]].short)}</b><p>"${esc(who[1])}"</p></div></div><p class="modal-text">지금 교단은 없어진다.</p>`,
          actions: [{ label: '아니, 계속한다' }, { label: '간판 내린다', kind: 'primary danger', onClick: () => onNewGame() }],
        });
      }
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
    if (t.dataset.panel === 'expand') { if (swallowClick) { swallowClick = false; return; } setExpanded(!ui.panelExpanded); return; }
    if (t.dataset.panel === 'produce') { production = openProduction(state, ui.country, spawnFromSheet); return; }
    if (t.dataset.panel === 'miracle') return miracle(ui.country);
    if (t.dataset.panel === 'holy') return holySite(ui.country);
    if (t.dataset.panel === 'approach') { openApproach(state, ui.country, chooseApproach); return; }
    if (t.dataset.unit) { selectUnit(t.dataset.unit); return; }
    if (t.dataset.dockCountry) { selectCountry(t.dataset.dockCountry); return; }
    if (t.dataset.dock === 'all') { ui.country = null; ui.unit = null; render(); return; }
    if (t.dataset.dock === 'produce') { production = openProduction(state, ui.country, spawnFromSheet); return; }
    if (t.dataset.dock === 'end-turn') return requestNextTurn();
    if (t.dataset.dock === 'act') return act();
    if (t.dataset.dock === 'auto') return toggleAuto();
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

  // 모바일 시트: 손잡이를 위로 밀면 펼치고, 아래로 밀면 접거나 닫는다
  function setExpanded(v) {
    ui.panelExpanded = v;
    render();
    if (ui.country) flyToCountry(ui.country);
  }
  let dragY = null;
  let swallowClick = false;   // 끌기로 처리했으면 이어지는 클릭은 무시
  panelEl.addEventListener('pointerdown', (e) => { if (e.target.closest('.panel-grip, .panel-head')) dragY = e.clientY; });
  const onPointerUp = (e) => {
    if (dragY == null) return;
    const dy = e.clientY - dragY;
    dragY = null;
    if (Math.abs(dy) > 36) {
      swallowClick = true;
      setTimeout(() => { swallowClick = false; }, 400);
    }
    if (dy < -36 && !ui.panelExpanded) setExpanded(true);
    else if (dy > 36) {
      if (ui.panelExpanded) setExpanded(false);
      else { ui.country = null; ui.unit = null; render(); }
    }
  };
  addEventListener('pointerup', onPointerUp);

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
      : '<div class="row muted" style="font-size:14px">그런 나라는 없다</div>';
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') results.querySelector('[data-go]')?.click();
    if (e.key === 'Escape') { searchInput.value = ''; results.hidden = true; searchInput.blur(); }
  });
  searchInput.addEventListener('blur', () => setTimeout(() => { results.hidden = true; }, 150));

  // 단축키: 스페이스/엔터 = 다음 달, Esc = 선택 해제
  const onKey = (e) => {
    if (document.querySelector('.overlay, .revelation') || e.target.matches('input, select, textarea')) return;
    if (e.key === 'Escape') { ui.unit = null; ui.country = null; render(); }
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); requestNextTurn(); }
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
  // 지도가 열린 직후: 밀린 계시(첫 턴의 계시 III 등)부터
  const due = dueRevelation(state);
  if (due) setTimeout(() => enqueue((done) => openRevelation(due, done)), 1600);
  if (state.result) enqueue((done) => showResult(state.result, done));

  return {
    destroy() {
      document.removeEventListener('keydown', onKey);
      removeEventListener('pointerup', onPointerUp);
      dockObserver.disconnect();
      map.bind({});
      map.setReach(null);
      map.setUnits([]);
      map.setMarks([], []);
      map.setSelected(null);
      root.remove();
    },
    state,
    focusCountry: flyToCountry,
    // 처음 열 때: 아직 바다를 안 건넜으면 한국에 바짝 붙어서 시작
    openView() { flyToCountry(state.religion.home, state.flags.abroad ? 2.4 : 6); },
    // 개발 확인용
    debug: { nextTurn, spawn, selectCountry, selectUnit, act, miracle, holySite, ui, unitCost: (t) => unitCost(state, t), jailed: () => isJailed(state) },
  };
}
