import { turretDamage, turretRange, upgradeCost, upgradeItems, repairCost, demolishRefund } from '../utils/build.js';

// 포탑 관리 창 (포탑 앞에서 E): 업그레이드 · 수리 · 우선순위 · 철거
export class TurretWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.turret = null;
    this.gold = 0;
    this.confirmDemolish = false;

    const win = ui.createWindow({ id: 'turret', title: '포탑 관리' });
    win.el.classList.add('win-left');
    this.win = win;
    win.onClose = () => { this.turret = null; };
    // 멀리 걸어가면 닫는다.
    win.onUpdate = () => {
      const t = this.turret;
      if (t && ctx.player.position.distanceTo(t.position) > ctx.data.config.interact.range + t.radius + 3) ui.close('turret');
    };

    win.body.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      const t = this.turret;
      if (!act || !t) return;
      if (act === 'demolish' && !this.confirmDemolish) {
        this.confirmDemolish = true;
        this.render();
        return;
      }
      ctx.bus.emit(`turret:${act}`, { turret: t });
      if (act === 'demolish') ui.close('turret');
    });

    ctx.bus.on('interact:turret', ({ turret }) => {
      this.turret = turret;
      this.confirmDemolish = false;
      ui.open('turret');
      this.render();
    });
    ctx.bus.on('turret:changed', () => { if (this.turret) this.render(); });
    this.counts = {};
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const sl of slots) if (sl) this.counts[sl.id] = (this.counts[sl.id] ?? 0) + sl.count;
      if (this.turret) this.render();
    });
    ctx.bus.on('gold:changed', ({ gold }) => {
      this.gold = gold;
      if (this.turret) this.render();
    });
  }

  render() {
    const t = this.turret;
    const stats = this.ctx.player.stats;
    const def = t.def;
    const up = t.level < def.maxLevel ? upgradeCost(def, t.level) : null;
    const upItems = up != null ? upgradeItems(def, t.level) ?? [] : [];
    const itemsOk = upItems.every((c) => (this.counts[c.id] ?? 0) >= c.count);
    const itemsText = upItems.map((c) => `<span class="${(this.counts[c.id] ?? 0) >= c.count ? '' : 'bad'}">${this.ctx.data.items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}</span>`).join(' · ');
    const fix = repairCost(t);
    const refund = demolishRefund(t, stats, this.ctx.data.config.turret.demolishRefund);
    const line = (label, now, next) => `<dt>${label}</dt><dd>${now}${next != null ? ` <i>→ ${next}</i>` : ''}</dd>`;
    const dmg = (lv) => +turretDamage(def, stats, lv).toFixed(1);
    const rng = (lv) => +turretRange(def, stats, lv).toFixed(1);
    const hpAt = (lv) => Math.round(def.hp * (1 + def.hpPerLevel * (lv - 1)));
    const nx = up != null ? t.level + 1 : null;

    this.win.body.innerHTML = `
      <div class="tw">
        <div class="tw-head"><b>${def.name}</b><span class="lv-badge">Lv ${t.level}/${def.maxLevel}</span></div>
        <div class="bar hp"><div class="fill" style="width:${(t.stats.hp / t.stats.maxHp) * 100}%"></div><span>${Math.ceil(t.stats.hp)} / ${t.stats.maxHp}${t.alive ? '' : ' · 부서짐'}</span></div>
        <dl class="tw-stats">
          ${line('데미지', dmg(t.level), nx && dmg(nx))}
          ${line('사거리', rng(t.level), nx && rng(nx))}
          ${line('체력', t.stats.maxHp, nx && hpAt(nx))}
          ${line('초당 발사', def.fireRate, null)}
          ${def.splashRadius ? line('폭발 범위', def.splashRadius, null) : ''}
          ${def.onHit ? line('적중 효과', def.onHit.type === 'poison' ? `독 ${def.onHit.duration}초` : `감속 ${Math.round(def.onHit.amount * 100)}%`, null) : ''}
        </dl>
        <div class="tw-actions">
          <button type="button" data-act="upgrade" ${up == null || !t.alive || this.gold < up || !itemsOk ? 'disabled' : ''}>
            ${up == null ? '최고 레벨' : `업그레이드 <small><i class="coin"></i>${up}</small>`}</button>
          ${itemsText ? `<p class="tw-items">재료: ${itemsText}</p>` : ''}
          <button type="button" data-act="repair" ${fix <= 0 || this.gold < fix ? 'disabled' : ''}>
            ${fix <= 0 ? '멀쩡함' : `수리 <small><i class="coin"></i>${fix}</small>`}</button>
          <button type="button" data-act="priority">노리는 적: <b>${t.priority === 'nearest' ? '가장 가까운 적' : '체력 낮은 적'}</b></button>
          <button type="button" class="danger" data-act="demolish">${this.confirmDemolish ? `정말 철거? (골드 +${refund})` : '철거'}</button>
        </div>
        ${t.alive ? '' : '<p class="tw-note">부서진 포탑은 수리해야 다시 쏩니다.</p>'}
      </div>`;
  }
}
