// world-atlas(countries-110m) 도형 → 게임 국가 ID.
// 대부분 ISO 3166-1 숫자 코드를 그대로 쓰고, 코드가 없는 도형만 이름으로 정한다.
export const NAMELESS_IDS = {
  'N. Cyprus': '1001',
  'Somaliland': '1002',
  'Kosovo': '383',
};

// 사람이 살지 않아 게임에서 빼는 지역
export const EXCLUDED_IDS = new Set(['010', '260']); // 남극, 프랑스령 남방 지역

export function geometryId(geometry) {
  return geometry.id ?? NAMELESS_IDS[geometry.properties?.name] ?? null;
}
