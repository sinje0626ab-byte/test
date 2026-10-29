#!/usr/bin/env python3
"""챗GPT에서 받은 그림을 전자책의 쪽에 붙인다.

    python3 forever/add_image.py 받은그림.png 1 3     # 1장 3쪽 (프롤로그는 0)
    python3 forever/add_image.py 받은그림.png cover   # 표지
    python3 forever/add_image.py 받은그림.png 8 1 --fit  # 가로 그림을 자르지 않고 통째로 넣기

세로 2:3(1024×1536)에 맞춰 가운데를 잘라 webp 로 바꾼 뒤
(--fit 이면 자르지 않고 그림 전체를 가운데에 두고, 위아래는 같은 그림을 흐리게 키워 채운 뒤) forever/images/ 에 넣고,
같은 자리의 옛 그림은 지운 다음 다시 빌드한다.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
W, H = 1024, 1536


def fit(im):
    """그림 전체를 살리고, 남는 위아래(또는 좌우)는 같은 그림을 흐리게 키워 채운다."""
    from PIL import ImageFilter, ImageEnhance
    s = max(W / im.width, H / im.height)
    bg = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (bg.width - W) // 2, (bg.height - H) // 2
    bg = bg.crop((x, y, x + W, y + H)).filter(ImageFilter.GaussianBlur(28))
    bg = ImageEnhance.Brightness(bg).enhance(0.8)
    s = min(W / im.width, H / im.height)
    fg = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    bg.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
    return bg


def main():
    use_fit = "--fit" in sys.argv
    if use_fit:
        sys.argv.remove("--fit")
    if len(sys.argv) not in (3, 4) or (sys.argv[2] != "cover" and len(sys.argv) != 4):
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    stem = "cover" if sys.argv[2] == "cover" else f"{int(sys.argv[2]):02d}-{int(sys.argv[3]):02d}"

    im = Image.open(src).convert("RGB")
    if use_fit:
        im = fit(im)
    elif im.width * 3 > im.height * 2:        # 너무 넓으면 좌우를 자른다
        nw = im.height * 2 // 3
        x = (im.width - nw) // 2
        im = im.crop((x, 0, x + nw, im.height))
    elif im.width * 3 < im.height * 2:      # 너무 길면 위아래를 자른다
        nh = im.width * 3 // 2
        y = (im.height - nh) // 2
        im = im.crop((0, y, im.width, y + nh))
    im = im.resize((W, H), Image.LANCZOS)

    out_dir = ROOT / "images"
    out_dir.mkdir(exist_ok=True)
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        (out_dir / (stem + ext)).unlink(missing_ok=True)
    out = out_dir / f"{stem}.webp"
    im.save(out, "WEBP", quality=86, method=6)
    print(f"{out.relative_to(ROOT.parent)} ({out.stat().st_size // 1024} KB)")

    subprocess.run([sys.executable, str(ROOT / "build.py")], check=True)


if __name__ == "__main__":
    main()
