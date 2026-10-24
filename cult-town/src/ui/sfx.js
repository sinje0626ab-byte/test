// 8비트 효과음 (28장 D): WebAudio 사각파로 그 자리에서 만든다 (파일 없음). 소리 끄기는 sound.js 와 같이 따른다.
import { isMuted } from './sound.js';

let ctx = null;
const ac = () => {
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
};

// notes: [[주파수, 길이(초)], ...] 를 차례로
function seq(notes, { type = 'square', vol = 0.05 } = {}) {
  if (isMuted()) return;
  const a = ac();
  if (!a) return;
  let t = a.currentTime + 0.005;
  for (const [f, d] of notes) {
    const o = a.createOscillator(); const g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + d + 0.02);
    t += d * 0.9;
  }
}

export const sfx = {
  move: () => seq([[1046, 0.035]], { vol: 0.03 }),                                   // 커서 한 칸
  pick: () => seq([[784, 0.05], [1175, 0.07]], { vol: 0.04 }),                        // 결정
  back: () => seq([[523, 0.05], [392, 0.07]], { vol: 0.035 }),                        // 뒤로
  deny: () => seq([[196, 0.12]], { type: 'sawtooth', vol: 0.03 }),                    // 막힌 줄
  coin: () => seq([[988, 0.07], [1319, 0.28]], { vol: 0.05 }),                        // 헌금 (CREDIT +1)
  reward: () => seq([[880, 0.06], [1319, 0.1]], { type: 'triangle', vol: 0.06 }),     // 작은 보상
  achieve: () => seq([[523, 0.08], [659, 0.08], [784, 0.08], [1046, 0.22]], { vol: 0.045 }),   // 업적
  level: () => seq([[392, 0.07], [523, 0.07], [659, 0.07], [784, 0.07], [1046, 0.3]], { type: 'triangle', vol: 0.07 }),
};
