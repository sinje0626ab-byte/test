import * as THREE from 'three';
import { toPlayer, wander, giveUp } from './common.js';

// 치고 빠지기: 빠르게 날아와 한 번 쏘고 멀리 빠진다 (반복)
export const darter = {
  think(m, dt) {
    const d = m.def;
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
        move.copy(v);
        speed = d.dartSpeed;
        if (dist <= d.attackRange + player.radius) {
          m.ctx.bus.emit('monster:attack', { monster: m, target: player });
          m.setState('retreat');
        }
        break;
      case 'retreat':
        move.copy(v).multiplyScalar(-1);
        move.x += Math.sin(m.stateTime * 3); // 지그재그로 빠진다
        speed = d.dartSpeed * 0.8;
        if (dist > d.retreatDistance || m.stateTime > 2) m.setState('hover');
        break;
      case 'hover':
        move.set(-v.z, 0, v.x); // 옆으로 맴돈다
        speed = d.moveSpeed;
        if (m.stateTime > 0.9) m.setState('chase');
        break;
    }
    return { move, speed };
  },
};
