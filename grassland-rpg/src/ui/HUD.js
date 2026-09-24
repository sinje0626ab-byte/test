import * as THREE from 'three';

const v = new THREE.Vector3();

// 항상 떠 있는 정보: 좌상단 HP/스태미나/레벨, 우상단 골드, 알림, 데미지 숫자
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
        <div class="hud-level"><span class="lv-badge">Lv <b data-lv>1</b></span><span class="sp-pip" data-sp hidden></span></div>
        <div class="bar hp"><div class="fill" data-hp></div><span data-hp-text></span></div>
        <div class="bar st"><div class="fill" data-st></div></div>
        <div class="bar xp"><div class="fill" data-xp></div></div>
        <div class="buffs" data-buffs></div>
      </div>
      <div class="hud-tr">
        <div class="tr-row"><button type="button" class="menu-btn" data-menu aria-label="메뉴">☰</button><div class="clock" data-clock><i class="sun" data-sun></i><b data-day>1일차</b><span data-until></span></div></div>
        <div class="gold"><i class="coin"></i><b data-gold>0</b></div>
        <div class="saved" data-saved>저장됨</div>
      </div>
      <div class="hud-notify" data-notify></div>
      <div class="hud-float" data-float></div>
      <div class="hud-help" data-help>WASD 이동 · Shift 달리기 · Space 구르기 · 좌클릭 공격 · Q·R 스킬 · I 가방 · C 캐릭터 · K 스킬 · B 건설 · M 지도</div>
      <div class="hud-banner" data-banner hidden></div>
      <div class="hud-interact" data-interact hidden></div>
      <div class="quickbar" data-quick></div>
      <div class="bossbar" data-boss hidden><b data-boss-name></b><div class="bar"><div class="fill" data-boss-fill></div></div></div>
      <div class="hud-death" data-death hidden><div>쓰러졌습니다…</div><small>곧 시작 지점에서 일어납니다</small></div>
      <div class="hud-vignette" data-vignette></div>
    `;
    const $ = (sel) => root.querySelector(sel);
    this.el = {
      hp: $('[data-hp]'), hpText: $('[data-hp-text]'), st: $('[data-st]'), xp: $('[data-xp]'),
      gold: $('[data-gold]'), notify: $('[data-notify]'), float: $('[data-float]'),
      death: $('[data-death]'), vignette: $('[data-vignette]'), saved: $('[data-saved]'),
      clock: $('[data-clock]'), sun: $('[data-sun]'), day: $('[data-day]'), until: $('[data-until]'),
      help: $('[data-help]'), banner: $('[data-banner]'), interact: $('[data-interact]'), quick: $('[data-quick]'),
      buffs: $('[data-buffs]'), boss: $('[data-boss]'), bossName: $('[data-boss-name]'), bossFill: $('[data-boss-fill]'), lv: $('[data-lv]'), sp: $('[data-sp]'),
    };

    const { bus } = ctx;
    bus.on('gold:changed', ({ gold, delta }) => {
      this.el.gold.textContent = gold.toLocaleString();
      if (delta > 0) this.pulse(this.el.gold.parentElement);
    });
    bus.on('notify', (n) => this.notify(n));
    bus.on('buffs:changed', ({ list }) => {
      this.el.buffs.innerHTML = list.map((b) => `<span class="buff" title="${b.name}"><i style="--c:${b.color}"></i>${Math.ceil(b.time)}</span>`).join('');
    });
    bus.on('settings:changed', ({ key, value }) => { if (key === 'damageNumbers') this.hideNumbers = !value; });
    bus.on('save:done', () => this.pulse(this.el.saved, 'show'));
    bus.on('stats:changed', ({ level, xp, xpToNext, skillPoints }) => {
      this.el.lv.textContent = level;
      this.el.xp.style.width = Number.isFinite(xpToNext) ? `${(xp / xpToNext) * 100}%` : '100%';
      this.el.sp.hidden = skillPoints <= 0;
      this.el.sp.textContent = `스킬 +${skillPoints} (K)`;
    });
    bus.on('xp:gain', ({ amount, position }) => this.floatText({ position, amount: `+${amount} XP`, target: 'xp' }));
    // 퀵슬롯: 가방에 있는 소모품 종류를 순서대로 최대 N개
    this.quick = [];
    bus.on('inventory:changed', ({ slots }) => this.renderQuick(slots));
    root.querySelector('[data-menu]').addEventListener('click', () => bus.emit('pause:open'));
    // 퀵슬롯 탭/클릭으로도 사용
    this.el.quick.addEventListener('pointerdown', (e) => {
      const i = [...this.el.quick.children].indexOf(e.target.closest('.qslot'));
      if (i >= 0 && this.quick[i]) bus.emit('inventory:use-item', { item: this.quick[i] });
    });
    this.boss = null;
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
      this.el.interact.hidden = !text;
      this.el.interact.textContent = text;
    });
    bus.on('region:entered', ({ name, first }) => {
      if (first) this.banner(`${name}`, '처음 와 보는 곳이에요', 'day');
      else this.notify({ text: `${name}에 들어섰습니다`, kind: 'info' });
    });
    bus.on('stats:levelup', ({ level }) => {
      this.banner(`레벨 업! Lv ${level}`, '스킬 포인트 +1 · 스킬 창(K)에서 배워요', 'level');
      this.pulse(this.el.lv.parentElement);
    });
    this.helpText = this.el.help.textContent;
    bus.on('build:hint', ({ text, ok }) => {
      this.el.help.textContent = text || this.helpText;
      this.el.help.classList.toggle('bad', !!text && !ok);
    });
    bus.on('raid:start', ({ count }) => this.banner('밤 습격!', `몬스터 ${count}마리가 기지로 옵니다`, 'night'));
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

  renderQuick(slots) {
    const { items, config } = this.ctx.data;
    const counts = new Map();
    for (const s of slots) {
      if (!s || items.items[s.id].category !== 'consumable') continue;
      counts.set(s.id, (counts.get(s.id) ?? 0) + s.count);
    }
    this.quick = [...counts.keys()].slice(0, config.quickslots);
    this.el.quick.innerHTML = Array.from({ length: config.quickslots }, (_, i) => {
      const id = this.quick[i];
      const def = id && items.items[id];
      return `<div class="qslot"><kbd>${i + 1}</kbd>${def ? `<i class="item-icon" style="--c:${def.color}"></i><b class="count">${counts.get(id)}</b>` : ''}</div>`;
    }).join('');
  }

  banner(title, sub, kind) {
    const b = this.el.banner;
    b.className = `hud-banner ${kind}`;
    b.innerHTML = `<b>${title}</b>${sub ? `<small>${sub}</small>` : ''}`;
    b.hidden = false;
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => { b.hidden = true; }, 2800);
  }

  notify({ text, kind = 'info', color }) {
    const n = document.createElement('div');
    n.className = `note ${kind}`;
    n.textContent = text;
    if (color) n.style.setProperty('--accent', color);
    this.el.notify.prepend(n);
    while (this.el.notify.children.length > 5) this.el.notify.lastChild.remove();
    setTimeout(() => n.classList.add('out'), 2200);
    setTimeout(() => n.remove(), 2700);
  }

  floatText({ position, amount, crit, target }) {
    if (this.hideNumbers && target !== 'xp') return;
    const el = document.createElement('div');
    el.className = `dmg ${target}${crit ? ' crit' : ''}`;
    el.textContent = crit ? `${amount}!` : `${amount}`;
    this.el.float.appendChild(el);
    const pos = position.clone();
    pos.y += 1.4;
    pos.x += (Math.random() - 0.5) * 0.5;
    this.floats.push({ el, pos, age: 0 });
  }

  update(dt) {
    const input = this.ctx.input;
    for (let i = 0; i < this.quick.length; i++) {
      if (input.wasPressed(`Digit${i + 1}`)) this.ctx.bus.emit('inventory:use-item', { item: this.quick[i] });
    }
    if (this.boss) {
      const parts = this.boss.parts ?? [this.boss];
      const sum = (f) => parts.reduce((a, b) => a + f(b.stats), 0);
      this.el.bossFill.style.width = `${(sum((s) => s.hp) / sum((s) => s.maxHp)) * 100}%`;
    }
    const s = this.ctx.player.stats;
    this.el.hp.style.width = `${(s.hp / s.maxHp) * 100}%`;
    this.el.hpText.textContent = `${Math.ceil(s.hp)} / ${s.maxHp}`;
    this.el.st.style.width = `${(s.stamina / s.maxStamina) * 100}%`;

    const t = this.ctx.time;
    const left = Math.ceil(t.untilChange);
    const p = this.ctx.player.position;
    this.el.day.textContent = `${t.day}일차 · ${this.ctx.world.regionAt(p.x, p.z).name}`;
    this.el.until.textContent = `${t.isNight ? '아침까지' : '밤까지'} ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    this.el.clock.classList.toggle('night', t.isNight);

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
      f.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${1 + Math.max(0, 0.25 - f.age) * 2})`;
      f.el.style.opacity = String(Math.min(1, 2.5 - f.age * 3));
      if (f.age > 0.8) {
        f.el.remove();
        this.floats.splice(i, 1);
      }
    }
  }
}
