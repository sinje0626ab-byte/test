import * as THREE from 'three';

// 초원의 작은 연못 (config.ponds): 반사 없이 파란 평면 + 반짝이는 가장자리 + 연잎 몇 장
export function buildPonds(world) {
  const scene = world.scene;
  const water = new THREE.MeshStandardMaterial({ color: 0x5fb4e0, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.9 });
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xe8f8ff, transparent: true, opacity: 0.6 });
  const pad = new THREE.MeshStandardMaterial({ color: 0x5fae4a, flatShading: true });
  const bank = new THREE.MeshStandardMaterial({ color: 0xc9b98a, flatShading: true });
  world.pondRims = [];
  for (const p of world.ponds) {
    const g = new THREE.Group();
    const shore = new THREE.Mesh(new THREE.CircleGeometry(p.r + 0.6, 28).rotateX(-Math.PI / 2), bank);
    shore.position.y = 0.07; // 땅 기복(±0.06) 위로
    const surface = new THREE.Mesh(new THREE.CircleGeometry(p.r, 28).rotateX(-Math.PI / 2), water);
    surface.position.y = 0.09;
    surface.receiveShadow = true;
    const rim = new THREE.Mesh(new THREE.RingGeometry(p.r - 0.18, p.r, 40).rotateX(-Math.PI / 2), rimMat.clone());
    rim.position.y = 0.1;
    g.add(shore, surface, rim);
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1 + p.x;
      const lily = new THREE.Mesh(new THREE.CircleGeometry(0.35, 7, 0, Math.PI * 1.75).rotateX(-Math.PI / 2), pad);
      lily.position.set(Math.cos(a) * p.r * 0.5, 0.11, Math.sin(a) * p.r * 0.5);
      g.add(lily);
    }
    g.position.set(p.x, 0, p.z);
    scene.add(g);
    world.pondRims.push(rim);
  }
}
