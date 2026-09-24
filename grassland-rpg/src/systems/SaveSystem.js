// localStorage 저장/불러오기. 각 시스템은 save:collect / save:apply 이벤트로 자기 몫을 처리한다.
export const SAVE_VERSION = 7;

// 이전 버전 → 다음 버전 변환
const migrations = {
  // v1 → v2: 기지·포탑·시간 추가. v1엔 기지가 없으니 텐트 키트를 하나 넣어 준다.
  1: (s) => {
    const slots = s.inventory?.slots ? [...s.inventory.slots] : [];
    const free = slots.indexOf(null);
    const kit = { id: 'tent_kit', count: 1 };
    if (free >= 0) slots[free] = kit;
    else slots.push(kit);
    return { ...s, saveVersion: 2, inventory: { slots }, bases: [], turrets: [] };
  },
  // v2 → v3: 레벨·장비·스킬 추가
  2: (s) => ({
    ...s,
    saveVersion: 3,
    stats: { level: 1, xp: 0, skillPoints: 0 },
    equipment: { slots: {} },
    skills: { ranks: {} },
  }),
  // v3 → v4: 탐험 기록 추가 (빈 값이면 불러온 뒤 주변부터 다시 밝힌다)
  3: (s) => ({ ...s, saveVersion: 4, exploration: null }),
  // v4 → v5: 포탑 우선순위 (그때까진 나무 활뿐이라 기본값 nearest)
  4: (s) => ({ ...s, saveVersion: 5, turrets: (s.turrets ?? []).map((t) => ({ ...t, priority: t.priority ?? 'nearest' })) }),
  // v5 → v6: 부속 건물·창고 추가
  5: (s) => ({ ...s, saveVersion: 6, facilities: [], storages: {} }),
  // v6 → v7: 보스 처치 기록 (빈 값 = 모두 살아 있음)
  6: (s) => ({ ...s, saveVersion: 7, bosses: {} }),
};

export class SaveSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.save;
    this.timer = this.cfg.autosaveInterval;
    this.disabled = false;

    window.addEventListener('beforeunload', () => this.save());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.save();
    });
    ctx.bus.on('save:request', () => this.save());
  }

  load() {
    let raw;
    try {
      raw = localStorage.getItem(this.cfg.key);
    } catch {
      return false;
    }
    if (!raw) {
      this.ctx.bus.emit('game:new');
      return false;
    }

    let data;
    try {
      data = this.migrate(JSON.parse(raw));
    } catch (err) {
      console.warn('[save] 불러오기 실패:', err.message);
      if (err.newer) {
        // 더 새로운 버전으로 만든 저장은 지우지 않도록 자동 저장을 끈다.
        this.disabled = true;
      } else {
        try { localStorage.setItem(`${this.cfg.key}-broken`, raw); } catch { /* 무시 */ }
      }
      this.ctx.bus.emit('notify', { text: '저장을 불러오지 못해 새로 시작합니다', kind: 'warn' });
      this.ctx.bus.emit('game:new');
      return false;
    }
    this.ctx.bus.emit('save:apply', data);
    this.ctx.bus.emit('save:loaded', data);
    this.ctx.bus.emit('notify', { text: '이어서 시작합니다', kind: 'info' });
    return true;
  }

  // 타이틀의 "이어하기"에 보여 줄 요약. 저장이 없으면 null
  peek() {
    let raw;
    try {
      raw = localStorage.getItem(this.cfg.key);
    } catch {
      return null;
    }
    if (!raw) return null;
    try {
      const s = this.migrate(JSON.parse(raw));
      return {
        day: s.time?.day ?? 1,
        level: s.stats?.level ?? 1,
        gold: s.economy?.gold ?? 0,
        bases: s.bases?.length ?? 0,
        savedAt: s.savedAt,
      };
    } catch (err) {
      return { broken: true, newer: !!err.newer };
    }
  }

  clear() {
    try { localStorage.removeItem(this.cfg.key); } catch { /* 무시 */ }
  }

  migrate(save) {
    if (typeof save?.saveVersion !== 'number') throw new Error('saveVersion 없음');
    if (save.saveVersion > SAVE_VERSION) {
      const err = new Error(`더 새로운 저장 (v${save.saveVersion})`);
      err.newer = true;
      throw err;
    }
    let s = save;
    while (s.saveVersion < SAVE_VERSION) {
      const step = migrations[s.saveVersion];
      if (!step) throw new Error(`v${s.saveVersion} 마이그레이션 없음`);
      s = step(s);
    }
    return s;
  }

  save() {
    if (this.disabled) return;
    const data = { saveVersion: SAVE_VERSION, savedAt: Date.now() };
    this.ctx.bus.emit('save:collect', data);
    try {
      localStorage.setItem(this.cfg.key, JSON.stringify(data));
    } catch (err) {
      console.warn('[save] 저장 실패:', err.message);
      return;
    }
    this.timer = this.cfg.autosaveInterval;
    this.ctx.bus.emit('save:done', { savedAt: data.savedAt });
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) this.save();
  }
}
