// 작은 보상 · 업적 띠 · 레벨 업 화면 (28장 B). 판정은 sim/achievements.js, 여기선 보여 주기만.
//   reward: 짧은 소리 + 알림 한 줄 (경험치 +n) · achievement: 위에서 내려오는 띠 (칭호) · level: 열린 것 목록 창
import { h, mount, unmount, $ui } from './dom.js';
import { toast } from './toast.js';
import { sfx } from './sfx.js';
import { LEVEL_UNLOCKS, LEVEL_UP_TEXT } from '../data/growth.js';
import { SERMON_BONUS } from '../data/sermons.js';

const banners = [];
let showing = false;

export function showReward(r) {
  sfx.reward();
  toast(`${r.text} · 경험치 +${r.xp}`, 'reward', 2600);
}

export function showAchievement(a) {
  banners.push(a);
  if (!showing) nextBanner();
}
function nextBanner() {
  const a = banners.shift();
  if (!a) { showing = false; return; }
  showing = true;
  sfx.achieve();
  const el = h('div', { class: 'achv' }, h('div', { class: 'k' }, '업적 달성 · 칭호'), h('div', { class: 'n' }, `〈${a.name}〉`), h('div', { class: 'd' }, a.desc));
  $ui().append(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => { el.remove(); nextBanner(); }, 400); }, 3400);
}

// 레벨 업: 새로 열린 것 (from+1 ~ to) 을 한 창에
export function showLevelUp(app, from, to, onClose) {
  const s = app.s;
  const lines = [];
  for (let L = from + 1; L <= to; L++) {
    for (const t of LEVEL_UNLOCKS[L] ?? []) lines.push(`레벨 ${L} · ${t.replace('{카드}', SERMON_BONUS[s.leader.sect]?.name ?? '')}`);
    lines.push(`레벨 ${L} · ${LEVEL_UP_TEXT.point}`);
  }
  sfx.level();
  app.modalOpened();
  const close = () => { unmount('levelup'); app.modalClosed(); onClose?.(); };
  mount('levelup', h('div', { class: 'screen levelup' }, h('div', { class: 'panel box' },
    h('div', { class: 'lv' }, `LEVEL ${to}`),
    h('h2', {}, LEVEL_UP_TEXT.title),
    h('ul', { class: 'unlocks' }, lines.map((l) => h('li', { class: l.includes('능력 점수') ? 'pt' : '' }, l))),
    h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: close }, '좋다')))));
}
