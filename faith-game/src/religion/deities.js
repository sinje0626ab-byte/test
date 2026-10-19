import { DEITY_VALUES as V } from '../config.js';

// 절대 원칙 (계시 I). 내부 id 는 예전 '신앙 대상' 그대로 쓴다.
// 효과는 modifiers.js 가 읽는 수정자: 숫자 또는 (나라, 상태) → 숫자 함수.
// 실존 종교를 겨냥하지 않고 나라 특성(도시화·소득·거리)에만 반응한다.
const isHome = (c, state) => c.id === state.religion.home || c.land.includes(state.religion.home);

export const DEITIES = {
  founder: {
    name: '마지막 예언자',
    creed: '나는 신이 보낸 마지막 예언자다',
    desc: '카리스마로 빠르게 모이지만, 모든 것이 당신 한 사람에게 달린다.',
    pros: ['유닛 전파 +20%', '신앙력 +10%', '기자회견 성공률↑'],
    cons: ['이탈 +12%'],
    mods: { unitPower: V.founder.unitPower, attrition: V.founder.attrition, faith: V.founder.faith },
  },
  monotheism: {
    name: '유일한 신',
    creed: '오직 하나의 신만이 구원한다',
    desc: '늦게 믿지만, 쉽게 떠나지 않는다.',
    pros: ['이탈 −18%'],
    cons: ['전파 −5%'],
    mods: { attrition: V.monotheism.attrition, unitPower: V.monotheism.unitPower, growth: V.monotheism.growth },
  },
  cosmos: {
    name: '우주의 숨결',
    creed: '우주는 하나의 숨결로 이어져 있다',
    desc: '땅과 가까운 사람들이 먼저 귀를 연다.',
    pros: ['농촌이 많은 나라 전파↑'],
    cons: ['대도시 국가 전파↓'],
    mods: {
      unitPower: (c) => V.cosmos.ruralBase + V.cosmos.ruralBonus * (1 - c.urban),
      growth: (c) => V.cosmos.ruralBase + V.cosmos.ruralBonus * (1 - c.urban),
    },
  },
  ancestors: {
    name: '조상의 피',
    creed: '조상의 피가 너의 운명을 정한다',
    desc: '고향에서는 무적, 바다 건너에선 이방인.',
    pros: ['본거지·이웃 전파 +25%', '이탈 −10%'],
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
    desc: '배운 자들일수록 매혹된다.',
    pros: ['고소득·도시 국가 전파↑'],
    cons: ['저소득 국가 전파↓'],
    mods: {
      unitPower: (c) => V.science.base + c.gdpTier * V.science.perGdpTier + c.urban * V.science.perUrban,
      growth: (c) => V.science.base + c.gdpTier * V.science.perGdpTier + c.urban * V.science.perUrban,
    },
  },
};

export const DEITY_ORDER = ['founder', 'monotheism', 'cosmos', 'ancestors', 'science'];
