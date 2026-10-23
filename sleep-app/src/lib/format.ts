import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { DateKey } from '../types';
import { dateKeyOf } from './sleepCalc';

// 화면 표시용 날짜 문구

const parseKey = (d: DateKey) => parseISO(`${d}T12:00:00`);

/** '10월 23일 (목)' */
export const fmtDateLong = (d: DateKey) => format(parseKey(d), 'M월 d일 (EEE)', { locale: ko });
/** '23일 (목)' */
export const fmtDayOfMonth = (d: DateKey) => format(parseKey(d), 'd일 (EEE)', { locale: ko });
/** '2026년 10월' */
export const fmtMonth = (d: DateKey) => format(parseKey(d), 'yyyy년 M월');
/** '목' */
export const fmtWeekday = (d: DateKey) => format(parseKey(d), 'EEEEE', { locale: ko });
/** '23' */
export const fmtDay = (d: DateKey) => format(parseKey(d), 'd');

/** 오늘/어제/그 외 날짜 */
export function fmtRelativeDate(d: DateKey, now = new Date()): string {
  const today = dateKeyOf(now);
  const yesterday = dateKeyOf(new Date(now.getTime() - 86_400_000));
  if (d === today) return '오늘';
  if (d === yesterday) return '어제';
  return fmtDateLong(d);
}

/** 시간대별 인사 */
export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h >= 5 && h < 11) return '좋은 아침이에요';
  if (h >= 11 && h < 17) return '좋은 오후예요';
  if (h >= 17 && h < 21) return '좋은 저녁이에요';
  return '편안한 밤 되세요';
}
