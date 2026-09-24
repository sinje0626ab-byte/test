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
    // 동물 주민은 조금 더 가까이 가야 한다
    for (const n of this.ctx.npcs ?? []) {
      const d = player.position.distanceTo(n.position) - n.radius;
      if (d < this.ctx.data.npcs.config.interactRange && d < bestD) { bestD = d; best = n; }
    }
    return best;
  }

  hint(s) {
    if (!s) return '';
    if (s.kind === 'npc') return `E  ${s.def.name}와(과) 이야기`;
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
    else if (s.kind === 'turret') this.ctx.bus.emit('interact:turret', { turret: s });
    else if (s.kind === 'facility') { if (s.alive) this.ctx.bus.emit('interact:facility', { facility: s }); }
    else this.ctx.bus.emit('interact:base', { base: s.base });
  }
}
