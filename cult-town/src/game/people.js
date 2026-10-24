// 사람 스프라이트 (26장): LimeZu 캐릭터 생성기로 미리 합성한 아틀라스(public/assets/lz/people-cold|warm.png)에서
// 사람마다 한 줄을 꺼내 Phaser 텍스처 'p:<id>' 로 등록한다. 외형 조합은 data 파일의 look · tools/build-assets.py.
// 한 칸 16x32, 72장: 대기 0~23 · 걷기 24~47 (오른쪽·위·왼쪽·아래 6장씩) · 앉기 48~59 (오른쪽 6 · 왼쪽 6) · 폰 60~71 (아래).
// 원점 (0, 0.5) 으로 두면 발이 예전 16x16 사람과 같은 자리에 온다. 머리는 그만큼 위로 (HEAD_LIFT).

export const DIRS = ['down', 'left', 'right', 'up'];
const DI = { right: 0, up: 1, left: 2, down: 3 };
export const FRAMES = { idle: 0, walk: 24, sit: 48, phone: 60 };
export const HEAD_LIFT = 8;           // 이름표·말풍선·느낌표를 이만큼 더 위에
export const PERSON_ORIGIN_Y = 0.5;
export const idleFrame = (dir, f = 0) => FRAMES.idle + DI[dir] * 6 + (f % 6);
export const walkFrame = (dir, f = 0) => FRAMES.walk + DI[dir] * 6 + (f % 6);
export const sitFrame = (side, f = 0) => FRAMES.sit + (side === 'left' ? 6 : 0) + (f % 6);
export const phoneFrame = (f = 0) => FRAMES.phone + 3 + (f % 6);   // 4~9장을 돈다
// 예전 코드 호환: 방향의 서 있는 그림
export const frameIndex = (dir) => idleFrame(dir);

// 계절: 추운 달(겨울·3월·가을)은 겉옷, 더운 달(봄·장마·여름)은 얇은 옷
let SEASON = 'early';
export const setSeason = (s) => { SEASON = s; };
const sheetFor = (season = SEASON) => (['winter', 'early', 'autumn'].includes(season) ? 'people-cold' : 'people-warm');

const meta = (scene) => scene.cache.json.get('peopleMeta');
// 교주 옷차림 단계 (28장 B-2): 1 평상복 · 2 양복 · 3 흰 셔츠 · 4 흰 두루마기
let LEADER_STAGE = 1;
export const setLeaderStage = (n) => { LEADER_STAGE = Math.max(1, Math.min(4, n)); };
const rowOf = (scene, key) => {
  const rows = meta(scene).rows;
  let k = key.replace(/^p:/, '');
  if (k === 'leader' && LEADER_STAGE > 1 && rows[`leader${LEADER_STAGE}`] != null) k = `leader${LEADER_STAGE}`;
  return rows[k] ?? rows.leader;
};

// Phaser 텍스처와 걷기 애니메이션 등록 (계절이 바뀌면 다시 만든다). look 은 예전 호출 모양을 위해 받기만 한다.
export function registerPerson(scene, key) {
  const sheet = sheetFor();
  const stage = key === 'p:leader' ? LEADER_STAGE : 0;
  if (scene.textures.exists(key)) {
    const cd = scene.textures.get(key).customData;
    if (cd?.sheet === sheet && (cd.stage ?? 0) === stage) return;
    for (const dir of DIRS) scene.anims.remove(`${key}-walk-${dir}`);
    scene.textures.remove(key);
  }
  const m = meta(scene);
  const src = scene.textures.get(sheet).getSourceImage();
  const canvas = document.createElement('canvas');
  canvas.width = m.cols * m.frameWidth; canvas.height = m.frameHeight;
  canvas.getContext('2d').drawImage(src, 0, rowOf(scene, key) * m.frameHeight, canvas.width, m.frameHeight, 0, 0, canvas.width, m.frameHeight);
  scene.textures.addSpriteSheet(key, canvas, { frameWidth: m.frameWidth, frameHeight: m.frameHeight });
  scene.textures.get(key).customData = { sheet, stage };
  for (const dir of DIRS) {
    scene.anims.create({
      key: `${key}-walk-${dir}`,
      frames: [0, 1, 2, 3, 4, 5].map((f) => ({ key, frame: walkFrame(dir, f) })),
      frameRate: 12, repeat: -1,
    });
  }
}

// DOM 용 얼굴 그림 (대화창·프로필): 앞모습 머리·어깨를 배율로 키운 dataURL
const portraitCache = new Map();
export function portrait(scene, key, scale = 4) {
  const sheet = sheetFor();
  const ck = `${sheet}:${key}:${key.endsWith('leader') ? LEADER_STAGE : 0}`;
  if (portraitCache.has(ck)) return portraitCache.get(ck);
  const m = meta(scene);
  const src = scene.textures.get(sheet).getSourceImage();
  const c = document.createElement('canvas');
  c.width = 16 * scale; c.height = 16 * scale;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, idleFrame('down') * m.frameWidth, rowOf(scene, key) * m.frameHeight + 6, 16, 16, 0, 0, 16 * scale, 16 * scale);
  const url = c.toDataURL();
  portraitCache.set(ck, url);
  return url;
}
