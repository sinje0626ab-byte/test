import { cornerArt } from './uiArt.js';
import { uiImg } from './painted.js';

// 창 열기/닫기, 단축키, 겹침 순서. ESC는 가장 위의 창을 닫는다.
// 모양(theme-cozy.css): 크림색 둥근 판, 새싹 알약 제목 (모서리 장식은 숨김). 닫을 때 0.15초 줄어들며 사라진다.
const CLOSE_MS = 150;
export class UIManager {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.layer = document.createElement('div');
    this.layer.className = 'ui-windows';
    root.appendChild(this.layer);
    this.windows = new Map();
    this.stack = [];
    // 배치 모드에 들어가면 창을 모두 닫아 땅이 보이게 한다.
    // 화면 크기가 바뀌면 옮겨 둔 창을 다시 화면 안으로
    window.addEventListener('resize', () => {
      for (const w of this.windows.values()) if (!w.el.hidden) this.clamp(w.el);
    });
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
        <h2>${uiImg(`win_${id}`, '', 'win-ic')}<span class="win-title">${title}</span>${hotkeyLabel ? ` <kbd>${hotkeyLabel}</kbd>` : ''}</h2>
        <button class="win-close" type="button" aria-label="닫기">${uiImg('ic_close', '✕')}</button>
      </header>
      <div class="win-body"></div>
      ${['tl', 'tr', 'bl', 'br'].map((c) => `<i class="win-corner ${c}">${cornerArt()}</i>`).join('')}`;
    this.layer.appendChild(el);
    const win = { id, key, el, body: el.querySelector('.win-body'), onOpen: null, onClose: null, canOpen: null, onUpdate: null };
    el.addEventListener('pointerdown', () => this.focus(win));
    el.querySelector('.win-close').addEventListener('click', () => this.close(id));
    this.bindDrag(win);
    this.windows.set(id, win);
    return win;
  }

  // PC: 제목줄을 잡고 끌면 창이 따라온다 (놓은 자리는 닫았다 열어도 그대로). 제목줄 두 번 누르면 원래 자리
  bindDrag(win) {
    const { el } = win;
    const head = el.querySelector('.win-head');
    head.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.pointerType === 'touch' || document.body.classList.contains('touch') || e.target.closest('button')) return;
      const layer = this.layer.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const ox = e.clientX - r.left;
      const oy = e.clientY - r.top;
      let moved = false;
      const move = (ev) => {
        if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 3) return;
        if (!moved) {
          moved = true;
          el.classList.add('moved', 'dragging');
          Object.assign(el.style, { right: 'auto', bottom: 'auto', transform: 'none' });
        }
        // 창 모서리가 화면 밖으로 나가지 않게 (창이 화면보다 크면 왼쪽·위에 붙인다)
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const x = Math.max(0, Math.min(ev.clientX - ox, layer.width - w));
        const y = Math.max(0, Math.min(ev.clientY - oy, layer.height - h));
        el.style.left = `${Math.round(x - layer.left)}px`;
        el.style.top = `${Math.round(y - layer.top)}px`;
      };
      const up = () => {
        el.classList.remove('dragging');
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
      e.preventDefault(); // 글자 고르기 막기
    });
    head.addEventListener('dblclick', (e) => {
      if (e.target.closest('button') || !el.classList.contains('moved')) return;
      el.classList.remove('moved');
      for (const k of ['left', 'top', 'right', 'bottom', 'transform']) el.style[k] = '';
    });
  }

  // 옮겨 둔 창이 화면 밖으로 나가 있으면 안으로 (열 때·화면 크기가 바뀔 때, 내용이 커졌을 수도 있다)
  clamp(el) {
    if (!el.classList.contains('moved')) return;
    el.style.left = `${Math.round(Math.max(0, Math.min(parseFloat(el.style.left) || 0, this.layer.clientWidth - el.offsetWidth)))}px`;
    el.style.top = `${Math.round(Math.max(0, Math.min(parseFloat(el.style.top) || 0, this.layer.clientHeight - el.offsetHeight)))}px`;
  }

  isOpen(id) {
    return this.stack.some((w) => w.id === id);
  }

  open(id) {
    const win = this.windows.get(id);
    if (!win || this.isOpen(id)) return;
    if (win.canOpen && !win.canOpen()) return;
    clearTimeout(win.closing);
    win.el.classList.remove('closing');
    win.el.hidden = false;
    this.stack.push(win);
    this.restack();
    win.onOpen?.();
    this.clamp(win.el);
    this.ctx.bus.emit('ui:open', { id });
  }

  close(id) {
    const win = this.windows.get(id);
    if (!win || !this.isOpen(id)) return;
    // 상태는 바로 닫고, 모양만 잠깐 줄어들며 사라진다
    win.el.classList.add('closing');
    win.closing = setTimeout(() => { win.el.hidden = true; win.el.classList.remove('closing'); }, CLOSE_MS);
    this.stack = this.stack.filter((w) => w !== win);
    this.restack();
    win.onClose?.();
    this.ctx.bus.emit('ui:close', { id });
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

  update(dt) {
    const { input } = this.ctx;
    for (const w of this.stack) w.onUpdate?.(dt);
    for (const win of this.windows.values()) {
      if (win.key && input.wasPressed(win.key)) this.toggle(win.id);
    }
    if (input.wasPressed('Escape') && this.ctx.mode !== 'build') {
      // 열린 창이 있으면 맨 위 창을 닫고, 없으면 게임 메뉴
      if (this.stack.length) this.close(this.stack.at(-1).id);
      else this.ctx.bus.emit('pause:open');
    }
  }
}
