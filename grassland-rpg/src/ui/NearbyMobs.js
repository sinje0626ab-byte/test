import { monsterPortrait } from './monsterPortrait.js';

const CALM = new Set(['wander', 'idle', 'flee']); // 그 밖 상태는 싸우는 중 (줄이 붉게)

// 가까운 몬스터 (미니맵 아래, 세로 휴대폰은 왼쪽 임무 알약 아래): 플레이어 둘레 config.nearby.range m 안 몬스터를 가까운 순으로 max 마리.
// 줄마다 초상화 · 이름(정예·보스·습격 표시) · 체력 막대 · 거리와 방향 화살표 (위 = 북쪽, 미니맵과 같다).
// 줄 요소는 다시 쓰고, 초상화는 종류가 바뀔 때만 바꾼다.
export class NearbyMobs {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.nearby ?? { range: 22, max: 4, refresh: 0.15 };
    this.el = document.createElement('div');
    this.el.className = 'near-mobs';
    this.el.hidden = true;
    root.appendChild(this.el);
    this.rows = [];
    this.timer = 0;
    this.placeTimer = 0;
  }

  row(i) {
    if (this.rows[i]) return this.rows[i];
    const el = document.createElement('div');
    el.className = 'nm-row';
    el.innerHTML = '<img class="nm-face" alt=""><div class="nm-main"><div class="nm-top"><b class="nm-name"></b><small class="nm-dist"><i class="nm-arrow"></i><span></span></small></div><div class="nm-bar"><i></i></div></div>';
    this.el.appendChild(el);
    const r = { el, face: el.querySelector('.nm-face'), name: el.querySelector('.nm-name'), dist: el.querySelector('.nm-dist span'), arrow: el.querySelector('.nm-arrow'), fill: el.querySelector('.nm-bar i'), type: null };
    this.rows[i] = r;
    return r;
  }

  // 미니맵 바로 아래 (미니맵 크기·자리는 화면마다 다르다). 세로 휴대폰은 오른쪽에 메뉴 단추가 있어서 왼쪽 임무 알약 아래
  place() {
    const portrait = document.body.classList.contains('touch') && window.innerWidth <= 600;
    const ref = document.querySelector(portrait ? '.mission-pill' : '.minimap');
    if (!ref) return;
    const r = ref.getBoundingClientRect();
    this.el.classList.toggle('left', portrait);
    this.el.style.top = `${Math.round(r.bottom + (portrait ? 8 : 10))}px`;
    this.el.style.left = portrait ? `${Math.round(r.left)}px` : '';
    this.el.style.right = portrait ? 'auto' : `${Math.round(window.innerWidth - r.right)}px`;
  }

  update(dt) {
    this.placeTimer -= dt;
    if (this.placeTimer <= 0) { this.placeTimer = 0.5; this.place(); }
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = this.cfg.refresh;
    const { player, monsters, state } = this.ctx;
    const touchSmall = document.body.classList.contains('touch') && window.innerWidth <= 600;
    const max = touchSmall ? Math.min(3, this.cfg.max) : this.cfg.max;
    const list = [];
    if (state === 'play' && player.alive) {
      const r2 = this.cfg.range * this.cfg.range;
      for (const m of monsters) {
        if (m.state === 'dead' || !m.alive || m.untargetable || m.stats.hp <= 0) continue;
        const dx = m.position.x - player.position.x;
        const dz = m.position.z - player.position.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < r2) list.push({ m, dx, dz, d: Math.sqrt(d2) });
      }
      list.sort((a, b) => (b.m.boss ? 1 : 0) - (a.m.boss ? 1 : 0) || a.d - b.d);
    }
    const n = Math.min(max, list.length);
    this.el.hidden = n === 0;
    for (let i = 0; i < Math.max(n, this.rows.length); i++) {
      if (i >= n) { if (this.rows[i]) this.rows[i].el.hidden = true; continue; }
      const { m, dx, dz, d } = list[i];
      const r = this.row(i);
      r.el.hidden = false;
      if (r.type !== m.type) {
        r.type = m.type;
        r.face.src = monsterPortrait(m.def, m.type);
        r.name.textContent = m.def.name;
      }
      r.el.className = `nm-row${m.boss ? ' boss' : m.elite ? ' elite' : ''}${m.raid ? ' raid' : ''}${CALM.has(m.state) ? '' : ' angry'}`;
      r.fill.style.width = `${Math.max(0, (m.stats.hp / m.stats.maxHp) * 100).toFixed(1)}%`;
      r.dist.textContent = `${Math.round(d)}m`;
      r.arrow.style.transform = `rotate(${Math.atan2(dx, -dz).toFixed(2)}rad)`;
    }
  }
}
