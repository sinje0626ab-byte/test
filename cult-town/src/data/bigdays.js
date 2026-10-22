// 매주 '큰 날' (25장 D). 그날 맵에 실제로 열리고(좌판·현수막·사람 몰림), 그날만 할 수 있는 행동 1~2개.
// 효과 숫자는 config.js BIGDAY · sim/bigdays.js. 기성 종교 행사는 진지하게, 풍자는 우리 쪽 선택지에만.
//   place: 장소 id · spot: 사람이 몰리는 자리 · from/to: 시각(분) · banner: 맵 현수막 글자
export const BIGDAY_TEXT = {
  market_dum: {
    name: '장날 · 덤 주는 날', place: 'market', spot: 'market:walk', spots: ['market:walk', 'market:entrance', 'market:banchan', 'market:fruit', 'market:fish'], from: 600, to: 960, banner: '오늘 덤 주는 날',
    intro: '시장 입구에 "오늘 덤 주는 날" 현수막. 반찬가게 사장님이 콩자반을 한 국자씩 더 얹어 준다.',
    actions: {
      dum: { label: '우리도 덤 나눠 주기', hint: '보리차 한 컵씩 · 1만 원', done: '종이컵 보리차를 쟁반에 받쳐 들고 시장을 한 바퀴 돌았다. "이건 덤이에요."' },
      carry: { label: '장바구니 들어 주기', hint: '사장님들 짐을 나른다 · 피곤하다', done: '사과 박스를 세 번 날랐다. 과일가게 사장님이 사과 하나를 주머니에 넣어 줬다.' },
    },
  },
  assembly: {
    name: '반상회', place: 'park', spot: 'park:plaza', spots: ['park:plaza', 'park:bench1', 'park:bench2'], from: 1080, to: 1170, banner: '3월 반상회',
    intro: '솔밭 쉼터 벤치에 플라스틱 의자가 둥글게 놓였다. 통장님이 안건 종이를 나눠 준다. "상가 저녁 소음 규칙."',
    actions: {
      yes: { label: '안건 찬성 (저녁 아홉 시 전 조용히)', hint: '통장님 편', done: '손을 들었다. 통장님이 "302호도 찬성" 하고 받아 적었다.' },
      no: { label: '안건 반대 (모임은 늦게 끝날 수도)', hint: '우리 신도들 편', done: '반대 쪽에 혼자 손을 들었다. 의자 끄는 소리가 났다.' },
    },
  },
  bazaar: {
    name: '교회 바자회', place: 'church', spot: 'church:yard', spots: ['church:yard', 'station:plaza'], from: 660, to: 960, banner: '도림천변교회 바자회',
    intro: '교회 마당에 천막 두 개. 헌 옷, 떡, 직접 담근 매실청. 수익금은 쌀 나눔에 쓴다고 적혀 있다.',
    actions: {
      buy: { label: '바자회에서 떡 사기', hint: '1만 5천 원 · 예의 바르게', done: '인절미 한 팩을 샀다. 봉사하시는 분이 "또 오세요" 했다. 우리가 누군지는 묻지 않았다.' },
      stall: { label: '교회 마당 옆에 우리 좌판 펴기', hint: '돈은 남지만 무례하다', done: '교회 담 옆에 돗자리를 폈다. 보리차와 전단. 권사님 한 분이 한참 쳐다보다 들어갔다.' },
    },
  },
  umbrella: {
    name: '비 오는 날 우산 나눔', place: 'station', spot: 'station:plaza', spots: ['station:plaza', 'station:exit3', 'station:exit4'], from: 480, to: 600, banner: '우산 나눔', rain: true,
    intro: '아침부터 비. 역 3번 출구 앞에서 우산 없는 사람들이 가방을 머리에 이고 뛴다.',
    actions: {
      share: { label: '비닐우산 나눠 주기', hint: '우산 스무 개 · 3만 원', done: '비닐우산 스무 개가 십오 분 만에 없어졌다. 받은 사람 몇이 우산에 붙은 스티커를 봤다.' },
    },
  },
  cherry: {
    name: '도림천 벚꽃', place: 'stream', spot: 'stream:path', spots: ['stream:path', 'stream:bridge', 'park:walk'], from: 780, to: 1080, banner: '벚꽃길',
    intro: '도림천 산책로에 벚꽃이 한꺼번에 폈다. 휴대폰 든 사람들이 다리 위에 줄을 섰다.',
    actions: {
      photo: { label: '사진 찍어 주기', hint: '"찍어 드릴까요?"', done: '스무 장쯤 찍어 줬다. 다들 첫 장보다 셋째 장이 낫다고 했다.' },
      flyers: { label: '벚꽃길에 전단 돌리기', hint: '많이 돌지만 눈총도 받는다', done: '전단이 꽃잎이랑 같이 바닥에 깔렸다. 청소하시는 분이 한숨을 쉬었다.' },
    },
  },
  festival: {
    name: '동네 축제', place: 'market', spot: 'market:entrance', spots: ['market:entrance', 'market:walk', 'market:banchan', 'market:fruit'], from: 720, to: 1080, banner: '도림골목 한마당',
    intro: '시장 입구에 무대가 섰다. 노래자랑 접수대 앞에 줄이 길다. 부스 자리는 아직 하나 남았다.',
    actions: {
      booth: { label: '보리차 부스 열기', hint: '2만 원 · 하루 종일', done: '보리차 부스에 줄이 섰다. 컵이 모자라 편의점을 두 번 갔다.' },
      stage: { label: '노래자랑 나가기', hint: '카리스마가 높으면 박수', done: '' },
    },
    stageWin: '트로트 한 곡. 시장 사장님들이 박수를 쳤다. 누가 "302호 사람이래" 했다.',
    stageLose: '음이 두 번 나갔다. 사회자가 "용기에 박수!" 했다.',
  },
  rival_open: {
    name: '라이벌 교단 개업식', place: 'office', spot: 'office:smoke', spots: ['office:smoke', 'station:exit4'], from: 840, to: 1020, banner: '개업식',
    intro: '관악로지스 빌딩 앞에 화환이 줄을 섰다. 저쪽 모임 개업식이다. 떡 돌리는 사람이 보인다.',
    actions: {
      peek: { label: '구경 가서 떡 받아 오기', hint: '저쪽 사정을 엿본다', done: '시루떡 한 조각을 받았다. 저쪽 사람들 명찰 이름을 몇 개 외웠다.' },
      wreath: { label: '화환 보내기', hint: '7만 원 · 예의 차리기', done: '"번창하세요" 리본을 단 화환을 보냈다. 저쪽 교주가 사진을 찍어 갔다.' },
    },
  },
};

export const BIGDAY_UI = {
  calendar: '달력',
  today: '오늘: {이름} · {장소} {시간}',
  near: '행사: {이름}',
  done: '오늘 행사에서 할 일은 했다.',
  none: '다가오는 큰 날이 없다.',
};
