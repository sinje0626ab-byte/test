// 화면 위: 날짜·시각·속도 / 돈·신도·평판·피로·믿음 축. 화면 아래: 상황에 맞는 큰 버튼 (말 걸기·들어가기·밤으로).
import { GOAL, TALK, LEADER, PHASE2, PHASE3 } from '../config.js';
import { fmtDate, fmtTime, phaseOf } from '../sim/clock.js';
import { memberCount } from '../sim/faith.js';
import { h, mount, won } from './dom.js';
import { play, toggleMute, isMuted } from './sound.js';

export function createHud(app) {
  const date = h('div', { class: 'date' });
  const time = h('div', { class: 'time' });
  const phase = h('div', { class: 'phase' });
  const speedBtns = [
    h('button', { class: 'btn', title: '멈춤 (` 키)', onclick: () => app.setSpeed(0) }, h('kbd', {}, '`'), ' 멈춤'),
    h('button', { class: 'btn', title: '재생 (1 키)', onclick: () => app.setSpeed(1) }, h('kbd', {}, '1'), ' 재생'),
    h('button', { class: 'btn', title: '빠르게 (2 키)', onclick: () => app.setSpeed(2) }, h('kbd', {}, '2'), ' 빠르게'),
  ];
  const sound = h('button', { class: 'btn', title: '소리', onclick: () => { sound.textContent = toggleMute() ? '🔇' : '🔊'; } }, isMuted() ? '🔇' : '🔊');
  const menu = h('button', { class: 'btn', title: '메뉴 (Esc)', onclick: () => { play('click'); app.openMenu(); } }, '☰');
  const book = h('button', { class: 'btn', title: '부탁 수첩 (N)', onclick: () => { play('click'); app.openNotebook(); } }, '수첩');
  const membersLabel = h('span', {}, `신도 /${GOAL.members}`);
  const rentLabel = h('span', {}, '월세 연속');
  const money = h('b', { class: 'num' });
  const members = h('b', { class: 'num' });
  const repBar = h('i');
  const fatBar = h('i');
  const axis = h('i');
  const rent = h('span', { class: 'num' });

  const el = h('div', { class: 'hud' },
    h('div', { class: 'clock' }, date, time, phase, h('div', { class: 'ctrl' }, ...speedBtns, sound, book, menu)),
    h('div', { class: 'stats' },
      h('div', { class: 'line' }, h('span', {}, '돈'), money),
      h('div', { class: 'line' }, membersLabel, members),
      h('div', { class: 'line' }, rentLabel, rent),
      h('div', { class: 'line' }, h('span', {}, '동네 평판'), h('div', { class: 'bar' }, repBar)),
      h('div', { class: 'line' }, h('span', {}, '피로'), h('div', { class: 'bar fat' }, fatBar)),
      h('div', { class: 'line', title: '왼쪽 사기 · 오른쪽 광신' }, h('span', {}, '사기↔광신'), h('div', { class: 'axis' }, axis)),
    ),
  );
  mount('hud', el);

  const actionBtn = h('button', { class: 'btn primary hidden' });
  const extraBtn = h('button', { class: 'btn hidden' });
  mount('actionbar', h('div', { class: 'actionbar' }, extraBtn, actionBtn));
  let actionFn = null; let extraFn = null;
  actionBtn.addEventListener('click', () => actionFn?.());
  extraBtn.addEventListener('click', () => extraFn?.());

  return {
    update() {
      const s = app.s;
      if (!s) return;
      date.textContent = fmtDate(s.day);
      time.textContent = s.mode === 'night' ? '밤' : fmtTime(s.minute);
      phase.textContent = s.mode === 'night' ? '성소 운영' : phaseOf(s.minute).name;
      speedBtns.forEach((b, i) => b.classList.toggle('on', app.speed === i));
      money.textContent = won(s.leader.money);
      members.textContent = memberCount(s);
      if (s.phase >= 2) {
        membersLabel.textContent = `신도 /${s.phase >= 3 ? PHASE3.members : PHASE2.members}`;
        rentLabel.textContent = '건물주 불만';
        rent.textContent = `${Math.round(s.landlordAnger)}/100${s.sanctuary.arrears ? ` 체납${s.sanctuary.arrears}` : ''}`;
      } else {
        membersLabel.textContent = `신도 /${GOAL.members}`;
        rentLabel.textContent = '월세 연속';
        rent.textContent = `${s.sanctuary.rentStreak}/${GOAL.rentStreak}${s.sanctuary.arrears ? ` (체납 ${s.sanctuary.arrears})` : ''}`;
      }
      repBar.style.width = `${s.rep}%`;
      repBar.style.background = s.rep < 30 ? 'var(--bad)' : s.rep < 50 ? 'var(--warn)' : 'var(--good)';
      fatBar.style.width = `${(s.leader.fatigue / TALK.dailyFatigueLimit) * 100}%`;
      axis.style.left = `${((s.leader.belief + LEADER.beliefRange) / (2 * LEADER.beliefRange)) * 100}%`;
    },
    setAction(label, fn) {
      actionFn = fn;
      actionBtn.classList.toggle('hidden', !label);
      if (label) actionBtn.textContent = label;
    },
    setExtra(label, fn) {
      extraFn = fn;
      extraBtn.classList.toggle('hidden', !label);
      if (label) extraBtn.textContent = label;
    },
  };
}
