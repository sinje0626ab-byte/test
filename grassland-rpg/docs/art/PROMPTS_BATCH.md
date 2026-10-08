# 10개씩 묶어 보내는 프롬프트 (21~137번)

`PROMPTS_READY.md` 번호 21~137을 **한 번에 최대 10개씩** 그리게 하는 프롬프트입니다. 종류(아이템·스킬·건설·몬스터·주민)가 바뀌는 곳에서는 10개가 안 돼도 끊었습니다 — 한 그림 안에 종류가 섞이면 크기와 모양이 흐트러지기 때문입니다.

**쓰는 법**
1. 기준 그림을 고정한 ChatGPT 대화에서 이어서 합니다. (몇 묶음마다 새 대화 + 첫 메시지 + `style_anchor.webp` 다시 첨부)
2. 묶음마다 적힌 **첨부 파일**(`docs/art/ref/`)을 순서대로 올립니다. 한 번에 다 안 올라가면 첨부 없이 보내도 되지만, 생김새가 덜 맞을 수 있습니다.
3. 회색 상자 글을 통째로 붙여 넣어 보냅니다.
4. 받은 그림을 이 대화에 **"묶음 N"** 이라고 적어서 올려 주세요. 나누기·이름 붙이기·배경 지우기는 제가 합니다.

**한 장에 10개라 생길 수 있는 문제와 바로 쓸 문장**

- 그림끼리 붙거나 겹침 →
```
Redraw with more empty transparent space between the objects — no object may touch or overlap another.
```
- 개수·순서가 틀림 →
```
There must be exactly the listed number of objects, in the listed order: left to right, top row first. Please redraw.
```
- 하나만 이상함 → 그 번호만 `PROMPTS_READY.md` 의 한 개짜리 프롬프트로 다시 받기

---

## 묶음 1 — 아이템 아이콘 21~30번 (10개)

21.꿀단지 · 22.불꽃 강장제 · 23.선인장 주스 · 24.귀환 두루마리 · 25.망각의 물약 · 26.골드 · 27.텐트 키트 · 28.나뭇가지 검 · 29.무쇠 검 · 30.얼음 검

첨부: `ref/item_honey_jar.png` `ref/item_fire_tonic.png` `ref/item_cactus_juice.png` `ref/item_return_scroll.png` `ref/item_forget_potion.png` `ref/item_gold.png` `ref/item_tent_kit.png` `ref/item_twig_sword.png` `ref/item_iron_sword.png` `ref/item_ice_sword.png`

```
Draw these 10 item icons for my game in ONE image, same style as the approved style anchor
(dark brown outline #3b2d22, top-left light, soft cel shading, cute and chunky, readable at 48×48 px).
The attached images are the CURRENT placeholder icons in the same order: keep each object's identity, redraw much better.

1. a round honey jar with golden honey dripping, cloth lid tied with string — main color #ffc53d, a small shine
2. a tall bottle of glowing orange-red tonic with a tiny flame emblem — main color #ff7b3d, a small shine
3. a tall glass of green cactus juice with a straw and a cactus slice — main color #8fd46a, a small shine
4. a rolled parchment scroll with a red wax seal and a soft magic glow — main color #e9dcb0, a small shine
5. a round purple potion with swirling misty stars inside — main color #9a7fe0, a subtle magical sparkle
6. a small stack of shiny gold coins — main color #ffd23f
7. a folded orange canvas tent bundle with poles, tied with rope — main color #e9a35b, a small shine
8. a simple sword carved from a sturdy tree branch, wrapped grip — main color #b88452, plain, no glow
9. a sturdy iron sword with a brown leather grip and simple crossguard — main color #c9d3dd, a small shine
10. a sword with a translucent ice-crystal blade and a frosty guard — main color #9fd8ff, a subtle magical sparkle

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: honey_jar fire_tonic cactus_juice return_scroll forget_potion gold tent_kit twig_sword iron_sword ice_sword -->

---

## 묶음 2 — 아이템 아이콘 31~40번 (10개)

31.태양 검 · 32.왕젤리 대검 · 33.새벽검 · 34.대나무 창 · 35.무쇠 창 · 36.전갈 꼬리 창 · 37.서리 창 · 38.돌망치 · 39.이끼 철퇴 · 40.사암 망치

첨부: `ref/item_sun_blade.png` `ref/item_jelly_greatsword.png` `ref/item_dawn_blade.png` `ref/item_bamboo_spear.png` `ref/item_iron_spear.png` `ref/item_scorpion_pike.png` `ref/item_frost_lance.png` `ref/item_stone_hammer.png` `ref/item_mossy_mace.png` `ref/item_sandstone_maul.png`

```
Draw these 10 item icons for my game in ONE image, same style as the approved style anchor
(dark brown outline #3b2d22, top-left light, soft cel shading, cute and chunky, readable at 48×48 px).
The attached images are the CURRENT placeholder icons in the same order: keep each object's identity, redraw much better.

1. a golden sword with a sun crystal set in the guard, warm glow — main color #ffd23f, a subtle magical sparkle
2. a big greatsword with a translucent green jelly blade and a tiny crown pommel — main color #8ee08a, glowing accents and a few sparkles
3. an elegant sword whose blade glows orange-pink like dawn light, golden guard, light rays — main color #ffa53d, radiant warm glow with golden details
4. a long bamboo spear with a simple sharpened tip — main color #c9d68a, plain, no glow
5. a spear with a wooden shaft and a leaf-shaped iron head — main color #c9d3dd, a small shine
6. a pike whose head is a curved orange scorpion stinger, a drop of purple poison — main color #b35e2c, a subtle magical sparkle
7. a lance with an icy crystal spearhead and frost wisps — main color #9fd8ff, a subtle magical sparkle
8. a chunky stone hammer head tied to a wooden handle with rope — main color #a9adb6, plain, no glow
9. a round iron mace head covered in green moss, wooden handle — main color #6f9a5a, a small shine
10. a huge maul made from a carved orange sandstone block — main color #e0a86a, a subtle magical sparkle

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: sun_blade jelly_greatsword dawn_blade bamboo_spear iron_spear scorpion_pike frost_lance stone_hammer mossy_mace sandstone_maul -->

---

## 묶음 3 — 아이템 아이콘 41~50번 (10개)

41.빙하 망치 · 42.짧은 활 · 43.사냥꾼 활 · 44.모래바람 활 · 45.오로라 활 · 46.고목심 활 · 47.풀잎 모자 · 48.버섯 모자 · 49.사막 두건 · 50.털모자

첨부: `ref/item_glacier_hammer.png` `ref/item_short_bow.png` `ref/item_hunter_bow.png` `ref/item_dune_bow.png` `ref/item_aurora_bow.png` `ref/item_heartwood_bow.png` `ref/item_leaf_hat.png` `ref/item_mushroom_hat.png` `ref/item_desert_hood.png` `ref/item_fur_hat.png`

```
Draw these 10 item icons for my game in ONE image, same style as the approved style anchor
(dark brown outline #3b2d22, top-left light, soft cel shading, cute and chunky, readable at 48×48 px).
The attached images are the CURRENT placeholder icons in the same order: keep each object's identity, redraw much better.

1. a heavy hammer with a big blue glacier-ice head — main color #7fc0f0, a subtle magical sparkle
2. a small simple wooden bow with string — main color #b88452, plain, no glow
3. a sturdy dark-wood hunting bow with leather grip wrap — main color #8a6440, a small shine
4. a bow made of golden desert wood with sand-swirl patterns — main color #e9b44f, a subtle magical sparkle
5. a bow with a shimmering lavender-to-cyan aurora gradient — main color #b8a0ff, a subtle magical sparkle
6. a bow carved from ancient heartwood with tiny leaves sprouting, faint green glow — main color #9a6a45, glowing accents and a few sparkles
7. a cute hat woven from one big green leaf — main color #7ccf6a, plain, no glow
8. a soft red mushroom-cap hat with white spots — main color #e0574f, a small shine
9. a sand-colored desert hood with a face wrap — main color #e9a35b, a subtle magical sparkle
10. a fluffy white fur hat with ear flaps and a pompom — main color #f2f2f2, a subtle magical sparkle

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: glacier_hammer short_bow hunter_bow dune_bow aurora_bow heartwood_bow leaf_hat mushroom_hat desert_hood fur_hat -->

---

## 묶음 4 — 아이템 아이콘 51~60번 (10개)

51.선인장왕의 왕관 · 52.말랑 왕관 · 53.풀잎 옷 · 54.가죽 조끼 · 55.사막 망토 · 56.설인 털옷 · 57.짚신 · 58.가죽 장화 · 59.모래 샌들 · 60.설원 부츠

첨부: `ref/item_cactus_crown.png` `ref/item_royal_jelly_crown.png` `ref/item_grass_tunic.png` `ref/item_leather_vest.png` `ref/item_desert_cloak.png` `ref/item_yeti_coat.png` `ref/item_straw_shoes.png` `ref/item_leather_boots.png` `ref/item_sand_sandals.png` `ref/item_snow_boots.png`

```
Draw these 10 item icons for my game in ONE image, same style as the approved style anchor
(dark brown outline #3b2d22, top-left light, soft cel shading, cute and chunky, readable at 48×48 px).
The attached images are the CURRENT placeholder icons in the same order: keep each object's identity, redraw much better.

1. a crown made of small cacti with a pink flower on top — main color #ff5f8f, glowing accents and a few sparkles
2. a squishy pink jelly crown with soft rounded points — main color #ffb3d9, glowing accents and a few sparkles
3. a short tunic woven from green grass and leaves — main color #8fce6a, plain, no glow
4. a brown leather vest with stitches and a small buckle — main color #a86f45, a small shine
5. a thick sand-orange cloak with a hood and patterned trim — main color #e9a35b, a subtle magical sparkle
6. a puffy white yeti-fur coat with light blue trim — main color #e6f2fa, a subtle magical sparkle
7. a pair of woven straw sandals — main color #e8cf8a, plain, no glow
8. a pair of brown leather boots with laces — main color #8a5a3a, a small shine
9. a pair of light desert sandals with cloth straps — main color #e8cf8a, a subtle magical sparkle
10. a pair of padded snow boots with fur cuffs — main color #b9dcf2, a subtle magical sparkle

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: cactus_crown royal_jelly_crown grass_tunic leather_vest desert_cloak yeti_coat straw_shoes leather_boots sand_sandals snow_boots -->

---

## 묶음 5 — 아이템 아이콘 61~70번 (10개)

61.네잎클로버 반지 · 62.젤리 부적 · 63.눈꽃 부적 · 64.거인의 심장 · 65.꿀벌 반지 · 66.토끼발 부적 · 67.포자 목걸이 · 68.요정 등불 · 69.고목의 씨앗 · 70.박사의 돋보기

첨부: `ref/item_clover_ring.png` `ref/item_jelly_charm.png` `ref/item_snow_charm.png` `ref/item_giant_heart.png` `ref/item_bee_ring.png` `ref/item_rabbit_foot.png` `ref/item_spore_pendant.png` `ref/item_wisp_lantern.png` `ref/item_treant_seed.png` `ref/item_doctor_lens.png`

```
Draw these 10 item icons for my game in ONE image, same style as the approved style anchor
(dark brown outline #3b2d22, top-left light, soft cel shading, cute and chunky, readable at 48×48 px).
The attached images are the CURRENT placeholder icons in the same order: keep each object's identity, redraw much better.

1. a gold ring with a four-leaf clover gem — main color #5fd48a, a subtle magical sparkle
2. a purple jelly drop charm on a cord — main color #8a6cf0, a small shine
3. a round glass charm with a snowflake inside — main color #dff3ff, a subtle magical sparkle
4. an ice-blue heart-shaped crystal pendant that glows warmly inside — main color #7fc0f0, glowing accents and a few sparkles
5. a gold ring with a tiny striped bee on it — main color #ffd23f, a small shine
6. a fluffy white rabbit-foot lucky charm on a string — main color #ffffff, a small shine
7. a necklace with a small purple mushroom pendant — main color #b88ae0, a small shine
8. a tiny hanging lantern with a glowing cyan fairy light inside — main color #9fe8ff, a subtle magical sparkle
9. a big acorn-like seed with a green sprout, faint glow, on a cord — main color #6fae4a, glowing accents and a few sparkles
10. an antique brass magnifying glass with an ornate handle — main color #c9a44a, glowing accents and a few sparkles

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: clover_ring jelly_charm snow_charm giant_heart bee_ring rabbit_foot spore_pendant wisp_lantern treant_seed doctor_lens -->

---

## 묶음 6 — 스킬 배지 71~80번 (10개)

71.힘 · 72.연속 베기 · 73.회전 공격 · 74.급소 찌르기 · 75.무기 숙련 · 76.돌진 베기 · 77.손놀림 · 78.회복력 · 79.알뜰 채집 · 80.가벼운 발

첨부: `ref/skill_power.png` `ref/skill_combo.png` `ref/skill_whirl.png` `ref/skill_crit.png` `ref/skill_weapon_master.png` `ref/skill_dash_slash.png` `ref/skill_gatherSpeed.png` `ref/skill_vitality.png` `ref/skill_gatherAmount.png` `ref/skill_swift.png`

```
Draw these 10 round skill badges for my game in ONE image, same style as the approved style anchor.
Each badge: a circular medallion in its branch color with a slightly darker rim and a glossy upper-left highlight,
and a bold WHITE symbol in the middle. All badges the same size. Readable at 40×40 px.
The attached images are the CURRENT badges in the same order: keep each idea, redraw much better.

1. coral red #ff8a7a badge with a white symbol: a raised sword with a burst of power
2. coral red #ff8a7a badge with a white symbol: two quick parallel slash marks
3. coral red #ff8a7a badge with a white symbol: a circular spinning slash arrow
4. coral red #ff8a7a badge with a white symbol: a sharp star burst hitting a target point
5. coral red #ff8a7a badge with a white symbol: crossed sword and spear
6. coral red #ff8a7a badge with a white symbol: a forward-dashing arrow with speed lines
7. leaf green #7cc67a badge with a white symbol: a pickaxe with motion lines
8. leaf green #7cc67a badge with a white symbol: a heart with a small plus
9. leaf green #7cc67a badge with a white symbol: two stacked resource pebbles with a plus
10. leaf green #7cc67a badge with a white symbol: a winged boot

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: power combo whirl crit weapon_master dash_slash gatherSpeed vitality gatherAmount swift -->

---

## 묶음 7 — 스킬 배지 81~89번 (9개)

81.두꺼운 가죽 · 82.약초꾼 · 83.응급 처치 · 84.절약 · 85.포탑 정비 · 86.진지 확장 · 87.석공 · 88.명사수 포탑 · 89.포탑 과부하

첨부: `ref/skill_thick_skin.png` `ref/skill_forager.png` `ref/skill_first_aid.png` `ref/skill_thrift.png` `ref/skill_turretPower.png` `ref/skill_turretCount.png` `ref/skill_mason.png` `ref/skill_sharpshooter.png` `ref/skill_overclock.png`

```
Draw these 9 round skill badges for my game in ONE image, same style as the approved style anchor.
Each badge: a circular medallion in its branch color with a slightly darker rim and a glossy upper-left highlight,
and a bold WHITE symbol in the middle. All badges the same size. Readable at 40×40 px.
The attached images are the CURRENT badges in the same order: keep each idea, redraw much better.

1. leaf green #7cc67a badge with a white symbol: a sturdy shield
2. leaf green #7cc67a badge with a white symbol: a leafy herb sprig
3. leaf green #7cc67a badge with a white symbol: a medical cross
4. warm orange #e9a35b badge with a white symbol: a coin with a downward arrow
5. warm orange #e9a35b badge with a white symbol: a small turret with a wrench
6. warm orange #e9a35b badge with a white symbol: two small turrets with a plus
7. warm orange #e9a35b badge with a white symbol: stacked bricks
8. warm orange #e9a35b badge with a white symbol: a crosshair target
9. warm orange #e9a35b badge with a white symbol: a lightning bolt

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: thick_skin forager first_aid thrift turretPower turretCount mason sharpshooter overclock -->

---

## 묶음 8 — 건설 아이콘 90~99번 (10개)

90.나무 활 포탑 · 91.석궁 포탑 · 92.총 포탑 · 93.대포 포탑 · 94.독침 포탑 · 95.서리 포탑 · 96.작업대 · 97.창고 · 98.상점 · 99.모닥불

첨부: `ref/build_wood_bow.png` `ref/build_crossbow.png` `ref/build_gun.png` `ref/build_cannon.png` `ref/build_poison_thrower.png` `ref/build_frost_tower.png` `ref/build_workbench.png` `ref/build_storage.png` `ref/build_shop.png` `ref/build_campfire.png`

```
Draw these 10 build-menu icons for my game in ONE image, same style as the approved style anchor.
Each is a cute miniature diorama, 3/4 view from slightly above, standing on a small patch of ground with a soft shadow.
The attached images are the CURRENT icons in the same order: keep each idea, redraw much better.

1. a small wooden watch-post turret with a mounted wooden bow on top
2. a stone-based turret with a big iron crossbow on a wooden mount
3. an iron turret with a short rapid-fire gun barrel and a brass sight
4. a dark iron cannon on a wooden wheeled carriage
5. a wooden turret topped by a green bulb launcher dripping poison
6. a blue stone pedestal holding a floating glowing ice crystal
7. a sturdy wooden workbench with a saw and a hammer on it
8. a big wooden storage chest/shed with a brass lock
9. a tiny market stall with a red-and-white striped awning and goods
10. a cozy campfire with crossed logs and a ring of stones

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: wood_bow crossbow gun cannon poison_thrower frost_tower workbench storage shop campfire -->

---

## 묶음 9 — 건설 아이콘 100~104번 (5개)

100.텃밭 · 101.대장간 · 102.게시판 · 103.나무 울타리 · 104.돌담

첨부: `ref/build_garden.png` `ref/build_forge.png` `ref/build_board.png` `ref/build_wall.png` `ref/build_stone_wall.png`

```
Draw these 5 build-menu icons for my game in ONE image, same style as the approved style anchor.
Each is a cute miniature diorama, 3/4 view from slightly above, standing on a small patch of ground with a soft shadow.
The attached images are the CURRENT icons in the same order: keep each idea, redraw much better.

1. a small wooden planter box with young green sprouts
2. a stone furnace with glowing fire and an anvil next to it
3. a wooden notice board with pinned paper notes
4. a short section of pointed wooden palisade fence
5. a short section of mossy stone-brick wall

Layout: a clean grid of 5 columns × 1 row, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: garden forge board wall stone_wall -->

---

## 묶음 10 — 몬스터 초상화 105~114번 (10개)

105.초원 슬라임 · 106.모래 슬라임 · 107.눈 슬라임 · 108.큰 슬라임 · 109.숲 버섯 · 110.포자 버섯 · 111.선인장 몬스터 · 112.붕붕벌 · 113.뿔토끼 · 114.가시 늑대

첨부: `ref/monster_slime.png` `ref/monster_sand_slime.png` `ref/monster_snow_slime.png` `ref/monster_big_slime.png` `ref/monster_mushroom.png` `ref/monster_spore_puff.png` `ref/monster_cactus.png` `ref/monster_bee.png` `ref/monster_horn_rabbit.png` `ref/monster_thorn_wolf.png`

```
Draw these 10 monster portraits for my game in ONE image, same style as the approved style anchor.
Cute and round, big expressive eyes, whole body visible, 3/4 view facing slightly left, soft contact shadow, never scary.
The attached images are the 3D in-game models in the same order: each portrait must clearly match its model.

1. a round squishy green slime blob with small dot eyes and a happy face — main color #57c95a
2. a round sandy-yellow slime with grains of sand on it — main color #e8c872
3. a round pale icy-white slime with a frosty top — main color #dff3ff
4. a large plump green slime, heavier and wobblier — main color #4fbf52
5. a walking mushroom with a red white-spotted cap and stubby legs — main color #e0574f
6. a purple puffball mushroom puffing little spore clouds — main color #9a6cd6
7. a cute standing cactus with arms, small eyes and a pink flower on top — main color #5fa85a
8. a chubby round yellow-and-black striped bee with tiny wings and a stinger — main color #ffd23f
9. a fluffy white rabbit with one small horn on its forehead — main color #ffffff
10. a small green wolf with thorny bramble fur on its back — main color #5f8f55

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: slime sand_slime snow_slime big_slime mushroom spore_puff cactus bee horn_rabbit thorn_wolf -->

---

## 묶음 11 — 몬스터 초상화 115~124번 (10개)

115.그루터기 괴물 · 116.모래 전갈 · 117.모래 두더지 · 118.굴렁 덤불 · 119.얼음 골렘 · 120.눈꽃 요정 · 121.설인 새끼 · 122.눈사람 폭탄 · 123.밤 슬라임 · 124.밤 버섯

첨부: `ref/monster_stump.png` `ref/monster_scorpion.png` `ref/monster_sand_mole.png` `ref/monster_tumble.png` `ref/monster_ice_golem.png` `ref/monster_frost_wisp.png` `ref/monster_yeti_cub.png` `ref/monster_snow_bomber.png` `ref/monster_night_slime.png` `ref/monster_night_mushroom.png`

```
Draw these 10 monster portraits for my game in ONE image, same style as the approved style anchor.
Cute and round, big expressive eyes, whole body visible, 3/4 view facing slightly left, soft contact shadow, never scary.
The attached images are the 3D in-game models in the same order: each portrait must clearly match its model.

1. a living tree stump with a grumpy face and leafy sprouts on top — main color #8a6440
2. an orange desert scorpion with big pincers and a curled stinger — main color #c9803f
3. a brown mole with a pink nose popping out of a sand mound — main color #9a6a45
4. a rolling tumbleweed ball with two little eyes peeking out — main color #b59a5a
5. a chunky blocky golem made of light-blue ice blocks — main color #9fd3ff
6. a tiny floating ice fairy with snowflake wings, flying — main color #bfeaff
7. a round fluffy white baby yeti with a blue-grey face — main color #f4f7fb
8. a small snowman with a smiling coal face, carrying a lit round bomb — main color #ffffff
9. the grassland slime in purple (night variant) — main color #8a6cf0 (NIGHT variant: slightly darker purple-blue tint, softly glowing eyes, two tiny light motes floating around)
10. the walking mushroom with a dark violet cap (night variant) — main color #6c4bd6 (NIGHT variant: slightly darker purple-blue tint, softly glowing eyes, two tiny light motes floating around)

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: stump scorpion sand_mole tumble ice_golem frost_wisp yeti_cub snow_bomber night_slime night_mushroom -->

---

## 묶음 12 — 몬스터 초상화 125~132번 (8개)

125.밤 선인장 · 126.밤 골렘 · 127.왕슬라임 (보스) · 128.중간 왕슬라임 · 129.고목 수호자 (보스) · 130.선인장왕 (보스) · 131.얼음 거인 (보스) · 132.밤의 군주 (최종 보스)

첨부: `ref/monster_night_cactus.png` `ref/monster_night_golem.png` `ref/monster_king_slime.png` `ref/monster_king_slime_half.png` `ref/monster_elder_treant.png` `ref/monster_cactus_king.png` `ref/monster_ice_giant.png` `ref/monster_night_lord.png`

```
Draw these 8 monster portraits for my game in ONE image, same style as the approved style anchor.
Cute and round, big expressive eyes, whole body visible, 3/4 view facing slightly left, soft contact shadow, never scary.
The attached images are the 3D in-game models in the same order: each portrait must clearly match its model.

1. the cactus monster in dark green (night variant) — main color #3f6b3c (NIGHT variant: slightly darker purple-blue tint, softly glowing eyes, two tiny light motes floating around)
2. the ice golem in deep navy-blue stone (night variant) — main color #5a6fb0 (NIGHT variant: slightly darker purple-blue tint, softly glowing eyes, two tiny light motes floating around)
3. a giant green slime king with a golden crown and angry eyebrows — main color #6fd46a (BOSS: bigger presence, ornate, confident, subtle aura)
4. a medium slime king (split form) with a smaller tilted crown — main color #8ee08a (BOSS: bigger presence, ornate, confident, subtle aura)
5. an ancient walking tree guardian with a wise face in the bark and a big leafy crown — main color #5f8f45 (BOSS: bigger presence, ornate, confident, subtle aura)
6. a huge cactus king with thick arms and a crown of pink flowers — main color #4f9a4a (BOSS: bigger presence, ornate, confident, subtle aura)
7. a giant hulking ice golem with crystal spikes on its shoulders — main color #7fc0f0 (BOSS: bigger presence, ornate, confident, subtle aura)
8. a mysterious floating lord in a flowing dark purple robe, glowing eyes, a golden halo ring above, small orbiting light orbs; elegant, not scary — main color #5b3a8a (BOSS: bigger presence, ornate, confident, subtle aura)

Layout: a clean grid of 5 columns × 2 rows, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: night_cactus night_golem king_slime king_slime_half elder_treant cactus_king ice_giant night_lord -->

---

## 묶음 13 — 주민 초상화 133~137번 (5개)

133.도토리 (다람쥐, 상점) · 134.무쇠 (두더지, 대장장이) · 135.부엉 박사 (부엉이) · 136.꿀비 (곰, 정원사) · 137.하늘 (제비, 택배)

첨부: `ref/npc_dotori.png` `ref/npc_mucheol.png` `ref/npc_buheong.png` `ref/npc_kkulbi.png` `ref/npc_haneul.png`

```
Draw these 5 friendly villager portraits for my game in ONE image, same style as the approved style anchor.
Head and upper body, facing slightly to the right, warm smile, big friendly eyes.
The attached images are the 3D in-game models in the same order: each portrait must clearly match its model.

1. a cheerful brown squirrel shopkeeper (#c98a4b, cream belly #f4e6cf) with a big fluffy tail, holding an acorn
2. a sturdy dark grey mole blacksmith (#5a5147) with a pink nose (#ff9aa8), leather apron and a small hammer
3. a wise round brown owl scholar (#a07a52) with round glasses, holding a book
4. a gentle brown bear gardener (#b07845) wearing a straw sun hat and a yellow apron (#ffd23f)
5. a lively navy-blue swallow courier (#3a4a8a) with a cream chest, wearing a little cap and carrying a parcel

Layout: a clean grid of 5 columns × 1 row, in exactly this order (left to right, top row first).
Every object the same size in its own cell, centered, with wide empty space between cells — objects must never touch or overlap.
Fully transparent background (no white), no frames, no circles behind icons (except the skill badges themselves), NO text, NO numbers, NO labels.
```

<!-- ids: dotori mucheol buheong kkulbi haneul -->
