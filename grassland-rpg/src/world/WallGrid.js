import { findPath } from '../utils/pathfind.js';

// 벽 칸 목록(ctx.wallGrid). WallSystem이 채우고, 몬스터가 충돌·길찾기에 읽는다.
export class WallGrid {
  constructor(world, cfg) {
    this.world = world;
    this.cfg = cfg;
    this.cells = new Map(); // "cx,cz" → Wall
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  get(cx, cz) {
    return this.cells.get(this.key(cx, cz));
  }

  set(wall) {
    this.cells.set(this.key(wall.cx, wall.cz), wall);
  }

  delete(wall) {
    if (this.get(wall.cx, wall.cz) === wall) this.cells.delete(this.key(wall.cx, wall.cz));
  }

  countFor(baseId) {
    let n = 0;
    for (const w of this.cells.values()) if (w.baseId === baseId) n += 1;
    return n;
  }

  // 벽 칸(정사각형) 밖으로 밀어낸다
  resolve(pos, radius) {
    if (!this.cells.size) return;
    const x0 = Math.floor(pos.x - radius);
    const x1 = Math.floor(pos.x + radius);
    const z0 = Math.floor(pos.z - radius);
    const z1 = Math.floor(pos.z + radius);
    for (let cx = x0; cx <= x1; cx++) {
      for (let cz = z0; cz <= z1; cz++) {
        if (!this.get(cx, cz)) continue;
        const nx = Math.max(cx, Math.min(cx + 1, pos.x));
        const nz = Math.max(cz, Math.min(cz + 1, pos.z));
        const dx = pos.x - nx;
        const dz = pos.z - nz;
        const d2 = dx * dx + dz * dz;
        if (d2 >= radius * radius) continue;
        if (d2 > 1e-8) {
          const d = Math.sqrt(d2);
          pos.x = nx + (dx / d) * radius;
          pos.z = nz + (dz / d) * radius;
        } else {
          // 칸 안에 들어와 있으면 가장 가까운 변 밖으로
          const opts = [[cx - radius - pos.x, 0], [cx + 1 + radius - pos.x, 0], [0, cz - radius - pos.z], [0, cz + 1 + radius - pos.z]];
          opts.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
          pos.x += opts[0][0];
          pos.z += opts[0][1];
        }
      }
    }
  }

  // 기지 둘레 격자에서 from → to 길 (벽·나무·바위 피해서). 막혔으면 null
  path(from, to, base) {
    const R = Math.ceil(base.areaRadius + this.cfg.pathMargin + 10);
    const bx = Math.floor(base.position.x);
    const bz = Math.floor(base.position.z);
    const bounds = { x0: bx - R, x1: bx + R, z0: bz - R, z1: bz + R };
    const blockedCache = new Map();
    const blocked = (cx, cz) => {
      const k = cx * 100000 + cz;
      let b = blockedCache.get(k);
      if (b === undefined) {
        b = !!this.get(cx, cz) || this.world.isBlocked(cx + 0.5, cz + 0.5, 0.35);
        blockedCache.set(k, b);
      }
      return b;
    };
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const s = { x: clamp(Math.floor(from.x), bounds.x0, bounds.x1), z: clamp(Math.floor(from.z), bounds.z0, bounds.z1) };
    const g = { x: clamp(Math.floor(to.x), bounds.x0, bounds.x1), z: clamp(Math.floor(to.z), bounds.z0, bounds.z1) };
    return findPath(s, g, blocked, bounds, this.cfg.maxPathNodes);
  }
}
