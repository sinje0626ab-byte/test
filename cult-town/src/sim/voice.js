// 주민 대사 고르기. 상황마다 4~6줄을 돌려 쓰고, 최근에 한 말은 다시 안 한다 (st.said).
// 고르는 데 게임 난수(s.rng)를 쓰지 않는다: 대사가 늘어도 시뮬레이션 결과가 그대로다.
import { VOICES } from '../data/voices/index.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { SECTS } from '../data/sects.js';
import { weekday, isWeekend, holidayOf, tempAt } from './clock.js';

const RECENT = 14;           // 이만큼 최근에 한 말은 피한다
const CTX_CHANCE = 0.4;      // 인사·잡담에서 상황 대사를 쓸 확률

// 동네 사람들이 성소를 부르는 이름 (간판 아크릴부터 교단 이름)
export const sanctuaryName = (s) => ((s?.sanctuary?.sign ?? 0) >= 2 ? s.leader.cultName : '302호');

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

// 지금 맞는 상황 키 (시간·날씨·요일·계절 행사·최근 일·기억)
export function contextKeys(s, id) {
  const st = s.res[id];
  const out = [];
  if (s.minute < 11 * 60) out.push('morning');
  if (s.minute >= 17 * 60) out.push('evening');
  if (s.weather?.rain || s.weather?.snow) out.push('rain');
  const t = tempAt(s);
  if (t <= 5) out.push('cold');
  if (t >= 27) out.push('hot');
  if (weekday(s.day) === 0) out.push('monday');
  if (weekday(s.day) === 4) out.push('friday');
  if (isWeekend(s.day)) out.push('weekend');
  const hol = holidayOf(s.day);
  if (hol) out.push(hol.id === 'buddha' ? 'holiday' : hol.id);
  if (s.sanctuary.worshipDay === s.day - 1) out.push('afterWorship');
  if (st.talked === s.day - 1) out.push('again');
  return out;
}

function fillLine(s, id, str) {
  const v = VOICES[id];
  const sect = SECTS[s.leader.sect];
  return str
    .replaceAll('{성소}', sanctuaryName(s))
    .replaceAll('{호칭}', v?.call ?? '선생님')
    .replaceAll('{교단}', s.leader.cultName)
    .replaceAll('{예배}', sect?.terms.worship ?? '예배')
    .replaceAll('{교주}', s.leader.name);
}

// 후보 중 최근에 안 한 말 하나. 후보 = [{key, text}]
function choose(s, id, cands, salt) {
  const st = s.res[id];
  st.said ??= [];
  const fresh = cands.filter((c) => !st.said.includes(c.key));
  const pool = fresh.length ? fresh : cands;
  const c = pool[Math.floor(hash(`${s.seed}:${s.day}:${s.minute}:${id}:${salt}`) * pool.length)];
  st.said.push(c.key);
  if (st.said.length > RECENT) st.said.splice(0, st.said.length - RECENT);
  return fillLine(s, id, c.text);
}

const asList = (x) => (Array.isArray(x) ? x : x ? [x] : []);

// kind: greet · smalltalk · hit · partial · miss · preachGood · preachBad · inviteYes · inviteNo · refuse · again
export function lineFor(s, id, kind) {
  const r = RESIDENT_BY_ID[id];
  const st = s.res[id];
  const v = VOICES[id];
  if (!v) return kind === 'greet' ? fillLine(s, id, r.greet[1] ?? r.greet[0]) : '';   // 대사 묶음이 없는 주민 (없어야 한다)
  if (kind === 'first') return v.first ? fillLine(s, id, v.first) : '';
  let k = kind;
  if (kind === 'greet') {
    if (st.stage === 'member' && v.member?.length) k = 'member';
    else if (st.like >= 50 && v.close?.length) k = 'close';
  }
  if (kind === 'hit' && st.like >= 40 && v.hitClose?.length) k = 'hitClose';
  const cands = asList(v[k]).map((text, i) => ({ key: `${k}${i}`, text }));
  if ((kind === 'greet' || kind === 'smalltalk') && v.ctx) {
    const ctxCands = contextKeys(s, id).flatMap((c) => asList(v.ctx[c]).map((text, i) => ({ key: `${c}${i}`, text })))
      .filter((c) => !(st.said ?? []).includes(c.key));
    if (ctxCands.length && hash(`${s.seed}:${s.day}:${id}:${kind}:ctx`) < CTX_CHANCE) return choose(s, id, ctxCands, `${kind}c`);
  }
  if (!cands.length) return '';
  return choose(s, id, cands, kind);
}
