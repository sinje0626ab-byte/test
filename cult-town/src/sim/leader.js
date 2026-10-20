// 교주: 피로·돈·믿음 축 (-100 사기 ↔ +100 광신)
import { LEADER, TALK } from '../config.js';

export const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export function tone(s) {
  const b = s.leader.belief;
  if (b >= LEADER.toneThresholds.zealot) return 'zealot';
  if (b <= LEADER.toneThresholds.fraud) return 'fraud';
  return 'neutral';
}

export function shiftBelief(s, d) {
  s.leader.belief = clamp(s.leader.belief + d, -LEADER.beliefRange, LEADER.beliefRange);
}

export function addFatigue(s, d) {
  s.leader.fatigue = clamp(s.leader.fatigue + d, 0, TALK.dailyFatigueLimit);
}

export const exhausted = (s) => s.leader.fatigue >= TALK.dailyFatigueLimit - TALK.fatiguePerTalk + 1;

export function addMoney(s, d) {
  s.leader.money = Math.round(s.leader.money + d);
}
