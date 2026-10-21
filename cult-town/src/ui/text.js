// 문장 틀 채우기: {교단} {교주} {예배} {신도} {장소} {이름} {n} {돈} 등
import { SECTS } from '../data/sects.js';
import { won } from './dom.js';

export function fill(str, s, extra = {}) {
  const sect = s ? SECTS[s.leader.sect] : null;
  const map = {
    교단: s?.leader.cultName ?? '',
    교주: s?.leader.name ?? '',
    예배: sect?.terms.worship ?? '예배',
    신도: sect?.terms.member ?? '신도',
    장소: sect?.terms.place ?? '성소',
    성소: s ? sanctuaryName(s) : '302호',
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, k === '돈' ? won(v) : v])),
  };
  return str.replace(/\{([^}]+)\}/g, (m, k) => (k in map ? map[k] : m));
}

// 받침에 따라 이/가, 을/를, 은/는
export function josa(word, pair) {
  const ch = word.charCodeAt(word.length - 1);
  const has = ch >= 0xac00 && ch <= 0xd7a3 && (ch - 0xac00) % 28 !== 0;
  const [a, b] = pair.split('/');
  return word + (has ? a : b);
}

// 동네 사람들이 성소를 부르는 이름. 간판이 아크릴(2단계) 이상이면 교단 이름으로 부른다
export function sanctuaryName(s) {
  return (s?.sanctuary?.sign ?? 0) >= 2 ? s.leader.cultName : '302호';
}
// 주민 대사의 '302호'를 간판 단계에 맞게 바꾼다 (조사도 맞춘다)
export function speak(s, str) {
  if (!str || sanctuaryName(s) === '302호') return str;
  const name = s.leader.cultName;
  return str.replace(/302호(가|는|를|와|로|)/g, (m, j) => {
    if (!j) return name;
    const pair = { 가: '이/가', 는: '은/는', 를: '을/를', 와: '과/와' }[j];
    if (pair) return josa(name, pair);
    // 로: 받침이 있으면 '으로' (ㄹ 받침은 '로')
    const ch = name.charCodeAt(name.length - 1);
    const jong = ch >= 0xac00 && ch <= 0xd7a3 ? (ch - 0xac00) % 28 : 0;
    return name + (jong && jong !== 8 ? '으로' : '로');
  });
}
