// 날짜·시간 계산. day 0 = 1월차 1일째 (월). 한 달 = CLOCK.daysPerMonth 일 (압축 달력).
import { CLOCK } from '../config.js';

export const weekday = (day) => day % 7;
export const month = (day) => Math.floor(day / CLOCK.daysPerMonth) + 1;
export const dayOfMonth = (day) => (day % CLOCK.daysPerMonth) + 1;
export const isWeekend = (day) => weekday(day) >= 5;
export const isWorshipDay = (day) => CLOCK.worshipDays.includes(weekday(day));
export const isMonthEnd = (day) => dayOfMonth(day) === CLOCK.daysPerMonth;
export const isSunday = (day) => weekday(day) === 6;

export function nextWorshipDay(day, minute = 0) {
  if (isWorshipDay(day) && minute < 19 * 60) return day;
  let d = day + 1;
  while (!isWorshipDay(d)) d++;
  return d;
}

export function phaseOf(minute) {
  let cur = CLOCK.phases[0];
  for (const p of CLOCK.phases) if (minute >= p.from) cur = p;
  return cur;
}

export const parseTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const pad = (n) => String(n).padStart(2, '0');
export const fmtTime = (m) => `${pad(Math.floor(m / 60) % 24)}:${pad(Math.floor(m % 60))}`;
export const fmtDate = (day) => `${month(day)}월차 ${dayOfMonth(day)}일째 (${CLOCK.weekdays[weekday(day)]})`;
