// 모바일 터치 조작: 조이스틱(이동) · 공격 · E · 메뉴 버튼 · 건설 설치/취소.
// 전부 Input에 키보드·마우스와 같은 입력을 넣을 뿐, 게임 로직은 따로 없다.
import { PAINTED } from './painted.js';

const MENU = [
  ['KeyI', '가방'], ['KeyC', '캐릭터'], ['KeyK', '스킬'], ['KeyB', '건설'], ['KeyM', '지도'],
];

export class TouchControls {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.touch;
    const input = ctx.input;
    this.enabled = input.touchMode;
    if (!this.enabled) return;
    document.body.classList.add('touch');
    // 새로 그린 터치 버튼 그림(art/ui/btn_attack 등) → CSS 변수 --art-<id>. 다 있으면 body.painted-ui (theme-cozy.css)
    for (const [id, url] of Object.entries(PAINTED.ui)) document.body.style.setProperty(`--art-${id}`, `url("${url}")`);
    if (['btn_attack', 'btn_roll', 'btn_use', 'joy_base', 'joy_knob'].every((id) => PAINTED.ui[id])) document.body.classList.add('painted-ui');
    // 핀치·두 번 탭 확대 막기 (iOS 사파리는 viewport 설정만으로 안 막힌다)
    const block = (e) => e.preventDefault();
    document.addEventListener('gesturestart', block, { passive: false });
    document.addEventListener('dblclick', block, { passive: false });
    document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

    const el = document.createElement('div');
    el.className = 'touch-ui';
    el.innerHTML = `
      <div class="joy-zone" data-joyzone></div>
      <div class="joy" data-joy><div class="joy-knob" data-knob></div></div>
      <button type="button" class="t-btn t-attack" data-attack aria-label="공격"><span class="t-label">공격</span></button>
      <button type="button" class="t-btn t-use" data-use hidden aria-label="상호작용"><span class="t-label">E</span></button>
      <button type="button" class="t-btn t-roll" data-key="Space" aria-label="구르기"><span class="t-label">구르기</span></button>
      <nav class="t-menu">${MENU.map(([code, label]) => `<button type="button" data-key="${code}">${label}</button>`).join('')}</nav>
      <div class="t-build" data-build hidden>
        <button type="button" class="ok" data-key="BuildConfirm">설치</button>
        <button type="button" data-key="BuildCancel">취소</button>
      </div>`;
    root.appendChild(el);
    const $ = (q) => el.querySelector(q);
    this.el = { zone: $('[data-joyzone]'), joy: $('[data-joy]'), knob: $('[data-knob]'), attack: $('[data-attack]'), use: $('[data-use]'), build: $('[data-build]'), menu: $('.t-menu'), roll: $('.t-roll') };

    this.bindJoystick();

    const atk = this.el.attack;
    atk.addEventListener('pointerdown', (e) => { e.preventDefault(); atk.setPointerCapture(e.pointerId); input.virtualAttack = true; });
    const stop = () => { input.virtualAttack = false; };
    atk.addEventListener('pointerup', stop);
    atk.addEventListener('pointercancel', stop);
    atk.addEventListener('lostpointercapture', stop);

    this.el.use.addEventListener('pointerdown', (e) => { e.preventDefault(); input.press('KeyE'); });
    el.addEventListener('pointerdown', (e) => {
      const code = e.target.closest('[data-key]')?.dataset.key;
      if (!code) return;
      e.preventDefault();
      input.press(code);
    });

    ctx.bus.on('interact:hint', ({ text }) => {
      this.el.use.hidden = !text;
    });
  }

  // 조이스틱: 고리 안을 누르면 고리 가운데가 기준(바로 그 방향으로), 고리 밖 빈 곳(joy-zone)을 누르면
  // 고리가 손가락 자리로 옮겨 온다. 고리 밖으로 멀리 끌면 고리가 손가락을 따라와서 반대로 꺾으면 바로 돈다.
  bindJoystick() {
    const { joy, knob, zone } = this.el;
    const input = this.ctx.input;
    const R = this.cfg.joystickRadius;
    let id = null;
    let hx = 0; // 고리 원래 가운데
    let hy = 0;
    let cx = 0; // 지금 기준 가운데
    let cy = 0;
    const place = () => {
      joy.style.transform = cx === hx && cy === hy ? '' : `translate(${cx - hx}px, ${cy - hy}px)`;
    };
    const move = (e) => {
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) {
        // 고리가 손가락을 따라온다
        cx += (dx / d) * (d - R);
        cy += (dy / d) * (d - R);
        dx = (dx / d) * R;
        dy = (dy / d) * R;
        place();
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      // 화면 위 = 북쪽(-z) = W
      input.virtualMove.x = dx / R;
      input.virtualMove.z = dy / R;
    };
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      knob.style.transform = '';
      joy.style.transform = '';
      joy.classList.remove('active');
      input.virtualMove.x = 0;
      input.virtualMove.z = 0;
    };
    const down = (e) => {
      if (id !== null) return;
      e.preventDefault();
      id = e.pointerId;
      e.currentTarget.setPointerCapture(id);
      joy.style.transform = '';
      const r = joy.getBoundingClientRect();
      hx = r.left + r.width / 2;
      hy = r.top + r.height / 2;
      const inside = Math.hypot(e.clientX - hx, e.clientY - hy) <= r.width / 2 + 8;
      cx = inside ? hx : e.clientX;
      cy = inside ? hy : e.clientY;
      place();
      joy.classList.add('active');
      move(e);
    };
    for (const t of [joy, zone]) {
      t.addEventListener('pointerdown', down);
      t.addEventListener('pointermove', (e) => { if (e.pointerId === id) move(e); });
      t.addEventListener('pointerup', end);
      t.addEventListener('pointercancel', end);
      t.addEventListener('lostpointercapture', end);
    }
  }

  update() {
    if (!this.enabled) return;
    const build = this.ctx.mode === 'build';
    this.el.build.hidden = !build;
    this.el.attack.hidden = build;
    this.el.roll.hidden = build;
    if (build) this.el.use.hidden = true;
  }
}
