// 성벽 원형 배치: 기지 둘레 반지름 R = areaRadius − ringInset 원을 segment(1m) 길이 칸으로 나눈다.
// 남쪽(+z, 중심 건물 문 앞)에 gateSlots 칸만큼 입구를 비운다. 사면 뒤쪽(북)에서 시작해 양옆으로 번갈아 쌓여 입구에서 만난다.
// 칸마다 몬스터 충돌·길찾기용 1m 격자 칸(cells)도 정한다 (대각선으로 이어진 칸은 길찾기가 모서리 통과를 막아 새지 않는다).
export function ringSlots(base, cfg) {
  const R = base.areaRadius - cfg.ringInset;
  const n = Math.max(12, Math.round((2 * Math.PI * R) / cfg.segment));
  const step = (2 * Math.PI) / n;
  const bx = base.position.x;
  const bz = base.position.z;
  const owned = new Set();
  const slots = [];
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + k * step; // k = 0 이 북쪽(뒤)
    const toGate = Math.abs(Math.atan2(Math.sin(a - Math.PI / 2), Math.cos(a - Math.PI / 2)));
    const gate = toGate < (cfg.gateSlots / 2) * step;
    const cells = [];
    for (let s = 0; s <= 8; s++) {
      const t = a - step / 2 + (step * s) / 8;
      const cx = Math.floor(bx + Math.cos(t) * R);
      const cz = Math.floor(bz + Math.sin(t) * R);
      const key = `${cx},${cz}`;
      if (owned.has(key)) continue;
      owned.add(key);
      cells.push([cx, cz]);
    }
    slots.push({ k, gate, x: bx + Math.cos(a) * R, z: bz + Math.sin(a) * R, rot: -a - Math.PI / 2, cells });
  }
  // 쌓는 순서: 0(북) → 1, n−1 → 2, n−2 … (입구 칸은 빼고)
  const order = [0];
  for (let i = 1; i <= n / 2; i++) {
    order.push(i);
    if (n - i !== i) order.push(n - i);
  }
  return { R, n, slots, order: order.filter((k) => !slots[k].gate) };
}
