#!/usr/bin/env python3
"""「영원하라 추모공화국」 전자책 빌더.

forever/src/ 의 원고(NN.md)와 책 정보(book.json)를 읽어
  forever/index.html  — 전자책 (펼친 면: 왼쪽 글, 오른쪽 그림)
  forever/PROMPTS.md  — 챗GPT에 넣을 그림 프롬프트
를 만든다. 표준 라이브러리만 쓴다.

    python3 forever/build.py

그림은 forever/images/ 에 「장-쪽」 이름(예: 01-03.webp, 표지는 cover.webp)으로 두면 붙는다.
원고 형식은 forever/WRITING.md 에 있다.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
IMAGES = ROOT / "images"
EXTS = (".webp", ".png", ".jpg", ".jpeg")


def find_image(stem):
    for ext in EXTS:
        if (IMAGES / (stem + ext)).exists():
            return stem + ext
    return None


# ---------------------------------------------------------------------------
# 원고 읽기
# ---------------------------------------------------------------------------

def parse_chapter(path):
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    head, sep, rest = text.partition("\n=== 쪽\n")
    if not sep:
        sys.exit(f"{path.name}: '=== 쪽' 이 하나도 없습니다")
    meta = {}
    for line in head.splitlines():
        k, colon, v = line.partition(":")
        if colon and k.strip() in ("부", "장"):
            meta[k.strip()] = v.strip()
    if "장" not in meta:
        sys.exit(f"{path.name}: 맨 위에 '장: 제목' 줄이 없습니다")

    pages = []
    for chunk in ("=== 쪽\n" + rest).split("=== 쪽\n")[1:]:
        m = re.match(r"\s*그림:\s*(.+?)\n", chunk + "\n")
        if not m:
            sys.exit(f"{path.name} {len(pages) + 1}쪽: 첫 줄에 '그림: 장면' 이 없습니다")
        body = chunk[m.end():].strip()
        paras = [" ".join(l.strip() for l in p.splitlines()) for p in re.split(r"\n\s*\n", body) if p.strip()]
        pages.append({"scene": m.group(1).strip(), "paras": paras})
    return {"key": path.stem, "part": meta.get("부", ""), "title": meta["장"], "pages": pages}


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    return s


# ---------------------------------------------------------------------------
# 전자책 HTML
# ---------------------------------------------------------------------------

def pic_html(stem, alt, label, eager=False):
    img = find_image(stem)
    if img:
        return (f'<img src="images/{img}" alt="{html.escape(alt)}"'
                f'{"" if eager else " loading=\"lazy\""} decoding="async">')
    return (f'<div class="eb-ph" role="img" aria-label="그림 준비 중">'
            f'<span class="eb-ph-art" aria-hidden="true"></span>'
            f'<span class="eb-ph-t">그림 준비 중</span>'
            f'<span class="eb-ph-n">{html.escape(label)}</span></div>')


def build_html(book, chs):
    spreads, toc = [], []
    n = 0

    # 표지
    spreads.append(f"""<section class="eb-spread eb-spread--cover" id="p0" aria-label="표지">
  <div class="eb-page eb-text eb-titlepage">
    <div class="eb-tp-sub">{inline(book["부제"])}</div>
    <h1 class="eb-tp-title">{html.escape(book["제목"])}</h1>
    <div class="eb-tp-rule" aria-hidden="true"></div>
    <p class="eb-tp-intro">{inline(book["소개"])}</p>
    <button class="eb-open" type="button" data-go="1">책 펼치기 →</button>
  </div>
  <figure class="eb-page eb-pic">{pic_html("cover", book["제목"] + " 표지", "표지", eager=True)}</figure>
</section>""")

    last_part = None
    for c in chs:
        first = n + 1
        part_html = ""
        if c["part"] and c["part"] != last_part:
            part_html = f'<div class="eb-part">{inline(c["part"])}</div>'
            last_part = c["part"]
            toc.append(f'<li class="eb-toc-part">{inline(c["part"])}</li>')
        toc.append(f'<li><a href="#p{first}" data-go="{first}">{html.escape(c["title"])}'
                   f'<span>{first}쪽</span></a></li>')
        for k, pg in enumerate(c["pages"], 1):
            n += 1
            head = ""
            if k == 1:
                head = f'<header class="eb-ch">{part_html}<h2 class="eb-ch-title">{html.escape(c["title"])}</h2></header>'
            body = "\n".join(f"<p>{inline(p)}</p>" for p in pg["paras"])
            stem = f'{c["key"]}-{k:02d}'
            spreads.append(f"""<section class="eb-spread" id="p{n}" aria-label="{n}쪽">
  <div class="eb-page eb-text">
    {head}
    <div class="eb-prose">
{body}
    </div>
    <span class="eb-no">{n}</span>
  </div>
  <figure class="eb-page eb-pic">{pic_html(stem, pg["scene"], f'{c["title"]} · {k}쪽')}</figure>
</section>""")

    total = n
    spreads.append(f"""<section class="eb-spread eb-spread--end" id="p{n + 1}" aria-label="끝">
  <div class="eb-page eb-text eb-endpage">
    <div class="eb-end-mark" aria-hidden="true">🖤</div>
    <p class="eb-end-t">다음 이야기는 준비 중입니다</p>
    <p class="eb-end-s">「{html.escape(book["제목"])}」은 연재 중입니다.</p>
    <button class="eb-open" type="button" data-go="0">← 처음으로</button>
  </div>
  <div class="eb-page eb-pic eb-endpic" aria-hidden="true"><span>to be continued</span></div>
</section>""")

    title = html.escape(book["제목"])
    desc = html.escape(book["소개"])
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:type" content="book">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
{'<meta property="og:image" content="images/' + find_image("cover") + '">' if find_image("cover") else ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&display=swap">
<link rel="stylesheet" href="ebook.css">
</head>
<body>
<!-- 이 파일은 forever/build.py 가 만든다. 고칠 때는 forever/src/ 의 원고를 고친 뒤 다시 빌드한다. -->
<header class="eb-top">
  <a class="eb-brand" href="#p0" data-go="0">{title}</a>
  <span class="eb-count" aria-live="polite"></span>
  <button class="eb-tocbtn" type="button" aria-expanded="false" aria-controls="toc">목차</button>
</header>

<nav class="eb-toc" id="toc" aria-label="목차" hidden>
  <ol>
    <li><a href="#p0" data-go="0">표지<span>·</span></a></li>
{chr(10).join("    " + t for t in toc)}
  </ol>
</nav>

<main class="eb-stage">
  <button class="eb-arrow eb-prev" type="button" aria-label="이전 쪽">‹</button>
  <div class="eb-book" id="book" data-total="{total}">
{chr(10).join(spreads)}
  </div>
  <button class="eb-arrow eb-next" type="button" aria-label="다음 쪽">›</button>
</main>

<div class="eb-progress" aria-hidden="true"><span></span></div>
<script src="ebook.js" defer></script>
</body>
</html>
"""


# ---------------------------------------------------------------------------
# 그림 프롬프트
# ---------------------------------------------------------------------------

def build_prompts(book, chs):
    people = book["등장인물"]
    places = book.get("배경", {})

    def cast(scene):
        return [name for name in people if name in scene]

    setup_lines = [
        f"지금부터 그림책 「{book['제목']}」의 삽화를 한 장씩 그려 줘. 아래 설정을 이 대화 내내 똑같이 지켜 줘.",
        "",
        f"[그림체] {book['그림체']}",
        "",
        f"[공통 조건] {book['그림조건']}",
        "",
        "[등장인물] 매번 같은 얼굴, 같은 옷차림으로 그려 줘.",
    ]
    setup_lines += [f"- {k}: {v}" for k, v in people.items()]
    if places:
        setup_lines += ["", "[자주 나오는 장소]"] + [f"- {k}: {v}" for k, v in places.items()]
    setup_lines += ["", "이해했으면 그림은 그리지 말고 '준비됐어요'라고만 답해 줘. 그다음부터 내가 보내는 장면을 한 장씩 그려 줘."]
    setup = "\n".join(setup_lines)

    rows, todo = [], 0

    def item(title, stem, scene):
        nonlocal todo
        img = find_image(stem)
        if not img:
            todo += 1
        mark = f"✅ `forever/images/{img}`" if img else f"⬜ 저장 이름: `{stem}.webp`"
        who = cast(scene)
        lines = [f"[{title}] {scene}"]
        if who:
            lines.append("등장: " + ", ".join(who) + " (설정대로)")
        lines.append("세로 2:3, 동화책 그림체, 글자 없이.")
        rows.append(f"### {title}\n\n{mark}\n\n```text\n" + "\n".join(lines) + "\n```\n")

    item("표지", "cover", book["표지그림"] + " (표지이므로 제목 글자는 넣지 말고 하늘을 비워 둘 것)")
    n = 0
    for c in chs:
        rows.append(f"## {c['title']}\n")
        for k, pg in enumerate(c["pages"], 1):
            n += 1
            item(f"{c['title']} {k}쪽 (책 {n}쪽)", f"{c['key']}-{k:02d}", pg["scene"])

    doc = f"""# 「{book['제목']}」 그림 프롬프트

이 파일은 `forever/build.py` 가 만든다. 장면을 바꾸려면 원고(`forever/src/NN.md`)의 `그림:` 줄을,
그림체·인물 생김새를 바꾸려면 `forever/src/book.json` 을 고친 뒤 다시 빌드한다.

## 쓰는 법

1. 챗GPT에서 **새 대화**를 열고 아래 「1단계」 상자를 통째로 붙여넣는다. (그림체와 인물을 기억시키는 단계)
2. 「준비됐어요」라는 답이 오면, 「2단계」의 쪽별 상자를 하나씩 붙여넣는다.
3. 마음에 드는 그림을 받으면 Claude에게 주며 "1장 3쪽 그림이야"라고 하면 그 쪽에 붙는다.
4. 대화가 길어져 그림체나 얼굴이 흐트러지면 새 대화를 열고 1단계부터 다시 한다.

남은 그림: **{todo}장** (⬜ 남음 · ✅ 붙음)

## 1단계 — 처음 한 번 붙여넣기

```text
{setup}
```

## 2단계 — 쪽마다 하나씩

"""
    (ROOT / "PROMPTS.md").write_text(doc + "\n".join(rows), encoding="utf-8")
    return todo


def main():
    book = json.loads((SRC / "book.json").read_text(encoding="utf-8"))
    chs = [parse_chapter(p) for p in sorted(SRC.glob("[0-9][0-9].md"))]
    if not chs:
        sys.exit("forever/src/ 에 원고가 없습니다")
    (ROOT / "index.html").write_text(build_html(book, chs), encoding="utf-8")
    todo = build_prompts(book, chs)
    pages = sum(len(c["pages"]) for c in chs)
    print(f"{len(chs)}개 장 {pages}쪽 → forever/index.html (남은 그림 {todo}장, forever/PROMPTS.md)")


if __name__ == "__main__":
    main()
