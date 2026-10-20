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
