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
        <div class="hud-level"><span class="lv-badge">Lv <b data-lv>1</b></span></div>
        <div class="bar hp"><div class="fill" data-hp></div><span data-hp-text></span></div>
        <div class="bar st"><div class="fill" data-st></div></div>
        <div class="bar xp"><div class="fill" data-xp></div></div>
      </div>
      <div class="hud-tr">
        <div class="gold"><i class="coin"></i><b data-gold>0</b></div>
        <div class="saved" data-saved>저장됨</div>
      </div>
      <div class="hud-notify" data-notify></div>
      <div class="hud-float" data-float></div>
      <div class="hud-help">WASD 이동 · Shift 달리기 · 좌클릭 공격 · I 가방</div>
      <div class="hud-death" data-death hidden><div>쓰러졌습니다…</div><small>곧 시작 지점에서 일어납니다</small></div>
      <div class="hud-vignette" data-vignette></div>
    `;
    const $ = (sel) => root.querySelector(sel);
    this.el = {
      hp: $('[data-hp]'), hpText: $('[data-hp-text]'), st: $('[data-st]'), xp: $('[data-xp]'),
      gold: $('[data-gold]'), notify: $('[data-notify]'), float: $('[data-float]'),
      death: $('[data-death]'), vignette: $('[data-vignette]'), saved: $('[data-saved]'),
    };

    const { bus } = ctx;
    bus.on('gold:changed', ({ gold, delta }) => {
      this.el.gold.textContent = gold.toLocaleString();
      if (delta > 0) this.pulse(this.el.gold.parentElement);
    });
    bus.on('notify', (n) => this.notify(n));
    bus.on('save:done', () => this.pulse(this.el.saved, 'show'));
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
    const s = this.ctx.player.stats;
    this.el.hp.style.width = `${(s.hp / s.maxHp) * 100}%`;
    this.el.hpText.textContent = `${Math.ceil(s.hp)} / ${s.maxHp}`;
    this.el.st.style.width = `${(s.stamina / s.maxStamina) * 100}%`;
    this.el.xp.style.width = '0%'; // 레벨·경험치는 Phase 4

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
