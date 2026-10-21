// 성장 계시: 신도 50명 "간판" · 100명 "울타리". faith-game 의 계시 연출을 이 게임 규칙으로 다시 썼다.
//   choices: dark(그림자 장부 무게) · fx(효과, sim/revelation.js) · say: [말하는 사람 cast id, 대사]
export const REVELATION_TEXT = {
  sign: {
    numeral: 'I', title: '간판',
    narration: [
      '신도 쉰 명. 302호 계단에 신발이 서른 켤레 넘게 쌓였다. 1층 김밥집 사장님이 신발 세는 걸 그만뒀다.',
      '통장님이 회람판 귀퉁이에 "3층"이라고만 적어 놓고 갔다.',
      '오랜 친구 태식이 전단지 뭉치를 책상에 내려놨다. "이제 간판을 달 때가 됐다. 어떻게 보일지는 네가 정해."',
    ],
    question: '동네에 우리를 어떻게 보이게 할까.',
    pickCount: 1,
    choices: [
      { id: 'banner', label: '3층 창문에 큰 현수막', flavor: '역 3번 출구에서 올려다보면 보인다. 궁서체.', say: ['friend', '"글씨는 내가 쓴다. 궁서체 연습 많이 했다."'], effect: '따라온 사람 +4 · 동네 평판 −3', dark: 0 },
      { id: 'quiet', label: '간판 없이 입소문만', flavor: '문에 "302"만 붙여 둔다. 아는 사람만 온다.', say: ['stranger', '"저도 처음엔 화장실인 줄 알았잖아요."'], effect: '동네 의심이 매일 조금 덜 쌓인다', dark: 0 },
      { id: 'volunteer', label: '"골목 이웃 봉사 모임"이라는 이름으로', flavor: '연탄 나르기, 골목 청소. 조끼에는 교단 이름을 안 넣는다.', say: ['mom', '"봉사는 좋은데, 조끼에 이름은 왜 안 넣니?"'], effect: '돈 −20만 원 · 평판 +8 · 통장님 의심 −10 · 나중에 들키면 평판↓', dark: 1 },
    ],
    afterword: '태식이 철물점에서 케이블타이 한 봉지를 사 왔다. 엄마는 보리차를 2리터 더 끓였다.',
  },
  fence: {
    numeral: 'II', title: '울타리',
    narration: [
      '신도 백 명. 웨딩홀 폐업 정리하는 데서 접이식 의자 쉰 개를 더 사 왔다.',
      '출석부에 빈칸이 생기기 시작했다. 가족 전화 받고 안 나오는 사람, 이유 없이 안 나오는 사람.',
      '엄마가 말했다. "사람이 나가는 걸 어떻게 막니. 밥을 맛있게 하면 되지."',
    ],
    question: '사람들이 쉽게 안 나가게 규칙 두 줄을 정하자.',
    pickCount: 2,
    choices: [
      { id: 'meal', label: '매주 같이 밥 먹는 날', flavor: '일요일 예배 끝나고 다 같이 국수. 설거지는 돌아가며.', say: ['mom', '"국수는 내가 삶는다. 오십 인분이면 냄비가 두 개 필요해."'], effect: '이탈 조금↓ · 주마다 돈 −3만 원', dark: 0 },
      { id: 'open', label: '막지 않는다', flavor: '나가는 사람에게 보리차 한 잔 주고 인사한다.', say: ['stranger', '"저 같은 사람은 그래야 또 와요."'], effect: '이탈 그대로 · 평판 +6', dark: 0 },
      { id: 'communal', label: '공동 생활 규칙', flavor: '숙소에서 같이 자고 같이 일어난다. 돌아갈 방이 없으면 잘 안 나간다.', say: ['friend', '"코 고는 사람은 따로 재우자. 그건 규칙에 넣자."'], effect: '이탈 크게↓ · 신도 가족 의심↑', dark: 1 },
      { id: 'pledge', label: '헌신 서약서', flavor: '이름과 날짜를 적고 도장. 낸 마음이 아까워서 못 나간다.', say: ['friend', '"서약서 양식은 부동산 계약서 보고 만들었다."'], effect: '헌금 +15% · 이탈↓ · 그림자 장부', dark: 2 },
      { id: 'interview', label: '나가려면 간부 면담 세 번', flavor: '세 번 만나는 동안 마음이 바뀐다.', say: ['mom', '"세 번이나? 나는 한 번만 해도 마음 약해지는데."'], effect: '이탈 크게↓ · 간부 불만↑ · 그림자 장부', dark: 2 },
    ],
    afterword: '두 줄을 코팅해서 302호 문 안쪽에 붙였다. 엄마는 집 냉장고에도 하나 붙였다.',
  },
};

// 규칙 효과 (울타리)
export const RULE_FX = {
  meal: { leave: 6, weeklyMoney: -30_000 },
  open: { leave: 0, rep: 6 },
  communal: { leave: 12, familySus: 3 },
  pledge: { leave: 8, offering: 0.15 },
  interview: { leave: 14, discAll: 6 },
};
