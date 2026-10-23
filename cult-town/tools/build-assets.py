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


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if what in ('people', 'all'):
        build_people()
