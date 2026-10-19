// 국기 준비: countries.json 에 iso2 코드를 채우고, 쓰는 국기 SVG만 public/flags/ 로 복사한다.
// 국기 그림: flag-icons (MIT, https://github.com/lipis/flag-icons)
// 실행: npm run flags
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import countries from 'i18n-iso-countries';

const SPECIAL = { '383': 'xk' }; // 코소보는 ISO 숫자 코드가 없다
const dataUrl = new URL('../src/data/countries.json', import.meta.url);
const flagDir = new URL('../node_modules/flag-icons/flags/4x3/', import.meta.url);
const outDir = new URL('../public/flags/', import.meta.url);

let text = readFileSync(dataUrl, 'utf8');
const data = JSON.parse(text);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const missing = [];
for (const id of Object.keys(data.countries)) {
  const iso2 = (SPECIAL[id] ?? countries.numericToAlpha2(id) ?? '').toLowerCase();
  const src = new URL(`${iso2}.svg`, flagDir);
  // 한 줄에 한 나라 형식을 지키려고 문자열로 고친다
  const line = new RegExp(`("${id}": \\{"name": "[^"]+", )("iso2": "[a-z]*", )?`);
  if (!iso2 || !existsSync(src)) {
    missing.push(`${id} ${data.countries[id].name}`);
    text = text.replace(line, '$1');
    continue;
  }
  text = text.replace(line, `$1"iso2": "${iso2}", `);
  copyFileSync(src, new URL(`${iso2}.svg`, outDir));
}
writeFileSync(dataUrl, text);
JSON.parse(text);
console.log(`국기 ${Object.keys(data.countries).length - missing.length}개 복사, 없음: ${missing.join(', ') || '없음'}`);
