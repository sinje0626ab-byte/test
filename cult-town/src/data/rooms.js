// 방 이름과 설명 (효과 숫자는 config.js ROOMS). 공부방 교리 이름은 유형마다 지어낸 것.
export const ROOM_NAMES = {
  worship: '예배실', counsel: '상담실', study: '공부방', kitchen: '주방·식당', dorm: '숙소', broadcast: '방송실', office: '사무실',
};
export const ROOM_ORDER = ['worship', 'counsel', 'study', 'kitchen', 'dorm', 'broadcast', 'office'];

export const ROOM_DESC = {
  worship: { what: '의자를 더 놓는다. 예배 자리↑', up: ['접이식 의자 열 개 더', '단상 높이고 의자 스무 개'] },
  counsel: { what: '방문 약속한 사람이 새신자로, 새신자가 신도로 더 쉽게. 초대 수락↑', up: ['칸막이와 휴지 상자', '소파와 작은 조명'], dark: '상담 내용을 노트에 적어 둔다' },
  study: { what: '신도 믿음이 매일 조금씩↑ 이탈↓', up: ['화이트보드와 교재 복사', '교재를 제본한다'] },
  kitchen: { what: '예배 뒤 밥. 결속↑ 신도가 지인을 더 데려온다', up: ['밥솥 두 개', '업소용 가스레인지'] },
  dorm: { what: '이탈이 크게↓ 대신 가족 항의·건물주 불만·평판 위험', up: ['이층 침대', '샤워 부스'], dark: '들어올 때 휴대폰을 맡긴다' },
  broadcast: { what: 'SNS 방송으로 동네 밖에서 사람이 온다. 노출↑ 평판↓', up: ['조명과 마이크', '편집용 컴퓨터'], dark: '"처음 왔어요" 후기를 신도가 찍는다' },
  office: { what: '헌금 관리. 헌금↑ (불만 많은 간부가 있으면 횡령 무대)', up: ['금고', '장부 프로그램'], dark: '장부를 두 권 쓴다' },
};

// 공부방 교리 이름 (유형마다)
export const STUDY_NAMES = {
  doomsday: '마지막 달력 읽기', messiah: '곁에 앉는 법', meditation: '숨 세기 교본', fortune: '복밭 가꾸기', shaman: '사주 노트 공부', qigong: '단전 일지',
};
