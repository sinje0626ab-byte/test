// 키보드·마우스 상태. 마우스 클릭은 캔버스에서만 받는다 (UI 창이 우선).
export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.pressed = new Set();
    this.mouseNdc = { x: 0, y: 0 };
    this.mouseDown = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.hasMouse = false;

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

    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouseNdc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.mouseNdc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      this.hasMouse = true;
    });
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button === 2) this.rightPressed = true;
      if (e.button !== 0) return;
      this.mouseDown = true;
      this.leftPressed = true;
      canvas.setPointerCapture?.(e.pointerId);
    });
    window.addEventListener('pointerup', (e) => {
      if (e.button === 0) this.mouseDown = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isDown(code) {
    return this.keys.has(code);
  }

  wasPressed(code) {
    return this.pressed.has(code);
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
