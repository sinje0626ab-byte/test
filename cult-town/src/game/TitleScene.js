// 제목 화면 배경: 밤의 신림역 3번 출구 앞. 동림상가 3층 302호 창문에만 형광등이 켜져 있다.
// 실제 동네 지도를 밤 색조로 그리고, 카메라는 천천히 옆으로 흐른다.
import Phaser from 'phaser';
import { drawBuildingSigns, drawStationExit, drawLzProps } from './signs.js';

const T = 16;

export class TitleScene extends Phaser.Scene {
  constructor() { super('title'); }

  create() {
    const map = this.make.tilemap({ key: 'town' });
    const ts = map.addTilesetImage('town', 'lzTown');
    ['ground', 'detail', 'buildings', 'deco'].forEach((n, i) => map.createLayer(n, ts, 0, 0).setDepth(i));
    map.createLayer('above', ts, 0, 0).setDepth(5000);
    const buildings = JSON.parse(map.properties.find((p) => p.name === 'buildings').value);
    for (const b of buildings) drawBuildingSigns(this, b);
    for (const o of map.getObjectLayer('places').objects) {
      if (o.type === 'exit') drawStationExit(this, 'station.exit', o.x, o.y, o.properties.find((p) => p.name === 'label').value);
    }
    drawLzProps(this, map.getObjectLayer('places').objects);
    // 밤
    this.night = this.add.rectangle(0, 0, map.widthInPixels, map.heightInPixels, 0x0c0c2a, 0.62).setOrigin(0).setDepth(9000);
    // 가로등 불빛 몇 개
    const glow = this.add.graphics().setDepth(9001).setBlendMode(Phaser.BlendModes.ADD);
    for (const [x, y] of [[18, 19], [44, 19]]) { glow.fillStyle(0xffd890, 0.07).fillCircle(x * T + 8, y * T - 8, 18); glow.fillStyle(0xffe8b0, 0.08).fillCircle(x * T + 8, y * T - 8, 7); }
    // 302호 창문 (동림상가 3층 = 정면 위에서 둘째 줄)
    const sanct = buildings.find((b) => b.place === 'sanctuary');
    const row3 = sanct.y + 1;                        // 27장 건물: 위층 창 띠 (성소 간판 자리 옆)
    const wx = (sanct.x + sanct.w - 4) * T;
    const lit = this.add.graphics().setDepth(9002);
    lit.fillStyle(0xfff6c0, 0.95).fillRect(wx + 3, row3 * T + 3, 10, 10);
    lit.fillStyle(0xfff6c0, 0.95).fillRect(wx + 3 + 2 * T, row3 * T + 3, 10, 10);
    const halo = this.add.graphics().setDepth(9001).setBlendMode(Phaser.BlendModes.ADD);
    halo.fillStyle(0xfff0a0, 0.1).fillCircle(wx + 8, row3 * T + 8, 14); halo.fillStyle(0xfff0a0, 0.1).fillCircle(wx + 2 * T + 8, row3 * T + 8, 14);
    this.tweens.add({ targets: [lit, halo], alpha: { from: 1, to: 0.82 }, duration: 140, yoyo: true, repeat: -1, repeatDelay: 2600 });   // 형광등 깜빡
    const cam = this.cameras.main;
    const z = Math.max(2, Math.min(4, Math.floor(Math.min(this.scale.width / (T * 20), this.scale.height / (T * 14)))));
    cam.setZoom(z);
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.centerOn((sanct.x + 4) * T, (sanct.y + 2) * T);
    this.drift = this.tweens.add({ targets: cam, scrollX: cam.scrollX + 6 * T, duration: 26000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.home = [(sanct.x + 4) * T, (sanct.y + 2) * T];
  }

  // 오락실 대기 화면 데모 (28장 D-2): 저녁 빛으로 동네를 천천히 한 바퀴 훑고 onEnd. 반환: 멈추기
  startDemo(onEnd) {
    const cam = this.cameras.main;
    this.drift?.pause();
    this.tweens.add({ targets: this.night, alpha: 0.28, duration: 1200 });
    const route = [[35, 17], [24, 37], [26, 7], [52, 30], [86, 30], [60, 70], this.home.map((v) => v / T)];
    let i = 0; let stopped = false;
    const next = () => {
      if (stopped) return;
      if (i >= route.length) { onEnd?.(); return; }
      const [x, y] = route[i++];
      cam.pan(x * T, y * T, 4200, 'Sine.easeInOut', true, (c, p) => { if (p === 1) this.time.delayedCall(700, next); });
    };
    next();
    return () => {
      stopped = true;
      cam.panEffect.reset();
      this.tweens.add({ targets: this.night, alpha: 0.62, duration: 600 });
      cam.centerOn(...this.home);
      this.drift?.resume();
    };
  }
}
