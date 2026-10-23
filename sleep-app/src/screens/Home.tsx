import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, EmptyState } from '../components/Card';
import { DurationText, UnitValue } from '../components/numbers';
import { Page } from '../components/Page';
import { QualityDots } from '../components/QualityDots';
import { useUI } from '../components/ui';
import { useNow } from '../hooks/useNow';
import { fmtRelativeDate, greeting } from '../lib/format';
import { pressSpring, spring } from '../lib/motion';
import { clockOf, dateKeyOf, efficiencyPct, formatDuration, isPendingOverdue, minutesBetween, sleepDebt, sleepMin } from '../lib/sleepCalc';
import type { LogSheetInit } from '../sheets/LogSheet';
import { useStore } from '../store/store';
import s from './Home.module.css';

export function Home({ openSheet }: { openSheet: (i: LogSheetInit) => void }) {
  const store = useStore();
  const ui = useUI();
  const now = useNow(15_000);
  const { pending, logs, settings } = store;
  const sleeping = !!pending;
  const overdue = isPendingOverdue(pending, now);
  const today = dateKeyOf(now);
  const latest = logs[0];
  const debt = sleepDebt(logs, settings.targetSleepHours, today);

  const goToSleep = async () => {
    await store.startSleep();
    ui.toast({ message: '편안한 밤 되세요', actionLabel: '되돌리기', onAction: () => store.cancelSleep(), duration: 3000 });
  };
  const wakeUp = () => pending && openSheet({ mode: 'morning', bedTime: pending.bedTime, wakeTime: new Date().toISOString() });
  const finishOverdue = () => pending && openSheet({ mode: 'manual', bedTime: pending.bedTime, fromPending: true });
  const dropOverdue = async () => {
    if (await ui.confirm({ title: '"잘게요" 기록을 지울까요?', message: '누운 시각만 지워지고 다른 기록은 그대로예요.', confirmLabel: '지우기', destructive: true })) store.cancelSleep();
  };

  return (
    <Page title={greeting(now)}>
      <AnimatePresence initial={false}>
        {overdue && pending && (
          <motion.div key="overdue" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={spring}>
            <Card className={s.notice}>
              <p className={s.noticeTitle}>어젯밤 기록을 마무리할까요?</p>
              <p className={s.noticeText}>
                {clockOf(pending.bedTime)}에 "잘게요"를 누른 뒤 {formatDuration(minutesBetween(pending.bedTime, now))}이 지났어요.
              </p>
              <div className={s.noticeActions}>
                <Button onClick={finishOverdue}>마무리하기</Button>
                <Button variant="gray" onClick={dropOverdue}>
                  지우기
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={s.hero}>
        <motion.button
          type="button"
          className={s.big}
          onClick={sleeping ? wakeUp : goToSleep}
          whileTap={{ scale: 0.95 }}
          transition={pressSpring}
          aria-label={sleeping ? '일어났어요' : '잘게요'}
        >
          <motion.span className={`${s.layer} ${s.night}`} initial={false} animate={{ opacity: sleeping ? 0 : 1 }} transition={spring} />
          <motion.span className={`${s.layer} ${s.day}`} initial={false} animate={{ opacity: sleeping ? 1 : 0 }} transition={spring} />
          <span className={s.face}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={sleeping ? 'sun' : 'moon'}
                className={s.icon}
                initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 120, scale: 0.4, opacity: 0 }}
                transition={spring}
              >
                {sleeping ? <Sun size={56} strokeWidth={1.75} /> : <Moon size={56} strokeWidth={1.75} />}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={sleeping ? 'wake' : 'sleep'}
                className={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring}
              >
                {sleeping ? '일어났어요' : '잘게요'}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>

        <div className={s.below}>
          <AnimatePresence initial={false} mode="wait">
            {sleeping && pending ? (
              <motion.p key="elapsed" className={s.elapsed} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring}>
                {clockOf(pending.bedTime)}에 누움 · <span className="num">{formatDuration(Math.max(0, minutesBetween(pending.bedTime, now)))}</span> 지남
              </motion.p>
            ) : (
              <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring}>
                <Button variant="plain" onClick={() => openSheet({ mode: 'manual' })}>
                  직접 입력
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {latest ? (
        <>
          <Card title={latest.date === today ? '어젯밤' : `최근 기록 · ${fmtRelativeDate(latest.date, now)}`} aside={`${clockOf(latest.bedTime)} – ${clockOf(latest.wakeTime)}`} onPress={() => openSheet({ mode: 'edit', log: latest })}>
            <DurationText minutes={sleepMin(latest)} />
            <div className={s.stats}>
              <div>
                <p className={s.statLabel}>수면효율</p>
                <UnitValue value={efficiencyPct(latest) ?? 0} unit="%" />
              </div>
              <div>
                <p className={s.statLabel}>개운함</p>
                <span className={s.quality}>
                  <UnitValue value={latest.quality} unit="/ 5" />
                  <QualityDots value={latest.quality} />
                </span>
              </div>
            </div>
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
      ) : (
        <Card>
          <EmptyState
            icon={<Moon size={28} strokeWidth={1.75} />}
            title="아직 기록이 없어요"
            message="오늘 밤 '잘게요'를 누르거나, 지난밤 수면을 직접 입력해 보세요."
            action={
              <Button variant="tinted" onClick={() => openSheet({ mode: 'manual' })}>
                지난밤 직접 입력
              </Button>
            }
          />
        </Card>
      )}
    </Page>
  );
}
