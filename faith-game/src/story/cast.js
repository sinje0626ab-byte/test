// 전 세계 신도 (state.js 와 순환 참조를 피하려고 여기서 직접 센다)
const totalFollowers = (s) => { let t = 0; for (const k in s.countries) t += s.countries[k].followers; return t; };

// 고정 등장인물. 사건과 계시는 익명 집단 대신 이 사람들 이름으로 터진다.
// 상태는 state.cast[id] = { status, since, age } 로 저장한다.
//   status: 'out'(아직 안 옴) · 'active' · 'left'(떠남) · 'betrayed'(등 돌림) · 'arrested' · 'dead' · 'leader'(교주를 이어받음)
//   age: 합류할 때의 나이. 지금 나이는 castAge() 로 센다.
// 이름은 흔한 이름만 쓴다. 실존 인물·단체를 떠올리게 하는 이름은 쓰지 않는다.
// joins(state): 이 조건을 채운 달이 끝나면 합류한다.

export const CAST = {
  mom: {
    name: '박영숙', short: '엄마', age: 68,
    job: '동네 반찬가게 30년, 작년에 접음',
    relation: '교주의 엄마. 첫 신도',
    voice: '반말 잔소리. 무슨 얘기든 밥으로 끝난다',
    trait: '자식이 뭘 하는지 반쯤 모르는 채로 반찬통부터 챙겨 온다.',
    joins: () => true,
  },
  taesik: {
    name: '최태식', short: '태식', age: null, // 교주와 동갑
    job: '중고차 영업하다 접음',
    relation: '중학교 동창. 교주한테 300만 원 빌려 갔다',
    voice: '반말이 먼저 나오고 존댓말로 고친다',
    trait: '미안해서 들어왔다가 회계를 맡았다. 숫자에 약하고 차에 강하다.',
    joins: () => true,
  },
  minho: {
    name: '김민호', short: '민호', age: 29,
    job: '배달 기사',
    relation: '성소 화장실 쓰러 들어왔다가 눌러앉았다. 첫 선교사',
    voice: '짧은 존댓말. "근데요"로 시작한다',
    trait: '일 처리는 빠르고 질문은 짧다. 오토바이 헬멧을 벗은 걸 본 사람이 없다.',
    joins: () => true,
  },
  jeongsuk: {
    name: '한정숙', short: '정숙', age: 56,
    job: '전직 보험 설계사. 지점 3년 연속 1등',
    relation: '홍보와 새신자 담당 간부',
    voice: '"어머, 교주님~" 감탄부터 하고 본론은 빠르다',
    trait: '안 되는 계약은 없고 도장이 늦을 뿐이라고 믿는다. 30년 동안 그랬다.',
    joins: (s) => totalFollowers(s) >= 100,
  },
  subin: {
    name: '윤수빈', short: '수빈', age: 27,
    job: '사회학 대학원 석사 4학기',
    relation: '신흥 공동체 논문 쓰러 왔다가 남았다',
    voice: '건조한 존댓말. 말끝이 자꾸 질문이 된다',
    trait: '회의 때 전부 받아 적는다. 왜 적는지는 본인도 정확히 모른다.',
    joins: (s) => totalFollowers(s) >= 1000,
  },
  dongcheol: {
    name: '강동철', short: '동철', age: 49,
    job: '전직 입시학원 원장',
    relation: '교단의 2인자',
    voice: '정중하다. 문장마다 "다만"이 붙는다',
    trait: '교주 자리를 노린다. 모든 것을 서류로 남기고, 서류는 집에 가져간다.',
    joins: (s) => totalFollowers(s) >= 2500,
  },
  seojin: {
    name: '서진', short: '서진', age: 20,
    job: '재수생',
    relation: '교주의 조카',
    voice: '무심한 존댓말. "그래서요?"',
    trait: '재수 학원을 끊고 성소에서 밥을 먹는다. 의외로 신도들이 좋아한다.',
    joins: (s) => s.turn >= 48 || s.leader.age >= 55,
  },
};
export const CAST_ORDER = Object.keys(CAST);

// 새 판의 등장인물 상태
export function createCast(leaderAge) {
  const out = {};
  for (const id of CAST_ORDER) out[id] = { status: 'out', since: null, age: CAST[id].age ?? leaderAge };
  return out;
}

export const castOf = (state, id) => state.cast?.[id] ?? { status: 'out', since: null, age: CAST[id].age ?? 40 };
export const isIn = (state, id) => castOf(state, id).status === 'active';
export const castName = (id) => CAST[id].short;
export const fullName = (id) => CAST[id].name;
export const castAge = (state, id) => {
  const c = castOf(state, id);
  return c.age + Math.floor((state.turn - (c.since ?? 0)) / 12);
};

// 상태 바꾸기. 결과 문장에 쓰도록 이전 상태를 돌려준다.
export function setCast(state, id, status) {
  state.cast ??= {};
  const c = castOf(state, id);
  const before = c.status;
  state.cast[id] = { ...c, status, since: status === 'active' && before === 'out' ? state.turn : c.since ?? state.turn, changed: state.turn };
  return before;
}

// 매달: 조건이 된 사람이 합류한다. 합류한 사람 목록을 돌려준다.
export function castTurn(state, report) {
  if (!state.religion.home) return [];
  const joined = [];
  for (const id of CAST_ORDER) {
    if (castOf(state, id).status !== 'out') continue;
    if (!CAST[id].joins(state)) continue;
    setCast(state, id, 'active');
    joined.push(id);
    report?.events.push({ type: 'join', who: id });
  }
  return joined;
}

// 떠났거나 등 돌린 사람 (폭로자·증인 후보). 등 돌린 사람이 먼저.
export function grudges(state) {
  return CAST_ORDER.filter((id) => ['betrayed', 'left'].includes(castOf(state, id).status))
    .sort((a, b) => (castOf(state, b).status === 'betrayed') - (castOf(state, a).status === 'betrayed'));
}

// 지금 남아 있는 사람 중 첫 번째 (없으면 null)
export const firstIn = (state, ids) => ids.find((id) => isIn(state, id)) ?? null;

// 엄마가 교주를 부르는 이름: 받침이 있으면 '아', 없으면 '야'
export function callName(name) {
  const ch = String(name).trim().slice(-1).charCodeAt(0);
  if (ch < 0xac00 || ch > 0xd7a3) return `${name}아`;
  return `${name}${(ch - 0xac00) % 28 ? '아' : '야'}`;
}

// 받침에 따라 조사 고르기 (format.js 와 같은 규칙, DOM 없는 곳에서 쓴다)
export function j(word, pair) {
  const [withBatchim, without] = pair.split('/');
  const ch = String(word).trim().slice(-1).charCodeAt(0);
  if (ch < 0xac00 || ch > 0xd7a3) return word + without;
  return word + ((ch - 0xac00) % 28 ? withBatchim : without);
}

export const STATUS_LABEL = { out: '아직', active: '있음', left: '떠남', betrayed: '등 돌림', arrested: '구속', dead: '고인', leader: '교주' };
