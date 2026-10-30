# 「영원하라 추모공화국」 그림 프롬프트

이 파일은 `forever/build.py` 가 만든다. 장면을 바꾸려면 원고(`forever/src/NN.md`)의 `그림:` 줄을,
그림체·인물 생김새를 바꾸려면 `forever/src/book.json` 을 고친 뒤 다시 빌드한다.

## 쓰는 법

1. 챗GPT에서 **새 대화**를 연다.
2. 참고 그림 두 장을 **첨부**한다: 국무위원 형상 시트 `forever/reference/cabinet-sheet.webp`, 국기 `forever/reference/flag.png`.
3. 그 메시지에 아래 「1단계」 상자를 붙여넣어 보낸다. 「Ready」라는 답이 오면,
4. 「2단계」의 쪽별 상자를 하나씩 붙여넣는다. 쪽별 상자에도 그 장면 인물의 생김새가 다시 들어 있어서, 대화가 길어져도 인물이 덜 흐트러진다.
5. 인물이 틀리게 나오면 그 그림에 대고 이렇게 고쳐 달라고 한다:
   `Redo this. <이름> must be a <동물> exactly like the reference sheet, not a human. Keep everything else.`
6. 마음에 드는 그림을 Claude에게 주며 "1장 3쪽 그림이야"라고 하면 그 쪽에 붙는다.

남은 그림: **18장** (⬜ 남음 · ✅ 붙음)

## 1단계 — 처음 한 번 (참고 그림 2장 첨부)

```text
We are going to illustrate a picture book called "Long Live the Memorial Republic" (Korean title: 영원하라 추모공화국), one page at a time. Keep everything below consistent for the whole conversation.

I attached two reference images: (1) a character sheet of the cabinet members - match each character's SPECIES, colors, outfit and props exactly, but redraw them in the 2D storybook style below (the sheet is 3D; do NOT copy the 3D look); (2) the national flag of the Memorial Republic - use it whenever a flag appears.

ART STYLE: 2D hand-drawn children's picture-book illustration. Soft watercolor washes with colored-pencil linework on warm, slightly textured paper; gentle golden light; rounded, friendly shapes. All characters are cute anthropomorphic ANIMALS (or toys) standing upright and wearing clothes, with picture-book proportions (big heads, about 3-4 heads tall) and very expressive faces. Mood: a solemn government drama told as a playful black-comedy storybook. NOT 3D, NOT CGI, NOT Pixar/Disney-movie style, NOT photorealistic.

RULES: One vertical 2:3 image (1024x1536). Absolutely no readable text, letters, numbers, speech bubbles, captions, name tags or logos anywhere (screens, papers and charts show only abstract squiggles). No human characters except the one explicitly described as human. Do not resemble any real person.

CHARACTERS (always the same species, colors and outfit):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Benesu-hoja (Chief of Memorial Corrections) = a dark-grey rabbit with long upright ears in a black tactical police uniform and boots, holding a black baton, with a small green-and-red parrot perched on its left shoulder. NOT a human
- Bukanistan (Chief of Memorial Security) = a white horse with a long flowing white mane, wearing a black cowboy hat and a navy suit, riding on the back of another white horse (a horse riding a horse). NOT a human
- Eoheung (Chief of the Memorial Weather Agency) = a chubby little tiger cub in a brown suit with a blue tie, paws clasped in front. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human
- Doberman bodyguards (the Presidential Security Detail) = two tall Doberman pinschers in black suits, white shirts and black ties, dark sunglasses and coiled earpiece wires, hands clasped in front, standing motionless at attention. NOT humans
- meerkat aides (Ttalgi's strategy aides) = small, upright meerkats in neat grey suits and thin black ties, holding tablets and notepads, nervous and obedient. NOT humans
- chipmunk aides (Hamji's secretariat staff) = small chipmunks with striped backs in grey vests, white shirts and blue ties, holding folders, polite and a little nervous. NOT humans
- Kim Manwoo (a lazy memorial-goer who skipped memorials for six months) = a human character drawn as a simple cartoon in the book's style, matching ref-kim-manwoo.png (made from the author's reference photo)
- Sim Jinwoo (a fake memorial-goer who joined only for experience points) = a human character drawn as a simple cartoon in the book's style, matching ref-sim-jinwoo.png (made from the author's reference photo)
(Text exception: the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided) - this is the ONLY text allowed in any picture.)

PLACES:
- council hall: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon
- tv studio: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits
- president office: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk
- strategy room: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light
- secretariat: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light
- culture office: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window
- government corridor: a long, grand corridor of the Memorial Republic government building: tall arched windows, navy carpet runners, framed portraits of the President and white chrysanthemums along the walls
- conference room: the big conference room of the Ministry of Memorial Culture: a long polished table, high-backed chairs, water bottles and white chrysanthemums, a big screen with a stage diagram, the national flag in the corner
- bui's house: the old tortoise Bui's traditional Korean house: a quiet room with paper sliding doors, a low wooden tea table, a low lamp and a scroll painting of mountains
- grand theater: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

Do not draw anything yet. Reply only with "Ready". After that I will send one page at a time.
```

## 2단계 — 쪽마다 하나씩

### 표지

✅ `forever/images/cover.webp`

```text
Book cover illustration (no title text). 2D watercolor storybook illustration, vertical 2:3.

SCENE: Morning light on the grand stone steps of the Memorial Republic government building, its entrance decorated with black mourning ribbons, white chrysanthemum wreaths and the national flag. President Minju-simin stands proudly in the center. On both sides stand Chumo-yeolsa holding the tablet, Deul-neoguri saluting, Bui with arms folded, and Chumo-hamnido clutching newspapers, all solemn. In a corner of the steps, Hai is slumped and yawning. At the bottom, Lee Gija is scrambling up the stairs late with a briefcase, sweat flying. Far away, peeking from behind a pillar in the shadows, John Pukta watches with a sly grin. Leave clear open sky at the top for the book title (do not write any title).

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 프롤로그

### 프롤로그 1쪽 (책 1쪽)

✅ `forever/images/00-01.webp`

```text
0-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Council hall, the wall clock showing exactly 9 o'clock in the morning. President Minju-simin stands at the podium with one wing raised, delivering a passionate speech while looking down at the cabinet. The other animal ministers are seen small, from behind, seated around the long table.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그 2쪽 (책 2쪽)

✅ `forever/images/00-02.webp`

```text
0-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: A hushed, solemn council hall. Deul-neoguri sits with head bowed, listening respectfully. Beside the window, the old tortoise Bui sits with arms folded, staring indifferently outside as slanted morning sunlight pours in.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그 3쪽 (책 3쪽)

✅ `forever/images/00-03.webp`

```text
0-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. A big screen next to the podium shows a graph arrow nose-diving downward (no numbers). Minju-simin pauses, looks slowly around the room, then points a wing at Chumo-yeolsa sitting at the far end of the table. The animal ministers exchange nervous glances.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 1장: 위기의 보고

### 1장: 위기의 보고 1쪽 (책 4쪽)

✅ `forever/images/01-01.webp`

```text
1-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-yeolsa rises from the seat with perfectly straight posture and reads from the tablet with a blank face. On the big screen behind, a row of shining star icons is going dark one by one (the 'big star' shortage). Minju-simin listens from the podium.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 2쪽 (책 5쪽)

✅ `forever/images/01-02.webp`

```text
1-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The screen shows a bar chart dropping like stairs and a coin pouch shriveling up (no numbers). The animal ministers around the table gasp and whisper to each other in shock. Only Chumo-yeolsa stays completely expressionless.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 3쪽 (책 6쪽)

✅ `forever/images/01-03.webp`

```text
1-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The room lights dim. Chumo-yeolsa lowers the voice to report. On the screen, secret documents fly out of an open safe like paper airplanes through a window. Two work laptops on the table blink with red warning lights.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 4쪽 (책 7쪽)

✅ `forever/images/01-04.webp`

```text
1-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-hamnido leaps up, knocking the chair back, face red with fury, newspapers crumpled in one paw, shouting. At the podium Minju-simin calmly raises one wing to stop the outburst. Deul-neoguri, sitting alongside, flinches in surprise.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 5쪽 (책 8쪽)

✅ `forever/images/01-05.webp`

```text
1-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: A dark messy room full of cup-noodle cups and snack wrappers. John Pukta hunches at a keyboard in the monitor's glow, clutching its belly and cackling. Mocking laughing-face icons spill out of the monitor and float in the air (no text). Through the window, the government building is tiny in the distance.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 6쪽 (책 9쪽)

✅ `forever/images/01-06.webp`

```text
1-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: The back corner of the council hall. Hai is slumped sideways in a chair, mouth wide open in a giant yawn. At the front, all the animal ministers have turned their heads to stare at Hai, while Chumo-yeolsa keeps looking at the tablet without expression. One empty chair at the table, left by a latecomer, stands out.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 7쪽 (책 10쪽)

✅ `forever/images/01-07.webp`

```text
1-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Hai shrugs with both paws spread, making excuses. The air in the room turns icy: the whole scene is tinted cold blue and tiny icicles hang above the animal ministers' heads. At that very moment, the door of the hall starts to burst open.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 8쪽 (책 11쪽)

✅ `forever/images/01-08.webp`

```text
1-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Through the wide-open door, Lee Gija bursts in, briefcase under one arm, shirt wrinkled, tie crooked, sweat drops flying, frantically counting on its claws in panic. From the podium, Minju-simin looks down at Lee Gija with ice-cold eyes.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 9쪽 (책 12쪽)

✅ `forever/images/01-09.webp`

```text
1-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Dramatic close-up: Lee Gija's face turns as white as paper and the briefcase slips from its grip. Across the table, Chumo-yeolsa holds the tablet out toward Lee Gija with a blank face. Every animal minister's eyes are fixed on Lee Gija. A tense cliffhanger moment.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 2장: 들너구리의 제안

### 2장: 들너구리의 제안 1쪽 (책 13쪽)

✅ `forever/images/02-01.webp`

```text
2-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, the air heavy with tension. Deul-neoguri slowly rises from the seat: a heavy gold chain hangs over the black suit and several rings glitter on the fingers. The face is deeply serious. The animal ministers around the table look up in silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 2쪽 (책 14쪽)

✅ `forever/images/02-02.webp`

```text
2-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Deul-neoguri walks slowly around the long table, one hand moving to a rapper's rhythm, gold chain and rings catching the light. Floating above like a daydream is a glowing new star being born. At the podium, Minju-simin tilts the head and raises one wing, asking a question.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 3쪽 (책 15쪽)

✅ `forever/images/02-03.webp`

```text
2-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, a comic freeze-frame. Deul-neoguri proudly points both thumbs at itself under a dramatic spotlight. Behind, like a dream bubble, Deul-neoguri raps on a huge stage surrounded by candles, white chrysanthemums and a giant framed portrait of Deul-neoguri (no text). Every animal minister is frozen with jaws dropped; Minju-simin's bill hangs open.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 4쪽 (책 16쪽)

✅ `forever/images/02-04.webp`

```text
2-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-tusu springs up with eyes sparkling like stars, one paw raised high, applauding with excitement. Deul-neoguri nods with satisfaction while fanning out seven blank record sleeves (no text on them) like a hand of cards, a small film clapperboard tucked under one arm.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 5쪽 (책 17쪽)

✅ `forever/images/02-05.webp`

```text
2-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Across the long table, the old tortoise Bui slowly lifts the head with a complicated, heavy expression, long white eyebrows drawn together. Facing Bui, Deul-neoguri places one hand over the heart and bows politely while answering. Sunlight falls between them like a dividing line.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 6쪽 (책 18쪽)

✅ `forever/images/02-06.webp`

```text
2-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The old tortoise Bui has turned away and stands alone by the tall window, arms folded, gazing outside in silence, a lonely figure in the slanted light. At the podium, Minju-simin raises one wing firmly to settle the matter. Deul-neoguri, gold chain glinting, wears a small hopeful smile.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 3장: 추모대장의 단합대회

### 3장: 추모대장의 단합대회 1쪽 (책 19쪽)

✅ `forever/images/03-01.webp`

```text
3-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-daejang suddenly leaps up from the seat, arms flung wide open, beaming an enormous grin, the white lettering on the sky-blue T-shirt clearly visible. Right beside, Chumo-hamnido frowns in irritation. The other animal ministers flinch and turn in surprise, a teacup rattling on the table.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 3장: 추모대장의 단합대회 2쪽 (책 20쪽)

✅ `forever/images/03-02.webp`

```text
3-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-daejang strides into the open space in the middle of the room and points the trunk and one hand straight at Lee Gija. Lee Gija freezes and forces a stiff, awkward smile, one sweat drop rolling down. The animal ministers watch nervously from their seats.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 3장: 추모대장의 단합대회 3쪽 (책 21쪽)

✅ `forever/images/03-03.webp`

```text
3-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-daejang leans in close to Lee Gija: the grin is still huge, but the eyes now glint sharply. Lee Gija, trembling, stretches a forced smile as wide as possible. In the background, Hai slouches with arms crossed and a grumpy pout, clearly next in line.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 3장: 추모대장의 단합대회 4쪽 (책 22쪽)

✅ `forever/images/03-04.webp`

```text
3-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, an eerie moment. Chumo-daejang looms over the slumped Hai, the grin stretched unnaturally wide, while a much larger, darker shadow of the elephant, trunk and ears spreads across the wall behind. Hai shrinks into the chair and squeezes out a tiny, reluctant smile. The warm light turns slightly cold.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 3장: 추모대장의 단합대회 5쪽 (책 23쪽)

✅ `forever/images/03-05.webp`

```text
3-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-daejang claps both hands loudly, urging everyone to stand up. Chumo-hamnido half-rises with a finger raised to object, but Chumo-daejang's open hand is held up right in front of the wolf's face. At the podium, Minju-simin strokes the chin with one wing, thinking, then gives a small nod.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 3장: 추모대장의 단합대회 6쪽 (책 24쪽)

✅ `forever/images/03-06.webp`

```text
3-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The animal ministers stand up one by one, raising their paws in an awkward chant led by Chumo-daejang blowing the whistle. Deul-neoguri raises a hand with an amused look; Chumo-tusu pumps a fist with wild enthusiasm. But the old tortoise Bui stays seated with arms folded, and Chumo-yeolsa stands perfectly still with a blank face. The colors feel slightly pale and hollow.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 3장: 추모대장의 단합대회 7쪽 (책 25쪽)

✅ `forever/images/03-07.webp`

```text
3-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, a surreal black-comedy chaos. Chumo-daejang dances wildly in the middle of the room with a manic, frozen grin, whistle flying, trunk swinging, big ears flapping. Around the table the animal ministers raise their fists with forced, stiff smiles. The colors swirl strangely like a fever dream. In the quiet foreground, the old tortoise Bui sits alone with arms folded, letting out a long, heavy sigh, a small puff of breath visible.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

## 4장: 숙청의 시작

### 4장: 숙청의 시작 1쪽 (책 26쪽)

✅ `forever/images/04-01.webp`

```text
4-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, a cold silence after the forced rally. The exhausted animal ministers are slumped in their chairs, while Chumo-daejang alone still wears a satisfied grin. At the podium Minju-simin speaks calmly. Chumo-yeolsa and Aeguk-jwasu walk forward to stand in front of the podium; the wolf's eyes gleam with a manic glint. The light turns cool blue-grey.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 2쪽 (책 27쪽)

✅ `forever/images/04-02.webp`

```text
4-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. From the podium, Minju-simin looks down with ice-cold eyes and raises one wing to cut off Lee Gija, who stands trembling with paws stretched out, pleading. Beside the podium, Aeguk-jwasu places a paw over the heart and bows slightly, an eager polite smile on the face and a dangerous gleam in the eyes.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 3쪽 (책 28쪽)

✅ `forever/images/04-03.webp`

```text
4-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Aeguk-jwasu approaches Lee Gija and bows deeply and courteously, one paw on the chest, smiling politely, but a cold shadow falls across the wolf's eyes. Lee Gija backs away in fear, clutching the briefcase to the chest, sweat flying. The other animal ministers hold their breath.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 4쪽 (책 29쪽)

✅ `forever/images/04-04.webp`

```text
4-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, a black-comedy moment drawn in an exaggerated cartoon way (not violent or graphic). Aeguk-jwasu calmly holds Lee Gija's arm twisted behind the back in a comical wrestling hold, still wearing a perfectly polite smile. Lee Gija's mouth is wide open in a yell, with cartoon motion lines and little stars around the head (no speech bubbles). The animal ministers at the table wince and cover their eyes.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 5쪽 (책 30쪽)

✅ `forever/images/04-05.webp`

```text
4-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: The doorway of the council hall seen from inside. Aeguk-jwasu drags Lee Gija out into a long, dim corridor by the shirt collar, Lee Gija's claws scraping the floor, the sloth sobbing. The battered briefcase lies abandoned on the carpet. The heavy door is swinging shut. In the foreground, the animal ministers sit frozen in silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 6쪽 (책 31쪽)

✅ `forever/images/04-06.webp`

```text
4-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-yeolsa turns toward the back of the room and calmly points the tablet at Hai with a blank face. Hai, suddenly wide awake for once, sits bolt upright and points at itself in disbelief, droopy eyes now wide open. The animal ministers turn to look.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 7쪽 (책 32쪽)

✅ `forever/images/04-07.webp`

```text
4-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-yeolsa stands perfectly straight reading the verdict from the tablet with a blank face; the tablet screen glows with a red exit-door icon (no text). Facing the teddy bear, Hai protests desperately, both paws spread wide, mouth open, tie flapping. The other animal ministers watch tensely.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 숙청의 시작 8쪽 (책 33쪽)

✅ `forever/images/04-08.webp`

```text
4-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: The doorway of the council hall. Hai shuffles out alone toward the corridor, seen from behind: shoulders drooping, tie loose, a phone in one paw glowing with a red X icon (no text). Beside the door, Chumo-yeolsa stands upright, one arm pointing at the exit, face blank. The figure of the koala looks small and shabby in the long shadow.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 5장: 추모 교정 리얼리티 쇼

### 5장: 추모 교정 리얼리티 쇼 1쪽 (책 34쪽)

✅ `forever/images/05-01.webp`

```text
5-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio, a flashy live broadcast. In the center of the stage, Lee Gija and John Pukta sit tied to two chairs with thick cartoon ropes. In front of them, Chumo-daejang as the show host holds a microphone and beams straight into a big TV camera. Behind them hangs a huge glowing show banner with only abstract shapes (no text). The animal audience applauds.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 2쪽 (책 35쪽)

✅ `forever/images/05-02.webp`

```text
5-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio. Aeguk-jwasu walks onto the stage under a spotlight, today wearing a neat black suit and black leather gloves instead of the camouflage jacket (same grey wolf face), and bows politely to the audience with one gloved paw over the heart. Nearby, Lee Gija sits tied to the chair with the head hanging low, a few cartoon bandage plasters on the face and a torn shirt (storybook style, not graphic).

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 3쪽 (책 36쪽)

✅ `forever/images/05-03.webp`

```text
5-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio. John Pukta, tied to the chair, throws the head back cackling mockingly, sunglasses slipping crooked, little laughing-face icons popping in the air (no text). Aeguk-jwasu, in a neat black suit and black leather gloves, strolls closer with gloved paws clasped behind the back and a polite smile.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 4쪽 (책 37쪽)

✅ `forever/images/05-04.webp`

```text
5-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio, a close-up. Aeguk-jwasu, in a neat black suit and black leather gloves, leans down toward John Pukta with the head tilted, asking a question with an exaggeratedly polite smile. John Pukta, still tied up, smirks and sneers back defiantly. Big TV cameras with red lights surround them.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 5쪽 (책 38쪽)

✅ `forever/images/05-05.webp`

```text
5-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio, a slapstick gag drawn in an exaggerated cartoon way (not violent). Aeguk-jwasu gives John Pukta a light flick on the cheek with a gloved paw, cartoon motion lines whooshing; John Pukta's sunglasses fly off comically and little stars circle the head. The wolf bows with a fake innocent "oops, my hand slipped" face, one paw over the mouth.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 6쪽 (책 39쪽)

✅ `forever/images/05-06.webp`

```text
5-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio, a satirical crowd scene. The animal audience leaps to their feet, clapping and cheering wildly, some pumping fists, faces lit by harsh stage lights. On the stage below, Aeguk-jwasu's eyes have turned cold, while John Pukta sits dazed in the chair with cartoon stars circling, sunglasses gone. Exaggerated, slightly unsettling black-comedy mood.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 7쪽 (책 40쪽)

✅ `forever/images/05-07.webp`

```text
5-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio. Chumo-daejang leans right into the lens of a big TV camera with a red on-air light, microphone in hand, grinning enormously at the viewers. Behind, slightly out of focus, Aeguk-jwasu in the black suit turns gently toward Lee Gija, who trembles in the chair and shakes the head in fear.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 8쪽 (책 41쪽)

✅ `forever/images/05-08.webp`

```text
5-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio. Aeguk-jwasu, in a neat black suit and black leather gloves, rests one gloved paw on top of Lee Gija's head, pressing it down, still smiling politely, and holds up the other paw with fingers spread as if announcing a big number. Lee Gija, tied up and teary-eyed, nods frantically. Cameras zoom in.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 추모 교정 리얼리티 쇼 9쪽 (책 42쪽)

✅ `forever/images/05-09.webp`

```text
5-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the TV studio, the bleak finale. Freed from the ropes, Lee Gija bows deeply to the floor again and again, shown as a row of overlapping motion-trail poses, tears flying. Chumo-daejang shouts into the microphone urging "louder", the animal audience roars and cheers, and several TV cameras with glowing red lights capture everything. A satirical, unsettling spectacle.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

## 에필로그: 공포와 흥행

### 에필로그: 공포와 흥행 1쪽 (책 43쪽)

✅ `forever/images/06-01.webp`

```text
6-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. A huge wall screen shows a line graph shooting steeply upward like a rocket, glowing gold (no numbers). Minju-simin stands before it with wings clasped behind the back, calm and satisfied. Deul-neoguri, gold chain gleaming, reports excitedly holding a tablet, beaming like a trusted comrade.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 에필로그: 공포와 흥행 2쪽 (책 44쪽)

✅ `forever/images/06-02.webp`

```text
6-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. Chumo-yeolsa stands perfectly straight beside the wall screen, which now shows small replay frames of the TV show stage with a tied-up sloth and a tied-up black rat (no text), and speaks with a cold blank face, holding only the tablet. Next to the teddy bear, Chumo-hamnido proudly holds up an official letter stamped with a candle-emblem seal (no readable text).

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 에필로그: 공포와 흥행 3쪽 (책 45쪽)

✅ `forever/images/06-03.webp`

```text
6-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office, a split mood. On the warm, brightly lit side, Minju-simin nods with satisfaction while Deul-neoguri bows deeply in gratitude. In the far corner, in cool blue shadow by the tall window, the old tortoise Bui stands alone with arms folded, gazing outside with eyes full of deep sorrow, lips pressed shut in silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 에필로그: 공포와 흥행 4쪽 (책 46쪽)

✅ `forever/images/06-04.webp`

```text
6-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: A wide night panorama of the Memorial Republic capital, the final page of Part 1. Countless apartment windows glow with candles and flickering TV screens; inside, tiny animal citizens bow and pray anxiously, some glancing over their shoulders in fear. Above the rooftops, giant glowing billboard screens show a spotlit concert stage with a gorilla silhouette holding a microphone (no text). Deep navy sky, a thin crescent moon, an eerie and melancholy ending.

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 부록: 주요 인물 소개

### 부록: 주요 인물 소개 1쪽 (책 47쪽)

✅ `forever/images/07-01.webp`

```text
7-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Minju-simin for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 2쪽 (책 48쪽)

✅ `forever/images/07-02.webp`

```text
7-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Deul-neoguri for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 3쪽 (책 49쪽)

✅ `forever/images/07-03.webp`

```text
7-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Chumo-yeolsa for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 4쪽 (책 50쪽)

✅ `forever/images/07-04.webp`

```text
7-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Chumo-hamnido for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 5쪽 (책 51쪽)

✅ `forever/images/07-05.webp`

```text
7-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Lee Gija for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 6쪽 (책 52쪽)

✅ `forever/images/07-06.webp`

```text
7-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Bui for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 7쪽 (책 53쪽)

✅ `forever/images/07-07.webp`

```text
7-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Chumo-tusu for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 8쪽 (책 54쪽)

✅ `forever/images/07-08.webp`

```text
7-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Hai for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 9쪽 (책 55쪽)

✅ `forever/images/07-09.webp`

```text
7-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Chumo-daejang for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 10쪽 (책 56쪽)

✅ `forever/images/07-10.webp`

```text
7-10. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of Aeguk-jwasu for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 부록: 주요 인물 소개 11쪽 (책 57쪽)

✅ `forever/images/07-11.webp`

```text
7-11. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Character portrait of John Pukta for the book's cast appendix: full figure, centered, in a typical pose, simple softly lit background.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 프롤로그: 두 개의 충성

### 프롤로그: 두 개의 충성 1쪽 (책 58쪽)

✅ `forever/images/08-01.webp`

```text
P-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. SCENE: The opening of Part 2. A formal audience in the president office. President Minju-simin sits with dignity in the presidential chair behind the great desk and has summoned two rival aides, who stand on either side of the desk facing the President. Nobody speaks yet; the air between the two aides is quietly tense. COMPOSITION: A perfectly symmetrical, centered wide shot at eye level from the middle of the room, like a royal portrait. The desk runs across the lower-middle of the picture; the chair, the President and the tall window behind form the central axis. Ttalgi stands on the left of the desk, Hamji on the right, both turned three-quarters toward the President. Two bodyguards stand at attention behind the chair, one on each side of the window, completing the symmetry. MINJU-SIMIN: Seated deep in the high-backed chair (NOT standing, NOT on the desk). Only the upper body shows above the desktop; the desk edge reaches the duck's chest. Both wings rest calmly folded on the desk. Front-facing, chin slightly raised, calm, firm, unreadable eyes - the quiet authority of a head of state. TTALGI: Standing upright on the left, the chubby round white cat in a charcoal-grey suit, white shirt and bright red tie, tablet held flat against the round belly. Chin up, ears upright, sharp green eyes narrowed, glancing sideways at Hamji with cool calculation. HAMJI: Standing on the right, plump, grey suit, blue tie, paws clasped neatly at the belly. A soft, gentle smile, but the big round eyes glow with a tiny unsettling sparkle of fanatical devotion, gazing adoringly at the President. BODYGUARDS: Two Doberman bodyguards in black suits, white shirts, black ties, dark sunglasses and coiled earpiece wires, hands clasped in front, motionless and serious. DETAILS: On the desk a green-shaded brass desk lamp, a gold fountain-pen stand, a neat stack of blank documents, a white porcelain teacup and a blue-and-white vase of white chrysanthemums. The desk front panel carries the national emblem in gold. Two national flags (copy flag.png exactly) stand on gold poles on either side of the window. LIGHT & COLOR: Warm golden afternoon light pours through the tall window behind the chair, giving the President a soft halo. Subtle foreshadowing: the left side of the room (Ttalgi) is slightly cooler and bluer, the right side (Hamji) slightly warmer and redder. MOOD: Solemn, formal, quietly tense - the calm before a storm.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Doberman bodyguards (the Presidential Security Detail) = two tall Doberman pinschers in black suits, white shirts and black ties, dark sunglasses and coiled earpiece wires, hands clasped in front, standing motionless at attention. NOT humans

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그: 두 개의 충성 2쪽 (책 59쪽)

✅ `forever/images/08-02.webp`

```text
P-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. SCENE: Ttalgi speaks first and presents a cold data analysis of the nation's memorial participation, swiping the tablet to project floating holographic charts into the air in front of the President's desk. COMPOSITION: Medium shot from slightly to the left of the desk. Ttalgi fills the left foreground in three-quarter view, one paw swiping the tablet. The holographic panels float in the middle of the picture between Ttalgi and the desk. Minju-simin is in the center background, seated in the high-backed chair behind the desk. Hamji stands at the right edge, partly cut off by the frame. TTALGI: The chubby round white cat (NOT slim). Cool, confident, almost bored expression, one eyebrow slightly raised, green eyes reflecting the blue glow; posture straight and self-assured like a presenter. HOLOGRAMS: Translucent light-blue glowing panels: a bar chart, a pie chart with one large slice glowing red, a line graph falling with a bold red downward arrow, a small icon of a young animal silhouette walking away, and a small stack of gold coins. Abstract shapes only - no numbers, no letters. MINJU-SIMIN: Seated in the high-backed chair (never standing, never on the desk), upper body above the desk, wing tips pressed together in front of the bill, listening with serious, attentive eyes. HAMJI: Paws clasped, mouth pressed into a small tight line, eyes narrowed with faint displeasure at the charts. BACKGROUND: One Doberman bodyguard in a black suit and sunglasses stands by the tall double doors. Navy velvet curtains, the national flag on a gold pole, bookshelves with gilded spines. LIGHT & COLOR: The office is warm and golden, but the hologram throws a cold blue light up onto Ttalgi's face - cool blue against warm gold. MOOD: Clinical and sharp; numbers versus faith.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그: 두 개의 충성 3쪽 (책 60쪽)

✅ `forever/images/08-03.webp`

```text
P-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. SCENE: Hamji gently interrupts, stepping forward to insist that memorial is something sacred that cannot be measured by numbers, as if speaking the President's own holy words. COMPOSITION: Low-angle medium shot. Hamji stands center-right in the foreground, one step forward. Behind Hamji on the wall hangs a large gilded framed portrait of Minju-simin, forming a strong diagonal from the portrait down to Hamji. Ttalgi stands on the left in cool shadow. Minju-simin sits small in the mid-ground in the chair behind the desk, watching. HAMJI: Both paws pressed over the heart, head tilted, a sweet, soft smile; the big round eyes are huge and shining with little star-like highlights - pure, fanatical devotion. Cheeks slightly flushed. PORTRAIT: A large ornate gold frame with an official painted portrait of Minju-simin (the same yellow duck in the navy suit, front-facing, solemn), glowing softly like a sacred icon, with white chrysanthemums in vases beneath it. TTALGI: The chubby round white cat, arms folded with the tablet tucked under one arm, one eyebrow raised in cool skepticism; the holographic charts behind the cat now dim and flickering. MINJU-SIMIN: Seated in the high-backed chair (never on the desk), wings resting on the desk, expression calm and impossible to read. LIGHT & COLOR: A warm golden beam falls from above onto Hamji and the portrait like light in a cathedral, with floating golden dust motes. Ttalgi's side of the room stays cool and dim. MOOD: Sweet on the surface, eerie underneath - devotion that is a little too pure.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그: 두 개의 충성 4쪽 (책 61쪽)

✅ `forever/images/08-04.webp`

```text
P-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. SCENE: The argument boils over. Ttalgi calls the President's words a mere ideological direction; Hamji's smile vanishes and Hamji insists they are absolute truth. The two aides are face to face. COMPOSITION: Close-up from the chest up. Ttalgi on the left and Hamji on the right in profile, nose to nose, filling the frame. Both chubby animals lean in, round bellies almost touching, glaring eye to eye. The background is the softly blurred office, with the President's high-backed chair and the duck's silhouette visible small in the center between them. TTALGI: The chubby round white cat, face frozen cold, eyes narrowed to thin slits, ears slightly flattened, mouth a thin straight line. HAMJI: The sweet smile completely gone; cheeks puffed up round, whiskers bristling, eyes wide and intense with tiny flames reflected in them, small fists clenched. EFFECT: Split color - the left half of the picture is tinted icy blue with faint frost crystals; the right half is tinted hot red-orange with faint heat shimmer. Between their noses, small yellow cartoon electric sparks zigzag. BACKGROUND: A Doberman bodyguard in sunglasses in the background glances sideways, a single nervous sweat drop on its temple. MOOD: Comic but genuinely fierce - two loyalties colliding.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그: 두 개의 충성 5쪽 (책 62쪽)

✅ `forever/images/08-05.webp`

```text
P-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. SCENE: Ttalgi sneers that Hamji is deifying the President. Minju-simin calmly but firmly says "Be quiet, both of you," and the room instantly falls silent. COMPOSITION: Medium-wide shot, symmetrical again, from the front of the desk. Minju-simin is the clear center and focal point, seated in the high-backed chair behind the desk. Ttalgi on the left and Hamji on the right, both frozen mid-argument and turned toward the President. MINJU-SIMIN: Seated upright in the chair (NOT standing, NOT on the desk), one wing raised palm-out in a calm, firm "stop" gesture, eyes steady and stern, bill closed - effortless, commanding authority. TTALGI: The chubby round white cat, arms folded, a contemptuous smirk frozen on the face, ears flicking back. HAMJI: Paws clenched and trembling, mouth shut tight, a tiny sweat drop on the forehead. BODYGUARDS: The two Doberman bodyguards behind the chair straighten up sharply at attention. DETAILS: The room is perfectly still - dust motes hang in a beam of light, a single ripple spreads across the tea in the porcelain cup on the desk. Small freeze lines around Ttalgi and Hamji. LIGHT & COLOR: Soft, slightly muted palette; the light from the window behind the President forms a firm halo. MOOD: A hush; the President's absolute control over the room.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Doberman bodyguards (the Presidential Security Detail) = two tall Doberman pinschers in black suits, white shirts and black ties, dark sunglasses and coiled earpiece wires, hands clasped in front, standing motionless at attention. NOT humans

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그: 두 개의 충성 6쪽 (책 63쪽)

✅ `forever/images/08-06.webp`

```text
P-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. SCENE: The dramatic finale of the prologue. Minju-simin has risen and announces a contest: both aides will run the project their own way, and the winner will become the President's true right hand. Ttalgi and Hamji glare at each other - the war has begun. COMPOSITION: Dramatic low-angle shot across the desk. In the foreground, over-the-shoulder views of Ttalgi (left edge) and Hamji (right edge) glaring at each other. In the middle of the desk sits a chessboard. Minju-simin stands behind the desk in the center background, towering in perspective. MINJU-SIMIN: Standing on the floor BEHIND the desk, in front of the chair (the duck is short, so the desk top reaches the duck's chest - never standing on or sitting on the desk). Both wings planted on the desk, leaning forward slightly, eyes sharp and calculating, a faint knowing smile. The desk lamp lights the face from below, and a huge shadow of the duck is cast on the wall behind, next to the national flag. CHESSBOARD: A polished wooden chessboard. In the center, a white cat-shaped chess piece and an orange hamster-shaped chess piece face each other; behind them stands a larger golden king piece shaped like the yellow duck. TTALGI & HAMJI: The chubby round white cat and the plump hamster, eyes locked in a fierce glare; a crackling yellow cartoon lightning bolt connects their eyes across the desk. BACKGROUND: The two Doberman bodyguards in black suits and sunglasses stand in silhouette beside the tall window. LIGHT & COLOR: Sunset light through the window turns deep orange-red, casting long dramatic shadows across the office; the rest of the room falls into shadow. MOOD: Grand, ominous and theatrical - the title page of a new war.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Doberman bodyguards (the Presidential Security Detail) = two tall Doberman pinschers in black suits, white shirts and black ties, dark sunglasses and coiled earpiece wires, hands clasped in front, standing motionless at attention. NOT humans

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 1장: 딸기의 추모 계층화 계획

### 1장: 딸기의 추모 계층화 계획 1쪽 (책 64쪽)

✅ `forever/images/09-01.webp`

```text
1-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the strategy room. SCENE: The Memorial Strategy Office, Ttalgi's own headquarters. Ttalgi stands before a giant wall of monitors full of complex graphs and diagrams and begins a cold briefing to a team of meerkat aides, aiming a laser pointer at the screen. COMPOSITION: Wide shot from behind the seated aides, looking toward the monitor wall. The towering curved monitor wall fills the upper two-thirds of the picture. Ttalgi stands small but sharply lit at the right side of the wall, one arm outstretched with the laser pointer, a thin red dot on the main chart. In the lower foreground, the backs and heads of four or five meerkat aides seated around a long glass table, all looking up at the screen. TTALGI: The chubby round white cat (NOT slim) in a charcoal-grey suit, white shirt and bright red tie, laser pointer in one paw, tablet tucked under the other arm. Calm, confident, slightly bored expression, green eyes glowing in the screen light. MONITORS: Dozens of glowing panels: a huge bar chart where one tiny bar at the top towers over a long row of short bars (inequality), a pyramid diagram, scatter plots, a world-map-like heat map of the capital, and one panel with an icon of a wealthy animal silhouette in a top hat with a money bag turning its back on a small candle. Abstract shapes and icons only - no numbers, no letters. MEERKAT AIDES: Small meerkats in neat grey suits and thin black ties, tablets and notepads in paw, sitting very upright and attentive. SETTING: A sleek, modern, almost cold room - dark navy walls, a black glossy floor reflecting the screens, a long glass table with thin silver laptops, a small national flag (copy flag.png) on a stand in the corner, a single white chrysanthemum in a slim glass vase on the table. LIGHT & COLOR: Cool electric blue and cyan from the screens, deep shadows elsewhere; the only warm accent is Ttalgi's red tie. A clear contrast with the warm golden president office. MOOD: Cold, clinical, efficient - a war room where people are numbers.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- meerkat aides (Ttalgi's strategy aides) = small, upright meerkats in neat grey suits and thin black ties, holding tablets and notepads, nervous and obedient. NOT humans

PLACE: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk

PLACE: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 딸기의 추모 계층화 계획 2쪽 (책 65쪽)

✅ `forever/images/09-02.webp`

```text
1-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the strategy room. SCENE: Ttalgi switches the main screen to the plan for a "memorial tier system". The aides hold their breath in shock, and one aide timidly asks whether it is too harsh. COMPOSITION: Medium shot from the side of the glass table. The main screen dominates the upper half and shows the tier diagram. Ttalgi stands at the left beside the screen, presenting it with an open paw. The meerkat aides line the table in the lower half; one in the front raises a trembling paw. SCREEN: A tall glowing pyramid divided into tiers. The small top tier glows platinum-white and gold with icons of a crown, a graduation cap and a grand government building. The wide bottom tier is dull grey, with icons crossed out by red X marks: a gold coin, a bus, a hospital cross, and a small icon of prison bars. Icons only - no numbers, no letters. TTALGI: The chubby round white cat, standing tall with chin raised, a thin satisfied smile, one paw gesturing at the pyramid as if it is obvious. MEERKAT AIDES: All frozen with wide eyes and ears flattened; some cover their mouths with their paws, one drops a pen. The front meerkat raises a small trembling paw, sweat drop on the forehead, worried eyebrows. LIGHT & COLOR: The platinum tier casts a bright white-gold glow over Ttalgi; the grey tier throws cold grey light onto the aides' faces. MOOD: A collective gasp - shock behind polite silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- meerkat aides (Ttalgi's strategy aides) = small, upright meerkats in neat grey suits and thin black ties, holding tablets and notepads, nervous and obedient. NOT humans

PLACE: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 딸기의 추모 계층화 계획 3쪽 (책 66쪽)

✅ `forever/images/09-03.webp`

```text
1-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the strategy room. SCENE: Ttalgi turns to look coldly at the aide who called the plan harsh, and explains that it is an inevitable measure: once children's education, social status and public services depend on memorial, even the rich will have no choice but to memorialize. COMPOSITION: Close medium shot at eye level. Ttalgi is in the left foreground in 3/4 view, turning the head toward the aide, the face partly lit from below by the tablet. The small meerkat aide who objected is on the right, shrinking back in the chair. Behind them, a hologram floats above the glass table. TTALGI: The chubby round white cat, half-closed eyes, a cool, patient, slightly pitying look, one paw resting on the tablet; utterly certain. MEERKAT AIDE: Shrinking down, shoulders hunched, holding a notepad up like a shield, a big nervous sweat drop. Another meerkat beside it whispers worriedly behind a paw, glancing toward the door. HOLOGRAM: A glowing blue network: a small candle icon in the center, connected by glowing lines like chains to icons of a school with a little graduation cap, a house, a hospital cross and a briefcase. No text. LIGHT & COLOR: Cold cyan light, with a sharp highlight on Ttalgi's eyes; the red tie the only warm color. MOOD: Quietly menacing logic - the trap closing.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 딸기의 추모 계층화 계획 4쪽 (책 67쪽)

✅ `forever/images/09-04.webp`

```text
1-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the strategy room. SCENE: When the aides mention that Hamji will strongly object, Ttalgi snorts and mocks Hamji as a mere fanatic - rumored to be so obsessed with memorial that Hamji neglects home and is on the brink of divorce. Ttalgi is sure that the President, a realist, will choose data over emotion. COMPOSITION: Medium shot. Ttalgi in the center-left, leaning back against the glass table with a smug sneer. In the upper right, a hazy, dreamy rumor bubble (like a soft cloud, NOT a speech bubble, no text) shows the gossip. TTALGI: The chubby round white cat, arms folded, chin raised, one eyebrow lifted, a contemptuous smirk with a little puff of a snort from the nose. RUMOR BUBBLE: Inside, a small cozy living room at night: Hamji, the plump orange-and-white hamster in a grey suit, kneels in front of a home shrine with a framed portrait of the yellow duck President surrounded by candles and white chrysanthemums, praying devotedly with eyes shining. Behind Hamji, Hamji's wife - a hamster in a cardigan and apron - stands with arms crossed and a packed suitcase, glaring; a tiny crack runs across a framed wedding photo on the wall. MEERKAT AIDES: Two meerkats in the background exchange awkward glances. LIGHT & COLOR: Cool blue office light around Ttalgi; the rumor bubble is drawn in warm, faded sepia tones like a memory. MOOD: Gossip and arrogance - darkly funny.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 딸기의 추모 계층화 계획 5쪽 (책 68쪽)

✅ `forever/images/09-05.webp`

```text
1-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the strategy room. SCENE: Ttalgi announces that the tier system will be tested first at the "Memorial: The Live" concert - seats assigned by memorial tier, with special privileges for the Platinum tier - so the people will feel it firsthand. The aides bow: "Understood, Chief." COMPOSITION: Dramatic wide shot. Above the glass table floats a large 3D hologram of a concert hall. Ttalgi stands at the head of the table on the left, one paw raised over the hologram like a conductor. The meerkat aides, now standing in a row along the table, bow deeply in unison. HOLOGRAM: A glowing miniature concert hall with a stage in front decorated with candles and white chrysanthemums. The front rows are plush red-velvet armchairs glowing gold behind a velvet rope, with tiny icons of a crown and a glass of juice; the middle rows are plain; the back rows are cramped grey benches behind a metal fence. No numbers, no letters. TTALGI: The chubby round white cat, a cold, ambitious little smile, green eyes reflecting the golden glow of the front rows, red tie bright. MEERKAT AIDES: Bowing in perfect unison, paws at their sides, faces hidden, completely obedient. LIGHT & COLOR: The hologram throws gold light on the front and cold grey light on the back; the rest of the room is dark navy. Long shadows of the bowing aides on the glossy floor. MOOD: Cold ambition - the first move in the war of loyalty.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- meerkat aides (Ttalgi's strategy aides) = small, upright meerkats in neat grey suits and thin black ties, holding tablets and notepads, nervous and obedient. NOT humans

PLACE: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 2장: 햄지의 순수 추모 광신

### 2장: 햄지의 순수 추모 광신 1쪽 (책 69쪽)

✅ `forever/images/10-01.webp`

```text
2-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: Hamji's office in the Presidential Secretariat, which looks less like an office and more like a shrine to the President. Hamji kneels before the biggest portrait and murmurs a prayer of loyalty. COMPOSITION (vertical): Low-angle view so the ceiling is visible. Top: the ceiling, also covered with framed photos of Minju-simin looking down. Middle: the back wall packed from floor to ceiling with framed photos of Minju-simin in every size (waving, saluting, smiling, giving speeches) and framed calligraphy scrolls of the President's sayings (brush squiggles only, no readable letters); in the center, the largest portrait on an altar-like cabinet with candles and white chrysanthemums. Bottom: Hamji kneeling small on a cushion, seen from behind in 3/4 view, paws pressed together in prayer. At the lower edge, Hamji's desk with a yellow rubber-duck plush toy sitting exactly in the center. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, eyes closed, lips moving, cheeks glowing with devotion. LIGHT & COLOR: Warm candle gold, almost church-like, with a slightly eerie glow - every duck in every photo seems to be looking at Hamji. MOOD: Devout and cozy on the surface, deeply creepy underneath.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 햄지의 순수 추모 광신 2쪽 (책 70쪽)

✅ `forever/images/10-02.webp`

```text
2-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: Hamji's phone buzzes with a message from Hamji's wife that their child is sick. Hamji glances at it, turns the phone face down and gently places the thick book of the President's sayings on top of it. Then the aides arrive - and at the door they all stop and bow in silence toward the wall of portraits before entering, an old rule of the Secretariat. COMPOSITION (vertical): Top half: the open office door in the background, where three chipmunk aides stand in a row bowing deeply in unison toward the portrait wall. Bottom half: a close-up of Hamji's desk - Hamji's paw placing a thick leather-bound book with a small duck emblem on its cover onto a face-down phone; small cartoon vibration lines around the phone. Hamji's face above it, calm and resolute, with only the faintest flicker of hesitation in the eyes. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie. CHIPMUNK AIDES: Small chipmunks with striped backs in grey vests and white shirts with blue ties, holding folders, bowing politely and a little nervously. DETAILS: The yellow rubber-duck plush on the desk, a candle, framed duck photos in the background. LIGHT & COLOR: Warm gold light on the desk; the doorway lit from the hallway. MOOD: Darkly comic and a little sad - the phone silenced under the holy book.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- chipmunk aides (Hamji's secretariat staff) = small chipmunks with striped backs in grey vests, white shirts and blue ties, holding folders, polite and a little nervous. NOT humans

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 햄지의 순수 추모 광신 3쪽 (책 71쪽)

✅ `forever/images/10-03.webp`

```text
2-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: Hearing that Ttalgi is pushing the "memorial tier system", Hamji slowly raises the head with a fanatical glint, calls it blasphemy, then springs up and declares that memorial must be equal for everyone - the true memorial the President spoke of. COMPOSITION (vertical): Low-angle shot. Top: the wall of framed duck portraits, the biggest one directly above Hamji like a halo. Middle and bottom: Hamji standing tall in the center (as tall as a small hamster can be), one paw raised high, cheeks puffed up round, eyes blazing with fanatical fire. The chipmunk aides at the lower edges lean back in surprise, folders clutched to their chests. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie; fur standing up slightly, whiskers trembling with passion. LIGHT & COLOR: Dramatic warm red-gold light from below, candles flaring. MOOD: Passionate, theatrical, a little unhinged.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- chipmunk aides (Hamji's secretariat staff) = small chipmunks with striped backs in grey vests, white shirts and blue ties, holding folders, polite and a little nervous. NOT humans

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 햄지의 순수 추모 광신 4쪽 (책 72쪽)

✅ `forever/images/10-04.webp`

```text
2-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: Hamji writes the "Pure Memorial Pledge" on a tall whiteboard - but Hamji is too short to reach the top, so Hamji climbs onto a swivel chair while two aides anxiously hold it steady. Then Hamji takes out a box of gold badges, each engraved with the President's face, handmade overnight. COMPOSITION (vertical): Top two-thirds: the tall whiteboard covered with neat handwriting-like squiggles (no readable letters) and a small doodle of a heart and a duck; Hamji standing on tiptoe on a wobbly swivel chair, stretching up with a marker; two chipmunk aides gripping the chair with sweat drops. Bottom third: on the desk, an open wooden box overflowing with shiny round gold badges, each embossed with a tiny duck face, glittering. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, tongue poking out in concentration. LIGHT & COLOR: Warm office light; the badges sparkle with gold highlights. MOOD: Funny and earnest.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- chipmunk aides (Hamji's secretariat staff) = small chipmunks with striped backs in grey vests, white shirts and blue ties, holding folders, polite and a little nervous. NOT humans

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 햄지의 순수 추모 광신 5쪽 (책 73쪽)

✅ `forever/images/10-05.webp`

```text
2-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: One aide carefully asks whether people will really memorialize without any reward. Hamji turns and stares at the aide - the room feels several degrees colder - then shouts that memorial does not compromise, and that if people will not memorialize without reward, they must be taught what true memorial is. COMPOSITION (vertical): Top: Hamji's shadow stretched huge across the wall of duck portraits. Middle: Hamji in the center, turned toward the aide, one paw pointing up at the biggest portrait, mouth open mid-shout, eyes wide and intense. Bottom: the small chipmunk aide who asked, shrinking down with ears flat and a big sweat drop, holding a folder like a shield; the other aides huddled together behind. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, cheeks puffed, sweet face gone fierce. EFFECT: A light icy-blue tint and a few tiny frost marks creep in at the edges of the warm room, showing the sudden chill. MOOD: Frightening fervor - a sweet face shouting.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 햄지의 순수 추모 광신 6쪽 (책 74쪽)

✅ `forever/images/10-06.webp`

```text
2-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: Overwhelmed, the aide who questioned Hamji silently pins a gold badge on its own chest with trembling paws. Hamji walks to the window and looks across the courtyard at the Strategy Office, where a cold blue light glows, and vows to pull Ttalgi away from the President. On the desk, under the book of sayings, the phone buzzes once more - and Hamji does not look. COMPOSITION (vertical): Top half: Hamji at the tall window, seen from behind in 3/4 view, small silhouette against the night; across a dark courtyard, a modern building with one window glowing cold blue, a round cat silhouette faintly visible inside. Bottom half: in the foreground, the chipmunk aide pinning a gold duck badge on its chest with trembling paws; beside it on the desk, the leather book on top of the phone, with small vibration lines and a faint glow leaking from under it. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, paws clasped behind the back, determined. LIGHT & COLOR: Night. Warm candlelight inside the office, cold blue light outside across the courtyard. MOOD: Quiet, ominous and a little heartbreaking.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 3장: 들너구리의 고뇌

### 3장: 들너구리의 고뇌 1쪽 (책 75쪽)

✅ `forever/images/11-01.webp`

```text
3-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the culture office. SCENE: The office of the Minister of Memorial Culture. Deul-neoguri, worn out by the feud between Ttalgi and Hamji, has buried the face in the desk between three large draft memorial portraits of Deul-neoguri for the concert stage. Chumo-tusu bursts in with a paw raised high, eager to speak first - then sees the mood, freezes, and slowly lowers the paw, holding out a carton of banana milk as comfort. COMPOSITION (vertical): Top: the office walls lined with framed gold records, framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand in the corner. Middle: the big desk, with three large framed draft portraits of Deul-neoguri propped up on it - one smiling, one serious, one gazing into the distance - each with a small black mourning ribbon on the corner; Deul-neoguri's big head is buried face-down on the desk between them, the heavy gold chain clinking on the desk with a tiny sparkle. Bottom right: Chumo-tusu in the doorway, one paw frozen half-raised, the other paw holding out a small banana-milk carton, awkward smile. DEUL-NEOGURI: The big black gorilla in a black suit and tie, heavy gold chain and gold rings; slumped, exhausted. CHUMO-TUSU: The bright-eyed sea otter in a beige suit with a small baseball-glove pin. LIGHT & COLOR: Late-afternoon light, a little gloomy, with warm glints from the gold records. MOOD: Tired and comic - a star at the end of the rope.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 3장: 들너구리의 고뇌 2쪽 (책 76쪽)

✅ `forever/images/11-02.webp`

```text
3-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the culture office. SCENE: Deul-neoguri leans back, sips the banana milk through a straw and quietly explains the real intention: to look back on life while still alive, to turn a life into art - but now it has become a tool of a political fight. COMPOSITION (vertical): Top: a soft, warm daydream cloud (no text) showing a young Deul-neoguri rapping passionately on a tiny stage in a small club, a handful of fans cheering. Middle: Deul-neoguri sitting back in the big chair, sipping banana milk through a straw, gazing up at the memory with sad, gentle eyes. Bottom: Chumo-tusu sitting across the desk, listening with a notepad, eyes sparkling with sympathy. DEUL-NEOGURI: The big black gorilla in a black suit and tie, gold chain and rings; gentle, wistful face. CHUMO-TUSU: The sea otter in a beige suit with a baseball-glove pin. LIGHT & COLOR: The daydream glows in warm sepia and gold; the office below is a cooler, quieter grey-blue. MOOD: Nostalgic and bittersweet.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 3장: 들너구리의 고뇌 3쪽 (책 77쪽)

✅ `forever/images/11-03.webp`

```text
3-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the culture office. SCENE: Deul-neoguri does an impression of Ttalgi's flat, expressionless voice, repeating Ttalgi's demand to rewrite the second verse because it scores low with the target age group - then holds up Ttalgi's corrected lyric sheet, so covered in red pen marks that there are more red lines than lyrics. COMPOSITION (vertical): Top: behind Deul-neoguri, a faint ghostly image of Ttalgi (the chubby round white cat in a charcoal-grey suit and red tie) in exactly the same stiff pose, as if being imitated. Middle: Deul-neoguri standing stiffly with a completely blank face, one paw holding a folder flat like a tablet, the other holding up a lyric sheet covered in red slashes and red scribbles (squiggles only, no readable letters). Bottom: Chumo-tusu covering the mouth with both paws, trying not to laugh, cheeks puffed. DEUL-NEOGURI: The big black gorilla in a black suit and tie, gold chain; deadpan imitation face, one eye twitching slightly. LIGHT & COLOR: Cool, flat office light with the bright red of the marks popping out. MOOD: Funny and a little bitter.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 3장: 들너구리의 고뇌 4쪽 (책 78쪽)

✅ `forever/images/11-04.webp`

```text
3-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the culture office. SCENE: Deul-neoguri points with the chin at a box beside the desk - Hamji's gift, full of gold badges with the President's face, with a note saying to hand them to every audience member. Hamji wants a "President's quotes recitation time" in the middle of the concert, with the audience bowing and chanting. Deul-neoguri wonders whether this is a concert or a religious ceremony. COMPOSITION (vertical): Top half: a dream bubble (no text) of the concert hall where the whole animal audience bows deeply in unison toward a giant portrait of Minju-simin on stage, while a tiny Deul-neoguri stands on the stage holding a microphone, completely confused. Bottom half: the real office - beside the desk, an open box overflowing with shiny gold duck-face badges and a small folded note card (no readable text); Deul-neoguri slumped in the chair, chin jutting toward the box, eyebrows raised in disbelief; Chumo-tusu peeking into the box, holding one badge up. DEUL-NEOGURI: The big black gorilla in a black suit and tie, gold chain; weary, baffled. CHUMO-TUSU: The sea otter in a beige suit with a baseball-glove pin. LIGHT & COLOR: The dream bubble glows with golden, cult-like light; the office is dim. MOOD: Absurd and uneasy - a concert turning into a ritual.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 3장: 들너구리의 고뇌 5쪽 (책 79쪽)

✅ `forever/images/11-05.webp`

```text
3-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the culture office. SCENE: Deul-neoguri picks up the old microphone in the corner and mumbles a sad little rap - "Data on the left, faith on the right, where does my song go, caught in between." Chumo-tusu starts to clap alone, then sees the face and quietly stops. Chumo-tusu asks why not refuse both; Deul-neoguri answers it is impossible - the President ordered cooperation with both - "I just want to survive." COMPOSITION (vertical): A wide, lonely view of the big office in the evening. Top: tall window with the sunset fading to dusk, long shadows. Middle: Deul-neoguri sitting on the edge of a small stage-like platform in the corner, hunched, holding the vintage microphone low, a few small musical notes drooping sadly in the air. Bottom: Chumo-tusu frozen mid-clap, paws apart, awkward and sympathetic; the half-finished banana-milk carton on the floor between them. DEUL-NEOGURI: The big black gorilla in a black suit and tie, gold chain hanging heavy; tired eyes looking down. CHUMO-TUSU: The sea otter in a beige suit with a baseball-glove pin. LIGHT & COLOR: A single soft spotlight of dusk light through the window on Deul-neoguri, the rest of the room in deep blue shadow. MOOD: Melancholy - a star caught between two masters.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 4장: 막이 오르기까지

### 4장: 막이 오르기까지 1쪽 (책 80쪽)

✅ `forever/images/12-01.webp`

```text
4-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the government corridor. SCENE: A long, grand government corridor. Ttalgi strides out of the President's office hugging a clipboard folder stamped with the President's red approval seal. Hamji blocks the way - three gold duck-face badges pinned on the chest - and asks whether Ttalgi truly loves memorial. Ttalgi keeps walking without stopping; Hamji has to trot fast to keep up, three tiny steps for every one of Ttalgi's. COMPOSITION (vertical): Deep one-point perspective down the long corridor with tall windows, navy runners, portraits of the President and white chrysanthemums along the walls. Middle: Ttalgi walking toward the viewer, calm and unbothered, clipboard hugged to the chest. Bottom: Hamji trotting beside Ttalgi with short legs blurring in cartoon speed lines, looking up, paw raised mid-argument. TTALGI: The chubby round white cat in a charcoal-grey suit and red tie, cool half-closed eyes. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, three shiny gold badges on the chest, earnest and agitated. LIGHT & COLOR: Bright morning light in stripes across the floor. MOOD: Comic tension - one walks, one chases.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: a long, grand corridor of the Memorial Republic government building: tall arched windows, navy carpet runners, framed portraits of the President and white chrysanthemums along the walls

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 2쪽 (책 81쪽)

✅ `forever/images/12-02.webp`

```text
4-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the government corridor. SCENE: Ttalgi finally stops, coldly mentions Hamji's near-divorce, and walks away. Hamji stands frozen, pale, then takes out a small notebook and draws one more line under the name on the first page - eleven lines are already there. COMPOSITION (vertical): Top: far down the corridor, Ttalgi's small back walking away into the light. Middle and bottom: Hamji alone in the foreground, face drained pale, small paws holding open a little notebook; we see over Hamji's shoulder the first page with a single word-like squiggle (no readable letters) and a neat column of twelve tally lines beneath it, the newest one just drawn. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie with gold badges, face pale and grim, eyes shadowed. LIGHT & COLOR: The corridor turns cold and grey around Hamji; Ttalgi walks into warm light. MOOD: Quiet grudge - a list growing longer.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: a long, grand corridor of the Memorial Republic government building: tall arched windows, navy carpet runners, framed portraits of the President and white chrysanthemums along the walls

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 3쪽 (책 82쪽)

✅ `forever/images/12-03.webp`

```text
4-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the conference room. SCENE: The final planning meeting for "Memorial: The Live" in the big conference room of the Ministry of Memorial Culture. Before Deul-neoguri can even turn a page of the cue sheet, two paws shoot up at the same time - Ttalgi's and Hamji's. Chumo-tusu raises a paw out of habit too, then realizes there is nothing to say and sheepishly lowers it. COMPOSITION (vertical): Looking down the long conference table. Top: Minju-simin seated in a high-backed chair at the far head of the table (never on the table). Middle: Deul-neoguri at the side holding a cue sheet (squiggles only), mouth open, interrupted. Bottom foreground: Ttalgi on the left and Hamji on the right, both paws thrust straight up in perfect sync, glaring at each other across the table; Chumo-tusu between them, paw half-raised, awkward grin. CHARACTERS: Ttalgi (chubby round white cat, charcoal-grey suit, red tie), Hamji (plump hamster, grey suit, blue tie, gold badges), Deul-neoguri (big black gorilla, black suit, gold chain), Chumo-tusu (sea otter, beige suit), Minju-simin (yellow duck President, navy suit). SETTING: A long polished table with name plaques (no text), water bottles, white chrysanthemums; a big screen with a stage diagram. MOOD: Comic rivalry.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the big conference room of the Ministry of Memorial Culture: a long polished table, high-backed chairs, water bottles and white chrysanthemums, a big screen with a stage diagram, the national flag in the corner

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 4쪽 (책 83쪽)

✅ `forever/images/12-04.webp`

```text
4-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the conference room. SCENE: Ttalgi calls the pledge ceremony inefficient. Hamji answers by quoting the President's own speech - "Memorial is not a number. Memorial is the heart." Ttalgi's mouth opens and closes; there is no way to argue with the President's words using numbers. It is Hamji's first victory over Ttalgi, and Hamji savors it slowly, like a hamster chewing a sunflower seed stored in its cheek. COMPOSITION (vertical): Top: on the big screen behind, a still image of Minju-simin giving a solemn speech at a podium with candles (no text). Middle: Ttalgi, frozen with the mouth half open and the tablet lowered, a small sweat drop. Bottom: Hamji leaning back with eyes closed in bliss, cheeks puffed and chewing contentedly, a sunflower seed in one paw, little sparkles of triumph around. CHARACTERS: Ttalgi (chubby round white cat, charcoal-grey suit, red tie), Hamji (plump hamster, grey suit, blue tie). MOOD: Small, sweet, petty victory.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the big conference room of the Ministry of Memorial Culture: a long polished table, high-backed chairs, water bottles and white chrysanthemums, a big screen with a stage diagram, the national flag in the corner

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 5쪽 (책 84쪽)

✅ `forever/images/12-05.webp`

```text
4-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the conference room. SCENE: Minju-simin rules: do both - the people's participation corner between Part 1 and 2, the pledge ceremony between Part 2 and 3, and the reaction will be judged in numbers. Deul-neoguri looks down at the cue sheet where the minister's own slots keep shrinking. Then the President asks Chumo-daejang to handle the show's mood, and Chumo-daejang shouts "It's an honor!" COMPOSITION (vertical): Top: Minju-simin seated in the high-backed chair at the head of the table, one wing raised in a decisive gesture. Middle: Chumo-daejang springing up with a huge grin and a salute. Bottom: a close-up of Deul-neoguri's big hands holding the cue sheet, drawn as five colored blocks where the two middle blocks (the corner and the pledge) are fat and Deul-neoguri's own three blocks are squeezed thin; Deul-neoguri's sad face peeking over it. CHARACTERS: Minju-simin (yellow duck President, navy suit, seated, never on the table), Chumo-daejang (elephant in the sky-blue T-shirt with white '추모대장' lettering, silver whistle), Deul-neoguri (gorilla, black suit, gold chain). MOOD: Absurd bureaucracy.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the big conference room of the Ministry of Memorial Culture: a long polished table, high-backed chairs, water bottles and white chrysanthemums, a big screen with a stage diagram, the national flag in the corner

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 6쪽 (책 85쪽)

✅ `forever/images/12-06.webp`

```text
4-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the conference room. SCENE: After the meeting, Minju-simin secretly hands Chumo-daejang an envelope marked only "Part 3". Chumo-daejang opens it and smiles even more brightly than usual - which, for someone who always smiles, is rather frightening. Meanwhile, during the week before the show, the rivals fight with paperwork: five elderly applicants slipped onto the list by Hamji all get the same cancellation message from the Strategy Office. COMPOSITION (vertical): Top two-thirds: the empty conference room, chairs pushed back; Minju-simin (seated in the chair) handing a plain envelope to Chumo-daejang, who peeks inside with an enormous, slightly terrifying grin, eyes glinting; a long shadow on the wall. Bottom third: a small inset strip of five elderly animals (a goat, a sheep, an old dog, an old cat, an old rabbit) each looking at their phone in confusion at the same moment. CHARACTERS: Minju-simin (yellow duck, navy suit), Chumo-daejang (elephant, sky-blue T-shirt with white '추모대장' lettering, silver whistle). MOOD: Ominous secret wrapped in comedy.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the big conference room of the Ministry of Memorial Culture: a long polished table, high-backed chairs, water bottles and white chrysanthemums, a big screen with a stage diagram, the national flag in the corner

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 7쪽 (책 86쪽)

✅ `forever/images/12-07.webp`

```text
4-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: SCENE: The paperwork war escalates. Ttalgi places Hamji's pledge booth next to the 2nd-floor men's restroom behind a fire extinguisher. Hamji swaps the luxury fountain pens in the Platinum gift boxes for gold President badges. Ttalgi sticks barcodes on every badge. That night, Hamji scratches the barcodes off five hundred badges one by one - and breaks three claws. COMPOSITION (vertical): Top: a small inset of a sad little booth squeezed beside a restroom door and a red fire extinguisher. Middle: an inset of an elegant gift box with fountain pens being pulled out and gold badges going in, then a barcode sticker slapped on a badge. Bottom (largest): Hamji at a desk late at night under a lamp, surrounded by mountains of gold badges, scratching barcodes off with tiny claws, a pile of peeled barcode stickers, three little broken claw tips on the desk, tired but determined eyes. HAMJI: The plump orange-and-white hamster in a grey suit (jacket off, sleeves rolled up) and blue tie. MOOD: Petty war at its most ridiculous.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 8쪽 (책 87쪽)

✅ `forever/images/12-08.webp`

```text
4-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the strategy room. SCENE: 11 p.m., the night before the show. In the Strategy Office, Ttalgi scrolls participant profiles, keeping only those with clear motives, and says "These are the real citizens." Closing the drawer, Ttalgi pauses: at the bottom lies Ttalgi's own memorial tier card - Bronze. Ttalgi pushes it deep inside and locks the drawer. COMPOSITION (vertical): Top: the dark strategy room, monitors glowing with rows of profile cards (abstract icons). Middle: Ttalgi seated at the glass desk, face lit blue by the screen. Bottom: close-up of the open drawer and Ttalgi's paw pausing over a small dull bronze-colored card with a candle icon (no text), then reaching for a tiny key. TTALGI: The chubby round white cat in a charcoal-grey suit and red tie; for a split second the cool face shows something like embarrassment. LIGHT & COLOR: Cold blue night light, the bronze card a dull brownish glint. MOOD: A hidden crack in the perfect strategist.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 9쪽 (책 88쪽)

✅ `forever/images/12-09.webp`

```text
4-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: At the same hour in the Secretariat, Hamji kneels before the biggest portrait, three bandaged claws. The phone buzzes - it is Hamji's wife - Hamji switches it to silent and closes the eyes. "Your Excellency, tomorrow I will prove it." Neither the President on the wall, nor the President on the ceiling, nor the duck plush on the desk answers. COMPOSITION (vertical): Top: the ceiling and walls of framed duck portraits, all staring down silently. Middle: Hamji kneeling small before the altar of candles, bandaged paws pressed together. Bottom: the desk with the yellow rubber-duck plush and the phone face-down, its screen glow fading as it goes silent. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, three small bandages on the fingers, eyes closed. LIGHT & COLOR: Dim candlelight, deep shadows. MOOD: Lonely devotion.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 10쪽 (책 89쪽)

✅ `forever/images/12-10.webp`

```text
4-10. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In Bui's house. SCENE: At the same hour, the old tortoise Bui's house. Chumo-tusu, visiting late, confesses being afraid, but Bui silently keeps pouring tea. On the low table lies one of Hamji's sample pledge sheets, neatly folded. Bui picks it up and tucks it inside the robe: "Watch tomorrow." COMPOSITION (vertical): Top: a traditional Korean room with paper sliding doors, a low lamp, a scroll painting of mountains. Middle: Bui kneeling at a low wooden tea table, calmly pouring tea, tucking a folded paper into the durumagi. Bottom: Chumo-tusu kneeling opposite, paws gripping the knees, worried eyes. CHARACTERS: Bui (very old tortoise, long white eyebrows and beard, navy durumagi), Chumo-tusu (sea otter, beige suit). LIGHT & COLOR: Warm, quiet lamplight; steam rising from the cups. MOOD: Calm before the storm; a secret plan.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the old tortoise Bui's traditional Korean house: a quiet room with paper sliding doors, a low wooden tea table, a low lamp and a scroll painting of mountains

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 11쪽 (책 90쪽)

✅ `forever/images/12-11.webp`

```text
4-11. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the culture office. SCENE: At the same hour, in the culture office, Deul-neoguri finally chooses one of the three draft portraits - the face gazing into the distance. Checking the cue sheet one last time, Deul-neoguri finds a yellow sticky note slapped over the Part 3 song list ("to be announced"). Deul-neoguri calls Chumo-daejang, who cheerfully insists it's the President's order and that Part 3 will be "really, really fun" - and the call ends with the sound of a whistle. COMPOSITION (vertical): Top: a split panel - Chumo-daejang somewhere dark, phone to the ear, huge grin, silver whistle in the mouth, the "Part 3" envelope under one arm. Middle and bottom: the culture office at night; Deul-neoguri holding the phone away from the ear in shock, staring at the cue sheet in the other hand with a bright yellow sticky note on it (no readable text); on the desk, the chosen portrait (gazing into the distance) propped up, the other two placed face-down. CHARACTERS: Deul-neoguri (gorilla, black suit, gold chain), Chumo-daejang (elephant, sky-blue T-shirt with white '추모대장' lettering). MOOD: Creeping dread.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the office of the Minister of Memorial Culture, a rapper's office: walls lined with framed gold records and framed concert photos (no text), a shelf of colorful sneakers, a vintage microphone on a stand and a small stage-like platform in the corner, turntables, a big desk, white chrysanthemums, and a tall window

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 12쪽 (책 91쪽)

✅ `forever/images/12-12.webp`

```text
4-12. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Show day, the Grand Theater of the Ministry of Memorial Culture. Five entrances: a red carpet for Platinum, and for Bronze and General a fire-escape staircase by the parking lot, the line winding halfway around the building. In the Bronze line, a little kit tugs its father's sleeve and asks, "Then who has to die more for us to go in there?" The father hurriedly covers the kit's mouth. COMPOSITION (vertical): Top: the grand theater facade with banners and the national flag; a gleaming red carpet with velvet ropes and well-dressed animals in furs and jewels strolling in. Bottom (largest): the long line on a grey metal fire-escape staircase; a fox father in a cheap jacket and a little fox kit; the father clapping a paw over the kit's mouth in panic; the animals around pretending not to hear, but a few quietly nodding. LIGHT & COLOR: Golden light on the red carpet; flat grey shade on the staircase. MOOD: Funny and painfully sharp.

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 13쪽 (책 92쪽)

✅ `forever/images/12-13.webp`

```text
4-13. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Beside the line, two prison guards drag away Choi Muhyeon, the PR Chief, in a half-torn shirt toward the underground parking lot; a name-card wallet around the neck clacks against the stair railing. Someone mutters that the man looks familiar, but the line doesn't budge - everyone stares at their own tier card. Inside, a meerkat aide reports to Ttalgi that 67% of Bronze guests want a higher tier next time; Ttalgi nods: "Exactly as designed." COMPOSITION (vertical): Top two-thirds: on the staircase, two burly bulldog prison guards in grey uniforms hauling Choi Muhyeon, the Chief of Memorial Public Relations, by both arms - shirt half-torn, hair messy, a lanyard card wallet swinging (no readable text), a desperate face; the waiting animals in line all looking down at small cards in their paws, ignoring it. Bottom third: an inset of Ttalgi in a backstage control booth with a tablet, a meerkat aide reporting, Ttalgi giving a satisfied nod. MOOD: Chilling indifference.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 14쪽 (책 93쪽)

✅ `forever/images/12-14.webp`

```text
4-14. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: On the 2nd floor, next to the men's restroom, behind the fire extinguisher, Hamji stands alone at the pledge booth. Everyone passing is going to the restroom. A man coming out with wet hands picks up a pledge sheet - Hamji's eyes light up - then wipes the hands with it, crumples it and drops it in the bin. Bui, leaning on a cane, slowly passes and gives Hamji a single nod. COMPOSITION (vertical): Top: the restroom door sign (simple pictogram only) and a red fire extinguisher. Middle: Hamji at a tiny draped booth with a stack of pledge sheets and a box of gold badges, eyes sparkling with hope - while a raccoon in a suit dries its wet paws on a pledge sheet. Bottom: the crumpled sheet landing in a trash bin; Bui walking past slowly with a cane, nodding once. CHARACTERS: Hamji (plump hamster, grey suit, blue tie, gold badges, bandaged claws), Bui (old tortoise, navy durumagi, cane). MOOD: Tragicomic.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 15쪽 (책 94쪽)

✅ `forever/images/12-15.webp`

```text
4-15. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The lights go out. Deul-neoguri walks out under a spotlight; on the giant screen behind appears the chosen memorial portrait, the face gazing into the distance. "I am Deul-neoguri. Tonight, I will memorialize myself, while I am still alive." The beat drops and the first song begins: "Memorialize My Youth." COMPOSITION (vertical): Top: the giant LED screen showing Deul-neoguri's memorial portrait (gazing into the distance) with a black mourning ribbon, white chrysanthemums along the stage edge. Middle: Deul-neoguri center stage in a single white spotlight, microphone raised, gold chain gleaming, eyes closed with emotion. Bottom: the dark silhouettes of the audience - glowing candle lights in the general seats, plush red seats in front. CHARACTERS: Deul-neoguri (big black gorilla, black suit, gold chain and rings). LIGHT & COLOR: Pitch-dark hall, one strong spotlight, smoke haze, purple and gold stage lights. MOOD: Grand, sincere, a little absurd.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 16쪽 (책 95쪽)

✅ `forever/images/12-16.webp`

```text
4-16. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The screen shows young Deul-neoguri rapping, drenched in sweat, in an underground club with only three people in the audience. A few people in the general seats sniffle. The VIP seats complain: "Is this memorial? It's just bragging." "They promised fountain pens - why a badge? No barcode, either." Ttalgi's tablet shows high emotion but low memorial participation; Ttalgi takes a screenshot. COMPOSITION (vertical): Top: the giant screen with young Deul-neoguri rapping in a tiny underground club, three spectators. Middle: the general seats in the back, animals wiping tears with handkerchiefs. Bottom: the front VIP row of rich animals in furs and jewels - a peacock and a poodle - frowning, one holding up a gold badge with disdain; at the edge, Ttalgi in the dark with a tablet showing two bar meters, one high and one low (no numbers). CHARACTERS: Ttalgi (chubby round white cat, charcoal-grey suit, red tie), Deul-neoguri (on screen, young). MOOD: Split reactions.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 4장: 막이 오르기까지 17쪽 (책 96쪽)

✅ `forever/images/12-17.webp`

```text
4-17. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Finishing the last song, Deul-neoguri walks backstage and runs into Chumo-daejang, who is whistling with the "Part 3" envelope tucked inside the shirt. "Minister, Part 1 was so moving! Now it's my turn!" The stage lights come back on - and it is time for Ttalgi's people's participation corner. COMPOSITION (vertical): Top: backstage, dim, cables and road cases; Chumo-daejang beaming hugely, whistle in the mouth, the corner of an envelope peeking out of the T-shirt collar. Middle: Deul-neoguri, sweaty and exhausted, towel around the neck, looking at Chumo-daejang uneasily. Bottom: through a gap in the side curtain, the bright stage lights snapping back on, five empty chairs and a judges' table waiting. CHARACTERS: Chumo-daejang (elephant, sky-blue T-shirt with white '추모대장' lettering, silver whistle), Deul-neoguri (gorilla, black suit, gold chain). MOOD: Suspense - something is coming.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

## 5장: 국민 참여 코너 - 딸기의 승부수

### 5장: 국민 참여 코너 - 딸기의 승부수 1쪽 (책 97쪽)

✅ `forever/images/13-01.webp`

```text
5-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Part 2 of the concert begins - the people's participation corner. With a shrill blast of the whistle, the MC Chumo-daejang bounds to center stage, arms flung wide: "Part 1 was so moving, right? Applause!" The audience claps - only the VIP seats clap half a beat late. COMPOSITION (vertical): Top: the huge stage with a giant LED backdrop glowing with the national emblem (copy flag.png exactly), five empty chairs in a row. Middle: Chumo-daejang mid-leap at center stage, arms wide, silver whistle in the mouth, cheeks puffed from blowing it, big grin. Bottom: the audience clapping - plain seats clapping eagerly in the back, while in the plush red VIP front row rich animals in furs and jewels clap lazily, a beat behind. CHARACTERS: Chumo-daejang (exactly as in ch4-style.jpg: grey elephant with big floppy pink-lined ears and a long trunk, NO hair, NO suspenders, NO belt; a plain sky-blue #439ED5 T-shirt with only the big white Korean letters '추모대장' on the chest - no other logo; dark navy trousers; a silver whistle on a cord). LIGHT & COLOR: The same dark, cinematic concert lighting as ch4-style.jpg - deep purple and navy hall, warm gold spotlights, candle glows, a few colored beams; not a bright candy-colored game show. MOOD: Loud, festive, slightly manic.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 2쪽 (책 98쪽)

✅ `forever/images/13-02.webp`

```text
5-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Chumo-daejang announces the "People's Memorial Contest": five contestants will present their memorials and can win an instant tier upgrade. The crowd buzzes. The first judge is introduced - President Minju-simin, who rises from the VIP seats and waves, and the hall erupts in cheers. COMPOSITION (vertical): Top: the LED screen showing a big glowing tier ladder (bronze, silver, gold, platinum - colored steps with icons, no text). Middle: Chumo-daejang on stage pointing dramatically toward the audience with one arm. Bottom: in the VIP front row, Minju-simin standing up and waving one wing graciously, caught in a spotlight; the animals around cheering, some standing. CHARACTERS: Minju-simin (exactly as in ch4-style.jpg and ref-minju-simin.jpg: a bright-yellow RUBBER-DUCK President with a huge perfectly round head, small glossy black dot eyes, a wide flat orange bill, a tiny tuft on top, navy suit, white shirt, blue tie, small yellow ribbon pin - NOT a baby chick, no big cartoon eyes), Chumo-daejang (exactly as in ch4-style.jpg: grey elephant with big floppy pink-lined ears and a long trunk, NO hair, NO suspenders, NO belt; a plain sky-blue #439ED5 T-shirt with only the big white Korean letters '추모대장' on the chest - no other logo; dark navy trousers; a silver whistle on a cord). MOOD: Celebrity reveal.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 3쪽 (책 99쪽)

✅ `forever/images/13-03.webp`

```text
5-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The other two judges take their seats at the judges' table on stage: Ttalgi, with a short smile, and Chumo-yeolsa, the Director of Intelligence, completely expressionless. Chumo-yeolsa's tablet already shows profiles of all five contestants - including information nobody ever submitted. COMPOSITION (vertical): Top: Chumo-daejang at the edge of the stage gesturing toward the judges' table. Middle: a long judges' table with a glowing red buzzer button in front of each seat; Ttalgi sitting with a small confident smile, tablet in paw. Bottom: close on Chumo-yeolsa sitting stiffly beside Ttalgi, blank face, and the tablet screen glowing with five small profile cards with silhouettes, a magnifying-glass icon and a little eye icon (no readable text). CHARACTERS: Ttalgi (chubby round white cat, charcoal-grey suit, red tie), Chumo-yeolsa (fluffy brown teddy bear, button eyes, permanently blank face, charcoal-grey suit, navy tie, holding ONLY a tablet - no envelope, no folder, no papers). MOOD: Cold and quietly creepy under the bright lights.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 4쪽 (책 100쪽)

✅ `forever/images/13-04.webp`

```text
5-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The first contestant, Kim Minsu, a 32-year-old office worker with a wife and two kids, stands at the microphone, script trembling in the paws. Asked for the tier, Kim admits quietly: "Bronze... there haven't been any big memorial cases since the big-star shortage." All the Bronze audience members nod together: "Right, if only one big star would go..." COMPOSITION (vertical): Top: Kim Minsu small and nervous at the center mic in a cone of spotlight, script paper trembling. Middle: a close view of Kim's worried face. Bottom: rows of Bronze audience animals in plain clothes nodding in perfect unison, some whispering to each other. KIM MINSU: a tired young brown deer with tiny antler nubs, round glasses, cheap navy suit slightly too big, a family photo peeking from the jacket pocket. MOOD: Sympathetic and darkly funny.

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 5쪽 (책 101쪽)

✅ `forever/images/13-05.webp`

```text
5-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Kim Minsu explains wanting Platinum today because the eldest child starts elementary school next year and Platinum gives an admission bonus for top schools. Then Kim unfolds the script and begins: "I memorialize my grandfather, who passed away ten years ago, and who taught me diligence, honesty and the value of family..." COMPOSITION (vertical): Top: a soft, warm memory bubble (no text) of a kind old deer grandfather teaching a little fawn to ride a bicycle in a sunny park. Middle: Kim Minsu at the mic, reading the unfolded script, voice rising. Bottom: an inset of a small child deer with a big school backpack, and a shiny school gate with a golden star - the dream of the admission bonus. KIM MINSU: the young brown deer with round glasses and a navy suit. MOOD: Sincere feelings tangled with a practical goal.

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 6쪽 (책 102쪽)

✅ `forever/images/13-06.webp`

```text
5-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Kim Minsu bursts into tears, cries "Grandfather, I truly memorialize you!", kneels and bows deeply. Applause pours down. Ttalgi taps the tablet and announces the scores: emotional expression 8, sincerity 7, memorial-experience potential 9 - and praises Kim for honestly admitting needing the bonus: "Memorial must be practical to last." COMPOSITION (vertical): Top: Kim Minsu kneeling in a full traditional bow on the stage, tears streaming, glasses fogged. Middle: the audience applauding, some dabbing their eyes. Bottom: at the judges' table, Ttalgi calmly tapping the tablet, three glowing score bars floating above it (no numbers), a small approving smile; Chumo-yeolsa blank beside. CHARACTERS: Kim Minsu (young brown deer, glasses, navy suit), Ttalgi (chubby round white cat, charcoal-grey suit, red tie), Chumo-yeolsa (teddy bear, tablet only). MOOD: Tearful sincerity meets cold scoring.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 7쪽 (책 103쪽)

✅ `forever/images/13-07.webp`

```text
5-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Ttalgi presses the buzzer: "Instant upgrade to Platinum!" Kim Minsu bows again - this time toward the judges' table, and a little deeper than the bow to the grandfather. The audience murmurs: "So you just say it's for your kid's school." In the back row someone takes notes: grandfather, bonus, tears. COMPOSITION (vertical): Top: platinum-white confetti and a glowing platinum card icon on the LED screen; Ttalgi's paw pressing a big glowing button. Middle: Kim Minsu bowing very deeply toward the judges' table, nose almost touching the floor. Bottom: the audience murmuring behind their paws; in the back row, a weasel in a cheap coat scribbling notes in a little notebook (three tiny doodles: an old face, a star, a teardrop - no text). CHARACTERS: Kim Minsu (young brown deer, glasses, navy suit), Ttalgi (chubby round white cat). MOOD: Satire - the audience learning the trick.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 8쪽 (책 104쪽)

✅ `forever/images/13-08.webp`

```text
5-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Backstage, Hamji clenches a bandaged fist: "This isn't memorial. It's a transaction." On stage, the second contestant, Lee Jieun, a 28-year-old job seeker, memorializes a maternal grandmother for the public-company bonus; the third, Park Cheolsu, a small-business owner, memorializes a father for the business subsidy. COMPOSITION (vertical): Top half: in the dark wings, Hamji peeking out from behind the heavy curtain, bandaged paw clenched into a fist, cheeks puffed in anger. Bottom half: two small panels side by side on the bright stage: Lee Jieun at the mic holding a resume-like folder, and Park Cheolsu at the mic in a shopkeeper's vest holding a receipt-like paper (no readable text). LEE JIEUN: a young white rabbit in a black job-interview suit, ears neatly tied back. PARK CHEOLSU: a stout wild boar in a shirt and a shopkeeper's vest. HAMJI: the plump orange-and-white hamster, grey suit, blue tie, gold badges, bandaged fingers. MOOD: Growing outrage behind the curtain.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 9쪽 (책 105쪽)

✅ `forever/images/13-09.webp`

```text
5-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The fourth contestant, Choi Eunyoung, says straight away she came for her husband's promotion - and then peeks at writing on her palm to remember whom she is memorializing: "...my father-in-law." With each contestant the motive moves forward and the deceased falls back. Ttalgi gives all four generous scores: "Honest. Realistic. This is a true memorial citizen." COMPOSITION (vertical): Top: Choi Eunyoung at the mic, glancing down at an open palm with ink scribbles (no readable text), a sheepish smile. Middle: a visual metaphor on the LED screen behind: four big shiny icons (a graduation cap, a briefcase, a coin bag, a promotion arrow) in front, and four small faded framed photos of elderly animals pushed far into the background. Bottom: Ttalgi nodding with approval at the judges' table. CHOI EUNYOUNG: a woolly sheep in a pastel cardigan and pearl necklace. CHARACTERS: Ttalgi (chubby round white cat, charcoal-grey suit, red tie). MOOD: Absurd and biting.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 10쪽 (책 106쪽)

✅ `forever/images/13-10.webp`

```text
5-10. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The fifth contestant, Jeong Woojin, is already Gold and wants Platinum to be promoted to a senior civil-service post; attended 47 memorial events in a year but lacks experience points because there were no big memorial cases. COMPOSITION (vertical): Top: Jeong Woojin standing perfectly straight at the mic, a thick binder of attendance certificates under one wing. Middle: a holographic stack of many tiny candle icons rising beside Jeong like a tower (no numbers), showing all the events attended. Bottom: Chumo-daejang leaning in with the microphone, eyebrows raised, and the judges watching. JEONG WOOJIN: a stiff grey heron in a perfectly pressed grey civil-servant suit, thin tie, expressionless face, every feather in place. CHARACTERS: Chumo-daejang (exactly as in ch4-style.jpg: grey elephant with big floppy pink-lined ears and a long trunk, NO hair, NO suspenders, NO belt; a plain sky-blue #439ED5 T-shirt with only the big white Korean letters '추모대장' on the chest - no other logo; dark navy trousers; a silver whistle on a cord). MOOD: Bureaucratic deadpan.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 11쪽 (책 107쪽)

✅ `forever/images/13-11.webp`

```text
5-11. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Jeong Woojin gives a flat, five-sentence memorial for parents lost in a car accident five years ago - "Thank you. That is all." - then bows exactly 90 degrees and straightens exactly one second later. The hall goes silent. Ttalgi scores emotion 3, sincerity 2 - but calls 47 events "dedication" and presses the button: "Platinum, upgraded." COMPOSITION (vertical): Top: Jeong Woojin bowing at a perfect 90-degree angle, with a faint cartoon protractor-arc showing the exact angle. Middle: the silent audience, blank stares, someone mid-sneeze frozen. Bottom: Ttalgi calmly pressing the glowing buzzer with one paw, platinum light flashing. CHARACTERS: Jeong Woojin (stiff grey heron, grey suit), Ttalgi (chubby round white cat, charcoal-grey suit, red tie). MOOD: Deadpan comedy turning uncomfortable.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 12쪽 (책 108쪽)

✅ `forever/images/13-12.webp`

```text
5-12. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Boos erupt: "There's no feeling at all!" "Is that memorial?" But the other side answers: "So what, we're all just waiting for a big memorial case anyway." "Forget feelings, the tier is what matters." Unbothered, Ttalgi glances at Minju-simin, who is writing something with no expression - from Ttalgi's seat, it is impossible to see what. COMPOSITION (vertical): Top: the audience split down the middle - on one side animals booing and shaking fists, on the other side animals shrugging and waving tier cards. Middle: Ttalgi at the judges' table turning the head to look toward the VIP row. Bottom: Minju-simin seated in the VIP row, writing in a small black notebook with a fountain pen, face completely unreadable; the notebook page angled away so nothing can be seen. CHARACTERS: Ttalgi (chubby round white cat), Minju-simin (exactly as in ch4-style.jpg and ref-minju-simin.jpg: a bright-yellow RUBBER-DUCK President with a huge perfectly round head, small glossy black dot eyes, a wide flat orange bill, a tiny tuft on top, navy suit, white shirt, blue tie, small yellow ribbon pin - NOT a baby chick, no big cartoon eyes). MOOD: Tension and mystery.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 5장: 국민 참여 코너 - 딸기의 승부수 13쪽 (책 109쪽)

✅ `forever/images/13-13.webp`

```text
5-13. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Chumo-daejang closes the corner, arm thrust high: "See? Work hard and anyone can be upgraded!" Murmurs spread: "Still, one big memorial case is the fastest..." "When will the next one happen?" Hearing that, Chumo-daejang's smile grows just a little bigger. COMPOSITION (vertical): Top: Chumo-daejang center stage, one arm thrust high, confetti falling. Middle: whispering audience members leaning toward each other. Bottom: a close-up of Chumo-daejang's face from a low angle - the grin stretching even wider, eyes glinting, the edge of a plain envelope (no writing visible) peeking from the T-shirt collar. CHARACTERS: Chumo-daejang (exactly as in ch4-style.jpg: grey elephant with big floppy pink-lined ears and a long trunk, NO hair, NO suspenders, NO belt; a plain sky-blue #439ED5 T-shirt with only the big white Korean letters '추모대장' on the chest - no other logo; dark navy trousers; a silver whistle on a cord). LIGHT & COLOR: Bright stage lights above, but the close-up face lit eerily from below. MOOD: Festive surface, ominous underneath.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

## 6장: 2부 공연 - 살아있는 자의 추모

### 6장: 2부 공연 - 살아있는 자의 추모 1쪽 (책 110쪽)

✅ `forever/images/14-01.webp`

```text
6-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The stage goes dark again before Part 2 of the concert. In the dim side wings, Deul-neoguri looks back once: Chumo-daejang is fanning himself with the "Part 3" envelope and giving a big thumbs-up. Deul-neoguri takes off the heavy gold chain and hands it to Chumo-tusu - it is so heavy that Chumo-tusu staggers a step holding it with both paws. Maybe tonight is the last time Deul-neoguri's songs will be heard. COMPOSITION (vertical): Top: in the background of the dark wings, Chumo-daejang grinning, fanning with a plain envelope (no writing visible), thumb up. Middle: Deul-neoguri, seen from the side, lifting the gold chain over the head, a quiet, resigned face. Bottom: Chumo-tusu catching the huge gold chain with both paws, staggering, eyes wide; beyond the curtain edge, a sliver of the dark stage waiting. CHARACTERS: Deul-neoguri (big black gorilla, black suit and tie, gold rings - the gold chain coming off), Chumo-tusu (bright-eyed sea otter, beige suit, baseball-glove pin), Chumo-daejang (exactly as in ch4-style.jpg: grey elephant, NO hair, NO suspenders, plain sky-blue T-shirt with only the white '추모대장' letters, dark navy trousers, silver whistle). LIGHT & COLOR: Backstage darkness with a thin blue rim light; a sliver of warm stage light on the gold chain. MOOD: Quiet resignation before a sad song.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 6장: 2부 공연 - 살아있는 자의 추모 2쪽 (책 111쪽)

✅ `forever/images/14-02.webp`

```text
6-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Deul-neoguri walks out - without the gold chain - and says "Part 2 is the memorial of the present. I will memorialize myself, alive at this very moment." The voice is heavier than in Part 1; a low beat rolls in and the song begins: "I'm standing here now, alive, breathing - but I memorialize myself, because I'm already dying." COMPOSITION (vertical): Top: the huge dark stage with cold blue haze and a single narrow white spotlight from above. Middle: Deul-neoguri alone in the spotlight, NO gold chain, bare-necked in the black suit, head slightly bowed, holding the microphone close with both hands. Bottom: the dark audience silhouettes, a few candle lights. CHARACTERS: Deul-neoguri (big black gorilla, black suit and tie, gold rings, NO gold chain). LIGHT & COLOR: Cold, lonely blue and grey, a sharp white spotlight - much darker and colder than Part 1. MOOD: Heavy, introspective.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 6장: 2부 공연 - 살아있는 자의 추모 3쪽 (책 112쪽)

✅ `forever/images/14-03.webp`

```text
6-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "I was a rapper. Now I'm a politician. I memorialize that rapper - he's already dead, inside me." The giant screen shows the present Deul-neoguri: sitting in meetings, stamping documents, staring tiredly into a mirror. As the song ends, a huge framed memorial portrait slowly descends from above the stage - the face gazing into the distance, chosen last night. COMPOSITION (vertical): Top: a huge gold-framed memorial portrait of Deul-neoguri (gazing into the distance, black mourning ribbon on the corners) being lowered on cables from the fly loft. Middle: the giant screen split into three panels: Deul-neoguri slumped in a meeting chair, stamping papers with a red seal, and staring into a mirror with tired eyes (no text). Bottom: Deul-neoguri small in the spotlight, singing with eyes closed, NO gold chain. CHARACTERS: Deul-neoguri (big black gorilla, black suit and tie, NO gold chain). LIGHT & COLOR: Cold spotlight; the portrait catching a pale ghostly light as it descends. MOOD: Eerie and sad - a living man's funeral.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 6장: 2부 공연 - 살아있는 자의 추모 4쪽 (책 113쪽)

✅ `forever/images/14-04.webp`

```text
6-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The audience falls into a strange silence - not moved, but uncomfortable. "Isn't this too depressing?" "Is this what we came for?" "If a big memorial case happens, nobody will even need to memorialize him." Someone says "shh" - but it is a stifled laugh. At the judges' table, Ttalgi checks the tablet: "Audience reaction index 6.2. Self-pity doesn't sell." COMPOSITION (vertical): Top: rows of audience animals with awkward, uncomfortable faces, some whispering behind paws, one smothering a laugh while shushing. Middle: the stage far away with the hanging portrait and the small singer. Bottom: Ttalgi at the judges' table in the dark, tablet glowing with a modest bar meter (no numbers), bored, unimpressed expression; Chumo-yeolsa blank beside. CHARACTERS: Ttalgi (chubby round white boy cat, big round green eyes, NO eyelashes, charcoal-grey suit, red tie), Chumo-yeolsa (fluffy brown teddy bear, blank face, charcoal-grey suit, navy tie, tablet only). MOOD: Cringe and cold judgment.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 6장: 2부 공연 - 살아있는 자의 추모 5쪽 (책 114쪽)

✅ `forever/images/14-05.webp`

```text
6-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Deul-neoguri sings two more songs while the hall cools down. In the VIP seats the Platinum guests yawn: "When does it end?" "There's a Part 3 too." "No fountain pen, either..." In the front row, someone quietly unpins a gold duck badge and drops it under the seat - one of the badges Hamji scratched the barcode off all night. COMPOSITION (vertical): Top: the stage in the distance with Deul-neoguri still singing under the hanging portrait. Middle: the plush red VIP row - rich animals in furs and jewels (a lion in sunglasses, a peacock, a crocodile in a top hat) yawning hugely, checking watches. Bottom: a close-up at floor level under a red velvet seat - a paw letting a gold duck-face badge fall, the badge glinting as it drops into the dark beside a crumpled program. MOOD: Boredom and disrespect, quietly sad.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 6장: 2부 공연 - 살아있는 자의 추모 6쪽 (책 115쪽)

✅ `forever/images/14-06.webp`

```text
6-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The last song ends; Deul-neoguri bows. The applause is short. Looking up, Deul-neoguri sees the memorial portrait hanging overhead - neither smiling nor crying, only gazing into the distance. In the wings, Chumo-tusu clutches the gold chain in both paws and keeps clapping alone to the very end. The second intermission begins - next is Hamji's pure memorial pledge ceremony. COMPOSITION (vertical): Top: the huge memorial portrait of Deul-neoguri hanging above the stage, looking into the distance. Middle: Deul-neoguri on the empty stage, head raised, looking up at the portrait, small and alone, NO gold chain. Bottom: in the side wings, Chumo-tusu holding the gold chain pressed to the chest with one arm and clapping alone, eyes shining with tears; the house lights starting to come up for intermission. CHARACTERS: Deul-neoguri (big black gorilla, black suit, NO gold chain), Chumo-tusu (sea otter, beige suit, holding the gold chain). LIGHT & COLOR: The spotlight fading, house lights warming up; the portrait still lit. MOOD: Lonely and bittersweet.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 7장: 순수 추모 서약식 - 햄지의 승부수

### 7장: 순수 추모 서약식 - 햄지의 승부수 1쪽 (책 116쪽)

✅ `forever/images/15-01.webp`

```text
7-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The stage is transformed for the pledge ceremony. A giant portrait of President Minju-simin now covers Deul-neoguri's memorial portrait. Below it stands an altar draped in gold cloth, with a stack of pledge sheets and a box of gold duck-face badges - each badge still scarred where its barcode was scratched off. Hamji walks onstage, three fingers wrapped in bandages. COMPOSITION (vertical): Top: a towering gold-framed portrait of Minju-simin (the yellow rubber-duck President, navy suit, blue tie) hung in front of the old gorilla portrait, whose gold frame edge still peeks out behind it. Middle: the altar draped in shimmering gold cloth with candles, white chrysanthemums, a neat stack of pledge sheets (no readable text) and an open box of gold badges with little scratch marks. Bottom: Hamji walking up the stage steps, small and determined, bandaged fingers clasped. CHARACTERS: Hamji (plump orange-and-white hamster, grey suit, blue tie, gold badges on the chest, three bandaged fingers), Minju-simin in the portrait (exactly as minju-simin-ch4.jpg: rubber-duck, small black dot eyes, no eyelashes). LIGHT & COLOR: A warm, church-like golden glow on the altar; the rest of the hall dark purple. MOOD: Solemn, almost religious.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 2쪽 (책 117쪽)

✅ `forever/images/15-02.webp`

```text
7-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Hamji addresses the audience with a trembling voice: people memorialized for tiers, benefits and bonuses - is that true memorial? Quoting the President - "Memorial is not a number. Memorial is the heart." - Hamji kneels toward the President's portrait. COMPOSITION (vertical): Top: the huge duck portrait glowing above. Middle: Hamji kneeling on the stage before the altar, paws pressed over the heart, face lifted toward the portrait, eyes glistening. Bottom: the dark audience, faces lit faintly by candles, watching. CHARACTERS: Hamji (plump orange-and-white hamster, grey suit, blue tie, gold badges, bandaged fingers). LIGHT & COLOR: A single golden beam from above onto Hamji, like a saint in a painting. MOOD: Fervent and fragile.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 3쪽 (책 118쪽)

✅ `forever/images/15-03.webp`

```text
7-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "I want nothing - no experience points, no tier, no big memorial case. I remember, respect and love with a pure heart alone." Hamji turns to the audience and asks anyone who wants to memorialize purely, without reward, to stand up. The theater goes silent. COMPOSITION (vertical): Top: the altar and the duck portrait behind. Middle: Hamji standing at the front edge of the stage, both arms open toward the audience, hopeful. Bottom: the huge audience seen from the stage - rows and rows of animals sitting perfectly still, no one moving. CHARACTERS: Hamji (plump orange-and-white hamster, grey suit, blue tie, gold badges, bandaged fingers). MOOD: Hope hanging in the air.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 4쪽 (책 119쪽)

✅ `forever/images/15-04.webp`

```text
7-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Ten seconds. Twenty. Thirty. Nobody stands. A phone buzzes somewhere and someone hurriedly checks if it's a memorial alert. In the wings, Chumo-daejang taps his wristwatch. From the back row: "Pure memorial? Does that feed you?" Hamji's smile slowly freezes. COMPOSITION (vertical): Top: a row of audience faces - one checking a glowing phone, one yawning, one muttering sideways with a smirk. Middle: in the wings, Chumo-daejang tapping a wristwatch with a bored grin. Bottom: a close-up of Hamji's face, the smile stiffening, a single sweat drop, eyes starting to shine with hurt. CHARACTERS: Hamji (plump orange-and-white hamster), Chumo-daejang (exactly as in ch4-style.jpg: grey elephant, NO hair, NO suspenders, plain sky-blue T-shirt with only the white '추모대장' letters, silver whistle). MOOD: Painfully awkward silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 5쪽 (책 120쪽)

✅ `forever/images/15-05.webp`

```text
7-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The tap of a cane from the back of the audience. An old figure slowly rises; the spotlight finds him late. Hamji gasps: "Elder...?" In the wings, a loud clang - Chumo-tusu has dropped Deul-neoguri's gold chain in shock. The audience murmurs: "Isn't that Elder Bui?" COMPOSITION (vertical): Top: far back in the dark audience, the old tortoise Bui standing up with a cane, caught in a spotlight that has just swung over. Middle: heads in the audience turning around in surprise. Bottom: two small panels - Hamji on the stage with mouth open, paws over the mouth; and in the wings Chumo-tusu with both paws up in shock, the gold chain bouncing on the floor with a cartoon "clang" spark. CHARACTERS: Bui (very old tortoise, long white eyebrows and white beard, navy-blue durumagi, wooden cane), Hamji (hamster), Chumo-tusu (sea otter, beige suit). MOOD: A surprising turn.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 6쪽 (책 121쪽)

✅ `forever/images/15-06.webp`

```text
7-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Bui walks slowly up onto the stage and stands beside Hamji, ignoring the stack of pledge sheets on the altar. From inside the robe Bui takes out one neatly folded pledge sheet, its creases worn soft as if unfolded many times through the night. "People today wait for big memorial cases. They wait for someone to die. I do not call that memorial. I only wish to remember the dead." COMPOSITION (vertical): Top: the altar with the untouched stack of pledge sheets. Middle: Bui and Hamji side by side at center stage; Bui unfolding the worn sheet with old, careful hands; Hamji looking up at Bui in awe. Bottom: the audience leaning forward in the dark, listening. CHARACTERS: Bui (old tortoise, white beard, navy durumagi, cane), Hamji (hamster, grey suit, bandaged fingers). LIGHT & COLOR: A soft, quiet white light on Bui - calmer and plainer than the gold altar glow. MOOD: Quiet dignity.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 7쪽 (책 122쪽)

✅ `forever/images/15-07.webp`

```text
7-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Bui signs the pledge. Hamji gestures toward the President's portrait - but Bui turns his back on it and bows deeply toward somewhere beyond the audience. No one knows to whom. Hamji looks back and forth between the portrait and Bui in confusion. Applause bursts out, and one, two, three... elderly animals begin to stand: "I'll do it too." COMPOSITION (vertical): Top: the giant duck portrait behind, with Hamji's paw still pointing up at it. Middle: Bui at the front of the stage with his back to the portrait, bowing deeply toward the far darkness; Hamji's head swiveling between the two, confused. Bottom: the audience applauding, and several elderly animals (an old goat, an old sheep, an old dog, an old rabbit) rising from their seats one after another. CHARACTERS: Bui (old tortoise, navy durumagi), Hamji (hamster). MOOD: Moving and quietly subversive.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 8쪽 (책 123쪽)

✅ `forever/images/15-08.webp`

```text
7-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: About fifty people, mostly over sixty, sign. Hamji pins a gold badge on each chest by hand, bandaged fingers trembling, tears streaming: "Thank you... you are true memorial citizens." One grandmother takes out a handkerchief and carefully polishes the scratch marks on her badge. Young audience members sit with arms crossed: "They won't even raise our tier." "Waste of time." COMPOSITION (vertical): Top: a line of elderly animals on the stage. Middle: Hamji pinning a gold badge onto an old sheep's cardigan, tears running down the cheeks; beside them an old rabbit grandmother lovingly polishing her badge with a lace handkerchief. Bottom: young animals in the audience in hoodies and trendy jackets, arms crossed, bored and dismissive. CHARACTERS: Hamji (plump orange-and-white hamster, grey suit, blue tie, bandaged fingers). MOOD: Tender and lonely at the same time.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 9쪽 (책 124쪽)

✅ `forever/images/15-09.webp`

```text
7-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: At the judges' table Ttalgi reads the tablet: "Participation 1%. Average age 67. Ages 20-40: 0.2%. As expected." Yet Ttalgi's eyes linger on Bui for a moment - a scene numbers can't explain - and this time Ttalgi does not take a screenshot. In the VIP row, Minju-simin is still writing something. COMPOSITION (vertical): Top: Bui on the stage in the distance, standing quietly among the elders. Middle: Ttalgi at the judges' table, tablet glowing with a tiny bar (no numbers), but eyes lifted from the screen toward the stage, a thoughtful, unsettled look; the paw hovering over the screenshot button, not pressing it. Bottom: Minju-simin in the VIP row, head down, writing in the small black notebook, expressionless. CHARACTERS: Ttalgi (chubby round white boy cat, big round green eyes, NO eyelashes, charcoal-grey suit, red tie), Minju-simin (exactly as minju-simin-ch4.jpg: bright-yellow rubber-duck, small black dot eyes, NO eyelashes, NO jewelry, navy suit, blue tie). MOOD: A crack in certainty.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 7장: 순수 추모 서약식 - 햄지의 승부수 10쪽 (책 125쪽)

✅ `forever/images/15-10.webp`

```text
7-10. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: After the ceremony, Hamji staggers backstage, exhausted: "Fifty... only fifty out of five thousand..." In the pocket, the phone lights up - silent, but the light can't be hidden: "Our child is in the hospital. The fever won't go down. Please come." Hamji cries over the screen: "I'm sorry... but right now... for His Excellency..." As the phone goes back into the pocket, a siren begins to wail from the stage. COMPOSITION (vertical): Top: the backstage corridor, and through the curtain gap a sudden flash of red rotating siren light sweeping across the stage. Middle: Hamji slumped against a road case, holding the glowing phone in both bandaged paws, tears dripping onto the screen (the screen shows only a small hospital-cross icon, no readable text). Bottom: Hamji's shadow on the floor, long and small, starting to turn red in the siren light. CHARACTERS: Hamji (plump orange-and-white hamster, grey suit, blue tie, gold badges, bandaged fingers). LIGHT & COLOR: Dark blue backstage, the phone's cold white glow on Hamji's face, then red siren light bleeding in. MOOD: Heartbreak turning into alarm - a cliffhanger.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 8장: 추모 교정 특별무대

### 8장: 추모 교정 특별무대 1쪽 (책 126쪽)

⬜ 저장 이름: `16-01.webp`

```text
8-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Beep, beep, beep. Part 3 begins, but Deul-neoguri does not come out. The stage floods with red light; the President's portrait is taken away, revealing Deul-neoguri's memorial portrait hanging behind it again. Chumo-daejang bursts out of the wings waving the "Part 3" envelope over his head: "Part 3 is a special stage... the Memorial Correction Special Live!" COMPOSITION (vertical): Top: stagehands hauling the big duck portrait away on ropes, revealing the gold-framed memorial portrait of Deul-neoguri (gazing into the distance, black ribbon) behind it. Middle: Chumo-daejang running out to center stage, the plain envelope (no writing) held high, huge grin. Bottom: the audience bathed in red light, leaning forward with excitement. CHARACTERS: Chumo-daejang (exactly as in ch4-style.jpg: grey elephant, NO hair, NO suspenders, plain sky-blue T-shirt with only the white '추모대장' letters, dark navy trousers, silver whistle). LIGHT & COLOR: Blood-red stage wash with flashing red beacons, deep shadows. MOOD: Thrilling and ominous.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 2쪽 (책 127쪽)

⬜ 저장 이름: `16-02.webp`

```text
8-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The audience buzzes: "Memorial correction? Isn't that the reality show?" "They'll do it live on stage?" "This'll be fun!" Backstage, Deul-neoguri slowly crumples the cue sheet; Chumo-tusu, about to offer a banana milk, freezes. COMPOSITION (vertical): Top: excited audience faces in red light, pointing and chattering. Bottom (larger): backstage in the dark, Deul-neoguri (NO gold chain) crushing the cue sheet in one big fist, eyes closed in pain; beside him Chumo-tusu holding out a small banana-milk carton, frozen mid-gesture, worried. CHARACTERS: Deul-neoguri (big black gorilla, black suit, NO gold chain), Chumo-tusu (sea otter, beige suit; the gold chain hanging around Chumo-tusu's neck for safekeeping). MOOD: Dread behind the curtain.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 3쪽 (책 128쪽)

⬜ 저장 이름: `16-03.webp`

```text
8-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Chumo-daejang asks the crowd what to do with lazy and fake memorial-goers - "Correct them!" shouts someone from the Platinum seats. "Then let's welcome the master of memorial correction, Corrections Officer Aeguk-jwasu!" Aeguk-jwasu enters in a neat suit and leather gloves, bowing politely, followed by three people with tied hands being led out. COMPOSITION (vertical): Top: Chumo-daejang on one side of the stage with an arm flung out in introduction. Middle: Aeguk-jwasu walking into a white spotlight, bowing courteously, gloved hands folded. Bottom: behind, two bulldog guards leading out three captives with hands tied in front: Kim Manwoo, Sim Jinwoo and Choi Muhyeon, heads down. CHARACTERS: Aeguk-jwasu (grey wolf in a neat black suit, white shirt, black tie and black leather gloves; extremely polite smile with a manic glint in the eyes), Kim Manwoo (human, exactly as ref-kim-manwoo.png), Sim Jinwoo (human, exactly as ref-sim-jinwoo.png), Choi Muhyeon (human, exactly as ref-choi-muhyeon.png, shirt half-torn, lanyard card wallet), Chumo-daejang (elephant, sky-blue '추모대장' T-shirt). MOOD: A show of fear dressed as entertainment.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human
- Kim Manwoo (a lazy memorial-goer who skipped memorials for six months) = a human character drawn as a simple cartoon in the book's style, matching ref-kim-manwoo.png (made from the author's reference photo)
- Sim Jinwoo (a fake memorial-goer who joined only for experience points) = a human character drawn as a simple cartoon in the book's style, matching ref-sim-jinwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 4쪽 (책 129쪽)

⬜ 저장 이름: `16-04.webp`

```text
8-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "First, Kim Manwoo! Not a single memorial event in six months - even though three big memorial cases happened!" Boos rain down. The big screen shows Kim's phone settings: memorial alerts switched to "Do Not Disturb". The boos double. "I-I was busy..." Aeguk-jwasu lays a gloved hand on Kim's shoulder: "I am truly sorry, but that is no excuse." COMPOSITION (vertical): Top: the giant LED screen showing a huge phone settings screen with a bell icon crossed out and a moon icon (no readable text). Middle: Kim Manwoo standing hunched with tied hands, sweating, stammering. Bottom: Aeguk-jwasu's black-gloved hand resting on Kim's shoulder, the wolf smiling politely; the audience booing with thumbs down. CHARACTERS: Kim Manwoo (human, exactly as ref-kim-manwoo.png), Aeguk-jwasu (grey wolf, black suit, black leather gloves). MOOD: Public shaming, played as dark comedy.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Kim Manwoo (a lazy memorial-goer who skipped memorials for six months) = a human character drawn as a simple cartoon in the book's style, matching ref-kim-manwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 5쪽 (책 130쪽)

⬜ 저장 이름: `16-05.webp`

```text
8-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Aeguk-jwasu's grip tightens - "Argh!" - "Please don't scream. I don't like hearing it." Kim Manwoo kneels and shouts to the audience: "I'm sorry I missed the big memorial cases! I'm sorry I neglected memorial!" Applause bursts out. COMPOSITION (vertical): Top: a cartoon close-up of the gloved hand squeezing the shoulder with little comic stress lines (no injury). Middle: Kim Manwoo on both knees at center stage, crying out toward the audience with comic tears. Bottom: the audience clapping happily. CHARACTERS: Kim Manwoo (human, exactly as ref-kim-manwoo.png), Aeguk-jwasu (grey wolf, black suit, gloves, polite smile). MOOD: Slapstick cruelty - comic, never graphic.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Kim Manwoo (a lazy memorial-goer who skipped memorials for six months) = a human character drawn as a simple cartoon in the book's style, matching ref-kim-manwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 6쪽 (책 131쪽)

⬜ 저장 이름: `16-06.webp`

```text
8-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "Second, Sim Jinwoo! Joined every big memorial case, but with no sincerity - only for experience points!" The screen shows Sim's records: every participation lasted exactly 1 minute 1 second, the minimum to earn points. "But I attended every time!" "You did attend," Aeguk-jwasu nods. "But without sincerity. That is fraud disguised as memorial." COMPOSITION (vertical): Top: the LED screen showing a long column of identical stopwatch icons, each stopped at the same tiny slice (no numbers). Middle: Sim Jinwoo protesting with tied hands raised, indignant. Bottom: Aeguk-jwasu nodding slowly with a courteous, chilling smile. CHARACTERS: Sim Jinwoo (human, exactly as ref-sim-jinwoo.png), Aeguk-jwasu (grey wolf, black suit, gloves). MOOD: Absurd accusation.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Sim Jinwoo (a fake memorial-goer who joined only for experience points) = a human character drawn as a simple cartoon in the book's style, matching ref-sim-jinwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 7쪽 (책 132쪽)

⬜ 저장 이름: `16-07.webp`

```text
8-7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Aeguk-jwasu lightly slaps Sim's cheek - "Ah!" - "Oh, I'm sorry. My hand slipped." The audience laughs: those who watched the reality show know the line. "You can slip once more!" someone shouts. "If you all wish..." COMPOSITION (vertical): Top: a cartoon slap - Aeguk-jwasu's gloved hand mid-swing with motion lines, Sim Jinwoo's face turned with a comic star, cheek a little pink (no injury). Middle: Aeguk-jwasu bowing apologetically with a hand on the chest. Bottom: the audience laughing, one animal standing up and shouting with a paw cupped to its mouth. CHARACTERS: Sim Jinwoo (human, exactly as ref-sim-jinwoo.png), Aeguk-jwasu (grey wolf, black suit, gloves). MOOD: Slapstick, uncomfortable laughter.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Sim Jinwoo (a fake memorial-goer who joined only for experience points) = a human character drawn as a simple cartoon in the book's style, matching ref-sim-jinwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 8쪽 (책 133쪽)

⬜ 저장 이름: `16-08.webp`

```text
8-8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Smiling, Aeguk-jwasu swings again, harder - "Truly sorry. It slipped again." The hall roars; "More! More!" turns into a chant, and Aeguk-jwasu "slips" to the beat, apologizing every time. Ttalgi whispers: "Audience satisfaction 92.7%, today's highest." In the VIP row, Minju-simin puts down the pen and claps for the first time. COMPOSITION (vertical): Top: the audience chanting in rhythm, fists pumping. Middle: Aeguk-jwasu on stage in a rhythmic pose, bowing politely between motion-line swings; Sim Jinwoo dizzy with cartoon stars circling. Bottom: two insets - Ttalgi whispering to a meerkat aide with a glowing tablet meter, and Minju-simin in the VIP row clapping, the notebook closed on the knee. CHARACTERS: Aeguk-jwasu (grey wolf, black suit, gloves), Sim Jinwoo (human, ref-sim-jinwoo.png), Ttalgi (chubby round white boy cat, NO eyelashes, charcoal-grey suit, red tie), Minju-simin (exactly as minju-simin-ch4.jpg: rubber-duck, small black dot eyes, NO eyelashes, NO jewelry, navy suit, blue tie). MOOD: Mob frenzy as comedy.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Sim Jinwoo (a fake memorial-goer who joined only for experience points) = a human character drawn as a simple cartoon in the book's style, matching ref-sim-jinwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 9쪽 (책 134쪽)

⬜ 저장 이름: `16-09.webp`

```text
8-9. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "Third - today's highlight!" The last man dragged out makes one side of the audience murmur: half-torn shirt, a name-card wallet around the neck - "It's the man from the stairs!" Backstage, Deul-neoguri gasps: "Chief Choi..." Choi Muhyeon, the PR Chief, had stopped appearing at cabinet meetings two weeks ago, and nobody asked why - asking felt like volunteering to be next. COMPOSITION (vertical): Top: two bulldog guards pushing Choi Muhyeon into the spotlight, the lanyard wallet swinging. Middle: audience members pointing, recognizing him. Bottom: backstage, Deul-neoguri covering his mouth with one big hand, eyes wide. CHARACTERS: Choi Muhyeon (human, exactly as ref-choi-muhyeon.png, shirt half-torn, messy hair, lanyard card wallet), Deul-neoguri (gorilla, black suit, NO gold chain). MOOD: Shock of recognition.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 10쪽 (책 135쪽)

⬜ 저장 이름: `16-10.webp`

```text
8-10. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "Former PR Chief Choi Muhyeon! Carried a cabinet-member business card and enjoyed every glory, but his own memorial power was only Bronze!" At the judges' table, Ttalgi's paw unconsciously tightens on the tablet - Ttalgi is Bronze too. The audience jeers: "Hypocrite!" "PR Chief? He deceived us!" COMPOSITION (vertical): Top: Choi Muhyeon standing with tied hands, a giant glowing bronze-colored card icon projected on the screen behind him. Middle: the audience jeering and pointing. Bottom: a close-up of Ttalgi's white paw gripping the tablet tightly, and Ttalgi's eyes flicking nervously sideways. CHARACTERS: Choi Muhyeon (human, ref-choi-muhyeon.png), Ttalgi (chubby round white boy cat, charcoal-grey suit, red tie). MOOD: Hypocrisy exposed - and a hidden secret.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 11쪽 (책 136쪽)

⬜ 저장 이름: `16-11.webp`

```text
8-11. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Aeguk-jwasu, still polite, charges Choi Muhyeon with "deceiving the nation": carrying the card of "the face of the Memorial Republic" while neglecting a memorial-goer's duty. Choi protests weakly that his job was only to promote. "Promotion without sincerity is propaganda. If you didn't understand, we must teach you." Aeguk-jwasu claps once. COMPOSITION (vertical): Top: Aeguk-jwasu holding up Choi's name card between two gloved fingers like evidence. Middle: Choi Muhyeon pleading weakly, sweat on the brow. Bottom: Aeguk-jwasu's gloved hands meeting in a single sharp clap, a little burst of motion lines. CHARACTERS: Aeguk-jwasu (grey wolf, black suit, gloves), Choi Muhyeon (human, ref-choi-muhyeon.png). MOOD: Polite menace.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 12쪽 (책 137쪽)

⬜ 저장 이름: `16-12.webp`

```text
8-12. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: A chair is rolled out from the wings: surrounded by white chrysanthemums, a golden candle emblem on its backrest, two wires dangling from the armrests, and a name plate reading '전기 추모 의자' (Electric Memorial Chair). "Awesome!" "Is that real?" Aeguk-jwasu sits Choi in the chair and takes hold of the switch. COMPOSITION (vertical): Top: stagehands pushing in the ornate chair, white chrysanthemums piled around it, two cartoonish coiled wires from the armrests to a big lever box. Middle: Choi Muhyeon seated in the chair, gulping. Bottom: Aeguk-jwasu with a gloved hand on a big comic lever switch, smiling courteously; the audience gasping with delight. CHARACTERS: Aeguk-jwasu (grey wolf, black suit, gloves), Choi Muhyeon (human, ref-choi-muhyeon.png). TEXT: Only the small brass plate on the chair may show the Korean words '전기 추모 의자'. MOOD: Absurd horror-comedy prop.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 13쪽 (책 138쪽)

⬜ 저장 이름: `16-13.webp`

```text
8-13. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "What is your position?" "...I won't answer." "Wrong." Bzzzt! Choi jolts up, his hair shooting out in every direction like chrysanthemum petals. The audience bursts into laughter and cheers. "Again - your position?" "...Memorial PR Chief." COMPOSITION (vertical): Top: a cartoon zap - yellow zigzag lightning outlines around the chair. Middle: Choi Muhyeon bouncing in the seat, eyes wide, hair standing straight out like a puffy white-and-black chrysanthemum, cartoon smoke puffs (purely comic, no burns or injury). Bottom: the audience roaring with laughter. CHARACTERS: Choi Muhyeon (human, ref-choi-muhyeon.png), Aeguk-jwasu (grey wolf, black suit, gloves, hand on the lever). MOOD: Cartoon slapstick, darkly absurd - never graphic.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 14쪽 (책 139쪽)

⬜ 저장 이름: `16-14.webp`

```text
8-14. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "Correct! Then the PR Chief's most important duty?" Bzzzt! "To pile up memorial experience points! To memorialize hard!" "Wonderful!" cheers Chumo-daejang. "What does your business card exist for?" "...For the responsibility to memorialize hard." COMPOSITION (vertical): Top: Chumo-daejang bouncing at the side of the stage, clapping, whistle in the mouth. Middle: Choi Muhyeon in the chair with frazzled hair, shouting the answer, small cartoon sparks. Bottom: Aeguk-jwasu nodding approvingly like a teacher, gloved finger raised. CHARACTERS: Choi Muhyeon (human, ref-choi-muhyeon.png), Aeguk-jwasu (grey wolf, black suit, gloves), Chumo-daejang (exactly as in ch4-style.jpg, sky-blue '추모대장' T-shirt, silver whistle). MOOD: A grotesque quiz show.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 15쪽 (책 140쪽)

⬜ 저장 이름: `16-15.webp`

```text
8-15. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: "Last question. What is the fate of an official who neglected memorial?" A long silence. "...The Memorial Republic... is great..." "Wrong. State the fate." Bzzzt! "The Memorial Republic is great! I am a bad official! I will memorialize hard!" COMPOSITION (vertical): Top: Aeguk-jwasu leaning close to Choi's ear, polite and patient. Middle: Choi Muhyeon, exhausted, hair wildly frazzled, shouting at the top of his lungs with comic tears. Bottom: the big lever pulled down, cartoon lightning sparks. CHARACTERS: Choi Muhyeon (human, ref-choi-muhyeon.png), Aeguk-jwasu (grey wolf, black suit, gloves). MOOD: Broken into obedience - bleak satire.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 16쪽 (책 141쪽)

⬜ 저장 이름: `16-16.webp`

```text
8-16. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: The audience rises in a standing ovation: "Bravo!" "Officer Aeguk-jwasu is the best!" "Way better than the reality show!" Ttalgi checks the screen and, for the first time, looks surprised: "Audience satisfaction 97.3%. Live ratings 58.2%. An all-time record." COMPOSITION (vertical): Top: the whole hall on its feet, cheering wildly, confetti and phone lights. Middle: Aeguk-jwasu bowing gracefully center stage. Bottom: Ttalgi at the judges' table, eyes wide and mouth slightly open, the tablet glowing with a meter maxed out (no numbers). CHARACTERS: Aeguk-jwasu (grey wolf, black suit, gloves), Ttalgi (chubby round white boy cat, NO eyelashes, charcoal-grey suit, red tie). MOOD: Triumph of the spectacle.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 17쪽 (책 142쪽)

⬜ 저장 이름: `16-17.webp`

```text
8-17. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: Aeguk-jwasu lines up the three. "Now, greet everyone." "We were bad memorial-goers! But we have been corrected! We will wait for big memorial cases! We will pile up experience points! Long live the Memorial Republic!" The hall answers: "Long live! Long live big memorial cases!" Chumo-daejang blows the whistle to set the beat: beep, hurray! beep, hurray! COMPOSITION (vertical): Top: the three standing in a row - Kim Manwoo, Sim Jinwoo, Choi Muhyeon (frazzled hair) - bowing deeply in unison. Middle: Chumo-daejang beside them, whistle in the mouth, one arm pumping the rhythm. Bottom: the audience raising fists and chanting. CHARACTERS: Kim Manwoo (human, ref-kim-manwoo.png), Sim Jinwoo (human, ref-sim-jinwoo.png), Choi Muhyeon (human, ref-choi-muhyeon.png), Chumo-daejang (exactly as in ch4-style.jpg, sky-blue '추모대장' T-shirt, silver whistle). MOOD: Forced, frenzied patriotism.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of Memorial Public Relations (PR Chief)) = a human character (one of the few humans in the book): a cartoon office worker drawn in the same picture-book style as everyone else, matching ref-choi-muhyeon.png (made from the author's reference photo) - short black hair, light-blue shirt, khaki trousers
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human
- Kim Manwoo (a lazy memorial-goer who skipped memorials for six months) = a human character drawn as a simple cartoon in the book's style, matching ref-kim-manwoo.png (made from the author's reference photo)
- Sim Jinwoo (a fake memorial-goer who joined only for experience points) = a human character drawn as a simple cartoon in the book's style, matching ref-sim-jinwoo.png (made from the author's reference photo)

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere, EXCEPT the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided). Not 3D, not photorealistic.
```

### 8장: 추모 교정 특별무대 18쪽 (책 143쪽)

⬜ 저장 이름: `16-18.webp`

```text
8-18. 2D watercolor storybook illustration, vertical 2:3.

SCENE: At the grand theater. SCENE: As the cheers shake the theater, Deul-neoguri's memorial portrait still gazes into the distance at the top of the stage. Backstage, Deul-neoguri hangs his head: "Is this... the stage I wanted to make?" Leaning on the wall, Hamji murmurs: "Your Excellency... is this the memorial you wanted?" In the VIP row, Minju-simin rises, claps slowly - "Excellent. Truly excellent." - and closes the notebook. COMPOSITION (vertical): Top: the gorilla's memorial portrait high above the roaring hall, gazing into the distance. Middle: two side-by-side backstage panels - Deul-neoguri (NO gold chain) with head bowed, and Hamji leaning against the wall with eyes empty, bandaged paws hanging. Bottom: Minju-simin standing in the VIP row, clapping slowly, then closing the small black notebook with a snap. CHARACTERS: Deul-neoguri (gorilla, black suit, NO gold chain), Hamji (plump orange-and-white hamster, grey suit, blue tie, bandaged fingers), Minju-simin (exactly as minju-simin-ch4.jpg: rubber-duck, small black dot eyes, NO eyelashes, NO jewelry, navy suit, blue tie). LIGHT & COLOR: Red-and-gold glare on the stage; cold dark backstage. MOOD: Chilling triumph and quiet despair.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: the Grand Theater of the Ministry of Memorial Culture, venue of 'Memorial: The Live': a grand facade with banners and the national flag, a red-carpet entrance with velvet ropes, a grey fire-escape staircase by the parking lot, and inside a huge stage with a giant LED screen, white chrysanthemums and candle lights, plush red VIP seats in front and plain seats behind

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```
