import './ui/styles.css';
import topology from 'world-atlas/countries-110m.json';
import countriesJson from './data/countries.json';
import adjacencyJson from './data/adjacency.json';
import religionsJson from './data/religions.json';
import { initWorld } from './data/loader.js';
import { createWorldMap } from './map/worldMap.js';
import { createState } from './game/state.js';
import { loadGame, saveGame, clearSave } from './game/save.js';
import { makeFounder } from './religion/founding.js';
import { dueRevelation } from './story/storyEngine.js';
import { showRevelation } from './story/revelationScreen.js';
import { setAccent } from './ui/theme.js';
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
  map.spin(true);
}

function title() {
  screen?.destroy();
  screen = null;
  idleMap();
  setFavicon(null);
  const saved = loadGame();
  showTitle({
    saved,
    onContinue: () => begin(saved),
    onNew: found,
  });
}

function found() {
  openFounding({
    onDone: (f) => begin(createState(makeFounder(f))),
    onCancel: title,
  });
}

// 계시 I·II (원칙·이름·본거지) 는 지도를 열기 전에 받는다. 중간에 나갔다 와도 이어진다.
function begin(state) {
  saveGame(state);
  setAccent(state.religion.color);
  if (!state.story.done.II) {
    const ch = dueRevelation(state);
    if (ch) {
      showRevelation(state, ch, { onDone: () => begin(state) });
      return;
    }
  }
  play(state);
}

function play(state) {
  screen?.destroy();
  setFavicon(state.religion);
  screen = startGameScreen(map, state, {
    onNewGame: () => { clearSave(); screen?.destroy(); screen = null; idleMap(); setFavicon(null); found(); },
  });
  map.spin(false);
  screen.focusCountry(state.religion.home, 2.4); // 시작할 때는 주변 지역까지 보이게
  if (import.meta.env.DEV) window.__game = screen;
}

title();
