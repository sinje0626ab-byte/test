import './ui/styles.css';
import config from './data/config.json';
import player from './data/player.json';
import monsters from './data/monsters.json';
import items from './data/items.json';
import buildings from './data/buildings.json';
import turrets from './data/turrets.json';
import regions from './data/regions.json';
import { Game } from './core/Game.js';

const game = new Game({
  container: document.getElementById('app'),
  uiRoot: document.getElementById('ui'),
  data: { config, player, monsters, items, buildings, turrets, regions },
});
game.start();

// 개발 중 콘솔에서 상태 확인용
if (import.meta.env.DEV) window.game = game;
