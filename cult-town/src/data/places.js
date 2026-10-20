// 장소 이름과 성격. 좌표는 map/layout.js (BUILDINGS · SPOTS).
// 동네·역·큰길은 실제 이름, 가게·교회·절·건물 이름은 전부 지어낸 것이다.
//   type: home · work · shop · religion · leisure · transit · ours
//   sign: 간판 스프라이트 키 (game/signs.js 가 도형으로 그린다. 나중에 같은 키로 이미지를 넣으면 바뀐다)

export const PLACES = {
  cvs: { name: '하루편의점 신림역점', short: '편의점', type: 'shop', sign: 'sign.cvs', desc: '컵라면 2+1 행사 중. 계산대 옆에 우산이 쌓여 있다.' },
  pcbang: { name: '쿼터백 PC방', short: 'PC방', type: 'shop', sign: 'sign.pcbang', desc: '시간당 1,200원. 입구에 컵라면 냄새가 진하다.' },
  pharmacy: { name: '솔잎약국', short: '약국', type: 'shop', sign: 'sign.pharmacy', desc: '진열대 맨 앞에 숙취해소제와 파스.' },
  sanctuary: { name: '동림상가 302호', short: '성소', type: 'ours', sign: 'sign.sanctuary', desc: '3층 계단 끝 왼쪽. 전 세입자가 두고 간 화분이 하나 있다.' },
  restaurant: { name: '봉자네 순댓국', short: '순댓국집', type: 'shop', sign: 'sign.restaurant', desc: '순댓국 9,000원. 깍두기는 셀프.' },
  academy: { name: '푸른숲 수학학원', short: '학원', type: 'work', sign: 'sign.academy', desc: '"이번 모의고사 1등급 12명" 현수막이 걸려 있다.' },
  church: { name: '도림천변교회', short: '교회', type: 'religion', sign: 'sign.church', desc: '오래된 동네 교회. 주보함 옆에 쌀 나눔 상자가 있다.' },
  temple: { name: '솔바람 선원', short: '절', type: 'religion', sign: 'sign.temple', desc: '언덕 끝 작은 절. 마당에 연등이 몇 개 걸려 있다.' },
  fortune: { name: '은방울 철학원', short: '점집', type: 'religion', sign: 'sign.fortune', desc: '"사주·궁합·작명" 간판. 대문에 방울이 달려 있다.' },
  office: { name: '관악로지스 빌딩', short: '사무실 빌딩', type: 'work', sign: 'sign.office', desc: '1층 의원, 2층 물류 사무소, 3층 헬스장.' },
  market: { name: '도림골목시장', short: '시장', type: 'shop', desc: '반찬가게, 과일가게, 생선가게가 한 줄로 붙어 있다.' },
  park: { name: '솔밭 쉼터', short: '공원', type: 'leisure', desc: '벤치 두 개와 운동기구 세 개. 장기판이 늘 펼쳐져 있다.' },
  station: { name: '신림역', short: '신림역', type: 'transit', desc: '2호선. 출근 시간엔 계단이 사람으로 꽉 찬다.' },
  stream: { name: '도림천 산책로', short: '도림천', type: 'leisure', desc: '저녁이면 걷는 사람이 많다.' },
  gosiwon: { name: '청춘고시원', short: '고시원', type: 'home', sign: 'sign.gosiwon', desc: '방 한 칸 1.5평. 공용 주방에 밥과 김치 무료.' },
  oneroom_a: { name: '해맑음하우스', short: '원룸', type: 'home', desc: '반지하 포함 4층 원룸 건물.' },
  oneroom_b: { name: '그린빌 원룸', short: '원룸', type: 'home', desc: '보증금 500에 월세 45.' },
  oneroom_c: { name: '도림스카이빌', short: '원룸', type: 'home', desc: '엘리베이터 없는 5층.' },
  oneroom_d: { name: '세영하우스', short: '원룸', type: 'home', desc: '1층에 세탁소가 있던 자리.' },
  oneroom_e: { name: '다솜원룸', short: '원룸', type: 'home', desc: '현관 비밀번호가 다 닳아서 숫자 네 개만 반짝인다.' },
  oneroom_f: { name: '루프탑 원룸', short: '원룸', type: 'home', desc: '옥탑방이 있다.' },
  villa_tong: { name: '도림빌라', short: '빌라', type: 'home', desc: '통장님이 사는 빌라. 현관에 분리수거 안내문이 세 장.' },
  villa_b: { name: '미소빌라', short: '빌라', type: 'home', desc: '가족들이 많이 사는 빌라.' },
  market_house: { name: '시장 2층 살림집', short: '시장 살림집', type: 'home', door: 'market', desc: '가게 위층에 산다.' },
};

// 일과에서 쓰는 위치 키 → 장소 (spot 이 없으면 건물 안)
export const placeOf = (key) => key.split(':')[0];
