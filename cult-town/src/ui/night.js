// 밤 메뉴 (성소 경영): 예배 · 소품 · 신도 돌보기 · 첫 신도들과 이야기 · 밤샘 기도 · 장부 · 잠자기
import { SHOP, ROOMS } from '../config.js';
import { ROOM_NAMES, ROOM_ORDER, ROOM_DESC, STUDY_NAMES } from '../data/rooms.js';
import { TRAITS, AGENDAS } from '../data/officers.js';
import { rentNow, nextStep, expand, expandCost, haggleChance, openSlots, buildRoom, upgradeRoom, roomCost, DARK_ROOM_TYPES } from '../sim/space.js';
import { activeOfficers, canPromote, promote, assign, pickAgenda, decideAgenda, relOf } from '../sim/officers.js';
import { SHOP_ITEMS, SHOP_ORDER } from '../data/shop.js';
import { NIGHT, SHADOW, LANDLORD } from '../data/bulletin.js';
import { CAST } from '../data/cast.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { STAGE_NAMES } from '../data/topics.js';
import { LEADER_TONE } from '../data/lines.js';
import { canWorship, holdWorship, seats, mood, canBuy, buy, care, vigil, inflate, signTier, nextSignCost, upgradeSign } from '../sim/sanctuary.js';
import { activeCast, memberCount } from '../sim/faith.js';
import { isRentDay as isMonthEnd } from '../sim/clock.js';
import { tone } from '../sim/leader.js';
import { pick } from '../sim/rng.js';
import { h, mount, unmount, won } from './dom.js';
import { fill, josa } from './text.js';
import { play } from './sound.js';
import { rivalNight } from './threats.js';
import { exposureWord } from '../sim/threats.js';
import { rivalInfo } from '../sim/rival.js';
import { PHASE4, SIGN } from '../config.js';
import { BRANCH_TEXT } from '../data/branch.js';
import { canOpenBranch, openBranch, branchHead, branchOptions, branchAct } from '../sim/branch.js';
import { branchCount } from '../sim/faith.js';

const SIGN_HINT = ['', '창문에 흰 글씨로 교단 이름. 3층을 올려다보면 보인다.', '아크릴 판. 상가 앞을 지나는 사람이 다 본다.', '외벽 대형 간판, 저녁엔 불이 들어온다. 역 앞에서도 보인다.'];
const SIGN_TEXT = ['', '시트지 업자가 창문에 "{교단}" 글씨를 붙이고 갔다. 거꾸로 붙은 글자는 없다.', '아크릴 간판을 달았다. 1층 김밥집 사장님이 올려다보고 "어, 이름이 그거였어요?" 했다.', '외벽에 큰 간판이 올라갔다. 저녁 여섯 시에 조명이 켜지자 역 3번 출구 쪽에서 사람들이 고개를 들었다.'];

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
      btn('sign', '간판', `지금: ${SIGN.names[signTier(s)]}${nextSignCost(s) != null ? ` · 다음 ${won(nextSignCost(s))}` : ' · 더 바꿀 게 없다'}`),
      btn('care', NIGHT.menu.care, '전화로 30분. 호감이 오르고 의심이 내린다.'),
      btn('cast', NIGHT.menu.cast, '엄마, 오랜 친구, 우연히 온 사람'),
      btn('vigil', NIGHT.menu.vigil, s.flags.vigilDay === s.day ? '오늘은 이미 했다' : '광신 쪽으로. 내일 많이 피곤하다.', { disabled: s.flags.vigilDay === s.day, run: doVigil }),
      btn('ledger', NIGHT.menu.ledger, isMonthEnd(s.day) ? `오늘 월세 ${won(rentNow(s))}` : '이번 주 돈 흐름'),
      ...(s.phase >= 2 ? [
        btn('space', '공간·방', `${['302호', '302+303호', '3층 전체', '3층+2층', '3층+2층+4층'][s.space.step]} · 방 ${Object.keys(s.rooms).length}개`),
        btn('officers', '간부', `${activeOfficers(s).length}명 · 배치·승진`),
        btn('meeting', '간부 회의', s.flags.meetingDay === s.day ? '오늘은 이미 했다' : '안건 하나', { disabled: s.flags.meetingDay === s.day || activeOfficers(s).length < 2 }),
      ] : []),
      ...(s.phase >= 4 ? [btn('branch', BRANCH_TEXT.menu, s.branch.open ? `지부장 ${branchHead(s)?.name ?? '없음'} · ${branchCount(s)}명${s.branch.split ? ' · 독립 예고!' : ''}` : '봉천프라자 2층 임대')] : []),
      ...(s.phase >= 3 && s.rival ? [btn('rival', `라이벌 · ${rivalInfo(s).name}`, s.flags.rivalNight === s.day ? '오늘은 이미 정했다' : '경쟁 · 폭로 · 합병 · 휴전')] : []),
      btn('sleep', NIGHT.menu.sleep, isMonthEnd(s.day) ? '월세가 나가는 날이다' : '다음 날 아침 7시', { wide: true, run: () => { unmount('night'); app.setBack('night', null); app.sleep(); } }),
    );

    const subEl = sub ? h('div', { class: 'sub' }, renderSub(sub), h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'btn back', onclick: () => { play('click'); sub = null; render(); } }, '‹ 뒤로'))) : null;
    app.setBack('night', sub ? () => { sub = null; render(); } : null);
    mount('night', h('div', { class: 'screen night' }, h('div', { class: 'panel box' },
      h('h2', {}, fill(NIGHT.title, s)),
      h('p', { class: 'muted' }, NIGHT.arrive, ' ', h('span', {}, mutter)),
      s.phase >= 3 ? h('p', { class: 'muted' }, `바깥 눈길: ${exposureWord(s)}.${s.reporter.active ? ' 관악생활신문 기자가 동네를 돈다.' : ''}${s.reporter.due ? ' 기사가 곧 나온다.' : ''}`) : null,
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

  // 봉천 지부: 열기(지부장 고르기) · 지부장 문제 대응
  function branchSub() {
    const B = s.branch;
    const done = (r) => { note = [r.text ?? r]; play(r.tone === 'bad' ? 'error' : 'confirm'); sub = null; app.refresh(); render(); };
    const officerBtns = (fn, exclude) => activeOfficers(s).filter((o) => o.id !== exclude).map((o) => h('button', { class: 'btn', onclick: () => fn(o.id) },
      `${o.name} · ${o.role}`, h('small', {}, `관리 ${o.manage} · 충성 ${o.loyal} · 불만 ${o.discontent >= 60 ? '높음' : o.discontent >= 30 ? '조금' : '낮음'}`)));
    if (!B.open) {
      const why = s.leader.money < PHASE4.deposit ? `보증금 ${won(PHASE4.deposit)}이 모자란다.` : activeOfficers(s).length < 2 ? '지부를 맡길 간부가 두 명은 있어야 한다.' : null;
      return h('div', { class: 'stack' },
        h('p', { class: 'muted' }, `${BRANCH_TEXT.door} ${BRANCH_TEXT.closedHint}`),
        why ? h('p', { class: 'muted' }, why) : h('p', {}, '누구에게 지부를 맡길까. 관리 능력이 지부 예배를 좌우한다.'),
        ...(canOpenBranch(s) ? officerBtns((id) => { const tx = openBranch(s, id); if (tx) done(tx); }) : []));
    }
    const o = branchHead(s);
    const mood = !o ? '지부장이 없다.' : o.discontent >= PHASE4.splitAt ? '지부를 들고 나가려 한다.' : o.discontent >= 45 ? '요즘 302호 얘기를 잘 안 한다.' : '지부 일에 신이 나 있다.';
    const opts = branchOptions(s);
    return h('div', { class: 'stack' },
      h('p', { class: 'muted' }, `봉천 지부 ${branchCount(s)}명 (목표 ${PHASE4.branch}) · 지부장 ${o?.name ?? '없음'}: ${mood}${B.split ? ` 독립 예고 (${Math.max(0, B.split.due - s.day)}일 남음).` : ''} 헌금 중 본부 몫 ${Math.round((B.share ?? 1) * 100)}%.`),
      ...opts.filter((x) => x !== 'replace').map((x) => h('button', { class: 'btn', disabled: x === 'meet' && s.flags.branchMeet === s.day, onclick: () => done(branchAct(s, x)) },
        BRANCH_TEXT.options[x][0], h('small', {}, BRANCH_TEXT.options[x][1]))),
      opts.includes('replace') ? h('div', { class: 'muted', style: 'margin-top:6px' }, `${BRANCH_TEXT.options.replace[0]}: ${BRANCH_TEXT.options.replace[1]}`) : null,
      ...(opts.includes('replace') ? officerBtns((id) => done(branchAct(s, 'replace', id)), o?.id) : []));
  }

  function renderSub(key) {
    if (key === 'branch') return branchSub();
    if (key === 'sign') {
      const c = nextSignCost(s);
      const tier = signTier(s);
      return h('div', { class: 'stack' },
        h('p', { class: 'muted' }, `지금 간판: ${SIGN.names[tier]}. 간판이 크면 지나가는 사람이 알아보고(평판·초대 조금↑), 바깥 눈길도 같이 는다.`),
        c == null ? h('p', {}, '외벽 간판에 조명까지 달았다. 더 바꿀 게 없다.') :
          h('button', { class: 'btn', disabled: s.leader.money < c, onclick: () => {
            upgradeSign(s); play('coins');
            note = [SIGN_TEXT[signTier(s)].replaceAll('{교단}', s.leader.cultName)];
            sub = null; app.refresh(); render();
          } }, `${SIGN.names[tier + 1]}로 바꾸기`, h('small', {}, `${won(c)} · ${SIGN_HINT[tier + 1]}`)));
    }
    if (key === 'rival') {
      return rivalNight(s, (r) => { note = [r.text]; play(r.tone === 'bad' ? 'error' : 'confirm'); sub = null; app.refresh(); render(); });
    }
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
    if (key === 'space') return renderSpace();
    if (key === 'officers') return renderOfficers();
    if (key === 'meeting') return renderMeeting();
    if (key === 'ledger') {
      const w = s.week;
      const inflated = s.flags.inflatedWeek === s.bulletinNo;
      return h('div', { class: 'stack' },
        h('p', {}, `이번 주 헌금 ${won(w.offering)} · 지갑 ${won(s.leader.money)} · 월세 ${won(rentNow(s))} (25일) · 지난 주 지출 ${won(s.week.costs ?? 0)}`),
        h('p', { class: 'muted' }, `월세 연속 납부 ${s.sanctuary.rentStreak}달 · 체납 ${s.sanctuary.arrears}번 · 지금 신도 ${memberCount(s)}명`),
        h('div', { class: 'stack dark' }, h('button', { class: 'btn', disabled: inflated, onclick: () => {
          inflate(s); play('page'); note = [SHADOW.inflate.now]; app.refresh(); render();
        } }, SHADOW.inflate.label, h('small', {}, inflated ? '이번 주는 이미 고쳤다' : '평판이 조금 오른다. 사기 쪽으로.'))));
    }
    return null;
  }

  function renderSpace() {
    const st = nextStep(s);
    const out = [];
    if (st) {
      const p = Math.round(haggleChance(s) * 100);
      const go = (choice) => {
        const r = expand(s, choice);
        if (!r.ok) note = [`돈이 모자란다. 보증금 ${won(r.cost)}.${r.haggled === false ? ' 깎아 달라고 했다가 건물주 기분만 상했다.' : ''}`];
        else { play('coins'); note = [`${r.step.name}. 보증금 ${won(r.cost)}${r.haggled ? ' (깎았다)' : ''}. 월세가 주마다 ${won(r.step.rent)} 오른다.`]; app.scene()?.scene.restart({ entry: 'door' }); }
        app.refresh(); render();
      };
      out.push(h('p', {}, `다음: ${st.name} · 보증금 ${won(st.deposit)} · 월세 +${won(st.rent)} · 지갑 ${won(s.leader.money)}`),
        h('div', { class: 'row' },
          h('button', { class: 'btn', onclick: () => go('pay') }, '그대로 낸다'),
          h('button', { class: 'btn', onclick: () => go('haggle') }, `깎아 본다 (${p}%)`, h('small', {}, '실패하면 건물주 불만↑')),
          h('button', { class: 'btn', onclick: () => go('long') }, `장기 계약 (${won(expandCost(s, 'long'))})`, h('small', {}, '건물주 불만↓'))));
    } else out.push(h('p', { class: 'muted' }, '더 넓힐 데가 없다. 건물을 다 쓰고 있다.'));
    out.push(h('p', { class: 'muted' }, `건물주 불만 ${Math.round(s.landlordAnger)}/100 · 월세 ${won(rentNow(s))}`));
    for (const slot of openSlots(s)) {
      const r = s.rooms[slot];
      if (!r) {
        out.push(h('div', { class: 'officer-row' }, h('b', {}, `${slot}호 (빈 칸)`), h('span', {})));
        out.push(h('div', { class: 'shop' }, ROOM_ORDER.map((type) => h('button', { class: 'btn small', disabled: s.leader.money < ROOMS[type].build, onclick: () => {
          if (buildRoom(s, slot, type)) { play('coins'); note = [`${slot}호에 ${ROOM_NAMES[type]}을(를) 만들었다.`]; app.scene()?.refreshFurniture?.(); app.refresh(); render(); }
        } }, h('span', {}, ROOM_NAMES[type], h('small', {}, type === 'study' ? `${ROOM_DESC[type].what} · 교재 "${STUDY_NAMES[s.leader.sect]}"` : ROOM_DESC[type].what)), h('span', { class: 'price' }, won(ROOMS[type].build))))));
      } else {
        const cost = roomCost(s, slot);
        const name = `${slot}호 ${ROOM_NAMES[r.type]} ${r.level}단계${r.dark ? ' (어두운 개조)' : ''}`;
        const row = [h('b', {}, name)];
        if (cost != null) {
          const next = ROOM_DESC[r.type].up[r.level - 1];
          const ups = [h('button', { class: 'btn small', disabled: s.leader.money < cost, onclick: () => { if (upgradeRoom(s, slot, false)) { play('coins'); note = [`${name}: ${next}.`]; app.scene()?.refreshFurniture?.(); app.refresh(); render(); } } }, `${next} (${won(cost)})`)];
          if (r.level === 2 && DARK_ROOM_TYPES.includes(r.type)) ups.push(h('span', { class: 'dark' }, h('button', { class: 'btn small', disabled: s.leader.money < cost, onclick: () => { if (upgradeRoom(s, slot, true)) { s.flags.darkToday = (s.flags.darkToday ?? 0) + 1; play('coins'); note = [`${name}: ${ROOM_DESC[r.type].dark}. 효과가 크다. 대신 그림자 장부.`]; app.scene()?.refreshFurniture?.(); app.refresh(); render(); } } }, `${ROOM_DESC[r.type].dark} (${won(cost)})`)));
          row.push(h('span', { class: 'row' }, ups));
        } else row.push(h('span', { class: 'muted' }, '다 올렸다'));
        out.push(h('div', { class: 'officer-row' }, row));
      }
    }
    return h('div', { class: 'stack' }, out);
  }

  function renderOfficers() {
    const act = activeOfficers(s);
    const places = [['', '쉬는 중'], ['street', '낮 포교'], ...Object.keys(s.rooms).map((slot) => [`room:${slot}`, `${slot}호 ${ROOM_NAMES[s.rooms[slot].type]}`])];
    const rows = act.map((o) => {
      const sel = o.assign === 'branch' ? h('small', {}, '봉천 지부장') : h('select', { onchange: (e) => { assign(s, o.id, e.target.value || null); play('click'); render(); } },
        places.map(([v, label]) => h('option', { value: v, selected: (o.assign ?? '') === v }, label)));
      const rels = act.filter((x) => x !== o).map((x) => [x, relOf(s, o.id, x.id)]).filter(([, r]) => r).map(([x, r]) => `${x.name.slice(1)} ${r === 'rival' ? '앙숙' : '친함'}`);
      return h('div', { class: 'officer-row' },
        h('div', {}, h('b', {}, `${o.name} · ${o.role}`), h('small', { style: 'display:block' }, `말솜씨 ${o.talk} · 관리 ${o.manage} · 충성 ${o.loyal} · ${TRAITS[o.trait].name}${rels.length ? ` · ${rels.join(', ')}` : ''}`),
          h('small', {}, '불만 '), h('span', { class: 'meter' }, h('i', { style: `width:${o.discontent}%` }))),
        sel);
    });
    const cands = Object.keys(s.res).filter((id) => canPromote(s, id));
    return h('div', { class: 'stack' }, rows,
      h('p', { class: 'muted' }, '방 담당: 관리가 높을수록 그 방 효과↑. 낮 포교: 말솜씨가 높을수록 잘 통하고 실수가 적다. 앙숙끼리 같은 일을 맡기면 불만이 쌓인다.'),
      cands.length ? h('div', { class: 'stack' }, h('b', {}, '간부로 세울 수 있는 신도'), cands.map((id) => h('button', { class: 'btn small', onclick: () => { promote(s, id); play('confirm'); note = [`${RESIDENT_BY_ID[id].name}을(를) 간부로 세웠다.`]; render(); } }, `${RESIDENT_BY_ID[id].name} (${RESIDENT_BY_ID[id].job})`)))
        : h('p', { class: 'muted' }, act.length >= 6 ? '간부는 여섯 명까지.' : '호감 75 이상인 신도가 생기면 간부로 세울 수 있다.'));
  }

  function renderMeeting() {
    const ag = pickAgenda(s);
    if (!ag) return h('p', { class: 'muted' }, '올라온 안건이 없다.');
    const a = AGENDAS.find((x) => x.id === ag.id);
    const by = s.officers.find((o) => o.id === ag.by); const other = ag.other ? s.officers.find((o) => o.id === ag.other) : null;
    const f = (t) => t.replaceAll('{이름}', by.name).replaceAll('{상대}', other?.name ?? '');
    return h('div', { class: 'stack' }, h('b', {}, `안건: ${a.title} (${by.name})`), h('div', { class: 'say' }, f(a.say)),
      a.options.map((o, i) => h('div', { class: o.fx.shadow || (o.fx.belief ?? 0) < 0 ? 'dark' : '' }, h('button', { class: 'btn', style: 'width:100%', onclick: () => {
        decideAgenda(s, ag, i); if (o.fx.shadow) s.flags.darkToday = (s.flags.darkToday ?? 0) + 1; play('click'); note = [`간부 회의: ${f(o.label)}.`]; sub = null; app.refresh(); render();
      } }, f(o.label)))));
  }

  render();
}

// 월세날(25일) 돈이 모자랄 때 건물주
export function openLandlord(app, onChoice) {
  const s = app.s;
  const hasMember = Object.values(s.res).some((r) => r.stage === 'member');
  const line = LANDLORD.lines[Math.min(s.sanctuary.arrears, LANDLORD.lines.length - 1)];
  play('error');
  mount('landlord', h('div', { class: 'screen' }, h('div', { class: 'panel box' },
    h('h2', {}, `${LANDLORD.title} ${LANDLORD.name}`),
    h('p', {}, line),
    h('p', { class: 'muted' }, `월세 ${won(rentNow(s))} · 지갑 ${won(s.leader.money)}`),
    h('div', { class: 'stack' },
      h('button', { class: 'btn', onclick: () => { unmount('landlord'); onChoice('promise'); } }, LANDLORD.options.promise, h('small', {}, `체납 ${s.sanctuary.arrears + 1}번째가 된다. 두 달 밀리면 쫓겨난다.`)),
      hasMember ? h('div', { class: 'stack dark' }, h('button', { class: 'btn', onclick: () => { unmount('landlord'); onChoice('borrow'); } }, LANDLORD.options.borrow, h('small', {}, '지금은 낼 수 있다. 사기 쪽으로.'))) : null))));
}
