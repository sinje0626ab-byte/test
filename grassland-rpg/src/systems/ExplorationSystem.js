// 지도 안개: 월드를 칸으로 나눠 가 본 곳을 기록한다. 지역을 넘으면 알린다.
export class ExplorationSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.map;
    const b = ctx.data.config.world.bounds;
    this.bounds = b;
    this.cols = Math.ceil((b.maxX - b.minX) / this.cfg.cellSize);
    this.rows = Math.ceil((b.maxZ - b.minZ) / this.cfg.cellSize);
    this.cells = new Uint8Array(this.cols * this.rows);
    this.visited = new Set();
    this.region = null;
    this.timer = 0;
    const { bus } = ctx;

    bus.on('base:created', ({ base }) => this.reveal(base.position.x, base.position.z, base.areaRadius + 6));
    bus.on('player:teleport', ({ position }) => this.reveal(position.x, position.z, this.cfg.revealRadius));
    bus.on('save:collect', (save) => {
      save.exploration = { cells: Array.from(this.cells).join(''), visited: [...this.visited] };
    });
    bus.on('save:apply', (save) => {
      const e = save.exploration;
      if (e?.cells?.length === this.cells.length) {
        for (let i = 0; i < this.cells.length; i++) this.cells[i] = e.cells.charCodeAt(i) === 49 ? 1 : 0;
      }
      this.visited = new Set(e?.visited ?? []);
    });
    bus.on('save:loaded', () => {
      for (const b of ctx.bases) this.reveal(b.position.x, b.position.z, b.areaRadius + 6, true);
      this.region = null;
      this.emit();
    });
  }

  // 좌표 → 칸 번호 (밖이면 -1)
  index(x, z) {
    const c = Math.floor((x - this.bounds.minX) / this.cfg.cellSize);
    const r = Math.floor((z - this.bounds.minZ) / this.cfg.cellSize);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }

  reveal(x, z, radius, silent = false) {
    const cs = this.cfg.cellSize;
    let changed = false;
    for (let dz = -radius; dz <= radius; dz += cs / 2) {
      for (let dx = -radius; dx <= radius; dx += cs / 2) {
        if (dx * dx + dz * dz > radius * radius) continue;
        const i = this.index(x + dx, z + dz);
        if (i >= 0 && !this.cells[i]) { this.cells[i] = 1; changed = true; }
      }
    }
    if (changed && !silent) this.emit();
  }

  emit() {
    this.ctx.bus.emit('map:explored', { cells: this.cells, cols: this.cols, rows: this.rows });
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = this.cfg.revealInterval;
    const p = this.ctx.player.position;
    this.reveal(p.x, p.z, this.cfg.revealRadius);

    const region = this.ctx.world.regionAt(p.x, p.z);
    if (region === this.region) return;
    const initial = this.region === null;
    this.region = region;
    const first = !this.visited.has(region.id);
    this.visited.add(region.id);
    // 게임을 켰을 때 서 있는 지역은 조용히 넘어간다.
    if (!initial) this.ctx.bus.emit('region:entered', { id: region.id, name: region.name, first });
  }
}
