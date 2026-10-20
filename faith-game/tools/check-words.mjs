// npm run lint:words — 화면 문구의 금지 패턴을 센다 (CLAUDE.md 10절).
// src/ 의 .js 에서 주석을 빼고 문자열 리터럴만 본다.
//   node tools/check-words.mjs          개수 표
//   node tools/check-words.mjs --list   어디에 있는지까지
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const RULES = [
  ['줄표 —', /—/g],
  ['낫표 「」', /[「」]/g],
  ['화살표 ↑↓', /[↑↓]/g],
  ['세모 ▲▼', /[▲▼]/g],
  ['"A지만 B"', /(?<!까)지만[ ,]/g],
  ['"X가 아니라 Y"', /아니라[ ,]/g],
  ['"A일 수도, B일 수도"', /일 수도/g],
  ['반전 꼬리 "적어도"', /적어도(?! ?(돼|되))/g],
  ['반전 꼬리 "이번엔."', /이번엔\./g],
  ['반전 꼬리 "이번에는."', /이번에는\./g],
  ['추상어 세상', /세상/g],
  ['추상어 역사', /역사/g],
  ['추상어 운명', /운명/g],
  ['추상어 빛', /빛(?!깔)/g],
  ['추상어 어둠', /어둠/g],
  ['추상어 영혼', /영혼/g],
];

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js')) files.push(p);
  }
})(ROOT);

// 주석을 지우고 문자열 리터럴만 모은다 (대충이지만 이 코드베이스에는 충분하다)
function strings(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (ch === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 2; continue; }
    if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1, s = '';
      while (j < src.length && src[j] !== ch) {
        if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; }
        if (ch === '`' && src[j] === '$' && src[j + 1] === '{') {
          let depth = 1; j += 2;
          while (j < src.length && depth) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
          s += ' ';
          continue;
        }
        s += src[j++];
      }
      const line = src.slice(0, i).split('\n').length;
      out.push({ s, line });
      i = j + 1;
      continue;
    }
    i++;
  }
  return out;
}

const list = process.argv.includes('--list');
const counts = Object.fromEntries(RULES.map(([k]) => [k, []]));
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const { s, line } of strings(src)) {
    if (!/[가-힣]/.test(s)) continue;
    for (const [k, re] of RULES) {
      const m = s.match(re);
      if (m) counts[k].push(`${relative(ROOT, f)}:${line}  ${s.slice(0, 70)}`);
    }
  }
}
let total = 0;
for (const [k, hits] of Object.entries(counts)) {
  total += hits.length;
  console.log(`${String(hits.length).padStart(3)}  ${k}`);
  if (list) for (const h of hits) console.log(`       ${h}`);
}
console.log(`---\n${String(total).padStart(3)}  합계`);
