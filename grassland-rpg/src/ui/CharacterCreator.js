// 새 게임 캐릭터 만들기 (환영 카드 전에): 이름 · 머리 색 · 옷 색 · 머리 장식.
// 고를 때마다 player:appearance로 바로 입혀 본다. 끝나면 onDone().
export class CharacterCreator {
  constructor(ctx, card, onDone) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.character;
    this.card = card;
    this.onDone = onDone;
    this.look = { ...this.cfg.default };
    this.render();
    card.addEventListener('click', this.onClick = (e) => {
      const b = e.target.closest('[data-pick]');
      if (b) {
        const [key, value] = b.dataset.pick.split('|');
        this.look[key] = value;
        this.apply();
        this.render();
        return;
      }
      if (e.target.closest('[data-act="create-done"]')) this.finish();
    });
  }

  apply() {
    this.ctx.bus.emit('player:appearance', { appearance: this.look });
  }

  finish() {
    const input = this.card.querySelector('[data-cc-name]');
    const name = input.value.trim().slice(0, this.cfg.nameMax) || this.cfg.defaultName;
    this.look.name = name;
    this.apply();
    this.card.removeEventListener('click', this.onClick);
    this.onDone();
  }

  render() {
    const c = this.cfg;
    const name = this.card.querySelector('[data-cc-name]')?.value ?? this.look.name;
    const swatches = (key, list) => list.map((col) => `<button type="button" class="cc-swatch${this.look[key] === col ? ' on' : ''}" style="--c:${col}" data-pick="${key}|${col}" aria-label="${col}"></button>`).join('');
    this.card.innerHTML = `
      <div class="creator">
        <h2>어떤 개척자인가요?</h2>
        <label class="cc-row"><span>이름</span><input data-cc-name maxlength="${c.nameMax}" value="${name}" placeholder="${c.defaultName}"></label>
        <div class="cc-row"><span>머리 색</span><div class="cc-list">${swatches('hair', c.hairColors)}</div></div>
        <div class="cc-row"><span>옷 색</span><div class="cc-list">${swatches('clothes', c.clothesColors)}</div></div>
        <div class="cc-row"><span>머리 장식</span><div class="cc-list">${c.accessories.map((a) => `<button type="button" class="cc-chip${this.look.accessory === a.id ? ' on' : ''}" data-pick="accessory|${a.id}">${a.name}</button>`).join('')}</div></div>
        <div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="create-done">이대로 시작!</button></div>
      </div>`;
  }
}
