import { formatStat } from './itemText.js';
import { skillArt } from './uiArt.js';
import { ultArt } from './SkillBar.js';

// 스킬 창 (K): 갈래마다 별자리 한 장 (전투·생존·채집·건축) + 궁극기 쪽.
// 별(스킬)을 누르면 아래 설명 판: 효과·선행·배우기(포인트 1) · 액티브는 Q·R 등록과 각인 끼우기.
// 별자리 끝의 큰 별은 핵심 별 — 셋 중 하나만, 그 갈래에 포인트 8 이상.
// 궁극기 쪽: 게이지, 해금한 궁극기 고르기, 모은 각인 수.
export class SkillWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.ranks = {};
    this.blocked = {};
    this.points = 0;
    this.slots = [null, null];
    this.runes = { owned: [], equipped: {} };
    this.ult = { owned: [], equipped: null, gauge: 0 };
    this.page = 0;
    this.sel = {}; // 쪽마다 고른 별

    const win = ui.createWindow({ id: 'skills', title: '스킬', key: 'KeyK', hotkeyLabel: 'K' });
    win.el.classList.add('win-skills2');
    win.onOpen = () => this.render();
    win.body.innerHTML = `
      <div class="sk2-top"><span class="sk2-points">남은 포인트 <b data-sk-points>0</b></span><span class="sk2-rune-count" data-rune-count></span></div>
      <div class="sk-tabs"></div>
      <div class="sk2-page"></div>`;
    this.pointsEl = win.body.querySelector('[data-sk-points]');
    this.runeCountEl = win.body.querySelector('[data-rune-count]');
    this.tabsEl = win.body.querySelector('.sk-tabs');
    this.pageEl = win.body.querySelector('.sk2-page');

    this.tabsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b) return;
      const n = this.pages().length;
      const to = b.dataset.page === 'prev' ? this.page - 1 : b.dataset.page === 'next' ? this.page + 1 : Number(b.dataset.page);
      this.page = Math.max(0, Math.min(n - 1, to));
      this.render();
    });
    // 옆으로 밀어 쪽 넘기기 (휴대폰)
    let swipe = null;
    this.pageEl.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') swipe = { x: e.clientX, y: e.clientY }; });
    this.pageEl.addEventListener('pointerup', (e) => {
      if (!swipe) return;
      const dx = e.clientX - swipe.x;
      const dy = e.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
      this.page = Math.max(0, Math.min(this.pages().length - 1, this.page + (dx < 0 ? 1 : -1)));
      this.render();
    });

    this.pageEl.addEventListener('click', (e) => {
      const star = e.target.closest('[data-star]');
      if (star) { this.sel[this.page] = star.dataset.star; this.render(); return; }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      const id = act.dataset.id;
      switch (act.dataset.act) {
        case 'learn': ctx.bus.emit('skill:learn', { id }); break;
        case 'assign': ctx.bus.emit('skill:assign', { id, slot: Number(act.dataset.slot) }); break;
        case 'rune': ctx.bus.emit('rune:equip', { skill: id, rune: act.dataset.rune || null }); break;
        case 'ult': ctx.bus.emit('ult:equip', { id }); break;
        default:
      }
    });

    const refresh = () => { if (ui.isOpen('skills')) this.render(); };
    ctx.bus.on('skills:changed', ({ ranks, blocked }) => { this.ranks = { ...ranks }; this.blocked = blocked; refresh(); });
    ctx.bus.on('skills:slots', ({ slots }) => { this.slots = slots; refresh(); });
    ctx.bus.on('stats:changed', ({ skillPoints }) => { if (skillPoints !== this.points) { this.points = skillPoints; refresh(); } });
    ctx.bus.on('runes:changed', (r) => { this.runes = r; refresh(); });
    ctx.bus.on('ult:changed', (u) => { this.ult = u; refresh(); });
    ctx.bus.on('ult:ready', refresh);
    ctx.bus.on('ult:used', refresh);
  }

  // 쪽 목록: 별자리 갈래들 + 궁극기
  pages() {
    return Object.entries(this.ctx.data.skills.branches);
  }

  effectText(def, ranks = 1) {
    const items = this.ctx.data.items;
    if (def.active) return ranks > 1 ? `${def.rankText} ×${ranks - 1}` : def.rankText;
    return Object.entries(def.effects)
      .filter(([k]) => items.statLabels[k])
      .map(([k, v]) => `${items.statLabels[k]} ${formatStat(items, k, v * ranks)}`)
      .join(', ');
  }

  spent(bid) {
    const { skills } = this.ctx.data.skills;
    return Object.entries(skills).reduce((t, [id, s]) => t + (s.branch === bid ? this.ranks[id] ?? 0 : 0), 0);
  }

  render() {
    const { branches, runes } = this.ctx.data.skills;
    this.pointsEl.textContent = this.points;
    this.runeCountEl.textContent = `각인 ${this.runes.owned.length}/${Object.keys(runes).length}`;
    const pages = this.pages();
    this.tabsEl.innerHTML = `<button type="button" class="sk-arrow" data-page="prev" aria-label="이전" ${this.page <= 0 ? 'disabled' : ''}>‹</button>${
      pages.map(([bid, br], i) => `<button type="button" class="sk-tab${i === this.page ? ' on' : ''}" data-page="${i}" style="--bc:${br.color}">${br.name}${br.special ? '' : `<small>${this.spent(bid)}</small>`}</button>`).join('')
    }<button type="button" class="sk-arrow" data-page="next" aria-label="다음" ${this.page >= pages.length - 1 ? 'disabled' : ''}>›</button>`;
    const [bid, br] = pages[this.page];
    this.pageEl.innerHTML = br.special ? this.ultPage(br) : this.constellation(bid, br);
  }

  // ── 별자리 ──
  constellation(bid, br) {
    const { skills } = this.ctx.data.skills;
    // 데이터 자리(0~100)를 판 안쪽 여백 안으로 (위 별 이름·아래 핵심 별이 잘리지 않게)
    const X = (v) => +(7 + v * 0.86).toFixed(2);
    const Y = (v) => +(10 + v * 0.76).toFixed(2);
    const list = Object.entries(skills).filter(([, s]) => s.branch === bid);
    const has = (id) => (this.ranks[id] ?? 0) > 0;
    // 선: 선행 → 스킬, 핵심 별은 가장 깊은 별들에서 점선
    const lines = [];
    for (const [id, s] of list) {
      for (const q of s.requires) {
        const a = skills[q.id].pos;
        lines.push(`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(s.pos[0])}" y2="${Y(s.pos[1])}" class="${has(q.id) && has(id) ? 'lit' : has(q.id) ? 'half' : ''}"/>`);
      }
      if (s.keystone) {
        const deep = Math.max(...list.filter(([, x]) => !x.keystone).map(([, x]) => x.tier));
        for (const [oid, o] of list) if (!o.keystone && o.tier >= deep - 1) lines.push(`<line x1="${X(o.pos[0])}" y1="${Y(o.pos[1])}" x2="${X(s.pos[0])}" y2="${Y(s.pos[1])}" class="key${has(id) ? ' lit' : ''}"/>`);
      }
    }
    // 고른 별 (없으면 배울 수 있는 첫 별, 그것도 없으면 첫 별)
    let sel = this.sel[this.page];
    if (!sel || !skills[sel] || skills[sel].branch !== bid) sel = (list.find(([id]) => !this.blocked[id] && this.points > 0) ?? list[0])[0];
    this.sel[this.page] = sel;
    const stars = list.map(([id, s]) => {
      const r = this.ranks[id] ?? 0;
      const why = this.blocked[id];
      const cls = [s.keystone ? 'key' : '', r >= s.maxRank ? 'max' : r > 0 ? 'some' : '', !why && this.points > 0 && r < s.maxRank ? 'ready' : '', why && !r && why !== '최대 랭크' ? 'locked' : '', id === sel ? 'sel' : '', s.active ? 'active' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="sk2-star ${cls}" data-star="${id}" style="left:${X(s.pos[0])}%;top:${Y(s.pos[1])}%">
        <span class="st-orb">${s.keystone ? keyArt(bid) : skillArt(id, br.color)}</span>
        <span class="st-rank">${s.keystone ? (r ? '★' : '☆') : `${r}/${s.maxRank}`}</span>
        <span class="st-name">${s.name}</span>
      </button>`;
    }).join('');
    return `
      <div class="sk2-sky" style="--bc:${br.color}">
        <i class="sky-dust"></i>
        <svg class="sky-lines" viewBox="0 0 100 100" preserveAspectRatio="none">${lines.join('')}</svg>
        ${stars}
      </div>
      ${this.detail(sel, br)}`;
  }

  detail(id, br) {
    const { skills, runes } = this.ctx.data.skills;
    const s = skills[id];
    const r = this.ranks[id] ?? 0;
    const why = this.blocked[id];
    const can = !why && this.points > 0 && r < s.maxRank;
    const req = s.requires.map((q) => `${skills[q.id].name} ${q.rank}`).join(', ');
    const lines = [];
    if (s.keystone) lines.push(`<p class="sk2-key-note">핵심 별 · 셋 중 하나만 고를 수 있어요 · 이 별자리에 포인트 ${s.requiresSpent} 이상</p>`);
    else if (s.active) {
      const a = s.active;
      lines.push(`<p class="sk2-eff"><b class="tag">액티브</b> 쿨 ${a.cooldown}초${a.stamina ? ` · 스태미나 ${a.stamina}` : ''} · 랭크당 ${s.rankText}</p>`);
    } else {
      lines.push(`<p class="sk2-eff">랭크당 ${this.effectText(s)}${r ? ` <small>· 지금 ${this.effectText(s, r)}</small>` : ''}</p>`);
    }
    if (req) lines.push(`<p class="sk2-req${why && why.endsWith('필요') ? ' bad' : ''}">선행: ${req}</p>`);
    if (why && why !== '최대 랭크' && !req.includes(why)) lines.push(`<p class="sk2-req bad">${why}</p>`);
    // 액티브: Q·R + 각인
    let extra = '';
    if (s.active && r > 0) {
      const { labels } = this.ctx.data.config.activeSkills;
      extra += `<div class="sk2-assign">${labels.map((k, i) => `<button type="button" class="${this.slots[i] === id ? 'on' : ''}" data-act="assign" data-id="${id}" data-slot="${i}">${k} 칸${this.slots[i] === id ? ' ✓' : ''}</button>`).join('')}</div>`;
    }
    if (s.active) {
      const mine = Object.entries(runes).filter(([, x]) => x.skill === id);
      const eq = this.runes.equipped[id];
      extra += `<div class="sk2-runes"><b class="sk2-sub">각인 <small>하나만 끼울 수 있어요 · 보스·황금 상자·정예에서 얻어요</small></b>${mine.map(([rid, x]) => {
        const own = this.runes.owned.includes(rid);
        return own
          ? `<button type="button" class="rune${eq === rid ? ' on' : ''}" style="--rc:${x.color}" data-act="rune" data-id="${id}" data-rune="${eq === rid ? '' : rid}"><i></i><span><b>${x.name}</b><small>${x.desc}</small></span><em>${eq === rid ? '끼움' : '끼우기'}</em></button>`
          : `<div class="rune lockd"><i></i><span><b>??? 각인</b><small>아직 못 얻었어요</small></span></div>`;
      }).join('')}</div>`;
    }
    return `
      <div class="sk2-detail" style="--bc:${br.color}">
        <div class="sk2-dh">${s.keystone ? keyArt(s.branch) : skillArt(id, br.color)}<span><b>${s.name}</b><small>${s.keystone ? (r ? '고른 핵심 별' : '핵심 별') : `${r}/${s.maxRank} 랭크`}</small></span>
          ${r >= s.maxRank ? '<em class="done">다 배웠어요</em>' : `<button type="button" class="primary" data-act="learn" data-id="${id}" ${can ? '' : 'disabled'}>${r ? '올리기' : '배우기'} <small>포인트 1</small></button>`}
        </div>
        <p class="sk2-desc">${s.description}</p>
        ${lines.join('')}
        ${extra}
      </div>`;
  }

  // ── 궁극기 ──
  ultPage(br) {
    const { ultimates, ultimate } = this.ctx.data.skills;
    const g = this.ctx.ultimate?.gauge ?? 0;
    const k = Math.min(1, g / ultimate.max);
    const cards = Object.entries(ultimates).map(([id, u]) => {
      const own = this.ult.owned.includes(id);
      const on = this.ult.equipped === id;
      return `
        <div class="ult-card${own ? '' : ' lockd'}${on ? ' on' : ''}" style="--uc:${u.color}">
          <span class="uc-icon">${ultArt(id)}</span>
          <span class="uc-text"><b>${u.name}</b><small>${u.desc}</small>${own ? '' : `<small class="uc-unlock">해금: ${u.unlockText}</small>`}</span>
          ${own ? `<button type="button" class="${on ? '' : 'primary'}" data-act="ult" data-id="${id}" ${on ? 'disabled' : ''}>${on ? '사용 중' : '고르기'}</button>` : '<em>잠김</em>'}
        </div>`;
    }).join('');
    return `
      <div class="ult-gauge" style="--bc:${br.color}">
        <span>궁극기 게이지 <b>${Math.floor(g)}/${ultimate.max}</b></span>
        <div class="bar"><i style="width:${k * 100}%"></i></div>
        <small>적을 쓰러뜨리고(정예·보스는 더 많이) 때리고 맞으면 차올라요. 다 차면 <kbd>${ultimate.label}</kbd> (휴대폰은 보라 단추)</small>
      </div>
      <div class="ult-list">${cards}</div>`;
  }
}

// 핵심 별 그림: 갈래 색 큰 별
function keyArt(bid) {
  const C = { combat: '#ff8a7a', survival: '#7cc67a', building: '#e9a35b' }[bid] ?? '#b48cf0';
  return `<svg class="skill-svg key-svg" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="21" fill="#3e4675"/><circle cx="24" cy="24" r="18" fill="none" stroke="${C}" stroke-width="2" stroke-dasharray="3 3"/>
    <path d="M24 7l4.6 10.6 11.4 1-8.7 7.6 2.6 11.3L24 31.6l-9.9 5.9 2.6-11.3L8 18.6l11.4-1z" fill="${C}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="24" cy="23" r="3.2" fill="#fff" opacity=".85"/>
  </svg>`;
}
