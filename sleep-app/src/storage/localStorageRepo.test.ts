import { beforeEach, describe, expect, it } from 'vitest';
import type { SleepLog } from '../types';
import { localStorageRepo as repo } from './localStorageRepo';

// node 환경에는 localStorage 가 없어서 간단한 대역을 끼운다
class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

const log = (date: string, id = `id-${date}`): SleepLog => ({
  id,
  date,
  bedTime: `${date}T00:00:00.000Z`,
  sleepTime: `${date}T00:15:00.000Z`,
  wakeTime: `${date}T07:00:00.000Z`,
  note: '메모',
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
});

beforeEach(() => {
  (globalThis as { localStorage?: unknown }).localStorage = new MemoryStorage();
});

describe('localStorageRepo', () => {
  it('같은 date 는 하나만 남는다', async () => {
    await repo.saveLog(log('2026-10-20', 'a'));
    await repo.saveLog(log('2026-10-20', 'b'));
    const logs = await repo.getLogs();
    expect(logs.map((l) => l.id)).toEqual(['b']);
  });

  it('기록을 지우면 같은 날 요인도 지운다', async () => {
    await repo.saveLog(log('2026-10-20'));
    await repo.saveFactors({ date: '2026-10-20', alcohol: 'none' });
    await repo.deleteLog('id-2026-10-20');
    expect(await repo.getFactors()).toEqual([]);
  });

  it('내보낸 JSON 을 불러오면 그대로 복원된다', async () => {
    await repo.saveLog(log('2026-10-20'));
    await repo.saveLog(log('2026-10-21'));
    await repo.saveFactors({ date: '2026-10-21', caffeineLastTime: null, stress: 2, screenBeforeBed: true });
    await repo.saveSettings({ targetBedTime: '00:00', targetWakeTime: '08:00', targetSleepHours: 8 });
    const exported = JSON.parse(JSON.stringify(await repo.exportAll()));
    expect(exported.schemaVersion).toBe(1);

    await repo.clearAll();
    expect(await repo.getLogs()).toEqual([]);

    await repo.importAll(exported);
    const again = await repo.exportAll();
    expect({ ...again, exportedAt: '' }).toEqual({ ...exported, exportedAt: '' });
  });

  it('형식이 틀린 파일은 거부하고 기존 기록을 지킨다', async () => {
    await repo.saveLog(log('2026-10-20'));
    await expect(repo.importAll({ hello: 1 })).rejects.toThrow();
    await expect(repo.importAll({ logs: [{ id: 1 }] })).rejects.toThrow();
    expect(await repo.getLogs()).toHaveLength(1);
  });

  it('대기 중인 "잘게요" 를 저장하고 지운다', async () => {
    await repo.savePending({ bedTime: '2026-10-20T14:00:00.000Z' });
    expect(repo.loadSnapshot!().pending).toEqual({ bedTime: '2026-10-20T14:00:00.000Z' });
    await repo.savePending(null);
    expect(await repo.getPending()).toBeNull();
  });
});
