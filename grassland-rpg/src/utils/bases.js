// 위치가 들어 있는 기지 (없으면 null)
export function baseAt(bases, pos, margin = 0) {
  for (const b of bases) {
    const dx = pos.x - b.position.x;
    const dz = pos.z - b.position.z;
    if (dx * dx + dz * dz <= (b.areaRadius + margin) ** 2) return b;
  }
  return null;
}

export function nearestBase(bases, pos) {
  let best = null;
  let bestD = Infinity;
  for (const b of bases) {
    const d = b.position.distanceTo(pos);
    if (d < bestD) { bestD = d; best = b; }
  }
  return best;
}
