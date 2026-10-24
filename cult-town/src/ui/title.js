// 오락실 타이틀 (28장 D): 제작자 그림 위 로고 · "헌금을 넣으세요" · CREDIT → 세로 메뉴. 30초 가만히 있으면 동네 데모.
// 메뉴 조작은 arcade.js (방향키·Enter·▶). 여기선 타이틀 상태(어트랙트 → 메뉴)와 확인 창만.
import { GAME, DIFFICULTY } from '../config.js';
import { h, mount, unmount } from './dom.js';
import { sfx } from './sfx.js';
import { toggleMute, isMuted } from './sound.js';

const IDLE_MS = 30_000;
const touchy = () => window.matchMedia?.('(hover: none)').matches;

// opts: { save: null | { leader, cult, date, members, difficulty }, onNew, onContinue, onCredits, onWipe, demo(onEnd) → stop() }
let currentTitle = null;
export function showTitle(opts) {
  currentTitle?.close();
  let state = 'attract';
  let credit = 0;
  let idle = null; let stopDemo = null;
  const pickImg = () => (window.innerWidth / window.innerHeight < 0.85 ? 'tall' : 'wide');
  const img = h('img', { class: 'title-art', alt: '', src: `./assets/title/title-${pickImg()}.webp`, draggable: 'false' });
  const onResize = () => { const want = `./assets/title/title-${pickImg()}.webp`; if (!img.src.endsWith(want.slice(1))) img.src = want; };
  const logo = h('div', { class: 'arcade-logo' }, [...GAME.title].map((ch, i) => h('span', { style: `animation-delay:${i * 0.09}s` }, ch === ' ' ? ' ' : ch)));
  const sub = h('div', { class: 'arcade-sub' }, '신림역 3번 출구, 상가 302호');
  const insert = h('div', { class: 'insert' }, touchy() ? '화면을 누르세요' : '헌금을 넣으세요 · ENTER');
  const creditEl = h('div', { class: 'credit' }, 'CREDIT 0');
  const legal = h('div', { class: 'legal' }, '교단·인물·가게 이름은 전부 지어낸 것이다. 실존 단체와 관계없다.');
  const menuBox = h('div', { class: 'arcade-menu hidden' });
  const root = h('div', { class: 'screen title-arcade', 'data-arcade': 'top' }, img, h('div', { class: 'shade' }), h('div', { class: 'top' }, logo, sub), menuBox, insert, creditEl, legal);

  const resetIdle = () => {
    clearTimeout(idle);
    if (state === 'attract') idle = setTimeout(startDemo, IDLE_MS);
  };
  function startDemo() {
    if (state !== 'attract') return;
    state = 'demo';
    root.classList.add('demo');
    stopDemo = opts.demo?.(() => endDemo());
  }
  function endDemo() {
    if (state !== 'demo') return;
    stopDemo?.(); stopDemo = null;
    state = 'attract';
    root.classList.remove('demo');
    resetIdle();
  }
  function coin() {
    if (state !== 'attract') return;
    credit = 1;
    creditEl.textContent = 'CREDIT 1';
    creditEl.classList.add('pop');
    sfx.coin();
    state = 'coin';
    clearTimeout(idle);
    setTimeout(showMenu, 550);
  }

  // ── 메뉴 ──
  const item = (label, sub2, fn, { disabled = false, def = false } = {}) => h('button', {
    class: `mi${disabled ? ' off' : ''}`, disabled, onclick: () => fn(), ...(def ? { 'data-arcade-default': '' } : {}),
  }, h('span', { class: 'l' }, label), sub2 ? h('small', {}, sub2) : null);
  function showMenu() {
    state = 'menu';
    root.classList.add('menu-on');
    insert.classList.add('hidden');
    const sv = opts.save;
    menuBox.replaceChildren(
      item('이어서 하기', sv ? `${sv.leader} · ${sv.cult} · ${sv.date} · 신도 ${sv.members}명${sv.difficulty ? ` · ${DIFFICULTY[sv.difficulty]?.name ?? ''}` : ''}` : '저장된 기록 없음', () => { close(); opts.onContinue(); }, { disabled: !sv, def: !!sv }),
      item('새로 시작', null, () => (sv ? confirmNew() : (close(), opts.onNew())), { def: !sv }),
      item('설정', null, showSettings),
      item('도움말', null, showHelp),
      item('만든 사람들', null, () => opts.onCredits()),
    );
    menuBox.classList.remove('hidden');
  }
  const sub2Panel = (title, body, back) => {
    const box = h('div', { class: 'screen arcade-pop', 'data-arcade': 'top' }, h('div', { class: 'panel box' }, h('h2', {}, title), ...body,
      h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: () => { sfx.back(); unmount('title-pop'); back?.(); } }, '돌아가기'))));
    mount('title-pop', box);
  };
  function confirmNew() {
    mount('title-pop', h('div', { class: 'screen arcade-pop', 'data-arcade': 'top' }, h('div', { class: 'panel box' },
      h('h2', {}, '기존 기록이 지워집니다. 정말?'),
      h('p', { class: 'muted' }, `${opts.save.leader} · ${opts.save.cult} · ${opts.save.date}`),
      h('div', { class: 'stack' },
        h('button', { class: 'btn danger', onclick: () => { unmount('title-pop'); close(); opts.onNew(); } }, '예, 새로 시작'),
        h('button', { class: 'btn', 'data-arcade-default': '', onclick: () => { sfx.back(); unmount('title-pop'); } }, '아니오')))));
  }
  function showSettings() {
    const snd = h('button', { class: 'btn', onclick: () => { snd.textContent = `소리: ${toggleMute() ? '끔' : '켬'}`; } }, `소리: ${isMuted() ? '끔' : '켬'}`);
    const wipe = opts.save ? h('button', { class: 'btn danger', onclick: () => { opts.onWipe(); opts.save = null; unmount('title-pop'); showMenu(); } }, '저장 지우기') : null;
    sub2Panel('설정', [h('div', { class: 'stack' }, snd, wipe)]);
  }
  function showHelp() {
    sub2Panel('도움말', [
      h('p', {}, '평범한 사람이 신림동 상가 302호에서 교단을 차린다. 낮엔 동네를 걸으며 사람들과 얘기하고, 밤엔 성소를 꾸리고 예배를 연다.'),
      h('p', {}, '매달 25일이 월세 날. 그날까지 단계 목표(신도 수 등)를 채우면 다음 단계로 간다.'),
      h('table', { class: 'keys' }, h('tbody', {},
        [['방향키 · WASD', '걷기 · 메뉴 고르기'], ['Enter · Space', '말 걸기 · 들어가기 · 결정'], ['1~5', '대화 선택지'], ['Esc', '뒤로 · 메뉴'], ['N', '수첩'], ['1 · 2', '보통 · 빠르게']]
          .map(([k, v]) => h('tr', {}, h('td', {}, h('kbd', {}, k)), h('td', {}, v))))),
      h('p', { class: 'muted' }, '모바일: 왼쪽 아래 스틱으로 걷고, 가고 싶은 곳이나 사람을 누른다.'),
    ]);
  }

  // ── 입력 ──
  const onKey = (e) => {
    if (state === 'demo') { e.preventDefault(); e.stopImmediatePropagation(); endDemo(); return; }
    if (state === 'attract') {
      resetIdle();
      if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) { e.preventDefault(); e.stopImmediatePropagation(); coin(); }
      return;
    }
    if (state === 'menu' && e.code === 'Escape') {
      if (document.querySelector('[data-id="title-pop"]')) { sfx.back(); unmount('title-pop'); return; }
      sfx.back();
      state = 'attract'; credit = 0; creditEl.textContent = 'CREDIT 0'; creditEl.classList.remove('pop');
      root.classList.remove('menu-on'); menuBox.classList.add('hidden'); insert.classList.remove('hidden');
      resetIdle();
    }
  };
  const onPointer = (e) => {
    if (state === 'demo') { endDemo(); return; }
    if (state === 'attract' && !e.target.closest('button')) coin();
    resetIdle();
  };
  function close() {
    clearTimeout(idle);
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onResize);
    stopDemo?.();
    unmount('title-pop');
    unmount('title');
  }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', onResize);
  root.addEventListener('pointerdown', onPointer);
  mount('title', root);
  resetIdle();
  currentTitle = { close, state: () => state, credit: () => credit };
  return currentTitle;
}
export const hideTitle = () => { currentTitle?.close(); currentTitle = null; };
