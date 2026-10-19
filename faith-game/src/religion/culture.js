import { CULTURE, APPROACH, STAGES, SPAWN_MIN_FOLLOWERS } from '../config.js';
import { world } from '../data/loader.js';

// 나라 기질과 현지 전도 방식.
// 기질은 나라 데이터(도시화·소득·종교 자유도·종교 구성·지형)에서 판정한다. 민족·국민성 같은 고정관념은 쓰지 않는다.
// 같은 유닛, 같은 방식이라도 기질에 따라 잘 먹히는 나라와 안 먹히는 나라가 갈린다.

const ORGANIZED = ['christianity', 'islam', 'hinduism', 'buddhism', 'judaism'];

// ── 기질 ──
export const TRAITS = {
  metro:      { name: '대도시', desc: '바쁘고 익명적이다. 길에서 말을 걸면 피하지만, 화면 속 이야기는 끝까지 본다.' },
  rural:      { name: '농촌', desc: '서로 얼굴을 안다. 아는 사람의 말이 통하고, 소문은 빠르다.' },
  secular:    { name: '무종교 많음', desc: '신은 믿지 않아도 의미는 찾는다. 교리보다 삶의 이야기에 귀를 연다.' },
  devout:     { name: '신앙 깊음', desc: '이미 믿는 것이 있다. 정면으로 부딪히면 단단히 막힌다.' },
  folk:       { name: '민간 신앙', desc: '풍습과 의례가 일상에 녹아 있다. 보이지 않는 것을 낯설어하지 않는다.' },
  plural:     { name: '다종교', desc: '여러 믿음이 섞여 산다. 새 목소리 하나쯤은 그리 이상하지 않다.' },
  restricted: { name: '통제 사회', desc: '눈에 띄는 순간 끝이다. 조용히, 작게 움직여야 한다.' },
  open:       { name: '자유 사회', desc: '무엇이든 말할 수 있다. 그만큼 귀를 끌려는 목소리도 많다.' },
  island:     { name: '섬나라', desc: '바깥 소식은 늦게 닿고, 안쪽의 결속은 단단하다.' },
  poor:       { name: '저소득', desc: '당장의 끼니와 병원비가 교리보다 먼저다.' },
  rich:       { name: '고소득', desc: '부족한 것은 돈이 아니라 시간과, 말할 사람이다.' },
};
export const TRAIT_ORDER = Object.keys(TRAITS);

const traitCache = new Map();

// 나라 → 기질 id 목록 (TRAIT_ORDER 순)
export function traitsOf(id) {
  const hit = traitCache.get(id);
  if (hit) return hit;
  const c = world.countries[id];
  const r = c.religions;
  const top = Math.max(...Object.values(r));
  const topOrganized = Math.max(0, ...ORGANIZED.map((k) => r[k] ?? 0));
  const has = {
    metro: c.urban >= CULTURE.metroUrban && c.gdpTier >= CULTURE.metroGdp,
    rural: c.urban < CULTURE.ruralUrban,
    secular: (r.none ?? 0) >= CULTURE.secularNone,
    devout: topOrganized >= CULTURE.devoutShare,
    folk: (r.folk ?? 0) >= CULTURE.folkShare,
    plural: top < CULTURE.pluralTop,
    restricted: c.freedom < CULTURE.restrictedFreedom,
    open: c.freedom >= CULTURE.openFreedom,
    island: c.land.length === 0,
    poor: c.gdpTier <= 1,
    rich: c.gdpTier >= 4,
  };
  const list = TRAIT_ORDER.filter((k) => has[k]);
  traitCache.set(id, list);
  return list;
}

const score = (id, affinity) => traitsOf(id).reduce((a, t) => a + (affinity[t] ?? 0), 0);

// ── 유닛 궁합 ── 같은 유닛도 나라에 따라 효과가 다르다
export const UNIT_AFFINITY = {
  missionary: { rural: 1, open: 1, plural: 1, metro: -1, restricted: -2 },
  relief:     { poor: 2, rural: 1, rich: -1 },
  theologian: { secular: 1, plural: 1, metro: 1, devout: -1 },
  guardian:   { devout: 1, restricted: 1, island: 1 },
  witness:    { folk: 2, open: 1, secular: -1, restricted: -2 },
};

export function unitAffinity(id, type) {
  const aff = UNIT_AFFINITY[type];
  if (!aff) return 1;
  return Math.max(CULTURE.unitMin, Math.min(CULTURE.unitMax, 1 + CULTURE.unitStep * score(id, aff)));
}

// ── 현지 전도 방식 ──
// 장점(pros: 수치 키 목록)은 궁합에 따라 커지거나 오히려 역효과가 나고, 부수 효과(cons)는 궁합과 상관없이 따라온다.
const A = APPROACH;
export const APPROACHES = {
  street: {
    name: '거리 전도', desc: '광장과 시장에서 전단을 나누고 말을 건다. 가장 오래된 방식.',
    affinity: { open: 1, plural: 1, rural: 1, metro: -1, restricted: -2 },
    lean: (c) => c.freedom / 100,
    pros: ['unitPower', 'growth'], cons: '정부 경계 조금씩↑',
  },
  house: {
    name: '가정 소모임', desc: '거실에 몇 명씩 모여 조용히 이야기를 나눈다. 밖에서는 잘 보이지 않는다.',
    affinity: { restricted: 2, devout: 1, island: 1, open: -1 },
    lean: (c) => (100 - c.freedom) / 100,
    pros: ['growth', 'unitPower'], cons: `눈에 띄지 않는다 — 정부 경계 쌓임 −${Math.round((1 - A.house.alertMul) * 100)}%`,
  },
  online: {
    name: '온라인 방송', desc: '짧은 영상과 밤늦은 생방송. 화면 너머의 외로운 사람들에게 닿는다.',
    affinity: { metro: 2, rich: 1, secular: 1, poor: -2, rural: -1, restricted: -1 },
    lean: (c) => c.urban * c.gdpTier / 4,
    pros: ['unitPower', 'growth'], cons: '댓글이 쌓이며 거부감 조금씩↑',
  },
  seminar: {
    name: '명상·인생 강좌', desc: '종교라는 말은 빼고, 마음 다스리는 법을 가르친다는 간판을 건다.',
    affinity: { secular: 2, rich: 1, metro: 1, devout: -2, poor: -1, restricted: -1 },
    lean: (c) => (c.religions.none ?? 0) * 2,
    pros: ['growth'], cons: '강의실 임대료 — 매달 신앙력 조금',
  },
  charity: {
    name: '무료 급식·봉사', desc: '먼저 밥을 나누고, 이야기는 그다음이다.',
    affinity: { poor: 2, rural: 1, rich: -2 },
    lean: (c) => (4 - c.gdpTier) / 3,
    pros: ['growth', 'unitPower'], cons: '매달 신앙력이 든다 · 대신 거부감 조금씩↓',
  },
  customs: {
    name: '풍습 끌어안기', desc: '그 땅의 명절과 의례에 맞춰 교단의 행사를 꾸린다. 낯설지 않아 보이지만, 믿음은 얕아진다.',
    affinity: { folk: 2, devout: 1, rural: 1, secular: -1 },
    lean: (c) => (c.religions.folk ?? 0) * 3 + (1 - c.urban) * 0.5,
    pros: ['resistance', 'growth'], cons: `이탈 +${Math.round((A.customs.attrition - 1) * 100)}%`,
  },
  festival: {
    name: '축제와 음악', desc: '노래와 춤이 있는 큰 모임. 처음 온 사람도 쉽게 섞인다.',
    affinity: { plural: 2, open: 1, island: 1, devout: -1, restricted: -2 },
    lean: (c) => 1 - Math.max(...Object.values(c.religions)),
    pros: ['growth'], cons: '시끄럽다 — 정부 경계↑',
  },
  commune: {
    name: '공동체 마을', desc: '함께 일하고 함께 먹는 마을을 세운다. 들어온 사람은 잘 떠나지 않는다.',
    affinity: { rural: 2, island: 1, poor: 1, metro: -2 },
    lean: (c) => 1 - c.urban,
    pros: ['attrition', 'growth'], cons: `바깥과 멀어져 유닛 전파 −${Math.round((1 - A.commune.unitPower) * 100)}%`,
  },
};
export const APPROACH_ORDER = Object.keys(APPROACHES);

// 장점 문구: 이 나라 궁합을 반영한 실제 수치 (안 맞으면 역효과로 표시)
const PRO_LABEL = { unitPower: ['유닛 전파', 1], growth: ['성장', 1], resistance: ['기존 종교 저항', -1], attrition: ['이탈', -1] };
export function prosText(id, key) {
  const f = fitOf(id, key).factor;
  return APPROACHES[key].pros.map((stat) => {
    const [label, dir] = PRO_LABEL[stat];
    const v = Math.round(A[key][stat] * f * 100) * dir;
    return `${label} ${v >= 0 ? '+' : '−'}${Math.abs(v)}%`;
  }).join(' · ');
}

export const approachScore = (id, key) => score(id, APPROACHES[key].affinity);

export function fitOf(id, key) {
  const s = approachScore(id, key);
  const hit = A.fitFactor.find(([min]) => s >= min);
  const factor = hit ? hit[1] : A.fitBad;
  const label = s >= 2 ? '잘 맞음' : s >= 1 ? '맞음' : s >= 0 ? '보통' : '안 맞음';
  const tone = s >= 1 ? 'good' : s >= 0 ? '' : 'bad';
  return { score: s, factor, label, tone };
}

// 궁합이 가장 좋은 방식. 점수가 같으면 나라 수치(lean, 0~1)가 더 기운 쪽
export function bestApproach(id) {
  const c = world.countries[id];
  const rank = (k) => approachScore(id, k) + 0.5 * Math.min(1, APPROACHES[k].lean(c));
  return APPROACH_ORDER.reduce((best, k) => (rank(k) > rank(best) ? k : best), APPROACH_ORDER[0]);
}

const stageCost = (state) => STAGES.find((s) => s.id === state.stage)?.cost ?? 1;
export const approachCost = (state) => Math.round(A.cost * stageCost(state));

export function approachBlocker(state, id, key) {
  const cs = state.countries[id];
  if (!state.religion.home) return '아직 본거지가 없습니다';
  if (cs.banned) return '활동 금지된 나라';
  if (cs.followers < SPAWN_MIN_FOLLOWERS) return `신도 ${SPAWN_MIN_FOLLOWERS}명 이상인 나라에서만`;
  if (cs.approach?.id === key) return '지금 쓰는 방식';
  if (state.faith < approachCost(state)) return '신앙력 부족';
  return null;
}

export function setApproach(state, id, key) {
  const blocker = approachBlocker(state, id, key);
  if (blocker) return { ok: false, message: blocker };
  state.faith -= approachCost(state);
  state.countries[id].approach = { id: key, since: state.turn };
  return { ok: true, name: APPROACHES[key].name, fit: fitOf(id, key) };
}

// 자리 잡은 정도 (0~1)
export function adaptOf(state, id) {
  const ap = state.countries[id].approach;
  if (!ap) return 0;
  return Math.min(1, A.adaptStart + (1 - A.adaptStart) * (state.turn - ap.since) / A.adaptTurns);
}

// ── 수정자 출처 (modifiers.js 가 매번 넣는다) ──
// 값은 나라마다 그 나라 방식에서 읽는다. c 가 없으면 (전 세계 단위 계산) 효과 없음.
const current = (state, c) => (c ? state.countries[c.id]?.approach?.id : null);
const pro = (state, c, key, stat) => 1 + (A[key][stat] ?? 0) * fitOf(c.id, key).factor * adaptOf(state, c.id);

function bonus(stat) {
  return (c, state) => {
    const key = current(state, c);
    return key && A[key][stat] ? pro(state, c, key, stat) : 1;
  };
}

export const approachSource = {
  mods: {
    unitPower: (c, state) => {
      const key = current(state, c);
      if (!key) return 1;
      if (key === 'commune') return A.commune.unitPower;
      return A[key].unitPower ? pro(state, c, key, 'unitPower') : 1;
    },
    growth: bonus('growth'),
    resistance: (c, state) => {
      const key = current(state, c);
      return key === 'customs' ? 1 - A.customs.resistance * fitOf(c.id, key).factor * adaptOf(state, c.id) : 1;
    },
    attrition: (c, state) => {
      const key = current(state, c);
      if (key === 'customs') return A.customs.attrition;
      if (key === 'commune') return 1 - A.commune.attrition * fitOf(c.id, key).factor * adaptOf(state, c.id);
      return 1;
    },
    alertMul: (c, state) => (current(state, c) === 'house' ? A.house.alertMul : 1),
  },
  add: {
    alertGain: (c, state) => A[current(state, c)]?.alertGain ?? 0,
    aversionGain: (c, state) => A[current(state, c)]?.aversionGain ?? 0,
    // 유지비: 나라 단위가 아니라 교단 전체 수입에서 빠진다
    faithFlat: (c, state) => {
      if (c) return 0;
      let upkeep = 0;
      for (const id in state.countries) {
        const key = state.countries[id].approach?.id;
        if (key && A[key].upkeep && state.countries[id].followers > 0) upkeep += A[key].upkeep;
      }
      return -upkeep * Math.sqrt(stageCost(state));
    },
  },
};
