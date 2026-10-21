// 모바일 방향키 패드 (터치 기기에서만). 누르는 동안 app.dpad.{up,down,left,right} = true
import { h, $ui } from './dom.js';

export function createDpad(app) {
  const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (!touch) return;
  const btn = (dir, label) => {
    const b = h('button', { class: `dpad-btn dpad-${dir}`, 'aria-label': dir }, label);
    let timer = null;
    const on = (e) => { e.preventDefault(); app.dpad[dir] = true; b.classList.add('on'); clearTimeout(timer); timer = setTimeout(() => { app.dpadRun = true; b.classList.add('run'); }, 550); };
    const off = (e) => { e.preventDefault(); app.dpad[dir] = false; b.classList.remove('on', 'run'); clearTimeout(timer); app.dpadRun = Object.values(app.dpad).some(Boolean) && app.dpadRun; };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointercancel', off);
    b.addEventListener('pointerleave', off);
    return b;
  };
  const pad = h('div', { class: 'dpad hidden' }, btn('up', '▲'), btn('left', '◀'), btn('right', '▶'), btn('down', '▼'));
  $ui().append(pad);
}
