// 효과음 파일 만들기: node tools/sfx-import.mjs <원본 폴더> [ffmpeg 경로]
// 원본 폴더 = 내려받은 CC0 묶음을 풀어 둔 곳 (src/sfx/CREDITS.md 의 폴더 이름 그대로).
// 앞 침묵을 자르고, 너무 길면 끝을 잘라 짧게 사라지게 하고, 크기를 맞춰(평균 음량 → 목표, 최대 −1dB)
// 모노 mp3 로 src/sfx/<키>_<번호>.mp3 를 만든다. 같은 키 여러 개 = 게임에서 무작위로 골라 튼다.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = process.argv[2];
const FF = process.argv[3] ?? 'ffmpeg';
if (!SRC) { console.error('사용법: node tools/sfx-import.mjs <원본 폴더> [ffmpeg]'); process.exit(1); }
const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/sfx');

const K = 'impact-sounds/Audio/';
const R = 'rpg-audio/Audio/';
const I = 'interface-sounds/Audio/';
const U = 'ui-audio/Audio/';
const J = 'music-jingles/Audio/';
const n5 = (p) => [0, 1, 2, 3, 4].map((i) => `${p}_00${i}.ogg`);

// 키: { files, max(초), target(평균 dB), db(더하기), kbps, fade }
const MAP = {
  // 전투
  swing: { files: ['rpgpack/RPG Sound Pack/battle/swing.wav', 'rpgpack/RPG Sound Pack/battle/swing2.wav', 'rpgpack/RPG Sound Pack/battle/swing3.wav', 'swishes/swish-3.wav', 'swishes/swish-7.wav', 'swishes/swish-9.wav'], target: -20 },
  swing_heavy: { files: ['battle/swish_2.wav', 'battle/swish_3.wav', 'battle/swish_4.wav'], target: -20 },
  bow: { files: ['battle/Bow.wav'], target: -20 },
  hit_flesh: { files: n5(K + 'impactPunch_medium'), target: -17 },
  hit_soft: { files: n5(K + 'impactSoft_medium'), target: -16 },
  hit_wood: { files: n5(K + 'impactWood_medium'), target: -17 },
  hit_stone: { files: n5(K + 'impactPlate_medium'), target: -18 },
  hit_ice: { files: n5(K + 'impactGlass_medium'), target: -20 },
  crit: { files: [1, 2, 3, 4, 5].map((i) => `tinysized/sword-clash-0${i}.wav`), target: -19, max: 0.6 },
  hurt: { files: n5(K + 'impactPunch_heavy'), target: -15 },
  pop: { files: ['100-CC0-SFX_0/plop_01.ogg', '100-CC0-SFX_0/plop_02.ogg'], target: -18 },
  squish: { files: [1, 2, 3, 4].map((i) => `cc80/creature_slime_0${i}.ogg`), target: -20, max: 0.8 },
  roll: { files: [1, 2, 3, 4].map((i) => `${R}cloth${i}.ogg`), target: -20 },
  counter: { files: [K + 'impactBell_heavy_000.ogg', K + 'impactBell_heavy_002.ogg'], target: -17, max: 1.2 },
  stunned: { files: [I + 'glass_002.ogg', I + 'glass_003.ogg'], target: -24 },
  shock: { files: ['100-CC0-SFX_0/slam_01.ogg', '100-CC0-SFX_0/slam_02.ogg', '100-CC0-SFX_0/slam_03.ogg'], target: -17, max: 0.9 },
  slam: { files: ['sci-fi-sounds/Audio/lowFrequency_explosion_000.ogg', 'sci-fi-sounds/Audio/lowFrequency_explosion_001.ogg'], target: -15, max: 1.6 },
  boom: { files: ['25-CC0-bang-sfx/bang_01.ogg', '25-CC0-bang-sfx/bang_02.ogg', '25-CC0-bang-sfx/bang_03.ogg', '100-CC0-SFX_0/explosion.ogg'], target: -16, max: 1.4 },
  cannon: { files: ['25-CC0-bang-sfx/cannon_01.ogg', '25-CC0-bang-sfx/cannon_02.ogg', '25-CC0-bang-sfx/cannon_03.ogg'], target: -18, max: 1.2 },
  gun: { files: ['25-CC0-bang-sfx/shot_01.ogg', '25-CC0-bang-sfx/shot_02.ogg', '25-CC0-bang-sfx/shot_03.ogg'], target: -21, max: 0.5 },
  spit: { files: ['cc80/spell_01.ogg', 'cc80/spell_02.ogg'], target: -22, max: 0.7 },
  dirt: { files: [1, 2, 3, 4].map((i) => `cc80/stones_0${i}.ogg`), target: -19, max: 0.9 },
  roar: { files: [1, 2, 3].map((i) => `cc80/creature_roar_0${i}.ogg`), target: -16, max: 2.2 },
  // 채집
  chop: { files: [R + 'chop.ogg', ...n5(K + 'impactWood_heavy').slice(0, 4)], target: -17 },
  mine: { files: n5(K + 'impactMining'), target: -17 },
  mine_ice: { files: n5(K + 'impactGlass_heavy'), target: -19 },
  rustle: { files: n5(K + 'footstep_grass'), target: -18 },
  gathered: { files: [I + 'confirmation_001.ogg'], target: -22 },
  // 획득·성장
  coin: { files: ['rpgpack/RPG Sound Pack/inventory/coin.wav', 'rpgpack/RPG Sound Pack/inventory/coin2.wav', 'rpgpack/RPG Sound Pack/inventory/coin3.wav', ...[1, 2, 3, 4].map((i) => `cc80/item_coins_0${i}.ogg`)], target: -21, max: 0.7 },
  pickup: { files: [I + 'pluck_001.ogg', I + 'pluck_002.ogg', I + 'drop_002.ogg', I + 'drop_003.ogg'], target: -21 },
  rare: { files: [1, 2, 3, 4].map((i) => `cc80/item_gem_0${i}.ogg`), target: -19, max: 1.2 },
  levelup: { files: [J + 'Steel jingles/jingles_STEEL07.ogg'], target: -17 },
  quest: { files: [J + 'Pizzicato jingles/jingles_PIZZI07.ogg'], target: -17 },
  jingle: { files: [J + 'Pizzicato jingles/jingles_PIZZI03.ogg'], target: -18 },
  victory: { files: [J + 'Steel jingles/jingles_STEEL02.ogg'], target: -16 },
  drink: { files: ['rpgpack/RPG Sound Pack/inventory/bubble.wav', 'rpgpack/RPG Sound Pack/inventory/bubble2.wav', 'rpgpack/RPG Sound Pack/inventory/bubble3.wav'], target: -20, max: 1.0 },
  heal: { files: ['curemagic/Cure2.wav'], target: -21 },
  anvil: { files: ['tinysized/metal-hammer-hit-01.wav', 'tinysized/metal-hammer-hit-02.wav'], target: -18, max: 0.9 },
  // 건설·기지
  build: { files: n5(K + 'impactPlank_medium'), target: -17 },
  horn: { files: ['misc/theircoming3_0.ogg'], target: -16, max: 4.5 },
  birds: { files: ['misc/birds-isaiah658_0.ogg'], target: -24, max: 4, fade: 1.2 },
  // UI
  click: { files: [1, 2, 3].map((i) => `${U}click${i}.ogg`), target: -24 },
  tab: { files: [1, 2, 3].map((i) => `${I}switch_00${i}.ogg`), target: -24 },
  tick: { files: [1, 2, 3].map((i) => `${U}rollover${i}.ogg`), target: -30 },
  open: { files: [1, 2, 3].map((i) => `${I}maximize_00${i}.ogg`), target: -24 },
  close: { files: [1, 2, 3].map((i) => `${I}minimize_00${i}.ogg`), target: -24 },
  error: { files: [I + 'error_004.ogg', I + 'error_006.ogg'], target: -24 },
  talk: { files: [I + 'select_001.ogg', I + 'select_002.ogg'], target: -26 },
  // 발소리
  step_grass: { files: n5(K + 'footstep_grass'), target: -27 },
  step_snow: { files: n5(K + 'footstep_snow'), target: -27 },
  step_dirt: { files: [0, 1, 2, 3, 4, 5].map((i) => `${R}footstep0${i}.ogg`), target: -28 },
  step_sand: { files: [1, 2, 3, 4, 5].map((i) => `tinysized/mud-steps-0${i}.wav`), target: -29, max: 0.4 },
  // 환경음 (반복, 게임이 앞뒤를 겹쳐 이어 튼다)
  amb_birds: { files: ['misc/park_ambience_birds.wav'], start: 60, max: 45, target: -30, kbps: 64, fade: 0.5 },
  amb_forest: { files: ['misc/park_ambience_birds.wav'], start: 200, max: 45, target: -31, kbps: 64, fade: 0.5 },
  amb_wind: { files: ['misc/park_ambience_wind.wav'], start: 30, max: 45, target: -30, kbps: 64, fade: 0.5 },
  amb_night: { files: ['misc/crickets_1.mp3'], target: -31, kbps: 64, fade: 0.3 },
};

function measure(file, pre) {
  const r = spawnSync(FF, ['-hide_banner', '-i', file, '-af', `${pre}volumedetect`, '-f', 'null', '-'], { encoding: 'utf8' });
  const mean = +r.stderr.match(/mean_volume: (-?[\d.]+)/)[1];
  const max = +r.stderr.match(/max_volume: (-?[\d.]+)/)[1];
  return { mean, max };
}

if (existsSync(OUT)) for (const f of readdirSync(OUT)) if (f.endsWith('.mp3')) rmSync(join(OUT, f));
mkdirSync(OUT, { recursive: true });
let count = 0;
for (const [key, m] of Object.entries(MAP)) {
  m.files.forEach((rel, i) => {
    const src = join(SRC, rel);
    if (!existsSync(src)) { console.warn('없음:', rel); return; }
    const fade = m.fade ?? 0.04;
    const trim = [
      m.start ? `atrim=start=${m.start},asetpts=PTS-STARTPTS` : 'silenceremove=start_periods=1:start_threshold=-50dB',
      m.max ? `atrim=0:${m.max},afade=t=out:st=${Math.max(0, m.max - fade)}:d=${fade}` : null,
      m.start ? `afade=t=in:d=${fade}` : null,
    ].filter(Boolean).join(',');
    const pre = `aformat=channel_layouts=mono,${trim},`;
    const { mean, max } = measure(src, pre);
    const gain = Math.min((m.target ?? -20) - mean, -1 - max) + (m.db ?? 0);
    const out = join(OUT, `${key}_${i + 1}.mp3`);
    const r = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-af', `${pre}volume=${gain.toFixed(2)}dB`, '-ar', '44100', '-ac', '1', '-b:a', `${m.kbps ?? 96}k`, out], { encoding: 'utf8' });
    if (r.status !== 0) { console.error(key, rel, r.stderr); return; }
    count++;
  });
}
console.log(`효과음 ${count}개 → ${OUT}`);
