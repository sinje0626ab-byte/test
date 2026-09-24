// 키보드·마우스·터치 상태. 마우스 클릭은 캔버스에서만 받는다 (UI 창이 우선).
// 터치 조작(TouchControls)은 virtualMove·virtualAttack·press()로 같은 입력을 만든다.
export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.pressed = new Set();
    this.mouseNdc = { x: 0, y: 0 };
    this.mouseDown = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.hasMouse = false;
    this.virtualMove = { x: 0, z: 0 };
    this.virtualAttack = false;
    this.touchMode = window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      this.pressed.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouseDown = false;
    });

    const aimAt = (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouseNdc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.mouseNdc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      this.hasMouse = true;
    };
    canvas.addEventListener('pointermove', aimAt);
    canvas.addEventListener('pointerdown', (e) => {
      aimAt(e); // 터치는 움직임 없이 바로 누르므로 누른 자리를 먼저 잡는다
      if (e.button === 2) this.rightPressed = true;
      if (e.button !== 0) return;
      this.mouseDown = true;
      this.leftPressed = true;
      canvas.setPointerCapture?.(e.pointerId);
    });
    const release = (e) => { if (e.button === 0 || e.pointerType === 'touch') this.mouseDown = false; };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isDown(code) {
    return this.keys.has(code);
  }

  wasPressed(code) {
    return this.pressed.has(code);
  }

  // 화면 버튼이 키를 한 번 누른 것처럼
  press(code) {
    this.pressed.add(code);
  }

  // 키보드 WASD + 조이스틱. { x, z, amount(0~1), stick(조이스틱에서 왔는지) }
  moveVector() {
    let x = (this.isDown('KeyD') ? 1 : 0) - (this.isDown('KeyA') ? 1 : 0);
    let z = (this.isDown('KeyS') ? 1 : 0) - (this.isDown('KeyW') ? 1 : 0);
    let amount = x || z ? 1 : 0;
    let stick = false;
    const v = this.virtualMove;
    const vl = Math.hypot(v.x, v.z);
    if (!amount && vl > 0.15) {
      x = v.x;
      z = v.z;
      amount = Math.min(1, vl);
      stick = true;
    }
    return { x, z, amount, stick };
  }

  get attackHeld() {
    return this.mouseDown || this.virtualAttack;
  }

  // 클릭 한 번이 두 가지 일(설치 + 공격)을 하지 않도록 눌림 상태를 비운다.
  consumeMouse() {
    this.mouseDown = false;
    this.leftPressed = false;
    this.rightPressed = false;
  }

  endFrame() {
    this.pressed.clear();
    this.leftPressed = false;
    this.rightPressed = false;
  }
}
