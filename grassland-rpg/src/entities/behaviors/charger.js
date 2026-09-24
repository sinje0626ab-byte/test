import * as THREE from 'three';
import { toPlayer, wander, giveUp, markLine } from './common.js';

// 돌진: 멈춰서 예고선 → 일직선으로 돌진 → 나무·바위에 박으면 기절
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
        if (m.ctx.world.isBlocked(nx, nz, 0.1)) { m.setState('stun'); m.ctx.bus.emit('monster:stunned', { monster: m }); break; }
        m.position.addScaledVector(bs.dir, step);
        bs.traveled += step;
        if (!bs.hit && player.alive && m.position.distanceTo(player.position) < m.radius + player.radius + 0.2) {
          bs.hit = true;
          m.ctx.bus.emit('monster:charge-hit', { monster: m, dir: bs.dir.clone() });
        }
        if (bs.traveled >= d.chargeDistance) { m.cooldown = d.chargeCooldown; m.setState('chase'); }
        break;
      }
      case 'stun':
        if (m.stateTime >= d.stunTime) { m.cooldown = d.chargeCooldown * 0.5; m.setState('chase'); }
        break;
    }
    return { move, speed };
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
