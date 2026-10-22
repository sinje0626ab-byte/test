// 모바일 이동 스틱 (터치 기기에서만). 손가락으로 끄는 동안 app.dpad = { x, y } (-1~1, 아날로그)
// 끝까지 밀면(세기 0.9 이상) 달리기. 손을 떼면 스틱이 가운데로 돌아온다.
import { h, $ui } from './dom.js';

const DEAD = 0.18;   // 이보다 덜 밀면 안 움직인다
const RUN = 0.9;     // 이 이상 밀면 달린다

export function createDpad(app) {
  const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (!touch) return;
  const knob = h('div', { class: 'stick-knob' });
  const base = h('div', { class: 'stick-base' }, knob);
  const pad = h('div', { class: 'dpad stick hidden', 'aria-label': '이동 스틱' }, base);
  $ui().append(pad);

  let pid = null;
  const set = (x, y) => {
    const r = base.clientWidth / 2;
    let dx = x / r; let dy = y / r;
    const m = Math.hypot(dx, dy);
    if (m > 1) { dx /= m; dy /= m; }
    knob.style.transform = `translate(${dx * r * 0.6}px, ${dy * r * 0.6}px)`;
    const mag = Math.min(1, m);
    app.dpad = mag < DEAD ? {} : { x: dx, y: dy };
    app.dpadRun = mag >= RUN;
    pad.classList.toggle('run', app.dpadRun);
  };
  const center = () => { const b = base.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; };
  const move = (e) => { if (e.pointerId !== pid) return; e.preventDefault(); const [cx, cy] = center(); set(e.clientX - cx, e.clientY - cy); };
  const end = (e) => {
    if (e.pointerId !== pid) return;
    pid = null; app.dpad = {}; app.dpadRun = false;
    knob.style.transform = ''; pad.classList.remove('on', 'run');
  };
  pad.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pid = e.pointerId;
    pad.setPointerCapture?.(e.pointerId);
    pad.classList.add('on');
    move(e);
  });
  pad.addEventListener('pointermove', move);
  pad.addEventListener('pointerup', end);
  pad.addEventListener('pointercancel', end);
}
