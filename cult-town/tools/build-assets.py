#!/usr/bin/env python3
# LimeZu 원본(비공개 레포 cult-assets)에서 게임에 쓰는 조각만 잘라 public/assets/lz/ 에 아틀라스로 쓴다 (26장).
# 원본 시트·zip 은 공개 레포에 넣지 않는다. 결과 아틀라스만 커밋한다.
#
#   LIMEZU_DIR=/경로 python3 tools/build-assets.py [people|town|indoor|all]
#   LIMEZU_DIR 아래: exteriors16/ (limezu16.zip 의 것) · moderninteriors-win/ (분할 zip 을 합쳐 푼 것)
#
# people: 사람마다 한 줄. 16x32 칸 72장 = 대기 24 · 걷기 24 (오른쪽·위·왼쪽·아래 6장씩) · 앉기 12 (오른쪽 6 · 왼쪽 6) · 폰 12 (아래).
#         추운 달 people-cold.png · 더운 달 people-warm.png (줄 순서는 같다) + people.json {rows}.
import json, os, subprocess, sys, glob, hashlib
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'lz')
LZ = os.environ.get('LIMEZU_DIR')
if not LZ:
    sys.exit('LIMEZU_DIR 를 정해 주세요 (exteriors16/ 와 moderninteriors-win/ 가 있는 폴더)')
MI = os.path.join(LZ, 'moderninteriors-win')
EX = os.path.join(LZ, 'exteriors16')
GEN = os.path.join(MI, '2_Characters', 'Character_Generator')
ADDON = os.path.join(EX, 'Character_Generator_Addons_16x16', 'Characters_16x16')

FW, FH = 16, 32
# (원본 줄, 원본 시작 칸, 장수) → 결과 줄 안에서 차례로
SEGMENTS = [(1, 0, 24), (2, 0, 24), (4, 0, 12), (6, 0, 12)]
COLS = sum(n for _, _, n in SEGMENTS)


def sheet(path):
    return Image.open(path).convert('RGBA')


_cache = {}
def load(path):
    if path not in _cache:
        _cache[path] = sheet(path)
    return _cache[path]


def one(pattern):
    fs = sorted(glob.glob(pattern))
    if not fs:
        sys.exit(f'없는 부위: {pattern}')
    return fs[0]


def layers(look, season):
    if 'addon' in look:
        name, n = look['addon'].rsplit('_', 1)
        return [one(os.path.join(ADDON, f'Modern_Exteriors_Characters_{name}_16x16_{n}.png'))]
    out = [os.path.join(GEN, 'Bodies', '16x16', 'Body_%02d.png' % look['body']),
           os.path.join(GEN, 'Eyes', '16x16', 'Eyes_%02d.png' % look['eyes'])]
    outfit = look['outfit'][0 if season == 'cold' else 1]
    out.append(os.path.join(GEN, 'Outfits', '16x16', f'Outfit_{outfit}.png'))
    if look.get('hair'):
        out.append(os.path.join(GEN, 'Hairstyles', '16x16', f"Hairstyle_{look['hair']}.png"))
    if look.get('acc'):
        n, c = look['acc'].split('_')
        out.append(one(os.path.join(GEN, 'Accessories', '16x16', f'Accessory_{n}_*_{c}.png')))
    return out


def phone_for(key):
    n = int(hashlib.md5(key.encode()).hexdigest(), 16) % 5 + 1
    return os.path.join(GEN, 'Smartphones', '16x16', f'Smartphone_{n}.png')


def compose(key, look, season):
    row = Image.new('RGBA', (COLS * FW, FH))
    srcs = [load(p) for p in layers(look, season)] + [load(phone_for(key))]
    x = 0
    for r, c0, n in SEGMENTS:
        for i in range(n):
            box = ((c0 + i) * FW, r * FH, (c0 + i + 1) * FW, (r + 1) * FH)
            cell = Image.new('RGBA', (FW, FH))
            for s in srcs:
                cell.alpha_composite(s.crop(box))
            row.alpha_composite(cell, (x, 0))
            x += FW
    return row


def build_people():
    looks = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'dump-looks.mjs')], cwd=ROOT))
    keys = list(looks.keys())
    # 같은 외형 검사 (추운 달 조합 기준, 더운 달도)
    for si, name in ((0, '추운 달'), (1, '더운 달')):
        seen = {}
        for k in keys:
            lk = looks[k]
            sig = json.dumps(lk, sort_keys=True) if 'addon' in lk else json.dumps([lk['body'], lk['hair'], lk['outfit'][si], lk.get('acc')])
            if sig in seen:
                sys.exit(f'{name} 외형이 같다: {seen[sig]} · {k}')
            seen[sig] = k
    os.makedirs(OUT, exist_ok=True)
    for season in ('cold', 'warm'):
        img = Image.new('RGBA', (COLS * FW, len(keys) * FH))
        for i, k in enumerate(keys):
            img.alpha_composite(compose(k, looks[k], season), (0, i * FH))
        img.save(os.path.join(OUT, f'people-{season}.png'), optimize=True)
    meta = {'frameWidth': FW, 'frameHeight': FH, 'cols': COLS,
            'anims': {'idle': 0, 'walk': 24, 'sit': 48, 'phone': 60}, 'dirs': ['right', 'up', 'left', 'down'],
            'rows': {k: i for i, k in enumerate(keys)}}
    with open(os.path.join(OUT, 'people.json'), 'w') as f:
        json.dump(meta, f, ensure_ascii=False, separators=(',', ':'))
    print(f'people: {len(keys)}명 · {COLS}칸 · 계절 2벌')


# ── 아틀라스 공통: 16x16 타일을 앞줄에, 그 뒤로 물건을 16 격자에 맞춰 선반식으로. Phaser atlas(hash) JSON + 'tiles' {이름: 타일 번호} ──
ATLAS_W = 256


def pack(tiles, objects, name):
    cols = ATLAS_W // 16
    rows_t = (len(tiles) + cols - 1) // cols
    placed = []
    x, y, shelf = 0, rows_t * 16, 0
    for oname, im in objects:
        w, h = (im.width + 15) // 16 * 16, (im.height + 15) // 16 * 16
        if x + w > ATLAS_W:
            x, y, shelf = 0, y + shelf, 0
        placed.append((oname, im, x, y + (h - im.height)))
        x += w; shelf = max(shelf, h)
    H = y + shelf
    img = Image.new('RGBA', (ATLAS_W, H))
    frames, tile_idx = {}, {}
    for i, (tname, im) in enumerate(tiles):
        tx, ty = (i % cols) * 16, (i // cols) * 16
        img.alpha_composite(im, (tx, ty))
        tile_idx[tname] = i
        frames[tname] = {'frame': {'x': tx, 'y': ty, 'w': 16, 'h': 16}}
    for oname, im, ox, oy in placed:
        img.alpha_composite(im, (ox, oy))
        frames[oname] = {'frame': {'x': ox, 'y': oy, 'w': im.width, 'h': im.height}}
    img.save(os.path.join(OUT, f'{name}.png'), optimize=True)
    with open(os.path.join(OUT, f'{name}.json'), 'w') as f:
        json.dump({'frames': frames, 'tiles': tile_idx, 'columns': cols,
                   'meta': {'image': f'{name}.png', 'size': {'w': ATLAS_W, 'h': H}, 'scale': '1'}}, f, ensure_ascii=False, separators=(',', ':'))
    print(f'{name}: 타일 {len(tiles)} · 물건 {len(objects)} · {ATLAS_W}x{H}')


# ── 실내 (Modern Interiors) ──
IN16 = os.path.join(MI, '1_Interiors', '16x16')
SINGLES = os.path.join(IN16, 'Theme_Sorter_Singles')
SINGLE_DIR = {'conf': ('13_Conference_Hall_Singles', 'Conference_Hall_Singles'), 'jp': ('20_Japanese_Interiors_Singles', 'Japanese_Interiors_Singles'),
              'class': ('5_Classroom_and_Library_Singles', 'Classroom_and_Library_Singles'), 'living': ('2_Living_Room_Singles', 'Living_Room_Singles'),
              'kitchen': ('12_Kitchen_Singles', 'Kitchen_Singles'), 'tv': ('23_Television_and_Film_Studio_SIngles', 'Television_and_FIlm_Studio_Singles'),
              'music': ('6_Music_and_Sport', 'Music_and_Sport_Singles')}
# 꾸밈 단계 0 초라한 상가 방 → 3 꾸민 예배실: (바닥 칸) · (벽 위·아래 칸) — Room_Builder 타일 좌표
INDOOR_TILES = {
    'floor0': (46, 25), 'floor1': (34, 17), 'floor2': (39, 21), 'floor3': (34, 37),
    'wall0a': (1, 41), 'wall0b': (1, 42), 'wall1a': (1, 17), 'wall1b': (1, 18),
    'wall2a': (1, 33), 'wall2b': (1, 34), 'wall3a': (1, 37), 'wall3b': (1, 38),
    'border': (12, 0), 'stairs': (51, 23),
}
# 물건: 이름 → (묶음, 번호). 성소 소품 id(chair·cushion·board·speaker·light·plant·kettle)는 그대로 쓴다
INDOOR_OBJECTS = {
    'chair': ('conf', 37), 'chair2': ('conf', 39), 'cushion': ('jp', 44), 'zaisu': ('jp', 69),
    'pulpit0': ('conf', 45), 'pulpit': ('conf', 46), 'desk': ('conf', 26), 'deskpc': ('conf', 29),
    'counsel0': ('living', 92), 'counsel': ('tv', 28), 'table': ('living', 2),
    'board': ('class', 39), 'speaker': ('music', 43), 'light': ('living', 87), 'plant': ('living', 17), 'kettle': ('kitchen', 183),
    'bannerRed': ('conf', 60), 'bannerBlue': ('conf', 63),
    'shelf': ('class', 43), 'studydesk': ('class', 5), 'locker': ('class', 40), 'counter': ('class', 54),
    'stove': ('kitchen', 148), 'fridge': ('kitchen', 158), 'sink': ('kitchen', 141), 'dtable': ('kitchen', 288), 'dchair': ('kitchen', 280),
    'futon': ('jp', 77), 'futon2': ('jp', 81),
    'camera': ('tv', 1), 'softbox': ('tv', 8), 'monitor': ('tv', 41), 'mic': ('music', 61),
    'junk': ('living', 99), 'junk2': ('living', 102),
}


def single(group, n):
    d, prefix = SINGLE_DIR[group]
    return sheet(os.path.join(SINGLES, d, f'{prefix}_{n}.png'))


def build_indoor():
    rb = sheet(os.path.join(IN16, 'Room_Builder_16x16.png'))
    tiles = [(k, rb.crop((x * 16, y * 16, x * 16 + 16, y * 16 + 16))) for k, (x, y) in INDOOR_TILES.items()]
    objects = [(k, single(g, n)) for k, (g, n) in INDOOR_OBJECTS.items()]
    pack(tiles, objects, 'indoor')


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    os.makedirs(OUT, exist_ok=True)
    if what in ('people', 'all'):
        build_people()
    if what in ('indoor', 'all'):
        build_indoor()
