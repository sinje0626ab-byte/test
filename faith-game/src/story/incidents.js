import { INCIDENT_VALUES as V, UNITY } from '../config.js';
import { world } from '../data/loader.js';
import { addEffect } from '../religion/modifiers.js';
import { addFollowers } from '../religion/spread.js';
import { totalFollowers } from '../game/state.js';
import { stageCostMul } from '../game/actions.js';
import { bumpAlert, bumpAversion, changeUnity, riskWeight } from '../game/watch.js';
import { grantUnit, reachable } from '../units/units.js';
import { chance, randInt } from '../game/rng.js';

// 무작위 사건 카드. 3~5턴마다 1장.
//   when(state, ctx) → 등장 가능 여부 · weight(state, ctx) → 가중치 (그림자 장부·결속 반영)
//   choices[] = { id, label, effectText, dark?, cost?(state), available?(state) → true|'사유', apply(state, ctx) → 결과 문장 }
// 정부 경계 50%를 넘은 나라가 생기면 '경고장' 카드가 우선 나온다 (ctx.country).

const home = (s) => s.religion.home;
const homeName = (s) => world.countries[home(s)].name;
const cost = (s, base) => Math.round(base * stageCostMul(s));
const afford = (s, base) => (s.faith >= cost(s, base) ? true : `신앙력 ${cost(s, base)} 필요`);
const pay = (s, base) => { s.faith = Math.max(0, s.faith - cost(s, base)); };
const loseHome = (s, frac) => -addFollowers(s, home(s), -s.countries[home(s)].followers * frac);
const loseAll = (s, frac) => {
  let lost = 0;
  for (const id of world.ids) lost -= addFollowers(s, id, -s.countries[id].followers * frac);
  return lost;
};
const n = (x) => Math.round(x).toLocaleString('ko-KR');

export const INCIDENT_CARDS = [
  {
    id: 'embezzle', kicker: '내부 비리', title: '간부의 헌금 횡령',
    text: () => '회계를 맡던 간부의 통장에서 헌금이 사라졌다. 이 사실을 아는 사람은 아직 몇 명뿐이다.',
    when: (s) => s.turn >= 8 && s.faith >= 30,
    weight: (s) => riskWeight(s),
    choices: [
      { id: 'punish', label: '처벌한다', effectText: '결속↓ · 사라진 헌금 일부 회수', apply(s) { const lost = s.faith * V.embezzle.loss; s.faith -= lost * (1 - V.embezzle.punishRecover); changeUnity(s, V.embezzle.punishUnity); return '그는 짐을 쌌다. 남은 간부들은 서로의 눈치를 보기 시작했다.'; } },
      { id: 'ignore', label: '묵인한다', dark: 2, effectText: '결속 소폭↑ · 그림자 장부', apply(s) { s.faith -= s.faith * V.embezzle.loss; changeUnity(s, V.embezzle.ignoreUnity); return '아무 일도 없었다. 적어도 장부 위에서는.'; } },
      { id: 'apology', label: '공개 사과', cost: (s) => cost(s, V.embezzle.apologyCost), available: (s) => afford(s, V.embezzle.apologyCost), effectText: '거부감↓ 결속↑ · 신앙력 소모', apply(s) { s.faith -= s.faith * V.embezzle.loss; pay(s, V.embezzle.apologyCost); bumpAversion(s, home(s), V.embezzle.apologyAversion); changeUnity(s, V.embezzle.apologyUnity); return '고개 숙인 교주의 사진이 의외로 호평을 받았다.'; } },
    ],
  },
  {
    id: 'whistle', kicker: '폭로', title: '탈퇴자의 폭로 글',
    text: (s) => `"${s.religion.name}에서 보낸 3년"이라는 글이 커뮤니티 인기글에 올랐다. 댓글이 빠르게 늘고 있다.`,
    when: (s) => totalFollowers(s) >= 100,
    weight: (s) => 0.6 * riskWeight(s) ** 1.5,
    choices: [
      { id: 'rebut', label: '반박문 게시', effectText: '결속↑ · 거부감↑ 경계↑', apply(s) { bumpAversion(s, home(s), V.whistle.rebutAversion); bumpAlert(s, home(s), V.whistle.rebutAlert); changeUnity(s, V.whistle.rebutUnity); return '반박문은 원문보다 더 많이 공유되었다. 대부분은 조롱과 함께.'; } },
      { id: 'reconcile', label: '찾아가 화해한다', cost: (s) => cost(s, V.whistle.reconcileCost), available: (s) => afford(s, V.whistle.reconcileCost), effectText: '그림자 장부 −1 · 거부감 소폭↓', apply(s) { pay(s, V.whistle.reconcileCost); s.riskPoints = Math.max(0, s.riskPoints + V.whistle.reconcileRisk); bumpAversion(s, home(s), V.whistle.reconcileAversion); return '글은 조용히 삭제되었다.'; } },
      { id: 'ignore', label: '무시한다', effectText: '거부감↑', apply(s) { bumpAversion(s, home(s), V.whistle.ignoreAversion); return '침묵은 인정으로 읽혔다.'; } },
    ],
  },
  {
    id: 'families', kicker: '항의', title: '신도 가족들의 항의 시위',
    text: (s) => `${homeName(s)} 성소 앞에 "우리 아이를 돌려달라"는 피켓이 줄지어 섰다.`,
    when: (s) => totalFollowers(s) >= 500,
    weight: (s) => 0.8 * riskWeight(s),
    choices: [
      { id: 'meet', label: '가족 면담을 연다', cost: (s) => cost(s, V.families.meetCost), available: (s) => afford(s, V.families.meetCost), effectText: '거부감↓ · 본거지 신도 소폭↓', apply(s) { pay(s, V.families.meetCost); bumpAversion(s, home(s), V.families.meetAversion); const l = loseHome(s, V.families.meetLoss); return `면담 뒤 ${n(l)}명이 가족과 함께 집으로 돌아갔다. 시위는 끝났다.`; } },
      { id: 'lock', label: '성소 문을 걸어 잠근다', dark: 1, effectText: '결속↑ · 경계↑', apply(s) { changeUnity(s, V.families.lockUnity); bumpAlert(s, home(s), V.families.lockAlert); return '문 안쪽의 신도들은 더 단단해졌고, 문 바깥의 카메라는 더 많아졌다.'; } },
      { id: 'rally', label: '맞불 집회', effectText: '결속↑ · 거부감↑', apply(s) { changeUnity(s, V.families.rallyUnity); bumpAversion(s, home(s), V.families.rallyAversion); return '두 집회가 길 하나를 사이에 두고 마주 섰다.'; } },
    ],
  },
  {
    id: 'celebrity', kicker: '호재', title: '유명인의 입교 소식',
    text: () => '한때 잘나가던 방송인이 SNS에 당신의 문양을 올렸다. "이제야 숨이 쉬어진다."',
    when: (s) => totalFollowers(s) >= 300,
    weight: () => 0.6,
    choices: [
      { id: 'promote', label: '대대적으로 홍보한다', effectText: `본거지 증가↑ (${V.celebrity.turns}턴) · 경계↑`, apply(s) { addEffect(s, 'incident:celebrity', { turns: V.celebrity.turns }); bumpAlert(s, home(s), V.celebrity.alert); return '그의 얼굴이 들어간 전단지가 동네마다 붙었다.'; } },
      { id: 'quiet', label: '조용히 환영한다', effectText: '결속↑', apply(s) { changeUnity(s, V.celebrity.quietUnity); return '그는 맨 뒷줄에 앉아 기도했다. 신도들은 그 모습에 감동했다.'; } },
      { id: 'recruit', label: '간부로 영입한다', dark: 1, effectText: '신앙력↑ · 그림자 장부', apply(s) { s.faith += cost(s, V.celebrity.recruitFaith); return '그의 후원금이 금고에 들어왔다. 그리고 그의 지분도.'; } },
    ],
  },
  {
    id: 'rumor', kicker: '소문', title: '기적 같은 회복 사례',
    text: () => '"기도 모임 뒤로 허리 통증이 사라졌다"는 이야기가 동네 단톡방을 돌고 있다.',
    when: (s) => totalFollowers(s) >= 200,
    weight: (s) => (s.religion.tenets.includes('healing') ? 1 : 0.6),
    choices: [
      { id: 'spread', label: '대대적으로 선전한다', effectText: `자연 증가↑ (${V.rumor.turns}턴) · 경계↑ (치유 간증 집회라면 더 크게)`, apply(s) { addEffect(s, 'incident:rumor', { turns: V.rumor.turns }); bumpAlert(s, home(s), V.rumor.alert + (s.religion.tenets.includes('healing') ? V.rumor.healingAlert : 0)); return '"기적"이라는 단어가 전단지 맨 위에 올라갔다. 보건 당국도 그 전단지를 받아 보았다.'; } },
      { id: 'careful', label: '신중하게 확인한다', effectText: '결속↑', apply(s) { changeUnity(s, V.rumor.quietUnity); return '당신은 "우연일 수도 있다"고 말했다. 그 겸손이 오히려 믿음을 키웠다.'; } },
    ],
  },
  {
    id: 'feud', kicker: '내분', title: '간부들의 파벌 다툼',
    text: () => '예배 순서 하나를 두고 시작된 말다툼이 이제 두 개의 단체 대화방으로 갈라졌다.',
    when: (s) => totalFollowers(s) >= 1000,
    weight: (s) => 0.5 * riskWeight(s) * (s.unity < 50 ? 1.6 : 1),
    choices: [
      { id: 'purge', label: '한쪽을 숙청한다', dark: 2, effectText: '결속↓ · 신도 소폭↓ · 그림자 장부', apply(s) { changeUnity(s, V.feud.purgeUnity); const l = loseAll(s, V.feud.purgeLoss); return `${n(l)}명이 함께 떠났다. 남은 사람들은 더 조용해졌다.`; } },
      { id: 'mediate', label: '직접 중재한다', cost: (s) => cost(s, V.feud.mediateCost), available: (s) => afford(s, V.feud.mediateCost), effectText: '결속↑ · 신앙력 소모', apply(s) { pay(s, V.feud.mediateCost); changeUnity(s, V.feud.mediateUnity); return '두 간부가 당신 앞에서 악수했다. 사진도 찍었다.'; } },
      { id: 'split', label: '각자 지부를 맡긴다', effectText: `이탈↑ (${V.feud.splitTurns}턴) · 선교사 1명`, apply(s) { addEffect(s, 'incident:feud', { turns: V.feud.splitTurns }); grantUnit(s, 'missionary', home(s)); return '경쟁은 계속되었다. 이번에는 누가 더 많이 데려오느냐로.'; } },
    ],
  },
  {
    id: 'tax', kicker: '당국', title: '세무 조사 통보',
    text: () => '관할 세무서에서 등기 우편이 왔다. 지난 3년치 장부를 제출하라고 한다.',
    when: (s) => totalFollowers(s) >= 5000,
    weight: (s) => 0.5 * riskWeight(s),
    choices: [
      { id: 'open', label: '장부를 전면 공개한다', effectText: '신앙력 일부 납부 · 경계↓ · 그림자 장부 −1', apply(s) { s.faith -= s.faith * V.tax.openLoss; bumpAlert(s, home(s), V.tax.openAlert); s.riskPoints = Math.max(0, s.riskPoints - 1); return '추징금은 아팠지만, 서류철은 닫혔다.'; } },
      { id: 'tidy', label: '장부를 정리한다', dark: 2, effectText: `성공률 ${Math.round(V.tax.tidyChance * 100)}% · 실패하면 경계↑↑ 결속↓`, apply(s) { if (chance(s, V.tax.tidyChance)) { bumpAlert(s, home(s), V.tax.tidyAlert); return '숫자들이 깔끔하게 맞아떨어졌다. 너무 깔끔하게.'; } bumpAlert(s, home(s), V.tax.tidyFailAlert); changeUnity(s, V.tax.tidyFailUnity); return '조사관이 같은 페이지를 세 번 넘겨 보았다. 사건은 다른 부서로 넘어갔다.'; } },
      { id: 'donate', label: '지역 기부로 분위기를 바꾼다', dark: 1, cost: (s) => cost(s, V.tax.donateCost), available: (s) => afford(s, V.tax.donateCost), effectText: '경계 소폭↓ · 신앙력 소모', apply(s) { pay(s, V.tax.donateCost); bumpAlert(s, home(s), V.tax.donateAlert); return '지역 신문 1면에 기부 사진이 실렸다.'; } },
    ],
  },
  {
    id: 'documentary', kicker: '방송', title: '다큐멘터리 섭외',
    text: () => "공영방송 PD가 '요즘 사람들은 무엇을 믿는가'라는 다큐멘터리 출연을 제안했다.",
    when: (s) => totalFollowers(s) >= 2000,
    weight: () => 0.5,
    choices: [
      { id: 'appear', label: '출연한다', effectText: `성공률 ${Math.round(V.documentary.chance * 100)}% · 성공하면 본거지 신도↑, 실패하면 거부감↑↑`, apply(s) { if (chance(s, V.documentary.chance)) { const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.documentary.winFollowers); bumpAversion(s, home(s), V.documentary.winAversion); return `방송 다음 날, ${n(g)}명이 성소를 찾아왔다.`; } bumpAversion(s, home(s), V.documentary.loseAversion); return '편집은 잔인했다. 당신이 웃는 장면 뒤에는 늘 불길한 음악이 깔렸다.'; } },
      { id: 'refuse', label: '거절한다', effectText: '거부감 소폭↑', apply(s) { bumpAversion(s, home(s), V.documentary.refuseAversion); return '방송에는 "취재를 거부했다"는 자막만 나갔다.'; } },
      { id: 'safe', label: '편집권을 조건으로 출연한다', cost: (s) => cost(s, V.documentary.safeCost), available: (s) => afford(s, V.documentary.safeCost), effectText: '본거지 신도 소폭↑ · 신앙력 소모', apply(s) { pay(s, V.documentary.safeCost); const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.documentary.safeFollowers); return `무난한 방송이었다. ${n(g)}명이 새로 찾아왔다.`; } },
    ],
  },
  {
    id: 'invite', kicker: '해외', title: '바다 건너에서 온 초대장',
    text: (s, ctx) => `${world.countries[ctx.country].name}에 사는 신도의 친척이 "여기에도 모임을 열어 달라"고 편지를 보냈다.`,
    when: (s) => totalFollowers(s) >= 1000,
    context: (s) => { const opts = [...reachable(home(s)).keys()].filter((id) => s.countries[id].followers < 1000 && !s.countries[id].banned); return opts.length ? { country: opts[randInt(s, 0, opts.length - 1)] } : null; },
    weight: () => 0.6,
    choices: [
      { id: 'open', label: '지부를 연다', effectText: '그 나라에 선교사 1명', apply(s, ctx) { grantUnit(s, 'missionary', ctx.country); return `${world.countries[ctx.country].name}에 첫 모임 공지가 붙었다.`; } },
      { id: 'decline', label: '아직은 이르다', effectText: '결속 소폭↑', apply(s) { changeUnity(s, V.invite.declineUnity); return '"본거지부터 단단히." 간부들은 고개를 끄덕였다.'; } },
    ],
  },
  {
    id: 'warning', kicker: '당국', title: '정부의 경고장',
    text: (s, ctx) => `${world.countries[ctx.country].name} 당국이 공문을 보냈다. "귀 단체의 활동 실태를 점검할 예정입니다."`,
    when: () => false, // 정부 경계 50% 를 넘을 때만 강제로 나온다
    weight: () => 0,
    choices: [
      { id: 'audit', label: '자진 점검을 받는다', cost: (s) => cost(s, V.warning.auditCost), available: (s) => afford(s, V.warning.auditCost), effectText: '그 나라 경계↓ · 신앙력 소모', apply(s, ctx) { pay(s, V.warning.auditCost); bumpAlert(s, ctx.country, V.warning.auditAlert); return '점검반은 커피만 마시고 돌아갔다.'; } },
      { id: 'sign', label: '간판과 홍보물을 정비한다', effectText: '그 나라 거부감·경계 소폭↓', apply(s, ctx) { bumpAversion(s, ctx.country, V.warning.signAversion); bumpAlert(s, ctx.country, V.warning.signAlert); return '"치유" "기적" 같은 단어가 전단지에서 사라졌다.'; } },
      { id: 'ignore', label: '무시한다', effectText: '그 나라 경계 소폭↑', apply(s, ctx) { bumpAlert(s, ctx.country, V.warning.ignoreAlert); return '공문은 서랍 속으로 들어갔다. 당국의 서랍에는 사본이 남았다.'; } },
    ],
  },
  {
    id: 'exodus', kicker: '이탈', title: '젊은 신도들의 이탈 러시',
    text: () => '20대 신도 몇 명이 같은 날 단체 대화방을 나갔다. 남은 이들도 흔들리고 있다.',
    when: (s) => totalFollowers(s) >= 200,
    weight: (s) => 0.6 * (1 + Math.max(0, 60 - s.unity) / 40),
    choices: [
      { id: 'retreat', label: '수련회를 연다', cost: (s) => cost(s, V.exodus.retreatCost), available: (s) => afford(s, V.exodus.retreatCost), effectText: `이탈↓ (${V.exodus.turns}턴) · 신앙력 소모`, apply(s) { pay(s, V.exodus.retreatCost); addEffect(s, 'incident:retreat', { turns: V.exodus.turns }); return '모닥불 앞에서 다들 울었다. 다음 주에도 모두 나왔다.'; } },
      { id: 'crackdown', label: '강경하게 단속한다', dark: 2, effectText: `이탈↓↓ (${V.exodus.turns}턴) · 거부감↑ · 그림자 장부`, apply(s) { addEffect(s, 'incident:crackdown', { turns: V.exodus.turns }); return '나가는 문이 조금 더 무거워졌다.'; } },
      { id: 'let', label: '떠나게 둔다', effectText: '본거지 신도↓', apply(s) { const l = loseHome(s, V.exodus.letGoLoss); return `${n(l)}명이 떠났다. 당신은 붙잡지 않았다.`; } },
    ],
  },
  {
    id: 'debate', kicker: '방송', title: '시사 토론회 초청',
    text: () => "시사 프로그램이 '신흥 종교, 위로인가 위험인가'를 주제로 생방송 토론에 당신을 불렀다.",
    when: (s) => totalFollowers(s) >= 800,
    weight: () => 0.4,
    choices: [
      { id: 'accept', label: '나간다', effectText: `성공률 ${Math.round(V.debate.chance * 100)}% · 성공하면 신도↑, 실패하면 거부감↑`, apply(s) { if (chance(s, V.debate.chance)) { const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.debate.winFollowers); bumpAversion(s, home(s), V.debate.winAversion); return `당신의 마지막 발언이 클립으로 돌았다. ${n(g)}명이 찾아왔다.`; } bumpAversion(s, home(s), V.debate.loseAversion); return '패널 한 명의 질문에 당신은 7초간 말이 없었다. 그 7초가 밈이 되었다.'; } },
      { id: 'decline', label: '나가지 않는다', effectText: '변화 없음', apply() { return '빈 의자가 화면에 비쳤다.'; } },
    ],
  },
  {
    id: 'fire', kicker: '사고', title: '성소 화재',
    text: () => '새벽에 성소 부엌에서 불이 났다. 다친 사람은 없지만 예배당 절반이 그을렸다.',
    when: (s) => s.turn >= 10,
    weight: () => 0.3,
    choices: [
      { id: 'rebuild', label: '제대로 다시 짓는다', cost: (s) => cost(s, V.fire.rebuildCost), available: (s) => afford(s, V.fire.rebuildCost), effectText: '결속 소폭↑ · 신앙력 소모', apply(s) { pay(s, V.fire.rebuildCost); changeUnity(s, V.fire.rebuildUnity); return '신도들이 벽돌을 날랐다. 새 예배당은 더 넓어졌다.'; } },
      { id: 'miracle', label: '"불길 속에서도 제단은 멀쩡했다"', dark: 2, effectText: '결속↑↑ · 경계↑ · 그림자 장부', apply(s) { changeUnity(s, V.fire.miracleUnity); bumpAlert(s, home(s), V.fire.miracleAlert); return '그을린 제단의 사진이 성물처럼 팔리기 시작했다.'; } },
      { id: 'tent', label: '당분간 천막에서 모인다', effectText: '결속↓', apply(s) { changeUnity(s, V.fire.tentUnity); return '비가 오는 날마다 사람이 줄었다.'; } },
    ],
  },
  {
    id: 'donation', kicker: '금고', title: '거액의 익명 기부',
    text: () => '출처를 알 수 없는 계좌에서 큰돈이 들어왔다. 메모란에는 "응원합니다" 한 줄뿐.',
    when: (s) => totalFollowers(s) >= 3000,
    weight: () => 0.4,
    choices: [
      { id: 'take', label: '감사히 받는다', effectText: '신앙력↑↑ · 경계↑', apply(s) { s.faith += cost(s, V.donation.take); bumpAlert(s, home(s), V.donation.takeAlert); return '금고가 찼다. 그 계좌를 지켜보던 사람은 당신만이 아니었다.'; } },
      { id: 'check', label: '출처를 확인한 뒤 받는다', effectText: '신앙력↑', apply(s) { s.faith += cost(s, V.donation.checked); return '절반은 돌려보냈다. 나머지 절반은 깨끗했다.'; } },
      { id: 'refuse', label: '돌려보낸다', effectText: '결속↑', apply(s) { changeUnity(s, V.donation.refuseUnity); return '"우리는 돈으로 움직이지 않는다." 그 말이 설교의 단골 문장이 되었다.'; } },
    ],
  },
  {
    id: 'schism', kicker: '분열', title: '분열의 조짐',
    text: () => '일부 간부들이 따로 모여 "진짜 가르침"을 이야기하기 시작했다. 신도 명단 사본이 돌고 있다.',
    when: (s) => s.unity < UNITY.schismAt && totalFollowers(s) >= 500,
    weight: (s) => 2 * riskWeight(s),
    choices: [
      { id: 'expel', label: '반대파를 축출한다', dark: 1, effectText: '전 세계 신도↓ · 결속↑↑', apply(s) { const l = loseAll(s, V.schism.expelLoss); changeUnity(s, V.schism.expelUnity); return `${n(l)}명이 반대파를 따라 나갔다. 그들은 길 건너에 새 간판을 걸었다.`; } },
      { id: 'compromise', label: '대타협', cost: (s) => cost(s, V.schism.compromiseCost), available: (s) => afford(s, V.schism.compromiseCost), effectText: '결속↑ · 신도 소폭↓ · 신앙력 소모', apply(s) { pay(s, V.schism.compromiseCost); changeUnity(s, V.schism.compromiseUnity); const l = loseAll(s, V.schism.compromiseLoss); return `직함이 하나씩 더 생겼다. 그래도 ${n(l)}명은 떠났다.`; } },
      { id: 'ignore', label: '모른 척한다', effectText: '결속↓↓', apply(s) { changeUnity(s, V.schism.ignoreUnity); return '모임은 매주 커졌다.'; } },
    ],
  },
  {
    id: 'leak', kicker: '내부 고발', title: '내부 고발자',
    text: () => '간부 회의 녹취 파일이 기자에게 넘어갔다는 첩보가 들어왔다.',
    when: (s) => s.riskPoints >= V.leak.minRisk,
    weight: (s) => 0.5 * riskWeight(s),
    choices: [
      { id: 'hush', label: '고발자를 회유한다', dark: 1, cost: (s) => cost(s, V.leak.hushCost), available: (s) => afford(s, V.leak.hushCost), effectText: '이번엔 막는다 · 신앙력 소모 · 그림자 장부', apply(s) { pay(s, V.leak.hushCost); return '파일은 공개되지 않았다. 이번에는.'; } },
      { id: 'explain', label: '먼저 해명한다', effectText: '거부감↑ 경계↑', apply(s) { bumpAversion(s, home(s), V.leak.explainAversion); bumpAlert(s, home(s), V.leak.explainAlert); return '해명은 반쯤 먹혔다.'; } },
      { id: 'deny', label: '조작이라고 부인한다', dark: 1, effectText: '경계↑↑ · 그림자 장부', apply(s) { bumpAlert(s, home(s), V.leak.denyAlert); return '성문 분석 결과가 나오는 데는 2주가 걸렸다.'; } },
    ],
  },
  {
    id: 'exposed', kicker: '폭로', title: '새 간판 뒤의 옛 얼굴',
    text: (s) => `"이름만 바꾼 ${s.religion.name}"이라는 기사가 났다. 새 간판 뒤의 사진들이 나란히 실렸다.`,
    when: (s) => Boolean(s.flags.rebrand) && !s.flags.rebrandExposed,
    weight: (s) => 0.6 * riskWeight(s),
    choices: [
      { id: 'accept', label: '감당한다', effectText: '본거지 거부감 2배 · 경계↑', apply(s) { s.flags.rebrandExposed = true; const cs = s.countries[home(s)]; cs.aversion = Math.min(1, cs.aversion * V.exposed.aversionMul + 0.05); bumpAlert(s, home(s), V.exposed.alert); return '"속았다"는 말이 처음 속았을 때보다 두 배는 크게 퍼졌다.'; } },
    ],
  },
];

export const CARD_BY_ID = Object.fromEntries(INCIDENT_CARDS.map((c) => [c.id, c]));
