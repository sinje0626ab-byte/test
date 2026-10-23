// 앱 전체에서 쓰는 데이터 모양. 2단계(Supabase)에서도 같은 모양을 유지한다.

/** 'YYYY-MM-DD' — 기상한 날 기준 로컬 날짜 */
export type DateKey = string;
/** 'HH:mm' — 24시간제 로컬 시각 */
export type ClockTime = string;

export type Quality = 1 | 2 | 3 | 4 | 5;

export interface SleepLog {
  id: string; // UUID — 숫자 ID 쓰지 않는다
  date: DateKey; // 기상한 날
  bedTime: string; // ISO — 잔 시각
  sleepTime: string; // ISO — 지금은 bedTime 과 같다 (잠든 시각을 따로 받지 않는다)
  wakeTime: string; // ISO — 깬 시각
  awakenings?: number; // 0~5 (5 = 5번 이상) — 지금 화면에서는 받지 않는다
  quality?: Quality; // 아침 개운함 — 지금 화면에서는 받지 않는다
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type Alcohol = 'none' | 'some' | 'heavy';

/** 전날 생활 요인. date 외에는 전부 선택 입력이라 undefined = 기록 안 함 */
export interface DailyFactors {
  date: DateKey; // 해당 수면 기록과 같은 date
  caffeineLastTime?: ClockTime | null; // null = 안 마심
  alcohol?: Alcohol;
  exerciseMinutes?: number;
  napMinutes?: number;
  screenBeforeBed?: boolean;
  stress?: 1 | 2 | 3 | 4 | 5;
}

export interface Settings {
  targetBedTime: ClockTime;
  targetWakeTime: ClockTime;
  targetSleepHours: number;
}

/** 예전 "잘게요" 버튼의 임시 상태. 버튼은 없앴지만 저장 데이터 호환을 위해 남겨 둔다 */
export interface PendingSleep {
  bedTime: string; // ISO
}

export const DEFAULT_SETTINGS: Settings = {
  targetBedTime: '23:30',
  targetWakeTime: '07:00',
  targetSleepHours: 7.5,
};
