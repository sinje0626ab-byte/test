import * as THREE from 'three';

// 장비 확장(4-4-1-1) 머리·몸·신발 56종의 3D 모양 — 새로 그린 아이콘(src/art/items)과 같은 생김새.
// 종류(kind)별 만드는 함수 + 아이템마다 색·장식 표(LOOKS). 머리 위치 = 플레이어 머리(가운데 y 1.18, 반지름 0.34),
// 몸 = 캡슐(가운데 y 0.55, 반지름 0.3, 위 1.03 · 아래 0.08), 발 = 상자(0.16×0.12×0.24, 발 가운데가 원점).

const mats = new Map();
function mat(color, o = {}) {
  const key = `${color}|${o.jelly ? 1 : 0}|${o.metal ? 1 : 0}|${o.glow ?? ''}|${o.double ? 1 : 0}|${o.opacity ?? ''}`;
  if (!mats.has(key)) {
    mats.set(key, new THREE.MeshStandardMaterial({
      color, flatShading: true,
      roughness: o.metal ? 0.35 : o.jelly ? 0.25 : 0.85,
      metalness: o.metal ? 0.55 : 0,
      emissive: o.glow ?? '#000000', emissiveIntensity: o.glow ? 0.45 : 0,
      transparent: o.opacity !== undefined, opacity: o.opacity ?? 1,
      side: o.double ? THREE.DoubleSide : THREE.FrontSide,
    }));
  }
  return mats.get(key);
}
const GOLD = { metal: true };
function part(g, geo, material, pos, rot, scale) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  g.add(m);
  return m;
}
const ring = (n, f) => Array.from({ length: n }, (_, i) => f((i / n) * Math.PI * 2, i));
// 머리 둘레 한 점 (a=0 앞, 반지름 r, 높이 y)
const around = (a, r, y) => [Math.sin(a) * r, y, Math.cos(a) * r];

function flowers(g, list, r, y, size = 0.055, from = -1.2, to = 1.2) {
  list.forEach((c, i) => {
    const a = from + ((to - from) * (i + 0.5)) / list.length;
    const p = around(a, r, y);
    for (let k = 0; k < 5; k++) {
      const b = (k / 5) * Math.PI * 2;
      part(g, new THREE.SphereGeometry(size * 0.55, 5, 4), mat(c), [p[0] + Math.cos(b) * size * 0.7, p[1] + Math.sin(b) * size * 0.7, p[2] + 0.02], null, [1, 1, 0.5]);
    }
    part(g, new THREE.SphereGeometry(size * 0.45, 5, 4), mat('#ffd23f'), [p[0], p[1], p[2] + 0.04]);
  });
}
function leaves(g, color, n, r, y, size = 0.09, tilt = 0.3) {
  ring(n, (a, i) => part(g, new THREE.IcosahedronGeometry(size, 0), mat(i % 2 ? color : shade(color, -0.08)), around(a + 0.3, r, y + (i % 2) * 0.03), [tilt, a, 0], [1.4, 0.4, 0.8]));
}
function shade(c, dl) {
  const col = new THREE.Color(c);
  const hsl = {};
  col.getHSL(hsl);
  return `#${col.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + dl))).getHexString()}`;
}
function gem(g, color, pos, size = 0.06) {
  part(g, new THREE.OctahedronGeometry(size, 0), mat(color, { glow: color }), pos, null, [1, 1.2, 0.6]);
}

// ── 머리 ──
const HATS = {
  // 넓은 챙 모자 (잎 삿갓·데이지·햇빛)
  brim(g, s) {
    const c = mat(s.color);
    part(g, new THREE.CylinderGeometry(0.62, 0.66, 0.05, 12), c, [0, 1.34, 0]);
    if (s.crown === 'cone') part(g, new THREE.ConeGeometry(0.5, 0.32, 10), c, [0, 1.5, 0]);
    else part(g, new THREE.SphereGeometry(0.36, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), c, [0, 1.36, 0], null, [1, 0.75, 1]);
    if (s.band) part(g, new THREE.CylinderGeometry(0.365, 0.365, 0.08, 12, 1, true), mat(s.band), [0, 1.4, 0]);
    if (s.leaves) leaves(g, s.leaves, 7, 0.45, 1.39);
    if (s.flowers) flowers(g, s.flowers, 0.36, 1.48, 0.06, -1.6, 1.6);
    if (s.top) flowers(g, [s.top], 0.0, 1.68, 0.06, 0, 0);
  },
  // 둥근 모자 (꿀벌·도토리·털실·젤리·오로라)
  cap(g, s) {
    const c = mat(s.color, { jelly: s.jelly, opacity: s.jelly ? 0.92 : undefined });
    part(g, new THREE.SphereGeometry(0.4, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), c, [0, 1.27, 0], null, [1, 1.05, 1]);
    if (s.stripes) [1.41, 1.55].forEach((y, i) => part(g, new THREE.TorusGeometry(0.38 - i * 0.07, 0.035, 5, 16), mat(s.stripes), [0, y, 0], [Math.PI / 2, 0, 0]));
    if (s.cuff) part(g, new THREE.TorusGeometry(0.39, 0.06, 6, 16), mat(s.cuff), [0, 1.29, 0], [Math.PI / 2, 0, 0]);
    if (s.pompom) part(g, new THREE.IcosahedronGeometry(0.11, 1), mat(s.pompom), [0, 1.7, 0]);
    if (s.stem) part(g, new THREE.CylinderGeometry(0.03, 0.04, 0.12, 5), mat(s.stem), [0, 1.72, 0], [0, 0, 0.3]);
    if (s.antennae) for (const x of [-0.13, 0.13]) {
      part(g, new THREE.CylinderGeometry(0.015, 0.015, 0.26, 4), mat(s.antennae), [x, 1.74, 0.02], [0, 0, x * -2.2]);
      part(g, new THREE.SphereGeometry(0.05, 6, 4), mat(s.tip ?? s.color), [x * 1.6, 1.86, 0.02]);
    }
    if (s.spots) [[0.2, 1.52, 0.22], [-0.24, 1.48, 0.16], [0.02, 1.62, -0.2], [-0.12, 1.42, -0.32], [0.3, 1.4, -0.14]].forEach((p) => part(g, new THREE.SphereGeometry(0.06, 6, 4), mat(s.spots), p, null, [1, 0.5, 1]));
    if (s.flaps) for (const x of [-1, 1]) {
      part(g, new THREE.BoxGeometry(0.1, 0.26, 0.2), mat(s.color), [x * 0.37, 1.16, -0.04]);
      if (s.pompoms) part(g, new THREE.IcosahedronGeometry(0.06, 1), mat(s.pompoms), [x * 0.37, 0.95, 0.02]);
    }
  },
  // 두건 (이끼·늑대·풍뎅이·신기루·서리·설인): 얼굴만 열린 천
  hood(g, s) {
    const c = mat(s.color);
    part(g, new THREE.SphereGeometry(0.43, 12, 9, Math.PI * 0.72, Math.PI * 1.56, 0, Math.PI * 0.64), c, [0, 1.18, 0], null, s.fur ? [1.06, 1.04, 1.06] : null);
    // 목 뒤로 늘어진 천 (원기둥은 theta 0 이 앞(+z) — 앞쪽은 비운다)
    part(g, new THREE.CylinderGeometry(0.3, 0.42, 0.3, 10, 1, true, Math.PI * 0.3, Math.PI * 1.4), mat(s.color, { double: true }), [0, 0.92, -0.02]);
    if (s.trim) part(g, new THREE.TorusGeometry(0.3, s.fur ? 0.07 : 0.03, 6, 16), mat(s.trim, s.trim === '#e0b34a' ? GOLD : {}), [0, 1.17, 0.27], [-0.15, 0, 0], [1, 1.1, 1]);
    if (s.ears) for (const x of [-1, 1]) {
      part(g, new THREE.ConeGeometry(0.11, 0.24, 4), mat(s.ears), [x * 0.24, 1.6, -0.02], [0, 0, x * -0.35]);
      part(g, new THREE.ConeGeometry(0.06, 0.15, 4), mat(s.earIn ?? '#e8b0a0'), [x * 0.235, 1.58, 0.04], [0, 0, x * -0.35]);
    }
    if (s.horns) for (const x of [-1, 1]) part(g, new THREE.ConeGeometry(0.06, 0.28, 6), mat(s.horns), [x * 0.42, 1.48, 0], [0, 0, x * -0.9]);
    if (s.brooch) gem(g, s.brooch, [0, 0.9, 0.34], 0.07);
    if (s.gem) gem(g, s.gem, [0, 1.47, 0.3], 0.05);
    if (s.veil) part(g, new THREE.CylinderGeometry(0.33, 0.37, 0.32, 12, 1, true, -Math.PI * 0.3, Math.PI * 0.6), mat(s.veil, { opacity: 0.45, double: true }), [0, 1.04, 0.02]);
    if (s.leaves) leaves(g, s.leaves, 6, 0.42, 1.36, 0.07, 0.6);
  },
  // 왕관·머리띠 (들꽃·고목·태양왕·얼음)
  crown(g, s) {
    const band = mat(s.color, s.kind === 'branch' ? {} : GOLD);
    if (s.kind === 'branch') part(g, new THREE.TorusGeometry(0.36, 0.05, 6, 16), band, [0, 1.38, 0], [Math.PI / 2, 0, 0]);
    else part(g, new THREE.CylinderGeometry(0.35, 0.37, 0.13, 12, 1, true), mat(s.color, { ...GOLD, double: true }), [0, 1.4, 0]);
    if (s.kind === 'wreath') { leaves(g, s.leaf, 12, 0.38, 1.46, 0.08); flowers(g, s.flowers, 0.4, 1.5, 0.055, -2.6, 2.6); }
    if (s.kind === 'branch') {
      for (const x of [-1, 1]) {
        part(g, new THREE.CylinderGeometry(0.025, 0.04, 0.34, 5), band, [x * 0.3, 1.58, -0.02], [0, 0, x * -0.5]);
        part(g, new THREE.CylinderGeometry(0.02, 0.03, 0.18, 5), band, [x * 0.42, 1.72, -0.02], [0, 0, x * 0.3]);
      }
      leaves(g, s.leaf, 8, 0.38, 1.44, 0.07);
    }
    if (s.kind === 'spikes') ring(9, (a, i) => part(g, new THREE.ConeGeometry(0.06, i === 0 ? 0.36 : 0.22, 5), band, around(a, 0.35, i === 0 ? 1.62 : 1.56)));
    if (s.kind === 'crystals') ring(9, (a, i) => part(g, new THREE.OctahedronGeometry(0.07, 0), mat(s.crystal, { jelly: true, glow: '#3f7fc0' }), around(a, 0.35, 1.58 + (i === 0 ? 0.08 : 0)), null, [0.8, i === 0 ? 3.2 : 2.2, 0.8]));
    if (s.gem) gem(g, s.gem, [0, 1.42, 0.37], 0.065);
  },
  // 버섯 갓 (포자)
  mushroom(g, s) {
    part(g, new THREE.SphereGeometry(0.5, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(s.color, { glow: s.glow }), [0, 1.32, 0], null, [1, 0.72, 1]);
    part(g, new THREE.CylinderGeometry(0.5, 0.44, 0.07, 14), mat('#efe2c8'), [0, 1.3, 0]);
    [[0.2, 0.3, 0.12], [-0.22, 0.26, 0.16], [0.02, 0.36, -0.2], [-0.12, 0.2, -0.36], [0.33, 0.14, -0.2], [0.1, 0.18, 0.4]].forEach(([x, y, z]) => part(g, new THREE.SphereGeometry(0.065, 6, 4), mat(s.spots, { glow: s.spots }), [x, 1.32 + y, z], null, [1, 0.5, 1]));
  },
  // 터번
  turban(g, s) {
    const c = mat(s.color);
    [[0.4, 1.3], [0.36, 1.42], [0.28, 1.52]].forEach(([r, y], i) => part(g, new THREE.TorusGeometry(r, 0.09, 6, 14), c, [0, y, 0], [Math.PI / 2 + (i % 2 ? 0.12 : -0.08), 0, 0]));
    part(g, new THREE.SphereGeometry(0.24, 8, 6), c, [0, 1.54, 0], null, [1, 0.6, 1]);
    part(g, new THREE.BoxGeometry(0.14, 0.12, 0.04), mat(s.band, GOLD), [0, 1.36, 0.42]);
    gem(g, s.gem, [0, 1.37, 0.45], 0.05);
    part(g, new THREE.ConeGeometry(0.1, 0.34, 5), c, [0.24, 1.1, -0.32], [0.5, 0, 0.4]);
  },
};

// ── 몸 ──
function bodyLook(g, s) {
  if (s.belt) {
    part(g, new THREE.TorusGeometry(0.31, 0.035, 5, 16), mat(s.belt), [0, 0.46, 0], [Math.PI / 2, 0, 0]);
    if (s.buckle) gem(g, s.buckle, [0, 0.46, 0.33], 0.05);
  }
  if (s.stripes) [0.36, 0.6, 0.82].forEach((y) => part(g, new THREE.TorusGeometry(y > 0.8 ? 0.27 : 0.305, 0.04, 5, 16), mat(s.stripes), [0, y, 0], [Math.PI / 2, 0, 0]));
  const col = s.collar;
  if (col) {
    if (col.kind === 'fur') part(g, new THREE.TorusGeometry(0.27, 0.09, 6, 14), mat(col.color), [0, 0.9, 0], [Math.PI / 2, 0, 0]);
    if (col.kind === 'turtle') part(g, new THREE.CylinderGeometry(0.2, 0.24, 0.12, 12), mat(col.color), [0, 0.98, 0]);
    if (col.kind === 'wrap') part(g, new THREE.TorusGeometry(0.27, 0.07, 6, 14), mat(col.color), [0, 0.9, 0], [Math.PI / 2, 0, 0]);
    if (col.kind === 'leaf' || col.kind === 'petal') ring(8, (a) => part(g, new THREE.ConeGeometry(0.08, 0.18, 4), mat(col.color), [Math.sin(a) * 0.25, 0.86, Math.cos(a) * 0.25], [Math.PI + Math.cos(a) * 0.5, 0, -Math.sin(a) * 0.5], [1, 1, 0.5]));
    if (col.kind === 'spikes') ring(7, (a, i) => part(g, new THREE.ConeGeometry(0.06, 0.26, 4), mat(col.color, GOLD), [Math.sin(a + Math.PI) * 0.24, 1.0, Math.cos(a + Math.PI) * 0.24], [-Math.cos(a + Math.PI) * 0.5, 0, Math.sin(a + Math.PI) * 0.5]));
  }
  const hem = s.hem;
  if (hem) {
    if (hem.kind === 'fur') part(g, new THREE.TorusGeometry(0.32, 0.07, 6, 16), mat(hem.color), [0, 0.22, 0], [Math.PI / 2, 0, 0]);
    if (hem.kind === 'leaf' || hem.kind === 'petal') ring(10, (a, i) => part(g, new THREE.ConeGeometry(0.1, 0.24, 4), mat(i % 2 ? hem.color : shade(hem.color, -0.06)), [Math.sin(a) * 0.3, 0.26, Math.cos(a) * 0.3], [Math.PI + Math.cos(a) * 0.35, 0, -Math.sin(a) * 0.35], [1, 1, 0.45]));
    if (hem.kind === 'coat') part(g, new THREE.CylinderGeometry(0.33, 0.38, 0.22, 12, 1, true), mat(hem.color, { double: true }), [0, 0.24, 0]);
  }
  if (s.robe) part(g, new THREE.CylinderGeometry(0.33, 0.42, 0.42, 12, 1, true), mat(s.color, { double: true }), [0, 0.28, 0]);
  if (s.cape) {
    part(g, new THREE.CylinderGeometry(0.31, 0.47, 0.8, 12, 1, true, Math.PI * 0.6, Math.PI * 0.8), mat(s.cape.color, { double: true }), [0, 0.5, 0]);
    if (s.cape.trim) part(g, new THREE.CylinderGeometry(0.475, 0.48, 0.05, 12, 1, true, Math.PI * 0.6, Math.PI * 0.8), mat(s.cape.trim, GOLD), [0, 0.12, 0]);
    if (s.cape.fur) part(g, new THREE.TorusGeometry(0.3, 0.07, 6, 12, Math.PI), mat(s.cape.color), [0, 0.9, -0.02], [Math.PI / 2, 0, Math.PI]);
  }
  if (s.backHood) part(g, new THREE.SphereGeometry(0.2, 8, 6), mat(s.backHood), [0, 0.95, -0.3], null, [1.3, 0.8, 0.7]);
  if (s.clasp) gem(g, s.clasp, [0, 0.88, 0.3], 0.055);
  if (s.shoulders) for (const x of [-1, 1]) part(g, new THREE.SphereGeometry(0.13, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(s.shoulders, { jelly: s.jelly, metal: s.metal }), [x * 0.3, 0.84, 0], [0, 0, x * -0.5], [1, 0.8, 1]);
  if (s.plates) [[-0.12, 0.66], [0.12, 0.66], [-0.12, 0.38], [0.12, 0.38]].forEach(([x, y]) => part(g, new THREE.BoxGeometry(0.17, 0.2, 0.05), mat(s.plates, { jelly: s.icy, glow: s.icy ? '#2f5f9f' : undefined }), [x, y, 0.28], [0, x * 1.6, 0]));
  if (s.scales) for (const y of [0.34, 0.5, 0.66, 0.8]) ring(9, (a) => part(g, new THREE.SphereGeometry(0.06, 5, 4), mat(shade(s.color, 0.05), GOLD), [Math.sin(a) * 0.3, y, Math.cos(a) * 0.3], null, [1, 0.7, 0.5]));
  if (s.toggles) [0.36, 0.52, 0.68].forEach((y) => part(g, new THREE.BoxGeometry(0.1, 0.035, 0.035), mat(s.toggles), [0, y, 0.31]));
  if (s.pouch) part(g, new THREE.BoxGeometry(0.1, 0.11, 0.07), mat(s.pouch), [0.24, 0.42, 0.2], [0, 0.7, 0]);
  if (s.gem) gem(g, s.gem, [0, 0.72, 0.31], 0.06);
  if (s.leaves) leaves(g, s.leaves, 4, 0.3, 0.84, 0.06);
}

// ── 신발 (발 하나 기준, 발 상자를 따라 움직인다) ──
function footLook(g, s) {
  // 발은 몸 아래로 앞쪽 절반만 보인다 → 장식은 발등·발끝·발목 둘레(y 0.1 아래)에
  const c = mat(s.color);
  if (s.boot) {
    part(g, new THREE.BoxGeometry(0.19, 0.15, 0.27), c, [0, 0.015, -0.005]);
    if (s.boot === 'tall') part(g, new THREE.BoxGeometry(0.2, 0.05, 0.14), c, [0, 0.1, -0.05]);
    if (s.cuff) part(g, new THREE.TorusGeometry(0.1, 0.04, 6, 12), mat(s.cuff), [0, 0.1, -0.03], [Math.PI / 2, 0, 0], [1, 1.25, 1]);
    if (s.trim) part(g, new THREE.BoxGeometry(0.2, 0.025, 0.28), mat(s.trim, GOLD), [0, 0.07, -0.005]);
    if (s.stripes) part(g, new THREE.BoxGeometry(0.2, 0.035, 0.28), mat(s.stripes), [0, 0.03, -0.005]);
    if (s.laces) [0.03, 0.08].forEach((z) => part(g, new THREE.BoxGeometry(0.12, 0.015, 0.025), mat(s.laces), [0, 0.095, z]));
    if (s.vines) [-0.04, 0.06].forEach((z, i) => part(g, new THREE.BoxGeometry(0.205, 0.022, 0.03), mat(s.vines), [0, 0.04 + i * 0.03, z], [0.5, 0, 0]));
  }
  if (s.sole) part(g, new THREE.BoxGeometry(0.2, 0.035, 0.28), mat(s.sole), [0, -0.06, 0]);
  if (s.straps) [0.07, -0.02].forEach((z) => part(g, new THREE.BoxGeometry(0.18, 0.035, 0.045), mat(s.straps, s.straps === '#e0b34a' ? GOLD : {}), [0, 0.065, z]));
  if (s.cuffLow) part(g, new THREE.TorusGeometry(0.085, 0.035, 6, 12), mat(s.cuffLow), [0, 0.07, -0.02], [Math.PI / 2, 0, 0], [1, 1.3, 1]);
  if (s.pom) part(g, new THREE.IcosahedronGeometry(0.06, 0), mat(s.pom), [0, 0.07, 0.1]);
  if (s.sprout) {
    part(g, new THREE.CylinderGeometry(0.01, 0.01, 0.08, 4), mat('#5e8a3a'), [0, 0.1, 0.06]);
    part(g, new THREE.IcosahedronGeometry(0.04, 0), mat(s.sprout), [0.025, 0.14, 0.06], null, [1.4, 0.4, 0.8]);
  }
  if (s.bow) for (const x of [-1, 1]) part(g, new THREE.ConeGeometry(0.035, 0.07, 4), mat(s.bow), [x * 0.035, 0.07, 0.1], [0, 0, x * Math.PI / 2]);
  if (s.fluffy) part(g, new THREE.SphereGeometry(0.13, 7, 5), c, [0, 0.02, 0.01], null, [0.8, 0.65, 1.15]);
  if (s.curl) part(g, new THREE.TorusGeometry(0.05, 0.024, 5, 8, Math.PI * 1.3), c, [0, 0.05, 0.15], [0, Math.PI / 2, 0]);
  if (s.band) part(g, new THREE.BoxGeometry(0.17, 0.03, 0.12), mat(s.band), [0, 0.06, 0.03]);
  if (s.claws) [-0.05, 0, 0.05].forEach((x) => part(g, new THREE.ConeGeometry(0.02, 0.08, 4), mat(s.claws), [x, -0.02, 0.16], [Math.PI / 2, 0, 0]));
  if (s.strap) part(g, new THREE.BoxGeometry(0.2, 0.03, 0.05), mat(s.strap), [0, 0.06, 0.04]);
  if (s.wings) part(g, new THREE.ConeGeometry(0.06, 0.18, 3), mat('#fbf6ec'), [g.userData.side * 0.12, 0.06, -0.06], [0.6, 0, g.userData.side * -1.3], [1, 1, 0.3]);
  if (s.leaves) part(g, new THREE.IcosahedronGeometry(0.055, 0), mat('#7fc95a'), [0.03, 0.09, 0.06], null, [1.4, 0.4, 0.8]);
  if (s.gem) gem(g, s.gem, [0, 0.08, 0.12], 0.035);
}

// 아이템별 모양 (색은 새 아이콘에서)
export const LOOKS = {
  // 머리
  clover_hat: { slot: 'head', kind: 'brim', color: '#6fb94a', crown: 'cone', leaves: '#7fc95a', top: '#ffffff' },
  daisy_hat: { slot: 'head', kind: 'brim', color: '#a9a456', crown: 'round', leaves: '#6fb94a', flowers: ['#ffd23f', '#ffffff', '#ffd23f', '#ffffff', '#ffd23f'] },
  bee_cap: { slot: 'head', kind: 'cap', color: '#f2c230', stripes: '#5b3b22', antennae: '#5b3b22', tip: '#f2c230' },
  slime_helm: { slot: 'head', kind: 'cap', color: '#6fd65a', jelly: true, spots: '#eaffe0' },
  meadow_crown: { slot: 'head', kind: 'crown', crownKind: 'wreath', color: '#d9a63a', leaf: '#6fb94a', flowers: ['#b67ae0', '#ff8fab', '#ffffff', '#7cc6ef', '#ffcf5c'], gem: '#ffcf5c' },
  acorn_cap: { slot: 'head', kind: 'cap', color: '#8a5a34', stem: '#6b4426' },
  moss_hood: { slot: 'head', kind: 'hood', color: '#6f9a3a', trim: '#8a5a34', leaves: '#7fc95a', hideHair: true },
  wolf_hood: { slot: 'head', kind: 'hood', color: '#9c9aa0', fur: true, trim: '#e8e4de', ears: '#9c9aa0', hideHair: true },
  spore_cap: { slot: 'head', kind: 'mushroom', color: '#9a4fd0', spots: '#f0e0ff', glow: '#3a1060' },
  elder_circlet: { slot: 'head', kind: 'crown', crownKind: 'branch', color: '#7a5232', leaf: '#6fb94a', gem: '#ffcf5c' },
  sun_hat: { slot: 'head', kind: 'brim', color: '#e0b45a', crown: 'round', band: '#c9584e' },
  red_turban: { slot: 'head', kind: 'turban', color: '#c9443a', band: '#e0b34a', gem: '#e02a2a', hideHair: true },
  scarab_hood: { slot: 'head', kind: 'hood', color: '#1f8f88', trim: '#e0b34a', brooch: '#3fbfb0', hideHair: true },
  mirage_veil: { slot: 'head', kind: 'hood', color: '#8a4fc0', trim: '#e0b34a', veil: '#e2c8f8', gem: '#e04a6a', hideHair: true },
  sunking_crown: { slot: 'head', kind: 'crown', crownKind: 'spikes', color: '#e0b34a', gem: '#ff9a2a' },
  wool_beanie: { slot: 'head', kind: 'cap', color: '#4f7fc0', cuff: '#3f6aa8', pompom: '#ffffff' },
  frost_hood: { slot: 'head', kind: 'hood', color: '#a8c8ec', trim: '#ffffff', fur: true, hideHair: true },
  yeti_helm: { slot: 'head', kind: 'hood', color: '#ece6da', fur: true, trim: '#ece6da', horns: '#d9c7a0', hideHair: true },
  aurora_hat: { slot: 'head', kind: 'cap', color: '#b8a0f0', cuff: '#cdbaf6', flaps: true, pompoms: '#c8b4f4' },
  ice_crown: { slot: 'head', kind: 'crown', crownKind: 'crystals', color: '#c8d4e0', crystal: '#9fd8ff', gem: '#e8f6ff' },
  // 몸 (color = 옷 색)
  clover_tunic: { slot: 'body', color: '#6fb94a', collar: { kind: 'leaf', color: '#86cc5c' }, hem: { kind: 'leaf', color: '#86cc5c' }, belt: '#a8b84a' },
  bee_vest: { slot: 'body', color: '#f2c230', stripes: '#6b4426', belt: '#6b4426', buckle: '#ff9a2a' },
  petal_robe: { slot: 'body', color: '#e07a8a', collar: { kind: 'petal', color: '#f0909a' }, hem: { kind: 'petal', color: '#f0909a' }, belt: '#6fb94a', buckle: '#ffffff' },
  jelly_armor: { slot: 'body', color: '#6fd65a', shoulders: '#7fe06a', jelly: true, belt: '#e0b34a', buckle: '#3fbf5a' },
  meadow_mantle: { slot: 'body', color: '#3f8a3a', cape: { color: '#3f8a3a', trim: '#e0b34a' }, clasp: '#6fd65a' },
  bark_vest: { slot: 'body', color: '#8a5a34', plates: '#7a4b2a', belt: '#5b3b22', leaves: '#7fc95a' },
  moss_cloak: { slot: 'body', color: '#6f9a3a', cape: { color: '#6f9a3a' }, backHood: '#6f9a3a', belt: '#8a5a34' },
  wolf_pelt: { slot: 'body', color: '#a8a4a0', collar: { kind: 'fur', color: '#e8e2da' }, cape: { color: '#8a8680', fur: true }, belt: '#6b4426' },
  ranger_coat: { slot: 'body', color: '#4f7a3a', collar: { kind: 'turtle', color: '#d9c7a0' }, hem: { kind: 'coat', color: '#4f7a3a' }, belt: '#8a5a34', buckle: '#e0b34a', pouch: '#8a5a34', gem: '#6fd65a' },
  elder_robe: { slot: 'body', color: '#2f6a35', robe: true, cape: { color: '#2f6a35', trim: '#c9a24a' }, backHood: '#2f6a35', gem: '#9fe060' },
  linen_wrap: { slot: 'body', color: '#e0cfa8', hem: { kind: 'coat', color: '#e0cfa8' }, belt: '#a8763a' },
  scarab_vest: { slot: 'body', color: '#1f9a8e', shoulders: '#1f9a8e', metal: true, belt: '#8a5a34', buckle: '#3fdfd0', gem: '#e0b34a' },
  nomad_cloak: { slot: 'body', color: '#c9443a', collar: { kind: 'wrap', color: '#c9443a' }, cape: { color: '#c9443a', trim: '#e0b34a' }, clasp: '#e0b34a' },
  sunscale_armor: { slot: 'body', color: '#e0b34a', scales: true, shoulders: '#e8c050', metal: true, belt: '#8a5a34' },
  pharaoh_robe: { slot: 'body', color: '#2f9a8e', robe: true, collar: { kind: 'spikes', color: '#e0b34a' }, cape: { color: '#e0b34a' }, gem: '#3fdfd0' },
  wool_sweater: { slot: 'body', color: '#ef9aa8', collar: { kind: 'turtle', color: '#ef9aa8' }, stripes: '#fbe8e0' },
  snow_parka: { slot: 'body', color: '#8fb8e8', collar: { kind: 'fur', color: '#ffffff' }, hem: { kind: 'fur', color: '#ffffff' }, toggles: '#c9843a' },
  frost_cloak: { slot: 'body', color: '#3fa8a8', collar: { kind: 'fur', color: '#ffffff' }, cape: { color: '#3fa8a8', trim: '#e0f4ff' }, clasp: '#9fd8ff' },
  glacier_armor: { slot: 'body', color: '#2f5aa0', shoulders: '#8fc8f0', plates: '#9fd8ff', icy: true, belt: '#3a3f4a', buckle: '#e0e8f0' },
  aurora_coat: { slot: 'body', color: '#a890e8', collar: { kind: 'fur', color: '#f4f0ff' }, hem: { kind: 'fur', color: '#f4f0ff' }, gem: '#b06ae0' },
  // 신발 (color = 발 색)
  grass_sandals: { slot: 'feet', color: '#a88a5a', straps: '#6fb94a', leaves: true },
  bee_boots: { slot: 'feet', color: '#f2c230', boot: true, stripes: '#6b4426', sole: '#6b4426', wings: true },
  clover_slippers: { slot: 'feet', color: '#8fc84a', cuffLow: '#f4ecd8', pom: '#4fb04a' },
  meadow_boots: { slot: 'feet', color: '#3f8a3a', boot: 'tall', trim: '#c9a24a', leaves: true },
  bark_boots: { slot: 'feet', color: '#7a5232', boot: true, laces: '#5b3b22', sole: '#5b3b22' },
  moss_shoes: { slot: 'feet', color: '#6f9a3a', sprout: '#7fd65a' },
  wolf_boots: { slot: 'feet', color: '#a8a4a0', boot: true, cuff: '#d8d4ce', strap: '#6b4426', claws: '#ececec' },
  elder_boots: { slot: 'feet', color: '#2f6a35', boot: 'tall', vines: '#8a5a34', gem: '#9fe060' },
  dune_slippers: { slot: 'feet', color: '#d99a84', curl: true, band: '#c9443a' },
  scarab_sandals: { slot: 'feet', color: '#c9955a', straps: '#1f9a8e', gem: '#3fdfd0' },
  mirage_boots: { slot: 'feet', color: '#8a4fc0', boot: true, trim: '#e0b34a' },
  sunstrider_boots: { slot: 'feet', color: '#e8d4b0', straps: '#e0b34a', wings: true, gem: '#ffb02a' },
  fur_slippers: { slot: 'feet', color: '#f4b0c0', fluffy: true, bow: '#c9443a' },
  frost_boots: { slot: 'feet', color: '#c9743a', boot: true, cuff: '#ffffff', sole: '#5b3b22' },
  glacier_boots: { slot: 'feet', color: '#9fc8ec', boot: true, cuff: '#ffffff', gem: '#4f9fe8' },
  aurora_boots: { slot: 'feet', color: '#9a7ae0', boot: true, cuff: '#f4f0ff', gem: '#9fd8ff' },
};

// 머리·몸 장식 (inner 에 붙인다)
export function buildLook(id) {
  const s = LOOKS[id];
  const g = new THREE.Group();
  if (s.slot === 'head') HATS[s.kind](g, { ...s, kind: s.crownKind ?? s.kind });
  else if (s.slot === 'body') bodyLook(g, s);
  g.visible = false;
  return g;
}

// 신발 장식 한 짝 (side: 왼쪽 -1 / 오른쪽 1, 발 메시에 붙인다)
export function buildFoot(id, side) {
  const g = new THREE.Group();
  g.userData.side = side;
  footLook(g, LOOKS[id]);
  g.visible = false;
  return g;
}
