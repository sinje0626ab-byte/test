// localStorage 저장/불러오기. 각 시스템은 save:collect / save:apply 이벤트로 자기 몫을 처리한다.
export const SAVE_VERSION = 1;

// 이전 버전 → 다음 버전 변환. 예) 1: (s) => ({ ...s, 새필드: 기본값, saveVersion: 2 })
const migrations = {};

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
    if (!raw) return false;

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
      return false;
    }
    this.ctx.bus.emit('save:apply', data);
    this.ctx.bus.emit('notify', { text: '이어서 시작합니다', kind: 'info' });
    return true;
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
