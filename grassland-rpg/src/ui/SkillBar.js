import { skillArt } from './uiArt.js';
// 액티브 스킬 슬롯 Q·R. PC는 퀵슬롯 옆, 모바일은 공격 버튼 위 둥근 버튼 (쿨다운 원형 표시).
// 누르면 skill:cast. 쿨다운은 ctx.activeSkills(ActiveSkillSystem)를 읽는다.
// 바꾸기: PC 우클릭 / 터치 길게 누르기 → 배운 액티브 스킬 고르기 판 (스킬 창의 Q·R 버튼과 같은 skill:assign)
export class SkillBar {
  constructor(ctx, root) {
    this.ctx = ctx;
    const { labels } = ctx.data.config.activeSkills;
    this.slots = [null, null];
    const el = document.createElement('div');
    el.className = 'skillbar';
    el.innerHTML = labels.map((k, i) => `
      <button type="button" class="sslot empty" data-slot="${i}">
        <kbd>${k}</kbd><span class="s-icon"></span><span class="s-cd"></span><span class="s-num"></span>
      </button>`).join('');
    // 궁극기 단추 (F): 보라 고리가 게이지만큼 찬다. 다 차면 반짝
    const ult = document.createElement('button');
    ult.type = 'button';
    ult.className = 'ultslot';
    ult.hidden = true;
    ult.innerHTML = `<kbd>${ctx.data.skills.ultimate.label}</kbd><span class="u-icon"></span><span class="u-pct"></span>`;
    el.appendChild(ult);
    this.ultEl = ult;
    ult.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); ctx.bus.emit('ult:cast'); });
    ctx.bus.on('ult:changed', ({ equipped }) => {
      ult.hidden = !equipped;
      const u = equipped && ctx.data.skills.ultimates[equipped];
      if (u) {
        ult.style.setProperty('--uc', u.color);
        ult.querySelector('.u-icon').innerHTML = ultArt(equipped);
        ult.title = `궁극기 「${u.name}」 — 게이지가 차면 ${ctx.data.skills.ultimate.label}`;
      }
    });
    root.appendChild(el);
    this.buttons = [...el.querySelectorAll('.sslot')];
    this.ranks = {};
    this.picker = document.createElement('div');
    this.picker.className = 'skill-picker';
    this.picker.hidden = true;
    el.appendChild(this.picker);
    let hold = null;
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.skill-picker')) return;
      const b = e.target.closest('.sslot');
      if (!b) return;
      e.preventDefault();
      const slot = Number(b.dataset.slot);
      if (e.button === 2) { this.openPicker(slot); return; }
      if (e.pointerType === 'touch') {
        // 길게 누르면 고르기, 짧게 떼면 사용
        hold = { slot, timer: setTimeout(() => { hold.opened = true; this.openPicker(slot); }, ctx.data.config.activeSkills.holdMs ?? 450) };
        return;
      }
      this.closePicker();
      ctx.bus.emit('skill:cast', { slot });
    });
    el.addEventListener('pointerup', () => {
      if (!hold) return;
      clearTimeout(hold.timer);
      if (!hold.opened) ctx.bus.emit('skill:cast', { slot: hold.slot });
      hold = null;
    });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    this.picker.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (!b) return;
      const id = b.dataset.pick;
      if (id) ctx.bus.emit('skill:assign', { id, slot: this.pickSlot });
      else ctx.bus.emit('skill:unassign', { slot: this.pickSlot });
      this.closePicker();
    });
    window.addEventListener('pointerdown', (e) => { if (!this.picker.hidden && !e.target.closest('.skillbar')) this.closePicker(); });
    ctx.bus.on('skills:slots', ({ slots }) => this.render(slots));
    ctx.bus.on('skills:changed', ({ ranks }) => { this.ranks = ranks; });
  }

  render(slots) {
    this.slots = slots;
    const defs = this.ctx.data.skills.skills;
    slots.forEach((id, i) => {
      const b = this.buttons[i];
      const def = id && defs[id];
      b.classList.toggle('empty', !def);
      b.querySelector('.s-icon').innerHTML = def ? skillArt(id, this.ctx.data.skills.branches[def.branch].color) : '';
      b.title = `${def ? def.name : '비어 있음'} — 우클릭(길게 누르기)으로 스킬 바꾸기`;
    });
  }

  openPicker(slot) {
    const { skills, config } = this.ctx.data;
    const learned = Object.entries(skills.skills).filter(([id, d]) => d.active && this.ranks[id]);
    this.pickSlot = slot;
    const key = config.activeSkills.labels[slot];
    this.picker.innerHTML = learned.length
      ? `<b>${key} 칸에 넣을 스킬</b>${learned.map(([id, d]) => `
        <button type="button" data-pick="${id}" class="${this.slots[slot] === id ? 'on' : ''}">${skillArt(id, skills.branches[d.branch].color)}<span>${d.name}</span></button>`).join('')}
        ${this.slots[slot] ? '<button type="button" data-pick="" class="clear">비우기</button>' : ''}`
      : `<b>${key} 칸</b><small>아직 배운 액티브 스킬이 없어요 (스킬 창 K)</small>`;
    this.picker.hidden = false;
  }

  closePicker() {
    this.picker.hidden = true;
  }

  update() {
    const u = this.ctx.ultimate;
    if (u && !this.ultEl.hidden) {
      const k = Math.min(1, u.gauge / u.max);
      this.ultEl.style.setProperty('--g', k.toFixed(3));
      this.ultEl.classList.toggle('ready', k >= 1);
      this.ultEl.querySelector('.u-pct').textContent = k >= 1 ? '' : `${Math.floor(k * 100)}`;
    }
    const st = this.ctx.activeSkills;
    const defs = this.ctx.data.skills.skills;
    const stamina = this.ctx.player.stats.stamina;
    this.slots.forEach((id, i) => {
      if (!id) return;
      const b = this.buttons[i];
      const a = defs[id].active;
      const cd = st.cd[id] ?? 0;
      b.style.setProperty('--p', cd > 0 ? cd / (st.cdMax?.[id] ?? a.cooldown) : 0);
      b.querySelector('.s-num').textContent = cd > 0 ? Math.ceil(cd) : '';
      b.classList.toggle('low', cd <= 0 && stamina < a.stamina);
    });
  }
}

// 궁극기 그림 (48 격자, 스킬 배지와 같은 붓)
export function ultArt(id) {
  const G = {
    meteor: '<path d="M10 10l14 14" stroke="#fff3c4" stroke-width="5" stroke-linecap="round" opacity=".7"/><path d="M28 14l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#ffd166" stroke="#7a5412" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="34" r="2" fill="#fff3c4"/><circle cx="36" cy="38" r="1.6" fill="#fff3c4"/>',
    sanctuary: '<circle cx="24" cy="25" r="15" fill="#c9f0b8" stroke="#3f7a2c" stroke-width="1.8"/><path d="M24 34c-7-4-9-12-1-20 8 8 6 16 1 20z" fill="#7cc67a" stroke="#3f7a2c" stroke-width="1.6"/><path d="M24 33V20" stroke="#3f7a2c" stroke-width="1.4"/><path d="M17 37c2 1 12 1 14 0" stroke="#3f7a2c" stroke-width="1.4" fill="none"/>',
    barrage: '<rect x="15" y="22" width="18" height="16" rx="3" fill="#c9c3b8" stroke="#5b4232" stroke-width="1.6"/><path d="M19 22v-5h10v5" fill="#a19a8f" stroke="#5b4232" stroke-width="1.6"/><path d="M24 17V9" stroke="#5b4232" stroke-width="3" stroke-linecap="round"/><path d="M8 14l5 3M40 14l-5 3M10 26h4M38 26h-4" stroke="#ff8a3d" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="8" r="3" fill="#ffd166" stroke="#7a5412" stroke-width="1.2"/>',
    blizzard: '<path d="M24 8v32M10 16l28 16M38 16L10 32" stroke="#5aa8d8" stroke-width="3" stroke-linecap="round"/><path d="M24 8v32M10 16l28 16M38 16L10 32" stroke="#e8f7ff" stroke-width="1.3" stroke-linecap="round"/><path d="M20 11l4 3 4-3M20 37l4-3 4 3" stroke="#5aa8d8" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="24" cy="24" r="4" fill="#e8f7ff" stroke="#5aa8d8" stroke-width="1.6"/>',
  };
  return `<svg class="ult-svg" viewBox="0 0 48 48" aria-hidden="true">${G[id] ?? ''}</svg>`;
}
