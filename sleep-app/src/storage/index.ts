import { localStorageRepo } from './localStorageRepo';
import type { SleepRepository } from './types';

// 앱이 쓰는 저장소는 여기서 하나만 고른다. 2단계에서는 이 줄만 Supabase 구현체로 바꾼다.
export const repo: SleepRepository = localStorageRepo;

export type { ExportData, SleepRepository, Snapshot } from './types';
