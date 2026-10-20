// 제목 화면과 교단 창시 화면 (교주 이름 → 나이 → 계열 → 유형 → 교단 이름 → 확인). 모든 단계에 '이전' 버튼.
import { GAME } from '../config.js';
import { FAMILIES, SECTS, sectsOf } from '../data/sects.js';
import { h, mount, unmount } from './dom.js';
import { josa } from './text.js';
import { play } from './sound.js';

export function showTitle({ hasSave, onNew, onContinue, onCredits }) {
  const panel = h('div', { class: 'panel box stack' },
    hasSave ? h('button', { class: 'btn primary', onclick: () => { play('confirm'); onContinue(); } }, '이어 하기') : null,
    h('button', { class: `btn ${hasSave ? '' : 'primary'}`, onclick: () => { play('click'); onNew(); } }, hasSave ? '처음부터 (저장 지움)' : '새로 시작'),
    h('button', { class: 'btn', onclick: () => { play('click'); onCredits(); } }, '만든 사람들 · 에셋'),
    h('p', { class: 'muted', style: 'font-size:12px;margin:6px 0 0' }, '이 게임의 교단·인물·가게 이름은 전부 지어낸 것이다. 실존 단체와 관계없다.'),
  );
  mount('title', h('div', { class: 'screen title' },
    h('div', {},
      h('div', { class: 'logo' }, GAME.title || '신림동 교주'),
      h('div', { class: 'sub' }, '신림역 3번 출구, 상가 302호에서 시작하는 블랙코미디'),
      panel,
    ),
  ));
}
export const hideTitle = () => unmount('title');

const FAMILY_DESC = {
  christian: '교회 같은 말투와 모임. 교회 다니는 주민과 말이 잘 통하지만, 목사님이 지켜본다.',
  buddhist: '절 같은 말투와 모임. 절에 다니는 주민과 말이 잘 통하지만, 스님이 지켜본다.',
  folk: '점집 같은 말투와 모임. 점집 단골 주민과 말이 잘 통하지만, 만신이 지켜본다.',
};

export function showCreation(onDone, onBack) {
  const pick = { name: '', age: GAME.startAge.default, family: null, sect: null, cultName: '' };
  const steps = ['name', 'age', 'family', 'sect', 'cult', 'confirm'];
  let i = 0;

  const render = () => {
    const step = steps[i];
    const body = [];
    const next = (ok = true) => h('button', { class: 'btn primary', disabled: !ok, onclick: () => { play('click'); i++; render(); } }, '다음');
    const prev = h('button', { class: 'btn', onclick: () => { play('click'); if (i === 0) { unmount('creation'); onBack(); } else { i--; render(); } } }, '이전');

    if (step === 'name') {
      const input = h('input', { maxlength: 8, value: pick.name, placeholder: '예: 김정수', autocomplete: 'off' });
      const go = h('button', { class: 'btn primary', disabled: !pick.name.trim(), onclick: () => { play('click'); i++; render(); } }, '다음');
      input.addEventListener('input', () => { pick.name = input.value.trim(); go.disabled = !pick.name; });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && pick.name) { i++; render(); } });
      body.push(h('h2', {}, '교주가 될 사람의 이름'),
        h('p', { class: 'muted' }, '평범한 사람이다. 지난달까지 학원 셔틀버스를 몰았다.'),
        h('div', { class: 'field' }, input), h('div', { class: 'row between' }, prev, go));
      setTimeout(() => input.focus(), 30);
    } else if (step === 'age') {
      const out = h('b', { class: 'num' }, `${pick.age}살`);
      const range = h('input', { type: 'range', min: GAME.startAge.min, max: GAME.startAge.max, value: pick.age });
      range.addEventListener('input', () => { pick.age = Number(range.value); out.textContent = `${pick.age}살`; });
      body.push(h('h2', {}, `${josa(pick.name, '은/는')} 몇 살인가`),
        h('p', { class: 'muted' }, '엄마는 나이에 스물일곱을 더한 만큼이다. 오랜 친구는 동갑.'),
        h('div', { class: 'field' }, out, range), h('div', { class: 'row between' }, prev, next()));
    } else if (step === 'family') {
      body.push(h('h2', {}, '어떤 쪽 흉내를 낼까'),
        h('p', { class: 'muted' }, '세 계열 모두 규칙은 같다. 같은 계열 주민과 말이 잘 통하는 대신 그 종교의 성직자가 먼저 알아챈다.'),
        h('div', { class: 'choice' }, Object.entries(FAMILIES).map(([id, f]) =>
          h('button', { class: `btn ${pick.family === id ? 'on' : ''}`, onclick: () => { play('select'); if (pick.family !== id) pick.sect = null; pick.family = id; render(); } },
            f.name, h('small', {}, FAMILY_DESC[id])))),
        h('div', { class: 'row between', style: 'margin-top:10px' }, prev, next(!!pick.family)));
    } else if (step === 'sect') {
      body.push(h('h2', {}, `${FAMILIES[pick.family].name}: 어떤 유형`),
        h('div', { class: 'choice' }, sectsOf(pick.family).map((id) => {
          const s = SECTS[id];
          return h('button', { class: `btn ${pick.sect === id ? 'on' : ''}`, onclick: () => { play('select'); pick.sect = id; if (!pick.cultName) pick.cultName = ''; render(); } },
            s.name, h('small', {}, s.pitch), h('small', {}, `강점: ${s.good}`), h('small', {}, `약점: ${s.bad}`), h('small', {}, `잘 통하는 사람: ${s.fits}`));
        })),
        h('div', { class: 'row between', style: 'margin-top:10px' }, prev, next(!!pick.sect)));
    } else if (step === 'cult') {
      const sample = SECTS[pick.sect].sample;
      const input = h('input', { maxlength: 12, value: pick.cultName, placeholder: `예: ${sample}`, autocomplete: 'off' });
      const go = h('button', { class: 'btn primary', onclick: () => { play('click'); pick.cultName = input.value.trim() || sample; i++; render(); } }, '다음');
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go.click(); });
      body.push(h('h2', {}, '교단 이름'),
        h('p', { class: 'muted' }, `비워 두면 "${sample}". 현수막과 주보에 이 이름이 들어간다.`),
        h('div', { class: 'field' }, input), h('div', { class: 'row between' }, prev, go));
      setTimeout(() => input.focus(), 30);
    } else if (step === 'confirm') {
      const s = SECTS[pick.sect];
      body.push(h('h2', {}, pick.cultName),
        h('p', {}, `교주 ${pick.name} (${pick.age}살) · ${FAMILIES[pick.family].name} ${s.name}`),
        h('p', { class: 'muted' }, `모임은 "${s.terms.worship}", 모이는 사람은 "${s.terms.member}", 302호는 "${s.terms.place}"라고 부른다.`),
        h('p', {}, '목표: 신도 30명, 월세 석 달 연속 납부. 한 달은 7일로 센다. 월세는 일요일 밤.'),
        h('p', { class: 'muted' }, '첫 신도는 세 명이다. 엄마, 오랜 친구, 그리고 화장실을 찾다 들어온 사람.'),
        h('div', { class: 'row between' }, prev, h('button', { class: 'btn primary', onclick: () => { play('confirm'); unmount('creation'); onDone({ ...pick }); } }, '302호 문 열기')));
    }
    mount('creation', h('div', { class: 'screen' },
      h('div', { class: 'panel box' }, h('div', { class: 'steps' }, `${i + 1} / ${steps.length}`), ...body)));
  };
  render();
}
