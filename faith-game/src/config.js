// ─────────────────────────────────────────────────────────────
// 밸런스 설정 — 게임의 모든 수치는 이 파일에서만 바꾼다.
// 비율은 0~1, 턴은 1개월. `npm run sim`으로 결과 표를 보면서 조정한다.
// ─────────────────────────────────────────────────────────────

export const GAME = {
  title: '',                 // 게임 이름(미정). 정해지면 여기만 채운다.
  saveKey: 'faith-game-save',
  saveVersion: 4,
  home: '410',               // 본거지는 늘 대한민국
  startYear: 2026,
  startMonth: 1,
  startFollowers: 3,         // 엄마, 태식, 민호
  startFaith: 12,
  leaderAge: { min: 30, max: 55, default: 41 },
};

// ── 저항력 ── Σ(기존 종교 비율 × 결속 계수) × (1 + 거부감 × aversionWeight). 모든 조직 종교는 같은 계수.
export const RESISTANCE = {
  cohesion: { organized: 0.82, folk: 0.62, none: 0.42 },
  aversionWeight: 0.6,
  max: 0.9,
};

// ── 종교 자유도 보정 ── 자유도 0 → min, 100 → max (선형)
export const FREEDOM = { min: 0.08, max: 1.15 };

// ── 전파 ──
// 유닛 전파량 = 기본값 × 교리 보정 × (1 - 저항력) × 자유도 × 도달력 × 단계 배율
// 도달력 = min((개종 가능 인구)^popExponent, reachK × (전 세계 신도 + reachSeed)^reachExponent)
export const SPREAD = {
  popExponent: 0.6,
  reachK: 1.6,
  reachSeed: 8,
  reachExponent: 0.7,
  maxShare: 0.92,            // 한 나라에서 도달할 수 있는 최대 비율
};

// ── 자연 증가·이탈 (매 턴) ──
// 증가 = 신도 × rate × (1 + socialProof × 비율/(비율+socialHalf)) × (1-저항력) × 자유도 × (1 - 비율/최대비율)
export const GROWTH = {
  rate: 0.07,
  socialProof: 1.2,          // 그 나라에서 우리가 흔해질수록 입소문이 빨라진다
  socialHalf: 0.04,
  // 이탈 = 신도 × base × (1 + 저항력 × resistanceWeight) × 교리 × 결속 보정 × (1 - 수호자)
  attritionBase: 0.02,
  attritionResistanceWeight: 0.8,
  establishedRelief: 0.6,    // 그 나라에서 자리 잡을수록 덜 떠난다: × (1 − relief × 비율/(비율+establishedHalf))
  establishedHalf: 0.1,
  minFollowers: 1,           // 한 나라 신도가 1명 미만이면 0으로 정리 (소프트락 방지)
};

// ── 인접국 자연 전파 ── 이웃에게 넘어가는 신도 = 내 신도 × rate × 상대국 보정
export const DIFFUSION = {
  land: 0.005,
  sea: 0.0018,
  minFollowers: 500,
};

// ── 신앙력 ── 수입 = base + (전 세계 신도)^exponent × perFollower (+ 성지·사업 고정 수입)
export const FAITH = {
  base: 5,
  exponent: 0.5,
  perFollower: 0.13,
};

// ── 거부감 ──
export const AVERSION = {
  decay: 0.006,              // 매 턴 자연 감소
  decayHigh: 0.015,          // + 거부감 × decayHigh (높을수록 빨리 식는다)
  backlash: 0.035,           // 기존 종교 반격: 매 턴 + backlash × 우리 비율
  witnessGain: 0.04,
  max: 1,
};

// ── 정부 경계 ──
// 매 턴 + perVisibility × 가시성 × 교리 보정 − decay
// 가시성 = min(visMax, log10(신도+1)/visLogScale) × max(0, 1 − 비율/mainstreamShare)
//   → 그 나라에서 우리가 '주류'가 될수록 당국의 경계가 누그러진다
export const ALERT = {
  perVisibility: 0.011,
  visLogScale: 5,
  visMax: 1.4,
  mainstreamShare: 0.35,
  decay: 0.006,
  unitAction: { missionary: 0.004, relief: -0.03, witness: 0.035 },
  warn: 0.5,                 // 경고장
  warnGap: 8,                // 경고장 카드 사이 최소 턴
  warnMinFollowers: 1000,    // 이 이상 신도가 있는 나라만 경고장 (본거지는 항상)
  raid: 0.7,                 // 압수수색 (본거지는 계시 VIII)
  ban: 1.0,                  // 활동 금지
  unban: 0.6,                // 이 아래로 내려가면 금지 해제
  raidReset: 0.5,            // 압수수색 뒤 경계
  raidCooldown: 18,          // 같은 나라 다음 압수수색까지 최소 턴
  raidFollowerLoss: 0.15,    // 압수수색 신도 손실 (비밀주의는 persecution 배율)
  raidAversion: 0.12,
  banGrowth: 0.25,           // 금지된 나라의 성장 배율
  arrestAfterVIII: 0.08,     // 계시 VIII 이후 본거지 압수수색 때 교주 체포 확률(기본)
  arrestPerRisk: 0.02,
};

// ── 교단 결속 (0~100) ──
export const UNITY = {
  start: 60,
  max: 100,
  driftTo: 60,               // 아무 일 없으면 이 값으로 천천히 돌아간다
  drift: 0.25,
  riskDrain: 0.02,           // 그림자 장부 1점당 매 턴 결속 감소
  stagnationDrain: 0.5,      // 6턴 동안 신도가 늘지 않으면 매 턴 감소
  attritionAt: 50,           // 이보다 낮으면 이탈 증가
  attritionSlope: 60,        // 이탈 배율 = 1 + (attritionAt - 결속)/attritionSlope
  schismAt: 30,              // 이보다 낮으면 분열 사건이 나올 수 있다
  schismLoss: 0.3,           // 분열 사건의 신도 손실
};

// ── 그림자 장부 ── 어두운 선택마다 쌓인다
export const RISK = {
  incidentWeight: 0.12,      // 점수 1점당 폭로·내부고발·분열·세무 사건 가중치 +12%
  raidPenalty: 0.03,         // 점수 1점당 압수수색 대응 성공률 −3%p
};

// ── 교주 ──
export const LEADER = {
  agingTurns: 12,            // 12턴마다 +1세
  deathAge: 70,
  deathBase: 0.006,          // 70세의 월 사망 확률
  deathPerYear: 0.004,       // 1세마다 추가
  heirAge: 36,               // 계승한 후계자의 나이
  successionUnity: { blood: -22, loyal: -8, dream: -14 },
  jailTurns: 12,
};

// ── 유닛 ──
export const UNIT_COST_GROWTH = 0.1;    // 보유 유닛 1개당 생산 비용 +10% (그리고 × 단계 비용 배율)
export const SPAWN_MIN_FOLLOWERS = 3;   // 이 나라에서 유닛을 생산하려면 필요한 신도
export const SEA_RANGE = 2;

export const UNITS = {
  missionary: { cost: 20, power: 1.1, uses: 3 },
  relief:     { cost: 35, power: 0.35, aversionCut: 0.09 },
  theologian: { cost: 80, hostPressure: 0.32, neighborPressure: 0.11, seaFactor: 0.5 },
  guardian:   { cost: 45, attritionCut: 0.6, weakAttritionCut: 0.3, minShare: 0.01 },
  witness:    { cost: 120, power: 6 },
};

// ── 나라 기질 (culture.js) ── 나라 데이터(도시화·소득·자유도·종교 구성·지형)에서 판정한다
export const CULTURE = {
  metroUrban: 0.78, metroGdp: 3,  // 대도시 사회
  ruralUrban: 0.5,                // 농촌 사회 (도시화율 미만)
  secularNone: 0.25,              // 무종교 비율 이상
  devoutShare: 0.85,              // 한 종교가 이 비율 이상
  folkShare: 0.08,                // 민간·전통 신앙 비율 이상
  pluralTop: 0.55,                // 가장 큰 종교가 이 비율 미만
  restrictedFreedom: 40,          // 종교 자유도 미만
  openFreedom: 80,                // 종교 자유도 이상
  unitStep: 0.12,                 // 유닛 궁합 점수 1점당 효과
  unitMin: 0.7, unitMax: 1.4,
};

// ── 현지 전도 방식 (나라마다 하나) ──
// fit: 그 나라 기질과의 궁합 점수 → 장점 배율. 잘 맞음 1 · 맞음 0.6 · 보통 0.3 · 안 맞음 -0.4
// 바꾸면 처음엔 adaptStart 만큼만 효과가 나고 adaptTurns 에 걸쳐 자리를 잡는다
export const APPROACH = {
  cost: 15,                       // × 단계 비용 배율
  adaptStart: 0.25, adaptTurns: 4,
  fitFactor: [[2, 1], [1, 0.6], [0, 0.3]], fitBad: -0.4,
  street:   { unitPower: 0.35, growth: 0.1, alertGain: 0.004 },
  house:    { growth: 0.2, unitPower: 0.1, alertMul: 0.7 },
  online:   { unitPower: 0.3, growth: 0.25, aversionGain: 0.003 },
  seminar:  { growth: 0.3, upkeep: 1 },             // 매달 신앙력 유지비 × √단계 비용 배율
  charity:  { growth: 0.25, unitPower: 0.15, aversionGain: -0.004, upkeep: 2 },
  customs:  { resistance: 0.15, growth: 0.1, attrition: 1.12 },
  festival: { growth: 0.3, alertGain: 0.006 },
  commune:  { attrition: 0.3, growth: 0.1, unitPower: 0.85 },
};

// ── 기적 (한 나라에 1회 대형 전파) ──
export const MIRACLE = {
  cost: 50,                  // × 단계 비용 배율
  power: 7,
  cooldown: 4,
  alert: 0.08,
  aversion: 0.02,
};

// ── 성지 (계시 VI 해금, 나라별 영구 보너스) ──
export const HOLY_SITE = {
  cost: 160,                 // × (1 + perSite × 지어진 성지 수) × 단계 비용 배율
  perSite: 0.6,
  minFollowers: 1000,
  growth: 1.35,
  attrition: 0.75,
  faith: 4,                  // 성지 하나당 매달 고정 수입
  alert: 0.05,
};

// ── 성장 단계 ── 전 세계 신도 수와 진출 국가(신도 1,000명 이상) 기준
// unitPower: 유닛·기적 전파 배율 · cost: 기적·성지·선택지 비용 배율 · unitCap: 유닛 보유 상한
// resistance: 기존 종교 저항력 배율 (세계적인 교단이 되면 더 이상 낯설지 않다)
export const STAGES = [
  { id: 'cult',          name: '동네 모임',     followers: 0,           countries: 0,  growth: 1.0,  faith: 1.0, unitPower: 1.0, resistance: 1,    cost: 1,   unitCap: 3,  unlock: ['missionary', 'relief', 'guardian'] },
  { id: 'new',           name: '신흥 종교', followers: 10_000,      countries: 1,  growth: 1.05, faith: 1.2, unitPower: 1.5, resistance: 1,    cost: 2.5, unitCap: 6,  unlock: ['theologian', 'witness'] },
  { id: 'international', name: '국제 교단', followers: 1_000_000,   countries: 8,  growth: 1.1,  faith: 1.4, unitPower: 2.0, resistance: 0.95, cost: 6,   unitCap: 14, unlock: [] },
  { id: 'world',         name: '세계 종교', followers: 100_000_000, countries: 30, growth: 1.15, faith: 1.6, unitPower: 2.8, resistance: 0.87, cost: 12,  unitCap: 30, unlock: [] },
];
export const PRESENCE_MIN = 1000;

// ── 승패 ──
export const VICTORY_SHARE = 0.30;
export const DEFEAT_FOLLOWERS = 1;

// ── 시작 국가 난이도 ── 점수 = 자유도 보정 × (1 - 저항력)
export const DIFFICULTY = [
  { min: 0.4,  label: '쉬움',      tone: 'easy' },
  { min: 0.28, label: '보통',      tone: 'normal' },
  { min: 0.14, label: '어려움',    tone: 'hard' },
  { min: 0,    label: '매우 어려움', tone: 'extreme' },
];

// ── 절대 원칙(신앙 대상) 수치 ──
export const DEITY_VALUES = {
  founder:    { unitPower: 1.2, attrition: 1.12, faith: 1.1, pressBonus: 0.15 },
  monotheism: { attrition: 0.82, unitPower: 0.95, growth: 0.95, pressBonus: 0.05 },
  cosmos:     { ruralBase: 0.9, ruralBonus: 0.3, pressBonus: 0 },        // 배율 = ruralBase + ruralBonus × (1 - 도시화율)
  ancestors:  { homeBonus: 1.25, awayPenalty: 0.9, attrition: 0.9, pressBonus: 0.05 },
  science:    { base: 0.76, perGdpTier: 0.08, perUrban: 0.15, pressBonus: 0.1 },
};

// ── 울타리(교리) 수치 ──
export const TENET_VALUES = {
  ascetic:   { attrition: 0.75, unitPower: 0.95, growth: 0.95 },
  tithe:     { faith: 1.5, aversionGain: 0.008, aversionFullShare: 0.03 },
  healing:   { poorBonus: { 1: 1.3, 2: 1.18, 3: 1.04, 4: 1.0 }, alertGain: 0.007, alertFullShare: 0.002 },
  open:      { resistance: 0.85, attrition: 1.25 },
  communal:  { attrition: 0.75, urbanPenalty: 0.14 },        // 전파 배율 = 1 - urbanPenalty × 도시화율
  secretive: { unitPower: 0.94, growth: 0.95, persecution: 0.5, alertMul: 0.6, raidBonus: 0.15 },
};
export const TENET_RISK = { tithe: 2, secretive: 2, communal: 1, healing: 1, ascetic: 0, open: 0 };

// ── 계시 선택지 수치 ──
export const STORY = {
  sanctuary: {
    mountain: { attrition: 0.8, alertMul: 0.7, growth: 0.85 },
    downtown: { unitPower: 1.2, growth: 1.1, alertGain: 0.004, aversionGain: 0.002 },
    campus:   { earlyGrowth: 1.3, earlyPower: 1.25, earlyUntil: 10_000, attrition: 1.2 },
    island:   { attrition: 0.65, alertMul: 0.6, raidDelay: 0.1, growth: 0.75, diffusion: 0.5 },
  },
  method: {
    booth:   { unitPower: 1.15, aversionGain: 0.002 },
    sns:     { base: 0.85, perGdpTier: 0.08, alertGain: 0.002 },
    network: { growth: 1.3, attrition: 1.2 },
    food:    { poorBonus: { 1: 1.3, 2: 1.2, 3: 1.0, 4: 0.95 }, upkeep: 2, upkeepPerStage: 3 },
  },
  press:   { base: 0.5, riskPenalty: 0.03, winFollowers: 0.25, winAversion: -0.1, loseAversion: 0.25, loseAlert: 0.1, loseUnity: -12 },
  lawsuit: { cost: 40, aversion: -0.15, alert: 0.15 },
  charity: { cost: 70, aversion: -0.3, unity: 5 },
  hide:    { turns: 3, alert: -0.15 },
  vault: {
    business: { faith: 6, faithPerStage: 6 },
    estate:   { cost: 180 },
    savings:  { faith: 250, faithMul: 1.2, aversion: 0.15, attrition: 1.12 },
    overseas: { costMul: 0.7, unitPower: 1.2 },
  },
  heir: {
    blood:    { unity: -6 },
    loyal:    { unitPower: 0.92, unity: 4 },
    dream:    { unity: 0, unityRange: 20, growth: 1.08 },
    immortal: { unitPower: 1.12 },
  },
  rite: {
    coronation: { cost: 90, unity: 10 },
    staged:     { unity: 14 },
    sealed:     { unity: -3, successionBonus: 8 },
    council:    { unity: 6, bloodPenalty: -10 },
  },
  raid: {
    lawyers:   { cost: 160, success: 0.8 },
    scapegoat: { success: 0.88, unity: -18 },
    exile:     { success: 0.95, homeLoss: 0.5 },
    martyr:    { unity: 100, aversion: -0.1 },
    lockdownTurns: 12,
    lockdown: 0.3,           // 봉쇄 중 본거지 신규 포교 배율
  },
  blockade: {
    rebrand:  { aversion: 0.5, exposeChance: 0.25 },
    inner:    { growth: 1.2, attrition: 0.8, lockdownRelief: 0.6 },
    overseas: { abroad: 1.45, home: 0.6 },
    faceless: { alertMul: 0.65, attrition: 1.12 },
  },
};

// ── 무작위 사건 카드 ──
// ── 바다 건너 ── 해외 한인 사회가 큰 나라 (0~1). 전 세계 신도 1,000명부터, 그 나라 신도 비율이 cap 아래면 전파·증가 × (1 + w × bonus)
export const DIASPORA = {
  weights: { '840': 1, '156': 1, '392': 0.9, '124': 0.6, '036': 0.5, '704': 0.6, '860': 0.5, '398': 0.4, '643': 0.4, '554': 0.4, '608': 0.4, '276': 0.25, '076': 0.2, '032': 0.2, '826': 0.2, '458': 0.2, '360': 0.2 },
  bonus: 0.5,
  cap: 0.0005,
  invite: { min: 1000, seed: 25 },   // 초대장: 신도 1,000명부터 반드시 한 번. 지부를 열면 그 나라에 첫 신도 seed명
};

export const INCIDENTS = {
  firstTurn: 5,              // 이 턴부터
  minGap: 3,
  maxGap: 5,
  cardCooldown: 14,          // 같은 카드가 다시 나오기까지 최소 턴
};

// 사건 카드 선택지 수치 (비용은 × 단계 비용 배율)
export const INCIDENT_VALUES = {
  embezzle:    { loss: 0.25, punishUnity: -6, punishRecover: 0.5, ignoreUnity: 2, apologyCost: 15, apologyAversion: -0.08, apologyUnity: 4 },
  whistle:     { rebutAversion: 0.06, rebutAlert: 0.04, rebutUnity: 3, reconcileCost: 25, reconcileRisk: -1, reconcileAversion: -0.03, ignoreAversion: 0.1 },
  families:    { meetCost: 20, meetAversion: -0.06, meetLoss: 0.02, lockUnity: 5, lockAlert: 0.08, rallyAversion: 0.1, rallyUnity: 6 },
  celebrity:   { turns: 6, alert: 0.06, quietUnity: 5, recruitFaith: 35 },
  rumor:       { turns: 6, alert: 0.05, healingAlert: 0.05, quietUnity: 3 },
  feud:        { purgeUnity: -4, purgeLoss: 0.03, mediateCost: 35, mediateUnity: 6, splitTurns: 6 },
  tax:         { openLoss: 0.15, openAlert: -0.1, tidyChance: 0.6, tidyAlert: -0.05, tidyFailAlert: 0.2, tidyFailUnity: -5, donateCost: 50, donateAlert: -0.05 },
  documentary: { chance: 0.55, winFollowers: 0.1, winAversion: -0.05, loseAversion: 0.15, refuseAversion: 0.03, safeCost: 35, safeFollowers: 0.05 },
  invite:      { declineUnity: 2 },
  momSick:     { hospitalCost: 30, prayDeath: 0.5, prayUnity: 6, prayAversion: 0.12, homeUnity: -3 },
  ticket:      { payCost: 6, payUnity: 2, ignoreAversion: 0.03, stickerAlert: 0.04, stickerTurns: 4 },
  viral:       { turns: 6, stopUnity: -3, aversion: 0.03 },
  quota:       { turns: 6, aversion: 0.006, calendarCost: 20, calendarAversion: 0.06, calendarUnity: 1 },
  embezzleSilly: { alert: 0.05, unity: -3 },
  dongcheolSulk: { unity: -3 },
  witness:     0.05,           // 등 돌린 사람 한 명당 압수수색 대응 성공률 감소
  warning:     { auditCost: 20, auditAlert: -0.15, ignoreAlert: 0.03, signAversion: -0.05, signAlert: -0.05 },
  exodus:      { retreatCost: 20, turns: 6, letGoLoss: 0.06 },
  debate:      { chance: 0.5, winFollowers: 0.08, winAversion: -0.05, loseAversion: 0.12 },
  fire:        { rebuildCost: 40, rebuildUnity: 3, miracleUnity: 10, miracleAlert: 0.05, tentUnity: -5 },
  donation:    { take: 80, takeAlert: 0.1, checked: 40, refuseUnity: 4 },
  schism:      { expelLoss: 0.15, expelUnity: 15, compromiseCost: 60, compromiseUnity: 10, compromiseLoss: 0.05, ignoreUnity: -10 },
  leak:        { minRisk: 4, hushCost: 40, explainAversion: 0.08, explainAlert: 0.06, denyAlert: 0.15 },
  exposed:     { aversionMul: 2, alert: 0.1 },
};
