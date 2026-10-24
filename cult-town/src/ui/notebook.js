// 수첩 (24장 C-4): 메인 / 사연 / 오늘 / 엿들은 소문 탭 · 퀘스트 장면 (끝낸 단계를 짧게 보여 준다)
import { ITEMS } from '../data/items.js';
import { PLACES } from '../data/places.js';
import { RESIDENT_BY_ID, RESIDENTS, RESIDENTS_B, RESIDENTS_Z } from '../data/residents.js';
import { STORIES } from '../data/stories.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { titleOf } from '../sim/achievements.js';
import { DAILY, FLYER_SPOTS } from '../data/quests.js';
import { questList } from '../sim/stories.js';
import { mainOf } from '../sim/quests.js';
import { fmtDateShort } from '../sim/clock.js';
import { upcomingBigDays } from '../sim/bigdays.js';
import { BIGDAY_UI } from '../data/bigdays.js';
import { ZONE_TEXT, ZONE_QUESTS } from '../data/zones.js';
import { activeZoneQuests, zoneQuestHint, zoneQuestsOf, zoneOpen, ZONE_ORDER } from '../sim/zones.js';
import { HEAD_ICONS, makeHeadIcons } from '../game/overlays.js';
import { h, mount, unmount, won } from './dom.js';
import { play } from './sound.js';
import { fill, speak } from './text.js';

const TABS = [['main', '메인'], ['zone', '구역 일'], ['story', '사연'], ['today', '오늘'], ['heard', '엿들은 소문'], ['cal', BIGDAY_UI.calendar], ['dex', '도감'], ['ach', '업적'], ['legend', '기호 설명']];
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
      h('div', { class: 'tabbody' }, BODY[tab](s, app, render)),
      tab === 'legend' ? null : h('p', { class: 'muted small' }, '머리 위 표시가 뭔지 모르겠으면 \'기호 설명\' 탭.'),
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
  // 30장 B: 구역 퀘스트 · 아직 닫힌 구역
  zone(s) {
    const act = activeZoneQuests(s);
    const done = ZONE_ORDER.flatMap((id) => (ZONE_QUESTS[id] ?? []).filter((q) => zoneQuestsOf(s)[q.id]?.done));
    const shut = ZONE_ORDER.filter((id) => !zoneOpen(s, id));
    const prog = (q, st) => (q.then ? ` (${st.step}/2)` : '');
    return h('div', {},
      act.length ? h('ul', { class: 'quests' }, act.map(({ q, st, zone }) => h('li', { class: 'ready' },
        h('b', {}, `▶ ${ZONE_TEXT[zone].name} · ${q.name}${prog(q, st)}`), h('small', {}, zoneQuestHint(s, q))))) : h('p', { class: 'muted' }, '지금 열린 구역의 일은 다 했다.'),
      done.length ? h('ul', { class: 'quests' }, done.map((q) => h('li', { class: 'done' }, h('b', {}, `✓ ${q.name}`)))) : null,
      shut.length ? h('h3', {}, '공사 중인 곳') : null,
      shut.length ? h('ul', { class: 'quests' }, shut.map((id) => h('li', { class: 'later' }, h('b', {}, ZONE_TEXT[id].name), h('small', {}, ZONE_TEXT[id].hint)))) : null);
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
      h('small', {}, `${b.where ?? PLACES[b.place]?.short ?? ''} ${Math.floor(b.from / 60)}시~${Math.floor(b.to / 60)}시 · ${Object.values(b.actions).map((a) => a.label).join(' / ')}`))));
  },
  // 주민 도감 (28장 B-3): 모르는 사람 실루엣 · 만난 사람 얼굴 · 사연 끝까지 별 · 신도 리본
  dex(s, app) {
    const groups = [['신림동', RESIDENTS]];
    for (const id of ZONE_ORDER) if (zoneOpen(s, id)) groups.push([`신림동 · ${ZONE_TEXT[id].name}`, RESIDENTS_Z.filter((r) => r.zone === id)]);   // 30장 새 구역
    if (s.phase >= 4) groups.push(['봉천동', RESIDENTS_B]);
    const all = groups.flatMap(([, list]) => list);
    const full = (id) => STORIES[id] && (s.res[id]?.story?.done ?? 0) >= STORIES[id].length;
    const met = all.filter((r) => s.res[r.id]?.met).length;
    const done = all.filter((r) => full(r.id)).length;
    const mem = all.filter((r) => s.res[r.id]?.stage === 'member').length;
    return h('div', {},
      h('div', { class: 'dex-count' }, h('span', {}, `만난 사람 ${met}/${all.length}`), h('span', {}, `★ 사연 다 본 사람 ${done}`), h('span', {}, `신도 ${mem}`)),
      ...groups.map(([name, list]) => h('div', {}, h('h3', {}, name), h('div', { class: 'dex' }, list.map((r) => {
        const st = s.res[r.id];
        const known = st?.met;
        return h('div', { class: `cell ${known ? '' : 'unknown'} ${st?.stage === 'member' ? 'member' : ''}`, title: known ? `${r.name} · ${r.job}` : '아직 인사 안 한 사람' },
          h('img', { src: app.portrait(r.id), alt: '' }),
          h('span', { class: 'nm' }, known ? r.name : '???'),
          full(r.id) ? h('b', { class: 'star' }, '★') : null,
          st?.stage === 'member' ? h('i', { class: 'ribbon' }, '신도') : null);
      })))));
  },
  // 업적·칭호 (28장 B-4): 딴 업적을 누르면 그 칭호를 이름 앞에 단다
  ach(s, app, rerender) {
    const got = ACHIEVEMENTS.filter((a) => s.achievements?.[a.id] != null).length;
    return h('div', {},
      h('p', { class: 'small' }, `${got}/${ACHIEVEMENTS.length} · 지금 칭호 〈${titleOf(s) ?? '없음'}〉 · 딴 칭호를 누르면 바꿔 단다.`),
      h('div', { class: 'ach' }, ACHIEVEMENTS.map((a) => {
        const day = s.achievements?.[a.id];
        const on = day != null;
        return h('button', { class: `btn ach-i ${on ? 'on' : 'locked'} ${s.leader.title === a.id ? 'worn' : ''}`, disabled: !on,
          onclick: () => { s.leader.title = a.id; app.refresh(); rerender(); } },
          h('b', {}, on ? `〈${a.name}〉` : '〈? ? ?〉'), h('small', {}, on ? `${a.desc} · ${fmtDateShort(day)}` : a.desc));
      })));
  },
  // 지도 기호 설명 (27장 B): 머리 위 표시는 한 사람에 하나, 위에 있는 것이 먼저 보인다
  legend(s, app) {
    const sc = app.scene();
    if (sc) makeHeadIcons(sc);
    const img = (key) => {
      let src = '';
      try { src = app.game.textures.getBase64(key); } catch { /* 텍스처가 아직 없으면 글씨만 */ }
      return src ? h('img', { class: 'legend-ico', src, alt: '' }) : null;
    };
    return h('div', {},
      h('p', { class: 'small' }, '머리 위 표시는 한 사람에 하나만 뜬다. 여러 개에 해당하면 위쪽 것이 먼저.'),
      h('ul', { class: 'legend' }, Object.entries(HEAD_ICONS).map(([k, v]) => h('li', {}, img(`head.${k}`), h('span', {}, v[3])))),
      h('h3', {}, '그 밖에'),
      h('ul', { class: 'legend' },
        h('li', {}, h('span', { class: 'legend-tag' }, '이름'), h('span', {}, '인사한 사람의 이름표. 3칸 안으로 다가가면 아래에 직업이 작게 뜬다.')),
        h('li', {}, h('span', { class: 'legend-tag road' }, '신림로'), h('span', {}, '파란 도로명 표지판. 큰길 교차로 모퉁이에 있다.')),
        h('li', {}, h('span', { class: 'legend-tag exit' }, '3'), h('span', {}, '초록 숫자: 지하철역 출구 번호.'))));
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
