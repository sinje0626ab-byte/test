import * as THREE from 'three';
import { Wall } from '../entities/Wall.js';
import { WallGrid } from '../world/WallGrid.js';
import { baseAt } from '../utils/bases.js';
import { materialCost } from '../utils/build.js';

const OK = 0x6fdc6f;
const BAD = 0xff6b6b;

// 벽(나무 울타리·돌담): 드래그로 한 줄 설치, 기지당 최대 maxPerBase칸, 몬스터만 막는다.
// PC: 누른 칸부터 뗀 칸까지 한 줄. 터치: 첫 탭 = 시작, 다음 탭 = 끝, "설치"로 정한다.
export class WallSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.walls;
    this.defs = ctx.data.buildings.walls;
    this.list = [];
    this.grid = new WallGrid(ctx.world, this.cfg);
    ctx.wallGrid = this.grid;
    this.placing = null;
    this.ghosts = [];
    this.counts = {};
    const { bus } = ctx;
    bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
    });
    bus.on('build:start', (e) => { if (e.kind === 'wall') this.start(e.type); else this.end(); });
    bus.on('player:died', () => this.end());
    bus.on('structure:destroyed', ({ structure }) => { if (structure.kind === 'wall') this.remove(structure); });
    bus.on('time:day', () => { for (const w of this.list) w.repairFull(); });
    bus.on('save:collect', (save) => {
      save.walls = this.list.map((w) => ({ type: w.type, baseId: w.baseId, cell: [w.cx, w.cz], hp: w.stats.hp }));
    });
    bus.on('save:apply', (save) => {
      for (const w of save.walls ?? []) if (this.defs[w.type]) this.add(w.type, w.baseId, w.cell[0], w.cell[1], w.hp);
      this.orientAll();
    });
  }

  add(type, baseId, cx, cz, hp) {
    const w = new Wall(this.ctx, type, baseId, cx, cz, hp);
    this.list.push(w);
    this.grid.set(w);
    this.ctx.structures.push(w);
    return w;
  }

  remove(w) {
    w.dispose();
    this.grid.delete(w);
    this.list = this.list.filter((x) => x !== w);
    const s = this.ctx.structures;
    const i = s.indexOf(w);
    if (i >= 0) s.splice(i, 1);
    this.orientAll();
  }

  // 위아래로 이웃이 있으면 세로 방향으로 돌린다
  orientAll() {
    for (const w of this.list) {
      const g = this.grid;
      const vertical = (g.get(w.cx, w.cz - 1) || g.get(w.cx, w.cz + 1)) && !(g.get(w.cx - 1, w.cz) || g.get(w.cx + 1, w.cz));
      w.orient(!!vertical);
    }
  }

  // ── 설치 모드 ─────────────────────────────
  start(type) {
    this.end();
    this.placing = { type, anchor: null, cursor: null, cells: [], check: { ok: false } };
    this.ctx.mode = 'build';
    this.ctx.input.consumeMouse();
  }

  end() {
    if (!this.placing) return;
    for (const g of this.ghosts) g.visible = false;
    this.placing = null;
    this.ctx.mode = 'play';
    this.ctx.bus.emit('build:hint', { text: '', ok: true });
  }

  ghost(i) {
    if (!this.ghosts[i]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.9, 0.96), new THREE.MeshBasicMaterial({ color: OK, transparent: true, opacity: 0.45, depthWrite: false }));
      m.position.y = 0.45;
      this.ctx.scene.add(m);
      this.ghosts[i] = m;
    }
    return this.ghosts[i];
  }

  // 두 칸 사이 한 줄 (대각선도 빈틈없이 4방향으로 잇는다)
  line(a, b) {
    const out = [{ x: a.x, z: a.z }];
    let { x, z } = a;
    const dx = Math.abs(b.x - a.x);
    const dz = Math.abs(b.z - a.z);
    const sx = Math.sign(b.x - a.x);
    const sz = Math.sign(b.z - a.z);
    let err = dx - dz;
    while ((x !== b.x || z !== b.z) && out.length < this.cfg.maxPerBase) {
      if (2 * err > -dz && x !== b.x) { err -= dz; x += sx; } else { err += dx; z += sz; }
      out.push({ x, z });
    }
    return out;
  }

  // 칸마다 되는지 + 전체가 되는지
  validate(cells) {
    const { world, bases, structures, player } = this.ctx;
    const def = this.defs[this.placing.type];
    const base = baseAt(bases, { x: cells[0].x + 0.5, z: cells[0].z + 0.5 });
    if (!base) return { ok: false, reason: '기지 영역 안에만 지을 수 있습니다', bad: cells.map(() => true) };
    if (base.level < def.unlockBaseLevel) return { ok: false, reason: `기지 Lv${def.unlockBaseLevel}부터 지을 수 있습니다`, bad: cells.map(() => true) };
    let adds = 0;
    const bad = cells.map((c) => {
      const x = c.x + 0.5;
      const z = c.z + 0.5;
      if (baseAt(bases, { x, z }) !== base) return true;
      const cur = this.grid.get(c.x, c.z);
      if (cur && cur.type !== def.replaces) return true;
      if (world.isBlocked(x, z, 0.4)) return true;
      if (structures.some((s) => s.kind !== 'wall' && Math.hypot(s.position.x - x, s.position.z - z) < s.radius + 0.6)) return true;
      if (Math.hypot(player.position.x - x, player.position.z - z) < 0.5 + player.radius) return true;
      if (!cur) adds += 1;
      return false;
    });
    const n = bad.filter((b) => !b).length;
    if (!n) return { ok: false, reason: '자리가 막혀 있습니다', bad };
    const have = this.grid.countFor(base.id);
    if (have + adds > this.cfg.maxPerBase) return { ok: false, reason: `기지마다 벽은 ${this.cfg.maxPerBase}칸까지 (지금 ${have}칸)`, bad };
    const cost = materialCost(def.cost, this.ctx.player.stats).map((c) => ({ id: c.id, count: c.count * n }));
    if (!cost.every((c) => (this.counts[c.id] ?? 0) >= c.count)) {
      const need = cost.map((c) => `${this.ctx.data.items.items[c.id].name} ${this.counts[c.id] ?? 0}/${c.count}`).join(' · ');
      return { ok: false, reason: `재료가 부족합니다 (${need})`, bad };
    }
    return { ok: true, base, cost, bad, n };
  }

  place() {
    const p = this.placing;
    const { bus } = this.ctx;
    if (!p.check.ok) {
      bus.emit('notify', { text: p.check.reason, kind: 'warn' });
      return;
    }
    const spend = { items: p.check.cost, ok: false };
    bus.emit('inventory:spend', spend);
    if (!spend.ok) return;
    p.cells.forEach((c, i) => {
      if (p.check.bad[i]) return;
      const cur = this.grid.get(c.x, c.z);
      if (cur) this.remove(cur); // 나무 울타리 → 돌담
      this.add(p.type, p.check.base.id, c.x, c.z);
    });
    this.orientAll();
    bus.emit('walls:placed', { count: p.check.n, type: p.type });
    bus.emit('notify', { text: `${this.defs[p.type].name} ${p.check.n}칸 설치`, kind: 'item' });
    p.anchor = null;
  }

  updatePlacing() {
    const p = this.placing;
    const { input, mouseGround, bus } = this.ctx;
    if (input.rightPressed || input.wasPressed('Escape') || input.wasPressed('BuildCancel')) {
      this.end();
      return;
    }
    const cell = mouseGround && { x: Math.floor(mouseGround.x), z: Math.floor(mouseGround.z) };
    if (input.touchMode) {
      if (input.leftPressed && cell) {
        if (!p.anchor) p.anchor = cell;
        p.cursor = cell;
      }
    } else {
      if (cell) p.cursor = cell;
      if (input.leftPressed && cell) p.anchor = cell;
    }
    if (!p.cursor) p.cursor = { x: Math.floor(this.ctx.player.position.x + this.ctx.player.facing.x * 2), z: Math.floor(this.ctx.player.position.z + this.ctx.player.facing.z * 2) };
    p.cells = this.line(p.anchor ?? p.cursor, p.cursor);
    p.check = this.validate(p.cells);
    this.ghosts.forEach((g) => { g.visible = false; });
    p.cells.forEach((c, i) => {
      const g = this.ghost(i);
      g.visible = true;
      g.position.set(c.x + 0.5, 0.45, c.z + 0.5);
      g.material.color.setHex(p.check.ok && !p.check.bad[i] ? OK : BAD);
    });
    const how = input.touchMode ? '탭: 시작점 → 탭: 끝점 → "설치"' : '끌어서 한 줄 · 놓으면 설치 · 우클릭/ESC: 취소';
    bus.emit('build:hint', { text: p.check.ok ? `${how} (${p.check.n}칸)` : p.check.reason, ok: p.check.ok });

    // PC: 누르고 끌다가 떼면 설치. 터치: "설치" 버튼
    const release = !input.touchMode && p.anchor && !input.mouseDown;
    if (release || (input.touchMode && input.wasPressed('BuildConfirm'))) {
      this.place();
      p.anchor = null;
    }
  }

  update(dt) {
    for (const w of this.list) w.update(dt);
    if (this.placing) this.updatePlacing();
  }
}
