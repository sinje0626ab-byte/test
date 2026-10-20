// 사람 스프라이트 합성: RPG Urban 의 사람 6종(몸 틀) 프레임을 가져와 머리·피부·윗옷·바지 색을 바꾸고,
// 머리 모양(모자·올림머리·묶음머리)을 몇 픽셀 덧그린다. 30명이 서로 구별되게.
// 결과: Phaser 텍스처 'p:<id>' (12프레임: 아래·왼쪽·오른쪽·위 × 서기·걷기1·걷기2)

const COLS = { down: 24, left: 23, right: 26, up: 25 };
export const DIRS = ['down', 'left', 'right', 'up'];
const OUTLINE = ['#8d5243', '#654140', '#373733'];
const SKIN = ['#f1b089', '#ffc999', '#ffc8a1', '#e29779'];
// 몸 틀마다 줄 경계: 머리 [0, hairEnd) · 윗옷 [hairEnd, topEnd) · 바지 [topEnd, 15) · 15줄은 신발 (그대로)
const BODY_ROWS = [
  { hairEnd: 10, topEnd: 13 },
  { hairEnd: 10, topEnd: 13 },
  { hairEnd: 10, topEnd: 13 },
  { hairEnd: 10, topEnd: 13 },
  { hairEnd: 10, topEnd: 13 },
  { hairEnd: 10, topEnd: 14 },
];
const SKIN_TONE = [[1, 1, 1], [0.94, 0.87, 0.8], [0.8, 0.66, 0.55]];

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

function recolorFrame(src, look) {
  const rows = BODY_ROWS[look.base];
  const d = src.data;
  // 구역마다 원래 색들의 밝기 범위를 보고, 새 색에 명암을 입힌다
  const region = (y) => (y < rows.hairEnd ? 'hair' : y < rows.topEnd ? 'top' : y < 15 ? 'bottom' : 'shoe');
  const target = { hair: hex(look.hairColor), top: hex(look.top), bottom: hex(look.bottom) };
  const maxL = { hair: 0, top: 0, bottom: 0 };
  const isKeep = (c) => OUTLINE.includes(c);
  const isSkin = (c) => SKIN.includes(c);
  const colorAt = (i) => toHex(d[i], d[i + 1], d[i + 2]);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const i = (y * 16 + x) * 4;
    if (!d[i + 3]) continue;
    const c = colorAt(i); const r = region(y);
    if (r === 'shoe' || isKeep(c) || isSkin(c)) continue;
    maxL[r] = Math.max(maxL[r], lum([d[i], d[i + 1], d[i + 2]]));
  }
  const tone = SKIN_TONE[look.skin ?? 0];
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const i = (y * 16 + x) * 4;
    if (!d[i + 3]) continue;
    const c = colorAt(i); const r = region(y);
    if (isSkin(c)) { d[i] *= tone[0]; d[i + 1] *= tone[1]; d[i + 2] *= tone[2]; continue; }
    if (r === 'shoe' || isKeep(c)) continue;
    const shade = maxL[r] ? Math.min(1.1, 0.55 + 0.45 * (lum([d[i], d[i + 1], d[i + 2]]) / maxL[r])) : 1;
    const t = target[r];
    d[i] = t[0] * shade; d[i + 1] = t[1] * shade; d[i + 2] = t[2] * shade;
  }
}

// 머리 모양 덧그리기 (몇 픽셀)
function hairOverlay(ctx, look, dir, ox) {
  const c = look.hairColor;
  const dark = toHex(...hex(c).map((v) => v * 0.7));
  const px = (x, y, col = c) => { ctx.fillStyle = col; ctx.fillRect(ox + x, y, 1, 1); };
  if (look.hair === 'cap') {
    const cap = look.top; const capD = toHex(...hex(cap).map((v) => v * 0.7));
    for (let x = 5; x <= 10; x++) { px(x, 2, capD); px(x, 3, cap); }
    if (dir === 'down') for (let x = 5; x <= 10; x++) px(x, 4, capD);
    if (dir === 'left') for (let x = 3; x <= 6; x++) px(x, 4, capD);
    if (dir === 'right') for (let x = 9; x <= 12; x++) px(x, 4, capD);
  } else if (look.hair === 'bun') {
    for (let x = 6; x <= 9; x++) { px(x, 0, dark); px(x, 1, c); }
  } else if (look.hair === 'pony') {
    if (dir === 'left') { px(11, 5, dark); px(12, 6, c); px(12, 7, c); px(12, 8, dark); }
    if (dir === 'right') { px(4, 5, dark); px(3, 6, c); px(3, 7, c); px(3, 8, dark); }
    if (dir === 'up') { px(7, 9, c); px(8, 9, c); px(7, 10, dark); px(8, 10, dark); }
  } else if (look.hair === 'perm') {
    for (const x of [4, 6, 9, 11]) px(x, 3, dark);
  }
}

// urbanImage: RPG Urban tilemap_packed 이미지. 반환: 12프레임 캔버스 (192×16)
export function composePerson(urbanImage, look) {
  const canvas = document.createElement('canvas');
  canvas.width = 16 * 12; canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const tmp = document.createElement('canvas'); tmp.width = 16; tmp.height = 16;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  DIRS.forEach((dir, di) => {
    for (let f = 0; f < 3; f++) {
      tctx.clearRect(0, 0, 16, 16);
      tctx.drawImage(urbanImage, COLS[dir] * 16, (look.base * 3 + f) * 16, 16, 16, 0, 0, 16, 16);
      const img = tctx.getImageData(0, 0, 16, 16);
      recolorFrame(img, look);
      tctx.putImageData(img, 0, 0);
      const ox = (di * 3 + f) * 16;
      ctx.drawImage(tmp, ox, 0);
      hairOverlay(ctx, look, dir, ox);
    }
  });
  return canvas;
}

export const frameIndex = (dir, f) => DIRS.indexOf(dir) * 3 + f;

// Phaser 텍스처와 걷기 애니메이션 등록
export function registerPerson(scene, key, look) {
  if (scene.textures.exists(key)) return;
  const canvas = composePerson(scene.textures.get('urban').getSourceImage(), look);
  scene.textures.addSpriteSheet(key, canvas, { frameWidth: 16, frameHeight: 16 });
  for (const dir of DIRS) {
    scene.anims.create({
      key: `${key}-walk-${dir}`,
      frames: [1, 0, 2, 0].map((f) => ({ key, frame: frameIndex(dir, f) })),
      frameRate: 8, repeat: -1,
    });
  }
}

// DOM 용 얼굴 그림 (대화창·프로필): 앞모습을 배율로 키운 dataURL
const portraitCache = new Map();
export function portrait(urbanImage, key, look, scale = 4) {
  if (portraitCache.has(key)) return portraitCache.get(key);
  const sheet = composePerson(urbanImage, look);
  const c = document.createElement('canvas');
  c.width = 16 * scale; c.height = 16 * scale;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, 0, 0, 16, 16, 0, 0, 16 * scale, 16 * scale);
  const url = c.toDataURL();
  portraitCache.set(key, url);
  return url;
}

export const LEADER_LOOK = { base: 0, hair: 'short', hairColor: '#2a2a2a', skin: 0, top: '#e9e2c8', bottom: '#3a3a4a' };
