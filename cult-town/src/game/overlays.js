// 머리 위에 뜨는 것들: 감정 말풍선 · 직업 아이콘 · 이름표 · 수다 말풍선. 모두 도형+글자 (스프라이트 키로 교체 가능)
const SMALL = { fontFamily: 'Galmuri7', fontSize: '8px', color: '#1d1b26' };
const NAME = { fontFamily: 'Galmuri7', fontSize: '8px', color: '#ffffff' };

const EMO = {
  sigh: { text: '휴', color: '#3a5a8a' },
  heart: { text: '♥', color: '#d83a5a' },
  question: { text: '?', color: '#2a6a3a' },
  angry: { text: '흥', color: '#c82a1a' },
  sleepy: { text: 'zz', color: '#6a5aa8' },
  // 3단계 표시: 탈퇴자 · 기자가 다음에 묻는 사람 · 라이벌 쪽에 기운 사람 · 피켓
  defector: { text: '떠남', color: '#5a5a6a', bg: 0xe0dcd0 },
  press: { text: '취재', color: '#b8601a', bg: 0xfff0d8 },
  rival: { text: '●', color: '#7a3a8a' },
  zealot: { text: '열', color: '#c8401a', bg: 0xffe8d8 },   // 열혈 신자
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
  g.fillStyle(e.bg ?? 0xffffff, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 3);
  g.fillStyle(e.bg ?? 0xffffff, 1).fillTriangle(-3, h / 2 - 1, 1, h / 2 - 1, -3, h / 2 + 3);
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

// 피켓 (시위하는 가족이 머리 위로 든다)
export function picket(scene, text) {
  const t = scene.add.text(0, 0, text, { ...SMALL, color: '#1d1b26' }).setOrigin(0.5, 1);
  const w = Math.ceil(t.width) + 6; const h = Math.ceil(t.height) + 3;
  t.setY(-6);
  const g = scene.add.graphics();
  g.fillStyle(0x8a6a4a, 1).fillRect(-1, -6, 2, 8);
  g.fillStyle(0x1d1b26, 1).fillRect(-w / 2 - 1, -h - 7, w + 2, h + 2);
  g.fillStyle(0xfff6c8, 1).fillRect(-w / 2, -h - 6, w, h);
  return scene.add.container(0, 0, [g, t]);
}

// 벽에 붙은 안내문·현수막 (기성 종교 공개 대응, 라이벌 간판)
export function wallNotice(scene, x, y, text, { bg = 0xf6f2e6, color = '#1d1b26', w = 64 } = {}) {
  const t = scene.add.text(0, 0, text, { ...SMALL, color, align: 'center', wordWrap: { width: w - 4, useAdvancedWrap: true } }).setOrigin(0.5, 0.5);
  const bw = Math.max(w, Math.ceil(t.width) + 6); const bh = Math.ceil(t.height) + 4;
  const g = scene.add.graphics();
  g.fillStyle(0x1d1b26, 1).fillRect(-bw / 2 - 1, -bh / 2 - 1, bw + 2, bh + 2);
  g.fillStyle(bg, 1).fillRect(-bw / 2, -bh / 2, bw, bh);
  return scene.add.container(x, y, [g, t]);
}

// ── 머리 위 표시 (27장 B): 한 사람에 하나. 도트 말풍선 12×14 (글리프 8×7) ──
// 수첩 '기호 설명' 탭이 같은 표(HEAD_ICONS)를 보여 준다
const G = {
  bang: ['...##...', '...##...', '...##...', '...##...', '........', '...##...', '........'],
  ask: ['..####..', '.##..##.', '.....##.', '....##..', '...##...', '........', '...##...'],
  check: ['........', '......##', '.....##.', '##..##..', '.####...', '..##....', '........'],
  drop: ['...##...', '..####..', '.######.', '.######.', '########', '.######.', '..####..'],
  anger: ['.#....#.', '##....##', '........', '........', '........', '##....##', '.#....#.'],
  flame: ['...#....', '...##...', '..###.#.', '.######.', '.##.###.', '.#...##.', '..###...'],
  out: ['........', '...#....', '...##...', '#######.', '...##...', '...#....', '........'],
  camera: ['..###...', '########', '#..##..#', '#.#..#.#', '#..##..#', '########', '........'],
  dot: ['........', '..####..', '.######.', '.######.', '.######.', '..####..', '........'],
};
// kind → [바탕, 글리프 색, 글리프, 수첩 설명]
export const HEAD_ICONS = {
  q_main: [0xf0c020, 0x1d1b26, 'bang', '노란 느낌표: 지금 할 큰일(메인 퀘스트)이 걸린 사람·장소'],
  q_favor: [0x9ad06a, 0x1d1b26, 'bang', '초록 느낌표: 부탁을 들어줄 사람·장소'],
  q_fork: [0xe88aa0, 0x1d1b26, 'bang', '분홍 느낌표: 사연이 갈림길에 선 사람'],
  q_today: [0x7ab8e8, 0x1d1b26, 'bang', '파란 느낌표: 오늘 할 일에 적힌 장소'],
  today: [0x3a78c8, 0xffffff, 'check', '파란 체크: 오늘 할 일을 같이 끝낼 수 있는 사람'],
  zealot: [0xffe8d8, 0xd8501a, 'flame', '불꽃: 열혈 신자 (길에서 남에게 말을 건다)'],
  defector: [0xd8d4c8, 0x4a4a5a, 'out', '나가는 화살표: 교단을 떠난 사람'],
  press: [0xfff0d8, 0x8a4a1a, 'camera', '카메라: 기자가 다음에 찾아갈 사람'],
  rival: [0xf0e8f8, 0x7a3a8a, 'dot', '보라 점: 라이벌 교단 쪽에 기운 사람'],
  worry: [0xffffff, 0x3a7ad8, 'drop', '파란 물방울: 고민이 큰 사람 (들어 주면 마음이 열린다)'],
  angry: [0xffffff, 0xd8302a, 'anger', '빨간 핏대: 우리를 수상하게 보는 사람'],
  new: [0xffffff, 0x1d1b26, 'ask', '물음표: 아직 인사 안 한 사람'],
};
export function makeHeadIcons(scene) {
  for (const [kind, [bg, fg, glyph]] of Object.entries(HEAD_ICONS)) {
    const key = `head.${kind}`;
    if (scene.textures.exists(key)) continue;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x1d1b26, 1).fillRect(1, 0, 10, 11).fillRect(0, 1, 12, 9).fillRect(5, 11, 2, 2).fillRect(4, 11, 4, 1);
    g.fillStyle(bg, 1).fillRect(1, 1, 10, 9).fillRect(5, 10, 2, 1);
    g.fillStyle(fg, 1);
    G[glyph].forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') g.fillRect(2 + x, 2 + y, 1, 1); }));
    g.generateTexture(key, 12, 14);
    g.destroy();
  }
}
// 머리 위 표시 하나 (이미지, 아래 가운데 기준)
export function headIcon(scene, kind) {
  makeHeadIcons(scene);
  return scene.add.image(0, 0, `head.${kind}`).setOrigin(0.5, 1);
}
// 장소 입구 퀘스트 표시도 같은 그림
export function questMark(scene, why) { return headIcon(scene, `q_${why}`); }

// 이름표 + (가까이 오면) 그 아래 작은 직업 글씨. name 이 null 이면 직업 글씨만
export function personTag(scene, name, job) {
  const parts = [];
  const n = name ? scene.add.text(0, 0, name, { ...NAME, backgroundColor: 'rgba(29,27,38,0.72)' }).setPadding(2, 1, 2, 0).setOrigin(0.5, 1) : null;
  const j = job ? scene.add.text(0, 0, job, { ...NAME, fontSize: '8px', color: '#fff6c8', backgroundColor: 'rgba(29,27,38,0.6)' }).setPadding(2, 0, 2, 0).setOrigin(0.5, 1).setScale(0.75) : null;
  if (n) parts.push(n);
  if (j) parts.push(j);
  const c = scene.add.container(0, 0, parts);
  c.nameText = n; c.jobText = j;
  c.setNear = (near) => {
    if (c.near === near) return;
    c.near = near;
    if (j) j.setVisible(near);
    if (n) n.setY(j && near ? -Math.ceil(j.displayHeight) : 0);
  };
  // 이름표 윗변 (머리 위 표시를 그 위에 올린다)
  c.topY = () => (n ? n.y - n.height : j && c.near ? -j.displayHeight : 0);
  c.setNear(false);
  return c;
}
