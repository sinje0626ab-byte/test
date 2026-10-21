// 주민이 그 자리에서 하는 행동 · 머리 위 감정 · 주민끼리 수다 한 줄. 화면(TownScene)이 그린다.
// 순수 함수: 같은 상태·시각이면 같은 답 (저장할 필요 없음).
import { RESIDENT_BY_ID, RELATIONS } from '../data/residents.js';
import { GOSSIP } from '../data/gossip.js';
import { JOB_ICON_B } from '../data/residents-bongcheon.js';
import { MOOD } from '../config.js';
import { topNeeds } from './residents.js';

// 그 자리의 주인 (손님 응대)
const SERVERS = {
  'market:banchan': ['banchan'], 'market:fruit': ['youngsuk'], 'market:fish': ['namgung'],
  'pharmacy:counter': ['pharmacist'], 'restaurant:front': ['mikyung', 'taeyang'], 'cvs:front': ['yerin', 'seungho'],
  'sanctuary:door': ['osik'],
};
const OLD = (r) => r.age >= 60;

// 행동: phone · shop · smoke · sit · chat · exercise · walk · serve · stand
export function activityOf(id, key, hasNeighbor) {
  const r = RESIDENT_BY_ID[id];
  if (!r || !key?.includes(':')) return 'stand';
  if (SERVERS[key]?.includes(id)) return 'serve';
  const [place, spot] = key.split(':');
  if (spot === 'smoke') return 'smoke';
  if (place === 'park' && spot.startsWith('bench')) return 'sit';
  if (place === 'park' && spot === 'plaza') return OLD(r) ? 'exercise' : hasNeighbor ? 'chat' : 'exercise';
  if (place === 'park' || place === 'stream') return 'walk';
  if (place === 'market') return hasNeighbor && OLD(r) ? 'chat' : 'shop';
  if (hasNeighbor) return 'chat';
  return 'phone';
}

const h32 = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return (h >>> 0) / 4294967296; };

// 감정 말풍선: sigh · heart · question · angry · sleepy (없으면 null). 20분 단위로 바뀐다.
export function emotionOf(s, id, minute = s.minute) {
  const r = RESIDENT_BY_ID[id]; const st = s.res[id];
  if (!r || !st) return null;
  const roll = h32(`${id}:${s.day}:${Math.floor(minute / MOOD.window)}`);
  if (st.sus >= MOOD.angrySus && roll < 0.45) return 'angry';
  if ((st.stage === 'newcomer' || st.stage === 'member' || st.like >= MOOD.heartLike) && roll < 0.3) return 'heart';
  if ((st.stage === 'curious' || st.stage === 'visitor') && roll < 0.3) return 'question';
  const top = topNeeds(st)[0];
  const v = st.needs[top];
  if (v >= MOOD.sighAt && roll < (v - MOOD.sighAt + 20) / 60) return 'sigh';
  const night = ['night_worker', 'cabbie'].includes(r.voice);
  if ((night && minute < 12 * 60) || (OLD(r) && minute >= 19 * 60)) return roll < 0.35 ? 'sleepy' : null;
  return null;
}

export function relationBetween(a, b) {
  for (const [x, y, k] of RELATIONS) if ((x === a && y === b) || (x === b && y === a)) return k;
  return null;
}

// 수다 한 줄. rand: 0~1 난수 함수 (화면 쪽 Math.random 이면 된다)
// 마지막 수다가 누구의 어떤 고민 얘기였나 (엿듣기: 수첩에 적고 대화 선택지를 연다)
export let lastGossip = null;
export function gossipLine(s, a, b, rand = Math.random) {
  lastGossip = null;
  const sa = s.res[a]; const sb = s.res[b];
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const roll = rand();
  if (s.weather?.rain && roll < 0.25) return pick(GOSSIP.rain);
  if (s.weather?.market && roll < 0.25) return pick(GOSSIP.market);
  if (Math.max(sa.sus, sb.sus) >= 30 && roll < 0.5) return pick(GOSSIP.rumorBad);
  if (Math.max(sa.like, sb.like) >= 50 && roll < 0.45) return pick(GOSSIP.rumorGood);
  if (roll < 0.7) {
    // 둘 다 아는 사람(또는 아무나) 이야기: 고민 힌트
    const others = Object.keys(s.res).filter((x) => x !== a && x !== b && (relationBetween(a, x) || relationBetween(b, x)));
    const x = others.length ? pick(others) : null;
    if (x) {
      const need = topNeeds(s.res[x])[0];
      lastGossip = { x, need };
      return pick(GOSSIP.about[need]).replace('{x}', RESIDENT_BY_ID[x].name.slice(1));
    }
  }
  const rel = relationBetween(a, b) ?? 'stranger';
  return pick(GOSSIP[rel]).replace('{b}', RESIDENT_BY_ID[b].name.slice(1));
}

// 직업 아이콘 (처음 보는 사람 머리 위)
export const JOB_ICON = {
  ...JOB_ICON_B,
  tong: 'cane', banchan: 'apron', pharmacist: 'pill', jihun: 'book', yerin: 'book', dohyun: 'tie', sua: 'tie', minjae: 'book',
  haeun: 'book', seokgu: 'cane', mikyung: 'apron', taeyang: 'apron', minsu: 'box', jiwon: 'pen', kyungho: 'apron',
  youngsuk: 'apron', namgung: 'apron', narae: 'book', dongwook: 'tie', seongja: 'cane', jaeseok: 'wheel', eunbi: 'pill',
  seungho: 'apron', youngja: 'cane', junhyuk: 'pen', miran: 'tie', gunwoo: 'bolt', boram: 'home', osik: 'cane', yoonseo: 'book',
};
