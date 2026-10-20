// 밤 메뉴 (성소 경영): 예배 · 소품 · 신도 돌보기 · 첫 신도들과 이야기 · 밤샘 기도 · 장부 · 잠자기
import { SHOP, SANCTUARY } from '../config.js';
import { SHOP_ITEMS, SHOP_ORDER } from '../data/shop.js';
import { NIGHT, SHADOW, LANDLORD } from '../data/bulletin.js';
import { CAST } from '../data/cast.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { STAGE_NAMES } from '../data/topics.js';
import { LEADER_TONE } from '../data/lines.js';
import { canWorship, holdWorship, seats, mood, canBuy, buy, care, vigil, inflate } from '../sim/sanctuary.js';
import { activeCast, memberCount } from '../sim/faith.js';
import { isMonthEnd } from '../sim/clock.js';
import { tone } from '../sim/leader.js';
import { pick } from '../sim/rng.js';
import { h, mount, unmount, won } from './dom.js';
import { fill, josa } from './text.js';
import { play } from './sound.js';

export function openNight(app) {
  const s = app.s;
  let sub = null;           // 펼친 하위 메뉴
  let note = [];            // 방금 한 일
  const mutter = pick(s, LEADER_TONE[tone(s)].night);

  const render = () => {
    const expected = s.attend.length + activeCast(s).length + s.followers;
    const btn = (key, label, hint, opts = {}) => h('button', {
      class: `btn ${opts.wide ? 'wide' : ''} ${sub === key ? 'on' : ''} ${opts.primary ? 'primary' : ''}`,
      disabled: opts.disabled,
      onclick: () => { play('click'); if (opts.run) opts.run(); else { sub = sub === key ? null : key; render(); } },
    }, label, hint ? h('small', {}, hint) : null);

    const menu = h('div', { class: 'menu' },
      btn('worship', fill(NIGHT.menu.worship, s), canWorship(s) ? `올 사람 약 ${expected}명 · 자리 ${seats(s)}` : fill(NIGHT.worshipNone, s), { disabled: !canWorship(s), primary: canWorship(s) }),
      btn('shop', NIGHT.menu.shop, `자리 ${seats(s)} · 분위기 ${mood(s)}`),
      btn('care', NIGHT.menu.care, '전화로 30분. 호감이 오르고 의심이 내린다.'),
      btn('cast', NIGHT.menu.cast, '엄마, 오랜 친구, 우연히 온 사람'),
      btn('vigil', NIGHT.menu.vigil, s.flags.vigilDay === s.day ? '오늘은 이미 했다' : '광신 쪽으로. 내일 많이 피곤하다.', { disabled: s.flags.vigilDay === s.day, run: doVigil }),
      btn('ledger', NIGHT.menu.ledger, isMonthEnd(s.day) ? `오늘 월세 ${won(SANCTUARY.rent)}` : '이번 주 돈 흐름'),
      btn('sleep', NIGHT.menu.sleep, isMonthEnd(s.day) ? '월세가 나가는 날이다' : '다음 날 아침 7시', { wide: true, run: () => { unmount('night'); app.sleep(); } }),
    );

    const subEl = sub ? h('div', { class: 'sub' }, renderSub(sub)) : null;
    mount('night', h('div', { class: 'screen night' }, h('div', { class: 'panel box' },
      h('h2', {}, fill(NIGHT.title, s)),
      h('p', { class: 'muted' }, NIGHT.arrive, ' ', h('span', {}, mutter)),
      note.length ? h('div', { class: 'stack' }, note.map((n) => h('div', { class: 'narr', style: 'border-left:3px solid var(--accent);padding-left:8px' }, n))) : null,
      menu, subEl,
    )));
  };

  const doVigil = () => {
    vigil(s);
    s.flags.vigilDay = s.day;
    note = [NIGHT.vigil];
    app.refresh();
    render();
  };

  function renderSub(key) {
    if (key === 'worship') {
      const run = (opts) => {
        const r = holdWorship(s, opts);
        play('coins');
        note = [fill(NIGHT.worshipDone, s, { n: r.heads, 돈: r.offering })];
        if (r.standing) note.push(fill(NIGHT.seatsFull, s, { n: r.standing }));
        for (const [id, st] of r.promoted) note.push(`${josa(RESIDENT_BY_ID[id].name, '이/가')} ${josa(STAGE_NAMES[st], '이/가')} 되었다.`);
        if (opts.doubleBasket) note.push(SHADOW.doubleBasket.now);
        if (opts.fast) note.push(fill(SHADOW.fast.now, s));
        sub = null;
        app.refresh();
        app.scene()?.refreshFurniture?.(true);
        render();
      };
      return h('div', { class: 'stack' },
        h('p', { class: 'muted' }, `오늘 올 사람: 이름 아는 사람 ${s.attend.length}명 · 첫 신도 ${activeCast(s).length}명 · 따라온 사람 ${s.followers}명. 자리 ${seats(s)}.`),
        h('button', { class: 'btn primary', onclick: () => run({}) }, fill('{예배}를 연다', s)),
        h('div', { class: 'stack dark' },
          h('button', { class: 'btn', onclick: () => run({ doubleBasket: true }) }, SHADOW.doubleBasket.label, h('small', {}, '헌금이 많이 들어온다. 사기 쪽으로.')),
          h('button', { class: 'btn', onclick: () => run({ fast: true }) }, SHADOW.fast.label, h('small', {}, '믿음이 크게 오른다. 광신 쪽으로.'))));
    }
    if (key === 'shop') {
      return h('div', { class: 'shop' }, SHOP_ORDER.map((id) => {
        const it = SHOP_ITEMS[id]; const cfg = SHOP[id];
        const have = s.sanctuary.props[id] ?? 0;
        const c = canBuy(s, id);
        return h('button', { class: 'btn', disabled: !c.ok, onclick: () => { buy(s, id); play('coins'); note = [`${it.name}. ${it.desc}`]; app.refresh(); app.scene()?.refreshFurniture?.(); render(); } },
          h('span', {}, it.name, h('small', {}, `${cfg.seats ? `자리 +${cfg.seats} ` : ''}${cfg.mood ? `분위기 +${cfg.mood} ` : ''}· ${have}/${cfg.max}`)),
          h('span', { class: 'price' }, won(cfg.price)));
      }));
    }
    if (key === 'care') {
      const list = Object.keys(s.res).filter((id) => ['visitor', 'newcomer', 'member'].includes(s.res[id].stage));
      if (!list.length) return h('p', { class: 'muted' }, '아직 전화할 사람이 없다. 낮에 동네를 돌자.');
      const done = list.filter((id) => s.res[id].cared === s.day).length;
      return h('div', { class: 'shop' }, list.map((id) => h('button', {
        class: 'btn', disabled: s.res[id].cared === s.day || done >= 2,
        onclick: () => { care(s, id); play('talk'); note = [fill(NIGHT.careDone, s, { 이름: RESIDENT_BY_ID[id].name })]; app.refresh(); render(); },
      }, h('span', {}, RESIDENT_BY_ID[id].name, h('small', {}, `${STAGE_NAMES[s.res[id].stage]} · 하룻밤에 두 명까지`)), h('span', { class: 'price' }, s.res[id].cared === s.day ? '통화함' : '전화'))));
    }
    if (key === 'cast') {
      const t = tone(s);
      return h('div', { class: 'stack' }, CAST.map((c) => {
        const st = s.cast[c.id];
        if (!st.active) return h('p', { class: 'muted' }, `${c.name} (${c.role}): 요즘 연락이 안 된다.`);
        return h('button', { class: 'btn', onclick: (e) => {
          const line = t === 'neutral' || st.talkIdx % 3 ? c.talk[st.talkIdx % c.talk.length] : c[t];
          st.talkIdx++;
          play('talk');
          e.currentTarget.querySelector('small').textContent = line;
        } }, `${c.name} · ${c.role}`, h('small', {}, '말 걸기'));
      }));
    }
    if (key === 'ledger') {
      const w = s.week;
      const inflated = s.flags.inflatedWeek === s.bulletinNo;
      return h('div', { class: 'stack' },
        h('p', {}, `이번 주 헌금 ${won(w.offering)} · 지갑 ${won(s.leader.money)} · 월세 ${won(SANCTUARY.rent)} (일요일 밤)`),
        h('p', { class: 'muted' }, `월세 연속 납부 ${s.sanctuary.rentStreak}달 · 체납 ${s.sanctuary.arrears}번 · 지금 신도 ${memberCount(s)}명`),
        h('div', { class: 'stack dark' }, h('button', { class: 'btn', disabled: inflated, onclick: () => {
          inflate(s); play('page'); note = [SHADOW.inflate.now]; app.refresh(); render();
        } }, SHADOW.inflate.label, h('small', {}, inflated ? '이번 주는 이미 고쳤다' : '평판이 조금 오른다. 사기 쪽으로.'))));
    }
    return null;
  }

  render();
}

// 월말에 돈이 모자랄 때 건물주
export function openLandlord(app, onChoice) {
  const s = app.s;
  const hasMember = Object.values(s.res).some((r) => r.stage === 'member');
  const line = LANDLORD.lines[Math.min(s.sanctuary.arrears, LANDLORD.lines.length - 1)];
  play('error');
  mount('landlord', h('div', { class: 'screen' }, h('div', { class: 'panel box' },
    h('h2', {}, `${LANDLORD.title} ${LANDLORD.name}`),
    h('p', {}, line),
    h('p', { class: 'muted' }, `월세 ${won(SANCTUARY.rent)} · 지갑 ${won(s.leader.money)}`),
    h('div', { class: 'stack' },
      h('button', { class: 'btn', onclick: () => { unmount('landlord'); onChoice('promise'); } }, LANDLORD.options.promise, h('small', {}, `체납 ${s.sanctuary.arrears + 1}번째가 된다. 세 번이면 쫓겨난다.`)),
      hasMember ? h('div', { class: 'stack dark' }, h('button', { class: 'btn', onclick: () => { unmount('landlord'); onChoice('borrow'); } }, LANDLORD.options.borrow, h('small', {}, '지금은 낼 수 있다. 사기 쪽으로.'))) : null))));
}
