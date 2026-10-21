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
  worry: { name: '걱정 많음', slip: '{이름}이(가) {대상}을(를) 붙잡고 밥은 먹고 다니냐, 집엔 자주 가냐 한참 물었다. {대상}은(는) 시계를 몇 번 봤다.', slipMul: 0.8 },
  joke: { name: '농담꾼', slip: '"우리 302호 오면 복 받아요. 아, 농담이고요." {이름}이(가) 혼자 웃었고 {대상}은(는) 안 웃었다.', slipMul: 1.0 },
  eager: { name: '열성', slip: '{이름}이(가) {대상}에게 수요일에 꼭 오라는 말을 몇 번이나 했다. 헤어지면서 또 했다.', slipMul: 1.3 },
  chatty: { name: '수다', slip: '다른 신도네 집안 사정이 {대상} 앞에서 술술 나와 버렸다. {이름}은(는) 말하고 나서야 입을 막았다.', slipMul: 1.1 },
  calc: { name: '계산적', slip: '{이름}이(가) {대상}에게 인사도 하기 전에 헌금 얘기부터 꺼냈다.', slipMul: 1.2 },
  soft: { name: '순함', slip: '{대상} 앞에서 몇 마디 하다가 말이 꼬였다. {이름}은(는) 전단만 쥐고 그냥 돌아왔다.', slipMul: 0.6 },
  strict: { name: '깐깐함', slip: '{대상}이(가) 담배를 꺼내자 {이름}이(가) 몸에 안 좋다고 한소리 했다.', slipMul: 1.0 },
  plain: { name: '무난함', slip: '전단을 받은 {대상}이(가) 몇 걸음 가서 바닥에 버렸다. {이름}이(가) 그걸 다 보고 있었다.', slipMul: 1.0 },
};

// 배치 이름
export const ASSIGN_NAMES = { none: '쉬는 중', street: '낮 포교' };

// 불만이 쌓였을 때 문장
export const DISCONTENT_TEXT = {
  embezzle: '장부를 맞춰 보니 {돈}이 빈다. 하필 {이름}이(가) 맡았던 날이다.',
  faction: '신도 몇 명이 따로 단체 대화방에 들어가 있다. 방을 만든 건 {이름}. 302호 얘기는 요즘 거기서 먼저 돈다.',
  leave: '책상 위에 간부 명찰이 놓여 있었다. {이름}이(가) 두고 갔다. "저 좀 쉴게요. 당분간만요."',
  expose: '동네 단체 대화방에 302호 장부 사진이 올라왔다. 올린 사람은 {이름}. 평판이 크게 떨어졌다.',
};

// 간부 회의 안건. who: 안건을 올리는 간부 조건 (trait 또는 any) · a/b/c: 선택지
//   fx: money · disc(올린 간부 불만) · discAll(모든 간부) · like(신도 호감) · rep · belief · shadow · tong(통장님 의심) · fatigue
export const AGENDAS = [
  {
    id: 'snack', who: 'any', title: '간식비',
    say: '"예배 끝나면 다들 바로 가요. 귤이라도 한 봉지 놓여 있으면 좀 앉았다 갈 텐데."',
    options: [
      { label: '주 5만 원 쓴다', fx: { money: -50_000, disc: -12, like: 2 } },
      { label: '아직 그럴 돈 없다', fx: { disc: 10 } },
    ],
  },
  {
    id: 'flyer', who: 'eager', title: '전단지 다시 찍기',
    say: '"전단지 형광 분홍으로 바꾸면 어때요? 멀리서도 보이잖아요. 인쇄소에 물어봤는데 생각보다 안 비싸요."',
    options: [
      { label: '형광 분홍으로 천 장', fx: { money: -40_000, disc: -10, rep: -1, street: 1 } },
      { label: '지금 걸로 충분하다', fx: { disc: 8 } },
    ],
  },
  {
    id: 'envelope', who: 'calc', title: '헌금 봉투에 이름 칸',
    say: '"봉투에 이름 칸을 크게 넣으면요, 다들 조금씩 더 넣어요. 보험 할 때 다 그렇게 했어요."',
    options: [
      { label: '이름 칸을 크게 만든다', fx: { offeringWeek: 0.15, belief: -6, disc: -10, shadow: 'envelope' } },
      { label: '무기명 그대로 둔다', fx: { disc: 8, rep: 1 } },
    ],
  },
  {
    id: 'seat', who: 'rivals', title: '자리 다툼',
    say: '"{상대}랑은 같은 방 못 있겠어요. 정해 주세요, 둘 중에 하나."',
    options: [
      { label: '{이름} 편을 든다', fx: { disc: -12, discOther: 15 } },
      { label: '{상대} 편을 든다', fx: { disc: 15, discOther: -12 } },
      { label: '둘 다 다른 일로 돌린다', fx: { disc: 5, discOther: 5, unassignBoth: true } },
    ],
  },
  {
    id: 'stipend', who: 'any', title: '간부 수당',
    say: '"버스비라도 좀 안 될까요. 다들 자기 돈 내고 다녀요. 저도 그렇고."',
    options: [
      { label: '한 사람에 3만 원씩 준다', fx: { moneyPerOfficer: -30_000, discAll: -15 } },
      { label: '봉사니까 없다', fx: { discAll: 8 } },
    ],
  },
  {
    id: 'vigil', who: 'eager', title: '매일 밤 기도 모임',
    say: '"수요일, 일요일로는 모자라요. 매일 밤 잠깐이라도 모이면 좋겠어요."',
    options: [
      { label: '매일 밤 모인다', fx: { belief: 6, like: 2, discAll: 4, fatigue: 15 } },
      { label: '지금처럼 일주일에 두 번', fx: { disc: 6 } },
    ],
  },
  {
    id: 'visit', who: 'strict', title: '가족 면회 규칙',
    say: '"숙소에 가족들이 너무 자주 와요. 면회 날을 정해 두면 어때요? 일주일에 한 번쯤."',
    needs: 'dorm',
    options: [
      { label: '면회를 일주일에 한 번으로', fx: { leaveWeek: 10, belief: -6, shadow: 'visit', disc: -8 } },
      { label: '가족은 언제든 와도 된다', fx: { rep: 2, disc: 6 } },
    ],
  },
  {
    id: 'cleanup', who: 'worry', title: '골목 청소',
    say: '"골목 쓰레기라도 우리가 먼저 좀 줍자. 그럼 통장님도 덜 싫어하시겠지."',
    options: [
      { label: '토요일 아침 골목 청소', fx: { rep: 4, tong: -6, fatigue: 10, disc: -6 } },
      { label: '그럴 시간 없다', fx: { disc: 6 } },
    ],
  },
];
