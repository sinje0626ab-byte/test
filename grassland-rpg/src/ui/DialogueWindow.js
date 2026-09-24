// 대화 창: 화면 아래 말풍선 + 주민 얼굴(색 동그라미·이름 첫 글자), 글자는 타자기처럼.
// 누르면 바로 전체 표시. 다 나오면 선택지 (선택지는 event를 보내고 창을 닫는다, stay면 안 닫음)
export class DialogueWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.talk = null;
    this.speed = ctx.data.npcs.config.typeSpeed;
    const win = ui.createWindow({ id: 'dialogue', title: '대화' });
    win.el.classList.add('win-dialogue');
    win.onClose = () => {
      if (this.talk) this.talk.npc.talking = 0;
      this.talk = null;
    };
    win.onUpdate = (dt) => this.tick(dt);
    this.win = win;
    this.body = win.body;
    this.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-opt]');
      if (b && this.done) {
        const o = this.talk.options[Number(b.dataset.opt)];
        if (!o.stay) ui.close('dialogue');
        if (o.event) ctx.bus.emit(o.event, o.payload ?? {});
        return;
      }
      this.shown = this.full.length; // 탭하면 전체 표시
    });
    ctx.bus.on('dialogue:open', (talk) => this.open(talk));
  }

  open(talk) {
    this.talk = talk;
    this.full = talk.lines.join('\n');
    this.shown = 0;
    this.done = false;
    const d = talk.npc.def;
    this.win.el.querySelector('.win-head h2').textContent = `${d.name} · ${d.animal}`;
    this.body.innerHTML = `
      <div class="dlg">
        <i class="dlg-face" style="--c:${d.color};--a:${d.accent}">${d.name[0]}</i>
        <p class="dlg-text"></p>
      </div>
      <div class="dlg-opts" hidden>${talk.options.map((o, i) => `<button type="button" data-opt="${i}">${o.label}</button>`).join('')}</div>`;
    this.textEl = this.body.querySelector('.dlg-text');
    this.optsEl = this.body.querySelector('.dlg-opts');
    this.ui.close('dialogue');
    this.ui.open('dialogue');
  }

  tick(dt) {
    const t = this.talk;
    if (!t) return;
    // 멀어지면 닫는다
    if (this.ctx.player.position.distanceTo(t.npc.position) > this.ctx.data.npcs.config.interactRange + 3) {
      this.ui.close('dialogue');
      return;
    }
    if (this.done) return;
    this.shown = Math.min(this.full.length, this.shown + this.speed * dt);
    this.textEl.textContent = this.full.slice(0, Math.floor(this.shown));
    if (this.shown >= this.full.length) {
      this.done = true;
      this.optsEl.hidden = false;
    }
  }
}
