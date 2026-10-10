import * as THREE from 'three';
import { baked, meshes, Kit, flower, bush, barrel, crate, lantern, rock } from './structureKit.js';

// 기지 꾸미기 소품 모양 (data/decor.json). 건물 키트(Kit)로 조각을 모아 재질별로 합치고 종류마다 한 번만 만든다.
// 앞면 +z, 바닥 y=0. 움직이는 조각(풍차 날개·그네 의자)은 따로 돌려준다 → spin / sway
const MAKE = {
  street_lamp(k) {
    k.cyl(0.2, 0.26, 0.16, 8, 'stoneDark', [0, 0.08, 0]);
    k.cyl(0.05, 0.07, 2.1, 8, 'ironDark', [0, 1.15, 0]);
    k.add(new THREE.TorusGeometry(0.07, 0.02, 4, 8), 'ironDark', [0, 0.5, 0], [Math.PI / 2, 0, 0]);
    k.box(0.5, 0.04, 0.04, 'ironDark', [0.18, 2.12, 0]);
    k.add(new THREE.TorusGeometry(0.12, 0.018, 4, 10, Math.PI), 'ironDark', [0.32, 2.12, 0], [0, 0, Math.PI]);
    lantern(k, [0.4, 1.86, 0]);
    lantern(k, [-0.1, 2.3, 0]);
  },
  torch(k) {
    k.cyl(0.05, 0.07, 1.3, 6, 'log', [0, 0.65, 0]);
    k.cyl(0.12, 0.08, 0.14, 7, 'ironDark', [0, 1.33, 0]);
    k.cone(0.11, 0.32, 5, 'flame', [0, 1.55, 0]);
    k.cone(0.06, 0.2, 5, 'flameCore', [0, 1.52, 0.02]);
    for (const a of [0, 2.1, 4.2]) rock(k, Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0.07, 'stone');
  },
  mushroom_lamp(k) {
    k.cyl(0.07, 0.1, 0.55, 7, 'stem', [0, 0.27, 0]);
    k.add(new THREE.SphereGeometry(0.32, 9, 5, 0, Math.PI * 2, 0, Math.PI / 2), 'mushroom', [0, 0.52, 0], [0, 0, 0], [1, 0.75, 1]);
    for (const [x, z] of [[0.15, 0.1], [-0.12, 0.16], [0, -0.18], [-0.17, -0.06], [0.12, -0.14]]) k.ball(0.045, 'spot', [x, 0.7, z], [1, 0.5, 1]);
    k.ball(0.09, 'glow', [0, 0.48, 0], [1, 0.6, 1]);
    k.cyl(0.04, 0.06, 0.28, 6, 'stem', [0.28, 0.14, 0.12]);
    k.add(new THREE.SphereGeometry(0.14, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), 'mushroom', [0.28, 0.27, 0.12], [0, 0, 0], [1, 0.7, 1]);
    k.ball(0.04, 'glow', [0.28, 0.25, 0.12], [1, 0.6, 1]);
  },
  lantern_posts(k) {
    for (const x of [-1.1, 1.1]) {
      k.cyl(0.06, 0.08, 1.9, 6, 'wood', [x, 0.95, 0]);
      k.cone(0.09, 0.12, 6, 'woodDark', [x, 1.96, 0]);
    }
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      pts.push(new THREE.Vector3(-1.1 + t * 2.2, 1.78 - Math.sin(t * Math.PI) * 0.32, 0));
    }
    k.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.012, 3), 'rope');
    for (const t of [0.2, 0.4, 0.6, 0.8]) {
      const x = -1.1 + t * 2.2;
      const y = 1.78 - Math.sin(t * Math.PI) * 0.32;
      k.ball(0.08, t === 0.4 || t === 0.8 ? 'glow' : 'flame', [x, y - 0.1, 0], [1, 1.2, 1], 1);
    }
  },
  bench(k) {
    for (const x of [-0.5, 0.5]) {
      k.box(0.08, 0.38, 0.4, 'woodDark', [x, 0.19, 0]);
      k.box(0.08, 0.5, 0.06, 'woodDark', [x, 0.6, -0.18]);
    }
    for (let i = 0; i < 3; i++) k.box(1.2, 0.05, 0.12, i % 2 ? 'woodLight' : 'wood', [0, 0.41, -0.13 + i * 0.13]);
    for (let i = 0; i < 2; i++) k.box(1.2, 0.1, 0.04, i ? 'woodLight' : 'wood', [0, 0.62 + i * 0.16, -0.2], [-0.15, 0, 0]);
  },
  picnic_table(k) {
    k.box(1.6, 0.07, 0.7, 'woodLight', [0, 0.72, 0]);
    k.box(1.4, 0.02, 0.72, 'red', [0, 0.765, 0]);
    for (let i = -3; i <= 3; i++) k.box(0.1, 0.022, 0.73, 'cloth', [i * 0.2, 0.768, 0]);
    for (const x of [-0.6, 0.6]) {
      k.box(0.07, 0.72, 0.07, 'woodDark', [x, 0.36, -0.22], [0.25, 0, 0]);
      k.box(0.07, 0.72, 0.07, 'woodDark', [x, 0.36, 0.22], [-0.25, 0, 0]);
    }
    for (const z of [-0.62, 0.62]) {
      k.box(1.5, 0.06, 0.24, 'wood', [0, 0.42, z]);
      for (const x of [-0.6, 0.6]) k.box(0.06, 0.4, 0.06, 'woodDark', [x, 0.2, z]);
    }
    k.cyl(0.05, 0.05, 0.12, 8, 'cream', [0.3, 0.83, 0.1]);
    k.ball(0.07, 'apple', [-0.25, 0.83, -0.05]);
    k.ball(0.06, 'apple', [-0.15, 0.82, 0.08]);
  },
  parasol(k) {
    k.cyl(0.4, 0.4, 0.05, 12, 'cream', [0, 0.72, 0]);
    k.cyl(0.05, 0.08, 0.72, 6, 'woodDark', [0, 0.36, 0]);
    k.cyl(0.03, 0.03, 2.1, 6, 'woodDark', [0, 1.05, 0]);
    for (let i = 0; i < 8; i++) {
      const g = new THREE.ConeGeometry(1.05, 0.42, 8, 1, true, (i / 8) * Math.PI * 2, Math.PI / 4);
      k.add(g, i % 2 ? 'cloth' : 'red', [0, 2.05, 0]);
    }
    k.ball(0.06, 'woodDark', [0, 2.3, 0]);
    for (const a of [0.4, 2.5, 4.6]) {
      const x = Math.cos(a) * 0.75;
      const z = Math.sin(a) * 0.75;
      k.cyl(0.18, 0.16, 0.06, 8, 'woodLight', [x, 0.42, z]);
      k.cyl(0.03, 0.03, 0.4, 5, 'woodDark', [x, 0.2, z]);
    }
  },
  swing(k) {
    for (const x of [-0.75, 0.75]) {
      k.box(0.08, 1.9, 0.08, 'log', [x, 0.92, -0.25], [0.18, 0, 0]);
      k.box(0.08, 1.9, 0.08, 'log', [x, 0.92, 0.25], [-0.18, 0, 0]);
    }
    k.cyl(0.06, 0.06, 1.7, 7, 'woodDark', [0, 1.8, 0], [0, 0, Math.PI / 2]);
    for (const x of [-0.75, 0.75]) for (const z of [-0.25, 0.25]) k.cyl(0.07, 0.07, 0.05, 6, 'woodDark', [x, 0.02, z]);
  },
  flowerbed(k) {
    k.box(1.3, 0.2, 0.7, 'wood', [0, 0.1, 0]);
    k.box(1.2, 0.04, 0.6, 'soil', [0, 0.21, 0]);
    k.box(1.34, 0.04, 0.74, 'woodDark', [0, 0.21, 0]);
    const cols = ['petalPink', 'petal', 'pollen', 'red', 'petalPink'];
    let i = 0;
    for (let x = -0.48; x <= 0.5; x += 0.24) {
      for (const z of [-0.15, 0.13]) {
        k.cyl(0.012, 0.012, 0.18, 4, 'leaf', [x, 0.31, z]);
        flower(k, x, z, cols[i++ % cols.length], 0.41, 1.3);
        k.ball(0.06, 'leafLight', [x + 0.06, 0.27, z], [1, 0.6, 1]);
      }
    }
  },
  topiary(k) {
    k.cyl(0.22, 0.17, 0.32, 8, 'roof', [0, 0.16, 0]);
    k.cyl(0.24, 0.24, 0.05, 8, 'roofDark', [0, 0.32, 0]);
    k.cyl(0.04, 0.04, 0.35, 5, 'woodDark', [0, 0.5, 0]);
    k.ball(0.34, 'leaf', [0, 0.95, 0], 1, 1);
    k.ball(0.18, 'leafLight', [0.12, 1.12, 0.14], 1, 1);
    flower(k, 0.18, 0.27, 'petalPink', 1.0, 1);
  },
  hedge(k) {
    k.box(1.4, 0.55, 0.45, 'leaf', [0, 0.28, 0]);
    for (let i = 0; i < 5; i++) k.ball(0.22, i % 2 ? 'leafLight' : 'leaf', [-0.56 + i * 0.28, 0.55, 0], [1, 0.6, 1]);
    for (const x of [-0.4, 0.1, 0.45]) flower(k, x, 0.23, 'petal', 0.42, 1);
  },
  cherry_tree(k) {
    k.cyl(0.1, 0.16, 1.4, 7, 'log', [0, 0.7, 0], [0, 0, 0.06]);
    k.cyl(0.05, 0.07, 0.6, 5, 'log', [0.25, 1.35, 0], [0, 0, -0.8]);
    k.cyl(0.05, 0.07, 0.6, 5, 'log', [-0.2, 1.4, 0.1], [0.3, 0, 0.7]);
    for (const [x, y, z, r] of [[0, 1.9, 0, 0.6], [0.5, 1.7, 0.1, 0.42], [-0.45, 1.75, -0.05, 0.45], [0.1, 2.2, 0.2, 0.38], [0, 1.65, -0.35, 0.4]]) k.ball(r, 'petalPink', [x, y, z], 1, 1);
    for (const [x, z] of [[0.4, 0.5], [-0.5, 0.3], [0.2, -0.5], [-0.3, -0.45], [0.65, -0.1]]) k.ball(0.05, 'petalPink', [x, 0.04, z], [1, 0.3, 1]);
  },
  flower_arch(k) {
    for (const x of [-0.9, 0.9]) {
      k.box(0.1, 1.9, 0.1, 'woodLight', [x, 0.95, -0.12]);
      k.box(0.1, 1.9, 0.1, 'woodLight', [x, 0.95, 0.12]);
      for (let y = 0.3; y < 1.8; y += 0.3) k.box(0.06, 0.04, 0.3, 'wood', [x, y, 0]);
    }
    k.add(new THREE.TorusGeometry(0.9, 0.05, 4, 16, Math.PI), 'woodLight', [0, 1.9, -0.12]);
    k.add(new THREE.TorusGeometry(0.9, 0.05, 4, 16, Math.PI), 'woodLight', [0, 1.9, 0.12]);
    for (let i = 0; i <= 14; i++) {
      const a = (i / 14) * Math.PI;
      const x = Math.cos(a) * 0.9;
      const y = 1.9 + Math.sin(a) * 0.9;
      k.ball(0.13, i % 2 ? 'leaf' : 'leafLight', [x, y, 0], [1, 1, 0.9]);
      if (i % 2) k.ball(0.07, i % 4 === 1 ? 'red' : 'petalPink', [x, y + 0.05, 0.12]);
    }
    for (const x of [-0.9, 0.9]) for (let y = 0.3; y < 1.9; y += 0.4) {
      k.ball(0.11, 'leaf', [x, y, 0.08], [1, 1, 0.8]);
      k.ball(0.06, 'petalPink', [x + 0.05, y + 0.06, 0.16]);
    }
  },
  barrel_planter(k) {
    barrel(k, [0, 0, 0], 0.22, 'soil');
    for (const [x, z, c] of [[0, 0, 'red'], [0.1, 0.06, 'pollen'], [-0.09, 0.05, 'petal'], [0.02, -0.1, 'petalPink']]) {
      k.cyl(0.01, 0.01, 0.2, 4, 'leaf', [x, 0.58, z]);
      flower(k, x, z, c, 0.68, 1.2);
    }
    k.ball(0.14, 'leafLight', [0, 0.52, 0], [1, 0.5, 1]);
  },
  stepping_stones(k) {
    const pts = [[-0.55, -0.35, 0.22], [-0.1, -0.05, 0.25], [0.35, 0.2, 0.21], [0.7, 0.5, 0.18], [-0.45, 0.45, 0.16]];
    for (const [x, z, r] of pts) {
      const g = new THREE.CylinderGeometry(r, r * 1.05, 0.06, 7);
      k.add(g, x > 0 ? 'stoneLight' : 'stone', [x, 0.03, z], [0, x * 3, 0], [1, 1, 0.8]);
    }
    for (const [x, z] of [[-0.3, 0.2], [0.15, -0.3], [0.55, -0.05]]) k.ball(0.06, 'leafLight', [x, 0.03, z], [1, 0.4, 1]);
  },
  mini_pond(k) {
    const water = new THREE.CylinderGeometry(1.2, 1.2, 0.04, 18);
    k.add(water, 'water', [0, 0.04, 0], [0, 0, 0], [1, 1, 0.78]);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      k.add(new THREE.DodecahedronGeometry(0.17 + (i % 3) * 0.04, 0), i % 2 ? 'stone' : 'stoneLight', [Math.cos(a) * 1.3, 0.08, Math.sin(a) * 1.02], [i, i * 2, 0], [1.2, 0.6, 1]);
    }
    for (const [x, z, r] of [[0.4, 0.2, 0.18], [-0.35, -0.25, 0.15], [0.1, -0.4, 0.12]]) {
      k.add(new THREE.CylinderGeometry(r, r, 0.015, 10, 1, false, 0.4, Math.PI * 1.75), 'leaf', [x, 0.07, z]);
    }
    flower(k, 0.4, 0.2, 'petalPink', 0.1, 1);
    for (const [x, z] of [[-1.0, 0.5], [1.05, -0.4], [-0.6, -0.9]]) {
      for (let j = 0; j < 4; j++) k.cyl(0.015, 0.02, 0.45 + j * 0.06, 4, 'leaf', [x + j * 0.05, 0.25, z + (j % 2) * 0.05], [0.1 * (j - 1.5), 0, 0.12 * (j - 1.5)]);
      k.cyl(0.03, 0.03, 0.12, 5, 'woodDark', [x + 0.05, 0.55, z]);
    }
  },
  fountain(k) {
    k.cyl(1.05, 1.1, 0.4, 14, 'stone', [0, 0.2, 0]);
    k.cyl(1.1, 1.1, 0.08, 14, 'stoneLight', [0, 0.42, 0]);
    k.cyl(0.92, 0.92, 0.02, 14, 'water', [0, 0.39, 0]);
    k.cyl(0.14, 0.2, 0.8, 8, 'stoneLight', [0, 0.75, 0]);
    k.cyl(0.45, 0.2, 0.16, 10, 'stone', [0, 1.18, 0]);
    k.cyl(0.38, 0.38, 0.02, 10, 'water', [0, 1.25, 0]);
    k.cyl(0.06, 0.1, 0.3, 6, 'stoneLight', [0, 1.4, 0]);
    k.cone(0.12, 0.38, 6, 'ice', [0, 1.72, 0]);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      k.cone(0.05, 0.4, 4, 'ice', [Math.cos(a) * 0.4, 1.02, Math.sin(a) * 0.4], [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]);
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      k.ball(0.12, 'leaf', [Math.cos(a) * 1.12, 0.12, Math.sin(a) * 1.12], [1, 0.7, 1]);
    }
  },
  well(k) {
    k.cyl(0.55, 0.6, 0.6, 12, 'stone', [0, 0.3, 0]);
    k.cyl(0.58, 0.58, 0.06, 12, 'stoneLight', [0, 0.62, 0]);
    k.cyl(0.46, 0.46, 0.02, 12, 'water', [0, 0.5, 0]);
    for (const x of [-0.5, 0.5]) k.box(0.08, 1.2, 0.08, 'wood', [x, 1.1, 0]);
    k.cyl(0.05, 0.05, 1.1, 6, 'woodDark', [0, 1.35, 0], [0, 0, Math.PI / 2]);
    k.cyl(0.015, 0.015, 0.5, 4, 'rope', [0.05, 1.1, 0]);
    k.cyl(0.11, 0.09, 0.16, 7, 'wood', [0.05, 0.82, 0]);
    k.box(1.3, 0.05, 0.75, 'roof', [0, 1.82, 0.2], [0.55, 0, 0]);
    k.box(1.3, 0.05, 0.75, 'roofDark', [0, 1.82, -0.2], [-0.55, 0, 0]);
    k.box(1.34, 0.07, 0.07, 'woodDark', [0, 1.98, 0]);
    k.box(0.18, 0.04, 0.04, 'woodDark', [0.62, 1.35, 0]);
    k.box(0.04, 0.18, 0.04, 'woodDark', [0.7, 1.28, 0]);
  },
  bird_bath(k) {
    k.cyl(0.24, 0.28, 0.1, 8, 'stoneDark', [0, 0.05, 0]);
    k.cyl(0.08, 0.12, 0.6, 7, 'stone', [0, 0.4, 0]);
    k.cyl(0.32, 0.12, 0.14, 10, 'stoneLight', [0, 0.76, 0]);
    k.cyl(0.27, 0.27, 0.02, 10, 'water', [0, 0.83, 0]);
    // 작은 새
    k.ball(0.07, '#8fd0f2', [0.2, 0.9, 0], [1.2, 1, 1]);
    k.ball(0.045, '#8fd0f2', [0.27, 0.96, 0]);
    k.cone(0.015, 0.04, 4, 'pollen', [0.32, 0.96, 0], [0, 0, -Math.PI / 2]);
    k.ball(0.04, 'leaf', [-0.16, 0.12, 0.2], [1, 0.6, 1]);
  },
  signpost(k) {
    k.cyl(0.05, 0.06, 1.6, 6, 'log', [0, 0.8, 0]);
    k.cone(0.07, 0.1, 6, 'woodDark', [0, 1.65, 0]);
    for (const [y, ry, name] of [[1.4, 0.3, 'woodLight'], [1.15, -0.9, 'wood'], [0.9, 2.2, 'woodLight']]) {
      const s = new Kit();
      s.box(0.55, 0.14, 0.04, name, [0.26, 0, 0]);
      s.cone(0.07, 0.12, 4, name, [0.58, 0, 0], [0, 0, -Math.PI / 2]);
      s.box(0.3, 0.02, 0.045, 'woodDark', [0.24, 0, 0]);
      k.put(s, [0, y, 0], [0, ry, 0]);
    }
    for (const a of [0, 2.2, 4.4]) bush(k, Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.1, 'leafLight');
  },
  mailbox(k) {
    k.box(0.08, 0.9, 0.08, 'woodDark', [0, 0.45, 0]);
    k.box(0.3, 0.26, 0.42, 'potionBlue', [0, 1.0, 0]);
    k.add(new THREE.CylinderGeometry(0.15, 0.15, 0.42, 10, 1, false, 0, Math.PI), 'potionBlue', [0, 1.13, 0], [Math.PI / 2, Math.PI / 2, 0]);
    k.box(0.22, 0.04, 0.02, 'ironDark', [0, 1.08, 0.215]);
    k.box(0.03, 0.26, 0.03, 'red', [0.17, 1.15, -0.05]);
    k.box(0.02, 0.1, 0.14, 'red', [0.18, 1.24, 0.01]);
    k.box(0.16, 0.1, 0.012, 'paper', [-0.02, 1.2, 0.215], [0, 0, 0.2]);
    flower(k, 0.12, 0.12, 'pollen', 0.06, 1.2);
  },
  scarecrow(k) {
    k.cyl(0.04, 0.05, 1.7, 6, 'woodDark', [0, 0.85, 0]);
    k.box(1.0, 0.06, 0.06, 'woodDark', [0, 1.25, 0]);
    k.box(0.42, 0.5, 0.24, 'potionBlue', [0, 1.15, 0]);
    k.box(0.12, 0.12, 0.13, 'red', [0.1, 1.05, 0.08]);
    for (const x of [-0.4, 0.4]) k.box(0.22, 0.14, 0.16, 'potionBlue', [x, 1.25, 0]);
    for (const x of [-0.53, 0.53]) k.cone(0.06, 0.14, 5, 'thatch', [x, 1.25, 0], [0, 0, x > 0 ? -Math.PI / 2 : Math.PI / 2]);
    k.ball(0.18, 'canvas', [0, 1.6, 0], 1, 1);
    k.ball(0.025, 'coal', [-0.06, 1.62, 0.16]);
    k.ball(0.025, 'coal', [0.06, 1.62, 0.16]);
    k.add(new THREE.TorusGeometry(0.05, 0.012, 3, 8, Math.PI), 'coal', [0, 1.55, 0.16], [0, 0, Math.PI]);
    k.cyl(0.32, 0.34, 0.03, 10, 'thatch', [0, 1.73, 0]);
    k.cyl(0.14, 0.17, 0.16, 8, 'thatchDark', [0, 1.82, 0]);
    k.cyl(0.175, 0.175, 0.04, 8, 'red', [0, 1.76, 0]);
  },
  haystack(k) {
    k.add(new THREE.SphereGeometry(0.6, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 'thatch', [0, 0, 0], [0, 0, 0], [1, 1.1, 1]);
    k.add(new THREE.TorusGeometry(0.5, 0.03, 3, 14), 'thatchDark', [0, 0.32, 0], [Math.PI / 2, 0, 0]);
    k.box(0.45, 0.3, 0.3, 'thatch', [0.6, 0.15, 0.25], [0, 0.4, 0]);
    k.box(0.47, 0.04, 0.32, 'rope', [0.6, 0.2, 0.25], [0, 0.4, 0]);
    k.cyl(0.015, 0.015, 0.9, 4, 'woodDark', [-0.35, 0.6, 0.3], [0.3, 0, 0.4]);
  },
  cart(k) {
    k.box(1.1, 0.12, 0.7, 'wood', [0, 0.45, 0]);
    for (const z of [-0.35, 0.35]) k.box(1.1, 0.26, 0.05, 'woodLight', [0, 0.62, z]);
    k.box(0.05, 0.26, 0.7, 'woodLight', [-0.55, 0.62, 0]);
    for (const z of [-0.42, 0.42]) {
      k.add(new THREE.TorusGeometry(0.28, 0.04, 4, 12), 'woodDark', [0.1, 0.3, z]);
      k.cyl(0.06, 0.06, 0.08, 6, 'ironDark', [0.1, 0.3, z], [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 4; i++) k.box(0.03, 0.54, 0.03, 'wood', [0.1, 0.3, z], [0, 0, (i / 4) * Math.PI]);
    }
    for (const z of [-0.25, 0.25]) k.box(0.9, 0.05, 0.05, 'woodDark', [0.95, 0.4, z], [0, 0, 0.2]);
    k.ball(0.17, 'roof', [-0.25, 0.68, 0.1], [1, 0.8, 1], 1);
    k.cyl(0.02, 0.02, 0.08, 4, 'leaf', [-0.25, 0.82, 0.1]);
    k.ball(0.14, 'roof', [0.05, 0.66, -0.12], [1, 0.8, 1], 1);
    crate(k, [0.3, 0.51, 0.08], 0.28, 0.3);
  },
  owl_statue(k) {
    k.box(0.6, 0.3, 0.6, 'stoneDark', [0, 0.15, 0]);
    k.box(0.66, 0.06, 0.66, 'stone', [0, 0.33, 0]);
    k.ball(0.3, 'stoneLight', [0, 0.72, 0], [1, 1.2, 0.9], 1);
    k.ball(0.25, 'stoneLight', [0, 1.13, 0], [1.05, 0.95, 0.95], 1);
    for (const x of [-0.1, 0.1]) {
      k.cyl(0.08, 0.08, 0.04, 10, 'stone', [x, 1.16, 0.21], [Math.PI / 2, 0, 0]);
      k.cyl(0.035, 0.035, 0.04, 8, 'stoneDark', [x, 1.16, 0.235], [Math.PI / 2, 0, 0]);
      k.cone(0.06, 0.16, 4, 'stoneLight', [x * 1.6, 1.38, 0], [0, 0, x > 0 ? -0.3 : 0.3]);
    }
    k.cone(0.035, 0.08, 4, 'pollen', [0, 1.08, 0.24], [Math.PI / 2 + 0.3, 0, 0]);
    for (const [x, y, z] of [[0.22, 0.45, 0.25], [-0.25, 0.4, 0.2], [0.2, 0.9, -0.15], [-0.15, 1.3, -0.12]]) k.ball(0.08, 'moss', [x, y, z], [1, 0.6, 1]);
  },
  windmill(k) {
    k.cyl(0.55, 0.75, 2.0, 10, 'plaster', [0, 1.0, 0]);
    for (let y = 0.25; y < 2; y += 0.45) k.cyl(0.72 - y * 0.09, 0.74 - y * 0.09, 0.05, 10, 'stoneLight', [0, y, 0]);
    k.cone(0.78, 0.8, 10, 'roof', [0, 2.4, 0]);
    k.cone(0.2, 0.25, 8, 'roofDark', [0, 2.85, 0]);
    k.box(0.36, 0.6, 0.06, 'door', [0, 0.3, 0.7]);
    k.box(0.22, 0.24, 0.05, 'window', [0, 1.35, 0.6]);
    k.cyl(0.08, 0.08, 0.3, 6, 'woodDark', [0, 2.05, 0.65], [Math.PI / 2, 0, 0]);
    flower(k, 0.4, 0.75, 'petalPink', 0.08, 1.4);
    flower(k, -0.45, 0.7, 'pollen', 0.08, 1.4);
  },
};

// 움직이는 조각
const PARTS = {
  windmill() {
    const k = new Kit();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const s = new Kit();
      s.box(0.06, 1.1, 0.04, 'woodDark', [0, 0.6, 0]);
      s.box(0.32, 0.9, 0.02, i % 2 ? 'cloth' : 'canvas', [0.18, 0.68, 0]);
      for (let j = 0; j < 4; j++) s.box(0.34, 0.02, 0.03, 'wood', [0.18, 0.3 + j * 0.25, 0.01]);
      k.put(s, [0, 0, 0], [0, 0, a]);
    }
    k.ball(0.1, 'woodDark', [0, 0, 0.04]);
    return { key: 'decor:windmill:blades', kit: k, pos: [0, 2.05, 0.82], kind: 'spin' };
  },
  swing() {
    const k = new Kit();
    for (const x of [-0.25, 0.25]) k.cyl(0.012, 0.012, 1.25, 4, 'rope', [x, -0.62, 0]);
    k.box(0.62, 0.05, 0.26, 'woodLight', [0, -1.25, 0]);
    return { key: 'decor:swing:seat', kit: k, pos: [0, 1.8, 0], kind: 'sway' };
  },
};

export function createDecorModel(type) {
  const group = new THREE.Group();
  const make = MAKE[type];
  if (!make) return { group, anim: null };
  meshes(baked(`decor:${type}`, make), group);
  let anim = null;
  const part = PARTS[type]?.();
  if (part) {
    const g = new THREE.Group();
    g.position.set(...part.pos);
    meshes(baked(part.key, (k) => { k.list.push(...part.kit.list); }), g);
    group.add(g);
    anim = { node: g, kind: part.kind, t: Math.random() * 6 };
  }
  return { group, anim };
}

export function animateDecor(anim, dt) {
  if (!anim) return;
  anim.t += dt;
  if (anim.kind === 'spin') anim.node.rotation.z -= dt * 0.9;
  else if (anim.kind === 'sway') anim.node.rotation.x = Math.sin(anim.t * 1.6) * 0.18;
}

export const DECOR_TYPES = Object.keys(MAKE);
