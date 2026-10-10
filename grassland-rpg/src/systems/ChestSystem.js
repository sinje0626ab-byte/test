import * as THREE from 'three';
import { Kit, meshes, material } from '../entities/structureKit.js';
import { rand } from '../utils/random.js';

// 보물상자 (config.chests). 아침마다 지역마다 perRegion 개를 들판에 놓는다 (나무·은·황금, weights).
// 가까이 가서 E → 열면 골드·지역 재료·장비(은·황금은 옵션 한 줄 더)·소모품이 튀어나온다.
// mimicChance 면 미믹이 튀어나오고, 잡으면 은 상자 몫을 토해 낸다. 상자 아이템(chest_*)을 쓰면 그 자리에서 열린다.
// ctx.chests = [{ kind: 'chest', type, position, radius, opened }]. 저장 chests: { day, list: [{ x, z, type, opened, mimic }] }
export class ChestSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.chests;
    this.list = [];
    ctx.chests = this.list;
    this.day = null;
    const { bus } = ctx;
    bus.on('time:day', ({ day }) => this.reset(day));
    bus.on('game:new', () => this.reset(ctx.time.day));
    bus.on('interact:chest', ({ chest }) => this.open(chest));
    bus.on('item:use', (e) => this.useItem(e));
    bus.on('monster:killed', (e) => {
      if (e.type !== this.cfg.mimicType) return;
      this.burst(this.cfg.mimicLoot, e.position, this.regionId(e.position));
    });
    bus.on('save:collect', (save) => {
      save.chests = { day: this.day, list: this.list.map((c) => ({ x: c.position.x, z: c.position.z, type: c.type, opened: c.opened, mimic: c.mimic })) };
    });
    bus.on('save:apply', (save) => {
      if (save.chests?.day === ctx.time.day) {
        this.clear();
        this.day = save.chests.day;
        for (const c of save.chests.list) this.place(c.x, c.z, c.type, c.mimic, c.opened);
      } else this.reset(ctx.time.day);
    });
  }

  regionId(pos) {
    return this.ctx.world.regionAt(pos.x, pos.z).id;
  }

  tier(regionId) {
    return this.ctx.data.regions[regionId]?.difficulty ?? 1;
  }

  clear() {
    for (const c of this.list) this.ctx.scene.remove(c.mesh);
    this.list.length = 0;
  }

  // 아침: 새 상자 (열었든 말든 다 바꾼다)
  reset(day) {
    this.clear();
    this.day = day;
    const { world } = this.ctx;
    const b = world.bounds;
    for (const reg of world.regions.list) {
      const n = this.cfg.perRegion[reg.id] ?? 0;
      for (let i = 0; i < n; i++) {
        const p = this.findSpot(reg, b);
        if (p) this.place(p[0], p[1], this.pickType(), Math.random() < this.cfg.mimicChance, false);
      }
    }
  }

  findSpot(reg, b) {
    const { world, bases } = this.ctx;
    const z0 = Math.max(reg.zFrom, b.minZ) + 4;
    const z1 = Math.min(reg.zTo, b.maxZ) - 4;
    for (let t = 0; t < 30; t++) {
      const x = rand.range(b.minX + 6, b.maxX - 6);
      const z = rand.range(z0, z1);
      if (world.isBlocked(x, z, 1.2) || world.inPond(x, z, 2)) continue;
      if (bases.some((base) => Math.hypot(base.position.x - x, base.position.z - z) < base.areaRadius + 4)) continue;
      if (this.list.some((c) => Math.hypot(c.position.x - x, c.position.z - z) < 20)) continue;
      return [x, z];
    }
    return null;
  }

  pickType() {
    const w = this.cfg.weights;
    let r = Math.random() * Object.values(w).reduce((a, v) => a + v, 0);
    for (const [k, v] of Object.entries(w)) if ((r -= v) <= 0) return k;
    return 'wood';
  }

  place(x, z, type, mimic, opened) {
    const { group, lid, star } = chestModel(type);
    group.position.set(x, 0, z);
    group.rotation.y = rand.range(-0.6, 0.6);
    this.ctx.scene.add(group);
    const c = { kind: 'chest', type, mimic, opened, position: group.position, radius: 0.5, mesh: group, lid, star, t: rand.range(0, 6) };
    this.applyLook(c);
    this.list.push(c);
    return c;
  }

  applyLook(c) {
    c.lid.rotation.x = c.opened ? -1.9 : 0;
    c.star.visible = !c.opened;
  }

  open(c) {
    if (!c || c.opened) return;
    const { bus } = this.ctx;
    c.opened = true;
    if (c.mimic) {
      // 미믹! 상자는 사라지고 몬스터가 튀어나온다
      this.ctx.scene.remove(c.mesh);
      this.list.splice(this.list.indexOf(c), 1);
      bus.emit('monster:spawn', { type: this.cfg.mimicType, position: c.position.clone(), spread: 0 });
      bus.emit('notify', { text: '앗, 미믹이다! 잡으면 보물을 토해 내요', kind: 'warn', icon: 'ic_mimic' });
      bus.emit('chest:mimic', { position: c.position });
      return;
    }
    this.applyLook(c);
    this.burst(c.type, c.position, this.regionId(c.position));
    bus.emit('chest:opened', { type: c.type, position: c.position });
    bus.emit('notify', { text: `${this.cfg.kinds[c.type].name}를 열었어요!`, kind: 'item', icon: 'chest_open' });
  }

  // 상자 아이템: 지금 있는 지역 것이 나온다
  useItem(e) {
    const type = this.ctx.data.items.items[e.item]?.use?.chest;
    if (!type) return;
    const p = this.ctx.player;
    if (!p.alive) return;
    e.used = true;
    this.burst(type, p.position, this.regionId(p.position));
    this.ctx.bus.emit('chest:opened', { type, position: p.position.clone(), item: true });
  }

  // 내용물을 바닥에 흩뿌린다 (LootSystem 이 줍기를 맡는다)
  burst(type, position, regionId) {
    const { bus } = this.ctx;
    for (const it of this.roll(type, regionId)) bus.emit('loot:spawn', { item: it.item, count: it.count, position: position.clone(), extraLines: it.extraLines ?? 0 });
    bus.emit('fx:ring', { position, color: type === 'gold' ? '#ffd166' : type === 'silver' ? '#cfe3f0' : '#e9c27a' });
  }

  roll(type, regionId) {
    const { data } = this.ctx;
    const k = this.cfg.kinds[type] ?? this.cfg.kinds.wood;
    const tier = this.tier(regionId);
    const out = [{ item: 'gold', count: Math.round(rand.int(k.gold[0], k.gold[1]) * (1 + (tier - 1) * 0.8)) }];
    const mats = this.cfg.materials[regionId] ?? this.cfg.materials.grassland;
    const picked = new Set();
    for (let i = 0; i < k.materials; i++) {
      const id = rand.pick(mats);
      if (picked.has(id)) continue;
      picked.add(id);
      out.push({ item: id, count: rand.int(this.cfg.materialCount[0], this.cfg.materialCount[1]) });
    }
    if (Math.random() < k.gearChance) {
      for (let i = 0; i < (k.gearCount ?? 1); i++) {
        const id = this.pickGear(regionId, k.gear);
        if (id) out.push({ item: id, count: 1, extraLines: k.extraLines ?? 0 });
      }
    }
    if (Math.random() < (k.consumable ?? 0)) out.push({ item: rand.pick(this.cfg.consumables), count: rand.int(1, 2) });
    if (k.crystal && Math.random() < k.crystal) out.push({ item: rand.pick(this.cfg.crystals), count: 1 });
    return out.filter((x) => data.items.items[x.item] || x.item === 'gold');
  }

  pickGear(regionId, weights) {
    const pools = (this.pools ??= this.buildPools());
    const order = ['common', 'uncommon', 'rare', 'epic'];
    let r = Math.random() * Object.values(weights).reduce((a, v) => a + v, 0);
    let grade = 'common';
    for (const [g, w] of Object.entries(weights)) if ((r -= w) <= 0) { grade = g; break; }
    const region = pools[regionId] ?? pools.grassland;
    // 그 등급이 없으면 가까운 등급
    for (let d = 0; d < order.length; d++) {
      for (const g of [order[order.indexOf(grade) - d], order[order.indexOf(grade) + d]]) if (g && region?.[g]?.length) return rand.pick(region[g]);
    }
    return null;
  }

  buildPools() {
    const out = {};
    for (const [id, def] of Object.entries(this.ctx.data.items.items)) {
      if (!def.pool) continue;
      ((out[def.pool] ??= {})[def.grade] ??= []).push(id);
    }
    return out;
  }

  update(dt) {
    const p = this.ctx.player.position;
    for (const c of this.list) {
      if (c.opened) { c.mesh.visible = Math.abs(c.position.x - p.x) < 40 && Math.abs(c.position.z - p.z) < 40; continue; }
      c.t += dt;
      const near = Math.abs(c.position.x - p.x) < 40 && Math.abs(c.position.z - p.z) < 40;
      c.mesh.visible = near;
      if (!near) continue;
      c.star.position.y = 1.15 + Math.sin(c.t * 2.5) * 0.08;
      c.star.rotation.y = c.t * 1.5;
      // 미믹은 가끔 들썩인다 (눈치 빠르면 알아챈다)
      c.lid.rotation.x = c.mimic && Math.sin(c.t * 0.9) > 0.97 ? -0.18 : 0;
    }
  }
}

// 상자 모양: 나무 몸통 + 반원 뚜껑(뒤 경첩) + 테(나무 = 쇠, 은 = 은, 황금 = 금) + 자물쇠 + 위에 반짝 별
const BAND = { wood: 'iron', silver: 'steel', gold: 'gold' };
const BODY = { wood: 'wood', silver: 'woodDark', gold: 'red' };
const CACHE = {};
export function chestModel(type) {
  const g = new THREE.Group();
  const band = BAND[type] ?? 'iron';
  const body = BODY[type] ?? 'wood';
  CACHE[type] ??= (() => {
    const k = new Kit();
    k.box(0.9, 0.5, 0.6, body, [0, 0.27, 0]);
    for (const x of [-0.33, 0.33]) k.box(0.1, 0.52, 0.62, band, [x, 0.27, 0]);
    k.box(0.92, 0.06, 0.62, band, [0, 0.05, 0]);
    k.box(0.14, 0.18, 0.05, 'gold', [0, 0.42, 0.31]);
    k.add(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 10), 'grass', [0, 0.01, 0], [0, 0, 0], [5, 1, 4]);
    const l = new Kit();
    const half = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 10, 1, false, 0, Math.PI);
    half.rotateZ(Math.PI / 2);
    l.add(half, body, [0, 0, 0.3]);
    for (const x of [-0.33, 0.33]) {
      const b = new THREE.CylinderGeometry(0.315, 0.315, 0.1, 10, 1, false, 0, Math.PI);
      b.rotateZ(Math.PI / 2);
      l.add(b, band, [x, 0, 0.3]);
    }
    return { body: k.bake(), lid: l.bake() };
  })();
  meshes(CACHE[type].body, g);
  const lid = new THREE.Group();
  lid.position.set(0, 0.52, -0.3);
  meshes(CACHE[type].lid, lid);
  g.add(lid);
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), material(type === 'gold' ? 'glow' : 'flameCore'));
  star.scale.y = 1.5;
  star.position.y = 1.15;
  g.add(star);
  return { group: g, lid, star };
}
