import * as THREE from 'three';
import { PAINTED } from '../ui/painted.js';

const ICON_COLORS = { poison: 0x7cd67a, slow: 0x8fd0ff, freeze: 0xd6f4ff };
const ICE = new THREE.IcosahedronGeometry(1, 1);
// 머리 위 상태 아이콘: 그린 그림(art/ui/status_*)이 있으면 늘 화면을 보는 스프라이트, 없으면 색 팔면체
const TEX = {};
const loader = new THREE.TextureLoader();
function iconFor(type) {
  const url = PAINTED.ui[`status_${type}`];
  if (!url) return new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), new THREE.MeshBasicMaterial({ color: ICON_COLORS[type] }));
  TEX[type] ??= Object.assign(loader.load(url), { colorSpace: THREE.SRGBColorSpace });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX[type], transparent: true, depthWrite: false }));
  s.scale.setScalar(0.42);
  s.userData.sprite = true;
  return s;
}

// 상태 이상: 독(초당 피해), 감속(이동 속도 배율), 빙결(이동·공격 정지). 같은 상태는 시간만 새로.
// 몬스터(Phase 9)와 플레이어(Phase 10). 플레이어는 독 저항·감속 면역을 따진다.
// - 독침 포탑 독(maxStacks 있음): 출처별 세기(포탑 피해 × 0.8)를 최대 3중첩, 중첩마다 지속시간 새로.
//   플레이어 무기 독은 예전처럼 poisonDps (세기만 더 센 쪽)
// - 보스는 감속 절반, 빙결 면역. 빙결은 하늘색 얼음 껍질
export class StatusSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.status;
    this.list = []; // { target, type, time, amount, icon, tick }
    ctx.bus.on('status:apply', (e) => this.apply(e));
    ctx.statusOf = (target) => this.list.filter((x) => x.target === target); // HUD 상태 줄
  }

  apply({ target, type, duration, amount, maxStacks, freeze }) {
    if (!target.alive) return;
    const boss = target.boss || target.raidBoss;
    if (type === 'slow' && boss) amount = (amount ?? this.cfg.slowDefault) * 0.5;
    if (type === 'freeze' && boss) return;
    // 서리 Lv5: 일정 확률로 빙결 (감속과 함께)
    if (freeze && !boss && Math.random() < freeze.chance) this.apply({ target, type: 'freeze', duration: freeze.duration });
    if (target === this.ctx.player) {
      const s = target.stats;
      if (type === 'slow' && s.slowImmune) return;
      if (type === 'poison') {
        const keep = 1 - Math.min(1, s.poisonResist ?? 0);
        if (keep <= 0) return;
        duration *= keep;
        amount = (amount ?? this.cfg.playerPoisonDps) * keep;
      }
    }
    let st = this.list.find((x) => x.target === target && x.type === type);
    if (!st) {
      const icon = iconFor(type);
      target.mesh.add(icon);
      st = { target, type, icon, tick: 1 };
      this.list.push(st);
    }
    st.time = duration;
    if (type === 'poison' && maxStacks) {
      // 출처별 세기를 쌓는다 (오래된 것부터 밀려남)
      st.stacks = [...(st.stacks ?? []), amount].slice(-maxStacks);
      st.amount = Math.max(st.base ?? 0, st.stacks.reduce((a, b) => a + b, 0));
    } else if (type === 'poison') {
      st.base = amount ?? this.cfg.poisonDps;
      st.amount = Math.max(st.base, (st.stacks ?? []).reduce((a, b) => a + b, 0));
    } else {
      st.amount = amount ?? (type === 'poison' ? this.cfg.poisonDps : this.cfg.slowDefault);
    }
    if (type === 'freeze') {
      target.frozen = duration;
      if (!st.shell) {
        st.shell = new THREE.Mesh(ICE, new THREE.MeshStandardMaterial({ color: '#cfefff', transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.1, flatShading: true, emissive: '#5aa8d8', emissiveIntensity: 0.25, depthWrite: false }));
        st.shell.scale.set(target.radius * 1.35, target.radius * 1.6, target.radius * 1.35);
        st.shell.position.y = target.radius * 1.1;
        target.mesh.add(st.shell);
      }
    }
    this.layout(target);
  }

  // 머리 위 아이콘을 나란히
  layout(target) {
    const mine = this.list.filter((x) => x.target === target);
    const y = target === this.ctx.player ? this.cfg.playerIconHeight : target.radius * 2 + 0.7;
    mine.forEach((st, i) => st.icon.position.set((i - (mine.length - 1) / 2) * 0.42, y, 0));
  }

  remove(st) {
    st.target.mesh.remove(st.icon);
    if (st.type === 'slow') st.target.speedMult = 1;
    if (st.type === 'freeze') {
      st.target.frozen = 0;
      if (st.shell) { st.target.mesh.remove(st.shell); st.shell.material.dispose(); }
    }
    this.list = this.list.filter((x) => x !== st);
    this.layout(st.target);
  }

  update(dt) {
    for (const st of [...this.list]) {
      const t = st.target;
      st.time -= dt;
      if (!t.alive || st.time <= 0) { this.remove(st); continue; }
      if (!st.icon.userData.sprite) st.icon.rotation.y += dt * 3;
      if (st.type === 'slow') t.speedMult = 1 - st.amount;
      if (st.type === 'poison') {
        st.tick -= dt;
        if (st.tick <= 0) {
          st.tick = 1;
          this.ctx.bus.emit('status:damage', { target: t, amount: Math.max(1, Math.round(st.amount)) });
        }
      }
    }
  }
}
