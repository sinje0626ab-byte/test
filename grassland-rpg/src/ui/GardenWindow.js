import { closeWhenFar } from './CraftWindow.js';

// 텃밭 창 (텃밭 앞에서 E): 씨앗 심기 · 자라는 중 · 거두기
export class GardenWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.counts = {};
    this.facility = null;

    const win = ui.createWindow({ id: 'garden', title: '텃밭' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'garden', this.facility);
    this.body = win.body;

    this.body.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || !this.facility) return;
      if (b.dataset.seed) ctx.bus.emit('garden:plant', { facility: this.facility, seed: b.dataset.seed });
      if (b.dataset.act === 'harvest') ctx.bus.emit('garden:harvest', { facility: this.facility });
    });
    ctx.bus.on('interact:facility', ({ facility }) => {
      if (facility.type !== 'garden') return;
      this.facility = facility;
      ui.open('garden');
      this.render();
    });
    ctx.bus.on('garden:changed', () => { if (this.facility) this.render(); });
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
      if (this.facility) this.render();
    });
  }

  render() {
    const f = this.facility;
    const { crops } = this.ctx.data.config.garden;
    const items = this.ctx.data.items.items;
    const g = f.growth();
    let html;
    if (g == null) {
      html = `<p class="gd-note">무엇을 심을까요? 씨앗은 상점에서 살 수 있어요.</p>
        <div class="gd-seeds">${Object.entries(crops).map(([seed, c]) => {
          const have = this.counts[seed] ?? 0;
          return `<button type="button" data-seed="${seed}" ${have ? '' : 'disabled'}>
            <i class="item-icon" style="--c:${items[seed].color}"></i><b>${items[seed].name}</b>
            <small>${c.days}일 뒤 ${c.name} ${c.min}~${c.max}개 · 가진 씨앗 ${have}</small></button>`;
        }).join('')}</div>`;
    } else {
      const c = crops[f.crop.seed];
      const left = Math.max(0, c.days - (this.ctx.time.day - f.crop.day));
      html = g >= 1
        ? `<p class="gd-note">${c.name}이(가) 다 자랐어요!</p><button type="button" class="gd-harvest" data-act="harvest">거두기</button>`
        : `<p class="gd-note">${c.name}이(가) 자라는 중… <b>${left}일</b> 뒤 아침에 거둘 수 있어요.</p>
           <div class="bar"><div class="fill" style="width:${g * 100}%"></div></div>`;
    }
    this.body.innerHTML = `<div class="gd">${html}</div>`;
  }
}
