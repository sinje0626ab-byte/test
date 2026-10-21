// 주민 사연 3단계와 작은 부탁. 상태: s.res[id].story = { done, favor }
//   favor: { stage, type, item|to|place, relayed, visited } (받아 둔 부탁)
import { STORY } from '../config.js';
import { STORIES } from '../data/stories.js';
import { ITEMS } from '../data/items.js';
import { clamp } from './leader.js';

export const storyOf = (s, id) => s.res[id].story ?? (s.res[id].story = { done: 0, favor: null });

// 지금 들을 수 있는 사연 단계 (없으면 -1)
export function storyReady(s, id) {
  const st = storyOf(s, id);
  if (st.favor || st.done >= (STORIES[id]?.length ?? 0)) return -1;
  return s.res[id].like >= STORY.unlockLike[st.done] ? st.done : -1;
}

// 사연 듣기 → 부탁을 받아 둔다
export function hearStory(s, id) {
  const st = storyOf(s, id);
  const k = st.done;
  const beat = STORIES[id][k];
  st.favor = { stage: k, type: beat.favor.type, item: beat.favor.item, to: beat.favor.to, place: beat.favor.place, relayed: false, visited: false };
  s.res[id].like = clamp(s.res[id].like + STORY.listenLike);
  return beat;
}

// 부탁을 끝낼 수 있나 (그 주민에게 돌아가서 알리기 전 조건)
export function favorReady(s, id) {
  const f = storyOf(s, id).favor;
  if (!f) return false;
  if (f.type === 'item') return (s.inventory[f.item] ?? 0) > 0;
  if (f.type === 'deliver') return f.relayed;
  if (f.type === 'place') return f.visited;
  return false;
}

export function completeFavor(s, id) {
  const st = storyOf(s, id);
  const f = st.favor;
  const beat = STORIES[id][f.stage];
  if (f.type === 'item') s.inventory[f.item]--;
  st.favor = null;
  st.done++;
  const r = s.res[id];
  r.like = clamp(r.like + STORY.doneLike);
  r.sus = clamp(r.sus + STORY.doneSus);
  s.week.favors = (s.week.favors ?? 0) + 1;
  return beat;
}

// 이 주민에게 전해야 할 말 (다른 사람의 deliver 부탁)
export function relaysFor(s, id) {
  return Object.keys(s.res).filter((o) => { const f = s.res[o].story?.favor; return f && f.type === 'deliver' && f.to === id && !f.relayed; });
}
export function doRelay(s, fromId, toId) {
  const f = storyOf(s, fromId).favor;
  f.relayed = true;
  s.res[toId].like = clamp(s.res[toId].like + STORY.relayLike);
  return STORIES[fromId][f.stage].favor.relay;
}

// 장소 부탁: 교주가 그 장소 입구에 가면 (app 이 부른다). 반환: 끝낸 부탁 목록
export function visitPlace(s, place) {
  const done = [];
  for (const id of Object.keys(s.res)) {
    const f = s.res[id].story?.favor;
    if (f && f.type === 'place' && f.place === place && !f.visited) { f.visited = true; done.push({ id, note: STORIES[id][f.stage].favor.note }); }
  }
  return done;
}

// 받아 둔 부탁 목록 (화면용)
export function questList(s) {
  const out = [];
  for (const id of Object.keys(s.res)) {
    const f = s.res[id].story?.favor;
    if (!f) continue;
    const beat = STORIES[id][f.stage];
    let what = '';
    if (f.type === 'item') what = `${ITEMS[f.item].name} 갖다주기${(s.inventory[f.item] ?? 0) > 0 ? ' (가지고 있다)' : ''}`;
    if (f.type === 'deliver') what = f.relayed ? '말 전했음 → 알려 주기' : '말 전하기';
    if (f.type === 'place') what = f.visited ? '다녀왔음 → 알려 주기' : '다녀오기';
    out.push({ id, title: beat.title, type: f.type, to: f.to, place: f.place, item: f.item, what, ready: favorReady(s, id) });
  }
  return out;
}

// 가게에서 사기
export function buyItem(s, item) {
  const it = ITEMS[item];
  if (s.leader.money < it.price) return false;
  s.leader.money -= it.price;
  s.inventory[item] = (s.inventory[item] ?? 0) + 1;
  return true;
}
