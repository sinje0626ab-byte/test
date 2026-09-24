import { itemIcon } from './icons.js';
import { closeWhenFar } from './CraftWindow.js';
import { enhanceCost } from '../utils/enhance.js';

// 대장간 창 (대장간 앞에서 E): 낀 장비와 가방 장비 목록 → 골라서 강화
export class ForgeWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.facility = null;
    this.bag = [];
    this.equip = {};
    this.plus = {};
    this.gold = 0;

    const win = ui.createWindow({ id: 'forge', title: '대장간 — 장비 강화' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'forge', this.facility);
    this.body = win.body;
    this.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-forge]');
      if (!b || b.disabled) return;
      const [from, slot] = b.dataset.forge.split(':');
      const entry = this.entries().find((x) => x.from === from && String(x.slot) === slot);
      if (entry) ctx.bus.emit('forge:enhance', { from, slot: from === 'bag' ? Number(slot) : slot, id: entry.id, plus: entry.plus });
    });

    ctx.bus.on('interact:facility', ({ facility }) => {
      if (facility.type !== 'forge') return;
      this.facility = facility;
      ui.open('forge');
      this.render();
    });
    ctx.bus.on('inventory:changed', ({ slots }) => { this.bag = slots; this.refresh(); });
    ctx.bus.on('equipment:changed', ({ slots, plus }) => { this.equip = slots; this.plus = plus; this.refresh(); });
    ctx.bus.on('gold:changed', ({ gold }) => { this.gold = gold; this.refresh(); });
  }

  refresh() {
    if (this.facility) this.render();
  }

  // 강화할 수 있는 장비: 낀 것 먼저, 그다음 가방
  entries() {
    const items = this.ctx.data.items.items;
    const out = [];
    for (const [slot, id] of Object.entries(this.equip)) if (id) out.push({ from: 'equip', slot, id, plus: this.plus[slot] ?? 0 });
    this.bag.forEach((s, i) => { if (s && items[s.id].category === 'equipment') out.push({ from: 'bag', slot: i, id: s.id, plus: s.plus ?? 0 }); });
    return out;
  }

  render() {
    const { data } = this.ctx;
    const items = data.items;
    const ore = data.config.enhance.oreItem;
    const haveOre = this.bag.reduce((n, s) => n + (s?.id === ore ? s.count : 0), 0);
    const list = this.entries().map((e) => {
      const def = items.items[e.id];
      const cost = enhanceCost(data, e.plus);
      const ok = cost && this.gold >= cost.gold && haveOre >= cost.items[0].count;
      const price = cost ? `<i class="coin"></i>${cost.gold} · ${items.items[ore].name} ${haveOre}/${cost.items[0].count}` : '최고 단계';
      return `
        <button type="button" class="fg-row" data-forge="${e.from}:${e.slot}" ${ok ? '' : 'disabled'}>
          <span class="fg-icon" style="--grade:${items.grades[def.grade]?.color}">${itemIcon(def)}</span>
          <span class="fg-text"><span><b>${def.name}${e.plus ? ` +${e.plus}` : ''}</b>${cost ? ` → <b class="up">+${e.plus + 1}</b>` : ''}</span>
            <small>${e.from === 'equip' ? '착용 중' : '가방'} · ${price}</small></span>
        </button>`;
    });
    this.body.innerHTML = `
      <div class="fg">
        <p class="fg-note">단계마다 기본 능력치 +${Math.round(data.config.enhance.statPerPlus * 100)}%. 실패는 없어요.</p>
        ${list.length ? list.join('') : '<p class="empty">강화할 장비가 없어요.</p>'}
      </div>`;
  }
}
