# CLAUDE.md — 초원 기지 RPG (가제)

이 문서는 게임의 설계 기준이다. 모든 작업은 이 문서를 먼저 읽고 따른다.
설계가 바뀌면 코드보다 이 문서를 먼저 수정한다.

---

## 1. 게임 개요

- **장르**: 자유도 높은 오픈필드 액션 RPG + 기지 건설 + 타워 디펜스
- **분위기**: 동물의 숲 같은 아기자기한 로우폴리 초원
- **시점**: 비스듬한 탑다운 3D 카메라 (플레이어 추적)
- **플랫폼**: 웹 브라우저 (PC 우선, 키보드+마우스)
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
    Time.js            # 게임 내 시간, 낮/밤
  world/
    World.js           # 지면·조명·충돌·경계 (청크 로딩은 월드가 더 커지는 Phase 6에서 Chunk.js로)
    Decor.js           # 지역별 나무·바위·꽃 배치 (시드 난수)
    Chunk.js           # 지형 타일, 오브젝트 배치
    Regions.js         # 지역(초원/숲/사막/설원) 찾기·색 섞기
  entities/
    Player.js
    Monster.js
    MonsterModel.js    # 몬스터 모양 (슬라임 / 버섯)
    RaidMonster.js     # 밤 습격 몬스터 AI
    Drop.js            # 바닥에 떨어진 골드·아이템 (줍기)
    Projectile.js      # 화살, 총알, 포탄
    Building.js        # 기지 중심 건물 (텐트~요새)
    BaseModels.js      # 기지 단계별 모양
    Turret.js
    TurretModels.js    # 포탑 종류별 모양
    ResourceNode.js    # 나무, 바위, 풀 등 채집물
  systems/
    CombatSystem.js
    MonsterSpawner.js
    ExplorationSystem.js # 탐험한 칸(지도 안개), 지역 진입 알림
    LootSystem.js
    InventorySystem.js
    EquipmentSystem.js
    StatsSystem.js     # 레벨, 경험치, 능력치
    SkillSystem.js
    BuildSystem.js     # 건설 모드, 배치 검증
    BaseSystem.js      # 기지 목록, 기지 레벨, 빠른 이동
    TurretSystem.js    # 타겟팅, 발사, 업그레이드·수리·철거
    InteractionSystem.js # E 상호작용 대상 찾기 (포탑·기지)
    RaidSystem.js      # 밤 습격 (실시간 + 원격 계산)
    EconomySystem.js   # 골드, 상점
    SaveSystem.js
  ui/
    UIManager.js       # 창 열기/닫기, 단축키
    HUD.js
    InventoryWindow.js
    CharacterWindow.js
    SkillWindow.js
    BuildMenu.js
    TurretWindow.js    # 포탑 관리 (E)
    ShopWindow.js
    MapWindow.js
    Tooltip.js
    styles.css
  utils/
    random.js          # 시드 난수 (월드 배치 재현용)
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

### 4-2. 몬스터
- 필드 몬스터: 지역별로 스폰, 기지 안전지대 안에는 스폰 안 됨
- 습격 몬스터: 밤에 기지를 향해 이동, 건물·포탑·플레이어 공격
- AI 상태: 배회 → 추적 → 공격 → (체력 낮으면) 도주
- 드롭: 경험치, 골드, 재료 (`monsters.json`의 드롭 테이블 기준)

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
    "skills": { "ranks": { "power": 2 } },
    "exploration": { "cells": "0011100…", "visited": ["grassland"] }
  }
  ```
- v1 → v2: `time`·`bases`·`turrets` 추가, 기지가 없으니 텐트 키트 1개 지급
- v2 → v3: `stats`·`equipment`·`skills` 추가 (레벨 1부터)
- v3 → v4: `exploration` 추가 (빈 값 → 불러온 뒤 플레이어·기지 주변부터 다시 밝힌다)
- v4 → v5: 포탑마다 `priority` 추가 (기본값은 그 포탑 종류의 `priority`)
- 불러오기가 끝나면 `save:loaded` 이벤트. 플레이어 HP는 장비·스킬까지 반영된 최대치로 이때 맞춘다
- 구조를 바꾸면 `SAVE_VERSION`을 올리고 `SaveSystem.js`의 `migrations`에 이전 버전 → 새 버전 변환을 넣는다
- 저장이 깨졌으면 `<key>-broken`으로 옮겨 두고 새로 시작한다. 더 새로운 버전의 저장이면 덮어쓰지 않는다

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
- 스킬은 한 번에 1랭크씩, 찍기 전 확인 창을 띄운다. 초기화 기능은 아직 없다
- 채집 속도·채집량 스킬은 찍을 수 있지만, 채집(ResourceNode)이 추가된 뒤부터 효과가 난다

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
- 지역은 z 범위로 나눈다 (`regions.json`의 `zFrom`·`zTo`). 남쪽(시작 지점)이 초원, 북쪽(W 방향)이 숲
- 지역마다: 난이도, 능력치 배율, 필드 몬스터 목록, 습격 몬스터, 지면 색, 장식 밀도
- 숲 버섯 몬스터는 낮은 확률로 텐트 키트를 떨어뜨린다 → 두 번째 기지의 재료
- 지역 경계를 넘으면 지역 이름 알림 (처음 가 본 지역은 큰 배너)

### 4-5-2. 기지 업그레이드 (Phase 6)
- 텐트(Lv1) → 움막(Lv2) → 집(Lv3) → 요새(Lv4). 단계별 수치와 비용은 `buildings.json`의 `baseLevels`
- 비용은 **재료** (경제 원칙: 재료 = 건설). 다음 단계의 `cost`에 적힌 재료를 가방에서 쓴다
- 올리면: 영역 반경·포탑 설치 수·중심 건물 체력이 늘고, 모양이 바뀌고, 새 포탑이 해금된다. 경험치도 받는다
- 건설 창(B)의 건물 탭에서 올린다. 기지 중심 건물 앞에서 E를 눌러도 건설 창이 열린다

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

### HUD (항상 표시)
- 좌상단: HP, 스태미나, 레벨, 경험치 바
- 우상단: 골드, 날짜, 낮/밤 시계
- 하단: 퀵슬롯 1~5 (소모품)
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
- [ ] 상점, 제작
- [ ] 새 지역 (사막·설원), 보스

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
| `monster:killed` | CombatSystem | LootSystem |
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

### 공유 상태 (ctx)
시스템끼리 직접 부르지 않는 대신, 월드에 존재하는 것들의 목록은 ctx에 두고 누구나 읽는다.
`ctx.player`, `ctx.monsters`, `ctx.bases`, `ctx.structures`(텐트·포탑), `ctx.time`, `ctx.mode`('play' | 'build')
| `player:damaged` / `player:died` / `player:respawned` | Player | HUD, EconomySystem |
| `notify` | 누구나 | HUD (알림) |
