import * as THREE from 'three';
import { toPlayer, wander, giveUp } from './common.js';

// 자폭: 가까이 오면 부풀며 깜빡이다가 폭발 (건물에 더 아프다)
export const exploder = {
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
        move.copy(v);
        speed = d.chaseSpeed;
        if (dist < d.triggerRange) m.setState('fuse');
        break;
      case 'fuse':
        if (m.stateTime >= d.fuseTime && m.alive) {
          m.ctx.bus.emit('monster:blast', { monster: m, position: m.position.clone(), radius: d.blastRadius, damage: m.stats.attack, multiplier: d.blastMultiplier });
        }
        break;
    }
    return { move, speed };
  },

  animate(m) {
    if (m.state !== 'fuse') return false;
    const t = Math.min(1, m.stateTime / m.def.fuseTime);
    m.body.scale.setScalar(1 + t * 0.5);
    m.flash = Math.sin(m.stateTime * (10 + t * 30)) > 0 ? 0.05 : 0; // 점점 빨라지는 깜빡임
    return true;
  },
};
