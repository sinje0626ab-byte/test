import { turretInfo, upgradeCost, upgradeItems, repairCost, demolishRefund } from '../utils/build.js';

// 포탑 관리 창 (포탑 앞에서 E): 업그레이드 · 수리 · 우선순위(종류별 허용 목록 순환) · 철거. 열려 있는 동안 사거리 원
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
    win.onClose = () => {
      this.turret = null;
      ctx.bus.emit('turret:focus', { turret: null }); // 사거리 원 끄기
    };
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
      ctx.bus.emit('turret:focus', { turret }); // 이 포탑 사거리 원
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
    const line = (label, now, next) => `<dt>${label}</dt><dd>${now}${next != null && next !== now ? ` <i>→ ${next}</i>` : ''}</dd>`;
    const at = (lv) => turretInfo(def, stats, lv);
    const cur = at(t.level);
    const nx = up != null ? t.level + 1 : null;
    const nxt = nx && at(nx);
    // 실효 화력(초당, 방어 0 기준): 한 발 × 연사 × 발 수 (+ 독은 중첩 최대치)
    const dps = (i) => +(i.damage * i.fireRate * i.shots + (i.effect?.type === 'poison' ? i.effect.amount * i.effect.maxStacks : 0)).toFixed(1);
    const hpAt = (lv) => Math.round(t.stats.maxHp / (1 + def.hpPerLevel * (t.level - 1)) * (1 + def.hpPerLevel * (lv - 1)));
    // 특수 효과 한 줄
    const special = (i) => [
      i.shots > 1 && `${i.shots}발 동시`,
      i.pierce > 1 && `관통 ${i.pierce}마리`,
      i.armorPierce && `방어 관통 ${Math.round(i.armorPierce * 100)}%`,
      i.effect?.type === 'poison' && `독 초당 ${+i.effect.amount.toFixed(1)} ×${i.effect.maxStacks}중첩`,
      i.effect?.type === 'slow' && `감속 ${Math.round(i.effect.amount * 100)}%`,
      i.effect?.freeze && `빙결 ${Math.round(i.effect.freeze.chance * 100)}%`,
      def.splashRadius && `폭발 ${def.splashRadius}m`,
    ].filter(Boolean).join(' · ');
    const nextSpecial = nxt && special(nxt) !== special(cur) ? special(nxt) : null;

    this.win.body.innerHTML = `
      <div class="tw">
        <div class="tw-head"><b>${def.name}</b><span class="lv-badge">Lv ${t.level}/${def.maxLevel}</span></div>
        <div class="bar hp"><div class="fill" style="width:${(t.stats.hp / t.stats.maxHp) * 100}%"></div><span>${Math.ceil(t.stats.hp)} / ${t.stats.maxHp}${t.alive ? '' : ' · 부서짐'}</span></div>
        <dl class="tw-stats">
          ${line('초당 화력', dps(cur), nxt && dps(nxt))}
          ${line('한 발 피해', +cur.damage.toFixed(1), nxt && +nxt.damage.toFixed(1))}
          ${line('사거리', +cur.range.toFixed(1), nxt && +nxt.range.toFixed(1))}
          ${line('초당 발사', cur.fireRate, null)}
          ${line('체력', t.stats.maxHp, nx && hpAt(nx))}
        </dl>
        ${special(cur) || nextSpecial ? `<p class="tw-special">${special(cur) || '특수 효과 없음'}${nextSpecial ? `<i>다음 레벨: ${nextSpecial}</i>` : ''}</p>` : ''}
        <div class="tw-actions">
          <button type="button" data-act="upgrade" ${up == null || !t.alive || this.gold < up || !itemsOk ? 'disabled' : ''}>
            ${up == null ? '최고 레벨' : `업그레이드 <small><i class="coin"></i>${up}</small>`}</button>
          ${itemsText ? `<p class="tw-items">재료: ${itemsText}</p>` : ''}
          <button type="button" data-act="repair" ${fix <= 0 || this.gold < fix ? 'disabled' : ''}>
            ${fix <= 0 ? '멀쩡함' : `수리 <small><i class="coin"></i>${fix}</small>`}</button>
          <button type="button" data-act="priority" ${(def.priorities ?? []).length > 1 ? '' : 'disabled'}>노리는 적: <b>${this.ctx.data.config.turret.priorityLabels[t.priority] ?? t.priority}</b></button>
          <button type="button" class="danger" data-act="demolish">${this.confirmDemolish ? `정말 철거? (골드 +${refund})` : '철거'}</button>
        </div>
        ${t.alive ? '' : '<p class="tw-note">부서진 포탑은 수리해야 다시 쏩니다.</p>'}
      </div>`;
  }
}
