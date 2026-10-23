# CLAUDE.md — 잠기록 (수면 기록 웹앱)

> 1단계 기획서가 설계 기준이다. 2단계(Supabase 로그인 + DB) 이후 기능은 아직 만들지 않는다.
> 단, 입력은 **잔 시각 · 깬 시각만** 받는다 (잘게요/일어났어요 버튼, 깬 횟수·개운함·생활 요인 입력은 뺐다).
> `awakenings`·`quality`·`DailyFactors`·`PendingSleep` 은 예전 데이터 호환을 위해 타입·저장소에만 남아 있다.

## 원칙
- iOS 기본앱 같은 자연스러움. 색은 `src/styles/tokens.css` 의 시맨틱 토큰만 쓴다 (하드코딩 금지).
- 모든 움직임은 스프링 (`src/lib/motion.ts`). 선형/이징 애니메이션 금지.
- 의료 표현("진단", "치료", "불면증", "질환") 금지. 수치는 "본인 기록 기반 참고 지표".
- UI 라이브러리 사용 금지. CSS Modules + 토큰.

## 구조
```
src/
  types.ts                 SleepLog · DailyFactors · Settings · PendingSleep
  storage/                 ★ 저장소 계층 — 화면은 여기 인터페이스만 쓴다
    types.ts               SleepRepository 인터페이스 (Promise 기반, 2단계 대비)
    localStorageRepo.ts    1단계 구현체 (키 'jamgirok', schemaVersion 포함)
    validate.ts            불러오기 검사 + 버전 마이그레이션 표
    index.ts               앱이 쓰는 repo 를 고르는 한 줄 (2단계는 여기만 교체)
  store/store.tsx          React 상태. repo 만 거친다
  lib/sleepCalc.ts         ★ 계산 규칙 (자정 넘김, 18:00 기준 평균/편차) + 테스트
  components/              Page(라지 타이틀) · TabBar · Sheet · Wheel · Segmented · ui(액션시트·체크)
  sheets/entry.tsx         날짜 · 잔 시각 · 깬 시각 입력 (홈과 시트가 같이 씀)
  sheets/LogSheet.tsx      기록 추가 · 수정 바텀 시트
  screens/                 Home · Logs · Stats · Settings
```

## 명령
```bash
cd sleep-app
npm install
npm run dev     # 개발 서버 (--host: 같은 와이파이의 아이폰에서 확인)
npm test        # Vitest (계산·저장소)
npm run build   # 타입 검사 후 ../sleep/ 로 빌드 → GitHub Pages test/sleep/
```

## 직접 입력 시각 해석
- 기상일 + 잔 시각: 18:00 이후면 기상 전날 밤, 그 전이면 기상 당일.
- sleepTime 은 bedTime 과 같게 저장한다 (수면시간 = 깬 시각 − 잔 시각).
