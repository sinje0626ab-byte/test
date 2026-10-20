import { LEADER, STORY, UNITY } from '../config.js';
import { chance } from './rng.js';
import { addEffect } from '../religion/modifiers.js';
import { CAST, castAge, setCast } from '../story/cast.js';

// 교주: 나이·사망·체포·수감·후계

// 후계자는 계시 VII 에서 등장인물 중에 고른다 (leader.heirCast)
export const HEIRS = { blood: '조카', loyal: '2인자', dream: '꿈에 나온 사람' };

export function isJailed(state) {
  return state.leader.jailedUntil != null && state.turn < state.leader.jailedUntil;
}

// 매 턴: 나이 먹기 + 70세부터 사망 판정
export function leaderTurn(state, report) {
  const L = state.leader;
  L.ageMonths += 1;
  if (L.ageMonths >= LEADER.agingTurns) {
    L.ageMonths = 0;
    L.age += 1;
  }
  if (L.age >= LEADER.deathAge && !state.result) {
    const p = LEADER.deathBase + LEADER.deathPerYear * (L.age - LEADER.deathAge);
    if (chance(state, p)) leaderFalls(state, 'death', report);
  }
}

// 교주가 쓰러지거나 체포되었다. 후계자가 있으면 계승, 없으면 패배.
export function leaderFalls(state, cause, report) {
  const L = state.leader;
  report?.events.push({ type: cause, name: L.name });
  if (L.immortal) return defeat(state, 'collapse');
  if (!L.heir) return defeat(state, cause);
  succeed(state, report);
}

function succeed(state, report) {
  const L = state.leader;
  const heir = L.heir;
  let delta = LEADER.successionUnity[heir] ?? -10;
  if (L.rite === 'sealed') delta += STORY.rite.sealed.successionBonus;
  if (L.rite === 'council' && heir === 'blood') delta += STORY.rite.council.bloodPenalty;
  state.unity = Math.max(0, Math.min(UNITY.max, state.unity + delta));
  if (heir === 'loyal') addEffect(state, 'heir:loyal');
  L.generation += 1;
  const who = L.heirCast;
  L.name = who ? CAST[who].name : `${HEIRS[heir]}`;
  L.age = who ? castAge(state, who) : LEADER.heirAge;
  L.ageMonths = 0;
  if (who) setCast(state, who, 'leader');
  L.heir = null;
  L.heirCast = null;
  L.rite = null;
  L.jailedUntil = null;
  report?.events.push({ type: 'succession', heir, unityDelta: delta });
  if (state.unity <= 0) defeat(state, 'schism');
}

export function defeat(state, reason) {
  if (state.result) return;
  state.result = 'defeat';
  state.defeatReason = reason;
}

// 패배 화면. who 는 마지막 대사를 하는 사람 (그 사람이 없으면 다음 사람)
export const DEFEAT_TEXT = {
  followers: { title: '접이식 의자 서른 개, 빈자리 서른 개', body: '마지막 신도가 단톡방을 나갔다. 성소 불을 끄고 나오는데 1층 치킨집 사장님이 "요즘 조용하네요" 했다.', who: ['mom', 'minho'], line: { mom: '밥은 먹고 다녀라. 반찬 갖다 놓을게.', minho: '근데요, 저 다음 주에도 와도 돼요? 화장실 쓰러.' } },
  arrest: { title: '교주 구속', body: '호송차 문이 닫혔다. 뒤를 이을 사람을 정해 두지 않았다. 다음 날 성소 문에는 자물쇠 두 개가 걸렸다. 하나는 경찰, 하나는 건물주.', who: ['mom', 'taesik'], line: { mom: '면회 가면 뭐 해 가니. 김치는 되나?', taesik: '야, 아니 교주님. 300만 원은 꼭 갚을게.' } },
  death: { title: '교주 별세', body: '후계자는 없었다. 간부들은 장례식장 육개장을 앞에 두고 서로를 쳐다봤다. 아무도 숟가락을 먼저 들지 않았다.', who: ['dongcheol', 'jeongsuk', 'minho'], line: { dongcheol: '절차대로 하겠습니다. 다만 절차를 누가 정하느냐가 문제입니다.', jeongsuk: '어머... 조의금 장부는 제가 쓸게요.', minho: '근데요, 이제 우리 어떡해요?' } },
  collapse: { title: '안 죽는다던 교주가 죽었다', body: '"나는 안 죽는다"던 사람이 죽었다. 신도들은 그 말부터 의심했다. 건강검진 안내 문자는 그 뒤로도 두 번 더 왔다.', who: ['mom', 'subin'], line: { mom: '그러게 내가 밥 제때 먹으라고 했잖아.', subin: '이거 논문 결론으로 써도 될까요.' } },
  schism: { title: '갈라졌다', body: '파벌마다 자기가 진짜라고 했다. 길 하나를 사이에 두고 간판이 세 개 걸렸다. 글씨체는 셋 다 같았다.', who: ['dongcheol', 'subin', 'jeongsuk'], line: { dongcheol: '저희 쪽이 정통입니다. 다만 교주님 사진은 계속 걸어 두겠습니다.', subin: '이제 비교 연구가 되겠네요.', jeongsuk: '어머, 저는 세 군데 다 다닐게요.' } },
};

// 승리 화면 대사
export const VICTORY_TEXT = {
  title: '지구 인구 열 명 중 세 명',
  body: (name) => `${name} 신도가 지구 인구의 30%를 넘었다. 성소 1층 치킨집은 이제 전 세계에 지점이 412개다.`,
  who: ['mom', 'taesik', 'minho', 'jeongsuk'],
  line: { mom: '그래서 밥은 먹었니?', taesik: '야, 아니 교주님. 이제 300만 원 안 갚아도 되지?', minho: '근데요, 다음엔 뭐 해요?', jeongsuk: '어머, 교주님~ 이건 진짜 계약 대박이에요.' },
};
