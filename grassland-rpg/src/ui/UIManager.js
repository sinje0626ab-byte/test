// 창 열기/닫기, 단축키, 겹침 순서. ESC는 가장 위의 창을 닫는다.
export class UIManager {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.layer = document.createElement('div');
    this.layer.className = 'ui-windows';
    root.appendChild(this.layer);
    this.windows = new Map();
    this.stack = [];
    // 배치 모드에 들어가면 창을 모두 닫아 땅이 보이게 한다.
    ctx.bus.on('build:start', () => {
      for (const w of [...this.stack]) this.close(w.id);
    });
  }

  // 제목줄 + 닫기 버튼이 있는 빈 창을 만들어 등록한다. 내용은 body에 채운다.
  createWindow({ id, title, key, hotkeyLabel }) {
    const el = document.createElement('section');
    el.className = `window win-${id}`;
    el.hidden = true;
    el.innerHTML = `
      <header class="win-head">
        <h2>${title}${hotkeyLabel ? ` <kbd>${hotkeyLabel}</kbd>` : ''}</h2>
        <button class="win-close" type="button" aria-label="닫기">✕</button>
      </header>
      <div class="win-body"></div>`;
    this.layer.appendChild(el);
    const win = { id, key, el, body: el.querySelector('.win-body'), onOpen: null, onClose: null, canOpen: null };
    el.addEventListener('pointerdown', () => this.focus(win));
    el.querySelector('.win-close').addEventListener('click', () => this.close(id));
    this.windows.set(id, win);
    return win;
  }

  isOpen(id) {
    return this.stack.some((w) => w.id === id);
  }

  open(id) {
    const win = this.windows.get(id);
    if (!win || this.isOpen(id)) return;
    if (win.canOpen && !win.canOpen()) return;
    win.el.hidden = false;
    this.stack.push(win);
    this.restack();
    win.onOpen?.();
  }

  close(id) {
    const win = this.windows.get(id);
    if (!win || !this.isOpen(id)) return;
    win.el.hidden = true;
    this.stack = this.stack.filter((w) => w !== win);
    this.restack();
    win.onClose?.();
  }

  toggle(id) {
    if (this.isOpen(id)) this.close(id);
    else this.open(id);
  }

  focus(win) {
    if (this.stack.at(-1) === win) return;
    this.stack = this.stack.filter((w) => w !== win).concat(win);
    this.restack();
  }

  restack() {
    this.stack.forEach((w, i) => { w.el.style.zIndex = String(10 + i); });
  }

  update() {
    const { input } = this.ctx;
    for (const win of this.windows.values()) {
      if (win.key && input.wasPressed(win.key)) this.toggle(win.id);
    }
    if (input.wasPressed('Escape') && this.stack.length && this.ctx.mode !== 'build') this.close(this.stack.at(-1).id);
  }
}
