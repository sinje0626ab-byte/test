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
    const st = this.ctx.activeSkills;
    const defs = this.ctx.data.skills.skills;
    const stamina = this.ctx.player.stats.stamina;
    this.slots.forEach((id, i) => {
      if (!id) return;
      const b = this.buttons[i];
      const a = defs[id].active;
      const cd = st.cd[id] ?? 0;
      b.style.setProperty('--p', cd > 0 ? cd / a.cooldown : 0);
      b.querySelector('.s-num').textContent = cd > 0 ? Math.ceil(cd) : '';
      b.classList.toggle('low', cd <= 0 && stamina < a.stamina);
    });
  }
}
