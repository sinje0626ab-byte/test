// 말하는 사람 세우기 (27장 D5): 대화창이 떠 있는 동안 그 사람을 지도 위 교주 옆에 세운다.
// 이미 가까이(6칸 안) 보이는 사람이면 새로 세우지 않고 교주 쪽으로 돌려 세운다. 대화창이 닫히면 치운다.
import { registerPerson, idleFrame, PERSON_ORIGIN_Y } from './people.js';
import { walkable } from '../sim/grid.js';

const T = 16;
const NEAR = [[1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1], [2, 0], [-2, 0], [0, 1]];
const faceToward = (dx, dy) => (Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');

// key: 사람 텍스처 키 ('p:cast:mom' · 'p:tong' …) · existing: 지도에 이미 있는 그 사람 스프라이트 (없으면 null)
export function showSpeaker(scene, key, existing = null) {
  hideSpeaker(scene);
  const pl = scene.player;
  const grid = scene.walker?.g ?? scene.grid;
  if (!pl || !grid) return;
  // 성소는 화면이 좁아 문 앞(아래쪽)에 서면 대화창에 가린다: 교주를 방 가운데쯤으로 들여보낸다
  if (scene.scene.key === 'sanctuary' && Math.round((pl.y + 4) / T) >= 9) {
    const ty = 7; const tx = Math.round(pl.x / T);
    if (walkable(grid, tx, ty)) { scene.walker?.stop?.(); pl.setPosition(tx * T, ty * T - 4); }
  }
  const px = Math.round(pl.x / T); const py = Math.round((pl.y + 4) / T);
  if (existing?.visible && Math.abs(existing.x / T - px) + Math.abs((existing.y + 4) / T - py) <= 6) {
    const ex = Math.round(existing.x / T); const ey = Math.round((existing.y + 4) / T);
    existing.anims?.stop?.();
    existing.setFrame(idleFrame(faceToward(px - ex, py - ey)));
    pl.setFrame(idleFrame(faceToward(ex - px, ey - py)));
    liftCamera(scene);
    return;
  }
  const spot = NEAR.map(([dx, dy]) => [px + dx, py + dy]).find(([x, y]) => walkable(grid, x, y)) ?? [px + 1, py];
  registerPerson(scene, key);
  const sp = scene.add.sprite(spot[0] * T, spot[1] * T - 4, key, idleFrame(faceToward(px - spot[0], py - spot[1])))
    .setOrigin(0, PERSON_ORIGIN_Y).setDepth(scene.scene.key === 'sanctuary' ? 59 : 100 + spot[1] * T).setAlpha(0);
  scene.tweens.add({ targets: sp, alpha: 1, duration: 250 });
  pl.setFrame(idleFrame(faceToward(spot[0] - px, spot[1] - py)));
  scene.speakerSprite = sp;
  liftCamera(scene);
}

// 대화창이 화면 아래를 가리니, 카메라를 내려 두 사람이 화면 위쪽에 보이게
function liftCamera(scene) {
  const cam = scene.cameras.main;
  cam.setFollowOffset(0, -Math.round(scene.scale.height / 5 / cam.zoom));
}

export function hideSpeaker(scene) {
  scene.cameras?.main?.setFollowOffset(0, 0);
  scene.speakerSprite?.destroy();
  scene.speakerSprite = null;
}
