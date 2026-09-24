import { baseAt } from '../utils/bases.js';
import { turretCost, maxTurrets, turretDamage, turretRange } from '../utils/build.js';

// 건설 창 (B): 기지 영역 안에서만 열린다. 건물/포탑 탭, 비용 표시.
export class BuildMenu {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.gold = 0;
    this.tab = 'turret';

    const win = ui.createWindow({ id: 'build', title: '건설', key: 'KeyB', hotkeyLabel: 'B' });
    this.win = win;
    win.el.classList.add('win-left');
    win.canOpen = () => {
      if (baseAt(ctx.bases, ctx.player.position)) return true;
      ctx.bus.emit('notify', {
        text: ctx.bases.length ? '기지 영역 안에서만 건설할 수 있습니다' : '먼저 가방(I)에서 텐트 키트를 우클릭해 기지를 세우세요',
        kind: 'warn',
      });
      return false;
    };
    win.onOpen = () => this.render();

    win.body.innerHTML = `
      <nav class="tabs">
        <button type="button" data-tab="building">건물</button>
        <button type="button" data-tab="turret">포탑</button>
      </nav>
      <div class="build-list"></div>
      <footer class="inv-foot">
        <span class="gold"><i class="coin"></i><b data-build-gold>0</b></span>
        <span class="inv-hint" data-build-info></span>
      </footer>`;
    this.list = win.body.querySelector('.build-list');
    this.goldEl = win.body.querySelector('[data-build-gold]');
    this.infoEl = win.body.querySelector('[data-build-info]');

    win.body.querySelector('.tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]')?.dataset.tab;
      if (tab) { this.tab = tab; this.render(); }
    });
    this.list.addEventListener('click', (e) => {
      const card = e.target.closest('[data-turret]');
      if (!card || card.classList.contains('disabled')) return;
      ctx.bus.emit('build:start', { kind: 'turret', type: card.dataset.turret });
    });
    ctx.bus.on('gold:changed', ({ gold }) => {
      this.gold = gold;
      this.goldEl.textContent = gold.toLocaleString();
      if (ui.isOpen('build')) this.render();
    });
  }

  render() {
    const { ctx } = this;
    for (const b of this.win.body.querySelectorAll('[data-tab]')) b.classList.toggle('on', b.dataset.tab === this.tab);
    const base = baseAt(ctx.bases, ctx.player.position);
    if (!base) return;
    const stats = ctx.player.stats;
    const count = ctx.structures.filter((s) => s.kind === 'turret' && s.baseId === base.id).length;
    const max = maxTurrets(base, stats);
    this.infoEl.textContent = `${base.name} Lv${base.level} · 포탑 ${count}/${max}`;

    if (this.tab === 'building') {
      this.list.innerHTML = '<p class="empty">아직 지을 수 있는 건물이 없어요.<br>작업대·창고·상점은 곧 추가됩니다.</p>';
      return;
    }
    const cards = Object.entries(ctx.data.turrets).map(([id, t]) => {
      const locked = base.level < t.unlockBaseLevel;
      const cost = turretCost(t, stats);
      const full = count >= max;
      const poor = this.gold < cost;
      const why = locked ? `기지 Lv${t.unlockBaseLevel} 필요` : full ? '설치 수 가득' : poor ? '골드 부족' : '클릭해서 배치';
      return `
        <button type="button" class="build-card${locked || full || poor ? ' disabled' : ''}" data-turret="${id}">
          <i class="build-icon" style="--c:${t.color}"></i>
          <span class="build-text">
            <b>${t.name}</b>
            <small>${t.description}</small>
            <small class="stats">공격 ${+turretDamage(t, stats).toFixed(1)} · 사거리 ${+turretRange(t, stats).toFixed(1)} · 초당 ${t.fireRate}발 · 체력 ${t.hp}</small>
          </span>
          <span class="build-cost"><i class="coin"></i>${cost}<small>${why}</small></span>
        </button>`;
    });
    this.list.innerHTML = cards.join('');
  }
}
