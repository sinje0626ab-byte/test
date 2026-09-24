import { baseAt } from '../utils/bases.js';
import { turretCost, maxTurrets, turretDamage, turretRange } from '../utils/build.js';

// 건설 창 (B): 기지 영역 안에서만 열린다. 건물/포탑 탭, 비용 표시.
export class BuildMenu {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.gold = 0;
    this.tab = 'turret';
    this.counts = {};
    this.ui = ui;

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
      const up = e.target.closest('[data-upgrade-base]');
      if (up && !up.disabled) {
        ctx.bus.emit('base:upgrade', { baseId: Number(up.dataset.upgradeBase) });
        this.render();
        return;
      }
      const fac = e.target.closest('[data-facility]');
      if (fac && !fac.classList.contains('disabled')) {
        ctx.bus.emit('build:start', { kind: 'facility', type: fac.dataset.facility });
        return;
      }
      const card = e.target.closest('[data-turret]');
      if (!card || card.classList.contains('disabled')) return;
      ctx.bus.emit('build:start', { kind: 'turret', type: card.dataset.turret });
    });
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
      if (ui.isOpen('build')) this.render();
    });
    ctx.bus.on('facility:changed', () => { if (ui.isOpen('build')) this.render(); });
    ctx.bus.on('interact:base', () => {
      this.tab = 'building';
      if (ui.isOpen('build')) this.render();
      else ui.open('build');
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
    this.infoEl.textContent = `${base.label} (${base.name} Lv${base.level}) · 포탑 ${count}/${max}`;

    if (this.tab === 'building') {
      this.list.innerHTML = this.baseUpgradeCard(base) + this.facilityCards(base);
      return;
    }
    const cards = Object.entries(ctx.data.turrets).map(([id, t]) => {
      const locked = base.level < t.unlockBaseLevel;
      const unlockName = ctx.data.buildings.baseLevels[String(t.unlockBaseLevel)].name;
      const cost = turretCost(t, stats);
      const full = count >= max;
      const poor = this.gold < cost;
      const why = locked ? `${unlockName}(Lv${t.unlockBaseLevel}) 필요` : full ? '설치 수 가득' : poor ? '골드 부족' : '클릭해서 배치';
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

  // 부속 건물 카드: 해금 단계·비용(재료)·이미 지었는지
  facilityCards(base) {
    const { buildings, items } = this.ctx.data;
    return Object.entries(buildings.buildings).map(([id, f]) => {
      const built = this.ctx.structures.some((s) => s.kind === 'facility' && s.type === id && s.baseId === base.id);
      const locked = base.level < f.unlockBaseLevel;
      const enough = f.cost.every((c) => (this.counts[c.id] ?? 0) >= c.count);
      const cost = f.cost.map((c) => `${items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}`).join(' · ');
      const why = built ? '이미 있음' : locked ? `${buildings.baseLevels[String(f.unlockBaseLevel)].name} 필요` : enough ? '클릭해서 배치' : '재료 부족';
      return `
        <button type="button" class="build-card${built || locked || !enough ? ' disabled' : ''}" data-facility="${id}">
          <i class="build-icon" style="--c:${f.color}"></i>
          <span class="build-text"><b>${f.name}</b><small>${f.description}</small><small class="stats">${cost}</small></span>
          <span class="build-cost"><small>${why}</small></span>
        </button>`;
    }).join('');
  }

  // 기지 업그레이드 카드: 다음 단계 효과와 필요한 재료
  baseUpgradeCard(base) {
    const { buildings, items, turrets } = this.ctx.data;
    const next = buildings.baseLevels[String(base.level + 1)];
    if (!next) return `<p class="empty">${base.label}은(는) 이미 최고 단계(${base.name})예요.</p>`;
    const cur = buildings.baseLevels[String(base.level)];
    const enough = next.cost.every((c) => (this.counts[c.id] ?? 0) >= c.count);
    const unlocks = Object.values(turrets).filter((t) => t.unlockBaseLevel === base.level + 1).map((t) => t.name);
    const cost = next.cost.map((c) => {
      const have = this.counts[c.id] ?? 0;
      return `<li class="${have >= c.count ? 'ok' : 'bad'}"><i class="item-icon" style="--c:${items.items[c.id].color}"></i>${items.items[c.id].name} <b>${have}/${c.count}</b></li>`;
    }).join('');
    return `
      <div class="base-up">
        <div class="base-up-title"><b>${cur.name}</b> → <b>${next.name}</b> <small>기지 Lv${base.level + 1}</small></div>
        <ul class="base-up-eff">
          <li>기지 영역 ${cur.areaRadius}m → ${next.areaRadius}m</li>
          <li>포탑 설치 수 ${cur.maxTurrets} → ${next.maxTurrets}</li>
          <li>건물 체력 ${cur.hp} → ${next.hp}</li>
          ${unlocks.length ? `<li>새 포탑: ${unlocks.join(', ')}</li>` : ''}
        </ul>
        <ul class="base-up-cost">${cost}</ul>
        <button type="button" class="base-up-btn" data-upgrade-base="${base.id}" ${enough ? '' : 'disabled'}>${enough ? `${next.name}(으)로 올리기` : '재료가 부족해요'}</button>
      </div>`;
  }
}
