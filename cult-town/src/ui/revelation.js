// 성장 계시 연출 (faith-game 에서 가져옴): 암전 → 위에서 빛줄기 → 먼지 → 번호·제목 → 내레이션 한 줄씩 → 선택(종이 쪽지)
import { REVELATION_TEXT } from '../data/revelations.js';
import { CAST_BY_ID } from '../data/cast.js';
import { applyRevelation } from '../sim/revelation.js';
import { h, $ui } from './dom.js';
import { fill } from './text.js';
import { play } from './sound.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? Math.min(ms, 60) : ms));

export function showRevelation(s, id, onDone) {
  const R = REVELATION_TEXT[id];
  const stage = h('div', { class: 'rv-stage' });
  const narr = R.narration.map((l) => h('p', {}, fill(l, s)));
  const numeral = h('div', { class: 'rv-numeral' }, h('span', { class: 'rv-kicker' }, '계시'), h('span', { class: 'rv-num' }, R.numeral));
  const title = h('h1', { class: 'rv-title' }, R.title);
  const skip = h('button', { class: 'rv-skip' }, '한 번에 다 보기');
  const dust = h('canvas', { class: 'rv-dust' });
  const root = h('div', { class: 'revelation', role: 'dialog', 'aria-modal': 'true' },
    h('div', { class: 'rv-dark' }),
    h('div', { class: 'rv-beam' }, h('div', { class: 'rv-ray' }, h('i')), h('div', { class: 'rv-ray rv-ray-core' }, h('i'))),
    h('div', { class: 'rv-pool' }), dust,
    h('div', { class: 'rv-scroll' }, h('div', { class: 'rv-content' }, numeral, title, h('div', { class: 'rv-narration' }, narr), stage, skip)));
  $ui().append(root);
  const stopDust = startDust(dust);
  let fast = false;
  const revealAll = () => { fast = true; root.classList.add('is-lit'); [numeral, title, ...narr].forEach((el) => el.classList.add('is-in')); };
  skip.addEventListener('click', revealAll);
  play('jingle_week', 0.35);

  (async () => {
    await wait(700);
    root.classList.add('is-lit');
    await wait(fast ? 0 : 1300);
    numeral.classList.add('is-in');
    await wait(fast ? 0 : 800);
    title.classList.add('is-in');
    await wait(fast ? 0 : 900);
    for (const p of narr) { p.classList.add('is-in'); if (!fast) await wait(1200); }
    skip.remove();
    const picks = await ask(s, R, stage);
    const result = applyRevelation(s, id, picks);
    stage.replaceChildren(
      h('p', { class: `rv-outcome tone-${result.tone}` }, result.outcome),
      h('p', { class: 'rv-after' }, fill(R.afterword, s)),
    );
    const btn = h('button', { class: 'rv-btn' }, '고개를 끄덕인다');
    stage.append(btn);
    stage.querySelectorAll('.rv-outcome, .rv-after').forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 200 + 600 * i));
    btn.addEventListener('click', async () => {
      root.classList.add('is-leaving'); stopDust(); await wait(800); root.remove(); onDone();
    }, { once: true });
  })();
}

function ask(s, R, stage) {
  return new Promise((resolve) => {
    const chosen = new Set();
    const q = h('p', { class: 'rv-question' }, R.question);
    const count = h('span', { class: 'rv-count' }, `0 / ${R.pickCount}`);
    const confirm = h('button', { class: 'rv-btn', disabled: true }, '이걸로 정한다');
    const cards = R.choices.map((c) => {
      const who = CAST_BY_ID[c.say[0]];
      return h('button', { class: 'rv-card', 'data-id': c.id },
        h('b', {}, c.label), h('span', { class: 'rv-flavor' }, c.flavor),
        h('span', { class: 'say' }, h('b', {}, who.name), h('span', {}, c.say[1])),
        h('span', { class: 'rv-effect' }, c.effect),
        c.dark ? h('span', { class: 'rv-shadow' }, `그림자 ${'●'.repeat(c.dark)}`) : null);
    });
    const grid = h('div', { class: 'rv-cards' }, cards);
    stage.replaceChildren(q, grid, R.pickCount > 1 ? h('div', { class: 'rv-confirm' }, count, confirm) : null);
    requestAnimationFrame(() => q.classList.add('is-in'));
    cards.forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 150 * i));
    const finish = async () => {
      grid.classList.add('is-decided');
      cards.forEach((el) => el.classList.toggle('is-chosen', chosen.has(el.dataset.id)));
      play('confirm');
      await wait(1200);
      resolve([...chosen]);
    };
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.rv-card');
      if (!card || grid.classList.contains('is-decided')) return;
      const id = card.dataset.id;
      if (R.pickCount === 1) { chosen.add(id); finish(); return; }
      if (chosen.has(id)) chosen.delete(id); else if (chosen.size < R.pickCount) chosen.add(id);
      cards.forEach((el) => el.classList.toggle('is-picked', chosen.has(el.dataset.id)));
      count.textContent = `${chosen.size} / ${R.pickCount}`;
      confirm.disabled = chosen.size !== R.pickCount;
    });
    confirm.addEventListener('click', () => { if (chosen.size === R.pickCount) finish(); });
  });
}

// 빛 속 먼지 입자
function startDust(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0; let hh = 0; let raf = 0; let running = true;
  const resize = () => { w = canvas.clientWidth; hh = canvas.clientHeight; canvas.width = w; canvas.height = hh; };
  resize();
  const parts = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6, vy: -0.00005 - Math.random() * 0.0001, tw: Math.random() * 6 }));
  const draw = (t) => {
    ctx.clearRect(0, 0, w, hh);
    for (const p of parts) {
      p.y += p.vy; if (p.y < -0.02) { p.y = 1.02; p.x = 0.5 + (Math.random() - 0.5) * 0.6; }
      const half = 0.07 + p.y * 0.26;
      const a = Math.max(0, 1 - Math.abs(p.x - 0.5) / half) * (0.35 + 0.35 * Math.sin(t / 900 + p.tw));
      if (a < 0.02) continue;
      ctx.fillStyle = `rgba(255,238,200,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x * w, p.y * hh, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (running && !reduced()) raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => { running = false; cancelAnimationFrame(raf); };
}
