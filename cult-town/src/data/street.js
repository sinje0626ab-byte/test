// 길에서 (29장 B·C): 교주 감정 표현 · 주민 반응 · 밖에서 만난 신도의 인사·모른 척·따라오기 · 신도끼리 인사.
// 몸짓은 전부 지어낸 것이다 (실제 종교 의식이 아님). 말풍선은 짧게, 큰따옴표 없이 (머리 위에 뜬다).

// 표현: id · 이름 · 머리 위 아이콘(도트, overlays.js EMOTE_ICON) · 종류 · 열리는 레벨
//   종류 greet: 인사 계열(호감↑) · pray: 길에서 기도(의심↑) · anger: 화남(의심↑) · plain: 반응만 · bless/clap: 레벨 해금
export const EMOTES = [
  { id: 'smile', label: '웃음', kind: 'greet', level: 1 },
  { id: 'wave', label: '손 흔들기', kind: 'greet', level: 1 },
  { id: 'bow', label: '꾸벅 인사', kind: 'greet', level: 1 },
  { id: 'heart', label: '하트', kind: 'greet', level: 1 },
  { id: 'pray', label: '기도', kind: 'pray', level: 1 },
  { id: 'sigh', label: '한숨', kind: 'plain', level: 1 },
  { id: 'angry', label: '화남', kind: 'anger', level: 1 },
  { id: 'what', label: '물음표', kind: 'plain', level: 1 },
  { id: 'bless', label: '축복 손짓', kind: 'bless', level: 3 },
  { id: 'clap', label: '박수 세 번', kind: 'clap', level: 5 },
];
export const DISMISS = { id: 'dismiss', label: '돌아가 있어', kind: 'dismiss' };

// 교주 머리 위 짧은 말 (아이콘 옆)
export const EMOTE_SAY = {
  smile: '허허', wave: '안녕하세요', bow: '(꾸벅)', heart: '고마워요', pray: '(두 손 모음)', sigh: '하아…',
  angry: '거참!', what: '응?', bless: '(손바닥을 쓱)', clap: '짝 짝 짝', dismiss: '먼저 가 있어요',
};

// 주변 사람 반응 (종류 → 말풍선 몇 줄). 같은 사람에게 같은 날 호감은 한 번만 오른다
export const REACT = {
  wave: ['안녕하세요~', '어, 네!', '(손 흔듦)'],
  bow: ['아이고, 네네', '(같이 꾸벅)', '안녕하세요'],
  smile: ['허허', '좋은 일 있으세요?', '(웃음)'],
  shy: ['아유 왜 이래요', '(멋쩍게 웃음)', '네? 저요?'],
  heart: ['저도요!', '(손으로 하트)', '에이 참'],
  flinch: ['깜짝이야', '뭐야, 왜 저래', '(움찔)'],
  stare: ['…길에서요?', '(힐끔)', '저 사람 뭐 해'],
  pray: ['(따라 두 손 모음)', '(눈을 꼭 감는다)', '(눈 감음)'],
  worry: ['무슨 일 있어요?', '힘내세요', '(어깨 토닥)'],
  glance: ['(힐끔)', '…', '바쁘다 바빠'],
  shrug: ['저도 몰라요', '(어깨 으쓱)', '길 잃으셨어요?'],
  clap: ['(짝 짝 짝)', '오늘 무슨 날이에요?', '(같이 박수)'],
};

// 밖에서 만난 신도의 인사 (29장 C-1). 나이대 말씨로 고른다. {호칭}은 그 주민이 교주를 부르는 말
export const GREET = {
  elder: ['아이고 {호칭}, 나왔어요?', '{호칭}, 안녕하세요. 밥은 잡쉈어요?', '{호칭}! 여기서 다 보네'],
  mid: ['{호칭}, 안녕하세요', '어, {호칭}! 안녕하세요', '{호칭}, 장 보러 나오셨어요?'],
  young: ['{호칭}! 안녕하세요!', '앗 {호칭}, 안녕하세요', '{호칭} 여기 웬일이세요?'],
};
// 모른 척 (29장 C-2): 고개를 돌리며
export const IGNORE = {
  with: ['(고개를 돌린다)', '(폰을 본다)', '(못 본 척)'],
  press: ['(모자를 푹 눌러쓴다)', '(먼 산)', '(못 본 척)'],
  rep: ['(눈을 피한다)', '(빠르게 지나간다)', '(괜히 간판을 본다)'],
};
// 모른 척을 더 자주 하는 교리 (비밀스러운 유형). 0~1, 그날 모른 척 확률에 더한다
export const SECRECY = { doomsday: 0.2, messiah: 0.1, meditation: 0.25, fortune: 0.05, shaman: 0.2, qigong: 0.1 };

// 열혈 신자 따라오기 (29장 C-3)
export const FOLLOW = {
  start: ['{호칭}, 어디 가세요? 같이 가요', '저 오늘 쉬는 날이라 따라갈게요', '{호칭} 짐 있으면 주세요'],
  chimeGood: ['우리 {호칭} 진짜 좋은 분이에요', '저도 처음엔 그랬어요', '{성소} 보리차가 진짜 맛있어요'],
  chimeBad: ['얼른 302호 와요, 지금!', '이 사람도 오면 다 풀려요', '{호칭} 말 들어요, 손해 없어'],
  back: ['네… 먼저 갈게요', '알겠어요. 이따 봬요', '(풀이 죽어 돌아간다)'],
  pressSeen: '기자가 줄 선 신도들을 수첩에 적는다.',
};
// 신도끼리 마주쳤을 때 (29장 C-4)
export const MEMBER_MEET = {
  hello: ['어, 302호 그분!', '{예배} 때 뵀죠?', '안녕하세요, 같이 다녀요'],
  reply: ['아 네! 반가워요', '저 뒷줄에 앉았었어요', '(꾸벅)'],
  newFriend: '{가}과(와) {나}이(가) 길에서 인사하다 친해졌다.',
};
