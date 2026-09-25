// 마우스를 따라다니는 설명 상자 하나를 모든 창이 같이 쓴다.
// PC: 마우스를 올리면 따라다닌다 (show / hover 로 닫힘).
// 모바일: 한 번 탭하면 칸 위(모자라면 아래)에 고정된다 (pin). 다음 터치가 어디든 닫는다.
export class Tooltip {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.className = 'tooltip';
    this.el.hidden = true;
    this.pinned = false;
    root.appendChild(this.el);
    window.addEventListener('pointerdown', () => { if (this.pinned) this.hide(); }, true);
  }

  show(html, x, y) {
    this.el.innerHTML = html;
    this.el.hidden = false;
    this.pinned = false;
    this.el.classList.remove('pinned');
    this.move(x, y);
  }

  // 칸(anchor) 기준으로 고정해서 보인다 (터치용)
  pin(html, anchor) {
    this.el.innerHTML = html;
    this.el.hidden = false;
    this.pinned = true;
    this.el.classList.add('pinned');
    const a = anchor.getBoundingClientRect();
    const r = this.el.getBoundingClientRect();
    const left = Math.min(window.innerWidth - r.width - 8, Math.max(8, a.left + a.width / 2 - r.width / 2));
    let top = a.top - r.height - 8;
    if (top < 8) top = Math.min(window.innerHeight - r.height - 8, a.bottom + 8);
    this.el.style.transform = `translate(${left}px, ${Math.max(8, top)}px)`;
  }

  // 마우스가 벗어났을 때: 고정된 설명은 그대로 둔다
  hover(e) {
    if (e.pointerType !== 'touch' && !this.pinned) this.hide();
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
    this.pinned = false;
  }
}
