// 예배 (25장 C): 성소 실내 맵에서 한다. 참석자가 의자에 실제로 앉고, 교주는 단상 앞. 화면 아래엔 카드 줄만.
// 카드엔 제목만 (고민 이름 없음). 카드마다 앉은 사람 머리 위 반응 말풍선 → 보고 다음 카드를 고른다.
// 돌발(벨소리·아이 울음·지각·김밥집 항의) → 즉석 선택. ⚡ 위험 카드: 터지거나 빗나가거나. 끝나면 헌금 바구니가 돈다.
// 교주의 실제 설교 문장은 쓰지 않는다 (카드 이름과 반응만).
import { SERMON } from '../config.js';
import { SERMON_TEXT, REACT, DISRUPT } from '../data/sermons.js';
import { OPENING as OPENING_TEXT } from '../data/opening.js';
import { dealHand, sermonAudience, startFaces, playCard, riskCardOf, riskChance, playRisk, disruptionOf, resolveDisruption } from '../sim/sermon.js';
import { topNeeds } from '../sim/residents.js';
import { activeCast } from '../sim/faith.js';
import { fmtDate } from '../sim/clock.js';
import { h, mount, unmount } from './dom.js';
import { fill } from './text.js';
import { play } from './sound.js';

const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];   // 화면 말풍선만 (게임 난수 아님)

export function openSermon(app, onDone) {
  const s = app.s;
  unmount('night');
  app.setBack('night', null);
  app.modalOpened();
  const begin = () => run(app, (score, verdict) => { app.modalClosed(); onDone(score, verdict); });
  // 3층 302호에서 한다
  if (app.scene()?.scene.key !== 'sanctuary' || app.floor !== 3) { app.floor = 3; app.goSanctuary('door'); setTimeout(begin, 500); }
  else begin();
  void s;
}

function run(app, finish) {
  const s = app.s;
  const scene = app.scene();
  const ids = sermonAudience(s);
  const cast = activeCast(s);
  const audience = scene.liveWorship(ids, cast, s.followers);
  const faces = startFaces(s, ids);
  const hand = [...dealHand(s)];
  const risk = riskCardOf(s);
  if (risk) hand.push({ ...risk, risk: true });
  const disrupt = disruptionOf(s);
  const played = [];
  let gauge = 20;
  let log = s.day === 0 ? [...OPENING_TEXT.worship.tutorial, SERMON_TEXT.tutorial] : !s.flags.tips?.liveWorship ? [SERMON_TEXT.tutorial] : [];
  s.flags.tips ??= {}; s.flags.tips.liveWorship = true;
  let pending = null;          // 돌발 선택 기다리는 중
  let ending = false;

  // 카드 한 장의 반응: 고민에 닿은 사람은 감동, 아니면 처음 얼굴대로 (졸음·폰·의심). 첫 신도·따라온 사람도 몇 명은 반응
  const react = (card, before, riskWin = null) => {
    scene.clearBubbles();
    const bubbles = [];
    for (const a of audience) {
      let kind;
      if (a.kind === 'res') {
        const hit = card.risk ? riskWin : topNeeds(s.res[a.id])[0] === card.need;
        kind = hit ? 'moved' : card.risk ? 'doubt' : before[a.id] === 'moved' ? (Math.random() < 0.5 ? 'moved' : 'sleepy') : faces[a.id];
      } else if (a.kind === 'cast') kind = card.risk && !riskWin ? 'doubt' : Math.random() < 0.7 ? 'moved' : 'sleepy';
      else kind = card.risk ? (riskWin ? 'moved' : 'doubt') : Math.random() < (gauge / 140) ? 'moved' : pickOne(['sleepy', 'phone', 'sleepy']);
      bubbles.push({ a, kind });
    }
    // 너무 많으면 몇 명만 (이름 있는 사람 먼저)
    const shown = bubbles.filter((b) => b.a.kind === 'res').concat(bubbles.filter((b) => b.a.kind !== 'res').sort(() => Math.random() - 0.5)).slice(0, 9);
    shown.forEach((b, i) => {
      const text = b.kind === 'moved' ? pickOne([...REACT.moved.all, ...(REACT.moved[s.leader.sect] ?? [])]) : pickOne(REACT[b.kind] ?? REACT.sleepy);
      // 옆 사람과 말풍선이 겹치지 않게: 같은 줄 이웃 넷까지는 높이를 층층이, 그 뒤로는 작은 감정 표시만
      const n = shown.filter((o, j) => j < i && Math.abs(o.a.sp.y - b.a.sp.y) < 4 && Math.abs(o.a.sp.x - b.a.sp.x) < 72).length;
      if (n < 4) scene.sayAt(b.a.sp, text, 120 * i, n * 12);
      else scene.emoteAt(b.a.sp, { moved: 'heart', sleepy: 'sleepy', doubt: 'question', phone: 'question' }[b.kind] ?? 'sleepy', 120 * i);
    });
  };

  const playOne = (c) => {
    play('select');
    const before = { ...faces };
    let line = `"${c.name}"`;
    let riskWin = null;
    if (c.risk) {
      const r = playRisk(s, ids, faces, Math.random());
      gauge += r.gain; riskWin = r.win;
      line += r.win ? ` · ${c.win}` : ` · ${c.lose}`;
      play(r.win ? 'jingle_good' : 'error', 0.4);
    } else gauge += playCard(s, ids, faces, c, played.filter((x) => !x.risk).at(-1)).gain;
    played.push(c);
    log = [line];
    react(c, before, riskWin);
    // 첫 카드 뒤에 돌발
    if (disrupt && played.length === 1) pending = disrupt;
    render();
  };

  const choose = (choice) => {
    play('click');
    gauge += resolveDisruption(s, pending, choice);
    log = [`${DISRUPT[pending].choices[choice]}`];
    if (choice === 'joke') for (const a of audience.slice(0, 4)) scene.sayAt(a.sp, pickOne(['(풉)', '"하하."', '(웃음)']), Math.random() * 300);
    pending = null;
    render();
  };

  const end = () => {
    if (ending) return;
    ending = true;
    const score = Math.max(0, Math.min(1, gauge / 100));
    const verdict = score >= SERMON.bigHit ? SERMON_TEXT.big : score >= 0.5 ? SERMON_TEXT.ok : SERMON_TEXT.flat;
    log = [SERMON_TEXT.basket];
    render(true);
    play('coins');
    scene.basketRun(() => {
      // 그날 예배 한 줄 평 → 주보
      const key = score >= SERMON.bigHit ? 'big' : score >= 0.5 ? 'ok' : 'flat';
      (s.week.sermonReviews ??= []).push(SERMON_TEXT.review[key].replace('{날}', fmtDate(s.day)));
      unmount('worshipbar');
      app.setBack('worship', null);
      scene.endLiveWorship();
      finish(score, verdict);
    });
  };

  function render(lock = false) {
    const done = played.length >= SERMON.cards;
    const left = hand.filter((c) => !played.includes(c));
    let controls;
    if (lock) controls = null;
    else if (pending) {
      const D = DISRUPT[pending];
      controls = h('div', { class: 'disrupt' }, h('div', { class: 'narr' }, D.text),
        h('div', { class: 'cards' }, Object.entries(D.choices).map(([k, label]) => h('button', { class: 'card', onclick: () => choose(k) }, h('b', {}, label)))));
    } else if (done) controls = h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: end }, SERMON_TEXT.done));
    else controls = h('div', { class: 'cards' }, left.map((c) => h('button', { class: `card ${c.risk ? 'risk' : ''}`, onclick: () => playOne(c) },
      h('b', {}, `${c.risk ? '⚡ ' : ''}${c.name}`),
      c.risk ? h('small', {}, `터질 확률 ${Math.round(riskChance(s) * 100)}% (카리스마)`) : null)));
    mount('worshipbar', h('div', { class: 'worshipbar box' },
      h('div', { class: 'row', style: 'align-items:center;gap:8px' },
        h('b', {}, fill(s.day === 0 ? OPENING_TEXT.worship.menu.replace(' 열기', '') : SERMON_TEXT.title, s)),
        h('div', { class: 'gauge' }, h('span', {}, SERMON_TEXT.gauge), h('div', { class: 'bar' }, h('i', { style: `width:${Math.max(0, Math.min(100, gauge))}%` }))),
        h('small', { class: 'muted' }, `${played.length}/${SERMON.cards}`)),
      log.length ? h('div', { class: 'log' }, log.map((l) => h('div', { class: 'narr' }, fill(l, s)))) : null,
      played.length ? h('p', { class: 'played' }, played.map((c, i) => `${i + 1}. ${c.name}`).join('  ')) : null,
      controls));
  }
  app.setBack('worship', () => {});     // 예배 중엔 뒤로가기 없음
  render();
}
