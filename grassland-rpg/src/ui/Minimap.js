// 미니맵: HUD 오른쪽 위(골드 아래) 둥근 지도. 지도 창과 같은 탐험 칸·지역 색을 쓰고,
// 기지·보스 둥지·주민·퀘스트 목표를 점으로. 플레이어는 가운데 (위 = 북쪽).
export class Minimap {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.minimap;
    this.explored = null;
    this.lairs = [];
    this.target = null;
    this.timer = 0;
    const el = document.createElement('div');
    el.className = 'minimap';
    el.innerHTML = '<canvas></canvas><b class="mm-n">N</b>';
    root.appendChild(el);
    this.el = el;
    this.canvas = el.querySelector('canvas');
    this.g = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    // 누르면 지도 창
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); ctx.input.press('KeyM'); });
    ctx.bus.on('map:explored', (e) => { this.explored = e; });
    ctx.bus.on('boss:status', ({ list }) => { this.lairs = list; });
    ctx.bus.on('quest:changed', ({ target }) => { this.target = target ?? null; });
  }

  resize() {
    const small = document.body.classList.contains('touch') && window.innerWidth <= 600;
    this.size = small ? this.cfg.mobileSize : this.cfg.size;
    this.canvas.width = this.canvas.height = this.size * 2;
    this.canvas.style.width = this.canvas.style.height = `${this.size}px`;
    this.g.setTransform(2, 0, 0, 2, 0, 0);
  }

  update(dt) {
    if (!this.sized) { this.sized = true; this.resize(); } // 터치 여부(body.touch)가 정해진 뒤 크기
    this.timer -= dt;
    if (this.timer > 0 || this.ctx.state === 'title') return;
    this.timer = this.cfg.redraw;
    this.draw();
  }

  draw() {
    const { g, size } = this;
    const { world, player, bases, npcs, data } = this.ctx;
    const b = data.config.world.bounds;
    const k = size / 2 / this.cfg.range; // m → px
    const cx = size / 2;
    const px = player.position.x;
    const pz = player.position.z;
    const at = (x, z) => [cx + (x - px) * k, cx + (z - pz) * k];
    g.clearRect(0, 0, size, size);
    g.save();
    g.beginPath();
    g.arc(cx, cx, cx, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = '#46423a';
    g.fillRect(0, 0, size, size);
    const ex = this.explored;
    if (ex) {
      const cs = data.config.map.cellSize;
      const c0 = Math.max(0, Math.floor((px - this.cfg.range - b.minX) / cs));
      const c1 = Math.min(ex.cols - 1, Math.floor((px + this.cfg.range - b.minX) / cs));
      const r0 = Math.max(0, Math.floor((pz - this.cfg.range - b.minZ) / cs));
      const r1 = Math.min(ex.rows - 1, Math.floor((pz + this.cfg.range - b.minZ) / cs));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (!ex.cells[r * ex.cols + c]) continue;
          const x = b.minX + c * cs;
          const z = b.minZ + r * cs;
          g.fillStyle = world.regionAt(x + cs / 2, z + cs / 2).mapColor;
          const [sx, sy] = at(x, z);
          g.fillRect(sx, sy, cs * k + 0.6, cs * k + 0.6);
        }
      }
    }
    const dot = (x, z, color, r, stroke) => {
      const [sx, sy] = at(x, z);
      g.fillStyle = color;
      g.beginPath();
      g.arc(sx, sy, r, 0, Math.PI * 2);
      g.fill();
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.5; g.stroke(); }
    };
    for (const base of bases) {
      const [sx, sy] = at(base.position.x, base.position.z);
      g.strokeStyle = 'rgba(255,255,255,0.5)';
      g.lineWidth = 1;
      g.beginPath();
      g.arc(sx, sy, base.areaRadius * k, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = '#e9835b';
      g.beginPath();
      g.moveTo(sx, sy - 5); g.lineTo(sx + 4.5, sy + 3.5); g.lineTo(sx - 4.5, sy + 3.5);
      g.closePath();
      g.fill();
    }
    const cs = data.config.map.cellSize;
    for (const l of this.lairs) {
      if (!l.lair) continue;
      const c = Math.floor((l.lair[0] - b.minX) / cs);
      const r = Math.floor((l.lair[1] - b.minZ) / cs);
      if (!ex || !ex.cells[r * ex.cols + c]) continue;
      dot(l.lair[0], l.lair[1], l.defeated ? '#9a958c' : '#d9403a', 4, '#fff');
    }
    for (const n of npcs ?? []) dot(n.position.x, n.position.z, n.def.color, 2.6, '#fff4d6');
    if (this.ctx.tomb) dot(this.ctx.tomb.position.x, this.ctx.tomb.position.z, '#9a958c', 3.5, '#ffcf5c');
    g.restore();
    // 퀘스트 목표: 안에 있으면 별, 밖이면 가장자리 화살표
    if (this.target) {
      const [tx, ty] = at(this.target[0], this.target[1]);
      const dx = tx - cx;
      const dy = ty - cx;
      const d = Math.hypot(dx, dy);
      g.fillStyle = '#ffcf5c';
      g.strokeStyle = '#7a5412';
      g.lineWidth = 1.2;
      if (d < cx - 6) {
        g.beginPath();
        g.arc(tx, ty, 4, 0, Math.PI * 2);
        g.fill();
        g.stroke();
      } else {
        const ex2 = cx + (dx / d) * (cx - 7);
        const ey2 = cx + (dy / d) * (cx - 7);
        g.save();
        g.translate(ex2, ey2);
        g.rotate(Math.atan2(dy, dx));
        g.beginPath();
        g.moveTo(6, 0); g.lineTo(-4, 4.5); g.lineTo(-4, -4.5);
        g.closePath();
        g.fill();
        g.stroke();
        g.restore();
      }
    }
    // 플레이어
    g.fillStyle = '#ff5f5f';
    g.strokeStyle = '#fff';
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(cx, cx, 3.5, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(cx, cx);
    g.lineTo(cx + player.facing.x * 8, cx + player.facing.z * 8);
    g.stroke();
  }
}
