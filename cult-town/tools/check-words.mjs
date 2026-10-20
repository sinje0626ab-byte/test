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
