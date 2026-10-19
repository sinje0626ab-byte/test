// npm run sim — 성향 × 조합 × 시드 결과 표
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const fmt = (v) => (v == null ? '  -' : String(v).padStart(3));
const REASON = { followers: '신도0', arrest: '체포', death: '사망', collapse: '붕괴', schism: '분열' };

export function table(runGame, seeds) {
  const seedList = Array.from({ length: seeds }, (_, i) => 101 + i * 37);
  const rows = [];
  const run = (label, opt) => {
    const rs = seedList.map((seed) => runGame({ turns: 420, seed, ...opt }));
    const wins = rs.filter((r) => r.result === 'victory');
    const reasons = {};
    for (const r of rs) if (r.result === 'defeat') reasons[REASON[r.reason] ?? r.reason] = (reasons[REASON[r.reason] ?? r.reason] ?? 0) + 1;
    rows.push({
      label,
      t100: med(rs.map((r) => r.reached[100])), t1k: med(rs.map((r) => r.reached[1000])), t10k: med(rs.map((r) => r.reached[10000])),
      win: `${wins.length}/${rs.length}`, winTurn: med(wins.map((r) => r.turn)),
      lose: Object.entries(reasons).map(([k, v]) => `${k}${v}`).join(' ') || '-',
      loseTurn: med(rs.filter((r) => r.result === 'defeat').map((r) => r.turn)),
      viii: rs.filter((r) => r.revs.VIII != null).length, dark: med(rs.map((r) => r.dark)),
    });
  };

  // 1) 방치 플레이
  for (const deity of ['founder', 'monotheism', 'cosmos', 'ancestors', 'science']) run(`방치 · ${deity} · 대한민국`, { policy: 'idle', home: '410', deity });
  run('방치 · founder · 미국', { policy: 'idle', home: '840', deity: 'founder' });
  run('방치 · founder · 체코', { policy: 'idle', home: '203', deity: 'founder' });
  // 2) 괜찮은 플레이 — 원칙별
  for (const deity of ['founder', 'monotheism', 'cosmos', 'ancestors', 'science']) run(`좋음 · ${deity} · 대한민국`, { policy: 'good', home: '410', deity });
  // 3) 괜찮은 플레이 — 울타리 조합별
  for (const t of [['communal', 'ascetic', 'open'], ['tithe', 'healing', 'secretive'], ['healing', 'open', 'ascetic'], ['tithe', 'communal', 'open'], ['secretive', 'ascetic', 'communal']]) {
    run(`좋음 · ${t.join('+')}`, { policy: 'good', home: '410', deity: 'cosmos', tenets: t });
  }
  // 4) 시작 국가
  for (const [home, name] of [['840', '미국'], ['076', '브라질'], ['566', '나이지리아'], ['356', '인도'], ['203', '체코']]) run(`좋음 · founder · ${name}`, { policy: 'good', home, deity: 'founder' });
  // 5) 어두운 선택만
  for (const deity of ['founder', 'cosmos', 'monotheism']) run(`어둠 · ${deity} · 대한민국`, { policy: 'dark', home: '410', deity });
  run('어둠 · founder · 미국', { policy: 'dark', home: '840', deity: 'founder' });

  console.log(`시드 ${seeds}개씩 (중앙값). 턴 = 개월\n`);
  console.log('조합'.padEnd(36) + ' 100명  1천  1만  승리   승리턴  패배(사유)          패배턴  VIII  장부');
  for (const r of rows) {
    console.log(`${r.label.padEnd(36)} ${fmt(r.t100)}  ${fmt(r.t1k)} ${fmt(r.t10k)}  ${r.win.padEnd(5)} ${fmt(r.winTurn)}    ${r.lose.padEnd(18)} ${fmt(r.loseTurn)}   ${r.viii}/${seeds}  ${fmt(r.dark)}`);
  }
}
