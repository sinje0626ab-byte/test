import * as THREE from 'three';
import { createDecorModel, animateDecor } from '../entities/decorModels.js';
import { josa } from '../utils/josa.js';

// 기지 꾸미기 소품 (data/decor.json). 건설 창 「꾸미기」 탭에서 골드로 사서 기지 영역 안에 마우스로 놓는다.
// 놓은 소품 앞에서 E → 옮기기(건설 모드로 다시 집는다, 그 자리에서 치우기 = 값의 refund 만큼 돌려받음).
// 몬스터는 소품을 노리지 않는다. solid 소품만 플레이어를 막는다(World.resolveStructures).
// ctx.decor = [{ kind: 'decor', type, def, baseId, position, rot, radius, mesh, anim }]. 저장 decor: [{ type, baseId, x, z, rot }]
export class DecorSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.list = [];
    ctx.decor = this.list;
    const { bus } = ctx;
    bus.on('build:place', (e) => {
      if (e.kind !== 'decor') return;
      if (e.move) this.move(e.move, e.position, e.rot);
      else {
        this.add(e.type, e.baseId, e.position, e.rot);
        bus.emit('decor:placed', { type: e.type });
      }
    });
    bus.on('decor:remove', ({ decor }) => this.remove(decor, true));
    bus.on('interact:decor', ({ decor }) => bus.emit('build:start', { kind: 'decor', type: decor.type, move: decor }));
    bus.on('save:collect', (save) => {
      save.decor = this.list.map((d) => ({ type: d.type, baseId: d.baseId, x: +d.position.x.toFixed(2), z: +d.position.z.toFixed(2), rot: +d.rot.toFixed(3) }));
    });
    bus.on('save:apply', (save) => {
      for (const d of [...this.list]) this.remove(d, false);
      for (const d of save.decor ?? []) if (ctx.data.decor.decor[d.type]) this.add(d.type, d.baseId, new THREE.Vector3(d.x, 0, d.z), d.rot ?? 0);
    });
    bus.on('game:new', () => { for (const d of [...this.list]) this.remove(d, false); });
  }

  countIn(baseId) {
    return this.list.filter((d) => d.baseId === baseId).length;
  }

  add(type, baseId, position, rot = 0) {
    const def = this.ctx.data.decor.decor[type];
    const { group, anim } = createDecorModel(type);
    group.position.copy(position).setY(0);
    group.rotation.y = rot;
    this.ctx.scene.add(group);
    const d = { kind: 'decor', type, def, baseId, position: group.position, rot, radius: def.radius, solid: !!def.solid, mesh: group, anim };
    this.list.push(d);
    this.ctx.bus.emit('decor:changed', {});
    return d;
  }

  move(d, position, rot) {
    if (!this.list.includes(d)) return;
    d.position.copy(position).setY(0);
    d.rot = rot ?? d.rot;
    d.mesh.rotation.y = d.rot;
    this.ctx.bus.emit('decor:changed', {});
  }

  remove(d, refund) {
    const i = this.list.indexOf(d);
    if (i < 0) return;
    this.list.splice(i, 1);
    this.ctx.scene.remove(d.mesh);
    if (refund) {
      const gold = Math.floor(d.def.cost * this.ctx.data.decor.config.refund);
      if (gold) this.ctx.bus.emit('economy:reward', { amount: gold });
      this.ctx.bus.emit('notify', { text: `${josa(d.def.name, '을/를')} 치웠어요${gold ? ` (골드 +${gold})` : ''}`, kind: 'gold' });
    }
    this.ctx.bus.emit('decor:changed', {});
  }

  update(dt) {
    const p = this.ctx.player.position;
    for (const d of this.list) {
      const near = Math.abs(d.position.x - p.x) < 60 && Math.abs(d.position.z - p.z) < 60;
      d.mesh.visible = near;
      if (near && d.anim) animateDecor(d.anim, dt);
    }
  }
}
