// 가게 (편의점·시장·약국)에서 선물·심부름 물건 사기 · 부탁 수첩 (받아 둔 부탁과 가진 물건)
import { ITEMS, itemsAt } from '../data/items.js';
import { PLACES } from '../data/places.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { buyItem, questList } from '../sim/stories.js';
import { h, mount, unmount, won } from './dom.js';
import { play } from './sound.js';

export function openShop(app, place) {
  const s = app.s;
  app.modalOpened();
  const close = () => { unmount('shop'); app.setBack('shop', null); app.modalClosed(); app.refresh(); };
  app.setBack('shop', close);
  const render = (note = '') => {
    const needed = new Set(questList(s).filter((q) => q.type === 'item').map((q) => q.item));
    mount('shop', h('div', { class: 'screen' }, h('div', { class: 'panel box' },
      h('h2', {}, PLACES[place].name),
      h('p', { class: 'muted' }, `${PLACES[place].desc} 지갑 ${won(s.leader.money)}`),
      note ? h('div', { class: 'narr' }, note) : null,
      h('div', { class: 'shop' }, itemsAt(place).map((id) => {
        const it = ITEMS[id];
        return h('button', { class: 'btn', disabled: s.leader.money < it.price, onclick: () => { if (buyItem(s, id)) { play('coins'); render(`${it.name}을(를) 샀다. (가진 것 ${s.inventory[id]}개)`); } } },
          h('span', {}, it.name, needed.has(id) ? ' ★' : '', h('small', {}, `${it.desc}${s.inventory[id] ? ` · 가진 것 ${s.inventory[id]}` : ''}${needed.has(id) ? ' · 부탁받은 물건' : ''}`)),
          h('span', { class: 'price' }, won(it.price)));
      })),
      h('div', { class: 'row end', style: 'margin-top:10px' }, h('button', { class: 'btn primary', onclick: close }, '나가기')))));
  };
  render();
}

export function openNotebook(app) {
  const s = app.s;
  app.modalOpened();
  const close = () => { unmount('notebook'); app.setBack('notebook', null); app.modalClosed(); };
  app.setBack('notebook', close);
  const qs = questList(s);
  const inv = Object.entries(s.inventory).filter(([, n]) => n > 0);
  const where = (q) => (q.type === 'item' ? `${ITEMS[q.item].name} (${PLACES[ITEMS[q.item].shop].short})` : q.type === 'deliver' ? `${RESIDENT_BY_ID[q.to].name}에게` : PLACES[q.place].name);
  mount('notebook', h('div', { class: 'screen' }, h('div', { class: 'panel box' },
    h('h2', {}, '부탁 수첩'),
    qs.length ? h('ul', { class: 'quests' }, qs.map((q) => h('li', { class: q.ready ? 'ready' : '' },
      h('b', {}, `${RESIDENT_BY_ID[q.id].name} · ${q.title}`), h('small', {}, `${where(q)} · ${q.what}`)))) : h('p', { class: 'muted' }, '받아 둔 부탁이 없다. 친해지면 사연을 들려준다 (호감 25부터).'),
    h('h2', { style: 'font-size:16px;margin-top:12px' }, '가진 물건'),
    inv.length ? h('p', {}, inv.map(([id, n]) => `${ITEMS[id].name} ${n}`).join(' · ')) : h('p', { class: 'muted' }, '없음. 편의점·시장·약국에서 산다.'),
    h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: close }, '닫기')))));
}
