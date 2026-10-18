import { UNITS, AVERSION } from '../config.js';
import { world } from '../data/loader.js';
import { spreadAmount, addFollowers, share } from '../religion/spread.js';

// 유닛 능력 표.
//   act(state, unit)    — 플레이어가 누르는 행동. { ok, converted, consumed, message } 를 돌려준다.
//   onTurn(state, unit) — 매 턴 자동으로 일어나는 효과. 바뀐 신도 수를 돌려준다.
//   attritionShield(state, unit) — 머무는 나라 이탈 감소율 (0~1)
// 새 유닛(2단계: 사도 등)은 여기 항목만 추가하면 된다.
export const ABILITIES = {
  missionary: {
    act(state, unit) {
      const converted = addFollowers(state, unit.at, spreadAmount(state, unit.at, UNITS.missionary.power));
      unit.usesLeft -= 1;
      return { ok: true, converted, consumed: unit.usesLeft <= 0 };
    },
  },

  relief: {
    act(state, unit) {
      const cs = state.countries[unit.at];
      const before = cs.aversion;
      cs.aversion = Math.max(0, cs.aversion - UNITS.relief.aversionCut);
      const converted = addFollowers(state, unit.at, spreadAmount(state, unit.at, UNITS.relief.power));
      return { ok: true, converted, aversionCut: before - cs.aversion, consumed: false };
    },
  },

  witness: {
    act(state, unit) {
      const converted = addFollowers(state, unit.at, spreadAmount(state, unit.at, UNITS.witness.power));
      const cs = state.countries[unit.at];
      cs.aversion = Math.min(AVERSION.max, cs.aversion + AVERSION.witnessGain);
      return { ok: true, converted, consumed: true };
    },
  },

  theologian: {
    onTurn(state, unit) {
      const cfg = UNITS.theologian;
      let total = addFollowers(state, unit.at, spreadAmount(state, unit.at, cfg.hostPressure));
      for (const n of world.countries[unit.at].land) total += addFollowers(state, n, spreadAmount(state, n, cfg.neighborPressure));
      return total;
    },
  },

  guardian: {
    attritionShield(state, unit) {
      const cfg = UNITS.guardian;
      return share(state, unit.at) >= cfg.minShare ? cfg.attritionCut : cfg.weakAttritionCut;
    },
  },
};
