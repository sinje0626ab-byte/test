import * as THREE from 'three';

// 머리 위에 떠서 카메라를 바라보는 작은 체력바
export class HpBar {
  constructor(width, color = 0xff6b6b) {
    this.group = new THREE.Group();
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.14), new THREE.MeshBasicMaterial({ color: 0x2b2b33, depthTest: false }));
    const fgGeo = new THREE.PlaneGeometry(width - 0.04, 0.09);
    fgGeo.translate((width - 0.04) / 2, 0, 0);
    this.fill = new THREE.Mesh(fgGeo, new THREE.MeshBasicMaterial({ color, depthTest: false }));
    this.fill.position.set(-(width - 0.04) / 2, 0, 0.001);
    bg.renderOrder = 10;
    this.fill.renderOrder = 11;
    this.group.add(bg, this.fill);
    this.group.visible = false;
  }

  update(ratio, camera, visible) {
    this.group.visible = visible;
    if (!visible) return;
    this.group.quaternion.copy(camera.quaternion);
    this.fill.scale.x = Math.max(0.001, ratio);
  }
}
