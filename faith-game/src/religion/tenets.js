import { TENET_VALUES as V } from '../config.js';

// 교리 속성. 각 교리는 장점과 단점을 함께 가진다.
// 덧셈형 수정자(aversionGain, alertGain)는 매 턴 나라별로 더해지는 양이다.
const ramp = (share, full) => Math.min(1, share / full);

export const TENETS = {
  ascetic: {
    name: '금욕 계율',
    desc: '엄격한 생활 규율을 지킵니다.',
    pros: ['이탈 −30%'],
    cons: ['전파 −15%'],
    mods: { attrition: V.ascetic.attrition, unitPower: V.ascetic.unitPower, growth: V.ascetic.growth },
  },
  tithe: {
    name: '헌금 의무',
    desc: '신도에게 정기적인 헌금을 요구합니다.',
    pros: ['신앙력 +40%'],
    cons: ['신도가 많은 나라의 거부감↑'],
    mods: { faith: V.tithe.faith },
    add: { aversionGain: (c, s, share) => V.tithe.aversionGain * ramp(share, V.tithe.aversionFullShare) },
  },
  healing: {
    name: '치유의 기적',
    desc: '병을 고치는 기적을 내세웁니다.',
    pros: ['저소득 국가 전파 최대 +35%'],
    cons: ['정부 경계↑'],
    mods: {
      unitPower: (c) => V.healing.poorBonus[c.gdpTier] ?? 1,
      growth: (c) => V.healing.poorBonus[c.gdpTier] ?? 1,
    },
    add: { alertGain: (c, s, share) => V.healing.alertGain * ramp(share, V.healing.alertFullShare) },
  },
  open: {
    name: '개방적 교리',
    desc: '다른 신앙과 함께 믿는 것(겸업)을 허용합니다.',
    pros: ['기존 종교 저항력 −20%'],
    cons: ['충성도↓ 이탈 +35%'],
    mods: { resistance: V.open.resistance, attrition: V.open.attrition },
  },
  communal: {
    name: '공동체 생활',
    desc: '신도들이 함께 모여 삽니다.',
    pros: ['이탈 −28% (방어↑)'],
    cons: ['도시화된 나라 전파↓'],
    mods: {
      attrition: V.communal.attrition,
      unitPower: (c) => 1 - V.communal.urbanPenalty * c.urban,
      growth: (c) => 1 - V.communal.urbanPenalty * c.urban,
    },
  },
  secretive: {
    name: '비밀주의',
    desc: '교리와 의식을 바깥에 드러내지 않습니다.',
    pros: ['탄압 피해 −50%', '정부 경계 증가 −50%'],
    cons: ['전파 −15%'],
    mods: { unitPower: V.secretive.unitPower, growth: V.secretive.growth, persecution: V.secretive.persecution, alertMul: V.secretive.alertGain },
  },
};

export const TENET_ORDER = ['ascetic', 'tithe', 'healing', 'open', 'communal', 'secretive'];
