import { ChartColumn } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card, EmptyState } from '../components/Card';
import { Segmented } from '../components/controls';
import { Group } from '../components/Group';
import { CountNumber, DurationText, UnitValue } from '../components/numbers';
import { Page } from '../components/Page';
import { useNow } from '../hooks/useNow';
import { fmtDay, fmtWeekday } from '../lib/format';
import { compareFactors, MIN_LOGS_FOR_FACTORS, type FactorComparison } from '../lib/insights';
import { average, clockStats, dateKeyOf, efficiencyPct, formatDuration, lastDays, latencyMin, sleepMin } from '../lib/sleepCalc';
import type { LogSheetInit } from '../sheets/LogSheet';
import { useStore } from '../store/store';
import { SleepBars } from './stats/SleepBars';
import { SleepWindows } from './stats/SleepWindows';
import s from './Stats.module.css';

type Period = 'week' | 'month';
const PERIODS = [
  { value: 'week' as const, label: '주간' },
  { value: 'month' as const, label: '월간' },
];

export function Stats({ openSheet }: { openSheet: (i: LogSheetInit) => void }) {
  const { logs, factors, settings } = useStore();
  const [period, setPeriod] = useState<Period>('week');
  const now = useNow(60_000);
  const today = dateKeyOf(now);

  const view = useMemo(() => {
    const days = lastDays(today, period === 'week' ? 7 : 30);
    const byDate = new Map(logs.map((l) => [l.date, l]));
    const inRange = days.map((d) => byDate.get(d)).filter((l): l is NonNullable<typeof l> => !!l);
    const effs = inRange.map(efficiencyPct).filter((e): e is number => e !== null);
    return {
      bars: days.map((d, i) => ({
        date: d,
        // 월간은 5일마다만 날짜를 적는다
        tick: period === 'week' ? fmtWeekday(d) : (days.length - 1 - i) % 5 === 0 ? fmtDay(d) : '',
        minutes: byDate.has(d) ? sleepMin(byDate.get(d)!) : null,
      })),
      windows: days.map((d) => ({ date: d, tick: fmtWeekday(d), log: byDate.get(d) ?? null })),
      count: inRange.length,
      avgSleep: average(inRange.map(sleepMin)),
      avgEff: average(effs),
      avgLatency: average(inRange.map(latencyMin)),
      avgQuality: average(inRange.map((l) => l.quality)),
      bed: clockStats(inRange.map((l) => l.bedTime)),
      wake: clockStats(inRange.map((l) => l.wakeTime)),
    };
  }, [logs, period, today]);

  const comparisons = useMemo(() => compareFactors(logs, factors), [logs, factors]);

  if (logs.length === 0) {
    return (
      <Page title="통계">
        <EmptyState
          icon={<ChartColumn size={28} strokeWidth={1.75} />}
          title="기록이 쌓이면 패턴이 보여요"
          message="며칠만 기록해도 수면시간과 취침·기상 리듬을 한눈에 볼 수 있어요."
          action={
            <Button variant="tinted" onClick={() => openSheet({ mode: 'manual' })}>
              직접 입력
            </Button>
          }
        />
      </Page>
    );
  }

  const periodLabel = period === 'week' ? '최근 7일' : '최근 30일';

  return (
    <Page title="통계">
      <div className={s.segment}>
        <Segmented label="기간" options={PERIODS} value={period} onChange={setPeriod} />
      </div>

      <Card title="수면시간" aside={`${periodLabel} · ${view.count}일 기록`}>
        {view.avgSleep !== null ? (
          <p className={s.hero}>
            <span className={s.heroLabel}>평균</span>
            <DurationText minutes={view.avgSleep} />
          </p>
        ) : (
          <p className={s.none}>이 기간에는 기록이 없어요</p>
        )}
        <SleepBars key={period} data={view.bars} targetHours={settings.targetSleepHours} />
      </Card>

      <Card title="취침·기상 리듬" aside={periodLabel}>
        <div className={s.rhythm}>
          <div>
            <p className={s.statLabel}>평균 취침</p>
            <p className={s.clock}>{view.bed?.mean ?? '–'}</p>
            {view.bed && <p className={s.spread}>들쭉날쭉 ±{Math.round(view.bed.sdMin)}분</p>}
          </div>
          <div>
            <p className={s.statLabel}>평균 기상</p>
            <p className={s.clock}>{view.wake?.mean ?? '–'}</p>
            {view.wake && <p className={s.spread}>들쭉날쭉 ±{Math.round(view.wake.sdMin)}분</p>}
          </div>
        </div>
        <SleepWindows key={period} rows={view.windows} targetBed={settings.targetBedTime} targetWake={settings.targetWakeTime} />
        <p className={s.legend}>점선은 목표 취침·기상 시각이에요.</p>
      </Card>

      <div className={s.grid}>
        <Card title="수면효율" className={s.tile}>
          {view.avgEff !== null ? <UnitValue value={view.avgEff} unit="%" /> : <span className={s.dash}>–</span>}
        </Card>
        <Card title="잠드는 데" className={s.tile}>
          {view.avgLatency !== null ? <UnitValue value={view.avgLatency} unit="분" /> : <span className={s.dash}>–</span>}
        </Card>
        <Card title="개운함" className={s.tile}>
          {view.avgQuality !== null ? <UnitValue value={view.avgQuality} unit="/ 5" digits={1} /> : <span className={s.dash}>–</span>}
        </Card>
        <Card title="중간에 깬 횟수" className={s.tile}>
          <AwakeningsAvg period={period} today={today} />
        </Card>
      </div>

      <Group
        header="생활 요인과 비교"
        footer={
          logs.length < MIN_LOGS_FOR_FACTORS
            ? `기록이 ${MIN_LOGS_FOR_FACTORS}일 이상 쌓이면 보여 드려요. 지금 ${logs.length}일.`
            : comparisons.length === 0
              ? '비교할 만큼 생활 요인이 모이지 않았어요. 양쪽 모두 3일 이상 필요해요.'
              : '전체 기록 기준 · 본인 기록 기반 참고 지표예요. 원인을 뜻하지는 않아요.'
        }
      >
        {comparisons.length > 0 ? comparisons.map((c) => <ComparisonRow key={c.id} c={c} />) : <div className={s.emptyRow}>아직 비교할 수 없어요</div>}
      </Group>
    </Page>
  );
}

function AwakeningsAvg({ period, today }: { period: Period; today: string }) {
  const { logs } = useStore();
  const days = new Set(lastDays(today, period === 'week' ? 7 : 30));
  const avg = average(logs.filter((l) => days.has(l.date)).map((l) => l.awakenings));
  return avg !== null ? <UnitValue value={avg} unit="번" digits={1} /> : <span className={s.dash}>–</span>;
}

function ComparisonRow({ c }: { c: FactorComparison }) {
  const fmt = (v: number) => (c.metric === 'quality' ? v.toFixed(1) : formatDuration(v));
  const metricName = c.metric === 'quality' ? '개운함 평균' : '잠드는 데 걸린 시간 평균';
  // 개운함은 높을수록, 잠드는 시간은 짧을수록 나은 쪽
  const withBetter = c.metric === 'quality' ? c.withValue > c.withoutValue : c.withValue < c.withoutValue;
  const same = Math.abs(c.withValue - c.withoutValue) < (c.metric === 'quality' ? 0.05 : 1);
  return (
    <div className={s.compare}>
      <p className={s.compareTitle}>{c.title}</p>
      <p className={s.compareMetric}>{metricName}</p>
      <div className={s.compareValues}>
        <div className={!same && withBetter ? s.better : undefined}>
          <span className={s.compareLabel}>
            {c.withLabel} · {c.withN}일
          </span>
          <span className={s.compareNum}>{c.metric === 'quality' ? <CountNumber value={c.withValue} digits={1} /> : fmt(c.withValue)}</span>
        </div>
        <div className={!same && !withBetter ? s.better : undefined}>
          <span className={s.compareLabel}>
            {c.withoutLabel} · {c.withoutN}일
          </span>
          <span className={s.compareNum}>{c.metric === 'quality' ? <CountNumber value={c.withoutValue} digits={1} /> : fmt(c.withoutValue)}</span>
        </div>
      </div>
    </div>
  );
}
