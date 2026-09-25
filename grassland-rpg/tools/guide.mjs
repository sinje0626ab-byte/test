// 게임 가이드북 HTML 만들기: node tools/guide.mjs <출력 폴더>
// 데이터(src/data/*.json)에서 표를 모두 뽑고, 출력 폴더의 img/ 그림(render.html·스크린샷)을 쓴다.
import fs from 'fs';
import path from 'path';
import { itemArt } from '../src/ui/itemArt.js';
import { skillArt } from '../src/ui/uiArt.js';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = process.argv[2];
const load = (n) => JSON.parse(fs.readFileSync(path.join(root, '../src/data', `${n}.json`), 'utf8'));
const D = Object.fromEntries(['config', 'player', 'monsters', 'items', 'buildings', 'turrets', 'regions', 'levels', 'skills', 'recipes', 'shop', 'bosses', 'nodes', 'weapons', 'npcs', 'dialogues', 'quests', 'bounties'].map((n) => [n, load(n)]));
const I = D.items.items;
const has = (f) => fs.existsSync(path.join(out, 'img', f));
const img = (f, cls = '') => (has(f) ? `<img class="${cls}" src="img/${f}">` : '');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pct = (v) => `${Math.round(v * 1000) / 10}%`;
const num = (v) => (Number.isInteger(v) ? v : Math.round(v * 100) / 100);

// ── 능력치 표기 ─────────────────────────────
function stat(k, v) {
  const label = D.items.statLabels[k] ?? k;
  if (typeof v === 'boolean' || (k === 'slowImmune')) return label;
  const p = D.items.percentStats.includes(k);
  const val = p ? pct(v) : num(v);
  return `${label} ${v > 0 ? '+' : ''}${val}`;
}
const bonusText = (b) => Object.entries(b ?? {}).map(([k, v]) => stat(k, v)).join(', ');
const regionName = (id) => D.regions[id]?.name ?? id;
const chip = (c, name) => `<span class="grade" style="--g:${c}">${name}</span>`;
const gradeChip = (g) => chip(D.items.grades[g]?.color, D.items.grades[g]?.name ?? '');

// ── 아이템 아이콘: 게임과 같은 아트(src/ui/itemArt.js) ──
const itemPic = (id) => itemArt(id, I[id], 'pic svg');

// ── 얻는 곳 ─────────────────────────────────
const sources = {};
const addSrc = (id, s) => { (sources[id] ??= new Set()).add(s); };
for (const [mid, m] of Object.entries(D.monsters)) {
  for (const dr of [...(m.drops ?? []), ...(m.bossDrops ?? [])]) {
    const ids = dr.oneOf ?? [dr.item];
    for (const id of ids) if (id !== 'gold') addSrc(id, `${m.name}${dr.chance < 1 ? ` (${pct(dr.chance)})` : ''}${dr.oneOf ? ' (중 하나)' : ''}`);
  }
}
for (const n of Object.values(D.nodes.nodes)) for (const dr of n.drops) addSrc(dr.item, `채집: ${n.name}`);
for (const r of Object.values(D.recipes)) addSrc(r.result, '제작 (작업대)');
for (const s of D.shop.buy) addSrc(s.id, `상점 ${s.price}골드`);
for (const q of D.quests.quests) for (const it of q.reward.items ?? []) addSrc(it.id, `퀘스트 「${q.title}」`);
for (const c of Object.values(D.config.garden.crops)) addSrc(c.item, '텃밭 수확');
addSrc('doctor_lens', '몬스터 도감 50%');
for (const b of D.bounties.bonusItems) addSrc(b, '현상금 의뢰 보너스');

// ── 스킬 아이콘: 게임과 같은 배지(src/ui/uiArt.js) ──
const skillIcon = (id, s) => skillArt(id, D.skills.branches[s.branch].color, 'skill-ic');

// ── 페이지 조각 ─────────────────────────────
const P = []; // 페이지들
const toc = [];
let chap = 0;
function chapter(title, en, body) {
  chap += 1;
  toc.push([chap, title]);
  P.push(`<section class="chapter" id="c${chap}"><header class="ch-head"><span class="ch-no">${String(chap).padStart(2, '0')}</span><div><h1>${title}</h1><p class="ch-en">${en}</p></div></header>${body}</section>`);
}
const table = (head, rows, cls = '') => `<table class="${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const shot = (f, cap) => (has(`shot_${f}.png`) ? `<figure class="shot">${img(`shot_${f}.png`)}<figcaption>${cap}</figcaption></figure>` : '');
const tip = (t) => `<div class="tip"><b>TIP</b> ${t}</div>`;
const box = (title, body) => `<div class="box"><h3>${title}</h3>${body}</div>`;

const C = D.config;

// 1. 소개
chapter('게임 소개', 'Welcome to the Meadow', `
  <div class="grid2">${shot('base', '낮: 요새로 키운 기지. 포탑·부속 건물·벽·동물 주민')}${shot('night', '밤: 달빛·모닥불·텐트 불빛, 눈이 빛나는 밤 몬스터')}</div>
  <p class="lead"><b>Meadow Pioneers (초원 개척단)</b>은 작은 텐트 하나로 시작해 초원을 개척하는 로우폴리 오픈필드 액션 RPG입니다. 몬스터를 사냥하고 재료를 모아 기지를 세우고, 포탑으로 밤 습격을 막으며 더 먼 지역으로 나아갑니다. 네 지역의 보스를 모두 물리치면 붉은 달 밤에 최종 보스 <b>밤의 군주</b>가 찾아옵니다.</p>
  <div class="grid3">
    ${box('핵심 루프', '<ol><li>탐험하며 몬스터 사냥·채집</li><li>재료·골드·경험치 모으기</li><li>기지 건설·포탑 설치</li><li>밤 습격 막아 내기</li><li>더 먼 지역에 새 기지</li></ol>')}
    ${box('이 게임만의 재미', '<ul><li>기지를 여러 개 — 멀티 기지</li><li>골드로 포탑을 세워 자동 방어</li><li>플레이어가 없는 기지도 습격당한다 (원격 계산)</li><li>동물 주민과 메인 퀘스트, 엔딩</li></ul>')}
    ${box('경제 원칙', '<p><b>재료 = 건설·제작</b><br><b>골드 = 포탑·상점·강화</b></p><p>역할이 섞이지 않아서 무엇을 모아야 할지 분명합니다.</p>')}
  </div>
  <h2>하루의 흐름</h2>
  <p>하루는 실제 시간 약 ${Math.round((C.time.dayLength + C.time.nightLength) / 60)}분 (낮 ${C.time.dayLength / 60}분, 밤 ${C.time.nightLength / 60}분). 해 지기 ${C.time.nightWarning}초 전에 경고가 나오고, 밤이 되면 모든 기지에 습격이 옵니다. 밤에 태어난 필드 몬스터는 ${C.spawner.nightStatMultiplier}배 강합니다.</p>
  <p>밤은 그냥 어두워지는 게 아니라 남색 하늘빛과 차가운 달빛으로 바뀌고, 모닥불·텐트는 따뜻하게 빛납니다. 플레이어 곁에는 작은 등불이 있어 어둠 속에서도 잘 보입니다. <b>밤 몬스터</b>는 몸이 살짝 어둡고 차가워지며 <b>눈이 은은히 빛나고, 작은 빛 조각 둘이 곁을 맴돕니다</b> — 멀리서도 알아볼 수 있어요.</p>
`);

// 2. 시작하기
chapter('시작하기', 'Getting Started', `
  <div class="grid2">${shot('title', '타이틀 화면 — 슬롯 3개, 이어하기·새 게임·조작 방법·설정')}${shot('creator', '캐릭터 만들기 — 고르는 대로 바로 입혀 본다')}</div>
  <h2>저장 슬롯</h2>
  <p>타이틀에서 슬롯 1~3 중 하나를 고릅니다. 각 슬롯은 따로 저장되고, 마지막으로 고른 슬롯을 기억합니다. 자동 저장은 ${C.save.autosaveInterval}초마다, 그리고 탭을 닫거나 숨길 때 됩니다.</p>
  <h2>캐릭터 만들기</h2>
  <p>이름(최대 ${C.character.nameMax}자, 기본 "${C.character.defaultName}"), 머리 색 ${C.character.hairColors.length}가지, 옷 색 ${C.character.clothesColors.length}가지, 머리 장식(${C.character.accessories.map((a) => a.name).join('·')})을 고릅니다. 옷 색은 몸 장비를 입지 않았을 때 보이고, 모자를 쓰면 머리 장식은 숨습니다.</p>
  <div class="cards6">
    ${['default', 'flower', 'ribbon', 'blue', 'grass', 'snow'].map((k, i) => `<div class="card">${img(`player_${k}.png`, 'pic big')}<small>${['기본 (새싹 잎)', '꽃 장식', '리본', '장식 없음', '초원 세트 + 대나무 창', '설원 세트 + 빙하 망치'][i]}</small></div>`).join('')}
  </div>
  <div class="swatches"><b>머리 색</b>${C.character.hairColors.map((c) => `<i style="background:${c}"></i>`).join('')}<b>옷 색</b>${C.character.clothesColors.map((c) => `<i style="background:${c}"></i>`).join('')}</div>
  ${shot('welcome', '새 게임 환영 카드 3장: 이동·공격 → 첫 기지 → 밤 습격')}
  <h2>처음 10분 추천 순서</h2>
  <ol class="steps">
    <li>근처 슬라임을 잡아 골드와 슬라임 젤리를 모은다</li>
    <li>가방(I)에서 <b>텐트 키트</b>를 우클릭(모바일: 두 번 탭) → 넓은 곳에 설치 = 첫 기지</li>
    <li><b>부엉 박사</b>에게 보고해 모닥불 설계도·약초차 받기</li>
    <li>건설(B) → 나무 활 포탑 1~2개. 나무·돌은 나무와 바위를 때려서 캔다</li>
    <li>해가 지기 전에 기지로 돌아와 첫 습격을 막는다</li>
  </ol>
`);

// 3. 조작
chapter('조작 방법', 'Controls', `
  <div class="grid2">
    ${box('PC (키보드·마우스)', table(['조작', '키'], [
      ['이동 / 달리기', 'W A S D / Shift'], ['공격', '마우스 왼쪽 클릭 (마우스 쪽으로)'], ['구르기 (잠깐 무적)', 'Space'],
      ['액티브 스킬', 'Q · R'], ['상호작용', 'E (건물·포탑·주민·묘비)'], ['소모품', '숫자 1~5'],
      ['가방 / 캐릭터 / 스킬', 'I / C / K'], ['건설 / 지도', 'B / M'], ['메뉴 · 창 닫기', 'ESC'], ['아이템 사용·장착', '가방에서 우클릭, 드래그로 옮기기'],
    ], 'compact'))}
    ${box('모바일 (터치)', table(['조작', '방법'], [
      ['이동', '왼쪽 조이스틱 (끝까지 밀면 달리기)'], ['공격', '빨간 공격 버튼 — 가까운 적 자동 조준, 없으면 채집 노드'],
      ['구르기', '초록 구르기 버튼'], ['액티브 스킬', '공격 버튼 위 둥근 버튼 2개'], ['상호작용', '나타나는 E 버튼'],
      ['창', '오른쪽 메뉴 버튼 (가방·캐릭터·스킬·건설·지도)'], ['아이템', '탭: 설명 · 두 번 탭: 사용·장착'], ['건설', '화면 탭으로 자리 → "설치"'],
      ['벽', '탭(시작) → 탭(끝) → "설치"'], ['지도', '미니맵을 탭'],
    ], 'compact'))}
  </div>
  <h2>화면 구성 (HUD)</h2>
  ${shot('inventory', '가방을 연 모습. 장비에 마우스를 올리면 지금 장비와 비교(▲▼)가 나온다')}
  <div class="grid2">
    <ul class="legend">
      <li><b>왼쪽 위</b> — 레벨·이름(칭호)·HP·스태미나·경험치, 그 아래 버프 아이콘과 퀘스트 목표 한 줄</li>
      <li><b>오른쪽 위</b> — 메뉴(☰), 날짜·지역·다음 낮/밤까지 남은 시간, 골드, <b>미니맵</b></li>
      <li><b>미니맵</b> — 기지(주황 삼각형), 보스 둥지(빨강/처치 후 회색), 주민, 묘비, 퀘스트 목표(노랑·밖이면 화살표)</li>
    </ul>
    <ul class="legend">
      <li><b>가운데 위</b> — 보스 체력바, 습격 웨이브 "웨이브 2/3"</li>
      <li><b>아래</b> — 퀵슬롯 1~5 (가방의 소모품 순서대로), 스킬 Q·R (쿨다운 원)</li>
      <li><b>왼쪽 아래</b> — 획득 로그 "+3 나무 토막"</li>
      <li><b>오른쪽</b> — 알림. 멀리 있는 기지가 습격당하면 화면 가장자리에 기지 방향 화살표</li>
    </ul>
  </div>
`);

// 4. 세계와 지역
const regionRows = Object.entries(D.regions).sort((a, b) => a[1].difficulty - b[1].difficulty).map(([id, r]) => {
  const boss = Object.values(D.bosses).find((b) => b.region === id);
  return [`<b style="color:${r.mapColor}">■</b> <b>${r.name}</b>`, r.difficulty, `×${r.statMultiplier}`, [...new Set(r.monsters)].map((m) => D.monsters[m].name).join(', '),
    r.raidPool.map((p) => `${D.monsters[p.monster].name}×${p.weight}`).join(', '), boss?.name ?? '-'];
});
chapter('세계와 지역', 'The World', `
  <p>세계는 남북으로 긴 땅입니다. 북쪽(화면 위 W 방향)부터 <b>설원 · 숲 · 초원(시작) · 사막</b> 순서로 이어지고, 가장자리는 침엽수 벽으로 막혀 있습니다. 지역마다 몬스터·재료·보스가 달라서 여러 곳에 기지를 둘 이유가 생깁니다.</p>
  ${table(['지역', '난이도', '몬스터 세기', '필드 몬스터', '습격 몬스터 (가중치)', '보스'], regionRows)}
  <div class="grid2">${shot('map', '지도(M). 가 본 곳만 밝혀지고, 기지 사이 빠른 이동이 가능하다')}${shot('forest', '숲: 전나무가 빽빽하고 가시 늑대·포자 버섯이 산다')}</div>
  <h2>날씨</h2>
  <p>매일 아침 날씨가 정해집니다. 궂은 날(${pct(C.weather.stormChance)})이면 초원·숲은 <b>비</b>, 사막은 <b>모래바람</b>(시야가 짧아짐), 설원은 <b>눈</b>이 옵니다. 설원은 맑은 날에도 ${pct(C.weather.snowChance)} 확률로 눈이 옵니다. 비 오는 날엔 주민들이 비 이야기를 합니다.</p>
  <div class="grid3">${shot('rain', '비 오는 초원과 연못')}${shot('sandstorm', '사막 모래바람')}${shot('snow', '설원의 눈')}</div>
  <p>초원·숲의 맑은 낮엔 <b>나비</b>, 밤엔 <b>반딧불이</b>가 날아다닙니다. 초원에는 연잎이 뜬 <b>연못</b>이 ${C.ponds.length}개 있습니다 (들어갈 수 없음).</p>
`);

// 5. 채집
chapter('채집', 'Gathering', `
  <p>나무·바위·풀은 <b>공격으로 캡니다</b>. 칼 부채꼴 안에 들어오면 한 번에 ${C.gather.damage} × (1 + 손놀림) 피해. 체력이 0이 되면 재료가 떨어지고 경험치도 받습니다. 캔 자리는 그루터기·부서진 바위가 되고 며칠 뒤 아침에 되살아납니다.</p>
  <div class="cards4">${Object.entries(D.nodes.nodes).map(([id, n]) => `
    <div class="card">${img(`node_${id}.png`, 'pic big')}<b>${n.name}</b>
      <small>체력 ${n.hp} · 복구 ${n.respawnDays}일 · XP ${n.xp}</small>
      <small>${n.drops.map((d) => `${I[d.item].name} ${d.min}~${d.max}${d.chance < 1 ? ` (${pct(d.chance)})` : ''}`).join(', ')}</small>
      <small class="muted">${Object.entries(D.nodes.density).filter(([, v]) => v[id]).map(([r]) => regionName(r)).join('·')}</small>
    </div>`).join('')}</div>
  ${tip('모바일에서 공격 버튼은 가까운 적이 없으면 가까운 채집 노드를 자동으로 겨냥합니다.')}
`);

// 6. 성장
const xpRows = [1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 39].map((lv) => [lv, Math.round(D.levels.xpBase * D.levels.xpGrowth ** (lv - 1))]);
const pl = D.player;
chapter('캐릭터 성장', 'Growth', `
  <div class="grid2">
    ${box('기본 능력치', table(['능력치', '값'], [['HP', pl.hp], ['스태미나', pl.stamina], ['공격력', pl.attack], ['방어력', pl.defense], ['이동속도', pl.moveSpeed], ['치명타 확률 / 배율', `${pct(pl.critChance)} / ×${pl.critMultiplier}`], ['HP 재생(초당)', pl.hpRegen], ['달리기 배율', `×${pl.runMultiplier}`]], 'compact'))}
    ${box('레벨', `<p>최대 레벨 <b>${D.levels.maxLevel}</b>. 레벨업마다 ${bonusText(D.levels.perLevel)} + 스킬 포인트 ${D.levels.skillPointsPerLevel}, HP·스태미나 가득 회복.</p>
      <p>다음 레벨까지 경험치 = ${D.levels.xpBase} × ${D.levels.xpGrowth}<sup>(레벨-1)</sup></p>${table(['레벨', '필요 경험치'], xpRows, 'compact')}`)}
  </div>
  <h2>경험치 얻는 곳</h2>
  <p>몬스터 처치(정예 ×${C.elite.xp}), 채집, 건물·포탑 건설, 기지 업그레이드, 텃밭 수확.</p>
  <h2>구르기와 스태미나</h2>
  <p>구르기: ${pl.rollDuration}초 동안 ${pl.rollDistance}m, 처음 ${pl.rollInvuln}초 무적, 스태미나 ${pl.rollStamina}. 달리기는 초당 스태미나 ${pl.staminaRunCost}. 스태미나는 멈춘 뒤 ${pl.staminaRegenDelay}초부터 초당 ${pl.staminaRegen} 찹니다.</p>
  <h2>쓰러지면</h2>
  <p>가장 가까운 기지 텐트 앞에서 ${pl.respawnDelay}초 뒤 부활하고 소지 골드의 ${pct(pl.deathGoldLossRatio)}를 잃습니다. 쓰러진 자리에 <b>묘비</b>가 남아 잃은 골드의 ${pct(C.tombstone.ratio)}를 E로 되찾을 수 있습니다 (다시 쓰러지면 예전 묘비는 사라짐).</p>
`);

// 7. 스킬
const sk = D.skills;
const skillCard = ([id, s]) => {
  const req = s.requires.map((q) => `${sk.skills[q.id].name} ${q.rank}`).join(', ') || '없음';
  const eff = s.active ? `<b>액티브</b> · 쿨 ${s.active.cooldown}초${s.active.stamina ? ` · 스태미나 ${s.active.stamina}` : ''}<br>랭크당 ${s.rankText}` : `랭크당 ${bonusText(s.effects)}`;
  return `<div class="skill">${skillIcon(id, s)}<div><b>${s.name}</b> <span class="muted">최대 ${s.maxRank}</span><p>${esc(s.description)}</p><small>${eff}</small><small class="muted">선행: ${req}</small></div></div>`;
};
chapter('스킬', 'Skills', `
  <p>레벨업마다 스킬 포인트 1. 스킬 창(K)에서 3갈래 트리에 찍습니다. 스킬은 한 번에 1랭크씩, 선행 스킬이 있어야 배웁니다. 최대 레벨까지 모아도 모든 스킬을 다 찍을 수 없으니 방향을 골라야 합니다. <b>망각의 물약</b>으로 전부 초기화할 수 있습니다.</p>
  ${shot('skills', '스킬 창. 액티브 스킬은 Q·R 버튼으로 슬롯에 등록한다')}
  ${Object.entries(sk.branches).map(([bid, br]) => `<h2 style="color:${br.color}">${br.name}</h2><div class="skills">${Object.entries(sk.skills).filter(([, s]) => s.branch === bid).sort((a, b) => a[1].tier - b[1].tier).map(skillCard).join('')}</div>`).join('')}
  ${box('액티브 스킬 자세히', `<ul>
    <li><b>돌진 베기</b>: 앞으로 ${sk.skills.dash_slash.active.distance}m 돌진(그동안 무적), 지나간 길의 적을 모두 공격력 ${pct(sk.skills.dash_slash.active.damage)}로 벤다. PC는 마우스 쪽, 모바일은 가까운 적 쪽</li>
    <li><b>응급 처치</b>: ${sk.skills.first_aid.active.duration}초에 걸쳐 최대 HP의 ${pct(sk.skills.first_aid.active.healPct)} 회복</li>
    <li><b>포탑 과부하</b>: 반경 ${sk.skills.overclock.active.radius}m 포탑 연사 ×${sk.skills.overclock.active.fireRate}, ${sk.skills.overclock.active.duration}초</li></ul>`)}
`);

// 8. 전투와 무기
const W = D.weapons;
chapter('전투와 무기', 'Combat & Weapons', `
  <p>데미지 = (공격력 − 방어력) × (1 ± ${pct(C.combat.variance)}), 최소 ${C.combat.minDamage}. 치명타는 ×${pl.critMultiplier}(+치명타 피해). 때리면 잠깐 멈칫하는 히트스톱과 화면 흔들림이 있습니다.</p>
  ${table(['무기 종류', '사거리', '각도', '쿨다운', '데미지 배율', '넉백', '특징'], Object.entries(W).map(([id, w]) => [`<b>${w.name}</b>`, w.range, w.arcDeg ? `${w.arcDeg}°` : '-', `${w.cooldown}초`, `×${w.damageMult}`, w.knockback,
    { sword: '기본. 회전 공격 스킬과 궁합', spear: '길고 좁게 찌른다 (부채꼴 안 모두 관통)', hammer: `느리지만 넓고 강함. ${w.shockEvery}타마다 충격파(반경 ${w.shockRadius})`, bow: `화살 발사, 스태미나 ${w.staminaCost}` }[id]]))}
  <h2>상태 이상</h2>
  <p><b>독</b>: 초당 ${C.status.poisonDps} 피해 (무적 시간 없이). <b>감속</b>: 이동 속도 −${pct(C.status.slowDefault)}. 같은 상태는 시간만 새로 됩니다. 머리 위에 초록(독)·파랑(감속) 아이콘. 플레이어도 걸리며, 독 저항은 시간과 피해를 줄이고 감속 면역이면 감속에 걸리지 않습니다.</p>
  <h2>특수 능력치</h2>
  <p>적중 시 독 · 적중 시 감속 · 처치 시 HP 회복 · 화살 추가 · 밤 몬스터에게 피해 · 치명타 피해 · 구르기 스태미나 · 독 저항 · 기지 안 HP재생 · 받는 피해 · 감속 면역 · 드롭률</p>
  ${tip('밤 몬스터 = 밤에 태어난 필드 몬스터와 습격 몬스터. 새벽검 같은 "밤 몬스터 피해" 장비가 빛을 발한다.')}
`);

// 9. 아이템
const cats = [['equipment', '장비'], ['consumable', '소모품'], ['material', '재료'], ['kit', '건설 키트']];
const itemCard = (id) => {
  const d = I[id];
  const extra = [];
  if (d.bonus) extra.push(bonusText(d.bonus));
  if (d.use?.heal) extra.push(`HP ${d.use.heal} 회복`);
  if (d.use?.buff) extra.push(`${d.use.buff.duration}초 ${bonusText(d.use.buff.effects)}`);
  if (d.use?.returnHome) extra.push('가장 가까운 기지로 귀환');
  if (d.use?.resetSkills) extra.push('스킬 초기화');
  const src = [...(sources[id] ?? [])].slice(0, 4).join(' · ');
  const slot = d.weaponType ? D.items.weaponNames[d.weaponType] : d.equipSlot ? D.items.equipSlots[d.equipSlot] ?? '장신구' : '';
  return `<div class="item"><div class="ipic">${itemPic(id)}</div><div class="itext"><b style="color:${d.grade === 'common' ? '#4a4338' : D.items.grades[d.grade]?.color}">${d.name}</b> ${gradeChip(d.grade)}${slot ? ` <span class="muted">${slot}</span>` : ''}
    ${extra.length ? `<small class="eff">${extra.join(' · ')}</small>` : ''}<small>${esc(d.description)}</small>${src ? `<small class="src">얻는 곳: ${src}</small>` : ''}${d.value ? `<small class="muted">판매 ${d.value}골드</small>` : ''}</div></div>`;
};
const order = Object.keys(D.items.grades);
const sortItems = (ids) => ids.sort((a, b) => order.indexOf(I[a].grade) - order.indexOf(I[b].grade) || I[a].name.localeCompare(I[b].name, 'ko'));
const equipBy = (slot) => sortItems(Object.keys(I).filter((id) => I[id].equipSlot === slot || (slot === 'accessory' && I[id].equipSlot === 'accessory')));
chapter('아이템 도감', 'Items', `
  <p>등급: ${Object.values(D.items.grades).map((g) => chip(g.color, g.name)).join(' ')} — 전설은 최종 보스 전용입니다. 희귀 이상은 아이콘 뒤에 등급 색 빛이 돌고(전설은 빛살까지), 바닥에 떨어지면 등급 색 빛 고리가 생깁니다. 무기는 바닥에서도 실제 모양으로 보입니다. 재료는 겹쳐지고(최대 ${C.inventory.defaultMaxStack}), 장비는 한 칸에 하나. 가방은 ${C.inventory.slots}칸이고 골드는 칸을 차지하지 않습니다.</p>
  ${[['weapon', '무기'], ['head', '머리'], ['body', '몸'], ['feet', '신발'], ['accessory', '장신구']].map(([s, n]) => `<h2>장비 — ${n}</h2><div class="items">${equipBy(s).map(itemCard).join('')}</div>`).join('')}
  <h2>세트 효과</h2>
  <p>세트는 능력치뿐 아니라 겉모습도 다릅니다. 초원은 잎 삿갓·잎 깃, 숲은 버섯 모자·가죽 띠, 사막은 두건·등 망토, 설원은 털모자·털 칼라.</p>
  <div class="cards4">${[['grass', '초원 세트'], ['forest', '숲 세트'], ['desert', '사막 세트'], ['snow', '설원 세트']].map(([k, n]) => `<div class="card">${img(`player_${k}.png`, 'pic big')}<small>${n}</small></div>`).join('')}</div>
  ${table(['세트', '구성', '3부위 보너스'], Object.values(D.items.sets).map((s) => [`<b>${s.name}</b>`, s.pieces.map((p) => I[p].name).join(' · '), bonusText(s.bonus)]))}
  ${cats.slice(1).map(([c, n]) => `<h2>${n}</h2><div class="items">${sortItems(Object.keys(I).filter((id) => I[id].category === c)).map(itemCard).join('')}</div>`).join('')}
`);

// 10. 제작·상점·강화
chapter('제작 · 상점 · 강화', 'Crafting, Shop & Forge', `
  <h2>제작법 (작업대)</h2>
  ${table(['결과', '재료', '필요 기지'], Object.values(D.recipes).map((r) => [`<b>${I[r.result].name}</b>${r.count > 1 ? ` ×${r.count}` : ''}`, r.ingredients.map((g) => `${I[g.id].name} ${g.count}`).join(', '), D.buildings.baseLevels[String(r.baseLevel)]?.name ?? `Lv${r.baseLevel}`]))}
  <div class="grid2">
    ${box('상점 판매 목록', `${table(['물건', '값'], D.shop.buy.map((s) => [I[s.id].name, `${s.price}골드`]), 'compact')}<p>다람쥐 <b>도토리</b>가 입주하면 매일 아침 하나를 <b>${pct(D.npcs.config.special.discount)} 할인</b>(오늘의 특가). 판매는 아이템의 판매가.</p>`)}
    ${box('장비 강화 (대장간)', `${table(['단계', '골드', '철광석', '능력치'], C.enhance.gold.map((g, i) => [`+${i} → +${i + 1}`, g, C.enhance.ore[i], `+${Math.round((i + 1) * C.enhance.statPerPlus * 100)}%`]), 'compact')}<p>실패 없음. 낀 장비와 가방 장비 모두 가능. 켜고 끄는 능력치(감속 면역·화살 추가)는 그대로.</p>`)}
  </div>
  <div class="grid2">${shot('forge', '대장간 강화 창')}${shot('shop', '상점. 특가 물건은 원래 값에 줄이 그어진다')}</div>
`);

// 11. 몬스터
const where = {};
for (const [rid, r] of Object.entries(D.regions)) {
  for (const m of r.monsters) (where[m] ??= new Set()).add(`${r.name} 필드`);
  for (const p of r.raidPool) (where[p.monster] ??= new Set()).add(`${r.name} 습격`);
}
const BEH = { melee: '근접', charger: '돌진', ranged: '원거리', darter: '치고 빠지기', burrower: '땅속 이동', exploder: '자폭' };
const monCard = ([id, m]) => {
  const tags = [BEH[m.behavior ?? 'melee'], m.flier && '비행', m.packMax && `무리 ${m.packMin}~${m.packMax}`, m.splitInto && `분열 → ${D.monsters[m.splitInto].name} ${m.splitCount}`, m.shotEffect && (m.shotEffect.type === 'poison' ? '독 탄' : '감속 탄'), m.hitEffect && '적중 시 독'].filter(Boolean);
  const drops = [...(m.drops ?? []), ...(m.bossDrops ?? [])].map((d) => (d.oneOf ? d.oneOf.map((x) => I[x].name).join('/') : `${I[d.item].name}${d.chance < 1 ? ` ${pct(d.chance)}` : ''}`)).join(', ');
  return `<div class="mon">${img(`monster_${id}.png`, 'pic mpic')}<div><b>${m.name}</b> ${tags.map((t) => `<span class="tag">${t}</span>`).join('')}
    <small class="stats">HP ${m.hp} · 공격 ${m.attack} · 방어 ${m.defense} · 속도 ${m.chaseSpeed} · XP ${m.xp}</small>
    ${m.lore ? `<small>${esc(m.lore)}</small>` : ''}<small class="src">${[...(where[id] ?? [])].join(' · ') || '보스·소환'}</small>${drops ? `<small class="muted">드롭: ${drops}</small>` : ''}</div></div>`;
};
const bossIds = new Set([...Object.values(D.bosses).map((b) => b.monster), 'king_slime_half', 'night_lord']);
chapter('몬스터 도감', 'Bestiary', `
  <p>수치는 지역 배율을 곱하기 전 기본값입니다 (초원 ×1 → 숲 ×${D.regions.forest.statMultiplier} → 사막 ×${D.regions.desert.statMultiplier} → 설원 ×${D.regions.snow.statMultiplier}).</p>
  ${table(['행동', '움직임'], [
    ['근접', '다가와서 튀어오르며 때린다. 체력이 낮으면 도망'], ['돌진', '멈춰서 바닥에 예고선 → 일직선 돌진. 나무·바위에 박으면 기절'],
    ['원거리', '거리를 두고 투사체. 가까이 가면 뒷걸음'], ['치고 빠지기', '빠르게 날아와 쏘고 멀리 빠진다'],
    ['땅속 이동', '숨어서(맞지 않음) 다가와 흙더미 예고 → 솟아오르며 범위 공격'], ['자폭', '부풀며 깜빡이다 폭발. 건물엔 더 아프다'],
    ['비행', '나무·바위·벽을 넘어 다닌다'], ['무리', '한 마리가 맞으면 무리 전체가 쫓아온다'],
  ], 'compact')}
  <h2>정예 몬스터</h2>
  <p>필드 스폰의 ${pct(C.elite.chance)}. 크기 ×${C.elite.scale}, 은은한 금빛. HP ×${C.elite.hp}, 공격 ×${C.elite.attack}, XP ×${C.elite.xp}, 골드 ×${C.elite.gold}, 장비 드롭 ×${C.elite.dropBonus}.</p>
  <div class="mons">${Object.entries(D.monsters).filter(([id]) => !bossIds.has(id)).map(monCard).join('')}</div>
`);

// 12. 보스
const PAT = { slam: '내려찍기 — 보스 둘레 원형', jump: '점프 — 플레이어 자리로 날아와 내려찍기', volley: '가시 난사 — 사방으로 가시', boulder: '얼음덩이 — 포물선으로 던져 떨어진 곳 범위', summon: '부하 소환', roots: '뿌리 줄기 — 바닥 직선 예고', leafstorm: '잎 폭풍 — 몸 주변을 돌며 퍼지는 잎', sleep: '포탑 잠재우기', blink: '순간이동 후 내려찍기', wave: '원형 파도 (구르기로 피하기)' };
const bossCard = ([bid, b]) => {
  const m = D.monsters[b.monster];
  const drops = [...(m.drops ?? []), ...(m.bossDrops ?? [])].map((d) => (d.oneOf ? `${d.oneOf.map((x) => I[x].name).join(' 또는 ')}` : `${I[d.item].name}${d.min > 1 ? ` ${d.min}` : ''}`)).join(', ');
  return `<div class="boss">${img(`monster_${b.monster}.png`, 'pic bpic')}<div><h3>${b.name} <span class="muted">${regionName(b.region)}</span></h3>
    <small class="stats">HP ${m.hp} · 공격 ${m.attack} · 방어 ${m.defense} · XP ${m.xp} · 재등장 ${b.respawnDays}일</small>
    <ul>${b.patterns.map((p) => `<li>${PAT[p.kind]}${p.damage ? ` (피해 ${p.damage})` : ''}${p.count && p.kind !== 'roots' ? ` ×${p.count}` : ''}</li>`).join('')}
    ${b.split ? `<li><b>HP ${pct(b.split.at)} 이하</b>: ${D.monsters[b.split.into].name} ${b.split.count}마리로 갈라진다 — 둘 다 잡아야 처치</li>` : ''}
    ${b.enrage ? `<li><b>HP ${pct(b.enrage.at)} 이하</b>: 분노 — 공격 속도 ×${b.enrage.speed}, 붉은 단풍색</li>` : ''}</ul>
    <small class="src">보상: ${drops}</small><small class="muted">${esc(m.lore ?? '')}</small></div></div>`;
};
const NL = C.nightLord;
const nlm = D.monsters.night_lord;
chapter('보스', 'Bosses', `
  <p>지역마다 보스가 하나씩 둥지에서 기다립니다. 둥지 가까이 가면 나타나고, 싸움이 시작되면 화면 위에 체력바. 모든 패턴은 <b>바닥의 빨간 예고</b> 뒤에 발동합니다. 둥지에서 너무 멀리 끌고 가면 돌아가서 체력을 회복합니다. 추천 순서: 왕슬라임 → 고목 수호자 → 선인장왕 → 얼음 거인.</p>
  <div class="bosses">${Object.entries(D.bosses).sort((a, b) => D.regions[a[1].region].difficulty - D.regions[b[1].region].difficulty).map(bossCard).join('')}</div>
  <div class="grid2">${shot('boss_king', '왕슬라임: 점프와 부하 소환, 반쯤 다치면 둘로 갈라진다')}${shot('boss_treant', '고목 수호자: 뿌리 줄기와 잎 폭풍')}</div>
  <h2 class="lord">최종 보스 — ${NL.name}</h2>
  <div class="boss">${img('monster_night_lord.png', 'pic bpic')}<div>
    <small class="stats">HP ${nlm.hp} · 공격 ${nlm.attack} · 방어 ${nlm.defense} · XP ${nlm.xp} · 떠다님</small>
    <p>네 지역 보스를 모두 잡으면, 다음 <b>붉은 달</b>에 <b>가장 레벨 높은 기지</b>의 마지막 웨이브로 옵니다 (그 기지 습격은 멀리 있어도 실시간). 하늘이 캄캄해지고 별이 쏟아집니다. 둥지로 돌아가도 회복하지 않고, 아침까지 못 잡으면 물러갔다가 다음 붉은 달에 다시 옵니다.</p>
    <ul><li><b>1페이즈</b>: 그림자 창 3연속 (직선 예고) · 밤 슬라임 소환</li>
      ${NL.phases.map((ph, i) => `<li><b>${i + 2}페이즈 (HP ${pct(ph.at)})</b>: ${ph.add.map((p) => PAT[p.kind]).join(' · ')}</li>`).join('')}</ul>
    <small class="src">보상: 새벽검(전설) · 골드 1000 → 해돋이와 엔딩</small></div></div>
  <div class="grid2">${shot('nightlord', '밤의 군주 습격. 하늘이 캄캄해진다')}${shot('ending', '엔딩 크레딧. "계속 개척하기"로 이어서 할 수 있다')}</div>
`);

// 13. 기지
const BL = D.buildings.baseLevels;
chapter('기지와 건물', 'Bases & Buildings', `
  <p>텐트 키트를 설치한 곳이 기지가 됩니다. 기지 영역 안에서는 필드 몬스터가 생기지 않고, 건물·포탑을 지을 수 있습니다. 텐트(중심 건물)가 부서지면 그날 밤 습격은 실패. 아침마다 체력이 가득 찹니다. 다른 지역에 텐트 키트를 설치하면 두 번째 기지 — 지도(M)에서 기지 사이 빠른 이동(기지 영역 안에서만).</p>
  <div class="cards4">${Object.entries(BL).map(([lv, b]) => `<div class="card">${img(`base_${lv}.png`, 'pic big')}<b>Lv${lv} ${b.name}</b><small>영역 ${b.areaRadius}m · 포탑 ${b.maxTurrets} · 체력 ${b.hp}</small><small class="muted">${b.cost?.length ? b.cost.map((c) => `${I[c.id].name} ${c.count}`).join(', ') : '텐트 키트'}</small></div>`).join('')}</div>
  ${shot('build', '건설 창(B). 건물 탭에서 기지 업그레이드·부속 건물·벽, 포탑 탭에서 포탑')}
  <h2>부속 건물</h2>
  <div class="cards4">${Object.entries(D.buildings.buildings).map(([id, f]) => `<div class="card">${img(`facility_${id}.png`, 'pic big')}<b>${f.name}</b><small>${esc(f.description)}</small><small class="muted">${BL[String(f.unlockBaseLevel)].name}부터 · ${f.cost.map((c) => `${I[c.id].name} ${c.count}`).join(', ')}${f.unlock ? ' · 설계도 필요' : ''}</small></div>`).join('')}</div>
  <h2>벽</h2>
  <div class="grid2">${Object.entries(D.buildings.walls).map(([id, w]) => `<div class="card row">${img(`wall_${id}.png`, 'pic big')}<div><b>${w.name}</b><small>${esc(w.description)}</small><small class="muted">${BL[String(w.unlockBaseLevel)].name}부터 · 1칸 ${w.cost.map((c) => `${I[c.id].name} ${c.count}`).join(', ')} · 체력 ${w.hp}</small></div></div>`).join('')}</div>
  <p>기지당 최대 ${C.walls.maxPerBase}칸. PC는 끌어서 한 줄, 모바일은 시작점·끝점을 탭. 벽은 <b>몬스터만</b> 막고 플레이어는 지나다닙니다. 습격 몬스터는 벽을 돌아서 오고, 완전히 막히면 가장 가까운 벽을 부숩니다. 부서진 벽은 사라지고, 남은 벽은 아침에 회복됩니다.</p>
  ${tip('벽으로 한쪽만 열어 두면 몬스터가 그 길로 몰립니다. 그 길목에 포탑을 모아 두세요.')}
`);

// 14. 포탑
const T = D.turrets;
chapter('포탑', 'Turrets', `
  <p>포탑은 <b>골드</b>로 세웁니다. 기지 레벨마다 설치 수가 정해져 있고, 앞에서 E를 눌러 업그레이드·수리·노리는 적 바꾸기·철거(설치비+업그레이드비의 ${pct(C.turret.demolishRefund)} 환급)를 합니다. 부서진 포탑은 잔해로 남아 골드로 수리해야 다시 쏩니다.</p>
  <div class="turrets">${Object.entries(T).map(([id, t]) => `<div class="card">${img(`turret_${id}.png`, 'pic')}${img(`turret_${id}_lv5.png`, 'pic')}<b>${t.name}</b><small>${esc(t.description)}</small>
    <small class="stats">데미지 ${t.damage} · 사거리 ${t.range} · 초당 ${t.fireRate}발 · 체력 ${t.hp}${t.splashRadius ? ` · 폭발 ${t.splashRadius}m` : ''}</small>
    <small class="muted">${BL[String(t.unlockBaseLevel)].name}부터 · 설치 ${t.cost}골드${t.buildItems ? ` + ${t.buildItems.map((c) => `${I[c.id].name} ${c.count}`).join(', ')}` : ''}</small>
    <small class="muted">업그레이드 ${t.upgradeCosts.join(' / ')}골드${t.upgradeItems ? ` (Lv4·5 + ${t.upgradeItems.filter(Boolean).map((l) => l.map((c) => `${I[c.id].name} ${c.count}`).join(' ')).join(' / ')})` : ''}</small></div>`).join('')}</div>
  <p>레벨마다 데미지 +${pct(T.wood_bow.damagePerLevel)}, 사거리 +${T.wood_bow.rangePerLevel}, 체력 +${pct(T.wood_bow.hpPerLevel)}. 레벨 상한 5. 레벨이 오를수록 모양이 자랍니다: Lv2 청동 테 → Lv3 쇠 보강판·징 → Lv4 깃발 → Lv5 금 테와 머리 위 금관. (위 그림: 왼쪽 Lv1, 오른쪽 Lv5)</p>
  ${shot('turret', '포탑 관리 창(E)')}
`);

// 15. 습격
const R = C.raid;
chapter('밤 습격', 'Night Raids', `
  <p>밤이 되면 <b>모든 기지</b>에 습격이 옵니다. 해 질 때 플레이어가 기지 가까이(영역 + ${R.presenceMargin}m) 있으면 실시간 전투, 아니면 아침에 <b>원격 계산</b>으로 정산합니다.</p>
  ${box('습격 세기 공식', `<ul>
    <li>진행도 = max(기지 레벨, 플레이어 레벨 ÷ ${R.progressPerPlayerLevels}) + 처치해 본 보스 수</li>
    <li>날짜 배율 = min(날짜−1, ${R.dayEarlyCap}) × ${R.dayFactorEarly} + max(0, 날짜−${R.dayEarlyCap + 1}) × ${R.dayFactorLate}</li>
    <li>능력치 배율 = (1 + 진행도 × ${R.statPerProgress} + 날짜 배율) × 지역 배율</li>
    <li>마릿수 = ${R.baseCount} + 진행도 × ${R.countPerProgress} + 지역 난이도 + min(날짜−1, ${R.countDayCap}) (최대 ${R.maxCount})</li></ul>`)}
  <h2>웨이브</h2>
  <p>습격은 웨이브 ${R.waves}개로 나눠 옵니다. 웨이브를 다 잡거나 ${R.waveTimeout}초가 지나면 ${R.waveRest}초 쉬고 다음 웨이브. 모두 막으면 아침에 보상 골드(${R.rewardBase} + 마리당 ${R.rewardPerMonster}).</p>
  <h2>붉은 달</h2>
  <p>${R.bloodMoon.every}일마다(${R.bloodMoon.every}·${R.bloodMoon.every * 2}·${R.bloodMoon.every * 3}…) 하늘이 붉어집니다. 습격 몬스터의 ${pct(R.bloodMoon.eliteChance)}가 정예, 마지막 웨이브에 그 지역 보스의 그림자(HP ${pct(R.bloodMoon.bossHp)})가 오고, 막으면 보상 ×${R.bloodMoon.rewardMultiplier}.</p>
  ${shot('bloodmoon', '붉은 달의 습격')}
  <h2>원격 계산과 실패</h2>
  <p>방어력 = 멀쩡한 포탑 초당 데미지 합 × ${R.remoteFightSeconds}초 (대포처럼 범위 포탑은 더 쳐 줌) + 벽 체력 합의 ${pct(C.walls.remoteHpRatio)}. 습격 체력보다 크면 방어 성공, ${pct(R.remotePartialRatio)} 이상이면 부분 피해(포탑이 깎임), 그 아래면 실패. 실패하면 그 기지 창고 재료의 ${pct(R.failStorageLossRatio)}를 잃고, 창고가 없으면 소지 골드의 ${pct(R.failGoldLossRatio)}를 잃습니다.</p>
  ${tip('멀리 있는 기지도 포탑과 벽을 충분히 세워 두면 혼자서 버팁니다. 창고는 실패해도 일부만 잃어요.')}
`);

// 16. 주민
const NP = D.npcs;
const joinText = (j) => (j.start ? '처음부터 (첫 기지 옆)' : j.facility ? `${D.buildings.buildings[j.facility].name} 건설` : `기지 ${j.bases}곳`);
const roleText = { shop: `상점 창 · 매일 오늘의 특가 ${pct(NP.config.special.discount)} 할인`, forge: '장비 강화 창', doctor: '메인 퀘스트 · 몬스터 도감. 낮엔 졸음', garden: `씨앗 판매 · 약초·사과를 값 ×${NP.config.garden.sellMultiplier}에 사 감`, courier: `택배: 창고 한 칸을 다른 기지 창고로 (${NP.config.courier.costPerSlot}골드, 다음 아침 도착)` };
chapter('동물 주민', 'Villagers', `
  <p>조건을 채우면 동물 주민이 기지에 입주합니다. 기지 안을 천천히 거닐고, 가까이 가서 <b>E</b>를 누르면 말풍선이 뜹니다. 레벨업 직후, 보스를 잡은 날, 해 지기 직전, 비 오는 날엔 다른 말을 합니다.</p>
  <div class="npcs">${Object.entries(NP.npcs).map(([id, n]) => `<div class="npc">${img(`npc_${id}.png`, 'pic big')}<div><h3>${n.name} <span class="muted">${n.animal}</span></h3>
    <small><b>입주</b> ${joinText(n.joins)}</small><small><b>역할</b> ${roleText[n.role]}</small>
    <p class="quote">“${esc(D.dialogues[id].greet[0].replace('{name}', '개척자'))}”</p><p class="quote">“${esc((D.dialogues[id].sleepy ?? D.dialogues[id].raidEve)[0])}”</p></div></div>`).join('')}</div>
  ${shot('dialogue', '주민과 대화. 글자는 타자기처럼 나오고, 선택지로 가게·강화·택배를 연다')}
`);

// 17. 퀘스트
const Q = D.quests.quests;
const rewardText = (r) => [r.gold && `골드 ${r.gold}`, ...(r.items ?? []).map((it) => `${I[it.id].name} ${it.count}`), r.unlock && `${D.buildings.buildings[r.unlock].name} 설계도`].filter(Boolean).join(', ') || '엔딩';
chapter('퀘스트 · 현상금 · 도감', 'Quests & Collections', `
  <h2>메인 퀘스트 (부엉 박사)</h2>
  <p>한 번에 하나씩, HUD 왼쪽 위에 목표 한 줄. 조건을 채우면 부엉 박사에게 "보고하기" → 보상 → 다음 퀘스트. 모닥불·대장간은 설계도가 있어야 지을 수 있습니다.</p>
  ${table(['#', '퀘스트', '목표', '보상'], Q.map((q, i) => [i + 1, `<b>${q.title}</b>`, q.goal, rewardText(q.reward)]))}
  <h2>현상금 게시판</h2>
  <p>게시판을 지으면 매일 아침 의뢰 ${D.bounties.perDay}개가 붙습니다: 몬스터 처치(지역 난이도만큼 많이), 재료 납품, 정예 처치. 보상은 골드, ${pct(D.bounties.bonusChance)} 확률로 ${D.bounties.bonusItems.map((b) => I[b].name).join('·')} 중 하나.</p>
  <div class="grid2">${shot('bounty', '현상금 게시판')}${shot('bestiary', '몬스터 도감')}</div>
  <h2>몬스터 도감 (부엉 박사)</h2>
  <p>처음 잡은 몬스터가 등록됩니다. ${C.bestiary.milestones.map((m) => `${m.kills}마리마다 골드 ${m.gold} + 그 몬스터 재료 ${m.material}`).join(', ')}. 완성률 ${C.bestiary.completion.map((c) => `${pct(c.ratio)} → 칭호 「${c.title}」${c.item ? ` + ${I[c.item].name}` : ''}${c.gold ? ` + 골드 ${c.gold}` : ''}`).join(', ')}.</p>
`);

// 18. 기타 시스템
chapter('알아 두면 좋은 것', 'Tips & Systems', `
  <div class="grid2">
    ${box('텃밭', `<p>${Object.entries(C.garden.crops).map(([s, c]) => `${I[s].name}: ${c.days}일 뒤 ${c.name} ${c.min}~${c.max}`).join('<br>')}</p><p>씨앗은 상점·꿀비. 심고 아침이 지나면 거둔다.</p>`)}
    ${box('모닥불', `<p>반경 ${D.buildings.buildings.campfire.aura.radius}m 안에서 HP 재생 +${D.buildings.buildings.campfire.aura.hpRegen}. 밤에 주변을 밝힌다. 퀘스트 1 설계도.</p>`)}
    ${box('창고와 택배', '<p>창고는 기지마다 따로. "재료 모두 넣기"로 한 번에. 제비 하늘에게 부탁하면 다른 기지 창고로 보낸다.</p>')}
    ${box('가방 편의', '<p>정리 버튼(종류 → 등급 → 이름), 처음 얻은 아이템엔 빨간 점, 장비 비교 ▲▼, 퀵슬롯 1~5.</p>')}
    ${box('저장 옮기기', '<p>설정 → 내보내기로 저장을 글자로 복사 → 다른 기기에서 가져오기. 휴대폰 ↔ PC 이동이나 백업에.</p>')}
    ${box('설정', '<p>배경음·효과음 볼륨, 화면 흔들림, 데미지 숫자, 그림자(끄기/낮음/높음), 풀·꽃 장식 50/100%. 휴대폰이 느리면 그림자와 장식을 낮추자.</p>')}
  </div>
  <h2>공략 팁</h2>
  <ol class="steps">
    <li>첫 밤 전에 나무 활 포탑 2개면 충분. 두 번째 밤부터 벽으로 길목을 만든다</li>
    <li>보스는 빨간 예고를 보고 <b>구르기</b>로 피하자 (무적 시간)</li>
    <li>숲의 버섯은 가끔 텐트 키트를 떨어뜨린다 — 두 번째 기지의 재료</li>
    <li>요새(Lv4)에는 사막·설원 재료가 필요하다. 먼 지역에 기지를 두면 모으기 쉽다</li>
    <li>세트 3부위를 맞추면 보너스. 설원 세트는 감속 면역이라 눈꽃 요정 상대로 좋다</li>
    <li>붉은 달 밤은 보상 2배! 전날 포탑을 수리하고 물약을 챙기자</li>
    <li>밤의 군주 3페이즈 파도는 링이 지나가는 순간 구르면 안전하다</li>
  </ol>
`);

// ── 표지·목차 ───────────────────────────────
const cover = `<section class="cover">
  <div class="cover-logo"><span class="g">Meadow</span> <span class="o">Pioneers</span></div>
  <div class="cover-ko">초원 개척단</div>
  <p class="cover-sub">공식 가이드북 · 모든 것을 담은 도감</p>
  <div class="cover-art">${['npc_dotori', 'player_flower', 'monster_slime', 'npc_buheong', 'monster_king_slime', 'npc_kkulbi'].map((f) => img(`${f}.png`)).join('')}</div>
  ${img('shot_title.png', 'cover-shot')}
  <p class="cover-foot">작은 텐트 하나로 시작하는 초원 모험</p></section>`;
const tocHtml = `<section class="toc"><h1>차례</h1><ol>${toc.map(([n, t]) => `<li><span>${String(n).padStart(2, '0')}</span>${t}</li>`).join('')}</ol>
  <div class="toc-stats">${[['아이템', Object.keys(I).length], ['몬스터', Object.keys(D.monsters).length], ['스킬', Object.keys(sk.skills).length], ['포탑', Object.keys(T).length], ['건물', Object.keys(D.buildings.buildings).length + Object.keys(D.buildings.walls).length + 4], ['주민', Object.keys(NP.npcs).length]].map(([k, v]) => `<div><b>${v}</b><small>${k}</small></div>`).join('')}</div></section>`;

const css = fs.readFileSync(path.join(root, 'guide.css'), 'utf8');
// 글꼴: 출력 폴더에 fonts/local.css(내려받은 Jua·Noto Sans KR)가 있으면 그것, 없으면 Google Fonts
const fonts = fs.existsSync(path.join(out, 'fonts/local.css'))
  ? '<link href="fonts/local.css" rel="stylesheet">'
  : '<link href="https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">';
fs.writeFileSync(path.join(out, 'guide.html'), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Meadow Pioneers 가이드북</title>
${fonts}
<style>${css}</style></head><body>${cover}${tocHtml}${P.join('')}</body></html>`);
console.log('guide.html', P.length, 'chapters');
