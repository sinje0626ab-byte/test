// 개업 첫날 짧은 장면 창 (25장 B). 대화창과 같은 모양: 얼굴 · 이름 · 지문 · 대사 몇 줄 · 버튼(또는 선택지).
// 창이 떠 있는 동안 시간은 멈추고 알림은 기다린다 (data-id=opening).
import { h, mount, unmount } from './dom.js';
import { fill } from './text.js';
import { play } from './sound.js';

// opts: { title, face, name, scene, lines[], next, choices: [{ id, label, hint }], onChoice(id) → 대답 문장, onDone,
//         speaker: 지도에 세울 사람 (portrait 와 같은 id: 'o:mom' · 'tong' …, 27장) }
export function openingPanel(app, opts) {
  const s = app.s;
  app.modalOpened();
  if (opts.speaker) app.showSpeaker(opts.speaker);
  let i = 0;
  const lines = opts.lines ?? [];
  const close = () => { unmount('opening'); if (opts.speaker) app.hideSpeaker(); app.modalClosed(); opts.onDone?.(); };
  const render = (reply = null) => {
    const shown = lines.slice(0, i + 1);
    const more = i < lines.length - 1;
    const body = [
      opts.scene ? h('div', { class: 'narr' }, fill(opts.scene, s)) : null,
      ...shown.map((l) => h('div', { class: 'say' }, fill(l, s))),
      reply ? h('div', { class: 'say' }, fill(reply, s)) : null,
    ];
    let buttons;
    if (more) buttons = h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: () => { play('talk'); i++; render(); } }, '▶'));
    else if (opts.choices && !reply) {
      buttons = h('div', { class: 'opts' }, opts.choices.map((c) => h('button', { class: 'btn', onclick: () => { play('select'); render(opts.onChoice?.(c.id) ?? null); } },
        fill(c.label, s), c.hint ? h('small', {}, c.hint) : null)));
    } else buttons = h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: () => { play('click'); close(); } }, opts.next ?? '계속'));
    mount('opening', h('div', { class: 'dialog box opening' },
      h('div', { class: 'who' }, opts.face ? h('img', { src: opts.face, alt: '' }) : null,
        h('div', {}, h('div', { class: 'name' }, opts.name ?? ''), h('div', { class: 'job' }, opts.title ?? ''))),
      ...body, buttons));
  };
  render();
}
