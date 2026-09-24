import { itemIcon } from './icons.js';

// 하늘 택배 창: 지금 기지 창고의 한 칸을 골라 다른 기지 창고로 (골드, 다음 아침 도착)
export class CourierWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.from = null;
    this.slots = [];
    this.pick = null;
    const win = ui.createWindow({ id: 'courier', title: '하늘 택배' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.from = null; this.pick = null; };
    this.body = win.body;
    this.body.addEventListener('click', (e) => {
      const s = e.target.closest('[data-cslot]');
      if (s) { this.pick = Number(s.dataset.cslot); this.render(); return; }
      const to = e.target.closest('[data-to]');
      if (to && this.pick != null) {
        ctx.bus.emit('courier:send', { fromBaseId: this.from.id, slot: this.pick, toBaseId: Number(to.dataset.to) });
        this.pick = null;
      }
    });
    ctx.bus.on('courier:open', ({ npc }) => this.open(npc));
    ctx.bus.on('storage:changed', ({ baseId, slots }) => {
      if (this.from?.id !== baseId) return;
      this.slots = slots;
      this.render();
    });
  }

  // 플레이어가 서 있는 기지(없으면 가장 가까운 기지)의 창고
  open() {
    const { bases, player, structures } = this.ctx;
    const withStorage = bases.filter((b) => structures.some((s) => s.kind === 'facility' && s.type === 'storage' && s.baseId === b.id));
    if (withStorage.length < 2) {
      this.ctx.bus.emit('notify', { text: '창고가 있는 기지가 두 곳 이상 있어야 보낼 수 있어!', kind: 'warn' });
      return;
    }
    this.from = withStorage.slice().sort((a, b) => a.position.distanceTo(player.position) - b.position.distanceTo(player.position))[0];
    this.targets = withStorage.filter((b) => b !== this.from);
    this.ui.open('courier');
    this.ctx.bus.emit('storage:request', { baseId: this.from.id });
  }

  render() {
    if (!this.from) return;
    const items = this.ctx.data.items;
    const cost = this.ctx.data.npcs.config.courier.costPerSlot;
    this.body.innerHTML = `
      <div class="cr">
        <p class="gd-note"><b>${this.from.label}</b> 창고에서 보낼 칸을 고르세요. 한 칸에 <i class="coin"></i>${cost}, 다음 아침 도착!</p>
        <div class="inv-grid" style="--cols:6">${this.slots.map((s, i) => {
          if (!s) return '<div class="slot"></div>';
          const def = items.items[s.id];
          return `<div class="slot filled${this.pick === i ? ' picked' : ''}" data-cslot="${i}" style="--grade:${items.grades[def.grade]?.color}">${itemIcon(def)}${s.count > 1 ? `<b class="count">${s.count}</b>` : ''}</div>`;
        }).join('')}</div>
        <div class="cr-to">${this.targets.map((b) => `<button type="button" data-to="${b.id}" ${this.pick == null ? 'disabled' : ''}>→ ${b.label}</button>`).join('')}</div>
      </div>`;
  }
}
