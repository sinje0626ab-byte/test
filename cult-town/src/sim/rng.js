// 시드 고정 난수 (mulberry32). 상태는 state.rng 한 숫자라 저장·재현이 된다.
export function rand(s) {
  let t = (s.rng = (s.rng + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const chance = (s, p) => rand(s) < p;
export const pick = (s, arr) => arr[Math.floor(rand(s) * arr.length)];
export const between = (s, a, b) => a + rand(s) * (b - a);
export function shuffle(s, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand(s) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
