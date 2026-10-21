// 머리 위에 뜨는 것들: 감정 말풍선 · 직업 아이콘 · 이름표 · 수다 말풍선. 모두 도형+글자 (스프라이트 키로 교체 가능)
const SMALL = { fontFamily: 'Galmuri7', fontSize: '8px', color: '#1d1b26' };
const NAME = { fontFamily: 'Galmuri7', fontSize: '8px', color: '#ffffff' };

const EMO = {
  sigh: { text: '휴', color: '#3a5a8a' },
  heart: { text: '♥', color: '#d83a5a' },
  question: { text: '?', color: '#2a6a3a' },
  angry: { text: '흥', color: '#c82a1a' },
  sleepy: { text: 'zz', color: '#6a5aa8' },
};

// 직업 아이콘 텍스처를 한 번 만든다 (9×9 픽셀)
export function makeIconTextures(scene) {
  if (scene.textures.exists('icon.book')) return;
  const draw = (key, fn) => {
    if (scene.textures.exists(`icon.${key}`)) return;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x1d1b26, 1).fillRoundedRect(0, 0, 11, 11, 2);
    g.fillStyle(0xf6efd9, 1).fillRoundedRect(1, 1, 9, 9, 2);
    fn(g);
    g.generateTexture(`icon.${key}`, 11, 11);
    g.destroy();
  };
  draw('book', (g) => { g.fillStyle(0x8a5a2a, 1).fillRect(2, 3, 7, 5); g.fillStyle(0xffffff, 1).fillRect(3, 4, 2, 3).fillRect(6, 4, 2, 3); });
  draw('tie', (g) => { g.fillStyle(0x2a4a8a, 1).fillRect(5, 2, 2, 2).fillTriangle(4, 4, 7, 4, 5.5, 9); });
  draw('apron', (g) => { g.fillStyle(0xd8603a, 1).fillRect(3, 3, 5, 6); g.fillStyle(0xffffff, 1).fillRect(4, 5, 3, 1); });
  draw('cane', (g) => { g.fillStyle(0x8a5a2a, 1).fillRect(6, 3, 1, 6).fillRect(3, 2, 4, 1).fillRect(3, 3, 1, 1); });
  draw('pill', (g) => { g.fillStyle(0xd83a3a, 1).fillRect(2, 4, 4, 3); g.fillStyle(0xffffff, 1).fillRect(5, 4, 4, 3); g.lineStyle(1, 0x1d1b26, 1).strokeRect(2, 4, 7, 3); });
  draw('pen', (g) => { g.fillStyle(0xe8b830, 1).fillRect(3, 3, 5, 2).fillRect(4, 5, 3, 2); g.fillStyle(0x1d1b26, 1).fillRect(5, 7, 1, 2); });
  draw('box', (g) => { g.fillStyle(0xb8864a, 1).fillRect(2, 3, 7, 6); g.fillStyle(0x6a4a2a, 1).fillRect(5, 3, 1, 6); });
  draw('wheel', (g) => { g.lineStyle(2, 0x3a3a3a, 1).strokeCircle(5.5, 5.5, 3); g.fillStyle(0x3a3a3a, 1).fillRect(5, 5, 1, 1); });
  draw('bolt', (g) => { g.fillStyle(0xe8b830, 1).fillTriangle(6, 1, 3, 6, 6, 6).fillTriangle(5, 5, 8, 5, 4, 10); });
  draw('home', (g) => { g.fillStyle(0xc83a3a, 1).fillTriangle(5.5, 2, 2, 5, 9, 5); g.fillStyle(0x8a6a4a, 1).fillRect(3, 5, 5, 4); });
  draw('star', (g) => { g.fillStyle(0x7a3aa8, 1).fillTriangle(5.5, 1, 3, 9, 8, 9).fillTriangle(2, 4, 9, 4, 5.5, 8); });
}

// 감정 말풍선 하나 (컨테이너). 머리 위 오른쪽
export function emotionBubble(scene, kind) {
  const e = EMO[kind];
  const t = scene.add.text(0, 0, e.text, { ...SMALL, color: e.color }).setOrigin(0.5, 0.5);
  const w = Math.max(10, Math.ceil(t.width) + 4); const h = 10;
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRoundedRect(-w / 2 - 1, -h / 2 - 1, w + 2, h + 2, 3);
  g.fillStyle(0xffffff, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 3);
  g.fillStyle(0xffffff, 1).fillTriangle(-3, h / 2 - 1, 1, h / 2 - 1, -3, h / 2 + 3);
  return scene.add.container(0, 0, [g, t]);
}

// 수다 말풍선 (한 줄)
export function speechBubble(scene, text) {
  const t = scene.add.text(0, 0, text, { ...SMALL, wordWrap: { width: 120, useAdvancedWrap: true } }).setOrigin(0.5, 1);
  const w = Math.ceil(t.width) + 6; const h = Math.ceil(t.height) + 4;
  t.setY(-2);
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRoundedRect(-w / 2 - 1, -h - 1, w + 2, h + 2, 3);
  g.fillStyle(0xfffaf0, 1).fillRoundedRect(-w / 2, -h, w, h, 3);
  g.fillStyle(0xfffaf0, 1).fillTriangle(-3, -1, 3, -1, 0, 4);
  return scene.add.container(0, 0, [g, t]);
}

export function nameTag(scene, text) {
  return scene.add.text(0, 0, text, { ...NAME, backgroundColor: 'rgba(29,27,38,0.72)' }).setPadding(2, 1, 2, 0).setOrigin(0.5, 1);
}
