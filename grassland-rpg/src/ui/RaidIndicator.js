import * as THREE from 'three';

const v = new THREE.Vector3();

// 습격 표시: 화면 위 "웨이브 2/3" 알약 + 습격당하는 기지가 멀면 화면 가장자리 방향 화살표
export class RaidIndicator {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.raid;
    const el = document.createElement('div');
    el.className = 'raid-ind';
    el.innerHTML = '<div class="raid-wave" hidden></div><div class="raid-arrows"></div>';
    root.appendChild(el);
    this.waveEl = el.querySelector('.raid-wave');
    this.arrowsEl = el.querySelector('.raid-arrows');
    this.arrows = new Map(); // baseId → element

    ctx.bus.on('raid:wave', ({ wave, waves, bloodMoon }) => {
      this.waveEl.hidden = !wave;
      this.waveEl.classList.toggle('blood', !!bloodMoon);
      if (wave) this.waveEl.textContent = `${bloodMoon ? '붉은 달' : '습격'} 웨이브 ${wave}/${waves}`;
    });
    ctx.bus.on('raid:end', () => {
      this.waveEl.hidden = true;
      this.sync([]);
    });
  }

  sync(list) {
    for (const [id, a] of this.arrows) {
      if (!list.some((r) => r.base.id === id)) { a.remove(); this.arrows.delete(id); }
    }
    for (const r of list) {
      if (this.arrows.has(r.base.id)) continue;
      const a = document.createElement('div');
      a.className = 'raid-arrow';
      a.innerHTML = `<i>▲</i><span>${r.base.label}</span>`;
      this.arrowsEl.appendChild(a);
      this.arrows.set(r.base.id, a);
    }
  }

  update() {
    const { player, camera } = this.ctx;
    const raids = (this.ctx.raids ?? []).filter((r) => r.status === 'active'
      && player.position.distanceTo(r.base.position) > r.base.areaRadius + this.cfg.arrowMinDistance);
    this.sync(raids);
    if (!raids.length) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    // HUD(위 패널·아래 퀵슬롯)를 피한 안쪽 사각형 가장자리에 둔다
    const box = { left: 46, right: w - 46, top: 140, bottom: h - 110 };
    const cx = w / 2;
    const cy = h / 2;
    for (const r of raids) {
      const a = this.arrows.get(r.base.id);
      // 화면 가운데에서 기지 쪽으로 향하는 방향 (화면 좌표)
      v.copy(r.base.position).project(camera);
      let dx = v.x;
      let dy = -v.y;
      if (v.z > 1) { dx = -dx; dy = -dy; } // 카메라 뒤쪽
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const kx = dx > 0 ? (box.right - cx) / dx : dx < 0 ? (box.left - cx) / dx : Infinity;
      const ky = dy > 0 ? (box.bottom - cy) / dy : dy < 0 ? (box.top - cy) / dy : Infinity;
      const k = Math.min(kx, ky);
      const x = cx + dx * k;
      const y = cy + dy * k;
      a.style.transform = `translate(${x}px, ${y}px)`;
      a.querySelector('i').style.transform = `rotate(${Math.atan2(dx, -dy)}rad)`;
    }
  }
}
