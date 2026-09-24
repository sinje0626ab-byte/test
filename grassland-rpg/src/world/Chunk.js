import * as THREE from 'three';

// z 방향 띠 하나의 장식 묶음. 종류마다 InstancedMesh 하나씩, 멀면 통째로 숨긴다.
export class Chunk {
  constructor(scene, index, size) {
    this.index = index;
    this.zMin = index * size;
    this.zMax = this.zMin + size;
    this.group = new THREE.Group();
    scene.add(this.group);
  }

  // kinds: { 종류: [{ m: Matrix4, c: Color }] }
  build(kinds, geos, mats, noShadow) {
    for (const [kind, list] of Object.entries(kinds)) {
      const mesh = new THREE.InstancedMesh(geos[kind], mats[kind], list.length);
      list.forEach((it, i) => { mesh.setMatrixAt(i, it.m); mesh.setColorAt(i, it.c); });
      mesh.castShadow = !noShadow.has(kind);
      mesh.receiveShadow = true;
      mesh.computeBoundingSphere(); // 띠마다 따로 화면 밖이면 안 그린다
      mesh.userData = { kind, total: list.length };
      this.group.add(mesh);
    }
  }

  // 장식 밀도 설정: 충돌하지 않는 풀·꽃·덤불만 줄인다.
  setDensity(density, kinds) {
    for (const mesh of this.group.children) {
      const { kind, total } = mesh.userData;
      mesh.count = kinds.includes(kind) ? Math.round(total * density) : total;
    }
  }

  setVisible(focusZ, viewDistance) {
    const d = focusZ < this.zMin ? this.zMin - focusZ : focusZ > this.zMax ? focusZ - this.zMax : 0;
    this.group.visible = d < viewDistance;
  }
}
