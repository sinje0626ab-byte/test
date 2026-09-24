import * as THREE from 'three';
import { toPlayer, wander, giveUp } from './common.js';

// 기존 행동: 배회 → 추적 → 공격 → (체력 낮으면) 도주
export const melee = {
  flees: true, // 체력이 낮으면 도망친다
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
        if (dist <= d.attackRange + player.radius && m.cooldown <= 0) { m.setState('attack'); break; }
        move.copy(v);
        speed = dist > d.attackRange * 0.8 ? d.chaseSpeed : 0;
        break;
      case 'attack':
        m.attackStep('chase');
        break;
      case 'flee':
        move.copy(v).multiplyScalar(-1);
        speed = d.fleeSpeed;
        if (m.stateTime >= d.fleeDuration) giveUp(m);
        break;
    }
    return { move, speed };
  },
};
