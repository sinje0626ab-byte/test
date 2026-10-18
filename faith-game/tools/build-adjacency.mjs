// 국가 연결 정보(src/data/adjacency.json)를 만든다.
//   land: 국경을 맞댄 나라 (topojson 경계 공유)
//   sea:  바다 건너 한 칸 — 두 나라 해안선 사이 거리가 SEA_KM 이내이거나, 아래 항로 목록에 있는 나라
//         (내륙국은 해안선이 없어 바다 연결이 생기지 않는다)
// 실행: npm run adjacency
import { readFileSync, writeFileSync } from 'node:fs';
import { mesh, neighbors } from 'topojson-client';
import { geoDistance } from 'd3-geo';
import { geometryId, EXCLUDED_IDS } from '../src/data/ids.js';

const SEA_KM = 650;        // 이 거리 안의 해안은 바다 한 칸
const MIN_SEA_LINKS = 2;   // 고립된 섬나라는 가까운 나라 몇 곳과 이어 준다
const EARTH_KM = 6371;
const SAMPLE_POINTS = 260; // 나라마다 거리 계산에 쓸 좌표 수

// 대양 항로: 거리로는 안 잡히지만 실제로 사람과 배가 오가는 길
const ROUTES = [
  ['840', '826'], ['840', '392'], ['124', '826'], ['076', '620'], ['076', '686'],
  ['032', '724'], ['484', '724'], ['036', '554'], ['036', '360'], ['554', '242'],
  ['036', '598'], ['242', '548'], ['840', '036'], ['710', '036'], ['710', '076'],
  ['356', '784'], ['356', '710'], ['608', '840'], ['392', '036'], ['304', '352'],
  ['352', '578'], ['352', '826'], ['450', '508'], ['818', '682'],
  ['392', '156'], ['392', '158'],
];

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url)));
const geoms = topo.objects.countries.geometries;
const ids = geoms.map(geometryId);

const land = {};
const sea = {};
const keep = (i) => ids[i] && !EXCLUDED_IDS.has(ids[i]);
ids.forEach((id, i) => { if (keep(i)) { land[id] = new Set(); sea[id] = new Set(); } });

neighbors(geoms).forEach((list, i) => {
  if (!keep(i)) return;
  for (const j of list) if (keep(j) && ids[j] !== ids[i]) land[ids[i]].add(ids[j]);
});

// 해안선 = 다른 나라와 공유하지 않는 경계(arc)
function coastPoints(i) {
  const line = mesh(topo, topo.objects.countries, (a, b) => a === b && a === geoms[i]);
  const out = line.coordinates.flat();
  const step = Math.max(1, Math.floor(out.length / SAMPLE_POINTS));
  return out.filter((_, k) => k % step === 0);
}

const pts = geoms.map((g, i) => (keep(i) ? coastPoints(i) : null));
const bbox = pts.map((p) => p && p.length > 0 && p.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [180, 90, -180, -90]));

function minKm(a, b) {
  let best = Infinity;
  for (const p of pts[a]) for (const q of pts[b]) {
    const d = geoDistance(p, q);
    if (d < best) best = d;
  }
  return best * EARTH_KM;
}

const dist = {};
const n = ids.length;
for (let a = 0; a < n; a++) {
  if (!keep(a)) continue;
  if (!bbox[a]) continue;
  for (let b = a + 1; b < n; b++) {
    if (!keep(b) || !bbox[b]) continue;
    // 경계 상자가 위도 30도 넘게 떨어져 있으면 계산하지 않는다
    const A = bbox[a], B = bbox[b];
    if (B[1] - A[3] > 30 || A[1] - B[3] > 30) continue;
    const km = minKm(a, b);
    (dist[ids[a]] ??= {})[ids[b]] = km;
    (dist[ids[b]] ??= {})[ids[a]] = km;
    if (km <= SEA_KM && !land[ids[a]].has(ids[b])) {
      sea[ids[a]].add(ids[b]);
      sea[ids[b]].add(ids[a]);
    }
  }
}

for (const id of Object.keys(sea)) {
  if (land[id].size + sea[id].size >= MIN_SEA_LINKS) continue;
  const near = Object.entries(dist[id] ?? {}).sort((x, y) => x[1] - y[1]);
  for (const [other] of near) {
    if (land[id].size + sea[id].size >= MIN_SEA_LINKS) break;
    if (!land[id].has(other)) { sea[id].add(other); sea[other].add(id); }
  }
}

for (const [a, b] of ROUTES) {
  if (!sea[a] || !sea[b]) throw new Error(`항로에 없는 나라: ${a}-${b}`);
  if (!land[a].has(b)) { sea[a].add(b); sea[b].add(a); }
}

const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, [...o[k]].sort()]));
const out = { _note: 'tools/build-adjacency.mjs가 만든 파일. 직접 고치지 말고 스크립트의 항로 목록을 고친 뒤 npm run adjacency.', land: sorted(land), sea: sorted(sea) };
const lines = ['{', `  "_note": ${JSON.stringify(out._note)},`];
for (const key of ['land', 'sea']) {
  lines.push(`  "${key}": {`);
  const ks = Object.keys(out[key]);
  ks.forEach((k, i) => lines.push(`    "${k}": ${JSON.stringify(out[key][k])}${i < ks.length - 1 ? ',' : ''}`));
  lines.push(key === 'land' ? '  },' : '  }');
}
lines.push('}');
writeFileSync(new URL('../src/data/adjacency.json', import.meta.url), lines.join('\n') + '\n');
const isolated = Object.keys(land).filter((id) => land[id].size + sea[id].size === 0);
console.log(`나라 ${Object.keys(land).length}곳, 고립 ${isolated.length}곳`);
