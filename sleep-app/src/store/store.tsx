import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { repo, type Snapshot } from '../storage';
import { DEFAULT_SETTINGS, type DailyFactors, type Settings, type SleepLog } from '../types';

// 앱 상태. 저장소(repo) 인터페이스만 거친다 — localStorage 를 직접 만지지 않는다.

interface Store extends Snapshot {
  startSleep(at?: Date): Promise<void>;
  cancelSleep(): Promise<void>;
  saveLog(log: SleepLog): Promise<void>;
  deleteLog(id: string): Promise<void>;
  saveFactors(f: DailyFactors): Promise<void>;
  saveSettings(s: Settings): Promise<void>;
  exportAll: typeof repo.exportAll;
  importAll(data: unknown): Promise<void>;
  clearAll(): Promise<void>;
}

const Ctx = createContext<Store | null>(null);

// 동기 저장소라면 첫 렌더부터 데이터를 채운다 (로딩 깜빡임 없음)
const initial = (): Snapshot =>
  repo.loadSnapshot?.() ?? { logs: [], factors: [], settings: DEFAULT_SETTINGS, pending: null };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(initial);

  const refresh = useCallback(async () => {
    const [logs, factors, settings, pending] = await Promise.all([
      repo.getLogs(),
      repo.getFactors(),
      repo.getSettings(),
      repo.getPending(),
    ]);
    setSnap({ logs, factors, settings, pending });
  }, []);

  const store = useMemo<Store>(() => {
    const run =
      <A extends unknown[]>(fn: (...a: A) => Promise<void>) =>
      async (...a: A) => {
        await fn(...a);
        await refresh();
      };
    return {
      ...snap,
      startSleep: run((at: Date = new Date()) => repo.savePending({ bedTime: at.toISOString() })),
      cancelSleep: run(() => repo.savePending(null)),
      saveLog: run((l: SleepLog) => repo.saveLog(l)),
      deleteLog: run((id: string) => repo.deleteLog(id)),
      saveFactors: run((f: DailyFactors) => repo.saveFactors(f)),
      saveSettings: run((s: Settings) => repo.saveSettings(s)),
      exportAll: () => repo.exportAll(),
      importAll: run((d: unknown) => repo.importAll(d)),
      clearAll: run(() => repo.clearAll()),
    };
  }, [snap, refresh]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider 밖에서 useStore 를 썼어요');
  return s;
}
