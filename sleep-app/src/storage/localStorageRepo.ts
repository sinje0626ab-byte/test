import { DEFAULT_SETTINGS, type DailyFactors, type PendingSleep, type Settings, type SleepLog } from '../types';
import { SCHEMA_VERSION, type ExportData, type SleepRepository, type Snapshot } from './types';
import { migrate, parseExport, parseFactors, parseLog, parseSettings } from './validate';

// 1단계 구현체: 브라우저 localStorage 키 하나에 전부 담는다.
// 화면 코드는 이 파일을 직접 import 하지 않는다 (storage/index.ts 의 repo 만 쓴다).

const KEY = 'jamgirok';

interface Stored {
  schemaVersion: number;
  logs: SleepLog[];
  factors: DailyFactors[];
  settings: Settings;
  pending: PendingSleep | null;
}

const empty = (): Stored => ({
  schemaVersion: SCHEMA_VERSION,
  logs: [],
  factors: [],
  settings: { ...DEFAULT_SETTINGS },
  pending: null,
});

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null; // 사파리 개인정보 보호 모드 등
  }
}

function read(): Stored {
  const raw = storage()?.getItem(KEY);
  if (!raw) return empty();
  try {
    const d = migrate(JSON.parse(raw));
    return {
      schemaVersion: SCHEMA_VERSION,
      logs: (Array.isArray(d.logs) ? d.logs : []).map(parseLog).filter((l): l is SleepLog => !!l),
      factors: (Array.isArray(d.factors) ? d.factors : []).map(parseFactors).filter((f): f is DailyFactors => !!f),
      settings: parseSettings(d.settings),
      pending:
        d.pending && typeof (d.pending as PendingSleep).bedTime === 'string'
          ? { bedTime: (d.pending as PendingSleep).bedTime }
          : null,
    };
  } catch {
    return empty();
  }
}

function write(s: Stored) {
  storage()?.setItem(KEY, JSON.stringify(s));
}

function update(fn: (s: Stored) => void) {
  const s = read();
  fn(s);
  write(s);
}

const byDateDesc = (a: SleepLog, b: SleepLog) => b.date.localeCompare(a.date);

export const localStorageRepo: SleepRepository = {
  loadSnapshot(): Snapshot {
    const s = read();
    return { logs: [...s.logs].sort(byDateDesc), factors: s.factors, settings: s.settings, pending: s.pending };
  },

  async getLogs() {
    return [...read().logs].sort(byDateDesc);
  },
  async getLog(date) {
    return read().logs.find((l) => l.date === date) ?? null;
  },
  async saveLog(log) {
    update((s) => {
      // 같은 id 이거나 같은 date 면 바꿔 끼운다 (하루에 메인 수면 기록 1개)
      s.logs = s.logs.filter((l) => l.id !== log.id && l.date !== log.date);
      s.logs.push(log);
    });
  },
  async deleteLog(id) {
    update((s) => {
      const target = s.logs.find((l) => l.id === id);
      s.logs = s.logs.filter((l) => l.id !== id);
      if (target) s.factors = s.factors.filter((f) => f.date !== target.date);
    });
  },

  async getFactors(date) {
    const all = read().factors;
    return date ? all.filter((f) => f.date === date) : all;
  },
  async saveFactors(factors) {
    update((s) => {
      s.factors = s.factors.filter((f) => f.date !== factors.date);
      s.factors.push(factors);
    });
  },

  async getSettings() {
    return read().settings;
  },
  async saveSettings(settings) {
    update((s) => {
      s.settings = settings;
    });
  },

  async getPending() {
    return read().pending;
  },
  async savePending(pending) {
    update((s) => {
      s.pending = pending;
    });
  },

  async exportAll(): Promise<ExportData> {
    const s = read();
    return {
      app: 'jamgirok',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      logs: [...s.logs].sort(byDateDesc),
      factors: s.factors,
      settings: s.settings,
    };
  },
  async importAll(data) {
    const d = parseExport(data); // 틀리면 여기서 throw → 기존 데이터는 그대로
    update((s) => {
      s.logs = d.logs;
      s.factors = d.factors;
      s.settings = d.settings;
    });
  },
  async clearAll() {
    write(empty());
  },
};
