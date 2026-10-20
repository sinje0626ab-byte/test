import { DEITY_VALUES as V } from '../config.js';

// 절대 원칙 (계시 I). 내부 id 는 예전 '신앙 대상' 그대로 쓴다.
// 효과는 modifiers.js 가 읽는 수정자: 숫자 또는 (나라, 상태) → 숫자 함수.
// 실존 종교를 겨냥하지 않고 나라 특성(도시화·소득·거리)에만 반응한다.
const isHome = (c, state) => c.id === state.religion.home || c.land.includes(state.religion.home);

export const DEITIES = {
  founder: {
    name: '마지막 예언자',
    creed: '나는 신이 보낸 마지막 예언자다',
    desc: '사람이 빨리 모인다. 다들 교주 얼굴 보러 오는 거라, 교주가 감기만 걸려도 출석이 준다.',
    say: ['mom', '마지막은 무슨. 니가 우리 집 막내도 아닌데.'],
    pros: ['유닛 전파 +20%', '신앙력 +10%', '기자회견이 잘 먹힘'],
    cons: ['이탈 +12%'],
    mods: { unitPower: V.founder.unitPower, attrition: V.founder.attrition, faith: V.founder.faith },
  },
  monotheism: {
    name: '유일한 신',
    creed: '오직 하나의 신만이 구원한다',
    desc: '믿기까지 오래 걸린다. 한번 믿은 사람은 이사를 가도 버스 타고 온다.',
    say: ['taesik', '하나면 외우기는 쉽겠네.'],
    pros: ['이탈 −18%'],
    cons: ['전파 −5%'],
    mods: { attrition: V.monotheism.attrition, unitPower: V.monotheism.unitPower, growth: V.monotheism.growth },
  },
  cosmos: {
    name: '우주의 숨결',
    creed: '우주는 하나의 숨결로 이어져 있다',
    desc: '논밭 있는 동네 어르신들이 먼저 고개를 끄덕인다. 아파트 단지에서는 숨결 얘기를 하면 창문을 닫는다.',
    say: ['minho', '근데요, 미세먼지 많은 날에도 숨결이에요?'],
    pros: ['농촌이 많은 나라에서 전파 늘어남'],
    cons: ['대도시 나라에서 전파 줄어듦'],
    mods: {
      unitPower: (c) => V.cosmos.ruralBase + V.cosmos.ruralBonus * (1 - c.urban),
      growth: (c) => V.cosmos.ruralBase + V.cosmos.ruralBonus * (1 - c.urban),
    },
  },
  ancestors: {
    name: '조상의 피',
    creed: '조상의 피가 너의 앞날을 정한다',
    desc: '한국에서는 족보 얘기 한 번에 대화가 길어진다. 비행기만 타면 다들 무슨 소린지 모른다.',
    say: ['mom', '그럼 제사는 계속 지내는 거지? 전은 누가 부치고?'],
    pros: ['본거지와 육로 이웃 전파 +25%', '이탈 −10%'],
    cons: ['그 밖의 나라 전파 −10%'],
    mods: {
      unitPower: (c, s) => (isHome(c, s) ? V.ancestors.homeBonus : V.ancestors.awayPenalty),
      growth: (c, s) => (isHome(c, s) ? V.ancestors.homeBonus : V.ancestors.awayPenalty),
      attrition: V.ancestors.attrition,
    },
  },
  science: {
    name: '별 너머의 존재',
    creed: '저 별 너머의 존재가 우리를 선택했다',
    desc: '석사 이상, 연봉 높은 사람들이 의외로 잘 넘어온다. 다들 유튜브로 우주 다큐를 너무 많이 봤다.',
    say: ['taesik', '외계인? 야, 아니 교주님, 그건 좀... 아니다, 해 보자.'],
    pros: ['소득 높은 도시 나라에서 전파 늘어남'],
    cons: ['소득 낮은 나라에서 전파 줄어듦'],
    mods: {
      unitPower: (c) => V.science.base + c.gdpTier * V.science.perGdpTier + c.urban * V.science.perUrban,
      growth: (c) => V.science.base + c.gdpTier * V.science.perGdpTier + c.urban * V.science.perUrban,
    },
  },
};

export const DEITY_ORDER = ['founder', 'monotheism', 'cosmos', 'ancestors', 'science'];
