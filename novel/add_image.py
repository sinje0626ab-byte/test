#!/usr/bin/env python3
"""챗GPT 등에서 받은 그림을 소설 쪽에 붙인다.

    python3 novel/add_image.py 받은그림.png 3 2      # 제3장 2쪽
    python3 novel/add_image.py 받은그림.png cover    # 표지

세로 2:3(1024×1536)에 맞춰 가운데를 잘라 webp 로 바꾼 뒤 novel/images/ 에 넣고,
같은 쪽의 옛 그림(png·jpg)은 지운다. 끝나면 build.py 를 다시 돌린다.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
W, H = 1024, 1536


def main():
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    stem = "cover" if sys.argv[2] == "cover" else f"{int(sys.argv[2]):02d}-{int(sys.argv[3]):02d}"

    im = Image.open(src).convert("RGB")
    # 2:3 에 맞게 가운데를 자른다
    if im.width * 3 > im.height * 2:
        nw = im.height * 2 // 3
        x = (im.width - nw) // 2
        im = im.crop((x, 0, x + nw, im.height))
    elif im.width * 3 < im.height * 2:
        nh = im.width * 3 // 2
        y = (im.height - nh) // 2
        im = im.crop((0, y, im.width, y + nh))
    im = im.resize((W, H), Image.LANCZOS)

    out_dir = ROOT / "images"
    out_dir.mkdir(exist_ok=True)
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        (out_dir / (stem + ext)).unlink(missing_ok=True)
    out = out_dir / f"{stem}.webp"
    im.save(out, "WEBP", quality=84, method=6)
    print(f"{out.relative_to(ROOT.parent)} ({out.stat().st_size // 1024} KB)")

    subprocess.run([sys.executable, str(ROOT / "build.py")], check=True)


if __name__ == "__main__":
    main()
