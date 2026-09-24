// 시드 난수 — 같은 시드면 같은 월드가 나온다.
export function createRandom(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (min, max) => min + (max - min) * next(),
    int: (min, max) => Math.floor(min + (max - min + 1) * next()),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
  };
}

export const rand = {
  range: (min, max) => min + (max - min) * Math.random(),
  int: (min, max) => Math.floor(min + (max - min + 1) * Math.random()),
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
};
