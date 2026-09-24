// 마우스를 따라다니는 설명 상자 하나를 모든 창이 같이 쓴다.
export class Tooltip {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.className = 'tooltip';
    this.el.hidden = true;
    root.appendChild(this.el);
  }

  show(html, x, y) {
    this.el.innerHTML = html;
    this.el.hidden = false;
    this.move(x, y);
  }

  move(x, y) {
    if (this.el.hidden) return;
    const pad = 14;
    const r = this.el.getBoundingClientRect();
    let left = x + pad;
    let top = y + pad;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - pad;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - pad;
    this.el.style.transform = `translate(${Math.max(8, left)}px, ${Math.max(8, top)}px)`;
  }

  hide() {
    this.el.hidden = true;
  }
}
