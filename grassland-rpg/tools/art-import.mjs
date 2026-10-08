// 외부에서 그린 그림(투명 배경)을 게임 아이콘으로 넣기
//   node tools/art-import.mjs <그림 파일> <종류> <id1> [id2 ...]
//   예) node tools/art-import.mjs sheet.webp items slime_jelly mushroom_cap cactus_spine
// - 한 장에 여러 개가 있으면 투명한 빈 줄·빈 칸으로 나눠 왼쪽 위부터 순서대로 id 를 붙인다
// - 그림마다 여백을 잘라 정사각 SIZE 칸 가운데에 FILL 비율로 놓고 webp 로 src/art/<종류>/<id>.webp 에 저장
// Playwright(전역 설치)의 Chromium 캔버스로 처리한다 (이미지 라이브러리 없이).
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

const SIZE = 256;
const FILL = 0.9;
const [, , file, kind, ...ids] = process.argv;
if (!file || !kind || !ids.length) {
  console.log('사용법: node tools/art-import.mjs <그림> <items|skills|build|portraits|ui|slots> <id...>');
  process.exit(1);
}
const root = path.dirname(new URL(import.meta.url).pathname);
const outDir = path.join(root, '../src/art', kind);
fs.mkdirSync(outDir, { recursive: true });
const require = createRequire(execSync('npm root -g').toString().trim() + '/');
const { chromium } = require('playwright');
const ext = path.extname(file).slice(1).replace('jpg', 'jpeg');
const data = `data:image/${ext};base64,${fs.readFileSync(file).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const res = await page.evaluate(async ({ data, SIZE, FILL }) => {
  const img = new Image();
  img.src = data;
  await img.decode();
  const W = img.width;
  const H = img.height;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const a = g.getImageData(0, 0, W, H).data;
  const on = (x, y) => a[(y * W + x) * 4 + 3] > 16;
  // 빈 줄(가로) → 빈 칸(세로) 순서로 나눈다. 틈이 크기의 2% 이상일 때만
  const runs = (n, filled, minGap) => {
    const out = [];
    let start = -1;
    let gap = 0;
    for (let i = 0; i < n; i++) {
      if (filled(i)) {
        if (start < 0) start = i;
        gap = 0;
      } else if (start >= 0 && ++gap >= minGap) {
        out.push([start, i - gap]);
        start = -1;
      }
    }
    if (start >= 0) out.push([start, n - 1]);
    return out;
  };
  const boxes = [];
  for (const [y0, y1] of runs(H, (y) => { for (let x = 0; x < W; x++) if (on(x, y)) return true; return false; }, Math.round(H * 0.02))) {
    for (const [x0, x1] of runs(W, (x) => { for (let y = y0; y <= y1; y++) if (on(x, y)) return true; return false; }, Math.round(W * 0.02))) {
      // 세로로 다시 좁힌다
      let t = y1; let b = y0;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (on(x, y)) { t = Math.min(t, y); b = Math.max(b, y); }
      const w = x1 - x0 + 1; const h = b - t + 1;
      if (w * h > W * H * 0.004) boxes.push({ x: x0, y: t, w, h });
    }
  }
  const o = document.createElement('canvas');
  o.width = o.height = SIZE;
  const og = o.getContext('2d');
  og.imageSmoothingQuality = 'high';
  return boxes.map((bx) => {
    og.clearRect(0, 0, SIZE, SIZE);
    const s = (SIZE * FILL) / Math.max(bx.w, bx.h);
    og.drawImage(c, bx.x, bx.y, bx.w, bx.h, (SIZE - bx.w * s) / 2, (SIZE - bx.h * s) / 2, bx.w * s, bx.h * s);
    return { box: bx, url: o.toDataURL('image/webp', 0.92) };
  });
}, { data, SIZE, FILL });
await browser.close();

if (res.length !== ids.length) console.warn(`⚠ 그림 ${res.length}개를 찾았는데 이름은 ${ids.length}개입니다. 앞에서부터 맞춥니다.`);
res.slice(0, ids.length).forEach((r, i) => {
  const f = path.join(outDir, `${ids[i]}.webp`);
  fs.writeFileSync(f, Buffer.from(r.url.split(',')[1], 'base64'));
  console.log(`${ids[i]} ← (${r.box.x},${r.box.y}) ${r.box.w}×${r.box.h} → ${path.relative(process.cwd(), f)} ${fs.statSync(f).size}B`);
});
