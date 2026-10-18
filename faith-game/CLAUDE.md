# CLAUDE.md — 신흥 종교 전파 시뮬레이션 (이름 미정)

> 게임 이름은 아직 정하지 않았다. 정해지면 `src/config.js`의 `GAME.title`과 `index.html`의 `<title>`만 바꾼다.

이 문서는 게임의 설계 기준이다. 설계가 바뀌면 코드보다 이 문서를 먼저 고친다.

## 1. 개요
- 신흥 종교의 교주가 되어 한 달씩 세계에 신앙을 퍼뜨리는 턴제 전략 시뮬레이션 (문명6 종교 + Plague Inc. 확산 느낌)
- 실존 종교(기독교·이슬람교·힌두교·불교·유대교·민간 신앙·기타·무종교)는 **배경 세력**이다. 유닛을 움직이지 않고 나라별 비율이 저항력으로만 작동한다.
  - 모든 조직 종교는 같은 결속 계수를 쓴다. 특정 종교를 따로 다루거나 깎아내리는 규칙·문구를 넣지 않는다.
  - 교리·신앙 대상 효과는 도시화율·소득·자유도 같은 **나라 특성**에만 반응하게 만든다 (특정 종교를 겨냥하지 않는다).
- 승리: 세계 인구의 30% / 패배: 신도 0명

## 2. 기술·배포
- Vite + 바닐라 JS (ES 모듈), 지도는 d3-geo/d3-zoom + world-atlas `countries-110m`
- 저장: localStorage `faith-game-save` (매 행동·매 턴 자동 저장, `saveVersion` + 마이그레이션 표)
- 레포 루트가 GitHub Pages로 서비스된다. 소스는 `faith-game/`, 빌드 결과는 **레포 루트 `faith/`** (`base: './'`). 배포물은 손으로 고치지 않고 `npm run build`로 다시 만든다.

```bash
cd faith-game
npm install
npm run dev        # 개발 서버
npm run build      # ../faith/ 로 빌드
npm run adjacency  # 국가 연결(육로·해로) 다시 계산
node tools/simulate.mjs 410 cosmos healing,open,communal 400   # 밸런스 확인 (자동 플레이)
```

## 3. 폴더 구조
```
src/
  config.js        ★ 모든 밸런스 수치 (전파·성장·이탈·유닛·단계·신앙 대상·교리)
  main.js          부트: 데이터 로드 → 지도 → 시작 화면
  data/            countries.json(나라 175곳) · religions.json · adjacency.json(생성물) · loader.js · ids.js
  map/             worldMap.js(그리기 전용) · colorModes.js(색칠 모드) · unitLayer.js(유닛 핀)
  game/            state.js · turn.js(턴 단계 배열) · stages.js · save.js · events.js
  religion/        deities.js · tenets.js · modifiers.js(수정자 합산) · spread.js(전파 공식) · founding.js
  units/           unitTypes.js · units.js(생산·이동·행동) · abilities.js(능력 표)
  ui/              styles.css(디자인 토큰) · titleScreen · foundingScreen · gameScreen(컨트롤러) · hud · countryPanel · dock · production · toast(배너·모달)
tools/             build-adjacency.mjs · simulate.mjs
```
- `game/`, `religion/`, `units/`, `data/`는 DOM을 모른다 → 노드에서 `tools/simulate.mjs`로 그대로 돌릴 수 있어야 한다.

## 4. 데이터
- `countries.json`: `{ name, region, pop, urban, freedom(0~100), gdpTier(1~4), religions? }`. `religions`가 없으면 `regionDefaults[region]`(지역 평균)을 쓴다. 숫자는 실제 통계 근사값.
- 키는 world-atlas 도형 ID(ISO 숫자). 코드 없는 도형은 `ids.js`에서 정한다 (북키프로스 1001, 소말릴란드 1002, 코소보 383). 남극·프랑스령 남방 지역은 뺀다.
- `adjacency.json`: `land`는 국경 공유, `sea`는 해안선 사이 650km 이내 + 수동 항로. 직접 고치지 말고 스크립트를 고친다.

## 5. 규칙
- 저항력 = Σ(기존 종교 비율 × 결속 계수) × (1 + 거부감) × 교리 보정
- 유닛 전파량 = 기본값 × 교리 보정 × (1 − 저항력) × 자유도 보정 × (개종 가능 인구)^0.6
- 턴 순서(`TURN_PHASES`): 신앙력 수입 → 유닛 지속 효과 → 자연 증가 → 이탈 → 인접국 자연 전파 → 거부감·경계 → 단계/승패
- 유닛: 매달 이동 1회 + 활동 1회. 이동은 육로 이웃 또는 바다 건너 2칸. 생산은 신도 100명 이상인 나라에서.
- 성장 단계: 컬트 → 신흥 종교 → 국제 교단 → 세계 종교 (신도 수 + 진출 국가 수). 내려가지 않는다. 단계마다 성장·신앙력 배율과 유닛 해금.

## 6. 2단계 확장 지점 (아직 만들지 않음)
- 정부 탄압·국교 지정: `TURN_PHASES`에 단계 추가, 이미 쌓이는 `countries[id].alert`(정부 경계)·`aversion`(거부감)을 읽는다. 비밀주의의 `persecution` 수정자가 피해 배율.
- 스캔들·내부 분열 이벤트: `game/events.js`로 알리고, 효과는 `state.extraModifiers`에 수정자로 넣는다.
- 성지·사원 건설: 나라 상태에 필드 추가 + `extraModifiers` 또는 턴 단계.
- 사도 유닛·신학 논쟁: `unitTypes.js` + `abilities.js`에 항목 추가.
- 교리 슬롯 해금: `GAME.tenetSlots`.
- 저장 형식이 바뀌면 `GAME.saveVersion`을 올리고 `save.js`의 `MIGRATIONS`에 변환을 추가한다.

## 7. 디자인
- iOS 기본 앱 톤: 무채색 바탕 + 반투명 카드, 강조색은 플레이어의 종교 색 하나. 장식·이모지·그라데이션 남발 금지.
- 라이트/다크는 시스템 설정을 따른다. 색은 `styles.css`의 토큰만 쓴다.
- PC: 상단 바 / 왼쪽 지도 도구 / 오른쪽 나라 패널 / 하단 독. 모바일(≤760px): 패널은 독 위 시트, 독 높이는 `--dock-h`로 전달.
- 모든 UI 문구는 한국어.
