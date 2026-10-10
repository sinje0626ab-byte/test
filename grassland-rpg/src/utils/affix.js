// 장비 랜덤 옵션 (config.affix). 칸·장착 슬롯에 opts: [[능력치, 값, 품질 0~1], ...] 로 붙는다.
// 장비가 가방(또는 창고)에 처음 들어올 때 굴린다 (InventorySystem.add). 예전 장비는 빈 목록 [].
// 강화(+N)는 기본 능력치만 올리고 옵션은 그대로.

const slotGroup = (def) => (def.equipSlot === 'weapon' ? 'weapon' : def.equipSlot === 'accessory' ? 'accessory' : 'armor');

export function affixTier(data, def) {
  const c = data.config.affix;
  return c.tierByPool[def.pool] ?? c.tierByGrade[def.grade] ?? 1;
}

const roundTo = (v, step) => Math.round(v / step) * step;

// 한 줄 굴리기 (이미 있는 능력치는 피한다)
function rollLine(data, def, have, rng) {
  const c = data.config.affix;
  const group = slotGroup(def);
  const keys = Object.entries(c.stats).filter(([k, s]) => s.slots.includes(group) && !have.has(k) && !(def.bonus?.[k] && ['onHitPoison', 'onHitSlow'].includes(k)));
  if (!keys.length) return null;
  const [key, s] = keys[Math.floor(rng() * keys.length)];
  const q = rng();
  const tier = affixTier(data, def);
  const mult = 1 + s.scale * (tier - 1);
  let v = roundTo((s.min + (s.max - s.min) * q) * mult, s.step);
  if (Math.abs(v) < s.step) v = s.step * Math.sign(s.min || 1);
  return [key, +v.toFixed(4), +q.toFixed(2)];
}

// extra: 상자 등에서 한 줄 더
export function rollOpts(data, id, { extra = 0, rng = Math.random } = {}) {
  const def = data.items.items[id];
  if (def?.category !== 'equipment') return undefined;
  const c = data.config.affix;
  const [lo, hi] = c.lines[def.grade] ?? [0, 1];
  let n = lo + Math.floor(rng() * (hi - lo + 1)) + extra;
  if (rng() < c.luckyLine) n += 1;
  n = Math.min(n, c.maxLines);
  const have = new Set();
  const out = [];
  for (let i = 0; i < n; i++) {
    const line = rollLine(data, def, have, rng);
    if (!line) break;
    have.add(line[0]);
    out.push(line);
  }
  return out;
}

// 재련: 줄 수는 그대로, 능력치·값만 다시
export function rerollOpts(data, id, opts, rng = Math.random) {
  const def = data.items.items[id];
  const have = new Set();
  const out = [];
  const n = Math.max(1, opts?.length ?? 0);
  for (let i = 0; i < n; i++) {
    const line = rollLine(data, def, have, rng);
    if (!line) break;
    have.add(line[0]);
    out.push(line);
  }
  return out;
}

export function rerollCost(data, id) {
  const def = data.items.items[id];
  const r = data.config.affix.reroll;
  const t = affixTier(data, def) - 1;
  return { gold: r.gold[t], items: [{ id: r.item, count: r.count[t] }] };
}

// 옵션 → 능력치 묶음
export function optsBonus(opts) {
  const out = {};
  for (const [k, v] of opts ?? []) out[k] = (out[k] ?? 0) + v;
  return out;
}

export const goodLine = (data, line) => line[2] >= data.config.affix.goodRoll;
