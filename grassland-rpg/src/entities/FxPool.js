import * as THREE from 'three';

// 짧은 빛 연출 풀: 바닥에 퍼지는 고리(ring)와 카메라를 보는 반짝 별(spark).
// 파티클 조각만으로는 밋밋한 타격·처치·폭발을 또렷하게 해 준다. 미리 만든 메시를 돌려 쓴다.
const RING = new THREE.RingGeometry(0.72, 1, 28).rotateX(-Math.PI / 2);
// 네 갈래 별 (가운데가 두꺼운 마름모 두 개)
const STAR = (() => {
  const s = new THREE.Shape();
  const pts = 8;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2 + Math.PI / 2;
    const r = i % 2 ? 0.22 : 1;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  return new THREE.ShapeGeometry(s);
})();

export class FxPool {
  constructor(scene, camera, size = 16) {
    this.camera = camera;
    this.items = [];
    for (const [geo, kind] of [[RING, 'ring'], [STAR, 'spark']]) {
      for (let i = 0; i < size; i++) {
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        }));
        mesh.visible = false;
        mesh.renderOrder = 5;
        scene.add(mesh);
        this.items.push({ mesh, kind, t: 0, life: 0 });
      }
    }
  }

  take(kind) {
    const free = this.items.find((x) => x.kind === kind && x.life <= 0)
      ?? this.items.filter((x) => x.kind === kind).sort((a, b) => b.t / b.life - a.t / a.life)[0];
    return free;
  }

  // 바닥 고리: from → to 반지름으로 퍼지며 흐려진다
  ring(pos, { color = '#ffffff', from = 0.3, to = 2, life = 0.45, opacity = 0.7 } = {}) {
    const x = this.take('ring');
    x.mesh.position.set(pos.x, 0.06, pos.z);
    x.mesh.material.color.set(color);
    Object.assign(x, { t: 0, life, from, to, opacity });
    x.mesh.visible = true;
  }

  // 반짝 별: 잠깐 커졌다 사라진다
  spark(pos, { color = '#fff4d6', size = 0.5, life = 0.16, opacity = 0.95 } = {}) {
    const x = this.take('spark');
    x.mesh.position.copy(pos);
    x.mesh.material.color.set(color);
    x.mesh.rotation.z = Math.random() * Math.PI;
    Object.assign(x, { t: 0, life, size, opacity, spin: (Math.random() - 0.5) * 4 });
    x.mesh.visible = true;
  }

  update(dt) {
    for (const x of this.items) {
      if (x.life <= 0) continue;
      x.t += dt;
      const k = Math.min(1, x.t / x.life);
      if (x.kind === 'ring') {
        const r = x.from + (x.to - x.from) * (1 - (1 - k) * (1 - k));
        x.mesh.scale.setScalar(r);
        x.mesh.material.opacity = x.opacity * (1 - k);
      } else {
        x.mesh.quaternion.copy(this.camera.quaternion);
        x.mesh.rotateZ(x.spin * x.t);
        x.mesh.scale.setScalar(x.size * (k < 0.3 ? k / 0.3 : 1 - (k - 0.3) * 0.6));
        x.mesh.material.opacity = x.opacity * (1 - k * k);
      }
      if (k >= 1) {
        x.life = 0;
        x.mesh.visible = false;
      }
    }
  }
}
