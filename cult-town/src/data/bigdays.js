// 매주 '큰 날' (25장 D). 그날 맵에 실제로 열리고(좌판·현수막·사람 몰림), 그날만 할 수 있는 행동 1~2개.
// 효과 숫자는 config.js BIGDAY · sim/bigdays.js. 기성 종교 행사는 진지하게, 풍자는 우리 쪽 선택지에만.
//   place: 장소 id (where: 장소 이름 대신 쓸 말) · spot: 사람이 몰리는 자리 · from/to: 시각(분) · banner: 맵 현수막 글자
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
    name: '도림천 벚꽃 주말', place: 'stream', zone: 'stream', spot: 'stream:cherry', spots: ['stream:cherry', 'stream:path', 'stream:bench', 'stream:fountain'], from: 780, to: 1080, banner: '벚꽃길',
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
  // ── 30장 새 구역의 큰 날 (구역이 열린 뒤 2주마다 같은 요일, 이삿날은 그달 마지막 날). 몰리는 사람은 그 구역 주민 ──
  mill_day: {
    name: '방앗간 고추 빻는 날', place: 'm_mill', where: '고소방앗간 앞', zone: 'market_in', spot: 'm_mill:front', spots: ['m_mill:front', 'm_alley:stalls', 'm_ricecake:front'], from: 600, to: 900, banner: '고추 빻는 날',
    intro: '고소방앗간 앞에 고추 자루가 줄을 섰다. 기계가 쉬지 않고 돌고, 골목 끝까지 매운 냄새가 번진다.',
    actions: {
      sacks: { label: '고추 자루 날라 주기', hint: '방앗간 부자를 거든다 · 피곤하다', done: '고추 자루를 열두 개 옮겼다. 방성태 사장님이 기침 사이로 "고마워요" 했다.' },
      tea: { label: '줄 선 사람들한테 보리차 돌리기', hint: '1만 원', done: '종이컵 보리차가 금방 동났다. 줄 선 할머니 한 분이 매운 눈을 비비며 받아 갔다.' },
    },
  },
  exam_day: {
    name: '시험 발표날', place: 'g_lane', where: '고시촌 게시판', zone: 'gosi', spot: 'g_lane:board', spots: ['g_lane:board', 'g_cupbap:front', 'g_reading:smoke'], from: 600, to: 840, banner: '합격자 발표',
    intro: '고시촌 게시판 앞이 조용하다. 다들 휴대폰 화면만 내려다본다. 컵밥집 사장님이 오늘은 밥을 더 퍼 둔다.',
    actions: {
      cupbap: { label: '컵밥 한 그릇씩 사 주기', hint: '2만 원 · 아무것도 묻지 않는다', done: '컵밥 열 그릇을 샀다. 받은 사람 중 둘은 끝내 휴대폰을 보지 않고 먹었다.' },
      flyers: { label: '게시판 옆에 전단 붙이기', hint: '떨어진 사람들 눈에 띈다 · 무례하다', done: '게시판 옆에 전단을 붙였다. 복사집 사장님이 말없이 떼어 접었다.' },
    },
  },
  sundae_night: {
    name: '순댓국 골목 늦은 밤', place: 's_lane', where: '빨간포차 천막', zone: 'sundae', spot: 's_lane:tables', spots: ['s_lane:tables', 's_sundae_a:front', 's_sundae_b:front'], from: 1080, to: 1230, banner: '늦은 밤 국밥',
    intro: '금요일 밤. 세 집 솥에서 김이 오르고, 빨간포차 천막 아래 플라스틱 의자가 모자란다.',
    actions: {
      treat: { label: '국밥 한 턱 내기', hint: '3만 원', done: '국밥 여섯 그릇 값을 냈다. 대리기사 한 분이 "잘 먹겠습니다" 하고 국물부터 마셨다.' },
      listen: { label: '포차에서 사장님들 얘기 들어 주기', hint: '늦게까지 앉아 있는다 · 피곤하다', done: '사장님 셋이 번갈아 장사 얘기를 했다. 소주는 한 잔만 받았다.' },
    },
  },
  moving_day: {
    name: '이삿짐 많은 말일', place: 'h_lane', where: '언덕 계단', zone: 'hill', spot: 'h_lane:stairs', spots: ['h_lane:stairs', 'h_lane:top', 'h_cvs:front'], from: 600, to: 960, banner: '이삿날',
    intro: '그달 마지막 날. 언덕 계단에 이삿짐 상자가 층층이 쌓였다. 사다리차는 언덕 아래서 멈췄다.',
    actions: {
      carry: { label: '이삿짐 계단 나르기', hint: '상자를 나른다 · 아주 피곤하다', done: '상자를 들고 계단을 여러 번 오르내렸다. 하길수 어르신이 계단 모서리를 걸레로 감싸 두었다.' },
      boxes: { label: '편의점 빈 상자 모아 나눠 주기', hint: '5천 원 · 테이프 값', done: '빈 상자와 테이프를 계단 아래에 쌓아 뒀다. 오정란 점장님이 상자에 "가져가세요"라고 써 붙였다.' },
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
