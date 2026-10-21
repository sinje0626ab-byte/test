// 예배 미니게임 (24장 D-1): 참석자 얼굴 · 설교 카드 3장을 순서대로 · 분위기 게이지 → 점수로 holdWorship
// 카드 이름과 결과만 보인다. 교주의 실제 설교 문장은 쓰지 않는다.
import { SERMON } from '../config.js';
import { SERMON_TEXT, FACES } from '../data/sermons.js';
import { NEED_NAMES } from '../data/topics.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { dealHand, sermonAudience, startFaces, playCard } from '../sim/sermon.js';
import { h, mount, unmount } from './dom.js';
import { fill } from './text.js';
import { play } from './sound.js';

export function openSermon(app, onDone) {
  const s = app.s;
  const ids = sermonAudience(s);
  const faces = startFaces(s, ids);
  const hand = dealHand(s);
  const played = [];
  let gauge = 20;
  let react = {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];   // 화면 말풍선만 (게임 난수 아님)

  const finish = () => {
    const score = Math.max(0, Math.min(1, gauge / 100));
    unmount('sermon');
    app.setBack('sermon', null);
    onDone(score, score >= SERMON.bigHit ? SERMON_TEXT.big : score >= 0.5 ? SERMON_TEXT.ok : SERMON_TEXT.flat);
  };
  const render = () => {
    const done = played.length >= SERMON.cards;
    mount('sermon', h('div', { class: 'screen sermon' }, h('div', { class: 'panel box' },
      h('h2', {}, fill(SERMON_TEXT.title, s)),
      h('p', { class: 'muted small' }, SERMON_TEXT.pick),
      h('div', { class: 'gauge' }, h('span', {}, SERMON_TEXT.gauge), h('div', { class: 'bar' }, h('i', { style: `width:${Math.min(100, gauge)}%` }))),
      h('div', { class: 'faces' }, ids.length ? ids.map((id) => h('div', { class: `face ${faces[id]}` },
        h('img', { src: app.portrait(id), alt: '' }),
        h('b', {}, FACES[faces[id]].icon),
        h('small', {}, RESIDENT_BY_ID[id].name.slice(1)),
        react[id] ? h('span', { class: 'react' }, react[id]) : null)) : h('p', { class: 'muted' }, '이름 아는 사람은 없다. 첫 신도와 따라온 사람들만 앉았다.')),
      played.length ? h('p', { class: 'played' }, played.map((c, i) => `${i + 1}. ${c.name}`).join('  ')) : null,
      done
        ? h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: () => { play('confirm'); finish(); } }, SERMON_TEXT.done))
        : h('div', { class: 'cards' }, hand.filter((c) => !played.includes(c)).map((c) => h('button', { class: 'card', onclick: () => {
          play('select');
          const before = { ...faces };
          const r = playCard(s, ids, faces, c, played[played.length - 1]);
          gauge += r.gain;
          react = {};
          for (const id of ids) if (faces[id] !== before[id] || Math.random() < 0.25) react[id] = pick(SERMON_TEXT.react[faces[id]]);
          played.push(c);
          render();
        } }, h('b', {}, c.name), h('small', {}, NEED_NAMES[c.need]))),
      ))));
  };
  app.setBack('sermon', () => { unmount('sermon'); app.setBack('sermon', null); });
  render();
}
