import { itemIcon } from './icons.js';
import { itemTooltip } from './itemText.js';
import { closeWhenFar } from './CraftWindow.js';
import { shopPrice } from '../utils/shop.js';

// 상점 창 (상점 앞에서 E): 구매 / 판매 탭
export class ShopWindow {
  constructor(ctx, ui, tooltip) {
    this.ctx = ctx;
    this.facility = null;
    this.tab = 'buy';
    this.gold = 0;
    this.bag = [];
    this.special = null;

    const win = ui.createWindow({ id: 'shop', title: '상점' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; tooltip.hide(); };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'shop', this.facility);
    win.body.innerHTML = `
      <nav class="tabs"><button type="button" data-tab="buy">구매</button><button type="button" data-tab="sell">판매</button></nav>
      <div class="shop-list"></div>
      <footer class="inv-foot"><span class="gold"><i class="coin"></i><b data-shop-gold>0</b></span><span class="inv-hint">재료는 제작·건설에도 쓰여요</span></footer>`;
    this.list = win.body.querySelector('.shop-list');
    this.goldEl = win.body.querySelector('[data-shop-gold]');
    this.win = win;

    win.body.querySelector('.tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]')?.dataset.tab;
      if (tab) { this.tab = tab; this.render(); }
    });
    this.list.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      if (b.dataset.buy) ctx.bus.emit('shop:buy', { id: b.dataset.buy });
      if (b.dataset.sell) ctx.bus.emit('shop:sell', { slot: Number(b.dataset.sell), count: Number(b.dataset.count) });
    });
    this.list.addEventListener('pointermove', (e) => {
      const id = e.target.closest('[data-item]')?.dataset.item;
      if (id) tooltip.show(itemTooltip(ctx.data, id), e.clientX, e.clientY);
      else tooltip.hide();
    });
    this.list.addEventListener('pointerleave', () => tooltip.hide());

    ctx.bus.on('interact:facility', ({ facility }) => {
      if (facility.type !== 'shop') return;
      this.facility = facility;
      ui.open('shop');
      this.render();
    });
    ctx.bus.on('shop:special', (e) => { this.special = e; });
    ctx.bus.on('gold:changed', ({ gold }) => {
      this.gold = gold;
      this.goldEl.textContent = gold.toLocaleString();
      if (this.facility) this.render();
    });
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.bag = slots;
      if (this.facility) this.render();
    });
  }

  row(def, id, right) {
    const { grades } = this.ctx.data.items;
    return `
      <div class="shop-row">
        <span class="craft-icon" data-item="${id}" style="--grade:${grades[def.grade]?.color}">${itemIcon(def)}</span>
        <span class="craft-text"><b>${def.name}</b><small>${def.description ?? ''}</small></span>
        ${right}
      </div>`;
  }

  render() {
    const { items, shop } = this.ctx.data;
    for (const b of this.win.body.querySelectorAll('[data-tab]')) b.classList.toggle('on', b.dataset.tab === this.tab);
    if (this.tab === 'buy') {
      this.list.innerHTML = shop.buy.map((e) => {
        const price = shopPrice(e, this.special);
        const sale = price < e.price ? `<small class="sale">특가 <s>${e.price}</s></small>` : '';
        return this.row(items.items[e.id], e.id, `${sale}
        <button type="button" data-buy="${e.id}" ${this.gold < price ? 'disabled' : ''}><i class="coin"></i>${price}</button>`);
      }).join('');
      return;
    }
    const rows = this.bag.map((s, i) => {
      if (!s) return '';
      const def = items.items[s.id];
      if (!def.value) return '';
      return this.row(def, s.id, `
        <span class="shop-sell">
          <small>${s.count}개 · 개당 ${def.value}</small>
          <button type="button" data-sell="${i}" data-count="1">1개</button>
          ${s.count > 1 ? `<button type="button" data-sell="${i}" data-count="${s.count}">모두 (+${def.value * s.count})</button>` : ''}
        </span>`);
    }).join('');
    this.list.innerHTML = rows || '<p class="empty">팔 수 있는 물건이 없어요</p>';
  }
}
