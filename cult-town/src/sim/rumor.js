// 동네 평판 · 여론 주도 주민 · 기성 종교 개입 (세 계열 같은 규칙) · 종말 날짜
import { RUMOR, SECT_FX } from '../config.js';
import { RESIDENTS } from '../data/residents.js';
import { CLERGY } from '../data/clergy.js';
import { pick } from './rng.js';
import { clamp } from './leader.js';

const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

export function dailyRumor(s) {
  const events = [];
  const leaderSus = avg(RESIDENTS.filter((r) => r.leader).map((r) => s.res[r.id].sus));
  const allSus = avg(RESIDENTS.map((r) => s.res[r.id].sus));
  const target = RUMOR.base - leaderSus * RUMOR.leaderWeight - allSus * RUMOR.allWeight;
  s.rep = clamp(s.rep + (target - s.rep) * RUMOR.follow);

  for (const c of CLERGY) {
    const group = RESIDENTS.filter((r) => c.religions.includes(r.religion));
    const groupSus = avg(group.map((r) => s.res[r.id].sus));
    const threshold = RUMOR.clergyAvgSus * (s.leader.family === c.family ? RUMOR.clergySameFamily : 1);
    const st = s.clergy[c.id];
    if (groupSus >= threshold && s.day - st.last >= RUMOR.clergyCooldown) {
      st.last = s.day;
      for (const r of group) {
        const rs = s.res[r.id];
        rs.sus = clamp(rs.sus + RUMOR.clergyEffect.sus);
        rs.like = clamp(rs.like + RUMOR.clergyEffect.like);
      }
      s.rep = clamp(s.rep + RUMOR.clergyEffect.rep);
      const line = pick(s, c.warn);
      s.week.clergy.push({ id: c.id, line });
      events.push({ type: 'clergy', id: c.id, line });
    }
  }

  const date = SECT_FX[s.leader.sect]?.date;
  if (date && s.day === date.day && !s.flags.datePassed) {
    s.flags.datePassed = true;
    for (const r of RESIDENTS) {
      const rs = s.res[r.id];
      if (rs.stage === 'member') rs.like = clamp(rs.like - 10);
      else rs.sus = clamp(rs.sus + date.sus);
    }
    events.push({ type: 'doomsday' });
    s.week.shadow.push({ kind: 'doomsday' });
  }
  return events;
}
