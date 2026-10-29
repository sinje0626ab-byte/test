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
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Hamji (Prime Minister) = a plump orange-and-white hamster with big cheeks, grey suit, blue tie, carrying a ledger. NOT a human
- Benesu-hoja (Chief of Memorial Corrections) = a dark-grey rabbit with long upright ears in a black tactical police uniform and boots, holding a black baton, with a small green-and-red parrot perched on its left shoulder. NOT a human
- Bukanistan (Chief of Memorial Security) = a white horse with a long flowing white mane, wearing a black cowboy hat and a navy suit, riding on the back of another white horse (a horse riding a horse). NOT a human
- Eoheung (Chief of the Memorial Weather Agency) = a chubby little tiger cub in a brown suit with a blue tie, paws clasped in front. NOT a human
- Ttalgi (a cabinet member) = a white cat with big green eyes, black suit and a bright red tie, sitting or standing very politely. NOT a human
- Aeguk-jwasu (former Chief of Corrections) = a grey wolf in a grey camouflage winter jacket with a fur collar and a thick grey scarf, combat boots, holding a baton. NOT a human
- Choi Muhyeon (Chief of the Memorial Audit Office) = the ONLY human character: a simple cartoon office worker with short black hair, light-blue shirt, khaki trousers and a brown messenger bag, drawn in the same storybook style and not resembling any real person
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

PLACES:
- council hall: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

Do not draw anything yet. Reply only with "Ready". After that I will send one page at a time.
```

## 2단계 — 쪽마다 하나씩

### 표지

✅ `forever/images/cover.webp`

```text
Book cover illustration (no title text). 2D watercolor storybook illustration, vertical 2:3.

SCENE: Morning light on the grand stone steps of the Memorial Republic government building, its entrance decorated with black mourning ribbons, white chrysanthemum wreaths and the national flag. President Minju-simin stands proudly in the center. On both sides stand Chumo-yeolsa holding the tablet, Deul-neoguri saluting, Bui with arms folded, and Chumo-hamnido clutching newspapers, all solemn. In a corner of the steps, Hai is slumped and yawning. At the bottom, Lee Gija is scrambling up the stairs late with a briefcase, sweat flying. Far away, peeking from behind a pillar in the shadows, John Pukta watches with a sly grin. Leave clear open sky at the top for the book title (do not write any title).

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
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
Page 1. 2D watercolor storybook illustration, vertical 2:3.

SCENE: Council hall, the wall clock showing exactly 9 o'clock in the morning. President Minju-simin stands at the podium with one wing raised, delivering a passionate speech while looking down at the cabinet. The other animal ministers are seen small, from behind, seated around the long table.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그 2쪽 (책 2쪽)

✅ `forever/images/00-02.webp`

```text
Page 2. 2D watercolor storybook illustration, vertical 2:3.

SCENE: A hushed, solemn council hall. Deul-neoguri sits with head bowed, listening respectfully. Beside the window, the old tortoise Bui sits with arms folded, staring indifferently outside as slanted morning sunlight pours in.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 프롤로그 3쪽 (책 3쪽)

✅ `forever/images/00-03.webp`

```text
Page 3. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. A big screen next to the podium shows a graph arrow nose-diving downward (no numbers). Minju-simin pauses, looks slowly around the room, then points a wing at Chumo-yeolsa sitting at the far end of the table. The animal ministers exchange nervous glances.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 1장: 위기의 보고

### 1장: 위기의 보고 1쪽 (책 4쪽)

✅ `forever/images/01-01.webp`

```text
Page 4. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-yeolsa rises from the seat with perfectly straight posture and reads from the tablet with a blank face. On the big screen behind, a row of shining star icons is going dark one by one (the 'big star' shortage). Minju-simin listens from the podium.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 2쪽 (책 5쪽)

✅ `forever/images/01-02.webp`

```text
Page 5. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The screen shows a bar chart dropping like stairs and a coin pouch shriveling up (no numbers). The animal ministers around the table gasp and whisper to each other in shock. Only Chumo-yeolsa stays completely expressionless.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 3쪽 (책 6쪽)

✅ `forever/images/01-03.webp`

```text
Page 6. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The room lights dim. Chumo-yeolsa lowers the voice to report. On the screen, secret documents fly out of an open safe like paper airplanes through a window. Two work laptops on the table blink with red warning lights.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 4쪽 (책 7쪽)

✅ `forever/images/01-04.webp`

```text
Page 7. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-hamnido leaps up, knocking the chair back, face red with fury, newspapers crumpled in one paw, shouting. At the podium Minju-simin calmly raises one wing to stop the outburst. Deul-neoguri, sitting alongside, flinches in surprise.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Chumo-hamnido (Chief of Memorial Press Control) = a tall dark-grey wolf with sharp amber eyes and slicked-back fur, navy three-piece suit, hot-tempered, always about to jump out of the chair, clutching a bundle of newspapers. NOT a human
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 5쪽 (책 8쪽)

✅ `forever/images/01-05.webp`

```text
Page 8. 2D watercolor storybook illustration, vertical 2:3.

SCENE: A dark messy room full of cup-noodle cups and snack wrappers. John Pukta hunches at a keyboard in the monitor's glow, clutching its belly and cackling. Mocking laughing-face icons spill out of the monitor and float in the air (no text). Through the window, the government building is tiny in the distance.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- John Pukta (an online troll) = a sneaky black rat in an oversized black hoodie and round dark sunglasses, with a sly, cackling grin. NOT a human

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 6쪽 (책 9쪽)

✅ `forever/images/01-06.webp`

```text
Page 9. 2D watercolor storybook illustration, vertical 2:3.

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
Page 10. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Hai shrugs with both paws spread, making excuses. The air in the room turns icy: the whole scene is tinted cold blue and tiny icicles hang above the animal ministers' heads. At that very moment, the door of the hall starts to burst open.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Hai (a lazy senior official) = a sleepy grey koala in a rumpled suit with a loosened tie, half-closed droopy eyes, always slouching and yawning. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 8쪽 (책 11쪽)

✅ `forever/images/01-08.webp`

```text
Page 11. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Through the wide-open door, Lee Gija bursts in, briefcase under one arm, shirt wrinkled, tie crooked, sweat drops flying, frantically counting on its claws in panic. From the podium, Minju-simin looks down at Lee Gija with ice-cold eyes.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 1장: 위기의 보고 9쪽 (책 12쪽)

✅ `forever/images/01-09.webp`

```text
Page 12. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Dramatic close-up: Lee Gija's face turns as white as paper and the briefcase slips from its grip. Across the table, Chumo-yeolsa holds the tablet out toward Lee Gija with a blank face. Every animal minister's eyes are fixed on Lee Gija. A tense cliffhanger moment.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Chumo-yeolsa (Director of the Memorial Intelligence Service) = a fluffy brown teddy bear with button eyes and a permanently blank expression, charcoal-grey suit and navy tie, ramrod-straight posture, always holding a tablet. Carries NO envelope, NO folder and NO papers. NOT a human
- Lee Gija (Chief of Memorial Legal Affairs, always late) = a shaggy brown sloth in a wrinkled white shirt with a crooked tie, messy fur, beads of sweat, a battered briefcase under one arm. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

## 2장: 들너구리의 제안

### 2장: 들너구리의 제안 1쪽 (책 13쪽)

⬜ 저장 이름: `02-01.webp`

```text
Page 13. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, the air heavy with tension. Deul-neoguri slowly rises from the seat: a heavy gold chain hangs over the black suit and several rings glitter on the fingers. The face is deeply serious. The animal ministers around the table look up in silence.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 2쪽 (책 14쪽)

⬜ 저장 이름: `02-02.webp`

```text
Page 14. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Deul-neoguri walks slowly around the long table, one hand moving to a rapper's rhythm, gold chain and rings catching the light. Floating above like a daydream is a glowing new star being born. At the podium, Minju-simin tilts the head and raises one wing, asking a question.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 3쪽 (책 15쪽)

⬜ 저장 이름: `02-03.webp`

```text
Page 15. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall, a comic freeze-frame. Deul-neoguri proudly points both thumbs at itself under a dramatic spotlight. Behind, like a dream bubble, Deul-neoguri raps on a huge stage surrounded by candles, white chrysanthemums and a giant framed portrait of Deul-neoguri (no text). Every animal minister is frozen with jaws dropped; Minju-simin's bill hangs open.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 4쪽 (책 16쪽)

⬜ 저장 이름: `02-04.webp`

```text
Page 16. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Chumo-tusu springs up with eyes sparkling like stars, one paw raised high, applauding with excitement. Deul-neoguri nods with satisfaction while fanning out seven blank record sleeves (no text on them) like a hand of cards, a small film clapperboard tucked under one arm.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Chumo-tusu (an over-eager senior official) = a bright-eyed, overly enthusiastic sea otter in a beige suit with a small baseball-glove pin on the lapel, sparkling eyes, always eager to raise a paw first. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 5쪽 (책 17쪽)

⬜ 저장 이름: `02-05.webp`

```text
Page 17. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. Across the long table, the old tortoise Bui slowly lifts the head with a complicated, heavy expression, long white eyebrows drawn together. Facing Bui, Deul-neoguri places one hand over the heart and bows politely while answering. Sunlight falls between them like a dividing line.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```

### 2장: 들너구리의 제안 6쪽 (책 18쪽)

⬜ 저장 이름: `02-06.webp`

```text
Page 18. 2D watercolor storybook illustration, vertical 2:3.

SCENE: In the council hall. The old tortoise Bui has turned away and stands alone by the tall window, arms folded, gazing outside in silence, a lonely figure in the slanted light. At the podium, Minju-simin raises one wing firmly to settle the matter. Deul-neoguri, gold chain glinting, wears a small hopeful smile.

CHARACTERS IN THIS PICTURE (anthropomorphic animals, keep exactly as described):
- Minju-simin (the President) = a round, chubby bright-yellow duck with an orange bill (like a rubber duck), navy-blue suit, white shirt, blue tie, a small yellow ribbon pin on the left lapel, black shoes; calm but firm eyes. NOT a human
- Deul-neoguri (Minister of Memorial Culture) = a big black gorilla in a black suit and tie, gentle face, often giving a crisp military salute or politely bowing the head. NOT a human
- Bui (Elder statesman) = a very old, wise tortoise with long white eyebrows and a white beard, wearing a navy-blue Korean durumagi (hanbok overcoat), usually standing with arms folded and an indifferent face. NOT a human

PLACE: the State Council Room in the government building of the Memorial Republic: a long wooden conference table, a podium at one end, white chrysanthemums in vases on the table, tall windows with morning sunlight, and on the wall the national flag (navy blue with golden crescents cradling a candle flame above a white lotus) draped with a black mourning ribbon

No text, letters, numbers or speech bubbles anywhere. Not 3D, not photorealistic.
```
