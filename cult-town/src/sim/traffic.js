// 신호등 (29장 A): 동네 전체가 한 주기로 돈다. 시간은 게임 분 (s.minute) → 배속을 올리면 신호도 빨라진다.
// 가로(h) = 남부순환로를 달리는 차, 세로(v) = 신림로를 달리는 차.
//   주기: 가로 초록 → 노랑 → 모두 빨강 → 세로 초록 → 노랑 → 모두 빨강
// 사람은 '건너는 길의 차'가 빨강일 때만 건넌다: 위아래로 걸어 횡단보도에 들어가면 남부순환로(가로 차)를 건너는 것.
import { CLOCK, TRAFFIC } from '../config.js';

const M = CLOCK.minutesPerSecond;
const GO = TRAFFIC.greenSeconds * M; const YEL = TRAFFIC.yellowSeconds * M; const CLR = TRAFFIC.clearSeconds * M;
const HALF = GO + YEL + CLR;
export const CYCLE = HALF * 2;

// 그 시각 차 신호: { h: 'green'|'yellow'|'red', v: ... }
export function lightsAt(minute) {
  const t = ((minute % CYCLE) + CYCLE) % CYCLE;
  const one = (u) => (u < GO ? 'green' : u < GO + YEL ? 'yellow' : 'red');
  return t < HALF ? { h: one(t), v: 'red' } : { h: 'red', v: one(t - HALF) };
}

// 걷는 방향으로 어느 길을 건너나: 위아래로 걸으면 가로 길, 옆으로 걸으면 세로 길
export const crossingAxis = (dx, dy) => (dy !== 0 && dx === 0 ? 'h' : 'v');

// 사람이 지금 건너도 되나 (건너는 길의 차가 빨강이고, 다른 길 차가 초록인 동안만 새로 들어선다)
export function canWalk(minute, axis) {
  const t = ((minute % CYCLE) + CYCLE) % CYCLE;
  // 가로 길을 건너는 사람은 세로 초록 동안, 세로 길을 건너는 사람은 가로 초록 동안
  const start = axis === 'h' ? HALF : 0;
  const u = ((t - start) % CYCLE + CYCLE) % CYCLE;
  return u < GO;
}

// 지금부터 건널 수 있을 때까지 남은 게임 분 (건널 수 있으면 0)
export function walkWait(minute, axis) {
  if (canWalk(minute, axis)) return 0;
  const t = ((minute % CYCLE) + CYCLE) % CYCLE;
  const start = axis === 'h' ? HALF : 0;
  return ((start - t) % CYCLE + CYCLE) % CYCLE;
}

// 이동 시간 계산에 더하는 횡단보도 하나의 가장 긴 대기 (게임 분)
export const MAX_WALK_WAIT = CYCLE - GO;

// 시간대별 차 수 (화면에 동시에 있는 승용차 최대, 버스·오토바이 따로)
export function carBudget(minute, rain) {
  const h = minute / 60;
  let n = TRAFFIC.maxCars;
  if (h < TRAFFIC.quietBefore || h >= TRAFFIC.quietFrom) n = Math.ceil(n / 2);
  if (rain) n = Math.max(2, n - 1);
  return n;
}
export const headlightsOn = (minute, rain) => rain || minute >= TRAFFIC.lightsFrom * 60;
