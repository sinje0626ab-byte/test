// 선물·심부름 물건. 편의점·시장·약국에서 산다 (값은 config.js 가 아니라 여기: 가게 진열가라서 문장과 같이 둔다)
//   shop: 파는 곳 (places.js 의 id) · tag: 취향 분류
export const ITEMS = {
  coffee: { name: '캔커피', price: 1_500, shop: 'cvs', tag: 'drink', desc: '편의점 냉장고 맨 아래 칸.' },
  energy: { name: '피로회복제', price: 1_200, shop: 'pharmacy', tag: 'health', desc: '갈색 병. 마시면 기분상 눈이 떠진다.' },
  ramen: { name: '컵라면', price: 1_300, shop: 'cvs', tag: 'food', desc: '큰 컵. 2+1.' },
  onigiri: { name: '삼각김밥', price: 1_400, shop: 'cvs', tag: 'food', desc: '참치마요. 비닐 뜯는 순서가 있다.' },
  umbrella: { name: '비닐우산', price: 5_000, shop: 'cvs', tag: 'useful', desc: '투명. 한 번 쓰면 살이 하나 휜다.' },
  patch: { name: '파스', price: 4_000, shop: 'pharmacy', tag: 'health', desc: '쿨파스 다섯 장.' },
  banchan: { name: '반찬 한 팩', price: 4_000, shop: 'market', tag: 'food', desc: '멸치볶음. 반찬가게에서 금방 했다.' },
  fruit: { name: '사과 한 봉지', price: 6_000, shop: 'market', tag: 'food', desc: '문경 사과 다섯 알.' },
  tteok: { name: '떡 한 팩', price: 3_000, shop: 'market', tag: 'sweet', desc: '꿀떡. 아침에 쪘다.' },
  socks: { name: '양말 세 켤레', price: 5_000, shop: 'market', tag: 'useful', desc: '시장 좌판 떨이. 발목 양말.' },
  flower: { name: '작은 화분', price: 7_000, shop: 'market', tag: 'pretty', desc: '다육이. 물은 한 달에 한 번.' },
  battery: { name: '보조배터리', price: 9_000, shop: 'cvs', tag: 'useful', desc: '만 mAh. 케이블은 따로 판다.' },
};
export const ITEM_ORDER = Object.keys(ITEMS);
export const itemsAt = (shop) => ITEM_ORDER.filter((id) => ITEMS[id].shop === shop);
