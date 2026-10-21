// 아침 돌발 사건 (선택지 2~3개)
import { EVENT_TEXT } from '../data/events.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { eventOptions, resolveEvent, DARK_EVENT_OPTIONS } from '../sim/events.js';
import { saveGame } from '../sim/save.js';
import { h, mount, unmount } from './dom.js';
import { fill } from './text.js';
import { play } from './sound.js';
import { toast } from './toast.js';

export function showEvent(app) {
  const s = app.s;
  const ev = s.events.pending;
  if (!ev) return;
  const t = EVENT_TEXT[ev.kind];
  const extra = {
    이름: ev.id ? RESIDENT_BY_ID[ev.id].name : '', 가족: ev.relative ? RESIDENT_BY_ID[ev.relative].name : '',
    장소: ev.rival?.place ?? '', 행사: ev.rival?.event ?? '',
  };
  app.modalOpened();
  play('talk');
  mount('event', h('div', { class: 'screen' }, h('div', { class: 'panel box' },
    h('div', { class: 'steps' }, '오늘 아침'),
    h('h2', {}, fill(t.title, s, extra)),
    h('p', {}, fill(t.text, s, extra)),
    h('div', { class: 'stack' }, eventOptions(s, ev).map((o) => {
      const [label, hint] = t.options[o];
      const dark = DARK_EVENT_OPTIONS.includes(o);
      return h('div', { class: dark ? 'dark' : '' }, h('button', { class: 'btn', style: 'width:100%', onclick: () => {
        const res = resolveEvent(s, o); play('click'); saveGame(s); unmount('event'); app.modalClosed(); app.refresh();
        if (res) toast(res, '', 6000);
      } }, fill(label, s, extra), h('small', {}, fill(hint, s, extra))));
    })))));
}
