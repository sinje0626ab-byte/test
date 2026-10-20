// 계열 3 × 유형 2. 이름과 교리 용어는 전부 지어낸 것이다.
// 실존 단체의 이름·교주·사건·용어를 쓰지 않는다. 유형은 여러 사례에 공통된 '패턴'의 이름일 뿐이다.
// 수치는 config.js 의 SECT_FX. family 는 배열 (계열 혼합은 2단계, 지금은 하나만).
//   religions: 같은 계열로 치는 주민 종교 배경 → 접근 쉬움, 대신 그 종교 성직자가 지켜본다

export const FAMILIES = {
  christian: { name: '기독교풍', religions: ['protestant', 'catholic'], clergy: 'pastor' },
  buddhist: { name: '불교풍', religions: ['buddhist'], clergy: 'monk' },
  folk: { name: '민간신앙풍', religions: ['folk'], clergy: 'mansin' },
};

export const SECTS = {
  doomsday: {
    family: ['christian'], name: '종말 예언형',
    pitch: '정해 둔 날짜가 다가온다고 말한다. 모이는 속도가 빠르다.',
    good: '미래가 불안한 사람한테 잘 통한다. 예배 한 번에 결속이 빨리 붙는다.',
    bad: '정해 둔 날짜가 아무 일 없이 지나가면 동네 의심이 한꺼번에 오른다.',
    fits: '시험·취업 걱정 많은 20대',
    terms: { worship: '칠월 이레 준비 기도회', member: '깨어 있는 이', place: '대피소', special: '날짜 이야기' },
    sample: '마지막 장마회',
  },
  messiah: {
    family: ['christian'], name: '재림 교주형',
    pitch: '교주가 기다리던 그분이라고 스스로 말한다.',
    good: '예배 때 믿음이 크게 오른다. 한번 신도가 되면 잘 안 떠난다.',
    bad: '교단 얘기를 꺼낼 때 의심이 크게 오른다.',
    fits: '외로운 40~60대',
    terms: { worship: '다시 오신 날 모임', member: '곁사람', place: '거처', special: '교주의 손 잡기' },
    sample: '두 번째 문 공동체',
  },
  meditation: {
    family: ['buddhist'], name: '명상·수련 단체형',
    pitch: '종교 간판 없이 "마음공부" 모임으로 시작한다.',
    good: '종교가 없는 사람도 의심을 덜 한다.',
    bad: '방문자가 신도가 되기까지 오래 걸린다.',
    fits: '지친 직장인, 종교 없는 30대',
    terms: { worship: '저녁 마음자리', member: '벗님', place: '수련실', special: '호흡 같이 하기' },
    sample: '고요한 숨 연구회',
  },
  fortune: {
    family: ['buddhist'], name: '기복·천도형',
    pitch: '조상을 잘 모시면 복이 들어온다고 말한다.',
    good: '돈 걱정·집안 걱정에 강하다. 헌금이 많이 들어온다.',
    bad: '젊은 사람한테는 잘 안 통한다.',
    fits: '장사하는 중장년',
    terms: { worship: '복밭 기도', member: '복벗', place: '복당', special: '조상 얘기' },
    sample: '만복원',
  },
  shaman: {
    family: ['folk'], name: '신내림 점집 확장형',
    pitch: '상담으로 시작해서 단골을 모임으로 바꾼다.',
    good: '고민 들어주기가 아주 강하다. 상담비가 들어온다.',
    bad: '성소까지 오게 만드는 데 오래 걸린다.',
    fits: '앞날이 불안한 사람',
    terms: { worship: '큰 상담 날', member: '단골', place: '신당', special: '사주 봐 주기' },
    sample: '청솔 신명당',
  },
  qigong: {
    family: ['folk'], name: '기 수련·건강형',
    pitch: '몸이 낫는다고 약속하며 수련 모임을 연다.',
    good: '건강 걱정 많은 어르신한테 잘 통한다.',
    bad: '약사가 금방 알아챈다. 약사의 의심이 빨리 쌓인다.',
    fits: '60대 이상',
    terms: { worship: '기 모으는 밤', member: '수련생', place: '수련장', special: '손바닥 대 보기' },
    sample: '단전회',
  },
};

export const SECT_ORDER = ['doomsday', 'messiah', 'meditation', 'fortune', 'shaman', 'qigong'];
export const sectsOf = (family) => SECT_ORDER.filter((id) => SECTS[id].family.includes(family));
