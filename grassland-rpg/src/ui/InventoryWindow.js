// 인벤토리 창 (I): 격자 슬롯, 드래그로 이동, 우클릭 사용/장착, 툴팁
export class InventoryWindow {
  constructor(ctx, ui, tooltip) {
    this.ctx = ctx;
    this.tooltip = tooltip;
    this.slots = [];
    this.drag = null;

    const cfg = ctx.data.config.inventory;
    const win = ui.createWindow({ id: 'inventory', title: '가방', key: 'KeyI', hotkeyLabel: 'I' });
    this.win = win;
    win.body.innerHTML = `
      <div class="inv-grid" style="--cols:${cfg.columns}"></div>
      <footer class="inv-foot">
        <span class="gold"><i class="coin"></i><b data-inv-gold>0</b></span>
        <span class="inv-hint">드래그: 옮기기 · 우클릭: 사용</span>
      </footer>`;
    this.grid = win.body.querySelector('.inv-grid');
    this.goldEl = win.body.querySelector('[data-inv-gold]');
    for (let i = 0; i < cfg.slots; i++) {
      const el = document.createElement('div');
      el.className = 'slot';
      el.dataset.slot = String(i);
      this.grid.appendChild(el);
    }
    win.onClose = () => { this.tooltip.hide(); this.cancelDrag(); };

    this.bindEvents();
    ctx.bus.on('inventory:changed', ({ slots }) => this.render(slots));
    ctx.bus.on('gold:changed', ({ gold }) => { this.goldEl.textContent = gold.toLocaleString(); });
  }

  def(id) {
    return this.ctx.data.items.items[id];
  }

  render(slots) {
    this.slots = slots;
    const { grades } = this.ctx.data.items;
    slots.forEach((s, i) => {
      const el = this.grid.children[i];
      if (!el) return;
      if (!s) {
        el.className = 'slot';
        el.innerHTML = '';
        return;
      }
      const def = this.def(s.id);
      el.className = 'slot filled';
      el.style.setProperty('--grade', grades[def.grade]?.color ?? '#e8e8e8');
      el.innerHTML = `<i class="item-icon" style="--c:${def.color}"></i>${s.count > 1 ? `<b class="count">${s.count}</b>` : ''}`;
    });
  }

  tooltipHtml(s) {
    const { grades, categories } = this.ctx.data.items;
    const def = this.def(s.id);
    const grade = grades[def.grade];
    const usable = def.category === 'consumable' || def.category === 'equipment';
    return `
      <div class="tt-name" style="color:${grade?.color ?? '#fff'}">${def.name}</div>
      <div class="tt-meta">${grade ? `${grade.name} · ` : ''}${categories[def.category] ?? ''}</div>
      ${def.description ? `<p class="tt-desc">${def.description}</p>` : ''}
      <div class="tt-meta">수량 ${s.count}${def.stackable ? ` / ${def.maxStack ?? this.ctx.data.config.inventory.defaultMaxStack}` : ''}</div>
      ${usable ? `<div class="tt-hint">우클릭: ${def.category === 'equipment' ? '장착' : '사용'}</div>` : ''}`;
  }

  slotIndexAt(x, y) {
    const el = document.elementFromPoint(x, y)?.closest?.('[data-slot]');
    return el && this.grid.contains(el) ? Number(el.dataset.slot) : -1;
  }

  bindEvents() {
    const grid = this.grid;

    grid.addEventListener('pointermove', (e) => {
      if (this.drag) return;
      const i = this.slotIndexAt(e.clientX, e.clientY);
      const s = this.slots[i];
      if (s) this.tooltip.show(this.tooltipHtml(s), e.clientX, e.clientY);
      else this.tooltip.hide();
    });
    grid.addEventListener('pointerleave', () => this.tooltip.hide());

    grid.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const i = this.slotIndexAt(e.clientX, e.clientY);
      if (this.slots[i]) this.ctx.bus.emit('inventory:use', { slot: i });
    });

    grid.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const i = this.slotIndexAt(e.clientX, e.clientY);
      const s = this.slots[i];
      if (!s) return;
      e.preventDefault();
      const ghost = document.createElement('div');
      ghost.className = 'drag-ghost';
      ghost.innerHTML = grid.children[i].innerHTML;
      document.body.appendChild(ghost);
      grid.children[i].classList.add('dragging');
      this.drag = { from: i, ghost };
      this.tooltip.hide();
      this.moveGhost(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.drag) return;
      this.moveGhost(e.clientX, e.clientY);
      for (const el of grid.children) el.classList.remove('over');
      const i = this.slotIndexAt(e.clientX, e.clientY);
      if (i >= 0) grid.children[i].classList.add('over');
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.drag) return;
      const to = this.slotIndexAt(e.clientX, e.clientY);
      const { from } = this.drag;
      this.cancelDrag();
      if (to >= 0 && to !== from) this.ctx.bus.emit('inventory:move', { from, to });
    });
  }

  moveGhost(x, y) {
    this.drag.ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }

  cancelDrag() {
    if (!this.drag) return;
    this.drag.ghost.remove();
    for (const el of this.grid.children) el.classList.remove('dragging', 'over');
    this.drag = null;
  }
}
