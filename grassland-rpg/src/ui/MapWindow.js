import { baseAt } from '../utils/bases.js';

const MAX_H = 480; // 지도 캔버스 최대 높이(px). 월드가 길면 그만큼 줄여 그린다.
let SCALE = 1.1;
const FOG = '#46423a';

// 지도 창 (M): 탐험한 곳, 기지 위치, 플레이어, 기지 목록과 빠른 이동
export class MapWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.explored = null;
    this.lairs = [];
    this.timer = 0;
    const b = ctx.data.config.world.bounds;
    this.bounds = b;
    SCALE = Math.min(1.1, MAX_H / (b.maxZ - b.minZ));
    this.w = Math.round((b.maxX - b.minX) * SCALE);
    this.h = Math.round((b.maxZ - b.minZ) * SCALE);

    const win = ui.createWindow({ id: 'map', title: '지도', key: 'KeyM', hotkeyLabel: 'M' });
    win.el.classList.add('win-center');
    win.body.innerHTML = `
      <div class="map">
        <canvas class="map-canvas" width="${this.w * 2}" height="${this.h * 2}" style="width:${this.w}px;height:${this.h}px"></canvas>
        <div class="map-side">
          <h3>기지</h3>
          <ul class="map-bases"></ul>
          <p class="map-hint" data-map-hint></p>
        </div>
      </div>`;
    this.canvas = win.body.querySelector('canvas');
    this.g = this.canvas.getContext('2d');
    this.g.scale(2, 2);
    this.list = win.body.querySelector('.map-bases');
    this.hint = win.body.querySelector('[data-map-hint]');
    win.onOpen = () => this.render();
    win.onUpdate = (dt) => {
      this.timer -= dt;
      if (this.timer > 0) return;
      this.timer = 0.3;
      this.draw();
    };

    this.list.addEventListener('click', (e) => {
      const id = e.target.closest('[data-travel]')?.dataset.travel;
      if (!id) return;
      ctx.bus.emit('base:travel', { baseId: Number(id) });
      this.render();
    });
    ctx.bus.on('map:explored', (e) => {
      this.explored = e;
      if (ui.isOpen('map')) this.draw();
    });
    ctx.bus.on('base:created', () => { if (ui.isOpen('map')) this.render(); });
    ctx.bus.on('boss:status', ({ list }) => { this.lairs = list; });
  }

  toMap(x, z) {
    return [(x - this.bounds.minX) * SCALE, (z - this.bounds.minZ) * SCALE];
  }

  draw() {
    const { g, bounds } = this;
    const { world, bases, player } = this.ctx;
    g.fillStyle = FOG;
    g.fillRect(0, 0, this.w, this.h);

    const ex = this.explored;
    const seen = new Set();
    if (ex) {
      const cs = this.ctx.data.config.map.cellSize;
      const px = cs * SCALE;
      for (let r = 0; r < ex.rows; r++) {
        for (let c = 0; c < ex.cols; c++) {
          if (!ex.cells[r * ex.cols + c]) continue;
          const x = bounds.minX + (c + 0.5) * cs;
          const z = bounds.minZ + (r + 0.5) * cs;
          const reg = world.regionAt(x, z);
          seen.add(reg);
          g.fillStyle = reg.mapColor;
          g.fillRect(c * px, r * px, px + 0.6, px + 0.6);
        }
      }
    }

    // 지역 이름 (가 본 지역만)
    g.font = '700 12px system-ui, sans-serif';
    g.textAlign = 'center';
    for (const reg of world.regions.list) {
      if (!seen.has(reg)) continue;
      const z = (Math.max(reg.zFrom, bounds.minZ) + Math.min(reg.zTo, bounds.maxZ)) / 2;
      const [mx, my] = this.toMap((bounds.minX + bounds.maxX) / 2, z);
      g.fillStyle = 'rgba(255,255,255,0.75)';
      g.fillText(reg.name, mx, my);
    }

    // 보스 둥지 (가 본 곳만, 처치했으면 회색)
    const cs = this.ctx.data.config.map.cellSize;
    for (const l of this.lairs) {
      const c = Math.floor((l.lair[0] - bounds.minX) / cs);
      const r = Math.floor((l.lair[1] - bounds.minZ) / cs);
      if (!ex || !ex.cells[r * ex.cols + c]) continue;
      const [mx, my] = this.toMap(l.lair[0], l.lair[1]);
      g.fillStyle = l.defeated ? '#9a958c' : '#d9403a';
      g.beginPath();
      g.arc(mx, my, 6, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#fff';
      g.font = '800 9px system-ui, sans-serif';
      g.fillText('보스', mx, my + 3);
      g.font = '700 10px system-ui, sans-serif';
      g.fillText(l.name, mx, my - 10);
    }

    for (const b of bases) {
      const [mx, my] = this.toMap(b.position.x, b.position.z);
      g.strokeStyle = 'rgba(255,255,255,0.6)';
      g.beginPath();
      g.arc(mx, my, b.areaRadius * SCALE, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = '#e9835b';
      g.beginPath();
      g.moveTo(mx, my - 7); g.lineTo(mx + 6, my + 5); g.lineTo(mx - 6, my + 5);
      g.closePath();
      g.fill();
      g.fillStyle = '#fff';
      g.font = '700 10px system-ui, sans-serif';
      g.fillText(`#${b.id}`, mx, my + 16);
    }

    const [px, py] = this.toMap(player.position.x, player.position.z);
    g.strokeStyle = '#fff';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(px + player.facing.x * 9, py + player.facing.z * 9);
    g.stroke();
    g.fillStyle = '#ff5f5f';
    g.beginPath();
    g.arc(px, py, 4.5, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.lineWidth = 1;
  }

  render() {
    const { bases, player, structures } = this.ctx;
    const here = baseAt(bases, player.position);
    this.list.innerHTML = bases.length
      ? bases.map((b) => {
        const turrets = structures.filter((s) => s.kind === 'turret' && s.baseId === b.id).length;
        const can = here && here !== b;
        return `
          <li class="${here === b ? 'here' : ''}">
            <span><b>${b.label}</b><small>${b.name} Lv${b.level} · 포탑 ${turrets}${here === b ? ' · 지금 여기' : ''}</small></span>
            <button type="button" data-travel="${b.id}" ${can ? '' : 'disabled'}>이동</button>
          </li>`;
      }).join('')
      : '<li class="empty">아직 기지가 없어요</li>';
    this.hint.textContent = here ? '다른 기지를 골라 바로 이동할 수 있어요' : '빠른 이동은 기지 영역 안에서만 할 수 있어요';
    this.draw();
  }
}
