import { formatStat } from './itemText.js';

// 스킬 창 (K): 3갈래 트리, 남은 포인트, 선행 조건 표시, 찍기 전 확인
export class SkillWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ranks = {};
    this.blocked = {};
    this.points = 0;
    this.pending = null;
    this.slots = [null, null];

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
      // 액티브 스킬 Q·R 등록
      const assign = e.target.closest('[data-assign]');
      if (assign) {
        ctx.bus.emit('skill:assign', { id: assign.closest('[data-skill]').dataset.skill, slot: Number(assign.dataset.assign) });
        return;
      }
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
    ctx.bus.on('skills:slots', ({ slots }) => {
      this.slots = slots;
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
    if (def.active) return ranks > 1 ? `${def.rankText} ×${ranks - 1}` : def.rankText;
    return Object.entries(def.effects)
      .map(([k, v]) => `${items.statLabels[k] ?? k} ${formatStat(items, k, v * ranks)}`)
      .join(', ');
  }

  // 액티브: 쿨다운·스태미나, 배웠으면 Q·R 등록 버튼
  activeLine(id, s, r) {
    const a = s.active;
    const { labels } = this.ctx.data.config.activeSkills;
    const assign = r > 0 ? `<span class="sk-assign">${labels.map((k, i) => `<span role="button" class="${this.slots[i] === id ? 'on' : ''}" data-assign="${i}">${k}</span>`).join('')}</span>` : '';
    return `<small class="sk-eff"><b class="sk-active">액티브</b> 쿨 ${a.cooldown}초${a.stamina ? ` · 스태미나 ${a.stamina}` : ''} · 랭크당 ${s.rankText}</small>${assign}`;
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
                ${s.active ? this.activeLine(id, s, r) : `<small class="sk-eff">랭크당 ${this.effectText(s)}</small>`}
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
