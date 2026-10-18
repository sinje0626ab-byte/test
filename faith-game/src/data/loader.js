// 정적 세계 데이터. 부트할 때 한 번 initWorld()로 채우고 이후엔 읽기만 한다.
// (브라우저는 main.js가 JSON을 import해서 넘기고, 노드 시뮬레이션은 fs로 읽어서 넘긴다)

export const world = {
  ids: [],          // 게임에 쓰는 국가 ID 목록
  countries: {},    // id → { id, name, region, pop, urban, freedom, gdpTier, religions, land, sea, detailed }
  religions: {},    // 기존 종교 id → { name, color }
  religionOrder: [],
  totalPop: 0,
};

export function initWorld(countriesJson, adjacencyJson, religionsJson) {
  const { regionDefaults, countries } = countriesJson;
  world.religions = religionsJson.list;
  world.religionOrder = religionsJson.order;
  world.ids = [];
  world.countries = {};
  world.totalPop = 0;

  for (const [id, raw] of Object.entries(countries)) {
    const def = regionDefaults[raw.region];
    if (!def) throw new Error(`지역 기본값이 없습니다: ${raw.region}`);
    const c = {
      id,
      name: raw.name,
      region: raw.region,
      pop: raw.pop,
      urban: raw.urban ?? def.urban,
      freedom: raw.freedom ?? def.freedom,
      gdpTier: raw.gdpTier ?? def.gdpTier,
      religions: normalize(raw.religions ?? def.religions),
      detailed: Boolean(raw.religions),
      land: adjacencyJson.land[id] ?? [],
      sea: adjacencyJson.sea[id] ?? [],
    };
    world.countries[id] = c;
    world.ids.push(id);
    world.totalPop += c.pop;
  }
  return world;
}

function normalize(rel) {
  const total = Object.values(rel).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(Object.entries(rel).map(([k, v]) => [k, v / total]));
}

export const country = (id) => world.countries[id];
