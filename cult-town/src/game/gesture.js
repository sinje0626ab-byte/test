// 짧은 몸짓 (29장 B): 교주 표현과 주민 반응. 스프라이트 자리를 정한 '뒤에' 덧붙여 그린다 (TownScene.update 끝에서 applyGesture).
// 몸짓은 전부 지어낸 것이다. 실제 종교 의식을 흉내 내지 않는다.
import { idleFrame, walkFrame } from './people.js';

const hop = (t, h) => -Math.abs(Math.sin(t * Math.PI * 2)) * h;
const DEF = {
  smile: { ms: 700, fn: (t) => ({ dy: hop(t, 2) }) },
  wave: { ms: 900, fn: (t) => ({ frame: idleFrame(Math.floor(t * 8) % 2 ? 'left' : 'right') }) },
  bow: { ms: 900, fn: (t) => { const k = Math.sin(Math.min(1, t * 1.3) * Math.PI); return { frame: idleFrame('down'), sy: 1 - 0.14 * k, dy: 2 * k }; } },
  heart: { ms: 800, fn: (t) => ({ dy: hop(t * 0.5, 5), frame: idleFrame('down') }) },
  pray: { ms: 1300, fn: () => ({ frame: idleFrame('up'), sy: 0.97, dy: 0.5 }) },
  sigh: { ms: 1200, fn: (t) => { const k = Math.sin(t * Math.PI); return { sy: 1 - 0.08 * k, dy: 1.2 * k, frame: idleFrame('down') }; } },
  angry: { ms: 700, fn: (t) => ({ dx: Math.round(Math.sin(t * 60)), frame: idleFrame('down') }) },
  what: { ms: 900, fn: (t) => ({ angle: Math.sin(Math.min(1, t * 1.5) * Math.PI) * 10, frame: idleFrame('down') }) },
  bless: { ms: 1000, fn: (t) => ({ frame: idleFrame(t < 0.5 ? 'left' : 'right'), dy: hop(t * 0.5, 1) }) },
  clap: { ms: 900, fn: (t) => ({ dy: Math.floor(t * 6) % 2 ? -1 : 0, frame: idleFrame('down') }) },
  dismiss: { ms: 700, fn: (t) => ({ frame: idleFrame(Math.floor(t * 6) % 2 ? 'left' : 'down') }) },
  // 주민 반응
  flinch: { ms: 700, fn: (t) => ({ dx: -4 * Math.sin(Math.min(1, t * 1.6) * Math.PI), dy: hop(Math.min(0.5, t), 2) }) },
  shy: { ms: 800, fn: (t) => ({ frame: idleFrame(t < 0.6 ? 'left' : 'down') }) },
  stare: { ms: 900, fn: () => ({ frame: idleFrame('down') }) },
  worry: { ms: 900, fn: (t) => ({ angle: Math.sin(t * Math.PI) * 6 }) },
  glance: { ms: 600, fn: (t) => ({ frame: idleFrame(t < 0.5 ? 'down' : 'left') }) },
  shrug: { ms: 700, fn: (t) => ({ dy: hop(t * 0.5, 1.5) }) },
  back: { ms: 900, fn: (t) => ({ sy: 0.95, dy: 1, frame: walkFrame('down', Math.floor(t * 6)) }) },
  turn: { ms: 1600, fn: (t, sp) => ({ frame: idleFrame(sp.awayDir ?? 'up') }) },      // 모른 척: 고개를 돌리고 있는다
  greet: { ms: 1100, fn: (t) => { const k = t > 0.35 ? Math.sin(Math.min(1, (t - 0.35) * 2) * Math.PI) : 0; return { frame: idleFrame('down'), sy: 1 - 0.12 * k, dy: 2 * k }; } },
};
const REACT_TO_GESTURE = { wave: 'wave', bow: 'bow', smile: 'smile', heart: 'heart', pray: 'pray', clap: 'clap' };

export function startGesture(sp, kind, now) {
  const k = DEF[kind] ? kind : REACT_TO_GESTURE[kind];
  if (!sp || !DEF[k]) return;
  sp.gesture = { kind: k, t0: now, ms: DEF[k].ms };
}
export const gestureBusy = (sp) => !!sp?.gesture;

// 자리를 정한 뒤 부른다: 몸짓 오프셋·기울기·장을 덧씌우고, 끝나면 되돌린다
export function applyGesture(sp, now) {
  const g = sp?.gesture;
  if (!g) return;
  const t = (now - g.t0) / g.ms;
  if (t >= 1) { sp.gesture = null; sp.setAngle(0).setScale(1); return; }
  const o = DEF[g.kind].fn(t, sp);
  sp.setPosition(sp.x + (o.dx ?? 0), sp.y + (o.dy ?? 0));
  sp.setAngle(o.angle ?? 0).setScale(1, o.sy ?? 1);
  if (o.frame != null) { sp.anims?.stop?.(); sp.setFrame(o.frame); }
}
