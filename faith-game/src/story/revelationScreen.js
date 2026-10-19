import { world } from '../data/loader.js';
import { difficulty } from '../religion/spread.js';
import { choiceAvailable, textOf, resolveRevelation } from './storyEngine.js';
import { esc, people } from '../ui/format.js';
import { flagImg } from '../ui/flags.js';

// 계시 연출: 암전 → 위에서 빛줄기 → 먼지 입자 → 번호·제목 → 내레이션 한 줄씩 → 질문과 선택지
// 선택을 마치면 storyEngine.resolveRevelation 으로 적용하고, 결과 문장을 보여 준 뒤 닫는다.
// onDone(result, picks) 는 화면이 완전히 사라진 뒤 불린다.
// '이전': 같은 계시 안에서는 앞 질문으로 돌아가고(고른 답은 남아 있다),
//         첫 질문에서 누르면 onBack() — 계시를 적용하지 않고 닫는다 (onBack 이 없으면 버튼 없음).
// quick: 이전으로 돌아와 다시 여는 경우 — 내레이션을 기다리지 않고 바로 보여 준다.
// picks: 그때 골랐던 답 — 마지막 질문부터 다시 열고 답을 미리 채운다.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? Math.min(ms, 60) : ms));

const BACK = Symbol('back');

export function showRevelation(state, chapter, { onDone, onBack, quick = false, picks: initial = null } = {}) {
  const root = document.createElement('div');
  root.className = 'revelation';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `계시 ${chapter.numeral} · ${chapter.title}`);
  root.innerHTML = `
    <div class="rv-dark"></div>
    <div class="rv-beam" aria-hidden="true"><div class="rv-ray"><i></i></div><div class="rv-ray rv-ray-core"><i></i></div></div>
    <div class="rv-pool" aria-hidden="true"></div>
    <canvas class="rv-dust" aria-hidden="true"></canvas>
    <div class="rv-scroll">
      <div class="rv-content">
        <div class="rv-numeral">계시 ${esc(chapter.numeral)}</div>
        <h1 class="rv-title">${esc(chapter.title)}</h1>
        <div class="rv-narration">${chapter.narration.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
        <div class="rv-stage"></div>
        <button class="rv-skip" type="button">눌러서 넘기기</button>
      </div>
    </div>
    <button class="rv-back" type="button" hidden aria-label="이전으로">‹ 이전</button>`;
  document.body.appendChild(root);
  document.body.classList.add('is-revelation');
  const $ = (s) => root.querySelector(s);
  const stage = $('.rv-stage');
  const dust = startDust($('.rv-dust'));

  let skip = false;
  const skipBtn = $('.rv-skip');
  const revealAll = () => {
    skip = true;
    root.classList.add('is-lit');
    root.querySelectorAll('.rv-numeral, .rv-title, .rv-narration p').forEach((el) => el.classList.add('is-in'));
  };
  root.addEventListener('click', (e) => {
    if (e.target.closest('.rv-stage')) return;
    if (!stage.childElementCount) revealAll();
  });
  skipBtn.addEventListener('click', revealAll);

  const picks = initial ? [...initial] : [];
  const backBtn = $('.rv-back');
  const ctl = { resolve: null };
  backBtn.addEventListener('click', () => {
    backBtn.hidden = true;
    ctl.resolve?.(BACK);
  });

  const close = async () => {
    root.classList.add('is-leaving');
    dust.stop();
    await wait(quick ? 500 : 900);
    root.remove();
    document.body.classList.remove('is-revelation');
  };

  (async () => {
    if (quick) revealAll();
    // 암전 → 빛
    await wait(quick ? 200 : 800);
    root.classList.add('is-lit');
    await wait(skip ? 0 : 1400);
    $('.rv-numeral').classList.add('is-in');
    await wait(skip ? 0 : 900);
    $('.rv-title').classList.add('is-in');
    await wait(skip ? 0 : 1000);
    for (const p of root.querySelectorAll('.rv-narration p')) {
      p.classList.add('is-in');
      if (!skip) await wait(1250);
    }
    skipBtn.hidden = true;
    await wait(skip ? 200 : 500);

    for (let i = initial ? Math.max(0, Math.min(initial.length, chapter.parts.length) - 1) : 0; i < chapter.parts.length;) {
      backBtn.hidden = !(i > 0 || onBack);
      const answer = await askPart(state, chapter.parts[i], stage, picks[i], ctl);
      if (answer === BACK) {
        if (i === 0) {
          await close();
          onBack();
          return;
        }
        i -= 1;
        continue;
      }
      picks[i] = answer;
      i += 1;
    }
    backBtn.hidden = true;
    const result = resolveRevelation(state, chapter, picks);
    await showOutcome(stage, chapter, result);
    await close();
    onDone?.(result, picks);
  })();

  return { el: root };
}

// ── 질문 하나 ──
// prev: 이전으로 돌아왔을 때 앞서 고른 답 (미리 채워 둔다)
function askPart(state, part, stage, prev, ctl) {
  return new Promise((done) => {
    const resolve = (v) => { ctl.resolve = null; done(v); };
    ctl.resolve = resolve;
    stage.innerHTML = `<p class="rv-question">${esc(part.question)}</p><div class="rv-answer"></div>`;
    const answer = stage.querySelector('.rv-answer');
    requestAnimationFrame(() => stage.querySelector('.rv-question').classList.add('is-in'));
    if (part.kind === 'choice') return askChoice(state, part, answer, resolve, prev);
    if (part.kind === 'text') return askText(part, answer, resolve, prev);
    if (part.kind === 'country') return askCountry(answer, resolve, prev);
    resolve(null);
  });
}

function choiceCard(state, c) {
  const ok = choiceAvailable(state, c);
  const cost = c.cost ? c.cost(state) : 0;
  const shadow = c.dark ? `<span class="rv-shadow" title="그림자 장부에 남는다">${'●'.repeat(Math.min(4, c.dark))} 그림자</span>` : '';
  return `<button class="rv-card" data-choice="${c.id}" ${ok === true ? '' : 'disabled'}>
    <b>${esc(c.label)}</b>
    <span class="rv-flavor">${esc(c.flavor ?? '')}</span>
    <span class="rv-effect">${esc(textOf(state, c.effectText))}</span>
    <span class="rv-meta">${cost ? `<span class="rv-cost">신앙력 ${cost}</span>` : ''}${shadow}${ok === true ? '' : `<span class="rv-lock">${esc(ok)}</span>`}</span>
  </button>`;
}

function askChoice(state, part, answer, resolve, prev) {
  const multi = part.pickCount > 1;
  answer.innerHTML = `<div class="rv-cards ${part.choices.length > 4 ? 'is-many' : ''}">${part.choices.map((c) => choiceCard(state, c)).join('')}</div>
    ${multi ? `<div class="rv-confirm"><span class="rv-count">0 / ${part.pickCount}</span><button class="rv-btn" data-confirm disabled>울타리를 세운다</button></div>` : ''}`;
  const cards = [...answer.querySelectorAll('.rv-card')];
  cards.forEach((el, i) => setTimeout(() => el.classList.add('is-in'), reduced() ? 0 : 120 * i));
  const chosen = new Set(multi && Array.isArray(prev) ? prev : []);
  const syncPicked = () => {
    cards.forEach((el) => el.classList.toggle('is-picked', chosen.has(el.dataset.choice) || (!multi && prev?.includes?.(el.dataset.choice))));
    if (multi) {
      answer.querySelector('.rv-count').textContent = `${chosen.size} / ${part.pickCount}`;
      answer.querySelector('[data-confirm]').disabled = chosen.size !== part.pickCount;
    }
  };
  syncPicked();

  const finish = async (ids) => {
    answer.closest('.revelation').querySelector('.rv-back').hidden = true;
    answer.classList.add('is-decided');
    cards.forEach((el) => el.classList.toggle('is-chosen', ids.includes(el.dataset.choice)));
    await wait(1300);
    resolve(ids);
  };

  answer.addEventListener('click', (e) => {
    if (answer.classList.contains('is-decided')) return;
    const card = e.target.closest('.rv-card');
    if (card && !card.disabled) {
      const id = card.dataset.choice;
      if (!multi) return finish([id]);
      if (chosen.has(id)) chosen.delete(id);
      else if (chosen.size < part.pickCount) chosen.add(id);
      syncPicked();
      return;
    }
    if (e.target.closest('[data-confirm]') && chosen.size === part.pickCount) finish([...chosen]);
  });
}

function askText(part, answer, resolve, prev) {
  answer.innerHTML = `<form class="rv-form"><input class="rv-input" maxlength="${part.maxLength ?? 20}" placeholder="${esc(part.placeholder ?? '')}" value="${esc(prev ?? '')}" autocomplete="off" aria-label="${esc(part.question)}"><button class="rv-btn" ${prev ? '' : 'disabled'}>새긴다</button></form>`;
  const form = answer.querySelector('form');
  const input = form.querySelector('input');
  const btn = form.querySelector('button');
  requestAnimationFrame(() => form.classList.add('is-in'));
  setTimeout(() => input.focus(), reduced() ? 0 : 500);
  input.addEventListener('input', () => { btn.disabled = !input.value.trim(); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    answer.closest('.revelation').querySelector('.rv-back').hidden = true;
    form.classList.add('is-decided');
    await wait(900);
    resolve(v);
  });
}

function askCountry(answer, resolve, prev) {
  let q = '';
  let chosen = world.countries[prev] ? prev : null;
  answer.innerHTML = `<div class="rv-countries">
      <input class="rv-input rv-search" type="search" placeholder="나라 또는 지역 검색" autocomplete="off" aria-label="나라 검색">
      <div class="rv-list" role="listbox" aria-label="나라"></div>
    </div>
    <div class="rv-confirm"><span class="rv-count">나라를 고르라</span><button class="rv-btn" data-confirm disabled>이 땅으로</button></div>`;
  const list = answer.querySelector('.rv-list');
  const render = () => {
    const ids = world.ids
      .filter((id) => !q || world.countries[id].name.includes(q) || world.countries[id].region.includes(q))
      .map((id) => ({ id, d: difficulty(id) }))
      .sort((a, b) => b.d.score - a.d.score);
    list.innerHTML = ids.map(({ id, d }) => {
      const c = world.countries[id];
      return `<button class="rv-country ${chosen === id ? 'is-picked' : ''}" data-id="${id}" role="option" aria-selected="${chosen === id}">
        ${flagImg(c, 'flag flag-md')}<span><b>${esc(c.name)}</b><small>${esc(c.region)} · 인구 ${people(c.pop)} · 종교 자유도 ${c.freedom}</small></span>
        <em class="rv-diff tone-${d.tone}">${d.label}</em></button>`;
    }).join('') || '<p class="rv-empty">그런 땅은 없다.</p>';
  };
  render();
  if (chosen) {
    answer.querySelector('.rv-count').textContent = world.countries[chosen].name;
    answer.querySelector('[data-confirm]').disabled = false;
    requestAnimationFrame(() => list.querySelector('.is-picked')?.scrollIntoView({ block: 'center' }));
  }
  requestAnimationFrame(() => answer.querySelector('.rv-countries').classList.add('is-in'));
  answer.querySelector('.rv-search').addEventListener('input', (e) => { q = e.target.value.trim(); render(); });
  answer.addEventListener('click', async (e) => {
    const row = e.target.closest('.rv-country');
    if (row) {
      chosen = row.dataset.id;
      list.querySelectorAll('.rv-country').forEach((el) => el.classList.toggle('is-picked', el === row));
      answer.querySelector('.rv-count').textContent = world.countries[chosen].name;
      answer.querySelector('[data-confirm]').disabled = false;
      return;
    }
    if (e.target.closest('[data-confirm]') && chosen) {
      answer.closest('.revelation').querySelector('.rv-back').hidden = true;
      answer.classList.add('is-decided');
      await wait(700);
      resolve(chosen);
    }
  });
}

// ── 결과·후기 ──
function showOutcome(stage, chapter, result) {
  const after = chapter.afterword;
  const hasText = result.outcome || after;
  if (!hasText) return wait(300);
  return new Promise((resolve) => {
    const memo = after && typeof after === 'object'
      ? `<div class="rv-memo"><h3>${esc(after.title)}</h3>${after.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>`
      : after ? `<p class="rv-after">${esc(after)}</p>` : '';
    stage.innerHTML = `${result.outcome ? `<p class="rv-outcome tone-${result.tone ?? 'plain'}">${esc(result.outcome)}</p>` : ''}${memo}
      <button class="rv-btn rv-continue">계속</button>`;
    stage.querySelectorAll('.rv-outcome, .rv-after, .rv-memo, .rv-continue').forEach((el, i) => setTimeout(() => el.classList.add('is-in'), reduced() ? 0 : 200 + 700 * i));
    stage.querySelector('.rv-continue').addEventListener('click', () => resolve(), { once: true });
  });
}

// ── 빛 속 먼지 입자 (canvas) ──
function startDust(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, raf = 0, running = true;
  const parts = [];
  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
  };
  resize();
  addEventListener('resize', resize);
  const N = Math.round(Math.min(110, w / 9));
  for (let i = 0; i < N; i++) {
    parts.push({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, vx: (Math.random() - 0.5) * 0.00012, vy: -0.00004 - Math.random() * 0.00012, tw: Math.random() * Math.PI * 2 });
  }
  const still = reduced();
  const draw = (t) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      if (!still) {
        p.x += p.vx + Math.sin(t / 3000 + p.tw) * 0.00006;
        p.y += p.vy;
        if (p.y < -0.02) { p.y = 1.02; p.x = 0.5 + (Math.random() - 0.5) * 0.6; }
      }
      // 빛줄기(위는 좁고 아래로 넓어짐) 안쪽일수록 밝게
      const half = 0.07 + p.y * 0.26;
      const inside = Math.max(0, 1 - Math.abs(p.x - 0.5) / half);
      const a = inside * (0.35 + 0.35 * Math.sin(t / 900 + p.tw * 3)) * (1 - p.y * 0.4);
      if (a <= 0.01) continue;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 238, 200, ${a.toFixed(3)})`;
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (running && !still) raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return { stop() { running = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); } };
}
