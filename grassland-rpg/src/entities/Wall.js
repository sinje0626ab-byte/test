import * as THREE from 'three';
import { HpBar } from './HpBar.js';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9 });

// 성벽 한 칸(1m): 나무 울타리 / 돌담. 기지 둘레 원의 한 자리(slot, utils/wallRing.js)에 원을 따라 돌려 놓는다.
// 몬스터 충돌·길찾기는 그 자리의 격자 칸들(cells). 부서지면 사라진다 (WallSystem). 몬스터만 막는다.
// slot 없이 (cx, cz) 만 주면 예전처럼 그 격자 한 칸 (가이드 그림용)
export class Wall {
  constructor(ctx, type, baseId, cx, cz, hp, slot = null) {
    this.ctx = ctx;
    this.kind = 'wall';
    this.type = type;
    this.def = ctx.data.buildings.walls[type];
    this.baseId = baseId;
    this.slot = slot?.k ?? null;
    this.cells = slot ? slot.cells : [[cx, cz]];
    [this.cx, this.cz] = this.cells[0] ?? [cx, cz];
    this.position = slot ? new THREE.Vector3(slot.x, 0, slot.z) : new THREE.Vector3(cx + 0.5, 0, cz + 0.5);
    this.rot = slot?.rot ?? 0;
    this.radius = 0.5;
    this.stats = { maxHp: this.def.hp, hp: Math.min(this.def.hp, hp ?? this.def.hp) };
    this.alive = true;
    this.flash = 0;
    this.hpTimer = 0;
    this.build();
  }

  build() {
    const g = new THREE.Group();
    this.mats = [];
    const box = (w, h, d, color, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), flat(color));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      this.mats.push(m.material);
      return m;
    };
    if (this.def.model === 'stone') {
      box(1, 0.55, 0.8, '#a9a49c', 0, 0.28, 0);
      box(0.55, 0.45, 0.7, '#bdb8af', -0.2, 0.75, 0);
      box(0.45, 0.4, 0.7, '#8f8a82', 0.28, 0.73, 0.02);
    } else {
      for (const x of [-0.38, 0.38]) {
        const post = box(0.16, 1.1, 0.16, '#8a6440', x, 0.55, 0);
        post.rotation.y = 0.2;
      }
      for (const y of [0.4, 0.8]) box(1, 0.12, 0.08, this.def.color, 0, y, 0);
    }
    this.hpBar = new HpBar(0.8, 0x7cc67a);
    this.hpBar.group.position.y = 1.5;
    g.add(this.hpBar.group);
    g.position.copy(this.position);
    g.rotation.y = this.rot;
    this.mesh = g;
    this.ctx.scene.add(g);
  }

  // 이웃 벽 쪽을 보도록 (가로줄이면 그대로, 세로줄이면 90도)
  orient(vertical) {
    this.mesh.rotation.y = vertical ? Math.PI / 2 : 0;
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.stats.hp = Math.max(0, this.stats.hp - amount);
    this.flash = 0.12;
    this.hpTimer = 4;
    if (this.stats.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  repairFull() {
    this.stats.hp = this.stats.maxHp;
  }

  update(dt) {
    this.flash = Math.max(0, this.flash - dt);
    this.hpTimer = Math.max(0, this.hpTimer - dt);
    const e = this.flash > 0 ? 0.6 : 0;
    for (const m of this.mats) m.emissive.setRGB(e, e * 0.3, e * 0.3);
    const s = this.stats;
    this.hpBar.update(s.hp / s.maxHp, this.ctx.camera, this.hpTimer > 0);
  }

  dispose() {
    this.ctx.scene.remove(this.mesh);
    this.mesh.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  }
}
