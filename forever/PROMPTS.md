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

남은 그림: **6장** (⬜ 남음 · ✅ 붙음)

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
- Choi Muhyeon (Chief of the Memorial Audit Office) = the ONLY human character: a simple cartoon office worker with short black hair, light-blue shirt, khaki trousers and a brown messenger bag, drawn in the same storybook style and not resembling any real person
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human
- Doberman bodyguards (the Presidential Security Detail) = two tall Doberman pinschers in black suits, white shirts and black ties, dark sunglasses and coiled earpiece wires, hands clasped in front, standing motionless at attention. NOT humans
- meerkat aides (Ttalgi's strategy aides) = small, upright meerkats in neat grey suits and thin black ties, holding tablets and notepads, nervous and obedient. NOT humans
- chipmunk aides (Hamji's secretariat staff) = small chipmunks with striped backs in grey vests, white shirts and blue ties, holding folders, polite and a little nervous. NOT humans
(Text exception: the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided) - this is the ONLY text allowed in any picture.)

PLACES:
- council hall: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon
- tv studio: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits
- president office: the President's grand office in the Memorial Republic government building: navy-blue and gold palette, a wide carved mahogany desk with the national emblem inlaid in gold on its front panel, behind it a tall high-backed tufted navy leather presidential chair with gold studs, tall arched windows with heavy navy velvet curtains tied with gold tassels, two national flags on gold poles, a green-shaded brass desk lamp, white chrysanthemums in blue-and-white vases, bookshelves with gilded spines, a navy carpet with a gold border, tall double doors, and a huge wall screen on the side wall. The President always sits IN the chair behind the desk (the desk top reaches the duck's chest); the President never stands or sits on the desk
- strategy room: the Memorial Strategy Office, Ttalgi's headquarters: a sleek, modern, cold data war room with dark navy walls, a black glossy floor reflecting the screens, a towering curved wall of glowing monitors full of charts and diagrams (abstract shapes only), a long glass table with thin silver laptops and holographic projections above it, a small national flag on a stand in the corner, and a single white chrysanthemum in a slim glass vase; lit by cool electric blue and cyan screen light
- secretariat: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

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

⬜ 저장 이름: `10-01.webp`

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

⬜ 저장 이름: `10-02.webp`

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

⬜ 저장 이름: `10-03.webp`

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

⬜ 저장 이름: `10-04.webp`

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

⬜ 저장 이름: `10-05.webp`

```text
2-5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: One aide carefully asks whether people will really memorialize without any reward. Hamji turns and stares at the aide - the room feels several degrees colder - then shouts that memorial does not compromise, and that if people will not memorialize without reward, they must be taught what true memorial is. COMPOSITION (vertical): Top: Hamji's shadow stretched huge across the wall of duck portraits. Middle: Hamji in the center, turned toward the aide, one paw pointing up at the biggest portrait, mouth open mid-shout, eyes wide and intense. Bottom: the small chipmunk aide who asked, shrinking down with ears flat and a big sweat drop, holding a folder like a shield; the other aides huddled together behind. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, cheeks puffed, sweet face gone fierce. EFFECT: A light icy-blue tint and a few tiny frost marks creep in at the edges of the warm room, showing the sudden chill. MOOD: Frightening fervor - a sweet face shouting.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 햄지의 순수 추모 광신 6쪽 (책 74쪽)

⬜ 저장 이름: `10-06.webp`

```text
2-6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the secretariat. SCENE: Overwhelmed, the aide who questioned Hamji silently pins a gold badge on its own chest with trembling paws. Hamji walks to the window and looks across the courtyard at the Strategy Office, where a cold blue light glows, and vows to pull Ttalgi away from the President. On the desk, under the book of sayings, the phone buzzes once more - and Hamji does not look. COMPOSITION (vertical): Top half: Hamji at the tall window, seen from behind in 3/4 view, small silhouette against the night; across a dark courtyard, a modern building with one window glowing cold blue, a round cat silhouette faintly visible inside. Bottom half: in the foreground, the chipmunk aide pinning a gold duck badge on its chest with trembling paws; beside it on the desk, the leather book on top of the phone, with small vibration lines and a faint glow leaking from under it. HAMJI: The plump orange-and-white hamster in a grey suit and blue tie, paws clasped behind the back, determined. LIGHT & COLOR: Night. Warm candlelight inside the office, cold blue light outside across the courtyard. MOOD: Quiet, ominous and a little heartbreaking.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hamji (Chief of Presidential Staff (fanatically devoted to the President)) = a plump orange-and-white hamster with big round cheeks and a gentle, soft face, grey suit and blue tie; eyes that shine with a pure, fanatical devotion. NOT a human
- Ttalgi (Chief of Memorial Strategy (cold, data-driven)) = a chubby, round, fluffy pure-white cat (a plump boy cat, NOT slim, NOT feminine): big round head, big round green eyes, small pink nose, pink-lined ears, long white whiskers, short legs and a round belly; charcoal-grey suit, white shirt, bright red tie; usually holds a tablet. Cute and soft in shape, but the expression is cool, calculating and data-driven. NOT a human

PLACE: Hamji's office in the Presidential Secretariat, more shrine than office: walls and even the ceiling covered with framed photos of the President and framed calligraphy scrolls of the President's sayings (brush squiggles only), an altar-like cabinet with the biggest portrait, candles and white chrysanthemums, a desk with a yellow rubber-duck plush in the exact center, a tall whiteboard, and a window looking across a courtyard; warm candle-gold light

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```
