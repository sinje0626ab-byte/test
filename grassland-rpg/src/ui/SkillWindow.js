import { formatStat } from './itemText.js';
import { skillArt } from './uiArt.js';

// 스킬 창 (K): 갈래(전투·생존·건축)마다 한 쪽. 위 탭·‹ › 로 고르거나 옆으로 밀어 넘긴다.
// 남은 포인트, 선행 조건 표시, 찍기 전 확인
export class SkillWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ranks = {};
    this.blocked = {};
    this.points = 0;
    this.pending = null;
    this.slots = [null, null];
    this.page = 0;

    const win = ui.createWindow({ id: 'skills', title: '스킬', key: 'KeyK', hotkeyLabel: 'K' });
    win.onOpen = () => this.render();
    win.onClose = () => { this.pending = null; };
    win.body.innerHTML = `
      <div class="sk-points">남은 스킬 포인트 <b data-sk-points>0</b></div>
      <div class="sk-tabs"></div>
      <div class="sk-tree"></div>
      <div class="sk-confirm" hidden></div>`;
    this.tree = win.body.querySelector('.sk-tree');
    this.pointsEl = win.body.querySelector('[data-sk-points]');
    this.confirmEl = win.body.querySelector('.sk-confirm');
    this.tabsEl = win.body.querySelector('.sk-tabs');
    this.ui = ui;

    // 쪽 넘기기: 탭·화살표를 누르면 부드럽게 이동, 손가락으로 밀면 쪽 번호를 따라간다
    this.tabsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b) return;
      const n = Object.keys(ctx.data.skills.branches).length;
      const to = b.dataset.page === 'prev' ? this.page - 1 : b.dataset.page === 'next' ? this.page + 1 : Number(b.dataset.page);
      this.goPage(Math.max(0, Math.min(n - 1, to)), true);
    });
    this.tree.addEventListener('scroll', () => {
      const w = this.tree.clientWidth;
      if (!w) return;
      const p = Math.round(this.tree.scrollLeft / w);
      if (p !== this.page) { this.page = p; this.markTabs(); }
    }, { passive: true });

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

  goPage(i, smooth) {
    this.page = i;
    this.markTabs();
    this.tree.scrollTo({ left: i * this.tree.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
  }

  markTabs() {
    const n = Object.keys(this.ctx.data.skills.branches).length;
    for (const b of this.tabsEl.querySelectorAll('[data-page]')) {
      const p = b.dataset.page;
      if (p === 'prev') b.disabled = this.page <= 0;
      else if (p === 'next') b.disabled = this.page >= n - 1;
      else b.classList.toggle('on', Number(p) === this.page);
    }
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
    // 탭: 갈래 이름 + 그 갈래에 쓴 포인트
    const spent = (bid) => Object.entries(skills).reduce((t, [id, s]) => t + (s.branch === bid ? this.ranks[id] ?? 0 : 0), 0);
    this.tabsEl.innerHTML = `<button type="button" class="sk-arrow" data-page="prev" aria-label="이전">‹</button>${
      Object.entries(branches).map(([bid, br], i) => `<button type="button" class="sk-tab" data-page="${i}" style="--bc:${br.color}">${br.name}<small>${spent(bid)}</small></button>`).join('')
    }<button type="button" class="sk-arrow" data-page="next" aria-label="다음">›</button>`;
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
                <span class="sk-head">${skillArt(id, br.color)}<b>${s.name}</b><span class="sk-rank">${r}/${s.maxRank}</span></span>
                <small>${s.description}</small>
                ${s.active ? this.activeLine(id, s, r) : `<small class="sk-eff">랭크당 ${this.effectText(s)}</small>`}
                ${req ? `<small class="sk-req${why && why !== '최대 랭크' ? ' bad' : ''}">선행: ${req}</small>` : ''}
              </button>`;
          }).join('')}
        </section>`;
    }).join('');
    // 다시 그려도 보던 쪽을 그대로 (창이 막 열려 폭이 0이면 다음 프레임에)
    const keep = () => this.goPage(this.page, false);
    if (this.tree.clientWidth) keep(); else requestAnimationFrame(keep);

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
