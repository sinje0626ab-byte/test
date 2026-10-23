// 교주 이동: 키보드(방향키·WASD) 또는 누른 곳까지 길찾기. 두 씬(동네·성소)이 같이 쓴다.
import { idleFrame } from './people.js';
import { fatigueLimit } from '../sim/growth.js';
import { MOVE, TALK } from '../config.js';
import { findPath, walkable } from '../sim/grid.js';

const T = MOVE.tile;

export class Walker {
  constructor(scene, sprite, grid, textureKey, getVirtual = null) {
    this.scene = scene; this.sprite = sprite; this.g = grid; this.key = textureKey;
    this.getVirtual = getVirtual;   // 모바일 이동 스틱 { x, y } (-1~1)
    this.dir = 'down'; this.path = null; this.onArrive = null; this.follow = null;
    this.moved = 0;
    this.mark = null;               // 누른 곳 표시 (목적지 고리 · 따라가는 사람 발밑 고리)
    const kb = scene.input.keyboard;
    this.keys = kb.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D');
  }
  get tile() { return [Math.floor((this.sprite.x + 8) / T), Math.floor((this.sprite.y + 12) / T)]; }
  center() { return [this.sprite.x + 8, this.sprite.y + 8]; }

  // 다른 칸으로 가는 길 (onArrive: 도착하면 부름)
  goTo(tile, onArrive = null) {
    const p = findPath(this.g, this.tile, tile);
    if (!p) { this.showNoWay(tile); return false; }
    this.path = p; this.onArrive = onArrive; this.follow = null;
    this.showMark(p.length ? p[p.length - 1] : tile);
    return true;
  }
  // 움직이는 대상 따라가기 (getTile: 대상의 지금 칸) → 1칸 안이면 onArrive
  chase(getTile, onArrive, getPos = null) {
    this.follow = { getTile, onArrive, last: null, getPos };
    this.path = null; this.onArrive = null;
    this.showMark(getTile(), true);
  }
  stop() { this.path = null; this.follow = null; this.onArrive = null; this.hideMark(); }

  // ── 누른 곳 표시: 납작한 고리가 숨 쉬듯 커졌다 작아진다. 도착하거나 직접 움직이면 사라진다
  showMark(tile, person = false) {
    if (!tile) return;
    this.hideMark();
    const color = person ? 0xf0c020 : 0xffffff;
    const ring = this.scene.add.graphics();
    ring.lineStyle(3, 0x1d1b26, 0.85).strokeEllipse(0, 0, 16, 8);
    ring.lineStyle(1.5, color, 1).strokeEllipse(0, 0, 16, 8);
    ring.fillStyle(color, 0.3).fillEllipse(0, 0, 7, 3.5);
    // 고리 위에서 통통 튀는 작은 화살표 (어디로 가는지 멀리서도 보이게)
    const arrow = this.scene.add.graphics();
    arrow.fillStyle(0x1d1b26, 1).fillTriangle(-4, -3, 4, -3, 0, 2);
    arrow.fillStyle(color, 1).fillTriangle(-2.5, -2.2, 2.5, -2.2, 0, 0.8);
    arrow.setY(-9);
    const g = this.scene.add.container(tile[0] * T + 8, tile[1] * T + 12, [ring, arrow]).setDepth(90);
    const tw = [
      this.scene.tweens.add({ targets: ring, scaleX: 1.3, scaleY: 1.3, alpha: 0.6, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }),
      this.scene.tweens.add({ targets: arrow, y: -13, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }),
    ];
    this.mark = { g, tw, person };
  }
  hideMark() {
    if (!this.mark) return;
    for (const t of this.mark.tw) t.remove();
    this.mark.g.destroy(); this.mark = null;
  }
  // 갈 수 없는 곳: 빨간 X 가 잠깐
  showNoWay(tile) {
    this.hideMark();
    const g = this.scene.add.graphics();
    g.lineStyle(2, 0x1d1b26, 1).lineBetween(-4, -3, 4, 3).lineBetween(-4, 3, 4, -3);
    g.lineStyle(1, 0xe04030, 1).lineBetween(-4, -3, 4, 3).lineBetween(-4, 3, 4, -3);
    g.setPosition(tile[0] * T + 8, tile[1] * T + 10).setDepth(90);
    this.scene.tweens.add({ targets: g, alpha: 0, y: g.y - 4, duration: 700, delay: 250, onComplete: () => g.destroy() });
  }

  update(dt, allowed = true) {
    const k = this.keys;
    let vx = 0; let vy = 0;
    if (allowed) {
      if (k.LEFT.isDown || k.A.isDown) vx = -1;
      else if (k.RIGHT.isDown || k.D.isDown) vx = 1;
      if (k.UP.isDown || k.W.isDown) vy = -1;
      else if (k.DOWN.isDown || k.S.isDown) vy = 1;
      const v = this.getVirtual?.() ?? {};
      if (!vx && !vy && (v.x || v.y)) { vx = v.x; vy = v.y; }   // 모바일 스틱 (아날로그 방향)
    }
    if (vx || vy) { this.stop(); }
    else if (allowed && this.follow) {
      const t = this.follow.getTile();
      const [mx, my] = this.tile;
      if (!t || Math.abs(t[0] - mx) + Math.abs(t[1] - my) <= 1) {
        const cb = this.follow.onArrive; this.follow = null;
        this.hideMark(); this.idle(); if (t) cb?.(); return;
      }
      // 따라가는 사람 발밑으로 고리를 옮긴다
      if (this.mark?.person) {
        const p = this.follow.getPos?.();
        if (p) this.mark.g.setPosition(p[0], p[1]); else this.mark.g.setPosition(t[0] * T + 8, t[1] * T + 12);
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
      const step = this.speedPx() * dt;
      if (dist <= step) {
        this.sprite.x = tx; this.sprite.y = ty; this.path.shift();
        this.moved += 1;
        if (!this.path.length && !this.follow) { const cb = this.onArrive; this.onArrive = null; this.hideMark(); this.idle(); cb?.(); return; }
      } else { vx = dx / dist; vy = dy / dist; this.sprite.x += vx * step; this.sprite.y += vy * step; }
      this.face(vx, vy);
      return;
    }
    if (vx || vy) {
      const len = Math.hypot(vx, vy);
      const step = (this.speedPx() * dt) / len;
      this.tryMove(vx * step, 0);
      this.tryMove(0, vy * step);
      this.face(vx, vy);
      this.moved += (this.speedPx() * dt) / T;
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
    this.sprite.anims.timeScale = this.speedPx() / (2 * T);   // 걸음 박자 = 실제 속도 (초당 2칸에 8프레임)
  }
  idle() {
    this.sprite.anims.stop();
    this.sprite.setFrame(idleFrame(this.dir));
  }
  // 현실 1초당 칸 수 × 16px × 게임 배속 (멈춤 상태에서도 걷기는 1배)
  speedPx() {
    const app = this.scene.registry.get('app');
    const run = app?.running || app?.dpadRun;
    this.isRunning = !!run;
    return (run ? MOVE.playerRunTilesPerSecond : MOVE.playerTilesPerSecond) * T * Math.max(1, app?.speed ?? 1);
  }

  // 걸은 칸 수만큼 피로 (달리면 더)
  takeFatigue(s) {
    if (this.moved >= 1) {
      const n = Math.floor(this.moved);
      this.moved -= n;
      s.leader.fatigue = Math.min(fatigueLimit(s), s.leader.fatigue + n * (TALK.fatiguePerTile + (this.isRunning ? MOVE.runFatiguePerTile : 0)));
    }
  }
}
