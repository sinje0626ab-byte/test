// 에셋 불러오기. 끝나면 app.onBoot() 가 제목 화면을 띄운다.
import Phaser from 'phaser';
import townMap from '../map/town.json';
import bongcheonMap from '../map/bongcheon.json';
const interiors = import.meta.glob('../map/sanctuary-*.json', { eager: true, import: 'default' });
import { app } from '../app.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }
  preload() {
    this.load.atlas('lzTown', 'assets/lz/town.png', 'assets/lz/town.json');
    // 움직이는 차·버스·신호등·배달 오토바이 (29장 A, tools/build-vehicles.py)
    this.load.atlas('lzCars', 'assets/lz/vehicles.png', 'assets/lz/vehicles.json');
    this.load.json('vehiclesMeta', 'assets/lz/vehicles.json');
    this.load.atlas('lzIn', 'assets/lz/indoor.png', 'assets/lz/indoor.json');
    this.load.json('lzInMeta', 'assets/lz/indoor.json');
    // LimeZu 사람 아틀라스 (26장, tools/build-assets.py)
    this.load.image('people-cold', 'assets/lz/people-cold.png');
    this.load.image('people-warm', 'assets/lz/people-warm.png');
    this.load.json('peopleMeta', 'assets/lz/people.json');
    this.load.tilemapTiledJSON('town', townMap);
    this.load.tilemapTiledJSON('bongcheon', bongcheonMap);
    for (const [path, json] of Object.entries(interiors)) this.load.tilemapTiledJSON(`sanct-${path.match(/sanctuary-(\w+)\.json/)[1]}`, json);
  }
  create() { app.onBoot(this.game); }
}
