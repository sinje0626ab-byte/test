#!/usr/bin/env python3
"""
추모공화국 카드 게임 — 이미지 압축 스크립트

img/raw/ 에 넣은 원본(png/jpg/jpeg/webp)을
  1) 4:5 비율로 자르고 (얼굴이 잘리지 않게 위쪽을 조금 더 남김)
  2) 최대 960x1200으로 줄이고
  3) 장당 200KB 이하 webp로 압축해서
게임 폴더에 내보낸다.

  img/raw/cards/xxx.png      -> img/cards/xxx.webp
  img/raw/portraits/xxx.png  -> img/portraits/xxx.webp
  img/raw/endings/xxx.png    -> img/endings/xxx.webp
  img/raw/xxx.png (바로 아래) -> img/cards/xxx.webp

실행 (chumo-game 폴더에서):
  python3 scripts/optimize-images.py            # 새로 넣거나 바뀐 원본만 처리
  python3 scripts/optimize-images.py --force    # 전부 다시 처리

필요한 것: Python 3.8 이상, Pillow (pip install pillow)
"""

import argparse
import io
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow가 없습니다. 먼저 이렇게 설치하세요:  pip install pillow")

ROOT = Path(__file__).resolve().parent.parent  # chumo-game/
RAW = ROOT / "img" / "raw"
TARGETS = {"cards": "cards", "portraits": "portraits", "endings": "endings"}
EXTS = {".png", ".jpg", ".jpeg", ".webp"}

RATIO = 4 / 5            # 가로:세로
MAX_W, MAX_H = 960, 1200
MAX_BYTES = 200 * 1024
TOP_BIAS = 0.35          # 세로가 남을 때 위에서 자르는 몫 (0.5면 가운데)
BG = (244, 240, 229)     # 투명한 부분을 채울 종이색


def crop_4x5(im):
    w, h = im.size
    if w / h > RATIO:  # 가로가 넓다 → 양옆을 자른다
        new_w = round(h * RATIO)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = round(w / RATIO)  # 세로가 길다 → 위아래를 자른다
    top = round((h - new_h) * TOP_BIAS)
    return im.crop((0, top, w, top + new_h))


def encode(im):
    """200KB 이하가 될 때까지 품질을 낮추고, 그래도 크면 크기를 줄인다."""
    while True:
        for q in range(86, 34, -6):
            buf = io.BytesIO()
            im.save(buf, "WEBP", quality=q, method=6)
            if buf.tell() <= MAX_BYTES:
                return buf.getvalue(), q, im.size
        im = im.resize((round(im.width * 0.85), round(im.height * 0.85)), Image.LANCZOS)


def process(src, dst):
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, BG)
            bg.paste(im, mask=im.getchannel("A"))
            im = bg
        else:
            im = im.convert("RGB")
        im = crop_4x5(im)
        if im.width > MAX_W:
            im = im.resize((MAX_W, MAX_H), Image.LANCZOS)
        data, q, size = encode(im)
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(data)
    return len(data), q, size


def jobs():
    for path in sorted(RAW.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in EXTS:
            continue
        rel = path.relative_to(RAW)
        folder = TARGETS.get(rel.parts[0], "cards") if len(rel.parts) > 1 else "cards"
        yield path, ROOT / "img" / folder / (path.stem + ".webp")


def main():
    ap = argparse.ArgumentParser(description="img/raw/ 원본을 4:5 webp(200KB 이하)로 변환")
    ap.add_argument("--force", action="store_true", help="이미 변환된 것도 다시 변환")
    args = ap.parse_args()

    if not RAW.exists():
        sys.exit(f"원본 폴더가 없습니다: {RAW}")

    done = skipped = failed = 0
    for src, dst in jobs():
        name = f"{src.relative_to(ROOT)} -> {dst.relative_to(ROOT)}"
        if not args.force and dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            skipped += 1
            continue
        try:
            size, q, (w, h) = process(src, dst)
            print(f"  완료  {name}  ({w}x{h}, {(size + 1023) // 1024}KB, 품질 {q})")
            done += 1
        except Exception as e:  # 한 장이 깨져도 나머지는 계속
            print(f"  실패  {name}  — {e}")
            failed += 1

    print(f"\n변환 {done}장 · 건너뜀(변경 없음) {skipped}장 · 실패 {failed}장")
    if done == 0 and skipped == 0:
        print("img/raw/cards/ 또는 img/raw/portraits/ 에 png/jpg 원본을 넣고 다시 실행하세요.")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
