// 주민 프로필 카드 (주민을 누르면): 지금 고민 · 종교 · 관계 · 우리 교단에 대한 인상 · 상태
import { RESIDENT_BY_ID } from '../data/residents.js';
import { PLACES } from '../data/places.js';
import { NEED_NAMES, IMPRESSION, STAGE_NAMES, RELIGION_NAMES, RELATION_NAMES } from '../data/topics.js';
import { relationsOf } from '../sim/faith.js';
import { topNeeds } from '../sim/residents.js';
import { CLERGY } from '../data/clergy.js';
import { h, mount, unmount } from './dom.js';
import { play } from './sound.js';

export function impressionOf(st) {
  for (const row of IMPRESSION) {
    if (row.sus != null && st.sus >= row.sus) return row.text;
    if (row.like != null && st.like >= row.like) return row.text;
  }
  return IMPRESSION.at(-1).text;
}

export function openProfile(app, id, { onTalk } = {}) {
  play('page');
  const close = () => { unmount('profile'); app.setBack('profile', null); };
  app.setBack('profile', close);
  if (id.startsWith('c:')) {
    const c = CLERGY.find((x) => `c:${x.id}` === id);
    mount('profile', h('div', { class: 'profile box' },
      h('div', { class: 'row' }, h('img', { class: 'face', src: app.portrait(id), alt: '' }), h('div', {}, h('h3', {}, `${c.name} ${c.title}`), h('div', { class: 'muted' }, PLACES[c.place].name))),
      h('p', {}, c.bio),
      h('p', { class: 'quote' }, '동네 사람들이 믿고 찾는 사람이다. 302호를 경계한다.'),
      h('div', { class: 'row end' }, onTalk ? h('button', { class: 'btn primary', onclick: () => { close(); onTalk(); } }, '인사하러 가기') : null, h('button', { class: 'btn', onclick: close }, '닫기'))));
    return;
  }
  const r = RESIDENT_BY_ID[id];
  const st = app.s.res[id];
  const top = topNeeds(st)[0];
  const rel = relationsOf(id).map((x) => h('li', {}, `${RESIDENT_BY_ID[x.id].name} (${RELATION_NAMES[x.kind]}) · ${STAGE_NAMES[app.s.res[x.id].stage]}`));
  mount('profile', h('div', { class: 'profile box' },
    h('div', { class: 'row' }, h('img', { class: 'face', src: app.portrait(id), alt: '' }),
      h('div', {}, h('h3', {}, r.name), h('div', { class: 'muted' }, `${r.age}살 · ${r.job}`), r.leader ? h('div', { class: 'pill', style: 'display:inline-block;margin-top:3px' }, '여론 주도') : null)),
    h('p', {}, r.bio),
    h('dl', { class: 'kv' },
      h('dt', {}, '상태'), h('dd', {}, STAGE_NAMES[st.stage]),
      h('dt', {}, '지금 고민'), h('dd', {}, st.known ? NEED_NAMES[top] : st.met ? '아직 잘 모른다 (말할 때 모습을 보자)' : '처음 보는 사람'),
      h('dt', {}, '종교'), h('dd', {}, RELIGION_NAMES[r.religion]),
      h('dt', {}, '집'), h('dd', {}, PLACES[r.home].name),
    ),
    h('div', { class: 'muted' }, '우리에 대한 인상'),
    h('p', { class: 'quote' }, impressionOf(st)),
    rel.length ? h('div', {}, h('div', { class: 'muted' }, '아는 사람'), h('ul', {}, rel)) : null,
    h('div', { class: 'row end' },
      onTalk ? h('button', { class: 'btn primary', onclick: () => { close(); onTalk(); } }, '가서 말 걸기') : null,
      h('button', { class: 'btn', onclick: close }, '닫기'))));
}
export const closeProfile = () => unmount('profile');
