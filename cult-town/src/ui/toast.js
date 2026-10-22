// 잠깐 떴다 사라지는 알림. 한 번에 하나씩 차례로 (25장 A-2).
// 사건 창·대화·장면이 떠 있으면(gate 가 false) 기다렸다가 띄운다. 같은 문장이 줄에 이미 있으면 다시 넣지 않는다.
import { h, $ui } from './dom.js';

const queue = [];
let box = null;
let showing = null;
let gate = () => true;
const GAP = 250;

// app 이 "지금 알림을 띄워도 되나"를 알려 준다 (모달이 없을 때만)
export function setToastGate(fn) { gate = fn; }

export function toast(text, kind = '', ms = 3600) {
  if (queue.some((q) => q.text === text) || showing?.text === text) return;
  queue.push({ text, kind, ms: Math.max(2200, Math.min(ms, 6000)) });
  pump();
}

// 이제 그만 띄울 알림을 비운다 (새 게임·처음 화면으로)
export function clearToasts() {
  queue.length = 0;
  showing?.el.remove();
  showing = null;
}

function pump() {
  if (showing || !queue.length) return;
  if (!gate()) { setTimeout(pump, 400); return; }
  if (!box || !box.isConnected) { box = h('div', { class: 'toasts' }); $ui().append(box); }
  const q = queue.shift();
  const el = h('div', { class: `toast ${q.kind}`, onclick: () => done() }, q.text);
  box.append(el);
  showing = { ...q, el };
  // 글자 수에 따라 조금 더 오래
  const ms = Math.max(q.ms, 1800 + q.text.length * 45);
  const timer = setTimeout(() => done(), ms);
  function done() {
    clearTimeout(timer);
    if (showing?.el !== el) return;
    el.classList.add('out');
    setTimeout(() => { el.remove(); showing = null; setTimeout(pump, GAP); }, 200);
  }
}
