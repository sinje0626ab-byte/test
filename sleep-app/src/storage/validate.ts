import { DEFAULT_SETTINGS, type DailyFactors, type Settings, type SleepLog } from '../types';
import { SCHEMA_VERSION, type ExportData } from './types';

// 불러오기·저장 데이터 검사와 버전 마이그레이션. 저장소 구현과 무관하게 재사용한다.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isIso = (v: unknown): v is string => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export function isClock(v: unknown): v is string {
  return typeof v === 'string' && CLOCK_RE.test(v);
}

export function parseLog(v: unknown): SleepLog | null {
  if (!isObj(v)) return null;
  const { id, date, bedTime, sleepTime, wakeTime, awakenings, quality, note, createdAt, updatedAt } = v;
  if (typeof id !== 'string' || !id) return null;
  if (typeof date !== 'string' || !DATE_RE.test(date)) return null;
  if (!isIso(bedTime) || !isIso(sleepTime) || !isIso(wakeTime)) return null;
  if (typeof awakenings !== 'number' || awakenings < 0) return null;
  if (typeof quality !== 'number' || ![1, 2, 3, 4, 5].includes(quality)) return null;
  const now = new Date().toISOString();
  return {
    id,
    date,
    bedTime,
    sleepTime,
    wakeTime,
    awakenings: Math.min(5, Math.round(awakenings)),
    quality: quality as SleepLog['quality'],
    ...(typeof note === 'string' && note ? { note } : {}),
    createdAt: isIso(createdAt) ? createdAt : now,
    updatedAt: isIso(updatedAt) ? updatedAt : now,
  };
}

export function parseFactors(v: unknown): DailyFactors | null {
  if (!isObj(v) || typeof v.date !== 'string' || !DATE_RE.test(v.date)) return null;
  const f: DailyFactors = { date: v.date };
  if (v.caffeineLastTime === null || isClock(v.caffeineLastTime)) f.caffeineLastTime = v.caffeineLastTime;
  if (v.alcohol === 'none' || v.alcohol === 'some' || v.alcohol === 'heavy') f.alcohol = v.alcohol;
  if (typeof v.exerciseMinutes === 'number' && v.exerciseMinutes >= 0) f.exerciseMinutes = v.exerciseMinutes;
  if (typeof v.napMinutes === 'number' && v.napMinutes >= 0) f.napMinutes = v.napMinutes;
  if (typeof v.screenBeforeBed === 'boolean') f.screenBeforeBed = v.screenBeforeBed;
  if (typeof v.stress === 'number' && [1, 2, 3, 4, 5].includes(v.stress)) f.stress = v.stress as DailyFactors['stress'];
  return f;
}

export function parseSettings(v: unknown): Settings {
  const s = isObj(v) ? v : {};
  return {
    targetBedTime: isClock(s.targetBedTime) ? s.targetBedTime : DEFAULT_SETTINGS.targetBedTime,
    targetWakeTime: isClock(s.targetWakeTime) ? s.targetWakeTime : DEFAULT_SETTINGS.targetWakeTime,
    targetSleepHours:
      typeof s.targetSleepHours === 'number' && s.targetSleepHours >= 3 && s.targetSleepHours <= 14
        ? s.targetSleepHours
        : DEFAULT_SETTINGS.targetSleepHours,
  };
}

/** 이전 schemaVersion 데이터를 현재 모양으로 올린다. 버전이 오를 때 단계를 추가한다. */
const MIGRATIONS: Record<number, (d: Record<string, unknown>) => Record<string, unknown>> = {
  // 1: (d) => ({ ...d, schemaVersion: 2, ... }),
};

export function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  let d = raw;
  let v = typeof d.schemaVersion === 'number' ? d.schemaVersion : 1;
  while (v < SCHEMA_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) throw new Error(`알 수 없는 데이터 버전이에요 (v${v})`);
    d = step(d);
    v += 1;
  }
  if (v > SCHEMA_VERSION) throw new Error('더 새 버전 앱에서 만든 파일이에요');
  return d;
}

/** 내보낸 JSON 을 검사해 정리된 데이터로 돌려준다. 형식이 틀리면 throw */
export function parseExport(data: unknown): Omit<ExportData, 'exportedAt'> {
  if (!isObj(data) || !Array.isArray(data.logs)) throw new Error('잠기록에서 내보낸 파일이 아니에요');
  const d = migrate(data);
  const logs = (d.logs as unknown[]).map(parseLog);
  if (logs.some((l) => l === null)) throw new Error('파일 안에 읽을 수 없는 기록이 있어요');
  const factors = (Array.isArray(d.factors) ? d.factors : []).map(parseFactors).filter((f): f is DailyFactors => !!f);
  return {
    app: 'jamgirok',
    schemaVersion: SCHEMA_VERSION,
    logs: dedupeByDate(logs as SleepLog[]),
    factors,
    settings: parseSettings(d.settings),
  };
}

/** 같은 date 가 여러 개면 가장 최근에 고친 것만 남긴다 */
function dedupeByDate(logs: SleepLog[]): SleepLog[] {
  const byDate = new Map<string, SleepLog>();
  for (const l of logs) {
    const prev = byDate.get(l.date);
    if (!prev || prev.updatedAt < l.updatedAt) byDate.set(l.date, l);
  }
  return [...byDate.values()];
}
