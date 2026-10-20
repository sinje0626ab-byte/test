import { UNITS } from '../config.js';

// 유닛 종류. 수치는 config.js의 UNITS, 실제 동작은 abilities.js.
// icon: 24×24 선 아이콘 (stroke)
export const UNIT_TYPES = {
  missionary: {
    name: '선교사',
    desc: `전단지 가방 메고 직접 찾아간다. ${UNITS.missionary.uses}번 나가면 지쳐서 돌아온다.`,
    actionLabel: '전단지 돌리기',
    icon: '<path d="M3.5 11.2 20 4l-7.2 16.5-2.3-7-7-2.3Z"/><path d="m10.5 13.5 4-4"/>',
  },
  relief: {
    name: '구호 활동가',
    desc: '고무장갑 끼고 연탄 나르고 설거지한다. 사람은 천천히 모이고, 동네 인심은 빨리 풀린다.',
    actionLabel: '봉사 가기',
    icon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  },
  theologian: {
    name: '신학자',
    desc: '두꺼운 책을 쓰고 강연을 다닌다. 머무는 나라와 국경 붙은 나라에 매달 조금씩. 섬나라면 바다 건너에 반만큼.',
    actionLabel: null,
    icon: '<path d="M4 5.5C6.5 4.5 9.5 4.6 12 6.5c2.5-1.9 5.5-2 8-1v13c-2.5-1-5.5-.9-8 1-2.5-1.9-5.5-2-8-1v-13Z"/><path d="M12 6.5v13"/>',
  },
  guardian: {
    name: '수호자',
    desc: '출석부를 들고 다니며 안 나온 사람한테 전화한다. 그 나라 이탈이 크게 준다. 신도가 많은 곳일수록 잘 듣는다.',
    actionLabel: null,
    icon: '<path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-2.5Z"/>',
  },
  witness: {
    name: '간증자',
    desc: '마이크 잡고 "제가 원래 어땠냐면요"로 시작한다. 한 나라가 크게 들썩이고, 한 번 하면 목이 쉬어서 끝이다.',
    actionLabel: '간증 무대',
    icon: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/><path d="M19 16.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z"/>',
  },
};

export const UNIT_ORDER = ['missionary', 'relief', 'theologian', 'guardian', 'witness'];
