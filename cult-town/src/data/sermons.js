// 예배 미니게임 설교 카드 (24장 D-1). 유형마다 창작 교리 이름만 쓴다. 실제 설득 문장·화법은 쓰지 않는다 (카드 이름과 결과만).
//   need: 이 카드가 닿는 고민 · tag: 흐름 (앞 카드와 tag 가 같으면 이어진다)
export const SERMON_CARDS = {
  doomsday: [
    { id: 'd1', name: '달력의 빨간 동그라미', need: 'future', tag: 'date' },
    { id: 'd2', name: '대피소 비상식량 목록', need: 'money', tag: 'date' },
    { id: 'd3', name: '깨어 있는 이의 출석부', need: 'lonely', tag: 'us' },
    { id: 'd4', name: '마지막 장마 전에 할 일', need: 'meaning', tag: 'date' },
    { id: 'd5', name: '같은 줄에 선 사람들', need: 'lonely', tag: 'us' },
    { id: 'd6', name: '무릎 꿇는 연습', need: 'health', tag: 'body' },
  ],
  messiah: [
    { id: 'm1', name: '교주가 기억하는 이름', need: 'lonely', tag: 'leader' },
    { id: 'm2', name: '두 번째 문 앞에서', need: 'meaning', tag: 'leader' },
    { id: 'm3', name: '곁사람의 밥상', need: 'lonely', tag: 'us' },
    { id: 'm4', name: '손바닥의 온기', need: 'health', tag: 'leader' },
    { id: 'm5', name: '내일 걱정은 거처에 두고', need: 'future', tag: 'us' },
    { id: 'm6', name: '빈 통장의 쓸모', need: 'money', tag: 'us' },
  ],
  meditation: [
    { id: 'n1', name: '숨 세 번 세기', need: 'health', tag: 'breath' },
    { id: 'n2', name: '알림 끄는 수련', need: 'meaning', tag: 'breath' },
    { id: 'n3', name: '회사 의자 위의 명상', need: 'future', tag: 'work' },
    { id: 'n4', name: '월급날 마음 다스리기', need: 'money', tag: 'work' },
    { id: 'n5', name: '함께 앉는 방석', need: 'lonely', tag: 'breath' },
    { id: 'n6', name: '빈 의자 바라보기', need: 'meaning', tag: 'work' },
  ],
  fortune: [
    { id: 'f1', name: '조상님 통장 정리', need: 'money', tag: 'ancestor' },
    { id: 'f2', name: '가게 문지방 닦는 법', need: 'money', tag: 'shop' },
    { id: 'f3', name: '천도 등 하나 더', need: 'meaning', tag: 'ancestor' },
    { id: 'f4', name: '자식 이름 적는 종이', need: 'lonely', tag: 'ancestor' },
    { id: 'f5', name: '허리 펴는 절', need: 'health', tag: 'shop' },
    { id: 'f6', name: '다음 달 운세 봉투', need: 'future', tag: 'shop' },
  ],
  shaman: [
    { id: 's1', name: '올해 삼재 풀이', need: 'future', tag: 'year' },
    { id: 's2', name: '이름 획수 다시 세기', need: 'future', tag: 'name' },
    { id: 's3', name: '재물 방향 찾기', need: 'money', tag: 'year' },
    { id: 's4', name: '혼자 먹는 밥상 풀이', need: 'lonely', tag: 'name' },
    { id: 's5', name: '잠 못 드는 밤 부적 대신', need: 'health', tag: 'year' },
    { id: 's6', name: '부르는 소리 듣기', need: 'meaning', tag: 'name' },
  ],
  qigong: [
    { id: 'q1', name: '손뼉 백 번', need: 'health', tag: 'hand' },
    { id: 'q2', name: '아랫배 따뜻하게', need: 'health', tag: 'belly' },
    { id: 'q3', name: '기 모으는 줄서기', need: 'lonely', tag: 'hand' },
    { id: 'q4', name: '약 대신 물 한 잔', need: 'health', tag: 'belly' },
    { id: 'q5', name: '젊어지는 걸음', need: 'future', tag: 'hand' },
    { id: 'q6', name: '기운 나누기 회비', need: 'money', tag: 'belly' },
  ],
};

// 참석자 얼굴 상태
export const FACES = {
  sleepy: { name: '졸음', icon: 'zz' },
  moved: { name: '감동', icon: '♥' },
  doubt: { name: '의심', icon: '?' },
  phone: { name: '폰', icon: '▯' },
};

export const SERMON_TEXT = {
  title: '{예배}',
  pick: '설교 화제 카드를 세 장 고른다. 앉은 사람들 고민에 닿을수록, 앞 카드와 이어질수록 분위기가 오른다.',
  gauge: '분위기',
  done: '설교 끝',
  big: '앞줄 사람이 손수건을 꺼냈다. 이번 주 주보 1면감이다.',
  ok: '몇 사람이 고개를 끄덕였다.',
  flat: '뒤쪽에서 휴대폰 화면 불이 몇 개 켜졌다.',
  react: { moved: ['"맞아, 맞아."', '"그 얘기 하실 줄 알았어요."', '"휴."'], sleepy: ['"…응?"', '(하품)'], doubt: ['"그건 좀."', '(팔짱)'], phone: ['(진동)', '"잠깐만요."'] },
};
