import type { DailyFactors, SleepLog } from '../types';
import { average, latencyMin } from './sleepCalc';

// 생활 요인별 비교. 본인 기록 기반 참고 지표일 뿐이라 원인을 단정하는 문구는 쓰지 않는다.

/** 이만큼 기록이 쌓여야 요인 비교를 보여 준다 */
export const MIN_LOGS_FOR_FACTORS = 7;
/** 비교하는 두 묶음이 각각 이만큼은 있어야 보여 준다 */
export const MIN_SAMPLE = 3;

export type Metric = 'quality' | 'latency';

export interface FactorComparison {
  id: string;
  title: string;
  metric: Metric;
  withLabel: string;
  withoutLabel: string;
  withValue: number;
  withoutValue: number;
  withN: number;
  withoutN: number;
}

interface Rule {
  id: string;
  title: string;
  metric: Metric;
  withLabel: string;
  withoutLabel: string;
  /** true = 해당, false = 비해당, null = 기록 안 함(제외) */
  test: (f: DailyFactors) => boolean | null;
}

const RULES: Rule[] = [
  {
    id: 'caffeine',
    title: '오후 2시 이후 카페인',
    metric: 'quality',
    withLabel: '마신 날',
    withoutLabel: '안 마신 날',
    test: (f) => (f.caffeineLastTime === undefined ? null : f.caffeineLastTime !== null && f.caffeineLastTime >= '14:00'),
  },
  {
    id: 'alcohol',
    title: '술',
    metric: 'quality',
    withLabel: '마신 날',
    withoutLabel: '안 마신 날',
    test: (f) => (f.alcohol === undefined ? null : f.alcohol !== 'none'),
  },
  {
    id: 'screen',
    title: '자기 전 30분 폰 사용',
    metric: 'latency',
    withLabel: '본 날',
    withoutLabel: '안 본 날',
    test: (f) => f.screenBeforeBed ?? null,
  },
  {
    id: 'exercise',
    title: '30분 이상 운동',
    metric: 'quality',
    withLabel: '한 날',
    withoutLabel: '안 한 날',
    test: (f) => (f.exerciseMinutes === undefined ? null : f.exerciseMinutes >= 30),
  },
  {
    id: 'nap',
    title: '30분 이상 낮잠',
    metric: 'latency',
    withLabel: '잔 날',
    withoutLabel: '안 잔 날',
    test: (f) => (f.napMinutes === undefined ? null : f.napMinutes >= 30),
  },
  {
    id: 'stress',
    title: '스트레스',
    metric: 'quality',
    withLabel: '높은 날(4~5)',
    withoutLabel: '낮은 날(1~2)',
    test: (f) => (f.stress === undefined || f.stress === 3 ? null : f.stress >= 4),
  },
];

const metricOf = (l: SleepLog, m: Metric) => (m === 'quality' ? l.quality : latencyMin(l));

export function compareFactors(logs: SleepLog[], factors: DailyFactors[]): FactorComparison[] {
  if (logs.length < MIN_LOGS_FOR_FACTORS) return [];
  const byDate = new Map(factors.map((f) => [f.date, f]));
  const out: FactorComparison[] = [];
  for (const r of RULES) {
    const yes: number[] = [];
    const no: number[] = [];
    for (const l of logs) {
      const f = byDate.get(l.date);
      const t = f ? r.test(f) : null;
      if (t === null) continue;
      (t ? yes : no).push(metricOf(l, r.metric));
    }
    if (yes.length < MIN_SAMPLE || no.length < MIN_SAMPLE) continue;
    out.push({
      id: r.id,
      title: r.title,
      metric: r.metric,
      withLabel: r.withLabel,
      withoutLabel: r.withoutLabel,
      withValue: average(yes)!,
      withoutValue: average(no)!,
      withN: yes.length,
      withoutN: no.length,
    });
  }
  return out;
}
