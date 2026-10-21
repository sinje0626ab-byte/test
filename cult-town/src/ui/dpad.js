// 모바일 방향키 패드 (터치 기기에서만). 누르는 동안 app.dpad.{up,down,left,right} = true
import { h, $ui } from './dom.js';

export function createDpad(app) {
  const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (!touch) return;
  const btn = (dir, label) => {
    const b = h('button', { class: `dpad-btn dpad-${dir}`, 'aria-label': dir }, label);
    const on = (e) => { e.preventDefault(); app.dpad[dir] = true; b.classList.add('on'); };
    const off = (e) => { e.preventDefault(); app.dpad[dir] = false; b.classList.remove('on'); };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointercancel', off);
    b.addEventListener('pointerleave', off);
    return b;
  };
  const pad = h('div', { class: 'dpad hidden' }, btn('up', '▲'), btn('left', '◀'), btn('right', '▶'), btn('down', '▼'));
  $ui().append(pad);
}
