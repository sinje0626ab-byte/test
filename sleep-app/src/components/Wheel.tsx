import { useCallback, useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import s from './Wheel.module.css';

// iOS식 스크롤 휠. scroll-snap 으로 한 칸씩 멈추고, 가운데에서 멀수록 흐려진다.

export const ITEM_H = 36;
const VISIBLE = 5; // 홀수

export interface WheelItem<T> {
  value: T;
  label: string;
}

interface Props<T> {
  items: WheelItem<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export function Wheel<T extends string | number>({ items, value, onChange, label, width, align = 'center' }: Props<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const settle = useRef<number>();
  const frame = useRef(0);
  const latest = useRef({ items, value, onChange });
  latest.current = { items, value, onChange };
  const id = useId();
  const index = Math.max(0, items.findIndex((i) => i.value === value));

  // 가운데에서 멀어질수록 흐리고 작게 — 매 프레임 DOM 에 직접 칠해서 리렌더 없이 60fps
  const paint = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const center = el.scrollTop / ITEM_H;
    const kids = el.children;
    const from = Math.max(0, Math.floor(center) - 4);
    const to = Math.min(kids.length - 1, Math.ceil(center) + 4);
    for (let i = from; i <= to; i++) {
      const d = Math.min(Math.abs(i - center), 3);
      const k = kids[i] as HTMLElement;
      k.style.opacity = String(1 - d * 0.3);
      k.style.transform = `scale(${1 - d * 0.06})`;
    }
  }, []);

  const commit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { items: list, value: cur, onChange: change } = latest.current;
    const i = Math.max(0, Math.min(list.length - 1, Math.round(el.scrollTop / ITEM_H)));
    if (list[i] && list[i].value !== cur) change(list[i].value);
  }, []);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(paint);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(commit, 110);
  };

  // 처음엔 애니메이션 없이 현재 값 위치로
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = index * ITEM_H;
    paint();
  }, []);

  // 바깥에서 값이 바뀌면 그 칸으로 굴러간다
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (Math.round(el.scrollTop / ITEM_H) !== index) el.scrollTo({ top: index * ITEM_H, behavior: 'smooth' });
  }, [index]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('onscrollend' in window)) return;
    el.addEventListener('scrollend', commit);
    return () => el.removeEventListener('scrollend', commit);
  }, [commit]);

  useEffect(() => () => window.clearTimeout(settle.current), []);

  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = items[index + step];
    if (next) onChange(next.value);
  };

  return (
    <div
      className={s.wheel}
      style={{ width }}
      role="listbox"
      aria-label={label}
      tabIndex={0}
      aria-activedescendant={`${id}-${index}`}
      onKeyDown={onKeyDown}
    >
      <div ref={ref} className={s.scroller} onScroll={onScroll} style={{ height: ITEM_H * VISIBLE, paddingBlock: ITEM_H * ((VISIBLE - 1) / 2) }}>
        {items.map((it, i) => (
          <div
            key={String(it.value)}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === index}
            className={`${s.item} ${s[align]}`}
            style={{ height: ITEM_H, lineHeight: `${ITEM_H}px` }}
            onClick={() => ref.current?.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })}
          >
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 휠 여러 개를 나란히 놓고 가운데 선택 띠를 하나로 그린다 */
export function WheelGroup({ children }: { children: ReactNode }) {
  return (
    <div className={s.group} style={{ height: ITEM_H * VISIBLE }}>
      <div className={s.band} style={{ top: ITEM_H * ((VISIBLE - 1) / 2), height: ITEM_H }} aria-hidden />
      {children}
    </div>
  );
}

/** 휠 사이 고정 글자 (':' 같은 것) */
export function WheelLabel({ children }: { children: ReactNode }) {
  return <div className={s.fixed}>{children}</div>;
}
