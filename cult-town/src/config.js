// ★ 모든 수치는 여기 한 곳. 문장은 src/data/ 아래.

export const GAME = {
  title: '',                     // 게임 이름(미정). 정해지면 여기만.
  saveKey: 'cult-town-save',
  saveVersion: 4,
  startMoney: 400_000,           // 교주 지갑 = 교단 돈 (원)
  startAge: { min: 25, max: 60, default: 38 },
};

// ── 시간 ── 1일 = 실제 약 5분 30초 (낮 4분 40초 + 밤 메뉴). 07:00~21:00 이 걸어 다니는 낮.
export const CLOCK = {
  dayStart: 7 * 60,              // 분
  dayEnd: 21 * 60,               // 이때 "성소로 돌아가세요"
  forceHome: 22 * 60,            // 이때까지 안 들어가면 자동 귀가 (피로 +)
  minutesPerSecond: 3,           // 1배속: 실제 1초 = 게임 3분 → 14시간 = 280초 (걷는 속도는 MOVE 의 칸/초로 따로 정한다)
  fastFactor: 2,
  daysPerMonth: 5,               // 압축 달력: 한 달 = 5일 (월세는 5일마다 말일 밤). 요일·예배·주보는 7일 주기 그대로
  weekdays: ['월', '화', '수', '목', '금', '토', '일'],
  phases: [                      // 시간대 (색조와 주민 일과 기준)
    { id: 'morning', name: '아침', from: 7 * 60 },
    { id: 'day', name: '낮', from: 11 * 60 },
    { id: 'evening', name: '저녁', from: 17 * 60 },
    { id: 'night', name: '밤', from: 21 * 60 },
  ],
  worshipDays: [2, 6],           // 수(2)·일(6) 밤 예배
};

// ── 이동 ──
export const MOVE = {
  tile: 16,
  // 걷는 속도는 현실 1초당 칸 수 (1배속). 2배속이면 2배. 시뮬레이터는 ÷ minutesPerSecond 로 칸/게임분을 쓴다
  playerTilesPerSecond: 3,
  playerRunTilesPerSecond: 4.5,  // Shift · 모바일 방향키 길게
  runFatiguePerTile: 0.05,       // 달리면 걸음마다 피로 더
  resident: { base: [1.8, 2.2], old: [1.4, 1.7], young: [2.2, 2.6], npc: 2.0 },   // 칸/초 [최소, 최대] (사람마다 정해짐)
  rainMul: 1.15,                 // 비 오는 날 빨리 걷는다
  lateMul: 0.85,                 // 20시 넘어 귀가할 땐 느리게
  lateFrom: 20 * 60,
  // 가는 길에 멈춤 (현실 초 → 게임분으로 바꿔 씀)
  pauseChance: 0.022,            // 한 칸 갈 때마다
  signalChance: 0.5,             // 횡단보도 앞에서 신호 기다릴 확률
  pauseSeconds: [2, 4],
  yieldSeconds: 0.6,             // 좁은 길에서 마주치면 한쪽이 기다리는 시간
};

// ── 주민 욕구 ── 0~100 (높을수록 그 고민이 크다)
export const NEEDS = {
  keys: ['lonely', 'money', 'health', 'future', 'meaning'],
  dailyDrift: 6,                 // 하루 사이 무작위로 흔들리는 폭
  topThreshold: 55,              // 이 이상이면 "지금 고민"으로 표시
};

// ── 포교 ──
export const TALK = {
  dailyFatigueLimit: 100,        // 피로가 이만큼이면 더 말을 못 건다
  fatiguePerTalk: 11,
  fatiguePerTile: 0.02,
  oncePerDay: true,
  // 선택지 기본 효과 (호감 / 의심)
  smalltalk: { like: 4, sus: 0 },
  listen: { match: 14, partial: 7, miss: 2, sus: 0 },   // 지금 고민과 맞음 / 두 번째 고민 / 틀림
  preach: { like: 6, sus: 9, likeGate: 50, sameFamilyBonus: 8, secularSus: 10 },
  invite: { likeGate: 55, accept: 0.85, refuseSus: 6 },
  special: { like: 10, sus: 3 },
  sameFamilyLike: 1.35,          // 같은 계열 신자: 호감 상승 배율
  friendBonus: 10,               // 지인이 신도면 첫 대화 호감 +
  familyAgainstSus: 12,          // 가족이 신도가 되면 다른 가족 의심 +
  suspicionDecay: 2,             // 하루마다 의심 자연 감소
  likeDecay: 1,                  // 하루마다 호감 자연 감소 (대화 안 하면)
};

// ── 상태 단계 ──
export const STAGES = {
  order: ['none', 'curious', 'visitor', 'newcomer', 'member'],
  curiousAt: 30,                 // 호감 이상이면 관심
  memberLike: 70,                // 새신자 → 신도 호감 조건
  memberWorships: 2,             // 예배 몇 번 참석하면 신도 후보
  leaveSuspicion: 80,            // 의심이 이 이상이면 단계가 하나 내려간다 (신도 이탈)
  followersPerMemberWeek: 0.75,  // 신도 한 명이 한 주에 데려오는 '따라온 사람' 기대값
  followerCapPerMember: 2,
  phase2Followers: { chance: 1.3, cap: 5 },   // 2단계: 신도가 지인을 더 잘 데려온다
};

// ── 평판·소문·기성 종교 ──
// 평판은 매일 '목표치' 쪽으로 25%씩 움직인다. 목표치 = base - 여론 주도 주민 평균 의심 × leaderWeight - 전체 평균 의심 × allWeight
export const RUMOR = {
  start: 60,                     // 동네 평판 0~100
  silentAt: 12,                  // 이 아래면 아무도 말을 안 받음 (실패)
  base: 72,
  leaderWeight: 0.55,
  allWeight: 0.45,
  follow: 0.25,
  refuseSus: 60,                 // 의심이 이 이상인 주민은 대화를 피한다
  // 기성 종교 개입: 세 계열 모두 같은 규칙. 그 종교 신자들의 평균 의심이 기준을 넘으면 성직자가 신자들에게 경고한다.
  clergyAvgSus: 30,
  clergySameFamily: 0.8,         // 우리 교단이 같은 계열이면 기준 × 0.8 (흉내 내는 걸 더 빨리 알아챈다)
  clergyCooldown: 5,             // 일
  clergyEffect: { sus: 15, rep: -8, like: -6 },
};

// ── 성소 ──
export const SANCTUARY = {
  rent: 180_000,                 // 한 달(5일)마다
  maxArrears: 3,                 // 연속 체납 3번이면 쫓겨남
  baseSeats: 6,                  // 소품 없이 앉을 자리
  worship: {
    faithGain: 12,               // 참석자 호감(믿음) 상승
    offeringPerHead: 8_000,      // 1인당 헌금 기본
    moodOffering: 0.04,          // 분위기 1점당 헌금 +4%
    newcomerFromVisitor: true,
  },
  care: { fatigue: 18, like: 6 },  // 밤에 신도 돌보기
  sleepRecover: 100,
};

// ── 교주 ──
export const LEADER = {
  beliefRange: 100,              // -100 사기 ↔ +100 광신
  toneThresholds: { zealot: 35, fraud: -35 },
};

// ── 목표·실패 ──
export const GOAL = {
  members: 30,
  rentStreak: 3,
};

// ── 교단 유형 효과 ── (data/sects.js 의 id 와 같은 키)
// topic: 고민별 '고민 들어주기' 배율 · preachSus: 교단 얘기 의심 배율 · invite: 초대 수락 배율
// worship: 예배 믿음 배율 · offering: 헌금 배율 · convert: 새신자→신도 속도 배율
// secularSus: 무교 주민 의심 배율 · ages: 잘 통하는 나이대 [최소, 최대] (그 안이면 호감 ×1.2)
export const SECT_FX = {
  doomsday: { topic: { future: 1.6 }, preachSus: 1.15, invite: 1.1, worship: 1.15, offering: 1.0, convert: 1.15, secularSus: 1.1, ages: [17, 32], date: { day: 18, sus: 25 } },
  messiah: { topic: { lonely: 1.4 }, preachSus: 1.35, invite: 1.0, worship: 1.4, offering: 1.1, convert: 1.2, secularSus: 1.2, ages: [40, 65] },
  meditation: { topic: { meaning: 1.7, health: 1.45, lonely: 1.2 }, preachSus: 0.75, invite: 1.3, worship: 1.05, offering: 1.15, convert: 1.2, secularSus: 0.6, ages: [24, 45] },
  fortune: { topic: { money: 1.22, lonely: 1.0 }, preachSus: 1.0, invite: 1.0, worship: 1.0, offering: 1.25, convert: 1.0, secularSus: 1.1, ages: [45, 75] },
  shaman: { topic: { future: 1.28, money: 1.12 }, preachSus: 1.0, invite: 0.85, worship: 1.0, offering: 1.25, convert: 0.95, secularSus: 1.0, ages: [30, 70], listenBonus: 1.0 },
  qigong: { topic: { health: 1.7 }, preachSus: 1.0, invite: 1.1, worship: 1.05, offering: 1.05, convert: 1.1, secularSus: 0.9, ages: [55, 85], pharmacistSus: 1.2 },
};

// ── 성소 소품 ── (data/shop.js 의 id 와 같은 키) seats: 자리 + / mood: 분위기 +
export const SHOP = {
  chair: { price: 25_000, seats: 2, mood: 0, max: 10 },
  cushion: { price: 12_000, seats: 1, mood: 1, max: 8 },
  banner: { price: 60_000, seats: 0, mood: 6, max: 1 },
  kettle: { price: 35_000, seats: 0, mood: 4, max: 1 },
  light: { price: 40_000, seats: 0, mood: 3, max: 1 },
  board: { price: 30_000, seats: 0, mood: 3, max: 1 },
  plant: { price: 18_000, seats: 0, mood: 2, max: 3 },
  speaker: { price: 90_000, seats: 0, mood: 7, max: 1 },
};

// ════════ 1단계 보강 (A) ════════
// 감정 말풍선: window 분마다 바뀜 · 의심 angrySus 이상이면 짜증 · 호감 heartLike 이상이면 하트 · 고민 sighAt 이상이면 한숨
export const MOOD = { window: 20, angrySus: 40, heartLike: 60, sighAt: 60, bubbleSeconds: 2.4, gossipEverySeconds: 5, hearTiles: 6 };

// 날씨·요일
export const WEATHER = {
  rainChance: 0.2,               // 하루가 비일 확률
  rainLonely: 5,                 // 비 오는 아침 모든 주민 외로움 +
  rainSkip: ['park', 'stream'],  // 비 오면 안 가는 곳 (집에 있는다)
  marketWeekday: 5,              // 토요일 장날
  marketTalk: 1.2,               // 장날 시장에서 대화 호감 배율
};

// 사연 3단계 (data/stories.js) · 선물 · 반복
export const STORY = {
  unlockLike: [25, 45, 65],      // 단계마다 열리는 호감
  doneLike: 15,                  // 부탁을 들어주면 호감 +
  doneSus: -6,                   // 의심 -
  listenLike: 4,                 // 사연을 들어 주기만 해도
  relayLike: 5,                  // 말 전하기를 받은 사람 호감 +
};
export const GIFT = { like: 8, loved: 16, hated: -6, hatedSus: 3 };
export const REPEAT = { factor: 0.5 };   // 같은 사람에게 바로 전과 같은 화제: 효과 ×0.5
// 상황 선택지 효과 (호감 / 의심 / 돈 / 피로)
export const CONTEXT = {
  lunch: { like: 10, money: -9_000, fatigue: 6 },     // 점심 같이 (11~14시, 순댓국집·편의점 앞)
  umbrella: { like: 12 },                              // 우산 씌워 주기 (비, 우산 있으면 우산이 하나 줄어든다)
  market: { like: 9 },                                 // 장 같이 보기 (장날 시장)
  walk: { like: 8, health: -6 },                       // 같이 걷기 (공원·산책로)
  coffee: { like: 7 },                                 // 커피 건네기 (캔커피 있으면, 아침)
};

// 돌발 사건 (data/events.js): 하루 끝마다 이 확률로 하나. 주 1~2회
export const EVENTS = { dailyChance: 0.28, minGapDays: 2 };

// ════════ 2단계 (B) ════════
export const PHASE2 = { members: 100, minSpaceStep: 2, minOfficers: 3, landlordAngerMax: 100 };

// 공간 단계: 보증금(한 번) · 월세 추가(달마다) · 새로 생기는 방 자리
export const SPACE_STEPS = [
  { id: 0, name: '302호', deposit: 0, rent: 0, slots: ['302'] },
  { id: 1, name: '303호 벽 트기', deposit: 350_000, rent: 85_000, slots: ['303'] },
  { id: 2, name: '3층 전체 (301·304호)', deposit: 600_000, rent: 160_000, slots: ['301', '304'] },
  { id: 3, name: '2층 임대', deposit: 1_800_000, rent: 190_000, slots: ['201', '202'] },
  { id: 4, name: '4층 임대', deposit: 1_800_000, rent: 190_000, slots: ['401', '402'] },
];
// 건물주 협상: 깎기 성공 확률 = base + 평판/repDiv + 간부 관리 최고치 × manage
export const NEGOTIATE = { base: 0.25, repDiv: 250, manage: 0.06, cut: 0.3, failAnger: 12, longCut: 0.15, longAnger: -10 };

// 방: 짓는 값(레벨 1) · 업그레이드 값(레벨 2, 3) · 효과(레벨당)
export const ROOMS = {
  worship: { build: 200_000, up: [300_000, 450_000], seats: 10 },
  counsel: { build: 250_000, up: [350_000, 500_000], invite: 0.08, needLike: 5, visitorExtra: 0.12 },
  study: { build: 250_000, up: [350_000, 500_000], memberLike: 2, leave: 5 },
  kitchen: { build: 300_000, up: [400_000, 550_000], worshipLike: 3, followers: 0.15 },
  dorm: { build: 400_000, up: [500_000, 650_000], leave: 15, familySus: 2, anger: 3, rep: 0.4 },
  broadcast: { build: 450_000, up: [550_000, 700_000], outsiders: 3.6, rep: 0.35, clergySus: 1 },
  office: { build: 200_000, up: [300_000, 450_000], offering: 0.1 },
};
// 어두운 업그레이드 (레벨 3 대신): 효율 배율 · 그림자 장부 무게
export const DARK_ROOM = { mult: 1.6, cost: 0.8 };

// 간부
export const OFFICERS = {
  max: 6,
  promoteLike: 75,               // 이 호감 이상인 신도만 간부로
  roomBonus: 0.15,               // 방 담당: 관리 1점당 효율 +15%
  street: { perHour: 1, like: 3, talkLike: 2, slipBase: 0.24, slipTalk: 0.03, slipSus: 7, startHour: 9, endHour: 18 },
  discontent: { idle: 2, rival: 3, dark: 6, extreme: 1, good: -2, loyalCut: 0.12, decay: 1 },
  embezzleAt: 50, factionAt: 70, leaveAt: 90,
  embezzleShare: 0.06, factionSus: 10, exposeDays: 4, exposeRep: -15, exposeSus: 10,
};

// 성장 계시 (ui/revelation.js, data/revelations.js)
export const REVELATIONS = [{ id: 'sign', at: 50 }, { id: 'fence', at: 100 }];

// ════════ 3단계: 바깥의 위협 (22장) ════════
export const PHASE3 = {
  members: 200, rep: 40, repFloor7: 30,          // 목표: 신도 200 + 평판 40 이상 (최근 7일 최저 30 이상) + 라이벌 정리
  followers: { chance: 0.25, cap: 6 }, outsiders: 0.3,   // 방송실 손님도 3단계엔 반쯤 (기사 보고 경계한다)            // 3단계: 신도 한 명이 데려오는 사람 한도가 조금 늘어난다
  // 유형별 3단계 보정: 재림 교주형은 기삿거리가 커서 보도가 세고, 신내림 점집 확장형은 상담 손님이 오래 안 남는다
  sectFx: { messiah: { heat: 1.12 }, shaman: { followers: 0.7 } },
  rivalMajority: 0.5,                            // 우리 신도의 이 비율 넘게 라이벌로 가면 실패
};

// 노출 (0~100): 매일 목표치 쪽으로 30%씩. 목표치 = (60 - 평판) × repWeight + 방·탈퇴자·어두운 선택
export const EXPOSURE = {
  follow: 0.3, repWeight: 0.6, base: 18, perMember: 0.12,   // 커질수록 바깥에서 잘 보인다
  dorm: 8, broadcast: 7,                          // 방 레벨 1당
  defector: 5, meeting: 10, dark: 4, darkDays: 5, // 어두운 선택은 며칠 동안 남는다
  rivalExpose: 15, rivalExposeDays: 6,
  report: -20,                                    // 보도가 나간 뒤에는 한동안 내려간다
};

// 기자 (x:reporter)
export const REPORTER = {
  appearAt: 40, cooldown: 5, stayDays: 3, reportAfter: 3,
  interviewsPerHour: 1, startHour: 10, endHour: 18,
  heat: { resident: 3, sus: 0.1, member: 8, defector: 12, meetingLink: 8, calmed: 1 },
  sight: { tiles: 4, width: 3, loseSeconds: 6 },
  face: { win: -14, lose: 10, winBase: 0.35, repDiv: 180, fatigue: 12 },
  noComment: 4,
  officer: { perTalk: -4, base: 6, disc: 5 },
  evadeDay: 3,                                    // 피하기만 하면 기자가 동네를 더 돈다 (하루 열기 +)
  // 보도: 평판 −(열기/rep + base) · 노출 report · 신도 의심 +열기/sus · 따라온 사람 −열기/followers %
  report: { rep: 2.2, repBase: 5, sus: 8, followers: 2, low: 15, high: 35 },
  pressFail: { rep: 32, reports: 2 },             // 보도 두 번 이상 + 평판 이 아래면 실패
};

// 신도 가족 시위
export const PROTEST = { relativeSus: 50, chance: 0.6, cooldown: 3, passSus: 3, rep: -3, visitorAttend: 0.5, anger: 6, meetSus: -18, officerManage: 4 };

// 탈퇴자
export const DEFECTOR = { gossipSus: 3, gossipPerDay: 3, meetingAt: 2, bigMeeting: 3, reconcileBase: 0.3, reconcileLike: 150, reconcileStory: 0.1, hushMoney: 100_000, hushDue: 6 };

// 기성 종교 공개 대응 (세 계열 같은 규칙)
export const NOTICE = { members: 3, sus: 8, nearTiles: 6, nearMul: 0.7 };

// 라이벌 교단
export const RIVAL = {
  startDelay: 3,
  talkAfter: 9,                                   // 라이벌이 생기고 이만큼 지나야 합병·휴전 얘기를 받아 준다
  talksPerPreacher: 3,                            // 하루에 전도자마다 말 거는 주민 수 (교주 포함 3명)
  like: { base: 10, topic: 8, sus: 0.08, decay: 0.5 },
  leanAt: 35, memberAt: 65,                       // 라이벌 호감이 이만큼이면 기울기 · 라이벌 신도
  stealGap: 12,                                   // 우리 신도인데 라이벌 호감이 우리 호감보다 이만큼 높으면 넘어간다
  followers: { perMember: 1.2, base: 8, daily: 1 }, // 주마다 라이벌 따라온 사람 (+ 매일 조금)
  startFollowers: 30,
  takeFollowers: 0.12,                            // 주마다 우리 따라온 사람 중 (이 비율 × 저쪽/우리 크기)를 가져간다 (휴전 중엔 없음)
  compete: { days: 3, mul: 0.55, fatigue: 25, poach: 2 },   // 경쟁하는 동안 하루에 저쪽 따라온 사람 poach 명이 우리 쪽으로
  expose: { dirt: 3, cut: 0.5, slowDays: 10 },     // 폭로 뒤 한동안 저쪽이 잘 안 큰다
  merge: { base: 0.8, repDiv: 400, cut: 0.25, enemyCut: 0.3, absorb: 0.7 },
  truce: { base: 0.1, repDiv: 400, sizeMin: 1.3, ratio: 0.05 },
  collapseAt: 10,
  enemyMul: 1.5, enemyRep: -5,
};

// 행정: 민원이 쌓이면 구청·소방 점검. 숙소·방송실이 있으면 걸릴 확률이 높다. 경찰은 순찰만
export const ADMIN = { complaintsAt: 30, chance: 0.5, cooldown: 7, fine: 150_000, roomRisk: 0.5, baseRisk: 0.15, patrolDays: 3, patrolAttend: 0.8 };

// 3단계 계시
export const REVELATIONS3 = [{ id: 'camera', at: 150 }, { id: 'neighbor' }];

// ════════ 4단계: 봉천동 지부 (23장) ════════
export const PHASE4 = {
  members: 350, branch: 100, rep: 40,              // 목표: 신도 350 + 봉천 지부 100 + 두 동네 평판 40 이상
  followers: { chance: 0.6, cap: 7 },              // 4단계: 두 동네 소문이 이어져 지인을 더 잘 데려온다
  sectFx: { meditation: { heat: 1.14 }, fortune: { heat: 1.07 } },   // 유형별 4단계 보정: 명상·기복형은 지부가 늘며 기사거리가 커진다
  subway: { minutes: 20, fare: 1_400 },            // 신림역 ↔ 서울대입구역 2호선
  deposit: 1_200_000, rent: 150_000,               // 지부 보증금 · 월세 (본부 월세에 더해 말일에)
  worship: { faithGain: 10, manageMul: 0.1, offeringPerHead: 7_000, walkIn: 2.2 },   // 지부 예배: 지부장 관리 1점당 효과 +10%, 관리×0.6 명이 새로 따라온다
  head: { base: 1.2, sizeDiv: 45, trust: -0.8, report: 0.6, power: -1.2 },          // 지부장 불만 하루 증가 (규모가 클수록 독립하고 싶어 한다)
  splitAt: 70, splitDays: 3,                        // 불만 70 → 독립 예고, 3일 안에 못 풀면 분열 (실패)
  meet: { disc: -22, fatigue: 30 }, power: { disc: -30, share: 0.7 }, replace: { oldDisc: 25 },
};
