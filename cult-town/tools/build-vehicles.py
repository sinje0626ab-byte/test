# 움직이는 차 아틀라스 (29장 A): LimeZu Modern Exteriors 의 움직이는 차·버스 시트에서 쓰는 장만 잘라 public/assets/lz/vehicles.{png,json}.
# 배달 오토바이·신호등 불빛은 팩에 없거나 너무 커서 여기서 도트로 직접 그린다.
#   LIMEZU_DIR=... python3 tools/build-vehicles.py
# 원본 시트는 공개 레포에 넣지 않는다 (cult-assets 에만). 결과 아틀라스만 커밋한다.
import json
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'lz')
LZ = os.environ.get('LIMEZU_DIR')
if not LZ:
    sys.exit('LIMEZU_DIR 를 정해 주세요 (exteriors16/ 가 있는 폴더)')
VEH = os.path.join(LZ, 'exteriors16', 'Animated_16x16', 'Vehicles_16x16')
ANIM = os.path.join(LZ, 'exteriors16', 'Animated_16x16', 'Animated_sheets_16x16')
DIRS = ['right', 'up', 'left', 'down']          # 시트 안 순서: 방향마다 6장

frames = {}
items = []                                      # (이름, 그림)


def trim_group(ims):
    # 한 방향 6장을 같은 상자로 자른다 (장마다 흔들리지 않게)
    box = None
    for im in ims:
        b = im.getbbox()
        if not b:
            continue
        box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    return [im.crop(box) for im in ims]


# 승용차: Car_4 · Car_5 시트 (가로 24장 × 80px, 아래 절반이 달리는 장)
CARS = [('Car_4_16x16_%d.png' % i) for i in (1, 2, 3, 5)] + [('Car_5_16x16_%d.png' % i) for i in (1, 2, 4, 6)]
for ci, name in enumerate(CARS):
    sh = Image.open(os.path.join(VEH, 'Cars_16x16', name)).convert('RGBA')
    cw = sh.width // 24
    top = sh.height // 2
    for di, d in enumerate(DIRS):
        ims = [sh.crop(((di * 6 + k) * cw, top, (di * 6 + k + 1) * cw, sh.height)) for k in range(6)]
        for k, im in enumerate(trim_group(ims)):
            items.append((f'car{ci}-{d}-{k}', im))

# 버스: Buses_1 둘째 줄 (오른쪽 6 · 위 6 · 왼쪽 6 · 아래 6, 칸 위치가 고르지 않아 잘라 놓은 x 를 쓴다) · 셋째 줄은 문 여닫이
bus = Image.open(os.path.join(VEH, 'Buses_16x16', 'Buses_1.png')).convert('RGBA')
BUS_R = [16, 157, 293, 447, 588, 735]
BUS_L = [1137, 1281, 1425, 1569, 1713, 1857]
for d, xs in (('right', BUS_R), ('left', BUS_L)):
    ims = [bus.crop((x, 105, x + 118, 180)) for x in xs]
    for k, im in enumerate(trim_group(ims)):
        items.append((f'bus-{d}-{k}', im))
DOOR = [bus.crop((17 + 112 * k, 220, 17 + 112 * k + 112, 292)) for k in range(10)]
for k, im in enumerate(trim_group(DOOR)):
    items.append((f'bus-door-{k}', im))

# 정류장: 표지판 (ME_Singles_Vehicles Bus_Stop_Sign_1)
SINGLES = os.path.join(LZ, 'exteriors16', 'ME_Theme_Sorter_16x16', '10_Vehicles_Singles_16x16')
items.append(('busSign', Image.open(os.path.join(SINGLES, 'ME_Singles_Vehicles_16x16_Bus_Stop_Sign_1.png')).convert('RGBA')))

# 신호등: Stoplight 시트 (11x27 × 9장: 빨강 · 노랑 · 초록 각 3장, 가운데 장이 켜진 것)
sl = Image.open(os.path.join(ANIM, 'Stoplight_16x16.png')).convert('RGBA')
for name, k in (('light-red', 1), ('light-yellow', 4), ('light-green', 7)):
    items.append((name, sl.crop((k * 11, 0, k * 11 + 11, 27))))

# 배달 오토바이 (직접 그린 도트, 오른쪽을 본다 · 바퀴 두 장). 왼쪽은 좌우 뒤집기
PAL = {'.': None, 'k': (29, 27, 38), 'r': (200, 58, 50), 'R': (150, 40, 38), 'w': (240, 236, 220), 'g': (90, 96, 110),
       'G': (140, 146, 160), 'y': (240, 192, 64), 's': (232, 190, 150), 'b': (60, 80, 140), 'B': (40, 54, 100), 'o': (255, 236, 160)}
BIKE = [
    '.......kkkk.........',
    '......kbbbbk........',
    '......kbBBbk........',
    '.......kkkk.........',
    '.kkkkk.kss..........',
    'kwwwwwkkbbk.........',
    'krrrrrkbbbbk........',
    'kr y rkbbbbsk.......',
    'krrrrrkkbbk.sk..kk..',
    '.kkkkkk.bbk..kkkGk..',
    '...kGGGGGGGGGGGGGok.',
    '..kgGGGkkkkkkGGGGk..',
    '.kkkk.........kkkk..',
    'kgggk........kgggk..',
    'kgkgk........kgkgk..',
    '.kkk..........kkk...',
]
BIKE2 = BIKE[:12] + [
    '.kkkk.........kkkk..',
    'kgkgk........kgkgk..',
    'kgggk........kgggk..',
    '.kkk..........kkk...',
]


def draw(rows):
    im = Image.new('RGBA', (len(rows[0]), len(rows)))
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            c = PAL.get(ch)
            if c:
                im.putpixel((x, y), c + (255,))
    return im


for k, rows in enumerate((BIKE, BIKE2)):
    im = draw(rows)
    items.append((f'bike-right-{k}', im))
    items.append((f'bike-left-{k}', im.transpose(Image.FLIP_LEFT_RIGHT)))

# 선반 쌓기
W = 1024
x = y = shelf = 0
placed = []
for name, im in items:
    if x + im.width > W:
        x, y, shelf = 0, y + shelf + 1, 0
    placed.append((name, im, x, y))
    x += im.width + 1
    shelf = max(shelf, im.height)
H = y + shelf
img = Image.new('RGBA', (W, H))
for name, im, px, py in placed:
    img.alpha_composite(im, (px, py))
    frames[name] = {'frame': {'x': px, 'y': py, 'w': im.width, 'h': im.height}}
img.save(os.path.join(OUT, 'vehicles.png'), optimize=True)
with open(os.path.join(OUT, 'vehicles.json'), 'w') as f:
    json.dump({'frames': frames, 'cars': len(CARS), 'meta': {'image': 'vehicles.png', 'size': {'w': W, 'h': H}, 'scale': '1'}}, f, separators=(',', ':'))
print(f'vehicles: {len(items)}장 · {W}x{H}')
