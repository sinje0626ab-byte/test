// 교주: 피로·돈·믿음 축 (-100 사기 ↔ +100 광신)
import { fatigueLimit } from './growth.js';
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
  s.leader.fatigue = clamp(s.leader.fatigue + d, 0, fatigueLimit(s));
}

export const exhausted = (s) => s.leader.fatigue >= fatigueLimit(s) - TALK.fatiguePerTalk + 1;

export function addMoney(s, d) {
  s.leader.money = Math.round(s.leader.money + d);
}

// "{이름}이(가)" 같은 조사 표기를 앞 글자 받침에 맞게 고른다 (이/가 · 을/를 · 은/는 · 과/와)
export function josaFix(str) {
  // 이(가) · 가(이) 처럼 어느 쪽이 앞이든: 받침이 있으면 앞말(이·을·은·과), 없으면 뒷말
  const PAIR = { 이: ['이', '가'], 가: ['이', '가'], 을: ['을', '를'], 를: ['을', '를'], 은: ['은', '는'], 는: ['은', '는'], 과: ['과', '와'], 와: ['과', '와'] };
  return str.replace(/([가-힣])(이\(가\)|가\(이\)|을\(를\)|를\(을\)|은\(는\)|는\(은\)|과\(와\)|와\(과\))/g, (m, ch, j) => {
    const has = (ch.charCodeAt(0) - 0xac00) % 28 !== 0;
    const [a, b] = PAIR[j[0]];
    return ch + (has ? a : b);
  });
}
