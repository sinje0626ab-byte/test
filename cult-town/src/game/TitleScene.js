// 제목 화면 배경: 밤의 신림역 3번 출구 앞. 동림상가 3층 302호 창문에만 형광등이 켜져 있다.
// 실제 동네 지도를 밤 색조로 그리고, 카메라는 천천히 옆으로 흐른다.
import Phaser from 'phaser';
import { drawBuildingSigns, drawRoof, drawStationExit } from './signs.js';

const T = 16;

export class TitleScene extends Phaser.Scene {
  constructor() { super('title'); }

  create() {
    const map = this.make.tilemap({ key: 'town' });
    const ts = map.addTilesetImage('urban', 'urban');
    ['ground', 'detail', 'buildings', 'deco'].forEach((n, i) => map.createLayer(n, ts, 0, 0).setDepth(i));
    map.createLayer('above', ts, 0, 0).setDepth(5000);
    const buildings = JSON.parse(map.properties.find((p) => p.name === 'buildings').value);
    for (const b of buildings) { drawRoof(this, b); drawBuildingSigns(this, b); }
    for (const o of map.getObjectLayer('places').objects) {
      if (o.type === 'exit') drawStationExit(this, 'station.exit', o.x, o.y, o.properties.find((p) => p.name === 'label').value);
    }
    // 밤
    this.add.rectangle(0, 0, map.widthInPixels, map.heightInPixels, 0x0c0c2a, 0.62).setOrigin(0).setDepth(9000);
    // 가로등 불빛 몇 개
    const glow = this.add.graphics().setDepth(9001).setBlendMode(Phaser.BlendModes.ADD);
    for (const [x, y] of [[18, 9], [44, 9]]) { glow.fillStyle(0xffd890, 0.07).fillCircle(x * T + 8, y * T - 8, 18); glow.fillStyle(0xffe8b0, 0.08).fillCircle(x * T + 8, y * T - 8, 7); }
    // 302호 창문 (동림상가 3층 = 정면 위에서 둘째 줄)
    const sanct = buildings.find((b) => b.place === 'sanctuary');
    const row3 = sanct.y + sanct.roofH + 1;
    const wx = (sanct.x + 3) * T;
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
    this.tweens.add({ targets: cam, scrollX: cam.scrollX + 6 * T, duration: 26000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
}
