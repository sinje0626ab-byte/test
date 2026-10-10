import { itemIcon } from './icons.js';
import { closeWhenFar } from './CraftWindow.js';
import { enhanceCost } from '../utils/enhance.js';
import { rerollCost } from '../utils/affix.js';
import { optLines } from './itemText.js';
import { uiImg } from './painted.js';

// 대장간 창 (대장간 앞에서 E): 낀 장비와 가방 장비 목록 → 골라서 강화 / 재련(랜덤 옵션 다시 굴리기)
export class ForgeWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.facility = null;
    this.bag = [];
    this.equip = {};
    this.plus = {};
    this.opts = {};
    this.gold = 0;
    this.mode = 'enhance';

    const win = ui.createWindow({ id: 'forge', title: '대장간 — 강화·재련' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'forge', this.facility);
    this.body = win.body;
    this.body.addEventListener('click', (e) => {
      const m = e.target.closest('[data-fmode]');
      if (m) { this.mode = m.dataset.fmode; this.render(); return; }
      const b = e.target.closest('[data-forge]');
      if (!b || b.disabled) return;
      const [from, slot] = b.dataset.forge.split(':');
      const entry = this.entries().find((x) => x.from === from && String(x.slot) === slot);
      if (entry) ctx.bus.emit(this.mode === 'reroll' ? 'forge:reroll' : 'forge:enhance', { from, slot: from === 'bag' ? Number(slot) : slot, id: entry.id, plus: entry.plus, opts: entry.opts });
    });

    ctx.bus.on('interact:facility', ({ facility }) => {
      if (facility.type !== 'forge') return;
      this.facility = facility;
      ui.open('forge');
      this.render();
    });
    ctx.bus.on('inventory:changed', ({ slots }) => { this.bag = slots; this.refresh(); });
    ctx.bus.on('equipment:changed', ({ slots, plus, opts }) => { this.equip = slots; this.plus = plus; this.opts = opts ?? {}; this.refresh(); });
    ctx.bus.on('gold:changed', ({ gold }) => { this.gold = gold; this.refresh(); });
  }

  refresh() {
    if (this.facility) this.render();
  }

  // 강화할 수 있는 장비: 낀 것 먼저, 그다음 가방
  entries() {
    const items = this.ctx.data.items.items;
    const out = [];
    for (const [slot, id] of Object.entries(this.equip)) if (id) out.push({ from: 'equip', slot, id, plus: this.plus[slot] ?? 0, opts: this.opts[slot] ?? [] });
    this.bag.forEach((s, i) => { if (s && items[s.id].category === 'equipment') out.push({ from: 'bag', slot: i, id: s.id, plus: s.plus ?? 0, opts: s.opts ?? [] }); });
    return out;
  }

  render() {
    const { data } = this.ctx;
    const items = data.items;
    const have = (id) => this.bag.reduce((n, s) => n + (s?.id === id ? s.count : 0), 0);
    const reroll = this.mode === 'reroll';
    const list = this.entries().map((e) => {
      const def = items.items[e.id];
      const cost = reroll ? rerollCost(data, e.id) : enhanceCost(data, e.plus);
      const need = cost?.items[0];
      const ok = cost && this.gold >= cost.gold && have(need.id) >= need.count;
      const price = cost ? `<i class="coin"></i>${cost.gold} · ${items.items[need.id].name} ${have(need.id)}/${need.count}` : '최고 단계';
      const title = reroll
        ? `<b>${def.name}${e.plus ? ` +${e.plus}` : ''}</b> <small>옵션 ${e.opts.length || 1}줄 다시</small>`
        : `<b>${def.name}${e.plus ? ` +${e.plus}` : ''}</b>${cost ? ` → <b class="up">+${e.plus + 1}</b>` : ''}`;
      return `
        <button type="button" class="fg-row" data-forge="${e.from}:${e.slot}" ${ok ? '' : 'disabled'}>
          <span class="fg-icon" style="--grade:${items.grades[def.grade]?.color}">${itemIcon(def)}</span>
          <span class="fg-text"><span>${title}</span>
            ${reroll ? `<span class="fg-opts">${optLines(data, e.opts) || '<div class="tt-opt none">옵션 없음 → 한 줄 생김</div>'}</span>` : ''}
            <small>${e.from === 'equip' ? '착용 중' : '가방'} · ${price}</small></span>
        </button>`;
    });
    this.body.innerHTML = `
      <div class="fg">
        <div class="seg fg-mode"><button type="button" data-fmode="enhance" class="${reroll ? '' : 'on'}">${uiImg('ic_enhance')}강화</button><button type="button" data-fmode="reroll" class="${reroll ? 'on' : ''}">${uiImg('ic_reroll')}재련</button></div>
        <p class="fg-note">${reroll ? `랜덤 옵션(${uiImg('opt_gem', '◆', 'opt')})을 다시 굴려요. 줄 수는 그대로, 능력치와 값이 바뀌어요. ${uiImg('opt_star', '★', 'opt')} 은 아주 좋은 값.` : `단계마다 기본 능력치 +${Math.round(data.config.enhance.statPerPlus * 100)}%. 실패는 없어요.`}</p>
        ${list.length ? list.join('') : '<p class="empty">장비가 없어요.</p>'}
      </div>`;
  }
}
