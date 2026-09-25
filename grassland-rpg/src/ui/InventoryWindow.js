import { itemIcon } from './icons.js';
import { itemTooltip, compareLines } from './itemText.js';

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
        <span class="inv-hint">${ctx.input.touchMode ? '탭: 정보 · 두 번 탭: 사용 · 끌기: 옮기기' : '올리기: 정보 · 우클릭: 사용 · 드래그: 옮기기'}</span>
        <button type="button" class="inv-sort" data-sort>정리</button>
      </footer>`;
    win.body.querySelector('[data-sort]').addEventListener('click', () => ctx.bus.emit('inventory:sort'));
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
    this.worn = {};
    this.wornPlus = {};
    ctx.bus.on('equipment:changed', ({ slots, plus }) => { this.worn = slots; this.wornPlus = plus; });
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
      el.innerHTML = `${itemIcon(def)}${s.count > 1 ? `<b class="count">${s.count}</b>` : ''}${s.plus ? `<b class="plus-badge">+${s.plus}</b>` : ''}${s.fresh ? '<i class="new-dot"></i>' : ''}`;
    });
  }

  tooltipHtml(s) {
    const def = this.def(s.id);
    const how = this.ctx.input.touchMode ? '두 번 탭' : '우클릭';
    const verb = { equipment: '장착', consumable: '사용', kit: '설치' }[def.category];
    const hint = verb && `${how}: ${verb}`;
    // 장비는 지금 그 자리에 낀 것과 비교 (장신구는 첫째 칸)
    let compare;
    if (def.category === 'equipment') {
      const slot = def.equipSlot === 'accessory' ? 'accessory1' : def.equipSlot;
      const cur = this.worn[slot];
      compare = compareLines(this.ctx.data, def, s.plus ?? 0, cur && this.def(cur), this.wornPlus[slot] ?? 0);
    }
    return itemTooltip(this.ctx.data, s.id, { count: s.count, hint, plus: s.plus ?? 0, compare });
  }

  slotIndexAt(x, y) {
    const el = document.elementFromPoint(x, y)?.closest?.('[data-slot]');
    return el && this.grid.contains(el) ? Number(el.dataset.slot) : -1;
  }

  bindEvents() {
    const grid = this.grid;

    grid.addEventListener('pointermove', (e) => {
      if (this.drag || e.pointerType === 'touch') return;
      const i = this.slotIndexAt(e.clientX, e.clientY);
      const s = this.slots[i];
      if (s) this.tooltip.show(this.tooltipHtml(s), e.clientX, e.clientY);
      else this.tooltip.hide();
      if (s?.fresh) this.ctx.bus.emit('inventory:seen', { slot: i });
    });
    grid.addEventListener('pointerleave', (e) => this.tooltip.hover(e));

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
      else if (to === from) this.onTap(from, e);
    });
  }

  // 제자리 탭: 설명 보이기, 빠르게 두 번 탭하면 우클릭과 같은 동작 (모바일용)
  onTap(i, e) {
    const s = this.slots[i];
    if (!s) return;
    const now = performance.now();
    if (this.lastTap?.slot === i && now - this.lastTap.time < this.ctx.data.config.touch.doubleTapMs) {
      this.lastTap = null;
      this.tooltip.hide();
      this.ctx.bus.emit('inventory:use', { slot: i });
      return;
    }
    this.lastTap = { slot: i, time: now };
    if (e.pointerType === 'touch') this.tooltip.pin(this.tooltipHtml(s), this.grid.children[i]);
    if (s.fresh) this.ctx.bus.emit('inventory:seen', { slot: i });
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
