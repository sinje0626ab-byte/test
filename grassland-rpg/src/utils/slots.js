// 칸 목록(가방·창고 공용): 칸마다 { id, count, plus? } 또는 null (plus = 장비 강화 단계)
export const maxStackOf = (data, id) => {
  const d = data.items.items[id];
  return d.stackable ? (d.maxStack ?? data.config.inventory.defaultMaxStack) : 1;
};

export const countIn = (slots, id) => slots.reduce((n, s) => n + (s?.id === id ? s.count : 0), 0);

// 들어갈 수 있는 개수 (실제로 넣지는 않음)
export function roomFor(slots, id, max) {
  let room = 0;
  for (const s of slots) {
    if (!s) room += max;
    else if (s.id === id) room += Math.max(0, max - s.count);
  }
  return room;
}

// 넣은 개수를 돌려준다. 같은 아이템(같은 강화 단계) 칸부터 채우고 빈칸에 넣는다.
export function addTo(slots, id, count, max, plus = 0) {
  let left = count;
  for (const s of slots) {
    if (left <= 0) break;
    if (s?.id !== id || s.count >= max || (s.plus ?? 0) !== plus) continue;
    const n = Math.min(left, max - s.count);
    s.count += n;
    left -= n;
  }
  for (let i = 0; i < slots.length && left > 0; i++) {
    if (slots[i]) continue;
    const n = Math.min(left, max);
    slots[i] = plus ? { id, count: n, plus } : { id, count: n };
    left -= n;
  }
  return count - left;
}

// 뺀 개수를 돌려준다. 뒤쪽 칸부터 뺀다.
export function removeFrom(slots, id, count) {
  let left = count;
  for (let i = slots.length - 1; i >= 0 && left > 0; i--) {
    const s = slots[i];
    if (s?.id !== id) continue;
    const n = Math.min(left, s.count);
    s.count -= n;
    left -= n;
    if (s.count <= 0) slots[i] = null;
  }
  return count - left;
}
