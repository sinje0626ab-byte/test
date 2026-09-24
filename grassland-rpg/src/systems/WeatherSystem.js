import * as THREE from 'three';
import { Precipitation, Critters } from '../world/Ambient.js';
import { rand } from '../utils/random.js';

// 날씨: 하루 단위로 맑음 / 궂음을 정한다. 궂은 날은 지역마다 비(초원·숲)·모래바람(사막)·눈(설원).
// 설원은 궂은 날이 아니어도 snowChance로 눈. 연출(ctx.weatherFx)은 World가 읽는다. 나비·반딧불이도 여기서.
export class WeatherSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.weather;
    this.storm = false;
    this.snow = false;
    this.day = 0;
    this.type = null;
    this.time = 0;
    this.precip = new Precipitation(ctx.scene, Math.max(...Object.values(this.cfg.fx).map((f) => f.count)));
    this.critters = new Critters(ctx.scene, ctx.data.config.critters);
    const { bus } = ctx;
    bus.on('time:day', ({ day }) => this.roll(day));
    bus.on('game:new', () => this.roll(ctx.time.day, true));
    bus.on('save:collect', (save) => { save.weather = { day: this.day, storm: this.storm, snow: this.snow }; });
    bus.on('save:apply', (save) => {
      const w = save.weather;
      if (w) Object.assign(this, { day: w.day, storm: w.storm, snow: w.snow });
      else this.roll(ctx.time.day, true);
    });
  }

  roll(day, calm = false) {
    this.day = day;
    this.storm = !calm && rand.range(0, 1) < this.cfg.stormChance;
    this.snow = rand.range(0, 1) < this.cfg.snowChance;
    this.type = null; // 다음 update에서 다시 고른다
  }

  // 지금 플레이어 지역의 날씨
  current() {
    const region = this.ctx.world.regionAt(this.ctx.player.position.x, this.ctx.player.position.z);
    const kind = this.cfg.byRegion[region.id];
    if (kind === 'snow') return this.storm || this.snow ? 'snow' : null;
    return this.storm ? kind : null;
  }

  update(dt) {
    const { ctx } = this;
    this.time += dt;
    const center = ctx.player.position;
    const type = ctx.state === 'ending' ? null : this.current();
    if (type !== this.type) {
      this.type = type;
      const fx = type ? this.cfg.fx[type] : null;
      this.precip.set(type, fx, center, this.cfg.area);
      ctx.weather = type;
      ctx.weatherFx = fx ? { dim: fx.dim, fogFar: fx.fogFar, fogColor: fx.fogColor ? new THREE.Color(fx.fogColor) : null } : null;
      ctx.bus.emit('weather:changed', { type });
      if (type && ctx.state === 'play') ctx.bus.emit('notify', { text: this.cfg.names[type], kind: 'info' });
    }
    this.precip.update(dt, center, this.time);
    // 나비는 맑은 낮, 반딧불이는 밤 (초원·숲)
    const region = ctx.world.regionAt(center.x, center.z);
    const here = ctx.data.config.critters.regions.includes(region.id);
    const mode = !here || type ? null : ctx.time.isNight ? 'night' : 'day';
    this.critters.update(center, this.time, mode);
  }
}
