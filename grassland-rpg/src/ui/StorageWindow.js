import { itemIcon } from './icons.js';
import { itemTooltip } from './itemText.js';
import { closeWhenFar } from './CraftWindow.js';

// 창고 창 (창고 앞에서 E): 왼쪽 가방, 오른쪽 이 기지 창고. 클릭하면 한 칸 통째로 옮긴다.
export class StorageWindow {
  constructor(ctx, ui, tooltip) {
    this.ctx = ctx;
    this.facility = null;
    this.bag = [];
    this.store = [];

    const win = ui.createWindow({ id: 'storage', title: '창고' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; tooltip.hide(); };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'storage', this.facility);
    win.body.innerHTML = `
      <div class="st-cols">
        <section><h3>가방</h3><div class="inv-grid st-grid" data-side="bag" style="--cols:6"></div></section>
        <section><h3 data-st-title>창고</h3><div class="inv-grid st-grid" data-side="store" style="--cols:6"></div></section>
      </div>
      <p class="inv-hint">클릭: 한 칸 통째로 옮기기 · 습격에 지면 창고 재료를 일부 잃어요 <button type="button" class="inv-sort" data-all>재료 모두 넣기</button></p>`;
    this.win = win;
    this.grids = { bag: win.body.querySelector('[data-side="bag"]'), store: win.body.querySelector('[data-side="store"]') };
    this.title = win.body.querySelector('[data-st-title]');
    win.body.querySelector('[data-all]').addEventListener('click', () => {
      if (this.facility) ctx.bus.emit('storage:deposit-materials', { baseId: this.facility.baseId, slots: [...this.bag] });
    });

    for (const [side, grid] of Object.entries(this.grids)) {
      grid.addEventListener('click', (e) => {
        const i = Number(e.target.closest('[data-slot]')?.dataset.slot);
        if (Number.isNaN(i) || !this.facility) return;
        const list = side === 'bag' ? this.bag : this.store;
        if (!list[i]) return;
        tooltip.hide();
        ctx.bus.emit(side === 'bag' ? 'storage:deposit' : 'storage:withdraw', { baseId: this.facility.baseId, slot: i });
      });
      grid.addEventListener('pointermove', (e) => {
        const i = Number(e.target.closest('[data-slot]')?.dataset.slot);
        const s = (side === 'bag' ? this.bag : this.store)[i];
        if (s) tooltip.show(itemTooltip(ctx.data, s.id, { count: s.count, plus: s.plus ?? 0, hint: side === 'bag' ? '클릭: 창고에 넣기' : '클릭: 가방으로' }), e.clientX, e.clientY);
        else tooltip.hide();
      });
      grid.addEventListener('pointerleave', () => tooltip.hide());
    }

    ctx.bus.on('interact:facility', ({ facility }) => {
      if (facility.type !== 'storage') return;
      this.facility = facility;
      const base = ctx.bases.find((b) => b.id === facility.baseId);
      this.title.textContent = `${base.label} 창고`;
      ui.open('storage');
      ctx.bus.emit('storage:request', { baseId: facility.baseId });
      this.draw('bag', this.bag);
    });
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.bag = slots;
      if (this.facility) this.draw('bag', slots);
    });
    ctx.bus.on('storage:changed', ({ baseId, slots }) => {
      if (this.facility?.baseId !== baseId) return;
      this.store = slots;
      this.draw('store', slots);
    });
  }

  draw(side, slots) {
    const { items } = this.ctx.data;
    this.grids[side].innerHTML = slots.map((s, i) => {
      if (!s) return `<div class="slot" data-slot="${i}"></div>`;
      const def = items.items[s.id];
      return `<div class="slot filled" data-slot="${i}" style="--grade:${items.grades[def.grade]?.color ?? '#e8e8e8'}">${itemIcon(def)}${s.count > 1 ? `<b class="count">${s.count}</b>` : ''}${s.plus ? `<b class="plus-badge">+${s.plus}</b>` : ''}</div>`;
    }).join('');
  }
}
