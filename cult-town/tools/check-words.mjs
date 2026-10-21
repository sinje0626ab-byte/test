// 문장 금지 패턴 검사 (CLAUDE.md 14장). src/data/*.js 와 src/ui/*.js 의 문자열을 훑는다.
//   줄표(—) · "A일 수도 B일 수도" 대구 · 추상어(세상·운명·빛·영혼) 남발
import { readFileSync, readdirSync } from 'node:fs';

const dirs = ['src/data', 'src/ui'];
const ABSTRACT = ['세상', '운명', '빛', '영혼'];
const ABSTRACT_LIMIT = 3; // 파일 하나에 추상어 합이 이보다 많으면 남발
let bad = 0;
for (const d of dirs) {
  let files = [];
  try { files = readdirSync(new URL(`../${d}/`, import.meta.url)).filter((f) => f.endsWith('.js')); } catch { continue; }
  for (const f of files) {
    const text = readFileSync(new URL(`../${d}/${f}`, import.meta.url), 'utf8');
    const strings = [...text.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? m[3]);
    const body = strings.join('\n');
    const report = (what, n) => { if (n) { bad += n; console.log(`  ${d}/${f}: ${what} ${n}`); } };
    report('줄표(—)', (body.match(/—/g) ?? []).length);
    report('"~일 수도 ~일 수도" 대구', (body.match(/수도[^.\n"]{0,30}수도/g) ?? []).length);
    const abs = ABSTRACT.reduce((n, w) => n + (body.match(new RegExp(w, 'g')) ?? []).length, 0);
    if (abs > ABSTRACT_LIMIT) report(`추상어 ${ABSTRACT.join('·')} ${abs}회 (한도 ${ABSTRACT_LIMIT})`, abs);
  }
}
console.log(bad ? `✗ 금지 패턴 ${bad}개` : '✓ 금지 패턴 0개');
process.exitCode = bad ? 1 : 0;

// ── 24장 B 대사 검사 (개수 보고. 한도를 넘으면 실패) ──
// 주민마다: 숫자가 든 줄 비율(30% 초과 금지) · 말줄임표로 시작하는 줄 비율(20% 초과 금지) · 같은 대사 중복
// 사연 지문: "OOO가 ~한다." 틀 비율 보고
const { VOICES, NEW_STORIES } = await import('../src/data/voices/index.js');
const { RESIDENT_BY_ID } = await import('../src/data/residents.js');
const linesOf = (v) => [v.first, ...Object.entries(v).filter(([k, x]) => Array.isArray(x) && k !== 'call').flatMap(([, x]) => x),
  ...Object.values(v.ctx ?? {}).flat()].filter((x) => typeof x === 'string');
const seen = new Map();
let over = 0; let dup = 0; let rows = [];
for (const [id, v] of Object.entries(VOICES)) {
  const ls = linesOf(v);
  const inner = (l) => l.replace(/^"|"$/g, '');
  const num = ls.filter((l) => /[0-9]/.test(l)).length / ls.length;
  const ell = ls.filter((l) => /^…|^\.\.\./.test(inner(l))).length / ls.length;
  for (const l of ls) { if (seen.has(l)) dup++; else seen.set(l, id); }
  if (num > 0.3 || ell > 0.2) over++;
  rows.push(`${RESIDENT_BY_ID[id]?.name ?? id} ${ls.length}줄 숫자 ${Math.round(num * 100)}% 말줄임 ${Math.round(ell * 100)}%${num > 0.3 || ell > 0.2 ? ' ✗' : ''}`);
}
const stageDirs = Object.values(NEW_STORIES).flat().flatMap((st) => st.text.filter((t) => !t.startsWith('"')));
const frame = stageDirs.filter((t) => /^\S{2,4}[이가]\s.+[다]\.$/.test(t)).length;
console.log(`대사 검사: 주민 ${rows.length}명 · 한도 넘은 주민 ${over} · 같은 대사 중복 ${dup} · 사연 지문 "OOO가 ~한다." ${frame}/${stageDirs.length} (${stageDirs.length ? Math.round((frame / stageDirs.length) * 100) : 0}%)`);
if (process.argv.includes('-v')) rows.forEach((r) => console.log('  ' + r));
if (over || dup) process.exitCode = 1;
