import * as THREE from 'three';
import { toPlayer, wander, giveUp, markCircle } from './common.js';

// 땅속 이동: 숨어서(맞지 않음) 다가와 → 흙더미 예고 → 튀어나오며 범위 공격 → 잠깐 드러남
export const burrower = {
  aggro: 'burrow', // 싸움을 시작하면 땅속으로
  init(m) {
    m.bs.mark = markCircle(m.def.emergeRadius);
    m.mesh.add(m.bs.mark);
    const mound = new THREE.Mesh(
      new THREE.SphereGeometry(m.radius * 1.2, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: m.ctx.world.regionAt(m.position.x, m.position.z).ground[1], flatShading: true }),
    );
    mound.scale.y = 0.4;
    mound.visible = false;
    m.mesh.add(mound);
    m.bs.mound = mound;
  },

  think(m, dt) {
    const d = m.def;
    const bs = m.bs;
    const { v, dist, player, sees } = toPlayer(m);
    const move = new THREE.Vector3();
    let speed = 0;

    switch (m.state) {
      case 'wander':
        if (sees) { m.setState('burrow'); break; }
        speed = wander(m, dt, move);
        break;
      case 'burrow':
        m.untargetable = true;
        bs.mound.visible = true;
        if (!player.alive || dist > d.loseRange) { m.untargetable = false; bs.mound.visible = false; giveUp(m); break; }
        move.copy(v);
        speed = d.chaseSpeed * 1.2;
        if (m.stateTime >= d.burrowTime || dist < 0.6) { bs.mark.visible = true; m.setState('emerge'); }
        break;
      case 'emerge':
        bs.mark.material.opacity = 0.15 + 0.35 * Math.min(1, m.stateTime / d.emergeWindup);
        if (m.stateTime >= d.emergeWindup) {
          bs.mark.visible = false;
          bs.mound.visible = false;
          m.untargetable = false;
          m.ctx.bus.emit('monster:emerge', { monster: m, position: m.position.clone(), radius: d.emergeRadius, damage: m.stats.attack });
          m.setState('surface');
        }
        break;
      case 'surface':
        if (m.stateTime >= d.surfaceTime) m.setState('burrow');
        break;
    }
    return { move, speed };
  },

  animate(m) {
    const hidden = m.state === 'burrow' || m.state === 'emerge';
    m.body.visible = !hidden;
    if (m.state === 'surface' && m.stateTime < 0.3) {
      m.body.position.y = Math.sin((m.stateTime / 0.3) * Math.PI) * 0.8; // 튀어나옴
      return true;
    }
    return hidden;
  },
};
