import * as THREE from 'three';
import { rand } from '../../utils/random.js';

// 행동 모듈 공용 도우미
export function toPlayer(m) {
  const p = m.ctx.player;
  const v = new THREE.Vector3(p.position.x - m.position.x, 0, p.position.z - m.position.z);
  return { v, dist: v.length(), player: p, sees: p.alive && v.length() < m.def.detectRange };
}

// 집 둘레를 어슬렁거린다. move에 방향을 채우고 속도를 돌려준다.
export function wander(m, dt, move) {
  const d = m.def;
  if (!m.target) {
    m.pause -= dt;
    if (m.pause <= 0) {
      const a = rand.range(0, Math.PI * 2);
      const r = rand.range(1, d.wanderRadius);
      m.target = new THREE.Vector3(m.home.x + Math.cos(a) * r, 0, m.home.z + Math.sin(a) * r);
    }
    return 0;
  }
  move.set(m.target.x - m.position.x, 0, m.target.z - m.position.z);
  if (move.length() < 0.3 || m.stateTime > 8) {
    m.target = null;
    m.stateTime = 0;
    m.pause = rand.range(d.wanderPauseMin, d.wanderPauseMax);
    move.set(0, 0, 0);
    return 0;
  }
  return d.moveSpeed;
}

// 놓쳤을 때: 지금 자리를 새 집으로 삼고 배회로
export function giveUp(m) {
  m.home.copy(m.position);
  m.target = null;
  m.setState('wander');
}

// 바닥 예고 표시 (원 / 직선). 몬스터 mesh 자식으로 붙인다.
export function markCircle(radius) {
  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0, depthWrite: false }),
  );
  mesh.position.y = 0.05;
  mesh.visible = false;
  return mesh;
}

export function markLine(length, width) {
  const geo = new THREE.PlaneGeometry(width, length).rotateX(-Math.PI / 2).translate(0, 0, length / 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0, depthWrite: false }));
  mesh.position.y = 0.05;
  mesh.visible = false;
  return mesh;
}
