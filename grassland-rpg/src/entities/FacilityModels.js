import * as THREE from 'three';
import {
  Kit, baked, meshes, material, patch, bush, flower, rock, ivy, crate, barrel, lantern, banner, flagPole, flagCloth,
  gableRoof, plankBox, logPiece, beam, blockWall, emblem,
} from './structureKit.js';

// 부속 건물 모양 (시안 docs/art/incoming/concept_facilities.webp). 모두 풀밭 받침 위.
// parts 는 피격 번쩍임·파손 색 변화용, flame 은 흔들리는 불꽃(모닥불·대장간, 원점이 불 밑동)
export function createFacilityModel(model) {
  const B = BUILD[model] ? model : 'shop';
  const g = new THREE.Group();
  const { parts } = meshes(baked(`facility:${B}`, BUILD[B].kit), g);
  for (const f of BUILD[B].flags ?? []) g.add(flagCloth(...f));
  let flame = null;
  if (BUILD[B].flame) {
    flame = new THREE.Group();
    const [x, y, z, s] = BUILD[B].flame;
    const f1 = new THREE.Mesh(new THREE.ConeGeometry(0.24 * s, 0.62 * s, 6), material('flame'));
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.13 * s, 0.4 * s, 6), material('flameCore'));
    f1.position.y = 0.31 * s;
    f2.position.set(0, 0.22 * s, 0.04 * s);
    flame.add(f1, f2);
    flame.position.set(x, y, z);
    g.add(flame);
  }
  return { group: g, parts, flame };
}

// 도구들
function saw(k, p, ry = 0) {
  const s = new Kit();
  const blade = new THREE.Shape();
  blade.moveTo(0, 0);
  blade.lineTo(0.42, 0.02);
  blade.lineTo(0.42, 0.07);
  blade.lineTo(0, 0.12);
  blade.closePath();
  s.add(new THREE.ExtrudeGeometry(blade, { depth: 0.012, bevelEnabled: false }), 'steel', [0, 0, 0], [-Math.PI / 2, 0, 0]);
  s.box(0.12, 0.04, 0.09, 'woodDark', [-0.05, 0.01, -0.06]);
  k.put(s, p, [0, ry, 0]);
}
function hammer(k, p, ry = 0) {
  const h = new Kit();
  h.box(0.28, 0.03, 0.03, 'wood', [0, 0.02, 0]);
  h.box(0.06, 0.06, 0.13, 'iron', [0.14, 0.04, 0]);
  k.put(h, p, [0, ry, 0]);
}

const BUILD = {
  // 작업대: 두꺼운 상판 + 다리·가로대 + 공구함·톱·망치·천 + 깃대 + 통·토막·기댄 판자
  workbench: {
    flags: [[0.62, 0.96, -0.32, { h: 0.6, len: 0.34, ht: 0.2 }]],
    kit(k) {
      patch(k, 1.35, { seed: 201, flowers: 6, bushes: 6, rocks: 2 });
      for (const [x, z] of [[-0.68, -0.32], [0.68, -0.32], [-0.68, 0.32], [0.68, 0.32]]) k.box(0.13, 0.82, 0.13, 'woodDark', [x, 0.41, z]);
      for (const z of [-0.32, 0.32]) k.box(1.4, 0.07, 0.07, 'wood', [0, 0.22, z]);
      k.box(0.07, 0.07, 0.6, 'wood', [-0.68, 0.22, 0]);
      k.box(0.07, 0.07, 0.6, 'wood', [0.68, 0.22, 0]);
      for (let i = 0; i < 4; i++) k.box(1.6, 0.12, 0.22, i % 2 ? 'woodLight' : 'wood', [0, 0.86, -0.33 + i * 0.22]);
      for (const x of [-0.68, 0.68]) k.box(0.15, 0.05, 0.92, 'iron', [x, 0.8, 0]);
      // 공구함
      k.box(0.36, 0.18, 0.22, 'wood', [-0.5, 1.01, -0.2]);
      k.box(0.38, 0.03, 0.24, 'woodDark', [-0.5, 1.1, -0.2]);
      for (const [x, n] of [[-0.6, 'steel'], [-0.5, 'woodDark'], [-0.4, 'iron']]) k.box(0.04, 0.18, 0.04, n, [x, 1.17, -0.2]);
      saw(k, [-0.15, 0.93, 0.18], 0.2);
      hammer(k, [0.2, 0.93, -0.05], -0.5);
      k.box(0.24, 0.015, 0.2, 'cloth', [0.38, 0.93, 0.1]);
      k.box(0.2, 0.18, 0.012, 'cloth', [0.38, 0.84, 0.45]);
      // 깃대 (상판 뒤 오른쪽)
      k.cyl(0.03, 0.035, 0.6, 6, 'woodDark', [0.62, 1.22, -0.32]);
      k.ball(0.04, 'gold', [0.62, 1.55, -0.32]);
      // 아래·옆 소품
      barrel(k, [0.95, 0.04, 0.55], 0.15);
      for (let i = 0; i < 3; i++) k.box(0.04, 0.4, 0.04, 'woodLight', [0.92 + i * 0.04, 0.45, 0.55], [0, 0, 0.15 - i * 0.12]);
      k.cyl(0.16, 0.18, 0.2, 7, 'log', [0.35, 0.12, 0.7]);
      k.cyl(0.15, 0.15, 0.02, 7, 'logEnd', [0.35, 0.23, 0.7]);
      for (let i = 0; i < 2; i++) k.box(0.16, 0.6, 0.04, i ? 'woodLight' : 'wood', [-0.95 - i * 0.08, 0.32, 0.4], [0.3, 0, 0.25]);
      k.box(0.4, 0.22, 0.3, 'woodLight', [0.1, 0.15, 0]);
    },
  },

  // 창고: 판자 헛간(앞이 열림) + 초록 지붕 + 안에 상자·통 + 깃발 천 + 등불 + 밖에 상자
  storage: {
    kit(k) {
      patch(k, 1.75, { seed: 211, flowers: 7, bushes: 7, rocks: 2, path: true, skip: (a) => Math.abs(a - Math.PI / 2) < 0.5 });
      const W = 1.9;
      const D = 1.4;
      const H = 1.2;
      k.box(W + 0.1, 0.08, D + 0.1, 'woodDark', [0, 0.06, 0]);
      // 벽: 뒤·양옆 판자, 앞은 기둥만
      const n = 8;
      for (let i = 0; i < n; i++) k.box(W / n * 0.95, H, 0.08, i % 2 ? 'wood' : 'woodLight', [-W / 2 + W / n * (i + 0.5), H / 2 + 0.08, -D / 2]);
      for (const x of [-1, 1]) for (let i = 0; i < 6; i++) k.box(0.08, H, D / 6 * 0.95, i % 2 ? 'wood' : 'woodLight', [x * W / 2, H / 2 + 0.08, -D / 2 + D / 6 * (i + 0.5)]);
      for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.box(0.13, H + 0.1, 0.13, 'woodDark', [x * W / 2, (H + 0.1) / 2 + 0.06, z * D / 2]);
      k.box(W + 0.1, 0.12, 0.12, 'woodDark', [0, H + 0.1, D / 2]);
      for (const x of [-1, 1]) k.box(0.32, H, 0.06, 'woodLight', [x * (W / 2 - 0.18), H / 2 + 0.08, D / 2]);
      gableRoof(k, { w: W, d: D, h: 0.6, y: H + 0.12, rows: 3, names: ['greenRoof', 'greenRoofDark'], over: 0.18, wall: 'wood', thick: 0.1, ridge: 'woodDark' });
      k.ball(0.14, 'moss', [0.6, H + 0.55, 0.2], [1.5, 0.4, 1]);
      k.ball(0.12, 'moss', [-0.5, H + 0.38, -0.45], [1.4, 0.4, 1]);
      // 안: 상자·통 더미
      crate(k, [-0.45, 0.1, -0.2], 0.42, 0.1);
      crate(k, [-0.45, 0.52, -0.25], 0.32, -0.2);
      crate(k, [0.05, 0.1, -0.35], 0.36, 0.3);
      barrel(k, [0.5, 0.1, -0.2], 0.2);
      barrel(k, [0.25, 0.1, 0.2], 0.17);
      // 밖
      crate(k, [0.85, 0.04, 0.95], 0.38, 0.35);
      barrel(k, [-1.15, 0.04, 0.55], 0.17);
      banner(k, [-0.72, 1.1, D / 2 + 0.06], { w: 0.24, h: 0.38 });
      lantern(k, [W / 2 + 0.16, 0.95, 0.5], true);
      k.box(0.2, 0.03, 0.03, 'ironDark', [W / 2 + 0.08, 1.18, 0.5]);
      fence(k);
    },
  },

  // 상점: 판자 가판대 + 빨강·크림 줄무늬 차양(물결 끝) + 옆 기둥에 매단 깃발 천 + 삼각 깃발 줄 + 과일 상자·칠판
  shop: {
    kit(k) {
      patch(k, 1.75, { seed: 221, flowers: 8, bushes: 6, rocks: 2 });
      plankBox(k, { w: 1.8, h: 0.85, d: 0.7, p: [0, 0.04, 0.15], names: ['wood', 'woodLight'], n: 7 });
      k.box(1.95, 0.08, 0.84, 'woodDark', [0, 0.92, 0.18]);
      for (const x of [-0.88, 0.88]) {
        k.box(0.1, 2.0, 0.1, 'woodDark', [x, 1.0, -0.25]);
        k.box(0.09, 1.0, 0.09, 'wood', [x, 1.4, 0.48]);
      }
      // 차양: 줄무늬 판 6장 + 물결 끝
      const n = 6;
      for (let i = 0; i < n; i++) {
        const x = -0.95 + (1.9 / n) * (i + 0.5);
        const name = i % 2 ? 'cream' : 'roof';
        k.box(1.9 / n, 0.05, 1.0, name, [x, 1.98, 0.15], [0.42, 0, 0]);
        k.add(new THREE.CylinderGeometry(1.9 / n / 2, 1.9 / n / 2, 0.05, 8, 1, false, 0, Math.PI), name, [x, 1.775, 0.61], [Math.PI / 2 - 0.42, Math.PI / 2, 0], [1, 1, 1]);
      }
      k.box(1.98, 0.06, 0.08, 'woodDark', [0, 2.2, -0.3]);
      // 삼각 깃발 줄
      beam(k, [-0.88, 1.55, 0.5], [0.88, 1.55, 0.5], 0.01, 'rope');
      for (let i = 0; i < 7; i++) {
        const x = -0.72 + i * 0.24;
        k.cone(0.06, 0.13, 3, ['red', 'cream', 'leafLight', 'pollen'][i % 4], [x, 1.48, 0.5], [Math.PI, 0, 0], [1, 1, 0.2]);
      }
      // 옆 기둥 + 매단 깃발 천
      k.box(0.1, 2.3, 0.1, 'woodDark', [-1.12, 1.15, 0.45]);
      k.box(0.5, 0.08, 0.08, 'woodDark', [-0.92, 2.25, 0.45]);
      banner(k, [-0.86, 2.18, 0.45], { w: 0.26, h: 0.46, ry: Math.PI / 2 });
      // 진열: 물약·사과 바구니
      for (const [x, n] of [[-0.6, 'potionPink'], [-0.45, 'potionGreen'], [0.55, 'potionBlue']]) {
        k.ball(0.07, n, [x, 1.03, 0.25], 1, 1);
        k.cyl(0.025, 0.025, 0.06, 5, 'woodLight', [x, 1.12, 0.25]);
      }
      k.cyl(0.16, 0.12, 0.1, 8, 'wood', [0.05, 1.01, 0.25]);
      for (const [x, z] of [[-0.05, 0.22], [0.06, 0.3], [0.12, 0.2], [0.02, 0.15]]) k.ball(0.06, 'apple', [x, 1.09, z], 1, 1);
      // 앞 과일 상자 + 칠판 간판
      crate(k, [-0.75, 0.04, 0.85], 0.32, 0.2);
      for (const [x, z] of [[-0.8, 0.8], [-0.7, 0.9], [-0.76, 0.92]]) k.ball(0.07, 'apple', [x, 0.42, z], 1, 1);
      const sign = new Kit();
      sign.box(0.42, 0.5, 0.04, 'chalk', [0, 0.45, 0]);
      sign.box(0.48, 0.05, 0.06, 'wood', [0, 0.72, 0]);
      for (const x of [-0.22, 0.22]) sign.box(0.04, 0.75, 0.05, 'wood', [x, 0.37, 0]);
      emblem(sign, [0, 0.47, 0.03], 0.18, 0, 'cream');
      k.put(sign, [0.85, 0.04, 0.9], [-0.15, -0.3, 0]);
      barrel(k, [1.15, 0.04, 0.2], 0.15, 'soil');
      for (let i = 0; i < 3; i++) flower(k, 1.15 + (i - 1) * 0.07, 0.2 + (i % 2) * 0.05, 'petal', 0.38, 1.2);
    },
  },

  // 모닥불: 돌 고리 + 장작 + 불꽃(움직임) + 통나무 의자 셋 + 물통
  campfire: {
    flame: [0, 0.12, 0, 1],
    kit(k) {
      patch(k, 1.45, { seed: 231, flowers: 7, bushes: 5, rocks: 1 });
      k.cyl(0.62, 0.66, 0.06, 12, 'sand', [0, 0.05, 0]);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        k.add(new THREE.DodecahedronGeometry(0.15, 0), i % 2 ? 'stone' : 'stoneLight', [Math.cos(a) * 0.48, 0.12, Math.sin(a) * 0.48], [i, i * 2, 0], [1.1, 0.75, 1]);
      }
      for (let i = 0; i < 3; i++) logPiece(k, [0, 0.13, 0], 0.62, 0.07, [0, (i / 3) * Math.PI, Math.PI / 2]);
      k.ball(0.18, 'ember', [0, 0.1, 0], [1, 0.4, 1]);
      for (const [a, ry] of [[Math.PI * 0.15, 0.3], [Math.PI * 0.85, -0.3], [Math.PI * 1.5, 0]]) {
        const x = Math.cos(a) * 1.0;
        const z = Math.sin(a) * 1.0;
        logPiece(k, [x, 0.2, z], 0.75, 0.17, [0, -a + Math.PI / 2, Math.PI / 2]);
        for (const s of [-1, 1]) k.box(0.08, 0.14, 0.2, 'woodDark', [x + Math.cos(a + Math.PI / 2) * s * 0.25, 0.07, z + Math.sin(a + Math.PI / 2) * s * 0.25], [0, -a, 0]);
      }
      barrel(k, [-0.75, 0.04, -0.85], 0.14);
      k.cyl(0.08, 0.06, 0.14, 6, 'iron', [0.95, 0.12, -0.7]);
    },
  },

  // 텃밭: 돌·나무 높은 화단 + 흙 + 모서리 기둥 + 깃발 천 + 씨앗 자루 + 물뿌리개 (작물은 Facility 가 y 0.25 에 올린다)
  garden: {
    kit(k) {
      patch(k, 1.6, { seed: 241, flowers: 7, bushes: 6, rocks: 1 });
      blockWall(k, { w: 2.0, h: 0.14, d: 0.12, p: [0, 0, 0.78], rows: 1, bw: 0.32 });
      blockWall(k, { w: 2.0, h: 0.14, d: 0.12, p: [0, 0, -0.78], rows: 1, bw: 0.32 });
      for (const x of [-1, 1]) blockWall(k, { w: 1.56, h: 0.14, d: 0.12, p: [x * 0.98, 0, 0], rows: 1, bw: 0.32, ry: Math.PI / 2 });
      for (const z of [-0.78, 0.78]) k.box(2.05, 0.1, 0.12, 'wood', [0, 0.19, z]);
      for (const x of [-0.98, 0.98]) k.box(0.12, 0.1, 1.6, 'woodLight', [x, 0.19, 0]);
      for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.box(0.14, 0.34, 0.14, 'woodDark', [x * 0.98, 0.17, z * 0.78]);
      k.box(1.86, 0.2, 1.46, 'soil', [0, 0.12, 0]);
      for (const z of [-0.3, 0.3]) k.box(1.7, 0.04, 0.3, 'soil', [0, 0.23, z]);
      // 뒤 깃발 틀
      for (const x of [-0.75, -0.35]) k.box(0.08, 0.95, 0.08, 'woodDark', [x, 0.5, -0.88]);
      k.box(0.55, 0.07, 0.07, 'wood', [-0.55, 0.92, -0.88]);
      banner(k, [-0.55, 0.88, -0.84], { w: 0.24, h: 0.36 });
      // 씨앗 자루 + 물뿌리개
      k.ball(0.17, 'canvas', [0.7, 0.18, 1.05], [1, 1.1, 1]);
      k.cone(0.08, 0.12, 6, 'canvas', [0.7, 0.38, 1.05]);
      k.add(new THREE.TorusGeometry(0.06, 0.015, 3, 8), 'rope', [0.7, 0.34, 1.05], [Math.PI / 2, 0, 0]);
      emblem(k, [0.7, 0.2, 1.21], 0.12, 0, 'woodDark');
      k.cyl(0.11, 0.12, 0.2, 8, 'water', [1.1, 0.14, 0.7]);
      beam(k, [1.18, 0.15, 0.7], [1.38, 0.28, 0.7], 0.02, 'water');
      k.add(new THREE.TorusGeometry(0.07, 0.015, 3, 8, Math.PI), 'water', [1.04, 0.25, 0.7]);
    },
  },

  // 대장간: 돌 화덕(아치 입구·불) + 굴뚝 연기 + 나무 지붕 틀 + 모루·토막 + 물통·상자 + 깃발 천
  forge: {
    flame: [-0.15, 0.22, 0.42, 0.85],
    kit(k) {
      patch(k, 1.8, { seed: 251, flowers: 6, bushes: 6, rocks: 2 });
      blockWall(k, { w: 1.4, h: 1.0, d: 1.0, p: [-0.15, 0, -0.05], rows: 4, bw: 0.32, seed: 9 });
      // 아치 입구 (어두운 안 + 돌 테)
      k.box(0.6, 0.44, 0.06, 'coal', [-0.15, 0.3, 0.46]);
      k.cyl(0.3, 0.3, 0.06, 10, 'coal', [-0.15, 0.52, 0.46], [Math.PI / 2, 0, 0]);
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI;
        k.box(0.14, 0.12, 0.12, i % 2 ? 'stoneLight' : 'stone', [-0.15 + Math.cos(a) * 0.38, 0.52 + Math.sin(a) * 0.38, 0.48], [0, 0, a - Math.PI / 2]);
      }
      k.ball(0.22, 'ember', [-0.15, 0.2, 0.36], [1.3, 0.4, 0.8]);
      // 둥근 지붕 돌 + 굴뚝
      k.add(new THREE.SphereGeometry(0.72, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), 'stone', [-0.15, 0.98, -0.05], [0, 0, 0], [1, 0.5, 0.75]);
      const ch = new Kit();
      blockWall(ch, { w: 0.4, h: 0.8, d: 0.4, rows: 3, bw: 0.2 });
      ch.box(0.48, 0.08, 0.48, 'stoneDark', [0, 0.84, 0]);
      ch.box(0.28, 0.03, 0.28, 'coal', [0, 0.89, 0]);
      k.put(ch, [-0.15, 1.15, -0.2]);
      for (const [x, y, s] of [[0, 2.3, 0.15], [0.08, 2.52, 0.12], [0.02, 2.72, 0.09]]) k.ball(s, 'smoke', [-0.15 + x, y, -0.2], 1, 1);
      // 나무 지붕 틀
      for (const x of [-1, 1]) {
        k.box(0.1, 1.5, 0.1, 'woodDark', [-0.15 + x * 0.9, 0.75, 0.55]);
        beam(k, [-0.15 + x * 0.9, 1.45, 0.55], [-0.15 + x * 0.25, 1.75, 0.0], 0.05, 'wood');
      }
      k.box(1.9, 0.1, 0.1, 'wood', [-0.15, 1.45, 0.55]);
      banner(k, [-0.82, 1.32, 0.62], { w: 0.22, h: 0.36 });
      // 모루 + 토막
      k.cyl(0.18, 0.2, 0.4, 7, 'log', [0.75, 0.24, 0.55]);
      k.cyl(0.17, 0.17, 0.02, 7, 'logEnd', [0.75, 0.45, 0.55]);
      const an = new Kit();
      an.box(0.2, 0.1, 0.14, 'ironDark', [0, 0.05, 0]);
      an.box(0.12, 0.1, 0.1, 'ironDark', [0, 0.15, 0]);
      an.box(0.36, 0.1, 0.16, 'ironDark', [0.03, 0.25, 0]);
      an.cone(0.07, 0.18, 4, 'ironDark', [0.28, 0.27, 0], [0, 0, -Math.PI / 2]);
      k.put(an, [0.75, 0.46, 0.55], [0, 0.4, 0]);
      hammer(k, [0.72, 0.76, 0.5], 1.2);
      barrel(k, [0.9, 0.04, -0.2], 0.17);
      k.cyl(0.15, 0.15, 0.02, 9, 'water', [0.9, 0.42, -0.2]);
      crate(k, [-1.05, 0.04, 0.75], 0.3, 0.3);
      for (const [x, z] of [[-1.1, 0.72], [-1.0, 0.8]]) k.box(0.1, 0.06, 0.1, 'coal', [x, 0.37, z]);
      k.cyl(0.08, 0.07, 0.14, 7, 'wood', [0.2, 0.11, 0.85]);
    },
  },

  // 게시판: 기둥 둘 + 판자 판 + 종이 + 초록 기와 지붕 + 등불 + 깃대 + 통
  board: {
    flags: [[0.55, 1.95, -0.05, { h: 0.55, len: 0.32, ht: 0.2 }]],
    kit(k) {
      patch(k, 1.25, { seed: 261, flowers: 7, bushes: 5, rocks: 1, path: true });
      for (const x of [-0.62, 0.62]) {
        k.box(0.12, 1.8, 0.12, 'woodDark', [x, 0.9, 0]);
        k.box(0.2, 0.1, 0.2, 'stoneDark', [x, 0.05, 0]);
      }
      for (let i = 0; i < 4; i++) k.box(1.16, 0.2, 0.06, i % 2 ? 'wood' : 'woodLight', [0, 0.9 + i * 0.2, 0.02]);
      k.box(1.3, 0.07, 0.1, 'woodDark', [0, 0.78, 0.04]);
      k.box(1.3, 0.07, 0.1, 'woodDark', [0, 1.7, 0.04]);
      for (const [x, y, w, h, r] of [[-0.35, 1.3, 0.3, 0.4, 0.05], [0.05, 1.38, 0.26, 0.3, -0.06], [0.38, 1.25, 0.24, 0.36, 0.08], [0.05, 1.03, 0.3, 0.2, 0]]) {
        k.box(w, h, 0.012, 'paper', [x, y, 0.06], [0, 0, r]);
        for (let j = 0; j < 3; j++) k.box(w * 0.6, 0.015, 0.014, 'canvasDark', [x, y + h * 0.25 - j * 0.07, 0.068], [0, 0, r]);
        k.ball(0.02, 'red', [x, y + h / 2 - 0.03, 0.075]);
      }
      gableRoof(k, { w: 1.4, d: 0.55, h: 0.3, y: 1.8, rows: 2, names: ['slate', 'greenRoofDark'], over: 0.12, thick: 0.08, ridge: 'woodDark' });
      k.cyl(0.03, 0.035, 0.55, 6, 'woodDark', [0.55, 2.22, -0.05]);
      k.ball(0.04, 'gold', [0.55, 2.52, -0.05]);
      k.box(0.24, 0.04, 0.04, 'ironDark', [0.74, 1.55, 0.1]);
      lantern(k, [0.84, 1.3, 0.1], true);
      barrel(k, [0.55, 0.04, 0.5], 0.15);
      flower(k, -0.55, 0.45, 'petal', 0.08, 1.6);
    },
  },
};

function fence(k) {
  const f = new Kit();
  for (let i = 0; i < 3; i++) f.box(0.07, 0.4, 0.07, 'wood', [i * 0.3, 0.2, 0]);
  for (const y of [0.15, 0.3]) f.box(0.66, 0.05, 0.04, 'woodLight', [0.3, y, 0.04]);
  k.put(f, [-1.25, 0.04, 0.95], [0, 0.4, 0]);
}
