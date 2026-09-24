// 모바일 터치 조작: 조이스틱(이동) · 공격 · E · 메뉴 버튼 · 건설 설치/취소.
// 전부 Input에 키보드·마우스와 같은 입력을 넣을 뿐, 게임 로직은 따로 없다.
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
    // 핀치·두 번 탭 확대 막기 (iOS 사파리는 viewport 설정만으로 안 막힌다)
    const block = (e) => e.preventDefault();
    document.addEventListener('gesturestart', block, { passive: false });
    document.addEventListener('dblclick', block, { passive: false });
    document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

    const el = document.createElement('div');
    el.className = 'touch-ui';
    el.innerHTML = `
      <div class="joy" data-joy><div class="joy-knob" data-knob></div></div>
      <button type="button" class="t-btn t-attack" data-attack>공격</button>
      <button type="button" class="t-btn t-use" data-use hidden>E</button>
      <nav class="t-menu">${MENU.map(([code, label]) => `<button type="button" data-key="${code}">${label}</button>`).join('')}</nav>
      <div class="t-build" data-build hidden>
        <button type="button" class="ok" data-key="BuildConfirm">설치</button>
        <button type="button" data-key="BuildCancel">취소</button>
      </div>`;
    root.appendChild(el);
    const $ = (q) => el.querySelector(q);
    this.el = { joy: $('[data-joy]'), knob: $('[data-knob]'), attack: $('[data-attack]'), use: $('[data-use]'), build: $('[data-build]'), menu: $('.t-menu') };

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

  bindJoystick() {
    const { joy, knob } = this.el;
    const input = this.ctx.input;
    const R = this.cfg.joystickRadius;
    let id = null;
    let cx = 0;
    let cy = 0;
    const move = (e) => {
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) { dx = (dx / d) * R; dy = (dy / d) * R; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      // 화면 위 = 북쪽(-z) = W
      input.virtualMove.x = dx / R;
      input.virtualMove.z = dy / R;
    };
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      knob.style.transform = '';
      input.virtualMove.x = 0;
      input.virtualMove.z = 0;
    };
    joy.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      id = e.pointerId;
      joy.setPointerCapture(id);
      const r = joy.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      move(e);
    });
    joy.addEventListener('pointermove', (e) => { if (e.pointerId === id) move(e); });
    joy.addEventListener('pointerup', end);
    joy.addEventListener('pointercancel', end);
  }

  update() {
    if (!this.enabled) return;
    const build = this.ctx.mode === 'build';
    this.el.build.hidden = !build;
    this.el.attack.hidden = build;
    if (build) this.el.use.hidden = true;
  }
}
