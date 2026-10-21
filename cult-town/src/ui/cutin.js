// 결정적 순간 컷인 (24장 D-5): 신도가 되는 순간 · 라이벌에게 뺏김 · 간부 승진 · 첫 열혈 신자 · 간판 교체
// 화면 옆에서 미끄러져 들어오는 카드. 여러 개면 차례로.
import { h, mount, unmount } from './dom.js';
import { play } from './sound.js';

const queue = [];
let showing = false;

// item: { kicker, title, line, face (이미지 주소) }
export function cutin(app, item) {
  queue.push(item);
  if (!showing) next(app);
}

function next(app) {
  const it = queue.shift();
  if (!it) { showing = false; return; }
  showing = true;
  play('jingle_good', 0.4);
  const close = () => { clearTimeout(timer); unmount('cutinbar'); setTimeout(() => next(app), 150); };
  const timer = setTimeout(close, 4200);
  mount('cutinbar', h('div', { class: 'cutinbar', onclick: close },
    it.face ? h('img', { src: it.face, alt: '' }) : null,
    h('div', {}, h('div', { class: 'kicker' }, it.kicker), h('b', {}, it.title), it.line ? h('div', { class: 'say' }, it.line) : null)));
}
