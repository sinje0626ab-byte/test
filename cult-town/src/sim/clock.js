// 날짜·시간 계산. 실제 달력: day 0 = 2026년 3월 2일 월요일 (새 학기). 하루씩 실제 날짜로 넘어간다.
// 요일·예배(수·일)·주보(일요일)는 7일 주기. 월세는 매달 25일.
import { CLOCK, CALENDAR } from '../config.js';

const START = Date.UTC(CALENDAR.start[0], CALENDAR.start[1] - 1, CALENDAR.start[2]);
const DAY_MS = 86_400_000;
export const dateOf = (day) => new Date(START + day * DAY_MS);
export const weekday = (day) => day % 7;                    // 0 = 월
export const month = (day) => dateOf(day).getUTCMonth() + 1;
export const dayOfMonth = (day) => dateOf(day).getUTCDate();
export const year = (day) => dateOf(day).getUTCFullYear();
export const isWeekend = (day) => weekday(day) >= 5;
export const isWorshipDay = (day) => CLOCK.worshipDays.includes(weekday(day));
export const isRentDay = (day) => dayOfMonth(day) === CALENDAR.rentDay;
export const isSunday = (day) => weekday(day) === 6;
// 다음 월세날까지 남은 날 (오늘이면 0)
export function daysToRent(day) {
  let d = day;
  while (!isRentDay(d)) d++;
  return d - day;
}

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
// 휴대폰 잠금화면처럼: "오전 9:40"
export function fmtClock(m) {
  const h = Math.floor(m / 60) % 24; const mm = pad(Math.floor(m % 60));
  return `${h < 12 ? '오전' : '오후'} ${h % 12 === 0 ? 12 : h % 12}:${mm}`;
}
const WEEKDAY_LONG = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
export const fmtDate = (day) => `${month(day)}월 ${dayOfMonth(day)}일 ${WEEKDAY_LONG[weekday(day)]}`;
export const fmtDateShort = (day) => `${month(day)}/${dayOfMonth(day)}(${CLOCK.weekdays[weekday(day)]})`;

// ── 계절 ── winter(12~2) · early(3) · spring(4~5) · rainy(6~7) · summer(8) · autumn(9~11)
export function season(day) {
  const m = month(day);
  if (m === 12 || m <= 2) return 'winter';
  if (m === 3) return 'early';
  if (m <= 5) return 'spring';
  if (m <= 7) return 'rainy';
  if (m === 8) return 'summer';
  return 'autumn';
}
// 오늘의 행사 (도림천 벚꽃 · 연휴 · 장마 · 추석 · 연말). 없으면 null
export function holidayOf(day) {
  const m = month(day); const d = dayOfMonth(day);
  return CALENDAR.days.find((h) => (h.m === m && d >= h.from && d <= h.to)) ?? null;
}
// 그 시각 기온 (월 평균 + 하루 변화 + 그날 차이)
export function tempAt(s, minute = s.minute) {
  const base = CALENDAR.temp[month(s.day) - 1] + (s.weather?.tempDelta ?? 0);
  const hour = minute / 60;
  return Math.round(base + 4 * Math.sin(((hour - 9) / 24) * Math.PI * 2) - (s.weather?.rain ? 2 : 0));
}
export const skyName = (w) => (w?.snow ? '눈' : w?.rain ? '비' : w?.cloudy ? '흐림' : '맑음');
