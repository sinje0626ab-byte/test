// 길에서 (29장 B·C): 교주 감정 표현에 대한 주민 반응 · 밖에서 만난 신도의 인사·모른 척 · 열혈 신자 따라오기 · 신도끼리 인사.
// 상태: s.street = { last, greeted{id:day}, liked{id:day}, follow[ids], met{pair:day}, rel[[a,b,kind]], pressDay }
// 말풍선 고르기는 게임 난수(s.rng)를 쓰지 않는다 (시뮬레이터 결과가 그대로다). 봇은 이 파일을 부르지 않는다.
import { STREET } from '../config.js';
import { EMOTES, DISMISS, EMOTE_SAY, REACT, GREET, IGNORE, SECRECY, FOLLOW, MEMBER_MEET } from '../data/street.js';
import { RESIDENT_BY_ID, RELATIONS } from '../data/residents.js';
import { VOICES } from '../data/voices/index.js';
import { SECTS } from '../data/sects.js';
import { clamp, josaFix } from './leader.js';
import { levelOf } from './growth.js';
import { isZealot } from './zealots.js';
import { sanctuaryName } from './voice.js';

const PUSHY = ['chatty', 'blunt', 'loud', 'stubborn', 'tough', 'cheerful', 'simple'];
export const streetOf = (s) => (s.street ??= { last: null, greeted: {}, liked: {}, follow: [], met: {}, rel: [], pressDay: -1 });
const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
const pickLine = (list, salt) => list[Math.floor(hash(salt) * list.length)];
const isMemberish = (s, id) => ['member', 'newcomer'].includes(s.res[id]?.stage);

export function fillStreet(s, id, text) {
  return text.replaceAll('{호칭}', VOICES[id]?.call ?? '선생님').replaceAll('{성소}', sanctuaryName(s))
    .replaceAll('{예배}', SECTS[s.leader.sect]?.terms.worship ?? '예배');
}

// 지금 고를 수 있는 표현 (레벨 해금 + 따라오는 사람이 있으면 '돌아가 있어')
export function emotesFor(s) {
  const lv = levelOf(s).level;
  const out = EMOTES.map((e) => ({ ...e, locked: e.level > lv }));
  if (streetOf(s).follow.length) out.push({ ...DISMISS, locked: false });
  return out;
}
export const emoteSay = (id) => EMOTE_SAY[id] ?? '';

// 표현 하나: near = 교주 근처(STREET.reactTiles 안) 주민 id. 같은 표현을 연달아 하면 반응도 효과도 없다
//   → { same, reactions: [{ id, react, line }], changed: { like, sus } }
export function applyEmote(s, emoteId, near) {
  const st = streetOf(s);
  if (emoteId === 'dismiss') return { same: false, reactions: dismissFollowers(s) };
  const same = st.last === emoteId;
  st.last = emoteId;
  if (same) return { same, reactions: [] };
  const e = EMOTES.find((x) => x.id === emoteId);
  const reactions = [];
  for (const id of near.filter((x) => s.res[x] && !st.follow.includes(x)).slice(0, STREET.maxReact)) {
    const r = s.res[id]; const member = isMemberish(s, id);
    let react = 'glance'; let like = 0; let sus = 0;
    if (e.kind === 'greet') {
      if (r.sus >= STREET.coldSus) react = 'glance';
      else {
        react = { wave: 'wave', bow: 'bow', smile: 'smile', heart: member ? 'heart' : 'shy' }[emoteId];
        like = member ? STREET.greetLike + 1 : STREET.greetLike;
      }
    } else if (e.kind === 'pray') { react = member ? 'pray' : 'stare'; sus = member ? 0 : STREET.praySus; }
    else if (e.kind === 'anger') { react = 'flinch'; sus = member ? 0 : STREET.angerSus; like = member ? -1 : 0; }
    else if (e.kind === 'bless') { react = member ? 'bow' : 'stare'; like = member ? STREET.blessLike : 0; sus = member ? 0 : 1; }
    else if (e.kind === 'clap') react = member ? 'clap' : 'glance';
    else if (emoteId === 'sigh') react = member ? 'worry' : 'glance';
    else if (emoteId === 'what') react = 'shrug';
    // 호감은 사람마다 하루 한 번만 오른다 (내리는 건 매번)
    if (like > 0 && st.liked[id] === s.day) like = 0;
    if (like > 0) st.liked[id] = s.day;
    if (like) r.like = clamp(r.like + like);
    if (sus) r.sus = clamp(r.sus + sus);
    reactions.push({ id, react, line: pickLine(REACT[react], `${s.day}:${s.minute}:${id}:${emoteId}`), like, sus });
  }
  return { same, reactions };
}

// ── 밖에서 만난 신도 ──
// ctx: { neighbor: 옆에 선 사람 id | null, reporterNear: 기자가 가까이 있나 }
//   → null (오늘 이미 인사했거나 대상 아님) · { kind: 'greet'|'ignore'|'follow', line }
export function meetLeader(s, id, ctx) {
  const st = streetOf(s); const r = s.res[id];
  if (!r || !isMemberish(s, id) || st.greeted[id] === s.day || st.follow.includes(id)) return null;
  st.greeted[id] = s.day;
  const salt = `${s.seed}:${s.day}:${id}`;
  // 모른 척: 가족·동료가 옆에 있을 때 · 평판이 낮을 때 · 기자가 가까이 있을 때 (비밀스러운 교리일수록 자주)
  const rel = ctx.neighbor ? relationKind(s, id, ctx.neighbor) : null;
  const withKin = rel === 'family' || rel === 'coworker';
  let p = SECRECY[s.leader.sect] ?? 0;
  if (withKin && !isMemberish(s, ctx.neighbor)) p += STREET.ignoreWith;
  if (s.rep < STREET.lowRep) p += STREET.ignoreRep;
  if (ctx.reporterNear) p += STREET.ignorePress;
  if (p > 0 && hash(salt + ':ig') < p) {
    const why = ctx.reporterNear ? 'press' : withKin ? 'with' : 'rep';
    return { kind: 'ignore', line: pickLine(IGNORE[why], salt) };
  }
  // 열혈 신자는 줄 서서 따라온다 (최대 STREET.maxFollow)
  if (isZealot(s, id) && st.follow.length < STREET.maxFollow) {
    st.follow.push(id);
    return { kind: 'follow', line: fillStreet(s, id, pickLine(FOLLOW.start, salt)) };
  }
  const age = RESIDENT_BY_ID[id]?.age ?? 40;
  const band = age >= 60 ? 'elder' : age <= 25 ? 'young' : 'mid';
  return { kind: 'greet', line: fillStreet(s, id, pickLine(GREET[band], salt)) };
}

export function relationKind(s, a, b) {
  for (const [x, y, k] of [...RELATIONS, ...streetOf(s).rel]) if ((x === a && y === b) || (x === b && y === a)) return k;
  return null;
}
// 길에서 새로 생긴 관계까지 (프로필 화면용)
export const streetRelations = (s, id) => streetOf(s).rel.filter(([a, b]) => a === id || b === id).map(([a, b, kind]) => ({ id: a === id ? b : a, kind }));

export const followers = (s) => streetOf(s).follow.filter((id) => s.res[id]);

// 대화에 끼어들기: 대화마다 한 명. 밀어붙이는 성격이면 상대 의심↑, 아니면 호감↑
export function chimeIn(s, targetId) {
  const f = followers(s).filter((id) => id !== targetId);
  if (!f.length || !s.res[targetId]) return null;
  const id = f[Math.floor(hash(`${s.day}:${s.minute}:${targetId}`) * f.length)];
  const pushy = (RESIDENT_BY_ID[id]?.traits ?? []).some((t) => PUSHY.includes(t));
  const t = s.res[targetId];
  if (pushy) t.sus = clamp(t.sus + STREET.chimeSus); else t.like = clamp(t.like + STREET.chimeLike);
  return { id, good: !pushy, line: fillStreet(s, id, pickLine(pushy ? FOLLOW.chimeBad : FOLLOW.chimeGood, `${s.day}:${targetId}:${id}`)) };
}

// 따라오는 사람이 많으면 노출이 오른다 (게임 dtMin 분만큼). 기자 시야에 들면 그날 한 번 크게
export function followExposure(s, dtMin, inPressSight) {
  const n = followers(s).length;
  const st = streetOf(s);
  let msg = null;
  if (n) s.exposure = clamp(s.exposure + (STREET.exposurePerHour[n] ?? 0) * dtMin / 60);
  if (n >= 2 && inPressSight && st.pressDay !== s.day) { st.pressDay = s.day; s.exposure = clamp(s.exposure + STREET.pressSeen); msg = FOLLOW.pressSeen; }
  return msg;
}

export function dismissFollowers(s) {
  const st = streetOf(s);
  const out = st.follow.filter((id) => s.res[id]).map((id) => {
    s.res[id].like = clamp(s.res[id].like - STREET.dismissLike);
    return { id, react: 'back', line: fillStreet(s, id, pickLine(FOLLOW.back, `${s.day}:${id}:back`)) };
  });
  st.follow = [];
  st.last = 'dismiss';
  return out;
}
// 하루가 끝나면 다들 집으로 (성소 밤 장면에서 따로 앉힌다)
export function endStreetDay(s) { streetOf(s).follow = []; streetOf(s).last = null; }

// 신도끼리 마주쳤을 때 (하루 한 번, 짝마다). 관계가 없으면 가끔 새 친구가 된다
export function memberMeet(s, a, b) {
  if (!isMemberish(s, a) || !isMemberish(s, b)) return null;
  const st = streetOf(s);
  const key = a < b ? `${a}|${b}` : `${b}|${a}`;
  if (st.met[key] === s.day) return null;
  st.met[key] = s.day;
  const salt = `${s.seed}:${s.day}:${key}`;
  let newRel = null;
  if (!relationKind(s, a, b) && hash(salt + ':rel') < STREET.newFriend) {
    st.rel.push([a, b, 'friend']);
    newRel = josaFix(MEMBER_MEET.newFriend.replace('{가}', RESIDENT_BY_ID[a].name).replace('{나}', RESIDENT_BY_ID[b].name));
  }
  return { hello: fillStreet(s, a, pickLine(MEMBER_MEET.hello, salt)), reply: fillStreet(s, b, pickLine(MEMBER_MEET.reply, salt + 'r')), newRel };
}
