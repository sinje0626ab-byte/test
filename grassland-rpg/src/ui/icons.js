import items from '../data/items.json';
import { itemArt, hintArt } from './itemArt.js';

// 아이템 아이콘: 모든 아이템을 같은 아트 규칙(itemArt.js)으로 그린다
const idOf = new Map(Object.entries(items.items).map(([id, def]) => [def, id]));

export function itemIcon(def, cls) {
  return itemArt(idOf.get(def), def, cls);
}

// 빈 장비 칸에 흐리게 보이는 모양
export function slotHint(equipSlot) {
  return hintArt(equipSlot.startsWith('accessory') ? 'accessory' : equipSlot);
}
