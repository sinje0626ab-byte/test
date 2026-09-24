import * as THREE from 'three';

const flat = (color) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 });

// 기지 단계별 중심 건물 모양. mats 는 피격 번쩍임용, lantern 은 등불 자리, flag 는 흔들리는 깃발
export function createBaseModel(model) {
  const g = new THREE.Group();
  const mats = [];
  const add = (mesh, hit = true) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (hit) mats.push(mesh.material);
    g.add(mesh);
    return mesh;
  };
  const flagAt = (y, x = 0, z = 0) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 5), flat('#8a6440'));
    pole.position.set(x, y, z);
    add(pole, false);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), flat('#ff7b7b'));
    flag.material.side = THREE.DoubleSide;
    flag.position.set(x + 0.26, y + 0.3, z);
    g.add(flag);
    return flag;
  };

  if (model === 'hut') {
    const wall = add(new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 1.3, 9), flat('#c9a06a')));
    wall.position.y = 0.65;
    const roof = add(new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.5, 9), flat('#e8c872')));
    roof.position.y = 2.0;
    const door = add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.1), flat('#6b4a36')), false);
    door.position.set(0, 0.5, 1.4);
    return { group: g, mats, lantern: [0.95, 1.2, 1.5], flag: flagAt(3.1) };
  }

  if (model === 'house') {
    const wall = add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.7, 2.4), flat('#f4e2c0')));
    wall.position.y = 0.85;
    const roofGeo = new THREE.CylinderGeometry(1.75, 1.75, 3.1, 3, 1);
    roofGeo.rotateZ(Math.PI / 2);
    const roof = add(new THREE.Mesh(roofGeo, flat('#d9674f')));
    roof.position.y = 2.3;
    roof.scale.set(1, 0.72, 0.85);
    const chimney = add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, 0.35), flat('#a9adb6')));
    chimney.position.set(0.8, 2.9, -0.4);
    const door = add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.1), flat('#6b4a36')), false);
    door.position.set(0, 0.55, 1.22);
    for (const x of [-0.9, 0.9]) {
      const win = add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.08), flat('#9fd8ff')), false);
      win.position.set(x, 1.0, 1.22);
    }
    return { group: g, mats, lantern: [1.2, 1.3, 1.45], flag: flagAt(3.4, -0.9) };
  }

  if (model === 'fort') {
    const base = add(new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.6, 4.2), flat('#b8bcc4')));
    base.position.y = 0.3;
    const keep = add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 2.8), flat('#c9c6be')));
    keep.position.y = 1.7;
    for (const [x, z] of [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]]) {
      const tower = add(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2.8, 7), flat('#a9adb6')));
      tower.position.set(x, 1.4, z);
      const cap = add(new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.8, 7), flat('#d9674f')));
      cap.position.set(x, 3.2, z);
    }
    for (let i = -1; i <= 1; i++) {
      const merlon = add(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.45), flat('#c9c6be')));
      merlon.position.set(i * 0.9, 3.0, 1.2);
    }
    const gate = add(new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.12), flat('#6b4a36')), false);
    gate.position.set(0, 1.3, 1.42);
    return { group: g, mats, lantern: [0.9, 1.6, 2.2], flag: flagAt(3.3) };
  }

  // tent
  const tent = add(new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 4), flat('#f4d8a8')));
  tent.position.y = 1.1;
  tent.rotation.y = Math.PI / 4;
  const stripe = add(new THREE.Mesh(new THREE.ConeGeometry(1.62, 0.5, 4, 1, true), flat('#e9835b')));
  stripe.position.y = 0.45;
  stripe.rotation.y = Math.PI / 4;
  const door = add(new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), flat('#6b4a36')), false);
  door.position.set(0, 0.55, 1.14);
  door.rotation.x = -0.2;
  return { group: g, mats, lantern: [0.9, 1.1, 1.25], flag: flagAt(2.5) };
}
