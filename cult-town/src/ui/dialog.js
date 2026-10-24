// 포교 대화창: 인사 → 단서(지문) → 선택지 3~4개 → (고민 카드) → 반응 대사 + 변화
// 원칙: 교주의 말은 선택지 이름으로만 보인다. 주민의 반응만 대사로 나온다.
import { RESIDENT_BY_ID } from '../data/residents.js';
import { ITEMS } from '../data/items.js';
import { PLACES } from '../data/places.js';
import { OPTIONS, CARDS, STAGE_NAMES } from '../data/topics.js';
import { lineFor } from '../sim/voice.js';
import { canTalk, startTalk, act, talkClergy } from '../sim/talk.js';
import { forkOptions } from '../sim/quests.js';
import { dramaLabel } from '../sim/drama.js';
import { BRANCH } from '../data/quests.js';
import { fmtDate } from '../sim/clock.js';
import { ALL_CLERGY } from '../data/clergy.js';
import { h, mount, unmount, won } from './dom.js';
import { fill, josa, speak } from './text.js';
import { play } from './sound.js';
import { toast } from './toast.js';
import { textVars } from '../sim/rival.js';
import { NOTICE_TEXT } from '../data/threats.js';
import { ALL_CLERGY as CLERGY_LIST } from '../data/clergy.js';

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
  const close = () => { unmount('dialog'); app.setBack('dialog', null); app.modalClosed(); };
  app.modalOpened();
  app.setBack('dialog', close);

  const can = canTalk(s, id);
  if (!can.ok) {
    const line = can.reason === 'refuse' ? lineFor(s, id, 'refuse') : null;
    mount('dialog', shell(app, face, r.name, sub,
      line ? h('div', { class: 'say' }, speak(s, line)) : null,
      h('div', { class: 'narr' }, can.reason === 'refuse' ? `${josa(r.name, '이/가')} 걸음을 빨리해 지나간다.` : REASON[can.reason]),
      h('div', { class: 'row end' }, h('button', { class: 'btn', onclick: close }, '닫기'))));
    play('error');
    return;
  }

  play('talk');
  const ctx = { key: s.pos[id]?.key };
  const t = startTalk(s, id, ctx);
  let showFx = true;                          // 정확한 효과(빨간 글씨)는 기본으로 보인다. ⓘ 로 숨길 수 있다
  try { showFx = localStorage.getItem('cult-town:fx') !== '0'; } catch { /* 없으면 보인다 */ }
  const CONTEXT_IDS = ['heard', 'comfort', 'exploit', 'fork', 'story', 'favorDone', 'relay', 'gift', 'lunch', 'umbrella', 'market', 'walk', 'coffee', 'compliment', 'snack'];
  const optionBtn = (o) => {
    const meta = OPTIONS[o.id];
    let label = o.id === 'special' ? o.special : meta.label;
    if (o.id === 'relay') label = label.replace('{이름}', RESIDENT_BY_ID[o.from].name);
    if (o.id === 'askRival') label = label.replace('{라이벌}', textVars(s).라이벌);
    if (o.id === 'invite' && id.startsWith('b_')) label = '봉천 지부에 초대하기';
    if (o.id === 'comfort' || o.id === 'exploit') label = dramaLabel(s, id, o.id);
    // 짧은 행동 설명만 보이고, 정확한 효과는 ⓘ를 켜거나 길게 누르면 보인다
    const b = h('button', { class: `btn ${CONTEXT_IDS.includes(o.id) ? 'ctx' : ''} ${o.id === 'exploit' ? 'darkopt' : ''}`, onclick: () => { if (b.dataset.held) { delete b.dataset.held; return; } choose(o); } },
      label, h('small', {}, meta.hint), h('small', { class: 'fx' }, meta.fx));
    let timer = null;
    b.addEventListener('pointerdown', () => { timer = setTimeout(() => { b.dataset.held = '1'; b.classList.toggle('showfx'); }, 450); });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => clearTimeout(timer));
    b.addEventListener('contextmenu', (e) => e.preventDefault());
    return b;
  };
  const fxToggle = () => {
    const btn = h('button', { class: `btn info ${showFx ? 'on' : ''}`, title: '정확한 효과 보이기·숨기기 (숨겼을 땐 길게 누르면 하나씩)', onclick: () => {
      showFx = !showFx; try { localStorage.setItem('cult-town:fx', showFx ? '1' : '0'); } catch { /* 저장 못 해도 된다 */ }
      btn.classList.toggle('on', showFx); btn.closest('.dialog')?.classList.toggle('hidefx', !showFx);
    } }, 'ⓘ');
    return btn;
  };
  const choose = (o) => {
    play('select');
    if (o.id === 'listen') return showCards();
    if (o.id === 'gift') return showGifts();
    if (o.id === 'fork') return showFork();
    finish(act(s, id, o.id, o.from, ctx));
  };
  // 하위 화면의 '뒤로': 아무것도 고르지 않았으니 횟수·피로·호감이 그대로다
  const backBtn = () => h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'btn back', onclick: () => { play('click'); showMain(); } }, '‹ 뒤로'));
  const showGifts = () => {
    const have = Object.keys(s.inventory).filter((k) => s.inventory[k] > 0);
    app.setBack('dialog', showMain);
    mount('dialog', shell(app, face, r.name, sub,
      h('div', { class: 'narr' }, '무엇을 줄까. 사람마다 좋아하는 게 다르다.'),
      h('div', { class: 'cards' }, have.map((k) => h('button', { class: 'card', onclick: () => { play('select'); finish(act(s, id, 'gift', k, ctx)); } },
        h('b', {}, ITEMS[k].name), h('small', {}, `${s.inventory[k]}개`)))),
      backBtn(),
    ));
  };
  // 사연 갈림길: 세 갈래 (진짜 도움 선택지는 그 사람 고민에 따라 이름이 바뀐다)
  const showFork = () => {
    app.setBack('dialog', showMain);
    mount('dialog', shell(app, face, r.name, sub,
      h('div', { class: 'narr' }, BRANCH.intro.replace('{이름}이(가)', josa(r.name, '이/가'))),
      h('div', { class: 'opts' }, forkOptions(s, id).map((o) => h('button', { class: 'btn ctx', onclick: () => { play('select'); finish(act(s, id, 'fork', o.id, ctx)); } },
        o.label, h('small', {}, o.hint), h('small', { class: 'fx' }, o.fx)))),
      backBtn(),
    ));
  };
  const showCards = () => {
    app.setBack('dialog', showMain);
    mount('dialog', shell(app, face, r.name, sub,
      h('div', { class: 'narr' }, '어떤 고민을 들어 줄까. 아까 본 모습을 떠올려 보자.'),
      h('div', { class: 'narr' }, t.hint),
      h('div', { class: 'cards' }, t.cards.map((c) => h('button', { class: 'card', onclick: () => { play('select'); finish(act(s, id, 'listen', c, ctx)); } },
        h('span', { class: 'ic' }, CARDS[c].icon), h('b', {}, CARDS[c].name), h('small', {}, CARDS[c].desc)))),
      backBtn(),
    ));
  };
  const finish = (res) => {
    app.setBack('dialog', close);
    const pills = [];
    if (res.dLike) pills.push(h('span', { class: `pill ${res.dLike > 0 ? 'up' : 'down'}` }, `호감 ${res.dLike > 0 ? '+' : ''}${res.dLike}`));
    if (res.dSus) pills.push(h('span', { class: `pill ${res.dSus > 0 ? 'down' : 'up'}` }, `의심 ${res.dSus > 0 ? '+' : ''}${res.dSus}`));
    if (res.money) pills.push(h('span', { class: 'pill up' }, `상담비 ${won(res.money)}`));
    if (res.repeat) pills.push(h('span', { class: 'pill down' }, '같은 얘기'));
    let stageNote = null;
    if (res.story) stageNote = `부탁을 받았다: ${favorText(res.story.favor)} (수첩 N)`;
    if (s.res[id].fork === 'pending') stageNote = `${josa(r.name, '과/와')}의 사연이 끝났다. 다시 말을 걸면 앞으로 어떻게 지낼지 고른다.`;
    if (res.stageTo !== res.stageFrom) {
      pills.push(h('span', { class: 'pill stage' }, STAGE_NAMES[res.stageTo]));
      if (res.stageTo === 'curious') stageNote = `${josa(r.name, '이/가')} 302호에 관심이 생겼다. 더 친해지면 초대할 수 있다.`;
      if (res.stageTo === 'visitor') stageNote = fill(`${josa(r.name, '이/가')} ${fmtDate(s.res[id].attendDay)} 저녁 {예배}에 오기로 했다.`, s);
      play('confirm');
    }
    mount('dialog', shell(app, face, r.name, sub,
      res.narr ? h('div', { class: 'narr' }, res.narr) : null,
      res.line ? h('div', { class: 'say' }, speak(s, res.line)) : null,
      h('div', { class: 'delta' }, pills),
      stageNote ? h('div', { class: 'narr' }, stageNote) : null,
      res.nearNotice ? h('div', { class: 'narr muted' }, NOTICE_TEXT.nearTalk.replace('{장소}', nearPlace(app, ctx.key))) : null,
      h('div', { class: 'row end', style: 'margin-top:8px' }, h('button', { class: 'btn primary', onclick: close }, '다음에 또 봐요'))));
    app.afterTalk(id, res);
  };

  function showMain() {
    app.setBack('dialog', close);
    const box = shell(app, face, r.name, sub,
      h('div', { class: 'say' }, speak(s, t.greet)),
      h('div', { class: 'narr' }, t.hint),
      h('div', { class: 'opts' }, t.options.map(optionBtn),
        h('button', { class: 'btn wide', onclick: close }, OPTIONS.leave.label)));
    box.querySelector('.who').append(fxToggle());
    box.classList.toggle('hidefx', !showFx);
    mount('dialog', box);
  }
  showMain();
}

// 안내문이 붙은 가장 가까운 종교 장소 이름
function nearPlace(app, key) {
  const g = app.g; const s = app.s;
  let t; try { t = g.places[key.split(':')[0]].spots?.[key.split(':')[1]] ?? g.places[key.split(':')[0]].door; } catch { return '안내문'; }
  let best = '안내문'; let bd = 99;
  for (const c of CLERGY_LIST) {
    if (s.notices?.[c.id] == null) continue;
    const d = g.places[c.place].door; const dist = Math.abs(d[0] - t[0]) + Math.abs(d[1] - t[1]);
    if (dist < bd) { bd = dist; best = NOTICE_TEXT[c.id].where; }
  }
  return best;
}

function favorText(f) {
  if (f.type === 'item') return `${ITEMS[f.item].name} 갖다주기 (${PLACES[ITEMS[f.item].shop].short})`;
  if (f.type === 'deliver') return `${RESIDENT_BY_ID[f.to].name}에게 말 전하기`;
  return `${PLACES[f.place].name}에 다녀오기`;
}

export function openClergyTalk(app, clergyId) {
  const c = ALL_CLERGY.find((x) => x.id === clergyId);
  const { name, line } = talkClergy(app.s, clergyId);
  app.modalOpened();
  play('talk');
  const close = () => { unmount('dialog'); app.setBack('dialog', null); app.modalClosed(); };
  app.setBack('dialog', close);
  mount('dialog', shell(app, app.portrait(`c:${clergyId}`), name, c.bio,
    h('div', { class: 'say' }, line),
    h('div', { class: 'narr' }, '포교 얘기를 꺼낼 분위기가 아니다. 인사만 하고 물러난다.'),
    h('div', { class: 'row end' }, h('button', { class: 'btn', onclick: close }, '인사하고 물러나기'))));
}

export function placeInfo(app, place) {
  toast(`${place.name}: ${place.desc}`);
}
