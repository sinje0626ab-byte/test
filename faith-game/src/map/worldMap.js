import { geoOrthographic, geoPath, geoCentroid, geoArea, geoGraticule10, geoInterpolate, geoDistance } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { easeCubicInOut } from 'd3-ease';
import { feature } from 'topojson-client';
import { geometryId, EXCLUDED_IDS } from '../data/ids.js';

const DEG = 180 / Math.PI;
const K_MIN = 0.85;
const K_MAX = 14;

// 3D 지구본. 끌어서 돌리고, 휠·핀치로 확대한다. 놓으면 관성으로 조금 더 돈다.
// 게임 상태를 모르고, 색·강조·유닛 표시를 받아서 그리기만 한다.
export function createWorldMap(container, topology) {
  let handlers = {};
  const features = feature(topology, topology.objects.countries).features
    .map((f) => ({ ...f, id: geometryId(f) }))
    .filter((f) => f.id && !EXCLUDED_IDS.has(f.id));
  const byId = new Map(features.map((f) => [f.id, f]));

  const svg = select(container).append('svg').attr('class', 'world-map').attr('role', 'img').attr('aria-label', '세계 지구본');
  const defs = svg.append('defs');
  const shade = defs.append('radialGradient').attr('id', 'globe-shade').attr('cx', '38%').attr('cy', '30%').attr('r', '75%');
  shade.append('stop').attr('offset', '0%').attr('class', 'shade-hi');
  shade.append('stop').attr('offset', '62%').attr('class', 'shade-mid');
  shade.append('stop').attr('offset', '100%').attr('class', 'shade-lo');

  const sphere = svg.append('path').attr('class', 'map-sphere');
  const graticule = svg.append('path').attr('class', 'map-graticule').datum(geoGraticule10());
  const countryLayer = svg.append('g').attr('class', 'map-countries');
  const shadeLayer = svg.append('path').attr('class', 'map-shade').attr('fill', 'url(#globe-shade)');
  const markLayer = svg.append('g').attr('class', 'map-marks');
  const fxLayer = svg.append('g').attr('class', 'map-fx');
  const unitLayer = svg.append('g').attr('class', 'map-units');

  const projection = geoOrthographic().precision(0.6).clipAngle(90);
  const path = geoPath(projection);
  const view = { rotate: [-127, -30], k: 1 };   // rotate = [-경도, -위도]
  let width = 0, height = 0, radius = 1;
  let anchorGeo = new Map();                     // id → [경도, 위도]
  let frame = 0;
  let flight = null;                             // 진행 중인 이동 애니메이션
  let inertia = null;
  let spinning = false;

  const paths = countryLayer.selectAll('path')
    .data(features, (d) => d.id)
    .join('path')
    .attr('class', 'country')
    .attr('data-id', (d) => d.id)
    .on('click', (event, d) => { event.stopPropagation(); handlers.onCountryClick?.(d.id); })
    .on('pointerenter', (event, d) => handlers.onHover?.(d.id, event))
    .on('pointermove', (event, d) => handlers.onHover?.(d.id, event))
    .on('pointerleave', () => handlers.onHover?.(null));

  svg.on('click', () => handlers.onBackgroundClick?.());

  // ── 그리기 ──
  function draw() {
    frame = 0;
    projection.rotate(view.rotate).scale(radius * view.k).translate([width / 2, height / 2]);
    sphere.attr('d', path({ type: 'Sphere' }));
    shadeLayer.attr('d', path({ type: 'Sphere' }));
    graticule.attr('d', path);
    paths.attr('d', path);
    placeUnits();
    placeMarks();
    placeFx();
  }
  const requestDraw = () => { if (!frame) frame = requestAnimationFrame(draw); };

  // ── 입력: d3-zoom 의 이동량을 회전으로, 배율을 확대로 쓴다 ──
  // 한 손가락·마우스 끌기 = 회전, 휠·두 손가락 = 그 지점을 중심으로 확대.
  // d3-zoom 의 이동량은 확대 중심 보정까지 섞여 있으므로, 회전은 직접 잰 포인터 이동으로만 한다.
  let last = null;
  let samples = [];
  let pan = { x: 0, y: 0 };          // 지금까지 끈 거리 (관성 계산용)
  let lastFocus = null;              // 두 손가락 중심 (이전 프레임)
  const zoomer = zoom()
    .scaleExtent([K_MIN, K_MAX])
    .on('start', (event) => {
      stopMotion();
      last = event.transform;
      samples = [];
      lastFocus = null;
    })
    .on('zoom', (event) => {
      const t = event.transform;
      const src = event.sourceEvent;
      const touches = src?.touches;
      if (!src) {
        view.k = t.k;                                   // 코드에서 맞춘 배율 (syncZoom 등)
      } else if (src.type === 'wheel') {
        zoomAround(localPoint(src), t.k);
      } else if (touches && touches.length >= 2) {
        const f = touchCenter(touches);
        if (lastFocus) panBy(f[0] - lastFocus[0], f[1] - lastFocus[1]);
        lastFocus = f;
        zoomAround(f, t.k);
      } else {
        lastFocus = null;
        if (last) panBy(t.x - last.x, t.y - last.y);
        view.k = t.k;
      }
      last = t;
      requestDraw();
    })
    .on('end', () => {
      // 손을 뗄 때의 속도로 관성 회전
      const now = performance.now();
      const recent = samples.filter((s) => now - s.time < 120);
      if (recent.length >= 2) {
        const a = recent[0], b = recent[recent.length - 1];
        const dt = Math.max(16, b.time - a.time);
        startInertia(((b.x - a.x) / dt) * 16, ((b.y - a.y) / dt) * 16);
      }
      samples = [];
      lastFocus = null;
    });
  svg.call(zoomer).on('dblclick.zoom', null);

  function panBy(dx, dy) {
    rotateBy(dx, dy);
    pan = { x: pan.x + dx, y: pan.y + dy };
    samples.push({ ...pan, time: performance.now() });
    if (samples.length > 6) samples.shift();
  }

  const localPoint = (e) => {
    const r = svg.node().getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  function touchCenter(touches) {
    const r = svg.node().getBoundingClientRect();
    let x = 0, y = 0;
    for (const t of touches) { x += t.clientX; y += t.clientY; }
    return [x / touches.length - r.left, y / touches.length - r.top];
  }

  // 화면의 점 p 아래에 있던 땅이 확대 뒤에도 p 에 남도록 배율을 바꾼다
  function zoomAround(p, k) {
    k = Math.max(K_MIN, Math.min(K_MAX, k));
    projection.rotate(view.rotate).scale(radius * view.k).translate([width / 2, height / 2]);
    const geo = projection.invert(p);
    const visible = geo && geoDistance(geo, [-view.rotate[0], -view.rotate[1]]) < Math.PI / 2;
    view.k = k;
    if (!visible) return;                    // 지구 밖을 가리키면 가운데 기준
    for (let i = 0; i < 3; i++) {
      projection.rotate(view.rotate).scale(radius * view.k);
      const q = projection(geo);
      if (!q) break;
      const dx = p[0] - q[0], dy = p[1] - q[1];
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) break;
      rotateBy(dx, dy);
    }
  }

  function rotateBy(dx, dy) {
    const r = radius * view.k;
    view.rotate = [view.rotate[0] + (dx / r) * DEG, clampLat(view.rotate[1] - (dy / r) * DEG)];
  }
  const clampLat = (v) => Math.max(-85, Math.min(85, v));

  // d3-zoom 이 기억하는 배율을 조용히 맞춘다 (이벤트 없이)
  function syncZoom() {
    svg.property('__zoom', zoomIdentity.scale(view.k));
  }

  function startInertia(vx, vy) {
    if (Math.hypot(vx, vy) < 1) return;
    const step = () => {
      vx *= 0.93; vy *= 0.93;
      rotateBy(vx, vy);
      draw();
      inertia = Math.hypot(vx, vy) > 0.15 ? requestAnimationFrame(step) : null;
    };
    inertia = requestAnimationFrame(step);
  }

  function stopMotion() {
    if (inertia) cancelAnimationFrame(inertia);
    inertia = null;
    if (flight) cancelAnimationFrame(flight.raf);
    flight = null;
    spinning = false;
  }

  // ── 부드러운 이동: 대권(큰 원)을 따라 돌면서, 멀리 갈수록 살짝 멀어졌다 다가온다 ──
  function flyTo(targetCenter, targetK, { duration } = {}) {
    stopMotion();
    const from = [-view.rotate[0], -view.rotate[1]];
    const arc = geoDistance(from, targetCenter);
    const interp = geoInterpolate(from, targetCenter);
    const k0 = view.k;
    const dip = Math.min(1, arc / (Math.PI / 2)) * 0.32;
    const ms = duration ?? Math.min(1500, 650 + arc * 520);
    const t0 = performance.now();
    const f = { raf: 0 };
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      const e = easeCubicInOut(t);
      const [lon, lat] = interp(e);
      view.rotate = [-lon, clampLat(-lat)];
      view.k = (k0 + (targetK - k0) * e) * (1 - dip * Math.sin(Math.PI * e));
      draw();
      if (t < 1) f.raf = requestAnimationFrame(step);
      else { flight = null; syncZoom(); }
    };
    f.raf = requestAnimationFrame(step);
    flight = f;
  }

  // 나라를 화면의 'center' 지점(패널을 피한 영역의 중심)으로 데려온다
  function focus(id, { center = null, scale = null } = {}) {
    const f = byId.get(id);
    if (!f) return;
    const geo = anchorGeo.get(id);
    // 화면에 보일 크기로 배율을 고른다 (지금이 더 크게 보고 있으면 유지)
    const probe = geoOrthographic().rotate([-geo[0], -geo[1]]).scale(radius).translate([0, 0]).clipAngle(90);
    const [[x0, y0], [x1, y1]] = geoPath(probe).bounds(f);
    const span = Math.max(x1 - x0, y1 - y0, 1);
    const fitK = (Math.min(width, height) * 0.42) / span;
    let k = scale ?? Math.max(1.5, Math.min(4, fitK));
    if (scale == null && view.k > k && view.k <= fitK * 1.6) k = view.k;
    k = Math.max(K_MIN, Math.min(K_MAX, k));
    // 화면 중심이 아닌 지점에 놓으려면, 그만큼 비켜선 지점을 중심으로 돌린다
    let target = geo;
    if (center) {
      const p = geoOrthographic().rotate([-geo[0], -geo[1]]).scale(radius * k).translate([width / 2, height / 2]).clipAngle(90);
      const shifted = p.invert([width - center[0], height - center[1]]);
      if (shifted && Number.isFinite(shifted[0])) target = shifted;
    }
    flyTo(target, k);
  }

  function zoomBy(factor) {
    const k = Math.max(K_MIN, Math.min(K_MAX, view.k * factor));
    flyTo([-view.rotate[0], -view.rotate[1]], k, { duration: 320 });
  }

  // 처음 바다를 건널 때: 두 나라 사이를 중심으로 천천히 멀어지며 지구 전체를 보여 준다
  function reveal(fromId, toId) {
    const a = anchorGeo.get(fromId), b = anchorGeo.get(toId);
    if (!a || !b) return resetView();
    flyTo(geoInterpolate(a, b)(0.5), 1, { duration: 2600 });
  }

  function resetView() {
    flyTo([-view.rotate[0], 15], 1, { duration: 700 });
  }

  // 시작 화면에서 천천히 도는 지구
  function spin(on = true) {
    stopMotion();
    spinning = on;
    if (!on) return;
    let prev = performance.now();
    const step = (now) => {
      if (!spinning) return;
      view.rotate = [view.rotate[0] + (now - prev) * 0.006, view.rotate[1]];
      prev = now;
      draw();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ── 강조 ──
  function setFill(fn) {
    paths.style('fill', (d) => fn(d.id));
  }

  function setSelected(id) {
    paths.classed('is-selected', (d) => d.id === id);
    paths.filter((d) => d.id === id).raise();
  }

  function setReach(reach, from = null) {
    const on = Boolean(reach);
    svg.classed('is-targeting', on);
    paths
      .classed('is-reachable', (d) => on && reach.has(d.id))
      .classed('is-origin', (d) => on && d.id === from);
    if (on) paths.filter((d) => reach.has(d.id)).raise();
  }

  // units: [{ key, at, icon, count, selected, ready, offset, onClick }]
  function setUnits(units) {
    const sel = unitLayer.selectAll('g.unit-pin').data(units, (d) => d.key);
    sel.exit().remove();
    const enter = sel.enter().append('g').attr('class', 'unit-pin');
    enter.append('circle').attr('class', 'unit-pin-ring').attr('r', 15);
    enter.append('circle').attr('class', 'unit-pin-bg').attr('r', 11);
    enter.append('g').attr('class', 'unit-pin-icon').attr('transform', 'translate(-7,-7) scale(0.5833)');
    enter.append('g').attr('class', 'unit-pin-count');
    const all = enter.merge(sel);
    all.classed('is-selected', (d) => d.selected).classed('is-ready', (d) => d.ready);
    all.select('.unit-pin-icon').html((d) => d.icon);
    all.select('.unit-pin-count').html((d) => (d.count > 1 ? `<circle cx="10" cy="-9" r="7"></circle><text x="10" y="-9">${d.count}</text>` : ''));
    all.on('click', (event, d) => { event.stopPropagation(); d.onClick?.(); });
    placeUnits();
  }

  // 지구 뒤편에 있는 유닛은 숨긴다
  function placeUnits() {
    const center = [-view.rotate[0], -view.rotate[1]];
    unitLayer.selectAll('g.unit-pin').each(function (d) {
      const g = anchorGeo.get(d.at);
      const visible = g && geoDistance(g, center) < Math.PI / 2 - 0.08;
      const el = select(this);
      if (!visible) { el.attr('display', 'none'); return; }
      const [x, y] = projection(g);
      el.attr('display', null).attr('transform', `translate(${x + (d.offset ?? 0)},${y})`);
    });
  }

  // ── 표시: 성지(빛나는 점)와 활동 금지(붉은 테두리) ──
  let holyIds = [];
  function setMarks(holy = [], banned = []) {
    holyIds = holy;
    const bannedSet = new Set(banned);
    paths.classed('is-banned', (d) => bannedSet.has(d.id));
    const sel = markLayer.selectAll('g.holy-mark').data(holyIds, (d) => d);
    sel.exit().remove();
    const g = sel.enter().append('g').attr('class', 'holy-mark');
    g.append('circle').attr('class', 'holy-glow').attr('r', 9);
    g.append('path').attr('class', 'holy-star').attr('d', 'M0-6 1.6-1.6 6 0 1.6 1.6 0 6-1.6 1.6-6 0-1.6-1.6Z');
    placeMarks();
  }
  function placeMarks() {
    const center = [-view.rotate[0], -view.rotate[1]];
    markLayer.selectAll('g.holy-mark').each(function (id) {
      const g = anchorGeo.get(id);
      const el = select(this);
      if (!g || geoDistance(g, center) > Math.PI / 2 - 0.05) { el.attr('display', 'none'); return; }
      const [x, y] = projection(g);
      el.attr('display', null).attr('transform', `translate(${x},${y - 16})`);
    });
  }

  // ── 연출: 전파 파동 · 새 나라 진입 · 압수수색 · 성지 ──
  // 지구가 돌아도 그 나라에 붙어 있도록 매 프레임 위치를 다시 잡는다
  const fx = [];
  let fxFrame = 0;
  const FX = {
    spread: { rings: 2, dur: 1300, r: 34, cls: 'fx-spread' },
    burst: { rings: 3, dur: 1700, r: 70, cls: 'fx-burst' },
    new: { rings: 2, dur: 2200, r: 46, cls: 'fx-new', label: true },
    raid: { rings: 2, dur: 1600, r: 40, cls: 'fx-raid' },
    holy: { rings: 3, dur: 2000, r: 56, cls: 'fx-holy' },
  };
  function pulse(id, kind = 'spread', text = '') {
    const k = FX[kind] ?? FX.spread;
    if (!anchorGeo.has(id) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = fxLayer.append('g').attr('class', `fx ${k.cls}`);
    const rings = Array.from({ length: k.rings }, () => g.append('circle'));
    const label = k.label && text ? g.append('text').attr('class', 'fx-label').text(text) : null;
    fx.push({ id, k, g, rings, label, t0: performance.now() });
    if (!fxFrame) fxFrame = requestAnimationFrame(tickFx);
  }
  function tickFx(now) {
    fxFrame = 0;
    placeFx(now);
    if (fx.length) fxFrame = requestAnimationFrame(tickFx);
  }
  function placeFx(now = performance.now()) {
    const center = [-view.rotate[0], -view.rotate[1]];
    for (let i = fx.length - 1; i >= 0; i--) {
      const f = fx[i];
      const t = (now - f.t0) / f.k.dur;
      if (t >= 1) { f.g.remove(); fx.splice(i, 1); continue; }
      const geo = anchorGeo.get(f.id);
      if (geoDistance(geo, center) > Math.PI / 2 - 0.05) { f.g.attr('display', 'none'); continue; }
      const [x, y] = projection(geo);
      f.g.attr('display', null).attr('transform', `translate(${x},${y})`);
      f.rings.forEach((c, j) => {
        const tt = Math.max(0, Math.min(1, t * 1.25 - j * 0.22));
        const e = 1 - (1 - tt) ** 3;
        c.attr('r', 4 + e * f.k.r).attr('opacity', tt <= 0 ? 0 : (1 - tt) * 0.9);
      });
      if (f.label) f.label.attr('opacity', t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1).attr('y', -20 - t * 10);
    }
  }

  // 단계 상승: 지구 테두리가 한 번 빛난다
  function flash() {
    svg.classed('is-flash', false);
    void svg.node().getBoundingClientRect();
    svg.classed('is-flash', true);
    setTimeout(() => svg.classed('is-flash', false), 2400);
  }

  // 프랑스처럼 해외 영토가 있는 나라는 가장 큰 땅덩이 중심에 표시한다
  function anchorOf(f) {
    const g = f.geometry;
    if (g.type !== 'MultiPolygon') return geoCentroid(f);
    let best = null, bestArea = -1;
    for (const coords of g.coordinates) {
      const part = { type: 'Polygon', coordinates: coords };
      const a = geoArea(part);
      if (a > bestArea) { bestArea = a; best = part; }
    }
    return geoCentroid(best);
  }
  anchorGeo = new Map(features.map((f) => [f.id, anchorOf(f)]));

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    radius = Math.min(width, height) * 0.44;
    zoomer.extent([[0, 0], [width, height]]);
    draw();
  }

  function bind(h) { handlers = h ?? {}; }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();
  syncZoom();

  return { bind, setFill, setSelected, setReach, setUnits, setMarks, pulse, flash, focus, zoomBy, resetView, reveal, spin, resize, ids: () => features.map((f) => f.id) };
}
