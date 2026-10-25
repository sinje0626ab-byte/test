import { useRef } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DurationText } from '../components/numbers';
import { Page } from '../components/Page';
import { useNow } from '../hooks/useNow';
import { fmtRelativeDate, greeting } from '../lib/format';
import { clockOf, dateKeyOf, formatDuration, sleepDebt, sleepMin } from '../lib/sleepCalc';
import { defaultStart, SleepFields, useSaveEntry, useSleepEntry } from '../sheets/entry';
import type { LogSheetTarget } from '../sheets/LogSheet';
import { useStore } from '../store/store';
import s from './Home.module.css';

export function Home({ openSheet }: { openSheet: (t: LogSheetTarget) => void }) {
  const store = useStore();
  const now = useNow(60_000);
  const { logs, settings } = store;
  const today = dateKeyOf(now);
  const latest = logs[0];
  const debt = sleepDebt(logs, settings.targetSleepHours, today);

  const entry = useSleepEntry(useRef(defaultStart(settings)).current);
  const saveEntry = useSaveEntry();
  const save = async () => {
    if (await saveEntry(entry)) entry.reset(defaultStart(settings));
  };

  return (
    <Page title={greeting(now)}>
      <section className={s.entry}>
        <h2 className={s.entryTitle}>언제 자고 언제 깼나요?</h2>
        <SleepFields entry={entry} />
        <Button block onClick={save}>
          기록하기
        </Button>
      </section>

      {latest && (
        <>
          <Card
            title={latest.date === today ? '어젯밤' : `최근 기록 · ${fmtRelativeDate(latest.date, now)}`}
            aside={`${clockOf(latest.bedTime)} – ${clockOf(latest.wakeTime)}`}
            onPress={() => openSheet({ log: latest })}
          >
            <DurationText minutes={sleepMin(latest)} />
          </Card>

          <Card title="이번 주 수면 부채" aside={`최근 7일 · ${debt.count}일 기록`}>
            {debt.count === 0 ? (
              <p className={s.muted}>최근 7일 기록이 없어요</p>
            ) : debt.debtMin > 0 ? (
              <span style={{ color: debt.debtMin >= 180 ? 'var(--warn)' : undefined }}>
                <DurationText minutes={debt.debtMin} />
              </span>
            ) : (
              <p className={s.noDebt}>없어요</p>
            )}
            <p className={s.caption}>
              {debt.count > 0 && debt.debtMin < 0 ? `목표보다 ${formatDuration(-debt.debtMin)} 더 잤어요 · ` : ''}목표 {formatDuration(settings.targetSleepHours * 60)} 기준
            </p>
          </Card>
          <p className={s.footnote}>본인 기록 기반 참고 지표예요.</p>
        </>
      )}
    </Page>
  );
}
