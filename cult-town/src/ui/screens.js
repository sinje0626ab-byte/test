// 주보 · 밤사이 소식 · 엔딩 · 크레딧 · 게임 메뉴
import { GOAL, SANCTUARY } from '../config.js';
import { BULLETIN, ENDINGS, DOOMSDAY_PASSED, SHADOW, LANDLORD, CLERGY_EVENT } from '../data/bulletin.js';
import { CLERGY } from '../data/clergy.js';
import { CAST_BY_ID } from '../data/cast.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { fmtDate } from '../sim/clock.js';
import { h, mount, unmount, won } from './dom.js';
import { fill, josa } from './text.js';
import { play } from './sound.js';

// 잠든 사이 일어난 일 (성직자 경고, 그림자 장부, 이탈, 월세)
export function eventLines(s, events) {
  const out = [];
  for (const e of events) {
    if (e.type === 'clergy') {
      const c = CLERGY.find((x) => x.id === e.id);
      out.push(fill(CLERGY_EVENT, s, { 직함: c.title, 이름: c.name }) + ' ' + e.line);
    } else if (e.type === 'shadow') out.push(e.text);
    else if (e.type === 'doomsday') out.push(DOOMSDAY_PASSED);
    else if (e.type === 'left') out.push(`${josa(RESIDENT_BY_ID[e.id].name, '이/가')} 더 이상 302호에 오지 않는다.`);
    else if (e.type === 'castLeft') out.push(`${CAST_BY_ID[e.id].name}(${CAST_BY_ID[e.id].role})에게서 "당분간 못 갈 것 같다"는 문자가 왔다.`);
    else if (e.type === 'rent') {
      if (e.paid) {
        out.push(fill(LANDLORD.paid, s, { 돈: e.amount }));
        if (e.borrowed) out.push(fill(SHADOW.borrow.now, s, { 이름: RESIDENT_BY_ID[e.borrowed.id].name }));
      } else out.push(`월세를 못 냈다. 체납 ${e.arrears}번째. ${LANDLORD.lines[Math.min(e.arrears - 1, 2)]}`);
    }
  }
  return out;
}

export function showMorning(s, lines, onClose) {
  if (!lines.length) { onClose(); return; }
  mount('morning', h('div', { class: 'screen' }, h('div', { class: 'panel box' },
    h('h2', {}, '밤사이'),
    ...lines.map((l) => h('p', {}, l)),
    h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: () => { unmount('morning'); onClose(); } }, '확인')))));
}

export function showBulletin(s, b, onClose) {
  play('jingle_week', 0.4);
  const S = BULLETIN.sections;
  const worshipText = b.worships.length
    ? b.worships.map((w) => `${fmtDate(w.day)}: ${w.heads}명${w.standing ? ` (서서 ${w.standing}명)` : ''}`)
    : [fill(BULLETIN.noWorship, s)];
  const newNames = [...b.members.map((n) => `${n} (${b.terms.member})`), ...b.newcomers.filter((n) => !b.members.includes(n)).map((n) => `${n} (새신자)`)];
  const town = b.town.map((t) => (t === 'doomsday' ? DOOMSDAY_PASSED : t));
  const rent = b.rent
    ? b.rent.paid ? `월세 ${won(b.rent.amount)} 납부${b.rent.borrowed ? ' (빌린 돈)' : ''}. 연속 ${b.stats.rentStreak}달.` : `월세 미납. 체납 ${b.rent.arrears}번째.`
    : '';
  mount('bulletin', h('div', { class: 'screen bulletin' }, h('div', { class: 'panel' },
    h('div', { class: 'mast' },
      h('div', { class: 'name' }, fill(BULLETIN.head, s)),
      h('div', { class: 'meta' }, `${fill(BULLETIN.issue, s, { n: b.no })} · ${b.date} · 신림동 동림상가 302호`)),
    h('span', { class: 'stamp' }, b.stats.members >= GOAL.members ? '만석' : '배포용'),
    h('h4', {}, fill(S.worship, s)), h('ul', {}, worshipText.map((t) => h('li', {}, t))),
    h('h4', {}, S.newcomers), newNames.length ? h('ul', {}, newNames.map((t) => h('li', {}, t))) : h('p', {}, BULLETIN.noNewcomers),
    b.followers ? h('p', {}, `신도들이 데려온 사람 ${b.followers}명이 뒷자리에 앉았다.`) : null,
    b.left.length ? h('p', {}, `떠난 사람: ${b.left.map((n) => (n.startsWith('cast:') ? CAST_BY_ID[n.slice(5)].name : n)).join(', ')}`) : null,
    h('h4', {}, S.money), h('p', {}, `헌금 ${won(b.offering)}. ${rent}`),
    h('h4', {}, S.town), h('ul', {}, town.map((t) => h('li', {}, t))),
    h('h4', {}, S.leader), h('p', {}, fill(b.leaderWord, s)),
    h('h4', {}, S.notice), h('p', {}, fill(b.notice, s)),
    h('div', { class: 'tally' },
      h('div', {}, h('b', {}, `${b.stats.members}/${GOAL.members}`), '신도'),
      h('div', {}, h('b', {}, `${b.stats.rentStreak}/${GOAL.rentStreak}`), '월세 연속'),
      h('div', {}, h('b', {}, `${b.stats.rep}`), `평판 (${b.stats.repDelta >= 0 ? '+' : ''}${b.stats.repDelta})`)),
    h('div', { class: 'row end', style: 'margin-top:12px' }, h('button', { class: 'btn primary', onclick: () => { play('page'); unmount('bulletin'); onClose(); } }, '주보 접기')))));
}

export function showEnding(s, kind, { onTitle }) {
  const e = ENDINGS[kind];
  play(kind === 'win' ? 'jingle_good' : 'jingle_bad', 0.5);
  mount('ending', h('div', { class: 'screen ending' }, h('div', { class: 'panel box' },
    h('h2', {}, e.title),
    ...e.text.map((t) => h('p', {}, fill(t, s))),
    h('p', { class: 'muted' }, `${fmtDate(s.day)} · 교주 ${s.leader.name} · ${s.leader.cultName}`),
    kind === 'win' ? h('p', { class: 'muted' }, '2단계(성소 확장·간부·계열 혼합)는 아직 만들지 않았다.') : null,
    h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: () => { unmount('ending'); onTitle(); } }, '처음 화면으로')))));
}

export function showCredits(onClose) {
  const link = (url, text) => h('a', { href: url, target: '_blank', rel: 'noopener' }, text ?? url);
  mount('credits', h('div', { class: 'screen credits' }, h('div', { class: 'panel box' },
    h('h2', {}, '만든 사람들 · 에셋'),
    h('ul', {},
      h('li', {}, '동네 타일·사람 몸 틀: Kenney "RPG Urban Pack" (CC0) ', link('https://kenney.nl')),
      h('li', {}, '성소 실내: Kenney "Roguelike Indoors" (CC0)'),
      h('li', {}, '효과음: Kenney "RPG Audio", "Interface Sounds", "UI Audio", "Music Jingles" (CC0)'),
      h('li', {}, '글꼴: 갈무리 Galmuri (Lee Minseo, SIL OFL 1.1) ', link('https://github.com/quiple/galmuri')),
      h('li', {}, '엔진: Phaser 3 (MIT) · Vite (MIT)'),
      h('li', {}, '사람 30명의 머리·옷 색과 간판·현수막·역 출구 그림은 코드로 그렸다.'),
    ),
    h('p', { class: 'muted' }, '신림동·신림역·남부순환로·신림로·도림천은 실제 이름이다. 길 배치는 손으로 단순화했다. 가게·교회·절·점집·건물·인물·교단 이름은 전부 지어낸 것이다.'),
    h('p', { class: 'muted' }, '라이선스 원문: assets/LICENSES/'),
    h('div', { class: 'row end' }, h('button', { class: 'btn', onclick: () => { unmount('credits'); onClose(); } }, '닫기')))));
}

export function showMenu(app) {
  const close = () => { unmount('menu'); app.modalClosed(); };
  app.modalOpened();
  mount('menu', h('div', { class: 'screen' }, h('div', { class: 'panel box stack' },
    h('h2', {}, '메뉴'),
    h('p', { class: 'muted' }, `목표: 신도 ${GOAL.members}명 + 월세 ${GOAL.rentStreak}달 연속 (월세 ${won(SANCTUARY.rent)}, 일요일 밤). 자동 저장된다.`),
    h('p', { class: 'muted' }, 'PC: 방향키·WASD 이동, 스페이스·엔터 말 걸기, P 일시정지, 1·2 속도. 모바일: 가고 싶은 곳을 누르면 걸어간다. 사람을 누르면 프로필.'),
    h('button', { class: 'btn primary', onclick: close }, '계속하기'),
    h('button', { class: 'btn', onclick: () => { unmount('menu'); showCredits(() => app.modalClosed()); } }, '만든 사람들 · 에셋'),
    h('button', { class: 'btn', onclick: () => { unmount('menu'); app.toTitle(); } }, '처음 화면으로 (저장은 남는다)'))));
}
