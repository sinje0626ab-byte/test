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

// 대화 선택지: hint는 짧은 행동 설명, fx는 정확한 효과 (ⓘ를 켜거나 길게 누르면 보인다)
export const OPTIONS = {
  askRival: { label: '{라이벌} 얘기 묻기', hint: '저쪽 모임 사정을 슬쩍 묻는다.', fx: '폭로 단서가 모인다. 호감은 거의 그대로.' },
  smalltalk: { label: '안부 잡담', hint: '날씨, 밥, 동네 얘기.', fx: '호감 조금↑. 의심은 안 오른다.' },
  listen: { label: '고민 들어주기', hint: '요즘 뭐가 힘든지 묻는다.', fx: '고민 카드를 고른다. 맞히면 호감 크게↑, 틀리면 조금.' },
  preach: { label: '교단 얘기 꺼내기', hint: '우리 모임 얘기를 꺼낸다.', fx: '친하거나 같은 계열이면 관심↑. 아니면 의심↑.' },
  invite: { label: '성소에 초대하기', hint: '다음 예배에 와 보라고 한다.', fx: '받아들이면 예배일에 온다. 관심이 낮으면 의심↑.' },
  special: { label: '', hint: '우리 교단만의 방식으로.', fx: '교단 유형의 특기. 지금 고민과 맞으면 잘 통한다.' },
  leave: { label: '그냥 인사하고 가기', hint: '', fx: '' },
  // 상황 선택지
  story: { label: '사연 듣기', hint: '요즘 무슨 일 있는지 묻는다.', fx: '친해져서 열린 이야기. 작은 부탁을 받는다.' },
  heard: { label: '들은 얘기 꺼내기', hint: '지나가다 들은 그 사람 고민을 슬쩍.', fx: '맞으면 호감 크게↑, 고민을 알게 된다. 틀리면 조금.' },
  comfort: { label: '', hint: '요즘 일을 묻고 들어 준다.', fx: '호감↑.' },
  exploit: { label: '', hint: '힘든 틈에 모임 얘기를 꺼낸다.', fx: '호감 크게↑. 사기 쪽. 며칠 뒤 의심이 크게 오른다.' },
  fork: { label: '그 뒤의 얘기', hint: '사연의 끝. 이 사람과 어떻게 지낼지.', fx: '고르는 것에 따라 며칠 뒤 결과가 돌아온다.' },
  favorDone: { label: '부탁 들어준 것 알리기', hint: '부탁한 일 해 왔다고 말한다.', fx: '호감 크게↑. 다음 사연이 열린다.' },
  relay: { label: '{이름}의 말 전하기', hint: '맡은 말을 전한다.', fx: '부탁이 끝난다. 오늘 이미 얘기했어도 된다.' },
  gift: { label: '선물 주기', hint: '가방에서 하나 꺼낸다.', fx: '좋아하는 물건이면 호감 크게↑. 사람마다 다르다.' },
  lunch: { label: '점심 같이 먹기', hint: '근처 식당에 같이 간다.', fx: '9,000원 · 피로↑. 호감↑, 외로움↓.' },
  umbrella: { label: '우산 씌워 주기', hint: '비닐우산을 내민다.', fx: '비닐우산 하나를 쓴다. 호감↑.' },
  market: { label: '장 같이 보기', hint: '장바구니를 들어 준다.', fx: '장날에만. 호감↑.' },
  walk: { label: '같이 걷기', hint: '산책로를 한 바퀴 돈다.', fx: '호감↑, 건강 걱정↓.' },
  coffee: { label: '캔커피 건네기', hint: '아침 인사 겸.', fx: '캔커피 하나를 쓴다. 호감 조금↑.' },
};

// 말 걸었을 때 보이는 모습 (지금 고민의 단서). 지문이라 말투와 상관없다.
//   for: 이 지문이 어울리는 주민 묶음 (sim/talk.js hintGroups: elder 어르신 · student 학생 · exam 수험생·취준생 · worker 직장인
//        · shop 가게·장사 · parent 아이 키우는 사람 · night 밤에 일하는 사람 · teen 10대 · all 누구나). 맞는 게 없으면 그 주민 전용 지문 (voices 의 hints)
const H = (t, ...groups) => ({ t, for: groups });
export const HINTS = {
  lonely: [
    H('급식 얘기를 하다 말고 이어폰을 낀다. 친구 단톡방은 조용하다.', 'teen'),
    H('아이 하원 시간 전까지 카페 구석에 혼자 앉아 있다.', 'parent'),
    H('가게 문 닫을 시간인데 셔터를 반만 내리고 서 있다.', 'shop'),
    H('휴대폰 단톡방을 열었다가 아무것도 안 쓰고 닫는다.', 'student', 'exam', 'worker', 'night'),
    H('편의점 도시락을 하나만 산다. 젓가락도 하나.', 'student', 'exam', 'worker', 'night'),
    H('통화 목록 맨 위가 "엄마", 그 아래가 "배달".', 'student', 'exam', 'worker'),
    H('경로당 앞에서 들어갈까 말까 하다가 그냥 지나간다.', 'elder'),
    H('텔레비전 소리를 크게 틀어 놓은 창문. 혼자 웃는 소리가 난다.', 'elder'),
    H('손님 없는 시간, 가게 앞 의자에 앉아 지나가는 사람을 한참 본다.', 'shop'),
    H('놀이터 벤치에서 아이만 보고 있다. 옆에 앉은 사람과는 말이 없다.', 'parent'),
    H('퇴근길 사람들과 반대로 출근한다. 인사할 사람이 없다.', 'night'),
    H('지나가는 사람한테 먼저 "날씨 좀 봐요" 하고 말을 건다.', 'all'),
  ],
  money: [
    H('용돈 남은 걸 지갑에서 꺼내 센다. 동전까지.', 'teen'),
    H('마트 영수증을 다시 펴서 하나씩 짚어 본다.', 'parent', 'elder'),
    H('카드 명세서 문자를 보고 화면을 끈다.', 'student', 'exam', 'worker', 'night', 'parent'),
    H('계산대 앞에서 1+1 상품으로 바꿔 들고 온다.', 'student', 'exam', 'worker', 'night', 'parent'),
    H('가계부 앱 알림이 쌓여 있다.', 'worker', 'parent'),
    H('계산기를 두드리다 장부를 덮는다.', 'shop'),
    H('가게 앞 "가격 인하" 종이를 손으로 다시 붙인다.', 'shop'),
    H('약 봉투 값을 보고 혀를 찬다. "이게 다 얼마야."', 'elder'),
    H('폐지 리어카 손잡이를 고쳐 잡는다. 오늘은 덜 실렸다.', 'elder'),
    H('"이번 달 관리비가 왜 이렇게 나왔지" 혼잣말을 한다.', 'all'),
  ],
  health: [
    H('체육복 무릎이 해졌다. 계단을 한 칸씩 짚고 내려간다.', 'teen'),
    H('아이를 안은 채 허리를 펴다가 얼굴을 찡그린다.', 'parent'),
    H('혈압약 시간 알람이 울린다. 주머니를 더듬는다.', 'elder'),
    H('허리를 짚고 천천히 일어난다.', 'all'),
    H('파스 냄새가 난다.', 'elder', 'shop', 'worker', 'night'),
    H('약 봉투를 주머니에서 꺼냈다 넣었다 한다.', 'elder', 'shop', 'parent'),
    H('계단 앞에서 잠깐 쉬었다가 올라간다.', 'elder'),
    H('무릎을 주무르며 "비 오려나" 한다.', 'elder'),
    H('눈 밑이 까맣다. 에너지 음료 캔을 쥐고 있다.', 'student', 'exam', 'worker', 'night'),
    H('목을 좌우로 돌릴 때 뚝 소리가 난다.', 'worker', 'exam', 'shop'),
    H('하품을 참다가 결국 한다. 해가 떴는데 이제 잘 시간이다.', 'night'),
  ],
  future: [
    H('모의고사 성적표를 가방 깊숙이 밀어 넣는다.', 'teen'),
    H('진로 상담 안내문을 접었다 폈다 한다.', 'teen'),
    H('자식 전화가 오면 "괜찮다" 소리부터 한다. 끊고 나서 한숨.', 'elder'),
    H('가게 앞 "임대 문의" 종이를 오래 쳐다본다. 옆 가게 것이다.', 'shop'),
    H('어린이집 대기 순번 문자를 다시 열어 본다.', 'parent'),
    H('채용 공고 앱을 위로 계속 넘긴다.', 'student', 'exam'),
    H('수험표 사진이 휴대폰 배경 화면이다.', 'exam', 'student'),
    H('달력에 동그라미 친 날짜를 손가락으로 센다.', 'all'),
    H('"내년에도 여기 살 수 있으려나" 하고 원룸 계약서를 본다.', 'student', 'exam', 'worker', 'night'),
    H('회사 메일을 열었다가 "조직 개편" 제목에서 멈춘다.', 'worker'),
    H('가게 임대료 고지서를 접어서 주머니에 넣는다.', 'shop'),
    H('아이 학원 전단을 몇 장 겹쳐 들고 비교한다.', 'parent'),
    H('병원 다음 예약 날짜 쪽지를 지갑에 꽂는다. 자식들한테는 말 안 했다.', 'elder'),
  ],
  meaning: [
    H('교과서 귀퉁이에 낙서만 가득하다. 같은 그림을 몇 번이고 그렸다.', 'teen'),
    H('"우리 땐 말이야" 하다가 들어 줄 사람이 없어 그만둔다.', 'elder'),
    H('장바구니를 든 채 놀이터 그네를 한참 본다.', 'parent'),
    H('셔터 내린 가게 앞에서 담배 한 대를 다 피우고도 서 있다.', 'shop', 'night'),
    H('벤치에 앉아 오래 하늘 쪽을 본다. 비행기가 지나간다.', 'all'),
    H('"내가 이거 왜 하고 있지" 하고 웃는다.', 'student', 'exam', 'worker', 'shop', 'night'),
    H('버스 정류장에서 버스를 두 대 그냥 보낸다.', 'student', 'exam', 'worker'),
    H('서점 비닐봉지에 자기계발서가 두 권 들어 있다.', 'student', 'exam', 'worker'),
    H('옛날 사진 한 장을 지갑에서 꺼내 본다. 모서리가 닳았다.', 'elder'),
    H('간판 불을 끄고도 한참 가게 안에 앉아 있다.', 'shop'),
    H('아이를 들여보낸 어린이집 문 앞에 잠깐 서 있다.', 'parent'),
  ],
};
// 주민 → 지문 묶음 (나이·직업으로)
export function hintGroups(r) {
  const g = new Set(['all']);
  const j = r.job;
  if (r.age >= 60) g.add('elder');
  if (r.age < 20) g.add('teen');                                   // 10대는 따로 (채용 공고·원룸 계약서 같은 지문이 안 나오게)
  else if (/학생|재수|대학교|대학생|대학원|졸업반/.test(j)) g.add('student');
  if (/시험|준비|임용|공시|취업|재수|박사/.test(j) && r.age >= 18) g.add('exam');
  if (/사무|대리|사원|개발|강사|간호|트레이너|보험|제빵|경비|기사|라이더|원장|작가|방송|부동산|조무사|총무|교사/.test(j) && r.age < 65) g.add('worker');
  if (/사장|가게|시장|포장마차|세탁|약사|PC방|순댓국|과일|생선|반찬|고시텔|상인/.test(j)) g.add('shop');
  if (/주부|엄마/.test(j) || /아이 엄마|아이 아빠/.test(r.bio ?? '')) g.add('parent');
  if (/야간|밤 운행|밤/.test(j)) g.add('night');
  return g;
}

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
