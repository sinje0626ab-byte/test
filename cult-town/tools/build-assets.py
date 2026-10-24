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
    'floor0': (34, 17), 'floor1': (34, 17), 'floor2': (39, 21), 'floor3': (34, 37),
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
    # 302 기본 살림 (27장)
    'tube': ('conf', 47), 'calendar': ('class', 32), 'cork': ('class', 33), 'water': ('conf', 43), 'shoes': ('jp', 68), 'slippers': ('jp', 113),
    # 28장 레벨 해금 소품
    'guitar': ('music', 48), 'keyboard': ('music', 66), 'altar': ('jp', 38),
}


def single(group, n):
    d, prefix = SINGLE_DIR[group]
    return sheet(os.path.join(SINGLES, d, f'{prefix}_{n}.png'))


def build_indoor():
    rb = sheet(os.path.join(IN16, 'Room_Builder_16x16.png'))
    tiles = [(k, rb.crop((x * 16, y * 16, x * 16 + 16, y * 16 + 16))) for k, (x, y) in INDOOR_TILES.items()]
    # 0단계 바닥 = 누렇게 바랜 낡은 장판 (1단계 장판을 탁하게 물들인 것, 고쳐 쓰기)
    tiles = [(k, hue(im, (0.86, 0.8, 0.66)) if k == 'floor0' else im) for k, im in tiles]
    objects = [(k, single(g, n)) for k, (g, n) in INDOOR_OBJECTS.items()]
    pack(tiles, objects, 'indoor')


# ── 동네 (Modern Exteriors) ──
# 우리 지도는 한 층이 한 칸이라, LimeZu 건물(한 층 2~3칸)을 통째로 쓰지 않고 지붕·벽·창·문·차양을 16x16 으로 잘라 이어 붙인다.
ETS = os.path.join(EX, 'ME_Theme_Sorter_16x16')
EXDIR = {'terr': ('2_City_Terrains_Singles_16x16', 'ME_Singles_City_Terrains_16x16'), 'tf': ('1_Terrains_and_Fences_Singles_16x16', 'ME_Singles_Terrains_and_Fences_16x16'),
         'gb': ('4_Generic_Building_Singles_16x16', 'ME_Singles_Generic_Building_16x16'), 'fm': ('5_Floor_Modular_Building_Singles_16x16', 'ME_Singles_Floor_Modular_Building_16x16'),
         'props': ('3_City_Props_Singles_16x16', 'ME_Singles_City_Props_16x16'), 'veh': ('10_Vehicles_Singles_16x16', 'ME_Singles_Vehicles_16x16'),
         'gs': ('6_Garage_Sales_Singles_16x16', 'ME_Singles_Garage_Sales_16x16'),
         'sub': ('20_Subway_and_Train_Station_Singles_16x16', 'ME_Singles_Subway_and_Train_Station_16x16'), 'mk': ('9_Shopping_Center_and_Markets_Singles_16x16', 'ME_Singles_Shopping_Center_and_Markets_16x16')}


def fm(name):
    return ex('fm', name)


def ex(group, name):
    d, prefix = EXDIR[group]
    return sheet(os.path.join(ETS, d, f'{prefix}_{name}.png'))


def crop(im, x, y, w=16, h=16):
    return im.crop((x, y, x + w, y + h))


def stripe(im, x):
    """세로줄 하나(x)를 16칸 폭으로 이어 붙인 민벽 (창·문 조각이 반쪽 남지 않게)"""
    im = im.convert('RGBA')
    col = im.crop((x, 0, x + 1, im.height))
    out = Image.new('RGBA', (16, im.height))
    for i in range(16): out.paste(col, (i, 0))
    return out


def hue(im, rgb_mul):
    """색 바꾸기 (고쳐 쓰기): 채널마다 곱해 벽 색을 늘린다. 외곽선(어두운 색)은 거의 그대로."""
    px = im.copy(); d = px.load()
    for yy in range(px.height):
        for xx in range(px.width):
            r, g, b, a = d[xx, yy]
            if a and (r + g + b) > 200:
                d[xx, yy] = (min(255, int(r * rgb_mul[0])), min(255, int(g * rgb_mul[1])), min(255, int(b * rgb_mul[2])), a)
    return px


def town_tiles():
    T = {}
    # 바닥
    T['road'] = ex('terr', 'Asphalt_1_Variation_16'); T['alley'] = ex('terr', 'Asphalt_1_Variation_17')
    T['laneH'] = ex('terr', 'Asphalt_1_Variation_2'); T['laneV'] = ex('terr', 'Asphalt_1_Variation_15')
    T['crossH'] = crop(ex('terr', 'Sidewalk_1_34'), 0, 0); T['crossV'] = crop(ex('terr', 'Sidewalk_1_30'), 0, 0)
    T['sidewalk'] = crop(ex('terr', 'Sidewalk_1_25'), 0, 0); T['plaza'] = crop(ex('terr', 'Sidewalk_4_25'), 0, 0)
    T['market'] = crop(ex('terr', 'Sidewalk_1_27'), 0, 0)
    T['grass'] = ex('tf', 'Grass_1_22'); T['water'] = ex('tf', 'Deep_Water_1_9'); T['waterBottom'] = ex('tf', 'Deep_Water_1_2')
    T['fence'] = crop(ex('props', 'Pedestrian_Barrier_Post_Modular_1_Middle'), 0, 0)
    # 건물 (27장): LimeZu 모듈 건물(5_Floor_Modular) 조각. 1층 = 세 칸(48px, LimeZu 원래 높이), 위층 = 작은 창 띠 한 칸, 지붕 = 한 칸.
    # 벽돌·파랑·회색 세 벌 + 회색을 따뜻하게 물들인 베이지 (고쳐 쓰기). 이름: g_<벽>_<조각>_<줄 0~2> · up_<벽>_<A|B|P>
    for key, fam, mul in (('brick', 0, None), ('blue', 1, None), ('grey', 2, None), ('beige', 2, (1.16, 1.07, 0.88))):
        f = (lambda im: hue(im, mul)) if mul else (lambda im: im)
        pieces = {f'shop{i}': fm(f'Ground_Floor_Shop_Modular_{fam * 12 + i}') for i in range(1, 13)}
        pieces.update({f'condo{i}': fm(f'Ground_Floor_Condo_Modular_{fam * 8 + i}') for i in (1, 2, 7, 8)})   # 지도에서 쓰는 것만
        # 조각은 16px 기둥이라 창 하나가 두 조각(짝)에 걸친다. 민벽은 창이 없는 세로줄 하나를 16번 이어 붙여 만든다 (반쪽 창이 남지 않게)
        plain = stripe(fm(f'Ground_Floor_Condo_Modular_{fam * 8 + 8}'), 12)
        pieces['plain'] = plain
        door = fm(f'Ground_Floor_Bakery_Modular_{fam * 2 + 2}').convert('RGBA').copy()
        dd, pd = door.load(), plain.load()
        for yy in range(38, door.height):          # 옆 조각(빵집 천막)에서 넘어온 노란 발판을 민벽 바닥으로
            for xx in range(16):
                r_, g_, b_, a_ = dd[xx, yy]
                if a_ and r_ > 170 and g_ > 120 and b_ < 110: dd[xx, yy] = pd[xx, yy]
        pieces['mdoor'] = door
        for name, im in pieces.items():
            for r in range(3): T[f'g_{key}_{name}_{r}'] = f(crop(im, 0, r * 16))
        T[f'up_{key}_A'] = f(crop(fm(f'Middle_Floor_Modular_{fam * 10 + 7}'), 0, 14))
        T[f'up_{key}_B'] = f(crop(fm(f'Middle_Floor_Modular_{fam * 10 + 8}'), 0, 14))
        T[f'up_{key}_P'] = f(crop(stripe(fm(f'Middle_Floor_Modular_{fam * 10 + 7}'), 2), 0, 14))
    # 지붕 한 칸: Condo 지붕의 위 끝 + 아래 끝 (왼·가운데·오른) 두 가지
    for key, condo in (('A', 'Condo_1'), ('B', 'Condo_2')):
        p1, p2, p4 = ex('gb', f'{condo}_2'), ex('gb', f'{condo}_3'), ex('gb', f'{condo}_5')
        for i, (im, x) in enumerate(((p1, 0), (p2, 16), (p4, 0))):
            thin = crop(im, x, 0).copy(); thin.paste(crop(im, x, 60, 16, 8), (0, 8)); T[f'roof{key}_thin_{i}'] = thin
    T['stairsDown'] = crop(ex('sub', 'Stairs_Small_2'), 0, 28)     # 지하철 출구 계단 (출구 표지 아래)
    # 30장: 원룸 언덕 계단 골목 (지하철 계단 가운데 줄을 두 칸 폭으로 이어 붙인다)
    st = ex('sub', 'Stairs_1')
    T['stairsL'] = crop(st, 0, 16); T['stairsR'] = crop(st, 16, 16)
    return list(T.items())


# 물건 (지도 오브젝트 'lz' 로 놓고 TownScene 이 사람과 같이 y 정렬해 그린다): 이름 → (묶음, 파일 이름)
TOWN_OBJECTS = {
    'tree': ('props', 'Tree_1'), 'tree2': ('props', 'Tree_2'), 'lamp': ('props', 'Street_Lamp_5'), 'pole': ('props', 'Electric_Pole_1'),
    'vending': ('sub', 'Drink_Machine_Right'), 'bench': ('props', 'Bench_3'), 'trash': ('props', 'Trashbin_1'), 'trash2': ('props', 'Trashbin_5'),
    'mailbox': ('props', 'Mailbox_1'), 'plant': ('props', 'Pot_1'), 'plant2': ('props', 'Pot_3'), 'bags': ('props', 'Cardboard_Trash_1'), 'bags2': ('props', 'Box_Trash_1'),
    'bin': ('props', 'Trashbin_10'), 'recycle': ('props', 'Trashbin_12'), 'recycle2': ('props', 'Trashbin_13'), 'hydrant': ('props', 'Hydrant_1'),
    'stall': ('gs', 'Box_6'), 'stall2': ('gs', 'Box_5'), 'stall3': ('gs', 'Box_8'), 'table': ('gs', 'Table_2'), 'cart': ('veh', 'Fruit_Flowers_Cart_2'),
    'carU1': ('veh', 'Car_Up_1'), 'carU2': ('veh', 'Car_Up_3'), 'carD1': ('veh', 'Car_Down_2'), 'carD2': ('veh', 'Car_Down_5'),
    'carL1': ('veh', 'Car_Left_1'), 'carR1': ('veh', 'Car_Right_3'),
    'ac': ('mk', 'Air_Conditioner_Unit_5'), 'shrub': ('props', 'Shrub_9'),
    # 30장: 닫힌 구역 공사 펜스 · 고깔 · 산책로 꽃덤불 · 음수대
    'barrier': ('props', 'Traffic_Barrier_2'), 'cone': ('props', 'Cone_3'), 'flowers': ('props', 'Flower_Bush_1'), 'fountain': ('props', 'Drinking_Fountain_1'),
}


def cherry_tree():
    # 도림천 벚나무: 나무 1의 잎 초록을 분홍으로 바꾼다 (줄기·그림자는 그대로)
    im = ex('props', 'Tree_1').copy()
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a and g > r + 8 and g >= b:
                l = (r + g + b) / 3
                px[x, y] = (min(255, int(l * 1.35 + 70)), min(255, int(l * 0.85 + 40)), min(255, int(l * 1.0 + 60)), a)
    return im


def build_town():
    tiles = town_tiles()
    objects = [(k, ex(g, n)) for k, (g, n) in TOWN_OBJECTS.items()] + [('cherry', cherry_tree())]
    pack(tiles, objects, 'town')


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    os.makedirs(OUT, exist_ok=True)
    if what in ('people', 'all'):
        build_people()
    if what in ('indoor', 'all'):
        build_indoor()
    if what in ('town', 'all'):
        build_town()
