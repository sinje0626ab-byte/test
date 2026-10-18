// ─────────────────────────────────────────────────────────────
// 밸런스 설정 — 게임의 모든 수치는 이 파일에서만 바꾼다.
// 비율은 0~1, 턴은 1개월.
// ─────────────────────────────────────────────────────────────

export const GAME = {
  title: '',                 // 게임 이름(미정). 정해지면 여기만 채운다.
  saveKey: 'faith-game-save',
  saveVersion: 2,
  startYear: 2026,
  startMonth: 1,
  startFollowers: 300,       // 창시 직후 시작 국가의 신도 (교주와 첫 제자들)
  startFaith: 60,
  startUnits: ['missionary'],
  tenetSlots: 3,             // 교리 슬롯 수 (2단계: 해금으로 늘림)
};

// ── 저항력 ──
// 저항력 = Σ(기존 종교 비율 × 결속 계수) × (1 + 거부감)
// 모든 조직 종교(기독교·이슬람교·힌두교·불교·유대교·기타)는 같은 계수를 쓴다.
export const RESISTANCE = {
  cohesion: {
    organized: 0.82,         // 조직 종교 공통
    folk: 0.62,              // 민간·전통 신앙
    none: 0.42,              // 무종교
  },
  max: 0.96,
};

// ── 종교 자유도 보정 ── 자유도 0 → min, 100 → max (선형)
export const FREEDOM = {
  min: 0.08,
  max: 1.15,
};

// ── 전파 공식 ──
// 전파량 = 유닛 기본값 × 교리 보정 × (1 - 저항력) × 자유도 보정 × (아직 신도가 아닌 인구)^popExponent
// popExponent가 1보다 작아서 큰 나라일수록 '비율'로는 덜 오른다.
export const SPREAD = {
  popExponent: 0.6,
  maxShare: 0.92,            // 한 나라에서 도달할 수 있는 최대 비율
};

// ── 자연 증가·이탈 (매 턴) ──
export const GROWTH = {
  // 신도가 주변 사람을 데려오는 속도: 증가 = 신도 × rate × (1-저항력) × 자유도 보정 × (1 - 비율/최대비율)
  rate: 0.3,
  // 이탈 = 신도 × base × (1 + 저항력 × resistanceWeight)
  attritionBase: 0.015,
  attritionResistanceWeight: 0.8,
  minFollowers: 1,           // 이보다 적으면 그 나라 신도는 0으로 정리
};

// ── 인접국 자연 전파 ── 이웃에게 넘어가는 신도 = 내 신도 × rate × 상대국 보정
export const DIFFUSION = {
  land: 0.006,
  sea: 0.0022,
  minFollowers: 200,         // 이 이상 신도가 있어야 이웃으로 퍼진다
};

// ── 신앙력 ── 수입 = base + (전 세계 신도)^exponent × perFollower
export const FAITH = {
  base: 4,
  exponent: 0.5,
  perFollower: 0.12,
};

// ── 거부감 · 정부 경계 (나라별, 0~1) ──
// 1단계에서는 쌓이기만 하고 정부 탄압(2단계)이 이 값을 읽는다.
export const AVERSION = {
  decay: 0.006,              // 매 턴 자연 감소
  witnessGain: 0.04,         // 간증자 사용 시
  max: 1,
};
export const ALERT = {
  decay: 0.004,
  max: 1,
};

// ── 유닛 ──
export const UNIT_COST_GROWTH = 0.08;  // 보유 유닛 1개당 생산 비용 +8%
export const SPAWN_MIN_FOLLOWERS = 100; // 이 나라에서 유닛을 생산하려면 필요한 신도
export const SEA_RANGE = 2;             // 바다 건너 이동 가능한 칸 수

export const UNITS = {
  missionary: { cost: 40, power: 0.06, uses: 3 },
  relief:     { cost: 55, power: 0.018, aversionCut: 0.09 },
  theologian: { cost: 95, hostPressure: 0.022, neighborPressure: 0.008 },
  guardian:   { cost: 70, attritionCut: 0.65, weakAttritionCut: 0.3, minShare: 0.01 },
  witness:    { cost: 180, power: 0.42 },
};

// ── 성장 단계 ── 전 세계 신도 수와 진출 국가(신도 1,000명 이상) 기준
export const STAGES = [
  { id: 'cult',          name: '컬트',     followers: 0,           countries: 0,  growth: 1.0,  faith: 1.0,  unlock: ['missionary', 'relief', 'guardian'] },
  { id: 'new',           name: '신흥 종교', followers: 20_000,      countries: 2,   growth: 1.05, faith: 1.15, unlock: ['theologian', 'witness'] },
  { id: 'international', name: '국제 교단', followers: 5_000_000,   countries: 12, growth: 1.1,  faith: 1.3,  unlock: [] },
  { id: 'world',         name: '세계 종교', followers: 250_000_000, countries: 35, growth: 1.15, faith: 1.5,  unlock: [] },
];
export const PRESENCE_MIN = 1000;       // '진출 국가'로 세는 최소 신도

// ── 승패 ──
export const VICTORY_SHARE = 0.30;      // 세계 인구의 30%
export const DEFEAT_FOLLOWERS = 1;      // 전 세계 신도가 이 미만이면 패배

// ── 시작 국가 난이도 ── 점수 = 자유도 보정 × (1 - 저항력)
export const DIFFICULTY = [
  { min: 0.4,  label: '쉬움',      tone: 'easy' },
  { min: 0.28, label: '보통',      tone: 'normal' },
  { min: 0.14, label: '어려움',    tone: 'hard' },
  { min: 0,    label: '매우 어려움', tone: 'extreme' },
];

// ── 신앙 대상 수치 ──
// unitPower: 유닛 전파 배율 · growth: 자연 증가 배율 · attrition: 이탈 배율 · faith: 신앙력 배율
export const DEITY_VALUES = {
  monotheism: { attrition: 0.85, unitPower: 0.95, growth: 0.95 },
  cosmos:     { ruralBase: 0.88, ruralBonus: 0.32 },       // 배율 = ruralBase + ruralBonus × (1 - 도시화율)
  ancestors:  { homeBonus: 1.25, awayPenalty: 0.88, attrition: 0.9 }, // 시작 국가와 육로 이웃이 '고향'
  science:    { base: 0.72, perGdpTier: 0.1, perUrban: 0.15 }, // 배율 = base + 소득단계×perGdpTier + 도시화율×perUrban
  founder:    { unitPower: 1.25, attrition: 1.15, faith: 1.1 },
};

// ── 교리 수치 ──
export const TENET_VALUES = {
  ascetic:   { attrition: 0.7, unitPower: 0.85, growth: 0.85 },
  tithe:     { faith: 1.4, aversionGain: 0.01, aversionFullShare: 0.05 }, // 비율이 aversionFullShare에 이르면 매 턴 aversionGain 전부
  healing:   { poorBonus: { 1: 1.35, 2: 1.2, 3: 1.0, 4: 1.0 }, alertGain: 0.008, alertFullShare: 0.03 },
  open:      { resistance: 0.8, attrition: 1.35 },
  communal:  { attrition: 0.72, urbanPenalty: 0.3 },        // 전파 배율 = 1 - urbanPenalty × 도시화율
  secretive: { unitPower: 0.85, growth: 0.9, persecution: 0.5, alertGain: 0.5 },
};
