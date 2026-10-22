// 수첩 (24장 C-4): 메인 / 사연 / 오늘 / 엿들은 소문 탭 · 퀘스트 장면 (끝낸 단계를 짧게 보여 준다)
import { ITEMS } from '../data/items.js';
import { PLACES } from '../data/places.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { DAILY, FLYER_SPOTS } from '../data/quests.js';
import { questList } from '../sim/stories.js';
import { mainOf } from '../sim/quests.js';
import { fmtDateShort } from '../sim/clock.js';
import { upcomingBigDays } from '../sim/bigdays.js';
import { BIGDAY_UI } from '../data/bigdays.js';
import { h, mount, unmount, won } from './dom.js';
import { play } from './sound.js';
import { fill, speak } from './text.js';

const TABS = [['main', '메인'], ['story', '사연'], ['today', '오늘'], ['heard', '엿들은 소문'], ['cal', BIGDAY_UI.calendar]];
let lastTab = 'main';

export const dailyName = (t) => DAILY[t.id].name.replace('{장소}', PLACES[t.arg]?.short ?? PLACES[t.arg]?.name ?? '');

export function openNotebook(app, tab = lastTab) {
  const s = app.s;
  app.modalOpened();
  const close = () => { unmount('notebook'); app.setBack('notebook', null); app.modalClosed(); };
  app.setBack('notebook', close);
  const render = () => {
    lastTab = tab;
    mount('notebook', h('div', { class: 'screen' }, h('div', { class: 'panel box notebook' },
      h('h2', {}, '수첩'),
      h('div', { class: 'tabs' }, TABS.map(([k, name]) => h('button', { class: `btn small ${tab === k ? 'on' : ''}`, onclick: () => { play('click'); tab = k; render(); } }, name))),
      h('div', { class: 'tabbody' }, BODY[tab](s)),
      h('p', { class: 'muted small' }, '지도의 느낌표: 노랑 메인 · 초록 부탁 · 파랑 오늘 · 분홍 사연의 끝'),
      h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: close }, '닫기')))));
  };
  render();
}

const BODY = {
  main(s) {
    const m = mainOf(s);
    if (!m) return h('p', { class: 'muted' }, '이번 달 할 일은 다 했다.');
    return h('div', {},
      h('h3', {}, `${s.phase}단계 · ${m.title}`),
      h('ul', { class: 'quests' }, m.steps.map((st, i) => h('li', { class: i < s.quest.step ? 'done' : i === s.quest.step ? 'ready' : 'later' },
        h('b', {}, `${i < s.quest.step ? '✓ ' : i === s.quest.step ? '▶ ' : ''}${st.name}`),
        i === s.quest.step ? h('small', {}, fill(st.hint, s) + (st.id === 'flyers' ? ` (붙인 곳 ${s.quest.flyers.map((p) => PLACES[p].short ?? PLACES[p].name).join(', ') || '없음'})` : '')) : null))));
  },
  story(s) {
    const qs = questList(s);
    const forks = Object.keys(s.res).filter((id) => s.res[id].fork === 'pending');
    const inv = Object.entries(s.inventory).filter(([, n]) => n > 0);
    const where = (q) => (q.type === 'item' ? `${ITEMS[q.item].name} (${PLACES[ITEMS[q.item].shop].short})` : q.type === 'deliver' ? `${RESIDENT_BY_ID[q.to].name}에게` : PLACES[q.place].name);
    return h('div', {},
      forks.length ? h('ul', { class: 'quests' }, forks.map((id) => h('li', { class: 'ready' }, h('b', {}, `${RESIDENT_BY_ID[id].name} · 사연의 끝`), h('small', {}, '다시 만나 얘기하면 이 사람과 어떻게 지낼지 고른다.')))) : null,
      qs.length ? h('ul', { class: 'quests' }, qs.map((q) => h('li', { class: q.ready ? 'ready' : '' },
        h('b', {}, `${RESIDENT_BY_ID[q.id].name} · ${q.title}`), h('small', {}, `${where(q)} · ${q.what}`)))) : h('p', { class: 'muted' }, '받아 둔 부탁이 없다. 친해지면 사연을 들려준다.'),
      h('h3', {}, '가진 물건'),
      inv.length ? h('p', {}, inv.map(([id, n]) => `${ITEMS[id].name} ${n}`).join(' · ')) : h('p', { class: 'muted' }, '없음. 편의점·시장·약국에서 산다.'));
  },
  today(s) {
    const t = s.today;
    if (!t) return h('p', { class: 'muted' }, '아침에 새로 적는다.');
    return h('div', {},
      h('ul', { class: 'quests' }, t.tasks.map((x) => h('li', { class: x.done ? 'done' : '' },
        h('b', {}, `${x.done ? '✓ ' : ''}${dailyName(x)}`),
        DAILY[x.id].need > 1 ? h('small', {}, `${Math.min(x.n, DAILY[x.id].need)}/${DAILY[x.id].need}`) : null))),
      h('p', { class: 'muted small' }, t.paid ? '오늘 몫은 다 했다.' : `셋 다 하면 보리차값 ${won(10_000)}. 하나도 안 하면 첫 신도들이 조금 서운해한다.`));
  },
  // 다가오는 큰 날 (25장 D)
  cal(s) {
    const list = upcomingBigDays(s, 5);
    if (!list.length) return h('p', { class: 'muted' }, BIGDAY_UI.none);
    return h('ul', { class: 'quests' }, list.map((b) => h('li', { class: b.day === s.day ? 'on' : '' },
      h('b', {}, `${fmtDateShort(b.day)} · ${b.name}`),
      h('small', {}, `${PLACES[b.place]?.short ?? ''} ${Math.floor(b.from / 60)}시~${Math.floor(b.to / 60)}시 · ${Object.values(b.actions).map((a) => a.label).join(' / ')}`))));
  },
  heard(s) {
    const list = s.heard ?? [];
    if (!list.length) return h('p', { class: 'muted' }, '아직 들은 게 없다. 주민 둘이 서 있는 곳 가까이 가면 들린다.');
    return h('ul', { class: 'quests heard' }, list.map((x) => h('li', {},
      h('small', {}, `${fmtDateShort(x.day)} · ${RESIDENT_BY_ID[x.id]?.name ?? ''}`), h('div', {}, speak(s, x.text)))));
  },
};

// 끝낸 퀘스트 단계 장면: s.quest.news 를 하나씩 꺼내 보여 준다
export function showQuestNews(app, done) {
  const s = app.s;
  const n = s.quest?.news?.shift();
  if (!n) { done?.(); return; }
  app.modalOpened();
  play('confirm');
  const r = n.reward ?? {};
  const pay = [r.money ? `돈 +${won(r.money)}` : null, r.xp ? `경험치 +${r.xp}` : null, r.rep ? `평판 +${r.rep}` : null].filter(Boolean).join(' · ');
  const next = () => { unmount('cutin'); app.modalClosed(); app.refresh(); showQuestNews(app, done); };
  mount('cutin', h('div', { class: 'screen cutin' }, h('div', { class: 'panel box quest-scene' },
    h('div', { class: 'kicker' }, `${mainOf(s)?.title ?? ''} · 끝`),
    h('h2', {}, n.name),
    n.scene.map((l) => h('p', { class: l.includes('"') ? 'say' : 'narr' }, fill(speak(s, l), s))),
    pay ? h('div', { class: 'delta' }, h('span', { class: 'pill up' }, pay)) : null,
    h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: next }, '다음')))));
}

export { FLYER_SPOTS };
