// 부트: 도트 글꼴을 먼저 불러오고 Phaser 게임을 띄운다. 화면 흐름은 app.js.
import Phaser from 'phaser';
import { BootScene } from './game/BootScene.js';
import { TownScene } from './game/TownScene.js';
import { SanctuaryScene } from './game/SanctuaryScene.js';
import { TitleScene } from './game/TitleScene.js';
import { app } from './app.js';

async function boot() {
  try {
    await Promise.all(['11px Galmuri11', '14px Galmuri14', '11px GalmuriMono11', '8px Galmuri7'].map((f) => document.fonts.load(f, '가나다')));
  } catch { /* 글꼴이 늦어도 게임은 뜬다 */ }
  app.game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#1d1b26',
    pixelArt: true,
    roundPixels: true,
    scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
    input: { activePointers: 2 },
    scene: [BootScene, TitleScene, TownScene, SanctuaryScene],
  });
  app.game.registry.set('app', app);
  window.__app = app;   // 검증 스크립트용
}
boot();
