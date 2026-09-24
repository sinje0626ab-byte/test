import * as THREE from 'three';

// 묘비: 쓰러진 자리에 남고, 잃은 골드의 절반(config.tombstone.ratio)이 들어 있다. E로 되찾는다.
// 다시 쓰러지면 예전 묘비는 사라진다. ctx.tomb (하나뿐)
export class TombstoneSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.tombstone;
    this.mesh = null;
    const { bus } = ctx;
    bus.on('economy:death-loss', ({ amount, position }) => {
      this.remove();
      const gold = Math.floor(amount * this.cfg.ratio);
      if (gold > 0) this.place(position.x, position.z, gold);
    });
    bus.on('interact:tomb', () => this.recover());
    bus.on('save:collect', (save) => { save.tomb = ctx.tomb ? { x: ctx.tomb.position.x, z: ctx.tomb.position.z, gold: ctx.tomb.gold } : null; });
    bus.on('save:apply', (save) => { this.remove(); if (save.tomb) this.place(save.tomb.x, save.tomb.z, save.tomb.gold); });
    bus.on('game:new', () => this.remove());
  }

  place(x, z, gold) {
    const g = new THREE.Group();
    const stone = new THREE.MeshStandardMaterial({ color: 0x9a958c, flatShading: true });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.2), stone);
    slab.position.y = 0.45;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 10, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2), stone);
    top.position.y = 0.9;
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 10).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffcf5c, emissive: 0x6b5010 }));
    coin.position.set(0, 0.55, 0.12);
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.08, 5, 4), new THREE.MeshStandardMaterial({ color: 0xff8fab }));
    flower.position.set(0.3, 0.08, 0.3);
    for (const m of [slab, top]) m.castShadow = true;
    g.add(slab, top, coin, flower);
    g.position.set(x, 0, z);
    this.ctx.scene.add(g);
    this.mesh = g;
    this.ctx.tomb = { kind: 'tomb', position: g.position, radius: 0.5, gold };
  }

  recover() {
    const t = this.ctx.tomb;
    if (!t) return;
    this.ctx.bus.emit('economy:reward', { amount: t.gold });
    this.ctx.bus.emit('notify', { text: `묘비에서 골드 ${t.gold}을(를) 되찾았어요!`, kind: 'gold' });
    this.remove();
  }

  remove() {
    if (this.mesh) this.ctx.scene.remove(this.mesh);
    this.mesh = null;
    this.ctx.tomb = null;
  }
}
