// 포교 대화창: 인사 → 단서(지문) → 선택지 3~4개 → (고민 카드) → 반응 대사 + 변화
// 원칙: 교주의 말은 선택지 이름으로만 보인다. 주민의 반응만 대사로 나온다.
import { RESIDENT_BY_ID } from '../data/residents.js';
import { OPTIONS, CARDS, STAGE_NAMES } from '../data/topics.js';
import { LINES } from '../data/lines.js';
import { canTalk, startTalk, act, talkClergy } from '../sim/talk.js';
import { fmtDate } from '../sim/clock.js';
import { CLERGY } from '../data/clergy.js';
import { h, mount, unmount, won } from './dom.js';
import { fill, josa } from './text.js';
import { play } from './sound.js';
import { toast } from './toast.js';

const REASON = {
  tired: '다리가 후들거린다. 오늘은 더 말 걸 힘이 없다. 성소로 돌아가 쉬자.',
  already: '오늘은 이미 얘기를 나눴다.',
  silent: '동네 사람들이 눈을 피한다. 아무도 말을 받아 주지 않는다.',
};

function shell(app, face, name, sub, ...content) {
  return h('div', { class: 'dialog box' },
    h('div', { class: 'who' }, h('img', { src: face, alt: '' }), h('div', {}, h('div', { class: 'name' }, name), h('div', { class: 'job' }, sub))),
    ...content);
}

export function openTalk(app, id) {
  const s = app.s;
  const r = RESIDENT_BY_ID[id];
  const face = app.portrait(id);
  const sub = `${r.age}살 · ${r.job}`;
  const close = () => { unmount('dialog'); app.modalClosed(); };
  app.modalOpened();

  const can = canTalk(s, id);
  if (!can.ok) {
    const line = can.reason === 'refuse' ? LINES[r.voice].refuse : null;
    mount('dialog', shell(app, face, r.name, sub,
      line ? h('div', { class: 'say' }, line) : null,
      h('div', { class: 'narr' }, can.reason === 'refuse' ? `${josa(r.name, '이/가')} 걸음을 빨리해 지나간다.` : REASON[can.reason]),
      h('div', { class: 'row end' }, h('button', { class: 'btn', onclick: close }, '닫기'))));
    play('error');
    return;
  }

  play('talk');
  const t = startTalk(s, id);
  const optionBtn = (o) => {
    const meta = OPTIONS[o.id];
    const label = o.id === 'special' ? o.special : meta.label;
    const hint = o.id === 'special' ? '교단 유형의 특기. 지금 고민과 맞으면 잘 통한다.' : meta.hint;
    return h('button', { class: 'btn', onclick: () => choose(o.id) }, label, h('small', {}, hint));
  };
  const choose = (opt) => {
    play('select');
    if (opt === 'listen') return showCards();
    finish(act(s, id, opt));
  };
  const showCards = () => {
    mount('dialog', shell(app, face, r.name, sub,
      h('div', { class: 'narr' }, '어떤 고민을 들어 줄까. 아까 본 모습을 떠올려 보자.'),
      h('div', { class: 'narr' }, t.hint),
      h('div', { class: 'cards' }, t.cards.map((c) => h('button', { class: 'card', onclick: () => { play('select'); finish(act(s, id, 'listen', c)); } },
        h('span', { class: 'ic' }, CARDS[c].icon), h('b', {}, CARDS[c].name), h('small', {}, CARDS[c].desc)))),
    ));
  };
  const finish = (res) => {
    const pills = [];
    if (res.dLike) pills.push(h('span', { class: `pill ${res.dLike > 0 ? 'up' : 'down'}` }, `호감 ${res.dLike > 0 ? '+' : ''}${res.dLike}`));
    if (res.dSus) pills.push(h('span', { class: `pill ${res.dSus > 0 ? 'down' : 'up'}` }, `의심 ${res.dSus > 0 ? '+' : ''}${res.dSus}`));
    if (res.money) pills.push(h('span', { class: 'pill up' }, `상담비 ${won(res.money)}`));
    let stageNote = null;
    if (res.stageTo !== res.stageFrom) {
      pills.push(h('span', { class: 'pill stage' }, STAGE_NAMES[res.stageTo]));
      if (res.stageTo === 'curious') stageNote = `${josa(r.name, '이/가')} 302호에 관심이 생겼다. 더 친해지면 초대할 수 있다.`;
      if (res.stageTo === 'visitor') stageNote = fill(`${josa(r.name, '이/가')} ${fmtDate(s.res[id].attendDay)} 저녁 {예배}에 오기로 했다.`, s);
      play('confirm');
    }
    mount('dialog', shell(app, face, r.name, sub,
      res.narr ? h('div', { class: 'narr' }, res.narr) : null,
      res.line ? h('div', { class: 'say' }, res.line) : null,
      h('div', { class: 'delta' }, pills),
      stageNote ? h('div', { class: 'narr' }, stageNote) : null,
      h('div', { class: 'row end', style: 'margin-top:8px' }, h('button', { class: 'btn primary', onclick: close }, '다음에 또 봐요'))));
    app.afterTalk(id, res);
  };

  mount('dialog', shell(app, face, r.name, sub,
    h('div', { class: 'say' }, t.greet),
    h('div', { class: 'narr' }, t.hint),
    h('div', { class: 'opts' }, t.options.map(optionBtn),
      h('button', { class: 'btn wide', onclick: close }, OPTIONS.leave.label))));
}

export function openClergyTalk(app, clergyId) {
  const c = CLERGY.find((x) => x.id === clergyId);
  const { name, line } = talkClergy(app.s, clergyId);
  app.modalOpened();
  play('talk');
  const close = () => { unmount('dialog'); app.modalClosed(); };
  mount('dialog', shell(app, app.portrait(`c:${clergyId}`), name, c.bio,
    h('div', { class: 'say' }, line),
    h('div', { class: 'narr' }, '포교 얘기를 꺼낼 분위기가 아니다. 인사만 하고 물러난다.'),
    h('div', { class: 'row end' }, h('button', { class: 'btn', onclick: close }, '인사하고 물러나기'))));
}

export function placeInfo(app, place) {
  toast(`${place.name}: ${place.desc}`);
}
