// 난이도 곡선 표 (28장): 6유형 × 3난이도를 4개씩 나란히 돌려 단계별 성공률 표를 낸다.
// 사용: node tools/balance.mjs [--games 20] [--diff normal] [--sect doomsday]   (simulate.mjs 를 SECT·DIFF·JSON 으로 부른다)
import { spawn } from 'node:child_process';
import { availableParallelism } from 'node:os';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const GAMES = Number(opt('--games', 20));
const DIFFS = opt('--diff', 'easy,normal,hard').split(',');
const SECTS = opt('--sect', 'doomsday,messiah,meditation,fortune,shaman,qigong').split(',');
const NAMES = { doomsday: '종말 예언형', messiah: '재림 교주형', meditation: '명상·수련', fortune: '기복·천도형', shaman: '신내림 점집', qigong: '기 수련·건강' };
const CURVE = { normal: [90, 80, 70, 65], easy: [100, 90, 80, 75], hard: [80, 70, 60, 55] };
const jobs = DIFFS.flatMap((diff) => SECTS.map((sect) => ({ diff, sect })));
const results = [];
const run = (job) => new Promise((done) => {
  const p = spawn(process.execPath, ['--max-old-space-size=1024', new URL('./simulate.mjs', import.meta.url).pathname, '--games', String(GAMES), '--diff', job.diff], { env: { ...process.env, SECT: job.sect, JSON: '1', ONLYBAL: '1' } });
  let out = '';
  p.stdout.on('data', (d) => { out += d; });
  p.on('close', () => {
    const line = out.split('\n').find((l) => l.startsWith('JSON '));
    results.push(line ? JSON.parse(line.slice(5)) : { ...job, error: true });
    process.stderr.write(`  ${job.diff} ${job.sect} 끝 (${results.length}/${jobs.length})\n`);
    done();
  });
});
const pool = Math.min(4, availableParallelism());
const queue = [...jobs];
await Promise.all(Array.from({ length: pool }, async () => { while (queue.length) await run(queue.shift()); }));

const pc = (a, b) => (b ? Math.round((a / b) * 100) : null);
let bad = 0;
for (const diff of DIFFS) {
  console.log(`\n■ ${diff} (유형마다 ${GAMES}판) 목표 ${CURVE[diff].join(' · ')}%`);
  console.log('  유형          1단계  2단계  3단계  4단계   (실패 이유 2·3·4)');
  for (const sect of SECTS) {
    const r = results.find((x) => x.sect === sect && x.diff === diff);
    if (!r || r.error) { console.log(`  ${NAMES[sect]} 오류`); bad++; continue; }
    const rates = [pc(r.p1, r.n), pc(r.p2, r.p1), pc(r.p3, r.p2), pc(r.p4, r.p3)];
    const marks = rates.map((v, i) => { const w = CURVE[diff][i]; const ok = v != null && v >= w - 5 && (i === 0 || v <= w + 5); if (!ok) bad++; return `${String(v ?? '-').padStart(4)}%${ok ? ' ' : '!'}`; });
    console.log(`  ${NAMES[sect].padEnd(10)} ${marks.join(' ')}  ${r.why2 || '-'} | ${r.why3 || '-'} | ${r.why4 || '-'}`);
  }
}
console.log(bad ? `\n✗ 곡선 밖 ${bad}칸` : '\n✓ 모두 곡선 안');
