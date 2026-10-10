import './ui/styles.css';
import './ui/windows.css';
import './ui/windows-map.css';
import './ui/touch.css';
import './ui/title.css';
import './ui/polish.css';
import './ui/mobile.css';
import './ui/theme-cozy.css';
import './ui/pause-art.css';
import './ui/title-art.css';
import './ui/ui-art.css';
import './ui/hud-plus.css';
import config from './data/config.json';
import player from './data/player.json';
import monsters from './data/monsters.json';
import items from './data/items.json';
import buildings from './data/buildings.json';
import turrets from './data/turrets.json';
import regions from './data/regions.json';
import levels from './data/levels.json';
import skills from './data/skills.json';
import recipes from './data/recipes.json';
import shop from './data/shop.json';
import bosses from './data/bosses.json';
import sounds from './data/sounds.json';
import nodes from './data/nodes.json';
import weapons from './data/weapons.json';
import npcs from './data/npcs.json';
import dialogues from './data/dialogues.json';
import quests from './data/quests.json';
import bounties from './data/bounties.json';
import decor from './data/decor.json';
import { Game } from './core/Game.js';
import { installToonShading } from './core/toon.js';
import { loadModels } from './core/Models.js';
import { installUiVars } from './ui/painted.js';

installUiVars(); // UI 그림을 CSS 변수로 (body.ui-art)

// 툰 명암은 재질이 처음 그려지기 전에 (셰이더 조각을 고친다)
installToonShading(config.render.toon);

// 3D 모델(.glb)을 다 읽은 뒤 시작한다 (몬스터가 모델을 바로 복제할 수 있게). 못 읽은 모델은 예전 모양으로
loadModels().finally(() => {
  const game = new Game({
    container: document.getElementById('app'),
    uiRoot: document.getElementById('ui'),
    data: { config, player, monsters, items, buildings, turrets, regions, levels, skills, recipes, shop, bosses, sounds, nodes, weapons, npcs, dialogues, quests, bounties, decor },
  });
  game.start();

  // 개발 중 콘솔에서 상태 확인용
  if (import.meta.env.DEV) window.game = game;
});
