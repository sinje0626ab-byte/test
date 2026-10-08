// 아트 카탈로그 HTML 만들기: node tools/artbook.mjs <출력 폴더>
// 게임의 모든 그림(코드로 그린 SVG 아이콘 + 3D 모델 렌더 + 화면)을 한눈에. 그림 교체(외부 생성 이미지)용 참고 자료.
// 출력 폴더: img/(tools/render.html 렌더 PNG) · shots/(게임 화면 JPG) · fonts/local.css(있으면)
import fs from 'fs';
import path from 'path';
import { itemArt, hintArt, M } from '../src/ui/itemArt.js';
import { skillArt, buildArt, cornerArt } from '../src/ui/uiArt.js';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = process.argv[2];
const load = (n) => JSON.parse(fs.readFileSync(path.join(root, '../src/data', `${n}.json`), 'utf8'));
const D = Object.fromEntries(['config', 'monsters', 'items', 'buildings', 'turrets', 'regions', 'skills', 'nodes', 'npcs', 'bosses'].map((n) => [n, load(n)]));
const I = D.items.items;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const has = (f) => fs.existsSync(path.join(out, f));
const png = (f) => (has(`img/${f}.png`) ? `<img src="img/${f}.png" loading="eager">` : '<span class="missing">없음</span>');

// 카드: 그림 + 이름 + id + 교체할 파일 경로 + 설명
const card = (pic, name, id, target, note = '', cls = '') => `
  <figure class="card ${cls}">
    <div class="pic">${pic}</div>
    <figcaption><b>${esc(name)}</b><code>${esc(id)}</code>${target ? `<span class="target">→ ${esc(target)}</span>` : ''}${note ? `<small>${esc(note)}</small>` : ''}</figcaption>
  </figure>`;
const grid = (cards, cols = 5) => `<div class="grid" style="--cols:${cols}">${cards.join('')}</div>`;

const S = []; // 시트(장): 각 시트는 PDF 한 장 이상 + 따로 PNG로도 뽑는다
let no = 0;
const sheet = (key, title, en, intro, body) => {
  no += 1;
  S.push(`<section class="sheet" data-sheet="${String(no).padStart(2, '0')}_${key}">
    <header class="sh-head"><span class="sh-no">${String(no).padStart(2, '0')}</span><div><h1>${title}</h1><p class="sh-en">${en}</p></div></header>
    ${intro ? `<p class="intro">${intro}</p>` : ''}${body}</section>`);
};
const spec = (rows) => `<table class="spec">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;

// ── 0. 표지 ─────────────────────────────
const counts = {
  items: Object.keys(I).length, skills: Object.keys(D.skills.skills).length,
  monsters: Object.keys(D.monsters).length, npcs: Object.keys(D.npcs.npcs).length,
  turrets: Object.keys(D.turrets).length, build: Object.keys(D.turrets).length + Object.keys(D.buildings.buildings).length + Object.keys(D.buildings.walls).length, weapons: Object.values(I).filter((d) => d.equipSlot === 'weapon').length,
};
const cover = `<section class="cover">
  <p class="cover-en">MEADOW PIONEERS</p>
  <h1 class="cover-ko">초원 개척단</h1>
  <p class="cover-title">아트 카탈로그</p>
  <p class="cover-sub">게임에 쓰이는 모든 그림 — 아이콘 · 캐릭터 · 몬스터 · 건물 · UI</p>
  <div class="cover-stats">
    <span><b>${counts.items}</b>아이템 아이콘</span><span><b>${counts.skills}</b>스킬 배지</span><span><b>${counts.build}</b>건설 아이콘</span>
    <span><b>${counts.monsters}</b>몬스터</span><span><b>${counts.npcs}</b>주민</span><span><b>${counts.weapons}</b>무기 3D</span>
  </div>
  <div class="cover-shot">${has('shots/10_hud.jpg') ? '<img src="shots/10_hud.jpg">' : ''}</div>
</section>`;

// ── 1. 이 문서 읽는 법 ─────────────────────────
sheet('readme', '읽는 법', 'How this catalog works', '', `
  <div class="cols2">
    <div class="box"><h3>그림이 만들어지는 방식</h3>
      <ul>
        <li><b>2D 아이콘</b>(아이템·스킬·건설·장비 칸·창 장식): 코드로 그린 SVG (48×48 격자). <code>src/ui/itemArt.js</code>, <code>src/ui/uiArt.js</code></li>
        <li><b>3D 모델</b>(플레이어·주민·몬스터·무기·포탑·건물·자원): three.js 로우폴리, 코드로 조립. <code>src/entities/*Model*.js</code></li>
        <li><b>초상화</b>(HUD 얼굴·도감·보스 체력바): 3D 모델을 그 자리에서 찍은 사진</li>
        <li><b>로고·버튼·창 틀·커서</b>: CSS + 글꼴 + 작은 SVG</li>
      </ul>
      <p>그래서 <b>게임 폴더엔 그림 파일이 없습니다</b>. 이 카탈로그의 그림은 모두 게임 코드에서 뽑았습니다.</p>
    </div>
    <div class="box"><h3>카드 읽는 법</h3>
      ${grid([card(itemArt('iron_sword', I.iron_sword, 'svg'), '무쇠 검', 'iron_sword', 'art/items/iron_sword.png', '묵직하고 잘 드는 검.')], 1)}
      <ul>
        <li><b>굵은 글씨</b> = 게임 속 이름, <code>id</code> = 코드 이름 (새 그림 파일 이름으로 그대로 씁니다)</li>
        <li><b>→ 경로</b> = 새 그림을 넣을 자리 (교체 작업 때 이 이름 그대로 저장)</li>
      </ul>
    </div>
  </div>
  <div class="box"><h3>교체 가능한 범위</h3>
    <table class="spec wide">
      <tr><th>종류</th><th>지금</th><th>새 그림으로 바꾸면</th></tr>
      <tr><td>아이템·스킬·건설 아이콘, 장비 칸, 창 장식, 커서, 로고</td><td>SVG</td><td><b>PNG를 그대로 교체</b> (가장 쉽고 효과 큼)</td></tr>
      <tr><td>몬스터·주민 초상화 (도감·대화창·보스 체력바)</td><td>3D 사진</td><td><b>PNG 초상화로 교체 가능</b></td></tr>
      <tr><td>게임 속 3D 몬스터·캐릭터·건물</td><td>코드 3D</td><td>그림은 <b>설정화(컨셉 아트)</b>로 쓰고, 3D 는 새로 만들거나 다듬음 (마지막 장 참고)</td></tr>
    </table>
  </div>`);

// ── 2. 스타일 기준 ────────────────────────────
const sw = (c, n) => `<span class="sw"><i style="background:${c}"></i><b>${esc(n)}</b><code>${c}</code></span>`;
sheet('style', '스타일 기준', 'Palette & look', '새 그림도 이 색과 느낌을 지키면 게임 안에서 어색하지 않습니다.', `
  <h2>재질 팔레트 (아이콘 공용, <code>itemArt.js M</code>)</h2>
  <div class="swatches">${Object.entries(M).map(([k, c]) => sw(c, k)).join('')}${sw('#3b2d22', '외곽선 INK')}</div>
  <h2>등급 색 (아이콘 테두리 빛)</h2>
  <div class="swatches">${Object.values(D.items.grades).map((g) => sw(g.color, g.name)).join('')}</div>
  <h2>스킬 갈래 색</h2>
  <div class="swatches">${Object.values(D.skills.branches).map((b) => sw(b.color, b.name)).join('')}</div>
  <h2>지역 색</h2>
  <div class="swatches">${Object.values(D.regions).map((r) => sw(r.mapColor, r.name)).join('')}</div>
  <div class="cols2">
    <div class="box"><h3>지금 그림의 규칙</h3><ul>
      <li>짙은 갈색 외곽선(<code>#3b2d22</code>), 왼쪽 위에서 오는 빛, 오른쪽 아래 그림자</li>
      <li>둥글고 통통한 비율, 귀엽고 따뜻한 동화풍. 무섭거나 사실적인 표현 없음</li>
      <li>아이콘은 정사각 48 격자 안 꽉 차게, 바닥에 옅은 타원 그림자</li>
      <li>UI: 나무 틀 + 양피지 바탕 + 금장식, 글꼴 Jua·Gowun Batang·Hahmlet·Cinzel</li>
    </ul></div>
    <div class="box"><h3>화면 예시</h3>${has('shots/11_inventory.jpg') ? '<img class="shot" src="shots/11_inventory.jpg">' : ''}</div>
  </div>`);

// ── 3. 화면 ──────────────────────────────────
const SHOTS = [['01_title', '타이틀'], ['04_creator', '캐릭터 만들기'], ['10_hud', '게임 화면 (HUD)'], ['11_inventory', '가방'], ['12_character', '캐릭터 창'], ['13_skills', '스킬 창'],
  ['16_build', '건설 창'], ['17_shop', '상점'], ['23_turret', '포탑 창'], ['24_dialogue', '주민 대화'], ['25_bestiary', '몬스터 도감'], ['15_map', '지도']];
sheet('screens', '게임 화면', 'In-game screens', '그림이 실제로 어떤 크기·배경에 놓이는지 보여 주는 화면입니다 (PC 1280×760).',
  `<div class="shots">${SHOTS.filter(([f]) => has(`shots/${f}.jpg`)).map(([f, n]) => `<figure><img src="shots/${f}.jpg"><figcaption>${n}</figcaption></figure>`).join('')}</div>`);

// ── 4. 아이템 아이콘 ──────────────────────────
const cats = D.items.categories ?? {};
const byCat = {};
for (const [id, def] of Object.entries(I)) (byCat[def.equipSlot ? `equip_${def.equipSlot}` : def.category] ??= []).push([id, def]);
const CAT_NAMES = { equip_weapon: '무기', equip_head: '머리', equip_body: '몸', equip_feet: '발', equip_accessory: '장신구' };
const catName = (k) => CAT_NAMES[k] ?? cats[k]?.name ?? cats[k] ?? k;
const order = ['material', 'consumable', 'seed', 'equip_weapon', 'equip_head', 'equip_body', 'equip_feet', 'equip_accessory'];
const catKeys = [...order.filter((k) => byCat[k]), ...Object.keys(byCat).filter((k) => !order.includes(k))];
const gradeOf = (d) => D.items.grades[d.grade];
sheet('items', '아이템 아이콘', `Item icons · ${counts.items}`, '가방·창고·상점·툴팁·획득 로그에 쓰입니다. 칸 크기 PC 52px / 모바일 44px. 등급이 있는 장비는 칸 테두리가 등급 색으로 빛납니다.',
  catKeys.map((k) => `<h2>${esc(catName(k))} <small class="cnt">${byCat[k].length}</small></h2>${grid(byCat[k].map(([id, d]) => card(itemArt(id, d, 'svg'), d.name, id, `art/items/${id}.png`, [gradeOf(d)?.name, d.description].filter(Boolean).join(' · '), d.grade ? `g-${d.grade}` : '')), 6)}`).join(''));

// ── 5. 장비 칸 · 스킬 · 건설 ─────────────────────
const SLOT_NAMES = { weapon: '무기', head: '머리', body: '몸', feet: '발', accessory: '장신구' };
sheet('slots_skills', '장비 칸 · 스킬 배지', 'Equip slot hints & skill badges',
  '장비 칸 그림은 빈 칸에 흐리게(회색 32%) 보이는 모양입니다. 스킬 배지는 갈래 색 원 + 흰 문장, 스킬 창과 액션 바에 쓰입니다.', `
  <h2>빈 장비 칸</h2>${grid(Object.entries(SLOT_NAMES).map(([s, n]) => card(hintArt(s).replace('class="item-svg hint"', 'class="svg"'), n, s, `art/slots/${s}.png`, '빈 칸 표시 (흐리게)')), 5)}
  ${Object.entries(D.skills.branches).map(([bid, br]) => `<h2>스킬 · ${esc(br.name)}</h2>${grid(Object.entries(D.skills.skills).filter(([, s]) => s.branch === bid).map(([id, s]) => card(skillArt(id, br.color, 'svg'), s.name, id, `art/skills/${id}.png`, s.description ?? '')), 6)}`).join('')}`);

const BUILD_IDS = [...Object.keys(D.turrets), ...Object.keys(D.buildings.buildings), ...Object.keys(D.buildings.walls)];
const bname = (id) => D.turrets[id]?.name ?? D.buildings.buildings[id]?.name ?? D.buildings.walls[id]?.name;
const bdesc = (id) => D.turrets[id]?.description ?? D.buildings.buildings[id]?.description ?? D.buildings.walls[id]?.description;
sheet('build_ui', '건설 아이콘 · UI 장식', 'Build icons & UI ornaments', '건설 창 카드 왼쪽 그림(64px)과 창 틀 장식입니다.', `
  <h2>건설 아이콘</h2>${grid(BUILD_IDS.map((id) => card(buildArt(id, 'svg'), bname(id), id, `art/build/${id}.png`, bdesc(id))), 6)}
  <h2>UI 장식</h2>${grid([
    card(cornerArt().replace('class="win-corner-svg"', 'class="svg"'), '창 모서리 금장식', 'win_corner', 'art/ui/win_corner.png', '왼쪽 위 기준, 네 모서리에 돌려서 씀 (34×34)'),
    card('<div class="coin-demo"></div>', '골드 동전', 'coin', 'art/ui/coin.png', '골드 표시 (CSS 그라데이션, 14~18px)'),
    card(has('shots/cursor.png') ? '<img src="shots/cursor.png" class="px">' : '', '마우스 커서', 'cursor', 'art/ui/cursor.png', '기본 커서 (28×28, 끝점 왼쪽 위)'),
    card(has('shots/cursor_hand.png') ? '<img src="shots/cursor_hand.png" class="px">' : '', '상호작용 커서', 'cursor_hand', 'art/ui/cursor_hand.png', 'E로 쓸 수 있는 것 위'),
    card(has('shots/logo.png') ? '<img src="shots/logo.png">' : '', '타이틀 로고', 'logo', 'art/ui/logo.png', '“초원 개척단” + MEADOW PIONEERS (지금은 글꼴+CSS)', 'wide'),
  ], 4)}
  ${has('shots/window.jpg') ? `<h2>창 틀 (나무 + 양피지 + 리본 제목)</h2><img class="shot half" src="shots/window.jpg">` : ''}`);

// ── 6. 캐릭터 ───────────────────────────────
const C = D.config.character;
const NPC_ROLE = { shop: '상점', forge: '대장장이', quest: '퀘스트', courier: '택배', garden: '정원' };
sheet('characters', '플레이어 · 주민', 'Player & villagers', '플레이어는 머리색·옷색·머리 장식을 고르고, 장비를 입으면 모양이 바뀝니다. 주민 5명은 동물 캐릭터입니다.', `
  <h2>캐릭터 만들기 · 머리 장식</h2>${grid(C.accessories.map((a) => card(png(`char_acc_${a.id}`), a.name, a.id, `art/concept/player_acc_${a.id}.png`)), 4)}
  <h2>머리색</h2>${grid(C.hairColors.map((h, i) => card(png(`char_hair_${i}`), `머리색 ${i + 1}`, h, '')), 6)}
  <h2>옷색</h2>${grid(C.clothesColors.map((c, i) => card(png(`char_clothes_${i}`), `옷색 ${i + 1}`, c, '')), 8)}
  <h2>장비 입은 모습</h2>${grid(['player_grass', 'player_forest', 'player_desert', 'player_snow', 'player_royal', 'player_cactus'].map((f) => card(png(f), { player_grass: '초원 장비', player_forest: '숲 장비', player_desert: '사막 장비', player_snow: '설원 장비', player_royal: '왕관', player_cactus: '선인장 왕관' }[f], f, '')), 6)}
  <h2>주민</h2>${grid(Object.entries(D.npcs.npcs).map(([id, n]) => card(png(`npc_${id}`), `${n.name} (${n.animal})`, id, `art/portraits/npc_${id}.png`, `${NPC_ROLE[n.role] ?? n.role} 담당 · 대화창 초상화`)), 5)}`);

// ── 7. 몬스터 ───────────────────────────────
const bossIds = new Set([...Object.values(D.bosses).map((b) => b.monster), 'king_slime_half', 'night_lord']);
const regionOfMonster = {};
for (const [rid, r] of Object.entries(D.regions)) {
  for (const m of r.monsters ?? []) regionOfMonster[m] ??= r.name;
  for (const p of r.raidPool ?? []) regionOfMonster[p.monster] ??= `${r.name} 습격`;
}
const mcard = (id) => { const m = D.monsters[id]; return card(png(`monster_${id}`), m.name, id, `art/portraits/monster_${id}.png`, [regionOfMonster[id], m.flier ? '비행' : '', m.lore].filter(Boolean).join(' · ')); };
const mids = Object.keys(D.monsters);
sheet('monsters', '몬스터', `Monsters · ${mids.length}`, '필드·습격 몬스터는 도감(초상화)과 게임 속 3D 로 보입니다. 밤 몬스터는 몸이 살짝 어둡고 눈이 빛나며 빛 조각 둘이 맴돕니다.', `
  <h2>필드 몬스터</h2>${grid(mids.filter((id) => !bossIds.has(id) && !id.startsWith('night_')).map(mcard), 5)}
  <h2>밤 몬스터 (습격)</h2>${grid(mids.filter((id) => id.startsWith('night_') && !bossIds.has(id)).map(mcard), 5)}
  <h2>보스</h2>${grid(mids.filter((id) => bossIds.has(id)).map(mcard), 4)}`);

// ── 8. 무기 3D ──────────────────────────────
const weapons = Object.entries(I).filter(([, d]) => d.equipSlot === 'weapon');
sheet('weapons', '무기 3D 모델', `Weapons · ${weapons.length}`, '플레이어 손에 들리는 3D 무기입니다. 아이콘(4장)과 같은 디자인이어야 합니다.',
  grid(weapons.map(([id, d]) => card(png(`weapon_${id}`), d.name, id, `art/concept/weapon_${id}.png`, `${D.items.weaponNames?.[d.weaponType] ?? d.weaponType ?? ''} · ${gradeOf(d)?.name ?? ''}`)), 5));

// ── 9. 포탑 · 건물 · 자원 ─────────────────────────
sheet('structures', '포탑 · 기지 · 건물', 'Turrets, bases & facilities', '포탑은 Lv1 과 Lv5(별 + 금관) 모습이 다릅니다. 기지는 텐트 → 움막 → 집 → 요새 4단계입니다.', `
  <h2>포탑 (Lv1 / Lv5)</h2>${grid(Object.entries(D.turrets).flatMap(([id, t]) => [card(png(`turret_${id}`), `${t.name} Lv1`, id, `art/concept/turret_${id}.png`), card(png(`turret_${id}_lv5`), `${t.name} Lv5`, `${id}_lv5`, '')]), 6)}
  <h2>기지 단계</h2>${grid(Object.entries(D.buildings.baseLevels).map(([lv, b]) => card(png(`base_${lv}`), `${b.name} (Lv${lv})`, b.model, `art/concept/base_${b.model}.png`)), 4)}
  <h2>부속 건물</h2>${grid(Object.entries(D.buildings.buildings).map(([id, f]) => card(png(`facility_${id}`), f.name, id, `art/concept/facility_${id}.png`, f.description)), 4)}
  <h2>벽</h2>${grid(Object.entries(D.buildings.walls).map(([id, w]) => card(png(`wall_${id}`), w.name, id, `art/concept/wall_${id}.png`)), 4)}
  <h2>채집 자원</h2>${grid(Object.entries(D.nodes.nodes).map(([id, n]) => card(png(`node_${id}`), n.name, id, `art/concept/node_${id}.png`)), 4)}`);

// ── 10. 파일 이름 정리 ─────────────────────────
const rowsN = [
  ['art/items/&lt;id&gt;.png', `아이템 ${counts.items}`, '512×512 PNG, 투명 배경, 정사각, 가운데'],
  ['art/slots/&lt;slot&gt;.png', '장비 칸 5', '512×512, 투명. 게임이 회색·흐리게 처리'],
  ['art/skills/&lt;id&gt;.png', `스킬 ${counts.skills}`, '512×512, 투명, 원형 배지'],
  ['art/build/&lt;id&gt;.png', `건설 ${counts.build}`, '512×512, 투명'],
  ['art/ui/*.png', 'UI 장식 5', '모서리 256×256 · 커서 64×64 · 로고 1600×600 · 동전 128×128'],
  ['art/portraits/monster_&lt;id&gt;.png', `몬스터 ${counts.monsters}`, '512×512, 투명, 얼굴·상반신이 보이게 (도감·보스바)'],
  ['art/portraits/npc_&lt;id&gt;.png', `주민 ${counts.npcs}`, '512×512, 투명, 상반신 (대화창)'],
  ['art/concept/*.png', '3D 설정화', '1536×1024, 흰/옅은 배경, 앞·옆·뒤 3면도 (3D 작업 참고용)'],
];
sheet('files', '파일 이름 · 크기 정리', 'Delivery spec', '새 그림은 아래 이름과 크기로 저장해 주시면 바로 교체할 수 있습니다.',
  `<table class="spec wide"><tr><th>저장 경로</th><th>개수</th><th>크기·형식</th></tr>${rowsN.map((r) => `<tr><td><code>${r[0]}</code></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`);

const fonts = has('fonts/local.css')
  ? '<link href="fonts/local.css" rel="stylesheet">'
  : '<link href="https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">';
fs.writeFileSync(path.join(out, 'artbook.html'), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>초원 개척단 아트 카탈로그</title>
${fonts}<style>${fs.readFileSync(path.join(root, 'artbook.css'), 'utf8')}</style></head><body>${cover}${S.join('')}</body></html>`);
console.log('artbook.html', S.length, 'sheets');
