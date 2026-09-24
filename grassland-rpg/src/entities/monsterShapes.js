import * as THREE from 'three';

// Phase 10 몬스터 모양. 모두 기본 도형 조합. mat = 몸통 재질(피격 번쩍임·사라짐 연출용)
const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.6, ...extra });

function kit(def) {
  const r = def.radius;
  const body = new THREE.Group();
  const mat = flat(def.color, { transparent: true, opacity: 0.95 });
  const extraMats = [];
  const add = (geo, material, x, y, z, s = [1, 1, 1]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x * r, y * r, z * r);
    m.scale.set(...s);
    m.castShadow = true;
    body.add(m);
    return m;
  };
  const other = (color, extra) => {
    const m = flat(color, { transparent: true, ...extra });
    extraMats.push(m);
    return m;
  };
  const eyes = (y, z, spread = 0.3, color = 0x23262e) => {
    const g = new THREE.SphereGeometry(r * 0.1, 6, 4);
    const em = new THREE.MeshBasicMaterial({ color });
    for (const s of [-1, 1]) add(g, em, s * spread, y, z);
  };
  return { r, body, mat, extraMats, add, other, eyes };
}

export const SHAPES = {
  bee(def) {
    const k = kit(def);
    const { r, add, mat, other } = k;
    add(new THREE.SphereGeometry(r, 10, 8), mat, 0, 0, 0, [0.9, 0.85, 1.2]);
    const stripe = other('#2b2b33');
    for (const z of [-0.3, 0.2]) add(new THREE.TorusGeometry(r * 0.88, r * 0.12, 4, 14), stripe, 0, 0, z).rotation.y = Math.PI / 2;
    const wing = other('#ffffff', { opacity: 0.55, depthWrite: false });
    k.wings = [-1, 1].map((s) => {
      const w = add(new THREE.CircleGeometry(r * 0.7, 10), wing, s * 0.7, 0.8, 0);
      w.rotation.set(-Math.PI / 2, 0, s * 0.4);
      return w;
    });
    add(new THREE.ConeGeometry(r * 0.15, r * 0.4, 4).rotateX(-Math.PI / 2), stripe, 0, 0, -1.25);
    k.eyes(0.25, 0.95);
    return k;
  },

  rabbit(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.IcosahedronGeometry(k.r, 1), mat, 0, 0.8, 0, [1, 0.85, 1.15]);
    add(new THREE.IcosahedronGeometry(k.r * 0.6, 1), mat, 0, 1.45, 0.7);
    for (const s of [-1, 1]) add(new THREE.CapsuleGeometry(k.r * 0.12, k.r * 0.8, 2, 6), mat, s * 0.2, 2.2, 0.55).rotation.x = -0.3;
    add(new THREE.ConeGeometry(k.r * 0.1, k.r * 0.5, 5), other('#ffd9a0'), 0, 1.9, 1.05).rotation.x = 0.7;
    k.eyes(1.5, 1.2, 0.22);
    return k;
  },

  puff(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.CylinderGeometry(k.r * 0.35, k.r * 0.45, k.r * 0.8, 7), other('#f4e6cf'), 0, 0.4, 0);
    add(new THREE.SphereGeometry(k.r * 1.05, 10, 7), mat, 0, 1.15, 0, [1, 0.85, 1]);
    const spot = other('#e6d3ff');
    for (let i = 0; i < 5; i++) add(new THREE.SphereGeometry(k.r * 0.16, 6, 4), spot, Math.cos(i * 1.3) * 0.8, 1.35 + (i % 2) * 0.2, Math.sin(i * 1.3) * 0.8);
    k.eyes(0.75, 0.42, 0.18);
    return k;
  },

  wolf(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.CapsuleGeometry(k.r * 0.5, k.r * 1.2, 3, 8).rotateX(Math.PI / 2), mat, 0, 0.9, 0);
    add(new THREE.ConeGeometry(k.r * 0.45, k.r * 0.9, 6).rotateX(Math.PI / 2), mat, 0, 1.1, 1.2);
    for (const s of [-1, 1]) add(new THREE.ConeGeometry(k.r * 0.14, k.r * 0.35, 4), mat, s * 0.22, 1.5, 0.9);
    const thorn = other('#d9e8a0');
    for (let i = 0; i < 4; i++) add(new THREE.ConeGeometry(k.r * 0.1, k.r * 0.4, 4), thorn, 0, 1.45, 0.5 - i * 0.35);
    for (const [x, z] of [[-0.3, 0.5], [0.3, 0.5], [-0.3, -0.5], [0.3, -0.5]]) add(new THREE.CylinderGeometry(k.r * 0.1, k.r * 0.1, k.r * 0.7, 5), mat, x, 0.35, z);
    k.eyes(1.2, 1.45, 0.16, 0xffe066);
    return k;
  },

  stump(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.CylinderGeometry(k.r * 0.8, k.r * 0.95, k.r * 1.4, 8), mat, 0, 0.7, 0);
    add(new THREE.CylinderGeometry(k.r * 0.78, k.r * 0.78, 0.04, 8), other('#e0c38a'), 0, 1.42, 0);
    const leaf = other('#6fae4a');
    for (let i = 0; i < 5; i++) add(new THREE.IcosahedronGeometry(k.r * 0.28, 0), leaf, Math.cos(i * 1.25) * 0.45, 1.6, Math.sin(i * 1.25) * 0.45);
    for (const s of [-1, 1]) add(new THREE.CylinderGeometry(k.r * 0.12, k.r * 0.16, k.r * 0.9, 5), mat, s * 0.95, 0.7, 0.1).rotation.z = s * 0.6;
    k.eyes(1.0, 0.8, 0.28, 0xfff2b0);
    return k;
  },

  scorpion(def) {
    const k = kit(def);
    const { add, mat } = k;
    add(new THREE.SphereGeometry(k.r, 10, 6), mat, 0, 0.45, 0, [1.1, 0.5, 1.4]);
    for (const s of [-1, 1]) {
      add(new THREE.CylinderGeometry(k.r * 0.1, k.r * 0.12, k.r * 0.8, 5), mat, s * 0.55, 0.45, 1.0).rotation.x = Math.PI / 2 - 0.3;
      add(new THREE.SphereGeometry(k.r * 0.25, 6, 4), mat, s * 0.62, 0.5, 1.5, [1, 0.6, 1.3]);
    }
    for (let i = 0; i < 4; i++) add(new THREE.SphereGeometry(k.r * (0.22 - i * 0.03), 6, 4), mat, 0, 0.6 + i * 0.35, -1.0 - i * 0.12 + Math.max(0, i - 2) * 0.35);
    add(new THREE.ConeGeometry(k.r * 0.12, k.r * 0.35, 4), mat, 0, 1.85, -0.9).rotation.x = 2.2;
    k.eyes(0.7, 1.15, 0.18);
    return k;
  },

  mole(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.IcosahedronGeometry(k.r, 1), mat, 0, 0.9, 0, [1, 0.95, 1.05]);
    add(new THREE.SphereGeometry(k.r * 0.2, 6, 4), other('#ff9fb0'), 0, 0.9, 1.05);
    const claw = other('#f4efe3');
    for (const s of [-1, 1]) add(new THREE.ConeGeometry(k.r * 0.18, k.r * 0.4, 4), claw, s * 0.7, 0.5, 0.7).rotation.x = Math.PI / 2;
    k.eyes(1.15, 0.85, 0.28);
    return k;
  },

  tumble(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.IcosahedronGeometry(k.r, 1), mat, 0, 1, 0, [1, 1, 1]).material.wireframe = false;
    const twig = other('#8a6440');
    for (let i = 0; i < 10; i++) {
      const t = add(new THREE.CylinderGeometry(k.r * 0.04, k.r * 0.04, k.r * 2.1, 3), twig, 0, 1, 0);
      t.rotation.set(i * 0.7, i * 1.3, i * 0.4);
    }
    k.eyes(1.2, 0.95, 0.25);
    return k;
  },

  wisp(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    mat.emissive = new THREE.Color('#4a8aaa');
    add(new THREE.IcosahedronGeometry(k.r * 0.8, 1), mat, 0, 0, 0);
    const crystal = other('#ffffff', { opacity: 0.8, emissive: new THREE.Color('#6fb8d8') });
    for (let i = 0; i < 6; i++) add(new THREE.OctahedronGeometry(k.r * 0.28, 0), crystal, Math.cos(i * 1.05) * 1.2, 0, Math.sin(i * 1.05) * 1.2);
    k.eyes(0.15, 0.75, 0.22);
    return k;
  },

  yeti(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.IcosahedronGeometry(k.r, 1), mat, 0, 0.95, 0, [1.05, 1.05, 0.95]);
    add(new THREE.SphereGeometry(k.r * 0.45, 8, 6), other('#8fb8e8'), 0, 1.05, 0.72, [1, 0.9, 0.5]);
    for (const s of [-1, 1]) add(new THREE.IcosahedronGeometry(k.r * 0.35, 0), mat, s * 1.0, 0.7, 0.1);
    k.eyes(1.15, 0.95, 0.18);
    return k;
  },

  snowman(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    add(new THREE.SphereGeometry(k.r, 10, 8), mat, 0, 0.9, 0);
    add(new THREE.SphereGeometry(k.r * 0.68, 10, 8), mat, 0, 2.2, 0);
    add(new THREE.ConeGeometry(k.r * 0.1, k.r * 0.5, 6).rotateX(Math.PI / 2), other('#ff8a3d'), 0, 2.2, 0.8);
    add(new THREE.CylinderGeometry(k.r * 0.04, k.r * 0.04, k.r * 0.5, 4), other('#3a3e47'), 0, 3.05, 0);
    add(new THREE.OctahedronGeometry(k.r * 0.12, 0), new THREE.MeshBasicMaterial({ color: 0xffb347 }), 0, 3.35, 0); // 불붙은 심지
    k.eyes(2.35, 0.6, 0.2);
    return k;
  },

  kingslime(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    mat.opacity = 0.9;
    add(new THREE.IcosahedronGeometry(k.r, 2), mat, 0, 0.78, 0, [1, 0.78, 1]);
    const gold = other('#ffd23f', { metalness: 0.5, emissive: new THREE.Color('#6b5010') });
    add(new THREE.CylinderGeometry(k.r * 0.4, k.r * 0.45, k.r * 0.3, 8), gold, 0, 1.55, 0);
    for (let i = 0; i < 5; i++) add(new THREE.ConeGeometry(k.r * 0.08, k.r * 0.25, 4), gold, Math.cos(i * 1.26) * 0.38, 1.8, Math.sin(i * 1.26) * 0.38);
    k.eyes(0.95, 0.85, 0.3);
    return k;
  },

  treant(def) {
    const k = kit(def);
    const { add, mat, other } = k;
    const bark = other('#7a5234');
    add(new THREE.CylinderGeometry(k.r * 0.55, k.r * 0.75, k.r * 1.8, 8), bark, 0, 0.9, 0);
    add(new THREE.IcosahedronGeometry(k.r * 1.1, 1), mat, 0, 2.2, 0, [1.15, 0.85, 1.15]);
    for (const s of [-1, 1]) add(new THREE.CylinderGeometry(k.r * 0.12, k.r * 0.18, k.r * 1.3, 5), bark, s * 0.85, 1.2, 0.2).rotation.z = s * 0.9;
    for (const s of [-1, 1]) add(new THREE.CylinderGeometry(k.r * 0.18, k.r * 0.25, k.r * 0.6, 5), bark, s * 0.4, 0.2, 0);
    k.eyes(1.35, 0.72, 0.22, 0xfff2b0);
    return k;
  },
};
