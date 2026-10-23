import { useState } from 'react';
import { Group } from '../components/Group';
import { DateWheel, PickerRow, TimeWheel } from '../components/pickers';
import { useUI } from '../components/ui';
import { fmtDateLong, fmtRelativeDate } from '../lib/format';
import { buildTimes, clockOf, dateKeyOf, formatDuration, sleepMin, validateTimes } from '../lib/sleepCalc';
import { uuid } from '../lib/uuid';
import { useStore } from '../store/store';
import type { ClockTime, DateKey, Settings, SleepLog } from '../types';
import s from './forms.module.css';

// 잔 시각 · 깬 시각만 받는 입력. 홈(새 기록)과 수정 시트가 같이 쓴다.

type PickerKey = 'date' | 'bed' | 'wake';

export interface EntryStart {
  date: DateKey;
  bed: ClockTime;
  wake: ClockTime;
}

export const startFromLog = (l: SleepLog): EntryStart => ({ date: l.date, bed: clockOf(l.bedTime), wake: clockOf(l.wakeTime) });

/** 새 기록 기본값: 오늘 일어난 것으로, 시각은 목표 취침·기상 시각 */
export const defaultStart = (settings: Settings): EntryStart => ({
  date: dateKeyOf(new Date()),
  bed: settings.targetBedTime,
  wake: settings.targetWakeTime,
});

export function useSleepEntry(start: EntryStart, original?: SleepLog) {
  const [date, setDate] = useState(start.date);
  const [bed, setBed] = useState(start.bed);
  const [wake, setWake] = useState(start.wake);
  const [open, setOpen] = useState<PickerKey | null>(null);

  const touched = date !== start.date || bed !== start.bed || wake !== start.wake;
  // 수정에서 시각을 건드리지 않았으면 원래 값을 그대로 둔다
  const times =
    original && !touched
      ? { bedTime: original.bedTime, sleepTime: original.sleepTime, wakeTime: original.wakeTime }
      : buildTimes(date, bed, bed, wake);

  return {
    date,
    bed,
    wake,
    setDate,
    setBed,
    setWake,
    open,
    toggle: (k: PickerKey) => setOpen((cur) => (cur === k ? null : k)),
    close: () => setOpen(null),
    reset: (v: EntryStart) => {
      setDate(v.date);
      setBed(v.bed);
      setWake(v.wake);
      setOpen(null);
    },
    times,
    warnings: validateTimes(times),
  };
}

export type SleepEntry = ReturnType<typeof useSleepEntry>;

/** 날짜 · 잔 시각 · 깬 시각 세 줄 + 수면시간 미리보기 */
export function SleepFields({ entry }: { entry: SleepEntry }) {
  const { date, bed, wake, open, toggle, times, warnings } = entry;
  return (
    <>
      <Group>
        <PickerRow label="일어난 날" display={fmtRelativeDate(date)} open={open === 'date'} onToggle={() => toggle('date')}>
          <DateWheel value={date} onChange={entry.setDate} />
        </PickerRow>
        <PickerRow label="잔 시각" display={bed} open={open === 'bed'} onToggle={() => toggle('bed')}>
          <TimeWheel value={bed} onChange={entry.setBed} label="잔 시각" />
        </PickerRow>
        <PickerRow label="깬 시각" display={wake} open={open === 'wake'} onToggle={() => toggle('wake')}>
          <TimeWheel value={wake} onChange={entry.setWake} label="깬 시각" />
        </PickerRow>
      </Group>
      <p className={`${s.preview} ${warnings.length ? s.warn : ''}`} aria-live="polite">
        {warnings.length ? warnings.join(' ') : `수면 ${formatDuration(sleepMin(times))}`}
      </p>
    </>
  );
}

/** 경고·덮어쓰기 확인을 거쳐 저장한다. 저장했으면 true */
export function useSaveEntry() {
  const store = useStore();
  const ui = useUI();
  return async (entry: SleepEntry, original?: SleepLog): Promise<boolean> => {
    const { date, times, warnings } = entry;
    if (warnings.length && !(await ui.confirm({ title: '시간을 확인해 주세요', message: warnings.join(' '), confirmLabel: '그래도 저장' }))) return false;
    const existing = store.logs.find((l) => l.date === date && l.id !== original?.id);
    if (
      existing &&
      !(await ui.confirm({ title: `${fmtDateLong(date)} 기록이 이미 있어요`, message: '지금 입력한 시각으로 덮어쓸까요?', confirmLabel: '덮어쓰기', destructive: true }))
    )
      return false;

    const now = new Date().toISOString();
    const base = original ?? existing;
    await store.saveLog({
      ...base,
      id: base?.id ?? uuid(),
      date,
      ...times,
      createdAt: base?.createdAt ?? now,
      updatedAt: now,
    });
    ui.check();
    return true;
  };
}
