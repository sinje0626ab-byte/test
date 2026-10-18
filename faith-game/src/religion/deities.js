import { DEITY_VALUES as V } from '../config.js';

// 신앙 대상. 효과는 modifiers.js가 읽는 '수정자' 형태로 정의한다.
// 수정자 값은 숫자 또는 (나라, 상태) → 숫자 함수.
const isHome = (c, state) => c.id === state.religion.home || c.land.includes(state.religion.home);

export const DEITIES = {
  monotheism: {
    name: '유일신',
    desc: '하나의 절대자를 섬깁니다. 믿음이 깊어 잘 떠나지 않지만, 받아들이기까지 시간이 걸립니다.',
    pros: ['이탈 −15%'],
    cons: ['전파 −5%'],
    mods: { attrition: V.monotheism.attrition, unitPower: V.monotheism.unitPower, growth: V.monotheism.growth },
  },
  cosmos: {
    name: '자연·우주',
    desc: '자연과 우주의 질서를 섬깁니다. 땅과 가까이 사는 농촌에서 쉽게 공감을 얻습니다.',
    pros: ['농촌이 많은 나라 전파↑'],
    cons: ['대도시 국가 전파↓'],
    mods: {
      unitPower: (c) => V.cosmos.ruralBase + V.cosmos.ruralBonus * (1 - c.urban),
      growth: (c) => V.cosmos.ruralBase + V.cosmos.ruralBonus * (1 - c.urban),
    },
  },
  ancestors: {
    name: '조상',
    desc: '조상의 뜻을 기립니다. 고향과 그 이웃에서는 강하지만 멀리 갈수록 낯설게 받아들여집니다.',
    pros: ['시작 국가·이웃 전파 +25%', '이탈 −10%'],
    cons: ['그 밖의 나라 전파 −12%'],
    mods: {
      unitPower: (c, s) => (isHome(c, s) ? V.ancestors.homeBonus : V.ancestors.awayPenalty),
      growth: (c, s) => (isHome(c, s) ? V.ancestors.homeBonus : V.ancestors.awayPenalty),
      attrition: V.ancestors.attrition,
    },
  },
  science: {
    name: '외계·과학',
    desc: '과학과 우주 너머의 존재에서 진리를 찾습니다. 교육 수준이 높은 도시 사회에 잘 스며듭니다.',
    pros: ['고소득·도시 국가 전파↑'],
    cons: ['저소득 국가 전파↓'],
    mods: {
      unitPower: (c) => V.science.base + c.gdpTier * V.science.perGdpTier + c.urban * V.science.perUrban,
      growth: (c) => V.science.base + c.gdpTier * V.science.perGdpTier + c.urban * V.science.perUrban,
    },
  },
  founder: {
    name: '교주 신격화',
    desc: '교주를 신의 현신으로 받듭니다. 카리스마로 빠르게 사람을 모으지만 결속은 약합니다.',
    pros: ['유닛 전파 +25%', '신앙력 +10%'],
    cons: ['이탈 +15%'],
    mods: { unitPower: V.founder.unitPower, attrition: V.founder.attrition, faith: V.founder.faith },
  },
};

export const DEITY_ORDER = ['monotheism', 'cosmos', 'ancestors', 'science', 'founder'];
