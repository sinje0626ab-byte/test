// ★ 모든 수치는 여기 한 곳. 문장은 src/data/ 아래.

export const GAME = {
  title: '',                     // 게임 이름(미정). 정해지면 여기만.
  saveKey: 'cult-town-save',
  saveVersion: 1,
  startMoney: 400_000,           // 교주 지갑 = 교단 돈 (원)
  startAge: { min: 25, max: 60, default: 38 },
};

// ── 시간 ── 1일 = 실제 약 4분 (낮 3분 30초 + 밤 메뉴). 07:00~21:00 이 걸어 다니는 낮.
export const CLOCK = {
  dayStart: 7 * 60,              // 분
  dayEnd: 21 * 60,               // 이때 "성소로 돌아가세요"
  forceHome: 22 * 60,            // 이때까지 안 들어가면 자동 귀가 (피로 +)
  minutesPerSecond: 4,           // 1배속: 실제 1초 = 게임 4분 → 14시간 = 210초
  fastFactor: 2,
  daysPerMonth: 7,               // 압축 달력: 한 달 = 7일 (1단계를 1~2시간에 끝내려고)
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
  playerSpeed: 90,               // px/초 (화면)
  residentTilesPerMinute: 1.8,   // 게임 1분에 걷는 칸 수 (시뮬레이터와 화면이 같은 값). 일과 시각은 도착 시각, 그만큼 먼저 나선다
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
  followersPerMemberWeek: 0.35,  // 신도 한 명이 한 주에 데려오는 '따라온 사람' 기대값
  followerCapPerMember: 2,
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
  rent: 250_000,                 // 한 달(7일)마다
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
  meditation: { topic: { meaning: 1.4, health: 1.2 }, preachSus: 0.75, invite: 1.15, worship: 0.9, offering: 0.9, convert: 0.8, secularSus: 0.6, ages: [24, 45] },
  fortune: { topic: { money: 1.5, lonely: 1.1 }, preachSus: 1.0, invite: 1.0, worship: 1.0, offering: 1.35, convert: 1.0, secularSus: 1.1, ages: [45, 75] },
  shaman: { topic: { future: 1.4, money: 1.2 }, preachSus: 1.0, invite: 0.85, worship: 1.0, offering: 1.25, convert: 0.95, secularSus: 1.0, ages: [30, 70], listenBonus: 1.3 },
  qigong: { topic: { health: 1.7 }, preachSus: 1.0, invite: 1.05, worship: 1.05, offering: 1.05, convert: 1.0, secularSus: 0.9, ages: [55, 85], pharmacistSus: 1.8 },
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
export const EVENTS = { dailyChance: 0.22, minGapDays: 2 };

// ════════ 2단계 (B) ════════
export const PHASE2 = { members: 100, minSpaceStep: 2, minOfficers: 3, landlordAngerMax: 100 };

// 공간 단계: 보증금(한 번) · 월세 추가(주마다) · 새로 생기는 방 자리
export const SPACE_STEPS = [
  { id: 0, name: '302호', deposit: 0, rent: 0, slots: ['302'] },
  { id: 1, name: '303호 벽 트기', deposit: 700_000, rent: 120_000, slots: ['303'] },
  { id: 2, name: '3층 전체 (301·304호)', deposit: 1_400_000, rent: 220_000, slots: ['301', '304'] },
  { id: 3, name: '2층 임대', deposit: 1_800_000, rent: 260_000, slots: ['201', '202'] },
  { id: 4, name: '4층 임대', deposit: 1_800_000, rent: 260_000, slots: ['401', '402'] },
];
// 건물주 협상: 깎기 성공 확률 = base + 평판/repDiv + 간부 관리 최고치 × manage
export const NEGOTIATE = { base: 0.25, repDiv: 250, manage: 0.06, cut: 0.3, failAnger: 12, longCut: 0.15, longAnger: -10 };

// 방: 짓는 값(레벨 1) · 업그레이드 값(레벨 2, 3) · 효과(레벨당)
export const ROOMS = {
  worship: { build: 200_000, up: [300_000, 450_000], seats: 10 },
  counsel: { build: 250_000, up: [350_000, 500_000], invite: 0.08, needLike: 5, visitorExtra: 0.12 },
  study: { build: 250_000, up: [350_000, 500_000], memberLike: 2, leave: 5 },
  kitchen: { build: 300_000, up: [400_000, 550_000], worshipLike: 3, followers: 0.08 },
  dorm: { build: 400_000, up: [500_000, 650_000], leave: 15, familySus: 2, anger: 3, rep: 0.4 },
  broadcast: { build: 450_000, up: [550_000, 700_000], outsiders: 0.55, rep: 0.35, clergySus: 1 },
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
