import { closeWhenFar } from './CraftWindow.js';

// 현상금 게시판 창: 오늘의 의뢰 3개, 진행도, 완료 보고
export class BountyWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.list = [];
    this.have = {};
    this.facility = null;
    const win = ui.createWindow({ id: 'bounty', title: '현상금 게시판' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.facility = null; };
    win.onUpdate = () => closeWhenFar(ctx, ui, 'bounty', this.facility);
    this.body = win.body;
    this.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-claim]');
      if (b && !b.disabled) ctx.bus.emit('bounty:claim', { index: Number(b.dataset.claim) });
    });
    ctx.bus.on('bounty:show', ({ facility }) => {
      this.facility = facility;
      ui.open('bounty');
      this.render();
    });
    ctx.bus.on('bounty:changed', ({ list, have }) => {
      this.list = list;
      this.have = have;
      if (this.facility) this.render();
    });
  }

  text(b) {
    const { monsters, items } = this.ctx.data;
    if (b.type === 'kill') return [`${monsters[b.monster].name} ${b.count}마리 잡기`, `${b.progress}/${b.count}`];
    if (b.type === 'elite') return [`정예 몬스터 ${b.count}마리 잡기`, `${b.progress}/${b.count}`];
    return [`${items.items[b.item].name} ${b.count}개 납품`, `가방 ${Math.min(this.have[b.item] ?? 0, b.count)}/${b.count}`];
  }

  render() {
    const items = this.ctx.data.items.items;
    this.body.innerHTML = `<div class="bt">${this.list.length ? this.list.map((b, i) => {
      const [goal, prog] = this.text(b);
      return `
        <div class="bt-card${b.claimed ? ' claimed' : ''}">
          <b>${goal}</b>
          <small>${prog} · 보상 <i class="coin"></i>${b.gold}${b.bonus ? ` + ${items[b.bonus].name}` : ''}</small>
          <button type="button" data-claim="${i}" ${b.claimed || !b.done ? 'disabled' : ''}>${b.claimed ? '완료함' : b.done ? '보고하기' : '진행 중'}</button>
        </div>`;
    }).join('') : '<p class="empty">아직 붙은 의뢰가 없어요. 내일 아침에 와 봐요.</p>'}
      <p class="gd-note">의뢰는 매일 아침 새로 붙어요.</p></div>`;
  }
}
