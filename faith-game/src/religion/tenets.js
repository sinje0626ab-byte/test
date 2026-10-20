import { TENET_VALUES as V, TENET_RISK } from '../config.js';

// 울타리 (계시 IV). 내부 id 는 예전 '교리' 그대로 쓴다.
// 덧셈형 수정자(aversionGain, alertGain)는 매 턴 신도가 있는 나라마다 더해지는 양이다.
// dark: 고르면 그림자 장부에 쌓이는 점수
const ramp = (share, full) => Math.min(1, share / full);

export const TENETS = {
  communal: {
    name: '공동 생활관',
    desc: '같이 먹고 같이 잔다. 돌아갈 방이 없으면 잘 안 나간다.',
    say: ['mom', '밥은 내가 다 하는 거지? 그럼 쌀은 20킬로짜리로 사라.'],
    pros: ['이탈 −25%'],
    cons: ['도시가 많은 나라에서 전파 줄어듦'],
    dark: TENET_RISK.communal,
    mods: {
      attrition: V.communal.attrition,
      unitPower: (c) => 1 - V.communal.urbanPenalty * c.urban,
      growth: (c) => 1 - V.communal.urbanPenalty * c.urban,
    },
  },
  tithe: {
    name: '헌신 서약과 십일조',
    desc: '월급의 10%. 낸 돈이 쌓일수록 그만두기가 아깝다.',
    say: ['taesik', '10%면... 세전이야, 세후야?'],
    pros: ['신앙력 +50%'],
    cons: ['신도가 많은 나라에서 거부감이 쌓임'],
    dark: TENET_RISK.tithe,
    mods: { faith: V.tithe.faith },
    add: { aversionGain: (c, s, share) => V.tithe.aversionGain * ramp(share, V.tithe.aversionFullShare) },
  },
  healing: {
    name: '치유 간증 집회',
    desc: '"허리가 나았어요" 한마디가 전단지 천 장보다 세다.',
    say: ['subin', '나았다는 분은 많은데 진단서 가져오신 분은 아직 없어요.'],
    pros: ['소득 낮은 나라 전파 최대 +30%'],
    cons: ['신도가 있는 모든 나라에서 정부 경계가 쌓임'],
    dark: TENET_RISK.healing,
    mods: {
      unitPower: (c) => V.healing.poorBonus[c.gdpTier] ?? 1,
      growth: (c) => V.healing.poorBonus[c.gdpTier] ?? 1,
    },
    add: { alertGain: (c, s, share) => V.healing.alertGain * ramp(share, V.healing.alertFullShare) },
  },
  secretive: {
    name: '침묵의 계율',
    desc: '성소 안 얘기는 성소 안에서만. 가족 단톡방에도 안 된다.',
    say: ['minho', '근데요, 배달 기사들끼리 하는 단톡도 안 돼요?'],
    pros: ['압수수색 피해 −50%', '정부 경계 쌓임 −40%', '압수수색 대응이 쉬워짐'],
    cons: ['전파 −6%'],
    dark: TENET_RISK.secretive,
    mods: { unitPower: V.secretive.unitPower, growth: V.secretive.growth, persecution: V.secretive.persecution, alertMul: V.secretive.alertMul },
  },
  ascetic: {
    name: '새벽 정결 의식',
    desc: '새벽 다섯 시 찬물 세수. 같이 버틴 사람끼리는 금방 친해진다.',
    say: ['jeongsuk', '어머, 저 다섯 시는 원래 일어나요. 보험 하면 다 그래요.'],
    pros: ['이탈 −25%'],
    cons: ['전파 −5%'],
    dark: TENET_RISK.ascetic,
    mods: { attrition: V.ascetic.attrition, unitPower: V.ascetic.unitPower, growth: V.ascetic.growth },
  },
  open: {
    name: '열린 문 정책',
    desc: '누구든 들어오고 누구든 나간다. 출석부는 연필로 쓴다.',
    say: ['taesik', '나간 사람 헌금은 돌려줘야 돼?'],
    pros: ['기존 종교 저항 −15%'],
    cons: ['이탈 +25%'],
    dark: TENET_RISK.open,
    mods: { resistance: V.open.resistance, attrition: V.open.attrition },
  },
};

export const TENET_ORDER = ['communal', 'tithe', 'healing', 'secretive', 'ascetic', 'open'];
