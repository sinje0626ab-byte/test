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

  // 1) 방치 플레이 (본거지는 늘 대한민국)
  for (const deity of ['founder', 'monotheism', 'cosmos', 'ancestors', 'science']) run(`방치 · ${deity}`, { policy: 'idle', deity });
  run('방치 · founder · 외딴 섬', { policy: 'idle', deity: 'founder', site: 'island' });
  // 2) 괜찮은 플레이: 원칙별
  for (const deity of ['founder', 'monotheism', 'cosmos', 'ancestors', 'science']) run(`좋음 · ${deity}`, { policy: 'good', deity });
  // 3) 괜찮은 플레이: 규칙 조합별
  for (const t of [['communal', 'ascetic', 'open'], ['tithe', 'healing', 'secretive'], ['healing', 'open', 'ascetic'], ['tithe', 'communal', 'open'], ['secretive', 'ascetic', 'communal']]) {
    run(`좋음 · ${t.join('+')}`, { policy: 'good', deity: 'cosmos', tenets: t });
  }
  // 4) 성소 장소
  for (const [site, name] of [['mountain', '산골 폐교'], ['campus', '스터디 카페'], ['island', '외딴 섬']]) run(`좋음 · founder · ${name}`, { policy: 'good', deity: 'founder', site });
  // 5) 어두운 선택만
  for (const deity of ['founder', 'cosmos', 'monotheism']) run(`어둠 · ${deity}`, { policy: 'dark', deity });
  run('어둠 · founder · 외딴 섬', { policy: 'dark', deity: 'founder', site: 'island' });

  console.log(`시드 ${seeds}개씩 (중앙값). 턴 = 개월\n`);
  console.log('조합'.padEnd(36) + ' 100명  1천  1만  승리   승리턴  패배(사유)          패배턴  VIII  장부');
  for (const r of rows) {
    console.log(`${r.label.padEnd(36)} ${fmt(r.t100)}  ${fmt(r.t1k)} ${fmt(r.t10k)}  ${r.win.padEnd(5)} ${fmt(r.winTurn)}    ${r.lose.padEnd(18)} ${fmt(r.loseTurn)}   ${r.viii}/${seeds}  ${fmt(r.dark)}`);
  }
}
