import { CAST, isIn, castOf, j } from '../story/cast.js';

// 시스템 문구를 등장인물 대사로 바꾼다.
// 상황마다 후보를 순서대로 적고, 지금 남아 있는 첫 사람이 말한다 (아무도 없으면 마지막 후보가 해설로).

const LINES = {
  noFaith: [['taesik', '금고에 그 돈 없어요. 진짜로요. 세 번 셌어요.'], ['jeongsuk', '어머, 이번 달은 좀 빠듯해요~ 다음 달에 하세요.'], ['minho', '근데요, 돈이 모자라요.']],
  cap: [['dongcheol', '정원이 찼습니다. 다만 교단이 더 크면 자리를 늘릴 수 있습니다.'], ['minho', '근데요, 지금 사람 더 받으면 앉을 의자가 없어요.']],
  jailed: [['minho', '근데요, 교주님 지금 안에 계시잖아요. 면회 시간에 정해요.'], ['mom', '거기서 뭘 하겠다고. 밥이나 잘 먹어.']],
  banned: [['subin', '거기 지금 활동 금지예요. 간판 달면 바로 신고 들어와요.'], ['minho', '근데요, 거기 지금 못 들어가요.']],
  needFollowers: [['jeongsuk', '어머, 거기는 아직 우리 사람이 없어요~ 한 명이라도 있어야 시작하죠.'], ['minho', '근데요, 거기 아는 사람이 없어요.']],
  unitDone: [['minho', '근데요, 걔 오늘은 벌써 다녀왔어요.']],
  cantMove: [['minho', '근데요, 거기까지는 오늘 못 가요. 기름이 없어요.']],
  locked: [['dongcheol', '아직 그 단계가 아닙니다. 다만 준비는 해 두겠습니다.'], ['jeongsuk', '어머, 그건 교단이 좀 더 커야 돼요~']],
  cooldown: [['subin', '기적은 아직이에요. 지난번 거 소문이 아직 돌고 있어요.']],
  already: [['taesik', '거기 이미 있어요. 하나 더 지으면 대출 또 받아야 돼요.']],
  generic: [['minho', '근데요, 그건 지금 안 돼요.']],
};

// 막힌 이유(문자열) → 상황
function situation(message) {
  if (/신앙력/.test(message)) return 'noFaith';
  if (/상한|정원/.test(message)) return 'cap';
  if (/수감/.test(message)) return 'jailed';
  if (/금지/.test(message)) return 'banned';
  if (/신도 .*(이상|있어야)|신도가 있는 나라|성소가 없/.test(message)) return 'needFollowers';
  if (/이미 활동|이미 이동/.test(message)) return 'unitDone';
  if (/갈 수 없/.test(message)) return 'cantMove';
  if (/해금|계시 VI/.test(message)) return 'locked';
  if (/달 뒤에/.test(message)) return 'cooldown';
  if (/이미 성지/.test(message)) return 'already';
  return 'generic';
}

export function voice(state, key) {
  const list = LINES[key] ?? LINES.generic;
  const hit = list.find(([id]) => isIn(state, id)) ?? list.at(-1);
  return { who: hit[0], say: hit[1] };
}

// 막혔을 때 쪽지: toast(blocked(state, r.message))
export function blocked(state, message) {
  const v = voice(state, situation(message ?? ''));
  return { who: v.who, say: v.say, body: message, tone: 'bad', state, duration: 4200 };
}

// 유닛이 놀고 있을 때
export function idleLine(state, idle) {
  const n = idle.length;
  const kinds = new Set(idle.map((u) => u.type));
  const what = kinds.size === 1 && kinds.has('missionary') ? '선교사' : '애들';
  const count = ['', '하나', '둘', '셋', '넷', '다섯'][n] ?? `${n}명`;
  if (isIn(state, 'minho')) return { who: 'minho', say: `교주님, ${what} ${count}${n > 5 ? '이' : '가'} 아직 성소에서 귤 까먹고 있는데요?` };
  if (isIn(state, 'jeongsuk')) return { who: 'jeongsuk', say: `어머, 교주님~ 아직 안 나간 사람이 ${n}명이에요. 이대로 넘겨요?` };
  return { who: 'mom', say: `애들 ${n}명이 아직 놀고 있다. 그냥 둬도 되니?` };
}

// 새 사람이 합류했을 때 첫인사
export const JOIN_LINES = {
  jeongsuk: '어머, 교주님~ 저 한정숙이에요. 명함 받으세요. 앞뒤 다 읽어 보세요.',
  subin: '논문 때문에 왔어요. 근데 좀 더 있어 볼게요. 적어도 되죠?',
  dongcheol: '강동철입니다. 학원은 정리했습니다. 다만 학부모 명단은 가져왔습니다.',
  seojin: '그래서요? 저 여기서 밥 먹어도 돼요? 학원은 끊었어요.',
  mom: '반찬 갖다 놨다.',
  taesik: '야, 아니 교주님. 나 왔어.',
  minho: '근데요, 화장실 어디예요?',
};

// 단계가 오를 때 한마디
export const STAGE_LINES = {
  new: [['jeongsuk', '어머, 교주님~ 뉴스에서 우리를 "신흥 종교"래요! 드디어 종교예요!'], ['minho', '근데요, 우리 이제 종교래요.']],
  international: [['minho', '근데요, 일본에서 전화 왔는데 국제전화 요금 누가 내요?'], ['subin', '이제 비교 연구가 가능하겠어요.']],
  world: [['mom', '외국 사람들도 우리 반찬 먹는다더라. 김치 담글 거 더 사야겠다.'], ['taesik', '야, 아니 교주님. 이거 진짜 되는 거였어?']],
};

export function stageLine(state, stageId) {
  const list = STAGE_LINES[stageId] ?? [];
  const hit = list.find(([id]) => isIn(state, id)) ?? list.at(-1);
  return hit ? { who: hit[0], say: hit[1] } : null;
}

// 그 사람이 지금 뭐 하는지 한 줄 (교단 장부 · 인물 목록)
export function castStatusLine(state, id) {
  const c = castOf(state, id);
  const name = CAST[id].short;
  return {
    out: `${j(name, '은/는')} 아직 모른다`,
    active: CAST[id].relation,
    left: `${j(name, '은/는')} 떠났다. 연락은 가끔 된다`,
    betrayed: `${j(name, '은/는')} 등을 돌렸다. 할 말이 많아 보인다`,
    arrested: `${j(name, '은/는')} 구치소에 있다`,
    dead: `${j(name, '은/는')} 돌아가셨다`,
    leader: `${j(name, '이/가')} 교주 자리에 있다`,
  }[c.status];
}
