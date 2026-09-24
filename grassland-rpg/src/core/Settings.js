// 설정: 세이브와 따로 localStorage 한 키에 둔다. 바뀌면 settings:changed.
const KEY = 'grassland-rpg-settings';
const DEFAULTS = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  shake: true,
  shadows: 'high', // off | low | high (터치 기기는 처음에 low)
  decorDensity: 1, // 0.5 | 1
  damageNumbers: true,
};

export class Settings {
  constructor(bus) {
    this.bus = bus;
    this.values = { ...DEFAULTS };
    // 휴대폰·태블릿은 처음에 그림자를 낮게 (저장된 설정이 있으면 그걸 따른다)
    if (window.matchMedia?.('(pointer: coarse)').matches) this.values.shadows = 'low';
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
