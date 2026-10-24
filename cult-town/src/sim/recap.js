// 단계 결산 기록 (28장 B-6): 단계가 오르는 밤에 그 단계 숫자를 남긴다. 화면(ui/screens.js showPhaseUp)이 주보 특별호로 보여 준다.
import { RESIDENT_BY_ID } from '../data/residents.js';
import { memberCount } from './faith.js';

export function recordPhase(s, phase) {
  s.phaseLog ??= {};
  const prev = Object.values(s.phaseLog).reduce((n, p) => n + (p.offering ?? 0), 0);
  const total = s.counters?.offering ?? 0;
  const longest = Object.entries(s.res).filter(([id]) => RESIDENT_BY_ID[id]).sort((a, b) => (b[1].story?.done ?? 0) - (a[1].story?.done ?? 0))[0];
  const firstId = s.flags.firstConvertId;
  s.phaseLog[phase] = {
    day: s.day,
    members: memberCount(s),
    offering: total - prev,
    first: firstId ? RESIDENT_BY_ID[firstId]?.name ?? null : null,
    story: longest && (longest[1].story?.done ?? 0) > 0 ? { name: RESIDENT_BY_ID[longest[0]].name, n: longest[1].story.done } : null,
    moments: (s.moments ?? []).filter((m) => m.phase === phase).slice(-3).map((m) => m.text),
  };
}
