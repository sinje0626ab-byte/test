import * as THREE from 'three';

const ICON_COLORS = { poison: 0x7cd67a, slow: 0x8fd0ff };

// 상태 이상: 독(초당 피해), 감속(이동 속도 배율). 같은 상태는 시간만 새로 (Phase 9: 몬스터)
export class StatusSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.status;
    this.list = []; // { target, type, time, amount, icon, tick }
    ctx.bus.on('status:apply', (e) => this.apply(e));
  }

  apply({ target, type, duration, amount }) {
    if (!target.alive) return;
    let st = this.list.find((x) => x.target === target && x.type === type);
    if (!st) {
      const icon = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), new THREE.MeshBasicMaterial({ color: ICON_COLORS[type] }));
      target.mesh.add(icon);
      st = { target, type, icon, tick: 1 };
      this.list.push(st);
    }
    st.time = duration;
    st.amount = amount ?? (type === 'poison' ? this.cfg.poisonDps : this.cfg.slowDefault);
    this.layout(target);
  }

  // 머리 위 아이콘을 나란히
  layout(target) {
    const mine = this.list.filter((x) => x.target === target);
    mine.forEach((st, i) => st.icon.position.set((i - (mine.length - 1) / 2) * 0.32, target.radius * 2 + 0.7, 0));
  }

  remove(st) {
    st.target.mesh.remove(st.icon);
    if (st.type === 'slow') st.target.speedMult = 1;
    this.list = this.list.filter((x) => x !== st);
    this.layout(st.target);
  }

  update(dt) {
    for (const st of [...this.list]) {
      const t = st.target;
      st.time -= dt;
      if (!t.alive || st.time <= 0) { this.remove(st); continue; }
      st.icon.rotation.y += dt * 3;
      if (st.type === 'slow') t.speedMult = 1 - st.amount;
      if (st.type === 'poison') {
        st.tick -= dt;
        if (st.tick <= 0) {
          st.tick = 1;
          this.ctx.bus.emit('status:damage', { monster: t, amount: Math.round(st.amount) });
        }
      }
    }
  }
}
