// 주민마다 대사 묶음 (24장 B). 파일 하나에 주민 열 명 안팎. 형식은 CLAUDE.md 24장 '대사 형식'.
import * as G1 from './sillim-1.js';
import * as G2 from './sillim-2.js';
import * as G3 from './sillim-3.js';
import * as G4 from './bongcheon-1.js';
import * as G5 from './bongcheon-2.js';
import * as G6 from './zones-1.js';
import * as G7 from './zones-2.js';
import * as G8 from './zones-3.js';

const G = [G1, G2, G3, G4, G5, G6, G7, G8];
export const VOICES = Object.assign({}, ...G.map((g, i) => g[`VOICES_${i + 1}`] ?? {}));
// 새로 쓴 사연 (stories.js 의 같은 주민 사연을 덮는다)
export const NEW_STORIES = Object.assign({}, ...G.map((g, i) => g[`STORIES_${i + 1}`] ?? {}));
