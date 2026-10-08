# 초원 개척단 — ChatGPT 그림 의뢰 프롬프트

이 문서는 ChatGPT(이미지 생성)에게 게임 그림을 새로 그려 달라고 할 때 그대로 복사해서 쓰는 프롬프트 모음입니다.
함께 보내는 자료
- `docs/art/sheets/*.png` — 카테고리별 시트 11장 (ChatGPT에 첨부용)
- `docs/art/ref/*.png` — 지금 그림 한 장씩 222장 (요청할 때 그 그림 하나를 같이 첨부)
  - 아이콘: `item_<id>` · `slot_<slot>` · `skill_<id>` · `build_<id>`
  - 3D 렌더: `monster_<id>` · `npc_<id>` · `weapon_<id>` · `turret_<id>`(+`_lv5`) · `base_<1~4>` · `facility_<id>` · `wall_<id>` · `node_<id>` · `char_*` · `player_*`
- `docs/art/ArtCatalog.pdf` — 전체 카탈로그 (사람이 보기용)
- `docs/art/PROMPTS_READY.md` — 그림 137개의 프롬프트를 미리 다 채워 둔 완성본 (복사해서 바로 쓰기)

---

## 0. 진행 순서 (꼭 이 순서로)

1. **새 대화**를 열고 → `1. 첫 메시지`를 붙여 넣고, 시트 PNG 중 `02_style.png`, `04_items.png`, `08_monsters.png`, `03_screens.png` 4장을 첨부합니다.
   - PDF보다 **PNG 시트가 훨씬 잘 읽힙니다**. ChatGPT는 PDF 속 그림을 작게 보거나 건너뛰는 일이 많습니다.
2. ChatGPT가 이해한 내용을 요약해 주면 → `2. 스타일 기준 그림` 프롬프트로 **기준 그림 1장**을 먼저 받습니다.
   - 마음에 들 때까지 고친 뒤, 그 그림을 저장해 두고 이후 모든 요청에 **"이 기준 그림과 같은 화풍"** 이라고 붙입니다.
3. 그다음 카테고리별(3~9장) 프롬프트로 **한 장에 하나씩** 받습니다. 요청마다 `ref/` 의 지금 그림 한 장을 같이 첨부하면 생김새가 훨씬 잘 맞습니다.
   - 한 장에 여러 개를 그리게 하면 크기·여백이 제각각이라 잘라 쓰기 어렵고, 질도 떨어집니다.
   - 예외: 스타일 시험용 "모아 보기"(3-1)만 여러 개.
4. 받은 그림은 이 문서 표의 **파일 이름 그대로** 저장 → 폴더째 주시면 게임에 넣는 작업은 제가 합니다.
5. 한 대화가 길어지면(30장 이상) 그림체가 조금씩 흐트러집니다. 그럴 땐 새 대화에서 `1. 첫 메시지` + 기준 그림을 다시 첨부하고 이어 갑니다.

> 💡 같은 카테고리는 같은 대화 안에서 연달아 받는 것이 가장 일관됩니다.
> 💡 결과가 이상하면 "다시"가 아니라 **무엇이 다른지** 짚어 주세요. 예) "외곽선이 너무 얇아요. 기준 그림처럼 굵게", "그림자가 오른쪽 아래로 오게".

---

## 0-1. 다른 계정·새 대화에서 이어서 할 때

새 계정은 앞에서 정한 그림체를 모릅니다. **이미 완성된 그림을 "승인된 예시"로 보여 주는 것**이 가장 확실합니다.

**첫 메시지** — 첨부: `style_anchor.webp`, `style_reference.png` (지금까지 게임에 넣은 새 그림 18개 모음)

```
You are the lead 2D artist for my cozy indie game "Meadow Pioneers" (초원 개척단).
We are in the middle of redrawing all of the game's art, and the art style is ALREADY APPROVED and LOCKED.

Attached:
1) style_anchor.webp — the approved style anchor.
2) style_reference.png — 18 finished icons that are already in the game (items, gear, skill badges).
Every new image must look like it belongs in this exact same set: same outline thickness and color (dark warm brown #3b2d22),
same soft cel shading, same top-left light, same saturation, same chunky cute proportions, same level of detail.

About the game: a cute, warm, storybook-style survival/base-building RPG. A chibi pioneer explores grassland, forest, desert
and snowfield, hunts cute monsters, builds a base and defends it at night with turrets. Never scary or realistic.

Rules for every image unless I say otherwise:
- Fully TRANSPARENT background (no white, no grey haze). No frames, no text, no numbers, no labels.
- When I ask for several objects in one image: a clean grid in exactly the listed order (left to right, top row first),
  every object the same size in its own cell, with wide empty space between them — never touching or overlapping.
- Keep each object's identity from the attached current placeholder images, but redraw it much better.

Reply in Korean with a 3-line summary of the style, then wait for my request.
```

ChatGPT가 요약해 주면, `PROMPTS_BATCH.md`에서 할 차례의 묶음을 그대로 보내면 됩니다.

---

## 1. 첫 메시지 (프로젝트 설명 — 새 대화마다 맨 처음에)

```
You are the lead 2D artist for my cozy indie game "Meadow Pioneers" (Korean title: 초원 개척단).
I will ask you to redraw ALL of the game's art, one asset at a time, so I can replace the current placeholder art.

About the game:
- A cute, warm, storybook-style survival/base-building RPG played in the web browser.
- The player is a small chibi pioneer who explores 4 regions (grassland → forest → desert → snowfield),
  hunts cute monsters, gathers wood/stone/herbs, builds a tent base, and defends it from night raids with turrets.
- Tone: friendly, soft, round, colorful, a little humorous. Never scary, gory, or realistic. All ages.

What I attached:
- Catalog sheets showing every current asset (item icons, monsters, characters, buildings, UI) and real game screens.
- Each card shows: Korean name, code id, and the file path where the new art will go.
- The current art is simple vector/low-poly placeholder art. Keep each asset's IDENTITY
  (same object, same main colors, same silhouette idea) but make it much richer, more polished and more charming.

Global art rules (apply to EVERY image unless I say otherwise):
1. Style: hand-painted cozy fantasy game art, like a high-quality mobile RPG icon set.
   Soft cel shading with gentle gradients, chunky rounded shapes, clear readable silhouette.
2. Outline: consistent dark warm-brown outline (#3b2d22), medium-thick, slightly thicker on the outer silhouette.
3. Light: always from the TOP-LEFT. Highlight on the upper-left, soft shadow on the lower-right.
4. Palette: warm and saturated but not neon. Use the palette in the style sheet (wood #b07e4f, leaf #7fae55, stone #9ea1a3,
   gold #e0b34a, ice #a9d8ec, jelly #8fcf7e, red #c9584e ...). Keep each item's main color from the catalog.
5. Composition: ONE subject, centered, filling about 80% of the canvas, small even margin, 3/4 view slightly from above
   (unless stated). A very soft oval contact shadow under objects that stand on the ground.
6. Background: fully TRANSPARENT (PNG with alpha). No frame, no card, no circle behind it unless I ask.
7. NO text, letters, numbers, watermarks or signatures inside the image.
8. Must stay readable when shrunk to 48×48 px: strong silhouette, big shapes, few tiny details, good value contrast.
9. Square 1:1 canvas unless I say otherwise.

Please first reply with a short summary of the style you will use (in Korean), then wait for my first request.
```

---

## 2. 스타일 기준 그림 (가장 먼저 1장)

```
Before the real assets, make ONE style-anchor image so we can lock the art style.
Draw these 6 game icons together on a transparent background, arranged in a 3×2 grid with generous equal spacing,
all in exactly the same style, size and lighting (top-left light, dark brown #3b2d22 outline, soft cel shading):
1) a small round red health potion bottle with a cork  2) a wooden log  3) a cute green slime monster face
4) an iron sword  5) a gold coin stack  6) a red mushroom cap with white spots.
This is only a style test — no text, no labels.
```

마음에 들면: `이 그림의 화풍을 기준으로 고정할게. 앞으로 모든 그림은 이 기준 그림과 같은 선 굵기, 명암, 채도, 빛 방향으로 그려줘.` 라고 보내고 이 그림을 저장해 두세요.

---

## 3. 아이템 아이콘 (70개) → `art/items/<id>.png`

### 3-1. 템플릿 (매번 `{ }` 부분만 바꿔서)

```
Item icon for my game, same style as the approved style anchor.
Subject: {영어 설명}
Main color: {색 코드}. Rarity: {등급} — {등급 연출}.
The attached image is the CURRENT placeholder icon: keep the same object and idea, but redraw it much better.
Transparent background, single centered object, 3/4 view from slightly above, filling ~80% of a square canvas,
top-left light, dark brown outline (#3b2d22), soft contact shadow. No text. Must read clearly at 48×48 px.
File name: {id}.png
```

**등급 연출** (그림 안의 반짝임 정도 — 테두리 빛은 게임이 따로 그립니다)
| 등급 | 연출 문구 |
|---|---|
| common 일반 | plain everyday materials, no glow |
| uncommon 고급 | well-crafted, a small shine |
| rare 희귀 | fine craftsmanship, a subtle magical sparkle |
| epic 영웅 | ornate, glowing accents, a few sparkles |
| legendary 전설 | majestic, radiant warm glow, golden details, small light rays |

### 3-2. 목록

| id | 이름 | 등급 | 색 | Subject (영어) |
|---|---|---|---|---|
| **재료** |||||
| slime_jelly | 슬라임 젤리 | common | #8ee08a | a wobbly translucent green jelly blob with a glossy highlight and a tiny cute shine |
| mushroom_cap | 버섯 갓 | common | #e0574f | a single fluffy red mushroom cap with white spots and a short pale stem |
| cactus_spine | 선인장 가시 | uncommon | #9fd46a | a small bundle of three long sharp cactus spines tied with twine |
| ice_shard | 얼음 조각 | uncommon | #9fd8ff | a cluster of pale-blue ice crystals, translucent with inner light |
| wood | 나무 토막 | common | #b88452 | a short chopped log lying on its side, visible tree rings and bark |
| stone | 돌멩이 | common | #a9adb6 | a rounded grey rock with a few chips and a light top highlight |
| fiber | 풀 섬유 | common | #b5d67a | a small coil of twisted yellow-green grass twine (like a rope spool), clearly a thread, NOT a bundle of spines |
| herb | 약초 | common | #6fbf5f | a fresh green medicinal herb sprig with several leaves |
| resin | 송진 | uncommon | #e9b44f | a big glossy amber drop of tree resin, honey-like |
| iron_ore | 철광석 | uncommon | #8a7f8f | a dark rock chunk with shiny metallic iron veins |
| cactus_pulp | 선인장 과육 | common | #8fd46a | a juicy sliced cactus pad showing green flesh |
| sandstone | 사암 | uncommon | #e0a86a | a warm orange layered sandstone block with soft strata lines |
| sun_crystal | 태양 수정 | rare | #ffd23f | a cluster of golden yellow crystals glowing like sunlight |
| frost_crystal | 서리 수정 | rare | #b8ecff | a cluster of icy blue-white crystals with frosty sparkles |
| herb_seed | 약초 씨앗 | common | #9ccf6a | a small paper seed packet with a green herb picture and a few seeds |
| apple_seed | 사과 씨앗 | uncommon | #e0645a | a small paper seed packet with a red apple picture and a few seeds |
| **소모품** |||||
| potion | HP 물약 | common | #ff7b8a | a small round glass bottle with pink-red healing liquid and a cork |
| big_potion | 큰 HP 물약 | uncommon | #ff4d6d | a larger round glass flask with deep red healing liquid, cork and a little ribbon |
| apple | 사과 | common | #ff6b6b | a shiny red apple with a leaf on the stem |
| herb_tea | 약초차 | common | #a6d48a | a cozy ceramic cup of green herbal tea with steam |
| honey_jar | 꿀단지 | uncommon | #ffc53d | a round honey jar with golden honey dripping, cloth lid tied with string |
| fire_tonic | 불꽃 강장제 | uncommon | #ff7b3d | a tall bottle of glowing orange-red tonic with a tiny flame emblem |
| cactus_juice | 선인장 주스 | uncommon | #8fd46a | a tall glass of green cactus juice with a straw and a cactus slice |
| return_scroll | 귀환 두루마리 | uncommon | #e9dcb0 | a rolled parchment scroll with a red wax seal and a soft magic glow |
| forget_potion | 망각의 물약 | rare | #9a7fe0 | a round purple potion with swirling misty stars inside |
| **화폐·키트** |||||
| gold | 골드 | — | #ffd23f | a small stack of shiny gold coins |
| tent_kit | 텐트 키트 | uncommon | #e9a35b | a folded orange canvas tent bundle with poles, tied with rope |
| **무기 — 검** |||||
| twig_sword | 나뭇가지 검 | common | #b88452 | a simple sword carved from a sturdy tree branch, wrapped grip |
| iron_sword | 무쇠 검 | uncommon | #c9d3dd | a sturdy iron sword with a brown leather grip and simple crossguard |
| ice_sword | 얼음 검 | rare | #9fd8ff | a sword with a translucent ice-crystal blade and a frosty guard |
| sun_blade | 태양 검 | rare | #ffd23f | a golden sword with a sun crystal set in the guard, warm glow |
| jelly_greatsword | 왕젤리 대검 | epic | #8ee08a | a big greatsword with a translucent green jelly blade and a tiny crown pommel |
| dawn_blade | 새벽검 | legendary | #ffa53d | an elegant sword whose blade glows orange-pink like dawn light, golden guard, light rays |
| **무기 — 창** |||||
| bamboo_spear | 대나무 창 | common | #c9d68a | a long bamboo spear with a simple sharpened tip |
| iron_spear | 무쇠 창 | uncommon | #c9d3dd | a spear with a wooden shaft and a leaf-shaped iron head |
| scorpion_pike | 전갈 꼬리 창 | rare | #b35e2c | a pike whose head is a curved orange scorpion stinger, a drop of purple poison |
| frost_lance | 서리 창 | rare | #9fd8ff | a lance with an icy crystal spearhead and frost wisps |
| **무기 — 망치** |||||
| stone_hammer | 돌망치 | common | #a9adb6 | a chunky stone hammer head tied to a wooden handle with rope |
| mossy_mace | 이끼 철퇴 | uncommon | #6f9a5a | a round iron mace head covered in green moss, wooden handle |
| sandstone_maul | 사암 망치 | rare | #e0a86a | a huge maul made from a carved orange sandstone block |
| glacier_hammer | 빙하 망치 | rare | #7fc0f0 | a heavy hammer with a big blue glacier-ice head |
| **무기 — 활** |||||
| short_bow | 짧은 활 | common | #b88452 | a small simple wooden bow with string |
| hunter_bow | 사냥꾼 활 | uncommon | #8a6440 | a sturdy dark-wood hunting bow with leather grip wrap |
| dune_bow | 모래바람 활 | rare | #e9b44f | a bow made of golden desert wood with sand-swirl patterns |
| aurora_bow | 오로라 활 | rare | #b8a0ff | a bow with a shimmering lavender-to-cyan aurora gradient |
| heartwood_bow | 고목심 활 | epic | #9a6a45 | a bow carved from ancient heartwood with tiny leaves sprouting, faint green glow |
| **머리** |||||
| leaf_hat | 풀잎 모자 | common | #7ccf6a | a cute hat woven from one big green leaf |
| mushroom_hat | 버섯 모자 | uncommon | #e0574f | a soft red mushroom-cap hat with white spots |
| desert_hood | 사막 두건 | rare | #e9a35b | a sand-colored desert hood with a face wrap |
| fur_hat | 털모자 | rare | #f2f2f2 | a fluffy white fur hat with ear flaps and a pompom |
| cactus_crown | 선인장왕의 왕관 | epic | #ff5f8f | a crown made of small cacti with a pink flower on top |
| royal_jelly_crown | 말랑 왕관 | epic | #ffb3d9 | a squishy pink jelly crown with soft rounded points |
| **몸** |||||
| grass_tunic | 풀잎 옷 | common | #8fce6a | a short tunic woven from green grass and leaves |
| leather_vest | 가죽 조끼 | uncommon | #a86f45 | a brown leather vest with stitches and a small buckle |
| desert_cloak | 사막 망토 | rare | #e9a35b | a thick sand-orange cloak with a hood and patterned trim |
| yeti_coat | 설인 털옷 | rare | #e6f2fa | a puffy white yeti-fur coat with light blue trim |
| **발** |||||
| straw_shoes | 짚신 | common | #e8cf8a | a pair of woven straw sandals |
| leather_boots | 가죽 장화 | uncommon | #8a5a3a | a pair of brown leather boots with laces |
| sand_sandals | 모래 샌들 | rare | #e8cf8a | a pair of light desert sandals with cloth straps |
| snow_boots | 설원 부츠 | rare | #b9dcf2 | a pair of padded snow boots with fur cuffs |
| **장신구** |||||
| clover_ring | 네잎클로버 반지 | rare | #5fd48a | a gold ring with a four-leaf clover gem |
| jelly_charm | 젤리 부적 | uncommon | #8a6cf0 | a purple jelly drop charm on a cord |
| snow_charm | 눈꽃 부적 | rare | #dff3ff | a round glass charm with a snowflake inside |
| giant_heart | 거인의 심장 | epic | #7fc0f0 | an ice-blue heart-shaped crystal pendant that glows warmly inside |
| bee_ring | 꿀벌 반지 | uncommon | #ffd23f | a gold ring with a tiny striped bee on it |
| rabbit_foot | 토끼발 부적 | uncommon | #ffffff | a fluffy white rabbit-foot lucky charm on a string |
| spore_pendant | 포자 목걸이 | uncommon | #b88ae0 | a necklace with a small purple mushroom pendant |
| wisp_lantern | 요정 등불 | rare | #9fe8ff | a tiny hanging lantern with a glowing cyan fairy light inside |
| treant_seed | 고목의 씨앗 | epic | #6fae4a | a big acorn-like seed with a green sprout, faint glow, on a cord |
| doctor_lens | 박사의 돋보기 | epic | #c9a44a | an antique brass magnifying glass with an ornate handle |

---

## 4. 빈 장비 칸 (5개) → `art/slots/<slot>.png`

```
Empty equipment-slot placeholder icon for my game UI. Subject: a simple silhouette of {대상}.
Draw it as a single flat light-grey silhouette (#cfc6b4) with a soft inner shadow, no outline color, no details,
centered on a transparent background, filling ~70% of a square canvas. No text.
It will be shown faded inside an empty inventory slot.
```
| slot | 대상 |
|---|---|
| weapon | a sword |
| head | a hat |
| body | a tunic |
| feet | a pair of boots |
| accessory | a ring |

---

## 5. 스킬 배지 (19개) → `art/skills/<id>.png`

```
Round skill badge icon for my game, same style as the style anchor.
A circular medallion: base color {갈래 색}, a slightly darker rim, subtle glossy highlight on the upper-left,
and a bold WHITE symbol in the middle: {상징}. Clean and readable at 40×40 px.
Transparent background outside the circle. No text. File name: {id}.png
```
| 갈래 | 색 |
|---|---|
| 전투 combat | coral red #ff8a7a |
| 생존·채집 survival | leaf green #7cc67a |
| 건축 building | warm orange #e9a35b |

| id | 이름 | 갈래 | 상징 (영어) |
|---|---|---|---|
| power | 힘 | combat | a raised sword with a burst of power |
| combo | 연속 베기 | combat | two quick parallel slash marks |
| whirl | 회전 공격 | combat | a circular spinning slash arrow |
| crit | 급소 찌르기 | combat | a sharp star burst hitting a target point |
| weapon_master | 무기 숙련 | combat | crossed sword and spear |
| dash_slash | 돌진 베기 | combat | a forward-dashing arrow with speed lines |
| gatherSpeed | 손놀림 | survival | a pickaxe with motion lines |
| vitality | 회복력 | survival | a heart with a small plus |
| gatherAmount | 알뜰 채집 | survival | two stacked resource pebbles with a plus |
| swift | 가벼운 발 | survival | a winged boot |
| thick_skin | 두꺼운 가죽 | survival | a sturdy shield |
| forager | 약초꾼 | survival | a leafy herb sprig |
| first_aid | 응급 처치 | survival | a medical cross |
| thrift | 절약 | building | a coin with a downward arrow |
| turretPower | 포탑 정비 | building | a small turret with a wrench |
| turretCount | 진지 확장 | building | two small turrets with a plus |
| mason | 석공 | building | stacked bricks |
| sharpshooter | 명사수 포탑 | building | a crosshair target |
| overclock | 포탑 과부하 | building | a lightning bolt |

---

## 6. 건설 아이콘 (15개) → `art/build/<id>.png`

```
Building/turret icon for the build menu of my game, same style as the style anchor.
Subject: {영어 설명}. Cute miniature diorama look, 3/4 view from slightly above, sitting on a small patch of ground
with a soft shadow. Centered, ~80% of a square canvas, transparent background, no text. File name: {id}.png
```
| id | 이름 | Subject (영어) |
|---|---|---|
| wood_bow | 나무 활 포탑 | a small wooden watch-post turret with a mounted wooden bow on top |
| crossbow | 석궁 포탑 | a stone-based turret with a big iron crossbow on a wooden mount |
| gun | 총 포탑 | an iron turret with a short rapid-fire gun barrel and a brass sight |
| cannon | 대포 포탑 | a dark iron cannon on a wooden wheeled carriage |
| poison_thrower | 독침 포탑 | a wooden turret topped by a green bulb launcher dripping poison |
| frost_tower | 서리 포탑 | a blue stone pedestal holding a floating glowing ice crystal |
| workbench | 작업대 | a sturdy wooden workbench with a saw and a hammer on it |
| storage | 창고 | a big wooden storage chest/shed with a brass lock |
| shop | 상점 | a tiny market stall with a red-and-white striped awning and goods |
| campfire | 모닥불 | a cozy campfire with crossed logs and a ring of stones |
| garden | 텃밭 | a small wooden planter box with young green sprouts |
| forge | 대장간 | a stone furnace with glowing fire and an anvil next to it |
| board | 게시판 | a wooden notice board with pinned paper notes |
| wall | 나무 울타리 | a short section of pointed wooden palisade fence |
| stone_wall | 돌담 | a short section of mossy stone-brick wall |

---

## 7. UI 장식 → `art/ui/`

**창 모서리 금장식** `win_corner.png` (256×256)
```
A decorative golden corner ornament for a fantasy game window frame, top-left corner only:
an L-shaped gold bar with a curling vine flourish and a small diamond gem where it bends.
Dark brown outline (#3b2d22), warm gold (#e0b34a) with highlights. Transparent background.
The two arms must touch the top edge and the left edge of the canvas. No text.
```

**마우스 커서** `cursor.png` (64×64) / `cursor_hand.png` (64×64)
```
A mouse cursor for my cozy fantasy game: a tiny cute sword pointing to the TOP-LEFT corner,
the sword tip exactly at the top-left pixel. Thick dark outline, steel blade, brown grip. Transparent background, very simple, readable at 28 px.
```
```
A mouse cursor for my cozy fantasy game: a cute cartoon hand with the index finger pointing UP,
fingertip at the top-center. Thick dark outline, warm skin color. Transparent background, readable at 28 px.
```

**골드 동전** `coin.png` (128×128)
```
A single shiny gold coin seen from the front, with a simple embossed leaf emblem, top-left highlight,
dark brown outline. Transparent background, readable at 16 px. No text or numbers.
```

**타이틀 로고** `logo.png` (가로 3:1 이상)
```
Game title logo for "초원 개척단" with the small English subtitle "MEADOW PIONEERS" underneath.
Chunky rounded Korean letters in warm gold-yellow with a thick dark brown outline and a soft drop shadow,
a little sprout leaf growing from one letter, a tiny tent icon as decoration. Cozy storybook fantasy feel.
Transparent background, wide horizontal layout. The Korean text must be spelled exactly: 초원 개척단
```
> ⚠ 한글 글자는 이미지 생성이 자주 틀립니다. 글자가 틀리면 "글자 없이 장식(새싹·텐트·리본 배너)만" 받아서 제가 게임 글꼴로 글자를 얹는 쪽을 추천합니다.

**창 틀 텍스처 (선택)** `panel_parchment.png` · `panel_wood.png` (512×512, 이어 붙일 수 있게)
```
A seamless tileable texture of soft cream parchment paper for a game UI panel, very subtle fibers and stains,
low contrast so text stays readable. Square, seamless on all edges, no text.
```
```
A seamless tileable texture of warm brown painted wood planks for a game window border, soft hand-painted style,
low contrast. Square, seamless on all edges, no text.
```

---

## 8. 초상화 (몬스터 28 · 주민 5) → `art/portraits/`

도감·보스 체력바·대화창에 쓰이는 **2D 초상화**입니다. 게임 속 3D 모습과 같은 생김새여야 합니다(첨부 시트의 3D 렌더가 기준).

### 8-1. 몬스터 템플릿
```
Character portrait of a monster from my game, same style as the style anchor.
Subject: {영어 설명}. Main color {색}.
Cute and round, big expressive eyes, readable face. Show the whole body (or head+upper body for big bosses),
3/4 view facing slightly left, centered, ~80% of a square canvas, soft contact shadow, transparent background, no text.
It must clearly match the attached 3D reference "monster_{id}". File name: monster_{id}.png
```
밤 몬스터는 끝에 이 문장을 덧붙입니다:
```
Night variant: the body is slightly darker and cooler (purple-blue tint), the eyes glow softly,
and two tiny glowing light motes float around it. Still cute, not scary.
```
보스는 이 문장을 덧붙입니다:
```
This is a BOSS: bigger presence, more detail and ornament, a confident expression, a subtle aura. Still cute.
```

| id | 이름 | 색 | Subject (영어) |
|---|---|---|---|
| slime | 초원 슬라임 | #57c95a | a round squishy green slime blob with small dot eyes and a happy face |
| sand_slime | 모래 슬라임 | #e8c872 | a round sandy-yellow slime with grains of sand on it |
| snow_slime | 눈 슬라임 | #dff3ff | a round pale icy-white slime with a frosty top |
| big_slime | 큰 슬라임 | #4fbf52 | a large plump green slime, heavier and wobblier |
| mushroom | 숲 버섯 | #e0574f | a walking mushroom with a red white-spotted cap and stubby legs |
| spore_puff | 포자 버섯 | #9a6cd6 | a purple puffball mushroom puffing little spore clouds |
| cactus | 선인장 몬스터 | #5fa85a | a cute standing cactus with arms, small eyes and a pink flower on top |
| bee | 붕붕벌 | #ffd23f | a chubby round yellow-and-black striped bee with tiny wings and a stinger |
| horn_rabbit | 뿔토끼 | #ffffff | a fluffy white rabbit with one small horn on its forehead |
| thorn_wolf | 가시 늑대 | #5f8f55 | a small green wolf with thorny bramble fur on its back |
| stump | 그루터기 괴물 | #8a6440 | a living tree stump with a grumpy face and leafy sprouts on top |
| scorpion | 모래 전갈 | #c9803f | an orange desert scorpion with big pincers and a curled stinger |
| sand_mole | 모래 두더지 | #9a6a45 | a brown mole with a pink nose popping out of a sand mound |
| tumble | 굴렁 덤불 | #b59a5a | a rolling tumbleweed ball with two little eyes peeking out |
| ice_golem | 얼음 골렘 | #9fd3ff | a chunky blocky golem made of light-blue ice blocks |
| frost_wisp | 눈꽃 요정 | #bfeaff | a tiny floating ice fairy with snowflake wings, flying |
| yeti_cub | 설인 새끼 | #f4f7fb | a round fluffy white baby yeti with a blue-grey face |
| snow_bomber | 눈사람 폭탄 | #ffffff | a small snowman with a smiling coal face, carrying a lit round bomb |
| night_slime | 밤 슬라임 | #8a6cf0 | the grassland slime in purple (night variant) |
| night_mushroom | 밤 버섯 | #6c4bd6 | the walking mushroom with a dark violet cap (night variant) |
| night_cactus | 밤 선인장 | #3f6b3c | the cactus monster in dark green (night variant) |
| night_golem | 밤 골렘 | #5a6fb0 | the ice golem in deep navy-blue stone (night variant) |
| king_slime | 왕슬라임 (보스) | #6fd46a | a giant green slime king with a golden crown and angry eyebrows |
| king_slime_half | 중간 왕슬라임 | #8ee08a | a medium slime king (split form) with a smaller tilted crown |
| elder_treant | 고목 수호자 (보스) | #5f8f45 | an ancient walking tree guardian with a wise face in the bark and a big leafy crown |
| cactus_king | 선인장왕 (보스) | #4f9a4a | a huge cactus king with thick arms and a crown of pink flowers |
| ice_giant | 얼음 거인 (보스) | #7fc0f0 | a giant hulking ice golem with crystal spikes on its shoulders |
| night_lord | 밤의 군주 (최종 보스) | #5b3a8a | a mysterious floating lord in a flowing dark purple robe, glowing eyes, a golden halo ring above, small orbiting light orbs; elegant, not scary |

### 8-2. 주민 템플릿
```
Friendly villager portrait for the dialogue window of my game, same style as the style anchor.
Subject: {영어 설명}. Head and upper body, facing slightly to the right, warm smile, big friendly eyes,
centered, transparent background, no text. It must match the attached 3D reference "npc_{id}". File name: npc_{id}.png
```
| id | 이름 | Subject (영어) |
|---|---|---|
| dotori | 도토리 (다람쥐, 상점) | a cheerful brown squirrel shopkeeper (#c98a4b, cream belly #f4e6cf) with a big fluffy tail, holding an acorn |
| mucheol | 무쇠 (두더지, 대장장이) | a sturdy dark grey mole blacksmith (#5a5147) with a pink nose (#ff9aa8), leather apron and a small hammer |
| buheong | 부엉 박사 (부엉이) | a wise round brown owl scholar (#a07a52) with round glasses, holding a book |
| kkulbi | 꿀비 (곰, 정원사) | a gentle brown bear gardener (#b07845) wearing a straw sun hat and a yellow apron (#ffd23f) |
| haneul | 하늘 (제비, 택배) | a lively navy-blue swallow courier (#3a4a8a) with a cream chest, wearing a little cap and carrying a parcel |

---

## 9. 3D 설정화 (모델을 다시 만들 때 쓰는 참고 그림) → `art/concept/`

게임 속 3D 모델은 그림을 그대로 넣을 수 없어서, **앞·옆·뒤 3면도**를 받아 두면 3D를 다시 만들 때(제가 코드로 다듬거나, 이미지→3D AI 도구를 쓰거나) 기준이 됩니다. 우선순위: 플레이어 > 몬스터 > 포탑 > 건물.

### 9-1. 3면도 템플릿
```
Character/prop turnaround concept sheet for a low-poly 3D game model, same style as the style anchor.
Subject: {영어 설명}.
Show the SAME subject three times side by side at the same size and height: FRONT view, SIDE view (facing right), BACK view.
Neutral standing pose (T-pose not needed), arms slightly away from the body so the shapes are clear.
Simple chunky proportions suitable for low-poly 3D, flat soft shading, plain very light warm-grey background,
no text, no labels, no perspective distortion. Landscape 3:2 canvas.
```

### 9-2. 플레이어 (가장 중요)
```
Subject: the main player character — a small chibi pioneer kid, about 2.5 heads tall, big round head,
short bowl-cut brown hair (#7a4b2a) with a tiny green sprout leaf on top, simple blue tunic (#5b8def) with a belt,
brown boots, holding a short sword in the right hand. Cheerful, gender-neutral.
```
- 머리 장식 변형(같은 대화에서 이어서): `Same character, but the head accessory is {a pink flower / a red ribbon / nothing}.` → `player_acc_flower.png` 등
- 머리색 6가지(#7a4b2a #2f2a28 #e0b25a #d9674f #8fb8e8 #f2a7c3)·옷색 8가지는 게임이 색만 바꿔 입히므로 **설정화는 기본 색 1장이면 됩니다.**
- 장비 입은 모습(선택): `Same character wearing {leaf hat + grass tunic + straw shoes} holding {a bamboo spear}.`

### 9-3. 몬스터 · 포탑 · 건물
- 몬스터: 8-1 표의 영어 설명을 그대로 Subject에 넣습니다. 파일명 `monster_<id>.png`
- 포탑: 6장 표의 설명 + `Show Lv1 (plain) and Lv5 (upgraded: golden trim, 5 small stars, a little golden crown on top) side by side instead of three views.` 파일명 `turret_<id>.png`
- 기지 4단계 한 장에: `Four stages of the player's home base side by side, growing from left to right: 1) a small orange canvas tent 2) a cozy thatched hut 3) a wooden cottage with a chimney 4) a sturdy stone-and-wood fort with a flag.` 파일명 `base_stages.png`
- 부속 건물·채집 자원: 6장 표 설명 사용. 채집 자원은 `round leafy tree / pine tree / grey boulder / herb bush / tall grass clump / big desert cactus / sandstone rock / ice pillar`

---

## 10. 받은 그림 정리 방법

```
art/
  items/      <id>.png      (70)
  slots/      <slot>.png    (5)
  skills/     <id>.png      (19)
  build/      <id>.png      (15)
  ui/         win_corner.png cursor.png cursor_hand.png coin.png logo.png
  portraits/  monster_<id>.png (28)  npc_<id>.png (5)
  concept/    player.png monster_<id>.png turret_<id>.png base_stages.png ...
```
- 파일 이름은 영어 `id` 그대로(대소문자 포함). 한 글자라도 다르면 게임이 못 찾습니다.
- 크기는 1024×1024 그대로 주셔도 됩니다. 줄이기·여백 맞추기·용량 줄이기는 제가 일괄로 합니다.
- 배경이 투명하지 않게 나온 그림은 따로 알려 주세요(제가 배경을 지우거나 다시 요청).
