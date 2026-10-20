// 맞는 에셋이 없는 것들을 도형으로 그린다. 모두 스프라이트 키로 부른다:
// 나중에 같은 키의 이미지를 로드하면 (scene.textures.exists(key)) 도형 대신 그 이미지를 쓴다.
import { PLACES } from '../data/places.js';

const SIGN_COLORS = {
  shop: [0x2f5d8a, 0xffffff], work: [0x555a66, 0xffffff], religion: [0x7a2e2a, 0xfff3d6],
  ours: [0x5b3a7a, 0xffe9a8], home: [0x8a7a5a, 0xffffff], leisure: [0x3e7a4e, 0xffffff], transit: [0x3cb44a, 0xffffff],
};
const FONT = { fontFamily: 'Galmuri11', fontSize: '12px', color: '#ffffff' };

export function drawSign(scene, key, x, y, place) {
  if (scene.textures.exists(key)) return scene.add.image(x, y, key).setOrigin(0.5, 1).setDepth(60);
  const p = PLACES[place];
  const label = place === 'sanctuary' ? '동림상가' : p.name.replace(' 신림역점', '');
  const [bg, fg] = SIGN_COLORS[p.type] ?? SIGN_COLORS.shop;
  const t = scene.add.text(0, 0, label, { ...FONT, color: '#' + fg.toString(16).padStart(6, '0') }).setOrigin(0.5);
  const w = Math.ceil(t.width) + 6; const hgt = 13;
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRect(-w / 2 - 1, -hgt / 2 - 1, w + 2, hgt + 2);
  g.fillStyle(bg, 1).fillRect(-w / 2, -hgt / 2, w, hgt);
  return scene.add.container(x, y - 2, [g, t]).setDepth(60);
}

export function drawStationExit(scene, key, x, y, label) {
  if (scene.textures.exists(key)) return scene.add.image(x, y, key).setOrigin(0, 0).setDepth(50);
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRect(-1, -1, 18, 18);
  g.fillStyle(0x3cb44a, 1).fillRect(0, 0, 16, 16);
  g.fillStyle(0x2a2a33, 1).fillRect(3, 8, 10, 8);
  for (let i = 0; i < 4; i++) g.fillStyle(0x888899, 1).fillRect(3, 9 + i * 2, 10, 1);
  const num = scene.add.text(8, 4, label.replace('신림역 ', ''), { ...FONT, fontSize: '11px' }).setOrigin(0.5);
  const tag = scene.add.text(8, -8, '신림역', { ...FONT, color: '#1d1b26', backgroundColor: '#ffffff' }).setOrigin(0.5).setPadding(2, 0, 2, 0);
  return scene.add.container(x, y, [g, num, tag]).setDepth(50);
}

// 길 이름·동네 이름 (바닥 글씨)
export function drawGroundLabel(scene, text, x, y, opts = {}) {
  return scene.add.text(x, y, text, { ...FONT, color: opts.color ?? '#e8e4f0' })
    .setOrigin(0.5).setAlpha(opts.alpha ?? 0.55).setDepth(opts.depth ?? 4).setAngle(opts.angle ?? 0);
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
