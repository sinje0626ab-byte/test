import { itemIcon } from './icons.js';
import { itemTooltip, compareLines } from './itemText.js';
import { pick } from '../utils/josa.js';

// 인벤토리 창 (I): 격자 슬롯, 드래그로 이동, 우클릭 사용/장착, 툴팁
// 버리기: 아이템을 '버리기' 칸에 끌어다 놓거나, 칸을 눌러 고른 뒤 '버리기' → 아래 확인 판에서 개수 선택
export class InventoryWindow {
  constructor(ctx, ui, tooltip) {
    this.ctx = ctx;
    this.tooltip = tooltip;
    this.slots = [];
    this.drag = null;
    this.selected = -1;

    const cfg = ctx.data.config.inventory;
    const win = ui.createWindow({ id: 'inventory', title: '가방', key: 'KeyI', hotkeyLabel: 'I' });
    this.win = win;
    win.body.innerHTML = `
      <div class="inv-grid" style="--cols:${cfg.columns}"></div>
      <footer class="inv-foot">
        <span class="gold"><i class="coin"></i><b data-inv-gold>0</b></span>
        <span class="inv-hint">${ctx.input.touchMode ? '탭: 정보 · 두 번 탭: 사용 · 끌기: 옮기기·퀵슬롯' : '올리기: 정보 · 우클릭: 사용 · 끌기: 옮기기·퀵슬롯에 놓기'}</span>
        <button type="button" class="inv-sort" data-sort>정리</button>
        <button type="button" class="inv-sort" data-quick-add title="고른 칸을 퀵슬롯에 등록 (끌어다 놓아도 된다)">퀵슬롯</button>
        <button type="button" class="inv-trash" data-trash>버리기</button>
      </footer>
      <div class="inv-confirm" hidden></div>`;
    win.body.querySelector('[data-sort]').addEventListener('click', () => ctx.bus.emit('inventory:sort'));
    this.trashEl = win.body.querySelector('[data-trash]');
    this.confirmEl = win.body.querySelector('.inv-confirm');
    win.body.querySelector('[data-quick-add]').addEventListener('click', () => {
      const s = this.slots[this.selected];
      if (s) ctx.bus.emit('quick:add', { item: s.id });
    });
    this.trashEl.addEventListener('click', () => {
      if (this.slots[this.selected]) this.askDiscard(this.selected);
      else ctx.bus.emit('notify', { text: '버릴 아이템을 먼저 누르거나, 버리기로 끌어다 놓으세요', kind: 'info' });
    });
    this.confirmEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-discard]');
      if (!b) return;
      const d = this.pendingDiscard;
      this.closeConfirm();
      if (b.dataset.discard !== 'cancel' && d && this.slots[d.slot]?.id === d.id) ctx.bus.emit('inventory:discard', { slot: d.slot, count: Number(b.dataset.discard) });
    });
    this.grid = win.body.querySelector('.inv-grid');
    this.goldEl = win.body.querySelector('[data-inv-gold]');
    for (let i = 0; i < cfg.slots; i++) {
      const el = document.createElement('div');
      el.className = 'slot';
      el.dataset.slot = String(i);
      this.grid.appendChild(el);
    }
    win.onClose = () => { this.tooltip.hide(); this.cancelDrag(); this.closeConfirm(); this.select(-1); };

    this.bindEvents();
    ctx.bus.on('inventory:changed', ({ slots }) => this.render(slots));
    this.worn = {};
    this.wornPlus = {};
    ctx.bus.on('equipment:changed', ({ slots, plus, opts }) => { this.worn = slots; this.wornPlus = plus; this.wornOpts = opts ?? {}; });
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
      el.className = `slot filled${i === this.selected ? ' sel' : ''}`;
      el.style.setProperty('--grade', grades[def.grade]?.color ?? '#e8e8e8');
      el.innerHTML = `${itemIcon(def)}${s.count > 1 ? `<b class="count">${s.count}</b>` : ''}${s.plus ? `<b class="plus-badge">+${s.plus}</b>` : ''}${s.opts?.length ? `<i class="opt-dots">${'◆'.repeat(s.opts.length)}</i>` : ''}${s.fresh ? '<i class="new-dot"></i>' : ''}`;
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
      compare = compareLines(this.ctx.data, def, s.plus ?? 0, cur && this.def(cur), this.wornPlus[slot] ?? 0, s.opts, this.wornOpts?.[slot]);
    }
    return itemTooltip(this.ctx.data, s.id, { count: s.count, hint, plus: s.plus ?? 0, opts: s.opts, compare });
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
      this.trashEl.classList.toggle('over', document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-trash]') === this.trashEl);
      const q = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-q]');
      for (const el of document.querySelectorAll('.qslot.over')) if (el !== q) el.classList.remove('over');
      q?.classList.add('over');
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.drag) return;
      if (document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-trash]') === this.trashEl) {
        const { from } = this.drag;
        this.cancelDrag();
        this.askDiscard(from);
        return;
      }
      // 퀵슬롯 칸에 놓으면 등록 (소모품·장비)
      const q = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-q]');
      if (q) {
        const { from } = this.drag;
        this.cancelDrag();
        this.ctx.bus.emit('quick:set', { index: Number(q.dataset.q), item: this.slots[from]?.id });
        return;
      }
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
    this.select(i);
    if (e.pointerType === 'touch') this.tooltip.pin(this.tooltipHtml(s), this.grid.children[i]);
    if (s.fresh) this.ctx.bus.emit('inventory:seen', { slot: i });
  }

  // 고른 칸 (버리기 버튼이 이 칸을 버린다)
  select(i) {
    this.grid.children[this.selected]?.classList.remove('sel');
    this.selected = i;
    this.grid.children[i]?.classList.add('sel');
  }

  askDiscard(slot) {
    const s = this.slots[slot];
    if (!s) return;
    this.select(slot);
    this.tooltip.hide();
    const def = this.def(s.id);
    const name = def.name + (s.plus ? ` +${s.plus}` : '');
    const precious = s.plus || ['rare', 'epic', 'legendary'].includes(def.grade);
    const opts = s.count > 1
      ? [[1, '1개'], ...(s.count >= 4 ? [[Math.floor(s.count / 2), `절반 (${Math.floor(s.count / 2)})`]] : []), [s.count, `모두 (${s.count})`]]
      : [[1, '버리기']];
    this.pendingDiscard = { slot, id: s.id };
    this.confirmEl.innerHTML = `
      <p>${itemIcon(def)}<span><b>${name}</b>${s.count > 1 ? ` ×${s.count}` : ''}${pick(s.count > 1 ? s.count : name, '을/를')} 버릴까요?<br><small>${precious ? '<em>귀한 아이템이에요!</em> ' : ''}버린 아이템은 되찾을 수 없어요</small></span></p>
      <div class="inv-actions"><button type="button" data-discard="cancel">취소</button>${opts.map(([n, label]) => `<button type="button" class="danger" data-discard="${n}">${label}</button>`).join('')}</div>`;
    this.confirmEl.hidden = false;
  }

  closeConfirm() {
    this.pendingDiscard = null;
    this.confirmEl.hidden = true;
  }

  moveGhost(x, y) {
    this.drag.ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }

  cancelDrag() {
    if (!this.drag) return;
    this.drag.ghost.remove();
    for (const el of this.grid.children) el.classList.remove('dragging', 'over');
    this.trashEl.classList.remove('over');
    for (const el of document.querySelectorAll('.qslot.over')) el.classList.remove('over');
    this.drag = null;
  }
}
