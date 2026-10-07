// 추모봇 운영 안내(chumobot/index.html)의 본문을 비밀번호로 봉인하거나 푼다.
// 비밀번호와 평문 본문은 저장소에 두지 않는다 — 실행할 때만 넘긴다.
//
//   봉인: node tools/seal-chumobot.mjs seal <본문.html> <비밀번호>
//   풀기: node tools/seal-chumobot.mjs open <비밀번호> > 본문.html
//
// 형식: base64( salt 16바이트 | iv 12바이트 | AES-GCM 암호문 )
// 열쇠: PBKDF2-SHA256(비밀번호, salt, ITER) → AES-256-GCM. 페이지의 ITER 값과 같아야 한다.
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ITER = 250000;
const PAGE = join(dirname(fileURLToPath(import.meta.url)), '..', 'chumobot', 'index.html');
const RE = /(<script type="text\/plain" id="sealed">)([\s\S]*?)(<\/script>)/;

async function keyFor(pin, salt, usage) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, [usage]);
}

async function seal(bodyPath, pin) {
  const html = readFileSync(bodyPath, 'utf8');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFor(pin, salt, 'encrypt');
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(html)));
  const all = new Uint8Array(16 + 12 + ct.length);
  all.set(salt, 0); all.set(iv, 16); all.set(ct, 28);
  const b64 = Buffer.from(all).toString('base64').replace(/.{1,100}/g, '$&\n');
  const page = readFileSync(PAGE, 'utf8');
  if (!RE.test(page)) throw new Error('봉인 자리(<script id="sealed">)를 찾지 못했다');
  writeFileSync(PAGE, page.replace(RE, (_, a, __, c) => a + '\n' + b64 + c));
  console.error(`봉인 완료 — 평문 ${html.length}자 → 암호문 ${all.length}바이트`);
}

async function open(pin) {
  const page = readFileSync(PAGE, 'utf8');
  const raw = Buffer.from(page.match(RE)[2].replace(/\s+/g, ''), 'base64');
  const key = await keyFor(pin, raw.subarray(0, 16), 'decrypt');
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.subarray(16, 28) }, key, raw.subarray(28));
  process.stdout.write(new TextDecoder().decode(pt));
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'seal' && a && /^\d{4}$/.test(b || '')) await seal(a, b);
else if (cmd === 'open' && /^\d{4}$/.test(a || '')) await open(a);
else { console.error('사용법: seal <본문.html> <비밀번호 4자리> | open <비밀번호 4자리>'); process.exit(1); }
