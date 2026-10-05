import * as THREE from 'three';

// 포탑 사거리 원: 바닥에 얇은 테 + 아주 옅은 안쪽 판. 매 프레임 필요한 만큼만 꺼내 쓰고 나머지는 숨긴다 (풀).
// strong = 지금 보는 포탑·놓을 포탑 (진하게), 아니면 그 기지의 다른 포탑 (반투명)
const EDGE = new THREE.RingGeometry(0.975, 1, 72).rotateX(-Math.PI / 2);
const FILL = new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2);

export class RangeRings {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.used = 0;
  }

  make() {
    const g = new THREE.Group();
    const edge = new THREE.Mesh(EDGE, new THREE.MeshBasicMaterial({ color: '#ffe7a0', transparent: true, depthWrite: false }));
    const fill = new THREE.Mesh(FILL, new THREE.MeshBasicMaterial({ color: '#ffe7a0', transparent: true, depthWrite: false }));
    edge.renderOrder = 3;
    fill.renderOrder = 2;
    g.add(fill, edge);
    g.visible = false;
    this.scene.add(g);
    return { g, edge, fill };
  }

  begin() {
    this.used = 0;
  }

  // 원 하나 그리기 (이번 프레임)
  show(position, radius, strong, bad = false) {
    const r = this.items[this.used] ?? (this.items[this.used] = this.make());
    this.used += 1;
    r.g.visible = true;
    r.g.position.set(position.x, 0.07, position.z);
    r.g.scale.setScalar(radius);
    const color = bad ? '#ff8a7a' : strong ? '#ffe7a0' : '#f3e6c4';
    r.edge.material.color.set(color);
    r.fill.material.color.set(color);
    r.edge.material.opacity = strong ? 0.85 : 0.35;
    r.fill.material.opacity = strong ? 0.1 : 0.04;
  }

  end() {
    for (let i = this.used; i < this.items.length; i++) this.items[i].g.visible = false;
  }
}
