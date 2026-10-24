// 화면 위: 날짜·시각·속도 · '지금 할 일' / 상태창. 화면 아래: 상황에 맞는 큰 버튼 (말 걸기·들어가기·밤으로).
// 상태창 (27장 A): 줄마다 [아이콘] 이름 · 숫자 · 한마디(색 + 글자). 줄을 누르거나 마우스를 올리면 설명 풍선 (data/hud.js).
// 값이 바뀌면 줄 옆에 +3 / −5 가 떴다 사라지고 줄이 반짝인다. 값이 처음 바뀔 때는 그 줄을 짚으며 한 줄 설명 (한 번씩).
// 모바일(좁은 화면)에선 한 줄 아이콘 요약으로 접혀 있다가 누르면 펼친다.
import { fatigueLimit } from '../sim/growth.js';
import { GOAL, LEADER, PHASE2, PHASE3, PHASE4, CALENDAR, OPENING } from '../config.js';
import { fmtDate, fmtClock, tempAt, skyName, holidayOf, dayOfMonth } from '../sim/clock.js';
import { branchCount, memberCount } from '../sim/faith.js';
import { exhausted } from '../sim/leader.js';
import { rentNow } from '../sim/space.js';
import { currentStep } from '../sim/quests.js';
import { goalOf, difficultyOf } from '../sim/goals.js';
import { titleOf } from '../sim/achievements.js';
import { isOpeningDay, openingDone } from '../sim/opening.js';
import { CAST_BY_ID as CAST_BY } from '../data/cast.js';
import { HUD_HELP, HUD_WORDS, HUD_MORNING, HUD_TOUR } from '../data/hud.js';
import { h, mount, unmount, won } from './dom.js';
import { fill } from './text.js';
import { play, toggleMute, isMuted } from './sound.js';

const HOLIDAY_SHORT = { semester: '새 학기', cherry: '벚꽃', holiday: '연휴', buddha: '부처님오신날', monsoon: '장마', chuseok: '추석', yearend: '연말' };

// 8×8 도트 아이콘 (SVG). '#' 칸만 칠한다
const PIX = {
  money: ['........', '########', '#......#', '#..##..#', '#..##..#', '#......#', '########', '........'],
  members: ['.##..##.', '.##..##.', '........', '###..###', '###..###', '###..###', '###..###', '........'],
  rent: ['...##...', '..####..', '.######.', '########', '.#....#.', '.#.##.#.', '.#.##.#.', '.######.'],
  landlord: ['.######.', '.#.##.#.', '.######.', '.#.##.#.', '.######.', '.#.##.#.', '.##..##.', '.######.'],
  branch: ['.#......', '.#####..', '.######.', '.#####..', '.#......', '.#......', '.#......', '###.....'],
  rep: ['.######.', '#......#', '#.#..#.#', '#......#', '.######.', '..#.....', '.#......', '........'],
  repB: ['.######.', '#......#', '#.#..#.#', '#......#', '.######.', '..#.....', '.#......', '........'],
  fatigue: ['........', '.#####..', '....#...', '...#....', '..#.....', '.#####..', '......##', '.....##.'],
  belief: ['....#...', '...##...', '...#....', '..###...', '..###...', '..###...', '..###...', '.#####..'],
};
const pix = (k) => {
  const rows = PIX[k] ?? PIX.money;
  const rects = rows.flatMap((r, y) => [...r].map((c, x) => (c === '#' ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : ''))).join('');
  const el = h('span', { class: 'ico' });
  el.innerHTML = `<svg viewBox="0 0 8 8" width="16" height="16" shape-rendering="crispEdges" fill="currentColor">${rects}</svg>`;
  return el;
};
const wordOf = (table, v) => table.find(([lim]) => v < lim) ?? table.at(-1);
const signed = (n, unit = '') => `${n > 0 ? '+' : '−'}${Math.abs(n).toLocaleString('ko-KR')}${unit}`;
const man = (n) => (Math.abs(n) >= 10_000 ? `${Math.round(n / 10_000)}만` : `${n.toLocaleString('ko-KR')}`);

// 지금 값 (줄 key → 숫자). 좋은 쪽: up(+가 좋음) · down(−가 좋음) · none(방향 없음)
function snapshot(s) {
  const out = { money: s.leader.money, members: memberCount(s), rep: Math.round(s.rep), fatigue: Math.round((s.leader.fatigue / fatigueLimit(s)) * 100), belief: Math.round(s.leader.belief) };
  if (s.phase >= 2) out.landlord = Math.round(s.landlordAnger ?? 0);
  else out.rent = s.sanctuary.rentStreak;
  if (s.phase >= 4) { out.branch = s.branch?.open ? branchCount(s) : 0; out.repB = Math.round(s.repB ?? 0); }
  return out;
}
const GOOD_DIR = { money: 1, members: 1, rep: 1, repB: 1, fatigue: -1, landlord: -1, rent: 1, branch: 1, belief: 0 };
const UNIT = { money: '원', members: '명', rep: '', repB: '', fatigue: '%', landlord: '', rent: '달', branch: '명', belief: '' };

// 다음 월세 날까지 며칠
function daysToRentDay(s) {
  const d = dayOfMonth(s.day);
  return d <= CALENDAR.rentDay ? CALENDAR.rentDay - d : CALENDAR.rentDay + 30 - d;
}

// '지금 할 일' 한 줄: 첫날엔 다음 짜인 일이 언제 어디서, 그 뒤엔 메인 퀘스트 단계
export function nowTask(s) {
  if (isOpeningDay(s)) {
    if (!openingDone(s, 'tong')) return '상가 앞에서 통장님께 인사';
    const hr = (m) => `${m < 12 * 60 ? '아침' : m < 17 * 60 ? '낮' : '저녁'} ${((Math.floor(m / 60) + 11) % 12) + 1}시`;
    if (!openingDone(s, 'minho')) return `${hr(OPENING.minhoAt)}쯤 · 302호에 손님이 온다 (성소에 있으면 직접 만난다)`;
    if (!openingDone(s, 'visitor')) return `${hr(OPENING.visitorAt)} · 302호 문 앞에 누가 온다. 그 전엔 동네 사람들과 인사`;
    if (s.sanctuary.worshipDay !== s.day) return '밤 · 성소 밤 메뉴에서 첫 모임 열기';
  }
  const st = currentStep(s);
  return st ? `${st.name} · ${fill(st.hint, s)}` : '이번 달 할 일은 다 했다. 수첩에서 사연을 보자';
}

export function createHud(app) {
  const who = h('div', { class: 'who' });
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
  const taskText = h('span', { class: 'txt' });
  const task = h('button', { class: 'nowtask', title: '누르면 수첩', onclick: () => { play('click'); app.openNotebook('main'); } }, h('b', {}, '지금 할 일'), taskText);

  // ── 상태창 줄 ──
  const rows = {};
  const makeRow = (k, { bar = false, axis = false } = {}) => {
    const lbl = h('span', { class: 'lbl' });
    const val = h('b', { class: 'num val' });
    const word = h('span', { class: 'word' });
    const sub = h('div', { class: 'sub' });
    const fillEl = h('i');
    const meter = bar ? h('div', { class: 'bar' }, fillEl) : axis ? h('div', { class: 'axis' }, h('em', { class: 'l' }, '사기꾼'), h('div', { class: 'track' }, fillEl), h('em', { class: 'r' }, '광신도')) : null;
    const el = h('div', { class: 'srow', 'data-k': k, tabindex: 0 },
      h('div', { class: 'top' }, pix(k), lbl, val, word), sub, meter);
    el.addEventListener('mouseenter', () => { if (!touch) showTip(k); });
    el.addEventListener('mouseleave', () => { if (!touch && !tour) hideTip(); });
    el.addEventListener('click', (e) => { e.stopPropagation(); if (tipKey === k && !tour) hideTip(); else showTip(k); });
    rows[k] = { el, lbl, val, word, sub, fill: fillEl, meter };
    return el;
  };
  let touch = false;
  window.addEventListener('touchstart', () => { touch = true; }, { once: true, passive: true });
  const order = ['money', 'members', 'rent', 'landlord', 'branch', 'rep', 'repB', 'fatigue', 'belief'];
  const body = h('div', { class: 'srows' }, order.map((k) => makeRow(k, { bar: ['rep', 'repB', 'fatigue', 'landlord'].includes(k), axis: k === 'belief' })));
  const mini = h('button', { class: 'mini', onclick: (e) => { e.stopPropagation(); stats.classList.toggle('open'); play('click'); } });
  const stats = h('div', { class: 'stats' }, mini, body);

  const el = h('div', { class: 'hud' },
    h('div', { class: 'left' }, h('div', { class: 'clock' }, who, date, time, phase, h('div', { class: 'ctrl' }, ...speedBtns, sound, book, menu)), task),
    stats,
  );
  mount('hud', el);

  // ── 설명 풍선 ──
  let tipKey = null; let tipTimer = null; let tour = null;
  const tip = mount('hudtip', h('div', { class: 'hudtip hidden' }));
  function showTip(k, { first = false, auto = 0, extra = null } = {}) {
    const H = HUD_HELP[k === 'repB' ? 'rep' : k];
    if (!H || !rows[k]) return;
    clearTimeout(tipTimer);
    tipKey = k;
    const who = first ? 'mom' : H.who;
    const face = app.portrait(`o:${who}`);
    tip.replaceChildren(...[
      h('div', { class: 'who' }, h('img', { src: face, alt: '' }), h('div', {}, h('b', {}, H.title), h('small', {}, CAST_BY[who]?.name ?? ''))),
      first ? h('p', { class: 'say' }, H.first) : null,
      h('p', { class: 'say' }, H.what),
      h('p', {}, h('b', { class: 'good' }, '▲ '), H.up),
      h('p', {}, h('b', { class: 'bad' }, '▼ '), H.down),
      h('p', { class: 'end' }, H.end),
      extra,
    ].filter(Boolean));
    tip.classList.remove('hidden');
    for (const r of Object.values(rows)) r.el.classList.toggle('lit', r === rows[k]);
    const box = rows[k].el.getBoundingClientRect();
    const w = Math.min(300, window.innerWidth - 24);
    tip.style.width = `${w}px`;
    tip.style.left = `${Math.max(12, Math.min(window.innerWidth - w - 12, box.right - w))}px`;
    tip.style.top = `${box.bottom + 6}px`;
    if (auto) tipTimer = setTimeout(hideTip, auto);
  }
  function hideTip() {
    clearTimeout(tipTimer);
    tipKey = null;
    tip.classList.add('hidden');
    for (const r of Object.values(rows)) r.el.classList.remove('lit');
  }
  document.addEventListener('click', () => { if (tipKey && !tour) hideTip(); });

  // 첫 변화 설명: 대화창 등이 떠 있으면 기다렸다가 하나씩
  const firstQueue = [];
  function pumpFirst() {
    if (tour || tipKey || !firstQueue.length) return;
    if (app.modal > 0) { setTimeout(pumpFirst, 600); return; }
    const k = firstQueue.shift();
    if (!rows[k] || rows[k].el.classList.contains('off')) { pumpFirst(); return; }
    stats.classList.add('open');
    showTip(k, { first: true, auto: 7000 });
    setTimeout(pumpFirst, 7300);
  }

  // 변화 표시: 줄 옆에 떠오르는 숫자 + 반짝
  function floatDelta(k, d) {
    const r = rows[k];
    if (!r || r.el.classList.contains('off')) return;
    const dir = GOOD_DIR[k];
    const kind = dir === 0 ? 'mid' : d * dir > 0 ? 'good' : 'bad';
    const txt = k === 'money' ? `${d > 0 ? '+' : '−'}${man(Math.abs(d))}원` : k === 'belief' ? (d > 0 ? '→광신' : '←사기') : signed(d, UNIT[k]);
    const f = h('span', { class: `float ${kind}` }, txt);
    r.el.append(f);
    setTimeout(() => f.remove(), 1400);
    r.el.classList.remove('flash-good', 'flash-bad', 'flash-mid');
    void r.el.offsetWidth;
    r.el.classList.add(`flash-${kind}`);
    mini.classList.remove('flash-good', 'flash-bad', 'flash-mid');
    void mini.offsetWidth;
    mini.classList.add(`flash-${kind}`);
  }

  let prev = null;
  let lastMini = '';
  const actionBtn = h('button', { class: 'btn primary hidden' });
  const extraBtn = h('button', { class: 'btn hidden' });
  mount('actionbar', h('div', { class: 'actionbar' }, extraBtn, actionBtn));
  let actionFn = null; let extraFn = null;
  actionBtn.addEventListener('click', () => actionFn?.());
  extraBtn.addEventListener('click', () => extraFn?.());

  const setWord = (r, text, kind = '') => { r.word.textContent = text; r.word.className = `word ${kind}`; };

  const api = {
    update() {
      const s = app.s;
      if (!s) return;
      // 휴대폰 잠금화면처럼: 날짜 / 시각 / 날씨·기온 · 동네
      const ttl = titleOf(s);
      who.textContent = `${ttl ? `〈${ttl}〉 ` : ''}${s.leader.name} · ${difficultyOf(s).name}`;
      date.textContent = fmtDate(s.day);
      time.textContent = s.mode === 'night' ? '밤' : fmtClock(s.minute);
      const hol = holidayOf(s.day);
      const where = s.phase >= 4 ? ` · ${s.district === 'bongcheon' ? '봉천동' : '신림동'}` : '';
      phase.textContent = s.mode === 'night' ? `성소 운영 · ${skyName(s.weather)} ${tempAt(s, 21 * 60)}°` : `${skyName(s.weather)} ${tempAt(s)}°${where}${hol ? ` · ${HOLIDAY_SHORT[hol.id] ?? ''}` : ''}`;
      speedBtns.forEach((b, i) => b.classList.toggle('on', app.speed === i));
      taskText.textContent = nowTask(s);

      const v = snapshot(s);
      const rent = rentNow(s);
      const goal = goalOf(s).members;
      // 돈
      let r = rows.money;
      r.lbl.textContent = '돈'; r.val.textContent = won(v.money);
      setWord(r, ...(v.money >= rent ? ['월세 됨', 'good'] : v.money >= rent / 2 ? ['빠듯', 'warn'] : ['모자람', 'bad']));
      // 신도
      r = rows.members;
      r.lbl.textContent = '신도'; r.val.textContent = `${v.members} / ${goal}명`;
      setWord(r, ...(v.members >= goal ? ['목표 넘음', 'good'] : v.members >= goal / 2 ? ['절반 넘음', 'good'] : ['모으는 중', 'warn']));
      // 월세 (1단계) · 건물주 불만 (2단계~)
      rows.rent.el.classList.toggle('off', s.phase >= 2);
      rows.landlord.el.classList.toggle('off', s.phase < 2);
      const left = daysToRentDay(s);
      const arrears = s.sanctuary.arrears ? ` · 체납 ${s.sanctuary.arrears}달` : '';
      if (s.phase < 2) {
        r = rows.rent;
        r.lbl.textContent = '월세'; r.val.textContent = `${CALENDAR.rentDay}일 · ${man(rent)} 원`;
        r.sub.textContent = `연속 납부 ${s.sanctuary.rentStreak}/${GOAL.rentStreak}달${arrears}`;
        setWord(r, ...(s.sanctuary.arrears ? ['체납', 'bad'] : left === 0 ? ['오늘', v.money >= rent ? 'good' : 'bad'] : [`${left}일 남음`, v.money >= rent ? 'good' : left <= 5 ? 'bad' : 'warn']));
      } else {
        r = rows.landlord;
        r.lbl.textContent = '건물주 불만'; r.val.textContent = `${v.landlord} / ${PHASE2.landlordAngerMax}`;
        r.sub.textContent = `월세 ${CALENDAR.rentDay}일 · ${man(rent)} 원 · 연속 ${s.sanctuary.rentStreak}달${arrears}`;
        setWord(r, ...wordOf(HUD_WORDS.landlord, v.landlord).slice(1));
        r.fill.style.width = `${Math.min(100, v.landlord)}%`;
      }
      // 봉천 지부 (4단계)
      rows.branch.el.classList.toggle('off', s.phase < 4);
      rows.repB.el.classList.toggle('off', s.phase < 4);
      if (s.phase >= 4) {
        r = rows.branch;
        r.lbl.textContent = '봉천 지부'; r.val.textContent = s.branch.open ? `${v.branch} / ${goalOf(s, 4).branch}명` : '없음';
        setWord(r, ...(s.branch.open ? (s.branch.split ? ['갈라질 듯', 'bad'] : ['운영 중', 'good']) : ['아직', 'warn']));
        r = rows.repB;
        r.lbl.textContent = '봉천 평판'; r.val.textContent = `${v.repB}`;
        setWord(r, ...wordOf(HUD_WORDS.rep, v.repB).slice(1));
        r.fill.style.width = `${v.repB}%`;
      }
      // 평판
      r = rows.rep;
      r.lbl.textContent = s.phase >= 4 ? '신림 평판' : '동네 평판'; r.val.textContent = `${v.rep}`;
      const [, repWord, repKind] = wordOf(HUD_WORDS.rep, v.rep);
      setWord(r, repWord, repKind);
      r.fill.style.width = `${v.rep}%`;
      // 피로
      r = rows.fatigue;
      r.lbl.textContent = '피로'; r.val.textContent = `${v.fatigue}%`;
      if (exhausted(s)) setWord(r, '대화 불가', 'bad'); else setWord(r, ...wordOf(HUD_WORDS.fatigue, v.fatigue).slice(1));
      r.fill.style.width = `${Math.min(100, v.fatigue)}%`;
      // 믿음 축
      r = rows.belief;
      r.lbl.textContent = '믿음'; r.val.textContent = '';
      setWord(r, wordOf(HUD_WORDS.belief, v.belief)[1], 'mid');
      r.fill.style.left = `${((v.belief + LEADER.beliefRange) / (2 * LEADER.beliefRange)) * 100}%`;
      for (const k of ['rep', 'repB', 'fatigue', 'landlord']) {
        const w = rows[k].word.className.split(' ')[1] ?? '';
        rows[k].fill.className = w;
      }
      // 접힌 한 줄 요약 (모바일)
      const miniItems = [['money', `${man(v.money)}`], ['members', `${v.members}/${goal}`], ['rep', `${v.rep}`], ['fatigue', `${v.fatigue}%`]]
        .map(([k, t]) => [k, t, rows[k].word.className.split(' ')[1] ?? '']);
      const miniKey = JSON.stringify(miniItems);
      if (miniKey !== lastMini) {   // 바뀔 때만 다시 그린다
        lastMini = miniKey;
        mini.replaceChildren(...miniItems.flatMap(([k, t, c]) => [pix(k), h('span', { class: `m ${c}` }, t)]), h('span', { class: 'more' }, '▾'));
      }

      // 바뀐 값: +/− 표시 · 처음 바뀐 줄은 엄마가 짚어 준다
      if (prev) {
        s.flags.hudSeen ??= {};
        for (const [k, now] of Object.entries(v)) {
          const d = now - (prev[k] ?? now);
          if (!d || (k === 'fatigue' && Math.abs(d) < 1)) continue;
          if (k === 'fatigue' && d > 0 && d < 3 && !app.modal) continue;     // 걷기로 조금씩 오르는 건 조용히
          floatDelta(k, d);
          if (!s.flags.hudSeen[k] && HUD_HELP[k === 'repB' ? 'rep' : k]?.first) { s.flags.hudSeen[k] = true; firstQueue.push(k); setTimeout(pumpFirst, 900); }
        }
      }
      prev = v;
    },
    // 메뉴 '도움말': 줄마다 차례로 설명
    tour() {
      const keys = order.filter((k) => !rows[k].el.classList.contains('off'));
      let i = 0;
      stats.classList.add('open');
      app.modalOpened();
      const step = () => {
        if (i >= keys.length) { tour = null; hideTip(); app.modalClosed(); return; }
        tour = keys[i];
        const last = i === keys.length - 1;
        showTip(keys[i], { extra: h('div', { class: 'row end' }, h('small', { class: 'muted' }, `${i + 1}/${keys.length}`),
          h('button', { class: 'btn small primary', onclick: (e) => { e.stopPropagation(); play('click'); i++; step(); } }, last ? HUD_TOUR.done : HUD_TOUR.next)) });
      };
      step();
    },
    // 아침 화면 한 줄: 어제 아침 값과 비교
    morningLine(before) {
      const s = app.s;
      if (!s || !before) return null;
      const now = snapshot(s);
      const NAMES = { money: '돈', members: '신도', rep: '평판', repB: '봉천 평판', landlord: '건물주 불만', rent: '연속 납부', branch: '지부', belief: '믿음' };
      const parts = Object.keys(NAMES).filter((k) => now[k] != null && before[k] != null && now[k] !== before[k]).map((k) => {
        const d = now[k] - before[k];
        if (k === 'money') return `돈 ${d > 0 ? '+' : '−'}${man(Math.abs(d))}원`;
        if (k === 'belief') return `믿음 ${d > 0 ? '광신 쪽' : '사기 쪽'}으로`;
        return `${NAMES[k]} ${signed(d, UNIT[k])}`;
      });
      return parts.length ? `${HUD_MORNING}: ${parts.join(' · ')}` : null;
    },
    snapshot: () => (app.s ? snapshot(app.s) : null),
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
    destroy() { unmount('hudtip'); unmount('hud'); },
  };
  return api;
}
