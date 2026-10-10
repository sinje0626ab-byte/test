import * as THREE from 'three';
import { baseAt } from '../utils/bases.js';
import { josa } from '../utils/josa.js';

// 기지 안 나무·바위 치우기 (config.clear): 기지 영역 안 장식 나무·바위·선인장·통나무와 채집 노드 앞에서 E →
// 한 번 더 E(confirmTime 초 안)면 cost 골드를 내고 영영 사라진다. 꾸미기 자리를 넓히려고.
// 후보는 InteractionSystem 이 obstacles() 로 묻는다. 저장 clears: ["x,z", ...] (장식 충돌체 자리, 시드 고정이라 다시 찾을 수 있다)
// 채집 노드는 GatherSystem 저장(gather.removed)에 남는다
export class ClearSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.clear;
    this.cleared = []; // "x,z"
    this.pending = null;
    ctx.obstaclesNear = (pos, range) => this.obstacles(pos, range);
    const { bus } = ctx;
    bus.on('interact:obstacle', ({ obstacle }) => this.ask(obstacle));
    bus.on('save:collect', (save) => { save.clears = [...this.cleared]; });
    bus.on('save:apply', (save) => {
      this.cleared = [];
      for (const key of save.clears ?? []) {
        const [x, z] = key.split(',').map(Number);
        const c = [...ctx.world.nearby(x, z, 0.5)].find((k) => k.info?.ref && Math.abs(k.x - x) < 0.02 && Math.abs(k.z - z) < 0.02);
        if (c) this.removeWorld(c);
      }
    });
  }

  // pos 둘레 range 안, 기지 영역 안에 있는 치울 수 있는 것들 [{ kind: 'obstacle', label, position, radius, ... }]
  obstacles(pos, range) {
    const { world, bases } = this.ctx;
    if (!bases.length) return [];
    const out = [];
    for (const c of world.nearby(pos.x, pos.z, range)) {
      if (!c.info?.ref || !baseAt(bases, c)) continue;
      c.obstacle ??= { kind: 'obstacle', label: c.info.label, position: new THREE.Vector3(c.x, 0, c.z), radius: c.r, collider: c };
      out.push(c.obstacle);
    }
    for (const n of this.ctx.nodes ?? []) {
      if (n.removed || Math.abs(n.position.x - pos.x) > range + 2 || Math.abs(n.position.z - pos.z) > range + 2 || !baseAt(bases, n.position)) continue;
      n.obstacle ??= { kind: 'obstacle', label: n.def.name, position: n.position, radius: n.radius, node: n };
      out.push(n.obstacle);
    }
    return out;
  }

  // 첫 E: 안내, confirmTime 안에 같은 것에 또 E: 치우기
  ask(o) {
    const { bus, time } = this.ctx;
    const now = time.elapsed;
    if (this.pending?.o !== o || now - this.pending.t > this.cfg.confirmTime) {
      this.pending = { o, t: now };
      bus.emit('notify', { text: `한 번 더 E: ${josa(o.label, '을/를')} 골드 ${this.cfg.cost}로 치워요`, kind: 'info' });
      return;
    }
    this.pending = null;
    const spend = { amount: this.cfg.cost, ok: false };
    bus.emit('economy:spend', spend);
    if (!spend.ok) {
      bus.emit('notify', { text: `골드가 부족해요 (${this.cfg.cost} 필요)`, kind: 'warn' });
      return;
    }
    if (o.node) this.ctx.removeNode?.(o.node);
    else {
      this.removeWorld(o.collider);
      this.cleared.push(`${o.collider.x.toFixed(2)},${o.collider.z.toFixed(2)}`);
    }
    bus.emit('fx:ring', { position: o.position.clone(), color: '#c8a46b' });
    bus.emit('player:shock', { position: o.position.clone(), radius: 1.5 });
    bus.emit('notify', { text: `${josa(o.label, '을/를')} 치웠어요 (골드 -${this.cfg.cost})`, kind: 'gold' });
    bus.emit('obstacle:cleared', { position: o.position.clone() });
  }

  removeWorld(c) {
    this.ctx.world.removeDecor(c.info.ref, c);
  }
}
