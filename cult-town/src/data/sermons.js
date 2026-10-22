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

// 위험 카드 (손패에 가끔 하나): 터지면 모두가 감동, 빗나가면 의심이 오른다. 성공률은 교주 카리스마 (config SERMON.risk)
export const RISK_CARDS = {
  doomsday: { id: 'dr', name: '날짜를 못 박는다', win: '앞줄이 숨을 멈췄다. 누가 달력에 동그라미를 쳤다.', lose: '"그날 저 출근하는데요." 뒷줄에서 웃음이 샜다.' },
  messiah: { id: 'mr', name: '오늘 밤 손을 얹는다', win: '손을 잡힌 사람이 울었다. 옆 사람도 따라 울었다.', lose: '손을 내밀었는데 아무도 안 잡았다. 보리차 컵만 덜그럭.' },
  meditation: { id: 'nr', name: '십 분 동안 아무 말도 안 하기', win: '십 분이 지나도 아무도 폰을 안 봤다. 누가 "한 번 더요" 했다.', lose: '삼 분째에 누가 코를 골았다.' },
  fortune: { id: 'fr', name: '천도 등에 이름 올리기', win: '봉투가 저절로 모였다. 이름 적을 펜이 모자랐다.', lose: '"그거 돈 내는 거죠?" 하는 소리가 들렸다.' },
  shaman: { id: 'sr', name: '즉석에서 한 사람 사주 풀기', win: '맞혔다. 당사자가 입을 막았다. 다들 자기 생일을 적기 시작했다.', lose: '틀렸다. "저 그해 아니고 그다음 해요."' },
  qigong: { id: 'qr', name: '기 모아 손바닥 데우기 시범', win: '손바닥이 진짜 따뜻하다고 했다. 줄이 생겼다.', lose: '"그냥 손 비빈 거 아니에요?"' },
};

// 앉은 사람 반응 (말풍선). moved: 유형마다 창작 응답 + 공통 몸짓
export const REACT = {
  moved: {
    all: ['(끄덕)', '(훌쩍)', '"그러니까요."', '"맞아, 맞아."'],
    doomsday: ['"깨어 있겠습니다."', '"날짜 적어 둘게요."'],
    messiah: ['"곁에 있겠습니다."', '"선생님 말씀이 맞아요."'],
    meditation: ['"후우."', '"숨이 좀 쉬어져요."'],
    fortune: ['"복 들어오겠네."', '"조상님이 들으셨겠다."'],
    shaman: ['"아이고, 맞다."', '"딱 내 얘기네."'],
    qigong: ['"기 들어온다."', '"손이 따뜻해요."'],
  },
  sleepy: ['(하품)', '"…응?"', '(고개가 툭)'],
  doubt: ['(팔짱)', '"그건 좀."', '(옆 사람 눈치)'],
  phone: ['(진동)', '(폰 화면 불빛)', '"잠깐만요."'],
};

// 돌발 (예배 중 한 번 확률). 선택지: ignore 무시 · joke 농담 · pause 잠깐 멈춤
export const DISRUPT = {
  phone: { text: '뒷줄에서 벨소리가 크게 울린다. 트로트 벨소리다.', choices: { ignore: '못 들은 척 계속', joke: '"하늘에서 온 전화는 아니죠?"', pause: '받으시라고 잠깐 멈춘다' } },
  baby: { text: '누가 데려온 아이가 울기 시작한다. 엄마가 어쩔 줄 몰라 한다.', choices: { ignore: '목소리를 키워 계속', joke: '"저 친구가 제일 솔직하네요."', pause: '보리차 한 잔 갖다주고 기다린다' } },
  late: { text: '문이 덜컥 열린다. 늦게 온 사람이 허리를 숙이고 들어온다.', choices: { ignore: '눈길도 안 주고 계속', joke: '"마침 좋은 데서 오셨어요."', pause: '자리 안내하고 다시' } },
  kimbap: { text: '쿵쿵쿵. 1층 꼬마김밥 사장님이다. "위에서 의자 끄는 소리 좀!"', choices: { ignore: '모른 척 계속', joke: '"김밥 열 줄 주문할게요."', pause: '내려가서 사과하고 온다' } },
};

export const SERMON_TEXT = {
  title: '{예배}',
  pick: '오늘 할 이야기를 세 장 고른다. 누가 무엇 때문에 왔는지 떠올려 보자. 고개를 끄덕이는지, 폰을 보는지 반응을 보고 다음 카드를 고른다.',
  tutorial: '카드엔 제목만 있다. 누가 어떤 고민인지는 낮에 나눈 얘기·엿들은 소문·수첩으로 짐작한다. ⚡ 카드는 크게 터지거나 크게 빗나간다.',
  gauge: '분위기',
  done: '설교 끝 · 헌금 바구니',
  basket: '헌금 바구니가 줄을 따라 돈다.',
  big: '앞줄 사람이 손수건을 꺼냈다. 이번 주 주보 1면감이다.',
  ok: '몇 사람이 고개를 끄덕였다.',
  flat: '뒤쪽에서 휴대폰 화면 불이 몇 개 켜졌다.',
  review: { big: '"{날}, 앞줄이 울었다."', ok: '"{날}, 대체로 끄덕끄덕."', flat: '"{날}, 휴대폰 불빛이 좀 보였다."' },
  react: { moved: ['"맞아, 맞아."', '"그 얘기 하실 줄 알았어요."', '"휴."'], sleepy: ['"…응?"', '(하품)'], doubt: ['"그건 좀."', '(팔짱)'], phone: ['(진동)', '"잠깐만요."'] },
};
