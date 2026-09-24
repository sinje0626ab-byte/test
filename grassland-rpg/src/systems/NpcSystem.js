import * as THREE from 'three';
import { Npc } from '../entities/Npc.js';
import { rand } from '../utils/random.js';

// 동물 주민: 조건이 되면 입주(npcs.json의 joins), 기지 안을 거닐고, E로 대화.
// 대화: npc:talk에 다른 시스템(퀘스트·도감)이 줄·선택지를 보탠 뒤 dialogue:open.
// 도토리 오늘의 특가, 꿀비 씨앗·수확물 거래, 하늘 택배도 여기서 처리한다.
export class NpcSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.defs = ctx.data.npcs.npcs;
    this.cfg = ctx.data.npcs.config;
    this.lines = ctx.data.dialogues;
    this.residents = {}; // id → { baseId }
    this.list = [];
    ctx.npcs = this.list;
    this.special = null; // { id, day }
    this.parcels = []; // 택배 { fromBaseId, toBaseId, item }
    this.counts = {};
    this.lastLevelUp = -Infinity;
    this.lastBossDay = -1;
    const { bus } = ctx;

    // 타이틀·불러오는 중에는 입주 확인을 미룬다 (불러오기가 끝나면 한 번에)
    this.ready = false;
    for (const ev of ['game:new', 'save:loaded']) bus.on(ev, () => { this.ready = true; this.checkMoveIns(false); });
    for (const ev of ['facility:changed', 'base:created']) bus.on(ev, () => { if (this.ready) this.checkMoveIns(true); });
    bus.on('interact:npc', ({ npc }) => this.talk(npc));
    bus.on('stats:levelup', () => { this.lastLevelUp = performance.now(); });
    bus.on('boss:defeated', () => { this.lastBossDay = ctx.time.day; });
    bus.on('time:day', ({ day }) => { this.rollSpecial(day); this.deliver(); });
    bus.on('inventory:changed', ({ slots }) => {
      this.counts = {};
      for (const s of slots) if (s) this.counts[s.id] = (this.counts[s.id] ?? 0) + s.count;
    });
    bus.on('npc:open-facility', ({ npc, type }) => {
      const f = ctx.structures.find((s) => s.kind === 'facility' && s.type === type && s.baseId === this.residents[npc.id]?.baseId && s.alive);
      if (f) bus.emit('interact:facility', { facility: f });
      else bus.emit('notify', { text: '건물이 부서져 있어요. 아침에 다시 와요', kind: 'warn' });
    });
    bus.on('npc:sell-harvest', () => this.sellHarvest());
    bus.on('courier:send', (e) => this.send(e));
    bus.on('save:collect', (save) => {
      save.npcs = { residents: { ...this.residents }, special: this.special, parcels: this.parcels.map((p) => ({ ...p, item: { ...p.item } })) };
    });
    bus.on('save:apply', (save) => {
      this.residents = { ...(save.npcs?.residents ?? {}) };
      this.special = save.npcs?.special ?? null;
      this.parcels = save.npcs?.parcels ?? [];
    });
  }

  // 집 자리: 입주 건물 옆 / 기지 옆 / (박사) 첫 기지 옆, 기지가 없으면 시작 지점 옆
  anchorFor(id) {
    const { ctx } = this;
    const def = this.defs[id];
    const r = this.residents[id];
    const off = this.cfg.doctorOffset;
    if (def.joins.facility) {
      const f = ctx.structures.find((s) => s.kind === 'facility' && s.type === def.joins.facility && s.baseId === r.baseId);
      if (f) return f.position.clone().add(new THREE.Vector3(1.6, 0, 1.6));
    }
    const base = ctx.bases.find((b) => b.id === r.baseId) ?? ctx.bases[0];
    if (base) return base.position.clone().add(new THREE.Vector3(off[0], 0, off[1]));
    return ctx.world.spawnPoint.clone().add(new THREE.Vector3(off[0], 0, off[1]));
  }

  // 입주 조건 확인. announce면 "이사 왔어요" 알림
  checkMoveIns(announce) {
    const { ctx } = this;
    for (const [id, def] of Object.entries(this.defs)) {
      if (!this.residents[id]) {
        const j = def.joins;
        let baseId = null;
        if (j.facility) {
          const f = ctx.structures.find((s) => s.kind === 'facility' && s.type === j.facility);
          if (!f) continue;
          baseId = f.baseId;
        } else if (j.bases) {
          if (ctx.bases.length < j.bases) continue;
          baseId = ctx.bases[j.bases - 1].id;
        } else {
          baseId = ctx.bases[0]?.id ?? null;
        }
        this.residents[id] = { baseId };
        if (announce) ctx.bus.emit('notify', { text: this.lines._moveIn[id], kind: 'item' });
        ctx.bus.emit('npc:joined', { id });
      }
      // 박사는 첫 기지가 생기면 그 옆으로 옮긴다
      if (def.joins.start && this.residents[id].baseId == null && ctx.bases[0]) this.residents[id].baseId = ctx.bases[0].id;
      const anchor = this.anchorFor(id);
      const npc = this.list.find((n) => n.id === id);
      if (!npc) this.list.push(new Npc(ctx, id, anchor));
      else if (npc.anchor.distanceTo(anchor) > 0.5) npc.moveHome(anchor);
    }
    if (this.residents.dotori && (!this.special || this.special.day !== ctx.time.day)) this.rollSpecial(ctx.time.day);
    else this.emitSpecial();
  }

  // ── 대화 ─────────────────────────────
  pickLine(npc) {
    const L = this.lines[npc.id];
    const t = this.ctx.time;
    let pool = L.greet;
    if (npc.asleep && L.sleepy) pool = L.sleepy;
    else if (performance.now() - this.lastLevelUp < this.cfg.levelUpWindow * 1000 && L.levelUp) pool = L.levelUp;
    else if (this.lastBossDay === t.day && L.bossDefeated) pool = L.bossDefeated;
    else if (!t.isNight && t.clock > t.cfg.dayLength - t.cfg.nightWarning * 2 && L.raidEve) pool = L.raidEve;
    return rand.pick(pool).replaceAll('{name}', this.ctx.player.appearance.name);
  }

  talk(npc) {
    const { bus, data } = this.ctx;
    npc.talking = 999;
    const talk = { npc, lines: [this.pickLine(npc)], options: [] };
    const role = npc.def.role;
    if (role === 'shop') {
      if (this.special) talk.lines.push(`오늘의 특가: ${data.items.items[this.special.id].name} ${Math.round(this.cfg.special.discount * 100)}% 할인!`);
      talk.options.push({ label: '가게 보기', event: 'npc:open-facility', payload: { npc, type: 'shop' } });
    } else if (role === 'forge') {
      talk.options.push({ label: '장비 강화', event: 'npc:open-facility', payload: { npc, type: 'forge' } });
    } else if (role === 'garden') {
      for (const e of data.shop.buy.filter((b) => data.config.garden.crops[b.id])) {
        talk.options.push({ label: `${data.items.items[e.id].name} 사기 (${e.price}골드)`, event: 'shop:buy', payload: { id: e.id }, stay: true });
      }
      talk.options.push({ label: `수확물 팔기 (값 ×${this.cfg.garden.sellMultiplier})`, event: 'npc:sell-harvest', payload: {}, stay: true });
    } else if (role === 'courier') {
      talk.options.push({ label: '택배 보내기', event: 'courier:open', payload: { npc } });
    }
    bus.emit('npc:talk', talk); // 퀘스트·도감이 선택지를 보탠다
    talk.options.push({ label: '잘 있어', event: null });
    bus.emit('dialogue:open', talk);
  }

  // ── 도토리 오늘의 특가 ─────────────────
  rollSpecial(day) {
    if (!this.residents.dotori) return;
    const list = this.ctx.data.shop.buy;
    this.special = { id: rand.pick(list).id, day };
    this.emitSpecial();
  }

  emitSpecial() {
    this.ctx.bus.emit('shop:special', this.special && this.residents.dotori ? { id: this.special.id, discount: this.cfg.special.discount } : { id: null, discount: 0 });
  }

  // ── 꿀비: 약초·사과를 값 ×1.5에 사 간다 ──
  sellHarvest() {
    const { bus, data } = this.ctx;
    const items = this.cfg.garden.items.filter((id) => this.counts[id] > 0).map((id) => ({ id, count: this.counts[id] }));
    if (!items.length) {
      bus.emit('notify', { text: '팔 수확물이 없어~', kind: 'warn' });
      return;
    }
    const gold = Math.round(items.reduce((a, it) => a + (data.items.items[it.id].value ?? 0) * it.count, 0) * this.cfg.garden.sellMultiplier);
    const spend = { items, ok: false };
    bus.emit('inventory:spend', spend);
    if (!spend.ok) return;
    bus.emit('economy:reward', { amount: gold });
    bus.emit('notify', { text: `꿀비에게 수확물을 팔았어요 (+${gold})`, kind: 'gold' });
  }

  // ── 하늘 택배: 창고 한 칸을 다른 기지 창고로 (다음 아침 도착) ──
  send({ fromBaseId, slot, toBaseId }) {
    const { bus } = this.ctx;
    const cost = this.cfg.courier.costPerSlot;
    const pay = { amount: cost, ok: false };
    bus.emit('economy:spend', pay);
    if (!pay.ok) {
      bus.emit('notify', { text: `골드가 부족합니다 (${cost} 필요)`, kind: 'warn' });
      return;
    }
    const take = { baseId: fromBaseId, slot, item: null };
    bus.emit('storage:take', take);
    if (!take.item) {
      bus.emit('economy:reward', { amount: cost });
      return;
    }
    this.parcels.push({ fromBaseId, toBaseId, item: take.item });
    bus.emit('notify', { text: '슝! 내일 아침까지 배달 완료!', kind: 'item' });
  }

  deliver() {
    const { bus } = this.ctx;
    const left = [];
    for (const p of this.parcels) {
      const put = { baseId: p.toBaseId, item: p.item, left: 0 };
      bus.emit('storage:put', put);
      if (put.left > 0) left.push({ ...p, item: { ...p.item, count: put.left } });
    }
    if (this.parcels.length) bus.emit('notify', { text: left.length ? '택배 일부가 창고가 가득 차서 못 들어갔어요 (내일 다시)' : '택배가 도착했어요!', kind: 'item' });
    this.parcels = left;
  }

  update(dt) {
    for (const n of this.list) n.update(dt);
  }
}
