# CLAUDE.md — 초원 기지 RPG (가제)

이 문서는 게임의 설계 기준이다. 모든 작업은 이 문서를 먼저 읽고 따른다.
설계가 바뀌면 코드보다 이 문서를 먼저 수정한다.
2차 업데이트(Phase 7~14) 지시서: `docs/UPDATE_GUIDE2.pdf` — 이 문서와 함께 읽는다.

---

## 1. 게임 개요

- **장르**: 자유도 높은 오픈필드 액션 RPG + 기지 건설 + 타워 디펜스
- **분위기**: 동물의 숲 같은 아기자기한 로우폴리 초원
- **시점**: 비스듬한 탑다운 3D 카메라 (플레이어 추적)
- **플랫폼**: 웹 브라우저 (PC 우선, 키보드+마우스). 휴대폰·태블릿은 화면 터치 조작 (5-1)
- **배포**: GitHub Pages

### 핵심 루프
탐험 → 몬스터 사냥·채집 → 재료/돈/경험치 획득 → 기지 건설·포탑 설치 → 밤 습격 방어 → 더 먼 지역 탐험 → 새 기지 건설

### 차별점
- 기지를 여러 개 세우고 확장한다 (멀티 기지)
- 게임머니로 포탑을 세워 기지를 자동 방어한다
- 플레이어가 없는 기지도 습격당한다

---

## 2. 기술 스택

- **빌드**: Vite
- **언어**: JavaScript (ES Modules)
- **3D**: three.js (로우폴리, 기본 도형 위주, 외부 모델은 나중에)
- **UI**: HTML/CSS 오버레이 (캔버스 위에 DOM으로 창 띄우기)
- **저장**: localStorage (JSON 직렬화, 세이브 버전 필드 포함)
- **배포**: `vite build` → 결과물을 GitHub Pages에 배포 (`vite.config.js`에 base 경로 설정)
  - 이 레포는 루트를 그대로 Pages로 서비스한다. 그래서 빌드 결과는 `dist/` 대신 **레포 루트의 `grassland/`** 로 나간다 (`outDir: '../grassland'`, `base: './'`).
  - 소스는 `grassland-rpg/`, 배포물은 `grassland/`. 배포물은 손으로 고치지 않고 항상 `npm run build`로 다시 만든다.

### 실행
```bash
cd grassland-rpg
npm install
npm run dev      # 개발 서버
npm run build    # ../grassland/ 로 빌드
```

---

## 3. 폴더 구조

```
src/
  main.js              # 진입점, 게임 초기화
  core/
    Game.js            # 메인 루프 (update / render)
    Input.js           # 키보드·마우스 입력
    Camera.js          # 탑다운 추적 카메라
    EventBus.js        # 시스템 간 이벤트 통신
    Settings.js        # 설정 (세이브와 별도 localStorage)
    Synth.js           # Web Audio 합성 (효과음·악기)
    Time.js            # 게임 내 시간, 낮/밤
  world/
    World.js           # 지면·조명·충돌·경계, 청크 보이기/숨기기
    Decor.js           # 지역별 나무·바위·꽃 배치 (시드 난수)
    Chunk.js           # z 띠 하나의 장식 묶음 (따로 그리고 따로 숨긴다)
    Regions.js         # 지역(초원/숲/사막/설원) 찾기·색 섞기
  entities/
    Player.js
    PlayerModel.js     # 플레이어 모양, 무기 종류별 모양, 장비 색 반영
    PlayerAttack.js    # 무기 종류별 공격 (베기·찌르기·내려치기·활 쏘기)
    PlayerRoll.js      # 회피 구르기
    PlayerDash.js      # 돌진 베기 (액티브 스킬) 이동·판정
    Monster.js
    MonsterModel.js    # 몬스터 모양 (슬라임 / 버섯 / 선인장 / 골렘) + monsterShapes.js (Phase 10 신규 모양)
    monsterShapes.js   # 벌·토끼·포자버섯·늑대·그루터기·전갈·두더지·굴렁덤불·요정·설인·눈사람·보스 모양
    behaviors/         # 몬스터 행동 모듈 (melee·charger·ranged·darter·burrower·exploder), common.js 공용
    bossPatterns.js    # 보스 패턴 (내려찍기·점프·가시 난사·얼음덩이·소환·뿌리·잎 폭풍)
    RaidMonster.js     # 밤 습격 몬스터 AI
    Boss.js            # 보스 AI (패턴 고르기·쿨다운, 페이즈 분열·분노, 귀환)
    Drop.js            # 바닥에 떨어진 골드·아이템 (줍기)
    Projectile.js      # 화살, 총알, 포탄
    Particles.js       # 파티클 풀 (로우폴리 조각, InstancedMesh 하나)
    Building.js        # 기지 중심 건물 (텐트~요새)
    BaseModels.js      # 기지 단계별 모양
    Turret.js
    TurretModels.js    # 포탑 종류별 모양
    Facility.js        # 부속 건물 (작업대·창고·상점)
    FacilityModels.js  # 부속 건물 모양
    ResourceNode.js    # 나무, 바위, 풀 등 채집물 (모양·흔들림·캔 모습)
  systems/
    CombatSystem.js
    MonsterSpawner.js
    ExplorationSystem.js # 탐험한 칸(지도 안개), 지역 진입 알림
    BossSystem.js      # 보스 등장·재등장, 보스 투사체·분열
    EnemyShotSystem.js # 몬스터 투사체 (포자탄·얼음탄), 보스 잎 폭풍
    GatherSystem.js    # 채집 노드 배치·타격·드롭·복구
    ArrowSystem.js     # 플레이어 활 화살
    StatusSystem.js    # 상태 이상 (독·감속)
    BuffSystem.js      # 소모품 버프 (남은 시간·효과)
    FeedbackSystem.js  # 타격 연출 (히트스톱·화면 흔들림·파티클). 게임 로직은 건드리지 않는다
    SoundSystem.js     # 효과음 (이벤트 → 합성음)
    MusicSystem.js     # 배경음 (지역·낮밤·습격·보스에 따라 합성 루프)
    LootSystem.js
    InventorySystem.js
    EquipmentSystem.js
    StatsSystem.js     # 레벨, 경험치, 능력치
    SkillSystem.js
    ActiveSkillSystem.js # 액티브 스킬 Q·R 슬롯·쿨다운·발동
    BuildSystem.js     # 건설 모드, 배치 검증
    BaseSystem.js      # 기지 목록, 기지 레벨, 빠른 이동
    TurretSystem.js    # 타겟팅, 발사, 업그레이드·수리·철거
    InteractionSystem.js # E 상호작용 대상 찾기 (포탑·기지)
    RaidSystem.js      # 밤 습격 (실시간 + 원격 계산)
    EconomySystem.js   # 골드, 상점(사고팔기)
    FacilitySystem.js  # 부속 건물 설치·목록·아침 수리
    CraftingSystem.js  # 작업대 제작
    StorageSystem.js   # 기지별 창고
    SaveSystem.js
  ui/
    UIManager.js       # 창 열기/닫기, 단축키
    TouchControls.js   # 모바일 터치 조작 (조이스틱·버튼)
    SkillBar.js        # 액티브 스킬 슬롯 Q·R (PC 퀵슬롯 옆 / 모바일 공격 버튼 위, 쿨다운 원)
    TitleScreen.js     # 타이틀·새 게임/이어하기·조작 방법·새 게임 안내
    PauseMenu.js       # 게임 중 메뉴 (☰ / ESC)
    SettingsPanel.js   # 설정 창 (게임 메뉴·타이틀에서)
    HUD.js
    InventoryWindow.js
    CharacterWindow.js
    SkillWindow.js
    BuildMenu.js
    TurretWindow.js    # 포탑 관리 (E)
    ShopWindow.js
    CraftWindow.js
    StorageWindow.js
    MapWindow.js
    Tooltip.js
    styles.css         # 기본 HUD
    windows.css        # 창
    windows-map.css    # 포탑 관리·기지 업그레이드·지도 창
    touch.css          # 모바일 터치 조작
    title.css          # 타이틀·게임 메뉴
  utils/
    random.js          # 시드 난수 (월드 배치 재현용)
    slots.js           # 칸 목록에 넣기·빼기·세기 (가방·창고 공용)
  data/
    config.json        # 월드·카메라·스포너·전투 공통 수치
    player.json        # 플레이어 기본 능력치
    items.json
    monsters.json
    turrets.json
    buildings.json
    skills.json
    regions.json
    levels.json
    recipes.json       # 제작법
    bosses.json        # 보스 둥지·패턴·재등장
    sounds.json        # 효과음 합성 정의, 배경음 음계·템포
    nodes.json         # 채집 노드 종류·드롭·복구일, 지역별 밀도
    weapons.json       # 무기 종류별 공격 방식 (사거리·각도·쿨다운·배율·넉백·특수)
    shop.json          # 상점 판매 목록
```

파일은 필요해지는 Phase에서 만든다. 아직 없는 파일은 해당 Phase 전까지 만들지 않는다.

---

## 4. 시스템 설계

### 4-1. 플레이어
- 이동: WASD, 달리기: Shift
- 공격: 마우스 좌클릭 (바라보는 방향 근접 공격 — 클릭한 순간 마우스 쪽으로 몸을 돌린다), 무기에 따라 원거리
- 상호작용: E (채집, 건물 사용, NPC)
- 능력치: HP, 스태미나, 공격력, 방어력, 이동속도, 치명타 확률
- 사망 시: 가장 가까운 기지에서 부활, 소지 골드 일부 손실 (기지가 없으면 시작 지점)

### 4-1-1. 회피 구르기 (Phase 7)
- PC `Space`, 모바일은 공격 버튼 왼쪽 구르기 버튼
- 이동 방향(없으면 바라보는 방향)으로 `rollDuration`초 동안 `rollDistance` m, 처음 `rollInvuln`초 무적
- 스태미나 `rollStamina`, 쿨다운 `rollCooldown` (`player.json`). 구르는 중엔 공격 못 함 (휘두르던 칼은 취소)

### 4-1-2. 타격감 (Phase 7, FeedbackSystem)
- 연출만 담당. 이벤트(`combat:hit`, `monster:killed`, `player:damaged` …)를 듣고 보여 주기만 한다
- **히트스톱**: 플레이어가 적을 때리면 `hitstop.hit`초, 치명타 `hitstop.crit`초, 보스 처치 `hitstop.bossKill`초 동안 게임 시간 배율 `hitstop.scale`. Game 루프가 `ctx.timeScale`을 곱한다 (카메라 흔들림·파티클·UI는 실제 시간)
- **화면 흔들림** `Camera.shake(세기, 시간)`: 치명타·플레이어 피격·대포 착탄(거리 감쇠)·보스 범위 공격. 설정에서 끌 수 있다
- **파티클** (최대 `particles.max`개 풀): 타격 조각, 처치 조각+연기, 레벨업 빛기둥+별, 달리기 먼지(지면 색), 포탑 총구 섬광, 대포 폭발
- 몬스터는 처치되면 `deathSquash`초 동안 납작해지며 사라진다
- 수치는 `config.json`의 `feedback`

### 4-1-3. 사운드 (Phase 7)
- 외부 파일 없이 Web Audio로 합성. 효과음 정의는 `sounds.json`의 `sfx` (음 여러 개: 파형·주파수·끝 주파수·길이·지연·음량, 노이즈)
- 같은 효과음은 한 프레임에 1번만, 동시 재생 최대 `maxVoices`, 플레이어에서 `maxDistance` m 넘으면 무음 (가까울수록 크게)
- 배경음: 펜타토닉 음계를 느린 템포로 합성하는 루프. 지역·낮밤마다 조성·음높이·템포가 다르고(초원 낮 = 밝은 장조, 밤 = 단조·저음), 습격 중엔 북 리듬, 보스전은 빠른 템포
- 브라우저 정책상 첫 클릭/터치(타이틀 화면) 때 AudioContext를 시작한다

### 4-1-4. 채집 (Phase 8)
- 채집 노드는 장식과 따로, 시드 난수로 자리가 고정된다 (`nodes.json`의 `density`, 지역별 1000㎡당 개수)
- 노드는 장식보다 살짝 크고, 가까이(`gather.sparkleRange`) 가면 반짝인다
- **공격으로 캔다** (도구 없음). 칼 부채꼴 안에 들어오면 타격. 한 번에 `gather.damage` × (1 + 손놀림) 피해, 타격마다 흔들림·조각
- 체력이 0이 되면 재료가 바닥에 떨어진다 (드롭 테이블은 몬스터와 같은 형식, `chanceByRegion`으로 지역별 확률). 경험치도 받는다
- 캔 노드는 그루터기·부서진 바위(풀·약초는 새싹)로 바뀌고, `respawnDays`일 뒤 아침에 되살아난다
- 모바일 공격 버튼은 가까운 적이 없으면 가까운 채집 노드를 겨눈다
- 멀리(`gather.visibleRange` 밖) 있는 노드는 숨긴다
- 세이브: 캔 노드 id와 캔 날짜

| 노드 | 이름 | 지역 | 체력 | 드롭 | 복구(일) |
|---|---|---|---|---|---|
| tree_node | 둥근 나무 | 초원·숲 | 30 | 나무 토막 2~3, 사과 0~1(30%) | 2 |
| pine_node | 전나무 | 숲·설원 | 40 | 나무 토막 2~4, 송진 0~1(25%) | 2 |
| rock_node | 바위 | 전 지역 | 45 | 돌멩이 2~3, 철광석 0~1(초원 15%, 그 밖 35%) | 3 |
| herb_node | 약초 덤불 | 초원·숲 | 10 | 약초 1~2 | 1 |
| fiber_node | 긴 풀 | 초원 | 8 | 풀 섬유 1~3 | 1 |
| cactus_node | 큰 선인장 | 사막 | 35 | 선인장 과육 1~2, 선인장 가시 0~1 | 2 |
| sandstone_node | 사암 | 사막 | 55 | 사암 2~3, 태양 수정 0~1(8%) | 3 |
| ice_node | 얼음 기둥 | 설원 | 60 | 얼음 조각 1~2, 서리 수정 0~1(8%) | 3 |

- 새 재료: 나무 토막·돌멩이·풀 섬유·약초·송진·철광석·선인장 과육·사암·태양 수정·서리 수정. 소모품 사과(HP 15)

### 4-2. 몬스터
- 필드 몬스터: 지역별로 스폰, 기지 안전지대 안에는 스폰 안 됨
- 습격 몬스터: 밤에 기지를 향해 이동, 건물·포탑·플레이어 공격
- AI 상태: 배회 → 추적 → 공격 → (체력 낮으면) 도주
- 드롭: 경험치, 골드, 재료 (`monsters.json`의 드롭 테이블 기준)

### 4-2-0. 몬스터 행동 (Phase 10)
- `monsters.json`의 `behavior` (없으면 melee). 행동 모듈은 `entities/behaviors/`
| behavior | 동작 | 추가 필드 |
|---|---|---|
| melee | 다가와서 때림 (기존) | - |
| charger | 멈춰서 바닥에 돌진 예고선 → 일직선 돌진. 나무·바위에 박으면 `stunTime`초 기절 | chargeWindup, chargeSpeed, chargeDistance, chargeCooldown |
| ranged | 거리를 유지하며 투사체. 가까이 오면 뒷걸음 | keepDistance, shotSpeed, shotCooldown, shotWindup, shotEffect |
| darter | 빠르게 날아와 한 번 쏘고 멀리 빠짐 (반복) | dartSpeed, retreatDistance |
| burrower | 땅속으로 숨어 이동(맞지 않음) → 발밑 흙더미 예고 → 튀어나오며 범위 공격 | burrowTime, emergeWindup, emergeRadius |
| exploder | 가까이 오면 부풀며 깜빡임 → 폭발. 건물에 `blastMultiplier`배 | fuseTime, blastRadius, blastMultiplier |
| + splitter | 죽으면 작은 개체로 갈라짐 (행동과 함께 쓰는 속성) | splitInto, splitCount |
| + pack | 2~3마리 무리로 스폰. 한 마리가 맞으면 무리 전체 추적 | packMin, packMax |
| + flier | 나무·바위(벽 포함)를 넘어 다닌다. 바닥에 그림자 원 | flier: true |
- 상태 이상은 플레이어에게도 걸린다: 독(초당 피해, 무적 시간 없음), 감속(이동 속도). 독 저항은 독 시간·피해를 줄이고, 감속 면역이면 감속이 안 걸린다
- 밤에 태어난 필드 몬스터는 몸이 보랏빛으로 은은히 빛난다 (새 몬스터의 밤 버전은 따로 없음)

### 4-2-0-1. 신규 몬스터 (Phase 10)
수치는 지역 배율 적용 전 기본값.
- 초원: 붕붕벌(darter·flier), 뿔토끼(charger), 큰 슬라임(splitter → 슬라임 2)
- 숲: 포자 버섯(ranged, 포자탄 독 3초), 가시 늑대(pack 2~3), 그루터기 괴물(느리고 단단함)
- 사막: 모래 전갈(charger, 적중 시 독), 모래 두더지(burrower), 굴렁 덤불(exploder)
- 설원: 눈꽃 요정(ranged·flier, 얼음탄 감속 40% 2초), 설인 새끼(pack 2), 눈사람 폭탄(exploder)

### 4-2-0-2. 정예 몬스터 (Phase 10)
- 필드 스폰의 `elite.chance`(5%)가 정예. 크기 1.3배, 금빛으로 빛남
- HP ×2.5, 공 ×1.5, XP ×3, 골드 ×3, 장비 드롭 확률 ×3 (`config.json`의 `elite`)

### 4-2-1. 보스 (Phase 6)
- 지역마다 보스 하나. 난이도 순서: **왕슬라임**(초원 북동쪽) → **고목 수호자**(숲 깊은 곳) → **선인장왕**(사막 끝) → **얼음 거인**(설원 끝) → 밤의 군주(Phase 13)
- `bosses.json`의 `patterns` 목록에서 쿨다운이 돈 패턴을 골라 쓴다 (`bossPatterns.js`)
  - slam 내려찍기 / jump 점프 후 착지 지점 내려찍기 / volley 가시 난사 / boulder 얼음덩이 / summon 부하 소환 / roots 뿌리 줄기 3갈래(직선 예고) / leafstorm 몸 주변을 돌며 퍼지는 잎
- 페이즈: 왕슬라임은 HP 50% 이하에서 중간 슬라임 2마리로 갈라지고 둘 다 잡아야 처치. 고목 수호자는 HP 30% 이하에서 공격 속도 +30%, 붉은 단풍색
- 보스 드롭은 `oneOf`(여럿 중 하나)를 쓸 수 있다
- 둥지 `spawnRange` 안으로 들어가면 나타난다. `aggroRange` 안에 오면 싸움 시작, 화면 위에 보스 체력바
- 패턴 (모두 바닥에 빨간 예고 표시 후 발동)
  - 내려찍기: 보스 둘레 원형 범위 피해
  - 선인장왕 가시 난사: 사방으로 가시 여러 발
  - 얼음 거인 얼음덩이: 플레이어 자리에 포물선으로 던져 떨어진 곳 범위 피해
- 둥지에서 `leashRange` 넘게 끌려가면 돌아가서 체력이 가득 찬다 (넉백은 거의 안 받는다)
- 쓰러뜨리면 큰 보상(영웅 장비·골드·재료·텐트 키트). `respawnDays`일 뒤에 다시 나타난다
- 지도에 둥지 표시 (가 본 곳만, 처치한 보스는 회색)

### 4-3. 아이템
- 분류: 재료 / 소모품 / 장비(무기·방어구·장신구) / 건설 키트
- 등급: 일반 / 고급 / 희귀 / 영웅 (색상 구분)
- 재료 겹치기(stack) 가능, 장비는 불가
- 모든 아이템은 `data/items.json`에 id로 정의
- 바닥의 드롭은 가까이 가면 자동으로 끌려와서 주워진다
- 가방(인벤토리)은 칸 수가 정해져 있다 (`config.json`의 `inventory`). 가득 차면 드롭은 바닥에 남는다
- 한 칸에 겹칠 수 있는 최대 수량은 아이템의 `maxStack` (없으면 `inventory.defaultMaxStack`)
- 골드는 가방 칸을 차지하지 않는다 (EconomySystem이 따로 관리)

### 4-11. 저장
- localStorage 한 키에 JSON 하나 (`config.json`의 `save.key`)
- 자동 저장: 일정 간격(`save.autosaveInterval`초) + 탭을 숨기거나 닫을 때
- 게임 시작 시 저장이 있으면 불러온다
- SaveSystem은 다른 시스템을 직접 부르지 않는다
  - 저장: `save:collect` 이벤트에 빈 객체를 넘기면 각 시스템이 자기 몫을 채운다
  - 불러오기: `save:apply` 이벤트로 저장 데이터를 넘기면 각 시스템이 자기 몫을 가져간다
- 저장 구조 (saveVersion 1)
  ```json
  {
    "saveVersion": 1,
    "savedAt": 1727000000000,
    "player": { "position": [x, z], "hp": 100, "stamina": 100 },
    "economy": { "gold": 0 },
    "inventory": { "slots": [ { "id": "slime_jelly", "count": 3 }, null, ... ] },
    "time": { "day": 1, "clock": 120.5 },
    "bases": [ { "id": 1, "level": 1, "position": [x, z], "hp": 300 } ],
    "turrets": [ { "type": "wood_bow", "baseId": 1, "position": [x, z], "hp": 80, "level": 1, "priority": "nearest" } ],
    "stats": { "level": 1, "xp": 0, "skillPoints": 0 },
    "equipment": { "slots": { "weapon": "twig_sword", "head": null, ... } },
    "skills": { "ranks": { "power": 2 }, "slots": ["dash_slash", null] },
    "exploration": { "cells": "0011100…", "visited": ["grassland"] },
    "facilities": [ { "type": "workbench", "baseId": 1, "position": [x, z], "hp": 120 } ],
    "storages": { "1": [ { "id": "slime_jelly", "count": 30 }, null, ... ] },
    "bosses": { "cactus_king": { "defeatedDay": 4 } },
    "gather": { "depleted": { "rock_node-12": 3 } }
  }
  ```
- v1 → v2: `time`·`bases`·`turrets` 추가, 기지가 없으니 텐트 키트 1개 지급
- v2 → v3: `stats`·`equipment`·`skills` 추가 (레벨 1부터)
- v3 → v4: `exploration` 추가 (빈 값 → 불러온 뒤 플레이어·기지 주변부터 다시 밝힌다)
- v4 → v5: 포탑마다 `priority` 추가 (기본값은 그 포탑 종류의 `priority`)
- v5 → v6: `facilities`·`storages` 추가 (빈 값)
- v6 → v7: `bosses` 추가 (빈 값 = 모든 보스 살아 있음)
- v7 → v8: `gather` 추가 (빈 값 = 모든 노드 살아 있음)
- v8 → v9: `skills.slots` 추가 (액티브 스킬 Q·R, 빈 슬롯)
- 불러오기가 끝나면 `save:loaded` 이벤트. 플레이어 HP는 장비·스킬까지 반영된 최대치로 이때 맞춘다
- 구조를 바꾸면 `SAVE_VERSION`을 올리고 `SaveSystem.js`의 `migrations`에 이전 버전 → 새 버전 변환을 넣는다
- 저장이 깨졌으면 `<key>-broken`으로 옮겨 두고 새로 시작한다. 더 새로운 버전의 저장이면 덮어쓰지 않는다

### 4-3-2. 무기 종류 (Phase 9)
- 무기 아이템에 `weaponType`. 공격 방식은 무기 종류(`weapons.json`)가, 능력치는 아이템이 정한다. 무기가 없으면 검
| 종류 | 사거리 | 각도 | 쿨다운 | 데미지 배율 | 넉백 | 특징 |
|---|---|---|---|---|---|---|
| 검 sword | 2.1 | 120° | 0.42 | 1.0 | 5 | 기본. 회전 공격 스킬과 궁합 |
| 창 spear | 3.2 | 40° | 0.5 | 1.05 | 3 | 길고 좁게 찌름 (부채꼴 안 모두 관통) |
| 망치 hammer | 2.3 | 170° | 0.85 | 1.7 | 10 | 느리고 넓고 강함. 3타마다 작은 충격파 |
| 활 bow | 13 | - | 0.6 | 0.8 | 1.5 | 화살 발사, 스태미나 8. PC는 마우스 방향, 모바일은 가장 가까운 적(10m) |
- 모양: 칼 자리에 종류별 모양 (창 = 긴 막대+창날, 망치 = 짧은 자루+큰 머리, 활 = 휜 활대+시위). 휘두르는 동작도 종류별
- 장비 외형: 머리 장비 = 모자 모양·색, 몸 장비 = 옷 색, 신발 = 신발 색
- 특수 능력치: 적중 시 독(`onHitPoison` 초), 적중 시 감속(`onHitSlow` 비율), 처치 시 HP 회복(`onKillHeal`), 화살 추가(`multiShot`), 밤 몬스터 피해(`nightBonus`), 치명타 피해(`critDamage`), 구르기 스태미나(`rollStaminaPct`), 독 저항(`poisonResist`), 기지 안 HP재생 배율(`baseRegenMult`), 받는 피해(`damageTaken`), 감속 면역(`slowImmune`)
- 밤 몬스터 = 밤에 태어난 필드 몬스터와 습격 몬스터

### 4-3-3. 등급·세트 (Phase 9)
- 등급에 전설(legendary, `#ffa53d`) 추가. 최종 보스 전용
- 세트: 같은 지역 머리·몸·발 3부위를 모두 끼면 보너스 (`items.json`의 `sets`). 캐릭터 창에 세트 진행도
  - 초원(풀잎 모자·풀잎 옷·짚신): 이속 +8% / 숲(버섯 모자·가죽 조끼·가죽 장화): HP재생 +1
  - 사막(사막 두건·사막 망토·모래 샌들): 치명 +5% / 설원(털모자·설인 털옷·설원 부츠): 받는 피해 -10%, 감속 면역
- 몬스터·보스 드롭 전용 장비 중 아직 없는 몬스터(Phase 10·13)가 떨어뜨리는 것은 그때부터 얻을 수 있다

### 4-3-4. 소모품·버프 (Phase 9)
- 소모품 `use`: `heal`(즉시 회복), `buff`({ id, duration, effects }), `returnHome`(가장 가까운 기지로, 영역 밖에서도), `resetSkills`(스킬 포인트 전부 돌려받음)
- 버프는 BuffSystem: 같은 버프는 겹치지 않고 시간만 새로. HUD HP바 아래에 아이콘 + 남은 초. 버프 효과는 능력치 계산에 더해진다
- 사과(HP 15) · 약초차(30초 스태미나 회복 +50%) · HP 물약(제작 재료: 약초 2 + 슬라임 젤리 1) · 꿀단지(60초 이속 +20%) · 불꽃 강장제(90초 공격 +15%) · 선인장 주스(HP 60 + 10초 HP재생 +3) · 귀환 두루마리(상점 40골드) · 망각의 물약(상점 300골드)

### 4-3-5. 상태 이상 (Phase 9 몬스터 / Phase 10 플레이어)
- StatusSystem: 독(초당 피해), 감속(이동 속도 배율). 같은 상태는 시간만 새로. 몬스터 머리 위 작은 색 아이콘 (독 초록, 감속 파랑)

### 4-4. 레벨·스킬
- 몬스터 처치, 채집, 건설로 경험치 획득
- 레벨업 시 능력치 자동 상승 + 스킬 포인트 1
- 스킬트리 3갈래
  - 전투: 공격력, 연속 베기, 회전 공격, 치명타
  - 생존·채집: 채집 속도, 채집량, HP 재생, 이동속도
  - 건축: 건설 비용 감소, 포탑 데미지·사거리, 포탑 설치 수 증가
- 스킬은 선행 스킬이 있어야 찍을 수 있음 (`skills.json`의 `requires`)

- 경험치 출처: 몬스터 처치(`monsters.json`의 `xp`), 건설(`turrets.json`·`buildings.json`의 `xp`), 채집(채집 추가 후)
- 다음 레벨까지 필요 경험치 = `levels.json`의 `xpBase` × `xpGrowth`^(레벨-1) (반올림)
- 레벨업 시 `levels.json`의 `perLevel`만큼 능력치 상승, HP·스태미나 가득 회복
- 최종 능력치 = 기본(`player.json`) + 레벨 보너스 + 장비 보너스 + 스킬 효과. StatsSystem이 계산해서 `ctx.player.stats`에 넣고, 다른 시스템은 그 값을 읽는다
  - 포탑 데미지·사거리·비용·설치 수 같은 건축 스킬 효과도 `ctx.player.stats`에 들어 있다
- 스킬은 한 번에 1랭크씩, 찍기 전 확인 창을 띄운다. 망각의 물약으로 초기화 (포인트 전부 돌려받음, 슬롯도 비움)
- 손놀림(`gatherSpeed`) = 채집 노드에 주는 피해 증가, 알뜰 채집(`gatherAmount`) = 노드의 주 드롭 +1 (랭크당)
- 최대 레벨 40 (`levels.json`). 스킬 포인트는 모든 스킬을 다 찍기엔 모자라다 (선택의 의미)

### 4-4-2. 스킬 개편 (Phase 11)
- **액티브 스킬** (`skills.json`의 `active`). 배우면 빈 슬롯(Q·R)에 자동 등록, 스킬 창에서 Q·R 버튼으로 바꾼다
  - PC `Q`·`R`, 모바일은 공격 버튼 위 둥근 버튼 2개. 쿨다운은 원형으로 줄어들고 남은 초 표시
| id | 갈래 | 이름 | 효과 | 쿨 | 스태미나 | 선행 |
|---|---|---|---|---|---|---|
| dash_slash | 전투 | 돌진 베기 | 앞으로 6m 돌진(무적), 지나간 길의 적 모두 공격력 150% (랭크당 +30%) | 7초 | 25 | 힘 2 |
| first_aid | 생존 | 응급 처치 | 5초에 걸쳐 최대 HP 30% 회복 (랭크당 +8%) | 25초 | 0 | 회복력 1 |
| overclock | 건축 | 포탑 과부하 | 반경 15m 포탑 연사 속도 ×2, 8초 (랭크당 +2초) | 40초 | 30 | 포탑 정비 1 |
- 돌진 방향: PC는 마우스 쪽, 모바일은 가까운 적(없으면 바라보는 방향)
- **패시브 추가**
  - 무기 숙련(전투, 최대 3, 선행 연속 베기 1): 창 사거리 +0.3, 망치 쿨다운 -8%, 화살 속도 +15% (랭크당)
  - 두꺼운 가죽(생존, 최대 5): 방어 +2
  - 약초꾼(생존, 최대 3, 선행 알뜰 채집 1): 소모품 회복량 +15%
  - 석공(건축, 최대 3, 선행 절약 1): 기지·부속 건물 체력 +20%, 기지 업그레이드·부속 건물 재료 -10% (개수 반올림, 최소 1)
  - 명사수 포탑(건축, 최대 3, 선행 진지 확장 1): 포탑 치명타 확률 +10% (치명타 배율은 플레이어와 같다)

### 4-4-1. 장비
- 슬롯: 무기, 머리, 몸, 신발, 장신구 2
- 아이템의 `equipSlot`(weapon / head / body / feet / accessory)과 `bonus`(능력치 증가)로 정의
- 가방에서 우클릭 → 장착 (원래 끼던 장비는 그 가방 칸으로 돌아온다). 캐릭터 창에서 장비 칸 우클릭 → 해제 (가방이 차 있으면 해제 불가)
- 장비는 몬스터 드롭으로 얻는다 (낮은 확률). 제작·상점은 Phase 6

### 4-5. 기지
- 단계: 텐트(Lv1) → 움막(Lv2) → 집(Lv3) → 요새(Lv4)
- 기지 중심 건물 주변 일정 반경이 기지 영역 (레벨에 따라 확장)
- 기지 영역 안: 필드 몬스터 스폰 없음, 건물·포탑 설치 가능
- 부속 건물: 작업대(제작), 창고, 상점, 훈련장 등
- 기지 레벨이 부속 건물 종류와 포탑 설치 수를 결정

- 첫 기지: 새 게임을 시작하면 가방에 "텐트 키트" 1개가 들어 있다. 가방에서 우클릭 → 배치 미리보기 → 좌클릭으로 설치 (우클릭/ESC 취소)
- 텐트(기지 중심)에도 체력이 있다. 습격 몬스터가 부수면 그날 밤 습격은 실패. 아침마다 텐트 체력은 가득 찬다
- 플레이어는 쓰러지면 가장 가까운 기지 텐트 앞에서 부활한다
- 기지 단계별 수치(영역 반경, 포탑 수, 텐트 체력)는 `data/buildings.json`의 `baseLevels`

### 4-5-1. 월드와 지역
- 월드는 남북으로 긴 직사각형 (`config.json`의 `world.bounds`). 가장자리는 침엽수 벽
- 지역은 z 범위로 나눈다 (`regions.json`의 `zFrom`·`zTo`). 북쪽(W 방향)에서 남쪽 순서로:
  설원(난이도 4) · 숲(2) · **초원(1, 시작 지점)** · 사막(3)
- 사막: 모래 땅, 선인장·사암, 모래 슬라임·선인장 몬스터, 재료 선인장 가시
- 설원: 눈 땅, 눈 덮인 침엽수·얼음 바위, 눈 슬라임·얼음 골렘, 재료 얼음 조각
- 청크: 장식은 z 방향 `world.chunkSize` 띠로 나눠 그린다. 플레이어와 `world.chunkViewDistance`보다 먼 띠는 숨긴다
- 플레이어와 `world.activeRadius`보다 먼 필드 몬스터·보스는 업데이트하지 않는다 (습격 몬스터는 예외)
- 지역마다: 난이도, 능력치 배율, 필드 몬스터 목록, 습격 몬스터, 지면 색, 장식 밀도
- 숲 버섯 몬스터는 낮은 확률로 텐트 키트를 떨어뜨린다 → 두 번째 기지의 재료
- 지역 경계를 넘으면 지역 이름 알림 (처음 가 본 지역은 큰 배너)

### 4-5-2. 기지 업그레이드 (Phase 6)
- 텐트(Lv1) → 움막(Lv2) → 집(Lv3) → 요새(Lv4). 단계별 수치와 비용은 `buildings.json`의 `baseLevels`
- 비용은 **재료** (경제 원칙: 재료 = 건설). 다음 단계의 `cost`에 적힌 재료를 가방에서 쓴다
- 상위 단계일수록 다른 지역 재료가 필요하다 (멀티 기지 동기, Phase 8)
  - 움막: 나무 20, 돌멩이 10, 슬라임 젤리 8
  - 집: 나무 40, 돌멩이 25, 송진 6, 버섯 갓 10
  - 요새: 나무 60, 사암 30, 철광석 12, 선인장 가시 15, 얼음 조각 10
  - 이미 올린 기지는 그대로 둔다
- 올리면: 영역 반경·포탑 설치 수·중심 건물 체력이 늘고, 모양이 바뀌고, 새 포탑이 해금된다. 경험치도 받는다
- 건설 창(B)의 건물 탭에서 올린다. 기지 중심 건물 앞에서 E를 눌러도 건설 창이 열린다

### 4-5-3. 부속 건물 (Phase 6)
- 작업대(텐트부터) · 창고(움막부터) · 상점(움막부터). 기지마다 종류별로 하나씩
- 비용 (Phase 8): 작업대 나무 8·슬라임 젤리 4 / 창고 나무 15·돌멩이 8 / 상점 나무 12·풀 섬유 10·돌멩이 6
- 비용은 재료. 건설 창(B) 건물 탭에서 고르고, 포탑처럼 배치 미리보기로 기지 영역 안에 놓는다
- 체력이 있어 습격 몬스터가 부술 수 있다. 부서지면 아침까지 못 쓰고, 아침마다 기지 건물과 함께 회복된다
- 건물 앞에서 E: 작업대 → 제작 창, 창고 → 창고 창, 상점 → 상점 창
- **제작**: `recipes.json`. 재료로 장비·소모품·텐트 키트를 만든다. 제작법마다 필요한 기지 단계가 있다. 가방에 자리가 없으면 만들지 않는다
- **창고**: 기지마다 따로 (`buildings.json`의 `slots`칸). 클릭하면 한 칸 통째로 가방 ↔ 창고
- **상점**: 구매(골드 → `shop.json`의 물건), 판매(아이템의 `value` 골드). 재료 = 제작/건설, 골드 = 포탑/상점 원칙 유지
- **습격 실패 손실**: 그 기지에 창고가 있으면 창고 재료의 `raid.failStorageLossRatio`를 잃는다. 창고가 없으면 예전처럼 소지 골드 일부

### 4-3-1. 소모품과 퀵슬롯
- 소모품은 `use` 효과(`heal` 등). 가방에서 우클릭하거나 퀵슬롯 숫자키(1~5)로 쓴다
- 퀵슬롯: 가방에 있는 소모품 종류를 가방 순서대로 최대 5개 보여준다 (따로 등록하지 않음)

### 4-6. 멀티 기지
- 새 기지는 "텐트 키트"를 다른 지역에 설치해서 생성
- 기지 간 최소 거리 제한 (겹침 방지)
- 기지끼리 빠른 이동 가능 (M 지도 창에서 선택). 기지 영역 안에 있을 때만 쓸 수 있다
- 기지 이름: `<지역> 기지 #<번호>`
- 지역마다 몬스터·재료가 달라서 여러 기지를 둘 이유가 생기도록 설계
- 창고는 기지별로 따로 (나중에 공유 창고 건물 추가 가능)

### 4-7. 포탑
- 설치: 건설 모드에서 골드 소비해서 설치, 기지 영역 안에서만
- 종류 (단계별 해금)
  - 나무 활 포탑: 싸고 약함, 단일 대상
  - 석궁 포탑: 데미지 높고 느림
  - 총 포탑: 빠른 연사
  - 대포 포탑: 느리지만 범위 피해
- 속성: 사거리, 연사 속도, 데미지, 투사체 속도, 타겟 우선순위(가장 가까운 적 / 체력 낮은 적)
- 업그레이드: 골드로 Lv1~Lv3
- 체력 있음, 파괴되면 수리비(골드) 필요
- 모든 수치는 `data/turrets.json`
- 설치 수 제한: 기지 레벨의 `maxTurrets`
- 해금: 나무 활(Lv1 텐트) · 석궁(Lv2 움막) · 총(Lv3 집) · 대포(Lv4 요새)
- 대포는 포물선으로 날아가 땅에 닿으면 `splashRadius` 안의 적 모두에게 피해 (가장자리일수록 약하게, 최소 `splashMinFactor`)
- 부서진 포탑은 잔해로 남아 동작하지 않는다. 골드로 수리해야 다시 동작
- 포탑 관리 창: 포탑 앞에서 E
  - 업그레이드: 골드, `upgradeCosts`[현재 레벨-1]. 레벨마다 데미지 +`damagePerLevel`, 사거리 +`rangePerLevel`, 체력 +`hpPerLevel` (비율)
  - 수리: 골드 = 잃은 체력 × `repairCostPerHp` (올림)
  - 우선순위 바꾸기: 가장 가까운 적 ↔ 체력 낮은 적 (포탑마다 저장)
  - 철거: 설치비+업그레이드비의 `demolishRefund` 비율을 돌려받는다 (자리 제한 때문에 약한 포탑을 바꿀 수 있게)
- 원격 습격 계산에서 대포 같은 범위 포탑은 `aoeFactor`배 화력으로 친다

### 4-8. 밤 습격
- 밤이 되면 각 기지에 습격 웨이브 발생
- 습격 강도 = 기지 레벨 + 지역 난이도 + 날짜 경과
- 플레이어가 있는 기지: 실제 몬스터 스폰, 실시간 전투
- 플레이어가 없는 기지: 실제 전투 없이 계산으로 처리
  - 포탑 총 화력 vs 웨이브 강도 비교
  - 결과: 방어 성공(보상) / 부분 피해(포탑·건물 체력 감소) / 실패(창고 재료 일부 손실)
  - 아침에 결과를 알림으로 표시
- 어느 기지가 실시간인가: 해 질 때 플레이어가 기지 영역 + `raid.presenceMargin` 안에 있으면 실시간, 아니면 원격 계산
- 원격 계산 (아침에 정산)
  - 방어력 = 그 기지의 멀쩡한 포탑 초당 데미지 합 × `raid.remoteFightSeconds`
  - 습격 체력 = 습격 몬스터 수 × 습격 몬스터 체력(날짜·지역 배율 반영)
  - 비율 = 방어력 ÷ 습격 체력
  - 1 이상: 방어 성공 (보상은 실시간과 같음)
  - `raid.remotePartialRatio` 이상: 부분 피해 — 포탑마다 최대 체력 × (1-비율) × `raid.remoteTurretDamage` 만큼 깎임
  - 그 미만: 실패 — 포탑 피해 + 소지 골드 일부 손실 (창고가 생기면 창고 재료 손실로 바꾼다)
  - 텐트는 원격 계산으로 깎지 않는다 (아침 회복과 순서가 꼬이지 않게)
- 습격 몬스터는 기지가 있는 지역의 `raidMonster`, 능력치는 날짜 배율 × 지역 배율
- 실시간 습격 판정 (Phase 3)
  - 해가 지면 기지 영역 바깥 둘레에서 습격 몬스터가 몇 초 간격으로 나타나 기지로 온다
  - 습격 몬스터는 가까운 플레이어를 먼저 노리고, 아니면 가장 가까운 포탑·텐트를 부순다. 도망치지 않는다
  - 방어 성공: 습격 몬스터를 모두 처치 → 아침에 보상 골드
  - 부분 피해: 아침까지 다 못 잡음 → 남은 몬스터는 물러가고 보상 없음
  - 실패: 텐트가 부서짐 → 남은 몬스터는 물러가고 소지 골드 일부 손실
  - 습격 몬스터 수 = `raid.baseCount` + 기지 레벨 × `perBaseLevel` + 지역 난이도 × `perRegionDifficulty` + (날짜-1) × `perDay`
  - 날짜가 지날수록 습격 몬스터 능력치도 `statScalePerDay`씩 오른다

### 4-9. 경제
- 골드 획득: 몬스터 드롭, 상점에 재료 판매, 습격 방어 보상
- 골드 소비: 포탑 설치·업그레이드·수리, 상점 구매
- 재료 소비: 건물 건설, 장비 제작
- 원칙: **재료 = 건설/제작, 골드 = 포탑/상점.** 역할을 섞지 않는다.

### 4-10. 낮/밤
- 하루 = 실제 시간 약 10분 (낮 7분, 밤 3분) — data에서 조절
- 밤에는 조명이 어두워지고 필드 몬스터가 강해짐 (밤에 태어난 필드 몬스터는 `spawner.nightStatMultiplier`배)
- 해 지기 `time.nightWarning`초 전에 경고 알림
- 우상단 HUD에 날짜와 다음 낮/밤까지 남은 시간

---

## 5. UI 창

모든 창은 UIManager가 관리한다. 창이 열려 있을 때 게임 입력(공격·이동)은 막지 않되, 마우스 클릭은 창이 우선한다. ESC는 가장 위의 창을 닫는다.

| 단축키 | 창 | 내용 |
|---|---|---|
| I | 인벤토리 | 격자 슬롯, 드래그로 이동, 우클릭 사용/장착, 마우스 올리면 툴팁 |
| C | 캐릭터 정보 | 장비 슬롯(무기·머리·몸·신발·장신구2), 능력치, 레벨, 경험치 바 |
| K | 스킬 | 3갈래 트리, 남은 포인트, 선행 조건 표시, 찍기 전 확인 |
| B | 건설 | 기지 영역 안에서만, 건물/포탑 탭, 비용 표시, 배치 미리보기(가능=초록, 불가=빨강) |
| M | 지도 | 탐험한 지역(안 가 본 곳은 안개), 기지 위치, 플레이어 위치, 기지 목록과 빠른 이동 버튼 |
| (상점 건물에서 E) | 상점 | 구매/판매 탭 |

### 5-0. 타이틀과 메뉴
- 페이지를 열면 **타이틀 화면**부터. 뒤에는 게임 월드가 천천히 돌며 보이고, 로고 글자가 하나씩 통통 튀어나온 뒤 메뉴가 올라온다
- 메뉴
  - **이어하기**: 저장이 있을 때만. 날짜·레벨·골드·기지 수·마지막 저장 시각을 보여 준다
  - **새 게임**: 저장이 있으면 "지우고 새로 시작할까요?" 확인
  - **조작 방법**: PC / 모바일 조작표
- 타이틀에 있는 동안에는 게임 시간이 흐르지 않고 **저장도 하지 않는다** (탭을 닫아도 기존 저장을 덮어쓰지 않게)
- 새 게임을 시작하면 환영 안내 카드 3장(이동·공격 → 첫 기지 → 밤 습격). 기기에 맞는 조작으로 설명. 카드가 떠 있는 동안 게임은 멈춘다
- **게임 중 메뉴**: 오른쪽 위 ☰ 버튼 또는 ESC(열린 창이 없을 때). 계속하기 · 저장하기 · 조작 방법 · 타이틀로(저장 후 돌아감). 메뉴가 떠 있으면 게임이 멈춘다
- 게임 상태 `ctx.state`: 'title' | 'play' | 'paused'

### 5-0-1. 설정 (Phase 7)
- 게임 메뉴(☰)와 타이틀의 "설정". `grassland-rpg-settings` 키에 따로 저장 (세이브와 분리)
- 배경음 볼륨, 효과음 볼륨, 화면 흔들림 켜기/끄기, 그림자 품질(끄기/낮음/높음), 장식 밀도(50%/100% — 풀·꽃·덤불만 줄인다. 충돌하는 나무·바위는 그대로), 데미지 숫자 표시

### 5-1. 모바일 터치 조작
터치 기기(`pointer: coarse`)에서만 보인다. 키보드·마우스 입력과 같은 Input을 거치므로 게임 로직은 따로 두지 않는다.
- 왼쪽 아래 **가상 조이스틱**: 이동. 끝까지 밀면(`touch.runThreshold` 이상) 달리기
- 오른쪽 아래 **공격 버튼**: 누르고 있으면 계속 공격. 가까운 적(`touch.autoAimRange` 안)을 자동으로 겨눈다. 없으면 바라보는 방향
- 화면 빈 곳을 탭해도 그쪽으로 공격한다 (마우스 클릭과 같음)
- **E 버튼**: 상호작용할 대상이 있을 때만 공격 버튼 위에 나타난다
- **구르기 버튼**: 공격 버튼 왼쪽
- 오른쪽 **메뉴 버튼**: 가방·캐릭터·스킬·건설·지도 (단축키와 같음)
- **건설 모드**: 화면을 탭하면 그 자리로 미리보기가 옮겨 가고, "설치"·"취소" 버튼으로 정한다
- 가방·장비 칸: 탭하면 설명, **두 번 탭하면 우클릭과 같은 동작**(사용·장착·해제·설치)
- 퀵슬롯: 탭하면 사용 (터치에선 왼쪽 아래 조이스틱 위)
- **스킬 버튼**: 공격 버튼 위 둥근 버튼 2개 (등록된 액티브 스킬만 보인다). E 버튼은 구르기 버튼 위
- 화면 확대(핀치·두 번 탭 확대)는 막는다

### HUD (항상 표시)
- 좌상단: HP, 스태미나, 레벨, 경험치 바
- 우상단: 골드, 날짜, 낮/밤 시계
- 하단: 퀵슬롯 1~5 (소모품), 그 옆 스킬 슬롯 Q·R
- 알림: 아이템 획득, 레벨업, 습격 결과

---

## 6. 개발 단계 (MVP 순서)

각 단계가 끝날 때마다 브라우저에서 직접 플레이해서 확인하고 커밋한다.

### Phase 1 — 기본 조작
- [x] Vite + three.js 세팅, 초원 평지, 탑다운 카메라
- [x] 플레이어 이동, 근접 공격
- [x] 몬스터 1종 (배회·추적·공격·사망)
- [x] 재료·골드 드롭 및 줍기
- [x] HUD 기본

### Phase 2 — 인벤토리·저장
- [x] 인벤토리 창 (I)
- [x] 세이브/로드 (localStorage, 자동 저장)

### Phase 3 — 기지·포탑·습격 (핵심 재미 검증)
- [x] 텐트 설치, 기지 영역
- [x] 건설 메뉴 (B), 배치 미리보기
- [x] 나무 활 포탑 1종, 자동 타겟팅·발사
- [x] 낮/밤, 밤 습격 (실시간)

### Phase 4 — 성장
- [x] 레벨·경험치
- [x] 캐릭터 정보 창 (C), 장비 장착
- [x] 스킬 창 (K), 스킬트리 3갈래

### Phase 5 — 멀티 기지
- [x] 두 번째 지역 (숲)
- [x] 텐트 키트로 새 기지 생성
- [x] 지도 창 (M), 빠른 이동
- [x] 원격 기지 습격 계산 처리

### Phase 6 — 확장
- [x] 기지 레벨 업그레이드 (움막·집·요새)
- [x] 포탑 추가 종류, 업그레이드, 수리
- [x] 상점, 제작
- [x] 새 지역 (사막·설원), 보스

### 2차 업데이트 (`docs/UPDATE_GUIDE2.pdf`)
- [x] Phase 7 — 손맛과 사운드 (타격 피드백 · 구르기 · 합성 사운드·배경음 · 설정)
- [x] Phase 8 — 채집 (채집 노드 · 새 재료 · 건설비 재조정)
- [x] Phase 9 — 무기 종류와 장비 확장 (무기 4종 · 등급 전설 · 세트 효과 · 소모품·버프)
- [x] Phase 10 — 몬스터 다양화 (행동 8종 · 신규 12종 · 정예 · 보스 2)
- [x] Phase 11 — 스킬 개편 (액티브 스킬 · 패시브 추가 · 초기화)
- [ ] Phase 12 — 기지 확장, 습격 개편 (벽 · 새 건물 · 포탑 Lv5 · 장비 강화 · 습격 공식·웨이브·붉은 달)
- [ ] Phase 13 — 캐릭터, NPC, 퀘스트, 엔딩
- [ ] Phase 14 — 편의 기능과 마무리

---

## 7. 코딩 규칙

- 수치는 코드에 하드코딩하지 않는다. 전부 `data/*.json`에서 읽는다.
- 시스템끼리 직접 참조하지 말고 EventBus로 통신한다. (예: `monster:killed` → LootSystem, StatsSystem이 각각 처리)
- 파일 하나는 한 가지 역할만. 300줄 넘어가면 분리를 검토한다.
- 한 번에 한 기능만 작업한다. 요청받지 않은 기능은 추가하지 않는다.
- 세이브 데이터 구조를 바꿀 땐 `saveVersion`을 올리고 이전 버전 마이그레이션 코드를 넣는다.
- 성능: 화면 밖 청크의 몬스터는 업데이트하지 않는다. 투사체는 오브젝트 풀로 재사용한다.
- 작업이 끝나면 무엇을 바꿨는지, 어떻게 테스트하면 되는지 짧게 보고한다.

### 이벤트 목록 (현재)
| 이벤트 | 보내는 곳 | 받는 곳 |
|---|---|---|
| `player:attack` | Player | CombatSystem |
| `monster:attack` | Monster | CombatSystem |
| `combat:hit` | CombatSystem | HUD (데미지 숫자) |
| `monster:killed` | CombatSystem (`elite`, 자폭이면 `noLoot`) | LootSystem, StatsSystem, BossSystem |
| `loot:picked` | LootSystem | EconomySystem, InventorySystem (받은 만큼 `taken`에 더한다) |
| `gold:changed` | EconomySystem | HUD, InventoryWindow |
| `inventory:changed` | InventorySystem | InventoryWindow |
| `inventory:move` / `inventory:use` | InventoryWindow | InventorySystem |
| `item:use` / `item:equip` | InventorySystem | (소모품 효과·장비는 이후 Phase) |
| `save:collect` / `save:apply` | SaveSystem | Player, EconomySystem, InventorySystem |
| `save:done` | SaveSystem | HUD (저장 표시) |
| `game:new` | SaveSystem (저장 없음) | InventorySystem (시작 아이템) |
| `time:dusk` / `time:night` / `time:day` | Time | RaidSystem, HUD |
| `build:start` | InventorySystem(키트), BuildMenu | BuildSystem |
| `build:place` | BuildSystem | BaseSystem(텐트), TurretSystem(포탑) |
| `inventory:consume` | BaseSystem (키트 사용) | InventorySystem |
| `economy:spend` / `economy:reward` | BuildSystem / RaidSystem | EconomySystem (`ok`에 결과) |
| `base:created` | BaseSystem | HUD 알림 |
| `projectile:hit` | TurretSystem | CombatSystem |
| `structure:destroyed` | CombatSystem | RaidSystem (텐트면 실패) |
| `raid:result` | RaidSystem | HUD (아침 결과 배너) |
| `xp:gain` | StatsSystem (처치·건설을 듣고) | HUD (+XP 표시) |
| `stats:changed` / `stats:levelup` | StatsSystem | HUD, CharacterWindow, SkillWindow |
| `stats:spend-point` | SkillSystem | StatsSystem (`ok`에 결과) |
| `item:equip` | InventorySystem | EquipmentSystem |
| `inventory:replace-slot` / `inventory:add` | EquipmentSystem | InventorySystem |
| `equipment:unequip` | CharacterWindow | EquipmentSystem |
| `equipment:changed` | EquipmentSystem | StatsSystem, CharacterWindow |
| `skill:learn` | SkillWindow | SkillSystem |
| `skills:changed` | SkillSystem | StatsSystem, SkillWindow |
| `save:loaded` | SaveSystem | Player (HP 맞추기), ExplorationSystem |
| `region:entered` | ExplorationSystem | HUD (지역 알림) |
| `map:explored` | ExplorationSystem | MapWindow |
| `base:travel` | MapWindow | BaseSystem |
| `player:teleport` | BaseSystem | Player, Game (카메라) |
| `interact:hint` | InteractionSystem | HUD (E 안내) |
| `interact:turret` / `interact:base` | InteractionSystem | TurretWindow / BuildMenu |
| `base:upgrade` → `base:upgraded` | BuildMenu → BaseSystem | StatsSystem(경험치), HUD |
| `inventory:spend` | BaseSystem | InventorySystem (재료가 다 있으면 빼고 `ok`) |
| `turret:upgrade` / `turret:repair` / `turret:priority` / `turret:demolish` | TurretWindow | TurretSystem |
| `turret:changed` | TurretSystem | TurretWindow |
| `projectile:explode` | TurretSystem | CombatSystem (범위 피해) |
| `interact:facility` | InteractionSystem | CraftWindow / StorageWindow / ShopWindow |
| `facility:changed` | FacilitySystem | BuildMenu |
| `craft:make` | CraftWindow | CraftingSystem |
| `inventory:can-add` | CraftingSystem, EconomySystem | InventorySystem (`ok`) |
| `inventory:take-slot` | StorageSystem, EconomySystem | InventorySystem (칸을 통째로 꺼내 `item`에 담음) |
| `storage:deposit` / `storage:withdraw` → `storage:changed` | StorageWindow → StorageSystem | StorageWindow |
| `storage:lose` | RaidSystem | StorageSystem (`handled`) |
| `shop:buy` / `shop:sell` | ShopWindow | EconomySystem |
| `inventory:use-item` | HUD (퀵슬롯) | InventorySystem |
| `boss:aoe` | Boss, BossSystem(얼음덩이 착지) | CombatSystem (범위 안 플레이어 피해) |
| `boss:volley` / `boss:boulder` | Boss | BossSystem (투사체) |
| `enemy:hit-player` | BossSystem, EnemyShotSystem (`effect` 상태 이상) | CombatSystem |
| `boss:engaged` / `boss:disengaged` | Boss | HUD (보스 체력바) |
| `boss:status` | BossSystem | MapWindow (둥지 표시) |
| `pause:open` | UIManager (ESC), HUD (☰) | PauseMenu |
| `player:roll` | Player | SoundSystem, FeedbackSystem |
| `player:running` | Player (달리는 동안 주기적으로) | FeedbackSystem (먼지) |
| `turret:fired` | TurretSystem | FeedbackSystem (총구 섬광), SoundSystem |
| `ui:open` / `ui:close` | UIManager | SoundSystem |
| `settings:changed` | Settings | SoundSystem, MusicSystem, FeedbackSystem, HUD, Game(그림자), World(장식 밀도) |
| `raid:end` | RaidSystem (아침 정산) | MusicSystem |
| `gather:hit` | GatherSystem | FeedbackSystem (조각), SoundSystem |
| `gather:done` | GatherSystem | StatsSystem (경험치), FeedbackSystem, SoundSystem |
| `loot:spawn` | GatherSystem | LootSystem (바닥에 드롭) |
| `player:shoot` | PlayerAttack (활) | ArrowSystem |
| `arrow:hit` | ArrowSystem | CombatSystem |
| `status:apply` / `status:damage` | CombatSystem / StatusSystem | StatusSystem / CombatSystem |
| `player:heal` | CombatSystem (처치 시 회복) | Player |
| `buffs:changed` | BuffSystem | StatsSystem, HUD |
| `monster:shoot` | 행동 ranged | EnemyShotSystem |
| `monster:spawn` | CombatSystem (splitter 처치), 보스 소환 | MonsterSpawner |
| `monster:blast` / `monster:emerge` | 행동 exploder / burrower | CombatSystem (범위 피해) |
| `monster:charge-hit` | 행동 charger | CombatSystem |
| `boss:line` / `boss:leafstorm` / `boss:split` | 보스 패턴 | CombatSystem / EnemyShotSystem / BossSystem |
| `boss:enraged` | Boss (분노 페이즈) | (알림) |
| `monster:stunned` | 행동 charger (벽에 박음) | FeedbackSystem, SoundSystem |
| `loot:table` | BossSystem (분열 보스 처치 보상 `bossDrops`) | LootSystem (드롭 테이블 굴리기) |
| `stats:refund-points` | SkillSystem (망각의 물약) | StatsSystem |
| `skills:slots` | ActiveSkillSystem | SkillBar, SkillWindow |
| `skill:assign` | SkillWindow (Q·R 버튼) | ActiveSkillSystem |
| `skill:cast` | SkillBar (슬롯 누름) | ActiveSkillSystem (키보드 Q·R은 직접 읽는다) |
| `skill:used` | ActiveSkillSystem | FeedbackSystem, SoundSystem |
| `player:dash` / `player:sweep` | PlayerDash (돌진 시작 / 끝) | FeedbackSystem·SoundSystem / CombatSystem (지나간 길 판정) |
| `turret:overclock` | ActiveSkillSystem | TurretSystem (연사 배율), FeedbackSystem |

### 공유 상태 (ctx)
시스템끼리 직접 부르지 않는 대신, 월드에 존재하는 것들의 목록은 ctx에 두고 누구나 읽는다.
`ctx.player`, `ctx.monsters`, `ctx.bases`, `ctx.structures`(텐트·포탑), `ctx.time`, `ctx.mode`('play' | 'build'), `ctx.activeSkills`({ slots, cd } — UI가 쿨다운 표시용으로 읽는다)
| `player:damaged` / `player:died` / `player:respawned` | Player | HUD, EconomySystem |
| `notify` | 누구나 | HUD (알림) |
