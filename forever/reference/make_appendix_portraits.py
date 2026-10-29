#!/usr/bin/env python3
"""부록 「주요 인물 소개」의 초상(07-NN.webp)을 완성된 그림에서 잘라 만든다.

    python3 forever/reference/make_appendix_portraits.py

각 항목은 (쪽 번호, 원본 그림, 인물 중심 x, 중심 y, 자를 너비). 높이는 너비의 1.5배(2:3).
"""
from pathlib import Path
from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "images"
PORTRAITS = [
    (1, "cover", 510, 830, 500),    # 민주시민
    (2, "02-01", 390, 680, 700),    # 들너구리
    (3, "04-08", 260, 1010, 600),   # 추모열사
    (4, "01-04", 250, 715, 640),    # 추모합니도
    (5, "01-08", 260, 820, 520),    # 27사 이기자
    (6, "02-05", 860, 865, 560),    # 부이
    (7, "02-04", 760, 850, 560),    # 추모투수
    (8, "04-07", 640, 830, 600),    # 하이민주동덕
    (9, "03-01", 350, 640, 640),    # 추모대장
    (10, "04-03", 280, 900, 700),  # 애국좌수
    (11, "05-03", 395, 790, 600),   # 존푹타
]

for no, src, cx, cy, w in PORTRAITS:
    im = Image.open(IMAGES / f"{src}.webp").convert("RGB")
    h = int(w * 1.5)
    x = min(max(0, cx - w // 2), im.width - w)
    y = min(max(0, cy - h // 2), im.height - h)
    out = im.crop((x, y, x + w, y + h)).resize((1024, 1536), Image.LANCZOS)
    out.save(IMAGES / f"07-{no:02d}.webp", "WEBP", quality=88, method=6)
    print(f"07-{no:02d}.webp ← {src}")
