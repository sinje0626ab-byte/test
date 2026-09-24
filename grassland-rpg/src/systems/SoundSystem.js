// 효과음: 게임 이벤트를 듣고 sounds.json의 합성음을 낸다.
// 같은 소리는 한 프레임에 한 번, 동시 재생 최대 maxVoices, 멀면 작게(maxDistance 넘으면 무음).
export class SoundSystem {
  constructor(ctx, synth) {
    this.ctx = ctx;
    this.synth = synth;
    this.cfg = ctx.data.sounds;
    this.played = new Set();
    this.volume = 1;
    const { bus } = ctx;
    const at = (e) => e?.position;

    bus.on('settings:changed', ({ key, value }) => {
      if (key === 'sfxVolume') this.volume = value;
      this.applyVolume();
    });
    synth.onStart = () => this.applyVolume();

    bus.on('player:attack', (a) => { if (!a.shock) this.play('swing'); });
    bus.on('player:shoot', () => this.play('shoot'));
    bus.on('player:shock', () => this.play('shock'));
    bus.on('item:use', (e) => { if (ctx.data.items.items[e.item]?.category === 'consumable') this.play('drink'); });
    bus.on('combat:hit', (e) => {
      if (e.target === 'monster' && e.source === 'player') this.play(e.crit ? 'crit' : 'hit', at(e));
      else if (e.target === 'monster') this.play('hit', at(e), { gain: 0.5 });
    });
    bus.on('monster:killed', (e) => this.play('kill', at(e), { pitch: Math.min(1.6, Math.max(0.45, 0.6 / (e.radius ?? 0.6))) }));
    bus.on('loot:picked', ({ item }) => this.play(ctx.data.items.items[item]?.category === 'currency' ? 'coin' : 'pickup'));
    bus.on('stats:levelup', () => this.play('levelup'));
    bus.on('gather:hit', (e) => this.play(e.sound, e.position));
    bus.on('gather:done', (e) => this.play('gathered', e.position));
    bus.on('player:damaged', () => this.play('hurt'));
    bus.on('player:roll', () => this.play('roll'));
    bus.on('turret:fired', (e) => this.play(ctx.data.turrets[e.type]?.model ?? 'bow', at(e), { gain: 0.8 }));
    bus.on('projectile:explode', (e) => this.play('boom', at(e)));
    bus.on('boss:aoe', (e) => this.play('slam', at(e)));
    bus.on('build:place', () => this.play('build'));
    bus.on('base:upgraded', () => this.play('build'));
    bus.on('ui:open', () => this.play('open'));
    bus.on('ui:close', () => this.play('close'));
    bus.on('raid:start', () => this.play('horn'));
    bus.on('time:day', () => this.play('birds'));
    // 버튼 누르는 소리 (타이틀·메뉴·창 모두)
    document.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) this.play('click'); });
  }

  applyVolume() {
    if (!this.synth.ctx) return;
    this.synth.sfxBus.gain.value = this.cfg.masterSfx * this.volume;
  }

  play(name, position, { gain = 1, pitch = 1 } = {}) {
    const s = this.synth;
    const notes = this.cfg.sfx[name];
    if (!notes || !s.ready || this.volume <= 0) return;
    if (this.played.has(name) || s.voices >= this.cfg.maxVoices) return;
    let g = gain;
    if (position) {
      const d = position.distanceTo?.(this.ctx.player.position) ?? 0;
      if (d > this.cfg.maxDistance) return;
      g *= 1 - (d / this.cfg.maxDistance) * 0.8;
    }
    this.played.add(name);
    const when = s.now + 0.005;
    for (const n of notes) s.tone(n, { out: s.sfxBus, when, gain: g, pitch });
  }

  update() {
    this.played.clear();
  }
}
