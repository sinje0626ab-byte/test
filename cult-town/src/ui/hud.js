// 화면 위: 날짜·시각·속도 / 돈·신도·평판·피로·믿음 축. 화면 아래: 상황에 맞는 큰 버튼 (말 걸기·들어가기·밤으로).
import { fatigueLimit } from '../sim/growth.js';
import { GOAL, TALK, LEADER, PHASE2, PHASE3, PHASE4 } from '../config.js';
import { fmtDate, fmtClock, tempAt, skyName, holidayOf } from '../sim/clock.js';
import { branchCount, memberCount } from '../sim/faith.js';
import { h, mount, won } from './dom.js';
import { play, toggleMute, isMuted } from './sound.js';

const HOLIDAY_SHORT = { semester: '새 학기', cherry: '벚꽃', holiday: '연휴', buddha: '부처님오신날', monsoon: '장마', chuseok: '추석', yearend: '연말' };

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
      // 휴대폰 잠금화면처럼: 날짜 / 시각 / 날씨·기온 · 동네
      date.textContent = fmtDate(s.day);
      time.textContent = s.mode === 'night' ? '밤' : fmtClock(s.minute);
      const hol = holidayOf(s.day);
      const where = s.phase >= 4 ? ` · ${s.district === 'bongcheon' ? '봉천동' : '신림동'}` : '';
      phase.textContent = s.mode === 'night' ? `성소 운영 · ${skyName(s.weather)} ${tempAt(s, 21 * 60)}°` : `${skyName(s.weather)} ${tempAt(s)}°${where}${hol ? ` · ${HOLIDAY_SHORT[hol.id] ?? ''}` : ''}`;
      speedBtns.forEach((b, i) => b.classList.toggle('on', app.speed === i));
      money.textContent = won(s.leader.money);
      members.textContent = memberCount(s);
      if (s.phase >= 4) {
        membersLabel.textContent = `신도 /${PHASE4.members}`;
        rentLabel.textContent = '봉천 지부';
        rent.textContent = s.branch.open ? `${branchCount(s)}/${PHASE4.branch}` : '없음';
      } else if (s.phase >= 2) {
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
      fatBar.style.width = `${(s.leader.fatigue / fatigueLimit(s)) * 100}%`;
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
