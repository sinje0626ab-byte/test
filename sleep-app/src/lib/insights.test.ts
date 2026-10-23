import { describe, expect, it } from 'vitest';
import type { DailyFactors, SleepLog } from '../types';
import { compareFactors } from './insights';

const mk = (day: number, quality: SleepLog['quality']): SleepLog => {
  const date = `2026-10-${String(day).padStart(2, '0')}`;
  return {
    id: date,
    date,
    bedTime: new Date(2026, 9, day - 1, 23).toISOString(),
    sleepTime: new Date(2026, 9, day - 1, 23, 20).toISOString(),
    wakeTime: new Date(2026, 9, day, 7).toISOString(),
    awakenings: 0,
    quality,
    createdAt: '',
    updatedAt: '',
  };
};

describe('요인 비교', () => {
  const logs = [mk(10, 2), mk(11, 2), mk(12, 3), mk(13, 4), mk(14, 4), mk(15, 3), mk(16, 4)];

  it('기록이 7일 미만이면 비교하지 않는다', () => {
    expect(compareFactors(logs.slice(0, 6), [])).toEqual([]);
  });

  it('카페인: 오후 2시 이후 마신 날 vs 안 마신 날 개운함 평균', () => {
    const factors: DailyFactors[] = [
      { date: '2026-10-10', caffeineLastTime: '16:00' },
      { date: '2026-10-11', caffeineLastTime: '15:30' },
      { date: '2026-10-12', caffeineLastTime: '14:00' },
      { date: '2026-10-13', caffeineLastTime: null },
      { date: '2026-10-14', caffeineLastTime: '09:00' },
      { date: '2026-10-15', caffeineLastTime: null },
    ];
    const [c] = compareFactors(logs, factors);
    expect(c.id).toBe('caffeine');
    expect(c.withValue).toBeCloseTo(7 / 3);
    expect(c.withoutValue).toBeCloseTo(11 / 3);
    expect([c.withN, c.withoutN]).toEqual([3, 3]);
  });

  it('한쪽 표본이 3일 미만이면 보여 주지 않는다', () => {
    const factors: DailyFactors[] = [
      { date: '2026-10-10', alcohol: 'some' },
      { date: '2026-10-11', alcohol: 'heavy' },
      { date: '2026-10-12', alcohol: 'none' },
      { date: '2026-10-13', alcohol: 'none' },
      { date: '2026-10-14', alcohol: 'none' },
    ];
    expect(compareFactors(logs, factors)).toEqual([]);
  });
});
