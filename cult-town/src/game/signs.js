// 맞는 에셋이 없는 것들을 도형으로 그린다. 모두 스프라이트 키로 부른다:
// 나중에 같은 키의 이미지를 로드하면 (scene.textures.exists(key)) 도형 대신 그 이미지를 쓴다.
import Phaser from 'phaser';
import { PLACES } from '../data/places.js';
import { SHOPS } from '../data/shops.js';

const T = 16;
const FONT = { fontFamily: 'Galmuri11', fontSize: '12px', color: '#ffffff' };
const SIGN_FONT = { fontFamily: 'Galmuri7', fontSize: '8px', color: '#ffffff' };
const PLACE_COLORS = {
  shop: 0x2f5d8a, work: 0x555a66, religion: 0x7a2e2a, ours: 0x5b3a7a, home: 0x6a5a3a, leisure: 0x3e7a4e, transit: 0x3cb44a,
};
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
const hash = (n) => { let h = Math.imul(n + 1, 2654435761) >>> 0; h = (h ^ (h >>> 13)) >>> 0; return h; };

// 간판 판 하나 (가운데 x, 위 y)
export function board(scene, cx, top, text, color, { depth = 60, fg = 0xffffff, small = false } = {}) {
  const t = scene.add.text(0, 0, text, { ...SIGN_FONT, color: hex(fg) }).setOrigin(0.5, 0);
  const w = Math.ceil(t.width) + 4; const hgt = small ? 9 : 10;
  t.setY(small ? 0 : 1);
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRect(-w / 2 - 1, -1, w + 2, hgt + 2);
  g.fillStyle(color, 1).fillRect(-w / 2, 0, w, hgt);
  g.fillStyle(0xffffff, 0.18).fillRect(-w / 2, 0, w, 2);
  return scene.add.container(cx, top + 1, [g, t]).setDepth(depth);
}

// 건물 하나의 간판들 (layout 의 kind·place·shop·signs 를 보고)
export function drawBuildingSigns(scene, b) {
  const key = `sign.${b.place ?? b.shop ?? b.i}`;
  if (scene.textures.exists(key)) { scene.add.image((b.door + 0.5) * T, (b.y + b.roofH) * T, key).setOrigin(0.5, 0).setDepth(60); return; }
  const facadeTop = b.y + b.roofH;
  const bottom = b.y + b.h - 1;
  const cx = (b.x + b.w / 2) * T;
  if (b.kind === 'mall' && b.signs) {
    // 층마다 작은 간판 (왼쪽), 건물 이름은 지붕 끝에
    b.signs.forEach((id, k) => {
      if (!id) return;
      const s = SHOPS[id];
      board(scene, (b.x + 1.6) * T, (facadeTop + k) * T + 1, s.sign, s.color, { small: true });
    });
    if (b.place) {
      const p = PLACES[b.place];
      board(scene, cx, (facadeTop - 1) * T + 2, b.place === 'sanctuary' ? '동림상가' : p.short === 'PC방' ? p.name : p.name, PLACE_COLORS[p.type] ?? 0x555555);
    }
    return;
  }
  if (b.shop) {
    const s = SHOPS[b.shop];
    board(scene, cx, (b.floors >= 2 ? bottom - 1 : bottom) * T + 1, s.sign, s.color);
    return;
  }
  if (b.place) {
    const p = PLACES[b.place];
    const label = p.name.replace(' 신림역점', '');
    if (p.type === 'home') board(scene, (b.door + 0.5) * T, (bottom - 1) * T + 2, label, PLACE_COLORS.home, { small: true });
    else board(scene, cx, (b.floors >= 2 ? bottom - 1 : bottom) * T + 1, label, PLACE_COLORS[p.type] ?? 0x555555);
  }
}

// 지붕 위: 물탱크 · 실외기 · 빨래줄 (건물마다 정해진 무늬)
export function drawRoof(scene, b) {
  const g = scene.add.graphics().setDepth(5);
  const h = hash(b.i * 7 + 3);
  const top = b.y * T; const left = b.x * T;
  const roofPx = b.roofH * T; const wPx = b.w * T;
  if (b.roofH >= 2 && b.w >= 4) {
    // 물탱크 (초록·파랑 원통)
    const tx = left + (h % 2 ? 4 : wPx - 18); const ty = top + 3;
    const c = h % 3 === 0 ? 0x3a7aa8 : 0x3a9a5a;
    g.fillStyle(0x1d1b26, 1).fillRect(tx - 1, ty - 1, 16, 14);
    g.fillStyle(c, 1).fillRect(tx, ty + 2, 14, 10);
    g.fillStyle(0xffffff, 0.25).fillRect(tx + 2, ty + 3, 3, 8);
    g.fillStyle(c, 1).fillEllipse(tx + 7, ty + 2, 14, 5);
    g.fillStyle(0x1d1b26, 0.4).fillRect(tx + 5, ty, 4, 2);
  }
  // 실외기 1~2개
  const n = 1 + (h >>> 3) % 2;
  for (let k = 0; k < n; k++) {
    const ax = left + 6 + ((h >>> (5 + k * 3)) % Math.max(1, b.w - 1)) * T * 0.8;
    const ay = top + roofPx - 12 - (k % 2) * 4;
    if (ax > left + wPx - 14) continue;
    g.fillStyle(0x1d1b26, 1).fillRect(ax - 1, ay - 1, 13, 10);
    g.fillStyle(0xd8d8d0, 1).fillRect(ax, ay, 11, 8);
    g.lineStyle(1, 0x7a7a72, 1).strokeCircle(ax + 4, ay + 4, 2.5);
    g.fillStyle(0x9a9a92, 1).fillRect(ax + 8, ay + 2, 2, 4);
  }
  // 빨래줄
  if (b.roofH >= 3 && (h >>> 9) % 2 === 0 && b.w >= 5) {
    const ly = top + roofPx / 2 + 2; const lx0 = left + 6; const lx1 = left + wPx - 8;
    g.lineStyle(1, 0x4a4a4a, 1).lineBetween(lx0, ly, lx1, ly);
    const colors = [0xe85a5a, 0xf0f0f0, 0x5a8ae8, 0xf0d040, 0x6ac86a];
    for (let x = lx0 + 4, k = 0; x < lx1 - 4; x += 9, k++) {
      g.fillStyle(colors[(h + k) % colors.length], 1).fillRect(x, ly + 1, 6, 6 + (k % 2) * 2);
    }
  }
  return g;
}

// 골목 도형 소품 (분리수거함·자전거·실외기)
export function drawShapeProp(scene, key, px, py) {
  if (scene.textures.exists(key)) return scene.add.image(px, py, key).setOrigin(0, 0).setDepth(100 + py + 12);
  const g = scene.add.graphics({ x: px, y: py }).setDepth(100 + py + 12);
  if (key === 'prop.recycle') {
    const cols = [0x3a8a4a, 0x3a6ac8, 0xd8a020];
    cols.forEach((c, k) => {
      g.fillStyle(0x1d1b26, 1).fillRect(k * 5, 5, 6, 11);
      g.fillStyle(c, 1).fillRect(k * 5 + 1, 6, 4, 9);
      g.fillStyle(0xffffff, 0.35).fillRect(k * 5 + 1, 6, 4, 2);
    });
  } else if (key === 'prop.bike') {
    g.lineStyle(2, 0x1d1b26, 1).strokeCircle(4, 11, 3.5).strokeCircle(12, 11, 3.5);
    g.lineStyle(1, 0xc83a3a, 1).lineBetween(4, 11, 8, 6).lineBetween(8, 6, 12, 11).lineBetween(8, 6, 7, 3);
    g.lineStyle(1, 0x4a4a4a, 1).lineBetween(11, 4, 13, 4);
  } else if (key === 'prop.ac') {
    g.fillStyle(0x1d1b26, 1).fillRect(2, 5, 13, 10);
    g.fillStyle(0xe0e0d8, 1).fillRect(3, 6, 11, 8);
    g.lineStyle(1, 0x8a8a82, 1).strokeCircle(7, 10, 2.5);
    g.fillStyle(0x9a9a92, 1).fillRect(11, 8, 2, 4);
  }
  return g;
}

// 전봇대 사이 전선 (같은 골목 줄에서 이웃한 전봇대끼리)
export function drawWires(scene, poles) {
  const g = scene.add.graphics().setDepth(5100);
  const byRow = new Map();
  for (const [x, y] of poles) { if (!byRow.has(y)) byRow.set(y, []); byRow.get(y).push(x); }
  for (const [y, xs] of byRow) {
    xs.sort((a, b) => a - b);
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i]; const b = xs[i + 1];
      if (b - a > 14) continue;
      for (const [dy, sag] of [[-2 * T + 5, 6], [-2 * T + 9, 8]]) {
        const x0 = a * T + 8; const x1 = b * T + 8; const y0 = y * T + dy;
        const curve = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(x0, y0), new Phaser.Math.Vector2((x0 + x1) / 2, y0 + sag), new Phaser.Math.Vector2(x1, y0));
        g.lineStyle(1, 0x26222e, 0.9);
        curve.draw(g, 16);
      }
    }
  }
  return g;
}

export function drawStationExit(scene, key, x, y, label) {
  if (scene.textures.exists(key)) return scene.add.image(x, y, key).setOrigin(0, 0).setDepth(50);
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRect(-1, -1, 18, 18);
  g.fillStyle(0x3cb44a, 1).fillRect(0, 0, 16, 16);
  g.fillStyle(0x2a2a33, 1).fillRect(3, 8, 10, 8);
  for (let i = 0; i < 4; i++) g.fillStyle(0x888899, 1).fillRect(3, 9 + i * 2, 10, 1);
  const parts = label.split(' ');      // '신림역 3' · '서울대입구역 4' → 역 이름 + 출구 번호
  const num = scene.add.text(8, 4, parts.at(-1), SIGN_FONT).setOrigin(0.5);
  const tag = scene.add.text(8, -5, parts.slice(0, -1).join(' '), { ...SIGN_FONT, color: '#1d1b26', backgroundColor: '#ffffff' }).setOrigin(0.5).setPadding(1, 0, 1, 0);
  return scene.add.container(x, y, [g, num, tag]).setDepth(50);
}

// 길 이름 (바닥 글씨, 빈 칸에만)
export function drawGroundLabel(scene, text, x, y, opts = {}) {
  return scene.add.text(x, y, text, { ...FONT, color: opts.color ?? '#e8e4f0', align: 'center', lineSpacing: -2 })
    .setOrigin(0.5).setAlpha(opts.alpha ?? 0.5).setDepth(opts.depth ?? 4);
}

// 성소 소품 도형 (방석·현수막·전기포트)
export function drawShape(scene, key, x, y, extra = {}) {
  if (scene.textures.exists(key)) return scene.add.image(x, y, key).setOrigin(0, 0);
  const g = scene.add.graphics({ x, y });
  if (key === 'shape.cushion') {
    g.fillStyle(0x1d1b26, 1).fillRect(2, 5, 12, 9);
    g.fillStyle(0xd96a8a, 1).fillRect(3, 6, 10, 7);
    g.fillStyle(0xf5d76e, 1).fillRect(5, 8, 2, 2).fillRect(9, 10, 2, 2);
  } else if (key === 'shape.kettle') {
    g.fillStyle(0x1d1b26, 1).fillRect(4, 4, 9, 11);
    g.fillStyle(0xe8e8f0, 1).fillRect(5, 5, 7, 9);
    g.fillStyle(0x3f6f8f, 1).fillRect(5, 12, 7, 2);
    g.fillStyle(0x1d1b26, 1).fillRect(12, 7, 2, 4);
  } else if (key === 'shape.banner') {
    const w = extra.width ?? 96;
    g.fillStyle(0x1d1b26, 1).fillRect(-1, -1, w + 2, 16);
    g.fillStyle(0xfff6e0, 1).fillRect(0, 0, w, 14);
    g.fillStyle(0xb8433a, 1).fillRect(0, 0, w, 2).fillRect(0, 12, w, 2);
    const t = scene.add.text(x + w / 2, y + 7, extra.text ?? '', { ...FONT, color: '#7a1e1a' }).setOrigin(0.5);
    return scene.add.container(0, 0, [g, t]);
  }
  return g;
}
