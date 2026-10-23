import type { DailyFactors, DateKey, PendingSleep, Settings, SleepLog } from '../types';

export const SCHEMA_VERSION = 1;

/** 내보내기 파일 / 저장 데이터 전체 모양 */
export interface ExportData {
  app: 'jamgirok';
  schemaVersion: number;
  exportedAt: string;
  logs: SleepLog[];
  factors: DailyFactors[];
  settings: Settings;
}

/** 첫 렌더에 바로 쓰는 전체 스냅샷 */
export interface Snapshot {
  logs: SleepLog[];
  factors: DailyFactors[];
  settings: Settings;
  pending: PendingSleep | null;
}

/**
 * 저장소 인터페이스. 화면은 이것만 쓴다.
 * 2단계(Supabase)는 네트워크라 비동기이므로 지금부터 Promise 로 맞춰 둔다.
 * loadSnapshot 은 동기 저장소만 제공한다 — 첫 렌더 깜빡임을 없애기 위해서다.
 */
export interface SleepRepository {
  loadSnapshot?(): Snapshot;

  getLogs(): Promise<SleepLog[]>;
  getLog(date: DateKey): Promise<SleepLog | null>;
  saveLog(log: SleepLog): Promise<void>; // 같은 date 가 있으면 덮어쓴다
  deleteLog(id: string): Promise<void>; // 같은 date 의 요인도 함께 지운다

  getFactors(date?: DateKey): Promise<DailyFactors[]>;
  saveFactors(factors: DailyFactors): Promise<void>;

  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<void>;

  getPending(): Promise<PendingSleep | null>;
  savePending(pending: PendingSleep | null): Promise<void>;

  exportAll(): Promise<ExportData>;
  /** 기존 기록을 모두 지우고 data 로 바꾼다. 형식이 틀리면 throw */
  importAll(data: unknown): Promise<void>;
  clearAll(): Promise<void>;
}
