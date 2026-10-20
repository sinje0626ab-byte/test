import { CULTURE, APPROACH, STAGES, SPAWN_MIN_FOLLOWERS } from '../config.js';
import { world } from '../data/loader.js';

// 나라 기질과 현지 전도 방식.
// 기질은 나라 데이터(도시화·소득·종교 자유도·종교 구성·지형)에서 판정한다. 민족·국민성 같은 고정관념은 쓰지 않는다.
// 같은 유닛, 같은 방식이라도 기질에 따라 잘 먹히는 나라와 안 먹히는 나라가 갈린다.

const ORGANIZED = ['christianity', 'islam', 'hinduism', 'buddhism', 'judaism'];

// ── 기질 ──
export const TRAITS = {
  metro: { name: '대도시', desc: '출근길 지하철은 꽉 차 있고 다들 이어폰을 꽂고 있다. 길에서 말 걸면 더 깊이 꽂는다. 밤 열한 시에 휴대폰으로 보는 영상은 끝까지 본다.' },
  rural: { name: '농촌', desc: '장날이면 모든 소식이 한 바퀴 돈다. 마을 어른이 끄덕이면 마을이 끄덕인다.' },
  secular: { name: '무종교 많음', desc: '일요일엔 늦잠. 신 얘기엔 시큰둥해도 "요즘 왜 이렇게 허무하지" 얘기엔 오래 앉아 있는다.' },
  devout: { name: '신앙 깊음', desc: '다들 다니는 데가 이미 있다. 정면으로 들이밀면 문이 닫히고, 반찬부터 건네면 그나마 열린다.' },
  folk: { name: '민간 신앙', desc: '이사 날짜는 손 없는 날로, 개업식엔 고사떡. 보이지 않는 걸 딱히 이상하게 안 본다.' },
  plural: { name: '여러 종교', desc: '한 골목에 예배당, 절, 사원이 같이 있다. 간판 하나 더 붙는다고 아무도 놀라지 않는다.' },
  restricted: { name: '통제 사회', desc: '모임 신고서는 세 장, 단톡방은 누가 보고 있다. 눈에 띄면 끝이다.' },
  open: { name: '자유 사회', desc: '전단지 돌리는 건 자유다. 옆에서 다른 전단지 돌리는 것도 자유다.' },
  island: { name: '섬나라', desc: '배나 비행기를 타야 온다. 한번 들어온 소문은 잘 안 나간다.' },
  poor: { name: '저소득', desc: '월말이면 쌀통부터 본다. 교리보다 백반이 먼저 통한다.' },
  rich: { name: '고소득', desc: '돈은 있다. 저녁에 같이 밥 먹을 사람이 없다.' },
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
    name: '거리 전도', desc: '광장, 시장 입구, 지하철역 출구. 전단지와 생수, 그리고 웃는 얼굴.',
    affinity: { open: 1, plural: 1, rural: 1, metro: -1, restricted: -2 },
    lean: (c) => c.freedom / 100,
    pros: ['unitPower', 'growth'], cons: '정부 경계가 조금씩 쌓임',
  },
  house: {
    name: '가정 소모임', desc: '거실에 여섯 명. 과일 깎아 놓고 조용조용 이야기한다. 밖에서는 집들이처럼 보인다.',
    affinity: { restricted: 2, devout: 1, island: 1, open: -1 },
    lean: (c) => (100 - c.freedom) / 100,
    pros: ['growth', 'unitPower'], cons: '눈에 잘 안 띔 · 정부 경계 쌓임 −30%',
  },
  online: {
    name: '온라인 방송', desc: '밤 열한 시 라이브. 링라이트 하나, 채팅창에는 "잠이 안 와요"가 제일 많다.',
    affinity: { metro: 2, rich: 1, secular: 1, poor: -2, rural: -1, restricted: -1 },
    lean: (c) => c.urban * c.gdpTier / 4,
    pros: ['unitPower', 'growth'], cons: '댓글이 쌓이며 거부감도 조금씩 쌓임',
  },
  seminar: {
    name: '명상·마음공부 강좌', desc: '간판에 종교라는 말은 없다. "번아웃 회복 8주 과정", 수강료는 첫 주 무료.',
    affinity: { secular: 2, rich: 1, metro: 1, devout: -2, poor: -1, restricted: -1 },
    lean: (c) => (c.religions.none ?? 0) * 2,
    pros: ['growth'], cons: '강의실 임대료로 매달 신앙력이 조금 듦',
  },
  charity: {
    name: '무료 급식과 봉사', desc: '먼저 밥. 이야기는 설거지 끝나고.',
    affinity: { poor: 2, rural: 1, rich: -2 },
    lean: (c) => (4 - c.gdpTier) / 3,
    pros: ['growth', 'unitPower'], cons: '매달 신앙력이 듦 · 대신 거부감이 조금씩 줄어듦',
  },
  customs: {
    name: '풍습에 맞추기', desc: '그 동네 명절, 그 동네 잔치 날짜에 행사를 연다. 낯설어 보이진 않는데, 믿음은 얕게 붙는다.',
    affinity: { folk: 2, devout: 1, rural: 1, secular: -1 },
    lean: (c) => (c.religions.folk ?? 0) * 3 + (1 - c.urban) * 0.5,
    pros: ['resistance', 'growth'], cons: '이탈 +12%',
  },
  festival: {
    name: '축제와 노래', desc: '앰프, 천막, 떡볶이. 처음 온 사람도 손뼉은 친다.',
    affinity: { plural: 2, open: 1, island: 1, devout: -1, restricted: -2 },
    lean: (c) => 1 - Math.max(...Object.values(c.religions)),
    pros: ['growth'], cons: '시끄럽다 · 정부 경계가 쌓임',
  },
  commune: {
    name: '공동체 마을', desc: '같이 농사짓고 같이 먹는 마을을 하나 세운다. 들어온 사람은 잘 안 나간다.',
    affinity: { rural: 2, island: 1, poor: 1, metro: -2 },
    lean: (c) => 1 - c.urban,
    pros: ['attrition', 'growth'], cons: '바깥과 멀어져 유닛 전파 −15%',
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
  if (!state.religion.home) return '아직 성소가 없다';
  if (cs.banned) return '활동 금지라 안 된다';
  if (cs.followers < SPAWN_MIN_FOLLOWERS) return `신도 ${SPAWN_MIN_FOLLOWERS}명 이상인 나라에서만 된다`;
  if (cs.approach?.id === key) return '지금 쓰는 방식';
  if (state.faith < approachCost(state)) return '신앙력이 모자란다';
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
