import { STORY, DEITY_VALUES, RISK, TENET_VALUES, LEADER, GAME, INCIDENT_VALUES } from '../config.js';
import { world } from '../data/loader.js';
import { DEITIES, DEITY_ORDER } from '../religion/deities.js';
import { TENETS, TENET_ORDER } from '../religion/tenets.js';
import { addEffect, removeEffect } from '../religion/modifiers.js';
import { addFollowers } from '../religion/spread.js';
import { settleHome, totalFollowers } from '../game/state.js';
import { grantUnit } from '../units/units.js';
import { buildHolySite, stageCostMul } from '../game/actions.js';
import { bumpAlert, bumpAversion, changeUnity, raid } from '../game/watch.js';
import { leaderFalls } from '../game/leader.js';
import { chance, rand } from '../game/rng.js';
import { CAST, isIn, castOf, setCast, grudges, firstIn, castTurn, j } from './cast.js';

// 계시(스토리 장면) 데이터.
//   trigger(state) → bool           : 이 조건을 만족한 턴이 끝날 때 한 번만 등장
//   narration: 문장 배열 또는 (state) → 문장 배열
//   parts[]                          : choice(선택지, pickCount) · text(이름 입력)
//   choice = { id, label, flavor, say?: [인물 id, 대사] | (state) → 그것, effectText(정확한 효과, (i)에서만),
//              odds?(state) → 성공 확률, dark?, cost?(state), available?(state) → true | '사유' }
//   apply(state, picks) → { outcome?, tone?, lines[] }  picks[i] 는 parts[i] 의 답 (choice 는 id 배열)
// 효과는 수정자(addEffect)와 flags 로만 남긴다. 확률은 game/rng.js 만 쓴다.
// 문장 규칙은 CLAUDE.md 10절.

const S = STORY;
const home = (s) => s.religion.home;
const homeCs = (s) => s.countries[s.religion.home];
const cost = (state, base) => Math.round(base * stageCostMul(state));
const afford = (state, base) => (state.faith >= cost(state, base) ? true : `신앙력 ${cost(state, base)} 모자람`);
const pick = (part, id) => part.choices.find((c) => c.id === id);
const txt = (s, v) => (typeof v === 'function' ? v(s) : v);
const me = (s) => s.leader.name;
const cult = (s) => s.religion.name || '우리 모임';

// 후계 후보: 누가 남아 있느냐에 따라 바뀐다
const DEPUTY = ['dongcheol', 'jeongsuk', 'taesik'];
const DREAMER = ['minho', 'subin'];
export const heirCast = (state, heir) => {
  if (heir === 'blood') return ['left', 'betrayed', 'arrested', 'dead'].includes(castOf(state, 'seojin').status) ? null : 'seojin';
  if (heir === 'loyal') return firstIn(state, DEPUTY);
  if (heir === 'dream') return firstIn(state, DREAMER);
  return null;
};
// 압수수색 때 책임을 떠넘길 사람
const scapegoat = (s) => firstIn(s, ['dongcheol', 'taesik', 'jeongsuk', 'minho']);

export const CHAPTERS = [
  // ───────────────────────────── I
  {
    id: 'I', numeral: 'I', title: '부름',
    trigger: () => true,
    narration: (s) => [
      `새벽 네 시 십 분. 물류센터 야간 근무를 마친 ${j(me(s), '은/는')} 전자레인지에 삼각김밥을 돌리고 있었다. ${s.leader.age}살, 원룸 보증금 500에 월세 45.`,
      `"${me(s)}."`,
      '돌아봤다. 방에는 빨래 건조대와 자기 자신뿐이었다.',
      '삼각김밥이 다 데워질 때까지 목소리는 세 번 더 불렀다. 마지막엔 좀 짜증 난 말투였다.',
      '그날 아침, 출근하는 대신 다이소에 가서 화이트보드를 샀다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '화이트보드 맨 위에 뭐라고 쓸까. 이게 교단의 첫 줄이 된다.',
        choices: DEITY_ORDER.map((id) => ({
          id, label: `"${DEITIES[id].creed}"`, flavor: DEITIES[id].desc, say: DEITIES[id].say,
          effectText: [...DEITIES[id].pros, ...DEITIES[id].cons.map((c) => `대신 ${c}`)].join(' · '),
        })),
      },
      { kind: 'text', question: '이름도 있어야 한다. 간판집 사장님이 글자 수대로 받는다고 했다.', placeholder: '예: 새벽등불 모임', maxLength: 20 },
    ],
    apply(state, [[deity], name]) {
      state.religion.deity = deity;
      state.religion.name = String(name).trim().slice(0, 20);
      return { lines: [`첫 줄: "${DEITIES[deity].creed}"`, `간판: ${state.religion.name}`] };
    },
  },

  // ───────────────────────────── II
  {
    id: 'II', numeral: 'II', title: '성소',
    trigger: (s) => Boolean(s.story.done.I),
    narration: (s) => [
      `${cult(s)}에 제일 먼저 필요한 건 방이었다. 보증금은 적금 깬 돈 1,200만 원.`,
      '엄마는 이사 가는 줄 알고 김치통을 세 개 싸 들고 왔다.',
      '부동산 사장님이 매물을 네 개 보여 줬다. 전부 "종교 시설 가능"이라고 붙어 있었고, 그런 매물은 생각보다 흔했다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '어디에 문을 열까.',
        choices: [
          { id: 'downtown', label: '도심 상가 건물 4층', flavor: '1층 치킨집, 2층 필라테스, 3층 세무사 사무실. 엘리베이터는 3층까지만 간다.', say: ['taesik', '야, 아니 교주님. 지나가는 사람은 엄청 많아요. 근데 그 사람들이 다 우리 간판을 봐요.'], effectText: '본거지 유닛 전파 +20%, 증가 +10% · 대신 경계와 거부감이 매달 조금씩 쌓임' },
          { id: 'mountain', label: '강원도 산골 폐교', flavor: '운동장엔 잡초, 교무실엔 연탄난로. 버스는 하루 두 대.', say: ['mom', '공기는 좋다. 근데 여기서 장은 어디서 보니?'], effectText: '본거지 이탈 −20%, 경계 쌓임 −30% · 대신 본거지 증가 −15%' },
          { id: 'campus', label: '대학가 원룸촌 스터디 카페', flavor: '간판은 "인문학 스터디 카페". 아메리카노 2,000원, 리필 무료.', say: ['minho', '근데요, 대학생들 와서 콘센트만 쓰고 가면 어떡해요?'], effectText: '신도 1만 명까지 유닛 전파 +25%, 증가 +30% · 대신 본거지 이탈 +20%' },
          { id: 'island', label: '서해 외딴 섬', flavor: '배는 하루 한 번, 안개 끼면 그것도 없다. 민박집을 통째로 빌렸다.', say: ['mom', '멀미약부터 사라. 너 어릴 때 배만 타면 토했잖아.'], effectText: '본거지 이탈 −35%, 경계 쌓임 −40%, 압수수색이 늦게 옴 · 대신 본거지 증가 −25%, 이웃 나라로 번지는 속도 절반' },
        ],
      },
    ],
    apply(state, [[site]]) {
      settleHome(state, GAME.home);
      castTurn(state);   // 엄마·태식·민호
      state.religion.sanctuary = site;
      addEffect(state, `sanctuary:${site}`);
      return { lines: ['본거지: 대한민국', `성소: ${pick(this.parts[0], site).label}`] };
    },
  },

  // ───────────────────────────── III
  {
    id: 'III', numeral: 'III', title: '첫 번째 씨앗',
    trigger: (s) => Boolean(s.story.done.II),
    narration: (s) => [
      '개업 첫날. 접이식 의자 서른 개를 폈고, 세 개가 찼다.',
      '첫째 줄은 엄마. 반찬통을 무릎에 올려놓고 설교 내내 "밥은 먹고 하니" 하는 얼굴로 봤다.',
      `둘째 줄은 태식. ${me(s)}한테 빌려 간 300만 원 얘기는 끝까지 안 꺼냈다.`,
      '맨 뒷줄은 처음 보는 배달 기사였다. 화장실 좀 쓰자고 들어왔다가 설교가 끝날 때까지 헬멧을 안 벗었다. 이름은 민호라고 했다.',
      '"근데요, 다음 주에도 해요?"',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '셋으로는 월세도 안 나온다. 사람을 어떻게 모을까.',
        choices: [
          { id: 'booth', label: '역 앞 무료 고민 상담 부스', flavor: '접이식 테이블, 생수 한 박스, "요즘 힘드시죠?" 손글씨 판넬.', say: ['minho', '근데요, 저 배달 끝나고 저녁에 거기 앉아 있을게요.'], effectText: '모든 유닛 전파 +15% · 대신 거부감이 조금씩 쌓임' },
          { id: 'sns', label: '짧은 영상 채널', flavor: '조명은 다이소 링라이트. 첫 영상 조회수 41회 중 30회는 엄마.', say: ['mom', '내가 하루 종일 틀어 놓을게. 소리는 끄고.'], effectText: '소득 높은 나라일수록 전파·증가 늘어남 (가난한 나라는 오히려 줄어듦) · 대신 경계가 조금씩 쌓임' },
          { id: 'network', label: '아는 사람이 아는 사람 데려오기', flavor: '한 명이 한 명. 데려오면 떡 한 팩.', say: ['taesik', '내 동창 단톡방에 한번 올려 볼까? 아, 나 거기서 손절당했지.'], effectText: '자연 증가 +30% · 대신 이탈 +20% (한 명 나가면 데려온 사람도 나감)' },
          { id: 'food', label: '토요일 무료 백반', flavor: '메뉴는 엄마가 정한다. 반찬 일곱 가지, 국은 매주 바뀐다.', say: ['mom', '밥은 내가 한다. 너는 설교나 짧게 해.'], effectText: '소득 낮은 나라 전파·증가 최대 +30% · 대신 매달 신앙력이 듦 (교단이 클수록 많이)' },
        ],
      },
    ],
    afterword: '민호가 첫 선교사가 됐다. 배달 가방에 전단지를 같이 넣고 다니기로 했다.',
    apply(state, [[method]]) {
      state.religion.method = method;
      addEffect(state, `method:${method}`);
      grantUnit(state, 'missionary', home(state));
      state.incidents.next = Math.max(state.turn + 3, 5);
      return { lines: [`포교: ${pick(this.parts[0], method).label}`, '선교사 민호 출발'] };
    },
  },

  // ───────────────────────────── IV
  {
    id: 'IV', numeral: 'IV', title: '울타리',
    trigger: (s) => totalFollowers(s) >= 100,
    narration: () => [
      '신도 백 명. 의자가 모자라서 웨딩홀 폐업 정리하는 데서 오십 개를 더 사 왔다.',
      '그 웨딩홀 소개해 준 사람이 한정숙이다. 보험 영업 30년, 첫날부터 신도들한테 명함을 돌렸다.',
      '출석부에 빈칸이 생기기 시작했다. 가족 전화 받고 안 나오는 사람, 이유 없이 안 나오는 사람.',
      '정숙이 말했다. "어머, 교주님~ 계약은 해지가 귀찮아야 오래가요."',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 3,
        question: '사람들이 쉽게 안 나가게 규칙을 세 줄 정하자.',
        confirmLabel: '세 줄로 정한다',
        choices: TENET_ORDER.map((id) => ({
          id, label: TENETS[id].name, flavor: TENETS[id].desc, dark: TENETS[id].dark, say: TENETS[id].say,
          effectText: [...TENETS[id].pros, ...TENETS[id].cons.map((c) => `대신 ${c}`)].join(' · '),
        })),
      },
    ],
    afterword: '세 줄을 코팅해서 성소 입구에 붙였다. 엄마는 집 냉장고에도 하나 붙였다.',
    apply(state, [tenets]) {
      state.religion.tenets = [...tenets];
      return { lines: [`규칙: ${tenets.map((t) => TENETS[t].name).join(', ')}`] };
    },
  },

  // ───────────────────────────── V
  {
    id: 'V', numeral: 'V', title: '카메라',
    trigger: (s) => totalFollowers(s) >= 1000 || homeCs(s).aversion >= 0.3 || homeCs(s).alert >= 0.3,
    narration: (s) => [
      '아침 여섯 시 반. 성소 앞에 방송국 로고가 박힌 승합차가 서 있다.',
      `자막: [단독] "${cult(s)}" 탈퇴자 "거기선 벽시계를 다 떼어 놨어요"`,
      '벽시계는 정숙이 도배 새로 하려고 뗀 거였다.',
      '신도 단톡방 알림이 1분에 백 개씩 올라온다. 엄마는 "우리 애 티비 나왔다"고 친척 단톡방에 퍼 날랐다.',
      '그날 처음 온 대학원생 윤수빈은 노트부터 꺼냈다. "지금 상황 좀 적어도 돼요?"',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '저녁 뉴스 전까지 뭐라도 해야 한다.',
        choices: [
          { id: 'press', label: '정면 돌파 기자회견', flavor: '성소 앞마당에 접이식 테이블 하나, 생수 한 병.', say: ['jeongsuk', '어머, 교주님~ 카메라는 정면이 제일 잘 나와요. 왼쪽 얼굴로 서세요.'], odds: (s) => pressChance(s), effectText: '성공하면 본거지 신도 +25%, 거부감 줄어듦 · 실패하면 거부감·경계 크게 오르고 결속 −12' },
          { id: 'lawsuit', label: '맞불 소송', flavor: '"명백한 허위 보도입니다." 동네 법무사 사무실에서 서류를 뽑았다.', dark: 1, cost: (s) => cost(s, S.lawsuit.cost), say: ['taesik', '소송비는... 일단 카드로 긁을게요. 할부로.'], effectText: '본거지 거부감 −15 · 대신 경계 +15, 신앙력 소모', available: (s) => afford(s, S.lawsuit.cost) },
          { id: 'charity', label: '연탄 봉사 대작전', flavor: '앞치마 백 장, 연탄 만 장, 카메라 한 대.', cost: (s) => cost(s, S.charity.cost), say: ['mom', '연탄은 나도 나른다. 허리는 니가 주물러라.'], effectText: '본거지 거부감 −30, 결속 +5 · 대신 신앙력 많이 소모', available: (s) => afford(s, S.charity.cost) },
          { id: 'hide', label: '문 닫고 잠수', flavor: '석 달 동안 불 끄고 쉰다.', say: ['minho', '근데요, 그럼 저 그동안 배달 풀로 뛰어도 돼요?'], effectText: '본거지 경계 −15, 석 달 동안 경계가 안 쌓임 · 대신 석 달 동안 성장 멈춤' },
        ],
      },
    ],
    apply(state, [[choice]]) {
      const id = home(state);
      if (choice === 'press') {
        if (chance(state, pressChance(state))) {
          addFollowers(state, id, homeCs(state).followers * S.press.winFollowers);
          bumpAversion(state, id, S.press.winAversion);
          return { outcome: `기자 한 명이 "그래서 회비는 얼마예요?" 하고 물었다. ${j(me(state), '이/가')} "밥값만 받습니다" 했고, 그 장면이 밤새 돌았다. 다음 날 성소 앞에 줄이 섰다.`, tone: 'good', lines: ['기자회견: 먹혔다'] };
        }
        bumpAversion(state, id, S.press.loseAversion);
        bumpAlert(state, id, S.press.loseAlert);
        changeUnity(state, S.press.loseUnity);
        return { outcome: '마이크가 두 번 꺼졌고, 세 번째엔 엄마가 뒤에서 "물 마시고 해라" 했다. 그 소리가 제일 크게 나갔다.', tone: 'bad', lines: ['기자회견: 망했다'] };
      }
      if (choice === 'lawsuit') {
        state.faith -= cost(state, S.lawsuit.cost);
        bumpAversion(state, id, S.lawsuit.aversion);
        bumpAlert(state, id, S.lawsuit.alert);
        return { outcome: '방송국은 후속 보도를 내렸다. 관할 경찰서에는 소장 사본이 한 부 더 생겼다.', lines: ['맞불 소송'] };
      }
      if (choice === 'charity') {
        state.faith -= cost(state, S.charity.cost);
        bumpAversion(state, id, S.charity.aversion);
        changeUnity(state, S.charity.unity);
        return { outcome: '연탄 검댕 묻은 신도들 사진이 저녁 뉴스 마지막 꼭지로 나갔다. 엄마 얼굴이 제일 크게 나왔다.', tone: 'good', lines: ['연탄 봉사'] };
      }
      addEffect(state, 'press:hide', { turns: S.hide.turns });
      bumpAlert(state, id, S.hide.alert);
      return { outcome: '성소 불을 껐다. 승합차는 사흘 버티다가 연예인 열애설 현장으로 갔다.', lines: ['석 달 잠수'] };
    },
  },

  // ───────────────────────────── VI
  {
    id: 'VI', numeral: 'VI', title: '금고',
    trigger: (s) => totalFollowers(s) >= 10_000,
    narration: (s) => [
      `신도 만 명. ${isIn(s, 'dongcheol') ? '동철이 만든 조직도는 A3 용지 두 장을 테이프로 이어 붙여야 했다.' : '조직도를 그렸더니 A3 용지 두 장을 테이프로 이어 붙여야 했다.'}`,
      `부서가 생기고 직함이 생기고 회의가 생겼다.${isIn(s, 'subin') ? ' 회의 때마다 수빈이 받아 적었다.' : ''}`,
      isIn(s, 'taesik')
        ? '태식이 엑셀을 열더니 한참 말이 없었다. "교주님, 다음 달 관리비가 이번 달 헌금보다 많아요."'
        : '회계 엑셀을 열어 보니 다음 달 관리비가 이번 달 헌금보다 많았다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '금고를 어떻게 채울까.',
        choices: [
          { id: 'business', label: '교단 직영 카페와 건강식품', flavor: '카페 이름은 정숙이 지었다. 메뉴판 밑에 규칙이 한 줄씩 들어간다.', say: (s) => (isIn(s, 'dongcheol') ? ['dongcheol', '사업자 등록은 제가 하겠습니다. 다만 대표자 명의는 제 이름이 깔끔합니다.'] : ['jeongsuk', '어머, 홍삼 스틱은 제가 거래처 있어요~']), effectText: '매달 고정 수입 (단계가 오를수록 늘어남)' },
          { id: 'estate', label: '성소 건물 통째로 매입', flavor: '이제 1층 치킨집 사장님도 우리 세입자다.', cost: (s) => cost(s, S.vault.estate.cost), say: ['taesik', '대출은 나와요. 이자 생각하면 기도를 좀 세게 해야 돼요.'], effectText: '본거지에 첫 성지 (성장 +35%, 이탈 −25%, 매달 신앙력, 영구) · 대신 큰돈이 한 번에 나감', available: (s) => afford(s, S.vault.estate.cost) },
          { id: 'savings', label: '"천국 적금" 특별 헌금', flavor: '만기는 사람마다 다르고, 중도 해지는 안 된다.', dark: 3, say: ['jeongsuk', '어머, 교주님~ 이건 무조건 돼요. 저 이런 상품 30년 팔았어요.'], effectText: '신앙력 바로 크게 들어옴, 수입 +20% · 대신 본거지 거부감 +15, 이탈 +12%' },
          { id: 'overseas', label: '해외 동포 후원회', flavor: '엘에이, 오사카, 시드니에 사는 신도 친척들한테 정기 후원 편지를 보낸다.', say: ['minho', '근데요, 국제우편 요금 엄청 나올 것 같은데요?'], effectText: '해외 유닛 생산비 −30%, 해외 유닛 전파 +20%' },
        ],
      },
    ],
    afterword: '이제 신앙력으로 성지를 세울 수 있다. 나라를 누르면 장부 맨 아래에 있다.',
    apply(state, [[choice]]) {
      state.flags.holySites = true;
      const id = home(state);
      if (choice === 'business') addEffect(state, 'vault:business');
      if (choice === 'estate') {
        state.faith -= cost(state, S.vault.estate.cost);
        buildHolySite(state, id, { free: true });
      }
      if (choice === 'savings') {
        state.faith += cost(state, S.vault.savings.faith);
        addEffect(state, 'vault:savings');
        bumpAversion(state, id, S.vault.savings.aversion);
      }
      if (choice === 'overseas') addEffect(state, 'vault:overseas');
      return { lines: [`금고: ${pick(this.parts[0], choice).label}`, '성지 건설 가능'] };
    },
  },

  // ───────────────────────────── VII
  {
    id: 'VII', numeral: 'VII', title: '그림자',
    trigger: (s) => s.leader.age >= 60 || s.turn >= 144 || (Boolean(s.story.done.VIII) && s.turn > s.story.done.VIII.turn),
    narration: (s) => [
      `${me(s)}, ${s.leader.age}살. 설교하다가 단어가 안 떠오르는 날이 늘었다. ${castOf(s, 'mom').status === 'dead' ? '어제는 집 현관 비밀번호가 생각이 안 났다.' : '어제는 엄마 생일이 생각이 안 났다. 엄마는 미역국을 혼자 끓여 먹었다.'}`,
      isIn(s, 'dongcheol') ? '동철이 회의에서 "만일의 경우"라는 말을 세 번 했다. 수빈이 세 번 다 받아 적었다.' : '간부 회의에서 "만일의 경우"라는 말이 세 번 나왔다.',
      '후계자를 정해야 한다. 안 정하면 누군가 대신 정할 것이다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '누구한테 넘길까.',
        choices: [
          { id: 'blood', label: '조카 서진', flavor: '재수생. 성소에서 밥 얻어먹다가 신도들이랑 친해졌다.', say: ['seojin', '그래서요? 제가 하면 월급 나와요?'], effectText: '계승이 확실함 · 대신 지금 결속 −6, 계승할 때 간부들 반발이 큼', available: (s) => (heirCast(s, 'blood') ? true : '서진이 없다') },
          { id: 'loyal', label: (s) => `2인자 ${CAST[heirCast(s, 'loyal') ?? 'dongcheol'].short}`, flavor: (s) => ({ dongcheol: '모든 회의록을 갖고 있는 사람. 그게 장점이자 문제다.', jeongsuk: '신도 절반의 생일을 외우는 사람.', taesik: '처음부터 있었던 사람. 장부는 좀 그렇다.' }[heirCast(s, 'loyal')] ?? '남은 간부가 없다.'), say: (s) => ({ dongcheol: ['dongcheol', '맡겨 주시면 절차대로 하겠습니다. 다만 인감은 미리 주시죠.'], jeongsuk: ['jeongsuk', '어머, 교주님~ 저 이런 거 해 본 적 없어요. 근데 할게요.'], taesik: ['taesik', '야, 아니 교주님. 나 진짜 해도 돼?'] }[heirCast(s, 'loyal')] ?? null), effectText: '지금 결속 +4, 계승 충격 작음 · 대신 계승 뒤 유닛 전파 −8%', available: (s) => (heirCast(s, 'loyal') ? true : '남은 간부가 없다') },
          { id: 'dream', label: (s) => `꿈에 나온 ${CAST[heirCast(s, 'dream') ?? 'minho'].short}`, flavor: (s) => (heirCast(s, 'dream') === 'subin' ? '꿈에 수빈이 노트를 덮고 처음으로 아무것도 안 적었다.' : '어젯밤 꿈에 민호가 헬멧을 벗었다. 깨고 나니 얼굴이 기억 안 난다.'), say: (s) => (heirCast(s, 'dream') === 'subin' ? ['subin', '제가요? 그거 논문에 써도 돼요?'] : ['minho', '근데요, 저 오토바이 할부 아직 남았는데요.']), effectText: '자연 증가 +8% · 대신 결속이 크게 흔들림 (오를지 떨어질지 모름)', available: (s) => (heirCast(s, 'dream') ? true : '꿈에 나올 사람이 없다') },
          { id: 'immortal', label: '후계자는 없다. 나는 안 죽는다', flavor: '건강검진은 계속 미루기로 한다.', dark: 1, say: (s) => (castOf(s, 'mom').status === 'dead' ? ['taesik', '보험은... 내가 하나 들어 놓을게.'] : ['mom', '안 죽는다는 소리는 밥이나 제때 먹고 해라.']), effectText: '지금 유닛 전파 +12% · 대신 교주가 쓰러지면 바로 패배' },
        ],
      },
      {
        kind: 'choice', pickCount: 1,
        question: '신도들한테는 어떻게 알릴까.',
        choices: [
          { id: 'coronation', label: '성대한 취임식', flavor: '웨딩홀 대관, 뷔페 1인 3만 5천 원.', cost: (s) => cost(s, S.rite.coronation.cost), say: ['jeongsuk', '어머, 사진은 제가 아는 스튜디오 부를게요~'], effectText: '결속 +10 · 대신 신앙력 소모', available: (s) => afford(s, S.rite.coronation.cost) },
          { id: 'staged', label: '하늘의 표시를 연출한다', flavor: '딱 그 순간 무대 조명이 그 사람만 비춘다. 조명 기사는 동철이 구해 왔다.', dark: 2, say: ['subin', '이거 나중에 누가 물어보면 뭐라고 해요?'], effectText: '결속 +14 · 대신 그림자 장부' },
          { id: 'sealed', label: '봉투에 넣어 금고에', flavor: '"내가 떠나면 열어라." 봉투에 침 바르고 테이프까지 붙였다.', say: ['taesik', '금고 비밀번호가 뭐였더라.'], effectText: '계승할 때 충격 줄어듦 · 대신 지금은 수군거림 (결속 −3)' },
          { id: 'council', label: '간부 회의 만장일치', flavor: '손 든 사진을 찍어 둔다. 동철이 사진 각도를 세 번 바꿨다.', say: (s) => (isIn(s, 'dongcheol') ? ['dongcheol', '절차대로 하시죠. 다만 회의록은 제가 쓰겠습니다.'] : ['jeongsuk', '어머, 다들 손 드세요~ 높이요!']), effectText: '결속 +6 · 대신 조카가 후계자면 계승할 때 반발이 더 큼' },
        ],
      },
    ],
    apply(state, [[heir], [rite]]) {
      const L = state.leader;
      let outcome = null;
      if (heir === 'immortal') {
        L.immortal = true;
        L.heir = null;
        L.heirCast = null;
        addEffect(state, 'heir:immortal');
      } else {
        const who = heirCast(state, heir);
        L.immortal = false;
        L.heir = heir;
        L.heirCast = who;
        if (castOf(state, who).status === 'out') setCast(state, who, 'active');
        if (heir === 'blood') changeUnity(state, S.heir.blood.unity);
        if (heir === 'loyal') changeUnity(state, S.heir.loyal.unity);
        if (heir === 'dream') {
          const d = Math.round((rand(state) * 2 - 1) * S.heir.dream.unityRange);
          changeUnity(state, d);
          addEffect(state, 'heir:dream');
          outcome = d >= 0 ? `신도들이 ${j(CAST[who].short, '을/를')} 보면 합장을 하기 시작했다. 본인은 그게 인사인 줄 안다.` : '간부 회의실 문이 쾅 닫혔다. 그날 저녁 단톡방이 세 개로 늘었다.';
        }
      }
      // 2인자가 후계에서 빠지면 서운해한다
      if (isIn(state, 'dongcheol') && L.heirCast !== 'dongcheol') {
        state.flags.dongcheolSulk = true;
        changeUnity(state, INCIDENT_VALUES.dongcheolSulk.unity);
        outcome ??= '동철은 박수를 제일 오래 쳤다. 그리고 그날 회의록을 집에 가져갔다.';
      }
      L.rite = rite;
      if (rite === 'coronation') { state.faith -= cost(state, S.rite.coronation.cost); changeUnity(state, S.rite.coronation.unity); }
      if (rite === 'staged') changeUnity(state, S.rite.staged.unity);
      if (rite === 'sealed') changeUnity(state, S.rite.sealed.unity);
      if (rite === 'council') changeUnity(state, S.rite.council.unity);
      const heirLabel = heir === 'immortal' ? '없음 (안 죽기로 함)' : CAST[L.heirCast].short;
      return { outcome, lines: [`후계: ${heirLabel}`, `알리는 법: ${pick(this.parts[1], rite).label}`] };
    },
  },

  // ───────────────────────────── VIII
  {
    id: 'VIII', numeral: 'VIII', title: '사이렌',
    trigger: (s) => Boolean(s.flags.raidPending),
    narration: (s) => {
      const g = grudges(s)[0];
      return [
        '새벽 네 시 십칠 분. 성소 정문 유리가 깨지는 소리.',
        castOf(s, 'mom').status === 'active'
          ? '경찰 서른두 명, 압수 박스 마흔 개. 엄마는 경찰들한테 보리차를 따라 줬다. 몇 명은 받아 마셨다.'
          : '경찰 서른두 명, 압수 박스 마흔 개. 민호가 경찰 오토바이 세울 자리를 안내했다.',
        g ? `압수 목록 맨 위에 ${j(CAST[g].short, '이/가')} 넘겼다는 서류 사본이 있었다. 참고인 진술도 했다고 한다.` : '압수 목록에는 정숙이 만든 신도 생일 명단도 있었다.',
        `신도들이 전부 ${me(s)}만 쳐다본다.`,
      ];
    },
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '지금 뭘 할까.',
        choices: [
          { id: 'lawyers', label: '변호사 군단', flavor: '판사 출신 셋. 수임료는 서로 묻지 않기로 했다.', cost: (s) => cost(s, S.raid.lawyers.cost), odds: (s) => raidChance(s, 'lawyers'), say: (s) => (isIn(s, 'taesik') ? ['taesik', '금고 다 털면 딱 맞아요. 다음 달 관리비는 기도로 내야 돼요.'] : ['jeongsuk', '어머, 수임료는 할부 안 되나 물어볼게요.']), effectText: '교주가 안 잡힐 가능성 높음 · 대신 신앙력 많이 소모', available: (s) => afford(s, S.raid.lawyers.cost) },
          { id: 'scapegoat', label: (s) => `${CAST[scapegoat(s) ?? 'minho'].short}한테 다 떠넘긴다`, flavor: '살아남는다. 남은 간부들은 이 일을 오래 기억한다.', dark: 4, odds: (s) => raidChance(s, 'scapegoat'), say: (s) => ({ dongcheol: ['dongcheol', '서류는 제가 다 남겨 놨습니다. 다만 교주님 서명도 거기 같이 있습니다.'], taesik: ['taesik', '야... 아니 교주님. 진짜 나야?'], jeongsuk: ['jeongsuk', '어머... 교주님. 저 보험 해약하고 들어왔어요.'], minho: ['minho', '근데요, 저 여기 화장실 쓰러 왔던 사람인데요.'] }[scapegoat(s)] ?? null), effectText: '교주가 안 잡힐 가능성 꽤 높음 · 대신 그 사람이 구속됨, 결속 −15, 그림자 장부 많이', available: (s) => (scapegoat(s) ? true : '떠넘길 사람이 없다') },
          { id: 'exile', label: '해외 지부로 몸을 피한다', flavor: '새벽 첫 비행기. 엄마는 공항까지 반찬통을 들고 나왔다.', odds: (s) => raidChance(s, 'exile'), say: ['minho', '근데요, 여권 유효기간 확인하셨어요?'], effectText: '성공하면 해외 거점이 새 본거지 · 대신 한국 신도 절반을 잃고 한국은 활동 금지', available: (s) => (exileTarget(s) ? true : '신도 1,000명 넘는 해외 거점이 없다') },
          { id: 'martyr', label: '스스로 손목을 내민다', flavor: '카메라 앞에서. 수갑 찰 때 각도는 정숙이 봐 줬다.', say: ['jeongsuk', '어머, 교주님~ 왼쪽 얼굴이 더 잘 나와요.'], effectText: `결속 최대, 신도들 사이에 미담이 돎 · 대신 교주 수감 (${LEADER.jailTurns}달 동안 유닛 생산 못 함)` },
        ],
      },
    ],
    apply(state, [[choice]]) {
      const id = home(state);
      state.flags.raidPending = false;
      state.flags.raidTurn = state.turn;
      const result = { lines: [`압수수색: ${txt(state, pick(this.parts[0], choice).label)}`] };
      if (choice === 'martyr') {
        raid(state, id);
        state.leader.jailedUntil = state.turn + LEADER.jailTurns;
        state.unity = S.raid.martyr.unity;
        bumpAversion(state, id, S.raid.martyr.aversion);
        addEffect(state, 'lockdown', { turns: S.raid.lockdownTurns, params: { factor: S.raid.lockdown } });
        result.outcome = `호송차 창문 너머로 ${j(me(state), '이/가')} 손을 흔들었다. 그 사진이 성소 벽마다 걸렸다. 액자는 정숙이 도매로 떼 왔다.`;
        result.tone = 'good';
        result.lines.push('교주 수감');
        return result;
      }
      let goat = null;
      if (choice === 'lawyers') state.faith -= cost(state, S.raid.lawyers.cost);
      if (choice === 'scapegoat') {
        goat = scapegoat(state);
        changeUnity(state, S.raid.scapegoat.unity);
      }
      if (choice === 'exile') {
        const to = exileTarget(state);
        const lost = homeCs(state).followers * S.raid.exile.homeLoss;
        addFollowers(state, id, -lost);
        homeCs(state).alert = 1;
        homeCs(state).banned = true;
        homeCs(state).lastRaid = state.turn;
        state.religion.home = to;
        state.flags.exiledFrom = id;
      } else {
        raid(state, id);
        addEffect(state, 'lockdown', { turns: S.raid.lockdownTurns, params: { factor: S.raid.lockdown } });
      }
      if (chance(state, raidChance(state, choice))) {
        if (goat) setCast(state, goat, 'arrested');
        result.outcome = choice === 'exile'
          ? `비행기는 제시간에 떴다. 새 본거지는 ${world.countries[state.religion.home].name}. 기내식은 비빔밥이었다.`
          : goat ? `${j(CAST[goat].short, '이/가')} 호송차에 탔다. ${j(me(state), '은/는')} 그날 저녁 설교를 평소보다 길게 했다.`
            : '영장은 집행됐다. 교주 손목에는 아무것도 채워지지 않았다. 변호사 셋은 서로 명함을 교환하고 갔다.';
        result.tone = 'good';
        result.lines.push(goat ? `${CAST[goat].short} 구속, 교주는 무사` : '교주는 무사');
        return result;
      }
      if (goat) setCast(state, goat, 'betrayed');
      const report = { events: [] };
      leaderFalls(state, 'arrest', report);
      const succeeded = report.events.some((e) => e.type === 'succession');
      result.outcome = succeeded
        ? `수갑이 채워졌다. 그날 밤 ${j(state.leader.name, '이/가')} 처음으로 연단에 섰다. 마이크 높이를 한참 맞췄다.`
        : '수갑이 채워졌다. 다음 날 예배 시간에 연단은 비어 있었고, 신도들은 그래도 의자를 폈다.';
      result.tone = 'bad';
      result.lines.push(succeeded ? '교주 체포, 후계자가 이어받음' : '교주 체포');
      return result;
    },
  },

  // ───────────────────────────── IX
  {
    id: 'IX', numeral: 'IX', title: '봉쇄',
    trigger: (s) => Boolean(s.story.done.VIII) && s.turn >= s.story.done.VIII.turn + 3,
    narration: (s) => [
      '뉴스는 3주째 끝나지 않았다. 교단 이름이 동네 초등학생들 사이에서 욕이 됐다.',
      '상담 부스는 신고당했다. 성소 앞 피켓 시위는 매일 아침 아홉 시에 출근하고 여섯 시에 퇴근한다.',
      isIn(s, 'taesik')
        ? '태식이 말했다. "교주님, 문 닫혔으면 창문이라도 찾아야죠." 태식은 실제로 창문으로 들어와 본 적이 있는 사람이다.'
        : '민호가 말했다. "근데요, 문 막혔으면 뒷문으로 다니면 되잖아요." 민호는 배달하면서 모든 건물의 뒷문을 안다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '어디로 사람을 들일까.',
        choices: [
          { id: 'rebrand', label: '간판 새로 달기', flavor: '이름만 바꾼다. 로고는 정숙 조카가 공짜로 해 줬다.', dark: 2, say: ['subin', '이거 검색하면 바로 나오지 않아요?'], effectText: '본거지 거부감 절반으로 · 대신 들키면 두 배로 돌아옴' },
          { id: 'inner', label: '신도 가족부터', flavor: '신도의 엄마, 신도의 사촌, 신도 사촌의 직장 동료.', say: (s) => (castOf(s, 'mom').status === 'active' ? ['mom', '가족이 최고지. 내가 계모임 사람들 데려올게.'] : ['jeongsuk', '어머, 가족 결합 상품이 원래 제일 잘 나가요.']), effectText: '봉쇄 완화, 본거지 증가 +20%, 이탈 −15% · 대신 느림' },
          { id: 'overseas', label: '바다 건너로', flavor: '오사카, 엘에이, 시드니. 교민 신문에 광고를 낸다.', say: ['minho', '근데요, 거기도 배달 앱 돼요?'], effectText: '해외 전파·증가 +40% · 대신 한국은 −30%' },
          { id: 'faceless', label: '얼굴 없는 온라인 모임', flavor: '카메라 끄고 마이크만. 설교 중에 누가 라면 먹는 소리가 들린다.', say: (s) => (isIn(s, 'seojin') ? ['seojin', '그래서요? 저는 원래 카메라 안 켜요.'] : ['subin', '참석률은 높아요. 다들 듣고 있는지는 모르겠어요.']), effectText: '경계 쌓임 −40% · 대신 이탈 +15%' },
        ],
      },
    ],
    afterword: {
      title: '교주의 비망록 #1',
      lines: ['"문이 잠기면 창문을 본다. 창문도 잠기면 공항을 본다."', '나라 밖에 신도가 있으면 한국이 막혀도 버틸 수 있다. 지도에서 교민이 많은 나라부터 보자.'],
    },
    apply(state, [[choice]]) {
      if (choice === 'rebrand') {
        homeCs(state).aversion *= S.blockade.rebrand.aversion;
        state.flags.rebrand = true;
      }
      if (choice === 'inner') {
        const lock = (state.extraModifiers ?? []).find((m) => m.ref === 'lockdown');
        if (lock) lock.params = { factor: S.raid.lockdown + (1 - S.raid.lockdown) * S.blockade.inner.lockdownRelief };
        addEffect(state, 'blockade:inner');
      }
      if (choice === 'overseas') {
        removeEffect(state, 'lockdown');
        addEffect(state, 'blockade:overseas');
      }
      if (choice === 'faceless') addEffect(state, 'blockade:faceless');
      return { lines: [`봉쇄 돌파: ${pick(this.parts[0], choice).label}`] };
    },
  },
];

// 정면 돌파 기자회견 성공 확률
export function pressChance(state) {
  const bonus = DEITY_VALUES[state.religion.deity]?.pressBonus ?? 0;
  return clamp01(S.press.base + bonus - S.press.riskPenalty * state.riskPoints);
}

// 압수수색 대응 성공 확률 (그림자 장부와 등 돌린 사람이 깎고, 침묵의 계율이 올린다)
export function raidChance(state, choice) {
  const base = S.raid[choice]?.success ?? 1;
  const secret = state.religion.tenets.includes('secretive') ? TENET_VALUES.secretive.raidBonus : 0;
  const witnesses = grudges(state).filter((id) => castOf(state, id).status === 'betrayed').length;
  return clamp01(base + secret - RISK.raidPenalty * state.riskPoints - INCIDENT_VALUES.witness * witnesses);
}

// 망명할 해외 거점: 신도가 가장 많은 다른 나라 (1,000명 이상)
export function exileTarget(state) {
  let best = null, bestF = 999;
  for (const id of world.ids) {
    if (id === state.religion.home) continue;
    const f = state.countries[id].followers;
    if (f > bestF && !state.countries[id].banned) { best = id; bestF = f; }
  }
  return best;
}

const clamp01 = (v) => Math.max(0.02, Math.min(0.98, v));

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
