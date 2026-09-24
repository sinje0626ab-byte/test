// 격자 A* (1m 칸, 8방향, 모서리 끼어 지나가기 금지).
// blocked(cx, cz) → 막힌 칸인지. bounds = { x0, z0, x1, z1 } (칸 좌표, 포함)
// 찾으면 칸 중심 좌표 목록 [{x, z}, ...] (시작 칸 제외), 없으면 null
export function findPath(start, goal, blocked, bounds, maxNodes = 5000) {
  const inB = (x, z) => x >= bounds.x0 && x <= bounds.x1 && z >= bounds.z0 && z <= bounds.z1;
  const key = (x, z) => (x - bounds.x0) * 100000 + (z - bounds.z0);
  const h = (x, z) => {
    const dx = Math.abs(x - goal.x);
    const dz = Math.abs(z - goal.z);
    return Math.max(dx, dz) + 0.414 * Math.min(dx, dz);
  };
  const open = [{ x: start.x, z: start.z, g: 0, f: h(start.x, start.z) }];
  const came = new Map();
  const gScore = new Map([[key(start.x, start.z), 0]]);
  const closed = new Set();
  let visited = 0;
  while (open.length && visited < maxNodes) {
    // 작은 격자라 선형 탐색으로 충분하다
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const cur = open[bi];
    open[bi] = open[open.length - 1];
    open.pop();
    const ck = key(cur.x, cur.z);
    if (closed.has(ck)) continue;
    closed.add(ck);
    visited += 1;
    if (cur.x === goal.x && cur.z === goal.z) {
      const path = [];
      let k = ck;
      let node = cur;
      while (came.has(k)) {
        path.push({ x: node.x + 0.5, z: node.z + 0.5 });
        node = came.get(k);
        k = key(node.x, node.z);
      }
      return path.reverse();
    }
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (!dx && !dz) continue;
        const nx = cur.x + dx;
        const nz = cur.z + dz;
        if (!inB(nx, nz)) continue;
        const isGoal = nx === goal.x && nz === goal.z;
        if (!isGoal && blocked(nx, nz)) continue;
        if (dx && dz && (blocked(cur.x + dx, cur.z) || blocked(cur.x, cur.z + dz))) continue;
        const nk = key(nx, nz);
        if (closed.has(nk)) continue;
        const g = cur.g + (dx && dz ? 1.414 : 1);
        if (g >= (gScore.get(nk) ?? Infinity)) continue;
        gScore.set(nk, g);
        came.set(nk, { x: cur.x, z: cur.z });
        open.push({ x: nx, z: nz, g, f: g + h(nx, nz) });
      }
    }
  }
  return null;
}
