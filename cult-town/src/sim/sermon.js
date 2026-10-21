// 예배 미니게임 (24장 D-1): 손패 4장 중 3장을 순서대로 → 분위기 게이지 → 점수 0~1 → holdWorship(s, { sermon })
// 게임 난수를 쓰지 않는다 (손패·얼굴은 날짜로 정해진다).
import { SERMON } from '../config.js';
import { SERMON_CARDS } from '../data/sermons.js';
import { topNeeds } from './residents.js';
import { districtOf } from '../data/residents.js';

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
};

// 오늘 예배에 앉을 이름 있는 사람 (봉천동 사람은 지부로)
export const sermonAudience = (s) => s.attend.filter((id) => ['visitor', 'newcomer', 'member'].includes(s.res[id].stage) && districtOf(id) === 'sillim');

export function dealHand(s) {
  const deck = [...SERMON_CARDS[s.leader.sect]];
  deck.sort((a, b) => hash(`${s.seed}:${s.day}:${a.id}`) - hash(`${s.seed}:${s.day}:${b.id}`));
  return deck.slice(0, SERMON.hand);
}

// 시작 얼굴: 의심 큰 사람 · 젊고 아직 덜 친한 사람(폰) · 아주 친한 사람(감동) · 나머지 졸음
export function startFaces(s, ids) {
  const out = {};
  for (const id of ids) {
    const st = s.res[id];
    out[id] = st.sus >= 35 ? 'doubt' : st.like >= 75 ? 'moved' : hash(`${s.day}:${id}:face`) < 0.5 ? 'phone' : 'sleepy';
  }
  return out;
}

// 카드 한 장의 효과: 고민이 맞는 사람은 감동, 흐름이 이어지면 덤
export function playCard(s, ids, faces, card, prev) {
  const hit = ids.filter((id) => topNeeds(s.res[id])[0] === card.need);
  for (const id of hit) faces[id] = 'moved';
  const share = ids.length ? hit.length / ids.length : 0;
  const flow = prev && prev.tag === card.tag ? 1 : 0;
  return { hit, gain: share * SERMON.needWeight + flow * SERMON.flow + (ids.length ? 0 : 10), flow: !!flow };
}

// 카드 순서 전체 점수 (0~1)
export function scoreSermon(s, cards) {
  const ids = sermonAudience(s);
  const faces = startFaces(s, ids);
  let gauge = 20; let prev = null;
  for (const c of cards) { gauge += playCard(s, ids, faces, c, prev).gain; prev = c; }
  return Math.max(0, Math.min(1, gauge / 100));
}

// 봇: 손패에서 가장 좋은 순서 (4P3 = 24가지)
export function bestSermon(s) {
  const hand = dealHand(s);
  let best = { score: -1, cards: [] };
  for (const a of hand) for (const b of hand) for (const c of hand) {
    if (a === b || b === c || a === c) continue;
    const sc = scoreSermon(s, [a, b, c]);
    if (sc > best.score) best = { score: sc, cards: [a, b, c] };
  }
  return best;
}
