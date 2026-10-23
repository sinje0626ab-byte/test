import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Chips } from '../components/controls';
import { Cell, Group } from '../components/Group';
import { DateWheel, PickerRow, TimeWheel } from '../components/pickers';
import { Sheet, SheetBody, SheetButton, SheetHeader } from '../components/Sheet';
import { useUI } from '../components/ui';
import { fmtDateLong, greeting } from '../lib/format';
import { sheetSpring } from '../lib/motion';
import {
  buildTimes,
  clockOf,
  dateKeyOf,
  defaultSleepTime,
  formatDuration,
  minutesBetween,
  resolveClockAfter,
  sleepMin,
  timeInBedMin,
  validateTimes,
} from '../lib/sleepCalc';
import { uuid } from '../lib/uuid';
import { useStore } from '../store/store';
import type { ClockTime, DailyFactors, DateKey, Quality, SleepLog } from '../types';
import { FactorsForm } from './FactorsForm';
import s from './forms.module.css';

export type LogSheetInit =
  /** "일어났어요" — 누운 시각·깬 시각은 버튼으로 이미 정해졌다 */
  | { mode: 'morning'; bedTime: string; wakeTime: string }
  /** 직접 입력. fromPending 이면 저장 후 대기 중인 "잘게요" 를 지운다 */
  | { mode: 'manual'; bedTime?: string; fromPending?: boolean }
  | { mode: 'edit'; log: SleepLog };

/** 아침 기록 · 직접 입력 · 기록 수정을 모두 맡는 바텀 시트 */
export function LogSheet({ init, onClose }: { init: LogSheetInit | null; onClose: () => void }) {
  // 닫히는 애니메이션 동안에도 내용이 남아 있도록 마지막 값을 기억한다
  const last = useRef(init);
  const seq = useRef(0);
  if (init && init !== last.current) seq.current += 1;
  if (init) last.current = init;
  const shown = last.current;
  const title = shown?.mode === 'edit' ? '기록 수정' : '수면 기록';
  return (
    <Sheet open={!!init} onClose={onClose} label={title}>
      {shown && <LogForm key={seq.current} init={shown} onClose={onClose} />}
    </Sheet>
  );
}

const AWAKENINGS = [0, 1, 2, 3, 4, 5].map((v) => ({ value: v, label: v === 5 ? '5+' : String(v) }));
const QUALITY = ([1, 2, 3, 4, 5] as const).map((v) => ({ value: v, label: String(v) }));

type PickerKey = 'date' | 'bed' | 'sleep' | 'wake';

function initialState(init: LogSheetInit, target: { bed: ClockTime; wake: ClockTime }) {
  if (init.mode === 'morning') {
    const def = defaultSleepTime(init.bedTime);
    const sleepAt = def.getTime() > Date.parse(init.wakeTime) ? new Date(init.wakeTime) : def;
    return { date: dateKeyOf(init.wakeTime), bed: clockOf(init.bedTime), sleep: clockOf(sleepAt), wake: clockOf(init.wakeTime), awakenings: undefined, quality: undefined, note: '' };
  }
  if (init.mode === 'edit') {
    const l = init.log;
    return { date: l.date, bed: clockOf(l.bedTime), sleep: clockOf(l.sleepTime), wake: clockOf(l.wakeTime), awakenings: l.awakenings, quality: l.quality, note: l.note ?? '' };
  }
  if (init.bedTime) {
    // 마무리 못 한 "잘게요": 누운 시각 + 8시간을 기본 기상 시각으로 (지금보다 늦으면 지금)
    const wakeAt = new Date(Math.min(Date.parse(init.bedTime) + 8 * 3600_000, Date.now()));
    return { date: dateKeyOf(wakeAt), bed: clockOf(init.bedTime), sleep: clockOf(defaultSleepTime(init.bedTime)), wake: clockOf(wakeAt), awakenings: undefined, quality: undefined, note: '' };
  }
  const today = dateKeyOf(new Date());
  return { date: today, bed: target.bed, sleep: clockOf(defaultSleepTime(buildTimes(today, target.bed, target.bed, target.wake).bedTime)), wake: target.wake, awakenings: undefined, quality: undefined, note: '' };
}

function LogForm({ init, onClose }: { init: LogSheetInit; onClose: () => void }) {
  const store = useStore();
  const ui = useUI();
  const start = useRef(initialState(init, { bed: store.settings.targetBedTime, wake: store.settings.targetWakeTime })).current;

  const [page, setPage] = useState<'record' | 'factors'>('record');
  const [savedDate, setSavedDate] = useState<DateKey>(start.date);
  const [date, setDate] = useState(start.date);
  const [bed, setBed] = useState(start.bed);
  const [sleep, setSleep] = useState(start.sleep);
  const [wake, setWake] = useState(start.wake);
  const [awakenings, setAwakenings] = useState<number | undefined>(start.awakenings);
  const [quality, setQuality] = useState<Quality | undefined>(start.quality);
  const [note, setNote] = useState(start.note);
  const [openPicker, setOpenPicker] = useState<PickerKey | null>(init.mode === 'morning' ? 'sleep' : null);
  const [saving, setSaving] = useState(false);

  const isEdit = init.mode === 'edit';
  const timesTouched = date !== start.date || bed !== start.bed || sleep !== start.sleep || wake !== start.wake;

  /** 지금 입력으로 만든 ISO 시각 세 개 */
  const times = (() => {
    if (init.mode === 'morning') return { bedTime: init.bedTime, sleepTime: resolveClockAfter(init.bedTime, sleep).toISOString(), wakeTime: init.wakeTime };
    // 수정에서 시각을 건드리지 않았으면 원래 값을 그대로 둔다
    if (init.mode === 'edit' && !timesTouched) return { bedTime: init.log.bedTime, sleepTime: init.log.sleepTime, wakeTime: init.log.wakeTime };
    return buildTimes(date, bed, sleep, wake);
  })();
  const logDate = init.mode === 'morning' ? dateKeyOf(init.wakeTime) : date;
  const warnings = validateTimes(times);
  const toggle = (k: PickerKey) => setOpenPicker((cur) => (cur === k ? null : k));

  const save = async () => {
    if (awakenings === undefined || !quality || saving) return;
    if (warnings.length && !(await ui.confirm({ title: '시간을 확인해 주세요', message: warnings.join(' '), confirmLabel: '그래도 저장' }))) return;
    const selfId = isEdit ? init.log.id : null;
    const existing = store.logs.find((l) => l.date === logDate && l.id !== selfId);
    if (
      existing &&
      !(await ui.confirm({ title: `${fmtDateLong(logDate)} 기록이 이미 있어요`, message: '지금 입력한 내용으로 덮어쓸까요?', confirmLabel: '덮어쓰기', destructive: true }))
    )
      return;

    setSaving(true);
    const now = new Date().toISOString();
    const base = isEdit ? init.log : existing;
    const log: SleepLog = {
      id: base?.id ?? uuid(),
      date: logDate,
      ...times,
      awakenings,
      quality,
      ...(note.trim() ? { note: note.trim() } : {}),
      createdAt: base?.createdAt ?? now,
      updatedAt: now,
    };
    await store.saveLog(log);
    if (init.mode === 'morning' || (init.mode === 'manual' && init.fromPending)) await store.cancelSleep();
    // 수정하면서 날짜를 옮겼으면 생활 요인도 따라간다
    if (isEdit && init.log.date !== logDate) {
      const f = store.factors.find((x) => x.date === init.log.date);
      if (f) await store.saveFactors({ ...f, date: logDate });
    }
    ui.check();
    setSaving(false);
    setSavedDate(logDate);
    if (isEdit) onClose();
    else setPage('factors');
  };

  const saveFactors = async (f: DailyFactors) => {
    await store.saveFactors(f);
    ui.check();
    onClose();
  };

  const remove = async () => {
    if (!isEdit) return;
    const ok = await ui.confirm({ title: `${fmtDateLong(init.log.date)} 기록을 삭제할까요?`, message: '이 날의 생활 요인도 함께 삭제돼요.', confirmLabel: '기록 삭제', destructive: true });
    if (!ok) return;
    await store.deleteLog(init.log.id);
    onClose();
  };

  const canSave = awakenings !== undefined && !!quality && !saving;
  const dir = page === 'factors' ? 1 : -1;
  const factorsDate = isEdit ? logDate : savedDate;

  return (
    <div className={s.pages}>
      <AnimatePresence initial={false} custom={dir}>
        {page === 'record' ? (
          <motion.div key="record" className={s.page} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={sheetSpring}>
            <SheetHeader
              title={init.mode === 'morning' ? greeting() : isEdit ? '기록 수정' : '직접 입력'}
              left={<SheetButton onClick={onClose}>취소</SheetButton>}
              right={
                isEdit ? (
                  <SheetButton bold onClick={save} disabled={!canSave}>
                    저장
                  </SheetButton>
                ) : undefined
              }
            />
            <SheetBody>
              {init.mode === 'morning' ? (
                <>
                  <p className={s.summary}>
                    <span>
                      누운 시각 <b>{clockOf(init.bedTime)}</b>
                    </span>
                    <span>
                      깬 시각 <b>{clockOf(init.wakeTime)}</b>
                    </span>
                    <span>
                      수면 <b>{formatDuration(Math.max(0, sleepMin(times)))}</b>
                    </span>
                  </p>
                  <Group>
                    <PickerRow label="잠든 시각" display={sleep} open={openPicker === 'sleep'} onToggle={() => toggle('sleep')}>
                      <TimeWheel value={sleep} onChange={setSleep} label="잠든 시각" />
                    </PickerRow>
                  </Group>
                </>
              ) : (
                <>
                  <Group>
                    <PickerRow label="일어난 날" display={fmtDateLong(date)} open={openPicker === 'date'} onToggle={() => toggle('date')}>
                      <DateWheel value={date} onChange={setDate} />
                    </PickerRow>
                    <PickerRow label="누운 시각" display={bed} open={openPicker === 'bed'} onToggle={() => toggle('bed')}>
                      <TimeWheel value={bed} onChange={setBed} label="누운 시각" />
                    </PickerRow>
                    <PickerRow label="잠든 시각" display={sleep} open={openPicker === 'sleep'} onToggle={() => toggle('sleep')}>
                      <TimeWheel value={sleep} onChange={setSleep} label="잠든 시각" />
                    </PickerRow>
                    <PickerRow label="깬 시각" display={wake} open={openPicker === 'wake'} onToggle={() => toggle('wake')}>
                      <TimeWheel value={wake} onChange={setWake} label="깬 시각" />
                    </PickerRow>
                  </Group>
                  <p className={`${s.preview} ${warnings.length ? s.warn : ''}`} aria-live="polite">
                    {warnings.length
                      ? warnings.join(' ')
                      : `수면 ${formatDuration(sleepMin(times))} · 누워 있던 시간 ${formatDuration(timeInBedMin(times))} · 잠드는 데 ${formatDuration(minutesBetween(times.bedTime, times.sleepTime))}`}
                  </p>
                </>
              )}

              <div className={s.field}>
                <h3 className={s.fieldLabel}>중간에 깬 횟수</h3>
                <Chips label="중간에 깬 횟수" options={AWAKENINGS} value={awakenings} onChange={(v) => v !== undefined && setAwakenings(v)} />
              </div>

              <div className={s.field}>
                <h3 className={s.fieldLabel}>아침 개운함</h3>
                <Chips label="아침 개운함" options={QUALITY} value={quality} onChange={(v) => v && setQuality(v)} />
                <p className={s.scale}>
                  <span>1 피곤해요</span>
                  <span>5 개운해요</span>
                </p>
              </div>

              {init.mode !== 'morning' && (
                <div className={s.field}>
                  <h3 className={s.fieldLabel}>메모</h3>
                  <textarea className={s.note} value={note} onChange={(e) => setNote(e.target.value)} placeholder="선택" rows={3} maxLength={500} />
                </div>
              )}

              {isEdit && (
                <Group>
                  <Cell title="어제 생활 요인" chevron onPress={() => setPage('factors')} />
                  <Cell title="기록 삭제" destructive onPress={remove} />
                </Group>
              )}

              {!isEdit && (
                <div className={s.bottom}>
                  <Button block onClick={save} disabled={!canSave}>
                    저장
                  </Button>
                </div>
              )}
            </SheetBody>
          </motion.div>
        ) : (
          <motion.div key="factors" className={s.page} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={sheetSpring}>
            <SheetHeader
              title="어제 생활 요인"
              left={
                isEdit ? (
                  <SheetButton onClick={() => setPage('record')}>
                    <span className={s.back}>
                      <ChevronLeft size={22} strokeWidth={2.25} />
                      기록
                    </span>
                  </SheetButton>
                ) : undefined
              }
              right={isEdit ? undefined : <SheetButton onClick={onClose}>건너뛰기</SheetButton>}
            />
            <FactorsForm date={factorsDate} initial={store.factors.find((f) => f.date === factorsDate)} onSave={saveFactors} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 다음 페이지는 오른쪽에서 밀려 들어오고, 이전 페이지는 왼쪽으로 살짝 밀린다
const slide = {
  enter: (d: number) => ({ x: d > 0 ? '100%' : '-30%', opacity: d > 0 ? 1 : 0.6 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-30%' : '100%', opacity: d > 0 ? 0.6 : 1 }),
};

