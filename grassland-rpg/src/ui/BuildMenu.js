import { baseAt } from '../utils/bases.js';
import { turretCost, maxTurrets, turretDamage, turretRange, materialCost, structureHp, repairList } from '../utils/build.js';
import { itemIcon } from './icons.js';
import { buildArt } from './uiArt.js';
import { josa } from '../utils/josa.js';

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
        <button type="button" data-tab="merc">용병</button>
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
      const fix = e.target.closest('[data-repair-all]');
      if (fix && !fix.disabled) {
        ctx.bus.emit('turret:repair-all', { baseId: Number(fix.dataset.repairAll) });
        this.render();
        return;
      }
      const auto = e.target.closest('[data-auto-repair]');
      if (auto) {
        ctx.bus.emit('base:auto-repair', { baseId: Number(auto.dataset.autoRepair), on: auto.checked });
        return;
      }
      const hire = e.target.closest('[data-hire]');
      if (hire && !hire.disabled) { ctx.bus.emit('mercenary:hire', { baseId: Number(hire.dataset.base), role: hire.dataset.hire }); this.render(); return; }
      const fire = e.target.closest('[data-dismiss]');
      if (fire) {
        if (fire.dataset.confirm) { ctx.bus.emit('mercenary:dismiss', { baseId: Number(fire.dataset.base), role: fire.dataset.dismiss }); this.render(); }
        else { fire.dataset.confirm = '1'; fire.textContent = '정말 내보낼까요? (환불 없음)'; }
        return;
      }
      const vault = e.target.closest('[data-vault]');
      if (vault) { ctx.bus.emit('vault:withdraw', { baseId: Number(vault.dataset.vault) }); this.render(); return; }
      const up = e.target.closest('[data-upgrade-base]');
      if (up && !up.disabled) {
        ctx.bus.emit('base:upgrade', { baseId: Number(up.dataset.upgradeBase) });
        this.render();
        return;
      }
      const wall = e.target.closest('[data-wall-buy]');
      if (wall && !wall.disabled) {
        ctx.bus.emit('walls:buy', { baseId: baseAt(ctx.bases, ctx.player.position)?.id, type: wall.dataset.wallBuy, count: Number(wall.dataset.count) });
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
    ctx.bus.on('walls:changed', () => { if (ui.isOpen('build') && this.tab === 'building') this.render(); });
    ctx.bus.on('mercenary:changed', () => { if (ui.isOpen('build') && this.tab === 'merc') this.render(); });
    ctx.bus.on('turret:changed', () => { if (ui.isOpen('build')) this.render(); });
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

    if (this.tab === 'merc') {
      this.list.innerHTML = this.mercCards(base);
      return;
    }
    if (this.tab === 'building') {
      this.list.innerHTML = this.repairAllBar(base) + this.autoRepairBar(base) + this.baseUpgradeCard(base) + this.facilityCards(base) + this.wallCards(base);
      return;
    }
    const cards = Object.entries(ctx.data.turrets).map(([id, t]) => {
      const locked = base.level < t.unlockBaseLevel;
      const unlockName = ctx.data.buildings.baseLevels[String(t.unlockBaseLevel)].name;
      const cost = turretCost(t, stats);
      const full = count >= max;
      const lacks = !(t.buildItems ?? []).every((c) => (this.counts[c.id] ?? 0) >= c.count);
      const poor = this.gold < cost || lacks;
      const why = locked ? `${unlockName}(Lv${t.unlockBaseLevel}) 필요` : full ? '설치 수 가득' : lacks ? '재료 부족' : poor ? '골드 부족' : '클릭해서 배치';
      const mats = (t.buildItems ?? []).map((c) => `${ctx.data.items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}`).join(' · ');
      return `
        <button type="button" class="build-card${locked || full || poor ? ' disabled' : ''}" data-turret="${id}">
          ${buildArt(id)}
          <span class="build-text">
            <b>${t.name}</b>
            <small>${t.description}</small>
            <small class="stats">공격 ${+turretDamage(t, stats).toFixed(1)} · 사거리 ${+turretRange(t, stats).toFixed(1)} · 초당 ${t.fireRate}발 · 체력 ${t.hp}</small>
            ${mats ? `<small class="stats">+ ${mats}</small>` : ''}
          </span>
          <span class="build-cost"><i class="coin"></i>${cost}<small>${why}</small></span>
        </button>`;
    });
    this.list.innerHTML = this.repairAllBar(base) + cards.join('');
  }

  // 포탑 전체 수리: 이 기지에서 다친 포탑 모두 (골드가 모자라면 수리비 적은 것부터 가능한 만큼)
  repairAllBar(base) {
    const list = repairList(this.ctx.structures, base.id);
    if (!list.length) return '';
    const total = list.reduce((a, x) => a + x.cost, 0);
    const broken = list.filter((x) => !x.turret.alive).length;
    return `
      <div class="repair-all">
        <span><b>포탑 ${list.length}개가 다쳤어요</b><small>${broken ? `부서짐 ${broken}개 · ` : ''}수리비 적은 것부터 고쳐요</small></span>
        <button type="button" class="primary" data-repair-all="${base.id}" ${this.gold < list[0].cost ? 'disabled' : ''}>전체 수리 <small><i class="coin"></i>${total}</small></button>
      </div>`;
  }

  // 요새 옵션: 아침 자동 수리 (켜면 아침마다 수리비를 자동으로 낸다)
  autoRepairBar(base) {
    const need = this.ctx.data.config.base.autoRepairLevel;
    if (base.level < need) return '';
    return `
      <label class="auto-repair">
        <span><b>아침 자동 수리</b><small>아침마다 다친 포탑을 고쳐요 · 골드가 모자라면 수리비 적은 것부터</small></span>
        <input type="checkbox" class="switch" data-auto-repair="${base.id}" ${base.autoRepair ? 'checked' : ''}>
      </label>`;
  }

  // 부속 건물 카드: 해금 단계·비용(재료)·이미 지었는지
  facilityCards(base) {
    const { buildings, items } = this.ctx.data;
    return Object.entries(buildings.buildings).map(([id, f]) => {
      const built = this.ctx.structures.some((s) => s.kind === 'facility' && s.type === id && s.baseId === base.id);
      const noPlan = f.unlock && !this.ctx.unlocks?.has(f.unlock); // 부엉 박사의 설계도
      const locked = base.level < f.unlockBaseLevel || noPlan;
      const fcost = materialCost(f.cost, this.ctx.player.stats);
      const enough = fcost.every((c) => (this.counts[c.id] ?? 0) >= c.count);
      const cost = fcost.map((c) => `${items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}`).join(' · ');
      const why = built ? '이미 있음' : noPlan ? '설계도 필요 (퀘스트)' : locked ? `${buildings.baseLevels[String(f.unlockBaseLevel)].name} 필요` : enough ? '클릭해서 배치' : '재료 부족';
      return `
        <button type="button" class="build-card${built || locked || !enough ? ' disabled' : ''}" data-facility="${id}">
          ${buildArt(id)}
          <span class="build-text"><b>${f.name}</b><small>${f.description}</small><small class="stats">${cost}</small></span>
          <span class="build-cost"><small>${why}</small></span>
        </button>`;
    }).join('');
  }

  // 성벽 카드: 사면 기지 둘레 원에 한 칸씩 쌓인다 (+1 · +5 · 가득)
  wallCards(base) {
    const { buildings, items } = this.ctx.data;
    const ring = this.ctx.wallRing?.(base);
    if (!ring) return '';
    const head = `<div class="wall-ring-head"><b>성벽 ${ring.built}/${ring.total}칸</b><small>${ring.built >= ring.total ? '원이 다 둘러졌어요 (남쪽은 입구)' : '사면 뒤쪽부터 양옆으로 쌓여 남쪽 입구에서 만나요'}</small></div>`;
    return head + Object.entries(buildings.walls).map(([id, w]) => {
      const locked = base.level < w.unlockBaseLevel;
      const cost = materialCost(w.cost, this.ctx.player.stats);
      const can = Math.min(...cost.map((c) => Math.floor((this.counts[c.id] ?? 0) / c.count)));
      const swap = w.replaces ? ring.walls.filter((x) => x.type === w.replaces).length : 0;
      const room = ring.free.length + swap;
      const text = cost.map((c) => `${items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}`).join(' · ');
      const why = locked ? `${buildings.baseLevels[String(w.unlockBaseLevel)].name} 필요` : !room ? '가득 참' : can <= 0 ? '재료 부족' : `${Math.min(can, room)}칸까지 가능`;
      const btn = (n, label) => `<button type="button" class="wall-buy" data-wall-buy="${id}" data-count="${n}" ${locked || !room || can <= 0 ? 'disabled' : ''}>${label}</button>`;
      return `
        <div class="build-card wall-card${locked ? ' disabled' : ''}">
          ${buildArt(id)}
          <span class="build-text"><b>${w.name}</b><small>${w.description}</small><small class="stats">1칸: ${text} · 체력 ${w.hp}${swap ? ` · 바꿔 낄 울타리 ${swap}칸` : ''}</small></span>
          <span class="build-cost wall-btns">${btn(1, '+1칸')}${btn(5, '+5칸')}${btn(999, '가득')}<small>${why}</small></span>
        </div>`;
    }).join('');
  }

  // 기지 업그레이드 카드: 다음 단계 효과와 필요한 재료
  // 용병 탭: 금고 + 종류별 카드 (기지마다 종류별 1명)
  mercCards(base) {
    const c = this.ctx.data.config.mercenary;
    const hired = (this.ctx.mercenaries ?? []).filter((m) => m.base === base);
    const vault = base.vault ?? 0;
    const STATE = { idle: '쉬는 중', seek: '골드 주우러 가는 중', return: '금고로 가는 중', fight: '싸우는 중', repair: '수리하는 중' };
    const bar = `
      <div class="repair-all vault">
        <span><b>금고 ${vault.toLocaleString()} 골드</b><small>채집가가 주워 온 골드가 모여요</small></span>
        <button type="button" class="primary" data-vault="${base.id}" ${vault ? '' : 'disabled'}>꺼내기</button>
      </div>`;
    const cards = Object.entries(c.roles).map(([role, r]) => {
      const m = hired.find((x) => x.role === role);
      let status = '';
      if (m) {
        status = STATE[m.state] ?? '일하는 중';
        if (role === 'gatherer') status += ` · 들고 있는 골드 ${m.carry}/${c.gatherer.capacity}`;
        if (role === 'repairer' && m.fix) status += ` · ${m.fix.def?.name ?? '건물'} ${Math.floor((m.fix.stats.hp / m.fix.stats.maxHp) * 100)}%`;
      }
      return `
        <div class="build-card merc${m ? ' hired' : ''}">
          ${mercArt(role)}
          <span class="build-text"><b>${r.name}</b><small>${r.desc}</small>${m ? `<small class="stats">고용됨 · ${status}</small>` : ''}</span>
          <span class="build-cost">${m
    ? `<button type="button" class="danger merc-btn" data-dismiss="${role}" data-base="${base.id}">내보내기</button>`
    : `<button type="button" class="primary merc-btn" data-hire="${role}" data-base="${base.id}" ${this.gold < c.cost ? 'disabled' : ''}><i class="coin"></i>${c.cost.toLocaleString()}</button><small>${this.gold < c.cost ? '골드 부족' : '고용하기'}</small>`}</span>
        </div>`;
    }).join('');
    return bar + cards + '<p class="empty">용병은 쓰러지지 않고, 기지마다 종류별로 한 명씩 고용할 수 있어요.</p>';
  }

  baseUpgradeCard(base) {
    const { buildings, items, turrets } = this.ctx.data;
    const next = buildings.baseLevels[String(base.level + 1)];
    if (!next) return `<p class="empty">${josa(base.label, '은/는')} 이미 최고 단계(${base.name})예요.</p>`;
    const cur = buildings.baseLevels[String(base.level)];
    const stats = this.ctx.player.stats;
    const ncost = materialCost(next.cost, stats);
    const enough = ncost.every((c) => (this.counts[c.id] ?? 0) >= c.count);
    const unlocks = Object.values(turrets).filter((t) => t.unlockBaseLevel === base.level + 1).map((t) => t.name);
    const cost = ncost.map((c) => {
      const have = this.counts[c.id] ?? 0;
      return `<li class="${have >= c.count ? 'ok' : 'bad'}">${itemIcon(items.items[c.id])}${items.items[c.id].name} <b>${have}/${c.count}</b></li>`;
    }).join('');
    return `
      <div class="base-up">
        <div class="base-up-title"><b>${cur.name}</b> → <b>${next.name}</b> <small>기지 Lv${base.level + 1}</small></div>
        <ul class="base-up-eff">
          <li>기지 영역 ${cur.areaRadius}m → ${next.areaRadius}m</li>
          <li>포탑 설치 수 ${cur.maxTurrets} → ${next.maxTurrets}</li>
          <li>건물 체력 ${structureHp(cur.hp, stats)} → ${structureHp(next.hp, stats)}</li>
          ${unlocks.length ? `<li>새 포탑: ${unlocks.join(', ')}</li>` : ''}
        </ul>
        <ul class="base-up-cost">${cost}</ul>
        <button type="button" class="base-up-btn" data-upgrade-base="${base.id}" ${enough ? '' : 'disabled'}>${enough ? `${josa(next.name, '으로/로')} 올리기` : '재료가 부족해요'}</button>
      </div>`;
  }
}

// 용병 그림: 둥근 머리 + 직업 색 옷 + 도구 (활·검·망치)
function mercArt(role) {
  const COL = { gatherer: '#7cc67a', warrior: '#c9584e', repairer: '#e9a35b' };
  const TOOL = {
    gatherer: '<path d="M33 12c7 5 7 17 0 22" fill="none" stroke="#7c5236" stroke-width="2.6" stroke-linecap="round"/><path d="M33 12v22" stroke="#efe2bd" stroke-width="1"/>',
    warrior: '<path d="M30 33l10-18" stroke="#c9d3dd" stroke-width="3.4" stroke-linecap="round"/><path d="M28 29l5 3" stroke="#e0b34a" stroke-width="2.4" stroke-linecap="round"/>',
    repairer: '<path d="M31 34l7-14" stroke="#7c5236" stroke-width="2.6" stroke-linecap="round"/><rect x="33" y="14" width="10" height="6" rx="1.5" transform="rotate(25 38 17)" fill="#9ea1a3" stroke="#3b2d22" stroke-width="1.2"/>',
  };
  return `<svg class="build-svg" viewBox="0 0 48 48" aria-hidden="true">
    <ellipse cx="22" cy="43" rx="13" ry="3" fill="#3b2d22" opacity=".18"/>
    <path d="M10 42c0-10 5-16 12-16s12 6 12 16z" fill="${COL[role]}" stroke="#3b2d22" stroke-width="1.6"/>
    <circle cx="22" cy="17" r="9" fill="#f3d2b0" stroke="#3b2d22" stroke-width="1.6"/>
    <circle cx="19" cy="17" r="1.3" fill="#3b2d22"/><circle cx="25" cy="17" r="1.3" fill="#3b2d22"/>
    ${TOOL[role]}
  </svg>`;
}
