// 30장 B: 새 구역이 열리는 장면 · 구역 퀘스트 끝 창
import { ZONE_TEXT, ZONE_REWARD, ZONE_QUESTS } from '../data/zones.js';
import { josaFix } from '../sim/leader.js';
import { saveGame } from '../sim/save.js';
import { showReward } from './celebrate.js';
import { toast } from './toast.js';
import { h, mount, unmount, won } from './dom.js';
import { play } from './sound.js';

// 쌓인 구역 열림을 하나씩: 펜스 걷기 → 카메라 → 지역명 → 보상 띠 → 수첩 알림. 신림동 동네 화면에서만
export function playZoneNews(app, done) {
  const s = app.s;
  const scene = app.scene();
  if (!s?.zoneNews?.length || s.district !== 'sillim' || !scene?.zoneOpenScene || app.modal > 0) { done?.(); return; }
  const id = s.zoneNews.shift();
  app.modalOpened();
  scene.zoneOpenScene(id, () => {
    app.modalClosed();
    showReward({ text: josaFix(ZONE_REWARD.text.replace('{구역}', ZONE_TEXT[id].name)), xp: ZONE_REWARD.xp });
    for (const q of ZONE_QUESTS[id] ?? []) toast(`수첩 '구역 일'에 새 일: ${q.name}`, '', 5000);
    saveGame(s);
    app.hud?.update();
    playZoneNews(app, done);
  });
}

// 낮에 끝낸 구역 퀘스트 (밤사이 끝난 것은 아침 '밤사이' 줄로 보인다)
export function showZoneQuestDone(app, list, done) {
  const n = list.shift();
  if (!n) { done?.(); return; }
  app.modalOpened();
  play('confirm');
  const r = n.reward ?? {};
  const pay = [r.money ? `돈 +${won(r.money)}` : null, r.xp ? `경험치 +${r.xp}` : null, r.rep ? `평판 +${r.rep}` : null].filter(Boolean).join(' · ');
  const next = () => { unmount('cutin'); app.modalClosed(); app.refresh(); showZoneQuestDone(app, list, done); };
  mount('cutin', h('div', { class: 'screen cutin' }, h('div', { class: 'panel box quest-scene' },
    h('div', { class: 'kicker' }, '구역 일 · 끝'),
    h('h2', {}, n.name),
    h('p', { class: n.text.includes('"') ? 'say' : 'narr' }, n.text),
    pay ? h('div', { class: 'delta' }, h('span', { class: 'pill up' }, pay)) : null,
    h('div', { class: 'row end' }, h('button', { class: 'btn primary', onclick: next }, '다음')))));
}
