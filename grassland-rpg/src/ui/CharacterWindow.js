import { itemIcon, slotHint } from './icons.js';
import { itemTooltip, formatStat } from './itemText.js';

const SHOWN = ['maxHp', 'maxStamina', 'attack', 'defense', 'moveSpeed', 'critChance', 'hpRegen'];

// 캐릭터 정보 창 (C): 장비 슬롯, 능력치, 레벨, 경험치 바
export class CharacterWindow {
  constructor(ctx, ui, tooltip) {
    this.ctx = ctx;
    this.tooltip = tooltip;
    this.equip = {};
    this.info = null;

    const win = ui.createWindow({ id: 'character', title: '캐릭터', key: 'KeyC', hotkeyLabel: 'C' });
    win.el.classList.add('win-left');
    win.onClose = () => tooltip.hide();
    const names = ctx.data.items.equipSlots;
    win.body.innerHTML = `
      <div class="char">
        <div class="equip-grid">
          ${Object.keys(names).map((k) => `<div class="eslot" data-eslot="${k}"><span>${names[k]}</span><div class="eicon"></div></div>`).join('')}
        </div>
        <div class="char-stats">
          <div class="char-level"><span class="lv-badge">Lv <b data-c-lv>1</b></span><span data-c-sp></span></div>
          <div class="bar xp"><div class="fill" data-c-xp></div></div>
          <div class="char-xp" data-c-xptext></div>
          <dl data-c-list></dl>
          <div class="sets" data-c-sets></div>
        </div>
      </div>
      <footer class="inv-foot"><span class="inv-hint">장비 칸 우클릭: 해제 · 가방에서 우클릭: 장착</span></footer>`;
    const $ = (q) => win.body.querySelector(q);
    this.setsEl = $('[data-c-sets]');
    this.el = { lv: $('[data-c-lv]'), sp: $('[data-c-sp]'), xp: $('[data-c-xp]'), xpText: $('[data-c-xptext]'), list: $('[data-c-list]') };
    this.grid = $('.equip-grid');
    this.win = win;

    this.grid.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const slot = e.target.closest('[data-eslot]')?.dataset.eslot;
      if (slot && this.equip[slot]) ctx.bus.emit('equipment:unequip', { slot });
    });
    // 모바일: 탭하면 설명, 두 번 탭하면 해제
    this.grid.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'touch') return;
      const slot = e.target.closest('[data-eslot]')?.dataset.eslot;
      const id = slot && this.equip[slot];
      if (!id) return;
      const now = performance.now();
      if (this.lastTap?.slot === slot && now - this.lastTap.time < ctx.data.config.touch.doubleTapMs) {
        this.lastTap = null;
        tooltip.hide();
        ctx.bus.emit('equipment:unequip', { slot });
        return;
      }
      this.lastTap = { slot, time: now };
      tooltip.show(itemTooltip(ctx.data, id, { hint: '두 번 탭: 해제' }), e.clientX, e.clientY);
    });
    this.grid.addEventListener('pointermove', (e) => {
      const slot = e.target.closest('[data-eslot]')?.dataset.eslot;
      const id = slot && this.equip[slot];
      if (id) tooltip.show(itemTooltip(ctx.data, id, { hint: '우클릭: 해제' }), e.clientX, e.clientY);
      else tooltip.hide();
    });
    this.grid.addEventListener('pointerleave', () => tooltip.hide());

    ctx.bus.on('equipment:changed', ({ slots, sets }) => {
      this.equip = { ...slots };
      this.renderEquip();
      // 세트 진행도 (하나라도 낀 세트만)
      const items = ctx.data.items;
      this.setsEl.innerHTML = (sets ?? []).filter((st) => st.have > 0).map((st) => `
        <div class="set${st.have === st.total ? ' done' : ''}"><b>${st.name} ${st.have}/${st.total}</b>
        <small>${Object.entries(st.bonus).map(([k, v]) => `${items.statLabels[k]} ${formatStat(items, k, v)}`).join(', ')}</small></div>`).join('');
    });
    ctx.bus.on('stats:changed', (info) => { this.info = info; this.renderStats(); });
  }

  renderEquip() {
    const items = this.ctx.data.items;
    for (const el of this.grid.children) {
      const slot = el.dataset.eslot;
      const id = this.equip[slot];
      const def = id && items.items[id];
      el.classList.toggle('filled', !!def);
      el.style.setProperty('--grade', def ? items.grades[def.grade]?.color : 'transparent');
      el.querySelector('.eicon').innerHTML = def ? itemIcon(def) : slotHint(slot);
    }
    this.tooltip.hide();
  }

  renderStats() {
    const { level, xp, xpToNext, skillPoints, stats } = this.info;
    const items = this.ctx.data.items;
    this.el.lv.textContent = level;
    this.el.sp.textContent = skillPoints ? `스킬 포인트 ${skillPoints} (K)` : '';
    const max = Number.isFinite(xpToNext);
    this.el.xp.style.width = max ? `${(xp / xpToNext) * 100}%` : '100%';
    this.el.xpText.textContent = max ? `경험치 ${xp} / ${xpToNext}` : '최고 레벨';
    this.el.list.innerHTML = SHOWN.map((k) => `<dt>${items.statLabels[k]}</dt><dd>${formatStat(items, k, stats[k], false)}</dd>`).join('');
  }
}
