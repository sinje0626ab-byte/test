import { geoNaturalEarth1, geoPath, geoCentroid, geoArea } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import 'd3-transition';
import { feature } from 'topojson-client';
import { geometryId, EXCLUDED_IDS } from '../data/ids.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// 세계지도. 게임 상태를 모르고, 색·강조·유닛 표시를 받아서 그리기만 한다.
export function createWorldMap(container, topology) {
  let handlers = {};
  const features = feature(topology, topology.objects.countries).features
    .map((f) => ({ ...f, id: geometryId(f) }))
    .filter((f) => f.id && !EXCLUDED_IDS.has(f.id));
  const byId = new Map(features.map((f) => [f.id, f]));

  const svg = select(container).append('svg').attr('class', 'world-map').attr('role', 'img').attr('aria-label', '세계지도');
  const root = svg.append('g').attr('class', 'map-root');
  const sphere = root.append('path').attr('class', 'map-sphere');
  const countryLayer = root.append('g').attr('class', 'map-countries');
  const unitLayer = svg.append('g').attr('class', 'map-units'); // 줌 배율과 무관하게 같은 크기로 그린다

  const projection = geoNaturalEarth1();
  const path = geoPath(projection);
  let transform = zoomIdentity;
  let width = 0, height = 0;
  let anchors = new Map();
  let unitData = [];

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

  const zoomer = zoom()
    .scaleExtent([1, 12])
    .on('zoom', (event) => {
      transform = event.transform;
      root.attr('transform', transform);
      svg.style('--k', transform.k);
      placeUnits();
    });
  svg.call(zoomer).on('dblclick.zoom', null);

  // 프랑스처럼 해외 영토가 있는 나라는 가장 큰 땅덩이 중심에 표시한다
  function anchorOf(f) {
    const g = f.geometry;
    if (g.type !== 'MultiPolygon') return projection(geoCentroid(f));
    let best = null, bestArea = -1;
    for (const coords of g.coordinates) {
      const part = { type: 'Polygon', coordinates: coords };
      const a = geoArea(part);
      if (a > bestArea) { bestArea = a; best = part; }
    }
    return projection(geoCentroid(best));
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    projection.fitExtent([[12, 12], [width - 12, height - 12]], { type: 'Sphere' });
    sphere.attr('d', path({ type: 'Sphere' }));
    paths.attr('d', path);
    anchors = new Map(features.map((f) => [f.id, anchorOf(f)]));
    zoomer.translateExtent([[-width * 0.25, -height * 0.25], [width * 1.25, height * 1.25]]).extent([[0, 0], [width, height]]);
    placeUnits();
  }

  function setFill(fn) {
    paths.style('fill', (d) => fn(d.id));
  }

  function setSelected(id) {
    paths.classed('is-selected', (d) => d.id === id);
    paths.filter((d) => d.id === id).raise();
  }

  // reach: Map(id → 'land'|'sea') 또는 null. from: 출발 나라
  function setReach(reach, from = null) {
    const on = Boolean(reach);
    svg.classed('is-targeting', on);
    paths
      .classed('is-reachable', (d) => on && reach.has(d.id))
      .classed('is-origin', (d) => on && d.id === from);
    if (on) paths.filter((d) => reach.has(d.id)).raise();
  }

  // units: [{ key, at, icon, count, selected, ready }]
  function setUnits(units) {
    unitData = units;
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

  function placeUnits() {
    unitLayer.selectAll('g.unit-pin').attr('transform', (d) => {
      const a = anchors.get(d.at);
      if (!a) return 'translate(-999,-999)';
      const [x, y] = transform.apply(a);
      return `translate(${x + (d.offset ?? 0)},${y})`;
    });
  }

  function focus(id, scale = 3) {
    const a = anchors.get(id);
    if (!a) return;
    const f = byId.get(id);
    const [[x0, y0], [x1, y1]] = path.bounds(f);
    const fit = Math.min(8, 0.5 / Math.max((x1 - x0) / width, (y1 - y0) / height));
    const k = Math.max(transform.k, Math.min(scale, fit));
    const t = zoomIdentity.translate(width / 2, height / 2).scale(k).translate(-a[0], -a[1]);
    svg.transition().duration(650).call(zoomer.transform, t);
  }

  function zoomBy(factor) {
    svg.transition().duration(250).call(zoomer.scaleBy, factor);
  }

  function resetView() {
    svg.transition().duration(500).call(zoomer.transform, zoomIdentity);
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();

  // 입력 처리기를 바꿔 끼운다 (화면이 바뀌어도 지도는 그대로 둔다)
  function bind(h) { handlers = h ?? {}; }

  return { bind, setFill, setSelected, setReach, setUnits, focus, zoomBy, resetView, resize, ids: () => features.map((f) => f.id) };
}
