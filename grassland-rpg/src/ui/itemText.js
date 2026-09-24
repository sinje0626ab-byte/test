// 능력치 이름·값 표기와 아이템 툴팁 내용
export function formatStat(items, key, value, sign = true) {
  const pct = items.percentStats.includes(key);
  const n = pct ? `${Math.round(value * 1000) / 10}%` : `${Math.round(value * 10) / 10}`;
  return `${sign && value > 0 ? '+' : ''}${n}`;
}

export function bonusLines(items, bonus) {
  return Object.entries(bonus ?? {})
    .map(([k, v]) => `<div class="tt-bonus">${items.statLabels[k] ?? k} ${formatStat(items, k, v)}</div>`)
    .join('');
}

export function itemTooltip(data, id, { count, hint } = {}) {
  const { grades, categories } = data.items;
  const def = data.items.items[id];
  const grade = grades[def.grade];
  const slotName = def.equipSlot ? ` · ${data.items.equipSlots[def.equipSlot] ?? data.items.equipSlots.accessory1}` : '';
  const max = def.stackable ? def.maxStack ?? data.config.inventory.defaultMaxStack : null;
  return `
    <div class="tt-name" style="color:${grade?.color ?? '#fff'}">${def.name}</div>
    <div class="tt-meta">${grade ? `${grade.name} · ` : ''}${categories[def.category] ?? ''}${slotName}</div>
    ${bonusLines(data.items, def.bonus)}
    ${def.description ? `<p class="tt-desc">${def.description}</p>` : ''}
    ${count != null && max ? `<div class="tt-meta">수량 ${count} / ${max}</div>` : ''}
    ${hint ? `<div class="tt-hint">${hint}</div>` : ''}`;
}
