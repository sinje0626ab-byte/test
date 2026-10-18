// 밸런스 확인용 헤드리스 시뮬레이션. 단순한 자동 플레이어로 게임을 끝까지 돌려 본다.
// 실행: node tools/simulate.mjs [시작국가ID] [신앙대상] [교리,교리,교리] [최대턴]
import { readFileSync } from 'node:fs';
import { initWorld, world } from '../src/data/loader.js';
import { createState, totalFollowers, presenceCount, dateLabel } from '../src/game/state.js';
import { endTurn, faithIncome } from '../src/game/turn.js';
import { spawnUnit, spawnBlocker, actUnit, moveUnit, reachable, canAct, unlockedTypes } from '../src/units/units.js';
import { share, difficulty } from '../src/religion/spread.js';
import { stageOf } from '../src/game/stages.js';

const json = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url)));
initWorld(json('countries.json'), json('adjacency.json'), json('religions.json'));

const [home = '410', deity = 'cosmos', tenets = 'healing,open,communal', maxTurns = '400'] = process.argv.slice(2);
const state = createState({ name: '시험', founder: '교주', color: '#0a84ff', deity, tenets: tenets.split(','), home });
console.log(`${world.countries[home].name} 난이도 ${difficulty(home).label} (${difficulty(home).score.toFixed(2)})`);

const best = () => world.ids.reduce((a, b) => (state.countries[a].followers > state.countries[b].followers ? a : b));

for (let t = 0; t < Number(maxTurns) && !state.result; t++) {
  // 생산: 가장 신도가 많은 나라에서 해금된 유닛을 돌아가며 산다
  const order = ['missionary', 'witness', 'missionary', 'theologian', 'relief', 'guardian'];
  for (const type of order) {
    if (!unlockedTypes(state).has(type)) continue;
    if (!spawnBlocker(state, type, best())) spawnUnit(state, type, best());
  }
  for (const u of [...state.units]) {
    // 행동형 유닛: 비율이 낮은 이웃으로 옮긴 뒤 행동
    if (['missionary', 'witness', 'relief'].includes(u.type)) {
      const opts = [...reachable(u.at).keys()].sort((a, b) => share(state, a) - share(state, b) || world.countries[b].pop - world.countries[a].pop);
      if (share(state, u.at) > 0.05 && opts.length) moveUnit(state, u.id, opts[0]);
      if (canAct(u)) actUnit(state, u.id);
    }
  }
  const r = endTurn(state);
  if (t % 12 === 11 || r.stages.length || state.result) {
    const total = totalFollowers(state);
    console.log(`${dateLabel(state.turn).padEnd(10)} 신도 ${Math.round(total).toLocaleString().padStart(14)} (${(total / world.totalPop * 100).toFixed(3)}%)  진출 ${presenceCount(state, 1000)}곳  신앙력 ${Math.round(state.faith)} (+${faithIncome(state)})  유닛 ${state.units.length}  ${stageOf(state.stage).name}${r.stages.length ? ' ▲' : ''}`);
  }
}
console.log('결과:', state.result ?? '진행 중', `${state.turn}턴`);
