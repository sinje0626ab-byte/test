# 월드·캐릭터 3D 시안 요청 (ChatGPT) — 건물 시안과 같은 그림체

건물 시안(`incoming/concept_bases.webp`)을 **스타일 기준**으로 첨부하고, 아래 프롬프트를 하나씩 보냅니다.
받은 그림은 이 대화에 올리면 제가 코드로 3D 모양을 만듭니다. 몬스터·주민 얼굴은 이미 있는 초상화(`src/art/portraits/`)를 보고 맞춥니다.

## 1. 환경 (지역별 나무·바위·덤불·꽃·땅)

```
Use the attached image as the exact art style reference (cozy storybook low-poly 3D look, soft cel shading,
warm colors, chunky rounded shapes, 3/4 isometric view from slightly above, plain cream background, no text).
Draw a concept sheet of environment props for my game, arranged in 4 rows (one row per region), each object separated with empty space:
Row 1 GRASSLAND: round fluffy deciduous tree (big, 3-4 leafy clumps), small round tree, flowering bush, tall grass tuft, cluster of white/yellow/pink 5-petal flowers, mossy grey boulder, small pebble group, lily pond edge with lily pads.
Row 2 FOREST: tall dark-green pine tree (layered cones), mossy old oak with roots, fern clump, red-and-brown mushroom cluster, fallen mossy log, mossy rock, blue bellflowers.
Row 3 DESERT: sandstone rock arch, layered sandstone rock, round dry bush, small cactus with a pink flower, bleached animal skull, dry grass tuft, sand dune ripple patch.
Row 4 SNOW: snow-covered pine tree, frosted round tree with icicles, ice rock with blue crystals, snowy bush, snowdrift, small frozen pond edge.
Simple readable silhouettes that could be modeled with simple 3D shapes. Same lighting from the top-left for all objects.
```

## 2. 채집물 8종 (평소 모습 + 캔 뒤 모습)

```
Same art style as the attached image (cozy storybook low-poly 3D, 3/4 isometric view, cream background, no text).
Draw a concept sheet of 8 harvestable resource nodes for my game, in 2 rows of 4. For EACH node draw two versions side by side:
the full node (left) and the harvested/depleted version (right). Each node stands on a small grass (or sand/snow) patch.
1. Round apple tree (a few red apples) → stump with a tiny sprout
2. Pine tree with amber resin drops on the trunk → pine stump
3. Grey boulder with rusty orange iron ore spots → broken rock pieces
4. Herb bush with small white flowers and round leaves → small sprouts
5. Tall fiber grass clump (long pale-green blades) → short cut grass
6. Big cactus with arms and pink flowers → small cactus stump
7. Layered sandstone rock with a glowing golden sun crystal → rubble
8. Tall ice pillar with frost crystals → cracked ice chunks
Nodes should look slightly bigger and more special than normal decoration (a tiny sparkle is fine).
```

## 3. 캐릭터 (플레이어·주민·용병 전신)

```
Same art style as the attached image (cozy storybook low-poly 3D, cute chibi proportions: big head, small round body,
short stubby limbs), cream background, no text. Draw a character turnaround sheet for my game.
Row 1: the player pioneer — front view, 3/4 view, side view, back view. Brown messy hair, simple blue tunic, brown belt,
small brown boots, holding a small wooden sword. Big friendly eyes with a highlight, rosy cheeks.
Row 2: 5 animal villagers in front 3/4 view, standing, each with their role prop:
  squirrel shopkeeper with an acorn and an apron, mole blacksmith with goggles and a small hammer,
  sleepy owl professor with round glasses and a book, bear beekeeper holding a honey pot,
  swallow courier with a small delivery satchel and cap.
Row 3: 3 hired helpers (same body as the player, different outfits) in 3/4 view:
  gatherer in a green hood with a bow and a basket, warrior in a red tunic with a small iron sword and round shield,
  repairer in an orange apron with a stone hammer and a toolbelt.
Keep shapes simple enough to rebuild with basic 3D shapes (spheres, capsules, cones).
```

## (선택) 4. 보스 4종 전신

```
Same art style as the attached image (cozy storybook low-poly 3D, 3/4 view, cream background, no text).
Draw 4 boss monsters, big and impressive but still cute, each standing on a ground patch:
King Slime (giant translucent green slime with a gold crown), Elder Treant guardian (huge mossy tree giant with glowing eyes and leaf crown),
Ice Giant (big icy rock giant with frost crystals on shoulders), Night Lord (dark purple cloaked lord with moon horns and starry cape, floating).
```
