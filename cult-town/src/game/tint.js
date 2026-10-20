// 시간대 색조: 맵 위에 반투명 사각형 하나. 아침 노랑 · 낮 없음 · 저녁 주황 · 밤 남색.
const KEYS = [
  { at: 7 * 60, color: [255, 214, 140], a: 0.12 },
  { at: 10 * 60, color: [255, 240, 200], a: 0.0 },
  { at: 16 * 60, color: [255, 240, 200], a: 0.0 },
  { at: 18 * 60, color: [255, 150, 70], a: 0.16 },
  { at: 20 * 60, color: [120, 70, 120], a: 0.28 },
  { at: 21 * 60, color: [30, 30, 90], a: 0.45 },
  { at: 24 * 60, color: [20, 20, 70], a: 0.55 },
];

export function tintAt(minute) {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].at <= minute) i++;
  const a = KEYS[i]; const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const t = b.at === a.at ? 0 : Math.max(0, Math.min(1, (minute - a.at) / (b.at - a.at)));
  const c = a.color.map((v, k) => Math.round(v + (b.color[k] - v) * t));
  return { color: (c[0] << 16) | (c[1] << 8) | c[2], alpha: a.a + (b.a - a.a) * t };
}
