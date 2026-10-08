import { rand } from './random.js';

// 습격 난이도 공식 (config.raid). 진행도 = max(기지 레벨, 플레이어 레벨/5) + 처치한 보스 수
export function raidProgress(c, baseLevel, playerLevel, bossesCleared) {
  return Math.max(baseLevel, Math.floor(playerLevel / c.progressPerPlayerLevels)) + bossesCleared;
}

// 날짜 배율: 처음 12일은 빠르게, 그 뒤로는 완만하게
export function dayFactor(c, day) {
  return Math.min(day - 1, c.dayEarlyCap) * c.dayFactorEarly + Math.max(0, day - 1 - c.dayEarlyCap) * c.dayFactorLate;
}

// 지역 배율은 regionWeight 만큼만 (진행도에 보스 처치가 이미 들어 있어서 겹치지 않게, 3차 개선 B-5)
export const raidRegionFactor = (c, region) => 1 + (region.statMultiplier - 1) * (c.regionWeight ?? 1);

export function raidStatScale(c, progress, day, region) {
  return (1 + progress * c.statPerProgress + dayFactor(c, day)) * raidRegionFactor(c, region);
}

export function raidCount(c, progress, day, region) {
  const n = c.baseCount + progress * c.countPerProgress + region.difficulty * c.perRegionDifficulty + Math.min(day - 1, c.countDayCap);
  return Math.min(c.maxCount, Math.round(n));
}

// 가중치 목록에서 하나
export function pickWeighted(pool) {
  const total = pool.reduce((a, p) => a + p.weight, 0);
  let r = rand.range(0, total);
  for (const p of pool) {
    r -= p.weight;
    if (r <= 0) return p.monster;
  }
  return pool[pool.length - 1].monster;
}

// 습격 몬스터 평균 체력 (원격 계산)
export function poolAverageHp(pool, monsters) {
  const total = pool.reduce((a, p) => a + p.weight, 0);
  return pool.reduce((a, p) => a + monsters[p.monster].hp * p.weight, 0) / total;
}

// total을 waves개로 나눈다 (앞 웨이브가 조금 적게)
export function splitWaves(total, waves) {
  const out = [];
  for (let i = 0; i < waves; i++) out.push(Math.floor((total + i) / waves));
  return out;
}

export const isBloodMoon = (c, day) => day % c.bloodMoon.every === 0;

// 습격 풀 가중 평균: 몬스터마다 f(def) 를 무게만큼
function poolAverage(pool, monsters, f) {
  const total = pool.reduce((a, p) => a + p.weight, 0);
  return pool.reduce((a, p) => a + f(monsters[p.monster]) * p.weight, 0) / total;
}

// 원격 습격 포탑 실효 화력 (3차 개선 B-5). info = turretInfo(...) 목록 [{ id, level, info, aoeFactor }]
//  한 발 = 실전 피해 공식(습격 풀 방어 가중 평균) × 연사 × 명중률 × 발 수 × 관통 보정 × 범위
//  + 독(중첩 remotePoisonStacks 가정)  /  서리: 다른 포탑 화력 합 × 감속 × remoteFrostBonus 를 더한다
export function remoteFirepower(list, pool, monsters, cfg) {
  const c = cfg.raid;
  const minRatio = cfg.combat.minDamageRatio;
  let slow = 0;
  const rows = list.map(({ id, level, info, aoeFactor = 1 }) => {
    const hit = poolAverage(pool, monsters, (m) => Math.max(info.damage * minRatio, info.damage - (m.defense ?? 0) * (1 - info.armorPierce)));
    const pierce = 1 + (info.pierce - 1) * c.remotePierceChance;
    const direct = hit * info.fireRate * c.remoteAccuracy * info.shots * pierce * aoeFactor;
    const e = info.effect;
    const poison = e?.type === 'poison' ? e.amount * Math.min(c.remotePoisonStacks, e.maxStacks) : 0;
    if (e?.type === 'slow') slow = Math.max(slow, e.amount);
    return { id, level, hit, direct, poison, frost: e?.type === 'slow' };
  });
  // 감속은 겹치지 않는다(가장 센 서리 하나). 서리 포탑 자신의 화력엔 붙지 않는다
  const others = rows.filter((r) => !r.frost).reduce((a, r) => a + r.direct + r.poison, 0);
  const slowBonus = others * slow * c.remoteFrostBonus;
  const total = rows.reduce((a, r) => a + r.direct + r.poison, 0) + slowBonus;
  return { rows, slow, slowBonus, total };
}
