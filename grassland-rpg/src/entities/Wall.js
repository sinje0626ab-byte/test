import * as THREE from 'three';
import { HpBar } from './HpBar.js';

import { baked, meshes } from './structureKit.js';

// 돌담: 이끼 낀 돌 벽돌 두 줄 + 위 갓돌 + 담쟁이 (재질 4개) (시안 concept_facilities.webp 오른쪽)
function stoneWall(k) {
  const rows = [[0, 0.3, 0.42], [0.3, 0.28, 0.36]];
  let n = 0;
  for (const [y, h, bw] of rows) {
    const off = n++ % 2 ? bw / 2 : 0;
    for (let x = -0.5 - off; x < 0.5; x += bw) {
      const x0 = Math.max(-0.5, x);
      const x1 = Math.min(0.5, x + bw);
      if (x1 - x0 < 0.08) continue;
      k.box((x1 - x0) * 0.95, h * 0.92, 0.62, (x0 * 7 + y * 3) % 2 > 1 ? 'stoneLight' : 'stone', [(x0 + x1) / 2, y + h / 2, 0]);
    }
  }
  k.box(1.0, 0.56, 0.56, 'mortar', [0, 0.28, 0]);
  k.box(0.5, 0.18, 0.66, 'stoneLight', [-0.24, 0.67, 0]);
  k.box(0.46, 0.16, 0.64, 'stone', [0.25, 0.66, 0.01]);
  k.ball(0.12, 'moss', [-0.2, 0.77, 0.05], [1.6, 0.35, 1.3]);
  // 담쟁이 (재질 수를 줄이려고 이끼색 하나로 — 벽은 수가 많다)
  for (const [x, y, z] of [[0.2, 0.52, 0.32], [0.28, 0.42, 0.33], [0.24, 0.32, 0.32], [-0.35, 0.45, -0.32], [-0.3, 0.36, -0.32]]) k.ball(0.075, 'moss', [x, y, z], [1, 1, 0.6]);
}

// 나무 울타리: 끝이 뾰족한 말뚝 + 가로대 둘 + 밧줄 묶음
function fenceWall(k) {
  for (let i = 0; i < 4; i++) {
    const x = -0.375 + i * 0.25;
    const h = 0.9 + (i % 2) * 0.12;
    k.box(0.17, h, 0.08, i % 2 ? 'wood' : 'woodLight', [x, h / 2, 0]);
    k.cone(0.12, 0.18, 4, i % 2 ? 'wood' : 'woodLight', [x, h + 0.09, 0], [0, Math.PI / 4, 0], [1, 1, 0.5]);
  }
  for (const y of [0.3, 0.68]) k.box(1.0, 0.09, 0.06, 'woodDark', [0, y, -0.07]);
  for (const x of [-0.5, 0.5]) for (const y of [0.3, 0.68]) k.add(new THREE.TorusGeometry(0.06, 0.02, 3, 8), 'rope', [x * 0.96, y, -0.07], [0, Math.PI / 2, 0]);
}

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
    const stone = this.def.model === 'stone';
    this.mats = meshes(baked(stone ? 'wall:stone' : 'wall:fence', stone ? stoneWall : fenceWall), g).parts.map((m) => m.material);
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
    this.mesh.traverse((o) => { if (o.isMesh) { if (!o.userData.shared) o.geometry.dispose(); o.material.dispose(); } }); // 모양은 같은 종류 벽끼리 같이 쓴다
  }
}
