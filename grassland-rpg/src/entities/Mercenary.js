import * as THREE from 'three';
import items from '../data/items.json';
import { createPlayerModel, applyAppearance, createWeaponMesh, fitArm } from './PlayerModel.js';

// 용병 한 명 (MercenarySystem 이 움직임을 정한다). 플레이어와 같은 모양에 직업별 옷·도구.
// 체력은 없다(쓰러지지 않는다). 몬스터도 노리지 않는다.
const I = items.items;
const LOOKS = {
  gatherer: { hair: '#7a4b2a', clothes: '#7cc67a', worn: { head: I.leaf_hat, feet: I.straw_shoes }, tool: 'short_bow' },
  warrior: { hair: '#2f2a28', clothes: '#c9584e', worn: { body: I.leather_vest, feet: I.leather_boots }, tool: 'iron_sword' },
  repairer: { hair: '#e0b25a', clothes: '#e9a35b', worn: { head: I.desert_hood, feet: I.leather_boots }, tool: 'stone_hammer' },
};

export class Mercenary {
  constructor(ctx, role, base) {
    this.ctx = ctx;
    this.role = role;
    this.base = base;
    this.kind = 'mercenary';
    this.radius = 0.4;
    this.position = base.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, 0, base.tent.radius + 1.5));
    this.target = null; // 걸어갈 자리 (Vector3)
    this.state = 'idle';
    this.carry = 0; // 채집가가 들고 있는 골드
    this.cooldown = 0;
    this.wait = Math.random() * 2;
    this.walkPhase = 0;
    this.swing = 0;
    const look = LOOKS[role];
    const m = createPlayerModel(ctx.data.player);
    applyAppearance(m, look.worn, { hair: look.hair, clothes: look.clothes, accessory: 'none' });
    const def = I[look.tool];
    m.swordPivot.remove(m.weapon);
    m.weapon = createWeaponMesh(def.weaponType, def.color, look.tool);
    m.swordPivot.add(m.weapon);
    fitArm(m, m.weapon);
    m.group.remove(m.trail, m.spinTrail);
    m.group.scale.setScalar(0.9);
    this.model = m;
    this.mesh = m.group;
    this.mesh.add(nameTag(ctx.data.config.mercenary.roles[role].name, look.clothes));
    this.mesh.position.copy(this.position);
    ctx.scene.add(this.mesh);
  }

  // 목표 자리로 걷는다. 다 왔으면 true
  walkTo(dest, dt, speed) {
    const d = new THREE.Vector3(dest.x - this.position.x, 0, dest.z - this.position.z);
    const len = d.length();
    if (len < 0.35) { this.moving = false; return true; }
    d.multiplyScalar(Math.min(len, speed * dt) / len);
    this.position.add(d);
    this.ctx.world.resolveCollision(this.position, this.radius);
    this.ctx.world.resolveStructures(this.position, this.radius);
    this.facing = Math.atan2(d.x, d.z);
    this.moving = true;
    return false;
  }

  // 도구 휘두르기 (공격·수리)
  strike() {
    this.swing = 0.35;
  }

  animate(dt) {
    const m = this.model;
    this.walkPhase += dt * (this.moving ? 11 : 0);
    m.inner.position.y = this.moving ? Math.abs(Math.sin(this.walkPhase)) * 0.07 : Math.sin(performance.now() / 600) * 0.01;
    m.footL.position.z = this.moving ? Math.sin(this.walkPhase) * 0.13 : 0;
    m.footR.position.z = this.moving ? -Math.sin(this.walkPhase) * 0.13 : 0;
    this.swing = Math.max(0, this.swing - dt);
    m.swordPivot.rotation.y = 0.9 - (this.swing > 0 ? Math.sin((1 - this.swing / 0.35) * Math.PI) * 1.6 : 0);
    if (this.facing !== undefined) {
      const cur = this.mesh.rotation.y;
      let diff = this.facing - cur;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.mesh.rotation.y = cur + diff * Math.min(1, dt * 10);
    }
    this.mesh.position.copy(this.position);
  }

  dispose() {
    this.ctx.scene.remove(this.mesh); // 모양 조각은 플레이어 모델과 같이 쓰므로 버리지 않는다
  }
}

// 머리 위 이름표 (직업 색 테두리). 종류별로 한 장만 만들어 같이 쓴다
const TAGS = new Map();
function nameTag(text, color) {
  if (!TAGS.has(text)) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 40;
    const g = c.getContext('2d');
    g.fillStyle = 'rgba(42, 31, 23, 0.82)';
    g.strokeStyle = color;
    g.lineWidth = 4;
    g.beginPath(); g.roundRect(4, 4, 120, 32, 14); g.fill(); g.stroke();
    g.fillStyle = '#f3e6c4';
    g.font = 'bold 20px sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 64, 21);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    TAGS.set(text, new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true }));
  }
  const s = new THREE.Sprite(TAGS.get(text));
  s.scale.set(1.1, 0.34, 1);
  s.position.y = 2.05;
  return s;
}
