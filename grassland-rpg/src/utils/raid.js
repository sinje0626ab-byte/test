import { rand } from './random.js';

// 습격 난이도 공식 (config.raid). 진행도 = max(기지 레벨, 플레이어 레벨/5) + 처치한 보스 수
export function raidProgress(c, baseLevel, playerLevel, bossesCleared) {
  return Math.max(baseLevel, Math.floor(playerLevel / c.progressPerPlayerLevels)) + bossesCleared;
}

// 날짜 배율: 처음 12일은 빠르게, 그 뒤로는 완만하게
export function dayFactor(c, day) {
  return Math.min(day - 1, c.dayEarlyCap) * c.dayFactorEarly + Math.max(0, day - 1 - c.dayEarlyCap) * c.dayFactorLate;
}

export function raidStatScale(c, progress, day, region) {
  return (1 + progress * c.statPerProgress + dayFactor(c, day)) * region.statMultiplier;
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
