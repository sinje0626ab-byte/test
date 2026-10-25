import { describe, expect, it } from 'vitest';
import type { SleepLog } from '../types';
import {
  anchoredMinutes,
  buildTimes,
  clockOf,
  clockStats,
  dateKeyOf,
  efficiencyPct,
  formatDuration,
  lastDays,
  latencyMin,
  minutesToClock,
  resolveBedTime,
  resolveClockAfter,
  sleepDebt,
  sleepMin,
  timeInBedMin,
  validateTimes,
} from './sleepCalc';

// 로컬 시각 → ISO. 테스트가 어느 시간대에서 돌아도 같은 결과가 나오게 로컬 기준으로 만든다.
const at = (y: number, mo: number, d: number, h: number, m = 0) => new Date(y, mo - 1, d, h, m).toISOString();

const log = (bed: string, sleep: string, wake: string, date = dateKeyOf(wake)): SleepLog => ({
  id: date,
  date,
  bedTime: bed,
  sleepTime: sleep,
  wakeTime: wake,
  awakenings: 0,
  quality: 3,
  createdAt: wake,
  updatedAt: wake,
});

describe('기본 계산 (자정 넘김 포함)', () => {
  // 23:00 누움 → 23:20 잠듦 → 다음 날 07:00 깸
  const l = log(at(2026, 10, 22, 23), at(2026, 10, 22, 23, 20), at(2026, 10, 23, 7));

  it('누워있던 시간 = wake − bed', () => expect(timeInBedMin(l)).toBe(480));
  it('수면시간 = wake − sleep', () => expect(sleepMin(l)).toBe(460));
  it('잠드는 데 걸린 시간 = sleep − bed', () => expect(latencyMin(l)).toBe(20));
  it('수면효율 = 수면 ÷ 누움 × 100', () => expect(efficiencyPct(l)).toBeCloseTo((460 / 480) * 100, 5));
  it('date 는 기상한 날', () => expect(l.date).toBe('2026-10-23'));

  it('자정 이후에 누워도 정상', () => {
    const late = log(at(2026, 10, 23, 1, 30), at(2026, 10, 23, 1, 45), at(2026, 10, 23, 8));
    expect(sleepMin(late)).toBe(375);
    expect(timeInBedMin(late)).toBe(390);
  });

  it('누운 시간이 0 이하면 효율은 null', () => {
    expect(efficiencyPct(log(at(2026, 10, 23, 7), at(2026, 10, 23, 7), at(2026, 10, 23, 7)))).toBeNull();
  });
});

describe('기준 시각(18:00) 변환', () => {
  it('23:30 → 330, 01:00 → 420', () => {
    expect(anchoredMinutes('23:30')).toBe(330);
    expect(anchoredMinutes('01:00')).toBe(420);
    expect(anchoredMinutes('18:00')).toBe(0);
    expect(anchoredMinutes('17:59')).toBe(1439);
  });
  it('minutesToClock 는 하루를 넘으면 감는다', () => {
    expect(minutesToClock(15)).toBe('00:15');
    expect(minutesToClock(1440 + 75)).toBe('01:15');
    expect(minutesToClock(-30)).toBe('23:30');
  });
});

describe('취침 시각 평균/편차 — 자정 넘김', () => {
  it('23:30 과 01:00 의 평균은 00:15 (12:15 가 아님)', () => {
    expect(clockStats(['23:30', '01:00'])?.mean).toBe('00:15');
  });
  it('ISO 시각도 받는다', () => {
    const s = clockStats([at(2026, 10, 20, 23, 30), at(2026, 10, 22, 1, 0)]);
    expect(s?.mean).toBe('00:15');
    expect(s?.sdMin).toBe(45);
  });
  it('22:00 · 00:00 · 02:00 → 평균 00:00, 편차 약 98분', () => {
    const s = clockStats(['22:00', '00:00', '02:00'])!;
    expect(s.mean).toBe('00:00');
    expect(s.sdMin).toBeCloseTo(Math.sqrt((120 ** 2 * 2) / 3), 5);
  });
  it('모두 같은 시각이면 편차 0', () => expect(clockStats(['23:00', '23:00'])?.sdMin).toBe(0));
  it('빈 배열은 null', () => expect(clockStats([])).toBeNull());
  it('기상 시각도 같은 방식', () => expect(clockStats(['06:30', '07:30'])?.mean).toBe('07:00'));
});

describe('직접 입력 시각 해석', () => {
  it('18:00 이후 취침은 기상 전날 밤', () => {
    expect(resolveBedTime('2026-10-23', '23:00').toISOString()).toBe(at(2026, 10, 22, 23));
  });
  it('18:00 전 취침은 기상 당일', () => {
    expect(resolveBedTime('2026-10-23', '01:00').toISOString()).toBe(at(2026, 10, 23, 1));
  });
  it('잠든 시각은 누운 시각 이후 처음 오는 그 시각', () => {
    expect(resolveClockAfter(at(2026, 10, 22, 23, 40), '00:10').toISOString()).toBe(at(2026, 10, 23, 0, 10));
    expect(resolveClockAfter(at(2026, 10, 22, 23, 40), '23:55').toISOString()).toBe(at(2026, 10, 22, 23, 55));
    expect(resolveClockAfter(at(2026, 10, 22, 23, 40), '23:40').toISOString()).toBe(at(2026, 10, 22, 23, 40));
  });
  it('23:00 → 07:00 은 경고 없이 8시간', () => {
    const t = buildTimes('2026-10-23', '23:00', '23:15', '07:00');
    expect(t.bedTime).toBe(at(2026, 10, 22, 23));
    expect(t.sleepTime).toBe(at(2026, 10, 22, 23, 15));
    expect(t.wakeTime).toBe(at(2026, 10, 23, 7));
    expect(timeInBedMin(t)).toBe(480);
    expect(validateTimes(t)).toEqual([]);
  });
  it('잠든 시각이 자정을 넘어도 이어진다', () => {
    const t = buildTimes('2026-10-23', '23:50', '00:20', '07:00');
    expect(latencyMin(t)).toBe(30);
    expect(sleepMin(t)).toBe(400);
  });
  it('clockOf 는 로컬 HH:mm', () => expect(clockOf(at(2026, 10, 22, 23, 5))).toBe('23:05'));
});

describe('저장 전 경고', () => {
  it('깬 시각이 누운 시각보다 빠르면 경고', () => {
    const t = buildTimes('2026-10-23', '08:00', '08:15', '07:00');
    expect(validateTimes(t)).toContain('깬 시각이 누운 시각보다 빨라요.');
  });
  it('수면시간 16시간 초과면 경고', () => {
    const t = { bedTime: at(2026, 10, 22, 13), sleepTime: at(2026, 10, 22, 13), wakeTime: at(2026, 10, 23, 7) };
    expect(validateTimes(t)).toContain('수면시간이 16시간을 넘어요.');
  });
  it('딱 16시간은 괜찮다', () => {
    const t = { bedTime: at(2026, 10, 22, 15), sleepTime: at(2026, 10, 22, 15), wakeTime: at(2026, 10, 23, 7) };
    expect(validateTimes(t)).toEqual([]);
  });
});

describe('수면 부채 (최근 7일, 기록 없는 날 제외)', () => {
  const night = (d: number, sleepH: number) => {
    const wake = at(2026, 10, d, 7);
    const sleep = new Date(new Date(wake).getTime() - sleepH * 3600_000).toISOString();
    return log(sleep, sleep, wake);
  };
  it('목표 7시간, 6·7·5시간 → 부채 3시간', () => {
    const r = sleepDebt([night(23, 6), night(22, 7), night(20, 5)], 7, '2026-10-23');
    expect(r).toEqual({ debtMin: 180, count: 3 });
  });
  it('7일 밖 기록은 빼고, 더 잔 날은 상쇄된다', () => {
    const r = sleepDebt([night(23, 8), night(17, 4), night(16, 1)], 7, '2026-10-23');
    expect(r).toEqual({ debtMin: 2 * 60, count: 2 });
  });
  it('lastDays 는 월을 넘어 이어진다', () => {
    expect(lastDays('2026-11-02', 3)).toEqual(['2026-10-31', '2026-11-01', '2026-11-02']);
  });
});

describe('표시', () => {
  it('formatDuration', () => {
    expect(formatDuration(452)).toBe('7시간 32분');
    expect(formatDuration(45)).toBe('45분');
    expect(formatDuration(120)).toBe('2시간');
  });
});
