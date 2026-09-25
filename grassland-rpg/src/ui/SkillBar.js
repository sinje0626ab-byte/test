import { skillArt } from './uiArt.js';
// 액티브 스킬 슬롯 Q·R. PC는 퀵슬롯 옆, 모바일은 공격 버튼 위 둥근 버튼 (쿨다운 원형 표시).
// 누르면 skill:cast. 쿨다운은 ctx.activeSkills(ActiveSkillSystem)를 읽는다.
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
    el.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('.sslot');
      if (!b) return;
      e.preventDefault();
      ctx.bus.emit('skill:cast', { slot: Number(b.dataset.slot) });
    });
    ctx.bus.on('skills:slots', ({ slots }) => this.render(slots));
  }

  render(slots) {
    this.slots = slots;
    const defs = this.ctx.data.skills.skills;
    slots.forEach((id, i) => {
      const b = this.buttons[i];
      const def = id && defs[id];
      b.classList.toggle('empty', !def);
      b.querySelector('.s-icon').innerHTML = def ? skillArt(id, this.ctx.data.skills.branches[def.branch].color) : '';
      b.title = def ? def.name : '비어 있음 (스킬 창에서 등록)';
    });
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
