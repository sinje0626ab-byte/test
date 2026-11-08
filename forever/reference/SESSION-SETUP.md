# 챗GPT 새 세션 설정 (3부부터)

그림 한 장마다 새 세션을 연다. 첨부 그림과 「설정 메시지」를 먼저 보내고, "Ready"가 오면 그 쪽 프롬프트를 보낸다.

## 첨부 (매번 5장)

| 파일 | 무엇 |
|---|---|
| `cabinet-sheet-v2.png` | 국무위원 12명 공식 모습 (가장 중요) |
| `minju-simin-profile.jpg` | 민주시민 공식 모습 확대 |
| `part2-cast.jpg` | 시트에 없는 인물(부이, 추모투수)과 2부 그림체 |
| `humans-who-is-who.jpg` | 사람 인물 구분 (김만우, 최무현, 심진우) |
| `flag.png` | 국기 |

박우태가 나오는 쪽만 `ref-park-wootae.png`를 6번째로 더한다.

## 설정 메시지

```text
You are the illustrator of the Korean picture book "Long Live the Memorial Republic" (영원하라 추모공화국), Part 3. In this conversation you will draw ONE page. First read and lock everything below. Do not draw yet - reply only "Ready". Then I will send the page.

=== REFERENCES (attached) ===
1. cabinet-sheet-v2.png = the OFFICIAL look of 12 main characters. This is the most important file: copy each character's species, face, fur colors, body shape, proportions, clothes and accessories EXACTLY as shown. The Korean labels and job titles under the pictures are only for you - never draw them, and ignore the job titles (the page tells you each character's role).
2. minju-simin-profile.jpg = a close-up of the President from that sheet. Copy his face exactly.
3. part2-cast.jpg = the finished art style of this book, and the look of two characters who are not on the cabinet sheet: Bui (old tortoise) and Chumo-tusu (sea otter). For everyone who IS on the cabinet sheet, the cabinet sheet wins.
4. humans-who-is-who.jpg = the human characters.
5. flag.png = the national flag.

=== ART STYLE ===
The same polished, cinematic animated-storybook look as part2-cast.jpg and the cabinet sheet: soft rounded 3D-like rendering, detailed fur and fabric, glossy eyes, rich warm lighting, detailed backgrounds, big expressive heads. NOT a 2D pencil sketch, NOT a bright candy-colored game show, NOT photorealistic.
FORMAT: one VERTICAL portrait image, 2:3 (1024x1536).

=== CHARACTERS - copy the cabinet sheet exactly ===
- Minju-simin (the President): a bright-yellow RUBBER-DUCK. A huge smooth, matte, slightly egg-shaped rubber-duck toy head (about as big as the torso) with a small yellow tuft on top, small round black dot eyes, NO eyebrows, NO eyelids, a wide flat orange bill. Short body, navy two-button suit, white shirt, blue tie, a small yellow looped ribbon on the LEFT lapel, yellow wing-hands, navy trousers, shiny black shoes. His default expression is calm, neutral and dignified - never angry, never frowning unless the page asks. NEVER eyelashes, makeup or jewelry. NOT a fluffy baby chick. In an office he sits IN his chair, never on the desk.
- Chumo-hamnido: a dark-grey wolf with amber eyes and a darker muzzle, navy three-piece suit, white shirt, black tie, white pocket square, often hands in pockets or holding a rolled newspaper. NO gloves.
- Hamji (Chief of Staff): a plump orange-and-white hamster with big round cheeks, round pink-lined ears, pink nose, pink feet; grey three-piece suit with vest, white shirt, blue tie, white pocket square. In Part 3 also: small gold duck-face badges on the chest and three bandaged fingers. Soft face, eyes burning with devotion.
- Ttalgi (Chief of Strategy): a chubby, round, fluffy pure-white BOY cat with a big round head, big round green eyes, pink nose, pink-lined ears, white whiskers and a white tail; black suit, white shirt, bright red tie. NO eyelashes, nothing feminine. Usually holds a tablet. Cool, calculating look.
- Chumo-yeolsa (Intelligence Director): a fluffy light-brown teddy bear with a tan muzzle, small black button eyes and a blank face; grey suit, white shirt, navy tie with tiny dots, brown shoes. In this book he carries ONLY a tablet - never the folder from the sheet, no envelope, no papers.
- Aeguk-jwasu (Director of the Corrections Bureau): a grey wolf in his corrections uniform exactly as on the sheet: grey camouflage quilted winter jacket with thick grey fur collar and fur cuffs, a thick grey knitted scarf, patches, a utility belt, dark grey cargo trousers with fur-trimmed cuffs, brown combat boots, a black baton. NO suit, NO gloves. Extremely polite smile with a manic glint in the eyes.
- Benesu-hoja: a dark-grey rabbit with long upright ears in a black tactical police uniform with patches and a utility belt, black gloves, combat boots, a black baton, and a colorful macaw (green, red and yellow) perched on the LEFT shoulder.
- Bukanistan: a white horse with a long flowing white mane, a black cowboy hat, navy suit, white shirt and navy tie, RIDING another white horse with a brown leather bridle and saddle.
- Eoheung: a tiger with a big striped tiger face and green eyes, a chubby body in a dark brown-grey suit, white shirt and navy tie, paws clasped in front, tiger feet and a striped tail.
- Chumo-daejang (MC, elder): a grey elephant with big floppy pink-lined ears and a long trunk, NO hair; a plain sky-blue #439ED5 T-shirt with only the big white Korean letters '추모대장', dark navy trousers, a silver whistle on a cord. A huge grin with sharp eyes.
- Deul-neoguri (former Culture Minister, rapper): a big black gorilla; in this book he wears a black suit and tie. He has left the country - draw him only if the page asks.
- Bui (elder, from part2-cast.jpg): a very old tortoise with a shell, long white eyebrows and beard, navy-blue Korean durumagi coat, wooden cane.
- Chumo-tusu (from part2-cast.jpg): a bright-eyed sea otter in a beige suit with a small baseball-glove pin.
- Extras: Ttalgi's aides are meerkats in grey suits; Hamji's aides are chipmunks in grey vests; bodyguards are Dobermans in black suits and sunglasses; prison guards are burly bulldogs in dark police uniforms and caps; intelligence agents are black panthers in black suits with earpieces. All crowds and extras are animals in clothes.

=== HUMAN CHARACTERS ===
Only these people are human; never mix their faces or clothes, and draw only the ones the page names.
- Choi Muhyeon: as on the cabinet sheet and in the middle of humans-who-is-who.jpg - neat side-parted black hair, light-blue button shirt, dark trousers, brown shoulder bag, brown shoes.
- Kim Manwoo (left in humans-who-is-who.jpg): messy spiky black hair, goofy grin, navy quilted puffer jacket, loose jeans, sneakers.
- Sim Jinwoo (right in humans-who-is-who.jpg): messy brown hair, round glasses, plain white shirt, dark trousers.
- Park Wootae (spy from the Memorial People's Republic): copy ref-park-wootae.png exactly when it is attached.

=== PLACES IN PART 3 (the page's PLACE line tells you which one) ===
- state meeting room: the Memorial Republic's private underground state meeting room - clean cream-and-navy marble walls, warm indirect golden light, a long polished walnut table with navy leather chairs, sleek built-in security panels, a large slim wall screen, white chrysanthemums in crystal vases, two national flags on gold poles behind the President's seat. Luxurious and tidy - NOT a dark bunker.
- strategy room: Ttalgi's sleek data war room - dark navy walls, a black glossy floor, a towering curved wall of glowing monitors, a long glass table; cool blue screen light (as in part2-style.jpg, left).
- secretariat: Hamji's shrine-like office - walls and even the ceiling covered with framed photos of the President, candles, white chrysanthemums, a yellow rubber-duck plush on the desk (as in part2-style.jpg, middle).
- Pure Team meeting room: a modest room with folding chairs, a projector screen and a whiteboard.
- correction hall: a big dark underground hall of the Corrections Bureau with a raised stage under harsh stage lights; correction props are hidden under cloth covers or drawn as cartoonish shapes.
- interrogation room: bare concrete walls, a single flickering fluorescent tube, a metal table and chair.
- president office: the President's grand office - a carved mahogany desk, a tall navy leather chair, tall windows with navy curtains, one national flag on a gold pole, white chrysanthemums.

=== NATIONAL FLAG - USE IT RARELY ===
Copy flag.png exactly (navy field, thin gold border, golden crescent arcs, a gold candle with a flame, a white swirl around its right side, a white lotus at the bottom, three white leaves on each side; never an eagle, star, paw print or building). It appears ONLY as real flags on poles in formal state rooms, on an official podium, or on an official seal when the page asks. Never on mugs, chairs, books, tablets, pins, screens or decorations.

=== TEXT ===
No readable text, letters, numbers, captions or name labels, except '추모대장' on Chumo-daejang's T-shirt or a word the page explicitly asks for. Screens and papers show only icons and abstract squiggles.

=== TONE ===
Dark political satire told with warmth and humor. Rough moments are harmless cartoon slapstick (motion lines, comic stars, sweat drops, small cartoon bandages). No blood, no injury, nothing graphic.

Reply only "Ready".
```

## 고칠 때

```text
Redo. Keep the composition, but fix: <고칠 점>. Copy every character exactly from cabinet-sheet-v2.png.
```
