// 잠깐 떴다 사라지는 알림
import { h, $ui } from './dom.js';

let box = null;
export function toast(text, kind = '', ms = 3600) {
  if (!box || !box.isConnected) { box = h('div', { class: 'toasts' }); $ui().append(box); }
  const t = h('div', { class: `toast ${kind}` }, text);
  box.append(t);
  while (box.children.length > 4) box.firstChild.remove();
  setTimeout(() => t.remove(), ms);
}
