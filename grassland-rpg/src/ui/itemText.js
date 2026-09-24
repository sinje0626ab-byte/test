import { enhancedBonus } from '../utils/enhance.js';

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

const LOWER_BETTER = ['damageTaken', 'rollStaminaPct']; // 낮을수록 좋은 능력치

// 장비 비교: 지금 낀 장비와 능력치 차이 (초록 ▲ / 빨강 ▼)
export function compareLines(data, def, plus, cur, curPlus) {
  const items = data.items;
  const a = enhancedBonus(data, def.bonus, plus);
  const b = cur ? enhancedBonus(data, cur.bonus, curPlus) : {};
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  const rows = keys.map((k) => {
    const d = (a[k] ?? 0) - (b[k] ?? 0);
    if (Math.abs(d) < 1e-6) return '';
    const up = LOWER_BETTER.includes(k) ? d < 0 : d > 0;
    return `<div class="tt-cmp ${up ? 'up' : 'down'}">${items.statLabels[k] ?? k} ${up ? '▲' : '▼'} ${formatStat(items, k, Math.abs(d), false)}</div>`;
  }).join('');
  return `<div class="tt-cmp-head">${cur ? `${cur.name}${curPlus ? ` +${curPlus}` : ''}와(과) 비교` : '지금 빈 칸'}</div>${rows || '<div class="tt-cmp">차이 없음</div>'}`;
}

export function itemTooltip(data, id, { count, hint, plus = 0, compare } = {}) {
  const { grades, categories } = data.items;
  const def = data.items.items[id];
  const grade = grades[def.grade];
  const slotName = def.weaponType ? ` · ${data.items.weaponNames[def.weaponType]}`
    : def.equipSlot ? ` · ${data.items.equipSlots[def.equipSlot] ?? data.items.equipSlots.accessory1}` : '';
  const set = Object.values(data.items.sets ?? {}).find((st) => st.pieces.includes(id));
  const max = def.stackable ? def.maxStack ?? data.config.inventory.defaultMaxStack : null;
  return `
    <div class="tt-name" style="color:${grade?.color ?? '#fff'}">${def.name}${plus ? ` <b class="tt-plus">+${plus}</b>` : ''}</div>
    <div class="tt-meta">${grade ? `${grade.name} · ` : ''}${categories[def.category] ?? ''}${slotName}</div>
    ${bonusLines(data.items, enhancedBonus(data, def.bonus, plus))}
    ${plus ? `<div class="tt-meta">강화 +${plus} (기본 능력치 +${Math.round(plus * data.config.enhance.statPerPlus * 100)}%)</div>` : ''}
    ${set ? `<div class="tt-meta">${set.name} (3부위: ${Object.entries(set.bonus).map(([k, v]) => `${data.items.statLabels[k]} ${formatStat(data.items, k, v)}`).join(', ')})</div>` : ''}
    ${def.description ? `<p class="tt-desc">${def.description}</p>` : ''}
    ${count != null && max ? `<div class="tt-meta">수량 ${count} / ${max}</div>` : ''}
    ${compare ?? ''}
    ${hint ? `<div class="tt-hint">${hint}</div>` : ''}`;
}
