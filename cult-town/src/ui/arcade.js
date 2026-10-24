// 오락실 메뉴 조작 (28장 D-4): 맨 위에 떠 있는 창의 버튼을 방향키(↑↓←→ · WASD)로 고르고 Enter·Space 로 누른다.
// 고른 버튼 앞에 깜빡이는 ▶ (CSS .btn.cur). 대화 선택지(.opts)는 숫자 1~9 로 바로. 마우스를 올리면 커서도 따라간다.
// 모든 판정은 e.code (한글 입력 상태에서도 된다). 글 입력칸에 있을 땐 손대지 않는다.
// 창 = #ui 바로 아래 data-id 가 있는 요소 중 마지막 것 (상태창·아래 버튼 줄·설명 풍선 같은 늘 떠 있는 것은 뺀다).
import { sfx } from './sfx.js';

const SKIP = new Set(['hud', 'actionbar', 'hudtip', 'dpad']);
const PREV = new Set(['ArrowUp', 'ArrowLeft', 'KeyW', 'KeyA']);
const NEXT = new Set(['ArrowDown', 'ArrowRight', 'KeyS', 'KeyD']);
const OK = new Set(['Enter', 'NumpadEnter', 'Space']);
let hoverable = false;

const shown = (el) => el.getClientRects().length > 0;
const visible = (b) => shown(b) && !b.disabled && !b.classList.contains('hidden') && !b.closest('.hidden');

export function activePanel() {
  const ui = document.getElementById('ui');
  if (!ui) return null;
  const list = [...ui.children].filter((el) => el.dataset.id && !SKIP.has(el.dataset.id) && shown(el));
  for (let i = list.length - 1; i >= 0; i--) if (buttonsOf(list[i]).length || list[i].dataset.arcade === 'keys') return list[i];
  return null;
}
export function buttonsOf(panel) {
  return [...panel.querySelectorAll('button, [data-arcade-item]')].filter((b) => visible(b) && !b.hasAttribute('data-noarcade'));
}
// 처음 커서 자리: 선택지 → 'primary' 아닌 버튼이 먼저인 메뉴는 맨 위 → 없으면 첫 번째
function defaultButton(panel, btns) {
  return panel.querySelector('[data-arcade-default]:not([disabled])') ?? btns.find((b) => b.closest('.opts')) ?? (panel.dataset.arcade === 'top' ? btns[0] : btns.find((b) => b.classList.contains('primary'))) ?? btns[0];
}
export function setCursor(panel, btn, sound = false) {
  for (const b of panel.querySelectorAll('.cur')) b.classList.remove('cur');
  if (!btn) return;
  btn.classList.add('cur');
  panel._cur = btn;
  btn.scrollIntoView?.({ block: 'nearest' });
  if (sound) sfx.move();
}
function current(panel, btns) {
  if (panel._cur && btns.includes(panel._cur)) return panel._cur;
  const d = defaultButton(panel, btns);
  setCursor(panel, d);
  return d;
}

// app: 지금 키를 받아도 되는지 (게임 중엔 창이 떠 있을 때만)
export function installArcade(app) {
  hoverable = window.matchMedia?.('(hover: hover)').matches ?? true;
  window.addEventListener('keydown', (e) => {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (app.s && app.modal === 0) return;            // 걸어 다니는 중: 게임 조작
    const panel = activePanel();
    if (!panel || panel.dataset.arcade === 'keys') return;
    const btns = buttonsOf(panel);
    if (!btns.length) return;
    const cur = current(panel, btns);
    let i = btns.indexOf(cur);
    if (PREV.has(e.code) || NEXT.has(e.code)) {
      i = (i + (PREV.has(e.code) ? -1 : 1) + btns.length) % btns.length;
      setCursor(panel, btns[i], true);
    } else if (OK.has(e.code)) {
      if (e.repeat) { e.preventDefault(); e.stopImmediatePropagation(); return; }
      sfx.pick();
      cur.click();
    } else if (/^(Digit|Numpad)[1-9]$/.test(e.code)) {
      const opts = btns.filter((b) => b.closest('.opts'));
      const n = Number(e.code.at(-1)) - 1;
      if (!opts[n]) return;
      setCursor(panel, opts[n]);
      sfx.pick();
      opts[n].click();
    } else return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);
  // 새 창이 뜨면 커서를 바로 보여 준다 (키보드·마우스 기기). 마우스를 올리면 커서가 따라간다
  const ui = document.getElementById('ui');
  new MutationObserver(() => {
    if (!hoverable) return;
    const panel = activePanel();
    if (!panel) return;
    const btns = buttonsOf(panel);
    if (btns.length && !(panel._cur && btns.includes(panel._cur))) setCursor(panel, defaultButton(panel, btns));
    else if (panel._cur && !panel._cur.classList.contains('cur')) panel._cur.classList.add('cur');
  }).observe(ui, { childList: true });   // #ui 바로 아래만 (상태창이 자주 바뀌어도 매 프레임 재지 않게)
  ui.addEventListener('mouseover', (e) => {
    const b = e.target.closest?.('button, [data-arcade-item]');
    if (!b || !visible(b)) return;
    const panel = activePanel();
    if (panel && panel.contains(b) && panel._cur !== b) setCursor(panel, b);
  });
}
