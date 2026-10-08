// 3D 모델 가져오기: src/data/models.json 의 각 모델을 원본 glTF 에서 읽어
// 맞지 않는 소품을 지우고(remove: 그 색 칸을 쓰는 삼각형), 색을 바꾸고(아틀라스 칸 색 / 재질 색), 쓰는 동작만 남기고(이름도 게임 동작 이름으로), 작은 .glb 로 만든다.
//   node tools/model-import.mjs <원본 폴더> [모델 id ...]
//   원본 폴더 안: um/ (Ultimate Monsters 의 Big·Blob·Flying), animals/ (Ultimate Animated Animals)
// 결과: src/models/<id>.glb  (core/Models.js 가 게임 시작 전에 읽는다)
import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, resample, quantize, compactPrimitive } from '@gltf-transform/functions';
import { PNG } from 'pngjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [srcDir, ...only] = process.argv.slice(2);
if (!srcDir) {
  console.log('사용법: node tools/model-import.mjs <원본 폴더> [모델 id ...]');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/models.json'), 'utf8'));
const outDir = path.join(root, 'src/models');
fs.mkdirSync(outDir, { recursive: true });
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

// 아틀라스(칸마다 한 색) 그림에서 from 색 칸을 to 색으로
function recolorTexture(tex, pairs) {
  const png = PNG.sync.read(Buffer.from(tex.getImage()));
  const list = pairs.map(([a, b]) => [rgb(a), rgb(b)]);
  for (let k = 0; k < png.data.length; k += 4) {
    for (const [a, b] of list) {
      if (Math.abs(png.data[k] - a[0]) + Math.abs(png.data[k + 1] - a[1]) + Math.abs(png.data[k + 2] - a[2]) < 6) {
        png.data[k] = b[0]; png.data[k + 1] = b[1]; png.data[k + 2] = b[2];
        break;
      }
    }
  }
  tex.setImage(new Uint8Array(PNG.sync.write(png)));
}

// 아틀라스에서 그 색 칸을 쓰는 삼각형을 지운다 (선인장의 솜브레로 모자처럼 게임과 안 맞는 소품)
function removeByColor(r, colors) {
  const list = colors.map(rgb);
  for (const mesh of r.listMeshes()) for (const prim of mesh.listPrimitives()) {
    const tex = prim.getMaterial()?.getBaseColorTexture();
    const uv = prim.getAttribute('TEXCOORD_0');
    const idx = prim.getIndices();
    if (!tex || !uv || !idx) continue;
    const png = PNG.sync.read(Buffer.from(tex.getImage()));
    // 삼각형 가운데(세 꼭짓점 UV 평균)가 그 색 칸이면 지운다 (가장자리 꼭짓점은 옆 칸에 걸칠 수 있다)
    const hit = (a, b, c) => {
      const [ua, va] = uv.getElement(a, []);
      const [ub, vb] = uv.getElement(b, []);
      const [uc, vc] = uv.getElement(c, []);
      const u = (ua + ub + uc) / 3;
      const v = (va + vb + vc) / 3;
      const x = Math.min(png.width - 1, Math.max(0, Math.floor(u * png.width)));
      const y = Math.min(png.height - 1, Math.max(0, Math.floor(v * png.height)));
      const k = (y * png.width + x) * 4;
      return list.some((c) => Math.abs(png.data[k] - c[0]) + Math.abs(png.data[k + 1] - c[1]) + Math.abs(png.data[k + 2] - c[2]) < 6);
    };
    // 붙어 있는 조각(같은 자리 꼭짓점으로 이어진 삼각형 무리)마다, 반 넘게 그 색이면 조각째 지운다 (모자 테두리 같은 가는 면까지)
    const src = idx.getArray();
    const pos = prim.getAttribute('POSITION');
    const key = (i) => pos.getElement(i, []).map((x) => x.toFixed(4)).join(',');
    const parent = new Map();
    const find = (k) => { while (parent.get(k) !== k) { parent.set(k, parent.get(parent.get(k))); k = parent.get(k); } return k; };
    const join = (x, y) => { const rx = find(x); const ry = find(y); if (rx !== ry) parent.set(rx, ry); };
    for (let i = 0; i < pos.getCount(); i++) { const k = key(i); if (!parent.has(k)) parent.set(k, k); }
    for (let t = 0; t < src.length; t += 3) { join(key(src[t]), key(src[t + 1])); join(key(src[t]), key(src[t + 2])); }
    const score = new Map();
    for (let t = 0; t < src.length; t += 3) {
      const g = find(key(src[t]));
      const sc = score.get(g) ?? [0, 0];
      sc[0] += hit(src[t], src[t + 1], src[t + 2]) ? 1 : 0;
      sc[1] += 1;
      score.set(g, sc);
    }
    const keep = [];
    for (let t = 0; t < src.length; t += 3) {
      const [h, n] = score.get(find(key(src[t])));
      if (h / n <= 0.5) keep.push(src[t], src[t + 1], src[t + 2]);
    }
    idx.setArray(new (src.constructor)(keep));
    compactPrimitive(prim); // 안 쓰는 꼭짓점도 빼서 키(경계 상자)가 소품 없이 잡히게
  }
}

for (const [id, m] of Object.entries(data.models)) {
  if (only.length && !only.includes(id)) continue;
  const doc = await io.read(path.join(srcDir, m.src));
  const r = doc.getRoot();
  // 동작: 쓰는 것만 남기고 게임 이름으로 (원본 이름 앞의 'Armature|' 같은 머리는 무시)
  const want = new Map(Object.entries(m.clips).map(([game, orig]) => [orig, game]));
  for (const anim of r.listAnimations()) {
    const name = anim.getName().replace(/^.*\|/, '');
    if (want.has(name)) anim.setName(want.get(name));
    else anim.dispose();
  }
  const missing = Object.keys(m.clips).filter((g) => !r.listAnimations().some((a) => a.getName() === g));
  if (missing.length) console.warn(`  ${id}: 원본에 없는 동작 ${missing.map((g) => m.clips[g]).join(', ')}`);
  if (m.remove) removeByColor(r, m.remove);
  for (const tex of r.listTextures()) recolorTexture(tex, [data.eyes, ...(m.recolor ?? [])]);
  for (const mat of r.listMaterials()) {
    const hex = m.materials?.[mat.getName()];
    if (hex) mat.setBaseColorFactor([...rgb(hex).map((c) => srgbToLinear(c / 255)), 1]);
    mat.setMetallicFactor(0);
    mat.setRoughnessFactor(1);
  }
  await doc.transform(resample(), dedup(), prune(), quantize());
  const out = path.join(outDir, `${id}.glb`);
  await io.write(out, doc);
  console.log(`${id}.glb  ${(fs.statSync(out).size / 1024).toFixed(0)} KB  동작 ${r.listAnimations().map((a) => a.getName()).join(',')}`);
}
