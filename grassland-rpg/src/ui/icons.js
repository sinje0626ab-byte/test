// 아이템 아이콘: 장비는 부위별 모양(SVG), 나머지는 동그란 보석
const EDGE = 'stroke="rgba(60,40,20,.45)" stroke-width="1"';
const SHAPES = {
  weapon: (c) => `<path d="M19 2l3 3-11 11-3-3z" fill="${c}" ${EDGE}/><path d="M5 13l6 6-2 1-5-5z" fill="#c9a44a" ${EDGE}/><path d="M6 18l-3 3" stroke="#8a6440" stroke-width="3" stroke-linecap="round"/>`,
  head: (c) => `<path d="M4 16a8 8 0 0 1 16 0z" fill="${c}" ${EDGE}/><rect x="2" y="15" width="20" height="4" rx="2" fill="${c}" ${EDGE}/>`,
  body: (c) => `<path d="M7 3l5 3 5-3 4 4-2 3v11H5V10L3 7z" fill="${c}" ${EDGE}/><path d="M12 6v15" stroke="rgba(60,40,20,.3)"/>`,
  feet: (c) => `<path d="M5 4h7v9l7 3a2 2 0 0 1 2 2v3H5z" fill="${c}" ${EDGE}/>`,
  accessory: (c) => `<circle cx="12" cy="14" r="6" fill="none" stroke="${c}" stroke-width="3.5"/><path d="M12 2l4 5h-8z" fill="#bfefff" ${EDGE}/>`,
};

export function itemIcon(def) {
  const shape = def.category === 'equipment' && SHAPES[def.equipSlot];
  if (shape) return `<svg class="item-svg" viewBox="0 0 24 24" aria-hidden="true">${shape(def.color)}</svg>`;
  return `<i class="item-icon" style="--c:${def.color}"></i>`;
}

// 빈 장비 칸에 흐리게 보이는 모양
export function slotHint(equipSlot) {
  const key = equipSlot.startsWith('accessory') ? 'accessory' : equipSlot;
  return `<svg class="item-svg hint" viewBox="0 0 24 24" aria-hidden="true">${SHAPES[key]('#d8ccb0')}</svg>`;
}
