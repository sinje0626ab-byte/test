import { itemIcon } from './icons.js';
import { itemTooltip } from './itemText.js';

// 제작 창 (작업대 앞에서 E)
export class CraftWindow {
  constructor(ctx, ui, tooltip) {
    this.ctx = ctx;
    this.ui = ui;
    this.counts = {};
    this.facility = null;

    const win = ui.createWindow({ id: 'craft', title: '작업대 — 제작' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; tooltip.hide(); };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'craft', this.facility);
    win.body.innerHTML = '<div class="craft-list"></div>';
    this.list = win.body.querySelector('.craft-list');

    this.list.addEventListener('click', (e) => {
      const id = e.target.closest('[data-craft]')?.dataset.craft;
      if (id) ctx.bus.emit('craft:make', { recipe: id, baseLevel: this.baseLevel() });
    });
    this.list.addEventListener('pointermove', (e) => {
      const id = e.target.closest('[data-result]')?.dataset.result;
      if (id) tooltip.show(itemTooltip(ctx.data, id), e.clientX, e.clientY);
      else tooltip.hide();
    });
    this.list.addEventListener('pointerleave', () => tooltip.hide());

    ctx.bus.on('interact:facility', ({ facility }) => {
      if (facility.type !== 'workbench') return;
      this.facility = facility;
      ui.open('craft');
      this.render();
    });
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
      if (this.facility) this.render();
    });
  }

  baseLevel() {
    return this.ctx.bases.find((b) => b.id === this.facility?.baseId)?.level ?? 0;
  }

  render() {
    const { items, recipes, buildings } = this.ctx.data;
    const lv = this.baseLevel();
    this.list.innerHTML = Object.entries(recipes).map(([id, r]) => {
      const def = items.items[r.result];
      const locked = lv < r.baseLevel;
      const enough = r.ingredients.every((c) => (this.counts[c.id] ?? 0) >= c.count);
      const ing = r.ingredients.map((c) => {
        const have = this.counts[c.id] ?? 0;
        return `<span class="${have >= c.count ? 'ok' : 'bad'}">${items.items[c.id].name} ${have}/${c.count}</span>`;
      }).join('');
      const why = locked ? `${buildings.baseLevels[String(r.baseLevel)].name} 필요` : enough ? '만들기' : '재료 부족';
      return `
        <div class="craft-row${locked ? ' locked' : ''}">
          <span class="craft-icon" data-result="${r.result}" style="--grade:${items.grades[def.grade]?.color}">${itemIcon(def)}</span>
          <span class="craft-text"><b>${def.name}${r.count > 1 ? ` ×${r.count}` : ''}</b><small class="craft-ing">${ing}</small></span>
          <button type="button" data-craft="${id}" ${locked || !enough ? 'disabled' : ''}>${why}</button>
        </div>`;
    }).join('');
  }
}

// 건물에서 멀어지면 창을 닫는다.
export function closeWhenFar(ctx, ui, id, s) {
  if (s && ctx.player.position.distanceTo(s.position) > ctx.data.config.interact.range + s.radius + 3) ui.close(id);
}
