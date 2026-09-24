import { melee } from './melee.js';
import { charger } from './charger.js';
import { ranged } from './ranged.js';
import { darter } from './darter.js';
import { burrower } from './burrower.js';
import { exploder } from './exploder.js';

// monsters.json의 behavior 이름 → 행동 모듈
export const BEHAVIORS = { melee, charger, ranged, darter, burrower, exploder };
