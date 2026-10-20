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

function found(initial = null) {
  openFounding({
    initial,
    onDone: (f) => begin(createState(makeFounder(f))),
    onCancel: title,
  });
}

// 계시 I·II (첫 줄·이름·성소) 는 지도를 열기 전에 받는다. 중간에 나갔다 와도 이어진다.
// history: 앞 계시들의 { before: 받기 전 상태(JSON), picks: 고른 답 }. '이전'을 누르면 직전 계시 전으로 되돌리고 답을 채워 다시 연다.
// 계시 I 에서 '이전'이면 교주 정보 화면으로 (입력했던 값 그대로).
function begin(state, history = [], { quick = false, picks = null } = {}) {
  saveGame(state);
  setAccent(state.religion.color);
  if (!state.story.done.II) {
    const ch = dueRevelation(state);
    if (ch) {
      const before = JSON.stringify(state);
      const canBack = history.length > 0 || ch.id === 'I';
      showRevelation(state, ch, {
        quick,
        picks,
        onDone: (_, chosen) => begin(state, [...history, { before, picks: chosen }]),
        onBack: canBack ? () => {
          const prev = history.at(-1);
          if (prev) begin(JSON.parse(prev.before), history.slice(0, -1), { quick: true, picks: prev.picks });
          else found({ founder: state.leader.name, age: state.leader.age, color: state.religion.color, emblem: state.religion.emblem });
        } : undefined,
      });
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
  screen.openView(); // 바다를 건너기 전엔 한국에 바짝 붙어서
  if (import.meta.env.DEV) window.__game = screen;
}

title();
