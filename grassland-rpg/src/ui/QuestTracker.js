// 현재 목표 한 줄: HUD 왼쪽 위 판 바로 아래 (판 높이가 바뀌어도 따라간다)
export class QuestTracker {
  constructor(ctx, root) {
    this.ctx = ctx;
    const el = document.createElement('div');
    el.className = 'quest-tracker';
    el.hidden = true;
    root.appendChild(el);
    this.el = el;
    ctx.bus.on('quest:changed', ({ title, goal, ready }) => {
      el.hidden = !title;
      if (!title) return;
      el.classList.toggle('ready', !!ready);
      el.innerHTML = `<b>${title}</b><span>${goal}</span>`;
    });
    const panel = document.querySelector('.hud-tl');
    if (panel && window.ResizeObserver) new ResizeObserver(() => this.place(panel)).observe(panel);
    window.addEventListener('resize', () => panel && this.place(panel));
  }

  place(panel) {
    // 좁은 터치 화면은 ☰ 버튼이 판 아래에 있어 그만큼 더 내린다
    const extra = document.body.classList.contains('touch') && window.innerWidth <= 600 ? 44 : 0;
    this.el.style.top = `${panel.getBoundingClientRect().bottom + 8 + extra}px`;
  }
}
