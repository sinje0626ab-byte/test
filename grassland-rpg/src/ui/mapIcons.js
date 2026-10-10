import { PAINTED } from './painted.js';

// 지도·미니맵 표시 그림 (art/ui/map_*): 기지·보스·주민·묘비·보물상자·플레이어·퀘스트 목표.
// marker(g, id, x, y, size, { pin, rot, alpha, gray }) — 그림이 아직 안 읽혔거나 없으면 false (예전 점으로 그린다)
// pin: 아래 뾰족한 끝이 그 자리에 오게 (핀 모양), rot: 회전(플레이어 화살표, 위가 0)
const IMG = {};
function img(id) {
  if (!PAINTED.ui[id]) return null;
  if (!IMG[id]) {
    IMG[id] = new Image();
    IMG[id].src = PAINTED.ui[id];
  }
  return IMG[id].complete && IMG[id].naturalWidth ? IMG[id] : null;
}

export function marker(g, id, x, y, size, { pin = false, rot = 0, alpha = 1, gray = false } = {}) {
  const im = img(id);
  if (!im) return false;
  const w = size;
  const h = (size * im.naturalHeight) / im.naturalWidth;
  g.save();
  g.globalAlpha = alpha;
  if (gray) g.filter = 'grayscale(1)';
  g.translate(x, y);
  if (rot) g.rotate(rot);
  g.drawImage(im, -w / 2, pin ? -h * 0.96 : -h / 2, w, h);
  g.restore();
  return true;
}

// 미리 읽어 두기 (처음 그릴 때 빈 칸이 안 생기게)
export function preloadMarkers() {
  for (const id of ['map_base', 'map_boss', 'map_npc', 'map_tomb', 'map_chest', 'map_player', 'map_quest']) img(id);
}
