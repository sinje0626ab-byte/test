// 효과음 (Kenney, CC0). 첫 터치 전에는 브라우저가 소리를 막으니 실패는 조용히 넘긴다.
const FILES = ['click', 'select', 'confirm', 'error', 'talk', 'door', 'coins', 'page', 'jingle_good', 'jingle_bad', 'jingle_week'];
const cache = {};
let muted = false;
try { muted = localStorage.getItem('cult-town-muted') === '1'; } catch { /* 저장소 막힘 */ }

export function play(name, volume = 0.5) {
  if (muted || !FILES.includes(name)) return;
  try {
    const a = cache[name] ?? (cache[name] = new Audio(`./assets/audio/${name}.ogg`));
    const c = a.cloneNode();
    c.volume = volume;
    c.play().catch(() => {});
  } catch { /* 소리 못 냄 */ }
}
export const isMuted = () => muted;
export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem('cult-town-muted', muted ? '1' : '0'); } catch { /* */ }
  return muted;
}
