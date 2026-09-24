import * as THREE from 'three';
import { Turret } from '../entities/Turret.js';
import { createFacilityModel } from '../entities/FacilityModels.js';
import { baseAt } from '../utils/bases.js';
import { turretCost, maxTurrets, materialCost } from '../utils/build.js';

const OK = 0x6fdc6f;
const BAD = 0xff6b6b;

// 건설 모드: 배치 미리보기(가능=초록, 불가=빨강), 좌클릭 설치, 우클릭/ESC 취소
export class BuildSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.build;
    this.placing = null;
    this.gold = 0;
    this.lastHint = '';
    this.counts = {};
    ctx.bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
    });
    ctx.mode = 'play';
    ctx.bus.on('gold:changed', ({ gold }) => { this.gold = gold; });
    ctx.bus.on('build:start', (e) => this.start(e));
    ctx.bus.on('player:died', () => this.end());
  }

  start({ kind, type, item }) {
    this.end();
    if (kind === 'wall') return; // 벽은 WallSystem (드래그로 한 줄)
    const ghost = kind === 'tent' ? this.tentGhost()
      : kind === 'facility' ? createFacilityModel(this.ctx.data.buildings.buildings[type].model).group
        : Turret.createMesh(this.ctx.data.turrets[type]).group;
    const mats = [];
    ghost.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = false;
      o.material = new THREE.MeshBasicMaterial({ color: OK, transparent: true, opacity: 0.45, depthWrite: false });
      mats.push(o.material);
    });
    this.ctx.scene.add(ghost);
    // 처음엔 플레이어 앞 몇 걸음 자리 (터치는 탭할 때까지 여기 머문다)
    const pl = this.ctx.player;
    const start = pl.position.clone().addScaledVector(pl.facing, kind === 'tent' ? 4 : 3);
    this.placing = { kind, type, item, ghost, mats, pos: this.snap(start), check: { ok: false } };
    ghost.position.copy(this.placing.pos);
    this.ctx.mode = 'build';
    this.ctx.input.consumeMouse();
  }

  snap(v) {
    const g = this.cfg.gridSnap;
    return new THREE.Vector3(Math.round(v.x / g) * g, 0, Math.round(v.z / g) * g);
  }

  tentGhost() {
    const def = this.ctx.data.buildings.baseLevels['1'];
    const g = new THREE.Group();
    const tent = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 4), new THREE.MeshBasicMaterial());
    tent.position.y = 1.1;
    tent.rotation.y = Math.PI / 4;
    const ring = new THREE.Mesh(new THREE.RingGeometry(def.areaRadius - 0.15, def.areaRadius, 96).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial());
    ring.position.y = 0.05;
    g.add(tent, ring);
    return g;
  }

  end() {
    if (!this.placing) return;
    this.ctx.scene.remove(this.placing.ghost);
    this.placing = null;
    this.ctx.mode = 'play';
    this.hint('');
  }

  hint(text, ok = true) {
    if (text === this.lastHint) return;
    this.lastHint = text;
    this.ctx.bus.emit('build:hint', { text, ok });
  }

  overlapsStructure(pos, radius) {
    for (const s of this.ctx.structures) {
      if (pos.distanceTo(s.position) < s.radius + radius + this.cfg.structureGap) return true;
    }
    return false;
  }

  validate(pos) {
    const { world, bases, data, structures, player } = this.ctx;
    const p = this.placing;
    if (p.kind === 'tent') {
      const def = data.buildings.baseLevels['1'];
      const minD = data.config.base.minBaseDistance;
      if (!world.isInside(pos.x, pos.z, def.areaRadius * 0.5)) return { ok: false, reason: '월드 가장자리와 너무 가깝습니다' };
      if (bases.some((b) => b.position.distanceTo(pos) < minD)) return { ok: false, reason: '다른 기지와 너무 가깝습니다' };
      if (world.isBlocked(pos.x, pos.z, def.radius)) return { ok: false, reason: '나무나 바위에 막혀 있습니다' };
      return { ok: true };
    }
    if (p.kind === 'facility') return this.validateFacility(pos);
    const def = data.turrets[p.type];
    const base = baseAt(bases, pos);
    if (!base) return { ok: false, reason: '기지 영역 안에만 지을 수 있습니다' };
    const count = structures.filter((s) => s.kind === 'turret' && s.baseId === base.id).length;
    const max = maxTurrets(base, player.stats);
    const cost = turretCost(def, player.stats);
    if (count >= max) return { ok: false, reason: `이 기지엔 포탑을 더 세울 수 없습니다 (${count}/${max})` };
    if (this.gold < cost) return { ok: false, reason: `골드가 부족합니다 (${cost} 필요)` };
    if (!(def.buildItems ?? []).every((c) => (this.counts[c.id] ?? 0) >= c.count)) return { ok: false, reason: '재료가 부족합니다' };
    if (world.isBlocked(pos.x, pos.z, def.radius) || this.overlapsStructure(pos, def.radius)) return { ok: false, reason: '자리가 막혀 있습니다' };
    if (pos.distanceTo(player.position) < def.radius + player.radius) return { ok: false, reason: '자리가 막혀 있습니다' };
    return { ok: true, base };
  }

  validateFacility(pos) {
    const { world, bases, data, structures, player } = this.ctx;
    const def = data.buildings.buildings[this.placing.type];
    const base = baseAt(bases, pos);
    if (!base) return { ok: false, reason: '기지 영역 안에만 지을 수 있습니다' };
    if (base.level < def.unlockBaseLevel) return { ok: false, reason: `기지 Lv${def.unlockBaseLevel}부터 지을 수 있습니다` };
    if (def.unlock && !this.ctx.unlocks?.has(def.unlock)) return { ok: false, reason: '설계도가 필요합니다 (부엉 박사 퀘스트)' };
    if (structures.some((s) => s.kind === 'facility' && s.type === this.placing.type && s.baseId === base.id)) return { ok: false, reason: `이 기지엔 이미 ${def.name}이(가) 있습니다` };
    if (!materialCost(def.cost, player.stats).every((c) => (this.counts[c.id] ?? 0) >= c.count)) return { ok: false, reason: '재료가 부족합니다' };
    if (world.isBlocked(pos.x, pos.z, def.radius) || this.overlapsStructure(pos, def.radius)) return { ok: false, reason: '자리가 막혀 있습니다' };
    if (pos.distanceTo(player.position) < def.radius + player.radius) return { ok: false, reason: '자리가 막혀 있습니다' };
    return { ok: true, base };
  }

  update() {
    const p = this.placing;
    if (!p) return;
    const { input, mouseGround, bus } = this.ctx;

    if (input.rightPressed || input.wasPressed('Escape') || input.wasPressed('BuildCancel')) {
      this.end();
      return;
    }
    const follow = input.touchMode ? input.leftPressed : true;
    if (mouseGround && follow) {
      p.pos.copy(this.snap(mouseGround));
      p.ghost.position.copy(p.pos);
    }
    p.check = this.validate(p.pos);
    for (const m of p.mats) m.color.setHex(p.check.ok ? OK : BAD);
    const okText = input.touchMode ? '화면을 탭해 자리를 고르고 "설치"를 누르세요' : '좌클릭: 설치 · 우클릭/ESC: 취소';
    this.hint(p.check.ok ? okText : p.check.reason, p.check.ok);

    // 마우스는 클릭으로 바로 설치, 터치는 탭으로 자리만 옮기고 "설치" 버튼으로 정한다.
    const confirm = input.touchMode ? input.wasPressed('BuildConfirm') : input.leftPressed;
    if (!confirm) return;
    if (!p.check.ok) {
      bus.emit('notify', { text: p.check.reason, kind: 'warn' });
      return;
    }
    if (p.kind === 'turret') {
      const def = this.ctx.data.turrets[p.type];
      // 독침·서리 포탑은 골드 + 재료
      if (def.buildItems) {
        const items = { items: def.buildItems, ok: false };
        bus.emit('inventory:spend', items);
        if (!items.ok) return;
      }
      const spend = { amount: turretCost(def, this.ctx.player.stats), ok: false };
      bus.emit('economy:spend', spend);
      if (!spend.ok) {
        for (const c of def.buildItems ?? []) bus.emit('inventory:add', { item: c.id, count: c.count, taken: 0 });
        return;
      }
    }
    if (p.kind === 'facility') {
      const spend = { items: materialCost(this.ctx.data.buildings.buildings[p.type].cost, this.ctx.player.stats), ok: false };
      bus.emit('inventory:spend', spend);
      if (!spend.ok) return;
    }
    const placed = { kind: p.kind, type: p.type, item: p.item, position: p.pos.clone(), baseId: p.check.base?.id };
    input.consumeMouse();
    this.end();
    bus.emit('build:place', placed);
  }
}
