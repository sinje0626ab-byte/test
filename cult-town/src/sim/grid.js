// 걷기 격자 + A* 길찾기. 맵 JSON 의 properties.cost (행마다 숫자, 0 = 못 감).
export function gridFromMap(map) {
  const prop = (n) => map.properties.find((p) => p.name === n)?.value;
  const rows = prop('cost').split('\n');
  const w = rows[0].length;
  const h = rows.length;
  const cost = new Uint8Array(w * h);
  rows.forEach((r, y) => { for (let x = 0; x < w; x++) cost[y * w + x] = r.charCodeAt(x) - 48; });
  const placesRaw = prop('places');
  const crossRaw = prop('cross');
  return { w, h, cost, places: placesRaw ? JSON.parse(placesRaw) : {}, cross: new Set(crossRaw ? JSON.parse(crossRaw) : []) };
}

export const walkable = (g, x, y) => x >= 0 && y >= 0 && x < g.w && y < g.h && g.cost[y * g.w + x] > 0;

// 작은 이진 힙
class Heap {
  constructor() { this.a = []; }
  push(n) {
    const a = this.a; a.push(n);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p].f <= n.f) break; a[i] = a[p]; i = p; }
    a[i] = n;
  }
  pop() {
    const a = this.a; const top = a[0]; const last = a.pop();
    if (a.length) {
      let i = 0;
      for (;;) {
        const l = i * 2 + 1; const r = l + 1; let m = i;
        if (l < a.length && a[l].f < (m === i ? last.f : a[m].f)) m = l;
        if (r < a.length && a[r].f < (m === i ? last.f : a[m].f)) m = r;
        if (m === i) break;
        a[i] = a[m]; i = m;
      }
      a[i] = last;
    }
    return top;
  }
  get size() { return this.a.length; }
}

// from·to: [x, y]. 반환: 시작 칸을 뺀 [[x,y], ...] (못 가면 null)
export function findPath(g, from, to) {
  const [sx, sy] = from; const [tx, ty] = to;
  if (sx === tx && sy === ty) return [];
  if (!walkable(g, tx, ty)) return null;
  const W = g.w; const N = W * g.h;
  const best = new Float32Array(N).fill(Infinity);
  const prev = new Int32Array(N).fill(-1);
  const start = sy * W + sx; const goal = ty * W + tx;
  best[start] = 0;
  const open = new Heap();
  open.push({ i: start, f: Math.abs(sx - tx) + Math.abs(sy - ty) });
  const D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (open.size) {
    const { i } = open.pop();
    if (i === goal) break;
    const x = i % W; const y = (i / W) | 0;
    for (const [dx, dy] of D) {
      const nx = x + dx; const ny = y + dy;
      if (!walkable(g, nx, ny)) continue;
      const j = ny * W + nx;
      const c = best[i] + g.cost[j];
      if (c < best[j]) {
        best[j] = c; prev[j] = i;
        open.push({ i: j, f: c + Math.abs(nx - tx) + Math.abs(ny - ty) });
      }
    }
  }
  if (prev[goal] < 0) return null;
  const path = [];
  for (let i = goal; i !== start; i = prev[i]) path.push([i % W, (i / W) | 0]);
  return path.reverse();
}

// 일과 위치 키 → 칸 ('place:spot' 은 바깥 자리, 'place' 는 건물 입구에서 안으로 들어간다)
export function resolveKey(g, key) {
  const [place, spot] = key.split(':');
  const p = g.places[place];
  if (!p) throw new Error(`모르는 장소: ${key}`);
  if (spot) {
    const t = p.spots?.[spot];
    if (!t) throw new Error(`모르는 자리: ${key}`);
    return { tile: t, inside: false };
  }
  return { tile: p.door, inside: !['station', 'stream', 'park', 'market'].includes(place) };
}
