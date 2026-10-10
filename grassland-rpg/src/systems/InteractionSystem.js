import { josa } from '../utils/josa.js';
// E 상호작용: 가장 가까운 포탑·기지 건물을 찾아 안내하고, E를 누르면 알린다.
export class InteractionSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.interact;
    this.target = null;
  }

  find() {
    const { player, structures, mode } = this.ctx;
    if (!player.alive || mode !== 'play') return null;
    let best = null;
    let bestD = Infinity;
    for (const s of structures) {
      if (s.kind === 'wall') continue;
      const d = player.position.distanceTo(s.position) - s.radius;
      if (d < this.cfg.range && d < bestD) { bestD = d; best = s; }
    }
    // 꾸미기 소품 (기지 안, 다른 것보다 조금 더 가까이 가야 한다)
    for (const dc of this.ctx.decor ?? []) {
      const d = player.position.distanceTo(dc.position) - dc.radius + 0.3;
      if (d < this.cfg.range && d < bestD) { bestD = d; best = dc; }
    }
    // 기지 안 나무·바위 (치우기, 다른 것보다 한 발 더 가까이)
    for (const o of this.ctx.obstaclesNear?.(player.position, this.cfg.range + 1) ?? []) {
      const d = player.position.distanceTo(o.position) - o.radius + 0.5;
      if (d < this.cfg.range && d < bestD) { bestD = d; best = o; }
    }
    // 묘비
    const t = this.ctx.tomb;
    if (t) {
      const d = player.position.distanceTo(t.position) - t.radius;
      if (d < this.cfg.range && d < bestD) { bestD = d; best = t; }
    }
    // 보물상자 (열린 것은 빼고)
    for (const c of this.ctx.chests ?? []) {
      if (c.opened) continue;
      const d = player.position.distanceTo(c.position) - c.radius;
      if (d < this.cfg.range && d < bestD) { bestD = d; best = c; }
    }
    // 동물 주민은 조금 더 가까이 가야 한다
    for (const n of this.ctx.npcs ?? []) {
      const d = player.position.distanceTo(n.position) - n.radius;
      if (d < this.ctx.data.npcs.config.interactRange && d < bestD) { bestD = d; best = n; }
    }
    return best;
  }

  hint(s) {
    if (!s) return '';
    if (s.kind === 'npc') return `E  ${josa(s.def.name, '과/와')} 이야기`;
    if (s.kind === 'decor') return `E  ${s.def.name} 옮기기·치우기`;
    if (s.kind === 'obstacle') return `E  ${s.label} 치우기 (골드 ${this.ctx.data.config.clear.cost})`;
    if (s.kind === 'chest') return `E  ${this.ctx.data.config.chests.kinds[s.type].name} 열기`;
    if (s.kind === 'tomb') return `E  묘비에서 골드 ${s.gold} 되찾기`;
    if (s.kind === 'turret') return `E  ${s.def.name}${s.alive ? '' : ' (부서짐)'} 관리`;
    if (s.kind === 'facility') {
      const verb = s.def.verb;
      return s.alive ? `E  ${s.def.name} — ${verb}` : `${s.def.name} (부서짐 · 아침에 복구)`;
    }
    return `E  ${s.base.label} — 건설·업그레이드`;
  }

  update() {
    const s = this.find();
    if (s !== this.target) {
      this.target = s;
      this.ctx.bus.emit('interact:hint', { text: this.hint(s) });
    }
    if (!s || !this.ctx.input.wasPressed('KeyE')) return;
    if (s.kind === 'npc') this.ctx.bus.emit('interact:npc', { npc: s });
    else if (s.kind === 'tomb') this.ctx.bus.emit('interact:tomb', {});
    else if (s.kind === 'obstacle') { this.ctx.bus.emit('interact:obstacle', { obstacle: s }); this.target = null; }
    else if (s.kind === 'decor') { this.ctx.bus.emit('interact:decor', { decor: s }); this.target = null; }
    else if (s.kind === 'chest') { this.ctx.bus.emit('interact:chest', { chest: s }); this.target = null; }
    else if (s.kind === 'turret') this.ctx.bus.emit('interact:turret', { turret: s });
    else if (s.kind === 'facility') { if (s.alive) this.ctx.bus.emit('interact:facility', { facility: s }); }
    else this.ctx.bus.emit('interact:base', { base: s.base });
  }
}
