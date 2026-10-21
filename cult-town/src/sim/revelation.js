// 성장 계시 적용 (신도 50명 간판 · 100명 울타리)
import { REVELATIONS, REVELATIONS3 } from '../config.js';
import { REVELATION_TEXT, RULE_FX } from '../data/revelations.js';
import { clamp, addMoney, shiftBelief } from './leader.js';
import { memberCount } from './faith.js';
import { RELATIONS } from '../data/residents.js';

// 지금 열릴 계시 (없으면 null)
export function dueRevelation(s) {
  const n = memberCount(s);
  for (const r of REVELATIONS) if (n >= r.at && !s.revelations[r.id]) return r.id;
  if (s.phase >= 3) {
    // 카메라: 신도 150명 또는 첫 보도 · 이웃: 라이벌이 나타났을 때
    if (!s.revelations.camera && (n >= REVELATIONS3[0].at || s.reporter.reports > 0)) return 'camera';
    if (!s.revelations.neighbor && s.rival && s.day >= s.rival.since) return 'neighbor';
  }
  if (s.phase >= 4 && s.branch?.open && !s.revelations.branch) return 'branch';
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
    } else if (id === 'camera') {
      if (p === 'open') s.rep = clamp(s.rep + 4);
      if (p === 'spin') { addMoney(s, -300_000); s.shadow.push({ kind: 'spin', due: s.day + 10 }); }
    } else if (id === 'branch') {
      if (p === 'visit') {
        for (const [rid, st] of Object.entries(s.res)) if (rid.startsWith('b_') && st.stage === 'member') st.like = clamp(st.like + 8);
        for (const [a, b, kind] of RELATIONS) if (kind === 'family' && a.startsWith('b_')) for (const x of [a, b]) if (s.res[x].stage !== 'member') s.res[x].sus = clamp(s.res[x].sus + 12);
        s.shadow.push({ kind: 'branch_visit', due: s.day + 7 });
      }
    } else if (id === 'neighbor') {
      if (p === 'respect') s.rep = clamp(s.rep + 3);
      if (p === 'rumor' && s.rival) {
        s.rival.followers = Math.round(s.rival.followers * 0.75);
        for (const st of Object.values(s.res)) st.sus = clamp(st.sus + 4);
        s.shadow.push({ kind: 'rumor', due: s.day + 6 });
      }
    }
    lines.push(REVELATION_TEXT[id].choices.find((c) => c.id === p).label);
  }
  return { outcome: `정한 것: ${lines.join(' · ')}`, tone: dark ? 'bad' : 'good' };
}

// 규칙이 주는 이탈 문턱 보너스 · 헌금 배율 · 주마다 돈
export const ruleLeave = (s) => s.rules.reduce((n, r) => n + (RULE_FX[r]?.leave ?? 0), 0);
export const ruleOffering = (s) => 1 + s.rules.reduce((n, r) => n + (RULE_FX[r]?.offering ?? 0), 0);
export function weeklyRules(s, relationsOf) {
  if (s.revelations.camera?.includes('open')) addMoney(s, -20_000);   // 장부 공개: 인쇄·게시
  for (const r of s.rules) {
    const fx = RULE_FX[r];
    if (fx.weeklyMoney) addMoney(s, fx.weeklyMoney);
    if (fx.familySus) for (const [id, st] of Object.entries(s.res)) if (st.stage === 'member') for (const x of relationsOf(id)) if (x.kind === 'family') s.res[x.id].sus = clamp(s.res[x.id].sus + fx.familySus);
  }
}
