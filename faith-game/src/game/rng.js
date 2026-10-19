// 시드 난수 (mulberry32). 상태(state.rng)에 저장되어 같은 시드면 같은 판이 나온다.
// 게임 로직에서는 Math.random 대신 이것만 쓴다.

export function seedState(seed = (Date.now() ^ 0x9e3779b9) >>> 0) {
  return seed >>> 0;
}

export function rand(state) {
  let t = (state.rng = (state.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const chance = (state, p) => rand(state) < p;
export const randInt = (state, min, max) => min + Math.floor(rand(state) * (max - min + 1));

// 가중치 목록에서 하나 고르기: [{ item, weight }]
export function pickWeighted(state, list) {
  const total = list.reduce((s, x) => s + Math.max(0, x.weight), 0);
  if (total <= 0) return null;
  let r = rand(state) * total;
  for (const x of list) {
    r -= Math.max(0, x.weight);
    if (r <= 0) return x.item;
  }
  return list[list.length - 1].item;
}
