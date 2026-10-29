#!/usr/bin/env python3
"""완성된 그림에서 인물을 잘라 2D 인물 참고 시트(cast-2d.jpg)를 만든다.

    cd forever/images && python3 ../reference/make_cast_sheet.py . ../reference/cast-2d.jpg
"""
import sys
from PIL import Image, ImageDraw, ImageFont
S, OUT = sys.argv[1], sys.argv[2]
crops=[
 ('Minju-simin','duck · President','cover',(360,600,660,1060)),
 ('Chumo-yeolsa','teddy bear · Intelligence','04-08',(20,560,420,1480)),
 ('Chumo-hamnido','wolf · Press Control','01-04',(0,380,420,1050)),
 ('Deul-neoguri','gorilla · Rapper & Culture Minister','02-01',(130,300,650,1050)),
 ('Bui','tortoise · Elder','02-05',(700,480,1024,1250)),
 ('Chumo-tusu','sea otter · official','02-04',(600,520,960,1180)),
 ('Chumo-daejang','elephant · Elder / TV host','03-01',(60,300,640,980)),
 ('Aeguk-jwasu','wolf · Corrections (camo)','04-03',(0,480,500,1536)),
 ('Aeguk-jwasu','wolf · Corrections (suit)','05-02',(180,300,520,1300)),
 ('John Pukta','black rat · troll','05-03',(130,330,660,1250)),
 ('Lee Gija','sloth · Legal Affairs','01-08',(60,620,460,1230)),
 ('Hai','koala · lazy official','04-07',(440,560,840,1100)),
]
CW,CH,LH=420,560,70
cols=6; rows=2
sheet=Image.new('RGB',(CW*cols,(CH+LH)*rows),(250,246,238)); d=ImageDraw.Draw(sheet)
try:
    f1=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30); f2=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
except Exception:
    f1=f2=ImageFont.load_default()
for i,(name,sub,img,box) in enumerate(crops):
    im=Image.open(img+'.webp').convert('RGB').crop(box); im.thumbnail((CW-20,CH-20))
    x=(i%cols)*CW; y=(i//cols)*(CH+LH)
    sheet.paste(im,(x+(CW-im.width)//2,y+10+(CH-20-im.height)//2))
    d.text((x+CW//2,y+CH+8),name,fill=(40,30,20),font=f1,anchor='ma')
    d.text((x+CW//2,y+CH+42),sub,fill=(110,90,70),font=f2,anchor='ma')
sheet.save(OUT,quality=90)
print(sheet.size)
