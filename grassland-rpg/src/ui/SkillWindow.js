import { formatStat } from './itemText.js';

// 스킬 창 (K): 3갈래 트리, 남은 포인트, 선행 조건 표시, 찍기 전 확인
export class SkillWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ranks = {};
    this.blocked = {};
    this.points = 0;
    this.pending = null;

    const win = ui.createWindow({ id: 'skills', title: '스킬', key: 'KeyK', hotkeyLabel: 'K' });
    win.onOpen = () => this.render();
    win.onClose = () => { this.pending = null; };
    win.body.innerHTML = `
      <div class="sk-points">남은 스킬 포인트 <b data-sk-points>0</b></div>
      <div class="sk-tree"></div>
      <div class="sk-confirm" hidden></div>`;
    this.tree = win.body.querySelector('.sk-tree');
    this.pointsEl = win.body.querySelector('[data-sk-points]');
    this.confirmEl = win.body.querySelector('.sk-confirm');
    this.ui = ui;

    this.tree.addEventListener('click', (e) => {
      const id = e.target.closest('[data-skill]')?.dataset.skill;
      if (!id) return;
      if (this.blocked[id] || this.points <= 0) return;
      this.pending = id;
      this.render();
    });
    this.confirmEl.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'learn') ctx.bus.emit('skill:learn', { id: this.pending });
      if (act) { this.pending = null; this.render(); }
    });

    ctx.bus.on('skills:changed', ({ ranks, blocked }) => {
      this.ranks = { ...ranks };
      this.blocked = blocked;
      this.refresh();
    });
    ctx.bus.on('stats:changed', ({ skillPoints }) => {
      this.points = skillPoints;
      this.refresh();
    });
  }

  refresh() {
    if (this.ui.isOpen('skills')) this.render();
  }

  effectText(def, ranks = 1) {
    const items = this.ctx.data.items;
    return Object.entries(def.effects)
      .map(([k, v]) => `${items.statLabels[k] ?? k} ${formatStat(items, k, v * ranks)}`)
      .join(', ');
  }

  render() {
    const { branches, skills } = this.ctx.data.skills;
    this.pointsEl.textContent = this.points;
    this.tree.innerHTML = Object.entries(branches).map(([bid, br]) => {
      const list = Object.entries(skills).filter(([, s]) => s.branch === bid).sort((a, b) => a[1].tier - b[1].tier);
      return `
        <section class="sk-branch" style="--bc:${br.color}">
          <h3>${br.name}</h3>
          ${list.map(([id, s]) => {
            const r = this.ranks[id] ?? 0;
            const why = this.blocked[id];
            const cls = r >= s.maxRank ? 'max' : why ? 'locked' : this.points > 0 ? 'ready' : '';
            const req = s.requires.map((q) => `${skills[q.id].name} ${q.rank}`).join(', ');
            return `
              <button type="button" class="sk-node ${cls}${this.pending === id ? ' picked' : ''}" data-skill="${id}">
                <span class="sk-head"><b>${s.name}</b><span class="sk-rank">${r}/${s.maxRank}</span></span>
                <small>${s.description}</small>
                <small class="sk-eff">랭크당 ${this.effectText(s)}</small>
                ${req ? `<small class="sk-req${why && why !== '최대 랭크' ? ' bad' : ''}">선행: ${req}</small>` : ''}
              </button>`;
          }).join('')}
        </section>`;
    }).join('');

    const id = this.pending;
    this.confirmEl.hidden = !id;
    if (!id) return;
    const s = skills[id];
    const next = (this.ranks[id] ?? 0) + 1;
    this.confirmEl.innerHTML = `
      <p><b>${s.name}</b>을(를) <b>${next}랭크</b>로 올릴까요?<br><small>누적 효과: ${this.effectText(s, next)} · 포인트 1 사용</small></p>
      <div class="sk-actions"><button type="button" data-act="cancel">취소</button><button type="button" class="primary" data-act="learn">배우기</button></div>`;
  }
}
