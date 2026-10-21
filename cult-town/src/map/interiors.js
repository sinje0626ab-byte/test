// 성소 실내 지도 (공간 단계마다 한 장). build-map 이 Tiled JSON 으로 뽑고, SanctuaryScene·sim/space.js 가 같이 쓴다.
//   rooms: 칸(slot)마다 방 자리. slot '302' 는 처음부터 예배실.
//   walls: 칸 사이 벽 (gap: 문이 뚫린 줄 범위) · doors: 밖(동네)으로 나가는 계단 · stairs: 다른 층으로 가는 계단
// 302 의 단상·책상·상담 의자는 방 왼쪽 위 기준 같은 자리 (furniture302).

const room = (slot, x, w) => ({ slot, x, y: 2, w, h: 10, rug: slot === '302' });
const pulpitOf = (r) => ({ pulpit: [r.x + 8, 3], desk: [r.x + 14, 3], counsel: [r.x + 1, 4] });

function floor3(id, rooms, walls, w) {
  const r302 = rooms.find((r) => r.slot === '302');
  const f = pulpitOf(r302);
  const door = [r302.x + 8, 12];
  return {
    id, floor: 3, w, h: 13, rooms, walls, doors: [door],
    stairs: w > 40 ? [{ x: w - 4, y: 12, to: 2 }, { x: w - 2, y: 12, to: 4 }] : [],
    furniture302: f, blocked: [f.pulpit, f.desk, f.counsel],
  };
}

export const SPACE_MAPS = [
  floor3('3a', [room('302', 1, 16)], [], 18),
  floor3('3b', [room('302', 1, 16), room('303', 17, 12)], [], 30),
  floor3('3c', [room('301', 1, 12), room('302', 14, 16), room('303', 30, 12), room('304', 43, 10)],
    [{ x: 13, y: 2, h: 10, gap: [7, 10] }, { x: 42, y: 2, h: 10, gap: [7, 10] }], 54),
  { id: '2', floor: 2, w: 40, h: 13, rooms: [room('201', 1, 18), room('202', 21, 18)], walls: [{ x: 20, y: 2, h: 10, gap: [7, 10] }],
    doors: [], stairs: [{ x: 37, y: 12, to: 3 }], blocked: [] },
  { id: '4', floor: 4, w: 40, h: 13, rooms: [room('401', 1, 18), room('402', 21, 18)], walls: [{ x: 20, y: 2, h: 10, gap: [7, 10] }],
    doors: [], stairs: [{ x: 37, y: 12, to: 3 }], blocked: [] },
];
export const SPACE_MAP_BY_ID = Object.fromEntries(SPACE_MAPS.map((m) => [m.id, m]));

// 공간 단계 → 층별 지도
export function mapsForStep(step) {
  const out = { 3: step === 0 ? '3a' : step === 1 ? '3b' : '3c' };
  if (step >= 3) out[2] = '2';
  if (step >= 4) out[4] = '4';
  return out;
}
