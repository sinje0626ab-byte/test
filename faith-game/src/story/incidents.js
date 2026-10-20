import { INCIDENT_VALUES as V, UNITY, DIASPORA } from '../config.js';
import { world } from '../data/loader.js';
import { addEffect } from '../religion/modifiers.js';
import { addFollowers } from '../religion/spread.js';
import { totalFollowers } from '../game/state.js';
import { stageCostMul } from '../game/actions.js';
import { bumpAlert, bumpAversion, changeUnity, riskWeight } from '../game/watch.js';
import { grantUnit } from '../units/units.js';
import { chance, pickWeighted } from '../game/rng.js';
import { CAST, isIn, castOf, setCast, grudges, callName, j } from './cast.js';

// 사건 카드. 3~5턴마다 1장. 익명 집단 대신 등장인물(cast.js) 이름으로 터진다.
//   format: 'chat' 단톡방 캡처 · 'news' 뉴스 속보 자막 · 'sms' 문자 · 'paper' 신문 1면
//           'minutes' 간부 회의 녹취록 · 'forum' 탈퇴자 커뮤니티 글 · 'notice' 공문
//   doc(state, ctx) → 형식별 내용 (ui/incidentCard.js 가 그린다)
//     chat    { room, lines: [[인물 id | 이름, 말, 시각?]] }
//     news    { channel, banner, headline, ticker }
//     sms     { from, who?, number?, time, lines[] }
//     paper   { masthead, date, headline, sub, body }
//     minutes { title, lines: [[인물 id | 이름, 말]] }
//     forum   { board, title, author, meta, body, comments: [[닉네임, 말]] }
//     notice  { org, to, subject, body[], stamp }
//   when(state, ctx) → 등장 가능 여부 · weight(state, ctx) → 가중치 (그림자 장부·결속 반영)
//   choices[] = { id, label, say?, effectText, dark?, cost?, odds?, available?, visible?, apply(state, ctx) → 결과 문장 }
//     visible(state, ctx) 가 false 면 아예 안 보인다 (숨은 선택지). 선택지는 1~5개.
// 정부 경계 50%를 넘은 나라가 생기면 '경고장' 카드가 우선 나온다 (ctx.country).
// 문장 규칙은 CLAUDE.md 10절.

const home = (s) => s.religion.home;
const cost = (s, base) => Math.round(base * stageCostMul(s));
const afford = (s, base) => (s.faith >= cost(s, base) ? true : `신앙력 ${cost(s, base)} 모자람`);
const pay = (s, base) => { s.faith = Math.max(0, s.faith - cost(s, base)); };
const loseHome = (s, frac) => -addFollowers(s, home(s), -s.countries[home(s)].followers * frac);
const loseAll = (s, frac) => {
  let lost = 0;
  for (const id of world.ids) lost -= addFollowers(s, id, -s.countries[id].followers * frac);
  return lost;
};
const n = (x) => Math.round(x).toLocaleString('ko-KR');
const me = (s) => s.leader.name;
const cult = (s) => s.religion.name || '우리 모임';

export const INCIDENT_CARDS = [
  // ── 태식의 새 차 ──
  {
    id: 'embezzle', format: 'chat', kicker: '내부 비리', title: '태식의 새 차',
    when: (s) => s.turn >= 8 && s.faith >= 30 && isIn(s, 'taesik'),
    weight: (s) => riskWeight(s),
    doc: (s) => ({
      room: `${cult(s)} 간부방`,
      lines: [
        ['minho', '근데요 태식이 형 차 바뀌었던데요', '오후 2:14'],
        ['taesik', '중고야 중고!!', '오후 2:14'],
        ['taesik', '12년식이야 12년식', '오후 2:15'],
        isIn(s, 'jeongsuk') ? ['jeongsuk', '어머~ 근데 그거 작년에 나온 디자인 아니에요?', '오후 2:17'] : ['mom', '태식이 요새 얼굴 좋더라', '오후 2:17'],
        ['taesik', '아 근데 이번 달 헌금 정리 아직 덜 됐어요 ㅎㅎ', '오후 2:31'],
      ],
    }),
    choices: [
      { id: 'punish', label: '태식을 내보낸다', say: ['mom', '그래도 국민학교 때부터 니 친구다.'], effectText: `결속 ${V.embezzle.punishUnity} · 사라진 헌금 절반 회수 · 태식이 등을 돌림`, apply(s) { const lost = s.faith * V.embezzle.loss; s.faith -= lost * (1 - V.embezzle.punishRecover); changeUnity(s, V.embezzle.punishUnity); setCast(s, 'taesik', 'betrayed'); return '태식은 짐을 쌌다. 회계 장부 USB는 안 돌려주고 갔다. 남은 간부들은 그날부터 영수증을 두 장씩 받았다.'; } },
      { id: 'ignore', label: '못 본 걸로 한다', dark: 2, say: ['taesik', '야, 아니 교주님. 고마워. 진짜 다음 달에 맞춰 놓을게.'], effectText: `헌금 일부 손실 · 결속 +${V.embezzle.ignoreUnity} · 그림자 장부`, apply(s) { s.faith -= s.faith * V.embezzle.loss; changeUnity(s, V.embezzle.ignoreUnity); return '태식은 그다음 달에도 회계를 봤다. 이번엔 차에 썬팅을 하고 왔다.'; } },
      { id: 'apology', label: '교주가 대신 공개 사과', cost: (s) => cost(s, V.embezzle.apologyCost), available: (s) => afford(s, V.embezzle.apologyCost), say: ['jeongsuk', '어머, 교주님~ 고개는 45도가 제일 진정성 있어 보여요.'], effectText: '헌금 일부 손실 · 본거지 거부감 줄어듦 · 결속 +4 · 신앙력 소모', apply(s) { s.faith -= s.faith * V.embezzle.loss; pay(s, V.embezzle.apologyCost); bumpAversion(s, home(s), V.embezzle.apologyAversion); changeUnity(s, V.embezzle.apologyUnity); return `${j(me(s), '이/가')} 단상에서 고개를 숙였다. 태식은 맨 뒷줄에서 따라 숙였다. 동네 맘카페에 "그래도 사과는 하네"라는 글이 올라왔다.`; } },
      { id: 'audit', label: '수빈에게 장부 감사를 맡긴다', visible: (s) => isIn(s, 'subin'), say: ['subin', '엑셀은 볼 줄 알아요. 근데 이거 왜 셀 병합이 이렇게 많아요?'], effectText: '사라진 헌금 전부 회수 · 결속 −2 · 수빈이 장부를 다 알게 됨', apply(s) { changeUnity(s, -2); s.flags.subinKnows = true; return '수빈은 사흘 만에 숫자를 다 맞췄다. 태식은 차를 팔았고, 수빈의 노트는 한 권이 늘었다.'; } },
      { id: 'company', label: '그 차를 교단 업무용 차로 등록한다', say: ['minho', '근데요, 그럼 그 차 제가 배달할 때 써도 돼요?'], effectText: `헌금 일부 손실 · 경계 +${Math.round(V.embezzleSilly.alert * 100)} · 결속 ${V.embezzleSilly.unity} (다들 어이없어함)`, apply(s) { s.faith -= s.faith * V.embezzle.loss; bumpAlert(s, home(s), V.embezzleSilly.alert); changeUnity(s, V.embezzleSilly.unity); return `차 문짝에 "${cult(s)}" 시트지를 붙였다. 일주일 만에 주차 딱지가 열한 장 붙었다. 전부 교단 앞으로 날아왔다.`; } },
    ],
  },

  // ── 탈퇴자 커뮤니티 글 ──
  {
    id: 'whistle', format: 'forum', kicker: '폭로', title: '탈퇴자 커뮤니티 인기글',
    when: (s) => totalFollowers(s) >= 100 && (grudges(s).length > 0 || s.riskPoints >= 2),
    weight: (s) => 0.6 * riskWeight(s) ** 1.5 * (1 + 0.5 * grudges(s).length),
    context: (s) => ({ author: grudges(s)[0] ?? null }),
    doc: (s, ctx) => {
      const who = ctx.author;
      return {
        board: '탈퇴자 모임 · 자유게시판',
        title: who ? `${cult(s)} 간부였던 사람입니다 (긴 글)` : `${cult(s)}에서 보낸 1년`,
        author: who ? { taesik: '중고차는죄가없다', subin: '참여관찰4학기', dongcheol: '절차대로', jeongsuk: '연도대상3회', minho: '헬멧', seojin: '재수생아님', mom: '반찬통' }[who] : '탈퇴한사람',
        meta: '조회 18,402 · 추천 1,207',
        body: who === 'taesik' ? '회계 봤던 사람입니다. 헌금이 어디로 갔는지 저도 다는 모릅니다. 근데 반은 압니다. 그 반을 적어 보겠습니다.'
          : who === 'subin' ? '논문 쓰러 들어갔다가 2년 있었습니다. 노트가 일곱 권입니다. 오늘은 1권만 올립니다.'
            : who === 'dongcheol' ? '회의록 사본을 갖고 있습니다. 다만 공개 여부는 신중히 판단하겠습니다. 일단 3쪽까지만 올립니다.'
              : who ? `${j(CAST[who].short, '이라고/라고')} 하면 다들 아실 겁니다. 처음엔 좋았습니다. 밥이 맛있었거든요.`
                : '처음엔 밥 먹으러 갔습니다. 반찬이 일곱 가지였습니다. 그게 다였으면 좋았을 텐데요.',
        comments: [['ㅇㅇ', '와 여기 우리 동네인데'], ['익명', '저희 엄마도 거기 다니세요... 어떡하죠'], ['지나가던', '반찬 일곱 가지면 나도 가겠다']],
      };
    },
    choices: [
      { id: 'rebut', label: '반박문을 올린다', say: ['jeongsuk', '어머, 제가 써 볼게요. 고객 클레임 대응은 제 전문이에요.'], effectText: '결속 +3 · 본거지 거부감·경계 오름', apply(s) { bumpAversion(s, home(s), V.whistle.rebutAversion); bumpAlert(s, home(s), V.whistle.rebutAlert); changeUnity(s, V.whistle.rebutUnity); return '반박문은 원글보다 많이 공유됐다. 캡처에 빨간 동그라미가 열네 개 쳐져서.'; } },
      { id: 'reconcile', label: (s, ctx) => (ctx.author ? `${j(CAST[ctx.author].short, '을/를')} 찾아가 사과한다` : '글쓴이를 찾아가 사과한다'), cost: (s) => cost(s, V.whistle.reconcileCost), available: (s) => afford(s, V.whistle.reconcileCost), say: ['minho', '근데요, 빈손으로 가요? 귤이라도 사 가요.'], effectText: '그림자 장부 −1 · 거부감 조금 줄어듦 · 신앙력 소모', apply(s, ctx) { pay(s, V.whistle.reconcileCost); s.riskPoints = Math.max(0, s.riskPoints + V.whistle.reconcileRisk); bumpAversion(s, home(s), V.whistle.reconcileAversion); if (ctx.author && castOf(s, ctx.author).status === 'betrayed') setCast(s, ctx.author, 'left'); return '귤 한 박스를 들고 갔다. 글은 그날 밤 비공개로 바뀌었다. 댓글은 이미 캡처된 뒤였다.'; } },
      { id: 'mom', label: '엄마가 반찬 들고 찾아간다', visible: (s, ctx) => isIn(s, 'mom') && Boolean(ctx.author), say: ['mom', '걔 어릴 때 우리 집에서 밥 많이 먹었다. 내가 가 볼게.'], effectText: '글이 내려감 · 거부감 줄어듦 · 그 사람이 원망을 거둠', apply(s, ctx) { bumpAversion(s, home(s), V.whistle.reconcileAversion * 2); setCast(s, ctx.author, 'left'); return '엄마는 멸치볶음과 깻잎을 들고 갔다. 글은 삭제됐고, 반찬통은 돌아오지 않았다.'; } },
      { id: 'ignore', label: '무시한다', say: ['subin', '조회수 계속 올라가요. 지금 실시간 3위예요.'], effectText: '본거지 거부감 크게 오름', apply(s) { bumpAversion(s, home(s), V.whistle.ignoreAversion); return '사흘 뒤 그 글이 지역 뉴스 화면에 그대로 나왔다. 앵커가 "반찬 일곱 가지" 부분을 읽었다.'; } },
    ],
  },

  // ── 가족들의 피켓 ──
  {
    id: 'families', format: 'news', kicker: '항의', title: '성소 앞 피켓 시위',
    when: (s) => totalFollowers(s) >= 500,
    weight: (s) => 0.8 * riskWeight(s),
    doc: (s) => ({
      channel: '지역 뉴스 9',
      banner: '속보',
      headline: `"${cult(s)}" 성소 앞, 신도 가족 30여 명 "우리 애 돌려달라"`,
      ticker: '경찰 "집회 신고는 돼 있어 문제없다" · 인근 치킨집 "주말 매출 늘어" · 내일 아침 최저 영하 4도',
    }),
    choices: [
      { id: 'meet', label: '가족 면담을 연다', cost: (s) => cost(s, V.families.meetCost), available: (s) => afford(s, V.families.meetCost), say: ['jeongsuk', '어머, 다과는 제가 준비할게요. 떡은 백설기로요. 무난하게.'], effectText: '본거지 거부감 줄어듦 · 본거지 신도 조금 줄어듦 · 신앙력 소모', apply(s) { pay(s, V.families.meetCost); bumpAversion(s, home(s), V.families.meetAversion); const l = loseHome(s, V.families.meetLoss); return `면담은 세 시간 걸렸다. ${n(l)}명이 가족 차를 타고 집에 갔다. 백설기는 남았다.`; } },
      { id: 'lock', label: '성소 문을 잠근다', dark: 1, say: ['minho', '근데요, 저 배달 나가야 되는데 뒷문은 열어 둬요?'], effectText: '결속 +5 · 본거지 경계 오름 · 그림자 장부', apply(s) { changeUnity(s, V.families.lockUnity); bumpAlert(s, home(s), V.families.lockAlert); return '안에서는 찬송 소리가 커졌다. 밖에서는 카메라가 두 대 더 왔다.'; } },
      { id: 'rally', label: '맞불 집회를 연다', say: ['taesik', '앰프는 내가 아는 행사 업체에서 싸게 빌릴게.'], effectText: '결속 +6 · 본거지 거부감 크게 오름', apply(s) { changeUnity(s, V.families.rallyUnity); bumpAversion(s, home(s), V.families.rallyAversion); return '길 하나를 사이에 두고 두 집회가 마주 섰다. 양쪽 다 같은 치킨집에서 배달을 시켰다. 배달은 민호가 했다.'; } },
      { id: 'banchan', label: '시위대에 엄마 반찬을 돌린다', visible: (s) => isIn(s, 'mom'), say: ['mom', '추운데 밥은 먹고 소리 질러야지.'], effectText: '본거지 거부감 조금 줄어듦 · 결속 +2', apply(s) { bumpAversion(s, home(s), -0.03); changeUnity(s, 2); return '시위대 몇 명이 반찬통을 받아 갔다. 다음 날 피켓 문구가 조금 순해졌다.'; } },
    ],
  },

  // ── 왕년의 배우 ──
  {
    id: 'celebrity', format: 'sms', kicker: '호재', title: '정숙의 고객',
    when: (s) => totalFollowers(s) >= 300 && isIn(s, 'jeongsuk'),
    weight: () => 0.6,
    doc: () => ({
      from: '한정숙 간부님', who: 'jeongsuk', time: '오후 11:48',
      lines: ['교주님~ 주무세요? ^^', '왕년에 아침 드라마 나오던 배우님 아시죠? 시어머니 역 하시던 분', '제 고객이셨어요!! 연금보험 두 개', '저희 모임 얘기 했더니 이번 주에 오신대요~~', '사진 찍어도 된대요!!!'],
    }),
    choices: [
      { id: 'promote', label: '전단지에 얼굴을 크게 넣는다', say: ['jeongsuk', '어머, 사진은 제가 보정 맡길게요~'], effectText: `본거지 증가 +30% (${V.celebrity.turns}달) · 경계 오름`, apply(s) { addEffect(s, 'incident:celebrity', { turns: V.celebrity.turns }); bumpAlert(s, home(s), V.celebrity.alert); return '배우의 얼굴이 들어간 전단지가 아파트 엘리베이터마다 붙었다. 사진은 15년 전 것이었다.'; } },
      { id: 'quiet', label: '조용히 맨 뒷줄에 앉힌다', say: ['mom', '그 양반 드라마 내가 다 봤다. 사인은 받아도 되지?'], effectText: '결속 +5', apply(s) { changeUnity(s, V.celebrity.quietUnity); return '배우는 맨 뒷줄에서 눈을 감고 앉아 있었다. 엄마가 몰래 사인을 받았다.'; } },
      { id: 'recruit', label: '간부로 모신다', dark: 1, say: (s) => (isIn(s, 'dongcheol') ? ['dongcheol', '좋습니다. 다만 직함은 제 아래로 하시죠.'] : ['taesik', '후원금 들어오면 내가 정리할게.']), effectText: '신앙력 들어옴 · 그림자 장부', apply(s) { s.faith += cost(s, V.celebrity.recruitFaith); return '후원금이 들어왔다. 배우는 첫 간부 회의 때 대본처럼 메모를 읽었다.'; } },
    ],
  },

  // ── 허리 나은 할머니 ──
  {
    id: 'rumor', format: 'chat', kicker: '소문', title: '302호 할머니의 허리',
    when: (s) => totalFollowers(s) >= 200,
    weight: (s) => (s.religion.tenets.includes('healing') ? 1 : 0.6),
    doc: (s) => ({
      room: `${cult(s)} 신도방 (전체)`,
      lines: [
        [{ name: '302호 할머니' }, '어제 기도모임 다녀와서 허리가 하나도 안 아파요', '오전 6:02'],
        [{ name: '302호 할머니' }, '20년 만에 처음이에요', '오전 6:02'],
        [{ name: '김 집사' }, '어머어머 축하드려요!! 저도 무릎 때문에 다음 주에 갈게요', '오전 6:30'],
        ['subin', '혹시 어제 병원도 다녀오셨어요?', '오전 7:11'],
        [{ name: '302호 할머니' }, '물리치료 받고 갔지요', '오전 7:40'],
      ],
    }),
    choices: [
      { id: 'spread', label: '전단지 맨 위에 "기적"이라고 쓴다', say: ['jeongsuk', '어머, 이런 후기는 돈 주고도 못 사요~'], effectText: `자연 증가 +15% (${V.rumor.turns}달) · 경계 오름 (치유 간증 집회 규칙이 있으면 더 많이)`, apply(s) { addEffect(s, 'incident:rumor', { turns: V.rumor.turns }); bumpAlert(s, home(s), V.rumor.alert + (s.religion.tenets.includes('healing') ? V.rumor.healingAlert : 0)); return '"기적"이라는 단어가 전단지 맨 위에 올라갔다. 보건소 직원도 그 전단지를 한 장 받아 갔다.'; } },
      { id: 'careful', label: '"물리치료 덕도 있겠죠" 하고 넘긴다', say: ['subin', '네, 그게 맞는 것 같아요.'], effectText: '결속 +3', apply(s) { changeUnity(s, V.rumor.quietUnity); return `${j(me(s), '이/가')} "물리치료 선생님께도 감사드립시다" 했다. 할머니는 그 말에 더 감동했다.`; } },
      { id: 'weekly', label: '치유 집회를 매주로 늘린다', visible: (s) => s.religion.tenets.includes('healing'), dark: 1, say: ['minho', '근데요, 그럼 의자를 매주 깔아야 되잖아요.'], effectText: `자연 증가 +15% (${V.rumor.turns * 2}달) · 경계 많이 오름 · 그림자 장부`, apply(s) { addEffect(s, 'incident:rumor', { turns: V.rumor.turns * 2 }); bumpAlert(s, home(s), V.rumor.alert * 2 + V.rumor.healingAlert); return '목요일마다 성소 앞에 지팡이 짚은 줄이 섰다. 근처 정형외과 원장이 무슨 일인지 보러 왔다.'; } },
    ],
  },

  // ── 회의록: 동철과 수빈 ──
  {
    id: 'feud', format: 'minutes', kicker: '내분', title: '간부 회의 녹취록',
    when: (s) => totalFollowers(s) >= 2500 && isIn(s, 'dongcheol') && isIn(s, 'subin'),
    weight: (s) => 0.7 * riskWeight(s) * (s.unity < 50 ? 1.6 : 1),
    doc: (s) => ({
      title: `${cult(s)} 정기 간부 회의 (녹취 · 수빈 작성)`,
      lines: [
        ['dongcheol', '예배 순서 개편안 A안입니다. 설교 전에 출석 확인을 넣겠습니다.'],
        ['subin', '출석 확인을 왜 설교 전에 해요? 이거 근거 있어요?'],
        ['dongcheol', '근거는 제 학원 20년입니다. 다만 수빈 씨 의견도 회의록에는 남기겠습니다.'],
        ['subin', '회의록은 제가 쓰고 있는데요.'],
        ['jeongsuk', '어머, 두 분 다 커피 드시면서 하세요~'],
        [{ name: '(정적 14초)' }, ''],
      ],
    }),
    choices: [
      { id: 'dongcheol', label: '동철 편을 든다', dark: 1, say: ['dongcheol', '현명하십니다. 다만 수빈 씨 노트는 회수하시는 게 좋겠습니다.'], effectText: '결속 −4 · 수빈이 등을 돌림 · 그림자 장부', apply(s) { changeUnity(s, V.feud.purgeUnity); setCast(s, 'subin', 'betrayed'); return '수빈은 노트를 가방에 넣고 일어났다. 회수하자는 말은 아무도 못 했다.'; } },
      { id: 'subin', label: '수빈 편을 든다', say: ['subin', '감사합니다. 근데 왜 제 편 드셨어요?'], effectText: '결속 −4 · 동철이 등을 돌리고 자기 사람들을 데려감', apply(s) { changeUnity(s, V.feud.purgeUnity); setCast(s, 'dongcheol', 'betrayed'); const l = loseAll(s, V.feud.purgeLoss); return `동철은 정중하게 인사하고 나갔다. 그 주에 ${n(l)}명이 출석하지 않았다. 동철 학원 학부모들이었다.`; } },
      { id: 'mediate', label: '둘 다 불러서 국밥을 산다', cost: (s) => cost(s, V.feud.mediateCost), available: (s) => afford(s, V.feud.mediateCost), say: ['minho', '근데요, 저도 가도 돼요?'], effectText: '결속 +6 · 신앙력 소모', apply(s) { pay(s, V.feud.mediateCost); changeUnity(s, V.feud.mediateUnity); return '순대국밥 세 그릇. 동철은 다대기를 넣었고 수빈은 안 넣었다. 그 얘기로 한 시간을 싸우다 화해했다.'; } },
      { id: 'split', label: '각자 지부를 하나씩 맡긴다', say: ['jeongsuk', '어머, 실적 경쟁이면 저도 껴 주세요~'], effectText: `이탈 +25% (${V.feud.splitTurns}달) · 선교사 1명`, apply(s) { addEffect(s, 'incident:feud', { turns: V.feud.splitTurns }); grantUnit(s, 'missionary', home(s)); return '경쟁은 계속됐다. 이번엔 누가 신도를 더 많이 데려오느냐로. 둘 다 출석부를 따로 만들었다.'; } },
    ],
  },

  // ── 세무서 공문 ──
  {
    id: 'tax', format: 'notice', kicker: '당국', title: '세무조사 사전 통지',
    when: (s) => totalFollowers(s) >= 5000,
    weight: (s) => 0.5 * riskWeight(s),
    doc: (s) => ({
      org: '○○세무서',
      to: `${cult(s)} 대표자 ${me(s)} 귀하`,
      subject: '세무조사 사전 통지',
      body: ['귀 단체의 최근 3개 사업연도 장부 및 증빙 서류 일체를 아래 기한까지 제출하여 주시기 바랍니다.', '제출 기한: 통지일로부터 15일', '문의: 조사2과 (점심시간 12:00~13:00 제외)'],
      stamp: '세무서장',
    }),
    choices: [
      { id: 'open', label: '장부를 통째로 낸다', say: (s) => (isIn(s, 'taesik') ? ['taesik', '야... 아니 교주님. 통째로? 진짜 통째로?'] : ['subin', '정리는 제가 이미 해 놨어요.']), effectText: '신앙력 15% 납부 · 경계 −10 · 그림자 장부 −1', apply(s) { s.faith -= s.faith * V.tax.openLoss; bumpAlert(s, home(s), V.tax.openAlert); s.riskPoints = Math.max(0, s.riskPoints - 1); return '추징금은 아팠다. 조사관은 나가면서 "다른 데보다 깔끔하네요" 했다.'; } },
      { id: 'tidy', label: '장부를 "정리"해서 낸다', dark: 2, odds: () => V.tax.tidyChance, say: ['dongcheol', '서류는 맞춰 드릴 수 있습니다. 다만 사본은 제가 따로 보관하겠습니다.'], effectText: '잘되면 경계 조금 내려감 · 걸리면 경계 크게 오르고 결속 −5 · 그림자 장부', apply(s) { if (chance(s, V.tax.tidyChance)) { bumpAlert(s, home(s), V.tax.tidyAlert); return '숫자가 다 맞았다. 조사관이 계산기를 두 번 두드려 보고 덮었다.'; } bumpAlert(s, home(s), V.tax.tidyFailAlert); changeUnity(s, V.tax.tidyFailUnity); return '조사관이 같은 쪽을 세 번 넘겨 봤다. 사건은 다른 과로 넘어갔다.'; } },
      { id: 'donate', label: '구청 불우이웃 성금을 크게 낸다', dark: 1, cost: (s) => cost(s, V.tax.donateCost), available: (s) => afford(s, V.tax.donateCost), say: ['jeongsuk', '어머, 전달식 사진은 구청장님 옆에서 찍어요~'], effectText: '경계 조금 내려감 · 신앙력 소모 · 그림자 장부', apply(s) { pay(s, V.tax.donateCost); bumpAlert(s, home(s), V.tax.donateAlert); return '구청 소식지 2면에 큰 수표 들고 찍은 사진이 실렸다. 세무서 직원도 그 소식지를 받았다.'; } },
      { id: 'taesik', label: '태식한테 맡긴다', visible: (s) => isIn(s, 'taesik'), dark: 1, odds: () => V.tax.tidyChance * 0.5, say: ['taesik', '나 세무서 아는 형 있어. 아, 그 형 작년에 퇴직했나.'], effectText: '잘되면 경계 조금 내려감 · 걸리면 경계 크게 오르고 결속 −5 · 그림자 장부', apply(s) { if (chance(s, V.tax.tidyChance * 0.5)) { bumpAlert(s, home(s), V.tax.tidyAlert); return '아는 형은 아직 퇴직 전이었다. 형은 다음 주에 퇴직했다.'; } bumpAlert(s, home(s), V.tax.tidyFailAlert); changeUnity(s, V.tax.tidyFailUnity); return '태식은 영수증 대신 차량 정비 내역서를 냈다. 조사관이 그걸 한참 읽었다.'; } },
    ],
  },

  // ── 다큐멘터리 섭외 ──
  {
    id: 'documentary', format: 'sms', kicker: '방송', title: 'PD의 문자',
    when: (s) => totalFollowers(s) >= 2000,
    weight: () => 0.5,
    doc: () => ({
      from: '010-****-2207', time: '오전 10:03',
      lines: ['안녕하세요, 공영방송 시사교양국 PD입니다.', "'요즘 사람들은 무엇을 믿는가'라는 3부작 다큐를 준비하고 있습니다.", '교주님 하루를 그대로 담고 싶습니다. 연출은 없습니다.', '편하실 때 회신 부탁드립니다.'],
    }),
    choices: [
      { id: 'appear', label: '찍게 해 준다', odds: () => V.documentary.chance, say: ['jeongsuk', '어머, 메이크업은 제가 아는 원장님 불러요~'], effectText: '잘되면 본거지 신도 +10% · 망하면 본거지 거부감 크게 오름', apply(s) { if (chance(s, V.documentary.chance)) { const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.documentary.winFollowers); bumpAversion(s, home(s), V.documentary.winAversion); return `방송 다음 날 ${n(g)}명이 찾아왔다. 다들 엄마 반찬이 나온 장면 얘기를 했다.`; } bumpAversion(s, home(s), V.documentary.loseAversion); return `편집이 잔인했다. ${j(me(s), '이/가')} 웃는 장면마다 첼로 저음이 깔렸다.`; } },
      { id: 'refuse', label: '답장 안 한다', say: ['minho', '근데요, 그 번호 어제 성소 앞에서도 봤어요.'], effectText: '본거지 거부감 조금 오름', apply(s) { bumpAversion(s, home(s), V.documentary.refuseAversion); return '방송은 나갔다. 성소 간판 앞에 "취재를 거부했다"는 자막이 4초 동안 떴다.'; } },
      { id: 'safe', label: '편집 확인 조건으로 찍는다', cost: (s) => cost(s, V.documentary.safeCost), available: (s) => afford(s, V.documentary.safeCost), say: (s) => (isIn(s, 'dongcheol') ? ['dongcheol', '계약서는 제가 검토하겠습니다. 다만 출연료 항목이 비어 있습니다.'] : ['subin', '계약서에 편집 확인권 넣으면 PD님이 싫어하실 텐데요.']), effectText: '본거지 신도 +5% · 신앙력 소모', apply(s) { pay(s, V.documentary.safeCost); const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.documentary.safeFollowers); return `무난한 방송이었다. 시청률도 무난했다. ${n(g)}명이 새로 왔다.`; } },
    ],
  },

  // ── 바다 건너에서 온 초대장 (신도 1,000명부터 반드시 한 번) ──
  {
    id: 'invite', format: 'sms', kicker: '해외', title: '바다 건너에서 온 초대장',
    when: (s) => totalFollowers(s) >= DIASPORA.invite.min,
    context: (s) => {
      const pool = Object.entries(DIASPORA.weights)
        .filter(([id]) => world.countries[id] && id !== home(s) && !s.countries[id].banned && s.countries[id].followers < 1000)
        .map(([id, w]) => ({ item: id, weight: w }));
      const country = pickWeighted(s, pool);
      return country ? { country } : null;
    },
    weight: () => 0.6,
    doc: (s, ctx) => {
      const c = world.countries[ctx.country];
      const sender = isIn(s, 'minho') ? '민호 사촌형' : '신도 친척';
      return {
        from: `${sender} (${c.name})`, number: '국제전화', time: '오전 3:20',
        lines: [`여기 ${c.name}인데요, 시차 때문에 이 시간에 보내요 죄송해요`, '여기 교민들끼리 모이는 데가 있는데 다들 좀 외로워해요', `${cult(s)} 얘기 했더니 여기서도 모임 열어 달래요`, '반찬은 여기서도 한국 마트 있어요!!'],
      };
    },
    choices: [
      { id: 'open', label: (s, ctx) => `${world.countries[ctx.country].name}에 지부를 연다`, say: ['minho', '근데요, 제가 가요? 저 여권 없는데.'], effectText: `그 나라에 선교사 1명과 첫 신도 ${DIASPORA.invite.seed}명`, apply(s, ctx) { grantUnit(s, 'missionary', ctx.country); addFollowers(s, ctx.country, DIASPORA.invite.seed); return `${world.countries[ctx.country].name} 한인 마트 게시판에 첫 모임 공지가 붙었다. 라면 할인 전단지 바로 옆이었다.`; } },
      { id: 'decline', label: '아직 이르다', say: (s) => (isIn(s, 'dongcheol') ? ['dongcheol', '현명합니다. 다만 해외 지부장 자리는 미리 정해 두시죠.'] : ['mom', '거기까지 가면 밥은 누가 해 주니.']), effectText: '결속 +2', apply(s) { changeUnity(s, V.invite.declineUnity); return '"본거지부터 단단히." 간부들은 고개를 끄덕였다. 국제전화는 그 뒤로 두 번 더 왔다.'; } },
    ],
  },

  // ── 경고장 (정부 경계 50%) ──
  {
    id: 'warning', format: 'notice', kicker: '당국', title: '활동 실태 점검 안내',
    when: () => false, // 정부 경계 50% 를 넘을 때만 강제로 나온다
    weight: () => 0,
    doc: (s, ctx) => {
      const isHome = ctx.country === home(s);
      return {
        org: isHome ? '○○구청 · ○○경찰서' : `${world.countries[ctx.country].name} 당국`,
        to: `${cult(s)} 귀중`,
        subject: '종교 단체 활동 실태 점검 안내',
        body: [isHome ? '최근 귀 단체와 관련한 민원이 다수 접수되어 활동 실태를 점검할 예정입니다.' : '귀 단체의 국내 활동에 대한 신고가 접수되어 점검을 실시할 예정입니다.', '점검 일시는 추후 통보합니다.', '협조하지 않을 경우 관계 법령에 따라 조치할 수 있습니다.'],
        stamp: isHome ? '구청장' : '담당관',
      };
    },
    choices: [
      { id: 'audit', label: '먼저 점검을 받는다', cost: (s) => cost(s, V.warning.auditCost), available: (s) => afford(s, V.warning.auditCost), say: ['mom', '손님 오면 커피라도 내야지. 믹스 있나?'], effectText: '그 나라 경계 −15 · 신앙력 소모', apply(s, ctx) { pay(s, V.warning.auditCost); bumpAlert(s, ctx.country, V.warning.auditAlert); return '점검반은 믹스커피를 두 잔씩 마시고 갔다. 점검표에는 "특이사항 없음"이라고 적혔다.'; } },
      { id: 'sign', label: '간판과 전단지 문구를 고친다', say: ['jeongsuk', '어머, "치유"는 "힐링"으로, "기적"은 "변화"로 바꿀게요~'], effectText: '그 나라 거부감·경계 조금 내려감', apply(s, ctx) { bumpAversion(s, ctx.country, V.warning.signAversion); bumpAlert(s, ctx.country, V.warning.signAlert); return '전단지에서 "기적"이 빠지고 "변화"가 들어갔다. 인쇄소 사장님이 열 번째 수정이라며 웃었다.'; } },
      { id: 'ignore', label: '서랍에 넣는다', say: ['minho', '근데요, 이거 등기라서 받았다는 기록 남아요.'], effectText: '그 나라 경계 조금 오름', apply(s, ctx) { bumpAlert(s, ctx.country, V.warning.ignoreAlert); return '공문은 서랍에 들어갔다. 구청 서랍에는 사본이 들어갔다.'; } },
    ],
  },

  // ── 청년부 단톡방 ──
  {
    id: 'exodus', format: 'chat', kicker: '이탈', title: '청년부 단톡방',
    when: (s) => totalFollowers(s) >= 200,
    weight: (s) => 0.6 * (1 + Math.max(0, 60 - s.unity) / 40),
    doc: (s) => ({
      room: `${cult(s)} 청년부 (47)`,
      lines: [
        [{ name: '박지훈' }, '저 이번 주부터 학원 때문에 못 나올 것 같아요', '오후 9:12'],
        [{ name: '시스템' }, '박지훈님이 나갔습니다.', '오후 9:12'],
        [{ name: '이유진' }, '저도 알바 시간이 바뀌어서요 ㅠㅠ', '오후 9:20'],
        [{ name: '시스템' }, '이유진님이 나갔습니다.', '오후 9:20'],
        isIn(s, 'seojin') ? ['seojin', '그래서요? 다 나가면 이 방 제가 방장 해요?', '오후 9:41'] : ['minho', '근데요 다들 왜 나가요?', '오후 9:41'],
      ],
    }),
    choices: [
      { id: 'retreat', label: '1박 2일 수련회', cost: (s) => cost(s, V.exodus.retreatCost), available: (s) => afford(s, V.exodus.retreatCost), say: ['mom', '삼겹살은 내가 마트에서 떼 올게.'], effectText: `이탈 −30% (${V.exodus.turns}달) · 신앙력 소모`, apply(s) { pay(s, V.exodus.retreatCost); addEffect(s, 'incident:retreat', { turns: V.exodus.turns }); return '모닥불 앞에서 다들 울었다. 연기 때문인지는 모른다. 다음 주에 모두 나왔다.'; } },
      { id: 'crackdown', label: '나가는 사람 이름을 공지한다', dark: 2, say: ['subin', '이거 나중에 캡처돼서 돌아다니면요?'], effectText: `이탈 −40% (${V.exodus.turns}달) · 거부감 쌓임 · 그림자 장부`, apply(s) { addEffect(s, 'incident:crackdown', { turns: V.exodus.turns }); return '단톡방이 조용해졌다. 나가기 버튼을 누르는 손가락이 무거워졌다.'; } },
      { id: 'let', label: '보내 준다', say: ['minho', '근데요, 걔네 다음 주에 치킨 먹자고 했었는데.'], effectText: '본거지 신도 6% 줄어듦', apply(s) { const l = loseHome(s, V.exodus.letGoLoss); return `${n(l)}명이 나갔다. ${j(me(s), '은/는')} 붙잡지 않았다. 대신 단톡방 공지에 "언제든 돌아와요"라고 걸었다.`; } },
    ],
  },

  // ── 생방송 토론 ──
  {
    id: 'debate', format: 'news', kicker: '방송', title: '심야 토론 초청',
    when: (s) => totalFollowers(s) >= 800,
    weight: () => 0.4,
    doc: (s) => ({
      channel: '심야토론 100인',
      banner: '예고',
      headline: '"신흥 종교, 위로인가 위험인가" 이번 주 목요일 밤 11시 생방송',
      ticker: `패널: 종교학자, 탈퇴자 모임 대표, 그리고 "${cult(s)}" 대표 (출연 미정)`,
    }),
    choices: [
      { id: 'accept', label: '나간다', odds: () => V.debate.chance, say: ['jeongsuk', '어머, 넥타이는 단색으로 하세요. 무늬 있으면 화면에서 지글거려요.'], effectText: '잘되면 본거지 신도 +8% · 망하면 거부감 오름', apply(s) { if (chance(s, V.debate.chance)) { const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.debate.winFollowers); bumpAversion(s, home(s), V.debate.winAversion); return `마지막 1분 발언이 짧은 영상으로 돌았다. ${n(g)}명이 찾아왔다.`; } bumpAversion(s, home(s), V.debate.loseAversion); return `패널 질문에 ${j(me(s), '이/가')} 7초 동안 말이 없었다. 그 7초가 밈이 됐다.`; } },
      { id: 'decline', label: '안 나간다', say: ['subin', '빈 의자 놓고 방송할 거예요. 원래 그래요.'], effectText: '아무 일 없음', apply() { return '빈 의자가 클로즈업됐다. 의자에 이름표가 붙어 있었다.'; } },
      { id: 'seojin', label: '서진을 대신 내보낸다', visible: (s) => isIn(s, 'seojin'), odds: () => V.debate.chance * 0.6, say: ['seojin', '그래서요? 제가 나가면 출연료 저 줘요?'], effectText: '잘되면 신도 +8% · 망하면 거부감 오름 (잘될 가능성 낮음)', apply(s) { if (chance(s, V.debate.chance * 0.6)) { const g = addFollowers(s, home(s), s.countries[home(s)].followers * V.debate.winFollowers); return `서진은 질문마다 "그래서요?"라고 되물었다. 그게 먹혔다. ${n(g)}명이 찾아왔다.`; } bumpAversion(s, home(s), V.debate.loseAversion); return '서진은 생방송 중에 하품을 했다. 카메라가 그걸 정면으로 잡았다.'; } },
    ],
  },

  // ── 부엌 화재 ──
  {
    id: 'fire', format: 'news', kicker: '사고', title: '성소 주방 화재',
    when: (s) => s.turn >= 10 && totalFollowers(s) >= 30,
    weight: () => 0.3,
    doc: (s) => ({
      channel: '지역 뉴스 9',
      banner: '속보',
      headline: `○○동 종교시설 주방에서 불... 인명 피해 없어`,
      ticker: isIn(s, 'mom') ? '소방 "가스레인지 위에 곰솥이 올려져 있었다" · 신도 "사골 곰탕이었다"' : '소방 "주방 가스레인지에서 시작된 것으로 보여" · 인근 상인 "연기가 하루 종일 났다"',
    }),
    choices: [
      { id: 'rebuild', label: '제대로 다시 짓는다', cost: (s) => cost(s, V.fire.rebuildCost), available: (s) => afford(s, V.fire.rebuildCost), say: ['taesik', '인테리어 업자는 내가 아는 데 있어. 견적은 묻지 마.'], effectText: '결속 +3 · 신앙력 소모', apply(s) { pay(s, V.fire.rebuildCost); changeUnity(s, V.fire.rebuildUnity); return '신도들이 주말마다 벽지를 발랐다. 새 주방에는 인덕션이 들어왔다. 엄마는 불이 안 보인다고 싫어했다.'; } },
      { id: 'miracle', label: '"불길 속에서도 제단은 멀쩡했다"', dark: 2, say: ['jeongsuk', '어머, 사진 각도만 잘 잡으면 돼요~'], effectText: '결속 +10 · 경계 오름 · 그림자 장부', apply(s) { changeUnity(s, V.fire.miracleUnity); bumpAlert(s, home(s), V.fire.miracleAlert); return '그을린 제단 사진이 액자로 팔리기 시작했다. 제단은 원래 주방 옆에 없었다.'; } },
      { id: 'tent', label: '당분간 천막에서 모인다', say: ['minho', '근데요, 비 오면 어떡해요?'], effectText: '결속 −4', apply(s) { changeUnity(s, V.fire.tentUnity); return '비 오는 주일마다 사람이 줄었다. 천막 아래서 우산을 쓰고 앉은 사람도 있었다.'; } },
    ],
  },

  // ── 5천만 원 입금 ──
  {
    id: 'donation', format: 'sms', kicker: '금고', title: '입금 알림',
    when: (s) => totalFollowers(s) >= 3000,
    weight: () => 0.4,
    doc: () => ({
      from: '○○은행', time: '오전 0:00',
      lines: ['[입금] 50,000,000원', '보낸분: 응원합니다', '잔액 확인은 앱에서'],
    }),
    choices: [
      { id: 'take', label: '감사히 받는다', say: (s) => (isIn(s, 'taesik') ? ['taesik', '0이 일곱 개야. 내가 세 번 셌어.'] : ['jeongsuk', '어머, 0이 일곱 개예요~']), effectText: '신앙력 많이 들어옴 · 경계 오름', apply(s) { s.faith += cost(s, V.donation.take); bumpAlert(s, home(s), V.donation.takeAlert); return '금고가 찼다. 은행 이상거래 탐지팀도 그 입금을 봤다.'; } },
      { id: 'check', label: '어디서 온 돈인지 알아보고 받는다', say: ['subin', '보낸 분 계좌 추적은 못 해요. 근데 메모가 좀 이상해요.'], effectText: '신앙력 조금 들어옴', apply(s) { s.faith += cost(s, V.donation.checked); return '절반은 돌려보냈다. 나머지 절반은 어느 신도 할머니의 적금 만기분이었다.'; } },
      { id: 'refuse', label: '돌려보낸다', say: ['mom', '공짜 돈은 체한다.'], effectText: '결속 +4', apply(s) { changeUnity(s, V.donation.refuseUnity); return '"우리는 돈으로 안 움직인다." 그 말이 설교 단골 문장이 됐다. 그 주 헌금은 조금 줄었다.'; } },
      { id: 'car', label: '태식에게 "알아서 하라"고 한다', visible: (s) => isIn(s, 'taesik'), dark: 2, say: ['taesik', '알아서? 진짜 알아서?'], effectText: '신앙력 조금 들어옴 · 결속 −3 · 그림자 장부', apply(s) { s.faith += cost(s, V.donation.checked) * 0.5; changeUnity(s, -3); return '태식이 알아서 했다. 금고에는 절반의 절반이 들어왔다. 태식 차에 새 블랙박스가 달렸다.'; } },
    ],
  },

  // ── 갈라서는 사람들 ──
  {
    id: 'schism', format: 'paper', kicker: '분열', title: '"진짜 가르침"',
    when: (s) => s.unity < UNITY.schismAt && totalFollowers(s) >= 500,
    weight: (s) => 2 * riskWeight(s) * (s.flags.dongcheolSulk ? 1.5 : 1),
    context: (s) => ({ leader: ['dongcheol', 'subin', 'jeongsuk'].find((id) => ['active', 'betrayed'].includes(castOf(s, id).status)) ?? null }),
    doc: (s, ctx) => ({
      masthead: '동네일보',
      date: '제1,204호',
      headline: `"${cult(s)}" 내부 분열 조짐... ${ctx.leader ? `${CAST[ctx.leader].short} 간부 중심 "진짜 가르침" 모임` : '간부 일부 따로 모임'}`,
      sub: '신도 명단 사본 돌아... "교주는 처음 뜻을 잃었다"',
      body: ctx.leader === 'dongcheol' ? '강모 간부는 본지 통화에서 "절차를 밟고 있을 뿐"이라며 "다만 신도들의 선택은 존중한다"고 말했다.'
        : ctx.leader === 'subin' ? '윤모 간부는 "연구자로서 기록할 뿐"이라고 했으나, 모임 참석자들은 그를 "선생님"이라고 불렀다.'
          : '모임은 매주 목요일 같은 건물 지하 노래방에서 열리는 것으로 알려졌다.',
    }),
    choices: [
      { id: 'expel', label: '반대파를 쫓아낸다', dark: 1, say: ['mom', '싸우지들 좀 마라. 밥 먹을 때는.'], effectText: '전 세계 신도 일부 이탈 · 결속 +15 · 그 간부가 등을 돌림', apply(s, ctx) { const l = loseAll(s, V.schism.expelLoss); changeUnity(s, V.schism.expelUnity); if (ctx.leader) setCast(s, ctx.leader, 'betrayed'); return `${n(l)}명이 따라 나갔다. 그들은 길 건너 상가에 새 간판을 걸었다. 글씨체가 우리 거랑 똑같았다.`; } },
      { id: 'compromise', label: '직함을 하나씩 더 만들어 준다', cost: (s) => cost(s, V.schism.compromiseCost), available: (s) => afford(s, V.schism.compromiseCost), say: ['jeongsuk', '어머, 명함은 제가 새로 뽑을게요. 금박으로요.'], effectText: '결속 +10 · 신도 조금 이탈 · 신앙력 소모', apply(s) { pay(s, V.schism.compromiseCost); changeUnity(s, V.schism.compromiseUnity); const l = loseAll(s, V.schism.compromiseLoss); return `수석 부총괄, 총괄 부수석 같은 직함이 생겼다. 그래도 ${n(l)}명은 나갔다.`; } },
      { id: 'ignore', label: '모른 척한다', say: ['minho', '근데요, 거기 목요일 노래방 저도 초대받았어요.'], effectText: '결속 크게 떨어짐', apply(s) { changeUnity(s, V.schism.ignoreUnity); return '목요일 모임은 매주 커졌다. 노래방 사장님이 단체 할인을 해 주기 시작했다.'; } },
    ],
  },

  // ── 녹취 파일 ──
  {
    id: 'leak', format: 'minutes', kicker: '내부 고발', title: '새어 나간 녹취',
    when: (s) => s.riskPoints >= V.leak.minRisk,
    weight: (s) => 0.5 * riskWeight(s),
    context: (s) => ({ leaker: ['subin', 'dongcheol', 'taesik'].find((id) => ['active', 'betrayed', 'left'].includes(castOf(s, id).status)) ?? null }),
    doc: (s, ctx) => ({
      title: `[유출] ${cult(s)} 간부 회의 녹음 파일 일부 (기자에게 전달됨)`,
      lines: [
        [{ name: me(s) }, '그건 장부에 안 남기는 걸로 하죠.'],
        ctx.leaker ? [ctx.leaker, { subin: '네, 적을게요.', dongcheol: '알겠습니다. 다만 기록은 남겨 두겠습니다.', taesik: '응응. 아 이거 녹음되나?' }[ctx.leaker]] : [{ name: '(누군가)' }, '네.'],
        [{ name: '(의자 끄는 소리)' }, ''],
      ],
    }),
    choices: [
      { id: 'hush', label: (s, ctx) => (ctx.leaker ? `${j(CAST[ctx.leaker].short, '을/를')} 달랜다` : '흘린 사람을 달랜다'), dark: 1, cost: (s) => cost(s, V.leak.hushCost), available: (s) => afford(s, V.leak.hushCost), say: ['taesik', '봉투는 두꺼운 걸로 할까 얇은 걸로 할까?'], effectText: '보도를 막음 · 신앙력 소모 · 그림자 장부', apply(s) { pay(s, V.leak.hushCost); return '파일은 공개되지 않았다. 대신 백업이 어디 있는지 아는 사람이 한 명 늘었다.'; } },
      { id: 'explain', label: '먼저 해명한다', say: ['jeongsuk', '어머, 앞뒤 맥락을 붙이면 다르게 들려요~'], effectText: '본거지 거부감·경계 오름', apply(s) { bumpAversion(s, home(s), V.leak.explainAversion); bumpAlert(s, home(s), V.leak.explainAlert); return '해명 영상은 11분짜리였다. 다들 앞의 9분은 건너뛰었다.'; } },
      { id: 'deny', label: '조작된 파일이라고 한다', dark: 1, say: ['subin', '성문 분석 하면 2주면 나와요.'], effectText: '경계 크게 오름 · 그림자 장부', apply(s, ctx) { bumpAlert(s, home(s), V.leak.denyAlert); if (ctx.leaker && isIn(s, ctx.leaker)) setCast(s, ctx.leaker, 'betrayed'); return '성문 분석 결과는 2주 뒤에 나왔다. 일치율 97%.'; } },
    ],
  },

  // ── 간판 바꾼 게 들켰다 (선택지 하나) ──
  {
    id: 'exposed', format: 'paper', kicker: '폭로', title: '새 간판 뒤의 옛 얼굴',
    when: (s) => Boolean(s.flags.rebrand) && !s.flags.rebrandExposed,
    weight: (s) => 0.6 * riskWeight(s),
    doc: (s) => ({
      masthead: '동네일보',
      date: '제1,311호',
      headline: `이름만 바꾼 "${cult(s)}"... 새 간판 뒤에 같은 얼굴`,
      sub: '전단지 글씨체, 반찬 메뉴까지 그대로',
      body: '취재진이 확인한 결과 새 모임의 대표, 간부, 심지어 토요일 백반 메뉴까지 예전과 같았다. 한 신도는 "깍두기 맛이 똑같아서 바로 알았다"고 말했다.',
    }),
    choices: [
      { id: 'accept', label: '감당한다', say: ['minho', '근데요, 깍두기는 좀 바꿀 걸 그랬어요.'], effectText: '본거지 거부감 두 배 · 경계 오름', apply(s) { s.flags.rebrandExposed = true; const cs = s.countries[home(s)]; cs.aversion = Math.min(1, cs.aversion * V.exposed.aversionMul + 0.05); bumpAlert(s, home(s), V.exposed.alert); return '"속았다"는 말이 처음 속았을 때보다 크게 퍼졌다. 깍두기 레시피는 그대로 갔다.'; } },
    ],
  },

  // ── 엄마 입원 ──
  {
    id: 'momSick', format: 'sms', kicker: '가족', title: '엄마 입원',
    when: (s) => isIn(s, 'mom') && s.turn >= 30 && totalFollowers(s) >= 150,
    weight: () => 0.35,
    doc: (s) => ({
      from: '엄마', who: 'mom', time: '오후 4:52',
      lines: [`${callName(me(s))} 엄마 병원이다`, '별거 아니다 계단에서 좀', '반찬은 냉장고 둘째 칸', '목요일 백반은 김 집사한테 말해 놨다', '오지 마라 바쁜데'],
    }),
    choices: [
      { id: 'hospital', label: '제일 큰 병원으로 옮긴다', cost: (s) => cost(s, V.momSick.hospitalCost), available: (s) => afford(s, V.momSick.hospitalCost), say: ['taesik', '병원비는 금고에서 뺄게. 이건 장부에 제대로 적을게.'], effectText: '엄마 회복 · 신앙력 소모', apply() { return '엄마는 2주 만에 퇴원했다. 퇴원하는 날 간호사실에 반찬통을 세 개 두고 왔다.'; } },
      { id: 'pray', label: '치유 기도회로 고친다', dark: 2, odds: () => 1 - V.momSick.prayDeath, say: ['subin', '기도회는 하는데요, 병원은 계속 다니시는 거죠?'], effectText: `결속 +${V.momSick.prayUnity} · 잘못되면 엄마를 잃고 본거지 거부감 크게 오름 · 그림자 장부`, apply(s) { changeUnity(s, V.momSick.prayUnity); if (chance(s, V.momSick.prayDeath)) { setCast(s, 'mom', 'dead'); bumpAversion(s, home(s), V.momSick.prayAversion); return '엄마는 기도회 다음 주에 돌아가셨다. 장례식장 화환이 다 신도들 것이었다. 냉장고 둘째 칸에는 아직 멸치볶음이 있다.'; } return '엄마는 병원 침대에서 기도회 영상을 봤다. 소리는 끄고. 3주 뒤에 퇴원했다.'; } },
      { id: 'visit', label: '설교 끝나고 들른다', say: ['mom', '오지 말라니까. 온 김에 귤 좀 까 봐라.'], effectText: `결속 ${V.momSick.homeUnity} (간부들이 교주 없는 저녁 회의를 했다)`, apply(s) { changeUnity(s, V.momSick.homeUnity); return '병실에서 귤을 열두 개 깠다. 그동안 간부들은 교주 없이 회의를 했다. 회의록은 동철이 썼다.'; } },
    ],
  },

  // ── 민호의 딱지 ──
  {
    id: 'ticket', format: 'sms', kicker: '사고', title: '민호의 과태료',
    when: (s) => isIn(s, 'minho') && totalFollowers(s) >= 60,
    weight: () => 0.4,
    doc: (s) => ({
      from: '민호', who: 'minho', time: '오후 7:33',
      lines: ['근데요 교주님', '저 신호위반 걸렸어요', '근데 오토바이에 교단 스티커 붙어 있어서요', `경찰이 "${cult(s)}? 거기 그 반찬?" 하던데요`, '과태료 6만 원이에요'],
    }),
    choices: [
      { id: 'pay', label: '교단에서 내 준다', cost: (s) => cost(s, V.ticket.payCost), available: (s) => afford(s, V.ticket.payCost), say: ['minho', '근데요, 진짜요? 감사합니다.'], effectText: '결속 +2 · 신앙력 조금', apply(s) { pay(s, V.ticket.payCost); changeUnity(s, V.ticket.payUnity); return '민호는 그 주에 전단지를 평소의 두 배 돌렸다. 신호는 지켰다.'; } },
      { id: 'pr', label: '"홍보 효과"라고 한다', say: ['minho', '근데요, 그럼 스티커 더 크게 붙여요?'], effectText: `본거지 유닛 전파 +10% (${V.ticket.stickerTurns}달) · 경계 조금 오름`, apply(s) { addEffect(s, 'incident:sticker', { turns: V.ticket.stickerTurns }); bumpAlert(s, home(s), V.ticket.stickerAlert); return '오토바이 스티커가 A4 크기가 됐다. 동네 배달 기사들 사이에서 민호는 "반찬 형"으로 불렸다.'; } },
    ],
  },

  // ── 서진의 쇼츠 ──
  {
    id: 'viral', format: 'chat', kicker: '호재', title: '서진의 영상',
    when: (s) => isIn(s, 'seojin') && totalFollowers(s) >= 300,
    weight: () => 0.5,
    doc: (s) => ({
      room: `${cult(s)} 간부방`,
      lines: [
        ['jeongsuk', '어머 이거 보셨어요?? 서진이 영상 조회수 80만이에요', '오전 11:02'],
        ['seojin', '그냥 성소에서 밥 먹는 거 찍은 건데요', '오전 11:05'],
        ['seojin', '제목은 "교주 조카의 점심"', '오전 11:05'],
        isIn(s, 'dongcheol') ? ['dongcheol', '사전 협의가 없었습니다. 다만 결과는 나쁘지 않습니다.', '오전 11:20'] : ['subin', '댓글에 반찬 레시피 물어보는 사람이 많아요.', '오전 11:20'],
      ],
    }),
    choices: [
      { id: 'let', label: '그냥 둔다', say: ['seojin', '그래서요? 다음 편은 저녁 먹는 거 찍을게요.'], effectText: `본거지 증가 +20% (${V.viral.turns}달) · 거부감 조금 쌓임`, apply(s) { addEffect(s, 'incident:viral', { turns: V.viral.turns }); bumpAversion(s, home(s), V.viral.aversion); return '"교주 조카의 저녁"은 120만이 나왔다. 성소 앞에 삼각대 든 사람들이 오기 시작했다.'; } },
      { id: 'stop', label: '내리라고 한다', say: ['seojin', '그래서요? 내리면 수익은요?'], effectText: `결속 ${V.viral.stopUnity}`, apply(s) { changeUnity(s, V.viral.stopUnity); return '서진은 영상을 내렸다. 사흘 동안 아무하고도 말을 안 했다. 엄마가 계란말이를 해 줬다.'; } },
    ],
  },

  // ── 정숙의 실적 경쟁 ──
  {
    id: 'quota', format: 'sms', kicker: '포교', title: '정숙의 제안',
    when: (s) => isIn(s, 'jeongsuk') && totalFollowers(s) >= 400,
    weight: () => 0.45,
    doc: () => ({
      from: '한정숙 간부님', who: 'jeongsuk', time: '오전 7:01',
      lines: ['교주님~ 좋은 아침이에요 ^^', '제가 보험 할 때 써먹던 방법이 있는데요', '새 신도 한 분 모셔 오면 문화상품권 만 원!', '실적 1등은 시상식도 하고요~', '어때요?? 무조건 돼요!!'],
    }),
    choices: [
      { id: 'yes', label: '해 보자', dark: 1, say: ['jeongsuk', '어머, 시상식 꽃다발은 제가 단골 꽃집에서 할게요~'], effectText: `전 세계 증가 +20% (${V.quota.turns}달) · 거부감 쌓임 · 그림자 장부`, apply(s) { addEffect(s, 'incident:quota', { turns: V.quota.turns }); return '첫 달 1등은 정숙이었다. 2등도 정숙이 데려온 사람이었다.'; } },
      { id: 'no', label: '그건 좀 아니다', say: ['jeongsuk', '어머... 네, 알겠어요. 근데 진짜 되는 건데.'], effectText: '아무 일 없음', apply() { return '정숙은 문화상품권 백 장을 이미 사 놨다. 그건 연말 송년회 경품이 됐다.'; } },
      { id: 'calendar', label: '대신 교주 얼굴 달력을 만든다', cost: (s) => cost(s, V.quota.calendarCost), available: (s) => afford(s, V.quota.calendarCost), say: ['mom', '그 사진 말고 작년에 찍은 거 써라. 그게 낫다.'], effectText: `본거지 거부감 +${Math.round(V.quota.calendarAversion * 100)} · 결속 +${V.quota.calendarUnity} · 신앙력 소모 (손해 보는 선택)`, apply(s) { pay(s, V.quota.calendarCost); bumpAversion(s, home(s), V.quota.calendarAversion); changeUnity(s, V.quota.calendarUnity); return `3천 부를 찍었다. 8월 사진에서 ${j(me(s), '은/는')} 수박을 들고 있다. 2,600부가 창고에 있다.`; } },
    ],
  },
];

export const CARD_BY_ID = Object.fromEntries(INCIDENT_CARDS.map((c) => [c.id, c]));

// 선택지가 지금 보이는가 (숨은 선택지)
export const visibleChoices = (state, card, ctx) => card.choices.filter((c) => !c.visible || c.visible(state, ctx));
