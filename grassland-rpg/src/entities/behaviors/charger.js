import * as THREE from 'three';
import { toPlayer, wander, giveUp, markLine } from './common.js';

// 돌진: 멈춰서 예고선 → 일직선으로 돌진 → 나무·바위에 박으면 기절
// 맞으면 플레이어가 크게 밀려난다 (combat.chargeKnockback). 돌진 중에 맞히거나 부딪히는 순간 그쪽으로
// 휘둘렀으면 '반격' → 적이 combat.counterStun 초 기절하고 플레이어는 맞지 않는다
export const charger = {
  init(m) {
    const d = m.def;
    m.bs.line = markLine(d.chargeDistance, m.radius * 1.6);
    m.mesh.add(m.bs.line);
    m.bs.dir = new THREE.Vector3();
  },

  think(m, dt) {
    const d = m.def;
    const bs = m.bs;
    const { v, dist, player, sees } = toPlayer(m);
    const move = new THREE.Vector3();
    let speed = 0;
    m.attackTarget = player;

    switch (m.state) {
      case 'wander':
        if (sees) { m.setState('chase'); break; }
        speed = wander(m, dt, move);
        break;
      case 'chase':
        if (!player.alive || dist > d.loseRange) { giveUp(m); break; }
        if (dist < d.chargeDistance * 0.9 && m.cooldown <= 0) {
          bs.dir.copy(v).normalize();
          m.facing.copy(bs.dir);
          bs.line.rotation.y = Math.atan2(bs.dir.x, bs.dir.z);
          bs.line.visible = true;
          m.setState('aim');
          break;
        }
        move.copy(v);
        speed = d.chaseSpeed;
        break;
      case 'aim':
        bs.line.material.opacity = 0.15 + 0.35 * Math.min(1, m.stateTime / d.chargeWindup);
        if (m.stateTime >= d.chargeWindup) {
          bs.line.visible = false;
          bs.traveled = 0;
          bs.hit = false;
          m.setState('charge');
        }
        break;
      case 'charge': {
        const step = d.chargeSpeed * dt;
        const nx = m.position.x + bs.dir.x * (step + m.radius);
        const nz = m.position.z + bs.dir.z * (step + m.radius);
        if (m.ctx.world.isBlocked(nx, nz, 0.1)) { stun(m, d.stunTime); m.ctx.bus.emit('monster:stunned', { monster: m }); break; }
        m.position.addScaledVector(bs.dir, step);
        bs.traveled += step;
        if (!bs.hit && player.alive && m.position.distanceTo(player.position) < m.radius + player.radius + 0.2) {
          bs.hit = true;
          if (parrying(m, player)) { charger.countered(m); break; }
          m.ctx.bus.emit('monster:charge-hit', { monster: m, dir: bs.dir.clone() });
          // 부딪히면 그 자리에서 멈춘다 (몸을 뚫고 지나가지 않게)
          m.cooldown = d.chargeCooldown;
          m.setState('chase');
          break;
        }
        if (bs.traveled >= d.chargeDistance) { m.cooldown = d.chargeCooldown; m.setState('chase'); }
        break;
      }
      case 'stun':
        if (m.stateTime >= (bs.stunFor ?? d.stunTime)) { m.cooldown = d.chargeCooldown * 0.5; m.setState('chase'); }
        break;
    }
    return { move, speed };
  },

  // 플레이어 공격이 지금 맞으면 반격인지 (CombatSystem.playerHits)
  counterable(m) {
    return m.alive && m.state === 'charge';
  },

  countered(m) {
    if (m.alive) {
      m.bs.line.visible = false;
      stun(m, m.ctx.data.config.combat.counterStun);
    }
    m.ctx.bus.emit('monster:countered', { monster: m });
  },

  // 포탑 예측 사격: t 초 뒤 자리. 예고 중이면 남은 예고 시간 뒤 돌진 방향·속도로, 돌진 중이면 남은 거리까지
  predict(m, t, out) {
    const d = m.def;
    const bs = m.bs;
    if (m.state === 'aim') {
      const go = Math.max(0, t - Math.max(0, d.chargeWindup - m.stateTime));
      return out.copy(m.position).addScaledVector(bs.dir, Math.min(d.chargeDistance, go * d.chargeSpeed));
    }
    if (m.state === 'charge') {
      return out.copy(m.position).addScaledVector(bs.dir, Math.min(d.chargeDistance - bs.traveled, t * d.chargeSpeed));
    }
    if (m.state === 'stun') return out.copy(m.position);
    return null; // 그 밖엔 실제 속도로
  },

  animate(m, dt) {
    if (m.state === 'aim') {
      m.body.scale.set(1.1, 0.8, 1.1); // 몸을 낮춰 힘 모으기
      return true;
    }
    if (m.state === 'stun') {
      m.body.rotation.z = Math.sin(m.stateTime * 18) * 0.25;
      return true;
    }
    m.body.rotation.z = 0;
    return false;
  },
};

function stun(m, t) {
  m.bs.stunFor = t;
  m.setState('stun');
}

// 부딪히기 직전(combat.parryWindow 초 안, 돌진이 시작된 뒤)에 그쪽으로 휘둘렀으면 막아 낸다 (근접 무기만)
function parrying(m, player) {
  const a = player.attack;
  const win = Math.min(m.ctx.data.config.combat.parryWindow, m.stateTime);
  if (a.type === 'bow' || a.since > win) return false;
  const dx = m.position.x - player.position.x;
  const dz = m.position.z - player.position.z;
  const len = Math.hypot(dx, dz) || 1;
  return (a.dir.x * dx + a.dir.z * dz) / len >= m.ctx.data.config.combat.parryArcDot;
}
