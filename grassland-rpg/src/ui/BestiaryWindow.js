import { monsterPortrait } from './monsterPortrait.js';

// 몬스터 도감 창 (부엉 박사): 칸마다 몬스터 사진(실제 모델을 찍은 것). 못 만난 몬스터는 그림자와 ???
// 칸을 누르면 큰 사진 + 이름·설명·처치 수·능력치를 보여 주는 상세 화면, '목록'으로 돌아간다.
const formatNum = (n) => Number(n).toLocaleString('ko-KR');

export class BestiaryWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    const win = ui.createWindow({ id: 'bestiary', title: '몬스터 도감' });
    win.el.classList.add('win-center');
    win.onClose = () => { this.detail = null; };
    this.body = win.body;
    this.view = null;
    this.detail = null;
    ctx.bus.on('bestiary:show', (v) => {
      this.view = v;
      this.detail = null;
      this.render();
      ui.open('bestiary');
    });
    this.body.addEventListener('click', (e) => {
      const card = e.target.closest('[data-mon]');
      if (card) { this.detail = card.dataset.mon; this.render(); return; }
      if (e.target.closest('[data-act="back"]')) { this.detail = null; this.render(); }
    });
  }

  pic(e) {
    return monsterPortrait(this.ctx.data.monsters[e.id], e.id, e.kills > 0);
  }

  render() {
    const v = this.view;
    if (!v) return;
    if (this.detail) return this.renderDetail(v.list.find((e) => e.id === this.detail));
    const ms = this.ctx.data.config.bestiary.milestones;
    this.body.innerHTML = `
      <div class="bs">
        <p class="bs-head">완성률 <b>${Math.round(v.ratio * 100)}%</b>${v.title ? ` · 칭호 「${v.title}」` : ''}<small>처치 ${ms.map((m) => m.kills).join('·')}마리마다 보상 · 칸을 누르면 자세히</small></p>
        <div class="bs-grid">${v.list.map((e) => (e.kills ? `
          <button type="button" class="bs-card${e.boss ? ' boss' : ''}" data-mon="${e.id}">
            <img class="bs-pic" src="${this.pic(e)}" alt="" style="--c:${e.color}">
            <b>${e.name}</b><small>${e.lore}</small><span class="bs-kills">${e.kills}마리</span>
          </button>` : `
          <button type="button" class="bs-card unknown" data-mon="${e.id}">
            <img class="bs-pic" src="${this.pic(e)}" alt="">
            <b>???</b><small>아직 만나지 못했어요</small>
          </button>`)).join('')}</div>
      </div>`;
  }

  renderDetail(e) {
    if (!e) { this.detail = null; return this.render(); }
    const d = this.ctx.data.monsters[e.id];
    const known = e.kills > 0;
    const stats = known
      ? `<dl class="bs-stats"><dt>체력</dt><dd>${formatNum(d.hp)}</dd><dt>공격력</dt><dd>${formatNum(d.attack)}</dd><dt>방어력</dt><dd>${formatNum(d.defense ?? 0)}</dd><dt>경험치</dt><dd>${formatNum(d.xp ?? 0)}</dd></dl>`
      : '';
    this.body.innerHTML = `
      <div class="bs-detail${e.boss ? ' boss' : ''}${known ? '' : ' unknown'}">
        <button type="button" class="bs-back" data-act="back">‹ 목록</button>
        <div class="bs-photo" style="--c:${known ? e.color : '#cfc6ae'}"><img src="${this.pic(e)}" alt="${known ? e.name : '???'}"></div>
        <h3>${known ? e.name : '???'}${e.boss && known ? ' <span class="bs-tag">보스</span>' : ''}</h3>
        <p class="bs-lore">${known ? e.lore : '아직 만나지 못한 몬스터예요. 잡으면 사진과 정보가 채워져요.'}</p>
        ${known ? `<p class="bs-count">지금까지 <b>${e.kills}마리</b> 잡았어요</p>` : ''}
        ${stats}
      </div>`;
  }
}
