import { STORY, DEITY_VALUES, RISK, TENET_VALUES, LEADER } from '../config.js';
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

// 계시(스토리 장면) 데이터.
//   trigger(state) → bool           : 이 조건을 만족한 턴이 끝날 때 한 번만 등장
//   parts[]                          : choice(선택지, pickCount) · text(이름 입력) · country(나라 고르기)
//   choice = { id, label, flavor, effectText, dark?, cost?(state), available?(state) → true | '사유' }
//   apply(state, picks) → { outcome?, tone?, lines[] }  picks[i] 는 parts[i] 의 답 (choice 는 id 배열)
// 효과는 수정자(addEffect)와 flags 로만 남긴다. 확률은 game/rng.js 만 쓴다.

const S = STORY;
const home = (s) => s.religion.home;
const homeCs = (s) => s.countries[s.religion.home];
const cost = (state, base) => Math.round(base * stageCostMul(state));
const afford = (state, base) => (state.faith >= cost(state, base) ? true : `신앙력 ${cost(state, base)} 필요`);
const pct = (p) => `${Math.round(p * 100)}%`;
const pick = (part, id) => part.choices.find((c) => c.id === id);

export const CHAPTERS = [
  // ───────────────────────────── I
  {
    id: 'I', numeral: 'I', title: '부름',
    trigger: () => true,
    narration: [
      '그날 밤, 당신은 잠들지 못했다.',
      '세상은 틀렸고, 사람들은 길을 잃었다.',
      '그리고 그 답을 아는 사람은 오직 당신뿐이다.',
      '내일부터 당신은 더 이상 평범한 사람이 아니다.',
      '당신은, 교주다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '모든 것의 시작이 될 단 하나의 절대 원칙을 선포하라.',
        choices: DEITY_ORDER.map((id) => ({
          id, label: `「${DEITIES[id].creed}」`, flavor: DEITIES[id].desc,
          effectText: [...DEITIES[id].pros.map((p) => `▲ ${p}`), ...DEITIES[id].cons.map((c) => `▼ ${c}`)].join('  '),
        })),
      },
      { kind: 'text', question: '이 믿음에 이름을 붙여라. 역사는 이 이름을 기억하게 될 것이다.', placeholder: '예: 새벽빛 공동체', maxLength: 20 },
    ],
    apply(state, [[deity], name]) {
      state.religion.deity = deity;
      state.religion.name = String(name).trim().slice(0, 20);
      return { lines: [`절대 원칙 — 「${DEITIES[deity].creed}」`, `교단 이름 — ${state.religion.name}`] };
    },
  },

  // ───────────────────────────── II
  {
    id: 'II', numeral: 'II', title: '성소',
    trigger: (s) => Boolean(s.story.done.I),
    narration: [
      '믿음에는 몸이 필요하다.',
      '사람들이 모이고, 무릎 꿇고, 돌아올 곳.',
      '그곳은 당신의 요새가 될 수도, 당신의 무덤이 될 수도 있다.',
    ],
    parts: [
      { kind: 'country', question: '먼저, 성소를 세울 나라를 고르라.' },
      {
        kind: 'choice', pickCount: 1,
        question: '이제 그 땅 어디에 문을 열 것인가.',
        choices: [
          { id: 'mountain', label: '산속 폐교 기도원', flavor: '바깥의 눈이 닿지 않는다.', effectText: '▲ 본거지 이탈↓ 경계 증가↓  ▼ 포교 속도↓' },
          { id: 'downtown', label: '도심 상가 3층', flavor: '하루 수만 명이 문 앞을 지나간다.', effectText: '▲ 본거지 포교↑  ▼ 언론 노출↑ (경계·거부감 증가)' },
          { id: 'campus', label: '대학가 「인문학 스터디 카페」', flavor: '젊고 외로운 영혼들.', effectText: '▲ 초반(신도 1만 명까지) 포교·증가↑  ▼ 이탈↑' },
          { id: 'island', label: '바다 건너 외딴 섬', flavor: '완벽한 고립.', effectText: '▲ 이탈↓↓ 압수수색 지연  ▼ 확산 매우 느림' },
        ],
      },
    ],
    apply(state, [country, [site]]) {
      settleHome(state, country);
      state.religion.sanctuary = site;
      addEffect(state, `sanctuary:${site}`);
      const label = pick(this.parts[1], site).label;
      return { lines: [`본거지 — ${world.countries[country].name}`, `성소 — ${label}`] };
    },
  },

  // ───────────────────────────── III
  {
    id: 'III', numeral: 'III', title: '첫 번째 씨앗',
    trigger: (s) => Boolean(s.story.done.II),
    narration: [
      '성소의 문이 열렸다. 그러나 안은 텅 비어 있다.',
      '당신을 믿는 사람은 고작 셋.',
      '늙은 어머니, 오랜 친구, 그리고 길을 잃고 들어온 낯선 사람.',
      '셋으로는 아무것도 바꿀 수 없다.',
      '세상이 당신의 이름을 듣게 하라.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '첫 포교의 방식을 정하라.',
        choices: [
          { id: 'booth', label: '길거리 무료 고민 상담 부스', flavor: '"요즘 많이 힘드시죠?" 그 한마디면 문이 열린다.', effectText: '▲ 꾸준한 전파 (유닛 전파↑)  ▼ 거부감 소폭↑' },
          { id: 'sns', label: 'SNS 힐링 영상 채널', flavor: '알고리즘이 당신의 설교를 실어 나른다.', effectText: '▲ 도시·고소득 국가↑  ▼ 언론 노출↑ (경계 증가)' },
          { id: 'network', label: '지인의 지인 초대 모임', flavor: '신도가 신도를 데려온다.', effectText: '▲ 자연 증가↑  ▼ 한 명이 떠나면 줄줄이 떠난다 (이탈↑)' },
          { id: 'food', label: '무료 급식과 쌀 나눔', flavor: '배고픈 자는 묻지 않는다.', effectText: '▲ 저소득 지역↑  ▼ 매달 신앙력 소모' },
        ],
      },
    ],
    afterword: '첫 선교사가 성소의 문을 나섰다.',
    apply(state, [[method]]) {
      state.religion.method = method;
      addEffect(state, `method:${method}`);
      grantUnit(state, 'missionary', home(state));
      state.incidents.next = Math.max(state.turn + 3, 5);
      return { lines: [`포교 방식 — ${pick(this.parts[0], method).label}`, '선교사 1명 합류'] };
    },
  },

  // ───────────────────────────── IV
  {
    id: 'IV', numeral: 'IV', title: '울타리',
    trigger: (s) => totalFollowers(s) >= 100,
    narration: [
      '백 명. 이제 당신의 이름을 속삭이는 사람이 백 명이다.',
      '그러나 숫자가 늘어난 만큼 틈도 생겼다.',
      '누군가는 의심하기 시작했고, 누군가는 가족의 전화를 받기 시작했다.',
      '오늘 붙잡지 못한 한 명이, 내일의 폭로자가 된다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 3,
        question: '탈퇴와 배신을 막을 세 개의 울타리를 세워라.',
        choices: TENET_ORDER.map((id) => ({
          id, label: TENETS[id].name, flavor: TENETS[id].desc, dark: TENETS[id].dark,
          effectText: [...TENETS[id].pros.map((p) => `▲ ${p}`), ...TENETS[id].cons.map((c) => `▼ ${c}`)].join('  '),
        })),
      },
    ],
    afterword: '울타리는 양을 지키기도 하지만, 언젠가 누군가는 그것을 감옥이라 부를 것이다.',
    apply(state, [tenets]) {
      state.religion.tenets = [...tenets];
      return { lines: [`울타리 — ${tenets.map((t) => TENETS[t].name).join(' · ')}`] };
    },
  },

  // ───────────────────────────── V
  {
    id: 'V', numeral: 'V', title: '카메라',
    trigger: (s) => totalFollowers(s) >= 1000 || homeCs(s).aversion >= 0.3 || homeCs(s).alert >= 0.3,
    narration: [
      '새벽 6시. 성소 앞에 낯선 승합차가 서 있다.',
      '[단독] 도심 속 수상한 공동체… 탈퇴자 "그곳에선 시간이 멈춰 있었다"',
      '당신의 얼굴이 저녁 뉴스에 걸렸다.',
      '신도들의 휴대폰이 동시에 울리기 시작한다.',
      '지금의 대응이, 이 교단의 다음 10년을 결정한다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '이 위기를 뒤집을 묘안을 내라.',
        choices: [
          { id: 'press', label: '정면 돌파 기자회견', flavor: '카메라 앞에 선다.', effectText: (s) => `성공하면 본거지 신도 +25%, 실패하면 전국적 망신 (성공 확률 약 ${pct(pressChance(s))})` },
          { id: 'lawsuit', label: '맞불 소송', flavor: '"명백한 허위 보도입니다."', dark: 1, cost: (s) => cost(s, S.lawsuit.cost), effectText: '▲ 보도가 잠잠해진다 (거부감↓)  ▼ 정부 경계↑ · 신앙력 소모', available: (s) => afford(s, S.lawsuit.cost) },
          { id: 'charity', label: '대규모 봉사활동', flavor: '연탄과 도시락으로 여론을 덮는다.', cost: (s) => cost(s, S.charity.cost), effectText: '▲ 거부감↓↓ 결속↑  ▼ 신앙력 크게 소모', available: (s) => afford(s, S.charity.cost) },
          { id: 'hide', label: '침묵과 잠적', flavor: '폭풍이 지나가길 기다린다.', effectText: '▲ 정부 경계 빠르게 회복  ▼ 3개월간 성장 정지' },
        ],
      },
    ],
    apply(state, [[choice]]) {
      const id = home(state);
      if (choice === 'press') {
        if (chance(state, pressChance(state))) {
          addFollowers(state, id, homeCs(state).followers * S.press.winFollowers);
          bumpAversion(state, id, S.press.winAversion);
          return { outcome: '회견장의 공기가 바뀌었다. 기자들은 질문 대신 고개를 끄덕였고, 다음 날 문 앞에 줄이 섰다.', tone: 'good', lines: ['정면 돌파 기자회견 — 성공'] };
        }
        bumpAversion(state, id, S.press.loseAversion);
        bumpAlert(state, id, S.press.loseAlert);
        changeUnity(state, S.press.loseUnity);
        return { outcome: '말이 꼬였다. 당신의 말실수는 밤새 수백만 번 재생되었다.', tone: 'bad', lines: ['정면 돌파 기자회견 — 실패'] };
      }
      if (choice === 'lawsuit') {
        state.faith -= cost(state, S.lawsuit.cost);
        bumpAversion(state, id, S.lawsuit.aversion);
        bumpAlert(state, id, S.lawsuit.alert);
        return { outcome: '보도는 멈췄다. 대신 당국의 서류철 하나가 두꺼워졌다.', lines: ['맞불 소송'] };
      }
      if (choice === 'charity') {
        state.faith -= cost(state, S.charity.cost);
        bumpAversion(state, id, S.charity.aversion);
        changeUnity(state, S.charity.unity);
        return { outcome: '앞치마를 두른 신도들의 사진이 뉴스를 덮었다.', tone: 'good', lines: ['대규모 봉사활동'] };
      }
      addEffect(state, 'press:hide', { turns: S.hide.turns });
      bumpAlert(state, id, S.hide.alert);
      return { outcome: '성소의 불이 꺼졌다. 세상은 곧 다른 뉴스로 넘어갔다.', lines: ['침묵과 잠적'] };
    },
  },

  // ───────────────────────────── VI
  {
    id: 'VI', numeral: 'VI', title: '금고',
    trigger: (s) => totalFollowers(s) >= 10_000,
    narration: [
      '조직도가 생겼다. 부서가 생겼고, 직함이 생겼고, 회의가 생겼다.',
      "이제 당신은 한 사람이 아니라 하나의 '기관'이다.",
      '그리고 기관은, 먹어야 산다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '교단의 금고를 어떻게 채우겠는가?',
        choices: [
          { id: 'business', label: '교단 직영 사업', flavor: '카페, 출판사, 건강식품.', effectText: '▲ 느리지만 꾸준한 매달 수입' },
          { id: 'estate', label: '성지 부동산 매입', flavor: '땅은 배신하지 않는다.', cost: (s) => cost(s, S.vault.estate.cost), effectText: '▲ 본거지에 첫 성지 (영구 보너스)  ▼ 즉시 큰 지출', available: (s) => afford(s, S.vault.estate.cost) },
          { id: 'savings', label: "'천국 적금' 특별 헌금", flavor: '금고가 순식간에 찬다.', dark: 3, effectText: '▲ 신앙력 즉시↑↑ 수입↑  ▼ 거부감↑ 이탈↑' },
          { id: 'overseas', label: '해외 후원 네트워크', flavor: '바다 건너 지부를 키운다.', effectText: '▲ 해외 유닛 비용↓ 해외 전파↑' },
        ],
      },
    ],
    afterword: '이제 신앙력으로 성지를 세울 수 있다. 나라 정보 패널에서 건설하라.',
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
      return { lines: [`금고 — ${pick(this.parts[0], choice).label}`, '성지 건설 해금'] };
    },
  },

  // ───────────────────────────── VII
  {
    id: 'VII', numeral: 'VII', title: '그림자',
    trigger: (s) => s.leader.age >= 60 || s.turn >= 144 || (Boolean(s.story.done.VIII) && s.turn > s.story.done.VIII.turn),
    narration: [
      '거울 속의 얼굴이 낯설다.',
      '손이 떨리고, 설교 도중 숨이 찬다.',
      '신은 영원하지만, 당신은 그렇지 않다.',
      '당신이 쓰러지는 순간 간부들은 칼을 뽑을 것이다.',
      '그 전에, 왕관을 넘길 자를 정하라.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '후계자를 지명하라.',
        choices: [
          { id: 'blood', label: '당신의 핏줄', flavor: '확실하지만, 간부들의 반발이 따른다.', effectText: '▲ 계승이 확실하다  ▼ 지금 결속↓, 계승 때 분열 위험 큼' },
          { id: 'loyal', label: '가장 충성스러운 간부', flavor: '조직은 안정되지만, 그에겐 당신의 빛이 없다.', effectText: '▲ 결속↑ 계승 충격 작음  ▼ 계승 뒤 전파↓' },
          { id: 'dream', label: '꿈에서 계시받은 무명의 신도', flavor: '신화가 된다.', effectText: '▲ 자연 증가↑  ▼ 열광과 의심이 동시에 (결속이 크게 흔들림)' },
          { id: 'immortal', label: '후계자는 없다, 나는 죽지 않는다', flavor: '불사 선언.', dark: 1, effectText: '▲ 지금 전파↑  ▼ 당신이 쓰러지면 교단 붕괴 (패배)' },
        ],
      },
      {
        kind: 'choice', pickCount: 1,
        question: '신도들을 어떻게 납득시킬 것인가?',
        choices: [
          { id: 'coronation', label: '성대한 즉위식', flavor: '모두가 보는 앞에서 왕관을 씌운다.', cost: (s) => cost(s, S.rite.coronation.cost), effectText: '▲ 결속↑  ▼ 신앙력 소모', available: (s) => afford(s, S.rite.coronation.cost) },
          { id: 'staged', label: '기적의 연출', flavor: '하늘이 그를 택했다는 증거를 보여 준다.', dark: 2, effectText: '▲ 결속↑↑  ▼ 그림자 장부' },
          { id: 'sealed', label: '봉인된 유언', flavor: '당신이 떠난 뒤에야 열리는 봉투.', effectText: '▲ 계승 때 충격 완화  ▼ 지금은 수군거림 (결속 소폭↓)' },
          { id: 'council', label: '간부 회의 만장일치', flavor: '모두가 손을 들었다는 기록을 남긴다.', effectText: '▲ 결속↑  ▼ 핏줄 후계라면 계승 때 반발이 더 크다' },
        ],
      },
    ],
    apply(state, [[heir], [rite]]) {
      const L = state.leader;
      let outcome = null;
      if (heir === 'immortal') {
        L.immortal = true;
        L.heir = null;
        addEffect(state, 'heir:immortal');
      } else {
        L.immortal = false;
        L.heir = heir;
        if (heir === 'blood') changeUnity(state, S.heir.blood.unity);
        if (heir === 'loyal') changeUnity(state, S.heir.loyal.unity);
        if (heir === 'dream') {
          const d = Math.round((rand(state) * 2 - 1) * S.heir.dream.unityRange);
          changeUnity(state, d);
          addEffect(state, 'heir:dream');
          outcome = d >= 0 ? '신도들은 무명의 이름을 기도문처럼 외우기 시작했다.' : '간부 회의실의 문이 쾅 닫혔다. 의심이 번지고 있다.';
        }
      }
      L.rite = rite;
      if (rite === 'coronation') { state.faith -= cost(state, S.rite.coronation.cost); changeUnity(state, S.rite.coronation.unity); }
      if (rite === 'staged') changeUnity(state, S.rite.staged.unity);
      if (rite === 'sealed') changeUnity(state, S.rite.sealed.unity);
      if (rite === 'council') changeUnity(state, S.rite.council.unity);
      return { outcome, lines: [`후계 — ${pick(this.parts[0], heir).label}`, `납득 — ${pick(this.parts[1], rite).label}`] };
    },
  },

  // ───────────────────────────── VIII
  {
    id: 'VIII', numeral: 'VIII', title: '사이렌',
    trigger: (s) => Boolean(s.flags.raidPending),
    narration: [
      '새벽 4시 17분. 정문이 부서지는 소리.',
      '압수수색 영장. 수십 명의 경찰. 마당을 가르는 플래시 불빛.',
      '신도들이 일제히 당신을 바라본다.',
      '당신이 무엇을 하든, 그들은 그것을 기억할 것이다.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '당신을 지킬 방법을 떠올려라.',
        choices: [
          { id: 'lawyers', label: '초호화 변호인단', flavor: '금고를 연다.', cost: (s) => cost(s, S.raid.lawyers.cost), effectText: (s) => `▲ 성공률 약 ${pct(raidChance(s, 'lawyers'))}  ▼ 신앙력 대량 소모`, available: (s) => afford(s, S.raid.lawyers.cost) },
          { id: 'scapegoat', label: '간부 한 명에게 모든 책임을', flavor: '당신은 살아남는다. 그러나 간부들은 이 일을 잊지 않는다.', dark: 4, effectText: (s) => `▲ 성공률 약 ${pct(raidChance(s, 'scapegoat'))}  ▼ 결속↓↓ 그림자 장부↑↑` },
          { id: 'exile', label: '해외 지부로 망명', flavor: '본거지를 잃고 바다 건너에서 재기한다.', effectText: (s) => `▲ 성공률 약 ${pct(raidChance(s, 'exile'))}  ▼ 본거지 신도 절반 손실, 옛 본거지 활동 금지`, available: (s) => (exileTarget(s) ? true : '신도 1,000명 이상인 해외 거점 필요') },
          { id: 'martyr', label: '순교를 선언하라', flavor: '스스로 수갑을 찬다.', effectText: `▲ 결속 최대, 순교 신화  ▼ 교주 수감 (${LEADER.jailTurns}턴 생산 불가)` },
        ],
      },
    ],
    apply(state, [[choice]]) {
      const id = home(state);
      state.flags.raidPending = false;
      state.flags.raidTurn = state.turn;
      const result = { lines: [`압수수색 대응 — ${pick(this.parts[0], choice).label}`] };
      if (choice === 'martyr') {
        raid(state, id);
        state.leader.jailedUntil = state.turn + LEADER.jailTurns;
        state.unity = S.raid.martyr.unity;
        bumpAversion(state, id, S.raid.martyr.aversion);
        addEffect(state, 'lockdown', { turns: S.raid.lockdownTurns, params: { factor: S.raid.lockdown } });
        result.outcome = '당신은 스스로 손목을 내밀었다. 그 사진은 성소의 모든 벽에 걸렸다.';
        result.tone = 'good';
        result.lines.push('교주 수감');
        return result;
      }
      if (choice === 'lawyers') state.faith -= cost(state, S.raid.lawyers.cost);
      if (choice === 'scapegoat') changeUnity(state, S.raid.scapegoat.unity);
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
        result.outcome = choice === 'exile'
          ? `당신을 태운 배가 새벽 안개 속으로 사라졌다. 새 본거지는 ${world.countries[state.religion.home].name}.`
          : '영장은 집행되었지만, 당신의 손목에는 아무것도 채워지지 않았다.';
        result.tone = 'good';
        result.lines.push('교주는 살아남았다');
        return result;
      }
      const report = { events: [] };
      leaderFalls(state, 'arrest', report);
      const succeeded = report.events.some((e) => e.type === 'succession');
      result.outcome = succeeded
        ? '수갑이 채워졌다. 그날 밤, 후계자가 처음으로 연단에 섰다.'
        : '수갑이 채워졌다. 연단은 비어 있었다.';
      result.tone = 'bad';
      result.lines.push(succeeded ? '교주 체포 — 후계자가 계승' : '교주 체포');
      return result;
    },
  },

  // ───────────────────────────── IX
  {
    id: 'IX', numeral: 'IX', title: '봉쇄',
    trigger: (s) => Boolean(s.story.done.VIII) && s.turn >= s.story.done.VIII.turn + 3,
    narration: [
      '뉴스는 끝나지 않았다.',
      '당신의 교단 이름은 이제 하나의 욕이 되었다.',
      '상담 부스는 신고당하고, 성소 앞에는 신도 가족들의 피켓이 줄지어 섰다.',
      '문이 닫혔다면, 창문을 찾아라.',
    ],
    parts: [
      {
        kind: 'choice', pickCount: 1,
        question: '새 신도를 데려올 길을 찾아라.',
        choices: [
          { id: 'rebrand', label: '새 이름, 새 간판', flavor: '다른 단체로 다시 시작한다.', dark: 2, effectText: '▲ 본거지 거부감 절반으로  ▼ 들키면 2배 역풍' },
          { id: 'inner', label: '안으로 깊게', flavor: '기존 신도의 가족과 지인부터 품는다.', effectText: '▲ 봉쇄 완화 · 본거지 증가↑ · 이탈↓  ▼ 느리다' },
          { id: 'overseas', label: '바다 건너로', flavor: '해외 포교에 모든 것을 건다.', effectText: '▲ 해외 전파·증가↑↑  ▼ 본거지는 포기 (본거지↓)' },
          { id: 'faceless', label: '얼굴 없는 설교', flavor: '온라인 비대면 모임.', effectText: '▲ 익명성↑ 정부 경계 증가↓  ▼ 결속↓ (이탈↑)' },
        ],
      },
    ],
    afterword: {
      title: '교주의 비망록 #1',
      lines: ['"문이 닫히면 안을 보거나, 바다 건너를 보라."', '외부의 공격으로 신도 모집이 어려울 때는 내부에서 방법을 찾거나 국외로 눈을 돌릴 수 있다.'],
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
      return { lines: [`봉쇄 돌파 — ${pick(this.parts[0], choice).label}`] };
    },
  },
];

// 정면 돌파 기자회견 성공 확률
export function pressChance(state) {
  const bonus = DEITY_VALUES[state.religion.deity]?.pressBonus ?? 0;
  return clamp01(S.press.base + bonus - S.press.riskPenalty * state.riskPoints);
}

// 압수수색 대응 성공 확률 (그림자 장부가 깎고, 침묵의 계율이 올린다)
export function raidChance(state, choice) {
  const base = S.raid[choice]?.success ?? 1;
  const secret = state.religion.tenets.includes('secretive') ? TENET_VALUES.secretive.raidBonus : 0;
  return clamp01(base + secret - RISK.raidPenalty * state.riskPoints);
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
