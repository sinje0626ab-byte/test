// 상점 값: 오늘의 특가면 할인 (반올림, 최소 1)
export const shopPrice = (entry, special) =>
  (special?.id === entry.id ? Math.max(1, Math.round(entry.price * (1 - special.discount))) : entry.price);
