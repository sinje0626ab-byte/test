// 효과음: 게임 이벤트를 듣고 소리를 낸다.
// 녹음 파일(src/sfx/<키>_<번호>.mp3, CC0)이 있으면 그것을, 없으면 sounds.json sfx 의 합성음을 낸다.
// - 같은 키 파일 여럿 중 무작위(바로 전 것은 피함), 매번 음높이·크기를 조금씩 흔든다 (sounds.json samples)
// - 플레이어에서 멀면 작게(maxDistance 넘으면 무음), 화면 왼쪽·오른쪽으로 소리를 나눈다
// - 같은 키는 한 프레임에 한 번, 동시 재생이 maxVoices 를 넘으면 우선순위가 낮은 소리부터 버린다
// - 발소리(지역별 바닥)와 환경음(새·숲·바람·밤 벌레, 앞뒤를 겹쳐 끊김 없이)
const FILES = import.meta.glob('../sfx/*.mp3', { query: '?url', import: 'default', eager: true });
const URLS = {};
for (const [path, url] of Object.entries(FILES)) {
  const key = path.match(/([a-z_]+)_\d+\.mp3$/)?.[1];
  if (key) (URLS[key] ??= []).push(url);
}

const STEP = { grassland: 'step_grass', forest: 'step_dirt', desert: 'step_sand', snow: 'step_snow' };
const AMB = { grassland: 'amb_birds', forest: 'amb_forest', desert: 'amb_wind', snow: 'amb_wind' };
const TURRET = { bow: ['bow', 1], crossbow: ['bow', 0.78], gun: ['gun', 1], cannon: ['cannon', 1], poison: ['spit', 1.25], frost: ['hit_ice', 1.3] };

export class SoundSystem {
  constructor(ctx, synth) {
    this.ctx = ctx;
    this.synth = synth;
    this.cfg = ctx.data.sounds;
    this.sam = this.cfg.samples;
    this.played = new Set();
    this.volume = 1;
    this.buffers = {}; // 키 → AudioBuffer[]
    this.last = {}; // 키 → 바로 전에 튼 번호
    this.active = []; // 지금 울리는 파일 소리 { prio, src }
    this.amb = { key: null, cur: null, timer: 0 };
    this.stepPhase = 0;
    this.prevTime = 0;
    const { bus } = ctx;
    const at = (e) => e?.position;
    const items = ctx.data.items.items;

    this.ambVolume = 1;
    bus.on('settings:changed', ({ key, value }) => {
      if (key === 'sfxVolume') this.volume = value;
      if (key === 'ambVolume') {
        this.ambVolume = value;
        const cur = this.amb.cur;
        if (cur && this.synth.ctx) cur.g.gain.setTargetAtTime(this.ambGain(this.amb.key), this.synth.now, 0.1);
      }
      this.applyVolume();
    });
    synth.onStart = () => { this.applyVolume(); this.load(); };

    // 전투
    bus.on('player:attack', (a) => {
      if (a.shock) return;
      const type = ctx.player.attack?.type;
      if (type === 'hammer') this.play('swing_heavy', null, { pitch: 0.85 });
      else this.play('swing', null, { pitch: type === 'spear' ? 1.15 : 1 });
    });
    bus.on('player:shoot', () => this.play('bow'));
    bus.on('player:shock', () => this.play('shock'));
    bus.on('combat:hit', (e) => {
      if (e.target !== 'monster' || e.source === 'status') return;
      const hit = `hit_${this.material(e.type)}`;
      if (e.source === 'player') {
        this.play(hit, at(e));
        if (e.crit) this.play('crit', at(e));
      } else this.play(hit, at(e), { gain: 0.45 });
    });
    bus.on('monster:killed', (e) => {
      const r = e.radius ?? 0.6;
      this.play('pop', at(e), { pitch: Math.min(1.4, Math.max(0.55, 0.65 / r)) });
      if (this.material(e.type) === 'soft') this.play('squish', at(e), { gain: 0.7 });
    });
    bus.on('player:damaged', () => this.play('hurt'));
    bus.on('player:roll', () => this.play('roll'));
    bus.on('player:dash', () => this.play('swing_heavy', null, { pitch: 1.25 }));
    bus.on('player:sweep', () => this.play('swing_heavy', null, { pitch: 1.05 }));
    bus.on('monster:countered', ({ monster }) => { this.play('counter', monster.position); this.play('crit', monster.position); });
    bus.on('monster:stunned', ({ monster }) => this.play('stunned', monster.position));
    bus.on('monster:shoot', (e) => this.play('spit', e.origin, { gain: 0.6 }));
    bus.on('monster:emerge', (e) => this.play('dirt', e.position));
    bus.on('monster:blast', (e) => this.play('boom', e.position));
    bus.on('projectile:explode', (e) => this.play('boom', at(e), { gain: 0.8 }));
    bus.on('turret:fired', (e) => {
      const [key, pitch] = TURRET[ctx.data.turrets[e.type]?.model] ?? TURRET.bow;
      this.play(key, at(e), { gain: 0.7, pitch });
    });
    bus.on('turret:overclock', () => this.play('shock', null, { pitch: 1.5 }));
    // 보스
    bus.on('boss:engaged', (e) => this.play('roar', e?.boss?.position));
    bus.on('boss:phase', ({ boss }) => this.play('roar', boss.position, { pitch: 0.9 }));
    bus.on('boss:enraged', ({ boss }) => this.play('roar', boss.position, { pitch: 1.1 }));
    bus.on('boss:defeated', () => this.play('victory'));
    bus.on('boss:aoe', (e) => this.play('slam', at(e)));
    bus.on('boss:line', (e) => this.play('slam', e.origin, { pitch: 0.85 }));
    bus.on('boss:split', ({ boss }) => { this.play('slam', boss.position, { pitch: 1.3 }); this.play('squish', boss.position); });
    bus.on('boss:leafstorm', ({ boss }) => this.play('rustle', boss.position, { pitch: 0.8 }));
    // 채집·획득·성장
    bus.on('gather:hit', (e) => this.play(e.sound === 'mine' && /ice/.test(e.node ?? '') ? 'mine_ice' : e.sound, e.position));
    bus.on('gather:done', (e) => this.play('gathered', e.position));
    bus.on('loot:picked', ({ item }) => {
      const def = items[item];
      if (def?.category === 'currency') this.play('coin');
      else if (['rare', 'epic', 'legendary'].includes(def?.grade)) this.play('rare');
      else this.play('pickup');
    });
    bus.on('stats:levelup', () => this.play('levelup'));
    bus.on('chest:opened', () => { this.play('rare'); this.play('coin'); });
    bus.on('chest:mimic', () => this.play('roar'));
    bus.on('quest:completed', () => this.play('quest'));
    bus.on('bounty:claimed', () => this.play('jingle'));
    bus.on('item:use', (e) => { if (items[e.item]?.category === 'consumable') this.play('drink'); });
    bus.on('skill:used', ({ id }) => { if (id === 'first_aid') this.play('heal'); });
    bus.on('shop:buy', () => this.play('coin'));
    bus.on('shop:sell', () => this.play('coin'));
    bus.on('forge:enhanced', () => this.play('anvil'));
    bus.on('craft:make', () => this.play('anvil', null, { pitch: 1.2 }));
    bus.on('garden:plant', () => this.play('dirt', null, { gain: 0.6 }));
    bus.on('garden:harvest', () => this.play('pickup'));
    // 건설·기지
    bus.on('build:place', () => this.play('build'));
    bus.on('base:upgraded', () => { this.play('build'); this.play('jingle'); });
    bus.on('raid:start', () => this.play('horn'));
    bus.on('time:day', () => this.play('birds'));
    // 창·대화
    bus.on('ui:open', () => this.play('open'));
    bus.on('ui:close', () => this.play('close'));
    bus.on('dialogue:blip', () => this.play('talk'));
    bus.on('notify', (e) => { if (e.kind === 'error') this.play('error'); });
    // UI 소리 (타이틀·메뉴·창 모두): 누름 = click, 탭 전환 = tab, 마우스를 올리면 아주 작은 tick (PC)
    const TABS = '.tabs button, .sk-tab, .seg button, .t-slot';
    document.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('button');
      if (b) this.play(b.matches(TABS) ? 'tab' : 'click');
    });
    let hovered = null;
    document.addEventListener('pointerover', (e) => {
      if (e.pointerType !== 'mouse') return;
      const b = e.target.closest('button:not(:disabled)');
      if (b && b !== hovered) this.play('tick');
      hovered = b;
    });
  }

  // 몬스터 몸 재질 → 맞는 소리 (sounds.json materials, 없으면 살)
  material(type) {
    return this.cfg.materials[type] ?? 'flesh';
  }

  // 파일을 모두 읽는다 (시작을 막지 않는다. 다 읽기 전엔 합성음)
  async load() {
    const ac = this.synth.ctx;
    const keys = Object.keys(URLS).sort((a, b) => a.startsWith('amb_') - b.startsWith('amb_')); // 환경음은 마지막
    for (const key of keys) {
      const list = await Promise.all(URLS[key].map(async (url) => {
        try {
          const res = await fetch(url);
          return await ac.decodeAudioData(await res.arrayBuffer());
        } catch {
          return null;
        }
      }));
      const ok = list.filter(Boolean);
      if (ok.length) this.buffers[key] = ok;
    }
  }

  applyVolume() {
    if (!this.synth.ctx) return;
    this.synth.sfxBus.gain.value = this.cfg.masterSfx * this.volume;
  }

  play(name, position, { gain = 1, pitch = 1 } = {}) {
    const s = this.synth;
    if (!s.ready || this.volume <= 0 || this.played.has(name)) return;
    let g = gain;
    let pan = 0;
    if (position) {
      const p = this.ctx.player.position;
      const d = position.distanceTo?.(p) ?? 0;
      if (d > this.cfg.maxDistance) return;
      g *= 1 - (d / this.cfg.maxDistance) * 0.8;
      pan = Math.max(-0.7, Math.min(0.7, (position.x - p.x) / this.cfg.panDistance));
    }
    if (this.buffers[name]) {
      this.played.add(name);
      this.sample(name, g, pitch, pan);
      return;
    }
    const notes = this.cfg.sfx[name] ?? this.cfg.sfx[this.cfg.fallback[name]];
    if (!notes || s.voices >= this.cfg.maxVoices) return;
    this.played.add(name);
    const when = s.now + 0.005;
    for (const n of notes) s.tone(n, { out: s.sfxBus, when, gain: g, pitch });
  }

  sample(name, gain, pitch, pan) {
    const ac = this.synth.ctx;
    const o = { ...this.sam.default, ...this.sam[name] };
    // 동시 재생 제한: 넘치면 가장 덜 중요한(같으면 오래된) 소리를 끈다. 내가 더 덜 중요하면 안 낸다
    if (this.active.length >= this.cfg.maxSampleVoices) {
      let low = null;
      for (const v of this.active) if (!low || v.prio < low.prio) low = v;
      if (low.prio > o.priority) return;
      low.src.stop();
      this.active.splice(this.active.indexOf(low), 1);
    }
    const list = this.buffers[name];
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === this.last[name]) i = (i + 1) % list.length;
    this.last[name] = i;
    const src = ac.createBufferSource();
    src.buffer = list[i];
    src.playbackRate.value = pitch * (1 + (Math.random() * 2 - 1) * o.pitchVar);
    const g = ac.createGain();
    g.gain.value = gain * o.gain * (1 + (Math.random() * 2 - 1) * o.gainVar);
    src.connect(g);
    let out = g;
    if (pan && ac.createStereoPanner) {
      const p = ac.createStereoPanner();
      p.pan.value = pan;
      g.connect(p);
      out = p;
    }
    out.connect(this.synth.sfxBus);
    const v = { prio: o.priority, src };
    this.active.push(v);
    src.onended = () => {
      const k = this.active.indexOf(v);
      if (k >= 0) this.active.splice(k, 1);
      out.disconnect();
    };
    src.start();
  }

  update() {
    this.played.clear();
    if (!this.synth.ready) return;
    const now = this.synth.now;
    const dt = Math.min(0.1, now - this.prevTime);
    this.prevTime = now;
    this.footsteps();
    this.ambience(dt);
  }

  // 걸음마다(다리 흔들림 반 바퀴) 바닥 소리. 달리면 조금 크게
  footsteps() {
    const p = this.ctx.player;
    if (this.ctx.state !== 'play' || !p.alive || p.roll?.active) { this.stepPhase = p.walkPhase; return; }
    const step = Math.floor(p.walkPhase / Math.PI);
    if (step === Math.floor(this.stepPhase / Math.PI)) return;
    this.stepPhase = p.walkPhase;
    if (p.velocity.lengthSq() < 0.5) return;
    const region = this.ctx.world.regionAt(p.position.x, p.position.z).id;
    this.play(STEP[region] ?? 'step_grass', null, { gain: p.velocity.length() > p.stats.moveSpeed * 1.2 ? 1.3 : 1 });
  }

  // 환경음: 밤엔 벌레, 낮엔 지역(새·숲·바람). 타이틀·일시정지·엔딩엔 끈다. 바뀌면 천천히 엇갈려 바꾼다
  ambience(dt) {
    const a = this.amb;
    const st = this.ctx.state;
    let want = null;
    if (st === 'play') {
      const p = this.ctx.player.position;
      const region = this.ctx.world.regionAt(p.x, p.z).id;
      want = this.ctx.time?.isNight ? 'amb_night' : AMB[region] ?? 'amb_birds';
      if (!this.buffers[want]) want = null;
    }
    if (want !== a.key) {
      if (a.cur) this.fadeOut(a.cur, this.cfg.ambience.fade);
      a.key = want;
      a.cur = want ? this.ambStart(want, this.cfg.ambience.fade) : null;
      return;
    }
    // 끝나기 전에 다음 판을 겹쳐 시작 (끊김 없이 반복)
    if (a.cur && this.synth.now >= a.cur.endAt - this.cfg.ambience.overlap) {
      this.fadeOut(a.cur, this.cfg.ambience.overlap);
      a.cur = this.ambStart(a.key, this.cfg.ambience.overlap);
    }
  }

  ambStart(key, fade) {
    const ac = this.synth.ctx;
    const buf = this.buffers[key][0];
    const src = ac.createBufferSource();
    src.buffer = buf;
    const g = ac.createGain();
    const vol = this.ambGain(key);
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + fade);
    src.connect(g).connect(this.synth.sfxBus);
    src.start();
    return { src, g, endAt: ac.currentTime + buf.duration };
  }

  ambGain(key) {
    return this.cfg.ambience.gain * (this.sam[key]?.gain ?? 1) * this.ambVolume;
  }

  fadeOut(cur, fade) {
    const t = this.synth.now;
    cur.g.gain.cancelScheduledValues(t);
    cur.g.gain.setValueAtTime(cur.g.gain.value, t);
    cur.g.gain.linearRampToValueAtTime(0, t + fade);
    cur.src.stop(t + fade + 0.05);
  }
}
