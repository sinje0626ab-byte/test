import * as THREE from 'three';

// 비스듬한 탑다운 추적 카메라.
export class Camera {
  constructor(cfg, aspect) {
    this.cfg = cfg;
    this.camera = new THREE.PerspectiveCamera(cfg.fov, aspect, 0.1, 400);
    this.offset = new THREE.Vector3(...cfg.offset);
    this.focus = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
  }

  snapTo(pos) {
    this.focus.copy(pos);
    this.apply();
  }

  update(dt, pos) {
    const k = 1 - Math.exp(-this.cfg.followSharpness * dt);
    this.focus.lerp(pos, k);
    this.apply();
  }

  apply() {
    this.camera.position.copy(this.focus).add(this.offset);
    this.lookAt.copy(this.focus);
    this.lookAt.y += this.cfg.lookHeight;
    this.camera.lookAt(this.lookAt);
  }

  resize(aspect) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
