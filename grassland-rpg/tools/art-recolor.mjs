// 배지 색 바로잡기: node tools/art-recolor.mjs <고칠 그림.webp> <기준 그림.webp>
// 초록 계열 픽셀을 기준 그림의 평균 색으로, 밝기 비율은 그대로 (예: 초록으로 잘못 나온 전투 스킬 배지 → 빨강)
import { createRequire } from 'module';
import { execSync } from 'child_process';
import fs from 'fs';
const require = createRequire(execSync('npm root -g').toString().trim() + '/');
const { chromium } = require('playwright');
const [,, file, ref] = process.argv;
const b = await chromium.launch(); const p = await b.newPage();
const url = await p.evaluate(async ([d, r]) => {
  const load = async (s) => { const i = new Image(); i.src = s; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return [c, g]; };
  const lum = (r, g, b) => 0.3 * r + 0.59 * g + 0.11 * b;
  const sat = (r, g, b) => (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(1, Math.max(r, g, b));
  const [rc, rg] = await load(r); const rd = rg.getImageData(0, 0, rc.width, rc.height).data;
  let R = 0, G = 0, B = 0, L = 0, n = 0;
  for (let i = 0; i < rd.length; i += 4) { if (rd[i + 3] < 200 || sat(rd[i], rd[i + 1], rd[i + 2]) < 0.35 || rd[i] < rd[i + 1]) continue; R += rd[i]; G += rd[i + 1]; B += rd[i + 2]; L += lum(rd[i], rd[i + 1], rd[i + 2]); n++; }
  R /= n; G /= n; B /= n; L /= n;
  const [c, g] = await load(d); const im = g.getImageData(0, 0, c.width, c.height); const a = im.data;
  let gl = 0, m = 0; const green = (i) => a[i + 1] > a[i] && a[i + 1] >= a[i + 2] && sat(a[i], a[i + 1], a[i + 2]) > 0.2;
  for (let i = 0; i < a.length; i += 4) if (a[i + 3] > 200 && green(i)) { gl += lum(a[i], a[i + 1], a[i + 2]); m++; }
  gl /= m;
  for (let i = 0; i < a.length; i += 4) {
    if (!green(i)) continue;
    const k = lum(a[i], a[i + 1], a[i + 2]) / gl;
    a[i] = Math.min(255, R * k); a[i + 1] = Math.min(255, G * k); a[i + 2] = Math.min(255, B * k);
  }
  g.putImageData(im, 0, 0);
  return c.toDataURL('image/webp', 0.92);
}, ['data:image/webp;base64,' + fs.readFileSync(file).toString('base64'), 'data:image/webp;base64,' + fs.readFileSync(ref).toString('base64')]);
fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64')); await b.close();
