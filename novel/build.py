#!/usr/bin/env python3
"""추모공화국 연재소설 빌더.

novel/src/ 의 원고(NN.md)와 작품 정보(meta.json)를 읽어
  novel/index.html      — 표지와 목차
  novel/NN/index.html   — 각 장
을 만든다. 표준 라이브러리만 쓴다.

    python3 novel/build.py

원고 형식은 novel/WRITING.md 에 있다.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent          # novel/
SITE = ROOT.parent                               # 저장소 루트
SRC = ROOT / "src"


# ---------------------------------------------------------------------------
# 원고 읽기
# ---------------------------------------------------------------------------

def parse_front(text, path):
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        sys.exit(f"{path}: 맨 위에 --- 로 감싼 머리말이 없습니다")
    meta = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    for key in ("번호", "부", "부제목", "제목", "시기", "시점", "요약"):
        if key not in meta:
            sys.exit(f"{path}: 머리말에 '{key}' 항목이 없습니다")
    meta["번호"] = int(meta["번호"])
    meta["부"] = int(meta["부"])
    return meta, text[m.end():]


def parse_chapter(path):
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    meta, body = parse_front(text, path)

    afterword = ""
    if "\n=== 작가의 말\n" in "\n" + body:
        body, afterword = ("\n" + body).split("\n=== 작가의 말\n", 1)

    notes = {}
    lines = []
    for line in body.split("\n"):
        m = re.match(r"\[\^(\d+)\]:\s*(.+)$", line)
        if m:
            parts = [p.strip() for p in m.group(2).split("|")]
            when = parts[0]
            what = parts[1] if len(parts) > 1 else ""
            anchor = parts[2] if len(parts) > 2 else ""
            notes[int(m.group(1))] = (when, what, anchor)
        else:
            lines.append(line)

    used = [int(n) for n in re.findall(r"\[\^(\d+)\]", "\n".join(lines))]
    for n in used:
        if n not in notes:
            sys.exit(f"{path}: 본문의 [^{n}] 에 해당하는 실록 각주가 없습니다")

    meta["blocks"] = split_blocks("\n".join(lines))
    meta["notes"] = notes
    meta["note_order"] = list(dict.fromkeys(used))
    meta["afterword"] = split_blocks(afterword)
    meta["slug"] = f"{meta['번호']:02d}"
    return meta


def split_blocks(text):
    """빈 줄로 문단을 나눈다. '* * *' 은 장면 전환, '>' 로 시작하는 줄은 대화방 인용."""
    blocks = []
    for chunk in re.split(r"\n\s*\n", text.strip()):
        chunk = chunk.strip()
        if not chunk:
            continue
        if re.fullmatch(r"(\*\s*){3}", chunk):
            blocks.append(("break", None))
        elif all(l.startswith(">") for l in chunk.splitlines()):
            rows = []
            for l in chunk.splitlines():
                l = l[1:].strip()
                who, sep, said = l.partition(":")
                rows.append((who.strip(), said.strip()) if sep else ("", l))
            blocks.append(("chat", rows))
        else:
            blocks.append(("p", " ".join(l.strip() for l in chunk.splitlines())))
    return blocks


# ---------------------------------------------------------------------------
# 렌더링
# ---------------------------------------------------------------------------

def inline(s, note_index=None):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<em>\1</em>", s)
    if note_index is not None:
        def ref(m):
            n = int(m.group(1))
            i = note_index[n]
            return (f'<a class="sil-ref" href="#sil-{i}" id="ref-{i}" data-n="{i}" '
                    f'aria-label="실록 {i}">{i}</a>')
        s = re.sub(r"\[\^(\d+)\]", ref, s)
    return s


def render_blocks(blocks, note_index=None):
    out = []
    for kind, val in blocks:
        if kind == "break":
            out.append('<p class="nv-break" aria-hidden="true">🕯</p>')
        elif kind == "chat":
            rows = []
            for who, said in val:
                w = f'<span class="nv-who">{inline(who)}</span>' if who else ""
                rows.append(f'<div class="nv-line">{w}<span class="nv-said">{inline(said, note_index)}</span></div>')
            out.append('<div class="nv-chat">' + "".join(rows) + "</div>")
        else:
            out.append(f"<p>{inline(val, note_index)}</p>")
    return "\n".join(out)


def gnb(prefix):
    """역사 페이지의 상단 메뉴를 가져와 경로만 바꾼다. 메뉴가 바뀌어도 다시 빌드하면 따라간다."""
    src = (SITE / "history" / "index.html").read_text(encoding="utf-8")
    m = re.search(r'<header class="gnb noprint">.*?</header>', src, re.S)
    block = m.group(0)
    return block.replace('href="../', f'href="{prefix}').replace('src="../', f'src="{prefix}').replace('action="../', f'action="{prefix}')


def page(title, desc, prefix, body, extra_head=""):
    t = html.escape(title)
    d = html.escape(desc)
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t}</title>
<meta name="description" content="{d}">
<meta property="og:type" content="article">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<link rel="icon" type="image/png" href="{prefix}assets/brand/favicon-flag.png">
<link rel="stylesheet" href="{prefix}assets/common.css">
<link rel="stylesheet" href="{prefix}novel/novel.css">
{extra_head}</head>
<body>
<!-- 이 파일은 novel/build.py 가 만든다. 고칠 때는 novel/src/ 의 원고를 고친 뒤 다시 빌드한다. -->
{gnb(prefix)}

{body}

<script src="{prefix}assets/nav.js" defer></script>
<script src="{prefix}novel/novel.js" defer></script>
</body>
</html>
"""


def footer():
    return """<footer class="footer">
  대한추모협회 공식 인증 · 추모공화국 문화추모부 연재<br>
  이 소설은 추모공화국의 실제 기록에 허구를 더한 작품이다. 🕯 표시가 붙은 대목은 실록이다.
  <div class="fmotto">오직 추모</div>
</footer>"""


def build_chapter(ch, prev, nxt, meta):
    note_index = {n: i + 1 for i, n in enumerate(ch["note_order"])}

    notes_html = ""
    if ch["note_order"]:
        items = []
        for n in ch["note_order"]:
            i = note_index[n]
            when, what, anchor = ch["notes"][n]
            link = (f' <a class="sil-go" href="../../history/#{html.escape(anchor)}">역사 기록 →</a>'
                    if anchor else "")
            items.append(f'<li id="sil-{i}"><a class="sil-back" href="#ref-{i}" aria-label="본문으로">{i}</a>'
                         f'<span class="sil-when">{inline(when)}</span>'
                         f'<span class="sil-what">{inline(what)}</span>{link}</li>')
        notes_html = (f'<section class="nv-notes" aria-labelledby="h-sil">\n'
                      f'<h2 id="h-sil">이 장의 실록</h2>\n'
                      f'<p class="nv-notes-lead">본문의 🕯 번호가 가리키는 실제 기록이다. 이 목록 밖의 장면과 대사, 속마음은 지어낸 것이다.</p>\n'
                      f'<ol class="sil-list">\n' + "\n".join(items) + "\n</ol>\n</section>")

    after_html = ""
    if ch["afterword"]:
        after_html = ('<section class="nv-after" aria-label="작가의 말">\n<div class="ptitle">작 가 의 말</div>\n'
                      + render_blocks(ch["afterword"]) + "\n</section>")

    def navcard(c, label, cls):
        if not c:
            return f'<span class="nv-nav-card nv-nav-card--empty {cls}"></span>'
        return (f'<a class="nv-nav-card {cls}" href="../{c["slug"]}/">'
                f'<span class="nv-nav-dir">{label}</span>'
                f'<span class="nv-nav-title">제{c["번호"]}장 {html.escape(c["제목"])}</span></a>')

    next_card = navcard(nxt, "다음 장 →", "nv-nav-next") if nxt else (
        '<span class="nv-nav-card nv-nav-card--empty nv-nav-next">'
        '<span class="nv-nav-dir">연재 중</span>'
        '<span class="nv-nav-title">다음 장은 아직 쓰이지 않았다</span></span>')

    body = f"""<main class="paper nv-paper">
<div class="watermark" aria-hidden="true"><img class="watermark-img" src="../../assets/brand/flag.webp" alt=""><span class="watermark-fallback">📕</span></div>

<header class="nv-head">
  <a class="nv-series" href="../">{html.escape(meta["제목"])}</a>
  <div class="nv-part">제{ch["부"]}부 · {html.escape(ch["부제목"])}</div>
  <div class="nv-no">제 {ch["번호"]} 장</div>
  <h1 class="nv-title">{html.escape(ch["제목"])}</h1>
  <div class="nv-meta">{html.escape(ch["시기"])} <span aria-hidden="true">·</span> 시점 {html.escape(ch["시점"])}</div>
  <button class="nv-toggle noprint" type="button" aria-pressed="true">🕯 실록 표시 켜짐</button>
</header>

<article class="nv-body">
{render_blocks(ch["blocks"], note_index)}
</article>

{notes_html}

{after_html}

<nav class="nv-nav noprint" aria-label="장 이동">
  {navcard(prev, "← 이전 장", "nv-nav-prev")}
  <a class="nv-nav-toc" href="../">목차</a>
  {next_card}
</nav>

{footer()}
</main>"""
    title = f"제{ch['번호']}장 {ch['제목']} · {meta['제목']}"
    return page(title, ch["요약"], "../../", body)


def build_index(chs, meta):
    parts = {}
    for c in chs:
        parts.setdefault(c["부"], {"제목": c["부제목"], "장": []})["장"].append(c)

    toc = []
    for no in sorted(parts):
        p = parts[no]
        first, last = p["장"][0], p["장"][-1]
        rows = []
        for c in p["장"]:
            rows.append(f"""<li><a class="toc-ch" href="{c['slug']}/">
  <span class="toc-no">{c['번호']}</span>
  <span class="toc-main"><span class="toc-title">{html.escape(c['제목'])}</span>
  <span class="toc-when">{html.escape(c['시기'])} · 시점 {html.escape(c['시점'])}</span>
  <span class="toc-sum">{html.escape(c['요약'])}</span></span>
</a></li>""")
        toc.append(f"""<section class="toc-part" aria-labelledby="part-{no}">
<h2 id="part-{no}">제{no}부 · {html.escape(p['제목'])}</h2>
<ol class="toc-list">
{chr(10).join(rows)}
</ol>
</section>""")

    intro = "\n".join(f"<p>{inline(x)}</p>" for x in meta["소개"])
    latest = chs[-1]
    body = f"""<main class="paper nv-paper">
<div class="watermark" aria-hidden="true"><img class="watermark-img" src="../assets/brand/flag.webp" alt=""><span class="watermark-fallback">📕</span></div>

<header class="cover cover--page">
  <figure class="natflag">
    <img class="natflag-img" src="../assets/brand/flag.webp" alt="추모공화국 국기">
    <span class="natflag-fallback" aria-hidden="true">📕</span>
  </figure>
  <div class="org">추 모 공 화 국 연 재 소 설</div>
  <h1>{" ".join(meta["제목"])}</h1>
  <div class="sub">{html.escape(meta["영문"])}</div>
</header>

<section class="preamble" aria-label="작품 소개">
  <div class="ptitle">작 품 소 개</div>
  {intro}
</section>

<section class="nv-howto" aria-labelledby="h-howto">
  <h2 id="h-howto">읽 는 법</h2>
  <p>본문 곳곳에 붙은 <a class="sil-ref sil-ref--demo" aria-hidden="true">1</a> 표시는 <b>실록</b>이다. 누르면 그 대목이 기대고 있는 실제 날짜와 기록이 뜨고, 장 끝의 「이 장의 실록」과 <a href="../history/">국가 역사</a>로 이어진다. 표시가 없는 장면과 대사, 인물의 속마음은 지어낸 것이다.</p>
  <p>실제 참사와 실제 고인의 별세는 이 나라의 원칙대로 <b>지어내지 않는다.</b> 그날 방이 어떻게 그 이름을 걸었는지만 적는다.</p>
  <p class="nv-status">현재 <b>{len(chs)}장</b>까지 연재 · 최근 장은 <a href="{latest['slug']}/">제{latest['번호']}장 「{html.escape(latest['제목'])}」</a> ({html.escape(latest['시기'])})</p>
  <p class="nv-start noprint"><a class="nv-start-btn" href="{chs[0]['slug']}/">제1장부터 읽기 →</a></p>
</section>

{chr(10).join(toc)}

{footer()}
</main>"""
    return page(f"{meta['제목']} · 추모공화국 연재소설", meta["한줄"], "../", body)


def main():
    meta = json.loads((SRC / "meta.json").read_text(encoding="utf-8"))
    chs = sorted((parse_chapter(p) for p in SRC.glob("[0-9][0-9].md")), key=lambda c: c["번호"])
    if not chs:
        sys.exit("novel/src/ 에 원고가 없습니다")
    for i, c in enumerate(chs):
        if c["번호"] != i + 1:
            sys.exit(f"장 번호가 비어 있습니다: {i + 1}장이 있어야 할 자리에 {c['번호']}장")

    for i, c in enumerate(chs):
        prev = chs[i - 1] if i > 0 else None
        nxt = chs[i + 1] if i + 1 < len(chs) else None
        out = ROOT / c["slug"] / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(build_chapter(c, prev, nxt, meta), encoding="utf-8")
    (ROOT / "index.html").write_text(build_index(chs, meta), encoding="utf-8")
    print(f"{len(chs)}개 장을 만들었습니다 → novel/")


if __name__ == "__main__":
    main()
