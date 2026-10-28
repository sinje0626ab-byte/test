# 콘텐츠 추가 안내서

방에서 일어난 사건을 카드로 만드는 방법. 코드는 몰라도 된다. **`data/` 폴더의 JSON 파일과 `img/` 폴더의 이미지만 고친다.**

순서는 늘 같다.

1. **카드 쓰기** — `data/cards.json` 맨 끝에 카드를 붙여 넣는다
2. **이미지 넣기** — 원본을 `img/raw/cards/` 에 넣는다 (선택)
3. **압축 스크립트 실행** — `python3 scripts/optimize-images.py`
4. **확인** — 로컬 서버로 열어 본다 (README.md 「로컬에서 테스트하기」)
5. **커밋** — 바뀐 파일을 GitHub에 올린다

---

## 1. 카드 쓰기

`data/cards.json`을 연다. 파일 전체가 `[` 로 시작해 `]` 로 끝나는 목록이고, 카드 하나는 `{ ... }` 한 덩어리다.

### 붙이는 법

맨 마지막 카드의 닫는 `}` 뒤에 **쉼표 `,` 를 찍고**, 아래 템플릿을 붙여 넣은 다음 내용을 바꾼다. 마지막 카드 뒤에는 쉼표를 찍지 않는다.

```
  {
    "id": "맨 마지막 카드",
    ...
    "added": "2026-10-10"
  },          ← 여기 쉼표를 새로 찍고
  {           ← 새 카드를 붙여 넣는다
    "id": "new_card",
    ...
    "added": "2026-10-28"
  }           ← 마지막 카드 뒤에는 쉼표 없음
]
```

### 기본 템플릿 (복사해서 쓰기)

```json
  {
    "id": "여기에_영문_아이디",
    "who": "chumoyeolsa",
    "text": "각하, 보고드립니다. 여기에 보고 내용을 씁니다.",
    "image": "",
    "left":  { "label": "기각", "effects": { "민심": -5 }, "setFlags": [], "next": null },
    "right": { "label": "승인", "effects": { "치안": 10, "국고": -10 }, "setFlags": [], "next": null },
    "requires": [],
    "excludes": [],
    "weight": 1,
    "once": false,
    "added": "2026-10-28"
  }
```

### 필드 설명

| 필드 | 꼭 필요? | 설명 | 예 |
|---|---|---|---|
| `id` | 필수 | 카드 고유 이름. **영문 소문자·숫자·밑줄(_)만**, 다른 카드와 겹치면 안 된다. 이미지 파일 이름으로도 쓰면 편하다. | `"cis_founding"` |
| `who` | 필수 | 말하는 인물. `characters.json`의 `id`를 그대로 쓴다. | `"bukanistan"` |
| `text` | 필수 | 카드 위에 뜨는 보고 내용. 관공서 공문 말투로. | `"각하, ~를 건의드립니다."` |
| `image` | 선택 | 이 카드 전용 이미지. 비워 두면(`""`) 인물 초상화가 나온다. | `"img/cards/cis_founding.webp"` |
| `left` / `right` | 필수 | 왼쪽·오른쪽 선택지. 아래 「선택지 안의 필드」 참고. | |
| `requires` | 선택 | 이 플래그가 **모두** 켜져 있어야 카드가 나온다. | `["cis_exists"]` |
| `excludes` | 선택 | 이 플래그 중 **하나라도** 켜져 있으면 카드가 안 나온다. | `["cis_exists"]` |
| `weight` | 선택 | 나올 확률 가중치. 2면 1보다 두 배 자주 나온다. **0이면 무작위로는 안 나오고 `next`로만 나온다.** 기본 1. | `1` |
| `once` | 선택 | `true`면 한 판에 한 번만 나온다. 기본 `false`. | `true` |
| `added` | 선택 | 카드를 추가한 날짜. **`"YYYY-MM-DD"` 모양.** 개정 내역과 NEW 표시(14일)에 쓰인다. | `"2026-10-28"` |

### 선택지(`left`, `right`) 안의 필드

| 필드 | 설명 | 예 |
|---|---|---|
| `label` | 버튼과 카드 위에 뜨는 짧은 글. 10자 안팎이 좋다. | `"승인"` |
| `effects` | 수치 변화. 이름은 **`민심` `치안` `국고` `내각결속`** 네 개뿐이다. 숫자는 따옴표 없이. 올리면 양수, 내리면 음수. 보통 5~15, 큰 사건은 20. | `{ "치안": 15, "민심": -10 }` |
| `setFlags` | 이 선택을 하면 켜지는 플래그. 나중 카드의 `requires`/`excludes`에 쓴다. | `["cis_exists"]` |
| `clearFlags` | 이 선택을 하면 꺼지는 플래그. (선택, 없어도 됨) | `["nick_case_sent"]` |
| `next` | 다음에 **바로** 이어질 카드의 `id`. 없으면 `null`. | `"correction_intake"` |

> **수치 균형 팁**: 한쪽 선택지만 계속 좋으면 게임이 쉬워진다. 좋은 점과 나쁜 점을 같이 주고, 양쪽 선택지가 서로 다른 수치를 건드리게 하면 고민이 생긴다.

### 플래그란?

「이 판에서 이런 일이 있었다」는 표시다. 이름은 자유롭게 짓되 영문 소문자와 밑줄로 쓴다.

- 추모정보원 신설을 **승인**하면 `"setFlags": ["cis_exists"]` → `cis_exists` 플래그가 켜진다.
- 「추모정보원 첫 보고」 카드는 `"requires": ["cis_exists"]` → 정보원이 생긴 판에서만 나온다.
- 「추모정보원 신설」 카드는 `"excludes": ["cis_exists"]` → 이미 생겼으면 다시 안 나온다.

### 연속 사건 만들기 (`next`)

한 사건이 여러 장으로 이어질 때 쓴다. 샘플의 「닉변자 적발 → 교정국 송치 → 특별추모교정실」이 이 방식이다.

```json
  {
    "id": "nickchange_detected",
    "who": "bukanistan",
    "text": "각하, 추모봇이 이름을 바꿔 돌아온 자 1명을 적발하였습니다.",
    "left":  { "label": "벌금 부과 후 방면", "effects": { "국고": 10, "치안": -10 }, "setFlags": [], "next": null },
    "right": { "label": "추모교정국 송치", "effects": { "치안": 10, "민심": -5 }, "setFlags": ["nick_case_sent"], "next": "correction_intake" },
    "weight": 2,
    "added": "2026-10-28"
  },
  {
    "id": "correction_intake",
    "who": "temp_officer_gap",
    "text": "추모교정국입니다. 송치된 닉변자의 신병을 인수하였습니다.",
    "left":  { "label": "가석방", "effects": { "민심": 5 }, "setFlags": [], "clearFlags": ["nick_case_sent"], "next": null },
    "right": { "label": "특별추모교정실 입소", "effects": { "치안": 10, "민심": -10 }, "setFlags": [], "clearFlags": ["nick_case_sent"], "next": null },
    "requires": ["nick_case_sent"],
    "weight": 0,
    "added": "2026-10-28"
  }
```

- 첫 카드에서 「송치」를 고르면 `next`에 적힌 `correction_intake`가 **바로 다음 장**으로 나온다.
- 이어지는 카드는 `"weight": 0`으로 두면 무작위로 끼어들지 않는다.
- `next`로 부른 카드는 `requires`와 상관없이 나온다. 그래도 `requires`를 같이 적어 두면 「어디서 이어지는 카드인지」 알아보기 쉽다.

**바로 이어지지 않고 「나중에 언젠가」 나오게** 하려면 `next` 대신 플래그만 쓴다. 샘플의 「하나원 연금 선지급 → (몇 장 뒤) 귀순자 도주」가 이 방식이다. 앞 카드에서 `setFlags`로 켜고, 뒤 카드에 `requires`를 걸고 `"once": true`를 준다.

---

## 인물 추가 — `data/characters.json`

```json
  {
    "id": "new_person",
    "name": "표시될 이름",
    "title": "직책",
    "portrait": "img/portraits/new_person.webp",
    "initials": "표"
  }
```

| 필드 | 설명 |
|---|---|
| `id` | 카드의 `who`에 쓰는 이름. 영문 소문자·숫자·밑줄. |
| `name` | 카드 아래에 크게 뜨는 이름. |
| `title` | 이름 밑의 작은 글씨(직책). |
| `portrait` | 기본 초상화 경로. 파일이 아직 없어도 된다 — 그동안은 원형 이니셜이 나온다. |
| `initials` | (선택) 원형 안에 들어갈 글자. 없으면 `name`의 첫 글자. |

샘플의 `temp_officer_gap`(교정관 갑), `temp_instructor_eul`(교육관 을)은 **임시 인물**이다(`"temporary": true`). 실제 인물로 바꿀 때는 `name`·`title`·`portrait`만 고치면 이 인물이 나오는 카드는 그대로 따라온다. `id`까지 바꾸려면 카드들의 `who`도 함께 바꾼다.

## 엔딩 고치기 — `data/endings.json`

수치 4개 × (0, 100) = 8개. `stat`과 `at`은 그대로 두고 `title`, `text`, `image`만 고친다.

```json
  { "stat": "민심", "at": 0, "title": "탄핵", "text": "…", "image": "img/endings/impeach.webp" }
```

---

## 2. 이미지 넣기

- 비율은 **4:5(세로가 조금 긴 직사각형)**. 다른 비율이어도 스크립트가 4:5로 잘라 준다 (위쪽을 조금 더 남긴다).
- 원본은 png 또는 jpg. 크기는 아무래도 좋다.
- **원본 파일 이름 = 카드 `id`** 로 맞추면 헷갈리지 않는다.

| 무엇 | 원본을 넣는 곳 | JSON에 쓰는 경로 |
|---|---|---|
| 카드 전용 이미지 | `img/raw/cards/cis_founding.png` | 카드의 `"image": "img/cards/cis_founding.webp"` |
| 인물 초상화 | `img/raw/portraits/bukanistan.png` | 인물의 `"portrait": "img/portraits/bukanistan.webp"` |
| 엔딩 이미지 | `img/raw/endings/impeach.png` | 엔딩의 `"image": "img/endings/impeach.webp"` |

JSON 경로는 확장자가 **`.webp`** 다 (원본이 png여도).

## 3. 압축 스크립트 실행

터미널에서 (처음 한 번은 `pip install pillow` 필요):

```bash
cd test/chumo-game
python3 scripts/optimize-images.py
```

`img/cards/`, `img/portraits/`, `img/endings/`에 200KB 이하 webp가 생긴다. `img/raw/`의 원본은 저장소에 올라가지 않는다.

> 스크립트를 돌릴 수 없는 환경이라면: https://squoosh.app 에서 WebP, 품질 75로 저장해 같은 폴더에 직접 넣어도 된다. 비율은 미리 4:5로 잘라 둔다.

## 4. 확인

로컬 서버로 열어서 (README.md 「로컬에서 테스트하기」) 새로고침한다.

- **화면에 「게임 데이터를 읽지 못했습니다」가 뜨면** → JSON 문법 오류. 아래 「오류가 났을 때」.
- **타이틀에 「⚠ 콘텐츠 점검: 경고 N건」이 뜨면** → 게임은 돌아가지만 뭔가 어긋났다 (없는 인물, 잘못된 수치 이름, 이어지지 않는 `next` 등). 눌러서 목록을 본다.
- 「개정 내역」에 오늘 날짜와 새 카드 수가 맞게 나오는지 본다.
- 새 카드가 잘 안 나오면 잠시 `"weight": 50`으로 올려서 확인하고, 확인 뒤 되돌린다.

## 5. 커밋

### 터미널

```bash
cd test
git add chumo-game/data chumo-game/img
git commit -m "카드 추가: 추모정보원 신설"
git push
```

### GitHub 웹에서

1. 저장소의 `chumo-game/data/cards.json` → 연필 아이콘 → 고치고 「Commit changes」.
2. 이미지는 `chumo-game/img/cards/` 폴더로 가서 「Add file → Upload files」로 webp를 끌어다 놓고 「Commit changes」.

1~2분 뒤 https://sinje0626ab-byte.github.io/test/chumo-game/ 에 반영된다. 안 바뀌어 보이면 새로고침을 한 번 더 한다.

---

## 오류가 났을 때

게임 화면에 **문제 파일, 줄 번호, 원인**이 뜨고, 그 줄 근처가 `^ 여기` 표시와 함께 나온다. 가장 흔한 실수:

| 화면에 뜬 말 | 고치는 법 |
|---|---|
| 마지막 항목 뒤에 쉼표(,)가 남아 있습니다 | `}` 나 `]` 바로 앞의 쉼표를 지운다. |
| 항목 사이에 쉼표(,)가 빠졌거나… | 표시된 줄 **바로 윗줄** 끝에 쉼표를 찍는다. 카드와 카드 사이 `},` 를 확인. |
| 둥근 따옴표(“)가 있습니다 | 휴대폰·워드에서 복사하면 생긴다. `"` 로 바꾼다. |
| 따옴표가 닫히지 않은 채 줄이 바뀌었습니다 | 문장 끝에 `"` 를 빠뜨렸다. 문장 안에서 따옴표가 필요하면 「」를 쓴다. |
| 작은따옴표(')는 쓸 수 없습니다 | JSON은 큰따옴표 `"` 만 쓴다. |
| 파일을 찾을 수 없습니다 | 파일 이름·위치가 바뀌었다. `data/cards.json` 그대로여야 한다. |

### 쓰기 전 체크리스트

- [ ] `id`가 다른 카드와 겹치지 않는다
- [ ] `who`가 `characters.json`에 있는 `id`다
- [ ] `effects`의 수치 이름이 `민심`/`치안`/`국고`/`내각결속` 중 하나다 (띄어쓰기 없이)
- [ ] 숫자에 따옴표를 치지 않았다 (`10` ⭕, `"10"` ❌)
- [ ] `next`에 적은 카드가 실제로 있다
- [ ] `added`가 `"2026-10-28"` 모양이다
- [ ] 카드와 카드 사이에 쉼표가 있고, 맨 마지막 카드 뒤에는 없다
