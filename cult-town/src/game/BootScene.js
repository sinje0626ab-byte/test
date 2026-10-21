// 에셋 불러오기. 끝나면 app.onBoot() 가 제목 화면을 띄운다.
import Phaser from 'phaser';
import townMap from '../map/town.json';
const interiors = import.meta.glob('../map/sanctuary-*.json', { eager: true, import: 'default' });
import { app } from '../app.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }
  preload() {
    this.load.image('urban', 'assets/tiles/urban.png');
    this.load.spritesheet('urbanSheet', 'assets/tiles/urban.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('indoor', 'assets/tiles/indoor.png');
    this.load.spritesheet('indoorSheet', 'assets/tiles/indoor.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.tilemapTiledJSON('town', townMap);
    for (const [path, json] of Object.entries(interiors)) this.load.tilemapTiledJSON(`sanct-${path.match(/sanctuary-(\w+)\.json/)[1]}`, json);
  }
  create() { app.onBoot(this.game); }
}
