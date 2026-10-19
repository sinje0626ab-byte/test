import { INCIDENTS, ALERT } from '../config.js';
import { CHAPTERS } from './chapters.js';
import { INCIDENT_CARDS, CARD_BY_ID } from './incidents.js';
import { addRisk } from '../game/watch.js';
import { randInt, pickWeighted } from '../game/rng.js';
import { totalFollowers } from '../game/state.js';

// 계시와 사건 카드의 등장 판정·적용. DOM 을 모른다 (시뮬레이터가 그대로 쓴다).

// ── 계시 ──

// 지금 등장해야 할 계시 (없으면 null). 순서대로 하나씩.
export function dueRevelation(state) {
  if (state.result) return null;
  for (const ch of CHAPTERS) {
    if (state.story.done[ch.id]) continue;
    if (ch.trigger(state)) return ch;
  }
  return null;
}

// 선택지를 지금 고를 수 있는지: true 또는 사유 문자열
export function choiceAvailable(state, choice) {
  return choice.available ? choice.available(state) : true;
}

export const textOf = (state, v) => (typeof v === 'function' ? v(state) : v ?? '');

// 계시 적용. picks[i] 는 parts[i] 의 답 (choice: id 배열, text: 문자열, country: 나라 id)
export function resolveRevelation(state, chapter, picks) {
  let dark = 0;
  chapter.parts.forEach((part, i) => {
    if (part.kind !== 'choice') return;
    const ids = picks[i];
    if (!Array.isArray(ids) || ids.length !== part.pickCount) throw new Error(`계시 ${chapter.id}: 선택 개수가 맞지 않습니다`);
    for (const id of ids) {
      const c = part.choices.find((x) => x.id === id);
      if (!c) throw new Error(`계시 ${chapter.id}: 없는 선택지 ${id}`);
      if (choiceAvailable(state, c) !== true) throw new Error(`계시 ${chapter.id}: 고를 수 없는 선택지 ${id}`);
      dark += c.dark ?? 0;
    }
  });
  addRisk(state, dark);
  const result = chapter.apply(state, picks) ?? {};
  state.story.done[chapter.id] = { turn: state.turn, picks, outcome: result.outcome ?? null, dark };
  state.story.log.push({ kind: 'revelation', id: chapter.id, numeral: chapter.numeral, title: chapter.title, turn: state.turn, lines: result.lines ?? [], outcome: result.outcome ?? null, dark });
  return result;
}

// ── 사건 카드 ──

export function scheduleIncident(state) {
  state.incidents.next = state.turn + randInt(state, INCIDENTS.minGap, INCIDENTS.maxGap);
}

// 이번 턴에 나올 사건 카드 (없으면 null). report.warnings 가 있으면 경고장이 먼저.
export function dueIncident(state, report = null) {
  if (state.result || !state.story.done.III) return null;
  const lastWarn = state.incidents.lastWarning ?? -999;
  if (report?.warnings?.length && state.turn - lastWarn >= ALERT.warnGap) {
    const warn = report.warnings
      .filter((id) => id === state.religion.home || state.countries[id].followers >= ALERT.warnMinFollowers)
      .sort((a, b) => state.countries[b].alert - state.countries[a].alert)[0];
    if (warn) {
      state.incidents.lastWarning = state.turn;
      return { card: CARD_BY_ID.warning, ctx: { country: warn } };
    }
  }
  if (state.incidents.next == null) scheduleIncident(state);
  if (state.turn < Math.max(INCIDENTS.firstTurn, state.incidents.next)) return null;
  const pool = [];
  for (const card of INCIDENT_CARDS) {
    const seen = state.incidents.seen[card.id];
    if (seen != null && state.turn - seen < INCIDENTS.cardCooldown) continue;
    if (!card.when(state)) continue;
    const ctx = card.context ? card.context(state) : {};
    if (!ctx) continue;
    pool.push({ item: { card, ctx }, weight: card.weight(state, ctx) });
  }
  const picked = pickWeighted(state, pool);
  if (!picked) scheduleIncident(state);
  return picked;
}

export function resolveIncident(state, card, ctx, choiceId) {
  const choice = card.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error(`사건 ${card.id}: 없는 선택지 ${choiceId}`);
  if (choiceAvailable(state, choice) !== true) throw new Error(`사건 ${card.id}: 고를 수 없는 선택지 ${choiceId}`);
  addRisk(state, choice.dark ?? 0);
  const outcome = choice.apply(state, ctx) ?? '';
  state.incidents.seen[card.id] = state.turn;
  scheduleIncident(state);
  state.incidents.log.push({ id: card.id, turn: state.turn, choice: choiceId });
  state.story.log.push({ kind: 'incident', id: card.id, title: card.title, kicker: card.kicker, turn: state.turn, lines: [choice.label], outcome, dark: choice.dark ?? 0 });
  return { outcome };
}

// 연대기용 요약
export function chronicle(state) {
  return state.story.log.slice().map((e) => ({ ...e, followers: totalFollowers(state) }));
}
