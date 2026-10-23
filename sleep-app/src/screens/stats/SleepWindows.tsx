import { motion } from 'framer-motion';
import { useElementWidth } from '../../hooks/useElementWidth';
import { spring } from '../../lib/motion';
import { ANCHOR_MIN, anchoredMinutes, clockOf } from '../../lib/sleepCalc';
import type { SleepLog } from '../../types';

interface Row {
  date: string;
  tick: string;
  log: SleepLog | null;
}

interface Props {
  rows: Row[];
  targetBed: string;
  targetWake: string;
}

/**
 * 날짜별 취침~기상 구간을 가로 막대로 쌓는다. 막대 양 끝이 들쭉날쭉할수록 리듬이 흔들린 것.
 * 가로축은 18:00 기준 분 — 자정을 넘어도 이어진다.
 */
export function SleepWindows({ rows, targetBed, targetWake }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const logs = rows.map((r) => r.log).filter((l): l is SleepLog => !!l);
  const tb = anchoredMinutes(targetBed);
  const tw = anchoredMinutes(targetWake);
  const starts = [tb, ...logs.map((l) => anchoredMinutes(l.bedTime))];
  const ends = [tw, ...logs.map((l) => anchoredMinutes(l.bedTime) + Math.max(0, (Date.parse(l.wakeTime) - Date.parse(l.bedTime)) / 60000))];
  const lo = Math.floor((Math.min(...starts) - 30) / 120) * 120;
  const hi = Math.ceil((Math.max(...ends) + 30) / 120) * 120;

  const dense = rows.length > 10;
  const rowH = dense ? 7 : 22;
  const gap = dense ? 2 : 6;
  const labelW = dense ? 0 : 22;
  const top = 4;
  const plotH = rows.length * (rowH + gap) - gap;
  const height = top + plotH + 24;
  const plotW = Math.max(0, width - labelW - 14);
  const sx = (m: number) => labelW + ((m - lo) / (hi - lo || 1)) * plotW;
  const step = hi - lo > 720 ? 240 : 120;
  const ticks: number[] = [];
  for (let m = lo; m <= hi; m += step) ticks.push(m);

  return (
    <div ref={ref}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="날짜별 취침·기상 시각">
          {ticks.map((m) => (
            <g key={m}>
              <line x1={sx(m)} x2={sx(m)} y1={top} y2={top + plotH} stroke="var(--separator)" strokeOpacity={0.5} />
              <text x={sx(m)} y={height - 6} textAnchor={m === hi ? 'end' : 'middle'} fontSize={11} fill="var(--label-secondary)">
                {`${((m + ANCHOR_MIN) / 60) % 24}시`}
              </text>
            </g>
          ))}
          {[tb, tw].map((m, i) => (
            <line key={i} x1={sx(m)} x2={sx(m)} y1={top - 2} y2={top + plotH + 2} stroke="var(--label-tertiary)" strokeDasharray="3 4" />
          ))}
          {rows.map((r, i) => {
            const y = top + i * (rowH + gap);
            const label = !dense && (
              <text x={0} y={y + rowH / 2 + 4} fontSize={11} fill="var(--label-secondary)">
                {r.tick}
              </text>
            );
            if (!r.log) return <g key={r.date}>{label}</g>;
            const a = anchoredMinutes(r.log.bedTime);
            const b = a + Math.max(0, (Date.parse(r.log.wakeTime) - Date.parse(r.log.bedTime)) / 60000);
            const x1 = sx(a);
            const w = Math.max(rowH, sx(b) - x1);
            return (
              <g key={r.date}>
                {label}
                <motion.rect
                  x={x1}
                  y={y}
                  width={w}
                  height={rowH}
                  rx={rowH / 2}
                  fill="var(--accent)"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ ...spring, delay: i * 0.015 }}
                  style={{ transformBox: 'fill-box', originX: 0 }}
                >
                  <title>{`${r.date} ${clockOf(r.log.bedTime)}–${clockOf(r.log.wakeTime)}`}</title>
                </motion.rect>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
