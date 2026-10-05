// 건물 체력 진행도: 포탑·기지 중심 건물·부속 건물·벽의 최대 체력 = 원래 값 × (1 + 진행도 × structureHpPerProgress).
// 진행도는 습격 공식과 같은 값 (ctx.progressOf, RaidSystem). 후반 습격 몬스터는 강해지는데 건물은 그대로라
// 한 방에 터지던 문제를 줄인다. 최대 체력이 바뀌면 체력 비율을 유지한다.
// 다른 코드가 최대 체력을 새로 정하면(업그레이드·석공 스킬) 그 값을 새 원래 값으로 보고 다시 곱한다.
// 저장: 건물마다 체력 비율을 따로 적어 두고(save.structureHp), 불러온 뒤 늘어난 최대 체력에 맞춘다.
const INTERVAL = 0.5;
const keyOf = (s) => `${s.kind}:${s.position.x.toFixed(2)}:${s.position.z.toFixed(2)}`;

export class StructureHpSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.per = ctx.data.config.combat.structureHpPerProgress;
    this.timer = 0;
    const { bus } = ctx;
    bus.on('save:collect', (save) => {
      save.structureHp = Object.fromEntries(ctx.structures.map((s) => [keyOf(s), +(s.stats.hp / s.stats.maxHp).toFixed(4)]));
    });
    bus.on('save:apply', (save) => { this.loaded = save.structureHp ?? null; });
    bus.on('save:loaded', () => {
      this.apply();
      // 저장 때 비율로 맞춘다 (예전 저장은 비율 기록이 없으니 불러온 체력 그대로 비율 유지)
      if (this.loaded) {
        for (const s of ctx.structures) {
          const r = this.loaded[keyOf(s)];
          if (r != null && s.alive !== false) s.stats.hp = Math.round(s.stats.maxHp * r);
        }
      }
      this.loaded = null;
    });
  }

  scaleFor(s) {
    const base = s.base ?? this.ctx.bases.find((b) => b.id === s.baseId);
    if (!base || !this.ctx.progressOf) return 1;
    return 1 + this.ctx.progressOf(base) * this.per;
  }

  apply() {
    for (const s of this.ctx.structures) {
      const st = s.stats;
      // 누가 최대 체력을 새로 정했으면 그 값이 새 원래 값
      if (s.hpScaled !== st.maxHp) s.hpBase = st.maxHp;
      const max = Math.round(s.hpBase * this.scaleFor(s));
      if (max !== st.maxHp) {
        const ratio = st.maxHp > 0 ? st.hp / st.maxHp : 1;
        st.maxHp = max;
        st.hp = Math.round(max * ratio);
      }
      s.hpScaled = st.maxHp;
    }
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = INTERVAL;
    this.apply();
  }
}
