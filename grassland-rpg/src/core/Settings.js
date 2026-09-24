// 설정: 세이브와 따로 localStorage 한 키에 둔다. 바뀌면 settings:changed.
const KEY = 'grassland-rpg-settings';
const DEFAULTS = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  shake: true,
  shadows: 'high', // off | low | high
  decorDensity: 1, // 0.5 | 1
  damageNumbers: true,
};

export class Settings {
  constructor(bus) {
    this.bus = bus;
    this.values = { ...DEFAULTS };
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) Object.assign(this.values, JSON.parse(raw));
    } catch { /* 읽지 못하면 기본값 */ }
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    if (this.values[key] === value) return;
    this.values[key] = value;
    try { localStorage.setItem(KEY, JSON.stringify(this.values)); } catch { /* 무시 */ }
    this.bus.emit('settings:changed', { key, value, values: this.values });
  }

  // 시작할 때 한 번, 모두에게 현재 값을 알린다.
  broadcast() {
    for (const [key, value] of Object.entries(this.values)) this.bus.emit('settings:changed', { key, value, values: this.values });
  }
}
