import * as THREE from 'three';
import {
  Kit, baked, meshes, patch, bush, flower, rock, ivy, crate, barrel, lantern, banner, flagPole, flagCloth,
  brickTower, crenels, beam, blockWall, emblem,
} from './structureKit.js';

// 포탑 모양 (시안 docs/art/incoming/concept_turrets.webp). 모두 풀밭 받침 위:
// 나무 활 = 나무 망루 + 사다리 + 큰 나무 활 / 석궁 = 돌탑 + 쇠 장식 석궁 + 화살통 / 총 = 쇠테 두른 나무통 + 황동 포신
// 대포 = 톱니 돌탑 + 무쇠 대포 + 포탄 상자 / 독침 = 빨간 버섯(머리) + 줄기 집 + 물약 병 / 서리 = 눈 덮인 돌탑 + 얼음 결정
// head 는 조준할 때 도는 부분, parts 는 피격·파손 때 색을 바꾸는 메시.
// 레벨은 색이 아니라 구조로 자란다: Lv2 청동 테 + 깃발 천 → Lv3 쇠 보강판·징 → Lv4 깃대·두 번째 테·소품 → Lv5 금 테 + 금관
export function createTurretModel(def) {
  const type = TYPES[def.model] ? def.model : 'bow';
  const T = TYPES[type];
  const g = new THREE.Group();
  const parts = [];
  const use = (key, fn, parent) => parts.push(...meshes(baked(`turret:${type}:${key}`, fn), parent).parts);

  use('base', (k) => { patch(k, T.patch, { seed: T.seed, flowers: T.snow ? 0 : 6, bushes: 6, rocks: 2, snow: T.snow }); T.base(k); }, g);
  const head = new THREE.Group();
  head.position.y = T.headY;
  use('head', (k) => T.head(k), head);
  g.add(head);

  // 레벨 장식 (stars[0]=Lv2 … stars[3]=Lv5) — 켜지면 그대로 쌓인다
  const stars = [];
  for (const lv of [2, 3, 4, 5]) {
    const grp = new THREE.Group();
    grp.visible = false;
    use(`lv${lv}`, (k) => (T.levels?.[lv] ?? LEVELS[lv])(k, T), grp);
    if (lv === 4) grp.add(flagCloth(...T.flag, { h: 0.95, len: 0.42, ht: 0.25 }));
    g.add(grp);
    stars.push(grp);
  }
  const crown = new THREE.Group();
  meshes(baked('turret:crown', crownKit), crown);
  crown.position.set(0, T.crownY, T.crownZ ?? 0);
  crown.visible = false;
  head.add(crown);

  return { group: g, head, parts, stars, crown };
}

function crownKit(k) {
  k.cyl(0.22, 0.24, 0.12, 10, 'gold', [0, 0.06, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    k.cone(0.07, 0.17, 4, 'gold', [Math.cos(a) * 0.19, 0.2, Math.sin(a) * 0.19]);
    k.ball(0.03, 'gold', [Math.cos(a) * 0.19, 0.3, Math.sin(a) * 0.19]);
  }
  k.add(new THREE.OctahedronGeometry(0.05, 0), 'jewel', [0, 0.07, 0.23]);
}

// 둘레 고리 (테)
const ring = (k, r, y, name, tube = 0.04) => k.add(new THREE.TorusGeometry(r, tube, 4, 18), name, [0, y, 0], [Math.PI / 2, 0, 0]);

// 기본 레벨 장식. T.rimY·rimR = 받침 위 테 자리, T.midY·midR = 보강판 자리, T.lowR = 아래 테, T.flag = 깃대 자리
const LEVELS = {
  2(k, T) {
    ring(k, T.rimR + 0.03, T.rimY, 'bronze');
    if (!T.banner) banner(k, [0, T.rimY - 0.08, T.midR + 0.08], { w: 0.26, h: 0.4 });
  },
  3(k, T) {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(a) * (T.midR + 0.04);
      const z = Math.sin(a) * (T.midR + 0.04);
      k.box(0.22, 0.32, 0.04, 'iron', [x, T.midY, z], [0, -a + Math.PI / 2, 0]);
      for (const dy of [-0.1, 0.1]) k.add(new THREE.OctahedronGeometry(0.035, 0), 'steel', [x * 1.08, T.midY + dy, z * 1.08]);
    }
  },
  4(k, T) {
    ring(k, T.lowR + 0.04, 0.16, 'iron', 0.05);
    flagPole(k, ...T.flag, { h: 0.95 });
    T.prop4?.(k);
  },
  5(k, T) {
    ring(k, T.rimR + 0.06, T.rimY + 0.06, 'gold', 0.045);
  },
};

const TYPES = {
  // 나무 활: 다리 넷 나무 망루 + 판자 바닥 + 사다리 + 깃발 천
  bow: {
    patch: 0.95, seed: 101, headY: 1.2, crownY: 0.1, crownZ: -0.3, rimY: 0.98, rimR: 0.56, midY: 0.62, midR: 0.42, lowR: 0.5, banner: true,
    flag: [-0.42, 1.05, -0.42],
    base(k) {
      for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        beam(k, [x * 0.46, 0.04, z * 0.46], [x * 0.34, 1.0, z * 0.34], 0.06, 'wood', 5);
        k.box(0.16, 0.08, 0.16, 'woodDark', [x * 0.45, 0.06, z * 0.45]);
      }
      for (const s of [-1, 1]) {
        beam(k, [-0.44, 0.15, s * 0.42], [0.36, 0.85, s * 0.36], 0.03, 'woodDark');
        beam(k, [0.44, 0.15, s * 0.42], [-0.36, 0.85, s * 0.36], 0.03, 'woodDark');
        beam(k, [s * 0.42, 0.15, -0.44], [s * 0.36, 0.85, 0.36], 0.03, 'woodDark');
      }
      k.box(0.86, 0.1, 0.86, 'wood', [0, 0.97, 0]);
      for (let i = 0; i < 4; i++) k.box(0.2, 0.03, 0.86, i % 2 ? 'woodLight' : 'wood', [-0.32 + i * 0.213, 1.03, 0]);
      for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.box(0.07, 0.24, 0.07, 'woodDark', [x * 0.39, 1.14, z * 0.39]);
      for (const s of [-1, 1]) {
        k.box(0.84, 0.05, 0.05, 'wood', [0, 1.2, s * 0.39]);
        k.box(0.05, 0.05, 0.84, 'wood', [s * 0.39, 1.2, 0]);
      }
      // 사다리 (앞 오른쪽)
      for (const x of [0.14, 0.38]) beam(k, [x, 0.04, 0.78], [x, 0.98, 0.42], 0.025, 'woodLight');
      for (let i = 1; i < 5; i++) k.box(0.27, 0.03, 0.04, 'wood', [0.26, i * 0.19, 0.78 - i * 0.072]);
      banner(k, [-0.15, 0.92, 0.45], { w: 0.26, h: 0.42 });
      k.box(0.1, 0.1, 0.1, 'rope', [0.34, 0.6, 0.34]);
    },
    head(k) {
      k.cyl(0.26, 0.28, 0.08, 10, 'woodDark', [0, -0.12, 0]);
      k.box(0.12, 0.14, 0.95, 'wood', [0, 0, 0.05]);
      k.box(0.16, 0.08, 0.2, 'woodDark', [0, -0.03, -0.38]);
      // 휜 나무 활 (두 갈래) + 강철 끝 + 시위
      for (const s of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          const t0 = i / 4;
          const t1 = (i + 1) / 4;
          const p = (t) => [s * (0.04 + t * 0.5), 0.02, 0.38 - t * t * 0.28];
          beam(k, p(t0), p(t1), 0.04 - i * 0.004, i % 2 ? 'woodDark' : 'wood', 5);
        }
        k.cone(0.035, 0.1, 4, 'steel', [s * 0.56, 0.02, 0.08], [0, 0, -s * Math.PI / 2]);
        beam(k, [s * 0.54, 0.02, 0.1], [0, 0.02, -0.12], 0.008, 'rope');
      }
      k.box(0.03, 0.03, 0.75, 'woodLight', [0, 0.09, 0.15]);
      k.cone(0.045, 0.14, 4, 'steel', [0, 0.09, 0.58], [Math.PI / 2, 0, 0]);
      for (const s of [-1, 1]) k.box(0.02, 0.07, 0.12, 'red', [s * 0.03, 0.12, -0.18]);
      k.add(new THREE.TorusGeometry(0.075, 0.02, 3, 8), 'rope', [0, 0, 0.3], [0, 0, 0]);
    },
    levels: {
      3(k) {
        for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          for (const y of [0.35, 0.92]) k.box(0.15, 0.08, 0.15, 'iron', [x * (0.45 - y * 0.12), y, z * (0.45 - y * 0.12)]);
          k.add(new THREE.OctahedronGeometry(0.035, 0), 'steel', [x * 0.43, 0.97, z * 0.43]);
        }
      },
      2(k) {
        k.box(0.92, 0.06, 0.92, 'bronze', [0, 0.9, 0]);
      },
      5(k) {
        for (const s of [-1, 1]) {
          k.box(0.9, 0.05, 0.05, 'gold', [0, 1.27, s * 0.39]);
          k.box(0.05, 0.05, 0.9, 'gold', [s * 0.39, 1.27, 0]);
        }
      },
    },
    prop4(k) { lantern(k, [0.46, 0.9, -0.1]); k.box(0.2, 0.03, 0.03, 'ironDark', [0.4, 1.12, -0.1]); },
  },

  // 석궁: 돌탑 + 나무 문 + 화살통
  crossbow: {
    patch: 1.05, seed: 113, headY: 1.32, crownY: 0.16, crownZ: -0.36, rimY: 1.08, rimR: 0.64, midY: 0.6, midR: 0.64, lowR: 0.66,
    flag: [-0.5, 1.08, -0.35],
    base(k) {
      brickTower(k, { r: 0.64, rTop: 0.58, h: 1.0, rows: 4, n: 10, seed: 7 });
      k.cyl(0.66, 0.64, 0.14, 12, 'woodDark', [0, 1.05, 0]);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        k.box(0.2, 0.05, 0.1, i % 2 ? 'wood' : 'woodLight', [Math.cos(a) * 0.62, 1.12, Math.sin(a) * 0.62], [0, -a, 0]);
      }
      const d = new Kit();
      d.box(0.34, 0.5, 0.06, 'door', [0, 0.25, 0]);
      for (const x of [-0.08, 0.08]) d.box(0.02, 0.5, 0.07, 'woodDark', [x, 0.25, 0.005]);
      d.cyl(0.17, 0.17, 0.06, 8, 'door', [0, 0.5, 0], [Math.PI / 2, 0, 0]);
      d.box(0.3, 0.035, 0.08, 'iron', [0, 0.38, 0.01]);
      k.put(d, [0.2, 0.02, 0.6], [0, 0.3, 0]);
      // 화살통
      const q = new Kit();
      q.cyl(0.11, 0.09, 0.42, 7, 'woodDark', [0, 0.21, 0]);
      q.add(new THREE.TorusGeometry(0.11, 0.02, 3, 8), 'iron', [0, 0.3, 0], [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 3; i++) {
        q.cyl(0.012, 0.012, 0.4, 3, 'woodLight', [-0.04 + i * 0.04, 0.5, 0]);
        q.cone(0.03, 0.08, 4, 'steel', [-0.04 + i * 0.04, 0.73, 0]);
      }
      k.put(q, [0.72, 0.04, 0.22], [0.15, 0, -0.15]);
      ivy(k, [[-0.45, 0.7, 0.45, 3], [-0.62, 0.45, -0.1, 2]]);
    },
    head(k) {
      k.cyl(0.3, 0.32, 0.1, 10, 'woodDark', [0, -0.14, 0]);
      k.box(0.2, 0.18, 1.05, 'wood', [0, 0, 0]);
      k.box(0.24, 0.05, 0.3, 'iron', [0, 0.1, -0.3]);
      for (const s of [-1, 1]) {
        k.box(0.04, 0.22, 0.24, 'iron', [s * 0.12, 0.02, 0.32]);
        for (let i = 0; i < 4; i++) {
          const p = (t) => [s * (0.06 + t * 0.62), 0.04, 0.38 - t * t * 0.22];
          beam(k, p(i / 4), p((i + 1) / 4), 0.045 - i * 0.005, 'steel', 5);
        }
        k.ball(0.05, 'iron', [s * 0.68, 0.04, 0.16]);
        beam(k, [s * 0.66, 0.04, 0.17], [0, 0.04, -0.05], 0.01, 'rope');
      }
      k.box(0.05, 0.05, 0.86, 'woodDark', [0, 0.13, 0.26]);
      k.cone(0.065, 0.18, 4, 'steel', [0, 0.13, 0.76], [Math.PI / 2, 0, 0]);
      k.box(0.12, 0.12, 0.1, 'iron', [0, 0.05, -0.5]);
      for (const z of [-0.2, 0.15]) k.add(new THREE.OctahedronGeometry(0.03, 0), 'steel', [0.11, 0.07, z]);
    },
    prop4(k) { banner(k, [-0.45, 0.85, 0.42], { w: 0.24, h: 0.38, ry: -0.8 }); },
  },

  // 총: 돌 받침 고리 + 쇠테 두른 나무통 + 황동 포신
  gun: {
    patch: 1.0, seed: 127, headY: 1.25, crownY: 0.3, crownZ: -0.2, rimY: 0.98, rimR: 0.56, midY: 0.55, midR: 0.6, lowR: 0.7,
    flag: [-0.48, 1.0, -0.4],
    base(k) {
      blockRing(k, 0.66, 0.24, 9);
      // 나무통 (세로 판자 + 쇠테)
      const n = 12;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        k.box(0.3, 0.74, 0.08, i % 2 ? 'wood' : 'woodLight', [Math.cos(a) * 0.54, 0.6, Math.sin(a) * 0.54], [0, -a + Math.PI / 2, 0]);
      }
      k.cyl(0.52, 0.52, 0.72, 12, 'woodDark', [0, 0.6, 0]);
      for (const y of [0.32, 0.88]) ring(k, 0.58, y, 'iron', 0.04);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        k.add(new THREE.OctahedronGeometry(0.03, 0), 'steel', [Math.cos(a) * 0.61, 0.88, Math.sin(a) * 0.61]);
      }
      k.cyl(0.56, 0.56, 0.06, 12, 'brass', [0, 0.98, 0]);
    },
    head(k) {
      k.cyl(0.32, 0.36, 0.14, 10, 'woodDark', [0, -0.18, 0]);
      for (const s of [-1, 1]) {
        k.box(0.08, 0.36, 0.34, 'brass', [s * 0.25, 0.02, 0]);
        k.cyl(0.08, 0.08, 0.06, 8, 'iron', [s * 0.3, 0.06, 0], [0, 0, Math.PI / 2]);
      }
      const b = new Kit();
      b.cyl(0.17, 0.2, 0.8, 12, 'brass', [0, 0, 0]);
      b.cyl(0.24, 0.22, 0.12, 12, 'brass', [0, 0.42, 0]);
      b.cyl(0.13, 0.13, 0.13, 10, 'ironDark', [0, 0.44, 0]);
      for (const y of [-0.22, 0.12]) b.add(new THREE.TorusGeometry(0.2, 0.03, 4, 12), 'iron', [0, y, 0], [Math.PI / 2, 0, 0]);
      b.ball(0.2, 'brass', [0, -0.4, 0], [1, 0.6, 1]);
      b.ball(0.06, 'brass', [0, -0.55, 0]);
      k.put(b, [0, 0.08, 0.12], [Math.PI / 2 - 0.12, 0, 0]);
      k.box(0.18, 0.2, 0.26, 'woodDark', [0.34, -0.06, -0.25]);
      k.box(0.2, 0.04, 0.28, 'iron', [0.34, 0.05, -0.25]);
    },
    prop4(k) { crate(k, [0.62, 0.04, 0.4], 0.3, 0.4); },
  },

  // 대포: 톱니 돌탑 + 나무 포가 + 무쇠 대포, 옆에 포탄 상자
  cannon: {
    patch: 1.2, seed: 139, headY: 1.12, crownY: 0.26, crownZ: -0.36, rimY: 0.82, rimR: 0.78, midY: 0.45, midR: 0.78, lowR: 0.8, banner: true,
    flag: [-0.6, 1.08, -0.45],
    base(k) {
      brickTower(k, { r: 0.8, rTop: 0.76, h: 0.82, rows: 4, n: 12, seed: 11 });
      crenels(k, { r: 0.8, y: 0.82, n: 10, w: 0.24, h: 0.22, d: 0.16 });
      banner(k, [0, 0.76, 0.86], { w: 0.28, h: 0.44 });
      const c = new Kit();
      crate(c, [0, 0, 0], 0.38);
      for (const [x, z] of [[-0.08, -0.08], [0.09, -0.07], [-0.07, 0.09], [0.08, 0.08]]) c.ball(0.09, 'ironDark', [x, 0.42, z], 1, 1);
      c.ball(0.09, 'ironDark', [0, 0.54, 0], 1, 1);
      k.put(c, [0.82, 0.04, 0.55], [0, 0.5, 0]);
      ivy(k, [[-0.6, 0.6, 0.55, 3], [0.7, 0.5, -0.4, 2]]);
    },
    head(k) {
      k.cyl(0.42, 0.44, 0.08, 12, 'woodDark', [0, -0.26, 0]);
      for (const s of [-1, 1]) {
        k.box(0.08, 0.3, 0.6, 'wood', [s * 0.24, -0.08, 0]);
        k.cyl(0.14, 0.14, 0.06, 8, 'woodDark', [s * 0.3, -0.12, 0.12], [0, 0, Math.PI / 2]);
        k.cyl(0.04, 0.04, 0.08, 6, 'iron', [s * 0.33, -0.12, 0.12], [0, 0, Math.PI / 2]);
      }
      const b = new Kit();
      b.cyl(0.2, 0.27, 1.0, 12, 'ironDark', [0, 0, 0]);
      b.add(new THREE.TorusGeometry(0.21, 0.06, 5, 12), 'iron', [0, 0.5, 0], [Math.PI / 2, 0, 0]);
      b.cyl(0.13, 0.13, 0.04, 10, 'coal', [0, 0.53, 0]);
      for (const y of [-0.25, 0.12]) b.add(new THREE.TorusGeometry(0.255 - y * 0.06, 0.035, 4, 12), 'iron', [0, y, 0], [Math.PI / 2, 0, 0]);
      b.ball(0.26, 'ironDark', [0, -0.5, 0], [1, 0.7, 1]);
      b.ball(0.07, 'iron', [0, -0.7, 0]);
      k.put(b, [0, 0.12, 0.18], [Math.PI / 2 - 0.35, 0, 0]);
    },
    prop4(k) { for (const [x, z] of [[-0.75, 0.6], [-0.62, 0.72]]) k.ball(0.1, 'ironDark', [x, 0.13, z], 1, 1); },
  },

  // 독침: 줄기 집(문·창) + 물약 병·통. 머리 = 빨간 점박이 버섯 갓 + 황동 대롱 + 초록 포자
  poison: {
    patch: 1.0, seed: 151, headY: 1.28, crownY: 0.42, crownZ: 0, rimY: 0.95, rimR: 0.38, midY: 0.5, midR: 0.43, lowR: 0.48,
    flag: [-0.46, 0.98, -0.36],
    base(k) {
      const prof = [];
      for (let i = 0; i <= 6; i++) {
        const t = i / 6;
        prof.push(new THREE.Vector2(0.46 - t * 0.14 + Math.sin(t * Math.PI) * 0.03, t * 1.2));
      }
      k.add(new THREE.LatheGeometry(prof, 12), 'stem', [0, 0, 0]);
      k.cyl(0.47, 0.49, 0.12, 12, 'stoneDark', [0, 0.06, 0]);
      const d = new Kit();
      d.box(0.24, 0.36, 0.06, 'door', [0, 0.18, 0]);
      d.cyl(0.12, 0.12, 0.06, 8, 'door', [0, 0.36, 0], [Math.PI / 2, 0, 0]);
      d.ball(0.025, 'brass', [0.07, 0.2, 0.04]);
      k.put(d, [0, 0.08, 0.44], [-0.05, 0, 0]);
      k.cyl(0.08, 0.08, 0.04, 8, 'woodDark', [-0.28, 0.72, 0.31], [Math.PI / 2, 0, 0.7]);
      k.cyl(0.06, 0.06, 0.05, 8, 'window', [-0.28, 0.72, 0.32], [Math.PI / 2, 0, 0.7]);
      ivy(k, [[0.3, 0.9, 0.3, 3], [-0.38, 0.4, 0.2, 2]], 0.08);
      // 물약 병
      const bottle = (x, z, name, s = 1) => {
        k.ball(0.11 * s, name, [x, 0.13 * s, z], 1, 1);
        k.cyl(0.035 * s, 0.04 * s, 0.1 * s, 6, name, [x, 0.27 * s, z]);
        k.cyl(0.03 * s, 0.03 * s, 0.05 * s, 5, 'woodLight', [x, 0.34 * s, z]);
      };
      barrel(k, [0.6, 0.04, 0.3], 0.16);
      bottle(0.6, 0.3, 'potionGreen', 0.8);
      bottle(0.45, 0.6, 'potionPink');
      bottle(-0.6, 0.35, 'potionBlue', 0.8);
    },
    head(k) {
      // 버섯 갓 (반구 납작) + 흰 점 + 아래 주름
      k.add(new THREE.SphereGeometry(0.72, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), 'mushroom', [0, -0.06, 0], [0, 0, 0], [1, 0.62, 1]);
      k.cyl(0.72, 0.7, 0.06, 14, 'stem', [0, -0.08, 0]);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + (i % 2) * 0.2;
        const el = i % 3 === 0 ? 0.35 : 0.85;
        const r = 0.72;
        const p = [Math.cos(a) * Math.cos(el) * r, Math.sin(el) * r * 0.62 - 0.06, Math.sin(a) * Math.cos(el) * r];
        const n = new THREE.Vector3(p[0], (p[1] + 0.06) / 0.38, p[2]).normalize();
        const geo = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 8).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n));
        k.add(geo, 'spot', p);
      }
      k.ball(0.11, 'spot', [0, 0.38, 0], [1, 0.3, 1]);
      // 대롱 + 포자
      const t = new Kit();
      t.cyl(0.07, 0.09, 0.42, 8, 'bronze', [0, 0, 0]);
      t.add(new THREE.TorusGeometry(0.09, 0.03, 4, 10), 'brass', [0, 0.21, 0], [Math.PI / 2, 0, 0]);
      t.cyl(0.05, 0.05, 0.03, 8, 'coal', [0, 0.23, 0]);
      k.put(t, [0, 0.04, 0.7], [Math.PI / 2 - 0.15, 0, 0]);
      for (const [x, y, z, s] of [[0, 0.1, 0.98, 0.08], [0.07, 0.17, 1.06, 0.06], [-0.05, 0.2, 1.1, 0.05]]) k.ball(s, 'spore', [x, y, z], 1, 1);
      k.ball(0.07, 'leafLight', [-0.2, 0.42, -0.1], [1.4, 0.4, 0.8]);
    },
    prop4(k) { crate(k, [-0.58, 0.04, -0.3], 0.26, 0.3); },
  },

  // 서리: 눈밭 + 눈 덮인 돌탑 + 금 받침 + 떠 있는 얼음 결정 (head 가 천천히 돈다)
  frost: {
    patch: 1.05, seed: 163, headY: 1.62, crownY: -0.36, crownZ: 0, rimY: 1.0, rimR: 0.56, midY: 0.55, midR: 0.6, lowR: 0.64, snow: true,
    flag: [-0.48, 1.05, -0.35],
    base(k) {
      brickTower(k, { r: 0.62, rTop: 0.54, h: 1.0, rows: 4, n: 10, names: ['stone', 'stoneLight', 'stoneDark', 'stoneLight'], seed: 13 });
      k.cyl(0.6, 0.58, 0.1, 12, 'bronze', [0, 1.03, 0]);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        k.ball(0.14, 'snow', [Math.cos(a) * 0.5, 1.1, Math.sin(a) * 0.5], [1, 0.5, 1]);
        k.ball(0.1, 'snow', [Math.cos(a + 0.4) * 0.66, 0.08, Math.sin(a + 0.4) * 0.66], [1.4, 0.6, 1]);
      }
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        k.cone(0.03, 0.12, 4, 'iceLight', [Math.cos(a) * 0.6, 0.93, Math.sin(a) * 0.6], [Math.PI, 0, 0]);
      }
      // 받침 둘레 작은 얼음 결정
      for (const [x, z, s] of [[0.62, 0.45, 0.8], [-0.66, 0.35, 0.65]]) k.add(new THREE.OctahedronGeometry(0.12 * s, 0), 'ice', [x, 0.2 * s, z], [0, 0, 0.2], [1, 2, 1]);
    },
    head(k) {
      k.add(new THREE.TorusGeometry(0.3, 0.05, 4, 12), 'gold', [0, -0.4, 0], [Math.PI / 2, 0, 0]);
      k.add(new THREE.OctahedronGeometry(0.32, 0), 'ice', [0, 0.05, 0], [0, 0.4, 0], [1, 1.9, 1]);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.6;
        k.add(new THREE.OctahedronGeometry(0.17, 0), i % 2 ? 'iceLight' : 'ice', [Math.cos(a) * 0.3, -0.18, Math.sin(a) * 0.3], [Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4], [1, 2, 1]);
      }
      k.add(new THREE.OctahedronGeometry(0.06, 0), 'jewelBlue', [0, -0.4, 0.32]);
    },
    levels: {
      3(k) {
        LEVELS[3](k, TYPES.frost);
        k.add(new THREE.OctahedronGeometry(0.16, 0), 'ice', [0.0, 1.15, 0.0], [0, 0, 0], [1, 1, 1]);
      },
    },
    prop4(k) {
      for (const [x, z] of [[0.5, -0.5], [-0.3, 0.75]]) bush(k, x * 1.25, z * 1.2, 0.2, 'pine', true);
    },
  },
};

// 낮은 돌 받침 고리
function blockRing(k, r, h, n) {
  k.cyl(r - 0.04, r - 0.02, h, n, 'mortar', [0, h / 2, 0]);
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * Math.PI * 2;
    k.box(((Math.PI * 2 * r) / n) * 0.9, h * 0.9, 0.14, i % 3 ? 'stone' : 'stoneLight', [Math.cos(a) * r, h / 2, Math.sin(a) * r], [0, -a + Math.PI / 2, 0]);
  }
}
