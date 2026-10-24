// 움직이는 차 (29장 A): 큰길 양방향 승용차 · 신호등 · 버스와 정류장 · 노상 주차 · 골목 배달 오토바이.
// 화면 장식이다: 시뮬레이션(s.pos)은 차를 모른다. 차가 사람을 비켜 가는 게 아니라 사람 앞에서 선다 (교주가 길에 서 있으면 경적).
// 좌표: 차 그림은 아래 가운데가 기준점 (x = 가운데, y = 바닥). '진행 좌표' p = 진행 방향 부호 × 앞머리 좌표 → 앞차·정지선과의 간격을 한 줄로 잰다.
import { TRAFFIC } from '../config.js';
import { lightsAt, canWalk, carBudget, headlightsOn } from '../sim/traffic.js';
import { walkable } from '../sim/grid.js';
import { registerPerson, PERSON_ORIGIN_Y } from './people.js';
import { speechBubble } from './overlays.js';
import { sfx } from '../ui/sfx.js';
import * as SILLIM from '../map/layout.js';
import * as BONG from '../map/layout-bongcheon.js';

const T = 16;
const SIGN = { right: 1, left: -1, down: 1, up: -1 };
const AXIS = { right: 'h', left: 'h', down: 'v', up: 'v' };
const rnd = (a, b) => a + Math.random() * (b - a);
const pickW = (list) => { let r = Math.random() * list.reduce((a, x) => a + x.w, 0); for (const x of list) { r -= x.w; if (r <= 0) return x; } return list[0]; };

export class Traffic {
  constructor(scene, district, grid) {
    this.scene = scene;
    this.sillim = district !== 'bongcheon';
    const L = this.sillim ? SILLIM : BONG;
    this.L = L; this.grid = grid;
    this.W = L.W * T; this.H = L.H * T;
    const RH = L.ROAD_H; const RV = L.ROAD_V;
    this.RH = RH; this.RV = RV;
    // 차선 (우측 통행): 남부순환로 위 칸 서쪽행 · 아래 칸 동쪽행, 신림로 왼쪽 남쪽행 · 오른쪽 북쪽행
    this.lines = {
      E: { dir: 'right', c: (RH.y + 4) * T - 2 },
      W: { dir: 'left', c: (RH.y + 2) * T - 8 },   // 차 그림이 두 칸보다 높아 서쪽행은 조금 위로 (두 줄이 덜 겹치게)
      S: { dir: 'down', c: (RV.x + 1) * T },
      N: { dir: 'up', c: (RV.x + 3) * T },
    };
    // 정지선 (진행 좌표). 남부순환로 횡단보도는 가로 차, 신림로 횡단보도는 세로 차가 선다
    const cw = L.CROSSWALKS ?? [];
    this.stops = {
      E: cw.filter((c) => c.dir === 'v').map((c) => c.x * T - 3),
      W: cw.filter((c) => c.dir === 'v').map((c) => -((c.x + c.w) * T + 3)),
      S: cw.filter((c) => c.dir === 'h').map((c) => c.y * T - 3),
      N: cw.filter((c) => c.dir === 'h').map((c) => -((c.y + c.h) * T + 3)),
    };
    this.routes = [
      { w: 3, legs: ['E'] }, { w: 3, legs: ['W'] }, { w: 1, legs: ['E', 'S'] }, { w: 1, legs: ['W', 'S'] },
      { w: 1.2, legs: ['N', 'W'] }, { w: 1.2, legs: ['N', 'E'] },
    ];
    this.cars = [];
    this.bikes = [];
    this.bubbles = [];
    this.spawnT = 0.5; this.bikeT = rnd(4, 9); this.parkT = rnd(8, 16);
    this.carCount = scene.cache.json.get('vehiclesMeta')?.cars ?? 8;
    this.lightG = scene.add.graphics().setDepth(9001).setBlendMode('ADD');
    this.drawFixtures();
    this.busT = rnd(6, 14);
    // 처음 들어왔을 때 길이 텅 비어 있지 않게 몇 대 미리 둔다
    for (let i = 0; i < 4; i++) this.spawn(true);
  }

  // ── 고정물: 신호등 · 정류장 표지판 · 주차칸 선 ──
  drawFixtures() {
    const sc = this.scene; const RH = this.RH; const RV = this.RV;
    this.lights = [];
    for (const c of this.L.CROSSWALKS ?? []) {
      // 가로 길 횡단보도: 아래 인도 왼쪽 · 세로 길 횡단보도: 왼쪽 인도, 횡단보도 바로 아래
      const [x, y, axis] = c.dir === 'v' ? [c.x * T - 5, (RH.y + RH.h + 1) * T - 1, 'h'] : [RV.x * T - 6, (c.y + c.h + 1) * T - 4, 'v'];
      this.lights.push({ img: sc.add.image(x, y, 'lzCars', 'light-green').setOrigin(0.5, 1).setDepth(100 + y), axis });
    }
    if (!this.sillim) return;
    const B = TRAFFIC.bus;
    sc.add.image(B.signX * T + 8, (RH.y + RH.h + 1) * T - 2, 'lzCars', 'busSign').setOrigin(0.5, 1).setDepth(100 + (RH.y + RH.h + 1) * T);
    const g = sc.add.graphics().setDepth(2);
    g.lineStyle(1, 0xf2efe6, 0.85);
    for (const bx of TRAFFIC.bays) {
      g.strokeRect(bx * T + 0.5, (RH.y - 2) * T + 0.5, 4 * T - 1, 2 * T - 1);
    }
    // 주차칸: 오늘 서 있는 차 (날마다 다르게)
    this.bays = TRAFFIC.bays.map((bx, i) => ({ x: bx * T + 2 * T, car: null, i }));
    for (const b of this.bays) if (Math.random() < 0.6) b.car = this.parkedCar(b);
  }

  frame(v, dir, k = 0) { return v.kind === 'bus' ? `bus-${dir}-${k}` : `car${v.ci}-${dir}-${k}`; }

  makeVehicle(kind, line, at) {
    const ci = Math.floor(Math.random() * this.carCount);
    const v = { kind, ci, line, dir: this.lines[line].dir, dist: 0, speed: 0, stopT: 0, honkT: 0 };
    v.sp = this.scene.add.sprite(0, 0, 'lzCars', this.frame(v, v.dir)).setOrigin(0.5, 1);
    this.setPos(v, at);
    return v;
  }
  len(v) { return AXIS[v.dir] === 'h' ? v.sp.width - 6 : v.sp.height - 8; }
  // at: 진행 방향 축 좌표 (가로 길이면 x 가운데, 세로 길이면 y 바닥)
  setPos(v, at) {
    const c = this.lines[v.line].c;
    if (AXIS[v.dir] === 'h') { v.x = at; v.y = c; } else { v.x = c; v.y = at; }
  }
  front(v) {
    const l = this.len(v);
    return { right: v.x + l / 2, left: v.x - l / 2, down: v.y, up: v.y - l }[v.dir];
  }
  rear(v) {
    const l = this.len(v);
    return { right: v.x - l / 2, left: v.x + l / 2, down: v.y - l, up: v.y }[v.dir];
  }
  p(v) { return SIGN[v.dir] * this.front(v); }

  spawn(anywhere = false) {
    const r = pickW(this.routes.filter((x) => this.lines[x.legs[0]] && (x.legs.every((l) => l !== 'S' && l !== 'N') || this.RV)));
    const line = r.legs[0]; const dir = this.lines[line].dir;
    let at = { right: -40, left: this.W + 40, up: this.H + 70, down: -40 }[dir];
    if (anywhere) at = AXIS[dir] === 'h' ? rnd(60, this.W - 60) : rnd(this.H * 0.4, this.H - 40);
    // 들어오는 자리가 비어 있어야 한다
    if (this.cars.some((o) => o.line === line && Math.abs((AXIS[dir] === 'h' ? o.x : o.y) - at) < 90)) return null;
    const v = this.makeVehicle('car', line, at);
    v.legs = r.legs.slice(1);
    this.cars.push(v);
    return v;
  }

  parkedCar(b) {
    const v = this.makeVehicle('car', 'W', b.x);
    v.y = this.RH.y * T;
    v.parked = true;
    this.cars.push(v);
    this.place(v);
    return v;
  }

  // 앞에 있는 것까지의 간격 (px). 앞차 · 정지선 · 사람 · 정류장·주차칸 목표
  gapAhead(v, minute, people) {
    const me = this.p(v);
    let gap = 999; let who = null;
    for (const o of this.cars) {
      if (o === v || o.parked || o.line !== v.line || o.pulling) continue;
      const d = SIGN[v.dir] * this.rear(o) - me;
      if (d > -8 && d < gap) { gap = d; who = 'car'; }
    }
    // 신호: 노랑은 정지선 10px 안이면 그냥 지나간다
    const light = lightsAt(minute)[AXIS[v.dir]];
    if (light !== 'green' && !v.turned) {
      for (const sline of this.stops[v.line] ?? []) {
        const d = sline - me;
        if (d >= -2 && (light === 'red' || d > 10) && d < gap) { gap = d; who = 'light'; }
      }
    }
    if (v.turned && v.turned > 0) v.turned -= 1;
    if (v.target != null) { const d = v.target - me; if (d >= -4 && d < gap) { gap = d; who = 'target'; } }
    // 사람: 차선 띠 안, 앞 28px 안
    const c = this.lines[v.line].c;
    for (const q of people) {
      const inBand = AXIS[v.dir] === 'h' ? q.y > c - 30 && q.y < c + 4 : Math.abs(q.x - c) < 14;
      if (!inBand) continue;
      const d = SIGN[v.dir] * (AXIS[v.dir] === 'h' ? q.x : q.y) - me;
      if (d > -6 && d < 28 && d - 4 < gap) { gap = Math.max(0, d - 4); who = q.leader ? 'leader' : 'person'; }
    }
    return { gap, who };
  }

  // 꺾기: 신림로로 들어가거나 남부순환로로 나온다 (모퉁이에서 그림을 바꿔 끼운다)
  tryTurn(v) {
    const next = v.legs?.[0];
    if (!next) return false;
    const nl = this.lines[next];
    let ready = false; let at = 0;
    if (v.line === 'E' || v.line === 'W') { ready = SIGN[v.dir] * v.x >= SIGN[v.dir] * nl.c; at = this.RH.y * T + (v.line === 'E' ? 4 * T : 2 * T) + 8; }
    else if (v.line === 'N') { ready = v.y <= this.lines[next].c + 2; at = v.x; }
    if (!ready) return false;
    // 들어갈 차선이 모퉁이 근처에서 비어 있어야
    const mergeAt = AXIS[nl.dir] === 'h' ? v.x : at;
    if (this.cars.some((o) => o !== v && o.line === next && Math.abs((AXIS[nl.dir] === 'h' ? o.x : o.y) - mergeAt) < 70)) { v.speed = 0; return true; }
    v.line = next; v.dir = nl.dir; v.legs.shift(); v.turned = 30;
    v.sp.setFrame(this.frame(v, v.dir));
    if (AXIS[v.dir] === 'h') { v.y = nl.c; } else { v.x = nl.c; v.y = at; }
    return false;
  }

  update(dt, time, ctx) {
    const { minute, rain, paused, speedMul, people, leader } = ctx;
    const step = paused ? 0 : dt;
    const budget = carBudget(minute, rain);
    // 생기기
    if (!paused) {
      this.spawnT -= dt * speedMul;
      if (this.spawnT <= 0) { this.spawnT = rnd(TRAFFIC.spawnEvery[0], TRAFFIC.spawnEvery[1]); if (this.cars.filter((c) => c.kind === 'car' && !c.parked).length < budget) this.spawn(); }
      if (this.sillim) {
        this.busT -= dt * speedMul;
        if (this.busT <= 0 && !this.cars.some((c) => c.kind === 'bus')) { this.busT = rnd(TRAFFIC.bus.every[0], TRAFFIC.bus.every[1]); this.spawnBus(); }
        this.parkT -= dt * speedMul;
        if (this.parkT <= 0) { this.parkT = rnd(TRAFFIC.parkEvery[0], TRAFFIC.parkEvery[1]); this.parkTurn(); }
      }
      this.bikeT -= dt * speedMul;
      if (this.bikeT <= 0) { this.bikeT = rnd(TRAFFIC.bikeEvery[0], TRAFFIC.bikeEvery[1]); if (this.bikes.length < TRAFFIC.maxBikes) this.spawnBike(); }
    }
    const max = TRAFFIC.carTilesPerSecond * T;
    const lightsNow = lightsAt(minute);
    for (const l of this.lights) l.img.setFrame(`light-${lightsNow[l.axis]}`);
    // 움직이기
    for (const v of this.cars) {
      if (v.parked) { this.place(v); continue; }
      if (v.pulling) { this.pull(v, step * speedMul); this.place(v); continue; }
      if (v.atStop) { this.busStop(v, step * speedMul, time); this.place(v); continue; }
      const turning = this.tryTurn(v);
      const { gap, who } = turning ? { gap: 0, who: 'turn' } : this.gapAhead(v, minute, people);
      const want = gap <= 2 ? 0 : Math.min(max * (v.kind === 'bus' ? 0.8 : 1), (max * (gap - 2)) / 40);
      // 가감속
      v.speed += Math.max(-max * 4 * step, Math.min(max * 1.5 * step, want - v.speed));
      if (gap <= 2 || (gap < 5 && v.speed < 6)) v.speed = 0;      // 거의 다 와서 기어가지 않게
      const d = v.speed * step * speedMul;
      if (AXIS[v.dir] === 'h') v.x += SIGN[v.dir] * d; else v.y += SIGN[v.dir] * d;
      v.dist += d;
      if (who === 'target' && gap <= 3 && v.speed === 0) {
        if (v.kind === 'bus') { v.atStop = { t: 0 }; v.target = null; }
        else if (v.bay) { v.pulling = { t: 0, from: v.y, to: this.RH.y * T, inward: true }; v.target = null; }
      }
      // 경적: 교주가 차선에 서 있으면 3초에 한 번
      v.honkT -= dt;
      if (who === 'leader' && v.speed < 3) { v.stopT += dt; if (v.stopT > 0.5 && v.honkT <= 0) { v.honkT = 3; this.honk(v, time); } } else v.stopT = 0;
      this.place(v);
    }
    this.cars = this.cars.filter((v) => {
      const out = v.x < -120 || v.x > this.W + 120 || v.y < -80 || v.y > this.H + 140;
      if (out) v.sp.destroy();
      return !out;
    });
    this.updateBikes(step * speedMul, dt, time, minute, people, leader);
    // 전조등: 비 오는 날 · 저녁 (차가 서 있어도 켠다)
    this.lightG.clear();
    if (headlightsOn(minute, rain)) for (const v of this.cars) if (!v.parked && v.sp.visible) this.headlight(v);
    // 경적 말풍선
    this.bubbles = this.bubbles.filter((b) => { if (time > b.until) { b.c.destroy(); return false; } b.c.setPosition(b.v.sp.x, b.v.sp.y - b.v.sp.height + 4); return true; });
  }

  place(v) {
    const k = v.speed > 0 ? Math.floor(v.dist / 5) % 6 : 0;
    if (!v.atStop) v.sp.setFrame(this.frame(v, v.dir, k));
    v.sp.setPosition(Math.round(v.x), Math.round(v.y)).setDepth(100 + Math.round(v.y));
  }

  headlight(v) {
    const g = this.lightG; const f = this.front(v);
    g.fillStyle(0xfff0b0, 0.16);
    if (v.dir === 'right') g.fillTriangle(f, v.y - 10, f + 44, v.y - 22, f + 44, v.y + 4);
    if (v.dir === 'left') g.fillTriangle(f, v.y - 10, f - 44, v.y - 22, f - 44, v.y + 4);
    if (v.dir === 'down') g.fillTriangle(v.x, f - 4, v.x - 14, f + 40, v.x + 14, f + 40);
    if (v.dir === 'up') g.fillTriangle(v.x, f + 6, v.x - 14, f - 36, v.x + 14, f - 36);
    g.fillStyle(0xfff6d0, 0.35);
    if (AXIS[v.dir] === 'h') g.fillCircle(f, v.y - 9, 2.5); else g.fillCircle(v.x - 9, v.dir === 'down' ? f - 3 : f + 4, 2).fillCircle(v.x + 9, v.dir === 'down' ? f - 3 : f + 4, 2);
  }

  honk(v, time) {
    const c = speechBubble(this.scene, '빵!').setDepth(5090);
    this.bubbles.push({ c, v, until: time + 1100 });
    sfx.honk?.();
  }

  // ── 버스: 동쪽행 차선, 정류장 앞에서 서고 문이 열리면 손님이 내리고 탄다 ──
  spawnBus() {
    if (this.cars.some((o) => o.line === 'E' && o.x < 140)) return;
    const v = this.makeVehicle('bus', 'E', -70);
    v.legs = [];
    const B = TRAFFIC.bus;
    v.target = B.signX * T + 8 + B.doorAhead + this.len(v) / 2;    // 앞머리가 이 자리에 오면 선다
    this.cars.push(v);
  }
  busStop(v, dt, time) {
    const st = v.atStop; st.t += dt;
    const B = TRAFFIC.bus;
    const open = Math.min(9, Math.floor(st.t / 0.08));
    const close = st.t > B.waitSeconds ? Math.max(0, 9 - Math.floor((st.t - B.waitSeconds) / 0.08)) : 9;
    v.sp.setFrame(`bus-door-${Math.min(open, close)}`);
    if (!st.people && open >= 9) { st.people = true; this.passengers(v); }
    if (st.t > B.waitSeconds + 0.9) { v.atStop = null; v.sp.setFrame(this.frame(v, 'right')); }
  }
  // 이름 없는 손님 (말 걸 수 없는 행인): 둘쯤 내리고 하나쯤 탄다
  passengers(v) {
    const sc = this.scene; const RH = this.RH;
    const doorX = v.x + 14; const sideY = (RH.y + RH.h) * T + 2;
    const walker = (key, x, y, dir) => {
      registerPerson(sc, key);
      const sp = sc.add.sprite(x, y, key).setOrigin(0, PERSON_ORIGIN_Y).setDepth(100 + y + 4);
      sp.play(`${key}-walk-${dir}`);
      return sp;
    };
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const sp = walker(`p:extra:${(i + Math.floor(Math.random() * 6)) % 6}`, doorX - 8, sideY - 12, 'down').setAlpha(0);
      sc.tweens.add({ targets: sp, alpha: 1, y: sideY + 2, duration: 500, delay: i * 450 });
      const dx = (i % 2 ? -1 : 1) * rnd(40, 90);
      sc.tweens.add({ targets: sp, x: sp.x + dx, duration: Math.abs(dx) * 22, delay: 500 + i * 450, onStart: () => sp.play(`${sp.texture.key}-walk-${dx > 0 ? 'right' : 'left'}`) });
      sc.tweens.add({ targets: sp, alpha: 0, duration: 400, delay: 500 + i * 450 + Math.abs(dx) * 22, onComplete: () => sp.destroy() });
    }
    if (Math.random() < 0.7) {
      const sp = walker(`p:extra:${Math.floor(Math.random() * 6)}`, doorX + 40, sideY + 2, 'left').setAlpha(0);
      sc.tweens.add({ targets: sp, alpha: 1, duration: 300 });
      sc.tweens.add({ targets: sp, x: doorX - 8, duration: 900, onComplete: () => sp.play(`${sp.texture.key}-walk-up`) });
      sc.tweens.add({ targets: sp, y: sideY - 10, alpha: 0, duration: 400, delay: 950, onComplete: () => sp.destroy() });
    }
  }

  // ── 노상 주차 (남부순환로 북쪽 인도의 네 칸): 서 있던 차가 나가거나, 서쪽행 차 하나가 들어와 선다 ──
  parkTurn() {
    const full = this.bays.filter((b) => b.car); const empty = this.bays.filter((b) => !b.car && !b.coming);
    if (full.length && (Math.random() < 0.5 || !empty.length)) {
      const b = full[Math.floor(Math.random() * full.length)];
      if (this.cars.some((o) => o.line === 'W' && !o.parked && Math.abs(o.x - b.x) < 90)) return;
      const v = b.car; b.car = null;
      v.parked = false; v.pulling = { t: 0, from: v.y, to: this.lines.W.c, inward: false }; v.legs = [];
      this.cars.includes(v) || this.cars.push(v);
    } else if (empty.length) {
      const b = empty[Math.floor(Math.random() * empty.length)];
      if (this.cars.some((o) => o.line === 'W' && o.x > this.W - 100)) return;
      const v = this.makeVehicle('car', 'W', this.W + 40);
      v.legs = []; v.bay = b; b.coming = true;
      v.target = -(b.x - this.len(v) / 2);
      this.cars.push(v);
    }
  }
  pull(v, dt) {
    const P = v.pulling; P.t += dt / 1.1;
    const k = Math.min(1, P.t);
    v.y = P.from + (P.to - P.from) * (k * k * (3 - 2 * k));
    v.x -= dt * 14;
    if (k >= 1) {
      v.pulling = null;
      if (P.inward) { v.parked = true; v.bay.car = v; v.bay.coming = false; v.bay = null; v.speed = 0; }
      else v.speed = 10;
    }
  }

  // ── 배달 오토바이: 골목 한 줄을 끝에서 끝까지 (신림로는 횡단보도로 신호 맞춰 건넌다) ──
  spawnBike() {
    const L = this.L; const g = this.grid;
    const lanes = [];
    for (const top of L.ROWS) for (const y of [top + L.ROW_H, top + L.ROW_H + 1]) {
      let ok = true;
      for (let x = 0; x < L.W && ok; x++) if (!walkable(g, x, y) && !(x >= this.RV.x && x < this.RV.x + this.RV.w)) ok = false;
      if (ok) lanes.push(y);
    }
    if (!lanes.length) return;
    const y = lanes[Math.floor(Math.random() * lanes.length)];
    const dir = Math.random() < 0.5 ? 'right' : 'left';
    const sp = this.scene.add.sprite(dir === 'right' ? -20 : this.W + 20, (y + 1) * T - 1, 'lzCars', `bike-${dir}-0`).setOrigin(0.5, 1);
    this.bikes.push({ sp, dir, y, dist: 0, speed: 0, honkT: 0 });
  }
  updateBikes(step, dt, time, minute, people) {
    const max = TRAFFIC.bikeTilesPerSecond * T;
    const RV = this.RV;
    for (const b of this.bikes) {
      const s = SIGN[b.dir]; const fx = b.sp.x + s * 10;
      let gap = 999; let who = null;
      for (const q of people) {
        if (Math.abs(q.y - b.sp.y) > 12) continue;
        const d = s * (q.x - fx);
        if (d > -4 && d < 22 && d < gap) { gap = Math.max(0, d - 2); who = q.leader ? 'leader' : 'person'; }
      }
      // 신림로 앞: 사람 신호(옆으로 건넘)가 초록일 때만 들어선다
      const edge = s > 0 ? RV.x * T - 2 : (RV.x + RV.w) * T + 2;
      const toEdge = s * (edge - fx);
      if (toEdge >= 0 && toEdge < 30 && !canWalk(minute, 'v') && toEdge < gap) { gap = toEdge; who = 'light'; }
      // 길 위의 차 앞에서도 선다
      for (const v of this.cars) if (!v.parked && Math.abs(v.sp.y - 8 - b.sp.y) < 20 && s * (v.sp.x - fx) > -10 && s * (v.sp.x - fx) < v.sp.width / 2 + 10) { gap = 0; who = 'car'; }
      const want = gap <= 1 ? 0 : Math.min(max, (max * gap) / 24);
      b.speed += Math.max(-max * 5 * dt, Math.min(max * 2 * dt, want - b.speed));
      if (gap <= 1) b.speed = 0;
      const d = b.speed * step;
      b.sp.x += s * d; b.dist += d;
      b.sp.setFrame(`bike-${b.dir}-${b.speed > 0 ? Math.floor(b.dist / 4) % 2 : 0}`).setDepth(100 + b.sp.y);
      b.honkT -= dt;
      if (who === 'leader' && b.speed === 0 && b.honkT <= 0) { b.honkT = 3; const c = speechBubble(this.scene, '빵빵').setDepth(5090); this.bubbles.push({ c, v: { sp: b.sp }, until: time + 900 }); sfx.honk?.(0.6); }
    }
    this.bikes = this.bikes.filter((b) => { const out = b.sp.x < -40 || b.sp.x > this.W + 40; if (out) b.sp.destroy(); return !out; });
  }

  // 차가 서 있는 사람 목록에 넣을 오토바이 (신림로를 건널 때 차가 선다)
  obstacles() { return this.bikes.map((b) => ({ x: b.sp.x, y: b.sp.y })); }

  destroy() {
    for (const v of this.cars) v.sp.destroy();
    for (const b of this.bikes) b.sp.destroy();
    for (const b of this.bubbles) b.c.destroy();
    for (const b of this.bays ?? []) b.car?.sp.destroy();
    this.lightG.destroy();
  }
}
