// 교주 이동: 키보드(방향키·WASD) 또는 누른 곳까지 길찾기. 두 씬(동네·성소)이 같이 쓴다.
import { MOVE, TALK } from '../config.js';
import { findPath, walkable } from '../sim/grid.js';

const T = MOVE.tile;

export class Walker {
  constructor(scene, sprite, grid, textureKey, getVirtual = null) {
    this.scene = scene; this.sprite = sprite; this.g = grid; this.key = textureKey;
    this.getVirtual = getVirtual;   // 모바일 방향키 패드 { up, down, left, right }
    this.dir = 'down'; this.path = null; this.onArrive = null; this.follow = null;
    this.moved = 0;
    const kb = scene.input.keyboard;
    this.keys = kb.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D');
  }
  get tile() { return [Math.floor((this.sprite.x + 8) / T), Math.floor((this.sprite.y + 12) / T)]; }
  center() { return [this.sprite.x + 8, this.sprite.y + 8]; }

  // 다른 칸으로 가는 길 (onArrive: 도착하면 부름)
  goTo(tile, onArrive = null) {
    const p = findPath(this.g, this.tile, tile);
    if (!p) return false;
    this.path = p; this.onArrive = onArrive; this.follow = null;
    return true;
  }
  // 움직이는 대상 따라가기 (getTile: 대상의 지금 칸) → 1칸 안이면 onArrive
  chase(getTile, onArrive) {
    this.follow = { getTile, onArrive, last: null };
    this.path = null; this.onArrive = null;
  }
  stop() { this.path = null; this.follow = null; this.onArrive = null; }

  update(dt, allowed = true) {
    const k = this.keys;
    let vx = 0; let vy = 0;
    if (allowed) {
      const v = this.getVirtual?.() ?? {};
      if (k.LEFT.isDown || k.A.isDown || v.left) vx = -1;
      else if (k.RIGHT.isDown || k.D.isDown || v.right) vx = 1;
      if (k.UP.isDown || k.W.isDown || v.up) vy = -1;
      else if (k.DOWN.isDown || k.S.isDown || v.down) vy = 1;
    }
    if (vx || vy) { this.stop(); }
    else if (allowed && this.follow) {
      const t = this.follow.getTile();
      const [mx, my] = this.tile;
      if (!t || Math.abs(t[0] - mx) + Math.abs(t[1] - my) <= 1) {
        const cb = this.follow.onArrive; this.follow = null;
        this.idle(); if (t) cb?.(); return;
      }
      if (!this.follow.last || this.follow.last[0] !== t[0] || this.follow.last[1] !== t[1] || !this.path?.length) {
        this.follow.last = t;
        this.path = findPath(this.g, this.tile, t) ?? [];
        if (this.path.length) this.path.pop();        // 그 사람 칸 바로 앞까지
      }
    }
    if (!vx && !vy && allowed && this.path?.length) {
      const [nx, ny] = this.path[0];
      const tx = nx * T; const ty = ny * T - 4;
      const dx = tx - this.sprite.x; const dy = ty - this.sprite.y;
      const dist = Math.hypot(dx, dy);
      const step = MOVE.playerSpeed * dt;
      if (dist <= step) {
        this.sprite.x = tx; this.sprite.y = ty; this.path.shift();
        this.moved += 1;
        if (!this.path.length && !this.follow) { const cb = this.onArrive; this.onArrive = null; this.idle(); cb?.(); return; }
      } else { vx = dx / dist; vy = dy / dist; this.sprite.x += vx * step; this.sprite.y += vy * step; }
      this.face(vx, vy);
      return;
    }
    if (vx || vy) {
      const len = Math.hypot(vx, vy);
      const step = (MOVE.playerSpeed * dt) / len;
      this.tryMove(vx * step, 0);
      this.tryMove(0, vy * step);
      this.face(vx, vy);
      this.moved += (MOVE.playerSpeed * dt) / T;
    } else this.idle();
  }

  // 발밑 사각형(가로 10px, 세로 5px)이 걸을 수 있는 칸에만 있게
  tryMove(dx, dy) {
    const nx = this.sprite.x + dx; const ny = this.sprite.y + dy;
    const pts = [[nx + 3, ny + 11], [nx + 12, ny + 11], [nx + 3, ny + 15], [nx + 12, ny + 15]];
    if (pts.every(([px, py]) => walkable(this.g, Math.floor(px / T), Math.floor(py / T)))) { this.sprite.x = nx; this.sprite.y = ny; }
  }

  face(vx, vy) {
    const dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : vy > 0 ? 'down' : 'up';
    this.dir = dir;
    const anim = `${this.key}-walk-${dir}`;
    if (this.sprite.anims.currentAnim?.key !== anim || !this.sprite.anims.isPlaying) this.sprite.play(anim, true);
  }
  idle() {
    this.sprite.anims.stop();
    this.sprite.setFrame(['down', 'left', 'right', 'up'].indexOf(this.dir) * 3);
  }
  // 걸은 칸 수만큼 피로
  takeFatigue(s) {
    if (this.moved >= 1) {
      const n = Math.floor(this.moved);
      this.moved -= n;
      s.leader.fatigue = Math.min(TALK.dailyFatigueLimit, s.leader.fatigue + n * TALK.fatiguePerTile);
    }
  }
}
