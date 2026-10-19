import { UNITS } from '../config.js';

// 유닛 종류. 수치는 config.js의 UNITS, 실제 동작은 abilities.js.
// icon: 24×24 선 아이콘 (stroke)
export const UNIT_TYPES = {
  missionary: {
    name: '선교사',
    desc: `직접 사람들을 찾아가 전합니다. ${UNITS.missionary.uses}번 전파하면 임무를 마칩니다.`,
    actionLabel: '전파하기',
    icon: '<path d="M3.5 11.2 20 4l-7.2 16.5-2.3-7-7-2.3Z"/><path d="m10.5 13.5 4-4"/>',
  },
  relief: {
    name: '구호 활동가',
    desc: '봉사로 신뢰를 얻습니다. 전파는 약하지만 그 나라의 거부감을 낮춥니다.',
    actionLabel: '봉사하기',
    icon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  },
  theologian: {
    name: '신학자',
    desc: '머무는 나라와 육로로 이웃한 나라에 매달 꾸준히 영향을 줍니다. 섬나라에서는 바다 건너 이웃에 절반만큼.',
    actionLabel: null,
    icon: '<path d="M4 5.5C6.5 4.5 9.5 4.6 12 6.5c2.5-1.9 5.5-2 8-1v13c-2.5-1-5.5-.9-8 1-2.5-1.9-5.5-2-8-1v-13Z"/><path d="M12 6.5v13"/>',
  },
  guardian: {
    name: '수호자',
    desc: '신도 공동체를 지킵니다. 머무는 나라의 이탈을 크게 줄입니다. 신도가 많을수록 효과적입니다.',
    actionLabel: null,
    icon: '<path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-2.5Z"/>',
  },
  witness: {
    name: '간증자',
    desc: '극적인 체험을 공개 증언해 한 나라에 큰 파장을 일으킵니다. 한 번 쓰면 사라집니다.',
    actionLabel: '간증하기',
    icon: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/><path d="M19 16.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z"/>',
  },
};

export const UNIT_ORDER = ['missionary', 'relief', 'theologian', 'guardian', 'witness'];
