# 챗GPT 새 세션 설정 (2부 9장부터)

그림 한 장마다 새 세션을 열고, 아래 그림 5장을 첨부해 「설정 메시지」를 먼저 보낸다.
"Ready"가 오면 그 쪽의 프롬프트(`9-1: ...`)를 보낸다.

## 첨부 5장

| 파일 | 무엇 |
|---|---|
| `cabinet-sheet.webp` | 국무위원 원본 시트 (종, 의상, 소품의 세부) |
| `part2-cast.jpg` | 2부에서 실제로 그린 인물 9명 (얼굴, 체형, 그림체) |
| `humans-who-is-who.jpg` | 사람 3명 구분 (김만우, 최무현, 심진우) |
| `ch4-style.jpg` | 2부 그림체와 대극장 |
| `flag.png` | 국기 |
| `aeguk-jwasu-uniform.png` | 애국좌수 교정 유니폼(3부부터). 애국좌수가 나오는 쪽에 첨부 |
| `minju-simin-profile.jpg` | 민주시민 원본 모습(국무위원 시트에서 확대). 대통령이 나오는 쪽에 함께 첨부 |

## 설정 메시지

```text
You are the illustrator of Part 2 of the Korean picture book "Long Live the Memorial Republic" (영원하라 추모공화국). In this conversation you will draw ONE page. First read and lock everything below. Do not draw yet - reply only "Ready". Then I will send the page.

=== ATTACHED REFERENCES ===
- cabinet-sheet.webp: the official cabinet members. Use it for each member's species, fur colors, clothing details and small accessories.
- part2-cast.jpg: how the characters actually look in Part 2 of this book. Copy their faces, body shapes and proportions exactly. When it differs from cabinet-sheet.webp, part2-cast.jpg wins.
- humans-who-is-who.jpg: the only three human characters.
- ch4-style.jpg: the art style.
- flag.png: the national flag.
- aeguk-jwasu-uniform.png (when attached): Aeguk-jwasu's corrections uniform.
- minju-simin-profile.jpg (when attached): the President's official look - copy his face exactly.
The name labels in the reference sheets are only for you. Never draw them.

=== ART STYLE ===
The polished, cinematic animated-storybook look of ch4-style.jpg and part2-cast.jpg: soft rounded 3D-like rendering, fluffy detailed fur, glossy eyes, rich warm and deep lighting, detailed backgrounds. Every character is a cute anthropomorphic animal in clothes, with a big head and very expressive face and body language. Mood: a political drama told as a dark, funny storybook. NOT a 2D pencil sketch, NOT a bright candy-colored game show, NOT photorealistic.
FORMAT: one VERTICAL portrait image, 2:3 (1024x1536).

=== MAIN CHARACTERS (keep every detail) ===
- Minju-simin (the President): a bright-yellow RUBBER-DUCK. Smooth glossy yellow head that is huge and perfectly round (about as big as the torso), a small tuft of feathers on top, small black oval dot eyes, a wide flat orange bill. Short chubby body. Navy two-button suit, white shirt, blue tie, and a small YELLOW RIBBON folded into a loop pinned on the LEFT lapel (always visible). Yellow wing-hands with fingers, navy trousers, shiny black shoes. A calm, neutral, dignified expression by default (only change it when the page asks). The head is a smooth matte rubber-duck toy head with NO eyebrows and NO eyelids - see minju-simin-profile.jpg. NEVER eyelashes, makeup, lipstick, jewelry or a pearl necklace. Not a baby chick, no big cartoon eyes with colored irises. In an office he sits IN his chair behind the desk, never on top of the desk.
- Ttalgi (Chief of Strategy): a chubby, round, fluffy pure-white BOY cat with a big round head, big round green eyes, a small pink nose, pink-lined ears and long white whiskers. NO eyelashes, nothing feminine. Charcoal-grey suit, white shirt, bright red tie, usually a tablet. Cute round shape but a cool, calculating expression.
- Hamji (Chief of Staff): a plump orange-and-white hamster with big round cheeks, round pink-lined ears, a pink nose and short pink feet. Grey three-piece suit with vest, white shirt, blue tie, pocket square. Gold duck-face badges on the chest. Since Chapter 4, three fingers are wrapped in bandages. Soft gentle face, but the eyes glow with fanatical devotion.
- Chumo-yeolsa (Intelligence Director): a fluffy brown teddy bear with a tan muzzle, small black button eyes and a permanently blank face. Grey suit, white shirt, navy tie with tiny dots, brown shoes. Holds ONLY a tablet: no envelope, no folder, no papers.
- Chumo-hamnido: a tall dark-grey wolf with amber eyes and a dark muzzle. Navy three-piece suit, black tie, white pocket square, often clutching newspapers. Hot-tempered.
- Deul-neoguri (Rapper and Minister of Memorial Culture): a big black gorilla with a gentle face, black suit and tie, gold rings. His heavy gold chain is now kept by Chumo-tusu, so do NOT draw a chain on him.
- Aeguk-jwasu (Director of the Corrections Bureau): a grey wolf. From Part 3 he ALWAYS wears his corrections uniform exactly as aeguk-jwasu-uniform.png: grey camouflage quilted winter jacket with thick fur collar and cuffs, a thick grey knitted scarf, sleeve patch, utility belt with pouches, dark grey cargo trousers, fur-trimmed brown combat boots and a black baton. NO suit, NO gloves (ignore the suit version in part2-cast.jpg). Extremely polite smile, manic glint in the eyes.
- Benesu-hoja: a dark-grey rabbit with long upright ears in a black tactical police uniform and boots, holding a black baton, with a green-and-red parrot on the LEFT shoulder.
- Bukanistan: a white horse with a long flowing white mane, a black cowboy hat and a navy suit with tie, RIDING another white horse with a leather bridle.
- Eoheung: a chubby tiger in a dark brown suit, white shirt and blue tie, paws clasped in front, striped tail showing.
- Chumo-daejang (MC, elder): a grey elephant with big floppy pink-lined ears and a long trunk. NO hair, NO suspenders, NO belt. A plain sky-blue #439ED5 T-shirt with only the big white Korean letters '추모대장' on the chest, dark navy trousers, and a silver whistle on a cord. A huge permanent grin with sharp eyes.
- Bui (elder): a very old tortoise with a shell, long white eyebrows and a long white beard, a navy-blue Korean durumagi coat and a wooden cane. Calm and quiet.
- Chumo-tusu: a bright-eyed sea otter in a beige suit with a small baseball-glove pin. Always the first to raise a paw. Now carries Deul-neoguri's gold chain.
- Lee Gija: a shaggy brown sloth in a wrinkled white shirt with a crooked tie and a battered briefcase.
- Hai: a sleepy grey koala in a rumpled suit with a loose tie, always yawning.
- Meerkat aides (Ttalgi's staff): small meerkats in grey suits. Chipmunk aides (Hamji's staff): chipmunks in grey vests. Doberman bodyguards: black suits and sunglasses. Prison guards: burly bulldogs in dark police uniforms and caps.
- All other extras and audience members are animals in clothes. Never draw any other human.

=== HUMAN CHARACTERS (humans-who-is-who.jpg) ===
Three different people. Never mix their faces, hair or clothes, and draw only the humans the page names.
- KIM MANWOO (left): messy spiky black hair, a big goofy grin, NO glasses, a navy-blue quilted puffer jacket, loose blue jeans and sneakers.
- CHOI MUHYEON (middle), former PR Chief: neat side-parted black hair, thin rectangular glasses, a light-blue button shirt, dark trousers and a brown shoulder-bag strap. Only he wears a lanyard with a name-card wallet.
- SIM JINWOO (right): messy brown hair, round glasses, a plain white button shirt and dark trousers. NO lanyard, NO bag.

=== THE NATIONAL EMBLEM - USE IT RARELY ===
The emblem (copy flag.png exactly: navy field, thin gold border, golden crescent arcs, a gold candle with a flame, a white swirl curling around its right side, a white lotus at the bottom, three white leaves on each side; never an eagle, paw print, building, star or crown) appears ONLY where a national symbol truly belongs:
- a real flag on a pole, at most one or two, and only in formal state places such as the President's office or the State Council room
- the front of an official podium at a national ceremony
- an official government seal on a document, when the page asks for it
Do NOT put the emblem anywhere else: no emblem on mugs, cups, chairs, sofas, desks, carpets, curtains, walls, lamps, books, notebooks, tablets, phones, buttons, ties, pins, envelopes, boxes, buzzers, trophies, LED screens or stage decorations. Most pages should have NO flag and NO emblem at all. Only draw one when the page asks for a flag or a formal state setting clearly needs one.

=== TEXT ===
No readable text, letters, numbers, captions, signs or name labels, except the white letters '추모대장' on Chumo-daejang's T-shirt, or a word the page prompt explicitly asks for. Screens and papers show only simple icons and abstract squiggles.

=== TONE ===
Dark political satire told with warmth and humor. Any rough moment is harmless cartoon slapstick (motion lines, comic stars, puffs, sweat drops). No blood, no injury, nothing graphic.

Reply only "Ready".
```

## 쪽 보내기

"Ready"가 오면 그 쪽의 프롬프트 하나를 그대로 보낸다. 잘못 나오면 같은 세션에서:

```text
Redo. Keep the composition, but fix: <고칠 점>. Follow the locked rules (characters from part2-cast.jpg, emblem only where it truly belongs).
```
