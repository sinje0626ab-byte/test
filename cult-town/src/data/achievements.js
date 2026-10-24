// 업적·칭호 (28장 B-4). name 이 칭호가 되어 교주 이름 앞에 붙는다 (〈첫 헌금〉 한결). desc 는 수첩 '업적' 탭 한 줄.
// 판정은 sim/achievements.js (같은 id). 순서 = 수첩에 보이는 순서.
export const ACHIEVEMENTS = [
  { id: 'hello', name: '첫 인사', desc: '동네 사람 한 명과 처음 말을 텄다.' },
  { id: 'flyers', name: '전단 세 장', desc: '전단 붙일 자리 세 곳에 다 붙였다.' },
  { id: 'offering', name: '첫 헌금', desc: '헌금 바구니에 처음으로 지폐가 들어왔다.' },
  { id: 'member', name: '첫 신도', desc: '이름 아는 주민이 처음으로 신도가 됐다.' },
  { id: 'momLoan', name: '엄마 찬스', desc: '월세 날 엄마 봉투를 받았다. 다음 달에 갚는다.' },
  { id: 'rent', name: '제날짜 월세', desc: '25일에 월세를 제날짜에 냈다.' },
  { id: 'tong', name: '통장님도 왔다', desc: '통장님이 예배 자리에 한 번 앉았다.' },
  { id: 'umbrella', name: '비 오는 날 우산 셋', desc: '비 오는 날 비닐우산을 세 번 씌워 줬다.' },
  { id: 'story', name: '사연 하나', desc: '주민 한 명의 부탁을 처음 끝까지 들어줬다.' },
  { id: 'storyAll', name: '끝까지 들은 사람', desc: '한 사람의 사연을 마지막 장까지 봤다.' },
  { id: 'stories5', name: '다섯 집 사정', desc: '다섯 사람의 부탁을 들어줬다.' },
  { id: 'members10', name: '열 명', desc: '신도가 열 명을 넘었다.' },
  { id: 'meetAll', name: '동네 사람 다 안다', desc: '신림동 주민 서른 명과 다 인사했다.' },
  { id: 'worshipMonth', name: '한 달 개근 예배', desc: '수요일·일요일 예배를 여덟 번 연달아 열었다.' },
  { id: 'bigSermon', name: '손수건 설교', desc: '예배 분위기가 끝까지 올라가 앞줄에서 손수건이 나왔다.' },
  { id: 'sign2', name: '아크릴 간판', desc: '창문 시트지를 떼고 아크릴 간판을 달았다.' },
  { id: 'level5', name: '레벨 5', desc: '교주 레벨이 5가 됐다.' },
  { id: 'expand', name: '벽을 텄다', desc: '303호와 벽을 터서 방이 넓어졌다.' },
  { id: 'officer', name: '첫 간부', desc: '첫 신도 한 명을 간부로 세웠다.' },
  { id: 'members100', name: '백 명', desc: '신도가 백 명을 넘었다.' },
  { id: 'zealot', name: '불붙은 사람', desc: '첫 열혈 신자가 생겼다.' },
  { id: 'rent3', name: '석 달 연속', desc: '월세를 석 달 연속 제날짜에 냈다.' },
  { id: 'sign3', name: '외벽 간판', desc: '외벽에 큰 간판이 올라가고 저녁마다 불이 켜진다.' },
  { id: 'rival', name: '라이벌 정리', desc: '옆 교단과의 일이 흡수·몰락·휴전 중 하나로 끝났다.' },
  { id: 'branch', name: '봉천 지부', desc: '고개 넘어 봉천동에 지부를 냈다.' },
  { id: 'members300', name: '삼백 명', desc: '신도가 삼백 명을 넘었다.' },
];
export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// 작은 보상 띠 (28장 B-1). {이름} {장소}
export const REWARD_TEXT = {
  bond1: '{이름}와(과) 말이 통하기 시작했다',
  bond2: '{이름}이(가) 먼저 인사한다',
  bond3: '{이름}이(가) 302호 얘기를 남한테 한다',
  visit: '처음 가 본 곳: {장소}',
  offering: '첫 헌금이 들어왔다',
  story: '{이름}의 부탁을 끝냈다',
};
