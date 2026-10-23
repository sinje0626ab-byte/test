import { addDays, format, parseISO, subDays } from 'date-fns';
import type { ClockTime, DateKey, PendingSleep, SleepLog } from '../types';

// 수면 계산 규칙. 화면·저장소를 모르는 순수 함수만 둔다 (sleepCalc.test.ts 참고).
// 시각은 모두 사용자 기기의 로컬 시간 기준이다.

const MIN = 60_000;
const DAY_MIN = 24 * 60;

/** 취침·기상 시각 평균/편차를 낼 때 쓰는 기준 시각(18:00). 자정을 넘는 시각을 이어 붙이기 위함 */
export const ANCHOR_MIN = 18 * 60;
/** 이보다 길면 저장 전에 경고, "잘게요" 뒤로 이만큼 지나면 마무리 안내 */
export const MAX_SLEEP_MIN = 16 * 60;

type TimeLike = string | Date;
const toDate = (t: TimeLike) => (typeof t === 'string' ? parseISO(t) : t);

export function minutesBetween(from: TimeLike, to: TimeLike): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / MIN);
}

type Times = Pick<SleepLog, 'bedTime' | 'sleepTime' | 'wakeTime'>;

/** 누워있던 시간 = wakeTime − bedTime (분) */
export const timeInBedMin = (l: Times) => minutesBetween(l.bedTime, l.wakeTime);
/** 수면시간 = wakeTime − sleepTime (분) */
export const sleepMin = (l: Times) => minutesBetween(l.sleepTime, l.wakeTime);
/** 잠드는 데 걸린 시간 = sleepTime − bedTime (분) */
export const latencyMin = (l: Times) => minutesBetween(l.bedTime, l.sleepTime);

/** 수면효율 = 수면시간 ÷ 누워있던 시간 × 100. 계산할 수 없으면 null */
export function efficiencyPct(l: Times): number | null {
  const inBed = timeInBedMin(l);
  if (inBed <= 0) return null;
  return Math.max(0, Math.min(100, (sleepMin(l) / inBed) * 100));
}

// ── 시각 ↔ 분 ─────────────────────────────────────────

export function clockToMinutes(c: ClockTime): number {
  const [h, m] = c.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToClock(min: number): ClockTime {
  const m = ((Math.round(min) % DAY_MIN) + DAY_MIN) % DAY_MIN;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** 하루 중 시각(분)을 기준 시각부터 흐른 분(0~1439)으로 바꾼다. 23:30 → 330, 01:00 → 420 */
export function anchoredMinutes(t: TimeLike | ClockTime, anchor = ANCHOR_MIN): number {
  const clock =
    typeof t === 'string' && /^\d{2}:\d{2}$/.test(t)
      ? clockToMinutes(t)
      : toDate(t).getHours() * 60 + toDate(t).getMinutes();
  return (((clock - anchor) % DAY_MIN) + DAY_MIN) % DAY_MIN;
}

/**
 * 시각들의 평균과 표준편차(분). 자정을 넘는 경우를 고려해 기준 시각부터의 분으로 계산한다.
 * 예) 23:30 과 01:00 의 평균은 00:15 (12:15 가 아니다)
 */
export function clockStats(times: (TimeLike | ClockTime)[], anchor = ANCHOR_MIN): { mean: ClockTime; meanMin: number; sdMin: number } | null {
  if (times.length === 0) return null;
  const xs = times.map((t) => anchoredMinutes(t, anchor));
  const avg = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - avg) ** 2, 0) / xs.length);
  const meanMin = (((avg + anchor) % DAY_MIN) + DAY_MIN) % DAY_MIN;
  return { mean: minutesToClock(meanMin), meanMin, sdMin: sd };
}

// ── 날짜 ─────────────────────────────────────────

export const dateKeyOf = (t: TimeLike): DateKey => format(toDate(t), 'yyyy-MM-dd');

function atClock(date: DateKey, clock: ClockTime): Date {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, m] = clock.split(':').map(Number);
  return new Date(y, mo - 1, d, h, m, 0, 0);
}

/**
 * 기상일 + 누운 시각(HH:mm) → 실제 누운 시점.
 * 18:00 이후면 기상일 전날 밤, 그 전이면 기상일 당일(새벽·낮)로 본다.
 */
export function resolveBedTime(wakeDate: DateKey, bedClock: ClockTime): Date {
  const sameDay = atClock(wakeDate, bedClock);
  return clockToMinutes(bedClock) >= ANCHOR_MIN ? subDays(sameDay, 1) : sameDay;
}

/** base 이후(같은 시각 포함) 처음 오는 clock 시각. 23:40 이후의 00:10 → 다음 날 00:10 */
export function resolveClockAfter(base: TimeLike, clock: ClockTime): Date {
  const b = toDate(base);
  const sameDay = atClock(dateKeyOf(b), clock);
  return sameDay.getTime() < b.getTime() - 59_999 ? addDays(sameDay, 1) : sameDay;
}

/** 직접 입력: 기상일 + 세 시각(HH:mm) → ISO 시각 세 개 */
export function buildTimes(wakeDate: DateKey, bed: ClockTime, sleep: ClockTime, wake: ClockTime): Times {
  const bedAt = resolveBedTime(wakeDate, bed);
  return {
    bedTime: bedAt.toISOString(),
    sleepTime: resolveClockAfter(bedAt, sleep).toISOString(),
    wakeTime: atClock(wakeDate, wake).toISOString(),
  };
}

export const clockOf = (t: TimeLike): ClockTime => format(toDate(t), 'HH:mm');

/** 잠든 시각 기본값: 누운 시각 + 15분 */
export const defaultSleepTime = (bedTime: TimeLike): Date => new Date(toDate(bedTime).getTime() + 15 * MIN);

// ── 검사 ─────────────────────────────────────────

/** 저장 전에 보여 줄 경고 문구. 빈 배열이면 문제없음 */
export function validateTimes(t: Times): string[] {
  const w: string[] = [];
  if (minutesBetween(t.bedTime, t.wakeTime) <= 0) w.push('깬 시각이 누운 시각보다 빨라요.');
  else if (minutesBetween(t.sleepTime, t.wakeTime) < 0) w.push('잠든 시각이 깬 시각보다 늦어요.');
  if (minutesBetween(t.sleepTime, t.wakeTime) > MAX_SLEEP_MIN) w.push('수면시간이 16시간을 넘어요.');
  return w;
}

/** "잘게요" 뒤로 16시간 넘게 지났는가 */
export function isPendingOverdue(p: PendingSleep | null, now: TimeLike = new Date()): boolean {
  return !!p && minutesBetween(p.bedTime, now) > MAX_SLEEP_MIN;
}

// ── 모아 보기 ─────────────────────────────────────────

/** 기준일(포함)부터 거꾸로 days 일 */
export function lastDays(today: DateKey, days: number): DateKey[] {
  const end = atClock(today, '12:00');
  return Array.from({ length: days }, (_, i) => dateKeyOf(subDays(end, days - 1 - i)));
}

/**
 * 수면 부채(최근 7일) = Σ(목표 수면시간 − 실제 수면시간). 기록 없는 날은 뺀다.
 * 음수면 목표보다 더 잤다는 뜻이다.
 */
export function sleepDebt(logs: SleepLog[], targetHours: number, today: DateKey, days = 7): { debtMin: number; count: number } {
  const range = new Set(lastDays(today, days));
  const inRange = logs.filter((l) => range.has(l.date));
  const debtMin = inRange.reduce((sum, l) => sum + (targetHours * 60 - sleepMin(l)), 0);
  return { debtMin: Math.round(debtMin), count: inRange.length };
}

export function average(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

/** 분 → { h, m }. 반올림한 분 기준 */
export function splitDuration(min: number): { h: number; m: number } {
  const t = Math.round(Math.abs(min));
  return { h: Math.floor(t / 60), m: t % 60 };
}

/** 452 → '7시간 32분', 45 → '45분', 120 → '2시간' */
export function formatDuration(min: number): string {
  const { h, m } = splitDuration(min);
  if (h === 0) return `${m}분`;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}
