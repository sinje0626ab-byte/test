// 30장 새 구역: 열리는 조건 설명 · 닫힌 동안 펜스 표지 · 열릴 때 문장 · 구역 퀘스트.
// 열리는 조건 자체는 sim/zones.js ZONE_RULES. 가게·건물 이름은 data/places.js · shops.js (전부 지어낸 것).

export const ZONE_TEXT = {
  stream: { name: '도림천 산책로', closed: null, opened: null },
  market_in: {
    name: '시장 안쪽',
    closed: '통행 제한 · 시장 안쪽 배수로 공사 중',
    opened: '시장 안쪽 배수로 공사가 끝났다. 떡집 찜기 김이 골목 끝까지 피어오른다.',
    hint: '통장님께 인사하면 반상회에서 공사 끝나는 날을 알려 준다.',
  },
  hill: {
    name: '원룸 언덕',
    closed: '통행 제한 · 계단 난간 교체 공사',
    opened: '언덕 계단에 새 난간이 붙었다. 꼭대기 편의점 불빛이 내려다보인다.',
    hint: '302호를 넓히는 무렵 (2단계) 공사가 끝난다고 한다.',
  },
  gosi: {
    name: '고시촌 골목',
    closed: '통행 제한 · 하수관 교체 공사',
    opened: '고시촌 골목 하수관 공사가 끝났다. 게시판에 시험 일정표가 새로 붙었다.',
    hint: '첫 간부를 세우면 간부가 고시촌 쪽 사람을 소개해 준다.',
  },
  sundae: {
    name: '순댓국 골목',
    closed: '통행 제한 · 도시가스 배관 공사',
    opened: '순댓국 골목 가스 공사가 끝났다. 세 집 솥에서 한꺼번에 김이 오른다.',
    hint: '3단계에 들어가면 공사가 끝난다.',
  },
};

// 구역이 열릴 때 띠 (28장 B 보상과 같은 톤)
export const ZONE_REWARD = { kind: '새 구역', text: '{구역}이(가) 열렸다', xp: 8 };

// 구역 퀘스트 (30장 D): 구역마다 둘씩. 수첩 '구역 일' 칸.
//   step: talk (그 주민과 얘기) · visit (그 자리에 가 보기) · members (그 구역 주민 중 신도 n명)
//   reward: money · rep · xp
export const ZONE_QUESTS = {
  stream: [
    { id: 'stream_photo', name: '벚꽃 사진 줄 세우기', hint: '진옥자 할머니가 꽃밭 앞 사진 줄을 걱정한다. 산책로 벚나무 앞에 가 본다.', step: { type: 'visit', spot: 'stream:cherry' }, then: { type: 'talk', id: 'okja' }, done: '"줄 서서 찍으니까 꽃을 안 밟네. 고마워요."', reward: { rep: 2, xp: 6 } },
    { id: 'stream_fish', name: '다리 밑 낚시꾼', hint: '문동수 씨가 석 달째 다리 밑에 앉아 있다. 말을 붙여 본다.', step: { type: 'talk', id: 'dongsu' }, then: { type: 'visit', spot: 'stream:underbridge' }, done: '"…오늘은 한 마리 물었어요. 놓쳤지만."', reward: { xp: 6 } },
  ],
  market_in: [
    { id: 'mill_fix', name: '방앗간 기계 고치는 사람', hint: '고소방앗간 기계가 덜컹거린다. 방영수에게 사정을 듣고, 철물점 쪽 사람을 찾아본다.', step: { type: 'talk', id: 'yeongsu' }, then: { type: 'visit', shop: 'hardware' }, done: '방앗간 기계가 다시 고르게 돈다. 방성태 사장님이 들기름 한 병을 말없이 내민다.', reward: { money: 10_000, rep: 2, xp: 8 } },
    { id: 'market_in_members', name: '시장 안쪽 단골', hint: '시장 안쪽 사장님 둘이 {성소}에 나온다.', step: { type: 'members', zone: 'market_in', n: 2 }, done: '떡집 사장님이 예배 끝나고 남은 떡을 들고 왔다.', reward: { xp: 10 } },
  ],
  hill: [
    { id: 'hill_move', name: '이삿짐 계단 나르기', hint: '문지율이 또 이사한다. 언덕 계단 위로 가서 거든다.', step: { type: 'talk', id: 'jiyul' }, then: { type: 'visit', spot: 'h_lane:top' }, done: '상자 열한 개를 날랐다. 하길수 씨가 계단에 흘린 테이프 조각을 주워 갔다.', reward: { rep: 2, xp: 8 } },
    { id: 'hill_members', name: '언덕 위 불빛', hint: '원룸 언덕 사람 둘이 {성소}에 나온다.', step: { type: 'members', zone: 'hill', n: 2 }, done: '언덕 편의점 점장님이 "요즘 저녁에 다들 어디 가?" 하고 물었다.', reward: { xp: 10 } },
  ],
  gosi: [
    { id: 'gosi_result', name: '합격 발표 같이 보기', hint: '류재민의 시험 발표가 다가온다. 고시촌 게시판 앞에 같이 서 준다.', step: { type: 'talk', id: 'jaemin' }, then: { type: 'visit', spot: 'g_lane:board' }, done: '게시판 앞에서 류재민이 휴대폰 화면을 오래 내려다봤다. 이번에도 이름은 없었다. 컵밥 한 그릇을 같이 먹었다.', reward: { xp: 8 } },
    { id: 'gosi_members', name: '독서실 불 끄는 시간', hint: '고시촌 사람 둘이 {성소}에 나온다.', step: { type: 'members', zone: 'gosi', n: 2 }, done: '하숙집 주인이 "우리 학생들 저녁에 어디 다녀오는지 알아요" 하고 웃었다.', reward: { xp: 10 } },
  ],
  sundae: [
    { id: 'sundae_fight', name: '사장님들 밤 싸움 말리기', hint: '할매집과 삼대집이 손님 줄 때문에 다툰다. 표대식 사장님 포장마차에 가서 듣는다.', step: { type: 'talk', id: 'daesik' }, then: { type: 'visit', spot: 's_lane:tables' }, done: '포장마차 천막 아래서 두 사장님이 소주 한 잔씩 하고 헤어졌다. 줄은 가운데서 나누기로 했다.', reward: { rep: 3, xp: 8 } },
    { id: 'sundae_members', name: '국밥 한 그릇', hint: '순댓국 골목 사람 둘이 {성소}에 나온다.', step: { type: 'members', zone: 'sundae', n: 2 }, done: '골목순대국밥 사장님이 새벽 손님들한테 {성소} 얘기를 한다고 한다.', reward: { xp: 10 } },
  ],
};
