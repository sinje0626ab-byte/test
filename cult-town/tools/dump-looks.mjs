// 모든 사람의 외형(look)을 JSON 으로 (tools/build-assets.py 가 읽는다). 키 = 게임 텍스처 키에서 'p:' 를 뗀 것.
import { ALL_RESIDENTS } from '../src/data/residents.js';
import { CAST } from '../src/data/cast.js';
import { ALL_CLERGY } from '../src/data/clergy.js';
import { REPORTER_INFO } from '../src/data/threats.js';
import { RIVAL_LOOKS } from '../src/data/rival.js';
import { LEADER_LOOK, LEADER_STAGE_LOOKS, FOLLOWER_LOOKS, EXTRA_LOOKS } from '../src/data/looks.js';

const out = { leader: LEADER_LOOK, ...LEADER_STAGE_LOOKS };
for (const r of ALL_RESIDENTS) out[r.id] = r.look;
for (const c of CAST) out[`cast:${c.id}`] = c.look;
for (const c of ALL_CLERGY) out[`c:${c.id}`] = c.look;
out['x:reporter'] = REPORTER_INFO.look;
for (const [k, v] of Object.entries(RIVAL_LOOKS)) out[`v:${k}`] = v;
FOLLOWER_LOOKS.forEach((v, k) => { out[`follower:${k}`] = v; });
EXTRA_LOOKS.forEach((v, k) => { out[`extra:${k}`] = v; });
process.stdout.write(JSON.stringify(out));
