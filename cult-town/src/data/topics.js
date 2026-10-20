// 고민 카드와 대화 선택지 이름.
// 원칙: 선택지는 '행동의 이름'만 쓴다. 교주가 실제로 무슨 말로 설득하는지는 쓰지 않는다.

export const NEED_NAMES = {
  lonely: '외로움',
  money: '돈 걱정',
  health: '건강',
  future: '미래 불안',
  meaning: '의미',
};

// 고민 카드 (고민 들어주기에서 고른다)
export const CARDS = {
  lonely: { name: '외로움', icon: '💬', desc: '저녁을 혼자 먹는 날이 많다' },
  money: { name: '돈 걱정', icon: '💸', desc: '카드값, 월세, 가게 매출' },
  health: { name: '건강', icon: '💊', desc: '허리, 무릎, 잠, 혈압' },
  future: { name: '미래 불안', icon: '📅', desc: '시험, 취업, 계약 만료' },
  meaning: { name: '의미', icon: '❔', desc: '이렇게 살아도 되나 싶은 마음' },
};

// 무교 주민이 잘 받아 주는 고민 (종교색 없는 것)
export const SECULAR_NEEDS = ['lonely', 'health', 'future', 'money'];

// 대화 선택지 이름
export const OPTIONS = {
  smalltalk: { label: '안부 잡담', hint: '안전하다. 조금 친해진다.' },
  listen: { label: '고민 들어주기', hint: '고민 카드를 하나 고른다. 지금 고민과 맞으면 크게 친해진다.' },
  preach: { label: '교단 얘기 꺼내기', hint: '친하거나 같은 계열이면 통한다. 아니면 의심을 산다.' },
  invite: { label: '성소에 초대하기', hint: '다음 예배에 오라고 한다.' },
  special: { label: '', hint: '교단 유형마다 다른 특기.' },
  leave: { label: '그냥 인사하고 가기', hint: '' },
};

// 말 걸었을 때 보이는 모습 (지금 고민의 단서). 지문이라 말투와 상관없다.
export const HINTS = {
  lonely: [
    '휴대폰 단톡방을 열었다가 아무것도 안 쓰고 닫는다.',
    '편의점 도시락을 하나만 산다. 젓가락도 하나.',
    '지나가는 사람한테 먼저 "날씨 덥죠" 하고 말을 건다.',
    '통화 목록 맨 위가 "엄마", 그 아래가 "배달".',
  ],
  money: [
    '카드 명세서 문자를 보고 화면을 끈다.',
    '계산대 앞에서 1+1 상품으로 바꿔 들고 온다.',
    '가계부 앱 알림이 세 개 쌓여 있다.',
    '"이번 달 관리비가 왜 이렇게 나왔지" 혼잣말을 한다.',
  ],
  health: [
    '허리를 짚고 천천히 일어난다.',
    '파스 냄새가 난다.',
    '약 봉투를 주머니에서 꺼냈다 넣었다 한다.',
    '계단 앞에서 잠깐 쉬었다가 올라간다.',
  ],
  future: [
    '채용 공고 앱을 위로 계속 넘긴다.',
    '달력에 동그라미 친 날짜를 손가락으로 센다.',
    '"내년에도 여기 살 수 있으려나" 하고 원룸 계약서를 본다.',
    '수험표 사진이 휴대폰 배경 화면이다.',
  ],
  meaning: [
    '벤치에 앉아 오래 하늘 쪽을 본다. 비행기가 지나간다.',
    '"내가 이거 왜 하고 있지" 하고 웃는다.',
    '버스 정류장에서 버스를 두 대 그냥 보낸다.',
    '서점 비닐봉지에 자기계발서가 두 권 들어 있다.',
  ],
};

// 프로필 카드에 쓰는 '우리 교단에 대한 인상' (호감·의심 숫자를 말로)
export const IMPRESSION = [
  { sus: 60, text: '"그 302호 사람들? 엮이지 마요."' },
  { sus: 40, text: '"요즘 302호 들락거리는 사람들 좀 이상하던데."' },
  { like: 70, text: '"거기 사람들 좋아요. 수요일에도 가 볼까 해요."' },
  { like: 45, text: '"302호요? 차 한잔 얻어 마셔 봤는데 나쁘진 않던데."' },
  { like: 25, text: '"아 그 사람. 말은 잘 들어 주더라."' },
  { like: 0, text: '"302호에 뭐가 생겼어요? 처음 듣는데."' },
];

export const STAGE_NAMES = {
  none: '무관심',
  curious: '관심',
  visitor: '방문 약속',
  newcomer: '새신자',
  member: '신도',
};

export const RELIGION_NAMES = {
  protestant: '개신교',
  catholic: '천주교',
  buddhist: '불교',
  folk: '민간신앙',
  none: '무교',
};

export const RELATION_NAMES = { family: '가족', friend: '친구', coworker: '동료' };
