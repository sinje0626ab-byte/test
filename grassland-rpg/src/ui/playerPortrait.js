import { snapshot } from './monsterPortrait.js';

// HUD 초상화: 지금 플레이어 모습(머리·옷·모자)을 정면 얼굴 위주로 한 장 찍는다.
// 매 프레임 그리지 않고, 외형·장비가 바뀔 때만 HUD 가 다시 부른다. 무기는 빼고 찍는다.
export function playerPortrait(player) {
  const pivot = player.swordPivot;
  const wasVisible = pivot.visible;
  pivot.visible = false;
  const g = player.inner.clone(true); // 기하·재질은 같이 쓴다 (버리지 않는다)
  pivot.visible = wasVisible;
  g.position.set(0, 0, 0);
  g.rotation.set(0, -0.3, 0);
  return snapshot(g, (camera) => {
    camera.fov = 26;
    camera.updateProjectionMatrix();
    camera.position.set(0.25, 1.32, 2.3);
    camera.lookAt(0, 1.1, 0);
  });
}
