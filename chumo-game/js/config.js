// 게임 규칙 상수. 콘텐츠(카드·인물·엔딩)는 여기가 아니라 data/*.json에 둔다.

// 수치 4개. key는 cards.json의 effects, endings.json의 stat에 그대로 쓰인다.
export const STATS = [
  { key: '민심', icon: '🕯️' },
  { key: '치안', icon: '🛡️' },
  { key: '국고', icon: '💰' },
  { key: '내각결속', icon: '🏛️' },
];

export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STAT_START = 50;

// 최근 며칠 안에 추가된 카드에 NEW를 붙일지
export const NEW_DAYS = 14;

// 같은 카드가 연달아 나오지 않도록 최근 N장은 뽑기에서 뺀다
export const RECENT_WINDOW = 4;

export const DATA_FILES = {
  cards: 'data/cards.json',
  characters: 'data/characters.json',
  endings: 'data/endings.json',
};

export const STORAGE_KEY_BEST = 'chumo-game:best';
