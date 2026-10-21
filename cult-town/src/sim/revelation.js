// 성장 계시 적용 (신도 50명 간판 · 100명 울타리)
import { REVELATIONS } from '../config.js';
import { REVELATION_TEXT, RULE_FX } from '../data/revelations.js';
import { clamp, addMoney, shiftBelief } from './leader.js';
import { memberCount } from './faith.js';

// 지금 열릴 계시 (없으면 null)
export function dueRevelation(s) {
  const n = memberCount(s);
  for (const r of REVELATIONS) if (n >= r.at && !s.revelations[r.id]) return r.id;
  return null;
}

export function applyRevelation(s, id, picks) {
  s.revelations[id] = picks;
  const dark = picks.reduce((n, p) => n + (REVELATION_TEXT[id].choices.find((c) => c.id === p)?.dark ?? 0), 0);
  if (dark) shiftBelief(s, -4 * dark);
  const lines = [];
  for (const p of picks) {
    if (id === 'sign') {
      if (p === 'banner') { s.followers += 4; s.rep = clamp(s.rep - 3); }
      if (p === 'quiet') s.flags.quietSign = true;
      if (p === 'volunteer') { addMoney(s, -200_000); s.rep = clamp(s.rep + 8); s.res.tong.sus = clamp(s.res.tong.sus - 10); s.shadow.push({ kind: 'sign_volunteer', due: s.day + 8 }); }
    } else if (id === 'fence') {
      s.rules.push(p);
      const fx = RULE_FX[p];
      if (fx.rep) s.rep = clamp(s.rep + fx.rep);
      if (fx.discAll) for (const o of s.officers) if (!o.left) o.discontent = clamp(o.discontent + fx.discAll);
      if (dark) s.shadow.push({ kind: `rule_${p}`, due: s.day + 6 });
    }
    lines.push(REVELATION_TEXT[id].choices.find((c) => c.id === p).label);
  }
  return { outcome: `정한 것: ${lines.join(' · ')}`, tone: dark ? 'bad' : 'good' };
}

// 규칙이 주는 이탈 문턱 보너스 · 헌금 배율 · 주마다 돈
export const ruleLeave = (s) => s.rules.reduce((n, r) => n + (RULE_FX[r]?.leave ?? 0), 0);
export const ruleOffering = (s) => 1 + s.rules.reduce((n, r) => n + (RULE_FX[r]?.offering ?? 0), 0);
export function weeklyRules(s, relationsOf) {
  for (const r of s.rules) {
    const fx = RULE_FX[r];
    if (fx.weeklyMoney) addMoney(s, fx.weeklyMoney);
    if (fx.familySus) for (const [id, st] of Object.entries(s.res)) if (st.stage === 'member') for (const x of relationsOf(id)) if (x.kind === 'family') s.res[x.id].sus = clamp(s.res[x.id].sus + fx.familySus);
  }
}
