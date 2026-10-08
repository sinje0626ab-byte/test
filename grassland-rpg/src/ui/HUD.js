import * as THREE from 'three';
import { itemIcon } from './icons.js';
import { playerPortrait } from './playerPortrait.js';

const v = new THREE.Vector3();

// 항상 떠 있는 정보 (모양은 theme-rpg.css)
// - 좌상단: 초상화(금테) + 방패 레벨 배지, 이름, HP(잔상 바)·스태미나·경험치
// - 우상단: 해/달 다이얼 시계, 가죽 띠 골드, 미니맵
// - 아래: 액션바(퀵슬롯 1~5 + 스킬 Q·R, SkillBar 가 actionBar 에 붙는다)
// - 오른쪽 가운데: 토스트 알림 (최대 3개), 데미지 숫자(요소 풀 재사용)
const NOTE_MAX = 3;
const FLOAT_LIFE = 0.7;
export class HUD {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.floats = [];

    // HUD는 자기 층을 따로 쓴다 (창은 UIManager 층).
    root = document.createElement('div');
    root.className = 'hud';
    document.getElementById('ui').prepend(root);
    this.root = root;
    root.innerHTML = `
      <div class="hud-tl">
        <div class="hud-portrait"><img data-portrait alt=""><span class="lv-badge"><small>Lv</small><b data-lv>1</b></span></div>
        <div class="hud-main">
          <div class="hud-level"><b class="hud-name" data-hud-name></b><span class="sp-pip" data-sp hidden></span></div>
          <div class="bar hp"><div class="ghost" data-hp-ghost></div><div class="fill" data-hp></div><span data-hp-text></span></div>
          <div class="bar st"><div class="fill" data-st></div></div>
          <div class="bar xp"><div class="fill" data-xp></div></div>
          <div class="buffs" data-buffs></div>
        </div>
      </div>
      <div class="hud-tr">
        <div class="tr-row"><button type="button" class="menu-btn" data-menu aria-label="메뉴">☰</button><div class="clock" data-clock><i class="dial"><i class="dial-wheel" data-dial><i class="dial-sun"></i><i class="dial-moon"></i></i></i><b data-day>1일차</b><span data-until></span></div></div>
        <div class="gold"><i class="coin"></i><b data-gold>0</b></div>
        <div class="saved" data-saved>저장됨</div>
      </div>
      <div class="hud-notify" data-notify></div>
      <div class="hud-float" data-float></div>
      <div class="hud-banner" data-banner hidden></div>
      <div class="region-banner" data-region hidden></div>
      <div class="levelup" data-levelup hidden><i class="lu-glow"></i><b class="lu-title">LEVEL UP</b><b class="lu-lv"></b><small>스킬 포인트 +1 · 스킬 창에서 배워요</small></div>
      <div class="hud-interact" data-interact hidden></div>
      <div class="actionbar" data-actionbar><div class="quickbar" data-quick></div></div>
      <div class="bossbar" data-boss hidden><b data-boss-name></b><div class="bar"><div class="fill" data-boss-fill></div></div></div>
      <div class="hud-death" data-death hidden><div>쓰러졌습니다…</div><small>곧 시작 지점에서 일어납니다</small></div>
      <div class="hud-vignette" data-vignette></div>
    `;
    const $ = (sel) => root.querySelector(sel);
    this.el = {
      hp: $('[data-hp]'), hpText: $('[data-hp-text]'), st: $('[data-st]'), xp: $('[data-xp]'),
      gold: $('[data-gold]'), notify: $('[data-notify]'), float: $('[data-float]'),
      death: $('[data-death]'), vignette: $('[data-vignette]'), saved: $('[data-saved]'),
      clock: $('[data-clock]'), dial: $('[data-dial]'), day: $('[data-day]'), until: $('[data-until]'),
      banner: $('[data-banner]'), region: $('[data-region]'), levelup: $('[data-levelup]'), interact: $('[data-interact]'), quick: $('[data-quick]'),
      buffs: $('[data-buffs]'), portrait: $('[data-portrait]'), hpGhost: $('[data-hp-ghost]'), boss: $('[data-boss]'), bossName: $('[data-boss-name]'), bossFill: $('[data-boss-fill]'), lv: $('[data-lv]'), sp: $('[data-sp]'),
    };

    this.actionBar = $('[data-actionbar]');
    this.pool = []; // 데미지 숫자 요소 재사용
    this.hpGhost = 1;

    const { bus } = ctx;
    // 초상화: 외형·장비가 바뀔 때만 한 장 다시 찍는다 (같은 프레임에 여러 번 와도 한 번)
    const portrait = () => {
      if (this.portraitQueued) return;
      this.portraitQueued = true;
      requestAnimationFrame(() => {
        this.portraitQueued = false;
        this.el.portrait.src = playerPortrait(ctx.player);
      });
    };
    bus.on('player:named', portrait);
    bus.on('equipment:changed', portrait);
    bus.on('save:loaded', portrait);
    portrait();
    bus.on('gold:changed', ({ gold, delta }) => {
      this.el.gold.textContent = gold.toLocaleString();
      if (delta > 0) this.pulse(this.el.gold.parentElement);
    });
    bus.on('notify', (n) => this.notify(n));
    bus.on('buffs:changed', ({ list }) => {
      this.el.buffs.innerHTML = list.map((b) => `<span class="buff" title="${b.name}">${b.item ? itemIcon(this.ctx.data.items.items[b.item]) : `<i style="--c:${b.color}"></i>`}${Math.ceil(b.time)}</span>`).join('');
    });
    bus.on('settings:changed', ({ key, value }) => { if (key === 'damageNumbers') this.hideNumbers = !value; });
    bus.on('save:done', () => this.pulse(this.el.saved, 'show'));
    bus.on('stats:changed', ({ level, xp, xpToNext, skillPoints }) => {
      this.el.lv.textContent = level;
      this.el.xp.style.width = Number.isFinite(xpToNext) ? `${(xp / xpToNext) * 100}%` : '100%';
      this.el.sp.hidden = skillPoints <= 0;
      this.el.sp.innerHTML = `<span class="sp-long">스킬 </span>+${skillPoints}<span class="sp-long"> (K)</span>`; // 좁은 화면에선 '+5'만 (mobile.css)
    });
    bus.on('xp:gain', ({ amount, position }) => this.floatText({ position, amount: `+${amount} XP`, target: 'xp' }));
    // 퀵슬롯 (QuickslotSystem): 등록한 아이템 + 가방 개수. 탭 = 사용, 끌어서 다른 칸 = 바꾸기, 바 밖으로 = 비우기
    this.quick = [];
    this.invCounts = new Map();
    bus.on('quick:changed', ({ slots }) => { this.quick = slots; this.renderQuick(); });
    bus.on('inventory:changed', ({ slots }) => {
      this.invCounts = new Map();
      for (const sl of slots) if (sl) this.invCounts.set(sl.id, (this.invCounts.get(sl.id) ?? 0) + sl.count);
      this.renderQuick();
    });
    bus.on('equipment:changed', ({ slots }) => { this.equipped = new Set(Object.values(slots ?? {}).filter(Boolean)); this.renderQuick(); });
    root.querySelector('[data-menu]').addEventListener('click', () => bus.emit('pause:open'));
    this.bindQuickDrag();
    this.boss = null;
    // 이름 (+ 도감 칭호)
    const nameEl = root.querySelector('[data-hud-name]');
    let hudName = '';
    let hudTitle = null;
    const showName = () => { nameEl.textContent = hudTitle ? `${hudName} · ${hudTitle}` : hudName; };
    bus.on('player:named', ({ name }) => { hudName = name; showName(); });
    bus.on('player:title', ({ title }) => { hudTitle = title; showName(); });
    bus.on('boss:engaged', ({ boss }) => {
      this.boss = boss;
      this.el.bossName.textContent = boss.bdef?.name ?? boss.def.name;
      this.el.boss.hidden = false;
    });
    bus.on('boss:disengaged', ({ boss }) => {
      if (this.boss !== boss) return;
      this.boss = null;
      this.el.boss.hidden = true;
    });
    bus.on('boss:defeated', ({ name }) => this.banner(`${name} 처치!`, '큰 보상을 떨어뜨렸어요', 'level'));
    bus.on('interact:hint', ({ text }) => {
      document.body.classList.toggle('can-interact', !!text); // PC 커서: 손 모양
      this.el.interact.hidden = !text;
      this.el.interact.textContent = text;
    });
    bus.on('region:entered', ({ id, name, first }) => this.regionBanner(id, name, first));
    bus.on('stats:levelup', ({ level }) => {
      this.levelUp(level);
      this.pulse(this.el.lv.parentElement);
    });
    bus.on('raid:start', ({ count, bloodMoon }) => this.banner(bloodMoon ? '붉은 달의 습격!' : '밤 습격!', `몬스터 ${count}마리가 웨이브 3번에 나눠 옵니다`, 'night'));
    bus.on('time:day', ({ day }) => this.banner(`${day}일차 아침`, '', 'day'));
    bus.on('raid:result', ({ results }) => {
      const label = { cleared: '방어 성공', partial: '부분 피해', failed: '실패' };
      for (const r of results) {
        const reward = r.reward ? ` · 보상 골드 +${r.reward}` : '';
        const where = r.remote ? `${r.baseName} (원격)` : r.baseName;
        this.notify({ text: `[${where}] 습격 ${label[r.status]} — ${r.killed}/${r.total} 처치${reward}`, kind: r.status === 'cleared' ? 'gold' : 'warn' });
      }
    });
    bus.on('combat:hit', (h) => this.floatText(h));
    bus.on('player:damaged', () => this.pulse(this.el.vignette, 'hit'));
    bus.on('player:died', () => { this.el.death.hidden = false; });
    bus.on('player:respawned', () => { this.el.death.hidden = true; });
  }

  pulse(el, cls = 'pulse') {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  renderQuick() {
    const { items, config } = this.ctx.data;
    this.el.quick.innerHTML = Array.from({ length: config.quickslots }, (_, i) => {
      const id = this.quick[i];
      const def = id && items.items[id];
      if (!def) return `<div class="qslot" data-q="${i}"><kbd>${i + 1}</kbd></div>`;
      const n = this.invCounts.get(id) ?? 0;
      const worn = this.equipped?.has(id);
      const badge = def.category === 'equipment' ? (worn && !n ? '<b class="q-worn">E</b>' : '') : `<b class="count">${n}</b>`;
      return `<div class="qslot${n || worn ? '' : ' empty'}${worn ? ' worn' : ''}" data-q="${i}" title="${def.name}"><kbd>${i + 1}</kbd>${itemIcon(def)}${badge}</div>`;
    }).join('');
  }

  // 퀵슬롯 끌기: 놓은 곳이 다른 칸이면 바꾸고, 바 밖이면 비운다. 거의 안 움직이고 떼면 사용
  bindQuickDrag() {
    const bar = this.el.quick;
    const { bus } = this.ctx;
    const slotAt = (x, y) => document.elementFromPoint(x, y)?.closest?.('[data-q]');
    let drag = null;
    bar.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('[data-q]');
      if (!el) return;
      e.preventDefault();
      drag = { from: Number(el.dataset.q), x: e.clientX, y: e.clientY, moved: false, ghost: null, el };
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8 && this.quick[drag.from]) {
        drag.moved = true;
        drag.ghost = document.createElement('div');
        drag.ghost.className = 'drag-ghost';
        drag.ghost.innerHTML = drag.el.querySelector('svg')?.outerHTML ?? '';
        document.body.appendChild(drag.ghost);
        drag.el.classList.add('dragging');
      }
      if (drag.ghost) drag.ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    window.addEventListener('pointerup', (e) => {
      if (!drag) return;
      const d = drag;
      drag = null;
      d.ghost?.remove();
      d.el.classList.remove('dragging');
      if (!d.moved) { bus.emit('quick:use', { index: d.from }); return; }
      const to = slotAt(e.clientX, e.clientY);
      if (to && bar.contains(to)) {
        const t = Number(to.dataset.q);
        if (t !== d.from) bus.emit('quick:swap', { from: d.from, to: t });
      } else bus.emit('quick:clear', { index: d.from });
    });
  }

  banner(title, sub, kind) {
    const b = this.el.banner;
    b.className = `hud-banner ${kind}`;
    b.innerHTML = `<b>${title}</b>${sub ? `<small>${sub}</small>` : ''}`;
    b.hidden = false;
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => { b.hidden = true; }, 2800);
  }

  // 토스트: 오른쪽에서 미끄러져 들어온다. 아이콘 + 글자, 종류별 왼쪽 띠 색. 최대 3개 (오래된 것부터 사라짐)
  // 지역 진입: 화면 위 1/4, 큰 지역명 + 금색 장식선 + 위험도 별. 처음 3.5초, 다시 오면 작게 2초
  regionBanner(id, name, first) {
    const el = this.el.region;
    const diff = this.ctx.data.regions[id]?.difficulty ?? 1;
    const max = Math.max(4, ...Object.values(this.ctx.data.regions).map((r) => r.difficulty ?? 1));
    el.className = `region-banner${first ? ' first' : ''}`;
    el.innerHTML = `<b>${name}</b><small>위험도 <i>${'★'.repeat(diff)}</i>${'☆'.repeat(Math.max(0, max - diff))}</small>`;
    el.hidden = false;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
    el.style.animationDuration = first ? '3.5s' : '2s';
    clearTimeout(this.regionTimer);
    this.regionTimer = setTimeout(() => { el.hidden = true; }, first ? 3500 : 2000);
  }

  // 레벨업: 가운데 LEVEL UP + Lv 숫자, 방사형 빛 (레벨업 파티클·소리와 같은 순간)
  levelUp(level) {
    const el = this.el.levelup;
    el.querySelector('.lu-lv').textContent = `Lv ${level}`;
    el.hidden = false;
    el.classList.remove('play');
    void el.offsetWidth;
    el.classList.add('play');
    clearTimeout(this.levelTimer);
    this.levelTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  notify({ text, kind = 'info', color }) {
    const n = document.createElement('div');
    n.className = `note ${kind}`;
    n.innerHTML = `<i class="note-ic"></i><span></span>`;
    n.lastChild.textContent = text;
    if (color) n.style.setProperty('--accent', color);
    this.el.notify.append(n);
    while (this.el.notify.children.length > NOTE_MAX) this.el.notify.firstChild.remove();
    setTimeout(() => n.classList.add('out'), 2600);
    setTimeout(() => n.remove(), 3000);
  }

  // 데미지 숫자: 일반 흰색, 치명타 노랑 1.5배 + 흔들림, 플레이어 피격 빨강, 회복 초록, 포탑 피해는 작게
  floatText({ position, amount, crit, target, source }) {
    if (this.hideNumbers && target !== 'xp') return;
    let el = this.pool.pop();
    if (!el) {
      el = document.createElement('div');
      this.el.float.appendChild(el);
    }
    el.className = `dmg ${target}${crit ? ' crit' : ''}${source === 'turret' ? ' turret' : ''}${source === 'status' ? ' dot' : ''}`;
    el.textContent = crit ? `${amount}!` : `${amount}`;
    el.style.display = '';
    const pos = position.clone();
    pos.y += 1.4;
    pos.x += (Math.random() - 0.5) * 0.5;
    this.floats.push({ el, pos, age: 0, crit });
  }

  update(dt) {
    const input = this.ctx.input;
    for (let i = 0; i < this.quick.length; i++) {
      if (input.wasPressed(`Digit${i + 1}`)) this.ctx.bus.emit('quick:use', { index: i });
    }
    if (this.boss) {
      const parts = this.boss.parts ?? [this.boss];
      const sum = (f) => parts.reduce((a, b) => a + f(b.stats), 0);
      this.el.bossFill.style.width = `${(sum((s) => s.hp) / sum((s) => s.maxHp)) * 100}%`;
    }
    const s = this.ctx.player.stats;
    const hpPct = s.hp / s.maxHp;
    this.el.hp.style.width = `${hpPct * 100}%`;
    // 잔상 바: 줄어들 땐 잠깐 남았다가 따라가고(CSS 지연), 늘어날 땐 바로 맞춘다
    if (Math.abs(hpPct - this.hpGhost) > 1e-4) {
      this.el.hpGhost.classList.toggle('instant', hpPct > this.hpGhost);
      this.hpGhost = hpPct;
      this.el.hpGhost.style.width = `${hpPct * 100}%`;
    }
    this.el.hpText.textContent = `${Math.ceil(s.hp)} / ${s.maxHp}`;
    this.el.st.style.width = `${(s.stamina / s.maxStamina) * 100}%`;

    const t = this.ctx.time;
    const left = Math.ceil(t.untilChange);
    const p = this.ctx.player.position;
    this.el.day.textContent = `${t.day}일차 · ${this.ctx.world.regionAt(p.x, p.z).name}`;
    this.el.until.textContent = `${t.isNight ? '아침까지' : '밤까지'} ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    this.el.clock.classList.toggle('night', t.isNight);
    // 다이얼: 낮엔 해가, 밤엔 달이 왼쪽에서 떠서 꼭대기를 지나 오른쪽으로 진다
    const { dayLength } = t.cfg;
    const rot = t.isNight ? 90 + ((t.clock - dayLength) / (t.cycle - dayLength)) * 180 : -90 + (t.clock / dayLength) * 180;
    this.el.dial.style.transform = `rotate(${rot.toFixed(1)}deg)`;

    const cam = this.ctx.camera;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.age += dt;
      f.pos.y += dt * 1.2;
      v.copy(f.pos).project(cam);
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      // 튀어오르며 커졌다가 제 크기로, 치명타는 처음 0.25초 좌우로 흔들림. 끝 0.25초 동안 흐려짐
      const pop = 1 + Math.max(0, 0.18 - f.age) * 3;
      const shake = f.crit && f.age < 0.25 ? Math.sin(f.age * 90) * 4 * (1 - f.age / 0.25) : 0;
      f.el.style.transform = `translate(${x + shake}px, ${y}px) translate(-50%, -50%) scale(${pop})`;
      f.el.style.opacity = String(Math.min(1, (FLOAT_LIFE - f.age) / 0.25));
      if (f.age > FLOAT_LIFE) {
        f.el.style.display = 'none';
        this.pool.push(f.el);
        this.floats.splice(i, 1);
      }
    }
  }
}
