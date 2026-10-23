import { motion } from 'framer-motion';
import { useId } from 'react';
import { spring } from '../lib/motion';
import s from './controls.module.css';

export interface Option<T> {
  value: T;
  label: string;
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
