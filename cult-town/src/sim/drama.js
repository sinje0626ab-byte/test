// 동네 드라마 (24장 D-4): 주민끼리 연애·헤어짐·소문·다툼·화해·합격·폐업·개업. 고민이 바뀌고 아침 소식·수첩 소문으로 보인다.
// 교주는 그 주민에게 위로하기 · 이용하기(어두운 선택) · 모른 척. 상태: s.drama = { log[], couples[], fights[] }
import { DRAMA } from '../config.js';
import { DRAMA_TEXT, DRAMA_OPTIONS, EXAM_TAKERS, SHOP_OWNERS } from '../data/drama.js';
import { RELATIONS, RESIDENT_BY_ID, districtOf } from '../data/residents.js';
import { clamp, shiftBelief, josaFix } from './leader.js';
import { sanctuaryName } from './voice.js';
import { hear } from './quests.js';

const name = (id) => RESIDENT_BY_ID[id].name;
const fill = (s, t, a, b) => josaFix(t.replaceAll('{a}', a ? name(a) : '').replaceAll('{b}', b ? name(b) : '').replaceAll('{성소}', sanctuaryName(s)));
const need = (s, id, k, d) => { s.res[id].needs[k] = clamp(s.res[id].needs[k] + d); };
const ALL_REL = RELATIONS;   // 봉천동 관계도 들어 있다

// 게임 난수(s.rng)를 쓰지 않는다: 드라마가 생겨도 다른 일의 난수 순서가 그대로다
let salt = 0;
const rand = (s) => {
  let h = 2166136261; const str = `${s.seed}:${s.day}:drama:${salt++}`;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
};
const pick = (s, arr) => arr[Math.floor(rand(s) * arr.length)];

export const dramaOf = (s) => (s.drama ??= { log: [], couples: [], fights: [] });
// 지금 움직이는 동네 (봉천동은 4단계부터)
const active = (s, id) => districtOf(id) === 'sillim' || s.phase >= 4;

function candidates(s) {
  const D = dramaOf(s);
  const out = [];
  const adult = (id) => RESIDENT_BY_ID[id].age >= 20 && RESIDENT_BY_ID[id].age <= 50;
  const taken = new Set(D.couples.flat());
  for (const [a, b, kind] of ALL_REL) {
    if (!active(s, a) || !active(s, b)) continue;
    if ((kind === 'friend' || kind === 'coworker') && adult(a) && adult(b) && !taken.has(a) && !taken.has(b)
      && RESIDENT_BY_ID[a].gender !== RESIDENT_BY_ID[b].gender && Math.abs(RESIDENT_BY_ID[a].age - RESIDENT_BY_ID[b].age) <= 8) out.push(['romance', a, b]);
    if (kind === 'family' && !D.fights.some((f) => f.a === a && f.b === b)) out.push(['fight', a, b]);
  }
  for (const [a, b] of D.couples) out.push(['breakup', a, b]);
  for (const f of D.fights) if (s.day - f.day >= 3) out.push(['reconcile', f.a, f.b]);
  for (const id of EXAM_TAKERS) if (active(s, id) && !D.log.some((x) => x.ids[0] === id && ['pass', 'fail'].includes(x.type))) out.push([rand(s) < 0.45 ? 'pass' : 'fail', id]);
  for (const id of SHOP_OWNERS) if (active(s, id) && !D.log.some((x) => x.ids[0] === id && ['closing', 'opening'].includes(x.type))) out.push([s.res[id].needs.money >= 60 ? 'closing' : 'opening', id]);
  for (const [a, , kind] of ALL_REL) if (kind === 'family' && active(s, a) && RESIDENT_BY_ID[a].age >= 30) out.push(['rumor', a]);
  return out;
}

// 하루 끝: 확률로 한 건
export function dailyDrama(s) {
  salt = 0;
  if (rand(s) >= DRAMA.daily) return [];
  const c = candidates(s);
  if (!c.length) return [];
  const [type, a, b] = pick(s, c);
  const D = dramaOf(s);
  switch (type) {
    case 'romance': D.couples.push([a, b]); need(s, a, 'lonely', -25); need(s, b, 'lonely', -25); break;
    case 'breakup': D.couples = D.couples.filter(([x, y]) => !(x === a && y === b)); need(s, a, 'lonely', 30); need(s, b, 'lonely', 30); need(s, a, 'meaning', 10); break;
    case 'fight': D.fights.push({ a, b, day: s.day }); need(s, a, 'lonely', 15); need(s, b, 'lonely', 15); need(s, a, 'meaning', 10); break;
    case 'reconcile': D.fights = D.fights.filter((f) => !(f.a === a && f.b === b)); need(s, a, 'lonely', -15); need(s, b, 'lonely', -15); break;
    case 'pass': need(s, a, 'future', -40); break;
    case 'fail': need(s, a, 'future', 25); need(s, a, 'meaning', 15); break;
    case 'closing': need(s, a, 'money', 30); need(s, a, 'meaning', 15); break;
    case 'opening': need(s, a, 'money', 10); need(s, a, 'future', -10); break;
    case 'rumor': need(s, a, 'lonely', 10); need(s, a, 'meaning', 10); break;
    default: return [];
  }
  const text = fill(s, pick(s, DRAMA_TEXT[type]), a, b);
  const ids = b ? [a, b] : [a];
  D.log.unshift({ day: s.day, type, ids, text });
  if (D.log.length > 30) D.log.length = 30;
  for (const id of ids) s.res[id].drama = { day: s.day, type, handled: false };
  hear(s, a, text);
  return [{ type: 'drama', kind: type, ids, text }];
}

// 대화 선택지: 드라마가 있었던 주민 (며칠 안, 아직 대응 안 함)
export const dramaOpen = (s, id) => { const d = s.res[id].drama; return !!d && !d.handled && s.day - d.day <= DRAMA.activeDays; };
export function dramaLabel(s, id, k) {
  return josaFix(DRAMA_OPTIONS[k].label.replace('{이름}', name(id)).replace('{성소}', sanctuaryName(s)));
}
export function dramaAct(s, id, k) {
  const st = s.res[id];
  st.drama.handled = true;
  if (k === 'comfort') {
    st.like = clamp(st.like + DRAMA.comfort.like);
    return josaFix(DRAMA_TEXT.comfort.replace('{이름}', name(id)));
  }
  st.like = clamp(st.like + DRAMA.exploit.like);
  shiftBelief(s, DRAMA.exploit.belief);
  s.flags.darkToday = (s.flags.darkToday ?? 0) + 1;
  (s.later ??= []).push({ day: s.day + DRAMA.exploit.days, kind: 'dramaExploit', id });
  return josaFix(DRAMA_TEXT.exploit.replace('{이름}', name(id)).replace('{성소}', sanctuaryName(s)));
}
