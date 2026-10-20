// 성소 소품 (가격·자리·분위기 수치는 config.js SHOP). 여기는 이름과 설명, 그림 키.
//   sprite: 실내 타일 번호(Roguelike Indoors) 또는 도형 키 'shape.*' (game/SanctuaryScene 이 그린다)

export const SHOP_ITEMS = {
  chair: { name: '접이식 의자 2개', desc: '교회 바자회에서 나온 회색 의자. 앉으면 끼익 소리가 난다.', sprite: 217 },
  cushion: { name: '방석', desc: '시장 이불가게 떨이. 꽃무늬.', sprite: 'shape.cushion' },
  banner: { name: '현수막', desc: '인쇄소에서 3일 걸린다. 교단 이름이 궁서체로 들어간다.', sprite: 'shape.banner' },
  kettle: { name: '전기포트', desc: '1.7리터. 보리차 티백 100개 묶음을 같이 준다.', sprite: 'shape.kettle' },
  light: { name: '형광등 교체', desc: '깜빡이던 형광등을 LED로. 사람 얼굴이 좀 덜 피곤해 보인다.', sprite: 127 },
  board: { name: '화이트보드', desc: '중고. 전 주인이 쓴 "3분기 목표"가 안 지워진다.', sprite: 344 },
  plant: { name: '화분', desc: '고무나무. 물을 일주일에 한 번.', sprite: 16 },
  speaker: { name: '블루투스 스피커', desc: '찬양이든 명상 음악이든 다 튼다. 볼륨 조절 버튼이 하나 없다.', sprite: 392 },
};

export const SHOP_ORDER = ['chair', 'cushion', 'kettle', 'banner', 'light', 'board', 'plant', 'speaker'];
