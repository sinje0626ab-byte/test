// 한국어 조사 고르기: 앞 단어 끝 받침을 보고 이/가, 을/를, 은/는, 과/와, 으로/로 중 하나.
// 숫자는 읽는 소리로 (1 일, 3 삼 …), 끝의 괄호·따옴표·공백은 건너뛴다. 영문 등은 받침 없음으로 본다.
const PAIRS = { '이/가': ['이', '가'], '을/를': ['을', '를'], '은/는': ['은', '는'], '과/와': ['과', '와'], '으로/로': ['으로', '로'] };
// 숫자 끝 소리의 받침 (0 은 앞 자리가 있으면 십·백·천 → 받침 있음). ㄹ 받침은 'ㄹ'
const DIGIT = ['ㅇ', 'ㄹ', '', 'ㅁ', '', '', 'ㄱ', 'ㄹ', 'ㄹ', ''];

// 끝소리 받침: '' 없음 · 'ㄹ' · 그 밖 받침은 'x'
function tail(word) {
  const s = String(word).replace(/[\s)\]」』"'.,!?~…]+$/u, '');
  const ch = s.at(-1) ?? '';
  const code = ch.charCodeAt(0) - 0xac00;
  if (code >= 0 && code < 11172) {
    const jong = code % 28;
    return jong === 0 ? '' : jong === 8 ? 'ㄹ' : 'x';
  }
  if (/\d/.test(ch)) {
    if (ch === '0' && /\d0$/.test(s)) return 'x';
    return DIGIT[+ch] === 'ㄹ' ? 'ㄹ' : DIGIT[+ch] ? 'x' : '';
  }
  return '';
}

// 조사만: pick('슬라임', '이/가') → '이'
export function pick(word, pair) {
  const [withB, noB] = PAIRS[pair];
  const t = tail(word);
  if (pair === '으로/로') return t === 'x' ? withB : noB;
  return t ? withB : noB;
}

// 단어 + 조사: josa('슬라임', '이/가') → '슬라임이'
export const josa = (word, pair) => `${word}${pick(word, pair)}`;
