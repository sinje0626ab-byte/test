import { AnimatePresence, motion } from 'framer-motion';
import { subDays } from 'date-fns';
import { useMemo, type ReactNode } from 'react';
import { fmtDateLong } from '../lib/format';
import { spring } from '../lib/motion';
import { dateKeyOf, formatDuration } from '../lib/sleepCalc';
import type { ClockTime, DateKey } from '../types';
import { Wheel, WheelGroup, WheelLabel, type WheelItem } from './Wheel';
import s from './pickers.module.css';

const pad = (n: number) => String(n).padStart(2, '0');
const HOURS: WheelItem<number>[] = Array.from({ length: 24 }, (_, i) => ({ value: i, label: pad(i) }));
const MINUTES: WheelItem<number>[] = Array.from({ length: 60 }, (_, i) => ({ value: i, label: pad(i) }));

/** 시·분 두 개의 휠 (24시간제) */
export function TimeWheel({ value, onChange, label }: { value: ClockTime; onChange: (v: ClockTime) => void; label: string }) {
  const [h, m] = value.split(':').map(Number);
  return (
    <WheelGroup>
      <Wheel items={HOURS} value={h} onChange={(v) => onChange(`${pad(v)}:${pad(m)}`)} label={`${label} 시`} width={72} align="right" />
      <WheelLabel>:</WheelLabel>
      <Wheel items={MINUTES} value={m} onChange={(v) => onChange(`${pad(h)}:${pad(v)}`)} label={`${label} 분`} width={72} align="left" />
    </WheelGroup>
  );
}

/** 최근 days 일 중 하루 (기본 60일) */
export function DateWheel({ value, onChange, days = 60 }: { value: DateKey; onChange: (v: DateKey) => void; days?: number }) {
  const items = useMemo(() => {
    const now = new Date();
    const today = dateKeyOf(now);
    const yesterday = dateKeyOf(subDays(now, 1));
    const list: WheelItem<DateKey>[] = Array.from({ length: days }, (_, i) => {
      const d = dateKeyOf(subDays(now, days - 1 - i));
      return { value: d, label: d === today ? '오늘' : d === yesterday ? '어제' : fmtDateLong(d) };
    });
    // 오래된 기록을 고칠 때는 그 날짜도 목록에 있어야 한다
    if (!list.some((i) => i.value === value)) list.unshift({ value, label: fmtDateLong(value) });
    return list;
  }, [days, value]);
  return (
    <WheelGroup>
      <Wheel items={items} value={value} onChange={onChange} label="기상한 날" width="100%" />
    </WheelGroup>
  );
}

const HOUR_STEPS: WheelItem<number>[] = Array.from({ length: 17 }, (_, i) => {
  const v = 4 + i * 0.5;
  return { value: v, label: formatDuration(v * 60) };
});

/** 4~12시간, 30분 단위 */
export function HoursWheel({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <WheelGroup>
      <Wheel items={HOUR_STEPS} value={value} onChange={onChange} label="목표 수면시간" width="100%" />
    </WheelGroup>
  );
}

/**
 * 누르면 아래로 휠이 펼쳐지는 행. 오른쪽에 현재 값이 회색 알약으로 보이고,
 * 펼쳐진 동안에는 accent 색이 된다 (iOS 날짜·시간 셀과 같은 동작).
 */
export function PickerRow({ label, display, open, onToggle, children }: { label: ReactNode; display: ReactNode; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div>
      <button type="button" className={s.row} onClick={onToggle} aria-expanded={open}>
        <span className={s.label}>{label}</span>
        <span className={`${s.pill} ${open ? s.pillOpen : ''}`}>{display}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="wheel"
            className={s.expand}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
          >
            <div className={s.wheelPad}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
