import { useMotionValueEvent, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { splitDuration } from '../lib/sleepCalc';
import s from './numbers.module.css';

/** 값이 바뀌면 스프링으로 세어 올라가거나 내려가는 숫자 */
export function useCountTo(target: number): number {
  const reduce = useReducedMotion();
  const sp = useSpring(target, { stiffness: 140, damping: 26 });
  const [v, setV] = useState(target);
  useEffect(() => {
    if (reduce) sp.jump(target);
    else sp.set(target);
  }, [target, reduce, sp]);
  useMotionValueEvent(sp, 'change', setV);
  return reduce ? target : v;
}

export function CountNumber({ value, digits = 0, className }: { value: number; digits?: number; className?: string }) {
  const v = useCountTo(value);
  return <span className={`num ${className ?? ''}`}>{v.toFixed(digits)}</span>;
}

/** '7시간 24분' — 숫자는 크게, 단위는 작고 회색으로 */
export function DurationText({ minutes, size = 'large' }: { minutes: number; size?: 'large' | 'medium' }) {
  const v = Math.round(useCountTo(minutes));
  const { h, m } = splitDuration(v);
  return (
    <span className={`${s.value} ${s[size]}`} aria-label={`${h}시간 ${m}분`}>
      {v < 0 && <span className={s.n}>−</span>}
      {h > 0 && (
        <>
          <span className={s.n}>{h}</span>
          <span className={s.unit}>시간</span>
        </>
      )}
      {(m > 0 || h === 0) && (
        <>
          <span className={s.n}>{m}</span>
          <span className={s.unit}>분</span>
        </>
      )}
    </span>
  );
}

/** 숫자 + 작은 단위 ('92' '%') */
export function UnitValue({ value, unit, digits = 0, size = 'medium', color }: { value: number; unit: string; digits?: number; size?: 'large' | 'medium'; color?: string }) {
  const v = useCountTo(value);
  return (
    <span className={`${s.value} ${s[size]}`} style={color ? { color } : undefined}>
      <span className={s.n}>{v.toFixed(digits)}</span>
      <span className={s.unit}>{unit}</span>
    </span>
  );
}
