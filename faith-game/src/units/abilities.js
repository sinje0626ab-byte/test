import { UNITS, AVERSION, ALERT } from '../config.js';
import { world } from '../data/loader.js';
import { spreadAmount, addFollowers, share } from '../religion/spread.js';
import { bumpAlert } from '../game/watch.js';
import { unitAffinity } from '../religion/culture.js';

// 유닛 능력 표.
//   act(state, unit)    — 플레이어가 누르는 행동. { ok, converted, consumed } 를 돌려준다.
//   onTurn(state, unit) — 매 턴 자동으로 일어나는 효과. 바뀐 신도 수를 돌려준다.
//   attritionShield(state, unit) — 머무는 나라 이탈 감소율 (0~1)
// 활동은 그 나라 정부 경계를 바꾼다 (ALERT.unitAction).
// 효과는 그 나라 기질과의 궁합(unitAffinity)만큼 커지거나 줄어든다.
export const ABILITIES = {
  missionary: {
    act(state, unit) {
      const converted = addFollowers(state, unit.at, spreadAmount(state, unit.at, UNITS.missionary.power * unitAffinity(unit.at, 'missionary')));
      bumpAlert(state, unit.at, ALERT.unitAction.missionary);
      unit.usesLeft -= 1;
      return { ok: true, converted, consumed: unit.usesLeft <= 0 };
    },
  },

  relief: {
    act(state, unit) {
      const cs = state.countries[unit.at];
      const before = cs.aversion;
      const fit = unitAffinity(unit.at, 'relief');
      cs.aversion = Math.max(0, cs.aversion - UNITS.relief.aversionCut * fit);
      bumpAlert(state, unit.at, ALERT.unitAction.relief);
      const converted = addFollowers(state, unit.at, spreadAmount(state, unit.at, UNITS.relief.power * fit));
      return { ok: true, converted, aversionCut: before - cs.aversion, consumed: false };
    },
  },

  witness: {
    act(state, unit) {
      const converted = addFollowers(state, unit.at, spreadAmount(state, unit.at, UNITS.witness.power * unitAffinity(unit.at, 'witness')));
      const cs = state.countries[unit.at];
      cs.aversion = Math.min(AVERSION.max, cs.aversion + AVERSION.witnessGain);
      bumpAlert(state, unit.at, ALERT.unitAction.witness);
      return { ok: true, converted, consumed: true };
    },
  },

  // 머무는 나라와 육로 이웃에 매달 압력. 육로 이웃이 없으면 해로 이웃에 절반 효과.
  theologian: {
    onTurn(state, unit) {
      const cfg = UNITS.theologian;
      const c = world.countries[unit.at];
      const fit = unitAffinity(unit.at, 'theologian');
      let total = addFollowers(state, unit.at, spreadAmount(state, unit.at, cfg.hostPressure * fit));
      const [list, factor] = c.land.length ? [c.land, 1] : [c.sea, cfg.seaFactor];
      for (const n of list) {
        if (state.countries[n].banned) continue;
        total += addFollowers(state, n, spreadAmount(state, n, cfg.neighborPressure * factor * fit));
      }
      return total;
    },
  },

  guardian: {
    attritionShield(state, unit) {
      const cfg = UNITS.guardian;
      const cut = share(state, unit.at) >= cfg.minShare ? cfg.attritionCut : cfg.weakAttritionCut;
      return Math.min(0.85, cut * unitAffinity(unit.at, 'guardian'));
    },
  },
};
