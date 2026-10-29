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

남은 그림: **4장** (⬜ 남음 · ✅ 붙음)

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
- Hamji (Prime Minister) = a plump orange-and-white hamster with big cheeks, grey suit, blue tie, carrying a ledger. NOT a human
- Benesu-hoja (Chief of Memorial Corrections) = a dark-grey rabbit with long upright ears in a black tactical police uniform and boots, holding a black baton, with a small green-and-red parrot perched on its left shoulder. NOT a human
- Bukanistan (Chief of Memorial Security) = a white horse with a long flowing white mane, wearing a black cowboy hat and a navy suit, riding on the back of another white horse (a horse riding a horse). NOT a human
- Eoheung (Chief of the Memorial Weather Agency) = a chubby little tiger cub in a brown suit with a blue tie, paws clasped in front. NOT a human
- Ttalgi (a cabinet member) = a white cat with big green eyes, black suit and a bright red tie, sitting or standing very politely. NOT a human
- Aeguk-jwasu (Memorial Corrections Officer (prison warden)) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a black baton; always speaks with an extremely polite smile while the eyes gleam with a manic glint. NOT a human
- Choi Muhyeon (Chief of the Memorial Audit Office) = the ONLY human character: a simple cartoon office worker with short black hair, light-blue shirt, khaki trousers and a brown messenger bag, drawn in the same storybook style and not resembling any real person
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human
- Chumo-daejang (a Memorial Elder obsessed with forced cheerfulness) = an anthropomorphic ELEPHANT (elephant head with big floppy ears and a long trunk, no tusks, grey skin) wearing a plain sky-blue T-shirt (exact color #439ED5) with the white Korean letters '추모대장' printed large across the chest, dark navy trousers, and a silver whistle on a cord around the neck; a huge, permanent grin that never fades while the eyes stay sharp. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human
(Text exception: the white Korean letters '추모대장' on Chumo-daejang's sky-blue T-shirt (copy the lettering exactly from the attached T-shirt reference image if provided) - this is the ONLY text allowed in any picture.)

PLACES:
- council hall: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon
- tv studio: the glitzy studio of the Memorial Republic national TV station: bright colorful spotlights and lighting rigs, big TV cameras on dollies with red on-air lights, a raised stage, and tiered seats packed with a studio audience of animals in suits
- president office: the President's office in the Memorial Republic government building: a wide mahogany desk with the national emblem, tall windows with heavy navy curtains, the national flag on a stand, white chrysanthemums, and a huge wall screen

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

⬜ 저장 이름: `06-01.webp`

```text
6-1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. A huge wall screen shows a line graph shooting steeply upward like a rocket, glowing gold (no numbers). Minju-simin stands before it with wings clasped behind the back, calm and satisfied. Deul-neoguri, gold chain gleaming, reports excitedly holding a tablet, beaming like a trusted comrade.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the President's office in the Memorial Republic government building: a wide mahogany desk with the national emblem, tall windows with heavy navy curtains, the national flag on a stand, white chrysanthemums, and a huge wall screen

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 에필로그: 공포와 흥행 2쪽 (책 44쪽)

⬜ 저장 이름: `06-02.webp`

```text
6-2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office. Chumo-yeolsa stands perfectly straight beside the wall screen, which now shows small replay frames of the TV show stage with a tied-up sloth and a tied-up black rat (no text), and speaks with a cold blank face, holding only the tablet. Next to the teddy bear, Chumo-hamnido proudly holds up an official letter stamped with a candle-emblem seal (no readable text).

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human

PLACE: the President's office in the Memorial Republic government building: a wide mahogany desk with the national emblem, tall windows with heavy navy curtains, the national flag on a stand, white chrysanthemums, and a huge wall screen

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 에필로그: 공포와 흥행 3쪽 (책 45쪽)

⬜ 저장 이름: `06-03.webp`

```text
6-3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the president office, a split mood. On the warm, brightly lit side, Minju-simin nods with satisfaction while Deul-neoguri bows deeply in gratitude. In the far corner, in cool blue shadow by the tall window, the old tortoise Bui stands alone with arms folded, gazing outside with eyes full of deep sorrow, lips pressed shut in silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a bright-yellow rubber-duck-style duck: a HUGE perfectly round head about as big as the whole torso, drawn front-facing or in slight 3/4 view (never side profile), big glossy black dot eyes, a WIDE flat orange bill like a rubber duck, a small tuft of feathers on top, yellow wing-hands with fingers, chubby short body in a navy-blue suit, white shirt, blue tie, small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Rapper and Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the President's office in the Memorial Republic government building: a wide mahogany desk with the national emblem, tall windows with heavy navy curtains, the national flag on a stand, white chrysanthemums, and a huge wall screen

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 에필로그: 공포와 흥행 4쪽 (책 46쪽)

⬜ 저장 이름: `06-04.webp`

```text
6-4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: A wide night panorama of the Memorial Republic capital, the final page of Part 1. Countless apartment windows glow with candles and flickering TV screens; inside, tiny animal citizens bow and pray anxiously, some glancing over their shoulders in fear. Above the rooftops, giant glowing billboard screens show a spotlit concert stage with a gorilla silhouette holding a microphone (no text). Deep navy sky, a thin crescent moon, an eerie and melancholy ending.

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```
