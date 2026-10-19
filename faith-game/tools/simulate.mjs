// 밸런스 확인용 헤드리스 시뮬레이터.
// 계시·사건 선택지를 성향(policy)에 따라 자동으로 고르고, 유닛·기적·성지를 굴려 끝까지 돌린다.
//   node tools/simulate.mjs --table                     여러 조합 결과 표
//   node tools/simulate.mjs --policy good --home 410 --deity founder --tenets communal,healing,ascetic --seed 3 --log
// policy: idle(턴만 넘김) · good(괜찮은 플레이) · dark(어두운 선택만)
import { readFileSync } from 'node:fs';
import { initWorld, world } from '../src/data/loader.js';
import { createState, totalFollowers, presenceCount } from '../src/game/state.js';
import { endTurn, faithIncome } from '../src/game/turn.js';
import { spawnUnit, spawnBlocker, actUnit, moveUnit, reachable, canAct, unlockedTypes, unitCap, unitCost } from '../src/units/units.js';
import { spreadAmount } from '../src/religion/spread.js';
import { performMiracle, miracleBlocker, buildHolySite, holySiteBlocker } from '../src/game/actions.js';
import { dueRevelation, resolveRevelation, dueIncident, resolveIncident, choiceAvailable } from '../src/story/storyEngine.js';
import { stageOf } from '../src/game/stages.js';

const json = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url)));
initWorld(json('countries.json'), json('adjacency.json'), json('religions.json'));

// ── 성향별 선택 ──
const PREFS = {
  good: { II: 'downtown', III: 'booth', V: ['charity', 'hide'], VI: ['estate', 'business'], VII: [['loyal'], ['council']], VIII: ['lawyers', 'martyr'], IX: ['inner'] },
  dark: { II: 'campus', III: 'network', V: ['lawsuit', 'hide'], VI: ['savings'], VII: [['blood', 'immortal'], ['staged']], VIII: ['scapegoat', 'lawyers'], IX: ['rebrand'] },
};
const DARK_TENETS = ['tithe', 'healing', 'communal'];
const GOOD_TENETS = ['communal', 'ascetic', 'open'];

function firstAvailable(state, part, prefs = []) {
  for (const id of prefs) {
    const c = part.choices.find((x) => x.id === id);
    if (c && choiceAvailable(state, c) === true) return c.id;
  }
  return part.choices.find((c) => choiceAvailable(state, c) === true).id;
}

function answerRevelation(state, ch, opt) {
  const pref = PREFS[opt.policy] ?? {};
  return ch.parts.map((part, i) => {
    if (part.kind === 'text') return '시험 교단';
    if (part.kind === 'country') return opt.home;
    if (ch.id === 'I') return [opt.deity];
    if (ch.id === 'II') return [opt.site ?? pref.II ?? part.choices[0].id];
    if (ch.id === 'III') return [opt.method ?? pref.III ?? part.choices[0].id];
    if (ch.id === 'IV') {
      const want = opt.tenets ?? (opt.policy === 'dark' ? DARK_TENETS : opt.policy === 'good' ? GOOD_TENETS : part.choices.slice(0, 3).map((c) => c.id));
      return want;
    }
    if (ch.id === 'VII') return [firstAvailable(state, part, pref.VII?.[i] ?? [])];
    return [firstAvailable(state, part, pref[ch.id] ?? [])];
  });
}

function answerIncident(state, card, opt) {
  const ok = card.choices.filter((c) => choiceAvailable(state, c) === true);
  if (opt.policy === 'dark') return (ok.find((c) => c.dark) ?? ok[0]).id;
  if (opt.policy === 'good') {
    const clean = ok.filter((c) => !c.dark);
    // 비용 있는 선택은 여유가 있을 때만
    const pick = clean.find((c) => !c.cost || state.faith > c.cost(state) * 3) ?? clean[0] ?? ok[0];
    return pick.id;
  }
  return ok[0].id;
}

// ── 유닛·신앙력 운용 (good·dark) ──
// 나라마다 '지금 유닛을 보내면 얼마나 늘까'(P)를 매 턴 한 번 계산하고, 그 근처에서 생산·이동한다.
function potentials(state) {
  const P = {};
  for (const id of world.ids) {
    const cs = state.countries[id];
    P[id] = cs.banned || cs.alert > 0.62 ? 0 : spreadAmount(state, id, 1) * (1 - cs.alert * 0.5);
  }
  return P;
}

const topCountries = (state) => world.ids.filter((id) => state.countries[id].followers > 0).sort((a, b) => state.countries[b].followers - state.countries[a].followers);

function play(state) {
  const top = topCountries(state);
  const base = top[0];
  if (!base) return;
  const P = potentials(state);
  const near = (id) => Math.max(P[id], ...[...reachable(id).keys()].map((n) => P[n]));
  // 생산 위치: 주변에 기회가 가장 큰 거점
  const sites = world.ids.filter((id) => state.countries[id].followers >= 3 && !state.countries[id].banned);
  const site = sites.sort((a, b) => near(b) - near(a))[0] ?? base;
  const reserve = 20 + faithIncome(state) * 0.5;
  for (let guard = 0; guard < 12 && state.units.length < unitCap(state); guard++) {
    const counts = Object.fromEntries(['missionary', 'relief', 'guardian', 'theologian', 'witness'].map((t) => [t, state.units.filter((u) => u.type === t).length]));
    const hot = top.slice(0, 20).filter((id) => !state.units.some((u) => u.type === 'relief' && u.at === id)).find((id) => state.countries[id].aversion > 0.3 || state.countries[id].alert > 0.45);
    let type = 'missionary', at = site;
    if (hot && counts.relief < 1 + Math.floor(state.units.length / 6) && unlockedTypes(state).has('relief')) { type = 'relief'; at = hot; }
    else if (unlockedTypes(state).has('theologian') && counts.theologian < Math.floor(state.units.length / 4)) type = 'theologian';
    else if (unlockedTypes(state).has('witness') && state.faith > reserve * 4) type = 'witness';
    else if (counts.guardian < 1 && totalFollowers(state) > 3000) { type = 'guardian'; at = base; }
    if (spawnBlocker(state, type, at) || state.faith - unitCost(state, type, at) < (type === 'missionary' ? 0 : reserve)) break;
    spawnUnit(state, type, at);
  }
  // 이동·행동: 닿는 곳 중 가장 기회가 큰 나라로
  for (const u of [...state.units]) {
    if (u.type === 'guardian') {
      if (!u.moved && u.at !== base && reachable(u.at).has(base)) moveUnit(state, u.id, base);
      continue;
    }
    if (u.type !== 'relief' && !u.moved) {
      let best = u.at;
      for (const n of reachable(u.at).keys()) if (P[n] > P[best]) best = n;
      if (best !== u.at) moveUnit(state, u.id, best);
    }
    if (canAct(u, state)) {
      actUnit(state, u.id);
      P[u.at] = state.countries[u.at].banned ? 0 : spreadAmount(state, u.at, 1);
    }
  }
  // 기적: 여유 있을 때 가장 효과 큰 나라
  if (state.faith > reserve * 2) {
    const t = top.filter((id) => !miracleBlocker(state, id)).sort((a, b) => P[b] - P[a])[0];
    if (t) performMiracle(state, t);
  }
  // 성지
  for (const id of top.slice(0, 14)) if (!holySiteBlocker(state, id) && state.faith > reserve * 2) buildHolySite(state, id);
}

export function runGame(opt) {
  const state = createState({ founder: '교주', age: opt.age ?? 41, color: '#0a84ff', emblem: 'sun', seed: opt.seed });
  const out = { reached: {}, revs: {}, dark: 0, events: {} };
  const handleStory = (report) => {
    for (let ch = dueRevelation(state); ch; ch = dueRevelation(state)) {
      resolveRevelation(state, ch, answerRevelation(state, ch, opt));
      out.revs[ch.id] = state.turn;
      if (opt.log) console.log(`  [계시 ${ch.numeral}] ${state.story.done[ch.id].outcome ?? ''} ${state.story.log.at(-1).lines.join(' / ')}`);
      if (state.result) return;
    }
    const inc = dueIncident(state, report);
    if (inc) {
      const id = answerIncident(state, inc.card, opt);
      const r = resolveIncident(state, inc.card, inc.ctx, id);
      if (opt.log) console.log(`  [사건] ${inc.card.title} → ${id}: ${r.outcome}`);
    }
  };
  handleStory(null);
  for (let t = 0; t < opt.turns && !state.result; t++) {
    if (opt.policy !== 'idle') play(state);
    const report = endTurn(state);
    for (const e of report.events) out.events[e.type] = (out.events[e.type] ?? 0) + 1;
    const total = totalFollowers(state);
    for (const m of [100, 1000, 10_000, 1e6, 1e8]) if (total >= m && out.reached[m] == null) out.reached[m] = state.turn;
    if (opt.log && (state.turn % 12 === 0 || report.stages.length || state.result)) {
      console.log(`${String(state.turn).padStart(4)}턴  신도 ${Math.round(total).toLocaleString().padStart(14)}  진출 ${String(presenceCount(state, 1000)).padStart(3)}  신앙력 ${String(Math.round(state.faith)).padStart(6)} (+${faithIncome(state)})  유닛 ${state.units.length}/${unitCap(state)}  결속 ${Math.round(state.unity)}  장부 ${state.riskPoints}  본거지 경계 ${Math.round(state.countries[state.religion.home].alert * 100)}%  나이 ${state.leader.age}  ${stageOf(state.stage).name}`);
    }
    if (!state.result) handleStory(report);
  }
  out.result = state.result ?? 'ongoing';
  out.reason = state.defeatReason;
  out.turn = state.turn;
  out.dark = state.riskPoints;
  out.peak = state.peakFollowers;
  if (opt.keepState) out.state = state;
  return out;
}

// ── 명령줄 ──
const args = process.argv.slice(2);
const flag = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const has = (k) => args.includes(`--${k}`);

if (has('table')) {
  const { table } = await import('./simtable.mjs');
  table(runGame, Number(flag('seeds', 4)));
} else if (process.argv[1].endsWith('simulate.mjs')) {
  const opt = {
    policy: flag('policy', 'good'), home: flag('home', '410'), deity: flag('deity', 'founder'),
    tenets: flag('tenets') ? flag('tenets').split(',') : null, site: flag('site'), method: flag('method'),
    seed: Number(flag('seed', 1)), turns: Number(flag('turns', 420)), log: has('log'),
  };
  const r = runGame(opt);
  console.log(JSON.stringify(r));
}
