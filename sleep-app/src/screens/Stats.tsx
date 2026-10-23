import { ChartColumn } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card, EmptyState } from '../components/Card';
import { Segmented } from '../components/controls';
import { DurationText } from '../components/numbers';
import { Page } from '../components/Page';
import { useNow } from '../hooks/useNow';
import { fmtDay, fmtWeekday } from '../lib/format';
import { average, clockStats, dateKeyOf, lastDays, sleepMin } from '../lib/sleepCalc';
import type { LogSheetTarget } from '../sheets/LogSheet';
import { useStore } from '../store/store';
import { SleepBars } from './stats/SleepBars';
import { SleepWindows } from './stats/SleepWindows';
import s from './Stats.module.css';

type Period = 'week' | 'month';
const PERIODS = [
  { value: 'week' as const, label: '주간' },
  { value: 'month' as const, label: '월간' },
];

export function Stats({ openSheet }: { openSheet: (t: LogSheetTarget) => void }) {
  const { logs, settings } = useStore();
  const [period, setPeriod] = useState<Period>('week');
  const now = useNow(60_000);
  const today = dateKeyOf(now);

  const view = useMemo(() => {
    const days = lastDays(today, period === 'week' ? 7 : 30);
    const byDate = new Map(logs.map((l) => [l.date, l]));
    const inRange = days.map((d) => byDate.get(d)).filter((l): l is NonNullable<typeof l> => !!l);
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
      bed: clockStats(inRange.map((l) => l.bedTime)),
      wake: clockStats(inRange.map((l) => l.wakeTime)),
    };
  }, [logs, period, today]);

  if (logs.length === 0) {
    return (
      <Page title="통계">
        <EmptyState
          icon={<ChartColumn size={28} strokeWidth={1.75} />}
          title="기록이 쌓이면 패턴이 보여요"
          message="며칠만 기록해도 수면시간과 취침·기상 리듬을 한눈에 볼 수 있어요."
          action={
            <Button variant="tinted" onClick={() => openSheet({})}>
              기록 추가
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
    </Page>
  );
}
