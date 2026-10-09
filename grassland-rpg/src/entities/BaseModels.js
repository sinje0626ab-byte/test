import * as THREE from 'three';
import {
  Kit, baked, meshes, patch, bush, flower, rock, ivy, crate, barrel, lantern, banner, flagPole, flagCloth,
  brickTower, crenels, tileCone, gableRoof, plankBox, logPiece, fire, windowFrame, door, steps, fence, beam, blockWall,
} from './structureKit.js';

// 기지 단계별 중심 건물 모양 (시안 docs/art/incoming/concept_bases.webp):
// 텐트(크림 천·빨간 깃발·통·상자·모닥불) → 움막(초가·이끼 지붕 통나무집·꽃 상자·등불) →
// 집(빨간 기와·굴뚝 연기·반목조·지붕창·현관) → 요새(돌탑 셋·빨간 고깔 지붕·깃발·담쟁이·나무 문·도개교)
// 돌려주는 값: mats 피격 번쩍임용, lantern 등불 자리(밤에 Building 이 불을 켠다), flag 흔들리는 깃발, top 지붕 높이
export function createBaseModel(model) {
  const g = new THREE.Group();
  const build = BUILD[model] ?? BUILD.tent;
  let flags = [];
  const list = baked(`base:${model}`, (k) => {
    flags = build(k).flags;
    for (const [x, y, z, o] of flags) flagPole(k, x, y, z, o);
  });
  // 깃발은 움직이는 메시라 합치지 않고 매번 새로 (모양 정보만 기억)
  if (!FLAGS.has(model)) FLAGS.set(model, flags);
  const { parts } = meshes(list, g);
  const fl = FLAGS.get(model).map(([x, y, z, o]) => {
    const f = flagCloth(x, y, z, o);
    g.add(f);
    return f;
  });
  const info = INFO[model] ?? INFO.tent;
  return { group: g, mats: parts.map((m) => m.material), lantern: info.lantern, flag: fl[0], flags: fl, top: info.top };
}

const FLAGS = new Map();
const INFO = {
  tent: { lantern: [0.98, 1.0, 1.12], top: 2.9 },
  hut: { lantern: [0.98, 1.12, 1.12], top: 3.0 },
  house: { lantern: [0.98, 1.05, 1.42], top: 3.9 },
  fort: { lantern: [0.78, 1.15, 1.18], top: 5.2 },
};

// 등불 고리(유리는 낮엔 크림색, 밤엔 Building 이 빛 메시를 켠다)
function lamp(k, [x, y, z], wall) {
  lantern(k, [x, y, z], false);
  if (wall) {
    k.box(0.04, 0.04, Math.abs(z - wall) + 0.02, 'ironDark', [x, y + 0.27, (z + wall) / 2]);
    k.box(0.06, 0.12, 0.04, 'ironDark', [x, y + 0.22, wall + 0.01]);
  }
}

// 돌 받침 (낮은 돌 띠)
function stoneBase(k, w, d, h) {
  for (const [z, ry, len] of [[d / 2, 0, w], [-d / 2, 0, w]]) blockWall(k, { w: len + 0.1, h, d: 0.14, p: [0, 0, z], rows: 2, bw: 0.42, ry, names: ['stoneDark', 'stone'] });
  for (const x of [-w / 2, w / 2]) blockWall(k, { w: d, h, d: 0.14, p: [x, 0, 0], rows: 2, bw: 0.42, ry: Math.PI / 2, names: ['stoneDark', 'stone'] });
  k.box(w, h, d, 'stoneDark', [0, h / 2, 0]);
}

const BUILD = {
  tent(k) {
    patch(k, 2.0, { seed: 11, flowers: 7, bushes: 7, rocks: 2, path: true, skip: (a) => Math.abs(a - Math.PI / 2) < 0.45 });
    // 천막: 살짝 오목한 고깔 (12각)
    const H = 1.85;
    const R = 1.2;
    const prof = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      prof.push(new THREE.Vector2(Math.max(0.02, R * (1 - t) * (1 - Math.sin(t * Math.PI) * 0.12)), t * H));
    }
    k.add(new THREE.LatheGeometry(prof, 12), 'canvas', [0, 0.04, 0]);
    // 솔기 (천 이음선)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      beam(k, [Math.cos(a) * R * 1.01, 0.06, Math.sin(a) * R * 1.01], [0, H, 0], 0.018, 'canvasDark');
    }
    // 입구: 어두운 삼각 + 양옆으로 젖힌 천
    const tilt = Math.atan2(R, H);
    const tri = new THREE.Shape();
    tri.moveTo(-0.38, 0);
    tri.lineTo(0.38, 0);
    tri.lineTo(0, 1.0);
    tri.closePath();
    k.add(new THREE.ExtrudeGeometry(tri, { depth: 0.02, bevelEnabled: false }), 'woodDark', [0, 0.05, R - 0.03], [-tilt, 0, 0]);
    for (const s of [-1, 1]) {
      const flap = new THREE.Shape();
      flap.moveTo(0, 0);
      flap.lineTo(s * 0.32, 0);
      flap.lineTo(0, 0.95);
      flap.closePath();
      k.add(new THREE.ExtrudeGeometry(flap, { depth: 0.03, bevelEnabled: false }), 'canvasDark', [s * 0.36, 0.05, R + 0.02], [-tilt, s * 0.5, 0]);
    }
    // 가운데 기둥 + 끈 묶음
    k.cyl(0.06, 0.07, 0.6, 6, 'wood', [0, H + 0.15, 0]);
    k.add(new THREE.TorusGeometry(0.075, 0.025, 3, 8), 'rope', [0, H - 0.02, 0], [Math.PI / 2, 0, 0]);
    // 말뚝 넷 + 밧줄
    for (const a of [Math.PI * 0.2, Math.PI * 0.8, Math.PI * 1.25, Math.PI * 1.75]) {
      const x = Math.cos(a) * 1.6;
      const z = Math.sin(a) * 1.6;
      k.cyl(0.05, 0.06, 0.5, 5, 'wood', [x, 0.25, z]);
      k.add(new THREE.TorusGeometry(0.055, 0.02, 3, 8), 'rope', [x, 0.4, z], [Math.PI / 2, 0, 0]);
      beam(k, [x, 0.42, z], [Math.cos(a) * R * 0.45, H * 0.6, Math.sin(a) * R * 0.45], 0.012);
    }
    barrel(k, [-1.25, 0.04, 0.55], 0.26);
    crate(k, [1.3, 0.04, 0.35], 0.42, 0.3);
    crate(k, [1.28, 0.46, 0.33], 0.26, -0.2);
    fire(k, [0.62, 0.04, 1.55], 0.8);
    // 등불 기둥
    k.cyl(0.04, 0.045, 1.3, 5, 'woodDark', [1.0, 0.65, 0.88]);
    k.box(0.04, 0.04, 0.3, 'woodDark', [1.0, 1.28, 1.0]);
    lamp(k, INFO.tent.lantern);
    return { flags: [[0, H + 0.42, 0, { h: 0.6, len: 0.46, ht: 0.28 }]] };
  },

  hut(k) {
    patch(k, 2.35, { seed: 23, flowers: 9, bushes: 8, rocks: 2, path: true, skip: (a) => Math.abs(a - Math.PI / 2) < 0.4 });
    const W = 2.1;
    const D = 1.8;
    stoneBase(k, W + 0.12, D + 0.12, 0.26);
    plankBox(k, { w: W, h: 1.2, d: D, p: [0, 0.26, 0], names: ['woodLight', 'wood'], n: 7 });
    // 가로 띠 (통나무집 느낌)
    for (const y of [0.3, 1.42]) for (const z of [-1, 1]) k.box(W + 0.08, 0.1, 0.1, 'woodDark', [0, y, z * (D / 2 + 0.03)]);
    // 초가 지붕 + 이끼
    const RY = 1.46;
    const RH = 0.95;
    gableRoof(k, { w: W, d: D, h: RH, y: RY, rows: 4, names: ['thatch', 'thatchDark'], over: 0.28, wall: 'wood', thick: 0.16, ridge: 'thatchDark' });
    logPiece(k, [0, RY + RH + 0.1, 0], W + 0.9, 0.11);
    const yAt = (z) => RY + RH * (1 - Math.abs(z) / (D / 2)) + 0.14;
    for (const [x, z, s] of [[-0.6, 0.55, 0.2], [0.5, 0.2, 0.16], [0.95, 0.7, 0.18], [-0.2, -0.5, 0.2], [0.8, -0.3, 0.15], [-0.95, 0.15, 0.15]]) {
      k.ball(s, 'moss', [x, yAt(z), z], [1.3, 0.45, 1]);
      k.ball(s * 0.6, 'leafLight', [x + s * 0.7, yAt(z) + 0.02, z + 0.05], [1.2, 0.45, 1]);
    }
    // 앞: 문 + 계단 + 창문(꽃 상자)
    door(k, [0.42, 0.26, D / 2 + 0.03], 0.5, 0.82);
    steps(k, [0.42, 0, D / 2 + 0.24], 0.68, 2);
    windowFrame(k, [-0.5, 0.95, D / 2 + 0.05], 0.38, 0.36);
    windowFrame(k, [W / 2 + 0.05, 0.95, -0.1], 0.36, 0.34, Math.PI / 2);
    lamp(k, INFO.hut.lantern, D / 2 + 0.04);
    // 꽃 통 + 울타리 + 덤불
    barrel(k, [-0.15, 0.04, D / 2 + 0.45], 0.17, 'soil');
    for (let i = 0; i < 3; i++) flower(k, -0.15 + (i - 1) * 0.08, D / 2 + 0.45 + (i % 2) * 0.05, i === 1 ? 'petalPink' : 'petal', 0.42, 1.1);
    fence(k, [-0.85, 0.04, D / 2 + 0.6], 0.9, 0.15);
    fence(k, [1.25, 0.04, D / 2 + 0.25], 0.7, Math.PI / 2 - 0.3);
    bush(k, -1.25, 0.6, 0.26);
    bush(k, 1.3, -0.6, 0.24, 'leafLight');
    return { flags: [[-W / 2 - 0.2, RY + 0.55, 0, { h: 0.9, len: 0.42, ht: 0.26 }]] };
  },

  house(k) {
    patch(k, 2.75, { seed: 37, flowers: 10, bushes: 9, rocks: 3, path: true, skip: (a) => Math.abs(a - Math.PI / 2) < 0.4 });
    const W = 2.5;
    const D = 2.1;
    const B = 0.36;
    stoneBase(k, W + 0.14, D + 0.14, B);
    // 회벽 + 반목조 (기둥·가로대·빗장)
    const WH = 1.5;
    k.box(W, WH, D, 'plaster', [0, B + WH / 2, 0]);
    for (const z of [-1, 1]) {
      const zz = z * (D / 2 + 0.02);
      for (const x of [-W / 2, -W / 6, W / 6, W / 2]) k.box(0.11, WH, 0.06, 'woodDark', [x, B + WH / 2, zz]);
      for (const y of [B + 0.04, B + WH * 0.55, B + WH - 0.04]) k.box(W + 0.06, 0.09, 0.06, 'woodDark', [0, y, zz]);
    }
    for (const x of [-1, 1]) {
      const xx = x * (W / 2 + 0.02);
      for (const z of [-D / 2, 0, D / 2]) k.box(0.06, WH, 0.11, 'woodDark', [xx, B + WH / 2, z]);
      for (const y of [B + 0.04, B + WH * 0.55, B + WH - 0.04]) k.box(0.06, 0.09, D + 0.06, 'woodDark', [xx, y, 0]);
      for (const s of [-1, 1]) k.box(0.05, 0.08, 0.95, 'woodDark', [xx, B + WH * 0.28, s * D / 4], [s * 0.55, 0, 0]);
    }
    // 기와 지붕 + 지붕창
    const RY = B + WH;
    const RH = 1.25;
    gableRoof(k, { w: W, d: D, h: RH, y: RY, rows: 5, names: ['roof', 'roofDark'], over: 0.22, wall: 'plaster', thick: 0.1, ridge: 'roofDark' });
    for (const x of [-1, 1]) k.box(0.06, 0.08, 1.3, 'woodDark', [x * (W / 2 + 0.03), RY + RH * 0.35, 0]);
    const dz = 0.42;
    const dy = RY + RH * (1 - dz / (D / 2));
    k.box(0.66, 0.62, 0.5, 'plaster', [-0.3, dy + 0.12, dz + 0.1]);
    windowFrame(k, [-0.3, dy + 0.18, dz + 0.37], 0.3, 0.28);
    const dorm = new Kit();
    gableRoof(dorm, { w: 0.5, d: 0.72, h: 0.36, y: 0, rows: 2, names: ['roof', 'roofDark'], over: 0.1, wall: 'plaster', thick: 0.07, ridge: 'roofDark' });
    k.put(dorm, [-0.3, dy + 0.43, dz + 0.1], [0, Math.PI / 2, 0]);
    // 굴뚝 + 연기
    const cx = 0.72;
    const cz = -0.45;
    const cy = RY + RH * (1 - Math.abs(cz) / (D / 2));
    const chim = new Kit();
    blockWall(chim, { w: 0.42, h: 1.0, d: 0.42, rows: 4, bw: 0.21, names: ['stone', 'stoneLight', 'stoneDark'] });
    chim.box(0.52, 0.1, 0.52, 'stoneDark', [0, 1.02, 0]);
    chim.box(0.3, 0.04, 0.3, 'coal', [0, 1.08, 0]);
    k.put(chim, [cx, cy - 0.15, cz]);
    for (const [x, y, z, s] of [[0, 1.35, 0, 0.16], [0.08, 1.6, -0.05, 0.13], [0.02, 1.83, 0.02, 0.1]]) k.ball(s, 'smoke', [cx + x, cy - 0.15 + y, cz + z], 1, 1);
    // 앞: 문 + 현관 지붕 + 계단 + 창문 둘
    door(k, [0.52, B, D / 2 + 0.05], 0.5, 0.86);
    const porch = new Kit();
    gableRoof(porch, { w: 0.85, d: 0.6, h: 0.28, y: 0, rows: 2, names: ['roof', 'roofDark'], over: 0.06, thick: 0.07, ridge: 'roofDark' });
    k.put(porch, [0.52, B + 1.12, D / 2 + 0.3], [0, Math.PI / 2, 0]);
    for (const x of [0.17, 0.87]) k.box(0.07, 1.1, 0.07, 'wood', [x, B + 0.55, D / 2 + 0.52]);
    steps(k, [0.52, 0, D / 2 + 0.32], 0.75, 3);
    windowFrame(k, [-0.6, B + 0.8, D / 2 + 0.06], 0.42, 0.42);
    windowFrame(k, [W / 2 + 0.06, B + 0.8, 0.45], 0.38, 0.38, Math.PI / 2);
    windowFrame(k, [W / 2 + 0.06, B + 0.8, -0.5], 0.38, 0.38, Math.PI / 2);
    lamp(k, INFO.house.lantern, D / 2 + 0.05);
    fence(k, [-0.75, 0.04, D / 2 + 0.75], 1.1, 0);
    fence(k, [1.45, 0.04, D / 2 + 0.3], 0.8, Math.PI / 2 - 0.2);
    barrel(k, [1.5, 0.04, -0.5], 0.2, 'soil');
    for (let i = 0; i < 3; i++) flower(k, 1.5 + (i - 1) * 0.09, -0.5 + (i % 2) * 0.05, 'petal', 0.49, 1.1);
    bush(k, -1.45, 0.75, 0.3);
    bush(k, -1.35, -0.85, 0.26, 'leafLight');
    bush(k, 1.1, 1.45, 0.22);
    return { flags: [[-W / 2 - 0.12, RY + 0.1, 0.0, { h: 1.3, len: 0.46, ht: 0.28 }]] };
  },

  fort(k) {
    patch(k, 3.3, { seed: 53, flowers: 12, bushes: 10, rocks: 3, path: true, skip: (a) => Math.abs(a - Math.PI / 2) < 0.35 });
    const tower = (x, z, r, h, seed, roof = 1.25) => {
      const t = new Kit();
      brickTower(t, { r, rTop: r * 0.94, h, rows: Math.round(h / 0.24), n: 11, seed });
      t.box(0.1, 0.24, 0.06, 'woodDark', [0, h * 0.62, r * 0.95]);
      t.box(0.1, 0.24, 0.06, 'woodDark', [r * 0.95, h * 0.45, 0], [0, Math.PI / 2, 0]);
      t.cyl(r * 1.06, r * 1.06, 0.12, 12, 'stoneDark', [0, h + 0.06, 0]);
      tileCone(t, { r: r * 1.22, h: roof, y: h + 0.1, rows: 4, seg: 12 });
      ivy(t, [[r * 0.6, h * 0.55, r * 0.8, 4], [-r * 0.85, h * 0.4, r * 0.5, 3], [r * 0.2, h * 0.85, r * 0.98, 2]], 0.1);
      k.put(t, [x, 0, z]);
      return h + 0.1 + roof;
    };
    const backTop = tower(0, -0.95, 0.82, 3.0, 61, 1.45);
    const sideTop = tower(-1.55, 0.25, 0.68, 2.3, 67);
    tower(1.55, 0.25, 0.68, 2.3, 71);
    // 안쪽 성채 (톱니)
    const keep = new Kit();
    brickTower(keep, { r: 0.75, h: 2.0, rows: 8, n: 10, seed: 73 });
    crenels(keep, { r: 0.8, y: 2.0, n: 8 });
    k.put(keep, [0, 0, -0.1]);
    // 앞 성벽 + 톱니 + 문
    blockWall(k, { w: 2.5, h: 1.6, d: 0.55, p: [0, 0, 0.62], rows: 6, bw: 0.4, seed: 79 });
    for (let i = 0; i < 6; i++) k.box(0.28, 0.26, 0.5, i % 2 ? 'stone' : 'stoneLight', [-1.05 + i * 0.42, 1.73, 0.62]);
    const gx = 0;
    const gz = 0.92;
    k.cyl(0.55, 0.55, 0.06, 12, 'stoneDark', [gx, 0.95, gz - 0.02], [Math.PI / 2, 0, 0]);
    door(k, [gx, 0.02, gz], 0.82, 0.95, 0, true);
    // 도개교 (판자) + 사슬
    for (let i = 0; i < 5; i++) k.box(0.9, 0.06, 0.15, i % 2 ? 'woodLight' : 'wood', [gx, 0.07, gz + 0.15 + i * 0.16]);
    for (const s of [-1, 1]) {
      k.box(0.06, 0.08, 0.82, 'woodDark', [gx + s * 0.46, 0.1, gz + 0.47]);
      beam(k, [gx + s * 0.46, 0.14, gz + 0.85], [gx + s * 0.55, 1.35, gz + 0.02], 0.022, 'rope');
    }
    banner(k, [-0.82, 1.45, 0.92], { w: 0.34, h: 0.75 });
    banner(k, [0.82, 1.45, 0.92], { w: 0.34, h: 0.75 });
    ivy(k, [[-1.15, 1.5, 0.92, 4], [1.12, 1.3, 0.92, 3], [-0.45, 1.6, 0.92, 2]], 0.1);
    bush(k, -1.05, 1.35, 0.32);
    bush(k, 1.1, 1.35, 0.3, 'leafLight');
    bush(k, -2.1, 1.0, 0.28);
    bush(k, 2.15, 0.95, 0.26, 'leafLight');
    for (const [x, z] of [[-0.75, 1.6], [0.7, 1.7], [-1.6, 1.4]]) flower(k, x, z);
    rock(k, 1.6, 1.55, 0.18);
    lamp(k, INFO.fort.lantern, 0.9);
    return {
      flags: [
        [0, backTop - 0.08, -0.95, { h: 0.9, len: 0.52, ht: 0.3 }],
        [-1.55, sideTop - 0.08, 0.25, { h: 0.7, len: 0.4, ht: 0.24 }],
        [1.55, sideTop - 0.08, 0.25, { h: 0.7, len: 0.4, ht: 0.24 }],
      ],
    };
  },
};
