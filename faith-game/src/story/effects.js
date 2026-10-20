import { STORY, HOLY_SITE, STAGES, DIASPORA } from '../config.js';

// 계시·사건이 남기는 지속 효과 정의. state.extraModifiers 에는 ref 문자열만 저장되고
// 실제 수정자({ mods, add })는 이 표에서 만든다 (함수는 저장할 수 없으므로).
//   mods: 곱셈형 (unitPower · growth · attrition · resistance · faith · alertMul · diffusion · unitCost)
//   add:  덧셈형 (aversionGain · alertGain 은 나라별 매 턴, faithFlat 은 매 턴 신앙력)
// 함수 인자는 (나라, 상태, 우리 비율). 나라 없이 부르는 전역 계산에서는 나라가 null 이다.

const home = (c, s) => Boolean(c) && c.id === s.religion.home;
const abroad = (c, s) => Boolean(c) && c.id !== s.religion.home;
const onlyHome = (v) => (c, s) => (home(c, s) ? v : 1);
const onlyAbroad = (v) => (c, s) => (abroad(c, s) ? v : 1);
const addHome = (v) => (c, s) => (home(c, s) ? v : 0);
const stageIdx = (s) => Math.max(0, STAGES.findIndex((x) => x.id === s.stage));
const total = (s) => { let t = 0; for (const k in s.countries) t += s.countries[k].followers; return t; };

const S = STORY;

export const EFFECTS = {
  // ── 계시 II · 성소 ──
  'sanctuary:mountain': { mods: { attrition: onlyHome(S.sanctuary.mountain.attrition), alertMul: onlyHome(S.sanctuary.mountain.alertMul), growth: onlyHome(S.sanctuary.mountain.growth) } },
  'sanctuary:downtown': {
    mods: { unitPower: onlyHome(S.sanctuary.downtown.unitPower), growth: onlyHome(S.sanctuary.downtown.growth) },
    add: { alertGain: addHome(S.sanctuary.downtown.alertGain), aversionGain: addHome(S.sanctuary.downtown.aversionGain) },
  },
  'sanctuary:campus': {
    mods: {
      growth: (c, s) => (total(s) < S.sanctuary.campus.earlyUntil ? S.sanctuary.campus.earlyGrowth : 1),
      unitPower: (c, s) => (total(s) < S.sanctuary.campus.earlyUntil ? S.sanctuary.campus.earlyPower : 1),
      attrition: onlyHome(S.sanctuary.campus.attrition),
    },
  },
  'sanctuary:island': {
    mods: {
      attrition: onlyHome(S.sanctuary.island.attrition), alertMul: onlyHome(S.sanctuary.island.alertMul),
      growth: onlyHome(S.sanctuary.island.growth), diffusion: S.sanctuary.island.diffusion,
    },
  },

  // ── 계시 III · 포교 방식 ──
  'method:booth': { mods: { unitPower: S.method.booth.unitPower }, add: { aversionGain: S.method.booth.aversionGain } },
  'method:sns': {
    mods: {
      unitPower: (c) => (c ? S.method.sns.base + c.gdpTier * S.method.sns.perGdpTier : 1),
      growth: (c) => (c ? S.method.sns.base + c.gdpTier * S.method.sns.perGdpTier : 1),
    },
    add: { alertGain: S.method.sns.alertGain },
  },
  'method:network': { mods: { growth: S.method.network.growth, attrition: S.method.network.attrition } },
  'method:food': {
    mods: {
      unitPower: (c) => (c ? S.method.food.poorBonus[c.gdpTier] ?? 1 : 1),
      growth: (c) => (c ? S.method.food.poorBonus[c.gdpTier] ?? 1 : 1),
    },
    add: { faithFlat: (c, s) => -(S.method.food.upkeep + S.method.food.upkeepPerStage * stageIdx(s)) },
  },

  // ── 계시 V · 카메라 ──
  'press:hide': { mods: { growth: 0, unitPower: 0.2, alertMul: 0 } },

  // ── 계시 VI · 금고 ──
  'vault:business': { add: { faithFlat: (c, s) => S.vault.business.faith + S.vault.business.faithPerStage * stageIdx(s) } },
  'vault:savings': { mods: { faith: S.vault.savings.faithMul, attrition: S.vault.savings.attrition } },
  'vault:overseas': { mods: { unitPower: onlyAbroad(S.vault.overseas.unitPower), unitCost: onlyAbroad(S.vault.overseas.costMul) } },

  // ── 계시 VII · 그림자 ──
  'heir:loyal': { mods: { unitPower: S.heir.loyal.unitPower } },
  'heir:dream': { mods: { growth: S.heir.dream.growth } },
  'heir:immortal': { mods: { unitPower: S.heir.immortal.unitPower } },

  // ── 계시 VIII · 사이렌 / IX · 봉쇄 ──
  lockdown: ({ factor = S.raid.lockdown }) => ({ mods: { unitPower: onlyHome(factor), growth: onlyHome(factor) } }),
  'blockade:inner': { mods: { growth: onlyHome(S.blockade.inner.growth), attrition: S.blockade.inner.attrition } },
  'blockade:overseas': {
    mods: {
      unitPower: (c, s) => (c ? (home(c, s) ? S.blockade.overseas.home : S.blockade.overseas.abroad) : 1),
      growth: (c, s) => (c ? (home(c, s) ? S.blockade.overseas.home : S.blockade.overseas.abroad) : 1),
    },
  },
  'blockade:faceless': { mods: { alertMul: S.blockade.faceless.alertMul, attrition: S.blockade.faceless.attrition } },

  // ── 사건 카드 (기한이 있는 효과) ──
  'incident:retreat': { mods: { attrition: 0.7 } },
  'incident:crackdown': { mods: { attrition: 0.6 }, add: { aversionGain: 0.004 } },
  'incident:celebrity': { mods: { growth: onlyHome(1.3) } },
  'incident:rumor': { mods: { growth: 1.15 } },
  'incident:scandal': { mods: { growth: 0.8 } },
  'incident:feud': { mods: { attrition: 1.25 } },
  'incident:viral': { mods: { growth: onlyHome(1.2) } },
  'incident:quota': { mods: { growth: 1.2 }, add: { aversionGain: 0.006 } },
  'incident:sticker': { mods: { unitPower: onlyHome(1.1) } },
};

// 해외 한인 사회: 교단이 초대장을 받을 만큼 커진 뒤(신도 1,000명), 그 나라 우리 비율이 작을 때만
// 전파·증가 보너스 (첫 진출을 돕는다. 처음부터 주면 이웃 나라로 너무 일찍 번진다)
const diasporaBoost = (c, s, share) => {
  const w = c ? DIASPORA.weights[c.id] : 0;
  return w && share < DIASPORA.cap && total(s) >= DIASPORA.invite.min ? 1 + w * DIASPORA.bonus : 1;
};
export const diasporaSource = { mods: { unitPower: diasporaBoost, growth: diasporaBoost } };

// 성지: state.holySites 에 있는 나라마다 영구 보너스
export function holySiteSource(state) {
  const sites = state.holySites ?? {};
  if (!Object.keys(sites).length) return null;
  const has = (c) => Boolean(c) && Boolean(sites[c.id]);
  return {
    mods: {
      growth: (c) => (has(c) ? HOLY_SITE.growth : 1),
      attrition: (c) => (has(c) ? HOLY_SITE.attrition : 1),
    },
    add: { faithFlat: () => HOLY_SITE.faith * Object.keys(sites).length },
  };
}
