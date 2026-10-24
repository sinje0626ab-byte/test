// 교주 감정 표현 둥근 메뉴 (29장 B): 교주를 누르거나 E 키. 방향키로 돌리고 숫자 1~9·0 으로 바로 고른다 (arcade.js 가 .opts 숫자를 처리).
// 잠긴 표현은 흐리게 '레벨 n' 만 보인다. Esc·바깥 누르기·E 다시 누르기는 닫기.
import { h, mount, unmount } from './dom.js';

export const EMOTE_ICON = {
  smile: '^ ^', wave: '~/', bow: '꾸벅', heart: '♥', pray: '( )', sigh: '…', angry: '!!', what: '?', bless: '✶', clap: '짝', dismiss: '↩',
};

// items: emotesFor(s) · at: 교주가 화면에 있는 자리 {x, y} (없으면 화면 가운데)
export function showEmoteMenu(app, items, onPick, at = null) {
  const close = () => { unmount('emote'); app.setBack('emote', null); app.modalClosed(); window.removeEventListener('keydown', onKey, true); };
  const pick = (e) => { if (e.locked) return; close(); onPick(e.id); };
  const R = items.length > 8 ? 122 : 96;
  const cx = Math.max(R + 40, Math.min(window.innerWidth - R - 40, at?.x ?? window.innerWidth / 2));
  const cy = Math.max(R + 40, Math.min(window.innerHeight - R - 60, at?.y ?? window.innerHeight / 2));
  const btns = items.map((e, i) => {
    const a = -Math.PI / 2 + (i / items.length) * Math.PI * 2;
    const key = i < 9 ? String(i + 1) : i === 9 ? '0' : '';
    return h('button', {
      class: `emote-btn${e.locked ? ' locked' : ''}${e.id === 'dismiss' ? ' dismiss' : ''}`,
      style: `left:${Math.round(cx + Math.cos(a) * R)}px;top:${Math.round(cy + Math.sin(a) * R)}px`,
      'data-key': key,
      onclick: (ev) => { ev.stopPropagation(); pick(e); },
      disabled: e.locked || null,
    }, h('span', { class: 'ic' }, EMOTE_ICON[e.id] ?? '?'), h('span', { class: 'lb' }, e.locked ? `레벨 ${e.level}` : e.label));
  });
  const el = h('div', { class: 'emote-ring', onclick: close },
    h('div', { class: 'emote-hub', style: `left:${cx}px;top:${cy}px` }, '표현'),
    h('div', { class: 'opts' }, btns));
  mount('emote', el);
  app.modalOpened();
  app.setBack('emote', () => { close(); return true; });
  // 0 은 열 번째 · E 는 닫기 (1~9 는 arcade.js)
  function onKey(ev) {
    if (ev.code === 'KeyE') { ev.preventDefault(); ev.stopImmediatePropagation(); close(); }
    else if (ev.code === 'Digit0' || ev.code === 'Numpad0') { const e = items[9]; if (e) { ev.preventDefault(); ev.stopImmediatePropagation(); pick(e); } }
  }
  window.addEventListener('keydown', onKey, true);
}
