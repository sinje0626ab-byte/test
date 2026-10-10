import items from '../data/items.json';
import { itemArt, hintArt } from './itemArt.js';

// 아이템 아이콘: 모든 아이템을 같은 아트 규칙(itemArt.js)으로 그린다
const idOf = new Map(Object.entries(items.items).map(([id, def]) => [def, id]));

// 게임의 아이템 정의(ctx.data)가 이 파일이 읽은 items.json 과 다른 객체일 수도 있어서 이름으로도 찾는다
const byName = new Map(Object.entries(items.items).map(([id, def]) => [`${def.category}|${def.name}`, id]));
export function itemIcon(def, cls) {
  return itemArt(idOf.get(def) ?? byName.get(`${def?.category}|${def?.name}`), def, cls);
}

// 빈 장비 칸에 흐리게 보이는 모양
export function slotHint(equipSlot) {
  return hintArt(equipSlot.startsWith('accessory') ? 'accessory' : equipSlot);
}
