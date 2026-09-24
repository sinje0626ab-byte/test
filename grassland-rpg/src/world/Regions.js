import * as THREE from 'three';

// 지역 정의(regions.json)를 z 범위로 찾고, 경계 근처에선 지면 색을 섞는다.
export class Regions {
  constructor(defs, blend) {
    this.list = Object.entries(defs)
      .map(([id, d]) => ({ id, ...d, groundColors: d.ground.map((c) => new THREE.Color(c)) }))
      .sort((a, b) => a.zFrom - b.zFrom);
    this.byId = Object.fromEntries(this.list.map((r) => [r.id, r]));
    this.blend = blend;
  }

  at(x, z) {
    for (const r of this.list) if (z >= r.zFrom && z < r.zTo) return r;
    return z < this.list[0].zFrom ? this.list[0] : this.list[this.list.length - 1];
  }

  // 한 지역 안의 잔디 얼룩 색
  baseColor(region, x, z, t, out) {
    const [a, b, c] = region.groundColors;
    const n = Math.sin(x * 0.09) * Math.cos(z * 0.07) + Math.sin((x + z) * 0.03);
    return out.copy(n > 0.4 ? c : a).lerp(b, t * 0.55);
  }

  groundColor(x, z, t, out) {
    const lo = this.at(x, z - this.blend);
    const hi = this.at(x, z + this.blend);
    this.baseColor(this.at(x, z), x, z, t, out);
    if (lo === hi) return out;
    const boundary = hi.zFrom;
    const k = THREE.MathUtils.smoothstep(z, boundary - this.blend, boundary + this.blend);
    const other = new THREE.Color();
    this.baseColor(lo, x, z, t, out);
    this.baseColor(hi, x, z, t, other);
    return out.lerp(other, k);
  }
}
