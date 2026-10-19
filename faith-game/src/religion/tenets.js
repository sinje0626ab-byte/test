import { TENET_VALUES as V, TENET_RISK } from '../config.js';

// 울타리 (계시 IV). 내부 id 는 예전 '교리' 그대로 쓴다.
// 덧셈형 수정자(aversionGain, alertGain)는 매 턴 신도가 있는 나라마다 더해지는 양이다.
// dark: 고르면 그림자 장부에 쌓이는 점수
const ramp = (share, full) => Math.min(1, share / full);

export const TENETS = {
  communal: {
    name: '공동 생활관',
    desc: '함께 먹고 함께 잔다. 떠날 곳 자체를 지운다.',
    pros: ['이탈 −25%'],
    cons: ['도시화된 나라 전파↓'],
    dark: TENET_RISK.communal,
    mods: {
      attrition: V.communal.attrition,
      unitPower: (c) => 1 - V.communal.urbanPenalty * c.urban,
      growth: (c) => 1 - V.communal.urbanPenalty * c.urban,
    },
  },
  tithe: {
    name: '헌신 서약과 십일조',
    desc: '바친 것이 많을수록 떠나기 어렵다.',
    pros: ['신앙력 +50%'],
    cons: ['신도가 많은 나라의 거부감↑'],
    dark: TENET_RISK.tithe,
    mods: { faith: V.tithe.faith },
    add: { aversionGain: (c, s, share) => V.tithe.aversionGain * ramp(share, V.tithe.aversionFullShare) },
  },
  healing: {
    name: '치유 간증 집회',
    desc: '기적을 본 자는 떠나지 않는다.',
    pros: ['저소득 국가 전파 최대 +30%'],
    cons: ['신도가 있는 모든 나라의 정부 경계↑'],
    dark: TENET_RISK.healing,
    mods: {
      unitPower: (c) => V.healing.poorBonus[c.gdpTier] ?? 1,
      growth: (c) => V.healing.poorBonus[c.gdpTier] ?? 1,
    },
    add: { alertGain: (c, s, share) => V.healing.alertGain * ramp(share, V.healing.alertFullShare) },
  },
  secretive: {
    name: '침묵의 계율',
    desc: '바깥의 목소리는 시험일 뿐이다.',
    pros: ['탄압 피해 −50%', '정부 경계 증가 −40%', '압수수색 대응 성공률↑'],
    cons: ['전파 −6%'],
    dark: TENET_RISK.secretive,
    mods: { unitPower: V.secretive.unitPower, growth: V.secretive.growth, persecution: V.secretive.persecution, alertMul: V.secretive.alertMul },
  },
  ascetic: {
    name: '새벽 정결 의식',
    desc: '엄격함이 소속감이 된다.',
    pros: ['이탈 −25%'],
    cons: ['전파 −5%'],
    dark: TENET_RISK.ascetic,
    mods: { attrition: V.ascetic.attrition, unitPower: V.ascetic.unitPower, growth: V.ascetic.growth },
  },
  open: {
    name: '열린 문 정책',
    desc: '떠나는 자를 붙잡지 않는다. 대신 누구든 들어온다.',
    pros: ['기존 종교 저항력 −15%'],
    cons: ['이탈 +25%'],
    dark: TENET_RISK.open,
    mods: { resistance: V.open.resistance, attrition: V.open.attrition },
  },
};

export const TENET_ORDER = ['communal', 'tithe', 'healing', 'secretive', 'ascetic', 'open'];
