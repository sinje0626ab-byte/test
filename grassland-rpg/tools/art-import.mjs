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
if (process.env.ART_DEBUG) page.on('console', (m) => console.log(m.text()));
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
  // 배경 지우기: 가장자리에서 이어진 '거의 흰색(또는 거의 투명)' 픽셀을 투명으로.
  // 그림은 짙은 외곽선으로 둘러싸여 있어서 안쪽 흰 반짝임은 남는다 (흰 배경·흰 안개 배경 모두)
  const im = g.getImageData(0, 0, W, H);
  const a = im.data;
  // 배경 = 거의 투명 / 거의 흰색 / 반투명한 밝은 회색 안개(채도 낮음)
  const bg = (i) => {
    const r = a[i * 4]; const gg = a[i * 4 + 1]; const bb = a[i * 4 + 2]; const al = a[i * 4 + 3];
    const lo = Math.min(r, gg, bb); const hi = Math.max(r, gg, bb);
    return al < 20 || lo > 228 || (al < 140 && hi - lo < 25 && (r + gg + bb) / 3 > 150);
  };
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  let cleared = 0;
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !bg(i)) continue;
    seen[i] = 1;
    a[i * 4 + 3] = 0;
    cleared++;
    const x = i % W;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (i >= W) stack.push(i - W);
    if (i < W * (H - 1)) stack.push(i + W);
  }
  // 지운 자리 바로 옆의 밝은 반투명 테두리(흰 번짐)도 정리
  for (let i = 0; i < W * H; i++) {
    if (seen[i] || a[i * 4 + 3] === 0) continue;
    const x = i % W;
    const near = (x > 0 && seen[i - 1]) || (x < W - 1 && seen[i + 1]) || seen[i - W] || seen[i + W];
    if (near && Math.min(a[i * 4], a[i * 4 + 1], a[i * 4 + 2]) > 200) a[i * 4 + 3] = Math.round(a[i * 4 + 3] * 0.3);
  }
  // 흰 바탕 위에서 그린 빛 번짐은 밝고 반투명하다 → 어두운 칸(퀵슬롯)에서 뿌연 구름처럼 보이지 않게 많이 옅게
  for (let i = 0; i < W * H; i++) {
    const al = a[i * 4 + 3];
    if (!al || al > 170) continue;
    const l = (a[i * 4] + a[i * 4 + 1] + a[i * 4 + 2]) / 3;
    if (l > 185) a[i * 4 + 3] = Math.round(al * 0.3);
  }
  g.putImageData(im, 0, 0);
  // 나누기·자르기는 또렷한 부분(불투명)만 본다 — 옅은 그림자·안개가 그림끼리 잇지 않게
  const on = (x, y) => a[(y * W + x) * 4 + 3] > 100;
  // 빈 줄(가로) → 빈 칸(세로) 순서로 나눈다. 틈이 6px(또는 크기의 0.6%) 이상일 때만
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
  for (const [y0, y1] of runs(H, (y) => { for (let x = 0; x < W; x++) if (on(x, y)) return true; return false; }, Math.max(6, Math.round(H * 0.006)))) {
    let cols = runs(W, (x) => { for (let y = y0; y <= y1; y++) if (on(x, y)) return true; return false; }, Math.max(6, Math.round(W * 0.006)));
    // 반짝이·빛 번짐으로 그림 여럿이 붙었으면(한 줄에서 다른 것보다 1.6배 넘게 넓음) 폭으로 몇 개인지 어림해
    // 나눌 자리 근처(±15%)에서 가장 가는 세로줄을 골라 나눈다
    const widths = cols.map(([x0, x1]) => x1 - x0 + 1).sort((p, q) => p - q);
    const med = widths[Math.floor(widths.length / 2)];
    if (cols.length > 1) {
      cols = cols.flatMap(([x0, x1]) => {
        const w = x1 - x0 + 1;
        if (w < med * 1.6) return [[x0, x1]];
        const k = Math.max(2, Math.round(w / med));
        const cuts = [];
        for (let j = 1; j < k; j++) {
          const mid = x0 + Math.round((w * j) / k);
          let best = mid; let bestN = Infinity;
          for (let x = mid - Math.round(w * 0.15 / k * 2); x <= mid + Math.round(w * 0.15 / k * 2); x++) {
            let n = 0;
            for (let y = y0; y <= y1; y++) if (on(x, y)) n++;
            if (n < bestN) { bestN = n; best = x; }
          }
          cuts.push(best);
        }
        const out = [];
        let a = x0;
        for (const c of cuts) { out.push([a, c - 1]); a = c + 1; }
        out.push([a, x1]);
        return out;
      });
    }
    cols.forEach(([x0, x1], k) => {
      // 세로로 다시 좁힌다
      let t = y1; let b = y0;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (on(x, y)) { t = Math.min(t, y); b = Math.max(b, y); }
      const w = x1 - x0 + 1; const h = b - t + 1;
      if (w * h <= W * H * 0.004) return;
      // 옅은 그림자·외곽 번짐이 잘리지 않게 조금 넓힌다 (이웃 그림과의 틈 절반까지만)
      const pad = Math.round(Math.max(w, h) * 0.04);
      const left = Math.max(0, x0 - Math.min(pad, k > 0 ? Math.floor((x0 - cols[k - 1][1]) / 2) : pad));
      const right = Math.min(W, x1 + 1 + Math.min(pad, k < cols.length - 1 ? Math.floor((cols[k + 1][0] - x1) / 2) : pad));
      const top = Math.max(0, t - pad);
      boxes.push({ x: left, y: top, w: right - left, h: Math.min(H, b + 1 + pad) - top });
    });
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
  }).map((r) => ({ ...r, cleared: +(cleared / (W * H)).toFixed(2) }));
}, { data, SIZE, FILL });
await browser.close();

if (res.length !== ids.length) console.warn(`⚠ 그림 ${res.length}개를 찾았는데 이름은 ${ids.length}개입니다. 앞에서부터 맞춥니다.`);
res.slice(0, ids.length).forEach((r, i) => {
  const f = path.join(outDir, `${ids[i]}.webp`);
  fs.writeFileSync(f, Buffer.from(r.url.split(',')[1], 'base64'));
  console.log(`${ids[i]} ← (${r.box.x},${r.box.y}) ${r.box.w}×${r.box.h} 배경 ${Math.round(r.cleared * 100)}% → ${path.relative(process.cwd(), f)} ${fs.statSync(f).size}B`);
});
