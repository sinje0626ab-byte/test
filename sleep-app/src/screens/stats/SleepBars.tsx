import { motion } from 'framer-motion';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { spring } from '../../lib/motion';
import { formatDuration } from '../../lib/sleepCalc';

export interface BarDatum {
  date: string;
  tick: string;
  minutes: number | null;
}

interface Props {
  data: BarDatum[];
  targetHours: number;
}

/**
 * 수면시간 막대. 축선 없이 옅은 가로 보조선만, 목표선은 점선 + 오른쪽 라벨.
 * 막대를 누르면 그날 수치가 막대 위에 작게 뜬다 (툴팁 박스 대신).
 */
export function SleepBars({ data, targetHours }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const rows = data.map((d) => ({ ...d, hours: d.minutes === null ? null : d.minutes / 60 }));
  const max = Math.max(targetHours + 1, ...rows.map((r) => r.hours ?? 0));
  const top = Math.ceil(max / 2) * 2;
  const ticks = Array.from({ length: top / 2 + 1 }, (_, i) => i * 2);
  const dense = data.length > 10;

  return (
    <div style={{ height: 200, marginLeft: -4 }} onPointerLeave={() => dense && setSelected(null)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 22, right: 34, bottom: 0, left: 4 }} barCategoryGap={dense ? '18%' : '28%'}>
          <CartesianGrid vertical={false} stroke="var(--separator)" strokeOpacity={0.5} />
          <YAxis hide domain={[0, top]} ticks={ticks} />
          <XAxis
            dataKey="tick"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={{ fill: 'var(--label-secondary)', fontSize: 11 }}
            tickMargin={6}
            height={22}
          />
          <ReferenceLine
            y={targetHours}
            stroke="var(--label-tertiary)"
            strokeDasharray="3 4"
            ifOverflow="extendDomain"
            label={{ value: '목표', position: 'right', fill: 'var(--label-secondary)', fontSize: 11 }}
          />
          <Bar
            dataKey="hours"
            isAnimationActive={false}
            onClick={(_, i) => setSelected((cur) => (cur === i ? null : i))}
            shape={(p: unknown) => <SpringBar {...(p as BarShapeProps)} />}
          >
            {rows.map((r, i) => (
              <Cell key={r.date} fill={(r.hours ?? 0) >= targetHours ? 'var(--accent)' : 'var(--accent-soft)'} opacity={selected === null || selected === i ? 1 : 0.55} cursor="pointer" />
            ))}
            <LabelList
              dataKey="hours"
              content={(p) => {
                const { x, y, width, index } = p as { x: number; y: number; width: number; index: number };
                const m = rows[index]?.minutes;
                if (index !== selected || m == null) return null;
                const { h, mm } = { h: Math.floor(m / 60), mm: Math.round(m % 60) };
                return (
                  <text x={x + width / 2} y={y - 7} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--label)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {`${h}:${String(mm).padStart(2, '0')}`}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="sr-only">
        {rows
          .filter((r) => r.minutes !== null)
          .map((r) => `${r.date} ${formatDuration(r.minutes!)}`)
          .join(', ')}
      </p>
    </div>
  );
}

interface BarShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  opacity?: number;
}

/** 위쪽만 둥근 막대. 아래(기준선)에서 스프링으로 자라난다 */
function SpringBar({ x, y, width, height, fill, opacity }: BarShapeProps) {
  if (!height || height <= 0) return null;
  const r = Math.min(4, width / 2, height);
  const d = `M${x},${y + height} V${y + r} Q${x},${y} ${x + r},${y} H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${y + height} Z`;
  return (
    <motion.path
      d={d}
      fill={fill}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1, opacity: opacity ?? 1 }}
      transition={spring}
      style={{ transformBox: 'fill-box', originY: 1 }}
    />
  );
}
