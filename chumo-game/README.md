# 각하, 결재 바랍니다 — 추모공화국 카드 게임

추모공화국 대통령(각하)이 되어 국무위원의 보고를 좌우로 결재하는 Reigns 방식 카드 게임.

- 주소: https://sinje0626ab-byte.github.io/test/chumo-game/
- 빌드 과정 없음. 순수 HTML/CSS/JS라서 파일을 올리면 GitHub Pages에 바로 반영된다 (반영까지 보통 1~2분, 브라우저 캐시 때문에 최대 10분).
- **카드·인물·엔딩을 추가하는 방법은 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)를 본다.** 코드는 건드리지 않는다.

## 규칙

- 수치 4개: 민심 · 치안 · 국고 · 내각결속. 각각 0~100, 시작값 50.
- 카드마다 왼쪽/오른쪽 중 하나를 고른다. 스와이프, 아래 버튼, 키보드 ←/→(한 번은 미리보기, 한 번 더 누르면 결재) 모두 된다.
- 고르기 전에는 영향을 받는 수치 아래에 점만 뜬다. 오르는지 내리는지, 얼마나인지는 숨긴다.
- 수치 하나라도 0 또는 100에 닿으면 그 수치의 엔딩으로 임기가 끝난다.
- 살아남은 카드 수가 재임 일수(점수). 최장 기록은 브라우저(localStorage)에 저장된다.
- 최근 14일 안에 추가된 카드에는 NEW 표시가 붙는다. 타이틀의 「개정 내역」은 cards.json의 `added` 날짜별로 카드 수를 자동으로 센다.

## 폴더 구조

```
chumo-game/
├─ index.html              화면 뼈대
├─ css/style.css           디자인
├─ js/                     엔진 (콘텐츠를 추가할 때는 건드리지 않는다)
│  ├─ config.js            수치 이름·시작값·NEW 기간 같은 규칙 상수
│  ├─ loader.js            JSON 읽기, 문법 오류 위치 찾기, 내용 점검
│  ├─ engine.js            카드 뽑기·수치 계산·엔딩 판정
│  └─ main.js              화면 그리기, 스와이프·버튼·키보드
├─ data/                   콘텐츠 (여기만 고친다)
│  ├─ cards.json
│  ├─ characters.json
│  └─ endings.json
├─ img/
│  ├─ cards/               카드 이미지 (webp, 4:5)
│  ├─ portraits/           인물 기본 초상화 (webp, 4:5)
│  ├─ endings/             엔딩 이미지 (webp, 4:5, 선택)
│  └─ raw/                 원본을 넣는 곳 — 저장소에는 올라가지 않는다 (.gitignore)
├─ scripts/optimize-images.py
├─ README.md
└─ CONTENT_GUIDE.md
```

이미지 표시 순서: 카드 `image` → 인물 `portrait` → 이름 첫 글자가 든 원형. 파일이 없거나 깨져도 다음 단계로 넘어가므로 게임은 멈추지 않는다.

## 로컬에서 테스트하기

`index.html`을 더블클릭해서 열면(`file://`) 브라우저가 JSON 읽기를 막아서 게임이 뜨지 않는다. 로컬 서버가 필요하다.
**저장소 맨 위 폴더(`test/`)에서** 서버를 켜야 상단 엠블럼(`../assets/`)까지 제대로 보인다.

### 방법 1 — Python (macOS·Linux에는 대개 이미 있음)

```bash
cd test                      # 저장소 맨 위 폴더
python3 -m http.server 8000  # Windows는 python -m http.server 8000
```

브라우저에서 http://localhost:8000/chumo-game/ 를 연다. 끌 때는 터미널에서 Ctrl+C.

### 방법 2 — Node.js

```bash
cd test
npx serve -l 8000 .
```

### 방법 3 — VS Code

확장 프로그램 「Live Server」를 설치하고, 저장소 폴더를 연 뒤 `chumo-game/index.html`에서 우클릭 → Open with Live Server.

### 휴대폰으로 확인하기

컴퓨터와 휴대폰이 같은 와이파이에 있으면, 위 서버를 켠 상태로 휴대폰에서 `http://<컴퓨터 IP>:8000/chumo-game/` 를 연다.
(컴퓨터 IP는 macOS `ipconfig getifaddr en0`, Windows `ipconfig`의 IPv4 주소)

JSON을 고친 뒤에는 새로고침만 하면 된다. 문법 오류가 있으면 화면에 파일 이름과 줄 번호가 뜬다.
내용 문제(없는 인물, 잘못된 수치 이름 등)는 타이틀 화면의 「⚠ 콘텐츠 점검」 버튼에 모인다.

## 이미지 압축 스크립트

`img/raw/` 에 넣은 원본(png/jpg/jpeg/webp)을 4:5로 자르고(위쪽을 조금 더 남겨 얼굴이 잘리지 않게), 최대 960×1200으로 줄이고, 장당 200KB 이하 webp로 만든다.

| 원본을 넣는 곳 | 결과가 나오는 곳 |
|---|---|
| `img/raw/cards/` | `img/cards/` |
| `img/raw/portraits/` | `img/portraits/` |
| `img/raw/endings/` | `img/endings/` |
| `img/raw/` 바로 아래 | `img/cards/` |

파일 이름은 그대로 두고 확장자만 `.webp`가 된다 (`cis_founding.png` → `cis_founding.webp`).

### 처음 한 번만: 준비

Python 3.8 이상과 Pillow가 필요하다.

```bash
pip install pillow       # 안 되면 pip3 install pillow 또는 python -m pip install pillow
```

### 실행

```bash
cd test/chumo-game
python3 scripts/optimize-images.py           # 새로 넣거나 바뀐 원본만 변환
python3 scripts/optimize-images.py --force   # 전부 다시 변환
```

Windows에서는 `python3` 대신 `python`. 결과는 한 줄씩 출력된다:

```
  완료  img/raw/cards/cis_founding.png -> img/cards/cis_founding.webp  (960x1200, 143KB, 품질 80)
```

## 규칙 상수 바꾸기

`js/config.js`에 모여 있다. 수치 이름·아이콘, 시작값(50), NEW 표시 기간(14일), 같은 카드 반복 방지 간격.
수치 이름을 바꾸면 cards.json의 `effects`와 endings.json의 `stat`도 같이 바꿔야 한다.
