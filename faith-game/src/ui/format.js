// 숫자·글자 표시 도우미

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 사람 수: 1.43억 / 5,170만 / 3,210
export function people(n) {
  n = Math.round(n);
  const a = Math.abs(n);
  if (a >= 1e8) return `${(n / 1e8).toFixed(a >= 1e9 ? 1 : 2).replace(/\.?0+$/, '')}억`;
  if (a >= 1e4) return `${Math.round(n / 1e4).toLocaleString('ko-KR')}만`;
  return n.toLocaleString('ko-KR');
}

export const signed = (n) => {
  n = Math.round(n);
  return (n > 0 ? '+' : n < 0 ? '−' : '±') + people(Math.abs(n));
};

// 비율: 작은 값도 의미 있게 보이도록 자릿수를 바꾼다
export function pct(x) {
  const p = x * 100;
  if (p === 0) return '0%';
  if (p >= 10) return `${p.toFixed(0)}%`;
  if (p >= 1) return `${p.toFixed(1)}%`;
  if (p >= 0.01) return `${p.toFixed(2)}%`;
  if (p >= 0.0001) return `${p.toFixed(4).replace(/0+$/, '')}%`;
  return '0.0001% 미만';
}

export const int = (n) => Math.round(n).toLocaleString('ko-KR');

// 색 위에 올릴 글자색 (밝은 색이면 검정)
export function onColor(hex) {
  const v = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.42 ? '#111111' : '#ffffff';
}

// 은/는, 이/가 같은 조사
export function josa(word, pair) {
  const [withBatchim, without] = pair.split('/');
  const ch = String(word).trim().slice(-1).charCodeAt(0);
  if (ch < 0xac00 || ch > 0xd7a3) return word + without;
  return word + ((ch - 0xac00) % 28 ? withBatchim : without);
}
