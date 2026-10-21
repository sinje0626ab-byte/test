// 3단계 대화창: 기자 인터뷰 · 시위하는 가족 · 탈퇴자 · 라이벌 교주/전도자. 밤 메뉴 '라이벌' 하위 화면.
import { RESIDENT_BY_ID } from '../data/residents.js';
import { REPORTER_INFO, INTERVIEW, PROTEST_TEXT, DEFECTOR_TEXT } from '../data/threats.js';
import { RIVAL_TEXT, RIVAL_PREACHERS } from '../data/rival.js';
import { RIVAL } from '../config.js';
import { interviewOptions, interview, protestToday, protestOptions, answerProtest, defectorOptions, answerDefector } from '../sim/threats.js';
import { rivalInfo, rivalOptions, rivalAct, mergeChance, truceChance, rivalSize, textVars, rivalOn } from '../sim/rival.js';
import { activeOfficers } from '../sim/officers.js';
import { memberCount } from '../sim/faith.js';
import { saveGame } from '../sim/save.js';
import { pick } from '../sim/rng.js';
import { josaFix } from '../sim/leader.js';
import { h, mount, unmount } from './dom.js';
import { play } from './sound.js';
import { toast } from './toast.js';

const fillV = (t, o) => josaFix(Object.entries(o).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), t));

function shell(face, name, sub, ...content) {
  return h('div', { class: 'dialog box' },
    h('div', { class: 'who' }, h('img', { src: face, alt: '' }), h('div', {}, h('div', { class: 'name' }, name), h('div', { class: 'job' }, sub))),
    ...content);
}

// 선택지 → 결과 한 화면. options: [{ id, label, hint, dark }] · run(id) → { text, tone }
function choiceDialog(app, { face, name, sub, say, narr, options, run, onDone }) {
  const close = () => { unmount('dialog'); app.setBack('dialog', null); app.modalClosed(); onDone?.(); };
  app.modalOpened();
  app.setBack('dialog', close);
  play('talk');
  const result = (r) => {
    app.setBack('dialog', close);
    mount('dialog', shell(face, name, sub,
      h('div', { class: `narr ${r.tone === 'bad' ? 'bad' : ''}` }, r.text),
      h('div', { class: 'row end', style: 'margin-top:8px' }, h('button', { class: 'btn primary', onclick: close }, '확인'))));
    saveGame(app.s);
    app.refresh();
  };
  mount('dialog', shell(face, name, sub,
    say ? h('div', { class: 'say' }, say) : null,
    narr ? h('div', { class: 'narr' }, narr) : null,
    h('div', { class: 'opts' }, options.map((o) => h('div', { class: o.dark ? 'dark' : '' },
      h('button', { class: 'btn', style: 'width:100%', onclick: () => { play('select'); result(run(o.id)); } }, o.label, h('small', {}, o.hint)))))));
}

export function openInterview(app) {
  const s = app.s;
  const best = activeOfficers(s).sort((a, b) => b.talk - a.talk)[0];
  const opts = interviewOptions(s).map((id) => {
    const [label, hint] = INTERVIEW.options[id];
    return { id, label: id === 'officer' && best ? `${label} (${best.name})` : label, hint };
  });
  choiceDialog(app, {
    face: app.portrait('x:reporter'), name: `${REPORTER_INFO.name} ${REPORTER_INFO.title}`, sub: REPORTER_INFO.outlet,
    say: pick(s, INTERVIEW.questions), narr: INTERVIEW.open,
    options: opts,
    run: (id) => interview(s, id, best?.id),
  });
}

export function openProtest(app, id) {
  const s = app.s;
  const P = protestToday(s);
  const v = { 이름: RESIDENT_BY_ID[id].name, 신도이름: RESIDENT_BY_ID[P.member].name };
  choiceDialog(app, {
    face: app.portrait(id), name: RESIDENT_BY_ID[id].name, sub: PROTEST_TEXT.title,
    say: PROTEST_TEXT.signs[P.sign ?? 0], narr: fillV(PROTEST_TEXT.open, v),
    options: protestOptions(s).map((o) => ({ id: o, label: fillV(PROTEST_TEXT.options[o][0], v), hint: fillV(PROTEST_TEXT.options[o][1], v) })),
    run: (o) => answerProtest(s, o),
  });
}

export function openDefector(app, id) {
  const s = app.s;
  const v = { 이름: RESIDENT_BY_ID[id].name };
  choiceDialog(app, {
    face: app.portrait(id), name: RESIDENT_BY_ID[id].name, sub: DEFECTOR_TEXT.title,
    say: pick(s, DEFECTOR_TEXT.gossip), narr: fillV(DEFECTOR_TEXT.open, v),
    options: defectorOptions(s).map((o) => ({ id: o, label: DEFECTOR_TEXT.options[o][0], hint: DEFECTOR_TEXT.options[o][1], dark: o === 'hush' })),
    run: (o) => answerDefector(s, id, o),
  });
}

// 라이벌 교주·전도자: 인사만 (블랙코미디)
export function rivalHello(app, id) {
  const s = app.s;
  const R = rivalInfo(s);
  const lines = id === 'v:leader' ? RIVAL_TEXT.greet : RIVAL_TEXT.preacher;
  const name = id === 'v:leader' ? `${R.leader} ${R.title}` : RIVAL_PREACHERS[id.slice(2)];
  s.flags.rivalHello = (s.flags.rivalHello ?? 0) + 1;
  toast(`${name} (${R.name}): ${lines[s.flags.rivalHello % lines.length]}`, '', 6000);
}

// 밤 메뉴 '라이벌' 하위 화면
export function rivalNight(s, onPick) {
  const v = textVars(s);
  const R = s.rival;
  const status = fillV(RIVAL_TEXT.status[R.status], v);
  const sizeWord = (n) => (n >= 120 ? '아주 크다' : n >= 60 ? '크다' : n >= 25 ? '제법 된다' : '작다');
  const info = h('p', { class: 'muted' }, `${status} 저쪽 규모: ${sizeWord(rivalSize(s))} (우리 ${memberCount(s)}명). 우리 쪽에서 넘어간 사람: ${R.taken}명.`);
  if (!rivalOn(s)) return h('div', { class: 'stack' }, info);
  const opts = rivalOptions(s);
  if (!opts.length) return h('div', { class: 'stack' }, info, h('p', { class: 'muted' }, s.flags.rivalNight === s.day ? '오늘 밤은 이미 정했다.' : '지금은 할 수 있는 게 없다.'));
  const hintOf = (o) => fillV(RIVAL_TEXT.options[o][1], { ...v, n: R.dirt, 필요: RIVAL.expose.dirt, p: Math.round((o === 'merge' ? mergeChance(s) : truceChance(s)) * 100) });
  return h('div', { class: 'stack' }, info,
    ...opts.map((o) => h('button', { class: 'btn', disabled: o === 'expose' && R.dirt < RIVAL.expose.dirt, onclick: () => { play('click'); onPick(rivalAct(s, o)); } },
      RIVAL_TEXT.options[o][0], h('small', {}, hintOf(o)))));
}

export const nameForNpc = (s, id) => {
  if (id === 'x:reporter') return `${REPORTER_INFO.name} 기자`;
  const R = rivalInfo(s);
  if (id === 'v:leader') return R ? `${R.leader} ${R.title}` : '라이벌 교주';
  return RIVAL_PREACHERS[id.slice(2)] ?? id;
};
