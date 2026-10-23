import { motion } from 'framer-motion';
import { useId } from 'react';
import { pressSpring, spring, tapFeedback } from '../lib/motion';
import s from './controls.module.css';

export interface Option<T> {
  value: T;
  label: string;
}

/** 큰 터치 칩 한 줄. 선택 표시가 스프링으로 미끄러진다. allowDeselect 면 다시 눌러 비울 수 있다 */
export function Chips<T extends string | number | boolean>({
  options,
  value,
  onChange,
  label,
  allowDeselect,
}: {
  options: Option<T>[];
  value: T | null | undefined;
  onChange: (v: T | undefined) => void;
  label: string;
  allowDeselect?: boolean;
}) {
  const id = useId();
  return (
    <div className={s.chips} role="radiogroup" aria-label={label}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <motion.button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            className={`${s.chip} ${on ? s.chipOn : ''}`}
            whileTap={tapFeedback}
            transition={pressSpring}
            onClick={() => onChange(on && allowDeselect ? undefined : o.value)}
          >
            {on && <motion.span layoutId={`chip-${id}`} className={s.chipFill} transition={spring} />}
            <span className={s.chipLabel}>{o.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** 세그먼트 컨트롤 (주간/월간 같은 전환) */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: Option<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  const id = useId();
  return (
    <div className={s.segmented} role="tablist" aria-label={label}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="tab" aria-selected={on} className={`${s.segment} ${on ? s.segmentOn : ''}`} onClick={() => onChange(o.value)}>
            {on && <motion.span layoutId={`seg-${id}`} className={s.thumb} transition={spring} />}
            <span className={s.segmentLabel}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** iOS 토글 스위치 (켜짐 = accent) */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={s.switch} onClick={() => onChange(!checked)}>
      <motion.span className={s.switchOn} initial={false} animate={{ opacity: checked ? 1 : 0 }} transition={spring} />
      <motion.span className={s.knob} initial={false} animate={{ x: checked ? 20 : 0 }} whileTap={{ scaleX: 1.15 }} transition={spring} />
    </button>
  );
}
