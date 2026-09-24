import * as THREE from 'three';
import { toPlayer, wander, giveUp } from './common.js';

// 원거리: 거리를 유지하며 투사체를 쏜다. 가까이 오면 뒷걸음.
export const ranged = {
  think(m, dt) {
    const d = m.def;
    const { v, dist, player, sees } = toPlayer(m);
    const move = new THREE.Vector3();
    let speed = 0;

    switch (m.state) {
      case 'wander':
        if (sees) { m.setState('chase'); break; }
        speed = wander(m, dt, move);
        break;
      case 'chase':
        if (!player.alive || dist > d.loseRange) { giveUp(m); break; }
        m.facing.copy(v).normalize();
        if (dist < d.keepDistance * 0.6) { move.copy(v).multiplyScalar(-1); speed = d.chaseSpeed; }
        else if (dist > d.keepDistance * 1.2) { move.copy(v); speed = d.chaseSpeed; }
        if (m.cooldown <= 0 && dist < d.keepDistance * 1.7) m.setState('shoot');
        break;
      case 'shoot':
        m.facing.copy(v).normalize();
        if (m.stateTime >= d.shotWindup) {
          m.ctx.bus.emit('monster:shoot', {
            monster: m, origin: m.position.clone().setY(m.def.flier ? 1.3 : 0.7), dir: v.clone().normalize(),
            speed: d.shotSpeed, damage: m.stats.attack, effect: d.shotEffect, kind: d.shotKind ?? 'spore',
          });
          m.cooldown = d.shotCooldown;
          m.setState('chase');
        }
        break;
    }
    return { move, speed };
  },

  animate(m) {
    if (m.state !== 'shoot') return false;
    const t = Math.min(1, m.stateTime / m.def.shotWindup);
    m.body.scale.setScalar(1 + t * 0.25); // 부풀었다가 쏜다
    return true;
  },
};
