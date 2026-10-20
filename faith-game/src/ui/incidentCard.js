import { choiceAvailable, textOf, resolveIncident } from '../story/storyEngine.js';
import { visibleChoices } from '../story/incidents.js';
import { odds } from '../story/words.js';
import { CAST } from '../story/cast.js';
import { dateLabel } from '../game/state.js';
import { esc } from './format.js';
import { stamp, sayLine } from './portrait.js';

// 사건 카드: 형식별 문서(단톡방·속보·문자·신문·녹취록·커뮤니티 글·공문) + 선택지 1~5개 → 결과 한 줄
// 선택지에는 등장인물 한마디. 정확한 효과는 (i)를 누르거나 길게 눌러야 보인다.

const who = (w, state) => (typeof w === 'string' ? CAST[w]?.short ?? w : w?.name ?? '');

const FORMATS = {
  chat(d, state) {
    return `<div class="doc doc-chat">
      <div class="chat-head"><span class="chat-back">‹</span><b>${esc(d.room)}</b><span class="chat-icons">☰</span></div>
      <div class="chat-body">${d.lines.map(([w, text, time]) => (w?.name === '시스템'
        ? `<p class="chat-system">${esc(text)}</p>`
        : `<div class="chat-line">${typeof w === 'string' ? stamp(w, { state, size: 30 }) : stamp(null, { name: w.name, size: 30 })}
            <div><small>${esc(who(w, state))}</small><p class="chat-bubble">${esc(text)}</p></div>${time ? `<time>${esc(time)}</time>` : ''}</div>`)).join('')}</div>
      <div class="chat-capture">캡처 · ${dateLabel(state.turn)}</div>
    </div>`;
  },
  news(d) {
    return `<div class="doc doc-news">
      <div class="news-screen"><span class="news-channel">${esc(d.channel)}</span><span class="news-live">LIVE</span></div>
      <div class="news-banner"><span>${esc(d.banner)}</span><b>${esc(d.headline)}</b></div>
      <div class="news-ticker"><span>${esc(d.ticker)}</span></div>
    </div>`;
  },
  sms(d, state) {
    return `<div class="doc doc-sms">
      <div class="sms-head">${d.who ? stamp(d.who, { state, size: 30 }) : '<span class="sms-avatar">✉</span>'}<div><b>${esc(d.from)}</b>${d.number ? `<small>${esc(d.number)}</small>` : ''}</div></div>
      <div class="sms-body">${d.lines.map((l) => `<p class="sms-bubble">${esc(l)}</p>`).join('')}<time>${esc(d.time)}</time></div>
    </div>`;
  },
  paper(d) {
    return `<div class="doc doc-paper">
      <div class="paper-mast"><b>${esc(d.masthead)}</b><small>${esc(d.date)}</small></div>
      <h3 class="paper-head">${esc(d.headline)}</h3>
      <p class="paper-sub">${esc(d.sub)}</p>
      <p class="paper-body">${esc(d.body)}</p>
    </div>`;
  },
  minutes(d, state) {
    return `<div class="doc doc-minutes">
      <div class="minutes-title">${esc(d.title)}</div>
      ${d.lines.map(([w, text]) => (text
        ? `<p><span class="minutes-who">${esc(who(w, state))}</span>${esc(text)}</p>`
        : `<p class="minutes-note">${esc(who(w, state))}</p>`)).join('')}
    </div>`;
  },
  forum(d) {
    return `<div class="doc doc-forum">
      <div class="forum-board">${esc(d.board)}</div>
      <h3 class="forum-title">${esc(d.title)}</h3>
      <div class="forum-meta"><b>${esc(d.author)}</b><span>${esc(d.meta)}</span></div>
      <p class="forum-body">${esc(d.body)}</p>
      <div class="forum-comments">${d.comments.map(([nick, text]) => `<p><b>${esc(nick)}</b>${esc(text)}</p>`).join('')}</div>
    </div>`;
  },
  notice(d) {
    return `<div class="doc doc-notice">
      <div class="notice-org">${esc(d.org)}</div>
      <dl><dt>수신</dt><dd>${esc(d.to)}</dd><dt>제목</dt><dd>${esc(d.subject)}</dd></dl>
      ${d.body.map((l) => `<p>${esc(l)}</p>`).join('')}
      <div class="notice-stamp"><span>${esc(d.org)}</span><b>${esc(d.stamp)}</b></div>
    </div>`;
  },
};

export function showIncident(state, card, ctx, { onDone } = {}) {
  const doc = card.doc(state, ctx);
  const choices = visibleChoices(state, card, ctx);
  const overlay = document.createElement('div');
  overlay.className = `overlay incident is-${card.format}`;
  overlay.innerHTML = `
    <div class="incident-sheet" role="dialog" aria-modal="true" aria-label="${esc(card.title)}">
      <div class="incident-tag"><span>${esc(card.kicker)}</span>${esc(dateLabel(state.turn))}</div>
      ${FORMATS[card.format](doc, state)}
      <div class="incident-body">
        <div class="incident-choices ${choices.length === 1 ? 'is-forced' : ''}">${choices.map((c) => {
          const ok = choiceAvailable(state, c);
          const cost = c.cost ? c.cost(state) : 0;
          const chance = c.odds ? odds(c.odds(state, ctx)) : null;
          return `<button class="incident-choice ${c.visible ? 'is-hidden-choice' : ''}" data-choice="${c.id}" ${ok === true ? '' : 'disabled'}>
            <span class="rv-info" data-info role="button" tabindex="0" aria-label="정확한 효과 보기">i</span>
            <b>${esc(textOf(state, c.label, ctx))}</b>
            ${sayLine(textOf(state, c.say, ctx), state)}
            <span class="incident-fx">${esc(textOf(state, c.effectText, ctx))}</span>
            <span class="incident-meta">${c.visible ? '<em class="secret">숨은 선택</em>' : ''}${chance ? `<em class="odds tone-${chance.tone}">${chance.label}</em>` : ''}${cost ? `<em class="cost"><i class="faith-mark"></i>${cost}</em>` : ''}${c.dark ? `<em class="shadow">그림자 ${'●'.repeat(Math.min(4, c.dark))}</em>` : ''}${ok === true ? '' : `<em class="lock">${esc(ok)}</em>`}</span>
          </button>`;
        }).join('')}</div>
        ${choices.length === 1 ? '<p class="incident-forced">고를 수 있는 게 이것뿐이다.</p>' : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const body = overlay.querySelector('.incident-body');

  // (i) 또는 길게 누르기: 효과 펼치기
  let timer = null, held = false;
  body.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.incident-choice');
    if (!b || e.target.closest('[data-info]')) return;
    held = false;
    timer = setTimeout(() => { held = true; b.classList.toggle('show-fx'); }, 480);
  });
  body.addEventListener('pointerup', () => clearTimeout(timer));
  body.addEventListener('pointerleave', () => clearTimeout(timer));

  body.addEventListener('click', (e) => {
    const info = e.target.closest('[data-info]');
    if (info) { info.closest('.incident-choice').classList.toggle('show-fx'); return; }
    if (held) { held = false; return; }
    const b = e.target.closest('[data-choice]');
    if (!b || b.disabled) return;
    const picked = choices.find((c) => c.id === b.dataset.choice);
    const { outcome } = resolveIncident(state, card, ctx, b.dataset.choice);
    body.innerHTML = `<div class="incident-result"><small>${esc(textOf(state, picked.label, ctx))}</small><p class="incident-outcome">${esc(outcome)}</p></div>
      <div class="incident-foot"><button class="btn btn-primary" data-ok>다음 일로</button></div>`;
    body.querySelector('[data-ok]').addEventListener('click', () => {
      overlay.classList.add('is-leaving');
      setTimeout(() => { overlay.remove(); onDone?.(); }, 250);
    });
  });
}

