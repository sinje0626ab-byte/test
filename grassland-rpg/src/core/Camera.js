import * as THREE from 'three';

// 비스듬한 탑다운 추적 카메라.
export class Camera {
  constructor(cfg, aspect) {
    this.cfg = cfg;
    this.camera = new THREE.PerspectiveCamera(cfg.fov, aspect, 0.1, 400);
    this.offset = new THREE.Vector3(...cfg.offset);
    this.focus = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
    this.shakeTime = 0;
    this.shakeDur = 1;
    this.shakeStrength = 0;
    this.shakeOffset = new THREE.Vector3();
  }

  // 화면 흔들림: 세기(m)와 시간(초). 더 센 흔들림이 오면 덮어쓴다.
  shake(strength, duration) {
    if (strength < this.shakeStrength * (this.shakeTime / this.shakeDur)) return;
    this.shakeStrength = strength;
    this.shakeTime = duration;
    this.shakeDur = duration;
  }

  // 흔들림은 히트스톱과 상관없이 실제 시간으로 줄어든다.
  updateShake(realDt) {
    if (this.shakeTime <= 0) { this.shakeOffset.set(0, 0, 0); return; }
    this.shakeTime = Math.max(0, this.shakeTime - realDt);
    const k = this.shakeStrength * (this.shakeTime / this.shakeDur);
    this.shakeOffset.set((Math.random() - 0.5) * 2 * k, (Math.random() - 0.5) * k, (Math.random() - 0.5) * 2 * k);
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
    this.camera.position.copy(this.focus).add(this.offset).add(this.shakeOffset);
    this.lookAt.copy(this.focus);
    this.lookAt.y += this.cfg.lookHeight;
    this.camera.lookAt(this.lookAt);
  }

  // 타이틀 화면용: center 둘레를 angle 만큼 돈 자리에서 내려다본다.
  orbit(center, angle) {
    const r = Math.hypot(this.offset.x, this.offset.z) * 1.15;
    this.camera.position.set(center.x + Math.sin(angle) * r, this.offset.y * 0.7, center.z + Math.cos(angle) * r);
    this.lookAt.copy(center);
    this.lookAt.y += this.cfg.lookHeight + 1.5;
    this.camera.lookAt(this.lookAt);
    this.focus.copy(center);
  }

  resize(aspect) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
