import './ui/styles.css';
import topology from 'world-atlas/countries-110m.json';
import countriesJson from './data/countries.json';
import adjacencyJson from './data/adjacency.json';
import religionsJson from './data/religions.json';
import { initWorld } from './data/loader.js';
import { createWorldMap } from './map/worldMap.js';
import { createState } from './game/state.js';
import { loadGame, saveGame, clearSave } from './game/save.js';
import { makeReligion } from './religion/founding.js';
import { openFounding } from './ui/foundingScreen.js';
import { showTitle } from './ui/titleScreen.js';
import { startGameScreen } from './ui/gameScreen.js';
import { mapTheme } from './ui/theme.js';
import { emblemFavicon } from './religion/emblems.js';
import { onColor } from './ui/format.js';

// 브라우저 탭 아이콘을 플레이 중인 종교의 문양으로 바꾼다
const favicon = document.querySelector('link[rel="icon"]');
const defaultFavicon = favicon?.href;
function setFavicon(religion) {
  if (!favicon) return;
  favicon.href = religion ? emblemFavicon(religion.emblem, religion.color, onColor(religion.color)) : defaultFavicon;
}

initWorld(countriesJson, adjacencyJson, religionsJson);
const map = createWorldMap(document.getElementById('map'), topology);
let screen = null;

function idleMap() {
  const { land } = mapTheme();
  map.setFill(() => land);
}

function title() {
  screen?.destroy();
  screen = null;
  idleMap();
  setFavicon(null);
  const saved = loadGame();
  showTitle({
    saved,
    onContinue: () => play(saved),
    onNew: found,
  });
}

function found() {
  openFounding({
    onDone: (f) => {
      const state = createState(makeReligion(f));
      saveGame(state);
      play(state);
      map.focus(f.home, 2.5);
    },
    onCancel: title,
  });
}

function play(state) {
  screen?.destroy();
  setFavicon(state.religion);
  screen = startGameScreen(map, state, {
    onNewGame: () => { clearSave(); screen?.destroy(); screen = null; idleMap(); found(); },
  });
  if (import.meta.env.DEV) window.__game = screen;
}

title();
