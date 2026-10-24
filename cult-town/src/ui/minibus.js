// 30장 C 마을버스: 정류장 6곳 (map 속성 'minibus'). 갈 곳 고르기 → 요금 · 게임 10분 · 피로 조금 → 화면이 잠깐 어두워졌다 도착
import { MINIBUS, CLOCK } from '../config.js';
import { zoneOpen } from '../sim/zones.js';
import { addFatigue } from '../sim/leader.js';
import { saveGame } from '../sim/save.js';
import { ZONE_TEXT } from '../data/zones.js';
import { openingPanel } from './opening.js';
import { toast } from './toast.js';
import { won } from './dom.js';
import { play } from './sound.js';

export const MINIBUS_TEXT = {
  name: '마을버스',
  scene: '노란 마을버스 정류장. 시간표 대신 "자주 와요"라고 매직으로 적혀 있다.',
  shut: '공사 중',
  poor: '버스비가 모자라다.',
  late: '막차가 끊겼다. 걸어가자.',
  stay: '안 탄다',
  ride: '{곳}까지 덜컹덜컹 갔다.',
};

export function openMinibus(app, fromId) {
  const s = app.s;
  if (s.mode !== 'day' || app.modal > 0) return;
  const stops = app.here().minibus ?? [];
  const from = stops.find((b) => b.id === fromId);
  if (!from) return;
  app.scene()?.walker?.stop();
  if (s.minute + MINIBUS.minutes >= CLOCK.dayEnd) { toast(MINIBUS_TEXT.late); return; }
  let to = null;
  openingPanel(app, {
    title: from.name, name: MINIBUS_TEXT.name, scene: MINIBUS_TEXT.scene,
    choices: [
      ...stops.filter((b) => b.id !== fromId).map((b) => {
        const shut = b.zone && !zoneOpen(s, b.zone);
        return { id: b.id, label: b.name, hint: shut ? `${MINIBUS_TEXT.shut} · ${ZONE_TEXT[b.zone].name}` : `${won(MINIBUS.fare)} · ${MINIBUS.minutes}분`, disabled: shut };
      }),
      { id: 'stay', label: MINIBUS_TEXT.stay, hint: '' },
    ],
    onChoice: (id) => {
      if (id === 'stay') return '정류장 의자에 잠깐 앉았다 일어났다.';
      if (s.leader.money < MINIBUS.fare) return MINIBUS_TEXT.poor;
      to = stops.find((b) => b.id === id);
      return MINIBUS_TEXT.ride.replace('{곳}', to.name);
    },
    onDone: () => { if (to) ride(app, to); },
  });
}

function ride(app, to) {
  const s = app.s;
  const scene = app.scene();
  app.modalOpened();
  play('door');
  const cam = scene.cameras.main;
  cam.fadeOut(350, 20, 18, 30);
  cam.once('camerafadeoutcomplete', () => {
    app.advance(MINIBUS.minutes);
    s.leader.money -= MINIBUS.fare;
    addFatigue(s, MINIBUS.fatigue);
    scene.teleportLeader(to.tile);
    saveGame(s);
    cam.fadeIn(400, 20, 18, 30);
    cam.once('camerafadeincomplete', () => { app.modalClosed(); app.hud?.update(); toast(`${to.name} · 버스비 ${won(MINIBUS.fare)}`); });
  });
}
