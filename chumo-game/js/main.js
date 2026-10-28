// 화면 그리기와 입력(스와이프·버튼·키보드). 규칙은 engine.js, 데이터 읽기는 loader.js.

import { STATS, NEW_DAYS, STORAGE_KEY_BEST } from './config.js';
import { loadContent, ContentError } from './loader.js';
import { Game } from './engine.js';

const $ = (id) => document.getElementById(id);
const screens = ['loading', 'error', 'title', 'game', 'ending'];

let content = null;
let game = null;
let busy = false;        // 카드가 날아가는 중에는 입력을 받지 않는다
let previewSide = null;

function show(name) {
  for (const s of screens) $(`screen-${s}`).hidden = s !== name;
}

// ---------------------------------------------------------------------------
// 최고 기록 (localStorage가 막힌 환경에서도 게임은 돌아가야 한다)

function getBest() {
  try { return Number(localStorage.getItem(STORAGE_KEY_BEST)) || 0; } catch { return 0; }
}
function setBest(v) {
  try { localStorage.setItem(STORAGE_KEY_BEST, String(v)); } catch { /* 저장 못 해도 진행 */ }
}

// ---------------------------------------------------------------------------
// 날짜

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function daysSince(dateStr) {
  return Math.round((Date.parse(todayStr()) - Date.parse(dateStr)) / 86400000);
}
function isNew(card) {
  return card.added !== null && daysSince(card.added) < NEW_DAYS;
}
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

// ---------------------------------------------------------------------------
// 이미지: 카드 image → 인물 portrait → 이니셜 원형. 무엇이 깨져도 멈추지 않는다.

function hueOf(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.codePointAt(0)) % 360;
  return h;
}

function renderPortrait(el, sources, initials, seed) {
  const token = (el._token = (el._token || 0) + 1);
  const list = sources.filter(Boolean);
  const fallback = () => {
    if (el._token !== token) return;
    const circle = document.createElement('div');
    circle.className = 'initials';
    circle.textContent = initials || '?';
    circle.style.setProperty('--hue', hueOf(seed || initials || '?'));
    el.replaceChildren(circle);
  };
  const tryAt = (i) => {
    if (el._token !== token) return;
    if (i >= list.length) return fallback();
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.onload = () => { if (el._token === token) el.replaceChildren(img); };
    img.onerror = () => tryAt(i + 1);
    img.src = list[i];
  };
  el.replaceChildren();
  tryAt(0);
}

// ---------------------------------------------------------------------------
// 수치 표시

function buildStats() {
  $('stats').replaceChildren(...STATS.map(({ key, icon }) => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.dataset.key = key;
    el.innerHTML = `
      <div class="gauge"><div class="gauge-fill"></div><span class="gauge-icon" aria-hidden="true">${icon}</span></div>
      <span class="stat-name">${key}</span>
      <span class="stat-dot" aria-hidden="true"></span>`;
    return el;
  }));
}

function renderStats(changes = {}) {
  for (const el of $('stats').children) {
    const key = el.dataset.key;
    const v = game.stats[key];
    el.querySelector('.gauge-fill').style.height = `${v}%`;
    el.classList.toggle('danger', v <= 20 || v >= 80);
    el.setAttribute('aria-label', `${key} ${v}`);
    const d = changes[key];
    if (d) {
      el.classList.remove('up', 'down');
      void el.offsetWidth; // 같은 방향이 연달아 와도 애니메이션 다시 재생
      el.classList.add(d > 0 ? 'up' : 'down');
    }
  }
}

function setPreview(side, strength = 1) {
  previewSide = side;
  const affected = side ? game.affected(side) : [];
  for (const el of $('stats').children) {
    el.classList.toggle('marked', affected.includes(el.dataset.key));
  }
  $('labelLeft').style.opacity = side === 'left' ? strength : 0;
  $('labelRight').style.opacity = side === 'right' ? strength : 0;
  $('btnLeft').classList.toggle('active', side === 'left');
  $('btnRight').classList.toggle('active', side === 'right');
}

// ---------------------------------------------------------------------------
// 카드

function renderCard() {
  const card = game.current;
  const who = content.characters.get(card.who);
  const name = who ? who.name : card.who || '익명';
  $('speech').textContent = card.text;
  $('whoName').textContent = name;
  $('whoTitle').textContent = who && who.title ? who.title : '';
  $('cardNew').hidden = !isNew(card);
  $('labelLeft').textContent = card.left.label;
  $('labelRight').textContent = card.right.label;
  $('btnLeft').textContent = `◀ ${card.left.label}`;
  $('btnRight').textContent = `${card.right.label} ▶`;
  $('days').textContent = `재임 ${game.days + 1}일차`;
  renderPortrait($('cardPortrait'), [card.image, who && who.portrait], who ? who.initials : [...name][0], card.who);

  const el = $('card');
  el.style.transition = 'none';
  el.style.transform = '';
  el.style.opacity = '';
  el.classList.remove('enter');
  void el.offsetWidth;
  el.classList.add('enter');
  setPreview(null);
}

function tilt(dx) {
  const el = $('card');
  el.style.transition = 'none';
  el.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
}

function resetTilt() {
  const el = $('card');
  el.style.transition = 'transform .25s cubic-bezier(.2,.9,.3,1.2)';
  el.style.transform = '';
  setPreview(null);
}

function commit(side) {
  if (busy) return;
  busy = true;
  setPreview(side);
  const el = $('card');
  const dir = side === 'left' ? -1 : 1;
  el.style.transition = 'transform .3s ease-in, opacity .3s ease-in';
  el.style.transform = `translateX(${dir * 120}vw) rotate(${dir * 28}deg)`;
  el.style.opacity = '0';

  setTimeout(() => {
    const result = game.choose(side);
    renderStats(result.changes);
    if (result.ending) {
      setPreview(null);
      setTimeout(() => showEnding(result.ending), 900);
      return;
    }
    renderCard();
    busy = false;
  }, 300);
}

// ---------------------------------------------------------------------------
// 입력: 스와이프

function swipeThreshold() {
  return Math.min(120, $('card').offsetWidth * 0.4);
}

function bindSwipe() {
  const el = $('card');
  let drag = null;

  el.addEventListener('pointerdown', (e) => {
    if (busy || e.button > 0) return;
    drag = { x: e.clientX, t: performance.now(), dx: 0 };
    el.classList.remove('enter'); // 등장 애니메이션 중에도 바로 잡을 수 있게
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x;
    tilt(drag.dx);
    const side = drag.dx < -12 ? 'left' : drag.dx > 12 ? 'right' : null;
    setPreview(side, Math.min(1, Math.abs(drag.dx) / swipeThreshold()));
  });
  const end = (e) => {
    if (!drag) return;
    const { dx, t } = drag;
    drag = null;
    const speed = Math.abs(dx) / Math.max(1, performance.now() - t);
    const flick = Math.abs(dx) > 40 && speed > 0.6;
    if (e.type === 'pointerup' && (Math.abs(dx) > swipeThreshold() || flick)) commit(dx < 0 ? 'left' : 'right');
    else resetTilt();
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

// 입력: 버튼 (마우스를 올리거나 포커스하면 점 미리보기, 누르면 결재)
function bindButtons() {
  for (const btn of [$('btnLeft'), $('btnRight')]) {
    const side = btn.dataset.side;
    // 터치 화면은 누르는 순간 바로 결재한다 (미리보기는 카드를 끌어서 본다)
    btn.addEventListener('pointerenter', (e) => {
      if (!busy && e.pointerType === 'mouse') { tilt(side === 'left' ? -24 : 24); setPreview(side); }
    });
    btn.addEventListener('pointerleave', (e) => { if (!busy && e.pointerType === 'mouse') resetTilt(); });
    btn.addEventListener('focus', () => { if (!busy && btn.matches(':focus-visible')) setPreview(side); });
    btn.addEventListener('blur', () => { if (!busy) setPreview(null); });
    btn.addEventListener('click', () => commit(side));
  }
}

// 입력: 키보드 (←/→ 한 번은 미리보기, 같은 쪽을 한 번 더 누르면 결재)
function bindKeys() {
  document.addEventListener('keydown', (e) => {
    if ($('screen-game').hidden || busy || $('modal').open) return;
    const side = e.key === 'ArrowLeft' ? 'left' : e.key === 'ArrowRight' ? 'right' : null;
    if (side) {
      e.preventDefault();
      if (previewSide === side) commit(side);
      else { tilt(side === 'left' ? -50 : 50); setPreview(side); }
    } else if (e.key === 'Escape') {
      resetTilt();
    }
  });
}

// ---------------------------------------------------------------------------
// 화면 흐름

function startGame() {
  game = new Game(content);
  game.start();
  busy = false;
  show('game');
  renderStats();
  renderCard();
}

function showTitle() {
  const best = getBest();
  $('titleBest').textContent = best ? `최장 재임 기록 ${best}일` : '';
  show('title');
}

function showEnding(ending) {
  const days = game.days;
  const prev = getBest();
  if (days > prev) setBest(days);
  $('endingTitle').textContent = ending.title;
  $('endingCause').textContent = `사유: ${ending.stat} ${ending.at === 0 ? '고갈' : '과열'}`;
  $('endingText').textContent = ending.text;
  $('endingDays').textContent = days;
  $('endingBest').textContent = days > prev
    ? (prev ? `신기록 · 이전 최장 ${prev}일` : '첫 기록')
    : `최장 재임 기록 ${prev}일`;
  $('endingBest').classList.toggle('record', days > prev);

  const box = $('endingImage');
  box.hidden = true;
  box.replaceChildren();
  if (ending.image) {
    const img = new Image();
    img.alt = '';
    img.onload = () => { box.replaceChildren(img); box.hidden = false; };
    img.src = ending.image;
  }
  busy = false;
  show('ending');
}

function openModal(title, nodes) {
  $('modalTitle').textContent = title;
  $('modalBody').replaceChildren(...nodes);
  const dlg = $('modal');
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
}

function showChangelog() {
  const groups = new Map();
  for (const c of content.cards) {
    const key = c.added || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  }
  const keys = [...groups.keys()].sort((a, b) => (a === '' ? 1 : b === '' ? -1 : b.localeCompare(a)));
  const intro = document.createElement('p');
  intro.className = 'modal-note';
  intro.textContent = `현재 결재 서류 총 ${content.cards.length}장`;
  const list = document.createElement('ol');
  list.className = 'changelog';
  for (const key of keys) {
    const cards = groups.get(key);
    const names = [...new Set(cards.map((c) => content.characters.get(c.who)?.name || c.who))];
    const li = document.createElement('li');
    const fresh = key && daysSince(key) < NEW_DAYS;
    li.innerHTML = `
      <span class="cl-date">${key ? formatDate(key) : '날짜 미기재'}${fresh ? ' <span class="badge-new inline">NEW</span>' : ''}</span>
      <span class="cl-count">새 카드 <strong>${cards.length}</strong>장</span>
      <span class="cl-who"></span>`;
    li.querySelector('.cl-who').textContent = `등장: ${names.join(', ')}`;
    list.append(li);
  }
  openModal('개정 내역', [intro, list]);
}

function showWarnings() {
  const intro = document.createElement('p');
  intro.className = 'modal-note';
  intro.textContent = '게임은 그대로 돌아가지만, 아래 항목은 의도와 다르게 동작할 수 있습니다.';
  const list = document.createElement('ul');
  list.className = 'warn-list';
  for (const w of content.warnings) {
    const li = document.createElement('li');
    li.textContent = w;
    list.append(li);
  }
  openModal(`콘텐츠 점검 · 경고 ${content.warnings.length}건`, [intro, list]);
}

function showError(err) {
  const isContent = err instanceof ContentError;
  $('errFile').textContent = isContent ? `chumo-game/${err.file}` : '알 수 없음';
  $('errWhere').textContent = isContent && err.line ? `${err.line}번째 줄, ${err.column}번째 칸 근처` : '-';
  $('errMsg').textContent = err.message || String(err);
  $('errSnippet').textContent = isContent ? err.snippet : '';
  $('errSnippet').hidden = !(isContent && err.snippet);
  show('error');
  console.error(err);
}

// ---------------------------------------------------------------------------

async function init() {
  if (location.protocol === 'file:') return; // index.html이 안내문을 띄운다
  try {
    content = await loadContent();
  } catch (err) {
    showError(err);
    return;
  }
  if (content.warnings.length) {
    console.warn('[추모공화국 카드 게임] 콘텐츠 경고\n' + content.warnings.join('\n'));
    $('btnWarnings').textContent = `⚠ 콘텐츠 점검: 경고 ${content.warnings.length}건`;
    $('btnWarnings').hidden = false;
  }
  buildStats();
  bindSwipe();
  bindButtons();
  bindKeys();
  $('btnStart').addEventListener('click', startGame);
  $('btnRetry').addEventListener('click', startGame);
  $('btnHome').addEventListener('click', showTitle);
  $('btnChangelog').addEventListener('click', showChangelog);
  $('btnWarnings').addEventListener('click', showWarnings);
  showTitle();
}

init();
