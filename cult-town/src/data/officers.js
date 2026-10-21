// 간부: 첫 신도 3명의 능력치·성격, 신도를 승진시킬 때 쓰는 성격 표, 간부 회의 안건.
//   능력치 1~5: talk(말솜씨) · manage(관리) · loyal(충성)
//   trait: 낮 포교 때 하는 실수의 종류

export const CAST_OFFICERS = {
  mom: { talk: 2, manage: 4, loyal: 5, trait: 'worry' },
  friend: { talk: 3, manage: 3, loyal: 4, trait: 'joke' },
  stranger: { talk: 4, manage: 2, loyal: 3, trait: 'eager' },
};

// 주민 성격 → 간부 성격
export const TRAIT_MAP = { chatty: 'chatty', shrewd: 'calc', kind: 'soft', strict: 'strict', devout: 'eager', blunt: 'joke', tough: 'strict' };

export const TRAITS = {
  worry: { name: '걱정 많음', slip: '{이름}이(가) {대상}을(를) 붙잡고 "밥은 먹고 다니냐"며 30분 잔소리를 했다.', slipMul: 0.8 },
  joke: { name: '농담꾼', slip: '{이름}이(가) {대상}에게 "우리 302호 오면 복 받아요, 아 농담" 하고 웃었다. 안 웃겼다.', slipMul: 1.0 },
  eager: { name: '열성', slip: '{이름}이(가) {대상}에게 수요일에 꼭 오라고 세 번 말했다.', slipMul: 1.3 },
  chatty: { name: '수다', slip: '{이름}이(가) {대상} 앞에서 다른 신도 집안 얘기를 해 버렸다.', slipMul: 1.1 },
  calc: { name: '계산적', slip: '{이름}이(가) {대상}에게 헌금 얘기를 먼저 꺼냈다.', slipMul: 1.2 },
  soft: { name: '순함', slip: '{이름}이(가) {대상} 앞에서 말을 더듬다가 그냥 돌아왔다.', slipMul: 0.6 },
  strict: { name: '깐깐함', slip: '{이름}이(가) {대상}의 담배를 보고 한마디 했다.', slipMul: 1.0 },
  plain: { name: '무난함', slip: '{이름}이(가) {대상}에게 전단을 건넸다가 바로 바닥에 버려지는 걸 봤다.', slipMul: 1.0 },
};

// 배치 이름
export const ASSIGN_NAMES = { none: '쉬는 중', street: '낮 포교' };

// 불만이 쌓였을 때 문장
export const DISCONTENT_TEXT = {
  embezzle: '장부를 맞춰 보니 {돈}이 빈다. {이름}이(가) 맡은 날 비었다.',
  faction: '{이름}이(가) 신도 몇 명과 따로 단체 대화방을 만들었다. 302호 얘기가 거기서 돈다.',
  leave: '{이름}이(가) 간부 명찰을 책상에 두고 갔다. "저 당분간 쉴게요."',
  expose: '{이름}이(가) 동네 단체 대화방에 302호 장부 사진을 올렸다. 평판이 크게 떨어졌다.',
};

// 간부 회의 안건. who: 안건을 올리는 간부 조건 (trait 또는 any) · a/b/c: 선택지
//   fx: money · disc(올린 간부 불만) · discAll(모든 간부) · like(신도 호감) · rep · belief · shadow · tong(통장님 의심) · fatigue
export const AGENDAS = [
  {
    id: 'snack', who: 'any', title: '간식비',
    say: '"예배 끝나고 사람들이 그냥 가요. 귤이라도 한 봉지 있으면 더 앉아 있을 텐데."',
    options: [
      { label: '주 5만 원 쓴다', fx: { money: -50_000, disc: -12, like: 2 } },
      { label: '아직 그럴 돈 없다', fx: { disc: 10 } },
    ],
  },
  {
    id: 'flyer', who: 'eager', title: '전단지 다시 찍기',
    say: '"전단지를 형광 분홍으로 바꾸면 멀리서도 보여요. 천 장에 4만 원이래요."',
    options: [
      { label: '형광 분홍으로 천 장', fx: { money: -40_000, disc: -10, rep: -1, street: 1 } },
      { label: '지금 걸로 충분하다', fx: { disc: 8 } },
    ],
  },
  {
    id: 'envelope', who: 'calc', title: '헌금 봉투에 이름 칸',
    say: '"봉투에 이름 칸을 크게 만들면 다들 조금씩 더 넣어요. 보험 영업에서 다 그렇게 해요."',
    options: [
      { label: '이름 칸을 크게 만든다', fx: { offeringWeek: 0.15, belief: -6, disc: -10, shadow: 'envelope' } },
      { label: '무기명 그대로 둔다', fx: { disc: 8, rep: 1 } },
    ],
  },
  {
    id: 'seat', who: 'rivals', title: '자리 다툼',
    say: '"{상대}랑 같은 방은 못 하겠어요. 둘 중 하나 정해 주세요."',
    options: [
      { label: '{이름} 편을 든다', fx: { disc: -12, discOther: 15 } },
      { label: '{상대} 편을 든다', fx: { disc: 15, discOther: -12 } },
      { label: '둘 다 다른 일로 돌린다', fx: { disc: 5, discOther: 5, unassignBoth: true } },
    ],
  },
  {
    id: 'stipend', who: 'any', title: '간부 수당',
    say: '"간부들 버스비라도 좀… 다들 자기 돈 쓰고 다녀요."',
    options: [
      { label: '한 사람에 3만 원씩 준다', fx: { moneyPerOfficer: -30_000, discAll: -15 } },
      { label: '봉사니까 없다', fx: { discAll: 8 } },
    ],
  },
  {
    id: 'vigil', who: 'eager', title: '매일 밤 기도 모임',
    say: '"수요일 일요일만으로는 부족해요. 매일 밤 30분씩 모여요."',
    options: [
      { label: '매일 밤 모인다', fx: { belief: 6, like: 2, discAll: 4, fatigue: 15 } },
      { label: '지금처럼 일주일에 두 번', fx: { disc: 6 } },
    ],
  },
  {
    id: 'visit', who: 'strict', title: '가족 면회 규칙',
    say: '"숙소에 가족이 너무 자주 와요. 면회를 일주일에 한 번으로 정하면 어때요?"',
    needs: 'dorm',
    options: [
      { label: '면회를 일주일에 한 번으로', fx: { leaveWeek: 10, belief: -6, shadow: 'visit', disc: -8 } },
      { label: '가족은 언제든 와도 된다', fx: { rep: 2, disc: 6 } },
    ],
  },
  {
    id: 'cleanup', who: 'worry', title: '골목 청소',
    say: '"우리가 먼저 골목 쓰레기 좀 주우면 통장님이 덜 싫어하실 거야."',
    options: [
      { label: '토요일 아침 골목 청소', fx: { rep: 4, tong: -6, fatigue: 10, disc: -6 } },
      { label: '그럴 시간 없다', fx: { disc: 6 } },
    ],
  },
];
